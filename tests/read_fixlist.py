"""Reads the user's Fix list (written in the app, stored in Chrome's IndexedDB) into fixlist/: reports.json + one WAV per report with audio.
Copies the Chrome profile's storage to a temp profile (read-only for the real one). Usage: .venv/bin/python tests/read_fixlist.py [chrome-profile-dir]"""
import json, pathlib, shutil, sys, tempfile, wave, array
from playwright.sync_api import sync_playwright
root = pathlib.Path(__file__).resolve().parent.parent
prof = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path.home() / 'Library/Application Support/Google/Chrome/Default')
out = root / 'fixlist'; out.mkdir(exist_ok=True)
tmp = pathlib.Path(tempfile.mkdtemp()); (tmp / 'Default' / 'IndexedDB').mkdir(parents=True)
for d in (prof / 'IndexedDB').glob('*'):
    if 'ealkan23.github.io' in d.name or d.name.startswith('file__'):
        shutil.copytree(d, tmp / 'Default' / 'IndexedDB' / d.name, ignore=shutil.ignore_patterns('LOCK'))
# the recordings are fetched one at a time as base64: all of them in one result closed the driver connection once the list had grown (14 Nov 2026)
GET = """async()=>{try{window.__rs=await FIXDB.all();return window.__rs.map(r=>({...r,audio:r.audio?{sr:r.audio.sr,n:r.audio.pcm.length}:null}));}catch(e){return {error:String(e)}}}"""
PCM = """i=>{const p=window.__rs[i].audio.pcm,a=p instanceof Int16Array?p:Int16Array.from(p),u=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);let s='';for(let k=0;k<u.length;k+=32768)s+=String.fromCharCode.apply(null,u.subarray(k,k+32768));return btoa(s);}"""
import base64
reports = []
with sync_playwright() as pw:
    ctx = pw.chromium.launch_persistent_context(str(tmp), channel='chrome', headless=True)
    pg = ctx.new_page()
    for url in ['https://ealkan23.github.io/fretwise/', (root / 'dist' / 'fretwise.html').as_uri()]:
        pg.goto(url); rs = pg.evaluate(GET)
        if isinstance(rs, dict): print(url, rs); continue
        for i, r in enumerate(rs):
            r['source'] = 'site' if url.startswith('https') else 'offline file'
            if r.get('audio'): r['audio'] = {'sr': r['audio']['sr'], 'raw': base64.b64decode(pg.evaluate(PCM, i))}
        reports += rs
    ctx.close()
shutil.rmtree(tmp, ignore_errors=True)
reports.sort(key=lambda r: r['t'])
for r in reports:
    a = r.pop('audio', None)
    if a:
        f = out / f"{r['source'].split()[0]}-{r['id']}.wav"; w = wave.open(str(f), 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(a['sr'])
        w.writeframes(a['raw']); w.close(); r['audioFile'] = f.name
(out / 'reports.json').write_text(json.dumps(reports, indent=1, ensure_ascii=False))
print(f'{len(reports)} report(s) → fixlist/reports.json')
for r in reports:
    c = r.get('ctx') or {}
    print(f"- #{r['id']} [{r['source']}{' '+r['build'] if r.get('build') else ''}] {c.get('game') or c.get('view')} {c.get('label') or ''}: {r['text']}" + (f"  (audio: {r['audioFile']})" if r.get('audioFile') else ''))
