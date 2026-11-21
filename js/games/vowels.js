/* Warm Up: LOST VOWELS (writing). Words from the taught units lose their vowels: "_nt_rt__nm_nt".
   Space: the words appear (numbered) and a time bar runs; everyone writes the whole words on paper.
   Space (or time up): the vowels drop back in, one word per Space, and students check their spelling (1 point per perfect word).
   Keys: Space next step, H clues on / off, A show every word, N new words, 1-4 team points, S scores.
   Content: content/vowels.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'vowels', title: 'Lost Vowels', content: function () { return WU.content.vowelsScreen; },
    fields: [
      { type: 'head', label: 'Round' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 30 },
      { k: 'ready', label: 'Start screen', type: 'text', max: 70 },
      { k: 'vowels', label: 'The vowels (start screen)', type: 'text', max: 30 },
      { k: 'sample', label: 'Example (start screen, empty = hide)', type: 'text', max: 50 },
      { k: 'perRound', label: 'Words per round (3-8)', type: 'num', min: 3, max: 8 },
      { k: 'clues', label: 'Clues under the words', type: 'bool', on: 'On', off: 'Off' },
      { k: 'pics', label: 'Pictures on the cards', type: 'bool', on: 'On', off: 'Off' },
      { type: 'head', label: 'Writing' },
      { k: 'rule', label: 'Writing line', type: 'text', max: 80 },
      { k: 'writeSec', label: 'Writing time (seconds, 0 = no bar)', type: 'num', min: 0, max: 300 },
      { type: 'head', label: 'Check' },
      { k: 'check', label: 'Check line', type: 'text', max: 60 },
      { k: 'point', label: 'Points line', type: 'text', max: 80 },
      { k: 'count', label: 'When every word is back', type: 'text', max: 50 },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('vowels', 'words', {
    gameTitle: 'Lost Vowels', label: 'Words',
    defaults: function (l) { return WU.content.vowels[l].words; },
    norm: function (r) { return { word: r.word || '', clue: r.clue || '', pic: r.pic || '', unit: r.unit || '' }; },
    fields: function () {
      return [
        { k: 'word', label: 'Word or short phrase', type: 'text', max: 24 },
        { k: 'clue', label: 'Clue (empty = none)', type: 'text', max: 60 },
        { k: 'pic', label: 'Picture (shown when pictures are on)', type: 'pic' },
        { k: 'unit', label: 'Unit (teacher screen)', type: 'text', max: 50 }
      ];
    },
    blank: function () { return { word: 'breakfast', clue: 'You have it in the morning.', pic: 'egg', unit: '' }; }
  });

  var VOW = /[aeiou]/i;
  var sh, box, st, offContent = null;
  var deck = kit.deck(), bar = gram.bar();

  function S() { return scr.get(); }
  function hasVowel(w) { return VOW.test(w) && /[^aeiou\s]/i.test(w); }
  function pool() { return WU.list('vowels', 'words', WU.state.level).filter(function (x) { return x.word && hasVowel(x.word); }); }
  function per() { return Math.max(3, Math.min(8, Math.round(+S().perRound || 6))); }
  function cur() {
    var all = WU.list('vowels', 'words', WU.state.level);
    return st.ids.map(function (id) { return all.filter(function (x) { return x.id === id; })[0]; }).filter(function (x) { return x && x.word && hasVowel(x.word); });
  }
  function newRound() {
    st.ids = kit.drawN(deck, pool(), per()).map(function (x) { return x.id; });
    st.shown = 0; st.phase = 'ready';
  }
  // "Wednesday" -> W_dn_sd_y. back = the vowels are back (pink).
  // Each word stays on one line (the gaps never split it).
  function skeleton(w, back) {
    return String(w).split(/\s+/).filter(Boolean).map(function (part) {
      return '<span class="lvw">' + part.split('').map(function (c) {
        if (VOW.test(c)) return back ? '<span class="lvv">' + WU.esc(c) + '</span>' : '<span class="lvgap"></span>';
        return WU.esc(c);
      }).join('') + '</span>';
    }).join(' ');
  }

  function render() {
    var s = S(), ph = st.phase, ws = cur(), h = '';
    h += '<div class="ghead">' + kit.chip(s.tag, scr.ea('tag'), '#00e5c7') +
      (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (ph === 'write') h += bar.html();
    if (!ws.length) { h += '<div class="lvempty" data-ctrl>No words for this level yet. Press E to add some.</div>'; box.querySelector('.layer').innerHTML = h; renderHints(); return; }
    if (ph === 'ready') {
      h += '<div class="lvready"><div class="lvbig"' + scr.ea('ready') + '>' + WU.esc(s.ready) + '</div>' +
        (s.vowels ? '<div class="lvvow"' + scr.ea('vowels') + '>' + WU.esc(s.vowels) + '</div>' : '') +
        (s.sample ? '<div class="lvsample"' + scr.ea('sample') + '>' + WU.esc(s.sample) + '</div>' : '') + '</div>';
    } else {
      var cols = ws.length > 6 ? 4 : 3, pics = !!s.pics, clues = !!s.clues && !st.noClue;
      h += '<div class="lvgrid c' + cols + '">';
      ws.forEach(function (w, i) {
        var back = ph === 'check' && i < st.shown || ph === 'done';
        h += '<div class="lvcard' + (back ? ' back' : '') + (ph === 'check' && i === st.shown - 1 ? ' last' : '') + '">' +
          '<span class="lvn" data-auto>' + (i + 1) + '</span>' +
          (pics && w.pic ? '<div class="lvpic"' + WU.editAttr('vowels', 'words', w.id, 'pic') + '>' + WU.pic(w.pic) + '</div>' : '') +
          '<div class="lvbody"><div class="lvword"' + WU.editAttr('vowels', 'words', w.id, 'word') + '>' + skeleton(w.word, back) + '</div>' +
          (clues && w.clue ? '<div class="lvclue"' + WU.editAttr('vowels', 'words', w.id, 'clue') + '>' + WU.esc(w.clue) + '</div>' : '') + '</div></div>';
      });
      h += '</div><div class="lvbottom">';
      if (ph === 'write') h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(s.rule) + '</div>';
      else if (ph === 'check') h += '<div class="lvbig"' + scr.ea('check') + '>' + WU.esc(s.check) + '</div><div class="rule"' + scr.ea('point') + '>' + WU.esc(s.point) + '</div>';
      else h += '<div class="lvbig"' + scr.ea('count') + '>' + WU.esc(s.count) + '</div>';
      h += '</div>';
    }
    box.querySelector('.layer').innerHTML = h;
    var big = ws.length > 6 ? 58 : 72;
    box.querySelectorAll('.lvword').forEach(function (el) { kit.fit(el, big, 26); });
    box.querySelectorAll('.lvclue').forEach(function (el) { kit.fit(el, 30, 18); });
    if (ph === 'write') bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, hs, n = cur().length;
    if (ph === 'ready') hs = [['SPACE', 'go!'], ['N', 'new words'], ['Esc', 'home']];
    else if (ph === 'write') hs = [['SPACE', 'stop: check'], ['H', 'clues ' + (st.noClue ? 'on' : 'off')], ['N', 'new words'], ['Esc', 'home']];
    else if (ph === 'check') hs = [['SPACE', st.shown >= n - 1 ? 'last word' : 'next word'], ['A', 'every word'], ['H', 'clues ' + (st.noClue ? 'on' : 'off')], ['Esc', 'home']];
    else hs = [['SPACE', 'new round'], ['N', 'new words'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function write() {
    st.phase = 'write'; WU.sound.slam(); render();
    var sec = Math.max(0, Math.min(300, +S().writeSec || 0));
    if (sec) bar.start(box, sec, function () { if (st && st.phase === 'write') { st.phase = 'check'; st.shown = 0; render(); } });
  }
  function step() {
    var n = cur().length;
    if (st.phase === 'ready') { if (n) write(); return; }
    if (st.phase === 'write') { bar.stop(); st.phase = 'check'; st.shown = 0; WU.sound.ding(); render(); return; }
    if (st.phase === 'check') {
      st.shown = Math.min(n, st.shown + 1); WU.sound.pop();
      if (st.shown >= n) st.phase = 'done';
      render(); return;
    }
    next();
  }
  function next() { bar.stop(); st.demo = false; newRound(); WU.sound.pop(); render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; step(); }
    else if (k === 'A') { if (ph === 'check' || ph === 'write') { bar.stop(); st.phase = 'done'; st.shown = cur().length; WU.sound.ding(); render(); } }
    else if (k === 'H') { if (ph === 'write' || ph === 'check') { st.noClue = !st.noClue; WU.sound.clack(); render(); } }
    else if (k === 'N') { st.moved = true; next(); }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!S().demoShow;
    if (!cur().length) { bar.stop(); newRound(); }
    render();
  }

  WU.views.vowels = {
    title: 'Lost Vowels',
    teacher: function () {
      if (!st) return null;
      var ws = cur(), sec = [], info = [];
      if (ws.length) sec.push({ label: 'The words', html: ws.map(function (w, i) { return '<b>' + (i + 1) + '</b> ' + WU.esc(w.word) + (w.unit ? ' <small>(' + WU.esc(w.unit) + ')</small>' : ''); }).join('<br>') });
      if (st.phase === 'check') info.push({ label: 'Words back', text: st.shown + ' / ' + ws.length });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'go / stop: check / vowels back, one word at a time / new round'], ['H', 'clues on / off'], ['A', 'show every word'], ['N', 'new words'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'lvg', 'Lost Vowels', 'vowels-sb'); box = sh.box;
      st = { phase: 'ready', ids: [], shown: 0, demo: !!S().demoShow, moved: false, noClue: false };
      newRound(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { a: 'A', h: 'H', n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
