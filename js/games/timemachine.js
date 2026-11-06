/* Warm Up: TIME MACHINE (grammar game G6, all levels). Trains: tenses, one family at a time.
   Space spins four windows: WHO (she), DO WHAT (play football), WHEN (since this morning) and TYPE (+ / - / ?).
   WHEN gives away the tense. The picked student builds the sentence; Space reveals it with the tense name.
   T chooses the family: all tenses, simple only, continuous only, perfect only, perfect continuous only,
   present only, past only or future only (from the tenses this level uses).
   Keys: Space spin / reveal, T tense family, P other student, 1-4 team points.
   Content: content/timemachine.js (the same lists at every level) and Screen text & timing (tenses per level). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var TENSES = ['ps', 'pc', 'pp', 'ppc', 'pas', 'pac', 'pap', 'papc', 'fs', 'fc', 'fp', 'fpc'];
  var FAMILIES = [
    ['all', TENSES], ['simple', ['ps', 'pas', 'fs']], ['cont', ['pc', 'pac', 'fc']], ['perf', ['pp', 'pap', 'fp']], ['perfc', ['ppc', 'papc', 'fpc']],
    ['present', ['ps', 'pc', 'pp', 'ppc']], ['past', ['pas', 'pac', 'pap', 'papc']], ['future', ['fs', 'fc', 'fp', 'fpc']]
  ];
  var TNAMES = { ps: 'present simple', pc: 'present continuous', pp: 'present perfect', ppc: 'present perfect continuous', pas: 'past simple', pac: 'past continuous',
    pap: 'past perfect', papc: 'past perfect continuous', fs: 'future simple', fc: 'future continuous', fp: 'future perfect', fpc: 'future perfect continuous' };
  var TOPTS = TENSES.map(function (t) { return [t, TNAMES[t]]; });

  var fields = [
    { type: 'head', label: 'The machine' },
    { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
    { k: 'lWho', label: 'Window 1', type: 'text', max: 14 }, { k: 'lWhat', label: 'Window 2', type: 'text', max: 14 },
    { k: 'lWhen', label: 'Window 3', type: 'text', max: 14 }, { k: 'lSign', label: 'Window 4', type: 'text', max: 14 },
    { k: 'who', label: 'Picked student ({name})', type: 'text', max: 50 },
    { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
    { k: 'seconds', label: 'Time bar (seconds, 0 = none)', type: 'num', min: 0, max: 60 },
    { type: 'head', label: 'Sentence types' },
    { k: 'sPlus', label: 'Positive', type: 'bool', on: 'Use', off: "Don't use" }, { k: 'plus', label: 'Positive: symbol', type: 'text', max: 4 }, { k: 'plusName', label: 'Positive: word', type: 'text', max: 16 },
    { k: 'sMinus', label: 'Negative', type: 'bool', on: 'Use', off: "Don't use" }, { k: 'minus', label: 'Negative: symbol', type: 'text', max: 4 }, { k: 'minusName', label: 'Negative: word', type: 'text', max: 16 },
    { k: 'sQ', label: 'Question', type: 'bool', on: 'Use', off: "Don't use" }, { k: 'q', label: 'Question: symbol', type: 'text', max: 4 }, { k: 'qName', label: 'Question: word', type: 'text', max: 16 },
    { k: 'goingTo', label: 'Future simple: also show "going to"', type: 'bool', on: 'Show', off: 'Hide' }, { k: 'orWord', label: 'Word between the two answers', type: 'text', max: 8 },
    { type: 'head', label: 'Tenses used at this level' }
  ];
  TENSES.forEach(function (t) { fields.push({ k: 't_' + t, label: TNAMES[t], type: 'bool', on: 'Use', off: "Don't use" }); });
  fields.push({ type: 'head', label: 'Names on screen' });
  TENSES.forEach(function (t) { fields.push({ k: 'n_' + t, label: 'Name: ' + TNAMES[t], type: 'text', max: 32 }); });
  FAMILIES.forEach(function (f) { fields.push({ k: 'f_' + f[0], label: 'Family (T key): ' + f[0], type: 'text', max: 28 }); });
  fields.push({ k: 'demo', label: 'Teacher demo banner (first spin only)', type: 'text', max: 40 }, { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' });

  var scr = kit.screen({ game: 'timemachine', title: 'Time Machine', content: function () { return WU.content.timemachineScreen; }, fields: fields });
  var C = function () { return WU.content.timemachine; };
  WU.registerList('timemachine', 'subjects', {
    gameTitle: 'Time Machine', label: 'WHO (subjects)', global: true,
    defaults: function () { return C().subjects; },
    norm: function (r) { return { text: r.text || '', p: r.p || '3s' }; },
    fields: function () { return [{ k: 'text', label: 'Subject', type: 'text', max: 30 }, { k: 'p', label: 'Person', type: 'select', options: [['1s', 'I'], ['2s', 'you'], ['3s', 'he / she / it'], ['1p', 'we'], ['3p', 'they']] }]; },
    blank: function () { return { text: 'my sister', p: '3s' }; }
  });
  WU.registerList('timemachine', 'verbs', {
    gameTitle: 'Time Machine', label: 'DO WHAT (verbs)', global: true,
    defaults: function () { return C().verbs; },
    norm: function (r) { return { base: r.base || '', s: r.s || '', ing: r.ing || '', past: r.past || '', pp: r.pp || '', rest: r.rest || '', pic: r.pic || '' }; },
    title: function (it) { return (it.base + ' ' + it.rest).trim() || '(empty)'; },
    fields: function () {
      return [{ k: 'base', label: 'Verb (play)', type: 'text', max: 20 }, { k: 's', label: 'he / she form (plays)', type: 'text', max: 20 }, { k: 'ing', label: '-ing form (playing)', type: 'text', max: 20 },
        { k: 'past', label: 'Past simple (played)', type: 'text', max: 20 }, { k: 'pp', label: 'Past participle (played)', type: 'text', max: 20 },
        { k: 'rest', label: 'Words after the verb (football)', type: 'text', max: 30 }, { k: 'pic', label: 'Picture', type: 'pic' }];
    },
    blank: function () { return { base: 'play', s: 'plays', ing: 'playing', past: 'played', pp: 'played', rest: 'tennis', pic: '' }; }
  });
  WU.registerList('timemachine', 'markers', {
    gameTitle: 'Time Machine', label: 'WHEN (time phrases)', global: true,
    defaults: function () { return C().markers; },
    norm: function (r) { return { tense: r.tense || 'ps', text: r.text || '' }; },
    title: function (it) { return it.text + ' (' + TNAMES[it.tense] + ')'; },
    fields: function () { return [{ k: 'text', label: 'Time phrase (goes at the end)', type: 'text', max: 50 }, { k: 'tense', label: 'Tense it fits', type: 'select', options: TOPTS }]; },
    blank: function () { return { tense: 'ps', text: 'every morning' }; }
  });

  var sh, box, st, offContent = null, spinT = null, bar = gram.bar();

  /* ---------- the grammar ---------- */
  function be(p, past) { return past ? (p === '1s' || p === '3s' ? 'was' : 'were') : (p === '1s' ? 'am' : p === '3s' ? 'is' : 'are'); }
  function beNot(p, past) { return past ? (p === '1s' || p === '3s' ? "wasn't" : "weren't") : (p === '1s' ? 'am not' : p === '3s' ? "isn't" : "aren't"); }
  function has(p) { return p === '3s' ? 'has' : 'have'; }
  // [auxiliary, rest-of-verb] for a tense; aux null = no auxiliary (positive simple).
  function verbParts(t, p, v) {
    switch (t) {
      case 'ps': return { aux: p === '3s' ? 'does' : 'do', neg: p === '3s' ? "doesn't" : "don't", plus: p === '3s' ? v.s : v.base, main: v.base };
      case 'pas': return { aux: 'did', neg: "didn't", plus: v.past, main: v.base };
      case 'pc': return { aux: be(p), neg: beNot(p), main: v.ing };
      case 'pac': return { aux: be(p, true), neg: beNot(p, true), main: v.ing };
      case 'pp': return { aux: has(p), neg: has(p) + "n't", main: v.pp };
      case 'ppc': return { aux: has(p), neg: has(p) + "n't", main: 'been ' + v.ing };
      case 'pap': return { aux: 'had', neg: "hadn't", main: v.pp };
      case 'papc': return { aux: 'had', neg: "hadn't", main: 'been ' + v.ing };
      case 'fs': return { aux: 'will', neg: "won't", main: v.base };
      case 'fc': return { aux: 'will', neg: "won't", main: 'be ' + v.ing };
      case 'fp': return { aux: 'will', neg: "won't", main: 'have ' + v.pp };
      case 'fpc': return { aux: 'will', neg: "won't", main: 'have been ' + v.ing };
      case 'going': return { aux: be(p), neg: beNot(p), main: 'going to ' + v.base };
    }
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  // Returns [before-verb, verb words, after] so the verb can be highlighted.
  function build(t, sign, subj, v, when) {
    var vp = verbParts(t, subj.p, v), s = subj.text, end = [v.rest, when].filter(Boolean).join(' ');
    var neg = vp.neg;
    if (sign === 'q') return { pre: '', verb: cap(vp.aux) + ' ' + s + ' ' + vp.main, post: (end ? ' ' + end : '') + '?' };
    if (sign === 'minus') {
      if (subj.p === '1s' && neg === 'am not') return { pre: cap(s) + ' ', verb: "'m not " + vp.main, post: (end ? ' ' + end : '') + '.', glue: true };
      return { pre: cap(s) + ' ', verb: neg + ' ' + vp.main, post: (end ? ' ' + end : '') + '.' };
    }
    return { pre: cap(s) + ' ', verb: vp.plus || (vp.aux + ' ' + vp.main), post: (end ? ' ' + end : '') + '.' };
  }
  function asText(b) { return (b.glue ? b.pre.trim() : b.pre) + b.verb + b.post; }
  function asHTML(b) { return WU.esc(b.glue ? b.pre.trim() : b.pre) + '<em>' + WU.esc(b.verb) + '</em>' + WU.esc(b.post); }
  function answers() {
    var r = round(); if (!r) return [];
    var out = [build(r.m.tense, r.sign, r.s, r.v, r.m.text)];
    if (r.m.tense === 'fs' && scr.get().goingTo) out.push(build('going', r.sign, r.s, r.v, r.m.text));
    return out;
  }

  /* ---------- families and the round ---------- */
  function levelTenses() { var S = scr.get(); return TENSES.filter(function (t) { return S['t_' + t]; }); }
  function families() {
    var lt = levelTenses(), mk = WU.list('timemachine', 'markers', 0), out = [], seen = {};
    FAMILIES.forEach(function (f) {
      var ts = f[1].filter(function (t) { return lt.indexOf(t) >= 0 && mk.some(function (m) { return m.tense === t && m.text; }); }), key = ts.join(',');
      if (!ts.length || seen[key]) return; // same tenses as a family already listed: skip it
      seen[key] = 1; out.push({ id: f[0], tenses: ts });
    });
    return out;
  }
  function family() { var fs = families(); return fs.filter(function (f) { return f.id === st.fam; })[0] || fs[0] || null; }
  function signs() { var S = scr.get(), o = []; if (S.sPlus) o.push('plus'); if (S.sMinus) o.push('minus'); if (S.sQ) o.push('q'); return o.length ? o : ['plus']; }
  function pickRound() {
    var f = family(); if (!f) return null;
    var subs = WU.list('timemachine', 'subjects', 0).filter(function (x) { return x.text; });
    var verbs = WU.list('timemachine', 'verbs', 0).filter(function (x) { return x.base; });
    var mk = WU.list('timemachine', 'markers', 0).filter(function (m) { return m.text && f.tenses.indexOf(m.tense) >= 0; });
    if (!subs.length || !verbs.length || !mk.length) return null;
    // Pick the tense first (so a tense with many time phrases does not come up more often).
    var t = WU.pick(f.tenses.filter(function (x) { return mk.some(function (m) { return m.tense === x; }); }));
    return { sid: WU.pick(subs).id, vid: WU.pick(verbs).id, mid: WU.pick(mk.filter(function (m) { return m.tense === t; })).id, sign: WU.pick(signs()) };
  }
  function round() {
    if (!st.r) return null;
    var s = WU.list('timemachine', 'subjects', 0).filter(function (x) { return x.id === st.r.sid; })[0];
    var v = WU.list('timemachine', 'verbs', 0).filter(function (x) { return x.id === st.r.vid; })[0];
    var m = WU.list('timemachine', 'markers', 0).filter(function (x) { return x.id === st.r.mid; })[0];
    return s && v && m ? { s: s, v: v, m: m, sign: st.r.sign } : null;
  }

  /* ---------- screen ---------- */
  function win(label, la, body, cls) { return '<div class="tmwin ' + (cls || '') + '"><div class="tml"' + scr.ea(la) + '>' + WU.esc(label) + '</div><div class="tmv">' + body + '</div></div>'; }
  function render() {
    var S = scr.get(), ph = st.phase, r = round(), f = family(), h = '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#3d6bff') +
      (f ? '<div class="gpill tmfam" data-h="fam"' + scr.ea('f_' + f.id) + '>' + WU.esc(S['f_' + f.id]) + '</div>' : '') +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    if (+S.seconds > 0) h += bar.html();
    var spin = ph === 'spin';
    if (r) {
      var sym = { plus: S.plus, minus: S.minus, q: S.q }[r.sign], nm = { plus: S.plusName, minus: S.minusName, q: S.qName }[r.sign], sk = { plus: 'plus', minus: 'minus', q: 'q' }[r.sign];
      h += '<div class="tmrow' + (spin ? ' spin' : '') + '">' +
        win(S.lWho, 'lWho', '<div class="tmt" data-edit="timemachine:subjects:' + r.s.id + ':text">' + WU.esc(r.s.text) + '</div>', 'who') +
        win(S.lWhat, 'lWhat', (r.v.pic ? '<div class="tmpic" data-edit="timemachine:verbs:' + r.v.id + ':pic">' + WU.pic(r.v.pic) + '</div>' : '') +
          '<div class="tmt" data-edit="timemachine:verbs:' + r.v.id + ':base">' + WU.esc((r.v.base + ' ' + r.v.rest).trim()) + '</div>', 'what') +
        win(S.lWhen, 'lWhen', '<div class="tmt" data-edit="timemachine:markers:' + r.m.id + ':text">' + WU.esc(r.m.text) + '</div>', 'when') +
        win(S.lSign, 'lSign', '<div class="tmsym ' + r.sign + '"' + scr.ea(sk) + '>' + WU.esc(sym) + '</div><div class="tmsn"' + scr.ea(sk + 'Name') + '>' + WU.esc(nm) + '</div>', 'sign') + '</div>';
    } else h += '<div class="tmrow"><div class="gbig" data-ctrl>No tenses or time phrases for this level (Edit mode).</div></div>';
    h += '<div class="tmbottom">';
    if (ph === 'reveal' && r) {
      var ans = answers();
      h += '<div class="tmtense"' + scr.ea('n_' + r.m.tense) + '>' + WU.esc(S['n_' + r.m.tense]) + '</div>';
      h += gram.answer('', '', ans.map(asHTML).join(' <span class="tmor">' + WU.esc(S.orWord || 'or') + '</span> '), ' data-auto');
    } else if (!spin) {
      h += '<div class="brow">' + gram.who(S.who, scr.ea('who'), st.who) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    box.querySelectorAll('.tmwin .tmt').forEach(function (t) { kit.fit(t, 76, 34); });
    var a = box.querySelector('.gans-t'); if (a) kit.fit(a, 58, 30);
    var fb = box.querySelector('[data-h="fam"]'); if (fb) fb.onclick = function (e) { if (!WU.editing) { e.stopPropagation(); cycleFamily(); } };
    bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ask' ? [['SPACE', 'reveal'], ['T', 'tenses'], ['P', 'other student'], ['Esc', 'home']]
      : ph === 'spin' ? [['Esc', 'home']]
      : [['SPACE', 'spin'], ['T', 'tenses'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function spin() {
    clearInterval(spinT); bar.stop();
    if (!pickRound()) { st.r = null; st.phase = 'ask'; render(); return; }
    st.phase = 'spin'; var n = 0;
    WU.sound.clack();
    spinT = setInterval(function () {
      if (!st) { clearInterval(spinT); return; }
      st.r = pickRound(); WU.sound.tick(n % 2); render();
      if (++n >= (WU.isCalm() ? 1 : 9)) { clearInterval(spinT); spinT = null; land(); }
    }, 80);
  }
  function land() {
    var S = scr.get(); st.phase = 'ask'; st.who = kit.student(st.who ? [st.who] : null); WU.sound.slam(); render();
    bar.start(box, Math.max(0, Math.min(60, +S.seconds || 0)), function () { if (st && st.phase === 'ask') render(); });
  }
  function reveal() { bar.stop(); st.phase = 'reveal'; WU.sound.ding(); render(); }
  function cycleFamily() {
    var fs = families(); if (!fs.length) return;
    var i = fs.map(function (f) { return f.id; }).indexOf(family() ? family().id : ''), nf = fs[(i + 1) % fs.length];
    st.fam = nf.id; WU.store.set('tm-fam-' + WU.state.level, st.fam);
    WU.sound.clack(); WU.toast(scr.get()['f_' + nf.id] + ': ' + nf.tenses.map(function (t) { return scr.get()['n_' + t]; }).join(', '));
    if (st.phase !== 'spin') { st.demo = false; spin(); }
  }
  function refresh() { if (!st) return; if (!st.moved) st.demo = !!scr.get().demoShow; if (!round()) st.r = pickRound(); if (st.phase !== 'spin') render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'ask') reveal(); else if (ph === 'reveal') { st.demo = false; spin(); } }
    else if (k === 'T') { st.moved = true; cycleFamily(); }
    else if (k === 'P') { if (ph === 'ask') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }

  WU.views.timemachine = {
    title: 'Time Machine',
    teacher: function () {
      if (!st) return null;
      var r = round(), S = scr.get(), f = family(), sec = [], info = [];
      if (r && st.phase !== 'spin') { sec.push({ label: 'Answer', text: answers().map(asText).join(' / '), big: true }); sec.push({ label: 'Tense', text: S['n_' + r.m.tense] }); }
      if (f) info.push({ label: 'Tenses (T)', text: S['f_' + f.id] + ': ' + f.tenses.map(function (t) { return S['n_' + t]; }).join(', ') });
      info.push({ label: 'Student', text: st.who || '' });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'reveal / spin again'], ['T', 'tense family: all, simple, continuous, perfect...'], ['P', 'other student'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'tmg', 'Time Machine', 'timemachine-sb'); box = sh.box;
      st = { phase: 'ask', r: null, fam: WU.store.get('tm-fam-' + WU.state.level, 'all'), demo: !!scr.get().demoShow, who: null };
      st.r = pickRound(); land();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && st.phase !== 'spin') render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearInterval(spinT); spinT = null; bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { t: 'T', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
