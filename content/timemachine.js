/* Warm Up: content for TIME MACHINE (grammar game G6, all levels). The same lists at every level.
   subjects: { id, text, p }  p = person: "1s" I, "2s" you, "3s" he / she / it, "1p" we, "3p" they.
   verbs:    { id, base, s, ing, past, pp, rest, pic, kind }  rest = the words after the verb ("football").
             kind "task" = something you finish (write an email), "activity" = no end (listen to music).
   markers:  { id, tense, text, kind }  a time phrase that only fits one tense ("right now" = present continuous).
             kind "deadline" (by 2030, by the time...) only goes with tasks, "duration" (for two hours, all day) only with activities, "any" with both.
   sillySubjects / sillyVerbs: used only in Silly mode (Z key).
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
    { id: "tm-v-play-football", base: "play", s: "plays", ing: "playing", past: "played", pp: "played", rest: "football", pic: "a-football", kind: "activity" },
    { id: "tm-v-watch-tv", base: "watch", s: "watches", ing: "watching", past: "watched", pp: "watched", rest: "TV", pic: "TV", kind: "activity" },
    { id: "tm-v-read-a-book", base: "read", s: "reads", ing: "reading", past: "read", pp: "read", rest: "a book", pic: "a-read", kind: "task" },
    { id: "tm-v-cook-dinner", base: "cook", s: "cooks", ing: "cooking", past: "cooked", pp: "cooked", rest: "dinner", pic: "a-cook", kind: "task" },
    { id: "tm-v-learn-english", base: "learn", s: "learns", ing: "learning", past: "learned", pp: "learned", rest: "English", pic: "school", kind: "activity" },
    { id: "tm-v-write-an-email", base: "write", s: "writes", ing: "writing", past: "wrote", pp: "written", rest: "an email", pic: "computer", kind: "task" },
    { id: "tm-v-eat-pizza", base: "eat", s: "eats", ing: "eating", past: "ate", pp: "eaten", rest: "a pizza", pic: "pizza", kind: "task" },
    { id: "tm-v-drink-coffee", base: "drink", s: "drinks", ing: "drinking", past: "drank", pp: "drunk", rest: "coffee", pic: "coffee", kind: "activity" },
    { id: "tm-v-ride-a-bike", base: "ride", s: "rides", ing: "riding", past: "rode", pp: "ridden", rest: "a bike", pic: "a-bike", kind: "activity" },
    { id: "tm-v-swim-in-the-sea", base: "swim", s: "swims", ing: "swimming", past: "swam", pp: "swum", rest: "in the sea", pic: "a-swim", kind: "activity" },
    { id: "tm-v-go-to-the-gym", base: "go", s: "goes", ing: "going", past: "went", pp: "been", rest: "to the gym", pic: "a-run", kind: "activity" },
    { id: "tm-v-do-homework", base: "do", s: "does", ing: "doing", past: "did", pp: "done", rest: "the homework", pic: "pencil", kind: "task" },
    { id: "tm-v-study-maths", base: "study", s: "studies", ing: "studying", past: "studied", pp: "studied", rest: "maths", pic: "ruler", kind: "activity" },
    { id: "tm-v-listen-to-music", base: "listen", s: "listens", ing: "listening", past: "listened", pp: "listened", rest: "to music", pic: "microphone", kind: "activity" },
    { id: "tm-v-speak-english", base: "speak", s: "speaks", ing: "speaking", past: "spoke", pp: "spoken", rest: "English", pic: "mouth", kind: "activity" },
    { id: "tm-v-drive-to-work", base: "drive", s: "drives", ing: "driving", past: "drove", pp: "driven", rest: "to work", pic: "a-drive", kind: "activity" },
    { id: "tm-v-sing-songs", base: "sing", s: "sings", ing: "singing", past: "sang", pp: "sung", rest: "songs", pic: "a-sing", kind: "activity" },
    { id: "tm-v-play-the-guitar", base: "play", s: "plays", ing: "playing", past: "played", pp: "played", rest: "the guitar", pic: "a-guitar", kind: "activity" },
    { id: "tm-v-draw-pictures", base: "draw", s: "draws", ing: "drawing", past: "drew", pp: "drawn", rest: "a picture", pic: "a-draw", kind: "task" },
    { id: "tm-v-run-in-the-park", base: "run", s: "runs", ing: "running", past: "ran", pp: "run", rest: "in the park", pic: "park", kind: "activity" }
  ],
  sillySubjects: [
    { id: "tm-ss-a-penguin", text: "a penguin", p: "3s" },
    { id: "tm-ss-my-grandmother", text: "my grandmother", p: "3s" },
    { id: "tm-ss-the-president", text: "the president", p: "3s" },
    { id: "tm-ss-a-robot", text: "a robot", p: "3s" },
    { id: "tm-ss-two-crocodiles", text: "two crocodiles", p: "3p" },
    { id: "tm-ss-our-cat", text: "our cat", p: "3s" },
    { id: "tm-ss-a-ghost", text: "a ghost", p: "3s" },
    { id: "tm-ss-three-tiny-aliens", text: "three tiny aliens", p: "3p" },
    { id: "tm-ss-an-old-pirate", text: "an old pirate", p: "3s" },
    { id: "tm-ss-the-whole-school", text: "the whole school", p: "3s" },
    { id: "tm-ss-a-baby-dinosaur", text: "a baby dinosaur", p: "3s" },
    { id: "tm-ss-the-neighbours-goats", text: "the neighbours' goats", p: "3p" }
  ],
  sillyVerbs: [
    { id: "tm-sv-dance-on-the-roof", base: "dance", s: "dances", ing: "dancing", past: "danced", pp: "danced", rest: "on the roof", pic: "a-dance", kind: "activity" },
    { id: "tm-sv-ride-a-camel", base: "ride", s: "rides", ing: "riding", past: "rode", pp: "ridden", rest: "a camel", pic: "", kind: "activity" },
    { id: "tm-sv-talk-to-the-fish", base: "talk", s: "talks", ing: "talking", past: "talked", pp: "talked", rest: "to the fish", pic: "fish", kind: "activity" },
    { id: "tm-sv-sing-opera-in-the-shower", base: "sing", s: "sings", ing: "singing", past: "sang", pp: "sung", rest: "opera in the shower", pic: "a-sing", kind: "activity" },
    { id: "tm-sv-wear-a-banana-costume", base: "wear", s: "wears", ing: "wearing", past: "wore", pp: "worn", rest: "a banana costume", pic: "banana", kind: "activity" },
    { id: "tm-sv-juggle-eggs", base: "juggle", s: "juggles", ing: "juggling", past: "juggled", pp: "juggled", rest: "eggs", pic: "egg", kind: "activity" },
    { id: "tm-sv-build-a-rocket", base: "build", s: "builds", ing: "building", past: "built", pp: "built", rest: "a rocket", pic: "rocket", kind: "task" },
    { id: "tm-sv-eat-a-whole-cake", base: "eat", s: "eats", ing: "eating", past: "ate", pp: "eaten", rest: "a whole cake", pic: "cake", kind: "task" },
    { id: "tm-sv-write-a-love-song", base: "write", s: "writes", ing: "writing", past: "wrote", pp: "written", rest: "a love song for the teacher", pic: "guitar", kind: "task" },
    { id: "tm-sv-steal-the-moon", base: "steal", s: "steals", ing: "stealing", past: "stole", pp: "stolen", rest: "the moon", pic: "moon", kind: "task" },
    { id: "tm-sv-paint-the-elephant", base: "paint", s: "paints", ing: "painting", past: "painted", pp: "painted", rest: "the elephant pink", pic: "elephant", kind: "task" }
  ],
  markers: [
    { id: "tm-m-ps-every-day", tense: "ps", text: "every day", kind: "any" },
    { id: "tm-m-ps-on-saturdays", tense: "ps", text: "on Saturdays", kind: "any" },
    { id: "tm-m-ps-twice-a-week", tense: "ps", text: "twice a week", kind: "any" },
    { id: "tm-m-ps-after-school", tense: "ps", text: "after school", kind: "any" },
    { id: "tm-m-ps-every-weekend", tense: "ps", text: "every weekend", kind: "any" },
    { id: "tm-m-pc-right-now", tense: "pc", text: "right now", kind: "any" },
    { id: "tm-m-pc-at-the-moment", tense: "pc", text: "at the moment", kind: "any" },
    { id: "tm-m-pc-now", tense: "pc", text: "now", kind: "any" },
    { id: "tm-m-pas-yesterday", tense: "pas", text: "yesterday", kind: "any" },
    { id: "tm-m-pas-last-week", tense: "pas", text: "last week", kind: "any" },
    { id: "tm-m-pas-two-days-ago", tense: "pas", text: "two days ago", kind: "any" },
    { id: "tm-m-pas-last-night", tense: "pas", text: "last night", kind: "any" },
    { id: "tm-m-pas-in-2019", tense: "pas", text: "in 2019", kind: "any" },
    { id: "tm-m-pac-at-8-last-night", tense: "pac", text: "at 8 o'clock last night", kind: "any" },
    { id: "tm-m-pac-when-i-called", tense: "pac", text: "when the phone rang", kind: "any" },
    { id: "tm-m-pac-at-this-time-yesterday", tense: "pac", text: "at this time yesterday", kind: "any" },
    { id: "tm-m-pp-this-week", tense: "pp", text: "this week", kind: "any" },
    { id: "tm-m-pp-recently", tense: "pp", text: "recently", kind: "any" },
    { id: "tm-m-pp-before", tense: "pp", text: "before", kind: "any" },
    { id: "tm-m-pp-this-year", tense: "pp", text: "this year", kind: "any" },
    { id: "tm-m-ppc-for-two-hours", tense: "ppc", text: "for two hours", kind: "duration" },
    { id: "tm-m-ppc-since-this-morning", tense: "ppc", text: "since this morning", kind: "duration" },
    { id: "tm-m-ppc-all-day", tense: "ppc", text: "all day", kind: "duration" },
    { id: "tm-m-pap-before-the-lesson", tense: "pap", text: "before the lesson started", kind: "deadline" },
    { id: "tm-m-pap-by-the-time-i-arrived", tense: "pap", text: "by the time the film started", kind: "deadline" },
    { id: "tm-m-pap-before-2020", tense: "pap", text: "before 2020", kind: "any" },
    { id: "tm-m-papc-for-two-hours-before-rain", tense: "papc", text: "for two hours before the rain started", kind: "duration" },
    { id: "tm-m-papc-for-an-hour-when-i-arrived", tense: "papc", text: "for an hour when the bell rang", kind: "duration" },
    { id: "tm-m-fs-tomorrow", tense: "fs", text: "tomorrow", kind: "any" },
    { id: "tm-m-fs-next-week", tense: "fs", text: "next week", kind: "any" },
    { id: "tm-m-fs-next-year", tense: "fs", text: "next year", kind: "any" },
    { id: "tm-m-fs-tonight", tense: "fs", text: "tonight", kind: "any" },
    { id: "tm-m-fc-at-this-time-tomorrow", tense: "fc", text: "at this time tomorrow", kind: "any" },
    { id: "tm-m-fc-at-9-tonight", tense: "fc", text: "at 9 pm tonight", kind: "any" },
    { id: "tm-m-fc-all-day-tomorrow", tense: "fc", text: "all day tomorrow", kind: "duration" },
    { id: "tm-m-fp-by-tomorrow-evening", tense: "fp", text: "by tomorrow evening", kind: "deadline" },
    { id: "tm-m-fp-by-2030", tense: "fp", text: "by 2030", kind: "deadline" },
    { id: "tm-m-fp-by-the-end-of-the-week", tense: "fp", text: "by the end of the week", kind: "deadline" },
    { id: "tm-m-fpc-for-ten-years-by-june", tense: "fpc", text: "for ten years by next June", kind: "duration" },
    { id: "tm-m-fpc-for-two-hours-by-the-time", tense: "fpc", text: "for two hours by the time the guests arrive", kind: "duration" }
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
    silly: 'SILLY MODE', sillyChance: 50, noIQ: true,
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
