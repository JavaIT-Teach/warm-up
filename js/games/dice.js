/* Warm Up: STORY DICE.
   Picture dice roll. Pairs make a story with every picture (timer), then the class builds one story together:
   the screen picks who adds the next sentence.
   Keys: Space roll, N next student, Enter pause / go, C class story now.
   Content: content/dice.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var COLS = ['#c6ff00', '#ff4fc3', '#ffe600', '#00e5c7', '#ff5a1f', '#3d6bff'];

  var scr = kit.screen({
    game: 'dice', title: 'Story Dice', content: function () { return WU.content.diceScreen; },
    fields: [
      { type: 'head', label: 'Dice' },
      { k: 'dice', label: 'Number of dice', type: 'num', min: 1, max: 6 },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'qMark', label: 'Dice before the first roll', type: 'text', max: 4 },
      { k: 'frame', label: 'Sentence frame (empty = none)', type: 'text', max: 70, hint: 'Use ___ for the gap.' },
      { k: 'rule', label: 'Grammar rule', type: 'text', max: 80 },
      { k: 'ruleAlt', label: 'Second rule (optional: each roll picks one of the two at random)', type: 'text', max: 80 },
      { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Pairs' },
      { k: 'pairSecs', label: 'Pair time in seconds (0 = no pair time)', type: 'num', min: 0, max: 600 },
      { k: 'pairTag', label: 'Tag', type: 'text', max: 20 },
      { k: 'pairLine', label: 'Line', type: 'text', max: 60 },
      { type: 'head', label: 'Class story' },
      { k: 'classTag', label: 'Tag', type: 'text', max: 20 },
      { k: 'next', label: 'Next student ({name})', type: 'text', max: 60 },
      { k: 'count', label: 'Counter ({n})', type: 'text', max: 20 },
      { k: 'endAfter', label: 'Story ends after this many sentences (0 = never)', type: 'num', min: 0, max: 40 },
      { k: 'end', label: 'End line', type: 'text', max: 40 },
      { k: 'demo', label: 'Teacher demo banner (first story only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { k: 'demoWho', label: 'Name for the first sentence in the demo', type: 'text', max: 16 }
    ]
  });
  WU.registerList('dice', 'pictures', {
    gameTitle: 'Story Dice', label: 'Dice pictures',
    defaults: function (l) { return WU.content.dice[l].pictures; },
    norm: function (r) { var p = WU.PICS[r.pic]; return { pic: r.pic || '', text: r.text || (p ? p.name : '') }; },
    fields: function () {
      return [{ k: 'pic', label: 'Picture (library or upload)', type: 'pic' }, { k: 'text', label: 'Word under the picture', type: 'text', max: 30 }];
    },
    blank: function () { return { pic: 'star', text: 'star' }; }
  });

  var root, box, st, sb = null, clock = null, offContent = null, timers = [];

  function pool() { return WU.list('dice', 'pictures', WU.state.level).filter(function (x) { return x.pic || x.text; }); }
  function nDice() { return Math.max(1, Math.min(6, +scr.get().dice || 4)); }
  function face(id) { return pool().filter(function (x) { return x.id === id; })[0] || null; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }

  function dieHTML(i) {
    var id = st.faces[i], it = id && face(id), S = scr.get(), n = nDice(), size = n <= 3 ? 330 : n <= 4 ? 300 : n <= 5 ? 290 : 268;
    var on = st.phase === 'class' && st.focus === i;
    var h = '<div class="die' + (st.rolling[i] ? ' roll' : '') + (on ? ' on' : '') + '" style="width:' + size + 'px">' +
      '<div class="cube" style="height:' + size + 'px;background:' + (st.rolling[i] ? COLS[(i + st.tick) % 6] : '#fff') + '">';
    if (!it) h += '<div class="qm"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div></div>';
    else {
      var ek = function (f) { return ' data-edit="dice:pictures:' + it.id + ':' + f + '"'; };
      h += '<div class="dpic"' + (st.rolling[i] ? ' data-auto' : ek('pic')) + '>' + WU.pic(it.pic) + '</div></div>';
      h += '<div class="dword"' + (st.rolling[i] ? ' data-auto' : ek('text')) + '>' + WU.esc(it.text) + '</div>';
    }
    return h + '</div>';
  }
  function render() {
    var S = scr.get(), ph = st.phase, h = '';
    h += '<div class="dhead">' + kit.chip(S.tag, scr.ea('tag'), '#c6ff00') +
      (ph === 'pairs' ? kit.chip(S.pairTag, scr.ea('pairTag'), '#ff4fc3') : ph === 'class' || ph === 'end' ? kit.chip(S.classTag, scr.ea('classTag'), '#00e5c7') : '') +
      (ph === 'class' && S.count ? '<div class="cnt"' + scr.ea('count') + '>' + WU.esc(kit.fill(S.count, { n: st.n })) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="dice">';
    for (var i = 0; i < nDice(); i++) h += dieHTML(i);
    h += '</div><div class="dbottom"><div class="dleft">';
    if (ph === 'pairs' && S.pairLine) h += '<div class="big"' + scr.ea('pairLine') + '>' + WU.esc(S.pairLine) + '</div>';
    if (ph === 'class') {
      h += '<div class="big"' + scr.ea('next') + '>' + WU.esc(kit.fill(S.next, { name: st.who })) + '</div>';
    }
    if (ph === 'end' && S.end) h += '<div class="big end"' + scr.ea('end') + '>' + WU.esc(S.end) + '</div>';
    if (ph !== 'end') {
      if (S.frame) h += kit.frame(S.frame, scr.ea('frame'));
      var rk = st.ruleAlt ? 'ruleAlt' : 'rule', rt = S[rk];
      if (S.ruleShow && rt && ph !== 'ready') h += '<div class="rule"' + scr.ea(rk) + '>' + WU.esc(rt) + '</div>';
    }
    if (ph === 'ready') h += '<div class="btn" data-ctrl data-b="roll"><span class="key">SPACE</span><span>Roll the dice</span></div>';
    h += '</div><div class="tslot"></div></div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph === 'pairs') box.querySelector('.tslot').appendChild(clock.el);
    box.querySelectorAll('.dword').forEach(function (w) { kit.fit(w, 48, 40); });
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = roll; });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['SPACE', 'roll'], ['Esc', 'home']].concat(sc)
      : ph === 'rolling' ? [['Esc', 'home']]
      : ph === 'pairs' ? [['ENTER', 'pause / go'], ['C', 'class story now'], ['SPACE', 'roll again'], ['Esc', 'home']].concat(sc)
      : [['N', 'next student'], ['SPACE', 'roll again'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, keyAction);
  }

  /* ---------- flow ---------- */
  function roll() {
    if (st.phase === 'rolling') return;
    clearT(); if (clock) { clock.destroy(); clock = null; }
    WU.sound.unlock();
    var P = WU.shuffle(pool()), n = nDice(), S = scr.get();
    st.final = []; for (var i = 0; i < n; i++) st.final.push(P.length ? P[i % P.length].id : null);
    st.rolling = st.final.map(function () { return true; });
    st.faces = st.final.slice(); st.phase = 'rolling'; st.n = 0; st.focus = -1; st.tick = 0;
    st.ruleAlt = !!(S.ruleAlt && Math.random() < 0.5);
    render();
    var flick = function () {
      if (!st || st.phase !== 'rolling') return;
      st.tick++;
      st.faces = st.faces.map(function (f, i) { return st.rolling[i] && P.length ? WU.pick(P).id : f; });
      WU.sound.clack(); render();
      timers.push(setTimeout(flick, WU.isCalm() ? 300 : 110));
    };
    if (!WU.isCalm()) flick();
    var t0 = WU.isCalm() ? 300 : 900, gap = WU.isCalm() ? 150 : 350;
    st.final.forEach(function (f, i) {
      timers.push(setTimeout(function () {
        if (!st) return;
        st.rolling[i] = false; st.faces[i] = f; WU.sound.slam();
        if (i === n - 1) rolled(); else render();
      }, t0 + i * gap));
    });
  }
  function rolled() {
    clearT(); WU.sound.ding();
    var secs = +scr.get().pairSecs || 0;
    if (secs > 0) {
      st.phase = 'pairs';
      clock = WU.Timer({ seconds: secs, size: 260, onDone: function () { timers.push(setTimeout(classStory, 1200)); } });
      render(); clock.start();
    } else classStory();
  }
  function classStory() {
    clearT(); if (clock) { clock.destroy(); clock = null; }
    st.phase = 'class'; st.n = 0; nextStudent();
  }
  function nextStudent() {
    var S = scr.get(), end = +S.endAfter || 0;
    if (end && st.n >= end) { st.phase = 'end'; st.demo = false; WU.sound.ding(); render(); return; }
    st.n++;
    st.who = st.demo && st.n === 1 ? scr.get().demoWho : kit.student(st.who ? [st.who] : null);
    if (!(st.demo && st.n === 1)) st.demo = false;
    st.focus = (st.n - 1) % nDice();
    WU.sound.pop(); render();
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready') st.demo = !!scr.get().demoShow;
    st.faces = st.faces.slice(0, nDice()).map(function (f) { return f && face(f) ? f : null; });
    if (st.phase !== 'rolling') render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('dice-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') roll();
    else if (k === 'N') { if (ph === 'class') nextStudent(); else if (ph === 'pairs') classStory(); }
    else if (k === 'C') { if (ph === 'pairs') classStory(); }
    else if (k === 'ENTER') { if (ph === 'pairs' && clock) clock.toggle(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.dice = {
    title: 'Story Dice',
    teacher: function () {
      if (!st) return null;
      var info = [], words = st.faces.map(function (f) { var it = f && face(f); return it ? it.text : ''; }).filter(Boolean);
      if (words.length && st.phase !== 'rolling') info.push({ label: 'Dice', text: words.join(', ') });
      var S = scr.get(); if (st.phase !== 'ready') info.push({ label: 'Rule', text: st.ruleAlt ? S.ruleAlt : S.rule });
      if (st.phase === 'class') info.push({ label: 'Sentence ' + st.n, text: st.who });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'roll the dice'], ['Enter', 'pause / go (pair time)'], ['C', 'class story now'], ['N', 'next student'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', faces: [], rolling: [], final: [], n: 0, focus: -1, who: '', demo: !!scr.get().demoShow, tick: 0 };
      el.innerHTML = '<div class="dicegame"><div class="layer"></div>' + kit.header('Story Dice') + '<div class="hints"></div></div>';
      box = el.querySelector('.dicegame');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('dice-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      // Measure text again once the bundled fonts have loaded.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box && st.phase !== 'rolling') render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { n: 'N', c: 'C', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
