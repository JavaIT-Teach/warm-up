/* Warm Up on a phone: WORD PARTNERS (one student). Same content as the board (content/partners.js + teacher edits).
   1. The board: the core word and its partner tiles with gaps. The student types a partner ("make" or "make a decision");
      the phone checks it against every hidden tile. Hint = first letters. Show the rest = give up on this word.
   2. The trap: which one is right? (the trap "do a decision" against a real partner).
   3. USE IT: the student writes an answer to the question; the phone shows which board phrases it used.
   Shared logic (gaps, phrase list) comes from the board game: WU.engines.partners. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone;
  function esc(s) { return WU.esc(s); }

  P.games.partners = (function () {
    var body, ctx, st, E, deck = WU.kit.deck(), bar = null, barEl = null;
    function words() { return WU.list('partners', 'words', ctx.level).filter(function (w) { return w.word && E.phrases(w).length; }); }
    function gapText(w, p) { return E.tokens(p.text, w.word).filter(function (t) { return t.gap; }).map(function (t) { return t.t; }).join(' '); }
    // How many phrases the USE IT task asks for: the first number in its text (1-3), else 2.
    function need() { var m = /\d/.exec(ctx.S.useRule || ''); return Math.max(1, Math.min(st.list.length, m ? +m[0] : 2)); }

    function next() {
      var all = words(); if (!all.length) { ctx.empty(); return; }
      var w = deck(all);
      st = { w: w, list: E.phrases(w), found: [], phase: 'board', letters: !!ctx.S.letters, typed: '', msg: null, misses: 0, answer: '', used: null };
      render(true);
      // One timer for the whole word (Screen text & timing: seconds). Time up = see what you missed.
      var sec = Math.max(0, Math.min(600, +ctx.S.seconds || 0));
      if (bar && sec) bar.start(sec, function () { if (st && st.phase === 'board') { P.toast('Time!'); finish(); } });
    }
    function stem(x) { return x.length >= 5 ? x.slice(0, x.length - 2) : x; }
    function hasWord(words, x) { var s = stem(x); return words.some(function (t) { return t.indexOf(s) === 0; }); }
    // Phrases of the board used in a written answer (every word of the phrase is there, word endings may change).
    function usedIn(text) {
      var words = P.norm(text).split(' ');
      return st.list.filter(function (p) {
        return P.norm(E.plain(p.text)).split(' ').filter(function (x) { return x && x !== 'a' && x !== 'an' && x !== 'the'; }).every(function (x) { return hasWord(words, x); });
      });
    }

    function tile(p, i) {
      var got = st.found.indexOf(p.k) >= 0, open = got || st.phase !== 'board';
      var h = E.tokens(p.text, st.w.word).map(function (t) {
        if (!t.gap) return '<span>' + esc(t.t) + '</span>';
        if (open) return '<em>' + esc(t.t) + '</em>';
        var n = t.t.replace(/[^A-Za-z]/g, '').length || 1;
        return '<i style="width:' + (0.5 * n + 0.6).toFixed(1) + 'em">' + (st.letters ? esc(t.t.charAt(0)) : '') + '</i>';
      }).join(' ');
      return '<div class="wpt' + (got ? ' got' : open ? ' miss' : '') + '"><b>' + (i + 1) + '</b>' + (p.pic ? '<span class="wpic">' + WU.pic(p.pic) + '</span>' : '') + '<span class="wptx">' + h + '</span></div>';
    }

    function render(focus) {
      var S = ctx.S, w = st.w, h = '';
      if (st.phase === 'use') {
        h += '<div class="prow"><span class="ptag" style="background:var(--pink)">' + esc(S.useLabel) + '</span><span class="pcount">' + esc(w.word.toUpperCase()) + '</span></div>' +
          '<div class="pcard2"><div class="pqtext">' + esc(w.question) + '</div></div>' +
          '<p class="pnote">' + esc(S.useRule) + ' Write it, then say it out loud.</p>' +
          '<textarea class="pinput big" rows="4" autocapitalize="sentences" autocomplete="off" spellcheck="false" placeholder="Your answer">' + esc(st.answer) + '</textarea>' +
          '<div class="wpchips">' + st.list.map(function (p) {
            var on = st.used && st.used.indexOf(p) >= 0;
            return '<span class="wpchip' + (on ? ' on' : '') + '">' + esc(E.plain(p.text)) + '</span>';
          }).join('') + '</div><div class="pafter">' + (st.used ? usedMsg() : '') + '</div>';
        body.innerHTML = h;
        var ta = body.querySelector('textarea'); ta.oninput = function () { st.answer = ta.value; };
        ctx.actions(st.used ? [{ label: 'Edit', alt: true, on: function () { st.used = null; render(); } }, { label: 'Next word', on: next }]
          : [{ label: 'Skip', alt: true, small: true, on: next }, { label: 'Check my answer', on: checkUse }]);
        return;
      }
      h += (st.phase === 'board' && +ctx.S.seconds > 0 ? '<div class="pbarwrap"></div>' : '') + '<div class="wpcorep">' + esc(w.word) + '</div>';
      var tiles = '<div class="prow"><span class="pcount" style="margin-left:0">' + esc(S.found) + ' <b>' + st.found.length + ' / ' + st.list.length + '</b></span></div>' +
        '<div class="wptiles">' + st.list.map(tile).join('') + '</div>';
      if (st.phase === 'board') {
        // The answer box goes right under the word, so it stays above the phone keyboard.
        h += '<form class="prow2 wpform" autocomplete="off"><input class="pinput" type="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Type a partner" value="' + esc(st.typed) + '">' +
          '<button class="pbtn" type="submit">Check</button></form>' +
          (st.msg ? '<div class="pbanner ' + st.msg.cls + '">' + esc(st.msg.text) + '</div>' : '<p class="pnote">' + esc(S.rule) + '</p>') + tiles;
        body.innerHTML = h;
        var bw = body.querySelector('.pbarwrap'); if (bw && barEl) bw.appendChild(barEl);
        var f = body.querySelector('form'), inp = f.querySelector('input');
        inp.oninput = function () { st.typed = inp.value; };
        f.onsubmit = function (e) { e.preventDefault(); check(); };
        if (focus !== false) setTimeout(function () { if (inp.isConnected) inp.focus(); }, 30);
        ctx.actions([{ label: st.letters ? 'Letters on' : 'Hint: letters', alt: true, small: true, disabled: st.letters, on: function () { st.letters = true; render(); } },
          { label: 'Show the rest', alt: true, on: reveal }]);
        return;
      }
      // done: the rest is open, then the trap question.
      var all = st.found.length === st.list.length;
      h += tiles;
      h += '<div class="pbanner ' + (all ? 'ok' : 'no') + '">' + esc(all ? S.allFound : 'Here are the rest. Learn the blue ones!') + '</div>';
      if (w.trap && st.trapOpts) h += '<div class="pq">Which one is right?</div><div class="wptrapq"></div>';
      body.innerHTML = h;
      var goUse = function () { if (w.question) { st.phase = 'use'; render(); } else next(); };
      if (w.trap && st.trapOpts && !st.trapDone) {
        ctx.actions([]);
        var el = body.querySelector('.wptrapq'), picked = false;
        el.innerHTML = '<div class="pchoices">' + st.trapOpts.map(function (o, i) { return '<button class="pchoice" data-o="' + i + '">' + esc(o.text) + '</button>'; }).join('') + '</div>';
        el.querySelectorAll('[data-o]').forEach(function (b) {
          b.onclick = function () {
            if (picked) return; picked = true;
            var o = st.trapOpts[+b.getAttribute('data-o')]; st.trapDone = true;
            el.querySelectorAll('[data-o]').forEach(function (x) { var oo = st.trapOpts[+x.getAttribute('data-o')]; x.classList.add(oo.ok ? 'ok' : 'no'); });
            ctx.score(o.ok); P.stamp(o.ok, o.ok ? 'RIGHT!' : 'TRAP!');
            el.insertAdjacentHTML('beforeend', '<p class="pnote">' + esc(S.trapLabel) + ': <s>' + esc(w.trap) + '</s> · ' + esc(S.trapNote) + '</p>');
            ctx.actions([{ label: w.question ? 'USE IT!' : 'Next word', on: goUse }]);
          };
        });
      } else ctx.actions([{ label: w.question ? 'USE IT!' : 'Next word', on: goUse }]);
    }
    function usedMsg() {
      var n = st.used.length, k = need(), ok = n >= k;
      return '<div class="pbanner ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'Great! You used ' + n + ' phrase' + (n === 1 ? '' : 's') + '.' :
        'You used ' + n + ' of ' + k + '. Use the phrases like on the board, then check again.') + '</div>';
    }
    function checkUse() {
      if (!P.norm(st.answer)) { P.toast('Write your answer first.'); return; }
      st.used = usedIn(st.answer); var ok = st.used.length >= need();
      ctx.score(ok); P.stamp(ok, ok ? 'GREAT!' : 'MORE PHRASES'); render();
    }
    function check() {
      var n = P.norm(st.typed); if (!n) return;
      var w = st.w, hit = null, again = false;
      st.list.forEach(function (p) {
        if (hit) return;
        var g = P.norm(gapText(w, p)), full = P.norm(E.plain(p.text));
        if (n === g || n === full) { if (st.found.indexOf(p.k) >= 0) again = true; else hit = p; }
      });
      if (hit) {
        st.found.push(hit.k); st.typed = ''; st.msg = { cls: 'ok', text: ctx.S.hit || 'YES!' }; WU.sound.ding();
        if (st.found.length === st.list.length) { finish(); return; }
      } else if (again) { st.msg = { cls: 'no', text: 'You found that one already.' }; WU.sound.clack(); }
      else { st.misses++; st.msg = { cls: 'no', text: '“' + st.typed + '” is not on the board. Try again!' }; WU.sound.buzzer(); }
      render();
    }
    function reveal() { finish(); }
    function finish() {
      var w = st.w; if (bar) bar.stop();
      st.list.forEach(function (p) { ctx.score(st.found.indexOf(p.k) >= 0); });
      st.phase = 'done'; st.msg = null;
      if (w.trap) st.trapOpts = WU.shuffle([{ text: w.trap, ok: false }, { text: E.plain(st.list[0].text), ok: true }]);
      if (st.found.length === st.list.length) WU.sound.ding(); else WU.sound.clack();
      render();
    }
    return {
      mount: function (b, c) {
        body = b; ctx = c; E = WU.engines && WU.engines.partners; if (!E) { ctx.empty(); return; }
        barEl = document.createElement('div'); bar = P.bar(barEl); next();
      },
      unmount: function () { if (bar) bar.stop(); bar = barEl = null; body = ctx = st = null; }
    };
  })();
})();
