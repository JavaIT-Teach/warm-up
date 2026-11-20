/* Warm Up: WORD HUNT (reading). A letter grid hides words from the last lessons. The class reads the clues (Beginner:
   the words and pictures), finds a word, says it and shows where it is (column letter + row number, or a finger on the board).
   Up / Down choose a clue, Enter (or a tap on the clue) marks it found: the word lights up in the grid.
   Space starts the timer (the grid stays hidden until then) and pauses it. H flashes the first letter of the chosen word.
   A shows every word. N next puzzle (the next set), R the same set in a new grid. Teams: 1-4 give points.
   Content: content/hunt.js through the edit layer (Edit mode, E). Grid letters are generated from the words (data-auto). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var COLS = ['#c6ff00', '#ff4fc3', '#00e5c7', '#ffe600', '#ff9a1f', '#8fdcff', '#b48cff', '#7dff9b', '#ffb6de', '#f2c26b', '#ff7a7a', '#a7f0ff'];

  var scr = kit.screen({
    game: 'hunt', title: 'Word Hunt', content: function () { return WU.content.huntScreen; },
    fields: [
      { type: 'head', label: 'Before the start' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'ready', label: 'Big line on the hidden grid', type: 'text', max: 60 },
      { k: 'go', label: 'Start word', type: 'text', max: 16 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'The grid' },
      { k: 'size', label: 'Letters per row (8-14)', type: 'num', min: 8, max: 14 },
      { k: 'max', label: 'Words per puzzle (3-10)', type: 'num', min: 3, max: 10 },
      { k: 'diag', label: 'Diagonal words', type: 'bool', on: 'On', off: 'Off' },
      { k: 'seconds', label: 'Timer (seconds, 0 = no timer)', type: 'num', min: 0, max: 600 },
      { type: 'head', label: 'The clues' },
      { k: 'showWords', label: 'Show the words (not the clues)', type: 'bool', on: 'Words + pictures', off: 'Clues' },
      { k: 'lenShow', label: 'Number of letters after each clue', type: 'bool' },
      { k: 'found', label: 'Counter word ("3 / 8 found")', type: 'text', max: 16 },
      { type: 'head', label: 'The end' },
      { k: 'timeUp', label: 'Time is up', type: 'text', max: 20 },
      { k: 'allFound', label: 'Every word found', type: 'text', max: 24 },
      { k: 'missed', label: 'Label before the words nobody found', type: 'text', max: 30 },
      { k: 'demo', label: 'Teacher demo banner (first puzzle only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('hunt', 'sets', {
    gameTitle: 'Word Hunt', label: 'Puzzles (sets)',
    defaults: function (l) { return WU.content.hunt[l].sets; },
    norm: function (r) { return { name: r.name || '' }; },
    title: function (it) { return it.name || '(no name)'; },
    fields: function () { return [{ k: 'name', label: 'Name (shown above the clues)', type: 'text', max: 40 }]; },
    blank: function () { return { name: 'My words' }; }
  });
  function setOptions(l) {
    return WU.list('hunt', 'sets', l).map(function (s) { return [s.id, s.name || s.id]; });
  }
  WU.registerList('hunt', 'words', {
    gameTitle: 'Word Hunt', label: 'Words and clues',
    defaults: function (l) { return WU.content.hunt[l].words; },
    norm: function (r) { return { set: r.set || '', word: r.word || '', clue: r.clue || '', pic: r.pic || '' }; },
    title: function (it) { return (it.word || '(empty)') + (it.clue ? ' · ' + it.clue : ''); },
    fields: function (l) {
      return [
        { k: 'set', label: 'Puzzle', type: 'select', options: setOptions(l) },
        { k: 'word', label: 'Word (letters only go in the grid)', type: 'text', max: 14 },
        { k: 'clue', label: 'Clue (___ = the word)', type: 'text', max: 90 },
        { k: 'pic', label: 'Picture', type: 'pic' }
      ];
    },
    blank: function (l) { var s = WU.list('hunt', 'sets', l)[0]; return { set: s ? s.id : '', word: 'word', clue: 'A clue for the word.', pic: '' }; }
  });

  var sh, box, st, timer = null, offContent = null, hintT = null;

  function letters(w) { return String(w || '').toUpperCase().replace(/[^A-Z]/g, ''); }
  function sets() { return WU.list('hunt', 'sets', WU.state.level).filter(function (s) { return wordsOf(s.id).length; }); }
  var deck = kit.deck(), setDeck = kit.deck();
  function wordsOf(sid) { return WU.list('hunt', 'words', WU.state.level).filter(function (w) { return w.set === sid && letters(w.word).length >= 2; }); }
  function curSet() { return WU.list('hunt', 'sets', WU.state.level).filter(function (s) { return s.id === st.set; })[0] || null; }
  function wordById(id) { return WU.list('hunt', 'words', WU.state.level).filter(function (w) { return w.id === id; })[0] || null; }
  function S() { return scr.get(); }
  function size() { return Math.max(8, Math.min(14, Math.round(+S().size || 11))); }
  function maxWords() { return Math.max(3, Math.min(10, Math.round(+S().max || 8))); }
  function ek(id, f) { return WU.editAttr('hunt', 'words', id, f); }

  /* ---------- the grid ---------- */
  function build() {
    var n = size(), dirs = [[0, 1], [1, 0]], grid = [], i, placed = [];
    if (S().diag) dirs.push([1, 1]);
    for (i = 0; i < n * n; i++) grid.push('');
    var pool = wordsOf(st.set).filter(function (w) { return letters(w.word).length <= n; });
    var chosen = kit.drawN(deck, pool, maxWords()).sort(function (a, b) { return letters(b.word).length - letters(a.word).length; });
    chosen.forEach(function (w) {
      var L = letters(w.word);
      for (var t = 0; t < 400; t++) {
        var d = dirs[WU.rand(dirs.length)], r0 = WU.rand(n - d[0] * (L.length - 1)), c0 = WU.rand(n - d[1] * (L.length - 1)), ok = true, cells = [];
        for (var k = 0; k < L.length; k++) {
          var idx = (r0 + d[0] * k) * n + (c0 + d[1] * k);
          if (grid[idx] && grid[idx] !== L[k]) { ok = false; break; }
          cells.push(idx);
        }
        // Do not hide a word completely inside another one.
        if (ok && cells.every(function (x) { return grid[x]; })) ok = false;
        if (!ok) continue;
        cells.forEach(function (x, k) { grid[x] = L[k]; });
        placed.push({ id: w.id, cells: cells });
        return;
      }
    });
    for (i = 0; i < n * n; i++) if (!grid[i]) grid[i] = LET[WU.rand(26)];
    // Clues in a fixed, readable order: the order of the content.
    var order = wordsOf(st.set).map(function (w) { return w.id; });
    placed.sort(function (a, b) { return order.indexOf(a.id) - order.indexOf(b.id); });
    st.n = n; st.grid = grid; st.placed = placed; st.found = {}; st.sel = 0; st.flash = null;
  }
  function newPuzzle(nextSet) {
    var ss = sets();
    if (!ss.length) { st.set = null; st.placed = []; st.grid = []; st.n = size(); return; }
    var i = ss.map(function (s) { return s.id; }).indexOf(st.set);
    if (nextSet || i < 0) { var others = ss.filter(function (s) { return s.id !== st.set; }); st.set = setDeck(others.length ? others : ss).id; }
    build();
  }
  function placedWords() { return st.placed.map(function (p) { return { p: p, w: wordById(p.id) }; }).filter(function (x) { return x.w; }); }
  function foundCount() { return placedWords().filter(function (x) { return st.found[x.p.id]; }).length; }

  /* ---------- drawing ---------- */
  function gridHtml() {
    var n = st.n, cell = Math.floor(Math.min(760 / (n + 0.7), 80)), lab = Math.round(cell * 0.7), side = lab + n * cell;
    var hidden = st.phase === 'ready', h = '';
    var lit = {}, show = st.phase === 'end';
    placedWords().forEach(function (x, i) { if (st.found[x.p.id]) x.p.cells.forEach(function (c) { lit[c] = COLS[i % COLS.length]; }); });
    h += '<div class="whgrid' + (hidden ? ' hid' : '') + '" style="width:' + side + 'px;height:' + side + 'px;--c:' + cell + 'px;--lab:' + lab + 'px">';
    // Column letters and row numbers so students can say where a word is.
    for (var c = 0; c < n; c++) h += '<div class="whlab" data-auto style="left:' + (lab + c * cell) + 'px;top:0;width:' + cell + 'px;height:' + lab + 'px">' + LET[c] + '</div>';
    for (var r = 0; r < n; r++) h += '<div class="whlab" data-auto style="left:0;top:' + (lab + r * cell) + 'px;width:' + lab + 'px;height:' + cell + 'px">' + (r + 1) + '</div>';
    h += '<div class="whbox" style="left:' + lab + 'px;top:' + lab + 'px;width:' + (n * cell) + 'px;height:' + (n * cell) + 'px">';
    // Found words: a highlighter stroke behind the letters.
    h += '<svg class="whsvg" viewBox="0 0 ' + (n * cell) + ' ' + (n * cell) + '">';
    placedWords().forEach(function (x, i) {
      var f = st.found[x.p.id]; if (!f && !show) return;
      var a = x.p.cells[0], b = x.p.cells[x.p.cells.length - 1];
      var x1 = (a % n + 0.5) * cell, y1 = (Math.floor(a / n) + 0.5) * cell, x2 = (b % n + 0.5) * cell, y2 = (Math.floor(b / n) + 0.5) * cell;
      h += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (f ? COLS[i % COLS.length] : '#c9c9c9') + '" stroke-width="' + (cell * (f ? 0.74 : 0.6)) + '" stroke-linecap="round" class="' + (f ? 'on' : 'miss') + '"/>';
    });
    h += '</svg>';
    st.grid.forEach(function (ch, idx) {
      var cls = 'whc' + (lit[idx] ? ' lit' : '') + (st.flash === idx ? ' flash' : '');
      h += '<div class="' + cls + '" data-auto style="left:' + ((idx % n) * cell) + 'px;top:' + (Math.floor(idx / n) * cell) + 'px;width:' + cell + 'px;height:' + cell + 'px;font-size:' + Math.round(cell * 0.62) + 'px">' + (hidden ? '' : ch) + '</div>';
    });
    h += '</div>';
    if (hidden) h += '<div class="whready" style="left:' + lab + 'px;top:' + lab + 'px;width:' + (n * cell) + 'px;height:' + (n * cell) + 'px"><div class="whready-t"' + scr.ea('ready') + '>' + WU.esc(S().ready) + '</div>' +
      '<div class="whgo"' + scr.ea('go') + '>' + WU.esc(S().go) + '</div><div class="whkey" data-ctrl>SPACE</div></div>';
    h += '</div>';
    return h;
  }
  function cluesHtml() {
    var s = S(), set = curSet(), pw = placedWords(), words = !!s.showWords, h = '';
    h += '<div class="whside"><div class="whtop">' + (set ? '<div class="whset"' + WU.editAttr('hunt', 'sets', set.id, 'name') + '>' + WU.esc(set.name) + '</div>' : '') +
      '<div class="whcount"><b data-auto>' + foundCount() + ' / ' + pw.length + '</b> <span' + scr.ea('found') + '>' + WU.esc(s.found) + '</span></div>' +
      '<div class="whtimer"></div></div>';
    h += '<div class="whlist' + (pw.length > 8 ? ' many' : '') + '">';
    pw.forEach(function (x, i) {
      var w = x.w, f = !!st.found[w.id], miss = !f && st.phase === 'end', selc = st.sel === i && st.phase === 'run';
      var showPic = w.pic && (words || f || miss);
      h += '<div class="whrow' + (f ? ' got' : '') + (miss ? ' miss' : '') + (selc ? ' sel' : '') + '" data-i="' + i + '" style="--wc:' + COLS[i % COLS.length] + '">' +
        '<div class="whn" data-auto>' + (i + 1) + '</div>' +
        (showPic ? '<div class="whpic"' + ek(w.id, 'pic') + '>' + WU.pic(w.pic) + '</div>' : '') +
        '<div class="wht">';
      if (words) h += '<span class="whw"' + ek(w.id, 'word') + '>' + WU.esc(w.word) + '</span>';
      else {
        h += '<span class="whclue"' + ek(w.id, 'clue') + '>' + WU.esc(w.clue) + '</span>' + (s.lenShow && !f && !miss ? ' <span class="whlen" data-auto>(' + letters(w.word).length + ')</span>' : '');
        if (f || miss) h += ' <span class="whw sm"' + ek(w.id, 'word') + '>' + WU.esc(w.word) + '</span>';
      }
      h += '</div></div>';
    });
    h += '</div>';
    if (st.phase === 'end') {
      var all = foundCount() === pw.length, missed = pw.filter(function (x) { return !st.found[x.w.id]; });
      h += '<div class="whend"><div class="whbig"' + scr.ea(all ? 'allFound' : 'timeUp') + '>' + WU.esc(all ? s.allFound : s.timeUp) + '</div>' +
        (missed.length ? '<div class="whmiss"><b' + scr.ea('missed') + '>' + WU.esc(s.missed) + '</b> <span data-auto>' + missed.length + '</span></div>' : '') + '</div>';
    } else if (s.ruleShow && s.rule) h += '<div class="rule whrule"' + scr.ea('rule') + '>' + WU.esc(s.rule) + '</div>';
    h += '</div>';
    return h;
  }
  function render() {
    var s = S(), h = '';
    h += '<div class="whhead">' + kit.chip(s.tag, scr.ea('tag'), '#ffe600') + (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (!st.set) h += '<div class="whempty" data-ctrl>No words for this level yet. Press E to add some.</div>';
    else h += gridHtml() + cluesHtml();
    box.querySelector('.layer').innerHTML = h;
    var tw = box.querySelector('.whtimer');
    if (tw && timer) tw.appendChild(timer.el);
    box.querySelectorAll('.whrow').forEach(function (r) {
      r.onclick = function (e) { if (WU.editing) return; e.stopPropagation(); st.sel = +r.getAttribute('data-i'); toggleFound(); };
      kit.fit(r.querySelector('.wht'), r.classList.contains('sm') ? 30 : (S().showWords ? 50 : 36), 18);
    });
    kit.fit(box.querySelector('.whset'), 40, 22);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, hs;
    if (ph === 'ready') hs = [['SPACE', 'start'], ['N', 'next puzzle'], ['R', 'new grid'], ['Esc', 'home']];
    else if (ph === 'run') hs = [['↑ ↓', 'choose'], ['ENTER', 'found!'], ['H', 'first letter'], ['SPACE', 'pause'], ['A', 'show all'], ['Esc', 'home']];
    else hs = [['N', 'next puzzle'], ['R', 'new grid'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function makeTimer() {
    if (timer) timer.destroy();
    var sec = Math.max(0, Math.min(600, +S().seconds || 0));
    timer = sec ? WU.Timer({ seconds: sec, size: 130, onDone: function () { if (st && st.phase === 'run') end(); } }) : null;
  }
  function start() {
    st.phase = 'run'; st.demo = st.demo && !st.moved; st.moved = true;
    makeTimer(); render(); if (timer) timer.start(); WU.sound.slam();
  }
  function end() { st.phase = 'end'; if (timer && timer.isRunning()) timer.toggle(); WU.sound.ding(); render(); }
  function toggleFound() {
    if (st.phase !== 'run') return;
    var pw = placedWords(), x = pw[st.sel]; if (!x) return;
    if (st.found[x.w.id]) delete st.found[x.w.id]; else { st.found[x.w.id] = true; WU.sound.ding(); }
    if (foundCount() === pw.length) { end(); return; }
    // Move on to the next clue nobody has found yet.
    if (st.found[x.w.id]) for (var k = 1; k <= pw.length; k++) { var j = (st.sel + k) % pw.length; if (!st.found[pw[j].w.id]) { st.sel = j; break; } }
    render();
  }
  function hint() {
    var x = placedWords()[st.sel]; if (!x || st.found[x.w.id]) return;
    st.flash = x.p.cells[0]; WU.sound.beep(880); render();
    clearTimeout(hintT); hintT = setTimeout(function () { if (st) { st.flash = null; render(); } }, 1600);
  }
  function fresh(nextSet) { clearTimeout(hintT); if (timer) { timer.destroy(); timer = null; } st.phase = 'ready'; if (st.moved) st.demo = false; newPuzzle(nextSet); WU.sound.pop(); render(); }
  function keyAction(k) {
    var ph = st.phase, pw = st.placed ? placedWords() : [];
    if (k === 'SPACE') { if (ph === 'ready') start(); else if (ph === 'run' && timer) { timer.toggle(); } }
    else if (k === 'UP' || k === 'DOWN' || k === '↑ ↓') { if (ph === 'run' && pw.length) { st.sel = (st.sel + (k === 'UP' ? -1 : 1) + pw.length) % pw.length; WU.sound.clack(); render(); } }
    else if (k === 'ENTER') toggleFound();
    else if (k === 'H') { if (ph === 'run') hint(); }
    else if (k === 'A') { if (ph === 'run') end(); }
    else if (k === 'N') { st.moved = true; fresh(true); }
    else if (k === 'R') { st.moved = true; fresh(false); }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!S().demoShow;
    var ss = sets();
    // Content changed: keep the grid if its words are still there, otherwise build a new one.
    if (!st.set || !ss.some(function (s) { return s.id === st.set; }) || st.placed.some(function (p) { var w = wordById(p.id); return !w || w.set !== st.set; }) || st.n !== size()) newPuzzle(false);
    render();
  }

  WU.views.hunt = {
    title: 'Word Hunt',
    teacher: function () {
      if (!st || !st.set) return null;
      var n = st.n, sec = [], info = [];
      sec.push({ label: 'Where the words are', html: placedWords().map(function (x, i) {
        var a = x.p.cells[0], b = x.p.cells[1], d = b - a === 1 ? 'across' : b - a === n ? 'down' : 'diagonal';
        return '<div' + (st.found[x.w.id] ? ' style="opacity:.45"' : '') + '><b>' + (i + 1) + '. ' + WU.esc(x.w.word) + '</b> · ' + LET[a % n] + (Math.floor(a / n) + 1) + ' ' + d + '</div>';
      }).join('') });
      var set = curSet(); if (set) info.push({ label: 'Puzzle', text: set.name });
      info.push({ label: 'Found', text: foundCount() + ' / ' + placedWords().length });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['Space', 'start (shows the grid) / pause the timer'], ['Up / Down', 'choose a clue'], ['Enter', 'the chosen word is found (again = not found)'], ['Tap a clue', 'found'],
        ['H', 'flash the first letter of the chosen word'], ['A', 'show every word (end)'], ['N', 'next puzzle'], ['R', 'same words, new grid'], ['1 - 4', 'team point'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      el.innerHTML = '<div class="whg gg"><div class="layer"></div>' + kit.header('Word Hunt') + '<div class="hints"></div></div>';
      box = el.querySelector('.whg'); WU.wireCommon(el);
      var sb = WU.Scoreboard(box);
      sh = { root: el, sb: sb, toggleScores: function () { if (!sb) { WU.toast('Turn on teams in Settings first.'); return; } sb.show(!sb.visible()); }, destroy: function () { if (sb) sb.destroy(); } };
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = sh.toggleScores;
      st = { phase: 'ready', set: null, placed: [], grid: [], found: {}, sel: 0, demo: !!S().demoShow, moved: false };
      newPuzzle(false); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearTimeout(hintT); if (timer) timer.destroy(); timer = null; if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); keyAction(e.key === 'ArrowUp' ? 'UP' : 'DOWN'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { h: 'H', a: 'A', n: 'N', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
