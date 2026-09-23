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
  function save() { WU.store.set('edits', E); WU.emit('content'); }
  function k3(game, list, level) { return game + ':' + list + ':' + level; }
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
  WU.listDeleted = function (game, list, level) {
    var def = WU.lists[game + ':' + list], e = edits()[k3(game, list, level)] || {}, raws = def.defaults(level) || [];
    return (e.del || []).map(function (id) {
      var raw = raws.filter(function (r) { return r.id === id; })[0]; if (!raw) return null;
      var it = def.norm(raw); it.id = id; return it;
    }).filter(Boolean);
  };
  WU.edits = {
    set: function (game, list, level, id, field, value) {
      var k = k3(game, list, level), e = edits()[k] = edits()[k] || {};
      if (builtIn(game, list, level, id)) { e.mod = e.mod || {}; e.mod[id] = e.mod[id] || {}; e.mod[id][field] = value; }
      else (e.add || []).forEach(function (a) { if (a.id === id) a[field] = value; });
      save();
    },
    add: function (game, list, level, item) {
      var k = k3(game, list, level), e = edits()[k] = edits()[k] || {};
      item.id = 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      (e.add = e.add || []).push(item); save(); return item.id;
    },
    remove: function (game, list, level, id) {
      var k = k3(game, list, level), e = edits()[k] = edits()[k] || {};
      if (builtIn(game, list, level, id)) { e.del = e.del || []; if (e.del.indexOf(id) < 0) e.del.push(id); if (e.mod) delete e.mod[id]; }
      else e.add = (e.add || []).filter(function (a) { return a.id !== id; });
      save();
    },
    restore: function (game, list, level, id) { var e = edits()[k3(game, list, level)]; if (e && e.del) e.del = e.del.filter(function (x) { return x !== id; }); save(); },
    resetItem: function (game, list, level, id) { var e = edits()[k3(game, list, level)]; if (e && e.mod) delete e.mod[id]; save(); },
    resetList: function (game, list, level) { delete edits()[k3(game, list, level)]; save(); },
    resetGame: function (game) { Object.keys(edits()).forEach(function (k) { if (k.indexOf(game + ':') === 0) delete E[k]; }); save(); },
    resetAll: function () { E = { _v: EV }; WU.images.clear(); save(); },
    count: function (prefix) {
      var n = 0;
      Object.keys(edits()).filter(isKey).forEach(function (k) {
        if (prefix && k.indexOf(prefix + ':') !== 0) return;
        var e = E[k]; n += Object.keys(e.mod || {}).length + (e.del || []).length + (e.add || []).length;
      });
      return n;
    },
    reload: function () { E = null; }
  };

  /* ---------- export / import (one file for another device) ---------- */
  WU.exportData = function () {
    var s = WU.state, data = {
      app: 'warm-up', version: 2, exported: new Date().toISOString(),
      edits: edits(), images: WU.images.all(),
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
        E = d.edits || {}; migrate(E); WU.store.set('edits', E);
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
    return Object.keys(WU.lists).map(function (k) { return WU.lists[k]; }).filter(function (d) { return g === 'home' || d.game === g; });
  }
  function renderBar() {
    var st = document.getElementById('stage'), bar = document.getElementById('editbar');
    if (!WU.editing) { if (bar) bar.remove(); return; }
    if (!bar) { bar = document.createElement('div'); bar.id = 'editbar'; st.appendChild(bar); }
    var ls = viewLists(), L = WU.LEVELS[WU.state.level];
    bar.innerHTML = '<span class="eb-chip">EDIT MODE</span><span class="eb-lv">' + L.name + ' ' + L.code + '</span>' +
      (ls.length ? ls.map(function (d) { return '<span class="sbtn" tabindex="0" data-open="' + d.game + ':' + d.list + '">' + WU.esc((WU.current === 'home' ? d.gameTitle + ': ' : '') + d.label) + '</span>'; }).join('')
        : '<span class="eb-note">Nothing to edit on this screen.</span>') +
      '<span class="eb-note">Click a pink outline, or Tab + Enter.</span><span style="flex:1"></span><span class="sbtn dark" tabindex="0" data-open="done">Done (E)</span>';
    bar.querySelectorAll('[data-open]').forEach(function (b) {
      b.onclick = function () {
        var v = b.getAttribute('data-open');
        if (v === 'done') { WU.toggleEdit(false); return; }
        var p = v.split(':'); WU.openEditor(p[0], p[1]);
      };
    });
  }
  function markEditables() {
    document.querySelectorAll('#screen [data-edit]').forEach(function (el) {
      if (WU.editing) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); }
      else { el.removeAttribute('tabindex'); el.removeAttribute('role'); }
    });
  }
  WU.toggleEdit = function (on) {
    WU.editing = on === undefined ? !WU.editing : !!on;
    document.body.classList.toggle('editing', WU.editing);
    renderBar(); markEditables();
    document.querySelectorAll('[data-act="edit"]').forEach(function (b) { b.classList.toggle('on', WU.editing); });
    if (!WU.editing && document.activeElement && document.activeElement.blur) document.activeElement.blur();
  };
  function openFromEl(el) {
    var p = el.getAttribute('data-edit').split(':'); // game:list:id
    WU.openEditor(p[0], p[1], p[2]);
  }

  /* ---------- editor panel ---------- */
  WU.openEditor = function (game, list, selId) {
    var def = WU.lists[game + ':' + list]; if (!def) return;
    var lvl = WU.state.level, sel = selId || null, mode = 'form', pick = null, q = '', gi = 0, el = null;

    function items() { return WU.list(game, list, lvl); }
    function cur() { return items().filter(function (i) { return i.id === sel; })[0] || null; }
    function label(it) { return def.title ? def.title(it) : (it.text || it.short || '(empty)'); }
    function thumb(id) { return id ? '<span class="ed-th">' + WU.pic(id) + '</span>' : '<span class="ed-th empty"></span>'; }

    function render() {
      var its = items(), dels = WU.listDeleted(game, list, lvl);
      if (!sel || !cur()) sel = its.length ? its[0].id : null;
      var others = Object.keys(WU.lists).map(function (k) { return WU.lists[k]; }).filter(function (d) { return d.game === game; });
      var h = '<div class="panel editor"><div class="ed-top"><span class="eb-chip">EDIT</span><span class="ed-h">' + WU.esc(def.gameTitle) + '</span>' +
        others.map(function (d) { return '<span class="sbtn' + (d.list === list ? ' dark' : '') + '" tabindex="0" data-list="' + d.list + '">' + WU.esc(d.label) + '</span>'; }).join('') +
        '<span style="flex:1"></span><span class="sbtn dark" tabindex="0" data-a="close">Done (Esc)</span></div>' +
        '<div class="ed-lv">' + WU.LEVELS.map(function (L, i) { return '<span class="pill sm' + (i === lvl ? ' on' : '') + '" tabindex="0" data-lv="' + i + '"><b>' + L.name + '</b></span>'; }).join('') + '</div>' +
        '<div class="ed-body"><div class="ed-left"><div class="ed-list">' +
        its.map(function (it, i) {
          return '<div class="ed-row' + (it.id === sel ? ' on' : '') + '" tabindex="0" data-sel="' + it.id + '"><span class="ed-n">' + (i + 1) + '</span>' + thumb(it.pic) +
            '<span class="ed-t">' + WU.esc(label(it)) + '</span>' + (it.custom ? '<span class="ed-b new">NEW</span>' : it.edited ? '<span class="ed-b">EDITED</span>' : '') + '</div>';
        }).join('') +
        dels.map(function (it) { return '<div class="ed-row del"><span class="ed-t">' + WU.esc(label(it)) + '</span><span class="sbtn" tabindex="0" data-restore="' + it.id + '">Restore</span></div>'; }).join('') +
        '</div><div class="ed-acts"><span class="sbtn dark" tabindex="0" data-a="add">+ Add new (N)</span><span class="sbtn" tabindex="0" data-a="resetlist">Reset this list (' + WU.LEVELS[lvl].code + ')</span></div></div>' +
        '<div class="ed-right">' + (mode === 'pick' ? pickerHTML() : formHTML()) + '</div></div></div>';
      el.innerHTML = h; wire();
    }

    function formHTML() {
      var it = cur();
      if (!it) return '<div class="note">This list is empty. Press N to add an item.</div>';
      var h = '<div class="ed-form">';
      def.fields(lvl).forEach(function (f) {
        var v = it[f.k];
        h += '<label class="ed-f"><span class="lab">' + WU.esc(f.label) + '</span>';
        if (f.type === 'text') h += '<input type="text" data-f="' + f.k + '" maxlength="' + (f.max || 80) + '" value="' + WU.esc(v || '') + '">';
        else if (f.type === 'num') h += '<input type="number" data-f="' + f.k + '" min="0" max="' + f.max + '" value="' + (v || '') + '" placeholder="none">';
        else if (f.type === 'pic') h += '<span class="ed-pics">' + thumb(v) + '<span class="sbtn" tabindex="0" data-pick="' + f.k + '">Choose picture</span>' +
          '<span class="sbtn" tabindex="0" data-up="' + f.k + '">Upload image</span>' + (v ? '<span class="sbtn" tabindex="0" data-clear="' + f.k + '">Remove</span>' : '') + '</span>';
        else if (f.type === 'pics') {
          var arr = v || [];
          h += '<span class="ed-pics">' + (arr.length ? arr.map(thumb).join('') : '<span class="note">' + WU.esc(f.empty || 'Automatic') + '</span>') +
            '<span class="sbtn" tabindex="0" data-pick="' + f.k + '">Choose (up to ' + f.max + ')</span>' + (arr.length ? '<span class="sbtn" tabindex="0" data-clear="' + f.k + '">Automatic</span>' : '') + '</span>';
        }
        if (f.hint) h += '<span class="note">' + WU.esc(f.hint) + '</span>';
        h += '</label>';
      });
      h += '<div class="ed-acts"><span class="sbtn warn" tabindex="0" data-a="del">Delete (Del)</span>' +
        (it.edited ? '<span class="sbtn" tabindex="0" data-a="resetitem">Undo my changes</span>' : '') + '</div></div>';
      return h;
    }

    function pickerHTML() {
      var multi = pick.type === 'pics', val = cur() ? cur()[pick.k] : null, chosen = multi ? (val || []) : [val];
      var list = WU.PIC_LIST.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q.toLowerCase()) >= 0 || p.tags.join(' ').indexOf(q.toLowerCase()) >= 0; });
      gi = Math.min(gi, Math.max(0, list.length - 1));
      return '<div class="ed-pick"><div class="row"><input type="text" data-q placeholder="Type to search: cat, food, red..." value="' + WU.esc(q) + '" style="flex:1">' +
        (multi ? '' : '<span class="sbtn" tabindex="0" data-up="' + pick.k + '">Upload image</span>') +
        '<span class="sbtn dark" tabindex="0" data-a="pickdone">' + (multi ? 'Done' : 'Cancel') + '</span></div>' +
        (multi ? '<div class="note">Selected ' + chosen.length + ' of ' + pick.max + '. Arrows + Enter to choose.</div>' : '<div class="note">Arrows + Enter to choose. Esc to go back.</div>') +
        '<div class="ed-grid">' + list.map(function (p, i) {
          return '<div class="ed-cell' + (chosen.indexOf(p.id) >= 0 ? ' on' : '') + (i === gi ? ' cur' : '') + '" tabindex="-1" data-p="' + p.id + '" data-i="' + i + '">' + WU.pic(p.id) + '<span>' + WU.esc(p.name) + '</span></div>';
        }).join('') + '</div></div>';
    }

    function setF(f, v) { WU.edits.set(game, list, lvl, sel, f, v); }
    function choose(pid) {
      var it = cur(); if (!it) return;
      if (pick.type === 'pics') {
        var arr = (it[pick.k] || []).slice(), i = arr.indexOf(pid);
        if (i >= 0) arr.splice(i, 1); else if (arr.length < pick.max) arr.push(pid); else { WU.toast('Up to ' + pick.max + ' pictures.'); return; }
        setF(pick.k, arr); render(); focusGrid();
      } else { setF(pick.k, pid); mode = 'form'; render(); }
    }
    function focusGrid() { var c = el.querySelector('.ed-cell.cur'); if (c) { c.focus(); c.scrollIntoView({ block: 'nearest' }); } }
    function focusSel() { var r = el.querySelector('.ed-row.on'); if (r) { r.focus(); r.scrollIntoView({ block: 'nearest' }); } }

    function wire() {
      el.querySelectorAll('[data-list]').forEach(function (b) { b.onclick = function () { list = b.getAttribute('data-list'); def = WU.lists[game + ':' + list]; sel = null; mode = 'form'; render(); }; });
      el.querySelectorAll('[data-lv]').forEach(function (b) { b.onclick = function () { lvl = +b.getAttribute('data-lv'); sel = null; mode = 'form'; render(); }; });
      el.querySelectorAll('[data-sel]').forEach(function (b) { b.onclick = function () { sel = b.getAttribute('data-sel'); mode = 'form'; render(); focusSel(); }; });
      el.querySelectorAll('[data-restore]').forEach(function (b) { b.onclick = function () { WU.edits.restore(game, list, lvl, b.getAttribute('data-restore')); render(); }; });
      el.querySelectorAll('[data-f]').forEach(function (inp) {
        inp.oninput = function () {
          var f = inp.getAttribute('data-f'), v = inp.type === 'number' ? (inp.value === '' ? 0 : Math.max(0, Math.min(+inp.max, +inp.value))) : inp.value;
          setF(f, v);
          var row = el.querySelector('.ed-row.on .ed-t'); if (row && cur()) row.textContent = label(cur());
        };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); focusSel(); } };
      });
      el.querySelectorAll('[data-pick]').forEach(function (b) {
        b.onclick = function () { var k = b.getAttribute('data-pick'); pick = def.fields(lvl).filter(function (f) { return f.k === k; })[0]; mode = 'pick'; q = ''; gi = 0; render(); var s = el.querySelector('[data-q]'); if (s) s.focus(); };
      });
      el.querySelectorAll('[data-up]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-up'); chooseFile(function (id) { setF(k, id); mode = 'form'; render(); }); }; });
      el.querySelectorAll('[data-clear]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-clear'); setF(k, k === 'examples' ? null : ''); render(); }; });
      el.querySelectorAll('[data-p]').forEach(function (b) { b.onclick = function () { gi = +b.getAttribute('data-i'); choose(b.getAttribute('data-p')); }; });
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
          else if (a === 'resetitem') { WU.edits.resetItem(game, list, lvl, sel); render(); }
          else if (a === 'resetlist') {
            if (b.getAttribute('data-sure')) { WU.edits.resetList(game, list, lvl); sel = null; render(); WU.toast('List reset to the original.'); }
            else { b.setAttribute('data-sure', '1'); b.textContent = 'Press again to reset'; }
          } else if (a === 'pickdone') { mode = 'form'; render(); }
        };
      });
    }
    function addItem() {
      sel = WU.edits.add(game, list, lvl, def.blank(lvl)); mode = 'form'; render();
      var f = el.querySelector('.ed-form input[type=text]'); if (f) f.focus();
    }
    function delItem() {
      if (!sel) return;
      var its = items(), i = its.map(function (x) { return x.id; }).indexOf(sel);
      WU.edits.remove(game, list, lvl, sel);
      var rest = items(); sel = rest.length ? rest[Math.min(i, rest.length - 1)].id : null; render(); focusSel();
    }

    WU.openOverlay({
      cls: 'editor-ov', dismiss: false,
      render: function (o) { el = o; render(); if (selId) focusSel(); else { var r = el.querySelector('.ed-row'); if (r) r.focus(); } },
      onKey: function (e) {
        var k = e.key;
        if (mode === 'pick') {
          var cells = el.querySelectorAll('.ed-cell'), cols = 6;
          if (k === 'Escape') { mode = 'form'; render(); return true; }
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
          e.preventDefault(); var f = el.querySelector('.ed-form input'); if (f) f.focus(); return true;
        }
        if (k === 'PageDown' || k === 'PageUp') { lvl = Math.max(0, Math.min(6, lvl + (k === 'PageDown' ? 1 : -1))); sel = null; render(); focusSel(); return true; }
        return false;
      },
      onClose: function () { WU.emit('content'); }
    });
  };

  /* ---------- wiring ---------- */
  WU.on('route', function () { renderBar(); markEditables(); });
  WU.on('change', function (p) { if (p && 'level' in p) renderBar(); });
  document.addEventListener('DOMContentLoaded', function () {
    edits(); // all games have registered their lists by now: upgrade old saved edits straight away
    var st = document.getElementById('stage');
    // In edit mode, a click on anything editable opens the editor instead of playing.
    st.addEventListener('click', function (e) {
      if (!WU.editing || WU.overlay) return;
      var t = e.target.closest && e.target.closest('#screen [data-edit]');
      if (!t) return;
      e.preventDefault(); e.stopPropagation(); openFromEl(t);
    }, true);
    new MutationObserver(function () { if (WU.editing) markEditables(); }).observe(document.getElementById('screen'), { childList: true, subtree: true });
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
