/* Warm Up: content for WORD HUNT (reading). A letter grid hides words from the last lessons; the class reads the clues,
   finds the words and shows where they are. Built from the taught lessons in the Lesson Plan Builder (weekly job, 2026-11-15).
   sets[level]  : { id, name }  one puzzle per set (N = next set). name is shown above the clues.
   words[level] : { id, set, word, clue, pic }
     set  = the id of its set. word = the hidden word (letters only are used in the grid; max the grid size).
     clue = what the class reads (from Elementary). pic = picture (Beginner shows the word + picture).
   Up to "words per puzzle" (Screen text & timing) words are picked at random from a set for each new grid.
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.hunt = [
  /* ---------- 0. Beginner (A1): Unit 7 My Day, Unit 8 At School, Unit 9 Feeling Good ---------- */
  {
    sets: [
      { id: "a1-wh-set-sports", name: "Unit 9 · Sports" },
      { id: "a1-wh-set-health", name: "Unit 9 · Good for you?" },
      { id: "a1-wh-set-subjects", name: "Unit 8 · School subjects" },
      { id: "a1-wh-set-day", name: "Unit 7 · My day" }
    ],
    words: [
      { id: "a1-wh-tennis", set: "a1-wh-set-sports", word: "tennis", clue: "play ___", pic: "tennis" },
      { id: "a1-wh-football", set: "a1-wh-set-sports", word: "football", clue: "play ___", pic: "football" },
      { id: "a1-wh-basketball", set: "a1-wh-set-sports", word: "basketball", clue: "play ___", pic: "basketball" },
      { id: "a1-wh-hockey", set: "a1-wh-set-sports", word: "hockey", clue: "play ___", pic: "" },
      { id: "a1-wh-baseball", set: "a1-wh-set-sports", word: "baseball", clue: "play ___", pic: "" },
      { id: "a1-wh-swimming", set: "a1-wh-set-sports", word: "swimming", clue: "go ___", pic: "a-swim" },
      { id: "a1-wh-running", set: "a1-wh-set-sports", word: "running", clue: "go ___", pic: "a-run" },
      { id: "a1-wh-dancing", set: "a1-wh-set-sports", word: "dancing", clue: "go ___", pic: "a-dance" },
      { id: "a1-wh-badminton", set: "a1-wh-set-sports", word: "badminton", clue: "play ___", pic: "" },
      { id: "a1-wh-bread", set: "a1-wh-set-health", word: "bread", clue: "It's good for you.", pic: "bread" },
      { id: "a1-wh-oranges", set: "a1-wh-set-health", word: "oranges", clue: "They're good for you.", pic: "orange" },
      { id: "a1-wh-water", set: "a1-wh-set-health", word: "water", clue: "It's good for you.", pic: "water" },
      { id: "a1-wh-vegetables", set: "a1-wh-set-health", word: "vegetables", clue: "They're good for you.", pic: "carrot" },
      { id: "a1-wh-cake", set: "a1-wh-set-health", word: "cake", clue: "It isn't good for you.", pic: "cake" },
      { id: "a1-wh-chocolate", set: "a1-wh-set-health", word: "chocolate", clue: "It isn't good for you.", pic: "chocolate" },
      { id: "a1-wh-butter", set: "a1-wh-set-health", word: "butter", clue: "It isn't good for you.", pic: "" },
      { id: "a1-wh-biscuits", set: "a1-wh-set-health", word: "biscuits", clue: "They aren't good for you.", pic: "cookie" },
      { id: "a1-wh-art", set: "a1-wh-set-subjects", word: "art", clue: "a school subject: you draw", pic: "a-draw" },
      { id: "a1-wh-english", set: "a1-wh-set-subjects", word: "English", clue: "a school subject: you speak it now!", pic: "book" },
      { id: "a1-wh-french", set: "a1-wh-set-subjects", word: "French", clue: "a school subject: Bonjour!", pic: "" },
      { id: "a1-wh-history", set: "a1-wh-set-subjects", word: "history", clue: "a school subject: kings and queens", pic: "king" },
      { id: "a1-wh-maths", set: "a1-wh-set-subjects", word: "maths", clue: "a school subject: 2 + 2 = 4", pic: "" },
      { id: "a1-wh-music", set: "a1-wh-set-subjects", word: "music", clue: "a school subject: you sing", pic: "guitar" },
      { id: "a1-wh-science", set: "a1-wh-set-subjects", word: "science", clue: "a school subject", pic: "microscope" },
      { id: "a1-wh-geography", set: "a1-wh-set-subjects", word: "geography", clue: "a school subject: countries", pic: "mountain" },
      { id: "a1-wh-breakfast", set: "a1-wh-set-day", word: "breakfast", clue: "have ___ in the morning", pic: "egg" },
      { id: "a1-wh-lunch", set: "a1-wh-set-day", word: "lunch", clue: "have ___ at one o'clock", pic: "sandwich" },
      { id: "a1-wh-dinner", set: "a1-wh-set-day", word: "dinner", clue: "have ___ in the evening", pic: "soup" },
      { id: "a1-wh-shower", set: "a1-wh-set-day", word: "shower", clue: "have a ___", pic: "" },
      { id: "a1-wh-bus", set: "a1-wh-set-day", word: "bus", clue: "catch the ___ to school", pic: "bus" },
      { id: "a1-wh-bed", set: "a1-wh-set-day", word: "bed", clue: "go to ___", pic: "bed" },
      { id: "a1-wh-face", set: "a1-wh-set-day", word: "face", clue: "wash your ___", pic: "face" },
      { id: "a1-wh-school", set: "a1-wh-set-day", word: "school", clue: "walk to ___", pic: "school" }
    ]
  },
  /* ---------- 1. Elementary (A2): Unit 7 An Exciting Trip, Unit 8 Favourite Places, Unit 9 Clothes (Part 1) ---------- */
  {
    sets: [
      { id: "a2-wh-set-clothes", name: "Unit 9 · Clothes" },
      { id: "a2-wh-set-bedroom", name: "Unit 8 · Bedroom furniture" },
      { id: "a2-wh-set-travel", name: "Unit 7 · Holidays" },
      { id: "a2-wh-set-verbs", name: "Unit 7 · Past simple" }
    ],
    words: [
      { id: "a2-wh-boots", set: "a2-wh-set-clothes", word: "boots", clue: "You wear them on your feet when it's cold or rainy.", pic: "boots" },
      { id: "a2-wh-cap", set: "a2-wh-set-clothes", word: "cap", clue: "You wear it on your head when it's sunny.", pic: "cap" },
      { id: "a2-wh-gloves", set: "a2-wh-set-clothes", word: "gloves", clue: "You wear them on your hands in winter.", pic: "gloves" },
      { id: "a2-wh-jumper", set: "a2-wh-set-clothes", word: "jumper", clue: "A warm top. You wear it when it's cold.", pic: "" },
      { id: "a2-wh-scarf", set: "a2-wh-set-clothes", word: "scarf", clue: "You wear it around your neck in winter.", pic: "scarf" },
      { id: "a2-wh-socks", set: "a2-wh-set-clothes", word: "socks", clue: "You wear them on your feet, in your shoes.", pic: "socks" },
      { id: "a2-wh-tie", set: "a2-wh-set-clothes", word: "tie", clue: "A man wears it with a suit and a shirt.", pic: "" },
      { id: "a2-wh-trainers", set: "a2-wh-set-clothes", word: "trainers", clue: "Shoes for sport.", pic: "shoes" },
      { id: "a2-wh-sunglasses", set: "a2-wh-set-clothes", word: "sunglasses", clue: "You wear them on your eyes when it's sunny.", pic: "glasses" },
      { id: "a2-wh-armchair", set: "a2-wh-set-bedroom", word: "armchair", clue: "A big, soft chair.", pic: "sofa" },
      { id: "a2-wh-blanket", set: "a2-wh-set-bedroom", word: "blanket", clue: "It keeps you warm in bed.", pic: "" },
      { id: "a2-wh-bookshelf", set: "a2-wh-set-bedroom", word: "bookshelf", clue: "You put your books on it.", pic: "book" },
      { id: "a2-wh-carpet", set: "a2-wh-set-bedroom", word: "carpet", clue: "It's on the floor. It's soft.", pic: "" },
      { id: "a2-wh-cupboard", set: "a2-wh-set-bedroom", word: "cupboard", clue: "You put your clothes in it.", pic: "" },
      { id: "a2-wh-curtains", set: "a2-wh-set-bedroom", word: "curtains", clue: "They are on the window. Close them at night.", pic: "window" },
      { id: "a2-wh-cushion", set: "a2-wh-set-bedroom", word: "cushion", clue: "A small soft thing on a sofa or an armchair.", pic: "" },
      { id: "a2-wh-lamp", set: "a2-wh-set-bedroom", word: "lamp", clue: "It gives you light at night.", pic: "lamp" },
      { id: "a2-wh-mirror", set: "a2-wh-set-bedroom", word: "mirror", clue: "You see your face in it.", pic: "" },
      { id: "a2-wh-passport", set: "a2-wh-set-travel", word: "passport", clue: "You need it to travel to another country.", pic: "" },
      { id: "a2-wh-suitcase", set: "a2-wh-set-travel", word: "suitcase", clue: "You pack your clothes in it for a trip.", pic: "" },
      { id: "a2-wh-ferry", set: "a2-wh-set-travel", word: "ferry", clue: "A boat that takes people and cars.", pic: "boat" },
      { id: "a2-wh-ticket", set: "a2-wh-set-travel", word: "ticket", clue: "You buy it before you get on a train.", pic: "" },
      { id: "a2-wh-airport", set: "a2-wh-set-travel", word: "airport", clue: "Planes arrive and leave here.", pic: "plane" },
      { id: "a2-wh-station", set: "a2-wh-set-travel", word: "station", clue: "Trains arrive and leave here.", pic: "train" },
      { id: "a2-wh-map", set: "a2-wh-set-travel", word: "map", clue: "It shows the roads and places.", pic: "" },
      { id: "a2-wh-tourist", set: "a2-wh-set-travel", word: "tourist", clue: "A person who visits a place on holiday.", pic: "camera" },
      { id: "a2-wh-guidebook", set: "a2-wh-set-travel", word: "guidebook", clue: "A book about a place for tourists.", pic: "book" },
      { id: "a2-wh-went", set: "a2-wh-set-verbs", word: "went", clue: "go → ?", pic: "" },
      { id: "a2-wh-saw", set: "a2-wh-set-verbs", word: "saw", clue: "see → ?", pic: "" },
      { id: "a2-wh-bought", set: "a2-wh-set-verbs", word: "bought", clue: "buy → ?", pic: "" },
      { id: "a2-wh-took", set: "a2-wh-set-verbs", word: "took", clue: "take → ?", pic: "" },
      { id: "a2-wh-ate", set: "a2-wh-set-verbs", word: "ate", clue: "eat → ?", pic: "" },
      { id: "a2-wh-flew", set: "a2-wh-set-verbs", word: "flew", clue: "fly → ?", pic: "" },
      { id: "a2-wh-met", set: "a2-wh-set-verbs", word: "met", clue: "meet → ?", pic: "" },
      { id: "a2-wh-left", set: "a2-wh-set-verbs", word: "left", clue: "leave → ?", pic: "" },
      { id: "a2-wh-caught", set: "a2-wh-set-verbs", word: "caught", clue: "catch → ?", pic: "" },
      { id: "a2-wh-slept", set: "a2-wh-set-verbs", word: "slept", clue: "sleep → ?", pic: "" }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+): Unit 9 Shop Till You Drop, Unit 10 Taste This!, Unit 11 A Healthy Future (Part 1) ---------- */
  {
    sets: [
      { id: "a2p-wh-set-body", name: "Unit 11 · Parts of the body" },
      { id: "a2p-wh-set-ill", name: "Unit 11 · Illnesses and injuries" },
      { id: "a2p-wh-set-taste", name: "Unit 10 · Food and drink" },
      { id: "a2p-wh-set-money", name: "Unit 9 · Money and shopping" }
    ],
    words: [
      { id: "a2p-wh-elbow", set: "a2p-wh-set-body", word: "elbow", clue: "It's in the middle of your arm.", pic: "" },
      { id: "a2p-wh-knee", set: "a2p-wh-set-body", word: "knee", clue: "It's in the middle of your leg. The k is silent.", pic: "" },
      { id: "a2p-wh-ankle", set: "a2p-wh-set-body", word: "ankle", clue: "It's between your foot and your leg.", pic: "" },
      { id: "a2p-wh-thumb", set: "a2p-wh-set-body", word: "thumb", clue: "Your short, thick finger. The b is silent.", pic: "" },
      { id: "a2p-wh-chin", set: "a2p-wh-set-body", word: "chin", clue: "It's below your mouth.", pic: "" },
      { id: "a2p-wh-forehead", set: "a2p-wh-set-body", word: "forehead", clue: "It's above your eyes.", pic: "" },
      { id: "a2p-wh-throat", set: "a2p-wh-set-body", word: "throat", clue: "It's inside your neck. It's sore when you've got a cold.", pic: "" },
      { id: "a2p-wh-shoulder", set: "a2p-wh-set-body", word: "shoulder", clue: "It's between your neck and your arm.", pic: "" },
      { id: "a2p-wh-cheek", set: "a2p-wh-set-body", word: "cheek", clue: "It's on your face, next to your nose.", pic: "" },
      { id: "a2p-wh-chest", set: "a2p-wh-set-body", word: "chest", clue: "It's the front of your body, below your neck.", pic: "" },
      { id: "a2p-wh-cold", set: "a2p-wh-set-ill", word: "cold", clue: "I think I've got a ___. Atchoo!", pic: "" },
      { id: "a2p-wh-cough", set: "a2p-wh-set-ill", word: "cough", clue: "I've got a bad ___. It sounds like /kɒf/.", pic: "" },
      { id: "a2p-wh-fever", set: "a2p-wh-set-ill", word: "fever", clue: "Your body is very hot. You've got a ___.", pic: "" },
      { id: "a2p-wh-flu", set: "a2p-wh-set-ill", word: "flu", clue: "Like a very bad cold. We say \"I've got ___\" (no a).", pic: "" },
      { id: "a2p-wh-earache", set: "a2p-wh-set-ill", word: "earache", clue: "A pain in your ear.", pic: "" },
      { id: "a2p-wh-toothache", set: "a2p-wh-set-ill", word: "toothache", clue: "A pain in your tooth.", pic: "" },
      { id: "a2p-wh-sore", set: "a2p-wh-set-ill", word: "sore", clue: "My throat is ___. It hurts.", pic: "" },
      { id: "a2p-wh-broken", set: "a2p-wh-set-ill", word: "broken", clue: "I fell. Is my arm ___?", pic: "" },
      { id: "a2p-wh-cut", set: "a2p-wh-set-ill", word: "cut", clue: "I've got a ___ on my finger from a knife.", pic: "" },
      { id: "a2p-wh-sour", set: "a2p-wh-set-taste", word: "sour", clue: "Lemon juice tastes like this.", pic: "" },
      { id: "a2p-wh-bitter", set: "a2p-wh-set-taste", word: "bitter", clue: "Coffee without sugar tastes like this.", pic: "" },
      { id: "a2p-wh-raw", set: "a2p-wh-set-taste", word: "raw", clue: "Not cooked, like the fish in sushi.", pic: "" },
      { id: "a2p-wh-spicy", set: "a2p-wh-set-taste", word: "spicy", clue: "A hot curry is ___.", pic: "" },
      { id: "a2p-wh-juicy", set: "a2p-wh-set-taste", word: "juicy", clue: "Full of juice, like a good pineapple.", pic: "" },
      { id: "a2p-wh-frozen", set: "a2p-wh-set-taste", word: "frozen", clue: "Very cold and hard, like ice: ___ vegetables.", pic: "" },
      { id: "a2p-wh-fresh", set: "a2p-wh-set-taste", word: "fresh", clue: "Made today: ___ bread.", pic: "" },
      { id: "a2p-wh-recipe", set: "a2p-wh-set-taste", word: "recipe", clue: "Instructions for cooking.", pic: "" },
      { id: "a2p-wh-flavour", set: "a2p-wh-set-taste", word: "flavour", clue: "How food tastes.", pic: "" },
      { id: "a2p-wh-delicious", set: "a2p-wh-set-taste", word: "delicious", clue: "Really, really tasty.", pic: "" },
      { id: "a2p-wh-receipt", set: "a2p-wh-set-money", word: "receipt", clue: "The paper that shows what you paid. The p is silent.", pic: "" },
      { id: "a2p-wh-change", set: "a2p-wh-set-money", word: "change", clue: "The money you get back when you pay too much.", pic: "" },
      { id: "a2p-wh-price", set: "a2p-wh-set-money", word: "price", clue: "How much something costs.", pic: "" },
      { id: "a2p-wh-checkout", set: "a2p-wh-set-money", word: "checkout", clue: "Where you pay in a supermarket.", pic: "" },
      { id: "a2p-wh-afford", set: "a2p-wh-set-money", word: "afford", clue: "Have enough money for something: Can I ___ it?", pic: "" },
      { id: "a2p-wh-offer", set: "a2p-wh-set-money", word: "offer", clue: "a special ___: a lower price for a short time", pic: "" },
      { id: "a2p-wh-charge", set: "a2p-wh-set-money", word: "charge", clue: "They ___ £1.50 for water.", pic: "" },
      { id: "a2p-wh-regret", set: "a2p-wh-set-money", word: "regret", clue: "Feel sorry you did something: I ___ buying it.", pic: "" }
    ]
  },
  /* ---------- 3. Intermediate (B1): Unit 9 The Future Is Now, Unit 10 Animals in Danger, Unit 11 Off to School (Part 1) ---------- */
  {
    sets: [
      { id: "b1-wh-set-school", name: "Unit 11 · School" },
      { id: "b1-wh-set-nature", name: "Unit 10 · Nature and wildlife" },
      { id: "b1-wh-set-at", name: "Unit 10 · Phrases with at" },
      { id: "b1-wh-set-tech", name: "Unit 9 · Technology" }
    ],
    words: [
      { id: "b1-wh-primary", set: "b1-wh-set-school", word: "primary", clue: "The first school children go to: ___ school.", pic: "" },
      { id: "b1-wh-secondary", set: "b1-wh-set-school", word: "secondary", clue: "The school after primary school.", pic: "" },
      { id: "b1-wh-university", set: "b1-wh-set-school", word: "university", clue: "Undergraduates study here.", pic: "" },
      { id: "b1-wh-degree", set: "b1-wh-set-school", word: "degree", clue: "You get it at the end of university.", pic: "" },
      { id: "b1-wh-attend", set: "b1-wh-set-school", word: "attend", clue: "Go to a school regularly: ___ a school.", pic: "" },
      { id: "b1-wh-boarding", set: "b1-wh-set-school", word: "boarding", clue: "A ___ school: you live there.", pic: "" },
      { id: "b1-wh-education", set: "b1-wh-set-school", word: "education", clue: "Teaching and learning at school and university.", pic: "" },
      { id: "b1-wh-ordinary", set: "b1-wh-set-school", word: "ordinary", clue: "Not special: an ___ classroom.", pic: "" },
      { id: "b1-wh-effort", set: "b1-wh-set-school", word: "effort", clue: "The energy you use to do something.", pic: "" },
      { id: "b1-wh-habitat", set: "b1-wh-set-nature", word: "habitat", clue: "The natural home of an animal.", pic: "" },
      { id: "b1-wh-endangered", set: "b1-wh-set-nature", word: "endangered", clue: "An animal that may disappear forever is ___.", pic: "" },
      { id: "b1-wh-jungle", set: "b1-wh-set-nature", word: "jungle", clue: "A hot, wet forest full of plants and animals.", pic: "" },
      { id: "b1-wh-hunting", set: "b1-wh-set-nature", word: "hunting", clue: "Killing wild animals for food or sport.", pic: "" },
      { id: "b1-wh-crops", set: "b1-wh-set-nature", word: "crops", clue: "Plants that farmers grow for food.", pic: "" },
      { id: "b1-wh-creatures", set: "b1-wh-set-nature", word: "creatures", clue: "Animals and other living things.", pic: "" },
      { id: "b1-wh-population", set: "b1-wh-set-nature", word: "population", clue: "The number of animals or people in a place.", pic: "" },
      { id: "b1-wh-survive", set: "b1-wh-set-nature", word: "survive", clue: "Continue to live.", pic: "" },
      { id: "b1-wh-rainforest", set: "b1-wh-set-nature", word: "rainforest", clue: "A tropical forest where it rains a lot.", pic: "" },
      { id: "b1-wh-least", set: "b1-wh-set-at", word: "least", clue: "at ___ = not less than", pic: "" },
      { id: "b1-wh-once", set: "b1-wh-set-at", word: "once", clue: "at ___ = immediately", pic: "" },
      { id: "b1-wh-risk", set: "b1-wh-set-at", word: "risk", clue: "at ___ = in danger", pic: "" },
      { id: "b1-wh-present", set: "b1-wh-set-at", word: "present", clue: "at ___ = now", pic: "" },
      { id: "b1-wh-first", set: "b1-wh-set-at", word: "first", clue: "at ___ = in the beginning", pic: "" },
      { id: "b1-wh-last", set: "b1-wh-set-at", word: "last", clue: "at long ___ = finally", pic: "" },
      { id: "b1-wh-best", set: "b1-wh-set-at", word: "best", clue: "at its ___ = as good as it can be", pic: "" },
      { id: "b1-wh-invention", set: "b1-wh-set-tech", word: "invention", clue: "Something new that someone made for the first time.", pic: "" },
      { id: "b1-wh-fuel", set: "b1-wh-set-tech", word: "fuel", clue: "Petrol is a ___ for cars.", pic: "" },
      { id: "b1-wh-battery", set: "b1-wh-set-tech", word: "battery", clue: "Charge the ___ of your phone.", pic: "" },
      { id: "b1-wh-display", set: "b1-wh-set-tech", word: "display", clue: "The screen of a phone or a car.", pic: "" },
      { id: "b1-wh-satellite", set: "b1-wh-set-tech", word: "satellite", clue: "It goes around the Earth, up in space.", pic: "" },
      { id: "b1-wh-power", set: "b1-wh-set-tech", word: "power", clue: "Energy, like electricity.", pic: "" },
      { id: "b1-wh-driverless", set: "b1-wh-set-tech", word: "driverless", clue: "A ___ car drives itself.", pic: "" },
      { id: "b1-wh-experiment", set: "b1-wh-set-tech", word: "experiment", clue: "Scientists do them to test their ideas.", pic: "" }
    ]
  },
  /* ---------- 4.-6. IELTS: no groups at these levels yet ---------- */
  { sets: [], words: [] },
  { sets: [], words: [] },
  { sets: [], words: [] }
];
/* Screen text & timing, per level. size = letters per row (8-14). seconds = 0: no timer. */
WU.content.huntScreen = {
  shared: {
    id: 'hunt-screen',
    tag: 'WORD HUNT', ready: 'Find the words in the grid!', rule: 'Found a word? Say it, then show it on the board.', ruleShow: true,
    go: 'GO!', found: 'found', timeUp: 'TIME!', allFound: 'ALL FOUND!', missed: 'Not found:',
    seconds: 180, size: 11, max: 8, diag: false, showWords: false, lenShow: true,
    demo: 'TEACHER DEMO: watch me!', demoShow: false
  },
  levels: [
    { size: 10, seconds: 240, showWords: true, lenShow: false, rule: 'Find a word. Say it. Show it!', demoShow: true },
    { size: 11, seconds: 210 },
    { size: 12, seconds: 180, diag: true },
    { size: 12, seconds: 150, diag: true },
    { size: 13, seconds: 150, diag: true },
    { size: 13, seconds: 120, diag: true },
    { size: 14, seconds: 120, diag: true }
  ]
};
