"""A simulated player through the live listening path for any guitar level (dist/, Basic Pitch on the GPU, headless and muted).
The question's own example (q.target at q.grid, count-in included) is rendered as a plucked take and fed to the microphone input; the app listens and grades.
Run after build.py:  .venv/bin/python tests/john_player.py game:level[:generator index] ...   (the right take must pass)"""
import pathlib,sys,time
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent
SYN="""async ()=>{const q=S.q,beat=60/q.metro,t0=0.1+4*beat,ev=q.target.map((m,i)=>({m,t:t0+(q.grid?q.grid[i]:i)*beat}));
  const end=ev.at(-1).t+3,sr=22050,oc=new OfflineAudioContext(1,Math.ceil(end*sr),sr);
  ev.forEach((x,i)=>{const f=440*Math.pow(2,(x.m-69)/12),nx=i+1<ev.length?ev[i+1].t:x.t+1.5,len=Math.max(.1,Math.min(1.2,nx-x.t-.02)),g=oc.createGain();g.connect(oc.destination);
    g.gain.setValueAtTime(0,x.t);g.gain.linearRampToValueAtTime(.32,x.t+.004);g.gain.setTargetAtTime(.0001,x.t+.004,.55);g.gain.setTargetAtTime(0,x.t+len,.012);
    for(let h=1;h<=6;h++){const o=oc.createOscillator(),hg=oc.createGain();o.frequency.value=f*h;hg.gain.value=1/(h*h*.8+.2)*(h===1?1:.6);o.connect(hg);hg.connect(g);o.start(x.t);o.stop(x.t+len+.1);}});
  const buf=await oc.startRendering(),c=Piano.ac();await c.resume();const sn=c.createBufferSource();sn.buffer=buf;const dest=c.createMediaStreamDestination();sn.connect(dest);MIC=dest.stream;
  const s2=c.createMediaStreamSource(MIC);AN=c.createAnalyser();AN.fftSize=2048;s2.connect(AN);BUF=new Float32Array(2048);window._sn=sn;window._fed=0;return {notes:ev.length,secs:+end.toFixed(1),bpm:q.metro,first:q.grid?q.grid[0]:0,key:q.key.slice(0,44)};}"""
with sync_playwright() as pw:
  b=pw.chromium.launch(channel='chrome',headless=True,args=['--autoplay-policy=no-user-gesture-required','--mute-audio','--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'])
  for A in sys.argv[1:]:
    p=A.split(':');gid=p[0];L=int(p[1]);gi=int(p[2]) if len(p)>2 else -1
    pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto((root/'dist'/'fretwise.html').as_uri());pg.evaluate('localStorage.clear()');pg.reload()
    pg.evaluate('bpLoad()');pg.wait_for_function('BP.state!=="loading"',timeout=60000)
    pg.evaluate("([gid,L,gi])=>{const g=G(gid);g.opts=Object.assign({},g.opts||{},{auto:false,vamp:false});g.review=false;g.preview=false;g.unl=Array.from({length:40},(_,i)=>i+1);if(gi>=0){const lv=GBY[gid].levels[L-1];lv.g=[lv.g[gi]];}view={name:'lobby',gid};render();start(gid,L);render();}",[gid,L,gi])
    info=pg.evaluate(SYN)
    pg.evaluate("(()=>{const o=startListening;startListening=(...a)=>{const r=o(...a);if(!window._fed){window._fed=1;_sn.start();}return r;};})()")
    pg.wait_for_function('S&&!S.playing&&!S.loading',timeout=60000);t=time.time();pg.evaluate('micListen()')
    try:pg.wait_for_function("S&&(S.locked||/Nothing heard/.test(S.micMsg||''))",timeout=120000)
    except Exception as e:print(A,info,'TIMEOUT',errs[:2],flush=True);pg.close();continue
    r=pg.evaluate("(()=>{const r=S.micResult||{};return {ok:!!(S.answers.at(-1)||{}).ok,notesOk:r.notesOk,timeOk:r.timeOk,miss:r.missN,wrong:r.wrongN,late:r.lateN,why:(r.walkWhy||[]).slice(0,3),heard:(r.per||[]).filter(x=>x.got!=null).length}})()")
    print(A,info,r,round(time.time()-t,1),errs[:2],'PASS' if r['ok'] else 'FAIL',flush=True);pg.close()
  b.close()
