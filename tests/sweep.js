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
const LEAKS={spelling:{6:/m7♭5|dim7|m[(]maj7[)]|sus|add9|half-diminished|diminished 7/},chordscale:{1:/characteristic|separates/}};
for(const [id,lvs] of Object.entries(LEAKS))for(const [L,re] of Object.entries(lvs))GBY[id].levels[L-1].g.forEach(gen=>{for(let i=0;i<150;i++){const q=gen(),t=[q.prompt,JSON.stringify(q.answer),q.label].join(' ');if(re.test(t)){bad++;console.log('LEAK',id,L,t.slice(0,120));break;}}});
/* the path: every level of every game in exactly one stage step */
{const seen={};PATH.forEach((st,si)=>st.steps.forEach(([id,a,b])=>{if(!GBY[id]){bad++;console.log('PATH unknown game',id);return;}if(b>GBY[id].levels.length||a<1||a>b){bad++;console.log('PATH bad range',id,a,b);}for(let L=a;L<=b;L++){const k=id+' '+L;if(seen[k]!==undefined){bad++;console.log('PATH twice',k);}seen[k]=si;}}));
 GAMES.filter(x=>!x.retired).forEach(x=>x.levels.forEach((_,i)=>{if(seen[x.id+' '+(i+1)]===undefined){bad++;console.log('PATH missing',x.id,i+1);}}));
 /* within a game the stages never go backwards */
 GAMES.forEach(x=>{let p=0;x.levels.forEach((_,i)=>{const s2=seen[x.id+' '+(i+1)];if(s2<p){bad++;console.log('PATH order',x.id,i+1);}p=Math.max(p,s2);});});}
/* the skill tree: every level in exactly one skill, a skill's levels all in its column's stage, earlier levels of a game in ancestor skills, no cycles */
{const own={},sb=m=>{bad++;console.log('SKILL',m);};const anc=id=>{const out=new Set(),st=[...SKBY[id].pre];while(st.length){const p=st.pop();if(p===id){sb('cycle at '+id);return out;}if(!SKBY[p]){sb('unknown pre '+p);continue;}if(!out.has(p)){out.add(p);st.push(...SKBY[p].pre);}}return out;};
 SKILLS.forEach(n=>{if(!SK_TRACKS.some(t=>t[0]===n.tr))sb('track '+n.id);if(n.goal)return;const c=skCol(n);n.req.forEach(([g,a,b])=>{for(let L=a;L<=b;L++){const k=g+' '+L;if(own[k])sb('twice '+k);own[k]=n.id;if(stageOf(g,L)!==c)sb(n.id+' '+k+' stage '+stageOf(g,L)+' != column '+c);}});
  n.pre.forEach(p=>{if(SKBY[p]&&!SKBY[p].goal&&skCol(SKBY[p])>c)sb(n.id+' builds on a later skill '+p);});});
 GAMES.filter(x=>!x.retired).forEach(x=>{let prev=null;x.levels.forEach((_,i)=>{const k=x.id+' '+(i+1),id=own[k];if(!id){sb('missing '+k);return;}if(prev&&prev!==id&&!anc(id).has(prev))sb(k+': skill '+id+' does not build on '+prev);prev=id;});});
 SKILLS.forEach(n=>anc(n.id));GAMES.forEach(x=>{const s=STD[x.id];if(!s||!(s.acc>=PASS&&s.acc<=1))sb('no master standard for '+x.id);else if(s.flu&&!FLU_GAMES.includes(x.id))sb('time standard on an untimed game '+x.id);});console.log('skills',SKILLS.length);}
/* interval shapes: every shape the text gives lands on its interval from every start string; jazz voicings hold only chord tones */
for(const [k,,semi] of NIV){for(const part of NIV_SHAPE[k].split('; or ')){const m=part.match(/^(same string|next string up|([0-9]) strings up), (same fret|([0-9]+) frets? (up|back))(?: [(](same fret|([0-9]+) frets? (up|back)) when it crosses G–B[)])?$/);
  if(!m){bad++;console.log('SHAPE unparsed',k,part);continue;}const n=m[1]==='same string'?0:m[1]==='next string up'?1:+m[2],off=m[3]==='same fret'?0:(+m[4])*(m[5]==='up'?1:-1),offB=m[6]===undefined?off:m[6]==='same fret'?0:(+m[7])*(m[8]==='up'?1:-1);
  for(let s=6;s-n>=1;s--){const tt=s-n,o=(s>=3&&tt<=2&&n>0)?offB:off;if(OPEN[tt]-OPEN[s]+o!==semi){bad++;console.log('SHAPE wrong',k,part,'from string',s);}}}}
{const r0=OPEN[IVMAP_ROOT.s]+IVMAP_ROOT.f;for(const [d,s2,f,semi] of IVMAP){if(OPEN[s2]+f-r0!==semi||(semi%12)!==({R:0,'3':4,'5':7,'6':9,'7':11,'9':2,'11':5,'13':9})[d]){bad++;console.log('IVMAP wrong',d,s2,f);}if(s2===IVMAP_ROOT.s&&semi>0){bad++;console.log('IVMAP on the root string',d);}}}
/* the plan: 28 days of three existing games, every game at least once, no game twice in a day */
/* the goals plan: 28 sessions of three goal bubbles (18 per goal, 12 foundations); every level of every game in exactly one step; a game's ranges rise through a goal's stages */
{if(PLAN.length!==28){bad++;console.log('PLAN sessions',PLAN.length);}const cnt={};PLAN.forEach(([th,ks],i)=>{if(ks.length!==3||new Set(ks).size!==3||ks.some(k=>!GOALS[k])){bad++;console.log('PLAN session',i,ks);}ks.forEach(k=>cnt[k]=(cnt[k]||0)+1);});
 if(['A','B','C','D'].some(k=>cnt[k]!==18)||cnt.F!==12){bad++;console.log('PLAN goal counts',JSON.stringify(cnt));}
 const own={};GOAL_KEYS.forEach(k=>{const Gl=GOALS[k];if(!Gl.n||!Gl.end||!Gl.col||Gl.stages.length<4){bad++;console.log('GOALS shape',k);}const last={};
   Gl.stages.forEach((sg,n)=>{if(!sg.n||!sg.why||sg.why.length<40||!sg.steps.length){bad++;console.log('GOALS stage',k,n);}sg.steps.forEach(([gid,from,to])=>{const x=GBY[gid];if(!x||from<1||to<from||to>x.levels.length){bad++;console.log('GOALS step range',k,n,gid,from,to);return;}
     if(last[gid]!==undefined&&from<=last[gid]){bad++;console.log('GOALS: a game goes backwards inside a goal',k,gid,from);}last[gid]=to;for(let L=from;L<=to;L++){const id=gid+':'+L;if(own[id]){bad++;console.log('GOALS: level in two steps',id,own[id],k+(n+1));}own[id]=k+(n+1);}});});});
 GAMES.filter(x=>!x.retired).forEach(x=>x.levels.forEach((_,i)=>{if(!own[x.id+':'+(i+1)]){bad++;console.log('GOALS: level in no step',x.id,i+1);}}));
 for(const k of ['A','B','C','D'])if(GOALS[k].stages.length!==5){bad++;console.log('GOALS: five stages',k);}
 /* stacking: the levels below a step's range belong to steps of the same or an earlier stage number, so no stage waits on a later one */
 const stageOfLv={};GOAL_KEYS.forEach(k=>GOALS[k].stages.forEach((sg,n)=>sg.steps.forEach(([gid,from,to])=>{for(let L=from;L<=to;L++)stageOfLv[gid+':'+L]=n;})));
 GOAL_KEYS.forEach(k=>GOALS[k].stages.forEach((sg,n)=>sg.steps.forEach(([gid,from])=>{for(let L=1;L<from;L++)if(stageOfLv[gid+':'+L]>n){bad++;console.log('GOALS: stage',k+(n+1),gid,'from',from,'waits on a later stage (level',L,'is in stage',stageOfLv[gid+':'+L]+1+')');break;}})));}
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
/* Reading's two-note level: the click runs, any click may be the first; the second note belongs on the next click */
{const gen=GBY.sight.levels[6].g[1];for(let t=0;t<60;t++){const q=gen(),B=1000,g=(t1,t2,m2=q.target[1])=>micGrade(q,{notes:[{midi:q.target[0],mf:q.target[0],t:t1,dur:400},{midi:m2,mf:m2,t:t2,dur:400}],firstAt:t1,beat:B,beatStart:100}).ok;
   if(q.target.length!==2||q.metro!==60||!q.freeStart||q.grid.join()!=='0,1'){bad++;console.log('two-note level: not a free-start click question',q.label);continue;}
   if(!g(100+7*B,100+8*B)||!g(100+3*B+90,100+4*B+120)){bad++;console.log('two-note level: two notes on two clicks fail',q.label);}
   if(g(100+7*B,100+9*B)||g(100+7*B,100+8*B+500)||g(100+7*B,100+8*B,q.target[1]+1)){bad++;console.log('two-note level: a late or wrong second note passes',q.label);}}}
/* the lowest notes may be heard an octave up (laptop mic); nothing higher may */
{const one=(m,g)=>micGrade({ui:'mic',target:[m],octaveFree:false,maxNotes:1,names:['x'],degs:['x']},{notes:[{midi:g,mf:g,t:500,dur:400}],firstAt:500}).ok;
 if(!one(40,52)||!one(42,54)||!one(44,56)||!one(46,58)||!one(40,40)){bad++;console.log('low notes: the octave above is not accepted');}
 if(one(47,59)||one(52,64)||one(60,72)||one(40,64)||one(52,40)){bad++;console.log('low-octave rule too wide');}}
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
 /* the user's rule: one note not heard is let through, and off-beat notes up to 2 in 10 / 3 in 20 (15 % of the run, at least 2); any wrong note fails */
 {const lm=n=>Math.max(2,Math.ceil(n*0.15-1e-9));if(lm(10)!==2||lm(20)!==3||lm(17)!==3||lm(8)!==2||lm(33)!==5){bad++;console.log('scales: late allowance changed');}}
 for(let t=0;t<120;t++){const q=gens[t%gens.length](),B=750,T=q.target,N=T.length,nt=(i,dt=0,m=T[i])=>({midi:m,mf:m,t:100+(3+q.grid[i])*B+dt}),all=()=>T.map((_,i)=>nt(i)),g=ns=>micGrade(q,{notes:ns,firstAt:3000,beat:B,beatStart:100}),a=3,b=N-3,c=5,LM=Math.max(2,Math.ceil(N*0.15-1e-9));
   if(!q.tol||q.tol.miss!==1||q.tol.late!==.15||q.tol.lateMin!==2){bad++;console.log('scales: no tolerance rule',q.label);continue;}
   let wm=T[c]+1;while(T.includes(wm))wm++;const lateSet=k=>{const idx=[];for(let i=1;idx.length<k;i+=2)idx.push(i);return all().map((n,i)=>idx.includes(i)?nt(i,B*0.4):n);};
   const MM=Math.max(1,Math.floor(N/16)),drop=k=>{const ix=[a,b,8,12,16].slice(0,k);return all().filter((_,i)=>!ix.includes(i));},one=drop(MM),two=drop(MM+1),both=lateSet(LM).filter((_,i)=>i!==b),
     op=[52,57,62,55,59,64,45,50].find(m=>m!==T[c]&&m!==T[c+1]),ring=all().map(n=>({...n,dur:600})).concat([{midi:op,mf:op,t:nt(c).t+60,dur:250}]).sort((x,y)=>x.t-y.t),alone=all().map(n=>({...n,dur:120})).concat([{midi:op,mf:op,t:nt(c).t+B*0.5,dur:250}]).sort((x,y)=>x.t-y.t),
     wrong=all().map((n,i)=>i===c?nt(i,0,wm):n),extra=all().concat([{midi:wm,mf:wm,t:nt(c).t+B*0.5,dur:300}]).sort((x,y)=>x.t-y.t);
   const r={ring:g(ring).ok,alone:g(alone).ok,clean:g(all()).ok,one:g(one).ok,two:g(two).ok,lateOk:g(lateSet(LM)).ok,lateOver:g(lateSet(LM+1)).ok,both:g(both).ok,wrong:g(wrong).ok,extra:g(extra).ok};
   if(!r.clean||!r.one||!r.lateOk||!r.both||r.two||r.lateOver||r.wrong||r.extra||!r.ring||(r.alone&&q.grid[1]-q.grid[0]>=1)){   /* one: the allowed number not heard (1, or 1 in 16) passes; two: one more fails; ring: an open string sounding with a played note is not a wrong note; alone: the same pitch played on its own between two notes is (checked at one note a click: in eighths and triplets every sound is within 160 ms of a note) */bad++;console.log('scales tolerance rule broken',q.label,N,LM,JSON.stringify(r));}}
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
GAMES.forEach(x=>{const N=LESSON_NOTES[x.id];if(!N||N.length<3){bad++;console.log('LESSON_NOTES missing/short',x.id);return;}const itx=p=>typeof p==='string'?p:Array.isArray(p)?p.join(' '):p.sub?p.sub:p.tip?(Array.isArray(p.tip)?p.tip.join(' '):p.tip):p.tbl?(p.tbl[0]||[]).concat(...p.tbl[1]).join(' ')+' '+(p.cap||''):p.fig?(p.cap||''):'';const txt=' '+N.map(n=>n.h+' '+n.p.map(itx).join(' ')).join(' ')+' ';
  NF.err.length=0;const html=N.map(n=>n.p.map(noteItem).join('')).join('');if(NF.err.length){bad++;console.log('LESSON_NOTES figure',x.id,NF.err.slice(0,4).join(' | '));}if(/nf-err/.test(html)){bad++;console.log('LESSON_NOTES broken figure',x.id);}
  const lc=txt.match(/[^A-Za-z](ii|iii|iv|vi|vii)[^A-Za-z]/);if(lc){bad++;console.log('LESSON_NOTES lower-case numeral',x.id,lc[0]);}if(/[^A-Za-z]undefined[^A-Za-z]|[^A-Za-z]NaN[^A-Za-z]|=>|function[(]/.test(txt)){bad++;console.log('LESSON_NOTES code leak',x.id);}});
/* continuous levels: every spec yields sane bars (hits ascending inside the bar, notation present), clicks boolean, tempos numeric */
GAMES.forEach(x=>x.levels.forEach((lv,i)=>{if(!lv.c)return;const c=lv.c,M=c.meter||4;for(let k=0;k<24;k++){let b;try{b=c.bar(k,M);}catch(e){bad++;console.log('GROOVE throws',x.id,i+1,e.message);return;}
  if(!b||!Array.isArray(b.on)||!Array.isArray(b.ev)){bad++;console.log('GROOVE bar shape',x.id,i+1,k);return;}for(let j=0;j<b.on.length;j++){const o=b.on[j];if(!(o>=0&&o<M)||(j&&o<=b.on[j-1])){bad++;console.log('GROOVE hits',x.id,i+1,k,JSON.stringify(b.on));return;}}
  if(c.click&&typeof c.click(k,0)!=='boolean'){bad++;console.log('GROOVE click',x.id,i+1);}if(c.bpm2&&!(c.bpm2(k,100)>=40)){bad++;console.log('GROOVE bpm2',x.id,i+1);}if(c.feel&&typeof c.feel(k)!=='number'){bad++;console.log('GROOVE feel',x.id,i+1);}}}));
/* the road map: every chart unrolls to the order written out by hand; a played chart has no two bars alike and every aksak bar fills its meter */
{const want={rep:'1 2 3 4 1 2 3 4 5 6 7 8',rep2:'1 2 3 4 5 6 3 4 5 6 7 8',end1:'1 2 3 4 1 2 3 5 6 7 8',end2:'1 2 3 4 1 2 5 6 7 8 9 10 11 12',dcfine:'1 2 3 4 5 6 7 8 1 2 3 4',dsfine:'1 2 3 4 5 6 7 8 3 4 5 6',dscoda:'1 2 3 4 5 6 7 8 3 4 5 6 9 10 11 12',dccoda:'1 2 3 4 5 6 7 8 1 2 3 4 9 10 11 12',full:'1 2 3 1 2 4 5 6 7 8 5 6 9 10 11 12'};
 for(const k of Object.keys(CHARTS)){const o=chartOrder(CHARTS[k]).map(w=>w+1).join(' ');if(o!==want[k]){bad++;console.log('CHART order',k,o);}if(!CHART_TXT[k]){bad++;console.log('CHART text',k);}if(CHARTS[k].n%4){bad++;console.log('CHART lines',k);}
  for(let l=0;l*4<CHARTS[k].n;l++){const sg=chartSigns(CHARTS[k],l,4);if(sg.some(s=>s.b<0||s.b+(s.len||1)>4)){bad++;console.log('CHART sign off the line',k,l);}}}
 if(Object.keys(want).length!==Object.keys(CHARTS).length){bad++;console.log('CHART untested template');}
 for(let i=0;i<40;i++)for(const k of Object.keys(CHARTS)){const ch=mkChart(k,['q','ee','h','r','re']);const sig=ch.bars.map(b=>JSON.stringify(b.on));if(ch.bars.length!==ch.n||new Set(sig).size!==ch.n){bad++;console.log('CHART bars alike',k);break;}}
 GBY.aksak.levels.forEach((lv,i)=>[lv.c].concat(lv.c.alt||[]).forEach(c=>{const M=c.groups.reduce((a,b)=>a+b,0);if(c.meter!==M||!c.groups.every(g=>g===2||g===3)){bad++;console.log('AKSAK groups',i+1);}for(let k=0;k<12;k++){const b=c.bar(k,M),tot=b.ev.reduce((a,e)=>a+e.d,0);if(Math.abs(tot-M)>1e-6){bad++;console.log('AKSAK bar length',i+1,tot,M);break;}}}));}
/* ear and solfège additions: sight-singing lines are in their key, sit where they are written and never repeat a note; a melody dictation fails on one wrong degree;
   sung arpeggios never repeat a note across a chord change; every harmonised bar fits exactly its own chord; an inverted chord has the named tone in the bass */
{const eb=m=>{bad++;console.log('EAR',m);};
 GBY.sightsing.levels.forEach((lv,li)=>{for(let i=0;i<150;i++){const q=lv.g[0]();if(q.target.some((m,j)=>j&&m===q.target[j-1])){eb('sight repeat L'+(li+1));break;}if(q.target.some((m,j)=>j&&Math.abs(m-q.target[j-1])>7)){eb('sight leap L'+(li+1)+' '+q.target);break;}
   if(q.names.some((n,j)=>pc(P(n))!==mod(q.target[j],12))){eb('sight name L'+(li+1));break;}if(Math.min(...q.target)<55||Math.max(...q.target)>84){eb('sight range L'+(li+1)+' '+q.target);break;}if(!/<svg class="staff"/.test(q.visual)||/NaN|undefined/.test(q.visual)){eb('sight staff L'+(li+1));break;}}});
 for(const k of ['C','G','D','A','F','Bb','Eb']){const ns=ssNotes(P(k),[-1,0,1,2,3,4,5,6,7],false);if(Math.abs(ssKeySig(P(k),false))>3)eb('keysig '+k);ns.forEach(x=>{const nat=x.midi-P(x.name).a,st=LET.indexOf(x.name[0])+7*(Math.floor(nat/12)-1)-30;if(st!==x.w.step||mod(nat,12)!==NAT[LET.indexOf(x.name[0])])eb('staff step '+k+' '+x.name);});}
 if(ssKeySig(P('G'),false)!==1||ssKeySig(P('Eb'),false)!==-3||ssKeySig(P('D'),true)!==-1||ssKeySig(P('E'),true)!==1||ssNotes(P('C'),[0],false)[0].w.step!==-2||ssNotes(P('G'),[0],false)[0].w.step!==2||ssNotes(P('F'),[0],false)[0].w.step!==1)eb('reference staff positions');
 [melDictQ({cells:['q','ee','h'],bars:1,lo:0,hi:4,min:3,max:6}),melDictQ({cells:['q','ee','h','qe'],bars:2,lo:-1,hi:7,skips:.3,triad:true,min:5,max:9})].forEach((g,gi)=>{for(let i=0;i<120;i++){const q=g();if(!check(q,q.answer.map(e=>({...e})))){eb('melody self '+gi);break;}
   const w=q.answer.map(e=>({...e}));w[0].p=w[0].p==='1'?'2':'1';if(check(q,w)){eb('melody wrong degree accepted');break;}const u=q.answer.map(e=>({...e}));delete u[u.length-1].p;if(check(q,u)){eb('melody missing degree accepted');break;}if(q.answer.some(e=>e.rest)||q.answer.some((e,j)=>j&&e.p===q.answer[j-1].p)){eb('melody shape');break;}}});
 for(const [id,pr] of Object.entries(ARP_PROGS)){const t=arpTones(pr);if(t.some((x,j)=>j&&x===t[j-1]))eb('arpeggio repeat '+id);}
 for(const pool of [P_145,P_DIA6]){const g=harmQ(pool),lab=p=>DEG_ORDER.find(d=>DEG_SEMI[d]===p);for(let i=0;i<200;i++){const q=g(),bars=q.key.slice(3).split('_').map(b=>b.split('.').map(Number));
   const ok=bars.every((b,j)=>{const f=pool.filter(c=>b.every(p=>CH[c[1]].map(x=>mod(c[0]+IV[x][1],12)).includes(p)));return f.length===1&&epTok(f[0])===q.answer[j];});if(!ok){eb('harmonise not unique '+q.key);break;}}}
 for(const c of P_145)for(let i=0;i<3;i++){const ch=dch(0,c[0],c[1],i);if(ch.bass!==mod(c[0]+[0,4,7][i],12))eb('inversion bass');}
 if(P_DIA7.map(epTok).join(' ')!=='I IIm IIIm IV V VIm VII°'||P_MIN.map(epTok).join(' ')!=='Im II° ♭III IVm Vm V7 ♭VI ♭VII'||CYC_MAJ.map(epTok).join(' ')!=='I IV VII° IIIm VIm IIm V I')eb('diatonic numerals');
 CYC_MAJ.concat(CYC_MIN).forEach((c,j,a)=>{if(j%8&&![5,6].includes(mod(c[0]-a[j-1][0],12)))eb('cycle step');});}
/* Scale Runner, the run forms: from the tonic (starts and ends on the lowest tonic, touches the top and the bottom note, covers every note, never skips);
   one octave tonic to tonic; to the 7th (thirteen notes, chord tones on the beats); the other scales stay inside their set and inside the major type's frets;
   one octave from any root: the root is under the named finger, and with the second finger on strings 6 or 5 there is no stretch */
{const sb=m=>{bad++;console.log('SCALE',m);};
 for(let P=1;P<=12;P++)for(let k=0;k<12;k++){const z=scPos(k,P),n=z.notes.length,pcs=z.notes.map(x=>mod(x.m-k,12)),t=scRun(z,k,'tonic'),at=pcs.map((p,i)=>p===0?i:-1).filter(i=>i>=0);
   if(!t||t[0]!==at[0]||t.at(-1)!==at[0]||!t.includes(0)||!t.includes(n-1)||new Set(t).size!==n||t.some((v,i)=>i&&Math.abs(v-t[i-1])!==1)||t.length!==2*(n-1)+1){sb('tonic run '+k+' '+P);}
   const o=scRun(z,k,'oct',0);if(at.length>1&&(!o||o.length!==15||pcs[o[0]]!==0||pcs[o[7]]!==0||o.at(-1)!==o[0]))sb('octave '+k+' '+P);
   const b=scRun(z,k,'bh',0);if(b&&(b.length!==13||[0,2,4,6,8,10,12].map(i=>pcs[b[i]]).join()!=='0,4,7,11,7,4,0'))sb('to the 7th '+k+' '+P+' '+(b&&[0,2,4,6,8,10,12].map(i=>pcs[b[i]])));
   const tn=scRun(z,k,'tonics');if(tn&&tn.some(i=>pcs[i]!==0))sb('tonics '+k+' '+P);
   for(const [id,S0] of Object.entries(SC_SCALES)){if(id==='maj')continue;const par=mod(k+S0.par,12),zz=scPos(par,P,S0.s.map(x=>mod(k+x,12))),maj=scPos(par,P);if(zz.type!==maj.type||zz.notes.some(x=>!S0.s.includes(mod(x.m-k,12)))||zz.notes.some(x=>x.f<maj.lo||x.f>maj.hi)||new Set(zz.notes.map(x=>mod(x.m-k,12))).size!==S0.s.length)sb('derived '+id+' '+k+' '+P);}}
 for(const fg of [1,2,4])for(const st of [6,5,4,3]){let seen=0;for(let i=0;i<60;i++){const q=scOctQ({strings:[st],fingers:[fg]})();if(!/^sco-/.test(q.key))continue;seen++;const m=q.prompt.match(/string ([0-9]), fret ([0-9]+)/),f0=+m[2],Pn=ROMAN.indexOf(q.prompt.match(/Position ([IVX]+)/)[1]);
     if(f0-Pn!==fg-1||q.target.length!==15||q.target[7]-q.target[0]!==12||q.target.at(-1)!==q.target[0]||q.target[0]!==OPEN[st]+f0){sb('octave form '+st+' '+fg);break;}
     if(fg===2&&st>=5&&/ pb-st"/.test(q.visual)){sb('second finger form has a stretch '+st);break;}}if(!seen&&!(st===3&&fg!==1))sb('octave form never made '+st+' '+fg);if(seen&&st===3&&fg!==1)sb('octave form from string 3 should need the first finger');}
 GBY.scales.levels.forEach((lv,li)=>lv.g.forEach(g=>{for(let i=0;i<40;i++){const q=g();if(/NaN|undefined/.test(q.prompt+q.visual+q.explain+q.label)){sb('text L'+(li+1));break;}if(q.target.some((m,j)=>j&&m===q.target[j-1])){sb('repeat L'+(li+1));break;}}}));}
/* modes: every scale has one label per note and holds its chord; its colour notes are its own; it equals its parent scale from the parent's root;
   bright to dark lowers one note a half step each time; the careful notes are the textbook ones; the octave path climbs inside six frets;
   an improvised line fails outside the scale, without the colour note, on a repeated note or on a landing note outside the chord */
{const mb=m=>{bad++;console.log('MODES',m);},PAR={'major':[0,2,4,5,7,9,11],'melodic minor':[0,2,3,5,7,9,11],'harmonic minor':[0,2,3,5,7,8,11]};
 for(const [n,M0] of Object.entries(MD)){const fam=mdFam(n);if(!fam){mb('no family '+n);continue;}const F=MD_FAM[fam];if(M0.d.length!==M0.s.length||new Set(M0.d).size!==M0.d.length||M0.s[0]!==0||M0.s.some((x,i)=>i&&x<=M0.s[i-1]))mb('shape '+n);
   if(!F.pcs.every(x=>M0.s.includes(x))||!F.ct.every(x=>M0.s.includes(x)))mb('chord not in scale '+n);if(!M0.c.length||!M0.c.every(l=>M0.d.includes(l)))mb('colour '+n);
   if(M0.par){const set=PAR[M0.par[0]].map(x=>mod(x-M0.par[1],12)).sort((a,b)=>a-b);if(set.join()!==M0.s.join())mb('parent '+n);}}
 for(let i=0;i<MD_BRIGHT.length-1;i++){const a=MD[MD_BRIGHT[i]].s,b=MD[MD_BRIGHT[i+1]].s,df=a.map((x,j)=>x-b[j]);if(df.filter(x=>x).length!==1||!df.includes(1))mb('bright order '+MD_BRIGHT[i]);}
 const care={Ionian:'4',Dorian:'',Phrygian:'♭2,♭6',Lydian:'',Mixolydian:'4',Aeolian:'♭6',Locrian:'♭2'};for(const [n,v] of Object.entries(care))if(mdCare(n,mdFam(n)).join()!==v)mb('careful notes '+n+' '+mdCare(n,mdFam(n)));
 if(mdParent('Lydian ♭7',0)!=='G melodic minor'||mdParent('altered',0)!=='D♭ melodic minor'||mdParent('Locrian ♮2',0)!=='E♭ melodic minor'||mdParent('Dorian',2)!=='C major'||mdParent('Mixolydian ♭9 ♭13',7)!=='C harmonic minor')mb('parent names');
 for(const [n,M0] of Object.entries(MD))for(let rp=0;rp<12;rp++)for(const st of [6,5]){const f=mod(rp-OPEN[st],12);if(f<2||f>10)continue;const u=octPath({s:st,f},M0.s);if(!u){mb('no path '+n+' '+rp);continue;}if(u.some((x,i)=>i&&x.m<=u[i-1].m)||u.at(-1).m-u[0].m!==12||Math.max(...u.map(x=>x.f))-Math.min(...u.map(x=>x.f))>6||u.some((x,i)=>i&&x.s>u[i-1].s))mb('path '+n+' '+rp);}
 const g=modeSoloQ({set:[['maj','Lydian'],['min','Dorian'],['dom','altered'],['dim','whole-half'],['dom','whole tone']]});for(let i=0;i<120;i++){const q=g(),R0=q.msolo,mk=T=>({notes:T.map((m,j)=>({midi:m,mf:m,t:q.grid[j]*750+3000})),firstAt:3000,beat:750,beatStart:3000});
   if(!micGrade(q,mk(q.target)).ok){mb('solo example '+q.key);break;}const out=q.target.slice();let o=out[3]+1;while(R0.pcs.includes(mod(o,12)))o++;out[3]=o;if(micGrade(q,mk(out)).ok){mb('solo outside accepted');break;}
   const nc=q.target.map(m=>R0.col.includes(mod(m,12))?null:m),k0=nc.map((m,j)=>m===null?j:-1).filter(j=>j>=0);if(k0.length<=2&&k0.every(j=>j<16)){const res=mk(q.target);res.notes=res.notes.filter((_,j)=>!k0.includes(j));if(micGrade(q,res).ok){mb('solo without the colour note accepted '+q.key);break;}}
   const rp2=q.target.slice();rp2[5]=rp2[4];if(micGrade(q,mk(rp2)).ok){mb('solo repeated note accepted');break;}const ld=q.target.slice();let l=ld[16]+1;while(R0.ct.includes(mod(l,12))||!R0.pcs.includes(mod(l,12))||l===ld[15])l++;ld[16]=l;if(micGrade(q,mk(ld)).ok){mb('solo landing accepted');break;}}
 GBY.modes.levels.forEach((lv,li)=>lv.g.forEach(gn=>{for(let i=0;i<60;i++){const q=gn();if(/NaN|undefined/.test(q.prompt+q.visual+q.explain+q.label)){mb('text L'+(li+1)+' '+q.key);break;}if(!q.vamp||!(q.vamp.bpm>0)){mb('no band L'+(li+1));break;}if(!q.msolo&&q.target.some((m,j)=>j&&m===q.target[j-1])){mb('repeat L'+(li+1)+' '+q.key);break;}}}));}
/* the harmony-book levels: the facts behind them */
{const hb=m=>{bad++;console.log('HARMONY',m);},tn=d=>(kIn(d+2)?'9':'♭9')+(kIn(d+9)?'13':'♭13');
 if(tn(0)!=='913'||tn(2)!=='913'||tn(9)!=='9♭13'||tn(11)!=='♭9♭13'||tn(4)!=='♭9♭13')hb('secondary dominant tensions');
 if(UST.map(u=>ustLab(u[0])).join('|')!=='9 ♯11 13|♯9 5 ♭7|♯11 ♭7 ♭9|♭13 1 ♯9|13 ♭9 3')hb('upper structures');
 for(const it of MI_SC){const S0=MD[it[3]].s,ct=CH[it[1]].map(x=>IV[x][1]);if(!ct.every(x=>S0.includes(mod(x,12))))hb('borrowed chord scale does not hold its chord '+it[2]);const col=it[1]==='m7'?9:6;if(!S0.includes(col)||!kIn(it[0]+col))hb('borrowed chord scale: its colour note is not a note of the key '+it[2]);}
 for(const [n,M0] of Object.entries(MD)){if(M0.s.length!==7)continue;let c=0;for(let p=0;p<12;p++)if([0,2,4,7,9].every(x=>M0.s.includes(mod(p+x,12))))c++;if(M0.par&&M0.par[0]==='major'&&c!==3)hb('pentatonics in '+n+' '+c);}
 for(const T of QUARTAL)for(let rp=0;rp<12;rp++)stackGrips(T.str,T.iv,rp).forEach(a=>{const ms=tabMidi(a);if(ms.length!==T.iv.length||ms[0]%12!==rp||T.iv.some((x,i)=>ms[i]-ms[0]!==x))hb('fourth voicing '+T.n+' '+tabStr(a));});
 if(!stackGrips([5,4,3,2,1],[0,5,10,15,19],4).map(tabStr).includes('x-7-7-7-8-7'))hb('the five-note fourth voicing of E minor');
 for(let i=0;i<200;i++){const q=modQ('common')();if(/^an-mod-c/.test(q.key)&&!/share 3 of/.test(q.explain)){hb('keys a fifth apart share three seventh chords: '+q.explain.slice(0,90));break;}}
 for(let i=0;i<100;i++){const q=coltraneQ('fill')();const m=q.explain.match(/^([^.]*)\./)[1].split(' – ');if(m.length!==7){hb('coltrane length');break;}}
 const dj=DIM_JOB.filter(j=>j[3]==='up');if(dj.some(j=>mod(j[2][0]-j[1],12)!==1)||DIM_JOB.filter(j=>j[3]==='aux').some(j=>j[1]!==j[0][0]))hb('diminished jobs');}
/* Reading: a line in a key holds only notes of that key, shows its signature and no accidental; a line with one accidental has exactly one */
{for(const [ky,v] of Object.entries(READ_KEYS)){const g=readLineQ([0,4],[1,2,3,4,5,6],1,null,{key:ky}),set=[0,2,4,5,7,9,11].map(x=>(x+v[0])%12);for(let i=0;i<40;i++){const q=g();if(q.target.some(m=>!set.includes(m%12))||/st-acc[^>]*>.*st-head/.test(q.visual.split('st-glyph')[1].split('<ellipse')[1]||'')||(q.visual.match(/class="st-acc"/g)||[]).length!==Math.abs(v[1])||!q.key.includes(ky)){bad++;console.log('READING key line',ky,q.key,(q.visual.match(/class="st-acc"/g)||[]).length);break;}}}
 const g=readLineQ([0,4],[1,2,3,4,5,6],1,null,{chrom:true});for(let i=0;i<80;i++){const q=g();if(q.target.filter(m=>!NAT.includes(m%12)).length!==1||(q.visual.match(/class="st-acc"/g)||[]).length!==1){bad++;console.log('READING accidental line',q.key);break;}}}
/* whole forms: the right number of bars, every symbol parses, every form in WHOLE exists; a harmonised melody: each top note is a tone of its chord and the top of its grip */
{const want={'Blue Bossa (whole form)':16,'Take the A Train (whole form)':32,'Satin Doll (whole form)':32,'All The Things You Are (whole form)':36,'Autumn Leaves (whole form, G minor)':32,'Rhythm changes (whole form, B♭)':32};
 for(const n of WHOLE){const f=FORMS.find(x=>x.n===n);if(!f||f.bars.length!==want[n]){bad++;console.log('FORM length',n,f&&f.bars.length);continue;}if(formChords(f).some(c=>!symParse(c.sym))){bad++;console.log('FORM symbol',n);}}
 if(Object.keys(want).length!==WHOLE.length){bad++;console.log('FORM list');}
 const g=scaleMelQ({len:[5,8]});for(let i=0;i<60;i++){const q=g();if(!/^cms-/.test(q.key))continue;if(q.strumSeq.some((v,j)=>!q.strumAltSeq[j].some(a=>a.at(-1)===v.at(-1)))||q.strumSeq.some((v,j)=>j&&v.at(-1)===q.strumSeq[j-1].at(-1))||q.strumSeq.some(v=>v.at(-1)<64||v.at(-1)>77)){bad++;console.log('MELODY harmonised',q.key);break;}}}
/* John's lean ladders: the played triad drill is nine notes of the chord, three different inversions climbing or falling, no note twice in a row */
{const g=triRunQ({down:true,sets:['4-3-2','3-2-1','5-4-3','6-5-4']});for(let i=0;i<150;i++){const q=g();if(!/^trun-/.test(q.key))continue;const groups=[q.target.slice(0,3),q.target.slice(3,6),q.target.slice(6,9)],pcs=new Set(q.target.map(m=>m%12));
  if(q.target.length!==9||pcs.size!==3||groups.some(gr=>gr[0]>=gr[1]||gr[1]>=gr[2]||gr[2]-gr[0]>12)||new Set(groups.map(gr=>gr[0]%12)).size!==3||q.target.some((m,j)=>j&&m===q.target[j-1])||/NaN|undefined/.test(q.prompt+q.visual+q.explain)){bad++;console.log('TRIAD run',q.key,q.target);break;}}
 if(gamesIn('neck').some(x=>x.id==='guidetones')||!GBY.guidetones){bad++;console.log('retired game still offered, or its data lost');}}
/* Scale Runner weights: the tonic under finger 1 or 2 on string 6 or 5 in C at positions II, III, VII, VIII and not at V, IX, X, XII; those are drawn more often, none is dropped */
{const h=[2,3,5,7,8,9,10,12].filter(P=>scHomeFinger(0,P)).join();if(h!=='2,3,7,8'){bad++;console.log('SCALE home-finger positions',h);}const c={};for(let i=0;i<8000;i++){const P=scPickPos(0,SC_SEVEN);c[P]=(c[P]||0)+1;}
 if(SC_SEVEN.some(P=>!c[P])||!(c[7]>c[5]*1.25&&c[8]>c[9]*1.25&&c[7]<c[5]*1.8)){bad++;console.log('SCALE weights',JSON.stringify(c));}
 const z=scPos(0,8);if(z.type!=='4C'||!z.notes.some(x=>x.s===6&&x.f===8&&!x.st)){bad++;console.log('SCALE position VIII',z.type);}}
/* the blues route: the five boxes of A minor pentatonic are the standard shapes; every box is two notes a string, twelve rising notes of the scale; the blues scale and the
   major pentatonic in a box hold only their notes; bends in the key start on the named degree; the lick book has no note twice in a row and stays in the blues vocabulary;
   Phrase and Space: the example passes, and a note in the rest, a changed repeat, an unchanged ending, an answer off the chord, a wrong landing and a note outside the scale fail */
{const bb=m=>{bad++;console.log('BLUES',m);},tab=B=>[6,5,4,3,2,1].map(s=>B.spots.filter(x=>x.s===s).map(x=>x.f).join(',')).join('|');
 const want=['5,8|5,7|5,7|5,7|5,8|5,8','8,10|7,10|7,10|7,9|8,10|8,10','10,12|10,12|10,12|9,12|10,13|10,12','12,15|12,15|12,14|12,14|13,15|12,15','3,5|3,5|2,5|2,5|3,5|3,5'];for(let k=1;k<=5;k++)if(tab(penBox(9,k))!==want[k-1])bb('A box '+k+' '+tab(penBox(9,k)));
 if(tab(boxScale(9,1,BLUES_SC))!=='5,8|5,6,7|5,7|5,7,8|5,8|5,8'||tab(boxScale(9,1,PMAJ,true))!=='5,7|4,7|4,7|4,6|5,7|5,7')bb('A blues or major pentatonic in box 1');
 for(let rp=0;rp<12;rp++)for(let k=1;k<=5;k++){const B=penBox(rp,k);if(!B||B.spots.length!==12||B.spots.some((x,i)=>!BX_PENT.includes(mod(x.m-rp,12))||(i&&x.m<=B.spots[i-1].m)||x.s!==6-Math.floor(i/2))||mod(B.spots[0].m-rp,12)!==BX_PENT[k-1]||B.hi-B.lo>4)bb('box '+rp+' '+k);}
 GBY.boxes.levels.forEach((lv,li)=>lv.g.forEach(g=>{for(let i=0;i<60;i++){const q=g();if(!/^bx-/.test(q.key)){bb('fallback L'+(li+1));break;}if(/NaN|undefined/.test(q.prompt+q.visual+q.explain+q.label)||q.target.some((m,j)=>j&&(m===q.target[j-1]||Math.abs(m-q.target[j-1])>4))||!q.vamp){bb('question L'+(li+1)+' '+q.key);break;}}}));
 for(const [id,v] of Object.entries(BEND_DEG)){const g=bendDegQ([id]);for(let i=0;i<30;i++){const q=g(),m=q.label.match(/ in ([A-G][♯♭]?)$/);if(!/^bdd-/.test(q.key)||!m||mod(q.bendStart-pc(P(m[1])),12)!==v[0]){bb('bend '+id+' '+q.label+' '+q.bendStart);break;}}}
 BLUES_LICKS.concat(LICK_MORE).forEach((L,i)=>{if(L[0].length!==L[1].length||L[0].some((x,j)=>j&&x===L[0][j-1])||L[0].some(x=>BLUES_DEG[mod(x,12)]===undefined)||L[1].some((b,j)=>j&&b<=L[1][j-1])||L[1].at(-1)>3.01)bb('lick '+(i+1));});if(BLUES_LICKS.length+LICK_MORE.length!==24)bb('lick count');
 for(const id of Object.keys(PHR)){const q=phraseQ(id)(),S0=PHR[id],mk=(T,G)=>({notes:T.map((m,j)=>({midi:m,mf:m,t:G[j]*750+3000})),firstAt:3000,beat:750,beatStart:3000}),T=q.target,G0=q.grid,rp=q.phr.rp;
   if(!micGrade(q,mk(T,G0)).ok){bb('phrase example '+id+' '+micGrade(q,mk(T,G0)).walkWhy);continue;}
   const rb=S0.rest[0];if(micGrade(q,mk(T.concat([T[0]]),G0.concat([rb[0]*4+2]))).ok)bb('phrase: a note in the rest accepted '+id);
   const o2=T.slice();o2[1]=o2[1]+1;while(S0.sc.includes(mod(o2[1]-rp,12)))o2[1]++;if(micGrade(q,mk(o2,G0)).ok)bb('phrase: a note outside the scale accepted '+id);
   if(S0.rep){const c=T.slice(),i2=G0.findIndex(b=>b>=S0.play[S0.rep[1]][0]*4)+1;c[i2]=c[i2]+(S0.sc.includes(mod(c[i2]+2-rp,12))?2:3);if(S0.sc.includes(mod(c[i2]-rp,12))&&micGrade(q,mk(c,G0)).ok)bb('phrase: a changed repeat accepted '+id);}
   if(S0.vary){const n=G0.filter(b=>b<8).length,c=T.slice(0,n).concat(T.slice(0,n));if(micGrade(q,mk(c,G0)).ok)bb('phrase: an unchanged ending accepted');}
   if(S0.land){const c=T.slice();c[c.length-1]=T.at(-1)+5;if(micGrade(q,mk(c,G0)).ok)bb('phrase: an answer off the chord accepted');const d=T.slice(),n=G0.filter(b=>b<8).length;d[n-1]=57+mod(rp-9,12);if(micGrade(q,mk(d,G0)).ok)bb('phrase: a question ending on the root accepted');}
   if(S0.landAt){const c=T.slice();c[c.length-1]=57+mod(rp-9,12)+7;if(micGrade(q,mk(c,G0)).ok)bb('phrase: a wrong landing note accepted');}
   if(S0.differ){const n=G0.filter(b=>b<8).length,c=T.slice(0,2*n).concat(T.slice(0,n));if(micGrade(q,mk(c,G0)).ok)bb('phrase: a third phrase equal to the first accepted');}}}
console.log('checked',cnt,'play-converted',conv,'bad',bad,'games',GAMES.length);
if(bad)process.exit(1);
`);
