"""Rhythm Dictation (25 Nov 2026): start every level of Rhythm Dictation and Rhythm Theory headless and muted on a copy of the user's store; for each Rhythm
Dictation level write the bar through the page's own buttons (value keys, dot, rest, triplet, tie, Check) and confirm it is marked right; screenshots of each
question and answer to tests/out/rd-*.png. With --text: ten sampled questions of every Rhythm Dictation level printed as text."""
import subprocess,time,json,pathlib,sys,re
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;raw=(root/'backups/store-before-dictation-2026-11-25.json').read_text()
KEYS="""()=>{const q=S.q,wu=q.wu||1,VK=['w','h','q','e','s'],plain=v=>VK.find(k=>Math.abs(RW_VAL[k]-v)<1e-6),dotted=v=>VK.find(k=>Math.abs(RW_VAL[k]*1.5-v)<1e-6),out=[];let inT=0;
  for(const e of q.answer.slice().sort((a,b)=>a.t-b.t)){const pre=e.rest?['rest']:[];if(e.tup){if(inT!==e.tup){out.push('trip');inT=e.tup;}out.push(...pre,plain(e.d/wu*1.5));continue;}inT=0;const v=e.d/wu;
    if(plain(v)){out.push(...pre,plain(v));continue;}if(dotted(v)){out.push(...pre,'dot',dotted(v));continue;}let r=v,f=true;while(r>1e-6){const k=VK.find(k=>RW_VAL[k]<=r+1e-6);out.push(...(e.rest?['rest']:f?[]:['tie']),k);r-=RW_VAL[k];f=false;}}return out;}"""
srv=subprocess.Popen(['python3','-m','http.server','8798'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
bad=0
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page(viewport={'width':1440,'height':1000});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8798/src/fretwise.html');pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload();pg.wait_for_timeout(1500)
    if '--text' in sys.argv:
      for L in range(1,17):
        print('==== Rhythm Dictation',L,pg.evaluate("L=>GBY.rhydict.levels[L-1].n",L))
        for i in range(10):
          t=pg.evaluate("L=>{const lv=GBY.rhydict.levels[L-1],g=lv.g[Math.floor(Math.random()*lv.g.length)],q=g();const x=s=>String(s).replace(/<[^>]+>/g,'');return [q.key,q.rdBpm,q.meter,q.bars,q.swing?'swing':'',q.answerText,x(q.explain),x(q.prompt),x(q.hint)];}",L)
          print(' ',t[0],'|',t[1],'bpm | M',t[2],'bars',t[3],t[4],'|',t[5],'|',t[6]);
          if i==0:print('    prompt:',t[7]);print('    hint:',t[8])
      b.close();sys.exit(0)
    for gid,n in (('rhytheory',8),('rhydict',16)):
      r=pg.evaluate("gid=>{const g=G(gid);g.review=false;g.preview=false;view={name:'lobby',gid};render();const h=document.getElementById('app').innerHTML.replace(/data-[a-z]+=\"[^\"]*\"/g,'');return /\\bundefined\\b|\\bNaN\\b/.test(h)?'BAD lobby':'lobby ok';}",gid);print(gid,r)
      for L in range(1,n+1):
        for k in range(len(pg.evaluate("([gid,L])=>GBY[gid].levels[L-1].g.map(()=>1)",[gid,L]))):
          r=pg.evaluate("([gid,L,k])=>{try{start(gid,L);let tr=0;while(S.q.lv!==L||(GBY[gid].levels[L-1].g.length>1&&S.genIx!==undefined&&S.genIx!==k)){if(++tr>1)break;}render();const h=document.getElementById('app').innerHTML.replace(/data-[a-z]+=\"[^\"]*\"/g,'');return [S.q.key,S.q.label,/\\bundefined\\b|\\bNaN\\b/.test(h)?'BAD':'ok',S.q.lv===L?1:0,S.q.ui];}catch(e){return ['ERR',e.message,'BAD',0,''];}}",[gid,L,k])
          if r[2]!='ok' or r[3]!=1:print('  !!',gid,L,r);bad+=1
          pg.screenshot(path=str(root/f'tests/out/rd-{gid}-{L}-{k+1}q.png'),full_page=True)
          if gid=='rhydict':
            keys=pg.evaluate(KEYS)
            for key in keys:
              sel=f'[data-act=rwt][data-v={key}]' if key in ('dot','rest','trip','tie') else f'[data-act=rwv][data-v={key}]'
              pg.click(sel)
            pg.click('[data-act=rwcheck]');pg.wait_for_timeout(150)
            ok=pg.evaluate("()=>{const a=S.answers.at(-1);return a?a.ok:null}")
            print(' ',gid,L,k+1,r[0],'|',r[1],'| keys',' '.join(keys),'|','RIGHT' if ok else 'WRONG')
            if not ok:bad+=1
            pg.screenshot(path=str(root/f'tests/out/rd-{gid}-{L}-{k+1}a.png'),full_page=True)
          else:print(' ',gid,L,r[0],'|',r[1],'|',r[4])
          pg.evaluate("()=>{try{Piano.tickStop()}catch(e){};view={name:'home'};S=null;render();}")
    print('page errors',errs[:5]);b.close()
finally:srv.terminate()
print('BAD',bad)
