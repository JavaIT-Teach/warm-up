/* Warm Up: occasion themes (content/themes.js) and the group in the room (content/groups.js).
   - WU.theme.occasion(date) : the occasion whose week contains the date, with its from / to dates (or null).
   - WU.theme.group(now)     : the group whose lesson is on now (15 minutes before start until the end), or null.
   - WU.theme.active()       : the theme that is ON now, or null. Automatic rule: ON for a group's FIRST lesson
                               in the occasion week, OFF for its later lessons that week (so a group sees it once).
                               No group on now (testing at home): ON all week. The T key / THEME chip overrides it for today.
   - Applies the look: page colour, floating decorations, body class "theme-<id>". Games read themed items through WU.list. */
(function () {
  'use strict';
  var WU = window.WU;
  var DAY = 864e5;

  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function at(y, m, d) { return new Date(y, m - 1, d); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  // The week of one occasion in a given year: { from, to } (local dates, inclusive).
  function windowOf(t, year) {
    var day = at(year, t.when[0], t.when[1]);
    if (t.rule === 'before') return { from: addDays(day, -7), to: addDays(day, -1) };
    if (t.rule === 'fixed') return { from: at(year, t.from[0], t.from[1]), to: at(year, t.to[0], t.to[1]) };
    var mon = addDays(day, -((day.getDay() + 6) % 7));
    return { from: mon, to: addDays(mon, 6) };
  }
  function occasion(date) {
    var d = dayStart(date || new Date()), list = WU.THEMES || [];
    for (var i = 0; i < list.length; i++) {
      // The occasion of next year can start this year (New Year: Dec 25-31).
      for (var y = d.getFullYear(); y <= d.getFullYear() + 1; y++) {
        var w = windowOf(list[i], y);
        if (d >= w.from && d <= w.to) return { theme: list[i], from: w.from, to: w.to };
      }
    }
    return null;
  }
  // The next occasions after a date (for the Saturday job and the settings list).
  function upcoming(date, n) {
    var d = dayStart(date || new Date()), out = [];
    (WU.THEMES || []).forEach(function (t) {
      [d.getFullYear(), d.getFullYear() + 1].forEach(function (y) { var w = windowOf(t, y); if (w.to >= d) out.push({ theme: t, from: w.from, to: w.to }); });
    });
    out.sort(function (a, b) { return a.from - b.from; });
    return out.slice(0, n || 3);
  }

  function mins(hhmm) { var p = String(hhmm).split(':'); return +p[0] * 60 + +p[1]; }
  function meets(g, d) {
    var wd = d.getDay(), days = g.days === 'odd' ? [1, 3, 5] : g.days === 'even' ? [2, 4, 6] : (g.days || []);
    return days.indexOf(wd) >= 0 && (!g.from || ymd(d) >= g.from) && (g.noClass || []).indexOf(ymd(d)) < 0;
  }
  function group(now) {
    now = now || new Date();
    var m = now.getHours() * 60 + now.getMinutes();
    return (WU.GROUPS || []).filter(function (g) { return meets(g, now) && m >= mins(g.start) - 15 && m <= mins(g.end); })[0] || null;
  }
  // The group's first lesson day inside the occasion week.
  function firstLesson(g, occ) {
    for (var d = occ.from; d <= occ.to; d = addDays(d, 1)) if (meets(g, d)) return d;
    return null;
  }

  // Manual override for today: { date, group, on }.
  function override(occ, g) {
    var o = WU.store.get('theme-override', null);
    return o && o.date === ymd(new Date()) && o.occ === occ.theme.id && o.group === (g ? g.id : '') ? o : null;
  }
  // Why the theme is on or off now (shown on the home chip).
  function status(now) {
    now = now || new Date();
    var occ = occasion(now); if (!occ) return null;
    var g = group(now), o = override(occ, g), first = g ? firstLesson(g, occ) : null;
    var auto = g ? !!first && ymd(first) === ymd(now) : true;
    return {
      occ: occ, theme: occ.theme, group: g, on: o ? o.on : auto, manual: !!o, auto: auto,
      why: o ? 'set by you today' : !g ? 'all week' : auto ? 'first lesson this week' : first ? 'had it on ' + first.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'no lesson this week'
    };
  }
  function active() { var s = status(); return s && s.on ? s.theme : null; }
  function toggle() {
    var s = status(); if (!s) { WU.toast('No occasion this week.'); return; }
    WU.store.set('theme-override', { date: ymd(new Date()), occ: s.theme.id, group: s.group ? s.group.id : '', on: !s.on });
    apply(); WU.emit('content');
    WU.toast(s.theme.name + ' theme ' + (!s.on ? 'ON' : 'OFF') + (s.group ? ' for ' + s.group.name : '') + ' today');
  }

  // ---------- the look ----------
  var applied = null, PAPER = null;
  function apply() {
    var t = active(), id = t ? t.id : '', stage = document.getElementById('stage');
    if (!stage) return;
    document.body.classList.toggle('has-occasion', !!occasion());
    if (applied === id) return; applied = id;
    (WU.THEMES || []).forEach(function (x) { document.body.classList.remove('theme-' + x.id); });
    document.body.classList.toggle('theme-on', !!t);
    var deco = document.getElementById('deco'); if (deco) deco.remove();
    // The theme colour replaces the paper colour everywhere (page, game screens, panels).
    if (!PAPER) PAPER = WU.C.paper;
    if (!t) { document.documentElement.style.removeProperty('--paper'); WU.C.paper = PAPER; return; }
    WU.C.paper = t.look.bg;
    document.body.classList.add('theme-' + t.id);
    document.documentElement.style.setProperty('--paper', t.look.bg);
    var items = t.look.deco || [], html = '';
    for (var i = 0; i < 14; i++) {
      var it = items[i % items.length], size = 46 + (i * 37) % 44, left = (i * 137) % 100, dur = 14 + (i * 7) % 12, delay = -((i * 5.3) % dur);
      var inner = WU.PICS && WU.PICS[it] ? WU.pic(it) : '<span>' + WU.esc(it) + '</span>';
      html += '<div class="dk' + (t.look.fall ? ' fall' : ' float') + '" style="left:' + left + '%;width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.8) + 'px;animation-duration:' + dur + 's;animation-delay:' + delay.toFixed(1) + 's;' +
        (t.look.fall ? '' : 'top:' + ((i * 61) % 90) + '%;') + '">' + inner + '</div>';
    }
    stage.insertAdjacentHTML('beforeend', '<div id="deco" data-ctrl aria-hidden="true">' + html + '</div>');
  }

  // ---------- the group in the room sets the level (once per group per day) ----------
  function autoLevel() {
    var g = group(); if (!g || g.level == null) return;
    var key = ymd(new Date()) + ':' + g.id;
    if (WU.store.get('group-level-set', '') === key) return;
    WU.store.set('group-level-set', key);
    if (WU.state.level !== g.level) { WU.setState({ level: g.level }); WU.toast(g.name + ': level set to ' + WU.LEVELS[g.level].name); }
  }

  WU.theme = { occasion: occasion, upcoming: upcoming, group: group, status: status, active: active, toggle: toggle, apply: apply, autoLevel: autoLevel, ymd: ymd, windowOf: windowOf };
  WU.on('booted', function () { apply(); });
  // Re-check every minute (a lesson starts, the day changes).
  setInterval(function () { var before = applied; apply(); if (before !== applied) WU.emit('content'); }, 60000);
})();
