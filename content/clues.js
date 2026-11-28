/* Warm Up: content for CLUE BY CLUE (reading + vocabulary). A word from the taught units hides behind five written
   clues, from vague to easy. The clues appear one by one; the fewer clues the class needs, the more points (5, 4, 3...).
   Built from the taught lessons in the Lesson Plan Builder (weekly job, 2026-11-28).
   cards[level]: { id, word, unit, pic, c1 ... c5 }
     word = the answer. pic = optional picture (library id), shown with the answer where the level shows pictures.
     c1 ... c5 = the clues, hardest first (empty = not used; at least 2). unit = the taught unit (tag).
   Clues use only words the group has been taught. id is PERMANENT: never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.clues = [
  /* ---------- 0. Beginner (A1): Unit 11 My Digital Life, Unit 12 Working Life ---------- */
  {
    cards: [
      { id: 'a1-cb-firefighter', word: 'firefighter', unit: 'Unit 12 · Working Life', pic: 'firefighter',
        c1: "It's a job.", c2: 'This person wears special clothes.', c3: 'This person often works at night.', c4: 'This person drives a big red lorry.', c5: 'This person helps when there is a fire.' },
      { id: 'a1-cb-farmer', word: 'farmer', unit: 'Unit 12 · Working Life', pic: 'farmer',
        c1: "It's a job.", c2: 'This person works outside.', c3: 'This person gets up very early.', c4: 'This person has cows and chickens.', c5: 'This person grows food.' },
      { id: 'a1-cb-journalist', word: 'journalist', unit: 'Unit 12 · Working Life', pic: '',
        c1: "It's a job.", c2: 'This person often uses a laptop.', c3: 'This person talks to a lot of people.', c4: 'This person works for a newspaper.', c5: 'This person writes news stories.' },
      { id: 'a1-cb-photographer', word: 'photographer', unit: 'Unit 12 · Working Life', pic: 'camera',
        c1: "It's a job.", c2: 'This person travels a lot.', c3: 'This person often works outside.', c4: 'This person always has a camera.', c5: 'This person takes pictures.' },
      { id: 'a1-cb-spoon', word: 'spoon', unit: 'Unit 12 · Working Life', pic: 'spoon',
        c1: "It's in a café.", c2: "It's on the table.", c3: "It's small.", c4: 'You put it in your tea.', c5: 'You eat soup with it.' },
      { id: 'a1-cb-smartphone', word: 'smartphone', unit: 'Unit 11 · My Digital Life', pic: 'phone',
        c1: "It's technology.", c2: "It's small.", c3: 'You can take photos with it.', c4: 'You can send texts with it.', c5: 'You can phone your family with it.' },
      { id: 'a1-cb-fitness-tracker', word: 'fitness tracker', unit: 'Unit 11 · My Digital Life', pic: 'watch',
        c1: "It's technology.", c2: "It's very small.", c3: 'You wear it every day.', c4: "It's good for sport.", c5: 'It counts your steps.' },
      { id: 'a1-cb-concert', word: 'concert', unit: 'Unit 11 · My Digital Life', pic: 'microphone',
        c1: "It's entertainment.", c2: 'There are a lot of people.', c3: 'Fans love it.', c4: 'A band plays songs.', c5: 'You go to it and see people making music.' }
    ]
  },
  /* ---------- 1. Elementary (A2): Unit 11 Eating Out, Unit 12 The Latest Technology (Part 1) ---------- */
  {
    cards: [
      { id: 'a2-cb-dessert', word: 'dessert', unit: 'Unit 11 · Eating Out', pic: 'cake',
        c1: "It's a word about food.", c2: 'You usually have it at the end of a meal.', c3: 'It comes after the main course.', c4: "It's often sweet.", c5: 'Ice cream and cake are examples.' },
      { id: 'a2-cb-lemonade', word: 'lemonade', unit: 'Unit 11 · Eating Out', pic: 'lemon',
        c1: "It's a drink.", c2: "It's a soft drink.", c3: "It's cold and sweet.", c4: "It's often yellow.", c5: 'People make it with lemons, water and sugar.' },
      { id: 'a2-cb-noodles', word: 'noodles', unit: 'Unit 11 · Eating Out', pic: 'noodles',
        c1: "It's food.", c2: 'You can buy it at a street food stall.', c3: "It's long and thin.", c4: 'People often eat it in China and Japan.', c5: 'You often eat it from a bowl.' },
      { id: 'a2-cb-strawberry', word: 'strawberry', unit: 'Unit 11 · Eating Out', pic: 'strawberry',
        c1: "It's food.", c2: "It's a fruit.", c3: "It's small and sweet.", c4: "It's red.", c5: 'People often eat it with cream.' },
      { id: 'a2-cb-printer', word: 'printer', unit: 'Unit 12 · The Latest Technology', pic: '',
        c1: "It's technology.", c2: "It's in an office or at home.", c3: 'It works with a computer.', c4: "It's bigger than a keyboard.", c5: 'It puts your work on paper.' },
      { id: 'a2-cb-headphones', word: 'headphones', unit: 'Unit 12 · The Latest Technology', pic: '',
        c1: "It's technology.", c2: 'You wear them on your head.', c3: 'They are quieter than a speaker.', c4: 'People use them on the bus.', c5: 'You listen to music with them.' },
      { id: 'a2-cb-keyboard', word: 'keyboard', unit: 'Unit 12 · The Latest Technology', pic: 'computer',
        c1: "It's technology.", c2: "It's part of a computer.", c3: 'It has a lot of letters.', c4: "It's next to the mouse.", c5: 'You type on it.' },
      { id: 'a2-cb-e-reader', word: 'e-reader', unit: 'Unit 12 · The Latest Technology', pic: 'book',
        c1: "It's technology.", c2: "It's smaller than a laptop.", c3: "It's lighter than a book.", c4: 'You can have hundreds of books in it.', c5: 'You read books on it.' }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+): Unit 13 Mixed Feelings, Unit 14 On Screen (Part 1) ---------- */
  {
    cards: [
      { id: 'a2p-cb-exhausted', word: 'exhausted', unit: 'Unit 13 · Mixed Feelings', pic: '',
        c1: "It's an adjective.", c2: "It's a feeling.", c3: 'You might feel like this after a long day.', c4: 'You feel like this after a lot of sport.', c5: 'It means very, very tired.' },
      { id: 'a2p-cb-grateful', word: 'grateful', unit: 'Unit 13 · Mixed Feelings', pic: '',
        c1: "It's an adjective.", c2: "It's a positive feeling.", c3: 'You feel it when someone helps you.', c4: "You often say 'thank you' when you feel it.", c5: 'It means feeling thanks.' },
      { id: 'a2p-cb-embarrassed', word: 'embarrassed', unit: 'Unit 13 · Mixed Feelings', pic: '',
        c1: "It's an adjective.", c2: "It's a feeling.", c3: 'Your face might go red.', c4: 'You feel like this after a silly mistake in front of people.', c5: 'You feel like this when everyone laughs at your mistake.' },
      { id: 'a2p-cb-documentary', word: 'documentary', unit: 'Unit 14 · On Screen', pic: '',
        c1: "It's a genre.", c2: "It's usually on TV.", c3: "It's about real people, animals or places.", c4: 'You can learn a lot from it.', c5: 'It gives information about a subject.' },
      { id: 'a2p-cb-soap-opera', word: 'soap opera', unit: 'Unit 14 · On Screen', pic: '',
        c1: "It's a TV genre.", c2: "It's on TV every day or every week.", c3: 'It often goes on for years.', c4: "The characters' lives are full of problems.", c5: "It's a TV drama about people's daily lives." },
      { id: 'a2p-cb-period-drama', word: 'period drama', unit: 'Unit 14 · On Screen', pic: '',
        c1: "It's a TV and film genre.", c2: 'The actors wear clothes from another time.', c3: "It's often about rich families.", c4: "It isn't about today.", c5: 'It takes place in the past.' },
      { id: 'a2p-cb-chat-show', word: 'chat show', unit: 'Unit 14 · On Screen', pic: '',
        c1: "It's a TV genre.", c2: "It's often on TV in the evening.", c3: 'Famous people come to it as guests.', c4: 'They sit on a sofa and talk.', c5: 'Someone interviews guests.' },
      { id: 'a2p-cb-put-off', word: 'put off', unit: 'Unit 13 · Mixed Feelings', pic: '',
        c1: "It's a phrasal verb.", c2: 'Lots of students do it with their homework.', c3: "People do it with things they don't want to do.", c4: 'I always ___ my homework until Sunday night.', c5: 'It means: decide to do something later.' },
      { id: 'a2p-cb-extra', word: 'extra', unit: 'Unit 14 · On Screen', pic: '',
        c1: "It's a person.", c2: 'You can see this person in films.', c3: "This person doesn't usually speak.", c4: 'You often see this person behind the main actors.', c5: "It's a person in a film who isn't a main actor." }
    ]
  },
  /* ---------- 3. Intermediate (B1): Unit 13 #NoFilter, Unit 14 Let's Cook! (Part 1) ---------- */
  {
    cards: [
      { id: 'b1-cb-tag', word: 'tag', unit: 'Unit 13 · #NoFilter', pic: '',
        c1: "It's a social media verb.", c2: 'You usually do it to a friend.', c3: "Your friend's name appears on your post.", c4: 'You use @ to do it.', c5: 'It means include someone with @ or their name.' },
      { id: 'b1-cb-block', word: 'block', unit: 'Unit 13 · #NoFilter', pic: '',
        c1: "It's a social media verb.", c2: 'You can do it on your phone or your computer.', c3: "After you do it, they can't send you messages.", c4: 'People do it when someone is rude to them online.', c5: 'It means stop someone seeing your page.' },
      { id: 'b1-cb-take-down', word: 'take down', unit: 'Unit 13 · #NoFilter', pic: '',
        c1: "It's a phrasal verb.", c2: "It's about social media.", c3: "You might do it when a friend doesn't like a photo of them.", c4: 'After you do it, the post disappears.', c5: 'It means remove something you posted.' },
      { id: 'b1-cb-airbrush', word: 'airbrush', unit: 'Unit 13 · #NoFilter', pic: '',
        c1: "It's a verb about photos.", c2: 'Magazines often do it.', c3: "It's done with digital editing software.", c4: 'It makes people look better than in reality.', c5: 'It means change a photo to make someone look better.' },
      { id: 'b1-cb-steam', word: 'steam', unit: "Unit 14 · Let's Cook!", pic: '',
        c1: "It's a cooking verb.", c2: "It's a healthy way to cook.", c3: 'Vegetables and rice can be cooked this way.', c4: "The food doesn't touch the water.", c5: 'It means cook something over boiling water.' },
      { id: 'b1-cb-roast', word: 'roast', unit: "Unit 14 · Let's Cook!", pic: '',
        c1: "It's a cooking verb.", c2: "It's done in the oven.", c3: 'Oil is usually added.', c4: 'Meat and potatoes are often cooked this way.', c5: "It isn't the same as bake: it's for meat, with oil." },
      { id: 'b1-cb-stove', word: 'stove', unit: "Unit 14 · Let's Cook!", pic: 'pan',
        c1: "It's a noun.", c2: "It's in the kitchen.", c3: 'It gets very hot.', c4: 'Pans are put on it.', c5: "It's what you cook on." },
      { id: 'b1-cb-in-advance', word: 'in advance', unit: 'Unit 13 · #NoFilter', pic: '',
        c1: "It's a phrase with in.", c2: "It's about time.", c3: 'Tickets are often bought this way.', c4: "It's a good idea for flights and concerts.", c5: 'It means before something happens.' },
      { id: 'b1-cb-employee', word: 'employee', unit: "Unit 14 · Let's Cook!", pic: '',
        c1: "It's a person.", c2: 'This person has a boss.', c3: 'This person is paid every month.', c4: 'This person works for a company.', c5: "It's someone who is paid to work for a person or company." }
    ]
  },
  /* ---------- 4-6. IELTS: not made for these levels ---------- */
  { cards: [] },
  { cards: [] },
  { cards: [] }
];
/* Screen text & timing, per level. */
WU.content.cluesScreen = {
  shared: {
    id: 'clues-screen',
    tag: 'CLUE BY CLUE', unitShow: true,
    task: 'What is it? Shout it out!', pts: 'POINTS',
    got: 'GOT IT!', nobody: 'The answer is...',
    write: 'Now write it! Check your spelling.', writeShow: true,
    pics: false,
    demo: 'TEACHER DEMO: together!', demoShow: false
  },
  levels: [
    { pics: true, demoShow: true },
    { pics: true },
    {},
    {},
    {},
    {},
    {}
  ]
};
