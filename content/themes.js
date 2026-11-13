/* Warm Up: occasion themes. One occasion is live for one week; the app changes its look and, where a game has
   themed content (items with theme: '<id>'), plays that content instead of the usual one.

   when : [month, day] of the occasion.
   rule : 'before' = the 7 days ending the day before the occasion (holidays: no classes on the day itself)
          'week'   = Monday to Sunday of the week the occasion falls in
          'fixed'  = from [month, day] to [month, day] (see from / to)
   Earlier entries win if two weeks ever overlap.
   look : bg = page colour, tiles = home tile colours (in order), deco = picture ids or short texts that float on screen,
          fall = true: decorations drift down (snow, leaves), banner = the label on the home screen.
          hat = drawn on the WARM UP! logo: { svg } (viewBox 0 0 120 100) or { emoji }; x, y, w, h, rot = place and size.
          cap = ornament on cards and buttons: { svg, stretch: true, h } = a strip along the top edge (viewBox 0 0 200 30,
                e.g. snow piles), or { emoji | svg, pos: 'corner', h } = one ornament on the top-right corner (viewBox 0 0 100 100).
   words: theme words students may not know yet (shown with pictures). Themed content = taught material + these words.

   Themed content in a game: add items with theme: '<id>' to that game's lists in content/<game>.js (permanent ids as usual).
   While the theme is on, a list with 3 or more items for it plays only those; with fewer, they are added to the rest.
   When the theme is off, themed items are hidden. */
window.WU = window.WU || {};
WU.THEMES = [
  { id: 'newyear', name: 'New Year', when: [1, 1], rule: 'before',
    look: { bg: '#e7f0ff', tiles: ['#ff3b3b', '#33c24d', '#ffe600', '#3d6bff', '#ffffff', '#ff4fc3'], deco: ['snow', 'star', 'ny-tree', 'present', 'snow', 'fireworks', 'snowman', 'snow'], fall: true, banner: 'Happy New Year!', hat: { svg: '<path d="M14 80 C24 40 56 10 98 22 C104 24 106 30 100 34 C88 40 86 56 90 74 Z" fill="#e8262b" stroke="#0d0d0d" stroke-width="5" stroke-linejoin="round"/><path d="M40 40 C52 28 70 22 88 24" fill="none" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round"/><rect x="6" y="68" width="92" height="22" rx="11" fill="#fff" stroke="#0d0d0d" stroke-width="5"/><circle cx="102" cy="30" r="12" fill="#fff" stroke="#0d0d0d" stroke-width="5"/>' }, cap: { svg: '<path d="M0 20 Q8 8 20 14 Q30 4 44 12 Q56 2 70 11 Q84 0 98 10 Q112 3 124 12 Q138 1 152 11 Q166 4 178 13 Q190 6 200 18 V30 H0 Z" fill="#fff"/><path d="M0 20 Q8 8 20 14 Q30 4 44 12 Q56 2 70 11 Q84 0 98 10 Q112 3 124 12 Q138 1 152 11 Q166 4 178 13 Q190 6 200 18" fill="none" stroke="#0d0d0d" stroke-width="3" vector-effect="non-scaling-stroke"/><path d="M60 22 q2 7 4 0 M140 22 q2 8 4 0" fill="#fff" stroke="#0d0d0d" stroke-width="2" vector-effect="non-scaling-stroke"/>', stretch: true, h: 34 } },
    words: ['New Year tree', 'fireworks', 'present', 'snowman', 'midnight', 'celebrate', 'wish', 'party'] },
  { id: 'halloween', name: 'Halloween', when: [10, 31], rule: 'before',
    look: { bg: '#ffe8d1', tiles: ['#ff9a1f', '#9b5de5', '#c6ff00', '#33c24d', '#ff5a1f', '#ffe600'], deco: ['🎃', '👻', '🦇', '🕷️', '🍬', '🌕'], fall: false, banner: 'Happy Halloween!', hat: { svg: '<path d="M6 84 Q60 64 116 84 Q60 98 6 84Z" fill="#3a2a4a" stroke="#0d0d0d" stroke-width="5" stroke-linejoin="round"/><path d="M34 80 L56 12 Q64 2 76 10 L64 22 L88 80 Z" fill="#3a2a4a" stroke="#0d0d0d" stroke-width="5" stroke-linejoin="round"/><path d="M38 66 L84 66 L86 76 L36 76 Z" fill="#ff9a1f" stroke="#0d0d0d" stroke-width="4" stroke-linejoin="round"/>', rot: -12 }, cap: { svg: '<g fill="none" stroke="#0d0d0d" stroke-width="2.5"><path d="M100 0 L0 0 M100 0 L18 48 M100 0 L56 82 M100 0 L100 100"/><path d="M72 0 Q78 12 85 17 Q92 22 100 26"/><path d="M44 0 Q54 22 66 34 Q82 44 100 54"/><path d="M16 0 Q30 34 47 52 Q72 70 100 84"/></g><path d="M82 46 V64" stroke="#0d0d0d" stroke-width="2"/><circle cx="82" cy="68" r="6" fill="#0d0d0d"/>', pos: 'corner', h: 70, x: -3, y: -3, rot: 0 } },
    words: ['pumpkin', 'ghost', 'witch', 'bat', 'spider', 'costume', 'scary', 'candy'] },
  { id: 'womensday', name: "International Women's Day", when: [3, 8], rule: 'before',
    look: { bg: '#fff0f6', tiles: ['#ff4fc3', '#ffb6de', '#ffe600', '#9b5de5', '#ff5a1f', '#00e5c7'], deco: ['flower', '🌷', '💐', 'heart', 'flower', '🌸'], fall: true, banner: "Happy Women's Day!", hat: { emoji: '🌷', w: 100, h: 100, x: -26, y: -54, rot: -20 }, cap: { emoji: '🌸', pos: 'corner', h: 54 } },
    words: ['flowers', 'mother', 'grandmother', 'sister', 'strong', 'kind', 'thank you', 'card'] },
  { id: 'navruz', name: 'Navruz', when: [3, 21], rule: 'week',
    look: { bg: '#f1ffe6', tiles: ['#33c24d', '#ffe600', '#ff5a1f', '#00e5c7', '#c6ff00', '#ff4fc3'], deco: ['🌱', '🌷', 'sun', '🌿', '🍲', '🌸'], fall: true, banner: 'Navruz Muborak!', hat: { emoji: '🌷', w: 100, h: 100, x: -26, y: -54, rot: -20 }, cap: { svg: '<path d="M0 30 V20 L6 9 L12 20 L18 4 L24 20 L30 9 L36 20 L42 4 L48 20 L54 9 L60 20 L66 4 L72 20 L78 9 L84 20 L90 4 L96 20 L102 9 L108 20 L114 4 L120 20 L126 9 L132 20 L138 4 L144 20 L150 9 L156 20 L162 4 L168 20 L174 9 L180 20 L186 4 L192 20 L198 9 L204 20 V30 Z" fill="#33c24d" stroke="#0d0d0d" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>', stretch: true, h: 26 } },
    words: ['spring', 'sumalak', 'new year', 'flowers', 'green', 'guests', 'neighbours', 'celebrate'] },
  { id: 'piday', name: 'Pi Day', when: [3, 14], rule: 'week',
    look: { bg: '#eef6ff', tiles: ['#3d6bff', '#ffe600', '#ff5a1f', '#00e5c7', '#c6ff00', '#ff4fc3'], deco: ['π', '3.14', '🥧', '∞', '÷', '√'], fall: true, banner: 'Happy Pi Day! π', hat: { emoji: '🥧', w: 100, h: 100, x: -26, y: -50 }, cap: { emoji: 'π', pos: 'corner', h: 50 } },
    words: ['number', 'circle', 'maths', 'pie', 'calculate', 'shape', 'equals', 'infinity'] },
  { id: 'bookday', name: 'World Book Day', when: [4, 23], rule: 'week',
    look: { bg: '#fdf6e3', tiles: ['#b0703a', '#ffe600', '#3d6bff', '#ff4fc3', '#33c24d', '#ff5a1f'], deco: ['book', '📚', '✏️', '📖', 'book', '🔖'], fall: false, banner: 'Happy World Book Day!', hat: { emoji: '👓', w: 110, h: 110, x: -20, y: -46, rot: -10 }, cap: { emoji: '🔖', pos: 'corner', h: 50 } },
    words: ['book', 'story', 'writer', 'character', 'library', 'page', 'chapter', 'read'] },
  { id: 'musicday', name: 'World Music Day', when: [6, 21], rule: 'week',
    look: { bg: '#f3edff', tiles: ['#9b5de5', '#ff4fc3', '#ffe600', '#00e5c7', '#ff5a1f', '#c6ff00'], deco: ['guitar', '🎵', '🎶', 'piano', '🥁', '🎤'], fall: true, banner: 'Happy World Music Day!', hat: { emoji: '🎧', w: 116, h: 116, x: -30, y: -60, rot: -14 }, cap: { emoji: '🎵', pos: 'corner', h: 50 } },
    words: ['song', 'singer', 'band', 'concert', 'guitar', 'drums', 'dance', 'loud'] },
  { id: 'independence', name: 'Independence Day', when: [9, 1], rule: 'week',
    look: { bg: '#eaf8ff', tiles: ['#3d6bff', '#ffffff', '#33c24d', '#00e5c7', '#ffe600', '#ff3b3b'], deco: ['🇺🇿', '🎆', 'star', '🇺🇿', 'balloon', '🎉'], fall: false, banner: 'Happy Independence Day!', hat: { emoji: '🇺🇿', w: 100, h: 100, x: -26, y: -54, rot: -14 }, cap: { svg: '<path d="M0 3 Q100 12 200 3" fill="none" stroke="#0d0d0d" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="M2 5 L18 5 L10 27 Z" fill="#3d6bff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M22 5 L38 5 L30 27 Z" fill="#ffffff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M42 5 L58 5 L50 27 Z" fill="#33c24d" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M62 5 L78 5 L70 27 Z" fill="#3d6bff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M82 5 L98 5 L90 27 Z" fill="#ffffff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M102 5 L118 5 L110 27 Z" fill="#33c24d" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M122 5 L138 5 L130 27 Z" fill="#3d6bff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M142 5 L158 5 L150 27 Z" fill="#ffffff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M162 5 L178 5 L170 27 Z" fill="#33c24d" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M182 5 L198 5 L190 27 Z" fill="#3d6bff" stroke="#0d0d0d" stroke-width="1.5" vector-effect="non-scaling-stroke"/>', stretch: true, h: 28 } },
    words: ['country', 'flag', 'holiday', 'celebrate', 'fireworks', 'proud', 'history', 'people'] },
  { id: 'gamerday', name: 'International Gamer Day', when: [9, 12], rule: 'week',
    look: { bg: '#eafff7', tiles: ['#00e5c7', '#9b5de5', '#c6ff00', '#ff4fc3', '#3d6bff', '#ffe600'], deco: ['🎮', '👾', '🕹️', '🏆', '⭐', '❤️'], fall: false, banner: 'Happy Gamer Day!', hat: { emoji: '👑', w: 110, h: 110, x: -28, y: -62, rot: -16 }, cap: { emoji: '👾', pos: 'corner', h: 50 } },
    words: ['game', 'player', 'level', 'win', 'lose', 'score', 'team', 'online'] },
  { id: 'cinemaday', name: 'World Cinema Day', when: [10, 28], rule: 'fixed', from: [10, 17], to: [10, 23],
    look: { bg: '#fff7e0', tiles: ['#ffe600', '#ff3b3b', '#ff9a1f', '#ff5a1f', '#3d6bff', '#ffffff'], deco: ['🎬', '🍿', '🎥', '⭐', '🎟️', 'camera'], fall: false, banner: 'Happy World Cinema Day!', hat: { emoji: '🎬', w: 100, h: 100, x: -26, y: -54, rot: -16 }, cap: { emoji: '🍿', pos: 'corner', h: 54 } },
    words: ['film', 'actor', 'cinema', 'popcorn', 'ticket', 'director', 'scene', 'cartoon'] },
  { id: 'scienceday', name: 'World Science Day', when: [11, 10], rule: 'week',
    look: { bg: '#eefcff', tiles: ['#00e5c7', '#3d6bff', '#c6ff00', '#ff5a1f', '#9b5de5', '#ffe600'], deco: ['🔬', '🧪', 'rocket', '🧬', '⚛️', '🔭'], fall: false, banner: 'Happy World Science Day!', hat: { emoji: '🥽', w: 110, h: 110, x: -24, y: -52, rot: -12 }, cap: { emoji: '⚛️', pos: 'corner', h: 50 } },
    words: ['science', 'scientist', 'experiment', 'planet', 'discover', 'invent', 'robot', 'space'] },
  { id: 'educationday', name: 'International Day of Education', when: [1, 24], rule: 'week',
    look: { bg: '#f6f9e8', tiles: ['#c6ff00', '#3d6bff', '#ff4fc3', '#ffe600', '#00e5c7', '#ff5a1f'], deco: ['book', '🎓', '✏️', 'clock', '🏫', '📐'], fall: false, banner: 'Happy Education Day!', hat: { emoji: '🎓', w: 116, h: 116, x: -32, y: -64, rot: -16 }, cap: { emoji: '✏️', pos: 'corner', h: 50 } },
    words: ['school', 'teacher', 'student', 'learn', 'subject', 'exam', 'knowledge', 'future'] },
  { id: 'languageday', name: 'International Mother Language Day', when: [2, 21], rule: 'week',
    look: { bg: '#fff4ea', tiles: ['#ff5a1f', '#00e5c7', '#ffe600', '#9b5de5', '#c6ff00', '#3d6bff'], deco: ['💬', 'Salom', 'Hello', 'Привет', 'Hola', '🗣️'], fall: true, banner: 'Happy Mother Language Day!', hat: { emoji: '💬', w: 100, h: 100, x: -26, y: -58, rot: -10 }, cap: { emoji: '🗣️', pos: 'corner', h: 50 } },
    words: ['language', 'word', 'speak', 'translate', 'country', 'mother tongue', 'alphabet', 'dictionary'] },
  { id: 'diversityday', name: 'World Day for Cultural Diversity', when: [5, 21], rule: 'week',
    look: { bg: '#f0fbff', tiles: ['#3d6bff', '#ff4fc3', '#33c24d', '#ffe600', '#ff5a1f', '#00e5c7'], deco: ['🌍', '🌏', '🌎', '🤝', '🎎', '🍜'], fall: false, banner: 'Happy Cultural Diversity Day!', hat: { emoji: '🌍', w: 100, h: 100, x: -26, y: -54, rot: -10 }, cap: { emoji: '🤝', pos: 'corner', h: 50 } },
    words: ['culture', 'tradition', 'country', 'food', 'clothes', 'festival', 'different', 'together'] },
  { id: 'emojiday', name: 'World Emoji Day', when: [7, 17], rule: 'week',
    look: { bg: '#fffbe0', tiles: ['#ffe600', '#ff9a1f', '#ff4fc3', '#00e5c7', '#c6ff00', '#3d6bff'], deco: ['😀', '😂', '😍', '😎', '🤔', '😴'], fall: true, banner: 'Happy World Emoji Day! 😀', hat: { emoji: '😎', w: 104, h: 104, x: -26, y: -54, rot: -14 }, cap: { emoji: '😀', pos: 'corner', h: 50 } },
    words: ['happy', 'sad', 'angry', 'tired', 'surprised', 'bored', 'excited', 'scared'] },
  { id: 'catday', name: 'International Cat Day', when: [8, 8], rule: 'week',
    look: { bg: '#fff3e6', tiles: ['#ff9a1f', '#ffe600', '#ff4fc3', '#c6ff00', '#00e5c7', '#ffffff'], deco: ['cat', '🐾', '🐟', '🧶', 'cat', '🐾'], fall: true, banner: 'Happy Cat Day!', hat: { svg: '<path d="M14 92 L28 18 L66 70 Z" fill="#ff9a1f" stroke="#0d0d0d" stroke-width="5" stroke-linejoin="round"/><path d="M26 76 L32 40 L50 66 Z" fill="#ffb6de"/><path d="M106 92 L92 18 L54 70 Z" fill="#ff9a1f" stroke="#0d0d0d" stroke-width="5" stroke-linejoin="round"/><path d="M94 76 L88 40 L70 66 Z" fill="#ffb6de"/>', w: 170, h: 100, x: 110, y: -62, rot: 0 }, cap: { emoji: '🐾', pos: 'corner', h: 50 } },
    words: ['cat', 'kitten', 'tail', 'fur', 'paw', 'pet', 'cute', 'sleepy'] }
];
