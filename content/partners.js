/* Warm Up: content for WORD PARTNERS (all levels). Trains: collocations, phrases instead of single words.
   words[level]: { id, word, p: [phrases], question, trap }.
   word     = the core word in the middle of the board.
   p        = its partners, most useful first (up to 8). A partner is a phrase, or [phrase, picture id] to show a picture on its tile. On the board the core word stays visible and every other word is a gap
              (a / an / the stay visible). To choose the gaps yourself, put them in [brackets]: "[make] a decision".
   question = the USE IT question after the board: the student answers with phrases from the board.
   unit     = optional label on the board (weekly words: the taught unit). added = 'YYYY-MM-DD': words added in the last 14 days play first.
   trap     = a common wrong partner (shown after the board), e.g. "do a decision". Empty = none.
   id is PERMANENT: never change or reuse an id. Retired ids (do not reuse): wp0-have. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.partners = [
  /* 0. Beginner (A1): verb + picture partners. [phrase, picture id] = the tile shows that picture. */
  { words: [
    /* Weekly words (2026-11-28): taught units (Unit 11 My Digital Life, Unit 12 Working Life). */
    { id: 'wk0-1128-work', word: 'work', unit: 'Unit 12 · Working Life', added: '2026-11-28', p: [['work in a hospital', 'hospital'], ['work on a farm', 'farm'], ['work in a café', 'coffee'], ['work in a shop', 'shop'], ['work at home', 'house'], ['work in a school', 'school']], question: 'Where do people in your family work?', trap: 'work in a farm' },
    { id: 'wk0-1128-drive', word: 'drive', unit: 'Unit 12 · Working Life', added: '2026-11-28', p: [['drive a lorry', 'truck'], ['drive a taxi', 'taxi'], ['drive a bus', 'bus'], ['drive a car', 'car'], ['drive to the beach', 'beach'], ['drive home', 'house']], question: 'Can you drive? Who drives in your family?', trap: 'drive a bike' },
    { id: 'wk0-1128-watch', word: 'watch', unit: 'Unit 11 · My Digital Life', added: '2026-11-28', p: [['watch TV', 'TV'], ['watch football', 'football'], ['watch tennis', 'tennis'], ['watch a concert', 'microphone'], ['watch basketball', 'basketball'], ['watch films', 'computer']], question: 'What do you often watch?', trap: 'look TV' },
    { id: 'wk0-1128-send', word: 'send', unit: 'Unit 11 · My Digital Life', added: '2026-11-28', p: [['send a text', 'phone'], ['send an email', 'computer'], ['send a photo', 'camera'], ['send a present', 'present'], ['send money', 'money'], ['send a song', 'a-sing']], question: 'How many texts do you send in a day?', trap: 'send to me a text' },
    /* Weekly words (2026-11-21): taught units (Unit 10 Things We Do, Unit 11 My Digital Life). */
    { id: 'wk0-1121-walk', word: 'walk', unit: 'Unit 10 · Things We Do', added: '2026-11-21', p: [['walk the dog', 'dog'], ['walk to school', 'school'], ['walk in the park', 'park'], ['walk home', 'house'], ['walk on the beach', 'beach'], ['walk with friends', 'friends']], question: 'Do you walk to school or work?', trap: 'walk to home' },
    { id: 'wk0-1121-feed', word: 'feed', unit: 'Unit 10 · Things We Do', added: '2026-11-21', p: [['feed the cat', 'cat'], ['feed the dog', 'dog'], ['feed the fish', 'fish'], ['feed the birds', 'bird'], ['feed the baby', 'baby'], ['feed the chickens', 'chicken']], question: 'Do you feed a pet at home?', trap: 'feed to the cat' },
    { id: 'wk0-1121-clean', word: 'clean', unit: 'Unit 10 · Things We Do', added: '2026-11-21', p: [['clean the bath', 'bath'], ['clean your teeth', 'toothbrush'], ['clean the window', 'window'], ['clean the car', 'car'], ['clean the table', 'table'], ['clean your shoes', 'shoes']], question: 'What do you clean at home?', trap: 'make the cleaning' },
    { id: 'wk0-1121-listen', word: 'listen', unit: 'Unit 11 · My Digital Life', added: '2026-11-21', p: [['listen to music', 'guitar'], ['listen to a song', 'a-sing'], ['listen to the teacher', 'teacher'], ['listen to your mum', 'mother'], ['listen to the rain', 'rain'], ['listen to the piano', 'piano']], question: 'When do you listen to music?', trap: 'listen music' },
    /* Weekly words: taught units (Unit 7 My Day, Unit 8 At School, Unit 9 Feeling Good). */
    { id: 'wk0-1118-have', word: 'have', unit: 'Unit 7 · My Day', added: '2026-11-18', p: [['have breakfast', 'egg'], ['have lunch', 'sandwich'], ['have dinner', 'soup'], ['have a shower', 'shower'], ['have art', 'a-draw'], ['have maths', 'ruler']], question: 'What do you have for breakfast?', trap: 'drink breakfast' },
    { id: 'wk0-1118-good', word: 'good', unit: 'Unit 9 · Feeling Good', added: '2026-11-18', p: [['good for you', 'apple'], ['good at running', 'a-run'], ['good at swimming', 'a-swim'], ['good at English', 'book'], ['good at art', 'a-draw'], ['good at tennis', 'tennis']], question: 'What are you good at?', trap: 'good in running' },
    { id: 'wk0-1118-school', word: 'school', unit: 'Unit 8 · At School', added: '2026-11-18', p: [['go to school', 'bus'], ['walk to school', 'school'], ['at school', 'teacher'], ['after school', 'clock'], ['a school bag', 'bag'], ['school lunch', 'sandwich']], question: 'How do you go to school or work?', trap: 'go to the school' },
    { id: 'wk0-1118-wash', word: 'wash', unit: 'Unit 7 · My Day', added: '2026-11-18', p: [['wash your face', 'face'], ['wash your hands', 'hand'], ['wash the dishes', 'plate'], ['wash your hair', 'shower'], ['wash the car', 'car'], ['wash your clothes', 'T-shirt']], question: 'When do you wash your hands?', trap: 'wash your teeth' },
    { id: 'wp0-play', word: 'play', p: [['play football', 'football'], ['play the guitar', 'guitar'], ['play chess', 'a-chess'], ['play video games', 'a-games'], ['play tennis', 'tennis'], ['play the piano', 'piano']], question: 'What do you play? When?', trap: 'play the football' },
    { id: 'wp0-go', word: 'go', p: [['go to school', 'school'], ['go to the park', 'park'], ['go shopping', 'shop'], ['go swimming', 'a-swim'], ['go to bed', 'bed'], ['go to the beach', 'beach']], question: 'Where do you go on Sunday?', trap: 'go to home' },
    { id: 'wp0-take', word: 'take', p: [['take a photo', 'camera'], ['take the bus', 'bus'], ['take a taxi', 'taxi'], ['take an umbrella', 'umbrella'], ['take the train', 'train'], ['take a bag', 'bag']], question: 'How do you go to school or work?', trap: 'make a photo' },
    { id: 'wp0-do', word: 'do', p: [['do homework', 'book'], ['do the dishes', 'plate'], ['do sport', 'sport'], ['do exercise', 'a-run'], ['do the shopping', 'shop'], ['do a test', 'test']], question: 'What do you do after school or work?', trap: 'make homework' },
    { id: 'wp0-make', word: 'make', p: [['make a cake', 'cake'], ['make a sandwich', 'sandwich'], ['make tea', 'kettle'], ['make a snowman', 'snowman'], ['make a phone call', 'phone'], ['make the bed', 'bed']], question: 'What can you make?', trap: 'make a photo' },
    { id: 'wp0-wear', word: 'wear', p: [['wear a hat', 'hat'], ['wear glasses', 'glasses'], ['wear a scarf', 'scarf'], ['wear a jacket', 'jacket'], ['wear gloves', 'gloves'], ['wear boots', 'boots']], question: 'What do you wear in winter?', trap: 'wear an umbrella' },
    { id: 'wp0-ride', word: 'ride', p: [['ride a bike', 'a-bike'], ['ride a horse', 'horse'], ['ride a motorbike', 'motorbike'], ['ride a skateboard', 'a-skate'], ['ride an elephant', 'elephant']], question: 'Can you ride a bike or a horse?', trap: 'ride a car' }
  ] },
  /* 1. Elementary (A2): picture partners too. */
  { words: [
    /* Weekly words (2026-11-28): taught units (Unit 11 Eating Out, Unit 12 The Latest Technology). */
    { id: 'wk1-1128-eat', word: 'eat', unit: 'Unit 11 · Eating Out', added: '2026-11-28', p: [['eat out', 'chef'], ['eat fast food', 'burger'], ['eat fresh vegetables', 'carrot'], ['eat street food', 'hot dog'], ['eat healthy food', 'apple'], ['eat dessert', 'cake']], question: 'How often do you eat out? Where do you go?', trap: 'eat a fast food' },
    { id: 'wk1-1128-order', word: 'order', unit: 'Unit 11 · Eating Out', added: '2026-11-28', p: [['order a pizza', 'pizza'], ['order a drink', 'cola'], ['order a dessert', 'ice cream'], ['order noodles', 'noodles'], ['order soup', 'soup'], ['order a sandwich', 'sandwich']], question: 'What do you usually order in a café?', trap: 'order pizza to home' },
    { id: 'wk1-1128-slice', word: 'slice', unit: 'Unit 11 · Eating Out', added: '2026-11-28', p: [['a slice of [pizza]', 'pizza'], ['a slice of [cake]', 'cake'], ['a slice of [bread]', 'bread'], ['a slice of [cheese]', 'cheese'], ['a slice of [lemon]', 'lemon'], ['a slice of [watermelon]', 'watermelon']], question: 'What do you like better: a slice of pizza or a slice of cake?', trap: 'a cut of pizza' },
    { id: 'wk1-1128-bowl', word: 'bowl', unit: 'Unit 11 · Eating Out', added: '2026-11-28', p: [['a bowl of [ice cream]', 'ice cream'], ['a bowl of [soup]', 'soup'], ['a bowl of [rice]', 'rice'], ['a bowl of [noodles]', 'noodles'], ['a bowl of [strawberries]', 'strawberry'], ['a bowl of [grapes]', 'grapes']], question: 'What did you have for dinner yesterday?', trap: 'a plate of soup' },
    /* Weekly words (2026-11-21): taught units (Unit 8 Favourite Places, Unit 10 Buying Things). */
    { id: 'wk1-1121-buy', word: 'buy', unit: 'Unit 10 · Buying Things', added: '2026-11-21', p: [['buy a present', 'present'], ['buy clothes', 'T-shirt'], ['buy online', 'computer'], ['buy food', 'bread'], ['buy shoes', 'shoes'], ['buy a phone', 'phone']], question: 'What do you buy online?', trap: 'buy in internet' },
    { id: 'wk1-1121-shop', word: 'shop', unit: 'Unit 10 · Buying Things', added: '2026-11-21', p: [['a clothes shop', 'T-shirt'], ['a shoe shop', 'shoes'], ['a sports shop', 'football'], ['a flower shop', 'flower'], ['a toy shop', 'teddy bear'], ['a cake shop', 'cake']], question: 'What is your favourite shop in your town? Why?', trap: 'a shop of clothes' },
    { id: 'wk1-1121-pay', word: 'pay', unit: 'Unit 10 · Buying Things', added: '2026-11-21', p: [['pay in cash', 'money'], ['pay by card', 'wallet'], ['pay for a coffee', 'coffee'], ['pay for a taxi', 'taxi'], ['pay for lunch', 'sandwich'], ['pay for the bus', 'bus']], question: 'How do you usually pay in shops?', trap: 'pay the coffee' },
    { id: 'wk1-1121-listen', word: 'listen', unit: 'Unit 8 · Favourite Places', added: '2026-11-21', p: [['listen to the drums', 'drum'], ['listen to the guitar', 'guitar'], ['listen to songs', 'a-sing'], ['listen to stories', 'book'], ['listen to the piano', 'piano'], ['listen to the teacher', 'teacher']], question: 'What do you listen to in your favourite place?', trap: 'listen music' },
    /* Weekly words: taught units (Unit 7 An Exciting Trip, Unit 8 Favourite Places, Unit 9 Clothes). */
    { id: 'wk1-1118-wear', word: 'wear', unit: 'Unit 9 · Clothes', added: '2026-11-18', p: [['wear a cap', 'cap'], ['wear sunglasses', 'glasses'], ['wear boots', 'boots'], ['wear gloves', 'gloves'], ['wear a scarf', 'scarf'], ['wear trainers', 'shoes']], question: 'What do you wear when it is cold?', trap: 'dress a scarf' },
    { id: 'wk1-1118-go', word: 'go', unit: 'Unit 7 · An Exciting Trip', added: '2026-11-18', p: [['go camping', 'fire'], ['go on holiday', 'plane'], ['go to the beach', 'beach'], ['go shopping', 'shop'], ['go by ferry', 'boat'], ['go to the airport', 'taxi']], question: 'Where did you go last summer?', trap: 'go to camping' },
    { id: 'wk1-1118-took', word: 'took', unit: 'Unit 7 · An Exciting Trip', added: '2026-11-18', p: [['took photos', 'camera'], ['took a taxi', 'taxi'], ['took the train', 'train'], ['took the ferry', 'boat'], ['took the bus', 'bus'], ['took my umbrella', 'umbrella']], question: 'Tell us about a trip. What did you take?', trap: 'maked photos' },
    { id: 'wk1-1118-close', word: 'close', unit: 'Unit 8 · Favourite Places', added: '2026-11-18', p: [['close the curtains', 'window'], ['close the door', 'door'], ['close the shop', 'shop'], ['close your eyes', 'eye'], ['close the book', 'book'], ['close the fridge', 'fridge']], question: 'What do you do in your bedroom at night?', trap: 'close the light' },
    { id: 'wp1-weather', word: 'weather', p: [['sunny weather', 'sun'], ['rainy weather', 'rain'], ['cold weather', 'snow'], ['windy weather', 'wind'], ['stormy weather', 'storm'], ['the weather forecast', 'forecast']], question: 'What is your favourite weather? Why?', trap: 'a good weather' },
    { id: 'wp1-get', word: 'get', p: [['get up', 'alarm clock'], ['get dressed', 'T-shirt'], ['get a present', 'present'], ['get wet', 'rain'], ['get a taxi', 'taxi'], ['get home', 'house']], question: 'What time do you get up and get home?', trap: 'get up from bed' },
    { id: 'wp1-catch', word: 'catch', p: [['catch a bus', 'bus'], ['catch a ball', 'ball'], ['catch a fish', 'fish'], ['catch a train', 'train'], ['catch a plane', 'plane'], ['catch a cold', 'cold']], question: 'Did you catch a cold this year? What did you do?', trap: 'take a cold' },
    { id: 'wp1-miss', word: 'miss', p: [['miss the bus', 'bus'], ['miss a train', 'train'], ['miss my family', 'family'], ['miss a lesson', 'school'], ['miss a flight', 'plane'], ['miss my friends', 'friends']], question: 'Who do you miss? Why?', trap: 'miss to my family' },
    { id: 'wp1-party', word: 'party', p: [['have a party', 'balloon'], ['a birthday party', 'cake'], ['a party dress', 'dress'], ['a New Year party', 'ny-tree'], ['a party hat', 'party hat'], ['go to a party', 'invitation']], question: 'Tell us about a great party.', trap: 'make a party' },
    { id: 'wp1-holiday', word: 'holiday', p: [['go on holiday', 'plane'], ['a beach holiday', 'beach'], ['a skiing holiday', 'a-ski'], ['a summer holiday', 'sun'], ['a holiday home', 'house'], ['holiday photos', 'camera']], question: 'Where did you go on your last holiday?', trap: 'go to holiday' },
    { id: 'wp1-friend', word: 'friend', p: [['a best friend', 'heart'], ['visit a friend', 'house'], ['meet a friend', 'park'], ['play with friends', 'ball'], ['call a friend', 'phone'], ['make friends', 'friends']], question: 'How did you meet your best friend?', trap: 'do friends' },
    { id: 'wp1-money', word: 'money', p: [['spend money', 'shop'], ['save money', 'piggy bank'], ['earn money', 'wallet'], ['pocket money', 'sweets'], ['a lot of money', 'money'], ['money in the bank', 'bank']], question: 'What do you spend your money on?', trap: 'earn the lottery' }
  ] },
  /* 2. Pre-Intermediate (A2+) */
  { words: [
    /* Weekly words (2026-11-28): taught units (Unit 13 Mixed Feelings, Unit 14 On Screen). */
    { id: 'wk2-1128-scared', word: 'scared', unit: 'Unit 13 · Mixed Feelings', added: '2026-11-28', p: ['scared of spiders', 'scared of the dark', 'feel scared', 'too scared to move', 'get scared', 'really scared'], question: 'What are you scared of? Why?', trap: 'scared from spiders' },
    { id: 'wk2-1128-proud', word: 'proud', unit: 'Unit 13 · Mixed Feelings', added: '2026-11-28', p: ['proud of myself', 'proud of you', 'feel proud', 'make your parents proud', 'really proud', 'proud of my team'], question: 'When did you last feel proud of yourself?', trap: 'proud with you' },
    { id: 'wk2-1128-film', word: 'film', unit: 'Unit 14 · On Screen', added: '2026-11-28', p: ['a horror film', 'a science fiction film', 'watch a film', 'a film extra', 'appear in a film', 'a film director'], question: 'What kind of film do you never watch? Why?', trap: 'look a film' },
    { id: 'wk2-1128-show', word: 'show', unit: 'Unit 14 · On Screen', added: '2026-11-28', p: ['a chat show', 'a reality show', 'a TV show', 'watch a show', 'appear on a show', 'my favourite show'], question: 'Which TV show are you a big fan of?', trap: 'a show of reality' },
    /* Weekly words (2026-11-21): taught units (Unit 10 Taste This!, Unit 11 A Healthy Future, Unit 12 Incredible Wildlife). */
    { id: 'wk2-1121-animal', word: 'animal', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-21', p: ['a wild animal', 'a dangerous animal', 'a harmless animal', 'a farm animal', 'a weird animal', 'animals at work'], question: 'Which wild animal would you like to see? Why?', trap: 'a house animal' },
    { id: 'wk2-1121-feel', word: 'feel', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21', p: ['feel sick', 'feel ill', 'feel better', 'feel exhausted', 'feel tired', 'feel well'], question: 'What do you do when you feel ill?', trap: 'feel myself bad' },
    { id: 'wk2-1121-taste', word: 'taste', unit: 'Unit 10 · Taste This!', added: '2026-11-21', p: ['taste delicious', 'taste bitter', 'taste sour', 'taste sweet', 'taste disgusting', 'taste spicy'], question: 'What food tastes disgusting to you?', trap: 'taste deliciously' },
    { id: 'wk2-1121-break', word: 'break', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21', p: ['break your leg', 'break your arm', 'break a finger', 'break a toe', 'break your thumb', 'break your ankle'], question: 'Have you ever broken your arm or your leg? What happened?', trap: 'break the leg' },
    /* Weekly words: taught units (Unit 9 Shop Till You Drop, Unit 10 Taste This!, Unit 11 A Healthy Future). */
    { id: 'wk2-1118-got', word: 'got', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18', p: ['got a cold', 'got a cough', 'got a fever', 'got flu', 'got a sore throat', 'got toothache'], question: 'What do you do when you have got a cold?', trap: 'got a flu' },
    { id: 'wk2-1118-hurt', word: 'hurt', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18', p: ['hurt my knee', 'hurt my ankle', 'hurt my shoulder', 'hurt my elbow', 'hurt my thumb', 'hurt my back'], question: 'Have you ever hurt yourself? What happened?', trap: 'hurted my knee' },
    { id: 'wk2-1118-food', word: 'food', unit: 'Unit 10 · Taste This!', added: '2026-11-18', p: ['spicy food', 'fresh food', 'frozen food', 'delicious food', 'raw food', 'junk food'], question: 'What food do you never eat? Why?', trap: 'a sharp food (spicy)' },
    { id: 'wk2-1118-price', word: 'price', unit: 'Unit 9 · Shop Till You Drop', added: '2026-11-18', p: ['a high price', 'a low price', 'half price', 'full price', 'the price of', 'a good price'], question: 'What did you buy at a good price?', trap: 'a cheap price' },
    { id: 'wp2-decision', word: 'decision', p: ['make a decision', 'a difficult decision', 'a quick decision', 'the right decision', 'a big decision', 'change my decision'], question: 'What is a difficult decision you made?', trap: 'do a decision' },
    { id: 'wp2-problem', word: 'problem', p: ['solve a problem', 'have a problem', 'cause a problem', 'a serious problem', 'a big problem', 'no problem'], question: 'What problem in your city would you solve first?', trap: 'decide a problem' },
    { id: 'wp2-exam', word: 'exam', p: ['take an exam', 'pass an exam', 'fail an exam', 'study for an exam', 'an exam result', 'a difficult exam'], question: 'Tell us about an exam you remember.', trap: 'give an exam' },
    { id: 'wp2-rain', word: 'rain', p: ['heavy rain', 'light rain', 'in the rain', 'walk in the rain', 'the rain stopped', 'pouring rain'], question: 'What do you like doing on a rainy day?', trap: 'strong rain' },
    { id: 'wp2-traffic', word: 'traffic', p: ['heavy traffic', 'a traffic jam', 'stuck in traffic', 'traffic lights', 'rush-hour traffic', 'light traffic'], question: 'How is the traffic in your city?', trap: 'big traffic' },
    { id: 'wp2-advice', word: 'advice', p: ['give advice', 'take advice', 'ask for advice', 'good advice', 'a piece of advice', 'follow advice'], question: 'What is the best advice you ever got?', trap: 'an advice' },
    { id: 'wp2-habit', word: 'habit', p: ['a bad habit', 'a good habit', 'break a habit', 'get into the habit', 'an old habit', 'eating habits'], question: 'What bad habit do you want to break?', trap: 'leave a habit' },
    { id: 'wp2-attention', word: 'attention', p: ['pay attention', 'attract attention', 'my full attention', 'the centre of attention', 'need attention', 'draw attention to'], question: 'Do you like being the centre of attention?', trap: 'give attention on' }
  ] },
  /* 3. Intermediate (B1) */
  { words: [
    /* Weekly words (2026-11-28): taught units (Unit 13 #NoFilter, Unit 14 Let's Cook!). */
    { id: 'wk3-1128-photo', word: 'photo', unit: 'Unit 13 · #NoFilter', added: '2026-11-28', p: ['post a photo', 'share a photo', 'take a photo down', 'edit a photo', 'an airbrushed photo', 'tag someone in a photo'], question: 'Have you ever asked someone to take a photo down? Why?', trap: 'make a photo' },
    { id: 'wk3-1128-post', word: 'post', unit: 'Unit 13 · #NoFilter', added: '2026-11-28', p: ['comment on a post', 'like a post', 'share a post', 'delete a post', 'a funny post', 'write a post'], question: 'What kind of posts do you like or share?', trap: 'comment a post' },
    { id: 'wk3-1128-review', word: 'review', unit: 'Unit 13 · #NoFilter', added: '2026-11-28', p: ['write a review', 'an online review', 'a positive review', 'read reviews', 'a product review', 'a negative review'], question: 'Do you read reviews before you buy something? Why?', trap: 'make a review' },
    { id: 'wk3-1128-meat', word: 'meat', unit: 'Unit 14 · Let\'s Cook!', added: '2026-11-28', p: ['roast meat', 'grilled meat', 'fry meat', 'barbecue meat', 'raw meat', 'freeze meat'], question: 'How do people in your family usually cook meat?', trap: 'bake meat' },
    /* Weekly words (2026-11-21): taught units (Unit 10 Animals in Danger, Unit 11 Off to School, Unit 12 Getting Around). */
    { id: 'wk3-1121-flight', word: 'flight', unit: 'Unit 12 · Getting Around', added: '2026-11-21', p: ['book a flight', 'catch a flight', 'miss a flight', 'a long-haul flight', 'a delayed flight', 'an early flight'], question: 'Tell us about a flight you remember.', trap: 'sit on a flight' },
    { id: 'wk3-1121-trip', word: 'trip', unit: 'Unit 12 · Getting Around', added: '2026-11-21', p: ['go on a trip', 'a school trip', 'a business trip', 'a road trip', 'plan a trip', 'a day trip'], question: 'Where would you like to go on a road trip?', trap: 'make a trip' },
    { id: 'wk3-1121-education', word: 'education', unit: 'Unit 11 · Off to School', added: '2026-11-21', p: ['a good education', 'get an education', 'primary education', 'secondary education', 'pay for education', 'the education system'], question: 'What makes a good education?', trap: 'take education' },
    { id: 'wk3-1121-environment', word: 'environment', unit: 'Unit 10 · Animals in Danger', added: '2026-11-21', p: ['protect the environment', 'damage the environment', 'the ocean environment', 'harm the environment', 'the natural environment', 'care about the environment'], question: 'How can young people protect the environment?', trap: 'save environment' },
    /* Weekly words: taught units (Unit 9 The Future Is Now, Unit 10 Animals in Danger, Unit 11 Off to School). */
    { id: 'wk3-1118-battery', word: 'battery', unit: 'Unit 9 · The Future Is Now', added: '2026-11-18', p: ['charge the battery', 'a flat battery', 'battery life', 'the battery died', 'a new battery', 'a spare battery'], question: 'What do you do when your phone battery is flat?', trap: 'fill the battery' },
    { id: 'wk3-1118-habitat', word: 'habitat', unit: 'Unit 10 · Animals in Danger', added: '2026-11-18', p: ['lose their habitat', 'a natural habitat', 'protect a habitat', 'destroy a habitat', 'habitat loss', 'a safe habitat'], question: 'Why are many creatures losing their habitat?', trap: 'kill a habitat' },
    { id: 'wk3-1118-school', word: 'school', unit: 'Unit 11 · Off to School', added: '2026-11-18', p: ['attend a school', 'a boarding school', 'primary school', 'secondary school', 'leave school', 'school breaks up'], question: 'Would you like to go to a boarding school? Why?', trap: 'finish the school' },
    { id: 'wk3-1118-university', word: 'university', unit: 'Unit 11 · Off to School', added: '2026-11-18', p: ['go to university', 'apply to university', 'a university degree', 'at university', 'leave university', 'study at university'], question: 'What would you like to study at university?', trap: 'enter to university' },
    { id: 'wp3-effort', word: 'effort', p: ['make an effort', 'a lot of effort', 'put effort into', 'a real effort', 'worth the effort', 'a team effort'], question: 'What do you make a real effort to do every week?', trap: 'do an effort' },
    { id: 'wp3-risk', word: 'risk', p: ['take a risk', 'a big risk', 'reduce the risk', 'at risk', 'a health risk', 'worth the risk'], question: 'What is the biggest risk you have ever taken?', trap: 'make a risk' },
    { id: 'wp3-opportunity', word: 'opportunity', p: ['miss an opportunity', 'a great opportunity', 'take the opportunity', 'a job opportunity', 'a golden opportunity', 'equal opportunities'], question: 'Tell us about an opportunity you took or missed.', trap: 'lose an opportunity' },
    { id: 'wp3-experience', word: 'experience', p: ['gain experience', 'work experience', 'a great experience', 'from experience', 'life experience', 'share my experience'], question: 'What experience changed you?', trap: 'take experience' },
    { id: 'wp3-relationship', word: 'relationship', p: ['a close relationship', 'build a relationship', 'a long-distance relationship', 'a good relationship', 'end a relationship', 'a working relationship'], question: 'Who do you have a close relationship with?', trap: 'make a relationship' },
    { id: 'wp3-progress', word: 'progress', p: ['make progress', 'slow progress', 'real progress', 'check my progress', 'steady progress', 'a progress report'], question: 'Where are you making progress in English?', trap: 'do a progress' },
    { id: 'wp3-goal', word: 'goal', p: ['set a goal', 'reach a goal', 'a long-term goal', 'my main goal', 'achieve a goal', 'work towards a goal'], question: 'What goal did you set this year?', trap: 'make a goal' },
    { id: 'wp3-noise', word: 'noise', p: ['make a noise', 'a loud noise', 'background noise', 'a strange noise', 'traffic noise', 'hear a noise'], question: 'What noise annoys you the most?', trap: 'do noise' }
  ] },
  /* 4. IELTS 1 (B2) */
  { words: [
    { id: 'wp4-impression', word: 'impression', p: ['make an impression', 'a first impression', 'a good impression', 'a lasting impression', 'under the impression', 'give the impression'], question: 'How do you make a good first impression?', trap: 'produce an impression' },
    { id: 'wp4-conclusion', word: 'conclusion', p: ['come to a conclusion', 'reach a conclusion', 'jump to conclusions', 'draw a conclusion', 'in conclusion', 'a logical conclusion'], question: 'When do people jump to conclusions?', trap: 'make a conclusion' },
    { id: 'wp4-role', word: 'role', p: ['play a role', 'a key role', 'a leading role', 'a role model', 'take on a role', 'a vital role'], question: 'Who was a role model for you? Why?', trap: 'do a role' },
    { id: 'wp4-pressure', word: 'pressure', p: ['under pressure', 'put pressure on', 'peer pressure', 'cope with pressure', 'high pressure', 'pressure to succeed'], question: 'How do you cope with pressure?', trap: 'on pressure' },
    { id: 'wp4-responsibility', word: 'responsibility', p: ['take responsibility', 'a big responsibility', 'a sense of responsibility', 'share responsibility', 'accept responsibility', 'responsibility for'], question: 'What responsibilities did you have as a child?', trap: 'carry responsibility' },
    { id: 'wp4-crime', word: 'crime', p: ['commit a crime', 'a serious crime', 'the crime rate', 'fight crime', 'violent crime', 'reduce crime'], question: 'How can a city reduce crime?', trap: 'do a crime' },
    { id: 'wp4-research', word: 'research', p: ['do research', 'carry out research', 'research shows', 'scientific research', 'market research', 'research into'], question: 'How do you research before you buy something big?', trap: 'make a research' },
    { id: 'wp4-interest', word: 'interest', p: ['show interest', 'lose interest', 'a keen interest', 'take an interest in', 'common interests', 'a special interest'], question: 'What did you lose interest in as you got older?', trap: 'interest to something' }
  ] },
  /* 5. IELTS 2 (6.0) */
  { words: [
    { id: 'wp5-impact', word: 'impact', p: ['have an impact', 'a huge impact', 'a negative impact', 'impact on', 'minimise the impact', 'a long-term impact'], question: 'What has had the biggest impact on your life?', trap: 'make impact to' },
    { id: 'wp5-issue', word: 'issue', p: ['raise an issue', 'address an issue', 'a key issue', 'a controversial issue', 'tackle the issue', 'the issue of'], question: 'What issue should your government tackle first?', trap: 'rise an issue' },
    { id: 'wp5-measure', word: 'measures', p: ['take measures', 'drastic measures', 'safety measures', 'preventive measures', 'introduce measures', 'tough measures'], question: 'What measures should cities take against pollution?', trap: 'make measures' },
    { id: 'wp5-trend', word: 'trend', p: ['a growing trend', 'follow a trend', 'a current trend', 'set a trend', 'reverse the trend', 'an upward trend'], question: 'Which current trend do you dislike? Why?', trap: 'make a trend' },
    { id: 'wp5-standard', word: 'standard', p: ['high standards', 'living standards', 'raise standards', 'meet the standard', 'set a standard', 'below standard'], question: 'Have living standards in your country improved?', trap: 'life standard' },
    { id: 'wp5-demand', word: 'demand', p: ['meet demand', 'growing demand', 'high demand', 'in demand', 'demand for', 'supply and demand'], question: 'Which jobs will be in demand in ten years?', trap: 'answer the demand' },
    { id: 'wp5-consequence', word: 'consequences', p: ['face the consequences', 'serious consequences', 'as a consequence', 'unintended consequences', 'suffer the consequences', 'far-reaching consequences'], question: 'What are the consequences of using phones too much?', trap: 'consequences on' },
    { id: 'wp5-argument', word: 'argument', p: ['a strong argument', 'win an argument', 'have an argument', 'a convincing argument', 'put forward an argument', 'the argument for'], question: 'What is the strongest argument for learning languages?', trap: 'a heavy argument' }
  ] },
  /* 6. IELTS 3 (7.0+) */
  { words: [
    { id: 'wp6-criticism', word: 'criticism', p: ['come under criticism', 'harsh criticism', 'constructive criticism', 'face criticism', 'attract criticism', 'fierce criticism'], question: 'How do you react to constructive criticism?', trap: 'give a criticism' },
    { id: 'wp6-consensus', word: 'consensus', p: ['reach a consensus', 'a broad consensus', 'a growing consensus', 'a lack of consensus', 'consensus on', 'scientific consensus'], question: 'Is there a consensus on how to fix climate change?', trap: 'make a consensus' },
    { id: 'wp6-emphasis', word: 'emphasis', p: ['place emphasis on', 'heavy emphasis', 'shift the emphasis', 'particular emphasis', 'with emphasis on', 'lay emphasis on'], question: 'What should schools place more emphasis on?', trap: 'do emphasis on' },
    { id: 'wp6-threat', word: 'threat', p: ['pose a threat', 'a serious threat', 'a growing threat', 'under threat', 'an imminent threat', 'a threat to'], question: 'What poses the biggest threat to your city?', trap: 'a threat for' },
    { id: 'wp6-dilemma', word: 'dilemma', p: ['face a dilemma', 'a moral dilemma', 'resolve a dilemma', 'an ethical dilemma', 'in a dilemma', 'pose a dilemma'], question: 'Describe a moral dilemma you faced.', trap: 'decide a dilemma' },
    { id: 'wp6-compromise', word: 'compromise', p: ['reach a compromise', 'make compromises', 'an uneasy compromise', 'a reasonable compromise', 'room for compromise', 'refuse to compromise'], question: 'When should you refuse to compromise?', trap: 'do a compromise' },
    { id: 'wp6-scrutiny', word: 'scrutiny', p: ['come under scrutiny', 'close scrutiny', 'public scrutiny', 'intense scrutiny', 'avoid scrutiny', 'withstand scrutiny'], question: 'Should politicians\' private lives face public scrutiny?', trap: 'under a scrutiny' },
    { id: 'wp6-precedent', word: 'precedent', p: ['set a precedent', 'without precedent', 'a dangerous precedent', 'break with precedent', 'follow precedent', 'a legal precedent'], question: 'What decision set a dangerous precedent?', trap: 'make a precedent' }
  ] }
];
/* Screen text & timing, per level. */
WU.content.partnersScreen = {
  shared: {
    id: 'partners-screen',
    tag: 'WORD PARTNERS', ready: 'One word. Find its partners!',
    rule: 'Say a PHRASE with the word, not one word. "a decision" is not enough. "make a decision" is!', ruleShow: true,
    seconds: 90, strikes: 0, letters: false, pics: false,
    turn: '{team}: your turn!', classTurn: 'Everyone: say a phrase!', found: 'FOUND',
    hit: 'YES! A partner!', bonus: 'GOOD ONE! Not on the board, but it works.', wrong: 'Not a partner!',
    allFound: 'ALL FOUND!', boardWins: 'Learn the blue ones!', trapLabel: 'NOT', trapNote: 'Wrong partner!',
    useLabel: 'USE IT!', useWho: '{name}, answer!', useRule: 'Answer with 2 phrases from the board.', useSeconds: 40
  },
  levels: [
    { letters: true, pics: true, seconds: 120, rule: 'Look at the picture. Say the word AND its partner: "play football", not "football".', useRule: 'Answer with 1 phrase from the board.', useSeconds: 30 },
    { letters: true, pics: true, seconds: 120, rule: 'Look at the picture. Say the whole phrase: "catch a bus", not "bus".', useRule: 'Answer with 1 or 2 phrases from the board.', useSeconds: 30 },
    { seconds: 90 },
    { seconds: 90 },
    { seconds: 75, useRule: 'Answer with 3 phrases from the board.', useSeconds: 45 },
    { seconds: 75, useRule: 'Answer with 3 phrases from the board.', useSeconds: 45 },
    { seconds: 60, useRule: 'Answer with 3 phrases. Add a reason and an example.', useSeconds: 60 }
  ]
};
