"""Strummed fix-list takes graded straight from their recordings (26 Nov 2026): each WAV is decoded in the page, run through Basic Pitch (bpRaw) and chordStrums, and every
strum is checked against the reported target chord with chordCheck. No live listener in between (the replay's attack detection differs from a real session).
Run after build.py and tests/read_fixlist.py:  .venv/bin/python tests/chord_direct.py 91 93 94 95"""
import pathlib,sys,json,base64
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;R={x['id']:x for x in json.load(open(root/'fixlist/reports.json'))}
with sync_playwright() as pw:
  b=pw.chromium.launch(channel='chrome',headless=True,args=['--autoplay-policy=no-user-gesture-required','--mute-audio','--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'])
  pg=b.new_page();pg.goto((root/'dist'/'fretwise.html').as_uri());pg.evaluate('bpLoad()');pg.wait_for_function('BP.state!=="loading"',timeout=60000)
  for a in sys.argv[1:]:
    i=int(a);rep=R[i];tg=rep['ctx']['mic']['target'];wav=base64.b64encode((root/'fixlist'/f'site-{i}.wav').read_bytes()).decode()
    r=pg.evaluate("""async ([w,tg])=>{const bytes=Uint8Array.from(atob(w),c=>c.charCodeAt(0)),c=Piano.ac(),buf=await c.decodeAudioData(bytes.buffer),x=new Float32Array(buf.getChannelData(0)),sr=buf.sampleRate;
      const {fr,on}=await bpRaw(x,sr),st=chordStrums(fr,on,x,sr,0);return {sr,secs:+(x.length/sr).toFixed(1),strums:st.map(s=>({t:Math.round(s.t),db:s.db,ok:chordCheck(s.act,tg).ok}))};}""",[wav,tg])
    print(f'#{i}',rep['ctx'].get('prompt','')[:40] if isinstance(rep['ctx'].get('prompt'),str) else '',tg,r,'RIGHT' if any(s['ok'] for s in r['strums']) else 'NOT RIGHT',flush=True)
  b.close()
