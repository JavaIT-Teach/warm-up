/* Warm Up: SENTENCE TRAIN (grammar + writing). A sentence cut into chunks, mixed up at the top of the board.
   Below them, an empty train: one carriage per chunk (with the job of each chunk: SUBJECT, VERB, OBJECT, WHERE...).
   Students build the sentence (say it, or write it on paper) before the time bar runs out. Space: the chunks move into
   their carriages one by one, each in the colour of its job. Then the pattern (SUBJECT + VERB + OBJECT...), the rule,
   and a twist for a picked student: make it negative, a question, a short answer, longer... Space shows the answer.
   Keys: Space next step, A whole sentence, H job labels on / off, N other sentence, P other student, S scores.
   Content: content/sentence.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;
  var MAXC = 12, OPEN_TWISTS = ['ans', 'long'];
  var KIND = { '+': 'kPos', '-': 'kNeg', '?': 'kQ', wh: 'kWh', '2': 'k2', long: 'kLong' };
  var TWIST = { neg: 'tNeg', q: 'tQ', pos: 'tPos', wh: 'tWh', short: 'tShort', ans: 'tAns', long: 'tLong' };
  var KIND_BG = { '+': '#c6ff00', '-': '#0d0d0d', '?': '#3d6bff', wh: '#ff2d55', '2': '#ffe600', long: '#ff4fc3' };
  // First words that are only capitalised because they start the sentence (lower-cased on the mixed tiles).
  var STARTERS = ('a an the my your his her its our their this that these those he she it we they you there here do does did ' +
    'is are am was were have has had will would can could should shall may might must what where when why who whom whose which ' +
    'how if because although though while as since unless after before once not never always usually often sometimes every last ' +
    'next yesterday today tomorrow on in at by with for from to some many much most all both each no nobody everyone people ' +
    'children only hardly rarely seldom little few so such despite having being given whether much one students governments ' +
    'not until whatever whoever none neither either').split(' ');

  /* ---------- the sentence: chunks, jobs, mixing (shared with the phone: WU.engines.sentence) ---------- */
  function roles() { return WU.list('sentence', 'roles', 0); }
  function roleOf(code) {
    var c = String(code || '').trim().toUpperCase();
    var r = roles().filter(function (x) { return String(x.code || '').trim().toUpperCase() === c; })[0];
    return r ? { id: r.id, code: c, name: r.name || c, color: r.color || '#dddddd', found: true } : { id: null, code: c, name: c || '?', color: '#dddddd', found: false };
  }
  // Dark colours get white text.
  function ink(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return '#0d0d0d';
    var n = parseInt(m[1], 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 140 ? '#ffffff' : '#0d0d0d';
  }
  // [{ i, text (in the carriage), tile (on the mixed tile), role }], end = the final . ? !
  function parse(it) {
    var out = { chunks: [], end: '' }; if (!it) return out;
    var parts = String(it.s || '').split('/').map(function (x) { return x.trim(); }).filter(Boolean).slice(0, MAXC);
    var rs = String(it.r || '').split('/').map(function (x) { return x.trim(); });
    if (parts.length) {
      var last = parts[parts.length - 1], m = /\s*([.?!…]+)$/.exec(last);
      if (m) { out.end = m[1]; parts[parts.length - 1] = last.slice(0, last.length - m[0].length).trim(); }
    }
    parts.forEach(function (p, i) {
      var tile = p.replace(/[,;:.?!]+$/, '').trim();
      if (i === 0) {
        var w = tile.split(/\s+/)[0] || '';
        if (STARTERS.indexOf(w.toLowerCase()) >= 0 && w !== 'I' && !/^I'/.test(w)) tile = tile.charAt(0).toLowerCase() + tile.slice(1);
      }
      out.chunks.push({ i: i, text: p, tile: tile || p, role: rs[i] || '' });
    });
    return out;
  }
  // A mix that is never the right order (and does not start with chunk 1, from 4 chunks).
  function mix(chunks) {
    var n = chunks.length, base = [], p, tries = 0, sig = function (a) { return a.map(function (j) { return chunks[j].tile.toLowerCase(); }).join('|'); };
    for (var j = 0; j < n; j++) base.push(j);
    var right = sig(base);
    do { p = WU.shuffle(base.slice()); tries++; } while (tries < 60 && n > 1 && (sig(p) === right || (n >= 4 && chunks[p[0]].tile.toLowerCase() === chunks[0].tile.toLowerCase())));
    return p;
  }
  // The jobs in order, one per run (two COMPLEMENT chunks in a row = one COMPLEMENT).
  function pattern(chunks) {
    var out = [];
    chunks.forEach(function (c) { var r = roleOf(c.role); if (!out.length || out[out.length - 1].code !== r.code) out.push(r); });
    return out;
  }
  function answers(ta) { return String(ta || '').split('|').map(function (x) { return x.trim(); }).filter(Boolean); }
  WU.engines = WU.engines || {};
  WU.engines.sentence = { parse: parse, mix: mix, roleOf: roleOf, pattern: pattern, ink: ink, answers: answers, KIND: KIND, TWIST: TWIST, KIND_BG: KIND_BG, OPEN_TWISTS: OPEN_TWISTS };

  /* ---------- editable lists ---------- */
  var scr = kit.screen({
    game: 'sentence', title: 'Sentence Train', content: function () { return WU.content.sentenceScreen; },
    fields: [
      { type: 'head', label: 'Build' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 30 },
      { k: 'task', label: 'Task', type: 'text', max: 70 },
      { k: 'buildSec', label: 'Time to build (seconds, 0 = no bar)', type: 'num', min: 0, max: 300 },
      { k: 'slotLabels', label: 'Job labels on the empty carriages (H switches)', type: 'bool' }
    ].concat(kit.ruleFields).concat([
      { type: 'head', label: 'Check' },
      { k: 'step', label: 'While the chunks move ({n} = carriage number)', type: 'text', max: 40 },
      { k: 'done', label: 'When the train is complete', type: 'text', max: 50 },
      { k: 'patLabel', label: 'Pattern label', type: 'text', max: 20 },
      { k: 'whyLabel', label: 'Rule label', type: 'text', max: 20 },
      { type: 'head', label: 'Kind of sentence (tag at the top)' },
      { k: 'kPos', label: 'Positive', type: 'text', max: 24 },
      { k: 'kNeg', label: 'Negative', type: 'text', max: 24 },
      { k: 'kQ', label: 'Yes / no question', type: 'text', max: 24 },
      { k: 'kWh', label: 'Wh- question', type: 'text', max: 24 },
      { k: 'k2', label: 'Two parts', type: 'text', max: 24 },
      { k: 'kLong', label: 'Long sentence', type: 'text', max: 24 },
      { type: 'head', label: 'Twist (after the check)' },
      { k: 'ask', label: 'Picked student ({name})', type: 'text', max: 40 },
      { k: 'tNeg', label: 'Make it negative', type: 'text', max: 40 },
      { k: 'tQ', label: 'Make it a question', type: 'text', max: 40 },
      { k: 'tPos', label: 'Make it positive', type: 'text', max: 40 },
      { k: 'tWh', label: 'Ask a wh- question', type: 'text', max: 40 },
      { k: 'tShort', label: 'Short answer', type: 'text', max: 40 },
      { k: 'tAns', label: 'Answer the question', type: 'text', max: 40 },
      { k: 'tLong', label: 'Make it longer', type: 'text', max: 40 },
      { k: 'exLabel', label: 'Label on an example answer', type: 'text', max: 20 }
    ]).concat(kit.demoFields)
  });
  var KINDS = [['+', 'Positive'], ['-', 'Negative'], ['?', 'Yes / no question'], ['wh', 'Wh- question'], ['2', 'Two parts'], ['long', 'Long sentence']];
  var TWISTS = [['', '(no twist)'], ['neg', 'Make it negative'], ['q', 'Make it a question'], ['pos', 'Make it positive'], ['wh', 'Ask a wh- question'],
    ['short', 'Short answer'], ['ans', 'Answer it (open: example)'], ['long', 'Make it longer (open: example)']];
  WU.registerList('sentence', 'items', {
    gameTitle: 'Sentence Train', label: 'Sentences',
    defaults: function (l) { return WU.content.sentence[l].items; },
    title: function (r) { return r.s || ''; },
    norm: function (r) { return { k: r.k || '+', s: r.s || '', r: r.r || '', tk: r.tk || '', th: r.th || '', ta: r.ta || '', why: r.why || '' }; },
    fields: function () {
      return [
        { k: 'k', label: 'Kind', type: 'select', options: KINDS },
        { type: 'head', label: 'The sentence in the RIGHT order, chunks split by " / " (the game mixes them)' },
        { k: 's', label: 'Sentence (Tom / plays / football / every day.)', type: 'text', max: 200 },
        { k: 'r', label: 'Job of each chunk, same order (S / V / O / WHEN). Codes: see the Jobs list', type: 'text', max: 120 },
        { k: 'why', label: 'Rule shown after the check (empty = none)', type: 'text', max: 110 },
        { type: 'head', label: 'Twist for a picked student' },
        { k: 'tk', label: 'Twist', type: 'select', options: TWISTS },
        { k: 'th', label: 'Hint after the twist (empty = none)', type: 'text', max: 50 },
        { k: 'ta', label: 'Answer (other right answers after " | ")', type: 'text', max: 300 }
      ];
    },
    blank: function () { return { k: '+', s: 'My friend / plays / tennis / on Sundays.', r: 'S / V / O / WHEN', tk: 'neg', th: '', ta: "My friend doesn't play tennis on Sundays.", why: '' }; }
  });
  var COLORS = [['#3d6bff', 'Blue'], ['#ff5a1f', 'Orange'], ['#0d0d0d', 'Black'], ['#ff4fc3', 'Pink'], ['#00e5c7', 'Teal'], ['#c6ff00', 'Lime'],
    ['#ffe600', 'Yellow'], ['#ffb03a', 'Amber'], ['#a98bff', 'Purple'], ['#33c24d', 'Green'], ['#6fd3ff', 'Sky'], ['#ff8fa3', 'Rose'],
    ['#ff2d55', 'Red'], ['#ffffff', 'White'], ['#d9c8ff', 'Lilac'], ['#b8f5e8', 'Mint'], ['#e6e1d3', 'Sand']];
  WU.registerList('sentence', 'roles', {
    gameTitle: 'Sentence Train', label: 'Jobs (carriage labels)', global: true,
    defaults: function () { return WU.content.sentenceRoles; },
    norm: function (r) { return { code: r.code || '', name: r.name || '', color: r.color || '#e6e1d3' }; },
    title: function (r) { return (r.code || '?') + ' = ' + (r.name || ''); },
    fields: function () {
      return [{ k: 'code', label: 'Code (used in the sentences: S, V, O...)', type: 'text', max: 8 },
        { k: 'name', label: 'Label under the carriage', type: 'text', max: 20 },
        { k: 'color', label: 'Colour', type: 'select', options: COLORS }];
    },
    blank: function () { return { code: 'NEW', name: 'NEW JOB', color: '#e6e1d3' }; }
  });

  /* ---------- the game ---------- */
  var sh, box, st, offContent = null;
  var deck = kit.deck(), bar = gram.bar();

  function S() { return scr.get(); }
  function pool() { return WU.list('sentence', 'items', WU.state.level).filter(function (t) { return parse(t).chunks.length >= 2; }); }
  function item() { return WU.list('sentence', 'items', WU.state.level).filter(function (t) { return t.id === st.id; })[0] || null; }
  function sig(t) { return t ? t.s + '#' + t.r : ''; }
  function newItem() {
    var t = deck(pool());
    st.id = t ? t.id : null; st.sig = sig(t);
    st.perm = mix(parse(t).chunks); st.placed = 0; st.phase = 'build'; st.who = null; st.labels = null;
  }
  function labelsOn() { return st.labels == null ? !!S().slotLabels : st.labels; }
  function twistOf(t) { return t && t.tk && TWIST[t.tk] ? t.tk : ''; }
  function ea(t, f) { return WU.editAttr('sentence', 'items', t.id, f); }
  function roleAttr(r) { return r.id ? WU.editAttr('sentence', 'roles', r.id, 'name') : ' data-auto'; }

  // Shrink a box's --fs until its content fits (any edited text fits).
  function fitBox(el, max, min) {
    if (!el) return;
    // Measured without the pop-in animations (their scaled first frame would count as overflow).
    el.classList.add('stn-measure');
    var fs = max; el.style.setProperty('--fs', fs + 'px');
    while (fs > min && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) { fs -= 3; el.style.setProperty('--fs', fs + 'px'); }
    el.classList.remove('stn-measure');
  }

  function render() {
    var s = S(), t = item(), ph = st.phase, h = '';
    var kindKey = t ? KIND[t.k] || 'kPos' : '', kbg = t ? KIND_BG[t.k] || '#c6ff00' : '';
    h += '<div class="ghead">' + kit.chip(s.tag, scr.ea('tag'), '#ff5a1f') +
      (t && s[kindKey] ? '<div class="stn-kind" style="background:' + kbg + ';color:' + ink(kbg) + '"' + scr.ea(kindKey) + '>' + WU.esc(s[kindKey]) + '</div>' : '') +
      (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (ph === 'build') h += bar.html();
    if (!t) { h += '<div class="stn-empty" data-ctrl>No sentences for this level yet. Press E to add some.</div>'; box.querySelector('.layer').innerHTML = h; renderHints(); return; }
    var P = parse(t), cs = P.chunks, n = cs.length, tw = twistOf(t);

    // Top: the mixed tiles (build, order), or the whole sentence and the twist (done, reveal).
    h += '<div class="stn-top">';
    if (ph === 'build' || ph === 'order') {
      h += '<div class="stn-cloud">';
      st.perm.forEach(function (ci) {
        var used = ph === 'order' && ci < st.placed;
        h += '<div class="stn-tile' + (used ? ' used' : '') + '"' + ea(t, 's') + '>' + WU.esc(cs[ci].tile) + '</div>';
      });
      h += '</div>';
    } else {
      h += '<div class="stn-full"' + ea(t, 's') + '>' + WU.esc(cs.map(function (c) { return c.text; }).join(' ') + P.end) + '</div>';
      if (tw) {
        h += '<div class="stn-twist"><span class="stn-tw"' + scr.ea(TWIST[tw]) + '>' + WU.esc(s[TWIST[tw]]) + '</span>' +
          (t.th ? '<span class="stn-th"' + ea(t, 'th') + '>' + WU.esc(t.th) + '</span>' : '') + gram.who(s.ask, scr.ea('ask'), st.who) + '</div>';
      }
    }
    h += '</div>';

    // Middle: the train.
    h += '<div class="stn-rail">';
    cs.forEach(function (c, j) {
      var r = roleOf(c.role), filled = ph !== 'build' && j < st.placed, last = filled && j === st.placed - 1 && ph === 'order';
      var showLab = filled || labelsOn();
      h += '<div class="stn-car' + (filled ? ' on' : '') + (last ? ' last' : '') + '"' + (filled ? ' style="--rc:' + r.color + ';--ri:' + ink(r.color) + '"' : (showLab ? ' style="--rc:' + r.color + ';--ri:' + ink(r.color) + '"' : '')) + '>' +
        '<div class="stn-ct"' + (filled ? ea(t, 's') : ' data-auto') + '>' + (filled ? WU.esc(c.text) : (j + 1)) + '</div>' +
        '<div class="stn-cr' + (showLab ? '' : ' off') + '"' + (showLab ? roleAttr(r) : ' data-auto') + '>' + WU.esc(showLab ? r.name : '?') + '</div></div>';
    });
    if (P.end) h += '<div class="stn-end" data-auto>' + WU.esc(P.end) + '</div>';
    h += '</div>';

    // Bottom.
    h += '<div class="stn-bottom">';
    if (ph === 'build') {
      h += '<div class="stn-big"' + scr.ea('task') + '>' + WU.esc(s.task) + '</div>' +
        (s.ruleShow && s.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(s.rule) + '</div>' : '');
    } else if (ph === 'order') {
      if (!st.placed) h += '<div class="stn-big"' + scr.ea('done') + '>' + WU.esc(s.done) + '</div>';
      else { var parts = String(s.step || '').split('{n}'); h += '<div class="stn-big"' + scr.ea('step') + '>' + WU.esc(parts[0]) + (parts.length > 1 ? '<b data-auto>' + st.placed + '</b>' + WU.esc(parts.slice(1).join('{n}')) : '') + '</div>'; }
    } else if (ph === 'done' || !tw) {
      h += '<div class="stn-pat"><span class="stn-pl"' + scr.ea('patLabel') + '>' + WU.esc(s.patLabel) + '</span>' +
        pattern(cs).map(function (r, j) { return (j ? '<i data-auto>+</i>' : '') + '<span class="stn-pc" style="background:' + r.color + ';color:' + ink(r.color) + '"' + roleAttr(r) + '>' + WU.esc(r.name) + '</span>'; }).join('') + '</div>' +
        (t.why ? '<div class="stn-why"><span class="stn-pl"' + scr.ea('whyLabel') + '>' + WU.esc(s.whyLabel) + '</span><span class="stn-wt"' + ea(t, 'why') + '>' + WU.esc(t.why) + '</span></div>' : '');
    } else {
      var open = OPEN_TWISTS.indexOf(tw) >= 0, as = answers(t.ta);
      h += as.length ? gram.answer(open ? s.exLabel : '', open ? scr.ea('exLabel') : '', WU.esc(as[0]), ea(t, 'ta')) : '<div class="stn-big" data-ctrl>No answer yet: press E to add one.</div>';
    }
    h += '</div>';

    box.querySelector('.layer').innerHTML = h;
    fitBox(box.querySelector('.stn-cloud'), 48, 22);
    fitBox(box.querySelector('.stn-top'), 60, 24);
    fitBox(box.querySelector('.stn-rail'), 40, 18);
    // No coupling in front of the first carriage of a row.
    var top = null; box.querySelectorAll('.stn-car').forEach(function (c) { c.classList.toggle('stn-r1', c.offsetTop !== top); top = c.offsetTop; });
    fitBox(box.querySelector('.stn-bottom'), 44, 20);
    if (ph === 'build') bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, hs, t = item(), n = parse(t).chunks.length, tw = twistOf(t);
    if (ph === 'build') hs = [['SPACE', 'check'], ['H', 'job labels'], ['N', 'other sentence'], ['Esc', 'home']];
    else if (ph === 'order') hs = [['SPACE', st.placed >= n - 1 ? 'last carriage' : 'next carriage'], ['A', 'whole sentence'], ['N', 'other sentence'], ['Esc', 'home']];
    else if (ph === 'done' && tw) hs = [['SPACE', 'show the answer'], ['P', 'other student'], ['N', 'next sentence'], ['Esc', 'home']];
    else hs = [['SPACE', 'next sentence'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function startBuild() {
    st.phase = 'build'; st.placed = 0; render();
    var sec = Math.max(0, Math.min(300, +S().buildSec || 0));
    if (sec) bar.start(box, sec, function () { if (st && st.phase === 'build') { st.phase = 'order'; render(); } });
  }
  function finish() { st.phase = 'done'; if (twistOf(item())) st.who = kit.student(); WU.sound.ding(); }
  function step() {
    var n = parse(item()).chunks.length;
    if (st.phase === 'build') { bar.stop(); st.phase = 'order'; WU.sound.slam(); render(); return; }
    if (st.phase === 'order') { st.placed = Math.min(n, st.placed + 1); WU.sound.pop(); if (st.placed >= n) finish(); render(); return; }
    if (st.phase === 'done' && twistOf(item())) { st.phase = 'reveal'; WU.sound.clack(); render(); return; }
    next();
  }
  function all() {
    if (st.phase === 'done' || st.phase === 'reveal') return;
    bar.stop(); st.placed = parse(item()).chunks.length; finish(); render();
  }
  function next() { bar.stop(); st.demo = false; newItem(); WU.sound.pop(); startBuild(); }
  function keyAction(k) {
    if (k === 'SPACE') { st.moved = true; step(); }
    else if (k === 'A') { st.moved = true; all(); }
    else if (k === 'N') { st.moved = true; next(); }
    else if (k === 'H') { st.labels = !labelsOn(); WU.sound.clack(); render(); }
    else if (k === 'P') { if (st.phase === 'done' && st.who) { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!S().demoShow;
    var t = item();
    if (!t || parse(t).chunks.length < 2) { bar.stop(); newItem(); startBuild(); return; }
    if (sig(t) !== st.sig) {
      var cs = parse(t).chunks;
      if (cs.length !== st.perm.length || String(t.s) !== String(st.sig).split('#')[0]) { st.perm = mix(cs); st.placed = Math.min(st.placed, cs.length); }
      st.sig = sig(t);
    }
    render();
  }

  WU.views.sentence = {
    title: 'Sentence Train',
    teacher: function () {
      if (!st) return null;
      var t = item(), sec = [], info = [];
      if (t) {
        var P = parse(t), s = S(), tw = twistOf(t);
        sec.push({ label: 'The sentence', text: P.chunks.map(function (c) { return c.text; }).join(' ') + P.end, big: true });
        sec.push({ label: 'Pattern', text: pattern(P.chunks).map(function (r) { return r.name; }).join(' + ') });
        if (tw) sec.push({ label: 'Twist: ' + (s[TWIST[tw]] || ''), html: answers(t.ta).map(function (a) { return WU.esc(a); }).join('<br>') || '(no answer yet)' });
        if (t.why) info.push({ label: 'Rule', text: t.why });
        info.push({ label: 'Carriages filled', text: (st.phase === 'build' ? 0 : st.placed) + ' / ' + P.chunks.length });
      }
      if (st.who && (st.phase === 'done' || st.phase === 'reveal')) info.push({ label: 'Twist for', text: st.who });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'stop building / next carriage / twist answer / next sentence'], ['A', 'fill the whole train'], ['H', 'job labels on the empty carriages on / off'], ['N', 'other sentence'], ['P', 'other student (twist)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'stng', 'Sentence Train', 'sentence-sb'); box = sh.box;
      st = { phase: 'build', id: null, perm: [], placed: 0, demo: !!S().demoShow, who: null, moved: false, labels: null };
      newItem(); startBuild();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { a: 'A', n: 'N', p: 'P', s: 'S', h: 'H' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
