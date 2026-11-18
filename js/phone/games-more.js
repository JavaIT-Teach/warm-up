/* Warm Up on a phone: the board games that used to be board-only (see js/phone/shell.js).
   Same lists and screen texts as the board (WU.list, ctx.S), portrait screens, the phone checks or reveals.
   Grammar (solo, checked): Article Showdown, Pin It!, Sticky Words, Domino Effect.
   Speaking: The Bomb (solo: words before the fuse runs out), Tug of War (solo: argue both sides),
             Hot Seat (with friends: phone on your forehead), Lie Detector (with friends: pass the phone).
   Room games as solo versions: Name Wall, Stand Up If..., Four Zones, Opinion Line, Find Someone Who, Speed Chat. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;
  var NAMES = ['Sara', 'Ali', 'Kamila', 'Timur', 'Laylo', 'Jasur', 'Malika', 'Bekzod'];

  /* ---------- shared bits ---------- */
  function list(id, name, ctx) { return WU.list(id, name, ctx.level); }
  // Multiple choice: opts [{ text, ok }]; after a pick the right one is green, a wrong pick red.
  function choices(el, opts, onPick) {
    var picked = false;
    el.innerHTML = '<div class="pchoices">' + opts.map(function (o, i) { return '<button class="pchoice" data-o="' + i + '">' + esc(o.text) + '</button>'; }).join('') + '</div>';
    el.querySelectorAll('[data-o]').forEach(function (b) {
      b.onclick = function () {
        if (picked) return; picked = true;
        var o = opts[+b.getAttribute('data-o')];
        el.querySelectorAll('[data-o]').forEach(function (x) { var oo = opts[+x.getAttribute('data-o')]; x.classList.add(oo.ok ? 'ok' : x === b ? 'no' : 'dim'); });
        if (o.ok) WU.sound.ding(); else WU.sound.beep(300);
        onPick(o);
      };
    });
  }
  function gapHTML(text, fill, cls) {
    var parts = String(text).split('___'), h = esc(parts[0]);
    for (var i = 1; i < parts.length; i++) h += (fill ? '<em class="' + (cls || '') + '">' + esc(fill[i - 1] == null ? '___' : fill[i - 1] || '—') + '</em>' : '<span class="gapw">____</span>') + esc(parts[i]);
    return h;
  }
  function picHTML(pic) { return pic && WU.PICS[pic] ? '<div class="mpic">' + WU.pic(pic) + '</div>' : ''; }
  // A sentence frame with a box in every ___ gap. Returns { el, done(), text() }.
  function frameInputs(el, frame, placeholder) {
    var parts = String(frame || '___').split('___');
    if (parts.length < 2) parts = [frame + ' ', ''];
    el.innerHTML = '<div class="mframe">' + parts.map(function (p, i) {
      return esc(p) + (i < parts.length - 1 ? '<input class="mgap" data-g="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="true" placeholder="' + esc(placeholder || '...') + '">' : '');
    }).join('') + '</div>';
    var ins = [].slice.call(el.querySelectorAll('.mgap'));
    ins.forEach(function (x, i) {
      x.oninput = function () { x.style.width = Math.max(4, x.value.length + 1) + 'ch'; };
      x.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); if (ins[i + 1]) ins[i + 1].focus(); else x.blur(); } };
    });
    return {
      done: function () { return ins.every(function (x) { return P.norm(x.value); }); },
      text: function () { var t = parts[0]; ins.forEach(function (x, i) { t += x.value.trim() + parts[i + 1]; }); return t.replace(/\s+/g, ' ').trim(); }
    };
  }
  function words(s) { return P.norm(s).split(' ').filter(Boolean).length; }

  /* ======================= ARTICLE SHOWDOWN (solo, checked) ======================= */
  P.games.articles = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function labels() { var S = ctx.S; return [{ v: 'a', t: S.c1 || 'a' }, { v: 'an', t: S.c2 || 'an' }].concat(S.useThe === false ? [] : [{ v: 'the', t: S.c3 || 'the' }]).concat(S.useNone === false ? [] : [{ v: '', t: S.c4 || 'nothing' }]); }
    function next() {
      var it = deck(list('articles', 'items', ctx).filter(function (x) { return x.text.indexOf('___') >= 0; }));
      if (!it) { ctx.empty(); return; }
      st = { it: it, ans: it.answer.split('/').map(function (a) { return a.trim(); }), gap: 0, picks: [], ok: true }; render();
    }
    function render() {
      var S = ctx.S, it = st.it, done = st.gap >= st.ans.length, h = '';
      h += picHTML(it.pic) + '<div class="msent">' + gapHTML(it.text, st.ans.map(function (a, i) { return i < st.picks.length ? st.picks[i] : i === st.gap ? '?' : null; }), 'mfill') + '</div>';
      if (st.ans.length > 1 && !done) h += '<p class="pnote">Gap ' + (st.gap + 1) + ' of ' + st.ans.length + '</p>';
      h += '<div class="popts"></div>';
      if (done) {
        h += '<div class="pbanner ' + (st.ok ? 'ok' : 'no') + '">' + (st.ok ? 'RIGHT!' : 'NOT QUITE') + '</div>' +
          '<div class="pans">' + gapHTML(it.text, st.ans.map(function (a) { return a || '—'; }), '') + '</div>' +
          (S.whyShow !== false && it.why ? '<p class="pnote"><b>' + esc(S.whyLabel || 'WHY?') + '</b> ' + esc(it.why) + '</p>' : '') +
          '<p class="pnote">Say the whole sentence out loud.</p>';
      }
      body.innerHTML = h;
      if (!done) {
        var right = st.ans[st.gap];
        choices(body.querySelector('.popts'), labels().map(function (l) { return { text: l.t, v: l.v, ok: l.v === right }; }), function (o) {
          st.picks.push(o.v === '' ? '—' : o.v); if (!o.ok) st.ok = false;
          setTimeout(function () { if (!st) return; st.gap++; if (st.gap >= st.ans.length) ctx.score(st.ok); render(); }, o.ok ? 350 : 900);
        });
        ctx.actions([{ label: 'Skip', alt: true, on: next }]);
      } else ctx.actions([{ label: 'Next', on: next }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; next(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= PIN IT! (solo, checked) ======================= */
  P.games.pinit = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function set(it) { var S = ctx.S; return String(it.set === 'time2' ? S.time2 || 'for, since, during, by, until' : S.aoi || 'at, on, in').split(',').map(function (x) { return x.trim(); }).filter(Boolean); }
    function next() {
      var it = deck(list('pinit', 'items', ctx).filter(function (x) { return x.answer; }));
      if (!it) { ctx.empty(); return; }
      st = { it: it, done: false }; render();
    }
    function render() {
      var S = ctx.S, it = st.it, h = picHTML(it.pic) + '<div class="msent">' + gapHTML(it.text, st.done ? [it.answer] : null, 'mfill') + '</div><div class="popts"></div>';
      if (st.done) h += '<div class="pbanner ' + (st.ok ? 'ok' : 'no') + '">' + (st.ok ? 'RIGHT!' : 'NOT QUITE') + '</div>' +
        (S.whyShow !== false && it.why ? '<p class="pnote"><b>' + esc(S.whyLabel || 'WHY?') + '</b> ' + esc(it.why) + '</p>' : '');
      body.innerHTML = h;
      if (!st.done) {
        choices(body.querySelector('.popts'), set(it).map(function (w) { return { text: w, ok: w === it.answer }; }), function (o) {
          st.ok = o.ok; ctx.score(o.ok); setTimeout(function () { if (st) { st.done = true; render(); } }, o.ok ? 350 : 900);
        });
        ctx.actions([{ label: 'Skip', alt: true, on: next }]);
      } else ctx.actions([{ label: 'Next', on: next }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; next(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= STICKY WORDS (solo, checked, against the clock) ======================= */
  P.games.sticky = (function () {
    var body, ctx, st, deck = WU.kit.deck(), bar, barEl;
    function next() {
      var all = list('sticky', 'words', ctx).filter(function (x) { return x.answer; }), it = deck(all);
      if (!it) { ctx.empty(); return; }
      var pool = []; all.forEach(function (x) { if (x.answer !== it.answer && pool.indexOf(x.answer) < 0) pool.push(x.answer); });
      ['in', 'on', 'at', 'of', 'for', 'to', 'with', 'about'].forEach(function (p) { if (p !== it.answer && pool.indexOf(p) < 0) pool.push(p); });
      st = { it: it, done: false, opts: WU.shuffle([{ text: it.answer, ok: true }].concat(WU.shuffle(pool).slice(0, 3).map(function (p) { return { text: p, ok: false }; }))) };
      render();
      bar.start(Math.max(5, +ctx.S.seconds || 10), function () { if (st && !st.done) { st.done = true; st.ok = false; st.late = true; ctx.score(false); WU.sound.buzzer(); render(); } });
    }
    function render() {
      var S = ctx.S, it = st.it, h = '<div class="pbarwrap"></div><div class="mbig">' + gapHTML(it.text, st.done ? [it.answer] : null, 'mfill') + '</div><div class="popts"></div>';
      if (st.done) h += '<div class="pbanner ' + (st.ok ? 'ok' : 'no') + '">' + (st.ok ? 'RIGHT!' : st.late ? 'TIME!' : 'NOT QUITE') + '</div>' +
        (it.example ? '<div class="plabel">' + esc(S.exampleLabel || 'EXAMPLE') + '</div><div class="pans small">' + esc(it.example) + '</div>' : '') +
        '<p class="pnote">Now say your own sentence with it.</p>';
      body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
      if (!st.done) {
        choices(body.querySelector('.popts'), st.opts, function (o) { bar.stop(); st.ok = o.ok; ctx.score(o.ok); setTimeout(function () { if (st) { st.done = true; render(); } }, o.ok ? 350 : 900); });
        ctx.actions([]);
      } else ctx.actions([{ label: 'Next', on: next }]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); next(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();

  /* ======================= DOMINO EFFECT (solo: build the chain, the phone checks the form) ======================= */
  P.games.domino = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    var PERF = /\b(would|'d|wouldn't|could|couldn't|might) have (been|had|done|gone|got|gotten|seen|made|taken|known|come|left|bought|eaten|written|given|found|told|met|lost|won|become|run|kept|felt|heard|said|sent|spent|thought|understood|\w+ed|\w+en)\b/;
    // The form each level practises (Pre-Intermediate 1st ... IELTS 3 inversion).
    function result(lv, t) {
      t = ' ' + P.norm(t) + ' ';
      if (lv <= 2) return /\b(will|'ll|won't|wont)\b/.test(t);
      // 2nd: would + verb ("would have a garden" is fine), not would have + past participle (that is the 3rd).
      if (lv === 3) return /\b(would|'d|wouldn't|could|might)\b/.test(t) && !PERF.test(t);
      if (lv === 4) return PERF.test(t);
      return /\b(would|'d|wouldn't|could|might)\b/.test(t);
    }
    function opener(lv, t) {
      t = P.norm(t);
      if (lv === 6) return /^(had|were|should)\b/.test(t);
      return /^if\b/.test(t);
    }
    function start() {
      var it = deck(list('domino', 'starters', ctx).filter(function (x) { return x.text; }));
      if (!it) { ctx.empty(); return; }
      st = { it: it, chain: [it.text], phase: 'first', typed: '', msg: '' }; render();
    }
    function render() {
      var S = ctx.S, lv = ctx.level, h = '';
      h += '<div class="prow"><span class="ptag" style="background:var(--c)">' + esc(S.type || 'CONDITIONALS') + '</span><span class="pcount">Chain: <b>' + (st.phase === 'first' ? 0 : st.chain.length) + '</b></span></div>';
      if (S.frame) h += '<div class="pframe">' + esc(S.frame) + '</div>';
      h += '<div class="mchain">' + st.chain.map(function (c, i) { return '<div class="mlink' + (i === st.chain.length - 1 ? ' last' : '') + '">' + esc(c) + '</div>'; }).join('') + '</div>';
      if (st.phase === 'broken') {
        h += '<div class="pbanner no">' + esc(S.broken || 'CHAIN BROKEN!') + '</div><p class="pnote">' + esc(st.msg) + '</p>' +
          (st.it.model ? '<div class="plabel">' + esc(S.modelLabel || 'FOR EXAMPLE') + '</div><div class="pans small">' + esc(st.it.text + ' ' + st.it.model) + '</div>' : '');
      } else {
        h += '<p class="pq">' + (st.phase === 'first' ? 'Finish the sentence.' : (lv === 6 ? 'Your result is the next sentence: start with Had / Were / Should.' : 'Your result is the next "If...". Write the whole sentence.')) + '</p>' +
          '<textarea class="pinput" rows="2" autocapitalize="sentences" spellcheck="false" placeholder="' + (st.phase === 'first' ? 'I would...' : lv === 6 ? 'Had I...' : 'If I...') + '">' + esc(st.typed) + '</textarea>' +
          (st.msg ? '<div class="pmsg">' + esc(st.msg) + '</div>' : '');
      }
      body.innerHTML = h;
      var ta = body.querySelector('textarea'); if (ta) ta.oninput = function () { st.typed = ta.value; };
      if (st.phase === 'broken') ctx.actions([{ label: 'New chain', on: start }]);
      else ctx.actions([{ label: 'Stop', alt: true, small: true, on: function () { st.phase = 'broken'; st.msg = 'Your chain: ' + (st.phase === 'first' ? 0 : st.chain.length) + ' sentences.'; ctx.score(st.chain.length > 1); render(); } },
        { label: 'Add', on: add }]);
    }
    function add() {
      var t = st.typed.trim(), lv = ctx.level;
      if (!P.norm(t)) { P.toast('Write it first.'); return; }
      if (st.phase === 'next' && !opener(lv, t)) { st.msg = lv === 6 ? 'Start with Had, Were or Should (no "if").' : 'Start with "If".'; WU.sound.beep(300); render(); return; }
      // The result part: after the comma in a whole sentence, or everything when finishing the first one.
      var res = st.phase === 'first' ? t : (t.indexOf(',') >= 0 ? t.slice(t.indexOf(',') + 1) : t);
      if (!result(lv, res)) {
        var need = lv <= 2 ? 'will + verb' : lv === 3 ? 'would + verb' : lv === 4 ? 'would have + past participle' : 'would / could / might';
        st.msg = 'The result needs ' + need + '. Try again!'; WU.sound.beep(300); render(); return;
      }
      st.chain[st.chain.length - 1] = st.phase === 'first' ? st.chain[st.chain.length - 1] + ' ' + t : st.chain[st.chain.length - 1];
      if (st.phase === 'next') st.chain.push(t);
      st.phase = 'next'; st.typed = ''; st.msg = ''; ctx.score(true); WU.sound.ding(); render();
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= THE BOMB (solo: say / type words before it explodes) ======================= */
  P.games.bomb = (function () {
    var body, ctx, st, deck = WU.kit.deck(), boomT = null;
    function cats() { return list('bomb', 'cats', ctx).filter(function (c) { return c.text; }); }
    function start() {
      var c = deck(cats()); if (!c) { ctx.empty(); return; }
      st = { cat: c, phase: 'ready', words: [], typed: '' }; render();
    }
    function light() {
      var S = ctx.S, lo = Math.max(5, +S.fuseMin || 15), hi = Math.max(lo, +S.fuseMax || 60);
      st.phase = 'lit'; st.t0 = Date.now(); render(); WU.sound.beep(880);
      clearTimeout(boomT); boomT = setTimeout(boom, (lo + Math.random() * (hi - lo)) * 1000);
      (function tick() { if (!st || st.phase !== 'lit') return; WU.sound.tick(true); setTimeout(tick, 700); })();
    }
    function boom() {
      if (!st || st.phase !== 'lit') return;
      var ch = WU.pick(list('bomb', 'challenges', ctx).filter(function (c) { return c.text; }));
      st.phase = 'boom'; st.ch = ch; WU.sound.slam(); ctx.score(st.words.length >= 5);
      var k = 'phone-bomb-best-' + ctx.level, best = +WU.store.get(k, 0) || 0;
      st.best = best; if (st.words.length > best) { WU.store.set(k, st.words.length); st.newBest = true; }
      render();
    }
    function addWord() {
      var t = st.typed.trim(); if (!P.norm(t)) return;
      if (st.words.some(function (w) { return P.norm(w) === P.norm(t); })) { P.toast('You have that one!'); return; }
      st.words.push(t); st.typed = ''; WU.sound.clack(); render();
      var i = body.querySelector('.pinput'); if (i) i.focus();
    }
    function render() {
      var S = ctx.S, h = '<div class="plabel">' + esc(S.catTag || 'CATEGORY') + '</div>' + picHTML(st.cat.pic) + '<div class="mbig">' + esc(st.cat.text) + '</div>' + (st.cat.frame || S.frame ? '<div class="pframe">' + esc(st.cat.frame || S.frame) + '</div>' : '');
      var rule = st.phase === 'lit' ? (S.tickShow ? S.tickRule : '') : (S.ruleShow ? S.rule : '');
      if (st.phase === 'ready') {
        h += (rule ? '<p class="pnote big">' + esc(rule) + '</p>' : '') + '<div class="mbomb">💣</div>' +
          '<p class="pnote">Light the fuse. Say each one out loud and type it. Nobody knows when it explodes!</p>';
        body.innerHTML = h;
        ctx.actions([{ label: 'Other category', alt: true, small: true, on: start }, { label: 'Light the fuse!', on: light }]);
        return;
      }
      if (st.phase === 'lit') {
        h += (rule ? '<p class="pnote">' + esc(rule) + '</p>' : '') + '<div class="mbomb lit">💣</div>' +
          '<div class="mrow"><input class="pinput" autocomplete="off" autocapitalize="off" placeholder="' + (ctx.level >= 3 ? 'Your sentence' : 'Your word') + '" value="' + esc(st.typed) + '"><button class="pbtn mini" data-act="add">+</button></div>';
      } else {
        h += '<div class="pbanner no mboom">' + esc(S.boom || 'BOOM!') + '</div>' +
          '<p class="pnote big">' + st.words.length + ' before the bang.' + (st.newBest ? ' NEW BEST!' : st.best ? ' Your best: ' + st.best + '.' : '') + '</p>';
        if (st.ch) h += '<div class="plabel">' + esc(S.wheelTag || 'CHALLENGE') + '</div><div class="pans">' + esc(st.ch.text) + (st.ch.sub ? '<br><i>' + esc(st.ch.sub) + '</i>' : '') + '</div><p class="pnote">Do the challenge out loud.</p>';
      }
      h += '<div class="mchips">' + st.words.map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('') + '</div>';
      body.innerHTML = h;
      var inp = body.querySelector('.pinput');
      if (inp) { inp.oninput = function () { st.typed = inp.value; }; inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); addWord(); } }; body.querySelector('[data-act="add"]').onclick = addWord; }
      ctx.actions(st.phase === 'lit' ? [] : [{ label: 'Next category', on: start }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { clearTimeout(boomT); body = ctx = st = null; } };
  })();

  /* ======================= TUG OF WAR (solo: argue both sides, each good reason pulls) ======================= */
  P.games.tug = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function start() {
      var t = deck(list('tug', 'topics', ctx).filter(function (x) { return x.motion || x.left && x.right; }));
      if (!t) { ctx.empty(); return; }
      // IELTS motions: FOR and AGAINST one statement.
      if (t.motion) t = { motion: t.motion, frame: t.frame, left: ctx.S.forLabel || 'FOR', right: ctx.S.againstLabel || 'AGAINST', leftPic: '', rightPic: '' };
      st = { t: t, side: Math.random() < 0.5 ? 'left' : 'right', rope: 0, n: 0, msg: '', done: false }; render();
    }
    function render() {
      var S = ctx.S, t = st.t, side = st.side, name = side === 'left' ? t.left : t.right, other = side === 'left' ? t.right : t.left, h = '';
      var frame = t.motion ? 'I am ' + name + ' this because ___.' : t.frame || S.frame || '___ is better because ___.';
      if (t.motion) h += '<div class="mbig">“' + esc(t.motion) + '”</div>';
      h += '<div class="mtug"><div class="' + (side === 'left' ? 'on' : '') + '">' + picHTML(t.leftPic) + '<b>' + esc(t.left) + '</b></div><span>' + esc(S.vs || 'VS') + '</span><div class="' + (side === 'right' ? 'on' : '') + '">' + picHTML(t.rightPic) + '<b>' + esc(t.right) + '</b></div></div>' +
        '<div class="mrope"><i style="left:' + (50 + st.rope * 10) + '%"></i></div>';
      if (st.done) {
        h += '<div class="pbanner ok">Both sides argued!</div><p class="pnote">Which side do you really agree with? Say why out loud.</p>';
        body.innerHTML = h; ctx.actions([{ label: 'New topic', on: start }]); return;
      }
      h += '<p class="pq">Argue for <b>' + esc(name) + '</b>' + (t.motion ? '' : ' (not ' + esc(other) + ')') + '.</p><div class="mfill-in"></div>' + (st.msg ? '<div class="pmsg">' + esc(st.msg) + '</div>' : '') +
        '<p class="pnote">One good reason pulls the rope. Then argue the other side.</p>';
      body.innerHTML = h;
      var f = frameInputs(body.querySelector('.mfill-in'), t.motion ? frame : frame.replace(/^___/, name));
      ctx.actions([{ label: 'Pull!', on: function () {
        if (!f.done()) { st.msg = 'Fill every gap.'; render(); return; }
        if (words(f.text()) < 7) { st.msg = 'Too short: give a real reason (7+ words).'; WU.sound.beep(300); render(); return; }
        st.rope += st.side === 'left' ? -1 : 1; st.n++; ctx.score(true); WU.sound.ding(); st.msg = '';
        if (st.n >= 2) st.done = true; else st.side = st.side === 'left' ? 'right' : 'left';
        render();
      } }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= HOT SEAT (with friends: phone on your forehead) ======================= */
  P.games.hotseat = (function () {
    var body, ctx, st, deck = WU.kit.deck(), tickT = null;
    function secs() { return Math.max(15, +ctx.S.secs || 60); }
    function ready() { st = { phase: 'ready', score: 0, missed: [] }; render(); }
    function next() { var w = deck(list('hotseat', 'words', ctx).filter(function (x) { return x.text; })); st.w = w; }
    function render() {
      var S = ctx.S, h = '';
      clearTimeout(tickT);
      if (st.phase === 'ready') {
        var hi = +WU.store.get('phone-hot-high-' + ctx.level, 0) || 0;
        h += '<p class="pnote big">With friends: hold the phone on your forehead, screen to them.</p>' +
          '<ol class="erules"><li>Your friends describe the word. You guess.</li><li>Guessed: they tap <b>Got it</b>. Too hard: <b>Pass</b>.</li>' +
          (ctx.level >= 4 ? '<li>They must not say the banned words.</li>' : '') + '<li>' + secs() + ' seconds. Then the next person.</li></ol>' +
          (hi ? '<p class="pnote">' + esc(P.fill(S.beat || 'Beat {n}!', { n: hi })) + '</p>' : '');
        body.innerHTML = h;
        ctx.actions([{ label: 'GO! (' + secs() + 's)', on: function () { next(); if (!st.w) { ctx.empty(); return; } st.phase = 'play'; st.end = Date.now() + secs() * 1000; WU.sound.ding(); render(); } }]);
        return;
      }
      if (st.phase === 'play') {
        var w = st.w;
        h += '<div class="pbarwrap"><div class="pbar"><i></i></div></div><div class="ecount" data-auto></div>' +
          '<div class="eword">' + esc(w.text) + '</div>' +
          (w.banned ? '<div class="ebanned"><span>' + esc(S.banned || "Don't say:") + '</span>' + w.banned.split(',').map(function (b) { return '<s>' + esc(b.trim()) + '</s>'; }).join('') + '</div>' : '') +
          '<p class="pnote">' + esc(S.score || 'Score') + ': <b>' + st.score + '</b></p>';
        body.innerHTML = h;
        var c = body.querySelector('.ecount'), fill = body.querySelector('.pbar i');
        (function tick() {
          if (!st || st.phase !== 'play' || !c.isConnected) return;
          var left = Math.max(0, st.end - Date.now()) / 1000; c.textContent = Math.ceil(left); fill.style.width = (100 * left / secs()) + '%';
          if (left <= 0) { end(); return; } tickT = setTimeout(tick, 200);
        })();
        ctx.actions([{ label: 'Pass', alt: true, small: true, on: function () { st.missed.push(st.w.text); WU.sound.clack(); next(); render(); } },
          { label: 'Got it!', on: function () { st.score++; WU.sound.ding(); next(); render(); } }]);
        return;
      }
      var hk = 'phone-hot-high-' + ctx.level, old = +WU.store.get(hk, 0) || 0;
      h += '<div class="pbanner ok">' + esc(P.fill(S.result || '{name} scored {n}!', { name: 'You', n: st.score })) + '</div>' +
        (st.newHigh ? '<div class="pbanner ok">' + esc(S.newHigh || 'NEW HIGH SCORE!') + '</div>' : '<p class="pnote">' + esc(P.fill(S.high || 'High score: {n}', { n: old })) + '</p>') +
        (st.missed.length ? '<div class="plabel">Passed</div><div class="mchips">' + st.missed.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' : '');
      body.innerHTML = h;
      ctx.actions([{ label: 'Next person', on: ready }]);
    }
    function end() {
      var hk = 'phone-hot-high-' + ctx.level, old = +WU.store.get(hk, 0) || 0;
      st.newHigh = st.score > old; if (st.newHigh) WU.store.set(hk, st.score);
      st.phase = 'done'; ctx.score(st.score > 0); WU.sound.buzzer(); render();
    }
    return { mount: function (b, c) { body = b; ctx = c; ready(); }, unmount: function () { clearTimeout(tickT); body = ctx = st = null; } };
  })();

  /* ======================= LIE DETECTOR (with friends: pass the phone) ======================= */
  P.games.lie = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function start() {
      var q = deck(list('lie', 'questions', ctx).filter(function (x) { return x.text; }));
      if (!q) { ctx.empty(); return; }
      st = { q: q, phase: 'secret', truth: null }; render();
    }
    function render() {
      var S = ctx.S, h = '';
      if (st.phase === 'secret') {
        h += '<p class="pnote big">With friends. Give the phone to the person who answers. Others: look away!</p>' +
          '<div class="mbig">' + esc(st.q.text) + '</div><p class="pnote">Secretly choose: will your answer be TRUE or a LIE?</p>';
        body.innerHTML = h;
        ctx.actions([{ label: S.truth || 'TRUTH', alt: true, on: function () { st.truth = true; st.phase = 'answer'; WU.sound.clack(); render(); } },
          { label: 'LIE', on: function () { st.truth = false; st.phase = 'answer'; WU.sound.clack(); render(); } }]);
      } else if (st.phase === 'answer') {
        h += '<div class="mbig">' + esc(st.q.text) + '</div>' + (S.ruleShow && S.rule ? '<p class="pnote big">' + esc(S.rule) + '</p>' : '') +
          '<p class="pnote">Show the screen. Answer out loud with details. Each friend asks one follow-up question.</p>' +
          '<p class="pnote">' + esc(S.vote || 'Vote! TRUTH or LIE?') + '</p>';
        body.innerHTML = h;
        ctx.actions([{ label: 'Run the detector', on: function () { st.phase = 'scan'; render(); setTimeout(function () { if (st && st.phase === 'scan') { st.phase = 'reveal'; WU.sound.slam(); render(); } }, WU.isCalm() ? 50 : 1600); } }]);
      } else if (st.phase === 'scan') {
        body.innerHTML = '<div class="mbig">' + esc(st.q.text) + '</div><div class="mscan">' + esc(S.scanning || 'ANALYSING...') + '</div>';
        ctx.actions([]);
      } else {
        h += '<div class="mbig">' + esc(st.q.text) + '</div><div class="pbanner ' + (st.truth ? 'ok' : 'no') + ' mreveal">' + esc(st.truth ? S.truth || 'TRUTH' : S.lie || 'LIE!') + '</div>' +
          '<p class="pnote">Who guessed right? Now pass the phone to the next person.</p>';
        body.innerHTML = h;
        ctx.actions([{ label: 'Next question', on: start }]);
      }
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= NAME WALL (solo: your introduction, then a friend's) ======================= */
  P.games.names = (function () {
    var body, ctx, st;
    function start() { st = { step: 0, out: [] }; render(); }
    function render() {
      var S = ctx.S, steps = [
        { label: S.meetTag || 'ROUND 1: MEET', q: 'Introduce yourself. Fill the gaps.', frame: S.meetFrame || "Hi! I'm ___. I like ___." },
        { label: S.rememberTag || 'ROUND 2: REMEMBER', q: 'Now a classmate: who are they? What do you remember?', frame: S.recallFrame || "That's ___! He / She likes ___." }
      ], h = '';
      if (st.step >= steps.length) {
        h += '<div class="pbanner ok">Ready for class!</div>' + st.out.map(function (o) { return '<div class="pans small">' + esc(o) + '</div>'; }).join('') +
          '<p class="pnote">Say both out loud three times, faster each time.</p>';
        body.innerHTML = h; ctx.actions([{ label: 'Again', on: start }]); return;
      }
      var s = steps[st.step];
      h += '<span class="ptag" style="background:var(--c)">' + esc(s.label) + '</span><p class="pq">' + esc(s.q) + '</p><div class="mfill-in"></div>' +
        ((st.step ? S.recallRuleShow && S.recallRule : S.meetRuleShow && S.meetRule) ? '<p class="pnote">' + esc(st.step ? S.recallRule : S.meetRule) + '</p>' : '');
      body.innerHTML = h;
      var f = frameInputs(body.querySelector('.mfill-in'), s.frame);
      ctx.actions([{ label: 'Done', on: function () { if (!f.done()) { P.toast('Fill every gap.'); return; } st.out.push(f.text()); st.step++; ctx.score(true); WU.sound.ding(); render(); } }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= STAND UP IF... (solo: true for you? say more, or ask) ======================= */
  P.games.standup = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function start() { var s = deck(list('standup', 'sentences', ctx).filter(function (x) { return x.text; })); if (!s) { ctx.empty(); return; } st = { s: s, phase: 'ask' }; render(); }
    function render() {
      var S = ctx.S, s = st.s, h = picHTML(s.pic) + '<div class="mbig">' + esc(s.text) + '</div>';
      if (st.phase === 'ask') {
        h += '<p class="pnote big">' + esc(S.ready || 'Is it true for you?') + '</p>';
        body.innerHTML = h;
        ctx.actions([{ label: 'Not true', alt: true, on: function () { st.phase = 'no'; render(); } }, { label: 'True: I stand up!', on: function () { st.phase = 'yes'; WU.sound.ding(); render(); } }]);
        return;
      }
      if (st.phase === 'yes') h += '<p class="pq">' + esc(S.say || 'Tell us more!') + '</p><div class="mfill-in"></div>';
      else if (st.phase === 'no') h += '<p class="pq">' + esc(S.ask || 'Ask a standing student one question.') + '</p><div class="mfill-in"></div>';
      else h += '<div class="pbanner ok">Nice!</div><div class="pans small">' + esc(st.out) + '</div><p class="pnote">Say it out loud.</p>';
      body.innerHTML = h;
      if (st.phase === 'done') { ctx.actions([{ label: 'Next', on: start }]); return; }
      var f = frameInputs(body.querySelector('.mfill-in'), st.phase === 'yes' ? (s.follow || S.frame || 'Yes! ___') : '___?', st.phase === 'no' ? 'Your question' : '...');
      ctx.actions([{ label: 'Done', on: function () {
        if (!f.done()) { P.toast('Write it first.'); return; }
        var t = f.text(); if (st.phase === 'no' && !/\?\s*$/.test(t)) t += '?';
        if (words(t) < 3) { P.toast('A bit more, please.'); return; }
        st.out = t; st.phase = 'done'; ctx.score(true); WU.sound.ding(); render();
      } }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= FOUR ZONES (solo: choose, give a reason, then argue for another zone) ======================= */
  P.games.zones = (function () {
    var body, ctx, st, deck = WU.kit.deck(), COL = ['#ff4b4b', '#3d6bff', '#33c24d', '#ffe600'];
    function start() { var q = deck(list('zones', 'questions', ctx).filter(function (x) { return x.q && x.a1; })); if (!q) { ctx.empty(); return; } st = { q: q, pick: null, second: null, out: [] }; render(); }
    function render() {
      var S = ctx.S, q = st.q, h = '<div class="mbig">' + esc(q.q) + '</div>', stage = st.pick == null ? 0 : st.out.length === 0 ? 1 : st.second == null ? 2 : st.out.length === 1 ? 3 : 4;
      h += '<div class="mzones">' + [1, 2, 3, 4].map(function (i) {
        var a = q['a' + i]; if (!a) return '';
        var cls = (st.pick === i ? ' on' : '') + (st.second === i ? ' on2' : '');
        return '<button class="mzone' + cls + '" data-z="' + i + '" style="--z:' + COL[i - 1] + '">' + picHTML(q['p' + i]) + '<b>' + esc(a) + '</b></button>';
      }).join('') + '</div>';
      var frame = q.frame || S.frame || 'I chose ___ because ___.';
      if (stage === 0) h += '<p class="pnote big">' + esc(S.rule || 'Choose one answer.') + '</p>';
      if (stage === 1 || stage === 3) h += '<p class="pq">' + (stage === 1 ? esc(S.talk || 'Why?') : 'Now argue for another zone: why might someone choose it?') + '</p><div class="mfill-in"></div>';
      if (stage === 2) h += '<p class="pnote big">Good! Now tap ANOTHER zone.</p>';
      if (stage === 4) h += '<div class="pbanner ok">Two sides!</div>' + st.out.map(function (o) { return '<div class="pans small">' + esc(o) + '</div>'; }).join('');
      body.innerHTML = h;
      body.querySelectorAll('[data-z]').forEach(function (b) { b.onclick = function () { var z = +b.getAttribute('data-z'); if (stage === 0) { st.pick = z; WU.sound.clack(); render(); } else if (stage === 2 && z !== st.pick) { st.second = z; WU.sound.clack(); render(); } }; });
      if (stage === 1 || stage === 3) {
        var a = q['a' + (stage === 1 ? st.pick : st.second)], f = frameInputs(body.querySelector('.mfill-in'), stage === 1 ? frame.replace('___', a) : 'Some people choose ' + a + ' because ___.');
        ctx.actions([{ label: 'Done', on: function () { if (!f.done() || words(f.text()) < 6) { P.toast('Give a real reason.'); return; } st.out.push(f.text()); ctx.score(true); WU.sound.ding(); render(); } }]);
      } else ctx.actions(stage === 4 ? [{ label: 'Next question', on: start }] : []);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= OPINION LINE (solo: where do you stand, why, and the other side) ======================= */
  P.games.opinion = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function start() { var s = deck(list('opinion', 'statements', ctx).filter(function (x) { return x.text; })); if (!s) { ctx.empty(); return; } st = { s: s, pos: null, out: [] }; render(); }
    function render() {
      var S = ctx.S, h = '<div class="mbig">“' + esc(st.s.text) + '”</div>', labels = [S.agree || 'AGREE', '', S.middle || 'NOT SURE', '', S.disagree || 'DISAGREE'];
      h += '<div class="mline">' + [0, 1, 2, 3, 4].map(function (i) { return '<button class="mspot' + (st.pos === i ? ' on' : '') + '" data-p="' + i + '"><i></i><span>' + esc(labels[i]) + '</span></button>'; }).join('') + '</div>';
      // stage -1: choose a spot; 0: why; 1: the other side; 2: done.
      var stage = st.pos == null ? -1 : st.out.length;
      if (stage === -1) h += '<p class="pnote big">Where do you stand on the line?</p>';
      else if (stage < 2) h += '<p class="pq">' + (stage === 0 ? esc(S.pairs || 'Explain.') : 'Now the other side: what would someone who disagrees with you say?') + '</p><div class="mfill-in"></div>';
      else h += '<div class="pbanner ok">You argued both sides!</div>' + st.out.map(function (o) { return '<div class="pans small">' + esc(o) + '</div>'; }).join('') + '<p class="pnote">Changed your mind? Tap a new spot on the line.</p>';
      body.innerHTML = h;
      body.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { st.pos = +b.getAttribute('data-p'); WU.sound.clack(); render(); }; });
      if (stage === 0 || stage === 1) {
        var f = frameInputs(body.querySelector('.mfill-in'), st.out.length === 0 ? (S.frame || "I'm standing here because ___.") : 'Some people think ___ because ___.');
        ctx.actions([{ label: 'Done', on: function () { if (!f.done() || words(f.text()) < 6) { P.toast('Give a real reason.'); return; } st.out.push(f.text()); ctx.score(true); WU.sound.ding(); render(); } }]);
      } else ctx.actions(stage >= 2 ? [{ label: 'Next statement', on: start }] : []);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= FIND SOMEONE WHO (solo: ask the question right, then report) ======================= */
  P.games.findwho = (function () {
    var body, ctx, st, deck = WU.kit.deck();
    function same(a, b) { var n = function (s) { return P.norm(s).replace(/\?/g, '').replace(/\b(do not)\b/g, "don't").trim(); }; return n(a) === n(b); }
    function start() {
      var t = deck(list('findwho', 'tasks', ctx).filter(function (x) { return x.task && x.ask; })); if (!t) { ctx.empty(); return; }
      st = { t: t, phase: 'ask', typed: '', tries: 0, who: WU.pick(NAMES), yes: Math.random() < 0.6 }; render();
    }
    function render() {
      var S = ctx.S, t = st.t, h = picHTML(t.pic) + '<div class="mbig">' + esc(t.task) + '</div>';
      if (st.phase === 'ask') {
        h += '<p class="pq">' + esc(st.who) + ' is next to you. What do you ask?</p>' +
          '<textarea class="pinput" rows="2" autocapitalize="sentences" spellcheck="false" placeholder="Your question?">' + esc(st.typed) + '</textarea>' +
          (st.tries ? '<div class="pmsg">Not quite. Look at the task again.' + (st.tries > 1 ? ' Starts: "' + esc(t.ask.split(' ').slice(0, 2).join(' ')) + '..."' : '') + '</div>' : '');
        body.innerHTML = h;
        var ta = body.querySelector('textarea'); ta.oninput = function () { st.typed = ta.value; };
        ctx.actions([{ label: 'Show me', alt: true, small: true, on: function () { st.phase = 'reply'; st.ok = false; ctx.score(false); render(); } },
          { label: 'Ask', on: function () { if (same(st.typed, t.ask)) { st.phase = 'reply'; st.ok = true; ctx.score(true); WU.sound.ding(); render(); } else { st.tries++; WU.sound.beep(300); render(); } } }]);
        return;
      }
      if (st.phase === 'reply') {
        h += '<div class="plabel">' + esc(S.askLabel || 'Ask:') + '</div><div class="pans small">' + esc(t.ask) + '</div>' +
          '<div class="mbubble">' + esc(st.who) + ': “' + esc(st.yes ? t.yes : t.no) + '”</div>' +
          (st.yes && t.follow ? '<p class="pnote">' + esc(S.followLabel || 'After a YES, ask:') + ' <b>' + esc(t.follow) + '</b></p>' : '') +
          '<p class="pq">Report to the class:</p><div class="mfill-in"></div>';
        body.innerHTML = h;
        var rep = st.yes ? (t.report || '___ ___.') : 'I asked ' + st.who + '. ___.';
        var f = frameInputs(body.querySelector('.mfill-in'), rep);
        ctx.actions([{ label: 'Done', on: function () { if (!f.done()) { P.toast('Fill every gap.'); return; } st.out = f.text(); st.phase = 'done'; WU.sound.ding(); render(); } }]);
        return;
      }
      h += '<div class="pbanner ok">Reported!</div><div class="pans small">' + esc(st.out) + '</div><p class="pnote">Say it out loud.</p>';
      body.innerHTML = h; ctx.actions([{ label: 'Next task', on: start }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; start(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= SPEED CHAT (solo: answer fast, rounds get shorter) ======================= */
  P.games.chat = (function () {
    var body, ctx, st, deck = WU.kit.deck(), bar, barEl;
    function rounds() { return Math.max(1, Math.min(8, +ctx.S.rounds || 4)); }
    function secsFor(r) { var S = ctx.S; return Math.max(+S.minSeconds || 20, (+S.seconds || 60) - r * (+S.step || 10)) / 2; }
    function start() { st = { r: 0, done: [] }; round(); }
    function round() {
      var q = deck(list('chat', 'questions', ctx).filter(function (x) { return x.ask; })); if (!q) { ctx.empty(); return; }
      st.q = q; st.phase = 'go'; render();
      bar.start(Math.round(secsFor(st.r)), function () { if (st && st.phase === 'go') { st.done.push({ q: q.ask, a: '(time!)' }); WU.sound.buzzer(); nextRound(); } });
    }
    function nextRound() { st.r++; if (st.r >= rounds()) { st.phase = 'end'; bar.stop(); ctx.score(st.done.filter(function (d) { return d.a !== '(time!)'; }).length === rounds()); render(); } else round(); }
    function render() {
      var S = ctx.S, h = '';
      if (st.phase === 'end') {
        h += '<div class="pbanner ok">' + esc(S.freeze || 'FREEZE!') + '</div>' + st.done.map(function (d) { return '<div class="plabel">' + esc(d.q) + '</div><div class="pans small">' + esc(d.a) + '</div>'; }).join('') +
          '<p class="pnote">Now ask a friend or family member one of these, and report: ' + esc(S.reportFrame || 'I talked to ___. He / She said ___.') + '</p>';
        body.innerHTML = h; ctx.actions([{ label: 'Play again', on: start }]); return;
      }
      var q = st.q;
      h += '<div class="prow"><span class="ptag" style="background:var(--c)">' + esc(P.fill(S.round || 'ROUND {n} / {total}', { n: st.r + 1, total: rounds() })) + '</span><span class="pcount">' + Math.round(secsFor(st.r)) + 's</span></div>' +
        '<div class="pbarwrap"></div>' + picHTML(q.pic) + '<div class="plabel">' + esc(S.askLabel || 'Ask:') + '</div><div class="mbig">' + esc(q.ask) + '</div>' +
        '<div class="plabel">' + esc(S.answerLabel || 'Answer:') + '</div><div class="mfill-in"></div>';
      body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
      var f = frameInputs(body.querySelector('.mfill-in'), q.answer || '___.');
      ctx.actions([{ label: 'Next!', on: function () { if (!f.done()) { P.toast('Fill every gap. Fast!'); return; } st.done.push({ q: q.ask, a: f.text() }); WU.sound.ding(); nextRound(); } }]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); start(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();
})();
