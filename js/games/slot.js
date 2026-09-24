/* Warm Up: SLOT MACHINE OF CHAOS.
   Ready -> Spinning (reels stop one by one: WHO, TOPIC, HOW, TWIST) -> Talking (timer starts by itself)
   -> Questions (two more students each ask the speaker one question) -> spin again.
   Keys: Space spin, Enter pause / go, Q questions now, H speaking styles on/off, W twists on/off, S scores.
   Content: content/slot.js through the edit layer, so every word on screen is editable (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var COL = { who: '#c6ff00', topic: '#ffffff', how: '#ff4fc3', twist: '#ffe600' };

  /* ---------- editable lists ---------- */
  var scr = kit.screen({
    game: 'slot', title: 'Slot Machine', content: function () { return WU.content.slotScreen; },
    fields: [
      { type: 'head', label: 'Reels' },
      { k: 'whoLabel', label: 'Reel 1 label', type: 'text', max: 16 },
      { k: 'topicLabel', label: 'Reel 2 label', type: 'text', max: 16 },
      { k: 'howLabel', label: 'Reel 3 label', type: 'text', max: 16 },
      { k: 'twistLabel', label: 'Reel 4 label', type: 'text', max: 16 },
      { k: 'howOn', label: 'Speaking-style reel (HOW) at this level', type: 'bool', on: 'On', off: 'Off', hint: 'H switches it for one lesson.' },
      { k: 'twistOn', label: 'Twist reel at this level', type: 'bool', on: 'On', off: 'Off', hint: 'W switches it for one lesson.' },
      { k: 'qMark', label: 'Reels before the first spin', type: 'text', max: 4 },
      { type: 'head', label: 'Talking' },
      { k: 'talkSecs', label: 'Talking time (seconds)', type: 'num', min: 10, max: 300, hint: 'Starts by itself when the last reel stops.' },
      { k: 'frame', label: 'Sentence frame for every topic at this level (empty = none)', type: 'text', max: 60, hint: 'Use ___ for the gap. A topic can have its own frame.' },
      { k: 'rule', label: 'Rule line', type: 'text', max: 80 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first spin only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off', hint: 'The first spin lands on the teacher.' },
      { k: 'demoWho', label: 'Name on reel 1 in the demo round', type: 'text', max: 16 },
      { type: 'head', label: 'Questions after the talk' },
      { k: 'askers', label: 'Students who ask a question (0 = skip)', type: 'num', min: 0, max: 3 },
      { k: 'askTag', label: 'Tag', type: 'text', max: 20 },
      { k: 'askLine', label: 'Line ({name} = the speaker)', type: 'text', max: 60 },
      { k: 'askFrame', label: 'Question frame (empty = none)', type: 'text', max: 60, hint: 'Use ___ for the gap, e.g. "Do you like ___?"' }
    ]
  });
  function topicFields() {
    return [
      { k: 'text', label: 'Topic', type: 'text', max: 70 },
      { k: 'pic', label: 'Picture', type: 'pic' },
      { k: 'frame', label: 'Sentence frame for this topic', type: 'text', max: 60,
        ph: function (it, l) { return scr.get(l).frame ? 'Level frame: ' + scr.get(l).frame : 'none'; },
        hint: 'Use ___ for the gap. Empty = the level\'s frame.' }
    ];
  }
  function normTopic(r) { return { text: r.text || '', pic: r.pic || '', frame: r.frame || '' }; }
  WU.registerList('slot', 'topics', { gameTitle: 'Slot Machine', label: 'Topics', defaults: function (l) { return WU.content.slot[l].topics; }, norm: normTopic, fields: topicFields,
    blank: function () { return { text: 'New topic', pic: '', frame: '' }; } });
  WU.registerList('slot', 'first', { gameTitle: 'Slot Machine', label: 'First-lesson topics', defaults: function (l) { return WU.content.slot[l].first; }, norm: normTopic, fields: topicFields,
    blank: function () { return { text: 'New topic', pic: '', frame: '' }; } });
  WU.registerList('slot', 'styles', { gameTitle: 'Slot Machine', label: 'Speaking styles (HOW)', defaults: function (l) { return WU.content.slot[l].styles; },
    norm: function (r) { return { text: r.text || '', sub: r.sub || '', pic: r.pic || '' }; },
    fields: function () { return [{ k: 'text', label: 'Speaking style (changes only HOW you speak)', type: 'text', max: 30 }, { k: 'sub', label: 'Small line (empty = hide)', type: 'text', max: 50 }, { k: 'pic', label: 'Picture', type: 'pic' }]; },
    blank: function () { return { text: 'New style', sub: '', pic: '' }; } });
  WU.registerList('slot', 'twists', { gameTitle: 'Slot Machine', label: 'Twists', defaults: function (l) { return WU.content.slot[l].twists; },
    norm: function (r) { return { text: r.text || '', sub: r.sub || '' }; },
    fields: function () { return [{ k: 'text', label: 'Twist', type: 'text', max: 40 }, { k: 'sub', label: 'Small line (empty = hide)', type: 'text', max: 50 }]; },
    blank: function () { return { text: 'New twist', sub: '' }; } });

  var root, box, st, timers = {}, sb = null, clock = null, offContent = null, spinIv = null;
  var deckT = kit.deck(), deckS = kit.deck(), deckW = kit.deck();

  function topicList() {
    var lv = WU.state.level, first = WU.state.lesson === 'first' && WU.list('slot', 'first', lv).length;
    return { name: first ? 'first' : 'topics', items: WU.list('slot', first ? 'first' : 'topics', lv) };
  }
  function byId(list, id) { return WU.list('slot', list, WU.state.level).filter(function (x) { return x.id === id; })[0] || null; }
  function reels() {
    var r = ['who', 'topic'];
    if (st.how) r.push('how');
    if (st.twist) r.push('twist');
    return r;
  }
  function clearAll() {
    clearTimeout(timers.stop1); clearTimeout(timers.ask); clearInterval(spinIv);
    (timers.stops || []).forEach(clearTimeout); timers.stops = [];
    if (clock) { clock.destroy(); clock = null; }
  }

  /* ---------- drawing ---------- */
  // One reel: tag above a black window. Spinning reels show a blurred strip of real items.
  function reelHTML(k) {
    var S = scr.get(), lab = { who: S.whoLabel, topic: S.topicLabel, how: S.howLabel, twist: S.twistLabel }[k];
    var h = '<div class="reel r-' + k + '">' + kit.chip(lab, scr.ea(k + 'Label'), COL[k] === '#ffffff' ? '#00e5c7' : COL[k]) + '<div class="win" style="color:' + COL[k] + '">';
    var v = st.val[k], stopped = st.stopped[k];
    if (st.phase === 'ready' && !v) h += '<div class="rtxt qm"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>';
    else if (!stopped) h += '<div class="strip" data-auto>' + stripItems(k).map(function (t) { return '<div>' + WU.esc(t) + '</div>'; }).join('') + '</div>';
    else h += valueHTML(k);
    return h + '</div></div>';
  }
  function stripItems(k) {
    var S = scr.get(), src = k === 'who' ? WU.roster()
      : (k === 'topic' ? topicList().items : WU.list('slot', k === 'how' ? 'styles' : 'twists', WU.state.level)).map(function (x) { return x.text; });
    var out = WU.shuffle(src).slice(0, 6); if (!out.length) out = [S.qMark];
    return out.concat(out);
  }
  function land(k) { return st.landed === k ? ' land' : ''; }
  function valueHTML(k) {
    var v = st.val[k];
    if (k === 'who') {
      return v.demo ? '<div class="rtxt' + land(k) + '"' + scr.ea('demoWho') + '>' + WU.esc(scr.get().demoWho) + '</div>'
        : '<div class="rtxt' + land(k) + '" data-auto>' + WU.esc(v.name) + '</div>';
    }
    if (!v) return '<div class="rtxt land"' + scr.ea('qMark') + '>' + WU.esc(scr.get().qMark) + '</div>';
    var list = k === 'topic' ? v.list : k === 'how' ? 'styles' : 'twists', it = byId(list, v.id);
    if (!it) return '<div class="rtxt land"' + scr.ea('qMark') + '>' + WU.esc(scr.get().qMark) + '</div>';
    var ek = function (f) { return ' data-edit="slot:' + list + ':' + it.id + ':' + f + '"'; };
    return '<div class="rbox' + land(k) + '">' + (it.pic ? '<div class="rpic"' + ek('pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="rcol"><div class="rtxt"' + ek('text') + '>' + WU.esc(it.text) + '</div>' +
      (it.sub ? '<div class="rsub"' + ek('sub') + '>' + WU.esc(it.sub) + '</div>' : '') + '</div></div>';
  }
  function render() {
    var S = scr.get(), rs = reels(), top = rs.filter(function (k) { return k !== 'topic'; }), h = '';
    h += '<div class="row1 n' + top.length + '">' + top.map(reelHTML).join('') + '</div>';
    h += '<div class="row2' + (st.phase === 'talking' || st.phase === 'questions' ? ' withtimer' : '') + '">' + reelHTML('topic') + '<div class="tslot"></div></div>';
    h += '<div class="bottom">' + bottomHTML(S) + '</div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock) box.querySelector('.tslot').appendChild(clock.el);
    fitAll(); wire(); renderHints();
  }
  function fitAll() {
    // Measure without the landing animation (its scale would count as overflow).
    var lands = [].slice.call(box.querySelectorAll('.land'));
    lands.forEach(function (e) { e.style.animation = 'none'; });
    box.querySelectorAll('.win').forEach(function (w) {
      var big = w.parentNode.classList.contains('r-topic'), t = w.querySelector('.rbox, .rtxt');
      if (!t) return;
      var txt = w.querySelector('.rtxt'), sub = w.querySelector('.rsub');
      var max = big ? 128 : 100, min = big ? 64 : 48;
      if (sub) sub.style.fontSize = '40px';
      // Shrink the main text first; the whole box must fit inside the window.
      var fs = max; txt.style.fontSize = fs + 'px';
      while (fs > min && (w.scrollHeight > w.clientHeight + 2 || w.scrollWidth > w.clientWidth + 2 || t.scrollWidth > t.clientWidth + 2 || txt.scrollWidth > txt.clientWidth + 2)) { fs -= 4; txt.style.fontSize = fs + 'px'; }
    });
    lands.forEach(function (e) { e.style.animation = ''; });
  }
  function frameOf() {
    // A topic's own frame shows only after its reel stops (it would give the topic away).
    var S = scr.get(), v = st.stopped.topic && st.val.topic, it = v && byId(v.list, v.id);
    if (it && it.frame) return { f: it.frame, attr: ' data-edit="slot:' + v.list + ':' + it.id + ':frame"' };
    return S.frame ? { f: S.frame, attr: scr.ea('frame') } : null;
  }
  function bottomHTML(S) {
    var h = '', ph = st.phase;
    if (ph === 'questions') {
      var who = st.val.who, name = who.demo ? S.demoWho : who.name;
      h += '<div class="ask">' + kit.chip(S.askTag, scr.ea('askTag'), '#ffe600') +
        '<div class="askers" data-auto>' + WU.esc(st.askers.join(' + ')) + '</div></div>' +
        '<div class="askrow">' + (S.askLine ? '<div class="rule"' + scr.ea('askLine') + '>' + WU.esc(kit.fill(S.askLine, { name: name })) + '</div>' : '') +
        kit.frame(S.askFrame, scr.ea('askFrame')) + '</div>';
      return h;
    }
    if (st.demo && S.demo) h += '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>';
    var fr = frameOf();
    if (ph === 'ready') {
      h += '<div class="brow">' + (fr ? kit.frame(fr.f, fr.attr) : '') + '<div class="btn" data-ctrl data-b="spin"><span class="key">SPACE</span><span>Spin!</span></div></div>';
    } else {
      h += '<div class="brow">' + (fr ? kit.frame(fr.f, fr.attr) : '') + (S.ruleShow && S.rule ? '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>' : '') + '</div>';
    }
    return h;
  }
  function wire() {
    box.querySelectorAll('[data-b="spin"]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); spin(); }; });
  }
  function renderHints() {
    var ph = st.phase, sc = WU.state.teams ? [['S', 'scores']] : [];
    var tog = [['H', 'styles ' + (st.how ? 'off' : 'on')], ['W', 'twist ' + (st.twist ? 'off' : 'on')]];
    var hs = ph === 'ready' ? [['SPACE', 'spin']].concat(tog, [['Esc', 'home']], sc)
      : ph === 'spinning' ? [['Esc', 'home']]
      : ph === 'talking' ? [['ENTER', 'pause / go'], ['Q', 'questions now'], ['SPACE', 'spin again'], ['Esc', 'home']].concat(sc)
      : [['SPACE', 'spin again']].concat(tog, [['Esc', 'home']], sc);
    kit.hints(root, hs, keyAction);
  }

  /* ---------- flow ---------- */
  function spin() {
    if (st.phase === 'spinning') return;
    clearAll(); WU.sound.unlock();
    var lv = WU.state.level, tl = topicList(), rs = reels();
    var t = deckT(tl.items), how = st.how ? deckS(WU.list('slot', 'styles', lv)) : null, tw = st.twist ? deckW(WU.list('slot', 'twists', lv)) : null;
    st.val = {
      who: st.demo ? { demo: true } : { name: kit.student(st.val.who && st.val.who.name ? [st.val.who.name] : null) },
      topic: t ? { list: tl.name, id: t.id } : null, how: how ? { id: how.id } : null, twist: tw ? { id: tw.id } : null
    };
    st.stopped = {}; st.phase = 'spinning'; st.askers = [];
    render();
    spinIv = setInterval(function () { WU.sound.clack(); }, 95);
    var gap = WU.isCalm() ? 450 : 800, t0 = WU.isCalm() ? 600 : 1100;
    rs.forEach(function (k, i) {
      timers.stops.push(setTimeout(function () {
        st.stopped[k] = true; st.landed = k; WU.sound.slam();
        if (i === rs.length - 1) { clearInterval(spinIv); WU.sound.ding(); talk(); } else render();
      }, t0 + i * gap));
    });
  }
  function talk() {
    var S = scr.get();
    st.phase = 'talking';
    clock = WU.Timer({ seconds: Math.max(10, +S.talkSecs || 60), size: 330, onDone: function () { timers.ask = setTimeout(questions, 1400); } });
    render(); clock.start();
  }
  function questions() {
    if (st.phase !== 'talking') return;
    st.landed = null;
    clearTimeout(timers.ask);
    var S = scr.get(), n = Math.max(0, Math.min(3, +S.askers || 0));
    if (clock && clock.isRunning()) clock.toggle();
    st.demo = false;
    if (!n) { st.phase = 'done'; render(); return; }
    var not = st.val.who.demo ? [] : [st.val.who.name];
    st.askers = [];
    for (var i = 0; i < n; i++) { var a = kit.student(not); st.askers.push(a); not = not.concat([a]); }
    st.phase = 'questions'; WU.sound.pop(); render();
  }
  function toggleReel(k) {
    if (st.phase === 'spinning') return;
    st[k] = !st[k]; st.touched = true;
    if (!st[k]) st.val[k] = null;
    else if (st.phase !== 'ready') {
      // Switched on after a spin: fill it now so the screen stays complete.
      var it = k === 'how' ? deckS(WU.list('slot', 'styles', WU.state.level)) : deckW(WU.list('slot', 'twists', WU.state.level));
      st.val[k] = it ? { id: it.id } : null; st.stopped[k] = true;
    }
    WU.toast((k === 'how' ? 'Speaking styles ' : 'Twists ') + (st[k] ? 'on' : 'off'));
    render();
  }
  function refresh() {
    if (!st || st.phase === 'spinning') return;
    // Reel on/off from Edit mode (or just loaded from GitHub), unless the teacher switched them with H / W.
    if (!st.touched) {
      var S = scr.get(); st.how = !!S.howOn; st.twist = !!S.twistOn; if (st.phase === 'ready') st.demo = !!S.demoShow;
      if (!st.how) st.val.how = null; if (!st.twist) st.val.twist = null;
      if (st.phase !== 'ready') {
        if (st.how && !st.val.how) { var h = deckS(WU.list('slot', 'styles', WU.state.level)); st.val.how = h ? { id: h.id } : null; st.stopped.how = true; }
        if (st.twist && !st.val.twist) { var x = deckW(WU.list('slot', 'twists', WU.state.level)); st.val.twist = x ? { id: x.id } : null; st.stopped.twist = true; }
      }
    }
    // A deleted item: draw another one so the screen never shows a gap.
    if (st.phase !== 'ready') {
      if (st.val.topic && !byId(st.val.topic.list, st.val.topic.id)) { var t = deckT(topicList().items); st.val.topic = t ? { list: topicList().name, id: t.id } : null; }
      if (st.val.how && !byId('styles', st.val.how.id)) { var s = deckS(WU.list('slot', 'styles', WU.state.level)); st.val.how = s ? { id: s.id } : null; }
      if (st.val.twist && !byId('twists', st.val.twist.id)) { var w = deckW(WU.list('slot', 'twists', WU.state.level)); st.val.twist = w ? { id: w.id } : null; }
    }
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('slot-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph !== 'spinning') spin(); }
    else if (k === 'ENTER') { if (ph === 'talking' && clock) clock.toggle(); }
    else if (k === 'Q') { if (ph === 'talking') questions(); }
    else if (k === 'H') toggleReel('how');
    else if (k === 'W') toggleReel('twist');
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.slot = {
    title: 'Slot Machine of Chaos',
    teacher: function () {
      if (!st) return null;
      var sec = [], info = [], v = st.val || {}, lv = WU.state.level;
      var txt = function (list, x) { var it = x && WU.list('slot', list, lv).filter(function (i) { return i.id === x.id; })[0]; return it ? it.text : ''; };
      var who = v.who ? (v.who.demo ? scr.get().demoWho : v.who.name) : '';
      var parts = [['Who', who], ['Topic', v.topic ? txt(v.topic.list, v.topic) : ''], ['How', txt('styles', v.how)], ['Twist', txt('twists', v.twist)]].filter(function (p) { return p[1]; });
      if (st.phase === 'spinning') sec.push({ label: 'The reels will stop on', text: parts.map(function (p) { return p[0] + ': ' + p[1]; }).join('  |  '), hot: true });
      else parts.forEach(function (p) { info.push({ label: p[0], text: p[1] }); });
      if (st.askers && st.askers.length) info.push({ label: 'Ask a question', text: st.askers.join(', ') });
      info.push({ label: 'Reels', text: 'HOW ' + (st.how ? 'on' : 'off') + ', TWIST ' + (st.twist ? 'on' : 'off') });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['Space', 'spin'], ['Enter', 'pause / go (timer)'], ['Q', 'questions now'], ['H', 'speaking styles on / off'], ['W', 'twist reel on / off'],
        ['S', 'show / hide scores'], ['1 - 4', 'team point (Shift = minus)']];
    },
    mount: function (el) {
      root = el;
      var S = scr.get();
      st = { phase: 'ready', val: {}, stopped: {}, askers: [], how: !!S.howOn, twist: !!S.twistOn, demo: !!S.demoShow };
      el.innerHTML = '<div class="slot"><div class="layer"></div>' + kit.header('Slot Machine of Chaos') + '<div class="hints"></div></div>';
      box = el.querySelector('.slot');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('slot-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) fitAll(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearAll(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { q: 'Q', h: 'H', w: 'W', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
