"""The review of John's games (22 Nov 2026): new and changed levels: start each one headless and muted on the migrated copy of the user's store, several questions each,
screenshot one question per generator (tests/out/jn-<game>-<level>-<n>.png). Usage: .venv/bin/python tests/john_start.py game:level[,level…] …"""
import subprocess,time,json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/'backups/store-before-john-audit-2026-11-22.json').read_text()
jobs=[(a.split(':')[0],[int(x) for x in a.split(':')[1].split(',')]) for a in sys.argv[1:]]
srv=subprocess.Popen(['python3','-m','http.server','8798'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'])
    pg=b.new_page(viewport={'width':1440,'height':1000});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8798/src/fretwise.html');pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload();pg.wait_for_timeout(1500)
    for gid,Ls in jobs:
      pg.evaluate("gid=>{const g=G(gid);if(PLAY_GAMES.includes(gid))g.mode='play';g.review=false;g.preview=false;}",gid)
      r=pg.evaluate("gid=>{view={name:'lobby',gid};render();const h=document.getElementById('app').innerHTML.replace(/data-[a-z]+=\"[^\"]*\"/g,'');return /\\bundefined\\b|\\bNaN\\b/.test(h)?'BAD lobby':'lobby ok';}",gid);print(gid,r)
      for L in Ls:
        ng=pg.evaluate("([gid,L])=>GBY[gid].levels[L-1].g.length",[gid,L]);seen=set()
        for k in range(ng*4):
          r=pg.evaluate("([gid,L])=>{try{start(gid,L);render();const h=document.getElementById('app').innerHTML.replace(/data-[a-z]+=\"[^\"]*\"/g,'');return [S.q.key,S.q.label,/\\bundefined\\b|\\bNaN\\b/.test(h)?'BAD':'ok',S.L];}catch(e){return ['ERR',e.message,'BAD',0];}}",[gid,L])
          fam=r[0].rsplit('-',1)[0] if r[0]!='ERR' else 'ERR'
          if r[2]!='ok' or r[3]!=L:print('  !!',gid,L,r)
          if fam not in seen and len(seen)<6:
            seen.add(fam);pg.wait_for_timeout(350);pg.screenshot(path=str(root/f'tests/out/jn-{gid}-{L}-{len(seen)}.png'),full_page=True);print(' ',gid,L,r[0],'|',r[1])
          pg.evaluate("()=>{try{if(typeof stopListening==='function')stopListening();}catch(e){};try{vampStop();clickStop();}catch(e){};view={name:'home'};S.locked=false;}")
    print('page errors',errs[:5]);b.close()
finally:srv.terminate()
