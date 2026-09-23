/* Warm Up: settings overlay. GitHub sync token, mute, calm motion, number of students, teams, class rosters, backup file, reset this device. */
(function () {
  'use strict';
  var WU = window.WU;

  WU.openSettings = function (focus) {
    var editing = null, resetting = false, showSteps = !WU.sync.hasToken(), el = null, refocus = null, offSync = null;

    function syncHTML() {
      var y = WU.sync, st = y.status(), has = y.hasToken(), at = y.lastSaved();
      var line = st === 'token' ? 'Token problem: ' + y.detail() + (has ? ' Edits are kept on this device.' : '')
        : !has ? 'View only: this device loads your edits but cannot save them.'
        : st === 'saving' || st === 'pending' ? 'Saving...' : st === 'loading' ? 'Checking GitHub...'
        : st === 'offline' ? 'Offline. Edits are kept on this device and saved when the internet is back.'
        : st === 'token' ? 'Token problem: ' + y.detail() + ' Edits are kept on this device.'
        : st === 'error' ? 'Not saved yet: ' + (y.detail() || 'GitHub could not be reached.') + ' Will retry.'
        : 'Saved to GitHub' + (at ? ' at ' + new Date(at).toLocaleString() : '') + '.';
      return '<div class="move"><div class="h2">Save edits to GitHub</div>' +
        '<div class="note sync-line s-' + (has ? st : 'viewonly') + '" style="color:#0d0d0d">' + WU.esc(line) + '</div>' +
        (has
          ? '<div class="row"><div class="note" style="color:#0d0d0d">Token: saved on this device.</div><div class="sbtn dark" data-s="syncnow">Save now</div><div class="sbtn" data-s="untoken">Remove token</div></div>'
          : '<div class="row"><input type="password" data-token autocomplete="off" spellcheck="false" placeholder="Paste your token here (github_pat_...)" style="flex:1"><div class="sbtn dark" data-s="settoken">Save token</div></div>') +
        '<div class="sbtn" data-s="steps" style="align-self:flex-start">' + (showSteps ? 'Hide the steps' : 'How do I get the token?') + '</div>' +
        (showSteps ? '<ol class="steps">' +
          '<li>On github.com click your photo, then <b>Settings</b> &gt; <b>Developer settings</b> &gt; <b>Personal access tokens</b> &gt; <b>Fine-grained tokens</b>.</li>' +
          '<li>The token needs: <b>Repository access</b>: only <b>' + y.OWNER + '/' + y.REPO + '</b>. <b>Permissions</b>: <b>Contents: Read and write</b>.</li>' +
          '<li>Copy the token (it starts with <b>github_pat_</b>) and paste it in the box above. Do this once on every device where you edit.</li>' +
          '<li>Devices without the token still load and show your edits. They just cannot change them.</li>' +
          '<li>Lost it, or someone else saw it? Delete it on GitHub, make a new one, and paste the new one here.</li>' +
          '<li>The token stays in this browser only. Paste it only on devices you control.</li></ol>' : '') +
        '</div>';
    }
    function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
    function seg(name, opts, cur) {
      return '<div class="seg">' + opts.map(function (o) {
        return '<div class="' + (o[0] === cur ? 'on' : '') + '" data-seg="' + name + '" data-v="' + o[0] + '">' + o[1] + '</div>';
      }).join('') + '</div>';
    }
    function render() {
      var s = WU.state, calmV = s.calm === true ? 'calm' : s.calm === false ? 'lively' : 'auto';
      var h = '<div class="panel settings"><div class="top"><div class="h">Settings</div>' +
        '<div class="sbtn dark" data-s="close">Done (Esc)</div></div><div class="cols"><div class="c scroll">' + syncHTML() +
        '<div class="row"><div class="lab">Sound</div>' + seg('muted', [['0', 'On'], ['1', 'Off']], s.muted ? '1' : '0') + '</div>' +
        '<div class="row"><div class="lab">Motion</div>' + seg('calm', [['lively', 'Lively'], ['calm', 'Calm'], ['auto', 'Follow computer']], calmV) + '</div>' +
        '<div class="row"><div class="lab">Students in the room</div><div class="step"><div class="sbtn" data-s="st-">&minus;</div><div class="v">' + s.students +
        '</div><div class="sbtn" data-s="st+">+</div></div><div class="note">Used when no class is chosen: "Student 1, 2, 3..."</div></div>' +
        '<div class="row"><div class="lab">Teams</div>' + seg('teams', [['0', 'Off'], ['2', '2'], ['3', '3'], ['4', '4']], String(s.teams)) + '</div>';
      for (var i = 0; i < s.teams; i++) {
        h += '<div class="team"><input type="text" maxlength="12" data-team="' + i + '" value="' + WU.esc(s.teamNames[i] || '') + '">' +
          WU.TEAM_COLORS.map(function (c, ci) {
            return '<div class="sw' + (s.teamColors[i] === ci ? ' on' : '') + '" data-sw="' + i + '" data-c="' + ci + '" style="background:' + c + '"></div>';
          }).join('') + '</div>';
      }
      if (s.teams) h += '<div class="note">Keys 1-4 add a point. Shift + 1-4 removes one. S shows or hides the board.</div>';
      h += '<div class="row"><div class="sbtn" data-s="picker">Try the student picker</div></div></div><div class="c">';
      if (editing) {
        h += '<div class="lab">' + (editing.id ? 'Edit class' : 'New class') + '</div>' +
          '<div class="row"><input type="text" data-ed="name" maxlength="30" placeholder="Class name, e.g. Group 3A" style="flex:1" value="' + WU.esc(editing.name) + '"></div>' +
          '<div class="note">One student name per line.</div>' +
          '<textarea data-ed="names" placeholder="Ana&#10;Kenji&#10;Omar">' + WU.esc(editing.names.join('\n')) + '</textarea>' +
          '<div class="row"><div class="sbtn dark" data-s="save">Save</div><div class="sbtn" data-s="cancel">Cancel</div>' +
          (editing.id ? '<div class="sbtn warn" data-s="del">Delete class</div>' : '') + '</div>';
      } else {
        h += '<div class="row"><div class="lab" style="flex:1">Classes (optional)</div><div class="sbtn dark" data-s="new">+ New class</div></div>' +
          '<div class="note">The picker never repeats a name until everyone has had a turn.</div><div class="classes">' +
          '<div class="cl' + (!s.classId ? ' on' : '') + '" data-use=""><div class="nm">No class</div><div class="ct">Student 1 to ' + s.students + '</div></div>' +
          s.classes.map(function (c) {
            return '<div class="cl' + (s.classId === c.id ? ' on' : '') + '" data-use="' + c.id + '"><div class="nm">' + WU.esc(c.name) + '</div>' +
              '<div class="ct">' + c.names.length + ' names</div><div class="sbtn" data-cedit="' + c.id + '">Edit</div></div>';
          }).join('') + '</div>';
      }
      h += '<div style="flex:1"></div>' +
        '<div class="row"><div class="lab" style="min-width:0">Backup file</div><div class="sbtn" data-s="export">Export</div><div class="sbtn" data-s="import">Import</div></div>' +
        '<div class="note">Only a spare copy: your edits already save to GitHub. Import replaces the edits on this device (and then on GitHub).</div>' +
        (resetting
          ? '<div class="resetbox"><div class="lab">Delete everything on THIS device?</div>' +
            '<div class="note" style="color:#0d0d0d">Deletes this device\'s settings, classes, teams, token and its copy of your edits. Your edits saved on GitHub are NOT deleted: they load again next time.</div>' +
            '<div class="row"><input type="text" data-reset maxlength="10" placeholder="Type RESET" style="width:220px"><div class="sbtn warn" data-s="doreset">Delete</div><div class="sbtn" data-s="noreset">Cancel</div></div></div>'
          : '<div class="row"><div class="sbtn warn" data-s="reset">Reset all data on this device</div></div>') +
        '</div></div></div>';
      el.innerHTML = h;
      // Keyboard first: every control can be reached with Tab and pressed with Enter.
      el.querySelectorAll('.sbtn, .seg > div, .sw, .cl').forEach(function (b) { b.setAttribute('tabindex', '0'); });
      wire();
      var r = el.querySelector('[data-reset]');
      if (r) { r.focus(); r.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); el.querySelector('[data-s="doreset"]').click(); } }; }
      var tk = el.querySelector('[data-token]');
      if (tk) tk.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); el.querySelector('[data-s="settoken"]').click(); } };
      if (refocus) { var f = el.querySelector(refocus); if (f) f.focus(); refocus = null; }
      if (editing) { var n = el.querySelector('[data-ed="name"]'); if (n && !editing.id && !n.value) n.focus(); }
    }
    function readEditor() {
      if (!editing) return;
      var n = el.querySelector('[data-ed="name"]'), t = el.querySelector('[data-ed="names"]');
      if (n) editing.name = n.value;
      if (t) editing.names = t.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    }
    function wire() {
      el.querySelectorAll('[data-seg]').forEach(function (b) {
        b.onclick = function () {
          var k = b.getAttribute('data-seg'), v = b.getAttribute('data-v');
          if (k === 'muted') WU.setState({ muted: v === '1' });
          else if (k === 'calm') WU.setState({ calm: v === 'calm' ? true : v === 'lively' ? false : null });
          else if (k === 'teams') WU.setState({ teams: +v });
          readEditor(); refocus = '[data-seg="' + k + '"][data-v="' + v + '"]'; render();
        };
      });
      el.querySelectorAll('[data-team]').forEach(function (inp) {
        inp.oninput = function () {
          var names = WU.state.teamNames.slice(); names[+inp.getAttribute('data-team')] = inp.value.toUpperCase();
          WU.setState({ teamNames: names });
        };
      });
      el.querySelectorAll('[data-sw]').forEach(function (b) {
        b.onclick = function () {
          var c = WU.state.teamColors.slice(); c[+b.getAttribute('data-sw')] = +b.getAttribute('data-c');
          WU.setState({ teamColors: c }); readEditor(); render();
        };
      });
      el.querySelectorAll('[data-use]').forEach(function (b) {
        b.onclick = function (e) { if (e.target.closest('[data-cedit]')) return; WU.setState({ classId: b.getAttribute('data-use') }); render(); };
      });
      el.querySelectorAll('[data-cedit]').forEach(function (b) {
        b.onclick = function () {
          var c = WU.state.classes.filter(function (x) { return x.id === b.getAttribute('data-cedit'); })[0];
          if (c) { editing = { id: c.id, name: c.name, names: c.names.slice() }; render(); }
        };
      });
      el.querySelectorAll('[data-s]').forEach(function (b) {
        b.onclick = function () {
          var a = b.getAttribute('data-s'), s = WU.state;
          refocus = '[data-s="' + a + '"]';
          if (a === 'export') { WU.exportData(); return; }
          if (a === 'import') { WU.importData(function () { render(); }); return; }
          if (a === 'steps') { showSteps = !showSteps; render(); return; }
          if (a === 'syncnow') { WU.sync.now(); return; }
          if (a === 'untoken') { WU.sync.setToken(''); showSteps = true; render(); WU.toast('Token removed from this device.'); return; }
          if (a === 'settoken') {
            var v = (el.querySelector('[data-token]') || {}).value || '';
            if (!v.trim()) { WU.toast('Paste the token first.'); return; }
            refocus = '[data-s="syncnow"]'; showSteps = false;
            WU.sync.setToken(v).then(function () {
              if (WU.sync.status() === 'token') { WU.toast('That token did not work. See the message in Settings.'); }
            });
            render(); return;
          }
          if (a === 'reset') { resetting = true; render(); return; }
          if (a === 'noreset') { resetting = false; refocus = '[data-s="reset"]'; render(); return; }
          if (a === 'doreset') {
            var typed = (el.querySelector('[data-reset]') || {}).value || '';
            if (typed.trim() !== 'RESET') { WU.toast('Type RESET (capital letters) to confirm.'); return; }
            WU.store.clearAll(); WU.edits.reload(); WU.loadState(); WU.applyCalm(); WU.emit('change', { classes: [] });
            WU.closeOverlay(); WU.toast('This device was reset. Your edits load again from GitHub.'); WU.route(); WU.sync.now(); return;
          }
          readEditor();
          if (a === 'close') { WU.closeOverlay(); return; }
          if (a === 'st-') WU.setState({ students: Math.max(2, s.students - 1) });
          if (a === 'st+') WU.setState({ students: Math.min(60, s.students + 1) });
          if (a === 'new') editing = { id: '', name: '', names: [] };
          if (a === 'cancel') editing = null;
          if (a === 'save') {
            var name = (editing.name || '').trim() || 'Class ' + (s.classes.length + 1), list = s.classes.slice();
            if (editing.id) list = list.map(function (c) { return c.id === editing.id ? { id: c.id, name: name, names: editing.names } : c; });
            else { var id = 'c' + Date.now().toString(36); list.push({ id: id, name: name, names: editing.names }); WU.setState({ classes: list, classId: id }); editing = null; render(); return; }
            WU.setState({ classes: list }); editing = null;
          }
          if (a === 'del') {
            var rest = s.classes.filter(function (c) { return c.id !== editing.id; });
            WU.setState({ classes: rest, classId: s.classId === editing.id ? '' : s.classId }); editing = null;
          }
          if (a === 'picker') { WU.closeOverlay(); WU.pickStudent(); return; }
          render();
        };
      });
    }

    WU.openOverlay({
      cls: 'settings-ov',
      render: function (o) {
        el = o; if (focus === 'classes') editing = { id: '', name: '', names: [] }; render();
        // Keep the sync line live, without stealing focus from a field being typed in.
        offSync = WU.on('sync', function () {
          var a = document.activeElement; if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return;
          var sel = a && a.getAttribute && a.getAttribute('data-s'); if (sel) refocus = '[data-s="' + sel + '"]';
          readEditor(); render();
        });
      },
      onClose: function () { if (offSync) offSync(); WU.emit('change', { classes: WU.state.classes }); }
    });
  };
})();
