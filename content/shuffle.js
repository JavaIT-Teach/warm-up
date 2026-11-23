/* Warm Up: content for STORY SHUFFLE (reading). A short text from the taught units is cut into lines and shuffled
   (A, B, C...). Pairs read the lines and write the right order (for example C A D B E); then the lines move into place
   one by one and a picked student answers a question about the text.
   Built from the taught lessons in the Lesson Plan Builder (weekly job, 2026-11-21).
   texts[level]: { id, title, unit, l1 ... l6, q, a }
     l1 ... l6 = the lines in the RIGHT order (3 to 6 lines; empty = not used). The game shuffles them.
     title = shown at the top (the class may read it). unit = the taught unit (tag).
     q = a question about the text after the order is checked (empty = none). a = its answer (teacher screen only).
   ONE order only: every line after l1 must point back to the line before it (an answer to its question, an echo of
   its words, So / But / Then / too, he / she / it / there). l1 must be an opener that cannot follow any other line.
   Test: if two lines can swap and the text still makes sense, rewrite one of them.
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.shuffle = [
  /* ---------- 0. Beginner (A1): Unit 9 Feeling Good, Unit 10 Things We Do, Unit 11 My Digital Life (Part 1) ---------- */
  {
    texts: [
      { id: 'a1-sh-mum-calls', title: 'Mum calls Tomás', unit: 'Unit 10 · Things We Do',
        l1: "Hi, Tomás! It's Mum. Where are you?", l2: "Hi, Mum! I'm at home, in my bedroom.", l3: 'In your bedroom? Are you doing your homework there?', l4: "No, I'm not doing my homework. I'm tidying my room.", l5: 'Tidying your room? Great! Thank you, Tomás!', l6: '',
        q: 'What is Tomás doing?', a: "He's tidying his room." },
      { id: 'a1-sh-dear-doctor', title: 'Dear Dr Smart', unit: 'Unit 9 · Feeling Good',
        l1: "Dear Dr Smart, my name is Tom and I'm 16.", l2: "I've got a problem. I like relaxing at home and watching TV.", l3: "But I don't like sport. Is that bad for me?", l4: 'Dear Tom, thank you for your letter. Yes, it is bad for you!', l5: "So do sport with your friends. You'll feel better!", l6: '',
        q: 'What does Tom like doing?', a: 'He likes relaxing at home and watching TV.' },
      { id: 'a1-sh-my-saturday', title: 'My Saturday', unit: 'Unit 11 · My Digital Life',
        l1: 'On Saturday, I always get up at nine o\'clock.', l2: 'Then I have breakfast with my family.', l3: 'After breakfast, I often play football with my friends.', l4: 'After football, I go home and have lunch.', l5: 'In the evening, I watch a film and go to bed late!', l6: '',
        q: 'What does he often do after breakfast?', a: 'He often plays football with his friends.' },
      { id: 'a1-sh-jose-on-tv', title: 'José is on TV!', unit: 'Unit 11 · My Digital Life',
        l1: 'Look! Your friend José is on TV!', l2: 'Really? What is he doing?', l3: "He's talking to a woman about his band.", l4: 'His band? Is it famous now?', l5: 'Yes, it is! They have a lot of fans.', l6: '',
        q: 'Who is José talking to?', a: "He's talking to a woman." },
      { id: 'a1-sh-who-helps', title: 'Who helps at home?', unit: 'Unit 10 · Things We Do',
        l1: 'Mum is at the front door with the shopping. Where are the children?', l2: "Jason is in the kitchen. He's cooking dinner.", l3: 'Great! And what about Esther? Is she helping too?', l4: "No, she isn't. She isn't at home.", l5: "Where is she? Oh, look! She's walking the dog!", l6: '',
        q: 'What is Jason doing?', a: "He's cooking dinner." }
    ]
  },
  /* ---------- 1. Elementary (A2): Unit 8 Favourite Places, Unit 9 Clothes and Fashion, Unit 10 Buying Things ---------- */
  {
    texts: [
      { id: 'a2-sh-new-jacket', title: 'My new jacket', unit: 'Unit 10 · Buying Things',
        l1: 'Last month, I wanted a new jacket for the winter.', l2: 'First, I looked at a lot of jackets online, but they were expensive.', l3: 'So I went to the shopping centre with my friend.', l4: 'There was a sale there, so I got a big discount on a black jacket.', l5: "When I got home, I couldn't find the receipt!", l6: 'Finally, I found it in the jacket pocket.',
        q: 'Why did she get a discount?', a: 'Because there was a sale.' },
      { id: 'a2-sh-cory-cookies', title: "Mr Cory's Cookies", unit: 'Unit 10 · Buying Things',
        l1: 'Cory was tired of getting the bus to school with his mum.', l2: 'He wanted to buy her a car, so he needed some money.', l3: 'First, he sold hot chocolate and lemonade in the street.', l4: 'After that, he and his mum made chocolate chip cookies.', l5: "People loved the cookies, so he started a business: Mr Cory's Cookies.", l6: 'Now the business is famous, and Cory is a young entrepreneur!',
        q: 'What did Cory sell first?', a: 'Hot chocolate and lemonade.' },
      { id: 'a2-sh-whose-boots', title: 'Whose boots?', unit: 'Unit 9 · Clothes and Fashion',
        l1: 'Whose boots are these? Are they yours?', l2: "No, they aren't mine. Mine are black.", l3: "Not yours? Then are they Megan's?", l4: "Yes, I think they're hers. She wore them yesterday.", l5: "OK. Let's give them to her.", l6: '',
        q: 'What colour are his boots?', a: 'They are black.' },
      { id: 'a2-sh-beach', title: 'My favourite place', unit: 'Unit 8 · Favourite Places',
        l1: "My favourite place is the beach near my grandparents' house.", l2: 'I go there every summer with my family.', l3: 'When we arrive, I take off my shoes and run into the sea.', l4: 'After my swim, I sit on the sand and read a book.', l5: 'In the evening, we all eat fish at my grandparents\' house.', l6: "That's why the beach is my favourite place!",
        q: 'What does he do when he arrives?', a: 'He takes off his shoes and runs into the sea.' },
      { id: 'a2-sh-best-buy', title: 'Best buy?', unit: 'Unit 9 · Clothes and Fashion',
        l1: 'Last year, I bought a pale blue jumper.', l2: 'It was made of wool, and it was really cheap.', l3: 'A week later, it was dirty, so I washed it in the washing machine.', l4: 'But the water was too hot. When I took it out, it was very small!', l5: 'Now my little sister wears it. It was not my best buy!', l6: '',
        q: 'What was the jumper made of?', a: 'It was made of wool.' }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+): Unit 10 Taste This!, Unit 11 A Healthy Future, Unit 12 Incredible Wildlife ---------- */
  {
    texts: [
      { id: 'a2p-sh-stick-insect', title: 'What is it?', unit: 'Unit 12 · Incredible Wildlife',
        l1: 'Look at this photo. What do you think it is?', l2: "It might be a stick. It's long and brown.", l3: "But it's got legs! It can't be a stick.", l4: "You're right. It must be an insect.", l5: "Yes, it's a stick insect. It looks just like a stick!", l6: '',
        q: 'Why can\'t it be a stick?', a: "Because it's got legs." },
      { id: 'a2p-sh-flu', title: 'Feeling ill', unit: 'Unit 11 · A Healthy Future',
        l1: 'I feel terrible today. I think I\'ve got flu.', l2: 'Oh no! Have you got a fever?', l3: 'Yes, I have, and my throat is really sore.', l4: "Go home and rest. I'll make you some tea.", l5: "Thanks. I'm going to stay in bed all day.", l6: '',
        q: 'What is wrong with her throat?', a: "It's sore." },
      { id: 'a2p-sh-order', title: 'At the café', unit: 'Unit 10 · Taste This!',
        l1: 'Hi! What can I get you?', l2: 'Could I have a veggie pizza, please?', l3: 'Sure. And to drink?', l4: "I'll have a small cola, please.", l5: 'Eat in or take out?', l6: 'Take out, please. Here you are.',
        q: 'What does the customer order to drink?', a: 'A small cola.' },
      { id: 'a2p-sh-keep-fit', title: "Lily's plan", unit: 'Unit 11 · A Healthy Future',
        l1: 'Last year, Lily was often tired and ill.', l2: 'So she decided to keep fit.', l3: 'First, she started swimming twice a week.', l4: 'After a few months, she started cycling and running too.', l5: "Next summer, she's going to do her first triathlon!", l6: '',
        q: 'What is Lily going to do next summer?', a: "She's going to do her first triathlon." },
      { id: 'a2p-sh-sound', title: 'What can you hear?', unit: 'Unit 12 · Incredible Wildlife',
        l1: 'Listen! What\'s that sound?', l2: "It might be a dog. It's quite loud.", l3: "No, it can't be a dog. It sounds like a big cat.", l4: 'Then it must be a tiger!', l5: "You're probably right. We're at the zoo!", l6: '',
        q: 'Why can\'t it be a dog?', a: 'Because it sounds like a big cat.' }
    ]
  },
  /* ---------- 3. Intermediate (B1): Unit 10 Animals in Danger, Unit 11 Off to School, Unit 12 Getting Around ---------- */
  {
    texts: [
      { id: 'b1-sh-held-up', title: 'A long first day', unit: 'Unit 12 · Getting Around',
        l1: 'We set off for the airport at six in the morning.', l2: 'When we arrived, we checked in and waited for our flight.', l3: 'Unfortunately, our flight was held up for three hours.', l4: 'By the time we landed, the youth hostel had closed.', l5: 'In the end, we spent our first night abroad at the airport!', l6: '',
        q: 'Why couldn\'t they stay at the youth hostel?', a: 'Because it had closed by the time they landed.' },
      { id: 'b1-sh-homework', title: 'The forgotten homework', unit: 'Unit 11 · Off to School',
        l1: 'It was Monday morning and I was sitting on the school bus.', l2: 'Suddenly, I realised I had left my homework at home.', l3: 'I had worked on it all weekend, so I felt terrible.', l4: 'When I got to school, I told my teacher what had happened.', l5: 'Luckily, she let me hand it in the next day.', l6: '',
        q: 'What had the writer left at home?', a: 'His / her homework.' },
      { id: 'b1-sh-orangutans', title: 'Orangutans in danger', unit: 'Unit 10 · Animals in Danger',
        l1: 'Orangutans live high in the trees of the rainforest in Sumatra.', l2: 'However, their habitat is decreasing every year.', l3: 'When their part of the forest is damaged, they have nowhere to live.', l4: 'That is why experts take these homeless orangutans to a rescue centre.', l5: "If we don't protect the rainforest, they won't survive in the wild.", l6: '',
        q: 'Where do orangutans live?', a: 'High in the trees of the rainforest in Sumatra.' },
      { id: 'b1-sh-trip-advice', title: 'Travelling with your besties', unit: 'Unit 12 · Getting Around',
        l1: "Planning a trip abroad with your besties? Here's my advice.", l2: 'First, you need to check which documents to take.', l3: "If you're under 18, you also have to take a letter from your parents.", l4: 'Once your documents are ready, think about the flight: get to the airport two hours early.', l5: "Finally, don't pack too much stuff: you'll have to carry it!", l6: '',
        q: 'What do you have to take if you are under 18?', a: 'A letter from your parents.' },
      { id: 'b1-sh-boarding', title: 'My first term', unit: 'Unit 11 · Off to School',
        l1: 'Last September, I started at a boarding school.', l2: 'I had never lived away from home before, so I was nervous.', l3: 'At first, I missed my family a lot.', l4: 'After a few weeks, though, I had made some good friends.', l5: 'By the time school broke up in December, I loved it!', l6: '',
        q: 'How did the writer feel at first?', a: 'Nervous. He / she missed his / her family a lot.' }
    ]
  },
  /* ---------- 4.-6. IELTS: no groups at these levels yet ---------- */
  { texts: [] },
  { texts: [] },
  { texts: [] }
];
/* Screen text & timing, per level. */
WU.content.shuffleScreen = {
  shared: {
    id: 'shuffle-screen',
    tag: 'STORY SHUFFLE', unitShow: true,
    read: 'Read the lines. Write the right order!', readSec: 90, example: 'Example: C A D B E',
    order: 'Check your order!', step: 'Line {n} is...', done: 'How many did you get right?',
    ask: '{name}, answer!', qLabel: 'QUESTION',
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
