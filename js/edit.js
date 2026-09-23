/* Warm Up: EDIT MODE, shared by every game.
   - Games register their content lists (WU.registerList) and read them through WU.list(game, list, level).
   - Built-in content stays in /content as the default. Every built-in item has a PERMANENT id there.
     Teacher edits are stored on top, per level, keyed by those ids (never by position), in
     localStorage "wu-edits": { _v: 2, "game:list:level": { mod: {id: {...}}, del: [id], add: [item] } }.
   - Uploaded images are resized and kept in IndexedDB (fallback: localStorage). Picture ids "u:..." point to them.
   - Edit mode (E or the pencil button) outlines everything editable. Click it, or Tab to it and press Enter.
   - Export / Import move all edits, images, classes and teams between devices as one .json file. */
(function () {
  'use strict';
  var WU = window.WU;

  /* ---------- uploaded images ---------- */
  WU.images = (function () {
    var map = {}, db = null;
    function useLocal() { db = null; map = WU.store.get('images', {}) || {}; }
    function store(mode) { return db.transaction('images', mode).objectStore('images'); }
    return {
      load: function () {
        return new Promise(function (done) {
          var finished = false, finish = function () { if (!finished) { finished = true; done(); } };
          setTimeout(function () { if (!finished) { useLocal(); finish(); } }, 2000);
          try {
            var r = indexedDB.open('warm-up', 1);
            r.onupgradeneeded = function () { r.result.createObjectStore('images'); };
            r.onerror = function () { useLocal(); finish(); };
            r.onsuccess = function () {
              db = r.result;
              var out = {}, c = store('readonly').openCursor();
              c.onsuccess = function () { var cur = c.result; if (cur) { out[cur.key] = cur.value; cur.continue(); } else { map = out; finish(); } };
              c.onerror = function () { useLocal(); finish(); };
            };
          } catch (e) { useLocal(); finish(); }
        });
      },
      get: function (id) { return map[id]; },
      all: function () { return map; },
      count: function () { return Object.keys(map).length; },
      put: function (id, data) {
        map[id] = data;
        try { if (db) store('readwrite').put(data, id); else WU.store.set('images', map); } catch (e) { WU.toast('Could not save the image: storage is full.'); }
      },
      clear: function () {
        map = {};
        try { if (db) store('readwrite').clear(); else WU.store.set('images', {}); } catch (e) {}
      }
    };
  })();

  // Resize an image file to max 480px (JPEG on white) so edits stay small, then store it. cb(id)
  WU.uploadImage = function (file, cb) {
    if (!file || !/^image\//.test(file.type)) { WU.toast('Please choose an image file.'); return; }
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, 480 / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
        var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        var id = 'u:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        WU.images.put(id, c.toDataURL('image/jpeg', 0.82)); cb(id);
      };
      img.onerror = function () { WU.toast('That image could not be opened.'); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };
  function chooseFile(cb) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
    inp.onchange = function () { if (inp.files && inp.files[0]) WU.uploadImage(inp.files[0], cb); inp.remove(); };
    document.body.appendChild(inp); inp.click();
  }

  /* ---------- content lists + edits on top ---------- */
  WU.lists = {};
  WU.registerList = function (game, list, def) {
    def.game = game; def.list = list; WU.lists[game + ':' + list] = def;
    // Guard: every built-in item needs a unique permanent id.
    for (var l = 0; l < WU.LEVELS.length; l++) {
      var seen = {};
      (def.defaults(l) || []).forEach(function (r) {
        if (!r || !r.id) console.error('Warm Up: ' + game + ':' + list + ' level ' + l + ' has an item with no id', r);
        else if (seen[r.id]) console.error('Warm Up: duplicate id "' + r.id + '" in ' + game + ':' + list);
        else seen[r.id] = 1;
      });
    }
  };
  var E = null, EV = 2;
  function edits() {
    if (!E) { E = WU.store.get('edits', {}) || {}; if (migrate(E)) WU.store.set('edits', E); }
    return E;
  }
  function isKey(k) { return k.charAt(0) !== '_'; }
  function builtIn(game, list, level, id) {
    var def = WU.lists[game + ':' + list];
    return !!def && (def.defaults(level) || []).some(function (r) { return r.id === id; });
  }
  // Version 1 edits pointed at built-in items by position ("d0", "d1"...). Convert them to permanent ids,
  // using the content order they were made against (unchanged when ids were introduced). Returns true if changed.
  // Safe to run again: permanent ids never look like "d12", so only old-style keys change.
  function migrate(data) {
    var changed = data._v !== EV;
    Object.keys(data).filter(isKey).forEach(function (k) {
      var p = k.split(':'), def = WU.lists[p[0] + ':' + p[1]], e = data[k];
      if (!def) return;
      var raws = def.defaults(+p[2]) || [], map = function (id) { var m = /^d(\d+)$/.exec(id); return m ? (raws[+m[1]] ? raws[+m[1]].id : null) : id; };
      var old = JSON.stringify(e);
      if (e.mod) { var mod = {}; Object.keys(e.mod).forEach(function (id) { var n = map(id); if (n) mod[n] = e.mod[id]; }); e.mod = mod; }
      if (e.del) e.del = e.del.map(map).filter(Boolean);
      if (JSON.stringify(e) !== old) changed = true;
    });
    data._v = EV; return changed;
  }
  function save() { WU.store.set('edits', E); WU.emit('content'); if (WU.sync) WU.sync.changed(); }
  // Devices without a sync token can view and play, but not change content.
  function canEdit() {
    if (!WU.sync || WU.sync.canEdit()) return true;
    WU.toast('View only. Add your GitHub token in Settings to save edits.'); return false;
  }
  function k3(game, list, level) { var d = WU.lists[game + ':' + list]; return game + ':' + list + ':' + (d && d.global ? 0 : level); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // The list a game should use: defaults, minus deleted, with changes, plus added items.
  WU.list = function (game, list, level) {
    var def = WU.lists[game + ':' + list]; if (!def) return [];
    var e = edits()[k3(game, list, level)] || {}, del = e.del || [], mod = e.mod || {}, out = [];
    (def.defaults(level) || []).forEach(function (raw) {
      var id = raw.id; if (del.indexOf(id) >= 0) return;
      var it = def.norm(raw); it.id = id;
      if (mod[id]) { Object.keys(mod[id]).forEach(function (f) { it[f] = mod[id][f]; }); it.edited = true; }
      out.push(it);
    });
    (e.add || []).forEach(function (a) { var it = clone(a); it.custom = true; out.push(it); });
    return out;
  };
  // One field of a single-record list (screen texts, app texts), with edits applied.
  WU.text = function (game, list, key, level) {
    var it = WU.list(game, list, level == null ? WU.state.level : level)[0];
    return it ? it[key] : '';
  };
  WU.listDeleted = function (game, list, level) {
    var def = WU.lists[game + ':' + list], e = edits()[k3(game, list, level)] || {}, raws = def.defaults(level) || [];
    return (e.del || []).map(function (id) {
      var raw = raws.filter(function (r) { return r.id === id; })[0]; if (!raw) return null;
      var it = def.norm(raw); it.id = id; return it;
    }).filter(Boolean);
  };
  WU.edits = {
    set: function (game, list, level, id, field, value) {
      if (!canEdit()) return;
      var k = k3(game, list, level), e = edits()[k] = edits()[k] || {};
      if (builtIn(game, list, level, id)) { e.mod = e.mod || {}; e.mod[id] = e.mod[id] || {}; e.mod[id][field] = value; }
      else (e.add || []).forEach(function (a) { if (a.id === id) a[field] = value; });
      save();
    },
    add: function (game, list, level, item) {
      if (!canEdit()) return null;
      var k = k3(game, list, level), e = edits()[k] = edits()[k] || {};
      item.id = 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      (e.add = e.add || []).push(item); save(); return item.id;
    },
    remove: function (game, list, level, id) {
      if (!canEdit()) return;
      var k = k3(game, list, level), e = edits()[k] = edits()[k] || {};
      if (builtIn(game, list, level, id)) { e.del = e.del || []; if (e.del.indexOf(id) < 0) e.del.push(id); if (e.mod) delete e.mod[id]; }
      else e.add = (e.add || []).filter(function (a) { return a.id !== id; });
      save();
    },
    restore: function (game, list, level, id) { if (!canEdit()) return; var e = edits()[k3(game, list, level)]; if (e && e.del) e.del = e.del.filter(function (x) { return x !== id; }); save(); },
    resetItem: function (game, list, level, id) { if (!canEdit()) return; var e = edits()[k3(game, list, level)]; if (e && e.mod) delete e.mod[id]; save(); },
    count: function (prefix) {
      var n = 0;
      Object.keys(edits()).filter(isKey).forEach(function (k) {
        if (prefix && k.indexOf(prefix + ':') !== 0) return;
        var e = E[k]; n += Object.keys(e.mod || {}).length + (e.del || []).length + (e.add || []).length;
      });
      return n;
    },
    reload: function () { E = null; },
    // Used by sync: the whole edits object, and replacing it with the merged version from GitHub.
    raw: function () { return JSON.parse(JSON.stringify(edits())); },
    replace: function (obj) { E = obj || {}; migrate(E); WU.store.set('edits', E); WU.emit('content'); }
  };

  /* ---------- export / import (one file for another device) ---------- */
  WU.exportData = function () {
    var s = WU.state, data = {
      app: 'warm-up', version: 2, exported: new Date().toISOString(),
      edits: edits(), images: WU.images.all(), conflicts: WU.sync ? WU.sync.conflicts() : [],
      classes: s.classes, students: s.students, teams: s.teams, teamNames: s.teamNames, teamColors: s.teamColors
    };
    var d = new Date(), name = 'warm-up-edits-' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '.json';
    var url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 1000);
    WU.toast('Saved ' + name);
  };
  WU.importData = function (done) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.style.display = 'none';
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; inp.remove(); if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        var d; try { d = JSON.parse(fr.result); } catch (e) { d = null; }
        if (!d || d.app !== 'warm-up') { WU.toast('That is not a Warm Up file.'); return; }
        // Files from older versions point at positions; convert them to permanent ids.
        E = d.edits || {}; migrate(E); WU.store.set('edits', E); if (WU.sync) WU.sync.changed();
        WU.images.clear(); Object.keys(d.images || {}).forEach(function (id) { WU.images.put(id, d.images[id]); });
        var patch = {};
        ['classes', 'students', 'teams', 'teamNames', 'teamColors'].forEach(function (k) { if (d[k] !== undefined) patch[k] = d[k]; });
        if (patch.classes && !patch.classes.some(function (c) { return c.id === WU.state.classId; })) patch.classId = '';
        WU.setState(patch); WU.emit('content');
        var n = WU.edits.count(), m = WU.images.count();
        WU.toast('Imported ' + n + (n === 1 ? ' edit' : ' edits') + ' and ' + m + (m === 1 ? ' image.' : ' images.'));
        if (done) done();
      };
      fr.readAsText(f);
    };
    document.body.appendChild(inp); inp.click();
  };

  /* ---------- edit mode ---------- */
  WU.editing = false;
  WU.icons.pencil = '<svg width="30" height="30" viewBox="0 0 28 28"><path d="M5 23l1.5-6L18 5.5l4.5 4.5L11 21.5z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"></path><path d="M15.5 8l4.5 4.5" stroke="currentColor" stroke-width="3"></path></svg>';
  function viewLists() {
    var g = WU.current;
    return Object.keys(WU.lists).map(function (k) { return WU.lists[k]; }).filter(function (d) { return g === 'home' || d.game === g || d.game === 'app'; });
  }
  function renderBar() {
    var st = document.getElementById('stage'), bar = document.getElementById('editbar');
    if (!WU.editing) { if (bar) bar.remove(); return; }
    if (!bar) { bar = document.createElement('div'); bar.id = 'editbar'; st.appendChild(bar); }
    var ls = viewLists(), L = WU.LEVELS[WU.state.level];
    bar.innerHTML = '<span class="eb-chip">EDIT MODE</span><span class="eb-lv">' + L.name + ' ' + L.code + '</span>' +
      (ls.length ? ls.map(function (d) { return '<span class="sbtn" tabindex="0" data-open="' + d.game + ':' + d.list + '">' + WU.esc((WU.current === 'home' ? d.gameTitle + ': ' : '') + d.label) + '</span>'; }).join('')
        : '<span class="eb-note">Nothing to edit on this screen.</span>') +
      '<span class="eb-note"></span><span style="flex:1"></span><span class="eb-sync" data-sync></span><span class="sbtn dark" tabindex="0" data-open="done">Done (E)</span>';
    showSync();
    bar.querySelectorAll('[data-open]').forEach(function (b) {
      b.onclick = function () {
        var v = b.getAttribute('data-open');
        if (v === 'done') { WU.toggleEdit(false); return; }
        var p = v.split(':'); WU.openEditor(p[0], p[1]);
      };
    });
  }
  // Small sync status, visible only in Edit mode.
  var SYNC_TEXT = { idle: '', loading: 'Loading...', pending: 'Not saved yet', saving: 'Saving...', saved: 'Saved', local: 'Saved on this device',
    offline: 'Offline: will save later', token: 'Token problem: not saved', error: 'Not saved: retrying', viewonly: 'View only (no token)' };
  function showSync() {
    var el = document.querySelector('#editbar [data-sync]'); if (!el || !WU.sync) return;
    var s = WU.sync.status(), dirty = WU.store.get('sync-dirty', false);
    if (s === 'viewonly' || (s === 'idle' && !WU.sync.hasToken())) s = 'viewonly';
    else if (s === 'idle') s = dirty ? 'pending' : 'saved';
    el.textContent = SYNC_TEXT[s] || s; el.className = 'eb-sync s-' + s;
    el.title = WU.sync.detail() || '';
  }
  WU.on('sync', showSync);

  function markEditables() {
    document.querySelectorAll('#screen [data-edit], .overlay.student [data-edit]').forEach(function (el) {
      if (WU.editing) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); }
      else { el.removeAttribute('tabindex'); el.removeAttribute('role'); }
    });
  }
  /* ---------- the rule: everything students read is editable ----------
     Every text or picture on a student-facing screen (#screen and student overlays such as the picker) must be
     inside one of:
       [data-edit]  editable content (opens the editor),
       [data-ctrl]  an app control: buttons, key hints, header, menus,
       [data-auto]  a value generated from editable content or settings (a timer count, a student name, a score).
     In Edit mode anything else is outlined red and counted in the edit bar, so a gap cannot go unnoticed.
     WU.auditEditable() returns the offending elements (used by the automated check too). */
  WU.auditEditable = function () {
    var roots = [document.getElementById('screen')].concat([].slice.call(document.querySelectorAll('.overlay.student')));
    var bad = [];
    function exempt(el) { return !!el.closest('[data-edit], [data-ctrl], [data-auto]'); }
    function shown(el) { var cs = getComputedStyle(el); return el.getClientRects().length && cs.visibility !== 'hidden' && cs.display !== 'none'; }
    roots.forEach(function (r) {
      if (!r) return;
      r.querySelectorAll('.not-editable').forEach(function (e) { e.classList.remove('not-editable'); });
      var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        var el = n.parentElement;
        if (!n.nodeValue.trim() || !el || el.closest('svg') || exempt(el) || !shown(el)) continue;
        if (bad.indexOf(el) < 0) bad.push(el);
      }
      r.querySelectorAll('.pic').forEach(function (el) { if (!exempt(el) && shown(el) && bad.indexOf(el) < 0) bad.push(el); });
    });
    return bad;
  };
  var auditT = null;
  function runAudit() {
    clearTimeout(auditT);
    auditT = setTimeout(function () {
      if (!WU.editing) return;
      var bad = WU.auditEditable(), bar = document.getElementById('editbar');
      bad.forEach(function (el) { el.classList.add('not-editable'); });
      if (bad.length) console.error('Warm Up: ' + bad.length + ' student-facing item(s) cannot be edited:', bad);
      var w = bar && bar.querySelector('.eb-warn');
      if (bar && !w) { w = document.createElement('span'); w.className = 'eb-warn'; bar.insertBefore(w, bar.querySelector('.eb-note')); }
      if (w) { w.textContent = bad.length ? bad.length + ' not editable (red)' : ''; w.style.display = bad.length ? '' : 'none'; }
    }, 150);
  }

  WU.toggleEdit = function (on) {
    WU.editing = on === undefined ? !WU.editing : !!on;
    document.body.classList.toggle('editing', WU.editing);
    renderBar(); markEditables(); runAudit();
    if (!WU.editing) document.querySelectorAll('.not-editable').forEach(function (e) { e.classList.remove('not-editable'); });
    document.querySelectorAll('[data-act="edit"]').forEach(function (b) { b.classList.toggle('on', WU.editing); });
    if (!WU.editing && document.activeElement && document.activeElement.blur) document.activeElement.blur();
  };
  function openFromEl(el) {
    var p = el.getAttribute('data-edit').split(':'); // game:list:id[:field]
    WU.openEditor(p[0], p[1], p[2], p[3]);
  }
  // data-edit value for one field of a single-record list, e.g. WU.editKey('bomb', 'screen', 'bomb-screen', 'boom').
  WU.editAttr = function (game, list, id, field) { return ' data-edit="' + game + ':' + list + ':' + id + (field ? ':' + field : '') + '"'; };

  /* ---------- editor panel ---------- */
  // def options: global (same for every level), single (fixed records: no add / delete).
  // Field types: text, num (min/max), bool (show/hide), pic, examples (example cards), head (section title).
  WU.openEditor = function (game, list, selId, focusKey) {
    var def = WU.lists[game + ':' + list]; if (!def) return;
    var lvl = def.global ? 0 : WU.state.level, sel = selId || null, mode = 'form', pick = null, q = '', gi = 0, el = null;
    var MAXEX = 8;

    function items() { return WU.list(game, list, lvl); }
    function cur() { return items().filter(function (i) { return i.id === sel; })[0] || null; }
    function label(it) { return def.title ? def.title(it) : (it.text || it.short || '(empty)'); }
    function thumb(id) { return id ? '<span class="ed-th">' + WU.pic(id) + '</span>' : '<span class="ed-th empty"></span>'; }
    function fieldDef(k) { return def.fields(lvl).filter(function (f) { return f.k === k; })[0]; }
    function exArr() { var it = cur(); return it && it.examples ? it.examples.map(WU.normExample) : null; }
    function exForm() { var it = cur(), f = fieldDef('examples'); return f && f.form ? f.form(it, lvl) : 'a'; }

    function render() {
      var its = items(), dels = WU.listDeleted(game, list, lvl);
      if (!sel || !cur()) sel = its.length ? its[0].id : null;
      var others = Object.keys(WU.lists).map(function (k) { return WU.lists[k]; }).filter(function (d) { return d.game === game; });
      var ro = WU.sync && !WU.sync.canEdit();
      var h = '<div class="panel editor' + (ro ? ' ro' : '') + '"><div class="ed-top"><span class="eb-chip">EDIT</span><span class="ed-h">' + WU.esc(def.gameTitle) + '</span>' +
        others.map(function (d) { return '<span class="sbtn' + (d.list === list ? ' dark' : '') + '" tabindex="0" data-list="' + d.list + '">' + WU.esc(d.label) + '</span>'; }).join('') +
        '<span style="flex:1"></span><span class="sbtn dark" tabindex="0" data-a="close">Done (Esc)</span></div>' +
        (ro ? '<div class="ed-ro">View only on this device. To save edits, paste your GitHub token in Settings (S).</div>' : '') +
        (def.global ? '<div class="note">These texts are the same at every level.</div>'
          : '<div class="ed-lv">' + WU.LEVELS.map(function (L, i) { return '<span class="pill sm' + (i === lvl ? ' on' : '') + '" tabindex="0" data-lv="' + i + '"><b>' + L.name + '</b></span>'; }).join('') + '</div>') +
        '<div class="ed-body"><div class="ed-left"><div class="ed-list">' +
        its.map(function (it, i) {
          return '<div class="ed-row' + (it.id === sel ? ' on' : '') + '" tabindex="0" data-sel="' + it.id + '"><span class="ed-n">' + (i + 1) + '</span>' + thumb(it.pic) +
            '<span class="ed-t">' + WU.esc(label(it)) + '</span>' + (it.custom ? '<span class="ed-b new">NEW</span>' : it.edited ? '<span class="ed-b">EDITED</span>' : '') + '</div>';
        }).join('') +
        dels.map(function (it) { return '<div class="ed-row del"><span class="ed-t">' + WU.esc(label(it)) + '</span><span class="sbtn" tabindex="0" data-restore="' + it.id + '">Restore</span></div>'; }).join('') +
        '</div><div class="ed-acts">' + (def.single ? '' : '<span class="sbtn dark" tabindex="0" data-a="add">+ Add new (N)</span>') +
        '</div></div>' +
        '<div class="ed-right">' + (mode === 'pick' ? pickerHTML() : formHTML()) + '</div></div></div>';
      el.innerHTML = h; wire();
      if (ro) el.querySelectorAll('.ed-right input, .ed-right select').forEach(function (i) { i.disabled = true; });
    }

    function examplesHTML(f, it) {
      var arr = it.examples ? it.examples.map(WU.normExample) : null, form = exForm(), h = '';
      if (!arr) {
        return '<span class="ed-pics"><span class="note">' + WU.esc(f.auto ? f.auto(it, lvl) : 'No example cards.') + '</span>' +
          '<span class="sbtn dark" tabindex="0" data-exa="own">Make my own list</span></span>';
      }
      h += '<div class="ed-exs">' + (arr.length ? '' : '<div class="note">No example cards will show.</div>') + arr.map(function (x, i) {
        return '<div class="ed-ex">' + thumb(x.pic) +
          '<span class="sbtn" tabindex="0" data-expick="' + i + '">Picture</span><span class="sbtn" tabindex="0" data-exup="' + i + '">Upload</span>' +
          '<input type="text" class="w" data-exi="' + i + '" data-exf="w" maxlength="30" placeholder="word" value="' + WU.esc(x.w) + '">' +
          '<select data-exi="' + i + '" data-exf="art" title="Article">' + [['a', 'a'], ['an', 'an'], ['the', 'the'], ['', '(none)']].map(function (o) {
            return '<option value="' + o[0] + '"' + (x.art === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' +
          '<input type="text" class="p" data-exi="' + i + '" data-exf="pl" maxlength="30" placeholder="plural: ' + WU.esc(WU.phrase({ w: x.w, art: x.art || 'a' }, 'pl')) + '" value="' + WU.esc(x.pl) + '">' +
          '<span class="ed-shows" data-exshow="' + i + '">' + WU.esc(WU.phrase(x, form)) + '</span>' +
          '<span class="sbtn" tabindex="0" data-exmv="' + i + ':-1">Up</span><span class="sbtn" tabindex="0" data-exmv="' + i + ':1">Down</span>' +
          '<span class="sbtn warn" tabindex="0" data-exdel="' + i + '">Remove</span></div>';
      }).join('') + '</div><span class="ed-pics">' + (arr.length < MAXEX ? '<span class="sbtn dark" tabindex="0" data-exa="add">+ Add example</span>' : '') +
        (f.auto ? '<span class="sbtn" tabindex="0" data-exa="auto">Back to automatic</span>' : '') + '</span>';
      return h;
    }

    function formHTML() {
      var it = cur();
      if (!it) return '<div class="note">This list is empty. Press N to add an item.</div>';
      var h = '<div class="ed-form">';
      def.fields(lvl).forEach(function (f) {
        var v = it[f.k];
        if (f.type === 'head') { h += '<div class="ed-head">' + WU.esc(f.label) + '</div>'; return; }
        h += '<div class="ed-f" data-k="' + f.k + '"><span class="lab">' + WU.esc(f.label) + '</span>';
        if (f.type === 'text') h += '<input type="text" data-f="' + f.k + '" maxlength="' + (f.max || 80) + '" value="' + WU.esc(v || '') + '"' + (f.ph ? ' placeholder="' + WU.esc(typeof f.ph === 'function' ? f.ph(it, lvl) : f.ph) + '"' : '') + '>';
        else if (f.type === 'num') h += '<input type="number" data-f="' + f.k + '" min="' + (f.min || 0) + '" max="' + f.max + '" value="' + (v || '') + '" placeholder="' + (f.min ? f.min : 'none') + '">';
        else if (f.type === 'bool') h += '<span class="seg">' + [[1, f.on || 'Show'], [0, f.off || 'Hide']].map(function (o) {
          return '<div class="' + ((v ? 1 : 0) === o[0] ? 'on' : '') + '" tabindex="0" data-bool="' + f.k + '" data-v="' + o[0] + '">' + o[1] + '</div>'; }).join('') + '</span>';
        else if (f.type === 'pic') h += '<span class="ed-pics">' + thumb(v) + '<span class="sbtn" tabindex="0" data-pick="' + f.k + '">Choose picture</span>' +
          '<span class="sbtn" tabindex="0" data-up="' + f.k + '">Upload image</span>' + (v ? '<span class="sbtn" tabindex="0" data-clear="' + f.k + '">Remove</span>' : '') + '</span>';
        else if (f.type === 'examples') h += examplesHTML(f, it);
        if (f.hint) h += '<span class="note">' + WU.esc(typeof f.hint === 'function' ? f.hint(it, lvl) : f.hint) + '</span>';
        h += '</div>';
      });
      h += '<div class="ed-acts">' + (def.single ? '' : '<span class="sbtn warn" tabindex="0" data-a="del">Delete (Del)</span>') +
        (it.edited ? '<span class="sbtn" tabindex="0" data-a="resetitem">Undo my changes</span>' : '') + '</div></div>';
      return h;
    }

    function pickerHTML() {
      var val = pick.type === 'expic' ? (exArr()[pick.idx] || {}).pic : cur() ? cur()[pick.k] : null;
      var list = WU.PIC_LIST.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q.toLowerCase()) >= 0 || p.tags.join(' ').indexOf(q.toLowerCase()) >= 0; });
      gi = Math.min(gi, Math.max(0, list.length - 1));
      return '<div class="ed-pick"><div class="row"><input type="text" data-q placeholder="Type to search: cat, food, red..." value="' + WU.esc(q) + '" style="flex:1">' +
        '<span class="sbtn" tabindex="0" data-pkup="1">Upload image</span><span class="sbtn dark" tabindex="0" data-a="pickdone">Cancel</span></div>' +
        '<div class="note">Arrows + Enter to choose. Esc to go back.</div>' +
        '<div class="ed-grid">' + list.map(function (p, i) {
          return '<div class="ed-cell' + (val === p.id ? ' on' : '') + (i === gi ? ' cur' : '') + '" tabindex="-1" data-p="' + p.id + '" data-i="' + i + '">' + WU.pic(p.id) + '<span>' + WU.esc(p.name) + '</span></div>';
        }).join('') + '</div></div>';
    }

    function setF(f, v) { WU.edits.set(game, list, lvl, sel, f, v); }
    function setEx(arr) { setF('examples', arr); }
    function setExPic(i, pid) {
      var arr = exArr(); if (!arr || !arr[i]) return;
      var x = arr[i], old = WU.PICS[x.pic];
      x.pic = pid;
      // A library picture brings its own word, article and plural unless the teacher typed their own word.
      if (WU.PICS[pid] && (!x.w || (old && x.w === old.name))) { var n = WU.exampleFromPic(pid); x.w = n.w; x.art = n.art; x.pl = ''; }
      setEx(arr);
    }
    function choose(pid) {
      if (!cur()) return;
      if (pick.type === 'expic') setExPic(pick.idx, pid); else setF(pick.k, pid);
      var back = pick; mode = 'form'; render(); focusBack(back);
    }
    function focusBack(p) {
      var t = p && p.type === 'expic' ? el.querySelector('[data-expick="' + p.idx + '"]') : p ? el.querySelector('[data-pick="' + p.k + '"]') : null;
      if (t) t.focus();
    }
    function focusField(k) {
      var w = el.querySelector('.ed-f[data-k="' + k + '"]');
      var t = w && w.querySelector('input, select, [tabindex]');
      if (t) { t.focus(); if (t.select) t.select(); w.scrollIntoView({ block: 'nearest' }); }
    }
    function focusGrid() { var c = el.querySelector('.ed-cell.cur'); if (c) { c.focus(); c.scrollIntoView({ block: 'nearest' }); } }
    function focusSel() { var r = el.querySelector('.ed-row.on'); if (r) { r.focus(); r.scrollIntoView({ block: 'nearest' }); } }
    function upload(cb) { chooseFile(function (id) { cb(id); mode = 'form'; render(); }); }

    function wire() {
      el.querySelectorAll('[data-list]').forEach(function (b) { b.onclick = function () { list = b.getAttribute('data-list'); def = WU.lists[game + ':' + list]; lvl = def.global ? 0 : WU.state.level; sel = null; mode = 'form'; render(); }; });
      el.querySelectorAll('[data-lv]').forEach(function (b) { b.onclick = function () { lvl = +b.getAttribute('data-lv'); sel = null; mode = 'form'; render(); }; });
      el.querySelectorAll('[data-sel]').forEach(function (b) { b.onclick = function () { sel = b.getAttribute('data-sel'); mode = 'form'; render(); focusSel(); }; });
      el.querySelectorAll('[data-restore]').forEach(function (b) { b.onclick = function () { WU.edits.restore(game, list, lvl, b.getAttribute('data-restore')); render(); }; });
      el.querySelectorAll('[data-f]').forEach(function (inp) {
        var f = inp.getAttribute('data-f');
        inp.oninput = function () {
          if (inp.type === 'number') {
            var n = +inp.value, fd = fieldDef(f);
            if (inp.value === '' || isNaN(n) || n < (fd.min || 0) || n > fd.max) return; // wait until the number is valid
            setF(f, n);
          } else setF(f, inp.value);
          var row = el.querySelector('.ed-row.on .ed-t'); if (row && cur()) row.textContent = label(cur());
        };
        if (inp.type === 'number') inp.onchange = function () {
          var fd = fieldDef(f), n = Math.round(+inp.value);
          if (inp.value === '' && !fd.min) n = 0; else n = Math.max(fd.min || 0, Math.min(fd.max, isNaN(n) ? (fd.min || 0) : n));
          setF(f, n); inp.value = n || (fd.min ? n : '');
        };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); if (inp.onchange) inp.onchange(); inp.blur(); focusSel(); } };
      });
      el.querySelectorAll('[data-bool]').forEach(function (b) {
        b.onclick = function () { var k = b.getAttribute('data-bool'); setF(k, b.getAttribute('data-v') === '1'); render(); focusField(k); };
      });
      el.querySelectorAll('[data-pick]').forEach(function (b) {
        b.onclick = function () { pick = fieldDef(b.getAttribute('data-pick')); mode = 'pick'; q = ''; gi = 0; render(); var s = el.querySelector('[data-q]'); if (s) s.focus(); };
      });
      el.querySelectorAll('[data-up]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-up'); upload(function (id) { setF(k, id); }); }; });
      el.querySelectorAll('[data-pkup]').forEach(function (b) {
        b.onclick = function () { var p = pick; upload(function (id) { if (p.type === 'expic') setExPic(p.idx, id); else setF(p.k, id); }); };
      });
      el.querySelectorAll('[data-clear]').forEach(function (b) { b.onclick = function () { setF(b.getAttribute('data-clear'), ''); render(); }; });
      el.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { gi = +b.getAttribute('data-i'); choose(b.getAttribute('data-p')); }; });
      // example cards
      el.querySelectorAll('[data-exi]').forEach(function (inp) {
        var ev = inp.tagName === 'SELECT' ? 'onchange' : 'oninput';
        inp[ev] = function () {
          var arr = exArr(), i = +inp.getAttribute('data-exi'); if (!arr || !arr[i]) return;
          var f = inp.getAttribute('data-exf'), x = arr[i], pic = WU.PICS[x.pic];
          // A new word drops the picture's own plural (e.g. "birds" after renaming "bird" to "nurse").
          if (f === 'w' && x.pl && pic && x.pl === pic.pl && inp.value !== pic.name) { x.pl = ''; var pi = el.querySelector('[data-exi="' + i + '"][data-exf="pl"]'); if (pi) pi.value = ''; }
          x[f] = inp.value; setEx(arr);
          var sh = el.querySelector('[data-exshow="' + i + '"]'); if (sh) sh.textContent = WU.phrase(arr[i], exForm());
        };
      });
      el.querySelectorAll('[data-expick]').forEach(function (b) {
        b.onclick = function () { pick = { type: 'expic', k: 'examples', idx: +b.getAttribute('data-expick') }; mode = 'pick'; q = ''; gi = 0; render(); var s = el.querySelector('[data-q]'); if (s) s.focus(); };
      });
      el.querySelectorAll('[data-exup]').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-exup'); upload(function (id) { setExPic(i, id); }); }; });
      el.querySelectorAll('[data-exmv]').forEach(function (b) {
        b.onclick = function () {
          var p = b.getAttribute('data-exmv').split(':'), i = +p[0], j = i + (+p[1]), arr = exArr();
          if (!arr || j < 0 || j >= arr.length) return;
          var t = arr[i]; arr[i] = arr[j]; arr[j] = t; setEx(arr); render();
          var n = el.querySelector('[data-exmv="' + j + ':' + p[1] + '"]'); if (n) n.focus();
        };
      });
      el.querySelectorAll('[data-exdel]').forEach(function (b) {
        b.onclick = function () { var i = +b.getAttribute('data-exdel'), arr = exArr(); arr.splice(i, 1); setEx(arr); render(); focusField('examples'); };
      });
      el.querySelectorAll('[data-exa]').forEach(function (b) {
        b.onclick = function () {
          var a = b.getAttribute('data-exa'), f = fieldDef('examples'), arr = exArr();
          if (a === 'own') { setEx(f.seed ? f.seed(cur(), lvl).map(WU.normExample) : []); render(); focusField('examples'); }
          else if (a === 'auto') { setEx(null); render(); focusField('examples'); }
          else if (a === 'add') {
            arr = arr || []; arr.push({ w: '', art: 'a', pl: '', pic: '' }); setEx(arr); render();
            var ws = el.querySelectorAll('.ed-ex input.w'); if (ws.length) ws[ws.length - 1].focus();
          }
        };
      });
      var s = el.querySelector('[data-q]');
      if (s) {
        s.oninput = function () { q = s.value; gi = 0; var pos = s.selectionStart; render(); var n = el.querySelector('[data-q]'); n.focus(); n.setSelectionRange(pos, pos); };
        s.onkeydown = function (e) { if (e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); if (e.key === 'Enter') { var c = el.querySelector('.ed-cell.cur'); if (c) choose(c.getAttribute('data-p')); } else focusGrid(); } };
      }
      el.querySelectorAll('[data-a]').forEach(function (b) {
        b.onclick = function () {
          var a = b.getAttribute('data-a');
          if (a === 'close') WU.closeOverlay();
          else if (a === 'add') addItem();
          else if (a === 'del') delItem();
          else if (a === 'resetitem') { WU.edits.resetItem(game, list, lvl, sel); render(); } else if (a === 'pickdone') { var p = pick; mode = 'form'; render(); focusBack(p); }
        };
      });
    }
    function addItem() {
      if (def.single) return;
      var id = WU.edits.add(game, list, lvl, def.blank(lvl)); if (!id) return;
      sel = id; mode = 'form'; render();
      var f = el.querySelector('.ed-form input[type=text]'); if (f) f.focus();
    }
    function delItem() {
      if (!sel || def.single) return;
      var its = items(), i = its.map(function (x) { return x.id; }).indexOf(sel);
      WU.edits.remove(game, list, lvl, sel);
      var rest = items(); sel = rest.length ? rest[Math.min(i, rest.length - 1)].id : null; render(); focusSel();
    }

    WU.openOverlay({
      cls: 'editor-ov', dismiss: false,
      render: function (o) {
        el = o; render();
        if (focusKey && cur()) focusField(focusKey);
        else if (selId) focusSel(); else { var r = el.querySelector('.ed-row'); if (r) r.focus(); }
      },
      onKey: function (e) {
        var k = e.key;
        if (mode === 'pick') {
          var cells = el.querySelectorAll('.ed-cell'), cols = 6;
          if (k === 'Escape') { var p = pick; mode = 'form'; render(); focusBack(p); return true; }
          var mv = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[k];
          if (mv && cells.length) {
            e.preventDefault();
            if (k === 'ArrowUp' && gi < cols) { var s = el.querySelector('[data-q]'); if (s) s.focus(); return true; }
            var old = cells[gi]; gi = Math.max(0, Math.min(cells.length - 1, gi + mv));
            if (old) old.classList.remove('cur'); cells[gi].classList.add('cur'); focusGrid(); return true;
          }
          if ((k === 'Enter' || k === ' ') && document.activeElement && document.activeElement.classList.contains('ed-cell')) {
            e.preventDefault(); choose(document.activeElement.getAttribute('data-p')); return true;
          }
          return false;
        }
        if (k === 'ArrowDown' || k === 'ArrowUp') {
          var its = items(), i = its.map(function (x) { return x.id; }).indexOf(sel);
          if (!its.length) return true;
          i = Math.max(0, Math.min(its.length - 1, i + (k === 'ArrowDown' ? 1 : -1)));
          sel = its[i].id; e.preventDefault(); render(); focusSel(); return true;
        }
        if (k === 'n' || k === 'N' || k === 'Insert') { e.preventDefault(); addItem(); return true; }
        if (k === 'Delete') { delItem(); return true; }
        if (k === 'Enter' && document.activeElement && document.activeElement.classList.contains('ed-row')) {
          e.preventDefault(); var f = el.querySelector('.ed-form input, .ed-form select, .ed-form [tabindex]'); if (f) f.focus(); return true;
        }
        if (!def.global && (k === 'PageDown' || k === 'PageUp')) { lvl = Math.max(0, Math.min(6, lvl + (k === 'PageDown' ? 1 : -1))); sel = null; render(); focusSel(); return true; }
        return false;
      },
      onClose: function () { WU.emit('content'); }
    });
  };

  /* ---------- app-wide texts used by the shared pieces ---------- */
  WU.registerList('app', 'texts', {
    gameTitle: 'All games', label: 'App texts', global: true, single: true,
    defaults: function () { return WU.content.appTexts || []; },
    norm: function (r) { var o = {}; Object.keys(r).forEach(function (k) { if (k !== 'id') o[k] = r[k]; }); return o; },
    title: function () { return 'Timer, student picker, scoreboard'; },
    fields: function () {
      return [
        { type: 'head', label: 'Timer' },
        { k: 'timerStart', label: 'Before it starts', type: 'text', max: 20 },
        { k: 'timerSeconds', label: 'Under the seconds', type: 'text', max: 20 },
        { k: 'timerLeft', label: 'Under minutes (1:30)', type: 'text', max: 20 },
        { k: 'timerPaused', label: 'When paused', type: 'text', max: 20 },
        { k: 'timerDone', label: 'At zero', type: 'text', max: 12 },
        { type: 'head', label: 'Student picker' },
        { k: 'pickerTitle', label: 'Tag while choosing', type: 'text', max: 24 },
        { k: 'pickerLanded', label: 'Tag when a name lands', type: 'text', max: 24 },
        { k: 'pickerTap', label: 'Before the first pick', type: 'text', max: 24 },
        { type: 'head', label: 'Scoreboard' },
        { k: 'scoresLabel', label: 'Side label', type: 'text', max: 12 }
      ];
    }
  });

  /* ---------- wiring ---------- */
  WU.on('route', function () { renderBar(); markEditables(); runAudit(); });
  WU.on('change', function (p) { if (p && 'level' in p) renderBar(); });
  document.addEventListener('DOMContentLoaded', function () {
    edits(); // all games have registered their lists by now: upgrade old saved edits straight away
    var st = document.getElementById('stage');
    // In edit mode, a click on anything editable opens the editor instead of playing.
    st.addEventListener('click', function (e) {
      if (!WU.editing || (WU.overlay && !WU.overlay.el.classList.contains('student'))) return;
      var t = e.target.closest && e.target.closest('#screen [data-edit], .overlay.student [data-edit]');
      if (!t) return;
      e.preventDefault(); e.stopPropagation(); openFromEl(t);
    }, true);
    new MutationObserver(function () { if (WU.editing) { markEditables(); runAudit(); } }).observe(document.getElementById('stage'), { childList: true, subtree: true });
  });
  // Keys while editing (called from core before game keys). Returns true if used.
  WU.editKey = function (e) {
    var k = e.key;
    if (k === 'e' || k === 'E') { WU.toggleEdit(); return true; }
    if (!WU.editing) return false;
    if (k === 'Escape') { WU.toggleEdit(false); return true; }
    var a = document.activeElement;
    if ((k === 'Enter' || k === ' ') && a && a.getAttribute) {
      if (a.getAttribute('data-edit')) { e.preventDefault(); openFromEl(a); return true; }
      if (a.closest && a.closest('#editbar')) { e.preventDefault(); a.click(); return true; }
    }
    return false;
  };
})();
