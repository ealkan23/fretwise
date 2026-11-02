# Fretwise

Guitar music-theory, ear-training, rhythm and microphone trainer for an aspiring jazz guitarist (Berklee-style curriculum). Single-page app, no build step for development, no framework. One vendored dependency (user-approved): Spotify Basic Pitch + TensorFlow.js in `vendor/` for guitar note detection.

- **Live site (the one page the user uses):** https://ealkan23.github.io/fretwise/ — GitHub Pages from the public repo `ealkan23/fretwise`. `.github/workflows/pages.yml` publishes `src/fretwise.html` as `index.html` with `piano/` beside it on every push to `main`, so **deploying = commit + `git push`** (watch with `gh run watch`). Mic works there; progress is in that browser's `localStorage` key `fretwise-v1`. The user works only from Claude Code: never send them to a claude.ai chat to publish.
- **Old claude.ai artifact (retired):** https://claude.ai/artifact/756Z4Kc3AywDU1mgsGazsQ — no longer updated. `initCloud` only runs when framed with `window.claude`; elsewhere it shows "Saved in this browser". Progress moves between copies with Overview → "Move your progress" (export/import JSON; per game the copy with more answers wins).
- **Offline file:** `dist/fretwise.html` (built by `build.py`, piano embedded, git-ignored). Open from disk in Chrome.
- **Pedagogical review** that drove the roadmap: https://claude.ai/artifact/7emdzZtQ8s6Eb2FDthZEUL

## Fix list (how the user reports problems)

The user writes problems in the app: a box under every answer ("Tell Claude…") and the **Fix list** page on home. Reports are stored in the browser's IndexedDB (`fretwise-fix`/`reports`) with the question context (`fixContext`: game, level, prompt, answer, what was given, mic target/heard/per-slot/detector) and the take's audio for mic questions. When the user says "check the fix list", run `.venv/bin/python tests/read_fixlist.py`: it copies Chrome's storage to a temp profile (read-only) and writes `fixlist/reports.json` + WAVs (git-ignored). Work through the reports; the user deletes fixed ones on the Fix list page. After a fix, `.venv/bin/python tests/fix_takes.py` replays every reported take into the same question through the live path and prints old vs new grading. Note Hunt changes must also keep `tests/hunt/skip2.js` (cuts single spots out of the takes; run from tests/hunt/) catching skipped spots: leniency that passes every take but stops catching skips is not a fix.

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
9. **GAMES / CATS** — each game `{id,cat,name,area,desc,levels:[{n,d,g:[generators]}], mic?, tap?}`; level count varies (4–9). **Append new levels, never insert or reorder**: level numbers index saved histories. Chord Spelling was rebuilt on 2 Nov 2026 (recall levels: majors by heart around the cycle of fourths, then alterations; `recallQ`, `altExplain`) and its saved data reset once at the user's request (`v2` in `G()`). A reorder needs a migration in `G()` (see `v7` for fretboard, `v67` for Note Hunt levels 6↔7, 2 Nov 2026). A level with `open:true` is playable before it is reached (Note Hunt L6 “Fret by fret”); review draws only from unlocked levels, stretch only from your own level.
10. **Store / sync** — `STORE.games[id]` = `blank()` fields (`lvl,last,limit,review,preview,round,sound,mode,opts,rk,sessions,items,cf,hist,best,n,c,ms,time,pn,pc`, plus `pl,sp` from the stats log); `K(key)` hashes item keys; `saveGame` → localStorage + artifact db; `initCloud` waits for the runtime, retries, surfaces errors (`CLOUD_MSG`), merge rule "more answers wins".
11. **Engine** — `pickQ` (review 25% / preview 15% mix, weakest-item weighting, `rare` generators), `start/nextQ/answer/finish/quit`, `check/givenText` per `ui`, level unlock at `NEED=16` recent answers ≥ `PASS=.85` clean.
12. **Stats analysis** — `perfLog` (in `answer`) records per answer: `it.r` last 8 results, `it.rt/rn` time to first played note, `it.gp/gn` note-to-note find time, `it.qn/qc` mic answers since the Basic Pitch detector, `g.pl` log (≤300) `{t,lv,k,ok,rt,gp,n,dr,ab}` (dr/ab = signed/abs offset to the click, ms), `g.sp` find time per slot label (strings in Note Hunt, chord tones in arpeggios). `coachNotes` writes the teacher's notes (prioritised, max 5), `focusItems` the practice list. Analysis skips pre-detector guitar mic results (`trusted`, `OLDMIC`), caps rounds left open (`roundCap`).
12b. **Lesson cards** — `LESSONS[gameId] = {how, rules, take}` rendered by `lessonCard` at the top of each level page (open until the game has answers). Every game needs one; keep the rules factually exact (they are checked against the neck).
13. **Views** — `vHome, vLobby, vPlay, vResults, vStats, vOverview, vReference, vTuner, vRec`; one delegated click handler keyed on `data-act`, plus `change`, `pointerdown` (tap) and `keydown` handlers.

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
