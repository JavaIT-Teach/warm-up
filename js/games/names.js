/* Warm Up: NAME WALL (icebreaker).
   Round 1, Meet: the screen spotlights a student (random from the class list; no class list = the teacher points).
     The student says the frame; the class replies "Hi, ___!". The teacher types the name and adds the facts
     (a library picture and / or a keyword, per level). The card slides onto the wall.
   Round 2, Remember: all cards turn face-down (facts visible, names hidden). The screen picks a student and a card
     (never their own). Space flips it; X = wrong, the class helps, then flip. Until every card is flipped.
   PRIVACY: names and facts stay on this device only (localStorage "wu-namewall"): never synced, never in the backup file.
   Keys: Enter type / next field, Space next student / flip, R remember round, A back to meet, X wrong, N another card, Delete clear wall.
   Screen texts: content/names.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'names', title: 'Name Wall', content: function () { return WU.content.namesScreen; },
    fields: [
      { type: 'head', label: 'Round 1: Meet' },
      { k: 'tag', label: 'Tag (empty = hide)', type: 'text', max: 20 },
      { k: 'meetTag', label: 'Round 1 tag', type: 'text', max: 30 },
      { k: 'point', label: 'No class list: spotlight text', type: 'text', max: 40 },
      { k: 'meetFrame', label: 'Sentence frame', type: 'text', max: 80, hint: 'Use ___ for the gaps.' },
      { k: 'reply', label: 'The class replies ({name})', type: 'text', max: 40 },
      { k: 'meetRule', label: 'Rule line', type: 'text', max: 90 }, { k: 'meetRuleShow', label: 'Rule line', type: 'bool' },
      { k: 'facts', label: 'Facts per student (1 or 2)', type: 'num', min: 1, max: 2 },
      { k: 'factMode', label: 'Facts are', type: 'select', options: [['pic', 'A picture (Beginner)'], ['both', 'A keyword and / or a picture'], ['text', 'A keyword (IELTS)']] },
      { k: 'fact1Label', label: 'Fact 1: what you ask for (teacher form)', type: 'text', max: 30 },
      { k: 'fact2Label', label: 'Fact 2: what you ask for (teacher form)', type: 'text', max: 30 },
      { k: 'demo', label: 'Teacher demo banner (first card only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' },
      { k: 'demoWho', label: 'Name filled in for the demo card', type: 'text', max: 20 },
      { type: 'head', label: 'Round 2: Remember' },
      { k: 'rememberTag', label: 'Round 2 tag', type: 'text', max: 30 },
      { k: 'who', label: 'Who answers ({name})', type: 'text', max: 40 },
      { k: 'qMark', label: 'Hidden name on a card', type: 'text', max: 4 },
      { k: 'recallFrame', label: 'Sentence frame', type: 'text', max: 80 },
      { k: 'recallRule', label: 'Rule line', type: 'text', max: 90 }, { k: 'recallRuleShow', label: 'Rule line', type: 'bool' },
      { k: 'wrong', label: 'After a wrong answer (X)', type: 'text', max: 40 },
      { k: 'done', label: 'All cards flipped', type: 'text', max: 60 },
      { k: 'empty', label: 'Empty wall', type: 'text', max: 40 }
    ]
  });

  var root, box, st, sb = null, offContent = null, timers = [];

  /* ---------- the wall: this device only ---------- */
  function wkey() { return WU.state.classId || 'none'; }
  function wall() { var all = WU.store.get('namewall', {}) || {}; return Array.isArray(all[wkey()]) ? all[wkey()] : []; }
  function saveWall(cards) { var all = WU.store.get('namewall', {}) || {}; all[wkey()] = cards; WU.store.set('namewall', all); }
  function nFacts() { return Math.max(1, Math.min(2, +scr.get().facts || 1)); }
  function mode() { var m = scr.get().factMode; return m === 'pic' || m === 'text' ? m : 'both'; }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function lc(s) { return String(s || '').trim().toLowerCase(); }

  function rosterLeft() {
    if (!WU.activeClass()) return [];
    var on = wall().map(function (c) { return lc(c.name); });
    return WU.roster().filter(function (n) { return on.indexOf(lc(n)) < 0; });
  }
  function newSpot() {
    var S = scr.get(), left = rosterLeft(), facts = [];
    for (var i = 0; i < nFacts(); i++) facts.push({ pic: '', text: '' });
    var demo = st.demo && !wall().length;
    st.spot = { name: demo ? S.demoWho : left.length ? WU.pick(left) : '', facts: facts, demo: demo };
  }

  /* ---------- drawing ---------- */
  function factHTML(f) {
    return '<div class="nwf' + (f.pic ? '' : ' only') + '">' + (f.pic ? '<div class="nwp">' + WU.pic(f.pic) + '</div>' : '') + (f.text ? '<div class="nwk">' + WU.esc(f.text) + '</div>' : '') + '</div>';
  }
  function cardHTML(c, face) {
    var S = scr.get(), down = face === 'down' && !st.flipped[c.id], cls = 'nwc' + (down ? ' down' : '') + (st.hl === c.id ? ' hl' : '') + (st.justAdded === c.id ? ' new' : '') + (st.justFlipped === c.id ? ' flip' : '');
    return '<div class="' + cls + '" data-id="' + c.id + '"><div class="nwfs" data-auto>' + c.facts.map(factHTML).join('') + '</div>' +
      (down ? '<div class="nwn q"' + scr.ea('qMark') + '>' + WU.esc(S.qMark) + '</div>' : '<div class="nwn" data-auto>' + WU.esc(c.name) + '</div>') + '</div>';
  }
  function formHTML() {
    var sp = st.spot, S = scr.get(), m = mode(), h = '<div class="nwform" data-ctrl><label><span>Name</span><input class="nw-in" data-f="name" maxlength="24" autocomplete="off" value="' + WU.esc(sp.name) + '"></label>';
    sp.facts.forEach(function (f, i) {
      var lab = i === 0 ? S.fact1Label : S.fact2Label;
      h += '<label><span>' + WU.esc(lab || 'Fact ' + (i + 1)) + '</span>' +
        (m !== 'text' ? '<button class="nw-pic" data-pick="' + i + '" title="Choose a picture">' + (f.pic ? WU.pic(f.pic) : 'Picture') + '</button>' : '') +
        (m !== 'pic' ? '<input class="nw-in" data-f="' + i + '" maxlength="40" autocomplete="off" placeholder="keyword" value="' + WU.esc(f.text) + '">' : '') + '</label>';
    });
    return h + '<button class="nw-add" data-b="add">Add to wall (Enter)</button></div>';
  }
  function render() {
    var S = scr.get(), ph = st.phase, cards = wall(), h = '';
    var two = nFacts() > 1 || cards.some(function (c) { return c.facts.length > 1; }) ? ' two' : '';
    h += '<div class="nwhead">' + kit.chip(S.tag, scr.ea('tag'), '#ff4fc3') +
      (ph === 'meet' ? kit.chip(S.meetTag, scr.ea('meetTag'), '#c6ff00') : kit.chip(S.rememberTag, scr.ea('rememberTag'), '#ffe600')) +
      (ph === 'meet' && st.spot.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (ph === 'meet') {
      var nm = st.spot.name;
      h += '<div class="nwspot"><div class="nwname">' + (nm ? '<span' + (st.spot.demo && nm === S.demoWho ? scr.ea('demoWho') : ' data-auto') + '>' + WU.esc(nm) + '</span>'
        : '<span' + scr.ea('point') + '>' + WU.esc(S.point) + '</span>') + '</div>' +
        kit.frame(S.meetFrame, scr.ea('meetFrame')) +
        '<div class="nwreply"' + scr.ea('reply') + '>' + (nm ? WU.esc(kit.fill(S.reply, { name: nm })) : '') + '</div>' +
        (S.meetRuleShow && S.meetRule ? '<div class="rule"' + scr.ea('meetRule') + '>' + WU.esc(S.meetRule) + '</div>' : '') + formHTML() + '</div>';
      h += '<div class="nwwall meet' + two + '">' + (cards.length ? cards.map(function (c) { return cardHTML(c, 'up'); }).join('') : '<div class="nwempty"' + scr.ea('empty') + '>' + WU.esc(S.empty) + '</div>') + '</div>';
    } else {
      var hl = cards.filter(function (c) { return c.id === st.hl; })[0];
      h += '<div class="nwtop">';
      if (ph === 'done') h += '<div class="nwwho"' + scr.ea('done') + '>' + WU.esc(S.done) + '</div>';
      else {
        h += '<div class="nwwho"' + scr.ea('who') + '>' + WU.esc(kit.fill(S.who, { name: st.asker || '' })) + '</div><div class="brow">' + kit.frame(S.recallFrame, scr.ea('recallFrame')) +
          (st.wrong && S.wrong ? '<div class="rule hot"' + scr.ea('wrong') + '>' + WU.esc(S.wrong) + '</div>' : S.recallRuleShow && S.recallRule ? '<div class="rule"' + scr.ea('recallRule') + '>' + WU.esc(S.recallRule) + '</div>' : '') + '</div>';
      }
      h += '</div><div class="nwwall rem' + two + '">' + cards.map(function (c) { return cardHTML(c, 'down'); }).join('') + '</div>';
      if (hl && !st.flipped[hl.id]) timers.push(setTimeout(function () { var e = box && box.querySelector('.nwc.hl'); if (e) e.scrollIntoView({ block: 'nearest' }); }, 30));
    }
    box.querySelector('.layer').innerHTML = h;
    var nmEl = box.querySelector('.nwname'); if (nmEl) kit.fit(nmEl, 120, 56);
    var top = box.querySelector('.nwtop'), rw = box.querySelector('.nwwall.rem');
    if (top && rw) rw.style.top = Math.max(400, top.offsetTop + top.offsetHeight + 24) + 'px';
    wire(); renderHints();
    st.justAdded = null; st.justFlipped = null;
  }
  function wire() {
    box.querySelectorAll('.nw-in').forEach(function (inp) {
      inp.oninput = function () { setField(inp); };
      inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); advance(inp); } };
    });
    box.querySelectorAll('[data-pick]').forEach(function (b) { b.onclick = function () { chooser(+b.getAttribute('data-pick')); }; });
    var add = box.querySelector('[data-b="add"]'); if (add) add.onclick = addCard;
    box.querySelectorAll('.nwc').forEach(function (c) { c.onclick = function () { if (st.phase === 'remember' && c.getAttribute('data-id') === st.hl) flip(); }; });
  }
  function setField(inp) {
    var f = inp.getAttribute('data-f');
    if (f === 'name') {
      st.spot.name = inp.value;
      // Live: the spotlight and "Hi, ___!" follow what the teacher types (no redraw, so typing is not interrupted).
      var n = box.querySelector('.nwname'), r = box.querySelector('.nwreply'), S = scr.get();
      if (n) { n.innerHTML = inp.value ? '<span data-auto>' + WU.esc(inp.value) + '</span>' : '<span' + scr.ea('point') + '>' + WU.esc(S.point) + '</span>'; kit.fit(n, 120, 56); }
      if (r) r.textContent = inp.value ? kit.fill(S.reply, { name: inp.value }) : '';
    } else st.spot.facts[+f].text = inp.value;
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'meet' ? [['ENTER', 'type / next'], ['SPACE', 'next student'], ['R', 'remember round'], ['DEL', 'clear wall'], ['Esc', 'home']].concat(sc)
      : ph === 'remember' ? [['SPACE', 'flip'], ['X', 'wrong'], ['N', 'another card'], ['A', 'add people'], ['DEL', 'clear wall'], ['Esc', 'home']].concat(sc)
      : [['R', 'play again'], ['A', 'add people'], ['DEL', 'clear wall'], ['Esc', 'home']].concat(sc);
    kit.hints(root, hs, keyAction);
  }
  function focusField(f) {
    var inp = box && box.querySelector('.nw-in[data-f="' + f + '"]');
    if (inp) { inp.focus(); var v = inp.value; inp.value = ''; inp.value = v; }
    return !!inp;
  }

  /* ---------- round 1: meet ---------- */
  // Enter in a field: go on to the next thing the card needs.
  function advance(inp) {
    var f = inp.getAttribute('data-f'), m = mode();
    if (f === 'name') {
      if (!lc(st.spot.name)) { WU.sound.buzzer(); return; }
      if (m === 'pic') { chooser(0); return; }
      focusField(0); return;
    }
    var i = +f, fact = st.spot.facts[i];
    if (!fact.text.trim() && !fact.pic && m === 'both') { chooser(i); return; }
    if (!fact.text.trim() && m === 'text') { WU.sound.buzzer(); return; }
    if (i + 1 < st.spot.facts.length) { if (m === 'pic') chooser(i + 1); else focusField(i + 1); return; }
    addCard();
  }
  function afterPick(i) {
    if (i + 1 < st.spot.facts.length) { if (mode() === 'pic') chooser(i + 1); else focusField(i + 1); }
    else addCard();
  }
  function valid() {
    var sp = st.spot, m = mode();
    if (!lc(sp.name)) return false;
    return sp.facts.every(function (f) { return m === 'pic' ? !!f.pic : m === 'text' ? !!f.text.trim() : !!(f.pic || f.text.trim()); });
  }
  function addCard() {
    if (!valid()) { WU.sound.buzzer(); WU.toast(lc(st.spot.name) ? 'Add the fact first.' : 'Type the name first.'); focusField(lc(st.spot.name) ? (mode() === 'pic' ? 'name' : 0) : 'name'); return; }
    var cards = wall(), c = { id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: st.spot.name.trim(),
      facts: st.spot.facts.map(function (f) { return { pic: f.pic || '', text: (f.text || '').trim() }; }) };
    cards.push(c); saveWall(cards);
    st.demo = false; st.justAdded = c.id; WU.sound.pop(); timers.push(setTimeout(function () { WU.sound.ding(); }, 250));
    newSpot(); render(); focusField('name');
  }
  // A library picture for one fact. Type to search, arrows + Enter to choose, Esc to go back.
  function chooser(i) {
    var q = '', cur = 0, COLS = 8;
    function list() { var t = lc(q); return WU.PIC_LIST.filter(function (p) { return !t || p.name.toLowerCase().indexOf(t) >= 0 || p.tags.join(' ').indexOf(t) >= 0; }); }
    function grid(el) {
      var L = list(); cur = Math.min(cur, Math.max(0, L.length - 1));
      el.querySelector('.ed-grid').innerHTML = L.map(function (p, k) { return '<div class="ed-cell' + (k === cur ? ' cur' : '') + '" data-p="' + p.id + '">' + WU.pic(p.id) + '<span>' + WU.esc(p.name) + '</span></div>'; }).join('');
      el.querySelectorAll('[data-p]').forEach(function (c) { c.onclick = function () { pick(c.getAttribute('data-p')); }; });
      var c = el.querySelector('.ed-cell.cur'); if (c) c.scrollIntoView({ block: 'nearest' });
    }
    function pick(id) { st.spot.facts[i].pic = id; WU.closeOverlay(); WU.sound.clack(); render(); afterPick(i); }
    function key(k, el) {
      var L = list();
      if (k === 'ArrowRight') cur = Math.min(L.length - 1, cur + 1); else if (k === 'ArrowLeft') cur = Math.max(0, cur - 1);
      else if (k === 'ArrowDown') cur = Math.min(L.length - 1, cur + COLS); else if (k === 'ArrowUp') cur = Math.max(0, cur - COLS);
      else if (k === 'Enter') { if (L[cur]) pick(L[cur].id); return true; }
      else if (k === 'Escape') { WU.closeOverlay(); focusField(mode() === 'pic' ? 'name' : i); return true; }
      else return false;
      grid(el); return true;
    }
    WU.openOverlay({
      cls: 'nw-pick',
      render: function (el) {
        var S = scr.get();
        el.innerHTML = '<div class="panel nwpanel"><div class="ed-pick"><div class="row"><b>' + WU.esc((i === 0 ? S.fact1Label : S.fact2Label) || 'Picture') + '</b>' +
          '<input type="text" data-q placeholder="Type to search: pizza, cat, red..." style="flex:1"><span class="sbtn" data-x>Esc: back</span></div>' +
          '<div class="note">Arrows + Enter to choose.</div><div class="ed-grid"></div></div></div>';
        var inp = el.querySelector('[data-q]');
        inp.oninput = function () { q = inp.value; cur = 0; grid(el); };
        inp.onkeydown = function (e) { if (/^Arrow|^Enter$|^Escape$/.test(e.key)) { e.preventDefault(); e.stopPropagation(); key(e.key, el); } };
        el.querySelector('[data-x]').onclick = function () { key('Escape', el); };
        grid(el); inp.focus();
      },
      // Keys sent from the Teacher screen (the search box is not focused there).
      onKey: function (e) {
        var el = WU.overlay.el, inp = el.querySelector('[data-q]');
        if (e.key.length === 1 && e.key !== ' ') { inp.value += e.key; q = inp.value; cur = 0; grid(el); return true; }
        if (e.key === 'Backspace') { inp.value = inp.value.slice(0, -1); q = inp.value; grid(el); return true; }
        return key(e.key, el);
      },
      dismiss: true
    });
  }

  /* ---------- round 2: remember ---------- */
  function startRemember() {
    var cards = wall();
    if (cards.length < 2) { WU.toast('Put at least 2 people on the wall first.'); return; }
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    clearT(); st.phase = 'remember'; st.flipped = {}; st.wrong = false; WU.sound.slam();
    nextTurn();
  }
  function nextTurn() {
    var cards = wall(), left = cards.filter(function (c) { return !st.flipped[c.id]; });
    if (!left.length) { st.phase = 'done'; st.hl = null; WU.sound.ding(); render(); return; }
    var card = WU.pick(left.filter(function (c) { return c.id !== st.hl; }).length ? left.filter(function (c) { return c.id !== st.hl; }) : left);
    // Who answers: from the class list if there is one, else from the names on the wall; never the card's owner.
    var pool = (WU.activeClass() ? WU.roster() : cards.map(function (c) { return c.name; })).filter(function (n) { return lc(n) !== lc(card.name); });
    st.hl = card.id; st.asker = pool.length ? WU.pick(pool) : ''; st.wrong = false; WU.sound.pop(); render();
  }
  function flip() {
    if (st.phase !== 'remember' || !st.hl || st.flipped[st.hl]) return;
    st.flipped[st.hl] = true; st.justFlipped = st.hl; WU.sound.ding(); render();
    timers.push(setTimeout(function () { if (st && st.phase === 'remember') nextTurn(); }, WU.isCalm() ? 800 : 1600));
  }
  function wrong() { if (st.phase !== 'remember' || st.wrong) return; st.wrong = true; WU.sound.buzzer(); render(); }

  function clearWall() {
    WU.openOverlay({
      cls: 'nw-clear',
      render: function (el) {
        el.innerHTML = '<div class="panel" style="width:1000px"><div class="help-title">Clear the wall?</div>' +
          '<div style="font-size:30px;font-weight:700">This removes every name and fact of this class from this device. Enter = yes, Esc = no.</div>' +
          '<div style="display:flex;gap:20px"><span class="sbtn warn" tabindex="0" data-y>Yes, clear it</span><span class="sbtn" tabindex="0" data-n>No</span></div></div>';
        el.querySelector('[data-y]').onclick = doClear; el.querySelector('[data-n]').onclick = function () { WU.closeOverlay(); };
      },
      onKey: function (e) { if (e.key === 'Enter') { doClear(); return true; } }
    });
    function doClear() { WU.closeOverlay(); saveWall([]); clearT(); st.phase = 'meet'; st.flipped = {}; st.hl = null; st.demo = !!scr.get().demoShow; newSpot(); render(); WU.toast('Wall cleared.'); }
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('names-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'ENTER') { if (ph === 'meet') focusField('name'); }
    else if (k === 'SPACE') { if (ph === 'meet') { newSpot(); render(); } else if (ph === 'remember') flip(); }
    else if (k === 'R') { if (ph === 'meet' || ph === 'done') startRemember(); }
    else if (k === 'A') { if (ph !== 'meet') { clearT(); st.phase = 'meet'; st.hl = null; newSpot(); render(); focusField('name'); } }
    else if (k === 'X') wrong();
    else if (k === 'N') { if (ph === 'remember') nextTurn(); }
    else if (k === 'DEL') clearWall();
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() { if (!st) return; if (st.phase === 'meet' && !wall().length && !st.touched) { st.demo = !!scr.get().demoShow; newSpot(); } render(); }

  WU.views.names = {
    title: 'Name Wall',
    teacher: function () {
      if (!st) return null;
      var cards = wall(), sec = [], info = [], factsTxt = function (c) {
        return c.facts.map(function (f) { var p = WU.PICS[f.pic]; return [f.text, p ? p.name : f.pic ? '(your picture)' : ''].filter(Boolean).join(' / '); }).join(';  ');
      };
      if (st.phase === 'remember') {
        var hl = cards.filter(function (c) { return c.id === st.hl; })[0];
        if (hl) sec.push({ label: 'Highlighted card', text: hl.name, big: true, hot: true }, { label: 'Facts', text: factsTxt(hl) }, { label: 'Answering', text: st.asker || '' });
      } else if (st.phase === 'meet') info.push({ label: 'Spotlight', text: st.spot.name || '(point to a student)' });
      info.push({ label: 'On the wall (' + cards.length + ')' + (st.phase === 'remember' ? ', ' + Object.keys(st.flipped).length + ' flipped' : ''), text: cards.length ? '' : 'nobody yet' });
      cards.forEach(function (c) { info.push({ label: '', text: (st.flipped[c.id] || st.phase === 'meet' ? '' : '(face-down) ') + c.name + ': ' + factsTxt(c) }); });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['Enter', 'type the name / next field'], ['Space', 'next student (meet) / flip (remember)'], ['R', 'start the remember round'], ['X', 'wrong: the class helps'],
        ['N', 'another card'], ['A', 'back to meet: add people'], ['Delete', 'clear the wall (this device)'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'meet', spot: null, flipped: {}, hl: null, asker: '', wrong: false, demo: !!scr.get().demoShow && !wall().length };
      el.innerHTML = '<div class="namesg"><div class="layer"></div>' + kit.header('Name Wall') + '<div class="hints"></div></div>';
      box = el.querySelector('.namesg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('names-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newSpot(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) { var n = box.querySelector('.nwname'); if (n) kit.fit(n, 120, 56); } });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    // Typing on the Teacher screen goes into the field that is active on the board.
    grabKey: function (e) {
      if (!e.forwarded || !st || st.phase !== 'meet' || WU.overlay) return false;
      var a = document.activeElement; if (!a || !a.classList || !a.classList.contains('nw-in')) return false;
      if (e.key === 'Enter') { advance(a); return true; }
      if (e.key === 'Escape') { a.blur(); return true; }
      if (e.key === 'Tab') { var f = a.getAttribute('data-f'); focusField(f === 'name' ? 0 : 'name'); return true; }
      if (e.key === 'Backspace') { a.value = a.value.slice(0, -1); setField(a); return true; }
      if (e.key.length === 1) { if (a.value.length < (+a.getAttribute('maxlength') || 40)) a.value += e.key; setField(a); return true; }
      return false;
    },
    onKey: function (e) {
      st.touched = true;
      // A focused form button (Picture, Add): Enter / Space press it, nothing else.
      var fa = document.activeElement;
      if (fa && fa.closest && fa.closest('.nwform') && (e.key === 'Enter' || e.code === 'Space')) return true;
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      if (e.key === 'Delete') { keyAction('DEL'); return true; }
      var map = { r: 'R', a: 'A', x: 'X', n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
