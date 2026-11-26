"""Reading Rhythm reordered (26 Nov 2026, reading brief phase B, REORDERS30 / flag r56): run on a copy of the user's store
(backups/store-before-reading-build-2026-11-26.json), headless and muted. Checks that every total, item, round, history point, log entry and per-level count
of Reading Rhythm is the same before and after with every level's records on its new number; that every other game is byte-identical; that no top-level key
changed; that a second load changes nothing. Then made-up players with the frontier on old 18, 21, 25 and 26: every level that was passed is still passed
(lvPassed in the page), every level that was open is still open, and the frontier is the expected level."""
import subprocess,time,json,pathlib,copy
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/'backups/store-before-reading-build-2026-11-26.json').read_text()
MP={18:23,19:18,20:19,21:20,22:24,23:25,24:26,25:21,26:22};mp=lambda L:MP.get(L,L)
JS="""()=>{GAMES.forEach(x=>G(x.id));saveLocal();return localStorage.getItem('fretwise-v1');}"""
def run(pg,store):
  pg.goto('http://localhost:8797/src/fretwise.html');pg.evaluate("r=>{localStorage.clear();localStorage.setItem('fretwise-v1',r)}",store);pg.reload();pg.wait_for_timeout(1500)
  a=pg.evaluate(JS);st=pg.evaluate("()=>({passed:Array.from({length:29},(_,i)=>lvPassed('rhyread',i+1)),open:Array.from({length:29},(_,i)=>lvOpen('rhyread',i+1)),name:GBY.rhyread.levels[G('rhyread').lvl-1].n,lvl:G('rhyread').lvl})")
  pg.reload();pg.wait_for_timeout(1500);b=pg.evaluate(JS);return json.loads(a),json.loads(b),st
def remapped(B,A):
  g0=B['games']['rhyread'];g1=A['games']['rhyread'];ok=True;out=[]
  for f in ['n','c','ms','pn','pc','time']:
    good=(g0.get(f) or 0)==(g1.get(f) or 0);ok&=good;out.append(f'{f} {g0.get(f)} → {g1.get(f)} {"ok" if good else "MISMATCH"}')
  for f in ['items','pl','rl','sessions','days']:
    good=len(g0.get(f,[]))==len(g1.get(f,[]));ok&=good;out.append(f'{f} {len(g0.get(f,[]))} → {len(g1.get(f,[]))} {"ok" if good else "MISMATCH"}')
  lc0={mp(int(k)):v for k,v in g0.get('lc',{}).items()};lc1={int(k):v for k,v in g1.get('lc',{}).items()}
  good=lc0==lc1;ok&=good;out.append(f'per-level counts on their new numbers {"ok" if good else "MISMATCH "+str(lc0)+" / "+str(lc1)}')
  h0={mp(int(k)):v for k,v in g0.get('hist',{}).items()};h1={int(k):v for k,v in g1.get('hist',{}).items()};good=h0==h1;ok&=good;out.append(f'recent windows on their new numbers {"ok" if good else "MISMATCH"}')
  il0=sorted((k,mp(v['lv']) if v.get('lv') else None) for k,v in g0['items'].items());il1=sorted((k,v.get('lv')) for k,v in g1['items'].items());good=il0==il1;ok&=good;out.append(f'items on their new levels {"ok" if good else "MISMATCH"}')
  pl0=[mp(e['lv']) if e.get('lv') else None for e in g0.get('pl',[])];pl1=[e.get('lv') for e in g1.get('pl',[])];good=pl0==pl1;ok&=good;out.append(f'log on its new levels {"ok" if good else "MISMATCH"}')
  r0=[mp(p['L']) if p.get('L') else None for p in g0.get('rl',[])];r1=[p.get('L') for p in g1.get('rl',[])];good=r0==r1;ok&=good;out.append(f'history points on their new levels {"ok" if good else "MISMATCH"}')
  s0=[mp(p['L']) if p.get('L') else None for p in g0.get('sessions',[])];s1=[p.get('L') for p in g1.get('sessions',[])];good=s0==s1;ok&=good;out.append(f'rounds on their new levels {"ok" if good else "MISMATCH"}')
  b0={mp(int(k)):v for k,v in ((g0.get('opts') or {}).get('bpmL') or {}).items()};b1={int(k):v for k,v in ((g1.get('opts') or {}).get('bpmL') or {}).items()};good=b0==b1;ok&=good;out.append(f'tempos per level {"ok" if good else "MISMATCH "+str(b0)+" / "+str(b1)}')
  return ok,out
srv=subprocess.Popen(['python3','-m','http.server','8797'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
allok=True
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    B=json.loads(raw);A,C,st=run(pg,raw);g0=B['games']['rhyread'];g1=A['games']['rhyread']
    print("===== the user's store")
    ok,out=remapped(B,A);print('  '+'\n  '.join(out))
    print('  before: frontier',g0.get('lvl'),'skip',g0.get('skip'),'unl',g0.get('unl'),'last',g0.get('last'))
    print('  after:  frontier',g1.get('lvl'),f'“{st["name"]}”','skip',g1.get('skip'),'unl',g1.get('unl'),'last',g1.get('last'))
    diff=[k for k in B['games'] if k!='rhyread' and json.dumps(B['games'][k],sort_keys=True)!=json.dumps(A['games'].get(k),sort_keys=True)];print('  other games changed:',diff);ok&=not diff
    tl=[k for k in set(B)|set(A) if k!='games' and json.dumps(B.get(k),sort_keys=True)!=json.dumps(A.get(k),sort_keys=True)];print('  top-level keys changed:',tl);ok&=not tl
    nop=json.dumps(A,sort_keys=True)==json.dumps(C,sort_keys=True);print('  second load no-op:',nop);ok&=nop
    print('  RESULT',"the user's store",'OK' if ok else 'FAIL');allok&=ok
    # made-up players: frontier on old F, every level under it passed (own records too), one level under it in skip where asked
    for F,skip,unl,expect in [(18,[],[],18),(21,[18],[],20),(25,[],[26],21),(26,[22],[],22)]:
      B2=copy.deepcopy(B);g=B2['games']['rhyread'];g.pop('mig',None);g['mig']={k:1 for k in (B['games']['rhyread'].get('mig') or {}) if k!='r56'}
      g['lvl']=F;g['skip']=skip;g['unl']=unl;g['last']=F
      for L in range(1,F):
        if L in skip:g['hist'][str(L)]=[1,0,0,1];continue
        g['hist'][str(L)]=[1]*16
      g['hist'][str(F)]=[1,0,1]
      A2,C2,st2=run(pg,json.dumps(B2));g2=A2['games']['rhyread']
      passed0={mp(L) for L in range(1,F) if L not in skip};open0={mp(L) for L in range(1,F+1)}|{mp(L) for L in unl}
      pnow={i+1 for i,v in enumerate(st2['passed']) if v};onow={i+1 for i,v in enumerate(st2['open']) if v}
      ok2,out2=remapped(B2,A2)
      good=passed0<=pnow and open0<=onow and g2['lvl']==expect and mp(F) not in pnow and all(mp(L) not in pnow for L in skip)
      nop=json.dumps(A2,sort_keys=True)==json.dumps(C2,sort_keys=True)
      print(f'===== made-up player, frontier old {F} (skip {skip}, open above {unl})');print('  '+'\n  '.join(out2))
      print(f'  after: frontier {g2["lvl"]} “{st2["name"]}” (expected {expect}), skip {g2.get("skip")}, unl {g2.get("unl")}; passed {sorted(pnow)}; missing passed {sorted(passed0-pnow)}, missing open {sorted(open0-onow)}; second load no-op {nop}')
      r=good and ok2 and nop;print('  RESULT','OK' if r else 'FAIL');allok&=r
    print('page errors',errs[:5]);allok&=not errs;b.close()
finally:srv.terminate()
print('ALL OK' if allok else 'SOMETHING FAILED')
