"""Rhythm Dictation (25 Nov 2026): the move out of Rhythm Theory, run on a copy of the user's store (backups/store-before-dictation-2026-11-25.json), headless and
muted. Prints every total before = Rhythm Theory after + Rhythm Dictation after, checks every other game byte-identical, the only new top-level key rd1, and that a
second load changes nothing. Then two made-up players: one who had passed old Dictation I and II (frontier old 7, old 9 opened), and one with "all levels open" on."""
import subprocess,time,json,pathlib,copy
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/'backups/store-before-dictation-2026-11-25.json').read_text()
JS="""()=>{GAMES.forEach(x=>G(x.id));saveLocal();return localStorage.getItem('fretwise-v1');}"""
def run(pg,store):
  pg.goto('http://localhost:8796/src/fretwise.html');pg.evaluate("r=>{localStorage.clear();localStorage.setItem('fretwise-v1',r)}",store);pg.reload();pg.wait_for_timeout(1500)
  a=pg.evaluate(JS);pg.reload();pg.wait_for_timeout(1500);b=pg.evaluate(JS);return json.loads(a),json.loads(b)
def summ(g):
  if not g:return None
  return dict(n=g.get('n'),c=g.get('c'),items=len(g.get('items',{})),lvl=g.get('lvl'),last=g.get('last'),unl=g.get('unl'),unl0=g.get('unl0'),skip=g.get('skip'),pl=len(g.get('pl',[])),rl=len(g.get('rl',[])),sess=len(g.get('sessions',[])),time=g.get('time'),
    lc={k:(v['s'],v['g']) for k,v in sorted(g.get('lc',{}).items(),key=lambda x:int(x[0]))},hist={k:len(v) for k,v in g.get('hist',{}).items()})
def check(B,A,C,label):
  print('=====',label);s0=B['games']['rhytheory'];s1=A['games']['rhytheory'];t1=A['games']['rhydict'];ok=True
  print('BEFORE rhytheory',summ(s0));print('AFTER  rhytheory',summ(s1));print('AFTER  rhydict  ',summ(t1))
  for f in ['n','c','ms','pn','pc','time']:
    x=(s1.get(f) or 0)+(t1.get(f) or 0);y=s0.get(f) or 0;good=abs(x-y)<1e-6;ok&=good;print(' ',f,y,'=',s1.get(f),'+',t1.get(f),'ok' if good else 'MISMATCH')
  for f in ['pl','sessions','rl']:
    good=len(s0.get(f,[]))==len(s1.get(f,[]))+len(t1.get(f,[]));ok&=good;print(' ',f,len(s0.get(f,[])),'=',len(s1.get(f,[])),'+',len(t1.get(f,[])),'ok' if good else 'MISMATCH')
  good=len(s0['items'])==len(s1['items'])+len(t1['items']);ok&=good;print('  items',len(s0['items']),'=',len(s1['items']),'+',len(t1['items']),'ok' if good else 'MISMATCH')
  itn=lambda g:sum(i.get('n',0) for i in g['items'].values());good=itn(s0)==itn(s1)+itn(t1);ok&=good;print('  answers in items',itn(s0),'=',itn(s1),'+',itn(t1),'ok' if good else 'MISMATCH')
  lcs=lambda g:sum(v.get('s',0)+v.get('g',0) for v in g.get('lc',{}).values());good=lcs(s0)==lcs(s1)+lcs(t1);ok&=good;print('  per-level counts',lcs(s0),'=',lcs(s1),'+',lcs(t1),'ok' if good else 'MISMATCH')
  dd=lambda g,f:sum(d.get(f,0) for d in g.get('days',{}).values())
  for f in ['n','c','ms','dur']:
    good=abs(dd(s1,f)+dd(t1,f)-dd(s0,f))<1e-6;ok&=good;print('  days',f,dd(s0,f),'=',dd(s1,f),'+',dd(t1,f),'ok' if good else 'MISMATCH')
  diff=[k for k in B['games'] if k not in ('rhytheory','rhydict') and json.dumps(B['games'][k],sort_keys=True)!=json.dumps(A['games'].get(k),sort_keys=True)]
  print('  other games changed:',diff);ok&=not diff
  tl=[k for k in set(B)|set(A) if k!='games' and json.dumps(B.get(k),sort_keys=True)!=json.dumps(A.get(k),sort_keys=True)];print('  top-level keys changed:',tl);ok&=tl==['rd1']
  nop=json.dumps(A,sort_keys=True)==json.dumps(C,sort_keys=True);print('  second load no-op:',nop);ok&=nop
  print('  RESULT',label,'OK' if ok else 'FAIL');return ok
srv=subprocess.Popen(['python3','-m','http.server','8796'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    B=json.loads(raw);A,C=run(pg,raw);r1=check(B,A,C,"the user's store")
    print('  hl rhytheory (highlights):',len((B.get('hl') or {}).get('rhytheory',[])))
    # made-up player 1: passed old Dictation I and II, frontier old 7, old 9 opened, a round and log entries on old 6 and 9
    B2=copy.deepcopy(B);g=B2['games']['rhytheory'];g['lvl']=7;g['last']=6;g['unl']=[9];g['lc']['6']={'s':20,'g':0};g['lc']['9']={'s':4,'g':0};g['n']+=24;g['c']+=20;g['hist']['6']=[1]*20;g['hist']['9']=[1,0,1,1]
    g['items']['kfake6']={'n':20,'c':18,'w':2,'h':0,'ms':40000,'lv':6,'l':'write: 1 2& 3'};g['items']['kfake9']={'n':4,'c':2,'w':2,'h':0,'ms':9000,'lv':9,'l':'write: 1e&a'};g['ms']+=49000
    t0=max(s['t'] for s in g['sessions'])+86400000;g['sessions'].append({'t':t0,'L':6,'n':20,'c':18,'ms':2000,'dur':300000});g['time']+=300000
    g['pl']=[{'t':t0,'lv':6,'k':'kfake6','ok':1},{'t':t0+1,'lv':9,'k':'kfake9','ok':0}];import datetime
    dk=datetime.datetime.fromtimestamp(t0/1000).strftime('%Y-%m-%d');g['days'][dk]={'n':22,'c':19,'ms':40000,'dur':300000}
    A2,C2=run(pg,json.dumps(B2));r2=check(B2,A2,C2,'made-up player 1 (old Dictation I and II passed, frontier old 7, old 9 open)')
    # made-up player 2: all levels open, the honest list put aside
    B3=copy.deepcopy(B);B3['openAll']=True;g=B3['games']['rhytheory'];g['oa']=1;g['unl0']=[6];g['unl']=[5,6,7,8,9,10,11,12]
    A3,C3=run(pg,json.dumps(B3))
    print('===== made-up player 2 (all levels open)')
    for gid in ('rhytheory','rhydict'):print(' ',gid,summ(A3['games'][gid]))
    s3=A3['games']['rhytheory'];t3=A3['games']['rhydict']
    r3=s3['lvl']==4 and s3.get('unl0')==[] and s3['unl']==[5,6,7,8] and t3['lvl']==1 and t3.get('unl0')==[8] and t3['unl']==list(range(2,17)) and json.dumps(A3,sort_keys=True)==json.dumps(C3,sort_keys=True)
    print('  RESULT made-up player 2','OK' if r3 else 'FAIL')
    print('page errors',errs[:5]);b.close()
finally:srv.terminate()
print('ALL OK' if (r1 and r2 and r3 and not errs) else 'SOMETHING FAILED')
