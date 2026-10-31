// Replays recordings/<take>.wav through a note detector and scores it against the notes the take asks for.
// Run: node tests/extract.js && node tests/replay.js [detector]   (detector: live = the app's current detector)
// Recordings come from Mic check → Record test takes (git-ignored, they stay on the machine that made them).
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(__dirname,'fw.js'),'utf8');

/* the takes and their expected notes, straight from the app */
const TAKES=eval(src.match(/const TAKES=(\[[\s\S]*?\]);\nlet REC/)[1]);
/* the pure detection functions (YIN, rms, segment) */
const det=(()=>{const a=src.indexOf('/* ===== pitch + note detection'),b=src.indexOf('if(typeof module!==');const module={exports:null};
  eval(src.slice(a,b)+'module.exports={yinPitch,rmsOf,segment,YIN_W};');return module.exports;})();

function readWav(f){const b=fs.readFileSync(f);let o=12,sr=0,data=null;
  while(o<b.length){const id=b.toString('ascii',o,o+4),n=b.readUInt32LE(o+4);if(id==='fmt ')sr=b.readUInt32LE(o+12);if(id==='data')data=b.subarray(o+8,o+8+n);o+=8+n+(n&1);}
  const x=new Float32Array(data.length/2);for(let i=0;i<x.length;i++)x[i]=data.readInt16LE(i*2)/32768;return {x,sr};}

/* the live app: one analysis frame every 1/60 s over the newest 2048 samples */
function live(x,sr){const frames=[],floor=[];let thr=0.006;const buf=new Float32Array(2048);
  for(let t=0;;t+=1000/60){const end=Math.floor(t/1000*sr);if(end>x.length)break;buf.fill(0);const s=Math.max(0,end-2048);buf.set(x.subarray(s,end),2048-(end-s));
    const r=det.rmsOf(buf);if(t<300){floor.push(r);const f=floor.slice().sort((a,b)=>a-b)[Math.floor(floor.length*0.2)]||0;thr=Math.max(0.005,f*2.5);}
    frames.push({rms:r,m:r>thr?det.yinPitch(buf,sr):null,t});}
  return det.segment(frames,thr).filter(n=>n.start>2).map(n=>({midi:n.midi,t:frames[n.start].t/1000,dur:(frames[n.end].t-frames[n.start].t)/1000,atk:n.atk}));}

/* edit-distance alignment of heard notes to expected ones */
function score(exp,got,same){const A=exp.length,B=got.length,D=Array.from({length:A+1},(_,a)=>Array.from({length:B+1},(_,b)=>a+b));
  for(let a=1;a<=A;a++)for(let b=1;b<=B;b++)D[a][b]=Math.min(D[a-1][b-1]+(same(exp[a-1],got[b-1])?0:1),D[a-1][b]+1,D[a][b-1]+1);
  let ok=0,wrong=0,missed=0,extra=0;for(let a=A,b=B;a>0||b>0;){if(a&&b&&D[a][b]===D[a-1][b-1]+(same(exp[a-1],got[b-1])?0:1)){same(exp[a-1],got[b-1])?ok++:wrong++;a--;b--;}else if(a&&D[a][b]===D[a-1][b]+1){missed++;a--;}else{extra++;b--;}}
  return {ok,wrong,missed,extra};}

const DET={live};const name=process.argv[2]||'live',fn=DET[name]||require(path.join(__dirname,'detectors',name+'.js'));
const nm=m=>['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'][((m%12)+12)%12]+(Math.floor(m/12)-1);
let tot={ok:0,wrong:0,missed:0,extra:0,pcok:0,n:0};
(async()=>{for(const t of TAKES){const f=path.join(root,'recordings',t.id+'.wav');if(!fs.existsSync(f)){console.log(t.id.padEnd(8),'no recording');continue;}
  const {x,sr}=readWav(f),notes=await fn(x,sr,t),got=notes.map(n=>n.midi);
  if(t.chords){console.log(t.id.padEnd(8),`${notes.length} notes`,notes.slice(0,24).map(n=>nm(n.midi)).join(' '));continue;}
  const s=score(t.exp,got,(a,b)=>a===b),p=score(t.exp,got,(a,b)=>((a-b)%12+12)%12===0);
  tot.ok+=s.ok;tot.wrong+=s.wrong;tot.missed+=s.missed;tot.extra+=s.extra;tot.pcok+=p.ok;tot.n+=t.exp.length;
  console.log(t.id.padEnd(8),`exact ${s.ok}/${t.exp.length}  note-name ${p.ok}/${t.exp.length}  wrong ${s.wrong} missed ${s.missed} extra ${s.extra}`.padEnd(64),'heard:',got.map(nm).join(' '));}
console.log(`\n${name}: exact ${tot.ok}/${tot.n}, note name ${tot.pcok}/${tot.n}, wrong ${tot.wrong}, missed ${tot.missed}, extra ${tot.extra}`);})();
