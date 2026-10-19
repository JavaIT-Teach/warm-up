/* Warm Up: content for TEACHER SAYS. Generated with a permanent id on every item.
   commands[level]: { id, text, pic }. Only Beginner and Elementary: the game is greyed out for the other levels.
   Commands stay at the student's seat or next to it: no dancing, no acting out.
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.says = [
  /* ---------- 0. Beginner (A1) ---------- */
  {
    commands: [
      { id: "a1-c-touch-your-nose", text: "Touch your nose.", pic: "nose" },
      { id: "a1-c-touch-your-ears", text: "Touch your ears.", pic: "ear" },
      { id: "a1-c-clap-your-hands", text: "Clap your hands.", pic: "hand" },
      { id: "a1-c-stand-on-one-leg", text: "Stand on one leg.", pic: "leg" },
      { id: "a1-c-sit-down", text: "Sit down.", pic: "chair" },
      { id: "a1-c-stand-up", text: "Stand up.", pic: "a-jump" },
      { id: "a1-c-jump", text: "Jump.", pic: "a-jump" },
      { id: "a1-c-point-to-the-door", text: "Point to the door.", pic: "door" },
      { id: "a1-c-point-to-the-window", text: "Point to the window.", pic: "window" },
      { id: "a1-c-touch-your-head", text: "Touch your head.", pic: "face" },
      { id: "a1-c-show-me-your-pen", text: "Show me your pen.", pic: "pen" },
      { id: "a1-c-show-me-your-book", text: "Show me your book.", pic: "book" },
      { id: "a1-c-touch-something-red", text: "Touch something red.", pic: "c-red" },
      { id: "a1-c-touch-something-blue", text: "Touch something blue.", pic: "c-blue" },
      { id: "a1-c-open-your-mouth", text: "Open your mouth.", pic: "mouth" },
      { id: "a1-c-close-your-eyes", text: "Close your eyes.", pic: "eye" },
      { id: "a1-c-wave-your-hand", text: "Wave your hand.", pic: "hand" },
      { id: "a1-c-touch-your-foot", text: "Touch your foot.", pic: "foot" },
      { id: "a1-c-turn-around", text: "Turn around.", pic: "clock" },
      { id: "a1-c-point-to-the-board", text: "Point to the board.", pic: "teacher" },
      { id: "a1-c-touch-your-chair", text: "Touch your chair.", pic: "chair" },
      { id: "a1-c-show-me-your-bag", text: "Show me your bag.", pic: "bag" },
      { id: "a1-c-touch-your-arm", text: "Touch your arm.", pic: "arm" },
      { id: "a1-c-smile", text: "Smile.", pic: "face" }
    ]
  },
  /* ---------- 1. Elementary (A2) ---------- */
  {
    commands: [
      { id: "a2-c-touch-your-left-ear", text: "Touch your left ear.", pic: "ear" },
      { id: "a2-c-point-to-something-green", text: "Point to something green.", pic: "c-green" },
      { id: "a2-c-clap-three-times", text: "Clap three times.", pic: "hand" },
      { id: "a2-c-put-your-hands-on-your-head", text: "Put your hands on your head.", pic: "hand" },
      { id: "a2-c-stand-next-to-your-chair", text: "Stand next to your chair.", pic: "chair" },
      { id: "a2-c-touch-your-right-knee", text: "Touch your right knee.", pic: "leg" },
      { id: "a2-c-point-to-the-ceiling", text: "Point to the ceiling.", pic: "lamp" },
      { id: "a2-c-hold-up-two-fingers", text: "Hold up two fingers.", pic: "hand" },
      { id: "a2-c-walk-to-the-door-and-come", text: "Walk to the door and come back.", pic: "door" },
      { id: "a2-c-touch-something-made-of-wood", text: "Touch something made of wood.", pic: "table" },
      { id: "a2-c-shake-hands-with-your-neighbour", text: "Shake hands with your neighbour.", pic: "hand" },
      { id: "a2-c-put-your-pen-on-your-book", text: "Put your pen on your book.", pic: "pen" },
      { id: "a2-c-turn-around-twice", text: "Turn around twice.", pic: "clock" },
      { id: "a2-c-touch-your-shoulders", text: "Touch your shoulders.", pic: "arm" },
      { id: "a2-c-point-to-someone-with-glasses", text: "Point to someone with glasses.", pic: "glasses" },
      { id: "a2-c-show-me-something-yellow", text: "Show me something yellow.", pic: "c-yellow" },
      { id: "a2-c-stand-behind-your-chair", text: "Stand behind your chair.", pic: "chair" },
      { id: "a2-c-touch-the-floor", text: "Touch the floor.", pic: "foot" },
      { id: "a2-c-pretend-to-drink-water", text: "Pretend to drink water.", pic: "water" },
      { id: "a2-c-write-your-name-in-the-air", text: "Write your name in the air.", pic: "a-write" },
      { id: "a2-c-hop-three-times", text: "Hop three times.", pic: "a-jump" },
      { id: "a2-c-point-to-the-clock", text: "Point to the clock.", pic: "clock" },
      { id: "a2-c-close-one-eye", text: "Close one eye.", pic: "eye" },
      { id: "a2-c-hold-your-bag-above-your-head", text: "Hold your bag above your head.", pic: "bag" }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+) ---------- */
  {
    commands: [
    ]
  },
  /* ---------- 3. Intermediate (B1) ---------- */
  {
    commands: [
    ]
  },
  /* ---------- 4. IELTS 1 (B2) ---------- */
  {
    commands: [
    ]
  },
  /* ---------- 5. IELTS 2 (6.0) ---------- */
  {
    commands: [
    ]
  },
  /* ---------- 6. IELTS 3 (7.0+) ---------- */
  {
    commands: [
    ]
  }
];
/* Screen text & timing, per level (Pre-Intermediate and up are greyed out on the home screen). */
WU.content.saysScreen = {
  shared: {
    id: 'says-screen',
    tag: 'TEACHER SAYS', says: 'Teacher says:', chance: 70, ready: 'Everybody stand up!',
    rule: 'Do it ONLY if you hear "Teacher says"!', ruleShow: true,
    wrong: 'Oops! You moved. You are now a CALLER.', caller: 'CALLER: read it to the class!', callers: 'Callers: {n}',
    autoSeconds: 0,
    demo: 'TEACHER DEMO: listen and watch!', demoShow: false
  },
  levels: [
    { demoShow: true, chance: 75 },
    { chance: 65, autoSeconds: 0 },
    {}, {}, {}, {}, {}
  ]
};
