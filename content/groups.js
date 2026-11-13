/* Warm Up: Java's groups and timetable. Written from the Lesson Plan Builder data (lesson-plan-data/lessons.json)
   by the weekly Saturday job; safe to edit by hand.
   level : app level (0 = Beginner, 1 = Elementary, 2 = Pre-Intermediate, 3 = Intermediate ...)
   days  : 'odd' = Mon / Wed / Fri, 'even' = Tue / Thu / Sat
   start / end : lesson time (24 h). from : first lesson date. noClass : dates with no lesson (YYYY-MM-DD).
   The app uses this to know which group is in the room now (from 15 minutes before start until the end):
   it sets the level and turns occasion themes on for that group's first lesson of the occasion week. */
window.WU = window.WU || {};
WU.GROUPS = [
  { id: 'e-odd2', name: 'Elementary 10:30', level: 1, days: 'odd', start: '10:30', end: '11:50', from: '2026-10-14', noClass: [] },
  { id: 'b-even', name: 'Beginner 14:00', level: 0, days: 'even', start: '14:00', end: '15:20', from: '2026-10-06', noClass: [] },
  { id: 'b-odd', name: 'Beginner 15:30', level: 0, days: 'odd', start: '15:30', end: '16:50', from: '2026-10-07', noClass: [] },
  { id: 'e-even', name: 'Elementary 15:30', level: 1, days: 'even', start: '15:30', end: '16:50', from: '2026-10-06', noClass: [] },
  { id: 'e-odd', name: 'Elementary 17:00', level: 1, days: 'odd', start: '17:00', end: '18:20', from: '2026-10-07', noClass: [] },
  { id: 'p-even', name: 'Pre-Intermediate 17:00', level: 2, days: 'even', start: '17:00', end: '18:20', from: '2026-10-06', noClass: [] },
  { id: 'b30-odd', name: 'Beginner 30+ 18:30', level: 0, days: 'odd', start: '18:30', end: '19:50', from: '2026-10-07', noClass: [] },
  { id: 'i-even', name: 'Intermediate 18:30', level: 3, days: 'even', start: '18:30', end: '19:50', from: '2026-10-06', noClass: [] }
];
