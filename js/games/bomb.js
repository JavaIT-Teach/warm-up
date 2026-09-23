/* Warm Up: THE BOMB.
   Ready -> Ticking (hidden random fuse 15-60 s, uneven ticking) -> Explosion -> Challenge wheel -> Ready with a new category.
   Keys: Space start / spin / next, N new category, R reset, X explode now, T challenge timer, P who starts, S scores.
   Content comes from content/bomb.js through the shared edit layer (js/edit.js), so teacher edits apply here. */
(function () {
  'use strict';
  var WU = window.WU;
  var SEGC = ['#c6ff00', '#ff4fc3', '#ffe600', '#3d6bff', '#ff5a1f', '#00e5c7', '#ffe600', '#ff4fc3'];

  var root, box, layer, st, timers = {}, sb = null, clock = null, raf = 0, offContent = null;

  /* ---------- editable lists (Edit mode, E) ---------- */
  function normCat(r) {
    if (typeof r === 'string') return { text: r, pic: '' };
    return { text: r.name, pic: r.icon || '', frame: r.frame || '', tag: r.tag || '', examples: r.examples || null };
  }
  function catFields(level) {
    var f = [{ k: 'text', label: 'Category', type: 'text', max: 60 }, { k: 'pic', label: 'Picture', type: 'pic' }];
    if (level === 0) f.push(
      { k: 'frame', label: 'Sentence frame', type: 'text', max: 60, hint: 'Use ___ for the gap. "It\'s ___." adds a / an for you. "I like ___." uses the plural.' },
      { k: 'examples', label: 'Example pictures', type: 'pics', max: 4, empty: 'Automatic (random pictures from this category)' });
    return f;
  }
  function blankCat(level) { return level === 0 ? { text: 'New category', pic: '', frame: "It's ___.", examples: null } : { text: 'New category', pic: '' }; }
  WU.registerList('bomb', 'cats', { gameTitle: 'The Bomb', label: 'Categories', defaults: function (l) { return WU.content.bomb[l].cats; }, norm: normCat, fields: catFields, blank: blankCat });
  WU.registerList('bomb', 'first', { gameTitle: 'The Bomb', label: 'First-lesson categories', defaults: function (l) { return WU.content.bomb[l].first; }, norm: normCat, fields: catFields, blank: blankCat });
  WU.registerList('bomb', 'challenges', {
    gameTitle: 'The Bomb', label: 'Challenges',
    defaults: function (l) { return WU.content.bomb[l].challenges; },
    norm: function (c) { return { short: c.short || '', text: c.text || '', sub: c.sub || '', frame: c.frame || '', pic: c.pic || '', timer: c.timer || 0 }; },
    title: function (it) { return (it.short ? it.short + ': ' : '') + it.text; },
    fields: function (level) {
      return [
        { k: 'short', label: 'Label on the wheel (10 letters max)', type: 'text', max: 10 },
        { k: 'text', label: 'Challenge (must be spoken, from the seat, 30 seconds max)', type: 'text', max: 60 },
        level === 0 ? { k: 'frame', label: 'Sentence frame', type: 'text', max: 60, hint: 'Use ___ for the gap.' }
          : { k: 'sub', label: 'Small line under it', type: 'text', max: 60, hint: 'Write "Topic: " to show the current category.' },
        { k: 'pic', label: 'Picture', type: 'pic' },
        { k: 'timer', label: 'Timer seconds (optional, 30 max)', type: 'num', max: 30 }
      ];
    },
    blank: function (level) { return { short: 'NEW', text: 'Say one thing about...', sub: '', frame: level === 0 ? 'I like ___.' : '', pic: '', timer: 0 }; }
  });

  function clearAll() {
    clearTimeout(timers.tick); clearInterval(timers.prog); clearTimeout(timers.boom); clearTimeout(timers.spin);
    cancelAnimationFrame(raf);
    if (clock) { clock.destroy(); clock = null; }
  }
  function bank() { return WU.content.bomb[WU.state.level] || WU.content.bomb[0]; }
  function beginner() { return WU.state.level === 0; }

  /* ---------- category ---------- */
  function newCat() {
    var lv = WU.state.level, ln = 'cats';
    if (WU.state.lesson === 'first' && WU.list('bomb', 'first', lv).length && Math.random() < 0.5) ln = 'first';
    var list = WU.list('bomb', ln, lv);
    if (!list.length) { ln = 'cats'; list = WU.list('bomb', 'cats', lv); }
    if (!list.length) list = [{ id: 'none', text: 'Press E to add categories' }];
    var prev = st.cat ? st.cat.list + st.cat.id : '', c, tries = 0;
    do { c = WU.pick(list); tries++; } while (tries < 20 && list.length > 1 && ln + c.id === prev);
    st.cat = buildCat(c, ln); st.catN++;
  }
  function buildCat(c, ln) {
    var cat = { id: c.id, list: ln, name: c.text || '', pic: c.pic || '', frame: c.frame || '', examples: [] };
    if (beginner()) {
      if (!cat.frame) cat.frame = "It's ___.";
      var ids = c.examples && c.examples.length ? c.examples.slice(0, 4)
        : c.tag ? WU.shuffle(WU.picsByTag(c.tag).map(function (p) { return p.id; }).filter(function (id) { return id !== c.pic; })).slice(0, 4) : [];
      var form = WU.frameForm(cat.frame);
      cat.examples = ids.filter(function (id) { return WU.PICS[id]; }).map(function (id) { return { id: id, label: WU.picPhrase(id, form) }; });
      // Drop an example if the labels would not fit the 980px column at 40px.
      var w = function (ex) { return ex.reduce(function (t, x) { return t + Math.max(196, x.label.length * 25 + 36) + 22; }, 0); };
      while (cat.examples.length > 2 && w(cat.examples) > 980) cat.examples.pop();
    }
    return cat;
  }
  // After an edit: keep the same category / challenges if they still exist.
  function refresh() {
    if (!st) return;
    var lv = WU.state.level, same = WU.list('bomb', st.cat.list, lv).filter(function (x) { return x.id === st.cat.id; })[0];
    if (same) { var ex = st.cat.examples; st.cat = buildCat(same, st.cat.list); if (!same.examples && ex.length) st.cat.examples = ex; } else newCat();
    if (st.pens) {
      var all = WU.list('bomb', 'challenges', lv);
      st.pens = st.pens.map(function (p) { return all.filter(function (x) { return x.id === p.id; })[0] || WU.pick(all) || p; });
    }
    if (st.phase === 'ready' || st.phase === 'result' || st.phase === 'boomed') renderPhase();
  }
  function pickChallenges() {
    var all = WU.list('bomb', 'challenges', WU.state.level);
    if (!all.length) all = [{ id: 'none', short: 'EMPTY', text: 'Press E to add challenges', sub: '', frame: '', pic: '', timer: 0 }];
    var out = [], sh = WU.shuffle(all);
    while (out.length < 8) out = out.concat(sh);
    return out.slice(0, 8);
  }
  function frameHTML(f) {
    return '<div class="frame">' + WU.esc(f).split('___').join('<span class="gap"></span>') + '</div>';
  }

  /* ---------- bomb drawing ---------- */
  function bombHTML(lit) {
    return '<div class="bomb-el' + (lit ? ' lit' : '') + '" data-b="start"><div class="rig">' +
      '<div class="fuse-rot"><div class="fuse" style="width:250px"></div>' + (lit ? '<div class="spark" style="left:216px"></div>' : '<div class="end" style="left:240px"></div>') + '</div>' +
      '<div class="body"><div class="cap"></div><div class="ball"></div><div class="sh1"></div><div class="sh2"></div></div></div></div>';
  }
  function setFuse(p) {
    var len = 250 * (1 - p), f = layer.querySelector('.fuse'), s = layer.querySelector('.spark');
    if (f) f.style.width = len + 'px';
    if (s) s.style.left = (len - 34) + 'px';
    var mix = function (a, b) { return Math.round(a + (b - a) * p); };
    box.style.background = 'rgb(' + mix(244, 250) + ',' + mix(241, 216) + ',' + mix(234, 196) + ')';
  }

  /* ---------- phase rendering ---------- */
  function renderPhase() {
    var ph = st.phase, h = '';
    box.style.background = (ph === 'boom' || ph === 'boomed') ? '#ff5a1f' : '#f4f1ea';
    layer.classList.remove('shake');
    if (ph === 'ready' || ph === 'ticking') {
      var c = st.cat, b = bank(), L = c.name.length, fs = L <= 20 ? 132 : L <= 28 ? 112 : 98, lit = ph === 'ticking', ek = ' data-edit="bomb:' + c.list + ':' + c.id + '"';
      h += (st.demo ? '<div class="demo">TEACHER DEMO: you go first!</div>' : '') + bombHTML(lit) + '<div class="col">' +
        '<div class="chip-label" style="background:#ff4fc3">CATEGORY</div>';
      if (c.pic) h += '<div class="catrow"' + ek + '>' + WU.pic(c.pic) + '<div class="cat" style="font-size:' + fs + 'px;animation:none">' + WU.esc(c.name) + '</div></div>';
      else h += '<div class="cat"' + ek + ' style="font-size:' + fs + 'px">' + WU.esc(c.name) + '</div>';
      if (beginner()) {
        if (c.examples.length) h += '<div class="ex"' + ek + '>' + c.examples.map(function (x) { return '<div>' + WU.pic(x.id) + '<span>' + WU.esc(x.label) + '</span></div>'; }).join('') + '</div>';
        h += frameHTML(c.frame);
      }
      h += '<div class="rule' + (lit ? ' hot' : '') + '">' + WU.esc(lit ? b.tickRule : b.rule) + '</div></div>';
      h += lit
        ? '<div class="qbox"><div class="qq">??</div><div style="display:flex;flex-direction:column"><span class="a">seconds left</span><span class="b">Nobody knows. Not even me.</span></div></div>'
        : '<div class="go"><div class="btn" data-b="start"><span class="key">SPACE</span><span>to light the fuse</span></div></div>';
      layer.innerHTML = h;
      if (lit) setFuse(st.p);
    } else if (ph === 'boom' || ph === 'boomed') {
      if (ph === 'boom') {
        layer.innerHTML = blastHTML() + '<div class="boomtxt"><div>BOOM!</div></div>';
        if (!WU.isCalm()) layer.classList.add('shake');
      } else if (!layer.querySelector('.who')) {
        if (!layer.querySelector('.boomtxt')) layer.innerHTML = '<div class="boomtxt"><div>BOOM!</div></div>';
        layer.insertAdjacentHTML('beforeend', '<div class="who"><div class="q">Who\'s holding it?</div>' +
          '<div class="btn" data-b="spin"><span class="key">SPACE</span><span>Spin the challenge wheel</span></div></div>');
      }
    } else if (ph === 'spinning' || ph === 'result') {
      renderWheel();
    }
    wireLayer(); renderHints();
  }

  function blastHTML() {
    if (WU.isCalm()) return '';
    var cx = 430, cy = 590, h = '<div class="blast">';
    [['#ffe600', 0], ['#ff4fc3', 0.08], ['#f4f1ea', 0.16], ['#ff5a1f', 0.27]].forEach(function (r) {
      h += '<div class="ring" style="left:' + cx + 'px;top:' + cy + 'px;background:' + r[0] + ';animation-delay:' + r[1] + 's"></div>';
    });
    for (var i = 0; i < 24; i++) {
      var a = (i / 24) * Math.PI * 2 + Math.random() * 0.3, d = 700 + Math.random() * 900, s = 20 + Math.random() * 50;
      h += '<div class="deb" style="left:' + cx + 'px;top:' + cy + 'px;width:' + s + 'px;height:' + s + 'px;background:' + (i % 3 ? '#0d0d0d' : '#f4f1ea') +
        ';--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d).toFixed(0) + 'px;--rot:' + (Math.random() * 720 - 360).toFixed(0) +
        'deg;animation-duration:' + (0.9 + Math.random() * 0.5).toFixed(2) + 's;animation-delay:.05s"></div>';
    }
    return h + '<div class="fl"></div></div>';
  }

  function renderWheel() {
    var pens = st.pens, beg = beginner(), grad = SEGC.map(function (c, i) { return c + ' ' + (i * 45) + 'deg ' + ((i + 1) * 45) + 'deg'; }).join(', ');
    var h = '<div class="wheelbox">';
    if (st.timerOn) h += '<div class="tslot" style="position:absolute;left:100px;top:100px"></div>';
    else {
      h += '<div class="wheel" data-b="again" style="background:conic-gradient(' + grad + ');transform:rotate(' + st.rot + 'deg)">';
      for (var i = 0; i < 8; i++) h += '<div class="wline" style="transform:rotate(' + (i * 45) + 'deg)"><div></div></div>';
      pens.forEach(function (p, i) {
        h += '<div class="wseg" style="transform:rotate(' + (i * 45 + 22.5) + 'deg)"><div data-edit="bomb:challenges:' + p.id + '"' + (p.short.length > 8 ? ' style="font-size:32px"' : '') + '>' + WU.esc(p.short) + (p.pic ? WU.pic(p.pic) : '') + '</div></div>';
      });
      h += '</div><div class="hub">?</div><div class="ptr1"></div><div class="ptr2"></div>';
    }
    h += '</div><div class="rcol"><div class="chip-label" style="background:#ff5a1f">CHALLENGE WHEEL</div>';
    if (st.phase === 'spinning') h += '<div class="live">' + WU.esc(st.live) + '</div>';
    else {
      var r = pens[st.res], sub = /^Topic: ?$/.test(r.sub) ? 'Topic: ' + st.cat.name.toLowerCase() : r.sub;
      h += '<div class="res" data-edit="bomb:challenges:' + r.id + '" style="background:' + SEGC[st.res] + '">' + (r.pic ? WU.pic(r.pic) : '') +
        '<div><div class="t">' + WU.esc(r.text) + '</div>' + (beg && r.frame ? '<div class="s" style="margin-top:22px">' + frameHTML(r.frame) + '</div>' : sub ? '<div class="s">' + WU.esc(sub) + '</div>' : '') + '</div></div>' +
        '<div class="acts">' + (r.timer ? '<div class="btn sm" data-b="timer"><span class="key">T</span><span>' + (st.timerOn ? 'Pause / go' : 'Start the ' + r.timer + '-second timer') + '</span></div>' : '') +
        '<div class="btn sm" data-b="next"><span class="key">SPACE</span><span>Next round</span></div></div>';
    }
    layer.innerHTML = h + '</div>';
    if (st.timerOn && clock) layer.querySelector('.tslot').appendChild(clock.el);
  }

  function wireLayer() {
    layer.querySelectorAll('[data-b]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var a = b.getAttribute('data-b');
        if (a === 'start') start(); else if (a === 'spin') spin(); else if (a === 'next') next();
        else if (a === 'timer') startTimer(); else if (a === 'again' && st.phase === 'result') spin();
      };
    });
  }

  /* ---------- hints (also tappable) ---------- */
  function renderHints() {
    var ph = st.phase, res = st.res != null && st.pens ? st.pens[st.res] : null, sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = ph === 'ready' ? [['SPACE', 'start'], ['N', 'new category'], ['P', 'who starts?'], ['R', 'reset'], ['Esc', 'home']].concat(sc)
      : ph === 'ticking' ? [['R', 'reset'], ['X', 'explode now'], ['Esc', 'home']].concat(sc)
      : ph === 'boom' ? [['R', 'reset'], ['Esc', 'home']]
      : ph === 'boomed' ? [['SPACE', 'spin the wheel'], ['R', 'reset'], ['Esc', 'home']].concat(sc)
      : ph === 'spinning' ? [['R', 'reset'], ['Esc', 'home']]
      : [['SPACE', 'next round']].concat(res && res.timer ? [['T', 'timer']] : [], [['R', 'reset'], ['Esc', 'home']], sc);
    var el = root.querySelector('.hints');
    el.innerHTML = hs.map(function (x) { return '<div class="hint" data-k="' + x[0] + '"><span class="k">' + x[0] + '</span><span class="l">' + x[1] + '</span></div>'; }).join('');
    el.querySelectorAll('.hint').forEach(function (b) { b.onclick = function () { keyAction(b.getAttribute('data-k')); }; });
  }

  /* ---------- flow ---------- */
  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock();
    // Hidden fuse: 15-60 s (the Beginner teacher demo uses a short one).
    st.total = st.demo ? 15000 + Math.random() * 8000 : 15000 + Math.random() * 45000;
    st.t0 = Date.now(); st.burst = 0; st.p = 0; st.phase = 'ticking';
    renderPhase();
    timers.prog = setInterval(function () {
      st.p = Math.min(0.96, 1 - Math.exp(-(Date.now() - st.t0) / 14000)); setFuse(st.p);
    }, 120);
    schedule();
  }
  // Uneven ticking: gets faster overall, with random bursts and pauses so nobody can predict the end.
  function schedule() {
    var el = Date.now() - st.t0, rem = st.total - el;
    if (rem <= 0) return boom();
    var q = el / st.total, iv;
    if (st.burst > 0) { st.burst--; iv = 90 + Math.random() * 50; }
    else {
      iv = (820 - 600 * Math.pow(q, 1.3)) * (0.5 + Math.random());
      if (Math.random() < 0.09) st.burst = 2 + WU.rand(4);
      if (Math.random() < 0.07) iv *= 1.9;
    }
    timers.tick = setTimeout(function () {
      if (Date.now() - st.t0 >= st.total) return boom();
      WU.sound.tick(st.tick % 2 === 0); st.tick++;
      var body = layer.querySelector('.bomb-el .body'); WU.restartAnim(body, 'thump');
      if (!WU.isCalm()) {
        var old = layer.querySelector('.tickflash'); if (old) old.remove();
        layer.insertAdjacentHTML('afterbegin', '<div class="tickflash"></div>');
      }
      schedule();
    }, Math.min(iv, rem));
  }
  function boom() {
    if (st.phase !== 'ticking') return;
    clearAll(); WU.sound.boom();
    st.phase = 'boom'; renderPhase();
    timers.boom = setTimeout(function () { st.phase = 'boomed'; renderPhase(); }, WU.isCalm() ? 900 : 1700);
  }
  function spin() {
    if (st.phase !== 'boomed' && st.phase !== 'result') return;
    clearAll(); WU.sound.unlock();
    if (st.phase === 'boomed' || !st.pens) st.pens = pickChallenges();
    var k = WU.rand(8), a = k * 45 + 22.5 + (Math.random() * 30 - 15);
    var R = Math.ceil((st.rot + 360 * 5) / 360) * 360 + (((90 - a) % 360) + 360) % 360;
    var dur = WU.isCalm() ? 2.5 : 5.4;
    st.phase = 'spinning'; st.res = null; st.timerOn = false; st.live = '';
    renderPhase();
    var wheel = layer.querySelector('.wheel');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wheel.style.transition = 'transform ' + dur + 's cubic-bezier(.1,.7,.12,1)';
        wheel.style.transform = 'rotate(' + R + 'deg)'; st.rot = R;
      });
    });
    var last = -1, live = layer.querySelector('.live');
    var loop = function () {
      var m = /matrix\(([^)]+)\)/.exec(getComputedStyle(wheel).transform || '');
      if (m) {
        var v = m[1].split(',').map(parseFloat), ang = Math.atan2(v[1], v[0]) * 180 / Math.PI;
        var seg = Math.floor(((((90 - ang) % 360) + 360) % 360) / 45) % 8;
        if (seg !== last) { last = seg; WU.sound.clack(); st.live = st.pens[seg].short; if (live) live.textContent = st.live; }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    timers.spin = setTimeout(function () {
      cancelAnimationFrame(raf); WU.sound.ding(); WU.sound.slam();
      st.phase = 'result'; st.res = k; renderPhase();
    }, dur * 1000 + 200);
  }
  function startTimer() {
    if (st.phase !== 'result') return;
    var r = st.pens[st.res]; if (!r.timer) return;
    if (clock) { clock.toggle(); return; }
    clock = WU.Timer({ seconds: r.timer, size: 620 }); st.timerOn = true;
    renderPhase(); clock.start();
  }
  function next() {
    if (st.phase !== 'result') return;
    clearAll(); st.demo = false; st.phase = 'ready'; st.p = 0; st.res = null; st.timerOn = false;
    newCat(); renderPhase();
  }
  function reset() {
    clearAll(); st.phase = 'ready'; st.p = 0; st.res = null; st.timerOn = false; renderPhase();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('bomb-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') start(); else if (ph === 'boomed') spin(); else if (ph === 'result') next(); }
    else if (k === 'N') { if (ph === 'ready') { newCat(); renderPhase(); } }
    else if (k === 'R') reset();
    else if (k === 'X') { if (ph === 'ticking') boom(); }
    else if (k === 'T') startTimer();
    else if (k === 'P') { if (ph === 'ready') WU.pickStudent({ title: 'WHO STARTS?', landed: 'YOU START!', sub: 'Take the object. Say the first word!' }); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  function header() {
    var L = WU.LEVELS[WU.state.level];
    return '<div class="gh"><div class="logo small" data-act="home" title="Home (Esc)"><span>WARM UP!</span></div><span class="title">/ The Bomb</span><div style="flex:1"></div>' +
      '<div class="lvchip">' + L.name + '<span>' + L.code + '</span></div>' +
      (WU.state.teams ? '<div class="tbtn" data-h="scores">Scores</div>' : '') +
      '<div class="ibtn" data-act="edit" title="Edit mode (E)">' + WU.icons.pencil + '</div>' +
      '<div class="ibtn" data-act="mute">' + WU.icons.sound() + '</div><div class="ibtn" data-act="full">' + WU.icons.full + '</div>' +
      '<div class="ibtn" data-act="help">' + WU.icons.help + '</div></div>';
  }

  WU.views.bomb = {
    title: 'The Bomb',
    help: function () {
      return [['Space', 'start / spin / next round'], ['N', 'new category'], ['R', 'reset'], ['X', 'explode now'], ['T', 'challenge timer'], ['P', 'pick who starts'],
        ['S', 'show / hide scores'], ['1 - 4', 'team point (Shift = minus)']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', cat: null, catN: 0, p: 0, tick: 0, rot: 0, live: '', res: null, pens: null, timerOn: false, demo: beginner() };
      el.innerHTML = '<div class="bomb"><div class="layer"></div>' + header() + '<div class="hints"></div></div>';
      box = el.querySelector('.bomb'); layer = el.querySelector('.layer');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('bomb-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newCat(); renderPhase();
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearAll(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = layer = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      var k = e.key.toLowerCase();
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { n: 'N', r: 'R', x: 'X', t: 'T', p: 'P', s: 'S' };
      if (map[k]) { keyAction(map[k]); return true; }
    }
  };
})();
