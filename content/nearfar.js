/* Warm Up: content for NEAR & FAR (grammar game G3, Beginner to Pre-Intermediate). Generated with a permanent id on every item.
   things[level]: { id, pic, word, art, pl }. word, a / an and plural come from the picture library unless the teacher types them.
   id is PERMANENT: never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.nearfar = [
  /* 0. Beginner (A1) */
  {
    things: [
      { id: "a1-nf-cat", pic: "cat" },
      { id: "a1-nf-dog", pic: "dog" },
      { id: "a1-nf-bird", pic: "bird" },
      { id: "a1-nf-apple", pic: "apple" },
      { id: "a1-nf-banana", pic: "banana" },
      { id: "a1-nf-ball", pic: "ball" },
      { id: "a1-nf-book", pic: "book" },
      { id: "a1-nf-pen", pic: "pen" },
      { id: "a1-nf-bag", pic: "bag" },
      { id: "a1-nf-car", pic: "car" },
      { id: "a1-nf-bus", pic: "bus" },
      { id: "a1-nf-egg", pic: "egg" },
      { id: "a1-nf-chair", pic: "chair" },
      { id: "a1-nf-duck", pic: "duck" },
      { id: "a1-nf-fish", pic: "fish" },
      { id: "a1-nf-orange", pic: "orange" },
      { id: "a1-nf-cup", pic: "cup" },
      { id: "a1-nf-hat", pic: "hat" },
      { id: "a1-nf-umbrella", pic: "umbrella" },
      { id: "a1-nf-house", pic: "house" },
      { id: "a1-nf-tree", pic: "tree" },
      { id: "a1-nf-flower", pic: "flower" },
      { id: "a1-nf-key", pic: "key" },
      { id: "a1-nf-phone", pic: "phone" }
    ]
  },
  /* 1. Elementary (A2) */
  {
    things: [
      { id: "a2-nf-rabbit", pic: "rabbit" },
      { id: "a2-nf-horse", pic: "horse" },
      { id: "a2-nf-cow", pic: "cow" },
      { id: "a2-nf-sheep", pic: "sheep" },
      { id: "a2-nf-pear", pic: "pear" },
      { id: "a2-nf-strawberry", pic: "strawberry" },
      { id: "a2-nf-cake", pic: "cake" },
      { id: "a2-nf-sandwich", pic: "sandwich" },
      { id: "a2-nf-kite", pic: "kite" },
      { id: "a2-nf-pencil", pic: "pencil" },
      { id: "a2-nf-ruler", pic: "ruler" },
      { id: "a2-nf-watch", pic: "watch" },
      { id: "a2-nf-camera", pic: "camera" },
      { id: "a2-nf-bike", pic: "bike" },
      { id: "a2-nf-plane", pic: "plane" },
      { id: "a2-nf-boat", pic: "boat" },
      { id: "a2-nf-lamp", pic: "lamp" },
      { id: "a2-nf-clock", pic: "clock" },
      { id: "a2-nf-shoes", pic: "shoes" },
      { id: "a2-nf-balloon", pic: "balloon" },
      { id: "a2-nf-star", pic: "star" },
      { id: "a2-nf-cloud", pic: "cloud" }
    ]
  },
  /* 2. Pre-Intermediate (A2+) */
  {
    things: [
      { id: "p-nf-elephant", pic: "elephant" },
      { id: "p-nf-monkey", pic: "monkey" },
      { id: "p-nf-giraffe", pic: "giraffe" },
      { id: "p-nf-owl", pic: "owl" },
      { id: "p-nf-lemon", pic: "lemon" },
      { id: "p-nf-carrot", pic: "carrot" },
      { id: "p-nf-tomato", pic: "tomato" },
      { id: "p-nf-cookie", pic: "cookie" },
      { id: "p-nf-bottle", pic: "bottle" },
      { id: "p-nf-glasses", pic: "glasses" },
      { id: "p-nf-box", pic: "box" },
      { id: "p-nf-present", pic: "present" },
      { id: "p-nf-candle", pic: "candle" },
      { id: "p-nf-guitar", pic: "guitar" },
      { id: "p-nf-drum", pic: "drum" },
      { id: "p-nf-robot", pic: "robot" },
      { id: "p-nf-teddy-bear", pic: "teddy bear" },
      { id: "p-nf-truck", pic: "truck" },
      { id: "p-nf-helicopter", pic: "helicopter" },
      { id: "p-nf-rocket", pic: "rocket" },
      { id: "p-nf-mountain", pic: "mountain" }
    ]
  },
  /* 3. Intermediate (B1) */
  { things: [] },
  /* 4. IELTS 1 (B2) */
  { things: [] },
  /* 5. IELTS 2 (6.0) */
  { things: [] },
  /* 6. IELTS 3 (7.0+) */
  { things: [] }
];
/* Screen text & timing, per level. ___ = the thing ("a cat" / "cats"). */
WU.content.nearfarScreen = {
  shared: {
    id: 'nearfar-screen',
    tag: 'NEAR & FAR', nearTag: 'HERE', farTag: 'OVER THERE', zoneShow: true,
    one: 'This is ___.', many: 'These are ___.', oneFar: 'That is ___.', manyFar: 'Those are ___.', join: 'and',
    pairs: false, seconds: 0, manyChance: 50,
    who: '{name}, say it!', rule: 'Near or far? One or more? Say the sentence.', ruleShow: true,
    demo: 'TEACHER DEMO: listen first!', demoShow: false
  },
  levels: [
    { demoShow: true, manyChance: 40, rule: 'Near: this / these. Far: that / those.' },
    { seconds: 8 },
    { seconds: 8, pairs: true, rule: 'Two things! One sentence: This is ___ and that is ___.' },
    {}, {}, {}, {}
  ]
};
