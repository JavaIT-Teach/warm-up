/* Warm Up: HOT SEAT.
   One student sits with their back to the board. Words appear one at a time; the class describes, the student guesses
   before the timer ends. Score and a high score for the next student to beat.
   Keys: P pick a student (again = skip), Space start / got it / next student, P pass (during a round), 1-4 give the score to a team.
   Content: content/hotseat.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  /* ---------- editable lists ---------- */
  var scr = kit.screen({
    game: 'hotseat', title: 'Hot Seat', content: function () { return WU.content.hotseatScreen; },
    fields: [
      { type: 'head', label: 'Before the round' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'who', label: 'Question before a student is picked', type: 'text', max: 40 },
      { k: 'qMark', label: 'Shown before a student is picked', type: 'text', max: 4 },
      { k: 'rule', label: 'Rule line 1', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line 1', type: 'bool' },
      { k: 'rule2', label: 'Rule line 2', type: 'text', max: 90 }, { k: 'rule2Show', label: 'Rule line 2', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off', hint: 'The teacher sits in the hot seat first.' },
      { k: 'demoWho', label: 'Name in the demo round', type: 'text', max: 16 },
      { type: 'head', label: 'During the round' },
      { k: 'secs', label: 'Round length (seconds)', type: 'num', min: 15, max: 300 },
      { k: 'banned', label: 'Label before the banned words', type: 'text', max: 20 },
      { k: 'score', label: 'Score label', type: 'text', max: 16 },
      { k: 'high', label: 'High score ({n})', type: 'text', max: 30 },
      { k: 'beat', label: 'Score to beat ({n})', type: 'text', max: 30 },
      { type: 'head', label: 'After the round' },
      { k: 'result', label: 'Result ({name}, {n})', type: 'text', max: 40 },
      { k: 'newHigh', label: 'New high score', type: 'text', max: 30 },
      { k: 'award', label: 'With teams: question', type: 'text', max: 40 },
      { k: 'points', label: 'With teams: points ({n})', type: 'text', max: 30 }
    ]
  });
  WU.registerList('hotseat', 'words', {
    gameTitle: 'Hot Seat', label: 'Words',
    defaults: function (l) { return WU.content.hotseat[l].words; },
    norm: function (r) { var p = WU.PICS[r.pic]; return { text: r.text || (p ? p.name : ''), pic: r.pic || '', banned: r.banned || '' }; },
    title: function (it) { return it.text + (it.banned ? '  (not: ' + it.banned + ')' : ''); },
    fields: function (l) {
      return [
        { k: 'text', label: 'Word', type: 'text', max: 40 },
        { k: 'pic', label: 'Picture (empty = none)', type: 'pic' },
        { k: 'banned', label: 'Banned words, separated by commas (empty = none)', type: 'text', max: 80, hint: l >= 4 ? 'IELTS: three words the class must not say.' : 'Usually empty below IELTS.' }
      ];
    },
    blank: function () { return { text: 'new word', pic: '', banned: '' }; }
  });

  var root, box, st, sb = null, clock = null, offContent = null;
  var deck = kit.deck();

  function word() { return WU.list('hotseat', 'words', WU.state.level).filter(function (x) { return x.id === st.wid; })[0] || null; }
  function highKey() { return 'hot-high-' + WU.state.level; }
  function high() { return +WU.store.get(highKey(), 0) || 0; }
  function playerName() { var S = scr.get(); return st.demo ? S.demoWho : st.player || ''; }
  function nameAttr() { return st.demo ? scr.ea('demoWho') : ' data-auto'; }

  /* ---------- drawing ---------- */
  function render() {
    var S = scr.get(), h = '', ph = st.phase;
    h += '<div class="hcard">';
    if (ph === 'ready') {
      h += kit.chip(S.tag, scr.ea('tag'), '#ff4fc3');
      if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
      if (playerName()) h += '<div class="pname"' + nameAttr() + '>' + WU.esc(playerName()) + '</div>';
      else h += (S.who ? '<div class="hq"' + scr.ea('who') + '>' + WU.esc(S.who) + '</div>' : '') + '<div class="pname"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      if (S.rule2Show && S.rule2) h += '<div class="rule hot2"' + scr.ea('rule2') + '>' + WU.esc(S.rule2) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="start"><span class="key">SPACE</span><span>Start</span></div>' +
        '<div class="btn sm" data-b="pick"><span class="key">P</span><span>' + (playerName() && !st.demo ? 'Someone else' : 'Pick a student') + '</span></div></div>';
    } else if (ph === 'play') {
      var w = word();
      if (w) {
        var ek = function (f) { return ' data-edit="hotseat:words:' + w.id + ':' + f + '"'; };
        h += '<div class="wrow' + (st.flash ? ' in' : '') + '">' + (w.pic ? '<div class="wpic"' + ek('pic') + '>' + WU.pic(w.pic) + '</div>' : '') +
          '<div class="word"' + ek('text') + '>' + WU.esc(w.text) + '</div></div>';
        if (w.banned) {
          h += '<div class="banned">' + (S.banned ? '<span class="bl"' + scr.ea('banned') + '>' + WU.esc(S.banned) + '</span>' : '') +
            w.banned.split(',').map(function (b) { return b.trim(); }).filter(Boolean).map(function (b) { return '<span class="bw"' + ek('banned') + '>' + WU.esc(b) + '</span>'; }).join('') + '</div>';
        }
      } else h += '<div class="word"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="got"><span class="key">SPACE</span><span>Got it!</span></div>' +
        '<div class="btn sm" data-b="pass"><span class="key">P</span><span>Pass</span></div></div>';
    } else {
      h += kit.chip(S.tag, scr.ea('tag'), '#ff4fc3');
      if (S.result) h += '<div class="result"' + scr.ea('result') + '>' + WU.esc(kit.fill(S.result, { name: playerName() || '?', n: st.score })) + '</div>';
      if (st.newHigh && S.newHigh) h += '<div class="newhigh"' + scr.ea('newHigh') + '>' + WU.esc(S.newHigh) + '</div>';
      if (WU.state.teams && st.phase === 'award') {
        if (S.award) h += '<div class="rule"' + scr.ea('award') + '>' + WU.esc(S.award) + '</div>';
        h += '<div class="acts" data-ctrl>' + WU.state.teamNames.slice(0, WU.state.teams).map(function (nm, i) {
          return '<div class="btn sm" data-award="' + i + '" style="background:' + (WU.TEAM_COLORS[WU.state.teamColors[i]] || '#fff') + '"><span class="key">' + (i + 1) + '</span><span>' + WU.esc(nm || 'TEAM ' + (i + 1)) + '</span></div>';
        }).join('') + '</div>';
      }
      if (st.winner != null && S.points) h += '<div class="turn"' + scr.ea('points') + ' style="background:' + (WU.TEAM_COLORS[WU.state.teamColors[st.winner]] || '#fff') + '">' +
        WU.esc((WU.state.teamNames[st.winner] || 'TEAM ' + (st.winner + 1)) + ' ' + kit.fill(S.points, { n: st.score })) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="nextp"><span class="key">SPACE</span><span>Next student</span></div></div>';
    }
    h += '</div>';
    // Right side: timer, score, high score.
    h += '<div class="hside"><div class="tslot"></div>';
    if (ph === 'play') {
      h += '<div class="who"><span' + nameAttr() + '>' + WU.esc(playerName()) + '</span></div>';
      h += '<div class="scorebox"><div class="sl"' + scr.ea('score') + '>' + WU.esc(S.score) + '</div><div class="sn" data-auto>' + st.score + '</div></div>';
    }
    var hs = high();
    if (hs > 0 && S.high) h += '<div class="hs"' + scr.ea(ph === 'ready' ? 'beat' : 'high') + '>' + WU.esc(kit.fill(ph === 'ready' ? S.beat : S.high, { n: hs })) + '</div>';
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock) box.querySelector('.tslot').appendChild(clock.el);
    var wd = box.querySelector('.word'); if (wd) kit.fit(wd, 170, 72);
    wire(); renderHints();
  }
  function wire() {
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); var a = b.getAttribute('data-b');
        if (a === 'start') start(); else if (a === 'pick') pick(); else if (a === 'got') got(); else if (a === 'pass') pass(); else if (a === 'nextp') nextPlayer(); };
    });
    box.querySelectorAll('[data-award]').forEach(function (b) { b.onclick = function () { award(+b.getAttribute('data-award')); }; });
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ready' ? [['SPACE', 'start'], ['P', 'pick / someone else'], ['R', 'reset high score'], ['Esc', 'home']].concat(sc)
      : ph === 'play' ? [['SPACE', 'got it'], ['P', 'pass'], ['ENTER', 'pause / go'], ['Esc', 'home']].concat(sc)
      : ph === 'award' ? [['1-' + WU.state.teams, 'give the points'], ['SPACE', 'next student'], ['Esc', 'home']].concat(sc)
      : [['SPACE', 'next student'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, function (k) { keyAction(k); });
  }

  /* ---------- flow ---------- */
  function pick() {
    if (st.phase !== 'ready') return;
    st.demo = false;
    st.picked = true;
    WU.pickStudent({ onPicked: function (n) { st.player = n; if (box) render(); } });
    render();
  }
  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock();
    var S = scr.get(), w = deck(WU.list('hotseat', 'words', WU.state.level));
    st.rounds = (st.rounds || 0) + 1;
    st.wid = w ? w.id : null; st.score = 0; st.newHigh = false; st.winner = null; st.phase = 'play'; st.flash = true;
    clock = WU.Timer({ seconds: Math.max(15, +S.secs || 60), size: 380, onDone: end });
    render(); clock.start(); WU.sound.ding();
  }
  function nextWord() {
    var w = deck(WU.list('hotseat', 'words', WU.state.level));
    st.wid = w ? w.id : null; st.flash = true; render();
  }
  function got() { if (st.phase !== 'play') return; st.score++; WU.sound.ding(); nextWord(); }
  function pass() { if (st.phase !== 'play') return; WU.sound.clack(); nextWord(); }
  function end() {
    if (st.phase !== 'play') return;
    st.newHigh = st.score > high() && !st.demo;
    if (st.newHigh) WU.store.set(highKey(), st.score);
    st.phase = WU.state.teams && st.score > 0 ? 'award' : 'done';
    if (st.newHigh) WU.sound.slam();
    render();
  }
  function award(i) {
    if (st.phase !== 'award' || i >= WU.state.teams) return;
    st.winner = i; st.phase = 'done';
    if (sb) sb.add(i, st.score);
    render();
  }
  function nextPlayer() {
    if (st.phase !== 'done' && st.phase !== 'award') return;
    if (clock) { clock.destroy(); clock = null; }
    st.phase = 'ready'; st.demo = false; st.player = ''; st.score = 0; st.winner = null;
    render();
  }
  function refresh() {
    if (!st) return;
    // Settings loaded from GitHub after the game opened: the demo round follows them until the first round starts.
    if (st.phase === 'ready' && !st.rounds && !st.picked) st.demo = !!scr.get().demoShow;
    if (st.phase === 'play' && !word()) { var w = deck(WU.list('hotseat', 'words', WU.state.level)); st.wid = w ? w.id : null; }
    st.flash = false; render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('hot-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') start(); else if (ph === 'play') got(); else nextPlayer(); }
    else if (k === 'P') { if (ph === 'ready') pick(); else if (ph === 'play') pass(); }
    else if (k === 'ENTER') { if (ph === 'play' && clock) clock.toggle(); }
    else if (k === 'R') { if (ph === 'ready' && high()) { WU.store.set(highKey(), 0); WU.toast('High score reset.'); render(); } }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.hotseat = {
    title: 'Hot Seat',
    help: function () {
      return [['P', 'pick a student (again = someone else)'], ['Space', 'start / got it / next student'], ['P (in a round)', 'pass'], ['Enter', 'pause / go'],
        ['R', 'reset the high score'], ['1 - 4', 'after a round: give the score to a team'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', player: '', score: 0, wid: null, demo: !!scr.get().demoShow, winner: null };
      el.innerHTML = '<div class="hseat"><div class="layer"></div>' + kit.header('Hot Seat') + '<div class="hints"></div></div>';
      box = el.querySelector('.hseat');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('hot-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) { var wd = box.querySelector('.word'); if (wd) kit.fit(wd, 170, 72); } });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (st.phase === 'award') {
        var m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
        if (m && !e.shiftKey) { award(+m[1] - 1); return true; }
      }
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { p: 'P', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
