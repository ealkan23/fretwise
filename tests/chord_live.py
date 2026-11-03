"""Chord grading through the app's live path: recordings/chords.wav (Cmaj7 x3545x, Dm7 x5756x, G7 3x343x, strummed) is fed in as the
microphone; the right voicings must pass, one-note-off and other chords must fail. Usage: .venv/bin/python tests/chord_live.py"""
import base64, pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
FEED = """async (b64)=>{const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer;const c=Piano.ac();await c.resume();const buf=await c.decodeAudioData(raw);
  const sn=c.createBufferSource();sn.buffer=buf;const dest=c.createMediaStreamDestination();sn.connect(dest);MIC=dest.stream;const s2=c.createMediaStreamSource(MIC);AN=c.createAnalyser();AN.fftSize=2048;s2.connect(AN);BUF=new Float32Array(2048);window._sn=sn;return buf.duration;}"""
TESTS = [('Cmaj7 x3545x', [48, 55, 59, 64], True), ('Dm7 x5756x', [50, 57, 60, 65], True), ('G7 3x343x', [43, 53, 59, 62], True),
         ('C7 (one note off Cmaj7)', [48, 55, 58, 64], False), ('Cmaj7 with E♭', [48, 55, 59, 63], False), ('Dm7 with F♯', [50, 57, 60, 66], False),
         ('G7 with F♯ (Gmaj7)', [43, 54, 59, 62], False), ('Am7 (other chord)', [45, 52, 55, 60], False)]
with sync_playwright() as pw:
    b = pw.chromium.launch(channel='chrome', headless=False, args=['--window-position=-2400,-2400', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto((root / 'dist' / 'fretwise.html').as_uri()); pg.evaluate('bpLoad()'); pg.wait_for_function('BP.state!=="loading"', timeout=60000)
    dur = pg.evaluate(FEED, base64.b64encode((root / 'recordings' / 'chords.wav').read_bytes()).decode())
    res = pg.evaluate(f"""new Promise(ok=>{{startListening(r=>ok(r),99,{{bp:true,chord:99,wait:30000,cap:60000}});_sn.start();setTimeout(()=>stopListening(),{int(dur * 1000) + 800});}})""")
    bad = 0
    print(len(res['strums']), 'pitched strums')
    for name, t, exp in TESTS:
        r = pg.evaluate("([res,t])=>micGrade({ui:'mic',strumSeq:[t],target:t.slice(),names:t.map(nameOf),degs:t.map(()=>'')},res)", [res, t])
        ok = r['ok'] == exp; bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} {name:26s} expected {'pass' if exp else 'fail'} → {'pass' if r['ok'] else 'fail'}")
    print('errors', errs); b.close()
print('ALL PASS' if not bad else f'FAILURES {bad}')
