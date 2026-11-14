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
for(let P=1;P<=12;P++)for(let k=0;k<12;k++){const z=scPos(k,P),ms=z.notes.map(x=>x.m);if(!z.type||ms.some(m=>![0,2,4,5,7,9,11].includes(mod(m-k,12)))||ms.some((m,i)=>i&&m-ms[i-1]>2)||ms.length<15||z.notes.some(x=>x.f<0||x.f>16||x.f<P-1||x.f>P+4)||(z.fam==='none'&&z.notes.some(x=>x.st))||(z.fam==='first'&&z.notes.some(x=>x.f>P+3))||(z.fam==='fourth'&&z.notes.some(x=>x.f<P))){bad++;console.log('SCALE position',P,k,z.type);}
  [['scale','updown'],['3','up'],['3','down'],['3','alt'],['tri','alt'],['7','down'],['7','alt']].forEach(([a,b])=>{const ix=scPattern(ms.length,a,b);if(!ix.length||ix.some(i=>i<0||i>=ms.length||!Number.isInteger(i))||ix.some((v,i)=>i&&v===ix[i-1])){bad++;console.log('SCALE pattern',P,k,a,b);}});}
/* the documented cases of the system: C in II is type 1 with F under a first-finger stretch on strings 6 and 1; G in II (type 2) and D in II (type 3) have no stretch; A in II (type 4) stretches the fourth finger */
{const f=(k,P)=>scPos(k,P),has=(z,s,fr)=>z.notes.some(x=>x.s===s&&x.f===fr);if(f(0,2).type!=='1'||!has(f(0,2),6,1)||!has(f(0,2),1,1)||f(7,2).notes.some(x=>x.st)||f(2,2).notes.some(x=>x.st)||f(9,2).type!=='4'||!has(f(9,2),4,6)||f(5,2).type!=='1A'||!has(f(5,2),5,1)){bad++;console.log('SCALE Leavitt reference cases');}}
Object.entries(TG).forEach(([name,T])=>{for(const rp of [0,5,10]){tgGrips(name,rp).forEach(a=>{const iv=a.map((f,i)=>f===null?null:mod(OPEN[6-i]+f-rp,12)).filter(v=>v!==null);if(iv.some(v=>!T.f.includes(v))||!iv.includes(0)||iv.length<4||a.some(f=>f!==null&&(f<0||f>15))){bad++;console.log('TENSION grip',name,rp,a.join('-'));}});}});
/* badges: every game has both axes with known values */
/* level details: one note for every level of every game, in one of the two forms, with nothing empty and no leaks */
GAMES.forEach(x=>{const N=LEVEL_NOTES[x.id];if(!N||N.length!==x.levels.length){bad++;console.log('LEVEL_NOTES count',x.id,N&&N.length,'levels',x.levels.length);return;}
  N.forEach((n,i)=>{const full=!!(n.k&&n.w&&n.s&&n.t),add=typeof n.a==='string'&&n.a.length>8;if(full===add||(n.a&&(n.k||n.s))){bad++;console.log('LEVEL_NOTES form',x.id,i+1);}
    const strs=[n.a,n.s,...(n.k||[]),...(n.w||[]),...(n.t||[])].filter(z=>z!==undefined);if(strs.some(z=>typeof z!=='string'||z.length<12||/undefined|NaN|\$\{|=>/.test(z)||/\b(ii|iii|iv|vi|vii)\b/.test(z))){bad++;console.log('LEVEL_NOTES text',x.id,i+1);}
    if(i===0&&!full){bad++;console.log('LEVEL_NOTES: level 1 must be a full note',x.id);}
    for(const f of ['k','w','t'])if(n[f]&&(!Array.isArray(n[f])||!n[f].length)){bad++;console.log('LEVEL_NOTES empty list',x.id,i+1,f);}});});
Object.keys(LEVEL_NOTES).forEach(k=>{if(!GBY[k]){bad++;console.log('LEVEL_NOTES for a game that does not exist',k);}});
/* voicings in use: every grip of a cadence is its chord; rootless grips have the 3rd and 7th and no root; shell+tension stacks are what they say;
   timed strums pass on the beat, fail when late or when a chord is wrong, and ignore a strum in the count-in */
{const pcsOf=a=>new Set(tabMidi(a).map(m=>((m%12)+12)%12));
 for(const k of ['C','F','G','D','A','Bb','Eb','E','Ab','B','Db','F#'])for(const [q,pool] of [['maj7',ALLS],['m7',ALLS],['7',ALLS],['m7♭5',ALLS]])for(const set of pool){const r=P(k),want=new Set(chord(r,q).map(pc)),gs=d2All(r,q,set);
   if(!gs.length||gs.some(a=>{const p=pcsOf(a);return p.size!==4||[...p].some(x=>!want.has(x));})){bad++;console.log('drop-2 grip not its chord',k,q,set);}}
 for(const n of Object.keys(RL))for(let rp=0;rp<12;rp++){const gs=rlGrips(n,rp),need=RL[n].iv.map(x=>((rp+x)%12+12)%12);if(!gs.length){bad++;console.log('rootless: no grip',n,rp);}
   gs.forEach(a=>{const p=pcsOf(a);if(p.has(rp)||need.some(x=>!p.has(x))||p.size!==3){bad++;console.log('rootless grip wrong',n,rp,tabStr(a));}});
   const third=RL[n].q==='m7'?3:4,sev=RL[n].q==='maj7'?11:10;if(!RL[n].iv.some(x=>x%12===third)||(n!=='6/9'&&!RL[n].iv.some(x=>x%12===sev))){bad++;console.log('rootless form without its 3rd or 7th',n);}}
 for(const T of SH_TEN)for(let rp=0;rp<12;rp++){const gs=stackGrips(T.str,T.iv,rp);gs.forEach(a=>{const ms=tabMidi(a);if(ms.length!==4||ms[0]%12!==rp||T.iv.some((x,i)=>((ms[i]-ms[0])!==x-T.iv[0]))){bad++;console.log('shell+tension stack wrong',T.n,rp,tabStr(a));}});}
 if(tabStr(stackGrips([5,4,3,2],[0,4,10,14],0)[0])!=='x-3-2-3-3-x'||tabStr(stackGrips([6,4,3,2],[0,10,16,21],7)[0])!=='3-x-3-4-5-x'||!rlGrips('13',0).some(a=>tabStr(a)==='x-1-2-2-x-x')){bad++;console.log('reference grips changed (C9 x-3-2-3-3-x, G13 3-x-3-4-5-x, rootless C13 x-1-2-2-x-x)');}
 const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;};
 const gens=[cadQ({fam:'d2',kinds:['maj','min','turn'],click:1}),cadQ({fam:'shell',kinds:['maj','turn'],click:1,hide:1}),bluesShellQ('basic blues'),bluesShellQ('quick-change blues'),tenCadQ({click:1}),tenCadQ({rootless:1,click:1})];
 for(let t=0;t<120;t++){const q=gens[t%gens.length]();if(!q.metro||!q.grid||q.grid.length!==q.strumSeq.length){bad++;console.log('timed strum question without a grid',q.label);continue;}
   const B=60000/q.metro,bs=4*B+100,mk=(f,pre)=>({strums:(pre||[]).concat(q.strumSeq.map((v,i)=>({t:bs+q.grid[i]*B+f(i),act:act(v)}))),beat:B,beatStart:bs,firstAt:bs}),g=x=>micGrade(q,x);
   if(!g(mk(()=>0)).ok||!g(mk(()=>B*0.12)).ok||!g(mk(()=>0,[{t:700,act:act([45,52,57])}])).ok){bad++;console.log('timed strums: a clean take fails',q.label);}
   const late=g(mk(()=>B*0.6)),wrong=g({strums:q.strumSeq.map((v,i)=>({t:bs+q.grid[i]*B,act:act(i===1?v.map(m=>m+1):v)})),beat:B,beatStart:bs});
   if(late.ok||late.timeOk||!late.notesOk){bad++;console.log('timed strums: half a beat late passes',q.label);}if(wrong.ok){bad++;console.log('timed strums: a wrong chord passes',q.label);}
   if(q.strumAltSeq&&q.strumAltSeq.some((al,i)=>!al.some(v=>v.join()===q.strumSeq[i].join()))){bad++;console.log('shown grip not among the accepted ones',q.label);}}
 for(const kind of ['maj','min','turn','cycle'])for(let t=0;t<60;t++){const q=gtLineQ(kind)();if(!q.strumSeq){bad++;console.log('guide-tone line fell back',kind);break;}if(q.strumSeq.some(v=>v.length!==2||![5,6,7].includes(v[1]-v[0]))){bad++;console.log('guide-tone pair is not a 3rd and a 7th',kind,JSON.stringify(q.strumSeq));break;}}}
/* count-in questions: what sounds in the count-in is not part of the answer; a note in the first bar proper still is */
{const gens=[GBY.fretboard.levels[8].g[0],alOneQ({pat:['up']})];for(let t=0;t<60;t++){const q=gens[t%2](),B=60000/q.metro,bs=4*B+100,N=q.target.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B})),mk=x=>({notes:x.concat(N).sort((a,b)=>a.t-b.t),firstAt:1000,beat:B,beatStart:bs});
   if(!micGrade(q,mk([])).ok||!micGrade(q,mk([{midi:40,mf:40,t:900},{midi:57,mf:57,t:bs-B*1.2}])).ok){bad++;console.log('count-in: a sound in the count-in fails the take',q.label);}
   let xm=q.target[0]+1;while(q.target.includes(xm))xm++;if(micGrade(q,mk([{midi:xm,mf:xm,t:bs+B*0.5}])).ok){bad++;console.log('count-in: an extra note inside the take passes',q.label);}}}
/* Scale Runner starts whenever the player does: the same run begun 7 clicks later passes; a run that drifts off the clicks or starts between two clicks fails on time */
{const gens=[scQ({pat:[['scale','updown']]}),scQ({pat:[['3','up']],div:2}),scQ({cycle:true,pat:[['tri','alt']]}),scModeQ('home'),scModeQ('sev')];
 for(let t=0;t<120;t++){const q=gens[t%gens.length](),B=750,mk=f=>({notes:q.target.map((m,i)=>({midi:m,mf:m,t:f(q.grid[i],i)})),firstAt:3000,beat:B,beatStart:100});
   if(!q.freeStart||!q.metro){bad++;console.log('scales: not free start',q.label);continue;}
   const late=micGrade(q,mk(gb=>100+(7+gb)*B)),early=micGrade(q,mk(gb=>100+gb*B)),lean=micGrade(q,mk(gb=>100+(11+gb)*B+60)),drift=micGrade(q,mk((gb,i)=>100+(5+gb)*B+i*0.2*B)),wrong=micGrade(q,mk(gb=>100+(7+gb)*B));
   if(!late.ok||!early.ok||!lean.ok){bad++;console.log('scales free start: a clean run fails',q.label,late.ok,early.ok,lean.ok);}
   if(late.per.some(x=>x.off!=null&&Math.abs(x.off)>1)){bad++;console.log('scales free start: offsets not measured from the first click',q.label);}
   if(drift.ok||drift.timeOk){bad++;console.log('scales free start: a drifting run passes',q.label);}}
 /* the user's rule: one note not heard and one note off the beat are let through; any wrong note fails */
 for(let t=0;t<120;t++){const q=gens[t%gens.length](),B=750,T=q.target,N=T.length,nt=(i,dt=0,m=T[i])=>({midi:m,mf:m,t:100+(3+q.grid[i])*B+dt}),all=()=>T.map((_,i)=>nt(i)),g=ns=>micGrade(q,{notes:ns,firstAt:3000,beat:B,beatStart:100}),a=3,b=N-3,c=5;
   if(!q.tol||q.tol.miss!==1||q.tol.late!==1){bad++;console.log('scales: no tolerance rule',q.label);continue;}
   let wm=T[c]+1;while(T.includes(wm))wm++;
   const one=all().filter((_,i)=>i!==a),two=all().filter((_,i)=>i!==a&&i!==b),late1=all().map((n,i)=>i===a?nt(i,B*0.4):n),late2=all().map((n,i)=>i===a||i===b?nt(i,B*0.4):n),both=all().filter((_,i)=>i!==b).map(n=>n.t===nt(a).t?nt(a,B*0.4):n),
     wrong=all().map((n,i)=>i===c?nt(i,0,wm):n),extra=all().concat([{midi:wm,mf:wm,t:nt(c).t+B*0.5,dur:300}]).sort((x,y)=>x.t-y.t);
   const r={clean:g(all()).ok,one:g(one).ok,two:g(two).ok,late1:g(late1).ok,late2:g(late2).ok,both:g(both).ok,wrong:g(wrong).ok,extra:g(extra).ok};
   if(!r.clean||!r.one||!r.late1||!r.both||r.two||r.late2||r.wrong||r.extra){bad++;console.log('scales tolerance rule broken',q.label,JSON.stringify(r));}}
 const q2=alOneQ({pat:['up']})();if(q2.freeStart||q2.tol){bad++;console.log('along should not be free start or tolerant');}}
/* Along the Neck: every line is in its scale, moves by scale step where it is a scale run, stays on the neck; shifts really leave the position; the rule grader rejects bad lines */
{const contig=(sc,ms)=>ms.every((m,i)=>!i||(Math.abs(m-ms[i-1])<=2&&m!==ms[i-1])),inSc=(sc,ms)=>ms.every(m=>sc.pcs.includes(((m%12)+12)%12));
 for(const k of CIRCLE5)for(const kind of ['maj','mm']){const sc=alScale(k,kind),r=alRoute(sc),ms=r.map(x=>x.m);
   if(!inSc(sc,ms)||!contig(sc,ms)||ms.some((m,i)=>i&&m<=ms[i-1])||r.some(x=>x.f<0||x.f>AL_HI||OPEN[x.s]+x.f!==x.m)||r.length<21||r[0].s!==6||r.at(-1).s!==1){bad++;console.log('along route',k,kind,ms.join(' '));}
   for(let s=1;s<=6;s++){const st=alStr(sc,s);if(st[0].f>1||st.length<8){bad++;console.log('along string',k,kind,s);}}}
 for(const k of CIRCLE5){const sc=alScale(k),Pb=alBasic(sc.rp);if(Pb.length!==5||new Set(Pb).size!==5||Pb.some(p=>!['1','2','3','4','1A'].includes(scPos(sc.rp,p).type))){bad++;console.log('along basic positions',k,Pb);}
   for(let i=0;i<4;i++)for(const sh of [4,3]){const segs=alShift(sc.rp,Pb.slice(i,i+2),[sh]),ms=segs.flat().map(x=>x.m),one=scPos(sc.rp,Pb[i]).notes.length;if(segs.length!==2||!inSc(sc,ms)||!contig(sc,ms)||ms.length<=one||segs[1].filter(x=>x.st).length!==1||!segs[1][0].st){bad++;console.log('along shift',k,Pb.slice(i,i+2),sh);}}
   for(let i=0;i<3;i++){const segs=alShift(sc.rp,Pb.slice(i,i+3),[4,2]),ms=segs.flat().map(x=>x.m);if(segs.length!==3||!inSc(sc,ms)||!contig(sc,ms)){bad++;console.log('along two shifts',k,Pb.slice(i,i+3));}}}
 if(alBasic(0).join()!=='2,5,7,9,12'){bad++;console.log('along: C basic positions',alBasic(0));}
 const mk=(q,ms)=>({notes:ms.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000});
 for(let t=0;t<300;t++){const q=alRoadQ({keys:AL_KEYS,any:true})(),T=q.target,R0=q.road;
   if(T.length!==17||T[0]!==R0.from||T.at(-1)!==R0.to||Math.abs(R0.to-R0.from)<12||!micGrade(q,mk(q,T)).ok){bad++;console.log('road example fails',q.label);}
   const flat=T.map(()=>T[0]),up1=T.map(m=>m+1),wrongEnd=T.slice(0,-1).concat([T.at(-2)+(T.at(-1)>T.at(-2)?-0:0)]),leap=T.slice();leap[8]=T[8]+12;const short=T.slice(0,10);
   if(micGrade(q,mk(q,flat)).ok||micGrade(q,mk(q,up1)).ok||micGrade(q,mk(q,leap)).ok||micGrade(q,mk(q,short)).ok||micGrade(q,mk(q,T.slice(0,-1).concat([T[0]]))).ok){bad++;console.log('road accepts a bad line',q.label);}}
 for(let t=0;t<400;t++){const q=alOneQ({keys:AL_KEYS,modes:t%2===0,kind:t%3===0&&t%2?'mm':'maj',pat:['up','updown','3']})();if(q.target.length<8||Math.max(...q.target)-Math.min(...q.target)!==12){bad++;console.log('one string: not one octave',q.label);}}
 for(let t=0;t<200;t++){const q=alTwoQ({keys:AL_KEYS,kind:t%2?'mm':'maj'})();if(q.target.length!==18){bad++;console.log('two strings',q.label);}for(let g=0;g<3;g++){const six=q.target.slice(g*6,g*6+6);if(six.some((m,i)=>i&&(m-six[i-1]<1||m-six[i-1]>2))){bad++;console.log('two strings: group not stepwise',q.label,six);}}}}
GAMES.forEach(x=>{if(![101,201,301].includes(COURSE[x.id])){bad++;console.log('COURSE missing',x.id);}});CATS.forEach(c=>{if(!GAMES.some(x=>x.cat===c.id&&COURSE[x.id]===101)){bad++;console.log('no 101 game in',c.id);}});
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
