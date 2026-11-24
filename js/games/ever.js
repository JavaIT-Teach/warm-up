/* Warm Up: HAVE YOU EVER...? (Elementary and up). The party game as a question chain.
   The screen picks two students: one asks the "Have you ever...?" question, the other answers with a short answer.
   Y = YES: the class asks follow-up questions in the PAST SIMPLE (the card's own question first, then the level ladder).
   N = NO: "Would you like to? Why / why not?" Space: the answerer asks the next question to a new student (a chain).
   Trains the switch from present perfect (experience) to past simple (the details).
   Keys: Y yes, N no (or another question before the answer), P another pair, Enter pause, Space next.
   Content: content/ever.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'ever', title: 'Have You Ever...?', content: function () { return WU.content.everScreen; },
    fields: [
      { type: 'head', label: 'The question' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'askLine', label: 'Who asks whom ({asker}, {answerer})', type: 'text', max: 50 },
      { k: 'yesShort', label: 'Short answer: yes', type: 'text', max: 30 },
      { k: 'noShort', label: 'Short answer: no', type: 'text', max: 30 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 110 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first question only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off', hint: 'A student asks the teacher first.' },
      { k: 'demoWho', label: 'Name of the answerer in the demo', type: 'text', max: 16 },
      { type: 'head', label: 'After YES' },
      { k: 'yesTag', label: 'YES label', type: 'text', max: 24 },
      { k: 'ladderLabel', label: 'Line before the follow-up questions', type: 'text', max: 50 },
      { k: 'ladder', label: 'Follow-up questions, separated by /', type: 'text', max: 200, hint: 'The card\'s own question shows first.' },
      { k: 'ladderShow', label: 'Follow-up questions', type: 'bool' },
      { type: 'head', label: 'After NO' },
      { k: 'noTag', label: 'NO label', type: 'text', max: 24 },
      { k: 'noAsk', label: 'Question after NO', type: 'text', max: 60 },
      { k: 'noFrame', label: 'Answer frames after NO, separated by /', type: 'text', max: 160 },
      { type: 'head', label: 'Timing and the chain' },
      { k: 'secs', label: 'Time for the follow-ups (seconds)', type: 'num', min: 15, max: 300 },
      { k: 'chain', label: 'Next question line ({answerer})', type: 'text', max: 50 }
    ]
  });
  WU.registerList('ever', 'prompts', {
    gameTitle: 'Have You Ever...?', label: 'Questions',
    defaults: function (l) { return WU.content.ever[l].prompts; },
    norm: function (r) { return { text: r.text || '', pic: r.pic || '', ask: r.ask || '', yes: r.yes || '' }; },
    fields: function () {
      return [
        { k: 'text', label: 'Question ("Have you ever...?")', type: 'text', max: 110 },
        { k: 'pic', label: 'Picture (empty = none)', type: 'pic' },
        { k: 'ask', label: 'First follow-up question after YES (past simple)', type: 'text', max: 80 },
        { k: 'yes', label: 'Answer frame after YES (empty = none)', type: 'text', max: 100, hint: 'Use ___ for the gap.' }
      ];
    },
    blank: function () { return { text: 'Have you ever ___?', pic: '', ask: 'When did you ___?', yes: '' }; }
  });

  var root, box, st, sb = null, clock = null, offContent = null;
  var deck = kit.deck();

  function item() { return WU.list('ever', 'prompts', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newPrompt() { var it = deck(WU.list('ever', 'prompts', WU.state.level)); st.id = it ? it.id : null; }
  function ek(it, f) { return ' data-edit="ever:prompts:' + it.id + ':' + f + '"'; }
  function answerer() { return st.demo ? scr.get().demoWho : st.answerer; }
  function newPair() { st.asker = kit.student(); st.answerer = kit.student([st.asker]); }
  function split(t) { return String(t || '').split('/').map(function (x) { return x.trim(); }).filter(Boolean); }

  function render() {
    var S = scr.get(), it = item(), ph = st.phase, h = '';
    box.classList.toggle('side', ph !== 'ask');
    h += '<div class="phead">' + kit.chip(S.tag, scr.ea('tag'), '#00e5c7') +
      '<div class="pname alt" data-auto>' + WU.esc(st.asker) + '</div><div class="parrow" data-ctrl>&rarr;</div>' +
      '<div class="pname"' + (st.demo ? scr.ea('demoWho') : ' data-auto') + '>' + WU.esc(answerer()) + '</div>' +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="pcard' + (ph !== 'ask' ? ' lit' : '') + '">' + (it && it.pic ? '<div class="ppic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="ptext"' + (it ? ek(it, 'text') : ' data-ctrl') + '>' + WU.esc(it ? it.text : '...') + '</div></div>';
    h += '<div class="pbot">';
    if (ph === 'ask') {
      if (S.askLine) h += '<div class="pbig"' + scr.ea('askLine') + '>' + WU.esc(kit.fill(S.askLine, { asker: st.asker, answerer: answerer() })) + '</div>';
      h += '<div class="yn"><div class="btn" data-b="yes"><span class="key" data-ctrl>Y</span><span' + scr.ea('yesShort') + '>' + WU.esc(S.yesShort) + '</span></div>' +
        '<div class="btn no" data-b="no"><span class="key" data-ctrl>N</span><span' + scr.ea('noShort') + '>' + WU.esc(S.noShort) + '</span></div></div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    } else if (ph === 'yes') {
      h += '<div class="brow">' + kit.chip(S.yesTag, scr.ea('yesTag'), '#c6ff00') + (it && it.yes ? kit.frame(it.yes, ek(it, 'yes'), 'small') : '') + '</div>';
      if (S.ladderShow) {
        h += '<div class="lbl"' + scr.ea('ladderLabel') + '>' + WU.esc(S.ladderLabel) + '</div><div class="ladder">' +
          (it && it.ask ? '<span class="q hot"' + ek(it, 'ask') + '>' + WU.esc(it.ask) + '</span>' : '') +
          split(S.ladder).map(function (q) { return '<span class="q"' + scr.ea('ladder') + '>' + WU.esc(q) + '</span>'; }).join('') + '</div>';
      }
    } else {
      h += '<div class="brow">' + kit.chip(S.noTag, scr.ea('noTag'), '#ff5a1f') + '<div class="pbig"' + scr.ea('noAsk') + '>' + WU.esc(S.noAsk) + '</div></div>';
      h += '<div class="brow">' + split(S.noFrame).map(function (f) { return kit.frame(f, scr.ea('noFrame'), 'small'); }).join('') + '</div>';
    }
    h += '</div>';
    if (ph !== 'ask') h += '<div class="pside"><div class="tslot"></div>' +
      (S.chain ? '<div class="btn sm" data-b="next"><span class="key" data-ctrl>SPACE</span><span' + scr.ea('chain') + '>' + WU.esc(kit.fill(S.chain, { answerer: answerer() })) + '</span></div>' : '') + '</div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph !== 'ask') box.querySelector('.tslot').appendChild(clock.el);
    kit.fit(box.querySelector('.ptext'), ph === 'ask' ? (it && it.pic ? 100 : 110) : 84, 44);
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); var a = b.getAttribute('data-b'); if (a === 'yes') answer(true); else if (a === 'no') answer(false); else if (a === 'next') next(); };
    });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = st.phase === 'ask' ? [['Y', 'yes, I have'], ['N', 'no, I haven\'t'], ['O', 'other question'], ['P', 'other students'], ['Esc', 'home']]
      : [['SPACE', 'next question'], ['ENTER', 'pause / go'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), function (k) { keyAction(k); });
  }

  function answer(yes) {
    if (st.phase !== 'ask') return;
    WU.sound.unlock(); st.moved = true;
    st.phase = yes ? 'yes' : 'no';
    if (clock) clock.destroy();
    clock = WU.Timer({ seconds: Math.max(15, +scr.get().secs || 60), size: 400 });
    if (yes) WU.sound.ding(); else WU.sound.pop();
    render(); clock.start();
  }
  function next() {
    if (st.phase === 'ask') return;
    if (clock) { clock.destroy(); clock = null; }
    // The chain: the one who answered asks the next question.
    var prev = answerer(); st.demo = false;
    st.asker = prev; st.answerer = kit.student([prev]);
    newPrompt(); st.phase = 'ask'; WU.sound.clack(); render();
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!scr.get().demoShow;
    if (!item()) newPrompt();
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('ever-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'Y') answer(true);
    else if (k === 'N') answer(false);
    else if (k === 'SPACE') { if (ph === 'ask') WU.toast('Yes or no? Press Y or N.'); else next(); }
    else if (k === 'O') { if (ph === 'ask') { st.moved = true; newPrompt(); WU.sound.clack(); render(); } }
    else if (k === 'P') { if (ph === 'ask') { st.moved = true; st.demo = false; newPair(); WU.sound.clack(); render(); } }
    else if (k === 'ENTER') { if (ph !== 'ask' && clock) clock.toggle(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.ever = {
    title: 'Have You Ever...?',
    teacher: function () {
      if (!st) return null;
      var it = item(), info = [];
      info.push({ label: 'Asks', text: st.asker + ' → ' + answerer() });
      if (it) info.push({ label: 'Question', text: it.text });
      if (it && it.ask) info.push({ label: 'Follow-up (past simple)', text: it.ask });
      info.push({ label: 'Step', text: { ask: 'Y = yes, N = no · O other question · P other students', yes: 'YES: the class asks in the past simple. Space = next', no: 'NO: would you like to? Space = next' }[st.phase] });
      return { secret: [], info: info };
    },
    help: function () {
      return [['Y', 'yes, I have: follow-up questions (past simple)'], ['N', 'no, I haven\'t: would you like to?'], ['O', 'another question (before the answer)'],
        ['P', 'two other students (before the answer)'], ['Space', 'next question: the answerer asks a new student'], ['Enter', 'pause / go'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ask', id: null, demo: !!scr.get().demoShow, asker: '', answerer: '' };
      newPair();
      el.innerHTML = '<div class="ptg everg"><div class="layer"></div>' + kit.header('Have You Ever...?') + '<div class="hints"></div></div>';
      box = el.querySelector('.ptg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('ever-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newPrompt(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { y: 'Y', n: 'N', o: 'O', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
