/* Warm Up on a phone: NATURAL REPLIES (see js/phone/shell.js and js/games/replies.js).
   Someone says a line. A time bar runs: pick the reply that fits before it ends (3 choices: one of the right kind,
   two of other kinds). Then say it out loud. */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc, X = WU.expr;

  // Kinds that could also fit: never offered as the wrong choice. "Really?" fits almost anything, so surprise never is.
  var CLASH = { hello: ['reply'], reply: ['hello'], short: ['vague', 'agree', 'disagree'], vague: ['short', 'agree', 'disagree'],
    agree: ['short', 'vague', 'happy'], disagree: ['short', 'vague'], happy: ['agree'], thanks: ['happy'], welcome: [], sympathy: [], surprise: ['happy'] };

  P.games.replies = (function () {
    var body, ctx, st, deck = WU.kit.deck(), bar = null;
    function prompts() { return WU.list('replies', 'prompts', ctx.level).filter(function (x) { return x.line && X.list([x.cat], ctx.level).length; }); }
    function next() {
      var ps = prompts(); if (!ps.length) { ctx.empty('This level has no lines yet.'); return; }
      var it = deck(ps), right = WU.pick(X.list([it.cat], ctx.level));
      var no = CLASH[it.cat] || [];
      var others = WU.shuffle(X.CATS.filter(function (c) { return c !== it.cat && c !== 'surprise' && no.indexOf(c) < 0; }))
        .map(function (c) { return WU.pick(X.list([c], ctx.level)); }).filter(Boolean).slice(0, 2);
      st = { it: it, done: false, opts: WU.shuffle([{ text: right.text, ok: true }].concat(others.map(function (o) { return { text: o.text, ok: false }; }))) };
      render();
    }
    function render() {
      var S = ctx.S, it = st.it, h = '';
      h += '<div class="pcard2"><div class="plabel">' + esc(S.saysLabel) + '</div><div class="pqtext">“' + esc(it.line) + '”</div></div>';
      h += '<div class="pbarw"></div><div class="pq">Pick the best reply. Fast!</div><div class="popts"></div><div class="pafter"></div>';
      body.innerHTML = h;
      bar = P.bar(body.querySelector('.pbarw'));
      var el = body.querySelector('.popts');
      el.innerHTML = '<div class="pchoices">' + st.opts.map(function (o, i) { return '<button class="pchoice" data-o="' + i + '">' + esc(o.text) + '</button>'; }).join('') + '</div>';
      function finish(o) {
        if (st.done) return; st.done = true; bar.stop();
        el.querySelectorAll('[data-o]').forEach(function (x) { var oo = st.opts[+x.getAttribute('data-o')]; if (oo.ok) x.classList.add('ok'); else if (o && oo === o) x.classList.add('no'); else x.classList.add('dim'); });
        var ok = !!(o && o.ok); ctx.score(ok); P.stamp(ok, o ? null : (S.slow || 'TOO SLOW!'));
        var kind = S['c_' + it.cat] || it.cat;
        body.querySelector('.pafter').innerHTML = '<div class="pkv"><span>' + esc(kind) + '</span>' +
          X.list([it.cat], ctx.level).map(function (x) { return esc(x.text); }).join(' · ') + '<em>Say one out loud. Then try another one.</em></div>';
        ctx.actions([{ label: 'Next', on: next }]);
      }
      el.querySelectorAll('[data-o]').forEach(function (b) { b.onclick = function () { finish(st.opts[+b.getAttribute('data-o')]); }; });
      // A little more time than the board: reading takes longer than hearing.
      bar.start(Math.max(1, Math.min(10, +S.startSecs || 2)) + 4, function () { finish(null); });
      ctx.actions([]);
    }
    return { mount: function (b, c) { body = b; ctx = c; next(); }, unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; } };
  })();
})();
