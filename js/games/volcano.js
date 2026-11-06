/* Warm Up: VERB VOLCANO (grammar game G5, Elementary and up). Trains: irregular verbs (past simple, past participle).
   A verb sits on the volcano. The lava rises. The picked student says the forms (go - went - gone) before it reaches the top.
   Space = right: SAFE! (with teams on, the team on turn gets a point). X or time up: the volcano ERUPTS.
   Either way the forms are revealed, then an optional follow-up ("Have you ever ...?").
   Keys: Space start / right / next, X wrong, N other verb, P other student, 1-4 team points.
   Content: content/volcano.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'volcano', title: 'Verb Volcano', content: function () { return WU.content.volcanoScreen; },
    fields: [
      { type: 'head', label: 'The volcano' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'who', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'turn', label: 'Team on turn ({team})', type: 'text', max: 30 },
      { k: 'seconds', label: 'Seconds before it erupts', type: 'num', min: 2, max: 60 },
      { k: 'askPP', label: 'Past participle', type: 'bool', on: 'Ask it', off: "Don't ask" },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'The answer' },
      { k: 'lBase', label: 'Label: verb', type: 'text', max: 20 }, { k: 'lPast', label: 'Label: past simple', type: 'text', max: 20 }, { k: 'lPP', label: 'Label: past participle', type: 'text', max: 20 },
      { k: 'safe', label: 'Right answer', type: 'text', max: 16 }, { k: 'boom', label: 'Wrong / too slow', type: 'text', max: 16 },
      { k: 'use', label: 'Follow-up ({base} {past} {pp})', type: 'text', max: 80 }, { k: 'useShow', label: 'Follow-up', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first verb only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('volcano', 'verbs', {
    gameTitle: 'Verb Volcano', label: 'Verbs',
    defaults: function (l) { return WU.content.volcano[l].verbs; },
    norm: function (r) { return { base: r.base || '', past: r.past || '', pp: r.pp || '' }; },
    title: function (it) { return [it.base, it.past, it.pp].join(' - '); },
    fields: function () { return [{ k: 'base', label: 'Verb', type: 'text', max: 30 }, { k: 'past', label: 'Past simple', type: 'text', max: 30 }, { k: 'pp', label: 'Past participle', type: 'text', max: 30 }]; },
    blank: function () { return { base: 'go', past: 'went', pp: 'gone' }; }
  });

  var sh, box, st, offContent = null, timer = null, deck = kit.deck(), turns = kit.turns();

  function verb() { return WU.list('volcano', 'verbs', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newVerb() { var it = deck(WU.list('volcano', 'verbs', WU.state.level).filter(function (x) { return x.base; })); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="volcano:verbs:' + it.id + ':' + f + '"'; }
  function stopT() { if (timer) clearTimeout(timer); timer = null; }

  function lavaBlobs() {
    var h = '';
    for (var i = 0; i < 9; i++) h += '<i style="--dx:' + (WU.rand(900) - 450) + 'px;--dy:' + (-260 - WU.rand(260)) + 'px;animation-delay:' + (i * 0.04) + 's"></i>';
    return '<div class="vcblobs">' + h + '</div>';
  }
  function render() {
    var S = scr.get(), it = verb(), ph = st.phase, h = '', team = turns.on();
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#ff5a1f') +
      (team ? '<div class="gpill" style="background:' + turns.color() + ';color:#0d0d0d;border:4px solid #0d0d0d"' + scr.ea('turn') + '>' + WU.esc(kit.fill(S.turn, { team: turns.name() })) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    var hot = ph === 'run' ? ' run' : ph === 'boom' ? ' boom' : ph === 'safe' ? ' safe' : '';
    h += '<div class="vcwrap' + (ph === 'boom' ? ' shake' : '') + '"><div class="vcmount' + hot + '"><div class="vclava" style="transition-duration:' + (ph === 'run' ? Math.max(2, +S.seconds || 8) : 0.3) + 's"></div></div>' +
      '<div class="vccrater"></div>' + (ph === 'boom' ? lavaBlobs() : '') +
      '<div class="vcsign"' + (it ? ek(it, 'base') : '') + '>' + (it ? WU.esc(it.base) : '') + '</div>' +
      (ph === 'safe' ? '<div class="vcbig ok"' + scr.ea('safe') + '>' + WU.esc(S.safe) + '</div>' : ph === 'boom' ? '<div class="vcbig bad"' + scr.ea('boom') + '>' + WU.esc(S.boom) + '</div>' : '') + '</div>';
    h += '<div class="vcbottom">';
    if ((ph === 'safe' || ph === 'boom') && it) {
      var card = function (lab, la, val, f) { return '<div class="vcform"><div class="vcl"' + scr.ea(la) + '>' + WU.esc(lab) + '</div><div class="vcv"' + ek(it, f) + '>' + WU.esc(val) + '</div></div>'; };
      h += '<div class="vcforms">' + card(S.lBase, 'lBase', it.base, 'base') + card(S.lPast, 'lPast', it.past, 'past') + (S.askPP ? card(S.lPP, 'lPP', it.pp, 'pp') : '') + '</div>';
      if (S.useShow && S.use) h += '<div class="rule vcuse"' + scr.ea('use') + '>' + WU.esc(kit.fill(S.use, { base: it.base, past: it.past, pp: it.pp })) + '</div>';
    } else {
      h += '<div class="brow">' + gram.who(S.who, scr.ea('who'), st.who) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.vcsign'), 120, 50);
    // Start the lava after the first paint so the transition runs.
    if (ph === 'run') { var lv = box.querySelector('.vclava'); void lv.offsetWidth; requestAnimationFrame(function () { if (lv.isConnected) lv.classList.add('up'); }); }
    else if (ph === 'boom' || ph === 'safe') { var l2 = box.querySelector('.vclava'); if (l2 && ph === 'boom') l2.classList.add('up', 'now'); }
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['SPACE', 'start the lava'], ['N', 'other verb'], ['P', 'other student'], ['Esc', 'home']]
      : ph === 'run' ? [['SPACE', 'right!'], ['X', 'wrong'], ['Esc', 'home']]
      : [['SPACE', 'next verb'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function run() {
    var S = scr.get(); st.phase = 'run'; WU.sound.clack(); render();
    timer = setTimeout(function () { timer = null; if (st && st.phase === 'run') boom(); }, Math.max(2, +S.seconds || 8) * 1000);
  }
  function safe() { stopT(); st.phase = 'safe'; WU.sound.ding(); if (turns.on() && sh.sb) sh.sb.add(turns.cur(), 1); render(); }
  function boom() { stopT(); st.phase = 'boom'; WU.sound.boom(); render(); }
  function next() { stopT(); st.demo = false; if (turns.on()) turns.next(); newVerb(); st.who = kit.student([st.who]); st.phase = 'ready'; WU.sound.pop(); render(); }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!verb()) newVerb(); if (st.phase !== 'run') render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ready') run(); else if (ph === 'run') safe(); else next(); }
    else if (k === 'X') { if (ph === 'run') boom(); }
    else if (k === 'N') { if (ph === 'ready') { st.moved = true; st.demo = false; newVerb(); WU.sound.clack(); render(); } }
    else if (k === 'P') { if (ph === 'ready') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.volcano = {
    title: 'Verb Volcano',
    teacher: function () {
      if (!st) return null;
      var it = verb(), S = scr.get(), sec = [], info = [];
      if (it) sec.push({ label: 'Answer', text: it.base + ' - ' + it.past + (S.askPP ? ' - ' + it.pp : ''), big: true });
      info.push({ label: 'Student', text: st.who || '' });
      if (turns.on()) info.push({ label: 'Team on turn', text: turns.name() });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'start the lava / right / next verb'], ['X', 'wrong: it erupts'], ['N', 'other verb'], ['P', 'other student'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'vcg', 'Verb Volcano', 'volcano-sb'); box = sh.box;
      turns.reset();
      st = { phase: 'ready', id: null, demo: !!scr.get().demoShow, who: kit.student() };
      newVerb(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && st.phase !== 'run') render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { stopT(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { x: 'X', n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
