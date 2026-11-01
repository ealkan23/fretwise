// Skipped-spot test: cuts single picks out of every Note Hunt take and checks the grading reports them missing (node skip2.js, ~10 min).
const fs=require('fs'),path=require('path'),bp=require('../../tests/detectors/basicpitch.js'),{sets,picks,grade,rd,FPS}=require('./onsetproto.js'),{env,jump}=require('./onset2.js');
const O={thr:0.5,dist:0.3,win:0.12,harm:0.3},gate=(E,p)=>{const j=jump(E,Math.round(p.t*FPS));return j>=4||(p.s>=0.8&&j>=1.2);};
/* grading as planned for the app: every spot must be picked; extra picks of the hunted note are ignored */
function gradeLenient(t,h){const g=grade(t,h);return {ok:g.miss===0,miss:g.miss};}
async function rawOf(x,sr){const r=await bp.infer(x,sr,null);return r;}
(async()=>{let caught=0,n=0,passOrig=0;const nc=[];
 for(const s of sets){const {x,sr}=rd(s.file),pcs=new Set(s.exp.map(m=>m%12));const raw=JSON.parse(fs.readFileSync('../../tests/out/bp/'+s.id+'.json','utf8')),E=env(x,sr);
  const P=picks(raw,pcs,O).filter(p=>gate(E,p));if(gradeLenient(s.exp,P.map(p=>p.midi)).ok)passOrig++;
  for(const k of [0,Math.floor(P.length/2)]){if(!P[k])continue;const t0=P[k].t,t1=P[k+1]?P[k+1].t-0.1:t0+1.5,y=x.slice();for(let i=Math.max(0,Math.floor((t0-0.15)*sr));i<Math.min(y.length,Math.floor(t1*sr));i++)y[i]=0;
   const r2=await rawOf(y,sr),E2=env(y,sr),P2=picks(r2,pcs,O).filter(p=>gate(E2,p)),g=gradeLenient(s.exp,P2.map(p=>p.midi));n++;if(!g.ok)caught++;else nc.push(`${s.id} pick ${k+1}`);process.stdout.write('.');}}
 console.log(`\noriginal takes pass ${passOrig}/${sets.length}; skipped spots caught ${caught}/${n}`+(nc.length?' — not caught: '+nc.join(', '):''));})();
