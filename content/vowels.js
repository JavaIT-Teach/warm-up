/* Warm Up: content for LOST VOWELS (writing). Words from the taught units lose their vowels (a, e, i, o, u):
   "_nt_rt__nm_nt". Students write the whole words on paper before the time runs out; then the vowels drop back in
   one word at a time and students check their spelling.
   Built from the taught lessons in the Lesson Plan Builder (weekly job, 2026-11-21).
   words[level]: { id, word, clue, pic, unit }
     word = the word or short phrase (letters and spaces). clue = a short help line under it (empty = none).
     pic  = picture (Beginner and Elementary: shows the meaning). unit = the taught unit (teacher screen).
   Up to "words per round" (Screen text & timing) words are picked for each round.
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
(function () {
  function W(prefix, unit, list) {
    return list.map(function (x) { return { id: prefix + x[0].toLowerCase().replace(/[^a-z]+/g, '-'), word: x[0], clue: x[1] || '', pic: x[2] || '', unit: unit }; });
  }
  WU.content.vowels = [
    /* ---------- 0. Beginner (A1): Unit 9 Feeling Good, Unit 10 Things We Do, Unit 11 My Digital Life (Part 1) ---------- */
    { words: [].concat(
      W('a1-lv-', 'Unit 9 · Feeling Good', [
        ['tennis', 'play ___', 'tennis'], ['basketball', 'play ___', 'basketball'], ['swimming', 'go ___', 'a-swim'],
        ['dancing', 'go ___', 'a-dance'], ['running', 'go ___', 'a-run'], ['vegetables', "They're good for you.", 'carrot'],
        ['oranges', "They're good for you.", 'orange'], ['water', "It's good for you.", 'water'], ['chocolate', "It isn't good for you.", 'chocolate']
      ]),
      W('a1-lv-', 'Unit 10 · Things We Do', [
        ['Wednesday', 'Monday, Tuesday, ___', ''], ['Thursday', 'Wednesday, ___, Friday', ''], ['Saturday', 'Friday, ___, Sunday', ''],
        ['walk the dog', 'a job at home', 'dog'], ['feed the cat', 'a job at home', 'cat'], ['cook dinner', 'a job at home', 'a-cook'],
        ['make your bed', 'a job at home', 'bed'], ['clean the bath', 'a job at home', 'bath'], ['kitchen', 'You cook here.', 'fridge']
      ]),
      W('a1-lv-', 'Unit 11 · My Digital Life', [
        ['always', 'every day', ''], ['never', 'not one day', ''], ['sometimes', 'not always, not never', ''],
        ['song', 'You sing it.', 'a-sing'], ['band', 'They play music.', 'guitar'], ['famous', 'Everybody knows him.', 'star'],
        ['concert', 'Music! Lots of people!', 'microphone'], ['TV show', 'You watch it.', 'TV']
      ])
    ) },
    /* ---------- 1. Elementary (A2): Unit 8 Favourite Places, Unit 9 Clothes and Fashion, Unit 10 Buying Things ---------- */
    { words: [].concat(
      W('a2-lv-', 'Unit 8 · Favourite Places', [
        ['cushion', 'Soft. You put it on a sofa or a bed.', ''], ['curtains', 'You close them at night.', 'window'], ['lamp', 'It gives light.', 'lamp'],
        ['mirror', 'You look at yourself in it.', ''], ['bookshelf', 'You put your books on it.', 'book'], ['blanket', 'It keeps you warm in bed.', 'bed'],
        ['armchair', 'A big soft chair', 'chair'], ['furniture', 'beds, chairs, tables...', 'sofa']
      ]),
      W('a2-lv-', 'Unit 9 · Clothes and Fashion', [
        ['jumper', 'Warm. Made of wool.', ''], ['sunglasses', 'You wear them when it is sunny.', 'glasses'], ['trainers', 'Shoes for sport', 'shoes'],
        ['gloves', 'You wear them on your hands.', 'gloves'], ['scarf', 'You wear it round your neck.', 'scarf'], ['swimming costume', 'You wear it in the pool.', ''],
        ['cotton', 'a material: T-shirts are made of it', 'T-shirt'], ['leather', 'a material: boots are made of it', 'boots'], ['plastic', 'a material: bottles are made of it', 'bottle']
      ]),
      W('a2-lv-', 'Unit 10 · Buying Things', [
        ['receipt', 'The paper you get when you pay', ''], ['discount', 'A lower price', ''], ['wallet', 'You keep money in it.', 'wallet'],
        ['purse', 'A small bag for money', ''], ['cash', 'Notes and coins', 'money'], ['price', 'How much is it?', ''],
        ['entrepreneur', 'Someone who starts their own business', ''], ['online', 'You buy it on the internet.', 'computer']
      ])
    ) },
    /* ---------- 2. Pre-Intermediate (A2+): Unit 10 Taste This!, Unit 11 A Healthy Future, Unit 12 Incredible Wildlife ---------- */
    { words: [].concat(
      W('a2p-lv-', 'Unit 10 · Taste This!', [
        ['delicious', 'It tastes really good.'], ['disgusting', 'It tastes really bad.'], ['pineapple', 'a big, sweet, juicy fruit'],
        ['vegetarian', "Someone who doesn't eat meat"], ['recipe', 'It tells you how to cook something.'], ['sour', 'like lemon juice'],
        ['bitter', 'like black coffee'], ['frozen', 'very cold, like ice']
      ]),
      W('a2p-lv-', 'Unit 11 · A Healthy Future', [
        ['shoulder', 'between your neck and your arm'], ['forehead', 'above your eyes'], ['ankle', 'between your leg and your foot'],
        ['elbow', 'in the middle of your arm'], ['throat', 'Food goes down it.'], ['toothache', 'Your tooth hurts.'],
        ['cough', 'a noise when you are ill'], ['exhausted', 'very, very tired'], ['injure', 'hurt (your leg, your arm...)']
      ]),
      W('a2p-lv-', 'Unit 12 · Incredible Wildlife', [
        ['mosquito', 'a small insect that bites'], ['butterfly', 'an insect with beautiful wings'], ['eagle', 'a big bird'],
        ['donkey', 'like a small horse'], ['harmless', "It can't hurt you."], ['poison', 'It can kill you.'],
        ['species', 'a type of animal or plant'], ['definitely', '100% sure'], ['probably', 'about 80% sure']
      ])
    ) },
    /* ---------- 3. Intermediate (B1): Unit 10 Animals in Danger, Unit 11 Off to School, Unit 12 Getting Around ---------- */
    { words: [].concat(
      W('b1-lv-', 'Unit 10 · Animals in Danger', [
        ['environment', 'the natural world around us'], ['endangered', 'in danger of disappearing'], ['habitat', 'the natural home of an animal'],
        ['creatures', 'living things, like animals'], ['rainforest', 'a tropical forest with a lot of rain'], ['population', 'how many live in a place'],
        ['survive', 'stay alive'], ['tropical', 'hot and wet, like Sumatra']
      ]),
      W('b1-lv-', 'Unit 11 · Off to School', [
        ['qualifications', 'You get them when you pass exams.'], ['education', 'learning at school and university'], ['undergraduate', 'a university student'],
        ['boarding school', 'You live and study there.'], ['secondary school', 'after primary school'], ['headteacher', 'the boss of a school'],
        ['timetable', 'It shows when your lessons are.'], ['attend', 'go to (a school, a lesson)'], ['ordinary', 'normal, not special']
      ]),
      W('b1-lv-', 'Unit 12 · Getting Around', [
        ['abroad', 'in another country'], ['youth hostel', 'a cheap place to stay for young people'], ['airline', 'a company that flies planes'],
        ['unpack', 'take things out of your suitcase'], ['cruise ship', 'a big ship like a hotel'], ['passport', 'You need it to travel to another country.'],
        ['on purpose', 'not by accident'], ['set off', 'start a journey']
      ])
    ) },
    /* ---------- 4.-6. IELTS: no groups at these levels yet ---------- */
    { words: [] },
    { words: [] },
    { words: [] }
  ];
})();
/* Screen text & timing, per level. */
WU.content.vowelsScreen = {
  shared: {
    id: 'vowels-screen',
    tag: 'LOST VOWELS', ready: 'The vowels are gone! Write the whole words.', vowels: 'A  E  I  O  U', sample: '',
    rule: 'Write the words on paper: 1, 2, 3...', perRound: 6, writeSec: 90, clues: true, pics: false,
    check: 'Check your spelling!', point: '1 point for every word with perfect spelling.', count: 'Count your points!',
    demo: 'TEACHER DEMO: we do number 1 together!', demoShow: false
  },
  levels: [
    { perRound: 6, writeSec: 120, pics: true, demoShow: true, sample: '_nt_rt__nm_nt  →  entertainment' },
    { perRound: 6, writeSec: 100, pics: true, sample: 'c_rp_t  →  carpet' },
    { perRound: 6, writeSec: 90, sample: 'c_rry  →  curry' },
    { perRound: 8, writeSec: 90, sample: 'j_ngl_  →  jungle' },
    { perRound: 8, writeSec: 75 },
    { perRound: 8, writeSec: 60 },
    { perRound: 8, writeSec: 60 }
  ]
};
