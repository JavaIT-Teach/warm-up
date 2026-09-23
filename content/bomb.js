/* Warm Up: content for THE BOMB. Edit freely.
   One entry per level, in order: A1, A2, A2+, B1, IELTS 1 (B2), IELTS 2 (6.0), IELTS 3 (7.0+).

   rule     : shown under the category before the fuse is lit.
   tickRule : shown (blinking) while the fuse burns.
   cats     : categories. Beginner categories are objects:
                { name, tag, icon, frame }
                (the article comes from the picture: frame "It's ___." + picture "apple" = "It's an apple.")
                tag   = picture-library tag; 4 example pictures are drawn from it (see js/pictures.js)
                icon  = picture shown next to the category name
                frame = this category's own sentence frame ("___" = the gap); none = the level's frame (bombScreen)
   first    : extra categories used half the time in "First lesson" mode (get-to-know-you).
   challenges : the challenge wheel (8 are picked each round). { short, text, sub, frame, pic, timer }
                RULES: the student must SPEAK English, from their seat, in 30 seconds or less.
                short = label on the wheel (10 letters max)
                sub   = small line under the challenge. "Topic: " shows the current category.
                frame = Beginner sentence frame ("___" = the gap). pic = picture id (see js/pictures.js).
                timer = seconds for the optional timer (30 max).
   id       : PERMANENT id of each built-in item. Teacher edits (Edit mode, E) are saved on top of this
              file and point at these ids, so items can be reordered safely. Never change or reuse an id;
              to retire an item, delete it; to add one, give it a new unique id.
   Teacher edits made in Edit mode (E) are saved on top of this file, not in it. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.bomb = [
  /* ---------- 0. Beginner (A1) ---------- */
  {
    rule: "One word is OK. Pointing is OK!",
    tickRule: "One word. Pass it on!",
    cats: [
      { id: "a1-animals", name: "Animals", tag: "animal", icon: "cat" },
      { id: "a1-pets", name: "Pets", tag: "pet", icon: "dog" },
      { id: "a1-farm-animals", name: "Farm animals", tag: "farm", icon: "cow" },
      { id: "a1-wild-animals", name: "Wild animals", tag: "wild", icon: "lion" },
      { id: "a1-in-the-sea", name: "In the sea", tag: "sea", icon: "fish" },
      { id: "a1-food", name: "Food", tag: "food", icon: "pizza", frame: "I like ___." },
      { id: "a1-fruit", name: "Fruit", tag: "fruit", icon: "apple", frame: "I like ___." },
      { id: "a1-vegetables", name: "Vegetables", tag: "veg", icon: "carrot", frame: "I like ___." },
      { id: "a1-drinks", name: "Drinks", tag: "drink", icon: "juice", frame: "I like ___." },
      { id: "a1-breakfast", name: "Breakfast", tag: "breakfast", icon: "egg", frame: "I like ___." },
      { id: "a1-colours", name: "Colours", tag: "colour", icon: "c-red" },
      { id: "a1-family", name: "Family", tag: "family", icon: "family", frame: "My ___." },
      { id: "a1-body", name: "Body", tag: "body", icon: "hand", frame: "My ___." },
      { id: "a1-clothes", name: "Clothes", tag: "clothes", icon: "T-shirt" },
      { id: "a1-weather", name: "Weather", tag: "weather", icon: "sun", frame: "___!" },
      { id: "a1-transport", name: "Transport", tag: "transport", icon: "bus" },
      { id: "a1-wheels", name: "Wheels", tag: "wheels", icon: "car" },
      { id: "a1-home", name: "Home", tag: "home", icon: "house" },
      { id: "a1-kitchen", name: "Kitchen", tag: "kitchen", icon: "fridge" },
      { id: "a1-bedroom", name: "Bedroom", tag: "bedroom", icon: "bed" },
      { id: "a1-school", name: "School", tag: "school", icon: "book" },
      { id: "a1-in-my-bag", name: "In my bag", tag: "bag", icon: "bag", frame: "I have ___." },
      { id: "a1-jobs", name: "Jobs", tag: "job", icon: "doctor" },
      { id: "a1-places", name: "Places", tag: "place", icon: "school" },
      { id: "a1-sports", name: "Sports", tag: "sport", icon: "football", frame: "I like ___." },
      { id: "a1-toys", name: "Toys", tag: "toy", icon: "teddy bear" },
      { id: "a1-music", name: "Music", tag: "music", icon: "guitar" },
      { id: "a1-in-the-sky", name: "In the sky", tag: "sky", icon: "star" },
      { id: "a1-red-things", name: "Red things", tag: "red", icon: "c-red", frame: "It's red. It's ___." },
      { id: "a1-yellow-things", name: "Yellow things", tag: "yellow", icon: "c-yellow", frame: "It's yellow. It's ___." },
      { id: "a1-green-things", name: "Green things", tag: "green", icon: "c-green", frame: "It's green. It's ___." },
      { id: "a1-big-things", name: "Big things", tag: "big", icon: "elephant", frame: "It's big. It's ___." },
      { id: "a1-small-things", name: "Small things", tag: "small", icon: "mouse", frame: "It's small. It's ___." },
      { id: "a1-hot-things", name: "Hot things", tag: "hot", icon: "fire", frame: "It's hot. It's ___." },
      { id: "a1-cold-things", name: "Cold things", tag: "cold", icon: "snowman", frame: "It's cold. It's ___." },
      { id: "a1-in-the-park", name: "In the park", tag: "park", icon: "tree" },
      { id: "a1-at-the-beach", name: "At the beach", tag: "beach", icon: "beach" }
    ],
    first: [
      { id: "a1-first-food-i-like", name: "Food I like", tag: "food", icon: "pizza", frame: "I like ___." },
      { id: "a1-first-animals-i-like", name: "Animals I like", tag: "animal", icon: "dog", frame: "I like ___." },
      { id: "a1-first-colours-i-like", name: "Colours I like", tag: "colour", icon: "c-blue", frame: "I like ___." },
      { id: "a1-first-my-family", name: "My family", tag: "family", icon: "family", frame: "I have ___." },
      { id: "a1-first-sports-i-like", name: "Sports I like", tag: "sport", icon: "football", frame: "I like ___." },
      { id: "a1-first-drinks-i-like", name: "Drinks I like", tag: "drink", icon: "juice", frame: "I like ___." },
      { id: "a1-first-in-my-bag", name: "In my bag", tag: "bag", icon: "bag", frame: "I have ___." },
      { id: "a1-first-fruit-i-like", name: "Fruit I like", tag: "fruit", icon: "banana", frame: "I like ___." }
    ],
    challenges: [
      { id: "a1-ch-hello", short: "HELLO", pic: "hand", text: "Say hello. Ask 3 names.", frame: "Hello! What's your name?" },
      { id: "a1-ch-i-like", short: "I LIKE", pic: "heart", text: "Tell the class one thing you like.", frame: "I like ___." },
      { id: "a1-ch-3-words", short: "3 WORDS", pic: "star", text: "Say 3 words from this category.", frame: "___, ___, ___!" },
      { id: "a1-ch-ask", short: "ASK", pic: "teacher", text: "Ask the teacher one question.", frame: "Do you like ___?" },
      { id: "a1-ch-friend", short: "FRIEND", pic: "family", text: "Talk about the person next to you.", frame: "This is ___. He / She likes ___." },
      { id: "a1-ch-food", short: "FOOD", pic: "pizza", text: "Ask a classmate: favourite food?", frame: "What's your favourite food?" },
      { id: "a1-ch-colour", short: "COLOUR", pic: "c-blue", text: "Say your favourite colour.", frame: "My favourite colour is ___." },
      { id: "a1-ch-family", short: "FAMILY", pic: "family", text: "Say one person in your family.", frame: "I have ___." },
      { id: "a1-ch-name", short: "NAME", pic: "face", text: "Say your name and your age.", frame: "My name is ___. I'm ___." },
      { id: "a1-ch-animal", short: "ANIMAL", pic: "dog", text: "Say one animal you like.", frame: "I like ___." },
      { id: "a1-ch-bag", short: "BAG", pic: "bag", text: "Say 2 things in your bag.", frame: "I have ___." },
      { id: "a1-ch-count", short: "COUNT", pic: "clock", text: "Count from 1 to 10 in English.", frame: "One, two, three..." },
      { id: "a1-ch-i-see", short: "I SEE", pic: "eye", text: "Say 3 things you can see now.", frame: "I see ___." },
      { id: "a1-ch-yes-no", short: "YES/NO", pic: "pizza", text: "Answer: Do you like pizza?", frame: "Yes, I do. / No, I don't." },
      { id: "a1-ch-spell", short: "SPELL", pic: "book", text: "Spell your name.", frame: "A - N - A" },
      { id: "a1-ch-home", short: "HOME", pic: "house", text: "Say one thing in your home.", frame: "I have ___." }
    ]
  },

  /* ---------- 1. Elementary (A2) ---------- */
  {
    rule: "Say one word. Pass it on. Don't get caught holding it.",
    tickRule: "One word each. Keep it moving!",
    cats: [
      { id: "a2-things-in-a-kitchen", name: "Things in a kitchen" },
      { id: "a2-things-in-a-supermarket", name: "Things in a supermarket" },
      { id: "a2-things-you-do-every-day", name: "Things you do every day" },
      { id: "a2-things-at-the-beach", name: "Things at the beach" },
      { id: "a2-jobs", name: "Jobs" },
      { id: "a2-sports", name: "Sports" },
      { id: "a2-hobbies", name: "Hobbies" },
      { id: "a2-things-in-a-bedroom", name: "Things in a bedroom" },
      { id: "a2-things-that-are-cold", name: "Things that are cold" },
      { id: "a2-things-that-are-hot", name: "Things that are hot" },
      { id: "a2-countries", name: "Countries" },
      { id: "a2-cities", name: "Cities" },
      { id: "a2-things-in-a-city", name: "Things in a city" },
      { id: "a2-things-that-make-noise", name: "Things that make noise" },
      { id: "a2-things-you-wear-in-winter", name: "Things you wear in winter" },
      { id: "a2-things-in-the-sky", name: "Things in the sky" },
      { id: "a2-animals-in-a-zoo", name: "Animals in a zoo" },
      { id: "a2-things-with-wheels", name: "Things with wheels" },
      { id: "a2-things-you-can-open", name: "Things you can open" },
      { id: "a2-things-that-are-round", name: "Things that are round" },
      { id: "a2-things-that-are-soft", name: "Things that are soft" },
      { id: "a2-things-in-a-school-bag", name: "Things in a school bag" },
      { id: "a2-places-in-a-town", name: "Places in a town" },
      { id: "a2-musical-instruments", name: "Musical instruments" },
      { id: "a2-things-you-do-at-the-weekend", name: "Things you do at the weekend" },
      { id: "a2-birthday-things", name: "Birthday things" },
      { id: "a2-things-you-did-yesterday", name: "Things you did yesterday" },
      { id: "a2-things-you-are-going-to-do", name: "Things you are going to do this weekend" },
      { id: "a2-things-bigger-than-a-car", name: "Things bigger than a car" },
      { id: "a2-things-smaller-than-your-hand", name: "Things smaller than your hand" },
      { id: "a2-holiday-things", name: "Holiday things" },
      { id: "a2-things-in-a-park", name: "Things in a park" },
      { id: "a2-famous-people", name: "Famous people" }
    ],
    first: [
      { id: "a2-first-things-you-like", name: "Things you like" },
      { id: "a2-first-your-hobbies", name: "Your hobbies" },
      { id: "a2-first-countries-you-want-to-visit", name: "Countries you want to visit" },
      { id: "a2-first-food-from-your-country", name: "Food from your country" },
      { id: "a2-first-things-in-your-room", name: "Things in your room" },
      { id: "a2-first-your-favourite-things", name: "Your favourite things" },
      { id: "a2-first-jobs-in-your-family", name: "Jobs in your family" },
      { id: "a2-first-things-you-did-last-summer", name: "Things you did last summer" }
    ],
    challenges: [
      { id: "a2-ch-hello", short: "HELLO", text: "Say hello to 3 people and ask their names", sub: "\"Hi! What's your name?\"" },
      { id: "a2-ch-i-like", short: "I LIKE", text: "Tell the class one thing you like, and why", sub: "\"I like... because...\"" },
      { id: "a2-ch-3-words", short: "3 WORDS", text: "Say 3 more words from this category", sub: "Topic: " },
      { id: "a2-ch-ask", short: "ASK", text: "Ask the teacher one question", sub: "Any question in English." },
      { id: "a2-ch-neighbour", short: "NEIGHBOUR", text: "Say one thing about the person next to you", sub: "\"She has... / He likes...\"" },
      { id: "a2-ch-food", short: "FOOD", text: "Choose a classmate. Ask their favourite food.", sub: "\"What's your favourite food?\"" },
      { id: "a2-ch-yesterday", short: "YESTERDAY", text: "Say 3 things you did yesterday", sub: "\"Yesterday I...\"" },
      { id: "a2-ch-weekend", short: "WEEKEND", text: "Say what you are going to do this weekend", sub: "\"I'm going to...\"" },
      { id: "a2-ch-spell", short: "SPELL", text: "Spell one word from this category", sub: "Letter by letter." },
      { id: "a2-ch-compare", short: "COMPARE", text: "Compare two things in this room", sub: "\"The... is bigger than the...\"" },
      { id: "a2-ch-nice", short: "NICE", text: "Give the person next to you a compliment", sub: "\"I like your...\"" },
      { id: "a2-ch-favourite", short: "FAVOURITE", text: "Say your favourite food, film and colour", sub: "Three favourites, three sentences." },
      { id: "a2-ch-morning", short: "MORNING", text: "Talk for 10 seconds about your morning", sub: "\"This morning I...\"", timer: 10 },
      { id: "a2-ch-yes-no", short: "YES/NO", text: "Ask a classmate a yes/no question", sub: "\"Do you...? / Can you...?\"" },
      { id: "a2-ch-whisper", short: "WHISPER", text: "Whisper your next answer", sub: "Everybody listen!" },
      { id: "a2-ch-family", short: "FAMILY", text: "Tell us about one person in your family", sub: "\"My brother is...\"" }
    ]
  },

  /* ---------- 2. Pre-Intermediate (A2+) ---------- */
  {
    rule: "One word or a short phrase. Pass it on.",
    tickRule: "Keep it moving!",
    cats: [
      { id: "a2p-things-you-have-never-done", name: "Things you have never done" },
      { id: "a2p-things-you-have-done-this-week", name: "Things you have done this week" },
      { id: "a2p-places-you-have-been", name: "Places you have been" },
      { id: "a2p-reasons-to-be-late", name: "Reasons to be late" },
      { id: "a2p-things-that-make-you-happy", name: "Things that make you happy" },
      { id: "a2p-things-that-are-expensive", name: "Things that are expensive" },
      { id: "a2p-things-you-cant-live-without", name: "Things you can't live without" },
      { id: "a2p-things-people-collect", name: "Things people collect" },
      { id: "a2p-things-you-do-when-you-are", name: "Things you do when you are bored" },
      { id: "a2p-what-you-were-doing-at-8", name: "What you were doing at 8 pm yesterday" },
      { id: "a2p-things-youll-do-if-it-rains", name: "Things you'll do if it rains" },
      { id: "a2p-things-in-a-hotel", name: "Things in a hotel" },
      { id: "a2p-things-at-an-airport", name: "Things at an airport" },
      { id: "a2p-things-at-a-party", name: "Things at a party" },
      { id: "a2p-types-of-films", name: "Types of films" },
      { id: "a2p-things-in-a-forest", name: "Things in a forest" },
      { id: "a2p-healthy-food", name: "Healthy food" },
      { id: "a2p-unhealthy-food", name: "Unhealthy food" },
      { id: "a2p-things-that-are-scary", name: "Things that are scary" },
      { id: "a2p-excuses-for-no-homework", name: "Excuses for no homework" },
      { id: "a2p-words-to-describe-a-person", name: "Words to describe a person" },
      { id: "a2p-things-you-can-do-on-a", name: "Things you can do on a phone" },
      { id: "a2p-things-in-a-hospital", name: "Things in a hospital" },
      { id: "a2p-things-that-are-sticky", name: "Things that are sticky" },
      { id: "a2p-presents-for-a-friend", name: "Presents for a friend" },
      { id: "a2p-weather-words", name: "Weather words" },
      { id: "a2p-dangerous-jobs", name: "Dangerous jobs" },
      { id: "a2p-things-in-a-bathroom", name: "Things in a bathroom" },
      { id: "a2p-things-that-go-up-and-down", name: "Things that go up and down" },
      { id: "a2p-things-you-do-before-school", name: "Things you do before school" },
      { id: "a2p-things-that-were-popular-10-years", name: "Things that were popular 10 years ago" }
    ],
    first: [
      { id: "a2p-first-places-you-have-visited", name: "Places you have visited" },
      { id: "a2p-first-things-you-have-never-tried", name: "Things you have never tried" },
      { id: "a2p-first-things-that-make-you-happy", name: "Things that make you happy" },
      { id: "a2p-first-your-favourite-films", name: "Your favourite films" },
      { id: "a2p-first-things-you-are-good-at", name: "Things you are good at" },
      { id: "a2p-first-things-you-want-to-learn", name: "Things you want to learn" },
      { id: "a2p-first-things-in-your-hometown", name: "Things in your hometown" },
      { id: "a2p-first-your-plans-for-the-weekend", name: "Your plans for the weekend" }
    ],
    challenges: [
      { id: "a2p-ch-never", short: "NEVER", text: "Say 2 things you have never done", sub: "\"I have never...\"" },
      { id: "a2p-ch-ever", short: "EVER", text: "Ask the teacher a \"Have you ever...?\" question", sub: "The teacher must answer!" },
      { id: "a2p-ch-neighbour", short: "NEIGHBOUR", text: "Say one fact about the person next to you", sub: "Something true!" },
      { id: "a2p-ch-weekend", short: "WEEKEND", text: "Ask a classmate about their last weekend", sub: "\"What did you do...?\"" },
      { id: "a2p-ch-3-words", short: "3 WORDS", text: "Say 3 more words from this category", sub: "Topic: " },
      { id: "a2p-ch-excuse", short: "EXCUSE", text: "Give a funny excuse for being late", sub: "\"Sorry, I'm late because...\"" },
      { id: "a2p-ch-if", short: "IF...", text: "Finish: \"If it rains tomorrow, I will...\"", sub: "Make it interesting." },
      { id: "a2p-ch-holiday", short: "HOLIDAY", text: "Talk for 20 seconds about your best holiday", sub: "Where? When? Who with?", timer: 20 },
      { id: "a2p-ch-happy", short: "HAPPY", text: "Say 2 things that make you happy", sub: "\"... makes me happy because...\"" },
      { id: "a2p-ch-8-pm", short: "8 PM", text: "Say what you were doing at 8 pm yesterday", sub: "\"I was...\"" },
      { id: "a2p-ch-nice", short: "NICE", text: "Give someone a compliment and say why", sub: "\"I like your... because...\"" },
      { id: "a2p-ch-friend", short: "FRIEND", text: "Describe your best friend in 3 words", sub: "Then give one example." },
      { id: "a2p-ch-film", short: "FILM", text: "Describe your favourite film in 2 sentences", sub: "No spoilers!" },
      { id: "a2p-ch-ask-2", short: "ASK 2", text: "Ask 2 classmates one question each", sub: "They must answer in a full sentence." },
      { id: "a2p-ch-recommend", short: "RECOMMEND", text: "Recommend one place in your city", sub: "\"You should go to... because...\"" },
      { id: "a2p-ch-weather", short: "WEATHER", text: "Describe today's weather in 2 sentences", sub: "\"It's... and...\"" }
    ]
  },

  /* ---------- 3. Intermediate (B1) ---------- */
  {
    rule: "Say a full sentence. Then pass it on.",
    tickRule: "Full sentences. Keep it moving!",
    cats: [
      { id: "b1-what-you-would-do-if-you", name: "What you would do if you won the lottery" },
      { id: "b1-things-you-used-to-do-as", name: "Things you used to do as a child" },
      { id: "b1-reasons-people-move-to-another-city", name: "Reasons people move to another city" },
      { id: "b1-ways-to-save-money", name: "Ways to save money" },
      { id: "b1-things-that-cause-stress", name: "Things that cause stress" },
      { id: "b1-ways-to-stay-healthy", name: "Ways to stay healthy" },
      { id: "b1-personality-adjectives", name: "Personality adjectives" },
      { id: "b1-words-to-describe-a-city", name: "Words to describe a city" },
      { id: "b1-environmental-problems", name: "Environmental problems" },
      { id: "b1-things-a-good-friend-does", name: "Things a good friend does" },
      { id: "b1-things-that-might-happen-in-the", name: "Things that might happen in the future" },
      { id: "b1-reasons-to-learn-english", name: "Reasons to learn English" },
      { id: "b1-things-youd-do-if-you-were", name: "Things you'd do if you were invisible" },
      { id: "b1-phrasal-verbs-with-get", name: "Phrasal verbs with \"get\"" },
      { id: "b1-collocations-with-make", name: "Collocations with \"make\"" },
      { id: "b1-collocations-with-do", name: "Collocations with \"do\"" },
      { id: "b1-things-that-annoy-people", name: "Things that annoy people" },
      { id: "b1-qualities-of-a-good-teacher", name: "Qualities of a good teacher" },
      { id: "b1-ideas-for-a-first-date", name: "Ideas for a first date" },
      { id: "b1-inventions-that-changed-the-world", name: "Inventions that changed the world" },
      { id: "b1-ways-to-relax", name: "Ways to relax" },
      { id: "b1-rules-at-school", name: "Rules at school" },
      { id: "b1-things-people-do-on-social-media", name: "Things people do on social media" },
      { id: "b1-reasons-to-travel", name: "Reasons to travel" },
      { id: "b1-things-you-should-never-say-to", name: "Things you should never say to a boss" },
      { id: "b1-things-in-a-lost-property-office", name: "Things in a lost property office" },
      { id: "b1-problems-in-big-cities", name: "Problems in big cities" },
      { id: "b1-things-to-take-to-a-desert", name: "Things to take to a desert island" },
      { id: "b1-things-that-used-to-be-popular", name: "Things that used to be popular" },
      { id: "b1-good-things-about-the-countryside", name: "Good things about the countryside" }
    ],
    first: [
      { id: "b1-first-things-you-used-to-love-as", name: "Things you used to love as a child" },
      { id: "b1-first-things-you-would-change-about-your", name: "Things you would change about your city" },
      { id: "b1-first-reasons-you-are-learning-english", name: "Reasons you are learning English" },
      { id: "b1-first-your-hidden-talents", name: "Your hidden talents" },
      { id: "b1-first-dream-jobs", name: "Dream jobs" },
      { id: "b1-first-things-you-would-do-with-a", name: "Things you would do with a free day" },
      { id: "b1-first-the-best-advice-you-have-had", name: "The best advice you have had" },
      { id: "b1-first-things-that-make-a-good-class", name: "Things that make a good class" }
    ],
    challenges: [
      { id: "b1-ch-invisible", short: "INVISIBLE", text: "Say what you would do if you were invisible", sub: "\"If I were invisible, I would...\"" },
      { id: "b1-ch-used-to", short: "USED TO", text: "Say 2 things you used to do as a child", sub: "\"I used to...\"" },
      { id: "b1-ch-neighbour", short: "NEIGHBOUR", text: "Say one fact about the person next to you", sub: "Something true and kind." },
      { id: "b1-ch-rather", short: "RATHER", text: "Ask the teacher a \"Would you rather...?\"", sub: "The teacher must choose!" },
      { id: "b1-ch-dream-job", short: "DREAM JOB", text: "Choose a classmate. Ask about their dream job.", sub: "Then ask one follow-up question." },
      { id: "b1-ch-examples", short: "EXAMPLES", text: "Give 2 more examples, in sentences", sub: "Topic: " },
      { id: "b1-ch-opinion", short: "OPINION", text: "Give your opinion on homework, with a reason", sub: "\"I think... because...\"" },
      { id: "b1-ch-30-sec", short: "30 SEC", text: "Talk for 30 seconds about this category", sub: "Topic: ", timer: 30 },
      { id: "b1-ch-advice", short: "ADVICE", text: "Give the class one tip for learning English", sub: "\"You should...\"" },
      { id: "b1-ch-guess", short: "GUESS", text: "Guess what the teacher did last night", sub: "\"You might have...\"" },
      { id: "b1-ch-lottery", short: "LOTTERY", text: "Say what you would buy if you won the lottery", sub: "\"I would buy... because...\"" },
      { id: "b1-ch-explain", short: "EXPLAIN", text: "Explain a word without saying it", sub: "The class guesses the word." },
      { id: "b1-ch-recommend", short: "RECOMMEND", text: "Recommend a film or a book, and say why", sub: "Two reasons." },
      { id: "b1-ch-nice", short: "NICE", text: "Give someone a specific compliment", sub: "Say why." },
      { id: "b1-ch-change", short: "CHANGE", text: "Name one thing you'd change in your city", sub: "\"I would change... because...\"" },
      { id: "b1-ch-tomorrow", short: "TOMORROW", text: "Say 2 things that might happen tomorrow", sub: "\"It might...\"" }
    ]
  },

  /* ---------- 4. IELTS 1 (B2) ---------- */
  {
    rule: "Full sentence. No repeats!",
    tickRule: "Full sentences. No repeats!",
    cats: [
      { id: "i1-effects-of-social-media", name: "Effects of social media" },
      { id: "i1-reasons-people-change-careers", name: "Reasons people change careers" },
      { id: "i1-qualities-of-a-good-leader", name: "Qualities of a good leader" },
      { id: "i1-ways-technology-has-changed-education", name: "Ways technology has changed education" },
      { id: "i1-things-governments-should-pay-for", name: "Things governments should pay for" },
      { id: "i1-causes-of-traffic-jams", name: "Causes of traffic jams" },
      { id: "i1-benefits-of-learning-a-second-language", name: "Benefits of learning a second language" },
      { id: "i1-ways-to-reduce-plastic-waste", name: "Ways to reduce plastic waste" },
      { id: "i1-reasons-people-become-famous", name: "Reasons people become famous" },
      { id: "i1-things-that-make-a-city-a", name: "Things that make a city a good place to live" },
      { id: "i1-advantages-of-working-from-home", name: "Advantages of working from home" },
      { id: "i1-disadvantages-of-working-from-home", name: "Disadvantages of working from home" },
      { id: "i1-why-tourism-is-good-for-a", name: "Why tourism is good for a country" },
      { id: "i1-problems-tourism-causes", name: "Problems tourism causes" },
      { id: "i1-skills-employers-look-for", name: "Skills employers look for" },
      { id: "i1-ways-to-deal-with-stress", name: "Ways to deal with stress" },
      { id: "i1-things-that-influence-what-we-buy", name: "Things that influence what we buy" },
      { id: "i1-reasons-young-people-leave-home", name: "Reasons young people leave home" },
      { id: "i1-things-youd-change-about-your-school", name: "Things you'd change about your school" },
      { id: "i1-crimes-and-punishments", name: "Crimes and punishments" },
      { id: "i1-types-of-renewable-energy", name: "Types of renewable energy" },
      { id: "i1-features-of-a-healthy-lifestyle", name: "Features of a healthy lifestyle" },
      { id: "i1-reasons-people-volunteer", name: "Reasons people volunteer" },
      { id: "i1-things-money-cant-buy", name: "Things money can't buy" },
      { id: "i1-ways-families-have-changed", name: "Ways families have changed" },
      { id: "i1-qualities-of-a-good-neighbour", name: "Qualities of a good neighbour" },
      { id: "i1-reasons-people-break-rules", name: "Reasons people break rules" },
      { id: "i1-ways-to-make-friends-as-an", name: "Ways to make friends as an adult" },
      { id: "i1-advantages-of-public-transport", name: "Advantages of public transport" },
      { id: "i1-things-that-will-disappear-in-20", name: "Things that will disappear in 20 years" }
    ],
    first: [
      { id: "i1-first-things-youre-passionate-about", name: "Things you're passionate about" },
      { id: "i1-first-your-goals-for-this-year", name: "Your goals for this year" },
      { id: "i1-first-skills-you-want-to-improve", name: "Skills you want to improve" },
      { id: "i1-first-places-that-feel-like-home", name: "Places that feel like home" },
      { id: "i1-first-habits-you-are-proud-of", name: "Habits you are proud of" },
      { id: "i1-first-achievements-you-are-proud-of", name: "Achievements you are proud of" },
      { id: "i1-first-people-who-influenced-you", name: "People who influenced you" },
      { id: "i1-first-questions-for-your-new-classmates", name: "Questions for your new classmates" }
    ],
    challenges: [
      { id: "i1-ch-no-um", short: "NO \"UM\"", text: "Talk for 30 seconds without saying \"um\"", sub: "Topic: ", timer: 30 },
      { id: "i1-ch-defend", short: "DEFEND", text: "Defend an unpopular opinion in 3 sentences", sub: "Give a reason and an example." },
      { id: "i1-ch-opinion", short: "OPINION", text: "Ask a classmate an opinion question", sub: "They answer in 3 sentences." },
      { id: "i1-ch-summary", short: "SUMMARY", text: "Summarise what the last speaker said", sub: "\"So, basically, ... said that...\"" },
      { id: "i1-ch-what-if", short: "WHAT IF", text: "Ask the teacher a hypothetical question", sub: "\"What would you do if...?\"" },
      { id: "i1-ch-pros-cons", short: "PROS/CONS", text: "Give one pro and one con of social media", sub: "\"On the one hand... on the other...\"" },
      { id: "i1-ch-examples", short: "EXAMPLES", text: "Give 2 more examples, with reasons", sub: "Topic: " },
      { id: "i1-ch-explain", short: "EXPLAIN", text: "Explain a word without saying it", sub: "The class guesses the word." },
      { id: "i1-ch-simple", short: "SIMPLE", text: "Explain your job or studies to a five-year-old", sub: "Short words only." },
      { id: "i1-ch-hometown", short: "HOMETOWN", text: "Describe your hometown in 3 adjectives", sub: "One example for each." },
      { id: "i1-ch-advice", short: "ADVICE", text: "Give advice to a new student at this school", sub: "\"If I were you, I'd...\"" },
      { id: "i1-ch-regret", short: "REGRET", text: "Say one thing you wish you'd done differently", sub: "\"I wish I had...\"" },
      { id: "i1-ch-nice", short: "NICE", text: "Give someone a specific compliment", sub: "Say why." },
      { id: "i1-ch-agree", short: "AGREE?", text: "Agree or disagree: \"Homework should be banned.\"", sub: "Give your main reason." },
      { id: "i1-ch-paraphrase", short: "PARAPHRASE", text: "Paraphrase the teacher's last sentence", sub: "Different words, same meaning." },
      { id: "i1-ch-predict", short: "PREDICT", text: "Predict one change in your city in 10 years", sub: "\"I expect that...\"" }
    ]
  },

  /* ---------- 5. IELTS 2 (band 6.0) ---------- */
  {
    rule: "Full sentence with a reason. No repeats!",
    tickRule: "Sentence + reason. No repeats!",
    cats: [
      { id: "i2-effects-of-remote-work", name: "Effects of remote work" },
      { id: "i2-reasons-people-move-abroad", name: "Reasons people move abroad" },
      { id: "i2-advantages-of-city-life", name: "Advantages of city life" },
      { id: "i2-disadvantages-of-city-life", name: "Disadvantages of city life" },
      { id: "i2-ways-to-improve-public-health", name: "Ways to improve public health" },
      { id: "i2-effects-of-advertising-on-children", name: "Effects of advertising on children" },
      { id: "i2-reasons-for-the-generation-gap", name: "Reasons for the generation gap" },
      { id: "i2-benefits-of-sport-for-society", name: "Benefits of sport for society" },
      { id: "i2-causes-of-climate-change", name: "Causes of climate change" },
      { id: "i2-solutions-to-climate-change", name: "Solutions to climate change" },
      { id: "i2-ways-the-internet-changed-shopping", name: "Ways the internet changed shopping" },
      { id: "i2-reasons-some-jobs-are-paid-more", name: "Reasons some jobs are paid more" },
      { id: "i2-effects-of-tourism-on-local-culture", name: "Effects of tourism on local culture" },
      { id: "i2-ways-to-encourage-reading", name: "Ways to encourage reading" },
      { id: "i2-problems-of-an-ageing-population", name: "Problems of an ageing population" },
      { id: "i2-reasons-to-study-abroad", name: "Reasons to study abroad" },
      { id: "i2-effects-of-fast-food", name: "Effects of fast food" },
      { id: "i2-qualities-of-a-good-parent", name: "Qualities of a good parent" },
      { id: "i2-ways-museums-can-attract-young-people", name: "Ways museums can attract young people" },
      { id: "i2-effects-of-video-games", name: "Effects of video games" },
      { id: "i2-reasons-people-distrust-the-news", name: "Reasons people distrust the news" },
      { id: "i2-benefits-of-learning-history", name: "Benefits of learning history" },
      { id: "i2-ways-to-reduce-crime", name: "Ways to reduce crime" },
      { id: "i2-advantages-of-online-learning", name: "Advantages of online learning" },
      { id: "i2-disadvantages-of-online-learning", name: "Disadvantages of online learning" },
      { id: "i2-reasons-people-choose-to-live-alone", name: "Reasons people choose to live alone" },
      { id: "i2-effects-of-globalisation", name: "Effects of globalisation" },
      { id: "i2-things-schools-should-teach-but-dont", name: "Things schools should teach but don't" },
      { id: "i2-ways-to-reduce-inequality", name: "Ways to reduce inequality" },
      { id: "i2-reasons-celebrities-influence-people", name: "Reasons celebrities influence people" }
    ],
    first: [
      { id: "i2-first-memorable-trips", name: "Memorable trips" },
      { id: "i2-first-big-decisions-you-have-made", name: "Big decisions you have made" },
      { id: "i2-first-things-you-could-teach-others", name: "Things you could teach others" },
      { id: "i2-first-traditions-in-your-family", name: "Traditions in your family" },
      { id: "i2-first-challenges-of-learning-english", name: "Challenges of learning English" },
      { id: "i2-first-your-ambitions-for-the-next-five", name: "Your ambitions for the next five years" },
      { id: "i2-first-books-or-films-that-changed-you", name: "Books or films that changed you" },
      { id: "i2-first-what-makes-a-good-first-impression", name: "What makes a good first impression" }
    ],
    challenges: [
      { id: "i2-ch-cue-card", short: "CUE CARD", text: "Describe a place you want to visit", sub: "Where, why, and who with.", timer: 30 },
      { id: "i2-ch-no-um", short: "NO \"UM\"", text: "Talk for 30 seconds without saying \"um\"", sub: "Topic: ", timer: 30 },
      { id: "i2-ch-both-sides", short: "BOTH SIDES", text: "One argument for and one against remote work", sub: "Then say which side wins." },
      { id: "i2-ch-part-3", short: "PART 3", text: "Ask a classmate a Part 3 question", sub: "\"Why do you think people...?\"" },
      { id: "i2-ch-paraphrase", short: "PARAPHRASE", text: "Paraphrase what the last speaker said", sub: "Different words, same meaning." },
      { id: "i2-ch-ask", short: "ASK", text: "Ask the teacher's opinion on exams", sub: "Then say if you agree." },
      { id: "i2-ch-cause", short: "CAUSE", text: "Give one cause and one effect", sub: "Topic: " },
      { id: "i2-ch-then-now", short: "THEN/NOW", text: "Compare life now with 20 years ago", sub: "\"Twenty years ago... whereas now...\"" },
      { id: "i2-ch-mayor", short: "MAYOR", text: "You're the mayor. Fix one problem. How?", sub: "One problem, one solution." },
      { id: "i2-ch-why", short: "WHY?", text: "Speculate: why do people move to big cities?", sub: "\"It may be because...\"" },
      { id: "i2-ch-example", short: "EXAMPLE", text: "Give a real example from your country", sub: "Topic: " },
      { id: "i2-ch-advice", short: "ADVICE", text: "Advise a friend who wants to study abroad", sub: "Two pieces of advice." },
      { id: "i2-ch-predict", short: "PREDICT", text: "Predict how schools will change by 2040", sub: "\"By 2040, schools will probably...\"" },
      { id: "i2-ch-although", short: "ALTHOUGH", text: "Make one \"Although..., I believe...\" sentence", sub: "About social media." },
      { id: "i2-ch-nice", short: "NICE", text: "Give someone a specific compliment", sub: "Say why." },
      { id: "i2-ch-explain", short: "EXPLAIN", text: "Explain a word without saying it", sub: "The class guesses the word." }
    ]
  },

  /* ---------- 6. IELTS 3 (band 7.0+) ---------- */
  {
    rule: "Full sentence with an example. No repeats!",
    tickRule: "Sentence + example. No repeats!",
    cats: [
      { id: "i3-arguments-for-a-four-day-work", name: "Arguments for a four-day work week" },
      { id: "i3-arguments-against-a-four-day-work", name: "Arguments against a four-day work week" },
      { id: "i3-ethical-problems-with-ai", name: "Ethical problems with AI" },
      { id: "i3-consequences-of-a-cashless-society", name: "Consequences of a cashless society" },
      { id: "i3-reasons-democracy-can-fail", name: "Reasons democracy can fail" },
      { id: "i3-hidden-costs-of-cheap-fashion", name: "Hidden costs of cheap fashion" },
      { id: "i3-privacy-versus-security", name: "Privacy versus security" },
      { id: "i3-ways-language-shapes-thinking", name: "Ways language shapes thinking" },
      { id: "i3-consequences-of-urbanisation", name: "Consequences of urbanisation" },
      { id: "i3-arguments-for-a-universal-basic-income", name: "Arguments for a universal basic income" },
      { id: "i3-risks-of-genetic-engineering", name: "Risks of genetic engineering" },
      { id: "i3-reasons-history-repeats-itself", name: "Reasons history repeats itself" },
      { id: "i3-causes-of-misinformation", name: "Causes of misinformation" },
      { id: "i3-effects-of-automation-on-society", name: "Effects of automation on society" },
      { id: "i3-arguments-for-and-against-zoos", name: "Arguments for and against zoos" },
      { id: "i3-paradoxes-of-modern-life", name: "Paradoxes of modern life" },
      { id: "i3-consequences-of-space-exploration", name: "Consequences of space exploration" },
      { id: "i3-values-that-differ-between-generations", name: "Values that differ between generations" },
      { id: "i3-reasons-some-countries-develop-faster", name: "Reasons some countries develop faster" },
      { id: "i3-unintended-consequences-of-good-intentions", name: "Unintended consequences of good intentions" },
      { id: "i3-ways-social-media-affects-democracy", name: "Ways social media affects democracy" },
      { id: "i3-reasons-to-ban-cars-from-city", name: "Reasons to ban cars from city centres" },
      { id: "i3-costs-of-perfectionism", name: "Costs of perfectionism" },
      { id: "i3-reasons-experts-disagree", name: "Reasons experts disagree" },
      { id: "i3-ethical-dilemmas-in-medicine", name: "Ethical dilemmas in medicine" },
      { id: "i3-ways-culture-shapes-success", name: "Ways culture shapes success" },
      { id: "i3-effects-of-mass-tourism-on-heritage", name: "Effects of mass tourism on heritage" },
      { id: "i3-limits-of-free-speech", name: "Limits of free speech" },
      { id: "i3-reasons-people-resist-change", name: "Reasons people resist change" },
      { id: "i3-long-term-effects-of-the-pandemic", name: "Long-term effects of the pandemic on work" }
    ],
    first: [
      { id: "i3-first-values-you-live-by", name: "Values you live by" },
      { id: "i3-first-things-youve-changed-your-mind-about", name: "Things you've changed your mind about" },
      { id: "i3-first-contradictions-in-your-personality", name: "Contradictions in your personality" },
      { id: "i3-first-what-success-means-to-you", name: "What success means to you" },
      { id: "i3-first-risks-worth-taking", name: "Risks worth taking" },
      { id: "i3-first-lessons-from-failure", name: "Lessons from failure" },
      { id: "i3-first-questions-youd-ask-a-stranger", name: "Questions you'd ask a stranger" },
      { id: "i3-first-what-youd-tell-your-younger-self", name: "What you'd tell your younger self" }
    ],
    challenges: [
      { id: "i3-ch-nuance", short: "NUANCE", text: "Give a nuanced view: are exams fair?", sub: "\"To some extent... however...\"", timer: 30 },
      { id: "i3-ch-no-um", short: "NO \"UM\"", text: "Talk for 30 seconds without saying \"um\"", sub: "Topic: ", timer: 30 },
      { id: "i3-ch-devil", short: "DEVIL", text: "Argue against your own last answer", sub: "Be the devil's advocate." },
      { id: "i3-ch-hedge", short: "HEDGE", text: "Answer the next question with no certainty", sub: "\"It could be argued that...\"" },
      { id: "i3-ch-counter", short: "COUNTER", text: "Summarise the last speaker, then counter it", sub: "One sentence each." },
      { id: "i3-ch-analogy", short: "ANALOGY", text: "Explain the internet using one analogy", sub: "\"The internet is like...\"" },
      { id: "i3-ch-hard-q", short: "HARD Q", text: "Ask a classmate a question with no easy answer", sub: "They must take a position." },
      { id: "i3-ch-ethics", short: "ETHICS", text: "Ask the teacher a question about ethics", sub: "Then say what you think." },
      { id: "i3-ch-trade-off", short: "TRADE-OFF", text: "Name one trade-off in this category", sub: "Topic: " },
      { id: "i3-ch-had-i", short: "HAD I...", text: "Finish with something true: \"Had I known...\"", sub: "Inversion, please." },
      { id: "i3-ch-history", short: "HISTORY", text: "Give an example from history", sub: "Topic: " },
      { id: "i3-ch-ai", short: "AI", text: "Predict one unintended consequence of AI", sub: "\"One unforeseen effect might be...\"" },
      { id: "i3-ch-define", short: "DEFINE", text: "Define \"success\" in one sentence", sub: "No clichés." },
      { id: "i3-ch-concede", short: "CONCEDE", text: "Concede one point in any debate", sub: "\"Admittedly...\"" },
      { id: "i3-ch-challenge", short: "CHALLENGE", text: "Politely challenge the teacher on homework", sub: "\"With respect, I'd argue...\"" },
      { id: "i3-ch-nice", short: "NICE", text: "Give someone a precise, specific compliment", sub: "Say why." }
    ]
  }
];

/* Screen text and timing for The Bomb, per level. Editable in Edit mode: "Screen text & timing".
   "shared" applies to every level; "levels" overrides it for one level. rule / tickRule come from the levels above.
   Empty text hides that line. Fuse times are in seconds. The id "bomb-screen" is PERMANENT. */
WU.content.bombScreen = {
  shared: {
    id: 'bomb-screen',
    catTag: 'CATEGORY', frame: '', ruleShow: true, tickShow: true,
    demo: 'TEACHER DEMO: you go first!', demoShow: false,
    qMark: '??', qLine: 'seconds left', qSub: 'Nobody knows. Not even me.',
    fuseMin: 15, fuseMax: 60, demoMin: 15, demoMax: 23,
    boom: 'BOOM!', who: "Who's holding it?", wheelTag: 'CHALLENGE WHEEL', hub: '?', topic: 'Topic:',
    pickTitle: 'WHO STARTS?', pickLanded: 'YOU START!', pickSub: 'Take the object. Say the first word!'
  },
  levels: [
    { frame: "It's ___.", demoShow: true },
    {}, {}, {}, {}, {}, {}
  ]
};
