// Note Hunt pick counting, prototype of bpHuntPicks: shared data and helpers. Run from tests/hunt/ after tests/read_fixlist.py.
const fs=require('fs'),bpRun=require('../../tests/detectors/basicpitch.js');
const reps=JSON.parse(fs.readFileSync('../../fixlist/reports.json','utf8')).filter(r=>r.audioFile&&r.ctx.game==='hunt');
const src=fs.readFileSync('../../tests/fw.js','utf8'),TAKES=eval(src.match(/const TAKES=(\[[\s\S]*?\]);\nlet REC/)[1]);
const sets=reps.map(r=>({id:'fix'+r.id,exp:r.ctx.mic.target,file:'fixlist/'+r.audioFile})).concat([{id:'hunt',exp:TAKES.find(t=>t.id==='hunt').exp,file:'recordings/hunt.wav'}]);
const FPS=22050/256;
function rd(f){const b=fs.readFileSync(f);let o=12,sr=0,d=null;while(o<b.length){const id=b.toString('ascii',o,o+4),n=b.readUInt32LE(o+4);if(id==='fmt ')sr=b.readUInt32LE(o+12);if(id==='data')d=b.subarray(o+8,o+8+n);o+=8+n+(n&1);}const x=new Float32Array(d.length/2);for(let i=0;i<x.length;i++)x[i]=d.readInt16LE(i*2)/32768;return {x,sr};}
/* picks of the hunted note from the onset head: per frame, the strongest onset over every octave of the hunted pitch class */
function picks(raw,pcs,o){const {frames,onsets}=raw,N=onsets.length,bins=[];for(let b=0;b<88;b++){const m=b+21;if(m>=40&&m<=88&&pcs.has(m%12))bins.push(b);}
  const s=onsets.map(r=>Math.max(...bins.map(b=>r[b]))),out=[],K=Math.round(o.win*FPS),D=Math.round(o.dist*FPS);let last=-1e9;
  for(let f=0;f<N;f++){if(s[f]<o.thr)continue;let pk=true;for(let k=Math.max(0,f-K);k<=Math.min(N-1,f+K);k++)if(s[k]>s[f]||(s[k]===s[f]&&k<f)){pk=false;break;}if(!pk||f-last<D)continue;last=f;
    // the octave: frame activation of the hunted bins just after the onset; lowest one that is at least half the strongest
    const act=bins.map(b=>{let a=0;for(let k=f;k<Math.min(N,f+8);k++)a+=frames[k][b];return {m:b+21,a:a/8};}),top=Math.max(...act.map(v=>v.a));
    const m=act.filter(v=>v.a>=top*o.harm).sort((a,b)=>a.m-b.m)[0].m;out.push({midi:m,t:f/FPS,s:s[f]});}
  return out;}
function grade(t,heard){const hit=(m,g)=>m===g||(m<53&&g===m+12),mc=(m,g)=>m===g?0:hit(m,g)?0.01:1,A=t.length,B=heard.length,D=Array.from({length:A+1},(_,a)=>Array.from({length:B+1},(_,b)=>a+b));
  for(let a=1;a<=A;a++)for(let b=1;b<=B;b++)D[a][b]=Math.min(D[a-1][b-1]+mc(t[a-1],heard[b-1]),D[a-1][b]+1,D[a][b-1]+1);
  let miss=0,extra=0;for(let a=A,b=B;a>0||b>0;){if(a&&b&&Math.abs(D[a][b]-(D[a-1][b-1]+mc(t[a-1],heard[b-1])))<1e-9){if(mc(t[a-1],heard[b-1])>=1)miss++;a--;b--;}else if(a&&Math.abs(D[a][b]-(D[a-1][b]+1))<1e-9){miss++;a--;}else{extra++;b--;}}
  return {ok:!miss&&!extra,miss,extra};}
module.exports={sets,picks,grade,rd,FPS};
if(require.main===module)(async()=>{const raw={};for(const s of sets){const {x,sr}=rd(s.file);await bpRun(x,sr,{id:s.id},{});raw[s.id]=JSON.parse(fs.readFileSync('../../tests/out/bp/'+s.id+'.json','utf8'));}
 const res=[];for(const thr of [0.15,0.2,0.25,0.3,0.4,0.5])for(const dist of [0.15,0.2,0.3])for(const win of [0.06,0.12])for(const harm of [0.3,0.5]){let pass=0,mi=0,ex=0;const bad=[];
  for(const s of sets){const h=picks(raw[s.id],new Set(s.exp.map(m=>m%12)),{thr,dist,win,harm}).map(p=>p.midi),g=grade(s.exp,h);if(g.ok)pass++;else bad.push(`${s.id}(m${g.miss},x${g.extra})`);mi+=g.miss;ex+=g.extra;}
  res.push({o:{thr,dist,win,harm},pass,mi,ex,bad:bad.join(' ')});}
 res.sort((a,b)=>b.pass-a.pass||(a.mi+a.ex)-(b.mi+b.ex));for(const r of res.slice(0,8))console.log(JSON.stringify(r.o),`pass ${r.pass}/${sets.length}`,'miss',r.mi,'extra',r.ex,'|',r.bad);})();
