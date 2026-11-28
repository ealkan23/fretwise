# One textbook for one Fretwise game: merge the full notes and the YouTube Notes, standard build brief

## SETTINGS (the only part that changes from game to game)
GAME_ID            = arp
GAME_NAME          = Arpeggio Runner
SOURCES            = LESSON_NOTES[GAME_ID] (the game's full notes) + YT_GAME[GAME_ID] (the YouTube Notes, one entry per
                     video) + their working files: videos/<channel>/digest_<GAME_ID>/<id>.md and <id>.verify.md, the
                     transcripts videos/<channel>/<id>.txt, .claude/ytg/<GAME_ID>_G*.js (the writers' files)
OUTLINE_CHECKPOINT = yes  (stop after phase 3, show the outline to the user, wait for "go")
AFTER_MERGE        = remove GAME_ID's per-video YouTube Notes page (its button, view entry and YT_GAME data);
                     everything it taught lives in the new textbook. Set to "keep" to leave that page in place.
SCOPE              = this game's notes only. No level, item key, grading rule, generator or saved datum changes.
COST GUIDE         = about $80–150 of Opus for a game of ~140 videos; if it heads for far more, stop and say why.
---

## 0. The goal, in one paragraph
GAME_NAME has two bodies of teaching: the full notes (the app's own textbook) and the YouTube Notes (one textbook
section per video, from two teachers whose videos repeat, overlap and contradict each other, and are fragments of a
subject rather than a course). Turn them into ONE university-level textbook for a guitarist: organised by subject, not
by video; every idea taught once, in its best form, at the point in the course where the student is ready for it;
nothing that matters for playing lost; nothing padded. It replaces the game's full notes (LESSON_NOTES[GAME_ID]). The
planning is the heart of this job: think like the author of a course book who has read every source, before anyone
writes a sentence.

## 1. Before you start
- Work in /Users/emir/Desktop/fretwise-repo. Read CLAUDE.md in full, especially: "The full notes are textbook chapters",
  "The full notes, made simpler" (the house rules and the table of home games), "Arpeggio Runner's full notes rewritten"
  (the rules of the text and figures: keep them), the "YouTube Notes for GAME_NAME" section, "YouTube transcripts are
  planning material".
- Read the memory notes notes-style.md, never-drop-data.md, lean-ladders.md, youtube-is-planning-material.md,
  test-copy-paused.md, ideas-list.md.
- Snapshot first: a local git tag v-<date>-before-<GAME_ID>-notes-merge, and a copy of the live store
  (tests/dump_store.py backups/store-before-<GAME_ID>-notes-merge-<date>.json). The store holds the user's highlights of
  these notes (STORE.hl[GAME_ID] and STORE.hl['yt:'+GAME_ID]); see phase 7.
- Use agents (Agent tool, model opus). The session runs at most 20 at once: queue the rest. Brief every agent with this
  whole file plus its own task; agents report back, the lead decides.
- Ask the user only at the OUTLINE_CHECKPOINT, or if something here is impossible as written.

## 2. What the finished textbook must be
1. One course. Parts, chapters, sections in the order a student should learn them. Every term defined before it is
   used; every exercise placed after what it needs. The order is argued, not assumed: each part and chapter says in one
   line why it comes where it does (in the plan; in the text only when it helps the student).
2. Consolidated. An idea taught in five videos is taught once: the clearest explanation, the best worked example, and
   the union of the details that matter (a fingering one teacher adds, a mistake another warns about). Repetition
   across the sources is a signal of importance, not a reason to repeat: it may earn the idea more space or a practice
   routine, never a second explanation.
3. Complete. Every teaching unit in the sources ends up in the book or is cut on purpose with a reason (fluff, a
   duplicate, wrong, belongs to another game's home). Nothing important is dropped quietly.
4. Honest about sources. Where the two teachers (or a teacher and the app) disagree, say so in one sentence and give
   both, or say which the course follows and why. Reconstructed material stays tagged (.ytinf "reconstructed");
   unclear points from the videos are not taught (they may be listed in a short end-of-chapter note if they matter).
   Credit a teacher or player by name where the idea is theirs (Barry Harris's chromatic scale, Wes Montgomery's
   minor-7 trick), not on every paragraph.
5. University level, plain language. The plain idea first, then the worked example, then the figure, then the detail
   and the reference tables; theory explained so a student understands why, not only what. Short sentences, every term
   explained at first use, no fluff. House style: Berklee numerals upper case (IIm7, V7, IMaj7), "Maj7" never "maj7",
   real ♭ and ♯, no em dashes, the game's own names (the turn = 2 1 7 1; enclosures put the target last; level names
   exactly as in GAMES).
6. Practice built in. Each chapter ends with what to practise and in what order (tempos where the sources give them),
   and the "In the games" line the notes already use (ig(): which levels of which games practise it). Where the book
   teaches something no level asks, say so in that line; add it to IDEAS.md as a possible level, do not build it.
7. Bridging text is allowed: a textbook needs connective explanation the videos never give. It must be correct
   (computed where it is a musical fact), and it must not invent exercises or put words in a teacher's mouth.
8. One home per topic across the app (the table in CLAUDE.md): a subject whose home is another game (scales and
   positions → Scale Runner, chord formulas → Chord Spelling, modes → Modes, harmony → Harmony & Analysis, rhythm →
   Reading Rhythm / Pulse & Feel…) gets the two or three sentences this book cannot do without and a pointer to its
   home, not a chapter.
9. Sources kept as data. Every item carries src:[[videoId, t], …] (the topic times the YouTube Notes already store) or
   src:['notes'] for the app's own text; rendered nowhere. Each chapter ends with a short "From the lessons" list: the
   titles of the videos it draws on, as links that open YouTube from the start (no timestamps on the page).

## 3. Figures
As in the existing notes: only where a picture teaches faster than words; NF kit and the YTF helpers (read their code;
YTF.ct, YTF.at, YTF.stf, YTF.seq, YTF.inpos, YTF.chordIn, YTF.pos, YTF.nps) and the game's own builders; every neck
titled, every dot labelled (say degrees or fingers), the root gold, nothing typed that can be computed, NF.err empty. Reuse
the best figure among the sources for an idea rather than drawing three. A figure from a reconstruction says so.

## 4. Phases

Phase 1: inventory (parallel). Break every source into teaching units: one concept, rule, exercise, example, lick,
fingering, tip, warned-about mistake or practice routine. Agents by source slice (the full notes' chapters; groups of
~6 video entries, read together with their digests and verify files). Each unit: {id, kind, statement (one or two
plain sentences), exact data (notes, degrees, frets as pitches+strings, rhythm, tempo), source [[vid,t]] or 'notes',
confidence (said | reconstructed | unclear), level, prerequisites (other concepts by name), notes on quality (is this
the clearest version?)}. Output .claude/merge/<GAME_ID>/units/*.jsonl. Units marked unclear are kept in the inventory
but flagged "do not teach".

Phase 2: consolidation (parallel by subject). The lead first groups units into subjects (a quick pass over unit
statements: e.g. "arpeggio shapes and areas", "the arpeggio from the 3rd", "enclosures", "Barry Harris chromatic
scale", "triad pairs", "quartal structures"…). One agent per subject: merge duplicates into concepts; for each concept
pick the best explanation and example (say why), union the details that add something, record conflicts between
sources, record what is cut and why. Output .claude/merge/<GAME_ID>/concepts/<subject>.md with a ledger: every unit id
→ concept id or "cut: reason". A second agent per subject checks the ledger against the units (nothing lost, nothing
merged that is really two ideas).

Phase 3: the plan (the most important phase). One architect agent, then two independent critic agents, then the lead.
- The architect builds the prerequisite graph of all concepts and designs the course: parts → chapters → sections,
  each chapter with its goal, the concepts it teaches in order, its worked examples and figures (named, from the
  ledger), its practice routine, its "In the games" line, its length estimate (a chapter over ~2,500 words is split),
  and one line on why it sits where it does. It also lists what is cut, what moves to another game's home (with the
  pointer text), the conflicts and how each is handled, and the gaps (places where the progression needs bridging
  text).
- Critic 1 (pedagogy): walk the outline as a student. Any term used before it is taught? Any big jump in difficulty?
  Anything taught twice? Anything advanced too early or basic too late? Does each part build on the last?
- Critic 2 (coverage): walk the ledgers. Is every kept concept placed exactly once? Every cut justified?
- The lead revises and writes .claude/merge/<GAME_ID>/outline.md. OUTLINE_CHECKPOINT: show the user the outline
  (parts, chapters with one line each, the order's reasoning, what is cut or moved, the conflicts, the expected length)
  and wait for "go" or changes.

Phase 4: writing (parallel). One writer agent per chapter (or two short chapters), given the outline, its concepts
files, the units they reference, and the sources behind them (digests, verify files, transcripts where needed, the
existing chapter text). Output .claude/merge/<GAME_ID>/ch/<nn>.js, one chapter object in LESSON_NOTES form
{h, p:[items each with src], …} using the existing helpers of LESSON_NOTES[GAME_ID] (T, see(), ig(), the figure
helpers) where they fit. Check each file with a small script (renders, NF.err empty, house style, every item has src).

Phase 5: editing into one book. One editor agent per part, then the lead over the whole: one voice; pointers between
chapters by title (see()); no forward references; no repetition across chapters (a later chapter recalls an earlier
idea in a clause and points to it); terms consistent; the "In the games" lines checked against GAMES.

Phase 6: verification (parallel). (a) Facts: recompute every note, degree, fret and spelling with a script or the app's
functions. (b) Coverage: every concept of the outline is in the text; every ledger "kept" unit is reachable.
(c) Order: a script lists, for each defined term, where it is first used and first defined. (d) Sources: every
reconstruction still tagged; nothing taught from an "unclear" unit. (e) A final proof-reader per part reads the
rendered text as a student would. The lead fixes everything found.

Phase 7: install and clean up.
- Replace LESSON_NOTES[GAME_ID] with the new book (keep its helpers that are still used; remove the rest). The lesson
  card's button shows the new chapter count.
- AFTER_MERGE: if "remove": delete YT_GAME[GAME_ID] (its entries block, ORDER, parts), its button condition, and every
  helper used only by it; keep the shared YouTube Notes code if another game still uses it (Scale Runner does); keep
  the digests and verify files (git-ignored) as the research trail.
- Highlights (never drop data): STORE.hl[GAME_ID] and STORE.hl['yt:'+GAME_ID] are found by chapter index and their
  own words. Write a one-off migration (flag in STORE, run once, a no-op the second time) that re-anchors each highlight
  to the new chapter that holds its exact text; a highlight whose text no longer exists stays stored, is not drawn, and
  is listed in the report. Test it on the store copy.
- Remove what the merge made dead: unused CSS, sweep checks that tested the removed page (replace them with checks of
  the new book), scratch files under .claude/merge older than the final versions.
- Update the sweep's notes checks for this game (the existing block for its full notes: In the games lines, titles,
  no maj7, comparison rows…) so they test the new book, and add: every item has src; every src video exists; no forward
  reference to an undefined term (from the phase 6 script); NF.err empty. Prove two checks by breaking the data once.

Phase 8: checks and publish. Headless and muted always. node tests/extract.js && node --check tests/fw.js && node
tests/sweep.js → bad 0, twice; .venv/bin/python tests/pages_check.py → all ok; render the notes page at 1440 and 1000 px
(tests/arp_notes_shots.py GAME_ID) and look at every figure; python3 build.py. Then a CLAUDE.md section "<GAME_NAME>:
one textbook from the notes and the lessons" (date, outline, where the code is, decisions, what was cut or moved and
why, conflicts and how they were resolved, the highlight migration's numbers, what was not verified), replacing the
older sections that describe what no longer exists (say so in one line where they were). IDEAS.md: the new-level ideas
from point 6 of section 2, and anything discussed and not built. Commit and push; confirm the live build
(curl -s https://ealkan23.github.io/fretwise/ | grep -o "const BUILD='[^']*'").

## 5. Report to the user
Plain and short: the outline (parts and chapters) and why it is ordered so; length before and after (words, chapters,
figures); how much was merged, cut and moved to other games' notes; the conflicts between sources and how they were
handled; the highlights kept, re-anchored or orphaned; what was not checked (nothing played on a guitar); cost.

For another game later: change the settings lines (GAME_ID, GAME_NAME, the writers' file pattern) and scale the cost.
