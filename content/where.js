/* Warm Up: content for HIDE & SEEK CAT (grammar game G4, Beginner to Intermediate). Generated with a permanent id on every item.
   movers[level]: { id, pic, word }: the animal or toy that hides. word comes from the picture library unless the teacher types it.
   The places (in, on, under...) and their words are in Screen text & timing, per level.
   id is PERMANENT: never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.where = [
  /* 0. Beginner (A1) */
  {
    movers: [
      { id: "a1-ws-cat", pic: "cat" },
      { id: "a1-ws-dog", pic: "dog" },
      { id: "a1-ws-mouse", pic: "mouse" },
      { id: "a1-ws-rabbit", pic: "rabbit" },
      { id: "a1-ws-ball", pic: "ball" },
      { id: "a1-ws-duck", pic: "duck" }
    ]
  },
  /* 1. Elementary (A2) */
  {
    movers: [
      { id: "a2-ws-cat", pic: "cat" },
      { id: "a2-ws-dog", pic: "dog" },
      { id: "a2-ws-mouse", pic: "mouse" },
      { id: "a2-ws-rabbit", pic: "rabbit" },
      { id: "a2-ws-ball", pic: "ball" },
      { id: "a2-ws-duck", pic: "duck" },
      { id: "a2-ws-frog", pic: "frog" },
      { id: "a2-ws-teddy-bear", pic: "teddy bear" }
    ]
  },
  /* 2. Pre-Intermediate (A2+) */
  {
    movers: [
      { id: "p-ws-cat", pic: "cat" },
      { id: "p-ws-dog", pic: "dog" },
      { id: "p-ws-mouse", pic: "mouse" },
      { id: "p-ws-rabbit", pic: "rabbit" },
      { id: "p-ws-frog", pic: "frog" },
      { id: "p-ws-duck", pic: "duck" },
      { id: "p-ws-robot", pic: "robot" },
      { id: "p-ws-teddy-bear", pic: "teddy bear" },
      { id: "p-ws-ball", pic: "ball" }
    ]
  },
  /* 3. Intermediate (B1) */
  {
    movers: [
      { id: "i-ws-cat", pic: "cat" },
      { id: "i-ws-dog", pic: "dog" },
      { id: "i-ws-mouse", pic: "mouse" },
      { id: "i-ws-rabbit", pic: "rabbit" },
      { id: "i-ws-frog", pic: "frog" },
      { id: "i-ws-duck", pic: "duck" },
      { id: "i-ws-robot", pic: "robot" },
      { id: "i-ws-teddy-bear", pic: "teddy bear" },
      { id: "i-ws-ball", pic: "ball" },
      { id: "i-ws-monkey", pic: "monkey" }
    ]
  },
  /* 4. IELTS 1 (B2) */
  { movers: [] },
  /* 5. IELTS 2 (6.0) */
  { movers: [] },
  /* 6. IELTS 3 (7.0+) */
  { movers: [] }
];
/* Screen text & timing, per level. u_* = use this place at this level, w_* = its words, r_* = the thing it hides at. */
WU.content.whereScreen = {
  shared: {
    id: 'where-screen',
    tag: 'HIDE & SEEK', ask: 'Where is the {thing}?', askMove: 'Where is the {thing} going?',
    place: 'The {thing} is {prep} {ref}.', move: 'The {thing} is going {prep} {ref}.',
    who: '{name}, where is it?', rule: 'Look! Then say where it is.', ruleShow: true, seconds: 0,
    w_in: 'in', w_on: 'on', w_under: 'under', w_next: 'next to', w_behind: 'behind', w_front: 'in front of', w_between: 'between', w_above: 'above',
    w_into: 'into', w_outof: 'out of', w_over: 'over', w_around: 'around', w_past: 'past', w_towards: 'towards', w_away: 'away from',
    w_across: 'across', w_through: 'through', w_up: 'up', w_down: 'down',
    u_in: true, u_on: true, u_under: true, u_next: true, u_behind: true, u_front: true, u_between: true, u_above: true,
    u_into: true, u_outof: true, u_over: true, u_around: true, u_past: true, u_towards: true, u_away: true, u_across: true, u_through: true, u_up: true, u_down: true,
    r_box: 'the box', r_table: 'the table', r_boxes: 'the two boxes', r_tree: 'the tree', r_house: 'the house', r_road: 'the road', r_tunnel: 'the tunnel', r_hill: 'the hill',
    demo: 'TEACHER DEMO: watch and listen!', demoShow: false
  },
  levels: [
    { u_behind: false, u_front: false, u_between: false, u_above: false, u_into: false, u_outof: false, u_over: false, u_around: false, u_past: false, u_towards: false, u_away: false, u_across: false, u_through: false, u_up: false, u_down: false, demoShow: true },
    { u_above: false, u_into: false, u_outof: false, u_over: false, u_around: false, u_past: false, u_towards: false, u_away: false, u_across: false, u_through: false, u_up: false, u_down: false },
    { u_around: false, u_past: false, u_towards: false, u_away: false, u_across: false, u_through: false, u_up: false, u_down: false, rule: 'Still or moving? Say where it is, or where it is going.' },
    { askMove: 'Where did the {thing} go?', move: 'The {thing} went {prep} {ref}.', who: '{name}, what happened?', rule: 'Watch it move. Then say where it went.', seconds: 0 },
    {}, {}, {}
  ]
};
