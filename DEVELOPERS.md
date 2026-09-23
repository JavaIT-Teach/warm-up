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
