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
 if(q.ui==='mic'&&q.bend){/* a clean curve of the asked technique must pass; a flat note must fail (except plain vibrato, where a flat note is the failure) */
   const K=BEND_KIND[q.bend],c=[],flat=[];for(let ms=0;ms<=3200;ms+=1000/60){const t=ms;let v;
     if(q.bend==='vibrato')v=30*Math.sin(2*Math.PI*5.5*t/1000);else if(q.bend==='prebend')v=t<800?K.c:t<1100?K.c*(1-(t-800)/300):0;
     else{v=t<150?0:t<450?K.c*(t-150)/300:K.c;if(q.bend==='release'&&t>1700)v=t<2000?K.c*(1-(t-1700)/300):0;if(q.bend==='bendvib'&&t>=450)v+=25*Math.sin(2*Math.PI*5.5*t/1000);}
     c.push({t:300+t,m:q.bendStart+v/100});flat.push({t:300+t,m:q.bendStart});}
   if(!micGrade(q,{curve:c}).ok)throw new Error('bend self '+q.bend);if(micGrade(q,{curve:flat}).ok)throw new Error('bend flat passes '+q.bend);}
 else if(q.ui==='mic'&&q.strumSeq&&q.strumSeq.length>1){const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;};
   if(!micGrade(q,{strums:q.strumSeq.map((v,i)=>({t:i*900,act:act(v)}))}).ok)throw new Error('doubles self');
   if(micGrade(q,{strums:q.strumSeq.slice(0,-1).map((v,i)=>({t:i*900,act:act(v)}))}).ok)throw new Error('doubles missing one passes');
   const w=q.strumSeq.map(v=>v.slice());w[1][1]+=1;if(micGrade(q,{strums:w.map((v,i)=>({t:i*900,act:act(v)}))}).ok)throw new Error('doubles wrong note passes');}
 else if(q.ui==='mic'){const res={notes:q.target.map((m,i)=>({midi:m,mf:m,t:(q.grid?q.grid[i]:i)*750+3000})),firstAt:3000,beat:750,beatStart:3000};if(!micGrade(q,res).ok)throw new Error('mic self');}
 if(q.snd){played.length=0;playSnd(q,{sound:true});if(played.some(m=>isNaN(m)||m<20||m>108))throw new Error('snd '+JSON.stringify(q.snd).slice(0,80)+' '+played.slice(0,6));}
 if(q.audio){played.length=0;const d=q.audio();if(!(d>0))throw new Error('audio dur');}
 if(q.ui==='spell'){if(!Array.isArray(q.answer)||q.answer.length!==q.need||!check(q,q.answer.slice()))throw new Error('spell self '+q.answer);
   const w=q.answer.slice();w[w.length-1]=w[w.length-1][0]==='C'?'D':'C';if(check(q,w))throw new Error('spell wrong passes');
   if(q.answer.some(n=>/[𝄪𝄫]/.test(n)))throw new Error('double accidental '+q.answer);}
 if(!q.explain||!q.prompt||!q.key||!q.label)throw new Error('missing fields');
 /* no program text, undefined, NaN or unknown quality may reach the player (the triadQ name clash, Nov 2026) */
 {const txt=[q.prompt,q.explain,q.label,q.answerText,JSON.stringify(q.answer),JSON.stringify(q.choices||[])].join(' | ');
  if(/=>|function *[(]|undefined|NaN|[[]object /.test(txt))throw new Error('leaked code/undefined in text: '+txt.slice(0,160));
  if(/[A-G][♯♭#b]?[?]/.test(String(q.answerText||q.answer)+' '+JSON.stringify(q.choices||[])+' '+String(q.label)))throw new Error('unknown chord quality: '+String(q.label).slice(0,60));}
 if(q.after)q.after();
 }catch(e){bad++;if(bad<400)console.log('BAD',g.id,li+1,q.key,e.message);}
}}));}
// play mode conversion
let conv=0;for(const id of PLAY_GAMES){G(id).mode='play';S.gid=id;GBY[id].levels.forEach((lv,li)=>lv.g.forEach(gen=>{for(let i=0;i<60;i++){let q;try{q=pickQ(id,li+1);}catch(e){bad++;break;}if(q.ui!=='mic')continue;conv++;
 try{if(q.play&&!q.repeats&&!q.strumSeq)for(let k=1;k<q.target.length;k++)if(q.target[k]<=q.target[k-1])throw new Error('not ascending');   // converted marking questions only; lines in time are melodies
  if(q.repeats&&q.target.length!==q.answer.length)throw new Error('play all spots');
  if(q.strumSeq){const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;};
    if(!micGrade(q,{strums:q.strumSeq.map((v,i)=>({t:i*900,act:act(v)}))}).ok)throw new Error('strum self');
    const w=q.strumSeq[0].slice();const k=w.findIndex(m=>m>=48);if(k>=0){w[k]+=1;if(micGrade(q,{strums:[{t:0,act:act(w)}]}).ok)throw new Error('strum one-off passes');}}
  else{const r=micGrade(q,{notes:q.target.map((m,i)=>({midi:m,mf:m,atk:true,t:3000+(q.grid?q.grid[i]:i)*750})),beat:750,beatStart:3000});if(!r.ok)throw new Error('play self');}
  if(/press <b>Done/.test(q.prompt))throw new Error('prompt');}catch(e){bad++;if(bad<400)console.log('BADPLAY',id,q.key,e.message);}}}));}
console.log('checked',cnt,'play-converted',conv,'bad',bad,'games',GAMES.length);
if(bad)process.exit(1);
`);
