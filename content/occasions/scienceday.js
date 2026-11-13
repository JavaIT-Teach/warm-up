/* Warm Up: WORLD SCIENCE DAY themed content (occasion id 'scienceday', see content/themes.js). Live the week of Nov 10.
   Adds items with theme: 'scienceday' to the games' lists, per level (0 = Beginner, 1 = Elementary, 2 = Pre-Intermediate,
   3 = Intermediate). Same item formats and permanent-id rules as each game's own content file.
   Language: taught material + theme words (science, scientist, experiment, planet, discover, invent, robot, space). */
(function () {
  var T = 'scienceday', C = WU.content;
  function add(game, list, level, items) { items.forEach(function (it) { it.theme = T; C[game][level][list].push(it); }); }
  function words(prefix, list) { return list.map(function (w) { return { id: prefix + w.replace(/[^a-z]+/gi, '-').toLowerCase(), text: w }; }); }

  /* ---------- 0. Beginner ---------- */
  add('bomb', 'cats', 0, [
    { id: 'sc-a1-c-things', name: 'Science things', tag: 'scienceday', icon: 'microscope', frame: "It's ___." },
    { id: 'sc-a1-c-sky', name: 'In the sky', tag: 'sky', icon: 'planet', frame: "It's ___." },
    { id: 'sc-a1-c-weather', name: 'Weather', tag: 'weather', icon: 'rainbow', frame: "It's ___." },
    { id: 'sc-a1-c-transport', name: 'Things that move', tag: 'transport', icon: 'rocket', frame: "It's ___." }
  ]);
  add('hotseat', 'words', 0, ['rocket', 'robot', 'planet', 'microscope', 'computer', 'moon', 'sun', 'star', 'rainbow', 'lamp'].map(function (p) { return { id: 'sc-a1-h-' + p, pic: p }; }));
  add('tug', 'topics', 0, [
    { id: 'sc-a1-t-sun-vs-moon', left: 'the sun', leftPic: 'sun', right: 'the moon', rightPic: 'moon' },
    { id: 'sc-a1-t-robot-vs-computer', left: 'robots', leftPic: 'robot', right: 'computers', rightPic: 'computer' },
    { id: 'sc-a1-t-rocket-vs-plane', left: 'rockets', leftPic: 'rocket', right: 'planes', rightPic: 'plane' }
  ]);
  add('standup', 'sentences', 0, [
    { id: 'sc-a1-s-like-science', text: 'Stand up if you like science.', pic: 'microscope', follow: 'I like ___.' },
    { id: 'sc-a1-s-have-computer', text: 'Stand up if you have a computer.', pic: 'computer', follow: 'My computer is ___.' },
    { id: 'sc-a1-s-like-robots', text: 'Stand up if you like robots.', pic: 'robot', follow: 'I like ___.' },
    { id: 'sc-a1-s-like-stars', text: 'Stand up if you like the stars.', pic: 'star', follow: 'I like ___.' }
  ]);
  add('zones', 'questions', 0, [
    { id: 'sc-a1-z-favourite-sky', q: 'Favourite thing in the sky?', a1: 'the sun', p1: 'sun', a2: 'the moon', p2: 'moon', a3: 'stars', p3: 'star', a4: 'a rainbow', p4: 'rainbow' },
    { id: 'sc-a1-z-want', q: 'I want a...', a1: 'robot', p1: 'robot', a2: 'rocket', p2: 'rocket', a3: 'computer', p3: 'computer', a4: 'phone', p4: 'phone' },
    { id: 'sc-a1-z-planet-colour', q: 'Best colour for a planet?', a1: 'blue', p1: 'c-blue', a2: 'red', p2: 'c-red', a3: 'green', p3: 'c-green', a4: 'yellow', p4: 'c-yellow' }
  ]);
  add('lie', 'questions', 0, [
    { id: 'sc-a1-q-like-science', text: 'Do you like science?', pic: 'microscope' },
    { id: 'sc-a1-q-have-computer', text: 'Do you have a computer?', pic: 'computer' },
    { id: 'sc-a1-q-like-robots', text: 'Do you like robots?', pic: 'robot' },
    { id: 'sc-a1-q-like-stars', text: 'Do you like the stars?', pic: 'star' }
  ]);

  /* ---------- 1. Elementary ---------- */
  add('bomb', 'cats', 1, [
    { id: 'sc-a2-c-school-subjects', name: 'School subjects' },
    { id: 'sc-a2-c-in-space', name: 'Things in space' },
    { id: 'sc-a2-c-technology', name: 'Technology at home' },
    { id: 'sc-a2-c-jobs', name: 'Jobs in science' }
  ]);
  add('hotseat', 'words', 1, words('sc-a2-h-', ['scientist', 'robot', 'planet', 'rocket', 'computer', 'experiment', 'space', 'moon', 'doctor', 'laboratory']));
  add('tug', 'topics', 1, [
    { id: 'sc-a2-t-science-vs-art', left: 'science lessons', leftPic: 'microscope', right: 'art lessons', rightPic: 'book' },
    { id: 'sc-a2-t-space-vs-sea', left: 'a trip to space', leftPic: 'rocket', right: 'a trip under the sea', rightPic: 'fish' },
    { id: 'sc-a2-t-robot-vs-pet', left: 'a robot at home', leftPic: 'robot', right: 'a pet at home', rightPic: 'dog' }
  ]);
  add('standup', 'sentences', 1, [
    { id: 'sc-a2-s-liked-science', text: 'Stand up if you liked science at school.', pic: 'microscope', follow: 'My favourite subject was ___.' },
    { id: 'sc-a2-s-watched-space', text: 'Stand up if you watched a film about space.', pic: 'rocket', follow: 'The film was ___.' },
    { id: 'sc-a2-s-used-computer', text: 'Stand up if you used a computer yesterday.', pic: 'computer', follow: 'I used it for ___.' },
    { id: 'sc-a2-s-saw-moon', text: 'Stand up if you saw the moon last night.', pic: 'moon', follow: 'It was ___.' }
  ]);
  add('zones', 'questions', 1, [
    { id: 'sc-a2-z-best-subject', q: 'Best school subject?', a1: 'science', p1: 'microscope', a2: 'maths', p2: 'computer', a3: 'English', p3: 'book', a4: 'sport', p4: 'football' },
    { id: 'sc-a2-z-visit', q: 'Which would you like to visit?', a1: 'the moon', p1: 'moon', a2: 'Mars', p2: 'planet', a3: 'the bottom of the sea', p3: 'fish', a4: 'a science museum', p4: 'microscope' },
    { id: 'sc-a2-z-cant-live', q: "I can't live without my...", a1: 'phone', p1: 'phone', a2: 'computer', p2: 'computer', a3: 'TV', p3: 'TV', a4: 'lamp', p4: 'lamp' }
  ]);
  add('lie', 'questions', 1, [
    { id: 'sc-a2-q-liked-science', text: 'Did you like science at school?', pic: 'microscope' },
    { id: 'sc-a2-q-museum', text: 'Did you go to a museum last year?', pic: 'book' },
    { id: 'sc-a2-q-moon', text: 'Did you see the moon last night?', pic: 'moon' },
    { id: 'sc-a2-q-robot', text: 'Have you got a robot toy?', pic: 'robot' }
  ]);

  /* ---------- 2. Pre-Intermediate ---------- */
  add('bomb', 'cats', 2, [
    { id: 'sc-a2p-c-inventions', name: 'Inventions you use every day' },
    { id: 'sc-a2p-c-famous', name: 'Famous scientists and inventors' },
    { id: 'sc-a2p-c-future', name: 'Things robots will do in the future' },
    { id: 'sc-a2p-c-never-tried', name: "Technology you have never tried" }
  ]);
  add('hotseat', 'words', 2, words('sc-a2p-h-', ['inventor', 'experiment', 'astronaut', 'planet', 'laboratory', 'robot', 'telescope', 'discover', 'invention', 'electricity']));
  add('tug', 'topics', 2, [
    { id: 'sc-a2p-t-phone-vs-computer', left: 'the phone', leftPic: 'phone', right: 'the computer', rightPic: 'computer', frame: '___ is the best invention because ___.' },
    { id: 'sc-a2p-t-space-vs-earth', left: 'spending money on space', leftPic: 'rocket', right: 'spending money on Earth', rightPic: 'tree' },
    { id: 'sc-a2p-t-robot-teacher', left: 'a robot teacher', leftPic: 'robot', right: 'a human teacher', rightPic: 'teacher' }
  ]);
  add('standup', 'sentences', 2, [
    { id: 'sc-a2p-s-been-museum', text: 'Stand up if you have ever been to a science museum.', pic: 'microscope', follow: 'I went to ___.' },
    { id: 'sc-a2p-s-made-experiment', text: 'Stand up if you have ever done an experiment at home.', pic: 'fire', follow: 'I tried to ___.' },
    { id: 'sc-a2p-s-will-space', text: 'Stand up if you think people will live on Mars.', pic: 'planet', follow: 'I think people will ___.' },
    { id: 'sc-a2p-s-used-ai', text: 'Stand up if you have used AI this week.', pic: 'computer', follow: 'I used it to ___.' }
  ]);
  add('zones', 'questions', 2, [
    { id: 'sc-a2p-z-best-invention', q: 'Best invention ever?', a1: 'the phone', p1: 'phone', a2: 'the plane', p2: 'plane', a3: 'electricity', p3: 'lamp', a4: 'the internet', p4: 'computer' },
    { id: 'sc-a2p-z-job', q: 'Which science job would you choose?', a1: 'astronaut', p1: 'rocket', a2: 'doctor', p2: 'doctor', a3: 'robot engineer', p3: 'robot', a4: 'scientist in a lab', p4: 'microscope' },
    { id: 'sc-a2p-z-future', q: 'In 50 years, people will...', a1: 'live on Mars', p1: 'planet', a2: 'have robot helpers', p2: 'robot', a3: 'drive flying cars', p3: 'car', a4: 'live longer', p4: 'heart' }
  ]);
  add('lie', 'questions', 2, [
    { id: 'sc-a2p-q-been-museum', text: 'Have you ever been to a science museum?', pic: 'microscope' },
    { id: 'sc-a2p-q-telescope', text: 'Have you ever looked through a telescope?', pic: 'star' },
    { id: 'sc-a2p-q-broken', text: 'Have you ever broken a phone or a computer?', pic: 'phone' },
    { id: 'sc-a2p-q-astronaut', text: 'Did you want to be an astronaut when you were a child?', pic: 'rocket' }
  ]);

  /* ---------- 3. Intermediate ---------- */
  add('bomb', 'cats', 3, [
    { id: 'sc-b1-c-invent', name: 'What you would invent if you were a scientist' },
    { id: 'sc-b1-c-changed', name: 'Inventions that have changed the world' },
    { id: 'sc-b1-c-used-to', name: 'Technology people used to have but don’t now' },
    { id: 'sc-b1-c-problems', name: 'Problems science should solve' }
  ]);
  add('hotseat', 'words', 3, words('sc-b1-h-', ['artificial intelligence', 'experiment', 'astronaut', 'discovery', 'laboratory', 'climate change', 'telescope', 'invention', 'research', 'space station']));
  add('tug', 'topics', 3, [
    { id: 'sc-b1-t-ai-help-vs-harm', left: 'AI will help people', leftPic: 'computer', right: 'AI will cause problems', rightPic: 'robot' },
    { id: 'sc-b1-t-space-vs-ocean', left: 'exploring space', leftPic: 'rocket', right: 'exploring the oceans', rightPic: 'fish' },
    { id: 'sc-b1-t-science-vs-arts', left: 'science is more important', leftPic: 'microscope', right: 'the arts are more important', rightPic: 'book' }
  ]);
  add('standup', 'sentences', 3, [
    { id: 'sc-b1-s-would-mars', text: 'Stand up if you would go to Mars if you could.', pic: 'planet', follow: 'If I went to Mars, I would ___.' },
    { id: 'sc-b1-s-used-to-hate', text: 'Stand up if you used to hate science at school.', pic: 'microscope', follow: 'I used to ___.' },
    { id: 'sc-b1-s-robot-job', text: 'Stand up if you think a robot could do your job.', pic: 'robot', follow: 'A robot could / couldn’t ___ because ___.' },
    { id: 'sc-b1-s-without-phone', text: 'Stand up if you have spent a whole day without your phone.', pic: 'phone', follow: 'It felt ___.' }
  ]);
  add('zones', 'questions', 3, [
    { id: 'sc-b1-z-most-important', q: 'Most important invention?', a1: 'the internet', p1: 'computer', a2: 'medicine', p2: 'doctor', a3: 'electricity', p3: 'lamp', a4: 'the plane', p4: 'plane' },
    { id: 'sc-b1-z-if-scientist', q: 'If you were a scientist, you would study...', a1: 'space', p1: 'rocket', a2: 'the human body', p2: 'heart', a3: 'animals', p3: 'dog', a4: 'robots and AI', p4: 'robot' },
    { id: 'sc-b1-z-worry', q: 'Which worries you most?', a1: 'climate change', p1: 'sun', a2: 'AI taking jobs', p2: 'robot', a3: 'too much screen time', p3: 'phone', a4: 'nothing', p4: 'heart' }
  ]);
  add('lie', 'questions', 3, [
    { id: 'sc-b1-q-mars', text: 'Would you live on Mars for a year?', pic: 'planet' },
    { id: 'sc-b1-q-used-to-astronaut', text: 'Did you use to want to be an astronaut?', pic: 'rocket' },
    { id: 'sc-b1-q-ai', text: 'Have you ever used AI to do your homework?', pic: 'computer' },
    { id: 'sc-b1-q-invented', text: 'Have you ever invented or built something yourself?', pic: 'robot' }
  ]);
})();
