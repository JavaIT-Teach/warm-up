/* Warm Up: content for VANISHING SENTENCE (writing). A sentence from the last lessons appears; the class reads it aloud.
   Words vanish a few at a time and the class reads it again, missing words too, until nothing is left.
   Then everyone writes the whole sentence on paper, and the words come back so students check their spelling.
   Built from the taught lessons in the Lesson Plan Builder (weekly job, 2026-11-15).
   items[level]: { id, text, focus, pic, stress }. stress = the stressed words, separated by commas (empty = automatic:
     the content words, not a / the / is / to...). Shown big in the first reading so the class reads with rhythm. focus = the grammar or vocabulary it practises (shown as a tag).
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.vanish = [
  /* ---------- 0. Beginner (A1): Unit 7 My Day, Unit 8 At School, Unit 9 Feeling Good ---------- */
  {
    items: [
      { id: "a1-vs-she-gets-up", text: "She gets up at seven o'clock.", focus: "Unit 7 · present simple: he / she + -s", pic: "clock" },
      { id: "a1-vs-he-has-lunch", text: "He has lunch at half past one.", focus: "Unit 7 · telling the time", pic: "sandwich" },
      { id: "a1-vs-we-dont-go", text: "We don't go to school on Sundays.", focus: "Unit 7 · don't / doesn't", pic: "school" },
      { id: "a1-vs-she-doesnt-sleep", text: "She doesn't sleep at night.", focus: "Unit 7 · don't / doesn't", pic: "moon" },
      { id: "a1-vs-does-lara-have-art", text: "Does Lara have art on Fridays?", focus: "Unit 8 · Do / Does questions", pic: "a-draw" },
      { id: "a1-vs-where-do-you-live", text: "Where do you live?", focus: "Unit 8 · Wh- questions", pic: "house" },
      { id: "a1-vs-why-do-you-like", text: "Why do you like football?", focus: "Unit 8 · Wh- questions", pic: "football" },
      { id: "a1-vs-i-like-swimming", text: "I like swimming and running.", focus: "Unit 9 · like + -ing", pic: "a-swim" },
      { id: "a1-vs-mary-doesnt-like", text: "Mary doesn't like dancing.", focus: "Unit 9 · like + -ing", pic: "a-dance" },
      { id: "a1-vs-im-good-at-running", text: "I'm good at running.", focus: "Unit 9 · good at + -ing", pic: "a-run" },
      { id: "a1-vs-not-very-good-tennis", text: "I'm not very good at playing tennis.", focus: "Unit 9 · good at + -ing", pic: "tennis" },
      { id: "a1-vs-its-good-for-her", text: "Water is good for her.", focus: "Unit 9 · me, him, her, us, them", pic: "water" },
      { id: "a1-vs-play-with-them", text: "Play football with them.", focus: "Unit 9 · me, him, her, us, them", pic: "football" },
      { id: "a1-vs-cake-isnt-good", text: "Cake isn't good for you.", focus: "Unit 9 · good for / isn't good for", pic: "cake" },
      { id: "a1-vs-eat-fruit", text: "Eat fruit and you'll feel better.", focus: "Unit 9 · Health", pic: "apple" }
    ]
  },
  /* ---------- 1. Elementary (A2): Unit 7 An Exciting Trip, Unit 8 Favourite Places, Unit 9 Clothes (Part 1) ---------- */
  {
    items: [
      { id: "a2-vs-went-camping", text: "We went camping last summer.", focus: "Unit 7 · past simple: irregular verbs", pic: "" },
      { id: "a2-vs-did-you-take-photos", text: "Did you take any photos?", focus: "Unit 7 · past simple questions", pic: "camera" },
      { id: "a2-vs-didnt-buy-presents", text: "I didn't buy any presents.", focus: "Unit 7 · past simple negatives", pic: "present" },
      { id: "a2-vs-caught-a-train", text: "We caught a train to the city.", focus: "Unit 7 · travel verbs", pic: "train" },
      { id: "a2-vs-flight-left", text: "Our flight left at nine o'clock.", focus: "Unit 7 · past simple: irregular verbs", pic: "plane" },
      { id: "a2-vs-packed-suitcase", text: "She packed her suitcase and left.", focus: "Unit 7 · travel verbs", pic: "" },
      { id: "a2-vs-cant-see-anyone", text: "I can't see anyone in the street.", focus: "Unit 8 · someone, anyone...", pic: "" },
      { id: "a2-vs-nothing-under-bed", text: "There is nothing under my bed.", focus: "Unit 8 · something, nothing...", pic: "bed" },
      { id: "a2-vs-buy-something", text: "I want to buy something for my mum.", focus: "Unit 8 · something, anything...", pic: "shop" },
      { id: "a2-vs-raining-so", text: "It was raining, so we stayed at home.", focus: "Unit 8 · because / so", pic: "rain" },
      { id: "a2-vs-coat-because", text: "I'm wearing my coat because it's very cold.", focus: "Unit 8 · because / so", pic: "jacket" },
      { id: "a2-vs-play-the-drums", text: "My brother plays the drums in his bedroom.", focus: "Unit 8 · free-time activities", pic: "drum" },
      { id: "a2-vs-boots-hers", text: "These boots aren't mine. They're hers.", focus: "Unit 9 · mine, yours, hers...", pic: "boots" },
      { id: "a2-vs-scarf-yours", text: "Is this pale blue scarf yours?", focus: "Unit 9 · mine, yours · pale / bright", pic: "scarf" },
      { id: "a2-vs-bright-red-cap", text: "His cap is bright red.", focus: "Unit 9 · clothes · pale / bright", pic: "cap" }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+): Unit 9 Shop Till You Drop, Unit 10 Taste This!, Unit 11 A Healthy Future (Part 1) ---------- */
  {
    items: [
      { id: "a2p-vs-ever-bought-online", text: "Have you ever bought something online?", focus: "Unit 9 · present perfect: ever", pic: "" },
      { id: "a2p-vs-never-worn", text: "I've never worn these shoes.", focus: "Unit 9 · present perfect: never", pic: "shoes" },
      { id: "a2p-vs-gone-to-shops", text: "My brother has gone to the shops.", focus: "Unit 9 · been or gone?", pic: "" },
      { id: "a2p-vs-ran-out-of-money", text: "I ran out of money last week.", focus: "Unit 9 · run out of", pic: "money" },
      { id: "a2p-vs-keep-receipt", text: "Keep the receipt if you want to take it back.", focus: "Unit 9 · money and shopping", pic: "" },
      { id: "a2p-vs-regret-buying", text: "They regret buying that car.", focus: "Unit 9 · regret + -ing", pic: "car" },
      { id: "a2p-vs-lemon-tastes-sour", text: "This lemon juice tastes really sour.", focus: "Unit 10 · taste + adjective", pic: "lemon" },
      { id: "a2p-vs-known-since", text: "I've known my best friend since 2018.", focus: "Unit 10 · for / since", pic: "" },
      { id: "a2p-vs-lived-for", text: "We've lived here for three years.", focus: "Unit 10 · for / since", pic: "house" },
      { id: "a2p-vs-made-curry", text: "I made a spicy curry last night.", focus: "Unit 10 · past simple: exact time", pic: "" },
      { id: "a2p-vs-could-i-have", text: "Could I have a fresh orange juice, please?", focus: "Unit 10 · ordering food", pic: "juice" },
      { id: "a2p-vs-looks-delicious", text: "Your cake looks really delicious.", focus: "Unit 10 · look + adjective", pic: "cake" },
      { id: "a2p-vs-got-a-cold", text: "I think I've got a cold.", focus: "Unit 11 · illnesses: a cold, flu", pic: "" },
      { id: "a2p-vs-throat-sore", text: "My throat is sore and I've got a cough.", focus: "Unit 11 · illnesses and injuries", pic: "" },
      { id: "a2p-vs-hurt-knee", text: "He fell and hurt his knee.", focus: "Unit 11 · parts of the body", pic: "" }
    ]
  },
  /* ---------- 3. Intermediate (B1): Unit 9 The Future Is Now, Unit 10 Animals in Danger, Unit 11 Off to School (Part 1) ---------- */
  {
    items: [
      { id: "b1-vs-be-driving", text: "This time tomorrow I'll be driving to the airport.", focus: "Unit 9 · future continuous", pic: "car" },
      { id: "b1-vs-going-to-watch", text: "He's going to watch their progress.", focus: "Unit 9 · be going to", pic: "" },
      { id: "b1-vs-plug-it-in", text: "Plug it in and charge the battery.", focus: "Unit 9 · technology", pic: "phone" },
      { id: "b1-vs-too-expensive", text: "This phone is too expensive for me.", focus: "Unit 9 · too / enough / very", pic: "phone" },
      { id: "b1-vs-big-enough", text: "Is the car big enough for five people?", focus: "Unit 9 · too / enough / very", pic: "car" },
      { id: "b1-vs-bees-disappeared", text: "If bees disappeared, we would all suffer.", focus: "Unit 10 · second conditional", pic: "bee" },
      { id: "b1-vs-unless-we-do-more", text: "Unless we do more, they will disappear.", focus: "Unit 10 · unless", pic: "" },
      { id: "b1-vs-protect-orangutans", text: "If we protect orangutans now, they will have a future.", focus: "Unit 10 · first conditional", pic: "monkey" },
      { id: "b1-vs-if-i-were-you", text: "If I were you, I'd go with my friends.", focus: "Unit 10 · second conditional", pic: "" },
      { id: "b1-vs-losing-habitat", text: "Many creatures are losing their habitat.", focus: "Unit 10 · nature and wildlife", pic: "tree" },
      { id: "b1-vs-at-risk", text: "These animals are at risk of disappearing.", focus: "Unit 10 · phrases with at", pic: "" },
      { id: "b1-vs-did-well-in", text: "She did well in her exams.", focus: "Unit 11 · school: do well in", pic: "" },
      { id: "b1-vs-breaks-up", text: "Our school breaks up for the holidays in June.", focus: "Unit 11 · school: break up", pic: "school" },
      { id: "b1-vs-apply-for", text: "He's going to apply for a place at university.", focus: "Unit 11 · apply for · be going to", pic: "" },
      { id: "b1-vs-surrounded-by", text: "The classroom was surrounded by trees.", focus: "Unit 11 · Classrooms around the world", pic: "tree" }
    ]
  },
  /* ---------- 4.-6. IELTS: no groups at these levels yet ---------- */
  { items: [] },
  { items: [] },
  { items: [] }
];
/* Screen text & timing, per level. perStep = words that vanish each time (Space). */
WU.content.vanishScreen = {
  shared: {
    id: 'vanish-screen',
    tag: 'VANISHING SENTENCE', focusShow: true,
    read: 'Read it together!', again: 'Read it again. Say the missing words too!', write: 'WRITE IT!',
    writeRule: 'Write the whole sentence on paper. No looking!', writeSec: 45,
    check: 'Check your spelling!', say: '{name}, read your sentence!', perStep: 2, letters: false,
    demo: 'TEACHER DEMO: watch me first!', demoShow: false,
    stressShow: true, stressRule: 'Say the BIG words louder and longer.'
  },
  levels: [
    { perStep: 1, letters: true, writeSec: 60, demoShow: true },
    { perStep: 1, letters: true, writeSec: 50 },
    { perStep: 2 },
    { perStep: 2, writeSec: 40 },
    { perStep: 3, writeSec: 40 },
    { perStep: 3, writeSec: 35 },
    { perStep: 3, writeSec: 35 }
  ]
};
