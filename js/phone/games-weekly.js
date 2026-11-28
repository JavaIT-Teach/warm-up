/* Warm Up on a phone: Story Shuffle, Lost Vowels, Mistake Detective and Clue by Clue (weekly games, see js/phone/shell.js).
   Content and screen texts come from the board games through the edit layer (WU.list), so teacher edits show here too. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;

  /* ======================= STORY SHUFFLE ======================= */
  // The lines come shuffled. Tap them in the right order; Check marks each place right or wrong, then the question.
  P.games.shuffle = (function () {
    var body, ctx, st, deck = WU.kit.deck(), LET = 'ABCDEF';
    function linesOf(t) {
      var o = []; for (var k = 1; k <= 6; k++) { var s = String(t['l' + k] || '').trim(); if (s) o.push({ text: s, i: o.length }); }
      return o;
    }
    function pool() { return WU.list('shuffle', 'texts', ctx.level).filter(function (t) { return linesOf(t).length >= 3; }); }
    function mix(n) {
      var base = [], p, tries = 0; for (var j = 0; j < n; j++) base.push(j);
      do { p = WU.shuffle(base.slice()); tries++; } while (tries < 40 && p.join() === base.join());
      return p;
    }
    function newText() {
      var t = deck(pool()); if (!t) { ctx.empty(); return; }
      var ls = linesOf(t);
      st = { t: t, ls: ls, perm: mix(ls.length), picked: [], phase: 'pick' }; render();
    }
    function render() {
      var S = ctx.S, t = st.t, n = st.ls.length, h = '';
      h += '<div class="prow">' + (t.unit && S.unitShow ? '<span class="ptag" style="background:#3d6bff;color:#fff">' + esc(t.unit) + '</span>' : '') + '</div>';
      if (t.title) h += '<div class="pbig">' + esc(t.title) + '</div>';
      if (st.phase === 'pick') {
        h += '<p class="pnote">Tap the lines in the right order.</p><div class="shp-list">';
        st.perm.forEach(function (li, pos) {
          var k = st.picked.indexOf(li);
          h += '<button class="shp-line' + (k >= 0 ? ' on' : '') + '" data-li="' + li + '"><b>' + (k >= 0 ? k + 1 : LET.charAt(pos)) + '</b><span>' + esc(st.ls[li].text) + '</span></button>';
        });
        h += '</div>';
      } else {
        var ok = 0;
        h += '<div class="shp-list">';
        st.picked.forEach(function (li, k) {
          var right = li === k; if (right) ok++;
          h += '<div class="shp-line ' + (right ? 'ok' : 'no') + '"><b>' + (k + 1) + '</b><span>' + esc(st.ls[li].text) + (right ? '' : '<em>Line ' + (k + 1) + ': ' + esc(st.ls[k].text) + '</em>') + '</span></div>';
        });
        h += '</div><div class="pbanner ' + (ok === n ? 'ok' : 'no') + '">' + (ok === n ? 'PERFECT ORDER!' : ok + ' of ' + n + ' lines in the right place') + '</div>';
        if (t.q) h += '<div class="pcard2"><div><div class="plabel">' + esc(S.qLabel || 'QUESTION') + '</div><div class="pnote big" style="text-align:left">' + esc(t.q) + '</div>' +
          (st.showA && t.a ? '<p class="pnote" style="text-align:left;margin-top:8px">' + esc(t.a) + '</p>' : '') + '</div></div>';
      }
      body.innerHTML = h;
      body.querySelectorAll('button.shp-line').forEach(function (b) {
        b.onclick = function () {
          var li = +b.getAttribute('data-li'), k = st.picked.indexOf(li);
          if (k >= 0) st.picked.splice(k, 1); else st.picked.push(li);
          WU.sound.pop(); render();
        };
      });
      var acts;
      if (st.phase === 'pick') acts = [{ label: 'Start again', alt: true, small: true, disabled: !st.picked.length, on: function () { st.picked = []; render(); } },
        { label: 'Check', disabled: st.picked.length < n, on: function () {
          var all = st.picked.every(function (li, k) { return li === k; });
          st.phase = 'check'; ctx.score(all); render(); if (all) WU.sound.ding(); else WU.sound.beep(300);
        } }];
      else acts = (t.q && t.a && !st.showA ? [{ label: 'Answer', alt: true, small: true, on: function () { st.showA = true; render(); } }] : []).concat([{ label: 'Next text', on: newText }]);
      ctx.actions(acts);
    }
    return { mount: function (b, c) { body = b; ctx = c; newText(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= LOST VOWELS ======================= */
  // One word at a time: the word without its vowels (and its clue / picture). Type the whole word, Check.
  P.games.vowels = (function () {
    var body, ctx, st, deck = WU.kit.deck(), VOW = /[aeiou]/i;
    function pool() { return WU.list('vowels', 'words', ctx.level).filter(function (x) { return x.word && VOW.test(x.word) && /[^aeiou\s]/i.test(x.word); }); }
    function skeleton(w, back) {
      return String(w).split(/\s+/).filter(Boolean).map(function (part) {
        return '<span style="white-space:nowrap">' + part.split('').map(function (c) {
          if (VOW.test(c)) return back ? '<span class="lvp-v">' + esc(c) + '</span>' : '<span class="lvp-gap"></span>';
          return esc(c);
        }).join('') + '</span>';
      }).join(' ');
    }
    function newWord() {
      var w = deck(pool()); if (!w) { ctx.empty(); return; }
      st = { w: w, typed: '', phase: 'write' }; render();
    }
    function render() {
      var S = ctx.S, w = st.w, h = '', back = st.phase === 'check';
      h += '<div class="pcard2' + (back && st.ok ? ' lit' : '') + '">' + (S.pics && w.pic ? '<div class="ppic">' + WU.pic(w.pic) + '</div>' : '') +
        '<div><div class="lvp-word">' + skeleton(w.word, back) + '</div>' + (S.clues && w.clue ? '<p class="pnote" style="text-align:left">' + esc(w.clue) + '</p>' : '') + '</div></div>';
      if (!back) h += '<p class="pnote big">' + 'Put the vowels back. Type the whole word.' + '</p>' +
        '<input class="pinput big" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the whole word" value="' + esc(st.typed) + '">';
      else h += '<div class="pbanner ' + (st.ok ? 'ok' : 'no') + '">' + (st.ok ? 'PERFECT SPELLING!' : 'Not quite. You wrote: ' + esc(st.typed || '...')) + '</div>';
      body.innerHTML = h;
      var inp = body.querySelector('input');
      function check() {
        st.ok = P.norm(st.typed) === P.norm(w.word); st.phase = 'check'; ctx.score(st.ok); render();
        if (st.ok) WU.sound.ding(); else WU.sound.beep(300);
      }
      if (inp) {
        inp.oninput = function () { st.typed = inp.value; };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); st.typed = inp.value; check(); } };
        setTimeout(function () { inp.focus(); }, 50);
      }
      ctx.actions(back ? [{ label: 'Next word', on: newWord }] : [{ label: 'Skip', alt: true, small: true, on: function () { st.typed = ''; check(); } }, { label: 'Check', on: check }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; newWord(); }, unmount: function () { body = ctx = st = null; } };
  })();
  /* ======================= MISTAKE DETECTIVE ======================= */
  // The text with its mistakes. Tap the lines that have a mistake (the number is given), Check: right lines,
  // wrong lines and missed ones, each mistake with its correction.
  P.games.detective = (function () {
    var body, ctx, st, deck = WU.kit.deck(), E = function () { return WU.engines.detective; };
    function pool() { return WU.list('detective', 'texts', ctx.level).filter(function (t) { var ls = E().linesOf(t); return ls.length >= 2 && E().mistakes(ls).length; }); }
    function newText() {
      var t = deck(pool()); if (!t) { ctx.empty(); return; }
      var ls = E().linesOf(t);
      st = { t: t, ls: ls, n: E().mistakes(ls).length, picked: [], phase: 'pick' }; render();
    }
    function render() {
      var S = ctx.S, t = st.t, h = '';
      h += '<div class="prow">' + (t.unit && S.unitShow ? '<span class="ptag" style="background:#ff3b3b;color:#fff">' + esc(t.unit) + '</span>' : '') + '</div>';
      if (t.title) h += '<div class="pbig">' + esc(t.title) + '</div>';
      if (st.phase === 'pick') {
        h += '<p class="pnote big">Find ' + st.n + ' mistake' + (st.n > 1 ? 's' : '') + '. Tap the lines with a mistake.</p><div class="shp-list">';
        st.ls.forEach(function (l) {
          var on = st.picked.indexOf(l.i) >= 0;
          h += '<button class="shp-line' + (on ? ' on' : '') + '" data-li="' + l.i + '"><b>' + (l.i + 1) + '</b><span>' + E().lineHtml(l, false) + '</span></button>';
        });
        h += '</div>';
      } else {
        var ok = 0;
        h += '<div class="shp-list mdp">';
        st.ls.forEach(function (l) {
          var on = st.picked.indexOf(l.i) >= 0, has = l.fixes.length > 0, cls = '';
          if (on && has) { cls = 'ok'; ok++; } else if (on || has) cls = 'no';
          h += '<div class="shp-line ' + cls + '"><b>' + (l.i + 1) + '</b><span>' + E().lineHtml(l, has) +
            (on && !has ? '<em>No mistake in this line.</em>' : '') + (!on && has ? '<em>You missed this one.</em>' : '') + '</span></div>';
        });
        var perfect = ok === st.n && st.picked.length === st.n;
        h += '</div><div class="pbanner ' + (perfect ? 'ok' : 'no') + '">' + (perfect ? 'CASE CLOSED! ALL FOUND!' : ok + ' of ' + st.n + ' mistakes found') + '</div>' +
          '<p class="pnote">Now write the right text in your notebook.</p>';
      }
      body.innerHTML = h;
      body.querySelectorAll('button.shp-line').forEach(function (b) {
        b.onclick = function () {
          var li = +b.getAttribute('data-li'), k = st.picked.indexOf(li);
          if (k >= 0) st.picked.splice(k, 1); else if (st.picked.length < st.n) st.picked.push(li); else { P.toast('Only ' + st.n + '! Tap a line again to take it back.'); return; }
          WU.sound.pop(); render();
        };
      });
      var acts;
      if (st.phase === 'pick') acts = [{ label: 'Check', disabled: st.picked.length < st.n, on: function () {
        var all = st.picked.every(function (li) { return st.ls[li].fixes.length; });
        st.phase = 'check'; ctx.score(all); render(); if (all) WU.sound.ding(); else WU.sound.beep(300);
      } }];
      else acts = [{ label: 'Next text', on: newText }];
      ctx.actions(acts);
    }
    return { mount: function (b, c) { body = b; ctx = c; newText(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= CLUE BY CLUE ======================= */
  // The clues come one by one. Type the word: right = the points still on the card; wrong = the next clue.
  P.games.clues = (function () {
    var body, ctx, st, deck = WU.kit.deck(), E = function () { return WU.engines.clues; };
    function pool() { return WU.list('clues', 'cards', ctx.level).filter(function (c) { return c.word && E().cluesOf(c).length >= 2; }); }
    function bare(s) { return P.norm(s).replace(/^(a|an|the) /, ''); }
    function newCard() {
      var c = deck(pool()); if (!c) { ctx.empty(); return; }
      st = { c: c, cs: E().cluesOf(c), k: 1, typed: '', phase: 'guess', won: 0 }; render();
    }
    function render() {
      var S = ctx.S, c = st.c, n = st.cs.length, h = '', done = st.phase === 'done';
      var pts = done ? st.won : Math.max(1, n - st.k + 1);
      h += '<div class="prow">' + (c.unit && S.unitShow ? '<span class="ptag" style="background:#ffe600">' + esc(c.unit) + '</span>' : '') +
        '<span class="ptag" style="background:#0d0d0d;color:#ffe600">' + pts + ' ' + esc(S.pts || 'POINTS') + '</span></div>';
      h += '<div class="shp-list">';
      st.cs.forEach(function (cl, ix) {
        if (!done && ix >= st.k) return;
        h += '<div class="shp-line' + (!done && ix === st.k - 1 ? ' on' : '') + '"><b>' + (ix + 1) + '</b><span>' + esc(cl.text) + '</span></div>';
      });
      h += '</div>';
      if (!done) h += '<p class="pnote big">' + esc(S.task || 'What is it?') + '</p>' +
        '<input class="pinput big" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the word" value="' + esc(st.typed) + '">';
      else h += '<div class="pcard2 lit">' + (S.pics && c.pic && WU.PICS[c.pic] ? '<div class="ppic">' + WU.pic(c.pic) + '</div>' : '') +
        '<div class="pbig">' + esc(c.word) + '</div></div>' +
        '<div class="pbanner ' + (st.won ? 'ok' : 'no') + '">' + (st.won ? esc(S.got || 'GOT IT!') + ' +' + st.won : esc(S.nobody || 'The answer is...') + (st.typed ? ' You wrote: ' + esc(st.typed) : '')) + '</div>';
      body.innerHTML = h;
      var inp = body.querySelector('input');
      function more() {
        if (st.k < n) { st.k++; WU.sound.pop(); render(); } else { st.phase = 'done'; ctx.score(false); WU.sound.beep(300); render(); }
      }
      function check() {
        if (!P.norm(st.typed)) { more(); return; }
        if (bare(st.typed) === bare(c.word)) { st.won = Math.max(1, n - st.k + 1); st.phase = 'done'; ctx.score(true); WU.sound.ding(); render(); }
        else { P.toast('Not yet! Here is another clue.'); st.typed = ''; more(); }
      }
      if (inp) {
        inp.oninput = function () { st.typed = inp.value; };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); st.typed = inp.value; check(); } };
        setTimeout(function () { inp.focus(); }, 50);
      }
      ctx.actions(done ? [{ label: 'Next word', on: newCard }] : [{ label: st.k < n ? 'Next clue' : 'Show it', alt: true, small: true, on: function () { st.typed = ''; more(); } }, { label: 'Check', on: check }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; newCard(); }, unmount: function () { body = ctx = st = null; } };
  })();
})();
