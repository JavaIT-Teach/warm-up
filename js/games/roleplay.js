/* Warm Up: ROLE PLAY (all levels). Groups act one scene at the same time; every member plays a different role.
   The board shows the scene, the roles (what each one wants) and useful phrases. Steps, each with Space:
   READY (groups of {n}) → PREP (who plays who + read your role, timer) → SECRETS (from Intermediate: Role 1 looks, the others close
   their eyes; then Role 2...) → ACTION (timer; a TWIST pops up halfway) → FREEZE (debrief) → P = SPOTLIGHT: one group shows the class.
   The scene follows the level: Beginner orders in a café, IELTS 3 runs an ethics panel. Scenes rotate per group (kit.deck).
   Keys: Space next step, N other scene, W twist now, X end the scene, P spotlight a group, Enter pause, Esc home.
   Content: content/roleplay.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var COLORS = ['#c6ff00', '#ff4fc3', '#3d6bff', '#ffe600'], INKS = ['#0d0d0d', '#0d0d0d', '#fff', '#0d0d0d'];

  var scr = kit.screen({
    game: 'roleplay', title: 'Role Play', content: function () { return WU.content.roleplayScreen; },
    fields: [
      { type: 'head', label: 'Before the scene' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'roleLabel', label: 'Role number label ({k} = number)', type: 'text', max: 16 },
      { k: 'goalLabel', label: 'Label above each goal', type: 'text', max: 24 },
      { k: 'groups', label: 'Group size line ({n} per group, {g} groups)', type: 'text', max: 60 },
      { k: 'extra', label: 'Extra people line (empty = hide)', type: 'text', max: 70 },
      { k: 'demo', label: 'Teacher demo banner (first scene only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo scene', type: 'bool', on: 'On', off: 'Off', hint: 'You play Role 1 with one group first.' },
      { type: 'head', label: 'Preparation' },
      { k: 'castTitle', label: 'Casting title', type: 'text', max: 24 },
      { k: 'cast', label: 'Casting line ({rule} = who plays Role 1)', type: 'text', max: 80 }, { k: 'castShow', label: 'Casting line', type: 'bool' },
      { k: 'prepSecs', label: 'Preparation time (seconds)', type: 'num', min: 15, max: 300 },
      { k: 'prepLabel', label: 'During preparation', type: 'text', max: 60 },
      { k: 'ready', label: 'When preparation time is up', type: 'text', max: 30 },
      { k: 'phrasesLabel', label: 'Label on the phrases', type: 'text', max: 24 }, { k: 'phrasesShow', label: 'Useful phrases', type: 'bool' },
      { type: 'head', label: 'Secrets (Role 1 looks, the others close their eyes)' },
      { k: 'secretsShow', label: 'Secret round', type: 'bool', on: 'On', off: 'Off', hint: 'Only scenes with secrets. Off below Intermediate.' },
      { k: 'secretSecs', label: 'Seconds per secret', type: 'num', min: 3, max: 30 },
      { k: 'secretTitle', label: 'Secret title ({k} = role number)', type: 'text', max: 24 },
      { k: 'secretEyes', label: 'Eyes closed line', type: 'text', max: 50 },
      { k: 'secretLabel', label: 'Label on the secret', type: 'text', max: 24 },
      { k: 'secretDone', label: 'After the secrets', type: 'text', max: 60 },
      { type: 'head', label: 'The scene' },
      { k: 'playSecs', label: 'Acting time (seconds)', type: 'num', min: 30, max: 600 },
      { k: 'play', label: 'During the scene', type: 'text', max: 50 },
      { k: 'twistShow', label: 'Twist', type: 'bool', on: 'On', off: 'Off' },
      { k: 'twistAt', label: 'Twist after (% of the acting time)', type: 'num', min: 10, max: 90 },
      { k: 'twistLabel', label: 'Twist label', type: 'text', max: 16 },
      { type: 'head', label: 'After the scene' },
      { k: 'end', label: 'Time up', type: 'text', max: 20 },
      { k: 'debrief', label: 'Debrief question', type: 'text', max: 90 }, { k: 'debriefShow', label: 'Debrief question', type: 'bool' },
      { k: 'spotTitle', label: 'Spotlight title ({k} = group number)', type: 'text', max: 20 },
      { k: 'spot', label: 'Spotlight line', type: 'text', max: 50 },
      { k: 'spotSecs', label: 'Spotlight time (seconds)', type: 'num', min: 15, max: 300 }
    ]
  });
  var sceneFields = [{ k: 'title', label: 'Scene title', type: 'text', max: 32 }, { k: 'setting', label: 'Where / what is happening', type: 'text', max: 110 }];
  [1, 2, 3, 4].forEach(function (i) {
    sceneFields.push({ type: 'head', label: 'Role ' + i + (i > 2 ? ' (empty = no role ' + i + ')' : '') },
      { k: 'r' + i, label: 'Role', type: 'text', max: 28 }, { k: 'g' + i, label: 'What this role wants', type: 'text', max: 80 },
      { k: 's' + i, label: 'Secret (empty = none)', type: 'text', max: 90 });
  });
  sceneFields.push({ type: 'head', label: 'Phrases and twist' });
  [1, 2, 3, 4].forEach(function (i) { sceneFields.push({ k: 'p' + i, label: 'Useful phrase ' + i + ' (___ = gap)', type: 'text', max: 48 }); });
  sceneFields.push({ k: 'twist', label: 'Twist (pops up during the scene)', type: 'text', max: 110 });
  WU.registerList('roleplay', 'scenes', {
    gameTitle: 'Role Play', label: 'Scenes',
    defaults: function (l) { return WU.content.roleplay[l].scenes; },
    norm: function (r) {
      var o = { title: r.title || '', setting: r.setting || '', twist: r.twist || '' };
      [1, 2, 3, 4].forEach(function (i) { ['r', 'g', 's', 'p'].forEach(function (f) { o[f + i] = r[f + i] || ''; }); });
      return o;
    },
    title: function (it) { return it.title || '(no title)'; },
    fields: function () { return sceneFields; },
    blank: function () { return { title: 'New scene', setting: '', r1: 'Role 1', g1: '', r2: 'Role 2', g2: '', r3: 'Role 3', g3: '', twist: '' }; }
  });
  WU.registerList('roleplay', 'cast', {
    gameTitle: 'Role Play', label: 'Who plays Role 1',
    defaults: function (l) { return WU.content.roleplay[l].cast; },
    norm: function (r) { return { text: r.text || '' }; },
    fields: function () { return [{ k: 'text', label: 'Role 1 is...', type: 'text', max: 60 }]; },
    blank: function () { return { text: 'the person with the biggest bag' }; }
  });

  // The roles of a scene that have a name: [{ i (1-4), name, goal, secret }].
  function rolesOf(it) {
    var out = []; if (!it) return out;
    [1, 2, 3, 4].forEach(function (i) { if (String(it['r' + i] || '').trim()) out.push({ i: i, name: it['r' + i], goal: it['g' + i], secret: it['s' + i] }); });
    return out;
  }
  function phrasesOf(it) { return it ? [1, 2, 3, 4].map(function (i) { return { i: i, text: it['p' + i] }; }).filter(function (p) { return String(p.text || '').trim(); }) : []; }
  WU.engines = WU.engines || {};
  WU.engines.roleplay = { roles: rolesOf, phrases: phrasesOf, COLORS: COLORS, INKS: INKS };

  var root, box, st, clock = null, offContent = null, timers = [], twistIv = null;
  var deck = kit.deck(), castDeck = kit.deck();

  function scene() { return WU.list('roleplay', 'scenes', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function rule() { return WU.list('roleplay', 'cast', WU.state.level).filter(function (x) { return x.id === st.castId; })[0] || null; }
  function newScene() {
    var it = deck(WU.list('roleplay', 'scenes', WU.state.level).filter(function (x) { return rolesOf(x).length >= 2; }));
    st.id = it ? it.id : null;
    var c = castDeck(WU.list('roleplay', 'cast', WU.state.level).filter(function (x) { return x.text; }));
    st.castId = c ? c.id : null;
  }
  function num(v, lo, hi, d) { v = +v || d; return Math.max(lo, Math.min(hi, v)); }
  function ea(it, f) { return WU.editAttr('roleplay', 'scenes', it.id, f); }
  function clearT() { timers.forEach(clearTimeout); timers = []; if (twistIv) clearInterval(twistIv); twistIv = null; }
  function killClock() { if (clock) clock.destroy(); clock = null; }
  function groupInfo(n) { var s = WU.roster().length || WU.state.students || 12; return { n: n, g: Math.max(1, Math.floor(s / n)) }; }
  function secretRoles() { return rolesOf(scene()).filter(function (r) { return String(r.secret || '').trim(); }); }

  /* ---------- drawing ---------- */
  function rolesHTML(S, it) {
    return '<div class="rp-roles">' + rolesOf(it).map(function (r, k) {
      return '<div class="rp-role" style="background:' + COLORS[k] + ';color:' + INKS[k] + '">' +
        '<div class="rp-num"' + scr.ea('roleLabel') + '>' + WU.esc(kit.fill(S.roleLabel, { k: k + 1 })) + '</div>' +
        '<div class="rp-name"' + ea(it, 'r' + r.i) + '>' + WU.esc(r.name) + '</div>' +
        (r.goal ? '<div class="rp-glab"' + scr.ea('goalLabel') + '>' + WU.esc(S.goalLabel) + '</div><div class="rp-goal"' + ea(it, 'g' + r.i) + '>' + WU.esc(r.goal) + '</div>' : '') +
        '</div>';
    }).join('') + '</div>';
  }
  function phrasesHTML(S, it) {
    var ps = phrasesOf(it); if (!S.phrasesShow || !ps.length) return '';
    return '<div class="rp-phr">' + kit.chip(S.phrasesLabel, scr.ea('phrasesLabel'), '#00e5c7') + ps.map(function (p) {
      return '<span class="rp-p"' + ea(it, 'p' + p.i) + '>' + WU.esc(p.text).replace(/___/g, '<span class="gap"></span>') + '</span>';
    }).join('') + '</div>';
  }
  function castHTML(S) {
    var r = rule(); if (!S.castShow || !S.cast || !r) return '';
    var parts = String(S.cast).split('{rule}');
    return '<div class="rp-cast">' + kit.chip(S.castTitle, scr.ea('castTitle'), '#ff5a1f') +
      '<span' + scr.ea('cast') + '>' + WU.esc(parts[0]) + (parts.length > 1 ? '<b' + WU.editAttr('roleplay', 'cast', r.id, 'text') + '>' + WU.esc(r.text) + '</b>' + WU.esc(parts.slice(1).join('')) : '') + '</span></div>';
  }
  function render() {
    var S = scr.get(), it = scene(), ph = st.phase, h = '';
    if (!it) {
      box.querySelector('.layer').innerHTML = '<div class="rp-top"><div class="rp-title" data-ctrl>No scenes at this level. Add some in Edit mode (E).</div></div>';
      renderHints(); return;
    }
    if (ph === 'secret') { renderSecret(S, it); return; }
    h += '<div class="rp-top"><div class="rp-trow">' + kit.chip(S.tag, scr.ea('tag'), '#ff4fc3') +
      '<div class="rp-title"' + ea(it, 'title') + '>' + WU.esc(it.title) + '</div>' +
      (st.demo && S.demo && ph === 'ready' ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>' +
      '<div class="rp-set"' + ea(it, 'setting') + '>' + WU.esc(it.setting) + '</div></div>';
    if (st.twisted && it.twist) h += '<div class="rp-twist' + (st.twistNew ? ' new' : '') + '"><span class="rp-tl"' + scr.ea('twistLabel') + '>' + WU.esc(S.twistLabel) + '</span>' +
      '<span class="rp-tt"' + ea(it, 'twist') + '>' + WU.esc(it.twist) + '</span></div>';
    h += rolesHTML(S, it);
    h += '<div class="rp-bot"><div class="rp-info">';
    var gi = groupInfo(rolesOf(it).length);
    if (ph === 'ready') {
      h += '<div class="brow"><div class="pstat"' + scr.ea('groups') + '>' + WU.esc(kit.fill(S.groups, gi)) + '</div>' +
        '<div class="btn sm" data-ctrl data-b="SPACE"><span class="key">SPACE</span><span>Start</span></div></div>' +
        (S.extra ? '<div class="rule"' + scr.ea('extra') + '>' + WU.esc(S.extra) + '</div>' : '');
    } else if (ph === 'prep') {
      h += castHTML(S);
      if (st.prepDone) h += '<div class="bigmsg sm"' + scr.ea('ready') + '>' + WU.esc(S.ready) + '</div>';
      else h += '<div class="rule"' + scr.ea('prepLabel') + '>' + WU.esc(S.prepLabel) + '</div>';
      h += phrasesHTML(S, it);
    } else if (ph === 'play') {
      h += '<div class="rule"' + scr.ea('play') + '>' + WU.esc(S.play) + '</div>' + phrasesHTML(S, it);
    } else if (ph === 'end') {
      h += '<div class="brow"><div class="bigmsg sm"' + scr.ea('end') + '>' + WU.esc(S.end) + '</div>' +
        '<div class="btn sm" data-ctrl data-b="P"><span class="key">P</span><span>Spotlight a group</span></div></div>' +
        (S.debriefShow && S.debrief ? '<div class="rp-q"' + scr.ea('debrief') + '>' + WU.esc(S.debrief) + '</div>' : '');
    } else if (ph === 'spot') {
      h += '<div class="brow"><div class="pname"' + scr.ea('spotTitle') + '>' + WU.esc(kit.fill(S.spotTitle, { k: st.group })) + '</div>' +
        '<div class="pbig"' + scr.ea('spot') + '>' + WU.esc(S.spot) + '</div></div>' +
        (S.debriefShow && S.debrief ? '<div class="rp-q"' + scr.ea('debrief') + '>' + WU.esc(S.debrief) + '</div>' : '');
    }
    h += '</div><div class="rp-tslot"></div></div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph !== 'ready' && ph !== 'end') box.querySelector('.rp-tslot').appendChild(clock.el);
    box.querySelectorAll('.rp-goal').forEach(function (el) { kit.fit(el, 34, 22); });
    box.querySelectorAll('.rp-name').forEach(function (el) { kit.fit(el, 52, 30); });
    kit.fit(box.querySelector('.rp-title'), 76, 44);
    kit.fit(box.querySelector('.rp-tt'), 48, 28);
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); keyAction(b.getAttribute('data-b')); }; });
    renderHints();
  }
  // Secret round: the whole board in the role's colour. Role k reads, everyone else has eyes closed.
  function renderSecret(S, it) {
    var list = secretRoles(), h;
    if (st.sIdx >= list.length) {
      h = '<div class="rp-sec done"><div class="bigmsg"' + scr.ea('secretDone') + '>' + WU.esc(S.secretDone) + '</div>' +
        '<div class="btn sm" data-ctrl data-b="SPACE"><span class="key">SPACE</span><span>Action!</span></div></div>';
    } else {
      var r = list[st.sIdx], k = 0;
      rolesOf(it).forEach(function (x, j) { if (x.i === r.i) k = j; });
      h = '<div class="rp-sec" style="background:' + COLORS[k] + ';color:' + INKS[k] + '">' +
        '<div class="rp-stitle"' + scr.ea('secretTitle') + '>' + WU.esc(kit.fill(S.secretTitle, { k: k + 1 })) + '</div>' +
        '<div class="rp-sname"' + ea(it, 'r' + r.i) + '>' + WU.esc(r.name) + '</div>' +
        '<div class="rp-eyes"' + scr.ea('secretEyes') + '>' + WU.esc(S.secretEyes) + '</div>' +
        '<div class="rp-scard"><div class="ptag"' + scr.ea('secretLabel') + '>' + WU.esc(S.secretLabel) + '</div>' +
        '<div class="rp-stext"' + ea(it, 's' + r.i) + '>' + WU.esc(r.secret) + '</div></div>' +
        '<div class="rp-sbar"><i style="animation-duration:' + num(S.secretSecs, 3, 30, 7) + 's"></i></div></div>';
    }
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.rp-stext'), 84, 44);
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); keyAction(b.getAttribute('data-b')); }; });
    renderHints();
  }
  function renderHints() {
    var ph = st.phase, hs;
    if (ph === 'ready') hs = [['SPACE', 'start'], ['N', 'other scene'], ['Esc', 'home']];
    else if (ph === 'prep') hs = [['SPACE', st.prepDone ? 'action!' : 'skip to action'], ['ENTER', 'pause / go'], ['N', 'other scene'], ['Esc', 'home']];
    else if (ph === 'secret') hs = [['SPACE', 'next'], ['Esc', 'home']];
    else if (ph === 'play') hs = [['W', 'twist now'], ['X', 'end the scene'], ['ENTER', 'pause / go'], ['Esc', 'home']];
    else if (ph === 'end') hs = [['P', 'spotlight a group'], ['SPACE', 'next scene'], ['Esc', 'home']];
    else hs = [['P', 'another group'], ['ENTER', 'pause / go'], ['SPACE', 'next scene'], ['Esc', 'home']];
    kit.hints(root, hs, function (k) { keyAction(k); });
  }

  /* ---------- steps ---------- */
  function startClock(secs, onDone) { killClock(); clock = WU.Timer({ seconds: secs, size: 250, onDone: onDone }); clock.start(); }
  function prep() {
    var S = scr.get();
    WU.sound.unlock(); st.phase = 'prep'; st.prepDone = false; st.scenes++;
    startClock(num(S.prepSecs, 15, 300, 60), function () { if (st && st.phase === 'prep') { st.prepDone = true; WU.sound.ding(); render(); } });
    WU.sound.slam(); render();
  }
  function afterPrep() {
    var S = scr.get(); killClock();
    if (S.secretsShow && secretRoles().length) { st.phase = 'secret'; st.sIdx = 0; secretStep(); }
    else play();
  }
  function secretStep() {
    clearT();
    var S = scr.get(), list = secretRoles();
    WU.sound.clack(); render();
    if (st.sIdx < list.length) timers.push(setTimeout(function () { if (st && st.phase === 'secret') { st.sIdx++; secretStep(); } }, num(S.secretSecs, 3, 30, 7) * 1000));
    else WU.sound.ding();
  }
  function play() {
    var S = scr.get(), secs = num(S.playSecs, 30, 600, 180), it = scene();
    clearT(); st.phase = 'play'; st.twisted = false; st.twistNew = false;
    startClock(secs, function () { if (st && st.phase === 'play') end(); });
    if (S.twistShow && it && it.twist) {
      var at = secs * 1000 * (1 - num(S.twistAt, 10, 90, 50) / 100); // milliseconds left when the twist comes
      twistIv = setInterval(function () { if (st && st.phase === 'play' && !st.twisted && clock && clock.left() <= at) twist(); }, 200);
    }
    WU.sound.slam(); render();
  }
  function twist() {
    var it = scene();
    if (st.phase !== 'play' || st.twisted || !it || !it.twist) return;
    st.twisted = true; st.twistNew = true; WU.sound.buzzer(); render();
    timers.push(setTimeout(function () { if (st && st.twistNew) { st.twistNew = false; } }, 1200));
  }
  function end() { clearT(); killClock(); st.phase = 'end'; WU.sound.slam(); render(); }
  function spotlight() {
    if (st.phase !== 'end' && st.phase !== 'spot') return;
    var S = scr.get(), g = groupInfo(rolesOf(scene()).length).g, k;
    do { k = 1 + WU.rand(g); } while (g > 1 && k === st.group);
    st.group = k; st.phase = 'spot';
    startClock(num(S.spotSecs, 15, 300, 60), function () {});
    WU.sound.slam(); render();
  }
  function next() {
    clearT(); killClock();
    st.phase = 'ready'; st.demo = false; st.twisted = false; st.group = 0; newScene(); WU.sound.pop(); render();
  }
  function other() { clearT(); killClock(); st.phase = 'ready'; st.twisted = false; newScene(); WU.sound.clack(); render(); }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready' && !st.scenes) st.demo = !!scr.get().demoShow;
    if (!scene()) newScene();
    render();
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') {
      if (ph === 'ready') { if (scene()) prep(); }
      else if (ph === 'prep') afterPrep();
      else if (ph === 'secret') { var n = secretRoles().length; if (st.sIdx >= n) play(); else { st.sIdx++; secretStep(); } }
      else if (ph === 'play') WU.toast('W = twist · X = end the scene');
      else next();
    }
    else if (k === 'N') { if (ph === 'ready' || ph === 'prep') other(); }
    else if (k === 'W') twist();
    else if (k === 'X') { if (ph === 'play') end(); }
    else if (k === 'P') spotlight();
    else if (k === 'ENTER') { if (clock && (ph === 'prep' || ph === 'play' || ph === 'spot')) clock.toggle(); }
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.roleplay = {
    title: 'Role Play',
    teacher: function () {
      if (!st) return null;
      var it = scene(), info = [], secret = [];
      if (!it) return { secret: [], info: [] };
      info.push({ label: 'Scene', text: it.title });
      info.push({ label: 'Roles', text: rolesOf(it).map(function (r, k) { return (k + 1) + '. ' + r.name; }).join(' · ') });
      var r = rule(); if (r) info.push({ label: 'Role 1', text: r.text });
      info.push({ label: 'Step', text: { ready: 'N other scene · Space start', prep: 'Groups read their roles. Space = action', secret: 'Secret round: one role looks at a time',
        play: 'Acting. W = twist now · X = end', end: 'Debrief. P = spotlight a group · Space = next scene', spot: 'Group ' + st.group + ' performs. P = another group' }[st.phase] });
      if (it.twist) secret.push({ label: st.twisted ? 'Twist (shown)' : 'Twist (coming: W = now)', text: it.twist, hot: !st.twisted });
      rolesOf(it).forEach(function (x, k) { if (x.secret) secret.push({ label: 'Secret · Role ' + (k + 1) + ' ' + x.name, text: x.secret }); });
      return { secret: secret, info: info };
    },
    help: function () {
      return [['Space', 'next step: prep → (secrets) → action → freeze → next scene'], ['N', 'another scene (before the action)'], ['W', 'twist now'],
        ['X', 'end the scene now'], ['P', 'spotlight: one group shows the class (again = another group)'], ['Enter', 'pause / go']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', id: null, castId: null, demo: !!scr.get().demoShow, scenes: 0, group: 0, sIdx: 0 };
      el.innerHTML = '<div class="rpg"><div class="layer"></div>' + kit.header('Role Play') + '<div class="hints"></div></div>';
      box = el.querySelector('.rpg');
      WU.wireCommon(el);
      newScene(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); killClock(); if (offContent) offContent(); root = box = st = null; },
    onKey: function (e) {
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { n: 'N', w: 'W', x: 'X', p: 'P' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
