/* Warm Up: screen text for NAME WALL, per level. Editable in Edit mode ("Screen text & timing"). Empty text hides a line.
   {name} is filled in. The names and facts typed in class are NOT content: they stay on this device only.
   facts = facts per student (1 or 2). factMode: pic (a library picture), both (a keyword and / or a picture), text (a keyword).
   fact1Label / fact2Label = what the teacher is asked for (the form under the spotlight).
   id is PERMANENT: teacher edits (Edit mode) point at it. */
window.WU = window.WU || {}; WU.content = WU.content || {};
WU.content.namesScreen = {
  shared: {
    id: 'names-screen',
    tag: 'NAME WALL', meetTag: 'ROUND 1: MEET', rememberTag: 'ROUND 2: REMEMBER',
    point: 'Point to a student!', qMark: '?',
    meetFrame: "Hi! I'm ___. I'm from ___. I can ___.", reply: 'Everyone: "Hi, {name}!"',
    meetRule: 'Say your name and your two facts.', meetRuleShow: true,
    facts: 2, factMode: 'both', fact1Label: "I'm from", fact2Label: 'I can',
    who: '{name}: who is this?', recallFrame: "That's ___! He / She is from ___ and can ___.",
    recallRule: 'Look at the card. Say the name and both facts.', recallRuleShow: true,
    wrong: 'Not quite! Class, help!', done: 'Great memory! Every name is back on the wall.', empty: 'The wall is empty.',
    demo: 'TEACHER DEMO: I go first!', demoShow: false, demoWho: 'TEACHER'
  },
  levels: [
    { meetFrame: "Hi! I'm ___. I like ___.", meetRule: 'One word is OK! Pointing is OK!', facts: 1, factMode: 'pic', fact1Label: 'I like',
      recallFrame: "That's ___! He / She likes ___.", recallRule: 'One word is OK! Pointing is OK!', demoShow: true },
    {}, {}, {},
    { meetFrame: 'My name is ___. It was chosen by ___. It means ___.', meetRule: 'Tell the story of your name: who chose it and what it means.',
      facts: 1, factMode: 'text', fact1Label: 'Name story (keyword)',
      recallFrame: "That's ___. ___ told us that ___.", recallRule: 'Use reported speech: "___ told us that..."' },
    { meetFrame: 'My name is ___. It was chosen by ___. It means ___.', meetRule: 'Tell the story of your name: who chose it and what it means.',
      facts: 1, factMode: 'text', fact1Label: 'Name story (keyword)',
      recallFrame: "That's ___. ___ told us that ___.", recallRule: 'Use reported speech: "___ told us that..."' },
    { meetFrame: 'My name is ___. It was chosen by ___. It means ___.', meetRule: 'Tell the story of your name: who chose it, what it means, and how you feel about it.',
      facts: 1, factMode: 'text', fact1Label: 'Name story (keyword)',
      recallFrame: "That's ___. ___ told us that ___.", recallRule: 'Use reported speech: "___ told us that..."' }
  ]
};
