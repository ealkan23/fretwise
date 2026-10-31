// Basic Pitch tuned for single-note guitar: one note per pick, overtones and room noise dropped.
const bpRun=require('./basicpitch.js');
const DEF={onset:0.6,frame:0.4,minLen:8,amp:0.3,group:0.08,harm:0.4,lo:40,hi:88};
/* notes: Basic Pitch events; keeps, for each cluster of starts within `group` s, the lowest note at least `harm` × the loudest */
function mono(ev,o){const ns=ev.filter(n=>n.midi>=o.lo&&n.midi<=o.hi&&n.amp>=o.amp).sort((a,b)=>a.t-b.t);const out=[];
  for(let i=0;i<ns.length;){const g=[ns[i]];let j=i+1;while(j<ns.length&&ns[j].t-ns[i].t<=o.group)g.push(ns[j++]);i=j;
    const top=Math.max(...g.map(n=>n.amp)),pick=g.filter(n=>n.amp>=top*o.harm).sort((a,b)=>a.midi-b.midi)[0];
    /* a later onset that is an overtone (octave, 12th, 2 octaves) of a note still ringing louder is not a new note */
    const prev=out.at(-1);if(prev&&pick.t<prev.t+prev.dur&&[12,19,24].includes(pick.midi-prev.midi)&&pick.amp<prev.amp)continue;
    out.push(pick);}
  return out;}
module.exports=async(x,sr,take,opt={})=>{const o={...DEF,...opt};return mono(await bpRun(x,sr,take,o),o);};
module.exports.DEF=DEF;module.exports.mono=mono;
