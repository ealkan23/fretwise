"""Sight Reading: the scan before the count-in (26 Nov 2026, reading brief phase A2), headless and muted, on dist/.
For a 2-bar, a 4-bar, a 16-bar and a 32-bar question, with "Listen as soon as the question appears" on and off: the time from the question to the count-in
(listening starts with it) is measured; Space during the scan starts the count-in at once; level 1 (free start) has no scan.
Run after build.py:  .venv/bin/python tests/scan_check.py [quick]"""
import pathlib,sys,time
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent
quick='quick' in sys.argv
# level, generator index (or -1 = any), expected written bars
CASES=[(3,0,2),(24,-1,4),(27,-1,16),(29,-1,32)]
out=[];fails=0
with sync_playwright() as pw:
  b=pw.chromium.launch(channel='chrome',headless=True,args=['--autoplay-policy=no-user-gesture-required','--mute-audio','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
  def page(L,gi,auto):
    pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto((root/'dist'/'fretwise.html').as_uri());pg.evaluate('localStorage.clear()');pg.reload()
    pg.evaluate("([L,gi,auto])=>{BP.state='failed';const g=G('sightread');g.opts=Object.assign({},g.opts||{},{auto});g.review=false;g.preview=false;g.unl=Array.from({length:40},(_,i)=>i+1);if(gi>=0){const lv=GBY.sightread.levels[L-1];lv.g=[lv.g[gi]];}view={name:'lobby',gid:'sightread'};render();window._t0=performance.now();start('sightread',L);render();}",[L,gi,auto])
    return pg,errs
  for L,gi,nb in CASES:
    for auto in ([True] if quick else [True,False]):
      pg,errs=page(L,gi,auto)
      bars=pg.evaluate('S.q.sr.bars.length');scan=pg.evaluate('S.q.scan')
      pg.wait_for_function('S.scanning',timeout=10000);s0=pg.evaluate('(performance.now()-window._t0)/1000')
      try:pg.wait_for_function('S.listening',timeout=(scan+15)*1000)
      except Exception:out.append((L,auto,'never listened',errs[:2]));fails+=1;pg.close();continue
      el=pg.evaluate('(performance.now()-window._t0)/1000')-s0   # the scan's own length: from its start to the count-in (the first page also waits for the microphone to open)
      cin=pg.evaluate("!!document.getElementById('cin')&&/count-in|play/.test(document.getElementById('cin').textContent)")
      ok=bars==nb and abs(el-scan)<1.2 and cin and not errs
      fails+=0 if ok else 1
      out.append((f'L{L}',f'{bars} bars',f'auto {auto}',f'scan {scan} s',f'scan began {s0:.1f} s after the question, count-in {el:.1f} s after that',f'count-in shown {cin}','OK' if ok else 'FAIL',errs[:2]));print(out[-1],flush=True);pg.close()
  # Space cuts the scan short
  pg,errs=page(27,-1,True);pg.wait_for_function('S.scanning',timeout=5000);time.sleep(1.0)
  txt=pg.evaluate("document.getElementById('cin').textContent")
  pg.keyboard.press('Space');time.sleep(0.4)
  st=pg.evaluate('({listening:S.listening,scanning:S.scanning,t:(performance.now()-window._t0)/1000})')
  ok=st['listening'] and not st['scanning'] and st['t']<3 and 'look it through' in txt
  fails+=0 if ok else 1;out.append(('Space during the scan',st,txt[:60],'OK' if ok else 'FAIL'));print(out[-1],flush=True);pg.close()
  # level 1: free start, no scan
  pg,errs=page(1,-1,True);time.sleep(1.0)
  st=pg.evaluate('({scan:S.q.scan||0,scanning:!!S.scanning,listening:S.listening})')
  ok=not st['scan'] and not st['scanning'] and st['listening']
  fails+=0 if ok else 1;out.append(('level 1',st,'OK' if ok else 'FAIL'));print(out[-1],flush=True);pg.close()
  b.close()
print('fails',fails)
