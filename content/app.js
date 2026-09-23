/* Warm Up: texts shown by the shared pieces (timer, student picker, scoreboard) in every game.
   One set for the whole app (not per level). Editable in Edit mode: "App texts".
   The id is PERMANENT: teacher edits point at it. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.appTexts = [{
  id: 'app-texts',
  timerStart: 'TAP TO START', timerSeconds: 'SECONDS', timerLeft: 'LEFT', timerPaused: 'PAUSED', timerDone: 'TIME!',
  pickerTitle: "WHO'S NEXT?", pickerLanded: "YOU'RE UP!", pickerTap: 'Tap to pick',
  scoresLabel: 'SCORES'
}];
