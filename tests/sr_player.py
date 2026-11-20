"""Sight Reading: a simulated player through the live listening path (dist/, Basic Pitch on the GPU, headless and muted).
A plucked-string take of the question is rendered in the page at the question's own tempo and grid (count-in included) and fed to the microphone input;
the app listens, detects and grades as it does with a guitar. Right notes on time must pass; a road map read straight through (a wrong turn) must fail.
Run after build.py:  .venv/bin/python tests/sr_player.py [level ...]"""
import pathlib,sys,time
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent
LV=[a for a in sys.argv[1:]] or ['3','10','17','25','26','27','28','29']   # '29@140' = level 29 at 140 bpm
SYN="""async ([mode,bpmSet])=>{const q=S.q,beat=60/q.metro,t0=0.1+4*beat;let ev=[];
  if(mode==='wrongturn'){const w=[];q.sr.bars.forEach((b,bi)=>b.ev.forEach(e=>{if(!e.rest&&!e.tieFrom)w.push({m:e.m,bar:bi,t:e.t});}));ev=w.slice(0,q.target.length).map((x,i)=>({m:x.m,t:t0+q.grid[i]*beat}));}
  else if(q.sr.srcs.some(s=>Array.isArray(s))){const d=scoreData(q.sr.bars),bt=SC_METER[q.sr.bars[0].m].beat;let st=0;const starts=q.sr.bars.map(b=>{const x=st;st+=b.len;return x;});ev=d.map(x=>({m:x.m,t:t0+((starts[x.bar-1]+x.beat-1)/bt)*beat}));}   /* a tune: every written note, repeated ones too */
  else ev=q.target.map((m,i)=>({m,t:t0+q.grid[i]*beat}));
  const end=ev.at(-1).t+3,sr=22050,oc=new OfflineAudioContext(1,Math.ceil(end*sr),sr);
  ev.forEach((x,i)=>{const f=440*Math.pow(2,(x.m-69)/12),nx=i+1<ev.length?ev[i+1].t:x.t+1.5,len=Math.max(.12,nx-x.t-.02),g=oc.createGain();g.connect(oc.destination);
    g.gain.setValueAtTime(0,x.t);g.gain.linearRampToValueAtTime(.32,x.t+.004);g.gain.setTargetAtTime(.0001,x.t+.004,.55);g.gain.setTargetAtTime(0,x.t+len,.012);
    for(let h=1;h<=6;h++){const o=oc.createOscillator(),hg=oc.createGain();o.frequency.value=f*h;hg.gain.value=1/(h*h*.8+.2)*(h===1?1:.6);o.connect(hg);hg.connect(g);o.start(x.t);o.stop(x.t+len+.1);}});
  const buf=await oc.startRendering(),c=Piano.ac();await c.resume();const sn=c.createBufferSource();sn.buffer=buf;const dest=c.createMediaStreamDestination();sn.connect(dest);MIC=dest.stream;
  const s2=c.createMediaStreamSource(MIC);AN=c.createAnalyser();AN.fftSize=2048;s2.connect(AN);BUF=new Float32Array(2048);window._sn=sn;window._fed=0;return {notes:ev.length,secs:+end.toFixed(1),bpm:q.metro,targets:q.target.length};}"""
res=[]
with sync_playwright() as pw:
  b=pw.chromium.launch(channel='chrome',headless=True,args=['--autoplay-policy=no-user-gesture-required','--mute-audio','--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'])
  for LA in LV:
    L=int(LA.split('@')[0]);BPM=int(LA.split('@')[1]) if '@' in LA else None
    for mode in (['right','wrongturn'] if L==28 else ['right']):
      pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      pg.goto((root/'dist'/'fretwise.html').as_uri());pg.evaluate('localStorage.clear()');pg.reload()
      pg.evaluate('bpLoad()');pg.wait_for_function('BP.state!=="loading"',timeout=60000)
      pg.evaluate("([L,B])=>{const g=G('sightread');g.opts=Object.assign({},g.opts||{},{auto:false});g.review=false;g.preview=false;g.unl=Array.from({length:29},(_,i)=>i+1);if(B)g.opts.bpmL={[L]:B};view={name:'lobby',gid:'sightread'};render();start('sightread',L);render();}",[L,BPM])
      info=pg.evaluate(SYN,[mode,None])
      pg.evaluate("(()=>{const o=startListening;startListening=(...a)=>{const r=o(...a);if(!window._fed){window._fed=1;_sn.start();}return r;};})()")
      t=time.time();pg.evaluate('micListen()')
      try:pg.wait_for_function("S&&(S.locked||/Nothing heard/.test(S.micMsg||''))",timeout=400000)
      except Exception as e:res.append((L,mode,info,'TIMEOUT',errs[:2]));pg.close();continue
      r=pg.evaluate("(()=>{const r=S.micResult||{};return {ok:!!(S.answers.at(-1)||{}).ok,notesOk:r.notesOk,timeOk:r.timeOk,miss:r.missN,wrong:r.wrongN,late:r.lateN,lateMax:r.lateMax,missMax:r.missMax,extra:(r.extra||[]).length,key:S.q.key.slice(0,40)}})()")
      want=(mode=='right');res.append((L,mode,info,r,round(time.time()-t,1),errs[:2],'AS EXPECTED' if r['ok']==want else 'UNEXPECTED'))
      print(res[-1],flush=True);pg.close()
  b.close()
print('\n'.join(str(x) for x in res))
