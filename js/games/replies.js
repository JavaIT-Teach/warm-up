/* Warm Up: NATURAL REPLIES (all levels). Trains: replying fast and naturally (thanks, sympathy, agreeing, short answers...).
   Space: a student is named. Space: someone "says" a line, a short time bar runs: the student must START replying before it ends,
   with a reply from the wall (the wall shows the kind of reply that fits). Space = started in time (the streak grows);
   the bar runs out = TOO SLOW (the streak resets). Then press the number of the reply they used (or tap it): it greys out
   for the rest of the round, so the class has to use different replies (short answers never grey out: they mirror the question). After roundLen lines, a new round: every reply is back.
   Keys: Space next step, 1-9 the reply used, X froze (streak resets), P other student, N other line, R new round.
   Content: content/replies.js (the bank is shared with other games, see js/expr.js). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram, X = WU.expr;

  var scr = kit.screen({
    game: 'replies', title: 'Natural Replies', content: function () { return WU.content.repliesScreen; },
    fields: [
      { type: 'head', label: 'The line' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'ready', label: 'Before the line ({name})', type: 'text', max: 40 },
      { k: 'saysLabel', label: 'Label before the line', type: 'text', max: 20 },
      { k: 'startSecs', label: 'Seconds to START replying', type: 'num', min: 1, max: 10 },
      { k: 'go', label: 'Started in time', type: 'text', max: 16 },
      { k: 'slow', label: 'Too slow', type: 'text', max: 16 },
      { k: 'nice', label: 'After a reply is marked', type: 'text', max: 16 },
      { k: 'rule', label: 'Rule line', type: 'text', max: 100 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { type: 'head', label: 'Rounds and streak' },
      { k: 'roundLen', label: 'Lines per round (then every reply is back)', type: 'num', min: 3, max: 30 },
      { k: 'round', label: 'Round tag ({n})', type: 'text', max: 20 },
      { k: 'newRound', label: 'New round message', type: 'text', max: 50 },
      { k: 'streak', label: 'Streak label', type: 'text', max: 16 },
      { k: 'best', label: 'Best streak ({n})', type: 'text', max: 20 },
      { k: 'wallUsed', label: 'Hint under the wall', type: 'text', max: 40 },
      { type: 'head', label: 'Wall titles (one per kind of reply)' },
      { k: 'c_hello', label: 'hello', type: 'text', max: 30 }, { k: 'c_reply', label: 'reply', type: 'text', max: 30 },
      { k: 'c_agree', label: 'agree', type: 'text', max: 30 }, { k: 'c_disagree', label: 'disagree', type: 'text', max: 30 },
      { k: 'c_thanks', label: 'thanks', type: 'text', max: 30 }, { k: 'c_welcome', label: 'welcome', type: 'text', max: 30 },
      { k: 'c_sympathy', label: 'sympathy', type: 'text', max: 30 }, { k: 'c_happy', label: 'happy', type: 'text', max: 30 },
      { k: 'c_short', label: 'short', type: 'text', max: 30 }, { k: 'c_vague', label: 'vague', type: 'text', max: 30 },
      { k: 'c_surprise', label: 'surprise', type: 'text', max: 30 }
    ]
  });
  WU.registerList('replies', 'prompts', {
    gameTitle: 'Natural Replies', label: 'Lines to reply to',
    defaults: function (l) { return WU.content.replies[l].prompts; },
    norm: function (r) { return { cat: X.CATS.indexOf(r.cat) >= 0 ? r.cat : 'agree', line: r.line || '' }; },
    title: function (it) { return it.line + '  (' + it.cat + ')'; },
    fields: function () {
      return [
        { k: 'line', label: 'What someone says', type: 'text', max: 100 },
        { k: 'cat', label: 'Kind of reply that fits: ' + X.CATS.join(', '), type: 'text', max: 12 }
      ];
    },
    blank: function () { return { cat: 'thanks', line: 'Here, I saved you a seat.' }; }
  });

  var sh, box, st, offContent = null, bar = gram.bar(), deck = kit.deck();

  function prompts() { return WU.list('replies', 'prompts', WU.state.level).filter(function (x) { return x.line && X.list([x.cat]).length; }); }
  function item() { return prompts().filter(function (x) { return x.id === st.id; })[0] || null; }
  function wall(it) { return it ? X.list([it.cat]).slice(0, 9) : []; }
  function bestKey() { return 'nr-best-' + WU.state.level; }
  function best() { return +WU.store.get(bestKey(), 0) || 0; }

  function render() {
    var S = scr.get(), ph = st.phase, it = item(), h = '';
    h += '<div class="ghead">' + kit.chip(S.tag, scr.ea('tag'), '#ff4fc3') +
      (S.round ? '<div class="gpill alt"' + scr.ea('round') + '>' + WU.esc(kit.fill(S.round, { n: st.round })) + '</div>' : '') + '</div>';
    if (ph === 'fire') h += bar.html();
    if (!it) { box.querySelector('.layer').innerHTML = h + '<div class="nrleft"><div class="gbig" data-ctrl>No lines at this level (Edit mode).</div></div>'; renderHints(); return; }
    h += '<div class="nrleft">';
    if (ph === 'ready') {
      h += gram.who(S.ready, scr.ea('ready'), st.who).replace('gwho', 'gwho nrready');
      if (st.fresh && S.newRound) h += '<div class="nrnew"' + scr.ea('newRound') + '>' + WU.esc(S.newRound) + '</div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(S.rule) + '</div>';
    } else {
      h += '<div class="nrwho" data-auto>' + WU.esc(st.who || '') + '</div>';
      h += '<div class="nrsays"' + scr.ea('saysLabel') + '>' + WU.esc(S.saysLabel) + '</div>';
      h += '<div class="nrline"' + ' data-edit="replies:prompts:' + it.id + ':line"><span>' + WU.esc(it.line) + '</span></div>';
      if (ph === 'talk' && S.go) h += '<div class="nrstamp ok"' + scr.ea(st.marked ? 'nice' : 'go') + '>' + WU.esc(st.marked ? S.nice : S.go) + '</div>';
      if (ph === 'late' && S.slow) h += '<div class="nrstamp no"' + scr.ea('slow') + '>' + WU.esc(S.slow) + '</div>';
    }
    h += '</div>';
    // Right: streak and the wall.
    h += '<div class="nrright"><div class="nrstreak"><span' + scr.ea('streak') + '>' + WU.esc(S.streak) + '</span><b data-auto>' + st.streak + '</b>' +
      (best() && S.best ? '<i' + scr.ea('best') + '>' + WU.esc(kit.fill(S.best, { n: best() })) + '</i>' : '') + '</div>';
    if (ph !== 'ready') {
      var w = wall(it), used = st.used;
      h += '<div class="nrwall"><div class="nrcat"' + scr.ea('c_' + it.cat) + '>' + WU.esc(S['c_' + it.cat] || it.cat) + '</div>' +
        w.map(function (x, i) { return '<div class="nre' + (used[x.id] ? ' used' : '') + (st.marked === x.id ? ' hit' : '') + '" data-x="' + x.id + '"><b data-ctrl>' + (i + 1) + '</b><span' + X.attr(x) + '>' + WU.esc(x.text) + '</span></div>'; }).join('') +
        (S.wallUsed && (ph === 'talk' || ph === 'late') ? '<div class="nrhint"' + scr.ea('wallUsed') + '>' + WU.esc(S.wallUsed) + '</div>' : '') + '</div>';
    }
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    var ln = box.querySelector('.nrline'); if (ln) kit.fit(ln, 110, 56);
    box.querySelectorAll('[data-x]').forEach(function (b) { b.onclick = function (e) { if (WU.editing) return; e.stopPropagation(); mark(b.getAttribute('data-x')); }; });
    bar.redraw(box);
    renderHints();
  }
  function renderHints() {
    var ph = st.phase, sc = WU.state.teams ? [['S', 'scores']] : [];
    var hs = ph === 'ready' ? [['SPACE', 'show the line'], ['P', 'other student'], ['R', 'new round']]
      : ph === 'fire' ? [['SPACE', 'started in time!'], ['X', 'froze'], ['N', 'other line']]
      : [['1-' + Math.max(1, wall(item()).length), 'reply used'], ['SPACE', 'next student'], ['X', 'froze']];
    kit.hints(sh.root, hs.concat([['Esc', 'home']], sc), keyAction);
  }

  /* ---------- flow ---------- */
  function ready() {
    bar.stop();
    var ps = prompts(); st.id = ps.length ? deck(ps).id : null;
    st.phase = 'ready'; st.marked = null; st.who = kit.student(st.who ? [st.who] : null);
    render();
  }
  function fire() {
    if (!item()) { ready(); return; }
    st.phase = 'fire'; st.fresh = false; WU.sound.pop(); render();
    bar.start(box, Math.max(1, Math.min(10, +scr.get().startSecs || 2)), function () { if (st && st.phase === 'fire') { st.phase = 'late'; st.streak = 0; render(); } });
  }
  function inTime() {
    bar.stop(); st.phase = 'talk'; st.streak++;
    if (st.streak > best()) WU.store.set(bestKey(), st.streak);
    WU.sound.ding(); render();
  }
  function froze() { if (st.phase === 'ready') return; bar.stop(); st.streak = 0; st.phase = 'late'; WU.sound.buzzer(); render(); }
  function mark(id) {
    if (st.phase !== 'talk' && st.phase !== 'late') return;
    if (st.used[id] && st.marked !== id) { WU.toast('Already used this round! Another reply, please.'); WU.sound.buzzer(); return; }
    // A second tap the same turn corrects the first one. Short answers (I did. / I am.) never grey out: they must mirror the question.
    if (st.marked && st.marked !== id) delete st.used[st.marked];
    if (item().cat !== 'short') st.used[id] = true;
    st.marked = id;
    // Every reply of this kind used: they all come back.
    var w = wall(item()); if (w.every(function (x) { return st.used[x.id]; })) w.forEach(function (x) { if (x.id !== id) delete st.used[x.id]; });
    WU.sound.clack(); render();
  }
  function next() {
    st.count++;
    if (st.count >= Math.max(3, +scr.get().roundLen || 10)) newRound(); else ready();
  }
  function newRound() { st.round++; st.count = 0; st.used = {}; st.fresh = true; WU.sound.slam(); ready(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') fire(); else if (ph === 'fire') inTime(); else next(); }
    else if (k === 'X') froze();
    else if (k === 'P') { if (ph === 'ready') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'N') { if (ph === 'fire' || ph === 'ready') { bar.stop(); var w = st.who; ready(); st.who = w; render(); } }
    else if (k === 'R') { st.round = 0; newRound(); }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() { if (!st) return; if (!item()) ready(); else render(); }

  WU.views.replies = {
    title: 'Natural Replies',
    teacher: function () {
      if (!st) return null;
      var it = item(), info = [], sec = [];
      if (it) { sec.push({ label: 'Next line', text: it.line, big: st.phase === 'ready' }); sec.push({ label: 'Kind of reply', text: it.cat }); }
      info.push({ label: 'Student', text: st.who || '' }, { label: 'Streak', text: st.streak + ' (best ' + best() + ')' }, { label: 'Round', text: st.round + ': line ' + (st.count + 1) });
      return { secret: sec, info: info };
    },
    help: function () {
      return [['Space', 'show the line / started in time / next student'], ['1 - 9', 'the reply they used (greys out this round)'], ['X', 'froze: the streak resets'],
        ['P', 'other student'], ['N', 'other line'], ['R', 'new round: every reply is back']];
    },
    mount: function (el) {
      sh = gram.shell(el, 'nrg', 'Natural Replies', 'replies-sb'); box = sh.box;
      st = { phase: 'ready', id: null, who: null, streak: 0, round: 1, count: 0, used: {}, marked: null, fresh: false };
      ready();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      var m = /^(?:Digit|Numpad)([1-9])$/.exec(e.code);
      if (m && !e.shiftKey && (st.phase === 'talk' || st.phase === 'late')) { var w = wall(item())[+m[1] - 1]; if (w) mark(w.id); return true; }
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { x: 'X', p: 'P', n: 'N', r: 'R', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
