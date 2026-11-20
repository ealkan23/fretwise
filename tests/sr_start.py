# Sight Reading phase 3: start every level headless and muted on a copy of the store, screenshot a question and a graded answer (tests/out/sr-*.png)
import subprocess,time,json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path('/Users/emir/Desktop/fretwise-repo');raw=(root/'backups/store-before-sight-reading-2026-11-20.json').read_text()
srv=subprocess.Popen(['python3','-m','http.server','8796'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
    pg=b.new_page(viewport={'width':1440,'height':1100});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8796/src/fretwise.html');pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload();pg.wait_for_timeout(1500)
    n=pg.evaluate("GBY.sightread.levels.length")
    for L in range(1,n+1):
      r=pg.evaluate("L=>{try{G('sightread').review=false;G('sightread').preview=false;start('sightread',L);render();const h=document.getElementById('app').innerHTML;return [S.q.key,/undefined|NaN/.test(h.replace(/data-[a-z]+=\"[^\"]*\"/g,''))?'BAD':'ok'];}catch(e){return ['ERR',e.message];}}",L)
      print(L,r)
      if L in (4,9,10,11,15,17,18,21,22,23,24,25):
        pg.wait_for_timeout(400);pg.query_selector('.srwrap').screenshot(path=f'/Users/emir/Desktop/fretwise-repo/tests/out/sr-q{L}.png')
        # a played take: right notes on time except the third note wrong and the fifth late
        pg.evaluate("""()=>{const q=S.q,B=1000,t0=5000,ns=q.target.map((m,i)=>({midi:i===2?m+1:m,mf:i===2?m+1:m,t:t0+q.grid[i]*B+(i===4?450:0),dur:300}));const r=micGrade(q,{notes:ns,firstAt:t0,beat:B,beatStart:t0});S.micResult=r;S.locked=true;S.answers.push({q,given:{notes:ns},ok:r.ok,ms:3000});render();}""")
        pg.wait_for_timeout(300);els=pg.query_selector_all('.srwrap');els[-1].screenshot(path=f'/Users/emir/Desktop/fretwise-repo/tests/out/sr-a{L}.png')
      pg.evaluate("()=>{try{if(typeof stopListening==='function')stopListening();}catch(e){};view={name:'home'};S.locked=false;}")
    print('errors',errs[:5]);b.close()
finally:srv.terminate()
