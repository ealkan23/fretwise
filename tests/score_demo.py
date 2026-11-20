"""Phase-2 check of the score engine: renders tests/score_demo.js (fixed examples) headless and muted at 1440 and 1000 px -> tests/out/score-*.png"""
import subprocess,time,json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path('/Users/emir/Desktop/fretwise-repo');js=open(str(root/'tests/score_demo.js')).read()
srv=subprocess.Popen(['python3','-m','http.server','8794'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio'])
    for w in (1440,1000):
      pg=b.new_page(viewport={'width':w,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      pg.goto('http://localhost:8794/src/fretwise.html');pg.wait_for_timeout(1500)
      r=pg.evaluate(js);pg.wait_for_timeout(300)
      pg.screenshot(path=f'/Users/emir/Desktop/fretwise-repo/tests/out/score-{w}.png',full_page=True)
      if w==1440:print(json.dumps(r,ensure_ascii=False,indent=0)[:2500])
      print(w,'errors',errs)
    b.close()
finally:srv.terminate()
