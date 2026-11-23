/* Warm Up: content for SENTENCE TRAIN (grammar + writing). A sentence is cut into chunks and mixed up.
   Students put the chunks back in the right order; every chunk sits in a carriage that shows its job in the sentence
   (SUBJECT, VERB, OBJECT, WHERE, WHEN...). Then a twist: make it negative, a question, a short answer, longer...
   Levels grow from S + V + O (Beginner) to inversion and mixed conditionals (IELTS 3).
   items[level]: { id, k, s, r, tk, th, ta, why }
     s  = the sentence in the RIGHT order, chunks separated by " / " (2 to 12 chunks). The game mixes them.
     r  = the job of each chunk, same order, separated by " / " (codes from the Jobs list: S, V, O, AUX, NOT...).
     k  = kind: '+' positive, '-' negative, '?' yes / no question, 'wh' wh- question, '2' two parts, 'long' long sentence.
     tk = twist after the check: 'neg', 'q', 'pos', 'wh', 'short', 'ans', 'long' or '' (none).
     th = a hint after the twist ("Start with: How long"). ta = its answer (alternatives separated by " | ").
          'ans' and 'long' are open: ta is one example.
     why = the word-order rule, shown after the check (empty = none).
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};

/* The jobs a chunk can do (the carriage colour and the label under it). Same at every level. */
WU.content.sentenceRoles = [
  { id: 'sr-s', code: 'S', name: 'SUBJECT', color: '#3d6bff' },
  { id: 'sr-aux', code: 'AUX', name: 'HELPER', color: '#ff5a1f' },
  { id: 'sr-not', code: 'NOT', name: 'NOT / NEGATIVE', color: '#0d0d0d' },
  { id: 'sr-v', code: 'V', name: 'VERB', color: '#ff4fc3' },
  { id: 'sr-io', code: 'IO', name: 'TO WHOM', color: '#00e5c7' },
  { id: 'sr-o', code: 'O', name: 'OBJECT', color: '#c6ff00' },
  { id: 'sr-c', code: 'C', name: 'COMPLEMENT', color: '#ffe600' },
  { id: 'sr-freq', code: 'FREQ', name: 'HOW OFTEN', color: '#ffb03a' },
  { id: 'sr-how', code: 'HOW', name: 'HOW', color: '#a98bff' },
  { id: 'sr-where', code: 'WHERE', name: 'WHERE', color: '#33c24d' },
  { id: 'sr-when', code: 'WHEN', name: 'WHEN', color: '#6fd3ff' },
  { id: 'sr-why', code: 'WHY', name: 'WHY', color: '#ff8fa3' },
  { id: 'sr-wh', code: 'WH', name: 'QUESTION WORD', color: '#ff2d55' },
  { id: 'sr-link', code: 'LINK', name: 'LINKER', color: '#ffffff' },
  { id: 'sr-rel', code: 'REL', name: 'WHICH ONE?', color: '#d9c8ff' },
  { id: 'sr-by', code: 'BY', name: 'BY WHOM', color: '#b8f5e8' },
  { id: 'sr-open', code: 'OPEN', name: 'OPENER', color: '#e6e1d3' }
];

WU.content.sentence = [
  /* ---------- 0. Beginner (A1): S + V + O · be · always / never · can · don't / doesn't · Do...? Is...? · and / but ---------- */
  { items: [
    { id: 'a1-st-football', k: '+', s: 'I / play / football / every day.', r: 'S / V / O / WHEN', tk: 'neg', th: '', ta: "I don't play football every day. | I do not play football every day.", why: 'WHO + DOES + WHAT. WHEN goes at the end.' },
    { id: 'a1-st-cats', k: '+', s: 'My sister / likes / cats.', r: 'S / V / O', tk: 'q', th: '', ta: 'Does your sister like cats? | Does my sister like cats?', why: 'he / she / it: likes (verb + s).' },
    { id: 'a1-st-happy', k: '+', s: 'Tom / is / very happy / today.', r: 'S / V / C / WHEN', tk: 'long', th: 'Add WHY: because...', ta: 'Tom is very happy today because it is his birthday.', why: 'be: WHO + is + HOW he is (happy).' },
    { id: 'a1-st-breakfast', k: '+', s: 'We / always / have / breakfast / at home.', r: 'S / FREQ / V / O / WHERE', tk: 'neg', th: '', ta: "We don't always have breakfast at home. | We do not always have breakfast at home.", why: 'always / often / never go BEFORE the verb.' },
    { id: 'a1-st-meat', k: '-', s: "She / doesn't / eat / meat.", r: 'S / AUX / V / O', tk: 'pos', th: '', ta: 'She eats meat.', why: "doesn't + verb with no -s: doesn't eat." },
    { id: 'a1-st-pizza', k: '?', s: 'Do / you / like / pizza?', r: 'AUX / S / V / O', tk: 'short', th: '', ta: "Yes, I do. | No, I don't. | No, I do not.", why: 'Question: Do + WHO + verb + WHAT?' },
    { id: 'a1-st-school', k: '?', s: 'Is / your brother / at school / now?', r: 'V / S / WHERE / WHEN', tk: 'short', th: '', ta: "Yes, he is. | No, he isn't. | No, he's not. | No, he is not.", why: 'Question with be: Is + WHO + WHERE?' },
    { id: 'a1-st-live', k: 'wh', s: 'Where / do / you / live?', r: 'WH / AUX / S / V', tk: 'ans', th: '', ta: 'I live in a flat near the city centre.', why: 'WHERE + do + you + verb?' },
    { id: 'a1-st-doing', k: 'wh', s: 'What / is / she / doing / now?', r: 'WH / AUX / S / V / WHEN', tk: 'ans', th: '', ta: "She's reading a book in her room.", why: 'WHAT + is + she + doing?' },
    { id: 'a1-st-tv', k: '+', s: 'They / are watching / TV / in the living room.', r: 'S / V / O / WHERE', tk: 'q', th: '', ta: 'Are they watching TV in the living room?', why: 'WHAT first, then WHERE.' },
    { id: 'a1-st-swim', k: '+', s: 'He / can / swim / very well.', r: 'S / AUX / V / HOW', tk: 'neg', th: '', ta: "He can't swim very well. | He cannot swim very well.", why: 'can + verb (no "to"): can swim.' },
    { id: 'a1-st-apples', k: '2', s: "I / like / apples, / but / I / don't like / bananas.", r: 'S / V / O / LINK / S / V / O', tk: '', th: '', ta: '', why: 'Two sentences with BUT in the middle.' },
    { id: 'a1-st-dishes', k: '2', s: 'My dad / cooks / dinner, / and / I / wash / the dishes.', r: 'S / V / O / LINK / S / V / O', tk: 'long', th: 'Add WHEN at the end', ta: 'My dad cooks dinner, and I wash the dishes every evening.', why: 'Two sentences with AND in the middle.' },
    { id: 'a1-st-home', k: '-', s: "We / aren't / at home / today.", r: 'S / V / WHERE / WHEN', tk: 'q', th: '', ta: 'Are you at home today? | Are we at home today?', why: "be + not: aren't. WHERE, then WHEN." }
  ] },
  /* ---------- 1. Elementary (A2): + WHERE + WHEN · past simple · did / didn't · going to · give me a... · because / so / but ---------- */
  { items: [
    { id: 'a2-st-grandparents', k: '+', s: 'I / visited / my grandparents / in the village / last weekend.', r: 'S / V / O / WHERE / WHEN', tk: 'neg', th: '', ta: "I didn't visit my grandparents in the village last weekend. | I did not visit my grandparents in the village last weekend.", why: 'WHAT, then WHERE, then WHEN.' },
    { id: 'a2-st-jacket', k: '+', s: 'She / bought / a new jacket / at the shopping centre / yesterday.', r: 'S / V / O / WHERE / WHEN', tk: 'q', th: '', ta: 'Did she buy a new jacket at the shopping centre yesterday?', why: 'Question in the past: Did + she + buy (not bought).' },
    { id: 'a2-st-present', k: '+', s: 'My mum / gave / me / a present / on my birthday.', r: 'S / V / IO / O / WHEN', tk: 'neg', th: '', ta: "My mum didn't give me a present on my birthday. | My mum did not give me a present on my birthday.", why: 'give + WHO + WHAT: gave me a present.' },
    { id: 'a2-st-cinema', k: '-', s: "We / didn't / go / to the cinema / on Friday.", r: 'S / AUX / V / WHERE / WHEN', tk: 'q', th: '', ta: 'Did you go to the cinema on Friday? | Did we go to the cinema on Friday?', why: "didn't + verb (no -ed): didn't go." },
    { id: 'a2-st-film', k: '?', s: 'Did / you / see / the film / last night?', r: 'AUX / S / V / O / WHEN', tk: 'short', th: '', ta: "Yes, I did. | No, I didn't. | No, I did not.", why: 'Did + WHO + verb + WHAT + WHEN?' },
    { id: 'a2-st-summer', k: 'wh', s: 'Where / did / you / go / last summer?', r: 'WH / AUX / S / V / WHEN', tk: 'ans', th: '', ta: 'I went to the mountains with my family.', why: 'WHERE + did + you + verb?' },
    { id: 'a2-st-getup', k: 'wh', s: 'What time / do / you / usually / get up?', r: 'WH / AUX / S / FREQ / V', tk: 'ans', th: '', ta: 'I usually get up at seven o\'clock.', why: 'usually goes before the main verb, in questions too.' },
    { id: 'a2-st-museum', k: '+', s: 'We / are going to / visit / the museum / on Saturday.', r: 'S / AUX / V / O / WHEN', tk: 'q', th: '', ta: 'Are you going to visit the museum on Saturday? | Are we going to visit the museum on Saturday?', why: 'be going to + verb for plans.' },
    { id: 'a2-st-dog', k: '+', s: 'He / often / walks / his dog / in the park / after school.', r: 'S / FREQ / V / O / WHERE / WHEN', tk: 'neg', th: '', ta: "He doesn't often walk his dog in the park after school. | He does not often walk his dog in the park after school.", why: 'often before the verb. WHERE before WHEN.' },
    { id: 'a2-st-ill', k: '2', s: 'I / stayed / at home / because / I / was / ill.', r: 'S / V / WHERE / LINK / S / V / C', tk: '', th: '', ta: '', why: 'Part 1 + BECAUSE + part 2 (the reason).' },
    { id: 'a2-st-raining', k: '2', s: 'It / was raining, / so / we / played / board games / inside.', r: 'S / V / LINK / S / V / O / WHERE', tk: '', th: '', ta: '', why: 'Part 1 (what happened) + SO + part 2 (the result).' },
    { id: 'a2-st-homework', k: '2', s: 'She / was / tired, / but / she / finished / her homework.', r: 'S / V / C / LINK / S / V / O', tk: 'long', th: 'Add WHEN at the end', ta: 'She was tired, but she finished her homework before dinner.', why: 'BUT joins two different ideas.' },
    { id: 'a2-st-clothes', k: '+', s: 'They / are wearing / warm clothes / today.', r: 'S / V / O / WHEN', tk: 'q', th: '', ta: 'Are they wearing warm clothes today?', why: 'are + verb-ing for now.' },
    { id: 'a2-st-phone', k: 'wh', s: 'How much / did / your new phone / cost?', r: 'WH / AUX / S / V', tk: 'ans', th: '', ta: 'It cost about two hundred dollars.', why: 'How much + did + WHO / WHAT + verb?' }
  ] },
  /* ---------- 2. Pre-Intermediate (A2+): present perfect · will / might / should · who-questions · if / when · so... that ---------- */
  { items: [
    { id: 'a2p-st-plane', k: '+', s: 'My parents / have never travelled / by plane / before.', r: 'S / V / HOW / WHEN', tk: 'q', th: 'Use: ever', ta: 'Have your parents ever travelled by plane before? | Have my parents ever travelled by plane before?', why: 'have + never + past participle.' },
    { id: 'a2p-st-project', k: '+', s: 'She / has already finished / her science project.', r: 'S / V / O', tk: 'neg', th: 'Use: yet', ta: "She hasn't finished her science project yet. | She has not finished her science project yet.", why: 'already goes between has and the past participle.' },
    { id: 'a2p-st-howlong', k: 'wh', s: 'How long / have / you / lived / in this city?', r: 'WH / AUX / S / V / WHERE', tk: 'ans', th: '', ta: "I've lived here for ten years.", why: 'How long + have + you + past participle?' },
    { id: 'a2p-st-sandwich', k: 'wh', s: 'Who / ate / my sandwich / in the kitchen / this morning?', r: 'WH / V / O / WHERE / WHEN', tk: 'ans', th: '', ta: 'My little brother ate it.', why: 'WHO is the subject, so no did: Who ate...? (NOT Who did eat...?)' },
    { id: 'a2p-st-cheaper', k: '+', s: 'This phone / is / much cheaper / than my old one.', r: 'S / V / C / C', tk: 'long', th: 'Add: but...', ta: 'This phone is much cheaper than my old one, but the camera is worse.', why: 'much + comparative + than.' },
    { id: 'a2p-st-water', k: '+', s: 'You / should / drink / more water / every day.', r: 'S / AUX / V / O / WHEN', tk: 'q', th: '', ta: 'Should I drink more water every day? | Should you drink more water every day?', why: 'should + verb (no "to").' },
    { id: 'a2p-st-rains', k: '2', s: 'If / it / rains / tomorrow, / we / will stay / at home.', r: 'LINK / S / V / WHEN / S / V / WHERE', tk: '', th: '', ta: '', why: 'If + present, will + verb. No will after if!' },
    { id: 'a2p-st-gothome', k: '2', s: 'When / I / got / home, / my brother / was playing / video games.', r: 'LINK / S / V / WHERE / S / V / O', tk: '', th: '', ta: '', why: 'Past simple (short action) + past continuous (longer action).' },
    { id: 'a2p-st-slowly', k: '+', s: 'The old man / walked / slowly / across the road / this morning.', r: 'S / V / HOW / WHERE / WHEN', tk: 'q', th: '', ta: 'Did the old man walk slowly across the road this morning?', why: 'HOW (slowly) after the verb, then WHERE, then WHEN.' },
    { id: 'a2p-st-call', k: '+', s: 'I / will probably / call / you / later.', r: 'S / AUX / V / O / WHEN', tk: 'neg', th: '', ta: "I probably won't call you later. | I probably will not call you later.", why: 'will probably... BUT probably won\'t.' },
    { id: 'a2p-st-cousins', k: '-', s: "We / haven't seen / our cousins / for two years.", r: 'S / V / O / WHEN', tk: '', th: '', ta: '', why: 'for + a period of time (for two years). since + a point in time (since 2023).' },
    { id: 'a2p-st-sofa', k: '2', s: 'I / was / so tired / that / I / fell asleep / on the sofa.', r: 'S / V / C / LINK / S / V / WHERE', tk: '', th: '', ta: '', why: 'so + adjective + that + the result.' },
    { id: 'a2p-st-sushi', k: '?', s: 'Have / you / ever / eaten / sushi?', r: 'AUX / S / FREQ / V / O', tk: 'short', th: '', ta: "Yes, I have. | No, I haven't. | No, I have not. | No, I've never eaten sushi. | No, I have never eaten sushi.", why: 'Have + you + ever + past participle?' },
    { id: 'a2p-st-test', k: '+', s: 'My teacher / might / give / us / a test / on Monday.', r: 'S / AUX / V / IO / O / WHEN', tk: 'neg', th: '', ta: 'My teacher might not give us a test on Monday.', why: 'give + WHO + WHAT: give us a test.' }
  ] },
  /* ---------- 3. Intermediate (B1): passive · who / which / that · 2nd conditional · past perfect · indirect questions · used to ---------- */
  { items: [
    { id: 'b1-st-neighbour', k: '+', s: 'The woman / who lives next door / works / at the hospital.', r: 'S / REL / V / WHERE', tk: 'q', th: '', ta: 'Does the woman who lives next door work at the hospital?', why: 'WHO + clause straight after the person it describes.' },
    { id: 'b1-st-library', k: '+', s: 'The new library / will be opened / by the mayor / next month.', r: 'S / V / BY / WHEN', tk: 'neg', th: '', ta: "The new library won't be opened by the mayor next month. | The new library will not be opened by the mayor next month.", why: 'Passive: will be + past participle (+ by...).' },
    { id: 'b1-st-guitar', k: '2', s: 'If / I / had / more free time, / I / would learn / to play the guitar.', r: 'LINK / S / V / O / S / V / O', tk: '', th: '', ta: '', why: 'If + past, would + verb (not real now).' },
    { id: 'b1-st-train', k: '2', s: 'By the time / we / arrived / at the station, / the train / had already left.', r: 'LINK / S / V / WHERE / S / V', tk: '', th: '', ta: '', why: 'had + past participle = the action that happened FIRST.' },
    { id: 'b1-st-bank', k: '?', s: 'Do you know / where / the nearest bank / is?', r: 'OPEN / WH / S / V', tk: '', th: '', ta: '', why: 'Inside a question: where + the bank + is (NOT where is the bank).' },
    { id: 'b1-st-museum', k: '?', s: 'Could you tell me / what time / the museum / opens?', r: 'OPEN / WH / S / V', tk: '', th: '', ta: '', why: 'what time + the museum + opens (no does).' },
    { id: 'b1-st-basketball', k: '+', s: 'I / used to / play / basketball / every weekend / when I was younger.', r: 'S / AUX / V / O / WHEN / WHEN', tk: 'neg', th: '', ta: "I didn't use to play basketball every weekend when I was younger. | I did not use to play basketball every weekend when I was younger.", why: "used to = a past habit. Negative: didn't use to." },
    { id: 'b1-st-phone', k: '+', s: 'The phone / that I bought last week / has stopped / working.', r: 'S / REL / V / O', tk: 'q', th: '', ta: 'Has the phone that you bought last week stopped working? | Has the phone that I bought last week stopped working?', why: 'that / which + clause straight after the thing.' },
    { id: 'b1-st-freezing', k: '2', s: 'Although / it / was / freezing, / we / went / for a walk / along the river.', r: 'LINK / S / V / C / S / V / O / WHERE', tk: '', th: '', ta: '', why: 'Although + a surprising contrast. No "but" after it.' },
    { id: 'b1-st-japanese', k: '+', s: 'My brother / has been learning / Japanese / for six months.', r: 'S / V / O / WHEN', tk: 'wh', th: 'Start with: How long', ta: 'How long has your brother been learning Japanese? | How long has my brother been learning Japanese?', why: 'has been + verb-ing + for (a period of time).' },
    { id: 'b1-st-unless', k: '2', s: "You / won't pass / the exam / unless / you / study / harder.", r: 'S / V / O / LINK / S / V / HOW', tk: '', th: '', ta: '', why: 'unless = if... not. unless + present.' },
    { id: 'b1-st-sea', k: '-', s: 'She / had never seen / the sea / before / she / moved / to Spain.', r: 'S / V / O / LINK / S / V / WHERE', tk: 'q', th: 'Use: ever', ta: 'Had she ever seen the sea before she moved to Spain?', why: 'had never + past participle, before + past simple.' },
    { id: 'b1-st-airport', k: '+', s: 'We / are going / to the airport / tonight / to meet my uncle.', r: 'S / V / WHERE / WHEN / WHY', tk: 'long', th: 'Add WHO: who...', ta: 'We are going to the airport tonight to meet my uncle, who lives in Canada.', why: 'to + verb at the end = WHY (purpose).' },
    { id: 'b1-st-romans', k: '+', s: 'This bridge / was built / by the Romans / about two thousand years ago.', r: 'S / V / BY / WHEN', tk: 'q', th: '', ta: 'Was this bridge built by the Romans about two thousand years ago?', why: 'Passive: was + past participle + by...' }
  ] },
  /* ---------- 4. IELTS 1 (B2): reported speech · 3rd conditional · Not only... · cleft · participle clauses · despite · wish ---------- */
  { items: [
    { id: 'b2-st-passport', k: '+', s: 'She / told me / that / she / had lost / her passport / at the airport.', r: 'S / V / LINK / S / V / O / WHERE', tk: '', th: '', ta: '', why: 'Reported speech: one tense back (lost → had lost).' },
    { id: 'b2-st-laptop', k: '+', s: 'He / asked me / where / I / had bought / my laptop.', r: 'S / V / WH / S / V / O', tk: '', th: '', ta: '', why: 'Reported question: where + I + had bought (no did, no question mark).' },
    { id: 'b2-st-flight', k: '2', s: 'If / we / had left / earlier, / we / would not have missed / the flight.', r: 'LINK / S / V / WHEN / S / V / O', tk: '', th: '', ta: '', why: 'If + had + past participle, would have + past participle (not real, past).' },
    { id: 'b2-st-notonly', k: 'long', s: 'Not only / does / the city / have / great museums, / but / it / also has / beautiful parks.', r: 'NOT / AUX / S / V / O / LINK / S / V / O', tk: '', th: '', ta: '', why: 'Not only at the start → question order: does + the city + have.' },
    { id: 'b2-st-holiday', k: '+', s: 'What I need / is / a long holiday / somewhere warm.', r: 'OPEN / V / C / WHERE', tk: 'long', th: 'Add: because...', ta: 'What I need is a long holiday somewhere warm because I have been working non-stop since January.', why: 'What I need + is + ... (stresses the important part).' },
    { id: 'b2-st-report', k: '+', s: 'Having finished / the report, / she / went / home / early.', r: 'OPEN / O / S / V / WHERE / WHEN', tk: '', th: '', ta: '', why: 'Having + past participle = after she had finished. Same subject in both parts.' },
    { id: 'b2-st-documents', k: '+', s: 'The documents / should be signed / by the manager / before Friday.', r: 'S / V / BY / WHEN', tk: 'neg', th: '', ta: "The documents shouldn't be signed by the manager before Friday. | The documents should not be signed by the manager before Friday.", why: 'Modal passive: should be + past participle.' },
    { id: 'b2-st-traffic', k: '2', s: 'Despite / the heavy traffic, / we / managed / to arrive / on time.', r: 'LINK / O / S / V / O / WHEN', tk: '', th: '', ta: '', why: 'Despite + noun (NOT despite + a clause).' },
    { id: 'b2-st-bus', k: '+', s: 'I / have been waiting / for the bus / for over forty minutes.', r: 'S / V / O / WHEN', tk: 'wh', th: 'Start with: How long', ta: 'How long have you been waiting for the bus?', why: 'have been + verb-ing + for (how long).' },
    { id: 'b2-st-grewup', k: 'long', s: 'The house / where I grew up / was demolished / last year / to make room / for a car park.', r: 'S / REL / V / WHEN / WHY / WHY', tk: '', th: '', ta: '', why: 'where + clause straight after the place. Passive: was demolished.' },
    { id: 'b2-st-lasttrain', k: 'wh', s: 'What / would / you / have done / if / you / had missed / the last train?', r: 'WH / AUX / S / V / LINK / S / V / O', tk: 'ans', th: '', ta: 'I would have called a taxi.', why: 'What + would + you + have done + if + had + past participle?' },
    { id: 'b2-st-wish', k: '-', s: "I / wish / I / hadn't spent / so much money / on clothes / last month.", r: 'S / V / S / V / O / O / WHEN', tk: '', th: '', ta: '', why: 'wish + past perfect = I am sorry about the past.' },
    { id: 'b2-st-practise', k: '2', s: 'The more / you / practise, / the more confident / you / will become.', r: 'LINK / S / V / C / S / V', tk: '', th: '', ta: '', why: 'The more..., the more... (the two halves mirror each other).' },
    { id: 'b2-st-mind', k: '?', s: 'Would you mind / telling me / why / the meeting / was cancelled?', r: 'OPEN / V / WH / S / V', tk: '', th: '', ta: '', why: 'Would you mind + -ing. Then why + the meeting + was cancelled.' }
  ] },
  /* ---------- 5. IELTS 2 (6.0): academic sentences · It is believed that · inversion · Only by... · reduced relatives · in order to ---------- */
  { items: [
    { id: 'i2-st-cities', k: 'long', s: 'The number of people / living in cities / has increased / dramatically / over the last fifty years.', r: 'S / REL / V / HOW / WHEN', tk: '', th: '', ta: '', why: 'people (who are) living in cities. The number of + plural noun + has (singular).' },
    { id: 'i2-st-believed', k: 'long', s: 'It / is / widely believed / that / social media / has changed / the way / we communicate.', r: 'S / V / C / LINK / S / V / O / REL', tk: '', th: '', ta: '', why: 'It + is + believed + that + clause (formal, impersonal).' },
    { id: 'i2-st-technology', k: '2', s: 'Although / technology / has made / life / easier, / it / has also created / new problems.', r: 'LINK / S / V / O / C / S / V / O', tk: '', th: '', ta: '', why: 'Although + clause, main clause. (NOT Although..., but...)' },
    { id: 'i2-st-transport', k: 'long', s: 'Governments / should invest / more money / in public transport / in order to / reduce / traffic congestion.', r: 'S / V / O / O / WHY / V / O', tk: 'neg', th: '', ta: "Governments shouldn't invest more money in public transport in order to reduce traffic congestion. | Governments should not invest more money in public transport in order to reduce traffic congestion.", why: 'in order to + verb = purpose.' },
    { id: 'i2-st-never', k: '+', s: 'Never before / have / so many young people / gone / to university.', r: 'NOT / AUX / S / V / WHERE', tk: '', th: '', ta: '', why: 'Negative word first → question order: have + subject + past participle.' },
    { id: 'i2-st-abroad', k: 'long', s: 'Students / who study abroad / often / become / more independent, / which helps them / later in life.', r: 'S / REL / FREQ / V / C / REL / WHEN', tk: '', th: '', ta: '', why: ', which... = a comment on the whole idea before it.' },
    { id: 'i2-st-reasons', k: '+', s: 'One of the main reasons / for this trend / is / the rising cost / of living.', r: 'S / S / V / C / C', tk: 'long', th: 'Add a second reason: Another...', ta: 'One of the main reasons for this trend is the rising cost of living. Another is the lack of affordable housing.', why: 'One of the + plural noun + is (singular verb).' },
    { id: 'i2-st-crisis', k: '2', s: 'If / the government / had acted / sooner, / the crisis / might have been / avoided.', r: 'LINK / S / V / WHEN / S / AUX / V', tk: '', th: '', ta: '', why: '3rd conditional with a passive: might have been + past participle.' },
    { id: 'i2-st-graph', k: '+', s: 'The graph / shows / how many tourists / visited / the city / between 2010 and 2020.', r: 'S / V / WH / V / O / WHEN', tk: '', th: '', ta: '', why: 'Inside a sentence: how many tourists + visited (no did).' },
    { id: 'i2-st-plastic', k: '+', s: 'Few people / realise / how much / plastic / ends up / in the ocean / every year.', r: 'S / V / WH / S / V / WHERE / WHEN', tk: '', th: '', ta: '', why: 'how much + noun + verb (statement order inside the sentence).' },
    { id: 'i2-st-countryside', k: '2', s: 'While / some people / prefer / to live in the countryside, / others / enjoy / the convenience / of city life.', r: 'LINK / S / V / O / S / V / O / O', tk: '', th: '', ta: '', why: 'While + group 1, group 2 = a contrast.' },
    { id: 'i2-st-extent', k: 'wh', s: 'To what extent / do / you / agree / with this statement?', r: 'WH / AUX / S / V / O', tk: 'ans', th: '', ta: 'I partly agree with this statement, but there are some important exceptions.', why: 'To what extent + do + you + agree?' },
    { id: 'i2-st-onlyby', k: '+', s: 'Only by / working together / can / countries / solve / the problem / of climate change.', r: 'NOT / HOW / AUX / S / V / O / O', tk: '', th: '', ta: '', why: 'Only by + -ing at the start → can + subject + verb.' },
    { id: 'i2-st-read', k: '+', s: 'Children / should be encouraged / to read / for pleasure / from an early age.', r: 'S / V / O / WHY / WHEN', tk: 'long', th: 'Add: as this...', ta: 'Children should be encouraged to read for pleasure from an early age, as this improves their vocabulary.', why: 'Passive + to + verb: should be encouraged to read.' }
  ] },
  /* ---------- 6. IELTS 3 (7.0+): Had... / Were... to · Not until · Little did · So + adjective · mixed conditionals · nominalisation ---------- */
  { items: [
    { id: 'i3-st-had', k: '2', s: 'Had / the authorities / responded / more quickly, / fewer homes / would have been / destroyed.', r: 'AUX / S / V / HOW / S / AUX / V', tk: '', th: '', ta: '', why: 'Had + subject + past participle = If the authorities had responded...' },
    { id: 'i3-st-notuntil', k: 'long', s: 'Not until / the late 19th century / did / women / gain / the right / to vote / in most countries.', r: 'NOT / WHEN / AUX / S / V / O / O / WHERE', tk: '', th: '', ta: '', why: 'Not until + time → did + subject + verb.' },
    { id: 'i3-st-medicine', k: '2', s: 'If / I / had studied / medicine, / I / would be / a doctor / now.', r: 'LINK / S / V / O / S / V / C / WHEN', tk: '', th: '', ta: '', why: 'Mixed conditional: past condition (had studied), present result (would be... now).' },
    { id: 'i3-st-drought', k: 'long', s: 'So severe / was / the drought / that / many farmers / were forced / to abandon / their land.', r: 'C / V / S / LINK / S / V / V / O', tk: '', th: '', ta: '', why: 'So + adjective first → was + subject. Then that + the result.' },
    { id: 'i3-st-shopping', k: '+', s: 'The rapid growth / of online shopping / has led to / the closure / of many high-street stores.', r: 'S / S / V / O / O', tk: 'long', th: 'Add: , which...', ta: 'The rapid growth of online shopping has led to the closure of many high-street stores, which has changed the character of our town centres.', why: 'Nominalisation: the growth of..., the closure of... (nouns, not verbs). Formal style.' },
    { id: 'i3-st-little', k: 'long', s: 'Little / did / the researchers / know / that / their discovery / would change / medicine / forever.', r: 'NOT / AUX / S / V / LINK / S / V / O / WHEN', tk: '', th: '', ta: '', why: 'Little did + subject + verb = they had no idea.' },
    { id: 'i3-st-were', k: '2', s: 'Were / the government / to raise / taxes, / many small businesses / would struggle / to survive.', r: 'AUX / S / V / O / S / V / O', tk: '', th: '', ta: '', why: 'Were + subject + to + verb = If the government raised...' },
    { id: 'i3-st-concerns', k: 'long', s: 'What concerns many experts / is / not / the cost of the project / but / its long-term impact / on the environment.', r: 'OPEN / V / NOT / C / LINK / C / C', tk: '', th: '', ta: '', why: 'What + clause + is + not X but Y (stresses the real issue).' },
    { id: 'i3-st-rarely', k: '+', s: 'Rarely / have / such dramatic changes / been observed / in such a short period of time.', r: 'NOT / AUX / S / V / WHEN', tk: '', th: '', ta: '', why: 'Rarely first → have + subject + been + past participle.' },
    { id: 'i3-st-given', k: 'long', s: 'Given / the evidence / presented in the report, / it / seems / unlikely / that / the policy / will be reversed.', r: 'LINK / O / REL / S / V / C / LINK / S / V', tk: '', th: '', ta: '', why: 'Given + noun = considering. It seems unlikely that + clause.' },
    { id: 'i3-st-whether', k: '+', s: 'Whether / the scheme / will succeed / remains / to be seen.', r: 'OPEN / S / V / V / C', tk: '', th: '', ta: '', why: 'A whole clause as the subject: Whether + clause + remains...' },
    { id: 'i3-st-muchas', k: '2', s: 'Much as / I / admire / his work, / I / cannot agree / with his conclusions.', r: 'LINK / S / V / O / S / V / O', tk: '', th: '', ta: '', why: 'Much as = although (formal). Much as + clause, main clause.' },
    { id: 'i3-st-responsible', k: 'wh', s: 'To what extent / should / governments / be held / responsible / for protecting endangered species?', r: 'WH / AUX / S / V / C / O', tk: 'ans', th: '', ta: 'Governments should be held largely responsible, although individuals also have a part to play.', why: 'Passive question: should + subject + be held + adjective.' },
    { id: 'i3-st-onlywhen', k: 'long', s: 'Only when / the public / became aware / of the risks / did / the company / change / its policy.', r: 'NOT / S / V / O / AUX / S / V / O', tk: '', th: '', ta: '', why: 'Only when + clause → did + subject + verb in the main part.' }
  ] }
];

/* Screen text & timing, per level. */
WU.content.sentenceScreen = {
  shared: {
    id: 'sentence-screen',
    tag: 'SENTENCE TRAIN',
    task: 'Put the words in order. Say the whole sentence!', buildSec: 60,
    rule: 'WHO + DOES + WHAT + WHERE + WHEN', ruleShow: true,
    slotLabels: true,
    step: 'Carriage {n}...', done: 'Same order as yours?', patLabel: 'PATTERN', whyLabel: 'WHY?',
    ask: '{name}, your turn!', exLabel: 'EXAMPLE',
    kPos: 'POSITIVE +', kNeg: 'NEGATIVE −', kQ: 'QUESTION ?', kWh: 'WH- QUESTION', k2: 'TWO PARTS', kLong: 'LONG SENTENCE',
    tNeg: 'Make it NEGATIVE!', tQ: 'Make it a QUESTION!', tPos: 'Make it POSITIVE!', tWh: 'Ask a WH- QUESTION!',
    tShort: 'Answer with a SHORT ANSWER!', tAns: 'Answer it in a full sentence!', tLong: 'Make it LONGER!',
    demo: 'TEACHER DEMO: together!', demoShow: false
  },
  levels: [
    { buildSec: 45, rule: 'WHO + DOES + WHAT (+ WHERE + WHEN)', demoShow: true },
    { buildSec: 50, rule: 'WHO + DOES + WHAT + WHERE + WHEN' },
    { buildSec: 60, rule: 'WHO + DOES + WHAT + HOW + WHERE + WHEN' },
    { buildSec: 60, rule: 'Questions inside sentences: where + WHO + verb' },
    { buildSec: 75, rule: 'Not only / Never / Only... at the start → helper + WHO', slotLabels: false },
    { buildSec: 90, rule: 'Long sentence = one main clause + extra parts', slotLabels: false },
    { buildSec: 90, rule: 'Had / Were / Little / So... first → helper + WHO', slotLabels: false }
  ]
};
