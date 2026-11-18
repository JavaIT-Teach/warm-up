/* Warm Up on a phone: ELIAS, pass-the-phone (see js/phone/shell.js).
   The one phone game for a group: 2+ players in teams (pairs in class, friends at home). The explainer holds the phone,
   their team guesses, the phone keeps the time, the words and the match score. Same words, rules and timing as the board
   (Screen text & timing of Elias at this level). The players judge "got it"; the phone checks nothing. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;
  var COLS = ['#c6ff00', '#ff4fc3', '#3d6bff', '#ffe600'];

  P.games.elias = (function () {
    var body, ctx, st, tickT = null;
    function S() { return ctx.S; }
    function words() { return WU.list('elias', 'words', ctx.level).filter(function (w) { return w.text; }); }
    function goal() { return Math.max(5, +S().goal || 15); }
    function secs() { return Math.max(15, Math.min(300, +S().secs || 60)); }
    function teamName(i) { var s = S(); return i === 0 ? s.teamA || 'TEAM A' : i === 1 ? s.teamB || 'TEAM B' : 'TEAM ' + 'ABCD'[i]; }
    function chip(i, extra) { return '<span class="eteam" style="background:' + COLS[i] + '">' + esc(teamName(i)) + (extra || '') + '</span>'; }
    function frameHTML(f) { return f ? '<div class="pframe">' + esc(f).replace(/___/g, '<span class="pgap"></span>') + '</div>' : ''; }
    var deck = WU.kit.deck();
    function draw() { var w = deck(words()); st.word = w ? { id: w.id, text: w.text, banned: w.banned } : null; }
    function points() { var n = 0; st.log.forEach(function (x) { if (x.got) n++; else if (S().skipMinus) n--; }); return n; }
    function signed(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n); }

    function newMatch(teams) {
      st = { phase: 'setup', teams: teams || (st && st.teams) || 2, scores: [0, 0, 0, 0], team: 0, log: [], steal: null, word: null, winner: null };
    }
    function scoresHTML() {
      var h = '<div class="escores"><p class="plabel">' + esc(P.fill(S().goalText || 'First to {n} wins!', { n: goal() })) + '</p>';
      for (var i = 0; i < st.teams; i++) {
        h += '<div class="erow' + (i === st.team && st.phase !== 'win' ? ' on' : '') + '"><i style="width:' + Math.min(100, Math.round(st.scores[i] / goal() * 100)) + '%;background:' + COLS[i] + '"></i>' +
          '<span>' + esc(teamName(i)) + '</span><b>' + st.scores[i] + '</b></div>';
      }
      return h + '</div>';
    }
    function render() {
      var s = S(), ph = st.phase, h = '';
      clearTimeout(tickT);
      if (ph === 'setup') {
        h += '<p class="pnote big">Play with friends: one phone, two or more teams.</p>' +
          '<ol class="erules"><li>The explainer holds the phone. <b>Their team must not see it.</b></li>' +
          '<li>Explain the word. Don\'t say it' + (ctx.level >= 4 ? ', part of it or the banned words' : '') + '. No gestures.</li>' +
          '<li>Your team guesses: tap <b>Got it</b> (+1) or <b>Skip</b>' + (s.skipMinus ? ' (−1)' : '') + '.</li>' +
          (s.lastShow ? '<li>Time up: the last word. Any team can steal it.</li>' : '') +
          '<li>First team to ' + goal() + ' wins.</li></ol>' +
          '<p class="plabel">How many teams?</p><div class="eteams">' + [2, 3, 4].map(function (n) {
            return '<button class="plv' + (n === st.teams ? ' on' : '') + '" data-n="' + n + '"><b>' + n + ' teams</b></button>';
          }).join('') + '</div>';
        body.innerHTML = h;
        body.querySelectorAll('[data-n]').forEach(function (b) { b.onclick = function () { st.teams = +b.getAttribute('data-n'); WU.sound.clack(); render(); }; });
        ctx.actions([{ label: 'Start the match', on: function () { st.phase = 'ready'; render(); } }]);
      } else if (ph === 'ready') {
        h += '<div class="pbig">' + chip(st.team, "'s turn") + '</div>' +
          '<p class="pnote big">Give the phone to the explainer.</p>' +
          '<p class="pnote">Hold it so your team can\'t see the screen. ' + secs() + ' seconds.</p>' + scoresHTML();
        body.innerHTML = h;
        ctx.actions([{ label: 'Change teams', alt: true, small: true, on: function () { newMatch(st.teams); render(); } }, { label: 'GO! (' + secs() + 's)', on: start }]);
      } else if (ph === 'play' || ph === 'last') {
        var w = st.word;
        if (ph === 'last' && s.last) h += '<div class="pbanner ok">' + esc(s.last) + '</div>';
        if (ph === 'play') h += '<div class="pbarwrap"><div class="pbar"><i></i></div></div><div class="ecount" data-auto></div>';
        h += '<div class="eword">' + esc(w ? w.text : '?') + '</div>';
        if (w && w.banned) h += '<div class="ebanned"><span>' + esc(s.banned || "Don't say:") + '</span>' + w.banned.split(',').map(function (b) { return b.trim(); }).filter(Boolean).map(function (b) { return '<s>' + esc(b) + '</s>'; }).join('') + '</div>';
        if (ph === 'play') {
          h += frameHTML(s.frame);
          var g = st.log.filter(function (x) { return x.got; }).length;
          h += '<p class="pnote">' + chip(st.team) + ' Got it: <b>' + g + '</b> · Skipped: <b>' + (st.log.length - g) + '</b></p>';
          body.innerHTML = h;
          // One clock for the whole turn (st.end): redrawing for the next word does not restart it.
          var c = body.querySelector('.ecount'), fill = body.querySelector('.pbar i');
          (function tick() {
            if (!st || st.phase !== 'play' || !c.isConnected) return;
            var left = Math.max(0, st.end - Date.now()) / 1000;
            c.textContent = Math.ceil(left); fill.style.width = (100 * left / secs()) + '%';
            fill.parentNode.classList.toggle('low', left < 10);
            if (left <= 0) { timeUp(); return; }
            tickT = setTimeout(tick, 200);
          })();
          ctx.actions([{ label: 'Skip' + (s.skipMinus ? ' (−1)' : ''), alt: true, small: true, on: function () { mark(false); } }, { label: 'Got it!', on: function () { mark(true); } }]);
        } else {
          h += '<p class="pnote big">' + esc(P.fill(s.lastAsk || 'Who guessed it?', { n: st.teams }).replace(/\s*Press.*$/, '')) + '</p><div class="esteal">';
          for (var i = 0; i < st.teams; i++) h += '<button class="pbtn alt" data-st="' + i + '" style="background:' + COLS[i] + '">' + esc(teamName(i)) + '</button>';
          h += '</div>';
          body.innerHTML = h;
          body.querySelectorAll('[data-st]').forEach(function (b) { b.onclick = function () { steal(+b.getAttribute('data-st')); }; });
          ctx.actions([{ label: s.nobody || 'Nobody', on: function () { steal(-1); } }]);
        }
      } else if (ph === 'review') {
        h += '<p class="pnote big">' + esc(s.review || 'Check the words. Tap a word to change it.') + '</p><div class="elist">' +
          (st.log.length ? st.log.map(function (x, k) { return '<button class="ew ' + (x.got ? 'ok' : 'no') + '" data-t="' + k + '">' + (x.got ? '✓ ' : '✗ ') + esc(x.text) + '</button>'; }).join('') : '<p class="pnote">No words this turn.</p>') + '</div>';
        if (st.steal) h += '<p class="pnote">' + chip(st.steal.team, ' +1') + ' ' + esc(st.steal.text) + '</p>';
        h += '<div class="pbanner ok" style="background:' + COLS[st.team] + '">' + esc(P.fill(s.roundPts || '{team}: {n}', { team: teamName(st.team), n: signed(points()) })) + '</div>';
        body.innerHTML = h;
        body.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { var x = st.log[+b.getAttribute('data-t')]; x.got = !x.got; WU.sound.clack(); render(); }; });
        ctx.actions([{ label: 'Add the points', on: bank }]);
      } else if (ph === 'win') {
        h += '<div class="pbanner ok ewin" style="background:' + COLS[st.winner] + '">' + esc(P.fill(s.win || '{team} WINS!', { team: teamName(st.winner) })) + '</div>' + scoresHTML();
        body.innerHTML = h;
        ctx.actions([{ label: 'New match', on: function () { newMatch(st.teams); st.phase = 'ready'; render(); } }]);
      }
    }
    function start() {
      if (!words().length) { ctx.empty(); return; }
      st.log = []; st.steal = null; draw(); st.phase = 'play'; st.end = Date.now() + secs() * 1000;
      WU.sound.ding(); render();
    }
    function mark(got) {
      if (st.phase !== 'play' || !st.word) return;
      st.log.push({ text: st.word.text, got: got });
      if (got) WU.sound.ding(); else WU.sound.clack();
      draw(); render();
    }
    function timeUp() {
      if (!st || st.phase !== 'play') return;
      WU.sound.buzzer();
      st.phase = S().lastShow && st.word ? 'last' : 'review'; render();
    }
    function steal(i) {
      if (st.phase !== 'last') return;
      if (i === st.team) st.log.push({ text: st.word.text, got: true });
      else if (i >= 0) st.steal = { text: st.word.text, team: i };
      st.phase = 'review'; render();
    }
    function bank() {
      st.scores[st.team] = Math.max(0, st.scores[st.team] + points());
      if (st.steal) st.scores[st.steal.team] += 1;
      var best = -1, bi = -1;
      for (var i = 0; i < st.teams; i++) if (st.scores[i] >= goal() && st.scores[i] > best) { best = st.scores[i]; bi = i; }
      if (bi >= 0) { st.winner = bi; st.phase = 'win'; WU.sound.slam(); render(); return; }
      st.team = (st.team + 1) % st.teams; st.phase = 'ready'; st.log = []; st.steal = null;
      render();
    }
    return {
      mount: function (b, c) { body = b; ctx = c; newMatch(2); render(); },
      unmount: function () { clearTimeout(tickT); body = ctx = st = null; }
    };
  })();
})();
