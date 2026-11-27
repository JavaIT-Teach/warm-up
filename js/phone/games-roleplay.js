/* Warm Up on a phone: ROLE PLAY as a pass-the-phone group game (see js/phone/shell.js). Same lists and screen texts as the board.
   1. The scene and its roles. Pass the phone: each player taps their role and reads it alone (goal, and the secret from Intermediate).
   2. Act the scene against the clock; the twist pops up on the phone at the same point as on the board.
   3. The players judge: did every role get what they wanted? Did you use the phrases? */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc, E = WU.engines.roleplay;
  P.HOW.roleplay = 'With friends: pass the phone. Each player reads a secret role, then you act the scene.';

  P.games.roleplay = (function () {
    var body, ctx, st, bar, barEl, deck = WU.kit.deck(), iv = null;
    function num(v, lo, hi, d) { v = +v || d; return Math.max(lo, Math.min(hi, v)); }
    function stopIv() { if (iv) clearInterval(iv); iv = null; }
    function start() {
      stopIv();
      var it = deck(WU.list('roleplay', 'scenes', ctx.level).filter(function (x) { return E.roles(x).length >= 2; }));
      if (!it) { ctx.empty(); return; }
      st = { it: it, phase: 'intro', seen: {}, peek: null, twisted: false, ticks: {} }; render();
    }
    function phrases(S) {
      var ps = E.phrases(st.it); if (!S.phrasesShow || !ps.length) return '';
      return '<div class="pkv"><span>' + esc(S.phrasesLabel || 'USEFUL PHRASES') + '</span>' +
        ps.map(function (p) { return esc(p.text).replace(/___/g, '<i class="pgap" style="display:inline-block"></i>'); }).join('<br>') + '</div>';
    }
    function render() {
      var S = ctx.S, it = st.it, roles = E.roles(it), h = '';
      bar.stop();
      h += '<div class="prow"><span class="ptag" style="background:var(--c)">' + esc(S.tag || 'ROLE PLAY') + '</span><span class="pcount">' + roles.length + ' players</span></div>';
      if (st.phase !== 'peek') h += '<div class="pq">' + esc(it.title) + '</div><p class="pnote">' + esc(it.setting) + '</p>';
      if (st.phase === 'intro') {
        h += '<p class="pnote big">Pass the phone. Tap your role and read it alone.</p>' +
          roles.map(function (r, k) {
            return '<button class="pchoice" data-r="' + k + '" style="width:100%;background:' + E.COLORS[k] + ';color:' + E.INKS[k] + '">' +
              (st.seen[k] ? '✓ ' : '') + esc(P.fill(S.roleLabel || 'ROLE {k}', { k: k + 1 })) + ': ' + esc(r.name) + '</button>';
          }).join('') +
          '<p class="pnote">Fewer players? One person can play two roles.</p>';
        body.innerHTML = h;
        body.querySelectorAll('[data-r]').forEach(function (b) { b.onclick = function () { st.peek = +b.getAttribute('data-r'); st.phase = 'peek'; WU.sound.clack(); render(); }; });
        ctx.actions([{ label: 'Other scene', alt: true, on: start }, { label: 'Action!', on: play }]);
        return;
      }
      if (st.phase === 'peek') {
        var r = roles[st.peek];
        h += '<div class="pbanner" style="background:' + E.COLORS[st.peek] + ';color:' + E.INKS[st.peek] + '">' + esc(P.fill(S.roleLabel || 'ROLE {k}', { k: st.peek + 1 })) + ': ' + esc(r.name) + '</div>' +
          (r.goal ? '<div class="pkv"><span>' + esc(S.goalLabel || 'You want to:') + '</span><b>' + esc(r.goal) + '</b></div>' : '') +
          (S.secretsShow && r.secret ? '<div class="pkv q"><span>' + esc(S.secretLabel || 'YOUR SECRET') + '</span><b>' + esc(r.secret) + '</b><em>Don\'t tell. Use it in the scene.</em></div>' : '') +
          phrases(S);
        body.innerHTML = h;
        ctx.actions([{ label: 'Hide and pass the phone', on: function () { st.seen[st.peek] = true; st.peek = null; st.phase = 'intro'; render(); } }]);
        return;
      }
      if (st.phase === 'play') {
        h += '<div class="pbarwrap"></div>';
        if (st.twisted) h += '<div class="pbanner no"><b>' + esc(S.twistLabel || 'TWIST!') + '</b> ' + esc(it.twist) + '</div>';
        h += '<p class="pnote big">' + esc(S.play || 'ACTION!') + '</p>' +
          roles.map(function (r, k) { return '<div class="pkv" style="border-left:12px solid ' + E.COLORS[k] + '"><span>' + esc(r.name) + '</span>' + esc(r.goal) + '</div>'; }).join('') + phrases(S);
        body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
        var secs = num(S.playSecs, 30, 600, 180), left = st.left != null ? st.left : secs;
        bar.start(left, function () { stopIv(); WU.sound.buzzer(); st.phase = 'check'; render(); });
        stopIv();
        if (S.twistShow && it.twist && !st.twisted) {
          var at = secs * (1 - num(S.twistAt, 10, 90, 50) / 100);
          iv = setInterval(function () { if (st && st.phase === 'play' && !st.twisted && bar.left() <= at) { st.twisted = true; st.left = bar.left(); stopIv(); WU.sound.buzzer(); if (navigator.vibrate) try { navigator.vibrate(300); } catch (e) {} render(); } }, 250);
        }
        ctx.actions([{ label: 'End the scene', alt: true, on: function () { stopIv(); st.phase = 'check'; render(); } }]);
        return;
      }
      if (st.phase === 'check') {
        h += '<div class="pbanner ok">' + esc(S.end || 'FREEZE!') + '</div><p class="pq">' + esc(S.debriefShow !== false && S.debrief ? S.debrief : 'Did every role get what they wanted?') + '</p>' +
          '<p class="pnote">Tap every role that got what they wanted.</p>' +
          roles.map(function (r, k) { return '<button class="ptog' + (st.ticks[k] ? ' on' : '') + '" data-t="' + k + '" style="width:100%;text-align:left">' + (st.ticks[k] ? '✓ ' : '') + esc(r.name) + ': ' + esc(r.goal) + '</button>'; }).join('') +
          (E.phrases(it).length ? '<button class="ptog' + (st.ticks.ph ? ' on' : '') + '" data-t="ph" style="width:100%;text-align:left">' + (st.ticks.ph ? '✓ ' : '') + 'We used two or more useful phrases</button>' : '');
        body.innerHTML = h;
        body.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-t'); st.ticks[k] = !st.ticks[k]; WU.sound.clack(); render(); }; });
        ctx.actions([{ label: 'Done', on: function () {
          var n = roles.filter(function (r, k) { return st.ticks[k]; }).length;
          st.ok = n >= Math.ceil(roles.length / 2) && (!E.phrases(it).length || st.ticks.ph); st.n = n;
          ctx.score(st.ok); if (st.ok) WU.sound.ding(); st.phase = 'end'; render();
        } }]);
        return;
      }
      h += st.ok ? '<div class="pbanner ok">Great scene! ' + st.n + ' of ' + roles.length + ' roles got what they wanted.</div>'
        : '<div class="pbanner no">Try it again: swap roles and use more phrases.</div>';
      if (S.secretsShow && roles.some(function (r) { return r.secret; })) h += '<p class="pnote big">Now tell each other your secrets!</p>' +
        roles.filter(function (r) { return r.secret; }).map(function (r) { return '<div class="pkv q"><span>' + esc(r.name) + '</span>' + esc(r.secret) + '</div>'; }).join('');
      body.innerHTML = h;
      ctx.actions([{ label: 'Same scene, new roles', alt: true, on: function () { st.phase = 'intro'; st.seen = {}; st.ticks = {}; st.twisted = false; st.left = null; render(); } }, { label: 'Next scene', on: start }]);
    }
    function play() { st.phase = 'play'; st.twisted = false; st.left = null; WU.sound.ding(); render(); }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); start(); },
      unmount: function () { stopIv(); if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();
})();
