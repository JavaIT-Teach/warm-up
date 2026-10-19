/* Warm Up: the games on the home screen (the first nine in a 3 x 3 grid, the rest in rows below).
   first: true = highlighted in "First lesson" mode (good with strangers). sticker = a label always shown on the card.
   levels: [from, to] = level numbers the game is made for (0 = Beginner ... 6 = IELTS 3). Outside them the card is grey and does not open. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.games = [
  { id: 'bomb', name: 'The Bomb', hook: "Say a word. Pass it on. Don't be holding it.", color: '#c6ff00', first: true },
  { id: 'slot', name: 'Slot Machine of Chaos', hook: 'Three reels. One ridiculous talk.', color: '#ff5a1f', first: true },
  { id: 'tiles', name: 'Mystery Tiles', hook: 'Ask yes/no questions. Uncover the picture.', color: '#3d6bff' },
  { id: 'hotseat', name: 'Hot Seat', hook: 'Back to the board. The class describes.', color: '#ff4fc3' },
  { id: 'lie', name: 'Lie Detector', hook: 'Truth or lie? The machine knows.', color: '#ffe600', first: true },
  { id: 'swap', name: 'Speed Swap', hook: 'Talk in pairs. Buzzer. Swap seats.', color: '#00e5c7', first: true },
  { id: 'tug', name: 'Tug of War', hook: 'Two teams. Good reasons pull the rope.', color: '#3d6bff', first: true },
  { id: 'dice', name: 'Story Dice', hook: 'Roll the pictures. Build one story.', color: '#c6ff00' },
  { id: 'chain', name: 'Word Chain', hook: 'The last letter starts the next word.', color: '#ff5a1f' },
  { id: 'names', name: 'Name Wall', hook: 'Meet everyone. Then remember every name.', color: '#ff4fc3', first: true, sticker: 'ICEBREAKER' },
  { id: 'standup', name: 'Stand Up If...', hook: 'True for you? Stand up and tell us more.', color: '#ffe600', first: true, sticker: 'GET UP!' },
  { id: 'zones', name: 'Four Zones', hook: 'Pick an answer. Walk to its zone.', color: '#00e5c7', first: true, sticker: 'GET UP!' },
  { id: 'opinion', name: 'Opinion Line', hook: 'Agree or disagree? Stand on the line.', color: '#ff5a1f', sticker: 'GET UP!', levels: [2, 6] },
  { id: 'findwho', name: 'Find Someone Who', hook: 'Walk, ask, find one YES and one NO.', color: '#c6ff00', first: true, sticker: 'GET UP!' },
  { id: 'says', name: 'Teacher Says', hook: 'Only move when the teacher says!', color: '#3d6bff', sticker: 'GET UP!', levels: [0, 1] }
];
