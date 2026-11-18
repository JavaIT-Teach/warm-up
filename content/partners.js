/* Warm Up: content for WORD PARTNERS (all levels). Trains: collocations, phrases instead of single words.
   words[level]: { id, word, p: [phrases], question, trap }.
   word     = the core word in the middle of the board.
   p        = its partners, most useful first (up to 8). On the board the core word stays visible and every other word is a gap
              (a / an / the stay visible). To choose the gaps yourself, put them in [brackets]: "[make] a decision".
   question = the USE IT question after the board: the student answers with phrases from the board.
   trap     = a common wrong partner (shown after the board), e.g. "do a decision". Empty = none.
   id is PERMANENT: never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.partners = [
  /* 0. Beginner (A1) */
  { words: [
    { id: 'wp0-breakfast', word: 'breakfast', p: ['have breakfast', 'eat breakfast', 'a big breakfast', 'make breakfast', 'before breakfast', 'breakfast time'], question: 'What do you have for breakfast?', trap: 'take breakfast' },
    { id: 'wp0-homework', word: 'homework', p: ['do homework', 'do my homework', 'a lot of homework', 'finish my homework', 'English homework', 'forget my homework'], question: 'When do you do your homework?', trap: 'make homework' },
    { id: 'wp0-bus', word: 'bus', p: ['take the bus', 'get on the bus', 'get off the bus', 'wait for the bus', 'miss the bus', 'by bus'], question: 'How do you go to school or work?', trap: 'go with bus' },
    { id: 'wp0-tv', word: 'TV', p: ['watch TV', 'turn on the TV', 'turn off the TV', 'on TV', 'a big TV', 'a TV show'], question: 'What do you watch on TV?', trap: 'look TV' },
    { id: 'wp0-music', word: 'music', p: ['listen to music', 'loud music', 'play music', 'pop music', 'a music lesson', 'favourite music'], question: 'What music do you like?', trap: 'listen music' },
    { id: 'wp0-shopping', word: 'shopping', p: ['go shopping', 'do the shopping', 'a shopping bag', 'a shopping list', 'a shopping centre', 'love shopping'], question: 'Where do you go shopping?', trap: 'make shopping' },
    { id: 'wp0-photo', word: 'photo', p: ['take a photo', 'a nice photo', 'a family photo', 'look at a photo', 'in the photo', 'an old photo'], question: 'Do you take a lot of photos? Of what?', trap: 'make a photo' },
    { id: 'wp0-birthday', word: 'birthday', p: ['happy birthday', 'my birthday', 'a birthday party', 'a birthday cake', 'a birthday present', 'on my birthday'], question: 'What do you do on your birthday?', trap: 'in my birthday' }
  ] },
  /* 1. Elementary (A2) */
  { words: [
    { id: 'wp1-time', word: 'time', p: ['spend time', 'have a good time', 'free time', 'on time', 'waste time', 'a long time'], question: 'What do you do in your free time?', trap: 'spend a good time' },
    { id: 'wp1-friend', word: 'friend', p: ['make friends', 'a best friend', 'an old friend', 'a close friend', 'visit a friend', 'meet a friend'], question: 'How did you meet your best friend?', trap: 'do friends' },
    { id: 'wp1-money', word: 'money', p: ['spend money', 'save money', 'earn money', 'make money', 'pocket money', 'a lot of money'], question: 'What do you spend your money on?', trap: 'earn money in a lottery (win)' },
    { id: 'wp1-bed', word: 'bed', p: ['go to bed', 'make the bed', 'stay in bed', 'get out of bed', 'a double bed', 'in bed'], question: 'What time do you go to bed?', trap: 'go to the bed' },
    { id: 'wp1-weather', word: 'weather', p: ['nice weather', 'bad weather', 'the weather forecast', 'in this weather', 'check the weather', 'hot weather'], question: 'What is your favourite weather? Why?', trap: 'a good weather' },
    { id: 'wp1-holiday', word: 'holiday', p: ['go on holiday', 'a summer holiday', 'be on holiday', 'book a holiday', 'a beach holiday', 'a holiday home'], question: 'Where did you go on your last holiday?', trap: 'go to holiday' },
    { id: 'wp1-mistake', word: 'mistake', p: ['make a mistake', 'a big mistake', 'correct a mistake', 'by mistake', 'a spelling mistake', 'learn from mistakes'], question: 'What mistakes do you often make in English?', trap: 'do a mistake' },
    { id: 'wp1-party', word: 'party', p: ['have a party', 'go to a party', 'a birthday party', 'throw a party', 'a big party', 'a party dress'], question: 'Tell us about a great party.', trap: 'make a party' }
  ] },
  /* 2. Pre-Intermediate (A2+) */
  { words: [
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
    seconds: 15, strikes: 3, letters: false,
    turn: '{team}: your turn!', classTurn: 'Everyone: say a phrase!', found: 'FOUND',
    hit: 'YES! A partner!', bonus: 'GOOD ONE! Not on the board, but it works.', wrong: 'Not a partner!', time: 'Time!',
    allFound: 'ALL FOUND!', boardWins: 'The board wins! Here are the rest.', trapLabel: 'NOT', trapNote: 'Wrong partner!',
    useLabel: 'USE IT!', useWho: '{name}, answer!', useRule: 'Answer with 2 phrases from the board.', useSeconds: 40
  },
  levels: [
    { letters: true, seconds: 20, rule: 'Say the word AND a partner: "have breakfast", not "breakfast".', useRule: 'Answer with 1 phrase from the board.', useSeconds: 30 },
    { letters: true, seconds: 20, useRule: 'Answer with 1 or 2 phrases from the board.', useSeconds: 30 },
    { seconds: 15 },
    { seconds: 15 },
    { seconds: 12, useRule: 'Answer with 3 phrases from the board.', useSeconds: 45 },
    { seconds: 12, useRule: 'Answer with 3 phrases from the board.', useSeconds: 45 },
    { seconds: 10, useRule: 'Answer with 3 phrases. Add a reason and an example.', useSeconds: 60 }
  ]
};
