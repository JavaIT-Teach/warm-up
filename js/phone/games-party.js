/* Warm Up on a phone: the party games (see js/phone/shell.js). Same lists and screen texts as the board (WU.list, ctx.S).
   Truth or Dare (solo: write the truth, say the dare against the clock),
   Just a Minute (solo: talk against the clock, then check yourself for the three mistakes). */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;

  function list(id, name, ctx) { return WU.list(id, name, ctx.level); }
  function words(s) { return P.norm(s).split(' ').filter(Boolean).length; }
  function frameHTML(f) { return f ? '<div class="pframe">' + esc(f).replace(/___/g, '<span class="pgap"></span>') + '</div>' : ''; }
  function picHTML(pic) { return pic && WU.PICS[pic] ? '<div class="mpic">' + WU.pic(pic) + '</div>' : ''; }
  function split(t) { return String(t || '').split('/').map(function (x) { return x.trim(); }).filter(Boolean); }
  // A text box that keeps what was typed across redraws. Returns the textarea.
  function box(el, st, ph) {
    el.insertAdjacentHTML('beforeend', '<textarea class="pinput" rows="3" autocapitalize="sentences" spellcheck="true" placeholder="' + esc(ph || 'Write your answer') + '">' + esc(st.typed || '') + '</textarea>');
    var ta = el.querySelector('textarea'); ta.oninput = function () { st.typed = ta.value; }; return ta;
  }

  /* ======================= TRUTH OR DARE (solo) ======================= */
  P.games.truth = (function () {
    var body, ctx, st, bar, barEl, dT = WU.kit.deck(), dD = WU.kit.deck();
    function start() { st = { phase: 'choose', typed: '' }; render(); }
    function draw(kind) {
      var it = (kind === 'truth' ? dT : dD)(list('truth', kind === 'truth' ? 'truths' : 'dares', ctx).filter(function (x) { return x.text; }));
      if (!it) { ctx.empty(); return false; }
      st.kind = kind; st.it = it; st.typed = ''; return true;
    }
    function secs() { var S = ctx.S; return Math.max(10, st.kind === 'truth' ? +S.truthSecs || 45 : +st.it.secs || +S.dareSecs || 30); }
    function render() {
      var S = ctx.S, h = '';
      bar.stop();
      if (st.phase === 'choose') {
        h += '<p class="pnote big">' + esc(P.fill(S.choose || 'Truth or dare?', { name: 'You' })) + '</p>' +
          '<div class="pchoices"><button class="pchoice" data-k="truth" style="background:#3d6bff;color:#fff">' + esc(S.truthLabel || 'TRUTH') + '<br><small>' + esc(S.truthSub || '') + '</small></button>' +
          '<button class="pchoice" data-k="dare" style="background:#ff4fc3">' + esc(S.dareLabel || 'DARE') + '<br><small>' + esc(S.dareSub || '') + '</small></button></div>' +
          '<p class="pnote">Truth: write your answer, then say it out loud. Dare: say it before the time is up.</p>';
        body.innerHTML = h;
        body.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { if (draw(b.getAttribute('data-k'))) { st.phase = 'card'; WU.sound.slam(); render(); } }; });
        ctx.actions([]); return;
      }
      var isT = st.kind === 'truth', it = st.it;
      h += '<div class="prow"><span class="ptag" style="background:' + (isT ? '#3d6bff;color:#fff' : '#ff4fc3') + '">' + esc(isT ? S.truthLabel || 'TRUTH' : S.dareLabel || 'DARE') + '</span><span class="pcount">' + secs() + 's</span></div>' +
        '<div class="pbarwrap"></div><div class="mbig">' + esc(it.text) + '</div>';
      if (st.phase === 'card') {
        if (isT) {
          if (S.frameShow !== false) h += frameHTML(it.frame || S.frame);
          body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
          box(body, st, 'Your answer');
          bar.start(secs(), function () { WU.sound.buzzer(); });
          ctx.actions([{ label: 'Done', on: function () { if (words(st.typed) < 4) { P.toast('Say a bit more: 4 words or more.'); return; } st.phase = 'after'; ctx.score(true); WU.sound.ding(); render(); } }]);
        } else {
          h += '<p class="pnote big">Say it out loud, now!</p>';
          body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
          bar.start(secs(), function () { WU.sound.buzzer(); });
          ctx.actions([{ label: 'Skip', alt: true, on: function () { st.phase = 'after'; st.skipped = true; ctx.score(false); render(); } },
            { label: 'I did it!', on: function () { st.phase = 'after'; st.skipped = false; ctx.score(true); WU.sound.ding(); render(); } }]);
        }
        return;
      }
      if (isT) h += '<div class="pbanner ok">Nice!</div><div class="pans small">' + esc(st.typed) + '</div><p class="pnote">Now say it out loud. Then think: what would a classmate ask you next?</p>';
      else h += '<div class="pbanner ' + (st.skipped ? 'no">Next time!' : 'ok">Well done!') + '</div>';
      body.innerHTML = h;
      ctx.actions([{ label: 'Next turn', on: start }]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); start(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();

  /* ======================= JUST A MINUTE (solo: talk, then check yourself) ======================= */
  P.games.minute = (function () {
    var body, ctx, st, bar, barEl, deck = WU.kit.deck();
    function secs() { return Math.max(15, Math.min(180, +ctx.S.secs || 60)); }
    function kinds() { return ['h', 'd'].concat(ctx.S.useR ? ['r'] : []); }
    function start() { var it = deck(list('minute', 'topics', ctx).filter(function (x) { return x.text; })); if (!it) { ctx.empty(); return; } st = { it: it, phase: 'ready', marks: {} }; render(); }
    function render() {
      var S = ctx.S, h = '';
      bar.stop();
      h += '<div class="prow"><span class="ptag" style="background:var(--c)">' + esc(S.topicLabel || 'Your topic:') + '</span><span class="pcount">' + secs() + 's</span></div>' +
        '<div class="pbarwrap"></div><div class="mbig">' + esc(st.it.text) + '</div>';
      var rules = kinds().map(function (k) { return '<div class="pkv"><span>' + esc(S[k + 'Name']) + '</span>' + esc(S[k + 'Text']) + '</div>'; }).join('');
      if (st.phase === 'ready') {
        h += '<p class="pnote big">Talk out loud until the time is up. Avoid:</p>' + rules;
        body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
        ctx.actions([{ label: 'Other topic', alt: true, on: start }, { label: 'Start talking', on: function () { st.phase = 'talk'; WU.sound.ding(); render(); } }]);
        return;
      }
      if (st.phase === 'talk') {
        h += '<p class="pnote big">Talk! Don\'t stop.</p>' + rules;
        body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl);
        bar.start(secs(), function () { WU.sound.buzzer(); st.phase = 'check'; render(); });
        ctx.actions([{ label: 'I stopped', alt: true, on: function () { st.phase = 'check'; st.marks.h = true; render(); } }]);
        return;
      }
      if (st.phase === 'check') {
        h += '<div class="pbanner ok">Time!</div><p class="pq">Be honest: did you make any of these mistakes?</p>' +
          kinds().map(function (k) { return '<button class="ptog' + (st.marks[k] ? ' on' : '') + '" data-m="' + k + '" style="width:100%;text-align:left">' + (st.marks[k] ? '✗ ' : '') + esc(S[k + 'Name']) + ': ' + esc(S[k + 'Text']) + '</button>'; }).join('');
        body.innerHTML = h;
        body.querySelectorAll('[data-m]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-m'); st.marks[k] = !st.marks[k]; WU.sound.clack(); render(); }; });
        ctx.actions([{ label: 'Done', on: function () { var ok = !kinds().some(function (k) { return st.marks[k]; }); ctx.score(ok); st.phase = 'end'; st.ok = ok; if (ok) WU.sound.ding(); render(); } }]);
        return;
      }
      h += st.ok ? '<div class="pbanner ok">' + esc(P.fill(S.clean || 'You talked for {secs} seconds with no mistakes!', { name: 'You', secs: secs() })) + '</div>'
        : '<div class="pbanner no">Try again: the same topic is easier the second time.</div>';
      body.innerHTML = h;
      ctx.actions(st.ok ? [{ label: 'Next topic', on: start }] : [{ label: 'Next topic', alt: true, on: start }, { label: 'Same topic again', on: function () { st.phase = 'ready'; st.marks = {}; render(); } }]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); start(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();
})();
