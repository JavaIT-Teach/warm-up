/* Warm Up on a phone: LOST WORD (see js/phone/shell.js and js/games/lostword.js). Same three modes and content as the board,
   turned round so one student can check the answer:
   DESCRIBE IT: someone describes a word they forgot. Which word is it? (4 choices.) Then: say it yourself without the word.
   SAY IT SIMPLE: a hard sentence. Which plain sentence means the same? (3 choices.)
   TOO DIRECT: a blunt request. Which is the best way to say it here? (3 choices.) */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;
  var MODES = ['describe', 'simplify', 'polite'];

  function choices(el, opts, onPick) {
    var picked = false;
    el.innerHTML = '<div class="pchoices">' + opts.map(function (o, i) { return '<button class="pchoice" data-o="' + i + '">' + esc(o.text) + '</button>'; }).join('') + '</div>';
    el.querySelectorAll('[data-o]').forEach(function (b) {
      b.onclick = function () {
        if (picked) return; picked = true;
        var o = opts[+b.getAttribute('data-o')];
        el.querySelectorAll('[data-o]').forEach(function (x) { var oo = opts[+x.getAttribute('data-o')]; if (oo.ok) x.classList.add('ok'); else if (x === b) x.classList.add('no'); else x.classList.add('dim'); });
        onPick(o);
      };
    });
  }
  function others(list, not, n, key) {
    var seen = {}; seen[P.norm(key(not))] = 1;
    return WU.shuffle(list.slice()).filter(function (x) { var k = P.norm(key(x)); if (!k || seen[k]) return false; seen[k] = 1; return true; }).slice(0, n);
  }
  function lost(it) { return (String(it.banned || '').split(',')[0] || '').trim(); }
  function markWord(big, word) {
    var i = word ? big.toLowerCase().indexOf(word.toLowerCase()) : -1;
    if (i < 0) return esc(big);
    return esc(big.slice(0, i)) + '<mark>' + esc(big.slice(i, i + word.length)) + '</mark>' + esc(big.slice(i + word.length));
  }

  P.games.lostword = (function () {
    var body, ctx, st, decks = { describe: WU.kit.deck(), simplify: WU.kit.deck(), polite: WU.kit.deck() };
    function cards(m) {
      var all = WU.list('lostword', m, ctx.level);
      if (m === 'describe') return all.filter(function (x) { return lost(x) && x.model; });
      if (m === 'simplify') return all.filter(function (x) { return x.big && x.simple; });
      return all.filter(function (x) { return x.blunt && x.polite; });
    }
    // A mode needs enough cards for wrong choices.
    function modesHere() { return MODES.filter(function (m) { return cards(m).length >= (m === 'describe' ? 4 : 3); }); }
    function modeName(m) { var S = ctx.S; return m === 'simplify' ? S.mSimplify : m === 'polite' ? S.mPolite : S.mDescribe; }
    function next() {
      var ms = modesHere();
      if (!ms.length) { ctx.empty('This level needs more Lost Word cards.'); return; }
      var m = WU.store.get('phone-lw-mode', 'describe'); if (ms.indexOf(m) < 0) m = ms[0];
      var all = cards(m), it = decks[m](all), opts;
      if (m === 'describe') opts = [{ text: lost(it), ok: true }].concat(others(all, it, 3, lost).map(function (x) { return { text: lost(x), ok: false }; }));
      else if (m === 'simplify') opts = [{ text: it.simple, ok: true }].concat(others(all, it, 2, function (x) { return x.simple; }).map(function (x) { return { text: x.simple, ok: false }; }));
      else opts = [{ text: it.polite, ok: true }, { text: it.blunt, ok: false }].concat(others(all, it, 1, function (x) { return x.polite; }).map(function (x) { return { text: x.polite, ok: false }; }));
      st = { m: m, it: it, opts: WU.shuffle(opts), modes: ms };
      render();
    }
    function render() {
      var S = ctx.S, it = st.it, m = st.m, h = '';
      h += '<div class="prow">' + st.modes.map(function (x) { return '<button class="ptog' + (x === m ? ' on' : '') + '" data-m="' + x + '">' + esc(modeName(x)) + '</button>'; }).join('') + '</div>';
      h += '<div class="pcard2"><div class="plabel">' + esc(it.situation) + '</div>';
      if (m === 'describe') h += '<div class="pqtext">“' + esc(it.model) + '”</div>';
      else if (m === 'simplify') h += '<div class="pqtext plwq">“' + markWord(it.big, it.word) + '”</div>';
      else h += '<div class="pqtext plwr">“' + esc(it.blunt) + '”</div><div class="plabel">' + esc(S['size' + it.size] || '') + '</div>';
      h += '</div>';
      h += '<div class="pq">' + esc(m === 'describe' ? 'They forgot a word. Which one?' : m === 'simplify' ? 'Which simple sentence means the same?' : 'Which is the best way to say it here?') + '</div>';
      h += '<div class="popts"></div><div class="pafter"></div>';
      body.innerHTML = h;
      body.querySelectorAll('[data-m]').forEach(function (b) { b.onclick = function () { WU.store.set('phone-lw-mode', b.getAttribute('data-m')); next(); }; });
      choices(body.querySelector('.popts'), st.opts, function (o) {
        ctx.score(o.ok); P.stamp(o.ok);
        var a = '';
        if (m === 'describe') {
          a += '<div class="pkv"><span>' + esc(S.lModel) + '</span><b>' + esc(it.got) + '</b>' + (it.more ? '<br>' + esc(it.more) : '') + '</div>';
          a += '<div class="pkv q"><span>Your turn</span>Ask for <b>' + esc(lost(it)) + '</b> out loud. Don\'t say the word!<em>' + esc(String(S.frames || '').split('/')[0].trim()) + '</em></div>';
        } else if (m === 'simplify') a += '<div class="pkv"><span>' + esc(S.lModel) + '</span>' + esc(it.simple) + '<em>Say it out loud, then make your own simple version.</em></div>';
        else a += '<div class="pkv"><span>' + esc(S.lModel) + '</span>' + esc(it.polite) + '<em>Say it out loud. Bigger request = more polite words.</em></div>';
        body.querySelector('.pafter').innerHTML = a;
        ctx.actions([{ label: 'Next', on: next }]);
      });
      ctx.actions([]);
    }
    return { mount: function (b, c) { body = b; ctx = c; next(); }, unmount: function () { body = ctx = st = null; } };
  })();
})();
