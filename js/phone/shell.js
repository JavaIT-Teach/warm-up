/* Warm Up on a phone: one student, on their own time (phone.html).
   The same content and teacher edits as the board (WU.list, synced from GitHub), but a portrait screen with big touch
   buttons and a check / reveal step, because nobody is there to judge. Only the games that work alone are here.
   Each game is WU.phone.games[id] = { mount(body, ctx), unmount() } (js/phone/games-*.js).
   ctx: { S (screen texts of the game at this level), level, actions([...]), score(ok), bar, toast, again() }. */
(function () {
  'use strict';
  var WU = window.WU;
  var P = WU.phone = { games: {} };
  // The solo games, in menu order. Board games that need a room (The Bomb, Tug of War...) are not here.
  P.ORDER = ['hunt', 'vanish', 'chain', 'volcano', 'timemachine', 'phrasal', 'flash', 'nearfar', 'where', 'dice', 'slot'];
  // What the student does on the phone (the board text says what the class does).
  P.HOW = {
    hunt: 'Find the hidden words. Tap the first letter, then the last.',
    vanish: 'Read it. Words vanish. Write it from memory.',
    chain: 'You and the phone take turns. Use the last letter.',
    volcano: 'Type the past forms before the volcano erupts.',
    timemachine: 'Build the sentence in the right tense.',
    phrasal: 'Spin a phrasal verb. Pick what it means.',
    flash: 'Look fast. Then answer: was it there?',
    nearfar: 'This, that, these or those? Pick the right one.',
    where: 'Where is it? Pick the right preposition.',
    dice: 'Roll the pictures. Write a story with all of them.',
    slot: 'Spin a topic. Talk about it until the time is up.'
  };

  var app, cur = null, curId = null, onPop = null;
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return WU.esc(s); }
  function gameDef(id) { return (WU.content.games || []).filter(function (g) { return g.id === id; })[0] || null; }
  P.screen = function (id, l) { return WU.list(id, 'screen', l == null ? WU.state.level : l)[0] || {}; };

  /* ---------- small shared helpers for the games ---------- */
  // Words compared the forgiving way: case, curly quotes, punctuation and extra spaces do not count.
  P.norm = function (s) {
    return String(s || '').toLowerCase().replace(/[‘’ʼ`]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  };
  P.fill = function (t, vars) { return WU.kit.fill(t, vars); };
  // A thin time bar in el. start(seconds, onDone), stop(), left() in seconds.
  P.bar = function (el) {
    var t0 = 0, dur = 0, raf = null, done = null, fillEl;
    el.innerHTML = '<div class="pbar"><i></i></div>'; fillEl = el.querySelector('i');
    function tick() {
      var left = Math.max(0, dur - (Date.now() - t0) / 1000);
      fillEl.style.width = (100 * left / dur) + '%';
      fillEl.parentNode.classList.toggle('low', left < Math.min(5, dur * 0.3));
      if (left <= 0) { raf = null; var d = done; done = null; if (d) d(); return; }
      raf = requestAnimationFrame(tick);
    }
    return {
      start: function (sec, cb) { this.stop(); if (!(sec > 0)) { el.style.visibility = 'hidden'; return; } el.style.visibility = ''; t0 = Date.now(); dur = sec; done = cb; tick(); },
      stop: function () { if (raf) cancelAnimationFrame(raf); raf = null; done = null; },
      left: function () { return raf ? Math.max(0, dur - (Date.now() - t0) / 1000) : 0; }
    };
  };
  P.toast = function (msg) {
    var t = $('#ptoast'); if (!t) { t = document.createElement('div'); t.id = 'ptoast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2400);
  };
  // Feedback stamp over the game (RIGHT! / NOT QUITE).
  P.stamp = function (ok, text) {
    var b = $('.pbody'); if (!b) return;
    var s = document.createElement('div'); s.className = 'pstamp ' + (ok ? 'ok' : 'no'); s.textContent = text || (ok ? 'RIGHT!' : 'NOT QUITE');
    b.appendChild(s); setTimeout(function () { s.remove(); }, 1100);
    if (ok) WU.sound.ding(); else WU.sound.buzzer();
  };

  /* ---------- level ---------- */
  function levelChosen() { return WU.store.get('phone-level-set', false) === true; }
  function levelChips(cls) {
    return '<div class="plevels ' + (cls || '') + '">' + WU.LEVELS.map(function (L, i) {
      return '<button class="plv' + (levelChosen() && i === WU.state.level ? ' on' : '') + '" data-lv="' + i + '"><b>' + esc(L.name) + '</b><span>' + esc(L.code) + '</span></button>';
    }).join('') + '</div>';
  }
  function wireLevels(root, after) {
    root.querySelectorAll('[data-lv]').forEach(function (b) {
      b.onclick = function () { WU.setState({ level: +b.getAttribute('data-lv') }); WU.store.set('phone-level-set', true); WU.sound.clack(); after(); };
    });
  }

  /* ---------- home ---------- */
  function newGame(g) {
    if (!g || !g.added) return false;
    var d = new Date(g.added + 'T00:00:00'); return !isNaN(d) && (Date.now() - d.getTime()) / 864e5 < (WU.NEW_DAYS || 14);
  }
  function unitOf(g) {
    if (!g.unit) return '';
    if (typeof g.unit === 'string') return g.unit;
    return g.unit[WU.state.level] || '';
  }
  function home() {
    stopGame(); curId = null;
    if (!levelChosen()) { pickLevel(); return; }
    var L = WU.LEVELS[WU.state.level];
    var ids = P.ORDER.filter(function (id) { return gameDef(id) && P.games[id]; });
    // New games first, then the rest; games for other levels last.
    ids.sort(function (a, b) {
      var ga = gameDef(a), gb = gameDef(b), oa = WU.gameOk(a) ? 0 : 2, ob = WU.gameOk(b) ? 0 : 2;
      if (newGame(ga) && oa === 0) oa = -1; if (newGame(gb) && ob === 0) ob = -1;
      return oa - ob || P.ORDER.indexOf(a) - P.ORDER.indexOf(b);
    });
    var h = '<div class="phome"><header class="phead"><div class="plogo"><span>WARM UP!</span></div>' +
      '<button class="pib" data-act="mute" aria-label="Sound">' + WU.icons.sound() + '</button></header>' +
      '<p class="psub">Practise on your own. Pick a game.</p>' +
      '<button class="plvbtn" data-act="level"><span>Your level</span><b>' + esc(L.name) + ' · ' + esc(L.code) + '</b><i>Change</i></button>' +
      '<div class="pcards">';
    ids.forEach(function (id) {
      var g = gameDef(id), ok = WU.gameOk(id), u = unitOf(g);
      h += '<button class="pcard' + (ok ? '' : ' off') + '" data-g="' + id + '" style="--c:' + g.color + '">' +
        '<span class="pcn">' + esc(g.name) + '</span><span class="pch">' + esc(P.HOW[id] || g.hook) + '</span>' +
        '<span class="pct">' + esc(g.trains || '') + '</span>' +
        (ok && newGame(g) ? '<span class="pnew">NEW' + (u ? ' · ' + esc(u) : '') + '</span>' : '') +
        (ok ? '' : '<span class="poff">' + esc(WU.gameLevelText(id)) + '</span>') + '</button>';
    });
    h += '</div><p class="pfoot">New games come every week. <b>Pull down to refresh</b> before you start.<br>' +
      '<a href="index.html?board">Open the board version</a></p></div>';
    app.innerHTML = h;
    app.scrollTop = 0;
    app.querySelector('[data-act="level"]').onclick = pickLevel;
    app.querySelector('[data-act="mute"]').onclick = function () { WU.toggleMute(); WU.refreshMuteIcons(app); };
    app.querySelectorAll('[data-g]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-g');
        if (!WU.gameOk(id)) { P.toast(gameDef(id).name + ': ' + WU.gameLevelText(id) + '.'); return; }
        open(id);
      };
    });
  }
  function pickLevel() {
    stopGame();
    var first = !levelChosen();
    app.innerHTML = '<div class="phome"><header class="phead"><div class="plogo"><span>WARM UP!</span></div></header>' +
      '<h1 class="ph1">' + (first ? 'Hi! What is your level?' : 'Choose your level') + '</h1>' +
      '<p class="psub">Your teacher can tell you. You can change it any time.</p>' + levelChips() +
      (first ? '' : '<button class="pbtn alt wide" data-act="back">Back</button>') + '</div>';
    wireLevels(app, home);
    var bk = app.querySelector('[data-act="back"]'); if (bk) bk.onclick = home;
  }

  /* ---------- a game ---------- */
  function stopGame() { if (cur && cur.unmount) { try { cur.unmount(); } catch (e) { console.error(e); } } cur = null; }
  function open(id, keepHistory) {
    stopGame();
    var g = gameDef(id), def = P.games[id], L = WU.LEVELS[WU.state.level];
    curId = id;
    if (!keepHistory) { try { history.pushState({ g: id }, '', '#' + id); } catch (e) {} }
    app.innerHTML = '<div class="pgame" style="--c:' + g.color + '">' +
      '<header class="pgh"><button class="pib" data-act="home" aria-label="Back to the games">' +
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square"/></svg></button>' +
      '<div class="pgt"><b>' + esc(g.name) + '</b><span>' + esc(L.name) + '</span></div><div class="pscore" data-auto></div></header>' +
      '<main class="pbody"></main><footer class="pact"></footer></div>';
    var body = app.querySelector('.pbody'), act = app.querySelector('.pact'), scoreEl = app.querySelector('.pscore');
    app.querySelector('[data-act="home"]').onclick = function () { goHome(); };
    var right = 0, total = 0;
    function drawScore() { scoreEl.innerHTML = total ? '<b>' + right + '</b> / ' + total : ''; }
    var ctx = {
      id: id, level: WU.state.level, S: P.screen(id),
      // [{ label, on, alt, disabled, id }]; one or two big buttons at the bottom (thumb reach).
      actions: function (list) {
        act.innerHTML = (list || []).map(function (a, i) {
          return '<button class="pbtn' + (a.alt ? ' alt' : '') + (a.small ? ' small' : '') + '" data-i="' + i + '"' + (a.disabled ? ' disabled' : '') + '>' + esc(a.label) + '</button>';
        }).join('');
        act.style.display = list && list.length ? '' : 'none';
        act.querySelectorAll('[data-i]').forEach(function (b) { b.onclick = function () { WU.sound.unlock(); list[+b.getAttribute('data-i')].on(); }; });
      },
      score: function (ok) { total++; if (ok) right++; drawScore(); },
      resetScore: function () { right = total = 0; drawScore(); },
      empty: function (msg) {
        body.innerHTML = '<div class="pempty"><b>Nothing here yet</b><p>' + esc(msg || 'This game has no content for your level yet. Try another game or level.') + '</p></div>';
        ctx.actions([{ label: 'Back to the games', on: goHome }]);
      }
    };
    cur = def;
    try { def.mount(body, ctx); } catch (e) { console.error(e); ctx.empty('Something went wrong in this game. Go back and try again.'); }
  }
  function goHome() { if (curId) { try { history.back(); return; } catch (e) {} } home(); }

  /* ---------- boot ---------- */
  P.boot = function () {
    WU.loadState();
    WU.applyCalm();
    document.body.classList.add('phone');
    app = document.getElementById('papp');
    document.addEventListener('pointerdown', function () { WU.sound.unlock(); }, { once: true });
    // The phone back button / swipe goes back to the game list.
    window.addEventListener('popstate', function () { var id = (location.hash || '').replace('#', ''); if (id && P.games[id] && WU.gameOk(id)) open(id, true); else home(); });
    // Teacher edits (synced from GitHub) arrive after the first draw: redraw the list, keep a running game.
    WU.on('content', function () { if (!curId && levelChosen() && app.querySelector('.pcards')) home(); });
    (WU.images ? WU.images.load() : Promise.resolve()).then(function () {
      if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
      home();
      WU.emit('booted');
    });
  };
})();
