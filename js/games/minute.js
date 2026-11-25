/* Warm Up: JUST A MINUTE (Pre-Intermediate and up). The radio panel game as a fluency game.
   A student talks on a topic until the timer ends, without HESITATION, DEVIATION (going off the topic) or, from Intermediate,
   REPETITION. Anyone who hears a mistake shouts "Challenge!": H / D / R stops the clock. Y = fair: the challenger takes over
   the same topic and the clock goes on. N = not fair: the speaker goes on. With teams: 1-4 = fair, a point for that team.
   Time up: whoever is speaking wins (teams: 1-4 gives the point).
   Keys: P pick, Space start / next, H D R challenge, Y / N fair or not, Enter pause, Esc home.
   Content: content/minute.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;

  var scr = kit.screen({
    game: 'minute', title: 'Just a Minute', content: function () { return WU.content.minuteScreen; },
    fields: [
      { type: 'head', label: 'Before the round' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 24 },
      { k: 'who', label: 'Before a student is picked', type: 'text', max: 40 },
      { k: 'qMark', label: 'Shown before a student is picked', type: 'text', max: 4 },
      { k: 'secs', label: 'Talking time (seconds)', type: 'num', min: 15, max: 180 },
      { k: 'topicLabel', label: 'Label on the topic card', type: 'text', max: 20 },
      { k: 'rule', label: 'Rule line ({secs})', type: 'text', max: 110 }, { k: 'ruleShow', label: 'Rule line', type: 'bool' },
      { k: 'demo', label: 'Teacher demo banner (first round only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off', hint: 'The teacher talks first; the class challenges.' },
      { k: 'demoWho', label: 'Name in the demo round', type: 'text', max: 16 },
      { type: 'head', label: 'The three mistakes' },
      { k: 'hName', label: 'Hesitation', type: 'text', max: 16 }, { k: 'hText', label: 'Hesitation means', type: 'text', max: 60 },
      { k: 'dName', label: 'Deviation', type: 'text', max: 16 }, { k: 'dText', label: 'Deviation means', type: 'text', max: 60 },
      { k: 'rName', label: 'Repetition', type: 'text', max: 16 }, { k: 'rText', label: 'Repetition means', type: 'text', max: 80 },
      { k: 'useR', label: 'Repetition rule', type: 'bool', hint: 'Off below Intermediate.' },
      { type: 'head', label: 'Challenges' },
      { k: 'challenge', label: 'Challenge banner', type: 'text', max: 20 },
      { k: 'accept', label: 'Fair or not? line', type: 'text', max: 70 },
      { k: 'newSpeaker', label: 'Name shown after a fair challenge', type: 'text', max: 20 },
      { k: 'taken', label: 'After a fair challenge', type: 'text', max: 70 },
      { k: 'rejected', label: 'After an unfair challenge ({name})', type: 'text', max: 60 },
      { k: 'challenges', label: 'Challenge count ({n})', type: 'text', max: 24 },
      { type: 'head', label: 'Time up' },
      { k: 'last', label: 'Time up', type: 'text', max: 70 },
      { k: 'clean', label: 'No fair challenges ({name}, {secs})', type: 'text', max: 70 }
    ]
  });
  WU.registerList('minute', 'topics', {
    gameTitle: 'Just a Minute', label: 'Topics',
    defaults: function (l) { return WU.content.minute[l].topics; },
    norm: function (r) { return { text: r.text || '' }; },
    fields: function () { return [{ k: 'text', label: 'Topic', type: 'text', max: 60 }]; },
    blank: function () { return { text: 'New topic' }; }
  });

  var root, box, st, sb = null, clock = null, offContent = null, timers = [];
  var deck = kit.deck();
  var KINDS = { H: 'h', D: 'd', R: 'r' };

  function topic() { return WU.list('minute', 'topics', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function newTopic() { var it = deck(WU.list('minute', 'topics', WU.state.level)); st.id = it ? it.id : null; }
  function secs() { return Math.max(15, Math.min(180, +scr.get().secs || 60)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  // The name on screen: the picked student, the demo name, or NEW SPEAKER after a fair challenge.
  function nameHTML(S) {
    if (st.taken) return '<div class="pname"' + scr.ea('newSpeaker') + '>' + WU.esc(S.newSpeaker) + '</div>';
    if (st.demo) return '<div class="pname"' + scr.ea('demoWho') + '>' + WU.esc(S.demoWho) + '</div>';
    return st.player ? '<div class="pname" data-auto>' + WU.esc(st.player) + '</div>' : '';
  }
  function speaker() { var S = scr.get(); return st.taken ? S.newSpeaker : st.demo ? S.demoWho : st.player || '?'; }
  function kinds(S) { return ['h', 'd'].concat(S.useR ? ['r'] : []); }

  function render() {
    var S = scr.get(), ph = st.phase, it = topic(), h = '';
    box.classList.toggle('side', ph !== 'ready');
    h += '<div class="phead">' + kit.chip(S.tag, scr.ea('tag'), '#ff5a1f') + nameHTML(S) +
      (st.demo && S.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(S.demo) + '</div>' : '') + '</div>';
    h += '<div class="pcard' + (ph === 'talk' ? ' lit' : '') + '"><div class="ptag"' + scr.ea('topicLabel') + '>' + WU.esc(S.topicLabel) + '</div>' +
      '<div class="ptext"' + (it ? ' data-edit="minute:topics:' + it.id + ':text"' : scr.ea('qMark')) + '>' + WU.esc(it ? it.text : S.qMark) + '</div></div>';
    h += '<div class="pbot">';
    var chal = '<div class="chal">' + kinds(S).map(function (k) {
      var K = k.toUpperCase();
      return '<div class="btn' + (st.kind === k ? ' on' : '') + '" data-b="' + K + '"><span><span class="key" data-ctrl>' + K + '</span> <span' + scr.ea(k + 'Name') + '>' + WU.esc(S[k + 'Name']) + '</span></span>' +
        '<small' + scr.ea(k + 'Text') + '>' + WU.esc(S[k + 'Text']) + '</small></div>';
    }).join('') + '</div>';
    if (ph === 'ready') {
      if (!st.player && !st.demo) h += '<div class="brow">' + (S.who ? '<div class="pbig"' + scr.ea('who') + '>' + WU.esc(S.who) + '</div>' : '') +
        '<div class="btn sm" data-ctrl data-b="pick"><span class="key">P</span><span>Pick a student</span></div></div>';
      if (S.ruleShow && S.rule) h += '<div class="rule"' + scr.ea('rule') + '>' + WU.esc(kit.fill(S.rule, { secs: secs() })) + '</div>';
      h += chal;
    } else if (ph === 'talk') {
      if (st.flash) h += '<div class="flash"' + scr.ea(st.flash) + '>' + WU.esc(kit.fill(S[st.flash], { name: speaker() })) + '</div>';
      h += chal;
      if (st.count && S.challenges) h += '<div class="pstat"' + scr.ea('challenges') + '>' + WU.esc(kit.fill(S.challenges, { n: st.count })) + '</div>';
    } else if (ph === 'challenge') {
      h += '<div class="brow"><div class="bigmsg"' + scr.ea('challenge') + '>' + WU.esc(S.challenge) + '</div>' +
        '<div class="pbig"' + scr.ea(st.kind + 'Name') + '>' + WU.esc(S[st.kind + 'Name']) + '</div></div>';
      if (S.accept) h += '<div class="rule"' + scr.ea('accept') + '>' + WU.esc(S.accept) + '</div>';
    } else {
      var cleanRun = !st.accepted && !st.demo;
      h += '<div class="bigmsg"' + scr.ea(cleanRun ? 'clean' : 'last') + '>' + WU.esc(kit.fill(cleanRun ? S.clean : S.last, { name: speaker(), secs: secs() })) + '</div>';
      if (st.count && S.challenges) h += '<div class="pstat"' + scr.ea('challenges') + '>' + WU.esc(kit.fill(S.challenges, { n: st.count })) + '</div>';
    }
    h += '</div>';
    if (ph !== 'ready') h += '<div class="pside"><div class="tslot"></div>' + (ph === 'challenge' ? '<div class="yn" data-ctrl><div class="btn" data-b="Y"><span class="key">Y</span><span>Fair</span></div>' +
      '<div class="btn no" data-b="N"><span class="key">N</span><span>Not fair</span></div></div>' : '') + '</div>';
    box.querySelector('.layer').innerHTML = h;
    if (clock && ph !== 'ready') box.querySelector('.tslot').appendChild(clock.el);
    kit.fit(box.querySelector('.ptext'), 130, 56);
    box.querySelectorAll('[data-b]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); keyAction(b.getAttribute('data-b')); }; });
    renderHints();
  }
  function renderHints() {
    var S = scr.get(), sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, T = WU.state.teams;
    var hs = ph === 'ready' ? [['SPACE', 'start'], ['P', st.player ? 'someone else' : 'pick a student'], ['N', 'other topic'], ['Esc', 'home']]
      : ph === 'talk' ? [['H', 'hesitation'], ['D', 'deviation']].concat(S.useR ? [['R', 'repetition']] : []).concat([['ENTER', 'pause / go'], ['Esc', 'home']])
      : ph === 'challenge' ? (T ? [['1-' + T, 'fair: team point']] : []).concat([['Y', 'fair'], ['N', 'not fair'], ['Esc', 'home']])
      : (T ? [['1-' + T, 'last speaker\'s team']] : []).concat([['SPACE', 'next round'], ['Esc', 'home']]);
    kit.hints(root, hs.concat(sc), function (k) { keyAction(k); });
  }

  function flash(key) {
    st.flash = key; clearT();
    timers.push(setTimeout(function () { if (st && st.flash === key) { st.flash = null; render(); } }, 2600));
  }
  function pick() {
    if (st.phase !== 'ready') return;
    st.demo = false; st.picked = true;
    WU.pickStudent({ onPicked: function (n) { st.player = n; if (box) render(); } });
    render();
  }
  function start() {
    if (st.phase !== 'ready') return;
    WU.sound.unlock(); st.rounds++;
    st.phase = 'talk'; st.count = 0; st.accepted = 0; st.taken = false; st.kind = null; st.flash = null; st.bonus = false;
    if (clock) clock.destroy();
    clock = WU.Timer({ seconds: secs(), size: 400, onDone: timeUp });
    WU.sound.ding(); render(); clock.start();
  }
  function challenge(k) {
    var S = scr.get();
    if (st.phase !== 'talk' || kinds(S).indexOf(k) < 0) return;
    if (clock && clock.isRunning()) clock.toggle();
    st.phase = 'challenge'; st.kind = k; st.count++; st.flash = null;
    WU.sound.buzzer(); render();
  }
  function decide(fair, team) {
    if (st.phase !== 'challenge') return;
    if (fair) { st.accepted++; st.taken = true; flash('taken'); WU.sound.ding(); if (team != null && sb) sb.add(team, 1); }
    else { flash('rejected'); WU.sound.pop(); }
    st.phase = 'talk'; st.kind = null; render();
    if (clock && !clock.isRunning()) clock.toggle();
  }
  function timeUp() { if (!st || st.phase === 'ready' || st.phase === 'end') return; st.phase = 'end'; st.kind = null; st.flash = null; WU.sound.slam(); render(); }
  function next() {
    if (st.phase !== 'end') return;
    if (clock) { clock.destroy(); clock = null; }
    st.phase = 'ready'; st.demo = false; st.player = ''; st.taken = false; newTopic(); WU.sound.pop(); render();
  }
  function refresh() {
    if (!st) return;
    if (st.phase === 'ready' && !st.rounds && !st.picked) st.demo = !!scr.get().demoShow;
    if (!topic()) newTopic();
    render();
  }
  function toggleScores() {
    if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
    sb.show(!sb.visible()); WU.store.set('minute-sb', sb.visible());
  }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { if (ph === 'ready') start(); else if (ph === 'end') next(); else if (ph === 'talk') WU.toast('Challenge? H, D or R.'); }
    else if (k === 'P') pick();
    else if (KINDS[k] && ph === 'talk') challenge(KINDS[k]);
    else if (k === 'Y') decide(true, null);
    else if (k === 'N') { if (ph === 'challenge') decide(false); else if (ph === 'ready') { newTopic(); WU.sound.clack(); render(); } }
    else if (k === 'ENTER') { if (ph === 'talk' && clock) clock.toggle(); }
    else if (k === 'S') toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function team(i) {
    if (i >= WU.state.teams) return false;
    if (st.phase === 'challenge') { decide(true, i); return true; }
    if (st.phase === 'end' && !st.bonus && sb) { sb.add(i, 1); st.bonus = true; WU.sound.ding(); WU.toast('+1'); return true; }
    return false;
  }

  WU.views.minute = {
    title: 'Just a Minute',
    teacher: function () {
      if (!st) return null;
      var it = topic(), info = [];
      info.push({ label: 'Speaker', text: speaker() });
      if (it) info.push({ label: 'Topic', text: it.text });
      info.push({ label: 'Step', text: { ready: 'P pick · N other topic · Space start', talk: 'Listen. H / D / R = challenge', challenge: 'Fair? Y = challenger takes over · N = speaker goes on', end: 'Time up. Space = next round' }[ph()] });
      if (st.count) info.push({ label: 'Challenges', text: st.count + ' (' + st.accepted + ' fair)' });
      return { secret: [], info: info };
    },
    help: function () {
      return [['P', 'pick a student (again = someone else)'], ['N', 'another topic (before the start)'], ['Space', 'start / next round'],
        ['H / D / R', 'challenge: hesitation / deviation / repetition'], ['Y / N', 'fair challenge (challenger takes over) / not fair'],
        ['1 - 4', 'teams: fair challenge from that team, or the point at the end'], ['Enter', 'pause / go'], ['S', 'show / hide scores']];
    },
    mount: function (el) {
      root = el;
      st = { phase: 'ready', player: '', id: null, demo: !!scr.get().demoShow, rounds: 0, count: 0, accepted: 0 };
      el.innerHTML = '<div class="ptg minuteg"><div class="layer"></div>' + kit.header('Just a Minute') + '<div class="hints"></div></div>';
      box = el.querySelector('.ptg');
      WU.wireCommon(el);
      sb = WU.Scoreboard(box);
      if (sb && WU.store.get('minute-sb', true) === false) sb.show(false);
      var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = toggleScores;
      newTopic(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st && box) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { clearT(); if (clock) clock.destroy(); clock = null; if (offContent) offContent(); if (sb) sb.destroy(); sb = null; root = box = st = null; },
    onKey: function (e) {
      var m = /^(?:Digit|Numpad)([1-4])$/.exec(e.code);
      if (m && !e.shiftKey && WU.state.teams && team(+m[1] - 1)) return true;
      if (sb && sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      if (e.key === 'Enter') { e.preventDefault(); keyAction('ENTER'); return true; }
      var map = { p: 'P', h: 'H', d: 'D', r: 'R', y: 'Y', n: 'N', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
  function ph() { return st.phase; }
})();
