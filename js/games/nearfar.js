/* Warm Up: NEAR & FAR (grammar game G3, Beginner to Pre-Intermediate). Trains: this / that / these / those.
   A picture road: things appear near the hand (this / these) or far away on the road (that / those), one or more.
   The screen picks a student, who says the sentence. Space reveals it. Pre-Intermediate: two things at once
   ("These are cats and that is a dog.").
   Keys: Space reveal / next, N other things, P other student, 1-4 team points.
   Content: content/nearfar.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'nearfar', title: 'Near & Far', content: function () { return WU.content.nearfarScreen; },
    fields: [
      { type: 'head', label: 'The road' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'nearTag', label: 'Label near the hand', type: 'text', max: 16 }, { k: 'farTag', label: 'Label far away', type: 'text', max: 16 },
      { k: 'zoneShow', label: 'The two labels', type: 'bool' },
      { k: 'manyChance', label: 'How often more than one (%)', type: 'num', min: 0, max: 100 },
      { k: 'pairs', label: 'Two things at once (near + far)', type: 'bool', on: 'On', off: 'Off' },
      { k: 'seconds', label: 'Time bar (seconds, 0 = none)', type: 'num', min: 0, max: 30 },
      { type: 'head', label: 'Sentences (___ = a cat / cats)' },
      { k: 'one', label: 'Near, one', type: 'text', max: 30 }, { k: 'many', label: 'Near, more', type: 'text', max: 30 },
      { k: 'oneFar', label: 'Far, one', type: 'text', max: 30 }, { k: 'manyFar', label: 'Far, more', type: 'text', max: 30 },
      { k: 'join', label: 'Word between two sentences', type: 'text', max: 10 },
      { k: 'who', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('nearfar', 'things', {
    gameTitle: 'Near & Far', label: 'Things',
    defaults: function (l) { return WU.content.nearfar[l].things; },
    norm: function (r) { var o = kit.normWord(r); return { pic: o.pic, word: o.text, art: o.art, pl: o.pl }; },
    title: function (it) { return it.word || WU.picName(it.pic) || '(empty)'; },
    fields: function () {
      return [
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'word', label: 'Word (empty = the picture name)', type: 'text', max: 30 },
        { k: 'art', label: 'a / an', type: 'select', options: kit.ARTICLES },
        { k: 'pl', label: 'Plural (empty = add -s)', type: 'text', max: 30 }
      ];
    },
    blank: function () { return { pic: '', word: '', pl: '' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar();
  var deck = kit.deck();

  function things() { return WU.list('nearfar', 'things', WU.state.level).filter(function (x) { return x.pic || x.word; }); }
  function find(id) { return things().filter(function (x) { return x.id === id; })[0] || null; }
  function ex(it) { return { w: it.word || WU.picName(it.pic), art: it.art, pl: it.pl }; }
  // Things with no a / an (rice, water) are never "more than one".
  function canMany(it) { return !!it.art && it.art !== 'the'; }
  function ek(it, f) { return ' data-edit="nearfar:things:' + it.id + ':' + f + '"'; }

  function slot(near) {
    var S = scr.get(), it = deck(things()); if (!it) return null;
    return { id: it.id, near: near, many: canMany(it) && WU.rand(100) < (+S.manyChance || 0), n: 2 + WU.rand(2) };
  }
  function newRound() {
    var S = scr.get();
    if (S.pairs) { st.slots = [slot(true), slot(false)].filter(Boolean); if (st.slots.length === 2 && st.slots[0].id === st.slots[1].id) st.slots[1] = slot(false); }
    else { var s = slot(Math.random() < 0.5); st.slots = s ? [s] : []; }
  }
  // [demonstrative, rest] for one slot, e.g. ["These", "are cats."]
  function parts(s) {
    var S = scr.get(), it = find(s.id); if (!it) return ['', ''];
    var f = s.near ? (s.many ? S.many : S.one) : (s.many ? S.manyFar : S.oneFar);
    var t = String(f || '').replace('___', WU.phrase(ex(it), s.many ? 'pl' : 'a')), m = /^(\S+)\s*(.*)$/.exec(t);
    return m ? [m[1], m[2]] : [t, ''];
  }
  function sentenceHTML(plain) {
    var S = scr.get(), out = st.slots.map(function (s, i) {
      var p = parts(s), first = p[0], rest = p[1];
      if (i > 0) first = first.charAt(0).toLowerCase() + first.slice(1);
      if (i < st.slots.length - 1) rest = rest.replace(/[.!]$/, '');
      return plain ? first + ' ' + rest : '<em>' + WU.esc(first) + '</em> ' + WU.esc(rest);
    });
    return out.join(' ' + (plain ? (S.join || 'and') : WU.esc(S.join || 'and')) + ' ');
  }

  var SKIN = '#f5c9a0', K = '#0d0d0d';
  function hand() {
    return '<svg viewBox="0 0 140 80"><rect x="-20" y="18" width="40" height="54" fill="#3d6bff" stroke="' + K + '" stroke-width="5"></rect>' +
      '<rect x="14" y="20" width="58" height="50" rx="16" fill="' + SKIN + '" stroke="' + K + '" stroke-width="5"></rect>' +
      '<rect x="56" y="22" width="78" height="18" rx="9" fill="' + SKIN + '" stroke="' + K + '" stroke-width="5"></rect>' +
      '<rect x="34" y="6" width="34" height="18" rx="9" fill="' + SKIN + '" stroke="' + K + '" stroke-width="5"></rect>' +
      '<path d="M44 48 h22 M44 60 h20" stroke="' + K + '" stroke-width="4" stroke-linecap="round"></path></svg>';
  }
  function zone(s) {
    var it = find(s.id); if (!it) return '';
    var n = s.many ? s.n : 1, h = '';
    for (var i = 0; i < n; i++) h += '<div class="nfp"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>';
    return '<div class="nfitems ' + (s.near ? 'near' : 'far') + (n > 1 ? ' many' : '') + '">' + h + '</div>';
  }

  function render() {
    var S = scr.get(), ph = st.phase, h = '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (+S.seconds > 0) h += bar.html();
    var near = st.slots.filter(function (s) { return s.near; })[0], far = st.slots.filter(function (s) { return !s.near; })[0];
    h += '<div class="nfscene"><div class="nffloor"></div><div class="nfhz"></div>' +
      (S.zoneShow && S.farTag ? '<div class="nftag far"' + scr.ea('farTag') + '>' + WU.esc(S.farTag) + '</div>' : '') +
      (S.zoneShow && S.nearTag ? '<div class="nftag near"' + scr.ea('nearTag') + '>' + WU.esc(S.nearTag) + '</div>' : '') +
      (far ? zone(far) + '<div class="nfhand far">' + hand() + '</div>' : '') +
      (near ? zone(near) + '<div class="nfhand near">' + hand() + '</div>' : '') + '</div>';
    h += '<div class="nfbottom">';
    if (ph === 'reveal') h += gram.answer('', '', sentenceHTML(false), ' data-auto');
    else {
      h += '<div class="brow">' + gram.who(S.who, scr.ea('who'), st.who) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    var a = box.querySelector('.gans-t'); if (a) kit.fit(a, 64, 36);
    bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = st.phase === 'ask' ? [['SPACE', 'reveal'], ['N', 'other things'], ['P', 'other student'], ['Esc', 'home']]
      : [['SPACE', 'next'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function ask() {
    var S = scr.get(); st.phase = 'ask'; st.who = kit.student(st.who ? [st.who] : null); render();
    bar.start(box, Math.max(0, Math.min(30, +S.seconds || 0)), function () { if (st && st.phase === 'ask') render(); });
  }
  function reveal() { bar.stop(); st.phase = 'reveal'; WU.sound.ding(); render(); }
  function next() { st.demo = false; newRound(); WU.sound.pop(); ask(); }
  function refresh() {
    if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow;
    if (!st.slots.length || st.slots.some(function (s) { return !find(s.id); }) || !!scr.get().pairs !== (st.slots.length === 2)) newRound();
    render();
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ask') reveal(); else next(); }
    else if (k === 'N') { if (ph === 'ask') { st.moved = true; st.demo = false; newRound(); WU.sound.clack(); ask(); } }
    else if (k === 'P') { if (ph === 'ask') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.nearfar = {
    title: 'Near & Far',
    teacher: function () {
      if (!st || !st.slots.length) return null;
      return { secret: [{ label: 'Answer', text: sentenceHTML(true), big: true }], info: [{ label: 'Student', text: st.who || '' }] };
    },
    help: function () { return [['Space', 'reveal / next'], ['N', 'other things'], ['P', 'other student'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'nfg', 'Near & Far', 'nearfar-sb'); box = sh.box;
      st = { phase: 'ask', slots: [], demo: !!scr.get().demoShow, who: null };
      newRound(); ask();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
