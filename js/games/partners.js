/* Warm Up: WORD PARTNERS (Vocabulary + Speaking, all levels). Trains: collocations, phrases instead of single words.
   A core word sits on the board ("DECISION") with hidden partner tiles: "___ a decision", "a ___ decision"...
   The core word shows, every partner word is a gap (its length shows), so students see the shape of each phrase.
   Students say a whole phrase. On the board: the teacher presses its number (1-8) and the tile flips (a point).
   A good phrase that is not on the board: B (bonus point). Wrong: X (a strike). With teams on, the turn passes after
   every answer; with teams off, the class plays against the board (3 strikes and the board wins).
   Space: show the rest + the trap (a common wrong partner: "do a decision"). Space: USE IT! A picked student
   answers a question with phrases from the board (timer). Space: next word.
   Keys: 1-8 flip a tile, B bonus, X wrong, H first letters, U undo the last tile, Space reveal / use it / next, N other word, P other student.
   Content: content/partners.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram, MAXP = 8;

  var scr = kit.screen({
    game: 'partners', title: 'Word Partners', content: function () { return WU.content.partnersScreen; },
    fields: [
      { type: 'head', label: 'The board' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'ready', label: 'Before the first word', type: 'text', max: 60 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 110 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'letters', label: 'First letters in the gaps from the start (H shows them anyway)', type: 'bool', on: 'On', off: 'Off' },
      { k: 'pics', label: 'Pictures on the tiles (board and phone)', type: 'bool', on: 'On', off: 'Off' },
      { k: 'seconds', label: 'Time for the whole word (seconds, 0 = no timer)', type: 'num', min: 0, max: 600 },
      { k: 'strikes', label: 'Strikes before the board wins (0 = no limit)', type: 'num', min: 0, max: 9 },
      { k: 'turn', label: 'Teams on: whose turn ({team})', type: 'text', max: 40 },
      { k: 'classTurn', label: 'Teams off: the class answers', type: 'text', max: 40 },
      { k: 'found', label: 'Label: found', type: 'text', max: 12 },
      { type: 'head', label: 'After each answer' },
      { k: 'hit', label: 'A tile flips', type: 'text', max: 40 },
      { k: 'bonus', label: 'B: good, but not on the board', type: 'text', max: 60 },
      { k: 'wrong', label: 'X: wrong', type: 'text', max: 40 },
      { type: 'head', label: 'End of the board' },
      { k: 'allFound', label: 'Every tile found', type: 'text', max: 30 },
      { k: 'boardWins', label: 'Time up / out of strikes / Space', type: 'text', max: 70 },
      { k: 'trapLabel', label: 'Label in front of the trap', type: 'text', max: 10 },
      { k: 'trapNote', label: 'Line next to the trap', type: 'text', max: 30 },
      { type: 'head', label: 'USE IT!' },
      { k: 'useLabel', label: 'Label', type: 'text', max: 14 },
      { k: 'useWho', label: 'Picked student ({name})', type: 'text', max: 40 },
      { k: 'useRule', label: 'Task', type: 'text', max: 80 },
      { k: 'useSeconds', label: 'Time to answer (seconds, 0 = none)', type: 'num', min: 0, max: 120 }
    ]
  });
  var pf = [];
  for (var i = 1; i <= MAXP; i++) pf.push({ k: 'p' + i, label: 'Partner phrase ' + i + (i === 1 ? ' (gaps: [brackets], optional)' : ''), type: 'text', max: 40 },
    { k: 'p' + i + 'pic', label: 'Picture for phrase ' + i + ' (optional)', type: 'pic' });
  WU.registerList('partners', 'words', {
    gameTitle: 'Word Partners', label: 'Words and partners',
    defaults: function (l) { return WU.content.partners[l].words; },
    norm: function (r) {
      var o = { word: r.word || '', question: r.question || '', trap: r.trap || '', unit: r.unit || '', added: r.added || '' };
      // A partner is "phrase" or ["phrase", "picture id"].
      for (var i = 1; i <= MAXP; i++) {
        var x = (r.p || [])[i - 1], arr = Array.isArray(x);
        o['p' + i] = r['p' + i] != null ? r['p' + i] : ((arr ? x[0] : x) || '');
        o['p' + i + 'pic'] = r['p' + i + 'pic'] != null ? r['p' + i + 'pic'] : ((arr ? x[1] : '') || '');
      }
      return o;
    },
    title: function (it) { return it.word || '(empty)'; },
    fields: function () {
      return [{ k: 'word', label: 'Core word', type: 'text', max: 24 }, { k: 'unit', label: 'Unit label on the board (empty = none)', type: 'text', max: 40 }].concat(pf,
        [{ k: 'question', label: 'USE IT question', type: 'text', max: 100 }, { k: 'trap', label: 'Trap: a wrong partner (empty = none)', type: 'text', max: 40 }]);
    },
    blank: function () { return { word: 'idea', p1: 'a good idea', p2: 'have an idea', p3: 'a brilliant idea', p4: 'no idea', p5: 'come up with an idea', p6: 'share an idea', p7: '', p8: '', question: 'What is the best idea you have had this year?', trap: 'make an idea' }; }
  });

  var sh, box, st, clock = null, offContent = null, bar = gram.bar(), deck = kit.deck();

  function words() { return WU.list('partners', 'words', WU.state.level).filter(function (w) { return w.word && phrases(w).length; }); }
  function phrases(w) { var a = []; for (var i = 1; i <= MAXP; i++) if (w['p' + i] && String(w['p' + i]).trim()) a.push({ k: 'p' + i, text: String(w['p' + i]).trim(), pic: w['p' + i + 'pic'] || '' }); return a; }
  function word() { return words().filter(function (x) { return x.id === st.id; })[0] || null; }
  function ek(it, f) { return WU.editAttr('partners', 'words', it.id, f); }
  function teamsOn() { return WU.state.teams > 0; }
  function teamName(i) { return WU.state.teamNames[i] || 'TEAM ' + (i + 1); }
  function teamColor(i) { return WU.TEAM_COLORS[WU.state.teamColors[i]] || WU.TEAM_COLORS[i]; }
  function maxStrikes() { return Math.max(0, Math.min(9, +scr.get().strikes || 0)); }

  /* A phrase split into words: { t: 'make', gap: true } / { t: 'decision', gap: false }.
     [brackets] mark the gaps; without them every word is a gap apart from the core word and a / an / the. */
  var KEEP = { a: 1, an: 1, the: 1 };
  function tokens(text, core) {
    var br = /\[[^\]]+\]/.test(text), out = [];
    if (br) {
      String(text).split(/(\[[^\]]+\])/).forEach(function (part) {
        if (!part) return;
        var gap = part.charAt(0) === '[';
        part.replace(/^\[|\]$/g, '').split(/\s+/).forEach(function (t) { if (t) out.push({ t: t, gap: gap }); });
      });
      return out;
    }
    var c = String(core || '').toLowerCase().replace(/[^a-z]/g, ''), stem = c.length >= 6 ? c.slice(0, c.length - 2) : c;
    String(text).split(/\s+/).forEach(function (t) {
      if (!t) return;
      var low = t.toLowerCase().replace(/[^a-z]/g, '');
      out.push({ t: t, gap: !(KEEP[low] || (stem && low.indexOf(stem) === 0)) });
    });
    return out;
  }
  function plain(text) { return String(text).replace(/[\[\]]/g, ''); }
  function tileHTML(ph, open, letters) {
    return tokens(ph.text, word().word).map(function (tk) {
      if (!tk.gap) return '<span class="wpw">' + WU.esc(tk.t) + '</span>';
      if (open) return '<span class="wpw wpp">' + WU.esc(tk.t) + '</span>';
      var n = tk.t.replace(/[^A-Za-z]/g, '').length || 1;
      return '<span class="wpg" style="width:' + (0.42 * n + 0.5).toFixed(2) + 'em">' + (letters ? WU.esc(tk.t.charAt(0)) : '') + '</span>';
    }).join(' ');
  }

  function render() {
    var S = scr.get(), ph = st.phase, it = word(), h = '';
    var list = it ? phrases(it) : [], nFound = st.found.length;
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#00e5c7');
    if (it && (ph === 'play' || ph === 'done')) {
      h += '<div class="wpcount"><span' + scr.ea('found') + '>' + WU.esc(S.found) + '</span> <b data-auto>' + nFound + ' / ' + list.length + '</b></div>';
      if (maxStrikes()) h += '<div class="wpstrikes" data-auto>' + Array.apply(null, Array(maxStrikes())).map(function (x, i) { return '<i class="' + (i < st.strikes ? 'on' : '') + '">&#10005;</i>'; }).join('') + '</div>';
      if (ph === 'play') h += teamsOn()
        ? '<div class="wpturn" style="background:' + teamColor(st.turn) + '"' + scr.ea('turn') + '>' + WU.esc(kit.fill(S.turn, { team: teamName(st.turn) })) + '</div>'
        : '<div class="wpturn"' + scr.ea('classTurn') + '>' + WU.esc(S.classTurn) + '</div>';
    }
    h += '</div>';
    if (ph === 'use' && +S.useSeconds > 0) h += bar.html();

    if (ph === 'ready' || !it) {
      h += '<div class="wpready"><div class="gbig"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div>' +
        (S.ruleShow && S.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>' : '') + '</div>';
    } else {
      // The core word (or, in USE IT, the question).
      if (ph === 'use') {
        h += '<div class="wpcore wpq"><div class="wpqtop"><span class="wpuse"' + scr.ea('useLabel') + '>' + WU.esc(S.useLabel) + '</span>' +
          gram.who(S.useWho, scr.ea('useWho'), st.student) + '</div><div class="wpqt"' + ek(it, 'question') + '>' + WU.esc(it.question) + '</div></div>';
      } else h += '<div class="wpcore">' + (it.unit ? '<div class="wpunit"' + ek(it, 'unit') + '>' + WU.esc(it.unit) + '</div>' : '') + '<div class="wpword"' + ek(it, 'word') + '>' + WU.esc(it.word) + '</div></div>' + (clock ? '<div class="wpclock"></div>' : '');
      // The tiles.
      var rows = Math.ceil(list.length / 2), th = Math.min(120, Math.floor((470 - (rows - 1) * 14) / rows));
      h += '<div class="wptiles" style="grid-template-rows:repeat(' + rows + ',' + th + 'px)">' + list.map(function (p, idx) {
        var got = st.found.indexOf(p.k) >= 0, open = got || ph !== 'play', cls = got ? ' got' : open ? ' missed' : '';
        if (got && st.last === p.k && ph === 'play') cls += ' pop';
        return '<div class="wptile' + cls + '" data-i="' + idx + '"><span class="wpn" data-ctrl>' + (idx + 1) + '</span>' +
          (p.pic && S.pics ? '<span class="wppic"' + ek(it, p.k + 'pic') + '>' + WU.pic(p.pic) + '</span>' : '') + '<span class="wpt"' + ek(it, p.k) + '>' + tileHTML(p, open, S.letters || st.letters) + '</span>' +
          (got && st.who[p.k] != null && teamsOn() ? '<span class="wpby" data-auto style="background:' + teamColor(st.who[p.k]) + '"></span>' : '') + '</div>';
      }).join('') + '</div>';
      // The strip at the bottom.
      h += '<div class="wpbottom">';
      if (ph === 'play') {
        if (st.flash) h += '<div class="wpflash ' + st.flash + '"' + scr.ea(st.flash) + '>' + WU.esc(S[st.flash]) + '</div>';
        else if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      } else if (ph === 'done') {
        var all = nFound === list.length, key = all ? 'allFound' : 'boardWins';
        h += '<div class="wpend"><div class="wpflash ' + (all ? 'hit' : 'wrong') + '"' + scr.ea(key) + '>' + WU.esc(S[key]) + '</div>';
        if (it.trap) h += '<div class="wptrap"><b' + scr.ea('trapLabel') + '>' + WU.esc(S.trapLabel) + '</b><s' + ek(it, 'trap') + '>' + WU.esc(it.trap) + '</s>' +
          (S.trapNote ? '<span' + scr.ea('trapNote') + '>' + WU.esc(S.trapNote) + '</span>' : '') + '</div>';
        h += '</div>';
      } else if (ph === 'use') {
        h += '<div class="rule"' + scr.ea('useRule') + '>' + WU.esc(S.useRule) + '</div>';
      }
      h += '</div>';
    }
    box.querySelector('.layer').innerHTML = h;
    if (st.peek && it) box.querySelector('.layer').insertAdjacentHTML('beforeend', '<div class="wppeek" data-auto>' + list.map(function (p, i) { return (i + 1) + ' ' + WU.esc(plain(p.text)); }).join(' · ') + '</div>');
    kit.fit(box.querySelector('.wpword'), 150, 60);
    kit.fit(box.querySelector('.wpqt'), 64, 34);
    box.querySelectorAll('.wpt').forEach(function (el) { kit.fit(el, Math.min(60, th0()), 26); });
    // Touch: tap a hidden tile to flip it.
    box.querySelectorAll('.wptile').forEach(function (el) { el.onclick = function (e) { if (!WU.editing) { e.stopPropagation(); flip(+el.getAttribute('data-i')); } }; });
    var ck = box.querySelector('.wpclock'); if (ck && clock) ck.appendChild(clock.el);
    bar.redraw(box);
    renderHints();
  }
  function th0() { var it = word(); if (!it) return 60; var rows = Math.ceil(phrases(it).length / 2); return Math.floor(Math.min(120, (470 - (rows - 1) * 14) / rows) * 0.55); }

  function renderHints() {
    var ph = st.phase;
    var hs = ph === 'play' ? [['1-8', 'flip'], ['B', 'bonus'], ['X', 'wrong'], ['H', 'letters'], ['U', 'undo'], ['ENTER', 'pause'], ['SPACE', 'show all'], ['Esc', 'home']]
      : ph === 'done' ? [['SPACE', 'use it'], ['N', 'other word'], ['Esc', 'home']]
      : ph === 'use' ? [['SPACE', 'next word'], ['P', 'other student'], ['Esc', 'home']]
      : [['SPACE', 'first word'], ['Esc', 'home']];
    kit.hints(sh.root, hs, function (k) { if (k !== '1-8') keyAction(k); });
  }

  /* ---------- flow ---------- */
  // One timer for the whole word: find as many partners as you can, then see what you missed.
  function stopClock() { if (clock) { clock.destroy(); clock = null; } }
  function startClock() {
    stopClock();
    var sec = Math.max(0, Math.min(600, +scr.get().seconds || 0)); if (!sec) return;
    clock = WU.Timer({ seconds: sec, size: 220, onDone: function () { if (st && st.phase === 'play') finish(); } });
  }
  function startTurn() {}
  // Weekly words (from the units the groups have just been taught, "added" in the last WU.NEW_DAYS days) play first.
  function isFresh(w) { var t = Date.parse(w.added || ''); return !isNaN(t) && Date.now() - t < (WU.NEW_DAYS || 14) * 864e5; }
  // This week's words first, then every other word once (random order), then round again.
  function pickWord(all, played, lastId) {
    var left = function (f) { return all.filter(function (w) { return played.indexOf(w.id) < 0 && (!f || f(w)); }); };
    var c = left(isFresh); if (!c.length) c = left();
    if (!c.length) { played.length = 0; c = all.filter(function (w) { return w.id !== lastId; }); if (!c.length) c = all; }
    return WU.pick(c);
  }
  function newWord() {
    var all = words(); if (!all.length) return;
    var w = pickWord(all, st.played, st.id); st.played.push(w.id);
    st.id = w.id; st.phase = 'play'; st.found = []; st.who = {}; st.strikes = 0; st.flash = null; st.last = null; st.letters = false; st.history = [];
    startClock(); WU.sound.pop(); render(); if (clock) clock.start();
  }
  function passTurn() { if (teamsOn()) st.turn = (st.turn + 1) % WU.state.teams; }
  function flip(idx) {
    if (st.phase !== 'play') return;
    var it = word(), list = it ? phrases(it) : [], p = list[idx];
    if (!p || st.found.indexOf(p.k) >= 0) return;
    st.found.push(p.k); st.last = p.k; st.flash = 'hit'; st.history.push({ k: p.k, team: teamsOn() ? st.turn : null });
    if (teamsOn()) { st.who[p.k] = st.turn; if (sh.sb) sh.sb.add(st.turn, 1); }
    WU.sound.ding(); passTurn();
    if (st.found.length === list.length) { finish(); return; }
    render(); startTurn();
  }
  function undo() {
    if (st.phase !== 'play' || !st.history.length) return;
    var h = st.history.pop();
    st.found = st.found.filter(function (k) { return k !== h.k; }); delete st.who[h.k];
    if (h.team != null) { if (sh.sb) sh.sb.add(h.team, -1); st.turn = h.team; }
    st.flash = null; st.last = null; WU.sound.clack(); render(); startTurn();
  }
  function bonus() {
    if (st.phase !== 'play') return;
    if (teamsOn() && sh.sb) sh.sb.add(st.turn, 1);
    st.flash = 'bonus'; st.last = null; WU.sound.ding(); passTurn(); render(); startTurn();
  }
  function strike(kind) {
    if (st.phase !== 'play') return;
    st.strikes++; st.flash = kind || 'wrong'; st.last = null; WU.sound.buzzer(); passTurn();
    if (maxStrikes() && st.strikes >= maxStrikes()) { finish(); return; }
    render(); startTurn();
  }
  function finish() {
    bar.stop(); if (clock && clock.isRunning()) clock.toggle(); st.phase = 'done'; st.flash = null; st.peek = false;
    var it = word(); if (it && st.found.length === phrases(it).length) WU.sound.boom(); else WU.sound.clack();
    render();
  }
  function useIt() {
    var it = word(); if (!it) return;
    if (!it.question) { newWord(); return; }
    st.phase = 'use'; st.student = kit.student(); WU.sound.beep(880); render();
    bar.start(box, Math.max(0, Math.min(120, +scr.get().useSeconds || 0)), function () { if (st && st.phase === 'use') render(); });
  }
  function otherStudent() { if (st.phase !== 'use') return; st.student = kit.student([st.student]); WU.sound.clack(); render(); }
  var peekT = null;
  function peek() {
    if (st.phase !== 'play') return;
    clearTimeout(peekT); st.peek = true; render();
    peekT = setTimeout(function () { if (st) { st.peek = false; render(); } }, 2500);
  }
  function refresh() { if (!st) return; if (st.phase !== 'ready' && !word()) { bar.stop(); st.phase = 'ready'; } render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') newWord(); else if (ph === 'play') finish(); else if (ph === 'done') useIt(); else if (ph === 'use') { bar.stop(); newWord(); } }
    else if (k === 'B') bonus();
    else if (k === 'X') strike('wrong');
    else if (k === 'H') { if (ph === 'play') { st.letters = !st.letters; WU.sound.clack(); render(); } }
    else if (k === 'U') undo();
    else if (k === 'N') { bar.stop(); newWord(); }
    else if (k === 'ENTER') { if (ph === 'play' && clock) clock.toggle(); }
    else if (k === 'P') otherStudent();
    else if (k === 'A') peek();
    else if (k === 'Esc') WU.go('home');
  }

  // For the phone version (js/phone/games-partners.js).
  WU.engines = WU.engines || {};
  WU.engines.partners = { tokens: tokens, phrases: phrases, plain: plain, isFresh: isFresh, pickWord: pickWord };

  WU.views.partners = {
    title: 'Word Partners',
    teacher: function () {
      if (!st) return null;
      var it = word(), sec = [], info = [];
      if (it && st.phase !== 'ready') {
        sec.push({ label: 'Partners (press the number)', html: phrases(it).map(function (p, i) {
          var got = st.found.indexOf(p.k) >= 0;
          return '<div style="' + (got ? 'opacity:.4;text-decoration:line-through' : '') + '"><b>' + (i + 1) + '</b> ' + WU.esc(plain(p.text)) + '</div>';
        }).join('') });
        if (it.trap) sec.push({ label: 'Trap (wrong)', text: it.trap });
        if (it.question) sec.push({ label: 'USE IT question', text: it.question });
      }
      if (st.phase === 'play') info.push({ label: 'Now', text: teamsOn() ? teamName(st.turn) : 'The whole class' });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['1 - 8', 'they said this phrase: flip its tile (a point)'], ['B', 'a good phrase that is not on the board (a point)'], ['X', 'wrong (a strike)'],
        ['H', 'first letters in the gaps'], ['U', 'undo the last tile'], ['A', 'peek at the answers (small, 2 seconds)'],
        ['Enter', 'pause / restart the timer'], ['Space', 'show the rest / USE IT / next word'], ['N', 'other word'], ['P', 'other student (USE IT)']];
    },
    mount: function (el) {
      sh = gram.shell(el, 'wpg-game', 'Word Partners', 'partners-sb'); box = sh.box;
      st = { phase: 'ready', id: null, found: [], who: {}, strikes: 0, turn: 0, flash: null, last: null, letters: false, history: [], student: null, peek: false, played: [] };
      render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); stopClock(); clearTimeout(peekT); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      var m = /^(Digit|Numpad)([1-8])$/.exec(e.code || '');
      if (m && !e.shiftKey) { flip(+m[2] - 1); return true; }
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { keyAction('ENTER'); return true; }
      var map = { b: 'B', x: 'X', h: 'H', u: 'U', n: 'N', p: 'P', a: 'A' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
