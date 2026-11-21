/* Warm Up: STORY SHUFFLE (reading). A short text from the taught units, cut into lines and shuffled (A, B, C...).
   Pairs read the lines and write the right order on paper (time bar). Space: the lines move into place one by one
   (line 1, line 2...), so everyone checks their order. Then the order in letters and a question about the text for a picked student.
   Keys: Space next step, A show the whole order, N other text, P other student, 1-4 team points, S scores.
   Content: content/shuffle.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;
  var MAXL = 6, LET = 'ABCDEF';

  var scr = kit.screen({
    game: 'shuffle', title: 'Story Shuffle', content: function () { return WU.content.shuffleScreen; },
    fields: [
      { type: 'head', label: 'Text' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 30 },
      { k: 'unitShow', label: 'Unit tag', type: 'bool' },
      { type: 'head', label: 'Reading' },
      { k: 'read', label: 'Reading task', type: 'text', max: 70 },
      { k: 'example', label: 'Example under the task (empty = hide)', type: 'text', max: 40 },
      { k: 'readSec', label: 'Reading time (seconds, 0 = no bar)', type: 'num', min: 0, max: 300 },
      { type: 'head', label: 'Check' },
      { k: 'order', label: 'Check line', type: 'text', max: 50 },
      { k: 'step', label: 'While the lines move ({n} = line number)', type: 'text', max: 40 },
      { k: 'done', label: 'When every line is in place', type: 'text', max: 60 },
      { k: 'qLabel', label: 'Question label', type: 'text', max: 20 },
      { k: 'ask', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'demo', label: 'Teacher demo banner (first text only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  var lineFields = [];
  for (var i = 1; i <= MAXL; i++) lineFields.push({ k: 'l' + i, label: 'Line ' + i + (i > 3 ? ' (empty = not used)' : ''), type: 'text', max: 110 });
  WU.registerList('shuffle', 'texts', {
    gameTitle: 'Story Shuffle', label: 'Texts',
    defaults: function (l) { return WU.content.shuffle[l].texts; },
    norm: function (r) {
      var o = { title: r.title || '', unit: r.unit || '', q: r.q || '', a: r.a || '' };
      for (var k = 1; k <= MAXL; k++) o['l' + k] = r['l' + k] || '';
      return o;
    },
    fields: function () {
      return [{ k: 'title', label: 'Title', type: 'text', max: 50 }, { k: 'unit', label: 'Unit (tag)', type: 'text', max: 50 },
        { type: 'head', label: 'Lines in the RIGHT order (the game shuffles them)' }].concat(lineFields).concat([
        { type: 'head', label: 'After the check' },
        { k: 'q', label: 'Question about the text (empty = none)', type: 'text', max: 90 },
        { k: 'a', label: 'Answer (teacher screen only)', type: 'text', max: 90 }]);
    },
    blank: function () { return { title: 'My day', unit: '', l1: 'I get up at seven.', l2: 'Then I have breakfast.', l3: 'After that, I go to school.', l4: '', l5: '', l6: '', q: '', a: '' }; }
  });

  var sh, box, st, offContent = null;
  var deck = kit.deck(), bar = gram.bar();

  function S() { return scr.get(); }
  // The used lines of a text: [{ k: 'l1', text, i: right place }].
  function linesOf(t) {
    var o = []; if (!t) return o;
    for (var k = 1; k <= MAXL; k++) { var s = String(t['l' + k] || '').trim(); if (s) o.push({ k: 'l' + k, text: s, i: o.length }); }
    return o;
  }
  function pool() { return WU.list('shuffle', 'texts', WU.state.level).filter(function (t) { return linesOf(t).length >= 3; }); }
  function text() { return WU.list('shuffle', 'texts', WU.state.level).filter(function (t) { return t.id === st.id; })[0] || null; }
  function sig(t) { return linesOf(t).map(function (l) { return l.text; }).join('|'); }
  // A shuffle that is never the right order (and never starts with line 1, when there are 4 lines or more).
  function mix(n) {
    var p, tries = 0, base = []; for (var j = 0; j < n; j++) base.push(j);
    do { p = WU.shuffle(base.slice()); tries++; } while (tries < 40 && (p.join() === base.join() || (n >= 4 && p[0] === 0)));
    return p;
  }
  function newText() {
    var t = deck(pool());
    st.id = t ? t.id : null; st.sig = t ? sig(t) : '';
    st.perm = mix(linesOf(t).length); st.placed = 0; st.phase = 'read'; st.who = null;
  }
  // Row of each line now: placed lines in their right place, the rest in shuffled order below them.
  function rows() {
    var out = {}, r = st.placed;
    st.perm.forEach(function (li) { if (li < st.placed) out[li] = li; else out[li] = r++; });
    return out;
  }
  function letterOf(li) { return LET.charAt(st.perm.indexOf(li)); }
  function answer() { var t = text(), n = linesOf(t).length, o = []; for (var j = 0; j < n; j++) o.push(letterOf(j)); return o.join(' '); }

  function render() {
    var s = S(), t = text(), ph = st.phase, h = '';
    h += '<div class="ghead">' + kit.chip(s.tag, scr.ea('tag'), '#3d6bff') +
      (t && t.title ? '<div class="gpill shtitle"' + WU.editAttr('shuffle', 'texts', t.id, 'title') + '>' + WU.esc(t.title) + '</div>' : '') +
      (t && s.unitShow && t.unit && !(st.demo && s.demo) ? '<div class="gpill alt shunit"' + WU.editAttr('shuffle', 'texts', t.id, 'unit') + '>' + WU.esc(t.unit) + '</div>' : '') +
      (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (ph === 'read') h += bar.html();
    if (!t) { h += '<div class="shempty" data-ctrl>No texts for this level yet. Press E to add some.</div>'; box.querySelector('.layer').innerHTML = h; renderHints(); return; }
    var ls = linesOf(t), n = ls.length, R = rows(), rowH = Math.min(104, Math.floor(600 / n));
    h += '<div class="shlist" style="--rh:' + rowH + 'px">';
    if (ph !== 'read') for (var j = 0; j < n; j++) h += '<div class="shslot' + (j < st.placed ? ' on' : '') + '" data-auto style="top:' + (j * rowH) + 'px">' + (j + 1) + '</div>';
    ls.forEach(function (l) {
      var placed = ph !== 'read' && l.i < st.placed, last = placed && l.i === st.placed - 1 && ph === 'order';
      h += '<div data-li="' + WU.esc(t.id) + ':' + l.i + '" class="shline' + (placed ? ' placed' : '') + (last ? ' last' : '') + (ph !== 'read' ? ' indent' : '') + '" style="top:' + (R[l.i] * rowH) + 'px">' +
        '<span class="shlet" data-auto>' + letterOf(l.i) + '</span>' +
        '<span class="shtext"' + WU.editAttr('shuffle', 'texts', t.id, l.k) + '>' + WU.esc(l.text) + '</span></div>';
    });
    h += '</div><div class="shbottom">';
    if (ph === 'read') h += '<div class="shbig"' + scr.ea('read') + '>' + WU.esc(s.read) + '</div>' + (s.example ? '<div class="rule"' + scr.ea('example') + '>' + WU.esc(s.example) + '</div>' : '');
    else if (ph === 'order') {
      if (!st.placed) h += '<div class="shbig"' + scr.ea('order') + '>' + WU.esc(s.order) + '</div>';
      else { var parts = String(s.step || '').split('{n}'); h += '<div class="shbig"' + scr.ea('step') + '>' + WU.esc(parts[0]) + (parts.length > 1 ? '<b data-auto>' + st.placed + '</b>' + WU.esc(parts.slice(1).join('{n}')) : '') + ' <span class="shkey" data-auto>' + letterOf(st.placed - 1) + '</span></div>'; }
    } else {
      h += '<div class="shdone"><div class="shans" data-auto>' + WU.esc(answer()) + '</div><div class="shbig"' + scr.ea('done') + '>' + WU.esc(s.done) + '</div></div>';
      if (t.q) h += '<div class="shq"><span class="shql"' + scr.ea('qLabel') + '>' + WU.esc(s.qLabel) + '</span><span class="shqt"' + WU.editAttr('shuffle', 'texts', t.id, 'q') + '>' + WU.esc(t.q) + '</span>' + gram.who(s.ask, scr.ea('ask'), st.who) + '</div>';
    }
    h += '</div>';
    // Lines glide from their old row to the new one (the screen is redrawn on every step).
    var old = {};
    box.querySelectorAll('.shline[data-li]').forEach(function (el) { old[el.getAttribute('data-li')] = el.style.top; });
    box.querySelector('.layer').innerHTML = h;
    box.querySelectorAll('.shline[data-li]').forEach(function (el) {
      var o = old[el.getAttribute('data-li')], nw = el.style.top;
      if (o == null || o === nw) return;
      el.style.transition = 'none'; el.style.top = o; void el.offsetWidth; el.style.transition = ''; el.style.top = nw;
    });
    box.querySelectorAll('.shtext').forEach(function (el) { kit.fit(el, Math.min(48, rowH - 40), 22); });
    kit.fit(box.querySelector('.shqt'), 44, 24);
    if (ph === 'read') bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, hs, t = text(), n = linesOf(t).length;
    if (ph === 'read') hs = [['SPACE', 'check the order'], ['N', 'other text'], ['Esc', 'home']];
    else if (ph === 'order') hs = [['SPACE', st.placed >= n - 1 ? 'last line' : 'next line'], ['A', 'whole order'], ['N', 'other text'], ['Esc', 'home']];
    else hs = [['SPACE', 'next text'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function startRead() {
    st.phase = 'read'; st.placed = 0; render();
    var sec = Math.max(0, Math.min(300, +S().readSec || 0));
    if (sec) bar.start(box, sec, function () { if (st && st.phase === 'read') { st.phase = 'order'; render(); } });
  }
  function step() {
    var n = linesOf(text()).length;
    if (st.phase === 'read') { bar.stop(); st.phase = 'order'; WU.sound.slam(); render(); return; }
    if (st.phase === 'order') {
      st.placed = Math.min(n, st.placed + 1); WU.sound.pop();
      if (st.placed >= n) { st.phase = 'done'; st.who = kit.student(); WU.sound.ding(); }
      render(); return;
    }
    next();
  }
  function all() {
    if (st.phase === 'done') return;
    bar.stop(); st.placed = linesOf(text()).length; st.phase = 'done'; st.who = kit.student(); WU.sound.ding(); render();
  }
  function next() { bar.stop(); st.demo = false; newText(); WU.sound.pop(); startRead(); }
  function keyAction(k) {
    if (k === 'SPACE') { st.moved = true; step(); }
    else if (k === 'A') { st.moved = true; all(); }
    else if (k === 'N') { st.moved = true; next(); }
    else if (k === 'P') { if (st.phase === 'done') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!S().demoShow;
    var t = text();
    if (!t || linesOf(t).length < 3) { bar.stop(); newText(); startRead(); return; }
    if (sig(t) !== st.sig) {
      var n = linesOf(t).length;
      if (n !== st.perm.length) { st.perm = mix(n); st.placed = Math.min(st.placed, n); }
      st.sig = sig(t);
    }
    render();
  }

  WU.views.shuffle = {
    title: 'Story Shuffle',
    teacher: function () {
      if (!st) return null;
      var t = text(), sec = [], info = [];
      if (t) {
        sec.push({ label: 'Right order', text: answer(), huge: true });
        sec.push({ label: 'The text', html: linesOf(t).map(function (l) { return '<b>' + letterOf(l.i) + '</b> ' + WU.esc(l.text); }).join('<br>') });
        if (t.q) info.push({ label: 'Question', text: t.q + (t.a ? '  →  ' + t.a : '') });
      }
      info.push({ label: 'Lines in place', text: st.placed + ' / ' + linesOf(t).length });
      if (st.who && st.phase === 'done') info.push({ label: 'Answers the question', text: st.who });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'stop reading / next line moves into place / next text'], ['A', 'show the whole order'], ['N', 'other text'], ['P', 'other student (question)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'shg', 'Story Shuffle', 'shuffle-sb'); box = sh.box;
      st = { phase: 'read', id: null, perm: [], placed: 0, demo: !!S().demoShow, who: null, moved: false };
      newText(); startRead();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { a: 'A', n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
