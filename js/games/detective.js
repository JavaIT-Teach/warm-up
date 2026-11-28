/* Warm Up: MISTAKE DETECTIVE (reading + writing). A short text from the taught units hides 3 or 4 mistakes.
   Pairs read it and write the right sentences on paper (time bar). Then the class calls out a line: Up / Down choose it,
   Enter checks it (FOUND! with the correction, or NO MISTAKE!). Space reveals the next mistake. When every mistake is
   found, a picked student reads the whole text correctly.
   Keys: Space next step, Up / Down choose a line, Enter check it, A show every mistake, N other text, P other student,
   1-4 team points, S scores. Content: content/detective.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;
  var MAXL = 6, MARK = /\[([^\]|]*)\|([^\]]*)\]/g;

  var scr = kit.screen({
    game: 'detective', title: 'Mistake Detective', content: function () { return WU.content.detectiveScreen; },
    fields: [
      { type: 'head', label: 'Text' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 30 },
      { k: 'unitShow', label: 'Unit tag', type: 'bool' },
      { k: 'count', label: 'Number of mistakes ({n} = the number)', type: 'text', max: 24 },
      { type: 'head', label: 'Reading' },
      { k: 'read', label: 'Reading task', type: 'text', max: 70 },
      { k: 'readSec', label: 'Reading time (seconds, 0 = no bar)', type: 'num', min: 0, max: 300 },
      { type: 'head', label: 'Check' },
      { k: 'call', label: 'While checking', type: 'text', max: 50 },
      { k: 'found', label: 'Stamp: a mistake found', type: 'text', max: 16 },
      { k: 'none', label: 'Stamp: no mistake in the line', type: 'text', max: 16 },
      { k: 'done', label: 'When every mistake is found', type: 'text', max: 60 },
      { k: 'ask', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'demo', label: 'Teacher demo banner (first text only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  var lineFields = [];
  for (var i = 1; i <= MAXL; i++) lineFields.push({ k: 'l' + i, label: 'Line ' + i + (i > 3 ? ' (empty = not used)' : ''), type: 'text', max: 120 });
  WU.registerList('detective', 'texts', {
    gameTitle: 'Mistake Detective', label: 'Texts',
    defaults: function (l) { return WU.content.detective[l].texts; },
    norm: function (r) {
      var o = { title: r.title || '', unit: r.unit || '' };
      for (var k = 1; k <= MAXL; k++) o['l' + k] = r['l' + k] || '';
      return o;
    },
    fields: function () {
      return [{ k: 'title', label: 'Title', type: 'text', max: 50 }, { k: 'unit', label: 'Unit (tag)', type: 'text', max: 50 },
        { type: 'head', label: 'Lines. A mistake: [wrong|right], e.g. He [drive|drives] a lorry.' }].concat(lineFields);
    },
    blank: function () { return { title: 'My day', unit: '', l1: 'I [gets|get] up at seven.', l2: 'Then I have breakfast.', l3: 'After that, I [goes|go] to school.', l4: '', l5: '', l6: '' }; }
  });

  /* ---------- the text: lines and their mistakes (shared with the phone screen) ---------- */
  function parse(s) {
    var parts = [], fixes = [], last = 0, m;
    s = String(s || ''); MARK.lastIndex = 0;
    while ((m = MARK.exec(s))) {
      if (m.index > last) parts.push({ t: s.slice(last, m.index) });
      parts.push({ w: m[1], r: m[2] }); fixes.push({ w: m[1], r: m[2] });
      last = m.index + m[0].length;
    }
    if (last < s.length) parts.push({ t: s.slice(last) });
    return { parts: parts, fixes: fixes };
  }
  function linesOf(t) {
    var o = []; if (!t) return o;
    for (var k = 1; k <= MAXL; k++) {
      var s = String(t['l' + k] || '').trim(); if (!s) continue;
      var p = parse(s);
      o.push({ k: 'l' + k, raw: s, i: o.length, parts: p.parts, fixes: p.fixes,
        wrong: p.parts.map(function (x) { return x.t != null ? x.t : x.w; }).join(''),
        right: p.parts.map(function (x) { return x.t != null ? x.t : x.r; }).join('') });
    }
    return o;
  }
  // Escaped line: as written (with the mistakes) or with each mistake crossed out and its correction next to it.
  function lineHtml(l, revealed) {
    return l.parts.map(function (x) {
      if (x.t != null) return WU.esc(x.t);
      if (!revealed) return '<span class="mdx">' + WU.esc(x.w) + '</span>';
      return (x.w ? '<s class="mdw">' + WU.esc(x.w) + '</s> ' : '') + '<span class="mdr">' + WU.esc(x.r) + '</span>';
    }).join('');
  }
  function mistakes(ls) { return ls.filter(function (l) { return l.fixes.length; }); }
  WU.engines = WU.engines || {};
  WU.engines.detective = { linesOf: linesOf, lineHtml: lineHtml, mistakes: mistakes };

  var sh, box, st, offContent = null;
  var deck = kit.deck(), bar = gram.bar();

  function S() { return scr.get(); }
  function pool() { return WU.list('detective', 'texts', WU.state.level).filter(function (t) { var ls = linesOf(t); return ls.length >= 2 && mistakes(ls).length; }); }
  function text() { return WU.list('detective', 'texts', WU.state.level).filter(function (t) { return t.id === st.id; })[0] || null; }
  function sig(t) { return linesOf(t).map(function (l) { return l.raw; }).join('|'); }
  function newText() {
    var t = deck(pool());
    st.id = t ? t.id : null; st.sig = t ? sig(t) : '';
    st.rev = {}; st.no = {}; st.sel = 0; st.stamp = null; st.phase = 'read'; st.who = null;
  }
  function left(ls) { return mistakes(ls).filter(function (l) { return !st.rev[l.i]; }); }

  function render() {
    var s = S(), t = text(), ph = st.phase, h = '';
    var ls = linesOf(t), n = ls.length, nm = mistakes(ls).length;
    h += '<div class="ghead">' + kit.chip(s.tag, scr.ea('tag'), '#ff3b3b') +
      (t && t.title ? '<div class="gpill mdtitle"' + WU.editAttr('detective', 'texts', t.id, 'title') + '>' + WU.esc(t.title) + '</div>' : '') +
      (t && s.unitShow && t.unit && !(st.demo && s.demo) ? '<div class="gpill alt mdunit"' + WU.editAttr('detective', 'texts', t.id, 'unit') + '>' + WU.esc(t.unit) + '</div>' : '');
    if (t && s.count) {
      var cp = String(s.count).split('{n}'), found = nm - left(ls).length;
      h += '<div class="mdcount"' + scr.ea('count') + '>' + WU.esc(cp[0]) + (cp.length > 1 ? '<b data-auto>' + (ph === 'read' ? nm : found + ' / ' + nm) + '</b>' + WU.esc(cp.slice(1).join('{n}')) : '') + '</div>';
    }
    h += (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (ph === 'read') h += bar.html();
    if (!t) { h += '<div class="mdempty" data-ctrl>No texts for this level yet. Press E to add some.</div>'; box.querySelector('.layer').innerHTML = h; renderHints(); return; }
    var rowH = Math.min(104, Math.floor(600 / n));
    h += '<div class="mdlist" style="--rh:' + rowH + 'px">';
    ls.forEach(function (l) {
      var rv = !!st.rev[l.i], no = !!st.no[l.i], sel = ph !== 'done' && st.sel === l.i;
      h += '<div class="mdline' + (rv ? ' found' : '') + (no ? ' clean' : '') + (sel ? ' sel' : '') + '" data-li="' + l.i + '" style="top:' + (l.i * rowH) + 'px">' +
        '<span class="mdnum" data-auto>' + (l.i + 1) + '</span>' +
        '<span class="mdtext"' + WU.editAttr('detective', 'texts', t.id, l.k) + '>' + lineHtml(l, rv) + '</span>' +
        (st.stamp && st.stamp.i === l.i ? '<span class="mdstamp ' + (st.stamp.ok ? 'ok' : 'no') + '"' + scr.ea(st.stamp.ok ? 'found' : 'none') + '>' + WU.esc(st.stamp.ok ? s.found : s.none) + '</span>' : '') +
        '</div>';
    });
    h += '</div><div class="mdbottom">';
    if (ph === 'read') h += '<div class="mdbig"' + scr.ea('read') + '>' + WU.esc(s.read) + '</div>';
    else if (ph === 'check') h += '<div class="mdbig"' + scr.ea('call') + '>' + WU.esc(s.call) + '</div>';
    else h += '<div class="mdbig small"' + scr.ea('done') + '>' + WU.esc(s.done) + '</div>' + gram.who(s.ask, scr.ea('ask'), st.who);
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    box.querySelectorAll('.mdtext').forEach(function (el) { kit.fit(el, Math.min(50, rowH - 36), 22); });
    box.querySelectorAll('.mdline').forEach(function (el) {
      el.onclick = function () { if (WU.editing) return; st.moved = true; st.sel = +el.getAttribute('data-li'); check(); };
    });
    if (ph === 'read') bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, hs;
    if (ph === 'read') hs = [['SPACE', 'stop reading'], ['↑↓', 'choose a line'], ['ENTER', 'check it'], ['N', 'other text'], ['Esc', 'home']];
    else if (ph === 'check') hs = [['SPACE', 'next mistake'], ['↑↓', 'choose a line'], ['ENTER', 'check it'], ['A', 'all mistakes'], ['N', 'other text'], ['Esc', 'home']];
    else hs = [['SPACE', 'next text'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function startRead() {
    st.phase = 'read'; render();
    var sec = Math.max(0, Math.min(300, +S().readSec || 0));
    if (sec) bar.start(box, sec, function () { if (st && st.phase === 'read') { st.phase = 'check'; render(); } });
  }
  function finishIfDone(ls) {
    if (st.phase !== 'done' && !left(ls).length) { st.phase = 'done'; st.who = kit.student(); WU.sound.ding(); }
  }
  // Check the chosen line: a hidden mistake there is revealed; a line without one gets NO MISTAKE!
  function check() {
    var ls = linesOf(text()), l = ls[st.sel]; if (!l || st.phase === 'done') return;
    bar.stop(); if (st.phase === 'read') st.phase = 'check';
    if (l.fixes.length) { st.stamp = { i: l.i, ok: true }; if (!st.rev[l.i]) { st.rev[l.i] = true; WU.sound.pop(); } }
    else { st.stamp = { i: l.i, ok: false }; st.no[l.i] = true; WU.sound.buzzer(); }
    finishIfDone(ls); render();
  }
  function step() {
    var ls = linesOf(text());
    if (st.phase === 'read') { bar.stop(); st.phase = 'check'; WU.sound.slam(); render(); return; }
    if (st.phase === 'check') {
      var l = left(ls)[0];
      if (l) { st.rev[l.i] = true; st.sel = l.i; st.stamp = { i: l.i, ok: true }; WU.sound.pop(); }
      finishIfDone(ls); render(); return;
    }
    next();
  }
  function all() {
    if (st.phase === 'done') return;
    var ls = linesOf(text());
    bar.stop(); mistakes(ls).forEach(function (l) { st.rev[l.i] = true; }); st.stamp = null; finishIfDone(ls); render();
  }
  function move(d) {
    var n = linesOf(text()).length; if (!n || st.phase === 'done') return;
    st.sel = (st.sel + d + n) % n; st.stamp = null; WU.sound.clack(); render();
  }
  function next() { bar.stop(); st.demo = false; newText(); WU.sound.pop(); startRead(); }
  function keyAction(k) {
    if (k === 'SPACE') { st.moved = true; step(); }
    else if (k === 'ENTER') { st.moved = true; check(); }
    else if (k === '↑↓' || k === 'DOWN') move(1);
    else if (k === 'UP') move(-1);
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
    if (!t || !mistakes(linesOf(t)).length) { bar.stop(); newText(); startRead(); return; }
    if (sig(t) !== st.sig) { st.sig = sig(t); st.sel = Math.min(st.sel, linesOf(t).length - 1); st.stamp = null; }
    render();
  }

  WU.views.detective = {
    title: 'Mistake Detective',
    teacher: function () {
      if (!st) return null;
      var t = text(), ls = linesOf(t), sec = [], info = [];
      if (t) {
        sec.push({ label: 'The mistakes', html: mistakes(ls).map(function (l) {
          return '<b>' + (l.i + 1) + '</b> ' + l.fixes.map(function (f) { return '<s>' + WU.esc(f.w) + '</s> → <b>' + WU.esc(f.r) + '</b>'; }).join(', ');
        }).join('<br>'), big: true });
        sec.push({ label: 'The right text', html: ls.map(function (l) { return '<b>' + (l.i + 1) + '</b> ' + WU.esc(l.right); }).join('<br>') });
      }
      info.push({ label: 'Found', text: (mistakes(ls).length - left(ls).length) + ' / ' + mistakes(ls).length });
      if (st.who && st.phase === 'done') info.push({ label: 'Reads the text', text: st.who });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'stop reading / reveal the next mistake / next text'], ['Up / Down', 'choose a line (the class says its number)'], ['Enter', 'check the line (or tap it)'], ['A', 'show every mistake'], ['N', 'other text'], ['P', 'other student (reads the text)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'mdg', 'Mistake Detective', 'detective-sb'); box = sh.box;
      st = { phase: 'read', id: null, rev: {}, no: {}, sel: 0, stamp: null, demo: !!S().demoShow, who: null, moved: false };
      newText(); startRead();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      if (e.key === 'ArrowDown') { e.preventDefault(); keyAction('DOWN'); return true; }
      if (e.key === 'ArrowUp') { e.preventDefault(); keyAction('UP'); return true; }
      var map = { a: 'A', n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
