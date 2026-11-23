"""The r53 migration (REORDERS27: Scale Runner 16 → 18, Arpeggio Runner 14 → 15; the review of John's games, 22 Nov 2026) on a copy of the user's store, headless and muted:
per-game totals before and after, every other game byte-identical, a second load a no-op, plus made-up players at other frontiers.
Run: .venv/bin/python tests/john_migtest.py [backups/store.json]"""
import subprocess,time,json,pathlib,sys,copy,os
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/(sys.argv[1] if len(sys.argv)>1 else 'backups/store-before-john-audit-2026-11-22.json')).read_text()
GS=['scales','arp']
srv=subprocess.Popen(['python3','-m','http.server','8797'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
JS="""()=>{GAMES.forEach(x=>G(x.id));saveLocal();return localStorage.getItem('fretwise-v1');}"""
def run(pg,store):
    pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",store);pg.reload();pg.wait_for_timeout(1500);a=pg.evaluate(JS);pg.reload();pg.wait_for_timeout(1500);b=pg.evaluate(JS);return json.loads(a),json.loads(b)
def summ(g):
    if not g:return None
    lv=lambda xs,k:dict(sorted({}.items()))
    per={}
    for it in g.get('items',{}).values():per[it.get('lv')]=per.get(it.get('lv'),0)+it.get('n',0)
    return dict(n=g.get('n'),c=g.get('c'),ms=g.get('ms'),time=g.get('time'),pn=g.get('pn'),pc=g.get('pc'),items=len(g.get('items',{})),lvl=g.get('lvl'),unl=g.get('unl'),skip=g.get('skip'),last=g.get('last'),pl=len(g.get('pl',[])),rl=len(g.get('rl',[])),sess=len(g.get('sessions',[])),
      itemsByLevel=dict(sorted(per.items(),key=lambda x:(x[0] is None,x[0]))),lc={k:(v['s'],v['g']) for k,v in sorted(g.get('lc',{}).items(),key=lambda x:int(x[0]))},hist={k:len(v) for k,v in sorted(g.get('hist',{}).items(),key=lambda x:int(x[0]))},
      sessL=sorted(set(x.get('L') for x in g.get('sessions',[]))),plL=sorted(set(x.get('lv') for x in g.get('pl',[]))),rlL=sorted(set(x.get('L') for x in g.get('rl',[]) if x.get('L'))),days=(sum(d.get('n',0) for d in g.get('days',{}).values()),sum(d.get('c',0) for d in g.get('days',{}).values())),mig=sorted((g.get('mig') or {}).keys())[-3:])
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8797/src/fretwise.html')
    B=json.loads(raw);A,C=run(pg,raw)
    print('page errors',errs)
    for k in GS:
        print('\n==',k);print(' before',summ(B['games'].get(k)));print(' after ',summ(A['games'].get(k)))
        b0=B['games'].get(k) or {};a0=A['games'].get(k) or {}
        for f in ['n','c','ms','time','pn','pc']:
            if (b0.get(f) or 0)!=(a0.get(f) or 0):print('  MISMATCH',f,b0.get(f),a0.get(f))
        for f in ['items','pl','rl','sessions','days','cf','rk','sp']:
            if len(b0.get(f) or [])!=len(a0.get(f) or []):print('  MISMATCH len',f)
    diff=[k for k in set(B['games'])|set(A['games']) if k not in GS and json.dumps(B['games'].get(k),sort_keys=True)!=json.dumps(A['games'].get(k),sort_keys=True)]
    print('\nother games changed:',diff)
    for k in diff:
        x=B['games'].get(k);y=A['games'].get(k)
        print('  ',k,'new game' if x is None else [f for f in set(x)|set(y) if json.dumps(x.get(f),sort_keys=True)!=json.dumps(y.get(f),sort_keys=True)])
    print('top-level keys changed:',[k for k in set(B)|set(A) if k!='games' and json.dumps(B.get(k),sort_keys=True)!=json.dumps(A.get(k),sort_keys=True)])
    print('second load a no-op:',json.dumps(A,sort_keys=True)==json.dumps(C,sort_keys=True))
    # made-up players: other frontiers, open levels above, a skip list, a per-level tempo
    def fake(gid,lvl,unl=(),skip=(),bpmL=None):
        S=json.loads(raw);g=S['games'].setdefault(gid,{});g.update(dict(lvl=lvl,unl=list(unl),skip=list(skip),last=lvl));g['mig']={k:v for k,v in (g.get('mig') or {}).items() if k!='r53'}
        if bpmL:g.setdefault('opts',{})['bpmL']=bpmL
        g.setdefault('hist',{})[str(lvl)]=[1,0,1];g.setdefault('lc',{})[str(lvl)]={'s':0,'g':3}
        A2,C2=run(pg,json.dumps(S));a=A2['games'][gid];return dict(lvl=a.get('lvl'),unl=a.get('unl'),skip=a.get('skip'),last=a.get('last'),hist=sorted(a.get('hist',{}).keys(),key=int)[-2:],lc=sorted(a.get('lc',{}).keys(),key=int)[-2:],bpmL=(a.get('opts') or {}).get('bpmL'),noop=json.dumps(A2,sort_keys=True)==json.dumps(C2,sort_keys=True))
    names=pg.evaluate("()=>({scales:GBY.scales.levels.map(l=>l.n),arp:GBY.arp.levels.map(l=>l.n)})");old=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'john_oldnames.json')))
    for k in GS:
        b0=B['games'].get(k) or {};a0=A['games'].get(k) or {}
        print(k,'frontier before',b0.get('lvl'),old[k][(b0.get('lvl') or 1)-1],'| after',a0.get('lvl'),names[k][(a0.get('lvl') or 1)-1],'| open before',[old[k][L-1] for L in b0.get('unl') or []],'after',[names[k][L-1] for L in a0.get('unl') or []],'| skip after',[(L,names[k][L-1]) for L in a0.get('skip') or []])
    print('\nmade-up players (old numbering -> new):')
    for args in [('scales',8,(),()),('scales',9,(10,),()),('scales',10,(),(9,)),('scales',11,(12,),()),('scales',12,(),()),('scales',16,(),(4,),{'9':60,'12':70,'16':80}),('arp',3,(),()),('arp',4,(5,),()),('arp',5,(),(4,)),('arp',14,(),(),{'4':60,'14':66})]:
        print(' ',args,'->',fake(*args))
    print('page errors',errs);b.close()
finally:srv.terminate()
