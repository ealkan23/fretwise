"""Regression test for the Fix list: plays each reported take (fixlist/*.wav) into the same question in the app (dist/), through the
live listening path in a real Chrome window, and reports how it is graded now. Run tests/read_fixlist.py first."""
import base64, json, pathlib, sys
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
reps = [r for r in json.loads((root / 'fixlist' / 'reports.json').read_text()) if r.get('audioFile') and (r.get('ctx') or {}).get('mic')]
FEED = """async (b64)=>{const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer;const c=Piano.ac();await c.resume();const buf=await c.decodeAudioData(raw);
  const sn=c.createBufferSource();sn.buffer=buf;const dest=c.createMediaStreamDestination();sn.connect(dest);MIC=dest.stream;const s2=c.createMediaStreamSource(MIC);AN=c.createAnalyser();AN.fftSize=2048;s2.connect(AN);BUF=new Float32Array(2048);window._sn=sn;return buf.duration;}"""
NM = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B']; nm = lambda m: NM[m % 12] + str(m // 12 - 1) if m is not None else '—'
passed = 0
with sync_playwright() as pw:
    b = pw.chromium.launch(channel='chrome', headless=False, args=['--window-position=-2400,-2400', '--autoplay-policy=no-user-gesture-required'])
    for r in reps:
        c = r['ctx']; pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto((root / 'dist' / 'fretwise.html').as_uri()); pg.evaluate('localStorage.clear()'); pg.reload()
        pg.evaluate('bpLoad()'); pg.wait_for_function('BP.state!=="loading"', timeout=60000)
        pg.evaluate(FEED, base64.b64encode((root / 'fixlist' / r['audioFile']).read_bytes()).decode())
        pg.click(f"[data-act=lobby][data-g={c['game']}]")
        if c.get('mode') == 'play': pg.click('[data-act=mode][data-k=play]')
        pg.evaluate("""t=>{const o=pickQ;pickQ=(id,L)=>{for(let i=0;i<3000;i++){const q=o(id,1+i%GBY[id].levels.length);if(q.ui==='mic'&&q.target.join()===t)return q;}return o(id,L);};}""", ','.join(map(str, c['mic']['target'])))
        pg.evaluate('micOpt().auto'); pg.click('[data-act=start]'); pg.wait_for_timeout(400)
        same = pg.evaluate('S.q.target.join()') == ','.join(map(str, c['mic']['target']))
        pg.evaluate('_sn.start()'); pg.wait_for_function('S&&S.locked', timeout=120000)
        ok = pg.evaluate('S.answers.at(-1).ok'); passed += ok
        heard = pg.evaluate('S.micResult.per.map(x=>x.got)'); extra = pg.evaluate('S.micResult.extra')
        print(f"#{r['id']} {c['label']:14s} was {'right' if c['ok'] else 'WRONG'} → now {'RIGHT' if ok else 'WRONG'}  heard {' '.join(map(nm, heard))}{'  extra '+' '.join(map(nm, extra)) if extra else ''}{'' if same else '  (question not matched)'}{'  errors '+str(errs) if errs else ''}  — “{r['text']}”")
        pg.close()
    b.close()
print(f'\n{passed}/{len(reps)} reported takes now graded right')
