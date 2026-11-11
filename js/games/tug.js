/* Warm Up: TUG OF WAR.
   Rounds. Each round both sides get a topic (left side's word / right side's word, or FOR / AGAINST a statement).
   Each side has one turn per round: a timed think (45 s by default, starts by itself; Enter pauses), then one argument.
   The teacher pulls for a good one (Left / Right) or not (Space). When both sides have had their turn, the next round
   starts with a new topic and the rope stays where it is. A side wins by pulling the flag over its line, or by having
   the flag on its half after the last round (10 by default). Flag in the middle after the last round: a draw.
   Teams off: left side of the room against right side.
   Keys: Enter timer, Left / Right pull, Space no pull, N next round now, R reset.
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
      { type: 'head', label: 'Rounds' },
      { k: 'secs', label: 'Seconds per side to think and argue', type: 'num', min: 10, max: 180 },
      { k: 'rounds', label: 'Number of rounds', type: 'num', min: 1, max: 30 },
      { k: 'round', label: 'Round tag ({n} = round, {total} = rounds)', type: 'text', max: 24 },
      { k: 'next', label: 'Round over banner', type: 'text', max: 40 },
      { type: 'head', label: 'Screen' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'vs', label: 'Between the two sides', type: 'text', max: 6 },
      { k: 'leftSide', label: 'Left side name (teams off)', type: 'text', max: 16 },
      { k: 'rightSide', label: 'Right side name (teams off)', type: 'text', max: 16 },
      { k: 'forLabel', label: 'Debate: left side argues', type: 'text', max: 16 },
      { k: 'againstLabel', label: 'Debate: right side argues', type: 'text', max: 16 },
      { k: 'frame', label: 'Sentence frame for every topic at this level (empty = none)', type: 'text', max: 60, hint: 'A topic can have its own frame.' },
      { k: 'rule', label: 'Rule line ({n} = seconds)', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'turn', label: 'Whose turn ({side})', type: 'text', max: 40 },
      { k: 'win', label: 'Winner ({side})', type: 'text', max: 30 },
      { k: 'draw', label: 'Draw (flag in the middle after the last round)', type: 'text', max: 30 },
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

  var root, box, st, sb = null, clock = null, offContent = null, timers = [];
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
  function rounds() { return Math.max(1, Math.min(30, +scr.get().rounds || 10)); }
  function secs() { return Math.max(10, Math.min(180, +scr.get().secs || 45)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  // go = start counting now (a new turn starts by itself); without it the timer waits for Enter.
  function newClock(go) {
    if (clock) clock.destroy();
    clock = WU.Timer({ seconds: secs(), size: 170 });
    if (go) clock.start();
  }
  // A new topic for the round. The rope does not move.
  function newTopic() {
    var it = deck(WU.list('tug', 'topics', WU.state.level));
    st.id = it ? it.id : null; st.gone = [false, false]; st.over = false;
    newClock(true);
  }
  function nextRound() {
    clearT(); st.round++; st.first = 1 - st.first; st.turn = st.first; newTopic();
  }
  function newGame() {
    clearT(); st.pos = 0; st.won = null; st.round = 1; st.first = WU.rand(2); st.turn = st.first; newTopic();
  }

  /* ---------- drawing ---------- */
  function cardHTML(it, i) {
    var k = i ? 'right' : 'left', ek = function (f) { return ' data-edit="tug:topics:' + it.id + ':' + f + '"'; };
    return '<div class="tcard" style="box-shadow:12px 12px 0 ' + sideColor(i) + '">' + (it[k + 'Pic'] ? '<div class="tpic"' + ek(k + 'Pic') + '>' + WU.pic(it[k + 'Pic']) + '</div>' : '') +
      '<div class="tword"' + ek(k) + '>' + WU.esc(it[k]) + '</div></div>';
  }
  function render() {
    var S = scr.get(), it = topic(), h = '';
    h += '<div class="thead">' + kit.chip(S.tag, scr.ea('tag'), '#3d6bff') +
      (S.round ? '<div class="tround"' + scr.ea('round') + '>' + WU.esc(kit.fill(S.round, { n: st.round, total: rounds() })) + '</div>' : '') + (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (it && it.motion) {
      h += '<div class="motion"><div class="mt" data-edit="tug:topics:' + it.id + ':motion">' + WU.esc(it.motion) + '</div></div>' +
        '<div class="fa"><span' + scr.ea('forLabel') + ' style="background:' + sideColor(0) + '">' + WU.esc(S.forLabel) + '</span><span' + scr.ea('againstLabel') + ' style="background:' + sideColor(1) + '">' + WU.esc(S.againstLabel) + '</span></div>';
    } else if (it) {
      h += '<div class="sides">' + cardHTML(it, 0) + '<div class="vs"' + scr.ea('vs') + '>' + WU.esc(S.vs) + '</div>' + cardHTML(it, 1) + '</div>';
    }
    // Rope, flag, lines, team blocks.
    var x = (st.pos / dist()) * HALF, from = st.drawX == null ? x : st.drawX;
    h += '<div class="ropebox"><div class="tline l" style="left:' + (960 - HALF - 70) + 'px"></div><div class="tline c" style="left:' + (960 - 70) + 'px"></div><div class="tline r" style="left:' + (960 + HALF - 70) + 'px"></div>' +
      '<div class="rclip"><div class="rope" style="transform:translateX(' + from + 'px)"><div class="cord"></div><div class="flag"></div></div></div>' +
      '<div class="tteam l' + (st.turn === 0 && st.won == null ? ' on' : '') + '" style="background:' + sideColor(0) + '"><span' + sideAttr(0) + '>' + WU.esc(sideName(0)) + '</span></div>' +
      '<div class="tteam r' + (st.turn === 1 && st.won == null ? ' on' : '') + '" style="background:' + sideColor(1) + '"><span' + sideAttr(1) + '>' + WU.esc(sideName(1)) + '</span></div></div>';
    h += '<div class="tbottom">';
    if (st.won === -1) {
      h += '<div class="twin tdraw"' + scr.ea('draw') + '>' + WU.esc(S.draw) + '</div>';
    } else if (st.won != null) {
      h += '<div class="twin"' + scr.ea('win') + ' style="background:' + sideColor(st.won) + '">' + WU.esc(kit.fill(S.win, { side: sideName(st.won) })) + '</div>';
    } else if (st.over) {
      if (S.next) h += '<div class="tturn tnext"' + scr.ea('next') + '>' + WU.esc(S.next) + '</div>';
    } else {
      if (S.turn) h += '<div class="tturn"' + scr.ea('turn') + ' style="background:' + sideColor(st.turn) + '">' + (st.turn ? '' : '&larr; ') + WU.esc(kit.fill(S.turn, { side: sideName(st.turn) })) + (st.turn ? ' &rarr;' : '') + '</div>';
      var fr = it && it.frame ? kit.frame(it.frame, ' data-edit="tug:topics:' + it.id + ':frame"') : kit.frame(S.frame, scr.ea('frame'));
      h += '<div class="brow">' + fr + (S.ruleShow && S.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(kit.fill(S.rule, { n: secs() })) + '</div>' : '') + '</div>';
    }
    h += '</div><div class="tslot"></div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock && st.won == null && !st.over) box.querySelector('.tslot').appendChild(clock.el);
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
    var hs = st.won != null ? [['R', 'play again'], ['Esc', 'home']].concat(sc)
      : [['ENTER', 'pause timer'], ['LEFT', 'pull left'], ['RIGHT', 'pull right'], ['SPACE', 'no pull'], ['N', 'next round'], ['R', 'reset'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, keyAction);
  }

  /* ---------- flow ---------- */
  // The side whose turn it is has argued: next side, or the round is over (new topic after a short pause).
  function endTurn() {
    st.gone[st.turn] = true; st.demo = false;
    if (st.gone[0] && st.gone[1] && st.round >= rounds()) {
      // Last round done: the flag's half decides.
      st.won = st.pos < 0 ? 0 : st.pos > 0 ? 1 : -1;
      if (clock) { clock.destroy(); clock = null; }
      if (st.won >= 0 && sb && teams()) sb.add(st.won, 1);
      timers.push(setTimeout(function () { WU.sound.ding(); }, 250));
    } else if (st.gone[0] && st.gone[1]) {
      st.over = true; if (clock) { clock.destroy(); clock = null; }
      timers.push(setTimeout(function () { if (!st || st.won != null) return; nextRound(); WU.sound.clack(); render(); }, 1800));
    } else { st.turn = 1 - st.turn; newClock(true); }
  }
  function pull(dir) {
    if (st.won != null || st.over) return;
    WU.sound.unlock();
    var s = Math.max(1, Math.min(5, +scr.get().strength || 1)), d = dist();
    st.pos = Math.max(-d, Math.min(d, st.pos + dir * s));
    WU.sound.slam(); WU.sound.clack();
    if (Math.abs(st.pos) >= d) {
      st.won = st.pos < 0 ? 0 : 1; st.demo = false;
      if (clock) { clock.destroy(); clock = null; }
      if (sb && teams()) sb.add(st.won, 1);
      timers.push(setTimeout(function () { WU.sound.ding(); }, 250));
    } else endTurn();
    render();
  }
  function pass() { if (st.won != null || st.over) return; WU.sound.pop(); endTurn(); render(); }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!scr.get().demoShow;
    if (!topic()) newTopic();
    else if (clock && clock.total !== secs() * 1000 && !clock.isRunning()) newClock();
    st.pos = Math.max(-dist(), Math.min(dist(), st.pos));
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('tug-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'ENTER') { if (clock && st.won == null && !st.over) { st.moved = true; clock.toggle(); } }
    else if (k === 'LEFT') { st.moved = true; pull(-1); }
    else if (k === 'RIGHT') { st.moved = true; pull(1); }
    else if (k === 'SPACE') pass();
    else if (k === 'N') { st.moved = true; st.demo = false; if (st.won != null) newGame(); else nextRound(); render(); WU.sound.clack(); }
    else if (k === 'R') { st.demo = false; newGame(); render(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.tug = {
    title: 'Tug of War',
    teacher: function () {
      if (!st) return null;
      var it = topic(), d = dist(), info = [];
      info.push({ label: 'Round', text: st.round + ' of ' + rounds() });
      if (it) info.push({ label: 'Topic', text: it.motion || (sideName(0) + ': ' + it.left + '   ' + sideName(1) + ': ' + it.right) });
      if (st.won != null) info.push({ label: 'Winner', text: st.won === -1 ? 'Draw' : sideName(st.won) });
      else {
        var s = Math.max(1, +scr.get().strength || 1);
        info.push({ label: 'Good reasons still needed', text: sideName(0) + ': ' + Math.ceil((d + st.pos) / s) + '   ' + sideName(1) + ': ' + Math.ceil((d - st.pos) / s) });
        info.push({ label: 'Flag now on', text: st.pos < 0 ? sideName(0) + '\'s half' : st.pos > 0 ? sideName(1) + '\'s half' : 'the middle' });
        info.push({ label: 'Turn', text: st.over ? 'Round over: new topic next' : sideName(st.turn) });
      }
      return { secret: [], info: info };
    },
    help: function () { return [['Enter', 'pause / restart the side\'s timer'], ['Left / Right', 'good argument: pull'], ['Space', 'no pull: next side'], ['N', 'next round now (new topic, rope stays)'], ['R', 'new game: rope to the middle, round 1'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { pos: 0, won: null, turn: 0, first: 0, round: 1, gone: [false, false], over: false, id: null, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="tug"><div class="layer"></div>' + kit.header('Tug of War') + '<div class="hints"></div></div>';
      box = el.querySelector('.tug');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('tug-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newGame(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.key === 'ArrowLeft') { keyAction('LEFT'); return true; }
      if (e.key === 'ArrowRight') { keyAction('RIGHT'); return true; }
      if (e.key === 'Enter') { keyAction('ENTER'); return true; }
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
