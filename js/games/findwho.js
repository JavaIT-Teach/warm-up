/* Warm Up: FIND SOMEONE WHO (moving game, all levels).
   One task ("Find someone who can swim."), the question to ask and both answers. Space: everyone stands up and walks (timer).
   Rule: find one YES and one NO, then sit down. So "everybody said no" still completes half the task.
   After the timer: the screen picks students who report (frame per task). Higher levels: ask one follow-up question after a YES.
   Keys: Space next step, Enter pause, N another task, P another student (report).
   Content: content/findwho.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'findwho', title: 'Find Someone Who', content: function () { return WU.content.findwhoScreen; },
    fields: [
      { type: 'head', label: 'Task' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'askLabel', label: 'Before the question', type: 'text', max: 16 },
      { k: 'answerLabel', label: 'Before the answers', type: 'text', max: 16 },
      { k: 'followLabel', label: 'Before the follow-up question', type: 'text', max: 30 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Walk and report' },
      { k: 'go', label: 'Start walking', type: 'text', max: 40 },
      { k: 'seconds', label: 'Time to walk and ask (seconds)', type: 'num', min: 20, max: 300 },
      { k: 'stop', label: 'Time is up', type: 'text', max: 30 },
      { k: 'reporters', label: 'Students who report (1-5)', type: 'num', min: 1, max: 5 },
      { k: 'report', label: 'Report line ({name})', type: 'text', max: 40 },
      { k: 'nobody', label: 'Help when nobody said YES', type: 'text', max: 80 },
      { k: 'demo', label: 'Teacher demo banner (first task only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('findwho', 'tasks', {
    gameTitle: 'Find Someone Who', label: 'Tasks',
    defaults: function (l) { return WU.content.findwho[l].tasks; },
    norm: function (r) { return { task: r.task || '', ask: r.ask || '', yes: r.yes || '', no: r.no || '', report: r.report || '', pic: r.pic || '', follow: r.follow || '' }; },
    title: function (it) { return it.task; },
    fields: function () {
      return [
        { k: 'task', label: 'Task ("Find someone who...")', type: 'text', max: 90 },
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'ask', label: 'The question to ask', type: 'text', max: 80 },
        { k: 'yes', label: 'YES answer', type: 'text', max: 30 },
        { k: 'no', label: 'NO answer', type: 'text', max: 30 },
        { k: 'follow', label: 'Follow-up question after a YES (empty = none)', type: 'text', max: 60 },
        { k: 'report', label: 'Report frame', type: 'text', max: 80, hint: 'Use ___ for the gaps.' }
      ];
    },
    blank: function () { return { task: 'Find someone who can ___.', ask: 'Can you ___?', yes: 'Yes, I can.', no: "No, I can't.", report: "___ can ___. ___ can't ___.", pic: '', follow: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timer = null, timers = [];
  var deck = kit.deck();

  function item() { return WU.list('findwho', 'tasks', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newTask() { var it = deck(WU.list('findwho', 'tasks', WU.state.level)); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="findwho:tasks:' + it.id + ':' + f + '"'; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function killTimer() { if (timer) { timer.destroy(); timer = null; } }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    h += '<div class="fhead">' + kit.chip(S.tag, scr.ea('tag'), '#c6ff00') + (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="ftask">' + (it && it.pic ? '<div class="fpic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="ftt"' + (it ? ek(it, 'task') : '') + '>' + (it ? WU.esc(it.task) : '') + '</div></div>';
    if (ph === 'report') {
      var who = st.reporters[st.r] || '';
      h += '<div class="fmid rep"><div class="fwho"' + scr.ea('report') + '>' + WU.esc(kit.fill(S.report, { name: who })) + '</div>' +
        (it && it.report ? '<div class="brow">' + kit.frame(it.report, ek(it, 'report')) + '</div>' : '') +
        (S.nobody ? '<div class="rule"' + scr.ea('nobody') + '>' + WU.esc(S.nobody) + '</div>' : '') + '</div>';
    } else {
      h += '<div class="fmid"><div class="fqa">' +
        '<div class="frow"><span class="flab"' + scr.ea('askLabel') + '>' + WU.esc(S.askLabel) + '</span><span class="fq"' + (it ? ek(it, 'ask') : '') + '>' + (it ? WU.esc(it.ask) : '') + '</span></div>' +
        '<div class="frow"><span class="flab"' + scr.ea('answerLabel') + '>' + WU.esc(S.answerLabel) + '</span>' +
        (it ? '<span class="fans y"' + ek(it, 'yes') + '>' + WU.esc(it.yes) + '</span><span class="fans n"' + ek(it, 'no') + '>' + WU.esc(it.no) + '</span>' : '') + '</div>' +
        (it && it.follow ? '<div class="frow"><span class="flab"' + scr.ea('followLabel') + '>' + WU.esc(S.followLabel) + '</span><span class="ff"' + ek(it, 'follow') + '>' + WU.esc(it.follow) + '</span></div>' : '') +
        '</div>' + (timer && (ph === 'walk' || ph === 'stop') ? '<div class="ftimer"></div>' : '') + '</div>';
    }
    h += '<div class="fbottom">';
    if (ph === 'show') { if (S.ruleShow && S.rule) h += '<div class="rule big"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>'; }
    else if (ph === 'walk') h += '<div class="fgo"' + scr.ea('go') + '>' + WU.esc(S.go) + '</div>' + (S.ruleShow && S.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>' : '');
    else if (ph === 'stop') h += '<div class="fgo stop"' + scr.ea('stop') + '>' + WU.esc(S.stop) + '</div>';
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.ftt'), 84, 48);
    var fq = box.querySelector('.fq'); if (fq) kit.fit(fq, 64, 40);
    var fw = box.querySelector('.fwho'); if (fw) kit.fit(fw, 110, 56);
    var slot = box.querySelector('.ftimer'); if (slot && timer) slot.appendChild(timer.el);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, n = st.reporters.length;
    var hs = ph === 'show' ? [['SPACE', 'stand up and walk'], ['N', 'other task'], ['Esc', 'home']]
      : ph === 'walk' ? [['SPACE', 'stop now'], ['ENTER', 'pause'], ['Esc', 'home']]
      : ph === 'stop' ? [['SPACE', 'report'], ['Esc', 'home']]
      : [['SPACE', st.r + 1 < n ? 'next student' : 'next task'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function walk() {
    clearT(); killTimer(); st.phase = 'walk'; st.demo = false;
    timer = WU.Timer({ seconds: Math.max(20, Math.min(300, +scr.get().seconds || 90)), size: 330, onDone: function () { if (st && st.phase === 'walk') { st.phase = 'stop'; render(); } } });
    timer.start(); WU.sound.slam(); render();
  }
  function stopWalk() { killTimer(); st.phase = 'stop'; WU.sound.buzzer(); render(); }
  function report() {
    clearT(); killTimer();
    var n = Math.max(1, Math.min(5, +scr.get().reporters || 3)), names = [];
    for (var i = 0; i < n; i++) names.push(kit.student(names));
    st.reporters = names; st.r = 0; st.phase = 'report'; WU.sound.slam(); render();
  }
  function step() {
    st.moved = true;
    var ph = st.phase;
    if (ph === 'show') walk();
    else if (ph === 'walk') stopWalk();
    else if (ph === 'stop') report();
    else if (st.r + 1 < st.reporters.length) { st.r++; WU.sound.pop(); render(); }
    else { newTask(); st.phase = 'show'; st.reporters = []; WU.sound.clack(); render(); }
  }
  function other() { if (st.phase !== 'report') return; st.reporters[st.r] = kit.student(st.reporters); WU.sound.slam(); render(); }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!item()) newTask(); render(); }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('findwho-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'SPACE') step();
    else if (k === 'ENTER') { if (timer && st.phase === 'walk') timer.toggle(); }
    else if (k === 'N') { if (st.phase === 'show') { st.moved = true; st.demo = false; newTask(); WU.sound.clack(); render(); } }
    else if (k === 'P') other();
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.findwho = {
    title: 'Find Someone Who',
    teacher: function () {
      if (!st) return null;
      var it = item(), info = [];
      if (it) { info.push({ label: 'Task', text: it.task }); info.push({ label: 'Question', text: it.ask + '   (' + it.yes + ' / ' + it.no + ')' }); }
      if (st.reporters.length) info.push({ label: 'Reporting', text: st.reporters.map(function (n, i) { return (i === st.r ? '> ' : '') + n; }).join('   ') });
      info.push({ label: 'Step', text: { show: 'Read the task. Space = everyone walks', walk: 'Walking and asking', stop: 'Time is up. Space = reports', report: 'Reports' }[st.phase] });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'walk / stop / report / next'], ['Enter', 'pause the timer'], ['N', 'another task'], ['P', 'another student reports'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'show', id: null, reporters: [], r: 0, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="fwg"><div class="layer"></div>' + kit.header('Find Someone Who') + '<div class="hints"></div></div>';
      box = el.querySelector('.fwg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('findwho-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newTask(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); killTimer(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { keyAction('ENTER'); return true; }
      var map = { n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
