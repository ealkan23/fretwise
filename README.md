# Fretwise

Guitar theory, ear-training, rhythm and microphone trainer. See CLAUDE.md for architecture, conventions and how to test.

Quick start:
```
python3 build.py                 # → dist/fretwise.html (open it in Chrome/Edge; mic works from disk)
node tests/extract.js && node tests/sweep.js
python3 tests/screens.py         # needs playwright + chromium
```
