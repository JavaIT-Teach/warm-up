/* Warm Up: STAND UP IF... (moving game, all levels).
   A sentence appears ("Stand up if you have a sister."). Space: a short countdown, then STAND UP! Everyone it is true for stands
   at their seat. Space: the standing students say more (a frame), the sitting ones ask a question. Space: sit down, next sentence.
   Keys: Space next step, Up / Down count who stood up (optional), N another sentence.
   Content: content/standup.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'standup', title: 'Stand Up If...', content: function () { return WU.content.standupScreen; },
    fields: [
      { type: 'head', label: 'Sentence' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'ready', label: 'Before the countdown', type: 'text', max: 50 },
      { k: 'count', label: 'Countdown before STAND UP (seconds, 0 = none)', type: 'num', min: 0, max: 10 },
      { k: 'go', label: 'Stand up signal', type: 'text', max: 20 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'After standing up' },
      { k: 'say', label: 'Line for the standing students', type: 'text', max: 60 },
      { k: 'frame', label: 'Frame for every sentence at this level (empty = none)', type: 'text', max: 60, hint: 'A sentence can have its own frame.' },
      { k: 'ask', label: 'Line for the sitting students', type: 'text', max: 70 }, { k: 'askShow', label: 'Line for the sitting students', type: 'bool' },
      { k: 'counted', label: 'After counting ({n})', type: 'text', max: 30 },
      { k: 'nobody', label: 'Nobody stood up (count = 0)', type: 'text', max: 60 },
      { k: 'sit', label: 'Next sentence', type: 'text', max: 20 },
      { k: 'demo', label: 'Teacher demo banner (first sentence only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('standup', 'sentences', {
    gameTitle: 'Stand Up If...', label: 'Sentences',
    defaults: function (l) { return WU.content.standup[l].sentences; },
    norm: function (r) { return { text: r.text || '', pic: r.pic || '', follow: r.follow || '' }; },
    fields: function () {
      return [
        { k: 'text', label: 'Sentence ("Stand up if...")', type: 'text', max: 110 },
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'follow', label: 'Frame for the standing students', type: 'text', max: 70,
          ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; }, hint: "Empty = the level's frame." }
      ];
    },
    blank: function () { return { text: 'Stand up if you ___.', pic: '', follow: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timers = [];
  var deck = kit.deck();

  function item() { return WU.list('standup', 'sentences', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newSentence() { var it = deck(WU.list('standup', 'sentences', WU.state.level)); st.id = it ? it.id : null; st.n = null; }
  function ek(it, f) { return ' data-edit="standup:sentences:' + it.id + ':' + f + '"'; }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    h += '<div class="shead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') + (st.sitFlash && S.sit ? '<div class="ssit"' + scr.ea('sit') + '>' + WU.esc(S.sit) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="scard' + (ph === 'up' || ph === 'say' ? ' lit' : '') + '">' + (it && it.pic ? '<div class="spic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="stext"' + (it ? ek(it, 'text') : '') + '>' + (it ? WU.esc(it.text) : '') + '</div></div>';
    h += '<div class="sbottom">';
    if (ph === 'ready') {
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      if (S.ready) h += '<div class="sbig"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div>';
    } else if (ph === 'count') {
      h += '<div class="snum" data-auto>' + st.left + '</div>';
    } else if (ph === 'up') {
      h += '<div class="sgo"' + scr.ea('go') + '>' + WU.esc(S.go) + '</div>' + countHTML(S);
    } else {
      var fr = it && it.follow ? kit.frame(it.follow, ek(it, 'follow')) : kit.frame(S.frame, scr.ea('frame'));
      if (st.n === 0 && S.nobody) h += '<div class="sbig"' + scr.ea('nobody') + '>' + WU.esc(S.nobody) + '</div>';
      else {
        h += '<div class="brow">' + (S.say ? '<div class="sbig"' + scr.ea('say') + '>' + WU.esc(S.say) + '</div>' : '') + countHTML(S) + '</div>';
        if (fr) h += '<div class="brow">' + fr + '</div>';
        if (S.askShow && S.ask) h += '<div class="rule"' + scr.ea('ask') + '>' + WU.esc(S.ask) + '</div>';
      }
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.stext'), it && it.pic ? 104 : 120, 56);
    renderHints();
  }
  function countHTML(S) { return st.n != null && S.counted ? '<div class="scount"' + scr.ea('counted') + '>' + WU.esc(kit.fill(S.counted, { n: st.n })) + '</div>' : ''; }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['SPACE', 'countdown'], ['N', 'other sentence'], ['Esc', 'home']]
      : ph === 'count' ? [['SPACE', 'stand up now'], ['Esc', 'home']]
      : ph === 'up' ? [['SPACE', 'tell us more'], ['UP / DOWN', 'count'], ['Esc', 'home']]
      : [['SPACE', 'sit down: next'], ['UP / DOWN', 'count'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), function (k) { keyAction(k === 'UP / DOWN' ? 'UP' : k); });
  }

  /* ---------- flow ---------- */
  function countdown() {
    var n = Math.max(0, Math.min(10, +scr.get().count || 0));
    clearT(); WU.sound.unlock(); st.sitFlash = false;
    if (!n) { standUp(); return; }
    st.phase = 'count'; st.left = n; render(); WU.sound.beep(660);
    var tick = function () {
      if (!st || st.phase !== 'count') return;
      st.left--;
      if (st.left <= 0) { standUp(); return; }
      WU.sound.beep(660); render(); timers.push(setTimeout(tick, 1000));
    };
    timers.push(setTimeout(tick, 1000));
  }
  function standUp() { clearT(); st.phase = 'up'; WU.sound.slam(); WU.sound.ding(); render(); }
  function next() {
    clearT(); st.demo = false; newSentence(); st.phase = 'ready'; st.sitFlash = true; WU.sound.pop(); render();
    timers.push(setTimeout(function () { if (st && st.phase === 'ready') { st.sitFlash = false; render(); } }, 2200));
  }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!item()) newSentence(); if (st.phase !== 'count') render(); }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('standup-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ready') countdown(); else if (ph === 'count') standUp(); else if (ph === 'up') { st.phase = 'say'; WU.sound.clack(); render(); } else next(); }
    else if (k === 'N') { if (ph === 'ready') { st.moved = true; st.demo = false; st.sitFlash = false; newSentence(); WU.sound.clack(); render(); } }
    else if (k === 'UP') { if (ph === 'up' || ph === 'say') { st.n = Math.min(99, (st.n || 0) + 1); WU.sound.tick(); render(); } }
    else if (k === 'DOWN') { if (ph === 'up' || ph === 'say') { st.n = Math.max(0, (st.n == null ? 1 : st.n) - 1); WU.sound.tick(); render(); } }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.standup = {
    title: 'Stand Up If...',
    teacher: function () {
      if (!st) return null;
      var it = item(), info = [];
      if (it) info.push({ label: 'Sentence', text: it.text });
      info.push({ label: 'Step', text: { ready: 'Read the sentence. Space = countdown', count: 'Countdown...', up: 'Standing up. Up / Down = count them. Space = tell us more', say: 'Standing students say more. Space = sit down, next sentence' }[st.phase] });
      if (st.n != null) info.push({ label: 'Stood up', text: st.n + ' of ' + WU.roster().length });
      return { secret: [], info: info };
    },
    help: function () { return [['Space', 'countdown / stand up / tell us more / next'], ['Up / Down', 'count who stood up (optional)'], ['N', 'another sentence'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', id: null, n: null, demo: !!scr.get().demoShow, sitFlash: false };
      el.innerHTML = '<div class="sug"><div class="layer"></div>' + kit.header('Stand Up If...') + '<div class="hints"></div></div>';
      box = el.querySelector('.sug');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('standup-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newSentence(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'ArrowUp') { keyAction('UP'); return true; }
      if (e.key === 'ArrowDown') { keyAction('DOWN'); return true; }
      var map = { n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
