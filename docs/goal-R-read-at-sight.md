# Goal R, “Read at sight”: the whole process, level by level

_Generated from the app's code on 26 Nov 2026 (Fretwise, build after commit 4b6d3e5). Every level name, description, setting, sample question and level note below is read from the code, not written from memory._

**The goal:** Read at sight. **End point (as the app states it):** Read a line from a chart at sight and play it on the guitar in time: the right notes, the right rhythm, the right road through the page.

**The six elements the goal is made of** (each step is tagged with one, shown in its ⓘ box):

- `pitch` **Pitch on the staff**: Reading which note is written, including ledger lines, accidentals and key signatures.
- `neck` **Where it is on the neck**: Turning a written note into a string and a fret, in the position you are in.
- `rhy` **Rhythm on the page**: Recognising written figures by their look and knowing where they fall in the bar.
- `time` **Time**: Keeping the beat going whatever happens. Reading that stops is not reading.
- `know` **Notation knowledge**: Values, meters, counting and signs: the rules the page is written in.
- `map` **The road map**: Repeats, endings, the sign and the coda: finding your way through a chart.

## How the app runs a goal (the rules that apply to every step)

- **A goal is five stages.** Each stage lists *steps*; a step is a range of levels of one game. A stage counts as passed when every level of every step in it is passed. The stages are an order of work, not a lock: every level can be opened from its game regardless of the goal (a level of a game opens when the level before it in **that game** is passed).
- **Shared levels.** The same levels can sit in several goals (Fretboard 1–6 is in four goals); passing them once moves every goal that contains them.
- **“Also helps, not required”** (the appendix): levels that support the goal but are not needed to finish it. They do not count towards the stage.
- **Two kinds of level:**
  - **Round levels** (most games): questions one at a time, in rounds of a chosen length (6, 12, 24 or Endless). A level is *passed* when its last **16** answers are at least **85 %** clean. In the recall games answered on screen (Fretboard, Reading, Intervals & Keys, Rhythm Theory…) a speed gate is added: the median time of the last **6** clean timed answers must be at or under the question's target time. On the guitar there is no speed gate. Within a round about 25 % of questions are review from earlier levels and about 15 % a preview of the next; weak items come back more often.
  - **Continuous levels** (Pulse & Feel, Reading Rhythm, Jazz Rhythm, Two Hands, Aksak): no questions; the click never stops and the music runs bar after bar (Pulse & Feel scrolls; Reading Rhythm and Jazz Rhythm show a still page of three lines, two bars a line, turned as you play). You tap (Space / the button) or strum muted strings into the microphone. A level opens after **24 clean bars in a row** (a bar is clean when every written note was hit within the window, nothing extra was hit, and, on the keyboard, every note of a dotted quarter or longer was held for its length), with the run's timing spread at or under the game's standard; it also counts as passed when the level's recent blocks meet the master standard. The timing window is a quarter of a beat (at least 90 ms). Each block of 8 hits is stored as one answer. Two minutes without a hit end the session.
- **Master standard** (the green outline): a stricter bar than the unlock, per game (listed under each game below), measured over at least 12 recent answers.
- **One input per game:** a game played on the guitar asks everything on the guitar (notes and strums heard through the microphone); a game played on screen records nothing. Some games have levels only for one input; the level page then offers a switch.
- **The guitar is heard by Spotify Basic Pitch** in the browser. Notes at or below B♭2 may be heard an octave up (the laptop microphone does not carry the fundamental) and are accepted there. The string a note is played on is never checked, only its pitch and time.
- **Sight Reading's grading** (stage 2 onwards): every note must be the written pitch in the written octave and start within a quarter of a beat of its place; a note half a beat or more off fails the take outright. Repeated equal pitches count as one note (the detector cannot hear the same pitch struck twice). Long lines (four bars and more) allow one unheard note in sixteen and a few late notes; a wrong note always fails. After the answer the page shows each note green (right), amber (right pitch, off the beat), red (wrong) or ringed (not heard), and each bar shaded.

## The five stages at a glance

### Stage 1: Notes and values

_Two things are read at once: which note and how long. First: the notes on the neck and on the staff, the note values and how they are counted, key signatures, and a steady beat to put them on._

- **Fretboard 1–6** (1 Low strings, first position; 2 Low strings, full neck; 3 Octave shapes; 4 Upper strings; 5 Upper strings, full neck; 6 Whole neck)
- **Reading 1–6** (1 Strings 1–3 on the staff and the neck; 2 The whole staff; 3 Ledger lines, above and below; 4 Strings 4–6, ledger lines below; 5 All of first position; 6 Accidentals and key signatures)
- **Reading Rhythm 1–5** (1 Whole, half, quarter; 2 Ties and dots; 3 Eighth notes; 4 Dotted quarter and eighth; 5 Eighth rests, off-beats)
- **Rhythm Theory 1–3** (1 Note values and rests; 2 Meter; 3 Count it I)
- **Intervals & Keys 1–2** (1 Major scales; 2 Key signatures)
- **Pulse & Feel 1–2** (1 On the click; 2 Eighths)

### Stage 2: First position, in time

_Reading is done in time or it is not reading. Notes found on the click, then the first lines played on the guitar: two notes, even lines, rhythm, rests and ties, G and F, the first syncopation; triplets and syncopation tapped from the page before they are read with pitches._

- **Fretboard 7–9** (7 Find it; 8 Sharps and flats; 9 Notes in time)
- **Sight Reading 1–6** (1 Two notes; 2 A line of even notes; 3 Quarters, halves, eighths; 4 Rests and ties; 5 Lines in G and F; 6 Dotted quarters and off-beats)
- **Reading Rhythm 6–12** (6 3/4; 7 2/4; 8 Triplets; 9 Quarter-note triplets; 10 Half-note triplets; 11 Syncopation I; 12 Syncopation II)
- **Rhythm Theory 4–4** (4 Count it II)
- **Rhythm Dictation 1–4** (1 Whole, half, quarter; 2 Eighth notes; 3 Eighth rests and off-beats; 4 Ties and dots)
- **Pulse & Feel 3–4** (3 Triplets; 4 Sixteenths)

### Stage 3: Positions

_Above the open position the same written note has several places: the scale fingering of a position decides. The notes of positions II to V, then lines played there: more keys, accidentals and natural signs, triplets, 3/4, swing; and the next figures tapped first: sixteenths, 6/8, cut time._

- **Scale Runner 1–2** (1 The whole position, in C; 2 The whole position: C, F and G)
- **Reading 7–10** (7 Second position; 8 Third position; 9 Fourth position; 10 Fifth position)
- **Sight Reading 7–14** (7 Positions II to IV; 8 D and B♭; one accidental; 9 Naturals; an accidental holds for the bar; 10 Eighth-note triplets; 11 3/4; 12 A and E♭; 13 Fifth position; 14 Swing eighths and pushes)
- **Reading Rhythm 13–20** (13 Sixteenths; 14 Dotted eighth–sixteenth; 15 Sixteenth rests; 16 Everything so far, in 4/4; 17 6/8, with sixteenths; 18 12/8; 19 Cut time; 20 Everything so far)
- **Pulse & Feel 5–6** (5 Switching subdivisions; 6 2 and 4)

### Stage 4: The high neck and jazz rhythm

_Seventh and ninth position with their ledger lines, two notes at once; ties into the beat, sixteenths and 6/8 read with pitches; four sharps and flats; the jazz figures a chart is made of (Charleston, pushes), and the harder rhythms tapped: broken triplets, odd and changing meters._

- **Reading 11–13** (11 Seventh position; 12 Ninth position, high ledger lines; 13 Two notes at once)
- **Sight Reading 15–20** (15 Ties into the beat; 16 Seventh position; G and D; 17 Sixteenths; 18 6/8; 19 A♭ and E; 20 Ninth position)
- **Jazz Rhythm 1–3** (1 Charleston; 2 Displaced Charleston; 3 Pushes)
- **Reading Rhythm 21–25** (21 Broken triplets; 22 Sixteenth-note triplets; 23 5/4 and 3/8; 24 Changing meters; 25 Everything)

### Stage 5: The page

_From a line to a page: shifts of position, cut time and broken triplets with pitches, four and eight bars without stopping, tunes written out, sixteen and thirty-two bars on the changes of standards, and the road map (repeats, endings, the sign and the coda) played in time._

- **Reading Rhythm 26–26** (26 Road map, played)
- **Jazz Rhythm 4–6** (4 Dotted-quarter chains; 5 Quarter-note triplets; 6 Phrase placement)
- **Sight Reading 21–29** (21 A shift inside the line; 22 Cut time; 23 Quarter-note and broken triplets; 24 Four bars; 25 Eight bars; 26 Tunes you may know; 27 Sixteen bars; 28 The road map; 29 A 32-bar page)

### Also helps, not required (the appendix)

- **Sing the Page 1–9**: singing a written line: hearing the page before you play it. Levels: 1 1 2 3; 2 1 to 4; 3 1 to 5; 4 1 to 6; 5 The whole scale; 6 Skips in the tonic triad; 7 Thirds and the fourth; 8 Minor key; 9 With written rhythm (pitches checked)
- **Rhythm Theory 5–8**: swing vocabulary, the road-map signs on paper, accents and articulation marks. Levels: 5 Swing vocabulary; 6 Repeats and endings; 7 The road map; 8 Accents, dynamics, articulation
- **Rhythm Dictation 5–16**: rhythm dictation beyond the first values: syncopation, triplets, sixteenths, 6/8, swing, two bars. Levels: 5 3/4; 6 Syncopation I; 7 Syncopation II: ties into the beat; 8 Eighth-note triplets; 9 Quarter-note triplets; 10 Sixteenths; 11 Dotted eighth and sixteenth; 12 Sixteenth rests; 13 6/8; 14 Swing; 15 Two bars; 16 Two bars: everything
- **Reading Rhythm 27–29**: written accents over a running subdivision. Levels: 27 Accented eighth notes; 28 Accented triplets; 29 Accented sixteenths
- **Pulse & Feel 7–12**: the click on 2 and 4 and swing, for swung lines. Levels: 7 4 only; the and of 4; 8 Be the hi-hat: 2 and 4; 9 Be the hi-hat: 4 only; 10 Be the hi-hat: the and of 4; 11 Drop-outs; 12 Swing and off-beats
- **Jazz Rhythm 7–11**: hemiola, bebop cells, the jazz waltz, your own transcribed rhythms. Levels: 7 Hemiola; 8 Bebop cells; 9 Jazz waltz; 10 All the figures; 11 Your standards
- **Scale Runner 3–15**: the position fingerings in more keys and patterns. Levels: 3 Eighth notes; 4 Triplets; 5 One octave from the root, in C; 6 One octave from any root; 7 Up to the 7th and back; 8 First modes: 2 to 2, 5 to 5; 9 Groups of three and four; 10 Thirds, in C; 11 Thirds: C, F and G; 12 Fourths; 13 Triads, every position; 14 Seventh chords, every position; 15 Twelve keys in one position
- **Two Hands 1–5**: reading two lines at once. Levels: 1 Together; 2 Together, reading; 3 Alternating; 4 Stickings; 5 Two lines
- **Aksak 1–14**: reading uneven meters. Levels: 1 5/8: the two beats; 2 5/8: every eighth; 3 5/8: reading; 4 7/8: the three beats; 5 7/8: every eighth; 6 7/8: reading; 7 8/8 as 3 + 3 + 2; 8 9/8 aksak: the four beats; 9 9/8: reading, and the other nine; 10 10/8: 3 + 2 + 2 + 3; 11 10/8: reading; 12 11/8; 13 13/8; 14 Any of them
- **Fretboard 10–15**: every place of a note: choosing where to play what you read. Levels: 10 Every spot of a note: the naturals; 11 Sharps & flats; 12 Any note, no count; 13 Fret by fret; 14 Two at once; 15 In time
- **Intervals & Keys 3–9**: intervals and minor keys: reading by distance; intervals below a note, and the minor scales whose raised notes are the accidentals of a minor-key page. Levels: 3 Major intervals; 4 Minor keys; 5 All intervals; 6 Harmonic & melodic minor; 7 Inversions & enharmonics; 8 Below a note, and beyond the octave; 9 The minor scales, every key

## Every required level in full, game by game

### Fretboard (`fretboard`)

- **What the game is:** Name notes on the neck, find them on any string, connect the octave shapes, and then find every place a note lives on the whole neck (the former Note Hunt), and inside one position.
- **Area:** Note locations · **course** 101 · **badge** warm, core · **input:** screen or guitar (a choice per game) · speed gate on screen
- **Master standard:** accuracy 95 %, answer time at or under 0.6 of the target (name any note on the neck instantly)
- **Lesson card, how to practise:** Learn strings 6 and 5 first: every barre chord, shell voicing and walking line takes its root from them. / Say the note name out loud before you answer. The mouth teaches the hand. / Check yourself with an octave shape instead of counting up from the nut. / Accuracy first; the speed comes by itself after a week of short daily rounds.
- **Lesson card, rules:** Open strings, low to high: <b>E A D G B E</b>. / Fret 12 is the open string an octave up; the dots at 3, 5, 7, 9 and 12 are your landmarks. / Natural notes are two frets apart, except <b>B–C</b> and <b>E–F</b>, which are one fret apart. / Fret 5 is the next string up open, except on string 3, where it is fret 4. / Octave shape: two strings up and two frets up; three frets up when you cross onto the B string. / A sharp is one fret up, a flat one fret down: one fret, two names (C♯ = D♭).
- **Lesson card, take-away:** Note names are the vocabulary of everything else: chord roots, targets for lines, the anchor for every shape. When you stop counting frets, you start seeing music on the neck.
- **Level-page note:** On the neck a fret has two names (C♯ is D♭); in a key it has only one. This game accepts either name; the theory games require the one the key calls for.

**Stage 1: Fretboard 1–6**

#### Fretboard 1: Low strings, first position

- **Description:** Strings 6 and 5, frets 0–5
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the note at string 5 , fret 1 .” → answer: A♯/B♭. (answered by **picking a note**)
    - hint: Fret 0 on string 5 is A. Count 1 fret up from there.
    - explanation after answering: Open string 5 is A. 1 fret up gives A♯/B♭. Half steps fall between B–C and E–F; every other natural pair is a whole step.
- **Why it is in the goal (ⓘ text of its step):** ['neck', 'Reading on the guitar is two steps: name the written note, then find it on the neck. The second step must cost nothing. These levels give you every natural note on every string, so the eyes can stay on the page.']
- **Level note (the Details button):**
  - *Key takeaways:* The two low strings are the address book of the guitar: every chord root and every position is named from a note on string 6 or 5. / Every fret from 0 to 5 is asked, sharps and flats too: count from the open string and the landmark at fret 5. The only places with no fret between two naturals are E–F and B–C.
  - *What to pay attention to:* Say the name before you answer. Counting up from the open string is how you start, not how you finish. / Frets 3 and 5: G and A on string 6, C and D on string 5. Use them as landmarks.
  - *Skill it builds:* Instant note names on the root strings, which is what lets you put any chord or scale where a chart asks for it.
  - *Theory and tips:* String 6 open to fret 5: E F · G · A. String 5: A · B C · D. Fret 5 of string 6 is the same pitch as open string 5. / The unlock needs speed as well as accuracy: a typical answer within about three seconds, and under two for the master standard. Slow and correct is still counting.
- **Source of the level (exact settings):**

```js
{n:'Low strings, first position',d:'Strings 6 and 5, frets 0–5',g:[fbId([6,5],0,5)]}
```

#### Fretboard 2: Low strings, full neck

- **Description:** Strings 6 and 5, frets 0–12
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the note at string 5 , fret 11 .” → answer: G♯/A♭. (answered by **picking a note**)
    - hint: Fret 12 on string 5 is A. Count 1 fret down from there.
    - explanation after answering: Open string 5 is A. 11 frets up gives G♯/A♭. Half steps fall between B–C and E–F; every other natural pair is a whole step.
- **Level note (the Details button):**
  - *What this level adds:* The same two strings to fret 12. Fret 12 is the open string an octave higher, so frets 7–12 repeat a pattern you can anchor.
  - *What to pay attention to:* Frets 7 and 8, 10 and 12. These are the notes people skip. / Fret 7 on string 6 is B, on string 5 is E. Fret 12 repeats the open string.
  - *Theory and tips:* Dots on the neck are at 3, 5, 7, 9 and 12. On string 6 they are G, A, B, C♯/D♭ and E. / Learn from both ends: up from the nut and down from fret 12.
- **Source of the level (exact settings):**

```js
{n:'Low strings, full neck',d:'Strings 6 and 5, frets 0–12',g:[fbId([6,5],0,12)]}
```

#### Fretboard 3: Octave shapes

- **Description:** Two strings up, two frets up (three across the B string): the map of the neck
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The marked note is C♯/D♭ . Click the same note one octave higher or lower on a different string.” → answer: S1 F9, S5 F4, S6 F9. (answered by **clicking a spot on the neck**)
    - hint: Look at string 5 (2 strings lower), 2 frets back.
    - explanation after answering: Octave shapes: From strings 6 and 5 the octave two strings higher is 2 frets up; from strings 4 and 3 the octave two strings higher is 3 frets up; downward the reverse (2 frets back or 3 frets back, as the pair of strings decides). Here: string 1 (2 strings higher), 3 frets up; string 5 (2 strings lower), 2 frets back; string 6 (3 strings lower), 3 frets up.
- **Level note (the Details button):**
  - *Key takeaways:* An octave is always the same shape: two strings higher and two frets higher, or three frets higher if the shape crosses from the G string to the B string. / With octaves, two strings you know give you all six.
  - *What to pay attention to:* The B string. Any shape that crosses between strings 3 and 2 shifts one fret up. / Know the name at both ends of the shape, not just the shape.
  - *Skill it builds:* The map of the neck: every note’s position found from the low strings. It is the fastest way to stop being lost above fret 5.
  - *Theory and tips:* From string 6 to string 4, and from 5 to 3: two frets up. From 4 to 2, and from 3 to 1: three frets up. / String 1 has the same note names as string 6, two octaves higher. / The guitar is tuned in fourths except G to B, a major third. That one interval is behind every “plus one fret” rule.
- **Source of the level (exact settings):**

```js
{n:'Octave shapes',d:'Two strings up, two frets up (three across the B string): the map of the neck',g:[fbOct()]}
```

#### Fretboard 4: Upper strings

- **Description:** Strings 4 to 1, frets 0–7
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the note at string 2 , fret 2 .” → answer: C♯/D♭. (answered by **picking a note**)
    - hint: Fret 0 on string 2 is B. Count 2 frets up from there.
    - explanation after answering: Open string 2 is B. 2 frets up gives C♯/D♭. Half steps fall between B–C and E–F; every other natural pair is a whole step.
- **Level note (the Details button):**
  - *What this level adds:* Strings 4 to 1 in the lower frets, named directly.
  - *What to pay attention to:* String 2: C at fret 1, D at fret 3. String 3: A at fret 2. String 4: E at fret 2, F at fret 3. / Stop routing through octaves once a note is familiar. The aim is direct recall.
  - *Theory and tips:* First position on the top four strings is where most beginning reading happens. These names are worth more than any others on the neck.
- **Source of the level (exact settings):**

```js
{n:'Upper strings',d:'Strings 4 to 1, frets 0–7',g:[fbId([4,3,2,1],0,7)]}
```

#### Fretboard 5: Upper strings, full neck

- **Description:** Strings 4 to 1, frets 0–12
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the note at string 1 , fret 0 .” → answer: E. (answered by **picking a note**)
    - hint: It is the open string: string 1 is tuned to E.
    - explanation after answering: Open string 1 is E. 0 frets up gives E. Half steps fall between B–C and E–F; every other natural pair is a whole step.
- **Level note (the Details button):**
  - *What this level adds:* The upper strings to fret 12.
  - *What to pay attention to:* The middle of the neck, frets 5–9, on strings 3 and 4. This is the weakest area for nearly everyone. / Same note on the next higher string is five frets lower, four from G to B.
  - *Theory and tips:* Fret 5 of each string equals the next open string, except string 3, where it is fret 4. That gives you a second way to check any note.
- **Source of the level (exact settings):**

```js
{n:'Upper strings, full neck',d:'Strings 4 to 1, frets 0–12',g:[fbId([4,3,2,1],0,12)]}
```

#### Fretboard 6: Whole neck

- **Description:** All strings, frets 0–12
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the note at string 6 , fret 9 .” → answer: C♯/D♭. (answered by **picking a note**)
    - hint: Fret 7 on string 6 is B. Count 2 frets up from there.
    - explanation after answering: Open string 6 is E. 9 frets up gives C♯/D♭. Half steps fall between B–C and E–F; every other natural pair is a whole step.
- **Level note (the Details button):**
  - *What this level adds:* All six strings, frets 0–12, mixed.
  - *What to pay attention to:* Speed. Anything you still work out belongs in a round on its own string.
  - *Theory and tips:* Target: under two seconds for any note. Past that point the neck stops being something you think about while playing.
- **Source of the level (exact settings):**

```js
{n:'Whole neck',d:'All strings, frets 0–12',g:[fbId([1,2,3,4,5,6],0,12)]}
```

**Stage 2: Fretboard 7–9**

#### Fretboard 7: Find it

- **Description:** Click a natural note on a given string
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Click A on string 3 (frets 0–12).” → answer: fret 2. (answered by **clicking a spot on the neck**)
    - hint: String 3 is tuned to G. Fret 5 is C, fret 7 is D.
    - explanation after answering: A on string 3 sits at fret 2. Frets 0 and 12 are the same note an octave apart.
- **Why it is in the goal (ⓘ text of its step):** ['neck', 'Finding a named note on a given string, sharps and flats, and then four notes in time on the click. That last level is the reflex of reading without the staff: a note is called and the hand answers on the beat.']
- **Level note (the Details button):**
  - *Key takeaways:* The question is reversed: a note name and a string are given and you find the fret. Recall and recognition are different skills.
  - *What to pay attention to:* One note on one string has one answer between frets 0 and 11. Go straight to it. / Do not start from fret 0 and walk up.
  - *Skill it builds:* Finding a note you want, which is what playing needs. Naming a fret you are looking at is only the first half.
  - *Theory and tips:* Use the nearest landmark: fret 5 and fret 7 on every string, fret 12 as the open string.
- **Source of the level (exact settings):**

```js
{n:'Find it',d:'Click a natural note on a given string',g:[fbLoc(true)]}
```

#### Fretboard 8: Sharps and flats

- **Description:** Find a sharp or flat on a given string
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Click A♯/B♭ on string 2 (frets 0–12).” → answer: fret 11. (answered by **clicking a spot on the neck**)
    - hint: String 2 is tuned to B. Fret 5 is E, fret 7 is F♯/G♭.
    - explanation after answering: A♯/B♭ on string 2 sits at fret 11. Frets 0 and 12 are the same note an octave apart.
- **Level note (the Details button):**
  - *What this level adds:* Sharps and flats only: a note between two naturals, to find on a given string. Every such fret has two names.
  - *What to pay attention to:* A sharp is one fret above the natural; a flat is one fret below. Find the natural first. / E♯ and B♯, C♭ and F♭ exist on paper: they are the frets of F, C, B and E.
  - *Theory and tips:* Which name is right depends on the key: one letter per scale degree. The fret is the same; the spelling tells you the harmony.
- **Source of the level (exact settings):**

```js
{n:'Sharps and flats',d:'Find a sharp or flat on a given string',g:[fbLoc('acc')]}
```

#### Fretboard 9: Notes in time

- **Description:** Four notes on one string, one per click (microphone)
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “String 6 only, frets 0–11: play C – F – G – E , one note per click (60 bpm) after the count-in.” → answer: C F G E. (answered by **playing it on the guitar**; click at 60 bpm; 4 notes to play)
    - hint: Find all four during the count-in (nothing you touch there is counted), then play them on the clicks.
    - explanation after answering: On string 6: C at fret 8, F at fret 1, G at fret 3, E at fret 0. Notes you can find in time are notes you can use while playing.
- **Level note (the Details button):**
  - *Key takeaways:* Four notes on one string, one per click, after a count-in. Knowing the note is not enough: you have to find it inside one beat.
  - *What to pay attention to:* Read all four names during the count-in and see them on the string before you play. / Move during the beat, arrive on the click. / The exact octave is checked. The microphone hears pitch, not the string: staying on the one string is your own discipline.
  - *Skill it builds:* Note finding at playing speed. This is the bridge from knowing the neck to using it.
  - *Theory and tips:* One string forces you to move the hand along the neck. That is the direction most players never practise. / If it is too fast, say the four fret numbers aloud during the count-in. Then drop that and see the notes.
- **Source of the level (exact settings):**

```js
{n:'Notes in time',d:'Four notes on one string, one per click (microphone)',g:[fbTimeQ()]}
```

### Reading (`sight`)

- **What the game is:** Name notes on the treble staff, then find them in position on the neck: first position string by string, ledger lines and key signatures, then positions II–IV, fifth, seventh and ninth, and two notes at once. Reading whole lines in time is the game Sight Reading.
- **Area:** Staff and positions · **course** 101 · **badge** life, core · **input:** screen or guitar (a choice per game) · speed gate on screen
- **Master standard:** accuracy 95 %, answer time at or under 0.75 of the target (read a note and find it in position without hesitating)
- **Lesson card, how to practise:** Name the note on the staff first (letter and octave), then play it. Never guess by shape. / Learn the staff landmarks (middle C, G on the 2nd line, the top F) and read from them. / Stay in the position the level gives you and let the fingers find the note; do not chase it up the neck. / Know the next note before you finish this one. Whole lines read and played in time are the game Sight Reading.
- **Lesson card, rules:** Treble lines <b>E G B D F</b>, spaces <b>F A C E</b>; ledger lines continue the alternation. / Guitar is written an octave higher than it sounds; written middle C (first ledger line below) is string 5, fret 3. / Open strings on the staff: low E below the third ledger line, A on the second ledger line, D just below the staff, G on the 2nd line, B on the middle line, high E in the top space. / Order of sharps <b>F C G D A E B</b>, flats <b>B E A D G C F</b>. A key signature lasts the whole piece; an accidental lasts to the end of the bar. / In a position each finger covers one fret; the index finger names the position.
- **Lesson card, take-away:** Reading in position is how jazz guitarists play from a chart: the staff becomes fingering without thinking, so your attention can go to time and phrasing.

**Stage 1: Reading 1–6**

#### Reading 1: Strings 1–3 on the staff and the neck

- **Description:** E F G · B C D · G A: read them on the staff, find them in first position
- **Input:** screen and guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in first position (frets 0–3, shaded). Exact octave counts.” → answer: string 1, fret 0. (answered by **clicking a spot on the neck**)
    - hint: It is open string 1, written E5 (top space).
    - explanation after answering: Written E5 on space 4 (counting from the bottom). Guitar sounds an octave lower than written. This exact pitch lives at S1 F0, S2 F5, S3 F9 — in this position: S1 F0. Open strings are written E3, A3, D4, G4, B4, E5.
  - **Generator 2**, sample: “Name this note.” → answer: F5. (answered by **typing the note name**)
    - hint: It is a landmark: the top line, F.
    - explanation after answering: It sits on line 5 (counting from the bottom): F5. Lines bottom→top: E G B D F. Spaces: F A C E.
  - **Generator 3**, sample: “Name this note.” → answer: C5. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, the middle line, B, and count 1 letter up (each line-to-space move is one letter).
    - explanation after answering: It sits on space 3 (counting from the bottom): C5. Lines bottom→top: E G B D F. Spaces: F A C E.
- **Why it is in the goal (ⓘ text of its step):** ['pitch', 'The notes of the staff, string by string in first position, then ledger lines above and below, then accidentals and key signatures. The guitar reads over a wide range, more than three octaves, so ledger lines are daily work for a guitarist and not a rare case.']
- **Level note (the Details button):**
  - *Key takeaways:* The staff shows pitch by height. Lines from the bottom: E G B D F. Spaces: F A C E. / Guitar music is written an octave higher than it sounds.
  - *What to pay attention to:* Connect each written note straight to a string and fret, without saying a letter name in between if you can. / First position, strings 1–3: E F G on string 1 (frets 0, 1, 3), B C D on string 2 (0, 1, 3), G A on string 3 (0, 2).
  - *Skill it builds:* Sight to hand: the reading reflex for the notes that carry most melodies.
  - *Theory and tips:* Leavitt starts here for a reason: open-position notes on the top strings sit in the middle of the staff. / Read by interval once you have a starting note: next line or space up is the next letter.
- **Source of the level (exact settings):**

```js
{n:'Strings 1–3 on the staff and the neck',d:'E F G · B C D · G A: read them on the staff, find them in first position',g:[sightQ([0,3],[1,2,3],0),trebleQ([0,2,4,6,8]),trebleQ([1,3,5,7])]}
```

#### Reading 2: The whole staff

- **Description:** D4 to G5 by name
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name this note.” → answer: A4. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, the second line, G, and count 1 letter up (each line-to-space move is one letter).
    - explanation after answering: It sits on space 2 (counting from the bottom): A4. Lines bottom→top: E G B D F. Spaces: F A C E.
  - **Generator 2**, sample: “Name this note.” → answer: G5. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, the top line, F, and count 1 letter up (each line-to-space move is one letter).
    - explanation after answering: It sits on the space just above the staff: G5. Lines bottom→top: E G B D F. Spaces: F A C E.
- **Level note (the Details button):**
  - *What this level adds:* The whole staff by name, from the D below the bottom line to the G above the top line.
  - *What to pay attention to:* The two notes that hang outside the staff, D below and G above. / Speed on the middle lines. B on the middle line is your centre.
  - *Theory and tips:* Learn three anchors: the bottom line E, the middle line B, the top line F. Everything else is a step or two from one of them.
- **Source of the level (exact settings):**

```js
{n:'The whole staff',d:'D4 to G5 by name',g:[trebleQ([-1,0,1,2,3,4,5,6,7,8,9]),trebleQ([-1,9])]}
```

#### Reading 3: Ledger lines, above and below

- **Description:** Up to three lines: low E to middle C under the staff, A to high E over it
- **Input:** screen
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name this note.” → answer: G3. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, middle C, one ledger line below the staff, and count 3 letters down (each line-to-space move is one letter).
    - explanation after answering: It sits on the space under ledger line 2 below the staff: G3. Lines bottom→top: E G B D F. Spaces: F A C E. Ledger lines below, going down: C, A, F (the low E hangs under the third).
  - **Generator 2**, sample: “Name this note.” → answer: E6. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, the top line, F, and count 6 letters up (each line-to-space move is one letter).
    - explanation after answering: It sits on ledger line 3 above the staff: E6. Lines bottom→top: E G B D F. Spaces: F A C E. Ledger lines above, going up: A, C, E.
  - **Generator 3**, sample: “Name this note.” → answer: D6. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, the top line, F, and count 5 letters up (each line-to-space move is one letter).
    - explanation after answering: It sits on the space over ledger line 2 above the staff: D6. Lines bottom→top: E G B D F. Spaces: F A C E. Ledger lines above, going up: A, C, E.
  - **Generator 4**, sample: “Name this note.” → answer: E3. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, middle C, one ledger line below the staff, and count 5 letters down (each line-to-space move is one letter).
    - explanation after answering: It sits on the space under ledger line 3 below the staff: E3. Lines bottom→top: E G B D F. Spaces: F A C E. Ledger lines below, going down: C, A, F (the low E hangs under the third).
- **Level note (the Details button):**
  - *Key takeaways:* Ledger lines extend the staff. Each line and each space still moves by one letter. / Below the staff the ledger lines are C, A, F going down; above it A, C, E going up.
  - *What to pay attention to:* Count lines, not dots. Three ledger lines below with the note hanging under them is the low E of the guitar. / Notes in the spaces between ledger lines: B and G below, B and D above.
  - *Skill it builds:* Reading the whole written range of the instrument, low E to high E, so nothing on a chart is a surprise.
  - *Theory and tips:* The guitar’s low E is three ledger lines down plus one: that is why guitar parts look low on the page. / Players read high ledger lines by shape and distance from the top line, not by counting every time. Learn A, C and E above as fixed pictures.
- **Source of the level (exact settings):**

```js
{n:'Ledger lines, above and below',d:'Up to three lines: low E to middle C under the staff, A to high E over it',g:[trebleQ([-7,-6,-5,-4,-3,-2]),trebleQ([10,11,12,13,14]),trebleQ([-7,-6,-5,-4,-3,-2,10,11,12,13,14]),trebleQ([-7,-5,-3,12,14])]}
```

#### Reading 4: Strings 4–6, ledger lines below

- **Description:** D E F · A B C · E F G
- **Input:** screen and guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in first position (frets 0–3, shaded). Exact octave counts.” → answer: string 4, fret 0. (answered by **clicking a spot on the neck**)
    - hint: It is open string 4, written D4 (space below the staff).
    - explanation after answering: Written D4 on the space just below the staff. Guitar sounds an octave lower than written. This exact pitch lives at S4 F0, S5 F5, S6 F10 — in this position: S4 F0. Open strings are written E3, A3, D4, G4, B4, E5.
  - **Generator 2**, sample: “Name this note.” → answer: C4. (answered by **typing the note name**)
    - hint: It is a landmark: middle C, one ledger line below the staff.
    - explanation after answering: It sits on ledger line 1 below the staff: C4. Lines bottom→top: E G B D F. Spaces: F A C E. Ledger lines below, going down: C, A, F (the low E hangs under the third).
- **Level note (the Details button):**
  - *What this level adds:* Strings 4 to 6 in first position: D E F, A B C, E F G. These are the ledger-line notes below the staff, now under your fingers.
  - *What to pay attention to:* Middle C is on string 5, fret 3, one ledger line below. / String 6: E open is the lowest note, F fret 1, G fret 3.
  - *Theory and tips:* Two patterns of frets: strings 6 and 1 (E F G) and string 2 (B C D) are 0, 1, 3; strings 5 (A B C) and 4 (D E F) are 0, 2, 3.
- **Source of the level (exact settings):**

```js
{n:'Strings 4–6, ledger lines below',d:'D E F · A B C · E F G',g:[sightQ([0,3],[4,5,6],0),trebleQ([-4,-3,-2,-1])]}
```

#### Reading 5: All of first position

- **Description:** Every natural from low E to high G
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in first position (frets 0–3, shaded). Exact octave counts.” → answer: string 5, fret 3. (answered by **clicking a spot on the neck**)
    - hint: Nearest open string below it: string 5, written A3 (2 ledger lines below). Count 3 frets up.
    - explanation after answering: Written C4 on ledger line 1 below the staff. Guitar sounds an octave lower than written. This exact pitch lives at S5 F3, S6 F8 — in this position: S5 F3. Open strings are written E3, A3, D4, G4, B4, E5.
- **Level note (the Details button):**
  - *What this level adds:* All of first position, every natural from low E to high G.
  - *What to pay attention to:* String crossings: A on string 3 fret 2 to B on open string 2. / Do not look at the left hand. Keep your eyes on the page.
  - *Theory and tips:* First position covers two octaves and a third. Most beginner reading books stay here for months.
- **Source of the level (exact settings):**

```js
{n:'All of first position',d:'Every natural from low E to high G',g:[sightQ([0,3],[1,2,3,4,5,6],0)]}
```

#### Reading 6: Accidentals and key signatures

- **Description:** Sharps and flats on the staff and in first position; apply the key signature
- **Input:** screen and guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name this note.” → answer: G♯4. (answered by **typing the note name**)
    - hint: It is a landmark: the second line, G.
    - explanation after answering: It sits on line 2 (counting from the bottom): G4, raised by the sharp. Lines bottom→top: E G B D F. Spaces: F A C E.
  - **Generator 2**, sample: “Name this note — the key signature applies.” → answer: C♯. (answered by **typing the note name**)
    - hint: Read the sharps/flats at the start of the staff. They apply to that letter in every octave.
    - explanation after answering: The key signature (A major / F♯ minor) has 3♯: F♯ C♯ G♯. So every C is played C♯.
  - **Generator 3**, sample: “Play this note in first position (frets 0–4, shaded). Exact octave counts.” → answer: string 3, fret 3. (answered by **clicking a spot on the neck**)
    - hint: Nearest open string below it: string 3, written G4 (2nd line). Count 3 frets up.
    - explanation after answering: Written B♭4 on line 3 (counting from the bottom) with a flat. Guitar sounds an octave lower than written. This exact pitch lives at S3 F3, S4 F8 — in this position: S3 F3. Open strings are written E3, A3, D4, G4, B4, E5.
- **Level note (the Details button):**
  - *Key takeaways:* A sharp raises a note one fret, a flat lowers it one fret, a natural cancels. An accidental lasts until the bar line. / A key signature applies to every note of that letter, in every octave, for the whole piece.
  - *What to pay attention to:* The key signature is not written again next to the notes. You have to remember it. / Sharps come in the order F C G D A E B; flats in the reverse order.
  - *Skill it builds:* Reading in keys, which is what real music is written in.
  - *Theory and tips:* For sharp keys the key is a half step above the last sharp. For flat keys it is the second-to-last flat; one flat is F. / In first position a flat on an open-string note moves it to the next lower string: B♭ is string 3, fret 3.
- **Source of the level (exact settings):**

```js
{n:'Accidentals and key signatures',d:'Sharps and flats on the staff and in first position; apply the key signature',g:[trebleQ([-1,0,1,2,3,4,5,6,7,8,9],true),trebleSig(),sightQ([0,4],[1,2,3,4,5,6],2)]}
```

**Stage 3: Reading 7–10**

#### Reading 7: Second position

- **Description:** Frets 2–5: the first position without open strings, and the F on strings 6 and 1 at fret 1, a stretch
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in position II (frets 2–5, shaded). Exact octave counts.” → answer: string 4, fret 4. (answered by **clicking a spot on the neck**)
    - hint: Nearest open string below it: string 4, written D4 (space below the staff). Count 4 frets up.
    - explanation after answering: Written F♯4 on space 1 (counting from the bottom) with a sharp. Guitar sounds an octave lower than written. This exact pitch lives at S4 F4, S5 F9 — in this position: S4 F4. Open strings are written E3, A3, D4, G4, B4, E5.
- **Why it is in the goal (ⓘ text of its step):** ['neck', 'Positions II to IV and fifth position: where the written notes are once the hand leaves the open strings. Above the open position the same written note has several places, and the position decides which one.']
- **Level note (the Details button):**
  - *Key takeaways:* A position is the fret under the first finger; each finger takes one fret. In position II the first finger is at fret 2. / The same written note is now on a different string and fret than in first position.
  - *What to pay attention to:* No open strings. Notes you played open are now fretted on the next lower string. / Stay in position. Do not slide back to first position for a note you know there. / About one question in six asks a note one fret outside the four frets, with no place inside them: the F on string 6 or string 1 at fret 1, a stretch of the first finger. The hand does not move.
  - *Skill it builds:* Reading away from the nut, which is where the guitar becomes one instrument and not six open strings.
  - *Theory and tips:* Position II is the first one Leavitt teaches after the open position. Every key can be played there with finger stretches and no shift. / This level stays in one position from the first question to the last: learn where each written note lies here before the position changes.
- **Source of the level (exact settings):**

```js
{n:'Second position',d:'Frets 2–5: the first position without open strings, and the F on strings 6 and 1 at fret 1, a stretch',g:[sightPosQ([2,5])]}
```

#### Reading 8: Third position

- **Description:** Frets 3–6, and the notes at fret 7 reached by a stretch
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in position III (frets 3–6, shaded). Exact octave counts.” → answer: string 1, fret 4. (answered by **clicking a spot on the neck**)
    - hint: Nearest open string below it: string 1, written E5 (top space). Count 4 frets up.
    - explanation after answering: Written A♭5 on ledger line 1 above the staff with a flat. Guitar sounds an octave lower than written. This exact pitch lives at S1 F4, S2 F9 — in this position: S1 F4. Open strings are written E3, A3, D4, G4, B4, E5.
- **Level note (the Details button):**
  - *What this level adds:* The same reading one fret higher: the first finger at fret 3, the four fingers on frets 3 to 6.
  - *What to pay attention to:* Every note you found in position II is still here, one finger lower: what the second finger played, the first plays now. / The stretch notes are at fret 7, under the fourth finger reaching up: B on string 6, E on string 5, A on string 4, B on string 1.
  - *Theory and tips:* One position a level. If a note sends your hand back to position II, stop and find it under the fingers you have.
- **Source of the level (exact settings):**

```js
{n:'Third position',d:'Frets 3–6, and the notes at fret 7 reached by a stretch',g:[sightPosQ([3,6])]}
```

#### Reading 9: Fourth position

- **Description:** Frets 4–7, and the notes at fret 3 reached by a stretch
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in position IV (frets 4–7, shaded). Exact octave counts.” → answer: string 1, fret 3 or string 2, fret 8. (answered by **clicking a spot on the neck**)
    - hint: It is not inside the shaded frets. Look one fret outside them, on either side.
    - explanation after answering: Written G5 on the space just above the staff. In position IV it is outside the four frets: a stretch, the hand does not move. String 1, fret 3: one fret below the first finger, which reaches back; or String 2, fret 8: one fret above the fourth finger, which reaches up. The scale fingering of this position takes it on string 1. This pitch has no place inside frets 4–7.
- **Level note (the Details button):**
  - *What this level adds:* The first finger at fret 4, the four fingers on frets 4 to 7.
  - *What to pay attention to:* The stretch notes are now below the hand, at fret 3, under the first finger reaching back: G on string 6, C on string 5, F on string 4, G on string 1. / C and F are no longer under a finger inside the four frets on the low strings: that is what makes this position feel strange in C major.
  - *Theory and tips:* Three neighbouring positions hold the same notes under different fingers. That is the point of learning them one at a time: the note stays, the finger changes.
- **Source of the level (exact settings):**

```js
{n:'Fourth position',d:'Frets 4–7, and the notes at fret 3 reached by a stretch',g:[sightPosQ([4,7])]}
```

#### Reading 10: Fifth position

- **Description:** Frets 5–8, up to C above the staff, and the B on string 4 at fret 9: a stretch
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in position V (frets 5–8, shaded). Exact octave counts.” → answer: string 5, fret 5. (answered by **clicking a spot on the neck**)
    - hint: It is open string 4, written D4 (space below the staff). That finds the pitch. In this position it is on a lower string: every string down is five frets higher (four from string 2 to string 3).
    - explanation after answering: Written D4 on the space just below the staff. Guitar sounds an octave lower than written. This exact pitch lives at S4 F0, S5 F5, S6 F10 — in this position: S5 F5. Open strings are written E3, A3, D4, G4, B4, E5.
- **Level note (the Details button):**
  - *Key takeaways:* Fifth position, frets 5 to 8: the middle of the neck and the standard reading position for jazz guitar.
  - *What to pay attention to:* The top of the range: C two ledger lines above the staff is string 1, fret 8. / String 3 and 4 notes that you know only in first position. / The written middle-line B has no place in frets 5 to 8: string 4, fret 9, a fourth-finger stretch.
  - *Skill it builds:* Reading where jazz melodies are actually played: the tone is fuller and every key is within reach.
  - *Theory and tips:* In position V the written middle C is on string 6 under the fourth finger, fret 8, and the C two ledger lines above the staff is on string 1 at the same fret: two octaves under one hand. / Most written lead-sheet melodies fit between positions V and VII.
- **Source of the level (exact settings):**

```js
{n:'Fifth position',d:'Frets 5–8, up to C above the staff, and the B on string 4 at fret 9: a stretch',g:[sightPosQ([5,8])]}
```

**Stage 4: Reading 11–13**

#### Reading 11: Seventh position

- **Description:** Frets 7–10: find the written notes there
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in position VII (frets 7–10, shaded). Exact octave counts.” → answer: string 5, fret 7. (answered by **clicking a spot on the neck**)
    - hint: Nearest open string below it: string 4, written D4 (space below the staff). Count 2 frets up. That finds the pitch. In this position it is on a lower string: every string down is five frets higher (four from string 2 to string 3).
    - explanation after answering: Written E4 on line 1 (counting from the bottom). Guitar sounds an octave lower than written. This exact pitch lives at S4 F2, S5 F7, S6 F12 — in this position: S5 F7. Open strings are written E3, A3, D4, G4, B4, E5.
- **Why it is in the goal (ⓘ text of its step):** ['neck', 'Seventh and ninth position with the notes above the staff, and two notes at once. High ledger lines are the part of the range guitarists read worst, because they meet it least; these levels are there to make it ordinary.']
- **Level note (the Details button):**
  - *What this level adds:* Seventh position: frets 7 to 10. Find the written notes there.
  - *What to pay attention to:* The lowest note is B on string 6. The first string reaches high D at fret 10. / C major fits this position with no stretch.
  - *Theory and tips:* Positions V, VII and IX overlap: each note you learn here is a fret or two from where it sits in the next one.
- **Source of the level (exact settings):**

```js
{n:'Seventh position',d:'Frets 7–10: find the written notes there',g:[sightPosQ([7,10])]}
```

#### Reading 12: Ninth position, high ledger lines

- **Description:** Frets 9–12 and the notes above the staff, and the notes reached by a stretch at fret 8
- **Input:** screen and guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Play this note in position IX (frets 9–12, shaded). Exact octave counts.” → answer: string 3, fret 9. (answered by **clicking a spot on the neck**)
    - hint: It is open string 1, written E5 (top space). That finds the pitch. In this position it is on a lower string: every string down is five frets higher (four from string 2 to string 3).
    - explanation after answering: Written E5 on space 4 (counting from the bottom). Guitar sounds an octave lower than written. This exact pitch lives at S1 F0, S2 F5, S3 F9 — in this position: S3 F9. Open strings are written E3, A3, D4, G4, B4, E5.
  - **Generator 2**, sample: “Name this note.” → answer: A5. (answered by **typing the note name**)
    - hint: Start from the nearest landmark, the top line, F, and count 2 letters up (each line-to-space move is one letter).
    - explanation after answering: It sits on ledger line 1 above the staff: A5. Lines bottom→top: E G B D F. Spaces: F A C E. Ledger lines above, going up: A, C, E.
- **Level note (the Details button):**
  - *What this level adds:* Ninth position, frets 9 to 12, and the notes on ledger lines above the staff.
  - *What to pay attention to:* Above the staff the notes are read by counting ledger lines: A sits on the first one, C on the second, E on the third. / Three notes of C major lie at fret 8 here: first-finger stretches.
  - *Theory and tips:* The twelfth fret repeats the open strings an octave higher: use it to check where you are.
- **Source of the level (exact settings):**

```js
{n:'Ninth position, high ledger lines',d:'Frets 9–12 and the notes above the staff, and the notes reached by a stretch at fret 8',g:[sightPosQ([9,12]),trebleQ([10,11,12])]}
```

#### Reading 13: Two notes at once

- **Description:** Dyads on the staff, in first and fifth position
- **Input:** screen and guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Two notes together (a dyad). Mark both on the neck inside the shaded position, then press Done.” → answer: B4 and D5. (answered by **marking every spot on the neck**; strummed chord)
    - hint: Find the lower note first, then the shape of the interval on the next string up.
    - explanation after answering: Written B4 and D5: a minor 3rd. Here, from string 3 to string 2, the upper note is 1 fret back. Between strings a 4th apart: minor 3rd two frets back, major 3rd one back, 4th level, 5th two up; between strings 3 and 2 each is one fret higher on the upper string.
  - **Generator 2**, sample: “Two notes together (a dyad). Mark both on the neck inside the shaded position, then press Done.” → answer: B4 and D5. (answered by **marking every spot on the neck**; strummed chord)
    - hint: Find the lower note first, then the shape of the interval on the next string up.
    - explanation after answering: Written B4 and D5: a minor 3rd. Here, from string 4 to string 3, the upper note is 2 frets back. Between strings a 4th apart: minor 3rd two frets back, major 3rd one back, 4th level, 5th two up; between strings 3 and 2 each is one fret higher on the upper string.
- **Level note (the Details button):**
  - *Key takeaways:* Two notes that sound together. Here each is drawn on its own staff, the lower one first; on a real page they are written one above the other.
  - *What to pay attention to:* Read from the bottom note up. / Find the lower note first, then the distance to the upper one: a third is line to line or space to space.
  - *Skill it builds:* The first step towards reading chords and chord melody.
  - *Theory and tips:* On neighbouring strings a major third is one fret back on the higher string and a minor third two frets back. Between strings 3 and 2 each is one fret less.
- **Source of the level (exact settings):**

```js
{n:'Two notes at once',d:'Dyads on the staff, in first and fifth position',g:[sightDyadQ([0,4]),sightDyadQ([5,9])]}
```

### Reading Rhythm (`rhyread`)

- **What the game is:** Read rhythms and tap them with the click, in the order A Modern Method introduces them: note values and rests, ties and dots, eighths, the dotted quarter, off-beats, 3/4 and 2/4, triplets (eighth-, quarter- and half-note), syncopation, sixteenths and their rests, 6/8 and 12/8, cut time, broken and sixteenth-note triplets, 5/4 and 3/8, changing meters, and accents over a running subdivision. Tap only: the paper side (counting, the signs) is in Rhythm Theory, writing a heard rhythm down in Rhythm Dictation.
- **Area:** Notation, in Leavitt’s order · **course** 101 · **badge** life, core · **input:** tap or strum (continuous)
- **Master standard:** accuracy 90 %, timing within ±30 ms (read any figure and place it within 30 ms)
- **Lesson card, how to practise:** Read the whole bar before the count-in; say the counts under the notes. / Add durations from the start of the bar to find where a note falls; a dot adds half, a tie adds the next note. / Tap the rhythm on the guitar body or strum muted strings; the hand must learn it, not only the eye. / Once a level is clean, raise the tempo a little and read it again: the bars are new every time.
- **Lesson card, rules:** Whole = 4, half = 2, quarter = 1, eighth = ½, sixteenth = ¼ beat in 4/4. / The dotted quarter + eighth is the first syncopation: 1 (hold) & of 2. / Eighth–quarter–eighth: the quarter sits off the beat and crosses it. / In 12/8 the click is the dotted quarter: three eighths per click.
- **Lesson card, take-away:** Rhythm reading is a vocabulary of beat-long cells; once the cells are automatic, any chart is a sequence of things you already know.
- **Level-page note:** Continuous: the click never stops, and the music is a page that stands still, so you read ahead while you play. On the keyboard a dotted quarter or longer is held for its length; shorter notes are a tap. The accent levels (26–28) need the microphone: strum muted strings.

**Stage 1: Reading Rhythm 1–5**

#### Reading Rhythm 1: Whole, half, quarter

- **Description:** Note values and rests in 4/4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 80. Why: Quarter-note motion: the comfortable middle of the pulse range.
- **Four sample bars (where the notes start):** 1 | 2 | 3 | 1
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'Rhythm is the half of reading that keeps you in the band: a wrong note passes, a wrong rhythm puts you in the wrong bar. Whole notes to eighths, ties and dots, the dotted quarter and the off-beat: tapped in time from the page.']
- **Level note (the Details button):**
  - *Key takeaways:* A note value is a length, and a rest is a length of silence. Both are counted. / On the page that stands still you read ahead: your eyes are on the next bar while you play this one.
  - *What to pay attention to:* Hold long notes for their full length. Cutting a half note short is a wrong rhythm even if it started on time. / Rests are played by counting them, not by waiting. / Keep your eyes moving left to right. Stopping on a note you just played is how you lose the place.
  - *Skill it builds:* The basic reading reflex: seeing a length and producing it without translating it into words.
  - *Theory and tips:* Whole = 4 beats, half = 2, quarter = 1. Keep counting “1 2 3 4” through everything. / Read in groups. A bar is one picture, not four separate decisions.
- **Source of the level (exact settings):**

```js
{n:'Whole, half, quarter',d:'Note values and rests in 4/4',g:[tapReadQ(['w','h','q','r','hr'],2)],c:cCells(['w','h','q','r','hr'])}
```

#### Reading Rhythm 2: Ties and dots

- **Description:** A dot adds half; a tie adds the next note
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 2 2& | 2 3& 4 | 1 3 3& | 1 3
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* A dot adds half of the note’s own length; a tie joins two notes into one sound. Both make lengths that are not 1, 2 or 4.
  - *What to pay attention to:* A dotted quarter is a beat and a half: the eighth after it falls on the “and” of the next beat. / A tied note is not struck again. The second note is only held.
  - *Theory and tips:* A tie is used when a sound has to cross a beat or a bar line; a dot when it stays inside. They can mean the same length. / Dotted quarter + eighth is the first uneven figure you read. Feel it as “long, short”.
- **Source of the level (exact settings):**

```js
{n:'Ties and dots',d:'A dot adds half; a tie adds the next note',g:[tapReadQ(['q','h','qe','tie','r'],2)],c:cCells(['q','h','qe','tie','r'])}
```

#### Reading Rhythm 3: Eighth notes

- **Description:** Two per beat
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 2 2& | 1 2 2& 3 | 1 1& 2 | 1 1& 3 3&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Eighth notes: two to a beat, joined by a beam. The beam shows you where each beat starts.
  - *What to pay attention to:* Read by the beam groups. Each beamed pair is one beat. / Even length. Do not swing them here.
  - *Theory and tips:* Standard notation beams eighths to show the beats, which is why a correctly written bar is easier to read than a wrong one. / Count “1 & 2 &” and let single quarters fall on the numbers.
- **Source of the level (exact settings):**

```js
{n:'Eighth notes',d:'Two per beat',g:[tapReadQ(['q','ee','h','r'],2),tapBackQ(['q','ee','r'])],c:cCells(['q','ee','h','r'])}
```

#### Reading Rhythm 4: Dotted quarter and eighth

- **Description:** q. e and e q.: the first syncopated feel
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 1& 3 | 1 2& 3 4 | 1 1& 3 3& 4 4& | 1 2& 3 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Dotted quarter + eighth is the first figure where a note starts off the beat and matters. / It comes in two orders: long–short (starts on the beat) and short–long (the long note starts on the “and”).
  - *What to pay attention to:* The eighth after the dot lands on the “and” of the next beat, not on the beat. / In the short–long order the long note is off the beat: do not correct it onto the beat.
  - *Skill it builds:* Reading the smallest syncopation. Almost every melody you will read contains this figure.
  - *Theory and tips:* Count the dotted quarter as “1 (2) &”: you feel beat 2 pass in silence and play on its “and”. / This figure is half of the Charleston rhythm. Getting it by eye now saves you later.
- **Source of the level (exact settings):**

```js
{n:'Dotted quarter and eighth',d:'q. e and e q.: the first syncopated feel',g:[tapReadQ(['q','ee','qe','eq','h'],2)],c:cCells(['q','ee','qe','eq','h'])}
```

#### Reading Rhythm 5: Eighth rests, off-beats

- **Description:** Rest on the beat, play the and
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 3& | 1 1& 2 3 | 1 3 3& 4& | 1 1& 2 2& 3 3& 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Eighth rests on the beat, notes on the “and”. You have to feel a beat you do not play.
  - *What to pay attention to:* The rest is the downbeat. Feel it in your foot and play after it. / Chains of off-beats tend to slide onto the beat. Keep the foot going.
  - *Theory and tips:* Off-beat entries are how jazz phrases normally start. A phrase that starts on the “and” of 1 sounds like speech; one that starts on 1 sounds like a march.
- **Source of the level (exact settings):**

```js
{n:'Eighth rests, off-beats',d:'Rest on the beat, play the and',g:[tapReadQ(['q','ee','re','er','r','qe'],2),tapBackQ(['q','ee','re','er'])],c:cCells(['q','ee','re','er','r','qe'])}
```

**Stage 2: Reading Rhythm 6–12**

#### Reading Rhythm 6: 3/4

- **Description:** Three beats a bar, the dotted half
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 3/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Note shown while playing:** In 3/4.
- **Four sample bars (where the notes start):** 1 | 3 3& | 2 | 1 2&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['rhy', '3/4 and 2/4, the triplets (eighth, quarter and half-note triplets), and the two syncopation levels. Syncopation is where most readers fall off: a note tied over the beat must be recognised by its look, with no time to work it out.']
- **Level note (the Details button):**
  - *What this level adds:* Three beats in a bar. The count changes to “1 2 3” and the long note of the meter is the dotted half.
  - *What to pay attention to:* Beat 1 comes round sooner than your body expects. Count every bar at first. / A dotted half fills the whole bar.
  - *Theory and tips:* 3/4 is one strong beat and two light ones. Feel it in one at faster tempos. / The jazz waltz is its own feel and comes later; here the beats are even.
- **Source of the level (exact settings):**

```js
{n:'3/4',d:'Three beats a bar, the dotted half',g:[tapReadQ(['q','ee','h','dh','r','qe'],2,false,{meter:3}),tapReadQ(['q','ee','h','r'],4,false,{meter:2})],c:cCells(['q','ee','h','dh','r','qe'],false,3,{note:'In 3/4.'})}
```

#### Reading Rhythm 7: 2/4

- **Description:** Two beats a bar
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 2/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Note shown while playing:** In 2/4: two beats a bar.
- **Four sample bars (where the notes start):** 1& | 1& 2 | 1 1& 2 | 1 2 2&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Two beats in a bar. Everything you know from 4/4, with the bar line coming twice as often.
  - *What to pay attention to:* Beat 1 comes round every two beats: keep counting “1 2”. / A half note fills the bar.
  - *Theory and tips:* 2/4 is the meter of marches and polkas, and of many sambas and choros as they are written. / Short bars make it easy to lose which bar you are in: read by the bar lines.
- **Source of the level (exact settings):**

```js
{n:'2/4',d:'Two beats a bar',g:[tapReadQ(['q','ee','h','r'],4,false,{meter:2}),tapReadQ(['q','ee','re','h'],4,false,{meter:2})],c:cCells(['q','ee','h','r','re','er'],false,2,{note:'In 2/4: two beats a bar.'})}
```

#### Reading Rhythm 8: Triplets

- **Description:** Eighth-note triplets, quarter–eighth and eighth–quarter inside the triplet
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–90 bpm, start at 70. Why: Triplets: three even notes a beat are still controllable here.
- **Four sample bars (where the notes start):** 1 1-trip 1-let 2 4 4& | 1 1& 2 2& 3 4 4-trip | 1 3 4 4& | 1 1-trip 1-let 2 2& 3 3-trip 4 4-let
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Triplets on the page: three eighths beamed under a 3, taking the time of two. Also the long–short and short–long shapes inside one triplet.
  - *What to pay attention to:* A quarter plus an eighth inside a triplet bracket is the written form of swing. Read it as “long short”. / The bar after a triplet: go back to even eighths without carrying the triplet feel over.
  - *Theory and tips:* Triplet quarter–eighth is how swing eighths are sometimes written out exactly. Most charts just write even eighths and say “swing”.
- **Source of the level (exact settings):**

```js
{n:'Triplets',d:'Eighth-note triplets, quarter–eighth and eighth–quarter inside the triplet',g:[tapReadQ(['q','ee','trip','tqe','teq','h'],2),tapBackQ(['q','ee','trip'])],c:cCells(['q','ee','trip','tqe','teq','h'])}
```

#### Reading Rhythm 9: Quarter-note triplets

- **Description:** Three even notes over two beats
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 72. Why: Slow enough to hear the second click fall exactly between the second and third notes of the triplet.
- **Note shown while playing:** Three even notes over two clicks: the second click falls between the second and third notes.
- **Four sample bars (where the notes start):** 1 1-let 2-trip 3 4 4-trip 4-let | 1 3 3-trip 3-let 4 4-trip 4-let | 1 1-let 2-trip 3 | 1 3 3-trip 3-let 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The quarter-note triplet: three quarter notes under a 3, taking the time of two. Three even notes over two beats.
  - *What to pay attention to:* Only the first note is on a click. The second click falls exactly between the second and third notes. / Keep the three notes even. The usual fault is to play the dotted-quarter figure instead (long, long, short).
  - *Theory and tips:* Count eighth-note triplets through the two beats, “1 trip let 2 trip let”, and play every second syllable: “1”, “let”, “trip”. / It is three against two: the hand plays three while the click plays two.
- **Source of the level (exact settings):**

```js
{n:'Quarter-note triplets',d:'Three even notes over two beats',g:[tapReadQ(['q','ee','h','qtrip','qtrip','trip'],2),tapBackQ(['q','h','qtrip'])],c:cCells(['q','ee','h','qtrip','qtrip','trip'],false,4,{tp:[60,100,72,'Slow enough to hear the second click fall exactly between the second and third notes of the triplet.'],note:'Three even notes over two clicks: the second click falls between the second and third notes.'})}
```

#### Reading Rhythm 10: Half-note triplets

- **Description:** Three even notes over the whole bar
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 72–120 bpm, start at 88. Why: The three notes are far apart: much slower than this and the bar stops feeling like one shape.
- **Note shown while playing:** Three even notes over four clicks: only the first note is on a click.
- **Four sample bars (where the notes start):** 1 3 3-let 4-trip | 1 2-trip 3-let | 1 2 4 | 1 2 3
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The half-note triplet: three half notes under a 3, taking the time of two. Three even notes over the whole bar.
  - *What to pay attention to:* Only the first note is on a click; beats 2, 3 and 4 all fall between notes. / Do not let it slide into dotted quarter, dotted quarter, quarter. That figure is close, and it is not even.
  - *Theory and tips:* Count eighth-note triplets through the bar and play every fourth syllable: “1”, the “trip” of beat 2, the “let” of beat 3. / It is also every second note of two quarter-note triplets: feel those six, play the first, third and fifth. / It is three against four over the bar. Slow melodies use it to float over the beat.
- **Source of the level (exact settings):**

```js
{n:'Half-note triplets',d:'Three even notes over the whole bar',g:[tapReadQ(['htrip','htrip','qtrip','q','h','trip'],2)],c:cCells(['htrip','htrip','qtrip','q','h','trip'],false,4,{tp:[72,120,88,'The three notes are far apart: much slower than this and the bar stops feeling like one shape.'],note:'Three even notes over four clicks: only the first note is on a click.'})}
```

#### Reading Rhythm 11: Syncopation I

- **Description:** Eighth–quarter–eighth, the quarter off the beat
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 2& 3 4& | 1 1& 3 3& 4& | 1 2& 3 4& | 1 1& 3 3& 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Eighth–quarter–eighth: the quarter note sits across the middle of the beat pair, starting on an “and”.
  - *What to pay attention to:* The middle note starts on the “and” of 1 and is held through beat 2. Do not strike on 2. / The last eighth is on the “and” of 2.
  - *Skill it builds:* Reading syncopation as a shape. Once this figure is a single picture, half of written jazz rhythm reads itself.
  - *Theory and tips:* Count “1 & (2) &”. Beat 2 is felt, not played. / This is the commonest syncopation in all popular music. Recognise it by its look: short, long, short.
- **Source of the level (exact settings):**

```js
{n:'Syncopation I',d:'Eighth–quarter–eighth, the quarter off the beat',g:[tapReadQ(['q','ee','eqe','eq','qe','re'],2)],c:cCells(['q','ee','eqe','eq','qe','re'])}
```

#### Reading Rhythm 12: Syncopation II

- **Description:** Ties into the beat: beats 2, 3 and 4 anticipated
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 2 2& 3 4 4& | 1 2 2& 3 4 4& | 1 1& 2& 3 4 | 1 2 3 3&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Ties across the beat. A note written on an “and” and tied over is an anticipation of the next beat.
  - *What to pay attention to:* A tie into a beat means that beat is not struck: the note before it is only held through it. / Find the next struck note before you get there.
  - *Theory and tips:* An anticipated downbeat is called a push. Charts write it as an eighth tied to the next bar; you hear the chord change half a beat early. / In this level the ties stay inside the bar: the anticipated beats are 2, 3 and 4, never the downbeat of the next bar.
- **Source of the level (exact settings):**

```js
{n:'Syncopation II',d:'Ties into the beat: beats 2, 3 and 4 anticipated',g:[tapReadQ(['ee','tie','eqe','er','re','q','qt'],2),tapBackQ(['ee','tie','eqe','re'])],c:cCells(['ee','tie','eqe','er','re','q','qt'])}
```

**Stage 3: Reading Rhythm 13–20**

#### Reading Rhythm 13: Sixteenths

- **Description:** Four per beat and the three-note groupings
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 50–80 bpm, start at 60. Why: Sixteenths: four taps a beat reach the limit of one finger near 80.
- **Four sample bars (where the notes start):** 1 1& 2 2e 2& 2a 3 3& 4 4e 4& | 1 1& 2 2e 2a 3 3e 3& 3a 4 4e 4a | 1 1e 1& 2 2& 2a 3 3e 3a 4 4& | 1 1e 1& 1a 2 2e 2& 3 3& 3a 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'Sixteenths and their groupings, the dotted eighth with a sixteenth, sixteenth rests, 6/8 and 12/8, and cut time. Charts in funk, Latin and show music are written in these figures and meters. In cut time the page looks like 4/4 and is felt in two.']
- **Level note (the Details button):**
  - *What this level adds:* Sixteenth notes, four to a beat, and the three-note groups made of an eighth and two sixteenths.
  - *What to pay attention to:* Eighth + two sixteenths is “1 & a”; two sixteenths + eighth is “1 e &”. Tell them apart by which side the double beam is on. / Slow the click before you guess.
  - *Theory and tips:* Count “1 e & a” and let each written note pick its syllable. / The sixteenth–eighth–sixteenth figure is the same shape as eighth–quarter–eighth at twice the speed.
- **Source of the level (exact settings):**

```js
{n:'Sixteenths',d:'Four per beat and the three-note groupings',g:[tapReadQ(['q','ee','ssss','ess','sse','ses'],2),tapBackQ(['q','ee','ssss','ess','sse'])],c:cCells(['q','ee','ssss','ess','sse','ses'])}
```

#### Reading Rhythm 14: Dotted eighth–sixteenth

- **Description:** The long–short and short–long sixteenth figures
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 50–80 bpm, start at 60. Why: Sixteenths: four taps a beat reach the limit of one finger near 80.
- **Four sample bars (where the notes start):** 1 1e 1& 2 2e 3 3e 4 4a | 1 2 2e 3 3e 3& 4 4e 4& | 1 1& 2 2a 3 3& 4 4& | 1 1e 1& 2 2e 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Dotted eighth + sixteenth and its reverse: the sixteenth sits on the “a”, or in the reverse on the beat with the long note on the “e”.
  - *What to pay attention to:* Do not turn it into a triplet. The long note is three sixteenths, the short one is one. / The reversed figure, short–long, is the snap. The short note is on the beat.
  - *Theory and tips:* In swing charts a dotted-eighth–sixteenth is often played as a swung pair. Here it is literal: 3 + 1.
- **Source of the level (exact settings):**

```js
{n:'Dotted eighth–sixteenth',d:'The long–short and short–long sixteenth figures',g:[tapReadQ(['q','ee','des','sde','ssss','ess','sse'],2)],c:cCells(['q','ee','des','sde','ssss','ess','sse'])}
```

#### Reading Rhythm 15: Sixteenth rests

- **Description:** A rest inside the beat: the sixteenth that is not played
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 50–80 bpm, start at 60. Why: Sixteenths: four taps a beat reach the limit of one finger near 80.
- **Four sample bars (where the notes start):** 1 1& 2e 2& 3e 3& 4 4e 4& | 1 2 2e 2& 2a 3e 3& 3a 4e 4& | 1 1& 2 2& 3 3& 3a 4e 4& | 1 1e 1& 2e 2& 2a 3 3& 4 4e 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* A sixteenth rest inside the beat. The note that is missing is the hard one to feel.
  - *What to pay attention to:* A rest on the beat itself: the first sound comes on the “e”. / Keep the hand moving in sixteenths and leave the rest silent. Do not stop the motion.
  - *Theory and tips:* Count all four, “1 e & a”, and say the rest silently. / These figures are the basis of funk rhythm guitar: the strumming hand never stops, only some strokes sound.
- **Source of the level (exact settings):**

```js
{n:'Sixteenth rests',d:'A rest inside the beat: the sixteenth that is not played',g:[tapReadQ(['q','ee','ssss','rsss','sssr','rse','esr','ess'],2)],c:cCells(['q','ee','ssss','rsss','sssr','rse','esr','ess'])}
```

#### Reading Rhythm 16: Everything so far, in 4/4

- **Description:** Bar after bar of every 4/4 figure so far, mixed: eighths and rests, ties and dots, triplets of all three sizes, syncopation, sixteenths, the dotted figures and sixteenth rests
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 50–80 bpm, start at 60. Why: Sixteenths: four taps a beat reach the limit of one finger near 80.
- **Note shown while playing:** Every figure of the levels before, in 4/4. Nothing new: read each beat as a shape you know.
- **Four sample bars (where the notes start):** 1 1& 3& 4 4-let | 1e 1& 1a 2 2e 2& 3e 3& 3a 4e 4& | 1& 2 2e 2& 3e 3& 3a 4e 4& | 1 1-let 2-trip 3 3e 3& 3a 4 4e
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Every figure you have read so far in 4/4, mixed in one stream: eighths and their rests, ties and dots, the three triplets, syncopation, sixteenths, the dotted eighth with a sixteenth, and sixteenth rests. / Nothing here is new. What is new is that the next beat can be any of them.
  - *What to pay attention to:* Read a beat ahead. Recognise each beat as one shape, as you recognise a word, and do not count it out note by note. / When a triplet follows sixteenths, the hand changes from four to a beat to three to a beat: hear the triplet in your head before it comes. / If one figure keeps breaking the run, go back to its own level for a few minutes, then return.
  - *Skill it builds:* Reading at sight in 4/4: the figures have to come without thinking before the meter itself changes in the next levels.
  - *Theory and tips:* Choose the tempo by the hardest figure in the mix, the sixteenth rests, not by the easiest. / A clean run here is the sign that the sixteenth figures have really gone in.
- **Source of the level (exact settings):**

```js
{n:'Everything so far, in 4/4',d:'Bar after bar of every 4/4 figure so far, mixed: eighths and rests, ties and dots, triplets of all three sizes, syncopation, sixteenths, the dotted figures and sixteenth rests',g:[tapReadQ(['q','ee','h','qe','eq','tie','re','er','eqe','trip','tqe','qtrip','htrip','ssss','ess','sse','ses','des','sde','rsss','sssr','rse','esr'],8)],c:cCells(['q','ee','h','qe','eq','tie','re','er','eqe','trip','tqe','qtrip','htrip','ssss','ess','sse','ses','des','sde','rsss','sssr','rse','esr'],false,4,{note:'Every figure of the levels before, in 4/4. Nothing new: read each beat as a shape you know.'})}
```

#### Reading Rhythm 17: 6/8, with sixteenths

- **Description:** Two clicks a bar, three eighths to a click; then six sixteenths
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 6/8.
- **Tempo advice:** 40–60 bpm, start at 46. Why: The click is the dotted quarter, and the sixteenths inside it are six to a click: keep the click slow.
- **Note shown while playing:** Each click is a dotted quarter: two clicks a bar, three eighths to a click.
- **Four sample bars (where the notes start):** 1 1-trip 2 2-trip 2-let | 1 2 | 1 1-trip 1-let 1+ 2 2+ 2-trip 2& 2-let 2+ | 1 1-trip 2 2+ 2-trip 2-let
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* 6/8 has two beats in a bar, and each beat divides into three eighths. The click is the dotted quarter. / Sixteenths in 6/8 are six to a beat.
  - *What to pay attention to:* Count “1 & a 2 & a”, not six separate eighths. / A dotted quarter is one whole beat here. A quarter plus an eighth is long–short inside one beat. / Two sixteenths take the place of one eighth.
  - *Skill it builds:* Reading compound time, where the beat is a dotted note and divides in three.
  - *Theory and tips:* 6/8 and 3/4 hold the same six eighths. 6/8 groups them 3 + 3; 3/4 groups them 2 + 2 + 2. The beams show which. / Jigs, many ballads and Afro-Cuban rhythms are written in 6/8 or 12/8.
- **Source of the level (exact settings):**

```js
{n:'6/8, with sixteenths',d:'Two clicks a bar, three eighths to a click; then six sixteenths',g:[tapReadQ(['trip','tqe','teq','q'],4,false,{meter:2,ts:'6/8',noTup:true,prompt:'Read the bars in <b>6/8</b>: each click is a dotted quarter, two clicks a bar. Tap them after the count-in.',hint:'Count 1 & a 2 & a.'})],c:cCells(['trip','tqe','teq','q','trip','c6a','c6c','c6d','c6b'],false,2,{ts:'6/8',noTup:true,note:'Each click is a dotted quarter: two clicks a bar, three eighths to a click.'})}
```

#### Reading Rhythm 18: 12/8

- **Description:** Each click a dotted quarter, three eighths per click
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 12/8.
- **Tempo advice:** 50–80 bpm, start at 60. Why: The click is the dotted quarter, three eighths to a click.
- **Note shown while playing:** Each click is a dotted quarter: three eighths per click.
- **Four sample bars (where the notes start):** 1 1-let 2 2-trip 3 4 4-trip | 1 2 3 3-trip 3-let 4 4-trip | 1 2 3 3-trip 4 4-trip 4-let | 1 1-trip 1-let 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* 12/8: four beats, each a dotted quarter split into three eighths. It looks like triplets without the brackets.
  - *What to pay attention to:* Count four, not twelve. The beam groups of three show the beats. / A quarter + eighth inside a beat is long–short.
  - *Theory and tips:* Compound time: the beat divides in three by default. Slow blues, doo-wop and Afro-Cuban 6/8 are written this way. / 12/8 and 4/4 with triplets sound the same; the choice is about what is easier to read.
- **Source of the level (exact settings):**

```js
{n:'12/8',d:'Each click a dotted quarter, three eighths per click',g:[tapReadQ(['trip','tqe','teq','q'],2,false,{ts:'12/8',noTup:true,prompt:'Read the bar in <b>12/8</b>: each click is a dotted quarter, three eighths per click. Tap it after the count-in.',hint:'Count 1 & a 2 & a 3 & a 4 & a.'})],c:cCells(['trip','tqe','teq','q'],false,4,{ts:'12/8',noTup:true,note:'Each click is a dotted quarter: three eighths per click.'})}
```

#### Reading Rhythm 19: Cut time

- **Description:** The page looks like 4/4; the beat is the half note
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 2/2.
- **Tempo advice:** 130–200 bpm, start at 150. Why: Cut time is for fast music: the click is the half note, so at 150 you hear 75 clicks a minute. Under 130 there is no reason to feel it in two.
- **Note shown while playing:** Cut time: the click is the half note, two clicks a bar.
- **Four sample bars (where the notes start):** 2 3 | 2 3 | 1 | 1 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Cut time is 2/2: the page looks like 4/4 but the beat is the half note. The click sounds twice a bar.
  - *What to pay attention to:* Feel two beats a bar. Quarter notes are now the subdivision, as eighths are in 4/4. / Do not count four: at these tempos four beats a bar is frantic and two is calm.
  - *Skill it builds:* Reading fast music without rushing: the same notes, felt in two.
  - *Theory and tips:* Show tunes, marches, sambas and fast swing charts are written in cut time. / The tempo number is the quarter note; the click is half of it.
- **Source of the level (exact settings):**

```js
{n:'Cut time',d:'The page looks like 4/4; the beat is the half note',g:[tapReadQ(['q','ee','h','qe','r'],2,false,{ts:'2/2',prompt:'Read the bars in <b>cut time</b> (2/2): feel two beats a bar. Tap them after the count-in.'})],c:cCells(['q','ee','h','qe','eqe','r','w','q','h'],false,4,{ts:'2/2',click:(bar,b)=>b%2===0,cinClick:i=>i%2===0,tp:[130,200,150,'Cut time is for fast music: the click is the half note, so at 150 you hear 75 clicks a minute. Under 130 there is no reason to feel it in two.'],note:'Cut time: the click is the half note, two clicks a bar.'})}
```

#### Reading Rhythm 20: Everything so far

- **Description:** Bar after bar of everything so far
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–90 bpm, start at 70. Why: Triplets: three even notes a beat are still controllable here.
- **Four sample bars (where the notes start):** 1 1-let 2-trip 3 3-let 4-trip | 1 1& 2 3& 4 4-trip 4-let | 1& 2 2& 3 4& | 1 1& 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Every figure up to triplets and syncopation, bar after bar, with no warning of what comes next.
  - *What to pay attention to:* Read a bar ahead. No marker shows the current bar at this level. / When you slip, drop a beat and rejoin on the next bar line. Never go back.
  - *Theory and tips:* Sight-reading is recovery. A reader who keeps the form through a mistake is useful in a band; one who stops is not.
- **Source of the level (exact settings):**

```js
{n:'Everything so far',d:'Bar after bar of everything so far',g:[tapReadQ(['q','ee','qe','eqe','re','h','trip','tie','qtrip'],8),tapReadQ(['q','ee','h','dh','qe','r','eqe'],8,false,{meter:3})],c:cCells(['q','ee','qe','eqe','re','h','trip','tie','qtrip'])}
```

**Stage 4: Reading Rhythm 21–25**

#### Reading Rhythm 21: Broken triplets

- **Description:** A triplet with a rest in it: first, middle or last note missing
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–90 bpm, start at 70. Why: Triplets: three even notes a beat are still controllable here.
- **Four sample bars (where the notes start):** 1 1-trip 2 2& 3 3-trip 3-let 4-trip 4-let | 1 2 2-let 3 4 4& | 1-trip 1-let 2 2-trip 2-let 3 3-trip 4 4-let | 1 1-trip 1-let 2 2-trip 3 3-trip 4 4-let
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'The hard corners of rhythm reading: triplets with a rest in them, sixteenth-note triplets, 5/4 and 3/8, meters that change from bar to bar. They are rare, and for that reason they are where a reading goes wrong.']
- **Level note (the Details button):**
  - *What this level adds:* Triplets with one note missing: a rest in the first, second or third place.
  - *What to pay attention to:* Rest first: the two notes come late in the beat, “(1) trip let”. / Rest in the middle: the two outer notes are a swing-eighth pair written out exactly. / Keep saying all three syllables and leave one silent.
  - *Theory and tips:* The triplet with its middle note missing is the long–short of swing. Seeing it written this way shows what “swing the eighths” means.
- **Source of the level (exact settings):**

```js
{n:'Broken triplets',d:'A triplet with a rest in it: first, middle or last note missing',g:[tapReadQ(['q','trip','trn','tnr','tnrn','tqe'],2)],c:cCells(['q','trip','tqe','teq','trn','tnr','tnrn','ee'])}
```

#### Reading Rhythm 22: Sixteenth-note triplets

- **Description:** Three in the time of an eighth, six in a beat
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 40–60 bpm, start at 50. Why: Six notes a beat: only a slow click leaves room for them.
- **Four sample bars (where the notes start):** 1 2 2-trip 2-let 3 4 4e 4& 4a | 1 1+ 1-trip 1& 2 2+ 2-trip 2& 3 3e 3& 3a 4 | 1 2 2& 3 4 4& | 1 1+ 1-trip 1& 1-let 1+ 2 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Sixteenth-note triplets: three notes in the time of one eighth, six in a beat.
  - *What to pay attention to:* They are fast. Take the click down before you try. / Three sixteenth-triplets and then an eighth: the eighth must keep its full length.
  - *Theory and tips:* A group of six is marked 6; a group of three inside half a beat is marked 3. / In jazz lines this is the triplet turn that ornaments running eighths.
- **Source of the level (exact settings):**

```js
{n:'Sixteenth-note triplets',d:'Three in the time of an eighth, six in a beat',g:[tapReadQ(['q','ee','sext','ste','est','trip'],2)],c:cCells(['q','ee','q','ee','ssss','sext','ste','est','trip'])}
```

#### Reading Rhythm 23: 5/4 and 3/8

- **Description:** Five beats a bar; then three eighths a bar, felt in one
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 5/4.
- **Tempo advice:** 80–120 bpm, start at 96. Why: 5/4 needs a walking tempo to feel its 3 + 2. In the 3/8 sessions the eighth note goes at twice this number, one click a bar.
- **Note shown while playing:** In 5/4: five beats a bar, usually felt 3 + 2.
- **Four sample bars (where the notes start):** 1 2& 3 | 1 1& 2& 3 4 | 4 5& | 1 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* 5/4 has five quarter-note beats in a bar. 3/8 has three eighth notes in a bar and is felt in one. / The level alternates: one session in 5/4, the next in 3/8.
  - *What to pay attention to:* 5/4 is usually felt as 3 + 2: count “1 2 3 1 2”. / In 3/8 the click is the bar: one click, three eighths.
  - *Skill it builds:* Meters that are not built from twos and fours, and a meter whose beat is the whole bar.
  - *Theory and tips:* “Take Five” is the 5/4 everyone knows; its vamp is 3 + 2. / 3/8 is one beat of 6/8 standing alone. Its eighth note goes at twice the tempo number shown for the level.
- **Source of the level (exact settings):**

```js
{n:'5/4 and 3/8',d:'Five beats a bar; then three eighths a bar, felt in one',g:[tapReadQ(['q','ee','h','qe','r','dh'],2,false,{meter:5})],c:Object.assign(cCells(['q','ee','h','qe','r','dh','eqe'],false,5,{tp:[80,120,96,'5/4 needs a walking tempo to feel its 3 + 2. In the 3/8 sessions the eighth note goes at twice this number, one click a bar.'],note:'In 5/4: five beats a bar, usually felt 3 + 2.'}),{alt:[cCells(['q','ee','h','qe','r','dh','eqe'],false,5,{note:'In 5/4: five beats a bar, usually felt 3 + 2.'}),c8([3],{bpm:u=>u*2,note:'In 3/8: three eighths a bar, one click a bar.'})]})}
```

#### Reading Rhythm 24: Changing meters

- **Description:** The time signature changes from bar to bar; the quarter note stays the same
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 7/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Note shown while playing:** The meter changes every bar: read the number above each bar.
- **Four sample bars (where the notes start):** 1 2 3& 6 6& 7 7& | 1 1& 2 2& 3 4& 5 5& 6& | 1 3& 5 6& 7& | 2& 3& 4 5 6 7&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* The time signature changes from bar to bar. The quarter note stays the same length; only the number of beats in the bar changes.
  - *What to pay attention to:* The number written above each bar. Read it before you get there. / Beat 1 of each new bar: the click is accented there. / Keep the pulse even through the bar line. Do not pause to adjust.
  - *Skill it builds:* Following a chart whose bar lengths change, without losing the pulse.
  - *Theory and tips:* Each session uses one repeating pattern, such as 4/4 then 3/4. The next session uses another. / Clean bars are counted by written bar, so one 4/4 + 3/4 pair counts as two. / Mixed meters are common in musical theatre, contemporary jazz and film scores.
- **Source of the level (exact settings):**

```js
{n:'Changing meters',d:'The time signature changes from bar to bar; the quarter note stays the same',g:[tapReadQ(['q','ee','h','r'],2,false,{meter:3}),tapReadQ(['q','ee','h','r'],4,false,{meter:2})],c:Object.assign(cChange([[4,'4/4'],[3,'3/4']],['q','ee','h','qe','r','re'],{note:'The meter changes every bar: read the number above each bar.'}),{alt:[cChange([[4,'4/4'],[3,'3/4']],['q','ee','h','qe','r','re'],{note:'4/4 then 3/4, over and over.'}),cChange([[3,'3/4'],[2,'2/4']],['q','ee','h','qe','r','re'],{note:'3/4 then 2/4, over and over.'}),cChange([[4,'4/4'],[2,'2/4']],['q','ee','h','qe','r','re'],{note:'4/4 then 2/4, over and over.'}),cChange([[2,'2/4'],[3,'3/4'],[4,'4/4']],['q','ee','h','qe','r','re'],{note:'2/4, 3/4, 4/4, over and over.'})]})}
```

#### Reading Rhythm 25: Everything

- **Description:** Sixteenths and every kind of triplet mixed in, bar after bar
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 50–80 bpm, start at 60. Why: Sixteenths: four taps a beat reach the limit of one finger near 80.
- **Four sample bars (where the notes start):** 1 2 2& | 1 1e 1& 2 4 4e 4& | 1 1& 2& 3 4 4-trip 4-let | 1 1e 1& 2 2e 2& 2a 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The same with sixteenths and triplets mixed in.
  - *What to pay attention to:* Changes of grid inside a bar: twos to threes to fours.
  - *Theory and tips:* Mark the beats with your eye first, then read the figure inside each beat. Good readers see beats, not notes.
- **Source of the level (exact settings):**

```js
{n:'Everything',d:'Sixteenths and every kind of triplet mixed in, bar after bar',g:[tapReadQ(['q','ee','qe','eq','eqe','re','er','h','trip','tqe','ssss','ess','sse','des','tie','r','qtrip','htrip'],8)],c:cCells(['q','ee','qe','eq','eqe','re','er','h','trip','tqe','ssss','ess','sse','des','tie','r','qtrip','htrip'])}
```

**Stage 5: Reading Rhythm 26–26**

#### Reading Rhythm 26: Road map, played

- **Description:** A whole chart on the page with a repeat, two endings, a sign and a coda: play the bars in the order the signs tell you
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, a whole chart with repeats and jumps.
- **Tempo advice:** 60–112 bpm, start at 76. Why: The rhythms are easy on purpose. The tempo has to leave you time to look ahead to the next sign.
- **Four sample bars (where the notes start):** 1 3 | 1 3 | 1 1& 3& | 1 1& 2& 3&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['map', 'A chart is not read from left to right. There are repeats, first and second endings, D.S., the coda. Here a whole chart is played in time and the right road through it is part of the answer. Losing the form is the most common way a reading falls apart on a gig.']
- **Level note (the Details button):**
  - *Key takeaways:* The whole chart is on the page and stays there. You play its bars in the order the signs dictate, not from left to right. / A chart can hold a repeat, 1st and 2nd endings, a D.C. or D.S., Fine, “To Coda” and a coda.
  - *What to pay attention to:* Read the road before the count-in: find every sign and say the route to yourself. / At the end of every line, look ahead: is there a sign in the next bar? / The jump is in time. There is no spare beat for finding the sign or the coda. / “To Coda” means nothing the first time you pass it.
  - *Skill it builds:* Following a chart in real time, which every rehearsal and every gig asks of you.
  - *Theory and tips:* Nothing marks your place. After the last bar the same road starts again from the top without a break. / Every written bar has a different rhythm, so a wrong turn is heard as wrong notes. / On a paper chart, circle the signs in pencil before you play.
- **Source of the level (exact settings):**

```js
{n:'Road map, played',d:'A whole chart on the page with a repeat, two endings, a sign and a coda: play the bars in the order the signs tell you',g:[tapReadQ(['q','ee','h','r','re'],2)],c:cChart(['end1','dcfine','dscoda','full','end2','full'],['q','ee','h','r','re'],{tp:[60,112,76,'The rhythms are easy on purpose. The tempo has to leave you time to look ahead to the next sign.']})}
```

### Rhythm Theory (`rhytheory`)

- **What the game is:** The paper side of rhythm, kept apart from the tapping: note values and rests, meter, which count a note falls on, swing vocabulary, the road map of a chart (repeats, endings, D.C., D.S., the coda), accents, dynamics and articulation. Writing a heard rhythm down is the game Rhythm Dictation.
- **Area:** On paper · screen only · **course** 201 · **badge** warm, core · **input:** screen · speed gate on screen
- **Master standard:** accuracy 90 %, answer time at or under 0.7 of the target (rhythm read on paper without working it out)
- **Lesson card, how to practise:** Say the counts out loud: 1 & 2 & 3 & 4 &, 1 trip-let, 1 e & a. / Add durations from the start of the bar; a dot adds half, a tie adds the next note. / Road maps: trace the order of the bars with a finger before you answer. / Check your answer by tapping it after: paper and hands must agree.
- **Lesson card, rules:** Whole = 4, half = 2, quarter = 1, eighth = ½, sixteenth = ¼ beat in 4/4. / The top number of a time signature is beats per bar, the bottom is which note gets the beat. / Swing eighths are long–short; jazz time sits on 2 and 4; a push lands half a beat early.
- **Lesson card, take-away:** Rhythm you can count on paper is rhythm you can read; the tapping games put it in the hands, and Rhythm Dictation takes it down from the ear.
- **Level-page note:** Screen only, no tapping: counting, values, meter, swing vocabulary, the road map of a chart, accents and articulation. Writing a heard bar down is the game Rhythm Dictation.

**Stage 1: Rhythm Theory 1–3**

#### Rhythm Theory 1: Note values and rests

- **Description:** How long is it; which rest is that
- **Input:** screen
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “What kind of rest is in this bar, and how long is it?” → answer: quarter rest (one beat). (answered by **picking one choice**)
    - choices shown: quarter rest (one beat), half rest (two beats), eighth rest (half a beat), whole rest (four beats)
    - hint: Count the remaining notes: the rest fills what is left of four beats.
    - explanation after answering: A quarter rest lasts one beat. Quarter rest: the zigzag; half rest: a block sitting on the line; eighth rest: a stem with one hook.
  - **Generator 2**, sample: “In 4/4, how long is four sixteenths ?” → answer: 1 beat. (answered by **picking one choice**)
    - choices shown: 1½ beats, 1 beat, ¾ beat, 2 beats
    - hint: A quarter is one beat in 4/4; a dot adds half again.
    - explanation after answering: four sixteenths = 1 beat . A dot adds half the value; a tie adds the second note’s value.
  - **Generator 3**, sample: “How many sixteenth notes equal a whole note ?” → answer: 16. (answered by **picking one choice**)
    - choices shown: 12, 8, 16, 3
    - hint: A dot adds half.
    - explanation after answering: A dot adds half the note's value. a whole note = 16 sixteenth notes.
- **Why it is in the goal (ⓘ text of its step):** ['know', 'What the values and rests are worth, what a time signature says, and on which count a note falls. A good reader counts; this is where the counting is learned.']
- **Level note (the Details button):**
  - *Key takeaways:* Every note value is half of the one before it: whole, half, quarter, eighth, sixteenth. Every one has a rest of the same length.
  - *What to pay attention to:* Whole and half rests look alike: the whole rest hangs below the fourth line, the half rest sits on the third line. / A dot always adds half of the value it follows.
  - *Skill it builds:* The vocabulary of written time, so that reading and dictation are about rhythm and not about decoding symbols.
  - *Theory and tips:* A whole rest is also used for a full bar of silence in any meter. / Stems and flags: one flag or beam halves the quarter; two halve it again.
- **Source of the level (exact settings):**

```js
{n:'Note values and rests',d:'How long is it; which rest is that',g:[rhyRestQ(),rhyBeatsQ(),G_ge.values]}
```

#### Rhythm Theory 2: Meter

- **Description:** Time signatures and what the beat is
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “How many eighth notes fill one bar of 3/4 ?” → answer: 6. (answered by **picking one choice**)
    - choices shown: 4, 6, 5, 3
    - hint: Top number = how many; bottom = which note value.
    - explanation after answering: 3/4: the bottom number is the note value, the top is how many. Answer: 6.
  - **Generator 2**, sample: “In 4/4, how long is four sixteenths ?” → answer: 1 beat. (answered by **picking one choice**)
    - choices shown: ¾ beat, 2 beats, 1½ beats, 1 beat
    - hint: A quarter is one beat in 4/4; a dot adds half again.
    - explanation after answering: four sixteenths = 1 beat . A dot adds half the value; a tie adds the second note’s value.
- **Level note (the Details button):**
  - *Key takeaways:* The top number is how many beats are in a bar. The bottom number is which note value is one beat. / In compound meters (6/8, 9/8, 12/8) the felt beat is a dotted quarter, three eighths long.
  - *What to pay attention to:* 6/8 is two beats, not six. 3/4 is three beats. They hold the same six eighths and feel different.
  - *Skill it builds:* Knowing what the beat is before you read a note. It decides how everything in the bar is grouped.
  - *Theory and tips:* Simple meter: the beat divides in two. Compound: in three. / 5/8 and 7/8 are counted in groups of two and three eighths, for example 2+3 or 3+2+2.
- **Source of the level (exact settings):**

```js
{n:'Meter',d:'Time signatures and what the beat is',g:[G_ge.meter,rhyBeatsQ()]}
```

#### Rhythm Theory 3: Count it I

- **Description:** On which count does the note fall? Quarters, eighths, rests
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “On which count does note 6 (counting from the left, rests excluded) fall?” → answer: 4. (answered by **picking one choice**)
    - choices shown: 3 &, 1, 4 &, 3, 4
    - hint: Add the durations from the start of the bar: a quarter is one count, an eighth half a count.
    - explanation after answering: Counts for this bar: 1 · 1 & · 2 · 2 & · 3 · 4. Note 6 is on 4 .
- **Level note (the Details button):**
  - *Key takeaways:* Every note has an address in the bar: a beat number, or the “and” after it.
  - *What to pay attention to:* Add up what came before the note. Do not guess from its look. / Rests take up addresses too.
  - *Skill it builds:* Counting on paper. This is the skill that lets you work out a rhythm you cannot yet read at sight.
  - *Theory and tips:* Write the counts under a bar when stuck: 1 & 2 & 3 & 4 &. Each written symbol takes as many of those as its length.
- **Source of the level (exact settings):**

```js
{n:'Count it I',d:'On which count does the note fall? Quarters, eighths, rests',g:[rhyReadQ(['q','ee','r','re','er'])]}
```

**Stage 2: Rhythm Theory 4–4**

#### Rhythm Theory 4: Count it II

- **Description:** Dotted quarters and eighth–quarter–eighth
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “On which count does note 5 (counting from the left, rests excluded; a note tied on from the one before is the same note, not a new one) fall?” → answer: 4. (answered by **picking one choice**)
    - choices shown: 4 &, 1, 2 &, 2, 4
    - hint: Add the durations from the start of the bar: a quarter is one count, an eighth half a count.
    - explanation after answering: Counts for this bar: 1 · 1 & · 2 & · 3 & · 4 · 4 &. Note 5 is on 4 .
- **Why it is in the goal (ⓘ text of its step):** ['know', 'Counting dotted quarters and eighth–quarter–eighth: notes that start on an “and” and last past the next beat. These are the first figures a reader cannot take in at a glance without having counted them once.']
- **Level note (the Details button):**
  - *What this level adds:* Counting bars that contain dotted quarters and the eighth–quarter–eighth figure: notes that start on an “and” and last past the next beat.
  - *What to pay attention to:* After a dotted quarter the next note is on an “and”. / In eighth–quarter–eighth the middle note starts on the “and” of the beat the figure begins on.
  - *Theory and tips:* Syncopation means an accent where the meter does not put one. On paper it shows as a long note starting off the beat.
- **Source of the level (exact settings):**

```js
{n:'Count it II',d:'Dotted quarters and eighth–quarter–eighth',g:[rhyReadQ(['q','ee','re','er','qe','eq','eqe'])]}
```

### Intervals & Keys (`intervals`)

- **What the game is:** Major scales and their degrees first, then key signatures, intervals, relative and parallel keys, harmonic and melodic minor; then intervals turned over, built below a note and beyond the octave, and the three minor scales spelled in every key.
- **Area:** Scales and signatures · **course** 101 · **badge** once, core · **input:** screen · speed gate on screen
- **Master standard:** accuracy 95 %, answer time at or under 0.6 of the target (scales, signatures and intervals answered from memory, not counted)
- **Lesson card, how to practise:** Spell the major scale of every key first: a key signature is nothing but that scale’s sharps or flats, and every interval is measured against it. / Count the letters first (a 3rd always spans three letters), then fix the accidental. / Measure every interval against the major scale of the bottom note. / Say keys around the circle of fifths every day until the key signatures are automatic.
- **Lesson card, rules:** From the major scale: 2nds, 3rds, 6ths and 7ths are major; unisons, 4ths, 5ths and octaves are perfect. / One half step smaller: major → minor → diminished; perfect → diminished. One larger: major or perfect → augmented. / Sharps: <b>F C G D A E B</b>; the key is a half step above the last sharp. / Flats: <b>B E A D G C F</b>; the key is the second-to-last flat (F major has one flat). / Relative minor: down a minor 3rd, same key signature. Parallel minor: same root. / Harmonic minor raises the 7th; melodic minor raises the 6th and 7th. Inverted intervals add up to 9: major ↔ minor, augmented ↔ diminished, perfect stays perfect. / An interval below a note: count the letters down, or turn it over (a major 3rd below is a minor 6th above, an octave lower). / A 9th is a 2nd, an 11th a 4th, a 13th a 6th, an octave higher; the sign stays with it (♯11 = augmented 4th). / A minor scale: the signature of the major key a minor 3rd above gives natural minor; raise the 7th (harmonic) or the 6th and 7th (melodic) on the same letter.
- **Lesson card, take-away:** Intervals are the measuring stick of all harmony. Chords, scales and voicings are just intervals stacked from a root.

**Stage 1: Intervals & Keys 1–2**

#### Intervals & Keys 1: Major scales

- **Description:** The degrees of the major keys in use, by note and by number; all fifteen scales spelled whole
- **Input:** screen
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “What is the 2nd degree of E♭ major ? Spell it: letter and accidental.” → answer: F. (answered by **writing it note by note / token by token**)
    - hint: E♭ major has 3♭.
    - explanation after answering: E♭ major: E♭ – F – G – A♭ – B♭ – C – D. Degree 2 is F.
  - **Generator 2**, sample: “In D♭ major , which scale degree is F ?” → answer: 3rd. (answered by **picking one choice**)
    - choices shown: 1st, 2nd, 3rd, 4th, 5th, 6th, 7th
    - hint: Try to recall it as a pair before you count: the 3rd, 5th and 7th of the key first.
    - explanation after answering: D♭ major: D♭ – E♭ – F – G♭ – A♭ – B♭ – C. F is the 3rd .
  - **Generator 3**, sample: “Spell the C♯ major scale, note by note from the root.” → answer: C♯ – D♯ – E♯ – F♯ – G♯ – A♯ – B♯. (answered by **writing it note by note / token by token**)
    - hint: 7♯.
    - explanation after answering: Major = W W H W W W H, with each letter used once. C♯ major: C♯ – D♯ – E♯ – F♯ – G♯ – A♯ – B♯.
- **Why it is in the goal (ⓘ text of its step):** ['know', 'The major scales and the key signatures. A signature changes notes all the way down the page without marking them; a reader has to carry it in the head.']
- **Level note (the Details button):**
  - *Key takeaways:* A major scale is seven letters in a row, one of each, with half steps between 3–4 and 7–8. / Spelling means the right letter, not just the right key on a piano: F major has B♭, never A♯.
  - *What to pay attention to:* One of each letter. If a letter appears twice or is missing, the spelling is wrong. / The half steps. They are where accidentals come in.
  - *Skill it builds:* The ruler everything else is measured with. Intervals, chords and keys are all described as changes to a major scale.
  - *Theory and tips:* Steps: whole, whole, half, whole, whole, whole, half. / Know them from memory, not by building them each time. Chord spelling at speed depends on it. / Scale degrees are numbers: 1 2 3 4 5 6 7. A chord formula like 1 ♭3 5 refers to these. / All fifteen scales are spelled whole here, C♯, F♯, G♭ and C♭ among them: seven sharp keys, seven flat keys and C.
- **Source of the level (exact settings):**

```js
{n:'Major scales',d:'The degrees of the major keys in use, by note and by number; all fifteen scales spelled whole',g:[recall1(G_iv.degMaj),G_iv.whichDeg,recallScale(G_iv.spellMaj)]}
```

#### Intervals & Keys 2: Key signatures

- **Description:** Major keys and the order of sharps/flats
- **Input:** screen
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “How many sharps or flats are in D♭ major ?” → answer: 5♭. (answered by **picking one choice**)
    - choices shown: 5♭, 6♭, 4♭, 3♭
    - hint: Flat keys move up a 4th: F B♭ E♭ A♭ D♭ G♭ C♭.
    - explanation after answering: D♭ major has 5♭: B♭ E♭ A♭ D♭ G♭.
  - **Generator 2**, sample: “Which major key has 7♯ ?” → answer: C♯. (answered by **picking one choice**)
    - choices shown: C♯, F, C, G♭
    - hint: Last sharp + a half step = the key.
    - explanation after answering: 7♯ → C♯ major. Shortcut: the key is a half step above the last sharp.
  - **Generator 3**, sample: “What is the 2nd sharp in the order of sharps?” → answer: C♯. (answered by **picking one choice**)
    - choices shown: C♯, E♯, A♯, D♯
    - hint: Father Charles Goes Down…
    - explanation after answering: Order of sharps: F C G D A E B ("Father Charles Goes Down And Ends Battle"). Flats are the reverse: B E A D G C F.
- **Level note (the Details button):**
  - *Key takeaways:* A key signature is the set of sharps or flats of a major scale, written once at the start of each line.
  - *What to pay attention to:* Order of sharps: F C G D A E B. Order of flats: B E A D G C F, the same list backwards. / A key has sharps or flats, never both.
  - *Skill it builds:* Reading and thinking in keys. A glance at the signature tells you the scale.
  - *Theory and tips:* Sharp keys: the key is a half step above the last sharp. Flat keys: the key is the second-to-last flat. One flat is F, none is C. / Round the circle of fifths each step adds one sharp; the other way adds one flat.
- **Source of the level (exact settings):**

```js
{n:'Key signatures',d:'Major keys and the order of sharps/flats',g:[G_iv.sigMaj,G_iv.keyFromSig,G_iv.order]}
```

### Pulse & Feel (`pulse`)

- **What the game is:** Quarters, eighths, triplets and sixteenths on the click. Then the swing levels, with a walking bass and a hi-hat in place of the click: the hi-hat on 2 and 4, on 4 only, you as the hi-hat, the band dropping out, swing eighths. Then accents, playing ahead of and behind the beat on purpose, and the two ends of the tempo range. Tap, or strum muted strings.
- **Area:** Subdivision, the click, time feel · **course** 101 · **badge** life, core · **input:** tap or strum (continuous)
- **Master standard:** accuracy 90 %, timing within ±25 ms (steady, tight time)
- **Lesson card, how to practise:** Count out loud and tap your foot on every beat; feel the subdivision before you play the first note. / When the click thins out to 2 and 4, to 4 only, or disappears, keep counting: the time is inside you. / Raise the tempo a few beats a minute at a time while you stay clean, and go back down the moment it gets sloppy. / Strum muted strings into the mic instead of tapping to put the time in your picking hand.
- **Lesson card, rules:** Subdivide the beat you are playing: eighths as 1 & 2 &, triplets as 1 trip-let, sixteenths as 1 e & a. / Jazz time sits on 2 and 4; 1 and 3 are your answer to the click. / Swing eighths are long–short, about 2:1 at medium tempos, nearly even when fast. / Ahead, on and behind the beat are placements, not tempo changes: the pulse stays put.
- **Lesson card, take-away:** Good time is a subdivision you never stop hearing, and a placement you choose.
- **Level-page note:** Continuous: the click never stops. Strumming muted strings into the mic is the default: a keyboard has no dynamics and adds its own delay; the mic hears how hard you play, which the accent levels (13–15) need. The hold bar counts clean bars in a row (every written hit on time, nothing extra); the level unlocks at 24 when your tightness over the hits in that run, and over the last 16, is within the standard (the average spread around your own placement: a moving average, not hit by hit). The fire shows the run. Lean (where you sit against the click) is shown, not judged: tapping to a click, most people land 20–60 ms before it while feeling dead on; strumming into the mic you hear your own hit and that mostly disappears. Taps are corrected by the latency your audio device reports (shown below).

**Stage 1: Pulse & Feel 1–2**

#### Pulse & Feel 1: On the click

- **Description:** Quarter notes on every click
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 80. Why: Quarter notes: the comfortable middle of the pulse range, where sounds are 0.6 to 1 second apart.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 2 3 4 | 1 2 3 4 | 1 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['time', 'A steady quarter and eighth with the click. All reading in this goal is done in time, so the beat has to be firm before the page is put in front of it.']
- **Level note (the Details button):**
  - *Key takeaways:* Time is the first thing a listener judges. A quarter note that sits exactly with the click is the unit everything else is measured from. / You are not following the click. You are making your own pulse and checking it against the click.
  - *What to pay attention to:* Where your notes land, not whether they land: early and late by the same amount each time is fine, wandering is not. / The moment you stop hearing the click because your note covers it. That is what “on it” sounds like. / Body first: tap a foot or nod on every beat before you play a note.
  - *Skill it builds:* An internal quarter-note pulse steady enough to hold a band together. Every other rhythm level assumes it.
  - *Theory and tips:* The level opens on steadiness, not on a perfect average: 24 clean bars in a row with a small spread around your own placement. It also opens once its bars on the level page are green: accuracy and timing at the master standard over your recent blocks. / Most people land slightly ahead of a click. That is normal human anticipation; the lean is shown but not judged. / If you drift, you are listening to your hand. Listen to the click and let the hand follow your ear.
- **Source of the level (exact settings):**

```js
{n:'On the click',d:'Quarter notes on every click',g:[tapClickQ(2)],c:cSub(1,{tp:[60,100,80,'Quarter notes: the comfortable middle of the pulse range, where sounds are 0.6 to 1 second apart.']})}
```

#### Pulse & Feel 2: Eighths

- **Description:** Two per click: count 1 & 2 &
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough that the off-beat can be placed exactly, not guessed.
- **Four sample bars (where the notes start):** 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Two notes a beat. The new work is the off-beat: the “and” has no click to lean on, so you place it by dividing the beat in your head.
  - *What to pay attention to:* Is the “and” exactly halfway? Rushing the off-beat is the usual fault. / Count “1 & 2 &” aloud for the first bars, then stop counting and keep the feeling.
  - *Theory and tips:* Even eighths are the subdivision of rock, funk, Latin and bossa. Swing eighths come later and are a different placement of the same “and”. / Down-strokes on the beat, up-strokes on the “and”: the hand keeps time like a pendulum even when you leave notes out.
- **Source of the level (exact settings):**

```js
{n:'Eighths',d:'Two per click: count 1 & 2 &',g:[subdivQ('8ths')],c:cSub(2,{tp:[60,100,70,'Eighth notes: slow enough that the off-beat can be placed exactly, not guessed.']})}
```

**Stage 2: Pulse & Feel 3–4**

#### Pulse & Feel 3: Triplets

- **Description:** Three per click: 1 trip-let
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–90 bpm, start at 70. Why: Three even notes a beat stay controllable up to about 90.
- **Four sample bars (where the notes start):** 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let | 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let | 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let | 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['time', 'Triplets and sixteenths on the click. A written triplet or a group of sixteenths can only be played evenly if the subdivision is already in the hands.']
- **Level note (the Details button):**
  - *What this level adds:* Three notes a beat. Triplets change the grid from twos to threes, which is the grid swing lives on.
  - *What to pay attention to:* All three notes the same length. The common fault is long–short–short. / The second and third notes are where you speed up. Say “1-trip-let” evenly.
  - *Theory and tips:* A swing eighth is roughly the first and third notes of a triplet. Feeling triplets under a tune is what makes swing sit instead of sounding dotted. / The picking pattern turns over: down-up-down, up-down-up. Let it. Fighting it makes the triplet uneven.
- **Source of the level (exact settings):**

```js
{n:'Triplets',d:'Three per click: 1 trip-let',g:[subdivQ('trip')],c:cSub(3,{tp:[60,90,70,'Three even notes a beat stay controllable up to about 90.']})}
```

#### Pulse & Feel 4: Sixteenths

- **Description:** Four per click: 1 e & a
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 50–80 bpm, start at 60. Why: Four taps a beat: one finger reaches its limit near 80.
- **Four sample bars (where the notes start):** 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a | 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a | 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a | 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Four notes a beat. The two inner notes, “e” and “a”, are new positions you have not played yet.
  - *What to pay attention to:* The “e” and the “a” are quieter in your head than “1” and “&”. Give them the same weight. / Keep the hand moving in steady sixteenths; tightness comes from the motion, not from thinking about each note.
  - *Theory and tips:* Count “1 e & a”. Every funk and Latin comping figure is some selection from these four slots. / If sixteenths rush, slow the click until they are even, then raise it by a few beats a minute at a time.
- **Source of the level (exact settings):**

```js
{n:'Sixteenths',d:'Four per click: 1 e & a',g:[subdivQ('16ths')],c:cSub(4,{tp:[50,80,60,'Four taps a beat: one finger reaches its limit near 80.']})}
```

**Stage 3: Pulse & Feel 5–6**

#### Pulse & Feel 5: Switching subdivisions

- **Description:** Quarters, eighths, triplets and sixteenths in turn, two bars of each, on one pulse
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4.
- **Tempo advice:** 60–80 bpm, start at 60. Why: The tempo is set by the sixteenths: everything else has to fit the same pulse.
- **Note shown while playing:** The subdivision changes every two bars; the next bar is shown.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 2 3 4 | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['time', 'Changing subdivision on a steady beat, and playing with the band while the hi-hat marks 2 and 4. A written line moves between eighths, triplets and sixteenths all the time; the beat under them must not move.']
- **Level note (the Details button):**
  - *Key takeaways:* Changing subdivision without changing tempo is the real test of a pulse. The beat stays; only the number of notes inside it changes.
  - *What to pay attention to:* The first beat after a change. Going from threes to fours people rush; from fours back to quarters they drag. / Keep the foot on the quarter note through every change. The foot is the thing that does not change.
  - *Skill it builds:* Rhythmic control inside a phrase: the ability to play eighths, a triplet turn and sixteenths in one line and land on the next beat.
  - *Theory and tips:* Think of the beat as one length cut into 2, 3 or 4 equal parts, never as “faster notes”. / Jazz lines mix these constantly: running eighths, a triplet ornament, a double-time burst. This level is that skill with no notes to think about.
- **Source of the level (exact settings):**

```js
{n:'Switching subdivisions',d:'Quarters, eighths, triplets and sixteenths in turn, two bars of each, on one pulse',g:[subdivQ('switch'),subdivQ('mixed')],c:{bar:k=>subdivBar(4,[1,2,3,4][(k>>1)%4]),tp:[60,80,60,'The tempo is set by the sixteenths: everything else has to fit the same pulse.'],note:'The subdivision changes every two bars; the next bar is shown.'}}
```

#### Pulse & Feel 6: 2 and 4

- **Description:** Quarter notes with the band: a walking bass, the hi-hat on 2 and 4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, over a band (walking bass and hi-hat).
- **Tempo advice:** 100–180 bpm, start at 120. Why: The hi-hat on 2 and 4 is a swing sound: it needs a walking tempo. At 120 the hi-hat comes once a second; much slower and it stops feeling like a backbeat.
- **Note shown while playing:** A walking bass plays a blues in F; the hi-hat is on 2 and 4. Tap all four beats. With strumming into the microphone, wear headphones.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 2 3 4 | 1 2 3 4 | 1 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* A walking bass plays a blues, and the hi-hat is on 2 and 4 only. You play all four beats. / Beats 2 and 4 mean something because there is a form under them: a bar, a bass line, chord changes. Against bare taps they are just every other click.
  - *What to pay attention to:* Hearing the hi-hat as 2 and 4, not as 1 and 3. The bass tells you where 1 is: the chord changes land on it. / Beat 1 after a long stretch. That is where a flipped pulse shows.
  - *Skill it builds:* The jazz time feel: the drummer’s hi-hat is on 2 and 4, and you learn to hang your pulse on it the way you will on a bandstand.
  - *Theory and tips:* Practising with the metronome on 2 and 4 is standard jazz practice because it makes you responsible for the downbeat. / Swing gets its lift from the weight on 2 and 4. Players who feel 1 and 3 as the strong beats sound stiff.
- **Source of the level (exact settings):**

```js
{n:'2 and 4',d:'Quarter notes with the band: a walking bass, the hi-hat on 2 and 4',g:[twoFourQ('24')],c:cSub(1,{back:{},click:(bar,b)=>b===1||b===3,tp:[100,180,120,'The hi-hat on 2 and 4 is a swing sound: it needs a walking tempo. At 120 the hi-hat comes once a second; much slower and it stops feeling like a backbeat.'],note:'A walking bass plays a blues in F; the hi-hat is on 2 and 4. Tap all four beats. With strumming into the microphone, wear headphones.'})}
```

### Sight Reading (`sightread`)

- **What the game is:** A written line on the staff, played on the guitar in time after a count-in: the notes and the rhythm together. From two notes in first position to lines of four and eight bars over the whole neck, with the figures read with pitches (quarters, halves and eighths, rests and ties, dotted quarters and off-beats, eighth-note and quarter-note triplets, swing eighths, ties into the beat, sixteenths, 3/4, 6/8 and cut time) and the keys up to four sharps and flats. Every note is graded for pitch and for time.
- **Area:** Read it and play it · guitar · **course** 201 · **badge** life, core · **input:** microphone (guitar)
- **Master standard:** accuracy 95 %, timing within ±50 ms (read a line at sight and play it in time, without stopping)
- **Lesson card, how to practise:** Before the count-in ends: look at the key signature, the highest and lowest note, and the rhythm of the first bar. / Read one note ahead: while you play this note, your eyes are already on the next. / Never stop. A wrong note is gone; the next one is still on time. Stopping to fix it is the one real mistake. / Stay in the position the level gives you; the line was written to fit it.
- **Lesson card, rules:** Every note is graded for pitch (the exact octave written) and for time (on its beat). / Guitar is written an octave higher than it sounds. / A key signature holds for the whole line; an accidental holds to the bar line. / Eighths are even unless the level says swing; swung eighths are played long–short.
- **Lesson card, take-away:** Sight reading is the notes and the rhythm at once, in time, without stopping. The notes on the staff are taught in Reading, the figures in Reading Rhythm; here they come together on the guitar.

**Stage 2: Sight Reading 1–6**

#### Sight Reading 1: Two notes

- **Description:** Two written notes played as quarters on two clicks in a row; the click keeps running and you start when you are ready
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the two notes and play them in first position (frets 0–3) as quarter notes : one on a click, the next on the following click. The click keeps running: start on any click when you are ready.” → answer: F5 G5. (answered by **playing it on the guitar**; click at 60 bpm; free start (the click runs, start on any click); 2 notes to play; strict time)
    - hint: See both notes first, and have the second one under a finger before you play the first.
    - explanation after answering: F5 – G5: F5 on string 1, fret 1; G5 on string 1, fret 3.
  - **Generator 2**, sample: “Read the two notes and play them in first position (frets 0–3) as quarter notes : one on a click, the next on the following click. The click keeps running: start on any click when you are ready.” → answer: D4 E4. (answered by **playing it on the guitar**; click at 60 bpm; free start (the click runs, start on any click); 2 notes to play; strict time)
    - hint: See both notes first, and have the second one under a finger before you play the first.
    - explanation after answering: D4 – E4: D4 on string 4, fret 0; E4 on string 4, fret 2.
  - **Generator 3**, sample: “Read the two notes and play them in first position (frets 0–3) as quarter notes : one on a click, the next on the following click. The click keeps running: start on any click when you are ready.” → answer: B3 C4. (answered by **playing it on the guitar**; click at 60 bpm; free start (the click runs, start on any click); 2 notes to play; strict time)
    - hint: See both notes first, and have the second one under a finger before you play the first.
    - explanation after answering: B3 – C4: B3 on string 5, fret 2; C4 on string 5, fret 3.
- **Why it is in the goal (ⓘ text of its step):** ['pitch', 'The first real sight-reading: two written notes on two clicks, then lines of four to six notes, lines with rhythm, rests and ties, lines in G and F, and the first syncopation. Pitch and rhythm are now read together and played on the guitar in time, which is the skill itself.']
- **Level note (the Details button):**
  - *Key takeaways:* Two written notes, played as two quarter notes on two clicks in a row. This is the first time the page goes straight to the guitar, and in time. / The click keeps running. You choose the click you start on; from there the second note belongs on the very next one.
  - *What to pay attention to:* See both notes before you play the first, and have the second one ready. / Is the second note higher or lower, and is it a step or a skip? That tells you which way the hand goes. / Exact octave: the note has to be the one written, not the same letter somewhere else.
  - *Skill it builds:* The link from the staff to the fretboard without a letter name in between. Reading a line in time is this, repeated.
  - *Theory and tips:* A line to the next space, or a space to the next line, is a step: the next letter. Line to line or space to space is a third. / In first position a step is usually the next finger on the same string or the next open string. Learn each pair as one movement.
- **Source of the level (exact settings):**

```js
{n:'Two notes',d:'Two written notes played as quarters on two clicks in a row; the click keeps running and you start when you are ready',tp:[50,80,60,'Two notes, one a click: the time to read the second note is the click itself.'],g:[srLineQ({win:[0,3],strings:[1,2,3],len:2,free:true}),srLineQ({win:[0,3],len:2,free:true}),srLineQ({win:[0,3],len:2,free:true})]}
```

#### Sight Reading 2: A line of even notes

- **Description:** Four to six quarter notes in first position, one a click after the count-in
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line and play it in first position (frets 0–3), one note per click after the count-in. Keep going through a wrong note.” → answer: F3 G3 F3 A3 B3. (answered by **playing it on the guitar**; click at 60 bpm; 5 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: F3 – G3 – F3 – A3 – B3: F3 on string 6, fret 1; G3 on string 6, fret 3; F3 on string 6, fret 1; A3 on string 5, fret 0; B3 on string 5, fret 2.
- **Level note (the Details button):**
  - *Key takeaways:* A line of four to six notes, played in time. Reading is now continuous: no stopping between notes.
  - *What to pay attention to:* Read ahead. Your eyes should be on the next note while you play this one. / Keep going through a wrong note.
  - *Skill it builds:* Real sight-reading: pitch and time together, without stopping.
  - *Theory and tips:* See the contour first: up, down, steps or leaps. Then the names. / Steps on the page are adjacent letters; a skip from line to line or space to space is a third.
- **Source of the level (exact settings):**

```js
{n:'A line of even notes',d:'Four to six quarter notes in first position, one a click after the count-in',tp:[50,90,60,'One note a click: slow enough to read the next note while this one sounds.'],g:[srLineQ({win:[0,3]})]}
```

#### Sight Reading 3: Quarters, halves, eighths

- **Description:** Two bars with rhythm in first position
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going through a wrong note.” → answer: C4 B3 G3 F3 A3 G3. (answered by **playing it on the guitar**; click at 60 bpm; 6 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: C4 – B3 – G3 – F3 – A3 – G3: C4 on string 5, fret 3; B3 on string 5, fret 2; G3 on string 6, fret 3; F3 on string 6, fret 1; A3 on string 5, fret 0; G3 on string 6, fret 3.
- **Level note (the Details button):**
  - *What this level adds:* The same with rhythm: quarters, halves and eighths over two bars.
  - *What to pay attention to:* Rhythm comes first. A right note in the wrong place is wrong. / Tap the rhythm once before you play it, if you need to.
  - *Theory and tips:* Good readers scan the rhythm of a bar as one shape, then fill in pitches.
- **Source of the level (exact settings):**

```js
{n:'Quarters, halves, eighths',d:'Two bars with rhythm in first position',tp:[50,90,60,'Eighths are two to a click: 60 leaves half a second to read each pair.'],g:[srLineQ({win:[0,3],rhy:1})]}
```

#### Sight Reading 4: Rests and ties

- **Description:** A rest on a beat, a note tied over a beat: hold through the tie, do not play it again
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going through a wrong note.” → answer: E3 G3 A3 C4 E4. (answered by **playing it on the guitar**; click at 60 bpm; 5 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: E3 – G3 – A3 – C4 – E4: E3 on string 6, fret 0; G3 on string 6, fret 3; A3 on string 5, fret 0; C4 on string 5, fret 3; E4 on string 4, fret 2.
- **Level note (the Details button):**
  - *What this level adds:* Silence and held notes: a rest on a beat, and a note tied over a beat or over the bar line.
  - *What to pay attention to:* A tie joins two written notes into one sound: pick the first, hold through the second. / Count a rest as firmly as a note: the next note comes in on its own beat.
  - *Theory and tips:* A note tied over the bar line is everywhere in jazz writing: the second half is never played again.
- **Source of the level (exact settings):**

```js
{n:'Rests and ties',d:'A rest on a beat, a note tied over a beat: hold through the tie, do not play it again',tp:[50,90,60,'A rest and a tie are both silence for the picking hand: at 60 there is time to count them.'],g:[srLineQ({win:[0,3],rhy:['q','h','r','re','er','ee','hr'],ties:1,cells:'rt'})]}
```

#### Sight Reading 5: Lines in G and F

- **Description:** One sharp, one flat: the key signature changes the note everywhere. First position, with rhythm
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line in F major (1 flat in the signature), rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going through a wrong note.” → answer: C4 E4 D4 C4 D4 B♭3 A3. (answered by **playing it on the guitar**; click at 60 bpm; 7 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: C4 – E4 – D4 – C4 – D4 – B♭3 – A3: C4 on string 5, fret 3; E4 on string 4, fret 2; D4 on string 4, fret 0; C4 on string 5, fret 3; D4 on string 4, fret 0; B♭3 on string 5, fret 1; A3 on string 5, fret 0.
- **Level note (the Details button):**
  - *Key takeaways:* A key signature changes a note everywhere on the line: in G every F is F♯, in F every B is B♭. Nothing is written at the note itself. / The lines are in first position, with rhythm.
  - *What to pay attention to:* Before you play, say which notes the signature changes and find them under your fingers. / F♯ in first position: string 6 fret 2, string 4 fret 4, string 1 fret 2. B♭: string 5 fret 1, string 3 fret 3. / The usual mistake is to play the natural note out of habit.
  - *Skill it builds:* Reading in a key. Almost no real music is written in C.
  - *Theory and tips:* The sharps arrive in the order F C G D A E B, the flats in the order B E A D G C F. / A major key with sharps is named a half step above its last sharp. A key with flats is named by its last flat but one; F has one flat.
- **Source of the level (exact settings):**

```js
{n:'Lines in G and F',d:'One sharp, one flat: the key signature changes the note everywhere. First position, with rhythm',tp:[50,90,60,'A new key: the speed of the line is the speed of remembering the signature.'],g:[srLineQ({win:[0,4],rhy:1,key:['G','F']})]}
```

#### Sight Reading 6: Dotted quarters and off-beats

- **Description:** Syncopated lines in first position: a dotted quarter, a note on the “and”
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going through a wrong note.” → answer: F3 E3 F3 G3 E3 G3 A3 G3. (answered by **playing it on the guitar**; click at 60 bpm; 8 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: F3 – E3 – F3 – G3 – E3 – G3 – A3 – G3: F3 on string 6, fret 1; E3 on string 6, fret 0; F3 on string 6, fret 1; G3 on string 6, fret 3; E3 on string 6, fret 0; G3 on string 6, fret 3; A3 on string 5, fret 0; G3 on string 6, fret 3.
- **Level note (the Details button):**
  - *What this level adds:* Syncopated lines: dotted quarters and off-beat entries, with pitches.
  - *What to pay attention to:* A dotted quarter that starts on an “and” is held through the next beat: do not pick on that beat. / The note after a dotted quarter is on the “and”.
  - *Theory and tips:* This is how melodies in a fake book are written. Count the rhythm before you add the notes.
- **Source of the level (exact settings):**

```js
{n:'Dotted quarters and off-beats',d:'Syncopated lines in first position: a dotted quarter, a note on the “and”',tp:[50,80,60,'Off-beats need the eighth felt inside the click: keep the click slow.'],g:[srLineQ({win:[0,3],rhy:SR_SYNC})]}
```

**Stage 3: Sight Reading 7–14**

#### Sight Reading 7: Positions II to IV

- **Description:** Lines with rhythm in frets 2–7: no open strings
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going through a wrong note.” → answer: G5 E5 F5 G5 A5 B4 C5. (answered by **playing it on the guitar**; click at 60 bpm; 7 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G5 – E5 – F5 – G5 – A5 – B4 – C5: G5 on string 1, fret 3; E5 on string 2, fret 5; F5 on string 1, fret 1 (a stretch); G5 on string 1, fret 3; A5 on string 1, fret 5; B4 on string 3, fret 4; C5 on string 3, fret 5.
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position IV (frets 4–7) after the count-in. Keep going through a wrong note.” → answer: B3 C4 E4 F4 E4 D4 F4 G4 A4. (answered by **playing it on the guitar**; click at 60 bpm; 9 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: B3 – C4 – E4 – F4 – E4 – D4 – F4 – G4 – A4: B3 on string 6, fret 7; C4 on string 5, fret 3 (a stretch); E4 on string 5, fret 7; F4 on string 4, fret 3 (a stretch); E4 on string 5, fret 7; D4 on string 5, fret 5; F4 on string 4, fret 3 (a stretch); G4 on string 4, fret 5; A4 on string 4, fret 7.
  - **Generator 3**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: G5 E5 C5 F5 E5 F5 A5 G5 F5 B4 C5 B4 G4 A3 B3 C4. (answered by **playing it on the guitar**; click at 60 bpm; 16 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: G5 – E5 – C5 – F5 – E5 – F5 – A5 – G5 – F5 – B4 – C5 – B4 – G4 – A3 – B3 – C4: G5 on string 1, fret 3; E5 on string 2, fret 5; C5 on string 3, fret 5; F5 on string 1, fret 1 (a stretch); E5 on string 2, fret 5; F5 on string 1, fret 1 (a stretch); A5 on string 1, fret 5; G5 on string 1, fret 3; F5 on string 1, fret 1 (a stretch); B4 on string 3, fret 4; C5 on string 3, fret 5; B4 on string 3, fret 
- **Why it is in the goal (ⓘ text of its step):** ['pitch', 'Lines read and played in positions II to V: lines with rhythm, the keys of D, B♭, A and E♭, accidentals and natural signs inside a line, triplets and 3/4, syncopated and swung lines in fifth position. A great deal of written guitar music sits in fifth position, so this stage is the centre of the goal.']
- **Level note (the Details button):**
  - *What this level adds:* Lines with rhythm in positions II to IV, now with leaps of a 4th or more, and a four-bar line in position II.
  - *What to pay attention to:* Decide the position before the first note and stay in it. / The line uses the position's whole fingering: a note one fret outside the four frets is a stretch of the first or fourth finger, never a shift.
  - *Theory and tips:* Choose the position from the highest and lowest notes of the line. / After a leap the line steps back the other way: read the leap as one interval, not as a new place to find.
- **Source of the level (exact settings):**

```js
{n:'Positions II to IV',d:'Lines with rhythm in frets 2–7: no open strings',tp:[50,90,60,'A new place on the neck: the click at 60 while the hand learns where the notes are.'],g:[srLineQ({leap:true,win:[2,5],rhy:1}),srLineQ({leap:true,win:[4,7],rhy:1}),srLineQ({leap:true,win:[2,5],rhy:1,bars:4,long:true})]}
```

#### Sight Reading 8: D and B♭; one accidental

- **Description:** Two sharps in position II, two flats in first position; then a line in C with one written accidental
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line in D major (2 sharps in the signature), rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going through a wrong note.” → answer: A4 B4 A4 C♯5 D5 E5. (answered by **playing it on the guitar**; click at 60 bpm; 6 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: A4 – B4 – A4 – C♯5 – D5 – E5: A4 on string 3, fret 2; B4 on string 3, fret 4; A4 on string 3, fret 2; C♯5 on string 2, fret 2; D5 on string 2, fret 3; E5 on string 2, fret 5.
  - **Generator 2**, sample: “Read the line in B♭ major (2 flats in the signature), rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going through a wrong note.” → answer: C5 B♭4 G4 F4 E♭4. (answered by **playing it on the guitar**; click at 60 bpm; 5 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: C5 – B♭4 – G4 – F4 – E♭4: C5 on string 2, fret 1; B♭4 on string 3, fret 3; G4 on string 3, fret 0; F4 on string 4, fret 3; E♭4 on string 4, fret 1.
  - **Generator 3**, sample: “Read the line, rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going through a wrong note.” → answer: E3 F3 E3 F3 A♯3 B3. (answered by **playing it on the guitar**; click at 60 bpm; 6 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: E3 – F3 – E3 – F3 – A♯3 – B3: E3 on string 6, fret 0; F3 on string 6, fret 1; E3 on string 6, fret 0; F3 on string 6, fret 1; A♯3 on string 5, fret 1; B3 on string 5, fret 2.
- **Level note (the Details button):**
  - *What this level adds:* Two sharps (D major, in position II) and two flats (B♭ major, in first position). Then lines in C with one accidental written at the note.
  - *What to pay attention to:* D major: F♯ and C♯. B♭ major: B♭ and E♭. / An accidental at a note holds for the rest of that bar and no longer.
  - *Theory and tips:* An accidental inside a line is usually a half step leading into the next note. Read it as a pair with the note it leads to.
- **Source of the level (exact settings):**

```js
{n:'D and B♭; one accidental',d:'Two sharps in position II, two flats in first position; then a line in C with one written accidental',tp:[50,90,60,'Two altered notes to keep in mind for the whole line.'],g:[srLineQ({win:[2,5],rhy:1,key:'D'}),srLineQ({win:[0,4],rhy:1,key:'Bb'}),srLineQ({win:[0,4],rhy:1,chrom:true})]}
```

#### Sight Reading 9: Naturals; an accidental holds for the bar

- **Description:** A natural sign cancels the key signature or an earlier accidental, to the bar line
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line in G major (1 sharp in the signature), rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going through a wrong note.” → answer: C5 A4 B4 A4 D♯5 E5 D5. (answered by **playing it on the guitar**; click at 60 bpm; 7 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: C5 – A4 – B4 – A4 – D♯5 – E5 – D5: C5 on string 2, fret 1; A4 on string 3, fret 2; B4 on string 2, fret 0; A4 on string 3, fret 2; D♯5 on string 2, fret 4; E5 on string 1, fret 0; D5 on string 2, fret 3.
  - **Generator 2**, sample: “Read the line in D major (2 sharps in the signature), rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going through a wrong note.” → answer: F♯5 G5 F♯5 E5 D5 C5 B4. (answered by **playing it on the guitar**; click at 60 bpm; 7 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: F♯5 – G5 – F♯5 – E5 – D5 – C5 – B4: F♯5 on string 1, fret 2; G5 on string 1, fret 3; F♯5 on string 1, fret 2; E5 on string 2, fret 5; D5 on string 2, fret 3; C5 on string 3, fret 5; B4 on string 3, fret 4.
  - **Generator 3**, sample: “Read the line, rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going through a wrong note.” → answer: D4 B3 E♭4 D4 E4 G4 F4 G4 E4 D4. (answered by **playing it on the guitar**; click at 60 bpm; 10 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: D4 – B3 – E♭4 – D4 – E4 – G4 – F4 – G4 – E4 – D4: D4 on string 4, fret 0; B3 on string 5, fret 2; E♭4 on string 4, fret 1; D4 on string 4, fret 0; E4 on string 4, fret 2; G4 on string 3, fret 0; F4 on string 4, fret 3; G4 on string 3, fret 0; E4 on string 4, fret 2; D4 on string 4, fret 0.
- **Level note (the Details button):**
  - *What this level adds:* The natural sign: it cancels a sharp or a flat, from the key signature or from earlier in the bar, up to the bar line.
  - *What to pay attention to:* An accidental holds to the bar line: a later note on the same line or space in that bar keeps it without a new sign. / After the bar line the key signature is back.
  - *Theory and tips:* The natural moves by a half step to the next note, either way: in F a B♮ leads up to C or falls back to B♭ (an upper neighbour); in G an F♮ falls to E or rises to F♯. Read the chromatic note together with the note it moves to.
- **Source of the level (exact settings):**

```js
{n:'Naturals; an accidental holds for the bar',d:'A natural sign cancels the key signature or an earlier accidental, to the bar line',tp:[50,90,60,'A natural sign is read and remembered to the bar line: give it time.'],g:[srLineQ({win:[0,4],rhy:1,key:['G','F'],chrom:true,nat:true}),srLineQ({win:[2,5],rhy:1,key:'D',chrom:true,nat:true}),srLineQ({win:[0,4],rhy:1,chrom:true,nat:true})]}
```

#### Sight Reading 10: Eighth-note triplets

- **Description:** Three even notes in one click, in C, first position and position II
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going through a wrong note.” → answer: D5 C5 A4 B4 G4 B4 A4 F4 E4 D4 B3 D4 C4. (answered by **playing it on the guitar**; click at 56 bpm; 13 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: D5 – C5 – A4 – B4 – G4 – B4 – A4 – F4 – E4 – D4 – B3 – D4 – C4: D5 on string 2, fret 3; C5 on string 2, fret 1; A4 on string 3, fret 2; B4 on string 2, fret 0; G4 on string 3, fret 0; B4 on string 2, fret 0; A4 on string 3, fret 2; F4 on string 4, fret 3; E4 on string 4, fret 2; D4 on string 4, fret 0; B3 on string 5, fret 2; D4 on string 4, fret 0; C4 on string 5, fret 3.
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going through a wrong note.” → answer: F5 A5 G5 F5. (answered by **playing it on the guitar**; click at 56 bpm; 4 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: F5 – A5 – G5 – F5: F5 on string 1, fret 1 (a stretch); A5 on string 1, fret 5; G5 on string 1, fret 3; F5 on string 1, fret 1 (a stretch).
- **Level note (the Details button):**
  - *What this level adds:* Eighth-note triplets: three even notes in one click.
  - *What to pay attention to:* The first note of the triplet is on the click; the other two are evenly spaced, not hurried towards the next click. / After a triplet, straight eighths are back: two to a click.
  - *Theory and tips:* Say “tri-pl-et” on each click while you read the first lines.
- **Source of the level (exact settings):**

```js
{n:'Eighth-note triplets',d:'Three even notes in one click, in C, first position and position II',tp:[50,80,56,'Three notes a click: under 60 each triplet note still has room to be read.'],g:[srLineQ({win:[0,3],rhy:['q','trip','h','ee'],cells:'tr'}),srLineQ({win:[2,5],rhy:['q','trip','h','ee'],cells:'tr'})]}
```

#### Sight Reading 11: 3/4

- **Description:** Three beats a bar and the dotted half; in C
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going through a wrong note.” → answer: C4 D4 B3 C4. (answered by **playing it on the guitar**; click at 66 bpm; 4 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: C4 – D4 – B3 – C4: C4 on string 5, fret 3; D4 on string 4, fret 0; B3 on string 5, fret 2; C4 on string 5, fret 3.
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going through a wrong note.” → answer: G4 B4 D5 E5 D5. (answered by **playing it on the guitar**; click at 66 bpm; 5 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G4 – B4 – D5 – E5 – D5: G4 on string 4, fret 5; B4 on string 3, fret 4; D5 on string 2, fret 3; E5 on string 2, fret 5; D5 on string 2, fret 3.
- **Level note (the Details button):**
  - *What this level adds:* Three beats a bar: the dotted half fills it, and beat 1 comes every three clicks.
  - *What to pay attention to:* The dotted half is three clicks long: a dot adds half the value of the note. / Feel beat 1 of each bar: in 3/4 it comes sooner than the hand expects.
  - *Theory and tips:* Waltzes and jazz waltzes are written in 3/4: the reading is the same, only the bar is shorter.
- **Source of the level (exact settings):**

```js
{n:'3/4',d:'Three beats a bar and the dotted half; in C',tp:[50,90,66,'Three beats a bar: the click is the quarter as in 4/4.'],g:[srLineQ({win:[0,3],meter:'3/4',rhy:['q','h','dh','ee','qe']}),srLineQ({win:[2,5],meter:'3/4',rhy:['q','h','dh','ee','qe']})]}
```

#### Sight Reading 12: A and E♭

- **Description:** Three sharps in position II, three flats in position III
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line in A major (3 sharps in the signature), rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going through a wrong note.” → answer: G♯5 F♯5 E5 F♯5. (answered by **playing it on the guitar**; click at 60 bpm; 4 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G♯5 – F♯5 – E5 – F♯5: G♯5 on string 1, fret 4; F♯5 on string 1, fret 2; E5 on string 2, fret 5; F♯5 on string 1, fret 2.
  - **Generator 2**, sample: “Read the line in E♭ major (3 flats in the signature), rhythm included, and play it in position III (frets 3–6) after the count-in. Keep going through a wrong note.” → answer: A♭5 A♭4 B♭4 A♭4 F4 D4 B♭3 A♭3. (answered by **playing it on the guitar**; click at 60 bpm; 8 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: A♭5 – A♭4 – B♭4 – A♭4 – F4 – D4 – B♭3 – A♭3: A♭5 on string 1, fret 4; A♭4 on string 4, fret 6; B♭4 on string 3, fret 3; A♭4 on string 4, fret 6; F4 on string 4, fret 3; D4 on string 5, fret 5; B♭3 on string 6, fret 6; A♭3 on string 6, fret 4.
- **Level note (the Details button):**
  - *What this level adds:* Three sharps and three flats: A major (F♯ C♯ G♯) in position II and E♭ major (B♭ E♭ A♭) in position III.
  - *What to pay attention to:* Say the three altered notes before the count-in ends, then trust the signature. / In E♭ the open strings are mostly out of the key: the line stays fretted.
  - *Theory and tips:* Sharps come in the order F C G D, flats in the order B E A D: the next key adds the next one.
- **Source of the level (exact settings):**

```js
{n:'A and E♭',d:'Three sharps in position II, three flats in position III',tp:[50,90,60,'Three altered notes: the signature has to be in the hand before the line starts.'],g:[srLineQ({leap:true,win:[2,5],rhy:1,key:'A'}),srLineQ({leap:true,win:[3,6],rhy:1,key:'Eb'})]}
```

#### Sight Reading 13: Fifth position

- **Description:** Frets 5–8: even notes, then rhythm, then syncopation
- **Input:** guitar
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line and play it in position V (frets 5–8), one note per click after the count-in. Keep going through a wrong note.” → answer: G4 A4 C5 G4 A4 B4. (answered by **playing it on the guitar**; click at 60 bpm; 6 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G4 – A4 – C5 – G4 – A4 – B4: G4 on string 4, fret 5; A4 on string 4, fret 7; C5 on string 3, fret 5; G4 on string 4, fret 5; A4 on string 4, fret 7; B4 on string 4, fret 9 (a stretch).
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going through a wrong note.” → answer: E4 G4 A4 G5 F5 G5 B5 C6 B5. (answered by **playing it on the guitar**; click at 60 bpm; 9 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: E4 – G4 – A4 – G5 – F5 – G5 – B5 – C6 – B5: E4 on string 5, fret 7; G4 on string 4, fret 5; A4 on string 4, fret 7; G5 on string 2, fret 8; F5 on string 2, fret 6; G5 on string 2, fret 8; B5 on string 1, fret 7; C6 on string 1, fret 8; B5 on string 1, fret 7.
  - **Generator 3**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going through a wrong note.” → answer: G5 F5 E5 D5 G4 A4 E4 F4 G4 F4 A3 B3. (answered by **playing it on the guitar**; click at 60 bpm; 12 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G5 – F5 – E5 – D5 – G4 – A4 – E4 – F4 – G4 – F4 – A3 – B3: G5 on string 2, fret 8; F5 on string 2, fret 6; E5 on string 2, fret 5; D5 on string 3, fret 7; G4 on string 4, fret 5; A4 on string 4, fret 7; E4 on string 5, fret 7; F4 on string 5, fret 8; G4 on string 4, fret 5; F4 on string 5, fret 8; A3 on string 6, fret 5; B3 on string 6, fret 7.
  - **Generator 4**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: G4 F4 B4 A4 B4 C5 B4 C5 A4 C5 A4 G4 F4 E4. (answered by **playing it on the guitar**; click at 60 bpm; 14 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: G4 – F4 – B4 – A4 – B4 – C5 – B4 – C5 – A4 – C5 – A4 – G4 – F4 – E4: G4 on string 4, fret 5; F4 on string 5, fret 8; B4 on string 4, fret 9 (a stretch); A4 on string 4, fret 7; B4 on string 4, fret 9 (a stretch); C5 on string 3, fret 5; B4 on string 4, fret 9 (a stretch); C5 on string 3, fret 5; A4 on string 4, fret 7; C5 on string 3, fret 5; A4 on string 4, fret 7; G4 on string 4, fret 5; F4 on s
- **Level note (the Details button):**
  - *What this level adds:* Lines in fifth position: even notes, then rhythm, then the syncopated figures, then a line of four bars. Leaps of a 4th or more come in.
  - *What to pay attention to:* Fourth-finger notes. The little finger has to be as sure as the first. / In C the middle-line B is on string 4, fret 9: a fourth-finger stretch.
  - *Theory and tips:* Alternate picking on written eighths: down on the beat, up on the “and”.
- **Source of the level (exact settings):**

```js
{n:'Fifth position',d:'Frets 5–8: even notes, then rhythm, then syncopation',tp:[50,90,60,'The reading position for jazz guitar: learn it at a tempo where nothing is guessed.'],g:[srLineQ({leap:true,win:[5,8]}),srLineQ({leap:true,win:[5,8],rhy:1}),srLineQ({leap:true,win:[5,8],rhy:SR_SYNC}),srLineQ({leap:true,win:[5,8],rhy:1,bars:4,long:true})]}
```

#### Sight Reading 14: Swing eighths and pushes

- **Description:** Swung lines with pushes in fifth position
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in; swing the eighths. Keep going through a wrong note.” → answer: F4 G4 A4 B4 D5 C5 D5 E5 G5 F5 D5. (answered by **playing it on the guitar**; click at 90 bpm; 11 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: F4 – G4 – A4 – B4 – D5 – C5 – D5 – E5 – G5 – F5 – D5: F4 on string 5, fret 8; G4 on string 4, fret 5; A4 on string 4, fret 7; B4 on string 4, fret 9 (a stretch); D5 on string 3, fret 7; C5 on string 3, fret 5; D5 on string 3, fret 7; E5 on string 2, fret 5; G5 on string 2, fret 8; F5 on string 2, fret 6; D5 on string 3, fret 7.
- **Level note (the Details button):**
  - *What this level adds:* Swung lines with pushes, in fifth position.
  - *What to pay attention to:* Written even eighths are played long–short. / A quarter note that starts on an “and” is held through the next beat: do not play that beat.
  - *Theory and tips:* Reading swing is reading even eighths and playing them unevenly. Accent the off-beats lightly.
- **Source of the level (exact settings):**

```js
{n:'Swing eighths and pushes',d:'Swung lines with pushes in fifth position',tp:[80,120,90,'Swing eighths: under 80 they stop lilting and turn into a heavy triplet.'],g:[srLineQ({win:[5,8],rhy:SR_SWING,swing:true})]}
```

**Stage 4: Sight Reading 15–20**

#### Sight Reading 15: Ties into the beat

- **Description:** A note on the “and” tied into the next beat: the syncopation of every jazz chart; in C, fifth position
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going through a wrong note.” → answer: G5 F5 G5 F5 E5 C5. (answered by **playing it on the guitar**; click at 60 bpm; 6 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G5 – F5 – G5 – F5 – E5 – C5: G5 on string 2, fret 8; F5 on string 2, fret 6; G5 on string 2, fret 8; F5 on string 2, fret 6; E5 on string 2, fret 5; C5 on string 3, fret 5.
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'The figures a jazz chart is made of, read with pitches: ties into the beat, sixteenths, 6/8; and lines in seventh and ninth position in G, D, A♭ and E, where the ledger lines above the staff have to be read as fast as the notes inside it.']
- **Level note (the Details button):**
  - *What this level adds:* Syncopation: a note on the “and” tied into the next beat. You pick on the “and” and hold through the beat.
  - *What to pay attention to:* Do not pick on the beat the tie goes into: that silence of the picking hand is the figure. / The note after the tie usually lands on an “and” again, or on the next beat.
  - *Theory and tips:* The same rhythm is often printed as an eighth and a quarter: the tie and the longer value sound alike.
- **Source of the level (exact settings):**

```js
{n:'Ties into the beat',d:'A note on the “and” tied into the next beat: the syncopation of every jazz chart; in C, fifth position',tp:[50,80,60,'The tied note is felt, not played: a slow click makes the beat you do not pick audible.'],g:[srLineQ({win:[5,8],rhy:['q','ee','eqe','h','qe'],ties:1,tieOff:true})]}
```

#### Sight Reading 16: Seventh position; G and D

- **Description:** Frets 7–10: lines with rhythm, then in G and D
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position VII (frets 7–10) after the count-in. Keep going through a wrong note.” → answer: D6 B5 C6 A5 D5 E5 B4 C5. (answered by **playing it on the guitar**; click at 60 bpm; 8 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: D6 – B5 – C6 – A5 – D5 – E5 – B4 – C5: D6 on string 1, fret 10; B5 on string 1, fret 7; C6 on string 1, fret 8; A5 on string 2, fret 10; D5 on string 3, fret 7; E5 on string 3, fret 9; B4 on string 4, fret 9; C5 on string 4, fret 10.
  - **Generator 2**, sample: “Read the line in G major (1 sharp in the signature), rhythm included, and play it in position VII (frets 7–10) after the count-in. Keep going through a wrong note.” → answer: B4 C5 G5 F♯5 D5 F♯5 A5 E5. (answered by **playing it on the guitar**; click at 60 bpm; 8 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: B4 – C5 – G5 – F♯5 – D5 – F♯5 – A5 – E5: B4 on string 4, fret 9; C5 on string 4, fret 10; G5 on string 2, fret 8; F♯5 on string 2, fret 7; D5 on string 3, fret 7; F♯5 on string 2, fret 7; A5 on string 2, fret 10; E5 on string 3, fret 9.
  - **Generator 3**, sample: “Read the line, rhythm included, and play it in position VII (frets 7–10) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: F4 A4 F5 E5 C5 F5 E5 F5 B4 C5 F4 G4 A4 E4 F4 G4. (answered by **playing it on the guitar**; click at 60 bpm; 16 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: F4 – A4 – F5 – E5 – C5 – F5 – E5 – F5 – B4 – C5 – F4 – G4 – A4 – E4 – F4 – G4: F4 on string 5, fret 8; A4 on string 4, fret 7; F5 on string 3, fret 10; E5 on string 3, fret 9; C5 on string 4, fret 10; F5 on string 3, fret 10; E5 on string 3, fret 9; F5 on string 3, fret 10; B4 on string 4, fret 9; C5 on string 4, fret 10; F4 on string 5, fret 8; G4 on string 5, fret 10; A4 on string 4, fret 7; E4 
- **Level note (the Details button):**
  - *What this level adds:* Lines with rhythm in seventh position, frets 7 to 10; then lines in G and D there, and a line of four bars.
  - *What to pay attention to:* The lowest note is B on string 6; the first string reaches high D at fret 10. / G major: one sharp, F♯. D major: F♯ and C♯.
  - *Theory and tips:* Choose the string for each note before the count-in ends: up here a note is often one string lower than where the eye expects it.
- **Source of the level (exact settings):**

```js
{n:'Seventh position; G and D',d:'Frets 7–10: lines with rhythm, then in G and D',tp:[50,90,60,'A new position: the click at 60 while the hand learns it.'],g:[srLineQ({leap:true,win:[7,10],rhy:1}),srLineQ({leap:true,win:[7,10],rhy:1,key:['G','D']}),srLineQ({leap:true,win:[7,10],rhy:1,bars:4,long:true})]}
```

#### Sight Reading 17: Sixteenths

- **Description:** Four notes a click, and the eighth with two sixteenths; in C, fifth position, slow
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going through a wrong note.” → answer: B3 A3 C4 B3 A3 B3 A3 C4 B3. (answered by **playing it on the guitar**; click at 50 bpm; 9 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: B3 – A3 – C4 – B3 – A3 – B3 – A3 – C4 – B3: B3 on string 6, fret 7; A3 on string 6, fret 5; C4 on string 6, fret 8; B3 on string 6, fret 7; A3 on string 6, fret 5; B3 on string 6, fret 7; A3 on string 6, fret 5; C4 on string 6, fret 8; B3 on string 6, fret 7.
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going through a wrong note.” → answer: B4 G4 F4 A4 C5 B4 D5 F5 D5 C5 B4 A4 G4. (answered by **playing it on the guitar**; click at 50 bpm; 13 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: B4 – G4 – F4 – A4 – C5 – B4 – D5 – F5 – D5 – C5 – B4 – A4 – G4: B4 on string 4, fret 9 (a stretch); G4 on string 4, fret 5; F4 on string 5, fret 8; A4 on string 4, fret 7; C5 on string 3, fret 5; B4 on string 4, fret 9 (a stretch); D5 on string 3, fret 7; F5 on string 2, fret 6; D5 on string 3, fret 7; C5 on string 3, fret 5; B4 on string 4, fret 9 (a stretch); A4 on string 4, fret 7; G4 on string
- **Level note (the Details button):**
  - *What this level adds:* Sixteenth notes: four to a click, and the eighth with two sixteenths.
  - *What to pay attention to:* Alternate picking: down on the click and on the “and”, up on the two sixteenths between. / See the four sixteenths as one picture: the two beams over a beat.
  - *Theory and tips:* The microphone separates fast notes less well than slow ones: pick each one clearly and keep the tempo slow.
- **Source of the level (exact settings):**

```js
{n:'Sixteenths',d:'Four notes a click, and the eighth with two sixteenths; in C, fifth position, slow',tp:[40,60,50,'Four notes a click is at the edge of what the microphone separates: keep the click slow (50) and pick every note clearly.'],g:[srLineQ({win:[5,8],rhy:['q','ee','ssss','ess','sse','h'],cells:'s16'}),srLineQ({win:[5,8],rhy:['q','ee','ess','sse','des','sde'],cells:'s16b'})]}
```

#### Sight Reading 18: 6/8

- **Description:** Two beats a bar, each a dotted quarter of three eighths; in C, fifth position
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. The click is the dotted quarter : two clicks a bar. Keep going through a wrong note.” → answer: A4 G4 A4 B4. (answered by **playing it on the guitar**; click at 50 bpm; 4 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: A4 – G4 – A4 – B4: A4 on string 4, fret 7; G4 on string 4, fret 5; A4 on string 4, fret 7; B4 on string 4, fret 9 (a stretch).
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. The click is the dotted quarter : two clicks a bar. Keep going through a wrong note.” → answer: F5 E5 D5 B4 D5 F5 A5. (answered by **playing it on the guitar**; click at 50 bpm; 7 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: F5 – E5 – D5 – B4 – D5 – F5 – A5: F5 on string 1, fret 1 (a stretch); E5 on string 2, fret 5; D5 on string 2, fret 3; B4 on string 3, fret 4; D5 on string 2, fret 3; F5 on string 1, fret 1 (a stretch); A5 on string 1, fret 5.
- **Level note (the Details button):**
  - *What this level adds:* 6/8: two beats a bar, each a dotted quarter of three eighths. The click is the dotted quarter.
  - *What to pay attention to:* Count the eighths in threes, 1 2 3 4 5 6, with the click on 1 and 4. / A quarter and an eighth in one group is long-short; an eighth and a quarter is short-long.
  - *Theory and tips:* 6/8 and 3/4 hold the same six eighths: 6/8 groups them in two threes, 3/4 in three twos.
- **Source of the level (exact settings):**

```js
{n:'6/8',d:'Two beats a bar, each a dotted quarter of three eighths; in C, fifth position',tp:[40,66,50,'The click is the dotted quarter: three eighths to a click.'],g:[srLineQ({win:[5,8],meter:'6/8',rhy:'c68'}),srLineQ({win:[2,5],meter:'6/8',rhy:'c68'})]}
```

#### Sight Reading 19: A♭ and E

- **Description:** Four flats in position IV, four sharps in position VII
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line in A♭ major (4 flats in the signature), rhythm included, and play it in position IV (frets 4–7) after the count-in. Keep going through a wrong note.” → answer: A♭4 G4 C5 B♭4 F5 E♭5 G4 A♭4 C5 E♭5. (answered by **playing it on the guitar**; click at 60 bpm; 10 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: A♭4 – G4 – C5 – B♭4 – F5 – E♭5 – G4 – A♭4 – C5 – E♭5: A♭4 on string 4, fret 6; G4 on string 4, fret 5; C5 on string 3, fret 5; B♭4 on string 4, fret 8 (a stretch); F5 on string 2, fret 6; E♭5 on string 2, fret 4; G4 on string 4, fret 5; A♭4 on string 4, fret 6; C5 on string 3, fret 5; E♭5 on string 2, fret 4.
  - **Generator 2**, sample: “Read the line in E major (4 sharps in the signature), rhythm included, and play it in position VII (frets 7–10) after the count-in. Keep going through a wrong note.” → answer: C♯5 B4 E5 D♯5 C♯5 B4. (answered by **playing it on the guitar**; click at 60 bpm; 6 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: C♯5 – B4 – E5 – D♯5 – C♯5 – B4: C♯5 on string 4, fret 11 (a stretch); B4 on string 4, fret 9; E5 on string 3, fret 9; D♯5 on string 3, fret 8; C♯5 on string 4, fret 11 (a stretch); B4 on string 4, fret 9.
- **Level note (the Details button):**
  - *What this level adds:* Four flats and four sharps: A♭ major (B♭ E♭ A♭ D♭) in position IV and E major (F♯ C♯ G♯ D♯) in position VII.
  - *What to pay attention to:* Four altered letters: only three notes of the scale are natural. Say them before you start. / D♭ and D♯ look alike on the page; the signature tells you which.
  - *Theory and tips:* A♭ major and E major are a major third apart and share no sharps or flats: hold both signatures as pictures, not as lists.
- **Source of the level (exact settings):**

```js
{n:'A♭ and E',d:'Four flats in position IV, four sharps in position VII',tp:[50,90,60,'Four altered notes: only three notes of the scale are natural.'],g:[srLineQ({leap:true,win:[4,7],rhy:1,key:'Ab'}),srLineQ({leap:true,win:[7,10],rhy:1,key:'E'})]}
```

#### Sight Reading 20: Ninth position

- **Description:** Lines with rhythm in frets 9–12, the notes above the staff
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position IX (frets 9–12) after the count-in. Keep going through a wrong note.” → answer: A4 E4 F4 G4 B4 F4 G4 C5 B4 A5 G5. (answered by **playing it on the guitar**; click at 60 bpm; 11 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: A4 – E4 – F4 – G4 – B4 – F4 – G4 – C5 – B4 – A5 – G5: A4 on string 5, fret 12; E4 on string 6, fret 12; F4 on string 5, fret 8 (a stretch); G4 on string 5, fret 10; B4 on string 4, fret 9; F4 on string 5, fret 8 (a stretch); G4 on string 5, fret 10; C5 on string 4, fret 10; B4 on string 4, fret 9; A5 on string 2, fret 10; G5 on string 3, fret 12.
  - **Generator 2**, sample: “Read the line, rhythm included, and play it in position IX (frets 9–12) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: G5 E5 G5 D5 E5 G5 A5 B5 G5 A5 B5 E6 D6 G5 A5 D6 C6. (answered by **playing it on the guitar**; click at 60 bpm; 17 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: G5 – E5 – G5 – D5 – E5 – G5 – A5 – B5 – G5 – A5 – B5 – E6 – D6 – G5 – A5 – D6 – C6: G5 on string 3, fret 12; E5 on string 3, fret 9; G5 on string 3, fret 12; D5 on string 4, fret 12; E5 on string 3, fret 9; G5 on string 3, fret 12; A5 on string 2, fret 10; B5 on string 2, fret 12; G5 on string 3, fret 12; A5 on string 2, fret 10; B5 on string 2, fret 12; E6 on string 1, fret 12; D6 on string 1, fr
- **Level note (the Details button):**
  - *What this level adds:* Lines with rhythm in ninth position, and a line of four bars.
  - *What to pay attention to:* Frets are closer together up here; watch your intonation and finger spacing. / In C three notes lie at fret 8, a first-finger stretch: the hand stays at fret 9.
  - *Theory and tips:* The same line can be read an octave lower in position II. Hearing both is good practice.
- **Source of the level (exact settings):**

```js
{n:'Ninth position',d:'Lines with rhythm in frets 9–12, the notes above the staff',tp:[50,90,60,'High ledger lines are read slower than the staff: start at 60.'],g:[srLineQ({leap:true,win:[9,12],rhy:1}),srLineQ({leap:true,win:[9,12],rhy:1,bars:4,long:true})]}
```

**Stage 5: Sight Reading 21–29**

#### Sight Reading 21: A shift inside the line

- **Description:** The line starts in one position and ends in the next; the numeral over a note says where the hand moves
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line and play it from position V (frets 5–8); at the note marked II move the hand to position II (frets 2–5) and finish there. Count-in, then in time.” → answer: E4 C4 D4 C4 B3 G3 F3 G3 F3. (answered by **playing it on the guitar**; click at 56 bpm; 9 notes to play; strict time)
    - hint: Shift on the note before the marked one has finished: slide the first finger to the new fret while the old note still sounds.
    - explanation after answering: E4 – C4 – D4 – C4 – B3 – G3 – F3 – G3 – F3: E4 on string 5, fret 7; C4 on string 6, fret 8; D4 on string 5, fret 5; C4 on string 6, fret 8; B3 on string 6, fret 7; G3 on string 6, fret 3; F3 on string 6, fret 1 (a stretch); G3 on string 6, fret 3; F3 on string 6, fret 1 (a stretch).
  - **Generator 2**, sample: “Read the line and play it from position V (frets 5–8); at the note marked VII move the hand to position VII (frets 7–10) and finish there. Count-in, then in time.” → answer: E5 F5 A5 C6 D6 C6 B5 D6 C6. (answered by **playing it on the guitar**; click at 56 bpm; 9 notes to play; strict time)
    - hint: Shift on the note before the marked one has finished: slide the first finger to the new fret while the old note still sounds.
    - explanation after answering: E5 – F5 – A5 – C6 – D6 – C6 – B5 – D6 – C6: E5 on string 2, fret 5; F5 on string 2, fret 6; A5 on string 1, fret 5; C6 on string 1, fret 8; D6 on string 1, fret 10; C6 on string 1, fret 8; B5 on string 1, fret 7; D6 on string 1, fret 10; C6 on string 1, fret 8.
  - **Generator 3**, sample: “Read the line and play it from position IX (frets 9–12); at the note marked VII move the hand to position VII (frets 7–10) and finish there. Count-in, then in time.” → answer: F4 G4 E4 C4 B3 C4 B3. (answered by **playing it on the guitar**; click at 56 bpm; 7 notes to play; strict time)
    - hint: Shift on the note before the marked one has finished: slide the first finger to the new fret while the old note still sounds.
    - explanation after answering: F4 – G4 – E4 – C4 – B3 – C4 – B3: F4 on string 5, fret 8 (a stretch); G4 on string 5, fret 10; E4 on string 6, fret 12; C4 on string 6, fret 8 (a stretch); B3 on string 6, fret 7; C4 on string 6, fret 8; B3 on string 6, fret 7.
- **Why it is in the goal (ⓘ text of its step):** ['map', 'From a line to a page: a shift of position inside the line, cut time, quarter-note and broken triplets, four and eight bars without stopping, tunes as pages, sixteen bars over the changes of a standard, the road map with pitches, a whole 32-bar chorus. On a chart the eyes are always a bar ahead.']
- **Level note (the Details button):**
  - *What this level adds:* A shift inside the line: start in one position and finish in the next. The numeral over a note is the position from that note on.
  - *What to pay attention to:* Move the hand while the note before the marked one is still sounding, not after it. / Slide the first finger to the new position's fret; the other fingers follow.
  - *Theory and tips:* Shift on a step where you can: the move is short and the ear covers it. / The hand moves only where the range forces it: every note the first position reaches, stretches included, is played there. The numeral sits on the first note it cannot reach.
- **Source of the level (exact settings):**

```js
{n:'A shift inside the line',d:'The line starts in one position and ends in the next; the numeral over a note says where the hand moves',tp:[50,80,56,'A shift needs a moment: the slower click leaves it.'],g:[srShiftQ({wins:[[2,5],[5,8]]}),srShiftQ({wins:[[5,8],[7,10]]}),srShiftQ({wins:[[7,10],[9,12]]})]}
```

#### Sight Reading 22: Cut time

- **Description:** Two half-note beats a bar: the click is the half note; in C, fifth position
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Cut time: the click is the half note , two clicks a bar. Keep going through a wrong note.” → answer: A4 G4 E4 D4 E4 G4 A4. (answered by **playing it on the guitar**; click at 50 bpm; 7 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: A4 – G4 – E4 – D4 – E4 – G4 – A4: A4 on string 4, fret 7; G4 on string 4, fret 5; E4 on string 5, fret 7; D4 on string 5, fret 5; E4 on string 5, fret 7; G4 on string 4, fret 5; A4 on string 4, fret 7.
- **Level note (the Details button):**
  - *What this level adds:* Cut time, the C with a line through it: 4/4 counted in two. The click is the half note.
  - *What to pay attention to:* A quarter note is half a click; eighths are four to a click. / Cut time is fast music read slowly: the same page, half the clicks.
  - *Theory and tips:* Marches, sambas and fast swing charts are often written in cut time.
- **Source of the level (exact settings):**

```js
{n:'Cut time',d:'Two half-note beats a bar: the click is the half note; in C, fifth position',tp:[40,70,50,'The click is the half note: 50 is a quarter note at 100.'],g:[srLineQ({win:[5,8],meter:'C|',rhy:['h','q','ee','w','qe','eqe']})]}
```

#### Sight Reading 23: Quarter-note and broken triplets

- **Description:** Three quarters over two clicks, and a triplet with a rest inside; in C, fifth position
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going through a wrong note.” → answer: G4 B4 C5 A4 G4 E4 F4 G4 E4 G4. (answered by **playing it on the guitar**; click at 60 bpm; 10 notes to play; strict time)
    - hint: Name every note during the count-in; keep the hand in position.
    - explanation after answering: G4 – B4 – C5 – A4 – G4 – E4 – F4 – G4 – E4 – G4: G4 on string 4, fret 5; B4 on string 4, fret 9 (a stretch); C5 on string 3, fret 5; A4 on string 4, fret 7; G4 on string 4, fret 5; E4 on string 5, fret 7; F4 on string 5, fret 8; G4 on string 4, fret 5; E4 on string 5, fret 7; G4 on string 4, fret 5.
- **Level note (the Details button):**
  - *What this level adds:* Quarter-note triplets, three even notes over two clicks; and broken triplets, a triplet with a rest inside.
  - *What to pay attention to:* The second note of a quarter-note triplet falls between the clicks, the third just before the next click. / In a broken triplet the rest is still counted: the notes after it keep their triplet places.
  - *Theory and tips:* Feel the quarter-note triplet as eighth-note triplets with every other note played.
- **Source of the level (exact settings):**

```js
{n:'Quarter-note and broken triplets',d:'Three quarters over two clicks, and a triplet with a rest inside; in C, fifth position',tp:[50,80,60,'A quarter-note triplet crosses the click: a slow click makes the crossing audible.'],g:[srLineQ({win:[5,8],rhy:['q','h','qtrip','trn','tnr','tnrn','trip'],cells:'tq'})]}
```

#### Sight Reading 24: Four bars

- **Description:** One line of four bars: rhythm in three positions with keys and a tie, 3/4, swing eighths, an accidental with a natural, 6/8; reading must not stop (a note or two may go unheard, a wrong note fails)
- **Input:** guitar
- **Kind:** round level, 7 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: E4 G4 A4 G4 B4 E4 F4 E4 C4 F4 E4 A4 G4 C5 B4 C5 D5 G5 F5. (answered by **playing it on the guitar**; click at 60 bpm; 19 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: E4 – G4 – A4 – G4 – B4 – E4 – F4 – E4 – C4 – F4 – E4 – A4 – G4 – C5 – B4 – C5 – D5 – G5 – F5: E4 on string 4, fret 2; G4 on string 3, fret 0; A4 on string 3, fret 2; G4 on string 3, fret 0; B4 on string 2, fret 0; E4 on string 4, fret 2; F4 on string 4, fret 3; E4 on string 4, fret 2; C4 on string 5, fret 3; F4 on string 4, fret 3; E4 on string 4, fret 2; A4 on string 3, fret 2; G4 on string 3, fr
  - **Generator 2**, sample: “Read the line in F major (1 flat in the signature), rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: G5 F5 D5 C5 G4 A4 B♭4 D5 F5 B♭5 A5 C6 B♭5 C6 B♭5 G5 A5 G5 A4 B♭4 C5. (answered by **playing it on the guitar**; click at 60 bpm; 21 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: G5 – F5 – D5 – C5 – G4 – A4 – B♭4 – D5 – F5 – B♭5 – A5 – C6 – B♭5 – C6 – B♭5 – G5 – A5 – G5 – A4 – B♭4 – C5: G5 on string 2, fret 8; F5 on string 2, fret 6; D5 on string 3, fret 7; C5 on string 3, fret 5; G4 on string 4, fret 5; A4 on string 4, fret 7; B♭4 on string 4, fret 8; D5 on string 3, fret 7; F5 on string 2, fret 6; B♭5 on string 1, fret 6; A5 on string 1, fret 5; C6 on string 1, fret 8; B
  - **Generator 3**, sample: “Read the line in G major (1 sharp in the signature), rhythm included, and play it in position VII (frets 7–10) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: F♯5 E5 C5 B4 G4 C5 B4 G4 B4 A4 A5 G5 D6 C6 B5 C6 D6 B5 C6 A5 D5. (answered by **playing it on the guitar**; click at 60 bpm; 21 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: F♯5 – E5 – C5 – B4 – G4 – C5 – B4 – G4 – B4 – A4 – A5 – G5 – D6 – C6 – B5 – C6 – D6 – B5 – C6 – A5 – D5: F♯5 on string 2, fret 7; E5 on string 3, fret 9; C5 on string 4, fret 10; B4 on string 4, fret 9; G4 on string 5, fret 10; C5 on string 4, fret 10; B4 on string 4, fret 9; G4 on string 5, fret 10; B4 on string 4, fret 9; A4 on string 4, fret 7; A5 on string 2, fret 10; G5 on string 2, fret 8; D
  - **Generator 4**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: A5 G5 D5 E5 D5 C5 D5 C5. (answered by **playing it on the guitar**; click at 60 bpm; 8 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: A5 – G5 – D5 – E5 – D5 – C5 – D5 – C5: A5 on string 1, fret 5; G5 on string 1, fret 3; D5 on string 2, fret 3; E5 on string 2, fret 5; D5 on string 2, fret 3; C5 on string 3, fret 5; D5 on string 2, fret 3; C5 on string 3, fret 5.
  - **Generator 5**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in; swing the eighths. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: C6 G5 A5 C6 B5 F5 G5 B5 G5 F5 G4 A4 B4 G4 D4 E4 C5 B4 G4 A3 B3. (answered by **playing it on the guitar**; click at 60 bpm; 21 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: C6 – G5 – A5 – C6 – B5 – F5 – G5 – B5 – G5 – F5 – G4 – A4 – B4 – G4 – D4 – E4 – C5 – B4 – G4 – A3 – B3: C6 on string 1, fret 8; G5 on string 2, fret 8; A5 on string 1, fret 5; C6 on string 1, fret 8; B5 on string 1, fret 7; F5 on string 2, fret 6; G5 on string 2, fret 8; B5 on string 1, fret 7; G5 on string 2, fret 8; F5 on string 2, fret 6; G4 on string 4, fret 5; A4 on string 4, fret 7; B4 on st
  - **Generator 6**, sample: “Read the line, rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: G3 C4 B3 D4 B3 F3 G3 B3 F3 G3 A3 C4 E4 C♯4 D4 C4 B3. (answered by **playing it on the guitar**; click at 60 bpm; 17 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: G3 – C4 – B3 – D4 – B3 – F3 – G3 – B3 – F3 – G3 – A3 – C4 – E4 – C♯4 – D4 – C4 – B3: G3 on string 6, fret 3; C4 on string 5, fret 3; B3 on string 5, fret 2; D4 on string 4, fret 0; B3 on string 5, fret 2; F3 on string 6, fret 1; G3 on string 6, fret 3; B3 on string 5, fret 2; F3 on string 6, fret 1; G3 on string 6, fret 3; A3 on string 5, fret 0; C4 on string 5, fret 3; E4 on string 4, fret 2; C♯4
  - **Generator 7**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. The click is the dotted quarter : two clicks a bar. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line. Tempo: 56 .” → answer: A5 G5 C5 D5 C5 E5 C5 F5 E5. (answered by **playing it on the guitar**; click at 56 bpm; 9 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: A5 – G5 – C5 – D5 – C5 – E5 – C5 – F5 – E5: A5 on string 1, fret 5; G5 on string 2, fret 8; C5 on string 3, fret 5; D5 on string 3, fret 7; C5 on string 3, fret 5; E5 on string 2, fret 5; C5 on string 3, fret 5; F5 on string 2, fret 6; E5 on string 2, fret 5.
- **Level note (the Details button):**
  - *What this level adds:* Four bars at one go: everything so far, mixed. Reading must not stop. The lines: rhythm in first, fifth and seventh position with keys and a tie; 3/4; swing eighths; an accidental with a natural; 6/8 at 56 at most.
  - *What to pay attention to:* Look one bar ahead: while you play bar 1, read bar 2. / A note or two may go unheard by the microphone; a wrong note fails the line, so keep to the position.
  - *Theory and tips:* If you get lost, find beat 1 of the next bar and come in there. Coming back in is part of sight reading.
- **Source of the level (exact settings):**

```js
{n:'Four bars',d:'One line of four bars: rhythm in three positions with keys and a tie, 3/4, swing eighths, an accidental with a natural, 6/8; reading must not stop (a note or two may go unheard, a wrong note fails)',tp:[50,90,60,'Four bars at one go: the tempo where you never stop, not the fastest you can manage.'],g:[srLineQ({leap:true,win:[0,3],rhy:SR_MIX,bars:4,long:true,ties:1}),srLineQ({leap:true,win:[5,8],rhy:SR_MIX,bars:4,long:true,ties:1,key:['G','F','D','Bb']}),srLineQ({leap:true,win:[7,10],rhy:SR_MIX,bars:4,long:true,ties:1,key:['G','D','A']}),srLineQ({leap:true,win:[2,5],meter:'3/4',rhy:['q','h','dh','ee','qe'],bars:4,long:true}),srLineQ({leap:true,win:[5,8],rhy:SR_SWING,swing:true,bars:4,long:true}),srLineQ({leap:true,win:[0,4],rhy:1,chrom:true,nat:true,bars:4,long:true}),srLineQ({leap:true,win:[5,8],meter:'6/8',rhy:'c68',bars:4,long:true,cap:56})]}
```

#### Sight Reading 25: Eight bars

- **Description:** Two lines of four bars from everything: keys and ties, 3/4, swing, an accidental with a natural, 6/8, sixteenths, cut time, quarter-note triplets; the eyes jump to the next line without a break
- **Input:** guitar
- **Kind:** round level, 10 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Read the line, rhythm included, and play it in first position (frets 0–3) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: D4 B3 F3 G3 D4 C4 D4 C4 B3 A3 B3 F3 G3 A3 B3 G3 E3 F3 G3 C4 B3 C4 A4 G4 E4 F4 A4 F4 B4 A4 D5 C5 B4 G5 F5 G5 E5 E4. (answered by **playing it on the guitar**; click at 60 bpm; 38 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: D4 – B3 – F3 – G3 – D4 – C4 – D4 – C4 – B3 – A3 – B3 – F3 – G3 – A3 – B3 – G3 – E3 – F3 – G3 – C4 – B3 – C4 – A4 – G4 – E4 – F4 – A4 – F4 – B4 – A4 – D5 – C5 – B4 – G5 – F5 – G5 – E5 – E4: D4 on string 4, fret 0; B3 on string 5, fret 2; F3 on string 6, fret 1; G3 on string 6, fret 3; D4 on string 4, fret 0; C4 on string 5, fret 3; D4 on string 4, fret 0; C4 on string 5, fret 3; B3 on string 5, fre
  - **Generator 2**, sample: “Read the line in B♭ major (2 flats in the signature), rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: D5 E♭5 G5 B♭5 A5 F5 G5 B♭5 F5 G5 D5 E♭5 F5 G5 B♭5 G5 A5 G5 E♭5 D5 A4 B♭4 D5 E♭5 C5 D5 F5 A5 B♭5 A5 C6. (answered by **playing it on the guitar**; click at 60 bpm; 31 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: D5 – E♭5 – G5 – B♭5 – A5 – F5 – G5 – B♭5 – F5 – G5 – D5 – E♭5 – F5 – G5 – B♭5 – G5 – A5 – G5 – E♭5 – D5 – A4 – B♭4 – D5 – E♭5 – C5 – D5 – F5 – A5 – B♭5 – A5 – C6: D5 on string 3, fret 7; E♭5 on string 3, fret 8; G5 on string 2, fret 8; B♭5 on string 1, fret 6; A5 on string 1, fret 5; F5 on string 2, fret 6; G5 on string 2, fret 8; B♭5 on string 1, fret 6; F5 on string 2, fret 6; G5 on string 2, fr
  - **Generator 3**, sample: “Read the line in E major (4 sharps in the signature), rhythm included, and play it in position VII (frets 7–10) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: B3 E4 D♯4 C♯4 A4 G♯4 B4 D♯5 C♯5 D♯5 E5 C♯5 D♯5 C♯5 F♯5 E5 F♯5 G♯5 A5 C♯6 A5 B5 F♯5 G♯5 F♯5 E5 A4 B4 A4 G♯4 E4 F♯4 E4 F♯4 C♯4 D♯4. (answered by **playing it on the guitar**; click at 60 bpm; 36 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: B3 – E4 – D♯4 – C♯4 – A4 – G♯4 – B4 – D♯5 – C♯5 – D♯5 – E5 – C♯5 – D♯5 – C♯5 – F♯5 – E5 – F♯5 – G♯5 – A5 – C♯6 – A5 – B5 – F♯5 – G♯5 – F♯5 – E5 – A4 – B4 – A4 – G♯4 – E4 – F♯4 – E4 – F♯4 – C♯4 – D♯4: B3 on string 6, fret 7; E4 on string 5, fret 7; D♯4 on string 6, fret 11 (a stretch); C♯4 on string 6, fret 9; A4 on string 4, fret 7; G♯4 on string 5, fret 11 (a stretch); B4 on string 4, fret 9; D♯5
  - **Generator 4**, sample: “Read the line, rhythm included, and play it in position II (frets 2–5) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: E4 D4 E4 B4 A4 G4 F4 A4 C5 E5 F5 G5 A5 F5 D5 E4 F4 A4 F4 A4 C5. (answered by **playing it on the guitar**; click at 60 bpm; 21 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: E4 – D4 – E4 – B4 – A4 – G4 – F4 – A4 – C5 – E5 – F5 – G5 – A5 – F5 – D5 – E4 – F4 – A4 – F4 – A4 – C5: E4 on string 4, fret 2; D4 on string 5, fret 5; E4 on string 4, fret 2; B4 on string 3, fret 4; A4 on string 3, fret 2; G4 on string 4, fret 5; F4 on string 4, fret 3; A4 on string 3, fret 2; C5 on string 3, fret 5; E5 on string 2, fret 5; F5 on string 1, fret 1 (a stretch); G5 on string 1, fret
  - **Generator 5**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in; swing the eighths. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: F4 C4 D4 A3 B3 C4 D4 C4 A3 B3 E4 D4 E4 D4 A4 G4 A4 D5 C5 E5 F5 C6 B5 A5 B5 C6 B5 A5 G5 C5 D5 B4 A4 F4 A4 E4 F4 G4 B4 G5 F5 G5 A5. (answered by **playing it on the guitar**; click at 60 bpm; 43 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: F4 – C4 – D4 – A3 – B3 – C4 – D4 – C4 – A3 – B3 – E4 – D4 – E4 – D4 – A4 – G4 – A4 – D5 – C5 – E5 – F5 – C6 – B5 – A5 – B5 – C6 – B5 – A5 – G5 – C5 – D5 – B4 – A4 – F4 – A4 – E4 – F4 – G4 – B4 – G5 – F5 – G5 – A5: F4 on string 5, fret 8; C4 on string 6, fret 8; D4 on string 5, fret 5; A3 on string 6, fret 5; B3 on string 6, fret 7; C4 on string 6, fret 8; D4 on string 5, fret 5; C4 on string 6, fr
  - **Generator 6**, sample: “Read the line, rhythm included, and play it in first position (frets 0–4) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line.” → answer: A4 G4 B4 F4 G4 B3 C4 E4 B3 C4 B3 F♯3 G3 E3 F3 G3 E4 D4 F4 E4 D4 C4 G3 A3 B3 C4 A3 D4 C4 D4 E3 F3 G3 A3 E4. (answered by **playing it on the guitar**; click at 60 bpm; 35 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: A4 – G4 – B4 – F4 – G4 – B3 – C4 – E4 – B3 – C4 – B3 – F♯3 – G3 – E3 – F3 – G3 – E4 – D4 – F4 – E4 – D4 – C4 – G3 – A3 – B3 – C4 – A3 – D4 – C4 – D4 – E3 – F3 – G3 – A3 – E4: A4 on string 3, fret 2; G4 on string 3, fret 0; B4 on string 2, fret 0; F4 on string 4, fret 3; G4 on string 3, fret 0; B3 on string 5, fret 2; C4 on string 5, fret 3; E4 on string 4, fret 2; B3 on string 5, fret 2; C4 on str
  - **Generator 7**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. The click is the dotted quarter : two clicks a bar. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line. Tempo: 56 .” → answer: G4 F4 G4 A4 B4 C5 A4 C5 A5 G5 C6 B5 G5 A5 B5 G5 A5 G5 D5 E5 A5 G5 A5 D5 E5 F5 E5 G4 A4 B4 D5. (answered by **playing it on the guitar**; click at 56 bpm; 31 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: G4 – F4 – G4 – A4 – B4 – C5 – A4 – C5 – A5 – G5 – C6 – B5 – G5 – A5 – B5 – G5 – A5 – G5 – D5 – E5 – A5 – G5 – A5 – D5 – E5 – F5 – E5 – G4 – A4 – B4 – D5: G4 on string 4, fret 5; F4 on string 5, fret 8; G4 on string 4, fret 5; A4 on string 4, fret 7; B4 on string 4, fret 9 (a stretch); C5 on string 3, fret 5; A4 on string 4, fret 7; C5 on string 3, fret 5; A5 on string 1, fret 5; G5 on string 2, fr
  - **Generator 8**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line. Tempo: 56 .” → answer: A5 G5 E5 D5 C5 B4 E4 F4 E4 F4 G4 F4 G4 A4 B4 A4 E5 D5 E5 D5 A4 B4 A4 C5 F5 E5 G5 E5 F5 G5 F5 E5 G5 A5 G5 D5 E5 F5 G5 F5 C5 D5 F5 E5 D5 C5 E5 C6 B5 C6 B5 A5 E5 F5 E5 D5 E5 F5 E5 D5 C5 B4 C5 D5 G4 A4 F4 B3 C4 D4 F4 A4 C5 A5 G5 A5 F5 B5 A5 F5 D5 E5. (answered by **playing it on the guitar**; click at 56 bpm; 82 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: A5 – G5 – E5 – D5 – C5 – B4 – E4 – F4 – E4 – F4 – G4 – F4 – G4 – A4 – B4 – A4 – E5 – D5 – E5 – D5 – A4 – B4 – A4 – C5 – F5 – E5 – G5 – E5 – F5 – G5 – F5 – E5 – G5 – A5 – G5 – D5 – E5 – F5 – G5 – F5 – C5 – D5 – F5 – E5 – D5 – C5 – E5 – C6 – B5 – C6 – B5 – A5 – E5 – F5 – E5 – D5 – E5 – F5 – E5 – D5 – C5 – B4 – C5 – D5 – G4 – A4 – F4 – B3 – C4 – D4 – F4 – A4 – C5 – A5 – G5 – A5 – F5 – B5 – A5 – F5 – 
  - **Generator 9**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Cut time: the click is the half note , two clicks a bar. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line. Tempo: 56 .” → answer: E4 B3 C4 D4 G4 F4 G4 F4 E4 G4 E4 B4 A4 F4 D4 F4 G4 A4 G4 A4 D5 C5 E5 A4 B4 A4 F4 C5 B4 G4. (answered by **playing it on the guitar**; click at 56 bpm; 30 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: E4 – B3 – C4 – D4 – G4 – F4 – G4 – F4 – E4 – G4 – E4 – B4 – A4 – F4 – D4 – F4 – G4 – A4 – G4 – A4 – D5 – C5 – E5 – A4 – B4 – A4 – F4 – C5 – B4 – G4: E4 on string 5, fret 7; B3 on string 6, fret 7; C4 on string 6, fret 8; D4 on string 5, fret 5; G4 on string 4, fret 5; F4 on string 5, fret 8; G4 on string 4, fret 5; F4 on string 5, fret 8; E4 on string 5, fret 7; G4 on string 4, fret 5; E4 on strin
  - **Generator 10**, sample: “Read the line, rhythm included, and play it in position V (frets 5–8) after the count-in. Keep going : one note in sixteen may go unheard and a few may be late; a wrong note fails the line. Tempo: 56 .” → answer: C4 A3 B3 C4 B3 D4 F4 D5 C5 F5 E5 D5 A4 B4 A4 F4 G4 D4 E4 C4 E4 G4 A4 E4 F4 E4 D4 C4 F4 E4 A4 G4 A4 B4 A4 B4 B5 A5 G5 A5 C6 B5 A5 B5 F5 G5 A5 G5 F5 D5 D4 E4 B3 C4 D4. (answered by **playing it on the guitar**; click at 56 bpm; 55 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Look a bar ahead. If you get lost, come back in on the next beat 1.
    - explanation after answering: C4 – A3 – B3 – C4 – B3 – D4 – F4 – D5 – C5 – F5 – E5 – D5 – A4 – B4 – A4 – F4 – G4 – D4 – E4 – C4 – E4 – G4 – A4 – E4 – F4 – E4 – D4 – C4 – F4 – E4 – A4 – G4 – A4 – B4 – A4 – B4 – B5 – A5 – G5 – A5 – C6 – B5 – A5 – B5 – F5 – G5 – A5 – G5 – F5 – D5 – D4 – E4 – B3 – C4 – D4: C4 on string 6, fret 8; A3 on string 6, fret 5; B3 on string 6, fret 7; C4 on string 6, fret 8; B3 on string 6, fret 7; D4 on 
- **Level note (the Details button):**
  - *What this level adds:* Eight bars on two lines: the eyes jump to the start of the next line without a break. The lines mix everything: keys and ties, 3/4, swing eighths, an accidental with a natural, and at 56 at most 6/8, sixteenths, cut time and quarter-note triplets.
  - *What to pay attention to:* Before the end of the first line, look at the first bar of the second. / Keep the tempo steady through the line turn.
  - *Theory and tips:* A page is read in phrases of two and four bars: phrases end on long notes and rests, which give time to look ahead.
- **Source of the level (exact settings):**

```js
{n:'Eight bars',d:'Two lines of four bars from everything: keys and ties, 3/4, swing, an accidental with a natural, 6/8, sixteenths, cut time, quarter-note triplets; the eyes jump to the next line without a break',tp:[50,90,60,'Eight bars: keep the tempo where the line turn costs nothing.'],g:[srLineQ({leap:true,win:[0,3],rhy:SR_MIX,bars:8,long:true,ties:2}),srLineQ({leap:true,win:[5,8],rhy:SR_MIX,bars:8,long:true,ties:2,key:['G','F','D','Bb','A','Eb']}),srLineQ({leap:true,win:[7,10],rhy:SR_MIX,bars:8,long:true,ties:2,key:['G','D','E','Ab']}),srLineQ({leap:true,win:[2,5],meter:'3/4',rhy:['q','h','dh','ee','qe'],bars:8,long:true}),srLineQ({leap:true,win:[5,8],rhy:SR_SWING,swing:true,bars:8,long:true}),srLineQ({leap:true,win:[0,4],rhy:1,chrom:true,nat:true,bars:8,long:true}),srLineQ({leap:true,win:[5,8],meter:'6/8',rhy:'c68',bars:8,long:true,cap:56}),srLineQ({leap:true,win:[5,8],rhy:['q','ee','ssss','ess','sse','h'],cells:'s16',bars:8,long:true,cap:56}),srLineQ({leap:true,win:[5,8],meter:'C|',rhy:['h','q','ee','w','qe','eqe'],bars:8,long:true,cap:56}),srLineQ({leap:true,win:[5,8],rhy:['q','h','qtrip','trn','tnr','tnrn','trip'],cells:'tq',bars:8,long:true,cap:56})]}
```

#### Sight Reading 26: Tunes you may know

- **Description:** Traditional tunes written out as pages, in a key and position that hold the whole tune; a repeated note is graded once
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Auld Lang Syne (traditional) in D major , position VII (frets 7–10). A note repeated at the same pitch is graded once: play every written note; the microphone counts the first of each run. After the count-in, keep going: a note or two may go unheard, a wrong note fails.” → answer: A4 D5 F♯5 E5 D5 E5 F♯5 D5 F♯5 A5 B5 A5 F♯5 D5 E5 D5 E5 F♯5 D5 B4 A4 D5. (answered by **playing it on the guitar**; click at 72 bpm; 22 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: You may know the tune: read it anyway. The page decides the rhythm, not your memory of it.
    - explanation after answering: Auld Lang Syne in D major, position VII.
- **Level note (the Details button):**
  - *What this level adds:* Whole tunes on the page: traditional melodies written out in a key and position that hold all of them, some in 3/4 and 6/8, some with a pickup.
  - *What to pay attention to:* A pickup is the note or notes before the first full bar: the count-in counts them in. / Read it, do not play it from memory: the page says the rhythm, and it may not be the version you know.
  - *Theory and tips:* A note repeated at the same pitch is graded once (the microphone cannot hear the same pitch struck twice): still play every written note.
- **Source of the level (exact settings):**

```js
{n:'Tunes you may know',d:'Traditional tunes written out as pages, in a key and position that hold the whole tune; a repeated note is graded once',tp:[60,100,72,'A whole tune at one go: a walking tempo where the page, not your memory, sets the rhythm.'],g:[srTuneQ({})]}
```

#### Sight Reading 27: Sixteen bars

- **Description:** A sixteen-bar reading piece written on the changes of a standard, chord symbols above: a lead sheet to read, not the tune
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “16 bars on the changes of Blue Bossa , in position IV–V (frets 4–8). The chords are the tune’s; the melody is written by the app. After the count-in, keep going: a note or two may go unheard, a wrong note fails.” → answer: G5 A♭5 B♭5 C6 B♭5 A♭5 G5 A♭5 F5 G5 A♭5 C6 A♭5 B♭5 B5 C6 B5 A♭5 G5 A♭5 B♭5 C6 B♭5 A♭5 G5 G♭5 F5 G♭5 A♭5 B♭5 G♭5 A♭5 G♭5 A♭5 C6 B♭5 G5 A♭5 F5 D♭5 F5 E♭5 F5 G5 A♭5 F5 G5 F5 G5 E♭5 F5 G5 B♭5 C6 B♭5 A♭5 F5. (answered by **playing it on the guitar**; click at 80 bpm; 57 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Phrases are two and four bars long and end on a long note: use the long notes to look ahead.
    - explanation after answering: On the changes of Blue Bossa.
- **Level note (the Details button):**
  - *What this level adds:* Sixteen bars written on the chord changes of a standard, laid out like a lead sheet: four bars a line, the chords above.
  - *What to pay attention to:* Phrases are two and four bars long and end on a long note: use the long notes to look ahead. / Strong beats land on chord tones: the chord symbol tells you which notes to expect.
  - *Theory and tips:* The melody is the app's, not the tune's: only the chords come from the standard. It is reading material, not a tune to learn.
- **Source of the level (exact settings):**

```js
{n:'Sixteen bars',d:'A sixteen-bar reading piece written on the changes of a standard, chord symbols above: a lead sheet to read, not the tune',tp:[60,110,80,'Sixteen bars of eighths and syncopations: the tempo where every bar is read, not guessed.'],g:[srFormQ({forms:SR_FORMS16,bars:16})]}
```

#### Sight Reading 28: The road map

- **Description:** A page with repeats, two endings, the sign and the coda: the notes in the order the signs say
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Follow the road : 11 bars from 8 written. The first time, play the 1st ending and go back. The second time, skip the 1st ending and play the 2nd. Play it in that order after the count-in. A wrong turn plays wrong notes.” → answer: C5 A4 F4 E4 D4 C4 B3 A3 B3 A3 C5 A4 F4 E4 D4 C4 B3 A3 B3 D4 E4 G4 F4 E4 G4 A4 G4 A4 G4 A4 C5 E5 F5 A5. (answered by **playing it on the guitar**; click at 66 bpm; 34 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Before the count-in, find every sign on the page and say the order of the bars to yourself.
    - explanation after answering: Played order: bars 1 2 3 4 1 2 3 5 6 7 8.
- **Level note (the Details button):**
  - *What this level adds:* A page with repeats, first and second endings, the sign and the coda: the notes are played in the order the signs say.
  - *What to pay attention to:* Before the count-in, find every sign and say the order of the bars. / Every written bar is different: a wrong turn plays wrong notes.
  - *Theory and tips:* Before a jump the bar ends on a long note or a rest: that is where the eyes move to the next place.
- **Source of the level (exact settings):**

```js
{n:'The road map',d:'A page with repeats, two endings, the sign and the coda: the notes in the order the signs say',tp:[50,90,66,'A jump needs a glance ahead: keep the tempo where you can look for the next sign.'],g:[srRoadQ({charts:['rep','rep2','end1','end2','dcfine','dsfine','dscoda','dccoda','full']})]}
```

#### Sight Reading 29: A 32-bar page

- **Description:** A whole chorus written on the changes of a standard, AABA or AABC, swing: the A section returns, the bridge goes higher
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “32 bars on the changes of Satin Doll , in position IV–V (frets 4–8), the bridge in VII (frets 7–11), swing . The chords are the tune’s; the melody is written by the app. After the count-in, keep going: a note or two may go unheard, a wrong note fails.” → answer: F5 G5 F5 D5 F5 D5 E5 G5 E5 D5 B4 D5 E5 G5 F5 D5 C♭5 D♭5 C♭5 D♭5 E5 G5 F5 E5 G5 E5 F5 G5 F5 D5 F5 D5 E5 G5 E5 D5 B4 D5 E5 G5 F5 D5 C♭5 D♭5 C♭5 D♭5 E5 G5 F5 E5 G5 E5 G5 B♭5 C6 B♭5 C6 B♭5 C6 A5 B5 A5 G5 A5 B5 A5 C6 A5 F5 G5 A5 B5 C6 D6 F5 G5 F5 D5 F5 D5 E5 G5 E5 D5 B4 D5 E5 G5 F5 D5 C♭5 D♭5 C♭5 D♭5 E5 G5 F5 E5 G5 E5. (answered by **playing it on the guitar**; click at 100 bpm; 100 notes to play; strict time; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Phrases are two and four bars long and end on a long note: use the long notes to look ahead.
    - explanation after answering: On the changes of Satin Doll.
- **Level note (the Details button):**
  - *What this level adds:* A whole 32-bar chorus on the changes of a standard, swing: the A section comes back, the bridge goes higher, into position VII.
  - *What to pay attention to:* When the A comes back it is the same music: recognise it, and read ahead into the place where it changes. / The bridge moves the hand up to position VII; plan the move during the last bar of the second A.
  - *Theory and tips:* Thirty-two bars is where reading becomes stamina: keep the time and keep going through mistakes to the last bar.
- **Source of the level (exact settings):**

```js
{n:'A 32-bar page',d:'A whole chorus written on the changes of a standard, AABA or AABC, swing: the A section returns, the bridge goes higher',tp:[80,120,100,'Swing at a walking tempo: under 80 the eighths stop swinging; over 120 the swung eighths come closer together than the microphone separates reliably (tested). The page is 32 bars: choose a tempo you can hold to the end.'],g:[srFormQ({forms:SR_FORMS32,bars:32,swing:true})]}
```

### Rhythm Dictation (`rhydict`)

- **What the game is:** Hear a bar of rhythm with the click (later two) and write it down value by value: whole notes to sixteenths, rests, ties and dots, syncopation, triplets of every size, 3/4, 6/8 and swing. The figures come in the order Reading Rhythm teaches them.
- **Area:** By ear · on paper · **course** 201 · **badge** life, core · **input:** screen
- **Master standard:** accuracy 90 % (any bar heard once or twice written down exactly: where every note starts and where the silences are)
- **Lesson card, how to practise:** Count the clicks out loud while the bar plays: 1 & 2 & 3 & 4 &. / Mark where the notes start against the clicks, then write beat by beat: one sound to a click is a quarter, two are eighths, three a triplet, four sixteenths. / A note that rings through a click is held: a dot or a tie. Where the sound stops before the next note, write a rest. / Write the bar value by value (w h q e s; . dot, r rest, t triplet, _ tie) and check it against one more hearing.
- **Lesson card, rules:** A tie and the longer value are the same sound, and both are marked right. / Rests are where the sound stops, not only where nothing starts. / Swung eighths are written as plain eighths. In 6/8 the click is the dotted quarter and the writer counts in eighths.
- **Lesson card, take-away:** A rhythm you can write down from the ear is one you have really heard: the first half of transcribing a melody or a comping figure.
- **Level-page note:** Screen only. One bar of clicks counts you in, then the bar plays with the click, every note for its written length; you write it value by value (w h q e s, dot, rest, triplet, tie) and it is drawn as you go. Graded on the sound: where the notes start and where the silences are, so a tie and a longer value both count. In 6/8 the click is the dotted quarter.

**Stage 2: Rhythm Dictation 1–4**

#### Rhythm Dictation 1: Whole, half, quarter

- **Description:** The beats themselves: notes and rests a beat or longer
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h h. (answered by **writing the rhythm value by value**)
    - hint: Count the four clicks. A note that lasts two clicks is a half, all four a whole note, one click a quarter.
    - explanation after answering: Counts: 1 3.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: rq h q. (answered by **writing the rhythm value by value**)
    - hint: Count the four clicks. Where a click passes in silence, write a rest of that length.
    - explanation after answering: Counts: 2 4.
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'Writing a heard bar: values, eighths, off-beats, ties and dots. Writing rhythm fixes how it looks; someone who can write a figure will recognise it when it appears.']
- **Level note (the Details button):**
  - *Key takeaways:* Dictation runs from sound to symbols: you hear a bar with the click and write it value by value. / A note lasts until the next one starts or until the sound stops. How many clicks it covers is its value: one a quarter, two a half, four a whole note.
  - *What to pay attention to:* Count the four clicks out loud while you listen. Mark the clicks on which a new sound starts. / A click that passes in silence is a rest; a click that passes while a note still rings belongs to that note.
  - *Skill it builds:* Hearing exactly where notes start and stop against the beat: the ground of every rhythm you will write down from a record.
  - *Theory and tips:* Listen three times with three jobs: the clicks where something starts; then how long each note lasts; then check what you wrote against a last hearing. / A tie and the longer value sound the same, and both are marked right.
- **Source of the level (exact settings):**

```js
{n:'Whole, half, quarter',d:'The beats themselves: notes and rests a beat or longer',g:[rdQ({cells:['w','h','q'],hint:'Count the four clicks. A note that lasts two clicks is a half, all four a whole note, one click a quarter.'}),rdQ({cells:RD_V[1],hint:'Count the four clicks. Where a click passes in silence, write a rest of that length.'})]}
```

#### Rhythm Dictation 2: Eighth notes

- **Description:** Two notes in one click
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, quarters and eighths, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e e e e q e e. (answered by **writing the rhythm value by value**)
    - hint: On each click: one sound (a quarter) or two (two eighths)?
    - explanation after answering: Counts: 1 1& 2 2& 3 4 4&.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: q e e e e e e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 2 2& 3 3& 4 4&.
- **Level note (the Details button):**
  - *Key takeaways:* Two even sounds inside one click are two eighths: 1 & 2 & 3 & 4 &.
  - *What to pay attention to:* For each click ask one question: one sound or two? / An eighth note on the click followed by silence until the next click is still written as the sound it is: listen for whether the second half of the beat has a new attack.
  - *Skill it builds:* Splitting the beat in two by ear, the first step below the beat.
  - *Theory and tips:* Say “1 &” on every click while the bar plays. Wherever your “&” lines up with a sound, there is an eighth.
- **Source of the level (exact settings):**

```js
{n:'Eighth notes',d:'Two notes in one click',g:[rdQ({cells:['q','ee'],must:['ee'],what:'quarters and eighths',hint:'On each click: one sound (a quarter) or two (two eighths)?'}),rdQ({cells:RD_V[2],must:['ee']})]}
```

#### Rhythm Dictation 3: Eighth rests and off-beats

- **Description:** A note on the “and” alone; a note that stops at the “and”
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with off-beats, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e re q re e re e. (answered by **writing the rhythm value by value**)
    - hint: Is there a sound on the click itself? If the only sound in a beat is between two clicks, it is an eighth rest and then an eighth.
    - explanation after answering: Counts: 1 2 3& 4&.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: rq e re q re e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 2 3 4&.
- **Level note (the Details button):**
  - *Key takeaways:* An off-beat is a note on the “and” with nothing on the click before it: an eighth rest, then an eighth. / A note that stops at the “and” is an eighth followed by an eighth rest.
  - *What to pay attention to:* Listen to the click itself: does a sound start exactly with it, or only after it? / Rests are where the sound stops, not only where nothing starts.
  - *Skill it builds:* Hearing the second half of the beat on its own. Every syncopation later in the ladder is built from it.
  - *Theory and tips:* An off-beat alone feels as if it leans forward into the next click. Tap the click with one hand and the sounds with the other while you listen.
- **Source of the level (exact settings):**

```js
{n:'Eighth rests and off-beats',d:'A note on the “and” alone; a note that stops at the “and”',g:[rdQ({cells:['q','re','er'],must:['re','er'],what:'with off-beats',hint:'Is there a sound on the click itself? If the only sound in a beat is between two clicks, it is an eighth rest and then an eighth.'}),rdQ({cells:RD_V[3],must:['re','er']})]}
```

#### Rhythm Dictation 4: Ties and dots

- **Description:** The dotted half, the dotted quarter and eighth, a note held over the beat
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with dotted and tied notes, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h. q. (answered by **writing the rhythm value by value**)
    - hint: A note that rings through a click without a new attack is held: a dot or a tie. A tie and the longer value sound the same and both count.
    - explanation after answering: Counts: 1 4.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e q. e q.. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 1& 3 3&.
- **Level note (the Details button):**
  - *Key takeaways:* A dot adds half the note’s value: a dotted half is three beats, a dotted quarter a beat and a half. / The dotted quarter and eighth is long, short: the eighth falls on the “and” of the second beat.
  - *What to pay attention to:* A click that passes without a new attack while the note rings: the note is dotted or tied over it. / Eighth then dotted quarter: the long note starts on the “and” and is held through the next click.
  - *Skill it builds:* Hearing a held note across a beat, which is what ties and dots write down.
  - *Theory and tips:* When a note covers a click, write it the easy way: a tie and the dotted value are marked the same, because they sound the same.
- **Source of the level (exact settings):**

```js
{n:'Ties and dots',d:'The dotted half, the dotted quarter and eighth, a note held over the beat',g:[rdQ({cells:['q','dh','qe','eq','tie'],must:['dh','qe','eq','tie'],what:'with dotted and tied notes',hint:'A note that rings through a click without a new attack is held: a dot or a tie. A tie and the longer value sound the same and both count.'}),rdQ({cells:RD_V[4],must:['dh','qe','eq','tie']})]}
```

### Scale Runner (`scales`)

- **What the game is:** The scale in one position, built up the way it is taught: the whole position from the tonic and back to it, in C first and then in F and G, then eighths and triplets, the movable one-octave forms, patterns through the whole position (groups of three and four, thirds, fourths, triads, seventh chords), twelve keys in one position, the modes as a new home note, and the minor scales, pentatonics and blues scale inside the same fingerings. Leavitt’s twelve fingering types: stretches, never shifts. Always with the click. Then triads out of order and in their inversions, and the cell 1 2 3 1, through the whole position.
- **Area:** The scale in position · guitar · **course** 101 · **badge** life, core · **input:** microphone (guitar)
- **Master standard:** accuracy 90 %, timing within ±50 ms, 0.8 s a note (any pattern in any position without stopping, in time)
- **Lesson card, how to practise:** The first finger names the position and stays there; the hand does not shift. A fifth fret is reached by stretching the first finger down or the fourth finger up. / Alternate picking, always with the click. Quarter notes, then eighths, then triplets at the same tempo. / Every run starts and ends on the tonic. The whole position: from the lowest tonic up to the top note, down to the bottom note, and back up to the tonic. From the lowest note to the highest and back is the second form of the same run. / A new pattern in a known fingering before a known pattern in a new fingering.
- **Lesson card, rules:** Triad shapes and cells: the triad of each degree as 3 1 3 5, 1 3 5 3, 1 5 3 1, 5 1 3 5, the cell 1 2 3 1, and triads from their 3rd (3 5 8) and their 5th (5 8 10). / Position = the fret of the first finger. Four fingers, four frets; one more fret by a stretch, never by moving the hand. / Twelve fingering types put every major scale in one position. In position II: type 1 is C, 1A is F, 2 is G, 3 is D, 4 is A. / The flat keys (types 1A to 1D) add first-finger stretches; the sharp keys (types 4A to 4D) add fourth-finger stretches; types 2 and 3 have none. / The same type one fret higher is the key a half step higher: C major has a fingering in every position. / A pattern (groups of three and four, thirds, fourths, triads, seventh chords) runs through every group the position holds: up from its lowest note to the top, or down from the top note. / A mode is a choice of home note inside a fingering you already own.
- **Lesson card, take-away:** One position holds every key, and every key lies in every position. When that is in the hand you read and improvise without looking for the notes: you stay where you are and the music comes to you.
- **Level-page note:** How every question is played. The click keeps running: start on any click when you are ready, and from your first note every note belongs on a click. Alternate picking. The first finger names the position and stays at that fret; a ringed note is reached by stretching a finger, never by moving the hand. The tag says which run it is: most start and end on the tonic (the gold note); “whole position · from the tonic” goes tonic → top note → bottom note → tonic. The rhythm tag is colour-coded: grey quarter notes, yellow eighth notes, green triplets. A run passes with at most one note not heard (two on runs of 32 notes or more) and a few notes off the beat (2 in 10, 3 in 20); a wrong note fails it. The whole position counts in either form: from the tonic, or from the lowest note to the highest and back.

**Stage 3: Scale Runner 1–2**

#### Scale Runner 1: The whole position, in C

- **Description:** C major only. From the tonic: up to the top note, down to the bottom note, back to the tonic. The five basic fingerings, then eight positions: the ones with the tonic under the first or second finger come up a little more often. Also the other run: lowest note to highest and back
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position V Whole position · from the tonic Quarter notes · 1 per click Tonic → top note → bottom note → back up to the tonic · fourth-finger stretches (red rings)” → answer: C D E F G A B C D E F G A B C B A G F E D C B A G F E D C B A B C. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: C major in position V is Leavitt’s fingering type 4: C D E F G A B C… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
  - **Generator 2**, sample: “C major Position XII Whole position · from the tonic Quarter notes · 1 per click Tonic → top note → bottom note → back up to the tonic” → answer: C D E F G A B C D E F G F E D C B A G F E D C B A G F E F G A B C. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: C major in position XII is Leavitt’s fingering type 3: C D E F G A B C… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
  - **Generator 3**, sample: “C major Position VIII Whole position · bottom to top Quarter notes · 1 per click Lowest note → highest → lowest · fourth-finger stretches (red rings)” → answer: C D E F G A B C D E F G A B C D E D C B A G F E D C B A G F E D C. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: C major in position VIII is Leavitt’s fingering type 4C: C D E F G A B C… One position holds the whole key: no shifting, a finger stretch where the scale needs a fifth fret.
- **Why it is in the goal (ⓘ text of its step):** ['neck', 'Above the open position the same written note can be played in several places. Reading there works by position: the hand stays over four frets and the scale fingering tells you where every note of the key is. This is how guitarists are taught to read up the neck, and it is why a scale position is part of a reading goal.']
- **Level note (the Details button):**
  - *Key takeaways:* A position is the fret under the first finger. The hand stays there; a fifth fret is reached by stretching the first or fourth finger, never by shifting. / The whole position in one run: start on the lowest tonic, go up to the highest note, come down to the lowest note, and climb back to the tonic. / Only C major on this level: the five basic fingerings first, then positions III, VIII and X.
  - *What to pay attention to:* The stretched notes, ringed in red: reach and come back, do not move the hand. / The two turns, at the top and at the bottom: do not repeat the turning note. / The notes below the lowest tonic belong to the position too. / Position III: C is under the first finger on string 5. Position X: D is under the first finger on string 6. Both use fourth-finger stretches. / Know best the fingerings where the tonic is under your first or second finger on string 6 or 5: in C, positions VII and II (second finger), VIII and III (first finger). The scale lies in front of the root there, and the chord shapes share that root. / The click keeps running. Start on any click; from your first note every note must land on one. / End on 1 and hear it as home.
  - *Skill it builds:* The scale as one shape under the hand, heard from its tonic. Every later run, pattern and mode is cut from this run.
  - *Theory and tips:* Types 2 and 3 need no stretches. Types 1 and 1A use first-finger stretches, type 4 a fourth-finger stretch. / Starting and ending on the tonic keeps the key in your ear. A run that starts on the lowest note of the position does not. / Positions III and X have three notes on most strings, and the fourth finger stretches to the fifth fret of the position. Many players know them as three-notes-per-string shapes. / Position VIII: C is under the first finger on string 6; the fourth finger stretches to the fifth fret of the position. The other fingerings are the roads between these: they are still asked, a little less often. / Five fingerings cover C major over the whole neck: positions II, VII, XII, V and IX. Leavitt numbers them by type: type 1 at II, type 2 at VII, type 3 at XII, type 4 at V and type 1A at IX. / Alternate picking throughout: down, up, down, up, whatever the string.
- **Source of the level (exact settings):**

```js
{n:'The whole position, in C',d:'C major only. From the tonic: up to the top note, down to the bottom note, back to the tonic. The five basic fingerings, then eight positions: the ones with the tonic under the first or second finger come up a little more often. Also the other run: lowest note to highest and back',g:[scQ({pat:[['scale','tonic']]}),scQ({keys:['C'],pos:SC_SEVEN,pat:[['scale','tonic']]}),scQ({pos:SC_SEVEN,pat:[['scale','full']]})]}
```

#### Scale Runner 2: The whole position: C, F and G

- **Description:** The same run with two more keys: eight positions in C, F and G. Also the other run: lowest note to highest and back
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “G major Position III Whole position · from the tonic Quarter notes · 1 per click Tonic → top note → bottom note → back up to the tonic · fourth-finger stretches (red rings)” → answer: G A B C D E F♯ G A B C D E F♯ G A B A G F♯ E D C B A G F♯ E D C B A G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: G major in position III is Leavitt’s fingering type 4C: G A B C D E F♯ G… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
  - **Generator 2**, sample: “G major Position X Whole position · from the tonic Quarter notes · 1 per click Tonic → top note → bottom note → back up to the tonic · fourth-finger stretches (red rings)” → answer: G A B C D E F♯ G A B C D E F♯ E D C B A G F♯ E D C B A G F♯ E D E F♯ G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: G major in position X is Leavitt’s fingering type 4B: G A B C D E F♯ G… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
  - **Generator 3**, sample: “F major Position V Whole position · bottom to top Quarter notes · 1 per click Lowest note → highest → lowest” → answer: A B♭ C D E F G A B♭ C D E F G A B♭ C B♭ A G F E D C B♭ A G F E D C B♭ A. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: F major in position V is Leavitt’s fingering type 3: A B♭ C D E F G A… One position holds the whole key: no shifting, a finger stretch where the scale needs a fifth fret.
- **Level note (the Details button):**
  - *What this level adds:* The same run in the keys of F and G as well as C, in all eight positions.
  - *What to pay attention to:* A new key in the same position is a different fingering. Read the diagram before your first note. / Find the tonic of the new key first: the run starts and ends on it.
  - *Theory and tips:* The shapes are the ones you know from C, at other frets. F in a position is fingered as C is seven frets higher: F in position II is C in position IX. G is fingered as C is five frets higher: G in position II is C in position VII.
- **Source of the level (exact settings):**

```js
{n:'The whole position: C, F and G',d:'The same run with two more keys: eight positions in C, F and G. Also the other run: lowest note to highest and back',g:[scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['scale','tonic']]}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['scale','tonic']]}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['scale','full']]})]}
```

### Jazz Rhythm (`jazzrhy`)

- **What the game is:** The rhythms jazz is made of, in swing, tapped or strummed: the Charleston and its displacements, pushes, dotted-quarter chains, quarter-note triplets, phrase placement, hemiola, bebop cells, the jazz waltz, all the figures mixed, and the rhythms of the standards you transcribe yourself.
- **Area:** The figures of the music · **course** 301 · **badge** life, core · **input:** tap or strum (continuous)
- **Master standard:** accuracy 90 %, timing within ±30 ms (the jazz figures in your hands, swung and placed)
- **Lesson card, how to practise:** Swing everything here: the off-beat eighth sits on the last third of the beat. / Sing each figure with syllables (doo-dat, doo-ba-doo-dat) before you tap it. / Transcribe the rhythm of the first eight bars of a standard you play and add it under Your tunes; the level asks it back. / Play the etudes on one note on the guitar, then on a scale, then over the chord changes of a tune.
- **Lesson card, rules:** Charleston: 1 and the and of 2. Displace it by an eighth or a beat and you have most comping rhythms. / A push places a chord on the and before the beat and holds it through the beat. / Three dotted quarters against four beats (q. q. q) and quarter-note triplets are the two ways to superimpose three on four. / Bebop phrases tend to start on the and of 1 and end on the and of 4.
- **Lesson card, take-away:** The jazz language is a small set of rhythmic figures placed with intention; the notes come second.
- **Level-page note:** Everything here is swung. Level 11 asks the rhythms of standards you transcribe yourself (Your tunes, below).

**Stage 4: Jazz Rhythm 1–3**

#### Jazz Rhythm 1: Charleston

- **Description:** 1 and the and of 2, swung; against a click on 2 and 4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 2& | 1 2& | 1 2& | 1 2&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'A jazz chart is written in a small number of figures: the Charleston, its displacements, and pushes that anticipate the beat. Know these by sight and you read a bar as one or two shapes, not as eight separate eighths.']
- **Level note (the Details button):**
  - *Key takeaways:* The Charleston: one hit on beat 1, one on the “and” of 2. It is the basic comping rhythm of swing. / The click is on 2 and 4, as a hi-hat would be.
  - *What to pay attention to:* The second hit is on the swung “and” of 2: late, just before beat 3. / Leave the rest of the bar empty. The space is part of the figure. / The click on 2 falls between your two hits. Use it.
  - *Skill it builds:* The first comping rhythm, and the habit of hearing 2 and 4 as the reference.
  - *Theory and tips:* Written: dotted quarter, eighth tied or followed by rests. Played: “DAH … dit”. / Named after the 1920s dance. Every later comping figure can be heard as this one moved or cut.
- **Source of the level (exact settings):**

```js
{n:'Charleston',d:'1 and the and of 2, swung; against a click on 2 and 4',g:[tapReadQ(['charl'],2,true),twoFourQ('charl')],c:cCells(['charl'],true,4,{click:(bar,b)=>b===1||b===3})}
```

#### Jazz Rhythm 2: Displaced Charleston

- **Description:** The same two hits moved: and of 2 → and of 3; and of 1 → 3
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 2& | 1 2& | 2& 3& | 2& 3&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The same two hits, shifted in the bar: starting on the “and” of 2, or on the “and” of 1.
  - *What to pay attention to:* From the “and” of 1 to beat 3 the two hits are as far apart as in the Charleston; only the starting point moves. The other form is the two off-beats either side of beat 3, one beat apart. / Know where beat 1 is while you play nothing on it.
  - *Theory and tips:* Displacement is the main way jazz musicians get variety from one idea. A comping player moves the Charleston around the bar to answer the soloist.
- **Source of the level (exact settings):**

```js
{n:'Displaced Charleston',d:'The same two hits moved: and of 2 → and of 3; and of 1 → 3',g:[tapReadQ(['charl','charl2','charl3'],2,true)],c:cCells(['charl','charl2','charl3'],true)}
```

#### Jazz Rhythm 3: Pushes

- **Description:** Anticipate 1 and 3: the chord arrives half a beat early
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 2& | 1 2& | 1 2& | 1 2 2&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Pushes: the hit that belongs to beat 1 or beat 3 is played an eighth early and held over.
  - *What to pay attention to:* Do not also play the beat you anticipated. / A push into beat 1 is on the “and” of 4 of the bar before. Keep the bar line clear in your head.
  - *Theory and tips:* When the harmony changes on a pushed beat, the new chord sounds early. Horn sections and rhythm sections push together; knowing the sound lets you catch it.
- **Source of the level (exact settings):**

```js
{n:'Pushes',d:'Anticipate 1 and 3: the chord arrives half a beat early',g:[tapReadQ(['push1','push3','charl'],2,true),tapBackQ(['qt','eqe','q','ee','re'],true)],c:cCells(['push1','push3','charl'],true)}
```

**Stage 5: Jazz Rhythm 4–6**

#### Jazz Rhythm 4: Dotted-quarter chains

- **Description:** q. q. q: three against four inside the bar
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 2& | 1 2& | 1 2& | 1 2&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Why it is in the goal (ⓘ text of its step):** ['rhy', 'The longer jazz figures: chains of dotted quarters (three against four inside the bar), quarter-note triplets, and phrases that start on the and of 1 and end on the and of 4. They cross the beat and the bar line, so they must be known as whole figures.']
- **Level note (the Details button):**
  - *What this level adds:* Dotted quarters in a row: hits every three eighths against a bar of four beats.
  - *What to pay attention to:* The hits fall on 1, the “and” of 2, and 4. Then the pattern has to be re-started or carried on. / Do not round the dotted quarters into quarters.
  - *Theory and tips:* This is three against four inside the bar: the first step toward hemiola. It gives a floating feel over a steady 4/4.
- **Source of the level (exact settings):**

```js
{n:'Dotted-quarter chains',d:'q. q. q: three against four inside the bar',g:[tapReadQ(['dots3','qe','charl'],2,true)],c:cCells(['dots3','qe','charl'],true)}
```

#### Jazz Rhythm 5: Quarter-note triplets

- **Description:** Three even notes over two beats
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 2 3 | 1 2 2-let 3-trip 4 4& | 1 1& 2 2-let 3-trip 4 4& | 1 3
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Quarter-note triplets: three even notes across two beats.
  - *What to pay attention to:* Only the first note is on a beat. The second falls after the “and”, the third before the next “and”. / Even spacing. Most people play “short-short-long”.
  - *Theory and tips:* Feel the eighth-note triplets underneath and play every second one: 1-(trip)-let-(2)-trip-(let). / Wide, slow figure over a walking bass. It is a favourite of soloists for stretching time.
- **Source of the level (exact settings):**

```js
{n:'Quarter-note triplets',d:'Three even notes over two beats',g:[tapReadQ(['qtrip','q','h','ee'],2,true)],c:cCells(['qtrip','q','h','ee'],true)}
```

#### Jazz Rhythm 6: Phrase placement

- **Description:** Lines that start on the and of 1 and end on the and of 4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 1& 2 2& 3 3& 4 4& | 1& 2 2& 3 3& 4& | 2 2& 3 3& 4 4& | 2 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Where a phrase starts and stops matters as much as its notes. Jazz lines usually start off the beat and end off the beat.
  - *What to pay attention to:* Entering on the “and” of 1 after a rest on 1. / Ending on the “and” of 4: a short, accented last note, then silence.
  - *Skill it builds:* Phrasing: lines that sound spoken instead of square.
  - *Theory and tips:* Bebop phrases often end with a short accented off-beat note, the “bop” of be-bop. / Practise starting the same idea on each eighth of the bar. It becomes eight ideas.
- **Source of the level (exact settings):**

```js
{n:'Phrase placement',d:'Lines that start on the and of 1 and end on the and of 4',g:[tapReadQ(['phrA','phrB','bop','re'],2,true)],c:cCells(['phrA','phrB','bop','re'],true)}
```

## The appendix levels in full

### Sing the Page (`sightsing`)

- **What the game is:** A line written on the staff, a cadence and the tonic: sing it from the page. Three notes by step at first, then the whole scale, skips, the minor key and written rhythm. Then wider skips inside IV and V7, four-bar lines, phrases of real tunes written with their rhythm, and two bars sung in time with the click. The mic checks your pitch.
- **Area:** Sight singing · voice · **course** 201 · **badge** life, core · **input:** microphone (guitar)
- **Master standard:** accuracy 85 % (sing a written line at sight, in tune)
- **Lesson card, how to practise:** Find 1 on the staff before anything else. Then number every note of the line. / Hear the whole line in your head before you sing the first note. / Sing on numbers, slowly. A wrong note: go back to 1 and find it again by step. / Five minutes a day does more than an hour a week.
- **Lesson card, rules:** Line to the next space, or space to the next line, is a step. Line to line or space to space is a third. / 3 to 4 and 7 to 1 are the half steps of the major scale. / The key signature tells you where 1 is: no sharps or flats C, one sharp G, two D, three A; one flat F, two B♭, three E♭. / In a minor key 1 is the 6 of the major key with the same signature. / A wide skip (level 10) is two notes of one chord: I (1 3 5), IV (4 6 1) or V7 (5 7 2 4). After it the line steps back. / A sign in front of a note (sharp, flat, natural) holds to the end of its bar. / In time (level 13): with the click at 60, every note within 0.3 of a beat of its written place.
- **Lesson card, take-away:** If you can sing it from the page, you can hear it before you play it. That is what reading music is for.
- **Level-page note:** Sing on numbers or any vowel. Any octave counts for the line as a whole, but its shape is checked: a note written higher is sung higher. You may sing the tonic once before the line; it is not counted. Only the pitches are checked, not the timing: go as slowly as you need, but seven seconds of silence end the take. The cadence and the tonic are played first; three replays count as a hint. Level 13 is the exception: it is sung with the click at 60 after a count-in of four, every note has to start within 0.3 of a beat of its written place, and no tonic may be sung in front of the line (hum it during the count-in). The second bar of every level row shows how many cents from the pitch your sung notes were on average; the green mark is 20 cents. None of this has been tested with a real voice yet.

**Also helps: Sing the Page 1–9** (singing a written line: hearing the page before you play it)

#### Sing the Page 1: 1 2 3

- **Description:** Three notes by step, in C, G and F
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in F major . You hear the cadence and then the tonic, F = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 3 2 1 2 3. (answered by **playing it on the guitar**; 5 notes to play)
    - hint: Find F on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In F major the line is 3 – 2 – 1 – 2 – 3 (A – G – F – G – A).
- **Level note (the Details button):**
  - *Key takeaways:* A written line in a major key with three notes: 1, 2 and 3. You hear the cadence and the tonic, then sing the line from the page. / Before you sing, find 1 on the staff. Every other note is read as a distance from it.
  - *What to pay attention to:* Number the notes first, silently. Then hear the whole line in your head. Only then sing. / A step on the staff is line to space or space to line. Nothing here is bigger than a step. / If you lose the key, sing 1 again and start over.
  - *Skill it builds:* Turning notes on a page into sound without an instrument. It is the reverse of dictation, and each makes the other easier.
  - *Theory and tips:* The mic checks pitch only. The line may be in any octave as a whole; its shape is checked. Take your time between notes: seven seconds of silence end the take. / You may sing 1 once before the line. It is not counted. / The key is C, G or F, so 1 moves on the staff: in C it sits on the ledger line below the staff, in G on the second line, in F in the first space. / Sing on numbers: “one, two, three”. The number is the note’s job in the key, and the job is what you are learning to hear.
- **Source of the level (exact settings):**

```js
{n:'1 2 3',d:'Three notes by step, in C, G and F',g:[singPageQ({id:1,keys:['C','G','F'],len:[5,7],lo:0,hi:2,start:[0,2],endTriad:true})]}
```

#### Sing the Page 2: 1 to 4

- **Description:** 4 joins: the half step above 3
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in F major . You hear the cadence and then the tonic, F = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 1 2 3 4 3 2 1. (answered by **playing it on the guitar**; 7 notes to play)
    - hint: Find F on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In F major the line is 1 – 2 – 3 – 4 – 3 – 2 – 1 (F – G – A – B♭ – A – G – F).
- **Level note (the Details button):**
  - *What this level adds:* 4 joins. It sits a half step above 3 and leans back down onto it.
  - *What to pay attention to:* 3 to 4 is the small step. Do not sing it as wide as 1 to 2.
- **Source of the level (exact settings):**

```js
{n:'1 to 4',d:'4 joins: the half step above 3',g:[singPageQ({id:2,keys:['C','G','F'],len:[5,7],lo:0,hi:3,need:[3],start:[0,2],endTriad:true})]}
```

#### Sing the Page 3: 1 to 5

- **Description:** The first five notes; lines may start on 3 or 5
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in G major . You hear the cadence and then the tonic, G = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 5 4 3 4 5 4 3. (answered by **playing it on the guitar**; 7 notes to play)
    - hint: Find G on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In G major the line is 5 – 4 – 3 – 4 – 5 – 4 – 3 (D – C – B – C – D – C – B).
- **Level note (the Details button):**
  - *What this level adds:* 5 joins: the top of the first five notes and the second pillar of the key.
  - *What to pay attention to:* Lines may start on 3 or 5 now. Find your first note from 1 before you begin.
  - *Theory and tips:* 1, 3 and 5 are the fixed points. 2 and 4 are heard as passing between them.
- **Source of the level (exact settings):**

```js
{n:'1 to 5',d:'The first five notes; lines may start on 3 or 5',g:[singPageQ({id:3,keys:['C','G','F'],len:[5,7],lo:0,hi:4,need:[4],start:[0,2,4],endTriad:true})]}
```

#### Sing the Page 4: 1 to 6

- **Description:** 6 joins; the keys of D and B♭
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in F major . You hear the cadence and then the tonic, F = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 5 6 5 4 3. (answered by **playing it on the guitar**; 5 notes to play)
    - hint: Find F on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In F major the line is 5 – 6 – 5 – 4 – 3 (C – D – C – B♭ – A).
- **Level note (the Details button):**
  - *What this level adds:* 6 joins, a whole step above 5. The keys of D and B♭ are added.
  - *What to pay attention to:* Two sharps or two flats in the signature: find 1 first, the signature takes care of the rest.
- **Source of the level (exact settings):**

```js
{n:'1 to 6',d:'6 joins; the keys of D and B♭',g:[singPageQ({id:4,keys:['C','G','F','D','Bb'],len:[5,7],lo:0,hi:5,need:[5],start:[0,2,4],endTriad:true})]}
```

#### Sing the Page 5: The whole scale

- **Description:** The 7 under the tonic or the tonic above in every line; seven keys
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in B♭ major . You hear the cadence and then the tonic, B♭ = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 3 2 1 7 1 2 1. (answered by **playing it on the guitar**; 7 notes to play)
    - hint: Find B♭ on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In B♭ major the line is 3 – 2 – 1 – 7 – 1 – 2 – 1 (D – C – B♭ – A – B♭ – C – B♭).
- **Level note (the Details button):**
  - *What this level adds:* The whole scale: 7 under the tonic, and up to the tonic above. Every line has one of the two.
  - *What to pay attention to:* 7 is a half step under 1 and pulls up into it. / The upper 1 is the same note as the lower one. Hear the octave before you go there.
  - *Theory and tips:* Seven keys now: up to three sharps or three flats.
- **Source of the level (exact settings):**

```js
{n:'The whole scale',d:'The 7 under the tonic or the tonic above in every line; seven keys',g:[singPageQ({id:5,keys:['C','G','F','D','Bb','A','Eb'],len:[7],lo:-1,hi:7,need:[-1,6,7],must:a=>a.includes(-1)||a.includes(7),start:[0,2,4],endTriad:true})]}
```

#### Sing the Page 6: Skips in the tonic triad

- **Description:** At least one skip in every line, between 1, 3, 5, the tonic above and the 5 below; steps between
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in G major . You hear the cadence and then the tonic, G = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 1 3 2 1 5 6 7 1. (answered by **playing it on the guitar**; 8 notes to play)
    - hint: Find G on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In G major the line is 1 – 3 – 2 – 1 – 5 – 6 – 7 – 1 (G – B – A – G – D – E – F♯ – G).
- **Level note (the Details button):**
  - *Key takeaways:* Skips for the first time, only between the notes of the tonic triad: 1, 3, 5, the 1 above and the 5 below. Every line has at least one.
  - *What to pay attention to:* On the staff a third is line to line or space to space. / Sing the skipped note silently the first few times: 1 (2) 3. / 5 up to 1 is a fourth, 1 up to 5 is a fifth. They are different distances.
  - *Skill it builds:* Hearing the tonic triad as a frame you can jump around in.
  - *Theory and tips:* Most melodies are steps plus skips inside the chord of the moment. With the tonic triad secure, other chords are learned the same way.
- **Source of the level (exact settings):**

```js
{n:'Skips in the tonic triad',d:'At least one skip in every line, between 1, 3, 5, the tonic above and the 5 below; steps between',g:[singPageQ({id:6,keys:['C','G','F','D','Bb'],len:[6,7,8],lo:-3,hi:7,skips:.45,triad:true,must:a=>a.some((x,i)=>i&&Math.abs(x-a[i-1])>1),start:[0,2,4],endTriad:true})]}
```

#### Sing the Page 7: Thirds and the fourth

- **Description:** Any third in the scale, and 5 to 1
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in G major . You hear the cadence and then the tonic, G = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 5 3 1 7 6 1. (answered by **playing it on the guitar**; 6 notes to play)
    - hint: Find G on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In G major the line is 5 – 3 – 1 – 7 – 6 – 1 (D – B – G – F♯ – E – G).
- **Level note (the Details button):**
  - *What this level adds:* Any third in the scale, and the fourth between 5 and 1.
  - *What to pay attention to:* 2 to 4, 4 to 6, 6 to 1: thirds outside the tonic triad. Hear the note in between. / Some thirds are major, some minor. The key decides.
- **Source of the level (exact settings):**

```js
{n:'Thirds and the fourth',d:'Any third in the scale, and 5 to 1',g:[singPageQ({id:7,keys:['C','G','F','D','Bb','A','Eb'],len:[6,7,8],lo:-3,hi:7,skips:.5,start:[0,2,4],endTriad:true})]}
```

#### Sing the Page 8: Minor key

- **Description:** A, E, D and G minor: every line has at least one of ♭6, ♭7 and the raised 7 under the tonic
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in D minor . You hear the cadence and then the tonic, D = 1. Sing the line on numbers, one note after another, at your own pace. Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: ♭3 4 5 ♭6 ♭7 1. (answered by **playing it on the guitar**; 6 notes to play)
    - hint: Find D on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In D minor the line is ♭3 – 4 – 5 – ♭6 – ♭7 – 1 (F – G – A – B♭ – C – D).
- **Level note (the Details button):**
  - *What this level adds:* The minor key: ♭3, ♭6 and ♭7, with the raised 7 just under the tonic. Every line has at least one of ♭6, ♭7 and the raised 7.
  - *What to pay attention to:* The raised 7 carries an accidental on the page. It appears only below 1 and leads up into it. / 1 to ♭3 is a minor third. Sing the minor triad 1 ♭3 5 before you start.
  - *Theory and tips:* The key signature is that of the relative major: A minor has none, E minor one sharp, D minor one flat, G minor two flats.
- **Source of the level (exact settings):**

```js
{n:'Minor key',d:'A, E, D and G minor: every line has at least one of ♭6, ♭7 and the raised 7 under the tonic',g:[singPageQ({id:8,minor:true,keys:['A','E','D','G'],len:[6,7],lo:-1,hi:7,skips:.3,triad:true,must:a=>a.some(x=>x===5||x===6||x===-1),start:[0,2,4],endTriad:true})]}
```

#### Sing the Page 9: With written rhythm (pitches checked)

- **Description:** Two bars written with quarters, halves and eighths, as on a lead sheet; the rhythm is read, not graded
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “The page is in F major . You hear the cadence and then the tonic, F = 1. Sing the line on numbers, one note after another, at your own pace (the rhythm is written; only the pitches are checked). Any octave for the line as a whole: up means up. You may sing 1 once before the line: it is not counted. Seven seconds of silence end the take.” → answer: 3 4 3 2 1 2 3. (answered by **playing it on the guitar**; 7 notes to play)
    - hint: Find F on the staff: that is 1. Number every note before you sing, and hear each one in your head first.
    - explanation after answering: In F major the line is 3 – 4 – 3 – 2 – 1 – 2 – 3 (A – B♭ – A – G – F – G – A).
- **Level note (the Details button):**
  - *What this level adds:* Lines written with rhythm: quarters, halves and pairs of eighths over two bars. The rhythm is there to be read; the game checks the pitches only.
  - *What to pay attention to:* Sing the rhythm anyway and tap the beat with your hand. / Eighth notes go by fast: have both in your ear before you sing the first.
  - *Theory and tips:* This is what a lead sheet looks like. Sing eight bars of any tune you are learning before you play it.
- **Source of the level (exact settings):**

```js
{n:'With written rhythm (pitches checked)',d:'Two bars written with quarters, halves and eighths, as on a lead sheet; the rhythm is read, not graded',g:[singPageQ({id:9,rhy:true,keys:['C','G','F','D','Bb','A','Eb'],lo:-1,hi:7,skips:.35,triad:true,start:[0,2,4],endTriad:true})]}
```

**Also helps: Rhythm Theory 5–8** (swing vocabulary, the road-map signs on paper, accents and articulation marks)

#### Rhythm Theory 5: Swing vocabulary

- **Description:** Where jazz time lives: swing, 2 and 4, pushes, the Charleston
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “An anticipation (a push) places a chord…” → answer: half a beat before the beat it belongs to. (answered by **picking one choice**)
    - choices shown: half a beat after the beat, on beat 3, on the downbeat, half a beat before the beat it belongs to
    - hint: Think of a medium-swing standard.
    - explanation after answering: An anticipation (a push) places a chord… half a beat before the beat it belongs to .
- **Level note (the Details button):**
  - *Key takeaways:* Jazz time has its own words: swing eighths, the backbeat on 2 and 4, the push, the Charleston. / The Charleston is two hits: beat 1 and the “and” of 2.
  - *What to pay attention to:* Swing is a way of playing eighths, not a different notation. / A push anticipates a beat by an eighth note.
  - *Skill it builds:* The concepts behind the feel, so that a chart instruction or a teacher’s word means a precise thing.
  - *Theory and tips:* Swing eighths are written even and played long–short. The ratio narrows as the tempo rises. / Comping figures are mostly built from two ideas: the Charleston and its displacements, and pushes.
- **Source of the level (exact settings):**

```js
{n:'Swing vocabulary',d:'Where jazz time lives: swing, 2 and 4, pushes, the Charleston',g:[swingFactQ()]}
```

#### Rhythm Theory 6: Repeats and endings

- **Description:** Repeat signs, 1st and 2nd endings, one-bar and two-bar repeats: which bar comes next?
- **Input:** screen
- **Kind:** round level, 5 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “You have just played bar 6 for the second time. What do you play next?” → answer: Bar 7. (answered by **picking one choice**)
    - choices shown: Bar 1, Bar 2, Bar 3, Bar 4, Bar 5, Bar 6, Bar 7, Bar 8
    - hint: Follow the road from bar 1 with your finger. A repeat is taken once; “To Coda” counts only after the D.C. or D.S.
    - explanation after answering: Repeat signs: the bars between them are played twice, then on. The bars as played: 1 2 3 4 5 6 3 4 5 6 7 8 .
  - **Generator 2**, sample: “You have just played bar 12. What do you play next?” → answer: The end. (answered by **picking one choice**)
    - choices shown: Bar 1, Bar 2, Bar 3, Bar 4, Bar 5, Bar 6, Bar 7, Bar 8
    - hint: Follow the road from bar 1 with your finger. A repeat is taken once; “To Coda” counts only after the D.C. or D.S.
    - explanation after answering: The first time, play the 1st ending and go back. The second time, skip the 1st ending and play the 2nd. The bars as played: 1 2 3 4 1 2 5 6 7 8 9 10 11 12 .
  - **Generator 3**, sample: “How many bars do you play in all, from bar 1 to the end?” → answer: 14. (answered by **picking one choice**)
    - choices shown: 13, 14, 15, 16
    - hint: Write the road out bar by bar, then count.
    - explanation after answering: The first time, play the 1st ending and go back. The second time, skip the 1st ending and play the 2nd. The bars as played: 1 2 3 4 1 2 5 6 7 8 9 10 11 12 , which is 14 bars.
  - **Generator 4**, sample: “Bar 3 holds only this sign. What do you play in bar 3?” → answer: Bar 2 again. (answered by **picking one choice**)
    - choices shown: A bar of rest, Bar 1 again, Bar 2 again, Bars 1 and 2 again
    - hint: The sign always points at what came just before it.
    - explanation after answering: A slash with two dots is a one-bar repeat: play the bar before it again. Bar 2 again .
  - **Generator 5**, sample: “The second time through a repeat you reach the 1st ending. What do you do?” → answer: skip it and play the 2nd ending. (answered by **picking one choice**)
    - choices shown: play it again, play both endings, stop there, skip it and play the 2nd ending
    - hint: Think of how you would follow it on a chart.
    - explanation after answering: The second time through a repeat you reach the 1st ending. What do you do? skip it and play the 2nd ending .
- **Level note (the Details button):**
  - *Key takeaways:* A repeat sign sends you back to the sign that faces it, or to the beginning if there is none. The section is played twice. / Endings: the first time through, play the 1st ending and go back. The second time, skip it and play the 2nd. / A slash with two dots repeats the bar before it. A double slash across a bar line, with a 2 above, repeats the two bars before it.
  - *What to pay attention to:* Which time through you are on: the answer to “what comes next” depends on it. / The bar after a 1st ending is not the next bar on the page.
  - *Skill it builds:* Reading the order of the bars: the first half of following a chart.
  - *Theory and tips:* The dots of a repeat sign sit on the side of the music that is repeated. / One-bar repeats are common in rhythm-section parts: a groove is written once and followed by the sign in each bar that keeps it.
- **Source of the level (exact settings):**

```js
{n:'Repeats and endings',d:'Repeat signs, 1st and 2nd endings, one-bar and two-bar repeats: which bar comes next?',g:[chartNextQ(['rep','rep2','end1','end2']),chartNextQ(['end1','end2']),chartCountQ(['rep','rep2','end1','end2']),mrQ(),roadFactQ('rep')]}
```

#### Rhythm Theory 7: The road map

- **Description:** D.C., D.S., Fine, To Coda and the coda; the fermata
- **Input:** screen
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “You have just played bar 4 for the first time. What do you play next?” → answer: Bar 5. (answered by **picking one choice**)
    - choices shown: Bar 1, Bar 2, Bar 3, Bar 4, Bar 5, Bar 6, Bar 7, Bar 8
    - hint: Follow the road from bar 1 with your finger. A repeat is taken once; “To Coda” counts only after the D.C. or D.S.
    - explanation after answering: D.C. al Fine: at that mark go back to the beginning and stop at Fine. The bars as played: 1 2 3 4 5 6 7 8 1 2 3 4 .
  - **Generator 2**, sample: “You have just played bar 4. What do you play next?” → answer: Bar 5. (answered by **picking one choice**)
    - choices shown: Bar 1, Bar 2, Bar 3, Bar 4, Bar 5, Bar 6, Bar 7, Bar 8
    - hint: Follow the road from bar 1 with your finger. A repeat is taken once; “To Coda” counts only after the D.C. or D.S.
    - explanation after answering: First the repeat with its two endings. Then D.S. al Coda: back to the sign, as far as “To Coda”, and jump to the coda. The bars as played: 1 2 3 1 2 4 5 6 7 8 5 6 9 10 11 12 .
  - **Generator 3**, sample: “How many bars do you play in all, from bar 1 to the end?” → answer: 16. (answered by **picking one choice**)
    - choices shown: 12, 15, 16, 18
    - hint: Write the road out bar by bar, then count.
    - explanation after answering: D.S. al Coda: at that mark go back to the sign, play as far as “To Coda”, then jump to the coda. The bars as played: 1 2 3 4 5 6 7 8 3 4 5 6 9 10 11 12 , which is 16 bars.
  - **Generator 4**, sample: ““al Fine” after D.C. or D.S. means…” → answer: play until the word Fine and stop there. (answered by **picking one choice**)
    - choices shown: repeat until told to stop, jump to the coda, play to the last bar, play until the word Fine and stop there
    - hint: Think of how you would follow it on a chart.
    - explanation after answering: “al Fine” after D.C. or D.S. means… play until the word Fine and stop there .
- **Level note (the Details button):**
  - *What this level adds:* The jumps. D.C. goes back to the beginning, D.S. back to the sign. “al Fine” ends at the word Fine; “al Coda” leaves at “To Coda” for the coda. Also the fermata.
  - *What to pay attention to:* Fine and “To Coda” count only after the jump. The first time you pass them, play on. / Some questions ask how many bars are played in all: write the road out bar by bar.
  - *Theory and tips:* Da capo is Italian for “from the head”, dal segno “from the sign”, fine “end”, coda “tail”. / By common convention the repeats are not taken again after a D.C. or D.S. unless the chart says so. The charts here keep clear of that case. / A fermata stops the count: the note is held until the player or the leader moves on.
- **Source of the level (exact settings):**

```js
{n:'The road map',d:'D.C., D.S., Fine, To Coda and the coda; the fermata',g:[chartNextQ(['dcfine','dsfine','dscoda','dccoda','full']),chartNextQ(['dscoda','dccoda','full']),chartCountQ(['dcfine','dsfine','dscoda','dccoda','full']),roadFactQ('jump')]}
```

#### Rhythm Theory 8: Accents, dynamics, articulation

- **Description:** Accent and marcato, staccato and tenuto, pp to ff, hairpins, sfz and fp
- **Input:** screen
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “What is this mark?” → answer: a marcato accent. (answered by **picking one choice**)
    - choices shown: a marcato accent, a tenuto line, an accent, a decrescendo (diminuendo)
    - hint: Wedges and dots sit at the note head; hairpins open towards the loud end.
    - explanation after answering: This is a marcato accent : a strong accent; in jazz it is also played short.
- **Level note (the Details button):**
  - *Key takeaways:* Marks on a single note say how to play it: an accent is louder, a marcato accent stronger still, staccato is short, tenuto is full length. / Dynamics say how loud a passage is. From softest to loudest: pp, p, mp, mf, f, ff. Hairpins move between them.
  - *What to pay attention to:* Accent and marcato look alike: the accent is a wedge lying on its side, the marcato a wedge standing up. / mp and mf: mezzo pulls either one towards the middle, so mp is louder than p and mf softer than f.
  - *Skill it builds:* Reading how the notes are to be played, not only when.
  - *Theory and tips:* In jazz charts the marcato is played short and hard, the tenuto long, and a plain accent keeps its full length. / sfz is one sudden loud note. fp is loud at the attack and soft at once after it. / A hairpin opens towards the loud end.
- **Source of the level (exact settings):**

```js
{n:'Accents, dynamics, articulation',d:'Accent and marcato, staccato and tenuto, pp to ff, hairpins, sfz and fp',g:[artQ()]}
```

**Also helps: Rhythm Dictation 5–16** (rhythm dictation beyond the first values: syncopation, triplets, sixteenths, 6/8, swing, two bars)

#### Rhythm Dictation 5: 3/4

- **Description:** Three beats a bar: the dotted half fills it
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 3/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e e q q. (answered by **writing the rhythm value by value**)
    - hint: Count 1 2 3. A note held all three clicks is a dotted half.
    - explanation after answering: Counts: 1 1& 2 3.
  - **Generator 2**, sample: “Listen: 1 bar of 3/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h q. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 3.
- **Level note (the Details button):**
  - *Key takeaways:* 3/4 has three beats a bar. A note that fills the bar is a dotted half.
  - *What to pay attention to:* The accented click starts the bar: count 1 2 3, not 1 2 3 4. / A half note in 3/4 leaves one beat: the third beat is still to be written.
  - *Skill it builds:* Writing in a meter other than 4/4: the bar is shorter, and the counting changes with it.
  - *Theory and tips:* The writer says how many beats are left. In 3/4 the bar is full after three.
- **Source of the level (exact settings):**

```js
{n:'3/4',d:'Three beats a bar: the dotted half fills it',g:[rdQ({cells:['q','ee','h','dh'],M:3,hint:'Count 1 2 3. A note held all three clicks is a dotted half.'}),rdQ({cells:RD_V[5],M:3})]}
```

#### Rhythm Dictation 6: Syncopation I

- **Description:** The quarter off the beat: eighth, quarter, eighth
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with syncopation, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e q e e q e. (answered by **writing the rhythm value by value**)
    - hint: A sound on the “and” that is still ringing when the next click comes: the quarter between two eighths.
    - explanation after answering: Counts: 1 1& 2& 3 3& 4&.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e e re e q. e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 1& 2& 3 4&.
- **Level note (the Details button):**
  - *Key takeaways:* Syncopation is a note that starts off the beat and is still sounding when the next beat comes. / Eighth, quarter, eighth: the quarter starts on the “and” and lasts through the next click.
  - *What to pay attention to:* Find the click that passes with no new sound: the note before it is the syncopated one. / Dotted quarter and eighth, eighth and dotted quarter, eighth quarter eighth: three ways of putting a long note against the click.
  - *Skill it builds:* Hearing a long note off the beat, the sound of nearly every jazz and pop melody.
  - *Theory and tips:* Write the quarter in the middle as a quarter, or as two eighths tied: both are right. Reading Rhythm shows how print writes it.
- **Source of the level (exact settings):**

```js
{n:'Syncopation I',d:'The quarter off the beat: eighth, quarter, eighth',g:[rdQ({cells:['q','ee','eqe'],must:['eqe'],what:'with syncopation',hint:'A sound on the “and” that is still ringing when the next click comes: the quarter between two eighths.'}),rdQ({cells:RD_V[6],must:['eqe','qe','eq']})]}
```

#### Rhythm Dictation 7: Syncopation II: ties into the beat

- **Description:** Anticipations of 2, 3, 4 and 1: a note on the “and” held over the next beat
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with notes that arrive half a beat early, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h q. e. (answered by **writing the rhythm value by value**)
    - hint: Which click passes without a new sound? The note before it started on the “and” and was tied over.
    - explanation after answering: Counts: 1 3 4&.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h q. e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 3 4&.
- **Level note (the Details button):**
  - *Key takeaways:* A note on the “and” tied into the next beat arrives half a beat early: an anticipation. / The push into 3 (the “and” of 2) and into the next bar (the “and” of 4) are the ones a chart uses most.
  - *What to pay attention to:* Which click passes silent? The note that covers it started half a beat before. / A whole-bar figure: a half, a dotted quarter, then an eighth on the “and” of 4 that the next bar would hold.
  - *Skill it builds:* Hearing where an anticipated note really starts, so that a push is written on the “and”, not on the beat it leans into.
  - *Theory and tips:* Sing the bar back with the counts: “1 2 3 &” where the last note comes early. Writing it on the beat is the common fault.
- **Source of the level (exact settings):**

```js
{n:'Syncopation II: ties into the beat',d:'Anticipations of 2, 3, 4 and 1: a note on the “and” held over the next beat',g:[rdQ({cells:['q','tie','push1','push3'],must:['tie','push1','push3'],what:'with notes that arrive half a beat early',hint:'Which click passes without a new sound? The note before it started on the “and” and was tied over.'}),rdQ({cells:RD_V[7],must:['tie','ant','qt','push1','push3']})]}
```

#### Rhythm Dictation 8: Eighth-note triplets

- **Description:** Three in a click
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with triplets, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e3 e3 e3 e3 e3 e3 e3 e3 e3 e3 e3 e3. (answered by **writing the rhythm value by value**)
    - hint: Two sounds in a click or three? Three even sounds are a triplet (t, then three eighths).
    - explanation after answering: Counts: 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e e e3 e3 e3 e3 q3 q3 e3. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 1& 2 2-trip 2-let 3 3-trip 4 4-let.
- **Level note (the Details button):**
  - *Key takeaways:* Three even sounds in one click are an eighth-note triplet: 1 trip let. / Triplet quarter and eighth (long, short) and eighth and quarter (short, long) are the same three slots with two of them joined.
  - *What to pay attention to:* Before the values, ask: is this beat cut in two or in three? / In the writer, press t, then write the three eighths (or quarter and eighth): the triplet ends by itself when the group fills the beat.
  - *Skill it builds:* Telling two from three inside one beat, the difference between a straight and a triplet feel.
  - *Theory and tips:* Triplets sound round and rolling; two eighths sound square. Say both over the click and listen to which one fits.
- **Source of the level (exact settings):**

```js
{n:'Eighth-note triplets',d:'Three in a click',g:[rdQ({cells:['q','trip'],must:['trip'],what:'with triplets',hint:'Two sounds in a click or three? Three even sounds are a triplet (t, then three eighths).'}),rdQ({cells:RD_V[8],must:['trip','tqe','teq']})]}
```

#### Rhythm Dictation 9: Quarter-note triplets

- **Description:** Three even notes over two clicks
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with a quarter-note triplet, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h q3 q3 q3. (answered by **writing the rhythm value by value**)
    - hint: Three even notes across two clicks: only the first lands on a click. Write t, then three quarters.
    - explanation after answering: Counts: 1 3 3-let 4-trip.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: q3 q3 q3 e3 e3 e3 e e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 1-let 2-trip 3 3-trip 3-let 4 4&.
- **Level note (the Details button):**
  - *Key takeaways:* A quarter-note triplet is three even notes across two clicks. Only the first lands on a click.
  - *What to pay attention to:* Count the two clicks: the second and third notes fall between them, not on them. / It is slower than an eighth-note triplet and floats against the beat.
  - *Skill it builds:* Hearing a figure that crosses the beat evenly, common in melodies and comping.
  - *Theory and tips:* Each note of the group is two thirds of a beat. In the writer: t, then three quarters.
- **Source of the level (exact settings):**

```js
{n:'Quarter-note triplets',d:'Three even notes over two clicks',g:[rdQ({cells:['q','h','qtrip'],must:['qtrip'],what:'with a quarter-note triplet',hint:'Three even notes across two clicks: only the first lands on a click. Write t, then three quarters.'}),rdQ({cells:RD_V[9],must:['qtrip']})]}
```

#### Rhythm Dictation 10: Sixteenths

- **Description:** Four in a click, and the groupings 1 & a, 1 e &, 1 e a
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with sixteenths, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: s s s s e e e e q. (answered by **writing the rhythm value by value**)
    - hint: Count 1 e & a. Four even sounds in a click are four sixteenths.
    - explanation after answering: Counts: 1 1e 1& 1a 2 2& 3 3& 4.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: s e s q s s s s e s s. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 1e 1a 2 3 3e 3& 3a 4 4& 4a.
- **Level note (the Details button):**
  - *Key takeaways:* Four even sounds in one click are sixteenths: 1 e & a. / The groupings: eighth and two sixteenths (1 & a), two sixteenths and an eighth (1 e &), sixteenth, eighth, sixteenth (1 e a).
  - *What to pay attention to:* Which of the four slots sound? Count them on your fingers if you must. / The tempo is held at 80 or slower: the sixteenths come quickly.
  - *Skill it builds:* Cutting the beat in four by ear: the funk, Latin and bebop subdivision.
  - *Theory and tips:* Sing the bar at half speed in your head: the sixteenths become eighths you already know.
- **Source of the level (exact settings):**

```js
{n:'Sixteenths',d:'Four in a click, and the groupings 1 & a, 1 e &, 1 e a',g:[rdQ({cells:['q','ee','ssss'],must:['ssss'],max:80,what:'with sixteenths',hint:'Count 1 e & a. Four even sounds in a click are four sixteenths.'}),rdQ({cells:RD_V[10],must:['ssss','ess','sse','ses'],max:80})]}
```

#### Rhythm Dictation 11: Dotted eighth and sixteenth

- **Description:** Long, then very short: the 1 and the a
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with dotted eighths, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: q q q s e.. (answered by **writing the rhythm value by value**)
    - hint: Long then short with the short one late: a dotted eighth and a sixteenth (1 … a). Short then long: a sixteenth and a dotted eighth (1 e …).
    - explanation after answering: Counts: 1 2 3 4 4e.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: q q e. s e. s. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 2 3 3a 4 4a.
- **Level note (the Details button):**
  - *Key takeaways:* A dotted eighth and a sixteenth is long, short, with the short note on the “a”, just before the next click. / A sixteenth and a dotted eighth is short, long: the long note starts on the “e”.
  - *What to pay attention to:* Do not confuse the dotted eighth and sixteenth with a triplet quarter and eighth: the sixteenth is later and shorter. / Count 1 e & a and listen for which slot the second note takes.
  - *Skill it builds:* Hearing an uneven split of the beat precisely.
  - *Theory and tips:* In the writer the dot goes before the value: . e then s.
- **Source of the level (exact settings):**

```js
{n:'Dotted eighth and sixteenth',d:'Long, then very short: the 1 and the a',g:[rdQ({cells:['q','des','sde'],must:['des','sde'],max:80,what:'with dotted eighths',hint:'Long then short with the short one late: a dotted eighth and a sixteenth (1 … a). Short then long: a sixteenth and a dotted eighth (1 e …).'}),rdQ({cells:RD_V[11],must:['des','sde'],max:80})]}
```

#### Rhythm Dictation 12: Sixteenth rests

- **Description:** A sixteenth missing at the start or the end of the beat
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, with sixteenth rests, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: s s s s s s s s q rs s s s. (answered by **writing the rhythm value by value**)
    - hint: Count 1 e & a. Which of the four is silent? A missing 1 is a rest at the start of the beat.
    - explanation after answering: Counts: 1 1e 1& 1a 2 2e 2& 2a 3 4e 4& 4a.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: rs s e rs s s s s s s rs e s rs. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1e 1& 2e 2& 2a 3 3e 3& 4 4&.
- **Level note (the Details button):**
  - *Key takeaways:* A sixteenth rest leaves one of the four slots silent: the first (a rest, then e & a) or the last (1 e &, then a rest).
  - *What to pay attention to:* A missing first sixteenth makes the beat start late; listen for the click alone, without a sound on it. / Eighth, sixteenth, sixteenth rest: the last slot is silent but the beat is full.
  - *Skill it builds:* Hearing silence at the smallest scale, which is what makes funk and Latin rhythms bite.
  - *Theory and tips:* Rests are graded by where the silence is: a sixteenth that is not there must be written as a rest, not left out.
- **Source of the level (exact settings):**

```js
{n:'Sixteenth rests',d:'A sixteenth missing at the start or the end of the beat',g:[rdQ({cells:['q','ssss','rsss','sssr'],must:['rsss','sssr'],max:80,what:'with sixteenth rests',hint:'Count 1 e & a. Which of the four is silent? A missing 1 is a rest at the start of the beat.'}),rdQ({cells:RD_V[12],must:['rsss','sssr','rse','esr'],max:80})]}
```

#### Rhythm Dictation 13: 6/8

- **Description:** Two beats a bar, three eighths to a beat
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 6/8, on the piano with the click (two clicks a bar: each click is a dotted quarter); one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: h.. (answered by **writing the rhythm value by value**)
    - hint: Count 1 & a 2 & a: each click is a dotted quarter. One sound on a click that lasts to the next click is a dotted quarter; three are eighths.
    - explanation after answering: Counts: 1.
  - **Generator 2**, sample: “Listen: 1 bar of 6/8, on the piano with the click (two clicks a bar: each click is a dotted quarter); one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: rq. re e e. (answered by **writing the rhythm value by value**)
    - hint: Count 1 & a 2 & a. Quarter then eighth (long, short) or eighth then quarter (short, long) inside one click.
    - explanation after answering: Counts: & a.
- **Level note (the Details button):**
  - *Key takeaways:* 6/8 is two beats a bar, each a dotted quarter divided in three eighths. The click is the dotted quarter. / A dotted half fills the bar; a quarter and an eighth, or an eighth and a quarter, fill one beat.
  - *What to pay attention to:* Count 1 & a 2 & a: the click falls on 1 and 2 only. / Long, short inside one click is quarter then eighth; short, long is eighth then quarter.
  - *Skill it builds:* Writing a compound meter, where the beat divides in three and the felt pulse is slower than the eighths.
  - *Theory and tips:* In 6/8 the writer counts in eighths: an eighth is e, a quarter q, a dotted quarter . q, a dotted half . h.
- **Source of the level (exact settings):**

```js
{n:'6/8',d:'Two beats a bar, three eighths to a beat',g:[rdQ({cells:['d3','e3','dh'],M:6,max:60,hint:'Count 1 & a 2 & a: each click is a dotted quarter. One sound on a click that lasts to the next click is a dotted quarter; three are eighths.'}),rdQ({cells:RD68_ALL,M:6,max:60,hint:'Count 1 & a 2 & a. Quarter then eighth (long, short) or eighth then quarter (short, long) inside one click.'})]}
```

#### Rhythm Dictation 14: Swing

- **Description:** Heard swung, written straight, as jazz is written: the Charleston, pushes, eighths
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write. The eighths are swung: write them as plain eighths, as jazz is written.” → answer: q q q q. (answered by **writing the rhythm value by value**)
    - hint: Where are the two hits of the Charleston? On 1 and the “and” of 2, or moved along the bar. Swung eighths are written as plain eighths.
    - explanation after answering: Counts: 1 2 3 4.
  - **Generator 2**, sample: “Listen: 1 bar of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write. The eighths are swung: write them as plain eighths, as jazz is written.” → answer: rq re q q.. (answered by **writing the rhythm value by value**)
    - hint: Long, short in the sound is two plain eighths on the page. A hit on the “and” of 4 or of 2, held, is a push.
    - explanation after answering: Counts: 2& 3&.
- **Level note (the Details button):**
  - *Key takeaways:* Swung eighths are heard long, short and written as plain eighths: the convention of every lead sheet. / The Charleston (1 and the “and” of 2), its displacements, and the pushes are whole-bar figures heard swung.
  - *What to pay attention to:* Do not write a dotted eighth and sixteenth or a triplet for a swung pair. / The swung “and” comes late, two thirds into the beat: hear it as the “and”, not as a new beat.
  - *Skill it builds:* Writing jazz rhythm the way jazz is written, so a transcription reads like a chart.
  - *Theory and tips:* The swing ratio narrows as the tempo rises; the writing does not change.
- **Source of the level (exact settings):**

```js
{n:'Swing',d:'Heard swung, written straight, as jazz is written: the Charleston, pushes, eighths',g:[rdQ({cells:['charl','charl2','charl3','q'],swing:true,hint:'Where are the two hits of the Charleston? On 1 and the “and” of 2, or moved along the bar. Swung eighths are written as plain eighths.'}),rdQ({cells:RD_V[14],swing:true,hint:'Long, short in the sound is two plain eighths on the page. A hit on the “and” of 4 or of 2, held, is a push.'})]}
```

#### Rhythm Dictation 15: Two bars

- **Description:** Every 4/4 figure so far, two bars at a time
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 2 bars of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: rq h. re e e q. e re. (answered by **writing the rhythm value by value**)
    - hint: Write bar 1 in full before you start bar 2. Keep counting the clicks through the bar line.
    - explanation after answering: Counts: 2 1& 2 2& 4.
  - **Generator 2**, sample: “Listen: 2 bars of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: q e h_e e3 e3 e3 e q. re e. (answered by **writing the rhythm value by value**)
    - hint: Find bar 1 first: the click with the accent starts each bar.
    - explanation after answering: Counts: 1 2 2& 1 1-trip 1-let 2 2& 4&.
- **Level note (the Details button):**
  - *What this level adds:* Two bars at a time, every 4/4 figure of the ladder: quarters to sixteenths, rests, ties and dots, syncopation and triplets.
  - *What to pay attention to:* Write bar 1 in full before you start bar 2. The accented click marks each new bar. / A note may be held over the bar line: write it to the end of bar 1 and tie it into bar 2.
  - *Theory and tips:* Two bars test memory as much as hearing. Hold the first bar by singing it back before the second hearing.
- **Source of the level (exact settings):**

```js
{n:'Two bars',d:'Every 4/4 figure so far, two bars at a time',g:[rdQ({cells:RD_SIMPLE.concat(['w']),bars:2,hint:'Write bar 1 in full before you start bar 2. Keep counting the clicks through the bar line.'}),rdQ({cells:RD_V[15],bars:2,max:80,hint:'Find bar 1 first: the click with the accent starts each bar.'})]}
```

#### Rhythm Dictation 16: Two bars: everything

- **Description:** Everything so far, 3/4, 6/8 and swing included, and the broken triplets
- **Input:** screen
- **Kind:** round level, 5 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Listen: 2 bars of 4/4, with broken triplets, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e3 e3 e3 q q e3 e3 e3 q e3 re3 e3 e3 e3 e3 e3 e3 re3. (answered by **writing the rhythm value by value**)
    - hint: A triplet with a sound missing: count 1 trip let and find the silent one.
    - explanation after answering: Counts: 1 1-trip 1-let 2 3 4 4-trip 4-let 1 2 2-let 3 3-trip 3-let 4 4-trip.
  - **Generator 2**, sample: “Listen: 2 bars of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e q e q3 q3 q3 q3 e3 e q. rs s s s. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 1& 2& 3 3-let 4-trip 1 1-let 2 2& 4e 4& 4a.
  - **Generator 3**, sample: “Listen: 2 bars of 3/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: re e e q. h e e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1& 2 2& 1 3 3&.
  - **Generator 4**, sample: “Listen: 2 bars of 6/8, on the piano with the click (two clicks a bar: each click is a dotted quarter); one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write.” → answer: e q q. q re re e e. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 & 2 | 1 & a.
  - **Generator 5**, sample: “Listen: 2 bars of 4/4, on the piano with the click; one bar of clicks counts you in. Write it down value by value; the bar is drawn as you write. The eighths are swung: write them as plain eighths, as jazz is written.” → answer: q e q e e e re q. h. (answered by **writing the rhythm value by value**)
    - hint: Count the clicks; mark where the notes fall between them, then write beat by beat: a note that lasts to the next click is a quarter, two in a beat are eighths, silence is a rest.
    - explanation after answering: Counts: 1 2 2& 3& 4 4& 1& 3.
- **Level note (the Details button):**
  - *What this level adds:* Two bars of anything: 4/4, 3/4, 6/8 and swing, and the broken triplets, a triplet with one of its three notes silent.
  - *What to pay attention to:* Find the meter first: four clicks, three, or two slow ones. The writer says which meter the bar is in. / Broken triplet: count 1 trip let and find the silent one; write it as a triplet eighth rest.
- **Source of the level (exact settings):**

```js
{n:'Two bars: everything',d:'Everything so far, 3/4, 6/8 and swing included, and the broken triplets',g:[rdQ({cells:['q','trip','trn','tnr','tnrn'],must:['trn','tnr','tnrn'],bars:2,what:'with broken triplets',hint:'A triplet with a sound missing: count 1 trip let and find the silent one.'}),rdQ({cells:RD_V[16].filter(c=>RCELL[c]&&!['charl','charl2','charl3','push1','push3'].includes(c)),bars:2,max:80}),rdQ({cells:RD_V[5],M:3,bars:2}),rdQ({cells:RD68_ALL,M:6,bars:2,max:60}),rdQ({cells:RD_V[14],swing:true,bars:2})]}
```

**Also helps: Reading Rhythm 27–29** (written accents over a running subdivision)

#### Reading Rhythm 27: Accented eighth notes

- **Description:** Eighths that never stop, with written accents (strummed: needs the microphone)
- **Input:** guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, written accents (strummed, louder notes measured).
- **Tempo advice:** 70–100 bpm, start at 80. Why: Running eighths with accents: slow enough to shape loud and soft on purpose.
- **Note shown while playing:** Strum every eighth; the notes marked > clearly louder.
- **Four sample bars (where the notes start):** 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* A stream of eighth notes that never stops, with accents on some of them: two or three a bar, in different places every bar. The accented notes are the rhythm; the others are the engine. / This level needs the microphone: strum muted strings. A key has no loudness.
  - *What to pay attention to:* Accented strokes clearly louder, the rest light and even. / An accent must not arrive early. Loud and early are separate things. / Down on the beat, up on the “and”, whatever is accented.
  - *Skill it builds:* Constant strumming with accents, the basis of rhythm guitar.
  - *Theory and tips:* The level measures how much louder the accented strums are than the others: about 5 dB is needed. / Clap the accents alone first. That is the rhythm the listener hears.
- **Source of the level (exact settings):**

```js
{n:'Accented eighth notes',d:'Eighths that never stop, with written accents (strummed: needs the microphone)',g:[accentQ(2,'mark','the marked notes')],c:cAcc(2,{tp:[70,100,80,'Running eighths with accents: slow enough to shape loud and soft on purpose.'],note:'Strum every eighth; the notes marked > clearly louder.'})}
```

#### Reading Rhythm 28: Accented triplets

- **Description:** Triplets that never stop, with written accents (strummed)
- **Input:** guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, written accents (strummed, louder notes measured).
- **Tempo advice:** 60–84 bpm, start at 66. Why: Three strokes a beat with accents on any of them: keep the click slow.
- **Note shown while playing:** Strum every triplet eighth; the notes marked > clearly louder.
- **Four sample bars (where the notes start):** 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let | 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let | 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let | 1 1-trip 1-let 2 2-trip 2-let 3 3-trip 3-let 4 4-trip 4-let
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The same over triplets: two to four accents a bar, anywhere in the bar, different every bar.
  - *What to pay attention to:* Accents on the second or third note of a triplet are the hard ones. / The stroke direction alternates, so accents fall on up-strokes too.
  - *Theory and tips:* Accenting every second triplet note gives quarter-note triplets. Accenting every fourth gives three accents across four beats.
- **Source of the level (exact settings):**

```js
{n:'Accented triplets',d:'Triplets that never stop, with written accents (strummed)',g:[accentQ(1,'mark3','the marked notes')],c:cAcc(3,{tp:[60,84,66,'Three strokes a beat with accents on any of them: keep the click slow.'],noTup:false,note:'Strum every triplet eighth; the notes marked > clearly louder.'})}
```

#### Reading Rhythm 29: Accented sixteenths

- **Description:** Sixteenths that never stop, with written accents (strummed)
- **Input:** guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, written accents (strummed, louder notes measured).
- **Tempo advice:** 50–72 bpm, start at 56. Why: Four strokes a beat: the contrast between loud and light is only controllable slowly.
- **Note shown while playing:** Strum every sixteenth; the notes marked > clearly louder.
- **Four sample bars (where the notes start):** 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a | 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a | 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a | 1 1e 1& 1a 2 2e 2& 2a 3 3e 3& 3a 4 4e 4& 4a
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The same over sixteenths: two to four accents a bar, anywhere in the bar, different every bar.
  - *What to pay attention to:* Accents on the “e” and the “a”. / Keep the unaccented strokes very light: at this speed the contrast is the whole exercise.
  - *Theory and tips:* Accents every three sixteenths, grouped 3 + 3 + 3 + 3 + 4, are the funk and Latin figure heard everywhere.
- **Source of the level (exact settings):**

```js
{n:'Accented sixteenths',d:'Sixteenths that never stop, with written accents (strummed)',g:[accentQ(2,'mark16','the marked notes')],c:cAcc(4,{tp:[50,72,56,'Four strokes a beat: the contrast between loud and light is only controllable slowly.'],note:'Strum every sixteenth; the notes marked > clearly louder.'})}
```

**Also helps: Pulse & Feel 7–12** (the click on 2 and 4 and swing, for swung lines)

#### Pulse & Feel 7: 4 only; the and of 4

- **Description:** With the band: the hi-hat once a bar, then only on the off-beat before the bar line
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, over a band (walking bass and hi-hat).
- **Tempo advice:** 140–220 bpm, start at 160. Why: One hi-hat a bar: at 160 it comes every second and a half and feels like a pickup into beat 1. Under 140 the gap is too long to feel as a pulse.
- **Note shown while playing:** Eight bars with the hi-hat on 4 only, then eight where it sounds only on the and of 4. The bass keeps walking.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 2 3 4 | 1 2 3 4 | 1 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Less hi-hat. First once a bar on beat 4, then only on the eighth note before the bar line. The bass keeps walking under you.
  - *What to pay attention to:* The click should arrive where you expected it. If it surprises you, your bar was the wrong length. / Do not speed up to meet it. Play your time and see where it falls.
  - *Theory and tips:* The fewer reference points, the more honest the test. A click on the and of 4 only tells you the truth once a bar. / This is the feeling of playing with a drummer who is playing around the beat instead of stating it.
- **Source of the level (exact settings):**

```js
{n:'4 only; the and of 4',d:'With the band: the hi-hat once a bar, then only on the off-beat before the bar line',g:[twoFourQ('4'),twoFourQ('and4')],c:{back:{},bar:()=>subdivBar(4,1),click:(bar,b)=>bar%16<8?b===3:false,extra:(bar,b)=>bar%16>=8&&b===3?[0.5]:null,tp:[140,220,160,'One hi-hat a bar: at 160 it comes every second and a half and feels like a pickup into beat 1. Under 140 the gap is too long to feel as a pulse.'],note:'Eight bars with the hi-hat on 4 only, then eight where it sounds only on the and of 4. The bass keeps walking.'}}
```

#### Pulse & Feel 8: Be the hi-hat: 2 and 4

- **Description:** The band plays all four beats; you play only 2 and 4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, over a band (walking bass and hi-hat).
- **Tempo advice:** 80–140 bpm, start at 100. Why: Your two notes are a half note apart: at 100 that is 1.2 seconds, long enough to need counting and short enough to feel.
- **Note shown while playing:** Swap roles: the click and the bass play the beat, you are the hi-hat on 2 and 4. After eight bars the click stays only on beat 1.
- **Four sample bars (where the notes start):** 2 4 | 2 4 | 2 4 | 2 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* The roles are swapped. The click and the bass play every beat, and you play only where the hi-hat goes: on 2 and 4. / Producing the backbeat teaches its place from the inside.
  - *What to pay attention to:* Nothing on 1 and 3. Feel them and leave them empty. / After eight bars the click stays on beat 1 only: now you and the bass hold the bar. / Your two notes should be the same distance apart every time.
  - *Skill it builds:* Owning the backbeat. A player who can place 2 and 4 alone can play with any rhythm section.
  - *Theory and tips:* This is what a drummer’s left foot does on the hi-hat all night. / Do it away from the instrument too: clap 2 and 4 with a record without drifting onto 1 and 3.
- **Source of the level (exact settings):**

```js
{n:'Be the hi-hat: 2 and 4',d:'The band plays all four beats; you play only 2 and 4',g:[twoFourQ('24')],c:{back:{tick:true},bar:()=>({on:[1,3],ev:[{t:0,d:1,rest:1},{t:1,d:1},{t:2,d:1,rest:1},{t:3,d:1}],label:'you: 2 and 4'}),click:(bar,b)=>bar%16<8?true:b===0,tp:[80,140,100,'Your two notes are a half note apart: at 100 that is 1.2 seconds, long enough to need counting and short enough to feel.'],note:'Swap roles: the click and the bass play the beat, you are the hi-hat on 2 and 4. After eight bars the click stays only on beat 1.'}}
```

#### Pulse & Feel 9: Be the hi-hat: 4 only

- **Description:** One note a bar, on beat 4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, over a band (walking bass and hi-hat).
- **Tempo advice:** 100–160 bpm, start at 120. Why: One note a bar: at 120 your notes are two seconds apart, the outer edge of what can be felt as a pulse. Slower turns it into guessing.
- **Note shown while playing:** You play beat 4 of every bar and nothing else. After eight bars the click stays only on beat 1.
- **Four sample bars (where the notes start):** 4 | 4 | 4 | 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* One note a bar, on beat 4.
  - *What to pay attention to:* Three beats of silence to count: “1 2 3 play”. / Beat 4 leads into 1. Hear it as a pickup, not as an ending.
  - *Theory and tips:* The fewer notes you play, the more exactly each one shows your time.
- **Source of the level (exact settings):**

```js
{n:'Be the hi-hat: 4 only',d:'One note a bar, on beat 4',g:[twoFourQ('4')],c:{back:{tick:true},bar:()=>({on:[3],ev:[{t:0,d:2,rest:1},{t:2,d:1,rest:1},{t:3,d:1}],label:'you: beat 4'}),click:(bar,b)=>bar%16<8?true:b===0,tp:[100,160,120,'One note a bar: at 120 your notes are two seconds apart, the outer edge of what can be felt as a pulse. Slower turns it into guessing.'],note:'You play beat 4 of every bar and nothing else. After eight bars the click stays only on beat 1.'}}
```

#### Pulse & Feel 10: Be the hi-hat: the and of 4

- **Description:** One note a bar, on the last eighth
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, over a band (walking bass and hi-hat).
- **Tempo advice:** 90–140 bpm, start at 110. Why: An off-beat once a bar: the tempo has to be quick enough for the bar to hold together and slow enough to place the eighth.
- **Note shown while playing:** You play only the and of 4: the push into the next bar. After eight bars the click stays only on beat 1.
- **Four sample bars (where the notes start):** 4& | 4& | 4& | 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* One note a bar, on the last eighth note: the “and” of 4.
  - *What to pay attention to:* It comes after beat 4, not on it. Feel 4 in your foot and play just after. / It must not pull the next beat 1 early.
  - *Theory and tips:* This is the push, the anticipation of the next bar. At a swing tempo it sits late in the beat, close to the next downbeat.
- **Source of the level (exact settings):**

```js
{n:'Be the hi-hat: the and of 4',d:'One note a bar, on the last eighth',g:[twoFourQ('and4')],c:{back:{tick:true},bar:()=>({on:[3.5],ev:[{t:0,d:2,rest:1},{t:2,d:1,rest:1},{t:3,d:.5,rest:1},{t:3.5,d:.5}],label:'you: the and of 4'}),click:(bar,b)=>bar%16<8?true:b===0,tp:[90,140,110,'An off-beat once a bar: the tempo has to be quick enough for the bar to hold together and slow enough to place the eighth.'],note:'You play only the and of 4: the push into the next bar. After eight bars the click stays only on beat 1.'}}
```

#### Pulse & Feel 11: Drop-outs

- **Description:** The band keeps leaving: two, four, then eight bars alone
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, over a band (walking bass and hi-hat).
- **Tempo advice:** 90–140 bpm, start at 100. Why: A natural walking tempo: the test is carrying it through silence, and a tempo the body likes is the fair one to carry.
- **Note shown while playing:** The bass and the hi-hat drop out for 2, then 4, then 8 bars; keep the quarters going and be there when they come back.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 2 3 4 | 1 2 3 4 | 1 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* The band disappears completely for two, four, then eight bars and comes back. Your job is to be where it is when it returns.
  - *What to pay attention to:* Whether you rush or drag when alone. Most players rush when it is quiet and drag when it gets hard. / Keep counting bars. Losing the form is a different mistake from losing the tempo, and you can do both.
  - *Theory and tips:* This is the closest practice to real playing: nobody on stage gives you a click. / Sing the subdivision in your head during the silence. A pulse you only feel on the beats will drift.
- **Source of the level (exact settings):**

```js
{n:'Drop-outs',d:'The band keeps leaving: two, four, then eight bars alone',g:[twoFourQ('drop'),twoFourQ('drop4'),twoFourQ('drop8')],c:cSub(1,{back:{band:bar=>{const c=bar%20;return c<2||(c>=4&&c<6)||(c>=10&&c<12);}},click:(bar,b)=>{const c=bar%20;return (c<2||(c>=4&&c<6)||(c>=10&&c<12))&&(b===1||b===3);},tp:[90,140,100,'A natural walking tempo: the test is carrying it through silence, and a tempo the body likes is the fair one to carry.'],note:'The bass and the hi-hat drop out for 2, then 4, then 8 bars; keep the quarters going and be there when they come back.'})}
```

#### Pulse & Feel 12: Swing and off-beats

- **Description:** With the band: long–short swing eighths; then only the “and”
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing, over a band (walking bass and hi-hat).
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Note shown while playing:** Four bars of swing eighths, four bars of off-beats only, round and round, over the bass with the hi-hat on 2 and 4.
- **Four sample bars (where the notes start):** 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4& | 1 1& 2 2& 3 3& 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Swing eighths are long–short: the off-beat moves later, toward the last third of the beat. / Then the hardest version: only the off-beats, with nothing played on the beat.
  - *What to pay attention to:* The short note. It should be late and light, not a dotted rhythm. / When playing only the “and”, keep the beat in your foot or you will slide onto the beat.
  - *Skill it builds:* Swing feel in the hands, and independence of the off-beat, which is where jazz comping and phrasing live.
  - *Theory and tips:* The swing ratio is not fixed. At slow tempos it is close to 2:1; at fast tempos the eighths even out almost completely. / Accent the off-beat slightly and slur into the beat. Horn players do this with the tongue; guitarists do it with the pick and the left hand.
- **Source of the level (exact settings):**

```js
{n:'Swing and off-beats',d:'With the band: long–short swing eighths; then only the “and”',g:[subdivQ('swing'),subdivQ('off')],c:{back:{},swing:true,click:(bar,b)=>b===1||b===3,bar:k=>k%8<4?swingBar():offBar(),tp:[100,130,110,'Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).'],note:'Four bars of swing eighths, four bars of off-beats only, round and round, over the bass with the hi-hat on 2 and 4.'}}
```

**Also helps: Jazz Rhythm 7–11** (hemiola, bebop cells, the jazz waltz, your own transcribed rhythms)

#### Jazz Rhythm 7: Hemiola

- **Description:** Dotted quarters across the bar line: 3 over 4 for two bars
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Note shown while playing:** Two bars of hemiola, then two bars drawn from the dotted chain inside the bar, the Charleston and plain quarters.
- **Four sample bars (where the notes start):** 1 2& 4 | 1& 3 4& | 1 2 3 4 | 1 2&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Hemiola: the dotted-quarter pattern continued across the bar line for two bars.
  - *What to pay attention to:* Count the bars while the pattern crosses them. The figure lines up with beat 1 again only after three bars of it; here you hold it for two. / Keep the foot in four.
  - *Theory and tips:* Three-beat groups over four-beat bars is the oldest rhythmic device in jazz. Listen for it in Basie riffs and in Monk.
- **Source of the level (exact settings):**

```js
{n:'Hemiola',d:'Dotted quarters across the bar line: 3 over 4 for two bars',g:[tapReadQ(['hemi','dots3','q'],2,true)],c:{swing:true,bar:k=>k%4<2?hemiBar(k):(r=>({on:r.on,ev:r.ev}))(rhyBar(['dots3','charl','q'],1,true,4)),note:'Two bars of hemiola, then two bars drawn from the dotted chain inside the bar, the Charleston and plain quarters.'}}
```

#### Jazz Rhythm 8: Bebop cells

- **Description:** Running eighths, triplet pick-ups, the pushed last note
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 2 2-trip 2-let 3 4 4& | 1& 2 2-trip 3 4 4& | 1 2 2& 4 4-trip 4-let | 2 2-trip 2-let 3 4 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Bebop rhythm cells: running eighths, a triplet pick-up into a beat, a pushed last note.
  - *What to pay attention to:* The triplet is an ornament. It must not slow the eighths after it. / The last note of a cell is early and short.
  - *Theory and tips:* Bebop lines are mostly eighth notes with accents on the off-beats and on the high points of the line. The rhythm is in the accents.
- **Source of the level (exact settings):**

```js
{n:'Bebop cells',d:'Running eighths, triplet pick-ups, the pushed last note',g:[tapReadQ(['bop','eqe','pick','teq','qt','re'],2,true)],c:cCells(['bop','eqe','pick','teq','qt','re'],true)}
```

#### Jazz Rhythm 9: Jazz waltz

- **Description:** Swing in 3/4
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 3/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Note shown while playing:** Jazz waltz: swing in 3/4.
- **Four sample bars (where the notes start):** 1 2 | 1 1& 2& 3& | 1 2& 3& | 1 1& 2& 3 3&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Swing in 3/4.
  - *What to pay attention to:* Three beats a bar with the lilt on the off-beat eighths. / Common figure: a hit on 1 and on the “and” of 2.
  - *Theory and tips:* Jazz waltzes are often felt in one, with a two-against-three figure across the bar. “Someday My Prince Will Come” and “Bluesette” are the classroom examples.
- **Source of the level (exact settings):**

```js
{n:'Jazz waltz',d:'Swing in 3/4',g:[tapReadQ(['q','ee','qe','eqe','h','re'],2,true,{meter:3}),tapReadQ(['q','ee','qe','h','r','eqe'],2,true,{meter:5})],c:cCells(['q','ee','qe','eqe','h','re'],true,3,{note:'Jazz waltz: swing in 3/4.'})}
```

#### Jazz Rhythm 10: All the figures

- **Description:** The figures mixed, swung, bar after bar
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 2 2& 3 3& 4 4& | 2 2& 3 3& 4 4& | 1& 2 2& 3 3& 4& | 1 2 3& 4&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* All the figures mixed and swung, bar after bar.
  - *What to pay attention to:* Recognise each bar as a figure you know before you play it. / Recovery: skip to the next bar line, never back.
  - *Theory and tips:* A comping player draws on this whole vocabulary by ear. Being able to read it is being able to learn it from other players’ transcriptions.
- **Source of the level (exact settings):**

```js
{n:'All the figures',d:'The figures mixed, swung, bar after bar',g:[tapReadQ(['charl','push1','dots3','phrA','phrB','bop','eqe','qe','q','ee','re'],8,true)],c:cCells(['charl','push1','dots3','phrA','phrB','bop','eqe','qe','q','ee','re'],true)}
```

#### Jazz Rhythm 11: Your standards

- **Description:** The melody rhythms you transcribed (add them below)
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, swing.
- **Tempo advice:** 100–130 bpm, start at 110. Why: Swing eighths: under 100 they stop lilting and turn into a heavy triplet; over 130 the short note is too quick for one finger (strummed, up to 160).
- **Four sample bars (where the notes start):** 1 1& 2 2& 3 3& 4 4& | 1 2& 3 4& | 1& 2 2& 3 3& 4 4& | 1 2 2& 3& 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Rhythms you transcribed yourself from tunes you are learning.
  - *What to pay attention to:* Sing the tune while you tap. The rhythm should feel like the melody.
  - *Theory and tips:* The rhythm of a melody is half of the tune. Players who know the melody rhythm exactly phrase their solos better on that tune. / Enter the rhythm in the box under the levels: w h q e s, a dot for dotted, r for rests, _ for a tie, | for bar lines.
- **Source of the level (exact settings):**

```js
{n:'Your standards',d:'The melody rhythms you transcribed (add them below)',g:[tuneQ()],c:{swing:true,bar:k=>tuneBar(k)||(r=>({on:r.on,ev:r.ev,label:'etude (add a tune below for your own)'}))(rhyBar(['charl','push1','dots3','phrA','bop','eqe','qe','q','ee'],1,true,4))}}
```

**Also helps: Scale Runner 3–15** (the position fingerings in more keys and patterns)

#### Scale Runner 3: Eighth notes

- **Description:** The same run, two notes per click
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “G major Position III Whole position · from the tonic Eighth notes · 2 per click Tonic → top note → bottom note → back up to the tonic · fourth-finger stretches (red rings)” → answer: G A B C D E F♯ G A B C D E F♯ G A B A G F♯ E D C B A G F♯ E D C B A G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: G major in position III is Leavitt’s fingering type 4C: G A B C D E F♯ G… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
- **Level note (the Details button):**
  - *What this level adds:* The same run in eighth notes: two notes per click.
  - *What to pay attention to:* The note on the click and the note between must be the same length. The off-beat note is the one that rushes. / Down-stroke on the click, up-stroke between, on every string.
  - *Theory and tips:* Evenness matters more than speed. The click is never faster than 80 on this level. / With two notes a beat the accent always falls on a down-stroke, so this is the easiest subdivision to keep even.
- **Source of the level (exact settings):**

```js
{n:'Eighth notes',d:'The same run, two notes per click',g:[scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['scale','tonic']],div:2})]}
```

#### Scale Runner 4: Triplets

- **Description:** The same run, three notes per click
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “F major Position II Whole position · from the tonic Triplets · 3 per click Tonic → top note → bottom note → back up to the tonic · first-finger stretches (red rings)” → answer: F G A B♭ C D E F G A B♭ C D E F G A G F E D C B♭ A G F E D C B♭ A G F. (answered by **playing it on the guitar**; click at 63 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: F major in position II is Leavitt’s fingering type 1A: F G A B♭ C D E F… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
- **Level note (the Details button):**
  - *What this level adds:* The same run in triplets: three notes per click.
  - *What to pay attention to:* Three equal notes. The usual fault is long–short–short. / Strict alternate picking means the click falls on a down-stroke, then on an up-stroke, in turn. Do not change the picking to avoid it.
  - *Theory and tips:* Triplets put the accent on a different finger and a different pick direction each beat, which evens out both hands. The click is never faster than 63 on this level. / Each string holds two or three notes, so the string change lands in a different place in every beat. That is the difficulty, and the benefit.
- **Source of the level (exact settings):**

```js
{n:'Triplets',d:'The same run, three notes per click',g:[scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['scale','tonic']],div:3})]}
```

#### Scale Runner 5: One octave from the root, in C

- **Description:** C major only. The movable forms: the root C on string 6, 5 or 4 under the second, fourth or first finger, and on string 3 under the first. Nine shapes, each in its own position
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position IX One octave · root on string 4, finger 2 Quarter notes · 1 per click Put finger 2 on C (string 4, fret 10): the hand is then in position IX. Up to the next C and back.” → answer: C D E F G A B C B A G F E D C. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 15 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Second finger on the root on string 6 or 5: the scale lies on three strings with no stretch. Any other start: look for where the half steps fall.
    - explanation after answering: C major from string 4, fret 10, with finger 2 on the root: C D E F G A B C. Three starting fingers give three one-octave shapes; every position is made of them. This one is part of fingering type 1A.
- **Level note (the Details button):**
  - *Key takeaways:* One octave of the scale from the root: the same eight notes, started from a different finger and string. / Only C here. There are nine places: C on string 6 under finger 2, 4 or 1; on string 5 under finger 2 or 1; on string 4 under finger 2, 4 or 1; on string 3 under finger 1. / Each one puts the hand in a different position. The finger on the root decides the position.
  - *What to pay attention to:* Before you play, see which finger is on the root and where the octave will end. / The shape from a second-finger root has no stretch on strings 6 and 5. From a first-finger root the fourth finger stretches; from a fourth-finger root the scale lies behind the root.
  - *Skill it builds:* Nine one-octave shapes that the hand knows by the finger on the root, before any key changes.
  - *Theory and tips:* The tenth shape, the root on string 5 under the fourth finger, does not fit C below the twelfth fret. It comes in the next level. / These shapes are what you reach for when a chord comes up: find its root, and the scale is already under the hand.
- **Source of the level (exact settings):**

```js
{n:'One octave from the root, in C',d:'C major only. The movable forms: the root C on string 6, 5 or 4 under the second, fourth or first finger, and on string 3 under the first. Nine shapes, each in its own position',g:[scOctQ({keys:['C'],maxPos:10})]}
```

#### Scale Runner 6: One octave from any root

- **Description:** The same shapes from any root: find the root on string 6, 5, 4 or 3 and go; twelve keys
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “B major Position VII One octave · root on string 6, finger 1 Quarter notes · 1 per click Put finger 1 on B (string 6, fret 7): the hand is then in position VII. Up to the next B and back.” → answer: B C♯ D♯ E F♯ G♯ A♯ B A♯ G♯ F♯ E D♯ C♯ B. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 15 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Second finger on the root on string 6 or 5: the scale lies on three strings with no stretch. Any other start: look for where the half steps fall.
    - explanation after answering: B major from string 6, fret 7, with finger 1 on the root: B C♯ D♯ E F♯ G♯ A♯ B. Three starting fingers give three one-octave shapes; every position is made of them. This one is part of fingering type 4C.
- **Level note (the Details button):**
  - *Key takeaways:* The octave as a movable shape. Put a finger on the root and the fingering follows. / Three starting fingers give three shapes: second finger, fourth finger, first finger. The root is on string 6, 5, 4 or 3.
  - *What to pay attention to:* The finger on the root decides the position: second finger on the root means the first finger is one fret lower. / From strings 4 and 3 the shape crosses onto string 2, which is tuned a major third above string 3: everything on strings 2 and 1 sits one fret higher than the same shape lower down. / From string 3 only the first finger leaves room for the whole octave inside one position. / Twelve keys: the shape moves, the degrees do not.
  - *Skill it builds:* Starting a scale from any root, anywhere, without first thinking of a whole position.
  - *Theory and tips:* With the second finger on the root on string 6 or 5, the octave lies on three strings without a stretch. / These one-octave shapes are the pieces the twelve fingering types are made of. A player who thinks in octave shapes and a player who thinks in positions end up with the same fingers on the same frets.
- **Source of the level (exact settings):**

```js
{n:'One octave from any root',d:'The same shapes from any root: find the root on string 6, 5, 4 or 3 and go; twelve keys',g:[scOctQ()]}
```

#### Scale Runner 7: Up to the 7th and back

- **Description:** 1 to 7 and down again in eighth notes: the chord tones land on the beats
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position XII Up to the 7th and back Eighth notes · 2 per click 1 up to 7, then down to 1: thirteen notes, the chord tones fall on the clicks” → answer: C D E F G A B A G F E D C. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 13 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: C major in position XII is Leavitt’s fingering type 3: C D E F G A B A… Up to the 7th, not the octave: in eighth notes that puts 1, 3, 5 and 7 on the beats going up and 5, 3, 1 on the beats coming down, so the scale already outlines its chord.
  - **Generator 2**, sample: “B♭ major Position XII Up to the 7th and back Eighth notes · 2 per click 1 up to 7, then down to 1: thirteen notes, the chord tones fall on the clicks · first-finger stretches (red rings)” → answer: B♭ C D E♭ F G A G F E♭ D C B♭. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 13 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: B♭ major in position XII is Leavitt’s fingering type 1: B♭ C D E♭ F G A G… Up to the 7th, not the octave: in eighth notes that puts 1, 3, 5 and 7 on the beats going up and 5, 3, 1 on the beats coming down, so the scale already outlines its chord.
- **Level note (the Details button):**
  - *Key takeaways:* Up to the 7th and back down to 1: thirteen notes, in eighth notes. / Turn on 7, not on the octave.
  - *What to pay attention to:* Going up, 1, 3, 5 and 7 fall on the clicks. Coming down, 5, 3 and 1 do. Listen for the chord inside the scale. / The turn on 7: no pause, straight back down.
  - *Skill it builds:* A scale that already sounds like its chord. It is the first step from running scales to playing lines.
  - *Theory and tips:* This way of practising scales comes from Barry Harris’s teaching. In eighths from the tonic, 1 3 5 7 fall on the beats going up; turning at the 7th, the way down puts 5 3 1 on the beats and the tonic lands on beat 3 of the second bar. / The chord tones drift off the beat only when a descent starts from the octave on a beat: then the beats get 1 6 4 2.
- **Source of the level (exact settings):**

```js
{n:'Up to the 7th and back',d:'1 to 7 and down again in eighth notes: the chord tones land on the beats',g:[scQ({pat:[['scale','bh']],div:2}),scQ({keys:['C','F','G','D','Bb'],pos:SC_SEVEN,pat:[['scale','bh']],div:2})]}
```

#### Scale Runner 8: First modes: 2 to 2, 5 to 5

- **Description:** In a position you know: from 2 to 2 over IIm7 is Dorian, from 5 to 5 over V7 is Mixolydian. You hear the chord first
- **Input:** guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “D Mixolydian Position IX D to D · up and back Quarter notes · 1 per click You hear the chord first” → answer: D E F♯ G A B C D E F♯ G A B C D C B A G F♯ E D C B A G F♯ E D. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 29 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Find every D in the position first; start and end there.
    - explanation after answering: D Mixolydian = D E F♯ G A B C: the notes of G major with D as home; its chord is D7. Nothing new under the fingers: the same position, a different note to land on.
- **Level note (the Details button):**
  - *Key takeaways:* A mode is the same scale with another note as home. / From 2 to 2 with IIm7 under it, the scale is Dorian. From 5 to 5 with V7 under it, it is Mixolydian. From 1 to 1 it is the major scale, also called Ionian.
  - *What to pay attention to:* You hear the chord first. Keep it in your ear and hear the home note as home. / Nothing new under the fingers: the position is one you know.
  - *Skill it builds:* The first step into modes: the three scales of a II–V–I are one scale with three homes.
  - *Theory and tips:* In C major: D Dorian over Dm7, G Mixolydian over G7, C Ionian over CMaj7. / Dorian is a minor scale with a natural 6. Mixolydian is a major scale with a ♭7.
- **Source of the level (exact settings):**

```js
{n:'First modes: 2 to 2, 5 to 5',d:'In a position you know: from 2 to 2 over IIm7 is Dorian, from 5 to 5 over V7 is Mixolydian. You hear the chord first',g:[scModeQ('home',[1,4],['C','G','F'])]}
```

#### Scale Runner 9: Groups of three and four

- **Description:** C major in eight positions: three scale notes from every degree, up and then down, in triplets; four from every degree in eighth notes; then the same in C, F and G. The whole position, every group it holds
- **Input:** guitar
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position VIII Groups of three · down from the top Triplets · 3 per click From the highest note of the position · fourth-finger stretches (red rings)” → answer: E D C D C B C B A B A G A G F G F E F E D E D C D C B C B A B A G A G F G F E F E D E D C. (answered by **playing it on the guitar**; click at 63 bpm; free start (the click runs, start on any click); 45 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position VIII is Leavitt’s fingering type 4C: E D C D C B C B A B A G… Groups of three: three scale notes, then the same from the next degree. The scale stops sounding like a scale and starts sounding like a line.
  - **Generator 2**, sample: “C major Position XII Groups of four · up Eighth notes · 2 per click From the lowest note of the position” → answer: E F G A F G A B G A B C A B C D B C D E C D E F D E F G E F G A F G A B G A B C A B C D B C D E C D E F D E F G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 56 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position XII is Leavitt’s fingering type 3: E F G A F G A B G A B C… Groups of four: four scale notes, then the same from the next degree. The scale stops sounding like a scale and starts sounding like a line.
  - **Generator 3**, sample: “F major Position VIII Groups of three · up Triplets · 3 per click From the lowest note of the position · fourth-finger stretches (red rings)” → answer: C D E D E F E F G F G A G A B♭ A B♭ C B♭ C D C D E D E F E F G F G A G A B♭ A B♭ C B♭ C D C D E. (answered by **playing it on the guitar**; click at 63 bpm; free start (the click runs, start on any click); 45 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: F major in position VIII is Leavitt’s fingering type 4B: C D E D E F E F G F G A… Groups of three: three scale notes, then the same from the next degree. The scale stops sounding like a scale and starts sounding like a line.
  - **Generator 4**, sample: “G major Position III Groups of four · down from the top Eighth notes · 2 per click From the highest note of the position · fourth-finger stretches (red rings)” → answer: B A G F♯ A G F♯ E G F♯ E D F♯ E D C E D C B D C B A C B A G B A G F♯ A G F♯ E G F♯ E D F♯ E D C E D C B D C B A C B A G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 56 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: G major in position III is Leavitt’s fingering type 4C: B A G F♯ A G F♯ E G F♯ E D… Groups of four: four scale notes, then the same from the next degree. The scale stops sounding like a scale and starts sounding like a line.
- **Level note (the Details button):**
  - *Key takeaways:* Groups of three and of four: three (or four) scale notes in a row from every degree, then the same from the next degree up. 1 2 3, 2 3 4, 3 4 5… and 1 2 3 4, 2 3 4 5… / Groups of three in triplets, groups of four in eighth notes: each group fills one click. / The whole position, every group it holds: up from the lowest note to the top, or down from the top note to the bottom.
  - *What to pay attention to:* The first note of each group falls on the click. Feel the group, not the single notes. / Down from the top the groups run 3 2 1, 4 3 2… from the top note: start on the highest note of the position.
  - *Skill it builds:* The first sequence. A scale played in groups stops sounding like an exercise and starts sounding like a line, and the hand learns every note of the position from every other.
  - *Theory and tips:* C first, in eight positions; then F and G. / If a group stumbles, play that one group four times, then go on.
- **Source of the level (exact settings):**

```js
{n:'Groups of three and four',d:'C major in eight positions: three scale notes from every degree, up and then down, in triplets; four from every degree in eighth notes; then the same in C, F and G. The whole position, every group it holds',g:[scQ({keys:['C'],pos:SC_SEVEN,pat:[['g3','up'],['g3','down']],div:3}),scQ({keys:['C'],pos:SC_SEVEN,pat:[['g4','up'],['g4','down']],div:2}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['g3','up'],['g3','down']],div:3}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['g4','up'],['g4','down']],div:2})]}
```

#### Scale Runner 10: Thirds, in C

- **Description:** C major only. One octave from the tonic, then the whole position: up, down, alternating; then in eighth notes
- **Input:** guitar
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position II Thirds · up · from the tonic Quarter notes · 1 per click Start on the lowest tonic: one octave of the pattern · first-finger stretches (red rings)” → answer: C E D F E G F A G B A C B D C E. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 16 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position II is Leavitt’s fingering type 1: C E D F E G F A G B A C… Thirds are the string crossings: the notes are easy, the picking is the work.
  - **Generator 2**, sample: “C major Position VII Thirds · down from the top Quarter notes · 1 per click From the highest note of the position” → answer: D B C A B G A F G E F D E C D B C A B G A F G E F D E C D B. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 30 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position VII is Leavitt’s fingering type 2: D B C A B G A F G E F D… Thirds are the string crossings: the notes are easy, the picking is the work.
  - **Generator 3**, sample: “C major Position VII Thirds · alternating Quarter notes · 1 per click From the lowest note of the position” → answer: B D E C D F G E F A B G A C D B C E F D E G A F G B C A B D. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 30 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position VII is Leavitt’s fingering type 2: B D E C D F G E F A B G… Thirds are the string crossings: the notes are easy, the picking is the work.
  - **Generator 4**, sample: “C major Position XII Thirds · alternating Eighth notes · 2 per click From the lowest note of the position” → answer: E G A F G B C A B D E C D F G E F A B G A C D B C E F D E G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 30 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position XII is Leavitt’s fingering type 3: E G A F G B C A B D E C… Thirds are the string crossings: the notes are easy, the picking is the work.
- **Level note (the Details button):**
  - *Key takeaways:* The scale in thirds: play a note, skip one, come back and start from the next. 1–3, 2–4, 3–5. / First one octave of thirds from the tonic, then through the whole position. / Thirds alternating: one pair up, the next pair down. Then in eighths. / Only C major on this level, in the eight positions you already know.
  - *What to pay attention to:* The notes are easy; the string crossings are the work. Thirds cross strings almost every pair. / Know which thirds are major and which minor as you play them. / The change of direction every two notes.
  - *Skill it builds:* Picking control across strings, and hearing the scale as stacked thirds, which is how chords are built.
  - *Theory and tips:* In a major scale the thirds on 1, 4 and 5 are major; on 2, 3, 6 and 7 they are minor. / Thirds are the first melodic pattern in every method because they break the habit of running scales step by step. / 1–3, 4–2, 3–5, 6–4. Alternating patterns sound less like an exercise and more like a line.
- **Source of the level (exact settings):**

```js
{n:'Thirds, in C',d:'C major only. One octave from the tonic, then the whole position: up, down, alternating; then in eighth notes',g:[scQ({pos:SC_SEVEN,pat:[['3','up','oct']]}),scQ({pos:SC_SEVEN,pat:[['3','up'],['3','down']]}),scQ({pos:SC_SEVEN,pat:[['3','alt']]}),scQ({pos:SC_SEVEN,pat:[['3','alt'],['3','up']],div:2})]}
```

#### Scale Runner 11: Thirds: C, F and G

- **Description:** The same with two more keys: one octave from the tonic, then the whole position, up and down in C, F and G; alternating and in eighth notes
- **Input:** guitar
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “G major Position X Thirds · up · from the tonic Quarter notes · 1 per click Start on the lowest tonic: one octave of the pattern · fourth-finger stretches (red rings)” → answer: G B A C B D C E D F♯ E G F♯ A G B. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 16 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: G major in position X is Leavitt’s fingering type 4B: G B A C B D C E D F♯ E G… Thirds are the string crossings: the notes are easy, the picking is the work.
  - **Generator 2**, sample: “G major Position IX Thirds · down from the top Quarter notes · 1 per click From the highest note of the position · first-finger stretches (red rings)” → answer: E C D B C A B G A F♯ G E F♯ D E C D B C A B G A F♯ G E F♯ D E C. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 30 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: G major in position IX is Leavitt’s fingering type 1: E C D B C A B G A F♯ G E… Thirds are the string crossings: the notes are easy, the picking is the work.
  - **Generator 3**, sample: “F major Position VII Thirds · alternating Quarter notes · 1 per click From the lowest note of the position · first-finger stretches (red rings)” → answer: B♭ D E C D F G E F A B♭ G A C D B♭ C E F D E G A F G B♭ C A B♭ D. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 30 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: F major in position VII is Leavitt’s fingering type 1: B♭ D E C D F G E F A B♭ G… Thirds are the string crossings: the notes are easy, the picking is the work.
  - **Generator 4**, sample: “G major Position II Thirds · up Eighth notes · 2 per click From the lowest note of the position” → answer: F♯ A G B A C B D C E D F♯ E G F♯ A G B A C B D C E D F♯ E G F♯ A. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 30 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: G major in position II is Leavitt’s fingering type 2: F♯ A G B A C B D C E D F♯… Thirds are the string crossings: the notes are easy, the picking is the work.
- **Level note (the Details button):**
  - *What this level adds:* The same thirds in F and G as well as C: one octave from the tonic, the whole position up and down, alternating, and in eighth notes.
  - *What to pay attention to:* A new key in the same position is a different fingering: read the diagram before the first note. / The thirds on 1, 4 and 5 are still the major ones; find the new tonic first.
  - *Theory and tips:* The pattern is the same in every key; only the fingering under it changes. That is why it is learned in C first.
- **Source of the level (exact settings):**

```js
{n:'Thirds: C, F and G',d:'The same with two more keys: one octave from the tonic, then the whole position, up and down in C, F and G; alternating and in eighth notes',g:[scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['3','up','oct']]}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['3','up'],['3','down']]}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['3','alt']]}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['3','alt'],['3','up']],div:2})]}
```

#### Scale Runner 12: Fourths

- **Description:** C major in eight positions: two notes three steps apart from every degree, up, down and alternating, in quarter notes; then in eighth notes; then in C, F and G
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position XII Fourths · up Quarter notes · 1 per click From the lowest note of the position” → answer: E A F B G C A D B E C F D G E A F B G C A D B E C F D G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 28 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position XII is Leavitt’s fingering type 3: E A F B G C A D B E C F… Fourths skip two scale notes. A perfect 4th lies on the next string at the same fret (one fret higher from string 3 to string 2); the one augmented 4th of the key is a fret higher.
  - **Generator 2**, sample: “C major Position II Fourths · up Eighth notes · 2 per click From the lowest note of the position · first-finger stretches (red rings)” → answer: F B G C A D B E C F D G E A F B G C A D B E C F D G E A. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 28 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position II is Leavitt’s fingering type 1: F B G C A D B E C F D G… Fourths skip two scale notes. A perfect 4th lies on the next string at the same fret (one fret higher from string 3 to string 2); the one augmented 4th of the key is a fret higher.
  - **Generator 3**, sample: “G major Position III Fourths · down from the top Quarter notes · 1 per click From the highest note of the position · fourth-finger stretches (red rings)” → answer: B F♯ A E G D F♯ C E B D A C G B F♯ A E G D F♯ C E B D A C G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 28 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: G major in position III is Leavitt’s fingering type 4C: B F♯ A E G D F♯ C E B D A… Fourths skip two scale notes. A perfect 4th lies on the next string at the same fret (one fret higher from string 3 to string 2); the one augmented 4th of the key is a fret higher.
- **Level note (the Details button):**
  - *Key takeaways:* Fourths: a note and the note three scale steps above it, from every degree. 1–4, 2–5, 3–6… / Up, down and alternating, through the whole position; then in eighth notes; then in C, F and G.
  - *What to pay attention to:* A perfect 4th lies on the next string at the same fret; from string 3 to string 2 it is one fret higher. The one augmented 4th of the key (4 up to 7) is a fret wider. / Fourths have no notes between them in the shape: the picking hand crosses a string on almost every note.
  - *Skill it builds:* Wider intervals inside the scale. Fourths are the sound of modern jazz lines and of quartal voicings.
  - *Theory and tips:* Most fourths lie flat under one finger across two strings: roll the finger, do not lift it. / Say the pair as you play it: C–F, D–G, E–A, F–B (the augmented one), G–C…
- **Source of the level (exact settings):**

```js
{n:'Fourths',d:'C major in eight positions: two notes three steps apart from every degree, up, down and alternating, in quarter notes; then in eighth notes; then in C, F and G',g:[scQ({keys:['C'],pos:SC_SEVEN,pat:[['4','up'],['4','down'],['4','alt']]}),scQ({keys:['C'],pos:SC_SEVEN,pat:[['4','up'],['4','down'],['4','alt']],div:2}),scQ({keys:['C','F','G'],pos:SC_SEVEN,pat:[['4','up'],['4','down'],['4','alt']]})]}
```

#### Scale Runner 13: Triads, every position

- **Description:** 1–3–5 from every degree: one octave from the tonic first, then up, down, alternating, in all twelve positions of C; then in triplets and in eighth notes
- **Input:** guitar
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position XII Triads · up · from the tonic Quarter notes · 1 per click Start on the lowest tonic: one octave of the pattern” → answer: C E G D F A E G B F A C G B D A C E B D F C E G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 24 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position XII is Leavitt’s fingering type 3: C E G D F A E G B F A C… Each triad is a chord of the key sitting inside the scale: I, IIm, IIIm, IV, V, VIm, VII°.
  - **Generator 2**, sample: “C major Position II Triads · alternating Quarter notes · 1 per click From the lowest note of the position · first-finger stretches (red rings)” → answer: F A C D B G A C E F D B C E G A F D E G B C A F G B D E C A B D F G E C D F A. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 39 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position II is Leavitt’s fingering type 1: F A C D B G A C E F D B… Each triad is a chord of the key sitting inside the scale: I, IIm, IIIm, IV, V, VIm, VII°.
  - **Generator 3**, sample: “C major Position IV Triads · up Triplets · 3 per click From the lowest note of the position · first-finger stretches (red rings)” → answer: G B D A C E B D F C E G D F A E G B F A C G B D A C E B D F C E G D F A E G B. (answered by **playing it on the guitar**; click at 63 bpm; free start (the click runs, start on any click); 39 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position IV is Leavitt’s fingering type 1B: G B D A C E B D F C E G… Each triad is a chord of the key sitting inside the scale: I, IIm, IIIm, IV, V, VIm, VII°.
  - **Generator 4**, sample: “C major Position V Triads · down from the top Eighth notes · 2 per click From the highest note of the position · fourth-finger stretches (red rings)” → answer: C A F B G E A F D G E C F D B E C A D B G C A F B G E A F D G E C F D B E C A. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 39 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position V is Leavitt’s fingering type 4: C A F B G E A F D G E C… Each triad is a chord of the key sitting inside the scale: I, IIm, IIIm, IV, V, VIm, VII°.
- **Level note (the Details button):**
  - *What this level adds:* Triads through the scale: 1–3–5, 2–4–6, 3–5–7… First one octave from the tonic, then in every one of the twelve positions of C; then in triplets (one triad a click) and in eighth notes.
  - *What to pay attention to:* Each group is a chord of the key. Say its name: C, Dm, Em, F, G, Am, B diminished. / Positions that are new to you: four of the twelve are here for the first time (I, IV, VI and XI).
  - *Theory and tips:* The diatonic triads are major on I, IV and V, minor on II, III and VI, diminished on VII. / Playing them inside the scale fingering is how you learn to see chord tones while you solo.
- **Source of the level (exact settings):**

```js
{n:'Triads, every position',d:'1–3–5 from every degree: one octave from the tonic first, then up, down, alternating, in all twelve positions of C; then in triplets and in eighth notes',g:[scQ({pos:SC_ALL,pat:[['tri','up','oct']]}),scQ({pos:SC_ALL,pat:[['tri','up'],['tri','down'],['tri','alt']]}),scQ({pos:SC_ALL,pat:[['tri','up'],['tri','down']],div:3}),scQ({pos:SC_ALL,pat:[['tri','up'],['tri','down'],['tri','alt']],div:2})]}
```

#### Scale Runner 14: Seventh chords, every position

- **Description:** 1–3–5–7 from every degree: from the tonic first, then up, down, alternating; then in eighth notes
- **Input:** guitar
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “C major Position III Seventh chords · up · from the tonic Quarter notes · 1 per click Start on the lowest tonic: one octave of the pattern · fourth-finger stretches (red rings)” → answer: C E G B D F A C E G B D F A C E G B D F A C E G B D F A C E G B. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 32 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position III is Leavitt’s fingering type 4B: C E G B D F A C E G B D… Each group is a seventh chord of the key: after this you see IIm7 – V7 – IMaj7 inside the position without looking for it.
  - **Generator 2**, sample: “C major Position VIII Seventh chords · alternating Quarter notes · 1 per click From the lowest note of the position · fourth-finger stretches (red rings)” → answer: C E G B C A F D E G B D E C A F G B D F G E C A B D F A B G E C D F A C D B G E F A C E. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 44 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position VIII is Leavitt’s fingering type 4C: C E G B C A F D E G B D… Each group is a seventh chord of the key: after this you see IIm7 – V7 – IMaj7 inside the position without looking for it.
  - **Generator 3**, sample: “C major Position III Seventh chords · down from the top Eighth notes · 2 per click From the highest note of the position · fourth-finger stretches (red rings)” → answer: B G E C A F D B G E C A F D B G E C A F D B G E C A F D B G E C A F D B G E C A F D B G. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 44 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: C major in position III is Leavitt’s fingering type 4B: B G E C A F D B G E C A… Each group is a seventh chord of the key: after this you see IIm7 – V7 – IMaj7 inside the position without looking for it.
- **Level note (the Details button):**
  - *What this level adds:* Seventh chords through the scale: 1–3–5–7 from each degree; then in eighth notes, two notes a click.
  - *What to pay attention to:* Four-note groups shift the accent across the picking pattern. / Name each one: CMaj7, Dm7, Em7, FMaj7, G7, Am7, Bm7♭5.
  - *Theory and tips:* IIm7, V7 and IMaj7 sit next to each other inside the position. Once you see them there, II–V–I lines come out of the scale.
- **Source of the level (exact settings):**

```js
{n:'Seventh chords, every position',d:'1–3–5–7 from every degree: from the tonic first, then up, down, alternating; then in eighth notes',g:[scQ({pos:SC_ALL,pat:[['7','up','oct']]}),scQ({pos:SC_ALL,pat:[['7','up'],['7','down'],['7','alt']]}),scQ({pos:SC_ALL,pat:[['7','up'],['7','down'],['7','alt']],div:2})]}
```

#### Scale Runner 15: Twelve keys in one position

- **Description:** Stay in one position and go round the circle: the key changes, the hand does not move. Then thirds, triads and sevenths the same way
- **Input:** guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “E major Position VII Whole position · from the tonic Quarter notes · 1 per click Tonic → top note → bottom note → back up to the tonic · fourth-finger stretches (red rings) · the position stays, the key changes” → answer: E F♯ G♯ A B C♯ D♯ E F♯ G♯ A B C♯ D♯ C♯ B A G♯ F♯ E D♯ C♯ B A G♯ F♯ E D♯ C♯ B C♯ D♯ E. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 33 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Say the degree numbers as you go; land on the tonic.
    - explanation after answering: E major in position VII is Leavitt’s fingering type 4B: E F♯ G♯ A B C♯ D♯ E… Starting and ending on the tonic lets the ear hear the key; passing through the top and bottom notes covers the whole position.
  - **Generator 2**, sample: “E♭ major Position VII Seventh chords · alternating Quarter notes · 1 per click From the lowest note of the position · first-finger stretches (red rings) · the position stays, the key changes” → answer: B♭ D F A♭ B♭ G E♭ C D F A♭ C D B♭ G E♭ F A♭ C E♭ F D B♭ G A♭ C E♭ G A♭ F D B♭ C E♭ G B♭ C A♭ F D E♭ G B♭ D. (answered by **playing it on the guitar**; click at 80 bpm; free start (the click runs, start on any click); 44 notes to play; allowance {"miss": 1, "late": 0.15, "lateMin": 2})
    - hint: Play it once slowly, naming the first note of each group.
    - explanation after answering: E♭ major in position VII is Leavitt’s fingering type 1B: B♭ D F A♭ B♭ G E♭ C D F A♭ C… Each group is a seventh chord of the key: after this you see IIm7 – V7 – IMaj7 inside the position without looking for it.
- **Level note (the Details button):**
  - *Key takeaways:* Stay in one position and play all twelve major scales round the circle. The key changes; the hand does not move. / Thirds, triads and sevenths in every key, in one position.
  - *What to pay attention to:* Each new key is a new fingering type under the same hand. / Round the circle towards the flats the keys add first-finger stretches; towards the sharps, fourth-finger stretches. In position II: F, B♭, E♭ and A♭ stretch the first finger; A, E, B, F♯ and D♭ the fourth; G and D need none. / The pattern is known; the fingering is new. Go slowly through the stretch keys.
  - *Skill it builds:* Playing through key changes without jumping around the neck. This is how tunes that modulate are read and soloed on.
  - *Theory and tips:* In position II: C is type 1, F 1A, B♭ 1B, E♭ 1C, A♭ 1D; G is type 2, D type 3; A type 4, E 4A, B 4B, F♯ 4C, D♭ 4D. / This is the opposite of learning one shape and sliding it. It is the central idea of Leavitt’s method. / A new pattern in a known fingering, or a known pattern in a new fingering: change one thing at a time.
- **Source of the level (exact settings):**

```js
{n:'Twelve keys in one position',d:'Stay in one position and go round the circle: the key changes, the hand does not move. Then thirds, triads and sevenths the same way',g:[scQ({cycle:true,pat:[['scale','tonic']]}),scQ({cycle:true,pat:[['3','up'],['3','alt'],['tri','up'],['tri','alt'],['7','up'],['7','alt']]})]}
```

### Two Hands (`twohands`)

- **What the game is:** Two keys, one per hand: F for the left, J for the right. Together, alternating, stickings, then one hand holding a pattern while the other reads; two against three, three against four; the backbeat, the ride pattern, the clave and the bossa. What is trained is doing two different things in time.
- **Area:** Independence · two keys · **course** 201 · **badge** warm, support · **input:** tap or strum (continuous)
- **Master standard:** accuracy 90 %, timing within ±35 ms (two different parts at once without either one disturbing the other)
- **Lesson card, how to practise:** Learn each hand alone first, then put them together slowly. Speed comes last. / Say where the hands meet: “together, right, left, together”. The meeting points are the map. / Keep the steady hand automatic. If it stops when the other hand gets hard, slow down until it does not. / F is the left hand, J is the right. Keep the fingers resting on the keys.
- **Lesson card, rules:** Three against two fits in six parts: the hands meet on 1, then right, left, right. Say “nice cup of tea”. / Three against four fits in twelve parts: the three-side plays every fourth one, the four-side every third. / The paradiddle is R L R R, L R L L: the double stroke switches the leading hand. / The 3-2 son clave is 1, the and of 2, 4, then 2 and 3 in the next bar.
- **Lesson card, take-away:** Independence is not two things at once: it is one combined rhythm that you learn as a whole and then hear as two parts.

**Also helps: Two Hands 1–5** (reading two lines at once)

#### Two Hands 1: Together

- **Description:** Both hands at once: quarters, then eighths
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, two hands (F left, J right).
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Note shown while playing:** Both keys together, exactly together: four bars of quarters, four of eighths.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 2 3 4 | 1 2 3 4 | 1 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Two keys, one per hand: F is the left, J is the right. Both hands play the same thing at the same moment. / Two notes that are meant to be together have to sound as one.
  - *What to pay attention to:* Listen for a flam: two clicks of the keys a hair apart. Close the gap until you hear one. / Which hand is early? It is usually the stronger one. / The move from quarters to eighths: do not let the tempo change with it.
  - *Skill it builds:* Playing in unison with yourself. Every later level is measured against this: where the hands meet, they must really meet.
  - *Theory and tips:* Each hand has its own staff, the right on top, and its own timing line, so you can see which hand rushed. / A level opens after 24 clean bars with both hands counted.
- **Source of the level (exact settings):**

```js
{n:'Together',d:'Both hands at once: quarters, then eighths',g:[tapReadQ(['q','ee','r'],2)],c:cH(k=>{const x=k%8<4?subdivBar(4,1):subdivBar(4,2);return hb(x,x);},{note:'Both keys together, exactly together: four bars of quarters, four of eighths.'})}
```

#### Two Hands 2: Together, reading

- **Description:** Both hands read the same written line, with rests
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, two hands (F left, J right).
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 2 | 1 2 3 | 3 4 | 1 2 2& 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Both hands read the same written line, with rests.
  - *What to pay attention to:* The rests are played by both hands: neither may leak a note into them. / Read the line once; do not read it twice, once per hand.
  - *Theory and tips:* This is the first step in every drum reading method: unison before independence.
- **Source of the level (exact settings):**

```js
{n:'Together, reading',d:'Both hands read the same written line, with rests',g:[tapReadQ(['q','ee','r'],2)],c:cH(()=>{const r=rhyBar(['q','r','h','hr','q','ee'],1,false,4);return hb(r,r);})}
```

#### Two Hands 3: Alternating

- **Description:** Right, left, right, left: quarters, then eighths
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, two hands (F left, J right).
- **Tempo advice:** 60–100 bpm, start at 70. Why: Eighth notes: slow enough to place the off-beat exactly.
- **Four sample bars (where the notes start):** 1 3 | 1 3 | 1 3 | 1 3
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Hand to hand: right, left, right, left. Quarters first, then eighths.
  - *What to pay attention to:* Both hands at the same volume and the same spacing. The weaker hand tends to be late. / In eighths the right hand is on the beats and the left on the “ands”.
  - *Theory and tips:* Alternating is how drummers play any single line. It evens out the two hands.
- **Source of the level (exact settings):**

```js
{n:'Alternating',d:'Right, left, right, left: quarters, then eighths',g:[tapReadQ(['q','ee','r'],2)],c:cH(k=>k%8<4?hb(hOn([0,2]),hOn([1,3]),'quarters: R L R L'):hb(hOn([0,1,2,3]),hOn([.5,1.5,2.5,3.5]),'eighths: R L R L'))}
```

#### Two Hands 4: Stickings

- **Description:** Doubles, the paradiddle, then triplets hand to hand
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, two hands (F left, J right).
- **Tempo advice:** 60–90 bpm, start at 70. Why: Triplets: three even notes a beat are still controllable here.
- **Note shown while playing:** Four bars each: doubles, the paradiddle, alternating triplets, then triplets R L L.
- **Four sample bars (where the notes start):** 1 1& 3 3& | 1 1& 3 3& | 1 1& 3 3& | 1 1& 3 3&
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* A sticking is an order of hands. Doubles are R R L L. The paradiddle is R L R R, L R L L.
  - *What to pay attention to:* The rhythm must stay perfectly even whatever the hands do. A sticking is not a rhythm. / In the paradiddle the double stroke hands the lead to the other hand. / In triplets hand to hand, the hand that starts each beat alternates.
  - *Skill it builds:* Control of each hand on its own inside an even stream.
  - *Theory and tips:* These are drum rudiments, used here only for what is general in them: evenness between the hands. / On guitar the same control lets the picking hand accent any stroke of a pattern.
- **Source of the level (exact settings):**

```js
{n:'Stickings',d:'Doubles, the paradiddle, then triplets hand to hand',g:[tapReadQ(['q','ee','r'],2)],c:cH(k=>{const m=Math.floor(k/4)%4;return m===0?hStick('RRLLRRLL',.5,'doubles: R R L L'):m===1?hStick('RLRRLRLL',.5,'paradiddle: R L R R  L R L L'):m===2?hStick('RLRLRLRLRLRL',1/3,'triplets: R L R  L R L'):hStick('RLLRLLRLLRLL',1/3,'triplets: R L L');},{note:'Four bars each: doubles, the paradiddle, alternating triplets, then triplets R L L.'})}
```

#### Two Hands 5: Two lines

- **Description:** Each hand reads its own written line: quarters, halves and rests
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 4/4, two hands (F left, J right).
- **Tempo advice:** 60–100 bpm, start at 80. Why: Quarter-note motion: the comfortable middle of the pulse range.
- **Four sample bars (where the notes start):** 1 2 3 4 | 1 3 | 1 2 3 | 1
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Each hand reads its own line. Sometimes they meet, sometimes one plays alone.
  - *What to pay attention to:* Read down the page, not along it: at each beat, which hands play? / There are four cases on every beat: both, right, left, neither.
  - *Skill it builds:* Reading two parts at once. This is real independence at its simplest.
  - *Theory and tips:* Say the cases aloud at first: “both, right, rest, left”. / Only quarters, halves and rests here: the difficulty is the coordination, not the rhythm.
- **Source of the level (exact settings):**

```js
{n:'Two lines',d:'Each hand reads its own written line: quarters, halves and rests',g:[tapReadQ(['q','ee','r'],2)],c:cH(()=>hb(rhyBar(['q','r','h','hr'],1,false,4),rhyBar(['q','r','h','hr'],1,false,4)))}
```

### Aksak (`aksak`)

- **What the game is:** Meters counted in eighth notes and felt as short and long beats: 5/8, 7/8, 8/8 as 3 + 3 + 2, the 9/8 aksak, 10/8, 11/8 and 13/8. For each: the uneven beats, every eighth note, then reading rhythms beamed by group.
- **Area:** Uneven meters · groups of two and three · **course** 301 · **badge** warm, side · **input:** tap or strum (continuous)
- **Master standard:** accuracy 90 %, timing within ±35 ms (uneven meters felt as long and short beats, not counted)
- **Lesson card, how to practise:** Feel beats, not eighths: a short beat is two eighths, a long beat three. Step or clap the beats first. / Say the groups aloud: “1-2 1-2 1-2-3”. Never count “1 2 3 4 5 6 7”. / Start with one tap per beat, then fill in every eighth, then read. / The tempo number is eighth notes a minute.
- **Lesson card, rules:** Short beat = 2 eighths, written as a quarter. Long beat = 3 eighths, written as a dotted quarter. / 5/8 is 2 + 3 or 3 + 2. 7/8 is 2 + 2 + 3, 3 + 2 + 2 or 2 + 3 + 2. The 9/8 aksak is 2 + 2 + 2 + 3. / The beams on the page show the groups: read by beam. / 3 + 3 + 2 fills a bar of 4/4 exactly: it is the uneven grouping inside ordinary time.
- **Lesson card, take-away:** An uneven meter is a small number of beats of two lengths. Once you hear long and short, 9/8 has four beats and is no harder than 4/4.

**Also helps: Aksak 1–14** (reading uneven meters)

#### Aksak 1: 5/8: the two beats

- **Description:** A short beat and a long beat: 2 + 3, and 3 + 2
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 5/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 3 | 1 3 | 1 3 | 1 3
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* 5/8 has two beats, and they are not the same length: one is two eighth notes, the other three. / You tap the beats, one tap each. The click plays them with you.
  - *What to pay attention to:* The long beat is half as long again as the short one. Give it its full length: the usual fault is to cut it and land early on the next bar. / 2 + 3 and 3 + 2 are different meters to the ear. Notice which comes first. / Do not count to five. Say “short, long” or “1-2, 1-2-3”.
  - *Skill it builds:* Feeling a beat that changes length. Everything in this game rests on it.
  - *Theory and tips:* The short beat is written as a quarter note, the long beat as a dotted quarter. / The tempo number counts eighth notes. 200 means the eighths run at 200 a minute; the beats are slower and uneven. / “Aksak” is Turkish for limping: the bar leans on its long beat.
- **Source of the level (exact settings):**

```js
{n:'5/8: the two beats',d:'A short beat and a long beat: 2 + 3, and 3 + 2',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([2,3]),{alt:[c8b([3,2]),c8b([2,3])]})}
```

#### Aksak 2: 5/8: every eighth

- **Description:** All five eighth notes, the click on the two beats
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 5/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 180. Why: Every eighth note under one finger: about three taps a second is comfortable, four is the limit.
- **Four sample bars (where the notes start):** 1 2 3 4 5 | 1 2 3 4 5 | 1 2 3 4 5 | 1 2 3 4 5
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* All five eighth notes, with the click still on the two beats.
  - *What to pay attention to:* Every eighth is the same length. Only the grouping is uneven. / Lean a little on the first eighth of each group, so the two beats can still be heard inside the five.
- **Source of the level (exact settings):**

```js
{n:'5/8: every eighth',d:'All five eighth notes, the click on the two beats',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8e([2,3]),{alt:[c8e([3,2]),c8e([2,3])]})}
```

#### Aksak 3: 5/8: reading

- **Description:** Rhythms beamed 2 + 3 or 3 + 2, the click on beat 1 only
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 5/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 170. Why: Reading in groups: slow enough to see the next group while you play this one.
- **Four sample bars (where the notes start):** 1 2 3 5 | 1 2 3 4 4& 5 | 2 4 5 | 1 2 2& 3 4 4& 5
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Written rhythms in 5/8. The click is now on beat 1 only: you keep the grouping yourself.
  - *What to pay attention to:* Read by beam. Each beamed group is one beat, of two or three eighths. / A dotted quarter fills a long beat, a quarter fills a short one.
  - *Theory and tips:* With the click only on beat 1, the bar is one long unit. Hear the downbeat coming.
- **Source of the level (exact settings):**

```js
{n:'5/8: reading',d:'Rhythms beamed 2 + 3 or 3 + 2, the click on beat 1 only',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8r([2,3]),{alt:[c8r([3,2]),c8r([2,3])]})}
```

#### Aksak 4: 7/8: the three beats

- **Description:** Two short and one long: 2 + 2 + 3, 3 + 2 + 2, 2 + 3 + 2
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 7/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 3 5 | 1 3 5 | 1 3 5 | 1 3 5
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* 7/8 has three beats: two short and one long. / Where the long beat sits gives three meters: 2 + 2 + 3, 3 + 2 + 2 and 2 + 3 + 2.
  - *What to pay attention to:* In 2 + 2 + 3 the long beat ends the bar, and the next downbeat seems to arrive late. In 3 + 2 + 2 the bar starts long and then hurries. / The level changes grouping between sessions. Find the long beat in the count-in before you play.
  - *Skill it builds:* Hearing where the long beat is: the identity of every uneven meter.
  - *Theory and tips:* Think of 7/8 as a bar of 4/4 with one eighth missing, or as 3/4 with one eighth added. Both are true and neither helps as much as “short, short, long”.
- **Source of the level (exact settings):**

```js
{n:'7/8: the three beats',d:'Two short and one long: 2 + 2 + 3, 3 + 2 + 2, 2 + 3 + 2',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([2,2,3]),{alt:[c8b([2,3,2]),c8b([2,2,3]),c8b([3,2,2])]})}
```

#### Aksak 5: 7/8: every eighth

- **Description:** All seven eighth notes, the click on the three beats
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 7/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 180. Why: Every eighth note under one finger: about three taps a second is comfortable, four is the limit.
- **Four sample bars (where the notes start):** 1 2 3 4 5 6 7 | 1 2 3 4 5 6 7 | 1 2 3 4 5 6 7 | 1 2 3 4 5 6 7
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* All seven eighth notes, the click on the three beats.
  - *What to pay attention to:* The three eighths of the long beat must not turn into a triplet. They are the same eighths as the others.
- **Source of the level (exact settings):**

```js
{n:'7/8: every eighth',d:'All seven eighth notes, the click on the three beats',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8e([2,2,3]),{alt:[c8e([2,3,2]),c8e([2,2,3]),c8e([3,2,2])]})}
```

#### Aksak 6: 7/8: reading

- **Description:** Rhythms beamed by group, the click on beat 1 only
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 7/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 170. Why: Reading in groups: slow enough to see the next group while you play this one.
- **Four sample bars (where the notes start):** 1 1& 2 3 3& 4 5 6 6& 7 | 1 2 3 4 5 7 | 2 3 5 7 | 1 2 3 6 7
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Reading in 7/8, the click on beat 1 only.
  - *What to pay attention to:* Look at the beams first to find the grouping, then read the rhythm. / A rest at the start of a group still starts the beat. Feel it.
- **Source of the level (exact settings):**

```js
{n:'7/8: reading',d:'Rhythms beamed by group, the click on beat 1 only',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8r([2,2,3]),{alt:[c8r([2,3,2]),c8r([2,2,3]),c8r([3,2,2])]})}
```

#### Aksak 7: 8/8 as 3 + 3 + 2

- **Description:** Eight eighths that are not 4/4: the beats, every eighth, then reading
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 8/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 4 7 | 1 4 7 | 1 4 7 | 1 4 7
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* Eight eighth notes grouped 3 + 3 + 2: two long beats and a short one. / It lasts exactly as long as a bar of 4/4 but has three beats instead of four.
  - *What to pay attention to:* The second long beat starts on the “and” of 2 of a 4/4 bar. Against a 4/4 pulse it is a syncopation; here it is a beat. / The short beat at the end pushes into the next bar.
  - *Skill it builds:* The uneven grouping that lives inside ordinary time.
  - *Theory and tips:* The same three attacks are the tresillo of Cuban music and the first bar of the 3-2 son clave. / Much pop, Latin and Balkan music moves in 3 + 3 + 2 while the bar is written as 4/4.
- **Source of the level (exact settings):**

```js
{n:'8/8 as 3 + 3 + 2',d:'Eight eighths that are not 4/4: the beats, every eighth, then reading',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([3,3,2]),{alt:[c8r([3,3,2]),c8b([3,3,2]),c8e([3,3,2])]})}
```

#### Aksak 8: 9/8 aksak: the four beats

- **Description:** 2 + 2 + 2 + 3: three short beats and a long one; then every eighth
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 9/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 3 5 7 | 1 3 5 7 | 1 3 5 7 | 1 3 5 7
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* The 9/8 aksak: four beats, three short and one long, 2 + 2 + 2 + 3. / This is not the 9/8 of a jig, which is three long beats.
  - *What to pay attention to:* Three even short beats and then the long one: do not shorten it out of habit. / In the every-eighth sessions, the last group has three notes.
  - *Skill it builds:* The best-known Turkish uneven meter, felt in four.
  - *Theory and tips:* Counted “1-2, 1-2, 1-2, 1-2-3”. / Dave Brubeck’s “Blue Rondo à la Turk” is built on this bar.
- **Source of the level (exact settings):**

```js
{n:'9/8 aksak: the four beats',d:'2 + 2 + 2 + 3: three short beats and a long one; then every eighth',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([2,2,2,3]),{alt:[c8e([2,2,2,3]),c8b([2,2,2,3])]})}
```

#### Aksak 9: 9/8: reading, and the other nine

- **Description:** Reading in 2 + 2 + 2 + 3; then the same nine eighths as 3 + 3 + 3
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 9/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 170. Why: Reading in groups: slow enough to see the next group while you play this one.
- **Four sample bars (where the notes start):** 1 2 4 5 6 7 8 9 | 1 1& 2 3 4 5 5& 6 7 8 9 | 1 2 3 5 7 8 | 1 2 3 3& 4 6 7 8 8& 9
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Reading in the 9/8 aksak; some sessions use the other 9/8, 3 + 3 + 3, so that you hear the difference.
  - *What to pay attention to:* The same nine eighths: four beats in one grouping, three in the other. The beams tell you which.
  - *Theory and tips:* 3 + 3 + 3 is compound time: every beat is long, so nothing limps.
- **Source of the level (exact settings):**

```js
{n:'9/8: reading, and the other nine',d:'Reading in 2 + 2 + 2 + 3; then the same nine eighths as 3 + 3 + 3',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8r([2,2,2,3]),{alt:[c8r([2,2,2,3]),c8r([2,2,2,3]),c8r([3,3,3])]})}
```

#### Aksak 10: 10/8: 3 + 2 + 2 + 3

- **Description:** Long, short, short, long: the beats, then every eighth
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 10/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 4 6 8 | 1 4 6 8 | 1 4 6 8 | 1 4 6 8
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* 10/8 as 3 + 2 + 2 + 3: long, short, short, long. / The bar is the same forwards and backwards.
  - *What to pay attention to:* Two long beats meet across the bar line: the long beat that ends one bar is followed by the long beat that starts the next. / Keep the two short beats in the middle even.
  - *Skill it builds:* A four-beat uneven meter with two long beats.
  - *Theory and tips:* In Turkish music a 10/8 grouped this way is called curcuna.
- **Source of the level (exact settings):**

```js
{n:'10/8: 3 + 2 + 2 + 3',d:'Long, short, short, long: the beats, then every eighth',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([3,2,2,3]),{alt:[c8e([3,2,2,3]),c8b([3,2,2,3])]})}
```

#### Aksak 11: 10/8: reading

- **Description:** Rhythms beamed 3 + 2 + 2 + 3
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 10/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 170. Why: Reading in groups: slow enough to see the next group while you play this one.
- **Four sample bars (where the notes start):** 1 2 3 5 7 8 9 9& 10 | 1 2 3 5 6 7 7& 8 10 | 1 2 4 6 6& 7 8 9 10 | 2 3 5 6 6& 7 8 9
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Reading in 10/8, the click on beat 1 only.
  - *What to pay attention to:* Ten eighths is a long bar to hold with one click. Feel the middle of the bar: the first short beat ends at the half-way point.
- **Source of the level (exact settings):**

```js
{n:'10/8: reading',d:'Rhythms beamed 3 + 2 + 2 + 3',g:[tapReadQ(['q','ee','r'],2)],c:c8r([3,2,2,3])}
```

#### Aksak 12: 11/8

- **Description:** 2 + 2 + 3 + 2 + 2: the beats, every eighth, then reading
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 11/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 3 5 8 10 | 1 3 5 8 10 | 1 3 5 8 10 | 1 3 5 8 10
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *Key takeaways:* 11/8 here is 2 + 2 + 3 + 2 + 2: five beats with the long one in the middle. / First the beats, then every eighth, then reading: one session each.
  - *What to pay attention to:* Count beats, never eighths: “short, short, long, short, short”. / After the long beat there are two more short beats. The bar does not end where a 7/8 would.
  - *Skill it builds:* Holding a five-beat uneven bar.
  - *Theory and tips:* Eleven can be grouped in other ways. Whatever the grouping, find where the long beat is.
- **Source of the level (exact settings):**

```js
{n:'11/8',d:'2 + 2 + 3 + 2 + 2: the beats, every eighth, then reading',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([2,2,3,2,2]),{alt:[c8r([2,2,3,2,2]),c8b([2,2,3,2,2]),c8e([2,2,3,2,2])]})}
```

#### Aksak 13: 13/8

- **Description:** 2 + 2 + 2 + 3 + 2 + 2: the beats, every eighth, then reading
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 13/8.
- **Tempo advice:** 160–280 eighth notes a minute, start at 200. Why: One tap per group: short beats are two eighths, long beats three. The eighth has to move fast enough for the groups to feel like beats, not like counting.
- **Four sample bars (where the notes start):** 1 3 5 7 10 12 | 1 3 5 7 10 12 | 1 3 5 7 10 12 | 1 3 5 7 10 12
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* 13/8 as 2 + 2 + 2 + 3 + 2 + 2: six beats, the long one fourth.
  - *What to pay attention to:* Hear it as a 9/8 aksak followed by two short beats.
  - *Theory and tips:* Long bars are learned as two smaller bars joined together.
- **Source of the level (exact settings):**

```js
{n:'13/8',d:'2 + 2 + 2 + 3 + 2 + 2: the beats, every eighth, then reading',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8b([2,2,2,3,2,2]),{alt:[c8r([2,2,2,3,2,2]),c8b([2,2,2,3,2,2]),c8e([2,2,2,3,2,2])]})}
```

#### Aksak 14: Any of them

- **Description:** Reading in 5, 7, 9 and 10: a different meter each session
- **Input:** screen and guitar
- **Kind:** continuous (bar after bar, no questions). Meter 5/8.
- **Tempo advice:** 140–240 eighth notes a minute, start at 170. Why: Reading in groups: slow enough to see the next group while you play this one.
- **Four sample bars (where the notes start):** 1 2 4 5 | 1 2 4 5 | 1 2 2& 3 4 5 | 1 1& 2 3 4
- _The level also lists round generators (`g:`) in its source; continuous levels do not play them (kept for the test suite only)._
- **Level note (the Details button):**
  - *What this level adds:* Reading in 5, 7, 9 and 10, a different meter each session, the click on beat 1 only.
  - *What to pay attention to:* Use the count-in and the beams to find the grouping before the first note.
  - *Theory and tips:* This is how uneven meters arrive in real music: you are told the meter, or you see the beams, and you have one bar to feel it.
- **Source of the level (exact settings):**

```js
{n:'Any of them',d:'Reading in 5, 7, 9 and 10: a different meter each session',g:[tapReadQ(['q','ee','r'],2)],c:Object.assign(c8r([2,3]),{alt:[c8r([3,2]),c8r([2,3]),c8r([2,2,3]),c8r([2,2,2,3]),c8r([3,2,2]),c8r([3,2,2,3])]})}
```

**Also helps: Fretboard 10–15** (every place of a note: choosing where to play what you read)

#### Fretboard 10: Every spot of a note: the naturals

- **Description:** Mark or play every place a note lives on all six strings, frets 0–12: C, D, E, F, G, A, B, first with the count shown, then without
- **Input:** screen and guitar
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Mark every B on all six strings, frets 0–12 (7 spots). Click to mark or unmark, then press Done .” → answer: 7 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the B is at fret 7. Work across with octave shapes.
    - explanation after answering: B: S6 7, S5 2, S4 9, S3 4, S2 0 & 12, S1 7. Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
  - **Generator 2**, sample: “Mark every G on all six strings, frets 0–12. Click to mark or unmark, then press Done .” → answer: 7 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the G is at fret 3. Work across with octave shapes.
    - explanation after answering: G: S6 3, S5 10, S4 5, S3 0 & 12, S2 8, S1 3. Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
- **Level note (the Details button):**
  - *Key takeaways:* Each note sits once on every string between the nut and fret 11, and again at fret 12 where the open strings repeat. / First the seven natural notes, with the number of spots shown, then without it.
  - *What to pay attention to:* Go string by string from 6 to 1. A system finds every spot; hunting at random misses some. / E is on two strings as an open string. / F and C, the notes one fret above the open E and B strings. / Check one per string. If a string has none marked, you missed one.
  - *Skill it builds:* Seeing one note across the whole neck at once: the octave map under every chord shape and scale.
  - *Theory and tips:* Open-string notes are the easiest to see: they sit at fret 0 and 12 of their own string and at fret 5 of the next lower string (fret 4 for B). / Link each spot to the next by an octave shape, not by counting. / Find the note on strings 6 and 5 first, then use octave shapes for the rest. / Between frets 0 and 12 an open-string note has two spots on its own string.
- **Source of the level (exact settings):**

```js
{n:'Every spot of a note: the naturals',d:'Mark or play every place a note lives on all six strings, frets 0–12: C, D, E, F, G, A, B, first with the count shown, then without',g:[huntQ(NAT_PC,1),huntQ(NAT_PC,0)]}
```

#### Fretboard 11: Sharps & flats

- **Description:** C♯/D♭, E♭, F♯, A♭, B♭ — count shown
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Mark every C♯/D♭ on all six strings, frets 0–12 (6 spots). Click to mark or unmark, then press Done .” → answer: 6 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the C♯/D♭ is at fret 9. Work across with octave shapes.
    - explanation after answering: C♯/D♭: S6 9, S5 4, S4 11, S3 6, S2 2, S1 9. Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
- **Level note (the Details button):**
  - *What this level adds:* The five sharps and flats.
  - *What to pay attention to:* A black-key note is never at fret 0 or 12. / Think of it from the natural below or above, one fret away.
  - *Theory and tips:* C♯ and D♭ are the same fret. Which name you use depends on the key.
- **Source of the level (exact settings):**

```js
{n:'Sharps & flats',d:'C♯/D♭, E♭, F♯, A♭, B♭ — count shown',g:[huntQ(ACC_PC,1)]}
```

#### Fretboard 12: Any note, no count

- **Description:** All twelve notes
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Mark every E on all six strings, frets 0–12. Click to mark or unmark, then press Done .” → answer: 8 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the E is at fret 0. Work across with octave shapes.
    - explanation after answering: E: S6 0 & 12, S5 7, S4 2, S3 9, S2 5, S1 0 & 12. Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
- **Level note (the Details button):**
  - *What this level adds:* Any of the twelve notes, no count shown.
  - *What to pay attention to:* Speed with no hesitation between strings.
  - *Theory and tips:* This is the complete octave map. Everything after it uses the map for something.
- **Source of the level (exact settings):**

```js
{n:'Any note, no count',d:'All twelve notes',g:[huntQ([0,1,2,3,4,5,6,7,8,9,10,11],0)]}
```

#### Fretboard 13: Fret by fret

- **Description:** All twelve notes, played from fret 0 up to fret 12 instead of string by string
- **Input:** screen and guitar · **opens without passing the level before** (open level)
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Mark every D on all six strings, frets 0–12. Click to mark or unmark, then press Done .” → answer: 7 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the D is at fret 10. Work across with octave shapes.
    - explanation after answering: D: S6 10, S5 5, S4 0 & 12, S3 7, S2 3, S1 10. Up the neck: fret 0 (S4), 3 (S2), 5 (S5), 7 (S3), 10 (S6), 10 (S1), 12 (S4). Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
- **Level note (the Details button):**
  - *Key takeaways:* The same spots played in a different order: by fret from the nut upward, not by string.
  - *What to pay attention to:* The order: lowest fret first, and where two strings share a fret, the lower string first. / You are scanning across the neck at each fret, not along a string.
  - *Skill it builds:* Seeing the note inside a position. This is the view you need when you are in one place and want the nearest root.
  - *Theory and tips:* Inside five frets (a position with one stretch) a given note appears on two or three strings; inside four frets it can be on one only (C in frets 4 to 7 is only on string 3). Knowing which strings gives you the roots of every shape in that position.
- **Source of the level (exact settings):**

```js
{n:'Fret by fret',d:'All twelve notes, played from fret 0 up to fret 12 instead of string by string',open:true,g:[huntQ([0,1,2,3,4,5,6,7,8,9,10,11],0,0,1)]}
```

#### Fretboard 14: Two at once

- **Description:** Every root and its 5th, 3rd or 4th
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Mark every E and every B on all six strings, frets 0–12. Click to mark or unmark, then press Done .” → answer: 15 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the E is at fret 0. Work across with octave shapes.
    - explanation after answering: E: S6 0 & 12, S5 7, S4 2, S3 9, S2 5, S1 0 & 12 · B: S6 7, S5 2, S4 9, S3 4, S2 0 & 12, S1 7. Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
- **Level note (the Details button):**
  - *What this level adds:* Two notes at once: every root together with its 5th, 3rd or 4th.
  - *What to pay attention to:* The interval shape repeats from every root. Learn the shape once. / Across the G and B strings the shape shifts one fret.
  - *Theory and tips:* A root and its fifth is a power chord; a root and third is the shell of a triad. Seeing them from every root is the start of seeing chords everywhere.
- **Source of the level (exact settings):**

```js
{n:'Two at once',d:'Every root and its 5th, 3rd or 4th',g:[huntQ([0,1,2,3,4,5,6,7,8,9,10,11],0,1)]}
```

#### Fretboard 15: In time

- **Description:** Every spot of a note, one per two clicks (play mode)
- **Input:** screen and guitar
- **Kind:** round level, 1 generator (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Mark every F on all six strings, frets 0–12. Click to mark or unmark, then press Done .” → answer: 6 spots. (answered by **marking every spot on the neck**)
    - hint: On string 6 the F is at fret 1. Work across with octave shapes.
    - explanation after answering: F: S6 1, S5 8, S4 3, S3 10, S2 6, S1 1. Each note sits once on every string between frets 0 and 11; a string's own open note sits at fret 0 and again at fret 12. Octave shape: two strings over and two frets up (three when you cross onto the B string).
- **Level note (the Details button):**
  - *What this level adds:* Every spot of one note played in time, one every two clicks.
  - *What to pay attention to:* Know the next spot before the click for this one. / Mute each note before the next so the microphone hears separate attacks.
  - *Theory and tips:* Two beats per spot is slow enough to plan and too fast to search. That is the point.
- **Source of the level (exact settings):**

```js
{n:'In time',d:'Every spot of a note, one per two clicks (play mode)',g:[huntQ([0,1,2,3,4,5,6,7,8,9,10,11],0,0,0,1)]}
```

**Also helps: Intervals & Keys 3–9** (intervals and minor keys: reading by distance; intervals below a note, and the minor scales whose raised notes are the accidentals of a minor-key page)

#### Intervals & Keys 3: Major intervals

- **Description:** Name and build intervals from the major scale
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the ascending interval E → F♯ .” → answer: major 2nd. (answered by **picking one choice**)
    - choices shown: major 6th, perfect 4th, major 2nd, minor 6th
    - hint: Letters: E to F counts 2 letters, inclusive.
    - explanation after answering: F♯ is degree 2 of the E major scale, so it's a major 2nd. Count letter names for the number (E = 1), then check half steps for the quality.
  - **Generator 2**, sample: “What note is a major 2nd above C ? Spell it: letter and accidental.” → answer: D. (answered by **writing it note by note / token by token**)
    - hint: Count 2 letter names, then fix the accidental to make 2 half steps.
    - explanation after answering: major 2nd = 2 half steps, and the letter must be 2 letters up (C→D). That gives D, not E𝄫.
- **Level note (the Details button):**
  - *Key takeaways:* An interval is named by counting letters, including both ends: C to E is a 3rd. / In a major scale the intervals above the tonic are major (2, 3, 6, 7) or perfect (unison, 4, 5, octave).
  - *What to pay attention to:* Count letters first for the number, then check the size for the quality. / A 4th and a 5th are perfect, never major.
  - *Skill it builds:* Naming and building distances. Chords are stacks of intervals, so this is the grammar of harmony.
  - *Theory and tips:* Sizes in half steps: major 2nd 2, major 3rd 4, perfect 4th 5, perfect 5th 7, major 6th 9, major 7th 11, octave 12. / To build an interval above a note, think of that note’s major scale.
- **Source of the level (exact settings):**

```js
{n:'Major intervals',d:'Name and build intervals from the major scale',g:[G_iv.nameIvMaj,recall1(G_iv.buildIv)]}
```

#### Intervals & Keys 4: Minor keys

- **Description:** Relative and parallel keys, natural minor
- **Input:** screen
- **Kind:** round level, 4 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “What is the relative major of D minor ?” → answer: F major. (answered by **picking one choice**)
    - choices shown: F major, E major, F♯ major, D major
    - hint: Up a minor 3rd.
    - explanation after answering: Go up a minor 3rd from D: F major. Same key signature (1♭).
  - **Generator 2**, sample: “How many sharps or flats does G♯ minor have?” → answer: 5♯. (answered by **picking one choice**)
    - choices shown: none, 5♯, 4♯, 6♭
    - hint: Find its relative major: up a minor 3rd from G♯.
    - explanation after answering: G♯ minor is the relative minor of B major, so it has 5♯.
  - **Generator 3**, sample: “C major has no sharps or flats. How many does its parallel minor (C minor) have?” → answer: 3♭. (answered by **picking one choice**)
    - choices shown: 3♭, none, 2♯, 1♯
    - hint: Parallel minor = 3 steps flatward on the circle of 5ths.
    - explanation after answering: Parallel keys share a tonic. Minor = major with ♭3, ♭6, ♭7, which equals three more flats (or three fewer sharps): C minor has 3♭.
  - **Generator 4**, sample: “What is the 6th degree of D natural minor ? Spell it: letter and accidental.” → answer: B♭. (answered by **writing it note by note / token by token**)
    - hint: Natural minor lowers 3, 6 and 7 compared with major.
    - explanation after answering: D natural minor: D – E – F – G – A – B♭ – C (1 2 ♭3 4 5 ♭6 ♭7).
- **Level note (the Details button):**
  - *Key takeaways:* Every major key shares its notes with a minor key three half steps below: the relative minor. C major and A minor. / Parallel keys share a tonic: C major and C minor. C minor has three more flats.
  - *What to pay attention to:* Relative: same signature, different home. Parallel: same home, different signature. / Natural minor lowers 3, 6 and 7 of the major scale on the same tonic.
  - *Skill it builds:* Moving between major and minor, which tunes do all the time.
  - *Theory and tips:* The relative minor starts on the 6th degree of the major scale. / A parallel minor has the signature of the major key a minor 3rd above it: C minor uses E♭ major’s three flats.
- **Source of the level (exact settings):**

```js
{n:'Minor keys',d:'Relative and parallel keys, natural minor',g:[G_iv.relMin,G_iv.sigMin,G_iv.parallel,recall1(G_iv.degMin)]}
```

#### Intervals & Keys 5: All intervals

- **Description:** Minor, augmented and diminished; spelling counts
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Name the ascending interval D♭ → F .” → answer: major 3rd. (answered by **picking one choice**)
    - choices shown: major 3rd, augmented 4th, perfect 4th, minor 3rd
    - hint: Number first: D to F. Then count half steps.
    - explanation after answering: D♭ to F: 3 letter names and 4 half steps = major 3rd. Spelling decides the number (D→F), half steps decide the quality.
  - **Generator 2**, sample: “What note is a minor 6th above C♯ ? Spell it: letter and accidental.” → answer: A. (answered by **writing it note by note / token by token**)
    - hint: Letter: count 6 from C.
    - explanation after answering: Count 6 letters from C♯, with C as 1: the letter is A. 8 half steps above C♯ makes it A. G𝄪 is the same pitch but the wrong interval number.
- **Level note (the Details button):**
  - *Key takeaways:* Lower a major interval by a half step and it is minor. Lower a minor or a perfect one and it is diminished. Raise a major or a perfect one and it is augmented.
  - *What to pay attention to:* The letter count fixes the number. C to D♯ is an augmented 2nd; C to E♭ is a minor 3rd. Same fret, different interval. / Perfect intervals never become major or minor.
  - *Skill it builds:* Exact spelling of any distance. Chord symbols like ♯11 and ♭13 are this skill.
  - *Theory and tips:* Half steps: minor 2nd 1, minor 3rd 3, tritone 6 (augmented 4th or diminished 5th), minor 6th 8, minor 7th 10. / Why spelling matters: a C7 has B♭, a minor 7th. Write it as A♯ and it reads as a different chord.
- **Source of the level (exact settings):**

```js
{n:'All intervals',d:'Minor, augmented and diminished; spelling counts',g:[G_iv.nameIvAll,recall1(G_iv.buildIvAll)]}
```

#### Intervals & Keys 6: Harmonic & melodic minor

- **Description:** Raised 6ths and 7ths, identify the scale
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “What is the 7th degree of G melodic minor (ascending, jazz convention)? Spell it: letter and accidental.” → answer: F♯. (answered by **writing it note by note / token by token**)
    - hint: Major scale with a ♭3.
    - explanation after answering: G melodic minor: G – A – B♭ – C – D – E – F♯. Melodic minor (ascending) raises 6 and 7 (1 2 ♭3 4 5 6 7).
  - **Generator 2**, sample: “Which scale is C – D – E♭ – F – G – A♭ – B ?” → answer: C harmonic minor. (answered by **picking one choice**)
    - choices shown: C harmonic minor, C natural minor, C major, C melodic minor (ascending)
    - hint: Look at the 3rd, 6th and 7th.
    - explanation after answering: Check degrees 3, 6, 7 against C major: ♭3 ♭6 ♭7 = natural; ♭3 ♭6 7 = harmonic; ♭3 6 7 = melodic.
- **Level note (the Details button):**
  - *Key takeaways:* Harmonic minor raises the 7th of natural minor. Melodic minor raises the 6th and the 7th.
  - *What to pay attention to:* Harmonic minor has an augmented 2nd between its 6th and 7th. / Melodic minor is a major scale with a lowered 3rd.
  - *Skill it builds:* The two minor scales that give minor keys their dominant chord and jazz its altered sounds.
  - *Theory and tips:* The raised 7th exists to make the V chord major with a leading tone: in A minor, E7 and not Em7. / Classical melodic minor comes down as natural minor. Jazz uses the raised form both ways.
- **Source of the level (exact settings):**

```js
{n:'Harmonic & melodic minor',d:'Raised 6ths and 7ths, identify the scale',g:[recall1(G_iv.harmMel),G_iv.whichMinor]}
```

#### Intervals & Keys 7: Inversions & enharmonics

- **Description:** What each interval becomes when inverted, by name and then on notes (the augmented and diminished pairs too); pairs of intervals that sound the same and are spelled differently
- **Input:** screen
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Invert a minor 7th (move the lower note up an octave). What interval results?” → answer: major 2nd. (answered by **picking one choice**)
    - choices shown: major 2nd, perfect 5th, minor 2nd, diminished 5th, major 6th
    - hint: Numbers sum to nine; major becomes minor.
    - explanation after answering: Inversions add up to 9: 7 + 2 = 9. Major ↔ minor, perfect stays perfect, augmented ↔ diminished. major 2nd .
  - **Generator 2**, sample: “Which interval is the enharmonic equivalent of a minor 7th (same sound, different spelling)?” → answer: augmented 6th. (answered by **picking one choice**)
    - choices shown: augmented 2nd, augmented 6th, diminished 3rd, diminished 7th
    - hint: Count the half steps, then respell one note with the neighbouring letter.
    - explanation after answering: minor 7th = augmented 6th : same number of half steps, spelled from a different letter. Spelling follows the key or chord: C–E♭ is a minor 3rd in Cm, C–D♯ an augmented 2nd in harmonic minor.
  - **Generator 3**, sample: “E up to A♯ is an augmented 4th. Turn it over: A♯ up to E is …?” → answer: diminished 5th. (answered by **picking one choice**)
    - choices shown: augmented 6th, diminished 5th, minor 6th, augmented 4th, diminished 4th
    - hint: Take the number from 9. Then: perfect stays perfect, major and minor change places, augmented and diminished change places.
    - explanation after answering: A♯ up to E: 5 letters (A B C D E) and 6 half steps, a diminished 5th . The numbers of an interval and its inversion add up to 9 (4 + 5), the half steps to 12 (6 + 6), and augmented turns into diminished and diminished into augmented.
- **Level note (the Details button):**
  - *Key takeaways:* Turn an interval upside down and the two numbers add to nine; major becomes minor, augmented becomes diminished, perfect stays perfect.
  - *What to pay attention to:* A major 3rd inverts to a minor 6th. A perfect 4th inverts to a perfect 5th. A tritone inverts to a tritone. / Enharmonic: same pitch, different name, different job. / Inversion is asked by name first and then on notes: C up to A is a major 6th, so A up to C is a minor 3rd. On notes the augmented and diminished pairs come as well: A2 and d7, A4 and d5, A5 and d4, A6 and d3. The enharmonic twins are asked by name, eight pairs.
  - *Skill it builds:* Seeing the same notes two ways. Inversions of chords and rootless voicings depend on it.
  - *Theory and tips:* The 3rd and 7th of a dominant chord are a tritone whichever one is on the bottom. That is why the two can swap places in voice leading. / An augmented 6th sounds like a minor 7th. The spelling tells you which way it wants to resolve.
- **Source of the level (exact settings):**

```js
{n:'Inversions & enharmonics',d:'What each interval becomes when inverted, by name and then on notes (the augmented and diminished pairs too); pairs of intervals that sound the same and are spelled differently',g:[ivInvQ(),enhQ(),ivInvNotesQ()]}
```

#### Intervals & Keys 8: Below a note, and beyond the octave

- **Description:** The note a given interval below a note; then the 9, ♭9, ♯9, 11, ♯11, ♭13 and 13 above a root
- **Input:** screen
- **Kind:** round level, 2 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “What note is a diminished 5th below G ? Spell it: letter and accidental.” → answer: C♯. (answered by **writing it note by note / token by token**)
    - hint: Letter first: count 5 letters down from G. Or turn it over: a diminished 5th below is an augmented 4th above.
    - explanation after answering: Count 5 letters down from G, with G as 1 (G F E D C): the letter is C. From that note up to G must be 6 half steps, so it is C♯ . D♭ is the same pitch on the wrong letter. The same note by inversion: a diminished 5th below G is an augmented 4th above it, an octave lower.
  - **Generator 2**, sample: “What note is the ♭9 above C♯ : an octave plus a minor 2nd? Spell it: letter and accidental.” → answer: D. (answered by **writing it note by note / token by token**)
    - hint: Take 7 from the number: a 9th is a 2nd, an 11th a 4th, a 13th a 6th, an octave higher. The sign stays with it.
    - explanation after answering: A ♭9 is an octave plus a minor 2nd: take 7 from the number (9 − 7 = 2) and the quality stays. A minor 2nd above C♯: 2 letters up (C D), 1 half step: D . With the octave, 13 half steps.
- **Level note (the Details button):**
  - *What this level adds:* Two things the earlier levels left out: an interval built downward from a note, and the intervals larger than an octave that chord symbols are written in.
  - *What to pay attention to:* Below a note: count the letters down first, the given note as 1. A 6th below C is some kind of E. Then fix the accidental so that the distance up to the given note is right. / Or turn it over: a major 3rd below C is a minor 6th above C, an octave lower. Both ways must give the same letter. / Beyond the octave: take 7 from the number. A 9th is a 2nd, an 11th a 4th, a 13th a 6th, an octave higher, and the sign stays: a ♯11 is an augmented 4th, a ♭13 a minor 6th. / A ♯9 is a raised 2nd. On C it is D♯, never E♭.
  - *Theory and tips:* Now and then the correct answer needs a double flat or double sharp: a major 3rd below G♭ is E𝄫, the ♯9 of B is C𝄪. The small rows under the keyboard enter them. / Speed target: 4 seconds for a note below, 3.5 seconds for a tension. One note is entered, but the letter has to be counted backwards or an octave taken off first.
- **Source of the level (exact settings):**

```js
{n:'Below a note, and beyond the octave',d:'The note a given interval below a note; then the 9, ♭9, ♯9, 11, ♯11, ♭13 and 13 above a root',g:[ivDownQ(),ivTenQ()]}
```

#### Intervals & Keys 9: The minor scales, every key

- **Description:** Natural, harmonic and melodic minor spelled whole in the fifteen minor keys, and the 6th and 7th of each
- **Input:** screen
- **Kind:** round level, 3 generators (each question is drawn from one of them at random).
  - **Generator 1**, sample: “Spell the A♭ melodic minor scale (ascending, jazz convention), note by note from the tonic.” → answer: A♭ – B♭ – C♭ – D♭ – E♭ – F – G. (answered by **writing it note by note / token by token**)
    - hint: A♭ minor has the signature of C♭ major: 7♭. Write that scale from A♭; then raise what the form raises, keeping the letter.
    - explanation after answering: A♭ minor has the signature of C♭ major (7♭), so A♭ natural minor is A♭ B♭ C♭ D♭ E♭ F♭ G♭. Changed from natural minor: the 6th and the 7th are raised a half step and keep their letters, F♭ becomes F and G♭ becomes G. That is A♭ major with a lowered 3rd. A♭ melodic minor (1 2 ♭3 4 5 6 7): A♭ B♭ C♭ D♭ E♭ F G .
  - **Generator 2**, sample: “Spell the D♯ harmonic minor scale, note by note from the tonic.” → answer: D♯ – E♯ – F♯ – G♯ – A♯ – B – C𝄪. (answered by **writing it note by note / token by token**)
    - hint: D♯ minor has the signature of F♯ major: 6♯. Write that scale from D♯; then raise what the form raises, keeping the letter.
    - explanation after answering: D♯ minor has the signature of F♯ major (6♯), so D♯ natural minor is D♯ E♯ F♯ G♯ A♯ B C♯. Changed from natural minor: the 7th is raised a half step and keeps its letter, C♯ becomes C𝄪. From the ♭6 to the 7, B to C𝄪, is an augmented 2nd. D♯ harmonic minor (1 2 ♭3 4 5 ♭6 7): D♯ E♯ F♯ G♯ A♯ B C𝄪 .
  - **Generator 3**, sample: “What is the 6th degree of F♯ melodic minor (ascending, jazz convention)? Spell it: letter and accidental.” → answer: D♯. (answered by **writing it note by note / token by token**)
    - hint: Natural minor: ♭6 and ♭7, as the signature gives them. Harmonic minor: ♭6 and a raised 7. Melodic minor: 6 and 7 both raised.
    - explanation after answering: F♯ natural minor (the signature of A major, 3♯) is F♯ G♯ A B C♯ D E; its 6th is D. Melodic minor raises the 6th and the 7th: D becomes D♯ , a half step higher on the same letter. F♯ melodic minor: F♯ G♯ A B C♯ D♯ E♯.
- **Level note (the Details button):**
  - *What this level adds:* The three minor scales written out whole, in all fifteen minor keys, and their 6th and 7th asked one at a time.
  - *What to pay attention to:* Start from the key signature: a minor key has the signature of the major key a minor 3rd above it. That gives natural minor. / Harmonic minor: raise the 7th. Melodic minor: raise the 6th and the 7th. Raise means a half step higher on the same letter: a flat becomes a natural, a natural a sharp, a sharp a double sharp. / The lower five notes never change. Only the 6th and the 7th tell the three scales apart.
  - *Theory and tips:* G♯, D♯ and A♯ minor need a double sharp for a raised note: the 7th of G♯ harmonic minor is F𝄪. A♯ melodic minor would need two (F𝄪 and G𝄪) and is not spelled whole; its 6th and 7th are asked singly. / In the flat keys the raised note is often a natural: the 7th of C harmonic minor is B, of F harmonic minor E. / Speed target: 10 seconds for a whole scale, 3.5 seconds for one degree. A minor scale is derived from its signature, not known by heart as the major scales are.
- **Source of the level (exact settings):**

```js
{n:'The minor scales, every key',d:'Natural, harmonic and melodic minor spelled whole in the fifteen minor keys, and the 6th and 7th of each',g:[minScaleQ(),minScaleQ(),minDegQ()]}
```
