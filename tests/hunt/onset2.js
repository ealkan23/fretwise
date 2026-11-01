const fs=require('fs'),{sets,picks,grade,rd,FPS}=require('./onsetproto.js');
/* loudness envelope at the model's frame rate, and how much it jumps at frame f */
function env(x,sr){const hop=sr/FPS,N=Math.floor(x.length/hop),e=new Float32Array(N);for(let i=0;i<N;i++){let q=0;const a=Math.floor(i*hop),b=Math.min(x.length,Math.floor((i+1)*hop));for(let j=a;j<b;j++)q+=x[j]*x[j];e[i]=Math.sqrt(q/(b-a))+1e-5;}return e;}
const jump=(e,f)=>{let after=0,before=1e9;for(let k=f-1;k<=f+4;k++)if(k>=0&&k<e.length)after=Math.max(after,e[k]);for(let k=f-10;k<=f-3;k++)if(k>=0)before=Math.min(before,e[k]);return after/(before===1e9?1e-5:before);};
module.exports={env,jump};
if(require.main===module){const raw={},E={};for(const s of sets){raw[s.id]=JSON.parse(fs.readFileSync('../../tests/out/bp/'+s.id+'.json','utf8'));const {x,sr}=rd(s.file);E[s.id]=env(x,sr);}
 const res=[];for(const thr of [0.2,0.3,0.4,0.5])for(const dist of [0.2,0.3])for(const jr of [1.3,1.6,2,2.5,3]){let pass=0,mi=0,ex=0;const bad=[];
  for(const s of sets){const h=picks(raw[s.id],new Set(s.exp.map(m=>m%12)),{thr,dist,win:0.12,harm:0.3}).filter(p=>jump(E[s.id],Math.round(p.t*FPS))>=jr).map(p=>p.midi),g=grade(s.exp,h);if(g.ok)pass++;else bad.push(`${s.id}(m${g.miss},x${g.extra})`);mi+=g.miss;ex+=g.extra;}
  res.push({o:{thr,dist,jr},pass,mi,ex,bad:bad.join(' ')});}
 res.sort((a,b)=>b.pass-a.pass||(a.mi+a.ex)-(b.mi+b.ex));for(const r of res.slice(0,8))console.log(JSON.stringify(r.o),`pass ${r.pass}/${sets.length}`,'miss',r.mi,'extra',r.ex,'|',r.bad);}
