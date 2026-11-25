# Building games for Warm Up

## The rule
Every piece of text or picture that delivers content to students must be editable in Edit mode.
Only app controls (buttons, key hints, header, menus) are exempt.

## How a game follows it
1. Put all content in `content/<game>.js`: one entry per level, and a **permanent `id` on every built-in item**
   (never change or reuse an id; edits point at it).
2. Register each list with `WU.registerList(game, list, def)` and read it only through `WU.list(game, list, level)`.
   Screen texts and timings go in a single-record list (`single: true`), like The Bomb's "Screen text & timing".
   Texts shared by every game live in App texts (`content/app.js`).
3. Mark every element you draw:
   - `data-edit="game:list:id[:field]"` (use `WU.editAttr(...)`) for content,
   - `data-ctrl` for controls (header, hints, buttons),
   - `data-auto` for values generated from editable content or settings (timer count, student names, scores).
4. Check it: press **E** on every screen of the game at every level. Anything unmarked is outlined red and counted
   in the edit bar ("N not editable"). `WU.auditEditable()` returns the offending elements. Ship only at 0.

Edits, resets and Export / Import work for every registered list automatically.

## Shared kit (`js/gamekit.js`)
Use `WU.kit` so every game looks and behaves the same:
`kit.screen({...})` registers the per-level "Screen text & timing" record, `kit.header`, `kit.hints`,
`kit.frame` (sentence frames with drawn gaps), `kit.chip`, `kit.fill` (`{name}`, `{n}`...), `kit.fit` (shrink text to its box),
`kit.deck` (no repeats until the list is used up; items from `WU.list` rotate per group across lessons and are logged in `WU.shown`, so always pick content through a deck, not `WU.pick`; several different items at once: `kit.drawN(deck, list, n)`; `js/sync.js` syncs the log to `data/shown.json` on the branch `warm-up-data`, merged with `WU.shown.merge`), `kit.student` (a random student, avoiding some names), `kit.normWord` (word + a / an from the picture library).
Every field listed in a screen record needs a default at every level; the automated check fails otherwise.

## Teacher screen (`js/teacher.js`)
Opened with V on the board: `index.html?teacher` in a second window. The board runs the game; the teacher window only draws
what the board sends and sends key presses back (postMessage between the two windows, BroadcastChannel as a backup).
Each game adds `teacher()` to its view and returns `{ secret: [...], info: [...] }`, items `{ label, text, html, big, huge, hot }` (`huge`: as big as the panel allows, for a word a student reads from the laptop).
Put in `secret` everything the teacher needs but the board must hide. Timer, scores and key buttons are added automatically
from the board's timer, scoreboard and key hints.

## Level-limited games and the room map
A game entry in `content/games.js` can have `levels: [from, to]` (0 = Beginner ... 6 = IELTS 3). Outside that range the home
card is grey with a label (`WU.gameLevelText`), Enter / click / Shift + number do nothing, and `WU.route` sends a direct link home.
Its content still needs an entry for all seven levels (an empty list is fine for the levels it is not made for).
`kit.roomMap(board, boardAttr, inner, cls)` draws the classroom from above (board at the top, desks in a U, the open middle)
for the moving games; `inner` is what stands in the middle (Four Zones: four coloured zones; Opinion Line: the agree line).

## Skill menus, NEW badge and weekly games
The home screen is a skill picker (`WU.SKILLS` in `content/games.js`: vocab, grammar, speaking, reading, writing) plus "New this week".
Every game entry needs `skills: [...]` (one or more skill ids). Optional: `added: 'YYYY-MM-DD'` (NEW badge, listed first and in
"New this week" for `WU.NEW_DAYS` days), `unit: 'Unit 9 · Feeling Good'` (shown on the NEW badge; or a list with one unit per level) and `preview: [words]`
(card preview for games without a drawn one in `js/views/home.js`).
Weekly games built from the lesson plans follow every rule in this file: content in `content/<id>.js`, view in `js/games/<id>.js`,
both added to `index.html`, entry in `content/games.js`, all content editable, a default at every level.

## Occasion themes and groups
`content/themes.js` lists the occasions (date, which week, colours, decorations, theme words); `js/themes.js` decides which one
is live and whether it is ON (a group's first lesson in the occasion week; T toggles it for today). `content/groups.js` is the
timetable from the Lesson Plan Builder (refreshed by the weekly job). Themed content lives in `content/occasions/<id>.js`:
it pushes items with `theme: '<id>'` into the games' lists (normal permanent ids). `WU.list` hides themed items when their theme
is off; with 3 or more for the active theme in a list, only those play. Hard-coded `#f4f1ea` backgrounds must use `var(--paper)`
(or `WU.C.paper`) so screens take the theme colour.

## Grammar games and the TRAINS note
Every entry in `content/games.js` has `trains`: a short note on its home card saying what the game practises. Add one to every new game.
`grammar: true` puts a game in the GRAMMAR GAMES section (numbered G1, G2... in list order; key G then the number, G then 0 = G10) instead of the numbered games.
Grammar games share `js/grammarkit.js` (`WU.gram`): `shell` (screen, header, hints, scoreboard), `who` (picked student line),
`answer` (the model answer strip), `gaps` (___ gaps, filled on reveal) and `bar` (a thin time bar). Model answers built from editable
content are `data-auto`.

## Phone version (`phone.html`, `js/phone/`, `css/phone.css`)
One student on a phone. `index.html` sends small touch screens to `phone.html` (`?board` stays on the board). `phone.html` loads the
same scripts as `index.html` (so lists, edits and sync are the same), keeps the board stage hidden, and draws its own portrait screens.
Every board game has a phone screen (menu order = `content/games.js`, via `WU.phone.order()`); each is `WU.phone.games[id] = { mount(body, ctx), unmount() }` and must
check or reveal the answer, because no teacher judges. Read content only through `WU.list` and the game's screen record
(`ctx.S`). Where a board game's logic is needed, the board file exposes it on `WU.engines.<id>` (Time Machine, Hide & Seek Cat).
A new board game script goes in **both** `index.html` and `phone.html`, and every new game needs a phone screen too (content must be identical on both).
Games that need a group become pass-the-phone games (Elias, Hot Seat: the players judge); room games become solo versions
(Four Zones: pick, give a reason, argue for another zone). The former board-only games are in `js/phone/games-more.js`; its `frameInputs()` turns a
sentence frame into gap boxes the student fills.
Phone screens for the weekly games (Story Shuffle, Lost Vowels...) are in `js/phone/games-weekly.js`.
Sentence Train's phone screen is `js/phone/games-sentence.js`; it uses the board game's parser and jobs through `WU.engines.sentence`.
The party games' phone screens (Truth or Dare, Just a Minute) are in `js/phone/games-party.js`. The two board games share one layout, `.ptg` in `css/app.css` (`.side` puts the timer column on the right).
The phone home list has search (name, phone text, hook, trains, skills, unit), a sort (Suggested = new first, A to Z, Newest by `added`)
and skill chips (`WU.SKILLS`). Sort and skill are saved on the phone; games for other levels always go last.


## Shared expression bank (`js/expr.js`)
Natural expressions by function (hello, reply, agree, disagree, thanks, welcome, sympathy, happy, short, vague, surprise) live in
`content/replies.js` (`bank[level]`), registered once as the list `replies:bank`. A game shows a strip of them with
`WU.expr.strip(S, scr.ea, key, prefix)`. Add the fields with `.concat(WU.expr.fields(prefix, title))` on the screen record, with
defaults for `<prefix>Show`, `<prefix>Label`, `<prefix>Cats` (comma list of kinds) and `<prefix>N` at every level. `key` keeps the same pick
while the same item is on screen. Each expression in the strip is editable (it points at `replies:bank:<id>:text`).
`js/expr.js` loads after the content files and before the views and games.
