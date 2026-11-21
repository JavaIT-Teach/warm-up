# Warm Up

Speaking games for the first 5–10 minutes of an English lesson. One screen at the front of the room, no student devices, no internet needed.

**Open it:** https://javait-teach.github.io/warm-up/
**Offline:** click Code → Download ZIP, unzip, and double-click `index.html`.
**Students on their phones:** send the same link. A phone opens the phone version by itself (see below).

## On a student's phone
**Get students there:** press **Q** on the home screen (or the QR button in the top bar). A big QR code fills the board; students scan it with the phone camera and land on the phone version. The title and line under it are in Edit mode → App texts.
- Students open the same link. Phones get a portrait version with big buttons and **every game from the board**, in the same order.
  Most are solo. Group games are **pass-the-phone** with friends: Elias, Hot Seat (phone on your forehead), Lie Detector.
  The moving games become solo versions: Four Zones (pick, give a reason, then argue for another zone), Opinion Line (where you stand + the other side),
  Stand Up If... (true? say more; not true? ask a question), Find Someone Who (type the question, then report), Speed Chat (answer fast, shorter rounds),
  Name Wall (your introduction and a classmate's). The Bomb: type words before it explodes. Tug of War: argue both sides.
  Sentence frames turn into gap boxes to fill.
- The first time, the student picks their **level** (they can change it on the home screen). Games for other levels are grey.
- Nobody is there to judge, so every game checks the answer (typed forms, multiple choice, the whole sentence) or reveals it, and keeps a score.
- Same content as the board: your edits and the weekly games appear on phones too. Nothing to install or update.
  **New version bar:** when the site changes (new games, weekly words, your edits), an open phone shows "New version! Refresh" within about 5 minutes
  (also as soon as the student comes back to the tab). It never reloads by itself, so nobody loses a game; × hides it until the next change.
- Direct link: `phone.html`. On a phone, `index.html?board` opens the board version.

## Before class
1. Pick the **level** at the top of the home screen (← → keys).
2. Choose **First lesson** (strangers) or **Regular lesson** (L key). First lesson marks the best icebreakers.
3. Optional: in **Settings** (S), set how many students are in the room, add a class list, or turn on teams.
4. Press **F** for fullscreen.

## In class
- The home screen asks **what to train today**: **1 Vocabulary · 2 Grammar · 3 Speaking · 4 Reading · 5 Writing · 6 New this week** (or click; **G** opens Grammar).
- Inside a skill: press **1–9** (or click a tile) to open a game. More than nine: press **↓**, then **0** = game 10, **Shift + 1–9** = games 11–19. **Esc** goes back to the skills; **Esc** in a game goes back to its skill.
- New games arrive every Saturday, built from what your groups learned. They have a **NEW** badge (with the unit they review), go first in their skill, and are also in **New this week** for 14 days.
- **Occasions:** one week a month the app dresses up for an occasion (New Year, Navruz, Halloween...): new colours, floating decorations, and themed content in the games. It turns on by itself for each group's **first lesson** of that week and off for its later lessons, so a group sees it once. The strip under the levels shows today's date, the group in the room and the occasion (its week, ON / OFF and why); press **T** (or click the strip) to switch it for today. **Shift + T** previews every occasion, one by one (or open `index.html?theme=newyear`). Calendar: `content/themes.js`.
- **Content rotation:** every game gives the group in the room items it has **not seen yet**, across lessons (also Story Dice faces, Flash Room things, Word Hunt sets and words, Word Chain pictures and topics, and Time Machine subjects, verbs and time phrases; the tense and + / - / ? stay random). The app logs what each group was shown in each game (on this device). When a group has seen everything in a list, a new round starts; the last few items of the old round wait so they don't come straight back. The group is the one on the timetable now, or the class chosen in Settings; with neither (testing at home) nothing is logged. **Settings → Content history** shows each group's log (this round, seen ever, times shown, last shown) and clears one group or all. **Shared through GitHub:** a device with the token (Settings) saves the log about 20 seconds after a game shows something, and right away when you leave the tab. Every device loads it on start, when you come back to the tab and every 10 minutes, so two laptops in two rooms share one history per group. It is saved on its own branch (`warm-up-data`, file `data/shown.json`), never on main, so it does not republish the site or show "New version!" on phones. Two devices merge without losing anything; Clear on one device clears it on the others. No internet: the log is kept on the device and saved later. The log is in the backup file too. Phones keep their own log per phone (not shared).
  Shared groups need the **timetable** (`content/groups.js`): a class from Settings exists only on the device where it was made, so its history matches across devices only after Export / Import of the backup file.
- **Your group is detected from the clock** (`content/groups.js`, from the Lesson Plan Builder): from 15 minutes before a lesson, the app sets that group's level by itself.
- Every card has a small **TRAINS** note: what the game practises (for example "Articles: a / an / the / no article").
- The grammar games are in the **Grammar** menu (press **G**).
- Some games are made for some levels only. At other levels their card is **grey** with a label ("From Pre-Intermediate") and does not open. Change the level and it opens.
- Every game works with the keyboard alone. Press **?** in any game to see its keys.
- Nothing needs to be set up. With no class list, the picker uses "Student 1, 2, 3...".

## How to play each game
At Beginner every game starts with a **teacher demo** (you go first) and shows a sentence frame. One word, pointing or a gesture counts.

**1. The Bomb.** A category appears. Students pass an object around the room; whoever holds it says one word (a sentence at higher levels) and passes it on. **Space** lights the fuse; nobody knows when it explodes. Whoever holds it spins the challenge wheel and answers a short speaking challenge from their seat.
*Senses and reactions:* sense categories from Elementary ("Things that taste bitter", "Smells that bring back memories"). Three wheel challenges: **SENSES** (describe the thing next to you with 3 senses), **RIGHT NOW** (say what you're doing, step by step) and **REACT!** ("Your bus just left!" → "Oh no! I should have run!").
**Choose the category:** press **C** (or tap "C categories"). Arrows + **Enter**: that category comes next (at once if the round hasn't started). **Space** ticks categories for a set; **P** plays the ticked ones in the order you ticked them, again and again. **R** goes back to random. Your own categories (added in Edit mode) are in the list too. The choice lasts until you change it or reload the app.
To choose without the class seeing the list, use the Teacher screen (**V**): the same list is there, and only you see "Next category".
Keys: Space start / spin / next · N new category · C choose categories · P who starts · X explode now · T challenge timer · R reset.

**2. Slot Machine of Chaos.** **Space** spins: WHO (a student), TOPIC, HOW (a speaking style) and, from Intermediate, a TWIST. The student talks until the timer ends (it starts by itself). Then the screen names two classmates who each ask the speaker one question.
*New twists:* "Start in 1 second" (from Elementary), "Don't stop for a word: describe it and keep going" (from Pre-Intermediate) and "Add ... though" (from Intermediate).
Keys: Space spin · Enter pause · Q questions now · H styles on / off · W twist on / off.

**3. Hot Seat.** One student sits with their back to the board. **P** picks a student (P again = someone else, for a shy student). **Space** starts the round. The class describes each word; the student guesses. **Space** = got it (a point), **P** = pass. The high score stays for the next student to beat.
From Elementary, **helper frames** sit under the word (*It's something you use to... / It's someone who... / It's a place where...*; at IELTS *It's when... / It's the feeling you get when...*).
From Pre-Intermediate the class must not say the **banned words** (Pre-Intermediate 1, Intermediate 2, IELTS 3). **B = HARD MODE**: every banned word of the card shows (3 below IELTS, 5 at IELTS). It stays on for that level until you press B again.
Keys: P pick / pass · Space start / got it / next student · B hard mode · Enter pause · R reset high score · 1-4 give the points to a team.

**4. Lie Detector.** **P** picks a student and shows a question. The student secretly shows you TRUTH or LIE (for example thumb up or down under the desk). Press **T** or **L**: nothing on screen changes. The student answers. **Space**: at middle levels a classmate asks one follow-up question; at IELTS two students explain why they think it's a lie. Then the class votes: stand up = lie, stay seated = truth (optional: count the standing students with **Up / Down**). **R** runs the lie detector and shows the truth.
*Natural expressions:* in the vote step a strip suggests a first reaction ("React first: Really? · No way! · You're serious?"), from Elementary.
Keys: P pick · T / L secret · Space next step · Up / Down votes · R reveal · N other question.

**5. Tug of War.** Two sides: two teams, or the left and right side of the room. Played in rounds. Each round both sides get a topic: one word each (pizza vs burgers), or FOR and AGAINST a statement at IELTS. Each side has one turn per round: after a 3-2-1-GO countdown its timer (45 seconds by default) starts by itself as soon as the topics appear or the turn passes to it (**Enter** pauses, or skips the countdown), and the side makes one argument. Good argument: press **←** or **→** to pull the rope. No good argument: **Space**. When both sides have argued, the next round starts with a new topic and the rope stays where it is. The side that starts alternates every round. A game is 10 rounds. **Intermediate and up: defend format.** The side gives its idea, the teacher argues against it, the side defends it. Pull (**←** / **→**) only if the defence holds; a good first idea alone earns nothing (**Space**). 2:30 per side at Intermediate, 3:00 at IELTS 1 and 2, 4:00 at IELTS 3, and 4 rounds a game. A side wins by pulling the flag over its line, or by having the flag on its half when the last round ends (flag in the middle: a draw). **N** next round now (rope stays) · **R** new game (rope to the middle, round 1). Edit mode: number of rounds, seconds per side, countdown length (0 = off) and its last word, round tag, round-over banner, draw text.
*Natural expressions:* from Pre-Intermediate, the second side of each round sees "Answer first: I'm not so sure about that. · I don't really see it that way." They answer the other side before giving their own argument.
Keys: ← / → pull · Space no pull · N new topic · R reset.

**6. Story Dice.** **Space** rolls the picture dice. Pairs make a story using every picture (timer). Then the class builds one story together: **N** picks the next student, who adds one sentence. At Beginner each student says one sentence about the highlighted picture. In Edit mode you choose which pictures can appear on the dice.
Keys: Space roll · Enter pause · C class story now · N next student.

**7. Word Chain.** **Space** starts. The screen picks a student, who says a word that starts with the last letter of the previous word before the time bar runs out. **Space** = correct (the screen picks the next student). **X** = out: that student becomes a judge and helps decide if words count. Last one standing wins. At Beginner the screen shows a picture that starts with the right letter; **P** = one pass. At IELTS words need 6+ letters, or press **T** at the start to choose a topic.
Optional: type the word on the keyboard (Backspace to fix, Enter to accept) so the class sees it and the screen checks the first letter, length and repeats. While typing, use the pencil button for Edit mode (letters go into the word); Shift + X types an X.
Keys: Space correct · X out · P pass · T topic · R start again.

**8. Name Wall** (icebreaker). **Round 1: Meet.** The screen picks a student from the class list (no class list: point to a student and type the name). The student says the frame ("Hi! I'm ___. I like ___."); the class answers "Hi, ___!". Type or fix the name, add the fact (a picture at Beginner; a keyword and / or picture in the middle levels, two facts; a keyword for the name story at IELTS), press **Enter**: the card slides onto the wall. For "I can" the picture chooser shows activities first (run, swim, dance, cook, ride a bike...); type to search. In Edit mode you choose, per level and per fact, "All pictures" or "Activities first". **Space** = next student.
**Round 2: Remember** (**R**, needs 2+ cards). Names are hidden, facts stay visible. The screen picks a student and a card (never their own). The student says the frame ("That's ___! He / She likes ___." / reported speech at IELTS). **Space** flips the card. **X** = wrong: the class helps, then Space flips. It ends when every card is flipped.
Keys: Enter add / next field · Space next student / flip · R remember round · X wrong · N another card · A back to adding people · Delete clear wall.
**Privacy:** the names and facts you type stay on this device only. They are never saved to GitHub and are not in the backup file. **Delete** (when you are not typing in a box) → Enter clears the wall. The Teacher screen lists every name and fact.

**Lost Word** (Speaking · Elementary and up; grey for Beginner). What to do when the word is gone. Three modes, **T** switches:
- **Describe it.** A situation ("Hotel. There's no towel in your bathroom.") and the word, crossed out. The picked student asks for it without saying it, using a frame (*It's something you use to... / someone who... / a place where...*). **Space**: the face on screen guesses **wrong** ("A blanket?"); the student adds a detail. **Space**: it gets it ("Oh, a towel!"); the student closes: "Yes, that's it! Thanks!". **Space**: the model answer. **X** = a banned word was said (buzzer). **B** = hard mode: the related words are banned too.
- **Say it simple.** A hard sentence with the hard part marked ("I'd like a **refund**."). The face doesn't understand; the student says it in plain words. **Space**: the model ("Can I get my money back?").
- **Too direct.** A blunt request ("Give me a coffee.") with its size: SMALL, MEDIUM or BIG request. The face is offended; the student softens it with the frames for that size (*Could I get... / Would it be possible to... / I was wondering if...*). **Space**: the model.
On phones: pick the forgotten word, the simple meaning, or the best request.
Keys: Space next step · N other card · P other student · T mode · B hard mode · X banned word · 1-4 team point.

**Natural Replies** (Speaking · all levels). Someone "says" a line ("Thanks so much for helping me!", "I didn't get the job.", "Did you call your mum?"). The picked student must START replying before a short bar runs out (Beginner 5 seconds, IELTS 3 one second), using a reply from the wall. The wall shows the kind of reply that fits: thanks, "you're welcome", sympathy, good news, agree, disagree, short answers (*I did.*), not yes / not no (*Kind of. / Pretty much.*), surprise (*You're serious?*). **Space** = started in time: the streak grows. Bar runs out or **X** = too slow: the streak resets. Then press the **number** of the reply they used (or tap it): it greys out for the rest of the round, so the class has to use different replies. Short answers never grey out, because they must match the question. After 10 lines (8 at Beginner and Elementary) a new round starts and every reply is back.
**The expressions are shared.** Natural Replies > Expressions in Edit mode is one bank. Opinion Line, Tug of War, Four Zones, Speed Chat, Find Someone Who and Lie Detector take their expression strips from it. Edit an expression once and it changes in every game. Each of those games has the strip in its *Screen text & timing* (on / off, label, which kinds, how many).
On phones: pick the best reply before the bar runs out.
Keys: Space show the line / started in time / next student · 1-9 reply used · X froze · P other student · N other line · R new round.

### Moving games (9–13): students stand up and walk
The map on screen is your room seen from above: the board at the top, desks in a U, the open middle in between. "Front" = near the board.

**9. Stand Up If...** (all levels). A sentence: "Stand up if you have a sister." **Space**: a 3-second countdown, then STAND UP! Everyone it is true for stands at their seat. Optional: **↑ / ↓** counts them ("7 stood up!"). **Space**: the standing students say more (a frame for each sentence), the sitting students ask one of them a question. **Space**: sit down, next sentence. At IELTS the sentences are opinions: stand = agree.
Keys: Space next step · Up / Down count · N other sentence.

**10. Four Zones** (all levels). A question with four answers. Each answer is a zone in the middle of the room: red front left, blue front right, green back left, yellow back right (the map shows it; nothing to stick on the walls). **Space**: students walk to their zone (timer, then talking starts by itself). They tell their zone why (timer + frame). **Space**: one person per zone reports, zone by zone. **Space**: back to the seats, next question.
*Natural expressions:* while the zones talk, a strip shows agree / disagree expressions ("React: You can say that again. · I don't really see it that way."), from Elementary.
Keys: Space next step · Enter pause · N other question. Edit mode: the zone names, "Pictures on the map", walk and talk times.

**11. Opinion Line** (Pre-Intermediate and up; grey for Beginner and Elementary). A statement. One line through the middle of the room: AGREE near the board, NOT SURE in the middle, DISAGREE at the back. Steps, each with **Space**: stand on the line (timer) → explain to the person next to you (timer + frame) → the two ends convince the middle (timer) → changed your mind? move (timer) → who moved says why → back to the seats.
*Natural expressions:* steps 2 and 3 show agree / disagree expressions, so students say more than "I agree". From Intermediate the "who moved" step adds a contrast frame: "Good point. ___ though."
Keys: Space next step · Enter pause · N other statement.

**12. Find Someone Who** (all levels). A task ("Find someone who can swim."), the question to ask and both answers. **Space**: everyone stands up and walks (timer). Rule: find **1 YES and 1 NO**, then sit down — so "everybody said no" still finishes half the task. Higher levels: ask one follow-up question after a YES. When the time is up, the screen picks students to report with a frame ("Ali can swim. Sara can't swim."). **P** = another student.
*Natural expressions:* from Pre-Intermediate, natural answers next to the textbook ones ("Answer like this: I do. · Kind of. · Not really."). From Intermediate, a way to finish ("Finish with: Thanks a lot! · Happy to help.").
Keys: Space walk / stop / report / next · Enter pause · N other task · P other student.

**13. Speed Chat** (all levels; made for Beginners). Everyone stands. One question on the board with its answer frame ("Do you like football?" / "Yes, I do. / No, I don't."). **Space**: the timer starts. Students find a partner, ask, answer, find a NEW partner, and count their partners on their fingers. At the buzzer a new question appears and the next round starts by itself after 3 seconds. Each round is shorter (Beginner: 60, 50, 40, 30 seconds), so the pace goes up. After the last round: FREEZE. **Space**: "Hands up: 3 people or more!" Press **↑** for 4, 5, 6...: the last hand up wins and reports first. **Space**: the screen picks students to report ("I talked to Sara. Sara likes football."); the report frames of every question played are on screen.
*Natural expressions:* every round suggests a different greeting for each new partner ("Start with: How's it going? · What have you been up to?"). From Pre-Intermediate, natural answers too ("I did. · Kind of. · Pretty much.").
Demo (20 seconds, no explanation): ask one student the question, they answer, hold up one finger, walk to the next student, say "Go!".
Keys: Space go / end round now / hands up / next · Enter pause · N other question · ↑ / ↓ hands-up number · P other student · R start again. Edit mode: the questions (question, picture, answer frame, report frame), number of rounds, first round length, how much shorter each round is, the shortest round.

### Word Partners (Vocabulary + Speaking · all levels)
*Collocations: phrases, not single words.* Knowing "decision" is not enough; students need "make a decision", "a tough decision".
A core word sits in the middle (DECISION) with 6 hidden partner tiles. The core word shows on every tile and each partner word is a gap
of its length ("___ a decision", "a ___ decision"), so students see the shape of the phrase. Beginner and Elementary work with verbs and picturable partners (PLAY: football, the guitar...; CATCH: a bus, a fish...): every tile has a picture of its partner, plus first letters.
**One timer for the whole word** (Beginner/Elementary 2:00, middle levels 1:30, IELTS 1:15–1:00): find as many partners as you can. Time up: the rest flip and the class sees what it missed. **Enter** pauses.
**Space** shows the first word. Students say a whole phrase (one word does not count).
- On the board: press its number (**1–8**, or tap the tile): it flips, a point.
- Good but not on the board ("a hard decision"): **B**, a bonus point.
- Wrong ("do a decision"): **X**.
- Teams on: the turn passes to the next team after every answer. Teams off: the whole class shouts phrases.
**Space**: the rest of the tiles flip (missed ones in blue) and the **trap** appears: a common wrong partner, crossed out ("NOT do a decision").
**Space**: **USE IT!** A picked student answers a question with 1–3 phrases from the board (timer). **Space**: next word.
Answers: Teacher screen (**V**) lists every tile with its number, or **A** for a 2-second peek. **H** first letters · **U** undo the last tile · **N** other word · **P** other student.
On a phone: the student types partners (one word or the whole phrase), takes the trap question (which one is right?), then writes a USE IT answer and the phone shows which board phrases it used.
**Pictures:** Beginner and Elementary only, on the board and the phone (Screen text & timing: "Pictures on the tiles", per level).
**Every Saturday** the weekly job adds 3–4 new core words per level from the units every group at that level has already been taught. They show their unit on the board ("Unit 9 · Clothes") and play first for 14 days (this week's words first, then last week's); then they join the mix.
Edit mode: core word, up to 8 partner phrases, each with an optional picture (put [brackets] round the words you want hidden, otherwise every word except the core word and a / an / the is a gap), the USE IT question and the trap, per level. Screen text & timing: time for the whole word, strikes (off by default), first letters on / off, USE IT task and time.

### Elias (Vocabulary + Speaking · Pre-Intermediate and up; grey for Beginner and Elementary)
*Paraphrasing: explain a word without saying it.* The team version of Hot Seat: one student explains, their own team guesses.
Teams take turns (the teams from Settings; teams off = TEAM A and TEAM B).
**Set-up (laptop only, the default):** the word is never on the board. The explainer stands at your laptop and reads it on the Teacher screen (**V**); their team stays in their seats and faces them. The board shows the timer, the count and the scores. You press Space / X on the laptop. If the Teacher screen is not open, the first **Space** opens it; press Space again to start.
No laptop near you? Edit mode → Screen text & timing → "Where the word shows: Board". Then the explainer faces the board and their team faces the explainer.
**P** picks who explains (again = someone else). **Space** starts the turn (60 seconds; 75 at Pre-Intermediate, 50 at IELTS 3).
- Guessed: **Space** (+1). Skipped: **X** (−1 from Intermediate up; no penalty at Pre-Intermediate).
- Time up: **LAST WORD**. Any team can shout it. **1–4** = the team that guessed it (another team steals a point), **0** = nobody.
- The list of the turn's words appears. Tap a word to change ✓ / ✗ (for example the explainer said the word). **Space** adds the points; the next team's turn.
First team to the goal wins (15; 20 at IELTS 2 and 3). **R** new match. The score stays per level until you press R.
Pre-Intermediate and Intermediate show a sentence frame for the explainer ("It's a place / a thing / a person... You use it to ___."). IELTS levels show three banned words per word.
Teacher screen (**V**): the word, its banned words, the turn's list and the match score.
Edit mode: the words and banned words per level; Screen text & timing: where the word shows (laptop only / board), points to win, turn length, skip penalty on / off, last word on / off, team names, frame, rules, demo turn (on at Pre-Intermediate).
Keys: P who explains · Space start / got it / add the points · X skip · Enter pause · 1–4 / 0 last word · R new match.
**Weekly words:** every Saturday the weekly job adds about 15 words per level (Pre-Intermediate and Intermediate, the levels with groups) from the units the groups have already been taught. For 14 days they play first (this week's words first, then last week's) and show their unit on the board and the phone ("Unit 12 · Getting Around"); then they join the mix. In Edit mode each word has a Unit label field (empty = a normal word).
**On a phone (pass the phone):** the one group game in the phone version. 2–4 teams, one phone. The explainer holds the phone (their team must not see it), taps Got it / Skip, then the last word, the check list and the points, and passes the phone to the next team. Same words, rules and timing as the board. Good for pairs or small groups in class, or with friends at home.

### Grammar games (G1–G10): one grammar point per game
Each one drills a single grammar point at the right level. Same rhythm in all of them: a prompt, a student (or the whole class) answers, **Space** reveals the model answer. **P** picks another student. With teams, **1–4** gives points.

**G1. Article Showdown** (all levels) · *a / an / the / no article.* A sentence with a gap ("I want ___ ice cream."). **Space**: 3, 2, 1... SHOW! Every student shows fingers at once: 1 = a, 2 = an, 3 = the, fist = no article. **Space** reveals the answer and the rule ("WHY? ice starts with a vowel sound") and picks a student to say the whole sentence. Beginner uses a / an only. Higher levels: zero article, the + superlatives, the rich, the Netherlands, the Silk Road...
Keys: Space countdown / reveal / next · N other sentence · P other student.

**G2. Flash Room** (Beginner to Intermediate) · *there is / there are (there was / there were from Pre-Intermediate).* **Space**: a room full of things (1 to 5 of each) shows for a few seconds, then hides. The picked student says one thing ("There were three apples."); **Space** shows the next thing with its sentence. Then quick questions about things that were there, or were not ("Was there a dog?" "No, there wasn't.").
Keys: Space show the room / show one thing / question / answer · A show everything · P other student.

**G3. Near & Far** (Beginner to Pre-Intermediate) · *this / that / these / those.* A picture road: things appear near the hand (this / these) or far away (that / those), one or more. The student says the sentence; **Space** reveals it. Pre-Intermediate: two things at once ("These are cats and that is a dog."), with a time bar.
Pre-Intermediate adds *over there* to the far thing: "This is a carrot and those are bottles over there."
Keys: Space reveal / next · N other things · P other student.

**G4. Hide & Seek Cat** (Beginner to Intermediate) · *prepositions of place, then movement.* The cat (or a dog, a ball...) hides: in the box, on / under / next to the table, behind / in front of the box, between two boxes, above the table. From Pre-Intermediate it moves (animated): into / out of / over the box; Intermediate adds around the tree, past / towards / away from the house, across the road, through the tunnel, up / down the hill ("The cat went through the tunnel.").
Keys: Space reveal / next · R move again · N other place · P other student. Edit mode: which places each level uses and their words.

**G5. Verb Volcano** (Elementary and up) · *irregular verbs.* A verb sits on the volcano and the lava rises. The student says the forms (go - went - gone; Elementary: past only) before it reaches the top. **Space** = right: SAFE! **X** or time up: it ERUPTS. Then a follow-up ("Have you ever ___?"). With teams on, the team on turn gets the point automatically.
Keys: Space start / right / next · X wrong · N other verb · P other student.

**G6. Time Machine** (all levels) · *tenses, one family at a time.* **Space** spins WHO (she), DO WHAT (play football), WHEN (since this morning) and TYPE (+ / − / ?). WHEN gives away the tense. The student builds the sentence; **Space** reveals it with the tense name ("She has been playing football since this morning." · PRESENT PERFECT CONTINUOUS).
**T** chooses the family: all tenses, simple only, continuous only, perfect only, perfect continuous only, present only, past only, future only. Only the tenses of the current level are used (Beginner: present simple and continuous; IELTS: all 12).
**H = pattern + example**: shows the tense pattern ("have / has been + verb-ing") and an example in the same tense and type (+ / − / ?) with a different subject and verb ("Have we been playing the guitar for two hours?"), so it models the answer without giving it away. Beginner and Elementary see it automatically. The reveal shows the pattern next to the tense name and the example under the answer.
**Z = Silly mode**: about half the subjects and verbs become silly ("Three tiny aliens had been riding a camel for two hours before the rain started."). The grammar stays correct.
So the sentences make sense, each verb is a *task* (you finish it: write an email) or an *activity* (no end: listen to music). Deadlines ("by 2030", "by the time the film started") only go with tasks; lengths of time ("for two hours", "all day") only with activities. Questions with "I" only come in the present simple.
Edit mode: tenses per level, subjects, verbs (with their kind), time phrases (with what they go with), the silly lists and how often they come.
Keys: Space reveal / spin · H pattern + example · T tense family · Z silly mode · P other student.

**G7. Domino Effect** (Pre-Intermediate and up) · *conditionals.* A starter: "If it rains tomorrow, ..." The student finishes it; the next student turns that result into a new If-clause ("If I stay at home, I'll watch TV."), and so on. Each good sentence stands up one more domino; a wrong form knocks the whole line down. The pattern and an example chain stay on the card ("If I won the lottery, I would buy a house. If I bought a house, ..."); **H** shows a model ending for the current starter ("If I were invisible for a day, I would walk into a cinema for free."). Pre-Intermediate 1st conditional, Intermediate 2nd, IELTS 1 3rd, IELTS 2 mixed, IELTS 3 inversion ("Had I known..., Were I to..."). The record stays per level.
Keys: Space good sentence / new chain · X chain broken · H example ending · N other starter · P other student.

**G8. Pin It!** (Beginner to Intermediate) · *prepositions of time and place: at / on / in.* Same rhythm as Article Showdown: a sentence with a gap ("I get up ___ 7 o'clock.", "She's ___ the bus."), 3, 2, 1... fingers up (1 = at, 2 = on, 3 = in), then the answer and the rule ("WHY? at + a clock time"). **T** chooses time only, place only, or both. Intermediate adds for / since / during / by / until (1 to 5 fingers).
Keys: Space countdown / reveal / next · T time / place / both · N other sentence · P other student.

**G9. Sticky Words** (Intermediate and up) · *dependent prepositions and fixed phrases.* A team race. A word with a gap appears ("interested ___", "rely ___", "___ purpose", "on the verge ___"). The first team to shout gets to answer: press its number (**1**, **2**...; or tap its score box). That team says the preposition **and** a sentence. Nothing is revealed yet, so you judge first: the answer is on your Teacher screen (**V**), or press **A** for a small 2-second peek in the bottom-right corner.
**Space** = right: the point, and the answer appears. **X** = wrong: the other team gets a try (with 3–4 teams, the next team to shout; a team that was wrong can't answer again). Nobody right: the word comes back a few cards later ("BACK AGAIN!"). First to 10 wins. With teams off it is LEFT SIDE (1) against RIGHT SIDE (2).
Keys: 1–4 this team answers · Space right / next word · X wrong / nobody · A peek · Shift + 1–4 take a point back · R new match.

**G10. Phrasal Roulette** (Pre-Intermediate and up) · *phrasal verbs.* Two reels spin: VERB + PARTICLE (give + up). The student says what it means; **Space** shows the meaning and an example; **Space** again gives another student a personal question to answer with it ("What would you like to give up?"). **T** turns it round: the meaning shows and the student finds the phrasal verb.
**T** has three modes: verb → meaning, meaning → verb, and **WHERE DOES "IT" GO?** Two answers show: "1 take it down" / "2 take down it". Fingers up, **Space** reveals the right one. Separable verbs must split around *it* (take it down); inseparable ones never do (get over it). Verbs without an object are skipped.
**L = family:** the verb stays fixed (*come*, *make*, *get*...) and only the particle changes. **L** again moves to the next family, then back to every verb. Verbs with *come* and *make* added for Pre-Intermediate to IELTS 1 (come over, come along, come down with, come through, come across as, make up for, make out = hear or see...), plus speak up, take down, shut down, pull over, talk down to.
Keys: Space reveal / question / spin · T mode · L family · P other student.

### Weekly games (built from what your groups learned)
**Word Hunt** (Reading · Beginner to Intermediate). A letter grid hides 8 words from your last units. Beginner sees the words with pictures; higher levels read a clue ("You need it to travel to another country.") and the number of letters. **Space** shows the grid and starts the timer. A student who finds a word says it and where it is ("B4, across!") or shows it on the board. **↑ / ↓** choose the clue, **Enter** (or tap the clue) marks it found and it lights up. **H** flashes the first letter, **A** shows every word, **N** next puzzle, **R** same words in a new grid.

**Vanishing Sentence** (Writing · Beginner to Intermediate). A sentence from your last lessons. The class reads it together. **Space**: one or two words vanish; the class reads it again, missing words too. Again and again until nothing is left, then WRITE IT!: everyone writes the whole sentence on paper. **Space**: the words come back and students check their spelling; a picked student reads theirs. **B** brings one word back, **N** other sentence, **P** other student.
*Stress:* in the first reading the stressed words are big and underlined ("She did WELL in her EXAMS."), so the class reads with rhythm. Automatic: content words and negatives (*don't*, *can't*). A sentence can list its own stressed words in Edit mode.

**Story Shuffle** (Reading · Beginner to Intermediate). A short text from your last units (a dialogue, a story, a blog), cut into 5–6 lines and shuffled: A, B, C... Pairs read the lines and write the right order on paper (for example C A D B E) before the time bar runs out. **Space**: the lines glide into place one by one ("Line 1 is... C"), so everyone checks their order. When all are in place, the order in letters shows, and a picked student answers a question about the text (the answer is on the Teacher screen). **A** shows the whole order at once, **N** other text, **P** other student.
Edit mode: title, unit, up to 6 lines in the RIGHT order (the game shuffles them), the question and its answer.
On phones: tap the lines in order, then Check.

**Lost Vowels** (Writing + Vocabulary · Beginner to Intermediate). Six words from your last units (eight from Intermediate) without their vowels: "W_dn_sd_y", "y__th h_st_l". Beginner and Elementary see a picture, every level a short clue. **Space**: the words appear and the time bar runs; everyone writes the whole words on paper (1, 2, 3...). **Space** (or time up): the vowels drop back in, one word per Space; students check their spelling, 1 point per perfect word. **H** clues on / off, **A** every word at once, **N** new words.
Edit mode: the words, clues, pictures; Screen text & timing: words per round, writing time, clues and pictures on / off.
On phones: one word at a time, type it, Check.

**Teams:** turn them on in Settings. Keys **1–4** add a point, **Shift + 1–4** remove one, **S** shows or hides the board. The small board shows colours and scores; **+** on the board shows the team names.

## Teacher screen (your laptop)
With the laptop connected to the board, Warm Up can show a second window on your laptop with what only you should see:
the word and banned words (Hot Seat), whether you pressed T or L (Lie Detector),
the seconds left before the bomb explodes, the word of the Beginner picture (Word Chain), every name and fact on the wall (Name Wall), who reports (Find Someone Who), the round and question (Speed Chat), the answer in every grammar game (G1–G10),
plus the timer, the scores and big buttons for the game's keys. The board never shows any of this.

Setup (once per lesson):
1. Connect the laptop to the board. On Windows press **Windows + P** and choose **Extend**.
2. Open Warm Up and move its window to the board. Click it once, then press **F** for fullscreen.
3. On the board window, press **V** (or click the laptop button at the top right). A second window opens.
4. Move that window to your laptop screen (drag it, or press **Windows + Shift + Left/Right arrow**) and maximise it.
5. Play. Keys work in both windows, and the buttons on your laptop work too. No internet needed.

If something goes wrong:
- Nothing opens: the browser blocked the pop-up. Click the blocked pop-up icon in the address bar, choose "Always allow", press **V** again.
- The laptop window says "Waiting for the board": the board window was closed or reloaded. Press **V** on the board again.
- No sound: click the board window once (browsers only play sound after a click or key press in that window).
- Fullscreen (**F**) and opening the teacher screen (**V**) only work when pressed on the board window itself.

## Change the content
- Press **E** (or the pencil) for **Edit mode**. Everything you can change gets a pink outline.
- Click it, or use **Tab** + **Enter**. Rename, add (**N**), delete (**Del**), or pick a picture from the library or upload your own.
- Everything students read can be changed: categories, example cards (word, a / an, picture, order), sentence frames
  (per level or per category), rules (or hide them), challenges, the words around the bomb and the wheel, fuse and timer lengths
  (**Screen text & timing**), and the timer / picker words (**App texts**).
- Every game has its own lists (questions, topics, words, pictures) and a **Screen text & timing** record per level
  (rules, frames, timers, rounds, grid size, pull strength, number of dice...). On the home screen the edit bar has one button per game.
- Edits are per level. **Undo my changes** (in the editor) brings back the original of one item.

## Your edits on every device (GitHub sync)
- Edits and uploaded pictures save to this GitHub repo automatically (folder `data/`), a few seconds after each change.
- Every device loads the latest edits when the app opens. No setup needed to view and play.
- To **save** edits from a device, paste your GitHub token once in **Settings → Save edits to GitHub** on that device.
  The steps are written there. Without the token a device is view only.
- In Edit mode the top bar shows **Saved / Saving... / Offline: will save later**. Offline edits wait on the device and save when the internet is back.
- If two devices change the same thing at the same time, both changes are kept where possible; if they changed the very same field, the last one saved wins and the other value is kept in a conflict log (in the backup file).
- The repo is public, so your edits and uploaded pictures are public too. Do not upload photos of students.
- Class lists (Settings) and Name Wall names stay on the device. They are never saved to GitHub. Class lists are in the backup file (keep it private); Name Wall names are not.

## Backup and reset
- **Settings → Backup file → Export / Import**: a spare copy only. Import replaces the edits on that device, then on GitHub.
- **Settings → Reset all data on this device** (type RESET): clears this device only, including its token. Your edits on GitHub stay and load again.
- Sound needs one click or key press first (browser rule). **M** mutes.
- Settings → Motion → **Calm** turns off shaking and flashing.
