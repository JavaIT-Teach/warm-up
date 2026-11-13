/* Warm Up: occasion themes. One occasion is live for one week; the app changes its look and, where a game has
   themed content (items with theme: '<id>'), plays that content instead of the usual one.

   when : [month, day] of the occasion.
   rule : 'before' = the 7 days ending the day before the occasion (holidays: no classes on the day itself)
          'week'   = Monday to Sunday of the week the occasion falls in
          'fixed'  = from [month, day] to [month, day] (see from / to)
   Earlier entries win if two weeks ever overlap.
   look : bg = page colour, tiles = home tile colours (in order), deco = picture ids or short texts that float on screen,
          fall = true: decorations drift down (snow, leaves), banner = the label on the home screen.
   words: theme words students may not know yet (shown with pictures). Themed content = taught material + these words.

   Themed content in a game: add items with theme: '<id>' to that game's lists in content/<game>.js (permanent ids as usual).
   While the theme is on, a list with 3 or more items for it plays only those; with fewer, they are added to the rest.
   When the theme is off, themed items are hidden. */
window.WU = window.WU || {};
WU.THEMES = [
  { id: 'newyear', name: 'New Year', when: [1, 1], rule: 'before',
    look: { bg: '#e7f0ff', tiles: ['#ff3b3b', '#33c24d', '#ffe600', '#3d6bff', '#ffffff', '#ff4fc3'], deco: ['snow', 'star', 'ny-tree', 'present', 'snow', 'fireworks', 'snowman', 'snow'], fall: true, banner: 'Happy New Year!' },
    words: ['New Year tree', 'fireworks', 'present', 'snowman', 'midnight', 'celebrate', 'wish', 'party'] },
  { id: 'halloween', name: 'Halloween', when: [10, 31], rule: 'before',
    look: { bg: '#ffe8d1', tiles: ['#ff9a1f', '#9b5de5', '#c6ff00', '#0d0d0d', '#ff5a1f', '#ffe600'], deco: ['🎃', '👻', '🦇', '🕷️', '🍬', '🌕'], fall: false, banner: 'Happy Halloween!' },
    words: ['pumpkin', 'ghost', 'witch', 'bat', 'spider', 'costume', 'scary', 'candy'] },
  { id: 'womensday', name: "International Women's Day", when: [3, 8], rule: 'before',
    look: { bg: '#fff0f6', tiles: ['#ff4fc3', '#ffb6de', '#ffe600', '#9b5de5', '#ff5a1f', '#00e5c7'], deco: ['flower', '🌷', '💐', 'heart', 'flower', '🌸'], fall: true, banner: "Happy Women's Day!" },
    words: ['flowers', 'mother', 'grandmother', 'sister', 'strong', 'kind', 'thank you', 'card'] },
  { id: 'navruz', name: 'Navruz', when: [3, 21], rule: 'week',
    look: { bg: '#f1ffe6', tiles: ['#33c24d', '#ffe600', '#ff5a1f', '#00e5c7', '#c6ff00', '#ff4fc3'], deco: ['🌱', '🌷', 'sun', '🌿', '🍲', '🌸'], fall: true, banner: 'Navruz Muborak!' },
    words: ['spring', 'sumalak', 'new year', 'flowers', 'green', 'guests', 'neighbours', 'celebrate'] },
  { id: 'piday', name: 'Pi Day', when: [3, 14], rule: 'week',
    look: { bg: '#eef6ff', tiles: ['#3d6bff', '#ffe600', '#ff5a1f', '#00e5c7', '#c6ff00', '#ff4fc3'], deco: ['π', '3.14', '🥧', '∞', '÷', '√'], fall: true, banner: 'Happy Pi Day! π' },
    words: ['number', 'circle', 'maths', 'pie', 'calculate', 'shape', 'equals', 'infinity'] },
  { id: 'bookday', name: 'World Book Day', when: [4, 23], rule: 'week',
    look: { bg: '#fdf6e3', tiles: ['#b0703a', '#ffe600', '#3d6bff', '#ff4fc3', '#33c24d', '#ff5a1f'], deco: ['book', '📚', '✏️', '📖', 'book', '🔖'], fall: false, banner: 'Happy World Book Day!' },
    words: ['book', 'story', 'writer', 'character', 'library', 'page', 'chapter', 'read'] },
  { id: 'musicday', name: 'World Music Day', when: [6, 21], rule: 'week',
    look: { bg: '#f3edff', tiles: ['#9b5de5', '#ff4fc3', '#ffe600', '#00e5c7', '#ff5a1f', '#c6ff00'], deco: ['guitar', '🎵', '🎶', 'piano', '🥁', '🎤'], fall: true, banner: 'Happy World Music Day!' },
    words: ['song', 'singer', 'band', 'concert', 'guitar', 'drums', 'dance', 'loud'] },
  { id: 'independence', name: 'Independence Day', when: [9, 1], rule: 'week',
    look: { bg: '#eaf8ff', tiles: ['#3d6bff', '#ffffff', '#33c24d', '#00e5c7', '#ffe600', '#ff3b3b'], deco: ['🇺🇿', '🎆', 'star', '🇺🇿', 'balloon', '🎉'], fall: false, banner: 'Happy Independence Day!' },
    words: ['country', 'flag', 'holiday', 'celebrate', 'fireworks', 'proud', 'history', 'people'] },
  { id: 'gamerday', name: 'International Gamer Day', when: [9, 12], rule: 'week',
    look: { bg: '#eafff7', tiles: ['#00e5c7', '#9b5de5', '#c6ff00', '#ff4fc3', '#3d6bff', '#ffe600'], deco: ['🎮', '👾', '🕹️', '🏆', '⭐', '❤️'], fall: false, banner: 'Happy Gamer Day!' },
    words: ['game', 'player', 'level', 'win', 'lose', 'score', 'team', 'online'] },
  { id: 'cinemaday', name: 'World Cinema Day', when: [10, 28], rule: 'fixed', from: [10, 17], to: [10, 23],
    look: { bg: '#fff7e0', tiles: ['#ffe600', '#ff3b3b', '#0d0d0d', '#ff5a1f', '#3d6bff', '#ffffff'], deco: ['🎬', '🍿', '🎥', '⭐', '🎟️', 'camera'], fall: false, banner: 'Happy World Cinema Day!' },
    words: ['film', 'actor', 'cinema', 'popcorn', 'ticket', 'director', 'scene', 'cartoon'] },
  { id: 'scienceday', name: 'World Science Day', when: [11, 10], rule: 'week',
    look: { bg: '#eefcff', tiles: ['#00e5c7', '#3d6bff', '#c6ff00', '#ff5a1f', '#9b5de5', '#ffe600'], deco: ['🔬', '🧪', 'rocket', '🧬', '⚛️', '🔭'], fall: false, banner: 'Happy World Science Day!' },
    words: ['science', 'scientist', 'experiment', 'planet', 'discover', 'invent', 'robot', 'space'] },
  { id: 'educationday', name: 'International Day of Education', when: [1, 24], rule: 'week',
    look: { bg: '#f6f9e8', tiles: ['#c6ff00', '#3d6bff', '#ff4fc3', '#ffe600', '#00e5c7', '#ff5a1f'], deco: ['book', '🎓', '✏️', 'clock', '🏫', '📐'], fall: false, banner: 'Happy Education Day!' },
    words: ['school', 'teacher', 'student', 'learn', 'subject', 'exam', 'knowledge', 'future'] },
  { id: 'languageday', name: 'International Mother Language Day', when: [2, 21], rule: 'week',
    look: { bg: '#fff4ea', tiles: ['#ff5a1f', '#00e5c7', '#ffe600', '#9b5de5', '#c6ff00', '#3d6bff'], deco: ['💬', 'Salom', 'Hello', 'Привет', 'Hola', '🗣️'], fall: true, banner: 'Happy Mother Language Day!' },
    words: ['language', 'word', 'speak', 'translate', 'country', 'mother tongue', 'alphabet', 'dictionary'] },
  { id: 'diversityday', name: 'World Day for Cultural Diversity', when: [5, 21], rule: 'week',
    look: { bg: '#f0fbff', tiles: ['#3d6bff', '#ff4fc3', '#33c24d', '#ffe600', '#ff5a1f', '#00e5c7'], deco: ['🌍', '🌏', '🌎', '🤝', '🎎', '🍜'], fall: false, banner: 'Happy Cultural Diversity Day!' },
    words: ['culture', 'tradition', 'country', 'food', 'clothes', 'festival', 'different', 'together'] },
  { id: 'emojiday', name: 'World Emoji Day', when: [7, 17], rule: 'week',
    look: { bg: '#fffbe0', tiles: ['#ffe600', '#ff9a1f', '#ff4fc3', '#00e5c7', '#c6ff00', '#3d6bff'], deco: ['😀', '😂', '😍', '😎', '🤔', '😴'], fall: true, banner: 'Happy World Emoji Day! 😀' },
    words: ['happy', 'sad', 'angry', 'tired', 'surprised', 'bored', 'excited', 'scared'] },
  { id: 'catday', name: 'International Cat Day', when: [8, 8], rule: 'week',
    look: { bg: '#fff3e6', tiles: ['#ff9a1f', '#ffe600', '#ff4fc3', '#c6ff00', '#00e5c7', '#ffffff'], deco: ['cat', '🐾', '🐟', '🧶', 'cat', '🐾'], fall: true, banner: 'Happy Cat Day!' },
    words: ['cat', 'kitten', 'tail', 'fur', 'paw', 'pet', 'cute', 'sleepy'] }
];
