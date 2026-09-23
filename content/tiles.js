/* Warm Up: content for MYSTERY TILES. Generated with a permanent id on every item.
   tileScenes: built-in scenes drawn from library pictures. bg = background, items = [picture, x %, y % (centre), width %].
   tiles[level].pictures: { id, text, art, pic, scene, reveal, grid }
     text + art = the answer ("a" + "picnic"). pic = one library picture or an upload (replaces the scene).
     reveal = the sentence shown at the end. grid = tiles per side (0 = the level's size).
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.tileScenes = {
  picnic: { name: "A picnic", bg: "park", items: [["tree",18,40,34],["family",52,62,34],["sandwich",80,82,14],["apple",91,70,9],["sun",86,14,16]] },
  beach: { name: "The beach", bg: "beach", items: [["sun",15,15,18],["boat",72,44,20],["sister",45,74,26],["ball",20,84,14],["umbrella",78,76,22]] },
  birthday: { name: "A birthday party", bg: "room", items: [["balloon",15,26,16],["balloon",55,20,14],["family",74,56,30],["cake",40,74,24],["present",14,82,16]] },
  rainy: { name: "A rainy day", bg: "rain", items: [["cloud",25,14,26],["rain",70,16,24],["umbrella",46,46,28],["sister",46,72,24],["bus",84,76,24]] },
  snowman: { name: "A snowman", bg: "snow", items: [["snow",50,13,20],["snowman",30,62,34],["brother",68,70,26],["tree",90,48,20]] },
  cooking: { name: "Cooking", bg: "kitchen", items: [["chef",28,54,40],["pan",70,72,22],["egg",88,64,10],["kettle",72,44,16]] },
  farm: { name: "A farm", bg: "farm", items: [["sun",86,14,16],["farmer",20,60,30],["cow",55,68,28],["chicken",80,56,12],["pig",86,82,18]] },
  football: { name: "A football game", bg: "park", items: [["sun",12,14,14],["tree",90,40,20],["brother",28,62,28],["sister",70,62,28],["football",50,84,12]] },
  breakfast: { name: "Breakfast", bg: "kitchen", items: [["clock",80,18,16],["table",50,80,56],["egg",34,62,12],["bread",50,60,16],["milk",66,60,12]] },
  night: { name: "Night", bg: "night", items: [["moon",80,16,18],["star",20,12,8],["star",42,24,6],["star",60,10,7],["tree",30,60,40],["owl",30,50,14],["house",76,72,26]] },
  zoo: { name: "The zoo", bg: "park", items: [["giraffe",84,46,28],["elephant",52,62,32],["lion",18,72,24],["monkey",22,24,14]] },
  undersea: { name: "Under the sea", bg: "sea", items: [["whale",35,34,36],["fish",76,24,14],["fish",70,58,12],["octopus",24,78,22],["turtle",74,82,20]] },
  concert: { name: "A concert", bg: "stage", items: [["star",14,14,10],["star",86,12,10],["singer",50,48,30],["guitar",18,60,22],["drum",82,66,22],["family",50,90,26]] },
  fire: { name: "A fire", bg: "city", items: [["cloud",72,14,18],["house",30,56,34],["fire",30,40,22],["firefighter",64,66,28],["truck",86,82,24]] },
  lesson: { name: "A lesson", bg: "room", items: [["clock",80,16,14],["teacher",18,55,28],["brother",70,60,22],["sister",90,62,18],["desk",54,80,30],["book",48,66,10],["pencil",62,66,8]] },
  airport: { name: "An airport", bg: "city", items: [["plane",60,20,40],["pilot",20,64,26],["family",68,66,28],["bag",44,82,14],["taxi",90,86,16]] },
  hospital: { name: "A hospital", bg: "room", items: [["clock",50,14,12],["doctor",22,55,30],["nurse",48,58,24],["bed",74,80,36],["grandfather",76,60,24]] },
  shopping: { name: "Shopping", bg: "city", items: [["shop",30,46,40],["mother",70,62,28],["bag",84,80,14],["money",60,84,12],["car",12,84,18]] },
  camping: { name: "Camping", bg: "night", items: [["moon",86,14,14],["mountain",68,48,50],["tree",14,54,30],["fire",46,78,18],["brother",26,80,20],["father",68,80,22]] },
  storm: { name: "A storm", bg: "rain", items: [["storm",28,15,28],["wind",72,18,22],["house",26,64,32],["tree",70,62,34],["car",88,86,16]] },
  garden: { name: "A garden", bg: "park", items: [["sun",86,14,16],["butterfly",60,38,14],["bee",30,54,10],["grandmother",72,64,30],["flower",20,80,14],["flower",36,84,12]] },
  traffic: { name: "A traffic jam", bg: "city", items: [["police officer",76,46,22],["bus",24,72,30],["bike",52,64,14],["car",60,84,20],["taxi",86,78,18]] },
  building: { name: "A building site", bg: "city", items: [["sun",10,12,12],["house",64,52,34],["builder",24,62,28],["truck",84,82,22],["box",44,84,12]] },
  island: { name: "An island", bg: "beach", items: [["sun",85,14,16],["island",40,48,40],["boat",80,52,18],["fish",26,84,10],["whale",68,82,18]] },
  festival: { name: "A festival", bg: "park", items: [["kite",70,14,12],["star",50,10,8],["balloon",12,18,12],["balloon",88,16,12],["singer",50,40,22],["drum",25,48,16],["guitar",75,46,16],["family",30,78,26],["hot dog",62,84,12],["ice cream",78,80,10]] },
  street: { name: "A busy street", bg: "city", items: [["clock",20,18,12],["cloud",80,12,16],["shop",60,40,30],["mother",38,60,16],["police officer",88,58,18],["bus",20,72,26],["bike",78,78,14],["taxi",55,86,16]] },
  kitchenchaos: { name: "A kitchen disaster", bg: "kitchen", items: [["clock",80,18,12],["chef",20,52,28],["kettle",38,72,12],["pan",52,72,14],["fire",52,60,10],["egg",66,76,8],["cake",80,72,16],["cat",90,88,12]] },
  beachday: { name: "A day at the beach", bg: "beach", items: [["sun",12,12,14],["kite",40,20,12],["bird",60,18,8],["boat",70,44,16],["whale",90,50,14],["umbrella",20,70,20],["family",45,74,20],["ball",64,84,10],["ice cream",78,78,8]] },
  crazylesson: { name: "A crazy lesson", bg: "room", items: [["clock",50,14,12],["ball",70,36,10],["teacher",14,54,24],["robot",44,58,20],["brother",80,60,20],["desk",58,86,28],["book",54,74,10],["pencil",66,76,8],["cat",28,86,12]] },
  rescue: { name: "A rescue", bg: "rain", items: [["wind",12,15,12],["storm",86,12,16],["helicopter",42,20,24],["pilot",16,42,14],["boat",64,62,22],["whale",24,80,24],["fish",80,86,10]] },
  farmmorning: { name: "A farm in the morning", bg: "farm", items: [["sun",80,12,14],["tree",12,40,18],["horse",86,56,18],["farmer",18,62,20],["cow",45,66,20],["sheep",70,72,16],["chicken",30,86,8],["duck",58,88,8]] },
  space: { name: "A trip to space", bg: "space", items: [["star",10,12,6],["star",55,10,6],["star",92,58,6],["moon",75,25,22],["rocket",30,45,28],["pilot",68,70,18],["robot",86,82,16]] }
};

WU.content.tiles = [
  /* ---------- 0. Beginner (A1) ---------- */
  { pictures: [
      { id: "a1-p-cat", pic: "cat" },
      { id: "a1-p-dog", pic: "dog" },
      { id: "a1-p-apple", pic: "apple" },
      { id: "a1-p-banana", pic: "banana" },
      { id: "a1-p-car", pic: "car" },
      { id: "a1-p-bus", pic: "bus" },
      { id: "a1-p-ball", pic: "ball" },
      { id: "a1-p-book", pic: "book" },
      { id: "a1-p-house", pic: "house" },
      { id: "a1-p-sun", pic: "sun" },
      { id: "a1-p-fish", pic: "fish" },
      { id: "a1-p-bird", pic: "bird" },
      { id: "a1-p-cake", pic: "cake" },
      { id: "a1-p-pizza", pic: "pizza" },
      { id: "a1-p-hat", pic: "hat" },
      { id: "a1-p-shoes", pic: "shoes" },
      { id: "a1-p-elephant", pic: "elephant" },
      { id: "a1-p-lion", pic: "lion" },
      { id: "a1-p-flower", pic: "flower" },
      { id: "a1-p-tree", pic: "tree" },
      { id: "a1-p-phone", pic: "phone" },
      { id: "a1-p-clock", pic: "clock" },
      { id: "a1-p-bike", pic: "bike" },
      { id: "a1-p-guitar", pic: "guitar" }
    ] },
  /* ---------- 1. Elementary (A2) ---------- */
  { pictures: [
      { id: "a2-p-picnic", text: "picnic", art: "a", scene: "picnic", reveal: "A family is having a picnic in the park." },
      { id: "a2-p-beach", text: "beach", art: "the", scene: "beach", reveal: "A girl is playing on the beach." },
      { id: "a2-p-birthday", text: "birthday party", art: "a", scene: "birthday", reveal: "It's a birthday party. There is a big cake." },
      { id: "a2-p-rainy", text: "rainy day", art: "a", scene: "rainy", reveal: "It's raining. A girl has an umbrella." },
      { id: "a2-p-snowman", text: "snowman", art: "a", scene: "snowman", reveal: "A boy is making a snowman." },
      { id: "a2-p-cooking", text: "cooking", scene: "cooking", reveal: "A chef is cooking eggs." },
      { id: "a2-p-farm", text: "farm", art: "a", scene: "farm", reveal: "A farmer is with his animals." },
      { id: "a2-p-football", text: "football game", art: "a", scene: "football", reveal: "Two children are playing football." },
      { id: "a2-p-breakfast", text: "breakfast", scene: "breakfast", reveal: "It's breakfast time. There's bread, an egg and milk." },
      { id: "a2-p-night", text: "night", scene: "night", reveal: "It's night. An owl is in a tree." },
      { id: "a2-p-zoo", text: "zoo", art: "the", scene: "zoo", reveal: "There are animals at the zoo." },
      { id: "a2-p-undersea", text: "sea", art: "the", scene: "undersea", reveal: "There are animals under the sea." }
    ] },
  /* ---------- 2. Pre-Intermediate (A2+) ---------- */
  { pictures: [
      { id: "a2p-p-farm", text: "farm", art: "a", scene: "farm", reveal: "A farmer is with his animals." },
      { id: "a2p-p-football", text: "football game", art: "a", scene: "football", reveal: "Two children are playing football." },
      { id: "a2p-p-breakfast", text: "breakfast", scene: "breakfast", reveal: "It's breakfast time. There's bread, an egg and milk." },
      { id: "a2p-p-night", text: "night", scene: "night", reveal: "It's night. An owl is in a tree." },
      { id: "a2p-p-zoo", text: "zoo", art: "the", scene: "zoo", reveal: "There are animals at the zoo." },
      { id: "a2p-p-undersea", text: "sea", art: "the", scene: "undersea", reveal: "There are animals under the sea." },
      { id: "a2p-p-concert", text: "concert", art: "a", scene: "concert", reveal: "A singer is singing at a concert." },
      { id: "a2p-p-fire", text: "fire", art: "a", scene: "fire", reveal: "A firefighter is putting out a fire." },
      { id: "a2p-p-lesson", text: "lesson", art: "a", scene: "lesson", reveal: "A teacher is teaching a lesson." },
      { id: "a2p-p-airport", text: "airport", art: "an", scene: "airport", reveal: "People are going on holiday by plane." },
      { id: "a2p-p-hospital", text: "hospital", art: "a", scene: "hospital", reveal: "A doctor and a nurse are helping an old man." },
      { id: "a2p-p-shopping", text: "shopping", scene: "shopping", reveal: "A woman is shopping." }
    ] },
  /* ---------- 3. Intermediate (B1) ---------- */
  { pictures: [
      { id: "b1-p-concert", text: "concert", art: "a", scene: "concert", reveal: "A singer is performing with a band while the audience watches." },
      { id: "b1-p-fire", text: "fire", art: "a", scene: "fire", reveal: "A house is on fire and a firefighter has arrived to put it out." },
      { id: "b1-p-lesson", text: "lesson", art: "a", scene: "lesson", reveal: "A teacher is explaining something while two students listen." },
      { id: "b1-p-airport", text: "airport", art: "an", scene: "airport", reveal: "A family is about to fly on holiday and the pilot is ready." },
      { id: "b1-p-hospital", text: "hospital", art: "a", scene: "hospital", reveal: "An old man is in hospital and a doctor and a nurse are looking after him." },
      { id: "b1-p-shopping", text: "shopping", scene: "shopping", reveal: "A woman has just bought something and is paying for it." },
      { id: "b1-p-camping", text: "camping", scene: "camping", reveal: "A father and son are camping in the mountains and sitting by a fire." },
      { id: "b1-p-storm", text: "storm", art: "a", scene: "storm", reveal: "A strong storm is hitting the town, and the tree might fall on the car." },
      { id: "b1-p-garden", text: "garden", art: "a", scene: "garden", reveal: "A grandmother is looking after her flowers while bees and butterflies fly around." },
      { id: "b1-p-traffic", text: "traffic jam", art: "a", scene: "traffic", reveal: "The city is full of traffic and a police officer is trying to help." },
      { id: "b1-p-building", text: "building site", art: "a", scene: "building", reveal: "A builder is working on a new house while the truck brings materials." },
      { id: "b1-p-island", text: "island", art: "an", scene: "island", reveal: "A boat is sailing towards a small island and a whale is swimming nearby." }
    ] },
  /* ---------- 4. IELTS 1 (B2) ---------- */
  { pictures: [
      { id: "i1-p-camping", text: "camping", scene: "camping", reveal: "A father and son are camping in the mountains and sitting by a fire." },
      { id: "i1-p-storm", text: "storm", art: "a", scene: "storm", reveal: "A strong storm is hitting the town, and the tree might fall on the car." },
      { id: "i1-p-garden", text: "garden", art: "a", scene: "garden", reveal: "A grandmother is looking after her flowers while bees and butterflies fly around." },
      { id: "i1-p-traffic", text: "traffic jam", art: "a", scene: "traffic", reveal: "The city is full of traffic and a police officer is trying to help." },
      { id: "i1-p-building", text: "building site", art: "a", scene: "building", reveal: "A builder is working on a new house while the truck brings materials." },
      { id: "i1-p-island", text: "island", art: "an", scene: "island", reveal: "A boat is sailing towards a small island and a whale is swimming nearby." },
      { id: "i1-p-festival", text: "festival", art: "a", scene: "festival", reveal: "A band is playing at an outdoor festival while families eat and enjoy the music." },
      { id: "i1-p-street", text: "busy street", art: "a", scene: "street", reveal: "It is rush hour: a police officer is managing a busy street full of traffic and shoppers." },
      { id: "i1-p-kitchenchaos", text: "kitchen disaster", art: "a", scene: "kitchenchaos", reveal: "A chef is cooking, but the pan has caught fire and a cat is next to the cake." },
      { id: "i1-p-beachday", text: "day at the beach", art: "a", scene: "beachday", reveal: "A family is relaxing at the beach while a whale appears near a boat." },
      { id: "i1-p-crazylesson", text: "crazy lesson", art: "a", scene: "crazylesson", reveal: "In the middle of a lesson, a robot has appeared and nobody is listening to the teacher." },
      { id: "i1-p-rescue", text: "rescue", art: "a", scene: "rescue", reveal: "A helicopter is trying to rescue a boat caught in a storm at sea." }
    ] },
  /* ---------- 5. IELTS 2 (band 6.0) ---------- */
  { pictures: [
      { id: "i2-p-festival", text: "festival", art: "a", scene: "festival", reveal: "A band is playing at an outdoor festival while families eat and enjoy the music." },
      { id: "i2-p-street", text: "busy street", art: "a", scene: "street", reveal: "It is rush hour: a police officer is managing a busy street full of traffic and shoppers." },
      { id: "i2-p-kitchenchaos", text: "kitchen disaster", art: "a", scene: "kitchenchaos", reveal: "A chef is cooking, but the pan has caught fire and a cat is next to the cake." },
      { id: "i2-p-beachday", text: "day at the beach", art: "a", scene: "beachday", reveal: "A family is relaxing at the beach while a whale appears near a boat." },
      { id: "i2-p-crazylesson", text: "crazy lesson", art: "a", scene: "crazylesson", reveal: "In the middle of a lesson, a robot has appeared and nobody is listening to the teacher." },
      { id: "i2-p-rescue", text: "rescue", art: "a", scene: "rescue", reveal: "A helicopter is trying to rescue a boat caught in a storm at sea." },
      { id: "i2-p-farmmorning", text: "farm in the morning", art: "a", scene: "farmmorning", reveal: "Early in the morning, the farmer is starting the day with all the animals." },
      { id: "i2-p-space", text: "trip to space", art: "a", scene: "space", reveal: "A pilot and a robot have landed near the moon after a long trip in a rocket." },
      { id: "i2-p-storm", text: "storm", art: "a", scene: "storm", reveal: "A strong storm is hitting the town, and the tree might fall on the car." },
      { id: "i2-p-traffic", text: "traffic jam", art: "a", scene: "traffic", reveal: "The city is full of traffic and a police officer is trying to help." }
    ] },
  /* ---------- 6. IELTS 3 (band 7.0+) ---------- */
  { pictures: [
      { id: "i3-p-festival", text: "festival", art: "a", scene: "festival", reveal: "A band is playing at an outdoor festival while families eat and enjoy the music." },
      { id: "i3-p-street", text: "busy street", art: "a", scene: "street", reveal: "It is rush hour: a police officer is managing a busy street full of traffic and shoppers." },
      { id: "i3-p-kitchenchaos", text: "kitchen disaster", art: "a", scene: "kitchenchaos", reveal: "A chef is cooking, but the pan has caught fire and a cat is next to the cake." },
      { id: "i3-p-beachday", text: "day at the beach", art: "a", scene: "beachday", reveal: "A family is relaxing at the beach while a whale appears near a boat." },
      { id: "i3-p-crazylesson", text: "crazy lesson", art: "a", scene: "crazylesson", reveal: "In the middle of a lesson, a robot has appeared and nobody is listening to the teacher." },
      { id: "i3-p-rescue", text: "rescue", art: "a", scene: "rescue", reveal: "A helicopter is trying to rescue a boat caught in a storm at sea." },
      { id: "i3-p-farmmorning", text: "farm in the morning", art: "a", scene: "farmmorning", reveal: "Early in the morning, the farmer is starting the day with all the animals." },
      { id: "i3-p-space", text: "trip to space", art: "a", scene: "space", reveal: "A pilot and a robot have landed near the moon after a long trip in a rocket." },
      { id: "i3-p-fire", text: "fire", art: "a", scene: "fire", reveal: "A house is on fire and a firefighter has arrived to put it out." },
      { id: "i3-p-camping", text: "camping", scene: "camping", reveal: "A father and son are camping in the mountains and sitting by a fire." }
    ] }
];

/* Screen text for Mystery Tiles, per level. Editable in Edit mode. Empty text hides a line. {team}, {n} are filled in. */
WU.content.tilesScreen = {
  shared: {
    id: 'tiles-screen',
    tag: 'MYSTERY PICTURE', grid: 4,
    rule: 'Ask yes / no questions. Good question = one tile.', ruleShow: true,
    askFrame: '', guessRule: 'Guess any time!', guessShow: true,
    turn: '{team}: ask a question!', used: 'Tiles used: {n}', usedEnd: 'You guessed it with {n} tiles!',
    award: 'Which team guessed it? Press 1-4', points: '+{n} points!', revealFrame: '',
    demo: 'TEACHER DEMO: I ask first!', demoShow: false
  },
  levels: [
    { grid: 3, rule: 'Ask: yes or no?', askFrame: 'Is it a ___? Is it ___ (colour)?', guessRule: 'One word is OK! Pointing is OK!', revealFrame: "It's ___!", demoShow: true },
    { grid: 4, askFrame: 'Is there a ___? Is it ___?' },
    { grid: 4, askFrame: 'Is there a ___? Are they ___ing?' },
    { grid: 5, guessRule: 'To guess, say what is happening.' },
    { grid: 5, guessRule: 'To guess, say what is happening and why.' },
    { grid: 6, guessRule: 'To guess, describe the scene and tell its story.' },
    { grid: 6, guessRule: 'To guess, describe the scene and tell its story: before, now, next.' }
  ]
};
