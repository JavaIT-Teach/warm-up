/* Warm Up: 20 QUESTIONS (all levels). The class finds a secret thing with yes / no questions only.
   The secret shows on the Teacher screen (V): a picked student (or the teacher) reads it there and answers.
   O = OWN SECRET: the student thinks of something themselves (no laptop needed); the board only counts.
   Every answered question costs one: Y yes, N no, K sometimes / kind of. X = not a yes / no question (no cost: fix it!).
   G = guessed (win). Out of questions: the secret is revealed.
   Keys: P pick the thinker, Space start / next, Y N K X G, O own secret on / off, Esc home.
   Content: content/twenty.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'twenty', title: '20 Questions', content: function () { return WU.content.twentyScreen; },
    fields: [
      { type: 'head', label: 'Before the round' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'max', label: 'Questions per round', type: 'num', min: 5, max: 30 },
      { k: 'cat', label: 'Line before the category', type: 'text', max: 20 },
      { k: 'catShow', label: 'Category hint', type: 'bool' },
      { k: 'thinker', label: 'Who answers ({name})', type: 'text', max: 80 }, { k: 'thinkerShow', label: 'Who answers', type: 'bool' },
      { k: 'ownTag', label: 'OWN SECRET label', type: 'text', max: 24 },
      { k: 'ownLine', label: 'Own secret: the thinker line ({name})', type: 'text', max: 80 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 100 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off', hint: 'The teacher answers the first round.' },
      { k: 'demoWho', label: 'Name in the demo round', type: 'text', max: 16 },
      { type: 'head', label: 'During the round' },
      { k: 'left', label: 'Under the counter', type: 'text', max: 24 },
      { k: 'yes', label: 'YES', type: 'text', max: 12 }, { k: 'no', label: 'NO', type: 'text', max: 12 }, { k: 'maybe', label: 'SOMETIMES', type: 'text', max: 14 },
      { k: 'fix', label: 'Not a yes / no question', type: 'text', max: 50 },
      { k: 'starters', label: 'Question starters, separated by /', type: 'text', max: 220, hint: 'Use ___ for the gap.' },
      { k: 'startersShow', label: 'Question starters', type: 'bool' },
      { type: 'head', label: 'After the round' },
      { k: 'win', label: 'Guessed ({used})', type: 'text', max: 30 },
      { k: 'lose', label: 'Out of questions', type: 'text', max: 30 },
      { k: 'reveal', label: 'Before the secret', type: 'text', max: 20 },
      { k: 'ownReveal', label: 'Own secret: reveal line ({name})', type: 'text', max: 60 },
      { k: 'best', label: 'Last line', type: 'text', max: 60 }
    ]
  });
  WU.registerList('twenty', 'secrets', {
    gameTitle: '20 Questions', label: 'Secrets',
    defaults: function (l) { return WU.content.twenty[l].secrets; },
    norm: function (r) { var p = WU.PICS[r.pic]; return { text: r.text || (p ? p.name : ''), cat: r.cat || '', pic: r.pic || '' }; },
    title: function (it) { return it.text + (it.cat ? '  (' + it.cat + ')' : ''); },
    fields: function () {
      return [
        { k: 'text', label: 'The secret (with a / an)', type: 'text', max: 40 },
        { k: 'cat', label: 'Category (a hint on the board)', type: 'text', max: 24 },
        { k: 'pic', label: 'Picture (empty = none)', type: 'pic' }
      ];
    },
    blank: function () { return { text: 'a ___', cat: 'THING', pic: '' }; }
  });

  var root, box, st, sb = null, offContent = null, timers = [];
  var deck = kit.deck();

  function secret() { return WU.list('twenty', 'secrets', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newSecret() { var it = deck(WU.list('twenty', 'secrets', WU.state.level)); st.id = it ? it.id : null; }
  function max() { return Math.max(5, Math.min(30, +scr.get().max || 20)); }
  function own() { return WU.store.get('twenty-own', false) === true; }
  function thinker() { return st.demo ? scr.get().demoWho : st.player || ''; }
  function ek(it, f) { return ' data-edit="twenty:secrets:' + it.id + ':' + f + '"'; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function split(t) { return String(t || '').split('/').map(function (x) { return x.trim(); }).filter(Boolean); }

  function render() {
    var S = scr.get(), ph = st.phase, it = secret(), h = '', name = thinker() || '?';
    box.classList.toggle('side', ph !== 'ready');
    h += '<div class="phead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') + (own() ? kit.chip(S.ownTag, scr.ea('ownTag'), '#ff4fc3') : '') +
      (thinker() ? '<div class="pname"' + (st.demo ? scr.ea('demoWho') : ' data-auto') + '>' + WU.esc(thinker()) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    // The card: the category while playing, the secret at the end.
    h += '<div class="pcard' + (ph === 'end' ? ' lit' : '') + '">';
    if (ph === 'end' && !own() && it) {
      h += '<div class="ptag"' + scr.ea('reveal') + '>' + WU.esc(S.reveal) + '</div>' + (it.pic ? '<div class="ppic"' + ek(it, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
        '<div class="ptext"' + ek(it, 'text') + '>' + WU.esc(it.text) + '</div>';
    } else if (ph === 'end') {
      h += '<div class="ptext"' + scr.ea('ownReveal') + '>' + WU.esc(kit.fill(S.ownReveal, { name: name })) + '</div>';
    } else if (own()) {
      h += '<div class="ptext"' + scr.ea('ownLine') + '>' + WU.esc(kit.fill(S.ownLine, { name: name })) + '</div>';
    } else {
      h += '<div class="ptext">' + (S.catShow && it && it.cat ? '<span' + scr.ea('cat') + '>' + WU.esc(S.cat) + '</span> <span' + ek(it, 'cat') + '>' + WU.esc(it.cat) + '</span>'
        : '<span data-ctrl>?</span>') + '</div>';
    }
    h += '</div><div class="pbot">';
    if (ph === 'ready') {
      if (!own() && S.thinkerShow && S.thinker) h += '<div class="pbig"' + scr.ea('thinker') + '>' + WU.esc(kit.fill(S.thinker, { name: name })) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      h += '<div class="brow" data-ctrl><div class="btn" data-b="start"><span class="key">SPACE</span><span>Start</span></div>' +
        '<div class="btn sm" data-b="pick"><span class="key">P</span><span>' + (st.player ? 'Someone else' : 'Pick who answers') + '</span></div></div>';
    } else if (ph === 'play') {
      if (st.fix && S.fix) h += '<div class="flash"' + scr.ea('fix') + '>' + WU.esc(S.fix) + '</div>';
      if (S.startersShow) h += '<div class="brow">' + split(S.starters).map(function (f) { return kit.frame(f, scr.ea('starters'), 'small'); }).join('') + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    } else {
      h += st.won ? '<div class="bigmsg"' + scr.ea('win') + '>' + WU.esc(kit.fill(S.win, { used: st.used })) + '</div>' : '<div class="bigmsg"' + scr.ea('lose') + '>' + WU.esc(S.lose) + '</div>';
      if (S.best) h += '<div class="pbig"' + scr.ea('best') + '>' + WU.esc(S.best) + '</div>';
    }
    h += '</div>';
    if (ph !== 'ready') {
      var left = max() - st.used;
      h += '<div class="pside"><div class="qcount' + (left <= 0 ? ' out' : left <= 3 ? ' low' : '') + '"><b data-auto>' + left + '</b><span' + scr.ea('left') + '>' + WU.esc(S.left) + '</span></div>' +
        '<div class="qlog">' + st.log.map(function (a) { var k = a === 'y' ? 'yes' : a === 'n' ? 'no' : 'maybe'; return '<i class="' + a + '"' + scr.ea(k) + '>' + WU.esc(S[k]) + '</i>'; }).join('') + '</div></div>';
    }
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.ptext'), 110, 44);
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); var a = b.getAttribute('data-b'); if (a === 'start') start(); else if (a === 'pick') pick(); };
    });
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['SPACE', 'start'], ['P', 'who answers'], ['O', own() ? 'secret from the list' : 'own secret'], ['Esc', 'home']]
      : ph === 'play' ? [['Y', 'yes'], ['N', 'no'], ['K', 'sometimes'], ['X', 'not yes / no'], ['G', 'guessed!'], ['Esc', 'home']]
      : [['SPACE', 'next round'], ['Esc', 'home']];
    kit.hints(root, hs.concat(sc), function (k) { keyAction(k); });
  }

  function pick() {
    if (st.phase !== 'ready') return;
    st.demo = false; st.picked = true;
    WU.pickStudent({ onPicked: function (n) { st.player = n; if (box) render(); } });
    render();
  }
  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock();
    // The secret is on the teacher screen: open it first (this key press or tap allows the window).
    if (!own() && WU.teacher && !WU.teacher.isTeacher && !WU.teacher.connected()) {
      WU.teacher.open(); WU.toast('The secret shows on the teacher screen. Press Space again to start.'); return;
    }
    st.rounds++; st.phase = 'play'; st.used = 0; st.log = []; st.won = false; st.fix = false;
    WU.sound.ding(); render();
  }
  function answer(a) {
    if (st.phase !== 'play') return;
    st.used++; st.log.push(a); st.fix = false;
    if (a === 'y') WU.sound.ding(); else if (a === 'n') WU.sound.beep(300); else WU.sound.pop();
    if (st.used >= max()) end(false); else render();
  }
  function fix() {
    if (st.phase !== 'play') return;
    st.fix = true; WU.sound.buzzer(); render();
    clearT(); timers.push(setTimeout(function () { if (st && st.fix) { st.fix = false; render(); } }, 2600));
  }
  function end(won) { clearT(); st.phase = 'end'; st.won = won; st.fix = false; if (won) WU.sound.slam(); else WU.sound.buzzer(); render(); }
  function next() {
    if (st.phase !== 'end') return;
    st.phase = 'ready'; st.demo = false; st.player = ''; newSecret(); WU.sound.pop(); render();
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready' && !st.rounds && !st.picked) st.demo = !!scr.get().demoShow;
    if (!secret()) newSecret();
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('twenty-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') start(); else if (ph === 'end') next(); else WU.toast('Y yes · N no · K sometimes · G guessed'); }
    else if (k === 'P') pick();
    else if (k === 'Y') answer('y');
    else if (k === 'N') answer('n');
    else if (k === 'K') answer('m');
    else if (k === 'X') fix();
    else if (k === 'G') { if (ph === 'play') end(true); }
    else if (k === 'O') { if (ph === 'ready') { WU.store.set('twenty-own', !own()); WU.sound.clack(); WU.toast(own() ? 'Own secret: the student thinks of something.' : 'Secret from the list (teacher screen).'); render(); } }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.twenty = {
    title: '20 Questions',
    teacher: function () {
      if (!st) return null;
      var it = secret(), sec = [], info = [];
      if (!own() && it) {
        if (it.pic) sec.push({ label: '', html: WU.pic(it.pic) });
        sec.push({ label: 'The secret', text: it.text, huge: true, hot: true });
        if (it.cat) sec.push({ label: 'Category', text: it.cat });
      } else if (own()) info.push({ label: 'Mode', text: 'Own secret: the student thinks of something (O = secret from the list).' });
      info.push({ label: 'Answers', text: thinker() || '(nobody yet: press P, or answer yourself)' });
      if (st.phase !== 'ready') info.push({ label: 'Questions left', text: (max() - st.used) + ' of ' + max() });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['P', 'pick who answers (they read the secret on the teacher screen)'], ['Space', 'start / next round'], ['Y / N / K', 'yes / no / sometimes: one question used'],
        ['X', 'not a yes / no question: no cost, fix it'], ['G', 'guessed!'], ['O', 'own secret on / off (no laptop needed)'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', player: '', id: null, used: 0, log: [], demo: !!scr.get().demoShow, rounds: 0 };
      el.innerHTML = '<div class="ptg twentyg"><div class="layer"></div>' + kit.header('20 Questions') + '<div class="hints"></div></div>';
      box = el.querySelector('.ptg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('twenty-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newSecret(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { p: 'P', y: 'Y', n: 'N', k: 'K', x: 'X', g: 'G', o: 'O', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
