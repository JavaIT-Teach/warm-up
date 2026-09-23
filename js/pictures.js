/* Warm Up: picture library. Flat drawn SVG nouns in the Riot Pop style (thick black outline, flat colour).
   Each entry: [id, English name, tags, drawing]. A drawing is a mini path language (see draw()) or a function
   that returns SVG markup. Every game reuses these pictures. Beginners see a picture next to every word.

   Mini language, items separated by "|":
     c cx cy r FILL            circle
     e cx cy rx ry FILL [rot]  ellipse
     r x y w h FILL [rx]       rectangle
     p FILL d...               path
     g FILL x,y x,y ...        polygon
     l x1 y1 x2 y2             line
   FILL is a colour letter (see COL), a #hex, or "-" for none. A trailing * means no outline.
   Options: s=COLOUR (outline colour), w=WIDTH (outline width). Default outline: black, 4. */
(function () {
  'use strict';
  var WU = window.WU = window.WU || {};

  var COL = {
    K: '#0d0d0d', W: '#ffffff', C: '#f4f1ea', Y: '#ffe600', L: '#c6ff00', O: '#ff5a1f', B: '#3d6bff', P: '#ff4fc3',
    T: '#00e5c7', R: '#ff3b3b', G: '#33c24d', D: '#1e8e3e', N: '#b0703a', M: '#6b3d16', S: '#f5c9a0', A: '#a7a7a7',
    E: '#dcdcdc', Z: '#5f5f5f', V: '#9b5de5', U: '#8fdcff', F: '#f2c26b', H: '#fff3b0', X: '#ff9a1f', Q: '#ffb6de'
  };
  function col(t) { return t === '-' ? 'none' : (COL[t] || t); }

  function draw(dsl) {
    return dsl.split('|').map(function (item) {
      var tk = item.trim().split(/\s+/), type = tk.shift(), opt = {}, a = [];
      tk.forEach(function (t) { var m = /^([sw])=(.+)$/.exec(t); if (m) opt[m[1]] = m[2]; else a.push(t); });
      var st = function (f) {
        var ns = f && f.charAt(f.length - 1) === '*'; if (ns) f = f.slice(0, -1);
        return 'fill="' + col(f) + '" stroke="' + (ns ? 'none' : col(opt.s || 'K')) + '" stroke-width="' + (opt.w || 4) + '"';
      };
      switch (type) {
        case 'c': return '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="' + a[2] + '" ' + st(a[3]) + '/>';
        case 'e': return '<ellipse cx="' + a[0] + '" cy="' + a[1] + '" rx="' + a[2] + '" ry="' + a[3] + '" ' + st(a[4]) +
          (a[5] ? ' transform="rotate(' + a[5] + ' ' + a[0] + ' ' + a[1] + ')"' : '') + '/>';
        case 'r': return '<rect x="' + a[0] + '" y="' + a[1] + '" width="' + a[2] + '" height="' + a[3] + '" rx="' + (a[5] || 0) + '" ' + st(a[4]) + '/>';
        case 'p': return '<path d="' + a.slice(1).join(' ') + '" ' + st(a[0]) + '/>';
        case 'g': return '<polygon points="' + a.slice(1).join(' ') + '" ' + st(a[0]) + '/>';
        case 'l': return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + a[2] + '" y2="' + a[3] + '" ' + st('-') + '/>';
      }
      return '';
    }).join('');
  }
  function grp(t, dsl) { return '<g transform="' + t + '">' + draw(dsl) + '</g>'; }
  function poly(cx, cy, r, n, rot) {
    var p = [];
    for (var i = 0; i < n; i++) { var a = (rot || -90) * Math.PI / 180 + i * 2 * Math.PI / n; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    return p.join(' ');
  }
  function star(cx, cy, R, r, n) {
    var p = [], k = n || 5;
    for (var i = 0; i < k * 2; i++) { var a = -Math.PI / 2 + i * Math.PI / k, rr = i % 2 ? r : R; p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); }
    return p.join(' ');
  }

  /* ---------- people ---------- */
  function personDSL(o) {
    var H = o.hair || 'M', s = o.style || 'short', p = [];
    if (o.back) p.push(o.back);
    if (s === 'long') p.push('p ' + H + ' M27 74 Q20 18 50 17 Q80 18 73 74 Z');
    if (s === 'bun') p.push('c 50 14 9 ' + H);
    if (s === 'pig') p.push('c 26 38 9 ' + H + '|c 74 38 9 ' + H);
    p.push('p ' + (o.body || 'B') + ' M18 100 Q18 65 50 63 Q82 65 82 100 Z');
    if (o.bodyTop) p.push(o.bodyTop);
    p.push('c 50 40 20 ' + (o.skin || 'S'));
    if (s === 'short') p.push('p ' + H + ' M30 40 Q28 16 50 16 Q72 16 70 40 Q66 27 50 28 Q34 27 30 40 Z');
    if (s === 'long' || s === 'pig' || s === 'bun') p.push('p ' + H + ' M30 38 Q31 17 50 17 Q69 17 70 38 Q62 26 50 29 Q38 26 30 38 Z');
    if (s === 'spiky') p.push('g ' + H + ' 30,38 31,18 39,24 45,11 52,21 59,13 63,23 70,19 70,38 50,27');
    if (s === 'bald') p.push('e 31 40 4 9 ' + H + '|e 69 40 4 9 ' + H);
    p.push('c 43 41 2.8 K*|c 57 41 2.8 K*');
    if (!o.noMouth) p.push('p - M44 49 Q50 54 56 49 w=3');
    if (o.glasses) p.push('c 43 41 6 - w=3|c 57 41 6 - w=3|l 49 41 51 41 w=3');
    if (o.top) p.push(o.top);
    return p.join('|');
  }
  function person(o) {
    var d = personDSL(o);
    return function () { return o.kid ? grp('translate(12 23) scale(.77)', d) : draw(d); };
  }

  var SPLASH = 'M50 8 Q58 22 66 12 Q70 28 86 24 Q80 40 94 48 Q80 56 88 72 Q70 70 68 88 Q56 78 48 94 Q42 78 26 86 Q28 70 10 68 Q20 56 6 46 Q22 40 14 24 Q32 28 34 12 Q44 22 50 8 Z';
  function splash(c) { return 'p ' + c + ' ' + SPLASH + '|e 38 36 8 5 W* -30'; }
  var CLOUD = 'M22 76 Q6 76 8 60 Q10 46 26 48 Q28 26 50 28 Q66 18 76 36 Q94 36 92 56 Q92 76 74 76 Z';
  var HORSE = 'M22 94 L28 50 Q30 22 54 16 L58 6 L64 18 Q82 26 90 52 Q94 66 82 70 Q70 72 64 60 L54 64 L54 94 Z';
  var GUITAR = 'M50 30 Q66 30 66 45 Q66 53 62 57 Q77 63 75 79 Q73 96 50 96 Q27 96 25 79 Q23 63 38 57 Q34 53 34 45 Q34 30 50 30 Z';

  var PICS = [
    /* animals */
    ['cat', 'cat', 'animal pet small', 'g O 22,44 28,12 48,30|g O 78,44 72,12 52,30|g P* 29,36 30,21 40,31|g P* 71,36 70,21 60,31|c 50 56 30 O|c 39 50 4.5 K*|c 61 50 4.5 K*|g P 45,60 55,60 50,66|p - M42 71 Q50 77 58 71 w=3|l 14 60 34 63 w=3|l 14 70 34 69 w=3|l 86 60 66 63 w=3|l 86 70 66 69 w=3'],
    ['dog', 'dog', 'animal pet', 'e 25 50 11 24 M 20|e 75 50 11 24 M -20|c 50 52 27 N|e 50 68 16 12 F|c 40 45 4.5 K*|c 60 45 4.5 K*|e 50 62 7 5 K|p P M45 73 Q50 86 55 73 Z'],
    ['fish', 'fish', 'animal pet sea', 'g T 74,50 95,30 93,70|p T M12 50 Q44 16 78 50 Q44 84 12 50 Z|c 32 45 6 W|c 33 45 3 K*|p - M52 34 Q60 50 52 66 w=3'],
    ['bird', 'bird', 'animal pet sky', 'l 50 78 44 94|l 64 78 64 94|g Y 32,52 10,42 16,64|g O 84,42 98,49 84,56|c 58 52 27 Y|e 50 60 15 9 X -20|c 68 42 4.5 K*'],
    ['cow', 'cow', 'animal farm big', 'g H 32,22 26,6 40,16|g H 68,22 74,6 60,16|e 22 34 11 6 W -20|e 78 34 11 6 W 20|r 26 16 48 62 W 22|e 38 30 7 9 K* 20|e 63 30 6 8 K* -10|c 40 50 4 K*|c 60 50 4 K*|e 50 74 22 14 Q|c 43 74 3 K*|c 57 74 3 K*'],
    ['pig', 'pig', 'animal farm', 'g Q 24,36 20,10 44,24|g Q 76,36 80,10 56,24|c 50 54 32 Q|e 50 64 15 10 P|c 45 64 3 M*|c 55 64 3 M*|c 38 45 4 K*|c 62 45 4 K*'],
    ['horse', 'horse', 'animal farm big', 'p N ' + HORSE + '|p K M28 50 Q30 22 54 16 L46 30 L40 48 L34 70 Z|c 64 34 4 K*|c 84 60 2.5 K*'],
    ['sheep', 'sheep', 'animal farm', 'l 40 72 40 92 w=6|l 60 72 60 92 w=6|c 28 50 14 W|c 50 38 16 W|c 72 50 14 W|c 38 64 14 W|c 62 64 14 W|c 50 54 16 W*|e 34 46 8 4 K -25|e 66 46 8 4 K 25|e 50 52 12 15 K|c 45 49 3 W*|c 55 49 3 W*'],
    ['chicken', 'chicken', 'animal farm', 'l 42 84 40 96 s=X|l 56 84 58 96 s=X|g W 24,58 8,40 28,44|c 48 62 26 W|p R M60 20 Q60 8 67 13 Q71 4 76 15 Z|c 68 32 14 W|g Y 80,30 94,34 80,39|e 79 43 3 5 R|c 70 29 3 K*|p - M36 62 Q46 72 58 62 w=3'],
    ['duck', 'duck', 'animal farm', 'e 46 66 32 20 Y|c 66 36 15 Y|e 85 40 11 5 X|c 68 32 3 K*|p - M28 62 Q42 76 58 62 w=3'],
    ['rabbit', 'rabbit', 'animal pet', 'e 38 26 8 22 W -8|e 62 26 8 22 W 8|e 38 28 4 14 Q* -8|e 62 28 4 14 Q* 8|c 50 62 26 W|c 41 58 4 K*|c 59 58 4 K*|g P 46,66 54,66 50,71|r 45 73 10 8 W 1|l 50 73 50 81 w=2'],
    ['mouse', 'mouse', 'animal pet small', 'c 26 34 16 A|c 74 34 16 A|c 26 34 9 Q*|c 74 34 9 Q*|c 50 58 26 A|c 41 54 4 K*|c 59 54 4 K*|c 50 67 5 P|l 18 64 38 67 w=3|l 82 64 62 67 w=3|l 18 72 38 70 w=3|l 82 72 62 70 w=3'],
    ['lion', 'lion', 'animal wild big', 'g X ' + star(50, 52, 46, 36, 12) + '|c 32 30 8 Y|c 68 30 8 Y|c 50 54 28 Y|c 40 48 4 K*|c 60 48 4 K*|g M 44,58 56,58 50,65|p - M42 70 Q50 76 50 66 Q50 76 58 70 w=3'],
    ['elephant', 'elephant', 'animal wild big', 'e 22 46 18 24 A|e 78 46 18 24 A|c 50 42 24 A|p W M38 60 Q33 72 40 78 L43 64 Z|p W M62 60 Q67 72 60 78 L57 64 Z|p A M42 56 Q40 80 48 94 L58 92 Q52 80 58 56 Z|c 41 38 3.5 K*|c 59 38 3.5 K*'],
    ['monkey', 'monkey', 'animal wild', 'c 20 46 11 N|c 80 46 11 N|c 20 46 6 F*|c 80 46 6 F*|c 50 48 30 N|p F M30 50 Q30 30 42 32 Q50 37 58 32 Q70 30 70 50 Q72 78 50 80 Q28 78 30 50 Z|c 42 46 4 K*|c 58 46 4 K*|c 47 58 1.8 K*|c 53 58 1.8 K*|p - M40 66 Q50 74 60 66 w=3'],
    ['snake', 'snake', 'animal wild', 'p - M18 88 Q8 70 30 66 Q60 62 60 46 Q60 30 42 30 Q26 30 34 18 s=K w=18|p - M18 88 Q8 70 30 66 Q60 62 60 46 Q60 30 42 30 Q26 30 34 18 s=G w=10|p - M54 14 L62 14 M62 14 L66 10 M62 14 L66 18 s=R w=3|e 42 15 12 9 G|c 46 12 2.5 K*'],
    ['frog', 'frog', 'animal wild green small', 'e 50 60 40 28 G|c 32 32 14 G|c 68 32 14 G|c 32 32 8 W|c 68 32 8 W|c 33 32 4 K*|c 69 32 4 K*|p - M24 62 Q50 80 76 62 w=4|c 44 52 1.8 K*|c 56 52 1.8 K*'],
    ['bear', 'bear', 'animal wild big', 'c 26 26 12 N|c 74 26 12 N|c 26 26 6 M*|c 74 26 6 M*|c 50 54 34 N|e 50 67 15 12 F|e 50 61 6 4 K*|c 38 48 4 K*|c 62 48 4 K*|p - M50 64 L50 71 M44 73 Q50 78 56 73 w=3'],
    ['giraffe', 'giraffe', 'animal wild big', 'p Y M36 96 L44 34 L60 36 L58 96 Z|c 48 56 4 N*|c 54 72 5 N*|c 45 84 4 N*|c 52 44 3 N*|l 54 16 52 5|l 62 14 63 4|c 52 5 3 M|c 63 4 3 M|e 48 20 7 3 Y -30|e 64 26 20 11 Y 15|c 62 22 3 K*|c 78 31 2 K*'],
    ['zebra', 'zebra', 'animal wild', 'r 44 8 12 18 K 3|g W 36,26 30,6 46,20|g W 64,26 70,6 54,20|r 34 18 32 66 W 16|l 36 34 50 38 w=5|l 64 34 50 38 w=5|l 35 50 47 52 w=5|l 65 50 53 52 w=5|l 36 64 44 64 w=5|l 64 64 56 64 w=5|c 42 42 3.5 K*|c 58 42 3.5 K*|e 50 80 16 12 Z|c 44 80 2.5 K*|c 56 80 2.5 K*'],
    ['owl', 'owl', 'animal wild sky', 'g N 20,28 24,6 40,22|g N 80,28 76,6 60,22|e 50 56 34 38 N|e 50 72 20 18 F|c 36 42 13 W|c 64 42 13 W|c 36 42 6 K*|c 64 42 6 K*|g X 45,52 55,52 50,62|l 42 92 42 98 s=X|l 58 92 58 98 s=X'],
    ['bee', 'bee', 'animal small yellow', 'e 38 30 11 15 U -20|e 58 30 11 15 U 20|g K 16,58 6,54 6,62|e 48 58 32 22 Y|l 38 38 38 78 w=8|l 54 37 54 79 w=8|c 82 56 11 K|c 85 53 3 W*|p - M84 45 Q86 36 94 34 w=3'],
    ['butterfly', 'butterfly', 'animal small sky', 'e 30 36 20 18 P -20|e 70 36 20 18 P 20|e 32 68 14 14 X|e 68 68 14 14 X|c 30 34 5 Y*|c 70 34 5 Y*|e 50 52 6 30 K|p - M48 24 Q42 12 34 10 w=3|p - M52 24 Q58 12 66 10 w=3'],
    ['turtle', 'turtle', 'animal pet sea green', 'e 24 78 8 7 G|e 76 78 8 7 G|c 86 58 10 G|c 89 55 2.5 K*|p D M14 72 Q16 26 50 24 Q84 26 86 72 Z|p - M32 72 L36 50 L64 50 L68 72 M36 50 L50 34 L64 50 s=H w=3|r 10 68 80 10 G 5'],
    ['octopus', 'octopus', 'animal sea', 'e 26 80 7 16 V 30|e 42 84 7 14 V 10|e 58 84 7 14 V -10|e 74 80 7 16 V -30|p V M18 66 Q12 10 50 8 Q88 10 82 66 Z|c 38 44 7 W|c 62 44 7 W|c 39 45 3.5 K*|c 63 45 3.5 K*|p - M42 56 Q50 62 58 56 w=3'],
    ['whale', 'whale', 'animal sea big', 'p - M40 28 Q36 14 30 10 M40 28 Q44 14 50 10 s=U w=5|p B M8 58 Q12 28 48 30 Q76 32 84 50 L96 38 L94 68 L84 60 Q76 80 44 80 Q10 82 8 58 Z|c 26 52 3.5 K*|p - M12 64 Q24 68 36 64 w=3'],
    ['ant', 'ant', 'animal small', 'l 18 40 8 24|l 26 40 30 22|p - M46 54 L30 76 M46 54 L46 82 M46 54 L62 80 M46 54 L30 36 M46 54 L62 34 w=4|c 22 48 11 K|c 46 54 9 K|c 72 58 17 K|c 18 45 2.5 W*'],

    /* fruit and vegetables */
    ['apple', 'apple', 'food fruit red', 'p R M50 30 Q30 16 17 38 Q9 72 34 89 Q42 94 50 88 Q58 94 66 89 Q91 72 83 38 Q70 16 50 30 Z|p - M50 30 Q50 18 56 9 s=M w=5|e 65 16 10 5 G -30|e 34 44 5 8 W* 20'],
    ['banana', 'banana', 'food fruit yellow breakfast', 'p Y M16 28 Q18 80 70 86 Q90 86 92 76 Q58 76 40 56 Q27 42 26 22 Z|p M M16 30 L13 21 L24 19 L26 23 Z'],
    ['orange', 'orange', 'food fruit', 'c 50 54 36 X|e 60 18 10 5 G 20|c 40 44 1.8 M*|c 58 60 1.8 M*|c 64 40 1.8 M*|c 44 68 1.8 M*|e 36 40 5 8 W* 30'],
    ['grapes', 'grapes', 'food fruit', 'p - M50 22 L52 8 s=M w=5|e 63 12 9 5 G 20|c 32 32 11 V|c 50 32 11 V|c 68 32 11 V|c 41 50 11 V|c 59 50 11 V|c 23 50 11 V|c 77 50 11 V|c 32 68 11 V|c 50 68 11 V|c 68 68 11 V|c 41 85 11 V|c 59 85 11 V'],
    ['lemon', 'lemon', 'food fruit yellow', 'e 8 58 5 4 Y|e 92 50 5 4 Y|p Y M10 58 Q12 26 50 26 Q86 26 90 50 Q86 84 50 82 Q14 84 10 58 Z|e 38 42 8 4 W* -10'],
    ['strawberry', 'strawberry', 'food fruit red', 'p R M50 92 Q12 70 18 40 Q30 26 50 30 Q70 26 82 40 Q88 70 50 92 Z|g G 28,34 38,20 50,30 62,20 72,34 50,40|c 36 50 2.2 Y*|c 50 52 2.2 Y*|c 64 50 2.2 Y*|c 42 66 2.2 Y*|c 58 66 2.2 Y*|c 50 80 2.2 Y*'],
    ['watermelon', 'watermelon', 'food fruit green red', 'p G M6 36 A44 44 0 0 0 94 36 Z|p R M15 36 A35 35 0 0 0 85 36 Z|c 34 52 2.5 K*|c 50 58 2.5 K*|c 66 52 2.5 K*|c 42 66 2.5 K*|c 58 66 2.5 K*'],
    ['pear', 'pear', 'food fruit green', 'p - M50 14 L52 4 s=M w=5|e 62 8 8 4 G 20|p G M50 12 Q40 12 40 32 Q40 42 30 54 Q18 72 30 87 Q50 99 70 87 Q82 72 70 54 Q60 42 60 32 Q60 12 50 12 Z|e 36 66 4 8 W* 20'],
    ['cherry', 'cherry', 'food fruit red small', 'p - M32 70 Q40 30 60 12 M66 66 Q62 34 60 12 s=D w=4|e 70 16 10 5 G 20|c 30 72 16 R|c 66 68 16 R|c 24 66 3 W*|c 60 62 3 W*'],
    ['pineapple', 'pineapple', 'food fruit yellow', 'g G 50,2 42,28 58,28|g G 34,8 40,30 50,28|g G 66,8 60,30 50,28|e 50 64 26 32 Y|p - M36 44 L64 84 M28 60 L50 90 M46 34 L74 72 M64 44 L36 84 M72 60 L50 90 M54 34 L26 72 s=#c99a00 w=3'],
    ['carrot', 'carrot', 'food veg', 'g G 64,24 70,4 80,20|g G 70,28 92,16 86,34|p X M58 22 Q84 22 80 46 L22 92 Q12 92 14 82 Z|l 44 52 52 56 w=3|l 34 66 40 70 w=3'],
    ['tomato', 'tomato', 'food veg red', 'c 50 56 34 R|g G 50,24 36,14 42,28 28,30 44,33 50,42 56,33 72,30 58,28 64,14|e 36 46 5 8 W* 30'],
    ['potato', 'potato', 'food veg', 'p #d9a760 M18 44 Q22 20 52 22 Q86 22 84 54 Q84 84 50 82 Q14 82 18 44 Z|c 36 40 2.5 N*|c 60 36 2.5 N*|c 66 60 2.5 N*|c 40 64 2.5 N*'],
    ['onion', 'onion', 'food veg', 'p - M44 90 L42 97 M50 90 L50 97 M56 90 L58 97 w=3|p #c77dbb M50 12 Q54 30 76 44 Q92 64 76 82 Q50 96 24 82 Q8 64 24 44 Q46 30 50 12 Z|p - M50 30 Q38 50 42 86 M50 30 Q62 50 58 86 w=3'],
    ['corn', 'corn', 'food veg yellow', 'e 50 44 16 36 Y|p - M38 30 L62 30 M35 44 L65 44 M37 58 L63 58 M44 12 L44 76 M56 12 L56 76 s=#c9a100 w=2.5|p G M30 96 Q16 60 32 32 Q40 64 50 92 Z|p G M70 96 Q84 60 68 32 Q60 64 50 92 Z'],
    ['mushroom', 'mushroom', 'food veg', 'r 38 46 24 44 C 10|p R M8 54 Q10 10 50 10 Q90 10 92 54 Z|c 32 30 6 W|c 56 22 5 W|c 72 40 6 W|c 44 44 4 W'],
    ['broccoli', 'broccoli', 'food veg green', 'p #8be07a M40 94 L44 58 L56 58 L60 94 Z|c 30 46 16 D|c 70 46 16 D|c 50 30 18 D|c 50 54 14 D'],

    /* food */
    ['bread', 'bread', 'food breakfast', 'p #e0a458 M12 50 Q12 20 50 20 Q88 20 88 50 L84 88 L16 88 Z|p - M32 34 L38 46 M48 30 L54 42 M64 34 L70 46 s=N w=3'],
    ['cheese', 'cheese', 'food breakfast yellow', 'p Y M8 64 L90 40 L90 82 L8 88 Z|p #ffc400 M8 64 L58 28 L90 40 Z|c 30 76 5 #d9a800|e 60 64 7 5 #d9a800|c 80 70 4 #d9a800'],
    ['egg', 'egg', 'food breakfast', 'p W M18 50 Q10 24 40 22 Q62 10 82 30 Q98 50 82 72 Q62 92 38 82 Q10 76 18 50 Z|c 50 52 15 #ffc400|c 45 47 4 W*'],
    ['pizza', 'pizza', 'food hot', 'g #ffd24d 16,22 84,22 50,94|r 10 12 80 16 #d88c3a 8|c 40 38 7 R|c 62 38 7 R|c 50 60 6 R|c 50 80 3 G*|c 36 48 2.5 G*'],
    ['cake', 'cake', 'food', 'l 10 92 90 92 w=5|r 18 50 64 40 Q 4|p W M18 62 Q26 72 34 62 Q42 72 50 62 Q58 72 66 62 Q74 72 82 62 L82 52 L18 52 Z|r 46 24 8 26 B 2|p X M50 6 Q58 16 50 22 Q42 16 50 6 Z'],
    ['ice cream', 'ice cream', 'food cold', 'c 38 42 16 Q|c 62 42 16 H|c 50 26 16 N|g F 30,50 70,50 50,96|p - M38 58 L56 82 M47 54 L62 70 M62 58 L44 82 s=N w=2.5'],
    ['sandwich', 'sandwich', 'food', 'r 8 68 84 20 #fbe6bf 6 s=N w=5|r 10 60 80 8 R 3|p G M6 58 Q14 48 22 58 Q30 48 38 58 Q46 48 54 58 Q62 48 70 58 Q78 48 94 58 L94 62 L6 62 Z|g Y 12,50 88,50 80,60 20,60|r 8 22 84 26 #fbe6bf 6 s=N w=5'],
    ['burger', 'burger', 'food hot', 'r 10 72 80 16 #e8a54b 8|r 12 58 76 14 M 7|g Y 14,56 86,56 78,64 22,64|p G M8 56 Q16 46 24 56 Q32 46 40 56 Q48 46 56 56 Q64 46 72 56 Q80 46 92 56 Z|p #e8a54b M10 46 Q10 14 50 14 Q90 14 90 46 Z|e 36 28 3 2 W*|e 52 24 3 2 W*|e 66 30 3 2 W*'],
    ['rice', 'rice', 'food', 'l 60 8 92 44 s=N w=5|l 70 6 96 38 s=N w=5|p W M14 52 Q20 22 50 20 Q80 22 86 52 Z|p B M8 52 L92 52 Q88 90 50 92 Q12 90 8 52 Z|e 36 38 3 2 E*|e 52 32 3 2 E*|e 64 42 3 2 E*'],
    ['soup', 'soup', 'food hot', 'p - M36 34 Q30 24 36 16 Q42 8 36 2 M54 34 Q48 24 54 16 Q60 8 54 2 s=A w=4|p O M8 48 Q10 90 50 92 Q90 90 92 48 Z|e 50 48 42 10 X|c 40 48 3 G*|c 60 46 3 G*'],
    ['chocolate', 'chocolate', 'food', 'r 22 8 56 80 M 4|l 22 28 78 28 s=#3d2310 w=3|l 22 48 78 48 s=#3d2310 w=3|l 50 8 50 60 s=#3d2310 w=3|r 18 58 64 36 R 3|r 18 70 64 10 Y*'],
    ['cookie', 'cookie', 'food', 'c 50 50 40 #d9a760|c 36 38 5 M*|c 58 32 4 M*|c 66 58 6 M*|c 40 64 5 M*|c 52 48 3 M*|c 28 54 3 M*'],
    ['noodles', 'noodles', 'food hot', 'l 60 6 88 46 s=N w=5|l 70 4 94 40 s=N w=5|p R M8 48 L92 48 Q88 90 50 92 Q12 90 8 48 Z|e 50 48 42 9 Y|p - M20 48 Q26 40 32 48 Q38 56 44 48 Q50 40 56 48 Q62 56 68 48 Q74 40 80 48 s=#d9b000 w=3'],
    ['hot dog', 'hot dog', 'food hot', 'r 6 42 88 18 #c4452c 9|p #e8a54b M8 54 Q8 78 30 80 L70 80 Q92 78 92 54 Z|p - M16 50 Q24 42 32 50 Q40 58 48 50 Q56 42 64 50 Q72 58 84 50 s=Y w=4'],
    ['jam', 'jam', 'food breakfast', 'r 22 30 56 62 R 8|r 18 16 64 16 E 4|r 30 50 40 26 W 3|c 50 63 7 R'],
    ['yogurt', 'yogurt', 'food breakfast', 'p W M22 30 L78 30 L70 92 L30 92 Z|r 18 20 64 12 P 3|r 26 52 48 20 Q|c 42 62 4 P*|c 58 62 4 P*'],
    ['sweets', 'sweets', 'food', 'g P 28,50 10,36 10,64|g P 72,50 90,36 90,64|e 50 50 24 18 P|p - M40 36 Q34 50 40 64 M52 33 Q46 50 52 67 M63 36 Q57 50 63 64 s=W w=4'],

    /* drinks */
    ['water', 'water', 'drink cold', 'p W M24 10 L76 10 L70 92 L30 92 Z|p U* M27 34 L73 34 L70.5 90 L29.5 90 Z|p - M24 10 L76 10 L70 92 L30 92 Z|c 42 60 3 W*|c 56 72 2.5 W*|c 48 80 2 W*'],
    ['milk', 'milk', 'drink breakfast', 'p W M28 94 L28 32 L40 12 L60 12 L72 32 L72 94 Z|l 28 32 72 32|r 36 44 28 34 U 3|p W* M42 64 Q50 50 58 64 Q58 70 50 70 Q42 70 42 64 Z'],
    ['juice', 'juice', 'drink breakfast', 'p - M60 26 L64 6 L78 6 w=4|r 22 26 52 68 X 4|c 48 60 14 W|c 48 60 9 X*|e 58 46 6 3 G 20'],
    ['tea', 'tea', 'drink hot breakfast', 'p - M40 30 Q34 20 40 10 M56 30 Q50 20 56 10 s=A w=4|e 46 88 38 6 W|p - M72 48 Q90 48 86 62 Q82 72 70 70 w=5|p W M18 40 L74 40 Q74 82 46 84 Q18 82 18 40 Z|p - M40 40 L36 62 w=2|r 30 60 12 12 Y 1'],
    ['coffee', 'coffee', 'drink hot', 'p - M36 26 Q30 16 36 6 M52 26 Q46 16 52 6 s=A w=4|p - M72 44 Q90 44 88 60 Q86 74 70 72 w=6|r 18 30 56 60 B 8|e 46 32 27 6 M'],
    ['cola', 'cola', 'drink cold red', 'r 28 12 44 78 R 8|r 28 12 44 9 E 4|p W* M30 52 Q50 40 70 56 L70 64 Q50 50 30 60 Z|r 28 82 44 8 E 4'],

    /* people and family */
    ['mother', 'mother', 'family person', person({ style: 'long', hair: 'M', body: 'P' })],
    ['father', 'father', 'family person', person({ style: 'short', hair: 'K', body: 'B' })],
    ['baby', 'baby', 'family person small', function () {
      return draw('p H M26 100 Q26 74 50 72 Q74 74 74 100 Z|c 50 46 26 S|p - M50 20 Q58 12 50 8 w=3|c 41 46 3 K*|c 59 46 3 K*|c 50 58 6 P|c 50 58 2.5 W*|c 34 54 4 Q*|c 66 54 4 Q*');
    }],
    ['grandmother', 'grandmother', 'family person', person({ style: 'bun', hair: 'E', body: 'V', glasses: true })],
    ['grandfather', 'grandfather', 'family person', person({ style: 'bald', hair: 'E', body: 'G', glasses: true, top: 'p E M42 51 Q50 45 58 51 Q50 55 42 51 Z', noMouth: true })],
    ['brother', 'brother', 'family person', person({ style: 'spiky', hair: 'M', body: 'O', kid: true })],
    ['sister', 'sister', 'family person', person({ style: 'pig', hair: 'N', body: 'L', kid: true })],
    ['family', 'family', 'family person', function () {
      return '<g transform="translate(-4 38) scale(.62)">' + draw(personDSL({ style: 'short', hair: 'K', body: 'B' })) + '</g>' +
        '<g transform="translate(42 38) scale(.62)">' + draw(personDSL({ style: 'long', hair: 'M', body: 'P' })) + '</g>' +
        '<g transform="translate(27 56) scale(.46)">' + draw(personDSL({ style: 'pig', hair: 'N', body: 'L' })) + '</g>';
    }],
    ['king', 'king', 'person', person({ style: 'short', hair: 'N', body: 'R', bodyTop: 'r 30 63 40 9 W 4', top: 'g Y 31,26 31,6 40,15 50,2 60,15 69,6 69,26|p N M33 46 Q50 72 67 46 Q58 58 50 57 Q42 58 33 46 Z', noMouth: true })],
    ['queen', 'queen', 'person', person({ style: 'long', hair: 'X', body: 'V', bodyTop: 'r 30 63 40 9 W 4', top: 'g Y 33,24 33,6 42,14 50,2 58,14 67,6 67,24|c 50 13 2.5 R*' })],

    /* jobs */
    ['teacher', 'teacher', 'job person school', function () {
      return draw('r 2 8 70 46 D 3|p - M10 20 L32 20 M10 30 L44 30 M10 40 L26 40 s=W w=3') + grp('translate(28 18) scale(.82)', personDSL({ style: 'short', hair: 'M', body: 'X', glasses: true }));
    }],
    ['doctor', 'doctor', 'job person', person({ style: 'short', hair: 'K', body: 'W', bodyTop: 'l 50 64 50 100 w=3|p - M36 68 Q34 88 50 88 Q66 88 64 68 w=3|c 50 90 4 A' })],
    ['nurse', 'nurse', 'job person', person({ style: 'long', hair: 'M', body: 'U', top: 'p W M33 24 L67 24 L62 9 L38 9 Z|r 47.5 11 5 11 R*|r 44.5 14 11 5 R*' })],
    ['chef', 'chef', 'job person kitchen', person({ style: 'short', hair: 'M', body: 'W', bodyTop: 'c 50 76 2.5 K*|c 50 88 2.5 K*', top: 'c 38 12 10 W|c 50 8 12 W|c 62 12 10 W|r 36 14 28 12 W 2' })],
    ['farmer', 'farmer', 'job person', person({ style: 'short', hair: 'N', body: 'R', bodyTop: 'r 36 72 28 28 B 2|l 38 72 34 64 w=3|l 62 72 66 64 w=3', top: 'e 50 24 32 6 Y|p Y M34 24 Q34 6 50 6 Q66 6 66 24 Z|r 34 18 32 5 R*' })],
    ['pilot', 'pilot', 'job person sky', person({ style: 'short', hair: 'K', body: '#1d2a6b', bodyTop: 'g W 43,63 57,63 50,78|g R 48,67 52,67 53,86 50,90 47,86', top: 'p K M31 26 Q31 11 50 11 Q69 11 69 26 Z|r 28 24 44 6 K 2|c 50 18 3.5 Y*' })],
    ['police officer', 'police officer', 'job person', person({ style: 'short', hair: 'K', body: 'B', bodyTop: 'g Y ' + star(64, 78, 7, 3), top: 'p B M31 26 Q31 11 50 11 Q69 11 69 26 Z|r 28 24 44 6 K 2|c 50 18 4 Y' })],
    ['firefighter', 'firefighter', 'job person', person({ style: 'short', hair: 'M', body: 'Y', bodyTop: 'r 18 82 64 7 W*', top: 'p R M28 30 Q28 8 50 8 Q72 8 72 30 Z|r 22 27 56 6 R 3|r 44 12 12 12 Y 2' })],
    ['builder', 'builder', 'job person', person({ style: 'short', hair: 'N', body: 'O', bodyTop: 'r 22 80 56 6 Y*|l 50 64 50 100 w=3', top: 'p Y M29 30 Q29 9 50 9 Q71 9 71 30 Z|r 24 27 52 6 Y 3|l 50 9 50 27 w=3' })],
    ['singer', 'singer', 'job person music', person({ style: 'long', hair: 'V', body: 'P', top: 'l 70 92 76 62 w=5|c 78 56 8 A' })],

    /* body */
    ['eye', 'eye', 'body', 'p W M8 50 Q50 12 92 50 Q50 88 8 50 Z|c 50 50 16 B|c 50 50 8 K*|c 55 45 3 W*|l 30 27 25 18|l 50 21 50 10|l 70 27 75 18'],
    ['ear', 'ear', 'body', 'p S M40 14 Q76 8 78 42 Q78 64 60 72 Q52 78 54 88 Q44 96 36 86 Q28 70 34 56 Q22 30 40 14 Z|p - M48 28 Q64 26 64 44 Q62 54 52 56 w=3'],
    ['nose', 'nose', 'body', 'p S M44 12 L40 58 Q24 64 28 78 Q32 88 42 83 Q50 92 58 83 Q68 88 72 78 Q76 64 60 58 L56 12 Z|e 42 77 4.5 3 M*|e 58 77 4.5 3 M*'],
    ['mouth', 'mouth', 'body', 'p R M6 50 Q30 22 50 34 Q70 22 94 50 Q70 88 50 86 Q30 88 6 50 Z|p W M18 50 Q50 45 82 50 Q70 64 50 64 Q30 64 18 50 Z|l 22 50 78 50 w=3'],
    ['hand', 'hand', 'body', 'r 26 16 11 38 S 5|r 39 8 11 44 S 5|r 52 10 11 42 S 5|r 65 18 11 36 S 5|e 20 62 16 7 S -35|r 26 42 50 50 S 16'],
    ['foot', 'foot', 'body', 'p S M28 32 Q22 62 30 84 Q40 98 56 90 Q66 80 62 60 Q62 42 68 30 Q60 20 44 22 Q30 24 28 32 Z|c 34 16 8 S|c 49 12 6 S|c 60 14 5 S|c 70 19 4.5 S|c 77 27 4 S'],
    ['tooth', 'tooth', 'body', 'p W M22 20 Q36 10 50 18 Q64 10 78 20 Q90 36 80 60 L74 88 Q70 94 64 88 L56 66 Q50 60 44 66 L36 88 Q30 94 26 88 L20 60 Q10 36 22 20 Z|e 34 30 5 7 U* -20'],
    ['face', 'face', 'body', 'c 50 50 40 Y|c 36 42 5 K*|c 64 42 5 K*|p - M30 60 Q50 80 70 60 w=5'],
    ['arm', 'arm', 'body', 'p S M10 90 L10 64 Q10 48 30 46 L50 44 L50 22 Q50 8 64 8 Q78 8 78 22 L78 54 Q78 72 58 72 L36 72 L34 90 Z|p - M26 46 Q38 30 50 38 w=3'],
    ['leg', 'leg', 'body', 'p S M36 4 L58 4 L58 72 L36 72 Z|p R M34 70 L60 70 L60 74 Q88 76 92 88 L92 96 L34 96 Z|r 34 90 58 6 W*'],

    /* clothes */
    ['T-shirt', 'T-shirt', 'clothes', 'p B M30 12 L12 20 L4 42 L22 48 L24 92 L76 92 L78 48 L96 42 L88 20 L70 12 Q60 26 50 26 Q40 26 30 12 Z'],
    ['dress', 'dress', 'clothes', 'l 40 10 40 30|l 60 10 60 30|p P M38 28 L62 28 L64 42 L88 92 L12 92 L36 42 Z|l 37 42 63 42|c 50 64 3 W*|c 40 78 3 W*|c 62 80 3 W*'],
    ['trousers', 'trousers', 'clothes', 'p B M24 10 L76 10 L80 94 L58 94 L50 36 L42 94 L20 94 Z|l 24 20 76 20'],
    ['shoes', 'shoes', 'clothes', 'p R M8 70 Q8 50 20 48 L40 46 Q46 32 58 34 L70 40 Q92 50 94 70 Z|r 6 70 90 12 W 5|p - M44 46 L52 56 M52 42 L60 52 w=3'],
    ['hat', 'hat', 'clothes beach', 'e 50 66 44 13 Y|p Y M28 66 Q28 24 50 24 Q72 24 72 66 Z|p R M28 54 L72 54 L72 62 L28 62 Z'],
    ['cap', 'cap', 'clothes', 'p B M64 56 Q92 54 96 68 Q80 72 62 66 Z|p B M16 64 Q16 22 50 22 Q84 22 84 64 Z|c 50 22 4 B|p - M50 26 L50 62 M32 30 Q30 44 34 62 w=3'],
    ['socks', 'socks', 'clothes', function () {
      var s = 'p W M22 8 L44 8 L44 60 Q46 70 56 72 L60 72 Q70 76 68 86 Q66 94 56 94 L34 94 Q20 92 22 78 Z|r 23 14 20 6 R*|r 23 26 20 6 R*';
      return grp('translate(28 2)', s) + grp('translate(-8 0)', s);
    }],
    ['jacket', 'jacket', 'clothes cold', 'p O M34 10 L16 16 L8 72 L20 74 L24 44 L24 94 L76 94 L76 44 L80 74 L92 72 L84 16 L66 10 L50 24 Z|l 50 24 50 94|r 30 64 12 10 X|r 58 64 12 10 X'],
    ['skirt', 'skirt', 'clothes', 'p P M30 22 L70 22 L90 86 L10 86 Z|r 28 14 44 10 P 2|l 40 26 34 84 w=3|l 50 26 50 84 w=3|l 60 26 66 84 w=3'],
    ['scarf', 'scarf', 'clothes cold', 'p R M60 44 L60 92 L78 92 L76 42 Z|p R M12 28 Q50 44 88 28 L88 44 Q50 60 12 44 Z|l 60 60 78 60 s=W w=4|l 60 74 78 74 s=W w=4|l 64 92 64 98|l 72 92 72 98'],
    ['gloves', 'gloves', 'clothes cold', 'e 22 48 8 16 B -25|p B M30 92 L30 40 Q30 14 52 14 Q74 14 72 40 L72 92 Z|r 26 78 50 14 W 3'],
    ['glasses', 'glasses', 'clothes bag', 'l 10 46 2 38 w=5|l 90 46 98 38 w=5|c 28 52 18 U|c 72 52 18 U|p - M46 50 Q50 44 54 50 w=5|c 28 52 18 - w=6|c 72 52 18 - w=6'],
    ['boots', 'boots', 'clothes cold', 'p M M30 8 L60 8 L60 62 L86 68 Q94 70 94 82 L94 88 L30 88 Z|r 28 84 68 10 K 3'],
    ['umbrella', 'umbrella', 'weather', 'l 50 10 50 4 w=5|p - M50 50 L50 84 Q50 94 42 94 Q34 94 34 86 w=5|p P M8 50 Q10 12 50 10 Q90 12 92 50 Q82 42 71 50 Q60 42 50 50 Q40 42 29 50 Q18 42 8 50 Z'],

    /* colours */
    ['c-red', 'red', 'colour red', splash('R')],
    ['c-blue', 'blue', 'colour', splash('B')],
    ['c-green', 'green', 'colour green', splash('G')],
    ['c-yellow', 'yellow', 'colour yellow', splash('Y')],
    ['c-orange', 'orange', 'colour', splash('X')],
    ['c-purple', 'purple', 'colour', splash('V')],
    ['c-pink', 'pink', 'colour', splash('P')],
    ['c-black', 'black', 'colour', splash('K')],
    ['c-white', 'white', 'colour', splash('W')],
    ['c-brown', 'brown', 'colour', splash('N')],
    ['c-grey', 'grey', 'colour', splash('A')],

    /* weather and sky */
    ['sun', 'sun', 'weather sky hot yellow beach', 'p - M50 4 L50 18 M50 82 L50 96 M4 50 L18 50 M82 50 L96 50 M17 17 L27 27 M73 73 L83 83 M17 83 L27 73 M73 27 L83 17 s=X w=7|c 50 50 24 Y'],
    ['cloud', 'cloud', 'weather sky', 'p W ' + CLOUD],
    ['rain', 'rain', 'weather', 'p A M22 60 Q6 60 8 44 Q10 30 26 32 Q28 10 50 12 Q66 2 76 20 Q94 20 92 40 Q92 60 74 60 Z|p U M28 70 Q22 82 28 88 Q34 82 28 70 Z|p U M50 72 Q44 84 50 90 Q56 84 50 72 Z|p U M72 70 Q66 82 72 88 Q78 82 72 70 Z'],
    ['snow', 'snow', 'weather cold', 'p - M50 8 L50 92 M14 29 L86 71 M14 71 L86 29 M40 12 L50 22 L60 12 M40 88 L50 78 L60 88 s=U w=7|c 50 50 7 W'],
    ['wind', 'wind', 'weather', 'p - M8 34 L60 34 Q76 34 76 22 Q76 10 64 12 M8 52 L78 52 Q94 52 92 66 Q90 80 76 76 M8 70 L46 70 s=B w=7'],
    ['storm', 'storm', 'weather', 'p Z M22 60 Q6 60 8 44 Q10 30 26 32 Q28 10 50 12 Q66 2 76 20 Q94 20 92 40 Q92 60 74 60 Z|g Y 52,46 36,72 48,72 40,96 68,62 56,62 64,46'],
    ['rainbow', 'rainbow', 'weather sky', 'p - M8 82 A42 42 0 0 1 92 82 s=R w=9|p - M17 82 A33 33 0 0 1 83 82 s=X w=9|p - M26 82 A24 24 0 0 1 74 82 s=Y w=9|p - M35 82 A15 15 0 0 1 65 82 s=B w=9|e 14 84 12 8 W|e 86 84 12 8 W'],
    ['moon', 'moon', 'sky', 'p Y M62 8 Q18 14 18 50 Q18 86 62 92 Q34 76 34 50 Q34 24 62 8 Z|c 28 44 3 #e6cf00*|c 26 62 4 #e6cf00*'],
    ['star', 'star', 'sky yellow', 'g Y ' + star(50, 53, 44, 19)],
    ['snowman', 'snowman', 'cold', 'c 50 70 24 W|c 50 36 16 W|r 32 20 36 5 K 2|r 38 4 24 18 K 2|g X 50,36 66,40 50,42|c 44 32 2.5 K*|c 56 32 2.5 K*|c 50 62 3 K*|c 50 74 3 K*|l 28 58 10 48 s=N|l 72 58 90 48 s=N'],

    /* transport */
    ['car', 'car', 'transport wheels red', 'p R M6 66 L6 48 Q8 42 18 42 L28 26 Q30 22 36 22 L64 22 Q70 22 74 28 L82 42 Q94 42 94 54 L94 66 Z|p U M32 42 L37 28 L49 28 L49 42 Z|p U M55 42 L55 28 L65 28 L72 42 Z|c 26 68 10 K|c 26 68 4 A*|c 74 68 10 K|c 74 68 4 A*'],
    ['bus', 'bus', 'transport wheels big yellow', 'r 6 18 88 56 Y 8|r 12 26 16 18 U 2|r 32 26 16 18 U 2|r 52 26 16 18 U 2|r 72 26 16 30 U 2|r 6 52 66 6 O*|c 26 76 9 K|c 72 76 9 K|c 26 76 3.5 A*|c 72 76 3.5 A*'],
    ['bike', 'bike', 'transport wheels sport', 'c 22 66 17 - w=5|c 78 66 17 - w=5|p - M22 66 L40 40 L66 40 L78 66 M40 40 L50 66 L66 40 M50 66 L22 66 s=B w=5|p - M66 40 L62 24 L72 22 w=5|p - M40 40 L38 30 M32 30 L46 30 w=5'],
    ['train', 'train', 'transport big', 'r 16 18 12 22 K 2|r 6 38 52 36 G 6|r 54 18 38 56 R 4|r 62 26 22 16 U 2|r 2 62 8 12 K 2|c 20 80 9 K|c 42 80 9 K|c 74 80 11 K'],
    ['plane', 'plane', 'transport sky big', 'g B 44,48 64,48 50,18 42,18|g B 10,46 24,46 14,26 6,26|p W M4 52 Q8 42 24 42 L82 42 Q96 42 96 52 Q96 62 82 62 L24 62 Q8 62 4 52 Z|g B 42,56 62,56 46,88 36,88|c 34 50 3 U*|c 46 50 3 U*|c 58 50 3 U*|c 70 50 3 U*|p U M84 44 Q92 46 94 50 L84 50 Z'],
    ['boat', 'boat', 'transport sea beach', 'l 50 8 50 62 w=4|g W 53,10 53,56 86,56|g Y 47,20 47,56 20,56|p N M6 62 L94 62 L80 84 L20 84 Z|p - M2 92 Q12 86 22 92 Q32 98 42 92 Q52 86 62 92 Q72 98 82 92 Q92 86 98 92 s=B w=4'],
    ['taxi', 'taxi', 'transport wheels yellow', 'r 38 12 24 10 K 2|p Y M6 66 L6 48 Q8 42 18 42 L28 26 Q30 22 36 22 L64 22 Q70 22 74 28 L82 42 Q94 42 94 54 L94 66 Z|p U M32 42 L37 28 L49 28 L49 42 Z|p U M55 42 L55 28 L65 28 L72 42 Z|r 8 50 84 6 K*|c 26 68 10 K|c 26 68 4 A*|c 74 68 10 K|c 74 68 4 A*'],
    ['truck', 'truck', 'transport wheels big', 'r 4 16 58 58 O 3|p B M60 32 L80 32 L94 52 L94 74 L60 74 Z|p U M66 38 L78 38 L88 52 L66 52 Z|c 22 76 10 K|c 22 76 4 A*|c 76 76 10 K|c 76 76 4 A*'],
    ['motorbike', 'motorbike', 'transport wheels', 'c 20 70 15 K|c 80 70 15 K|c 20 70 6 A*|c 80 70 6 A*|l 74 34 80 70 w=5|p R M22 64 L34 50 L66 50 L74 62 Z|p R M34 52 Q36 40 52 40 L66 40 Q72 40 72 48 L66 52 Z|p K M36 42 Q44 32 58 38 L58 42 Z|p - M70 40 L76 28 L86 26 w=5'],
    ['helicopter', 'helicopter', 'transport sky', 'l 8 22 92 22 w=5|l 46 22 46 36 w=5|r 0 48 24 8 R 3|c 6 46 7 - w=3|e 48 56 30 20 R|p U M48 42 Q70 40 74 56 L48 56 Z|l 26 86 72 86 w=5|l 34 74 34 86|l 62 74 62 86'],
    ['rocket', 'rocket', 'transport sky', 'g R 30,52 12,78 30,72|g R 70,52 88,78 70,72|p O M38 72 L62 72 L50 97 Z|p Y* M44 72 L56 72 L50 88 Z|p W M50 4 Q72 24 70 72 L30 72 Q28 24 50 4 Z|p R M50 4 Q61 12 65 24 L35 24 Q39 12 50 4 Z|c 50 42 9 U'],
    ['van', 'van', 'transport wheels', 'p W M6 72 L6 30 Q6 20 16 20 L66 20 Q74 20 80 30 L92 46 Q94 50 94 56 L94 72 Z|p U M68 28 L76 30 L86 46 L68 46 Z|r 14 28 20 16 U 2|r 40 28 20 16 U 2|r 6 52 88 6 B*|c 26 74 9 K|c 74 74 9 K|c 26 74 3.5 A*|c 74 74 3.5 A*'],

    /* home */
    ['house', 'house', 'home place big', 'r 64 14 12 26 N|g R 4,50 50,10 96,50|r 16 46 68 48 Y|r 42 64 16 30 N 2|r 22 56 14 14 U|r 64 56 14 14 U'],
    ['door', 'door', 'home', 'r 22 4 56 92 N 3|r 30 12 40 32 - 2 w=3|r 30 52 40 34 - 2 w=3|c 68 52 4 Y'],
    ['window', 'window', 'home bedroom', 'r 12 8 76 80 W 3|r 18 14 30 32 U|r 52 14 30 32 U|r 18 52 30 30 U|r 52 52 30 30 U|r 6 86 88 8 N 2'],
    ['bed', 'bed', 'home bedroom', 'r 8 26 16 62 N 3|r 10 70 6 20 N|r 86 70 6 20 N|r 8 52 86 20 W 3|e 32 48 11 7 W|r 44 44 50 28 B 3'],
    ['chair', 'chair', 'home school', 'r 24 8 52 42 N 4|l 38 16 38 42 w=3|l 50 16 50 42 w=3|l 62 16 62 42 w=3|r 24 60 7 34 N 2|r 69 60 7 34 N 2|r 18 50 64 12 N 3'],
    ['table', 'table', 'home kitchen', 'r 14 44 9 48 N 2|r 77 44 9 48 N 2|r 6 32 88 14 N 3|e 50 24 12 8 W|p - M44 24 L44 10 M56 24 L56 12 s=G w=4|c 44 10 5 P|c 56 12 5 Y'],
    ['sofa', 'sofa', 'home', 'r 18 84 6 10 K|r 76 84 6 10 K|r 14 22 72 36 P 10|r 20 54 60 24 P 4|r 6 40 18 46 P 8|r 76 40 18 46 P 8'],
    ['lamp', 'lamp', 'home bedroom', 'r 46 48 8 36 A 2|e 50 88 22 6 K|g Y 30,12 70,12 82,50 18,50'],
    ['TV', 'TV', 'home', 'l 36 88 50 74 w=5|l 64 88 50 74 w=5|l 26 90 74 90 w=5|r 8 16 84 58 K 6|r 14 22 72 46 U 2|p W* M20 60 L36 38 L48 54 L58 44 L80 64 L80 66 L20 66 Z'],
    ['fridge', 'fridge', 'home kitchen cold', 'r 22 4 56 92 W 6|l 22 36 78 36|r 30 14 5 14 A 2|r 30 46 5 20 A 2|r 30 92 8 6 K*|r 62 92 8 6 K*'],
    ['bath', 'bath', 'home', 'c 40 36 7 W|c 52 30 9 W|c 66 36 7 W|p - M18 42 L18 20 Q18 12 28 12 L34 12 w=5|p W M6 42 L94 42 L88 76 Q86 84 76 84 L24 84 Q14 84 12 76 Z|l 22 84 18 94 w=5|l 78 84 82 94 w=5'],
    ['clock', 'clock', 'home bedroom', 'c 50 50 44 B|c 50 50 35 W|p - M50 19 L50 25 M50 75 L50 81 M19 50 L25 50 M75 50 L81 50 w=4|l 50 50 50 28 w=5|l 50 50 66 58 w=5|c 50 50 4 K*'],
    ['cup', 'cup', 'home kitchen', 'p - M70 38 Q90 38 88 56 Q86 72 68 70 w=6|p P M20 24 L72 24 L68 88 L24 88 Z|r 30 44 32 18 W*'],
    ['plate', 'plate', 'home kitchen', 'e 50 56 46 30 W|e 50 56 32 19 C|e 44 52 6 3 W* -10'],
    ['spoon', 'spoon', 'home kitchen', 'r 45 38 10 56 A 5|e 50 24 16 20 A|e 45 18 4 7 W* 10'],
    ['fork', 'fork', 'home kitchen', 'p A M32 6 L32 34 Q32 48 45 50 L45 94 L55 94 L55 50 Q68 48 68 34 L68 6 L61 6 L61 32 L55 32 L55 6 L45 6 L45 32 L39 32 L39 6 Z'],
    ['knife', 'knife', 'home kitchen', 'r 40 56 18 40 K 5|p E M40 58 L40 6 Q62 10 60 58 Z'],
    ['pan', 'pan', 'home kitchen hot', 'r 66 48 32 12 K 5|c 38 54 32 K|c 38 54 23 Z*|c 38 54 10 W*|c 38 54 5 Y*'],
    ['kettle', 'kettle', 'home kitchen hot', 'p - M34 32 Q34 10 50 10 Q66 10 66 32 w=7|p A M74 60 L92 42 L95 49 L78 72 Z|p A M22 88 L27 40 Q29 30 50 30 Q71 30 73 40 L78 88 Z|c 50 28 5 K'],
    ['toothbrush', 'toothbrush', 'home', 'r 6 58 66 12 B 6|r 64 56 28 16 B 5|r 66 38 24 18 W 2|p - M72 40 L72 54 M78 40 L78 54 M84 40 L84 54 s=U w=3'],
    ['candle', 'candle', 'home hot', 'r 36 38 28 56 H 3|l 50 38 50 30 w=3|p X M50 8 Q62 22 50 32 Q38 22 50 8 Z|p Y* M50 18 Q56 24 50 30 Q44 24 50 18 Z|p H M36 44 Q40 56 44 44 Z'],

    /* school */
    ['book', 'book', 'school bag', 'p B M4 26 L4 88 Q30 82 50 92 Q70 82 96 88 L96 26 Z|p W M50 24 Q30 12 8 18 L8 82 Q30 76 50 86 Z|p W M50 24 Q70 12 92 18 L92 82 Q70 76 50 86 Z|p - M16 34 Q30 30 42 36 M16 48 Q30 44 42 50 M58 36 Q70 30 84 34 M58 50 Q70 44 84 48 w=3'],
    ['pen', 'pen', 'school bag', 'g #e8e8e8 22,62 38,78 8,92|g B 22,62 38,78 90,26 74,10|l 70 18 50 36 s=W w=4'],
    ['pencil', 'pencil', 'school bag', 'g F 22,62 38,78 8,92|g K 12,80 20,88 8,92|g Y 22,62 38,78 80,36 64,20|g A 64,20 80,36 86,30 70,14|g P 70,14 86,30 94,22 78,6'],
    ['ruler', 'ruler', 'school bag', 'r 6 34 88 32 Y 2|p - M16 34 L16 50 M26 34 L26 44 M36 34 L36 50 M46 34 L46 44 M56 34 L56 50 M66 34 L66 44 M76 34 L76 50 M86 34 L86 44 w=3'],
    ['bag', 'bag', 'school', 'p - M34 22 Q34 4 50 4 Q66 4 66 22 w=6|r 16 22 68 72 R 14|r 28 58 44 26 R 6|p R M16 40 Q16 22 34 22 L66 22 Q84 22 84 40 L84 46 L16 46 Z|r 46 42 8 10 Y 2'],
    ['computer', 'computer', 'school home', 'r 16 12 68 50 K 4|r 22 18 56 38 U 2|p A M6 68 L94 68 L90 82 L10 82 Z|l 16 62 84 62 w=4|r 40 72 20 4 Z*'],
    ['scissors', 'scissors', 'school', 'p E M40 56 L90 12 L94 18 L50 64 Z|p E M40 44 L90 88 L94 82 L50 36 Z|c 24 34 13 R|c 24 66 13 R|c 24 34 6 W*|c 24 66 6 W*|c 46 50 3 K*'],
    ['eraser', 'eraser', 'school bag small', 'r 16 32 68 36 P 6|r 16 32 26 36 B 6'],
    ['desk', 'desk', 'school', 'r 12 46 10 46 N|r 78 46 10 46 N|r 56 46 22 26 #d9a760 2|r 64 56 6 4 K*|r 6 36 88 12 N 3|r 20 24 30 12 B 2'],

    /* places */
    ['school', 'school', 'place school big', 'l 50 16 50 2 w=3|g B 51,2 68,6 51,11|g D 6,42 50,16 94,42|r 14 40 72 54 R|c 50 32 6 W|r 42 66 16 28 N 2|r 20 50 14 12 U|r 66 50 14 12 U|r 20 72 14 12 U|r 66 72 14 12 U'],
    ['hospital', 'hospital', 'place big', 'r 16 18 68 76 W 2|r 44 26 12 30 R*|r 35 35 30 12 R*|r 22 62 12 10 U|r 66 62 12 10 U|r 42 72 16 22 U 2'],
    ['shop', 'shop', 'place', 'r 20 8 60 18 B 3|r 12 42 76 52 Y|p R M6 28 L94 28 L94 44 L6 44 Z|r 24 28 12 16 W*|r 48 28 12 16 W*|r 72 28 12 16 W*|p - M6 28 L94 28 L94 44 L6 44 Z|r 18 52 36 26 U|r 60 56 20 38 N'],
    ['park', 'park', 'place park green', 'p G M2 78 Q50 64 98 78 L98 98 L2 98 Z|r 22 44 8 30 N|c 26 34 18 G|r 46 56 44 6 N|r 46 66 44 6 N|l 50 72 50 84 w=4|l 86 72 86 84 w=4'],
    ['beach', 'beach', 'place beach hot', 'c 78 22 12 Y|p B M2 60 Q30 54 50 60 Q70 66 98 60 L98 76 L2 76 Z|p #ffd98a M2 72 Q50 62 98 72 L98 98 L2 98 Z|l 30 42 30 84 w=4|p R M10 46 Q30 18 50 46 Z'],
    ['mountain', 'mountain', 'place big cold', 'g Z 40,90 66,36 96,90|g A 4,90 38,20 72,90|g W 38,20 29,38 38,33 46,38'],
    ['farm', 'farm', 'place', 'g R 12,44 50,12 88,44|r 18 42 64 52 R|r 36 60 28 34 W|l 36 60 64 94 w=3|l 64 60 36 94 w=3|r 42 26 16 12 W 1'],
    ['city', 'city', 'place big', 'r 4 40 24 56 B|r 26 18 26 78 A|r 50 32 22 64 T|r 70 10 26 86 V|p - M12 50 L20 50 M12 64 L20 64 M12 78 L20 78 M34 30 L44 30 M34 46 L44 46 M34 62 L44 62 M34 78 L44 78 M56 44 L66 44 M56 60 L66 60 M56 76 L66 76 M78 22 L88 22 M78 38 L88 38 M78 54 L88 54 M78 70 L88 70 s=Y w=5'],
    ['island', 'island', 'place beach sea', 'p U M2 80 Q50 66 98 80 L98 98 L2 98 Z|p #ffd98a M18 80 Q50 56 82 80 Z|p - M52 72 Q48 42 58 24 s=N w=7|p G M58 24 Q40 10 24 24 Q42 20 58 24 Z|p G M58 24 Q76 8 90 24 Q72 20 58 24 Z|p G M58 24 Q66 40 78 46 Q64 32 58 24 Z|p G M58 24 Q48 40 36 44 Q52 32 58 24 Z'],
    ['igloo', 'igloo', 'place cold', 'p W M6 88 Q6 20 50 18 Q94 20 94 88 Z|p - M12 68 L88 68 M8 48 L92 48 M22 30 L78 30 M30 18 L30 30 M70 18 L70 30 M20 48 L20 68 M50 30 L50 48 M80 48 L80 68 s=U w=3|p K M38 88 L38 72 Q38 60 50 60 Q62 60 62 72 L62 88 Z'],

    /* sports */
    ['football', 'football', 'sport toy', function () {
      return draw('c 50 50 42 W|g K* ' + poly(50, 50, 13, 5) + '|p - M50 37 L50 10 M62 46 L88 38 M58 61 L74 84 M42 61 L26 84 M38 46 L12 38 w=3|g K* ' + poly(50, 13, 7, 5, 90) + '|g K* ' + poly(85, 38, 7, 5, 162) + '|g K* ' + poly(15, 38, 7, 5, 18));
    }],
    ['basketball', 'basketball', 'sport', 'c 50 50 42 #ff8a1f|l 8 50 92 50 w=3|l 50 8 50 92 w=3|p - M22 20 Q40 50 22 80 M78 20 Q60 50 78 80 w=3'],
    ['tennis', 'tennis', 'sport', 'l 52 64 80 94 s=K w=10|e 38 36 26 32 W -35|p - M20 30 L54 58 M26 18 L62 48 M18 44 L44 64 M44 10 L20 50 M56 18 L30 60 M64 32 L42 64 s=A w=2|e 38 36 26 32 - -35|c 80 26 12 L|p - M70 20 Q80 28 90 20 w=2'],
    ['volleyball', 'volleyball', 'sport beach', 'c 50 50 42 W|p B* M50 8 Q70 10 84 26 Q64 34 50 50 Q52 30 50 8 Z|p Y* M16 72 Q10 52 18 34 Q34 48 50 50 Q30 58 16 72 Z|c 50 50 42 -|p - M50 8 Q52 30 50 50 Q64 34 84 26 M50 50 Q30 58 16 72 M50 50 Q60 70 82 76 w=3'],
    ['boxing', 'boxing', 'sport', 'p R M24 50 Q8 50 10 64 Q12 78 28 74|p R M24 90 L24 44 Q24 12 52 12 Q84 12 84 46 Q84 72 66 76 L66 90 Z|p - M24 54 Q36 60 44 48 w=3|r 22 78 48 18 W 3'],
    ['swimming', 'swimming', 'sport beach', 'c 34 52 11 S|p R M23 52 Q23 40 34 40 Q45 40 45 52 Z|p S M44 60 Q52 26 82 28 L86 36 Q60 36 56 62 Z|p B M2 60 Q14 50 26 60 Q38 70 50 60 Q62 50 74 60 Q86 70 98 60 L98 96 L2 96 Z'],
    ['golf', 'golf', 'sport', 'e 50 84 44 10 G|l 58 84 58 10 w=4|g R 60,10 88,20 60,30|c 30 80 5 W'],

    /* things, toys, music, nature */
    ['key', 'key', 'bag small', 'r 74 55 8 14 Y|r 84 55 8 10 Y|r 40 45 54 12 Y 2|c 26 51 18 Y|c 26 51 7 C'],
    ['phone', 'phone', 'bag', 'r 28 6 44 88 K 8|r 33 14 34 64 U 2|c 50 86 4 A*'],
    ['ball', 'ball', 'toy sport beach red', 'c 50 50 42 R|p - M10 44 Q50 62 90 44 s=W w=8|p - M50 8 Q34 50 50 92 s=Y w=8|c 50 50 42 -|e 34 28 8 5 W* -30'],
    ['box', 'box', 'home', 'g #e0a458 10,32 50,18 90,32 50,46|g #d9a760 10,32 50,46 50,92 10,78|g #b57d3e 50,46 90,32 90,78 50,92|l 30 25 70 39 s=Y w=6'],
    ['bottle', 'bottle', 'bag drink', 'r 38 2 24 12 B 2|p U M40 12 L60 12 L60 24 Q76 32 76 48 L76 88 Q76 96 68 96 L32 96 Q24 96 24 88 L24 48 Q24 32 40 24 Z|r 24 54 52 22 W'],
    ['watch', 'watch', 'bag small', 'r 36 2 28 96 N 6|c 50 50 26 W|l 50 50 50 34 w=4|l 50 50 62 56 w=4|c 50 50 3 K*'],
    ['camera', 'camera', 'bag', 'r 30 16 22 14 K 3|r 8 26 84 60 K 8|c 50 56 21 A|c 50 56 13 B|c 45 51 4 W*|r 72 34 12 8 W 2'],
    ['money', 'money', 'bag', 'r 4 20 70 40 G 4|c 39 40 11 #b6f2a0|r 22 38 70 40 G 4|c 57 58 11 #b6f2a0|c 78 76 16 Y|c 78 76 9 - w=3'],
    ['kite', 'kite', 'toy sky', 'p - M50 86 Q40 92 50 96 Q62 99 70 94 w=3|g P 50,4 84,40 50,86 16,40|l 50 4 50 86 w=3|l 16 40 84 40 w=3|g Y 50,4 84,40 50,40|g Y 50,40 16,40 50,86'],
    ['balloon', 'balloon', 'toy sky', 'p - M50 76 Q40 86 52 96 w=3|g R 45,78 55,78 50,72|e 50 40 30 34 R|e 38 28 6 10 W* 30'],
    ['present', 'present', 'toy', 'r 12 40 76 54 P 3|r 44 40 12 54 Y|r 8 28 84 16 P 3|r 44 28 12 16 Y|e 38 20 12 8 Y -20|e 62 20 12 8 Y 20'],
    ['guitar', 'guitar', 'music', 'r 45 2 10 40 N 2|p X ' + GUITAR + '|c 50 64 8 K*|r 40 80 20 6 M 2|p - M47 4 L47 82 M53 4 L53 82 s=W w=1.5'],
    ['piano', 'piano', 'music big', function () {
      var s = 'r 4 22 92 60 W 3', w = 92 / 7;
      for (var i = 1; i < 7; i++) s += '|l ' + (4 + i * w).toFixed(1) + ' 22 ' + (4 + i * w).toFixed(1) + ' 82 w=3';
      [1, 2, 4, 5, 6].forEach(function (i) { s += '|r ' + (4 + i * w - 4.5).toFixed(1) + ' 22 9 34 K* 1'; });
      return draw(s);
    }],
    ['drum', 'drum', 'music toy', 'p R M12 30 L12 74 Q50 92 88 74 L88 30 Z|p - M12 40 L25 72 L38 44 L50 78 L62 44 L75 72 L88 40 s=Y w=4|e 50 30 38 12 W|l 26 4 44 26 s=N w=5|l 74 4 56 26 s=N w=5|c 26 4 4 W|c 74 4 4 W'],
    ['violin', 'violin', 'music', 'l 86 6 20 72 s=N w=3|r 45 2 10 30 M 2|p N M50 26 Q64 26 64 38 Q64 46 58 50 Q72 56 70 72 Q68 92 50 92 Q32 92 30 72 Q28 56 42 50 Q36 46 36 38 Q36 26 50 26 Z|p - M42 56 Q40 64 44 70 M58 56 Q60 64 56 70 w=3|r 44 76 12 4 K*'],
    ['xylophone', 'xylophone', 'music toy', function () {
      var cs = ['R', 'X', 'Y', 'G', 'B', 'V'], s = 'l 6 30 94 42 w=4|l 6 84 94 72 w=4';
      cs.forEach(function (c, i) { var h = 64 - i * 6, x = 8 + i * 14.5; s += '|r ' + x + ' ' + (22 + i * 3) + ' 11 ' + h + ' ' + c + ' 2'; });
      return draw(s + '|l 60 4 80 22 s=N w=4|c 58 3 5 W');
    }],
    ['yo-yo', 'yo-yo', 'toy', 'l 50 58 50 2 w=3|c 50 60 32 R|c 50 60 12 Y|c 50 60 32 -'],
    ['teddy bear', 'teddy bear', 'toy bedroom', 'c 28 18 10 N|c 72 18 10 N|c 16 66 10 N|c 84 66 10 N|c 32 90 10 N|c 68 90 10 N|e 50 70 26 26 N|e 50 72 14 14 F|c 50 34 22 N|e 50 42 9 7 F|e 50 39 4 3 K*|c 42 30 3 K*|c 58 30 3 K*'],
    ['robot', 'robot', 'toy', 'l 50 14 50 5 w=4|c 50 5 4 R|r 6 58 12 26 A 4|r 82 58 12 26 A 4|r 26 14 48 36 A 6|c 40 32 6 Y|c 60 32 6 Y|r 38 41 24 5 K*|r 20 54 60 40 B 6|c 50 72 7 R'],
    ['microphone', 'microphone', 'music', 'r 42 44 16 50 K 6|c 50 28 20 A|p - M36 20 L64 20 M32 30 L68 30 M36 40 L64 40 s=Z w=2.5'],
    ['heart', 'heart', 'red', 'p R M50 88 Q10 62 10 34 Q10 12 30 12 Q44 12 50 28 Q56 12 70 12 Q90 12 90 34 Q90 62 50 88 Z|e 28 32 5 8 W* 30'],
    ['tree', 'tree', 'park green big', 'r 42 56 16 38 N 2|c 30 50 17 G|c 70 50 17 G|c 50 34 26 G|c 50 54 18 G*'],
    ['flower', 'flower', 'park', 'l 50 56 50 94 s=G w=6|e 62 80 10 5 G -30|c 50 24 12 P|c 67 37 12 P|c 60 57 12 P|c 40 57 12 P|c 33 37 12 P|c 50 42 10 Y'],
    ['leaf', 'leaf', 'park green', 'p G M14 88 Q12 18 88 12 Q88 86 14 88 Z|p - M14 88 L70 30 w=3|p - M36 66 L36 44 M50 52 L50 34 M36 66 L58 66 M50 52 L66 52 w=2'],
    ['fire', 'fire', 'hot', 'l 24 92 76 80 s=M w=8|l 24 80 76 92 s=M w=8|p O M50 4 Q72 28 72 46 Q80 38 80 28 Q96 54 84 76 Q72 92 50 92 Q28 92 16 76 Q6 54 22 36 Q24 48 32 52 Q28 28 50 4 Z|p Y* M50 48 Q64 64 62 78 Q58 88 50 88 Q40 88 38 78 Q36 64 50 48 Z']
  ];

  /* ---------- grammar: article and plural for every picture name ----------
     art: "a" / "an" / "the" / "" (no article: uncountable, plural, colours, sports)
     pl : plural form ("" when it has none). Used by sentence frames and example labels. */
  var NO_ART = 'grapes bread cheese rice soup chocolate noodles jam yogurt sweets water milk juice tea coffee cola trousers shoes socks gloves glasses boots money rain snow wind fire football basketball tennis volleyball boxing swimming golf corn broccoli scissors';
  var THE = { sun: 1, moon: 1 };
  var PLURAL = { mouse: 'mice', sheep: 'sheep', fish: 'fish', knife: 'knives', leaf: 'leaves', foot: 'feet', tooth: 'teeth', tomato: 'tomatoes', potato: 'potatoes', octopus: 'octopuses', scarf: 'scarves', snowman: 'snowmen' };
  function article(o) {
    if (o.colour) return '';
    if (NO_ART.split(' ').indexOf(o.name) >= 0) return '';
    if (THE[o.name]) return 'the';
    return /^[aeiou]/i.test(o.name) ? 'an' : 'a';
  }
  function plural(o) {
    if (!o.art || o.art === 'the') return '';
    var n = o.name, w = n.split(' '), last = w.pop();
    var p = PLURAL[last] || (/(s|sh|ch|x)$/.test(last) ? last + 'es' : /[^aeiou]y$/.test(last) ? last.slice(0, -1) + 'ies' : last + 's');
    return w.concat([p]).join(' ');
  }

  WU.PICS = {};
  WU.PIC_LIST = [];
  PICS.forEach(function (p) {
    var o = { id: p[0], name: p[1], tags: p[2].split(' '), d: p[3] };
    o.colour = o.tags.indexOf('colour') >= 0;
    o.art = article(o); o.pl = plural(o);
    WU.PICS[o.id] = o; WU.PIC_LIST.push(o);
  });

  var cache = {};
  // Returns markup for a picture id. Ids starting "u:" are the teacher's uploaded images (see js/edit.js).
  WU.pic = function (id, cls) {
    if (!id) return '';
    if (String(id).indexOf('u:') === 0) {
      var src = WU.images && WU.images.get(id);
      return src ? '<img class="pic up ' + (cls || '') + '" src="' + src + '" alt="">' : '';
    }
    var o = WU.PICS[id] || WU.PIC_LIST.filter(function (x) { return x.name === id; })[0];
    if (!o) return '';
    if (!cache[o.id]) cache[o.id] = typeof o.d === 'function' ? o.d() : draw(o.d);
    return '<svg class="pic ' + (cls || '') + '" viewBox="0 0 100 100" role="img" aria-label="' + o.name + '">' +
      '<g stroke-linejoin="round" stroke-linecap="round">' + cache[o.id] + '</g></svg>';
  };
  WU.picsByTag = function (tag) { return WU.PIC_LIST.filter(function (p) { return p.tags.indexOf(tag) >= 0; }); };
  WU.picName = function (id) { return WU.PICS[id] ? WU.PICS[id].name : ''; };
  // English plural guess for words the teacher types (the library stores its own plurals).
  WU.guessPlural = function (w) {
    var parts = String(w || '').split(' '), last = parts.pop();
    if (!last) return '';
    var p = PLURAL[last] || (/(s|sh|ch|x|z)$/.test(last) ? last + 'es' : /[^aeiou]y$/.test(last) ? last.slice(0, -1) + 'ies' : last + 's');
    return parts.concat([p]).join(' ');
  };
  // An example card: { w: word, art: "a" | "an" | "the" | "", pl: plural (optional), pic: picture id }.
  // Old edits stored only a picture id; turn that (or any library id) into a full card.
  WU.exampleFromPic = function (id) {
    var o = WU.PICS[id];
    return o ? { w: o.name, art: o.art, pl: o.pl && o.pl !== WU.guessPlural(o.name) ? o.pl : '', pic: id } : { w: '', art: '', pl: '', pic: id || '' };
  };
  WU.normExample = function (x) {
    if (typeof x === 'string') return WU.exampleFromPic(x);
    return { w: x.w || '', art: x.art || '', pl: x.pl || '', pic: x.pic || '' };
  };
  // The words in the shape a sentence frame needs:
  //   form "a"    -> "an apple", "rice", "the sun"   (It's ___. / I have ___. / She's ___.)
  //   form "pl"   -> "apples", "rice", "football"    (I like ___.)
  //   form "bare" -> "apple"                          (My ___. / ___!)
  WU.phrase = function (ex, form) {
    var w = ex.w || '';
    if (form === 'a') return ex.art ? ex.art + ' ' + w : w;
    if (form === 'pl') return ex.pl || (ex.art && ex.art !== 'the' ? WU.guessPlural(w) : w);
    return w;
  };
  WU.picPhrase = function (id, form) { return WU.PICS[id] ? WU.phrase(WU.exampleFromPic(id), form) : ''; };
  // Which form a frame needs, e.g. "I like ___." -> "pl", "It's ___." / "She's ___." -> "a", "My ___." -> "bare".
  WU.frameForm = function (frame) {
    var f = String(frame || '').toLowerCase().replace(/\u2019/g, "'");
    if (/\b(like|love|hate|don't like) ___/.test(f)) return 'pl';
    if (/(\b(it|this|that|he|she|there|what)'s|\b(it|this|that|he|she|there) is|\bi'm|\bi am|\byou're|\bi have|\bi've got|\bhave got|\bhas got|\bi see|\bi want|\bi need|\bi am a) ___/.test(f)) return 'a';
    return 'bare';
  };
})();
