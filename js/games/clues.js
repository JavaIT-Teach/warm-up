/* Warm Up: CLUE BY CLUE (reading + vocabulary). A word from the taught units hides behind up to five written clues,
   hardest first. Space shows the next clue; the points drop (5, 4, 3...). The class reads and shouts guesses.
   Enter = guessed (or, with teams, 1-4 = that team guessed: it gets the points). X = wrong guess: the next clue appears.
   After the last clue, Space shows the answer (no points). Then everyone writes the word and checks the spelling.
   Keys: Space next clue / answer / next word, Enter guessed, 1-4 team guessed, X wrong guess, N other word, S scores.
   Content: content/clues.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;
  var MAXC = 5;

  var scr = kit.screen({
    game: 'clues', title: 'Clue by Clue', content: function () { return WU.content.cluesScreen; },
    fields: [
      { type: 'head', label: 'Card' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 30 },
      { k: 'unitShow', label: 'Unit tag', type: 'bool' },
      { k: 'pts', label: 'Points label', type: 'text', max: 16 },
      { k: 'task', label: 'Task while the clues come', type: 'text', max: 60 },
      { type: 'head', label: 'Answer' },
      { k: 'got', label: 'Stamp: guessed', type: 'text', max: 16 },
      { k: 'nobody', label: 'Nobody guessed it', type: 'text', max: 30 },
      { k: 'write', label: 'Writing task under the answer', type: 'text', max: 60 },
      { k: 'writeShow', label: 'Writing task', type: 'bool' },
      { k: 'pics', label: 'Picture with the answer', type: 'bool', on: 'On', off: 'Off' },
      { k: 'demo', label: 'Teacher demo banner (first card only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  var clueFields = [];
  for (var i = 1; i <= MAXC; i++) clueFields.push({ k: 'c' + i, label: 'Clue ' + i + (i === 1 ? ' (hardest)' : i === MAXC ? ' (easiest)' : '') + (i > 2 ? ' (empty = not used)' : ''), type: 'text', max: 90 });
  WU.registerList('clues', 'cards', {
    gameTitle: 'Clue by Clue', label: 'Cards',
    defaults: function (l) { return WU.content.clues[l].cards; },
    norm: function (r) {
      var o = { word: r.word || '', unit: r.unit || '', pic: r.pic || '' };
      for (var k = 1; k <= MAXC; k++) o['c' + k] = r['c' + k] || '';
      return o;
    },
    fields: function () {
      return [{ k: 'word', label: 'The answer', type: 'text', max: 30 }, { k: 'pic', label: 'Picture (with the answer)', type: 'pic' },
        { k: 'unit', label: 'Unit (tag)', type: 'text', max: 50 }, { type: 'head', label: 'Clues, hardest first' }].concat(clueFields);
    },
    blank: function () { return { word: 'teacher', unit: '', pic: 'teacher', c1: "It's a job.", c2: 'This person works with children.', c3: 'This person works in a school.', c4: '', c5: '' }; }
  });

  function cluesOf(c) {
    var o = []; if (!c) return o;
    for (var k = 1; k <= MAXC; k++) { var s = String(c['c' + k] || '').trim(); if (s) o.push({ k: 'c' + k, text: s }); }
    return o;
  }
  WU.engines = WU.engines || {};
  WU.engines.clues = { cluesOf: cluesOf };

  var sh, box, st, offContent = null, deck = kit.deck();
  function S() { return scr.get(); }
  function pool() { return WU.list('clues', 'cards', WU.state.level).filter(function (c) { return c.word && cluesOf(c).length >= 2; }); }
  function card() { return WU.list('clues', 'cards', WU.state.level).filter(function (c) { return c.id === st.id; })[0] || null; }
  function points() { var n = cluesOf(card()).length; return Math.max(1, n - st.k + 1); }
  function newCard() { var c = deck(pool()); st.id = c ? c.id : null; st.k = 1; st.phase = 'clue'; st.won = null; st.team = null; st.wrong = 0; }

  function render() {
    var s = S(), c = card(), ph = st.phase, h = '';
    var cs = cluesOf(c), n = cs.length;
    h += '<div class="ghead">' + kit.chip(s.tag, scr.ea('tag'), '#ffe600') +
      (c && s.unitShow && c.unit && !(st.demo && s.demo) ? '<div class="gpill alt cbunit"' + WU.editAttr('clues', 'cards', c.id, 'unit') + '>' + WU.esc(c.unit) + '</div>' : '') +
      (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (!c) { h += '<div class="cbempty" data-ctrl>No cards for this level yet. Press E to add some.</div>'; box.querySelector('.layer').innerHTML = h; renderHints(); return; }
    // The points meter: one block per clue, the blocks still to win are lit.
    var pts = ph === 'clue' ? points() : (st.won || 0);
    h += '<div class="cbmeter"><div class="cbpts" data-auto>' + pts + '</div><div class="cbpl"' + scr.ea('pts') + '>' + WU.esc(s.pts) + '</div><div class="cbblocks" data-auto>';
    for (var j = n; j >= 1; j--) h += '<i class="' + (j <= pts && (ph === 'clue' || st.won) ? 'on' : '') + '"></i>';
    h += '</div></div>';
    var rowH = Math.min(124, Math.floor(640 / Math.max(n, 3)));
    h += '<div class="cblist" style="--rh:' + rowH + 'px">';
    cs.forEach(function (cl, ix) {
      var shown = ph !== 'clue' || ix < st.k;
      h += '<div class="cbrow' + (shown ? ' on' : '') + (ph === 'clue' && ix === st.k - 1 ? ' last' : '') + '"><span class="cbnum" data-auto>' + (ix + 1) + '</span>' +
        (shown ? '<span class="cbtext"' + WU.editAttr('clues', 'cards', c.id, cl.k) + '>' + WU.esc(cl.text) + '</span>' : '<span class="cbhide" data-auto>?</span>') + '</div>';
    });
    h += '</div><div class="cbcard' + (ph === 'reveal' ? ' open' : '') + '">';
    if (ph === 'clue') h += '<div class="cbq" data-auto>?</div>' + (st.wrong ? '<div class="cbx" data-auto>' + new Array(Math.min(st.wrong, 5) + 1).join('✗') + '</div>' : '');
    else {
      if (s.pics && c.pic && WU.PICS[c.pic]) h += '<div class="cbpic"' + WU.editAttr('clues', 'cards', c.id, 'pic') + '>' + WU.pic(c.pic) + '</div>';
      h += '<div class="cbword"' + WU.editAttr('clues', 'cards', c.id, 'word') + '>' + WU.esc(c.word) + '</div>';
      if (st.won) h += '<div class="cbstamp"' + scr.ea('got') + '>' + WU.esc(s.got) + ' <b data-auto>+' + st.won + (st.team != null ? ' ' + WU.esc(WU.state.teamNames[st.team] || 'TEAM ' + (st.team + 1)) : '') + '</b></div>';
      else h += '<div class="cbstamp no"' + scr.ea('nobody') + '>' + WU.esc(s.nobody) + '</div>';
    }
    h += '</div><div class="cbbottom">';
    if (ph === 'clue') h += '<div class="cbbig"' + scr.ea('task') + '>' + WU.esc(s.task) + '</div>';
    else if (s.writeShow && s.write) h += '<div class="cbbig"' + scr.ea('write') + '>' + WU.esc(s.write) + '</div>';
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    box.querySelectorAll('.cbtext').forEach(function (el) { kit.fit(el, Math.min(50, rowH - 40), 22); });
    kit.fit(box.querySelector('.cbword'), s.pics && c.pic ? 84 : 110, 36);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], hs, n = cluesOf(card()).length;
    if (st.phase === 'clue') hs = [['SPACE', st.k >= n ? 'show the answer' : 'next clue'], ['ENTER', 'guessed!'], ['X', 'wrong guess'], ['N', 'other word'], ['Esc', 'home']];
    else hs = [['SPACE', 'next word'], ['N', 'other word'], ['Esc', 'home']];
    if (WU.state.teams && st.phase === 'clue') hs.splice(2, 0, ['1-4', 'team guessed']);
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function nextClue() {
    var n = cluesOf(card()).length;
    if (st.k < n) { st.k++; WU.sound.pop(); render(); }
    else reveal(null, null);
  }
  function reveal(pts, team) {
    st.phase = 'reveal'; st.won = pts; st.team = team;
    if (team != null && pts && sh.sb) sh.sb.add(team, pts);
    if (pts) WU.sound.ding(); else WU.sound.slam();
    render();
  }
  function next() { st.demo = false; newCard(); WU.sound.pop(); render(); }
  function keyAction(k) {
    if (k === 'SPACE') { st.moved = true; if (st.phase === 'clue') nextClue(); else next(); }
    else if (k === 'ENTER') { st.moved = true; if (st.phase === 'clue') reveal(points(), null); else next(); }
    else if (k === 'X') { if (st.phase === 'clue') { st.wrong++; WU.sound.buzzer(); if (st.k < cluesOf(card()).length) { st.k++; } render(); } }
    else if (k === 'N') { st.moved = true; next(); }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!S().demoShow;
    var c = card();
    if (!c || cluesOf(c).length < 2) { newCard(); }
    else st.k = Math.min(st.k, cluesOf(c).length);
    render();
  }

  WU.views.clues = {
    title: 'Clue by Clue',
    teacher: function () {
      if (!st) return null;
      var c = card(), sec = [], info = [];
      if (c) {
        sec.push({ label: 'The answer', text: c.word, huge: true });
        sec.push({ label: 'All the clues', html: cluesOf(c).map(function (cl, ix) { return '<b>' + (ix + 1) + '</b> ' + WU.esc(cl.text); }).join('<br>') });
      }
      info.push({ label: 'Clues shown', text: (st.phase === 'clue' ? st.k : cluesOf(c).length) + ' / ' + cluesOf(c).length });
      if (st.phase === 'clue') info.push({ label: 'Points now', text: String(points()) });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'next clue / show the answer / next word'], ['Enter', 'guessed! (the points shown)'], ['1 - 4', 'with teams: that team guessed (gets the points)'], ['Shift + 1 - 4', 'take a point back'], ['X', 'wrong guess: the next clue appears'], ['N', 'other word'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'cbg', 'Clue by Clue', 'clues-sb'); box = sh.box;
      st = { phase: 'clue', id: null, k: 1, won: null, team: null, wrong: 0, demo: !!S().demoShow, moved: false };
      newCard(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      // With teams, 1-4 while the clues come = that team guessed (it gets the points). Shift + 1-4 takes a point back.
      var m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
      if (m && sh.sb && st.phase === 'clue' && !e.shiftKey && +m[1] <= WU.state.teams) { st.moved = true; reveal(points(), +m[1] - 1); return true; }
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { x: 'X', n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
