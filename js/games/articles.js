/* Warm Up: ARTICLE SHOWDOWN (grammar game G1, all levels). Trains: a / an / the / no article.
   A sentence with a gap. Everyone thinks, then 3, 2, 1... SHOW! Every student shows fingers at the same time:
   1 finger = a, 2 = an, 3 = the, fist = no article. Space reveals the answer and the rule (WHY?),
   and the screen picks a student to say the whole sentence.
   Keys: Space countdown / reveal / next, N other sentence, P other student, 1-4 team points.
   Content: content/articles.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'articles', title: 'Article Showdown', content: function () { return WU.content.articlesScreen; },
    fields: [
      { type: 'head', label: 'Sentence' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'count', label: 'Countdown before SHOW (seconds, 0 = none)', type: 'num', min: 0, max: 10 },
      { k: 'show', label: 'Show signal', type: 'text', max: 16 },
      { type: 'head', label: 'Finger cards' },
      { k: 'c1', label: 'Card 1 (a)', type: 'text', max: 10 }, { k: 'h1', label: 'Card 1: how to show it', type: 'text', max: 20 },
      { k: 'c2', label: 'Card 2 (an)', type: 'text', max: 10 }, { k: 'h2', label: 'Card 2: how to show it', type: 'text', max: 20 },
      { k: 'c3', label: 'Card 3 (the)', type: 'text', max: 10 }, { k: 'h3', label: 'Card 3: how to show it', type: 'text', max: 20 },
      { k: 'c4', label: 'Card 4 (no article)', type: 'text', max: 10 }, { k: 'h4', label: 'Card 4: how to show it', type: 'text', max: 20 },
      { k: 'useThe', label: 'Card 3 (the)', type: 'bool', on: 'Use', off: "Don't use" },
      { k: 'useNone', label: 'Card 4 (no article)', type: 'bool', on: 'Use', off: "Don't use" },
      { type: 'head', label: 'After the reveal' },
      { k: 'whyLabel', label: 'Label in front of the rule', type: 'text', max: 12 }, { k: 'whyShow', label: 'The rule (WHY?)', type: 'bool' },
      { k: 'say', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'demo', label: 'Teacher demo banner (first sentence only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('articles', 'items', {
    gameTitle: 'Article Showdown', label: 'Sentences',
    defaults: function (l) { return WU.content.articles[l].items; },
    norm: function (r) { return { text: r.text || '', answer: r.answer || '', pic: r.pic || '', why: r.why || '' }; },
    fields: function () {
      return [
        { k: 'text', label: 'Sentence (___ = the gap)', type: 'text', max: 110 },
        { k: 'answer', label: 'Answer (a, an, the; empty = no article; two gaps: an / a)', type: 'text', max: 30 },
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'why', label: 'The rule (shown after the reveal)', type: 'text', max: 100 }
      ];
    },
    blank: function () { return { text: 'I have ___ apple.', answer: 'an', pic: '', why: '' }; }
  });

  var sh, box, st, offContent = null, timers = [];
  var deck = kit.deck();
  var KEYS = ['a', 'an', 'the', ''];

  function item() { return WU.list('articles', 'items', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newItem() { var it = deck(WU.list('articles', 'items', WU.state.level)); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="articles:items:' + it.id + ':' + f + '"'; }
  function answers(it) { return String(it.answer || '').split('/').map(function (a) { a = a.trim().toLowerCase(); return a === '-' || a === 'none' || a === '0' ? '' : a; }); }

  // A hand: n fingers up (0 = fist).
  function hand(n) {
    var f = '';
    for (var i = 0; i < 4; i++) {
      var up = i < n, x = 18 + i * 17;
      f += '<rect x="' + x + '" y="' + (up ? 8 : 40) + '" width="14" height="' + (up ? 46 : 16) + '" rx="7" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4"></rect>';
    }
    return '<svg viewBox="0 0 100 100" class="arhand"><rect x="14" y="44" width="72" height="48" rx="16" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4"></rect>' + f +
      '<rect x="2" y="56" width="24" height="14" rx="7" fill="#f5c9a0" stroke="#0d0d0d" stroke-width="4" transform="rotate(-20 14 63)"></rect></svg>';
  }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '', ans = it ? answers(it) : [];
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#c6ff00') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="arcard' + (ph === 'reveal' ? ' lit' : '') + '">' + (it && it.pic ? '<div class="arpic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="artext"' + (it ? ek(it, 'text') : '') + '>' + (it ? gram.gaps(it.text, ph === 'reveal' ? ans : null) : '') + '</div></div>';
    h += '<div class="arbottom">';
    if (ph === 'count') h += '<div class="gnum" data-auto>' + st.left + '</div>';
    else {
      var cards = [1, 2, 3, 4].filter(function (n) { return (n !== 3 || S.useThe) && (n !== 4 || S.useNone); });
      var right = ph === 'reveal' && ans.length === 1 ? KEYS.indexOf(ans[0]) + 1 : 0;
      if (ph === 'show') h += '<div class="gshow arshow"' + scr.ea('show') + '>' + WU.esc(S.show) + '</div>';
      h += '<div class="arcards">' + cards.map(function (n) {
        return '<div class="arc' + (right ? (right === n ? ' ok' : ' dim') : '') + '">' + hand(n === 4 ? 0 : n) +
          '<div class="arw"' + scr.ea('c' + n) + '>' + WU.esc(S['c' + n]) + '</div><div class="arh"' + scr.ea('h' + n) + '>' + WU.esc(S['h' + n]) + '</div></div>';
      }).join('') + '</div>';
      if (ph === 'reveal') {
        h += '<div class="arafter">';
        if (S.whyShow && it && it.why) h += '<div class="arwhy">' + (S.whyLabel ? '<b' + scr.ea('whyLabel') + '>' + WU.esc(S.whyLabel) + '</b>' : '') + '<span' + ek(it, 'why') + '>' + WU.esc(it.why) + '</span></div>';
        h += gram.who(S.say, scr.ea('say'), st.who);
        h += '</div>';
      } else if (ph === 'ask' && S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.artext'), it && it.pic ? 104 : 112, 52);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ask' ? [['SPACE', '3, 2, 1... show!'], ['N', 'other sentence'], ['Esc', 'home']]
      : ph === 'count' ? [['SPACE', 'show now'], ['Esc', 'home']]
      : ph === 'show' ? [['SPACE', 'reveal'], ['Esc', 'home']]
      : [['SPACE', 'next sentence'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function countdown() {
    var n = Math.max(0, Math.min(10, +scr.get().count || 0));
    clearT();
    if (!n) { showNow(); return; }
    st.phase = 'count'; st.left = n; render(); WU.sound.beep(660);
    var tick = function () {
      if (!st || st.phase !== 'count') return;
      st.left--;
      if (st.left <= 0) { showNow(); return; }
      WU.sound.beep(660); render(); timers.push(setTimeout(tick, 1000));
    };
    timers.push(setTimeout(tick, 1000));
  }
  function showNow() { clearT(); st.phase = 'show'; WU.sound.slam(); render(); }
  function reveal() { clearT(); st.phase = 'reveal'; st.who = kit.student(); WU.sound.ding(); render(); }
  function next() { clearT(); st.demo = false; newItem(); st.phase = 'ask'; WU.sound.pop(); render(); }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!item()) newItem(); if (st.phase !== 'count') render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ask') countdown(); else if (ph === 'count') showNow(); else if (ph === 'show') reveal(); else next(); }
    else if (k === 'N') { if (ph === 'ask') { st.moved = true; st.demo = false; newItem(); WU.sound.clack(); render(); } }
    else if (k === 'P') { if (ph === 'reveal') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.articles = {
    title: 'Article Showdown',
    teacher: function () {
      if (!st) return null;
      var it = item(), S = scr.get(), sec = [], info = [];
      if (it) {
        var a = answers(it).map(function (x) { return x || '(no article)'; }).join(' / ');
        sec.push({ label: 'Answer', text: a, big: true });
        if (it.why) sec.push({ label: 'Why', text: it.why });
        info.push({ label: 'Sentence', text: it.text });
      }
      info.push({ label: 'Fingers', text: '1 = ' + S.c1 + ', 2 = ' + S.c2 + (S.useThe ? ', 3 = ' + S.c3 : '') + (S.useNone ? ', fist = ' + S.c4 : '') });
      if (st.who && st.phase === 'reveal') info.push({ label: 'Says the sentence', text: st.who });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'countdown / reveal / next sentence'], ['N', 'other sentence'], ['P', 'other student (after the reveal)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'arg', 'Article Showdown', 'articles-sb'); box = sh.box;
      st = { phase: 'ask', id: null, demo: !!scr.get().demoShow, who: null };
      newItem(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
