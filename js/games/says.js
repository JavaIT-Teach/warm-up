/* Warm Up: TEACHER SAYS (moving game, Beginner and Elementary only; greyed out above).
   Everyone stands. A command appears, sometimes with "Teacher says:" in front (random), sometimes without.
   Do it only with "Teacher says". Whoever moves without it becomes a CALLER: callers read the next commands aloud.
   Keys: Space next command, X someone moved (new caller), A automatic (a new command every few seconds), R start again.
   Content: content/says.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'says', title: 'Teacher Says', content: function () { return WU.content.saysScreen; },
    fields: [
      { type: 'head', label: 'Commands' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'says', label: 'The magic words', type: 'text', max: 24 },
      { k: 'chance', label: 'How often the magic words come (%)', type: 'num', min: 10, max: 100 },
      { k: 'ready', label: 'Before the first command', type: 'text', max: 40 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'autoSeconds', label: 'Automatic: seconds between commands (A key; 0 = 5)', type: 'num', min: 0, max: 30 },
      { type: 'head', label: 'Callers' },
      { k: 'wrong', label: 'Someone moved (X)', type: 'text', max: 60 },
      { k: 'caller', label: 'With callers: read the command', type: 'text', max: 50 },
      { k: 'callers', label: 'Number of callers ({n})', type: 'text', max: 24 },
      { k: 'demo', label: 'Teacher demo banner (first command only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('says', 'commands', {
    gameTitle: 'Teacher Says', label: 'Commands',
    defaults: function (l) { return WU.content.says[l].commands; },
    norm: function (r) { return { text: r.text || '', pic: r.pic || '' }; },
    fields: function () { return [{ k: 'text', label: 'Command (at the seat: no dancing, no acting)', type: 'text', max: 60 }, { k: 'pic', label: 'Picture', type: 'pic' }]; },
    blank: function () { return { text: 'Touch your ___.', pic: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timers = [], auto = null;
  var deck = kit.deck();

  function item() { return WU.list('says', 'commands', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  function ek(it, f) { return ' data-edit="says:commands:' + it.id + ':' + f + '"'; }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    h += '<div class="thead2">' + kit.chip(S.tag, scr.ea('tag'), '#3d6bff') +
      (st.callers && S.callers ? '<div class="tcall"' + scr.ea('callers') + '>' + WU.esc(kit.fill(S.callers, { n: st.callers })) + '</div>' : '') +
      (auto ? '<div class="tauto" data-ctrl>AUTO</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (ph === 'ready') {
      h += '<div class="tready"><div class="tbig"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div></div>';
    } else {
      h += '<div class="tcmd' + (st.flash ? ' flash' : '') + '">' + (st.withSays && S.says ? '<div class="tsays"' + scr.ea('says') + '>' + WU.esc(S.says) + '</div>' : '') +
        '<div class="tbody">' + (it && it.pic ? '<div class="tpic2"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
        '<div class="ttext"' + (it ? ek(it, 'text') : '') + '>' + (it ? WU.esc(it.text) : '') + '</div></div></div>';
    }
    h += '<div class="tbottom2">';
    if (st.wrongShow && S.wrong) h += '<div class="twrong"' + scr.ea('wrong') + '>' + WU.esc(S.wrong) + '</div>';
    else if (ph === 'cmd' && st.callers && S.caller) h += '<div class="tcaller"' + scr.ea('caller') + '>' + WU.esc(S.caller) + '</div>';
    else if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    var tt = box.querySelector('.ttext'); if (tt) kit.fit(tt, 130, 60);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = st.phase === 'ready' ? [['SPACE', 'first command'], ['A', 'automatic'], ['Esc', 'home']]
      : [['SPACE', 'next command'], ['X', 'someone moved'], ['A', auto ? 'stop automatic' : 'automatic'], ['R', 'start again'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function next() {
    clearT(); var S = scr.get();
    if (st.phase === 'cmd') st.demo = false;
    var it = deck(WU.list('says', 'commands', WU.state.level));
    st.id = it ? it.id : null;
    st.withSays = Math.random() * 100 < Math.max(10, Math.min(100, +S.chance || 70));
    st.phase = 'cmd'; st.wrongShow = false; st.flash = true;
    WU.sound.pop(); // the same sound either way: no clue in the sound
    render();
    timers.push(setTimeout(function () { if (st) { st.flash = false; var c = box && box.querySelector('.tcmd'); if (c) c.classList.remove('flash'); } }, 500));
  }
  function wrong() {
    if (st.phase !== 'cmd') return;
    st.callers++; st.wrongShow = true; WU.sound.buzzer(); render();
  }
  function toggleAuto() {
    if (auto) { stopAuto(); render(); return; }
    var sec = Math.max(2, Math.min(30, +scr.get().autoSeconds || 5));
    if (st.phase === 'ready') next();
    auto = setInterval(function () { if (st && !WU.overlay) next(); }, sec * 1000);
    WU.sound.clack(); render();
  }
  function restart() { clearT(); stopAuto(); st.phase = 'ready'; st.callers = 0; st.wrongShow = false; st.id = null; WU.sound.clack(); render(); }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; render(); }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('says-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'SPACE') { st.moved = true; next(); }
    else if (k === 'X') wrong();
    else if (k === 'A') { st.moved = true; toggleAuto(); }
    else if (k === 'R') restart();
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.says = {
    title: 'Teacher Says',
    teacher: function () {
      if (!st) return null;
      var it = item(), S = scr.get(), sec = [], info = [];
      if (st.phase === 'cmd' && it) {
        sec.push({ label: 'Should they do it?', text: st.withSays ? 'YES: "' + S.says + '" was there' : 'NO: no "' + S.says + '". Anyone who moved: X', big: true, hot: !st.withSays });
        info.push({ label: 'Command', text: (st.withSays ? S.says + ' ' : '') + it.text });
      }
      info.push({ label: 'Callers', text: String(st.callers) });
      if (auto) info.push({ label: 'Automatic', text: 'on (A = stop)' });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'next command'], ['X', 'someone moved: new caller'], ['A', 'automatic on / off'], ['R', 'start again'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', id: null, withSays: true, callers: 0, wrongShow: false, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="tsg"><div class="layer"></div>' + kit.header('Teacher Says') + '<div class="hints"></div></div>';
      box = el.querySelector('.tsg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('says-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); stopAuto(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { x: 'X', a: 'A', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
