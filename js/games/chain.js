/* Warm Up: WORD CHAIN.
   The screen picks a student; they say a word that starts with the last letter of the previous word before the timer runs out.
   Too slow = out. Students who are out become judges. Last one standing wins.
   Beginner: the screen shows a picture that starts with the right letter; the student says what it is.
   Keys: Space correct / next student, X out, P pass (Beginner), T choose a topic (at the start), R start again.
   The teacher may type the word (letters, Backspace, Enter); the screen then shows it and checks it. Shift+X types an X.
   Content: content/chain.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'chain', title: 'Word Chain', content: function () { return WU.content.chainScreen; },
    fields: [
      { type: 'head', label: 'Rules' },
      { k: 'mode', label: 'Words', type: 'select', options: [['pictures', 'Pictures (the screen shows what to say)'], ['any', 'Any word'], ['long', 'Long words (minimum length below)'], ['topic', 'One topic (T chooses it at the start)']] },
      { k: 'secs', label: 'Seconds per turn', type: 'num', min: 3, max: 60 },
      { k: 'minLen', label: 'Minimum word length (0 = any)', type: 'num', min: 0, max: 12 },
      { k: 'passes', label: 'Passes per student', type: 'num', min: 0, max: 5 },
      { type: 'head', label: 'Screen' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'start', label: 'First turn', type: 'text', max: 40 },
      { k: 'turn', label: 'Whose turn ({name})', type: 'text', max: 40 },
      { k: 'letter', label: 'Above the letter', type: 'text', max: 20 },
      { k: 'frame', label: 'Sentence frame (empty = none)', type: 'text', max: 40 },
      { k: 'lenRule', label: 'Length rule ({n})', type: 'text', max: 40 },
      { k: 'topicLine', label: 'Topic line ({topic})', type: 'text', max: 40 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'wrongStart', label: 'Typed word: wrong first letter ({letter})', type: 'text', max: 30 },
      { k: 'short', label: 'Typed word: too short', type: 'text', max: 30 },
      { k: 'used', label: 'Typed word: already used', type: 'text', max: 30 },
      { k: 'timeUp', label: 'Time up', type: 'text', max: 12 },
      { type: 'head', label: 'Judges and winner' },
      { k: 'judgesTag', label: 'Judges tag', type: 'text', max: 20 },
      { k: 'judges', label: 'Judges line', type: 'text', max: 60 },
      { k: 'out', label: 'Out ({name})', type: 'text', max: 50 },
      { k: 'winTag', label: 'Winner tag', type: 'text', max: 20 },
      { k: 'win', label: 'Winner ({name})', type: 'text', max: 30 },
      { k: 'demo', label: 'Teacher demo banner (first turn only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { k: 'demoWho', label: 'Name in the demo turn', type: 'text', max: 16 }
    ]
  });
  WU.registerList('chain', 'pictures', {
    gameTitle: 'Word Chain', label: 'Pictures (Beginner)',
    defaults: function (l) { return WU.content.chain[l].pictures; },
    norm: function (r) { var p = WU.PICS[r.pic]; return { pic: r.pic || '', text: r.text || (p ? p.name : '') }; },
    fields: function () { return [{ k: 'pic', label: 'Picture', type: 'pic' }, { k: 'text', label: 'Word (the student says it)', type: 'text', max: 30 }]; },
    blank: function () { return { pic: 'star', text: 'star' }; }
  });
  WU.registerList('chain', 'topics', {
    gameTitle: 'Word Chain', label: 'Topics',
    defaults: function (l) { return WU.content.chain[l].topics; },
    norm: function (r) { return { text: r.text || '' }; },
    fields: function () { return [{ k: 'text', label: 'Topic', type: 'text', max: 40 }]; },
    blank: function () { return { text: 'New topic' }; }
  });

  var root, box, st, sb = null, offContent = null, iv = null, timers = [];

  function S() { return scr.get(); }
  function mode() { return st.topic ? 'topic' : S().mode || 'any'; }
  function secs() { return Math.max(3, Math.min(60, +S().secs || 10)); }
  function minLen() { return mode() === 'long' ? Math.max(0, +S().minLen || 0) : 0; }
  function pics() { return WU.list('chain', 'pictures', WU.state.level).filter(function (x) { return x.text; }); }
  function picById(id) { return pics().filter(function (x) { return x.id === id; })[0] || null; }
  function topicItem() { return st.topic ? WU.list('chain', 'topics', WU.state.level).filter(function (x) { return x.id === st.topic; })[0] || null : null; }
  function clearT() { clearInterval(iv); iv = null; timers.forEach(clearTimeout); timers = []; }
  function norm(w) { return String(w || '').toLowerCase().replace(/[^a-z]/g, ''); }
  function lastLetter(w) { var n = norm(w); return n ? n.charAt(n.length - 1) : ''; }

  function reset() {
    clearT();
    st.alive = WU.roster().slice(); st.judges = []; st.chain = []; st.used = {}; st.letter = ''; st.cur = ''; st.buf = '';
    st.passes = {}; st.phase = 'ready'; st.pic = null; st.winner = ''; st.outMsg = ''; st.demo = !!S().demoShow; st.demoDone = false;
  }
  function pickPicture() {
    // A picture that starts with the letter and was not used yet; otherwise any unused one (the letter changes).
    var all = pics(), fresh = all.filter(function (x) { return !st.used[norm(x.text)]; });
    var fit = fresh.filter(function (x) { return !st.letter || norm(x.text).charAt(0) === st.letter; });
    var it = fit.length ? WU.pick(fit) : fresh.length ? WU.pick(fresh) : WU.pick(all);
    st.pic = it ? it.id : null;
    if (it && st.letter && norm(it.text).charAt(0) !== st.letter) st.letter = norm(it.text).charAt(0);
  }
  function nextPlayer() {
    if (st.demo && !st.demoDone) { st.cur = S().demoWho; st.isDemo = true; return; }
    st.isDemo = false;
    var others = st.alive.filter(function (n) { return n !== st.cur; });
    st.cur = WU.pick(others.length ? others : st.alive);
  }

  /* ---------- drawing ---------- */
  function check() {
    var w = norm(st.buf), s = S(), out = [];
    if (!w) return out;
    if (st.letter && w.charAt(0) !== st.letter) out.push(['wrongStart', kit.fill(s.wrongStart, { letter: st.letter.toUpperCase() })]);
    if (minLen() && w.length < minLen()) out.push(['short', s.short]);
    if (st.used[w]) out.push(['used', s.used]);
    return out;
  }
  function render() {
    var s = S(), ph = st.phase, h = '';
    h += '<div class="chead">' + kit.chip(s.tag, scr.ea('tag'), '#ff5a1f');
    if (mode() === 'long' && s.lenRule) h += '<div class="minfo"' + scr.ea('lenRule') + '>' + WU.esc(kit.fill(s.lenRule, { n: minLen() })) + '</div>';
    var tp = topicItem(); if (tp && s.topicLine) h += '<div class="minfo"' + scr.ea('topicLine') + '>' + WU.esc(kit.fill(s.topicLine, { topic: tp.text })) + '</div>';
    if (st.demo && !st.demoDone && s.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>';
    h += '</div><div class="cmain">';
    if (ph === 'win') {
      h += kit.chip(s.winTag, scr.ea('winTag'), '#c6ff00') + '<div class="cwin"' + scr.ea('win') + '>' + WU.esc(kit.fill(s.win, { name: st.winner })) + '</div>';
    } else if (ph === 'ready') {
      h += '<div class="cturn"' + scr.ea('start') + '>' + WU.esc(s.start) + '</div>';
      if (s.ruleShow && s.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(s.rule) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="go"><span class="key">SPACE</span><span>Start</span></div>' +
        (WU.list('chain', 'topics', WU.state.level).length && mode() !== 'pictures' ? '<div class="btn sm" data-b="topic"><span class="key">T</span><span>Choose a topic</span></div>' : '') + '</div>';
    } else {
      var nm = st.isDemo ? scr.ea('demoWho') : ' data-auto';
      h += '<div class="cturn"' + scr.ea('turn') + '>' + WU.esc(kit.fill(s.turn, { name: st.cur })) + '</div><div class="crow">';
      if (st.letter) h += '<div class="lbox">' + (s.letter ? '<div class="ll"' + scr.ea('letter') + '>' + WU.esc(s.letter) + '</div>' : '') + '<div class="lt" data-auto>' + st.letter.toUpperCase() + '</div></div>';
      if (mode() === 'pictures') {
        var it = picById(st.pic);
        if (it) h += '<div class="cpic" data-edit="chain:pictures:' + it.id + ':pic">' + WU.pic(it.pic) + '</div>';
        if (s.frame) h += kit.frame(s.frame, scr.ea('frame'));
      } else {
        var w = st.buf, bad = check();
        h += '<div class="cword" data-auto>' + (w ? WU.esc(w.slice(0, -1)) + '<span>' + WU.esc(w.slice(-1)) + '</span>' : '') + '</div>';
        if (bad.length) h += '<div class="cwarn">' + bad.map(function (b) { return '<div' + scr.ea(b[0]) + '>' + WU.esc(b[1]) + '</div>'; }).join('') + '</div>';
      }
      h += '</div>';
      h += '<div class="tbar"><div class="tfill"></div><div class="tnum" data-auto></div>' + (ph === 'timeup' ? '<div class="tup"' + scr.ea('timeUp') + '>' + WU.esc(s.timeUp) + '</div>' : '') + '</div>';
      if (st.outMsg) h += '<div class="rule hot"' + scr.ea('out') + '>' + WU.esc(st.outMsg) + '</div>';
      else if (s.ruleShow && s.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(s.rule) + '</div>';
    }
    // The chain so far.
    if (st.chain.length) h += '<div class="chist" data-auto>' + st.chain.slice(-6).map(function (c) {
      return '<div>' + (c.pic ? WU.pic(c.pic) : '') + '<span>' + WU.esc(c.w) + '</span></div>'; }).join('') + '</div>';
    h += '</div><div class="cside">' + kit.chip(s.judgesTag, scr.ea('judgesTag'), '#ff4fc3') +
      (st.judges.length && s.judges ? '<div class="jl"' + scr.ea('judges') + '>' + WU.esc(s.judges) + '</div>' : '') +
      '<div class="jn" data-auto>' + st.judges.slice(0, 16).map(function (n) { return '<div>' + WU.esc(n) + '</div>'; }).join('') +
      (st.judges.length > 16 ? '<div>+' + (st.judges.length - 16) + '</div>' : '') + '</div></div>';
    box.querySelector('.layer').innerHTML = h;
    var cw = box.querySelector('.cwin'); if (cw) kit.fit(cw, 150, 64);
    var ct = box.querySelector('.cturn'); if (ct) kit.fit(ct, 88, 48);
    var wd = box.querySelector('.cword'); if (wd) kit.fit(wd, 140, 56);
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function () { keyAction(b.getAttribute('data-b') === 'topic' ? 'T' : 'SPACE'); }; });
    drawBar(); renderHints();
  }
  function drawBar() {
    var f = box && box.querySelector('.tfill'), n = box && box.querySelector('.tnum'); if (!f) return;
    var left = st.phase === 'timeup' ? 0 : Math.max(0, st.end - Date.now()), p = left / (secs() * 1000);
    f.style.width = (p * 100) + '%';
    f.style.background = p > 0.5 ? '#c6ff00' : p > 0.25 ? '#ffe600' : '#ff2020';
    n.textContent = Math.ceil(left / 1000);
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, pics = mode() === 'pictures';
    var hs = ph === 'ready' ? [['SPACE', 'start']].concat(mode() !== 'pictures' ? [['T', 'topic']] : [], [['R', 'start again'], ['Esc', 'home']], sc)
      : ph === 'win' ? [['R', 'play again'], ['Esc', 'home']].concat(sc)
      : [['SPACE', 'correct'], ['X', 'out']].concat(pics ? [['P', 'pass'], ['R', 'start again']] : [['A-Z', 'type the word (optional)']], [['Esc', 'home']], sc);
    kit.hints(root, hs, function (k) { if (k !== 'A-Z') keyAction(k); });
  }

  /* ---------- flow ---------- */
  function startTurn() {
    clearT(); st.buf = ''; st.phase = 'turn';
    if (mode() === 'pictures') pickPicture();
    st.end = Date.now() + secs() * 1000; st.lastSec = null;
    render(); WU.sound.pop();
    iv = setInterval(function () {
      if (!st || st.phase !== 'turn') return;
      var left = st.end - Date.now(), s = Math.ceil(left / 1000);
      if (s !== st.lastSec) { st.lastSec = s; if (s > 0 && s <= 3) WU.sound.beep(s === 1 ? 880 : 660); }
      if (left <= 0) { clearInterval(iv); st.phase = 'timeup'; WU.sound.buzzer(); render(); return; }
      drawBar();
    }, 100);
  }
  function correct() {
    if (st.phase === 'ready') { nextPlayer(); startTurn(); return; }
    if (st.phase !== 'turn' && st.phase !== 'timeup') return;
    var word = '', pic = '';
    if (mode() === 'pictures') { var it = picById(st.pic); if (it) { word = it.text; pic = it.pic; } }
    else word = st.buf;
    if (word) { st.chain.push({ w: word, pic: pic }); st.used[norm(word)] = true; st.letter = lastLetter(word) || st.letter; }
    else st.letter = ''; // Word not typed: the class knows the letter.
    if (st.isDemo) st.demoDone = true;
    st.outMsg = ''; WU.sound.ding(); nextPlayer(); startTurn();
  }
  function out() {
    if (st.phase !== 'turn' && st.phase !== 'timeup') return;
    clearT();
    if (st.isDemo) { st.demoDone = true; nextPlayer(); startTurn(); return; }
    st.alive = st.alive.filter(function (n) { return n !== st.cur; });
    st.judges.push(st.cur); st.outMsg = kit.fill(S().out, { name: st.cur });
    WU.sound.buzzer();
    if (st.alive.length <= 1) { st.phase = 'win'; st.winner = st.alive[0] || ''; WU.sound.slam(); timers.push(setTimeout(function () { WU.sound.ding(); }, 300)); render(); return; }
    nextPlayer(); startTurn();
  }
  function pass() {
    if (mode() !== 'pictures' || (st.phase !== 'turn' && st.phase !== 'timeup')) return;
    var max = Math.max(0, +S().passes || 0), used = st.passes[st.cur] || 0;
    if (used >= max) { WU.toast('No passes left.'); return; }
    st.passes[st.cur] = used + 1; WU.sound.clack(); startTurn();
  }
  function chooseTopic() {
    if (st.phase !== 'ready' || mode() === 'pictures' && !st.topic) return;
    var list = WU.list('chain', 'topics', WU.state.level); if (!list.length) return;
    var others = list.filter(function (x) { return x.id !== st.topic; });
    st.topic = WU.pick(others.length ? others : list).id; WU.sound.clack(); render();
  }
  function refresh() { if (!st) return; if (st.phase === 'ready' && !st.chain.length) st.demo = !!S().demoShow; render(); }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('chain-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'SPACE' || k === 'ENTER') correct();
    else if (k === 'X') out();
    else if (k === 'P') pass();
    else if (k === 'T') chooseTopic();
    else if (k === 'R') { reset(); st.topic = null; render(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function typing() { return st && (st.phase === 'turn' || st.phase === 'timeup') && mode() !== 'pictures'; }

  WU.views.chain = {
    title: 'Word Chain',
    help: function () {
      return [['Space / Enter', 'correct: next student'], ['X', 'out (becomes a judge)'], ['P', 'pass (Beginner)'], ['T', 'choose a topic (at the start)'],
        ['A - Z', 'type the word (optional)'], ['Shift + X', 'type an X'], ['R', 'start again']];
    },
    mount: function (el) {
      root = el; st = { topic: null }; reset();
      el.innerHTML = '<div class="chaing"><div class="layer"></div>' + kit.header('Word Chain') + '<div class="hints"></div></div>';
      box = el.querySelector('.chaing');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('chain-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    // During a turn, letters type the word (before the E / M / F shortcuts). x on an empty word = out.
    grabKey: function (e) {
      if (!typing()) return false;
      var k = e.key;
      if (k === 'Backspace') { e.preventDefault(); st.buf = st.buf.slice(0, -1); render(); return true; }
      if (k.length === 1 && /[a-zA-Z'\-]/.test(k)) {
        if (!st.buf && k === 'x') return false;
        if (st.buf.length < 24) st.buf += k.toLowerCase(); render(); return true;
      }
      return false;
    },
    onKey: function (e) {
      if (!typing() && sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { x: 'X', p: 'P', t: 'T', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
