/* Warm Up: VANISHING SENTENCE (writing). A sentence from the last lessons; the class reads it aloud together.
   Space: a few words vanish (blank boxes stay, with letter slots at the lower levels) and the class reads it again, missing words too.
   When every word has gone: WRITE IT! Everyone writes the whole sentence on paper (time bar).
   Space: the words come back and students check their spelling; a picked student reads their sentence.
   Keys: Space next step, B bring back one word, N other sentence, P other student, 1-4 team points.
   Content: content/vanish.js through the edit layer (Edit mode, E). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit, gram = WU.gram;

  var scr = kit.screen({
    game: 'vanish', title: 'Vanishing Sentence', content: function () { return WU.content.vanishScreen; },
    fields: [
      { type: 'head', label: 'Sentence' },
      { k: 'tag', label: 'Tag at the top (empty = hide)', type: 'text', max: 30 },
      { k: 'focusShow', label: 'What it practises (tag)', type: 'bool' },
      { k: 'perStep', label: 'Words that vanish each time (1-5)', type: 'num', min: 1, max: 5 },
      { k: 'letters', label: 'Letter slots in the gaps', type: 'bool', on: 'On', off: 'Off' },
      { type: 'head', label: 'Reading' },
      { k: 'read', label: 'First reading', type: 'text', max: 60 },
      { k: 'again', label: 'Reading with gaps', type: 'text', max: 80 },
      { type: 'head', label: 'Writing' },
      { k: 'write', label: 'Big signal', type: 'text', max: 20 },
      { k: 'writeRule', label: 'Writing line', type: 'text', max: 90 },
      { k: 'writeSec', label: 'Writing time (seconds, 0 = no bar)', type: 'num', min: 0, max: 180 },
      { type: 'head', label: 'Check' },
      { k: 'check', label: 'Check line', type: 'text', max: 60 },
      { k: 'say', label: 'Picked student ({name})', type: 'text', max: 50 },
      { k: 'demo', label: 'Teacher demo banner (first sentence only)', type: 'text', max: 40 },
      { k: 'demoShow', label: 'Teacher demo round', type: 'bool', on: 'On', off: 'Off' }
    ]
  });
  WU.registerList('vanish', 'items', {
    gameTitle: 'Vanishing Sentence', label: 'Sentences',
    defaults: function (l) { return WU.content.vanish[l].items; },
    norm: function (r) { return { text: r.text || '', focus: r.focus || '', pic: r.pic || '' }; },
    fields: function () {
      return [
        { k: 'text', label: 'Sentence', type: 'text', max: 90 },
        { k: 'focus', label: 'What it practises (tag)', type: 'text', max: 50 },
        { k: 'pic', label: 'Picture', type: 'pic' }
      ];
    },
    blank: function () { return { text: 'I like playing football.', focus: 'like + -ing', pic: '' }; }
  });

  var sh, box, st, offContent = null;
  var deck = kit.deck(), bar = gram.bar();

  function pool() { return WU.list('vanish', 'items', WU.state.level).filter(function (x) { return x.text && tokens(x.text).some(function (t) { return t.core; }); }); }
  function item() { return WU.list('vanish', 'items', WU.state.level).filter(function (x) { return x.id === st.id; })[0] || null; }
  function S() { return scr.get(); }
  function per() { return Math.max(1, Math.min(5, Math.round(+S().perStep || 1))); }
  // "seven." -> pre "", core "seven", post "."  (punctuation never vanishes)
  function tokens(text) {
    return String(text || '').split(/\s+/).filter(Boolean).map(function (w) {
      var m = /^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/.exec(w) || ['', '', w, ''];
      return { pre: m[1], core: m[2], post: m[3] };
    });
  }
  function words() { var it = item(); return it ? tokens(it.text) : []; }
  function wordIdx() { var o = []; words().forEach(function (t, i) { if (t.core) o.push(i); }); return o; }
  function newItem() {
    var p = pool(), it = deck(p); st.id = it ? it.id : null; st.sig = it ? it.text : '';
    st.order = WU.shuffle(wordIdx()); st.gone = 0; st.phase = 'read'; st.who = null;
  }
  function goneSet() { var o = {}; st.order.slice(0, st.gone).forEach(function (i) { o[i] = true; }); return o; }

  function sentenceHtml(it) {
    var g = st.phase === 'check' ? {} : goneSet(), slots = !!S().letters, back = st.phase === 'check';
    return tokens(it.text).map(function (t, i) {
      var inner;
      if (g[i]) {
        var n = t.core.length, s = '';
        if (slots) for (var k = 0; k < n; k++) s += '<i></i>';
        inner = '<span class="vsgap' + (slots ? ' slots' : '') + '" style="--n:' + n + '">' + s + '</span>';
      } else inner = '<span class="vsw' + (back ? ' back' : '') + '"' + (back ? ' style="animation-delay:' + (i * 0.07).toFixed(2) + 's"' : '') + '>' + WU.esc(t.core) + '</span>';
      return '<span class="vstok">' + WU.esc(t.pre) + inner + WU.esc(t.post) + '</span>';
    }).join(' ');
  }
  function render() {
    var s = S(), it = item(), ph = st.phase, h = '';
    h += '<div class="ghead">' + kit.chip(s.tag, scr.ea('tag'), '#00e5c7') +
      (it && s.focusShow && it.focus ? '<div class="gpill alt vsfocus"' + WU.editAttr('vanish', 'items', it.id, 'focus') + '>' + WU.esc(it.focus) + '</div>' : '') +
      (st.demo && s.demo ? '<div class="demo"' + scr.ea('demo') + '>' + WU.esc(s.demo) + '</div>' : '') + '</div>';
    if (ph === 'write') h += bar.html();
    if (!it) { h += '<div class="vsempty" data-ctrl>No sentences for this level yet. Press E to add some.</div>'; box.querySelector('.layer').innerHTML = h; renderHints(); return; }
    var total = wordIdx().length;
    h += '<div class="vscard' + (ph === 'write' ? ' empty' : '') + (ph === 'check' ? ' lit' : '') + '">' +
      (it.pic ? '<div class="vspic"' + WU.editAttr('vanish', 'items', it.id, 'pic') + '>' + WU.pic(it.pic) + '</div>' : '') +
      '<div class="vstext"' + WU.editAttr('vanish', 'items', it.id, 'text') + '>' + sentenceHtml(it) + '</div></div>';
    h += '<div class="vsbottom">';
    if (ph === 'read') h += '<div class="vsbig"' + scr.ea('read') + '>' + WU.esc(s.read) + '</div>';
    else if (ph === 'gone') h += '<div class="vsbig"' + scr.ea('again') + '>' + WU.esc(s.again) + '</div><div class="vsdots" data-auto>' + dots(total) + '</div>';
    else if (ph === 'write') h += '<div class="gshow vswrite"' + scr.ea('write') + '>' + WU.esc(s.write) + '</div><div class="rule"' + scr.ea('writeRule') + '>' + WU.esc(s.writeRule) + '</div>';
    else h += '<div class="vsbig"' + scr.ea('check') + '>' + WU.esc(s.check) + '</div>' + gram.who(s.say, scr.ea('say'), st.who);
    h += '</div>';
    box.querySelector('.layer').innerHTML = h;
    kit.fit(box.querySelector('.vstext'), it.pic ? 96 : 104, 44);
    if (ph === 'write') bar.redraw(box);
    renderHints();
  }
  function dots(total) {
    var h = ''; for (var i = 0; i < total; i++) h += '<i class="' + (i < st.gone ? 'off' : '') + '"></i>'; return h;
  }
  function renderHints() {
    var sc = WU.state.teams ? [['S', 'scores']] : [], ph = st.phase, hs;
    if (ph === 'read') hs = [['SPACE', 'words vanish'], ['N', 'other sentence'], ['Esc', 'home']];
    else if (ph === 'gone') hs = [['SPACE', st.gone + per() >= wordIdx().length ? 'all gone: write!' : 'more words vanish'], ['B', 'bring one back'], ['N', 'other sentence'], ['Esc', 'home']];
    else if (ph === 'write') hs = [['SPACE', 'words come back'], ['B', 'bring one back'], ['Esc', 'home']];
    else hs = [['SPACE', 'next sentence'], ['P', 'other student'], ['Esc', 'home']];
    kit.hints(sh.root, hs.concat(sc), keyAction);
  }

  /* ---------- flow ---------- */
  function vanish() {
    var total = wordIdx().length;
    st.gone = Math.min(total, st.gone + per());
    if (st.gone >= total) { write(); return; }
    st.phase = 'gone'; WU.sound.pop(); render();
  }
  function write() {
    st.phase = 'write'; WU.sound.slam(); render();
    var sec = Math.max(0, Math.min(180, +S().writeSec || 0));
    if (sec) bar.start(box, sec, function () { if (st && st.phase === 'write') check(); });
  }
  function check() { bar.stop(); st.phase = 'check'; st.who = kit.student(); WU.sound.ding(); render(); }
  function bringBack() {
    if (st.phase !== 'gone' && st.phase !== 'write') return;
    bar.stop(); st.gone = Math.max(0, st.gone - 1); st.phase = st.gone ? 'gone' : 'read'; WU.sound.clack(); render();
  }
  function next() { bar.stop(); st.demo = false; newItem(); WU.sound.pop(); render(); }
  function keyAction(k) {
    var ph = st.phase;
    if (k === 'SPACE') { st.moved = true; if (ph === 'read' || ph === 'gone') vanish(); else if (ph === 'write') check(); else next(); }
    else if (k === 'B') { st.moved = true; bringBack(); }
    else if (k === 'N') { st.moved = true; next(); }
    else if (k === 'P') { if (ph === 'check') { st.who = kit.student([st.who]); WU.sound.clack(); render(); } }
    else if (k === 'S') sh.toggleScores();
    else if (k === 'Esc') WU.go('home');
  }
  function refresh() {
    if (!st) return;
    if (!st.moved) st.demo = !!S().demoShow;
    var it = item();
    if (!it) newItem();
    else if (it.text !== st.sig) { st.sig = it.text; st.order = WU.shuffle(wordIdx()); st.gone = Math.min(st.gone, st.order.length); }
    render();
  }

  WU.views.vanish = {
    title: 'Vanishing Sentence',
    teacher: function () {
      if (!st) return null;
      var it = item(), sec = [], info = [];
      if (it) { sec.push({ label: 'Sentence', text: it.text, big: true }); if (it.focus) info.push({ label: 'Practises', text: it.focus }); }
      info.push({ label: 'Words gone', text: st.gone + ' / ' + wordIdx().length });
      if (st.who && st.phase === 'check') info.push({ label: 'Reads the sentence', text: st.who });
      return { secret: sec, info: info };
    },
    help: function () { return [['Space', 'words vanish / write / words come back / next sentence'], ['B', 'bring one word back'], ['N', 'other sentence'], ['P', 'other student (at the check)'], ['1 - 4', 'team point'], ['S', 'show / hide scores']]; },
    mount: function (el) {
      sh = gram.shell(el, 'vsg', 'Vanishing Sentence', 'vanish-sb'); box = sh.box;
      st = { phase: 'read', id: null, order: [], gone: 0, demo: !!S().demoShow, who: null, moved: false };
      newItem(); render();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (st) render(); });
      offContent = WU.on('content', refresh);
    },
    unmount: function () { bar.stop(); if (offContent) offContent(); if (sh) sh.destroy(); sh = box = st = null; },
    onKey: function (e) {
      if (sh.sb && sh.sb.onKey(e)) return true;
      if (e.code === 'Space') { e.preventDefault(); keyAction('SPACE'); return true; }
      var map = { b: 'B', n: 'N', p: 'P', s: 'S' }, k = map[e.key.toLowerCase()];
      if (k) { keyAction(k); return true; }
    }
  };
})();
