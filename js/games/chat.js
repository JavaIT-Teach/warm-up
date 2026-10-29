/* Warm Up: SPEED CHAT (moving game, all levels).
   Everyone stands. One question on the board. Find a partner, ask, answer, find a new partner, count partners on your fingers.
   Rounds get shorter (60, 50, 40, 30 seconds at Beginner). At the buzzer a new question appears and the next round starts by itself.
   After the last round: FREEZE, hands up "5 people or more... 8..." (Up / Down), the last hand up wins, then students report.
   Keys: Space next step, Enter pause, N other question, Up / Down hands-up number, P other student, R start again.
   Content: content/chat.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'chat', title: 'Speed Chat', content: function () { return WU.content.chatScreen; },
    fields: [
      { type: 'head', label: 'Question' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'round', label: 'Round ({n} of {total})', type: 'text', max: 30 },
      { k: 'askLabel', label: 'Before the question', type: 'text', max: 16 },
      { k: 'answerLabel', label: 'Before the answer', type: 'text', max: 16 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Rounds' },
      { k: 'go', label: 'While they talk', type: 'text', max: 40 },
      { k: 'rounds', label: 'Number of rounds (1-8)', type: 'num', min: 1, max: 8 },
      { k: 'seconds', label: 'First round (seconds)', type: 'num', min: 15, max: 300 },
      { k: 'step', label: 'Each round is shorter by (seconds)', type: 'num', min: 0, max: 60 },
      { k: 'minSeconds', label: 'Shortest round (seconds)', type: 'num', min: 15, max: 300 },
      { k: 'next', label: 'Between rounds', type: 'text', max: 30 },
      { k: 'nextSeconds', label: 'Seconds to read the new question (0 = start with Space)', type: 'num', min: 0, max: 15 },
      { type: 'head', label: 'The end' },
      { k: 'freeze', label: 'Time is up', type: 'text', max: 30 },
      { k: 'count', label: 'Hands up ({k} = people)', type: 'text', max: 50 },
      { k: 'countFrom', label: 'Hands up: start at (people)', type: 'num', min: 1, max: 20 },
      { k: 'winner', label: 'Winner line', type: 'text', max: 50 },
      { k: 'reporters', label: 'Students who report (1-5)', type: 'num', min: 1, max: 5 },
      { k: 'report', label: 'Report line ({name})', type: 'text', max: 50 },
      { k: 'reportFrame', label: 'Report frame', type: 'text', max: 60 },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('chat', 'questions', {
    gameTitle: 'Speed Chat', label: 'Questions',
    defaults: function (l) { return WU.content.chat[l].questions; },
    norm: function (r) { return { ask: r.ask || '', answer: r.answer || '', report: r.report || '', pic: r.pic || '' }; },
    title: function (it) { return it.ask; },
    fields: function () {
      return [
        { k: 'ask', label: 'The question', type: 'text', max: 80 },
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'answer', label: 'Answer frame', type: 'text', max: 80, hint: 'Use ___ for the gaps.' },
        { k: 'report', label: 'Report frame (the end)', type: 'text', max: 80, hint: 'Use ___ for the gaps.' }
      ];
    },
    blank: function () { return { ask: 'Do you like ___?', answer: "Yes, I do. / No, I don't.", report: '___ likes ___.', pic: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timer = null, timers = [];
  var deck = kit.deck();

  function all() { return WU.list('chat', 'questions', WU.state.level); }
  function byId(id) { return all().filter(function (x) { return x.id === id; })[0] || null; }
  function item() { return byId(st.id); }
  function ek(it, f) { return ' data-edit="chat:questions:' + it.id + ':' + f + '"'; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function killTimer() { if (timer) { timer.destroy(); timer = null; } }
  function num(v, lo, hi, d) { v = +v; return isNaN(v) ? d : Math.max(lo, Math.min(hi, v)); }
  function rounds() { return num(scr.get().rounds, 1, 8, 4); }
  function secondsFor(n) {
    var S = scr.get(), lo = num(S.minSeconds, 15, 300, 30);
    return Math.max(Math.min(lo, num(S.seconds, 15, 300, 60)), num(S.seconds, 15, 300, 60) - num(S.step, 0, 60, 10) * (n - 1));
  }
  // A question not asked yet in this game (the deck avoids repeats across games too).
  function newQuestion() {
    var list = all(), it = null;
    if (!list.length) { st.id = null; return; }
    for (var i = 0; i < list.length; i++) { it = deck(list); if (st.used.indexOf(it.id) < 0) break; }
    st.id = it ? it.id : null;
  }
  function makeTimer() {
    killTimer();
    timer = WU.Timer({ seconds: secondsFor(st.round), size: 330, onDone: function () { if (st && st.phase === 'talk') endRound(); } });
  }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    var roundTxt = kit.fill(S.round, { n: st.round, total: rounds() });
    h += '<div class="chead">' + kit.chip(S.tag, scr.ea('tag'), '#ff4fc3') +
      (S.round && ph !== 'count' && ph !== 'report' ? '<div class="cround"' + scr.ea('round') + '>' + WU.esc(roundTxt) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (ph === 'freeze') {
      h += '<div class="cbigbox"><div class="cfreeze"' + scr.ea('freeze') + '>' + WU.esc(S.freeze) + '</div></div>';
    } else if (ph === 'count') {
      h += '<div class="cbigbox col"><div class="chands"' + scr.ea('count') + '>' + WU.esc(kit.fill(S.count, { k: st.k })) + '</div>' +
        (S.winner ? '<div class="cwin"' + scr.ea('winner') + '>' + WU.esc(S.winner) + '</div>' : '') + '</div>';
    } else if (ph === 'report') {
      var who = st.reporters[st.r] || '';
      h += '<div class="crep"><div class="cwho"' + scr.ea('report') + '>' + WU.esc(kit.fill(S.report, { name: who })) + '</div>' +
        (S.reportFrame ? '<div class="brow">' + kit.frame(S.reportFrame, scr.ea('reportFrame')) + '</div>' : '') +
        '<div class="cframes">' + st.used.map(byId).filter(Boolean).map(function (q) { return q.report ? kit.frame(q.report, ek(q, 'report'), 'small') : ''; }).join('') + '</div></div>';
    } else {
      h += '<div class="ccard' + (ph === 'next' ? ' flash' : '') + '">' + (it && it.pic ? '<div class="cpic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
        '<div class="cq"><span class="clab"' + scr.ea('askLabel') + '>' + WU.esc(S.askLabel) + '</span>' +
        '<div class="cqt"' + (it ? ek(it, 'ask') : '') + '>' + (it ? WU.esc(it.ask) : '') + '</div></div></div>';
      h += '<div class="cmid"><div class="cans"><span class="clab"' + scr.ea('answerLabel') + '>' + WU.esc(S.answerLabel) + '</span>' +
        (it && it.answer ? kit.frame(it.answer, ek(it, 'answer'), 'cframe') : '') + '</div>' +
        (timer ? '<div class="ctimer"></div>' : '') + '</div>';
      h += '<div class="cbottom">';
      if (ph === 'show') { if (S.ruleShow && S.rule) h += '<div class="rule big"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>'; }
      else if (ph === 'talk') h += '<div class="cgo"' + scr.ea('go') + '>' + WU.esc(S.go) + '</div>';
      else if (ph === 'next') h += '<div class="cgo hot"' + scr.ea('next') + '>' + WU.esc(S.next) + '</div>' + (st.nextLeft ? '<div class="cnum" data-auto>' + st.nextLeft + '</div>' : '');
      h += '</div>';
    }
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.cqt'), 110, 56);
    var cf = box.querySelector('.cframe'); if (cf) kit.fit(cf, 64, 36);
    var cw = box.querySelector('.cwho'); if (cw) kit.fit(cw, 96, 48);
    var ch = box.querySelector('.chands'); if (ch) kit.fit(ch, 130, 64);
    var slot = box.querySelector('.ctimer'); if (slot && timer) slot.appendChild(timer.el);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, n = st.reporters.length;
    var hs = ph === 'show' ? [['SPACE', 'go!'], ['N', 'other question'], ['R', 'start again'], ['Esc', 'home']]
      : ph === 'talk' ? [['SPACE', 'end round now'], ['ENTER', 'pause'], ['Esc', 'home']]
      : ph === 'next' ? [['SPACE', 'go now'], ['N', 'other question'], ['Esc', 'home']]
      : ph === 'freeze' ? [['SPACE', 'hands up'], ['R', 'start again'], ['Esc', 'home']]
      : ph === 'count' ? [['UP', 'more people'], ['DOWN', 'fewer'], ['SPACE', 'reports'], ['Esc', 'home']]
      : [['SPACE', st.r + 1 < n ? 'next student' : 'play again'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function talk() {
    clearT(); st.phase = 'talk'; st.nextLeft = 0;
    if (st.id && st.used.indexOf(st.id) < 0) st.used.push(st.id);
    if (!timer) makeTimer();
    timer.start(); WU.sound.slam(); render();
  }
  function endRound() {
    clearT(); killTimer(); st.demo = false;
    if (st.round >= rounds()) { st.phase = 'freeze'; WU.sound.buzzer(); render(); return; }
    st.round++; newQuestion(); makeTimer(); st.phase = 'next';
    WU.sound.slam();
    var wait = num(scr.get().nextSeconds, 0, 15, 3);
    st.nextLeft = wait; render();
    if (!wait) return;
    var tick = function () {
      if (!st || st.phase !== 'next') return;
      st.nextLeft--;
      if (st.nextLeft <= 0) { talk(); return; }
      WU.sound.beep(660); var c = box.querySelector('.cnum'); if (c) c.textContent = st.nextLeft;
      timers.push(setTimeout(tick, 1000));
    };
    timers.push(setTimeout(tick, 1000));
  }
  function report() {
    clearT(); killTimer();
    var n = num(scr.get().reporters, 1, 5, 3), names = [];
    for (var i = 0; i < n; i++) names.push(kit.student(names));
    st.reporters = names; st.r = 0; st.phase = 'report'; WU.sound.slam(); render();
  }
  function restart() {
    clearT(); killTimer();
    st.phase = 'show'; st.round = 1; st.used = []; st.reporters = []; st.r = 0;
    newQuestion(); makeTimer(); WU.sound.clack(); render();
  }
  function step() {
    var ph = st.phase;
    if (ph !== 'show') st.moved = true;
    if (ph === 'show' || ph === 'next') { st.moved = true; talk(); }
    else if (ph === 'talk') { WU.sound.buzzer(); endRound(); }
    else if (ph === 'freeze') { st.k = num(scr.get().countFrom, 1, 20, 3); st.phase = 'count'; WU.sound.pop(); render(); }
    else if (ph === 'count') report();
    else if (st.r + 1 < st.reporters.length) { st.r++; WU.sound.pop(); render(); }
    else { st.demo = false; restart(); }
  }
  function other() {
    if (st.phase !== 'show' && st.phase !== 'next') return;
    newQuestion(); WU.sound.clack(); render();
  }
  function hands(d) { if (st.phase !== 'count') return; st.k = Math.max(1, st.k + d); WU.sound.pop(); render(); }
  function otherStudent() { if (st.phase !== 'report') return; st.reporters[st.r] = kit.student(st.reporters); WU.sound.slam(); render(); }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!scr.get().demoShow;
    if (!item() && (st.phase === 'show' || st.phase === 'next' || st.phase === 'talk')) newQuestion();
    if (st.phase === 'show') makeTimer();
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('chat-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'SPACE') step();
    else if (k === 'ENTER') { if (timer && st.phase === 'talk') timer.toggle(); }
    else if (k === 'N') other();
    else if (k === 'UP') hands(1);
    else if (k === 'DOWN') hands(-1);
    else if (k === 'P') otherStudent();
    else if (k === 'R') { st.demo = false; restart(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.chat = {
    title: 'Speed Chat',
    teacher: function () {
      if (!st) return null;
      var it = item(), info = [];
      if (it && st.phase !== 'count' && st.phase !== 'report' && st.phase !== 'freeze') {
        info.push({ label: 'Round', text: st.round + ' / ' + rounds() + '   (' + secondsFor(st.round) + ' seconds)' });
        info.push({ label: 'Question', text: it.ask + '   (' + it.answer + ')' });
      }
      if (st.phase === 'count') info.push({ label: 'Hands up', text: st.k + ' people or more. Up / Down to change.' });
      if (st.reporters.length) info.push({ label: 'Reporting', text: st.reporters.map(function (n, i) { return (i === st.r ? '> ' : '') + n; }).join('   ') });
      info.push({ label: 'Step', text: { show: 'Read the question. Space = everyone talks', talk: 'Talking: new partner every time', next: 'New question. It starts by itself', freeze: 'Time is up. Space = hands up', count: 'Hands up. Last hand up wins', report: 'Reports' }[st.phase] });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'go / end round / hands up / reports / next'], ['Enter', 'pause the timer'], ['N', 'another question'], ['Up / Down', 'hands-up number'], ['P', 'another student reports'], ['R', 'start again'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'show', round: 1, id: null, used: [], reporters: [], r: 0, k: 3, nextLeft: 0, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="chg"><div class="layer"></div>' + kit.header('Speed Chat') + '<div class="hints"></div></div>';
      box = el.querySelector('.chg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('chat-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newQuestion(); makeTimer(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); killTimer(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { keyAction('ENTER'); return true; }
      if (e.key === 'ArrowUp') { e.preventDefault(); keyAction('UP'); return true; }
      if (e.key === 'ArrowDown') { e.preventDefault(); keyAction('DOWN'); return true; }
      var map = { n: 'N', p: 'P', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
