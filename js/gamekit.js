/* Warm Up: shared game kit. Every game uses these so it looks and behaves the same, and so that
   everything students read goes through the edit layer (see DEVELOPERS.md). */
(function () {
  'use strict';
  var WU = window.WU;
  var kit = WU.kit = {};

  // Top bar (a control, not content).
  kit.header = function (title) {
    var L = WU.LEVELS[WU.state.level];
    return '<div class="gh" data-ctrl><div class="logo small" data-act="home" title="Home (Esc)"><span>WARM UP!</span></div><span class="title">/ ' + WU.esc(title) + '</span><div style="flex:1"></div>' +
      '<div class="lvchip">' + L.name + '<span>' + L.code + '</span></div>' +
      (WU.state.teams ? '<div class="tbtn" data-h="scores">Scores</div>' : '') +
      '<div class="ibtn" data-act="teacher" title="Teacher screen for your laptop (V)">' + WU.icons.teacher + '</div>' +
      '<div class="ibtn" data-act="edit" title="Edit mode (E)">' + WU.icons.pencil + '</div>' +
      '<div class="ibtn" data-act="mute">' + WU.icons.sound() + '</div><div class="ibtn" data-act="full">' + WU.icons.full + '</div>' +
      '<div class="ibtn" data-act="help">' + WU.icons.help + '</div></div>';
  };
  // Key hints at the bottom (controls). list: [[key, label], ...]; onPress(key) for touch.
  kit.hints = function (root, list, onPress) {
    var el = root.querySelector('.hints'); if (!el) return;
    el.setAttribute('data-ctrl', '');
    el.innerHTML = list.map(function (x) { return '<div class="hint" data-k="' + x[0] + '"><span class="k">' + x[0] + '</span><span class="l">' + x[1] + '</span></div>'; }).join('');
    el.querySelectorAll('.hint').forEach(function (b) { b.onclick = function () { onPress(b.getAttribute('data-k')); }; });
  };
  // A sentence frame box: "I like ___." with drawn gaps. attr = data-edit attribute string.
  kit.frame = function (f, attr, cls) {
    if (!f) return '';
    // A gap stays on the same line as the letters stuck to it ("___ing?").
    return '<div class="frame ' + (cls || '') + '"' + (attr || '') + '>' + WU.esc(f).replace(/(\S*)___(\S*)/g, '<span style="white-space:nowrap">$1<span class="gap"></span>$2</span>') + '</div>';
  };
  // Replace {name}, {category}... in editable texts.
  kit.fill = function (t, vars) {
    return String(t || '').replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; });
  };
  kit.chip = function (text, attr, bg) { return text ? '<div class="chip-label"' + (attr || '') + ' style="background:' + (bg || '#ff4fc3') + '">' + WU.esc(text) + '</div>' : ''; };

  /* ---------- per-level "Screen text & timing" record ----------
     cfg: { game, title, content: { shared: {id, ...}, levels: [ {...}, x7 ] }, fields: [...] }
     returns { get(level), ea(field) } */
  kit.screen = function (cfg) {
    function defaults(l) {
      var S = cfg.content(), o = {};
      Object.keys(S.shared).forEach(function (k) { o[k] = S.shared[k]; });
      Object.keys(S.levels[l] || {}).forEach(function (k) { o[k] = S.levels[l][k]; });
      return [o];
    }
    var id = cfg.content().shared.id;
    WU.registerList(cfg.game, 'screen', {
      gameTitle: cfg.title, label: 'Screen text & timing', single: true, defaults: defaults,
      norm: function (r) { var o = {}; Object.keys(r).forEach(function (k) { if (k !== 'id') o[k] = r[k]; }); return o; },
      title: function () { return 'Everything on screen apart from the lists'; },
      fields: function () { return cfg.fields; }
    });
    return {
      get: function (l) { return WU.list(cfg.game, 'screen', l == null ? WU.state.level : l)[0] || defaults(0)[0]; },
      ea: function (f) { return WU.editAttr(cfg.game, 'screen', id, f); }
    };
  };

  // Shared field sets.
  kit.ARTICLES = [['a', 'a'], ['an', 'an'], ['the', 'the'], ['', '(none)']];
  kit.demoFields = [
    { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 },
    { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
  ];
  kit.ruleFields = [
    { k: 'rule', label: 'Rule line', type: 'text', max: 90 },
    { k: 'ruleShow', label: 'Rule line', type: 'bool' }
  ];

  // A word card (word + article + plural + picture). Library pictures bring their own word and article.
  kit.normWord = function (r) {
    var o = { text: r.word || r.text || '', art: r.art, pl: r.pl || '', pic: r.pic || '' };
    var p = WU.PICS[o.pic];
    if (!o.text && p) o.text = p.name;
    if (o.art === undefined) o.art = p && p.name === o.text ? p.art : '';
    if (!o.pl && p && p.name === o.text && p.pl !== WU.guessPlural(p.name)) o.pl = p.pl;
    return o;
  };
  kit.wordPhrase = function (it, form) { return WU.phrase({ w: it.text, art: it.art, pl: it.pl }, form); };

  // Student picked without the overlay (for reels and follow-up questions). Avoids names in "not".
  kit.student = function (not) {
    var names = WU.roster(), n = WU.nextStudent(), tries = 0;
    while (not && not.indexOf(n) >= 0 && names.length > (not.length) && tries++ < 20) n = WU.nextStudent();
    return n;
  };

  // Shrink text until it fits its box (measured, so any edited text fits). Never below min.
  kit.fit = function (el, max, min) {
    if (!el) return;
    // Fonts still loading: fit again as soon as they are ready (the bundled font is wider than the fallback).
    if (document.fonts && document.fonts.status !== 'loaded' && !el._wuFitWait) {
      el._wuFitWait = true;
      document.fonts.ready.then(function () { if (el.isConnected) kit.fit(el, max, min); });
    }
    if (!el._wuFit) { el._wuFit = [max, min]; if (fitted.length > 300) fitted = fitted.filter(function (x) { return x.isConnected; }); fitted.push(el); }
    var fs = max; el.style.fontSize = fs + 'px';
    while (fs > min && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) { fs -= 4; el.style.fontSize = fs + 'px'; }
  };
  // Any font that finishes loading later: fit every fitted text on screen again.
  var fitted = [];
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', function () {
    fitted = fitted.filter(function (el) { return el.isConnected; });
    fitted.forEach(function (el) { kit.fit(el, el._wuFit[0], el._wuFit[1]); });
  });
  /* ---------- content rotation (WU.shown) ----------
     A log, per group, of which item each game showed, in localStorage ('shown'):
       { groupKey: { name, at, z, lists: { 'game:list:level': { s, h: { id: [ms last shown, times shown] } } } }, _z }
     s = when the list's current round started (items shown since then are "seen this round"); z / _z = when the group /
     every group was cleared. Only times, so two devices merge without losing anything (newest wins; js/sync.js syncs it).
     The group is the one on the timetable now (content/groups.js), else the class chosen in Settings. On a phone: the phone.
     No group (testing at home): nothing is logged and decks only avoid repeats until the page reloads. */
  var SHOWN = 'shown';
  function norm(rec) { // the first version kept a list of ids for the round and minutes
    if (!rec.c) return rec;
    var h = {}, s = Infinity;
    Object.keys(rec.h || {}).forEach(function (id) { h[id] = [rec.h[id][0] * 6e4, rec.h[id][1]]; });
    rec.c.forEach(function (id) { if (h[id]) s = Math.min(s, h[id][0]); });
    return { s: s === Infinity ? 0 : s, h: h };
  }
  WU.shown = {
    // { key, name } of the group in the room now, or null.
    group: function () {
      if (WU.phone) return { key: 'phone', name: 'This phone' };
      var g = WU.theme && WU.theme.group ? WU.theme.group() : null;
      if (g) return { key: 'g:' + g.id, name: g.name };
      var c = WU.activeClass && WU.activeClass();
      return c ? { key: 'c:' + c.id, name: c.name } : null;
    },
    all: function () { var d = WU.store.get(SHOWN, {}); return d && typeof d === 'object' ? d : {}; },
    // The groups with something logged: [{ key, name, at, lists: { src: { s, h } } }].
    groups: function () {
      var all = WU.shown.all();
      return Object.keys(all).filter(function (k) { return k.charAt(0) !== '_' && Object.keys(all[k].lists || {}).length; })
        .map(function (k) {
          var g = all[k], lists = {};
          Object.keys(g.lists).forEach(function (src) { lists[src] = norm(g.lists[src]); });
          return { key: k, name: g.name, at: g.at, lists: lists };
        });
    },
    // Pick from list for the group in the room: items it has not seen this round first; a new round starts when it
    // has seen them all, and the last few of the old round wait so they do not come straight back.
    pick: function (list, src) {
      var g = WU.shown.group(); if (!g || !src || !list.length) return null;
      var now = Date.now(), all = WU.shown.all(), grp = all[g.key] = all[g.key] || { name: g.name, lists: {} };
      grp.name = g.name; grp.lists = grp.lists || {};
      var rec = grp.lists[src] = norm(grp.lists[src] || { s: 0, h: {} });
      var t = function (x) { return rec.h[x.id] ? rec.h[x.id][0] : 0; };
      var pool = list.filter(function (x) { return t(x) < rec.s || !t(x); });
      if (!pool.length) {
        var hold = list.slice().sort(function (x, y) { return t(y) - t(x); }).slice(0, Math.min(3, Math.floor(list.length / 2)));
        rec.s = now;
        pool = list.filter(function (x) { return hold.indexOf(x) < 0; });
        if (!pool.length) pool = list.slice();
      }
      var it = WU.pick(pool), h = rec.h[it.id] || [0, 0];
      rec.h[it.id] = [Math.max(now, rec.s), h[1] + 1];
      grp.at = now;
      WU.store.set(SHOWN, all);
      WU.emit('shown');
      return it;
    },
    clear: function (key) {
      var all = WU.shown.all(), now = Date.now();
      if (key) { if (all[key]) all[key] = { name: all[key].name, z: now, lists: {} }; }
      else all = { _z: now };
      WU.store.set(SHOWN, all); WU.emit('shown');
    },
    // Two logs into one (used by sync): newest time wins, clears remove what was shown before them.
    merge: function (a, b) {
      a = a || {}; b = b || {};
      var out = {}, Z = Math.max(a._z || 0, b._z || 0);
      if (Z) out._z = Z;
      Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
        if (k.charAt(0) === '_' || out[k]) return;
        var A = a[k] || {}, B = b[k] || {}, z = Math.max(A.z || 0, B.z || 0, Z), newer = (B.at || 0) > (A.at || 0) ? B : A;
        var g = { name: newer.name || A.name || B.name, at: Math.max(A.at || 0, B.at || 0), lists: {} };
        if (A.z || B.z) g.z = Math.max(A.z || 0, B.z || 0);
        var LA = A.lists || {}, LB = B.lists || {};
        Object.keys(LA).concat(Object.keys(LB)).forEach(function (src) {
          if (g.lists[src]) return;
          var ra = norm(LA[src] || { s: 0, h: {} }), rb = norm(LB[src] || { s: 0, h: {} }), r = { s: Math.max(ra.s || 0, rb.s || 0), h: {} };
          Object.keys(ra.h).concat(Object.keys(rb.h)).forEach(function (id) {
            var x = ra.h[id] || [0, 0], y = rb.h[id] || [0, 0], ts = Math.max(x[0], y[0]);
            if (ts > z) r.h[id] = [ts, Math.max(x[1], y[1])];
          });
          if (Object.keys(r.h).length) g.lists[src] = r;
        });
        if (g.at > z || g.z) { if (g.at <= z) g.at = 0; out[k] = g; }
      });
      return out;
    }
  };

  // A shuffled deck: draws every item once before repeating. Items from WU.list rotate per group across lessons (WU.shown).
  kit.deck = function () {
    var left = [], sig = '';
    return function (list) {
      var src = list.length && list[0]._src, hit = src ? WU.shown.pick(list, src) : null;
      if (hit) return hit;
      var s = list.map(function (x) { return x.id; }).join('|');
      if (s !== sig) { sig = s; left = []; }
      if (!left.length) left = WU.shuffle(list.slice());
      return left.pop();
    };
  };

  // n different items from a deck (dice faces, the things in a room, the words in a puzzle). Fewer if the list is shorter.
  kit.drawN = function (deck, list, n) {
    var out = [], ids = {}, tries = 0;
    n = Math.min(n, list.length);
    while (out.length < n && tries++ < n * 6) { var it = deck(list); if (it && !ids[it.id]) { ids[it.id] = 1; out.push(it); } }
    if (out.length < n) WU.shuffle(list.filter(function (x) { return !ids[x.id]; })).slice(0, n - out.length).forEach(function (x) { out.push(x); });
    return out;
  };

  // The classroom seen from above (moving games): the board at the top, desks in a U, the open middle in between.
  // board = editable "BOARD" label (text + data-edit attribute), inner = what stands in the middle (zones, a line...).
  kit.roomMap = function (board, boardAttr, inner, cls) {
    return '<div class="rmap ' + (cls || '') + '"><div class="rboard"' + (boardAttr || '') + '>' + WU.esc(board || '') + '</div>' +
      '<div class="rdesk l"></div><div class="rdesk r"></div><div class="rdesk b"></div><div class="rmid">' + inner + '</div></div>';
  };

  // Team turns: which team asks next. Returns null when teams are off.
  kit.turns = function () {
    var i = 0;
    return {
      on: function () { return WU.state.teams > 0; },
      cur: function () { return WU.state.teams ? i % WU.state.teams : null; },
      name: function () { return WU.state.teams ? (WU.state.teamNames[i % WU.state.teams] || 'TEAM ' + (i % WU.state.teams + 1)) : ''; },
      color: function () { return WU.TEAM_COLORS[WU.state.teamColors[i % WU.state.teams]] || '#fff'; },
      next: function () { i++; },
      reset: function () { i = 0; }
    };
  };
})();
