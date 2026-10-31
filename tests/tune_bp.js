// Grid-searches Basic Pitch thresholds + the guitar filter on the recordings. Run after `node tests/replay.js bpmono` has cached the model output.
const fs=require('fs'),path=require('path');const bpRun=require('./detectors/basicpitch.js'),{mono,DEF}=require('./detectors/bpmono.js');
const src=fs.readFileSync(path.join(__dirname,'fw.js'),'utf8'),TAKES=eval(src.match(/const TAKES=(\[[\s\S]*?\]);\nlet REC/)[1]).filter(t=>!t.chords);
function score(exp,got){const A=exp.length,B=got.length,D=Array.from({length:A+1},(_,a)=>Array.from({length:B+1},(_,b)=>a+b));
  for(let a=1;a<=A;a++)for(let b=1;b<=B;b++)D[a][b]=Math.min(D[a-1][b-1]+(exp[a-1]===got[b-1]?0:1),D[a-1][b]+1,D[a][b-1]+1);
  let w=0,m=0,e=0;for(let a=A,b=B;a>0||b>0;){if(a&&b&&D[a][b]===D[a-1][b-1]+(exp[a-1]===got[b-1]?0:1)){if(exp[a-1]!==got[b-1])w++;a--;b--;}else if(a&&D[a][b]===D[a-1][b]+1){m++;a--;}else{e++;b--;}}return {w,m,e};}
(async()=>{const res=[];
 for(const onset of [0.4,0.5,0.6,0.7,0.8])for(const frame of [0.3,0.4,0.5])for(const minLen of [5,8,11,15]){
  const evs={};for(const t of TAKES)evs[t.id]=await bpRun(null,0,t,{onset,frame,minLen});
  for(const amp of [0.2,0.3,0.4,0.5])for(const harm of [0.3,0.5,0.7])for(const group of [0.05,0.08,0.12]){const o={...DEF,onset,frame,minLen,amp,harm,group};let W=0,M=0,E=0;const per={};
   for(const t of TAKES){const s=score(t.exp,mono(evs[t.id],o).map(n=>n.midi));W+=s.w;M+=s.m;E+=s.e;per[t.id]=s.w+s.m+s.e;}
   res.push({o:{onset,frame,minLen,amp,harm,group},W,M,E,cost:2*W+2*M+E,per});}}
 res.sort((a,b)=>a.cost-b.cost);for(const r of res.slice(0,8))console.log(JSON.stringify(r.o),'wrong',r.W,'missed',r.M,'extra',r.E,'| per take',JSON.stringify(r.per));
 const d=res.find(r=>JSON.stringify(r.o)===JSON.stringify({onset:DEF.onset,frame:DEF.frame,minLen:DEF.minLen,amp:DEF.amp,harm:DEF.harm,group:DEF.group}));if(d)console.log('current defaults: wrong',d.W,'missed',d.M,'extra',d.E);})();
