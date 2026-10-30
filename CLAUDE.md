# Fretwise

Guitar music-theory, ear-training, rhythm and microphone trainer for an aspiring jazz guitarist (Berklee-style curriculum). Single-page app, no build step for development, no dependencies, no framework.

- **Live artifact (synced progress):** https://claude.ai/artifact/756Z4Kc3AywDU1mgsGazsQ — published through claude.ai Artifacts with capabilities `{db:{}, user:{}}`; per-user progress lives at `data/users/<id>/<gameId>`. The artifact view cannot use the microphone.
- **Offline / mic file:** `dist/fretwise.html` (built by `build.py`, piano embedded as data URIs). Open in Chrome/Edge from disk; progress goes to `localStorage` key `fretwise-v1`. Progress moves between the two with Overview → "Move your progress" (export/import JSON; per game the copy with more answers wins).
- **Pedagogical review** that drove the roadmap: https://claude.ai/artifact/7emdzZtQ8s6Eb2FDthZEUL

## Layout

```
src/fretwise.html   the app: <title>, <style>, markup, one <script>. Edit this.
piano/*.mp3         21 Salamander grand samples (MIT, tonejs-instruments), minor thirds C2–C7, 4.5 s, 96 kbps
build.py            src + piano → dist/fretwise.html (single offline file)
tests/extract.js    pulls the <script> out of src into tests/fw.js
tests/sweep.js      generator sweep + self-grading checks for every game/level (node)
tests/screens.py    Playwright smoke run with fake mic, screenshots to tests/out/
```

Serve for development: `python3 -m http.server 8765` from `src/`'s parent with `piano/` reachable (tests/screens.py does this for you), or just open `dist/fretwise.html`.

## Verify before publishing

```
node tests/extract.js && node --check tests/fw.js && node tests/sweep.js   # must print bad 0
python3 tests/screens.py                                                   # look at tests/out/*.png
python3 build.py                                                           # refresh dist/
```

The sweep instantiates ~38,000 questions and checks: choice lists contain the answer with no duplicates; multi/fret/tap/mic questions pass their own grader with a perfect answer and fail a wrong one; `snd` descriptors only emit sane midis; every question has key/label/prompt/explain; play-mode conversion yields ascending exact-pitch targets.

## Architecture (all in one script, top to bottom)

1. **Music core** — `P()` parse note name → `{l,a}` (letter index, accidental), `pc`, `nm`, `tr(root,num,semi)` spell an interval up, `trDown`, `IV` interval table, `CH` chord formulas, `chord()`, `scale()`, `SC`, `diatonic`, `respell`, `mc(ans,distractors,n)` builds a shuffled choice list, `C()`/`A()` question wrappers (choices / audio), `okAcc` (limit double accidentals), `rootPick(list)` (twelve-key coverage: prefers roots this game has seen least; sets `LAST_ROOT` which pickQ stores as `q.rootKey`).
2. **Drawing** — `fretSVG({dots,click,win})` (string 1 on top, dots `{s,f,cls,t}`), `staffSVG` (accidentals drawn as paths, not glyphs), `boxSVG` chord diagram, `rhySVG` rhythm notation, `tapTimeline`, `circleSVG`.
3. **Piano** — `Piano` sampler: `load/note(midi,t,dur,vel)/chord/tick/ready/now`; source is `window.PIANO_DATA[name]` when present (dist) else `piano/<name>.mp3`.
4. **Sound engine** — `playSnd(q,g)` plays a question's `snd` descriptor after answering (`note | seq | scale | chord | grip | prog | chordseq`); every generator attaches one. Ear games use `q.audio()` instead (returns duration in seconds; timer starts after it).
5. **Mic** — YIN pitch (`yinPitch`), `segment()` (attack + pitch-change segmentation, octave-shadow filter, `mf` float midi for cents), `startListening(onDone,maxNotes,{beat,beatStart,limit,onsets})` (onsets mode records attacks only, for strummed comping), `micGrade` (strict/octave-free, held-note merging, swing `grid`, alternative `targets`), `micPanel/slotsTarget/slotsHeard`, tuner view.
6. **Tap engine** — `tapBegin/tapHit/tapGrade` against an audio-clock-scheduled click; latency learned per game from clean rounds (`g.opts.lat`).
7. **Generators** — one closure per question type, returning a question object (schema below). Grouped by game; the drop-2 sheet `D2C`/`D2PROG`/`COMBO` is the user's own voicing sheet, keep its grips as they are. `genDrop2`, `drop3Grips`, `shellGrip`, `triadGrips`, `spreadGrips` generate grips and verify them against chord tones.
8. **Play mode** — `toPlay(q)` converts a `multi`/`fret` question into a strict `mic` question (exact pitches, ascending, alternatives preserved) when `g.mode==='play'`; `PLAY_GAMES` lists the games that offer it.
9. **GAMES / CATS** — each game `{id,cat,name,area,desc,levels:[{n,d,g:[generators]}], mic?, tap?}`; level count varies (4–9). **Append new levels, never insert or reorder**: level numbers index saved histories.
10. **Store / sync** — `STORE.games[id]` = `blank()` fields (`lvl,last,limit,review,preview,round,sound,mode,opts,rk,sessions,items,cf,hist,best,n,c,ms,time,pn,pc`); `K(key)` hashes item keys; `saveGame` → localStorage + artifact db; `initCloud` waits for the runtime, retries, surfaces errors (`CLOUD_MSG`), merge rule "more answers wins".
11. **Engine** — `pickQ` (review 25% / preview 15% mix, weakest-item weighting, `rare` generators), `start/nextQ/answer/finish/quit`, `check/givenText` per `ui`, level unlock at `NEED=16` recent answers ≥ `PASS=.85` clean.
12. **Views** — `vHome, vLobby, vPlay, vResults, vStats, vOverview, vReference, vTuner`; one delegated click handler keyed on `data-act`, plus `change`, `pointerdown` (tap) and `keydown` handlers.

## Question object

```
key        stable id for stats (same item across modes); label  short text for stats tables
ui         'choices' | 'letters' | 'pc' | 'fret' | 'multi' | 'mic' | 'tap'
answer     choices: string · letters: 'F♯' · pc: 0-11 · fret: validated by valid(s,f) · multi: [{s,f}] (+ alts: [[{s,f}]]) · mic: target midis · tap: onsets in beats
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
