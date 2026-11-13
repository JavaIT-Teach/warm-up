/* Warm Up: home screen. Level pills, lesson toggle, optional class selector.
   First a skill picker (Vocabulary, Grammar, Speaking, Reading, Writing, New this week), then that skill's games as tiles with animated previews. */
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
    if (id === 'names') {
      var N = [['ANA', 'cat', 0], ['OMAR', 'pizza', 1.1], ['LENA', 'guitar', 2.2], ['KENJI', 'ball', 3.3]];
      return '<div style="display:flex;gap:16px;padding-left:8px">' + N.map(function (n) {
        return '<div style="position:relative;width:104px;height:112px;background:#fff;border:4px solid ' + K + ';box-shadow:5px 5px 0 ' + K + ';display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px">' +
          '<div style="width:62px;height:62px">' + WU.pic(n[1]) + '</div><div style="position:relative;width:100%;height:30px">' +
          '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:' + F + ';font-size:22px;color:' + K + ';animation:wu-flipc 4s ' + n[2] + 's infinite">' + n[0] + '</div></div></div>';
      }).join('') + '</div>';
    }
    // Moving games: little figures that stand up, walk to zones, line up, mingle, freeze.
    var man = function (c, anim) {
      return '<div style="width:44px;height:96px;display:flex;flex-direction:column;align-items:center;transform-origin:bottom center;animation:' + anim + '">' +
        '<div style="width:30px;height:30px;border-radius:50%;background:' + c + ';border:4px solid ' + K + '"></div><div style="width:40px;height:58px;margin-top:4px;background:' + c + ';border:4px solid ' + K + ';border-radius:14px 14px 4px 4px"></div></div>';
    };
    if (id === 'standup') return '<div style="display:flex;align-items:flex-end;gap:22px;height:130px;padding-left:10px">' +
      [0, 0.5, 1.1, 0.2, 1.6, 0.8].map(function (d, i) { return man(i % 2 ? '#fff' : K, 'wu-standup 2.4s ease-in-out ' + d + 's infinite'); }).join('') + '</div>';
    if (id === 'zones') return '<div style="display:grid;grid-template-columns:repeat(2,150px);grid-template-rows:repeat(2,58px);gap:8px">' +
      ['#ff3b3b', '#3d6bff', '#33c24d', '#ffe600'].map(function (c, i) {
        return '<div style="background:' + c + ';border:4px solid ' + K + ';display:flex;align-items:center;justify-content:center"><div style="width:26px;height:26px;border-radius:50%;background:#fff;border:4px solid ' + K + ';animation:wu-pulse 1.2s ' + (i * 0.3) + 's infinite"></div></div>';
      }).join('') + '</div>';
    if (id === 'opinion') return '<div style="position:relative;width:560px;height:110px"><div style="position:absolute;left:0;right:0;top:50px;height:10px;background:' + K + '"></div>' +
      '<div style="position:absolute;left:0;top:0;font-family:' + F + ';font-size:26px;color:' + K + '">AGREE</div><div style="position:absolute;right:0;top:0;font-family:' + F + ';font-size:26px;color:' + K + '">DISAGREE</div>' +
      [0, 0.7, 1.4].map(function (d) { return '<div style="position:absolute;top:36px;left:0;width:38px;height:38px;border-radius:50%;background:#fff;border:5px solid ' + K + ';animation:wu-slide 3s ease-in-out ' + d + 's infinite alternate"></div>'; }).join('') + '</div>';
    if (id === 'findwho') return '<div style="display:flex;align-items:center;gap:18px;padding-left:10px">' + man(K, 'wu-walk 1.6s ease-in-out infinite alternate') +
      '<div style="padding:6px 14px;background:#fff;border:4px solid ' + K + ';font-family:' + F + ';font-size:30px;color:' + K + '">CAN YOU SWIM?</div>' + man('#fff', 'wu-walk 1.6s ease-in-out .8s infinite alternate') +
      '<div style="font-family:' + F + ';font-size:44px;color:' + K + ';animation:wu-flicker .8s steps(1) infinite alternate">YES!</div></div>';
    if (id === 'chat') return '<div style="display:flex;align-items:center;gap:16px;padding-left:10px">' + man(K, 'wu-walk 1.2s ease-in-out infinite alternate') +
      '<div style="padding:6px 14px;background:#fff;border:4px solid ' + K + ';font-family:' + F + ';font-size:28px;color:' + K + '">LIKE FOOTBALL?</div>' + man('#fff', 'wu-walk 1.2s ease-in-out .6s infinite alternate') +
      '<div style="padding:0 12px;background:' + K + ';color:' + col + ';font-family:' + F + ';font-size:44px;animation:wu-pulse .9s ease-in-out infinite">x7</div></div>';
    // Grammar games
    var chip = function (t, bg, fg, anim) { return '<div style="padding:6px 16px;background:' + bg + ';color:' + fg + ';border:4px solid ' + K + ';font-family:' + F + ';font-size:40px;line-height:1.05' + (anim ? ';animation:' + anim : '') + '">' + t + '</div>'; };
    if (id === 'articles') return '<div style="display:flex;align-items:center;gap:16px;padding-left:10px">' + chip('A', '#fff', K, 'wu-flicker 1.2s steps(1) infinite alternate') +
      chip('AN', K, col, 'wu-pulse .9s ease-in-out infinite') + chip('THE', '#fff', K, 'wu-flicker 1.2s steps(1) .6s infinite alternate') +
      '<div style="font-family:' + F + ';font-size:44px;color:' + K + ';padding-left:10px">___ APPLE</div></div>';
    if (id === 'flash') return '<div style="display:grid;grid-template-columns:repeat(4,82px);grid-template-rows:repeat(2,62px);gap:8px">' +
      ['apple', 'cat', 'ball', 'car', 'book', 'duck', 'cup', 'key'].map(function (pc, i) {
        return '<div style="position:relative;background:#fff;border:4px solid ' + K + ';padding:4px">' + WU.pic(pc) + '<div style="position:absolute;inset:0;background:' + K + ';animation:wu-flipc 3.4s ' + (i * 0.25) + 's infinite"></div></div>';
      }).join('') + '</div>';
    if (id === 'nearfar') return '<div style="position:relative;width:520px;height:130px"><div style="position:absolute;left:150px;right:150px;bottom:0;height:120px;background:repeating-linear-gradient(0deg,#f2c26b 0 16px,#e5b257 16px 32px);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%)"></div>' +
      '<div style="position:absolute;left:60px;bottom:0;width:120px;height:120px;animation:wu-pulse 1.4s ease-in-out infinite">' + WU.pic('dog') + '</div>' +
      '<div style="position:absolute;left:300px;top:0;width:44px;height:44px">' + WU.pic('dog') + '</div>' +
      '<div style="position:absolute;right:0;top:20px;font-family:' + F + ';font-size:34px;color:' + K + ';line-height:1.1">THIS?<br>THAT?</div></div>';
    if (id === 'where') return '<div style="position:relative;width:520px;height:130px"><div style="position:absolute;left:120px;bottom:0;width:150px;height:96px;background:#d9a066;border:5px solid ' + K + ';z-index:2"></div>' +
      '<div style="position:absolute;left:150px;bottom:40px;width:90px;height:90px;z-index:1;animation:wu-peek 2.4s ease-in-out infinite">' + WU.pic('cat') + '</div>' +
      '<div style="position:absolute;left:310px;top:30px;font-family:' + F + ';font-size:40px;color:' + K + '">IN? ON?</div></div>';
    if (id === 'volcano') return '<div style="display:flex;align-items:flex-end;gap:30px;padding-left:10px"><div style="position:relative;width:200px;height:120px;background:' + K + ';clip-path:polygon(0 100%,38% 0,62% 0,100% 100%)">' +
      '<div style="position:absolute;left:0;right:0;bottom:0;height:60%;background:#ff3b3b;animation:wu-lava 1.8s ease-in-out infinite alternate"></div></div>' +
      '<div style="font-family:' + F + ';font-size:42px;line-height:1.05;color:' + K + '">GO &rarr; WENT<br>&rarr; <span style="animation:wu-flicker .6s steps(1) infinite alternate">GONE</span></div></div>';
    if (id === 'timemachine') {
      var R = [['SHE', 'THEY', 'I', 'WE'], ['PLAY', 'SWIM', 'READ', 'COOK'], ['NOW', 'SINCE 9', 'BY 2030', 'YESTERDAY']];
      return '<div style="display:flex;gap:12px;width:100%;padding-right:40px">' + R.map(function (w, i) {
        return '<div style="flex:1;height:90px;overflow:hidden;background:#fff;border:4px solid ' + K + '"><div style="animation:wu-reel ' + (1 + i * 0.4) + 's linear infinite">' +
          w.concat(w).map(function (x) { return '<div style="height:90px;display:flex;align-items:center;justify-content:center;font-family:' + F + ';font-size:28px;color:' + K + ';white-space:nowrap">' + x + '</div>'; }).join('') + '</div></div>';
      }).join('') + '<div style="width:70px;height:90px;display:flex;align-items:center;justify-content:center;background:' + K + ';color:' + col + ';font-family:' + F + ';font-size:56px">?</div></div>';
    }
    if (id === 'domino') return '<div style="display:flex;align-items:flex-end;gap:18px;height:120px;padding-left:10px">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) {
      return '<div style="width:34px;height:96px;background:' + K + ';border-radius:6px;box-shadow:inset 0 0 0 4px #fff;transform-origin:bottom right;animation:wu-domino 3s ' + (i * 0.12) + 's ease-in infinite"></div>';
    }).join('') + '<div style="font-family:' + F + ';font-size:40px;color:' + K + ';padding-left:10px">IF...</div></div>';
    if (id === 'pinit') return '<div style="display:flex;align-items:center;gap:16px;padding-left:10px">' + chip('AT', '#fff', K, 'wu-flicker 1.1s steps(1) infinite alternate') +
      chip('ON', K, col, 'wu-pulse .9s ease-in-out infinite') + chip('IN', '#fff', K, 'wu-flicker 1.1s steps(1) .55s infinite alternate') +
      '<div style="font-family:' + F + ';font-size:40px;color:' + K + ';padding-left:10px;line-height:1.05">___ MONDAY<br>___ THE BUS</div></div>';
    if (id === 'sticky') return '<div style="display:flex;align-items:center;gap:18px;padding-left:10px">' +
      '<div style="padding:6px 16px;background:#fff;border:4px solid ' + K + ';font-family:' + F + ';font-size:40px;color:' + K + '">INTERESTED ___</div>' +
      chip('1', '#c6ff00', K, 'wu-pulse .8s ease-in-out infinite') + chip('2', '#ff4fc3', K, 'wu-pulse .8s ease-in-out .4s infinite') + '</div>';
    if (id === 'phrasal') {
      var V = [['GIVE', 'LOOK', 'PUT', 'TAKE'], ['UP', 'AFTER', 'OFF', 'OVER']];
      return '<div style="display:flex;align-items:center;gap:12px;padding-right:40px">' + V.map(function (w, i) {
        return '<div style="width:170px;height:90px;overflow:hidden;background:#fff;border:4px solid ' + K + '"><div style="animation:wu-reel ' + (0.9 + i * 0.5) + 's linear infinite">' +
          w.concat(w).map(function (x) { return '<div style="height:90px;display:flex;align-items:center;justify-content:center;font-family:' + F + ';font-size:36px;color:' + K + '">' + x + '</div>'; }).join('') + '</div></div>' + (i ? '' : '<div style="font-family:' + F + ';font-size:50px;color:' + K + '">+</div>');
      }).join('') + '</div>';
    }
    return '';
  }

  function rots() { return [-1.2, 0.8, -0.6, 1, -0.9, 0.7, 0.6, -1, 0.9]; }

  // cat = the skill menu that is open (null = the skill picker). Kept while a game is open, so Esc from a game comes back here.
  var cat = null;
  function isNew(g) {
    if (!g.added) return false;
    var t = Date.parse(g.added); return !isNaN(t) && (Date.now() - t) < (WU.NEW_DAYS || 14) * 864e5;
  }
  function skillOf(id) { return (WU.SKILLS || []).filter(function (k) { return k.id === id; })[0]; }
  // The games in a skill menu: new ones first (newest first), then the rest in list order. 'new' = every new game.
  function catGames(c) {
    var all = WU.content.games, list = c === 'new' ? all.filter(isNew) : all.filter(function (g) { return (g.skills || []).indexOf(c) >= 0; });
    var fresh = list.filter(isNew).sort(function (x, y) { return Date.parse(y.added) - Date.parse(x.added); });
    return fresh.concat(list.filter(function (g) { return !isNew(g); }));
  }
  // The skill picker tiles: the five skills, then "New this week".
  function skillTiles() {
    return (WU.SKILLS || []).map(function (k) { return { id: k.id, name: k.name, hook: k.hook, color: k.color }; })
      .concat([{ id: 'new', name: 'New this week', hook: 'Every game added in the last ' + (WU.NEW_DAYS || 14) + ' days', color: '#ff5a1f' }]);
  }

  function topBar(cls, s) {
    return '<div class="home-top"><div class="logo"><span>WARM UP!</span></div><div style="flex:1"></div>' +
      '<div class="clchip" data-h="class" title="Change class (C)"><span class="t">CLASS</span><span class="n">' +
      WU.esc(cls ? cls.name : WU.state.students + ' students') + '</span></div>' +
      '<div class="seg">' + [['first', 'First lesson'], ['regular', 'Regular lesson']].map(function (l) {
        return '<div class="' + (s.lesson === l[0] ? 'on' : '') + '" data-lesson="' + l[0] + '">' + l[1] + '</div>';
      }).join('') + '</div>' +
      '<div style="display:flex;gap:12px"><div class="ibtn" data-act="teacher" title="Teacher screen for your laptop (V)">' + WU.icons.teacher + '</div>' +
      '<div class="ibtn" data-act="edit" title="Edit mode (E)">' + WU.icons.pencil + '</div>' +
      '<div class="ibtn" data-h="settings" title="Settings (S)">' + WU.icons.settings + '</div>' +
      '<div class="ibtn" data-act="mute" title="Mute (M)">' + WU.icons.sound() + '</div>' +
      '<div class="ibtn" data-act="full" title="Fullscreen (F)">' + WU.icons.full + '</div>' +
      '<div class="ibtn" data-act="help" title="Keyboard (?)">' + WU.icons.help + '</div></div></div>' +
      '<div class="levels">' + WU.LEVELS.map(function (l, i) {
        return '<div class="pill' + (i === s.level ? ' on' : '') + '" data-level="' + i + '"><b>' + l.name + '</b><i>' + l.code + '</i></div>';
      }).join('') + '</div>';
  }

  function render() {
    var s = WU.state, first = s.lesson === 'first', cls = WU.activeClass();
    if (cat && cat !== 'new' && !skillOf(cat)) cat = null;
    if (cat === 'new' && !catGames('new').length) cat = null;
    var games = cat ? catGames(cat) : [];
    // The home screen is the teacher's menu: controls, not learning content.
    var html = '<div class="home" data-ctrl>' + topBar(cls, s);
    if (!cat) {
      html += '<div class="skillgrid">' + skillTiles().map(function (k, i) {
        var list = catGames(k.id), ok = list.filter(function (g) { return WU.gameOk(g.id); }).length, fresh = list.filter(isNew).length;
        return '<div class="tile skill' + (list.length ? '' : ' empty') + '" tabindex="0" data-skill="' + k.id + '" style="background:' + k.color + ';transform:rotate(' + rots()[i] + 'deg)">' +
          (fresh && k.id !== 'new' ? '<div class="fit newb">' + fresh + ' NEW</div>' : '') +
          '<div class="num" style="color:' + k.color + '">' + (i + 1) + '</div>' +
          '<div class="sname">' + WU.esc(k.name) + '</div>' +
          '<div class="hook">' + WU.esc(k.hook) + '</div>' +
          '<div class="scount">' + (list.length ? ok + ' game' + (ok === 1 ? '' : 's') + ' at this level' + (ok < list.length ? ' · ' + (list.length - ok) + ' for other levels' : '') : 'New games arrive every Saturday') + '</div>' +
          '</div>';
      }).join('') + '</div></div>';
    } else {
      var sk = cat === 'new' ? skillTiles()[skillTiles().length - 1] : skillOf(cat);
      html += '<div class="cathead"><div class="ibtn back" data-h="back" title="All skills (Esc)"><svg width="36" height="36" viewBox="0 0 36 36"><path d="M22 6L10 18L22 30" fill="none" stroke="currentColor" stroke-width="5"></path></svg></div>' +
        '<b style="background:' + sk.color + '">' + WU.esc(sk.name) + '</b><span>' + games.length + ' game' + (games.length === 1 ? '' : 's') + ' · Esc = all skills</span></div>' +
        (games.length ? '<div class="grid">' + games.slice(0, 9).map(function (g, i) { return tile(g, i); }).join('') + '</div>' :
          '<div class="catempty">No ' + WU.esc(sk.name.toLowerCase()) + ' games yet. New games arrive every Saturday.</div>') + '</div>';
    }
    function tile(g, i) {
      var dim = first && !g.first, off = !WU.gameOk(g.id), nw = isNew(g);
      var sticker = nw ? 'NEW' + (g.unit ? ' · ' + g.unit : '') : (first && g.first) || g.sticker ? (g.sticker || 'ICEBREAKER') : '';
      return '<div class="tile' + (dim ? ' dim' : '') + (off ? ' off' : '') + '" tabindex="0" data-game="' + g.id + '" style="background:' + g.color + ';transform:rotate(' + (rots()[i] != null ? rots()[i] : 0.8) + 'deg)">' +
        (off ? '<div class="lvlock">' + WU.esc(WU.gameLevelText(g.id)) + '</div>' : '') +
        (sticker ? '<div class="fit' + (nw ? ' newb' : '') + '">' + WU.esc(sticker) + '</div>' : '') +
        '<div class="num" style="color:' + g.color + '">' + (i + 1) + '</div>' +
        '<div class="pv"><div class="pv-in">' + (preview(g.id, g.color) || wordPreview(g)) + '</div></div>' +
        '<div class="name">' + WU.esc(g.name) + '</div>' +
        '<div class="hook">' + WU.esc(g.hook) + '</div>' +
        (g.trains ? '<div class="trains"><b>TRAINS</b><span>' + WU.esc(g.trains) + '</span></div>' : '') +
        '</div>';
    }
    root.innerHTML = html;
    // Game 10 and later: one more row below the nine, built only when the teacher goes down to it.
    moreRow = function () {
      var home = root.querySelector('.home'), g2 = root.querySelector('.grid2');
      if (g2 || games.length <= 9) return g2;
      home.insertAdjacentHTML('beforeend', '<div class="grid2">' + games.slice(9).map(function (g, j) { return tile(g, j + 9); }).join('') + '</div>');
      g2 = root.querySelector('.grid2');
      var t1 = root.querySelector('.grid .tile'); if (t1) g2.querySelectorAll('.tile').forEach(function (x) { x.style.height = t1.offsetHeight + 'px'; });
      wireTiles(g2); return g2;
    };
    // Jump buttons in the side margins (outside .home, so they stay put while the menu slides).
    if (games.length > 9) {
      var arr = function (d, two) {
        var a = d < 0 ? 'M6 22L18 10L30 22' : 'M6 12L18 24L30 12', o = two ? (d < 0 ? 8 : -8) : 0;
        return '<svg width="36" height="36" viewBox="0 0 36 36"><path d="' + a + '" fill="none" stroke="currentColor" stroke-width="5" transform="translate(0 ' + (two ? -o / 2 : 0) + ')"></path>' +
          (two ? '<path d="' + a + '" fill="none" stroke="currentColor" stroke-width="5" transform="translate(0 ' + (o / 2) + ')"></path>' : '') + '</svg>';
      };
      var jumps = '<div class="hjump at-top" data-ctrl>' +
        '<div class="ibtn" data-j="top" title="Top of the menu (Home)">' + arr(-1, true) + '</div>' +
        '<div class="ibtn" data-j="up" title="Up one row (Up)">' + arr(-1) + '</div>' +
        '<div class="ibtn" data-j="down" title="Down one row (Down)">' + arr(1) + '</div>' +
        '<div class="ibtn" data-j="end" title="Bottom of the menu (End)">' + arr(1, true) + '</div></div>';
      root.insertAdjacentHTML('beforeend', jumps.replace('hjump', 'hjump left') + jumps.replace('hjump', 'hjump right'));
      root.querySelectorAll('[data-j]').forEach(function (b) {
        b.onclick = function () { var j = b.getAttribute('data-j'); slideTo(j === 'top' ? 0 : j === 'end' ? 1e5 : slid + (j === 'up' ? -1 : 1) * rowStep()); };
      });
    }
    wireSlide();
    WU.wireCommon(root);
    root.querySelectorAll('[data-level]').forEach(function (b) { b.onclick = function () { setLevel(+b.getAttribute('data-level')); }; });
    root.querySelectorAll('[data-lesson]').forEach(function (b) { b.onclick = function () { WU.setState({ lesson: b.getAttribute('data-lesson') }); render(); }; });
    root.querySelector('[data-h="settings"]').onclick = function () { WU.openSettings(); };
    root.querySelector('[data-h="class"]').onclick = cycleClass;
    var bk = root.querySelector('[data-h="back"]'); if (bk) bk.onclick = function () { openCat(null); };
    root.querySelectorAll('[data-skill]').forEach(function (t) {
      t.onclick = function () { openCat(t.getAttribute('data-skill')); };
      t.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCat(t.getAttribute('data-skill')); } };
    });
    wireTiles(root);
  }
  function openCat(c) {
    if (c === 'new' && !catGames('new').length) { WU.toast('No new games in the last ' + (WU.NEW_DAYS || 14) + ' days. New games arrive every Saturday.'); return; }
    cat = c; render();
    var t = root && root.querySelector(c ? '.grid .tile' : '.skillgrid .tile'); if (t && document.activeElement && document.activeElement.closest && document.activeElement.closest('.tile')) t.focus();
  }
  // Card preview for games without a drawn one: their preview words (or name) as sliding chips.
  function wordPreview(g) {
    var K = '#0d0d0d', ws = (g.preview && g.preview.length ? g.preview : String(g.name).split(' ')).slice(0, 6);
    return '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding-right:30px">' + ws.map(function (w, i) {
      return '<div style="padding:6px 16px;background:' + (i % 2 ? '#fff' : K) + ';color:' + (i % 2 ? K : g.color) + ';border:4px solid ' + K + ';font-family:var(--display);font-size:38px;line-height:1.05;animation:wu-pulse 2.4s ease-in-out ' + (i * 0.3) + 's infinite">' + WU.esc(w) + '</div>';
    }).join('') + '</div>';
  }
  function wireTiles(el) {
    el.querySelectorAll('[data-game]').forEach(function (t) {
      t.onclick = function () { open(t.getAttribute('data-game')); };
      t.onkeydown = function (e) {
        if (e.key === 'Enter') { e.preventDefault(); open(t.getAttribute('data-game')); }
        // Tab past the last of the nine: bring up the row below and go on into it.
        else if (e.key === 'Tab' && !e.shiftKey && cat && catGames(cat).length > 9 && t.getAttribute('data-game') === catGames(cat)[8].id) {
          e.preventDefault(); moreRow(); var n = root.querySelector('.grid2 .tile'); if (n) n.focus();
        }
      };
    });
  }

  // Show the row below the nine by sliding the whole home screen up (not a scroll box: the nine cards render exactly as before).
  var slid = 0, moreRow = function () { return null; };
  function slideTo(y) {
    var home = root && root.querySelector('.home'); if (!home) return;
    var g2 = y > 0 ? moreRow() : root.querySelector('.grid2'); if (!g2) { root.querySelectorAll('.hjump').forEach(function (j0) { j0.classList.add('at-top'); }); return; }
    var max = Math.max(0, g2.offsetTop + g2.offsetHeight - home.offsetHeight);
    slid = Math.max(0, Math.min(max, y));
    home.classList.add('moved'); home.style.transform = slid ? 'translateY(' + (-slid) + 'px)' : '';
    root.querySelectorAll('.hjump').forEach(function (jb) { jb.classList.toggle('at-top', slid <= 0); jb.classList.toggle('at-end', slid >= max); });
  }
  // One row of cards (card + gap), in stage pixels.
  function rowStep() { var t = root && root.querySelector('.grid .tile'); return t ? t.offsetHeight + 30 : 300; }
  function wireSlide() {
    var home = root.querySelector('.home'), y0 = null, s0 = 0;
    slid = 0;
    home.addEventListener('wheel', function (e) { e.preventDefault(); slideTo(slid + e.deltaY / (WU.scale || 1)); }, { passive: false });
    home.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; s0 = slid; }, { passive: true });
    home.addEventListener('touchmove', function (e) { if (y0 != null) slideTo(s0 - (e.touches[0].clientY - y0) / (WU.scale || 1)); }, { passive: true });
    home.addEventListener('touchend', function () { y0 = null; });
    // Tab into the new row: slide down; Tab back up: slide back.
    home.addEventListener('focusin', function (e) {
      var t = e.target.closest && e.target.closest('.tile'); if (!t) return;
      if (!t.closest('.grid2')) { if (slid) slideTo(0); return; }
      // Bring the focused card fully into view (the stage is 1080 high).
      var top = t.offsetTop + t.parentNode.offsetTop, bottom = top + t.offsetHeight + 40;
      if (bottom - slid > WU.H) slideTo(bottom - WU.H); else if (top - slid < 0) slideTo(top - 20);
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
    if (!WU.views[id]) return;
    if (!WU.gameOk(id)) { WU.sound.buzzer(); WU.toast(g.name + ': ' + WU.gameLevelText(id) + '. Change the level (Left / Right).'); return; }
    WU.sound.unlock(); WU.go(id);
  }

  WU.views.home = {
    title: 'Home',
    help: function () {
      if (!cat) return [['1 - 6', 'open a skill menu (6 = new this week)'], ['G', 'open the Grammar menu'], ['Left / Right', 'change level'], ['L', 'first / regular lesson'], ['C', 'change class'], ['S', 'settings (Export / Import)'], ['V', 'teacher screen (laptop)'], ['Tab + Enter', 'choose a tile']];
      return [['1 - 9, 0', 'open a game (0 = game 10, below the nine)'], ['Shift + 1 - 9', 'open game 11, 12...'], ['Esc / Backspace', 'back to all skills'], ['Left / Right', 'change level'], ['L', 'first / regular lesson'], ['C', 'change class'], ['S', 'settings (Export / Import)'], ['V', 'teacher screen (laptop)'], ['Tab + Enter', 'choose a tile'], ['Down / Up', 'show the games below / back'], ['Home / End', 'jump to the top / bottom of the menu']];
    },
    mount: function (el) {
      root = el; render();
      offChange = WU.on('change', function (p) { if (p && ('classes' in p || 'students' in p || 'classId' in p)) render(); });
    },
    unmount: function () { if (offChange) offChange(); root = null; },
    onKey: function (e) {
      var k = e.key;
      if (!cat) {
        // Skill picker: 1-6 open a skill menu, G = Grammar.
        if (/^[1-9]$/.test(k)) { var sk = skillTiles()[+k - 1]; if (sk) openCat(sk.id); return true; }
        if (k === 'g' || k === 'G') { openCat('grammar'); return true; }
      } else {
        var list = catGames(cat);
        if (k === 'Escape' || k === 'Backspace') { openCat(null); return true; }
        if (/^[1-9]$/.test(k)) { var g = list[+k - 1]; if (g) open(g.id); return true; }
        if (k === '0') { var g10 = list[9]; if (g10) open(g10.id); return true; }
        // Shift + 1-9: games 11-19 (below the nine).
        if (e.shiftKey && /^Digit[1-9]$/.test(e.code || '')) { var gs = list[9 + +e.code.slice(5)]; if (gs) open(gs.id); return true; }
      }
      if (k === 'ArrowDown' || k === 'PageDown') { slideTo(slid + rowStep()); return true; }
      if (k === 'ArrowUp' || k === 'PageUp') { slideTo(slid - rowStep()); return true; }
      if (k === 'Home') { slideTo(0); return true; }
      if (k === 'End') { slideTo(1e5); return true; }
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
