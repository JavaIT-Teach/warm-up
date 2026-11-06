/* Warm Up: content for TIME MACHINE (grammar game G6, all levels). The same lists at every level.
   subjects: { id, text, p }  p = person: "1s" I, "2s" you, "3s" he / she / it, "1p" we, "3p" they.
   verbs:    { id, base, s, ing, past, pp, rest, pic }  rest = the words after the verb ("football").
   markers:  { id, tense, text }  a time phrase that only fits one tense ("right now" = present continuous).
   Tense codes: ps present simple, pc present continuous, pp present perfect, ppc present perfect continuous,
   pas past simple, pac past continuous, pap past perfect, papc past perfect continuous,
   fs future simple (will / going to), fc future continuous, fp future perfect, fpc future perfect continuous.
   id is PERMANENT: never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.timemachine = {
  subjects: [
    { id: "tm-s-i", text: "I", p: "1s" },
    { id: "tm-s-you", text: "you", p: "2s" },
    { id: "tm-s-he", text: "he", p: "3s" },
    { id: "tm-s-she", text: "she", p: "3s" },
    { id: "tm-s-we", text: "we", p: "1p" },
    { id: "tm-s-they", text: "they", p: "3p" },
    { id: "tm-s-my-brother", text: "my brother", p: "3s" },
    { id: "tm-s-our-teacher", text: "our teacher", p: "3s" },
    { id: "tm-s-the-children", text: "the children", p: "3p" },
    { id: "tm-s-my-friends", text: "my friends", p: "3p" }
  ],
  verbs: [
    { id: "tm-v-play-football", base: "play", s: "plays", ing: "playing", past: "played", pp: "played", rest: "football", pic: "a-football" },
    { id: "tm-v-watch-tv", base: "watch", s: "watches", ing: "watching", past: "watched", pp: "watched", rest: "TV", pic: "TV" },
    { id: "tm-v-read-a-book", base: "read", s: "reads", ing: "reading", past: "read", pp: "read", rest: "a book", pic: "a-read" },
    { id: "tm-v-cook-dinner", base: "cook", s: "cooks", ing: "cooking", past: "cooked", pp: "cooked", rest: "dinner", pic: "a-cook" },
    { id: "tm-v-learn-english", base: "learn", s: "learns", ing: "learning", past: "learned", pp: "learned", rest: "English", pic: "school" },
    { id: "tm-v-write-an-email", base: "write", s: "writes", ing: "writing", past: "wrote", pp: "written", rest: "an email", pic: "computer" },
    { id: "tm-v-eat-pizza", base: "eat", s: "eats", ing: "eating", past: "ate", pp: "eaten", rest: "pizza", pic: "pizza" },
    { id: "tm-v-drink-coffee", base: "drink", s: "drinks", ing: "drinking", past: "drank", pp: "drunk", rest: "coffee", pic: "coffee" },
    { id: "tm-v-ride-a-bike", base: "ride", s: "rides", ing: "riding", past: "rode", pp: "ridden", rest: "a bike", pic: "a-bike" },
    { id: "tm-v-swim-in-the-sea", base: "swim", s: "swims", ing: "swimming", past: "swam", pp: "swum", rest: "in the sea", pic: "a-swim" },
    { id: "tm-v-go-to-the-gym", base: "go", s: "goes", ing: "going", past: "went", pp: "gone", rest: "to the gym", pic: "a-run" },
    { id: "tm-v-do-homework", base: "do", s: "does", ing: "doing", past: "did", pp: "done", rest: "homework", pic: "pencil" },
    { id: "tm-v-study-maths", base: "study", s: "studies", ing: "studying", past: "studied", pp: "studied", rest: "maths", pic: "ruler" },
    { id: "tm-v-listen-to-music", base: "listen", s: "listens", ing: "listening", past: "listened", pp: "listened", rest: "to music", pic: "microphone" },
    { id: "tm-v-speak-english", base: "speak", s: "speaks", ing: "speaking", past: "spoke", pp: "spoken", rest: "English", pic: "mouth" },
    { id: "tm-v-drive-to-work", base: "drive", s: "drives", ing: "driving", past: "drove", pp: "driven", rest: "to work", pic: "a-drive" },
    { id: "tm-v-sing-songs", base: "sing", s: "sings", ing: "singing", past: "sang", pp: "sung", rest: "songs", pic: "a-sing" },
    { id: "tm-v-play-the-guitar", base: "play", s: "plays", ing: "playing", past: "played", pp: "played", rest: "the guitar", pic: "a-guitar" },
    { id: "tm-v-draw-pictures", base: "draw", s: "draws", ing: "drawing", past: "drew", pp: "drawn", rest: "pictures", pic: "a-draw" },
    { id: "tm-v-run-in-the-park", base: "run", s: "runs", ing: "running", past: "ran", pp: "run", rest: "in the park", pic: "park" }
  ],
  markers: [
    { id: "tm-m-ps-every-day", tense: "ps", text: "every day" },
    { id: "tm-m-ps-on-saturdays", tense: "ps", text: "on Saturdays" },
    { id: "tm-m-ps-twice-a-week", tense: "ps", text: "twice a week" },
    { id: "tm-m-ps-after-school", tense: "ps", text: "after school" },
    { id: "tm-m-ps-every-weekend", tense: "ps", text: "every weekend" },
    { id: "tm-m-pc-right-now", tense: "pc", text: "right now" },
    { id: "tm-m-pc-at-the-moment", tense: "pc", text: "at the moment" },
    { id: "tm-m-pc-now", tense: "pc", text: "now" },
    { id: "tm-m-pas-yesterday", tense: "pas", text: "yesterday" },
    { id: "tm-m-pas-last-week", tense: "pas", text: "last week" },
    { id: "tm-m-pas-two-days-ago", tense: "pas", text: "two days ago" },
    { id: "tm-m-pas-last-night", tense: "pas", text: "last night" },
    { id: "tm-m-pas-in-2019", tense: "pas", text: "in 2019" },
    { id: "tm-m-pac-at-8-last-night", tense: "pac", text: "at 8 o'clock last night" },
    { id: "tm-m-pac-when-i-called", tense: "pac", text: "when the phone rang" },
    { id: "tm-m-pac-at-this-time-yesterday", tense: "pac", text: "at this time yesterday" },
    { id: "tm-m-pp-this-week", tense: "pp", text: "this week" },
    { id: "tm-m-pp-recently", tense: "pp", text: "recently" },
    { id: "tm-m-pp-before", tense: "pp", text: "before" },
    { id: "tm-m-pp-this-year", tense: "pp", text: "this year" },
    { id: "tm-m-ppc-for-two-hours", tense: "ppc", text: "for two hours" },
    { id: "tm-m-ppc-since-this-morning", tense: "ppc", text: "since this morning" },
    { id: "tm-m-ppc-all-day", tense: "ppc", text: "all day" },
    { id: "tm-m-pap-before-the-lesson", tense: "pap", text: "before the lesson started" },
    { id: "tm-m-pap-by-the-time-i-arrived", tense: "pap", text: "by the time the film started" },
    { id: "tm-m-pap-before-2020", tense: "pap", text: "before 2020" },
    { id: "tm-m-papc-for-two-hours-before-rain", tense: "papc", text: "for two hours before the rain started" },
    { id: "tm-m-papc-for-an-hour-when-i-arrived", tense: "papc", text: "for an hour when the bell rang" },
    { id: "tm-m-fs-tomorrow", tense: "fs", text: "tomorrow" },
    { id: "tm-m-fs-next-week", tense: "fs", text: "next week" },
    { id: "tm-m-fs-next-year", tense: "fs", text: "next year" },
    { id: "tm-m-fs-tonight", tense: "fs", text: "tonight" },
    { id: "tm-m-fc-at-this-time-tomorrow", tense: "fc", text: "at this time tomorrow" },
    { id: "tm-m-fc-at-9-tonight", tense: "fc", text: "at 9 pm tonight" },
    { id: "tm-m-fc-all-day-tomorrow", tense: "fc", text: "all day tomorrow" },
    { id: "tm-m-fp-by-tomorrow-evening", tense: "fp", text: "by tomorrow evening" },
    { id: "tm-m-fp-by-2030", tense: "fp", text: "by 2030" },
    { id: "tm-m-fp-by-the-end-of-the-week", tense: "fp", text: "by the end of the week" },
    { id: "tm-m-fpc-for-ten-years-by-june", tense: "fpc", text: "for ten years by next June" },
    { id: "tm-m-fpc-for-two-hours-by-the-time", tense: "fpc", text: "for two hours by the time the guests arrive" }
  ]
};
/* Screen text & timing, per level. t_* = tenses used at this level. sPlus / sMinus / sQ = which sentence types.
   The T key picks a family (simple, continuous, perfect...) from the tenses this level uses. */
WU.content.timemachineScreen = {
  shared: {
    id: 'timemachine-screen',
    tag: 'TIME MACHINE', lWho: 'WHO?', lWhat: 'DO WHAT?', lWhen: 'WHEN?', lSign: 'TYPE',
    plus: '+', minus: '−', q: '?', plusName: 'positive', minusName: 'negative', qName: 'question',
    sPlus: true, sMinus: true, sQ: true,
    who: '{name}, make the sentence!', rule: 'Look at WHEN: it tells you the tense.', ruleShow: true, seconds: 0,
    goingTo: true, orWord: 'or',
    t_ps: true, t_pc: true, t_pp: true, t_ppc: true, t_pas: true, t_pac: true, t_pap: true, t_papc: true, t_fs: true, t_fc: true, t_fp: true, t_fpc: true,
    n_ps: 'present simple', n_pc: 'present continuous', n_pp: 'present perfect', n_ppc: 'present perfect continuous',
    n_pas: 'past simple', n_pac: 'past continuous', n_pap: 'past perfect', n_papc: 'past perfect continuous',
    n_fs: 'future simple', n_fc: 'future continuous', n_fp: 'future perfect', n_fpc: 'future perfect continuous',
    f_all: 'ALL TENSES', f_simple: 'SIMPLE ONLY', f_cont: 'CONTINUOUS ONLY', f_perf: 'PERFECT ONLY', f_perfc: 'PERFECT CONTINUOUS ONLY',
    f_present: 'PRESENT ONLY', f_past: 'PAST ONLY', f_future: 'FUTURE ONLY',
    demo: 'TEACHER DEMO: I go first!', demoShow: false
  },
  levels: [
    { t_pp: false, t_ppc: false, t_pas: false, t_pac: false, t_pap: false, t_papc: false, t_fs: false, t_fc: false, t_fp: false, t_fpc: false, sQ: true, demoShow: true },
    { t_pp: false, t_ppc: false, t_pac: false, t_pap: false, t_papc: false, t_fc: false, t_fp: false, t_fpc: false },
    { t_ppc: false, t_pap: false, t_papc: false, t_fc: false, t_fp: false, t_fpc: false },
    { t_papc: false, t_fp: false, t_fpc: false },
    {}, {}, {}
  ]
};
