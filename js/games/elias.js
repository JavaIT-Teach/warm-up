/* Warm Up: ELIAS (Pre-Intermediate and up).
   Teams take turns. One student from the team explains the words on the board; only their own team guesses.
   The guessing team sits with their backs to the board, the explainer faces it. Got it = +1, skip = -1 (if on).
   Time up: the last word can be stolen by any team. Then the teacher checks the list and the points go to the team.
   First team to the goal wins.
   Keys: P pick the explainer, Space start / got it / next, X skip, Enter pause, 1-4 steal the last word (0 = nobody), R new match.
   Content: content/elias.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  /* ---------- editable lists ---------- */
  var scr = kit.screen({
    game: 'elias', title: 'Elias', content: function () { return WU.content.eliasScreen; },
    fields: [
      { type: 'head', label: 'The match' },
      { k: 'goal', label: 'Points to win', type: 'num', min: 5, max: 100 },
      { k: 'secs', label: 'Turn length (seconds)', type: 'num', min: 15, max: 300 },
      { k: 'skipMinus', label: 'A skipped word costs a point', type: 'bool', on: 'Yes', off: 'No' },
      { k: 'lastShow', label: 'Last word: any team can steal it', type: 'bool', on: 'On', off: 'Off' },
      { k: 'wordOnBoard', label: 'Where the word shows', type: 'bool', on: 'Board', off: 'Laptop only',
        hint: 'Laptop only: the explainer reads the word on the teacher screen (V); the board shows the timer and scores. Board: the guessing team must not see the board.' },
      { k: 'teamA', label: 'Team 1 name when teams are off in Settings', type: 'text', max: 16 },
      { k: 'teamB', label: 'Team 2 name when teams are off in Settings', type: 'text', max: 16 },
      { type: 'head', label: 'Before the turn' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'turn', label: 'Whose turn ({team})', type: 'text', max: 30 },
      { k: 'goalText', label: 'Goal ({n})', type: 'text', max: 30 },
      { k: 'who', label: 'Question before the explainer is picked', type: 'text', max: 40 },
      { k: 'qMark', label: 'Shown before the explainer is picked', type: 'text', max: 4 },
      { k: 'rule', label: 'Rule line 1', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line 1', type: 'bool' },
      { k: 'rule2', label: 'Rule line 2', type: 'text', max: 90 }, { k: 'rule2Show', label: 'Rule line 2', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first turn only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo turn', type: 'bool', on: 'On', off: 'Off', hint: 'The teacher explains first (no points).' },
      { k: 'demoWho', label: 'Name in the demo turn', type: 'text', max: 16 },
      { k: 'laptopTip', label: 'Laptop only: where the explainer stands', type: 'text', max: 70 },
      { type: 'head', label: 'During the turn' },
      { k: 'hidden', label: 'Laptop only: shown on the board instead of the word', type: 'text', max: 50 },
      { k: 'frame', label: 'Sentence frame for the explainer (empty = none)', type: 'text', max: 70, hint: 'Use ___ for the gap.' },
      { k: 'banned', label: 'Label before the banned words', type: 'text', max: 20 },
      { k: 'got', label: 'Guessed label', type: 'text', max: 16 },
      { k: 'skipped', label: 'Skipped label', type: 'text', max: 16 },
      { type: 'head', label: 'After the turn' },
      { k: 'last', label: 'Last word banner', type: 'text', max: 50 },
      { k: 'lastAsk', label: 'Last word question ({n} = number of teams)', type: 'text', max: 40 },
      { k: 'nobody', label: 'Last word: nobody button', type: 'text', max: 16 },
      { k: 'review', label: 'Check the list', type: 'text', max: 60 },
      { k: 'roundPts', label: 'Points this turn ({team}, {n})', type: 'text', max: 40 },
      { k: 'win', label: 'Winner ({team})', type: 'text', max: 30 }
    ]
  });
  WU.registerList('elias', 'words', {
    gameTitle: 'Elias', label: 'Words',
    defaults: function (l) { return WU.content.elias[l].words; },
    norm: function (r) { return { text: r.text || '', banned: r.banned || '' }; },
    title: function (it) { return it.text + (it.banned ? '  (not: ' + it.banned + ')' : ''); },
    fields: function (l) {
      return [
        { k: 'text', label: 'Word', type: 'text', max: 40 },
        { k: 'banned', label: 'Banned words, separated by commas (empty = none)', type: 'text', max: 80, hint: l >= 4 ? 'IELTS: three words the explainer must not say.' : 'Usually empty below IELTS.' }
      ];
    },
    blank: function () { return { text: 'new word', banned: '' }; }
  });

  var root, box, st, clock = null, offContent = null;
  var deck = kit.deck();

  /* ---------- teams: Settings teams, or two teams of its own ---------- */
  function nTeams() { return WU.state.teams || 2; }
  function teamName(i) {
    if (WU.state.teams) return WU.state.teamNames[i] || 'TEAM ' + (i + 1);
    var S = scr.get(); return (i === 0 ? S.teamA : S.teamB) || 'TEAM ' + (i + 1);
  }
  function teamColor(i) { return WU.state.teams ? (WU.TEAM_COLORS[WU.state.teamColors[i]] || WU.TEAM_COLORS[i]) : [WU.C.lime, WU.C.pink][i]; }
  function teamAttr(i) { return WU.state.teams ? ' data-auto' : scr.ea(i === 0 ? 'teamA' : 'teamB'); }
  function scoresKey() { return 'elias-scores-' + WU.state.level; }
  function loadScores() {
    var s = WU.store.get(scoresKey(), null);
    if (!Array.isArray(s) || s.length !== 4) s = [0, 0, 0, 0];
    return s;
  }
  function saveScores() { WU.store.set(scoresKey(), st.scores); }

  function words() { return WU.list('elias', 'words', WU.state.level); }
  function byId(id) { return words().filter(function (x) { return x.id === id; })[0] || null; }
  function cur() { return st.wid ? byId(st.wid) : null; }
  function playerName() { var S = scr.get(); return st.demo ? S.demoWho : st.player || ''; }
  function nameAttr() { return st.demo ? scr.ea('demoWho') : ' data-auto'; }
  function turnPoints() {
    var S = scr.get(), n = 0;
    st.log.forEach(function (x) { if (x.got) n++; else if (S.skipMinus) n--; });
    return n;
  }
  function onBoard() { return !!scr.get().wordOnBoard; }
  function wordAttr(id, f) { return ' data-edit="elias:words:' + id + ':' + f + '"'; }

  /* ---------- drawing ---------- */
  function teamChip(i, extra) {
    return '<span class="el-team"' + teamAttr(i) + ' style="background:' + teamColor(i) + '">' + WU.esc(teamName(i)) + (extra || '') + '</span>';
  }
  function render() {
    var S = scr.get(), h = '', ph = st.phase, t = st.team;
    h += '<div class="hcard">';
    if (ph === 'ready') {
      h += '<div class="el-top">' + kit.chip(S.tag, scr.ea('tag'), '#3d6bff') +
        (S.turn && !st.demo ? '<div class="el-turn"' + scr.ea('turn') + ' style="background:' + teamColor(t) + '">' + WU.esc(kit.fill(S.turn, { team: teamName(t) })) + '</div>' : '') + '</div>';
      if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
      if (playerName()) h += '<div class="pname"' + nameAttr() + '>' + WU.esc(playerName()) + '</div>';
      else h += (S.who ? '<div class="hq"' + scr.ea('who') + '>' + WU.esc(S.who) + '</div>' : '') + '<div class="pname"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      if (S.rule2Show && S.rule2) h += '<div class="rule hot2"' + scr.ea('rule2') + '>' + WU.esc(S.rule2) + '</div>';
      if (!S.wordOnBoard && S.laptopTip) h += '<div class="el-tip"' + scr.ea('laptopTip') + '>' + WU.esc(S.laptopTip) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="start"><span class="key">SPACE</span><span>Start</span></div>' +
        '<div class="btn sm" data-b="pick"><span class="key">P</span><span>' + (playerName() && !st.demo ? 'Someone else' : 'Who explains?') + '</span></div></div>';
    } else if (ph === 'play' || ph === 'last') {
      var w = cur();
      if (ph === 'last' && S.last) h += '<div class="el-last"' + scr.ea('last') + '>' + WU.esc(S.last) + '</div>';
      if (w && !S.wordOnBoard) {
        h += '<div class="wrow el-hid' + (st.flash ? ' in' : '') + '"><div class="el-lap" data-ctrl>' + WU.icons.teacher + '</div>' +
          '<div class="el-hidt"' + scr.ea('hidden') + '>' + WU.esc(S.hidden) + '</div></div>';
        if (S.frame && ph === 'play') h += kit.frame(S.frame, scr.ea('frame'));
      } else if (w) {
        h += '<div class="wrow' + (st.flash ? ' in' : '') + '"><div class="word"' + wordAttr(w.id, 'text') + '>' + WU.esc(w.text) + '</div></div>';
        if (S.frame && ph === 'play') h += kit.frame(S.frame, scr.ea('frame'));
        if (w.banned) {
          h += '<div class="banned">' + (S.banned ? '<span class="bl"' + scr.ea('banned') + '>' + WU.esc(S.banned) + '</span>' : '') +
            w.banned.split(',').map(function (b) { return b.trim(); }).filter(Boolean).map(function (b) { return '<span class="bw"' + wordAttr(w.id, 'banned') + '>' + WU.esc(b) + '</span>'; }).join('') + '</div>';
        }
      } else h += '<div class="word"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>';
      if (ph === 'play') {
        h += '<div class="acts" data-ctrl><div class="btn" data-b="got"><span class="key">SPACE</span><span>Got it!</span></div>' +
          '<div class="btn sm" data-b="skip"><span class="key">X</span><span>Skip' + (S.skipMinus && !st.demo ? ' (&minus;1)' : '') + '</span></div></div>';
      } else {
        if (S.lastAsk) h += '<div class="rule"' + scr.ea('lastAsk') + '>' + WU.esc(kit.fill(S.lastAsk, { n: nTeams() })) + '</div>';
        h += '<div class="acts" data-ctrl>';
        for (var i = 0; i < nTeams(); i++) {
          h += '<div class="btn sm" data-steal="' + i + '" style="background:' + teamColor(i) + '"><span class="key">' + (i + 1) + '</span><span>' + WU.esc(teamName(i)) + '</span></div>';
        }
        h += '<div class="btn sm" data-steal="-1"><span class="key">0</span><span' + scr.ea('nobody') + '>' + WU.esc(S.nobody) + '</span></div></div>';
      }
    } else if (ph === 'review') {
      if (S.review) h += '<div class="rule"' + scr.ea('review') + '>' + WU.esc(S.review) + '</div>';
      h += '<div class="el-list">' + st.log.map(function (x, k) {
        var it = byId(x.id);
        return '<div class="el-w ' + (x.got ? 'ok' : 'no') + '" data-tog="' + k + '"><span class="m" data-ctrl>' + (x.got ? '&#10003;' : '&#10007;') + '</span>' +
          '<span' + (it ? wordAttr(it.id, 'text') : ' data-auto') + '>' + WU.esc(it ? it.text : x.text) + '</span></div>';
      }).join('') + '</div>';
      if (st.steal) {
        var sw = byId(st.steal.id);
        h += '<div class="el-steal">' + teamChip(st.steal.team, ' +1') + '<span' + (sw ? wordAttr(sw.id, 'text') : ' data-auto') + '>' + WU.esc(sw ? sw.text : st.steal.text) + '</span></div>';
      }
      if (S.roundPts && !st.demo) h += '<div class="turn"' + scr.ea('roundPts') + ' style="background:' + teamColor(t) + '">' + WU.esc(kit.fill(S.roundPts, { team: teamName(t), n: (turnPoints() > 0 ? '+' : turnPoints() < 0 ? '\u2212' : '') + Math.abs(turnPoints()) })) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="bank"><span class="key">SPACE</span><span>' + (st.demo ? 'Start the game' : 'Add the points') + '</span></div></div>';
    } else if (ph === 'win') {
      h += kit.chip(S.tag, scr.ea('tag'), '#3d6bff');
      h += '<div class="result el-win"' + scr.ea('win') + ' style="background:' + teamColor(st.winner) + '">' + WU.esc(kit.fill(S.win, { team: teamName(st.winner) })) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn" data-b="newmatch"><span class="key">SPACE</span><span>New match</span></div></div>';
    }
    h += '</div>';
    // Right side: timer, explainer, turn tally, match scores.
    h += '<div class="hside"><div class="tslot"></div>';
    if (ph === 'play' || ph === 'last') {
      h += '<div class="who"><span' + nameAttr() + '>' + WU.esc(playerName()) + '</span></div>';
      var g = st.log.filter(function (x) { return x.got; }).length, sk = st.log.length - g;
      h += '<div class="el-tally"><div class="ok"><span' + scr.ea('got') + '>' + WU.esc(S.got) + '</span><b data-auto>' + g + '</b></div>' +
        '<div class="no"><span' + scr.ea('skipped') + '>' + WU.esc(S.skipped) + '</span><b data-auto>' + sk + '</b></div></div>';
    }
    h += '<div class="el-score">';
    if (S.goalText) h += '<div class="el-goal"' + scr.ea('goalText') + '>' + WU.esc(kit.fill(S.goalText, { n: goal() })) + '</div>';
    for (var j = 0; j < nTeams(); j++) {
      var pc = Math.min(100, Math.round(st.scores[j] / goal() * 100));
      h += '<div class="el-row' + (j === t && ph !== 'win' ? ' on' : '') + '"><div class="el-bar" data-auto style="width:' + pc + '%;background:' + teamColor(j) + '"></div>' +
        '<span class="el-tn"' + teamAttr(j) + '>' + WU.esc(teamName(j)) + '</span><b data-auto>' + st.scores[j] + '</b></div>';
    }
    h += '</div></div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock && (ph === 'play' || ph === 'last')) box.querySelector('.tslot').appendChild(clock.el);
    var wd = box.querySelector('.word'); if (wd) kit.fit(wd, 170, 64);
    wire(); renderHints();
  }
  function goal() { return Math.max(5, +scr.get().goal || 15); }
  function wire() {
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); var a = b.getAttribute('data-b');
        if (a === 'start') start(); else if (a === 'pick') pick(); else if (a === 'got') got(); else if (a === 'skip') skip();
        else if (a === 'bank') bank(); else if (a === 'newmatch') newMatch(); };
    });
    box.querySelectorAll('[data-steal]').forEach(function (b) { b.onclick = function () { steal(+b.getAttribute('data-steal')); }; });
    box.querySelectorAll('[data-tog]').forEach(function (b) {
      b.onclick = function (e) { if (WU.editing) return; e.stopPropagation(); toggle(+b.getAttribute('data-tog')); };
    });
  }
  function renderHints() {
    var ph = st.phase, n = nTeams();
    var hs = ph === 'ready' ? [['SPACE', 'start'], ['P', 'who explains'], ['R', 'new match'], ['Esc', 'home']]
      : ph === 'play' ? [['SPACE', 'got it'], ['X', 'skip'], ['ENTER', 'pause / go'], ['Esc', 'home']]
      : ph === 'last' ? [['1-' + n, 'who stole it'], ['0', 'nobody'], ['Esc', 'home']]
      : ph === 'review' ? [['SPACE', 'add the points'], ['Esc', 'home']]
      : [['SPACE', 'new match'], ['Esc', 'home']];
    kit.hints(root, hs, function (k) { keyAction(k); });
  }

  /* ---------- flow ---------- */
  function pick() {
    if (st.phase !== 'ready') return;
    st.demo = false; st.picked = true;
    WU.pickStudent({ onPicked: function (n) { st.player = n; if (box) render(); } });
    render();
  }
  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock();
    // Laptop only: the word is on the teacher screen. Open it first (this key press or tap allows the window).
    if (!onBoard() && WU.teacher && !WU.teacher.isTeacher && !WU.teacher.connected()) {
      WU.teacher.open(); WU.toast('The word shows on the teacher screen. Press Space again to start.'); return;
    }
    var S = scr.get(), w = deck(words());
    st.turns = (st.turns || 0) + 1;
    st.wid = w ? w.id : null; st.log = []; st.steal = null; st.phase = 'play'; st.flash = true;
    if (clock) clock.destroy();
    clock = WU.Timer({ seconds: Math.max(15, +S.secs || 60), size: 330, onDone: timeUp });
    render(); clock.start(); WU.sound.ding();
  }
  function nextWord() { var w = deck(words()); st.wid = w ? w.id : null; st.flash = true; render(); }
  function logCur(gotIt) { var w = cur(); if (w) st.log.push({ id: w.id, text: w.text, got: gotIt }); }
  function got() { if (st.phase !== 'play') return; logCur(true); WU.sound.ding(); nextWord(); }
  function skip() { if (st.phase !== 'play') return; logCur(false); WU.sound.clack(); nextWord(); }
  function timeUp() {
    if (st.phase !== 'play') return;
    WU.sound.slam();
    if (scr.get().lastShow && cur() && !st.demo) { st.phase = 'last'; st.flash = false; render(); }
    else { st.phase = 'review'; render(); }
  }
  function steal(i) {
    if (st.phase !== 'last' || i >= nTeams()) return;
    var w = cur();
    if (i >= 0 && w) {
      // The explainer's own team guessed it: a normal word. Another team: a stolen point.
      if (i === st.team) st.log.push({ id: w.id, text: w.text, got: true });
      else st.steal = { id: w.id, text: w.text, team: i };
      WU.sound.ding();
    }
    st.phase = 'review'; render();
  }
  function toggle(k) { if (st.phase !== 'review' || !st.log[k]) return; st.log[k].got = !st.log[k].got; WU.sound.clack(); render(); }
  function bank() {
    if (st.phase !== 'review') return;
    if (clock) { clock.destroy(); clock = null; }
    if (!st.demo) {
      st.scores[st.team] = Math.max(0, st.scores[st.team] + turnPoints());
      if (st.steal) st.scores[st.steal.team] += 1;
      saveScores();
      var best = -1, bi = -1;
      for (var i = 0; i < nTeams(); i++) if (st.scores[i] >= goal() && st.scores[i] > best) { best = st.scores[i]; bi = i; }
      if (bi >= 0) { st.winner = bi; st.phase = 'win'; WU.sound.slam(); render(); return; }
      st.team = (st.team + 1) % nTeams();
    }
    st.phase = 'ready'; st.demo = false; st.player = ''; st.log = []; st.steal = null; st.wid = null;
    render();
  }
  function newMatch() {
    if (clock) { clock.destroy(); clock = null; }
    st.scores = [0, 0, 0, 0]; saveScores();
    st.team = 0; st.winner = null; st.phase = 'ready'; st.player = ''; st.log = []; st.steal = null; st.wid = null;
    render();
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready' && !st.turns && !st.picked) st.demo = !!scr.get().demoShow;
    if (st.team >= nTeams()) st.team = 0;
    if (st.phase === 'play' && !cur()) { var w = deck(words()); st.wid = w ? w.id : null; }
    st.flash = false; render();
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') start(); else if (ph === 'play') got(); else if (ph === 'review') bank(); else if (ph === 'win') newMatch(); }
    else if (k === 'P') pick();
    else if (k === 'X') skip();
    else if (k === 'ENTER') { if (ph === 'play' && clock) clock.toggle(); }
    else if (k === '0') steal(-1);
    else if (/^[1-4]$/.test(k)) steal(+k - 1);
    else if (k === 'R') { if (ph === 'ready' || ph === 'win') { newMatch(); WU.toast('New match: scores back to 0.'); } }
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.elias = {
    title: 'Elias',
    teacher: function () {
      if (!st) return null;
      var sec = [], info = [], w = cur();
      if ((st.phase === 'play' || st.phase === 'last') && w) {
        sec.push({ label: onBoard() ? 'The word' : 'Explainer: explain this word', text: w.text, big: true, huge: !onBoard(), hot: true });
        if (w.banned) sec.push({ label: 'Banned words', text: w.banned, big: !onBoard() });
      }
      info.push({ label: 'Turn', text: teamName(st.team) + (playerName() ? ' · ' + playerName() + ' explains' : '') });
      if (st.log.length) info.push({ label: 'This turn', text: st.log.map(function (x) { return (x.got ? '✓ ' : '✗ ') + x.text; }).join(', ') });
      var sc = []; for (var i = 0; i < nTeams(); i++) sc.push(teamName(i) + ' ' + st.scores[i]);
      info.push({ label: 'Match (to ' + goal() + ')', text: sc.join(' · ') });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['P', 'pick who explains (again = someone else)'], ['Space', 'start / got it / add the points'], ['X', 'skip the word'], ['Enter', 'pause / go'],
        ['1 - 4', 'last word: which team guessed it'], ['0', 'last word: nobody'], ['Tap a word', 'after the turn: change ✓ / ✗'], ['R', 'new match (scores to 0)']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', player: '', team: 0, scores: [0, 0, 0, 0], log: [], steal: null, wid: null, demo: !!scr.get().demoShow, winner: null };
      st.scores = loadScores();
      el.innerHTML = '<div class="hseat elias"><div class="layer"></div>' + kit.header('Elias') + '<div class="hints"></div></div>';
      box = el.querySelector('.hseat');
      WU.wireCommon(el);
      // Elias keeps its own match score (right side); the app scoreboard is not used here.
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = function () { WU.toast('Elias keeps its own match score on the right.'); };
      render();
      offContent = WU.on('content', refresh);
    },
    unmount: function () { if (clock) clock.destroy(); clock = null; if (offContent) offContent(); root = box = st = null; },
    onKey: function (e) {
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var m = /^(?:Digit|Numpad)([0-4])$/.exec(e.code);
      if (m && !e.shiftKey && st.phase === 'last') { keyAction(m[1]); return true; }
      var map = { p: 'P', x: 'X', r: 'R' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
