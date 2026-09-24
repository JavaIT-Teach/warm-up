/* Warm Up: SPEED SWAP.
   Everyone talks in pairs about the question on screen. Buzzer: one row moves one seat along, SWAP!, next question.
   Keys: Space start / next round, Enter pause / go, N other question, R start again.
   Content: content/swap.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'swap', title: 'Speed Swap', content: function () { return WU.content.swapScreen; },
    fields: [
      { type: 'head', label: 'Rounds' },
      { k: 'rounds', label: 'Number of rounds', type: 'num', min: 1, max: 20 },
      { k: 'secs', label: 'Round length (seconds)', type: 'num', min: 15, max: 600 },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'round', label: 'Round counter ({n}, {total})', type: 'text', max: 30 },
      { k: 'ready', label: 'Before a round starts', type: 'text', max: 40 },
      { type: 'head', label: 'While talking' },
      { k: 'frame', label: 'Answer frame for every question at this level (empty = none)', type: 'text', max: 60, hint: 'A question can have its own frame.' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 50 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { type: 'head', label: 'Swap and end' },
      { k: 'swap', label: 'Swap word', type: 'text', max: 10 },
      { k: 'swapLine', label: 'Who moves', type: 'text', max: 60 },
      { k: 'endTag', label: 'End tag', type: 'text', max: 20 },
      { k: 'end', label: 'End line ({total})', type: 'text', max: 60 }
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

  var root, box, st, sb = null, clock = null, offContent = null, timers = [];
  var deck = kit.deck();

  function listName() { return WU.state.lesson === 'first' && WU.list('swap', 'first', WU.state.level).length ? 'first' : 'questions'; }
  function q() { return st.q ? WU.list('swap', st.q.list, WU.state.level).filter(function (x) { return x.id === st.q.id; })[0] || null : null; }
  function total() { return Math.max(1, Math.min(20, +scr.get().rounds || 5)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newQuestion() { var ln = listName(), it = deck(WU.list('swap', ln, WU.state.level)); st.q = it ? { list: ln, id: it.id } : null; }

  function render() {
    var S = scr.get(), ph = st.phase, h = '', it = q();
    if (ph === 'swap') {
      h += '<div class="swapbig"><div class="sw"' + scr.ea('swap') + '>' + WU.esc(S.swap) + '</div>' +
        (S.swapLine ? '<div class="swl"' + scr.ea('swapLine') + '>' + WU.esc(S.swapLine) + '</div>' : '') + '<div class="arrows">' +
        '<svg viewBox="0 0 600 120" width="600" height="120"><g fill="#0d0d0d"><polygon points="0,40 420,40 420,0 600,60 420,120 420,80 0,80"></polygon></g></svg></div></div>';
    } else if (ph === 'end') {
      h += '<div class="swapbig">' + kit.chip(S.endTag, scr.ea('endTag'), '#00e5c7') + '<div class="endl"' + scr.ea('end') + '>' + WU.esc(kit.fill(S.end, { total: st.n })) + '</div>' +
        '<div class="acts" data-ctrl><div class="btn" data-b="again"><span class="key">R</span><span>Start again</span></div></div></div>';
    } else {
      h += '<div class="shead">' + kit.chip(S.tag, scr.ea('tag'), '#00e5c7') + (S.round ? '<div class="rnd"' + scr.ea('round') + '>' + WU.esc(kit.fill(S.round, { n: st.n, total: total() })) + '</div>' : '') +
        (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
      if (it) {
        var ek = function (f) { return ' data-edit="swap:' + st.q.list + ':' + it.id + ':' + f + '"'; };
        h += '<div class="sq">' + (it.pic ? '<div class="qpic"' + ek('pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
          '<div class="qcol">' + (it.sub ? '<div class="qsub"' + ek('sub') + '>' + WU.esc(it.sub) + '</div>' : '') + '<div class="qt"' + ek('text') + '>' + WU.esc(it.text) + '</div></div></div>';
      }
      h += '<div class="sbottom"><div class="sleft">';
      if (it && it.frame) h += kit.frame(it.frame, ' data-edit="swap:' + st.q.list + ':' + it.id + ':frame"');
      else if (S.frame) h += kit.frame(S.frame, scr.ea('frame'));
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      if (ph === 'ready') h += '<div class="brow">' + (S.ready ? '<div class="rule hot"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div>' : '') +
        '<div class="btn" data-ctrl data-b="start"><span class="key">SPACE</span><span>Start</span></div></div>';
      h += '</div><div class="tslot"></div></div>';
    }
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph === 'talk') box.querySelector('.tslot').appendChild(clock.el);
    var qt = box.querySelector('.qt'); if (qt) kit.fit(qt, 110, 48);
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function () { keyAction(b.getAttribute('data-b') === 'again' ? 'R' : 'SPACE'); }; });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['SPACE', 'start the round'], ['N', 'other question'], ['R', 'start again'], ['Esc', 'home']].concat(sc)
      : ph === 'talk' ? [['ENTER', 'pause / go'], ['SPACE', 'swap now'], ['Esc', 'home']].concat(sc)
      : ph === 'swap' ? [['SPACE', 'next round'], ['Esc', 'home']] : [['R', 'start again'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, keyAction);
  }

  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock(); clearT();
    if (clock) clock.destroy();
    clock = WU.Timer({ seconds: Math.max(15, +scr.get().secs || 90), size: 260, onDone: function () { timers.push(setTimeout(swap, 900)); } });
    st.phase = 'talk'; render(); clock.start();
  }
  function swap() {
    if (st.phase !== 'talk') return;
    clearT(); if (clock) { clock.destroy(); clock = null; }
    st.demo = false;
    if (st.n >= total()) { st.phase = 'end'; WU.sound.ding(); render(); return; }
    st.phase = 'swap'; WU.sound.buzzer(); WU.sound.slam(); render();
    // The next question appears by itself after the swap.
    timers.push(setTimeout(next, WU.isCalm() ? 1500 : 3000));
  }
  function next() {
    if (st.phase !== 'swap') return;
    clearT(); st.n++; newQuestion(); st.phase = 'ready'; WU.sound.pop(); render();
  }
  function restart() {
    clearT(); if (clock) { clock.destroy(); clock = null; }
    st.n = 1; st.phase = 'ready'; newQuestion(); render();
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready' && st.n === 1 && !st.started) st.demo = !!scr.get().demoShow;
    if (st.q && !q()) newQuestion();
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('swap-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') { st.started = true; start(); } else if (ph === 'talk') swap(); else if (ph === 'swap') next(); }
    else if (k === 'ENTER') { if (ph === 'talk' && clock) clock.toggle(); }
    else if (k === 'N') { if (ph === 'ready') { newQuestion(); render(); } }
    else if (k === 'R') restart();
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.swap = {
    title: 'Speed Swap',
    help: function () { return [['Space', 'start / swap now / next round'], ['Enter', 'pause / go'], ['N', 'another question'], ['R', 'start again'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', n: 1, q: null, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="swapg"><div class="layer"></div>' + kit.header('Speed Swap') + '<div class="hints"></div></div>';
      box = el.querySelector('.swapg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('swap-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newQuestion(); render();
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
