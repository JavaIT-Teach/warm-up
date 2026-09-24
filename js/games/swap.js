/* Warm Up: SPEED SWAP (for a U-shaped room: nobody moves seats, students talk only to their neighbours).
   Setup: label students around the U: A, B, A, B...
   The rounds follow an editable cycle, by default: pair (B on your RIGHT), pair (B on your LEFT), group of 4.
   Pair rounds: who asks first alternates (A asks B, then B asks A); at half time a SWITCH swaps the roles.
   Group rounds: a chain (left end starts; answer, then ask the next person; the last asks the first).
   Buzzer -> SWAP! -> next instruction with its picture -> next question. Space starts each round.
   Keys: Space begin / start / swap now / next round, Enter pause / go, N other question, R start again.
   Content: content/swap.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var KIND_COL = { right: '#c6ff00', left: '#ff4fc3', group: '#ffe600', none: '#ffffff' };

  var scr = kit.screen({
    game: 'swap', title: 'Speed Swap', content: function () { return WU.content.swapScreen; },
    fields: [
      { type: 'head', label: 'Rounds' },
      { k: 'rounds', label: 'Number of rounds', type: 'num', min: 1, max: 20, hint: 'The round cycle (its own list) repeats until the last round.' },
      { k: 'secs', label: 'Round length (seconds)', type: 'num', min: 15, max: 600 },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'round', label: 'Round counter ({n}, {total})', type: 'text', max: 30 },
      { type: 'head', label: 'Setup screen' },
      { k: 'setupTag', label: 'Tag', type: 'text', max: 20 },
      { k: 'setup', label: 'Setup line', type: 'text', max: 70 },
      { type: 'head', label: 'Pair rounds' },
      { k: 'askA', label: 'Odd pair rounds: who asks first', type: 'text', max: 40 },
      { k: 'askB', label: 'Even pair rounds: who asks first', type: 'text', max: 40 },
      { k: 'switchOn', label: 'SWITCH at half time', type: 'bool', on: 'On', off: 'Off' },
      { k: 'switchA', label: 'SWITCH line when A asked first', type: 'text', max: 40 },
      { k: 'switchB', label: 'SWITCH line when B asked first', type: 'text', max: 40 },
      { type: 'head', label: 'Group rounds' },
      { k: 'chain', label: 'Chain line', type: 'text', max: 140 },
      { type: 'head', label: 'Every round' },
      { k: 'noPartner', label: 'No-partner line (empty = hide)', type: 'text', max: 60 },
      { k: 'ready', label: 'Before a round starts', type: 'text', max: 40 },
      { k: 'frame', label: 'Answer frame for every question at this level (empty = none)', type: 'text', max: 60, hint: 'A question can have its own frame.' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { type: 'head', label: 'Swap and end' },
      { k: 'swap', label: 'Swap word', type: 'text', max: 10 },
      { k: 'endTag', label: 'End tag', type: 'text', max: 20 },
      { k: 'end', label: 'End line ({total})', type: 'text', max: 70 }
    ]
  });
  function qFields() {
    return [
      { k: 'text', label: 'Question', type: 'text', max: 110 },
      { k: 'sub', label: 'Small tag (e.g. PART 1; empty = hide)', type: 'text', max: 16 },
      { k: 'pic', label: 'Picture', type: 'pic' },
      { k: 'frame', label: 'Answer frame for this question', type: 'text', max: 60,
        ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; }, hint: 'Use ___ for the gap. Empty = the level\'s frame.' }
    ];
  }
  function normQ(r) { return { text: r.text || '', sub: r.sub || '', pic: r.pic || '', frame: r.frame || '' }; }
  var blankQ = function () { return { text: 'New question?', sub: '', pic: '', frame: '' }; };
  WU.registerList('swap', 'questions', { gameTitle: 'Speed Swap', label: 'Questions', defaults: function (l) { return WU.content.swap[l].questions; }, norm: normQ, fields: qFields, blank: blankQ });
  WU.registerList('swap', 'first', { gameTitle: 'Speed Swap', label: 'First-lesson questions', defaults: function (l) { return WU.content.swap[l].first; }, norm: normQ, fields: qFields, blank: blankQ });
  WU.registerList('swap', 'cycle', {
    gameTitle: 'Speed Swap', label: 'Round cycle',
    defaults: function (l) { return WU.content.swapCycle[l]; },
    norm: function (r) { return { kind: r.kind === 'group' ? 'group' : 'pair', icon: r.icon || 'none', order: +r.order || 0, text: r.text || '' }; },
    title: function (it) { return (it.order || '?') + '. ' + (it.kind === 'group' ? 'GROUP: ' : 'PAIR: ') + it.text; },
    fields: function () {
      return [
        { k: 'order', label: 'Position in the cycle (1 = first; change it to reorder)', type: 'num', min: 1, max: 20 },
        { k: 'kind', label: 'Round type', type: 'select', options: [['pair', 'Pair round (A / B, SWITCH at half time)'], ['group', 'Group round (chain)']] },
        { k: 'text', label: 'Instruction', type: 'text', max: 70 },
        { k: 'icon', label: 'Picture', type: 'select', options: [['right', 'Arrow right'], ['left', 'Arrow left'], ['group', 'Group of 4'], ['none', '(none)']] }
      ];
    },
    blank: function () { return { kind: 'pair', icon: 'right', order: 9, text: 'A: talk to the B on your RIGHT' }; }
  });

  var root, box, st, sb = null, clock = null, offContent = null, timers = [], watch = null;
  var deck = kit.deck();

  /* ---------- drawings (app-drawn, no emoji) ---------- */
  function icon(k, size) {
    var s = size || 120, K = '#0d0d0d';
    if (k === 'right' || k === 'left') {
      var pts = k === 'right' ? '8,44 78,44 78,16 124,60 78,104 78,76 8,76' : '124,44 54,44 54,16 8,60 54,104 54,76 124,76';
      return '<svg viewBox="0 0 132 120" width="' + s + '" height="' + s + '"><polygon points="' + pts + '" fill="' + K + '"></polygon></svg>';
    }
    if (k === 'group') {
      var c = function (x, y, f) { return '<circle cx="' + x + '" cy="' + y + '" r="22" fill="' + f + '" stroke="' + K + '" stroke-width="6"></circle>'; };
      return '<svg viewBox="0 0 132 120" width="' + s + '" height="' + s + '"><rect x="36" y="34" width="60" height="52" rx="6" fill="#fff" stroke="' + K + '" stroke-width="6"></rect>' +
        c(34, 28, '#3d6bff') + c(98, 28, '#ff4fc3') + c(34, 92, '#ff5a1f') + c(98, 92, '#00e5c7') + '</svg>';
    }
    return '';
  }
  // A -> B badge for the ask line.
  function badge(first) {
    var other = first === 'A' ? 'B' : 'A', b = function (x, t, f) {
      return '<circle cx="' + x + '" cy="40" r="32" fill="' + f + '" stroke="#0d0d0d" stroke-width="6"></circle><text x="' + x + '" y="54" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="40" fill="#0d0d0d">' + t + '</text>';
    };
    return '<svg viewBox="0 0 200 80" width="150" height="60">' + b(38, first, '#c6ff00') + '<polygon points="80,32 128,32 128,18 156,40 128,62 128,48 80,48" fill="#0d0d0d"></polygon>' + b(162, other, '#fff') + '</svg>';
  }
  // The U: board at the top, seats around three sides labelled A, B, A, B...
  function uDrawing() {
    var seats = [], i, x, y, n = 0, h = '';
    for (i = 0; i < 4; i++) seats.push([70, 90 + i * 70]);
    for (i = 0; i < 7; i++) seats.push([70 + i * 110, 390]);
    for (i = 3; i >= 0; i--) seats.push([730, 90 + i * 70]);
    // Corners appear twice; drop duplicates.
    var seen = {};
    seats = seats.filter(function (p) { var k = p[0] + ',' + p[1]; if (seen[k]) return false; seen[k] = 1; return true; });
    h += '<svg viewBox="0 0 800 450" width="800" height="450"><rect x="260" y="8" width="280" height="40" fill="#0d0d0d"></rect>' +
      '<path d="M70 70 V390 H730 V70" fill="none" stroke="#0d0d0d" stroke-width="10" stroke-dasharray="4 16" stroke-linecap="round"></path>';
    seats.forEach(function (p) {
      var a = n++ % 2 === 0;
      h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="30" fill="' + (a ? '#c6ff00' : '#fff') + '" stroke="#0d0d0d" stroke-width="6"></circle>' +
        '<text x="' + p[0] + '" y="' + (p[1] + 14) + '" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="38" fill="#0d0d0d">' + (a ? 'A' : 'B') + '</text>';
    });
    return h + '</svg>';
  }

  /* ---------- rounds ---------- */
  function cycle() {
    var l = WU.list('swap', 'cycle', WU.state.level).map(function (it, i) { it._i = i; return it; });
    l.sort(function (a, b) { return (a.order || 99) - (b.order || 99) || a._i - b._i; });
    return l.length ? l : [{ id: 'none', kind: 'pair', icon: 'none', text: '' }];
  }
  function roundOf(n) { var c = cycle(); return c[(n - 1) % c.length]; }
  // Pair rounds counted so far (1 = the first pair round): odd = A asks first, even = B asks first.
  function pairIndex(n) { var k = 0; for (var i = 1; i <= n; i++) if (roundOf(i).kind === 'pair') k++; return k; }
  function firstAsker(n) { return pairIndex(n) % 2 === 1 ? 'A' : 'B'; }

  function listName() { return WU.state.lesson === 'first' && WU.list('swap', 'first', WU.state.level).length ? 'first' : 'questions'; }
  function q() { return st.q ? WU.list('swap', st.q.list, WU.state.level).filter(function (x) { return x.id === st.q.id; })[0] || null : null; }
  function total() { return Math.max(1, Math.min(20, +scr.get().rounds || 5)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; clearInterval(watch); watch = null; }
  // The next question is drawn in advance so the Teacher screen can show it.
  function draw() { var ln = listName(), it = deck(WU.list('swap', ln, WU.state.level)); return it ? { list: ln, id: it.id } : null; }
  function newQuestion() {
    var up = st.upcoming, ok = up && up.list === listName() && WU.list('swap', up.list, WU.state.level).some(function (x) { return x.id === up.id; });
    st.q = ok ? up : draw(); st.upcoming = draw();
  }

  /* ---------- drawing ---------- */
  function askLine(S) {
    var r = roundOf(st.n);
    if (r.kind === 'group') return S.chain ? '<div class="ask group"' + scr.ea('chain') + '>' + WU.esc(S.chain) + '</div>' : '';
    var first = firstAsker(st.n), now = st.switched ? (first === 'A' ? 'B' : 'A') : first;
    var key = st.switched ? (first === 'A' ? 'switchA' : 'switchB') : (first === 'A' ? 'askA' : 'askB');
    return S[key] ? '<div class="ask' + (st.switched ? ' sw2' : '') + '"><span class="badge">' + badge(now) + '</span><span' + scr.ea(key) + '>' + WU.esc(S[key]) + '</span></div>' : '';
  }
  function render() {
    var S = scr.get(), ph = st.phase, h = '', it = q();
    if (ph === 'setup') {
      h += '<div class="setup">' + kit.chip(S.setupTag, scr.ea('setupTag'), '#00e5c7') +
        (S.setup ? '<div class="setl"' + scr.ea('setup') + '>' + WU.esc(S.setup) + '</div>' : '') +
        '<div class="udraw" data-auto>' + uDrawing() + '</div>' +
        '<div class="brow">' + (S.noPartner ? '<div class="nop"' + scr.ea('noPartner') + '>' + WU.esc(S.noPartner) + '</div>' : '') +
        '<div class="btn" data-ctrl data-b="begin"><span class="key">SPACE</span><span>Begin</span></div></div></div>';
    } else if (ph === 'swap') {
      h += '<div class="swapbig"><div class="sw"' + scr.ea('swap') + '>' + WU.esc(S.swap) + '</div></div>';
    } else if (ph === 'end') {
      h += '<div class="swapbig">' + kit.chip(S.endTag, scr.ea('endTag'), '#00e5c7') + '<div class="endl"' + scr.ea('end') + '>' + WU.esc(kit.fill(S.end, { total: st.n })) + '</div>' +
        '<div class="acts" data-ctrl><div class="btn" data-b="again"><span class="key">R</span><span>Start again</span></div></div></div>';
    } else {
      var r = roundOf(st.n);
      h += '<div class="shead">' + kit.chip(S.tag, scr.ea('tag'), '#00e5c7') + (S.round ? '<div class="rnd"' + scr.ea('round') + '>' + WU.esc(kit.fill(S.round, { n: st.n, total: total() })) + '</div>' : '') +
        (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
      if (r.text || r.icon !== 'none') {
        h += '<div class="instr' + (ph === 'ready' ? ' fresh' : '') + '" style="background:' + (KIND_COL[r.icon] || '#fff') + '">' +
          (r.icon !== 'none' ? '<div class="ic" data-edit="swap:cycle:' + r.id + ':icon">' + icon(r.icon, 110) + '</div>' : '') +
          '<div class="it" data-edit="swap:cycle:' + r.id + ':text">' + WU.esc(r.text) + '</div></div>';
      }
      if (it) {
        var ek = function (f) { return ' data-edit="swap:' + st.q.list + ':' + it.id + ':' + f + '"'; };
        h += '<div class="sq">' + (it.pic ? '<div class="qpic"' + ek('pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
          '<div class="qcol">' + (it.sub ? '<div class="qsub"' + ek('sub') + '>' + WU.esc(it.sub) + '</div>' : '') + '<div class="qt"' + ek('text') + '>' + WU.esc(it.text) + '</div></div></div>';
      }
      h += '<div class="sbottom"><div class="sleft">' + askLine(S) + '<div class="brow">';
      if (it && it.frame) h += kit.frame(it.frame, ' data-edit="swap:' + st.q.list + ':' + it.id + ':frame"');
      else if (S.frame) h += kit.frame(S.frame, scr.ea('frame'));
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      h += '</div>' + (S.noPartner ? '<div class="nop"' + scr.ea('noPartner') + '>' + WU.esc(S.noPartner) + '</div>' : '') + '</div><div class="tslot">';
      if (ph === 'ready') h += '<div class="btn go" data-ctrl data-b="start"><span class="key">SPACE</span><span>Start</span></div>' + (S.ready ? '<div class="rdy"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div>' : '');
      h += '</div></div>';
      if (st.flash) {
        var first = firstAsker(st.n), k2 = first === 'A' ? 'switchA' : 'switchB';
        if (S[k2]) h += '<div class="switchbig"' + scr.ea(k2) + '>' + WU.esc(S[k2]) + '</div>';
      }
    }
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph === 'talk') box.querySelector('.tslot').appendChild(clock.el);
    var qt = box.querySelector('.qt'); if (qt) kit.fit(qt, 100, 48);
    var ins = box.querySelector('.instr .it'); if (ins) kit.fit(ins, 64, 44);
    var ask = box.querySelector('.ask.group'); if (ask) kit.fit(ask, 48, 40);
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function () { keyAction(b.getAttribute('data-b') === 'again' ? 'R' : 'SPACE'); }; });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'setup' ? [['SPACE', 'begin'], ['Esc', 'home']].concat(sc)
      : ph === 'ready' ? [['SPACE', 'start the round'], ['N', 'other question'], ['R', 'start again'], ['Esc', 'home']].concat(sc)
      : ph === 'talk' ? [['ENTER', 'pause / go'], ['SPACE', 'swap now'], ['Esc', 'home']].concat(sc)
      : ph === 'swap' ? [['SPACE', 'next round'], ['Esc', 'home']] : [['R', 'start again'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, keyAction);
  }

  /* ---------- flow ---------- */
  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock(); clearT();
    if (clock) clock.destroy();
    var S = scr.get();
    clock = WU.Timer({ seconds: Math.max(15, +S.secs || 90), size: 300, onDone: function () { timers.push(setTimeout(swap, 900)); } });
    st.phase = 'talk'; st.switched = false; st.flash = false; render(); clock.start();
    // Pair rounds: SWITCH at exactly half time (pausing the timer delays it too).
    if (roundOf(st.n).kind === 'pair' && S.switchOn) {
      watch = setInterval(function () {
        if (!st || !clock || st.switched) return;
        if (clock.left() <= clock.total / 2) {
          clearInterval(watch); watch = null;
          st.switched = true; st.flash = true; WU.sound.ding(); render();
          timers.push(setTimeout(function () { if (st && st.phase === 'talk') { st.flash = false; render(); } }, WU.isCalm() ? 1500 : 3000));
        }
      }, 100);
    }
  }
  function swap() {
    if (st.phase !== 'talk') return;
    clearT(); if (clock) { clock.destroy(); clock = null; }
    st.demo = false; st.flash = false;
    if (st.n >= total()) { st.phase = 'end'; WU.sound.ding(); render(); return; }
    st.phase = 'swap'; WU.sound.buzzer(); WU.sound.slam(); render();
    // Then the next instruction (with its picture) and the next question appear by themselves.
    timers.push(setTimeout(next, WU.isCalm() ? 1200 : 2200));
  }
  function next() {
    if (st.phase !== 'swap') return;
    clearT(); st.n++; st.switched = false; newQuestion(); st.phase = 'ready'; WU.sound.pop(); render();
  }
  function restart() {
    clearT(); if (clock) { clock.destroy(); clock = null; }
    st.n = 1; st.switched = false; st.flash = false; st.phase = 'setup'; newQuestion(); render();
  }
  function refresh() {
    if (!st) return;
    if ((st.phase === 'setup' || st.phase === 'ready') && st.n === 1 && !st.started) st.demo = !!scr.get().demoShow;
    if (st.q && !q()) newQuestion();
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('swap-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') {
      if (ph === 'setup') { st.phase = 'ready'; WU.sound.pop(); render(); }
      else if (ph === 'ready') { st.started = true; start(); } else if (ph === 'talk') swap(); else if (ph === 'swap') next();
    }
    else if (k === 'ENTER') { if (ph === 'talk' && clock) clock.toggle(); }
    else if (k === 'N') { if (ph === 'ready') { newQuestion(); render(); } }
    else if (k === 'R') restart();
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.swap = {
    title: 'Speed Swap',
    teacher: function () {
      if (!st) return null;
      var S = scr.get(), sec = [], info = [], it = q(), up = st.upcoming && WU.list('swap', st.upcoming.list, WU.state.level).filter(function (x) { return x.id === st.upcoming.id; })[0];
      if (st.phase === 'setup') info.push({ label: 'Setup', text: S.setup });
      else if (st.phase !== 'end') {
        var r = roundOf(st.n);
        info.push({ label: 'Round ' + st.n + ' of ' + total() + (r.kind === 'group' ? ' (group)' : ' (pair)'), text: r.text, big: true });
        if (r.kind === 'group') info.push({ label: 'How they talk', text: S.chain });
        else {
          var first = firstAsker(st.n);
          info.push({ label: 'Who asks', text: (first === 'A' ? S.askA : S.askB) + (S.switchOn ? (st.switched ? '   SWITCHED: ' + (first === 'A' ? S.switchA : S.switchB) : '   (SWITCH at half time)') : '') });
        }
        if (it) info.push({ label: 'Question now', text: it.text });
      } else info.push({ label: 'End', text: S.end });
      if (st.n < total() && st.phase !== 'end') {
        var nr = roundOf(st.n + 1);
        sec.push({ label: 'Next round (after the swap)', text: nr.text + (nr.kind === 'pair' ? '  |  ' + (firstAsker(st.n + 1) === 'A' ? S.askA : S.askB) : '') });
        if (up) sec.push({ label: 'Next question', text: up.text });
      }
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'begin / start / swap now / next round'], ['Enter', 'pause / go'], ['N', 'another question'], ['R', 'start again'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'setup', n: 1, q: null, demo: !!scr.get().demoShow, switched: false, flash: false };
      el.innerHTML = '<div class="swapg"><div class="layer"></div>' + kit.header('Speed Swap') + '<div class="hints"></div></div>';
      box = el.querySelector('.swapg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('swap-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newQuestion(); render();
      // Measure text again once the bundled fonts have loaded.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { n: 'N', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
