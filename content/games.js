/* Warm Up: the games on the home screen (the first nine in a 3 x 3 grid, the rest in rows below).
   first: true = highlighted in "First lesson" mode (good with strangers). sticker = a label always shown on the card.
   trains: what the game practises (a small note on its card).
   grammar: true = in the GRAMMAR GAMES section (numbered G1, G2...; key G then the number, G then 0 = G10).
   levels: [from, to] = level numbers the game is made for (0 = Beginner ... 6 = IELTS 3). Outside them the card is grey and does not open.
   skills: which skill menus the game appears in (ids from WU.SKILLS below). Every game needs at least one.
   added: 'YYYY-MM-DD' = when the game was added. Games added in the last WU.NEW_DAYS days get a NEW badge and go first.
   unit: 'Unit 9 · Feeling Good' = the coursebook material the game reviews (shown on the card).
   preview: ['word', 'word', ...] = words for the card's animated preview (games without a drawn preview). */
window.WU = window.WU || {}; WU.content = WU.content || {};
/* The home screen is a skill menu: pick what to train today, then pick a game. */
WU.SKILLS = [
  { id: 'vocab', name: 'Vocabulary', hook: 'Words from your lessons', color: '#c6ff00' },
  { id: 'grammar', name: 'Grammar', hook: 'One grammar point, fast', color: '#3d6bff' },
  { id: 'speaking', name: 'Speaking', hook: 'Talk, ask, argue, move', color: '#ff4fc3' },
  { id: 'reading', name: 'Reading', hook: 'Read fast, find, react', color: '#ffe600' },
  { id: 'writing', name: 'Writing', hook: 'Spell, build, write', color: '#00e5c7' }
];
WU.NEW_DAYS = 14;
WU.content.games = [
  { id: 'bomb', skills: ['vocab', 'speaking'], name: 'The Bomb', hook: "Say a word. Pass it on. Don't be holding it.", trains: 'Vocabulary by topic · fast speaking', color: '#c6ff00', first: true },
  { id: 'slot', skills: ['speaking'], name: 'Slot Machine of Chaos', hook: 'Three reels. One ridiculous talk.', trains: 'Fluency · speaking at length', color: '#ff5a1f', first: true },
  { id: 'hotseat', skills: ['vocab', 'speaking'], name: 'Hot Seat', hook: 'Back to the board. The class describes.', trains: 'Describing · paraphrasing', color: '#ff4fc3' },
  { id: 'lie', skills: ['speaking'], name: 'Lie Detector', hook: 'Truth or lie? The machine knows.', trains: 'Answering · follow-up questions', color: '#ffe600', first: true },
  { id: 'tug', skills: ['speaking'], name: 'Tug of War', hook: 'Two teams. Good reasons pull the rope.', trains: 'Giving reasons · persuading', color: '#3d6bff', first: true },
  { id: 'dice', skills: ['speaking', 'writing'], name: 'Story Dice', hook: 'Roll the pictures. Build one story.', trains: 'Storytelling · past simple · linking words', color: '#c6ff00' },
  { id: 'chain', skills: ['vocab', 'writing'], name: 'Word Chain', hook: 'The last letter starts the next word.', trains: 'Vocabulary recall · spelling', color: '#ff5a1f' },
  { id: 'names', skills: ['speaking'], name: 'Name Wall', hook: 'Meet everyone. Then remember every name.', trains: 'Introducing yourself · he / she likes...', color: '#ff4fc3', first: true, sticker: 'ICEBREAKER' },
  { id: 'standup', skills: ['speaking'], name: 'Stand Up If...', hook: 'True for you? Stand up and tell us more.', trains: 'Listening · saying more about yourself', color: '#ffe600', first: true, sticker: 'GET UP!' },
  { id: 'zones', skills: ['speaking'], name: 'Four Zones', hook: 'Pick an answer. Walk to its zone.', trains: 'Choosing & giving reasons', color: '#00e5c7', first: true, sticker: 'GET UP!' },
  { id: 'opinion', skills: ['speaking'], name: 'Opinion Line', hook: 'Agree or disagree? Stand on the line.', trains: 'Agreeing & disagreeing · justifying', color: '#ff5a1f', sticker: 'GET UP!', levels: [2, 6] },
  { id: 'findwho', skills: ['speaking', 'grammar'], name: 'Find Someone Who', hook: 'Walk, ask, find one YES and one NO.', trains: 'Questions & short answers', color: '#c6ff00', first: true, sticker: 'GET UP!' },
  { id: 'chat', skills: ['speaking'], name: 'Speed Chat', hook: 'One question. New partner. Again and again.', trains: 'Questions · short answers · reporting', color: '#ff4fc3', first: true, sticker: 'GET UP!' },
  /* ---------- Grammar games: one grammar point each (in the Grammar menu) ---------- */
  { id: 'articles', skills: ['grammar'], grammar: true, name: 'Article Showdown', hook: '3, 2, 1... fingers up: a, an, the or nothing?', trains: 'Articles: a / an / the / no article', color: '#c6ff00' },
  { id: 'flash', skills: ['grammar'], grammar: true, name: 'Flash Room', hook: "Look fast. It's gone. What was there?", trains: 'There is / There are · was / were', color: '#00e5c7', levels: [0, 3] },
  { id: 'nearfar', skills: ['grammar'], grammar: true, name: 'Near & Far', hook: 'Close or far? One or many? Say it right.', trains: 'this / that / these / those', color: '#ffe600', levels: [0, 2] },
  { id: 'where', skills: ['grammar'], grammar: true, name: 'Hide & Seek Cat', hook: 'The cat moves. Where is it now?', trains: 'Prepositions of place & movement', color: '#ff4fc3', levels: [0, 3] },
  { id: 'volcano', skills: ['grammar'], grammar: true, name: 'Verb Volcano', hook: 'Say the forms before it erupts!', trains: 'Irregular verbs: past simple · past participle', color: '#ff5a1f', levels: [1, 6] },
  { id: 'timemachine', skills: ['grammar'], grammar: true, name: 'Time Machine', hook: 'Who? Do what? When? Build the sentence.', trains: 'Tenses, one family at a time', color: '#3d6bff' },
  { id: 'domino', skills: ['grammar'], grammar: true, name: 'Domino Effect', hook: 'Every result starts the next "If..."', trains: 'Conditionals: 1st, 2nd, 3rd, mixed (by level)', color: '#c6ff00', levels: [2, 6] },
  { id: 'pinit', skills: ['grammar'], grammar: true, name: 'Pin It!', hook: 'At, on or in? 3, 2, 1... fingers up!', trains: 'Prepositions of time & place: at / on / in', color: '#33c24d', levels: [0, 3] },
  { id: 'sticky', skills: ['grammar'], grammar: true, name: 'Sticky Words', hook: 'Team race: the right preposition, fast!', trains: 'Dependent prepositions · fixed phrases', color: '#ffe600', levels: [3, 6] },
  { id: 'phrasal', skills: ['grammar'], grammar: true, name: 'Phrasal Roulette', hook: 'Spin a phrasal verb. Explain it. Use it.', trains: 'Phrasal verbs: meaning and use', color: '#ff5a1f', levels: [2, 6] }
];
