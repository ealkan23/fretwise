// Generator sweep: every game, every level, every generator, 120 questions each.
// Checks choices contain the answer, multi/fret/tap/mic questions pass their own grader with a perfect answer,
// sound descriptors play only sane midis, every question has key/label/prompt/explain. Run: node tests/extract.js && node tests/sweep.js
const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'fw.js'),'utf8').split('/* ============ VIEWS ============ */')[0];
global.localStorage={getItem:()=>null,setItem(){}};global.window={};global.document={getElementById:()=>null,addEventListener(){}};global.navigator={};global.performance={now:()=>0};global.location={protocol:'file:'};global.requestAnimationFrame=()=>0;global.cancelAnimationFrame=()=>{};
const played=[];
eval(src.replace(/const Piano=\(\(\)=>\{[\s\S]*?\}\)\(\);/,"const Piano={note:(m,t,d,v)=>played.push(m),chord:(ms,t)=>played.push(...ms),tick(){},load(){return Promise.resolve()},ready:true,ac(){},now(){return 0}};")+`
S={gid:'fretboard',used:new Set()};let bad=0,cnt=0;
/* one input per game: every level must exist in at least one mode; the sweep runs each level in a mode that has it */
const setMode=(id,gm)=>{const gg=G(id);gg.mode=gm?'play':'mark';gg.opts=gg.opts||{};gg.opts.tapMic=gm;};
for(const g of GAMES){S.gid=g.id;g.levels.forEach((lv,li)=>{setMode(g.id,false);if(!levelAvail(g.id,li+1)){setMode(g.id,true);if(!levelAvail(g.id,li+1)){bad++;console.log('NO MODE',g.id,li+1);}}});setMode(g.id,false);
 g.levels.forEach((lv,li)=>{for(const gm of [false,true]){setMode(g.id,gm);if(!levelAvail(g.id,li+1))continue;
  for(let i=0;i<150;i++){const q=pickQ(g.id,li+1);if(isGuitarQ(q,g.id)!==guitarMode(g.id)){bad++;console.log('MIXED INPUT',g.id,li+1,q.ui,guitarMode(g.id));break;}}}});setMode(g.id,false);}
for(const g of GAMES){S.gid=g.id;g.levels.forEach((lv,li)=>lv.g.forEach(gen=>{{const gg=G(g.id);gg.mode='mark';gg.opts=gg.opts||{};gg.opts.tapMic=false;if(!levelAvail(g.id,li+1)){gg.mode='play';gg.opts.tapMic=true;}}for(let i=0;i<120;i++){let q;try{q=pickQ(g.id,li+1);}catch(e){bad++;if(bad<8)console.log('THROW',g.id,li+1,e.message,e.stack.split('\\n')[1]);break;}cnt++;
 try{
 if(q.ui==='choices'){if(!q.choices||!q.choices.includes(q.answer)||new Set(q.choices).size!==q.choices.length||q.choices.length<2)throw new Error('choices '+JSON.stringify(q.choices)+' ans='+q.answer);}
 if(q.ui==='multi'){if(!q.answer||!q.answer.length)throw new Error('multi empty');if(!check(q,q.answer))throw new Error('multi self-check');}
 if(q.ui==='fret'){if(!q.valid)throw new Error('no valid');const d=q.reveal.dots.find(x=>x.cls==='fb-ok');if(!d||!q.valid(d.s,d.f))throw new Error('fret self-check');}
 if(g.tap&&q.ui!=='tap')throw new Error('a tap game asked a '+q.ui+' question (kinetic and paper never mix)');
 if(q.ui==='tap'){if(!q.onsets.length||!q.bpm)throw new Error('tap');const r=tapGrade(q,q.onsets.map(o=>o+((q.feel||0)/1000)/(60/q.bpm)));if(!r.ok)throw new Error('tap self');const r2=tapGrade(q,q.onsets.map(x=>x+0.4));if(r2.ok)throw new Error('tap off');}
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
 else if(q.ui==='mic'&&q.strumSeq){const a={};for(let m=40;m<=88;m++)a[m]=0.02;q.strumSeq[0].forEach(m=>a[m]=0.7);if(!micGrade(q,{strums:[{t:0,act:a}]}).ok)throw new Error('strum self (one chord)');}
 else if(q.ui==='mic'){const res={notes:q.target.map((m,i)=>({midi:m,mf:m,t:(q.grid?q.grid[i]:i)*750+3000})),firstAt:3000,beat:750,beatStart:3000};if(!micGrade(q,res).ok)throw new Error('mic self');}
 if(q.snd){played.length=0;playSnd(q,{sound:true});if(played.some(m=>isNaN(m)||m<20||m>108))throw new Error('snd '+JSON.stringify(q.snd).slice(0,80)+' '+played.slice(0,6));}
 if(q.audio){played.length=0;const d=q.audio();if(!(d>0))throw new Error('audio dur');}
 if(q.ui==='rhywrite'){if(!Array.isArray(q.answer)||!check(q,q.answer.map(e=>({...e}))))throw new Error('rhywrite self '+q.key);const M=q.meter,w=[{t:0,d:q.bars*M}];if(check(q,w)&&!(q.answer.length===1&&!q.answer[0].rest))throw new Error('rhywrite wrong accepted '+q.key);const sh=q.answer.map((e,i)=>({...e}));if(sh.length>1){const a=sh[0],b=sh[1];if(!a.rest&&!b.rest&&a.d!==b.d){const t=a.d;a.d=b.d;b.d=t;b.t=a.d;if(check(q,sh))throw new Error('rhywrite swapped accepted '+q.key);}}}
 if(q.ui==='spell'){if(!Array.isArray(q.answer)||q.answer.length!==q.need||!check(q,q.answer.slice()))throw new Error('spell self '+q.answer);
   const w=q.answer.slice();w[w.length-1]=w[w.length-1][0]==='C'?'D':'C';if(check(q,w))throw new Error('spell wrong passes');
   if(q.answer.some(n=>/[𝄪𝄫]/u.test(n)))throw new Error('double accidental '+q.answer);}
 if(!q.explain||!q.prompt||!q.key||!q.label)throw new Error('missing fields');
 /* no program text, undefined, NaN or unknown quality may reach the player (the triadQ name clash, Nov 2026) */
 {const txt=[q.prompt,q.explain,q.label,q.answerText,JSON.stringify(q.answer),JSON.stringify(q.choices||[])].join(' | ');
  if(/=>|function *[(]|undefined|NaN|[[]object /.test(txt))throw new Error('leaked code/undefined in text: '+txt.slice(0,160));
  if(/[A-G][♯♭#b]?[?]/.test(String(q.answerText||q.answer)+' '+JSON.stringify(q.choices||[])+' '+String(q.label)))throw new Error('unknown chord quality: '+String(q.label).slice(0,60));
  /* Roman numerals only in Berklee form: upper case, quality in the symbol (IIm7, V7, IMaj7) */
  {const lc=txt.replace(/<[^>]*>/g,' ').match(/(?<![A-Za-z♭♯])(ii|iii|iv|vi|vii)(°|ø|7|m)?(?![A-Za-z])|(?<![A-Za-z♭♯])i(?= –|°|7)/);if(lc)throw new Error('lower-case numeral "'+lc[0]+'" in: '+txt.slice(0,120));}}
 if(q.after)q.after();
 }catch(e){bad++;if(bad<400)console.log('BAD',g.id,li+1,q.key,e.message);}
}}));}
// play mode conversion
let conv=0;for(const id of PLAY_GAMES){G(id).mode='play';S.gid=id;GBY[id].levels.forEach((lv,li)=>lv.g.forEach(gen=>{if(!levelAvail(id,li+1))return;for(let i=0;i<60;i++){let q;try{q=pickQ(id,li+1);}catch(e){bad++;break;}if(q.ui!=='mic')continue;conv++;
 try{if(q.play&&!q.repeats&&!q.strumSeq)for(let k=1;k<q.target.length;k++)if(q.target[k]<=q.target[k-1])throw new Error('not ascending');   // converted marking questions only; lines in time are melodies
  if(q.repeats&&q.target.length!==q.answer.length)throw new Error('play all spots');
  if(q.strumSeq){const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;};
    if(!micGrade(q,{strums:q.strumSeq.map((v,i)=>({t:i*900,act:act(v)}))}).ok)throw new Error('strum self');
    const w=q.strumSeq[0].slice();const k=w.findIndex(m=>m>=48);if(k>=0){w[k]+=1;if(micGrade(q,{strums:[{t:0,act:act(w)}]}).ok)throw new Error('strum one-off passes');}}
  else{const r=micGrade(q,{notes:q.target.map((m,i)=>({midi:m,mf:m,atk:true,t:3000+(q.grid?q.grid[i]:i)*750})),beat:750,beatStart:3000});if(!r.ok)throw new Error('play self');}
  if(/press <b>Done/.test(q.prompt))throw new Error('prompt');}catch(e){bad++;if(bad<400)console.log('BADPLAY',id,q.key,e.message);}}}));}
/* prerequisites: a level's own generators must not ask what the ladder has not taught yet */
const LEAKS={spelling:{6:/m7♭5|dim7|m[(]maj7[)]|sus|add9|half-diminished|diminished 7/},chordscale:{1:/diminished|melodic minor|Lydian|Phrygian|Aeolian/,2:/characteristic|separates/}};
for(const [id,lvs] of Object.entries(LEAKS))for(const [L,re] of Object.entries(lvs))GBY[id].levels[L-1].g.forEach(gen=>{for(let i=0;i<150;i++){const q=gen(),t=[q.prompt,JSON.stringify(q.answer),q.label].join(' ');if(re.test(t)){bad++;console.log('LEAK',id,L,t.slice(0,120));break;}}});
/* the path: every level of every game in exactly one stage step */
{const seen={};PATH.forEach((st,si)=>st.steps.forEach(([id,a,b])=>{if(!GBY[id]){bad++;console.log('PATH unknown game',id);return;}if(b>GBY[id].levels.length||a<1||a>b){bad++;console.log('PATH bad range',id,a,b);}for(let L=a;L<=b;L++){const k=id+' '+L;if(seen[k]!==undefined){bad++;console.log('PATH twice',k);}seen[k]=si;}}));
 GAMES.forEach(x=>x.levels.forEach((_,i)=>{if(seen[x.id+' '+(i+1)]===undefined){bad++;console.log('PATH missing',x.id,i+1);}}));
 /* within a game the stages never go backwards */
 GAMES.forEach(x=>{let p=0;x.levels.forEach((_,i)=>{const s2=seen[x.id+' '+(i+1)];if(s2<p){bad++;console.log('PATH order',x.id,i+1);}p=Math.max(p,s2);});});}
/* the skill tree: every level in exactly one skill, a skill's levels all in its column's stage, earlier levels of a game in ancestor skills, no cycles */
{const own={},sb=m=>{bad++;console.log('SKILL',m);};const anc=id=>{const out=new Set(),st=[...SKBY[id].pre];while(st.length){const p=st.pop();if(p===id){sb('cycle at '+id);return out;}if(!SKBY[p]){sb('unknown pre '+p);continue;}if(!out.has(p)){out.add(p);st.push(...SKBY[p].pre);}}return out;};
 SKILLS.forEach(n=>{if(!SK_TRACKS.some(t=>t[0]===n.tr))sb('track '+n.id);if(n.goal)return;const c=skCol(n);n.req.forEach(([g,a,b])=>{for(let L=a;L<=b;L++){const k=g+' '+L;if(own[k])sb('twice '+k);own[k]=n.id;if(stageOf(g,L)!==c)sb(n.id+' '+k+' stage '+stageOf(g,L)+' != column '+c);}});
  n.pre.forEach(p=>{if(SKBY[p]&&!SKBY[p].goal&&skCol(SKBY[p])>c)sb(n.id+' builds on a later skill '+p);});});
 GAMES.forEach(x=>{let prev=null;x.levels.forEach((_,i)=>{const k=x.id+' '+(i+1),id=own[k];if(!id){sb('missing '+k);return;}if(prev&&prev!==id&&!anc(id).has(prev))sb(k+': skill '+id+' does not build on '+prev);prev=id;});});
 SKILLS.forEach(n=>anc(n.id));GAMES.forEach(x=>{const s=STD[x.id];if(!s||!(s.acc>=PASS&&s.acc<=1))sb('no master standard for '+x.id);else if(s.flu&&!FLU_GAMES.includes(x.id))sb('time standard on an untimed game '+x.id);});console.log('skills',SKILLS.length);}
/* interval shapes: every shape the text gives lands on its interval from every start string; jazz voicings hold only chord tones */
for(const [k,,semi] of NIV){for(const part of NIV_SHAPE[k].split('; or ')){const m=part.match(/^(same string|next string up|([0-9]) strings up), (same fret|([0-9]+) frets? (up|back))(?: [(](same fret|([0-9]+) frets? (up|back)) when it crosses G–B[)])?$/);
  if(!m){bad++;console.log('SHAPE unparsed',k,part);continue;}const n=m[1]==='same string'?0:m[1]==='next string up'?1:+m[2],off=m[3]==='same fret'?0:(+m[4])*(m[5]==='up'?1:-1),offB=m[6]===undefined?off:m[6]==='same fret'?0:(+m[7])*(m[8]==='up'?1:-1);
  for(let s=6;s-n>=1;s--){const tt=s-n,o=(s>=3&&tt<=2&&n>0)?offB:off;if(OPEN[tt]-OPEN[s]+o!==semi){bad++;console.log('SHAPE wrong',k,part,'from string',s);}}}}
{const r0=OPEN[IVMAP_ROOT.s]+IVMAP_ROOT.f;for(const [d,s2,f,semi] of IVMAP){if(OPEN[s2]+f-r0!==semi||(semi%12)!==({R:0,'3':4,'5':7,'6':9,'7':11,'9':2,'11':5,'13':9})[d]){bad++;console.log('IVMAP wrong',d,s2,f);}if(s2===IVMAP_ROOT.s&&semi>0){bad++;console.log('IVMAP on the root string',d);}}}
/* the plan: 28 days of three existing games, every game at least once, no game twice in a day */
{const seen=new Set();if(PLAN.length!==28){bad++;console.log('PLAN days',PLAN.length);}PLAN.forEach(([th,gs],i)=>{if(gs.length!==3||new Set(gs).size!==3){bad++;console.log('PLAN day',i,gs);}gs.forEach(g=>{if(!GBY[g]){bad++;console.log('PLAN unknown game',g);}seen.add(g);});});
 GAMES.forEach(x=>{if(!seen.has(x.id)){bad++;console.log('PLAN never plays',x.id);}});}
/* every generator of every level must produce questions when called directly: pickQ swallows throwing generators (a level would silently lose a question type) */
GAMES.forEach(x=>{S.gid=x.id;x.levels.forEach((lv,li)=>lv.g.forEach((gen,gi)=>{let ok=0,err='';for(let t=0;t<30;t++){try{gen();ok++;}catch(e){err=e.message;}}if(!ok){bad++;console.log('GENERATOR THROWS',x.id,'L'+(li+1),'g'+gi,err);}}));});
/* tunes: every phrase parses and fits the guitar; improvise: a line on one note, and a line a half step off the example, must fail */
TUNES.forEach(tu=>tu.ph.forEach(p=>{try{const ns=tuneNotes(p);if(ns.length<3||ns.length>14)throw new Error('length '+ns.length);const lo=Math.min(...ns.map(x=>x.semi)),hi=Math.max(...ns.map(x=>x.semi));if(hi-lo>19)throw new Error('range');}catch(e){bad++;console.log('TUNE',tu.id,p,e.message);}}));
Object.values(SOLO).forEach(sp=>{for(let t=0;t<40;t++){const q=soloQ(sp)(),mk=ms=>({notes:ms.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000});if(micGrade(q,mk(q.target.map(()=>q.target[0]))).ok||micGrade(q,mk(q.target.map(m=>m+1))).ok&&!sp.chrom){bad++;console.log('SOLO wrong line accepted',sp.id);break;}}});
/* scale positions: every note is in the key, no step is skipped, patterns stay inside the position; tension grips: every fretted note belongs to the chord and the root is there */
SC_POS.forEach(Pz=>{for(let k=0;k<12;k++){const z=scPos(k,Pz.id),ms=z.notes.map(x=>x.m);if(z.idx<1||z.idx>12||ms.some(m=>![0,2,4,5,7,9,11].includes(mod(m-k,12)))||ms.some((m,i)=>i&&m-ms[i-1]>2)||ms.length<15){bad++;console.log('SCALE position',Pz.id,k);}
  [['scale','updown'],['3','up'],['3','down'],['3','alt'],['tri','alt'],['7','down'],['7','alt']].forEach(([a,b])=>{const ix=scPattern(ms.length,a,b);if(!ix.length||ix.some(i=>i<0||i>=ms.length||!Number.isInteger(i))||ix.some((v,i)=>i&&v===ix[i-1])){bad++;console.log('SCALE pattern',Pz.id,a,b);}});}});
Object.entries(TG).forEach(([name,T])=>{for(const rp of [0,5,10]){tgGrips(name,rp).forEach(a=>{const iv=a.map((f,i)=>f===null?null:mod(OPEN[6-i]+f-rp,12)).filter(v=>v!==null);if(iv.some(v=>!T.f.includes(v))||!iv.includes(0)||iv.length<4||a.some(f=>f!==null&&(f<0||f>15))){bad++;console.log('TENSION grip',name,rp,a.join('-'));}});}});
/* badges: every game has both axes with known values */
GAMES.forEach(x=>{const b=BADGE[x.id];if(!b||!['life','warm','once'].includes(b[0])||!['core','support','side'].includes(b[1])){bad++;console.log('BADGE missing/bad',x.id,b);}});
/* full notes under every lesson card: present, at least three sections, Berklee numerals only, no code leaks */
GAMES.forEach(x=>{const N=LESSON_NOTES[x.id];if(!N||N.length<3){bad++;console.log('LESSON_NOTES missing/short',x.id);return;}const txt=' '+N.map(n=>n.h+' '+n.p.map(p=>Array.isArray(p)?p.join(' '):p).join(' ')).join(' ')+' ';
  const lc=txt.match(/[^A-Za-z](ii|iii|iv|vi|vii)[^A-Za-z]/);if(lc){bad++;console.log('LESSON_NOTES lower-case numeral',x.id,lc[0]);}if(/[^A-Za-z]undefined[^A-Za-z]|[^A-Za-z]NaN[^A-Za-z]|=>|function[(]/.test(txt)){bad++;console.log('LESSON_NOTES code leak',x.id);}});
/* continuous levels: every spec yields sane bars (hits ascending inside the bar, notation present), clicks boolean, tempos numeric */
GAMES.forEach(x=>x.levels.forEach((lv,i)=>{if(!lv.c)return;const c=lv.c,M=c.meter||4;for(let k=0;k<24;k++){let b;try{b=c.bar(k,M);}catch(e){bad++;console.log('GROOVE throws',x.id,i+1,e.message);return;}
  if(!b||!Array.isArray(b.on)||!Array.isArray(b.ev)){bad++;console.log('GROOVE bar shape',x.id,i+1,k);return;}for(let j=0;j<b.on.length;j++){const o=b.on[j];if(!(o>=0&&o<M)||(j&&o<=b.on[j-1])){bad++;console.log('GROOVE hits',x.id,i+1,k,JSON.stringify(b.on));return;}}
  if(c.click&&typeof c.click(k,0)!=='boolean'){bad++;console.log('GROOVE click',x.id,i+1);}if(c.bpm2&&!(c.bpm2(k,100)>=40)){bad++;console.log('GROOVE bpm2',x.id,i+1);}if(c.feel&&typeof c.feel(k)!=='number'){bad++;console.log('GROOVE feel',x.id,i+1);}}}));
console.log('checked',cnt,'play-converted',conv,'bad',bad,'games',GAMES.length);
if(bad)process.exit(1);
`);
