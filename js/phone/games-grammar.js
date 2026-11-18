/* Warm Up on a phone: Time Machine, Phrasal Roulette, Flash Room, Near & Far, Hide & Seek Cat (see js/phone/shell.js).
   Time Machine and Hide & Seek Cat use the board games' own grammar and scenes (WU.engines, set by js/games/*.js). */
(function () {
  'use strict';
  var WU = window.WU, P = WU.phone, esc = WU.esc;
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  // A multiple-choice block: options [{ text, ok }], onPick(option). After a pick: the right one green, a wrong pick red.
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
  // n distinct items from list (not "not").
  function others(list, not, n, key) {
    var seen = {}; seen[key(not)] = 1;
    return WU.shuffle(list).filter(function (x) { var k = key(x); if (!k || seen[k]) return false; seen[k] = 1; return true; }).slice(0, n);
  }

  /* ======================= TIME MACHINE ======================= */
  P.games.timemachine = (function () {
    var body, ctx, st, E;
    // Contractions written either way count: don't = do not, she's = she is / she has.
    function variants(s) {
      var t = P.norm(s).replace(/\bwon't\b/g, 'will not').replace(/\bcan't\b/g, 'can not').replace(/\bcannot\b/g, 'can not').replace(/n't\b/g, ' not')
        .replace(/'m\b/g, ' am').replace(/'re\b/g, ' are').replace(/'ve\b/g, ' have').replace(/'ll\b/g, ' will').replace(/\s+/g, ' ').trim();
      var out = [t];
      if (/'s\b/.test(t)) out = [t.replace(/'s\b/g, ' is'), t.replace(/'s\b/g, ' has')];
      if (/'d\b/.test(t)) out = out.reduce(function (a, x) { return a.concat([x.replace(/'d\b/g, ' had'), x.replace(/'d\b/g, ' would')]); }, []);
      return out.map(function (x) { return x.replace(/\s+/g, ' ').trim(); });
    }
    function famId() { var fs = E.families(), f = WU.store.get('phone-tm-fam', ''); return fs.some(function (x) { return x.id === f; }) ? f : (fs[0] ? fs[0].id : ''); }
    function next() {
      var r = E.pick(famId()); if (!r) { ctx.empty('No tenses for this level yet.'); return; }
      st = { r: r, phase: 'ask', typed: '', hint: false, ex: E.example(r) }; render();
    }
    function check() {
      var ans = E.answers(st.r).map(E.asText), mine = variants(st.typed);
      var ok = ans.some(function (a) { var A = variants(a)[0]; return mine.indexOf(A) >= 0; });
      st.phase = 'done'; st.ok = ok; ctx.score(ok); if (ok) WU.sound.ding(); else WU.sound.beep(300); render();
    }
    function win(label, html, cls) { return '<div class="tw ' + (cls || '') + '"><span>' + esc(label) + '</span><div>' + html + '</div></div>'; }
    function render() {
      var S = E.scr.get(ctx.level), r = E.round(st.r), h = '';
      if (!r) { next(); return; }
      var fs = E.families(), sk = { plus: ['plus', 'plusName'], minus: ['minus', 'minusName'], q: ['q', 'qName'] }[r.sign];
      h += '<div class="prow"><select class="psel" aria-label="Tenses">' + fs.map(function (f) { return '<option value="' + f.id + '"' + (f.id === famId() ? ' selected' : '') + '>' + esc(S['f_' + f.id] || f.id) + '</option>'; }).join('') + '</select>' +
        '<button class="ptog' + (E.silly() ? ' on' : '') + '" data-act="silly">' + esc(S.silly || 'SILLY') + '</button></div>';
      h += '<div class="tgrid">' + win(S.lWho, '<b>' + esc(r.s.text) + '</b>', 'who') +
        win(S.lWhat, (r.v.pic ? '<span class="tpic">' + WU.pic(r.v.pic) + '</span>' : '') + '<b>' + esc((r.v.base + ' ' + r.v.rest).trim()) + '</b>', 'what') +
        win(S.lWhen, '<b>' + esc(r.m.text) + '</b>', 'when') +
        win(S.lSign, '<b class="tsign">' + esc(S[sk[0]]) + '</b><em>' + esc(S[sk[1]]) + '</em>', 'sign ' + r.sign) + '</div>';
      var hintHtml = '<div class="thint"><div><span>' + esc(S.lPattern || 'PATTERN') + '</span>' + esc(S['x_' + r.m.tense] || '') + '</div>' +
        (st.ex ? '<div><span>' + esc(S.lExample || 'EXAMPLE') + '</span>' + E.asHTML(E.build(st.ex.m.tense, st.ex.sign, st.ex.s, st.ex.v, st.ex.m.text)) + '</div>' : '') + '</div>';
      if (st.phase === 'ask') {
        if (st.hint || S.hintAuto) h += hintHtml;
        h += '<textarea class="pinput" rows="2" autocapitalize="sentences" autocomplete="off" spellcheck="false" placeholder="Write the sentence">' + esc(st.typed) + '</textarea>';
      } else {
        var ans = E.answers(st.r);
        h += '<div class="pbanner ' + (st.ok ? 'ok' : 'no') + '">' + (st.ok ? 'RIGHT!' : 'NOT QUITE') + '</div>' +
          (st.typed ? '<div class="plabel">You wrote</div><div class="pmine">' + esc(st.typed) + '</div>' : '') +
          '<div class="plabel">' + esc(S['n_' + r.m.tense] || E.TNAMES[r.m.tense]) + '</div><div class="pans">' + ans.map(E.asHTML).join('<i> ' + esc(S.orWord || 'or') + ' </i>') + '</div>' +
          (S.revealExample ? hintHtml : '');
      }
      body.innerHTML = h;
      var sel = body.querySelector('select'); sel.onchange = function () { WU.store.set('phone-tm-fam', sel.value); next(); };
      body.querySelector('[data-act="silly"]').onclick = function () { WU.store.set('tm-silly', !E.silly()); next(); };
      var ta = body.querySelector('textarea'); if (ta) ta.oninput = function () { st.typed = ta.value; };
      ctx.actions(st.phase === 'ask'
        ? [{ label: st.hint || S.hintAuto ? 'Show answer' : 'Help', alt: true, small: true, on: function () { if (st.hint || S.hintAuto) { st.phase = 'done'; st.ok = false; ctx.score(false); render(); } else { st.hint = true; render(); } } },
          { label: 'Check', on: function () { if (!P.norm(st.typed)) { P.toast('Write the sentence first.'); return; } check(); } }]
        : (st.ok ? [{ label: 'Next', on: next }] : [{ label: 'I was right', alt: true, small: true, on: function () { ctx.score(true); next(); } }, { label: 'Next', on: next }]));
    }
    return {
      mount: function (b, c) { body = b; ctx = c; E = WU.engines && WU.engines.timemachine; if (!E) { ctx.empty(); return; } next(); },
      unmount: function () { body = ctx = st = null; }
    };
  })();

  /* ======================= PHRASAL ROULETTE ======================= */
  P.games.phrasal = (function () {
    var body, ctx, st, deck = WU.kit.deck(), spinT = null;
    function split() { return !!WU.store.get('phone-pv-split', false); }
    function verbs() { var sp = split(); return WU.list('phrasal', 'verbs', ctx.level).filter(function (v) { return v.verb && v.particle && v.meaning && (!sp || v.sep); }); }
    function pv(v) { return v.verb + ' ' + v.particle; }
    function toVerb() { return !!WU.store.get('phone-pv-dir', false); }
    function next() {
      var all = verbs(), v = deck(all); if (!v) { ctx.empty(); return; }
      if (all.length < 3) { ctx.empty('This level needs at least 3 phrasal verbs.'); return; }
      var dir = toVerb(), sp = split(), key = dir ? pv : function (x) { return x.meaning; };
      var opts = sp ? [{ text: v.verb + ' it ' + v.particle, ok: v.sep === 'yes' }, { text: v.verb + ' ' + v.particle + ' it', ok: v.sep === 'no' }]
        : WU.shuffle([{ text: key(v), ok: true }].concat(others(all, v, 2, key).map(function (x) { return { text: key(x), ok: false }; })));
      if (sp) dir = false;
      st = { v: v, phase: 'spin', opts: opts, dir: dir, sp: sp }; render();
      if (dir || WU.isCalm()) { st.phase = 'ask'; render(); return; }
      // The reels spin, then stop on the verb.
      var n = 0, vs = all.map(function (x) { return x.verb; }), ps = all.map(function (x) { return x.particle; });
      clearInterval(spinT);
      spinT = setInterval(function () {
        if (!body) { clearInterval(spinT); return; }
        var a = body.querySelector('.rv1 b'), b = body.querySelector('.rv2 b');
        if (a) a.textContent = WU.pick(vs); if (b && n < 14) b.textContent = WU.pick(ps); WU.sound.tick(n % 2);
        if (++n >= 9 && a) a.textContent = st.v.verb;
        if (n >= 15) { clearInterval(spinT); spinT = null; st.phase = 'ask'; WU.sound.slam(); render(); }
      }, 70);
    }
    function render() {
      var S = ctx.S, v = st.v, h = '';
      h += '<div class="prow">' + (st.sp ? '' : '<button class="ptog' + (st.dir ? ' on' : '') + '" data-act="dir">' + esc(st.dir ? S.mToVerb : S.mToMeaning) + '</button>') +
        '<button class="ptog' + (st.sp ? ' on' : '') + '" data-act="split">' + esc(S.mSplit || 'SPLIT?') + '</button></div>';
      if (st.dir) h += '<div class="pcard2"><div class="plabel">' + esc(S.lMeaning) + '</div><div class="pqtext">' + esc(v.meaning) + '</div></div>';
      else h += '<div class="reels"><div class="reel rv1"><span>' + esc(S.lVerb) + '</span><b>' + esc(v.verb) + '</b></div><div class="reel rv2"><span>' + esc(S.lPart) + '</span><b>' + esc(st.phase === 'spin' ? '?' : v.particle) + '</b></div></div>';
      h += '<div class="pq">' + esc(st.sp ? 'Where does "it" go?' : st.dir ? 'Which phrasal verb?' : 'What does it mean?') + '</div><div class="popts"></div><div class="pafter"></div>';
      body.innerHTML = h;
      var db = body.querySelector('[data-act="dir"]'); if (db) db.onclick = function () { WU.store.set('phone-pv-dir', !toVerb()); next(); };
      body.querySelector('[data-act="split"]').onclick = function () { WU.store.set('phone-pv-split', !split()); next(); };
      if (st.phase === 'spin') { ctx.actions([]); return; }
      choices(body.querySelector('.popts'), st.opts, function (o) {
        ctx.score(o.ok); P.stamp(o.ok);
        var a = '<div class="pkv"><span>' + esc(S.lMeaning) + '</span><b>' + esc(pv(v)) + '</b> = ' + esc(v.meaning) + '</div>' +
          (v.example ? '<div class="pkv"><span>' + esc(S.lExample) + '</span>' + esc(v.example) + '</div>' : '') +
          (S.questionShow && v.question ? '<div class="pkv q"><span>' + esc(S.lQuestion) + '</span>' + esc(v.question) + '<em>Answer out loud with “' + esc(pv(v)) + '”.</em></div>' : '');
        body.querySelector('.pafter').innerHTML = a;
        ctx.actions([{ label: 'Spin again', on: next }]);
      });
      ctx.actions([]);
    }
    return { mount: function (b, c) { body = b; ctx = c; next(); }, unmount: function () { clearInterval(spinT); spinT = null; body = ctx = st = null; } };
  })();

  /* ======================= FLASH ROOM ======================= */
  P.games.flash = (function () {
    var body, ctx, st, bar, barEl;
    function things() { return WU.list('flash', 'things', ctx.level).filter(function (x) { return x.pic; }); }
    function ex(it) { return { w: it.word || WU.picName(it.pic), art: it.art, pl: it.pl }; }
    function numWord(n) { var w = String(ctx.S.nums || '').split(',').map(function (x) { return x.trim(); }); return w[n - 2] || String(n); }
    function phrase(it, n) { return n === 1 ? WU.phrase(ex(it), 'a') : numWord(n) + ' ' + WU.phrase(ex(it), 'pl'); }
    function sentence(it, n) { var S = ctx.S; return String(n === 1 ? S.one : S.many).replace('___', phrase(it, n)); }
    function canMany(it) { return !!it.art && it.art !== 'the'; }
    function newRoom() {
      var S = ctx.S, all = WU.shuffle(things());
      if (all.length < 3) { ctx.empty(); return; }
      var k = Math.max(2, Math.min(6, +S.items || 4, all.length - 1)), most = Math.max(1, Math.min(5, +S.most || 4));
      var cells = all.slice(0, k).map(function (it) { return { it: it, n: canMany(it) ? 1 + WU.rand(most) : 1 }; }), spare = all.slice(k);
      // Questions: things that were there and things that were not, one at a time.
      var nq = Math.max(3, Math.min(6, +S.quiz || 3)), have = WU.shuffle(cells.slice()), not = WU.shuffle(spare), q = [];
      for (var i = 0; i < nq; i++) {
        var useNot = not.length && (Math.random() < 0.5 || !have.length);
        if (useNot) { var it = not.pop(); q.push({ it: it, n: 0, many: canMany(it) && Math.random() < 0.5 }); }
        else if (have.length) { var c = have.pop(); q.push({ it: c.it, n: c.n, many: c.n > 1 }); }
      }
      st = { cells: cells, quiz: q, qi: -1, phase: 'ready' }; render();
    }
    function look() { st.phase = 'look'; render(); bar.start(Math.max(2, +ctx.S.seconds || 8), function () { st.phase = 'quiz'; st.qi = 0; WU.sound.slam(); render(); }); }
    function render() {
      var S = ctx.S, h = '';
      if (st.phase === 'ready') {
        h += '<div class="pbig">' + esc(P.fill(S.ready, { n: Math.max(2, +S.seconds || 8) })) + '</div><p class="pnote">Remember what you see and how many.</p>';
        body.innerHTML = h; ctx.actions([{ label: 'Show the room', on: look }]); return;
      }
      if (st.phase === 'look') {
        h += '<div class="pbarwrap"></div><div class="froom">' + st.cells.map(function (c) {
          var pics = ''; for (var i = 0; i < c.n; i++) pics += '<span class="fp">' + WU.pic(c.it.pic) + '</span>';
          return '<div class="fcell n' + c.n + '">' + pics + '</div>';
        }).join('') + '</div>';
        body.innerHTML = h; body.querySelector('.pbarwrap').appendChild(barEl); ctx.actions([]); return;
      }
      if (st.phase === 'end') {
        h += '<div class="pbig">' + esc(S.hidden || 'What was in the room?') + '</div><div class="flist">' + st.cells.map(function (c) {
          return '<div class="fli"><span class="fpic">' + WU.pic(c.it.pic) + '</span><span>' + esc(sentence(c.it, c.n)) + '</span></div>';
        }).join('') + '</div>';
        body.innerHTML = h; ctx.actions([{ label: 'New room', on: newRoom }]); return;
      }
      var q = st.quiz[st.qi], form = q.many ? 'pl' : 'a', yes = q.n > 0;
      var qt = String(q.many ? S.qMany : S.qOne).replace('___', WU.phrase(ex(q.it), form));
      h += '<div class="prow"><span class="ptag" style="background:#ffe600">' + esc(S.quizTag) + '</span><span class="pcount">' + (st.qi + 1) + ' / ' + st.quiz.length + '</span></div>' +
        '<div class="pcard2"><div class="ppic">' + WU.pic(q.it.pic) + '</div><div class="pqtext">' + esc(qt) + '</div></div><div class="popts"></div><div class="pafter"></div>';
      body.innerHTML = h;
      // All four short answers: true or not, and the right form (one / more).
      var opts = [['yesOne', yes && !q.many], ['noOne', !yes && !q.many], ['yesMany', yes && q.many], ['noMany', !yes && q.many]]
        .filter(function (x) { return S[x[0]]; }).map(function (x) { return { text: S[x[0]], ok: x[1] }; });
      choices(body.querySelector('.popts'), opts, function (o) {
        ctx.score(o.ok); P.stamp(o.ok);
        if (yes) body.querySelector('.pafter').innerHTML = '<div class="pkv"><span>In the room</span>' + esc(sentence(q.it, q.n)) + '</div>';
        ctx.actions([{ label: st.qi + 1 < st.quiz.length ? 'Next question' : 'See the room', on: function () { if (st.qi + 1 < st.quiz.length) st.qi++; else st.phase = 'end'; render(); } }]);
      });
      ctx.actions([]);
    }
    return {
      mount: function (b, c) { body = b; ctx = c; barEl = document.createElement('div'); bar = P.bar(barEl); newRoom(); },
      unmount: function () { if (bar) bar.stop(); body = ctx = st = bar = null; }
    };
  })();

  /* ======================= NEAR & FAR ======================= */
  P.games.nearfar = (function () {
    var body, ctx, st, deck = WU.kit.deck(), K = '#0d0d0d', SKIN = '#f5c9a0';
    function things() { return WU.list('nearfar', 'things', ctx.level).filter(function (x) { return x.pic; }); }
    function canMany(it) { return !!it.art && it.art !== 'the'; }
    function ex(it) { return { w: it.word || WU.picName(it.pic), art: it.art, pl: it.pl }; }
    function slot(near) { var it = deck(things()); return it ? { it: it, near: near, many: canMany(it) && WU.rand(100) < (+ctx.S.manyChance || 0), n: 2 + WU.rand(2) } : null; }
    function form(s) { var S = ctx.S; return s.near ? (s.many ? S.many : S.one) : (s.many ? S.manyFar : S.oneFar); }
    function parts(s) { var t = String(form(s) || '').replace('___', WU.phrase(ex(s.it), s.many ? 'pl' : 'a')), m = /^(\S+)\s*(.*)$/.exec(t); return m ? [m[1], m[2]] : [t, '']; }
    function firstWords() { var S = ctx.S, o = []; [S.one, S.many, S.oneFar, S.manyFar].forEach(function (f) { var w = String(f || '').split(/\s+/)[0]; if (w && o.indexOf(w) < 0) o.push(w); }); return o; }
    function hand() {
      return '<svg viewBox="0 0 140 80"><rect x="-20" y="18" width="40" height="54" fill="#3d6bff" stroke="' + K + '" stroke-width="5"></rect>' +
        '<rect x="14" y="20" width="58" height="50" rx="16" fill="' + SKIN + '" stroke="' + K + '" stroke-width="5"></rect>' +
        '<rect x="56" y="22" width="78" height="18" rx="9" fill="' + SKIN + '" stroke="' + K + '" stroke-width="5"></rect>' +
        '<rect x="34" y="6" width="34" height="18" rx="9" fill="' + SKIN + '" stroke="' + K + '" stroke-width="5"></rect>' +
        '<path d="M44 48 h22 M44 60 h20" stroke="' + K + '" stroke-width="4" stroke-linecap="round"></path></svg>';
    }
    function zone(s) { var n = s.many ? s.n : 1, h = ''; for (var i = 0; i < n; i++) h += '<div class="nfp">' + WU.pic(s.it.pic) + '</div>'; return '<div class="nfitems ' + (s.near ? 'near' : 'far') + (n > 1 ? ' many' : '') + '">' + h + '</div>'; }
    function next() {
      if (things().length < 2) { ctx.empty(); return; }
      var slots;
      if (ctx.S.pairs) { slots = [slot(true), slot(false)]; if (slots[0].it.id === slots[1].it.id) slots[1] = slot(false); }
      else slots = [slot(Math.random() < 0.5)];
      st = { slots: slots, i: 0, picks: [], allOk: true }; render();
    }
    function sentenceHTML(upto) {
      var S = ctx.S;
      return st.slots.slice(0, upto).map(function (s, i) {
        var p = parts(s), first = p[0], rest = p[1];
        if (i > 0) first = first.charAt(0).toLowerCase() + first.slice(1);
        if (i < st.slots.length - 1) rest = rest.replace(/[.!]$/, '');
        return '<em>' + esc(first) + '</em> ' + esc(rest);
      }).join(' ' + esc(S.join || 'and') + ' ');
    }
    function render() {
      var S = ctx.S, near = st.slots.filter(function (s) { return s.near; })[0], far = st.slots.filter(function (s) { return !s.near; })[0], h = '';
      h += '<div class="nfg"><div class="nfscene"><div class="nffloor"></div><div class="nfhz"></div>' +
        (S.zoneShow && S.farTag ? '<div class="nftag far">' + esc(S.farTag) + '</div>' : '') + (S.zoneShow && S.nearTag ? '<div class="nftag near">' + esc(S.nearTag) + '</div>' : '') +
        (far ? zone(far) + '<div class="nfhand far">' + hand() + '</div>' : '') + (near ? zone(near) + '<div class="nfhand near">' + hand() + '</div>' : '') + '</div></div>';
      var done = st.i >= st.slots.length, s = st.slots[st.i];
      if (!done) {
        var p = parts(s);
        h += '<div class="pq">' + (st.slots.length > 1 ? (s.near ? 'The near thing:' : 'Now the far thing:') : 'Say the sentence. Which word starts it?') + '</div>' +
          '<div class="pans small">' + (st.i ? sentenceHTML(st.i) + ' ' + esc(S.join || 'and') + ' ' : '') + '<span class="gapw">____</span> ' + esc(p[1]) + '</div><div class="popts"></div>';
      } else h += '<div class="pbanner ' + (st.allOk ? 'ok' : 'no') + '">' + (st.allOk ? 'RIGHT!' : 'NOT QUITE') + '</div><div class="pans">' + sentenceHTML(st.slots.length) + '</div><p class="pnote">Say it out loud.</p>';
      body.innerHTML = h;
      if (!done) {
        var want = parts(s)[0], wl = want.toLowerCase();
        choices(body.querySelector('.popts'), firstWords().map(function (w) { return { text: st.i ? w.toLowerCase() : w, ok: w.toLowerCase() === wl }; }), function (o) {
          if (!o.ok) st.allOk = false;
          setTimeout(function () { if (!st) return; st.i++; if (st.i >= st.slots.length) { ctx.score(st.allOk); if (st.allOk) WU.sound.ding(); else WU.sound.buzzer(); } else WU.sound.pop(); render(); }, o.ok ? 450 : 1100);
        });
        ctx.actions([]);
      } else ctx.actions([{ label: 'Next', on: next }]);
    }
    return { mount: function (b, c) { body = b; ctx = c; next(); }, unmount: function () { body = ctx = st = null; } };
  })();

  /* ======================= HIDE & SEEK CAT ======================= */
  P.games.where = (function () {
    var body, ctx, st, E, anim = null, deck = WU.kit.deck(), pdeck = WU.kit.deck();
    // The board scene is 1768 x 588; the phone shows its middle part, scaled to the screen width.
    var X0 = 300, X1 = 1520;
    function next() {
      var ms = E.movers(), ps = E.places();
      if (!ms.length || ps.length < 2) { ctx.empty(); return; }
      var m = deck(ms), p = pdeck(ps);
      // Three wrong words from the same kind (still or moving) when possible.
      var same = ps.filter(function (x) { return x.move === p.move && x.id !== p.id; }), pool = same.length >= 3 ? same : ps.filter(function (x) { return x.id !== p.id; });
      var S = E.scr.get(ctx.level), word = function (x) { return S['w_' + x.id] || E.NAMES[x.id]; };
      var opts = WU.shuffle([{ text: word(p), ok: true }].concat(others(pool, p, 3, word).map(function (x) { return { text: word(x), ok: false }; })));
      st = { m: m, p: p, opts: opts, phase: 'ask' }; render();
    }
    function sentence() {
      var S = E.scr.get(ctx.level), p = st.p, prep = S['w_' + p.id] || E.NAMES[p.id], ref = S['r_' + p.ref] || '';
      return esc(String(p.move ? S.move : S.place)).replace(/\{(\w+)\}/g, function (x, k) { return k === 'prep' ? '<em>' + esc(prep) + '</em>' : k === 'thing' ? esc(st.m.word) : k === 'ref' ? esc(ref) : x; });
    }
    function fitScene() {
      var wrap = body && body.querySelector('.wswrap'), sc = wrap && wrap.querySelector('.wsscene'); if (!sc) return;
      var k = wrap.clientWidth / (X1 - X0);
      sc.style.transform = 'scale(' + k + ') translateX(' + (-X0) + 'px)'; wrap.style.height = Math.round(588 * k) + 'px';
    }
    function play() {
      if (anim) { try { anim.cancel(); } catch (e) {} anim = null; }
      var el = body && body.querySelector('.wsmover'); if (!st.p.move || !el || WU.isCalm() || !el.animate) return;
      var path = E.PATH[st.p.id], n = path.length;
      anim = el.animate(path.map(function (s, i) { return { left: s[0] + 'px', top: s[1] + 'px', transform: 'scale(' + s[2] + ')', zIndex: s[3], offset: s[4] != null ? s[4] : i / (n - 1) }; }),
        { duration: 900 + 650 * n, easing: 'ease-in-out', fill: 'forwards' });
      WU.sound.pop();
    }
    function render() {
      var S = E.scr.get(ctx.level), p = st.p, m = st.m, h = '';
      var spot = p.move ? E.PATH[p.id][E.PATH[p.id].length - 1] : E.SPOT[p.id], from = p.move && !WU.isCalm() && st.phase === 'ask' ? E.PATH[p.id][0] : spot;
      h += '<div class="pq">' + esc(P.fill(p.move ? S.askMove : S.ask, { thing: m.word })) + '</div>' +
        '<div class="wsg wswrap"><div class="wsscene"><div class="wsground"></div>' + E.scenery(p.id) + '<div class="wsmover" style="' + E.style(from) + '">' + WU.pic(m.pic) + '</div></div></div>' +
        '<div class="popts"></div><div class="pafter"></div>';
      body.innerHTML = h;
      fitScene();
      if (st.phase === 'ask') play();
      choices(body.querySelector('.popts'), st.opts, function (o) {
        ctx.score(o.ok); P.stamp(o.ok);
        if (anim) { try { anim.finish(); } catch (e) {} }
        body.querySelector('.pafter').innerHTML = '<div class="pans">' + sentence() + '</div>';
        ctx.actions([{ label: 'Next', on: next }]);
      });
      ctx.actions(p.move ? [{ label: 'Watch again', alt: true, on: play }] : []);
    }
    function onResize() { fitScene(); }
    return {
      mount: function (b, c) { body = b; ctx = c; E = WU.engines && WU.engines.where; if (!E) { ctx.empty(); return; } window.addEventListener('resize', onResize); next(); },
      unmount: function () { window.removeEventListener('resize', onResize); if (anim) { try { anim.cancel(); } catch (e) {} } anim = null; body = ctx = st = null; }
    };
  })();
})();
