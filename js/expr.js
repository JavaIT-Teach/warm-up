/* Warm Up: the shared EXPRESSION BANK (content/replies.js, owned by Natural Replies).
   Natural replies by function: hello, reply, agree, disagree, thanks, welcome, sympathy, happy, short, vague, surprise.
   Other games show a strip of them ("Try: I couldn't agree more. · Not necessarily."). Each game's "Screen text & timing"
   has the fields from WU.expr.fields(prefix): on / off, the label, which categories (comma list) and how many to show.
   Everything in the strip is editable: the label in the game's screen record, each expression in Natural Replies > Expressions. */
(function () {
  'use strict';
  var WU = window.WU;
  var X = WU.expr = {};
  X.CATS = ['hello', 'reply', 'agree', 'disagree', 'thanks', 'welcome', 'sympathy', 'happy', 'short', 'vague', 'surprise'];

  WU.registerList('replies', 'bank', {
    gameTitle: 'Natural Replies', label: 'Expressions (shared with other games)',
    defaults: function (l) { return WU.content.replies[l].bank; },
    norm: function (r) { return { cat: X.CATS.indexOf(r.cat) >= 0 ? r.cat : 'agree', text: r.text || '' }; },
    title: function (it) { return it.text + '  (' + it.cat + ')'; },
    fields: function () {
      return [
        { k: 'text', label: 'Expression', type: 'text', max: 60 },
        { k: 'cat', label: 'Kind: ' + X.CATS.join(', '), type: 'text', max: 12, hint: 'One of the kinds above. Games show the kinds they need.' }
      ];
    },
    blank: function () { return { cat: 'agree', text: 'Exactly!' }; }
  });

  X.cats = function (s) { return String(s || '').split(',').map(function (c) { return c.trim().toLowerCase(); }).filter(function (c) { return X.CATS.indexOf(c) >= 0; }); };
  X.list = function (cats, level) {
    var cs = typeof cats === 'string' ? X.cats(cats) : cats;
    return WU.list('replies', 'bank', level == null ? WU.state.level : level).filter(function (x) { return x.text && cs.indexOf(x.cat) >= 0; });
  };
  X.attr = function (it) { return ' data-edit="replies:bank:' + it.id + ':text"'; };

  // n expressions from the categories, spread over them in turn. The same key gives the same pick (no reshuffle on redraw).
  var cache = {};
  X.pick = function (cats, n, key) {
    var cs = X.cats(cats), all = X.list(cs), sig = key + '|' + cs.join(',') + '|' + n + '|' + WU.state.level;
    var c = cache[sig];
    if (c) { var still = c.map(function (id) { return all.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean); if (still.length === c.length) return still; }
    var pools = cs.map(function (k) { return WU.shuffle(all.filter(function (x) { return x.cat === k; })); }), out = [];
    for (var i = 0; out.length < n && i < 50; i++) { var p = pools[i % pools.length]; if (p && p.length) out.push(p.shift()); if (!pools.some(function (q) { return q.length; })) break; }
    cache[sig] = out.map(function (x) { return x.id; });
    return out;
  };

  // The strip. S = the game's screen record, ea(field) = its edit attribute, key = what it belongs to (a statement id...).
  X.strip = function (S, ea, key, prefix) {
    var p = prefix || 'expr';
    if (!S[p + 'Show']) return '';
    var items = X.pick(S[p + 'Cats'], Math.max(1, Math.min(8, +S[p + 'N'] || 3)), key + ':' + p);
    if (!items.length) return '';
    return '<div class="xstrip">' + (S[p + 'Label'] ? '<span class="xl"' + ea(p + 'Label') + '>' + WU.esc(S[p + 'Label']) + '</span>' : '') +
      items.map(function (it) { return '<span class="xe"' + X.attr(it) + '>' + WU.esc(it.text) + '</span>'; }).join('') + '</div>';
  };

  // Field definitions for a game's screen record.
  X.fields = function (prefix, title) {
    var p = prefix || 'expr';
    return [
      { type: 'head', label: title || 'Natural expressions (from Natural Replies)' },
      { k: p + 'Show', label: 'Expression strip', type: 'bool', on: 'On', off: 'Off' },
      { k: p + 'Label', label: 'Label before the expressions', type: 'text', max: 30 },
      { k: p + 'Cats', label: 'Kinds, separated by commas: ' + X.CATS.join(', '), type: 'text', max: 80, hint: 'Edit the expressions themselves in Natural Replies > Expressions.' },
      { k: p + 'N', label: 'How many to show', type: 'num', min: 1, max: 8 }
    ];
  };
})();
