import subprocess,time,json,pathlib,sys
from playwright.sync_api import sync_playwright
def run(rootdir,raw,port):
  srv=subprocess.Popen(['python3','-m','http.server',str(port)],cwd=rootdir,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
  try:
    with sync_playwright() as p:
      b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      pg.goto(f'http://localhost:{port}/src/fretwise.html');pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload();pg.wait_for_timeout(1500)
      J="()=>{GAMES.forEach(x=>G(x.id));saveLocal();return localStorage.getItem('fretwise-v1');}"
      a=pg.evaluate(J);pg.reload();pg.wait_for_timeout(1200);c=pg.evaluate(J);b.close();return a,c,errs
  finally:srv.terminate()
raw=pathlib.Path('/Users/emir/Desktop/fretwise-repo/backups/store-before-sight-reading-2026-11-20.json').read_text()
B=json.loads(raw)
sm=lambda g:dict(n=g['n'],c=g['c'],lvl=g['lvl'],unl=g.get('unl'),skip=g.get('skip'),last=g.get('last'),lc={k:v for k,v in g.get('lc',{}).items()},hist={k:len(v) for k,v in g.get('hist',{}).items()},items=sorted(set(i['lv'] for i in g['items'].values())),pl=sorted(set(e['lv'] for e in g.get('pl',[]))),rl=sorted(set(e.get('L') for e in g.get('rl',[]))))
a,c,e=run('/Users/emir/Desktop/fretwise-repo',raw,8797);A=json.loads(a)
print('A errors',e,'second load no-op',a==c);print(' sight',sm(A['games']['sight']));print(' sightread',sm(A['games']['sightread']))
p3,_,e3=run('/tmp/fwrun/p3',raw,8798);P=json.loads(p3);print('phase-3 store sightread',sm(P['games']['sightread']))
a2,c2,e2=run('/Users/emir/Desktop/fretwise-repo',p3,8799);A2=json.loads(a2)
print('B errors',e2,'second load no-op',a2==c2);print(' sightread',sm(A2['games']['sightread']))
others=[k for k in B['games'] if k not in('sight','sightread') and json.dumps(B['games'][k],sort_keys=True)!=json.dumps(A['games'][k],sort_keys=True)]
print('other games changed (A):',others)
print('A == B for both games:',json.dumps(A['games']['sightread'],sort_keys=True)==json.dumps(A2['games']['sightread'],sort_keys=True),json.dumps(A['games']['sight'],sort_keys=True)==json.dumps(A2['games']['sight'],sort_keys=True))
print('totals',B['games']['sight']['n'],'=',A['games']['sight']['n'],'+',A['games']['sightread']['n'])
