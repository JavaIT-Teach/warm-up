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
`kit.deck` (no repeats until the list is used up), `kit.student` (a random student, avoiding some names), `kit.normWord` (word + a / an from the picture library).
Every field listed in a screen record needs a default at every level; the automated check fails otherwise.

## Teacher screen (`js/teacher.js`)
Opened with V on the board: `index.html?teacher` in a second window. The board runs the game; the teacher window only draws
what the board sends and sends key presses back (postMessage between the two windows, BroadcastChannel as a backup).
Each game adds `teacher()` to its view and returns `{ secret: [...], info: [...] }`, items `{ label, text, html, big, hot }`.
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
"New this week" for `WU.NEW_DAYS` days), `unit: 'Unit 9 · Feeling Good'` (shown on the NEW badge) and `preview: [words]`
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
