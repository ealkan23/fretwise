"""How close can two strums be? (26 Nov 2026, reading brief phase D: measured before the rhythms of Chart Reading were fixed.)
A timed strum question is built in the page (12 strums of Dm7 and G7 grips at C3 and above, the given spacing in beats, at the given tempo), its own take is rendered
as rolled plucked strings (as tests/john_player.py does: 12 ms between strings, each chord ringing into the next) and fed through the live listening path
(Basic Pitch, headless, muted). Prints, per case, whether the take passes, how many strums were heard and matched, and the worst offset.
Patterns: alt = the chord changes on every strum; same = four strums of one chord, then the other (slashes).
Run after build.py:  .venv/bin/python tests/strum_gap.py [bpm:gap:pattern[:roll] ...]   e.g. 60:0.5:alt:0.08 (roll = seconds between the strings of a strum, 0.012 by default)"""
import pathlib,sys,time
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent
CASES=sys.argv[1:] or [f'{b}:{g}:{p}' for b in (60,76) for g in (1,0.75,0.5) for p in ('alt','same')]
BUILD="""([bpm,gap,pat])=>{const g=G('repertoire');g.mode='play';g.opts=Object.assign({},g.opts||{},{auto:false});g.unl=Array.from({length:20},(_,i)=>i+1);view={name:'lobby',gid:'repertoire'};render();start('repertoire',9);
  const hi=v=>v.every(m=>m>=48),A=chordVoicings(P('D'),'m7').filter(hi)[0],B=chordVoicings(P('G'),'7').filter(hi).sort((x,y)=>Math.abs(x[0]-A[0])-Math.abs(y[0]-A[0]))[0],seq=[],grid=[];
  for(let i=0;i<12;i++){seq.push(pat==='alt'?(i%2?B:A):(Math.floor(i/4)%2?B:A));grid.push(+(i*gap).toFixed(3));}
  S.q=M({key:'gap-test',label:'gap',strumSeq:seq,strumAltSeq:seq.map(v=>[v]),target:seq.map(v=>v[0]),names:seq.map(()=>'x'),degs:seq.map((_,i)=>String(i+1)),hideTarget:false,maxNotes:12,metro:bpm,grid,prompt:'gap test',explain:'',answerText:''});
  S.locked=false;S.listening=false;S.micResult=null;render();return {A,B};}"""
SYN="""async (roll)=>{const q=S.q,beat=60/q.metro,t0=0.1+4*beat,ST=q.strumSeq,gt=i=>t0+q.grid[i]*beat,ev=ST.flatMap((ch,i)=>ch.map((m,j)=>({m,t:gt(i)+j*roll,nx:i+1<ST.length?gt(i+1):gt(i)+2,v:.2})));
  const end=ev.at(-1).t+3,sr=22050,oc=new OfflineAudioContext(1,Math.ceil(end*sr),sr);
  ev.forEach((x,i)=>{const f=440*Math.pow(2,(x.m-69)/12),nx=x.nx,len=Math.max(.1,Math.min(2.4,nx-x.t-.06)),g=oc.createGain();g.connect(oc.destination);
    g.gain.setValueAtTime(0,x.t);g.gain.linearRampToValueAtTime(x.v,x.t+.004);g.gain.setTargetAtTime(.0001,x.t+.004,.55);g.gain.setTargetAtTime(0,x.t+len,.012);
    for(let h=1;h<=6;h++){const o=oc.createOscillator(),hg=oc.createGain();o.frequency.value=f*h;hg.gain.value=1/(h*h*.8+.2)*(h===1?1:.6);o.connect(hg);hg.connect(g);o.start(x.t);o.stop(x.t+len+.1);}});
  const buf=await oc.startRendering(),c=Piano.ac();await c.resume();const sn=c.createBufferSource();sn.buffer=buf;const dest=c.createMediaStreamDestination();sn.connect(dest);MIC=dest.stream;
  const s2=c.createMediaStreamSource(MIC);AN=c.createAnalyser();AN.fftSize=2048;s2.connect(AN);BUF=new Float32Array(2048);window._sn=sn;window._fed=0;return {secs:+end.toFixed(1)};}"""
out=[]
with sync_playwright() as pw:
  b=pw.chromium.launch(channel='chrome',headless=True,args=['--autoplay-policy=no-user-gesture-required','--mute-audio','--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'])
  for C in CASES:
    P=C.split(':');bpm,gap,pat=int(P[0]),float(P[1]),P[2];roll=float(P[3]) if len(P)>3 else 0.012   # bpm:gap:pattern[:seconds between strings of the roll]
    pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto((root/'dist'/'fretwise.html').as_uri());pg.evaluate('localStorage.clear()');pg.reload()
    pg.evaluate('bpLoad()');pg.wait_for_function('BP.state!=="loading"',timeout=60000)
    ch=pg.evaluate(BUILD,[bpm,gap,pat]);pg.evaluate(SYN,roll)
    pg.evaluate("(()=>{const sg=strumGrade;strumGrade=(q,res)=>{window._st=(res.strums||[]).map(x=>[Math.round(x.t-(res.lat||0)-res.beatStart),x.db]);window._bs=res.beatStart;return sg(q,res);};})()");pg.evaluate("(()=>{const o=startListening;startListening=(...a)=>{const r=o(...a);if(!window._fed){window._fed=1;_sn.start();}return r;};})()")
    pg.wait_for_function('S&&!S.playing&&!S.loading',timeout=60000);pg.evaluate('micListen()')
    try:pg.wait_for_function("S&&S.micResult",timeout=120000)
    except Exception:print(C,'TIMEOUT',errs[:2],flush=True);pg.close();continue
    r=pg.evaluate("(()=>{const r=S.micResult;return {ok:r.ok,notesOk:r.notesOk,timeOk:r.timeOk,heard:r.strums,matched:r.per.filter(x=>x.ok).length,onTime:r.per.filter(x=>x.onTime).length,worst:Math.round(Math.max(0,...r.per.filter(x=>x.off!=null).map(x=>Math.abs(x.off)))),wrong:r.wrong}})()")
    out.append((C,r));print(C,f'{60/bpm*gap*1000:.0f} ms apart',r,errs[:1],flush=True)
    if '-v' in sys.argv[0:1] or True: print('   strums (ms after beat 1, dB):',pg.evaluate('window._st'));pg.close()
  b.close()
