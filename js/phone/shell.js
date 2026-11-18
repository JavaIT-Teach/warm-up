/* Warm Up on a phone: one student, on their own time (phone.html).
   The same content and teacher edits as the board (WU.list, synced from GitHub), but a portrait screen with big touch
   buttons and a check / reveal step, because nobody is there to judge. Every board game is here (group games as pass-the-phone).
   Each game is WU.phone.games[id] = { mount(body, ctx), unmount() } (js/phone/games-*.js).
   ctx: { S (screen texts of the game at this level), level, actions([...]), score(ok), bar, toast, again() }. */
(function () {
  'use strict';
  var WU = window.WU;
  var P = WU.phone = { games: {} };
  // Elias is the one group game: pass the phone (2+ players).
  // Every board game has a phone screen: the menu follows the board's order (content/games.js).
  P.order = function () { return (WU.content.games || []).map(function (g) { return g.id; }).filter(function (id) { return P.games[id]; }); };
  // What the student does on the phone (the board text says what the class does).
  P.HOW = {
    articles: 'a, an, the or nothing? Tap the right one.',
    pinit: 'At, on, in (and more)? Tap the right one.',
    sticky: 'Which preposition sticks? Beat the clock.',
    domino: 'Finish the If-sentence. Your result starts the next one.',
    bomb: 'Type words for the category before the bomb explodes.',
    tug: 'Argue for one side, then the other. Good reasons pull.',
    hotseat: 'With friends: phone on your forehead. They describe, you guess.',
    lie: 'With friends: pass the phone. Truth or lie? Run the detector.',
    names: 'Write your introduction, then a classmate\'s.',
    standup: 'True for you? Say more. Not true? Ask a question.',
    zones: 'Pick an answer, give a reason, then argue for another.',
    opinion: 'Agree or disagree? Say why, then argue the other side.',
    findwho: 'Ask the right question, then report the answer.',
    chat: 'Answer fast. Every round is shorter.',
    hunt: 'Find the hidden words. Tap the first letter, then the last.',
    vanish: 'Read it. Words vanish. Write it from memory.',
    partners: 'One word. Type as many partners as you can before time runs out.',
    elias: 'With friends: pass the phone. One explains, the team guesses.',
    chain: 'You and the phone take turns. Use the last letter.',
    volcano: 'Type the past forms before the volcano erupts.',
    timemachine: 'Build the sentence in the right tense.',
    phrasal: 'Spin a phrasal verb. Pick what it means.',
    flash: 'Look fast. Then answer: was it there?',
    nearfar: 'This, that, these or those? Pick the right one.',
    where: 'Where is it? Pick the right preposition.',
    dice: 'Roll the pictures. Write a story with all of them.',
    slot: 'Spin a topic. Talk about it until the time is up.',
    lostword: 'Someone forgot a word. Which one? Then say it your way.',
    replies: 'Someone says something. Pick the best reply, fast.'
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
    var order = P.order(), ids = order.slice();
    // New games first, then the rest; games for other levels last.
    ids.sort(function (a, b) {
      var ga = gameDef(a), gb = gameDef(b), oa = WU.gameOk(a) ? 0 : 2, ob = WU.gameOk(b) ? 0 : 2;
      if (newGame(ga) && oa === 0) oa = -1; if (newGame(gb) && ob === 0) ob = -1;
      return oa - ob || order.indexOf(a) - order.indexOf(b);
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
    h += '</div><p class="pfoot">New games come every week. A green bar tells you when to refresh.<br>' +
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
  /* ---------- new version? ----------
     Every push to main republishes the site, so phone.html gets a new stamp (ETag / Last-Modified, or its text as a fallback).
     The phone notes the stamp at start, checks again every 5 minutes and when the student comes back to the tab,
     and shows a bar when it changed. It never reloads by itself (no lost game). The button first fetches fresh copies of every
     script and stylesheet (browsers keep them up to 10 minutes), then reloads. Nothing happens when opened from a file. */
  P.updates = (function () {
    var base = null, last = 0, shown = false, EVERY = 5 * 60 * 1000, MIN_GAP = 60 * 1000;
    function url() { return location.href.split('#')[0].split('?')[0]; }
    function hash(t) { var h = 0; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return t.length + ':' + h; }
    function stamp() {
      return fetch(url(), { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw 0;
        var s = r.headers.get('etag') || r.headers.get('last-modified');
        if (s) return s;
        return fetch(url(), { cache: 'no-store' }).then(function (g) { if (!g.ok) throw 0; return g.text(); }).then(hash);
      });
    }
    function check() {
      if (shown || !/^https?:/.test(location.protocol) || document.hidden || Date.now() - last < MIN_GAP) return;
      last = Date.now();
      stamp().then(function (s) {
        if (base == null) base = s;
        else if (s !== base) show();
      }).catch(function () {});
    }
    function show() {
      if (shown) return; shown = true;
      var b = document.createElement('div'); b.id = 'pupdate'; b.setAttribute('role', 'status');
      b.innerHTML = '<span><b>New version!</b> New games or words are ready.</span><button data-u="go">Refresh</button><button data-u="later" aria-label="Later">×</button>';
      document.body.appendChild(b);
      b.querySelector('[data-u="go"]').onclick = refresh;
      b.querySelector('[data-u="later"]').onclick = function () { b.remove(); shown = false; base = null; last = 0; check(); /* ask again later with the new stamp */ };
      WU.sound.beep(880);
    }
    function refresh() {
      var bt = document.querySelector('#pupdate [data-u="go"]'); if (bt) { bt.disabled = true; bt.textContent = 'Loading...'; }
      var files = [].slice.call(document.querySelectorAll('script[src], link[rel="stylesheet"][href]')).map(function (e) { return e.src || e.href; })
        .filter(function (u) { return u.indexOf(location.origin) === 0; });
      var go = function () { location.reload(); };
      Promise.all(files.map(function (u) { return fetch(u, { cache: 'reload' }).catch(function () {}); })).then(go, go);
      setTimeout(go, 8000);
    }
    return {
      start: function () {
        check();
        setInterval(check, EVERY);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
        window.addEventListener('focus', check);
      },
      check: check, show: show
    };
  })();

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
      P.updates.start();
      WU.emit('booted');
    });
  };
})();
