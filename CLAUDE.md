# Fretwise

Guitar music-theory, ear-training, rhythm and microphone trainer for an aspiring jazz guitarist (Berklee-style curriculum). Single-page app, no build step for development, no framework. One vendored dependency (user-approved): Spotify Basic Pitch + TensorFlow.js in `vendor/` for guitar note detection.

- **Live site (the one page the user uses):** https://ealkan23.github.io/fretwise/ — GitHub Pages from the public repo `ealkan23/fretwise`. `.github/workflows/pages.yml` publishes `src/fretwise.html` as `index.html` with `piano/` beside it on every push to `main`, so **deploying = commit + `git push`** (watch with `gh run watch`). Mic works there; progress is in that browser's `localStorage` key `fretwise-v1`. The user works only from Claude Code: never send them to a claude.ai chat to publish.
- **Old claude.ai artifact (retired):** https://claude.ai/artifact/756Z4Kc3AywDU1mgsGazsQ — no longer updated. `initCloud` only runs when framed with `window.claude`; elsewhere it shows "Saved in this browser". Progress moves between copies with Overview → "Move your progress" (export/import JSON; per game the copy with more answers wins).
- **Offline file:** `dist/fretwise.html` (built by `build.py`, piano embedded, git-ignored). Open from disk in Chrome.
- **Pedagogical review** that drove the roadmap: https://claude.ai/artifact/7emdzZtQ8s6Eb2FDthZEUL

## Fix list (how the user reports problems)

The user writes problems in the app: a box under every answer ("Tell Claude…") and the **Fix list** page on home. Reports are stored in the browser's IndexedDB (`fretwise-fix`/`reports`) with the question context (`fixContext`: game, level, prompt, answer, what was given, mic target/heard/per-slot/detector) and the take's audio for mic questions. When the user says "check the fix list", run `.venv/bin/python tests/read_fixlist.py`: it copies Chrome's storage to a temp profile (read-only) and writes `fixlist/reports.json` + WAVs (git-ignored). Work through the reports; the user deletes fixed ones on the Fix list page. After a fix, `.venv/bin/python tests/fix_takes.py` replays every reported take into the same question through the live path and prints old vs new grading. Note Hunt changes must also keep `tests/hunt/skip2.js` (cuts single spots out of the takes; run from tests/hunt/) catching skipped spots: leniency that passes every take but stops catching skips is not a fix.


## Nov 2026 additions (audit items 1–4)

- **`triadQ` name clash fixed**: the Triad Shapes generator is `triadShapeQ`; `triadQ(ns)` is the quality helper. The sweep now fails on any question text containing code, `undefined`, `NaN` or a `?` quality (proved by reintroducing the clash: 1,503 bad).
- **Chord grading (beta)**: `CHO`, `bpRaw`, `chordStrums`, `chordCheck`, `strumGrade`. Questions tagged `grip:true` become “strum it” in play mode (`q.strumSeq`, `q.strumAlts`; option “Strum chords”, `opts.strum`). Notes below C3 are reported as not checked (laptop mic). Tuned on recordings/chords.wav: right 9/10, other chord 0/20, one-note-off 0/74. Regression: `.venv/bin/python tests/chord_live.py`.
- **Bends & Vibrato** game (`bendQ`, `bendAnalyse`, `bendGrade`, `bendSVG`, `BEND`): graded from the YIN pitch curve (`opts.curve`). Verified on synthetic curves only: `node tests/bend_check.js` (verdicts and the numbers shown). Real-guitar tuning still needed: recorder takes `bends`, `vibrato`.
- **Call & Response L8–9**: blues phrases in time (`crBlues`, `BLUES_LICKS`), double stops graded as chords (`crDoubles`; recorder take `doubles`).
- **Musical checkups** (`CK_TASKS`, `ckStart/ckStop/ckSave`, IndexedDB `fretwise-checkups`): six recorded tasks every 28 days, first vs latest playback. Only the time task is measured (onsets vs beats: hits, mean, spread, drift; relative measures verified with synthetic players, the absolute offset depends on the real speaker→mic delay).


## Nov 2026 consolidation (audit item 7)

33 → 25 games. `MERGES` + `migrateMerge(tid)` (run once from `G()`, flag `g.mig.m25`) copy each merged game's items, level histories, rounds, speed log, keys and mix-ups into the new game with levels renumbered; what was unlocked stays unlocked (`g.unl` holds levels opened above `g.lvl`; the lobby, stats and unlock logic honour it). The old games' raw data stays in STORE (`mergedInto`). Verified on the user's real data: every answer accounted for, untouched games byte-identical, second load a no-op.
- Reading (`sight`) ← Treble Clef · Harmony & Analysis (`analysis`) ← Chords in Keys · Triad Shapes ← Inversions & Voicings (triad theory) · Drop-2 Grips ← Inversions & Voicings (seventh/drop-2 theory) + Name That Chord · Time & Groove (`rhythmtap`) ← Two and Four, Subdivision, Notation & Meter · Guitar Essentials removed (capo/barre dropped).
- New levels (all appended): Fretboard “Notes in time”, Reading “Read a line” ×2 (`staffLineSVG`, `readLineQ`), Note Hunt “In time” (`inTime`), Triads “Voice leading” (`tvlQ`), Hear the Degree “Hear it, play it” (`degPlayQ`), Hear the Progression “Write it down” and Analysis “Write the numerals” (token dictation: `ui:'spell'` with `q.tokens`, Berklee numerals), Intervals on the Neck “Double stops” (`dsQ`), Shells “through ii–V–I” (`shellSeqQ`, strummed sequence), Arpeggio Runner “Through ii–V–I” (`arpIIVIQ`), Walking Line “Walk it yourself” (`walkPlayQ`/`walkGrade`: rule-checked, not one answer). Intervals & Keys builds/spells by recall (`recall1`, `recallScale`). Chord Spelling shows the triad on the neck after the answer (`triNeckSVG`). Time & Groove option `opts.tapMic`: strum muted strings instead of tapping.
- Not built (need other work first): Repertoire → tune-learning workflow and voice leading through a whole tune (need the play-along mode); comping graded on chord + time; chord-scale “play it over the chord”; Hear the Chord with guitar audio (blocked by the piano-only sound rule); drop-2 melody-on-top (chord melody track).

## Nov 2026 pedagogical audit (ladders, path, fluency)
- **The path** (`PATH`, `stageOf`, `lvPassed`, `pathState`, `pathNext`, `vPath`, `lobbyPath`): five stages (Ground → Triads → Sevenths & function → Jazz harmony & voicings → Advanced); each step is a level range of one game. Home shows the current stage, three next steps (one per area where possible) and the full stage table; each lobby rung carries a stage tag and the lobby links the games of the same stage. Gates are soft: nothing is locked by the path. The sweep checks that every level of every game sits in exactly one step and that stages never go backwards within a game. **When you add or move levels, update `PATH`.**
- **Two pages** (user request): header tabs *Games* (`vHome`, the game cards only) and *Path* (`vPathPage` = stages panel `vPath` + skill tree `vTree`, view `path`). Keep progression UI off the games page and out of the lobbies.
- **Master standard per game** (`STD`, `STD_N=12`, `stdSeconds`, `stdText`, `lvStd`, `stdOf`): the bar a practising musician would call solid, well above the 85% unlock rule. Accuracy 85–95% over ≥12 recent answers per level, plus the game's speed measure: time as a share of the fluency target (fretboard 0.6 ≈ 1.8 s a note, spelling 0.6 ≈ 1.9 s a triad, triads/drop-2/shells 0.45–0.5 ≈ 4.3–4.8 s), ± ms from the click (Time & Groove 25 ms, Comping 35, arpeggios in time 50, Call & Response 60), or s/note (Note Hunt 1.2, arpeggios 1.0). A skill node is green (`sk-std`) only when every level meets its game's standard; numbers are coloured against the standard; the detail table prints each game's standard and ★ per level. The sweep checks every game has one.
- **Skill metrics, not mastered/not** (`lvMetrics`, `sumMetrics`, `metricBits`): each skill node and each level row shows clean % (recent window, grey under 5 answers), then the game's own speed measure — time vs the fluency target (− is faster), else ± ms from the click (tap/strum), else s/note (played), else average answer time for recall levels without timed data yet — and answers played; the bar is levels passed.
- **Skill tree** (`SKILLS`, `SK_TRACKS`, `skCol`, `skState`, `vTree`; button “Skill tree” in the path panel, view `tree`): the same levels as `PATH` drawn as 59 skills in four tracks (Time & groove, Soloing & the neck, Chords & comping, Harmony & ears) × the five stages + a Goals column. A node bundles level ranges (possibly from several games) of one stage; `pre` = skills it builds on (may cross tracks; cross-track lines show only for the selected skill). States: mastered / in progress / ready / locked (soft: still opens) / goal (four “coming” capstones that need features not built yet: play-along, chord-melody track, tune learning). No decay (the user chose no fading). The sweep checks coverage (every level in exactly one skill), node column = stage of its levels, earlier levels of a game sit in ancestor skills, no cycles. **When you add or move levels, update `PATH` and `SKILLS`.** `lvPassed`: passed = below `g.lvl`, or the level's own record meets the unlock rule (an out-of-order open level is not passed).
- **Fluency in mastery** (`FLU_GAMES`, `fluTarget`, `levelFlu`, `fluency`, `g.ht[L]`): in the recall games (spelling, intervals, analysis, chordscale, fretboard, sight, triads, drop2, shells, neckiv) a level unlocks at 85% *and* a median clean-answer time at or under target over ≥6 timed answers (spell 1 s + 0.7 s/note; numerals 1.5 s + 1.2 s each; name a note 3 s; click a spot 4 s; choices 4.8 s × factor). Played/tapped/heard/marked questions are untimed for fluency. Lobby meter, results panel and coach notes show it.
- **Ladder reorders** (`REORDERS` + `migrateReorder`, flag `g.mig.r26`, runs in `G()` after the m25 merge and legacy migrations): old level → new level per game, unlisted levels keep their number. Hist/ht/items/sessions/perf log are remapped; everything open stays open; an inserted level opens if a later level was already open; a moved level not yet reached stays locked (`g.unl` gap). Verified on the user's real data (copied Chrome profile): answer counts unchanged, untouched games byte-identical, second load a no-op.
  Reordered: Reading (lines with rhythm after each position: `readLineQ(win,strings,rhy)`, `staffRhySVG`), Triad Shapes (minor root position split out; mark-it in every recognition level; voice leading right after every root/every set), Intervals & Keys (major scales → signatures → intervals), Chord Spelling (name the triad before the fast level; extensions recalled), Drop-2 (paper and neck levels interleaved), Shells (comp II–V–I at L4), Hear the Degree (play it at L4, chromatic after dictation), Hear the Interval (6ths/7ths before the tritone), Hear the Progression (12-bar blues at L3, writing numerals from L1), Harmony & Analysis (sevenths + numerals one level; `anDiaWriteQ`, `anWriteQ(keys)` throughout), Sing It (minor key split from chromatic), Call & Response (blues phrases at L6), Bends (curl before pre-bend), Arpeggio Runner (one idea per level), Time & Groove (drop-out right after “4 only”), Comping (Freddie Green first).
- Leaks fixed: Chord Spelling L6/L7 formula pools; Chord–Scale quality question takes a pool (`G_cs2.quality(pool)`), characteristic notes only after spelling the modes. Hear the Progression shows Berklee names (`progName`; PROGS keys stay the stats ids). All prose numerals are Berklee (sweep fails on lower-case numerals). `bnum` spells ascending passing diminished chords ♯I°7 ♯II°7 (`DIM_UP`), `anChordOf` spells their roots with sharps.
- Still open: the 38 old Chords in Keys answers now inside Harmony & Analysis L1–2 were given against the old broken triad questions; the user has not decided whether to drop them.

## One input per game (user rule, Nov 2026)
If a game is answered on the guitar, every question is played or strummed into the mic; if it is answered on screen, nothing is recorded. Never mix.
`guitarMode(gid)` (mic games always; Time & Groove when `opts.tapMic`; `PLAY_GAMES` when `g.mode==='play'` — Hear the Degree is in `PLAY_GAMES` for this), `isGuitarQ`, `fitQ` (converts with `toPlay` in guitar mode, rejects what the mode cannot ask). `pickQ` only returns fitting questions; review and stretch draw only from levels the mode can ask (`levelAvail`, cached per mode). A frontier level the mode cannot ask is skipped by `modeSkip` (recorded in `g.skip`; never jumps an askable unpassed level; a skipped level counts as passed only on its own record). Lobby marks such levels “guitar only / screen only”. The sweep checks every level exists in at least one mode and that no question of the other input appears in either mode (proved by re-allowing mixing: caught in 9 games).

## Intervals on the Neck reference (Nov 2026)
`NIV_SHAPE` is computed by `nivShapeTxt(semi)` from standard tuning (span 5/10/15/19 half steps for 1–4 strings up, 4/9/14 when the span crosses G–B); the old hand-written table had wrong G–B and 13th shapes. `jazzIvPanel()` on the lobby: `JAZZ_IVS` (intervals jazz voicings are built from) and `JAZZ_VOICINGS` (shells, guide-tone pairs, drop-2/drop-3, 13, quartal) drawn with `boxSVG`, intervals between voices computed from the frets. `DEGL` now labels tensions (♭9 … 13). The sweep proves every shape from every start string and that every voicing holds only chord tones.

## Layout

```
src/fretwise.html   the app: <title>, <style>, markup, one <script>. Edit this.
piano/*.mp3         21 Salamander grand samples (MIT, tonejs-instruments), minor thirds C2–C7, 4.5 s, 96 kbps
build.py            src + piano → dist/fretwise.html (single offline file)
tests/extract.js    pulls the <script> out of src into tests/fw.js
tests/sweep.js      generator sweep + self-grading checks for every game/level (node)
tests/screens.py    Playwright smoke run with fake mic, screenshots to tests/out/
vendor/             bp.js (Basic Pitch + tfjs bundle), model/, LICENSE — built by tools/build-vendor.js, committed, deployed with the site
tools/              npm project for the vendor bundle (npm install; node tools/build-vendor.js); node_modules git-ignored
recordings/         the user's guitar test takes (git-ignored): Mic check → Record test takes → ~/Downloads/fretwise-take-<id>.wav
tests/replay.js     offline: node tests/replay.js [live|basicpitch|bpmono] scores a detector on recordings/ against TAKES
tests/tune_bp.js    grid search of Basic Pitch thresholds + guitar filter on the recordings
tests/live_takes.py real Chrome window (GPU), feeds each recording into the app's live listening; compares old vs Basic Pitch
```

Python tools run from `.venv/` (git-ignored; `python3 -m venv .venv && .venv/bin/pip install playwright numpy`; Playwright uses the installed Chrome via `channel='chrome'`).

Serve for development: `python3 -m http.server 8765` from `src/`'s parent with `piano/` reachable (tests/screens.py does this for you), or just open `dist/fretwise.html`.

## Verify before publishing

```
node tests/extract.js && node --check tests/fw.js && node tests/sweep.js   # must print bad 0
python3 tests/screens.py                                                   # look at tests/out/*.png
python3 build.py                                                           # refresh dist/ (embeds vendor/ too)
.venv/bin/python tests/live_takes.py bp                                    # mic changes: live detection on the user's recordings
git commit -am '…' && git push                                             # deploys the live site
```

Node may not be installed: run the same scripts with macOS's `jsc` (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc`) by shimming `require('fs'/'path')`, `console.log` → `print`.

The sweep instantiates ~38,000 questions and checks: choice lists contain the answer with no duplicates; multi/fret/tap/mic questions pass their own grader with a perfect answer and fail a wrong one; `snd` descriptors only emit sane midis; every question has key/label/prompt/explain; play-mode conversion yields ascending exact-pitch targets.

## Architecture (all in one script, top to bottom)

1. **Music core** — `P()` parse note name → `{l,a}` (letter index, accidental), `pc`, `nm`, `tr(root,num,semi)` spell an interval up, `trDown`, `IV` interval table, `CH` chord formulas, `chord()`, `scale()`, `SC`, `diatonic`, `respell`, `mc(ans,distractors,n)` builds a shuffled choice list, `C()`/`A()` question wrappers (choices / audio), `okAcc` (limit double accidentals), `rootPick(list)` (twelve-key coverage: prefers roots this game has seen least; sets `LAST_ROOT` which pickQ stores as `q.rootKey`).
2. **Drawing** — `fretSVG({dots,click,win})` (string 1 on top, dots `{s,f,cls,t}`), `staffSVG` (accidentals drawn as paths, not glyphs), `boxSVG` chord diagram, `rhySVG` rhythm notation, `tapTimeline`, `circleSVG`.
3. **Piano** — `Piano` sampler: `load/note(midi,t,dur,vel)/chord/tick/ready/now`; source is `window.PIANO_DATA[name]` when present (dist) else `piano/<name>.mp3`.
4. **Sound engine** — `playSnd(q,g)` plays a question's `snd` descriptor after answering (`note | seq | scale | chord | grip | prog | chordseq`); every generator attaches one. Ear games use `q.audio()` instead (returns duration in seconds; timer starts after it).
5. **Mic** — guitar games (everything but Sing It and Comping) use **Basic Pitch** (`BP`, `bpLoad`, `bpAnalyse`, `bpMono`, settings `BPO` tuned on the recordings): audio captured on the audio thread (`BP_CAP` AudioWorklet, loaded from a data: URL because blob: fails on file://; capturing on the main thread drops chunks while the model runs and the gaps read as new picks), the last 6 s re-analysed every 0.4 s, the whole take once more on stop. Falls back to the built-in detector without WebGL. Built-in detector: YIN pitch (`yinPitch`), `segment()` (attack + pitch-change segmentation, octave-shadow filter, `mf` float midi for cents), `startListening(onDone,maxNotes,{beat,beatStart,limit,onsets})` (onsets mode records attacks only, for strummed comping), `micGrade` (strict/octave-free, held-note merging, swing `grid`, alternative `targets`), `micPanel/slotsTarget/slotsHeard`, tuner view.
6. **Tap engine** — `tapBegin/tapHit/tapGrade` against an audio-clock-scheduled click; latency learned per game from clean rounds (`g.opts.lat`).
7. **Generators** — one closure per question type, returning a question object (schema below). Grouped by game; the drop-2 sheet `D2C`/`D2PROG`/`COMBO` is the user's own voicing sheet, keep its grips as they are. `genDrop2`, `drop3Grips`, `shellGrip`, `triadGrips`, `spreadGrips` generate grips and verify them against chord tones.
8. **Play mode** — `toPlay(q)` converts a `multi`/`fret` question into a strict `mic` question (exact pitches, ascending, alternatives preserved) when `g.mode==='play'`; `PLAY_GAMES` lists the games that offer it.
9. **GAMES / CATS** — each game `{id,cat,name,area,desc,levels:[{n,d,g:[generators]}], mic?, tap?}`; level count varies (5–16). **Level numbers index saved histories**: append new levels; any insert or reorder needs an entry in `REORDERS` (new flag if it is a second reorder of the same game) and a `PATH` update. Chord Spelling was rebuilt on 2 Nov 2026 (recall levels: majors by heart around the cycle of fourths, then alterations; `recallQ`, `altExplain`) and its saved data reset once at the user's request (`v2` in `G()`). A reorder needs a migration in `G()` (see `v7` for fretboard, `v67` for Note Hunt levels 6↔7, 2 Nov 2026). A level with `open:true` is playable before it is reached (Note Hunt L6 “Fret by fret”); review draws only from unlocked levels, stretch only from your own level.
10. **Store / sync** — `STORE.games[id]` = `blank()` fields (`lvl,last,limit,review,preview,round,sound,mode,opts,rk,sessions,items,cf,hist,best,n,c,ms,time,pn,pc`, plus `pl,sp` from the stats log); `K(key)` hashes item keys; `saveGame` → localStorage + artifact db; `initCloud` waits for the runtime, retries, surfaces errors (`CLOUD_MSG`), merge rule "more answers wins".
11. **Engine** — `pickQ` (review 25% / preview 15% mix, weakest-item weighting, `rare` generators), `start/nextQ/answer/finish/quit`, `check/givenText` per `ui`, level unlock at `NEED=16` recent answers ≥ `PASS=.85` clean.
12. **Stats analysis** — `perfLog` (in `answer`) records per answer: `it.r` last 8 results, `it.rt/rn` time to first played note, `it.gp/gn` note-to-note find time, `it.qn/qc` mic answers since the Basic Pitch detector, `g.pl` log (≤300) `{t,lv,k,ok,rt,gp,n,dr,ab}` (dr/ab = signed/abs offset to the click, ms), `g.sp` find time per slot label (strings in Note Hunt, chord tones in arpeggios). `coachNotes` writes the teacher's notes (prioritised, max 5), `focusItems` the practice list. Analysis skips pre-detector guitar mic results (`trusted`, `OLDMIC`), caps rounds left open (`roundCap`).
12b. **Lesson cards** — `LESSONS[gameId] = {how, rules, take}` rendered by `lessonCard` at the top of each level page (open until the game has answers). Every game needs one; keep the rules factually exact (they are checked against the neck).
13. **Views** — `vHome, vPathPage (vPath + vTree), vLobby, vPlay, vResults, vStats, vOverview, vReference, vTuner, vRec`; one delegated click handler keyed on `data-act`, plus `change`, `pointerdown` (tap) and `keydown` handlers.

## Question object

```
key        stable id for stats (same item across modes); label  short text for stats tables
ui         'choices' | 'letters' | 'pc' | 'fret' | 'multi' | 'mic' | 'tap' | 'spell'
answer     choices: string · letters: 'F♯' · spell: ['D','F♯','A'] (need = count; entered note by note, S.spell) · pc: 0-11 · fret: validated by valid(s,f) · multi: [{s,f}] (+ alts: [[{s,f}]]) · mic: target midis · tap: onsets in beats
prompt, explain, hint, answerText, visual (html), reveal (html or {dots}), staff/staffOk, win [lo,hi], mark, fixedDots
factor     time multiplier (Infinity = untimed); rare: true = only when drawn first
snd        answer sound descriptor; audio() for ear questions (returns seconds)
mic:       target, targets (alts), names, degs, octaveFree, maxNotes, metro (bpm), grid (beat positions), hideTarget, after()
tap:       bpm, len (beats), countIn, clicks (beats in bar that click), onsets, call (onsets played first), mic (grade from onsets), dropOut
```

## Conventions the user has asked for

- Scale degrees as numbers; Roman numerals only in Berklee form (IIm7, V7, IMaj7 — always upper case, quality in the symbol).
- Drop-2 naming "from close" only (never "by bass note" in questions).
- Find-the-grip questions are mark-on-neck (or play it), never tab multiple choice.
- Only the sampled piano for sound; no synth tones except the metronome tick.
- Keep all stats; never reset or restructure `STORE` without a migration (see the fretboard `v7` level-shift migration in `G()`).

## Not built yet (from the review)

- Spaced review across days (per-item due dates); the data for it is already in `g.items` (`n,c,w,h,ms,lv`).
- Daily session builder (a 20-minute mix across areas based on weakest items; `weekSummary()` already computes candidates).
- Mobile pass: scrolling/zooming neck, larger answer targets, single-row hud.
- Polyphonic chord detection (strums are graded by onsets only; chords are arpeggiated in play mode).
