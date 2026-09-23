/* Warm Up: shared pieces every game reuses. Countdown timer, student picker reveal, floating team scoreboard. */
(function () {
  'use strict';
  var WU = window.WU;

  /* ---------- Timer: big ring, colour shift in the last 10 seconds, sound at zero ----------
     WU.Timer({ seconds, size, onDone }) -> { el, start(), toggle(), stop(), destroy() }. Tap the ring to start/pause. */
  WU.Timer = function (opts) {
    var size = opts.size || 520, total = (opts.seconds || 30) * 1000;
    var el = WU.frag('<div class="wut" style="width:' + size + 'px;height:' + size + 'px">' +
      '<div class="wut-in" style="left:' + Math.round(size * 0.085) + 'px;top:' + Math.round(size * 0.085) + 'px;right:' + Math.round(size * 0.085) + 'px;bottom:' + Math.round(size * 0.085) + 'px">' +
      '<div class="wut-d"></div><div class="wut-l" style="font-size:' + Math.max(18, Math.round(size * 0.05)) + 'px"></div></div></div>');
    var inner = el.firstChild, dEl = inner.firstChild, lEl = inner.lastChild;
    var left = null, running = false, done = false, end = 0, iv = null, lastSec = null, lastTxt = '';

    function render() {
      var idle = left == null, l = idle ? total : left, s = Math.ceil(l / 1000);
      var ring = '#3d6bff', inn = '#f4f1ea', ink = '#0d0d0d', shake = false;
      if (done) { inn = '#0d0d0d'; ink = '#c6ff00'; ring = '#0d0d0d'; }
      else if (!idle && s <= 3) { inn = '#ff4fc3'; ring = '#ffe600'; shake = running; }
      else if (!idle && s <= 5) { inn = '#ff5a1f'; ring = '#ffe600'; }
      else if (!idle && s <= 10) { inn = '#ffe600'; ring = '#ff5a1f'; }
      var txt = done ? 'TIME!' : s >= 60 ? Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2) : String(s);
      var fs = done ? size * 0.21 : txt.length >= 4 ? size * 0.27 : txt.length === 3 ? size * 0.3 : size * 0.42;
      var deg = done ? 0 : (l / total * 360).toFixed(1);
      el.style.background = 'conic-gradient(' + ring + ' ' + deg + 'deg, #0d0d0d 0)';
      el.classList.toggle('shake', shake && !WU.isCalm());
      inner.style.background = inn;
      dEl.style.color = ink; dEl.style.fontSize = fs + 'px';
      if (txt !== lastTxt) {
        dEl.textContent = txt; lastTxt = txt;
        if (done) WU.restartAnim(dEl, 'slam');
        else if (!idle && running && s <= 10) WU.restartAnim(dEl, 'thump');
      }
      lEl.style.color = ink;
      lEl.textContent = done ? '' : idle ? 'TAP TO START' : !running ? 'PAUSED' : s >= 60 ? 'LEFT' : 'SECONDS';
    }
    function step() {
      left = Math.max(0, end - Date.now());
      var s = Math.ceil(left / 1000);
      if (s !== lastSec) { lastSec = s; if (s > 0 && s <= 5) WU.sound.beep(s <= 3 ? 880 : 660); }
      if (left <= 0) {
        clearInterval(iv); running = false; done = true; render();
        WU.sound.buzzer(); if (opts.onDone) opts.onDone(); return;
      }
      render();
    }
    function start(from) {
      clearInterval(iv);
      var l = from == null ? total : from;
      end = Date.now() + l; lastSec = Math.ceil(l / 1000);
      running = true; done = false; left = l; WU.sound.unlock();
      iv = setInterval(step, 50); render();
    }
    var api = {
      el: el,
      start: function () { start(); },
      toggle: function () {
        if (running) { clearInterval(iv); running = false; render(); }
        else if (done || left == null) start(); else start(left);
      },
      isRunning: function () { return running; },
      destroy: function () { clearInterval(iv); }
    };
    el.addEventListener('click', api.toggle);
    render();
    return api;
  };

  /* ---------- Picker: names shuffle, then one slams onto the screen ----------
     WU.pickStudent({ title, sub, onPicked }) opens an overlay. Space / tap picks again. */
  WU.pickStudent = function (o) {
    o = o || {};
    var to = null, phase = 'idle', n = 0;
    function run(root) {
      if (phase === 'shuffling') return;
      var names = WU.roster(), pick = WU.nextStudent(), slab = root.querySelector('.pk-slab'), chip = root.querySelector('.chip-label');
      var delays = [], t = 0, d = 45; while (t < 1900) { delays.push(d); t += d; d *= 1.09; }
      if (WU.isCalm()) delays = delays.slice(-4);
      var i = 0, cur = '';
      phase = 'shuffling'; chip.textContent = o.title || "WHO'S NEXT?"; chip.style.background = '#ffe600';
      slab.style.background = '#ffe600'; slab.classList.remove('jolt');
      var next = function () {
        if (i >= delays.length) {
          phase = 'landed'; n++;
          chip.textContent = o.landed || "YOU'RE UP!"; chip.style.background = '#c6ff00';
          slab.style.background = '#ff4fc3';
          slab.innerHTML = (WU.isCalm() ? '' : '<div class="pk-burst"></div>') + '<div class="pk-name slam" style="font-size:' + fsz(pick) + 'px">' + WU.esc(pick) + '</div>';
          if (!WU.isCalm()) slab.classList.add('jolt');
          WU.sound.slam(); if (o.onPicked) o.onPicked(pick);
          return;
        }
        var r; do { r = WU.pick(names); } while (names.length > 1 && r === cur); cur = r;
        slab.innerHTML = '<div class="pk-name" style="font-size:' + Math.round(fsz(r) * 0.82) + 'px;opacity:.85">' + WU.esc(r) + '</div>';
        WU.sound.clack();
        to = setTimeout(next, delays[i++]);
      };
      next();
    }
    function fsz(name) { var L = name.length; return L <= 6 ? 210 : L <= 9 ? 170 : L <= 12 ? 130 : 104; }
    WU.openOverlay({
      cls: 'picker',
      render: function (el) {
        el.innerHTML = '<div class="panel picker-panel"><div class="chip-label">' + WU.esc(o.title || "WHO'S NEXT?") + '</div>' +
          '<div class="pk-slab"><div class="pk-name" style="font-size:80px">Tap to pick</div></div>' +
          '<div class="pk-sub">' + WU.esc(o.sub || 'SPACE = pick again, Esc = close') + '</div></div>';
        el.querySelector('.pk-slab').onclick = function () { run(el); };
        run(el);
      },
      onKey: function (e) {
        if (e.code === 'Space' || e.key === 'Enter') { e.preventDefault(); run(WU.overlay.el); return true; }
      },
      onClose: function () { clearTimeout(to); }
    });
  };

  /* ---------- Scoreboard: floating, draggable, 2-4 teams. Keys 1-4 add a point, Shift+1-4 remove one. ---------- */
  WU.Scoreboard = function (parent) {
    var teams = WU.state.teams;
    if (!teams) return null;
    var scores = WU.store.get('scores', [0, 0, 0, 0]);
    if (!Array.isArray(scores) || scores.length !== 4) scores = [0, 0, 0, 0];
    var pos = WU.store.get('sb-pos', null), compact = WU.store.get('sb-compact', true);
    var el = document.createElement('div'); el.className = 'sb' + (compact ? ' compact' : '');
    function color(i) { return WU.TEAM_COLORS[WU.state.teamColors[i]] || WU.TEAM_COLORS[i]; }
    function build() {
      var h = '<div class="sb-grip"><div class="v">SCORES</div><div><div class="b" data-sb="size">' + (compact ? '+' : '&ndash;') + '</div><div class="b" data-sb="zero">0</div></div></div>';
      for (var i = 0; i < teams; i++) {
        h += '<div class="sb-team" style="background:' + color(i) + '"><div class="sb-name">' + WU.esc(WU.state.teamNames[i] || 'TEAM ' + (i + 1)) + '</div>' +
          '<div class="sb-score" data-i="' + i + '">' + scores[i] + '</div>' +
          '<div class="sb-pm"><div data-sb="m" data-i="' + i + '" style="color:' + color(i) + '">&minus;</div><div data-sb="p" data-i="' + i + '" style="color:' + color(i) + '">+</div></div></div>';
      }
      el.innerHTML = h;
    }
    function place() {
      if (pos) { el.style.left = pos.x + 'px'; el.style.top = pos.y + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; }
    }
    function add(i, d) {
      if (i >= teams) return;
      scores[i] = Math.max(0, scores[i] + d); WU.store.set('scores', scores);
      var s = el.querySelector('.sb-score[data-i="' + i + '"]'); if (s) { s.textContent = scores[i]; WU.restartAnim(s, 'bump'); }
      WU.sound.beep(d > 0 ? 990 : 330);
    }
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-sb]');
      if (!t) {
        // Compact board: tapping a team adds a point.
        var tm = compact && e.target.closest('.sb-team');
        if (tm) add(+tm.querySelector('.sb-score').getAttribute('data-i'), 1);
        return;
      }
      var a = t.getAttribute('data-sb'), i = +t.getAttribute('data-i');
      if (a === 'p') add(i, 1); else if (a === 'm') add(i, -1);
      else if (a === 'zero') { scores = [0, 0, 0, 0]; WU.store.set('scores', scores); build(); }
      else if (a === 'size') { compact = !compact; WU.store.set('sb-compact', compact); el.classList.toggle('compact', compact); build(); }
    });
    el.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('.sb-grip') || e.target.closest('[data-sb]')) return;
      e.preventDefault();
      var r = el.getBoundingClientRect(), st = el.parentNode.getBoundingClientRect(), k = WU.scale || 1;
      var ox = (r.left - st.left) / k, oy = (r.top - st.top) / k, sx = e.clientX, sy = e.clientY;
      var mv = function (ev) {
        pos = { x: Math.max(0, Math.min(WU.W - 200, ox + (ev.clientX - sx) / k)), y: Math.max(0, Math.min(WU.H - 120, oy + (ev.clientY - sy) / k)) };
        place();
      };
      var up = function () { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (pos) WU.store.set('sb-pos', pos); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    });
    build(); place(); parent.appendChild(el);
    return {
      el: el,
      show: function (v) { el.style.display = v ? '' : 'none'; },
      visible: function () { return el.style.display !== 'none'; },
      // Handles 1-4 / Shift+1-4. Returns true if the key was used.
      onKey: function (e) {
        var m = /^Digit([1-4])$/.exec(e.code) || /^Numpad([1-4])$/.exec(e.code);
        if (!m) return false;
        var i = +m[1] - 1; if (i >= teams) return false;
        add(i, e.shiftKey ? -1 : 1); return true;
      },
      destroy: function () { if (el.parentNode) el.parentNode.removeChild(el); }
    };
  };
})();
