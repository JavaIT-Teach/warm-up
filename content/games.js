/* Warm Up: the games on the home screen (the first nine in a 3 x 3 grid, the rest in rows below).
   first: true = highlighted in "First lesson" mode (good with strangers). sticker = a label always shown on the card.
   trains: what the game practises (a small note on its card).
   grammar: true = in the GRAMMAR GAMES section (numbered G1, G2...; key G then the number).
   levels: [from, to] = level numbers the game is made for (0 = Beginner ... 6 = IELTS 3). Outside them the card is grey and does not open. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.games = [
  { id: 'bomb', name: 'The Bomb', hook: "Say a word. Pass it on. Don't be holding it.", trains: 'Vocabulary by topic · fast speaking', color: '#c6ff00', first: true },
  { id: 'slot', name: 'Slot Machine of Chaos', hook: 'Three reels. One ridiculous talk.', trains: 'Fluency · speaking at length', color: '#ff5a1f', first: true },
  { id: 'tiles', name: 'Mystery Tiles', hook: 'Ask yes/no questions. Uncover the picture.', trains: 'Yes / no questions: Is it...? Can it...?', color: '#3d6bff' },
  { id: 'hotseat', name: 'Hot Seat', hook: 'Back to the board. The class describes.', trains: 'Describing · paraphrasing', color: '#ff4fc3' },
  { id: 'lie', name: 'Lie Detector', hook: 'Truth or lie? The machine knows.', trains: 'Answering · follow-up questions', color: '#ffe600', first: true },
  { id: 'swap', name: 'Speed Swap', hook: 'Talk in pairs. Buzzer. Swap seats.', trains: 'Pair conversation · asking & answering', color: '#00e5c7', first: true },
  { id: 'tug', name: 'Tug of War', hook: 'Two teams. Good reasons pull the rope.', trains: 'Giving reasons · persuading', color: '#3d6bff', first: true },
  { id: 'dice', name: 'Story Dice', hook: 'Roll the pictures. Build one story.', trains: 'Storytelling · past simple · linking words', color: '#c6ff00' },
  { id: 'chain', name: 'Word Chain', hook: 'The last letter starts the next word.', trains: 'Vocabulary recall · spelling', color: '#ff5a1f' },
  { id: 'names', name: 'Name Wall', hook: 'Meet everyone. Then remember every name.', trains: 'Introducing yourself · he / she likes...', color: '#ff4fc3', first: true, sticker: 'ICEBREAKER' },
  { id: 'standup', name: 'Stand Up If...', hook: 'True for you? Stand up and tell us more.', trains: 'Listening · saying more about yourself', color: '#ffe600', first: true, sticker: 'GET UP!' },
  { id: 'zones', name: 'Four Zones', hook: 'Pick an answer. Walk to its zone.', trains: 'Choosing & giving reasons', color: '#00e5c7', first: true, sticker: 'GET UP!' },
  { id: 'opinion', name: 'Opinion Line', hook: 'Agree or disagree? Stand on the line.', trains: 'Agreeing & disagreeing · justifying', color: '#ff5a1f', sticker: 'GET UP!', levels: [2, 6] },
  { id: 'findwho', name: 'Find Someone Who', hook: 'Walk, ask, find one YES and one NO.', trains: 'Questions & short answers', color: '#c6ff00', first: true, sticker: 'GET UP!' },
  { id: 'says', name: 'Teacher Says', hook: 'Only move when the teacher says!', trains: 'Listening · imperatives · body & classroom words', color: '#3d6bff', sticker: 'GET UP!', levels: [0, 1] },
  { id: 'chat', name: 'Speed Chat', hook: 'One question. New partner. Again and again.', trains: 'Questions · short answers · reporting', color: '#ff4fc3', first: true, sticker: 'GET UP!' },
  /* ---------- Grammar games: one grammar point each (G1, G2... on the home screen) ---------- */
  { id: 'articles', grammar: true, name: 'Article Showdown', hook: '3, 2, 1... fingers up: a, an, the or nothing?', trains: 'Articles: a / an / the / no article', color: '#c6ff00' },
  { id: 'flash', grammar: true, name: 'Flash Room', hook: "Look fast. It's gone. What was there?", trains: 'There is / There are · was / were', color: '#00e5c7' },
  { id: 'nearfar', grammar: true, name: 'Near & Far', hook: 'Close or far? One or many? Say it right.', trains: 'this / that / these / those', color: '#ffe600', levels: [0, 2] },
  { id: 'where', grammar: true, name: 'Hide & Seek Cat', hook: 'The cat moves. Where is it now?', trains: 'Prepositions of place & movement', color: '#ff4fc3', levels: [0, 3] },
  { id: 'volcano', grammar: true, name: 'Verb Volcano', hook: 'Say the forms before it erupts!', trains: 'Irregular verbs: past simple · past participle', color: '#ff5a1f', levels: [1, 6] },
  { id: 'timemachine', grammar: true, name: 'Time Machine', hook: 'Who? Do what? When? Build the sentence.', trains: 'Tenses, one family at a time', color: '#3d6bff' },
  { id: 'domino', grammar: true, name: 'Domino Effect', hook: 'Every result starts the next "If..."', trains: 'Conditionals: 1st, 2nd, 3rd, mixed (by level)', color: '#c6ff00', levels: [2, 6] }
];
