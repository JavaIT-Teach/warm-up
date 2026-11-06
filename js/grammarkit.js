/* Warm Up: shared pieces for the grammar games (G1, G2...). Each grammar game drills one grammar point:
   a prompt appears, a student (or the whole class) says the answer, Space reveals the model answer.
   WU.gram.shell(el, cls, title, sbKey) builds the screen (layer, header, key hints, team scoreboard).
   WU.gram.bar() is a thin time bar: start(seconds, onDone), stop(). */
(function () {
  'use strict';
  var WU = window.WU, kit = WU.kit;
  var gram = WU.gram = {};

  gram.shell = function (el, cls, title, sbKey) {
    el.innerHTML = '<div class="gg ' + cls + '"><div class="layer"></div>' + kit.header(title) + '<div class="hints"></div></div>';
    var box = el.querySelector('.gg');
    WU.wireCommon(el);
    var sb = WU.Scoreboard(box);
    if (sb && WU.store.get(sbKey, true) === false) sb.show(false);
    var o = {
      root: el, box: box, sb: sb, layer: box.querySelector('.layer'),
      toggleScores: function () {
        if (!sb) { WU.toast('Turn on teams in Settings first.'); return; }
        sb.show(!sb.visible()); WU.store.set(sbKey, sb.visible());
      },
      destroy: function () { if (sb) sb.destroy(); sb = null; }
    };
    var sbtn = el.querySelector('[data-h="scores"]'); if (sbtn) sbtn.onclick = o.toggleScores;
    return o;
  };

  // The model answer strip. html is already escaped / marked.
  gram.answer = function (label, labelAttr, html, attr) {
    return '<div class="gans">' + (label ? '<div class="gans-l"' + (labelAttr || '') + '>' + WU.esc(label) + '</div>' : '') +
      '<div class="gans-t"' + (attr || '') + '>' + html + '</div></div>';
  };
  // "Ali, your turn!" (the name is generated: data-auto; the words around it are editable).
  gram.who = function (tpl, attr, name) {
    if (!tpl || !name) return '';
    var parts = String(tpl).split('{name}');
    return '<div class="gwho"' + (attr || '') + '>' + WU.esc(parts[0]) + (parts.length > 1 ? '<b data-auto>' + WU.esc(name) + '</b>' + WU.esc(parts.slice(1).join('{name}')) : '') + '</div>';
  };

  // A thin time bar (no numbers): runs down, buzzes at zero.
  gram.bar = function () {
    var t = null, start = 0, total = 0, done = null;
    return {
      html: function () { return '<div class="gbar" data-ctrl><i></i></div>'; },
      start: function (root, sec, onDone) {
        this.stop(); if (!sec) return;
        total = sec * 1000; start = Date.now(); done = onDone;
        var go = function () { var b = root && root.querySelector('.gbar i'); if (b) { b.style.transition = 'none'; b.style.width = '100%'; void b.offsetWidth; b.style.transition = 'width ' + sec + 's linear'; b.style.width = '0%'; } };
        go();
        t = setTimeout(function () { t = null; WU.sound.buzzer(); if (done) done(); }, total);
      },
      // Redraw after a render (keeps the remaining time).
      redraw: function (root) {
        var b = root && root.querySelector('.gbar i'); if (!b) return;
        if (!t) { b.style.transition = 'none'; b.style.width = '0%'; return; }
        var left = Math.max(0, total - (Date.now() - start));
        b.style.transition = 'none'; b.style.width = (left / total * 100) + '%'; void b.offsetWidth;
        b.style.transition = 'width ' + (left / 1000) + 's linear'; b.style.width = '0%';
      },
      running: function () { return !!t; },
      stop: function () { if (t) clearTimeout(t); t = null; }
    };
  };

  // Mark a ___ gap inside escaped text with a drawn gap, or fill it with the answer (highlighted).
  gram.gaps = function (text, fills) {
    var parts = String(text || '').split('___'), h = WU.esc(parts[0]);
    for (var i = 1; i < parts.length; i++) {
      var f = fills ? fills[i - 1] : null, before = parts.slice(0, i).join('___');
      if (f == null) h += '<span class="gap"></span>';
      else {
        // A gap at the start of a sentence gets a capital letter.
        if (f && /(^|[.!?]\s+)$/.test(before)) f = f.charAt(0).toUpperCase() + f.slice(1);
        h += '<span class="gfill' + (f === '' ? ' none' : '') + '">' + (f === '' ? '&#8709;' : WU.esc(f)) + '</span>';
      }
      h += WU.esc(parts[i]);
    }
    return h;
  };
})();
