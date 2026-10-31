"""Plays each recordings/<take>.wav into the app's live listening (dist/fretwise.html) in real time, in a real Chrome window
(WebGL needs the GPU), and scores what it heard against the take's notes. The file is fed through a MediaStream in place of the
microphone, so the whole live path runs: capture, windowed analysis, final pass.
Usage: .venv/bin/python tests/live_takes.py [bp|old|both] [take ...]"""
import base64, pathlib, sys
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
mode = sys.argv[1] if len(sys.argv) > 1 else 'both'
only = sys.argv[2:]
url = (root / 'dist' / 'fretwise.html').as_uri()
NM = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
nm = lambda m: NM[m % 12] + str(m // 12 - 1)
FEED = """async (b64)=>{const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer;const c=Piano.ac();await c.resume();const buf=await c.decodeAudioData(raw);
  const sn=c.createBufferSource();sn.buffer=buf;const dest=c.createMediaStreamDestination();sn.connect(dest);MIC=dest.stream;
  const s2=c.createMediaStreamSource(MIC);AN=c.createAnalyser();AN.fftSize=2048;s2.connect(AN);BUF=new Float32Array(2048);window._sn=sn;return buf.duration;}"""

def score(exp, got):
    A, B = len(exp), len(got); D = [[a + b for b in range(B + 1)] for a in range(A + 1)]
    for a in range(1, A + 1):
        for b in range(1, B + 1):
            D[a][b] = min(D[a-1][b-1] + (exp[a-1] != got[b-1]), D[a-1][b] + 1, D[a][b-1] + 1)
    return D[A][B]

with sync_playwright() as pw:
    b = pw.chromium.launch(channel='chrome', headless=False, args=['--window-position=-2400,-2400', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(); pg.goto(url); takes = pg.evaluate('TAKES'); pg.close()
    modes = ['old', 'bp'] if mode == 'both' else [mode]; tot = {m: 0 for m in modes}; n = 0
    for t in takes:
        if t.get('chords') or (only and t['id'] not in only): continue
        f = root / 'recordings' / f"{t['id']}.wav"
        if not f.exists(): continue
        n += len(t['exp']); line = f"{t['id']:8s} expected {' '.join(map(nm, t['exp'])) or '(nothing)'}"
        for m in modes:
            pg = b.new_page(); pg.goto(url)
            if m == 'bp': pg.evaluate('bpLoad()'); pg.wait_for_function('BP.state!=="loading"', timeout=60000)
            dur = pg.evaluate(FEED, base64.b64encode(f.read_bytes()).decode())
            r = pg.evaluate(f"""new Promise(ok=>{{startListening(r=>ok(r.notes.map(n=>n.midi)),999,{{bp:{'true' if m == 'bp' else 'false'},gap:1e9,wait:1e9,cap:90000}});
                _sn.start();setTimeout(()=>stopListening(),{int(dur * 1000) + 1200});}})""")
            e = score(t['exp'], r); tot[m] += e
            line += f"\n{'':8s} {m:3s} {e:2d} errors · {' '.join(map(nm, r))}"
            pg.close()
        print(line)
    b.close()
    print('\n' + '   '.join(f'{m}: {tot[m]} errors' for m in modes) + f'   (over {n} expected notes + the noise take)')
