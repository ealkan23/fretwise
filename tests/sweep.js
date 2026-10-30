// Generator sweep: every game, every level, every generator, 120 questions each.
// Checks choices contain the answer, multi/fret/tap/mic questions pass their own grader with a perfect answer,
// sound descriptors play only sane midis, every question has key/label/prompt/explain. Run: node tests/extract.js && node tests/sweep.js
const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'fw.js'),'utf8').split('/* ============ VIEWS ============ */')[0];
global.localStorage={getItem:()=>null,setItem(){}};global.window={};global.document={getElementById:()=>null,addEventListener(){}};global.navigator={};global.performance={now:()=>0};global.location={protocol:'file:'};global.requestAnimationFrame=()=>0;global.cancelAnimationFrame=()=>{};
const played=[];
eval(src.replace(/const Piano=\(\(\)=>\{[\s\S]*?\}\)\(\);/,"const Piano={note:(m,t,d,v)=>played.push(m),chord:(ms,t)=>played.push(...ms),tick(){},load(){return Promise.resolve()},ready:true,ac(){},now(){return 0}};")+`
S={gid:'fretboard',used:new Set()};let bad=0,cnt=0;
for(const g of GAMES){S.gid=g.id;g.levels.forEach((lv,li)=>lv.g.forEach(gen=>{for(let i=0;i<120;i++){let q;try{q=pickQ(g.id,li+1);}catch(e){bad++;if(bad<8)console.log('THROW',g.id,li+1,e.message,e.stack.split('\\n')[1]);break;}cnt++;
 try{
 if(q.ui==='choices'){if(!q.choices||!q.choices.includes(q.answer)||new Set(q.choices).size!==q.choices.length||q.choices.length<2)throw new Error('choices '+JSON.stringify(q.choices)+' ans='+q.answer);}
 if(q.ui==='multi'){if(!q.answer||!q.answer.length)throw new Error('multi empty');if(!check(q,q.answer))throw new Error('multi self-check');}
 if(q.ui==='fret'){if(!q.valid)throw new Error('no valid');const d=q.reveal.dots.find(x=>x.cls==='fb-ok');if(!d||!q.valid(d.s,d.f))throw new Error('fret self-check');}
 if(q.ui==='tap'){if(!q.onsets.length||!q.bpm)throw new Error('tap');const r=tapGrade(q,q.onsets.slice());if(!r.ok)throw new Error('tap self');const r2=tapGrade(q,q.onsets.map(x=>x+0.4));if(r2.ok)throw new Error('tap off');}
 if(q.ui==='mic'){const res={notes:q.target.map((m,i)=>({midi:m,mf:m,t:(q.grid?q.grid[i]:i)*750+3000})),firstAt:3000,beat:750,beatStart:3000};if(!micGrade(q,res).ok)throw new Error('mic self');}
 if(q.snd){played.length=0;playSnd(q,{sound:true});if(played.some(m=>isNaN(m)||m<20||m>108))throw new Error('snd '+JSON.stringify(q.snd).slice(0,80)+' '+played.slice(0,6));}
 if(q.audio){played.length=0;const d=q.audio();if(!(d>0))throw new Error('audio dur');}
 if(!q.explain||!q.prompt||!q.key||!q.label)throw new Error('missing fields');
 if(q.after)q.after();
 }catch(e){bad++;if(bad<25)console.log('BAD',g.id,li+1,q.key,e.message);}
}}));}
// play mode conversion
let conv=0;for(const id of PLAY_GAMES){G(id).mode='play';S.gid=id;GBY[id].levels.forEach((lv,li)=>lv.g.forEach(gen=>{for(let i=0;i<60;i++){let q;try{q=pickQ(id,li+1);}catch(e){bad++;break;}if(q.ui!=='mic')continue;conv++;
 try{if(!q.repeats)for(let k=1;k<q.target.length;k++)if(q.target[k]<=q.target[k-1])throw new Error('not ascending');
  if(q.repeats&&q.target.length!==q.answer.length)throw new Error('play all spots');
  const r=micGrade(q,{notes:q.target.map((m,i)=>({midi:m,mf:m,t:i*500}))});if(!r.ok)throw new Error('play self');
  if(/press <b>Done/.test(q.prompt))throw new Error('prompt');}catch(e){bad++;if(bad<25)console.log('BADPLAY',id,q.key,e.message);}}}));}
console.log('checked',cnt,'play-converted',conv,'bad',bad,'games',GAMES.length);
if(bad)process.exit(1);
`);
