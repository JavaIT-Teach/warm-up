/* Warm Up: FOUR ZONES (moving game, all levels).
   A question with four answers. Each answer is a zone in the middle of the room (a map shows where: front = near the board).
   Space: students walk to their zone (timer). Then they tell their zone why (timer, frame). Then one person per zone reports.
   Keys: Space next step, Enter pause the timer, N another question.
   Content: content/zones.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var COLORS = ['#ff3b3b', '#3d6bff', '#33c24d', '#ffe600'], INK = ['#fff', '#fff', '#0d0d0d', '#0d0d0d'];

  var scr = kit.screen({
    game: 'zones', title: 'Four Zones', content: function () { return WU.content.zonesScreen; },
    fields: [
      { type: 'head', label: 'Question and map' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'board', label: 'Map: the board', type: 'text', max: 16 },
      { k: 'zone1', label: 'Zone 1 (red, near the board, left)', type: 'text', max: 16 },
      { k: 'zone2', label: 'Zone 2 (blue, near the board, right)', type: 'text', max: 16 },
      { k: 'zone3', label: 'Zone 3 (green, at the back, left)', type: 'text', max: 16 },
      { k: 'zone4', label: 'Zone 4 (yellow, at the back, right)', type: 'text', max: 16 },
      { k: 'mapPics', label: 'Pictures on the map', type: 'bool', on: 'On', off: 'Off' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Walk, talk, report' },
      { k: 'go', label: 'Walk to your zone', type: 'text', max: 40 },
      { k: 'moveSeconds', label: 'Time to walk (seconds)', type: 'num', min: 3, max: 60 },
      { k: 'talk', label: 'Talk in your zone', type: 'text', max: 90 },
      { k: 'frame', label: 'Frame for every question at this level (empty = none)', type: 'text', max: 60, hint: 'A question can have its own frame.' },
      { k: 'talkSeconds', label: 'Time to talk (seconds)', type: 'num', min: 10, max: 300 },
      { k: 'report', label: 'Report ({zone} = zone name, {answer} = its answer)', type: 'text', max: 70 },
      { k: 'back', label: 'At the end', type: 'text', max: 40 },
      { k: 'demo', label: 'Teacher demo banner (first question only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('zones', 'questions', {
    gameTitle: 'Four Zones', label: 'Questions',
    defaults: function (l) { return WU.content.zones[l].questions; },
    norm: function (r) { return { q: r.q || '', a1: r.a1 || '', p1: r.p1 || '', a2: r.a2 || '', p2: r.p2 || '', a3: r.a3 || '', p3: r.p3 || '', a4: r.a4 || '', p4: r.p4 || '', frame: r.frame || '' }; },
    title: function (it) { return it.q; },
    fields: function () {
      var f = [{ k: 'q', label: 'Question', type: 'text', max: 80 }];
      ['red, near the board, left', 'blue, near the board, right', 'green, at the back, left', 'yellow, at the back, right'].forEach(function (w, i) {
        f.push({ k: 'a' + (i + 1), label: 'Answer ' + (i + 1) + ' (' + w + ')', type: 'text', max: 30 }, { k: 'p' + (i + 1), label: 'Picture ' + (i + 1), type: 'pic' });
      });
      f.push({ k: 'frame', label: 'Frame for this question', type: 'text', max: 60,
        ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; }, hint: "Empty = the level's frame." });
      return f;
    },
    blank: function () { return { q: 'Favourite ___?', a1: 'cats', p1: 'cat', a2: 'dogs', p2: 'dog', a3: 'fish', p3: 'fish', a4: 'birds', p4: 'bird', frame: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timer = null, timers = [];
  var deck = kit.deck();

  function item() { return WU.list('zones', 'questions', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newQuestion() { var it = deck(WU.list('zones', 'questions', WU.state.level)); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="zones:questions:' + it.id + ':' + f + '"'; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function killTimer() { if (timer) { timer.destroy(); timer = null; } }

  function zonesHTML(it, S) {
    var h = '<div class="zgrid">';
    for (var i = 0; i < 4; i++) {
      var k = i + 1, hl = st.phase === 'report' && st.zone === i;
      h += '<div class="zz' + (hl ? ' hl' : '') + (st.phase === 'report' && !hl ? ' dimz' : '') + '" style="background:' + COLORS[i] + ';color:' + INK[i] + '">' +
        '<div class="zl"' + scr.ea('zone' + k) + '>' + WU.esc(S['zone' + k]) + '</div><div class="zrow">' +
        (S.mapPics && it && it['p' + k] ? '<div class="zp"' + ek(it, 'p' + k) + '>' + WU.pic(it['p' + k]) + '</div>' : '') +
        (it ? '<div class="za"' + ek(it, 'a' + k) + '>' + WU.esc(it['a' + k]) + '</div>' : '') + '</div></div>';
    }
    return h + '</div>';
  }
  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    h += '<div class="zhead">' + kit.chip(S.tag, scr.ea('tag'), '#00e5c7') + (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="zq"' + (it ? ek(it, 'q') : '') + '>' + (it ? WU.esc(it.q) : '') + '</div>';
    h += '<div class="zleft">';
    if (ph === 'ask') {
      h += '<div class="zcards">';
      for (var i = 0; i < 4 && it; i++) {
        var k = i + 1;
        h += '<div class="zc" style="background:' + COLORS[i] + ';color:' + INK[i] + '">' + (it['p' + k] ? '<div class="zcp"' + ek(it, 'p' + k) + '>' + WU.pic(it['p' + k]) + '</div>' : '') +
          '<div class="zct"' + ek(it, 'a' + k) + '>' + WU.esc(it['a' + k]) + '</div></div>';
      }
      h += '</div>';
    } else if (ph === 'move' || ph === 'talk') {
      h += '<div class="ztimer"></div><div class="zphase">' + (ph === 'move' ? '<div class="zbig"' + scr.ea('go') + '>' + WU.esc(S.go) + '</div>'
        : '<div class="zbig"' + scr.ea('talk') + '>' + WU.esc(S.talk) + '</div>') + '</div>';
    } else if (ph === 'report') {
      var z = st.zone + 1;
      h += '<div class="zrep" style="background:' + COLORS[st.zone] + ';color:' + INK[st.zone] + '"' + scr.ea('report') + '>' +
        WU.esc(kit.fill(S.report, { zone: S['zone' + z], answer: it ? it['a' + z] : '' })) + '</div>';
    } else {
      h += '<div class="zbig back"' + scr.ea('back') + '>' + WU.esc(S.back) + '</div>';
    }
    h += '</div>';
    h += kit.roomMap(S.board, scr.ea('board'), zonesHTML(it, S), 'zmap');
    h += '<div class="zbottom">';
    var fr = it && it.frame ? kit.frame(it.frame, ek(it, 'frame')) : kit.frame(S.frame, scr.ea('frame'));
    if (ph === 'ask') { if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>'; }
    else if (ph === 'talk' || ph === 'report') { if (fr) h += '<div class="brow">' + fr + '</div>'; }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.zq'), 84, 48);
    box.querySelectorAll('.zct').forEach(function (e) { kit.fit(e, 60, 40); });
    box.querySelectorAll('.za').forEach(function (e) { kit.fit(e, 44, 40); });
    var zb = box.querySelector('.zbig'); if (zb) kit.fit(zb, 72, 44);
    var zr = box.querySelector('.zrep'); if (zr) kit.fit(zr, 72, 44);
    var slot = box.querySelector('.ztimer'); if (slot && timer) slot.appendChild(timer.el);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ask' ? [['SPACE', 'walk to the zones'], ['N', 'other question'], ['Esc', 'home']]
      : ph === 'move' ? [['SPACE', 'talk now'], ['ENTER', 'pause'], ['Esc', 'home']]
      : ph === 'talk' ? [['SPACE', 'report'], ['ENTER', 'pause'], ['Esc', 'home']]
      : ph === 'report' ? [['SPACE', st.zone < 3 ? 'next zone' : 'back to seats'], ['Esc', 'home']]
      : [['SPACE', 'next question'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function secs(k, lo, hi, d) { return Math.max(lo, Math.min(hi, +scr.get()[k] || d)); }
  function startTimer(seconds, done) {
    killTimer();
    timer = WU.Timer({ seconds: seconds, size: 340, onDone: done });
    timer.start();
  }
  function toMove() { st.phase = 'move'; st.demo = false; WU.sound.slam(); startTimer(secs('moveSeconds', 3, 60, 10), function () { if (st && st.phase === 'move') timers.push(setTimeout(toTalk, 900)); }); render(); }
  function toTalk() { clearT(); st.phase = 'talk'; WU.sound.ding(); startTimer(secs('talkSeconds', 10, 300, 60)); render(); }
  function toReport(z) { clearT(); killTimer(); st.phase = 'report'; st.zone = z; WU.sound.pop(); render(); }
  function step() {
    var ph = st.phase; st.moved = true;
    if (ph === 'ask') toMove();
    else if (ph === 'move') toTalk();
    else if (ph === 'talk') toReport(0);
    else if (ph === 'report') { if (st.zone < 3) toReport(st.zone + 1); else { st.phase = 'back'; WU.sound.clack(); render(); } }
    else { newQuestion(); st.phase = 'ask'; WU.sound.pop(); render(); }
  }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!item()) newQuestion(); render(); }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('zones-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'SPACE') step();
    else if (k === 'ENTER') { if (timer) timer.toggle(); }
    else if (k === 'N') { if (st.phase === 'ask') { st.moved = true; st.demo = false; newQuestion(); WU.sound.clack(); render(); } }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.zones = {
    title: 'Four Zones',
    teacher: function () {
      if (!st) return null;
      var it = item(), S = scr.get(), info = [];
      if (it) {
        info.push({ label: 'Question', text: it.q });
        info.push({ label: 'Zones', text: [1, 2, 3, 4].map(function (k) { return S['zone' + k] + ': ' + it['a' + k]; }).join('   ') });
      }
      info.push({ label: 'Step', text: { ask: 'Read the question. Space = walk', move: 'Walking to the zones', talk: 'Talking in the zones', report: 'Report: ' + (S['zone' + (st.zone + 1)] || ''), back: 'Back to seats. Space = next question' }[st.phase] });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'walk / talk / report / next'], ['Enter', 'pause the timer'], ['N', 'another question'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'ask', id: null, zone: 0, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="zng"><div class="layer"></div>' + kit.header('Four Zones') + '<div class="hints"></div></div>';
      box = el.querySelector('.zng');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('zones-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newQuestion(); render();
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
