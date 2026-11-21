/* Warm Up: content for ELIAS (Pre-Intermediate and up). Team word race: one student explains, their own team guesses.
   words[level]: { id, text, banned, unit, added }. banned = words the explainer must not say (IELTS levels), separated by commas.
   Weekly words (ids 'ewk<level>-<MMDD>-<word>') come first in a level, with unit = 'Unit N · Name' and added = 'YYYY-MM-DD':
   for 14 days they play first and show their unit on the board.
   Beginner and Elementary: empty (the game is grey there).
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
(function () {
  // [id suffix, word, banned] -> { id, text, banned }
  function L(prefix, rows) { return rows.map(function (r) { return { id: prefix + r[0], text: r[1], banned: r[2] || '' }; }); }
  WU.content.elias = [
    /* ---------- 0. Beginner (A1): not made for this level ---------- */
    { words: [] },
    /* ---------- 1. Elementary (A2): not made for this level ---------- */
    { words: [] },
    /* ---------- 2. Pre-Intermediate (A2+): everyday things, places, jobs ---------- */
    /* Weekly words (2026-11-21): taught units (Unit 10 Taste This!, Unit 11 A Healthy Future, Unit 12 Incredible Wildlife). They play first for 14 days. */
    { words: [
      { id: 'ewk2-1121-pineapple', text: 'pineapple', unit: 'Unit 10 · Taste This!', added: '2026-11-21' },
      { id: 'ewk2-1121-vegetarian', text: 'vegetarian', unit: 'Unit 10 · Taste This!', added: '2026-11-21' },
      { id: 'ewk2-1121-recipe', text: 'recipe', unit: 'Unit 10 · Taste This!', added: '2026-11-21' },
      { id: 'ewk2-1121-delicious', text: 'delicious', unit: 'Unit 10 · Taste This!', added: '2026-11-21' },
      { id: 'ewk2-1121-raw', text: 'raw', unit: 'Unit 10 · Taste This!', added: '2026-11-21' },
      { id: 'ewk2-1121-forehead', text: 'forehead', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21' },
      { id: 'ewk2-1121-knee', text: 'knee', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21' },
      { id: 'ewk2-1121-toothache', text: 'toothache', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21' },
      { id: 'ewk2-1121-flu', text: 'flu', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21' },
      { id: 'ewk2-1121-triathlon', text: 'triathlon', unit: 'Unit 11 · A Healthy Future', added: '2026-11-21' },
      { id: 'ewk2-1121-butterfly', text: 'butterfly', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-21' },
      { id: 'ewk2-1121-frog', text: 'frog', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-21' },
      { id: 'ewk2-1121-donkey', text: 'donkey', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-21' },
      { id: 'ewk2-1121-harmless', text: 'harmless', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-21' },
      { id: 'ewk2-1121-poison', text: 'poison', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-21' },
      /* Weekly words (2026-11-18): taught units (Unit 10 Taste This!, Unit 11 A Healthy Future, Unit 12 Incredible Wildlife). */
      { id: 'ewk2-1118-spicy', text: 'spicy', unit: 'Unit 10 · Taste This!', added: '2026-11-18' },
      { id: 'ewk2-1118-sour', text: 'sour', unit: 'Unit 10 · Taste This!', added: '2026-11-18' },
      { id: 'ewk2-1118-bitter', text: 'bitter', unit: 'Unit 10 · Taste This!', added: '2026-11-18' },
      { id: 'ewk2-1118-juicy', text: 'juicy', unit: 'Unit 10 · Taste This!', added: '2026-11-18' },
      { id: 'ewk2-1118-elbow', text: 'elbow', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18' },
      { id: 'ewk2-1118-ankle', text: 'ankle', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18' },
      { id: 'ewk2-1118-throat', text: 'throat', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18' },
      { id: 'ewk2-1118-thumb', text: 'thumb', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18' },
      { id: 'ewk2-1118-cough', text: 'cough', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18' },
      { id: 'ewk2-1118-fever', text: 'fever', unit: 'Unit 11 · A Healthy Future', added: '2026-11-18' },
      { id: 'ewk2-1118-mosquito', text: 'mosquito', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-18' },
      { id: 'ewk2-1118-eagle', text: 'eagle', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-18' },
      { id: 'ewk2-1118-wolf', text: 'wolf', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-18' },
      { id: 'ewk2-1118-shark', text: 'shark', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-18' },
      { id: 'ewk2-1118-penguin', text: 'penguin', unit: 'Unit 12 · Incredible Wildlife', added: '2026-11-18' },
    ].concat(L('el2-', [
      ['airport', 'airport'], ['passport', 'passport'], ['suitcase', 'suitcase'], ['ticket', 'ticket'], ['hotel', 'hotel'],
      ['map', 'map'], ['bridge', 'bridge'], ['museum', 'museum'], ['pharmacy', 'pharmacy'], ['bakery', 'bakery'],
      ['post-office', 'post office'], ['petrol-station', 'petrol station'], ['library', 'library'], ['stadium', 'stadium'], ['market', 'market'],
      ['neighbour', 'neighbour'], ['nurse', 'nurse'], ['firefighter', 'firefighter'], ['pilot', 'pilot'], ['waiter', 'waiter'],
      ['chef', 'chef'], ['farmer', 'farmer'], ['mechanic', 'mechanic'], ['scientist', 'scientist'], ['photographer', 'photographer'],
      ['wallet', 'wallet'], ['ladder', 'ladder'], ['mirror', 'mirror'], ['pillow', 'pillow'], ['blanket', 'blanket'],
      ['fridge', 'fridge'], ['oven', 'oven'], ['sofa', 'sofa'], ['toothbrush', 'toothbrush'], ['towel', 'towel'],
      ['scissors', 'scissors'], ['umbrella', 'umbrella'], ['backpack', 'backpack'], ['headphones', 'headphones'], ['remote-control', 'remote control'],
      ['breakfast', 'breakfast'], ['birthday', 'birthday'], ['wedding', 'wedding'], ['weekend', 'weekend'], ['holiday', 'holiday'],
      ['homework', 'homework'], ['exam', 'exam'], ['uniform', 'uniform'], ['timetable', 'timetable'], ['dictionary', 'dictionary'],
      ['soup', 'soup'], ['salad', 'salad'], ['honey', 'honey'], ['pepper', 'pepper'], ['popcorn', 'popcorn'],
      ['thunder', 'thunder'], ['rainbow', 'rainbow'], ['island', 'island'], ['desert', 'desert'], ['forest', 'forest'],
      ['tired', 'tired'], ['hungry', 'hungry'], ['angry', 'angry'], ['bored', 'bored'], ['scared', 'scared']
    ])) },
    /* ---------- 3. Intermediate (B1): work, travel, media, life events ---------- */
    /* Weekly words (2026-11-21): taught units (Unit 10 Animals in Danger, Unit 11 Off to School, Unit 12 Getting Around). They play first for 14 days. */
    { words: [
      { id: 'ewk3-1121-jungle', text: 'jungle', unit: 'Unit 10 · Animals in Danger', added: '2026-11-21' },
      { id: 'ewk3-1121-population', text: 'population', unit: 'Unit 10 · Animals in Danger', added: '2026-11-21' },
      { id: 'ewk3-1121-landscape', text: 'landscape', unit: 'Unit 10 · Animals in Danger', added: '2026-11-21' },
      { id: 'ewk3-1121-tropical', text: 'tropical', unit: 'Unit 10 · Animals in Danger', added: '2026-11-21' },
      { id: 'ewk3-1121-extinct', text: 'extinct', unit: 'Unit 10 · Animals in Danger', added: '2026-11-21' },
      { id: 'ewk3-1121-timetable', text: 'timetable', unit: 'Unit 11 · Off to School', added: '2026-11-21' },
      { id: 'ewk3-1121-textbook', text: 'textbook', unit: 'Unit 11 · Off to School', added: '2026-11-21' },
      { id: 'ewk3-1121-lunchtime', text: 'lunchtime', unit: 'Unit 11 · Off to School', added: '2026-11-21' },
      { id: 'ewk3-1121-celebrate', text: 'celebrate', unit: 'Unit 11 · Off to School', added: '2026-11-21' },
      { id: 'ewk3-1121-set-off', text: 'set off', unit: 'Unit 12 · Getting Around', added: '2026-11-21' },
      { id: 'ewk3-1121-youth-hostel', text: 'youth hostel', unit: 'Unit 12 · Getting Around', added: '2026-11-21' },
      { id: 'ewk3-1121-airline', text: 'airline', unit: 'Unit 12 · Getting Around', added: '2026-11-21' },
      { id: 'ewk3-1121-passport', text: 'passport', unit: 'Unit 12 · Getting Around', added: '2026-11-21' },
      { id: 'ewk3-1121-on-foot', text: 'on foot', unit: 'Unit 12 · Getting Around', added: '2026-11-21' },
      { id: 'ewk3-1121-on-purpose', text: 'on purpose', unit: 'Unit 12 · Getting Around', added: '2026-11-21' },
      /* Weekly words (2026-11-18): taught units (Unit 10 Animals in Danger, Unit 11 Off to School, Unit 12 Getting Around). */
      { id: 'ewk3-1118-rainforest', text: 'rainforest', unit: 'Unit 10 · Animals in Danger', added: '2026-11-18' },
      { id: 'ewk3-1118-habitat', text: 'habitat', unit: 'Unit 10 · Animals in Danger', added: '2026-11-18' },
      { id: 'ewk3-1118-crops', text: 'crops', unit: 'Unit 10 · Animals in Danger', added: '2026-11-18' },
      { id: 'ewk3-1118-endangered', text: 'endangered', unit: 'Unit 10 · Animals in Danger', added: '2026-11-18' },
      { id: 'ewk3-1118-hunting', text: 'hunting', unit: 'Unit 10 · Animals in Danger', added: '2026-11-18' },
      { id: 'ewk3-1118-boarding-school', text: 'boarding school', unit: 'Unit 11 · Off to School', added: '2026-11-18' },
      { id: 'ewk3-1118-degree', text: 'degree', unit: 'Unit 11 · Off to School', added: '2026-11-18' },
      { id: 'ewk3-1118-qualifications', text: 'qualifications', unit: 'Unit 11 · Off to School', added: '2026-11-18' },
      { id: 'ewk3-1118-undergraduate', text: 'undergraduate', unit: 'Unit 11 · Off to School', added: '2026-11-18' },
      { id: 'ewk3-1118-headteacher', text: 'headteacher', unit: 'Unit 11 · Off to School', added: '2026-11-18' },
      { id: 'ewk3-1118-cruise-ship', text: 'cruise ship', unit: 'Unit 12 · Getting Around', added: '2026-11-18' },
      { id: 'ewk3-1118-ferry', text: 'ferry', unit: 'Unit 12 · Getting Around', added: '2026-11-18' },
      { id: 'ewk3-1118-abroad', text: 'abroad', unit: 'Unit 12 · Getting Around', added: '2026-11-18' },
      { id: 'ewk3-1118-check-in', text: 'check in', unit: 'Unit 12 · Getting Around', added: '2026-11-18' },
      { id: 'ewk3-1118-unpack', text: 'unpack', unit: 'Unit 12 · Getting Around', added: '2026-11-18' },
    ].concat(L('el3-', [
      ['deadline', 'deadline'], ['interview', 'job interview'], ['salary', 'salary'], ['boss', 'boss'], ['colleague', 'colleague'],
      ['volunteer', 'volunteer'], ['promotion', 'promotion'], ['retirement', 'retirement'], ['overtime', 'overtime'], ['commute', 'commute'],
      ['rush-hour', 'rush hour'], ['traffic-jam', 'traffic jam'], ['luggage', 'luggage'], ['souvenir', 'souvenir'], ['jet-lag', 'jet lag'],
      ['delay', 'delay'], ['customs', 'customs'], ['campsite', 'campsite'], ['tour-guide', 'tour guide'], ['homesick', 'homesick'],
      ['password', 'password'], ['screenshot', 'screenshot'], ['charger', 'charger'], ['podcast', 'podcast'], ['influencer', 'influencer'],
      ['subscription', 'subscription'], ['headline', 'headline'], ['advertisement', 'advertisement'], ['documentary', 'documentary'], ['biography', 'biography'],
      ['earthquake', 'earthquake'], ['flood', 'flood'], ['pollution', 'pollution'], ['recycling', 'recycling'], ['sunscreen', 'sunscreen'],
      ['recipe', 'recipe'], ['ingredient', 'ingredient'], ['leftovers', 'leftovers'], ['vegetarian', 'vegetarian'], ['diet', 'diet'],
      ['headache', 'headache'], ['dentist', 'dentist'], ['prescription', 'prescription'], ['nightmare', 'nightmare'], ['alarm-clock', 'alarm clock'],
      ['referee', 'referee'], ['trophy', 'trophy'], ['audience', 'audience'], ['rehearsal', 'rehearsal'], ['sculpture', 'sculpture'],
      ['discount', 'discount'], ['receipt', 'receipt'], ['refund', 'refund'], ['rent', 'rent'], ['landlord', 'landlord'],
      ['honeymoon', 'honeymoon'], ['anniversary', 'anniversary'], ['twins', 'twins'], ['teenager', 'teenager'], ['childhood', 'childhood'],
      ['embarrassed', 'embarrassed'], ['jealous', 'jealous'], ['proud', 'proud'], ['nervous', 'nervous'], ['generous', 'generous']
    ])) },
    /* ---------- 4. IELTS 1 (B2): banned words on ---------- */
    { words: L('el4-', [
      ['procrastination', 'procrastination', 'later, lazy, delay'], ['deadline', 'deadline', 'date, finish, time'], ['commute', 'commute', 'travel, work, bus'],
      ['unemployment', 'unemployment', 'job, work, without'], ['scholarship', 'scholarship', 'money, university, study'], ['internship', 'internship', 'job, student, experience'],
      ['pollution', 'pollution', 'air, dirty, factory'], ['recycling', 'recycling', 'plastic, bin, again'], ['drought', 'drought', 'rain, water, dry'],
      ['endangered', 'endangered species', 'animal, extinct, danger'], ['deforestation', 'deforestation', 'trees, cut, forest'], ['renewable', 'renewable energy', 'sun, wind, green'],
      ['tourism', 'tourism', 'travel, visitors, holiday'], ['jet-lag', 'jet lag', 'time, tired, flight'], ['souvenir', 'souvenir', 'gift, remember, trip'],
      ['influencer', 'influencer', 'Instagram, followers, social'], ['fake-news', 'fake news', 'false, lie, media'], ['advertisement', 'advertisement', 'sell, TV, product'],
      ['privacy', 'privacy', 'private, secret, personal'], ['password', 'password', 'secret, login, letters'], ['addiction', 'addiction', 'stop, can\'t, drugs'],
      ['obesity', 'obesity', 'fat, weight, food'], ['vaccine', 'vaccine', 'injection, doctor, disease'], ['insomnia', 'insomnia', 'sleep, night, awake'],
      ['stress', 'stress', 'worried, pressure, nervous'], ['gym', 'gym', 'sport, exercise, muscles'], ['nutrition', 'nutrition', 'food, healthy, vitamins'],
      ['curriculum', 'curriculum', 'school, subjects, programme'], ['homeschooling', 'homeschooling', 'home, parents, school'], ['plagiarism', 'plagiarism', 'copy, cheat, essay'],
      ['generation-gap', 'generation gap', 'old, young, parents'], ['peer-pressure', 'peer pressure', 'friends, same, force'], ['role-model', 'role model', 'example, admire, copy'],
      ['skyscraper', 'skyscraper', 'tall, building, floors'], ['suburb', 'suburb', 'city, outside, houses'], ['rush-hour', 'rush hour', 'traffic, busy, morning'],
      ['inflation', 'inflation', 'prices, money, rise'], ['budget', 'budget', 'money, plan, spend'], ['mortgage', 'mortgage', 'bank, house, loan'],
      ['volunteer', 'volunteer', 'free, help, money'], ['charity', 'charity', 'money, help, poor'], ['ambition', 'ambition', 'goal, dream, success']
    ]) },
    /* ---------- 5. IELTS 2 (6.0) ---------- */
    { words: L('el5-', [
      ['urbanisation', 'urbanisation', 'city, move, countryside'], ['globalisation', 'globalisation', 'world, international, countries'], ['brain-drain', 'brain drain', 'leave, country, educated'],
      ['work-life-balance', 'work-life balance', 'job, family, time'], ['remote-work', 'remote work', 'home, office, online'], ['burnout', 'burnout', 'tired, stress, work'],
      ['carbon-footprint', 'carbon footprint', 'CO2, pollution, travel'], ['climate-change', 'climate change', 'weather, warm, planet'], ['biodiversity', 'biodiversity', 'species, animals, plants'],
      ['sustainability', 'sustainability', 'future, green, environment'], ['fossil-fuels', 'fossil fuels', 'oil, coal, gas'], ['overpopulation', 'overpopulation', 'people, too many, world'],
      ['cyberbullying', 'cyberbullying', 'online, internet, attack'], ['screen-time', 'screen time', 'phone, hours, children'], ['artificial-intelligence', 'artificial intelligence', 'computer, robot, think'],
      ['surveillance', 'surveillance', 'camera, watch, police'], ['censorship', 'censorship', 'ban, media, government'], ['propaganda', 'propaganda', 'government, lies, media'],
      ['democracy', 'democracy', 'vote, people, election'], ['tax', 'tax', 'money, government, pay'], ['minimum-wage', 'minimum wage', 'money, hour, lowest'],
      ['life-expectancy', 'life expectancy', 'age, live, years'], ['ageing-population', 'ageing population', 'old, people, pension'], ['pension', 'pension', 'old, retire, money'],
      ['mental-health', 'mental health', 'mind, depression, doctor'], ['sedentary', 'sedentary lifestyle', 'sit, move, exercise'], ['junk-food', 'junk food', 'fast, burger, unhealthy'],
      ['tuition-fees', 'tuition fees', 'university, money, pay'], ['rote-learning', 'rote learning', 'memorise, repeat, heart'], ['gap-year', 'gap year', 'year, travel, university'],
      ['mass-tourism', 'mass tourism', 'tourists, many, crowds'], ['heritage', 'cultural heritage', 'history, old, traditions'], ['ecotourism', 'ecotourism', 'nature, green, travel'],
      ['consumerism', 'consumerism', 'buy, shopping, things'], ['brand-loyalty', 'brand loyalty', 'buy, same, company'], ['impulse-buying', 'impulse buying', 'buy, plan, shop'],
      ['traffic-congestion', 'traffic congestion', 'cars, jam, roads'], ['public-transport', 'public transport', 'bus, metro, train'], ['infrastructure', 'infrastructure', 'roads, bridges, build'],
      ['nuclear-family', 'nuclear family', 'parents, children, small'], ['single-parent', 'single parent', 'mother, father, alone'], ['sibling-rivalry', 'sibling rivalry', 'brother, sister, compete']
    ]) },
    /* ---------- 6. IELTS 3 (7.0+) ---------- */
    { words: L('el6-', [
      ['gentrification', 'gentrification', 'rich, area, rent'], ['urban-sprawl', 'urban sprawl', 'city, grow, outside'], ['gig-economy', 'gig economy', 'Uber, freelance, jobs'],
      ['automation', 'automation', 'robots, machines, jobs'], ['meritocracy', 'meritocracy', 'talent, deserve, success'], ['nepotism', 'nepotism', 'family, job, relatives'],
      ['greenwashing', 'greenwashing', 'green, fake, company'], ['carbon-offset', 'carbon offsetting', 'trees, plant, CO2'], ['circular-economy', 'circular economy', 'recycle, reuse, waste'],
      ['echo-chamber', 'echo chamber', 'same, opinions, social media'], ['misinformation', 'misinformation', 'false, news, wrong'], ['clickbait', 'clickbait', 'click, headline, link'],
      ['data-breach', 'data breach', 'hackers, stolen, information'], ['digital-divide', 'digital divide', 'internet, poor, access'], ['algorithm', 'algorithm', 'computer, rules, recommend'],
      ['universal-basic-income', 'universal basic income', 'money, everyone, government'], ['wealth-gap', 'wealth gap', 'rich, poor, difference'], ['tax-evasion', 'tax evasion', 'pay, illegal, hide'],
      ['soft-power', 'soft power', 'culture, influence, country'], ['sanctions', 'sanctions', 'punish, country, trade'], ['lobbying', 'lobbying', 'politicians, influence, company'],
      ['placebo', 'placebo effect', 'medicine, fake, believe'], ['preventive-medicine', 'preventive medicine', 'doctor, before, ill'], ['euthanasia', 'euthanasia', 'die, doctor, choice'],
      ['standardised-testing', 'standardised testing', 'exam, same, students'], ['lifelong-learning', 'lifelong learning', 'study, age, always'], ['critical-thinking', 'critical thinking', 'think, question, analyse'],
      ['overtourism', 'overtourism', 'tourists, too many, city'], ['cultural-appropriation', 'cultural appropriation', 'culture, take, copy'], ['assimilation', 'assimilation', 'immigrants, culture, adapt'],
      ['planned-obsolescence', 'planned obsolescence', 'break, buy, new'], ['fast-fashion', 'fast fashion', 'clothes, cheap, Zara'], ['minimalism', 'minimalism', 'less, things, simple'],
      ['dystopia', 'dystopia', 'future, bad, novel'], ['nostalgia', 'nostalgia', 'past, miss, memories'], ['hindsight', 'hindsight', 'after, past, know'],
      ['bureaucracy', 'bureaucracy', 'papers, government, slow'], ['whistleblower', 'whistleblower', 'secret, tell, company'], ['scapegoat', 'scapegoat', 'blame, fault, innocent'],
      ['filter-bubble', 'filter bubble', 'internet, same, see'], ['social-mobility', 'social mobility', 'class, poor, rise'], ['brain-gain', 'brain gain', 'immigrants, educated, come']
    ]) }
  ];
})();

WU.content.eliasScreen = {
  shared: {
    id: 'elias-screen',
    tag: 'ELIAS', secs: 60, goal: 15, skipMinus: true, lastShow: true,
    who: 'Who explains?', qMark: '?',
    rule: 'Explain the word to YOUR team. Your team guesses.', ruleShow: true,
    rule2: "Don't say the word or part of it. No gestures!", rule2Show: true,
    frame: '', banned: "Don't say:",
    turn: "{team}'s turn", goalText: 'First to {n} wins!',
    got: 'Got it', skipped: 'Skipped',
    last: 'LAST WORD! Any team can steal it.', lastAsk: 'Who guessed it? Press 1-{n}', nobody: 'Nobody',
    review: 'Check the words. Tap a word to change it.', roundPts: '{team}: {n}',
    win: '{team} WINS!',
    teamA: 'TEAM A', teamB: 'TEAM B',
    wordOnBoard: false, laptopTip: 'Explainer: stand at the laptop and read the word there.',
    hidden: 'The word is on the laptop. Explain it!',
    demo: 'TEACHER DEMO: I explain first!', demoShow: false, demoWho: 'TEACHER'
  },
  levels: [
    {}, {},
    { secs: 75, skipMinus: false, rule2: "Don't say the word. No gestures. Easy English is OK!",
      frame: "It's a place / a thing / a person... You use it to ___.", demoShow: true },
    { frame: "It's a kind of ___. / It's the opposite of ___." },
    { rule2: "Don't say the word, part of it, or the banned words." },
    { rule2: "Don't say the word, part of it, or the banned words.", goal: 20 },
    { rule2: "Don't say the word, part of it, or the banned words.", secs: 50, goal: 20 }
  ]
};
