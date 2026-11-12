"""Regression test for the Fix list: plays each reported take (fixlist/*.wav) into the same question in the app (dist/), through the
live listening path in a real Chrome window, and reports how it is graded now. Run tests/read_fixlist.py first."""
import base64, json, pathlib, sys
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
reps = [r for r in json.loads((root / 'fixlist' / 'reports.json').read_text()) if r.get('audioFile') and (r.get('ctx') or {}).get('mic')]
if len(sys.argv) > 1: reps = [r for r in reps if r['ctx'].get('game') in sys.argv[1:]]   # e.g. fix_takes.py scales
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
        pg.evaluate("g=>{view={name:'lobby',gid:g};render();}", c['game'])   # the home page is the hall now: open the lobby directly
        if c.get('mode') == 'play': pg.click('[data-act=mode][data-k=play]')
        # replay at the level the report came from if it can produce the take's target, else any untimed level (the takes were played without a click)
        pg.evaluate("""([t,lv])=>{const o=pickQ;pickQ=(id,L)=>{for(let i=0;i<4000;i++){const L2=i<1500&&lv?lv:1+i%GBY[id].levels.length,q=o(id,L2);if(q.ui==='mic'&&q.target.join()===t&&(!q.metro||q.freeStart))return q;}return o(id,L);};}""", [','.join(map(str, c['mic']['target'])), c.get('qlv')])
        # the take starts at the instant listening starts, as it did when it was recorded (so 'already sounding' notes are treated alike)
        pg.evaluate("(()=>{const o=startListening;startListening=(...a)=>{const r=o(...a);if(!window._fed){window._fed=1;_sn.start();}return r;};})()")
        pg.click('[data-act=start]'); pg.wait_for_timeout(400)
        same = pg.evaluate('S.q.target.join()') == ','.join(map(str, c['mic']['target']))
        pg.wait_for_function("S&&(S.locked||/Nothing heard/.test(S.micMsg||''))", timeout=120000)
        silent = pg.evaluate("!S.locked")
        if silent:   # nothing survived the loudness gate: the take is not graded (right when the player says they played nothing)
            ok = ('play anything' in r['text'] or "didn't play" in r['text'] or 'didnt play' in r['text']); passed += ok
            print(f"#{r['id']} {c['label']:14s} was {'right' if c['ok'] else 'WRONG'} → now NOT GRADED (nothing heard){'' if same else '  (question not matched)'}  — “{r['text']}”"); pg.close(); continue
        ok = pg.evaluate('S.answers.at(-1).ok'); passed += ok
        heard = pg.evaluate('S.micResult.per.map(x=>x.got)'); extra = pg.evaluate('S.micResult.extra')
        print(f"#{r['id']} {c['label']:14s} was {'right' if c['ok'] else 'WRONG'} → now {'RIGHT' if ok else 'WRONG'}  heard {' '.join(map(nm, heard))}{'  extra '+' '.join(map(nm, extra)) if extra else ''}{'' if same else '  (question not matched)'}{'  errors '+str(errs) if errs else ''}  — “{r['text']}”")
        pg.close()
    b.close()
print(f'\n{passed}/{len(reps)} reported takes now graded right')
