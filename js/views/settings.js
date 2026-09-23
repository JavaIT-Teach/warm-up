/* Warm Up: settings overlay. Mute, calm motion, number of students, teams, class rosters, reset all data. */
(function () {
  'use strict';
  var WU = window.WU;

  WU.openSettings = function (focus) {
    var editing = null, confirmReset = false, el = null, refocus = null;

    function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
    function seg(name, opts, cur) {
      return '<div class="seg">' + opts.map(function (o) {
        return '<div class="' + (o[0] === cur ? 'on' : '') + '" data-seg="' + name + '" data-v="' + o[0] + '">' + o[1] + '</div>';
      }).join('') + '</div>';
    }
    function render() {
      var s = WU.state, calmV = s.calm === true ? 'calm' : s.calm === false ? 'lively' : 'auto';
      var h = '<div class="panel settings"><div class="top"><div class="h">Settings</div>' +
        '<div class="sbtn dark" data-s="close">Done (Esc)</div></div><div class="cols"><div class="c">' +
        '<div class="move"><div class="h2">Move to another device</div>' +
        '<div class="note" style="color:#0d0d0d">One file with your edits (' + plural(WU.edits.count(), 'change') + ', ' + plural(WU.images.count(), 'image') + '), classes and teams.</div>' +
        '<div class="row"><div class="sbtn dark" data-s="export">Export my edits (file)</div><div class="sbtn" data-s="import">Import a file</div></div>' +
        '<div class="note" style="color:#0d0d0d">Import replaces the edits on this device.</div></div>' +
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
      h += '<div style="flex:1"></div><div class="row"><div class="lab" style="min-width:0">Undo my edits:</div>' +
        '<div class="sbtn" data-s="rgame">' + (confirmReset === 'rgame' ? 'Press again: The Bomb' : 'The Bomb') + '</div>' +
        '<div class="sbtn" data-s="redits">' + (confirmReset === 'redits' ? 'Press again: all games' : 'All games') + '</div></div>' +
        '<div class="row"><div class="sbtn" data-s="picker">Try the student picker</div>' +
        '<div class="sbtn warn" data-s="reset">' + (confirmReset === 'reset' ? 'Press again to delete everything' : 'Reset all data') + '</div></div>' +
        '</div><div class="c">';
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
      h += '</div></div></div>';
      el.innerHTML = h;
      // Keyboard first: every control can be reached with Tab and pressed with Enter.
      el.querySelectorAll('.sbtn, .seg > div, .sw, .cl').forEach(function (b) { b.setAttribute('tabindex', '0'); });
      wire();
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
          var a = b.getAttribute('data-s'), s = WU.state, was = confirmReset;
          confirmReset = false; refocus = '[data-s="' + a + '"]';
          if (a === 'export') { WU.exportData(); return; }
          if (a === 'import') { WU.importData(function () { render(); }); return; }
          if (a === 'rgame' || a === 'redits') {
            if (was !== a) { confirmReset = a; render(); return; }
            if (a === 'rgame') WU.edits.resetGame('bomb'); else WU.edits.resetAll();
            WU.toast(a === 'rgame' ? 'The Bomb is back to the original content.' : 'All edits and images removed.'); render(); return;
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
          if (a === 'reset') {
            if (was !== 'reset') { confirmReset = 'reset'; render(); return; }
            WU.store.clearAll(); WU.loadState(); WU.applyCalm(); WU.emit('change', { classes: [] });
            WU.closeOverlay(); WU.toast('All data deleted.'); WU.route(); return;
          }
          render();
        };
      });
    }

    WU.openOverlay({
      cls: 'settings-ov',
      render: function (o) { el = o; if (focus === 'classes') editing = { id: '', name: '', names: [] }; render(); },
      onClose: function () { WU.emit('change', { classes: WU.state.classes }); }
    });
  };
})();
