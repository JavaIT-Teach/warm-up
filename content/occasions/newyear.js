/* Warm Up: NEW YEAR themed content (occasion id 'newyear', see content/themes.js). Live Dec 25-31.
   Adds items with theme: 'newyear' to the games' lists, per level (0 = Beginner, 1 = Elementary, 2 = Pre-Intermediate,
   3 = Intermediate). Same item formats and permanent-id rules as each game's own content file.
   Language: taught material + a few theme words (New Year tree, fireworks, present, snowman, midnight, wish, party). */
(function () {
  var T = 'newyear', C = WU.content;
  function add(game, list, level, items) { items.forEach(function (it) { it.theme = T; C[game][level][list].push(it); }); }

  /* ---------- 0. Beginner ---------- */
  add('bomb', 'cats', 0, [
    { id: 'ny-a1-c-things', name: 'New Year things', tag: 'newyear', icon: 'ny-tree', frame: "It's ___." },
    { id: 'ny-a1-c-party-food', name: 'Party food', tag: 'food', icon: 'cake', frame: 'I like ___.' },
    { id: 'ny-a1-c-presents', name: 'Presents I want', tag: 'toy', icon: 'present', frame: 'I want ___.' },
    { id: 'ny-a1-c-winter', name: 'Winter things', tag: 'cold', icon: 'snowman', frame: "It's ___." }
  ]);
  add('hotseat', 'words', 0, ['ny-tree', 'fireworks', 'present', 'snowman', 'star', 'cake', 'candle', 'balloon', 'snow', 'clock'].map(function (p) { return { id: 'ny-a1-h-' + p, pic: p }; }));
  add('tug', 'topics', 0, [
    { id: 'ny-a1-t-cake-vs-sweets', left: 'cake', leftPic: 'cake', right: 'sweets', rightPic: 'sweets' },
    { id: 'ny-a1-t-snow-vs-sun', left: 'snow', leftPic: 'snow', right: 'sun', rightPic: 'sun' },
    { id: 'ny-a1-t-presents-vs-parties', left: 'presents', leftPic: 'present', right: 'parties', rightPic: 'balloon' }
  ]);
  add('standup', 'sentences', 0, [
    { id: 'ny-a1-s-like-snow', text: 'Stand up if you like snow.', pic: 'snow', follow: 'I like ___.' },
    { id: 'ny-a1-s-tree-at-home', text: 'Stand up if you have a New Year tree at home.', pic: 'ny-tree', follow: 'My tree is ___.' },
    { id: 'ny-a1-s-like-presents', text: 'Stand up if you like presents.', pic: 'present', follow: 'I want ___.' },
    { id: 'ny-a1-s-like-cake', text: 'Stand up if you like cake.', pic: 'cake', follow: 'I like ___ cake.' }
  ]);
  add('zones', 'questions', 0, [
    { id: 'ny-a1-z-winter-thing', q: 'Favourite winter thing?', a1: 'snow', p1: 'snow', a2: 'snowman', p2: 'snowman', a3: 'fireworks', p3: 'fireworks', a4: 'presents', p4: 'present' },
    { id: 'ny-a1-z-party-food', q: 'Favourite party food?', a1: 'cake', p1: 'cake', a2: 'pizza', p2: 'pizza', a3: 'fruit', p3: 'apple', a4: 'sweets', p4: 'sweets' },
    { id: 'ny-a1-z-tree-colour', q: 'Best colour for a New Year tree?', a1: 'green', p1: 'c-green', a2: 'white', p2: 'c-white', a3: 'red', p3: 'c-red', a4: 'blue', p4: 'c-blue' }
  ]);
  add('lie', 'questions', 0, [
    { id: 'ny-a1-q-like-snow', text: 'Do you like snow?', pic: 'snow' },
    { id: 'ny-a1-q-have-tree', text: 'Do you have a New Year tree?', pic: 'ny-tree' },
    { id: 'ny-a1-q-like-fireworks', text: 'Do you like fireworks?', pic: 'fireworks' },
    { id: 'ny-a1-q-like-cake', text: 'Do you like cake?', pic: 'cake' }
  ]);

  /* ---------- 1. Elementary ---------- */
  add('bomb', 'cats', 1, [
    { id: 'ny-a2-c-eve', name: "Things you do on New Year's Eve" },
    { id: 'ny-a2-c-got-last-year', name: 'Presents you got last year' },
    { id: 'ny-a2-c-winter', name: 'Things you see in winter' },
    { id: 'ny-a2-c-food', name: 'New Year food in Uzbekistan' }
  ]);
  add('hotseat', 'words', 1, ['present', 'fireworks', 'New Year tree', 'snowman', 'midnight', 'party', 'winter', 'holiday', 'cake', 'family'].map(function (w) { return { id: 'ny-a2-h-' + w.replace(/\s+/g, '-').toLowerCase(), text: w }; }));
  add('tug', 'topics', 1, [
    { id: 'ny-a2-t-home-vs-restaurant', left: 'New Year at home', leftPic: 'house', right: 'New Year in a restaurant', rightPic: 'pizza' },
    { id: 'ny-a2-t-giving-vs-getting', left: 'giving presents', leftPic: 'present', right: 'getting presents', rightPic: 'present' },
    { id: 'ny-a2-t-fireworks-vs-tv', left: 'watching fireworks', leftPic: 'fireworks', right: 'watching TV', rightPic: 'TV' }
  ]);
  add('standup', 'sentences', 1, [
    { id: 'ny-a2-s-got-present', text: 'Stand up if you got a present last New Year.', pic: 'present', follow: 'I got ___.' },
    { id: 'ny-a2-s-midnight', text: 'Stand up if you stayed up until midnight last New Year.', pic: 'clock', follow: 'I went to bed at ___.' },
    { id: 'ny-a2-s-buying', text: 'Stand up if you are going to buy presents this week.', pic: 'present', follow: "I'm going to buy ___ for ___." },
    { id: 'ny-a2-s-snowman', text: 'Stand up if you made a snowman last winter.', pic: 'snowman', follow: 'I made it with ___.' }
  ]);
  add('zones', 'questions', 1, [
    { id: 'ny-a2-z-best-present', q: 'Best New Year present?', a1: 'a phone', p1: 'phone', a2: 'clothes', p2: 'T-shirt', a3: 'a book', p3: 'book', a4: 'money', p4: 'money' },
    { id: 'ny-a2-z-eve', q: "Best way to spend New Year's Eve?", a1: 'at home with family', p1: 'family', a2: 'at a party', p2: 'balloon', a3: 'outside, watching fireworks', p3: 'fireworks', a4: 'sleeping', p4: 'bed' },
    { id: 'ny-a2-z-winter', q: 'Best winter activity?', a1: 'making a snowman', p1: 'snowman', a2: 'drinking hot tea', p2: 'tea', a3: 'watching films', p3: 'TV', a4: 'playing games', p4: 'a-games' }
  ]);
  add('lie', 'questions', 1, [
    { id: 'ny-a2-q-got-present', text: 'Did you get a present last New Year?', pic: 'present' },
    { id: 'ny-a2-q-saw-fireworks', text: 'Did you see fireworks last New Year?', pic: 'fireworks' },
    { id: 'ny-a2-q-midnight', text: 'Did you stay up until midnight last New Year?', pic: 'clock' },
    { id: 'ny-a2-q-tree', text: 'Have you got a New Year tree at home?', pic: 'ny-tree' }
  ]);

  /* ---------- 2. Pre-Intermediate ---------- */
  add('bomb', 'cats', 2, [
    { id: 'ny-a2p-c-next-year', name: 'Things you want to do next year' },
    { id: 'ny-a2p-c-done-this-year', name: 'Things you have done this year' },
    { id: 'ny-a2p-c-teacher-present', name: 'Good New Year presents for a teacher' },
    { id: 'ny-a2p-c-traditions', name: 'New Year traditions in Uzbekistan' }
  ]);
  add('hotseat', 'words', 2, ['fireworks', 'midnight', 'present', 'New Year tree', 'countdown', 'party', 'holiday', 'wish', 'celebrate', 'Grandfather Frost'].map(function (w) { return { id: 'ny-a2p-h-' + w.replace(/\s+/g, '-').toLowerCase(), text: w }; }));
  add('tug', 'topics', 2, [
    { id: 'ny-a2p-t-party-vs-quiet', left: 'a big party', leftPic: 'balloon', right: 'a quiet night at home', rightPic: 'house' },
    { id: 'ny-a2p-t-real-vs-plastic', left: 'a real New Year tree', leftPic: 'ny-tree', right: 'a plastic New Year tree', rightPic: 'ny-tree' },
    { id: 'ny-a2p-t-money-vs-gift', left: 'money as a present', leftPic: 'money', right: 'a present you choose', rightPic: 'present' }
  ]);
  add('standup', 'sentences', 2, [
    { id: 'ny-a2p-s-bought', text: 'Stand up if you have already bought New Year presents.', pic: 'present', follow: 'I have bought ___ for ___.' },
    { id: 'ny-a2p-s-other-city', text: 'Stand up if you have ever celebrated New Year in another city.', pic: 'city', follow: 'I celebrated in ___.' },
    { id: 'ny-a2p-s-midnight', text: 'Stand up if you are going to stay up until midnight.', pic: 'clock', follow: "At midnight I'm going to ___." },
    { id: 'ny-a2p-s-wish', text: 'Stand up if you have already made a New Year wish.', pic: 'star', follow: 'My wish is ___.' }
  ]);
  add('zones', 'questions', 2, [
    { id: 'ny-a2p-z-tradition', q: 'Best New Year tradition?', a1: 'fireworks', p1: 'fireworks', a2: 'a family dinner', p2: 'family', a3: 'presents', p3: 'present', a4: 'watching TV', p4: 'TV' },
    { id: 'ny-a2p-z-next-year', q: 'Next year, I want to...', a1: 'learn something new', p1: 'book', a2: 'travel', p2: 'plane', a3: 'do more sport', p3: 'football', a4: 'make new friends', p4: 'family' },
    { id: 'ny-a2p-z-present', q: 'Best New Year present?', a1: 'a trip', p1: 'plane', a2: 'clothes', p2: 'T-shirt', a3: 'a gadget', p3: 'phone', a4: 'money', p4: 'money' }
  ]);
  add('lie', 'questions', 2, [
    { id: 'ny-a2p-q-outside', text: 'Have you ever celebrated New Year outside?', pic: 'fireworks' },
    { id: 'ny-a2p-q-snowman', text: 'Have you ever made a snowman?', pic: 'snowman' },
    { id: 'ny-a2p-q-bought', text: 'Have you bought any presents this year?', pic: 'present' },
    { id: 'ny-a2p-q-travel', text: 'Are you going to travel this winter?', pic: 'plane' }
  ]);

  /* ---------- 3. Intermediate ---------- */
  add('bomb', 'cats', 3, [
    { id: 'ny-b1-c-lottery', name: 'What you would do if you won a New Year lottery' },
    { id: 'ny-b1-c-family-traditions', name: 'New Year traditions in your family' },
    { id: 'ny-b1-c-promises', name: 'Things people promise to do in the new year' },
    { id: 'ny-b1-c-used-to-believe', name: 'Things you used to believe about New Year as a child' }
  ]);
  add('hotseat', 'words', 3, ['New Year resolution', 'fireworks', 'countdown', 'midnight', 'celebration', 'tradition', 'Grandfather Frost', "New Year's Eve", 'wrapping paper', 'winter holiday'].map(function (w) { return { id: 'ny-b1-h-' + w.replace(/[^a-z]+/gi, '-').toLowerCase(), text: w }; }));
  add('tug', 'topics', 3, [
    { id: 'ny-b1-t-family-vs-friends', left: 'celebrating with family', leftPic: 'family', right: 'celebrating with friends', rightPic: 'balloon' },
    { id: 'ny-b1-t-resolutions-vs-moment', left: 'making New Year resolutions', leftPic: 'book', right: 'just enjoying the moment', rightPic: 'fireworks' },
    { id: 'ny-b1-t-expensive-vs-handmade', left: 'expensive presents', leftPic: 'money', right: 'handmade presents', rightPic: 'present' }
  ]);
  add('standup', 'sentences', 3, [
    { id: 'ny-b1-s-used-to-believe', text: 'Stand up if you used to believe in Grandfather Frost.', pic: 'present', follow: 'I used to think ___.' },
    { id: 'ny-b1-s-beach', text: 'Stand up if you would rather celebrate New Year on a beach.', pic: 'beach', follow: "I'd rather ___ because ___." },
    { id: 'ny-b1-s-kept-resolution', text: 'Stand up if you have ever kept a New Year resolution.', pic: 'book', follow: 'My resolution was ___.' },
    { id: 'ny-b1-s-decided', text: "Stand up if you have already decided what to do on New Year's Eve.", pic: 'clock', follow: "I'm going to ___." }
  ]);
  add('zones', 'questions', 3, [
    { id: 'ny-b1-z-important', q: 'Most important part of New Year?', a1: 'family', p1: 'family', a2: 'food', p2: 'cake', a3: 'presents', p3: 'present', a4: 'the countdown', p4: 'clock' },
    { id: 'ny-b1-z-resolution', q: 'Best New Year resolution?', a1: 'learn a language', p1: 'book', a2: 'exercise more', p2: 'football', a3: 'save money', p3: 'money', a4: 'spend less time online', p4: 'phone' },
    { id: 'ny-b1-z-where', q: 'If you could, where would you celebrate?', a1: 'in the mountains', p1: 'mountain', a2: 'on a beach', p2: 'beach', a3: 'in a big city', p3: 'city', a4: 'at home', p4: 'house' }
  ]);
  add('lie', 'questions', 3, [
    { id: 'ny-b1-q-awake', text: "Have you ever stayed awake all night on New Year's Eve?", pic: 'clock' },
    { id: 'ny-b1-q-used-to', text: 'Did you use to believe in Grandfather Frost?', pic: 'present' },
    { id: 'ny-b1-q-kept', text: 'Have you ever kept a New Year resolution for a whole year?', pic: 'book' },
    { id: 'ny-b1-q-abroad', text: 'Would you like to celebrate New Year in another country?', pic: 'plane' }
  ]);
})();
