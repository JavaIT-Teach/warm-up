/* Warm Up: DOMINO EFFECT (grammar game G7, Pre-Intermediate and up). Trains: conditionals.
   A starter: "If it rains tomorrow, ..." The picked student finishes it ("..., I will stay at home.").
   The next student turns that result into a new If-clause ("If I stay at home, I will watch TV."), and so on.
   Every good sentence (Space) stands up one more domino. A wrong form or a stop (X) knocks the whole line down.
   Pre-Intermediate 1st conditional, Intermediate 2nd, IELTS 1 3rd, IELTS 2 mixed, IELTS 3 inversion.
   The example chain stays on the card; H shows a model ending for the current starter.
   Keys: Space good sentence / new chain, X chain broken, H example ending, N other starter, P other student, 1-4 team points.
   Content: content/domino.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'domino', title: 'Domino Effect', content: function () { return WU.content.dominoScreen; },
    fields: [
      { type: 'head', label: 'The chain' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'type', label: 'Grammar name (e.g. 2nd CONDITIONAL)', type: 'text', max: 30 },
      { k: 'frame', label: 'The pattern (every starter at this level)', type: 'text', max: 110 },
      { k: 'example', label: 'Example chain (always on the card)', type: 'text', max: 160 }, { k: 'exampleShow', label: 'Example chain', type: 'bool' },
      { k: 'exampleLabel', label: 'Label in front of the example', type: 'text', max: 14 },
      { k: 'modelLabel', label: 'Label in front of a model ending (H key)', type: 'text', max: 16 },
      { k: 'modelShow', label: 'Model endings (H key)', type: 'bool', on: 'On', off: 'Off' },
      { k: 'first', label: 'First student ({name})', type: 'text', max: 50 },
      { k: 'next', label: 'Next students ({name})', type: 'text', max: 60 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'seconds', label: 'Time bar for each student (seconds, 0 = none)', type: 'num', min: 0, max: 60 },
      { type: 'head', label: 'Score' },
      { k: 'count', label: 'Chain length ({n})', type: 'text', max: 20 }, { k: 'record', label: 'Record ({n})', type: 'text', max: 20 },
      { k: 'broken', label: 'Chain broken (X)', type: 'text', max: 24 },
      { k: 'demo', label: 'Teacher demo banner (first chain only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('domino', 'starters', {
    gameTitle: 'Domino Effect', label: 'Starters',
    defaults: function (l) { return WU.content.domino[l].starters; },
    norm: function (r) { return { text: r.text || '', frame: r.frame || '', model: r.model || '' }; },
    fields: function () {
      return [{ k: 'text', label: 'First If-clause', type: 'text', max: 90 },
        { k: 'frame', label: 'Its own pattern', type: 'text', max: 110, ph: function (it, l) { return 'Level pattern: ' + scr.get(l).frame; }, hint: "Empty = the level's pattern." },
        { k: 'model', label: 'Model ending (H key shows it)', type: 'text', max: 100 }];
    },
    blank: function () { return { text: 'If ___,', frame: '', model: '' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar(), deck = kit.deck(), fallT = null;

  function starter() { return WU.list('domino', 'starters', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newStarter() { var it = deck(WU.list('domino', 'starters', WU.state.level).filter(function (x) { return x.text; })); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="domino:starters:' + it.id + ':' + f + '"'; }
  function recKey() { return 'domino-record-' + WU.state.level; }

  function render() {
    var S = scr.get(), it = starter(), ph = st.phase, h = '', rec = WU.store.get(recKey(), 0), n = st.chain.length;
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#c6ff00') + (S.type ? '<div class="gpill"' + scr.ea('type') + '>' + WU.esc(S.type) + '</div>' : '') +
      (S.record ? '<div class="gpill alt"' + scr.ea('record') + '>' + WU.esc(kit.fill(S.record, { n: rec })) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (+S.seconds > 0) h += bar.html();
    h += '<div class="dmcard"><div class="dmstart"' + (it ? ek(it, 'text') : '') + '>' + (it ? WU.esc(it.text) : '') + ' <span class="dmdots" data-ctrl>...</span></div>' +
      (it && it.frame ? kit.frame(it.frame, ek(it, 'frame'), 'dmframe') : S.frame ? kit.frame(S.frame, scr.ea('frame'), 'dmframe') : '') +
      (st.model && it && it.model && S.modelShow ? '<div class="dmmodel">' + (S.modelLabel ? '<b' + scr.ea('modelLabel') + '>' + WU.esc(S.modelLabel) + '</b>' : '') +
        '<span' + ek(it, 'text') + '>' + WU.esc(it.text.replace(/\s*\([^)]*\)\s*$/, '')) + '</span> <em' + ek(it, 'model') + '>' + WU.esc(it.model) + '</em></div>'
      : S.exampleShow && S.example ? '<div class="dmex">' + (S.exampleLabel ? '<b' + scr.ea('exampleLabel') + '>' + WU.esc(S.exampleLabel) + '</b>' : '') + '<span' + scr.ea('example') + '>' + WU.esc(S.example) + '</span></div>' : '') + '</div>';
    // The domino line: one domino for every good sentence, then they fall when the chain breaks.
    var size = n > 14 ? Math.max(46, Math.floor(1700 / n) - 14) : 104;
    h += '<div class="dmline' + (ph === 'broken' ? ' fall' : '') + '">' + st.chain.map(function (name, i) {
      return '<div class="dmd' + (i === n - 1 && ph === 'play' && st.added ? ' new' : '') + '" style="width:' + size + 'px;transition-delay:' + (i * 0.09) + 's"><div class="dmn" data-auto>' + (i + 1) + '</div><div class="dmname" data-auto>' + WU.esc(name) + '</div></div>';
    }).join('') + (ph === 'play' ? '<div class="dmd ghost" style="width:' + size + 'px"></div>' : '') + '</div>';
    if (S.count) h += '<div class="dmcount' + (ph === 'broken' ? ' bad' : '') + '"' + scr.ea('count') + '>' + WU.esc(kit.fill(S.count, { n: n })) + '</div>';
    h += '<div class="dmbottom">';
    if (ph === 'broken') h += '<div class="dmbroken"' + scr.ea('broken') + '>' + WU.esc(S.broken) + '</div>';
    else {
      h += '<div class="brow">' + (n ? gram.who(S.next, scr.ea('next'), st.who) : gram.who(S.first, scr.ea('first'), st.who)) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.dmstart'), 84, 44);
    var fr = box.querySelector('.dmframe'); if (fr) kit.fit(fr, 40, 22);
    bar.redraw(box);
    if (ph === 'broken') requestAnimationFrame(function () { var l = box && box.querySelector('.dmline'); if (l) l.classList.add('down'); });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [];
    var hm = scr.get().modelShow && starter() && starter().model ? [['H', st.model ? 'hide example' : 'example ending']] : [];
    var hs = st.phase === 'play' ? [['SPACE', 'good sentence'], ['X', 'chain broken']].concat(hm, [['P', 'other student']]).concat(st.chain.length ? [] : [['N', 'other starter']], [['Esc', 'home']])
      : [['SPACE', 'new chain'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function startBar() { var S = scr.get(); bar.start(box, Math.max(0, Math.min(60, +S.seconds || 0)), function () { if (st && st.phase === 'play') render(); }); }
  function good() {
    st.chain.push(st.who); st.added = true; WU.sound.clack();
    if (st.chain.length > WU.store.get(recKey(), 0)) WU.store.set(recKey(), st.chain.length);
    st.demo = false; st.who = kit.student([st.who]); render(); startBar();
  }
  function broken() { bar.stop(); st.phase = 'broken'; WU.sound.boom(); render(); }
  function newChain() { bar.stop(); st.demo = false; st.model = false; newStarter(); st.chain = []; st.added = false; st.phase = 'play'; st.who = kit.student(st.who ? [st.who] : null); WU.sound.pop(); render(); startBar(); }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!starter()) newStarter(); render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'play') good(); else newChain(); }
    else if (k === 'X') { if (ph === 'play') broken(); }
    else if (k === 'H') { st.model = !st.model; WU.sound.clack(); render(); }
    else if (k === 'N') { if (ph === 'play' && !st.chain.length) { st.moved = true; st.demo = false; st.model = false; newStarter(); WU.sound.clack(); render(); } }
    else if (k === 'P') { if (ph === 'play') { st.who = kit.student([st.who]); st.added = false; WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.domino = {
    title: 'Domino Effect',
    teacher: function () {
      if (!st) return null;
      var it = starter(), S = scr.get(), info = [];
      if (it) info.push({ label: 'Starter', text: it.text });
      info.push({ label: 'Pattern', text: (it && it.frame) || S.frame });
      if (it && it.model) info.push({ label: 'Example ending (H)', text: it.text.replace(/\s*\([^)]*\)\s*$/, '') + ' ' + it.model });
      info.push({ label: 'Chain', text: st.chain.length + (st.chain.length ? ' (' + st.chain.join(', ') + ')' : '') });
      info.push({ label: 'Now', text: st.who || '' });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'good sentence: one more domino / new chain'], ['X', 'chain broken: the dominoes fall'], ['H', 'show / hide an example ending for this starter'], ['N', 'other starter (before the first sentence)'], ['P', 'other student'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'dmg', 'Domino Effect', 'domino-sb'); box = sh.box;
      st = { phase: 'play', id: null, chain: [], demo: !!scr.get().demoShow, who: kit.student(), added: false };
      newStarter(); render(); startBar();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); clearTimeout(fallT); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { x: 'X', h: 'H', n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
