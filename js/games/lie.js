/* Warm Up: LIE DETECTOR.
   P picks a student and shows a question. The student secretly signals TRUTH or LIE to the teacher, who presses T or L
   (nothing on screen changes). The student answers, the class discusses and votes, R runs the polygraph and reveals.
   Keys: P pick, T / L secret truth / lie, Space next step, Up / Down lie votes (optional), R reveal, N new question.
   Content: content/lie.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'lie', title: 'Lie Detector', content: function () { return WU.content.lieScreen; },
    fields: [
      { type: 'head', label: 'Question' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'who', label: 'Before a student is picked', type: 'text', max: 40 },
      { k: 'qMark', label: 'Shown before a student is picked', type: 'text', max: 4 },
      { k: 'frame', label: 'Answer frame for every question at this level (empty = none)', type: 'text', max: 60, hint: 'A question can have its own frame.' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'signal', label: 'Secret signal line', type: 'text', max: 80 }, { k: 'signalShow', label: 'Secret signal line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first question only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { k: 'demoWho', label: 'Name in the demo round', type: 'text', max: 16 },
      { type: 'head', label: 'Before the vote' },
      { k: 'followers', label: 'Classmates who ask a follow-up question (0-2)', type: 'num', min: 0, max: 2 },
      { k: 'followTag', label: 'Tag', type: 'text', max: 20 },
      { k: 'follow', label: 'Follow-up line ({a} = classmate, {name} = the student)', type: 'text', max: 70 },
      { k: 'explainers', label: 'Students who explain why it is a lie (0-2)', type: 'num', min: 0, max: 2 },
      { k: 'explain', label: 'Explain line ({a}, {b} = the students)', type: 'text', max: 70 },
      { k: 'vote', label: 'How to vote', type: 'text', max: 70 },
      { k: 'votes', label: 'Vote count ({n})', type: 'text', max: 30 },
      { type: 'head', label: 'Reveal' },
      { k: 'scanning', label: 'While the machine works', type: 'text', max: 20 },
      { k: 'truth', label: 'Truth stamp', type: 'text', max: 12 },
      { k: 'lie', label: 'Lie stamp', type: 'text', max: 12 },
      { k: 'right', label: 'Class was right (shown when votes were counted)', type: 'text', max: 40 },
      { k: 'wrong', label: 'Class was wrong', type: 'text', max: 40 }
    ]
  });
  function qFields() {
    return [
      { k: 'text', label: 'Question (a yes / no question)', type: 'text', max: 110 },
      { k: 'pic', label: 'Picture', type: 'pic' },
      { k: 'frame', label: 'Answer frame for this question', type: 'text', max: 60,
        ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; }, hint: 'Empty = the level\'s frame.' }
    ];
  }
  function normQ(r) { return { text: r.text || '', pic: r.pic || '', frame: r.frame || '' }; }
  var blankQ = function () { return { text: 'Do you like ___?', pic: '', frame: '' }; };
  WU.registerList('lie', 'questions', { gameTitle: 'Lie Detector', label: 'Questions', defaults: function (l) { return WU.content.lie[l].questions; }, norm: normQ, fields: qFields, blank: blankQ });
  WU.registerList('lie', 'first', { gameTitle: 'Lie Detector', label: 'First-lesson questions', defaults: function (l) { return WU.content.lie[l].first; }, norm: normQ, fields: qFields, blank: blankQ });

  var root, box, st, sb = null, offContent = null, timers = [];
  var deck = kit.deck();

  function listName() { return WU.state.lesson === 'first' && WU.list('lie', 'first', WU.state.level).length ? 'first' : 'questions'; }
  function q() { return st.q ? WU.list('lie', st.q.list, WU.state.level).filter(function (x) { return x.id === st.q.id; })[0] || null : null; }
  function name() { return st.demo ? scr.get().demoWho : st.player; }
  function nameAttr() { return st.demo ? scr.ea('demoWho') : ' data-auto'; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newQuestion() {
    var ln = listName(), it = deck(WU.list('lie', ln, WU.state.level));
    st.q = it ? { list: ln, id: it.id } : null;
  }

  /* ---------- drawing ---------- */
  function questionHTML() {
    var it = q(), S = scr.get();
    if (!it) return '<div class="lq"><div class="qt"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div></div>';
    var ek = function (f) { return ' data-edit="lie:' + st.q.list + ':' + it.id + ':' + f + '"'; };
    return '<div class="lq">' + (it.pic ? '<div class="qpic"' + ek('pic') + '>' + WU.pic(it.pic) + '</div>' : '') + '<div class="qt"' + ek('text') + '>' + WU.esc(it.text) + '</div></div>';
  }
  function frameHTML() {
    var it = q(), S = scr.get();
    if (it && it.frame) return kit.frame(it.frame, ' data-edit="lie:' + st.q.list + ':' + it.id + ':frame"');
    return kit.frame(S.frame, scr.ea('frame'));
  }
  function render() {
    var S = scr.get(), ph = st.phase, h = '';
    if (ph === 'idle') {
      h += '<div class="lhead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') + '</div>';
      if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
      h += '<div class="lidle">' + (S.who ? '<div class="hq"' + scr.ea('who') + '>' + WU.esc(S.who) + '</div>' : '') +
        (st.demo ? '<div class="lname"' + nameAttr() + '>' + WU.esc(name()) + '</div>' : '<div class="lname"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>') +
        '<div class="acts" data-ctrl>' + (st.demo ? '<div class="btn" data-b="go"><span class="key">SPACE</span><span>Show the question</span></div>' : '') +
        '<div class="btn' + (st.demo ? ' sm' : '') + '" data-b="pick"><span class="key">P</span><span>Pick a student</span></div></div></div>';
    } else if (ph === 'ask' || ph === 'vote') {
      h += '<div class="lhead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') + '<div class="lname sm"' + nameAttr() + '>' + WU.esc(name()) + '</div></div>';
      if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
      h += questionHTML() + '<div class="lbottom">';
      if (ph === 'ask') {
        h += '<div class="brow">' + frameHTML() + '</div>';
        if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
        if (S.signalShow && S.signal) h += '<div class="rule hot"' + scr.ea('signal') + '>' + WU.esc(S.signal) + '</div>';
      } else {
        var who = name();
        if (st.followers.length && S.follow) h += '<div class="brow">' + kit.chip(S.followTag, scr.ea('followTag'), '#00e5c7') +
          '<div class="rule big"' + scr.ea('follow') + '>' + WU.esc(kit.fill(S.follow, { a: st.followers.join(' + '), name: who })) + '</div></div>';
        if (st.explainers.length && S.explain) h += '<div class="rule big"' + scr.ea('explain') + '>' + WU.esc(kit.fill(S.explain, { a: st.explainers[0], b: st.explainers[1] || '', name: who })) + '</div>';
        if (S.vote) h += '<div class="rule hot"' + scr.ea('vote') + '>' + WU.esc(S.vote) + '</div>';
        if (st.votes != null && S.votes) h += '<div class="count"' + scr.ea('votes') + '>' + WU.esc(kit.fill(S.votes, { n: st.votes })) + '</div>';
      }
      h += '</div>';
    } else {
      // Polygraph and verdict.
      h += '<div class="lhead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') + '<div class="lname sm"' + nameAttr() + '>' + WU.esc(name()) + '</div></div>';
      h += '<div class="poly"><svg viewBox="0 0 1600 360" preserveAspectRatio="none"><polyline class="needle" points="' + st.wave + '" fill="none" stroke="#c6ff00" stroke-width="7" stroke-linejoin="round"></polyline></svg>' +
        '<div class="grid-l"></div></div>';
      if (ph === 'scan') h += '<div class="scan"' + scr.ea('scanning') + '>' + WU.esc(S.scanning) + '</div>';
      else {
        var lie = st.secret === 'L';
        h += '<div class="stamp ' + (lie ? 'is-lie' : 'is-truth') + '"' + scr.ea(lie ? 'lie' : 'truth') + '>' + WU.esc(lie ? S.lie : S.truth) + '</div>';
        if (st.votes != null) {
          var half = WU.roster().length / 2, saidLie = st.votes > half, right = saidLie === lie;
          var t = right ? S.right : S.wrong;
          if (t) h += '<div class="verdict"' + scr.ea(right ? 'right' : 'wrong') + '>' + WU.esc(t) + '</div>';
        }
      }
    }
    box.querySelector('.layer').innerHTML = h;
    var qt = box.querySelector('.qt'); if (qt) kit.fit(qt, 110, 56);
    wire(); renderHints();
    if (ph === 'scan') drawNeedle();
  }
  function wire() {
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function () { var a = b.getAttribute('data-b'); if (a === 'pick') pick(); else if (a === 'go') ask(); };
    });
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    // The same hints whether or not T / L was pressed: the class must not see a difference.
    var hs = ph === 'idle' ? [['P', 'pick a student']].concat(st.demo ? [['SPACE', 'teacher demo']] : [], [['Esc', 'home']], sc)
      : ph === 'ask' ? [['T / L', 'truth / lie (secret)'], ['SPACE', 'vote'], ['R', 'reveal'], ['N', 'other question'], ['Esc', 'home']].concat(sc)
      : ph === 'vote' ? [['UP / DOWN', 'lie votes'], ['R', 'reveal'], ['Esc', 'home']].concat(sc)
      : ph === 'scan' ? [['Esc', 'home']] : [['P', 'next student'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, function (k) { if (k === 'UP / DOWN') keyAction('UP'); else if (k !== 'T / L') keyAction(k); });
  }

  /* ---------- flow ---------- */
  function pick() {
    if (st.phase === 'scan') return;
    clearT(); st.demo = false;
    WU.pickStudent({ onPicked: function (n) { st.player = n; }, onClose: function () { if (st && box && st.player && WU.current === 'lie') ask(); } });
  }
  function ask() {
    clearT(); st.asked = true;
    st.secret = null; st.votes = null; st.followers = []; st.explainers = [];
    newQuestion(); st.phase = 'ask'; WU.sound.pop(); render();
  }
  function toVote() {
    if (st.phase !== 'ask') return;
    var S = scr.get(), not = st.demo ? [] : [st.player], i;
    for (i = 0; i < Math.min(2, +S.followers || 0); i++) { var a = kit.student(not); st.followers.push(a); not = not.concat([a]); }
    for (i = 0; i < Math.min(2, +S.explainers || 0); i++) { var b = kit.student(not); st.explainers.push(b); not = not.concat([b]); }
    st.phase = 'vote'; WU.sound.clack(); render();
  }
  function secret(v) {
    if (st.phase !== 'ask' && st.phase !== 'vote') return;
    st.secret = v; // Nothing on screen changes.
  }
  function wave(n, amp) {
    var pts = [], y = 180;
    for (var i = 0; i <= n; i++) { y = 180 + (Math.random() * 2 - 1) * amp * (i % 7 === 0 ? 1.6 : 1); pts.push(Math.round(i * 1600 / n) + ',' + Math.round(Math.max(10, Math.min(350, y)))); }
    return pts.join(' ');
  }
  function reveal() {
    if (st.phase !== 'ask' && st.phase !== 'vote') return;
    if (!st.secret) { WU.toast('Press T or L first (secret).'); return; }
    WU.sound.unlock();
    st.phase = 'scan'; st.wave = wave(80, 60); render();
    var dur = WU.isCalm() ? 1200 : 3400, t = 0, iv = 380;
    // Beeps that speed up, then the verdict.
    var beep = function () {
      if (!st || st.phase !== 'scan') return;
      WU.sound.beep(700 + t / 6); t += iv; iv = Math.max(90, iv * 0.82);
      if (t < dur) timers.push(setTimeout(beep, iv));
    };
    beep();
    timers.push(setTimeout(function () {
      if (!st) return;
      st.phase = 'done'; st.wave = wave(80, st.secret === 'L' ? 170 : 25);
      if (st.secret === 'L') WU.sound.buzzer(); else WU.sound.ding();
      WU.sound.slam(); render();
    }, dur + 150));
  }
  function drawNeedle() {
    var n = box.querySelector('.needle'); if (!n || WU.isCalm()) return;
    var len = 4000; n.style.strokeDasharray = len; n.style.strokeDashoffset = len;
    n.getBoundingClientRect(); n.style.transition = 'stroke-dashoffset 3.2s linear'; n.style.strokeDashoffset = 0;
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'idle' && !st.player && !st.asked) st.demo = !!scr.get().demoShow;
    if (st.q && !q()) newQuestion();
    if (st.phase !== 'scan') render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('lie-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'P') pick();
    else if (k === 'T') secret('T');
    else if (k === 'L') secret('L');
    else if (k === 'R') reveal();
    else if (k === 'SPACE') { if (ph === 'idle' && st.demo) ask(); else if (ph === 'ask') toVote(); else if (ph === 'done') pick(); }
    else if (k === 'N') { if (ph === 'ask') { st.secret = null; newQuestion(); render(); } }
    else if (k === 'UP') { if (ph === 'vote') { st.votes = Math.min(99, (st.votes || 0) + 1); render(); } }
    else if (k === 'DOWN') { if (ph === 'vote') { st.votes = Math.max(0, (st.votes || 0) - 1); render(); } }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.lie = {
    title: 'Lie Detector',
    teacher: function () {
      if (!st) return null;
      var sec = [], info = [], it = q();
      if (st.phase === 'ask' || st.phase === 'vote' || st.phase === 'scan') {
        sec.push({ label: 'Secret answer', text: st.secret === 'T' ? 'TRUTH' : st.secret === 'L' ? 'LIE' : 'Not set yet: press T or L', big: true, hot: !st.secret });
      }
      if (st.phase === 'done') sec.push({ label: 'Secret answer', text: st.secret === 'L' ? 'LIE' : 'TRUTH' });
      if (name()) info.push({ label: 'Student', text: name() });
      if (it && st.phase !== 'idle') info.push({ label: 'Question', text: it.text });
      if (st.followers.length) info.push({ label: 'Follow-up question', text: st.followers.join(', ') });
      if (st.explainers.length) info.push({ label: 'Explain why it is a lie', text: st.explainers.join(', ') });
      if (st.votes != null) info.push({ label: 'Lie votes', text: st.votes + ' of ' + WU.roster().length });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['P', 'pick a student'], ['T / L', 'secret: truth / lie'], ['Space', 'next step'], ['Up / Down', 'count lie votes (optional)'],
        ['R', 'reveal'], ['N', 'another question'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'idle', player: '', q: null, secret: null, votes: null, followers: [], explainers: [], demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="lie"><div class="layer"></div>' + kit.header('Lie Detector') + '<div class="hints"></div></div>';
      box = el.querySelector('.lie');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('lie-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      // Measure text again once the bundled fonts have loaded.
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box && st.phase !== 'rolling') render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'ArrowUp') { keyAction('UP'); return true; }
      if (e.key === 'ArrowDown') { keyAction('DOWN'); return true; }
      var map = { p: 'P', t: 'T', l: 'L', r: 'R', n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
