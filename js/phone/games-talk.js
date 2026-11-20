/* Warm Up on a phone: Story Dice and Slot Machine (see js/phone/shell.js). Nothing to mark right or wrong here:
   Story Dice checks that the story uses every picture; Slot Machine is a timer for talking on your own. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;
  var COLS = ['#c6ff00', '#ff4fc3', '#ffe600', '#00e5c7', '#ff5a1f', '#3d6bff'];
  function frameHTML(f) { return f ? '<div class="pframe">' + esc(f).replace(/___/g, '<span class="pgap"></span>') + '</div>' : ''; }

  /* ======================= STORY DICE ======================= */
  P.games.dice = (function () {
    var body, ctx, st, bar, barEl, timer = null;
    var deck = WU.kit.deck();
    function pics() { return WU.list('dice', 'pictures', ctx.level).filter(function (p) { return p.pic; }); }
    function n() { return Math.max(1, Math.min(6, +ctx.S.dice || 4)); }
    // A picture counts when its word (or the start of it: "swim" in "swam" does not, "dog" in "dogs" does) is in the story.
    function used(text, word) {
      var t = ' ' + P.norm(text) + ' ', w = P.norm(word); if (!w) return false;
      var stem = w.length > 4 ? w.slice(0, Math.max(4, w.length - 2)) : w;
      return t.indexOf(' ' + w) >= 0 || t.indexOf(' ' + stem) >= 0;
    }
    function roll() {
      var all = pics(); if (all.length < n()) { ctx.empty(); return; }
      st = { dice: WU.kit.drawN(deck, all, n()), rolling: !WU.isCalm(), typed: '', checked: false, alt: !!(ctx.S.ruleAlt && Math.random() < 0.5), open: {} };
      render();
      if (st.rolling) {
        var k = 0; clearInterval(timer);
        timer = setInterval(function () {
          if (!body) { clearInterval(timer); return; }
          body.querySelectorAll('.die .pic').forEach(function (el) { el.outerHTML = WU.pic(WU.pick(all).pic); });
          WU.sound.tick(k % 2);
          if (++k > 8) { clearInterval(timer); timer = null; st.rolling = false; WU.sound.slam(); render(); }
        }, 90);
      }
    }
    function render() {
      var S = ctx.S, h = '', secs = Math.max(0, +S.pairSecs || 0) * 2 || 180;
      h += '<div class="dice">' + st.dice.map(function (d, i) {
        var u = st.checked && used(st.typed, d.text);
        return '<button class="die' + (st.checked ? (u ? ' ok' : ' no') : '') + '" data-d="' + i + '" style="--c:' + COLS[i % COLS.length] + '">' + WU.pic(d.pic) +
          (st.open[i] || st.checked ? '<span>' + esc(d.text) + '</span>' : '') + '</button>';
      }).join('') + '</div>';
      if (st.rolling) { body.innerHTML = h; ctx.actions([]); return; }
      var rule = st.alt ? S.ruleAlt : S.rule;
      h += (S.ruleShow && rule ? '<p class="pnote big">' + esc(rule) + '</p>' : '') + frameHTML(S.frame) +
        '<p class="pnote">Tap a picture to see its word. Write a story with every picture' + (ctx.level ? '' : ' (one sentence each)') + '.</p>' +
        '<div class="pbarwrap"></div><textarea class="pinput" rows="5" autocapitalize="sentences" spellcheck="true" placeholder="Once upon a time...">' + esc(st.typed) + '</textarea>';
      if (st.checked) {
        var miss = st.dice.filter(function (d) { return !used(st.typed, d.text); });
        h += '<div class="pbanner ' + (miss.length ? 'no' : 'ok') + '">' + (miss.length ? 'Missing: ' + esc(miss.map(function (d) { return d.text; }).join(', ')) : 'Every picture is in your story!') + '</div>' +
          (miss.length ? '' : '<p class="pnote">Now read it out loud.</p>');
      }
      body.innerHTML = h;
      body.querySelector('.pbarwrap').appendChild(barEl);
      body.querySelectorAll('[data-d]').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-d'); st.open[i] = !st.open[i]; WU.sound.clack(); render(); }; });
      var ta = body.querySelector('textarea'); ta.oninput = function () { st.typed = ta.value; if (st.checked) { st.checked = false; } };
      if (!st.timed) { st.timed = true; bar.start(secs, function () { P.toast('Time! Finish your sentence and check.'); WU.sound.buzzer(); }); }
      ctx.actions([{ label: 'New roll', alt: true, small: true, on: function () { bar.stop(); roll(); } },
        { label: 'Check my story', on: function () { if (!P.norm(st.typed)) { P.toast('Write your story first.'); return; } var all = st.dice.every(function (d) { return used(st.typed, d.text); }); if (!st.checked) ctx.score(all); st.checked = true; if (all) WU.sound.ding(); else WU.sound.beep(300); render(); } }]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); roll(); },
      unmount: function () { clearInterval(timer); timer = null; if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();

  /* ======================= SLOT MACHINE ======================= */
  P.games.slot = (function () {
    var body, ctx, st, bar, barEl, spinT = null;
    function L(name) { return WU.list('slot', name, ctx.level).filter(function (x) { return x.text; }); }
    function reels() {
      var S = ctx.S, r = [{ k: 'topic', label: S.topicLabel || 'TOPIC', list: L('topics') }];
      if (S.howOn && L('styles').length) r.push({ k: 'how', label: S.howLabel || 'HOW', list: L('styles') });
      if (S.twistOn && L('twists').length) r.push({ k: 'twist', label: S.twistLabel || 'TWIST', list: L('twists') });
      return r;
    }
    function secs() { return Math.max(10, Math.min(300, +ctx.S.talkSecs || 60)); }
    var decks = {};
    function spin() {
      var rs = reels(); if (!rs[0].list.length) { ctx.empty(); return; }
      bar.stop();
      st = { phase: 'spin', picks: rs.map(function (r) { return (decks[r.k] = decks[r.k] || WU.kit.deck())(r.list); }), rs: rs }; render();
      if (WU.isCalm()) { st.phase = 'ready'; render(); return; }
      var k = 0; clearInterval(spinT);
      spinT = setInterval(function () {
        if (!body) { clearInterval(spinT); return; }
        body.querySelectorAll('.sreel').forEach(function (el, i) { if (k < 6 + i * 4) { var b = el.querySelector('b'); if (b) b.textContent = WU.pick(st.rs[i].list).text; } else el.classList.add('stop'); });
        WU.sound.tick(k % 2);
        if (++k > 6 + (rs.length - 1) * 4) { clearInterval(spinT); spinT = null; st.phase = 'ready'; WU.sound.slam(); render(); }
      }, 80);
    }
    function render() {
      var S = ctx.S, h = '<div class="sreels">';
      st.rs.forEach(function (r, i) {
        var it = st.picks[i];
        h += '<div class="sreel ' + r.k + (st.phase !== 'spin' ? ' stop' : '') + '"><span>' + esc(r.label) + '</span>' +
          (it.pic && r.k !== 'twist' && st.phase !== 'spin' ? '<i class="spic">' + WU.pic(it.pic) + '</i>' : '') + '<b>' + esc(it.text) + '</b>' + (it.sub && st.phase !== 'spin' ? '<em>' + esc(it.sub) + '</em>' : '') + '</div>';
      });
      h += '</div>';
      if (st.phase !== 'spin') {
        var topic = st.picks[0], fr = topic.frame || S.frame;
        h += frameHTML(fr) + (S.ruleShow && S.rule ? '<p class="pnote big">' + esc(S.rule) + '</p>' : '') +
          '<div class="pbarwrap"></div>' + (st.phase === 'talk' ? '<div class="pbig scount" data-auto></div>' : '') +
          (st.phase === 'done' ? '<div class="pbanner ok">TIME! Well done.</div><p class="pnote">Now ask yourself one question about it, and answer it.</p>' : '') +
          (st.phase === 'ready' ? '<p class="pnote">Talk out loud about the topic until the time is up. Tip: record yourself and listen back.</p>' : '');
      }
      body.innerHTML = h;
      var wrap = body.querySelector('.pbarwrap'); if (wrap) wrap.appendChild(barEl);
      if (st.phase === 'spin') ctx.actions([]);
      else if (st.phase === 'ready') ctx.actions([{ label: 'Spin again', alt: true, small: true, on: spin }, { label: 'Start talking (' + secs() + 's)', on: talk }]);
      else if (st.phase === 'talk') ctx.actions([{ label: 'Stop', alt: true, small: true, on: function () { bar.stop(); st.phase = 'done'; render(); } }]);
      else ctx.actions([{ label: 'Spin again', on: spin }]);
    }
    function talk() {
      st.phase = 'talk'; render(); WU.sound.beep(880);
      var c = body.querySelector('.scount'), t0 = Date.now();
      bar.start(secs(), function () { if (!st) return; st.phase = 'done'; ctx.score(true); WU.sound.ding(); render(); });
      (function tick() { if (!st || st.phase !== 'talk' || !c.isConnected) return; c.textContent = Math.ceil(secs() - (Date.now() - t0) / 1000); setTimeout(tick, 250); })();
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); spin(); },
      unmount: function () { clearInterval(spinT); spinT = null; if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();
})();
