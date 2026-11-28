"""Scale Runner in the lessons' order (28 Nov 2026, the scale lessons build, phase B: REORDERS33 / flag r59): run on a copy of the user's store
(backups/store-before-scale-lessons-2026-11-28.json), headless and muted. Checks that every total, item, round, history point, log entry and per-level count
of Scale Runner is the same before and after with every level's records on its new number; that every other game is byte-identical; that no top-level key
changed; that a second load changes nothing. Then made-up players with the frontier below, on and above each moved level: every level that was passed is still
passed (lvPassed in the page), every level that was open is still open, the new levels are open and not passed under the frontier and locked above it,
and the frontier is the expected level."""
import subprocess,time,json,pathlib,copy
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/'backups/store-before-scale-lessons-2026-11-28.json').read_text()
MP={9:17,10:9,11:10,12:16,13:11,14:12,15:18,16:19,17:20,18:22,19:23,20:21};mp=lambda L:MP.get(L,L);NEW=[13,14,15];NL=23
JS="""()=>{GAMES.forEach(x=>G(x.id));saveLocal();return localStorage.getItem('fretwise-v1');}"""
def run(pg,store):
  pg.goto('http://localhost:8797/src/fretwise.html');pg.evaluate("r=>{localStorage.clear();localStorage.setItem('fretwise-v1',r)}",store);pg.reload();pg.wait_for_timeout(1500)
  a=pg.evaluate(JS);st=pg.evaluate("n=>({passed:Array.from({length:n},(_,i)=>lvPassed('scales',i+1)),open:Array.from({length:n},(_,i)=>lvOpen('scales',i+1)),name:GBY.scales.levels[G('scales').lvl-1].n,lvl:G('scales').lvl,n:GBY.scales.levels.length})",NL)
  pg.reload();pg.wait_for_timeout(1500);b=pg.evaluate(JS);return json.loads(a),json.loads(b),st
def remapped(B,A):
  g0=B['games']['scales'];g1=A['games']['scales'];ok=True;out=[]
  for f in ['n','c','ms','pn','pc','time']:
    good=(g0.get(f) or 0)==(g1.get(f) or 0);ok&=good;out.append(f'{f} {g0.get(f)} → {g1.get(f)} {"ok" if good else "MISMATCH"}')
  for f in ['items','pl','rl','sessions','days']:
    good=len(g0.get(f,[]))==len(g1.get(f,[]));ok&=good;out.append(f'{f} {len(g0.get(f,[]))} → {len(g1.get(f,[]))} {"ok" if good else "MISMATCH"}')
  lc0={mp(int(k)):v for k,v in g0.get('lc',{}).items()};lc1={int(k):v for k,v in g1.get('lc',{}).items()}
  good=lc0==lc1;ok&=good;out.append(f'per-level counts on their new numbers {"ok" if good else "MISMATCH "+str(lc0)+" / "+str(lc1)}')
  for f in ['hist','ht','hs']:
    h0={mp(int(k)):v for k,v in (g0.get(f) or {}).items()};h1={int(k):v for k,v in (g1.get(f) or {}).items()};good=h0==h1;ok&=good;out.append(f'{f} windows on their new numbers {"ok" if good else "MISMATCH"}')
  for inp in (g0.get('hm') or {}):
    h0={mp(int(k)):v for k,v in g0['hm'][inp].items()};h1={int(k):v for k,v in g1['hm'][inp].items()};good=h0==h1;ok&=good;out.append(f'hm.{inp} on its new numbers {"ok" if good else "MISMATCH"}')
  il0=sorted((k,mp(v['lv']) if v.get('lv') else None) for k,v in g0['items'].items());il1=sorted((k,v.get('lv')) for k,v in g1['items'].items());good=il0==il1;ok&=good;out.append(f'items on their new levels {"ok" if good else "MISMATCH"}')
  cnt=lambda g:sorted((k,v.get('n'),v.get('c'),v.get('w')) for k,v in g['items'].items());good=cnt(g0)==cnt(g1);ok&=good;out.append(f'item counts unchanged {"ok" if good else "MISMATCH"}')
  pl0=[mp(e['lv']) if e.get('lv') else None for e in g0.get('pl',[])];pl1=[e.get('lv') for e in g1.get('pl',[])];good=pl0==pl1;ok&=good;out.append(f'log on its new levels {"ok" if good else "MISMATCH"}')
  r0=[mp(p['L']) if p.get('L') else None for p in g0.get('rl',[])];r1=[p.get('L') for p in g1.get('rl',[])];good=r0==r1;ok&=good;out.append(f'history points on their new levels {"ok" if good else "MISMATCH"}')
  s0=[mp(p['L']) if p.get('L') else None for p in g0.get('sessions',[])];s1=[p.get('L') for p in g1.get('sessions',[])];good=s0==s1;ok&=good;out.append(f'rounds on their new levels {"ok" if good else "MISMATCH"}')
  b0={mp(int(k)):v for k,v in ((g0.get('opts') or {}).get('bpmL') or {}).items()};b1={int(k):v for k,v in ((g1.get('opts') or {}).get('bpmL') or {}).items()};good=b0==b1;ok&=good;out.append(f'tempos per level {"ok" if good else "MISMATCH "+str(b0)+" / "+str(b1)}')
  o0={k:v for k,v in (g0.get('opts') or {}).items() if k!='bpmL'};o1={k:v for k,v in (g1.get('opts') or {}).items() if k!='bpmL'};good=o0==o1;ok&=good;out.append(f'options unchanged {"ok" if good else "MISMATCH"}')
  return ok,out
srv=subprocess.Popen(['python3','-m','http.server','8797'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
allok=True
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    B=json.loads(raw);A,C,st=run(pg,raw);g0=B['games']['scales'];g1=A['games']['scales']
    print("===== the user's store")
    ok,out=remapped(B,A);print('  '+'\n  '.join(out))
    print('  before: frontier',g0.get('lvl'),'skip',g0.get('skip'),'unl',g0.get('unl'),'last',g0.get('last'))
    print('  after:  frontier',g1.get('lvl'),f'“{st["name"]}”','skip',g1.get('skip'),'unl',g1.get('unl'),'last',g1.get('last'),'levels',st['n'])
    print('  open now:',[i+1 for i,v in enumerate(st['open']) if v],'passed now:',[i+1 for i,v in enumerate(st['passed']) if v])
    good=g1.get('lvl')==9 and st['name']=='Thirds, in C' and 17 in g1.get('unl',[]) and 10 in g1.get('unl',[]) and not any(st['open'][L-1] for L in NEW);print('  expected (frontier 9 “Thirds, in C”, Groups of three and four open as 17, Thirds: C, F and G open as 10, the new levels locked):','ok' if good else 'MISMATCH');ok&=good
    diff=[k for k in B['games'] if k!='scales' and json.dumps(B['games'][k],sort_keys=True)!=json.dumps(A['games'].get(k),sort_keys=True)];print('  other games changed:',diff);ok&=not diff
    tl=[k for k in set(B)|set(A) if k!='games' and json.dumps(B.get(k),sort_keys=True)!=json.dumps(A.get(k),sort_keys=True)];print('  top-level keys changed:',tl);ok&=not tl
    nop=json.dumps(A,sort_keys=True)==json.dumps(C,sort_keys=True);print('  second load no-op:',nop);ok&=nop
    print('  RESULT',"the user's store",'OK' if ok else 'FAIL');allok&=ok
    # made-up players: frontier on old F, every level under it passed by its own record too, the levels in skip open and not passed
    for F,skip,unl,expect in [(8,[],[],8),(9,[],[],9),(10,[9],[],9),(12,[],[],11),(13,[],[15],11),(14,[9],[],12),(15,[],[],18),(17,[12],[],20),(19,[],[],21),(20,[],[],21)]:
      B2=copy.deepcopy(B);g=B2['games']['scales'];g['mig']={k:1 for k in (B['games']['scales'].get('mig') or {}) if k!='r59'}
      g['lvl']=F;g['skip']=skip;g['unl']=unl;g['last']=F;g['hist']={};g.pop('hm',None)
      for L in range(1,F):g['hist'][str(L)]=[1,0,0,1] if L in skip else [1]*20
      g['hist'][str(F)]=[1,0,1]
      A2,C2,st2=run(pg,json.dumps(B2));g2=A2['games']['scales']
      passed0={mp(L) for L in range(1,F) if L not in skip};open0={mp(L) for L in range(1,F+1)}|{mp(L) for L in unl}
      pnow={i+1 for i,v in enumerate(st2['passed']) if v};onow={i+1 for i,v in enumerate(st2['open']) if v}
      newUnder=[L for L in NEW if L<g2['lvl']];newAbove=[L for L in NEW if L>g2['lvl']]
      good=passed0<=pnow and open0<=onow and g2['lvl']==expect and mp(F) not in pnow and all(mp(L) not in pnow for L in skip) and all(L in onow and L not in pnow for L in newUnder) and all(L not in onow for L in newAbove) and not any(L in pnow for L in NEW)
      h0={mp(int(k)):v for k,v in g['hist'].items()};h1={int(k):v for k,v in g2['hist'].items()};good&=h0==h1
      nop=json.dumps(A2,sort_keys=True)==json.dumps(C2,sort_keys=True)
      print(f'===== made-up player, frontier old {F} (skip {skip}, open above {unl})')
      print(f'  after: frontier {g2["lvl"]} “{st2["name"]}” (expected {expect}), skip {g2.get("skip")}, unl {g2.get("unl")}, last {g2.get("last")}; passed {sorted(pnow)}; open {sorted(onow)}; missing passed {sorted(passed0-pnow)}, missing open {sorted(open0-onow)}; second load no-op {nop}')
      r=good and nop;print('  RESULT','OK' if r else 'FAIL');allok&=r
    print('page errors',errs[:3]);allok&=not errs;b.close()
finally:srv.terminate()
print('ALL OK' if allok else 'SOMETHING FAILED')
