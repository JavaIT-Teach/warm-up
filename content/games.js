/* Warm Up: the nine games on the home screen.
   first: true = highlighted in "First lesson" mode (good with strangers). ready: true = playable now. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.games = [
  { id: 'bomb', name: 'The Bomb', hook: "Say a word. Pass it on. Don't be holding it.", color: '#c6ff00', first: true, ready: true },
  { id: 'slot', name: 'Slot Machine of Chaos', hook: 'Three reels. One ridiculous talk.', color: '#ff5a1f', first: true },
  { id: 'tiles', name: 'Mystery Tiles', hook: 'Ask yes/no questions. Uncover the picture.', color: '#3d6bff' },
  { id: 'hotseat', name: 'Hot Seat', hook: 'Back to the board. The class describes.', color: '#ff4fc3' },
  { id: 'lie', name: 'Lie Detector', hook: 'Truth or lie? The machine knows.', color: '#ffe600', first: true },
  { id: 'swap', name: 'Speed Swap', hook: 'Talk in pairs. Buzzer. Swap seats.', color: '#00e5c7', first: true },
  { id: 'tug', name: 'Tug of War', hook: 'Two teams. Good reasons pull the rope.', color: '#3d6bff', first: true },
  { id: 'dice', name: 'Story Dice', hook: 'Roll the pictures. Build one story.', color: '#c6ff00' },
  { id: 'chain', name: 'Word Chain', hook: 'The last letter starts the next word.', color: '#ff5a1f' }
];
