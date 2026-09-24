/* Warm Up: TUG OF WAR.
   Two sides, one topic, a rope with a flag. Sides take turns giving a reason; the teacher pulls for a good one.
   The first side to pull the flag over its line wins. Teams off: left side of the room against right side.
   Keys: Left / Right pull, Space no pull (next side's turn), N new topic, R reset.
   Content: content/tug.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, HALF = 560;

  var scr = kit.screen({
    game: 'tug', title: 'Tug of War', content: function () { return WU.content.tugScreen; },
    fields: [
      { type: 'head', label: 'Rope' },
      { k: 'strength', label: 'Pull strength (steps per good reason)', type: 'num', min: 1, max: 5 },
      { k: 'distance', label: 'Distance to win (steps from the middle)', type: 'num', min: 1, max: 15 },
      { type: 'head', label: 'Screen' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'vs', label: 'Between the two sides', type: 'text', max: 6 },
      { k: 'leftSide', label: 'Left side name (teams off)', type: 'text', max: 16 },
      { k: 'rightSide', label: 'Right side name (teams off)', type: 'text', max: 16 },
      { k: 'forLabel', label: 'Debate: left side argues', type: 'text', max: 16 },
      { k: 'againstLabel', label: 'Debate: right side argues', type: 'text', max: 16 },
      { k: 'frame', label: 'Sentence frame for every topic at this level (empty = none)', type: 'text', max: 60, hint: 'A topic can have its own frame.' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'turn', label: 'Whose turn ({side})', type: 'text', max: 40 },
      { k: 'win', label: 'Winner ({side})', type: 'text', max: 30 },
      { k: 'demo', label: 'Teacher demo banner (first topic only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('tug', 'topics', {
    gameTitle: 'Tug of War', label: 'Topics',
    defaults: function (l) { return WU.content.tug[l].topics; },
    norm: function (r) { return { left: r.left || '', leftPic: r.leftPic || '', right: r.right || '', rightPic: r.rightPic || '', motion: r.motion || '', frame: r.frame || '' }; },
    title: function (it) { return it.motion || (it.left + ' vs ' + it.right); },
    fields: function () {
      return [
        { k: 'motion', label: 'Debate statement (IELTS). If filled, the sides are FOR and AGAINST.', type: 'text', max: 110 },
        { k: 'left', label: 'Left side (word or phrase)', type: 'text', max: 40 },
        { k: 'leftPic', label: 'Left picture', type: 'pic' },
        { k: 'right', label: 'Right side (word or phrase)', type: 'text', max: 40 },
        { k: 'rightPic', label: 'Right picture', type: 'pic' },
        { k: 'frame', label: 'Sentence frame for this topic', type: 'text', max: 60,
          ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; }, hint: 'Empty = the level\'s frame.' }
      ];
    },
    blank: function () { return { left: 'cats', leftPic: 'cat', right: 'dogs', rightPic: 'dog', motion: '', frame: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timers = [];
  var deck = kit.deck();

  function topic() { return WU.list('tug', 'topics', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function teams() { return WU.state.teams >= 2; }
  function sideName(i) {
    var S = scr.get();
    if (teams()) return WU.state.teamNames[i] || 'TEAM ' + (i + 1);
    return i ? S.rightSide : S.leftSide;
  }
  function sideAttr(i) { return teams() ? ' data-auto' : scr.ea(i ? 'rightSide' : 'leftSide'); }
  function sideColor(i) { return teams() ? (WU.TEAM_COLORS[WU.state.teamColors[i]] || '#fff') : (i ? '#ff4fc3' : '#3d6bff'); }
  function dist() { return Math.max(1, Math.min(15, +scr.get().distance || 5)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newTopic() {
    var it = deck(WU.list('tug', 'topics', WU.state.level));
    st.id = it ? it.id : null; st.pos = 0; st.won = null; st.turn = WU.rand(2);
  }

  /* ---------- drawing ---------- */
  function cardHTML(it, i) {
    var k = i ? 'right' : 'left', ek = function (f) { return ' data-edit="tug:topics:' + it.id + ':' + f + '"'; };
    return '<div class="tcard" style="box-shadow:12px 12px 0 ' + sideColor(i) + '">' + (it[k + 'Pic'] ? '<div class="tpic"' + ek(k + 'Pic') + '>' + WU.pic(it[k + 'Pic']) + '</div>' : '') +
      '<div class="tword"' + ek(k) + '>' + WU.esc(it[k]) + '</div></div>';
  }
  function render() {
    var S = scr.get(), it = topic(), h = '';
    h += '<div class="thead">' + kit.chip(S.tag, scr.ea('tag'), '#3d6bff') + (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (it && it.motion) {
      h += '<div class="motion"><div class="mt" data-edit="tug:topics:' + it.id + ':motion">' + WU.esc(it.motion) + '</div></div>' +
        '<div class="fa"><span' + scr.ea('forLabel') + ' style="background:' + sideColor(0) + '">' + WU.esc(S.forLabel) + '</span><span' + scr.ea('againstLabel') + ' style="background:' + sideColor(1) + '">' + WU.esc(S.againstLabel) + '</span></div>';
    } else if (it) {
      h += '<div class="sides">' + cardHTML(it, 0) + '<div class="vs"' + scr.ea('vs') + '>' + WU.esc(S.vs) + '</div>' + cardHTML(it, 1) + '</div>';
    }
    // Rope, flag, lines, team blocks.
    var x = (st.pos / dist()) * HALF, from = st.drawX == null ? x : st.drawX;
    h += '<div class="ropebox"><div class="tline l" style="left:' + (960 - HALF - 70) + 'px"></div><div class="tline c" style="left:' + (960 - 70) + 'px"></div><div class="tline r" style="left:' + (960 + HALF - 70) + 'px"></div>' +
      '<div class="rope" style="transform:translateX(' + from + 'px)"><div class="cord"></div><div class="flag"></div></div>' +
      '<div class="tteam l' + (st.turn === 0 && !st.won ? ' on' : '') + '" style="background:' + sideColor(0) + '"><span' + sideAttr(0) + '>' + WU.esc(sideName(0)) + '</span></div>' +
      '<div class="tteam r' + (st.turn === 1 && !st.won ? ' on' : '') + '" style="background:' + sideColor(1) + '"><span' + sideAttr(1) + '>' + WU.esc(sideName(1)) + '</span></div></div>';
    h += '<div class="tbottom">';
    if (st.won != null) {
      h += '<div class="twin"' + scr.ea('win') + ' style="background:' + sideColor(st.won) + '">' + WU.esc(kit.fill(S.win, { side: sideName(st.won) })) + '</div>';
    } else {
      if (S.turn) h += '<div class="tturn"' + scr.ea('turn') + ' style="background:' + sideColor(st.turn) + '">' + (st.turn ? '' : '&larr; ') + WU.esc(kit.fill(S.turn, { side: sideName(st.turn) })) + (st.turn ? ' &rarr;' : '') + '</div>';
      var fr = it && it.frame ? kit.frame(it.frame, ' data-edit="tug:topics:' + it.id + ':frame"') : kit.frame(S.frame, scr.ea('frame'));
      h += '<div class="brow">' + fr + (S.ruleShow && S.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>' : '') + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    // Slide the rope from where it was to where it is now.
    var rope = box.querySelector('.rope'); st.drawX = x;
    if (from !== x) { rope.getBoundingClientRect(); rope.classList.add('move'); rope.style.transform = 'translateX(' + x + 'px)'; }
    box.querySelectorAll('.tword').forEach(function (w) { kit.fit(w, 96, 48); });
    var mt = box.querySelector('.mt'); if (mt) kit.fit(mt, 96, 52);
    box.querySelectorAll('.tteam').forEach(function (t, i) { t.onclick = function () { pull(i ? 1 : -1); }; });
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function () { keyAction('N'); }; });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = st.won != null ? [['N', 'new topic'], ['R', 'play again'], ['Esc', 'home']].concat(sc)
      : [['LEFT', 'pull left'], ['RIGHT', 'pull right'], ['SPACE', 'no pull, next side'], ['N', 'new topic'], ['R', 'reset'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, keyAction);
  }

  /* ---------- flow ---------- */
  function pull(dir) {
    if (st.won != null) return;
    WU.sound.unlock();
    var s = Math.max(1, Math.min(5, +scr.get().strength || 1)), d = dist();
    st.pos = Math.max(-d, Math.min(d, st.pos + dir * s));
    st.turn = dir < 0 ? 1 : 0; st.demo = false;
    WU.sound.slam(); WU.sound.clack();
    if (Math.abs(st.pos) >= d) {
      st.won = st.pos < 0 ? 0 : 1;
      if (sb && teams()) sb.add(st.won, 1);
      timers.push(setTimeout(function () { WU.sound.ding(); }, 250));
    }
    render();
  }
  function pass() { if (st.won != null) return; st.turn = 1 - st.turn; WU.sound.pop(); render(); }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!scr.get().demoShow;
    if (!topic()) newTopic();
    st.pos = Math.max(-dist(), Math.min(dist(), st.pos));
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('tug-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'LEFT') { st.moved = true; pull(-1); }
    else if (k === 'RIGHT') { st.moved = true; pull(1); }
    else if (k === 'SPACE') pass();
    else if (k === 'N') { clearT(); st.moved = true; st.demo = false; newTopic(); render(); WU.sound.clack(); }
    else if (k === 'R') { clearT(); st.pos = 0; st.won = null; render(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.tug = {
    title: 'Tug of War',
    help: function () { return [['Left / Right', 'good reason: pull'], ['Space', 'no pull: next side'], ['N', 'new topic'], ['R', 'reset the rope'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { pos: 0, won: null, turn: 0, id: null, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="tug"><div class="layer"></div>' + kit.header('Tug of War') + '<div class="hints"></div></div>';
      box = el.querySelector('.tug');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('tug-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newTopic(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.key === 'ArrowLeft') { keyAction('LEFT'); return true; }
      if (e.key === 'ArrowRight') { keyAction('RIGHT'); return true; }
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
