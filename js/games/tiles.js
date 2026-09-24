/* Warm Up: MYSTERY TILES.
   A hidden picture under a grid of tiles. Students ask yes / no questions; for a good question the teacher opens
   one tile (a bad question opens nothing). Anyone can guess at any time.
   Teams on: teams take turns; the guessing team scores the tiles still closed. Teams off: the screen counts tiles used.
   Keys: arrows + Enter open a tile, X bad question, G reveal, N next picture, S scores.
   Content: content/tiles.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  /* ---------- editable lists ---------- */
  var scr = kit.screen({
    game: 'tiles', title: 'Mystery Tiles', content: function () { return WU.content.tilesScreen; },
    fields: [
      { type: 'head', label: 'Screen' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'grid', label: 'Tiles per side at this level', type: 'num', min: 2, max: 8, hint: 'Beginner 3, middle levels 4-5, IELTS 6. A picture can have its own size.' },
      { k: 'demo', label: 'Teacher demo banner (first picture only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { type: 'head', label: 'While playing' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'askFrame', label: 'Question frame (empty = none)', type: 'text', max: 60, hint: 'Use ___ for the gap.' },
      { k: 'guessRule', label: 'How to guess', type: 'text', max: 90 }, { k: 'guessShow', label: 'How to guess', type: 'bool' },
      { k: 'turn', label: 'Team turn ({team} = the team)', type: 'text', max: 40 },
      { k: 'used', label: 'Counter without teams ({n} = tiles opened)', type: 'text', max: 30 },
      { type: 'head', label: 'At the end' },
      { k: 'revealFrame', label: 'Answer frame (empty = just the answer)', type: 'text', max: 40, hint: 'e.g. "It\'s ___!" adds a / an.' },
      { k: 'usedEnd', label: 'Without teams ({n} = tiles opened)', type: 'text', max: 50 },
      { k: 'award', label: 'With teams: question', type: 'text', max: 50 },
      { k: 'points', label: 'With teams: points ({n} = tiles still closed)', type: 'text', max: 30 }
    ]
  });
  function sceneOptions() {
    var S = WU.content.tileScenes;
    return [['', '(none)']].concat(Object.keys(S).map(function (k) { return [k, S[k].name]; }));
  }
  WU.registerList('tiles', 'pictures', {
    gameTitle: 'Mystery Tiles', label: 'Pictures',
    defaults: function (l) { return WU.content.tiles[l].pictures; },
    norm: function (r) { var o = kit.normWord(r); o.scene = r.scene || ''; o.reveal = r.reveal || ''; o.grid = r.grid || 0; return o; },
    title: function (it) { return kit.wordPhrase(it, 'a') || '(empty)'; },
    fields: function () {
      return [
        { k: 'text', label: 'Answer (a word or a short phrase)', type: 'text', max: 40 },
        { k: 'art', label: 'a / an', type: 'select', options: kit.ARTICLES },
        { k: 'pic', label: 'Picture (library or upload). It replaces the scene.', type: 'pic' },
        { k: 'scene', label: 'Built-in scene (used when there is no picture)', type: 'select', options: sceneOptions() },
        { k: 'reveal', label: 'Sentence shown at the end (empty = hide)', type: 'text', max: 110 },
        { k: 'grid', label: 'Tiles per side for this picture (empty = the level\'s size)', type: 'num', min: 2, max: 8 }
      ];
    },
    blank: function () { return { text: 'new picture', art: 'a', pic: '', scene: '', reveal: '', grid: 0 }; }
  });

  var root, box, st, sb = null, offContent = null, timers = [];
  var deck = kit.deck();

  function item() { return WU.list('tiles', 'pictures', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function gridOf(it) { var n = +(it && it.grid) || +scr.get().grid || 4; return Math.max(2, Math.min(8, n)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function newPicture() {
    clearT();
    var it = deck(WU.list('tiles', 'pictures', WU.state.level));
    st.id = it ? it.id : null; st.n = gridOf(it); st.open = {}; st.used = 0; st.cur = Math.floor(st.n * st.n / 2);
    st.phase = 'play'; st.points = null; st.winner = null;
  }

  /* ---------- drawing ---------- */
  function sceneHTML(key) {
    var s = WU.content.tileScenes[key]; if (!s) return '';
    return '<div class="scene bg-' + s.bg + '">' + s.items.map(function (x) {
      return '<div class="sp" style="left:' + x[1] + '%;top:' + x[2] + '%;width:' + x[3] + '%">' + WU.pic(x[0]) + '</div>';
    }).join('') + '</div>';
  }
  function pictureHTML(it) {
    if (!it) return '<div class="scene bg-room"></div>';
    var ek = function (f) { return ' data-edit="tiles:pictures:' + it.id + ':' + f + '"'; };
    if (it.pic) return '<div class="single"' + ek('pic') + '>' + WU.pic(it.pic) + '</div>';
    return '<div class="scenewrap"' + ek('scene') + '>' + sceneHTML(it.scene) + '</div>';
  }
  function tilesHTML() {
    var n = st.n, h = '<div class="tgrid" data-ctrl style="grid-template-columns:repeat(' + n + ',1fr);grid-template-rows:repeat(' + n + ',1fr)">';
    for (var i = 0; i < n * n; i++) h += '<div class="tile-t' + (st.open[i] ? ' gone' : '') + (i === st.cur && st.phase === 'play' ? ' cur' : '') + '" data-t="' + i + '" style="font-size:' + Math.round(360 / n) + 'px"><span>?</span></div>';
    return h + '</div>';
  }
  function answerText(it) {
    var S = scr.get(), f = S.revealFrame;
    if (f && f.indexOf('___') >= 0) return f.split('___').join(WU.phrase({ w: it.text, art: it.art, pl: it.pl }, WU.frameForm(f)));
    var a = kit.wordPhrase(it, 'a'); return a.charAt(0).toUpperCase() + a.slice(1);
  }
  function colHTML() {
    var S = scr.get(), it = item(), h = kit.chip(S.tag, scr.ea('tag'), '#3d6bff'), teams = WU.state.teams;
    var left = st.n * st.n - st.used;
    if (st.phase === 'play') {
      if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
      if (teams && S.turn) {
        var col = WU.TEAM_COLORS[WU.state.teamColors[st.turn % teams]] || '#fff';
        h += '<div class="turn"' + scr.ea('turn') + ' style="background:' + col + '">' + WU.esc(kit.fill(S.turn, { team: teamName(st.turn % teams) })) + '</div>';
      } else if (!teams && S.used) h += '<div class="count"' + scr.ea('used') + '>' + WU.esc(kit.fill(S.used, { n: st.used })) + '</div>';
      if (S.askFrame) h += kit.frame(S.askFrame, scr.ea('askFrame'));
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
      if (S.guessShow && S.guessRule) h += '<div class="rule hot"' + scr.ea('guessRule') + '>' + WU.esc(S.guessRule) + '</div>';
      h += '<div class="acts" data-ctrl><div class="btn sm" data-b="open"><span class="key">ENTER</span><span>Good question</span></div>' +
        '<div class="btn sm" data-b="bad"><span class="key">X</span><span>Bad question</span></div>' +
        '<div class="btn sm" data-b="reveal"><span class="key">G</span><span>Guessed it!</span></div></div>';
    } else {
      if (it) {
        var at = answerText(it);
        h += '<div class="answer' + (at.length > 14 ? ' long' : '') + '" data-edit="tiles:pictures:' + it.id + ':text">' + WU.esc(answerText(it)) + '</div>';
        if (it.reveal) h += '<div class="rule"' + ' data-edit="tiles:pictures:' + it.id + ':reveal">' + WU.esc(it.reveal) + '</div>';
      }
      if (!teams && S.usedEnd) h += '<div class="count"' + scr.ea('usedEnd') + '>' + WU.esc(kit.fill(S.usedEnd, { n: st.used })) + '</div>';
      if (teams && st.phase === 'award' && S.award) h += '<div class="turn"' + scr.ea('award') + ' style="background:#fff">' + WU.esc(S.award) + '</div>';
      if (teams && st.phase === 'award') h += '<div class="acts" data-ctrl>' + WU.state.teamNames.slice(0, teams).map(function (nm, i) {
        return '<div class="btn sm" data-award="' + i + '" style="background:' + (WU.TEAM_COLORS[WU.state.teamColors[i]] || '#fff') + '"><span class="key">' + (i + 1) + '</span><span>' + WU.esc(nm || 'TEAM ' + (i + 1)) + '</span></div>';
      }).join('') + '<div class="btn sm" data-b="next"><span class="key">N</span><span>Next</span></div></div>';
      if (teams && st.phase === 'done' && st.winner != null && S.points) {
        h += '<div class="turn"' + scr.ea('points') + ' style="background:' + (WU.TEAM_COLORS[WU.state.teamColors[st.winner]] || '#fff') + '">' +
          WU.esc(teamName(st.winner)) + ' ' + WU.esc(kit.fill(S.points, { n: st.points })) + '</div>';
      }
      if (st.phase !== 'award') h += '<div class="acts" data-ctrl><div class="btn sm" data-b="next"><span class="key">N</span><span>Next picture</span></div></div>';
    }
    return h;
  }
  function teamName(i) { return WU.state.teamNames[i] || 'TEAM ' + (i + 1); }
  function render() {
    var it = item();
    box.querySelector('.layer').innerHTML = '<div class="tbox"><div class="pic-under">' + pictureHTML(it) + '</div>' + tilesHTML() + '</div><div class="tcol' + (st.phase !== 'play' ? ' end' : '') + '">' + colHTML() + '</div>';
    wire(); renderHints();
  }
  function renderCol() { var c = box.querySelector('.tcol'); c.innerHTML = colHTML(); c.classList.toggle('end', st.phase !== 'play'); wire(); renderHints(); }
  function wire() {
    box.querySelectorAll('[data-t]').forEach(function (t) {
      t.onclick = function () { if (WU.editing || st.phase !== 'play') return; st.cur = +t.getAttribute('data-t'); openTile(); };
    });
    box.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function () { keyAction({ open: 'ENTER', bad: 'X', reveal: 'G', next: 'N' }[b.getAttribute('data-b')]); };
    });
    box.querySelectorAll('[data-award]').forEach(function (b) { b.onclick = function () { award(+b.getAttribute('data-award')); }; });
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = st.phase === 'play' ? [['ARROWS', 'choose'], ['ENTER', 'open'], ['X', 'bad question'], ['G', 'reveal'], ['N', 'next'], ['Esc', 'home']].concat(sc)
      : st.phase === 'award' ? [['1-' + WU.state.teams, 'who guessed?'], ['N', 'next picture'], ['Esc', 'home']].concat(sc)
      : [['N', 'next picture'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, function (k) { keyAction(k === 'ARROWS' ? null : k); });
  }
  function moveCur(dr, dc) {
    var n = st.n, r = Math.floor(st.cur / n), c = st.cur % n;
    r = (r + dr + n) % n; c = (c + dc + n) % n; st.cur = r * n + c;
    box.querySelectorAll('.tile-t').forEach(function (t) { t.classList.toggle('cur', +t.getAttribute('data-t') === st.cur); });
  }

  /* ---------- flow ---------- */
  function openTile() {
    if (st.phase !== 'play') return;
    WU.sound.unlock();
    if (st.open[st.cur]) {
      // Already open: jump to the nearest closed tile instead.
      for (var k = 1; k < st.n * st.n; k++) { var j = (st.cur + k) % (st.n * st.n); if (!st.open[j]) { st.cur = j; break; } }
      if (st.open[st.cur]) return;
    }
    st.open[st.cur] = true; st.used++;
    var t = box.querySelector('[data-t="' + st.cur + '"]'); if (t) t.classList.add('gone');
    WU.sound.pop(); passTurn();
    if (st.used >= st.n * st.n) { reveal(); return; }
    renderCol();
  }
  function bad() {
    if (st.phase !== 'play') return;
    WU.sound.buzzer();
    var g = box.querySelector('.tgrid'); if (g && !WU.isCalm()) WU.restartAnim(g, 'no');
    passTurn(); renderCol();
  }
  function passTurn() { if (WU.state.teams) st.turn = (st.turn + 1) % WU.state.teams; }
  function reveal() {
    if (st.phase !== 'play') return;
    st.demo = false;
    st.phase = WU.state.teams ? 'award' : 'done';
    st.points = Math.max(1, st.n * st.n - st.used);
    var closed = [];
    for (var i = 0; i < st.n * st.n; i++) if (!st.open[i]) closed.push(i);
    closed = WU.shuffle(closed);
    var step = WU.isCalm() ? 0 : Math.min(60, 900 / Math.max(1, closed.length));
    closed.forEach(function (i, k) {
      timers.push(setTimeout(function () { var t = box && box.querySelector('[data-t="' + i + '"]'); if (t) t.classList.add('gone'); if (k % 3 === 0) WU.sound.clack(); }, k * step));
    });
    timers.push(setTimeout(function () { if (!box) return; WU.sound.ding(); closed.forEach(function (i) { st.open[i] = true; }); renderCol(); }, closed.length * step + 150));
  }
  function award(i) {
    if (st.phase !== 'award' || i >= WU.state.teams) return;
    st.winner = i; st.phase = 'done';
    if (sb) sb.add(i, st.points); else WU.sound.ding();
    renderCol();
  }
  function next() { st.pics = (st.pics || 0) + 1; newPicture(); render(); WU.sound.clack(); }
  function refresh() {
    if (!st) return;
    if (!st.pics && st.used === 0 && st.phase === 'play') st.demo = !!scr.get().demoShow;
    if (!item()) { newPicture(); render(); return; }
    var n = gridOf(item());
    if (n !== st.n && st.phase === 'play') { st.n = n; st.open = {}; st.used = 0; st.cur = Math.floor(n * n / 2); }
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('tiles-sb', sb.visible());
  }
  function keyAction(k) {
    if (k === 'ENTER') openTile();
    else if (k === 'X') bad();
    else if (k === 'G') reveal();
    else if (k === 'N') next();
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
    else if (/^1-/.test(k || '')) WU.toast('Press the number of the team that guessed.');
  }

  WU.views.tiles = {
    title: 'Mystery Tiles',
    teacher: function () {
      if (!st) return null;
      var it = item(), sec = [], info = [];
      if (it) {
        var pic = it.pic ? WU.pic(it.pic) : '<div class="tw-scene">' + sceneHTML(it.scene) + '</div>';
        sec.push({ label: 'The hidden picture', html: pic });
        sec.push({ label: 'Answer', text: answerText(it), big: true, hot: true });
        if (it.reveal) sec.push({ label: 'Sentence at the end', text: it.reveal });
      }
      info.push({ label: 'Tiles opened', text: st.used + ' of ' + st.n * st.n });
      if (WU.state.teams) info.push({ label: 'Turn', text: teamName(st.turn % WU.state.teams) });
      if (st.phase === 'award') info.push({ label: 'Now', text: 'Press the number of the team that guessed. It gets ' + st.points + ' points.' });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['Arrows', 'choose a tile'], ['Enter / Space', 'good question: open the tile'], ['X', 'bad question: nothing opens'], ['G', 'guessed it / reveal'],
        ['N', 'next picture'], ['1 - 4', 'after a guess: the team that guessed'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { turn: 0, demo: !!scr.get().demoShow };
      el.innerHTML = '<div class="tiles"><div class="layer"></div>' + kit.header('Mystery Tiles') + '<div class="hints"></div></div>';
      box = el.querySelector('.tiles');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('tiles-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newPicture(); render();
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (st.phase === 'award') {
        var m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
        if (m && !e.shiftKey) { award(+m[1] - 1); return true; }
      }
      if (sb && sb.onKey(e)) return true;
      var k = e.key;
      if (k === 'ArrowUp') { moveCur(-1, 0); return true; }
      if (k === 'ArrowDown') { moveCur(1, 0); return true; }
      if (k === 'ArrowLeft') { moveCur(0, -1); return true; }
      if (k === 'ArrowRight') { moveCur(0, 1); return true; }
      if (k === 'Enter' || e.code === 'Space') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { x: 'X', g: 'G', n: 'N', s: 'S' }, a = map[k.toLowerCase()];
      if (a) { keyAction(a); return true; }
    }
  };
})();
