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
