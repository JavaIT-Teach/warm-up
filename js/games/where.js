/* Warm Up: HIDE & SEEK CAT (grammar game G4, Beginner to Intermediate). Trains: prepositions of place, then of movement.
   The cat (or another animal / toy) hides somewhere: in the box, on / under / next to the table, behind / in front of the box,
   between two boxes, above the table. From Pre-Intermediate it also moves: into / out of / over the box, around the tree,
   past / towards / away from the house, across the road, through the tunnel, up / down the hill.
   The screen picks a student, who says where it is (or where it is going). Space reveals the sentence.
   Keys: Space reveal / next, N other place, R move again, P other student, 1-4 team points.
   Content: content/where.js (movers) and Screen text & timing (places, words, which places each level uses). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  // Every place: its word field, the thing it hides at, still or moving.
  var PLACES = [
    ['in', 'box'], ['on', 'table'], ['under', 'table'], ['next', 'table'], ['behind', 'box'], ['front', 'box'], ['between', 'boxes'], ['above', 'table'],
    ['into', 'box', 1], ['outof', 'box', 1], ['over', 'box', 1], ['around', 'tree', 1], ['past', 'house', 1], ['towards', 'house', 1], ['away', 'house', 1],
    ['across', 'road', 1], ['through', 'tunnel', 1], ['up', 'hill', 1], ['down', 'hill', 1]
  ];
  var NAMES = { in: 'in', on: 'on', under: 'under', next: 'next to', behind: 'behind', front: 'in front of', between: 'between', above: 'above',
    into: 'into', outof: 'out of', over: 'over', around: 'around', past: 'past', towards: 'towards', away: 'away from', across: 'across', through: 'through', up: 'up', down: 'down' };
  var REFS = [['box', 'the box'], ['table', 'the table'], ['boxes', 'the two boxes'], ['tree', 'the tree'], ['house', 'the house'], ['road', 'the road'], ['tunnel', 'the tunnel'], ['hill', 'the hill']];

  var fields = [
    { type: 'head', label: 'Questions and sentences' },
    { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
    { k: 'ask', label: 'Question, still ({thing})', type: 'text', max: 50 },
    { k: 'askMove', label: 'Question, moving ({thing})', type: 'text', max: 50 },
    { k: 'place', label: 'Sentence, still ({thing} {prep} {ref})', type: 'text', max: 60 },
    { k: 'move', label: 'Sentence, moving ({thing} {prep} {ref})', type: 'text', max: 60 },
    { k: 'who', label: 'Picked student ({name})', type: 'text', max: 50 },
    { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
    { k: 'seconds', label: 'Time bar (seconds, 0 = none)', type: 'num', min: 0, max: 30 },
    { type: 'head', label: 'Places used at this level, and their words' }
  ];
  PLACES.forEach(function (p) {
    fields.push({ k: 'u_' + p[0], label: NAMES[p[0]] + (p[2] ? ' (moving)' : ''), type: 'bool', on: 'Use', off: "Don't use" });
    fields.push({ k: 'w_' + p[0], label: 'Word for "' + NAMES[p[0]] + '"', type: 'text', max: 20 });
  });
  fields.push({ type: 'head', label: 'The things it hides at' });
  REFS.forEach(function (r) { fields.push({ k: 'r_' + r[0], label: r[1], type: 'text', max: 30 }); });
  fields.push({ k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 }, { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' });

  var scr = kit.screen({ game: 'where', title: 'Hide & Seek Cat', content: function () { return WU.content.whereScreen; }, fields: fields });
  WU.registerList('where', 'movers', {
    gameTitle: 'Hide & Seek Cat', label: 'Who hides',
    defaults: function (l) { return WU.content.where[l].movers; },
    norm: function (r) { return { pic: r.pic || '', word: r.word || WU.picName(r.pic) || '' }; },
    title: function (it) { return it.word || '(empty)'; },
    fields: function () { return [{ k: 'pic', label: 'Picture', type: 'pic' }, { k: 'word', label: 'Word (the ___)', type: 'text', max: 30 }]; },
    blank: function () { return { pic: '', word: '' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar(), anim = null;
  var deck = kit.deck(), pdeck = kit.deck();
  var K = '#0d0d0d', G = 540, M = 150;

  function movers() { return WU.list('where', 'movers', WU.state.level).filter(function (x) { return x.pic; }); }
  function mover() { return movers().filter(function (x) { return x.id === st.mid; })[0] || null; }
  function places() { var S = scr.get(); return PLACES.filter(function (p) { return S['u_' + p[0]]; }).map(function (p) { return { id: p[0], ref: p[1], move: !!p[2] }; }); }
  function place() { return PLACES.filter(function (p) { return p[0] === st.pid; }).map(function (p) { return { id: p[0], ref: p[1], move: !!p[2] }; })[0] || null; }

  /* ---------- scenery (each piece opens its word in the editor) ---------- */
  function piece(html, x, y, w, h, z, ref) { return '<div class="wspc" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;z-index:' + z + '"' + scr.ea('r_' + ref) + '>' + html + '</div>'; }
  function table() {
    return '<svg viewBox="0 0 460 230" width="460" height="230"><rect x="22" y="30" width="26" height="198" fill="#8a5a2b" stroke="' + K + '" stroke-width="5"></rect><rect x="412" y="30" width="26" height="198" fill="#8a5a2b" stroke="' + K + '" stroke-width="5"></rect>' +
      '<rect x="3" y="3" width="454" height="34" rx="6" fill="#b0703a" stroke="' + K + '" stroke-width="5"></rect></svg>';
  }
  function boxBack(w) { return '<svg viewBox="0 0 ' + w + ' 34" width="' + w + '" height="34"><polygon points="22,3 ' + (w - 3) + ',3 ' + (w - 24) + ',31 3,31" fill="#9c6a35" stroke="' + K + '" stroke-width="5"></polygon></svg>'; }
  function boxFront(w, h) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"><rect x="3" y="3" width="' + (w - 6) + '" height="' + (h - 6) + '" fill="#d9a066" stroke="' + K + '" stroke-width="5"></rect>' +
      '<rect x="' + (w / 2 - 18) + '" y="3" width="36" height="' + (h * 0.45) + '" fill="#f2d3a0" stroke="' + K + '" stroke-width="4"></rect></svg>';
  }
  function crate(x, w, h, zb, zf) { return piece(boxBack(w + 20), x, G - h - 30, w + 20, 34, zb, 'box') + piece(boxFront(w, h), x, G - h, w, h, zf, 'box'); }
  function scenery(pid) {
    var p = PLACES.filter(function (q) { return q[0] === pid; })[0], ref = p ? p[1] : 'table', h = '';
    if (ref === 'table') h += piece(table(), 660, G - 230, 460, 230, 3, 'table');
    else if (ref === 'boxes') h += piece(boxBack(260), 450, G - 220, 260, 34, 1, 'boxes') + piece(boxFront(240, 190), 450, G - 190, 240, 190, 3, 'boxes') +
      piece(boxBack(260), 1090, G - 220, 260, 34, 1, 'boxes') + piece(boxFront(240, 190), 1090, G - 190, 240, 190, 3, 'boxes');
    else if (ref === 'box') h += crate(740, 300, 230, 1, 3);
    else if (ref === 'tree') h += piece(WU.pic('tree'), 720, G - 340, 340, 340, 2, 'tree');
    else if (ref === 'house') h += piece(WU.pic('house'), pid === 'past' ? 710 : 1250, G - 360, 360, 360, 2, 'house');
    else if (ref === 'road') h += piece('<div class="wsroad"><i></i></div>', 0, 300, 1780, 300, 1, 'road');
    else if (ref === 'tunnel') h += piece('<svg viewBox="0 0 640 300" width="640" height="300"><path d="M3 297 C 80 40, 560 40, 637 297 Z" fill="#33c24d" stroke="' + K + '" stroke-width="6"></path>' +
      '<path d="M40 297 v-90 a60 60 0 0 1 120 0 v90 Z M480 297 v-90 a60 60 0 0 1 120 0 v90 Z" fill="#1d1d1d" stroke="' + K + '" stroke-width="5"></path></svg>', 570, G - 300, 640, 300, 3, 'tunnel');
    else if (ref === 'hill') h += piece('<svg viewBox="0 0 800 380" width="800" height="380"><polygon points="3,377 400,6 797,377" fill="#33c24d" stroke="' + K + '" stroke-width="6"></polygon></svg>', 700, G - 380, 800, 380, 1, 'hill');
    return h;
  }

  /* ---------- where the mover stands (still) or the path it takes (moving): [left, top, scale, z] ---------- */
  var SPOT = {
    in: [815, 210, 1, 2], on: [815, 172, 1, 4], under: [815, G - M, 1, 4], next: [1160, G - M, 1, 4], behind: [985, 178, 0.85, 0],
    front: [790, G - M + 26, 1.12, 5], between: [815, G - M, 1, 4], above: [815, 30, 1, 4]
  };
  var PATH = {
    into: [[280, G - M, 1, 5], [560, 40, 1, 5, 0.6], [815, 210, 1, 2]],
    outof: [[815, 210, 1, 2], [1080, 40, 1, 5, 0.4], [1350, G - M, 1, 5]],
    over: [[260, G - M, 1, 5], [815, -10, 1, 5], [1370, G - M, 1, 5]],
    around: [[520, G - M + 10, 1, 5], [815, G - M + 30, 1.1, 5], [1110, G - M + 10, 1, 5], [815, 300, 0.75, 0], [520, G - M + 10, 1, 5]],
    past: [[120, G - M + 20, 1, 5], [1520, G - M + 20, 1, 5]],
    towards: [[120, G - M + 20, 1, 5], [1060, G - M + 20, 1, 5]],
    away: [[1060, G - M + 20, 1, 5], [120, G - M + 20, 1, 5]],
    across: [[815, 440, 1.2, 5], [815, 290, 0.7, 5]],
    through: [[200, G - M, 1, 5], [470, G - M, 1, 1], [1350, G - M, 1, 1], [1430, G - M, 1, 5]],
    up: [[600, G - M, 1, 5], [1025, 20, 1, 5]],
    down: [[1025, 20, 1, 5], [1420, G - M, 1, 5]]
  };
  function style(s) { return 'left:' + s[0] + 'px;top:' + s[1] + 'px;transform:scale(' + s[2] + ');z-index:' + s[3]; }
  function play() {
    if (anim) { try { anim.cancel(); } catch (e) {} anim = null; }
    var p = place(), el = box && box.querySelector('.wsmover'); if (!p || !p.move || !el) return;
    var path = PATH[p.id], n = path.length;
    if (WU.isCalm() || !el.animate) return;
    anim = el.animate(path.map(function (s, i) {
      return { left: s[0] + 'px', top: s[1] + 'px', transform: 'scale(' + s[2] + ')', zIndex: s[3], offset: s[4] != null ? s[4] : i / (n - 1) };
    }), { duration: 900 + 650 * n, easing: 'ease-in-out', fill: 'forwards' });
    WU.sound.pop();
  }

  function sentence(plain) {
    var S = scr.get(), p = place(), m = mover(); if (!p || !m) return '';
    var prep = S['w_' + p.id] || NAMES[p.id], ref = S['r_' + p.ref] || '';
    var t = String(p.move ? S.move : S.place);
    if (plain) return kit.fill(t, { thing: m.word, prep: prep, ref: ref });
    return WU.esc(t).replace(/\{(\w+)\}/g, function (x, k) { return k === 'prep' ? '<em>' + WU.esc(prep) + '</em>' : k === 'thing' ? WU.esc(m.word) : k === 'ref' ? WU.esc(ref) : x; });
  }

  function newRound() {
    var m = deck(movers()), ps = places(), p = ps.length ? pdeck(ps) : null;
    st.mid = m ? m.id : null; st.pid = p ? p.id : null;
  }
  function render() {
    var S = scr.get(), ph = st.phase, h = '', p = place(), m = mover();
    var q = p && m ? kit.fill(p.move ? S.askMove : S.ask, { thing: m.word }) : '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#ff4fc3') + (q ? '<div class="gpill alt wsq"' + scr.ea(p.move ? 'askMove' : 'ask') + '>' + WU.esc(q) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (+S.seconds > 0) h += bar.html();
    h += '<div class="wsscene"><div class="wsground"></div>';
    if (p && m) {
      var s = p.move ? PATH[p.id][PATH[p.id].length - 1] : SPOT[p.id];
      h += scenery(p.id) + '<div class="wsmover" style="' + style(p.move && !WU.isCalm() ? PATH[p.id][0] : s) + '" data-edit="where:movers:' + m.id + ':pic">' + WU.pic(m.pic) + '</div>';
    }
    h += '</div><div class="wsbottom">';
    if (ph === 'reveal') h += gram.answer('', '', sentence(false), ' data-auto');
    else {
      h += '<div class="brow">' + gram.who(S.who, scr.ea('who'), st.who) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    var a = box.querySelector('.gans-t'); if (a) kit.fit(a, 64, 36);
    bar.redraw(box);
    // Moving: play the path; after the reveal it stays where it ended.
    if (p && p.move) { if (ph === 'ask') play(); else { var el = box.querySelector('.wsmover'); if (el) el.setAttribute('style', style(PATH[p.id][PATH[p.id].length - 1])); } }
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], p = place(), mv = p && p.move ? [['R', 'move again']] : [];
    var hs = st.phase === 'ask' ? [['SPACE', 'reveal']].concat(mv, [['N', 'other place'], ['P', 'other student'], ['Esc', 'home']])
      : [['SPACE', 'next']].concat(mv, [['Esc', 'home']]);
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function ask() {
    var S = scr.get(); st.phase = 'ask'; st.who = kit.student(st.who ? [st.who] : null); render();
    bar.start(box, Math.max(0, Math.min(30, +S.seconds || 0)), function () { if (st && st.phase === 'ask') render(); });
  }
  function reveal() { bar.stop(); if (anim) { try { anim.finish(); } catch (e) {} } st.phase = 'reveal'; WU.sound.ding(); render(); }
  function next() { st.demo = false; newRound(); ask(); }
  function replay() {
    var p = place(), el = box.querySelector('.wsmover'); if (!p || !p.move || !el) return;
    el.setAttribute('style', style(PATH[p.id][0])); play();
  }
  function refresh() {
    if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow;
    if (!mover() || !places().some(function (p) { return p.id === st.pid; })) newRound();
    render();
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ask') reveal(); else next(); }
    else if (k === 'N') { if (ph === 'ask') { st.moved = true; st.demo = false; newRound(); WU.sound.clack(); ask(); } }
    else if (k === 'R') replay();
    else if (k === 'P') { if (ph === 'ask') { st.who = kit.student([st.who]); WU.sound.clack(); var w = box.querySelector('.wsbottom .gwho b'); if (w) w.textContent = st.who; else render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.where = {
    title: 'Hide & Seek Cat',
    teacher: function () {
      if (!st || !place()) return null;
      return { secret: [{ label: 'Answer', text: sentence(true), big: true }], info: [{ label: 'Student', text: st.who || '' }] };
    },
    help: function () { return [['Space', 'reveal / next'], ['N', 'other place'], ['R', 'move again (moving places)'], ['P', 'other student'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'wsg', 'Hide & Seek Cat', 'where-sb'); box = sh.box;
      st = { phase: 'ask', demo: !!scr.get().demoShow, who: null };
      newRound(); ask();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && st.phase === 'reveal') render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (anim) { try { anim.cancel(); } catch (e) {} } anim = null; if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', r: 'R', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
