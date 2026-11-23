/* Warm Up on a phone: Sentence Train (see js/phone/shell.js and js/games/sentence.js).
   Tap the mixed chunks in the right order; they fill the carriages. Check marks each carriage right or wrong and shows
   the job of every chunk (SUBJECT + VERB + OBJECT...) and the rule. Then the twist: type the new sentence and check it
   (open twists show an example). Content and screen texts come from the board game (WU.list, WU.engines.sentence). */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;

  // Forgiving compare for typed sentences: case, punctuation and contractions do not count.
  function canon(s) {
    return P.norm(s)
      // Typed without the apostrophe: dont, didnt, isnt, wont, cant, im, youre, ive...
      .replace(/\b(do|does|did|is|are|was|were|have|has|had|could|should|would|must|need)nt\b/g, "$1n't")
      .replace(/\bwont\b/g, "won't").replace(/\bcant\b/g, "can't").replace(/\bim\b/g, "i'm")
      .replace(/\b(you|they)re\b/g, "$1're").replace(/\b(i|you|we|they)ve\b/g, "$1've")
      .replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'can not').replace(/\bcannot\b/g, 'can not')
      .replace(/\bshan't\b/g, 'shall not').replace(/n't\b/g, ' not').replace(/'m\b/g, ' am').replace(/'re\b/g, ' are')
      .replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will').replace(/\s+/g, ' ').trim();
  }

  P.games.sentence = (function () {
    var body, ctx, st, E, deck = WU.kit.deck();
    function pool() { return WU.list('sentence', 'items', ctx.level).filter(function (t) { return E.parse(t).chunks.length >= 2; }); }
    function twistOf(t) { return t && t.tk && E.TWIST[t.tk] ? t.tk : ''; }
    function newItem() {
      var t = deck(pool()); if (!t) { ctx.empty(); return; }
      var P0 = E.parse(t);
      st = { t: t, cs: P0.chunks, end: P0.end, perm: E.mix(P0.chunks), slots: [], phase: 'build', labels: !!ctx.S.slotLabels, typed: '' };
      render();
    }
    function same(a, b) { return st.cs[a].tile.toLowerCase() === st.cs[b].tile.toLowerCase(); }
    function chip(text, bg) { return '<span class="ptag" style="background:' + bg + ';color:' + E.ink(bg) + '">' + esc(text) + '</span>'; }
    function render() {
      var S = ctx.S, t = st.t, cs = st.cs, n = cs.length, ph = st.phase, h = '', tw = twistOf(t);
      var kk = E.KIND[t.k] || 'kPos', kbg = E.KIND_BG[t.k] || '#c6ff00';
      h += '<div class="prow">' + (S[kk] ? chip(S[kk], kbg) : '') + '</div>';
      // The train.
      h += '<div class="stp-rail">';
      cs.forEach(function (c, j) {
        var r = E.roleOf(c.role), idx = st.slots[j], filled = idx != null, mark = '';
        var lab = ph !== 'build' || st.labels;
        if (ph !== 'build') mark = same(idx, j) ? ' ok' : ' no';
        h += '<button class="stp-car' + (filled ? ' on' : '') + mark + '" data-slot="' + j + '"' + (lab ? ' style="--rc:' + r.color + ';--ri:' + E.ink(r.color) + '"' : '') + (ph !== 'build' ? ' disabled' : '') + '>' +
          '<span class="stp-ct">' + (filled ? esc(ph === 'build' ? cs[idx].tile : cs[idx].text) : (j + 1)) + '</span>' +
          '<span class="stp-cr' + (lab ? '' : ' off') + '">' + esc(lab ? r.name : '?') + '</span></button>';
      });
      if (st.end) h += '<span class="stp-end">' + esc(st.end) + '</span>';
      h += '</div>';
      if (ph === 'build') {
        h += '<p class="pnote">' + esc(S.task || 'Put the words in order.') + '</p><div class="stp-tiles">';
        st.perm.forEach(function (ci) {
          if (st.slots.indexOf(ci) >= 0) return;
          h += '<button class="stp-tile" data-ci="' + ci + '">' + esc(cs[ci].tile) + '</button>';
        });
        h += '</div>';
        if (S.ruleShow && S.rule) h += '<p class="pnote" style="opacity:.75">' + esc(S.rule) + '</p>';
      } else {
        var ok = 0; st.slots.forEach(function (idx, j) { if (same(idx, j)) ok++; });
        h += '<div class="pbanner ' + (ok === n ? 'ok' : 'no') + '">' + (ok === n ? 'PERFECT ORDER!' : ok + ' of ' + n + ' carriages right') + '</div>';
        h += '<div class="pcard2"><div><div class="plabel">' + esc(ok === n ? (S.patLabel || 'PATTERN') : 'RIGHT ORDER') + '</div>' +
          '<div class="pnote big" style="text-align:left">' + esc(cs.map(function (c) { return c.text; }).join(' ') + st.end) + '</div>' +
          '<div class="stp-pat">' + E.pattern(cs).map(function (r) { return chip(r.name, r.color); }).join('<i>+</i>') + '</div>' +
          (t.why ? '<p class="pnote" style="text-align:left;margin-top:8px"><b>' + esc(S.whyLabel || 'WHY?') + '</b> ' + esc(t.why) + '</p>' : '') + '</div></div>';
        if (ph === 'twist' || ph === 'twisted') {
          var open = E.OPEN_TWISTS.indexOf(tw) >= 0, as = E.answers(t.ta);
          h += '<div class="pcard2"><div style="width:100%"><div class="plabel">' + esc(S[E.TWIST[tw]] || 'TWIST') + '</div>' +
            (t.th ? '<p class="pnote" style="text-align:left">' + esc(t.th) + '</p>' : '');
          if (ph === 'twist') h += '<input class="pinput big" type="text" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Type your sentence" value="' + esc(st.typed) + '">';
          else {
            if (st.typed) h += '<p class="pnote" style="text-align:left">You wrote: <b>' + esc(st.typed) + '</b></p>';
            if (!open) h += '<div class="pbanner ' + (st.tok ? 'ok' : 'no') + '">' + (st.tok ? 'RIGHT!' : 'Not quite.') + '</div>';
            if (as.length) h += '<p class="pnote" style="text-align:left;margin-top:8px"><b>' + esc(open ? (S.exLabel || 'EXAMPLE') : 'ANSWER') + ':</b> ' + esc(as[0]) + '</p>';
          }
          h += '</div></div>';
        }
      }
      body.innerHTML = h;

      body.querySelectorAll('.stp-tile').forEach(function (b) {
        b.onclick = function () {
          var ci = +b.getAttribute('data-ci'), j = 0;
          while (st.slots[j] != null) j++;
          if (j < n) { st.slots[j] = ci; WU.sound.pop(); render(); }
        };
      });
      if (ph === 'build') body.querySelectorAll('.stp-car.on').forEach(function (b) {
        b.onclick = function () { st.slots[+b.getAttribute('data-slot')] = null; WU.sound.clack(); render(); };
      });
      var inp = body.querySelector('input');
      function checkTwist() {
        var open = E.OPEN_TWISTS.indexOf(tw) >= 0;
        st.typed = inp ? inp.value.trim() : st.typed;
        if (!open) {
          var mine = canon(st.typed);
          st.tok = !!mine && E.answers(t.ta).some(function (a) { return canon(a) === mine; });
          ctx.score(st.tok); if (st.tok) WU.sound.ding(); else WU.sound.beep(300);
        }
        st.phase = 'twisted'; render();
      }
      if (inp) {
        inp.oninput = function () { st.typed = inp.value; };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); checkTwist(); } };
        setTimeout(function () { inp.focus(); }, 50);
      }

      var filledAll = st.slots.filter(function (x) { return x != null; }).length === n, acts;
      if (ph === 'build') acts = [
        { label: st.labels ? 'Hide jobs' : 'Show jobs', alt: true, small: true, on: function () { st.labels = !st.labels; render(); } },
        { label: 'Start again', alt: true, small: true, disabled: !st.slots.some(function (x) { return x != null; }), on: function () { st.slots = []; render(); } },
        { label: 'Check', disabled: !filledAll, on: function () {
          var all = st.slots.every(function (idx, j) { return same(idx, j); });
          st.phase = 'check'; ctx.score(all); if (all) WU.sound.ding(); else WU.sound.beep(300); render();
        } }];
      else if (ph === 'check' && tw) acts = [{ label: 'Next sentence', alt: true, small: true, on: newItem }, { label: 'Twist!', on: function () { st.phase = 'twist'; render(); } }];
      else if (ph === 'twist') acts = [{ label: 'Skip', alt: true, small: true, on: function () { if (inp) inp.value = ''; st.typed = ''; checkTwist(); } },
        { label: E.OPEN_TWISTS.indexOf(tw) >= 0 ? 'Show example' : 'Check', on: checkTwist }];
      else acts = [{ label: 'Next sentence', on: newItem }];
      ctx.actions(acts);
      if (ph === 'twist' || ph === 'twisted') { var last = body.lastElementChild; if (last && last.scrollIntoView) last.scrollIntoView({ block: 'nearest' }); }
    }
    return {
      mount: function (b, c) { body = b; ctx = c; E = WU.engines && WU.engines.sentence; if (!E) { ctx.empty(); return; } newItem(); },
      unmount: function () { body = ctx = st = null; }
    };
  })();
})();
