/* Warm Up: automatic sync of teacher edits through the GitHub repo.
   - data/edits.json holds all edits; data/images/<id>.jpg holds each uploaded image.
   - Every device loads the latest edits on start (no token needed: public file).
   - A device with a token (Settings) saves edits automatically, a few seconds after each change.
   - Two devices editing at once: a three-way merge against the last synced version keeps both devices' changes.
     If both changed the very same field, this device's value wins and the other value is kept in a conflict log
     (included in the backup file), so nothing is lost silently.
   - No internet or a bad token: edits stay on this device and are saved later. Nothing is thrown away.
   The token is stored only in this browser (localStorage). It is never exported, logged or sent anywhere but GitHub. */
(function () {
  'use strict';
  var WU = window.WU;
  var OWNER = 'JavaIT-Teach', REPO = 'warm-up', BRANCH = 'main', FILE = 'data/edits.json', IMGDIR = 'data/images/';
  var API = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/';
  var RAW = 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' + BRANCH + '/';

  var status = 'idle', detail = '', running = false, again = false, timer = null, retryT = null, lastSaved = WU.store.get('sync-at', null);
  function token() { return WU.store.get('sync-token', '') || ''; }
  function set(s, d) { status = s; detail = d || ''; WU.emit('sync', { status: s, detail: detail }); }

  /* ---------- helpers ---------- */
  function b64(str) { return btoa(unescape(encodeURIComponent(str))); }
  function unb64(s) { return decodeURIComponent(escape(atob(String(s).replace(/\s/g, '')))); }
  function imgFile(id) { return IMGDIR + id.replace(/[^a-z0-9]/gi, '-') + '.jpg'; }
  function err(kind, msg) { var e = new Error(msg || kind); e.kind = kind; return e; }
  function req(url, opts) {
    opts = opts || {};
    var h = { Accept: 'application/vnd.github+json' };
    if (opts.auth && token()) h.Authorization = 'Bearer ' + token();
    if (opts.body) h['Content-Type'] = 'application/json';
    return fetch(url, { method: opts.method || 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined, cache: 'no-store' })
      .catch(function () { throw err('offline'); });
  }
  function refs(ed) { return (JSON.stringify(ed || {}).match(/u:[a-z0-9]+/gi) || []).filter(function (x, i, a) { return a.indexOf(x) === i; }); }

  /* ---------- three-way merge ---------- */
  var SEP = '\u0001';
  function flat(ed) {
    var out = {};
    Object.keys(ed || {}).forEach(function (k) {
      if (k.charAt(0) === '_') return;
      var e = ed[k] || {};
      Object.keys(e.mod || {}).forEach(function (id) { Object.keys(e.mod[id] || {}).forEach(function (f) { out[k + SEP + 'mod' + SEP + id + SEP + f] = JSON.stringify(e.mod[id][f]); }); });
      (e.del || []).forEach(function (id) { out[k + SEP + 'del' + SEP + id] = '1'; });
      (e.add || []).forEach(function (a) { out[k + SEP + 'add' + SEP + a.id] = JSON.stringify(a); });
    });
    return out;
  }
  function addOrder(ed, k) { return ((ed && ed[k] && ed[k].add) || []).map(function (a) { return a.id; }); }
  // base = last version both sides agreed on. Returns { edits, conflicts }.
  function merge3(base, local, remote) {
    var B = flat(base), L = flat(local), R = flat(remote), out = {}, conflicts = [];
    var keys = {}; [B, L, R].forEach(function (m) { Object.keys(m).forEach(function (x) { keys[x] = 1; }); });
    Object.keys(keys).forEach(function (x) {
      var b = B[x], l = L[x], r = R[x], v;
      if (l === r) v = l; else if (l === b) v = r; else if (r === b) v = l;
      else { v = l; conflicts.push({ key: x.split(SEP).join(' / '), kept: l === undefined ? null : JSON.parse(l), other: r === undefined ? null : JSON.parse(r), at: new Date().toISOString() }); }
      if (v !== undefined) out[x] = v;
    });
    var ed = { _v: 2 };
    Object.keys(out).forEach(function (x) {
      var p = x.split(SEP), k = p[0], e = ed[k] = ed[k] || {};
      if (p[1] === 'mod') { e.mod = e.mod || {}; e.mod[p[2]] = e.mod[p[2]] || {}; e.mod[p[2]][p[3]] = JSON.parse(out[x]); }
      else if (p[1] === 'del') (e.del = e.del || []).push(p[2]);
      else if (p[1] === 'add') (e.adds = e.adds || {})[p[2]] = JSON.parse(out[x]);
    });
    // Keep the order of added items: this device's order first, then items only the other device added.
    Object.keys(ed).forEach(function (k) {
      var e = ed[k]; if (!e.adds) return;
      var order = addOrder(local, k).concat(addOrder(remote, k)).filter(function (id, i, a) { return a.indexOf(id) === i && e.adds[id]; });
      e.add = order.map(function (id) { return e.adds[id]; }); delete e.adds;
    });
    return { edits: ed, conflicts: conflicts };
  }
  function same(a, b) { var A = flat(a), B = flat(b), ka = Object.keys(A), kb = Object.keys(B); return ka.length === kb.length && ka.every(function (k) { return A[k] === B[k]; }); }

  /* ---------- GitHub reads and writes ---------- */
  function readRemote() {
    if (token()) {
      return req(API + FILE + '?ref=' + BRANCH + '&t=' + Date.now(), { auth: true }).then(function (r) {
        if (r.status === 404) return { edits: {}, sha: null, conflicts: [] };
        if (r.status === 401) throw err('token', 'The token was not accepted (wrong, expired or removed).');
        if (r.status === 403) throw err('token', 'GitHub refused the token (no access, or too many requests).');
        if (!r.ok) throw err('error', 'GitHub error ' + r.status);
        return r.json().then(function (j) {
          var text = j.content ? unb64(j.content) : null;
          var got = text != null ? Promise.resolve(text) : req(j.download_url + '?t=' + Date.now()).then(function (x) { return x.text(); });
          return got.then(function (t) { var d = JSON.parse(t || '{}'); return { edits: d.edits || {}, sha: j.sha, conflicts: d.conflicts || [] }; });
        });
      });
    }
    // No token: the public copy (works once the repo is public).
    return req(RAW + FILE + '?t=' + Date.now()).then(function (r) {
      if (r.status === 404) return { edits: null, sha: null, conflicts: [] };
      if (!r.ok) throw err('error', 'GitHub error ' + r.status);
      return r.json().then(function (d) { return { edits: d.edits || {}, sha: null, conflicts: d.conflicts || [] }; });
    });
  }
  function writeRemote(edits, sha, conflicts) {
    var body = { message: 'Warm Up: teacher edits', branch: BRANCH,
      content: b64(JSON.stringify({ app: 'warm-up', version: 2, updated: new Date().toISOString(), edits: edits, conflicts: conflicts.slice(-100) }, null, 1)) };
    if (sha) body.sha = sha;
    return req(API + FILE, { method: 'PUT', auth: true, body: body }).then(function (r) {
      if (r.status === 409 || r.status === 422) throw err('race'); // another device saved first: merge again
      if (r.status === 401) throw err('token', 'The token was not accepted (wrong, expired or removed).');
      if (r.status === 403 || r.status === 404) throw err('token', 'The token cannot write to ' + OWNER + '/' + REPO + '. It needs Contents: Read and write.');
      if (!r.ok) throw err('error', 'GitHub error ' + r.status);
      return r.json().then(function (j) { return j.content && j.content.sha; });
    });
  }
  function pushImages(edits) {
    var done = WU.store.get('sync-images', []);
    var todo = refs(edits).filter(function (id) { return done.indexOf(id) < 0 && WU.images.get(id); });
    return todo.reduce(function (p, id) {
      return p.then(function () {
        var data = WU.images.get(id), m = /^data:[^;]+;base64,(.*)$/.exec(data || '');
        if (!m) return;
        return req(API + imgFile(id), { method: 'PUT', auth: true, body: { message: 'Warm Up: image', branch: BRANCH, content: m[1] } }).then(function (r) {
          if (r.ok || r.status === 422) { done.push(id); WU.store.set('sync-images', done); return; } // 422: already there
          if (r.status === 401 || r.status === 403 || r.status === 404) throw err('token', 'The token cannot upload images. It needs Contents: Read and write.');
          throw err('error', 'GitHub error ' + r.status);
        });
      });
    }, Promise.resolve());
  }
  function pullImages(edits) {
    var missing = refs(edits).filter(function (id) { return !WU.images.get(id); });
    return Promise.all(missing.map(function (id) {
      var url = token() ? API + imgFile(id) + '?ref=' + BRANCH : RAW + imgFile(id);
      return req(url, { auth: true }).then(function (r) {
        if (!r.ok) return;
        if (token()) return r.json().then(function (j) { if (j.content) WU.images.put(id, 'data:image/jpeg;base64,' + j.content.replace(/\s/g, '')); });
        return r.blob().then(function (b) {
          return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { WU.images.put(id, fr.result); ok(); }; fr.readAsDataURL(b); });
        });
      }).catch(function () {});
    })).then(function () {
      var done = WU.store.get('sync-images', []);
      missing.forEach(function (id) { if (WU.images.get(id) && done.indexOf(id) < 0) done.push(id); });
      WU.store.set('sync-images', done);
      return missing.length;
    });
  }

  /* ---------- one sync pass: pull, merge, push ---------- */
  function run(tries) {
    if (running) { again = true; return Promise.resolve(); }
    running = true; clearTimeout(retryT);
    var dirty = WU.store.get('sync-dirty', false);
    set(token() && dirty ? 'saving' : 'loading');
    return readRemote().then(function (rem) {
      if (rem.edits === null) { // nothing public yet (or the repo is still private)
        set(token() ? 'saved' : 'viewonly'); return;
      }
      var base = WU.store.get('sync-base', {}), local = WU.edits.raw();
      var m = merge3(base, local, rem.edits);
      if (m.conflicts.length) WU.store.set('sync-conflicts', WU.store.get('sync-conflicts', []).concat(m.conflicts).slice(-100));
      var conflicts = (rem.conflicts || []).concat(WU.store.get('sync-conflicts', []));
      if (!same(m.edits, local)) WU.edits.replace(m.edits); // show what other devices saved
      return pullImages(m.edits).then(function (n) {
        if (n) WU.emit('content');
        if (!token()) { WU.store.set('sync-base', rem.edits); set('viewonly'); return; }
        if (same(m.edits, rem.edits)) { WU.store.set('sync-base', m.edits); WU.store.set('sync-dirty', false); stamp(); set('saved'); return; }
        set('saving');
        return pushImages(m.edits).then(function () { return writeRemote(m.edits, rem.sha, conflicts); }).then(function () {
          WU.store.set('sync-base', m.edits);
          // Changes made while we were saving stay dirty and go up on the next pass.
          if (same(WU.edits.raw(), m.edits)) WU.store.set('sync-dirty', false); else again = true;
          WU.store.set('sync-conflicts', []);
          stamp(); set('saved');
        });
      });
    }).catch(function (e) {
      if (e.kind === 'race' && (tries || 0) < 4) { running = false; return run((tries || 0) + 1); }
      if (e.kind === 'offline') { set('offline'); retryT = setTimeout(function () { WU.sync.now(); }, 30000); }
      else if (e.kind === 'token') set('token', e.message);
      else set('error', e.message || 'Could not reach GitHub.');
    }).then(function () {
      running = false;
      if (again) { again = false; schedule(1500); }
    });
  }
  function stamp() { lastSaved = new Date().toISOString(); WU.store.set('sync-at', lastSaved); }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(function () { run(0); }, ms); }

  WU.sync = {
    OWNER: OWNER, REPO: REPO,
    status: function () { return status; },
    detail: function () { return detail; },
    lastSaved: function () { return lastSaved; },
    hasToken: function () { return !!token(); },
    canEdit: function () { return !!token(); },
    // Called by the edit layer after every local change.
    changed: function () { WU.store.set('sync-dirty', true); if (token()) { set('pending'); schedule(2500); } },
    now: function () { return run(0); },
    setToken: function (t) {
      t = String(t || '').trim();
      WU.store.set('sync-token', t);
      if (!t) { set('viewonly'); return Promise.resolve(); }
      // Check the token can write before trusting it.
      set('loading');
      return fetch('https://api.github.com/repos/' + OWNER + '/' + REPO, { headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + t }, cache: 'no-store' })
        .then(function (r) {
          if (r.status === 401) throw err('token', 'GitHub did not accept this token. Check you copied all of it.');
          if (!r.ok) throw err('token', 'This token cannot see ' + OWNER + '/' + REPO + '. Give it access to that repository.');
          return r.json();
        }).then(function (j) {
          if (j.permissions && !j.permissions.push) throw err('token', 'This token can read but not write. Set Contents to "Read and write".');
          return run(0);
        }).catch(function (e) {
          // A token GitHub rejects is not kept. If we are offline it is kept and checked on the next save.
          if (e.kind === 'token') { WU.store.set('sync-token', ''); set('token', e.message); } else if (e.kind === 'offline' || e instanceof TypeError) set('offline'); else set('error', e.message);
        });
    },
    conflicts: function () { return WU.store.get('sync-conflicts', []); },
    _merge3: merge3
  };

  // Keep in step: load on start, after coming back online, and when the tab becomes visible again.
  window.addEventListener('online', function () { WU.sync.now(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) schedule(500); });
  WU.on('booted', function () { WU.sync.now(); });
})();
