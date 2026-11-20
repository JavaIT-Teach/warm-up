/* Warm Up on a phone: Word Hunt, Vanishing Sentence, Word Chain, Verb Volcano (see js/phone/shell.js).
   Content and screen texts come from the board games through the edit layer (WU.list), so teacher edits show here too. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;
  var LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var COLS = ['#c6ff00', '#ff4fc3', '#00e5c7', '#ffe600', '#ff9a1f', '#8fdcff', '#b48cff', '#7dff9b', '#ffb6de', '#f2c26b'];
  function letters(w) { return String(w || '').toUpperCase().replace(/[^A-Z]/g, ''); }

  /* ======================= WORD HUNT ======================= */
  P.games.hunt = (function () {
    var body, ctx, st;
    var huntDeck = WU.kit.deck(), setDeck = WU.kit.deck();
    function sets() { return WU.list('hunt', 'sets', ctx.level).filter(function (s) { return wordsOf(s.id).length; }); }
    function wordsOf(sid) { return WU.list('hunt', 'words', ctx.level).filter(function (w) { return w.set === sid && letters(w.word).length >= 2; }); }
    // Phone width: never more than 12 letters a row.
    function size() { return Math.max(8, Math.min(12, Math.round(+ctx.S.size || 10))); }
    function build() {
      var n = size(), dirs = [[0, 1], [1, 0]], grid = [], i, placed = [];
      if (ctx.S.diag) dirs.push([1, 1]);
      for (i = 0; i < n * n; i++) grid.push('');
      var max = Math.max(3, Math.min(10, Math.round(+ctx.S.max || 8)));
      var pool = wordsOf(st.set).filter(function (w) { return letters(w.word).length <= n; });
      WU.kit.drawN(huntDeck, pool, max).sort(function (a, b) { return letters(b.word).length - letters(a.word).length; }).forEach(function (w) {
        var L = letters(w.word);
        for (var t = 0; t < 400; t++) {
          var d = dirs[WU.rand(dirs.length)], r0 = WU.rand(n - d[0] * (L.length - 1)), c0 = WU.rand(n - d[1] * (L.length - 1)), ok = true, cells = [];
          for (var k = 0; k < L.length; k++) {
            var idx = (r0 + d[0] * k) * n + (c0 + d[1] * k);
            if (grid[idx] && grid[idx] !== L[k]) { ok = false; break; }
            cells.push(idx);
          }
          if (ok && cells.every(function (x) { return grid[x]; })) ok = false;
          if (!ok) continue;
          cells.forEach(function (x, k) { grid[x] = L[k]; });
          placed.push({ w: w, cells: cells }); return;
        }
      });
      for (i = 0; i < n * n; i++) if (!grid[i]) grid[i] = LET[WU.rand(26)];
      var order = wordsOf(st.set).map(function (w) { return w.id; });
      placed.sort(function (a, b) { return order.indexOf(a.w.id) - order.indexOf(b.w.id); });
      st.n = n; st.grid = grid; st.placed = placed; st.found = {}; st.a = null; st.shown = false; st.hints = 0;
    }
    function next(nextSet) {
      var ss = sets(); if (!ss.length) { ctx.empty(); return false; }
      var i = ss.map(function (s) { return s.id; }).indexOf(st.set);
      if (nextSet || i < 0) { var others = ss.filter(function (s) { return s.id !== st.set; }); st.set = setDeck(others.length ? others : ss).id; }
      build(); render(); return true;
    }
    function foundN() { return st.placed.filter(function (p) { return st.found[p.w.id]; }).length; }
    function setName() { var s = WU.list('hunt', 'sets', ctx.level).filter(function (x) { return x.id === st.set; })[0]; return s ? s.name : ''; }
    function clueText(w) {
      var c = String(w.clue || ''), L = letters(w.word).length;
      return (/___/.test(c) ? c.replace(/___/g, '____') : c) + (ctx.S.lenShow ? ' (' + L + ')' : '');
    }
    function render() {
      var S = ctx.S, n = st.n, lit = {}, all = foundN() === st.placed.length, h = '';
      st.placed.forEach(function (p, i) { if (st.found[p.w.id]) p.cells.forEach(function (c) { lit[c] = COLS[i % COLS.length]; }); });
      h += '<div class="prow"><span class="ptag" style="background:#ffe600">' + esc(setName()) + '</span><span class="pcount">' + foundN() + ' / ' + st.placed.length + ' ' + esc(S.found || 'found') + '</span></div>';
      h += '<div class="hgrid" style="--n:' + n + '">';
      st.grid.forEach(function (ch, idx) {
        var miss = st.shown && !lit[idx] && st.placed.some(function (p) { return !st.found[p.w.id] && p.cells.indexOf(idx) >= 0; });
        h += '<div class="hc' + (lit[idx] ? ' lit' : '') + (miss ? ' miss' : '') + (st.a === idx ? ' sel' : '') + '" data-i="' + idx + '"' + (lit[idx] ? ' style="background:' + lit[idx] + '"' : '') + '>' + ch + '</div>';
      });
      h += '</div>';
      if (all) h += '<div class="pbanner ok">' + esc(S.allFound || 'ALL FOUND!') + '</div>';
      h += '<div class="hclues">';
      st.placed.forEach(function (p, i) {
        var f = st.found[p.w.id], w = p.w, showWord = S.showWords || f || st.shown;
        h += '<div class="hclue' + (f ? ' got' : '') + '" style="--c:' + COLS[i % COLS.length] + '">' +
          (w.pic && (S.showWords || f) ? '<span class="hpic">' + WU.pic(w.pic) + '</span>' : '') +
          '<span class="htx">' + (S.showWords ? '<b>' + esc(w.word) + '</b>' : esc(clueText(w)) + (showWord ? ' <b>' + esc(w.word) + '</b>' : '')) + '</span></div>';
      });
      h += '</div>';
      body.innerHTML = h;
      wire();
      ctx.actions(all || st.shown ? [{ label: 'Next puzzle', on: function () { next(true); } }]
        : [{ label: 'Hint', alt: true, on: hint }, { label: 'Show the words', alt: true, on: function () { st.shown = true; render(); } }]);
    }
    function hint() {
      var left = st.placed.filter(function (p) { return !st.found[p.w.id]; }); if (!left.length) return;
      var p = left[st.hints++ % left.length], el = body.querySelector('[data-i="' + p.cells[0] + '"]');
      if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
      P.toast('This word starts here: ' + letters(p.w.word).charAt(0));
    }
    // Tap the first letter, then the last (or drag from one to the other).
    function line(a, b) {
      var n = st.n, r1 = Math.floor(a / n), c1 = a % n, r2 = Math.floor(b / n), c2 = b % n, dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
      var len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1));
      if (!(r1 === r2 || c1 === c2 || Math.abs(r2 - r1) === Math.abs(c2 - c1))) return null;
      var out = []; for (var k = 0; k <= len; k++) out.push((r1 + dr * k) * n + (c1 + dc * k)); return out;
    }
    function tryLine(a, b) {
      var cells = line(a, b); if (!cells) { WU.sound.clack(); return false; }
      var key = cells.join(','), rev = cells.slice().reverse().join(',');
      var hit = st.placed.filter(function (p) { var k = p.cells.join(','); return !st.found[p.w.id] && (k === key || k === rev); })[0];
      if (!hit) { var g = cells.map(function (c) { return st.grid[c]; }).join(''); var hw = st.placed.filter(function (p) { return !st.found[p.w.id] && (letters(p.w.word) === g || letters(p.w.word) === g.split('').reverse().join('')); })[0]; hit = hw; }
      if (hit) { st.found[hit.w.id] = true; WU.sound.ding(); st.a = null; render(); return true; }
      WU.sound.buzzer(); return false;
    }
    function wire() {
      var grid = body.querySelector('.hgrid'), start = null, moved = false;
      function cellAt(e) { var el = document.elementFromPoint(e.clientX, e.clientY); return el && el.hasAttribute('data-i') && grid.contains(el) ? +el.getAttribute('data-i') : null; }
      function paint(a, b) {
        grid.querySelectorAll('.hc.drag').forEach(function (x) { x.classList.remove('drag'); });
        var cells = b == null ? [a] : line(a, b) || [a];
        cells.forEach(function (c) { var el = grid.querySelector('[data-i="' + c + '"]'); if (el) el.classList.add('drag'); });
      }
      grid.addEventListener('pointerdown', function (e) {
        var c = cellAt(e); if (c == null || st.shown) return;
        e.preventDefault(); start = c; moved = false; paint(c);
        try { grid.setPointerCapture(e.pointerId); } catch (x) {}
      });
      grid.addEventListener('pointermove', function (e) { if (start == null) return; var c = cellAt(e); if (c != null && c !== start) { moved = true; paint(start, c); } });
      grid.addEventListener('pointerup', function (e) {
        if (start == null) return; var c = cellAt(e), s = start; start = null;
        if (moved && c != null && c !== s) { if (!tryLine(s, c)) { st.a = null; render(); } return; }
        // A tap: first tap marks the start, second tap the end.
        if (st.a == null || st.a === s) { st.a = st.a === s ? null : s; WU.sound.clack(); render(); return; }
        var a = st.a; st.a = null; if (!tryLine(a, s)) render();
      });
      grid.addEventListener('pointercancel', function () { start = null; render(); });
    }
    return {
      mount: function (b, c) { body = b; ctx = c; st = { set: null }; next(false); },
      unmount: function () { body = ctx = st = null; }
    };
  })();

  /* ======================= VANISHING SENTENCE ======================= */
  P.games.vanish = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function tokens(text) {
      return String(text || '').split(/\s+/).filter(Boolean).map(function (w) {
        var m = /^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/.exec(w) || ['', '', w, ''];
        return { pre: m[1], core: m[2], post: m[3] };
      });
    }
    function pool() { return WU.list('vanish', 'items', ctx.level).filter(function (x) { return x.text && tokens(x.text).some(function (t) { return t.core; }); }); }
    function per() { return Math.max(1, Math.min(5, Math.round(+ctx.S.perStep || 1))); }
    function newItem() {
      var it = deck(pool()); if (!it) { ctx.empty(); return; }
      var idx = []; tokens(it.text).forEach(function (t, i) { if (t.core) idx.push(i); });
      st = { it: it, order: WU.shuffle(idx), gone: 0, phase: 'read', typed: '' }; render();
    }
    function sentence() {
      var gone = {}; st.order.slice(0, st.gone).forEach(function (i) { gone[i] = true; });
      return tokens(st.it.text).map(function (t, i) {
        if (!gone[i]) return esc(t.pre) + '<span class="vw">' + esc(t.core) + '</span>' + esc(t.post);
        var n = t.core.length, s = '';
        if (ctx.S.letters) for (var k = 0; k < n; k++) s += '<i></i>';
        return esc(t.pre) + '<span class="vgap' + (ctx.S.letters ? ' slots' : '') + '" style="--n:' + n + '">' + s + '</span>' + esc(t.post);
      }).join(' ');
    }
    // Word by word: green = right, red = wrong or missing (shows the right word).
    function checked() {
      var want = tokens(st.it.text).filter(function (t) { return t.core; }), got = P.norm(st.typed).split(' ').filter(Boolean), ok = 0;
      var h = want.map(function (t, i) {
        var g = got[i] || '', right = P.norm(t.core) === g;
        if (right) ok++;
        return '<span class="vck ' + (right ? 'ok' : 'no') + '">' + esc(t.core) + (right || !g ? '' : '<s>' + esc(g) + '</s>') + '</span>';
      }).join(' ');
      return { html: h, all: ok === want.length && got.length === want.length, ok: ok, n: want.length };
    }
    function render() {
      var S = ctx.S, it = st.it, total = st.order.length, h = '';
      h += '<div class="prow">' + (S.focusShow && it.focus ? '<span class="ptag" style="background:#00e5c7">' + esc(it.focus) + '</span>' : '') + '</div>';
      if (st.phase === 'write') {
        h += '<div class="pbig">' + esc(S.write || 'WRITE IT!') + '</div><p class="pnote">Write the whole sentence. No looking!</p>' +
          '<textarea class="pinput big" rows="3" autocapitalize="sentences" autocomplete="off" spellcheck="false" placeholder="Type the sentence">' + esc(st.typed) + '</textarea>';
      } else if (st.phase === 'check') {
        var c = checked();
        h += '<div class="pcard2' + (c.all ? ' lit' : '') + '">' + (it.pic ? '<div class="ppic">' + WU.pic(it.pic) + '</div>' : '') + '<div class="vtext">' + esc(it.text) + '</div></div>' +
          '<div class="plabel">Your sentence</div><div class="vchk">' + c.html + '</div>' +
          '<div class="pbanner ' + (c.all ? 'ok' : 'no') + '">' + (c.all ? 'PERFECT!' : c.ok + ' of ' + c.n + ' words right') + '</div>';
      } else {
        h += '<div class="pcard2">' + (it.pic ? '<div class="ppic">' + WU.pic(it.pic) + '</div>' : '') + '<div class="vtext">' + sentence() + '</div></div>' +
          '<p class="pnote big">' + esc(st.phase === 'read' ? S.read : S.again) + '</p>' +
          '<p class="pnote">Read it out loud' + (st.gone ? ', with the missing words too.' : '.') + '</p>' +
          '<div class="vdots">' + st.order.map(function (x, i) { return '<i class="' + (i < st.gone ? 'off' : '') + '"></i>'; }).join('') + '</div>';
      }
      body.innerHTML = h;
      var ta = body.querySelector('textarea');
      if (ta) { ta.oninput = function () { st.typed = ta.value; }; setTimeout(function () { ta.focus(); }, 50); }
      var acts;
      if (st.phase === 'read' || st.phase === 'gone') {
        var last = st.gone + per() >= total;
        acts = [{ label: 'Other sentence', alt: true, small: true, on: newItem }, { label: st.gone >= total ? 'Write it' : last ? 'Vanish the last words' : 'Vanish words', on: function () {
          if (st.gone >= total) { st.phase = 'write'; render(); return; }
          st.gone = Math.min(total, st.gone + per()); st.phase = 'gone'; WU.sound.pop(); render();
        } }];
      } else if (st.phase === 'write') acts = [{ label: 'Check', on: function () { var c = checked(); st.phase = 'check'; ctx.score(c.all); render(); if (c.all) WU.sound.ding(); else WU.sound.beep(300); } }];
      else acts = [{ label: 'Try again', alt: true, on: function () { st.phase = 'write'; st.typed = ''; render(); } }, { label: 'Next sentence', on: newItem }];
      ctx.actions(acts);
    }
    return { mount: function (b, c) { body = b; ctx = c; newItem(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= WORD CHAIN ======================= */
  // You and the phone take turns. Beginner (pictures): the phone shows a picture that starts with the letter; type its word.
  P.games.chain = (function () {
    var body, ctx, st, bar;
    function pics() { return WU.list('chain', 'pictures', ctx.level).filter(function (p) { return letters(p.text).length >= 2 && /^[a-z]+$/i.test(p.text.trim()); }); }
    // The phone's own words: this level's pictures, then the picture library (one-word names only).
    function bank() {
      var out = {}, add = function (w) { w = String(w || '').toLowerCase().trim(); if (/^[a-z]{3,}$/.test(w)) out[w] = 1; };
      pics().forEach(function (p) { add(p.text); });
      (WU.PIC_LIST || []).forEach(function (p) { add(p.name); });
      return Object.keys(out);
    }
    function mode() { return ctx.S.mode || 'any'; }
    function minLen() { return mode() === 'long' ? Math.max(2, +ctx.S.minLen || 6) : Math.max(2, +ctx.S.minLen || 2); }
    function secs() { return Math.max(8, Math.round((+ctx.S.secs || 10) * 2)); } // typing on a phone is slower than saying it
    function last(w) { return w.charAt(w.length - 1); }
    function phoneWord(letter) {
      var c = bank().filter(function (w) { return w.charAt(0) === letter && st.used.indexOf(w) < 0 && w.length >= Math.min(minLen(), 6); });
      var easy = c.filter(function (w) { return 'jqxyz'.indexOf(last(w)) < 0; });
      return c.length ? WU.pick(easy.length ? easy : c) : null;
    }
    function picFor(letter) {
      var c = pics().filter(function (p) { var w = p.text.toLowerCase().trim(); return (!letter || w.charAt(0) === letter) && st.used.indexOf(w) < 0; });
      return c.length ? picDeck(c) : null;
    }
    var picDeck = WU.kit.deck();
    function start() {
      st = { used: [], chain: [], mine: 0, over: false, msg: '' };
      if (mode() === 'pictures') { var p = picFor(null); if (!p) { ctx.empty(); return; } st.pic = p; st.letter = p.text.toLowerCase().charAt(0); }
      else { var w = WU.pick(bank().filter(function (x) { return 'jqxyz'.indexOf(last(x)) < 0; })); st.used.push(w); st.chain.push({ w: w, me: false }); st.letter = last(w); }
      turn();
    }
    function turn() { st.typed = ''; st.msg = ''; render(); bar.start(secs(), function () { end(ctx.S.timeUp || 'TIME!'); }); }
    function end(msg) { bar.stop(); st.over = true; st.msg = msg; var best = WU.store.get('phone-chain-best', 0); if (st.mine > best) WU.store.set('phone-chain-best', st.mine); render(); WU.sound.buzzer(); }
    function submit() {
      if (st.over) return;
      var w = P.norm(st.typed).replace(/[^a-z]/g, '');
      if (!w) return;
      if (mode() === 'pictures') {
        var want = st.pic.text.toLowerCase().trim();
        if (w !== want) { st.msg = 'Not quite. Look again!'; WU.sound.beep(300); render(); return; }
      } else {
        if (w.charAt(0) !== st.letter) { st.msg = P.fill(ctx.S.wrongStart || 'Not {letter}!', { letter: st.letter.toUpperCase() }); WU.sound.beep(300); render(); return; }
        if (w.length < minLen()) { st.msg = mode() === 'long' ? P.fill(ctx.S.lenRule, { n: minLen() }) : (ctx.S.short || 'Too short!'); WU.sound.beep(300); render(); return; }
        if (st.used.indexOf(w) >= 0) { st.msg = ctx.S.used || 'Already used!'; WU.sound.beep(300); render(); return; }
      }
      bar.stop(); st.used.push(w); st.chain.push({ w: w, me: true }); st.mine++; WU.sound.ding();
      if (mode() === 'pictures') {
        var p = picFor(last(w)) || picFor(null);
        if (!p) { st.over = true; st.msg = 'You named every picture!'; render(); return; }
        st.pic = p; st.letter = p.text.toLowerCase().charAt(0); turn(); return;
      }
      // The phone answers with a word that starts with your last letter.
      var r = phoneWord(last(w));
      if (!r) { bar.stop(); st.over = true; st.msg = 'The phone has no word with ' + last(w).toUpperCase() + '. You win!'; render(); return; }
      st.used.push(r); st.chain.push({ w: r, me: false }); st.letter = last(r); turn();
    }
    function render() {
      var S = ctx.S, h = '<div class="pbarwrap"></div>';
      var tail = st.chain.slice(-6);
      if (mode() !== 'pictures' && tail.length) {
        h += '<div class="chchain">' + tail.map(function (c) {
          return '<span class="chw' + (c.me ? ' me' : '') + '">' + esc(c.w.slice(0, -1)) + '<b>' + esc(c.w.slice(-1)) + '</b></span>';
        }).join('<i>→</i>') + '</div>';
      }
      if (st.over) {
        h += '<div class="pbanner ' + (st.mine ? 'ok' : 'no') + '">' + esc(st.msg) + '</div>' +
          '<div class="pbig">' + st.mine + ' word' + (st.mine === 1 ? '' : 's') + '</div><p class="pnote">Your best: ' + Math.max(st.mine, WU.store.get('phone-chain-best', 0)) + '</p>';
      } else if (mode() === 'pictures') {
        h += '<div class="chpic">' + WU.pic(st.pic.pic) + '</div><p class="pnote big">' + esc(S.start || 'What is it?') + '</p>' +
          '<div class="chletter small"><span>' + esc(S.letter || 'Starts with') + '</span><b>' + st.letter.toUpperCase() + '</b></div>';
      } else {
        h += '<div class="chletter"><span>' + esc(S.letter || 'Starts with') + '</span><b>' + st.letter.toUpperCase() + '</b></div>' +
          (mode() === 'long' ? '<p class="pnote">' + esc(P.fill(S.lenRule, { n: minLen() })) + '</p>' : '');
      }
      if (!st.over) {
        h += '<form class="prow2" autocomplete="off"><input class="pinput" type="text" inputmode="text" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="' +
          (mode() === 'pictures' ? 'Type the word' : 'A word with ' + st.letter.toUpperCase()) + '" value="' + esc(st.typed) + '"><button class="pbtn" type="submit">OK</button></form>' +
          (st.msg ? '<div class="pmsg">' + esc(st.msg) + '</div>' : '');
      }
      body.innerHTML = h;
      body.querySelector('.pbarwrap').appendChild(barEl);
      var f = body.querySelector('form');
      if (f) {
        var inp = f.querySelector('input'); inp.oninput = function () { st.typed = inp.value; };
        f.onsubmit = function (e) { e.preventDefault(); submit(); };
        setTimeout(function () { inp.focus(); }, 30);
      }
      ctx.actions(st.over ? [{ label: 'Play again', on: start }] : [{ label: 'Give up', alt: true, small: true, on: function () { end('You stopped.'); } }]);
    }
    var barEl;
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); start(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();

  /* ======================= VERB VOLCANO ======================= */
  P.games.volcano = (function () {
    var body, ctx, st, bar, barEl, deck = WU.kit.deck();
    function verbs() { return WU.list('volcano', 'verbs', ctx.level).filter(function (v) { return v.base && v.past; }); }
    // "was / were" accepts was, were or both.
    function okForm(typed, form) {
      var t = P.norm(typed).replace(/\s*\/\s*/g, '/'), opts = String(form).split('/').map(P.norm).filter(Boolean);
      if (!t) return false;
      return t.split(/[\/ ]| or /).filter(Boolean).every(function (x) { return opts.indexOf(x) >= 0; }) || opts.indexOf(t) >= 0;
    }
    function secs() { return Math.max(10, (+ctx.S.seconds || 8) + 10); } // time to type, not just to say
    function next() {
      var v = deck(verbs()); if (!v) { ctx.empty(); return; }
      st = { v: v, phase: 'ask', past: '', pp: '' }; render();
      bar.start(secs(), function () { finish(true); });
    }
    function finish(timeUp) {
      if (st.phase !== 'ask') return;
      bar.stop();
      var pp = !!ctx.S.askPP, ok = !timeUp && okForm(st.past, st.v.past) && (!pp || okForm(st.pp, st.v.pp));
      st.phase = 'done'; st.ok = ok; st.timeUp = timeUp; ctx.score(ok);
      if (ok) WU.sound.ding(); else WU.sound.boom();
      render();
    }
    function render() {
      var S = ctx.S, v = st.v, pp = !!S.askPP, h = '';
      h += '<div class="vol' + (st.phase === 'done' ? (st.ok ? ' safe' : ' boom') : '') + '"><div class="vlava"></div><div class="vcone"></div><div class="vbase">' + esc(v.base) + '</div></div>';
      if (st.phase === 'ask') {
        h += '<div class="pbarwrap"></div><form class="vform" autocomplete="off">' +
          '<label><span>' + esc(S.lPast || 'past simple') + '</span><input class="pinput" name="past" autocapitalize="none" autocorrect="off" spellcheck="false" value="' + esc(st.past) + '"></label>' +
          (pp ? '<label><span>' + esc(S.lPP || 'past participle') + '</span><input class="pinput" name="pp" autocapitalize="none" autocorrect="off" spellcheck="false" value="' + esc(st.pp) + '"></label>' : '') +
          '<button type="submit" hidden></button></form>';
      } else {
        h += '<div class="pbanner ' + (st.ok ? 'ok' : 'no') + '">' + esc(st.ok ? S.safe || 'SAFE!' : S.boom || 'BOOM!') + (st.timeUp ? ' Too slow!' : '') + '</div>' +
          '<div class="vforms"><div><span>' + esc(S.lBase) + '</span><b>' + esc(v.base) + '</b></div><div class="' + (okForm(st.past, v.past) ? 'ok' : 'no') + '"><span>' + esc(S.lPast) + '</span><b>' + esc(v.past) + '</b>' + (st.past && !okForm(st.past, v.past) ? '<s>' + esc(st.past) + '</s>' : '') + '</div>' +
          (pp ? '<div class="' + (okForm(st.pp, v.pp) ? 'ok' : 'no') + '"><span>' + esc(S.lPP) + '</span><b>' + esc(v.pp) + '</b>' + (st.pp && !okForm(st.pp, v.pp) ? '<s>' + esc(st.pp) + '</s>' : '') + '</div>' : '') + '</div>' +
          (S.useShow && S.use ? '<p class="pnote big">' + esc(P.fill(S.use, { base: v.base, past: v.past.split('/')[0].trim(), pp: v.pp.split('/')[0].trim() })) + '</p><p class="pnote">Say it out loud.</p>' : '');
      }
      body.innerHTML = h;
      var wrap = body.querySelector('.pbarwrap'); if (wrap) wrap.appendChild(barEl);
      var f = body.querySelector('form');
      if (f) {
        f.querySelectorAll('input').forEach(function (inp) { inp.oninput = function () { st[inp.name] = inp.value; }; });
        f.onsubmit = function (e) { e.preventDefault(); var ins = f.querySelectorAll('input'); if (ins[1] && document.activeElement === ins[0]) ins[1].focus(); else finish(false); };
        setTimeout(function () { var i = f.querySelector('input'); if (i) i.focus(); }, 30);
      }
      ctx.actions(st.phase === 'ask' ? [{ label: 'Check', on: function () { finish(false); } }] : [{ label: 'Next verb', on: next }]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); next(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();
})();
