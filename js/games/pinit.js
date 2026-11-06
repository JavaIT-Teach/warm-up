/* Warm Up: PIN IT! (grammar game G8, Beginner to Intermediate). Trains: prepositions of time and place.
   A sentence with a gap ("I get up ___ 7 o'clock."). Everyone thinks, then 3, 2, 1... SHOW! Fingers: 1 = at, 2 = on, 3 = in.
   From Intermediate some sentences use for / since / during / by / until (1 to 5 fingers).
   Space reveals the answer and the rule (WHY?) and picks a student to say the whole sentence.
   T chooses: time only, place only, or both.
   Keys: Space countdown / reveal / next, T time / place, N other sentence, P other student, 1-4 team points.
   Content: content/pinit.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'pinit', title: 'Pin It!', content: function () { return WU.content.pinitScreen; },
    fields: [
      { type: 'head', label: 'Sentence' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'count', label: 'Countdown before SHOW (seconds, 0 = none)', type: 'num', min: 0, max: 10 },
      { k: 'show', label: 'Show signal', type: 'text', max: 16 },
      { type: 'head', label: 'Finger cards' },
      { k: 'aoi', label: 'Cards for at / on / in (comma list)', type: 'text', max: 40 },
      { k: 'time2', label: 'Cards for for / since... (comma list)', type: 'text', max: 60 },
      { k: 'hints', label: 'How to show each card (comma list)', type: 'text', max: 90 },
      { type: 'head', label: 'T key' },
      { k: 'mTime', label: 'Time only', type: 'text', max: 20 }, { k: 'mPlace', label: 'Place only', type: 'text', max: 20 }, { k: 'mAll', label: 'Both', type: 'text', max: 24 },
      { type: 'head', label: 'After the reveal' },
      { k: 'whyLabel', label: 'Label in front of the rule', type: 'text', max: 12 }, { k: 'whyShow', label: 'The rule (WHY?)', type: 'bool' },
      { k: 'say', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'demo', label: 'Teacher demo banner (first sentence only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('pinit', 'items', {
    gameTitle: 'Pin It!', label: 'Sentences',
    defaults: function (l) { return WU.content.pinit[l].items; },
    norm: function (r) { return { text: r.text || '', answer: r.answer || '', kind: r.kind === 'place' ? 'place' : 'time', set: r.set === 'time2' ? 'time2' : 'aoi', pic: r.pic || '', why: r.why || '' }; },
    fields: function () {
      return [
        { k: 'text', label: 'Sentence (___ = the gap)', type: 'text', max: 110 },
        { k: 'answer', label: 'Answer (one of the cards)', type: 'text', max: 20 },
        { k: 'kind', label: 'Time or place', type: 'select', options: [['time', 'time'], ['place', 'place']] },
        { k: 'set', label: 'Cards', type: 'select', options: [['aoi', 'at / on / in'], ['time2', 'for / since / during / by / until']] },
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'why', label: 'The rule (shown after the reveal)', type: 'text', max: 100 }
      ];
    },
    blank: function () { return { text: 'I go to bed ___ 10 o\'clock.', answer: 'at', kind: 'time', set: 'aoi', pic: '', why: 'at + a clock time' }; }
  });

  var sh, box, st, offContent = null, timers = [];
  var deck = kit.deck();
  var MODES = ['all', 'time', 'place'];

  function split(s) { return String(s || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean); }
  function pool() { var m = st.mode; return WU.list('pinit', 'items', WU.state.level).filter(function (x) { return x.text && (m === 'all' || x.kind === m); }); }
  function item() { return WU.list('pinit', 'items', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newItem() { var p = pool(); if (!p.length) { st.mode = 'all'; p = pool(); } var it = deck(p); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="pinit:items:' + it.id + ':' + f + '"'; }
  function modeName() { var S = scr.get(); return { all: S.mAll, time: S.mTime, place: S.mPlace }[st.mode]; }

  // A hand: n fingers up (thumb counts as the 5th).
  function hand(n) {
    var f = '';
    for (var i = 0; i < 4; i++) {
      var up = i < n, x = 18 + i * 17;
      f += '<rect x="' + x + '" y="' + (up ? 8 : 40) + '" width="14" height="' + (up ? 46 : 16) + '" rx="7" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4"></rect>';
    }
    var th = n >= 5 ? '<rect x="-2" y="30" width="14" height="40" rx="7" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4" transform="rotate(-30 5 50)"></rect>'
      : '<rect x="2" y="56" width="24" height="14" rx="7" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4" transform="rotate(-20 14 63)"></rect>';
    return '<svg viewBox="0 0 100 100" class="arhand"><rect x="14" y="44" width="72" height="48" rx="16" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4"></rect>' + f + th + '</svg>';
  }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    var words = it ? split(it.set === 'time2' ? S.time2 : S.aoi) : [], hints = split(S.hints), fk = it && it.set === 'time2' ? 'time2' : 'aoi';
    var ans = it ? String(it.answer).trim().toLowerCase() : '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#33c24d') +
      '<div class="gpill pimode" data-h="mode"' + scr.ea({ all: 'mAll', time: 'mTime', place: 'mPlace' }[st.mode]) + '>' + WU.esc(modeName()) + '</div>' +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="arcard' + (ph === 'reveal' ? ' lit' : '') + '">' + (it && it.pic ? '<div class="arpic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="artext"' + (it ? ek(it, 'text') : '') + '>' + (it ? gram.gaps(it.text, ph === 'reveal' ? [it.answer] : null) : '') + '</div></div>';
    h += '<div class="arbottom">';
    if (ph === 'count') h += '<div class="gnum" data-auto>' + st.left + '</div>';
    else {
      var right = ph === 'reveal' ? words.map(function (w) { return w.toLowerCase(); }).indexOf(ans) : -1;
      if (ph === 'show') h += '<div class="gshow arshow"' + scr.ea('show') + '>' + WU.esc(S.show) + '</div>';
      h += '<div class="arcards' + (words.length > 3 ? ' five' : '') + '">' + words.map(function (w, i) {
        return '<div class="arc' + (ph === 'reveal' && right >= 0 ? (right === i ? ' ok' : ' dim') : '') + '">' + hand(i + 1) +
          '<div class="arw"' + scr.ea(fk) + '>' + WU.esc(w) + '</div><div class="arh"' + scr.ea('hints') + '>' + WU.esc(hints[i] || '') + '</div></div>';
      }).join('') + '</div>';
      if (ph === 'reveal') {
        h += '<div class="arafter">';
        if (S.whyShow && it && it.why) h += '<div class="arwhy">' + (S.whyLabel ? '<b' + scr.ea('whyLabel') + '>' + WU.esc(S.whyLabel) + '</b>' : '') + '<span' + ek(it, 'why') + '>' + WU.esc(it.why) + '</span></div>';
        h += gram.who(S.say, scr.ea('say'), st.who) + '</div>';
      } else if (ph === 'ask' && S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.artext'), it && it.pic ? 104 : 112, 52);
    var mb = box.querySelector('[data-h="mode"]'); if (mb) mb.onclick = function (e) { if (!WU.editing) { e.stopPropagation(); keyAction('T'); } };
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ask' ? [['SPACE', '3, 2, 1... show!'], ['T', 'time / place'], ['N', 'other sentence'], ['Esc', 'home']]
      : ph === 'count' ? [['SPACE', 'show now'], ['Esc', 'home']]
      : ph === 'show' ? [['SPACE', 'reveal'], ['Esc', 'home']]
      : [['SPACE', 'next sentence'], ['T', 'time / place'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function countdown() {
    var n = Math.max(0, Math.min(10, +scr.get().count || 0));
    clearT();
    if (!n) { showNow(); return; }
    st.phase = 'count'; st.left = n; render(); WU.sound.beep(660);
    var tick = function () {
      if (!st || st.phase !== 'count') return;
      st.left--;
      if (st.left <= 0) { showNow(); return; }
      WU.sound.beep(660); render(); timers.push(setTimeout(tick, 1000));
    };
    timers.push(setTimeout(tick, 1000));
  }
  function showNow() { clearT(); st.phase = 'show'; WU.sound.slam(); render(); }
  function reveal() { clearT(); st.phase = 'reveal'; st.who = kit.student(); WU.sound.ding(); render(); }
  function next() { clearT(); st.demo = false; newItem(); st.phase = 'ask'; WU.sound.pop(); render(); }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!item()) newItem(); if (st.phase !== 'count') render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ask') countdown(); else if (ph === 'count') showNow(); else if (ph === 'show') reveal(); else next(); }
    else if (k === 'T') {
      if (ph === 'count' || ph === 'show') return;
      st.moved = true; st.mode = MODES[(MODES.indexOf(st.mode) + 1) % MODES.length];
      if (!pool().length) st.mode = MODES[(MODES.indexOf(st.mode) + 1) % MODES.length];
      WU.store.set('pinit-mode', st.mode); WU.toast(modeName()); next();
    }
    else if (k === 'N') { if (ph === 'ask') { st.moved = true; st.demo = false; newItem(); WU.sound.clack(); render(); } }
    else if (k === 'P') { if (ph === 'reveal') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.pinit = {
    title: 'Pin It!',
    teacher: function () {
      if (!st) return null;
      var it = item(), sec = [], info = [];
      if (it) { sec.push({ label: 'Answer', text: it.answer, big: true }); if (it.why) sec.push({ label: 'Why', text: it.why }); info.push({ label: 'Sentence', text: it.text }); }
      info.push({ label: 'T key', text: modeName() });
      if (st.who && st.phase === 'reveal') info.push({ label: 'Says the sentence', text: st.who });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'countdown / reveal / next sentence'], ['T', 'time only / place only / both'], ['N', 'other sentence'], ['P', 'other student (after the reveal)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'arg pig', 'Pin It!', 'pinit-sb'); box = sh.box;
      st = { phase: 'ask', id: null, mode: WU.store.get('pinit-mode', 'all'), demo: !!scr.get().demoShow, who: null };
      if (MODES.indexOf(st.mode) < 0) st.mode = 'all';
      newItem(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { t: 'T', n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
