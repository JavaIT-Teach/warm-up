/* Warm Up: PHRASAL ROULETTE (grammar game G10, Pre-Intermediate and up). Trains: phrasal verbs.
   Two reels spin: VERB (give) and PARTICLE (up). The picked student says what it means; Space reveals the meaning and an example.
   Space again: a personal question to answer WITH the phrasal verb ("What would you like to give up?").
   T turns it round: the meaning shows, the reels stay hidden, and the student finds the phrasal verb.
   T again: SPLIT OR STICK? Where does "it" go? Fingers up: 1 = take IT down (separable), 2 = get over IT (inseparable).
   L = family: lock the verb (come, make, get...) so only the particle changes. L again = the next family, then off.
   Keys: Space spin / reveal / question / next, T mode, L family, P other student, 1-4 team points.
   Content: content/phrasal.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'phrasal', title: 'Phrasal Roulette', content: function () { return WU.content.phrasalScreen; },
    fields: [
      { type: 'head', label: 'The reels' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'lVerb', label: 'Reel 1', type: 'text', max: 14 }, { k: 'lPart', label: 'Reel 2', type: 'text', max: 14 },
      { k: 'mToMeaning', label: 'T key: verb -> meaning', type: 'text', max: 30 }, { k: 'mToVerb', label: 'T key: meaning -> verb', type: 'text', max: 30 },
      { k: 'mSplit', label: 'T key: split or stick', type: 'text', max: 30 },
      { k: 'family', label: 'L key: family label ({verb})', type: 'text', max: 30 },
      { k: 'whoMeaning', label: 'Picked student, verb -> meaning ({name})', type: 'text', max: 50 },
      { k: 'whoVerb', label: 'Picked student, meaning -> verb ({name})', type: 'text', max: 50 },
      { k: 'whoSplit', label: 'Picked student, split or stick ({name})', type: 'text', max: 50 },
      { k: 'splitRule', label: 'Split or stick: rule line', type: 'text', max: 100 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 90 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'seconds', label: 'Time bar (seconds, 0 = none)', type: 'num', min: 0, max: 60 },
      { type: 'head', label: 'After the reveal' },
      { k: 'lMeaning', label: 'Label: meaning', type: 'text', max: 14 }, { k: 'lExample', label: 'Label: example', type: 'text', max: 14 },
      { k: 'lQuestion', label: 'Label: personal question', type: 'text', max: 14 },
      { k: 'questionShow', label: 'Personal question step', type: 'bool', on: 'On', off: 'Off' },
      { k: 'whoQ', label: 'Student who answers the question ({name})', type: 'text', max: 60 }
    ]
  });
  WU.registerList('phrasal', 'verbs', {
    gameTitle: 'Phrasal Roulette', label: 'Phrasal verbs',
    defaults: function (l) { return WU.content.phrasal[l].verbs; },
    norm: function (r) { return { verb: r.verb || '', particle: r.particle || '', sep: r.sep === 'yes' || r.sep === 'no' ? r.sep : '', meaning: r.meaning || '', example: r.example || '', question: r.question || '' }; },
    title: function (it) { return (it.verb + ' ' + it.particle).trim() || '(empty)'; },
    fields: function () {
      return [{ k: 'verb', label: 'Verb', type: 'text', max: 20 }, { k: 'particle', label: 'Particle (up, off, up with...)', type: 'text', max: 20 },
        { k: 'sep', label: 'With "it": yes = take it down, no = get over it, empty = no object (split mode skips it)', type: 'text', max: 3 },
        { k: 'meaning', label: 'Meaning', type: 'text', max: 80 }, { k: 'example', label: 'Example sentence', type: 'text', max: 100 },
        { k: 'question', label: 'Personal question', type: 'text', max: 100 }];
    },
    blank: function () { return { verb: 'give', particle: 'up', meaning: 'stop doing something', example: 'I gave up sugar.', question: 'What would you like to give up?' }; }
  });

  var sh, box, st, offContent = null, spinT = null, bar = gram.bar(), deck = kit.deck();

  function allVerbs() { return WU.list('phrasal', 'verbs', WU.state.level).filter(function (x) { return x.verb && x.particle; }); }
  function verbs() {
    return allVerbs().filter(function (x) { return (!st || st.mode !== 'split' || x.sep) && (!st || !st.fam || x.verb.toLowerCase() === st.fam); });
  }
  // Verb families at this level: verbs with 3 or more phrasal verbs (come, make, get...).
  function families() {
    var n = {}; allVerbs().forEach(function (x) { var v = x.verb.toLowerCase(); n[v] = (n[v] || 0) + 1; });
    return Object.keys(n).filter(function (v) { return n[v] >= 3; }).sort(function (a, b) { return n[b] - n[a] || (a < b ? -1 : 1); });
  }
  // "take" + "it" + "down" / "get over" + "it". Three-word verbs put "it" after the first particle word when separable.
  function withIt(it, split) { return split ? it.verb + ' it ' + it.particle : it.verb + ' ' + it.particle + ' it'; }
  function modeKey() { return st.mode === 'verb' ? 'mToVerb' : st.mode === 'split' ? 'mSplit' : 'mToMeaning'; }
  function item() { return verbs().filter(function (x) { return x.id === st.id; })[0] || null; }
  function ek(it, f) { return ' data-edit="phrasal:verbs:' + it.id + ':' + f + '"'; }

  function reel(label, la, txt, attr, hid) {
    return '<div class="prwin"><div class="tml"' + scr.ea(la) + '>' + WU.esc(label) + '</div><div class="prv' + (hid ? ' hid' : '') + '"' + (hid ? ' data-ctrl' : attr) + '>' + WU.esc(hid ? '?' : txt) + '</div></div>';
  }
  function render() {
    var S = scr.get(), ph = st.phase, it = item(), toVerb = st.mode === 'verb', split = st.mode === 'split', h = '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#ff5a1f') +
      '<div class="gpill prmode" data-h="mode"' + scr.ea(modeKey()) + '>' + WU.esc(S[modeKey()]) + '</div>' +
      (st.fam && S.family ? '<div class="gpill alt"' + scr.ea('family') + '>' + WU.esc(kit.fill(S.family, { verb: st.fam.toUpperCase() })) + '</div>' : '') + '</div>';
    if (+S.seconds > 0 && ph === 'ask') h += bar.html();
    if (!it) { box.querySelector('.layer').innerHTML = h + '<div class="prrow"><div class="gbig" data-ctrl>No phrasal verbs at this level (Edit mode).</div></div>'; renderHints(); return; }
    var spin = ph === 'spin', hid = toVerb && (ph === 'ask' || spin);
    var sv = spin ? st.fake : it;
    h += '<div class="prrow' + (spin ? ' spin' : '') + '">' + reel(S.lVerb, 'lVerb', sv.verb, ek(it, 'verb'), hid) + '<div class="prplus" data-ctrl>+</div>' + reel(S.lPart, 'lPart', sv.particle, ek(it, 'particle'), hid) + '</div>';
    h += '<div class="prbottom">';
    if (split && (ph === 'ask' || ph === 'answer')) {
      var ok = it.sep === 'yes', A = withIt(it, true), B = withIt(it, false), rev = ph === 'answer';
      h += '<div class="prsplit"><div class="prs' + (rev ? (ok ? ' ok' : ' no') : '') + '"><b data-ctrl>1</b><span data-auto>' + WU.esc(A) + '</span></div>' +
        '<div class="prs' + (rev ? (ok ? ' no' : ' ok') : '') + '"><b data-ctrl>2</b><span data-auto>' + WU.esc(B) + '</span></div></div>';
      if (ph === 'ask') h += '<div class="brow">' + gram.who(S.whoSplit, scr.ea('whoSplit'), st.who) + '</div>';
      else if (it.example) h += '<div class="prmean ex"><b' + scr.ea('lExample') + '>' + WU.esc(S.lExample) + '</b><span' + ek(it, 'example') + '>' + WU.esc(it.example) + '</span></div>';
      if (S.splitRule) h += '<div class="rule"' + scr.ea('splitRule') + '>' + WU.esc(S.splitRule) + '</div>';
    } else if (ph === 'ask') {
      if (toVerb) h += '<div class="prmean"><b' + scr.ea('lMeaning') + '>' + WU.esc(S.lMeaning) + '</b><span' + ek(it, 'meaning') + '>' + WU.esc(it.meaning) + '</span></div>';
      h += '<div class="brow">' + gram.who(toVerb ? S.whoVerb : S.whoMeaning, scr.ea(toVerb ? 'whoVerb' : 'whoMeaning'), st.who) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    } else if (ph === 'answer') {
      h += '<div class="prmean"><b' + scr.ea('lMeaning') + '>' + WU.esc(S.lMeaning) + '</b><span' + ek(it, 'meaning') + '>' + WU.esc(it.meaning) + '</span></div>';
      if (it.example) h += '<div class="prmean ex"><b' + scr.ea('lExample') + '>' + WU.esc(S.lExample) + '</b><span' + ek(it, 'example') + '>' + WU.esc(it.example) + '</span></div>';
    } else if (ph === 'question') {
      h += '<div class="prq"><b' + scr.ea('lQuestion') + '>' + WU.esc(S.lQuestion) + '</b><span' + ek(it, 'question') + '>' + WU.esc(it.question) + '</span></div>';
      h += '<div class="brow">' + gram.who(S.whoQ, scr.ea('whoQ'), st.who) + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    box.querySelectorAll('.prv').forEach(function (v) { kit.fit(v, 150, 60); });
    var q = box.querySelector('.prq span'); if (q) kit.fit(q, 64, 34);
    var mb = box.querySelector('[data-h="mode"]'); if (mb) mb.onclick = function (e) { if (!WU.editing) { e.stopPropagation(); keyAction('T'); } };
    bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase;
    var hs = ph === 'ask' ? [['SPACE', 'reveal'], ['T', 'mode'], ['L', st.fam ? 'next family' : 'family'], ['P', 'other student'], ['Esc', 'home']]
      : ph === 'answer' ? [['SPACE', scr.get().questionShow && st.mode !== 'split' ? 'personal question' : 'spin'], ['Esc', 'home']]
      : ph === 'question' ? [['SPACE', 'spin'], ['P', 'other student'], ['Esc', 'home']]
      : [['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function spin() {
    clearInterval(spinT); bar.stop();
    var vs = verbs(); if (!vs.length) { st.id = null; st.phase = 'ask'; render(); return; }
    var it = deck(vs); st.id = it.id; st.phase = 'spin'; var n = 0;
    WU.sound.clack();
    spinT = setInterval(function () {
      if (!st) { clearInterval(spinT); return; }
      st.fake = { verb: WU.pick(vs).verb, particle: WU.pick(vs).particle }; WU.sound.tick(n % 2); render();
      if (++n >= (WU.isCalm() ? 1 : 10)) { clearInterval(spinT); spinT = null; land(); }
    }, 80);
  }
  function land() {
    var S = scr.get(); st.phase = 'ask'; st.who = kit.student(st.who ? [st.who] : null); WU.sound.slam(); render();
    bar.start(box, Math.max(0, Math.min(60, +S.seconds || 0)), function () { if (st && st.phase === 'ask') render(); });
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') {
      if (ph === 'ask') { bar.stop(); st.phase = 'answer'; WU.sound.ding(); render(); }
      else if (ph === 'answer') { if (scr.get().questionShow && st.mode !== 'split' && item() && item().question) { st.phase = 'question'; st.who = kit.student([st.who]); WU.sound.pop(); render(); } else spin(); }
      else if (ph === 'question') spin();
    }
    else if (k === 'T') { if (ph === 'spin') return; st.mode = st.mode === 'meaning' ? 'verb' : st.mode === 'verb' ? 'split' : 'meaning'; WU.store.set('phrasal-mode', st.mode); WU.sound.clack(); spin(); }
    else if (k === 'L') {
      if (ph === 'spin') return;
      var fs = families(), i = st.fam ? fs.indexOf(st.fam) : -1;
      st.fam = i + 1 < fs.length ? fs[i + 1] : null;
      if (st.fam && !verbs().length) st.fam = null;
      WU.toast(st.fam ? 'Family: ' + st.fam + '. Only the particle changes.' : (fs.length ? 'Family off: every verb.' : 'No verb family at this level (3+ phrasal verbs with the same verb).'));
      WU.sound.clack(); spin();
    }
    else if (k === 'P') { if (ph === 'ask' || ph === 'question') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() { if (!st) return; if (!item()) { spin(); return; } if (st.phase !== 'spin') render(); }

  WU.views.phrasal = {
    title: 'Phrasal Roulette',
    teacher: function () {
      if (!st) return null;
      var it = item(), sec = [], info = [];
      if (it && st.phase !== 'spin') {
        if (st.mode === 'split') sec.push({ label: 'Answer', text: (it.sep === 'yes' ? '1 = ' : '2 = ') + withIt(it, it.sep === 'yes'), big: true });
        sec.push({ label: st.mode === 'verb' ? 'Answer' : 'Phrasal verb', text: it.verb + ' ' + it.particle, big: st.mode === 'verb' });
        sec.push({ label: 'Meaning', text: it.meaning, big: st.mode !== 'verb' });
        if (it.example) sec.push({ label: 'Example', text: it.example });
        if (it.question) info.push({ label: 'Personal question', text: it.question });
      }
      info.push({ label: 'Student', text: st.who || '' });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'reveal / personal question / spin'], ['T', 'mode: verb -> meaning, meaning -> verb, split or stick'], ['L', 'verb family (come, make...): next family, then off'], ['P', 'other student'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'prg', 'Phrasal Roulette', 'phrasal-sb'); box = sh.box;
      var sm = WU.store.get('phrasal-mode', 'meaning');
      st = { phase: 'ask', id: null, mode: sm === 'verb' || sm === 'split' ? sm : 'meaning', who: null, fake: null, fam: null };
      var vs = verbs(); if (vs.length) st.id = deck(vs).id;
      land();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && st.phase !== 'spin') render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearInterval(spinT); spinT = null; bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { t: 'T', p: 'P', s: 'S', l: 'L' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
