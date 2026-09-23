/* Warm Up: home screen. Level pills, lesson toggle, optional class selector, nine game tiles with animated previews. */
(function () {
  'use strict';
  var WU = window.WU, root = null, offChange = null;

  // Animated tile previews (Riot Pop style from the design: black ink, white highlight, tile colour as text).
  function preview(id, col) {
    var K = '#0d0d0d', F = "var(--display)";
    if (id === 'bomb') return '<div style="display:flex;align-items:center;gap:48px;padding-left:20px">' +
      '<div style="position:relative;width:112px;height:112px;animation:wu-pulse .9s ease-in-out infinite">' +
      '<div style="position:absolute;left:0;top:0;right:0;bottom:0;border-radius:50%;background:' + K + '"></div>' +
      '<div style="position:absolute;left:22px;top:20px;width:26px;height:14px;border-radius:50%;background:#fff;opacity:.45;transform:rotate(-30deg)"></div>' +
      '<div style="position:absolute;left:72px;top:-4px;width:26px;height:22px;background:' + K + ';transform:rotate(38deg)"></div>' +
      '<div style="position:absolute;left:94px;top:-24px;width:6px;height:30px;background:#fff;border-radius:3px;transform:rotate(45deg)"></div>' +
      '<div style="position:absolute;left:104px;top:-38px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 18px 6px #fff;animation:wu-spark .16s steps(2) infinite alternate"></div></div>' +
      '<div style="font-family:' + F + ';font-size:64px;line-height:1;color:' + K + ';animation:wu-flicker .55s steps(1) infinite alternate">0:??</div></div>';
    if (id === 'slot') {
      var W = [['PIZZA', 'GHOST', 'MONDAY', 'SOCKS', 'BOSS'], ['WHISPER', 'ROBOT', 'ANGRY', 'SLOWLY', 'OPERA'], ['ANA', 'OMAR', 'LENA', 'KENJI', 'SOFIA']];
      return '<div style="display:flex;gap:12px;width:100%;padding-right:40px">' + W.map(function (w, i) {
        return '<div style="flex:1;height:96px;overflow:hidden;background:' + K + ';border:3px solid ' + K + '"><div style="animation:wu-reel ' + (0.8 + i * 0.37) + 's linear infinite">' +
          w.concat(w).map(function (x) { return '<div style="height:96px;display:flex;align-items:center;justify-content:center;font-family:' + F + ';font-size:26px;color:' + col + ';white-space:nowrap">' + x + '</div>'; }).join('') + '</div></div>';
      }).join('') + '</div>';
    }
    if (id === 'tiles') {
      var D = [0, 1.3, 2.6, .6, 3.1, 1.9, 2.2, .3, 3.5, 1.1, 2.9, .9];
      return '<div style="display:grid;grid-template-columns:repeat(6,62px);grid-template-rows:repeat(2,62px);gap:10px">' + D.map(function (d) {
        return '<div style="position:relative;background:' + K + ';animation:wu-flip 4s ' + d + 's infinite"><div style="position:absolute;left:0;top:0;right:0;bottom:0;background:#fff;display:flex;align-items:center;justify-content:center;font-family:' + F + ';font-size:30px;color:' + K + ';animation:wu-flipc 4s ' + d + 's infinite">?</div></div>';
      }).join('') + '</div>';
    }
    if (id === 'hotseat') {
      var words = ['CAT', 'HAPPY', 'PIZZA'];
      return '<div style="display:flex;align-items:center;gap:40px;padding-left:10px">' +
        '<div style="position:relative;width:110px;height:130px"><div style="position:absolute;left:10px;top:0;width:90px;height:80px;background:' + K + '"></div>' +
        '<div style="position:absolute;left:0;top:80px;width:110px;height:16px;background:' + K + '"></div><div style="position:absolute;left:10px;top:96px;width:12px;height:34px;background:' + K + '"></div><div style="position:absolute;left:88px;top:96px;width:12px;height:34px;background:' + K + '"></div></div>' +
        '<div style="position:relative;width:300px;height:100px">' + words.map(function (w, i) {
          return '<div style="position:absolute;left:0;top:0;width:300px;height:100px;background:#fff;border:4px solid ' + K + ';display:flex;align-items:center;justify-content:center;font-family:' + F + ';font-size:52px;opacity:0;animation:wu-flashword 2.7s ' + (i * 0.9) + 's steps(1) infinite">' + w + '</div>';
        }).join('') + '</div></div>';
    }
    if (id === 'lie') {
      var pts = '0,50 30,50 40,20 50,80 60,35 70,60 80,50 120,50 128,40 136,58 150,50 190,50 200,10 210,90 220,30 230,70 240,50 270,50';
      var path = pts + ' ' + pts.split(' ').map(function (p) { var q = p.split(','); return (+q[0] + 270) + ',' + q[1]; }).join(' ');
      return '<div style="display:flex;align-items:center;gap:28px"><div style="width:360px;height:110px;overflow:hidden;background:' + K + ';border:4px solid ' + K + '">' +
        '<svg width="540" height="100" viewBox="0 0 540 100" style="animation:wu-scroll 1.6s linear infinite"><polyline points="' + path + '" fill="none" stroke="' + col + '" stroke-width="6" stroke-linejoin="round"></polyline></svg></div>' +
        '<div style="font-family:' + F + ';font-size:52px;color:' + K + ';animation:wu-flicker .5s steps(1) infinite alternate">LIE?</div></div>';
    }
    if (id === 'swap') {
      var dot = function (c) { return '<div style="width:44px;height:44px;border-radius:50%;background:' + c + ';border:4px solid ' + K + '"></div>'; };
      return '<div style="display:flex;align-items:center;gap:40px;padding-left:10px"><div style="display:flex;flex-direction:column;gap:18px">' +
        '<div style="display:flex;gap:28px;animation:wu-swap 1.8s ease-in-out infinite alternate">' + dot(K) + dot('#fff') + dot(K) + dot('#fff') + '</div>' +
        '<div style="display:flex;gap:28px">' + dot('#fff') + dot(K) + dot('#fff') + dot(K) + '</div></div>' +
        '<div style="font-family:' + F + ';font-size:60px;padding:0 14px;background:' + K + ';color:' + col + ';transform:rotate(-4deg);animation:wu-pulse .9s ease-in-out infinite">SWAP!</div></div>';
    }
    if (id === 'tug') {
      return '<div style="position:relative;width:640px;height:120px"><div style="position:absolute;left:0;top:30px;width:90px;height:60px;background:' + K + '"></div>' +
        '<div style="position:absolute;right:0;top:30px;width:90px;height:60px;background:#fff;border:4px solid ' + K + '"></div>' +
        '<div style="position:absolute;left:318px;top:10px;width:6px;height:100px;background:' + K + '"></div>' +
        '<div style="position:absolute;left:90px;right:90px;top:52px;height:16px;animation:wu-tug 2.2s ease-in-out infinite"><div style="position:absolute;left:-40px;right:-40px;top:0;height:16px;background:repeating-linear-gradient(90deg,' + K + ' 0 18px,#fff 18px 26px);border:3px solid ' + K + '"></div>' +
        '<div style="position:absolute;left:216px;top:-22px;width:30px;height:60px;background:#fff;border:4px solid ' + K + '"></div></div></div>';
    }
    if (id === 'dice') {
      return '<div style="display:flex;gap:26px;padding-left:10px">' + ['cat', 'rocket', 'pizza'].map(function (p, i) {
        return '<div style="width:112px;height:112px;background:#fff;border:5px solid ' + K + ';box-shadow:6px 6px 0 ' + K + ';padding:10px;animation:wu-roll 2.4s ' + (i * 0.2) + 's cubic-bezier(.2,.8,.3,1) infinite">' + WU.pic(p) + '</div>';
      }).join('') + '</div>';
    }
    if (id === 'chain') {
      var ws = ['CAT', 'TIGER', 'RED', 'DOG'];
      return '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding-right:30px">' + ws.map(function (w, i) {
        return '<div style="padding:8px 16px;background:' + K + ';color:#fff;font-family:' + F + ';font-size:40px;line-height:1.1;animation:wu-appear 5s ' + (i * 0.6) + 's infinite both">' +
          WU.esc(w.slice(0, -1)) + '<span style="color:' + col + '">' + w.slice(-1) + '</span></div>';
      }).join('') + '</div>';
    }
    return '';
  }

  function rots() { return [-1.2, 0.8, -0.6, 1, -0.9, 0.7, 0.6, -1, 0.9]; }

  function render() {
    var s = WU.state, games = WU.content.games, first = s.lesson === 'first', cls = WU.activeClass();
    // The home screen is the teacher's menu: controls, not learning content.
    var html = '<div class="home" data-ctrl>' +
      '<div class="home-top"><div class="logo"><span>WARM UP!</span></div><div style="flex:1"></div>' +
      '<div class="clchip" data-h="class" title="Change class (C)"><span class="t">CLASS</span><span class="n">' +
      WU.esc(cls ? cls.name : WU.state.students + ' students') + '</span></div>' +
      '<div class="seg">' + [['first', 'First lesson'], ['regular', 'Regular lesson']].map(function (l) {
        return '<div class="' + (s.lesson === l[0] ? 'on' : '') + '" data-lesson="' + l[0] + '">' + l[1] + '</div>';
      }).join('') + '</div>' +
      '<div style="display:flex;gap:12px"><div class="ibtn" data-act="edit" title="Edit mode (E)">' + WU.icons.pencil + '</div>' +
      '<div class="ibtn" data-h="settings" title="Settings (S)">' + WU.icons.settings + '</div>' +
      '<div class="ibtn" data-act="mute" title="Mute (M)">' + WU.icons.sound() + '</div>' +
      '<div class="ibtn" data-act="full" title="Fullscreen (F)">' + WU.icons.full + '</div>' +
      '<div class="ibtn" data-act="help" title="Keyboard (?)">' + WU.icons.help + '</div></div></div>' +
      '<div class="levels">' + WU.LEVELS.map(function (l, i) {
        return '<div class="pill' + (i === s.level ? ' on' : '') + '" data-level="' + i + '"><b>' + l.name + '</b><i>' + l.code + '</i></div>';
      }).join('') + '</div>' +
      '<div class="grid">' + games.map(function (g, i) {
        var dim = first && !g.first;
        return '<div class="tile' + (dim ? ' dim' : '') + '" tabindex="0" data-game="' + g.id + '" style="background:' + g.color + ';transform:rotate(' + rots()[i] + 'deg)">' +
          (first && g.first ? '<div class="fit">ICEBREAKER</div>' : '') +
          '<div class="num" style="color:' + g.color + '">' + (i + 1) + '</div>' +
          '<div class="pv"><div class="pv-in">' + preview(g.id, g.color) + '</div></div>' +
          '<div class="name">' + WU.esc(g.name) + '</div>' +
          (g.ready ? '<div class="hook">' + WU.esc(g.hook) + '</div>' : '<div class="soon" style="color:' + g.color + '">COMING SOON</div>') +
          '</div>';
      }).join('') + '</div></div>';
    root.innerHTML = html;
    WU.wireCommon(root);
    root.querySelectorAll('[data-level]').forEach(function (b) { b.onclick = function () { setLevel(+b.getAttribute('data-level')); }; });
    root.querySelectorAll('[data-lesson]').forEach(function (b) { b.onclick = function () { WU.setState({ lesson: b.getAttribute('data-lesson') }); render(); }; });
    root.querySelector('[data-h="settings"]').onclick = function () { WU.openSettings(); };
    root.querySelector('[data-h="class"]').onclick = cycleClass;
    root.querySelectorAll('[data-game]').forEach(function (t) {
      t.onclick = function () { open(t.getAttribute('data-game')); };
      t.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); open(t.getAttribute('data-game')); } };
    });
  }

  function setLevel(i) {
    if (i < 0 || i >= WU.LEVELS.length) return;
    WU.setState({ level: i }); render();
  }
  function cycleClass() {
    var ids = [''].concat(WU.state.classes.map(function (c) { return c.id; }));
    if (ids.length === 1) { WU.openSettings('classes'); return; }
    var k = ids.indexOf(WU.state.classId);
    WU.setState({ classId: ids[(k + 1) % ids.length] }); render();
    var c = WU.activeClass(); WU.toast('Class: ' + (c ? c.name : 'no class (' + WU.state.students + ' students)'));
  }
  function open(id) {
    var g = WU.content.games.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    if (!g.ready || !WU.views[id]) { WU.sound.buzzer(); WU.toast(g.name + ' is coming soon.'); return; }
    WU.sound.unlock(); WU.go(id);
  }

  WU.views.home = {
    title: 'Home',
    help: function () {
      return [['1 - 9', 'open a game'], ['Left / Right', 'change level'], ['L', 'first / regular lesson'], ['C', 'change class'], ['S', 'settings (Export / Import)'], ['Tab + Enter', 'choose a tile']];
    },
    mount: function (el) {
      root = el; render();
      offChange = WU.on('change', function (p) { if (p && ('classes' in p || 'students' in p || 'classId' in p)) render(); });
    },
    unmount: function () { if (offChange) offChange(); root = null; },
    onKey: function (e) {
      var k = e.key;
      if (/^[1-9]$/.test(k)) { var g = WU.content.games[+k - 1]; if (g) open(g.id); return true; }
      if (k === 'ArrowRight') { setLevel(WU.state.level + 1); return true; }
      if (k === 'ArrowLeft') { setLevel(WU.state.level - 1); return true; }
      if (k === 'l' || k === 'L') { WU.setState({ lesson: WU.state.lesson === 'first' ? 'regular' : 'first' }); render(); return true; }
      if (k === 'c' || k === 'C') { cycleClass(); return true; }
      if (k === 's' || k === 'S') { WU.openSettings(); return true; }
      if ((k === 'Enter' || k === ' ') && document.activeElement && document.activeElement.getAttribute('data-game')) {
        e.preventDefault(); open(document.activeElement.getAttribute('data-game')); return true;
      }
    }
  };
})();
