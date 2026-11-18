/* Warm Up: content for LOST WORD (Elementary and up). Generated with a permanent id on every item.
   Three modes, three lists per level:
   describe[level]: { id, situation, banned, pic, guess, got, model, more }. banned = the lost word first, then related words
     (easiest first). The screen record's banN says how many count in a normal round; HARD MODE (B) bans them all.
     guess = the listener's wrong guess; got = the listener gets it; model = a model first try; more = a model extra detail.
   simplify[level]: { id, situation, big, word, simple }. big = the hard sentence, word = the hard part (highlighted), simple = a model.
   polite[level]: { id, situation, blunt, size, polite }. size 1 small, 2 medium, 3 big request (bigger = more polite distance).
   id is PERMANENT: teacher edits (Edit mode) point at it. Never change or reuse an id. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.lostword = [
  /* ---------- 0. Beginner (A1): the game starts at Elementary ---------- */
  {
    describe: [],
    simplify: [],
    polite: []
  },
  /* ---------- 1. Elementary (A2) ---------- */
  {
    describe: [
      { id: "e-lwd-spoon", situation: "Café. Your soup is here. You need a spoon.", banned: "spoon, soup, eat", pic: "spoon", guess: "A fork?", got: "Oh, a spoon! Here you are.", model: "Can I have a thing for soup, please?", more: "It's small and round. You eat soup with it." },
      { id: "e-lwd-umbrella", situation: "Your friend's house. It's raining outside.", banned: "umbrella, rain, wet", pic: "umbrella", guess: "A coat?", got: "Oh, an umbrella! Take mine.", model: "Have you got a thing for the rain?", more: "You hold it over your head." },
      { id: "e-lwd-scissors", situation: "Classroom. You need to cut some paper.", banned: "scissors, cut, paper", pic: "scissors", guess: "A knife?", got: "Oh, scissors! Here you are.", model: "Have you got a thing for cutting?", more: "It's small. Children use it at school." },
      { id: "e-lwd-eraser", situation: "Classroom. You made a mistake with your pencil.", banned: "eraser, rubber, pencil", pic: "eraser", guess: "A pen?", got: "Oh, an eraser! Here.", model: "Can I have a thing for my mistake, please?", more: "It takes the mistake off the page." },
      { id: "e-lwd-toothbrush", situation: "Hotel. You forgot your toothbrush.", banned: "toothbrush, teeth, brush", pic: "toothbrush", guess: "Toothpaste?", got: "Oh, a toothbrush! Here you are.", model: "Have you got a thing for my teeth?", more: "It's small. You use it in the morning and at night." },
      { id: "e-lwd-kettle", situation: "Your friend's kitchen. You want to make tea.", banned: "kettle, water, hot", pic: "kettle", guess: "A cup?", got: "Oh, the kettle! It's over there.", model: "Where's the thing for making tea?", more: "It's electric. You put it on, and it makes a noise." },
      { id: "e-lwd-key", situation: "Hotel. You can't open the door of your room.", banned: "key, door, open", pic: "key", guess: "A card?", got: "Oh, your key! Here it is.", model: "Can I have the thing for my room, please?", more: "It's small and metal. It's in your hand." },
      { id: "e-lwd-candle", situation: "Home. The lights are off. It's dark.", banned: "candle, light, fire", pic: "candle", guess: "A lamp?", got: "Oh, a candle! Here you are.", model: "Have you got a thing for the dark?", more: "It's white. It has a small fire on top." },
      { id: "e-lwd-ruler", situation: "Classroom. You want to draw a straight line.", banned: "ruler, line, long", pic: "ruler", guess: "A pencil?", got: "Oh, a ruler! Here you are.", model: "Can I have a thing for drawing, please?", more: "It's long and flat. It has numbers on it." },
      { id: "e-lwd-pan", situation: "Your friend's kitchen. You want to cook eggs.", banned: "pan, cook, eggs", pic: "pan", guess: "A plate?", got: "Oh, a pan! Here you are.", model: "Have you got a thing for cooking?", more: "It's black and round. You put it on the cooker." }
    ],
    simplify: [],
    polite: [
      { id: "e-lwp-tea", situation: "Café.", blunt: "Give me a tea.", size: 1, polite: "Can I have a tea, please?" },
      { id: "e-lwp-blue", situation: "Clothes shop.", blunt: "I want this T-shirt in blue.", size: 1, polite: "Have you got this T-shirt in blue, please?" },
      { id: "e-lwp-pen", situation: "Classroom.", blunt: "Give me your pen.", size: 1, polite: "Can I borrow your pen, please?" },
      { id: "e-lwp-bank", situation: "In the street.", blunt: "Where is the bank?", size: 1, polite: "Excuse me, where is the bank, please?" },
      { id: "e-lwp-water", situation: "Restaurant.", blunt: "Water!", size: 1, polite: "Can I have some water, please?" },
      { id: "e-lwp-window", situation: "Your friend's house. It's cold.", blunt: "Close the window.", size: 2, polite: "Can you close the window, please?" },
      { id: "e-lwp-room", situation: "Hotel.", blunt: "I want a room.", size: 1, polite: "Can I have a room, please?" },
      { id: "e-lwp-bag", situation: "Bus. A bag is on the seat.", blunt: "Move your bag.", size: 2, polite: "Excuse me, can you move your bag, please?" },
      { id: "e-lwp-again", situation: "Classroom. The teacher speaks fast.", blunt: "Say it again.", size: 2, polite: "Sorry, can you say that again, please?" },
      { id: "e-lwp-toilet", situation: "Shop.", blunt: "Toilet?", size: 1, polite: "Excuse me, where's the toilet, please?" }
    ]
  },
  /* ---------- 2. Pre-Intermediate (A2+) ---------- */
  {
    describe: [
      { id: "p-lwd-towel", situation: "Hotel. There's no towel in your bathroom.", banned: "towel, shower, dry", pic: "", guess: "A blanket?", got: "Oh, a towel! Here you go.", model: "Can I have something to dry myself with?", more: "It's soft. You use it after you wash." },
      { id: "p-lwd-charger", situation: "Your friend's house. Your phone is dying.", banned: "charger, phone, battery", pic: "", guess: "Headphones?", got: "Oh, a charger! Here you go.", model: "Have you got something I can use to give my phone power?", more: "You put it in the wall, then in your phone." },
      { id: "p-lwd-bottle-opener", situation: "Picnic. You can't open your drink.", banned: "bottle opener, open, bottle", pic: "", guess: "A knife?", got: "Oh, a bottle opener! Here.", model: "Have you got something to take the top off this?", more: "It's small and metal. You use it for drinks." },
      { id: "p-lwd-fitting-room", situation: "Clothes shop. You want to try on some jeans.", banned: "fitting room, try on, mirror", pic: "", guess: "The toilet?", got: "Oh, the fitting room! It's over there.", model: "Excuse me, where can I put these on before I buy them?", more: "It's a small room in the shop." },
      { id: "p-lwd-receipt", situation: "Shop. You want to bring the shoes back next week.", banned: "receipt, paper, pay", pic: "", guess: "A bag?", got: "Oh, the receipt! Here you are.", model: "Can I have the thing that shows what I bought?", more: "It shows how much money I gave you." },
      { id: "p-lwd-plumber", situation: "Phone call. There's water on your bathroom floor.", banned: "plumber, pipes, fix", pic: "", guess: "An electrician?", got: "Oh, a plumber! I'll send one.", model: "I need someone who repairs things in the bathroom.", more: "No, someone who repairs sinks and toilets." },
      { id: "p-lwd-pharmacy", situation: "A new city. You have a headache.", banned: "pharmacy, medicine, chemist", pic: "", guess: "A hospital?", got: "Oh, a pharmacy! There's one on the corner.", model: "Is there a place where I can buy something for my headache?", more: "A small shop. I don't need a doctor." },
      { id: "p-lwd-hairdresser", situation: "Holiday. Your hair is too long.", banned: "hairdresser, barber, salon", pic: "", guess: "A beauty shop?", got: "Oh, a hairdresser! There's one near here.", model: "Where can I find someone who makes your hair shorter?", more: "Someone with scissors. You sit in a big chair." },
      { id: "p-lwd-ladder", situation: "Your friend's house. Your ball is on the roof.", banned: "ladder, climb, steps", pic: "", guess: "A chair?", got: "Oh, a ladder! It's in the garage.", model: "Have you got something I can stand on to get up there?", more: "It's tall. You go up one foot at a time." },
      { id: "p-lwd-tissue", situation: "Classroom. You have a cold.", banned: "tissue, nose, paper", pic: "", guess: "Some water?", got: "Oh, a tissue! Here you go.", model: "Have you got something for my nose?", more: "It's soft and white. You use it, then throw it away." }
    ],
    simplify: [
      { id: "p-lws-refund", situation: "Shop. The shoes you bought are broken.", big: "I'd like a refund.", word: "refund", simple: "Can I get my money back?" },
      { id: "p-lws-reschedule", situation: "Phone call to the dentist.", big: "I need to reschedule my appointment.", word: "reschedule", simple: "I can't come on Tuesday. Can I come on Thursday?" },
      { id: "p-lws-complimentary", situation: "Hotel reception.", big: "Is breakfast complimentary?", word: "complimentary", simple: "Is breakfast free?" },
      { id: "p-lws-out-of-order", situation: "Hotel. You tell a guest.", big: "The lift is out of order.", word: "out of order", simple: "The lift doesn't work." },
      { id: "p-lws-vegetarian", situation: "Restaurant.", big: "Is this dish vegetarian?", word: "vegetarian", simple: "Is there any meat in this?" },
      { id: "p-lws-cancelled", situation: "Airport. You call your friend.", big: "My flight was cancelled.", word: "cancelled", simple: "My plane isn't going today." },
      { id: "p-lws-larger", situation: "Clothes shop.", big: "Do you have this in a larger size?", word: "larger size", simple: "Do you have this, but bigger?" },
      { id: "p-lws-vacant", situation: "Train.", big: "Is this seat vacant?", word: "vacant", simple: "Is this seat free?" },
      { id: "p-lws-withdraw", situation: "Bank.", big: "I'd like to withdraw some cash.", word: "withdraw", simple: "I want to take some money out." },
      { id: "p-lws-exhausted", situation: "You meet a friend after work.", big: "I'm exhausted.", word: "exhausted", simple: "I'm really, really tired." }
    ],
    polite: [
      { id: "p-lwp-coffee", situation: "Café.", blunt: "Give me a coffee.", size: 1, polite: "Could I get a coffee, please?" },
      { id: "p-lwp-table", situation: "Furniture shop. The assistant asks: \"Can I help you?\"", blunt: "I need a table.", size: 1, polite: "I'm looking for a table." },
      { id: "p-lwp-help", situation: "Office. You can't open a file.", blunt: "Help me.", size: 2, polite: "Could you help me, please?" },
      { id: "p-lwp-music", situation: "Your neighbour's music is loud.", blunt: "Turn your music down.", size: 2, polite: "Could you turn your music down a bit, please?" },
      { id: "p-lwp-car", situation: "Your friend has a car. You want it for the weekend.", blunt: "Lend me your car.", size: 3, polite: "I was wondering if I could borrow your car this weekend." },
      { id: "p-lwp-bill", situation: "Restaurant.", blunt: "I want the bill.", size: 1, polite: "Could we have the bill, please?" },
      { id: "p-lwp-notes", situation: "You missed a class.", blunt: "Send me your notes.", size: 2, polite: "Could you send me your notes, please?" },
      { id: "p-lwp-hotel-room", situation: "Hotel. Your room is very noisy.", blunt: "Change my room.", size: 2, polite: "Would it be possible to change my room?" },
      { id: "p-lwp-essay", situation: "You want your teacher to read your essay before the exam.", blunt: "Check my essay.", size: 3, polite: "I was wondering if you could check my essay." },
      { id: "p-lwp-photo", situation: "Tourist place. You want a photo with your friends.", blunt: "Take a photo of us.", size: 2, polite: "Excuse me, could you take a photo of us, please?" }
    ]
  },
  /* ---------- 3. Intermediate (B1) ---------- */
  {
    describe: [
      { id: "i-lwd-extension-cable", situation: "Office. Your laptop cable doesn't reach the wall.", banned: "extension cable, cable, plug", pic: "", guess: "A charger?", got: "Oh, an extension cable! Here.", model: "Is there something I can use to get power from further away?", more: "It's long. It has more places to plug things in." },
      { id: "i-lwd-landlord", situation: "Your flat. The heating is broken.", banned: "landlord, owner, rent", pic: "", guess: "A plumber?", got: "Oh, your landlord! You should call them.", model: "Who's the person that the flat belongs to?", more: "The person I pay every month to live here." },
      { id: "i-lwd-lost-property", situation: "Train station. You left your bag on the train.", banned: "lost property, lost, office", pic: "", guess: "The ticket office?", got: "Oh, lost property! It's next to platform 1.", model: "Is there a place where they keep things people leave on trains?", more: "Where you go when you can't find your things." },
      { id: "i-lwd-sun-cream", situation: "Beach. Your skin is going red.", banned: "sun cream, sun, skin", pic: "", guess: "Sunglasses?", got: "Oh, sun cream! Here you go.", model: "Have you got something I can put on so I don't burn?", more: "It's a cream. You put it on before the beach." },
      { id: "i-lwd-stapler", situation: "Office. You need to keep ten pages together.", banned: "stapler, paper, together", pic: "", guess: "A paper clip?", got: "Oh, a stapler! It's on my desk.", model: "Have you got the thing that joins pages with a small piece of metal?", more: "You press it down hard. Click!" },
      { id: "i-lwd-babysitter", situation: "You want to go out tonight. Your kids are small.", banned: "babysitter, children, look after", pic: "", guess: "A teacher?", got: "Oh, a babysitter! I know a good one.", model: "Do you know someone who stays with kids when the parents go out?", more: "Someone you pay for one evening." },
      { id: "i-lwd-tow-truck", situation: "Phone call. Your car broke down on the motorway.", banned: "tow truck, car, pull", pic: "", guess: "A taxi?", got: "Oh, a tow truck! I'll send one.", model: "My engine stopped. I need something big that can take it to a garage.", more: "It carries vehicles that don't work." },
      { id: "i-lwd-hanger", situation: "Hotel. You want to put your shirt in the wardrobe.", banned: "hanger, hang, wardrobe", pic: "", guess: "A hook?", got: "Oh, hangers! There are some in there.", model: "Have you got something to put my shirt on so it doesn't get creased?", more: "It's plastic or wood, the shape of shoulders." },
      { id: "i-lwd-deposit", situation: "You're moving out of a flat.", banned: "deposit, money, back", pic: "", guess: "The rent?", got: "Oh, your deposit! You'll get it next week.", model: "When do I get back what I paid at the start, before I moved in?", more: "The extra I paid in case I broke something." },
      { id: "i-lwd-cash-machine", situation: "A new city. You need cash.", banned: "cash machine, ATM, money", pic: "", guess: "A bank?", got: "Oh, a cash machine! There's one outside.", model: "Is there a machine where I can use my card to get notes?", more: "It's in the wall, outside the bank." }
    ],
    simplify: [
      { id: "i-lws-subscription", situation: "Phone call to a streaming company.", big: "I'd like to cancel my subscription.", word: "cancel my subscription", simple: "I don't want to pay every month any more. Can you stop it?" },
      { id: "i-lws-additional", situation: "Hotel reception.", big: "Is there an additional charge?", word: "additional charge", simple: "Do I have to pay more?" },
      { id: "i-lws-postponed", situation: "Work. You tell a colleague.", big: "The meeting has been postponed.", word: "postponed", simple: "The meeting isn't today. It's later." },
      { id: "i-lws-defective", situation: "Shop.", big: "These headphones are defective.", word: "defective", simple: "These headphones are broken. Something is wrong with them." },
      { id: "i-lws-malfunctioning", situation: "Phone call to your landlord.", big: "The heating is malfunctioning.", word: "malfunctioning", simple: "The heating doesn't work properly." },
      { id: "i-lws-misplaced", situation: "Airport.", big: "My baggage has been misplaced.", word: "misplaced", simple: "You've lost my bags." },
      { id: "i-lws-dizziness", situation: "Doctor's.", big: "I've been experiencing dizziness.", word: "dizziness", simple: "I feel like the room is moving." },
      { id: "i-lws-terminate", situation: "Gym reception.", big: "I'd like to terminate my membership.", word: "terminate", simple: "I want to stop coming here. Can I end it?" },
      { id: "i-lws-decaffeinated", situation: "Café, late in the evening.", big: "Is this decaffeinated?", word: "decaffeinated", simple: "Will this drink keep me awake?" },
      { id: "i-lws-transferred", situation: "Phone call to a bank.", big: "Your call is being transferred.", word: "transferred", simple: "I'm sending you to another person." }
    ],
    polite: [
      { id: "i-lwp-coffee-croissant", situation: "Café.", blunt: "Give me a coffee and a croissant.", size: 1, polite: "Could I get a coffee and a croissant, please?" },
      { id: "i-lwp-charger-shop", situation: "Phone shop.", blunt: "I need a charger for this phone.", size: 1, polite: "I'm looking for a charger for this phone." },
      { id: "i-lwp-shift", situation: "Work. You can't come on Saturday.", blunt: "Cover my shift on Saturday.", size: 3, polite: "I was wondering if you could cover my shift on Saturday." },
      { id: "i-lwp-plants", situation: "You're going on holiday for a week.", blunt: "Water my plants while I'm away.", size: 3, polite: "Would you mind watering my plants while I'm away?" },
      { id: "i-lwp-friday", situation: "You need Friday off. You speak to your boss.", blunt: "I want Friday off.", size: 3, polite: "I was wondering if I could take Friday off." },
      { id: "i-lwp-other-table", situation: "Restaurant. Your table is next to the door.", blunt: "Move us to another table.", size: 2, polite: "Would it be possible to move to another table?" },
      { id: "i-lwp-watch-bag", situation: "Café. You need the toilet.", blunt: "Watch my bag.", size: 2, polite: "Could you keep an eye on my bag for a minute?" },
      { id: "i-lwp-explain", situation: "Classroom. You don't understand the homework.", blunt: "Explain this to me.", size: 2, polite: "Could you explain this to me?" },
      { id: "i-lwp-airport", situation: "Your flight lands at 2 am.", blunt: "Pick me up from the airport.", size: 3, polite: "Would you mind picking me up from the airport?" },
      { id: "i-lwp-clean", situation: "Hotel. Your room wasn't cleaned yesterday.", blunt: "Clean my room now.", size: 2, polite: "Could you clean my room this morning, please?" }
    ]
  },
  /* ---------- 4. IELTS 1 (B2) ---------- */
  {
    describe: [
      { id: "x1-lwd-jet-lag", situation: "You flew from Tashkent to New York. It's 3 am and you're wide awake.", banned: "jet lag, tired, flight", pic: "", guess: "Insomnia?", got: "Oh, jet lag! It takes a few days.", model: "I've got that problem when your body still thinks it's in the old country.", more: "My body is still on Tashkent hours." },
      { id: "x1-lwd-power-cut", situation: "Hotel. Everything in your room just went dark.", banned: "power cut, electricity, lights", pic: "", guess: "Is the bulb broken?", got: "Oh, a power cut! It'll be back in ten minutes.", model: "Nothing in my room works. Not even the fridge.", more: "The whole building is dark, not just my lamp." },
      { id: "x1-lwd-spare-key", situation: "You're locked out. You knock on your neighbour's door.", banned: "spare key, key, door", pic: "", guess: "A locksmith?", got: "Oh, the spare key! It's under the plant.", model: "Do you still have the extra one I gave you, in case I lost mine?", more: "The second copy I left with you last year." },
      { id: "x1-lwd-parking-ticket", situation: "You come back to your car and find a paper on the window.", banned: "parking ticket, fine, police", pic: "", guess: "A speeding ticket?", got: "Oh, a parking ticket! You can pay online.", model: "I have to pay because I left the car in the wrong place.", more: "Not for driving fast. For where I stopped." },
      { id: "x1-lwd-dishwasher", situation: "A rented flat. You ask the host.", banned: "dishwasher, dishes, wash", pic: "", guess: "The sink?", got: "Oh, the dishwasher! It's under the counter.", model: "Is there a machine that cleans plates and glasses?", more: "You put everything in dirty and it comes out clean." },
      { id: "x1-lwd-invoice", situation: "Work. You need a document from a supplier.", banned: "invoice, bill, pay", pic: "", guess: "A receipt?", got: "Oh, an invoice! I'll send it today.", model: "Could you send me the document that says how much we owe you?", more: "Before we pay, not after." },
      { id: "x1-lwd-second-hand", situation: "New city. You want cheap clothes.", banned: "second-hand, used, charity shop", pic: "", guess: "A market?", got: "Oh, a second-hand shop! There's one round the corner.", model: "Is there a place that sells clothes that belonged to someone else?", more: "Cheaper, because people wore them before." },
      { id: "x1-lwd-layover", situation: "Travel agent. You're booking a long flight.", banned: "layover, stop, connection", pic: "", guess: "A delay?", got: "Oh, a layover! Two hours in Istanbul.", model: "Is there a break in the middle where we change planes?", more: "We wait at another airport, then fly again." }
    ],
    simplify: [
      { id: "x1-lws-streamline", situation: "Work meeting.", big: "We need to streamline the process.", word: "streamline", simple: "We need to make it simpler and faster." },
      { id: "x1-lws-effective", situation: "Office notice.", big: "The new policy is effective immediately.", word: "effective immediately", simple: "The new rule starts now." },
      { id: "x1-lws-feasible", situation: "A client asks for a big change.", big: "I'm afraid that's not feasible.", word: "feasible", simple: "Sorry, we can't do that." },
      { id: "x1-lws-refrain", situation: "Sign at a station.", big: "Please refrain from smoking.", word: "refrain from", simple: "Please don't smoke." },
      { id: "x1-lws-mandatory", situation: "Email from your manager.", big: "Attendance is mandatory.", word: "mandatory", simple: "You have to come." },
      { id: "x1-lws-adverse", situation: "Airport announcement.", big: "The flight is delayed due to adverse weather.", word: "adverse weather", simple: "The plane is late because the weather is bad." },
      { id: "x1-lws-regret", situation: "Email after a job interview.", big: "We regret to inform you that your application was unsuccessful.", word: "regret to inform you", simple: "Sorry, you didn't get the job." },
      { id: "x1-lws-upon-receipt", situation: "A bill from a company.", big: "Payment is due upon receipt.", word: "upon receipt", simple: "Pay as soon as you get this." }
    ],
    polite: [
      { id: "x1-lwp-proofread", situation: "Work. Your report is due tomorrow.", blunt: "Proofread my report.", size: 3, polite: "I was wondering if you'd mind proofreading my report." },
      { id: "x1-lwp-late-checkout", situation: "Hotel. Your flight is in the evening.", blunt: "Give me a late checkout.", size: 2, polite: "Would it be possible to have a late checkout?" },
      { id: "x1-lwp-extension", situation: "University. You're ill and the essay is due on Friday.", blunt: "Extend my deadline.", size: 3, polite: "I was wondering if there's any chance of an extension." },
      { id: "x1-lwp-swap", situation: "Train. You want to sit next to your friend.", blunt: "Swap seats with me.", size: 2, polite: "Would you mind swapping seats with me?" },
      { id: "x1-lwp-latte", situation: "Café.", blunt: "A latte.", size: 1, polite: "Could I get a latte, please?" },
      { id: "x1-lwp-size", situation: "Clothes shop.", blunt: "Find this in my size.", size: 1, polite: "Do you have this in my size, by any chance?" },
      { id: "x1-lwp-boiler", situation: "Your landlord. There's no hot water.", blunt: "Fix the boiler.", size: 2, polite: "Would you be able to get the boiler fixed this week?" },
      { id: "x1-lwp-lend", situation: "You need money until payday.", blunt: "Lend me 500 dollars.", size: 3, polite: "I hate to ask, but could you possibly lend me 500 dollars?" }
    ]
  },
  /* ---------- 5. IELTS 2 (C1) ---------- */
  {
    describe: [
      { id: "x2-lwd-headphones", situation: "Airport shop. You have a long, noisy flight.", banned: "noise-cancelling headphones, quiet, music", pic: "", guess: "Earplugs?", got: "Oh, noise-cancelling headphones! Try these.", model: "Do you have the kind that blocks out the sound around you?", more: "The ones that make a busy plane silent." },
      { id: "x2-lwd-dress-code", situation: "A friend invites you to a work party.", banned: "dress code, clothes, wear", pic: "", guess: "The theme?", got: "Oh, the dress code! Smart casual.", model: "Are there any rules about what we should put on for the evening?", more: "Do men need a jacket and tie?" },
      { id: "x2-lwd-small-print", situation: "You're signing a phone contract.", banned: "small print, contract, details", pic: "", guess: "The signature?", got: "Oh, the small print! Read it carefully.", model: "Where are the tiny words at the bottom that nobody reads?", more: "The part where the hidden fees usually are." },
      { id: "x2-lwd-adapter", situation: "Travel shop in London. Your phone cable doesn't fit the wall.", banned: "adapter, plug, socket", pic: "", guess: "A charger?", got: "Oh, an adapter! You'll need a UK one.", model: "Do you sell the thing that lets my cable fit into the wall here?", more: "Mine has two round pins. Yours are flat." },
      { id: "x2-lwd-customs", situation: "Airport. You have three bottles of wine in your bag.", banned: "customs, declare, passport", pic: "", guess: "Passport control?", got: "Oh, customs! It's after baggage reclaim.", model: "Where do they check what I'm bringing into the country?", more: "Where I tell them about things I have to pay tax on." },
      { id: "x2-lwd-down-payment", situation: "Bank. You want to buy a flat.", banned: "down payment, deposit, mortgage", pic: "", guess: "A loan?", got: "Oh, the down payment! Usually twenty per cent.", model: "How much do I need at the start, before the monthly payments begin?", more: "The first big amount, before the bank pays the rest." },
      { id: "x2-lwd-wake-up-call", situation: "Hotel. Your flight is at 7 am.", banned: "wake-up call, alarm, morning", pic: "", guess: "Breakfast?", got: "Oh, a wake-up call! What time?", model: "Could someone ring my room at five so I don't oversleep?", more: "The hotel phones me so I get up on time." },
      { id: "x2-lwd-standing-desk", situation: "New office. Your back hurts from sitting.", banned: "standing desk, desk, stand", pic: "", guess: "A bar stool?", got: "Oh, a standing desk! We have two.", model: "Is there somewhere I can work without being on a chair all day?", more: "The kind you can raise and lower." }
    ],
    simplify: [
      { id: "x2-lws-reassess", situation: "Team meeting.", big: "We'll need to reassess our priorities.", word: "reassess our priorities", simple: "We need to decide again what's most important." },
      { id: "x2-lws-inconclusive", situation: "A doctor talks about your test.", big: "The results were inconclusive.", word: "inconclusive", simple: "We still don't know the answer." },
      { id: "x2-lws-suspended", situation: "Email from your bank.", big: "Your account has been temporarily suspended.", word: "temporarily suspended", simple: "You can't use your account for now." },
      { id: "x2-lws-belongings", situation: "Announcement on a plane.", big: "Please ensure you retain all personal belongings.", word: "retain all personal belongings", simple: "Don't forget your things." },
      { id: "x2-lws-capacity", situation: "Door of a concert.", big: "The venue has reached maximum capacity.", word: "maximum capacity", simple: "It's full. No more people." },
      { id: "x2-lws-acknowledge", situation: "Email from a company.", big: "Kindly acknowledge receipt of this email.", word: "acknowledge receipt", simple: "Please tell us you got this email." },
      { id: "x2-lws-volumes", situation: "Phone line of a company.", big: "We are currently experiencing high call volumes.", word: "high call volumes", simple: "Lots of people are calling now, so you'll have to wait." },
      { id: "x2-lws-sustained", situation: "Phone call to your insurance company.", big: "The vehicle sustained minor damage.", word: "sustained minor damage", simple: "The car is a little bit damaged." }
    ],
    polite: [
      { id: "x2-lwp-parking", situation: "Your neighbour parks in your space every day.", blunt: "Stop parking in my space.", size: 3, polite: "I was wondering if you could avoid parking in my space." },
      { id: "x2-lwp-meeting", situation: "Work. You have a doctor's appointment at 3.", blunt: "Take this meeting for me.", size: 3, polite: "Would you mind covering this meeting for me?" },
      { id: "x2-lwp-fish", situation: "Restaurant. The waiter brings chicken. You ordered fish.", blunt: "This isn't what I ordered.", size: 2, polite: "Sorry, I think there might be a mistake. I ordered the fish." },
      { id: "x2-lwp-pay-rise", situation: "You speak to your manager.", blunt: "I want a pay rise.", size: 3, polite: "I was hoping we could talk about my salary." },
      { id: "x2-lwp-quiet", situation: "Library. Two people are talking loudly.", blunt: "Be quiet.", size: 2, polite: "Sorry, would you mind keeping it down a little?" },
      { id: "x2-lwp-discount", situation: "Market. You're buying three carpets.", blunt: "Give me a discount.", size: 2, polite: "Is there any chance of a discount?" },
      { id: "x2-lwp-cv", situation: "A friend works in HR.", blunt: "Read my CV.", size: 2, polite: "Could you have a quick look at my CV?" },
      { id: "x2-lwp-upgrade", situation: "Check-in desk. It's your honeymoon.", blunt: "Upgrade me.", size: 3, polite: "I was wondering whether an upgrade might be possible." }
    ]
  },
  /* ---------- 6. IELTS 3 (C2) ---------- */
  {
    describe: [
      { id: "x3-lwd-grace-period", situation: "Phone call. You forgot to pay a bill on time.", banned: "grace period, late, extra days", pic: "", guess: "A refund?", got: "Oh, the grace period! You have five more days.", model: "Is there a short time after the deadline when I can still pay without a penalty?", more: "Some time before they start charging me." },
      { id: "x3-lwd-boarding-pass", situation: "Airport gate. You can't find a document.", banned: "boarding pass, ticket, gate", pic: "", guess: "Your passport?", got: "Oh, your boarding pass! It's on the app.", model: "I've lost the document that lets me get on the flight.", more: "It has my seat number on it." },
      { id: "x3-lwd-out-of-office", situation: "Work. You emailed a client and got an automatic answer.", banned: "out-of-office, holiday, automatic", pic: "", guess: "Spam?", got: "Oh, an out-of-office reply! She's back on Monday.", model: "I got one of those messages saying the person is away.", more: "The one that says 'back next week'." },
      { id: "x3-lwd-notice-period", situation: "Job interview. You still work for another company.", banned: "notice period, quit, resign", pic: "", guess: "A holiday?", got: "Oh, your notice period! How long is it?", model: "I have to keep working for a month after I tell them I'm leaving.", more: "Between telling my boss and my last day." },
      { id: "x3-lwd-pins-and-needles", situation: "Doctor's. Your foot feels strange after a long meeting.", banned: "pins and needles, numb, asleep", pic: "", guess: "Cramp?", got: "Oh, pins and needles! It'll pass.", model: "My foot has that strange tingling feeling.", more: "Like when you sit on your leg too long." },
      { id: "x3-lwd-loyalty-card", situation: "Café. You come here every day.", banned: "loyalty card, points, stamps", pic: "", guess: "A credit card?", got: "Oh, a loyalty card! Every tenth coffee is free.", model: "Do you have one of those things where you collect something and get a free drink?", more: "You get rewarded for coming back." },
      { id: "x3-lwd-red-tape", situation: "You complain about getting a work visa.", banned: "red tape, bureaucracy, forms", pic: "", guess: "Corruption?", got: "Oh, red tape! It's a nightmare.", model: "There are so many official rules and documents that nothing gets done.", more: "Five offices and ten signatures for one simple thing." },
      { id: "x3-lwd-speed-bump", situation: "You tell a friend about a street near a school.", banned: "speed bump, slow, road", pic: "", guess: "A pothole?", got: "Oh, a speed bump! There are three on that street.", model: "It's the raised part across the street that makes drivers brake.", more: "So cars can't go fast near the children." }
    ],
    simplify: [
      { id: "x3-lws-scepticism", situation: "News report.", big: "The proposal was met with considerable scepticism.", word: "met with considerable scepticism", simple: "A lot of people didn't believe the plan would work." },
      { id: "x3-lws-mitigate", situation: "Project meeting.", big: "We must mitigate the risks.", word: "mitigate", simple: "We need to make the danger smaller." },
      { id: "x3-lws-contingent", situation: "Email about a new project.", big: "This is contingent on funding.", word: "contingent on", simple: "It only happens if we get the money." },
      { id: "x3-lws-deemed", situation: "News report.", big: "His remarks were deemed inappropriate.", word: "deemed inappropriate", simple: "People thought what he said was wrong." },
      { id: "x3-lws-defer", situation: "Company announcement.", big: "The board has elected to defer the decision.", word: "elected to defer", simple: "They will decide later." },
      { id: "x3-lws-deterioration", situation: "Weather report.", big: "Further deterioration is anticipated.", word: "deterioration is anticipated", simple: "We think it will get worse." },
      { id: "x3-lws-warrant", situation: "Research report.", big: "The data warrant further investigation.", word: "warrant further investigation", simple: "We need to look at this more." },
      { id: "x3-lws-possess", situation: "Job advert.", big: "Applicants must possess a valid driving licence.", word: "possess a valid", simple: "You need a driving licence that hasn't expired." }
    ],
    polite: [
      { id: "x3-lwp-invoice", situation: "A client hasn't paid for two months.", blunt: "Pay the invoice.", size: 3, polite: "I was just wondering if you'd had a chance to look at the invoice." },
      { id: "x3-lwp-reference", situation: "You're applying for a master's. You email your old professor.", blunt: "Write me a reference.", size: 3, polite: "I was wondering if you'd be willing to write me a reference." },
      { id: "x3-lwp-tree", situation: "Your neighbour's tree blocks the sun in your garden.", blunt: "Your tree is blocking my light.", size: 3, polite: "I hope you don't mind me mentioning it, but your tree is blocking some of my light." },
      { id: "x3-lwp-wrong", situation: "Meeting. A colleague's numbers look wrong to you.", blunt: "You're wrong.", size: 2, polite: "I'm not so sure about that. I see it a bit differently." },
      { id: "x3-lwp-refund-night", situation: "Hotel. The heating didn't work on your first night.", blunt: "Refund my first night.", size: 3, polite: "Would it be possible to get a refund for the first night?" },
      { id: "x3-lwp-home", situation: "You want to work from home on Fridays.", blunt: "Let me work from home.", size: 3, polite: "I was wondering if working from home on Fridays might be an option." },
      { id: "x3-lwp-seat", situation: "Theatre. Someone is sitting in your seat.", blunt: "Move, that's my seat.", size: 2, polite: "Excuse me, I think this might be my seat." },
      { id: "x3-lwp-hurry", situation: "Restaurant. You've waited 40 minutes.", blunt: "Hurry up.", size: 2, polite: "Sorry, do you know how long the food will be?" }
    ]
  }
];

WU.content.lostwordScreen = {
  shared: {
    id: 'lostword-screen',
    tag: 'LOST WORD', mDescribe: 'DESCRIBE IT', mSimplify: 'SAY IT SIMPLE', mPolite: 'TOO DIRECT',
    who: '{name}, ask for it!', whoSimple: '{name}, say it simply!', whoPolite: '{name}, say it nicely!',
    banned: "Don't say:", banN: 2, hardTag: 'HARD MODE', banStamp: 'BANNED WORD!',
    frames: "It's something you use to ___. / It's someone who ___. / It's a place where ___. / It's the thing next to ___.", framesShow: true,
    rule: 'Words only. No gestures!', ruleShow: true,
    listenAsk: 'Hi! How can I help?', more: 'Not quite! Add a detail.', close: 'Yes, that\'s it! Thanks!',
    huh: 'Sorry... a what?', tooHard: 'TOO DIFFICULT!', ok: 'Ah, I see! Sure.',
    rude: 'Excuse me?!', ok2: 'Of course! No problem.',
    size1: 'SMALL REQUEST', size2: 'MEDIUM REQUEST', size3: 'BIG REQUEST',
    p1: 'Could I get ___, please? / I\'m looking for ___.', p2: 'Could you ___? / Would it be possible to ___?',
    p3: 'I was wondering if ___. / Would you mind ___ing?',
    lModel: 'MODEL', lMore: 'MORE', seconds: 0
  },
  levels: [
    {},
    { banN: 1, frames: "It's a thing for ___. / You use it to ___. / It's ___ and ___.", rule: 'Gestures are OK!',
      p1: 'Can I have ___, please?', p2: 'Can you ___, please?', p3: 'Can you ___, please?' },
    { banN: 1, rule: 'Gestures are OK, but say it too!', p1: 'Could I get ___, please? / I\'m looking for ___.' },
    {},
    { frames: "It's something you use to ___. / It's someone who ___. / It's a place where ___. / It's the kind of ___ that ___." },
    { frames: "It's something you use to ___. / It's someone who ___. / It's a place where ___. / It's the kind of ___ that ___." },
    { frames: "It's something you use to ___. / It's someone who ___. / It's a place where ___. / It's the kind of ___ that ___." }
  ]
};
