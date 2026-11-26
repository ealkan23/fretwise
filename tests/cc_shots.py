"""Chart Reading (26 Nov 2026): every level started headless and muted on a copy of the user's store (no page error), a screenshot of its chart (during the scan) and of the
answer page after a synthetic take graded through micGrade (one strum in five a wrong chord, so the marks show): tests/out/cc-L<level>-q.png and -a.png. Run after build.py."""
import pathlib,json,subprocess,time,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/'backups/store-before-reading-build-2026-11-26.json').read_text();(root/'tests/out').mkdir(exist_ok=True)
srv=subprocess.Popen(['python3','-m','http.server','8798'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1);bad=0
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
    pg=b.new_page(viewport={'width':1440,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8798/src/fretwise.html');pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload();pg.wait_for_timeout(1500)
    for L in range(1,11):
      pg.evaluate("(L)=>{BP.state='ready';const g=G('chartread');g.unl=Array.from({length:10},(_,i)=>i+1);g.review=false;g.preview=false;view={name:'lobby',gid:'chartread'};render();start('chartread',L);}",L)
      pg.wait_for_timeout(700);pg.screenshot(path=str(root/f'tests/out/cc-L{L}-q.png'))
      info=pg.evaluate("""()=>{const q=S.q;if(S.scanning){S.scanning=false;S.scanTok++;}const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;},B=60000/q.metro,bs=4*B+100;
        const res={strums:q.strumSeq.map((v,i)=>({t:bs+q.grid[i]*B+(i%5===2?B*.1:0),act:act(i%5===4?v.map(m=>m+1):v)})),beat:B,beatStart:bs,firstAt:bs};answer(res);render();
        const sv=[...document.querySelectorAll('.ccchart svg')];return {key:q.key,strums:q.strumSeq.length,bars:q.cc.ch.bars.length,ok:S.micResult&&S.micResult.ok,share:S.micResult&&S.micResult.share?Math.round(S.micResult.share.pct*100):null,charts:sv.length};}""")
      pg.wait_for_timeout(300);pg.screenshot(path=str(root/f'tests/out/cc-L{L}-a.png'),full_page=True)
      print(L,info,errs[-1:] if errs else '',flush=True)
      if errs:bad+=1
      pg.evaluate("quit()")
    b.close()
finally:srv.terminate()
print('errors' if bad else 'no page errors')
