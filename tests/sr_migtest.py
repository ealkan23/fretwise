"""Run the app on a copy of the user's store (backups/…json), headless and muted: per-game answers before/after, other games byte-identical, second load a no-op."""
import subprocess,time,json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path('/Users/emir/Desktop/fretwise-repo');raw=(root/'backups/store-before-sight-reading-2026-11-20.json').read_text()
srv=subprocess.Popen(['python3','-m','http.server','8795'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
JS="""()=>{GAMES.forEach(x=>G(x.id));saveLocal();return localStorage.getItem('fretwise-v1');}"""
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8795/src/fretwise.html');pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload();pg.wait_for_timeout(1500)
    a=pg.evaluate(JS);pg.reload();pg.wait_for_timeout(1500);b2=pg.evaluate(JS);b.close()
finally:srv.terminate()
B=json.loads(raw);A=json.loads(a);C=json.loads(b2)
def summ(g):
  if not g:return None
  return dict(n=g.get('n'),c=g.get('c'),items=len(g.get('items',{})),itn=sum(i.get('n',0) for i in g.get('items',{}).values()),lvl=g.get('lvl'),unl=g.get('unl'),skip=g.get('skip'),last=g.get('last'),pl=len(g.get('pl',[])),rl=len(g.get('rl',[])),sess=len(g.get('sessions',[])),time=g.get('time'),
    lc={k:(v['s'],v['g']) for k,v in sorted(g.get('lc',{}).items(),key=lambda x:int(x[0]))},hist={k:len(v) for k,v in g.get('hist',{}).items()},days=(sum(d.get('n',0) for d in g.get('days',{}).values()),sum(d.get('c',0) for d in g.get('days',{}).values()),sum(d.get('dur',0) for d in g.get('days',{}).values())))
print('errors',errs)
print('BEFORE sight',summ(B['games']['sight']));print('AFTER  sight',summ(A['games']['sight']));print('AFTER  sightread',summ(A['games'].get('sightread')))
s0=B['games']['sight'];s1=A['games']['sight'];t1=A['games']['sightread']
for f in ['n','c','ms','pn','pc','time']:print(f,s0.get(f),'=',s1.get(f),'+',t1.get(f),'ok' if abs((s1.get(f) or 0)+(t1.get(f) or 0)-(s0.get(f) or 0))<1e-6 else 'MISMATCH')
for f in ['pl','sessions','rl']:print(f,len(s0[f]),'=',len(s1[f]),'+',len(t1[f]))
print('items',len(s0['items']),'=',len(s1['items']),'+',len(t1['items']))
dd=lambda g,f:sum(d.get(f,0) for d in g['days'].values())
for f in ['n','c','ms','dur','gn','gp','rn','rt','tn','dr','ab']:print('days',f,dd(s0,f),'=',dd(s1,f),'+',dd(t1,f),'ok' if abs(dd(s1,f)+dd(t1,f)-dd(s0,f))<1e-6 else 'MISMATCH')
diff=[k for k in B['games'] if k not in ('sight','sightread') and json.dumps(B['games'][k],sort_keys=True)!=json.dumps(A['games'].get(k),sort_keys=True)]
print('other games changed:',diff)
print('top-level keys changed:',[k for k in set(B)|set(A) if k!='games' and json.dumps(B.get(k),sort_keys=True)!=json.dumps(A.get(k),sort_keys=True)])
print('second load no-op:',json.dumps(A,sort_keys=True)==json.dumps(C,sort_keys=True))
