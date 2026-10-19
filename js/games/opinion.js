/* Warm Up: OPINION LINE (moving game, Pre-Intermediate and up; greyed out below).
   A statement. One line through the middle of the room: AGREE near the board, DISAGREE at the back.
   Space: everyone stands on the line where their opinion is (timer). Then: explain to the person next to you (timer, frame),
   the two ends try to convince the middle (timer), anyone who changed their mind moves (timer), who moved says why.
   Keys: Space next step, Enter pause the timer, N another statement.
   Content: content/opinion.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'opinion', title: 'Opinion Line', content: function () { return WU.content.opinionScreen; },
    fields: [
      { type: 'head', label: 'Statement and map' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'board', label: 'Map: the board', type: 'text', max: 16 },
      { k: 'agree', label: 'Near the board', type: 'text', max: 16 },
      { k: 'middle', label: 'The middle', type: 'text', max: 16 },
      { k: 'disagree', label: 'At the back', type: 'text', max: 16 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Steps' },
      { k: 'go', label: '1. Stand on the line', type: 'text', max: 40 },
      { k: 'moveSeconds', label: 'Time to stand on the line (seconds)', type: 'num', min: 5, max: 60 },
      { k: 'pairs', label: '2. Explain to your neighbour', type: 'text', max: 70 },
      { k: 'frame', label: 'Frame (empty = none)', type: 'text', max: 60 },
      { k: 'pairSeconds', label: 'Time to explain (seconds)', type: 'num', min: 10, max: 300 },
      { k: 'convince', label: '3. The ends convince the middle', type: 'text', max: 100 },
      { k: 'convinceSeconds', label: 'Time to convince (seconds)', type: 'num', min: 10, max: 300 },
      { k: 'change', label: '4. Changed your mind? Move', type: 'text', max: 50 },
      { k: 'changeSeconds', label: 'Time to move (seconds)', type: 'num', min: 3, max: 60 },
      { k: 'report', label: '5. Who moved', type: 'text', max: 60 },
      { k: 'back', label: 'At the end', type: 'text', max: 40 },
      { k: 'demo', label: 'Teacher demo banner (first statement only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('opinion', 'statements', {
    gameTitle: 'Opinion Line', label: 'Statements',
    defaults: function (l) { return WU.content.opinion[l].statements; },
    norm: function (r) { return { text: r.text || '' }; },
    fields: function () { return [{ k: 'text', label: 'Statement (people can agree or disagree)', type: 'text', max: 120 }]; },
    blank: function () { return { text: '___ is better than ___.' }; }
  });

  var STEPS = ['read', 'move', 'pairs', 'convince', 'change', 'report', 'back'];
  var LINE = { move: 'go', pairs: 'pairs', convince: 'convince', change: 'change', report: 'report', back: 'back' };
  var root, box, st, sb = null, offContent = null, timer = null, timers = [];
  var deck = kit.deck();

  function item() { return WU.list('opinion', 'statements', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newStatement() { var it = deck(WU.list('opinion', 'statements', WU.state.level)); st.id = it ? it.id : null; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function killTimer() { if (timer) { timer.destroy(); timer = null; } }

  function lineHTML(S) {
    return '<div class="oline"><div class="obar"></div>' +
      '<div class="olab a"' + scr.ea('agree') + '>' + WU.esc(S.agree) + '</div>' +
      '<div class="olab m"' + scr.ea('middle') + '>' + WU.esc(S.middle) + '</div>' +
      '<div class="olab d"' + scr.ea('disagree') + '>' + WU.esc(S.disagree) + '</div>' +
      (st.phase !== 'read' ? [12, 30, 47, 63, 80].map(function (y, i) { return '<div class="odot" style="top:' + y + '%;animation-delay:' + (i * 0.15) + 's"></div>'; }).join('') : '') + '</div>';
  }
  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    h += '<div class="ohead">' + kit.chip(S.tag, scr.ea('tag'), '#ff5a1f') + (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="ost"' + (it ? ' data-edit="opinion:statements:' + it.id + ':text"' : '') + '>' + (it ? WU.esc(it.text) : '') + '</div>';
    h += '<div class="oleft">';
    if (ph === 'read') {
      if (S.ruleShow && S.rule) h += '<div class="obig"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    } else {
      if (timer) h += '<div class="otimer"></div>';
      h += '<div class="obig' + (timer ? '' : ' wide') + '"' + scr.ea(LINE[ph]) + '>' + WU.esc(S[LINE[ph]]) + '</div>';
    }
    h += '</div>' + kit.roomMap(S.board, scr.ea('board'), lineHTML(S), 'omap');
    h += '<div class="obottom">' + (ph === 'pairs' || ph === 'convince' ? '<div class="brow">' + kit.frame(S.frame, scr.ea('frame')) + '</div>' : '') + '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.ost'), 88, 48);
    var ob = box.querySelector('.obig'); if (ob) kit.fit(ob, 64, 40);
    var slot = box.querySelector('.otimer'); if (slot && timer) slot.appendChild(timer.el);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var next = { read: 'stand on the line', move: 'explain', pairs: 'convince', convince: 'change your mind', change: 'who moved?', report: 'back to seats', back: 'next statement' }[ph];
    var hs = [['SPACE', next]].concat(timer ? [['ENTER', 'pause']] : [], ph === 'read' ? [['N', 'other statement']] : [], [['Esc', 'home']]);
    kit.hints(root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function secs(k, lo, hi, d) { return Math.max(lo, Math.min(hi, +scr.get()[k] || d)); }
  function go(ph) {
    clearT(); killTimer(); st.phase = ph; st.demo = false;
    var auto = function (to) { return function () { if (st && st.phase === ph) timers.push(setTimeout(function () { go(to); }, 900)); }; };
    if (ph === 'move') timer = WU.Timer({ seconds: secs('moveSeconds', 5, 60, 15), size: 320, onDone: auto('pairs') });
    else if (ph === 'pairs') timer = WU.Timer({ seconds: secs('pairSeconds', 10, 300, 60), size: 320 });
    else if (ph === 'convince') timer = WU.Timer({ seconds: secs('convinceSeconds', 10, 300, 60), size: 320 });
    else if (ph === 'change') timer = WU.Timer({ seconds: secs('changeSeconds', 3, 60, 10), size: 320, onDone: auto('report') });
    if (timer) timer.start();
    if (ph === 'move' || ph === 'change') WU.sound.slam(); else if (ph === 'read') WU.sound.pop(); else WU.sound.ding();
    render();
  }
  function step() {
    st.moved = true;
    var i = STEPS.indexOf(st.phase);
    if (st.phase === 'back') { newStatement(); go('read'); } else go(STEPS[i + 1]);
  }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!item()) newStatement(); render(); }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('opinion-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'SPACE') step();
    else if (k === 'ENTER') { if (timer) timer.toggle(); }
    else if (k === 'N') { if (st.phase === 'read') { st.moved = true; st.demo = false; newStatement(); WU.sound.clack(); render(); } }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.opinion = {
    title: 'Opinion Line',
    teacher: function () {
      if (!st) return null;
      var it = item(), S = scr.get(), info = [];
      if (it) info.push({ label: 'Statement', text: it.text });
      info.push({ label: 'Step ' + (STEPS.indexOf(st.phase) + 1) + ' of ' + STEPS.length, text: st.phase === 'read' ? 'Read it out. Space = stand on the line' : S[LINE[st.phase]] });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'next step'], ['Enter', 'pause the timer'], ['N', 'another statement'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'read', id: null, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="opg"><div class="layer"></div>' + kit.header('Opinion Line') + '<div class="hints"></div></div>';
      box = el.querySelector('.opg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('opinion-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newStatement(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); killTimer(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { keyAction('ENTER'); return true; }
      var map = { n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
