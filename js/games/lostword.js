/* Warm Up: LOST WORD (Elementary and up). Trains: finding another way when the word is missing.
   Three modes (T):
   DESCRIBE IT: a situation and a word the student must not say. The student asks for it with a frame
     (It's something you use to... / someone who... / a place where...). Space: the listener on screen guesses WRONG,
     the student adds a detail. Space: the listener gets it, the student closes ("Yes, that's it! Thanks!"). Space: model answer.
   SAY IT SIMPLE: a sentence with a hard word. The listener doesn't understand; the student says it in plain words. Space: model.
   TOO DIRECT: a blunt request (small, medium or big). The listener is offended; the student softens it with the frame for its size.
   Keys: Space next step, N other card, P other student, T mode, B hard mode (every banned word counts), X a banned word was said,
   1-4 team points. Content: content/lostword.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;
  var MODES = ['describe', 'simplify', 'polite'];

  var scr = kit.screen({
    game: 'lostword', title: 'Lost Word', content: function () { return WU.content.lostwordScreen; },
    fields: [
      { type: 'head', label: 'Every mode' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'mDescribe', label: 'Mode name: describe', type: 'text', max: 24 },
      { k: 'mSimplify', label: 'Mode name: simplify', type: 'text', max: 24 },
      { k: 'mPolite', label: 'Mode name: too direct', type: 'text', max: 24 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'seconds', label: 'Time bar to answer (seconds, 0 = none)', type: 'num', min: 0, max: 60 },
      { k: 'lModel', label: 'Label: model answer', type: 'text', max: 14 },
      { type: 'head', label: 'Describe it' },
      { k: 'who', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'banned', label: 'Label before the banned words', type: 'text', max: 20 },
      { k: 'banN', label: 'Banned words in a normal round (the lost word counts as 1)', type: 'num', min: 1, max: 8, hint: 'HARD MODE (key B) bans every word of the card.' },
      { k: 'hardTag', label: 'HARD MODE label', type: 'text', max: 24 },
      { k: 'banStamp', label: 'Stamp when a banned word is said (X)', type: 'text', max: 24 },
      { k: 'frames', label: 'Describing frames, separated by /', type: 'text', max: 240, hint: 'Use ___ for the gap.' },
      { k: 'framesShow', label: 'Describing frames', type: 'bool' },
      { k: 'listenAsk', label: 'Listener, first', type: 'text', max: 40 },
      { k: 'more', label: 'After the wrong guess', type: 'text', max: 50 },
      { k: 'close', label: 'Closing line for the student', type: 'text', max: 50 },
      { k: 'lMore', label: 'Label: model extra detail', type: 'text', max: 14 },
      { type: 'head', label: 'Say it simple' },
      { k: 'whoSimple', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'tooHard', label: 'Label on the hard sentence', type: 'text', max: 24 },
      { k: 'huh', label: 'Listener, first', type: 'text', max: 40 },
      { k: 'ok', label: 'Listener, after', type: 'text', max: 40 },
      { type: 'head', label: 'Too direct' },
      { k: 'whoPolite', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'rude', label: 'Listener, first', type: 'text', max: 40 },
      { k: 'ok2', label: 'Listener, after', type: 'text', max: 40 },
      { k: 'size1', label: 'Small request: label', type: 'text', max: 24 },
      { k: 'p1', label: 'Small request: frames, separated by /', type: 'text', max: 120 },
      { k: 'size2', label: 'Medium request: label', type: 'text', max: 24 },
      { k: 'p2', label: 'Medium request: frames, separated by /', type: 'text', max: 120 },
      { k: 'size3', label: 'Big request: label', type: 'text', max: 24 },
      { k: 'p3', label: 'Big request: frames, separated by /', type: 'text', max: 120 }
    ]
  });
  WU.registerList('lostword', 'describe', {
    gameTitle: 'Lost Word', label: 'Describe it',
    defaults: function (l) { return WU.content.lostword[l].describe; },
    norm: function (r) { return { situation: r.situation || '', banned: r.banned || '', pic: r.pic || '', guess: r.guess || '', got: r.got || '', model: r.model || '', more: r.more || '' }; },
    title: function (it) { return (String(it.banned).split(',')[0] || '(empty)').trim() + ': ' + it.situation; },
    fields: function () {
      return [
        { k: 'situation', label: 'Situation', type: 'text', max: 90 },
        { k: 'banned', label: 'The lost word, then related banned words (commas, easiest first)', type: 'text', max: 90 },
        { k: 'pic', label: 'Picture (empty = none)', type: 'pic' },
        { k: 'guess', label: "Listener's wrong guess", type: 'text', max: 40 },
        { k: 'got', label: 'Listener gets it', type: 'text', max: 60 },
        { k: 'model', label: 'Model: the first try', type: 'text', max: 110 },
        { k: 'more', label: 'Model: the extra detail', type: 'text', max: 90 }
      ];
    },
    blank: function () { return { situation: 'Hotel. You need a towel.', banned: 'towel, shower, dry', pic: '', guess: 'A blanket?', got: 'Oh, a towel! Here you go.', model: 'Can I have something to dry myself with?', more: "It's soft. You use it after you wash." }; }
  });
  WU.registerList('lostword', 'simplify', {
    gameTitle: 'Lost Word', label: 'Say it simple',
    defaults: function (l) { return WU.content.lostword[l].simplify; },
    norm: function (r) { return { situation: r.situation || '', big: r.big || '', word: r.word || '', simple: r.simple || '' }; },
    title: function (it) { return it.big || '(empty)'; },
    fields: function () {
      return [
        { k: 'situation', label: 'Situation', type: 'text', max: 90 },
        { k: 'big', label: 'The hard sentence', type: 'text', max: 110 },
        { k: 'word', label: 'The hard part (highlighted; must be in the sentence)', type: 'text', max: 40 },
        { k: 'simple', label: 'Model: the simple way', type: 'text', max: 110 }
      ];
    },
    blank: function () { return { situation: 'Shop.', big: "I'd like a refund.", word: 'refund', simple: 'Can I get my money back?' }; }
  });
  WU.registerList('lostword', 'polite', {
    gameTitle: 'Lost Word', label: 'Too direct',
    defaults: function (l) { return WU.content.lostword[l].polite; },
    norm: function (r) { return { situation: r.situation || '', blunt: r.blunt || '', size: Math.min(3, Math.max(1, +r.size || 1)), polite: r.polite || '' }; },
    title: function (it) { return it.blunt || '(empty)'; },
    fields: function () {
      return [
        { k: 'situation', label: 'Situation', type: 'text', max: 90 },
        { k: 'blunt', label: 'The blunt request', type: 'text', max: 80 },
        { k: 'size', label: 'Size of the request (1 small, 2 medium, 3 big)', type: 'num', min: 1, max: 3 },
        { k: 'polite', label: 'Model: the polite way', type: 'text', max: 110 }
      ];
    },
    blank: function () { return { situation: 'Café.', blunt: 'Give me a coffee.', size: 1, polite: 'Could I get a coffee, please?' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar();
  var decks = { describe: kit.deck(), simplify: kit.deck(), polite: kit.deck() };

  function cards(m) {
    var all = WU.list('lostword', m || st.mode, WU.state.level);
    if ((m || st.mode) === 'describe') return all.filter(function (x) { return x.banned; });
    if ((m || st.mode) === 'simplify') return all.filter(function (x) { return x.big && x.simple; });
    return all.filter(function (x) { return x.blunt && x.polite; });
  }
  function modesHere() { return MODES.filter(function (m) { return cards(m).length; }); }
  function item() { return cards().filter(function (x) { return x.id === st.id; })[0] || null; }
  function ek(it, f) { return ' data-edit="lostword:' + st.mode + ':' + it.id + ':' + f + '"'; }
  function hard() { return WU.store.get('lw-hard-' + WU.state.level, false) === true; }
  function words(it) { return String(it.banned || '').split(',').map(function (b) { return b.trim(); }).filter(Boolean); }
  function bannedNow(it) { var w = words(it); return hard() ? w : w.slice(0, Math.max(1, +scr.get().banN || 1)); }
  function modeName(S, m) { return m === 'simplify' ? S.mSimplify : m === 'polite' ? S.mPolite : S.mDescribe; }
  function modeKey(m) { return m === 'simplify' ? 'mSimplify' : m === 'polite' ? 'mPolite' : 'mDescribe'; }
  function frameRow(text, attr) {
    var f = String(text || '').split('/').map(function (t) { return t.trim(); }).filter(Boolean);
    return f.length ? '<div class="lwframes">' + f.map(function (t) { return kit.frame(t, attr, 'small'); }).join('') + '</div>' : '';
  }
  // The hard part of the sentence, highlighted (first match, any case).
  function markWord(big, word) {
    var i = word ? big.toLowerCase().indexOf(word.toLowerCase()) : -1;
    if (i < 0) return WU.esc(big);
    return WU.esc(big.slice(0, i)) + '<mark>' + WU.esc(big.slice(i, i + word.length)) + '</mark>' + WU.esc(big.slice(i + word.length));
  }

  /* ---------- the listener: a face that reacts ---------- */
  function face(mood) {
    var brows = mood === 'confused' ? '<path d="M58 70 L88 62 M112 66 L142 74" />' : mood === 'annoyed' ? '<path d="M58 62 L88 72 M112 72 L142 62" />' : '<path d="M58 66 L88 64 M112 64 L142 66" />';
    var mouth = mood === 'happy' ? '<path d="M70 122 Q100 152 130 122" fill="#fff" />' : mood === 'annoyed' ? '<path d="M72 134 Q100 116 128 134" fill="none" />'
      : mood === 'confused' ? '<path d="M76 130 Q90 120 104 130 T130 128" fill="none" />' : '<path d="M76 128 L124 128" />';
    return '<svg class="lwface ' + mood + '" viewBox="0 0 200 200" data-ctrl><g stroke="#0d0d0d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="100" cy="100" r="86" fill="' + (mood === 'annoyed' ? '#ff9a87' : mood === 'happy' ? '#c6ff00' : '#ffe600') + '" />' +
      '<circle cx="74" cy="92" r="9" fill="#0d0d0d" /><circle cx="126" cy="92" r="9" fill="#0d0d0d" />' + brows + mouth + '</g>' +
      (mood === 'confused' ? '<text x="168" y="54" font-size="64" font-weight="900" fill="#0d0d0d">?</text>' : '') + '</svg>';
  }
  function listener(text, attr, mood) {
    return '<div class="lwlis"><div class="lwbubw' + (st.pop ? ' in' : '') + '"><div class="lwbub"' + attr + '><span>' + WU.esc(text) + '</span></div></div>' + face(mood) + '</div>';
  }

  /* ---------- drawing ---------- */
  function render() {
    var S = scr.get(), ph = st.phase, it = item(), m = st.mode, h = '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#00e5c7') +
      '<div class="gpill" data-h="mode"' + scr.ea(modeKey(m)) + '>' + WU.esc(modeName(S, m)) + '</div>' +
      (m === 'describe' && hard() && S.hardTag ? '<div class="gpill lwhard"' + scr.ea('hardTag') + '>' + WU.esc(S.hardTag) + '</div>' : '') + '</div>';
    if (+S.seconds > 0 && ph === 'ask') h += bar.html();
    if (!it) { box.querySelector('.layer').innerHTML = h + '<div class="lwcard"><div class="gbig" data-ctrl>No cards at this level (Edit mode).</div></div>'; renderHints(); return; }
    h += '<div class="lwcard">';
    h += '<div class="lwsit"' + ek(it, 'situation') + '>' + WU.esc(it.situation) + '</div>';
    if (m === 'describe') {
      var ws = words(it), bn = bannedNow(it);
      h += '<div class="lwword">' + (it.pic ? '<div class="lwpic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
        '<div class="lwlost"' + ek(it, 'banned') + '>' + WU.esc(ws[0] || '') + '</div></div>';
      if (bn.length > 1) h += '<div class="lwban">' + (S.banned ? '<span class="bl"' + scr.ea('banned') + '>' + WU.esc(S.banned) + '</span>' : '') +
        bn.slice(1).map(function (b) { return '<span class="bw"' + ek(it, 'banned') + '>' + WU.esc(b) + '</span>'; }).join('') + '</div>';
      if (ph === 'got') h += kit.frame(S.close, scr.ea('close'), 'lwclose');
      else if (S.framesShow && ph !== 'model') h += frameRow(S.frames, scr.ea('frames'));
      if (ph === 'guess' && S.more) h += '<div class="lwmore"' + scr.ea('more') + '>' + WU.esc(S.more) + '</div>';
    } else if (m === 'simplify') {
      h += (S.tooHard ? kit.chip(S.tooHard, scr.ea('tooHard'), '#ff5a1f') : '') +
        '<div class="lwquote big"' + ek(it, 'big') + '><span>' + markWord(it.big, it.word) + '</span></div>';
    } else {
      var sk = 'size' + it.size;
      h += '<div class="lwquote rude"' + ek(it, 'blunt') + '><span>' + WU.esc(it.blunt) + '</span></div>' +
        '<div class="lwsize s' + it.size + '"' + scr.ea(sk) + '>' + WU.esc(S[sk]) + '</div>';
      if (ph !== 'model') h += frameRow(S['p' + it.size], scr.ea('p' + it.size));
    }
    // Bottom: who answers, or the model answer.
    h += '<div class="lwbottom">';
    if (ph === 'model') {
      var mt = m === 'describe' ? it.model : m === 'simplify' ? it.simple : it.polite, mf = m === 'describe' ? 'model' : m === 'simplify' ? 'simple' : 'polite';
      h += gram.answer(S.lModel, scr.ea('lModel'), WU.esc(mt), ek(it, mf));
      if (m === 'describe' && it.more) h += '<div class="lwmd"><b' + scr.ea('lMore') + '>' + WU.esc(S.lMore) + '</b><span' + ek(it, 'more') + '>' + WU.esc(it.more) + '</span></div>';
    } else {
      var wk = m === 'simplify' ? 'whoSimple' : m === 'polite' ? 'whoPolite' : 'who';
      h += '<div class="brow">' + gram.who(S[wk], scr.ea(wk), st.who) + '</div>';
      if (ph === 'ask' && S.ruleShow && S.rule && m === 'describe') h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div></div>';
    // Right: the listener.
    if (m === 'describe') {
      if (ph === 'ask') h += listener(S.listenAsk, scr.ea('listenAsk'), 'neutral');
      else if (ph === 'guess') h += listener(it.guess, ek(it, 'guess'), 'confused');
      else h += listener(it.got, ek(it, 'got'), 'happy');
    } else if (m === 'simplify') h += ph === 'ask' ? listener(S.huh, scr.ea('huh'), 'confused') : listener(S.ok, scr.ea('ok'), 'happy');
    else h += ph === 'ask' ? listener(S.rude, scr.ea('rude'), 'annoyed') : listener(S.ok2, scr.ea('ok2'), 'happy');
    if (st.stamp) h += '<div class="lwstamp"' + scr.ea('banStamp') + '>' + WU.esc(S.banStamp) + '</div>';
    box.querySelector('.layer').innerHTML = h;
    var lw = box.querySelector('.lwlost'); if (lw) kit.fit(lw, it.pic ? 120 : 140, 56);
    var q = box.querySelector('.lwquote'); if (q) kit.fit(q, 76, 40);
    var bub = box.querySelector('.lwbub'); if (bub) kit.fit(bub, 72, 34);
    var mb = box.querySelector('[data-h="mode"]'); if (mb) mb.onclick = function (e) { if (!WU.editing) { e.stopPropagation(); keyAction('T'); } };
    bar.redraw(box);
    st.pop = false;
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, m = st.mode;
    var step = m === 'describe' ? { ask: 'wrong guess', guess: 'got it', got: 'model answer', model: 'next card' }[ph] : (ph === 'ask' ? 'model answer' : 'next card');
    var hs = [['SPACE', step || 'next']];
    if (ph !== 'model') hs.push(['P', 'other student']);
    hs.push(['N', 'other card'], ['T', 'mode']);
    if (m === 'describe') hs.push(['X', 'banned word!'], ['B', hard() ? 'normal mode' : 'hard mode']);
    hs.push(['Esc', 'home']);
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function deal() {
    bar.stop();
    var cs = cards();
    if (!cs.length) { var ms = modesHere(); if (ms.length && ms.indexOf(st.mode) < 0) { st.mode = ms[0]; cs = cards(); } }
    st.id = cs.length ? decks[st.mode](cs).id : null;
    st.phase = 'ask'; st.pop = true; st.stamp = false;
    st.who = kit.student(st.who ? [st.who] : null);
    render();
    var sec = Math.max(0, Math.min(60, +scr.get().seconds || 0));
    if (st.id && sec) bar.start(box, sec, function () { if (st && st.phase === 'ask') render(); });
  }
  function step() {
    var ph = st.phase, m = st.mode;
    if (!item()) { deal(); return; }
    bar.stop(); st.stamp = false; st.pop = true;
    if (m === 'describe' && ph === 'ask') { st.phase = 'guess'; WU.sound.clack(); }
    else if (m === 'describe' && ph === 'guess') { st.phase = 'got'; WU.sound.ding(); }
    else if (ph === 'model') { deal(); return; }
    else { st.phase = 'model'; WU.sound.ding(); }
    render();
  }
  function keyAction(k) {
    if (k === 'SPACE') step();
    else if (k === 'N') { WU.sound.clack(); deal(); }
    else if (k === 'P') { if (st.phase !== 'model') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'T') {
      var ms = modesHere(); if (ms.length < 2 && ms.indexOf(st.mode) >= 0) { WU.toast('Only one mode has cards at this level.'); return; }
      var i = ms.indexOf(st.mode); st.mode = ms[(i + 1) % ms.length] || ms[0]; WU.store.set('lw-mode', st.mode); WU.sound.clack(); deal();
    }
    else if (k === 'B') { if (st.mode !== 'describe') return; WU.store.set('lw-hard-' + WU.state.level, !hard()); WU.sound.clack(); WU.toast(hard() ? 'Hard mode: every word on the card is banned.' : 'Normal mode.'); render(); }
    else if (k === 'X') { if (st.mode !== 'describe' || st.phase === 'model') return; st.stamp = true; WU.sound.buzzer(); render(); setTimeout(function () { if (st && st.stamp) { st.stamp = false; render(); } }, 1400); }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!item()) { deal(); return; }
    render();
  }

  WU.views.lostword = {
    title: 'Lost Word',
    teacher: function () {
      if (!st) return null;
      var it = item(), sec = [], info = [], S = scr.get();
      if (it) {
        if (st.mode === 'describe') {
          sec.push({ label: 'Banned now' + (hard() ? ' (hard mode)' : ''), text: bannedNow(it).join(', '), big: true });
          sec.push({ label: 'Wrong guess', text: it.guess });
          sec.push({ label: 'Model', text: it.model, hot: true });
          if (it.more) sec.push({ label: 'Extra detail', text: it.more });
        } else if (st.mode === 'simplify') sec.push({ label: 'Model', text: it.simple, big: true, hot: true });
        else { sec.push({ label: 'Model', text: it.polite, big: true, hot: true }); sec.push({ label: 'Size', text: S['size' + it.size] }); }
      }
      info.push({ label: 'Mode', text: modeName(S, st.mode) });
      info.push({ label: 'Student', text: st.who || '' });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['Space', 'next step (describe: wrong guess, got it, model, next)'], ['N', 'other card'], ['P', 'other student'], ['T', 'mode: describe / simplify / too direct'],
        ['X', 'a banned word was said'], ['B', 'hard mode on / off (every word on the card is banned)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      sh = gram.shell(el, 'lwg', 'Lost Word', 'lostword-sb'); box = sh.box;
      var saved = WU.store.get('lw-mode', 'describe');
      st = { mode: MODES.indexOf(saved) >= 0 ? saved : 'describe', phase: 'ask', id: null, who: null, pop: true, stamp: false };
      deal();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', p: 'P', t: 'T', b: 'B', x: 'X', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
