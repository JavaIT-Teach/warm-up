/* Warm Up: content for MISTAKE DETECTIVE (reading + writing). A short text from the taught units hides 3 or 4 mistakes
   (the mistakes the groups made in class). Pairs read it and write the right sentences; then the mistakes are revealed
   one by one (or the class calls out a line and the teacher checks it).
   Built from the taught lessons in the Lesson Plan Builder (weekly job, 2026-11-28).
   texts[level]: { id, title, unit, l1 ... l6 }
     l1 ... l6 = the lines of the text (3 to 6; empty = not used). Mark a mistake like this: [wrong|right]
       "He [drive|drives] a big lorry every day." shows "He drive a big lorry every day." and reveals "drives".
       One mistake per line works best. Lines without [ ] have no mistake (the class may still say they do).
     title = shown at the top. unit = the taught unit (tag).
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.detective = [
  /* ---------- 0. Beginner (A1): Unit 11 My Digital Life, Unit 12 Working Life ---------- */
  {
    texts: [
      { id: 'a1-md-my-dad', title: 'My dad', unit: 'Unit 12 · Working Life',
        l1: 'My dad is a lorry driver.', l2: 'He [drive|drives] a big lorry every day.', l3: 'He [travels often|often travels] to Samarkand.',
        l4: "Today he isn't working.", l5: 'He [plays|is playing] football in the park now!', l6: '' },
      { id: 'a1-md-in-the-cafe', title: 'In the café', unit: 'Unit 12 · Working Life',
        l1: 'Waiter: Good afternoon!', l2: 'Customer: Can I [to have|have] a sandwich, please?', l3: 'Waiter: Yes, of course. Would you like a drink?',
        l4: 'Customer: Yes, please. Can I have [an|a] cup of tea?', l5: 'Customer: And can you clean this table, please?', l6: 'Waiter: [Yes, please.|Yes, of course.]' },
      { id: 'a1-md-my-phone', title: 'My phone', unit: 'Unit 11 · My Digital Life',
        l1: "I've got a smartphone.", l2: 'I [send often|often send] texts to my friends.', l3: '[How much|How many] photos do I take? Lots!',
        l4: 'I [don\'t never|never] play games on it.', l5: 'I sometimes watch films on my laptop.', l6: '' },
      { id: 'a1-md-jose', title: 'José', unit: 'Unit 11 · My Digital Life',
        l1: 'José is famous in Brazil.', l2: 'He [are|is] living in Britain now.', l3: 'He [uses often|often uses] the internet.',
        l4: 'He likes watching movies.', l5: 'He [don\'t watch|doesn\'t watch] a lot of TV.', l6: 'He has a lot of fans.' },
      { id: 'a1-md-megans-family', title: "Megan's family", unit: 'Unit 12 · Working Life',
        l1: "Megan's mum is a musician.", l2: 'She [write|writes] music every day.', l3: 'Today she [eats|is eating] a big ice cream on the beach.',
        l4: "Megan's dad is a doctor.", l5: 'He [is helping|helps] people at work every day.', l6: '' }
    ]
  },
  /* ---------- 1. Elementary (A2): Unit 11 Eating Out, Unit 12 The Latest Technology (Part 1) ---------- */
  {
    texts: [
      { id: 'a2-md-pizza-palace', title: 'Pizza Palace', unit: 'Unit 11 · Eating Out',
        l1: 'Pizza Palace is my favourite restaurant.', l2: "It's [more cheaper|cheaper] than Easy Burgers.", l3: 'The pizzas are [biger|bigger] too!',
        l4: "It isn't [expensive as|as expensive as] the burger restaurant.", l5: 'And the desserts are [more nice|nicer]!', l6: '' },
      { id: 'a2-md-food-stall', title: 'At the food stall', unit: 'Unit 11 · Eating Out',
        l1: 'Excuse me, what are you selling?', l2: "Noodles with vegetables. They're wonderful!", l3: '[How many|How much] is it?',
        l4: "It's £4.50 for a small plate.", l5: 'Great. [I have|I\'ll have] a small plate, please.', l6: 'And can I have a [slice|bowl] of ice cream?' },
      { id: 'a2-md-new-phone', title: 'My new phone', unit: 'Unit 12 · The Latest Technology',
        l1: 'Yesterday I bought a new phone.', l2: "It's [the most fast|the fastest] phone in the shop.", l3: 'It has [the most big|the biggest] screen too.',
        l4: "It wasn't [the cheaper|the cheapest] phone, but it's great!", l5: 'My old phone was [the baddest|the worst] phone in the world.', l6: '' },
      { id: 'a2-md-did-you-know', title: 'Did you know?', unit: 'Unit 12 · The Latest Technology',
        l1: 'Did you know?', l2: 'Football is [the famous|the most famous] game in the world.', l3: 'A tablet is [more light|lighter] than a laptop.',
        l4: 'Is a phone [as big than|as big as] a tablet? No, it isn\'t.', l5: 'The [most biggest|biggest] screen in my house is the TV.', l6: '' },
      { id: 'a2-md-eating-out', title: 'Eating out', unit: 'Unit 11 · Eating Out',
        l1: 'We eat out every Friday.', l2: 'I always have pasta with tomato sauce.', l3: 'My sister has a [slice|bowl] of soup.',
        l4: 'Fresh vegetables are [more healthy|healthier] than chips.', l5: 'But chips are [popularer|more popular]!', l6: '' }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+): Unit 13 Mixed Feelings, Unit 14 On Screen (Part 1) ---------- */
  {
    texts: [
      { id: 'a2p-md-kates-saturday', title: "Kate's Saturday", unit: 'Unit 13 · Mixed Feelings',
        l1: "It's only ten o'clock, but Kate has [already tidy|already tidied] her room.", l2: 'She [just has|has just] finished her breakfast.', l3: "She hasn't [yet done her homework|done her homework yet].",
        l4: "She's a bit [stressing|stressed] about it.", l5: "But first she wants to watch a film. She's a big fan of comedies!", l6: '' },
      { id: 'a2p-md-boring-film', title: 'A boring film', unit: 'Unit 13 · Mixed Feelings',
        l1: 'Last night I watched a horror film.', l2: 'It was really [bored|boring].', l3: "I wasn't scared at all. I was just [tiring|tired]!",
        l4: 'My brother is [scared from|scared of] horror films.', l5: "I'm [a big fan for|a big fan of] comedies, so next time I'll choose!", l6: '' },
      { id: 'a2p-md-film-extra', title: 'My cousin, the film extra', unit: 'Unit 14 · On Screen',
        l1: 'My cousin is a film extra.', l2: 'She has [just appear|just appeared] in a period drama.', l3: "She hasn't seen the film [already|yet].",
        l4: 'In the film she wears old clothes, because it takes place in the past.', l5: 'She was so [exciting|excited] on her first day!', l6: '' },
      { id: 'a2p-md-my-week', title: 'What a week!', unit: 'Unit 13 · Mixed Feelings',
        l1: "What a week! I'm completely [exhausting|exhausted].", l2: "I've [already finish|already finished] two projects.", l3: 'But I [didn\'t clean|haven\'t cleaned] my room yet.',
        l4: 'My mum is a bit [annoying|annoyed] with me.', l5: "I've just made her a cup of tea. I'm grateful for her help!", l6: '' },
      { id: 'a2p-md-tv-tonight', title: 'TV tonight', unit: 'Unit 14 · On Screen',
        l1: "What's on TV tonight?", l2: "There's a chat show with a famous actor.", l3: "I'm not [a big fan from|a big fan of] chat shows.",
        l4: 'Have you [watch|watched] the new science fiction series yet?', l5: 'No, I [didn\'t see|haven\'t seen] it yet. Let\'s watch it!', l6: '' }
    ]
  },
  /* ---------- 3. Intermediate (B1): Unit 13 #NoFilter, Unit 14 Let's Cook! (Part 1) ---------- */
  {
    texts: [
      { id: 'b1-md-airbrush', title: "Don't airbrush me!", unit: 'Unit 13 · #NoFilter',
        l1: 'Photos in magazines [are often change|are often changed] with software.', l2: 'In the beginning, it [used|was used] to tidy up small problems.', l3: 'Now, almost anything [can do|can be done] on a computer.',
        l4: 'Many people think these photos are bad for our body image.', l5: 'Some teenagers are campaigning for real photos.', l6: '' },
      { id: 'b1-md-my-post', title: 'My post', unit: 'Unit 13 · #NoFilter',
        l1: 'Last week I posted a photo and tagged my friend Pippa.', l2: 'Lots of people [commented my photo|commented on my photo].', l3: "But Pippa didn't like it, so she asked me to [take down it|take it down].",
        l4: 'Some people wrote horrible comments, so I [blocked to them|blocked them].', l5: '[At the end|In the end], I deleted the photo.', l6: '' },
      { id: 'b1-md-kitchen-rules', title: 'Rules for the school kitchen', unit: "Unit 14 · Let's Cook!",
        l1: 'Hands must [wash|be washed] before you start.', l2: 'Mobile phones must not [be use|be used] in the kitchen.', l3: 'The vegetables must [be mix|be mixed] with the eggs.',
        l4: 'Bread [is baking|is baked] in the oven for 30 minutes.', l5: 'Please keep this area clear.', l6: '' },
      { id: 'b1-md-how-to-cook', title: 'How is it cooked?', unit: "Unit 14 · Let's Cook!",
        l1: "Rice is cooked over boiling water. It's [boiled|steamed].", l2: 'Cakes and bread are [roasted|baked] in the oven.', l3: 'Meat and potatoes are often [baked|roasted] in the oven with oil.',
        l4: 'Keep stirring the soup, or it will burn.', l5: 'This curry is very [spice|spicy]!', l6: '' },
      { id: 'b1-md-review', title: 'Online review: headphones', unit: 'Unit 13 · #NoFilter',
        l1: 'I bought these headphones last month.', l2: 'For a start, the sound is amazing.', l3: '[Other advantage|Another advantage] is that they are very light.',
        l4: 'The only disadvantage is that they [made|are made] of cheap plastic.', l5: '[At general|In general], I would recommend them.', l6: '' }
    ]
  },
  /* ---------- 4-6. IELTS: not made for these levels ---------- */
  { texts: [] },
  { texts: [] },
  { texts: [] }
];
/* Screen text & timing, per level. */
WU.content.detectiveScreen = {
  shared: {
    id: 'detective-screen',
    tag: 'MISTAKE DETECTIVE', unitShow: true,
    count: '{n} MISTAKES',
    read: 'Find the mistakes! Write the right sentences.', readSec: 90,
    call: 'Which line? Say its number!',
    found: 'FOUND!', none: 'NO MISTAKE!',
    done: 'Case closed! Check your sentences.',
    ask: '{name}, read the whole text!',
    demo: 'TEACHER DEMO: together!', demoShow: false
  },
  levels: [
    { readSec: 120, demoShow: true },
    { readSec: 100 },
    { readSec: 90 },
    { readSec: 75 },
    { readSec: 60 },
    { readSec: 60 },
    { readSec: 50 }
  ]
};
