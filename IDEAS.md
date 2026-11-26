# Fretwise: ideas talked about and not built

Features and changes that came up in conversation and were **not** added to the app. Kept so nothing is lost between sessions.

**For any session working in this repo:** whenever a feature or change is discussed and not built (offered and declined, postponed, "not now", left open by a question), add it here in the same turn: the date, what it is, why it was not built, and what it would take. When an item is built, move it to "Built since" at the bottom with the date and commit. Do not delete items.

CLAUDE.md also holds older "not built" notes inside its build sections (search it for "Not built", "Not done", "Still missing"). This file is the one list from 26 Nov 2026 on.

## Open

### Reading goal (goal R, "Read at sight"): from the outside review of 26 Nov 2026
The full description the review was made from: `docs/goal-R-read-at-sight.md`. The user asked for commentary only; nothing here is decided.

**Briefed on 26 Nov 2026, not built yet:** items 1, 2, 4, 5 and 6 are written up for a building session in `.claude/reading-brief.md` (phases A to D; five proposed choices to confirm with the user first). Items 3, 7 and 8 and the smaller points are not in that brief.

1. **Fairer grading of long takes.** Today any wrong note fails a whole take (long pages forgive one unheard note in sixteen and a few late ones). Idea: grade pages of four bars and more by the share of notes right and in time, with no stop, e.g. 90 to 95 %. Small. Should come before anything that makes the lines harder. **Built 26 Nov 2026 (reading build, phase A): see Built since.**
2. **Scan time that grows with the page.** With "Listen as soon as the question appears" on, the count-in starts at once: about four seconds to look, the same for a 5-note line and a 32-bar page. Idea: a look time set by the length of the page (a few seconds for a line, up to about 30 for a page), then an automatic count-in. Small. **Built 26 Nov 2026 (reading build, phase A): see Built since.**
3. **A target tempo for the master standard.** Passing never depends on tempo; every level can be passed at its slowest. Idea: each level's green standard is measured at a stated tempo. Limit: above about 120 the microphone stops separating swung eighths. Small.
4. **Goal changes.** Move to "also helps": Reading Rhythm 18 (12/8), 22 (sixteenth-note triplets), 23 (5/4 and 3/8), 24 (changing meters), and Rhythm Dictation 1–4. Keep Reading Rhythm 21 (broken triplets) required. Possibly require Sing the Page 1–6 (held back: that game has never been tried with a real voice). Small. **Built 26 Nov 2026 (reading build, phase B), with Reading Rhythm reordered: those four levels are now 23–26 (12/8, sixteenth-note triplets, 5/4 and 3/8, changing meters). Sing the Page stays in the appendix.**
5. **Longer lines early.** Sight Reading 1–23 ask 4 to 17 notes; four bars appear only sometimes (levels 7, 13, 16, 20) and real length starts at level 24. Idea: four bars from about level 3, eight by the middle of the ladder, kept easy and slow. Medium. **Built 26 Nov 2026 (reading build, phase C).**
6. **A chord-chart strand.** Levels that show chord symbols over bars with slashes or written rhythms (hits, pushes) and listen to the strummed chords in time: one chord a bar, then written rhythms, two chords a bar, a 12- or 16-bar chart. Reuses the chord-and-beat grading of Comping and Repertoire 9. Limits: notes under C3 are not checked, a voicing cannot always be told from another of the same chord, timed strums are untested on a real guitar. A real build.
7. **Melodies that read like jazz heads.** (Excluded for now by the user, 26 Nov 2026.) The reading lines move by step and third inside the key. Idea: arpeggios, leaps of a 6th or 7th, chromatic approach notes, enclosures, more accidentals, written by rule over the stored changes. Correctness can be proved by test; whether they feel like real heads needs the user's and the teacher's eyes. Do after items 1 and 5. A real build.
8. **The band under the long pages.** Piano, bass and hi-hat playing the changes under the 16- and 32-bar pages. Needs headphones (the microphone hears speakers). Medium.

Smaller points of the same review, not built:
- Sight Reading 7 still draws position II or IV from question to question; Reading was split into one position a level, Sight Reading was not.
- The rhythm of repeated notes is not checked (equal pitches in a row count as one note: a limit of the note detector). Needs re-attack detection and testing on the real guitar.
- ~~Sight Reading 29's tempo text says the eighths stop swinging under 80~~: corrected in phase C of the reading build (26 Nov 2026).
- Written chords of three and four notes on the staff (Reading 13 has two notes only).
- Multi-bar rests to count; coming in after bars of silence.
- Choosing the position yourself (every level names it).
- Positions X to XII, ledger lines above the 12th fret, 8va.
- Keys beyond four sharps or flats (D♭, G♭).
- Minor-key lines with the raised 6th and 7th outside the tune pages.
- Other chart markings read and played: tempo and style words, articulations, a key or meter change inside a chart, "last time only", fermatas.
- A last "for life" stage: 15 minutes of new pages a day at a rising tempo (the lines are already new every time, and Endless exists).

### The user's own tunes in Sight Reading (26 Nov 2026)
An entry tool: type a melody in with the rhythm writer (a value, then a pitch) and its chords; it is saved on the user's machine only (never in the repo or on the public site) and Sight Reading shows it as a page in any key and position. `srTunePage` already takes a tune in the app's tune format. Came up when the user asked about pages from a fake book: those melodies are copyrighted, so they are not put into the app or the repo; pages may be shown as study material for how heads are built. Not built; the user was asked whether to add it and has not answered.

### "Everything" levels in two difficulties, Medium and Hard (26 Nov 2026)
The user finds Reading Rhythm 16 "Everything so far, in 4/4" far too hard: the counting grid changes from beat to beat (triplets, then sixteenths, then eighths) with rests and dots on top. Plan put to him:
- **Medium**: one grid a bar (an eighth bar, a sixteenth bar or a triplet bar; the grid changes only at a bar line, held for two bars = one line of the page), at most one rest, dot or tie inside a bar, a slower start tempo.
- **Hard**: the level as it is.
- Recommended form: Medium inserted before each "everything" level (Reading Rhythm 16, 19, 21; they were 16, 20, 25 before the reorder of 26 Nov 2026), a renumbering migration, his answers staying with Hard; Hard in "also helps". Alternative: a Medium/Hard switch on the level page (no migration; a pass on Medium would count as a pass on Hard).
- Open questions he has not answered: only Reading Rhythm, or also Jazz Rhythm 10 and Rhythm Dictation 15–16; is Hard required to move on.

### Goal D and the dictation levels (25 Nov 2026)
Since Rhythm Dictation became its own game, goal D (comping) requires Rhythm Dictation 5–14 in stage 3 (it required three dictation levels before): old Swing dictation is new level 14 and a goal's levels run from 1 without a gap. Offered and not answered: move the swing-dictation requirement to "also helps", so that D requires Rhythm Dictation 1–8 only.

## Built since

- **26 Nov 2026, reading build phase A** (Reading goal items 1 and 2): Sight Reading takes of 16 notes and more pass at 90 % of their notes right and in time with no stop of more than four beats; a scan of 2 seconds a written bar (4 to 30) before every count-in, Space to cut it short. Commit: fe8adf4.
- **26 Nov 2026, reading build phase B** (Reading goal item 4): Reading Rhythm reordered (18 Cut time, 19 Everything so far, 20 Broken triplets, 21 Everything, 22 Road map, played, 23 12/8, 24 Sixteenth-note triplets, 25 5/4 and 3/8, 26 Changing meters); goal R requires Reading Rhythm 1–22, no Rhythm Dictation; 101 → 93 required levels. Commit: 74c44df.
- **26 Nov 2026, reading build phase C** (Reading goal item 5): Sight Reading 3–12 ask four bars two times in three, 13–23 eight bars half the time and four a third (the shift lines of 21 too); every existing two-bar generator kept, at a sixth of the draws from level 13; the scan and count-in box fixed at the top. Commit: 0064bf5.
