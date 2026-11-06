/* Warm Up: content for FLASH ROOM (grammar game G2, Beginner to Intermediate). Generated with a permanent id on every item.
   things[level]: { id, pic, word, pl }. word and plural come from the picture library unless the teacher types them.
   Use things you can count (a cat, three cats). id is PERMANENT: never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.flash = [
  /* 0. Beginner (A1) */
  {
    things: [
      { id: "a1-fl-cat", pic: "cat" },
      { id: "a1-fl-dog", pic: "dog" },
      { id: "a1-fl-apple", pic: "apple" },
      { id: "a1-fl-banana", pic: "banana" },
      { id: "a1-fl-ball", pic: "ball" },
      { id: "a1-fl-book", pic: "book" },
      { id: "a1-fl-pen", pic: "pen" },
      { id: "a1-fl-bag", pic: "bag" },
      { id: "a1-fl-car", pic: "car" },
      { id: "a1-fl-bus", pic: "bus" },
      { id: "a1-fl-egg", pic: "egg" },
      { id: "a1-fl-chair", pic: "chair" },
      { id: "a1-fl-duck", pic: "duck" },
      { id: "a1-fl-fish", pic: "fish" },
      { id: "a1-fl-bird", pic: "bird" },
      { id: "a1-fl-orange", pic: "orange" },
      { id: "a1-fl-cup", pic: "cup" },
      { id: "a1-fl-clock", pic: "clock" },
      { id: "a1-fl-hat", pic: "hat" },
      { id: "a1-fl-umbrella", pic: "umbrella" }
    ]
  },
  /* 1. Elementary (A2) */
  {
    things: [
      { id: "a2-fl-cat", pic: "cat" },
      { id: "a2-fl-dog", pic: "dog" },
      { id: "a2-fl-rabbit", pic: "rabbit" },
      { id: "a2-fl-apple", pic: "apple" },
      { id: "a2-fl-banana", pic: "banana" },
      { id: "a2-fl-pear", pic: "pear" },
      { id: "a2-fl-cake", pic: "cake" },
      { id: "a2-fl-sandwich", pic: "sandwich" },
      { id: "a2-fl-ball", pic: "ball" },
      { id: "a2-fl-kite", pic: "kite" },
      { id: "a2-fl-book", pic: "book" },
      { id: "a2-fl-pencil", pic: "pencil" },
      { id: "a2-fl-phone", pic: "phone" },
      { id: "a2-fl-key", pic: "key" },
      { id: "a2-fl-cup", pic: "cup" },
      { id: "a2-fl-plate", pic: "plate" },
      { id: "a2-fl-chair", pic: "chair" },
      { id: "a2-fl-lamp", pic: "lamp" },
      { id: "a2-fl-bike", pic: "bike" },
      { id: "a2-fl-car", pic: "car" },
      { id: "a2-fl-hat", pic: "hat" }
    ]
  },
  /* 2. Pre-Intermediate (A2+) */
  {
    things: [
      { id: "p-fl-elephant", pic: "elephant" },
      { id: "p-fl-monkey", pic: "monkey" },
      { id: "p-fl-bird", pic: "bird" },
      { id: "p-fl-duck", pic: "duck" },
      { id: "p-fl-apple", pic: "apple" },
      { id: "p-fl-strawberry", pic: "strawberry" },
      { id: "p-fl-carrot", pic: "carrot" },
      { id: "p-fl-tomato", pic: "tomato" },
      { id: "p-fl-egg", pic: "egg" },
      { id: "p-fl-cookie", pic: "cookie" },
      { id: "p-fl-bottle", pic: "bottle" },
      { id: "p-fl-cup", pic: "cup" },
      { id: "p-fl-plate", pic: "plate" },
      { id: "p-fl-spoon", pic: "spoon" },
      { id: "p-fl-fork", pic: "fork" },
      { id: "p-fl-knife", pic: "knife" },
      { id: "p-fl-book", pic: "book" },
      { id: "p-fl-ruler", pic: "ruler" },
      { id: "p-fl-camera", pic: "camera" },
      { id: "p-fl-watch", pic: "watch" },
      { id: "p-fl-balloon", pic: "balloon" },
      { id: "p-fl-candle", pic: "candle" }
    ]
  },
  /* 3. Intermediate (B1) */
  {
    things: [
      { id: "i-fl-mouse", pic: "mouse" },
      { id: "i-fl-frog", pic: "frog" },
      { id: "i-fl-bee", pic: "bee" },
      { id: "i-fl-butterfly", pic: "butterfly" },
      { id: "i-fl-cherry", pic: "cherry" },
      { id: "i-fl-lemon", pic: "lemon" },
      { id: "i-fl-mushroom", pic: "mushroom" },
      { id: "i-fl-potato", pic: "potato" },
      { id: "i-fl-onion", pic: "onion" },
      { id: "i-fl-cookie", pic: "cookie" },
      { id: "i-fl-bottle", pic: "bottle" },
      { id: "i-fl-glasses", pic: "glasses" },
      { id: "i-fl-key", pic: "key" },
      { id: "i-fl-watch", pic: "watch" },
      { id: "i-fl-camera", pic: "camera" },
      { id: "i-fl-candle", pic: "candle" },
      { id: "i-fl-present", pic: "present" },
      { id: "i-fl-balloon", pic: "balloon" },
      { id: "i-fl-scissors", pic: "scissors" },
      { id: "i-fl-guitar", pic: "guitar" },
      { id: "i-fl-drum", pic: "drum" },
      { id: "i-fl-robot", pic: "robot" }
    ]
  },
  /* 4. IELTS 1 (B2) */
  { things: [] },
  /* 5. IELTS 2 (6.0) */
  { things: [] },
  /* 6. IELTS 3 (7.0+) */
  { things: [] }
];
/* Screen text & timing, per level. ___ = the thing ("an apple" / "three apples"). Present at Beginner and Elementary, past from Pre-Intermediate. */
WU.content.flashScreen = {
  shared: {
    id: 'flash-screen',
    tag: 'FLASH ROOM', ready: 'Look carefully! You have {n} seconds.', look: 'LOOK!', hidden: 'What was in the room?',
    items: 5, most: 4, seconds: 8, nums: 'two, three, four, five, six',
    one: 'There was ___.', many: 'There were ___.', frame: 'There was ___. / There were ___.',
    who: '{name}, tell us one thing!', rule: 'One sentence each. Then Space shows the next thing.', ruleShow: true,
    quizShow: true, quiz: 3, quizTag: 'QUICK QUESTIONS',
    qOne: 'Was there ___?', qMany: 'Were there any ___?',
    yesOne: 'Yes, there was.', noOne: "No, there wasn't.", yesMany: 'Yes, there were.', noMany: "No, there weren't.",
    demo: 'TEACHER DEMO: I go first!', demoShow: false
  },
  levels: [
    { items: 3, most: 3, seconds: 10, hidden: 'What is in the room?', one: 'There is ___.', many: 'There are ___.', frame: 'There is ___. / There are ___.',
      qOne: 'Is there ___?', qMany: 'Are there any ___?', yesOne: 'Yes, there is.', noOne: "No, there isn't.", yesMany: 'Yes, there are.', noMany: "No, there aren't.",
      quiz: 2, demoShow: true, rule: 'Say one thing. Then Space shows it.' },
    { items: 4, most: 4, seconds: 8, hidden: 'What is in the room?', one: 'There is ___.', many: 'There are ___.', frame: 'There is ___. / There are ___.',
      qOne: 'Is there ___?', qMany: 'Are there any ___?', yesOne: 'Yes, there is.', noOne: "No, there isn't.", yesMany: 'Yes, there are.', noMany: "No, there aren't." },
    { items: 5, most: 4, seconds: 8 },
    { items: 6, most: 5, seconds: 7 },
    {}, {}, {}
  ]
};
