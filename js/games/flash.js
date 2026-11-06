/* Warm Up: FLASH ROOM (grammar game G2, Beginner to Intermediate). Trains: there is / there are (was / were from Pre-Int).
   Space: a room full of things (1 to 5 of each) shows for a few seconds, then it is hidden.
   The screen picks a student: "There were three apples." Space shows the next thing with its sentence.
   When everything is shown: quick questions about things that were there, or were not ("Was there a dog?").
   Keys: Space look / show the next thing / next question / new room, P other student, 1-4 team points.
   Content: content/flash.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'flash', title: 'Flash Room', content: function () { return WU.content.flashScreen; },
    fields: [
      { type: 'head', label: 'The room' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'ready', label: 'Before the room shows ({n} = seconds)', type: 'text', max: 60 },
      { k: 'look', label: 'While the room shows', type: 'text', max: 16 },
      { k: 'seconds', label: 'Seconds to look', type: 'num', min: 2, max: 30 },
      { k: 'items', label: 'Things in the room (2-8)', type: 'num', min: 2, max: 8 },
      { k: 'most', label: 'Most of one thing (1-5)', type: 'num', min: 1, max: 5 },
      { k: 'nums', label: 'Number words (2, 3, 4, 5...)', type: 'text', max: 60 },
      { type: 'head', label: 'Remember' },
      { k: 'hidden', label: 'When the room is hidden', type: 'text', max: 50 },
      { k: 'one', label: 'Sentence for one thing (___ = an apple)', type: 'text', max: 40 },
      { k: 'many', label: 'Sentence for more (___ = three apples)', type: 'text', max: 40 },
      { k: 'frame', label: 'Frame on screen (empty = none)', type: 'text', max: 60 },
      { k: 'who', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Quick questions' },
      { k: 'quizShow', label: 'Quick questions', type: 'bool', on: 'On', off: 'Off' },
      { k: 'quiz', label: 'How many questions', type: 'num', min: 1, max: 6 },
      { k: 'quizTag', label: 'Tag for the questions', type: 'text', max: 24 },
      { k: 'qOne', label: 'Question, one (___ = a dog)', type: 'text', max: 40 },
      { k: 'qMany', label: 'Question, more (___ = dogs)', type: 'text', max: 40 },
      { k: 'yesOne', label: 'Answer: yes, one', type: 'text', max: 30 }, { k: 'noOne', label: 'Answer: no, one', type: 'text', max: 30 },
      { k: 'yesMany', label: 'Answer: yes, more', type: 'text', max: 30 }, { k: 'noMany', label: 'Answer: no, more', type: 'text', max: 30 },
      { k: 'demo', label: 'Teacher demo banner (first room only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('flash', 'things', {
    gameTitle: 'Flash Room', label: 'Things in the room',
    defaults: function (l) { return WU.content.flash[l].things; },
    norm: function (r) { var o = kit.normWord(r); return { pic: o.pic, word: o.text, art: o.art, pl: o.pl }; },
    title: function (it) { return it.word || WU.picName(it.pic) || '(empty)'; },
    fields: function () {
      return [
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'word', label: 'Word (empty = the picture name)', type: 'text', max: 30 },
        { k: 'art', label: 'a / an', type: 'select', options: kit.ARTICLES },
        { k: 'pl', label: 'Plural (empty = add -s)', type: 'text', max: 30 }
      ];
    },
    blank: function () { return { pic: '', word: '', pl: '' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar();

  function things() { return WU.list('flash', 'things', WU.state.level).filter(function (x) { return x.pic || x.word; }); }
  function word(it) { return it.word || WU.picName(it.pic); }
  function ex(it) { return { w: word(it), art: it.art, pl: it.pl }; }
  function numWord(n) { var w = String(scr.get().nums || '').split(',').map(function (x) { return x.trim(); }); return w[n - 2] || String(n); }
  // "an apple" / "three apples"
  function phrase(it, n) { return n === 1 ? WU.phrase(ex(it), 'a') : numWord(n) + ' ' + WU.phrase(ex(it), 'pl'); }
  function sentence(c) { var S = scr.get(); return String(c.n === 1 ? S.one : S.many).replace('___', phrase(c.it, c.n)); }
  function ek(it, f) { return ' data-edit="flash:things:' + it.id + ':' + f + '"'; }

  function newRoom() {
    var S = scr.get(), all = WU.shuffle(things()), k = Math.max(2, Math.min(8, +S.items || 5, all.length)), most = Math.max(1, Math.min(5, +S.most || 4));
    st.cells = all.slice(0, k).map(function (it) { return { it: it, n: 1 + WU.rand(most), shown: false }; });
    st.spare = all.slice(k);
    st.quiz = []; st.qi = -1; st.qAns = false;
  }
  function makeQuiz() {
    var S = scr.get(), n = Math.max(1, Math.min(6, +S.quiz || 3)), q = [];
    var have = WU.shuffle(st.cells.slice()), not = WU.shuffle(st.spare.slice());
    for (var i = 0; i < n; i++) {
      var useNot = not.length && (Math.random() < 0.5 || !have.length);
      if (useNot) q.push({ it: not.pop(), n: 0, many: Math.random() < 0.5 });
      else if (have.length) { var c = have.pop(); q.push({ it: c.it, n: c.n, many: c.n > 1 }); }
    }
    st.quiz = q;
  }

  function cellHTML(c, i) {
    var ph = st.phase, show = ph === 'look' || c.shown;
    if (!show) return '<div class="flcell hid"><span data-ctrl>?</span></div>';
    // Picture size from the cell size (container units): the bigger of one row or two rows.
    var cap = c.shown ? 64 : 10, opt = function (rows) { var per = Math.ceil(c.n / rows); return 'min(calc(92cqw / ' + per + ' - 8px), calc((100cqh - ' + cap + 'px) * .92 / ' + rows + ' - 8px))'; };
    var size = 'width:' + (c.n > 1 ? 'max(' + opt(1) + ', ' + opt(2) + ')' : opt(1)), pics = '';
    for (var j = 0; j < c.n; j++) pics += '<div class="flp" style="' + size + '"' + ek(c.it, 'pic') + '>' + WU.pic(c.it.pic) + '</div>';
    return '<div class="flcell' + (c.shown && ph !== 'look' ? ' got' : '') + (st.last === i ? ' new' : '') + '"><div class="flpics">' + pics + '</div>' +
      (c.shown ? '<div class="flcap" data-auto>' + WU.esc(sentence(c)) + '</div>' : '') + '</div>';
  }

  function render() {
    var S = scr.get(), ph = st.phase, h = '';
    var tag = ph === 'quiz' ? kit.chip(S.quizTag, scr.ea('quizTag'), '#ffe600') : kit.chip(S.tag, scr.ea('tag'), '#00e5c7');
    h += '<div class="ghead">' + tag + (ph === 'quiz' ? '<div class="gpill" data-auto>' + (st.qi + 1) + ' / ' + st.quiz.length + '</div>' : '') + (ph === 'look' && S.look ? '<div class="gpill flook"' + scr.ea('look') + '>' + WU.esc(S.look) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (ph === 'look') h += bar.html();
    if (ph === 'ready') {
      h += '<div class="flready"><div class="gbig"' + scr.ea('ready') + '>' + WU.esc(kit.fill(S.ready, { n: Math.max(2, +S.seconds || 8) })) + '</div>' +
        (S.frame ? kit.frame(S.frame, scr.ea('frame')) : '') + '</div>';
    } else if (ph === 'quiz') {
      var q = st.quiz[st.qi], form = q.many ? 'pl' : 'a', yes = q.n > 0;
      var qt = String(q.many ? S.qMany : S.qOne).replace('___', WU.phrase(ex(q.it), form));
      h += '<div class="flquiz"><div class="flqpic"' + ek(q.it, 'pic') + '>' + WU.pic(q.it.pic) + '</div><div class="flqr">' +
        '<div class="flq"' + scr.ea(q.many ? 'qMany' : 'qOne') + '>' + WU.esc(qt) + '</div>' +
        (st.qAns ? gram.answer('', '', WU.esc(yes ? (q.many ? S.yesMany : S.yesOne) : (q.many ? S.noMany : S.noOne)), scr.ea(yes ? (q.many ? 'yesMany' : 'yesOne') : (q.many ? 'noMany' : 'noOne'))) +
          (yes ? '<div class="flsaw" data-auto>' + WU.esc(sentence({ it: q.it, n: q.n })) + '</div>' : '') : gram.who('{name}?', ' data-auto', st.who)) +
        '</div></div>';
    } else {
      var n = st.cells.length, cols = n <= 3 ? n : n === 4 ? 2 : n <= 6 ? 3 : 4;
      h += '<div class="flroom' + (ph === 'look' ? ' on' : '') + '" style="grid-template-columns:repeat(' + cols + ',1fr)">' + st.cells.map(cellHTML).join('') + '</div>';
      if (ph === 'recall') {
        var left = st.cells.filter(function (c) { return !c.shown; }).length;
        h += '<div class="flbottom">';
        if (left) {
          h += '<div class="brow">' + gram.who(S.who, scr.ea('who'), st.who) + (S.frame ? kit.frame(S.frame, scr.ea('frame')) : '') + '</div>';
          if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
        } else h += '<div class="gbig"' + scr.ea('hidden') + '>' + WU.esc(S.hidden) + '</div>';
        h += '</div>';
      }
    }
    box.querySelector('.layer').innerHTML = h;
    if (ph === 'look') bar.redraw(box);
    box.querySelectorAll('.flcap').forEach(function (c) { kit.fit(c, 40, 22); });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, left = st.cells ? st.cells.filter(function (c) { return !c.shown; }).length : 0;
    var hs = ph === 'ready' ? [['SPACE', 'show the room'], ['Esc', 'home']]
      : ph === 'look' ? [['SPACE', 'hide now'], ['Esc', 'home']]
      : ph === 'recall' ? (left ? [['SPACE', 'show one thing'], ['P', 'other student'], ['A', 'show all'], ['Esc', 'home']] : [['SPACE', scr.get().quizShow ? 'quick questions' : 'new room'], ['Esc', 'home']])
      : [['SPACE', st.qAns ? 'next' : 'answer'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function look() {
    var S = scr.get(); st.phase = 'look'; st.last = -1; WU.sound.slam(); render();
    bar.start(box, Math.max(2, Math.min(30, +S.seconds || 8)), hide);
  }
  function hide() { bar.stop(); if (!st || st.phase !== 'look') return; st.phase = 'recall'; st.who = kit.student(); WU.sound.pop(); render(); }
  function showOne() {
    var idx = -1; st.cells.some(function (c, i) { if (!c.shown) { idx = i; return true; } });
    if (idx < 0) return;
    st.cells[idx].shown = true; st.last = idx; WU.sound.ding();
    if (st.cells.some(function (c) { return !c.shown; })) st.who = kit.student([st.who]);
    render();
  }
  function showAll() { st.cells.forEach(function (c) { c.shown = true; }); st.last = -1; WU.sound.clack(); render(); }
  function nextQuiz() {
    if (st.qi >= 0 && !st.qAns) { st.qAns = true; WU.sound.ding(); render(); return; }
    st.qi++; st.qAns = false;
    if (st.qi >= st.quiz.length) { newRound(); return; }
    st.who = kit.student([st.who]); WU.sound.pop(); render();
  }
  function newRound() { st.demo = false; newRoom(); st.phase = 'ready'; WU.sound.clack(); render(); }
  function refresh() {
    if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow;
    if (st.phase === 'ready') newRoom();
    render();
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') {
      st.moved = true;
      if (ph === 'ready') look();
      else if (ph === 'look') hide();
      else if (ph === 'recall') {
        if (st.cells.some(function (c) { return !c.shown; })) showOne();
        else if (scr.get().quizShow) { makeQuiz(); if (!st.quiz.length) newRound(); else { st.phase = 'quiz'; st.qi = -1; nextQuiz(); } }
        else newRound();
      } else if (ph === 'quiz') nextQuiz();
    }
    else if (k === 'P') { if ((ph === 'recall' || (ph === 'quiz' && !st.qAns)) && st.who) { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'A') { if (ph === 'recall') showAll(); }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.flash = {
    title: 'Flash Room',
    teacher: function () {
      if (!st || !st.cells) return null;
      var sec = [], info = [], S = scr.get();
      if (st.phase !== 'ready') sec.push({ label: 'In the room', html: st.cells.map(function (c) { return (c.shown ? '&#10003; ' : '') + WU.esc(sentence(c)); }).join('<br>') });
      if (st.phase === 'quiz' && st.quiz[st.qi]) {
        var q = st.quiz[st.qi];
        sec.unshift({ label: 'Answer', text: q.n ? (q.many ? S.yesMany : S.yesOne) : (q.many ? S.noMany : S.noOne), big: true, hot: !q.n });
      }
      info.push({ label: 'Step', text: { ready: 'Space = show the room', look: 'Students are looking', recall: 'Students remember. Space = show the next thing', quiz: 'Quick questions' }[st.phase] });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'show the room / show one thing / question / answer'], ['P', 'other student'], ['A', 'show everything'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'flg', 'Flash Room', 'flash-sb'); box = sh.box;
      st = { phase: 'ready', demo: !!scr.get().demoShow, who: null, last: -1 };
      newRoom(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { p: 'P', a: 'A', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
