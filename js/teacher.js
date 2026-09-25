/* Warm Up: TEACHER SCREEN.
   A second window for the teacher's laptop (Windows "Extend": the board shows the game, the laptop shows this).
   It shows what only the teacher should know (the hidden picture, the word, the secret truth / lie...), the timer,
   the scores and big buttons for the game's keys. The board never shows any of it.
   How the two windows talk: directly (window.open reference + postMessage) and through a BroadcastChannel as a backup.
   Same computer, no internet. The board runs the game; the teacher window only sends key presses and draws what it gets.
   Each game adds WU.views.<game>.teacher() returning { secret: [...], info: [...] } (see DEVELOPERS.md). */
(function () {
  'use strict';
  var WU = window.WU;
  var NAME = 'warm-up-teacher', TAG = 'wu-teacher';
  var isTeacher = /[?&]teacher\b/.test(location.search);
  var bc = null, peer = null, seen = {}, lastSent = '', timer = null, observer = null, heard = false;
  try { bc = new BroadcastChannel(TAG); } catch (e) { bc = null; }

  WU.icons.teacher = '<svg width="32" height="30" viewBox="0 0 32 28"><rect x="5" y="4" width="22" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="3"></rect><path d="M2 23h28" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path></svg>';

  /* ---------- messages ---------- */
  function send(msg) {
    msg[TAG] = true; msg.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    if (bc) try { bc.postMessage(msg); } catch (e) {}
    var to = isTeacher ? window.opener : peer;
    if (to && !to.closed) try { to.postMessage(msg, '*'); } catch (e) {}
  }
  function listen(fn) {
    var handle = function (d) {
      if (!d || !d[TAG] || seen[d.id]) return;
      seen[d.id] = 1; fn(d);
    };
    if (bc) bc.onmessage = function (e) { handle(e.data); };
    window.addEventListener('message', function (e) { handle(e.data); });
  }

  /* ---------- board side ---------- */
  function keyEvent(k) {
    return { forwarded: true, key: k.key, code: k.code || '', shiftKey: !!k.shift, ctrlKey: false, metaKey: false, altKey: false,
      target: document.body, preventDefault: function () {}, stopPropagation: function () {} };
  }
  function boardState() {
    var v = WU.views[WU.current] || {}, L = WU.LEVELS[WU.state.level], t = null;
    try { t = v.teacher ? v.teacher() : null; } catch (e) { t = { secret: [{ label: 'Error', text: String(e && e.message || e) }] }; }
    var screen = document.getElementById('screen');
    var clock = screen.querySelector('.wut'), cd = clock && clock.querySelector('.wut-d'), cl = clock && clock.querySelector('.wut-l');
    var hints = [].slice.call(screen.querySelectorAll('.hints .hint')).map(function (h) {
      return [h.querySelector('.k').textContent, h.querySelector('.l').textContent];
    });
    var n = WU.state.teams, scores = WU.store.get('scores', [0, 0, 0, 0]);
    return {
      type: 'state', view: WU.current, title: v.title || 'Home', level: L.name + ' ' + L.code, lesson: WU.state.lesson,
      editing: !!WU.editing, overlay: !!WU.overlay, secret: (t && t.secret) || [], info: (t && t.info) || [], choices: (t && t.choices) || null,
      timer: cd ? { text: cd.textContent, label: cl ? cl.textContent : '' } : null, hints: hints,
      teams: n ? WU.state.teamNames.slice(0, n).map(function (nm, i) { return { name: nm || 'TEAM ' + (i + 1), color: WU.TEAM_COLORS[WU.state.teamColors[i]] || '#fff', score: scores[i] || 0 }; }) : []
    };
  }
  function push(force) {
    // Nothing to do until a teacher window exists.
    if (!heard && !(peer && !peer.closed)) return;
    var s = boardState(), j = JSON.stringify(s);
    if (!force && j === lastSent) return;
    lastSent = j; send(s);
  }
  var pushSoon = (function () { var t = null; return function () { clearTimeout(t); t = setTimeout(push, 60); }; })();
  function startBoard() {
    listen(function (m) {
      if (m.type === 'hello') { heard = true; lastSent = ''; push(true); }
      else if (m.type === 'key') { WU.onKeyDown(keyEvent(m)); pushSoon(); }
      else if (m.type === 'go') { WU.go(m.view); }
      else if (m.type === 'act') { var v = WU.views[WU.current]; if (v && v.teacherAct) v.teacherAct(m.name, m.arg); pushSoon(); }
    });
    // The board keeps the teacher window up to date: on every change on screen, and twice a second for timers.
    observer = new MutationObserver(pushSoon);
    observer.observe(document.getElementById('stage'), { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] });
    WU.on('route', pushSoon); WU.on('content', pushSoon); WU.on('change', pushSoon);
    timer = setInterval(push, 500);
    // After the board reloads, find the teacher window again (same window name, no reload).
    try { var w = window.open('', NAME); if (w && w.location && /[?&]teacher\b/.test(w.location.search)) peer = w; else if (w && w !== window) w.close(); } catch (e) {}
  }
  WU.teacher = {
    isTeacher: isTeacher,
    // Opens (or brings back) the teacher window. Must come from a click or key press on the board.
    open: function () {
      var url = location.href.split('#')[0].split('?')[0] + '?teacher';
      try {
        if (peer && !peer.closed) { peer.focus(); push(true); return; }
        peer = window.open(url, NAME, 'popup,width=1100,height=760');
        if (!peer) { WU.toast('The browser blocked the window. Allow pop-ups for this page.'); return; }
        WU.toast('Teacher screen opened: drag it to your laptop.');
        setTimeout(function () { push(true); }, 600);
      } catch (e) { WU.toast('Could not open the teacher screen.'); }
    }
  };

  /* ---------- teacher window ---------- */
  var ICON_KEYS = {
    SPACE: { key: ' ', code: 'Space' }, ENTER: { key: 'Enter', code: 'Enter' }, Esc: { key: 'Escape', code: 'Escape' },
    LEFT: { key: 'ArrowLeft' }, RIGHT: { key: 'ArrowRight' }, UP: { key: 'ArrowUp' }, DOWN: { key: 'ArrowDown' }
  };
  function keyFor(label) {
    if (ICON_KEYS[label]) return ICON_KEYS[label];
    if (/^[A-Z]$/.test(label)) return { key: label.toLowerCase(), code: 'Key' + label };
    if (/^[0-9]$/.test(label)) return { key: label, code: 'Digit' + label };
    return null;
  }
  // Composite hints ("T / L", "ARROWS", "1-4") become one button per key.
  function expand(h) {
    var k = h[0], l = h[1];
    if (k === 'T / L') return [['T', 'TRUTH (secret)'], ['L', 'LIE (secret)']];
    if (k === 'UP / DOWN') return [['UP', 'one more vote'], ['DOWN', 'one less']];
    if (k === 'ARROWS') return [['LEFT', '←'], ['UP', '↑'], ['DOWN', '↓'], ['RIGHT', '→']];
    if (k === 'A-Z') return [];
    var m = /^1-([2-4])$/.exec(k);
    if (m) { var out = []; for (var i = 1; i <= +m[1]; i++) out.push([String(i), 'team ' + i]); return out; }
    return keyFor(k) ? [[k, l]] : [];
  }
  function esc(s) { return WU.esc(s == null ? '' : String(s)); }
  function row(x) {
    return '<div class="tw-item' + (x.big ? ' big' : '') + (x.hot ? ' hot' : '') + '">' + (x.label ? '<div class="tw-l">' + esc(x.label) + '</div>' : '') +
      (x.html ? '<div class="tw-pic">' + x.html + '</div>' : '') + (x.text != null && x.text !== '' ? '<div class="tw-t">' + esc(x.text) + '</div>' : '') + '</div>';
  }
  function renderTeacher(s) {
    var root = document.getElementById('tw');
    if (!s) {
      root.innerHTML = '';
      root.innerHTML = '<div class="tw-top"><b>TEACHER SCREEN</b><span class="tw-dot off"></span><span>Waiting for the board...</span></div>' +
        '<div class="tw-wait"><p>Open this window from the board: press <b>V</b> on the board window (or click the laptop button in its top bar).</p>' +
        '<p>This window only works together with the Warm Up window on the board.</p></div>';
      return;
    }
    var h = '<div class="tw-top"><b>TEACHER SCREEN</b><span class="tw-dot"></span><span>' + esc(s.title) + '</span><span class="tw-lv">' + esc(s.level) + '</span>' +
      (s.editing ? '<span class="tw-warn">Edit mode is on (the board shows pink outlines). Press E to finish.</span>' : '') + '</div>';
    h += '<div class="tw-body"><div class="tw-main">';
    if (s.secret.length) h += '<div class="tw-secret"><div class="tw-h">ONLY YOU SEE THIS</div>' + s.secret.map(row).join('') + '</div>';
    else if (s.view === 'home') h += '<div class="tw-secret"><div class="tw-h">HOME</div><div class="tw-item"><div class="tw-t">Choose a game below or on the board (keys 1-9).</div></div></div>';
    if (s.info.length) h += '<div class="tw-info">' + s.info.map(row).join('') + '</div>';
    h += '</div><div class="tw-side">';
    if (s.timer) h += '<div class="tw-timer"><div class="tw-l">TIMER</div><div class="tw-tt">' + esc(s.timer.text) + '</div><div class="tw-l">' + esc(s.timer.label) + '</div></div>';
    h += '</div></div>';
    var btns = [];
    s.hints.forEach(function (x) { expand(x).forEach(function (b) { btns.push(b); }); });
    // A game can offer a list to choose from here (The Bomb: categories). Only the teacher sees it.
    var k = '';
    if (s.choices) {
      var c = s.choices;
      k += '<div class="tw-choices" id="tw-choices"><div class="tw-h2">' + esc(c.title) + '</div>' + (c.help ? '<div class="tw-note">' + esc(c.help) + '</div>' : '') +
        '<div class="tw-cacts">' + (c.actions || []).map(function (a) { return '<button data-act-n="' + esc(a[0]) + '">' + esc(a[1]) + '</button>'; }).join('') + '</div>' +
        (c.groups || []).map(function (g) {
          return (g.title ? '<div class="tw-l">' + esc(g.title) + '</div>' : '') + '<div class="tw-clist">' + g.items.map(function (it) {
            return '<div class="tw-ci' + (it.now ? ' now' : '') + (it.next ? ' next' : '') + '"><button class="tick' + (it.tick ? ' on' : '') + '" data-act-n="toggle" data-arg="' + esc(it.ref) + '" title="Tick for a set">' + (it.tick ? it.tick : '') + '</button>' +
              '<button class="pick" data-act-n="pickOne" data-arg="' + esc(it.ref) + '">' + esc(it.label) + (it.now ? ' <i>NOW</i>' : '') + (it.next ? ' <i>NEXT</i>' : '') + '</button></div>';
          }).join('') + '</div>';
        }).join('') + '</div>';
    }
    k += '<div class="tw-keys">' + btns.map(function (b) {
      return '<button data-k="' + esc(b[0]) + '"><span class="k">' + esc(b[0]) + '</span><span>' + esc(b[1]) + '</span></button>';
    }).join('') + (s.view !== 'home' ? '' : '<div class="tw-games">' + WU.content.games.map(function (g, i) {
      return '<button data-go="' + g.id + '"><span class="k">' + (i + 1) + '</span><span>' + esc(g.name) + '</span></button>'; }).join('') + '</div>') + '</div>';
    if (s.teams.length) k += '<div class="tw-scores">' + s.teams.map(function (t, i) {
      return '<div style="background:' + t.color + '"><span>' + esc(t.name) + '</span><b>' + t.score + '</b><span class="tw-pm"><i data-k="' + (i + 1) + '">+</i><i data-k="' + (i + 1) + '" data-shift="1">&minus;</i></span></div>';
    }).join('') + '</div>';
    k += '<div class="tw-note">Your keyboard works in this window too: every key goes to the board.' + (s.overlay ? ' A window is open on the board (Esc closes it).' : '') + '</div>';
    // Redraw only what changed, so a click on a button is never lost to a timer tick.
    if (!root.querySelector('#tw-a')) root.innerHTML = '<div id="tw-a"></div><div id="tw-b"></div>';
    var a = root.querySelector('#tw-a'), bEl = root.querySelector('#tw-b');
    if (a._h !== h) { a.innerHTML = h; a._h = h; }
    if (bEl._h !== k) {
      bEl.innerHTML = k; bEl._h = k;
      bEl.querySelectorAll('[data-k]').forEach(function (b) {
        b.onclick = function () {
          var kk = keyFor(b.getAttribute('data-k')); if (!kk) return;
          send({ type: 'key', key: kk.key, code: kk.code, shift: !!b.getAttribute('data-shift') });
        };
      });
      bEl.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { send({ type: 'go', view: b.getAttribute('data-go') }); }; });
      bEl.querySelectorAll('[data-act-n]').forEach(function (b) { b.onclick = function () { send({ type: 'act', name: b.getAttribute('data-act-n'), arg: b.getAttribute('data-arg') || '' }); }; });
    }
  }
  function startTeacher() {
    document.title = 'Warm Up: teacher screen';
    document.body.className = 'tw-body-page'; document.documentElement.style.overflow = 'auto';
    var wrap = document.getElementById('wrap'); if (wrap) wrap.style.display = 'none';
    var root = document.createElement('div'); root.id = 'tw'; document.body.appendChild(root);
    var last = null, lastAt = 0;
    renderTeacher(null);
    listen(function (m) { if (m.type === 'state') { last = m; lastAt = Date.now(); renderTeacher(m); } });
    // Every key pressed here goes to the board (V and browser shortcuts stay here).
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'v' || e.key === 'V' || /^F\d+$/.test(e.key)) return;
      // A list is already on this screen: C jumps to it here instead of opening it on the board.
      if ((e.key === 'c' || e.key === 'C') && last && last.choices) { var ch = document.getElementById('tw-choices'); if (ch) ch.scrollIntoView({ block: 'start' }); return; }
      if (e.key === ' ' || e.key === 'Enter' || /^Arrow/.test(e.key) || e.key === 'Backspace' || e.key === 'Tab') e.preventDefault();
      send({ type: 'key', key: e.key, code: e.code, shift: e.shiftKey });
    });
    var hello = function () { send({ type: 'hello' }); };
    hello(); setInterval(function () { if (Date.now() - lastAt > 2500) { hello(); if (last && Date.now() - lastAt > 4000) { last = null; renderTeacher(null); } } }, 1000);
  }

  WU.teacher.start = function () { if (isTeacher) startTeacher(); else startBoard(); };
})();
