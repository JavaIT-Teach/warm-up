/* Warm Up: core. Storage, settings, sound, stage scaling, routing, keyboard, overlays.
   Plain script (no modules) so the app runs from file://. Everything hangs off window.WU. */
(function () {
  'use strict';
  var WU = window.WU = window.WU || {};
  WU.content = WU.content || {};
  WU.views = WU.views || {};

  WU.LEVELS = [
    { name: 'Beginner', code: 'A1' },
    { name: 'Elementary', code: 'A2' },
    { name: 'Pre-Intermediate', code: 'A2+' },
    { name: 'Intermediate', code: 'B1' },
    { name: 'IELTS 1', code: 'B2' },
    { name: 'IELTS 2', code: '6.0' },
    { name: 'IELTS 3', code: '7.0+' }
  ];

  // Shared palette from the Riot Pop · Paper design.
  WU.C = { ink: '#0d0d0d', paper: '#f4f1ea', lime: '#c6ff00', orange: '#ff5a1f', blue: '#3d6bff', pink: '#ff4fc3', yellow: '#ffe600', teal: '#00e5c7' };
  WU.TEAM_COLORS = ['#c6ff00', '#ff4fc3', '#3d6bff', '#ffe600', '#ff5a1f', '#00e5c7'];

  /* ---------- helpers ---------- */
  WU.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  WU.rand = function (n) { return Math.floor(Math.random() * n); };
  WU.pick = function (arr) { return arr[WU.rand(arr.length)]; };
  WU.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = WU.rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  WU.frag = function (html) {
    var d = document.createElement('div'); d.innerHTML = html.trim();
    return d.firstChild;
  };
  // Re-trigger a CSS animation on an element.
  WU.restartAnim = function (el, cls) {
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  };

  /* ---------- storage (localStorage, all keys prefixed wu-) ---------- */
  var PFX = 'wu-';
  WU.store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(PFX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) {} },
    clearAll: function () {
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(PFX) === 0) keys.push(k); }
        keys.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
      if (WU.images) WU.images.clear();
      if (WU.edits) WU.edits.reload();
    }
  };

  /* ---------- settings state ---------- */
  var DEFAULTS = {
    level: 0, lesson: 'regular', muted: false, calm: null, students: 12,
    teams: 0, teamNames: ['LIME', 'PINK', 'BLUE', 'YELLOW'], teamColors: [0, 1, 2, 3],
    classes: [], classId: ''
  };
  WU.state = {};
  WU.loadState = function () {
    Object.keys(DEFAULTS).forEach(function (k) {
      var v = WU.store.get(k, DEFAULTS[k]);
      WU.state[k] = (v === undefined) ? JSON.parse(JSON.stringify(DEFAULTS[k])) : v;
    });
    var s = WU.state;
    if (!(s.level >= 0 && s.level < WU.LEVELS.length)) s.level = 0;
    if (s.lesson !== 'first') s.lesson = 'regular';
    s.students = Math.max(2, Math.min(60, parseInt(s.students, 10) || 12));
    if ([0, 2, 3, 4].indexOf(s.teams) < 0) s.teams = 0;
    if (!Array.isArray(s.classes)) s.classes = [];
    if (s.classId && !s.classes.some(function (c) { return c.id === s.classId; })) s.classId = '';
  };
  WU.setState = function (patch) {
    Object.keys(patch).forEach(function (k) { WU.state[k] = patch[k]; WU.store.set(k, patch[k]); });
    WU.applyCalm();
    WU.emit('change', patch);
  };

  /* ---------- tiny event bus ---------- */
  var listeners = {};
  WU.on = function (ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return function () { WU.off(ev, fn); }; };
  WU.off = function (ev, fn) { listeners[ev] = (listeners[ev] || []).filter(function (f) { return f !== fn; }); };
  WU.emit = function (ev, data) { (listeners[ev] || []).slice().forEach(function (f) { try { f(data); } catch (e) { console.error(e); } }); };

  /* ---------- calm (reduced) motion ---------- */
  WU.isCalm = function () {
    if (WU.state.calm === true || WU.state.calm === false) return WU.state.calm;
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };
  WU.applyCalm = function () { document.body.classList.toggle('calm', WU.isCalm()); };

  /* ---------- rosters and the no-repeat student picker ---------- */
  WU.activeClass = function () {
    var id = WU.state.classId;
    return WU.state.classes.filter(function (c) { return c.id === id; })[0] || null;
  };
  WU.roster = function () {
    var c = WU.activeClass();
    if (c && c.names && c.names.length) return c.names.slice();
    var out = []; for (var i = 1; i <= WU.state.students; i++) out.push('Student ' + i);
    return out;
  };
  // Never repeats a name until everyone in the current roster has been picked.
  WU.nextStudent = function () {
    var names = WU.roster(), c = WU.activeClass();
    var key = 'picked-' + (c && c.names && c.names.length ? c.id : 'n' + names.length);
    var used = WU.store.get(key, []).filter(function (n) { return names.indexOf(n) >= 0; });
    var pool = names.filter(function (n) { return used.indexOf(n) < 0; });
    if (!pool.length) { used = []; pool = names.slice(); }
    var name = WU.pick(pool);
    used.push(name); WU.store.set(key, used);
    return name;
  };

  /* ---------- sound (Web Audio, no files) ---------- */
  var ctx;
  function A() { return ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)()); }
  function tone(f, d, type, v, slide) {
    if (WU.state.muted) return;
    try {
      var c = A(), t = c.currentTime, o = c.createOscillator(), g = c.createGain();
      o.type = type || 'square'; o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
      g.gain.setValueAtTime(v || 0.15, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d);
    } catch (e) {}
  }
  function noise(d, v, freq) {
    if (WU.state.muted) return;
    try {
      var c = A(), b = c.createBuffer(1, Math.floor(c.sampleRate * d), c.sampleRate), data = b.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2);
      var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = b; f.type = 'lowpass'; f.frequency.value = freq || 1000; g.gain.value = v || 0.6;
      s.connect(f); f.connect(g); g.connect(c.destination); s.start();
    } catch (e) {}
  }
  WU.sound = {
    unlock: function () { try { A().resume(); } catch (e) {} },
    tick: function (hi) { tone(hi ? 1700 : 1150, 0.045, 'square', 0.12); },
    clack: function () { tone(620, 0.03, 'triangle', 0.18); },
    beep: function (f) { tone(f || 660, 0.13, 'square', 0.12); },
    ding: function () { tone(880, 0.5, 'triangle', 0.22); setTimeout(function () { tone(1320, 0.7, 'triangle', 0.22); }, 120); },
    slam: function () { noise(0.35, 0.7, 700); tone(95, 0.3, 'sine', 0.5, 40); },
    boom: function () { noise(2.4, 1, 900); tone(120, 1.3, 'sine', 0.7, 28); },
    buzzer: function () { tone(150, 0.9, 'sawtooth', 0.2, 90); },
    pop: function () { tone(520, 0.08, 'triangle', 0.16, 900); }
  };
  WU.toggleMute = function () { WU.setState({ muted: !WU.state.muted }); WU.sound.unlock(); };

  /* ---------- stage: fixed 1920x1080 board, scaled to fit the window ---------- */
  WU.W = 1920; WU.H = 1080; WU.scale = 1;
  WU.fit = function () {
    var st = document.getElementById('stage'); if (!st) return;
    WU.scale = Math.min(window.innerWidth / WU.W, window.innerHeight / WU.H);
    st.style.transform = 'scale(' + WU.scale + ')';
  };

  WU.toggleFullscreen = function () {
    var d = document, el = d.documentElement;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } catch (e) {}
  };

  /* ---------- toast ---------- */
  var toastT;
  WU.toast = function (msg) {
    var st = document.getElementById('stage'), t = document.getElementById('wu-toast');
    if (!t) { t = document.createElement('div'); t.id = 'wu-toast'; t.className = 'toast'; st.appendChild(t); }
    t.textContent = msg; WU.restartAnim(t, 'show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2600);
  };

  /* ---------- overlays (settings, help, picker) ---------- */
  WU.overlay = null;
  WU.openOverlay = function (o) {
    WU.closeOverlay();
    var st = document.getElementById('stage');
    var el = document.createElement('div'); el.className = 'overlay ' + (o.cls || '');
    el.addEventListener('click', function (e) { if (e.target === el && o.dismiss !== false) WU.closeOverlay(); });
    st.appendChild(el);
    WU.overlay = { el: el, o: o };
    o.render(el);
    return el;
  };
  WU.closeOverlay = function () {
    if (!WU.overlay) return;
    var ov = WU.overlay; WU.overlay = null;
    if (ov.o.onClose) ov.o.onClose();
    if (ov.el.parentNode) ov.el.parentNode.removeChild(ov.el);
  };

  var GLOBAL_KEYS = [['E', 'edit mode (teacher)'], ['Tab + Enter', 'choose a button'], ['Esc', 'home / close'], ['M', 'mute'], ['F', 'fullscreen'], ['?', 'this help']];
  WU.showHelp = function () {
    var v = WU.current && WU.views[WU.current];
    var keys = (v && v.help ? v.help() : []).concat(GLOBAL_KEYS);
    WU.openOverlay({
      cls: 'help',
      render: function (el) {
        el.innerHTML = '<div class="panel help-panel"><div class="chip-label" style="background:#ffe600">KEYBOARD</div>' +
          '<div class="help-title">' + WU.esc(v && v.title ? v.title : 'Warm Up') + '</div><div class="help-grid">' +
          keys.map(function (k) { return '<div class="help-row"><span class="key">' + WU.esc(k[0]) + '</span><span>' + WU.esc(k[1]) + '</span></div>'; }).join('') +
          '</div><div class="btn" data-close><span class="key inv">Esc</span>Close</div></div>';
        el.querySelector('[data-close]').onclick = WU.closeOverlay;
      }
    });
  };

  /* ---------- shared header bits ---------- */
  WU.icons = {
    settings: '<svg width="30" height="30" viewBox="0 0 28 28"><circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="4 3"></circle><circle cx="14" cy="14" r="3" fill="currentColor"></circle></svg>',
    full: '<svg width="28" height="28" viewBox="0 0 28 28"><path d="M3 10V3h7 M18 3h7v7 M25 18v7h-7 M10 25H3v-7" fill="none" stroke="currentColor" stroke-width="3"></path></svg>',
    help: '<span style="font-family:var(--display);font-size:32px;line-height:1">?</span>',
    sound: function () {
      return '<svg width="30" height="30" viewBox="0 0 28 28"><polygon points="3,10 9,10 16,4 16,24 9,18 3,18" fill="currentColor"></polygon>' +
        (WU.state.muted ? '<path d="M19 10 L26 18 M26 10 L19 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>'
          : '<path d="M20 9 Q25 14 20 19" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>') + '</svg>';
    }
  };
  // Wires elements with data-act="mute|full|help|home" inside root.
  WU.wireCommon = function (root) {
    root.querySelectorAll('[data-act]').forEach(function (b) {
      var a = b.getAttribute('data-act');
      if (a === 'mute') b.onclick = WU.toggleMute;
      else if (a === 'full') b.onclick = WU.toggleFullscreen;
      else if (a === 'help') b.onclick = WU.showHelp;
      else if (a === 'home') b.onclick = function () { WU.go('home'); };
      else if (a === 'edit') { b.onclick = function () { WU.toggleEdit(); }; b.classList.toggle('on', !!WU.editing); }
    });
  };
  WU.refreshMuteIcons = function (root) {
    (root || document).querySelectorAll('[data-act="mute"]').forEach(function (b) { b.innerHTML = WU.icons.sound(); });
  };

  /* ---------- router (hash based, works from file://) ---------- */
  WU.current = null;
  WU.go = function (name) {
    var h = name === 'home' ? '' : name;
    if ((location.hash || '').replace('#', '') === h) WU.route(); else location.hash = h;
  };
  WU.route = function () {
    var name = (location.hash || '').replace('#', '') || 'home';
    if (!WU.views[name] || (WU.views[name].ready === false)) name = 'home';
    WU.closeOverlay();
    if (WU.current && WU.views[WU.current].unmount) WU.views[WU.current].unmount();
    var screen = document.getElementById('screen');
    screen.innerHTML = '';
    WU.current = name;
    WU.views[name].mount(screen);
    WU.emit('route', name);
  };

  /* ---------- keyboard ---------- */
  function typing(e) {
    var t = e.target, tg = t && t.tagName;
    return tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT' || (t && t.isContentEditable);
  }
  WU.onKeyDown = function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (typing(e)) { if (e.key === 'Escape') e.target.blur(); return; }
    var ov = WU.overlay;
    if (ov) {
      if (ov.o.onKey && ov.o.onKey(e) === true) return;
      if (e.key === 'Escape') { e.preventDefault(); WU.closeOverlay(); return; }
      // Keyboard first: Enter / Space press the focused button inside a panel.
      var a = document.activeElement;
      if ((e.key === 'Enter' || e.key === ' ') && a && a !== document.body && ov.el.contains(a) && a.hasAttribute('tabindex')) { e.preventDefault(); a.click(); return; }
      if (e.key === '?') { e.preventDefault(); if (ov.o.cls === 'help') WU.closeOverlay(); else WU.showHelp(); return; }
      if (e.key === 'm' || e.key === 'M') WU.toggleMute();
      else if (e.key === 'f' || e.key === 'F') WU.toggleFullscreen();
      return;
    }
    var v = WU.views[WU.current];
    // A game that is taking typed letters (Word Chain) gets them before the E / M / F shortcuts.
    if (!WU.editing && v && v.grabKey && v.grabKey(e) === true) return;
    if (WU.editKey && WU.editKey(e)) return;
    if (v && v.onKey && v.onKey(e) === true) return;
    var k = e.key;
    if (k === '?') { e.preventDefault(); WU.showHelp(); }
    else if (k === 'Escape') { if (WU.current !== 'home') WU.go('home'); }
    else if (k === 'm' || k === 'M') WU.toggleMute();
    else if (k === 'f' || k === 'F') WU.toggleFullscreen();
  };

  /* ---------- boot ---------- */
  WU.boot = function () {
    WU.loadState();
    WU.applyCalm();
    try { window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', WU.applyCalm); } catch (e) {}
    WU.fit();
    window.addEventListener('resize', WU.fit);
    document.addEventListener('keydown', WU.onKeyDown);
    // Browsers only allow audio after a user gesture.
    document.addEventListener('pointerdown', function () { WU.sound.unlock(); }, { once: true });
    document.addEventListener('keydown', function () { WU.sound.unlock(); }, { once: true });
    WU.on('change', function () { WU.refreshMuteIcons(); });
    window.addEventListener('hashchange', WU.route);
    // Uploaded images live in IndexedDB; load them before the first screen draws.
    (WU.images ? WU.images.load() : Promise.resolve()).then(function () { WU.route(); WU.emit('booted'); });
  };
})();
