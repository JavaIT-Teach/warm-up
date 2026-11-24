/* Warm Up: TRUTH OR DARE (all levels). The party game as a speaking game: no embarrassing truths, every dare is a speaking task.
   P picks a student. They choose: T = TRUTH (a question about them, with an answer frame) or D = DARE (a short speaking task).
   The timer starts by itself. X = swap once (truth to dare or dare to truth). Space: the class asks a follow-up question
   (after a truth) or gives a thumbs up (after a dare). Space: next player.
   Keys: P pick, T / Left truth, D / Right dare, X swap, N another card, Enter pause, Space next step.
   Content: content/truth.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'truth', title: 'Truth or Dare', content: function () { return WU.content.truthScreen; },
    fields: [
      { type: 'head', label: 'Choosing' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'who', label: 'Before a student is picked', type: 'text', max: 40 },
      { k: 'qMark', label: 'Shown before a student is picked', type: 'text', max: 4 },
      { k: 'choose', label: 'The question ({name})', type: 'text', max: 50 },
      { k: 'truthLabel', label: 'TRUTH label', type: 'text', max: 12 },
      { k: 'truthSub', label: 'Under TRUTH', type: 'text', max: 50 },
      { k: 'dareLabel', label: 'DARE label', type: 'text', max: 12 },
      { k: 'dareSub', label: 'Under DARE', type: 'text', max: 50 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first turn only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo turn', type: 'bool', on: 'On', off: 'Off', hint: 'The teacher plays first.' },
      { k: 'demoWho', label: 'Name in the demo turn', type: 'text', max: 16 },
      { type: 'head', label: 'The card' },
      { k: 'truthSecs', label: 'Time to answer a truth (seconds)', type: 'num', min: 10, max: 180 },
      { k: 'dareSecs', label: 'Time for a dare without its own time (seconds)', type: 'num', min: 10, max: 180 },
      { k: 'frame', label: 'Answer frame for a truth without its own (empty = none)', type: 'text', max: 60 },
      { k: 'frameShow', label: 'Answer frames', type: 'bool' },
      { k: 'swapped', label: 'After a swap (X)', type: 'text', max: 20 },
      { type: 'head', label: 'After the card' },
      { k: 'follow', label: 'After a truth ({name})', type: 'text', max: 90 }, { k: 'followShow', label: 'After a truth', type: 'bool' },
      { k: 'done', label: 'After a dare ({name})', type: 'text', max: 60 },
      { k: 'next', label: 'Next player line', type: 'text', max: 30 }
    ]
  });
  WU.registerList('truth', 'truths', {
    gameTitle: 'Truth or Dare', label: 'Truths (questions)',
    defaults: function (l) { return WU.content.truth[l].truths; },
    norm: function (r) { return { text: r.text || '', frame: r.frame || '' }; },
    fields: function () {
      return [
        { k: 'text', label: 'Question', type: 'text', max: 110 },
        { k: 'frame', label: 'Answer frame', type: 'text', max: 90, ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; }, hint: 'Use ___ for the gap. Empty = the level frame.' }
      ];
    },
    blank: function () { return { text: 'What ___?', frame: '' }; }
  });
  WU.registerList('truth', 'dares', {
    gameTitle: 'Truth or Dare', label: 'Dares (speaking tasks)',
    defaults: function (l) { return WU.content.truth[l].dares; },
    norm: function (r) { return { text: r.text || '', secs: +r.secs || 0 }; },
    title: function (it) { return it.text + (it.secs ? '  (' + it.secs + 's)' : ''); },
    fields: function () {
      return [
        { k: 'text', label: 'Dare (a speaking task, done from the seat)', type: 'text', max: 140 },
        { k: 'secs', label: 'Time in seconds (0 = the level time)', type: 'num', min: 0, max: 180 }
      ];
    },
    blank: function () { return { text: 'Say ___.', secs: 0 }; }
  });

  var root, box, st, sb = null, clock = null, offContent = null, timers = [];
  var deckT = kit.deck(), deckD = kit.deck();

  function listOf(kind) { return WU.list('truth', kind === 'truth' ? 'truths' : 'dares', WU.state.level); }
  function card() { return st.kind ? listOf(st.kind).filter(function (x) { return x.id === st.id; })[0] || null : null; }
  function draw(kind) { var it = (kind === 'truth' ? deckT : deckD)(listOf(kind)); st.kind = kind; st.id = it ? it.id : null; }
  function player() { return st.demo ? scr.get().demoWho : st.player || ''; }
  function nameAttr() { return st.demo ? scr.ea('demoWho') : ' data-auto'; }
  function secs() { var S = scr.get(), c = card(); return Math.max(10, st.kind === 'truth' ? +S.truthSecs || 45 : (c && +c.secs) || +S.dareSecs || 30); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function ek(c, f) { return ' data-edit="truth:' + (st.kind === 'truth' ? 'truths' : 'dares') + ':' + c.id + ':' + f + '"'; }

  /* ---------- drawing ---------- */
  function render() {
    var S = scr.get(), ph = st.phase, h = '', name = player();
    box.classList.toggle('side', ph !== 'ready');
    h += '<div class="phead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600');
    if (name) h += '<div class="pname"' + nameAttr() + '>' + WU.esc(name) + '</div>';
    if (st.swapFlash && S.swapped) h += '<div class="swap"' + scr.ea('swapped') + '>' + WU.esc(S.swapped) + '</div>';
    if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
    h += '</div>';
    if (ph === 'ready') {
      h += '<div class="tdoors">' +
        '<div class="tdoor t" data-b="truth"><span class="key" data-ctrl>T</span><b' + scr.ea('truthLabel') + '>' + WU.esc(S.truthLabel) + '</b><span' + scr.ea('truthSub') + '>' + WU.esc(S.truthSub) + '</span></div>' +
        '<div class="tdoor d" data-b="dare"><span class="key" data-ctrl>D</span><b' + scr.ea('dareLabel') + '>' + WU.esc(S.dareLabel) + '</b><span' + scr.ea('dareSub') + '>' + WU.esc(S.dareSub) + '</span></div></div>';
      h += '<div class="pbot">';
      if (name) h += '<div class="pbig"' + scr.ea('choose') + '>' + WU.esc(kit.fill(S.choose, { name: name })) + '</div>';
      else h += '<div class="brow">' + (S.who ? '<div class="pbig"' + scr.ea('who') + '>' + WU.esc(S.who) + '</div>' : '') +
        '<div class="btn sm" data-ctrl data-b="pick"><span class="key">P</span><span>Pick a student</span></div></div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      h += '</div>';
    } else {
      var c = card(), isT = st.kind === 'truth';
      h += '<div class="pcard ' + st.kind + (ph === 'after' ? ' lit' : '') + '"><div class="ptag"' + scr.ea(isT ? 'truthLabel' : 'dareLabel') + '>' + WU.esc(isT ? S.truthLabel : S.dareLabel) + '</div>' +
        '<div class="ptext"' + (c ? ek(c, 'text') : scr.ea('qMark')) + '>' + WU.esc(c ? c.text : S.qMark) + '</div></div>';
      h += '<div class="pbot">';
      if (ph === 'card') {
        if (isT && S.frameShow && c) h += c.frame ? kit.frame(c.frame, ek(c, 'frame')) : kit.frame(S.frame, scr.ea('frame'));
        if (S.ruleShow && S.rule && !st.swapped) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      } else {
        if (isT) { if (S.followShow && S.follow) h += '<div class="pbig"' + scr.ea('follow') + '>' + WU.esc(kit.fill(S.follow, { name: name || '?' })) + '</div>'; }
        else if (S.done) h += '<div class="pbig"' + scr.ea('done') + '>' + WU.esc(kit.fill(S.done, { name: name || '?' })) + '</div>';
      }
      h += '</div><div class="pside"><div class="tslot"></div>' +
        (ph === 'after' ? '<div class="btn sm" data-b="next"><span class="key" data-ctrl>SPACE</span><span' + scr.ea('next') + '>' + WU.esc(S.next) + '</span></div>' : '') + '</div>';
    }
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph !== 'ready') box.querySelector('.tslot').appendChild(clock.el);
    kit.fit(box.querySelector('.ptext'), 104, 48);
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); var a = b.getAttribute('data-b'); if (a === 'truth') choose('truth'); else if (a === 'dare') choose('dare'); else if (a === 'pick') pick(); else if (a === 'next') next(); };
    });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['P', player() && !st.demo ? 'someone else' : 'pick a student'], ['T', 'truth'], ['D', 'dare'], ['Esc', 'home']]
      : ph === 'card' ? [['SPACE', 'done'], ['X', st.swapped ? 'swapped' : 'swap'], ['N', 'other card'], ['ENTER', 'pause / go'], ['Esc', 'home']]
      : [['SPACE', 'next player'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), function (k) { keyAction(k); });
  }

  /* ---------- flow ---------- */
  function startClock() {
    if (clock) clock.destroy();
    clock = WU.Timer({ seconds: secs(), size: 400 });
    render(); clock.start();
  }
  function pick() {
    if (st.phase !== 'ready') return;
    st.demo = false; st.picked = true;
    WU.pickStudent({ onPicked: function (n) { st.player = n; if (box) render(); } });
    render();
  }
  function choose(kind) {
    if (st.phase !== 'ready') return;
    WU.sound.unlock(); st.turns++;
    draw(kind); st.phase = 'card'; st.swapped = false; st.swapFlash = false;
    WU.sound.slam(); startClock();
  }
  function swap() {
    if (st.phase !== 'card' || st.swapped) return;
    draw(st.kind === 'truth' ? 'dare' : 'truth'); st.swapped = true; st.swapFlash = true;
    WU.sound.pop(); startClock();
    clearT(); timers.push(setTimeout(function () { if (st && st.swapFlash) { st.swapFlash = false; render(); } }, 2200));
  }
  function other() { if (st.phase !== 'card') return; draw(st.kind); WU.sound.clack(); startClock(); }
  function done() { if (st.phase !== 'card') return; if (clock && clock.isRunning()) clock.toggle(); st.phase = 'after'; st.swapFlash = false; WU.sound.ding(); render(); }
  function next() {
    if (st.phase !== 'after') return;
    clearT(); if (clock) { clock.destroy(); clock = null; }
    st.phase = 'ready'; st.demo = false; st.player = ''; st.kind = null; st.id = null;
    WU.sound.pop(); render();
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready' && !st.turns && !st.picked) st.demo = !!scr.get().demoShow;
    if (st.phase !== 'ready' && !card()) draw(st.kind);
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('truth-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') { if (!player()) pick(); else WU.toast('Truth or dare? Press T or D.'); } else if (ph === 'card') done(); else next(); }
    else if (k === 'P') pick();
    else if (k === 'T') choose('truth');
    else if (k === 'D') choose('dare');
    else if (k === 'X') swap();
    else if (k === 'N') other();
    else if (k === 'ENTER') { if (ph === 'card' && clock) clock.toggle(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.truth = {
    title: 'Truth or Dare',
    teacher: function () {
      if (!st) return null;
      var c = card(), info = [];
      info.push({ label: 'Player', text: player() || '(nobody yet: press P)' });
      if (c) info.push({ label: st.kind === 'truth' ? 'Truth' : 'Dare', text: c.text });
      info.push({ label: 'Step', text: { ready: 'P pick · T truth · D dare', card: 'Answering. X = swap once · N = other card · Space = done', after: st.kind === 'truth' ? 'Class asks a follow-up. Space = next player' : 'Thumbs up? Space = next player' }[st.phase] });
      return { secret: [], info: info };
    },
    help: function () {
      return [['P', 'pick a student (again = someone else)'], ['T / Left', 'truth'], ['D / Right', 'dare'], ['X', 'swap once: truth to dare, dare to truth'],
        ['N', 'another card of the same kind'], ['Enter', 'pause / go'], ['Space', 'done / next player'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', player: '', kind: null, id: null, demo: !!scr.get().demoShow, turns: 0 };
      el.innerHTML = '<div class="ptg truthg"><div class="layer"></div>' + kit.header('Truth or Dare') + '<div class="hints"></div></div>';
      box = el.querySelector('.ptg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('truth-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      if (e.key === 'ArrowLeft') { keyAction('T'); return true; }
      if (e.key === 'ArrowRight') { keyAction('D'); return true; }
      var map = { p: 'P', t: 'T', d: 'D', x: 'X', n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
