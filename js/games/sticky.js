/* Warm Up: STICKY WORDS (grammar game G9, Intermediate and up). Trains: dependent prepositions and fixed phrases.
   A team race. A word with a gap appears ("interested ___", "___ purpose"). The first team to shout the preposition
   AND a sentence with it wins the point: press its number (1, 2, 3, 4). Nobody, or wrong: X, and the word comes back
   a few cards later. First team to the target (10) wins. With teams off, the room plays LEFT SIDE (1) against RIGHT SIDE (2).
   Keys: Space next word, 1-4 point to a team, Shift + 1-4 take one back, X nobody / wrong, R new match.
   Content: content/sticky.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'sticky', title: 'Sticky Words', content: function () { return WU.content.stickyScreen; },
    fields: [
      { type: 'head', label: 'The race' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'ready', label: 'Before the first word', type: 'text', max: 60 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'seconds', label: 'Time bar for each word (seconds, 0 = none)', type: 'num', min: 0, max: 60 },
      { k: 'target', label: 'Points to win', type: 'num', min: 1, max: 50 },
      { k: 'sideA', label: 'Teams off: side 1', type: 'text', max: 16 }, { k: 'sideB', label: 'Teams off: side 2', type: 'text', max: 16 },
      { type: 'head', label: 'After each word' },
      { k: 'point', label: 'A team got it', type: 'text', max: 16 },
      { k: 'nobody', label: 'Nobody / wrong (X)', type: 'text', max: 50 },
      { k: 'back', label: 'A word that comes back', type: 'text', max: 20 },
      { k: 'exampleLabel', label: 'Label in front of the example', type: 'text', max: 12 },
      { k: 'win', label: 'Winner ({team})', type: 'text', max: 30 }
    ]
  });
  WU.registerList('sticky', 'words', {
    gameTitle: 'Sticky Words', label: 'Words',
    defaults: function (l) { return WU.content.sticky[l].words; },
    norm: function (r) { return { text: r.text || '', answer: r.answer || '', example: r.example || '' }; },
    fields: function () {
      return [{ k: 'text', label: 'Word with a gap (___), (hint) optional', type: 'text', max: 50 }, { k: 'answer', label: 'Preposition', type: 'text', max: 20 },
        { k: 'example', label: 'Example sentence', type: 'text', max: 100 }];
    },
    blank: function () { return { text: 'fond ___', answer: 'of', example: 'I am fond of my grandmother.' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar();

  function words() { return WU.list('sticky', 'words', WU.state.level).filter(function (x) { return x.text && x.answer; }); }
  function word() { return words().filter(function (x) { return x.id === st.id; })[0] || null; }
  function ek(it, f) { return ' data-edit="sticky:words:' + it.id + ':' + f + '"'; }
  function nTeams() { return WU.state.teams || 2; }
  function teamName(i) { var S = scr.get(); return WU.state.teams ? (WU.state.teamNames[i] || 'TEAM ' + (i + 1)) : (i ? S.sideB : S.sideA); }
  function teamColor(i) { return WU.state.teams ? (WU.TEAM_COLORS[WU.state.teamColors[i]] || WU.TEAM_COLORS[i]) : ['#c6ff00', '#ff4fc3'][i]; }
  function target() { return Math.max(1, Math.min(50, +scr.get().target || 10)); }

  function nextId() {
    if (!st.queue.length) st.queue = WU.shuffle(words().map(function (w) { return w.id; }));
    var id = st.queue.shift(); st.isBack = st.backIds.indexOf(id) >= 0;
    st.backIds = st.backIds.filter(function (x) { return x !== id; });
    return id;
  }

  function render() {
    var S = scr.get(), ph = st.phase, it = word(), h = '', n = nTeams();
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#ffe600') + '<div class="swteams">' +
      Array.apply(null, Array(n)).map(function (x, i) {
        return '<div class="swt' + (st.got === i && ph === 'got' ? ' hit' : '') + '" style="background:' + teamColor(i) + '"><span class="swk" data-ctrl>' + (i + 1) + '</span>' +
          '<span class="swn"' + (WU.state.teams ? ' data-auto' : scr.ea(i ? 'sideB' : 'sideA')) + '>' + WU.esc(teamName(i)) + '</span><b data-auto>' + st.score[i] + '</b></div>';
      }).join('') + '<div class="swtarget" data-auto>/ ' + target() + '</div></div></div>';
    if (+S.seconds > 0 && ph === 'race') h += bar.html();
    if (ph === 'ready') h += '<div class="swready"><div class="gbig"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div>' + (S.ruleShow && S.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>' : '') + '</div>';
    else if (ph === 'end') h += '<div class="swready"><div class="swwin" style="background:' + teamColor(st.winner) + '"' + scr.ea('win') + '>' + WU.esc(kit.fill(S.win, { team: teamName(st.winner) })) + '</div></div>';
    else if (it) {
      var open = ph === 'got' || ph === 'miss';
      h += '<div class="swcard' + (open ? ' lit' : '') + '">' + (st.isBack && S.back ? '<div class="swback"' + scr.ea('back') + '>' + WU.esc(S.back) + '</div>' : '') +
        '<div class="swtext"' + ek(it, 'text') + '>' + gram.gaps(it.text, open ? [it.answer] : null) + '</div>' +
        (open && it.example ? '<div class="swex">' + (S.exampleLabel ? '<b' + scr.ea('exampleLabel') + '>' + WU.esc(S.exampleLabel) + '</b>' : '') + '<span' + ek(it, 'example') + '>' + WU.esc(it.example) + '</span></div>' : '') + '</div>';
      h += '<div class="swbottom">';
      if (ph === 'got') h += '<div class="swpoint" style="background:' + teamColor(st.got) + '"><span data-auto>' + WU.esc(teamName(st.got)) + '</span> <span' + scr.ea('point') + '>' + WU.esc(S.point) + '</span></div>';
      else if (ph === 'miss') h += '<div class="gbig"' + scr.ea('nobody') + '>' + WU.esc(S.nobody) + '</div>';
      else if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      h += '</div>';
    }
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.swtext'), 170, 70);
    // Touch: tap a team to give it the point.
    box.querySelectorAll('.swt').forEach(function (el, i) { el.onclick = function (e) { if (!WU.editing) { e.stopPropagation(); point(i); } }; });
    bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var ph = st.phase, n = nTeams(), nums = n === 2 ? '1 / 2' : '1 - ' + n;
    var hs = ph === 'race' ? [[nums, 'point to a team'], ['X', 'nobody / wrong'], ['Esc', 'home']]
      : ph === 'end' ? [['SPACE', 'new match'], ['Esc', 'home']]
      : ph === 'ready' ? [['SPACE', 'first word'], ['Esc', 'home']]
      : [['SPACE', 'next word'], ['R', 'new match'], ['Esc', 'home']];
    kit.hints(sh.root, hs, function (k) { if (k !== nums) keyAction(k); });
  }

  /* ---------- flow ---------- */
  function race() {
    var S = scr.get(); if (!words().length) return;
    st.id = nextId(); st.phase = 'race'; st.got = null; WU.sound.pop(); render();
    bar.start(box, Math.max(0, Math.min(60, +S.seconds || 0)), function () { if (st && st.phase === 'race') render(); });
  }
  function point(i) {
    if (st.phase !== 'race' || i >= nTeams()) return;
    bar.stop(); st.score[i]++; st.got = i; st.phase = 'got'; WU.sound.ding();
    if (WU.state.teams && sh.sb) sh.sb.add(i, 1);
    if (st.score[i] >= target()) { st.winner = i; render(); setTimeout(function () { if (st && st.phase === 'got') { st.phase = 'end'; WU.sound.boom(); render(); } }, 1600); return; }
    render();
  }
  function miss() {
    if (st.phase !== 'race') return;
    bar.stop(); st.phase = 'miss'; WU.sound.buzzer();
    // The word comes back a few cards later.
    st.queue.splice(Math.min(3, st.queue.length), 0, st.id); st.backIds.push(st.id);
    render();
  }
  function takeBack(i) { if (i < nTeams() && st.score[i] > 0) { st.score[i]--; if (WU.state.teams && sh.sb) sh.sb.add(i, -1); WU.sound.clack(); render(); } }
  function newMatch() { bar.stop(); st.score = [0, 0, 0, 0]; st.queue = []; st.backIds = []; st.phase = 'ready'; st.winner = null; WU.sound.clack(); render(); }
  function refresh() { if (!st) return; if (st.phase !== 'ready' && st.phase !== 'end' && !word()) { st.phase = 'ready'; } render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready' || ph === 'got' || ph === 'miss') { if (ph === 'got' && st.winner != null) return; race(); } else if (ph === 'end') newMatch(); }
    else if (k === 'X') miss();
    else if (k === 'R') newMatch();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.sticky = {
    title: 'Sticky Words',
    teacher: function () {
      if (!st) return null;
      var it = word(), sec = [], info = [];
      if (it && st.phase !== 'ready' && st.phase !== 'end') { sec.push({ label: 'Answer', text: it.answer, big: true }); if (it.example) sec.push({ label: 'Example', text: it.example }); }
      info.push({ label: 'Score', text: Array.apply(null, Array(nTeams())).map(function (x, i) { return teamName(i) + ' ' + st.score[i]; }).join(' · ') + ' (to ' + target() + ')' });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'first word / next word'], ['1 - 4', 'point to that team (the first with a right sentence)'], ['Shift + 1 - 4', 'take a point back'], ['X', 'nobody / wrong: the word comes back later'], ['R', 'new match']]; },
    mount: function (el) {
      sh = gram.shell(el, 'swg', 'Sticky Words', 'sticky-sb'); box = sh.box;
      if (sh.sb) sh.sb.show(false); // the race has its own score bar
      st = { phase: 'ready', score: [0, 0, 0, 0], queue: [], backIds: [], got: null, winner: null, isBack: false };
      render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      var m = /^(Digit|Numpad)([1-4])$/.exec(e.code || '');
      if (m) { var i = +m[2] - 1; if (e.shiftKey) takeBack(i); else point(i); return true; }
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { x: 'X', r: 'R' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
