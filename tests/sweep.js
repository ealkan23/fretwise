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
 if(q.ui==='fret'){if(!q.valid)throw new Error('no valid');const d=q.reveal.dots.find(x=>(' '+x.cls+' ').indexOf(' fb-ok ')>=0);if(!d||!q.valid(d.s,d.f))throw new Error('fret self-check');}
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
   if(q.answer.filter(n=>/[𝄪𝄫]/u.test(n)).length>1)throw new Error('more than one double accidental '+q.answer);}   /* 23 Nov 2026: the keyboard has 𝄫 and 𝄪; one double accidental may be asked, never two */
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
/* the skill tree (derived from GOALS): a box builds on a box of its own goal in the same or an earlier stage, no cycles; every game has a master standard */
{const sb=m=>{bad++;console.log('SKILL',m);};const anc=id=>{const out=new Set(),st=[...SKBY[id].pre];while(st.length){const p=st.pop();if(p===id){sb('cycle at '+id);return out;}if(!SKBY[p]){sb('unknown pre '+p);continue;}if(!out.has(p)){out.add(p);st.push(...SKBY[p].pre);}}return out;};
 SKILLS.forEach(n=>{if(!SK_TRACKS.some(t=>t[0]===n.tr))sb('track '+n.id);if(n.goal)return;n.pre.forEach(p=>{const q=SKBY[p];if(!q)return sb('unknown pre '+p);if(q.tr!==n.tr)sb(n.id+' builds on another goal’s box '+p);if(!q.goal&&skCol(q)>skCol(n))sb(n.id+' builds on a later box '+p);});anc(n.id);});
 GAMES.forEach(x=>{const s=STD[x.id];if(!s||!(s.acc>=PASS&&s.acc<=1))sb('no master standard for '+x.id);else if(s.flu&&!FLU_GAMES.includes(x.id))sb('time standard on an untimed game '+x.id);});console.log('skills',SKILLS.length);}
/* interval shapes: every shape the text gives lands on its interval from every start string; jazz voicings hold only chord tones */
for(const [k,,semi] of NIV){for(const part of NIV_SHAPE[k].split('; or ')){const m=part.match(/^(same string|next string up|([0-9]) strings up), (same fret|([0-9]+) frets? (up|back))(?: [(](same fret|([0-9]+) frets? (up|back)) when it crosses G–B[)])?$/);
  if(!m){bad++;console.log('SHAPE unparsed',k,part);continue;}const n=m[1]==='same string'?0:m[1]==='next string up'?1:+m[2],off=m[3]==='same fret'?0:(+m[4])*(m[5]==='up'?1:-1),offB=m[6]===undefined?off:m[6]==='same fret'?0:(+m[7])*(m[8]==='up'?1:-1);
  for(let s=6;s-n>=1;s--){const tt=s-n,o=(s>=3&&tt<=2&&n>0)?offB:off;if(OPEN[tt]-OPEN[s]+o!==semi){bad++;console.log('SHAPE wrong',k,part,'from string',s);}}}}
{const r0=OPEN[IVMAP_ROOT.s]+IVMAP_ROOT.f;for(const [d,s2,f,semi] of IVMAP){if(OPEN[s2]+f-r0!==semi||(semi%12)!==({R:0,'3':4,'5':7,'6':9,'7':11,'9':2,'11':5,'13':9})[d]){bad++;console.log('IVMAP wrong',d,s2,f);}if(s2===IVMAP_ROOT.s&&semi>0){bad++;console.log('IVMAP on the root string',d);}}}
/* the goals (20 Nov 2026): five goals of five stages; inside a goal a game's required levels run on from level 1 without a gap (a ladder opens in order), so no
   stage waits on a later one; a level may be in several goals; the appendix (more) names valid ranges that are not already required by that goal */
{const gb=m=>{bad++;console.log('GOALS',m);};if(GOAL_KEYS.length!==5)gb('five goals');
 GOAL_KEYS.forEach(k=>{const Gl=GOALS[k];if(!Gl||!Gl.n||!Gl.end||!Gl.col||!Gl.short||Gl.stages.length!==5)return gb('shape '+k);const last={},core=new Set();
   Gl.stages.forEach((sg,n)=>{if(!sg.n||!sg.why||sg.why.length<40||!sg.steps.length)gb('stage '+k+(n+1));const inStage=new Set();sg.steps.forEach(([gid,from,to])=>{const x=GBY[gid];if(!x||x.retired||from<1||to<from||to>x.levels.length)return gb('step range '+k+(n+1)+' '+gid+' '+from+'–'+to);
     if(inStage.has(gid))gb('a game twice in one stage '+k+(n+1)+' '+gid);inStage.add(gid);if(from!==(last[gid]||0)+1)gb(k+(n+1)+' '+gid+' starts at '+from+', the goal has it up to '+(last[gid]||0)+': a gap or a step back');last[gid]=to;for(let L=from;L<=to;L++)core.add(gid+':'+L);});});
   if(!Array.isArray(Gl.more)||!Gl.more.length)gb('no appendix '+k);(Gl.more||[]).forEach(([gid,from,to,why])=>{const x=GBY[gid];if(!x||x.retired||from<1||to<from||to>x.levels.length)return gb('appendix range '+k+' '+gid);if(!why||why.length<12)gb('appendix reason '+k+' '+gid);for(let L=from;L<=to;L++)if(core.has(gid+':'+L))gb('appendix repeats a required level '+k+' '+gid+' '+L);});});
 /* a run's tightness is measured per subdivision: a different lean in quarters and in sixteenths passes, a loose player does not, alike bars are unchanged */
 {const mk=(lean,jit)=>{const on=[];let i=0;for(let b=0;b<32;b++){const n=[4,4,8,8,12,12,16,16][b%8];for(let k=0;k<n;k++){on.push({bar:b,hit:1,off:lean(n)+Math.sin(i*7.3)*jit});i++;}}return on;},
   run=on=>{GR={onsets:on,res:on.length,holdFrom:0,c:{},std:25,hold:30,feelSet:[],met:{},accOn:false};return grooveMeets();};
  if(!run(mk(n=>n===4?-28:n===16?27:0,18)).ok)gb('runSpread: lean by subdivision must pass');if(run(mk(n=>0,60)).ok)gb('runSpread: loose must fail');
  const u=[];for(let b=0;b<30;b++)for(let k=0;k<4;k++)u.push({bar:b,hit:1,off:-20+Math.sin(b*4+k)*20});if(Math.abs(run(u).t-spread(u.map(o=>o.off)))>1e-9)gb('runSpread: alike bars changed');}
 /* outlines (Arpeggio Runner 6–8): in the key (V from harmonic minor), II ends on its 7th, V starts on its 3rd a step under it, I is reached on its 3rd; own grader passes, one wrong note fails */
 {const ob=m=>{bad++;console.log('OUTLINE',m);};S.gid='arp';
  for(const minor of [0,1])for(const k of (minor?OL_MIN:OL_MAJ))for(const sh of Object.keys(OL_SH)){const q=outlineQ({keys:[k],shape:sh,minor})(),id=(minor?'m':'')+k+' '+sh;if(!q.ol){ob('no position '+id);continue;}
   const T=q.target,r=q.ol.root,C=q.ol.chs,nat=(minor?SC.natural:SC.major).map(x=>(x+r)%12),har=(minor?SC.harmonic:SC.major).map(x=>(x+r)%12);
   if(T.length!==9||q.grid.some((x,i)=>x!==i*0.5))ob('shape '+id);
   T.forEach((m,i)=>{if(!(i>=4&&i<8?har:nat).includes(m%12))ob('out of key '+id+' '+i);});
   const ct=(c,iv)=>(c.r+IV[iv][1])%12,t3=c=>ct(c,CH[c.q].find(x=>x==='M3'||x==='m3')),t7=c=>ct(c,CH[c.q].find(x=>x==='m7'||x==='M7'||x==='d7'));
   if(T[3]%12!==t7(C[0]))ob('II does not end on its 7th '+id);if(T[4]%12!==t3(C[1])||!(T[3]-T[4]>=1&&T[3]-T[4]<=2))ob('V does not start on its 3rd a step under '+id);
   if(T[8]%12!==t3(C[2])||!(T[7]-T[8]>=1&&T[7]-T[8]<=2))ob('no landing on the 3rd of I '+id);
   const res=n=>({notes:n.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000});
   if(!micGrade(q,res(T)).ok)ob('self '+id);const w=T.slice();w[5]+=1;if(micGrade(q,res(w)).ok)ob('one wrong note passes '+id);}}
 /* long improvised takes (review, 20 Nov 2026): one unheard note in sixteen is let through, one more fails; a short line lets none through */
 {S={gid:'improv',used:new Set()};const play=(q,drop,alt)=>{const beat=1000,notes=[];q.target.forEach((m,i)=>{if(drop&&drop.includes(i))return;notes.push({midi:alt&&alt[i]!==undefined?alt[i]:m,t:q.grid[i]*beat});});return soloGrade(q,{notes,beat,beatStart:0,lat:0});};
  for(const id of ['chorus','chorus8','stdAll','blues8']){const q=soloQ(SOLO[id])(),n=q.target.length,mm=Math.floor(n/16);
   if(!play(q).ok)gb('solo tol: clean '+id);if(!play(q,Array.from({length:mm},(_,i)=>5+i*9)).ok)gb('solo tol: allowed misses '+id);if(play(q,Array.from({length:mm+1},(_,i)=>5+i*7)).ok)gb('solo tol: one too many '+id);}
  {const q=soloQ(SOLO.gt)();if(play(q,[3]).ok)gb('solo tol: a short line let a note through');}
  /* the blues takes the key's blues scale between the strong beats: over I7 the ♭3 falling to the root passes, the ♭2 of the key does not, and a wrong note on beat 1 still fails */
  {const q=soloQ(SOLO.blues)(),T=q.target.slice(),C=q.solo.chs[0],k=C.rp,near=(m,p)=>{for(let d=0;d<12;d++){if((m-d-p+1200)%12===0)return m-d;}},b3=near(T[1]+5,(k+3)%12),r1=near(b3,k);
   const run=ms=>play(q,null,Object.fromEntries(ms.map((m,i)=>[i,m])));
   if(![0,3,5,6,7,10].every(x=>C.sc.includes((k+x)%12)))gb('blues: the key blues scale is not in the I7 set');if(C.sc.includes((k+1)%12)||C.sc.includes((k+8)%12))gb('blues: ♭2 or ♭6 of the key allowed over I7');
   const a2=T.slice();a2[1]=b3;a2[2]=r1;if(a2[2]!==a2[3]&&a2[1]!==a2[0]&&!run(a2).ok)gb('blues: ♭3 falling to the root fails over I7');
   const a3=T.slice();a3[0]=near(T[0]+6,(k+3)%12);if(a3[0]!==a3[1]&&run(a3).ok)gb('blues: a blue note on beat 1 passed as a guide tone');
   for(const id of ['blues','chorus','blues8','chorus8']){const x=soloQ(SOLO[id])();x.solo.chs.forEach(c=>{if(!/^b-/.test(c.sk))gb('blues: no blues set on '+id);if(c.ct.some(p=>!c.sc.includes(p)))gb('blues: set misses a chord tone '+id);});}}
  /* the eighth-note blues asks a chord tone on beat 3 */
  {const q=soloQ(SOLO.blues8)(),C=q.solo.chs[0],bad=[0,1,2,3,4,5,6,7,8,9,10,11].find(p=>C.sc.includes(p)&&!C.ct.includes(p)),m=q.target[4],alt=m-((m%12)-bad+12)%12;if(alt!==q.target[3]&&alt!==q.target[5]&&play(q,null,{4:alt}).ok)gb('blues8: a non-chord tone on beat 3 passed');}
  /* half a tune and the whole tune: the allowance does not undo the strict rhythm */
  S={gid:'tunes',used:new Set()};{const q=tunePhraseQ({all:true,time:true})(),beat=1000,mk=(late,drop)=>micGrade(q,{notes:q.target.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000+(i===late?750:0)})).filter((_,i)=>i!==drop),firstAt:3000,beat:750,beatStart:3000});
   if(!q.tol)gb('tune tol: missing');if(!mk(-1,-1).ok)gb('tune tol: clean whole tune');{const dr=q.target.findIndex((m,i)=>i>=3&&i+1<q.target.length&&q.target[i-1]!==q.target[i+1]);if(q.target.length>=16&&dr>0&&!mk(-1,dr).ok)gb('tune tol: one unheard note in a whole tune');}   /* drop a note whose neighbours differ: equal neighbours would merge into one held note */if(q.target.length>4&&mk(2,-1).ok)gb('tune tol: a note a beat late passed');}}
 /* the masters' voices in play: when each of the five emotions fires, and the lines themselves */
 {const J=c=>buddyJudge(Object.assign({ok:true,prev:0,streak:1,w:0,r:'1',mix:false,since:0,rnd:.9},c)),ex=(got,want,m)=>{if(got!==want)gb('voice: '+m+' gave '+got);};
  ex(J({}),null,'a plain right answer');ex(J({ok:false,r:'0'}),null,'a plain miss');
  ex(J({streak:5,prev:4}),'admire','the 5th in a row');ex(J({streak:20,prev:19}),'admire','the 20th in a row');ex(J({streak:6,prev:5}),null,'the 6th in a row');
  ex(J({ok:false,prev:5,streak:0,r:'0'}),'cry','a streak of 5 lost');ex(J({ok:false,prev:4,streak:0,r:'0'}),null,'a streak of 4 lost');
  ex(J({ok:false,prev:2,streak:0,mix:true,r:'0'}),'fedup','the same mix-up a third time');ex(J({ok:false,prev:0,streak:0,w:3,r:'1010'}),'fedup','an item missed three times, twice lately');
  ex(J({ok:false,prev:0,streak:0,w:3,r:'01110'}),null,'an old mistake missed once after three clean');ex(J({ok:false,prev:7,streak:0,mix:true,r:'0'}),'fedup','a repeated mistake that also ends a short streak');
  ex(J({ok:false,prev:12,streak:0,mix:true,r:'0'}),'cry','a repeated mistake that ends a long streak');
  ex(J({w:3,r:'000111'}),'improve','the third clean answer on an old mistake');ex(J({w:3,r:'0001111'}),null,'the fourth clean answer on it');ex(J({w:2,r:'00111'}),null,'three clean on an item missed only twice');
  ex(J({w:3,r:'000111',streak:5,prev:4}),'improve','improving beats a streak mark');ex(J({since:3,rnd:.1}),'random','a quiet stretch');ex(J({since:6,rnd:.5}),null,'a quiet stretch, no luck');ex(J({since:2,rnd:.1}),null,'spoke lately');
  for(const cat in MASTER_LINES){const L=MASTER_LINES[cat];for(const m of ['admire','cry','fedup','improve','random']){const a=L[m]||[];if(a.length<6)gb('voice: '+cat+' '+m+' has '+a.length+' lines');
     a.forEach(l=>{if(l.length>110||/—|undefined|NaN/.test(l)||(l.match(/\\{(\\w+)\\}/g)||[]).some(k=>!['{n}','{mistake}'].includes(k)))gb('voice: line '+l);if(/\{mistake\}/.test(l)&&!['fedup','improve'].includes(m))gb('voice: {mistake} in '+m);if(/\{n\}/.test(l)&&!['admire','cry'].includes(m))gb('voice: {n} in '+m);});
     if(a.every(l=>/\{/.test(l)))gb('voice: '+cat+' '+m+' has no line without a slot');}
    /* a line is never drawn with an empty slot, and never twice running; with the slot known, lines that name it come up */
    for(const [m,sl] of [['fedup',{}],['fedup',{mistake:'minor 6th'}],['admire',{n:10}],['cry',{n:7}],['improve',{mistake:''}],['random',{}]]){let last='',named=0;for(let k=0;k<60;k++){const x=budPick(L[m],'t:'+cat+m+JSON.stringify(sl),sl);if(!x||/[{}]/.test(x))gb('voice: bad pick '+m+' '+x);if(x===last)gb('voice: the same line twice running '+m);last=x;if(sl.mistake&&x.includes(sl.mistake)||sl.n&&x.includes(String(sl.n)))named++;}
      if((sl.mistake||sl.n)&&named<15)gb('voice: the named lines hardly come up '+m);}}
  if(budMistake({answerText:'minor 6th'})!=='minor 6th'||budMistake({answer:['C','E','G']})!==''||budMistake({answerText:'This is a long explanation of the answer.'})!=='')gb('voice: budMistake');}
 /* YoutubeNotes: every figure draws and its labels are the notes they sit on (NF.err), table rows fit their heads, video references exist with times rising inside the video, every listed video is used, house rules of the text */
 {NF.err.length=0;YT_NOTES.forEach(S0=>{const used=new Set();S0.chapters.concat([{h:'end',p:S0.end||[],vids:[]}]).forEach(c=>{if(!c.h||!c.p.length)gb('yt: empty chapter');
    c.p.forEach(it=>{const txt=typeof it==='string'?[it]:Array.isArray(it)?it:it.tip?[].concat(it.tip):it.sub?[it.sub]:it.cap?[it.cap]:[];txt.forEach(x=>{if(/—|undefined|NaN/.test(x)||/\\b(ii|iii|iv|vi|vii)\\b/.test(x))gb('yt: text '+String(x).slice(0,50));});
      if(it.fig){let h;try{h=it.fig();}catch(e){gb('yt: figure threw in '+c.h+': '+e.message);return;}if(!h||/undefined|NaN|nf-err/.test(String(h).replace(/aria-label="[^"]*"/g,'')))gb('yt: broken figure in '+c.h);}
      if(it.tbl)it.tbl[1].forEach(r=>{if(r.length!==it.tbl[0].length)gb('yt: table row in '+c.h);r.forEach(x=>{if(/undefined|NaN|\\?/.test(String(x)))gb('yt: table cell '+x);});});});
    c.vids.forEach(([id,at])=>{const v=S0.videos[id];used.add(id);if(!v)return gb('yt: unknown video '+id);at.forEach(([s2,l],i)=>{if(!(s2>=0&&s2<v.len)||(i&&s2<=at[i-1][0])||!l)gb('yt: time '+s2+' in '+id);});});});
   Object.keys(S0.videos).forEach(id=>{if(!/^[\\w-]{11}$/.test(id))gb('yt: id '+id);if(!used.has(id))gb('yt: video never referenced '+id);});});
  if(NF.err.length)gb('yt: figure faults: '+NF.err.slice(0,5).join(' | '));console.log('youtube notes',YT_NOTES.length,'sets',YT_NOTES.reduce((a,z)=>a+z.chapters.length,0),'chapters');}
 /* where a step fits: one explanation per step, a valid element, every element used, no stale entry, Berklee numerals, no em dash */
 GOAL_KEYS.forEach(k=>{const W=GOAL_WHY[k];if(!W||!W.parts||W.parts.length<4)return gb('why: parts '+k);const keys=new Set(),seenP=new Set(),pk=new Set(W.parts.map(p=>p[0]));
  W.parts.forEach(p=>{if(p.length!==3||!p[1]||p[2].length<30)gb('why: part '+k+' '+p[0]);});
  GOALS[k].stages.forEach(sg=>sg.steps.forEach(([g,a])=>{const e=W.steps[g+':'+a];keys.add(g+':'+a);if(!e)return gb('why: no text '+k+' '+g+' '+a);if(!pk.has(e[0]))gb('why: element '+k+' '+g+' '+a);seenP.add(e[0]);
   if(e[1].length<150||/—|undefined|NaN/.test(e[1])||/\\b(ii|iii|iv|vi|vii)\\b/.test(e[1]))gb('why: text '+k+' '+g+' '+a);}));
  Object.keys(W.steps).forEach(x=>{if(!keys.has(x))gb('why: stale '+k+' '+x);});pk.forEach(x=>{if(!seenP.has(x))gb('why: unused element '+k+' '+x);});});
 const used=new Set();GOAL_KEYS.forEach(k=>{GOALS[k].stages.forEach(sg=>sg.steps.forEach(([g,a,b])=>{for(let L=a;L<=b;L++)used.add(g+':'+L);}));});console.log('levels required by a goal',used.size);}
/* every generator of every level must produce questions when called directly: pickQ swallows throwing generators (a level would silently lose a question type) */
GAMES.forEach(x=>{S.gid=x.id;x.levels.forEach((lv,li)=>lv.g.forEach((gen,gi)=>{let ok=0,err='';for(let t=0;t<30;t++){try{gen();ok++;}catch(e){err=e.message;}}if(!ok){bad++;console.log('GENERATOR THROWS',x.id,'L'+(li+1),'g'+gi,err);}}));});
/* tunes: every phrase parses and fits the guitar; improvise: a line on one note, and a line a half step off the example, must fail */
TUNES.forEach(tu=>tu.ph.forEach(p=>{try{const ns=tuneNotes(p);if(ns.length<3||ns.length>14)throw new Error('length '+ns.length);const lo=Math.min(...ns.map(x=>x.semi)),hi=Math.max(...ns.map(x=>x.semi));if(hi-lo>19)throw new Error('range');}catch(e){bad++;console.log('TUNE',tu.id,p,e.message);}}));
/* eighth-note lines and chord lengths (Improvise 10–13): the example passes; a half step up, one repeated note, a non-chord tone on a strong slot fail; the turnaround changes chord every two beats */
['e8iiV','e8turn','blues8','chorus8'].forEach(id=>{const sp=SOLO[id];S.gid='improv';for(let t=0;t<25;t++){const q=soloQ(sp)(),T=q.target,sl=q.solo.slot,mk=ms=>({notes:ms.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000}),sb=m=>{bad++;console.log('SOLO8',id,m);};
  if(!micGrade(q,mk(T)).ok){sb('example fails '+micGrade(q,mk(T)).walkWhy.join('; '));break;}if(micGrade(q,mk(T.map(m=>m+1))).ok){sb('half step up passes');break;}
  const i=3,w=T.slice();w[i]=w[i-1];if(T.length>=48){w[i+20]=w[i+19];if(T.length>=96){w[i+40]=w[i+39];}}if(micGrade(q,mk(w)).ok){sb('repeated note passes (one more than the long-take allowance)');break;}   /* 22 Nov 2026: a take of 48 slots or more lets floor(n/48) rule faults through (review 2.1c) */
  const si=sl.findIndex((x,j)=>j>0&&!x.land&&x.j===0),C=q.solo.chs[sl[si].b],w2=T.slice();let nc=null;for(let d=1;d<6&&nc===null;d++)for(const m of [T[si]+d,T[si]-d])if(nc===null&&C.sc.includes(mod(m,12))&&!C.ct.includes(mod(m,12))&&m!==T[si-1]&&m!==T[si+1])nc=m;
  w2[si]=nc;if(T.length>=48){const r1=micGrade(q,mk(w2));if(!r1.ok||!/let through/.test(r1.walkWhy.join()))sb('one fault in a long take: '+r1.walkWhy.join('; '));for(let r=1;r<=Math.floor(T.length/48);r++){const j=si+r*16;w2[j]=w2[j-1];}}if(nc===null||micGrade(q,mk(w2)).ok){sb('non-chord tone on a beat passes (beyond the allowance)');break;}
  if(id==='e8turn'){const ch=q.grid.map((g,j)=>sl[j].land?null:q.solo.chs[sl[j].b].sym);for(let j=0;j<q.grid.length;j++){if(ch[j]===null)continue;const want=Math.floor(q.grid[j]/2);if(sl[j].b!==want){sb('chord not every two beats');break;}}
   if(new Set(q.solo.spec.lens).size!==1||q.solo.spec.lens[0]!==2)sb('lens');}}});
/* a standard's changes (Improvise 14–15): every form's chords parse, their lengths add up to the form, each chord's scale holds its own chord tones, the example passes, one repeated note fails */
WHOLE.forEach(n=>{const f=FORMS.find(x=>x.n===n),sb=m=>{bad++;console.log('STD',n,m);};if(!f)return sb('missing');const b=formSoloBars(f,0);if(b.some(x=>!x[0]||!x[1]))return sb('unparsed chord');
  if(b.reduce((a,x)=>a+x[2],0)!==f.bars.length*4)sb('lengths do not add up');b.forEach(([r,q,len,fam,ext])=>{const C=soloChord(r,q,fam,ext);if(C.ct.some(p=>!C.sc.includes(p)))sb('scale misses a chord tone of '+ext.sym);if(C.gt.some(p=>!C.ct.includes(p)))sb('guide tone not a chord tone '+ext.sym);});
  for(const id of ['std8','stdAll']){const q=soloQ(Object.assign({},SOLO[id],{forms:[n]}))(),T=q.target,mk=ms=>({notes:ms.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000});
   if(T.length!==(id==='std8'?32:f.bars.length*4))sb(id+' length '+T.length);if(!micGrade(q,mk(T)).ok)sb(id+' example fails');const w=T.slice();for(let r=0;r<=Math.floor(T.length/48);r++)w[5+r*20]=w[4+r*20];if(micGrade(q,mk(w)).ok)sb(id+' repeated notes beyond the allowance pass');}});
/* tunes in time (Tunes by Ear 7–10): the grid rises and is the running sum of the lengths, the question passes its own grader, a note a full beat late fails on time, every tune has a half and a whole that fit the neck */
{S.gid='tunes';const tb=m=>{bad++;console.log('TUNE TIME',m);};const chk=(q,id)=>{const g=q.grid,T=q.target;if(!q.metro||g.length!==T.length||Math.abs(g[0]-q.tune.off)>1e-6)return tb('shape '+id);   /* the grid begins after the rest that fills the pickup bar (build 3) */for(let i=1;i<g.length;i++)if(!(g[i]>g[i-1]))return tb('grid not rising '+id);
   let t=q.tune.off,j=0;const starts=[];q.tune.ns.forEach((x,i)=>{starts.push(t);t+=x.d;});if(Math.abs(t-q.tune.off-q.tune.total)>1e-6)tb('total '+id);if(g.some(b=>!starts.some(s=>Math.abs(s-b)<2e-3)))tb('grid off the lengths '+id);
   if(Math.min(...T)<40||Math.max(...T)>86)tb('off the neck '+id+' '+Math.min(...T)+'–'+Math.max(...T));
   const mk=gg=>({notes:T.map((m,i)=>({midi:m,mf:m,t:gg[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000});if(!micGrade(q,mk(g)).ok)tb('self '+id);
   const late=g.slice();late[Math.min(2,g.length-1)]+=1;const r=micGrade(q,mk(late));if(r.ok||r.timeOk)tb('a beat late passes '+id);};
 TUNES.forEach(t=>{for(const o of [{half:true},{all:true}]){const x=tunePhraseQ(Object.assign({time:true,only:t.id},o))();if(x.key!=='tu-'+t.id+'-'+(o.all?'all':'half'))tb('key '+x.key);chk(x,x.key);}});
 for(const o of [{mode:['major'],max:7},{mode:['major'],min:8},{mode:['minor','blues']}]){const g=tunePhraseQ(Object.assign({time:true},o));for(let k=0;k<60;k++){const x=g();chk(x,x.key);if(!/^tu-[a-z0-9]+-[0-9]+t$/.test(x.key))tb('key '+x.key);}}}
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
    const strs=[n.a,n.s,...(n.k||[]),...(n.w||[]),...(n.t||[])].filter(z=>z!==undefined);if(strs.some(z=>typeof z!=='string'||z.length<12||/undefined|NaN|\$\{|=>/.test(z)||/\\b(ii|iii|iv|vi|vii)\\b/.test(z))){bad++;console.log('LEVEL_NOTES text',x.id,i+1);}
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
 const gens=[cadQ({fam:'d2',kinds:['maj','min','turn'],click:1}),cadQ({fam:'shell',kinds:['maj','turn'],click:1,hide:1}),bluesShellQ('basic blues'),bluesShellQ('quick-change blues'),tenCadQ({click:1}),tenCadQ({rootless:1,click:1}),cadQ({fam:'shell',kinds:['turn'],click:1,rhy:'two'})];
 {const q=cadQ({fam:'shell',kinds:['turn'],click:1,rhy:'two'})();if(q.grid.join()!=='0,2,4,6'||q.strumSeq.length!==4){bad++;console.log('turnaround two chords a bar: grid',q.grid);}}
 for(let t=0;t<120;t++){const q=gens[t%gens.length]();if(!q.metro||!q.grid||q.grid.length!==q.strumSeq.length){bad++;console.log('timed strum question without a grid',q.label);continue;}
   const B=60000/q.metro,bs=4*B+100,mk=(f,pre)=>({strums:(pre||[]).concat(q.strumSeq.map((v,i)=>({t:bs+q.grid[i]*B+f(i),act:act(v)}))),beat:B,beatStart:bs,firstAt:bs}),g=x=>micGrade(q,x);
   if(!g(mk(()=>0)).ok||!g(mk(()=>B*0.12)).ok||!g(mk(()=>0,[{t:700,act:act([45,52,57])}])).ok){bad++;console.log('timed strums: a clean take fails',q.label);}
   const late=g(mk(()=>B*0.6)),wrong=g({strums:q.strumSeq.map((v,i)=>({t:bs+q.grid[i]*B,act:act(i===1?v.map(m=>m+1):v)})),beat:B,beatStart:bs});
   if(late.ok||late.timeOk||!late.notesOk){bad++;console.log('timed strums: half a beat late passes',q.label);}if(wrong.ok){bad++;console.log('timed strums: a wrong chord passes',q.label);}
   if(q.strumAltSeq&&q.strumAltSeq.some((al,i)=>!al.some(v=>v.join()===q.strumSeq[i].join()))){bad++;console.log('shown grip not among the accepted ones',q.label);}}
 for(const kind of ['maj','min','turn','cycle'])for(let t=0;t<60;t++){const q=gtLineQ(kind)();if(!q.strumSeq){bad++;console.log('guide-tone line fell back',kind);break;}if(q.strumSeq.some(v=>v.length!==2||![5,6,7].includes(v[1]-v[0]))){bad++;console.log('guide-tone pair is not a 3rd and a 7th',kind,JSON.stringify(q.strumSeq));break;}}}
/* Reading's two-note level: the click runs, any click may be the first; the second note belongs on the next click */
{const gen=GBY.sightread.levels[0].g[1];for(let t=0;t<60;t++){const q=gen(),B=1000,g=(t1,t2,m2=q.target[1])=>micGrade(q,{notes:[{midi:q.target[0],mf:q.target[0],t:t1,dur:400},{midi:m2,mf:m2,t:t2,dur:400}],firstAt:t1,beat:B,beatStart:100}).ok;
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
Object.entries(STYLE).forEach(([id,L])=>{if(!GBY[id]||!L.length||L.some(z=>!STYLE_TXT[z])){bad++;console.log('STYLE entry',id);}});
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
 GBY.sightsing.levels.forEach((lv,li)=>{for(let i=0;i<150;i++){const q=lv.g[0]();if(li!==11&&q.target.some((m,j)=>j&&m===q.target[j-1])){eb('sight repeat L'+(li+1));break;}if(li!==11&&q.target.some((m,j)=>j&&Math.abs(m-q.target[j-1])>(li>=9?9:7))){eb('sight leap L'+(li+1)+' '+q.target);break;}   /* ear build 4: levels 10 and 11 skip up to a 6th; level 12 writes tune phrases, which repeat notes and leap as the tune does */
   if(q.names.some((n,j)=>pc(P(n))!==mod(q.target[j],12))){eb('sight name L'+(li+1));break;}if(Math.min(...q.target)<55||Math.max(...q.target)>84){eb('sight range L'+(li+1)+' '+q.target);break;}if(!/<svg class="staff/.test(q.visual)||/NaN|undefined/.test(q.visual)){eb('sight staff L'+(li+1));break;}}});
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
   for(const [id,S0] of Object.entries(SC_SCALES)){if(id==='maj')continue;const par=mod(k+S0.par,12),zz=scPos(par,P,S0.s.map(x=>mod(k+x,12))),maj=scPos(par,P);if(zz.type!==maj.type||zz.notes.some(x=>!S0.s.includes(mod(x.m-k,12)))||zz.notes.some(x=>(x.f<maj.lo||x.f>maj.hi)&&!(x.st&&zz.fam==='none'&&x.f===P-1))||new Set(zz.notes.map(x=>mod(x.m-k,12))).size!==S0.s.length)sb('derived '+id+' '+k+' '+P);
     /* 19 Nov 2026: no note of the scale is skipped inside the position (types 2 and 3 used to leave out the lowered note that falls one fret under the position; it is now a first-finger stretch) */
     if(zz.notes.some((x,i)=>i&&S0.s.indexOf(mod(x.m-k,12))!==(S0.s.indexOf(mod(zz.notes[i-1].m-k,12))+1)%S0.s.length))sb('derived skips a note '+id+' '+k+' '+P);}}
 for(const fg of [1,2,4])for(const st of [6,5,4,3]){let seen=0;for(let i=0;i<60;i++){const q=scOctQ({strings:[st],fingers:[fg]})();if(!/^sco-/.test(q.key))continue;seen++;const m=q.prompt.match(/string ([0-9]), fret ([0-9]+)/),f0=+m[2],Pn=ROMAN.indexOf(q.prompt.match(/Position ([IVX]+)/)[1]);
     if((f0-Pn!==fg-1&&!(fg===1&&Pn===f0+1))||q.target.length!==15||q.target[7]-q.target[0]!==12||q.target.at(-1)!==q.target[0]||q.target[0]!==OPEN[st]+f0){sb('octave form '+st+' '+fg);break;}
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
 for(const f of MI_OLD){const e=cst(f),S0=MD[e.sc].s,ct=CH[e.q].map(x=>IV[x][1]);if(!ct.every(x=>S0.includes(mod(x,12))))hb('borrowed chord scale does not hold its chord '+f);const col=e.q==='m7'?9:6;if(!S0.includes(col)||!kIn(e.d+col))hb('borrowed chord scale: its colour note is not a note of the key '+f);}
 for(const [n,M0] of Object.entries(MD)){if(M0.s.length!==7)continue;let c=0;for(let p=0;p<12;p++)if([0,2,4,7,9].every(x=>M0.s.includes(mod(p+x,12))))c++;if(M0.par&&M0.par[0]==='major'&&c!==3)hb('pentatonics in '+n+' '+c);}
 for(const T of QUARTAL)for(let rp=0;rp<12;rp++)stackGrips(T.str,T.iv,rp).forEach(a=>{const ms=tabMidi(a);if(ms.length!==T.iv.length||ms[0]%12!==rp||T.iv.some((x,i)=>ms[i]-ms[0]!==x))hb('fourth voicing '+T.n+' '+tabStr(a));});
 if(!stackGrips([5,4,3,2,1],[0,5,10,15,19],4).map(tabStr).includes('x-7-7-7-8-7'))hb('the five-note fourth voicing of E minor');
 for(let i=0;i<200;i++){const q=modQ('common')();if(/^an-mod-c/.test(q.key)&&!/share 3 of/.test(q.explain)){hb('keys a fifth apart share three seventh chords: '+q.explain.slice(0,90));break;}}
 for(let i=0;i<100;i++){const q=coltraneQ('fill')();const m=q.explain.match(/^([^.]*)\./)[1].split(' – ');if(m.length!==7){hb('coltrane length');break;}}
 const dj=DIM_JOB.filter(j=>j[3]==='up');if(dj.some(j=>mod(j[2][0]-j[1],12)!==1)||DIM_JOB.filter(j=>j[3]==='aux').some(j=>j[1]!==j[0][0]))hb('diminished jobs');}
/* Reading: a line in a key holds only notes of that key, shows its signature and no accidental; a line with one accidental has exactly one */
{for(const [ky,v] of Object.entries(READ_KEYS)){const g=srLineQ({win:ky==='E'||ky==='Ab'?[4,7]:[0,4],rhy:1,key:ky}),set=[0,2,4,5,7,9,11].map(x=>(x+v[0])%12);for(let i=0;i<40;i++){const q=g();if(q.target.some(m=>!set.includes(m%12))||(q.visual.match(/class="st-acc"/g)||[]).length!==Math.abs(v[1])||!q.key.includes(ky)){bad++;console.log('READING key line',ky,q.key,(q.visual.match(/class="st-acc"/g)||[]).length);break;}}}
 const g=srLineQ({win:[0,4],rhy:1,chrom:true});for(let i=0;i<80;i++){const q=g();if(q.target.filter(m=>!NAT.includes(m%12)).length!==1||(q.visual.match(/class="st-acc"/g)||[]).length!==1){bad++;console.log('READING accidental line',q.key);break;}}}
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
  /* 19 Nov 2026: the blues scale in a box leaves out no note between its lowest and highest; A box 2 takes its low ♭5 one fret above the box on string 6 */
 if(tab(boxScale(9,2,BLUES_SC))!=='8,10,11|7,10|7,10|7,8,9|8,10|8,10')bb('A blues box 2 '+tab(boxScale(9,2,BLUES_SC)));
 for(let rp=0;rp<12;rp++)for(let k=1;k<=5;k++){const Z=boxScale(rp,k,BLUES_SC);if(Z&&Z.spots.some((x,i)=>i&&BLUES_SC.indexOf(mod(x.m-rp,12))!==(BLUES_SC.indexOf(mod(Z.spots[i-1].m-rp,12))+1)%6))bb('blues box skips a note '+rp+' '+k);}
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
/* the score engine (Sight Reading, 20 Nov 2026): splitting into written values, bar memory for accidentals, ties, tuplets, the checker itself */
{const sb=m=>{bad++;console.log('SCORE',m);},Lp={C:0,D:2,E:4,F:5,G:7,A:9,B:11},N=(s,d,x)=>{const k=s.match(/^([A-G])([#b]?)([0-9])$/),m=12*(+k[3]+1)+Lp[k[1]]+(k[2]==='#'?1:k[2]==='b'?-1:0)-12;return Object.assign({m,d,w:writtenOf(m,k[2]==='b'?-1:1)},x||{});},Rr=(d,x)=>Object.assign({rest:1,d},x||{});
 const acc=(line)=>scoreBars(line).map(b=>b.ev.filter(e=>!e.rest).map(e=>e.acc==null?'-':e.acc).join(''));
 let a=acc({meter:'4/4',notes:[N('F#4',1),N('F4',1),N('F4',1),N('F#4',1),N('F4',4)]});if(a.join('|')!=='10-1|-')sb('bar memory in C: '+a);
 a=acc({meter:'4/4',ks:1,notes:[N('F4',1),N('F4',1),N('F#4',1),N('G4',1),N('F#4',4)]});if(a.join('|')!=='0-1-|-')sb('bar memory in G: '+a);
 a=acc({meter:'4/4',ks:1,notes:[N('F5',1),N('F4',1),N('G4',2),N('F4',4)]});if(a.join('|')!=='00-|0')sb('another octave is another position: '+a);
 a=acc({meter:'4/4',notes:[N('C4',3),N('C#4',2),N('D4',2),N('C#4',1)]});if(a.join('|')!=='-1|--1')sb('a tie carries the sign over and the next bar repeats it: '+a);
 a=acc({meter:'4/4',ks:-4,notes:[N('Ab4',1),N('Db5',1),N('D5',1),N('Db5',1)]});if(a.join('|')!=='--0-1')sb('four flats: '+a);
 const pieces=(line)=>scoreBars(line).map(b=>b.ev.map(e=>(e.rest?'r':'')+e.d+(e.tieTo?'~':'')).join(' ')).join(' | ');
 const cases=[[{meter:'4/4',notes:[N('C5',.5),N('D5',1),N('E5',.5),N('F5',2)]},'0.5 1 0.5 2'],[{meter:'4/4',notes:[N('C5',.5),N('D5',2),N('E5',1.5)]},'0.5 1.5~ 0.5 1.5'],
  [{meter:'4/4',notes:[N('C5',3),N('D5',3),N('E5',2)]},'3 1~ | 2 2'],[{meter:'6/8',notes:[N('C5',1),N('D5',1),N('E5',1)]},'1 0.5~ 0.5 1'],[{meter:'3/4',notes:[N('C5',3),Rr(3)]},'3 | r3'],
  [{meter:'4/4',notes:[N('C5',.25),N('D5',.75),N('E5',.75),N('F5',.25),N('G5',2)]},'0.25 0.75 0.75 0.25 2']];
 cases.forEach(([l,want])=>{const got=pieces(l);if(got!==want)sb('split '+want+' got '+got);});
 const T=id=>[(s,d)=>N(s,d,{tup:id}),d=>Rr(d,{tup:id})],[t1,u1]=T(1),[t2]=T(2);
 const ok=[{meter:'4/4',notes:[t1('C5',1/3),u1(1/3),t1('E5',1/3),t2('F5',2/3),t2('G5',2/3),t2('A5',2/3),N('B5',1)]},{meter:'6/8',notes:[N('C5',1.5),N('D5',1.5)]},{meters:['12/8','C|'],notes:[N('C5',6),N('D5',4)]}];
 ok.forEach((l,i)=>{const c=scoreCheck(scoreBars(l),l.meter);if(c.length)sb('good line '+i+' faulted: '+c);});
 const short=scoreBars({meter:'4/4',notes:[N('C5',1),N('D5',1)]});if(!scoreCheck(short,'4/4').length)sb('a short bar passed');
 const tieBad=scoreBars({meter:'4/4',notes:[N('C5',4)]});tieBad[0].ev[0].tieTo=true;if(!scoreCheck(tieBad.concat(scoreBars({meter:'4/4',notes:[N('D5',4)]})),'4/4').length)sb('a tie to another pitch passed');
 const tb=scoreBars({meter:'4/4',notes:[t1('C5',1/3),t1('D5',1/3),N('E5',1/3),N('F5',3)]});if(!scoreCheck(tb,'4/4').length)sb('a tuplet that does not add up passed');
 const d=scoreData(scoreBars({meter:'4/4',notes:[Rr(1),N('G4',3),N('A4',2),N('B4',2)]}));if(JSON.stringify(d.map(x=>[x.bar,x.beat,x.len]))!=='[[1,2,3],[2,1,2],[2,3,2]]')sb('scoreData '+JSON.stringify(d));
 const sv=scoreOf({meter:'4/4',ks:2,swing:1,notes:[N('D4',4),N('E4',4),N('F#4',4),N('G4',4),N('A4',4)],chords:[{t:0,sym:'DMaj7'}],signs:{0:[{k:'rs'}],1:[{k:'re'}]}});if(/undefined|NaN/.test(sv))sb('svg has undefined/NaN');}
/* Sight Reading (20 Nov 2026): every generator. The written page read back as a reader would (signature, then the bar's own signs) gives the pitch played; bars fill their meters;
   targets lie in the position and the key; no pitch twice in a row; a perfect take passes, one wrong note fails, one note a beat late fails (long lines: one late note over the allowance) */
{const sb=m=>{bad++;console.log('SIGHTREAD',m);};S.gid='sightread';GBY.sightread.levels.forEach((lv,li)=>lv.g.forEach((gen,gi)=>{let shown=0;for(let t=0;t<40;t++){let q;try{q=gen();}catch(e){sb('L'+(li+1)+' g'+gi+' throws '+e.message);break;}const tag='L'+(li+1)+' g'+gi+' '+q.key,o=gen.o||{};
  const bars=q.sr.bars,fl=scoreCheck(bars,bars[0].m);if(fl.length){sb(tag+' '+fl[0]);break;}
  const rb={};let bad1='';bars.forEach(b=>{const mem={};b.ev.forEach(e=>{if(e.rest)return;if(e.tieFrom)return;const w=e.w,alt=e.acc!=null?e.acc:(w.step in mem?mem[w.step]:scKsAlt(q.sr.ks,w.l));mem[w.step]=alt;rb[e.src]=12*(w.oct+1)+NAT[w.l]+alt-12;});});
  q.target.forEach((m,k)=>{const s0=[].concat(q.sr.srcs[k])[0];if(rb[s0]!==m)bad1='read back '+rb[s0]+' for '+m+' (target '+(k+1)+')';});if(bad1){sb(tag+' '+bad1);break;}
  if(q.target.length!==q.sr.srcs.length){sb(tag+' targets and written notes do not line up');break;}
  if(!noDup(q.target)){sb(tag+' a pitch twice in a row');break;}
  if(o.win){const win=o.win,kp=(Object.entries(READ_KEYS).find(([k,v])=>v[1]===q.sr.ks)||['C',[0]])[1][0],KS=[0,2,4,5,7,9,11].map(x=>(x+kp)%12),Pset=win[0]>=1?scPos(kp,win[0]).notes.map(x=>x.m):null;
    if(q.target.some(m=>KS.includes(mod(m,12))?(Pset?!Pset.includes(m):!posOf(m).some(x=>x.f>=win[0]&&x.f<=win[1])):!posOf(m).some(x=>x.f>=win[0]&&x.f<=win[1]))){sb(tag+' a note outside the position (its fingering)');break;}
    if(win[0]===0&&/fret [45]\\b/.test(q.explain)&&q.explain.split('; ').some(t=>{const mm=/string (\\d), fret ([45])/.exec(t);return mm&&posOf(OPEN[+mm[1]]+(+mm[2])).some(x=>x.f===0);})){sb(tag+' an open-string pitch shown at fret 4 or 5: '+q.explain);break;}}
  const B=1000,t0=5000,mk=T=>({notes:T.map((m,k)=>({midi:m,mf:m,t:t0+q.grid[k]*B,dur:250})),firstAt:t0,beat:B,beatStart:t0}),ok=T=>micGrade(q,mk(T)).ok;
  if(!ok(q.target)){sb(tag+' the perfect take fails');break;}
  if(q.share){const n=lineSlots(q.target,true);if(n<16){sb(tag+' a share rule on '+n+' slots');break;}const al=n-Math.ceil(n*.9-1e-9),pk=c=>Array.from({length:c},(_,j)=>Math.min(n-1,Math.floor((j+.5)*n/c))),wr=ix=>{const w=q.target.slice();ix.forEach(k=>{w[k]+=[1,-1,2,-2,3].find(d=>w[k]+d!==w[k-1]&&w[k]+d!==w[k+1]);});return w;};
    if(q.target.length===n){if(al&&!ok(wr(pk(al)))){sb(tag+' '+al+' wrong notes of '+n+' fail (share)');break;}if(ok(wr(pk(al+1)))){sb(tag+' '+(al+1)+' wrong notes of '+n+' pass (share)');break;}}}
  else{const w2=q.target.slice(),kk=Math.floor(w2.length/2),dv=[1,-1,2,-2].find(d=>w2[kk]+d!==w2[kk-1]&&w2[kk]+d!==w2[kk+1]);w2[kk]+=dv;if(ok(w2)){sb(tag+' a wrong note passes');break;}
  if(lineSlots(q.target,true)>=16&&!o.free){sb(tag+' 16 slots or more without the share rule');break;}}
  const late=n=>{const r=mk(q.target);const idx=[];for(let k=1;k<q.target.length&&idx.length<n;k+=2)idx.push(k);idx.forEach(k=>{r.notes[k].t+=B*.45;});return micGrade(q,r).ok;};
  if(!q.share){const r=mk(q.target),k1=Math.min(1,q.target.length-1);r.notes[k1].t+=B;if(micGrade(q,r).ok){sb(tag+' a note a beat late passes');break;}}
  if(!o.free&&!(q.scan>=4&&q.scan<=30&&q.scan===Math.min(30,Math.max(4,2*bars.length)))){sb(tag+' scan time '+q.scan+' for '+bars.length+' bars');break;}
  if(o.free&&q.scan){sb(tag+' a free-start question with a scan');break;}
  const lm=q.tol?Math.max(q.tol.lateMin||0,Math.ceil(q.target.length*q.tol.late))+1:1;if(q.tol&&lm<=Math.floor(q.target.length/2)&&late(lm)){sb(tag+' '+lm+' late notes pass');break;}
  if(o.nat&&!bars.some(b=>b.ev.some(e=>e.acc===0))){sb(tag+' the naturals level without a natural');break;}
  if(o.ties&&!bars.some(b=>b.ev.some(e=>e.tieTo))){sb(tag+' the ties level without a tie');break;}
  if(o.bars&&bars.length!==o.bars){sb(tag+' '+bars.length+' bars');break;}}}));}
/* Sight Reading pages (phase 5): generated pages over real changes (strong beats on chord tones, the A sections equal, position, the last note 1 3 or 5),
   a thousand and more pages through scoreCheck; the road map (a wrong turn fails, every written bar different); every written tune page clean */
{const sb=m=>{bad++;console.log('SRPAGE',m);};S.gid='sightread';let pages=0;
 for(const [forms,nb] of [[SR_FORMS16,16],[SR_FORMS32,32]])for(const fn of forms){const f=FORMS.find(x=>x.n===fn);for(let t=0;t<(nb===16?200:150);t++){const pg=srFormPage(f,nb,{swing:nb===32});if(!pg){sb('no page '+fn+' '+nb);break;}pages++;
   const bars=scoreBars(pg.line),fl=scoreCheck(bars,'4/4');if(fl.length){sb(fn+' '+fl[0]);break;}if(bars.length!==nb){sb(fn+' '+bars.length+' bars');break;}
   const ns=pg.notes.filter(n=>!n.rest),chAt=tt=>{let c=pg.ch[0];for(const x of pg.ch)if(x.t<=tt+1e-6)c=x;return c;};
   const off=ns.find(n=>scInt(n.t)&&Math.round(n.t)%2===0&&!chAt(n.t).pcs.includes(mod(n.m,12)));if(off){sb(fn+' a strong beat not a chord tone at '+off.t);break;}
   if(!noDup(ns.map(n=>n.m))){sb(fn+' a pitch twice in a row');break;}
   if(ns.some(n=>!posOf(n.m).some(p=>p.f>=4&&p.f<=11))){sb(fn+' a note outside positions IV to VII');break;}
   /* review, 20 Nov 2026: every note belongs to the scale of the chord it is heard against (a pushed note: the chord it is pushed into), the melody lies on the staff (sounding E3 and up),
      and a written spelling is the pitch it stands for, taken from the chord where the chord or the note is outside the key (B♭ under Gm7, C♭ under A♭m7, never A♯ or G♯ there) */
   {const sI=(tt,d)=>{for(let q=Math.ceil(tt-1e-6);q<tt+d-1e-6;q++)if(q%2===0)return q;return null;},cOf=n=>{const s0=sI(n.t,n.d);return chAt(s0!==null?s0:n.t);};let bd=null;
    pg.notes.forEach((n,i)=>{if(n.rest||bd)return;const c=cOf(n),p=mod(n.m,12),w=pg.line.notes[i].w;if(!c.sc.includes(p)&&!c.pcs.includes(p))bd='a note outside the scale of '+c.sym;
      else if(n.m<52)bd='a note under the staff range ('+n.m+')';else if(w&&mod(NAT[w.l]+w.a,12)!==p)bd='a spelling that is another pitch under '+c.sym;
      else if(w&&/♭/.test(c.sym.slice(0,2))&&w.a>0)bd='a sharp written under '+c.sym;});if(bd){sb(fn+' '+bd);break;}}
   if(nb===32){const avg=(x,y)=>{const z=ns.filter(n=>n.t>=x*4&&n.t<y*4);return z.reduce((a2,n)=>a2+n.m,0)/z.length;};if(!(avg(16,24)>avg(0,8)+1)){sb(fn+' the bridge is not higher than the A');break;}}
   const ln=ns.at(-1),lc=chAt(ln.t);if(![0,IV[CH[lc.q][1]][1],IV[CH[lc.q][2]][1]].map(v=>mod(lc.r+v,12)).includes(mod(ln.m,12))){sb(fn+' the last note is not 1, 3 or 5');break;}
   for(let b=8;b<nb;b+=8)for(let a0=0;a0<b;a0+=8){if(f.bars.slice(a0,a0+8).join('|')!==f.bars.slice(b,b+8).join('|'))continue;const sec=x=>pg.notes.filter(n=>n.t>=x*4-1e-6&&n.t<(x+8)*4-1e-6).map(n=>(n.rest?'r':n.m)+':'+n.d+'@'+(n.t-x*4)).join(' ');if(sec(a0)!==sec(b)){sb(fn+' the A section at bar '+(b+1)+' is not the one at bar '+(a0+1));break;}}}}
 if(pages<1000)sb('only '+pages+' pages');
 const rg=GBY.sightread.levels[27].g[0];for(let t=0;t<60;t++){const q=rg(),B=1000,t0=5000,mk=T=>({notes:T.map((m,k)=>({midi:m,mf:m,t:t0+k*B*0.5,dur:250})),firstAt:t0,beat:B,beatStart:t0});
   const ch=Object.assign({},CHARTS[q.srMap]),written=[];q.sr.bars.forEach((b,bi)=>b.ev.forEach(e=>{if(!e.rest&&!e.tieFrom)written.push(e.m);}));
   const wr=written.slice(0,q.target.length);const r=micGrade(q,{notes:wr.map((m,k)=>({midi:m,mf:m,t:t0+q.grid[Math.min(k,q.grid.length-1)]*B,dur:250})),firstAt:t0,beat:B,beatStart:t0});if(r.ok&&wr.join()!==q.target.join()){sb('road map: reading straight through passes '+q.srMap);break;}
   const sigs=q.sr.bars.map(b=>b.ev.map(e=>(e.rest?'r':e.m)+':'+e.d).join(','));if(new Set(sigs).size!==sigs.length){sb('road map: two written bars alike '+q.srMap);break;}}
 TUNES.filter(t=>SR_TUNE[t.id]).forEach(t=>{for(let k=0;k<6;k++){const pg=srTunePage(t,SR_TUNE[t.id]);if(!pg){sb('tune '+t.id+' fits no position');return;}const fl=scoreCheck(scoreBars(pg.line),pg.line.meter);if(fl.length){sb('tune '+t.id+' '+fl[0]);return;}}});}
/* ===== THE SIX SETS OF LEVELS FROM THE COURSE NOTES (22 Nov 2026) ===== */
/* item 1: triad diagonals (Triad Shapes) */
{const sb=m=>{bad++;console.log('DIAG',m);};S.gid='triads';G('triads').mode='play';
 const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;},strum=(q,seq,f)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{strums:seq.map((v,i)=>({t:bs+q.grid[i]*B+(f?f(i):0),act:act(v)})),beat:B,beatStart:bs,firstAt:bs});},
  line=(q,T,f)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B+(f?f(i):0),dur:300})),beat:B,beatStart:bs,firstAt:bs});};
 const TB={'':['8-7-5-5-5-3','12-10-10-9-8-8','15-15-14-12-13-12'],m:['8-6-5-5-4-3','11-10-10-8-8-8','15-15-13-12-13-11'],aug:['8-7-6-5-5-4','12-11-10-9-9-8','4-3-2-1-1-0'],dim:['8-6-4-5-4-2','11-9-10-8-7-8','14-15-13-11-13-11']};
 for(const q in TB)TB[q].forEach((t,s)=>{const a=triDiag(P('C'),q,s);if(!a||a.join('-')!==t)sb('C '+q+' from '+s+': '+(a&&a.join('-'))+' is not '+t);});
 for(const r of D2ROOTS)for(const q of ['','m','aug','dim'])for(let s=0;s<3;s++){const root=P(r),a=triDiag(root,q,s),ns=chord(root,q).map(pc);if(!a||a.length!==6){sb('no diagonal '+r+q+s);continue;}const ms=a.map((f,i)=>OPEN[6-i]+f);
   if(a.some(f=>f<0||f>19))sb('off the neck '+r+q+s);if(ms.some((m,i)=>i&&m<=ms[i-1]))sb('not rising '+r+q+s);if(ms.some((m,i)=>mod(m,12)!==ns[(s+i)%3]))sb('chord tones out of order '+r+q+s);if(ms[3]-ms[0]!==12||ms[4]-ms[1]!==12||ms[5]-ms[2]!==12)sb('the upper three strings are not the lower three an octave up '+r+q+s);
   for(let i=0;i<4;i++)if(ms[i+2]-ms[i]>=12||mod(ms[i],12)!==ns[(s+i)%3])sb('strings '+i+' are not the close inversion '+((s+i)%3)+' of '+r+q+s);
   if(q==='aug'){const d=a.slice(1).map((f,i)=>f-a[i]).join();if(d!=='-1,-1,-1,0,-1')sb('augmented diagonal is not the one fingering '+r+s+' '+a.join('-'));}}
 /* the arpeggio questions */
 const dg=[triDiagQ({roots:['C'],start:[0]}),triDiagQ({roots:['C'],start:[1]}),triDiagQ({roots:['C'],start:[2]}),triDiagQ({q:['']}),triDiagQ({q:['m']}),triDiagQ({roots:['C'],q:['aug']}),triDiagQ({roots:['C'],q:['dim']}),triDiagQ({roots:TD_8,q:['aug','dim']})];
 for(let t=0;t<400;t++){const q=dg[t%dg.length]();if(!/^tdg-/.test(q.key)){sb('diagonal question fell back '+q.key);break;}const T=q.target;
   if(T.length!==11||!q.metro||q.grid.join()!==T.map((_,i)=>i).join()){sb('not eleven notes on the clicks '+q.key);break;}if(T.includes(47)){sb('a target of B2 '+q.key);break;}
   if(T.some((m,i)=>i&&i<6&&m<=T[i-1])||T.some((m,i)=>i>=6&&m>=T[i-1])||T.slice(6).join()!==T.slice(0,5).reverse().join()){sb('not up six and back five '+q.key);break;}
   if(q.degs.slice(0,6).join()!==q.degs.slice(0,3).concat(q.degs.slice(0,3)).join()){sb('degrees do not repeat an octave up '+q.key);break;}
   if(!line(q,T).ok){sb('the perfect take fails '+q.key);break;}const w=T.slice();w[3]+=1;if(line(q,w).ok){sb('a wrong note passes '+q.key);break;}if(line(q,T,i=>i===4?600000/q.metro/10*6:0).ok&&line(q,T,()=>60000/q.metro*0.6).ok){sb('late notes pass '+q.key);break;}}
 /* the diagonal of level 6 is C major from the root, the 3rd and the 5th */
 [[0,'8-7-5-5-5-3'],[1,'12-10-10-9-8-8'],[2,'15-15-14-12-13-12']].forEach(([s,t])=>{const q=GBY.triads.levels[5].g[s](),ms=t.split('-').map((f,i)=>OPEN[6-i]+(+f));if(q.target.slice(0,6).join()!==ms.join())sb('level 6 generator '+s+' is not '+t);});
 /* rolled as chords */
 const rl=[triRollQ({roots:['C'],q:['']}),triRollQ()];
 for(let t=0;t<300;t++){const q=rl[t%2]();if(!/^trl-/.test(q.key)){sb('roll question fell back '+q.key);break;}const sq=q.strumSeq,st=+q.key.split('-')[2];
   if(sq.length!==7||q.grid.join()!=='0,2,4,6,8,10,12'||!q.metro){sb('roll: not seven strums two beats apart '+q.key);break;}if(sq.some(v=>v.length!==3||v[0]<48||v[2]-v[0]>=12)){sb('roll: a chord is not a close triad from C3 up '+q.key);break;}
   if([0,1,2].some(i=>sq[i+1][0]!==sq[i][1]||sq[i+1][1]!==sq[i][2]||sq[i+1][2]!==sq[i][0]+12)){sb('roll: two notes do not stay '+q.key);break;}if(sq[4].join()!==sq[2].join()||sq[5].join()!==sq[1].join()||sq[6].join()!==sq[0].join()){sb('roll: the way back differs '+q.key);break;}
   if(q.degs.slice(0,4).join()!==[0,1,2,3].map(i=>['root','1st','2nd'][(st+i)%3]).join()){sb('roll: the named inversions are wrong '+q.key);break;}
   if(!strum(q,sq).ok){sb('roll: the perfect take fails '+q.key);break;}if(strum(q,sq,()=>60000/q.metro*0.6).ok){sb('roll: half a beat late passes '+q.key);break;}
   const w=sq.map(v=>v.slice());w[2][1]+=1;if(strum(q,w).ok){sb('roll: a wrong note passes '+q.key);break;}const x=sq.slice();x[1]=sq[2];if(strum(q,x).ok){sb('roll: another inversion in place of the asked one passes '+q.key);break;}}
 /* major to diminished and back */
 const dm=[triDimQ({roots:['C']}),triDimQ()];
 for(let t=0;t<300;t++){const q=dm[t%2]();if(!/^tdm-/.test(q.key)){sb('major-to-diminished question fell back '+q.key);break;}const [A,D,A2]=q.strumSeq,rp=A.find(m=>D.includes(m));
   if(A.join()!==A2.join()||rp===undefined||A.concat(D).some(m=>m<48)){sb('maj-dim: voicings '+q.key);break;}if(A.map(m=>mod(m-rp,12)).sort((a,b)=>a-b).join()!=='0,4,7'||D.map(m=>mod(m-rp,12)).sort((a,b)=>a-b).join()!=='0,3,6'){sb('maj-dim: not major then diminished on one root '+q.key);break;}
   if(A.filter(m=>m!==rp).some(m=>!D.includes(m-1))){sb('maj-dim: the 3rd and 5th do not fall one fret '+q.key);break;}
   if(!strum(q,q.strumSeq).ok){sb('maj-dim: the perfect take fails '+q.key);break;}if(strum(q,[A,A,A]).ok){sb('maj-dim: major three times passes '+q.key);break;}}
 /* the spread triads on a diagonal */
 {const og=triOpenDiagQ();for(let t=0;t<200;t++){const q=og();if(!/^sp-dg-/.test(q.key)){sb('open-diagonal question fell back '+q.key);break;}const [c1,c2]=q.strumSeq,all=c1.concat(c2).sort((a,b)=>a-b);
   if(new Set(c1.map(m=>mod(m,12))).size!==3||new Set(c2.map(m=>mod(m,12))).size!==3||c1[2]-c1[0]<=12||c2[2]-c2[0]<=12||all.some((m,i)=>i&&m<=all[i-1])||c1[0]<48){sb('open diagonal: not two spread triads of one diagonal '+q.key);break;}}}
 /* guitar-only levels */
 [6,7,8,12,14].forEach(L=>{if(!levelAvail('triads',L,true)||levelAvail('triads',L,false))sb('level '+L+' should be a guitar-only level');});[9,10,11,13].forEach(L=>{if(!levelAvail('triads',L,true)||!levelAvail('triads',L,false))sb('level '+L+' should exist for both inputs');});
 if(GBY.triads.levels.length-(OSJ.triads||[]).length!==14)sb('Triad Shapes should have 14 levels');G('triads').mode='mark';}
/* item 2: connect the arpeggios (Arpeggio Runner) */
{const sb=m=>{bad++;console.log('CONNECT',m);};S.gid='arp';
 const take=(q,T)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>m===null?null:({midi:m,mf:m,t:bs+q.grid[i]*B,dur:200})).filter(Boolean),beat:B,beatStart:bs,firstAt:bs});};
 {const [dn,up]=nearTones(60,conChord(P('E'),''));if(dn!==59||up!==64)sb('C to E major: the nearest notes should be B below and E above');}
 for(const id of ['tri','sev','min','tri8','sev8','min8']){const S0=CON[id];if(connectQ(S0,{keys:['C']})().key!=='con-'+id+'-C')sb(id+': the C-only generator is not in C');
  for(const k of S0.keys){const q=connectQ(S0,{keys:[k]})();if(q.key!=='con-'+id+'-'+k){sb(id+' fell back in '+k);continue;}const {chs,slot,spec}=q.solo,T=q.target,n=4*S0.div;
   if(T.length!==3*n||q.grid.length!==T.length){sb(id+' '+k+': not three bars');continue;}if(T.some(m=>m<48)){sb(id+' '+k+': the example goes under C3');}
   if(T.some((m,i)=>!chs[slot[i].b].ct.includes(mod(m,12))))sb(id+' '+k+': the example leaves the chord');if(q.names.some(x=>!x||/undefined/.test(x)))sb(id+' '+k+': a note has no name');
   let r=take(q,T);if(!r.ok){sb(id+' '+k+': the example fails: '+r.walkWhy[0]);continue;}
   /* both nearest notes at every change, in every combination */
   for(const d1 of [-1,1])for(const d2 of [-1,1]){const L=nearLine(chs,spec.lens,S0.div,[0,d1,d2],40,84);r=take(q,L);if(!r.ok&&!/three different/.test(r.walkWhy.join()))sb(id+' '+k+': a nearest note ('+d1+','+d2+') is refused: '+r.walkWhy[0]);}
   /* a jump to the new root where a nearer note existed */
   for(const b of [1,2]){const i=b*n,[dn,up]=nearTones(T[i-1],chs[b]);let rt=48+chs[b].rp;while(rt===dn||rt===up||Math.abs(rt-T[i-1])<6)rt+=12;const w=T.slice();w[i]=rt;r=take(q,w);if(r.ok||!r.walkWhy.some(x=>/at the change go to the nearest note/.test(x)))sb(id+' '+k+': a jump to the root at chord '+(b+1)+' passes');
     if(r.walkWhy.length&&!(new RegExp(chs[b].name(dn)+' below or '+chs[b].name(up)+' above')).test(r.walkWhy.join(' | ')))sb(id+' '+k+': the message does not name the two right notes');}
   /* a skipped chord tone inside a bar */
   {const [dn,up]=nearTones(T[0],chs[0]),[,up2]=nearTones(up,chs[0]),w=T.slice();w[1]=up2;r=take(q,w);if(r.ok||!r.walkWhy.some(x=>/go to the next chord tone/.test(x)))sb(id+' '+k+': a skipped chord tone passes');}
   {const w=T.slice();w[2]=w[1];if(take(q,w).ok)sb(id+' '+k+': a repeated note passes');const o=T.slice();o[1]+=1;if(chs[0].ct.includes(mod(o[1],12))===false&&take(q,o).ok)sb(id+' '+k+': a note outside the chord passes');}
   /* not heard: one in sixteen, none under sixteen notes */
   {const one=T.slice();one[5]=null;const two=one.slice();two[n+3]=null;const three=two.slice();three[2*n+2]=null;const a=take(q,one).ok,b2=take(q,two).ok,c3=take(q,three).ok;
    if(S0.div===1&&a)sb(id+' '+k+': a twelve-note line lets an unheard note through');if(S0.div===2&&(!a||b2||c3))sb(id+' '+k+': the allowance in eighths is not one note ('+a+','+b2+')');}}}
 {const ex=conExample();if(ex.ln.join()!=='53,57,62,65,62,59,55,50,52,55,60,64'||ex.ln.some(m=>m<48))sb('the worked example of the notes changed: '+ex.ln.join());
  const r=conRows(['D','m'],['G','']).concat(conRows(['G',''],['C',''])).map(x=>x.join('')).join(' ');if(r!=='DBG FDG AGB GEC BGC DCE')sb('nearest-note tables: '+r);}}
/* item 3: enclosures (Arpeggio Runner) */
{const sb=m=>{bad++;console.log('ENCLOSE',m);};S.gid='arp';
 const take=(q,T)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B,dur:200})),beat:B,beatStart:bs,firstAt:bs});};
 /* the brief's tables */
 const ROW={'D dor':'D F A|C♯ E G♯|E G B','G mix':'G B D|F♯ A♯ C♯|A C E','C maj':'C E G|B D♯ F♯|D F A','D aeo':'D F A|C♯ E G♯|E G B♭','G mixb':'G B D|F♯ A♯ C♯|A♭ C E♭','C dor':'C E♭ G|B D F♯|D F A'};
 for(const k in ROW){const [r,s]=k.split(' ');if(encRow(r,s).join('|')!==ROW[k])sb('table '+k+': '+encRow(r,s).join('|'));}
 const FG=[[1,'plain','D C B C','2 1 7 1'],[3,'plain','F E D♯ E','4 3 ♯2 3'],[5,'plain','A G F♯ G','6 5 ♯4 5'],[1,'above','D D♭ B C','2 ♭2 7 1'],[1,'below','B D D♭ C','7 2 ♭2 1'],[1,'cnf','D♭ D B C','♭2 2 7 1'],[5,'above','A A♭ F♯ G','6 ♭6 ♯4 5'],[5,'below','F♯ A A♭ G','♯4 6 ♭6 5'],[5,'cnf','A♭ A F♯ G','♭6 6 ♯4 5'],[3,'dbl','F D D♯ E','4 2 ♯2 3']];
 FG.forEach(([n,k,t,l])=>{if(encFigTxt('C','maj',n,k)!==t||encFigTxt('C','maj',n,k,'lab')!==l)sb('figure '+k+' on '+n+': '+encFigTxt('C','maj',n,k)+' / '+encFigTxt('C','maj',n,k,'lab'));});
 if(encTone(P('C'),'maj',3).ch)sb('a chromatic note between E and F');
 const LINES=[[encTriQ({q:''}),'D C B C F E D♯ E A G F♯ G D C B C'],[encTriQ({q:'m'}),'D C B C F E♭ D E♭ A G F♯ G D C B C'],[encCadQ({keys:['C']}),'E D C♯ D G F E F A G F♯ G C B A♯ B D C B C F E D♯ E C'],[encCadQ({keys:['C'],dark:true}),'E D C♯ D G F E F A♭ G F♯ G C B A♯ B D C B C F E D♯ E C'],
  [encChromQ({keys:['C'],kinds:['above']}),'D D♭ B C F D D♯ E A A♭ F♯ G D D♭ B C'],[encChromQ({keys:['C'],kinds:['below']}),'B D D♭ C F D D♯ E F♯ A A♭ G B D D♭ C'],[encChromQ({keys:['C'],kinds:['cnf']}),'D♭ D B C F D D♯ E A♭ A F♯ G D♭ D B C']];
 LINES.forEach(([g,t])=>{const q=g();if(q.names.join(' ')!==t)sb('line: '+q.names.join(' ')+' is not '+t);});
 {const q=encTriQ({q:''})();if(q.target[12]-q.target[0]!==12||q.target[13]-q.target[1]!==12)sb('the last figure is not an octave above the first');}
 /* every question: roles hold in every key, one area, the grader */
 const gens=[encTriQ({q:''}),encTriQ({q:'m'}),encCadQ({keys:['C']}),encCadQ({keys:['C'],dark:true}),encCadQ({dark:'any'}),encChromQ({keys:['C']}),encChromQ()],ref={};
 for(let t=0;t<420;t++){const q=gens[t%gens.length]();if(!/^enc-/.test(q.key)||(t%7===4&&!/^enc-cad/.test(q.key))||(t%7===6&&!/^enc-chr/.test(q.key))){sb('fell back: '+q.key);break;}const T=q.target,R=q.enc,n=T.length;
   if(!q.metro||q.metro>66||q.grid.join()!==T.map((_,i)=>i*0.5).join()){sb('not eighths at 66 or slower '+q.key);break;}if((n>=16)!==!!q.tol){sb('the allowance does not follow the length '+q.key);break;}
   if(T.some((m,i)=>i&&m===T[i-1])){sb('a pitch twice in a row '+q.key);break;}if(Math.min(...T)<48){sb('under C3 '+q.key);break;}
   const nG=Math.floor(n/4);let okR=true;for(let g=0;g<nG;g++){const G4=T.slice(g*4,g*4+4),r4=R.slice(g*4,g*4+4),ct=G4[3];if(r4[3]!=='ct')okR=false;
     G4.forEach((m,j)=>{const r=r4[j];if(r==='ct'&&m!==ct)okR=false;if(r==='ap'&&m!==ct-1)okR=false;if(r==='nb'&&(m-ct<1||m-ct>2))okR=false;if(r==='ch'&&m!==ct+1)okR=false;if(r==='lo'&&(ct-m<1||ct-m>2))okR=false;});
     if(r4.includes('ch')&&!(r4.includes('nb')&&G4[r4.indexOf('nb')]===ct+2))okR=false;}
   if(!okR){sb('an approach note is not a half step below, or a neighbour not the step above '+q.key+' '+T.join(' '));break;}
   /* transposed lines keep the intervals of the line in C */
   const sig=q.key.replace(/-[A-G][b#]?$/,''),iv=T.map(m=>m-T[0]).join();if(/-C$/.test(q.key))ref[sig]=iv;else if(ref[sig]&&ref[sig]!==iv&&!/^enc-cad/.test(q.key)){sb('the line in another key has other intervals '+q.key);break;}
   if(/^enc-cad/.test(q.key)){const pc0=T.map(m=>mod(m-T.at(-1),12)).join(),k2=sig+'pc';if(/-C$/.test(q.key))ref[k2]=pc0;else if(ref[k2]&&ref[k2]!==pc0){sb('the cadence line in another key has other notes '+q.key);break;}}
   /* one area: every note on the neck inside five or six frets */
   const a=encFit(T);if(!a||a.win[1]-a.win[0]>5||a.seq.some(x=>OPEN[x.s]+x.f!==x.m||x.f<a.win[0]||x.f>a.win[1])){sb('not in one area '+q.key);break;}
   if(!take(q,T).ok){sb('the perfect take fails '+q.key);break;}const w=T.slice();w[5]=[1,-1,2,-2,3].map(d=>T[5]+d).find(m=>m!==T[4]&&m!==T[6]);if(take(q,w).ok){sb('one wrong note passes '+q.key);break;}}   /* a wrong note equal to a neighbour reads as a held note with one missing, which the allowance forgives */
 if(GBY.arp.levels.length-(OSJ.arp||[]).length!==15||GBY.arp.levels[3].n!=='The whole position'||GBY.arp.levels[5].n!=='Connect the triads'||GBY.arp.levels[8].n!=='Enclosures on a triad, in C'||GBY.arp.levels[11].n!=='Bebop dominant'||GBY.arp.levels[14].n!=='Minor outlines')sb('Arpeggio Runner ladder is not the 15 levels of the review');}   /* 22 Nov 2026: level 4 inserted (REORDERS27) */
/* items 5 and 6: the pentatonic ladder (Blues Boxes) and one octave three times (Along the Neck) */
{const sb=m=>{bad++;console.log('PAIRS',m);};
 const fr=L=>[6,5,4,3,2,1].map(s=>L.filter(x=>x.s===s).map(x=>x.f).join(',')).join('|'),copies=L=>{const c=p=>L.filter(x=>x.p===p),a=c(0);return [1,2].every(p=>c(p).every((x,i)=>x.s===a[i].s-2*p&&x.f===a[i].f+(p===1?2:5)&&x.m===a[i].m+12*p));};
 const free=(q,T)=>{const B=60000/q.metro;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:3000+q.grid[i]*B,dur:300})),firstAt:3000,beat:B,beatStart:3000});},cin=(q,T)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B,dur:300})),firstAt:bs,beat:B,beatStart:bs});};
 const wrong=(T,i)=>{const w=T.slice();w[i]=[1,-1,2,-2].map(d=>T[i]+d).find(m=>m!==T[i-1]&&m!==T[i+1]);return w;},updown=T=>{const top=T.indexOf(Math.max(...T));return T.every((m,i)=>!i||(i<=top?m>T[i-1]:m<T[i-1]))&&T.slice(top+1).join()===T.slice(0,top).reverse().join();};
 /* the ladder */
 S.gid='boxes';if(fr(penLadder(9,'23'))!=='3,5|3,5,7|5,7|5,7,9|8,10|8,10,12')sb('A minor two-then-three: '+fr(penLadder(9,'23')));if(fr(penLadder(9,'32'))!=='8,10,12|10,12|10,12,14|12,14|13,15,17|15,17')sb('A minor three-then-two: '+fr(penLadder(9,'32')));
 if(penLadder(9,'23').map(x=>PCN[mod(x.m,12)].split('/')[0]).join(' ')!=='G A C D E G A C D E G A C D E')sb('the ladder in A minor is not C major pentatonic from G');
 for(let rp=0;rp<12;rp++)for(const k of ['23','32']){const L=penLadder(rp,k);if(!L){sb('no ladder '+rp+k);continue;}if(!copies(L))sb('ladder '+rp+k+': the octaves are not the same shape two and then three frets higher');if(L.some(x=>!BX_PENT.includes(mod(x.m-rp,12)))||L.some((x,i)=>i&&x.m<=L[i-1].m))sb('ladder '+rp+k+' leaves the scale or does not rise');
   const st=L.map((x,i)=>i?x.m-L[i-1].m:0).slice(1),cross=L.map((x,i)=>i&&x.s!==L[i-1].s).slice(1);if(st.some((d,i)=>cross[i]?d!==3:d!==2))sb('ladder '+rp+k+': not whole steps on a string and a minor 3rd across');}
 {const seen=new Set(),gs=[boxLadQ({roots:['A']}),boxLadQ({roots:LAD_ROOTS})];for(let t=0;t<200;t++){const q=gs[t%2]();if(!/^bx-lad-/.test(q.key)){sb('ladder question fell back '+q.key);break;}const T=q.target;seen.add(q.prompt.slice(0,40)+q.key);
   if(T.length!==29||!updown(T)||T.includes(47)||!q.freeStart||!q.tol||!q.vamp||q.metro>72){sb('ladder question '+q.key+' '+T.join(' '));break;}if(!free(q,T).ok){sb('ladder: the perfect take fails');break;}if(free(q,wrong(T,7)).ok){sb('ladder: a wrong note passes');break;}}
  if(seen.size<7)sb('ladder: only '+seen.size+' of the seven key and cell combinations appear');}
 [['A','23',[5,1],[1,2],[2,3]],['A','32',[2,3],[3,4],[4,5]]].forEach(([r,k,...bx])=>{const L=penLadder(pc(P(r)),k);bx.forEach((b,p)=>{const c=ladCover(pc(P(r)),L.filter(x=>x.p===p));if(!c||c.join()!==b.join())sb('ladder '+r+k+' pair '+p+' is in boxes '+c);});});
 /* one octave, three times */
 S.gid='along';{const A7=alPairSpots(9,[0,3,7,10],2);if(!A7||fr(A7)!=='5,8|7,10|7,10|9,12|10,13|12,15')sb('Am7 on the pairs: '+(A7&&fr(A7)));
  const F=alPairSpots(5,AL_SC.maj,3);if(!F||[6,5,4,3,2,1].map(s=>F.filter(x=>x.s===s).map(x=>x.f+7).join(',')).join('|')!=='8,10,12|8,10,12,14|10,12,14|10,12,14,16|13,15,17|13,15,17,19')sb('the major scale on the pairs, moved to C, is not the brief’s');if(alPairSpots(0,AL_SC.maj,3))sb('C major on the pairs should be refused (fret 19)');}
 {const gs=[alPairQ({chords:[['A','m7']],inv:[0]}),alPairQ({chords:[['A','m7']],inv:[1,2,3]}),alPairQ(),alPairScaleQ({keys:['F']}),alPairScaleQ()],kinds=new Set();
  for(let t=0;t<400;t++){const q=gs[t%5]();if(!/^alp-/.test(q.key)){sb('pairs question fell back '+q.key);break;}kinds.add(q.key);const T=q.target,sc=/^alp-sc/.test(q.key),n=sc?7:4,top=T.indexOf(Math.max(...T));
   if(T.length!==(sc?41:23)||!updown(T)||T.includes(47)||q.freeStart||!q.tol||q.metro>72||q.grid.join()!==T.map((_,i)=>i).join()){sb('pairs question '+q.key+' '+T.join(' '));break;}
   const up=T.slice(0,top+1);if(up.some((m,i)=>i>=n&&m!==up[i-n]+12)){sb('pairs: the octaves differ '+q.key);break;}
   const pcs=new Set(up.slice(0,n).map(m=>mod(m,12)));if(pcs.size!==n||up.some(m=>!pcs.has(mod(m,12)))){sb('pairs: a note outside the chord or scale '+q.key);break;}
   if(!sc){const dg=q.degs.slice(0,4).join(' '),qd={m7:['1','♭3','5','♭7'],maj7:['1','3','5','7'],'7':['1','3','5','♭7']}[q.key.split('-')[1]],iv=+q.key.split('-')[2];if(dg!==[0,1,2,3].map(i=>qd[(iv+i)%4]).join(' ')){sb('pairs: degrees '+dg+' for '+q.key);break;}}
   else if(q.degs.slice(0,7).join('')!=='1234567'){sb('pairs: the scale does not start on the tonic');break;}
   if(!cin(q,T).ok){sb('pairs: the perfect take fails '+q.key);break;}if(cin(q,wrong(T,5)).ok){sb('pairs: a wrong note passes '+q.key);break;}if(typeof q.after!=='function'||(q.after().match(/<svg/g)||[]).length!==3){sb('pairs: the answer screen does not show three shapes');break;}}
  if(kinds.size<10)sb('pairs: only '+kinds.size+' kinds of question');
  for(const r of AL_PROOTS)for(const qq of ['m7','maj7','7'])for(let i=0;i<4;i++){const ns=chord(P(r),qq),sem=CH[qq].map(x=>IV[x][1]),cell=[0,1,2,3].map(j=>sem[(i+j)%4]+((i+j)>=4?12:0)-sem[i]),L=alPairSpots(pc(ns[i]),cell,2);if(L&&(!copies(L)||L.some(x=>x.f>17||x.f<0)))sb('pairs '+r+qq+i+': not one shape in three octaves');}
  for(const k of AL_PKEYS){const L=alPairSpots(pc(P(k)),AL_SC.maj,3);if(!L||!copies(L))sb('pairs: the scale in '+k);}}
 if(GBY.boxes.levels.length!==10||GBY.boxes.levels[4].n!=='The ladder'||GBY.boxes.levels[5].n!=='The blue note')sb('Blues Boxes ladder');if(GBY.along.levels.length!==9||GBY.along.levels[3].n!=='One octave, three times'||GBY.along.levels[4].n!=='Shifting positions')sb('Along the Neck ladder');
 /* the migration table: old levels map onto the same level names, new levels are the listed ones */
 Object.entries(REORDERS26).forEach(([id,R])=>{const n=R.n+R.nw.length,img=new Set();for(let L=1;L<=R.n;L++)img.add(R.m[L]||L);if(img.size!==R.n||R.nw.some(L=>img.has(L))||img.size+R.nw.length!==n||Math.max(...img,...R.nw)!==n)sb('REORDERS26 '+id+' does not cover the '+n+' levels');});}
/* ===== THE REVIEW OF JOHN'S GAMES (22 Nov 2026, brief .claude/john-audit-brief.md) ===== */
{const sb=m=>{bad++;console.log('JOHN',m);};
 /* 1.0 Fretboard: the octave two strings away, from the tuning; the hint points at a real answer; no "count 0" */
 if(octTwo(6,true).df!==2||octTwo(5,true).df!==2||octTwo(4,true).df!==3||octTwo(3,true).df!==3||octTwo(2,true)!==null)sb('octave two strings up');
 if(!/strings 6 and 5 the octave two strings higher is 2 frets up; from strings 4 and 3 the octave two strings higher is 3 frets up/i.test(octRuleTxt()))sb('octave rule: '+octRuleTxt());
 S.gid='fretboard';for(let i=0;i<500;i++){const q=fbOct()(),m=/Look at string (\\d) \\([^)]*\\), (the same fret|(\\d+) frets? (up|back))/.exec(q.hint);if(!m){sb('octave hint '+q.hint);break;}const f2=q.mark.f+(m[3]?(m[4]==='up'?1:-1)*(+m[3]):0);if(!q.valid(+m[1],f2)){sb('octave hint points at no answer: '+q.hint+' from S'+q.mark.s+' F'+q.mark.f);break;}if(/two strings toward the floor/.test(q.hint)){sb('old octave hint');break;}}
 for(let s=1;s<=6;s++)for(let f=0;f<=12;f++)if(/Count 0 /.test(landmark(s,f)))sb('landmark counts 0 frets');
 /* Intervals on the Neck: compound names, a hint that points at a real spot */
 const CMP={13:'a minor 2nd',14:'a major 2nd',17:'a perfect 4th',18:'an augmented 4th',20:'a minor 6th',21:'a major 6th'};
 S.gid='neckiv';for(let i=0;i<1500;i++){const q=neckIntervalQ(NIV.map(x=>x[0]),'any')(),semi=+/ (\\d+) half step/.exec(q.explain)[1];
   if(semi>12&&q.explain.indexOf('an octave plus '+CMP[semi])<0){sb('compound name '+semi+': '+q.explain);break;}
   const m=/try (?:string (\\d) \\([^)]*\\)|the same string), (the same fret|(\\d+) frets? (up|back))/.exec(q.hint);if(!m||/cross \\d string/.test(q.hint)){sb('interval hint '+q.hint);break;}const s2=m[1]?+m[1]:q.mark.s,f2=q.mark.f+(m[3]?(m[4]==='up'?1:-1)*(+m[3]):0);if(!q.valid(s2,f2)){sb('interval hint points at no answer: '+q.hint);break;}}
 {const ch=LESSON_NOTES.neckiv.find(c=>c.h==='Every shape in one table'),t=ch&&ch.p.find(x=>x&&x.tbl),row=t&&t.tbl[1].find(r=>r[1]==='20');if(!row||row[5]!=='+5')sb('♭13 three strings up: '+(row&&row[5]));}
 /* Reading: landmark hints reach the note; the dyad explanation names its own fret distance */
 for(let st=-7;st<=14;st++){const h=staffLandmark(st);if(/Every Good|FACE/.test(h))sb('mnemonic hint');const m=/landmark, (.*?), and count (\\d+) letters? (up|down)/.exec(h);if(m){const base=STAFF_MARKS.find(x=>x[1]===m[1])[0];if(base+(m[3]==='up'?1:-1)*(+m[2])!==st)sb('landmark count '+st+' '+h);}else if(!/It is a landmark/.test(h))sb('landmark '+h);}
 S.gid='sight';for(let i=0;i<300;i++){const q=sightDyadQ([0,4])();if(q.ui!=='multi')continue;const [a,b]=q.answer,d=b.f-a.f,txt=/the upper note is (the same fret|same fret|(\\d+) frets? (up|back))/.exec(q.explain);if(!txt){sb('dyad text '+q.explain);break;}const dd=txt[2]?(txt[3]==='up'?1:-1)*(+txt[2]):0;if(dd!==d){sb('dyad distance '+q.explain);break;}}
 /* Scale Runner: the run to the 7th in eighths, beat by beat (1 3 5 7 up, 5 3 1 down, the tonic on beat 3 of bar 2); from the octave on a beat: 1 6 4 2 */
 for(const Pn of SC_SEVEN){const Pz=scPos(0,Pn);for(let j=0;j<3;j++){const ix=scRun(Pz,0,'bh',j);if(!ix)continue;const dg=ix.map(i=>DEG_ORDER[mod(Pz.notes[i].m,12)]),on=dg.filter((_,k)=>k%2===0);if(on.join(' ')!=='1 3 5 7 5 3 1'||ix.length!==13)sb('run to the 7th in position '+Pn+': '+on.join(' '));}}
 {const down=['1','7','6','5','4','3','2','1'];if(down.filter((_,k)=>k%2===0).join(' ')!=='1 6 4 2')sb('descent from the octave');}
 S.gid='scales';for(let i=0;i<60;i++){const q=scModeQ('one')();if(!/fingering changes/.test(q.explain)||/maj7/.test(q.prompt+q.explain)){sb('modes from one root: '+q.explain);break;}}
 for(let i=0;i<60;i++){const q=scModeQ('home')();if(/maj7/.test(q.prompt+q.explain)){sb('lower-case maj7 '+q.explain);break;}}
 /* Modes: the clicks of the symmetric scales; spelling by degree; the parent on the scale's side; no colour claimed for the reference scale */
 if(mdClickSemis('whole-half').join()!=='0,3,6,9'||!mdClickSemis('whole-half').every(x=>MD_FAM.dim.ct.includes(x))||mdClickSemis('half-whole').join()!=='0,3,6,9'||mdClickSemis('whole tone').join()!=='0,4,8')sb('clicks of the symmetric scales');
 {const ch=LESSON_NOTES.modes.map(c=>JSON.stringify(c.p)).join(' ');if(ch.indexOf('the clicks get 1, ♭3, ♭5 and the diminished 7th, every one a chord tone')<0||ch.indexOf('the clicks get 1, ♯9, ♯11 and 13')<0||ch.indexOf('6 notes, so the octave takes 3 beats and the clicks get 1, 3 and ♯5')<0)sb('modes chapter 11 clicks');}
 for(const name of Object.keys(MD))for(const rk of CIRCLE5.concat(['Gb','Db','Ab'])){const ns=mdSpellNotes(rk,name),root=P(rk),T={9:2,11:4,13:6};ns.forEach((x,i)=>{const sem=MD[name].s[i];if(pc(P(x.name.replace('♯','#').replace('♭','b').replace('𝄫','bb')))!==mod(pc(root)+sem,12))sb('spelling pitch '+rk+' '+name+' '+x.name);
   const k=+MD[name].d[i].replace(/[♭♯𝄫]/g,''),L=mod(root.l+(T[k]||k)-1,7);if(x.n&&x.n.l!==L)sb('spelling letter '+rk+' '+name+' '+x.name);if(!x.n&&!x.dbl&&MD[name].d[i].length)sb('respelled without need '+rk+' '+name+' '+x.name);});}
 {const ns=mdSpellNotes('E','half-whole').map(x=>x.name);if(ns[3]!=='G♯'||ns[4]!=='A♯'||ns[6]!=='C♯')sb('E half-whole '+ns.join(' '));}
 if(mdParent('Lydian augmented',9,'A')!=='F♯ melodic minor')sb('A Lydian augmented parent '+mdParent('Lydian augmented',9,'A'));
 S.gid='modes';for(let i=0;i<20;i++){const q=modeSoloQ({set:[['dom','Mixolydian']]})();if(!/the note to bring out/.test(q.explain)||/against the other scales/.test(q.explain)){sb('Mixolydian colour claim '+q.explain);break;}}
 if(GBY.modes.levels[0].n!=='Dorian, Mixolydian, Ionian: the scales of IIm7, V7 and IMaj7')sb('Modes level 1 title');
 /* Arpeggio Runner and Blues Boxes texts */
 if(src.indexOf('Mixolydian ♭2 ♭6')>=0)sb('the old scale name is still written');
 S.gid='boxes';for(let i=0;i<20;i++){const q=boxQ({boxes:[1,2,4],mix:true})();if(q.explain.indexOf('Going up, the minor pentatonic 1 ♭3 4 5 ♭7; coming down, the major pentatonic 1 2 3 5 6')<0){sb('mix explanation '+q.explain);break;}}
 if(/shuffle/.test(GBY.boxes.levels[7].d))sb('Blues Boxes 8: shuffle');
 /* Improvise: the hint follows the spec; the walk-up line of the hint passes every spec that shows it, in every key */
 const soloTake=(S0,k)=>{const F=soloForm(S0,k),chs=F.chs,nb=S0.land?chs.length-1:chs.length,spec=Object.assign({nbars:nb,lens:F.lens},S0),grid=[],slot=[];for(let b=0;b<nb;b++)for(let j=0;j<F.lens[b]*S0.div;j++){grid.push(F.st[b]+j/S0.div);slot.push({b,j});}if(S0.land){grid.push(F.st[nb]);slot.push({b:nb,j:0,land:true});}
   const line=soloWalk(chs,spec),q={solo:{chs,slot,spec},grid,target:line};return soloGrade(q,{notes:line.map((m,i)=>({midi:m,t:grid[i]*1000})),beat:1000,beatStart:0,lat:0});};
 for(const id in SOLO){const S0=SOLO[id],h=soloHint(S0);if(/always works/.test(h))sb('hint still says it always works');
   if(S0.pool==='ct'){if(!/next chord tone/.test(h))sb('chord-tone hint '+id);continue;}if(soloEvery(S0)){if(!/A chord tone on every beat/.test(h))sb('every-beat hint '+id);continue;}
   if(!/walk up the scale/.test(h))sb('walk-up hint '+id);
   for(const k of (S0.forms||AN_KEYS)){const r=soloTake(S0,k);if(!r.ok){sb('the walk-up line fails '+id+' '+k+': '+r.walkWhy.slice(0,2).join('; '));break;}}}
 if(soloBluesTxt()!=='I7 IV7 I7 I7 | IV7 IV7 I7 I7 | V7 IV7 I7 V7')sb('Improvise blues form '+soloBluesTxt());
 if(phraseBluesTxt()!=='I7 I7 I7 I7 | IV7 IV7 I7 I7 | V7 IV7 I7 I7')sb('Phrase and Space blues form '+phraseBluesTxt());
 /* Bends: the explanation fits the kind; the pass message claims only what is measured */
 S.gid='bends';{const v=bendQ('vibrato')(),c=bendQ('curl')(),w=bendQ('whole')();if(/fingers behind/.test(v.explain)||!/first finger alone/.test(c.explain)||!/fingers behind/.test(w.explain))sb('bend explanations');if(/Even vibrato/.test(src))sb('Even vibrato message');}
 /* 1.1 Phrase and Space over the changes */
 {S.gid='phrase';const mk=(T,G)=>({notes:T.map((m,j)=>({midi:m,mf:m,t:G[j]*750+3000})),firstAt:3000,beat:750,beatStart:3000}),ok=(q,T,G)=>micGrade(q,mk(T,G)),seen={};
  if(GBY.phrase.levels.length!==10||GBY.phrase.levels[6].g[0]().key!=='phc-land')sb('Phrase and Space ladder');
  for(const id of Object.keys(PHC))for(let i=0;i<220;i++){const q=phraseChQ(id)(),T=q.target,G0=q.grid,F=q.phc.F,K=q.key+'|'+q.label;seen[id]=seen[id]||new Set();seen[id].add(q.label);
   const r0=ok(q,T,G0);if(!r0.ok){sb('phc example fails '+K+': '+r0.walkWhy.join('; '));break;}
   if(T.some(m=>m<48)||G0[0]!==1){sb('phc example register or start '+K);break;}
   if(ok(q,T.concat([T[0]]),G0.concat([13])).ok){sb('phc: a note in bar 4 passes '+K);break;}
   {const T2=T.slice(),G2=G0.slice(),k=G0.findIndex(g=>g>=16);T2.splice(k,6);G2.splice(k,6);if(ok(q,T2,G2).ok){sb('phc: two notes in a part pass '+K);break;}}
   {const T2=T.slice(),C=phcChordAt(F,G0[2]);let m=T2[2]+1;while(C.sc.concat(C.ct).includes(mod(m,12))||m===T2[1]||m===T2[3])m++;T2[2]=m;if(ok(q,T2,G0).ok){sb('phc: a note outside the scale passes '+K);break;}}
   {const T2=T.slice(),C=phcChordAt(F,8),k=G0.indexOf(8);let m=T2[k];while(mod(m,12)!==C.rp)m--;T2[k]=m;const r=ok(q,T2,G0),msg=r.walkWhy.join(' | ');if(r.ok||msg.indexOf(C.gt.slice(0,2).map(C.name).join(' or '))<0){sb('phc: a landing on the root '+K+' '+msg);break;}}
   {const k=G0.indexOf(24),T2=T.slice(0,k).concat(T.slice(k+1)),G2=G0.slice(0,k).concat(G0.slice(k+1));if(ok(q,T2,G2).ok){sb('phc: no note at the landing passes '+K);break;}}
   const G1=G0.map(g=>g===1||g===17?g-1:g);   /* the example moved to start on beat 1 */
   if(id==='late'&&ok(q,T,G1).ok){sb('phc late: a start on beat 1 passes');break;}
   if(id==='land'){const q9=Object.assign({},q,{phc:{id:'rhy',F}}),r9=ok(q9,T,G0);if(r9.ok||!r9.walkWhy.some(x=>/new notes/.test(x))){sb('phc rhy: identical pitches pass');break;}const q8=Object.assign({},q,{phc:{id:'late',F}});if(!ok(q,T,G1).ok||ok(q8,T,G1).ok){sb('phc: a take that passes level 7 with a start on beat 1 does not fail level 8');break;}}
   if(id==='rhy'){const k=G0.findIndex(g=>g>=16);{const T2=T.slice(),G2=G0.slice();T2.splice(k+2,1);G2.splice(k+2,1);if(ok(q,T2,G2).ok){sb('phc rhy: one note fewer passes');break;}}
     {const G2=G0.slice();G2[k+2]+=1;const T2=T.slice();if(ok(q,T2,G2).ok){sb('phc rhy: a note a beat later passes');break;}}}}
  if(seen.land.size<AN_KEYS.length||seen.rhy.size<Object.keys(PHC_PAIRS).length||seen.std.size<WHOLE.length)sb('phc: not every key or tune was asked '+seen.land.size+' '+seen.rhy.size+' '+seen.std.size);}
 /* 1.2 Reading with the whole position */
 {S.gid='sightread';
  /* the middle-line B of C major in position V (string 4, fret 9) */
  {let n=0;const g=srLineQ({win:[5,8],rhy:1});for(let i=0;i<400;i++)if(g().target.includes(59))n++;if(!n)sb('C in position V never writes the middle-line B');}
  /* every pitch of the fingering of every key and position a level asks, in 600 lines */
  const done=new Set();GBY.sightread.levels.forEach((lv,li)=>lv.g.forEach(gen=>{const o=gen.o;if(!o||!o.win||o.win[0]<1||o.wins)return;const keys=o.key?[].concat(o.key):[null];
    keys.forEach(k=>{const id=(k||'C')+'@'+o.win[0];if(done.has(id))return;done.add(id);const g=srLineQ(Object.assign({},o,{key:k,ties:0,chrom:false,nat:false})),kp=k?READ_KEYS[k][0]:0,need=scPos(kp,o.win[0]).notes.map(x=>x.m),seen=new Set();
      for(let i=0;i<600;i++)g().target.forEach(m=>seen.add(m));const miss=need.filter(m=>!seen.has(m));if(miss.length)sb('L'+(li+1)+' '+id+': never asked '+miss.join(' '));
      if(need.length!==17)sb(id+': the fingering holds '+need.length+' pitches');});}));
  if(done.size<10)sb('fingering coverage checked only '+done.size+' keys and positions');
  /* leaps: a 4th or more in 60 % of lines, never two leaps the same way in a row; no A B A B A anywhere */
  const LV={};GBY.sightread.levels.forEach((lv,li)=>lv.g.forEach((gen,gi)=>{const o=gen.o;if(!o||(!o.win&&!o.wins)||o.charts)return;let withLeap=0,n=0;for(let i=0;i<(o.leap?200:30);i++){const T=gen().target;n++;if(srSeesaw(T)){sb('L'+(li+1)+' g'+gi+': A B A B A');break;}
      const mv=T.slice(1).map((m,j)=>m-T[j]);if(mv.some(d=>Math.abs(d)>=5))withLeap++;if(o.leap&&mv.some((d,j)=>j&&Math.abs(d)>=5&&Math.abs(mv[j-1])>=5&&Math.sign(d)===Math.sign(mv[j-1]))){sb('L'+(li+1)+' g'+gi+': two leaps the same way');break;}}
    if(o.leap){const k='L'+(li+1);LV[k]=LV[k]||[0,0];LV[k][0]+=withLeap;LV[k][1]+=n;}}));
  Object.entries(LV).forEach(([k,v])=>{if(v[0]<0.6*v[1])sb(k+': a leap in only '+v[0]+' of '+v[1]+' lines');});
  [7,12,13,16,19,20,24,25].forEach(L=>GBY.sightread.levels[L-1].g.forEach((g,gi)=>{if(g.o&&!g.o.wins&&!g.o.leap)sb('L'+L+' g'+gi+' without leaps');}));
  [[7,[2,5]],[13,[5,8]],[16,[7,10]],[20,[9,12]]].forEach(([L,w])=>{if(!GBY.sightread.levels[L-1].g.some(g=>g.o&&g.o.bars===4&&g.o.long&&g.o.leap&&g.o.rhy===1&&g.o.win.join()===w.join()))sb('L'+L+': no four-bar line');});
  /* the mixed levels hold what they say */
  const has=(L,f)=>GBY.sightread.levels[L-1].g.some(g=>g.o&&f(g.o));
  [24,25].forEach(L=>{const nb=L===24?4:8;if(!has(L,o=>o.meter==='3/4'&&o.bars===nb)||!has(L,o=>o.swing&&o.bars===nb)||!has(L,o=>o.nat&&o.bars===nb)||!has(L,o=>o.meter==='6/8'&&o.cap===56&&o.bars===nb))sb('L'+L+': the mix is not complete');});
  if(!has(25,o=>o.cells==='s16'&&o.cap===56)||!has(25,o=>o.meter==='C|'&&o.cap===56)||!has(25,o=>o.cells==='tq'&&o.cap===56))sb('L25: sixteenths, cut time or quarter-note triplets missing');
  {const g=GBY.sightread.levels[24].g.find(g=>g.o&&g.o.cap);for(let i=0;i<20;i++){const q=g();if(q.metro>56||q.prompt.indexOf('Tempo: <b>'+q.metro+'</b>')<0){sb('cap: tempo '+q.metro+' '+q.prompt.slice(-60));break;}}}
  /* the shift falls on the first note the first position does not hold */
  GBY.sightread.levels[20].g.forEach(gen=>{for(let i=0;i<120;i++){let q;try{q=gen();}catch(e){sb('shift throws '+e.message);break;}const m=/from position ([IVX]+) to position ([IVX]+)/.exec(q.label),F=ROMAN.indexOf(m[1]),T=ROMAN.indexOf(m[2]),inF=x=>scPos(0,F).notes.some(n=>n.m===x),inT=x=>scPos(0,T).notes.some(n=>n.m===x);
    const ev=q.sr.bars.flatMap(b=>b.ev).filter(e=>!e.rest&&!e.tieFrom),k=ev.findIndex((e,j)=>j&&e.lab);if(k<0){sb('shift: no numeral');break;}
    if(inF(q.target[k])||q.target.slice(0,k).some(x=>!inF(x))||q.target.slice(k).some(x=>!inT(x))){sb('shift at a note the first position holds: '+q.label);break;}}});
  /* Reading: the stretch notes of each position, asked outside the four frets */
  S.gid='sight';const ST={2:[2,1],3:[4,7],4:[4,3],5:[1,9],7:[0],9:[3,8]};
  for(const P in ST){const stn=scPos(0,+P).notes.filter(x=>x.st);if(stn.length!==ST[P][0]||stn.some(x=>x.f!==ST[P][1]))sb('stretch notes of position '+P+': '+stn.map(x=>x.s+'/'+x.f).join(' '));
    const g=sightPosQ([+P,+P+3]);let n=0;for(let i=0;i<300;i++){const q=g();if(!/^sfs-/.test(q.key))continue;n++;const snd=q.snd.note;if(posOf(snd).some(x=>x.f>=+P&&x.f<=+P+3)){sb('a stretch note with a place inside the four frets '+q.key);break;}const d=q.reveal.dots[0];if(!q.valid(d.s,d.f)||!/fb-st/.test(d.cls)||!/a stretch, the hand does not move/.test(q.explain)){sb('stretch question '+q.key);break;}}
    if(ST[P][0]&&(n<20||n>90))sb('position '+P+': '+n+' stretch questions in 300');if(!ST[P][0]&&n)sb('position VII asked a stretch');}
  {const g=sightPosQ([5,8]);let b=0;for(let i=0;i<300;i++){const q=g();if(q.key==='sfs-4-9')b++;}if(!b)sb('position V never asks the B on string 4');}}
 /* 1.3 Scale Runner: whole-position patterns, groups of three and four, fourths */
 {S.gid='scales';
  for(const k of ['C','F','G'])for(const Pn of (k==='C'?SC_ALL:SC_SEVEN)){const Pz=scPos(pc(P(k)),Pn),n=Pz.notes.length;
   for(const kind of ['3','tri','7','g3','g4','4']){const st=SC_ST[kind],span=st.at(-1),G=n-span;
    for(const dir of ['up','down','alt']){const ix=scPattern(n,kind,dir,0,n),ms=ix.map(i=>Pz.notes[i].m);
     if(ix.length!==G*st.length){sb('pattern '+kind+' '+dir+' '+k+' '+Pn+': not every group ('+ix.length+')');continue;}
     if(dir==='up'&&(ix[0]!==0||ix.at(-1)!==n-1))sb('pattern up '+kind+' '+k+' '+Pn+' does not run from the lowest note to the top');
     if(dir==='down'&&(ix[0]!==n-1||ix.at(-1)!==0))sb('pattern down '+kind+' '+k+' '+Pn+' does not run from the top note to the bottom');
     for(let g=0;g<G;g++){const grp=ix.slice(g*st.length,(g+1)*st.length),b=Math.min(...grp),rel=grp.map(i=>i-b).sort((a,c)=>a-c).join();if(rel!==st.join()){sb('group '+g+' of '+kind+' '+dir+': '+grp.join(' '));break;}}
     if(ms.some((m,i)=>i&&m===ms[i-1]))sb('a pitch twice in a row: '+kind+' '+dir+' '+k+' '+Pn);}}}
  const take=(q,T,G)=>{const B=60000/q.metro,bs=100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+(G||q.grid)[i]*B,dur:150})),beat:B,beatStart:bs,firstAt:bs});};
  if(['Groups of three and four','Fourths, sixths, stacked fourths','Thirds, in C','Pentatonics and the blues scale'].some(n=>!GBY.scales.levels.find(l=>l.n===n)))sb('Scale Runner ladder');   /* 28 Nov 2026 (the scale lessons build): by name; the ladder was renamed and reordered since */
  ['Groups of three and four','Thirds, in C','Thirds: C, F and G','Fourths, sixths, stacked fourths','Triads, every position','Seventh chords, every position'].map(n=>GBY.scales.levels.findIndex(l=>l.n===n)+1).forEach(L=>GBY.scales.levels[L-1].g.forEach((g,gi)=>{for(let i=0;i<25;i++){const q=g(),T=q.target,m=/class="rhy r(\\d)"/.exec(q.prompt),div=m?+m[1]:1;
     if(q.grid.some((x,j)=>Math.abs(x-j/div)>1e-9)){sb('L'+L+' g'+gi+': notes are not '+div+' a click');break;}
     if(!take(q,T).ok){sb('L'+L+' g'+gi+': the perfect take fails '+q.key);break;}const w=T.slice(),k2=Math.floor(T.length/2);w[k2]=[1,-1,2,-2,3].map(d=>T[k2]+d).find(x=>x!==T[k2-1]&&x!==T[k2+1]);if(take(q,w).ok){sb('L'+L+' g'+gi+': a wrong note passes');break;}}}));
  {const ks=new Set();for(let i=0;i<120;i++){const q=GBY.scales.levels.find(l=>l.n==='Thirds: C, F and G').g[2]();ks.add(q.label.split(',')[0]+'|'+/<span>([A-G][♭♯]?) major/.exec(q.prompt)[1]);}if(['C','F','G'].some(k=>![...ks].some(x=>x.endsWith('|'+k))))sb('Scale Runner 11: the alternating thirds are not in C, F and G');}
  {const ks=new Set();for(let i=0;i<120;i++){const q=GBY.scales.levels[1].g[2]();ks.add(/<span>([A-G][♭♯]?) major/.exec(q.prompt)[1]);}if(ks.size<3)sb('Scale Runner 2: the bottom-to-top run is not in C, F and G');}}
 /* 1.4 Arpeggio Runner: the whole position, the II–V join, the turns and enclosures on the beat */
 {S.gid='arp';const take=(q,T,G)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+(G||q.grid)[i]*B,dur:150})),beat:B,beatStart:bs,firstAt:bs});};
  for(const gen of GBY.arp.levels[3].g)for(let i=0;i<80;i++){const q=gen();if(!/^arw-/.test(q.key)){sb('whole position fallback');break;}const T=q.target,sy=q.key.split('-')[1],r=/^([A-G][♭♯]?)/.exec(sy)[1],qq=Object.keys(BN_Q).find(x=>r+BN_Q[x]===sy),pcs=chord(P(r.replace('♭','b').replace('♯','#')),qq).map(pc),p0=+q.key.split('-')[2],win=[];
    for(let s=6;s>=1;s--)for(let f=p0;f<=p0+4;f++){const m=OPEN[s]+f;if(pcs.includes(mod(m,12))&&!win.includes(m))win.push(m);}win.sort((a,b)=>a-b);
    if(T.some(m=>!pcs.includes(mod(m,12)))||mod(T[0],12)!==pcs[0]||T.at(-1)!==T[0]||!T.includes(win[0])||!T.includes(win.at(-1))||win.length<7||new Set(T).size!==win.length){sb('whole position '+q.key+': '+q.names.join(' '));break;}
    const hi=T.indexOf(win.at(-1)),lo=T.lastIndexOf(win[0]);if(!(hi<lo)||T.slice(0,hi+1).some((m,j)=>j&&m<=T[j-1])||T.slice(hi,lo+1).some((m,j)=>j&&m>=T[hi+j-1])||T.slice(lo).some((m,j)=>j&&m<=T[lo+j-1])){sb('whole position does not rise, fall and rise '+q.key);break;}
    if(!take(q,T).ok){sb('whole position: the perfect take fails '+q.key);break;}const w=T.slice(),k2=Math.floor(T.length/2);w[k2]=[1,-1,2,-2,3].map(d=>T[k2]+d).find(x=>x!==T[k2-1]&&x!==T[k2+1]);if(take(q,w).ok){sb('whole position: a wrong note passes');break;}
    if(q.metro>(q.grid[1]===0.5?66:80)){sb('whole position tempo');break;}}
  {const seen=new Set(),g=arpTask(['m7'],[0],4,false,true,true);for(let i=0;i<300;i++){const q=g();if(!/2$/.test(q.key))continue;const T=q.target,r=q.key.split('-')[1];seen.add(r);const V=pc(P(r.replace(/m7$/,'').replace('♭','b').replace('♯','#')))+5;
    if(T[4]!==T[3]-1||[1,0,3,2].some((d,j)=>mod(T[4+j],12)!==mod(V+[0,4,7,10][d],12))||T.slice(4).some((m,j)=>j&&m>=T[3+j])){sb('II–V: V7 is not down from its 3rd a half step under '+q.key+' '+q.names.join(' '));break;}}
   if(seen.size<8)sb('II–V: only '+seen.size+' keys');}
  [[9,3.5,0],[10,3.5,1],[11,2.5,0]].forEach(([L,off,close])=>GBY.arp.levels[L-1].g.forEach((g,gi)=>{for(let i=0;i<30;i++){const q=g();if(!/-d$/.test(q.key))break;const T=q.target,n=T.length,base=q.key.slice(0,-2),k=base.split('-').at(-1);
     const und=(L===9?encTriQ({keys:[k],q:/-m-/.test(base)?'m':''}):L===10?encCadQ({keys:[k],dark:/-d-/.test(base)}):encChromQ({keys:[k],kinds:[base.split('-')[2]]}))();
     if(und.key!==base||und.target.join()!==T.join()){sb('displaced line differs from '+base);break;}
     const fig=close?n-1:n;for(let f=3;f<fig;f+=4){const g4=q.grid[f];if(Math.abs(g4-Math.round(g4))>1e-9||(L===11&&mod(g4,2)!==0)){sb(q.key+': figure '+((f+1)/4)+' ends at '+g4);break;}}
     if(L!==11)for(let f=1;f<fig;f+=4)if(q.grid[f]%1){sb(q.key+': a chord tone off the beat');break;}
     if(close&&q.grid[n-1]%4!==0){sb(q.key+': the closing root is not on beat 1');break;}
     if(!take(q,T).ok){sb(q.key+': the perfect take fails');break;}if(take(q,T,und.grid).ok){sb(q.key+': the undisplaced timing passes');break;}}}));
  Object.entries(REORDERS27).forEach(([id,R])=>{const n=R.n+R.nw.length,   /* the levels the game had after this reorder (levels appended or moved later lie outside it) */img=new Set();for(let L=1;L<=R.n;L++)img.add(R.m[L]||L);if(img.size!==R.n||R.nw.some(L=>img.has(L))||img.size+R.nw.length!==n||Math.max(...img,...R.nw)!==n)sb('REORDERS27 '+id+' does not cover the '+n+' levels');});}
 /* PHASE 2 */
 /* 2.1 Improvise: an approach note in level 5, the enclosure, rule faults in long takes */
 {S.gid='improv';const play=(q,T,drop)=>soloGrade(q,{notes:T.map((m,i)=>({midi:m,t:q.grid[i]*1000})).filter((x,i)=>!(drop||[]).includes(i)),beat:1000,beatStart:0,lat:0});
  for(let i=0;i<40;i++){const q=soloQ(SOLO.chr)();const r=play(q,q.target);if(!r.ok){sb('level 5 example fails: '+r.walkWhy.join('; '));break;}
   const k=SOLO.chr.bars('C').length&&4,T=q.target;if(!(!q.solo.chs[0].sc.includes(mod(T[3],12))&&T[4]-T[3]===1)){sb('level 5 example has no approach on beat 4 of bar 1: '+q.names.join(' '));break;}}
  for(let i=0;i<40;i++){const q4=soloQ(SOLO.gt)(),q5=Object.assign({},q4,{solo:Object.assign({},q4.solo,{spec:Object.assign({},q4.solo.spec,{chrom:true,needChrom:true})})}),r=play(q5,q4.target);
   if(q4.target.some((m,j)=>!q4.solo.chs[q4.solo.slot[j].b].sc.includes(mod(m,12))))continue;if(r.ok||r.walkWhy.length!==1||!/no approach note/.test(r.walkWhy[0])){sb('level 4 example on level 5: '+r.walkWhy.join('; '));break;}}
  {const C=soloChord(P('C'),'maj7'),spec={pool:'scale',strong:[0],chrom:true,div:1,nbars:2,lens:[4,4]},slot=[0,1,2,3,4,5,6,7].map(j=>({b:j<4?0:1,j:j%4})),grid=[0,1,2,3,4,5,6,7],q={solo:{chs:[C,C],slot,spec},grid,target:[0,0,0,0,0,0,0,0]};
   const g=T=>soloGrade(Object.assign({},q,{target:T}),{notes:T.map((m,i)=>({midi:m,t:grid[i]*1000})),beat:1000,beatStart:0,lat:0});
   if(!g([64,62,61,59,60,64,67,71]).ok)sb('D D♭ B C refused');if(!g([64,59,62,61,60,64,67,71]).ok)sb('B D D♭ C refused');if(g([64,62,61,59,62,64,67,71]).ok)sb('D♭ B D passes');
   for(const kind of ['above','below','cnf']){const f=encFig(60,encTone(P('C'),'maj',1),kind).map(e=>e.m);if(!g([64].concat(f.slice(0,3),[f[3]],[64,67,71])).ok)sb('Arpeggio Runner '+kind+' figure refused: '+f.join(' '));}}
  {const mk=n=>{const C=soloChord(P('C'),'7','b-I'),nb=n/4,spec={pool:'scale',strong:[0],guide:true,chrom:true,div:1,nbars:nb,lens:Array(nb).fill(4)},slot=[],grid=[];for(let b=0;b<nb;b++)for(let j=0;j<4;j++){slot.push({b,j});grid.push(b*4+j);}
     const T=[];for(let b=0;b<nb;b++)T.push(...(b%2?[70,72,74,76]:[64,65,67,69]));return {q:{solo:{chs:Array(nb).fill(C),slot,spec},grid,target:T},T};};
   const g=(q,T)=>soloGrade(q,{notes:T.map((m,i)=>({midi:m,t:q.grid[i]*1000})),beat:1000,beatStart:0,lat:0});
   {const {q,T}=mk(48);if(!g(q,T).ok)sb('48-slot base fails '+g(q,T).walkWhy[0]);const T1=T.slice();T1[13]=61;const r1=g(q,T1);if(!r1.ok||!/broke a rule and was let through/.test(r1.walkWhy.join()))sb('one fault in 48 slots: '+r1.walkWhy.join('; '));const T2=T1.slice();T2[29]=61;if(g(q,T2).ok)sb('two faults in 48 slots pass');}
   {const {q,T}=mk(32);const T1=T.slice();T1[13]=61;if(g(q,T1).ok)sb('one fault in 32 slots passes');}}}
 /* 2.2 Modes: an own line is a line; the dominant resolves */
 {S.gid='modes';const take=(q,T)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B,dur:150})),beat:B,beatStart:bs,firstAt:bs});};
  const all=Object.keys(MD_FAM).flatMap(f=>MD_FAM[f].m.map(n=>[f,n]));
  for(const [f,n] of all)for(let i=0;i<6;i++){const q=modeSoloQ({set:[[f,n]]})();const r=take(q,q.target);if(!r.ok){sb('own line example fails '+n+': '+r.walkWhy.join('; '));break;}
   const sc=q.msolo.pcs,base=q.target[0];let S1=[];for(let m=base;S1.length<9;m++)if(sc.includes(mod(m,12)))S1.push(m);const up=S1.concat(S1.slice(1,8).reverse()).slice(0,16).concat([S1[0]]);if(take(q,up).ok){sb('the plain scale up and back passes '+n);break;}
   const T=q.target.slice();let m=T[8]+1;while(q.msolo.ct.includes(mod(m,12))||!sc.includes(mod(m,12))||m===T[7]||m===T[9])m++;T[8]=m;if(take(q,T).ok){sb('no chord tone on beat 1 of bar 2 passes '+n);break;}}
  if(GBY.modes.levels.length-(OSJ.modes||[]).length!==12||GBY.modes.levels[11].n!=='The dominant resolves')sb('Modes ladder');
  for(const id of Object.keys(MDR))for(const k of ['C'].concat(MDR_KEYS)){const kp=pc(P(k)),c=modeResLine(kp,id);if(!c.length){sb('no resolving line '+id+' '+k);continue;}const [name,iq]=MDR[id],vp=mod(kp+7,12),I=(iq==='maj'?[0,4,7]:[0,3,7]).map(x=>mod(kp+x,12));
   for(const {L} of c){const r=L.slice(0,8),d=Math.sign(r[1]-r[0]),sc=[];for(let m=30;m<=95;m++)if(MD[name].s.includes(mod(m-vp,12)))sc.push(m);
    if(r.some(m=>!MD[name].s.includes(mod(m-vp,12)))||r.some((m,i)=>i&&sc.indexOf(m)-sc.indexOf(r[i-1])!==d)||!I.includes(mod(L[8],12))||Math.abs(L[8]-L[7])!==1||L.some((m,i)=>i&&m===L[i-1])||Math.min(...L)<48){sb('resolving line '+id+' '+k+': '+L.join(','));break;}
    if(id!=='mix'&&!r.some(m=>[1,3,6,8].includes(mod(m-vp,12)))){sb('no altered note in '+id+' '+k);break;}}}
  GBY.modes.levels[11].g.forEach(g=>{for(let i=0;i<10;i++){const q=g(),T=q.target;if(!take(q,T).ok){sb('resolve: the perfect take fails '+q.key);break;}const w=T.slice();w[4]=[1,-1,2,-2].map(d=>T[4]+d).find(x=>x!==T[3]&&x!==T[5]);if(take(q,w).ok){sb('resolve: a wrong note passes '+q.key);break;}}});}
 /* 2.3 Blues Boxes: runs from the root; over I and IV; the three chords inside the box */
 {S.gid='boxes';
  for(const k of [2,3,4,5])for(const r of BX_ROOTS){const rp=pc(P(r.replace('♯','#'))),B=penBox(rp,k);if(!B)continue;const up=B.spots,r0=up.findIndex(x=>mod(x.m-rp,12)===0),seq=up.slice(r0).concat(up.slice(0,-1).reverse(),up.slice(1,r0+1)).map(x=>x.m);
   if(mod(seq[0]-rp,12)||seq.at(-1)!==seq[0]||up.some(x=>!seq.includes(x.m)))sb('box '+k+' from the root '+r);}
  for(let i=0;i<30;i++){const q=boxQ({boxes:[2,3,4,5],form:'root'})();if(!/-rt$/.test(q.key)||mod(q.target[0]-q.vamp.chords[0].root,12)||q.target.at(-1)!==q.target[0]){sb('root run question '+q.key);break;}}
  for(const r of BX_ROOTS){const rp=pc(P(r.replace('♯','#'))),X=bxIVLine(rp);if(!X){sb('no I–IV line in '+r);continue;}const L=X.L,a=L.slice(0,8),b=L.slice(8);
   if(L.length!==16||a.some(m=>!PMAJ.includes(mod(m-rp,12)))||!a.some(m=>mod(m-rp,12)===4)||b.some(m=>!BX_PENT.includes(mod(m-rp,12)))||!b.some(m=>mod(m-rp,12)===3)||L.some((m,i)=>i&&m===L[i-1])||a[0]<48||mod(a[0]-rp,12))sb('I–IV line '+r+': '+L.join(','));
   const f0=mod(rp-OPEN[6],12);if(!L.every(m=>[f0,f0+12].some(f=>f+3<=16&&[1,2,3,4,5,6].some(s=>m-OPEN[s]>=Math.max(0,f-1)&&m-OPEN[s]<=f+3))&&bxIn(m,X.w)))sb('I–IV line leaves box 1 in '+r);}
  for(const r of BX_ROOTS)for(const id of ['I','IV','V']){const rp=pc(P(r.replace('♯','#'))),X=bxChLine(rp,id);if(!X){sb('no '+id+' arpeggio in '+r);continue;}const L=X.L,cr=X.cr,ct=[0,4,7,10];
   if(L.length!==7||L.some(m=>!ct.includes(mod(m-cr,12)))||L[0]!==L[6]||mod(L[0]-cr,12)||L[0]<48||Math.max(...L)!==L[0]+10||!L.every(m=>bxIn(m,X.w))||X.w[1]-X.w[0]>5)sb(id+' arpeggio '+r+': '+L.join(','));}
  const take=(q,T)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B,dur:150})),beat:B,beatStart:bs,firstAt:bs});};
  [9,10].forEach(L=>GBY.boxes.levels[L-1].g.forEach(g=>{for(let i=0;i<14;i++){const q=g(),T=q.target;if(!take(q,T).ok){sb('boxes L'+L+' perfect take fails '+q.key);break;}const w=T.slice();w[3]=[1,-1,2,-2].map(d=>T[3]+d).find(x=>x!==T[2]&&x!==T[4]);if(take(q,w).ok){sb('boxes L'+L+' wrong note passes');break;}}}));}
 /* PHASE 3 */
 {S.gid='fretboard';if(GBY.fretboard.levels.length!==16||GBY.fretboard.levels[15].n!=='Every root in a position')sb('Fretboard ladder');
  if(GBY.fretboard.levels[6].g.length!==1||GBY.fretboard.levels[7].g.length!==1)sb('Fretboard 7 and 8 still name notes');
  for(let i=0;i<200;i++){const q=GBY.fretboard.levels[7].g[0]();if(PCN[q.snd.note%12].length===1){sb('Fretboard 8 asks a natural '+q.key);break;}}
  for(let i=0;i<400;i++){const q=fbPosQ()(),m=/^fbp-(\\d+)-(\\d+)$/.exec(q.key),p0=+m[1],p=+m[2];if(p0<1||p0>8){sb('fbp window '+q.key);break;}
   const all=[];for(let s=1;s<=6;s++)for(let f=p0;f<=p0+4;f++)if(mod(OPEN[s]+f,12)===p)all.push(s+'/'+f);
   if(q.answer.some(x=>mod(OPEN[x.s]+x.f,12)!==p||x.f<p0||x.f>p0+4)||all.length!==q.answer.length){sb('fbp answer '+q.key);break;}
   const pl=toPlay(q);if(!pl||pl.target.some((x,i)=>i&&x<=pl.target[i-1])||pl.target.length!==new Set(q.answer.map(x=>OPEN[x.s]+x.f)).size){sb('fbp played form '+q.key);break;}}}
 {S.gid='neckiv';if(GBY.neckiv.levels.length!==6)sb('Intervals on the Neck ladder');
  for(const tens of [false,true])for(let i=0;i<400;i++){const q=nivNameQ(tens)(),m=/^nin-(\\d+)-(\\d)-(\\d)$/.exec(q.key),iv=NIV.find(x=>x[1]===q.answer),d=q.snd.seq[1]-q.snd.seq[0];
   if(!m||!iv||iv[2]!==d||+m[1]!==d){sb('nin interval '+q.key+' '+q.answer);break;}if(q.choices.filter(c=>c===q.answer).length!==1||q.choices.some((c,j)=>j&&NIV.find(x=>x[1]===c)[2]<=NIV.find(x=>x[1]===q.choices[j-1])[2])){sb('nin row');break;}
   const dots=/<circle[^>]*>/g;if(tens&&![6,5,4].includes(+m[2])){sb('nin tension root string');break;}}}
 {S.gid='bends';const nmM=n=>pc(P(n.replace(/-?\\d+$/,'').replace('♯','#').replace('♭','b').replace('𝄪','##').replace('𝄫','bb')));
  for(const id of Object.keys(BEND_DEG))for(const cue of [true,false]){const g=bendDegQ([id],{cue});for(let i=0;i<40;i++){const q=g(),st=BEND_DEG[id][1];if(st==='curl')break;const c={half:100,whole:200,release:200,bendvib:200}[st];
     if(q.target[1]-q.target[0]!==c/100||nmM(q.names[0])!==mod(q.target[0],12)||nmM(q.names[1])!==mod(q.target[1],12)){sb('bend '+id+' '+q.names.join(' ')+' '+q.target.join(' '));break;}
     if(BEND_DEG[id][0]===3){const rk=/ in ([A-G][♯♭]?)/.exec(q.label)[1],r6=mod(pc(P(rk.replace('♯','#').replace('♭','b')))-OPEN[6],12)||12,f=q.bendStart-OPEN[+/String (\\d)/.exec(q.prompt)[1]];if(mod(f-r6,12)===0){sb('♭3 bend at the first fret of the box');break;}}
     if(!cue){const n0=played.length;q.audio();const got=played.slice(n0);if(got.includes(q.target[0])||got.includes(q.target[1])||!/no target is played/.test(q.prompt)||!/-n$/.test(q.key)){sb('cue-free bend '+q.key+' plays '+got.join(','));break;}}}}}
}
/* ===== THE REVIEW OF THE EAR GAMES: BUILD 1 (23 Nov 2026, brief .claude/ear-build-1.md) ===== */
{const sb=m=>{bad++;console.log('EAR1',m);},K12=['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'],asc=s=>s.replace(/♯/g,'#').replace(/♭/g,'b');
 const N=ms=>ms.map((m,i)=>({midi:m,mf:m,t:3000+i*900,dur:600}));
 const take=(q,T)=>{if(!q.metro)return micGrade(q,{notes:N(T),firstAt:3000});const B=60000/q.metro,bs=4*B+100,tg=q.target;let k=-1;const ns=[];T.forEach((m,i)=>{ns.push({midi:m,mf:m,t:bs+(q.grid?q.grid[i]:i)*B,dur:150});});return micGrade(q,{notes:ns,beat:B,beatStart:bs,firstAt:bs});};
 const lv=(id,L,gi)=>{S.gid=id;return GBY[id].levels[L-1].g[gi||0];};
 /* --- the bass is a line --- */
 for(const name of Object.keys(PROGS))for(const k of K12){const t=pc(P(k)),pcs=PROGS[name].map(c=>mod(t+c[0],12)),bl=bassLine(pcs),st=bl.map((m,i)=>i?m-bl[i-1]:0).slice(1).join(',');
   /* C2–C4; one line (four roots falling 14 half steps from D♭: Im – ♭VI – ♭III – ♭VII in D♭ minor, VIm – IV – I – V in E) cannot lie between them and starts on C♯4 */
   if(bl.length!==pcs.length||bl.some((m,i)=>mod(m,12)!==pcs[i]||m<36||m>61)||(Math.max(...bl)>60&&Math.max(...bl)-Math.min(...bl)<14)){sb('bass pitch class or range: '+name+' in '+k+' '+bl.join(' '));continue;}
   /* a line that spans 14 half steps or less when every root goes to the next by the shorter way is set as a whole: no step larger than a 5th (a longer one, a cycle, turns back at the edges) */
   {let m=0,lo=0,hi=0;for(let i=1;i<pcs.length;i++){let d=mod(pcs[i]-pcs[i-1],12);if(d>6)d-=12;m+=d;lo=Math.min(lo,m);hi=Math.max(hi,m);}if(hi-lo<=14&&bl.some((x,i)=>i&&Math.abs(x-bl[i-1])>7))sb('bass step larger than a 5th: '+name+' in '+k+' '+st);}
   if(name==='ii – ♭II7 – I (tritone sub)'&&st!=='-1,-1,0')sb('tritone substitute bass in '+k+': '+st);
   if(name==='I – IV – V – I'&&bl[2]-bl[1]!==2)sb('IV to V in '+k+': '+st);
   if(name==='i – ♭VII – ♭VI – V7'&&st!=='-2,-2,-1')sb('minor line in '+k+': '+st);}
 {S.gid='earprog';played.length=0;const chs=progChords('C','ii – ♭II7 – I (tritone sub)');playChords(chs,1);const bl=bassLine(chs.map(c=>c.bass));if(!bl.every(m=>played.includes(m)))sb('playChords does not play the bass line');}
 /* --- 1. levels that gave their answer away --- */
 {const seen=new Set();for(const gi of [0,1])for(let i=0;i<150;i++){const q=lv('eariv',8,gi)();seen.add(q.label.replace(/.*\\(/,'').replace(')',''));if(q.prompt!=='Listen: two notes. Name the interval.'||/going|at once|rising|falling|together/i.test(q.visual)||/rising|falling|going|together/i.test(q.hint)){sb('Hear the Interval 8 announces the form: '+q.prompt+' / '+q.visual);break;}if(!/^ei-[A-Za-z0-9]+-(mixed|harm)$/.test(q.key)){sb('Hear the Interval 8 key '+q.key);break;}}
  if(seen.size!==3)sb('Hear the Interval 8 forms: '+[...seen].join('|'));if(!/not announced/.test(GBY.eariv.levels[7].d))sb('Hear the Interval 8 description');
  for(const L of [1,6,7]){const q=lv('eariv',L)();if(!/rising|falling|together/.test(q.prompt))sb('Hear the Interval '+L+' lost its prompt');}}
 for(const x of IVL){const M=IV_MOVE[x[0]];if(!M||!M.u.length||!M.d.length){sb('no degree move for '+x[0]);continue;}
   M.u.forEach(p=>{const a=p.split(' ');if(mod(DEG_SEMI[a[1]]-DEG_SEMI[a[0]],12)!==x[2]%12)sb('rising move '+x[0]+': '+p);});M.d.forEach(p=>{const a=p.split(' ');if(mod(DEG_SEMI[a[0]]-DEG_SEMI[a[1]],12)!==x[2]%12)sb('falling move '+x[0]+': '+p);});}
 for(let L=1;L<=8;L++)for(let i=0;i<40;i++){const q=lv('eariv',L,i%GBY.eariv.levels[L-1].g.length)();if(/tune/i.test(q.explain+q.hint)){sb('a tune in Hear the Interval '+L);break;}if(/ up to | down to /.test(q.explain)===false){sb('no degree move in the explanation, level '+L);break;}
   if(/harmonic|descending/.test(q.label)&&/fill in the scale steps/.test(q.hint)){sb('falling or harmonic hint says to count steps, level '+L);break;}}
 if(typeof IVREF!=='undefined')sb('IVREF is still there');if(typeof LESSONS!=='undefined'&&/tune|song/i.test(JSON.stringify(LESSONS.eariv)))sb('a tune on the lesson card of Hear the Interval');
 {const pr=new Set(),vis=new Set();for(let i=0;i<200;i++){const q=lv('earmode',4)();pr.add(q.prompt.replace(/<b>.*?<\\/b>/,''));if(/two|three/i.test(q.prompt+q.visual)){sb('Hear the Mode 4 counts the chords: '+q.prompt);break;}}if(pr.size!==1)sb('Hear the Mode 4 has '+pr.size+' prompts');if(/^Two-chord/.test(GBY.earmode.levels[3].d))sb('Hear the Mode 4 description');}
 {const rows=new Set();let alsoSeen=0;for(let i=0;i<300;i++){const q=lv('earmode',6,0)();rows.add(q.choices.join(' '));if(!q.choices.includes(q.answer))sb('Hear the Mode 6 answer not in the row');if(q.also){alsoSeen++;if(!q.also.every(a=>q.choices.includes(a)&&check(q,a))||check(q,q.choices.find(c=>c!==q.answer&&!q.also.includes(c)))){sb('Hear the Mode 6 second true note');break;}}
    played.length=0;q.audio();if(played.length!==20||mod(played[16]-played[0],12)!==0){sb('Hear the Mode 6 phrase: '+played.length+' notes, ends '+played[16]);break;}}
  if(rows.size!==1||[...rows][0]!=='♭3 ♭6 ♭7')sb('Hear the Mode 6 rows: '+[...rows].join(' | '));if(!alsoSeen)sb('Hear the Mode 6: no ♭VI or ♭III seen');}
 {let ii=0;for(let i=0;i<400;i++){const q=lv('earmode',5)();if(q.choices.join(' ')!=='2nd 3rd 4th'||!q.choices.includes(q.answer)){sb('Hear the Mode 5 row '+q.choices.join(' '));break;}played.length=0;q.audio();
    if(played.length!==20||mod(played[16]-played[0],12)!==0){sb('Hear the Mode 5: every chord a triad, five chords, ending on I: '+played.length);break;}if(/II°/.test(q.explain)){ii++;if(!/IIm7♭5/.test(q.key)){sb('Hear the Mode 5 key changed: '+q.key);break;}}else if(/IIm7♭5|II°/.test(q.key)){sb('key and chord disagree '+q.key);break;}}if(!ii)sb('no borrowed II seen');}
 {const pr=new Set();for(let i=0;i<300;i++){const q=lv('earprog',13)();pr.add(q.prompt.replace(/<b>.*?<\\/b>/,''));if(/Eight bars|whole chorus|\\d+ bars/.test(q.prompt+q.visual)){sb('Hear the Progression 13 names the length: '+q.prompt+q.visual);break;}}if(pr.size!==1)sb('Hear the Progression 13 has '+pr.size+' wordings');
  const fl=FORM_LAB('rhythm changes A');if(!/turnaround/.test(fl)||!/twice/.test(fl)||/rhythm changes/.test(fl))sb('the turnaround is still called rhythm changes: '+fl);if(/rhythm changes/i.test(GBY.earprog.levels[12].n))sb('level 13 name');}
 {for(const id of Object.keys(EP_DEV)){const D=EP_DEV[id];D.seq.forEach(seq=>{const chs=epDevChords(D,0,seq);if(seq.length!==5||chs.length!==5)sb('device '+id+' has '+chs.length+' chords');});}
  const p7=epDevChords(EP_DEV.pass7,0,EP_DEV.pass7.seq[0]),tops=p7.map(c=>Math.max(...c.up));if(mod(tops[0],12)!==0||tops[0]-tops[1]!==2||tops[1]-tops[2]!==1||mod(tops[2],12)!==9)sb('passing 7th: the top voice is '+tops.join(' '));
  const cl=epDevChords(EP_DEV.cliche,0,EP_DEV.cliche.seq[0]),ct=cl.map(c=>Math.max(...c.up));if(mod(ct[0],12)!==0||ct[0]-ct[1]!==1||ct[1]-ct[2]!==1||ct[2]-ct[3]!==1)sb('line cliché: the top voice is '+ct.join(' '));
  [p7,cl].forEach(chs=>chs.forEach(c=>{if(c.up.some(m=>!c.pcs.includes(mod(m,12))))sb('a voiced note outside its chord');}));
  const seen=new Set();for(let i=0;i<200;i++){const q=lv('earprog',17)();seen.add(q.key);if(!/five chords/.test(q.prompt)||q.choices.length!==4){sb('Hear the Progression 17 prompt');break;}played.length=0;q.audio();}if(seen.size!==5)sb('devices seen: '+[...seen].join(' '));}
 {for(let i=0;i<60;i++){const a=lv('earprog',18)(),b=lv('earprog',19)();if(!/hbars/.test(a.visual)){sb('level 18 lost its printed degrees');break;}if(/hbars|bar 1/.test(b.visual)||!/^hz-/.test(b.key)){sb('level 19 prints the degrees');break;}played.length=0;b.audio();if(played.length<20){sb('level 19: no cadence before the melody');break;}}
  if(!/shown/.test(JSON.stringify(LEVEL_NOTES.earprog[17]))||!/no longer shown/.test(JSON.stringify(LEVEL_NOTES.earprog[18])))sb('the two harmonise notes do not say what is shown');}
 {const dn=progName('I – ♭III7 – ♭VI7 – ♭II7 (Dameron turnaround)');if(/Dameron/.test(dn)||!/tritone substitutes/.test(dn))sb('shown name of the turnaround with tritone substitutes: '+dn);if(!PROGS['I – ♭III7 – ♭VI7 – ♭II7 (Dameron turnaround)'])sb('the PROGS key changed');
  for(const L of [9,10,12])for(let i=0;i<60;i++){const q=lv('earprog',L,i%GBY.earprog.levels[L-1].g.length)();if(/[A-G][♯♭]?dim/.test(q.explain+(q.reveal||''))){sb('“dim” beside “°” in level '+L+': '+q.explain);break;}}
  if(/I – VI7 – IIm7 – V7 is the plain one/.test(JSON.stringify(LEVEL_NOTES.earprog[11])))sb('level 12 note names the wrong plain turnaround');
  for(let i=0;i<60;i++){const q=lv('earprog',14,0)();if(/substitute<\\/b>|carries a <b>substitute/.test(q.prompt)){sb('level 14 still calls every change a substitute');break;}}}
 /* --- 2. texts --- */
 {const all=['1','♭2','2','♭3','3','4','♯4','5','♭6','6','♭7','7'],sen=new Set(all.map(d=>degPull(d,false)));if(sen.size!==all.length)sb('degrees share an explanation');all.forEach(d=>{if(degPull(d,false).indexOf(d+' ')!==0)sb('degPull '+d);});
  if(!/down a half step to 3/.test(degPull('4',false))||!/up a half step to 1/.test(degPull('7',false))||!/down a half step to 6/.test(degPull('♭7',false))||!/up a half step to 5/.test(degPull('♯4',false))||!/down a half step to 5/.test(degPull('♭6',true)))sb('a pull is wrong');
  for(let i=0;i<80;i++){const q=lv('eardeg',8)();if(!/half step/.test(q.hint)||/sing up the scale until you land/.test(q.hint)){sb('Hear the Degree 8 hint');break;}if(q.explain.indexOf(degPull(q.answer,false))<0){sb('Hear the Degree 8 explanation');break;}}
  for(const L of [6,7,9])for(let i=0;i<10;i++){const q=lv('eardeg',L,0)();if(/by how much/.test(q.explain)){sb('dictation explanation measures intervals');break;}}
  if(/all twelve/.test(JSON.stringify(LESSON_NOTES.eardeg.map(c=>c.p.filter(x=>typeof x==='string')))))sb('notes of Hear the Degree still say “all twelve”');}
 {for(let i=0;i<300;i++){const q=lv('earchord',5)();if(/^sus/.test(q.answer)&&(/Listen for the 3rd first/.test(q.explain)||!/no 3rd/.test(q.explain))){sb('sus chord explained by its 3rd: '+q.explain);break;}if(/is that 3rd bright/.test(q.hint)||!/no 3rd/.test(q.hint)){sb('level 5 hint');break;}}
  for(let i=0;i<120;i++){const q=lv('earchord',6,0)();if(/Listen for the 3rd first/.test(q.explain)||!/seventh chord underneath/.test(q.explain)||!/seventh chord underneath/.test(q.hint)){sb('extension explained by its 3rd: '+q.explain);break;}}
  if(EARQ['m7♭5'].indexOf('m7♭5')!==0||EARQ['m(maj7)'].indexOf('m(Maj7)')!==0||/m\\(maj7\\)/.test(GBY.earchord.levels[3].d))sb('m7♭5 and m(Maj7): one naming');}
 {if(topTens({deg:4,q:'m7'},null,false).join()!=='5'||topTens({deg:2,q:'m7'},null,false).join()!=='2,5'||topTens({deg:9,q:'m7'},null,false).join()!=='2,5')sb('tensions on the minor sevenths of the key');
  const sub=topTens({deg:1,q:'7'},{deg:0,q:'maj7'},false);if(sub.includes(1)||sub.join()!=='2,6,9')sb('tritone substitute tensions '+sub);
  if(!topTens({deg:9,q:'7'},{deg:2,q:'m7'},false).includes(1)||topTens({deg:7,q:'7'},{deg:0,q:'maj7'},false).includes(1)||!topTens({deg:7,q:'7'},{deg:0,q:'m'},true).includes(1))sb('♭9 only on a dominant that resolves to a minor chord');
  const MAJ=[0,2,4,5,7,9,11];let six=0;for(const name of POP_PROGS.concat(SEV_PROGS))for(let i=0;i<120;i++){const k=R(OUTER_KEYS),t=pc(P(k)),chs=outerChords(k,name);chs.forEach((c,j)=>{const dia=CH[c.q].every(x=>MAJ.includes(mod(c.deg+IV[x][1],12))),top=mod(c.top-t,12),ts=mod(c.top-c.bass,12);
     if(dia&&!MAJ.includes(top))sb('a note outside the key on top of a chord of the key: '+name+' chord '+(j+1)+' top '+top);
     if(c.q==='7'&&ts===1){const nx=chs.slice(j+1).find(z=>z.deg!==c.deg||z.q!==c.q);if(c.deg===1||!nx||!/^m(?!aj)/.test(nx.q)||mod(nx.deg-c.deg,12)!==5)sb('♭9 on a dominant that does not resolve to a minor chord: '+name);}
     if(c.q==='maj7'&&ts===0){six++;if(!c.as6||c.pcs.includes(mod(c.bass+11,12))||!c.pcs.includes(mod(c.bass+9,12)))sb('root on top of a major seventh chord with its 7th: '+name);}});}
  if(!six)sb('no root on top of a Maj7 seen');
  const rows=new Set();for(let i=0;i<300;i++){const q=lv('outer',3)();rows.add(q.choices.join(' '));if(!q.choices.includes(q.answer))sb('Bass & Top 3 answer');}if(rows.size!==1)sb('Bass & Top 3 has '+rows.size+' rows: '+[...rows].join(' | '));
  const r5=new Set();for(let i=0;i<300;i++){const q=lv('outer',5)();r5.add(q.choices.join(' '));if(q.choices.includes('6')||!q.choices.includes(q.answer)){sb('Bass & Top 5 offers 6');break;}if(/the <b>[1357]<\\/b> of the chord/.test(q.explain)){sb('“the 5 of the chord”');break;}}if(r5.size!==1)sb('Bass & Top 5 rows '+[...r5].join(' | '));
  for(const L of [1,2,4,6]){const tk=new Set();GBY.outer.levels[L-1].g.forEach((g,gi)=>{for(let i=0;i<80;i++)tk.add(lv('outer',L,gi)().tokens.join(' '));});if(tk.size!==1)sb('Bass & Top '+L+': the token row changes with the answer');}
  for(let i=0;i<120;i++){const q=lv('outer',6,i%2)();if(/9th/.test(q.explain)){sb('“9th” beside 11 and 13');break;}}}
 {for(let i=0;i<80;i++){const q=lv('sing',3)();played.length=0;q.audio();if(q.prompt.indexOf('('+nameOf(played[0])+')')<0){sb('Sing It 3 names another octave than it plays: '+q.prompt);break;}if(/tune/i.test(q.hint+q.explain)){sb('a tune in Sing It 3');break;}}
  for(const L of [1,2,5,6])for(let i=0;i<80;i++){const q=lv('sing',L)(),d=q.degs[0];if(d==='1'&&/walk|step up/.test(q.hint)){sb('Sing It: a walk to 1');break;}if(/step up the scale to [♭♯]/.test(q.hint)||(/[♭♯]/.test(d)&&L===6&&!/half step/.test(q.hint))){sb('Sing It '+L+' hint for '+d+': '+q.hint);break;}}
  for(const gi of [0,1])for(let i=0;i<60;i++){const q=lv('sing',8,gi)();if(q.degs.some((d,j)=>d!==DEG_ORDER[mod(q.target[j]-q.tonicPc,12)])){sb('Sing It 8: a label that is not a degree of the key: '+q.degs.join(' '));break;}}
  if(/^♭2 ♭3 ♯4 ♭6 ♭7 against/.test(GBY.sing.levels[5].d))sb('Sing It 6 description');}
 {const idx=q=>q.key.replace(/^ss-\\d+-/,'').split('.').map(Number);
  for(let i=0;i<400;i++){const a=idx(lv('sightsing',5)()),b=idx(lv('sightsing',6)()),c=idx(lv('sightsing',8)());if(!(a.includes(-1)||a.includes(7))){sb('Sing the Page 5 without the 7 below or the tonic above: '+a);break;}if(!b.some((x,j)=>j&&Math.abs(x-b[j-1])>1)){sb('Sing the Page 6 without a skip: '+b);break;}if(!c.some(x=>x===5||x===6||x===-1)){sb('Sing the Page 8 without ♭6, ♭7 or the raised 7: '+c);break;}}
  if(!/pitches checked/.test(GBY.sightsing.levels[8].n))sb('Sing the Page 9 name');}
 {const gr=TUNES.find(t=>t.id==='godrest');if(gr.ph.length!==2||!/ 1$/.test(gr.ph[0])||!/^b7,/.test(gr.ph[1]))sb('God Rest Ye Merry, Gentlemen: the phrase split');
  let dor=0;for(let i=0;i<300;i++){const q=lv('tunes',3)();if(/^tu-(scar|sailor)-/.test(q.key)){dor++;if(!/Dorian/.test(q.explain)){sb('a Dorian tune called minor in its explanation');break;}}}if(!dor)sb('no Dorian tune seen');
  for(let i=0;i<40;i++){const q=lv('tunes',10)();if(/the whole of|whole tune/.test(q.prompt+q.label)||!/stored|one phrase/.test(q.prompt)||/From memory/.test(q.prompt)){sb('Tunes by Ear 10 wording: '+q.prompt.slice(0,90));break;}if(!/^tu-[a-z]+-all$/.test(q.key)){sb('key '+q.key);break;}}
  for(let i=0;i<20;i++){const q=lv('tunes',9)();if(/From memory/.test(q.prompt)){sb('Tunes by Ear 9 says from memory');break;}}}
 {let n=0;for(let i=0;i<1500;i++){const q=lv('cr',7)();n++;if(!q.degs.some(d=>/♯/.test(d))&&!q.degs.some(d=>/♭/.test(d))){sb('Call & Response 7 without a chromatic note: '+q.label);break;}
    const root=P(asc(/ in ([A-G][♯♭]?) major/.exec(q.label)[1]));q.degs.forEach((d,j)=>{const m=/^♯(\\d)$/.exec(d);if(m&&P(asc(q.names[j])).l!==mod(root.l+(+m[1])-1,7))sb('a ♯'+m[1]+' named '+q.names[j]+' in '+nm(root));});}}
 /* --- 3. the voice: the method is allowed --- */
 {S.gid='sing';const T=p=>60+p;let seenM=0;
  for(let i=0;i<120;i++){const q=lv('sing',[1,2,5,6][i%4])(),m=q.target[0];if(!q.voice||q.contour){sb('one-note voice question flags');break;}
    if(!micGrade(q,{notes:N([m])}).ok||!micGrade(q,{notes:N([m-12])}).ok||!micGrade(q,{notes:N([m+12])}).ok){sb('a single sung note in any octave');break;}
    if(!micGrade(q,{notes:N([T(q.tonicPc),m])}).ok){sb('the tonic, then the right note, fails');break;}if(!micGrade(q,{notes:N([T(q.tonicPc),T(q.tonicPc)+2,m])}).ok){sb('a walk to the right note fails');break;}
    const w=m+(mod(m+1-q.tonicPc,12)===0?2:1);if(micGrade(q,{notes:N([m,w])}).ok){sb('the right note, then a wrong last note, passes');break;}}
  for(const [id,L,gi] of [['sing',7,0],['sing',7,1],['sing',8,0],['sing',8,1],['sing',10,0],['sing',11,0],['sightsing',1,0],['sightsing',6,0],['sightsing',8,0]])for(let i=0;i<40;i++){const q=lv(id,L,gi)(),t=q.target;if(!q.voice||q.tonicPc==null){sb('voice line flags '+id+' '+L);break;}
    if(!micGrade(q,{notes:N(t)}).ok){sb('a voice line fails its own notes '+id+' '+L);break;}let lead=t[0]-mod(t[0]-q.tonicPc,12);if(lead===t[0])lead-=12;
    const r=micGrade(q,{notes:N([lead].concat(t))});if(!r.ok){sb('a leading tonic before a right line fails: '+id+' '+L+' '+q.label);break;}if(mod(lead-t[0],12)!==0)seenM++;
    const wr=t[0]+[1,2,3].find(o=>mod(t[0]+o-q.tonicPc,12)!==0&&t[0]+o!==t[1]);if(micGrade(q,{notes:N([wr].concat(t))}).ok){sb('a leading wrong note before a right line passes: '+id+' '+L);break;}
    if(micGrade(q,{notes:N([lead,lead+7].concat(t))}).ok&&mod(lead+7-t[0],12)!==0){sb('two extra notes before a line pass');break;}}
  if(!seenM)sb('no leading tonic different from the first note was tried');
  for(let i=0;i<60;i++){const q=lv('sing',3)(),m=q.target[0],g=m-q.from.up;if(!micGrade(q,{notes:N([m])}).ok||!micGrade(q,{notes:N([m-12])}).ok||!micGrade(q,{notes:N([g,m])}).ok){sb('Sing It 3: the right note fails');break;}if(micGrade(q,{notes:N([g,m-12])}).ok){sb('“'+q.label+'”: the given note and then the note below it passes');break;}}}
 /* --- 4. any octave, but the shape must be right --- */
 {const list=[['tunes',1,0],['tunes',2,0],['tunes',4,0],['tunes',7,0],['tunes',9,0],['cr',1,0],['cr',3,0],['cr',4,0],['cr',5,0],['cr',7,0],['cr',8,0],['cr',9,0],['sing',7,0],['sing',8,0],['sing',10,0],['sightsing',3,0],['sightsing',7,0],['sightsing',9,0],['outer',7,0],['outer',8,0],['eariv',11,0]];let flips=0;
  for(const [id,L,gi] of list)for(let i=0;i<25;i++){const q=lv(id,L,gi)(),t=q.target,ex=t.filter((m,j)=>!j||m!==t[j-1]);if(ex.length<2)continue;if(!q.contour||!q.octaveFree){sb('no contour on '+id+' '+L+' '+q.key);break;}
    if(!take(q,t).ok||!take(q,t.map(m=>m+12)).ok||!take(q,t.map(m=>m-12)).ok){sb('a phrase in another octave fails: '+id+' '+L+' '+q.key);break;}
    const j=t.findIndex((m,k)=>k&&m!==t[k-1]),fl=t.map((m,k)=>k>=j?m-12:m);if(q.targets&&q.targets.length>1)continue;const r=take(q,fl);flips++;if(r.ok){sb('a line with one leap turned over passes: '+id+' '+L+' '+q.key);break;}if(!r.shapeWhy||!/notes \\d+ and \\d+/.test(r.shapeWhy)){sb('no word on the note that went the wrong way: '+id+' '+L);break;}}
  if(flips<300)sb('too few turned lines tried: '+flips);
  let hb=null;S.gid='tunes';for(let i=0;i<4000&&!hb;i++){const q=GBY.tunes.levels[0].g[0]();if(q.key==='tu-birthday-2')hb=q;}
  if(!hb)sb('Happy Birthday, phrase 3, not found');else{const t=hb.target,j=t.findIndex((m,k)=>k&&m-t[k-1]===12);if(j<0)sb('Happy Birthday phrase 3 has no octave leap: '+t.join(' '));else{if(!take(hb,t).ok||!take(hb,t.map(m=>m-12)).ok)sb('Happy Birthday phrase 3 as written fails');const r=take(hb,t.map((m,k)=>k>=j?m-12:m));if(r.ok)sb('Happy Birthday phrase 3 without its octave leap passes');else if(!r.shapeWhy)sb('Happy Birthday: the feedback does not name the leap');}}
  let hbt=null;for(let i=0;i<4000&&!hbt;i++){const q=GBY.tunes.levels[6].g[0]();if(q.key==='tu-birthday-2t')hbt=q;}if(!hbt)sb('Happy Birthday phrase 3 in time not found');else{const t=hbt.target,j=t.findIndex((m,k)=>k&&m-t[k-1]===12);if(j<0||!take(hbt,t).ok||take(hbt,t.map((m,k)=>k>=j?m-12:m)).ok)sb('Happy Birthday phrase 3 in time: the octave leap');}
  const two=M({key:'x',label:'x',prompt:'x',explain:'x',target:[60,67],octaveFree:true,contour:true,names:['C','G'],degs:['1','5']});S.gid='cr';
  if(!micGrade(two,{notes:N([60,67])}).ok||!micGrade(two,{notes:N([48,55])}).ok||!micGrade(two,{notes:N([72,79])}).ok)sb('a 5th above in three octaves');const r4=micGrade(two,{notes:N([60,55])});if(r4.ok||!/goes up a perfect 5th/.test(r4.shapeWhy||'')||!/went down a perfect 4th/.test(r4.shapeWhy||''))sb('a 5th above played a 4th below: '+r4.ok+' '+r4.shapeWhy);
  for(const [id,L] of [['eardeg',4],['earmode',7],['sing',1],['sing',4],['sing',12]]){const q=lv(id,L)(),m=q.target[0];if(q.contour||!micGrade(q,{notes:N([m])}).ok||!micGrade(q,{notes:N([m+12])}).ok||!micGrade(q,{notes:N([m-24])}).ok||micGrade(q,{notes:N([m+1])}).ok)sb('a single-note question changed: '+id+' '+L);}
  {const q=lv('sing',9)();if(q.contour||!micGrade(q,{notes:[{midi:q.target[0],mf:q.target[0],t:3000,dur:600,atk:true},{midi:q.target[0]-12,mf:q.target[0]-12,t:4200,dur:600,atk:true}]}).ok)sb('sing it, then play it: the two octaves');}
  for(const g of GAMES)if(!CONTOUR_GAMES.includes(g.id)){S.gid=g.id;let hit=false;g.levels.forEach(l=>l.g.forEach(gen=>{if(hit)return;try{for(let i=0;i<3;i++){const q=gen();if(q&&q.contour){hit=true;sb('contour set outside the ear games: '+g.id);}}}catch(e){}}));}
  for(let i=0;i<60;i++){const q=lv('outer',7)();if(q.target.join()!==bassLine(q.target.map(m=>mod(m,12))).join()){sb('Bass & Top 7: the target is not the bass line as played');break;}}
  for(let i=0;i<40;i++){const q=lv('eariv',11)(),t=q.target;if(micGrade(q,{notes:N([t[0],t[1]-12])}).ok){sb('Play the tension: the simple interval passes');break;}}}
 S.gid='fretboard';}
/* ===== THE REVIEW OF THE EAR GAMES: BUILD 2 (23 Nov 2026, brief .claude/ear-build-2.md) ===== */
{const sb=m=>{bad++;if(bad<40)console.log('EAR2',m);},asc2=s=>s.replace(/♯/g,'#').replace(/♭/g,'b');
 const N=(ms,t0)=>ms.map((m,i)=>({midi:m,mf:m,t:(t0||3000)+i*900,dur:600}));
 const lv=(id,L,gi)=>{S.gid=id;return GBY[id].levels[L-1].g[gi||0];};
 const strip=h=>String(h).replace(/<b>[^<]*<\\/b>/g,'#').replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').trim();
 /* --- the ladders --- */
 if(GBY.sing.levels.length-(OSJ.sing||[]).length!==16||GBY.earprog.levels.length!==24||GBY.outer.levels.length!==12)sb('level counts: sing '+GBY.sing.levels.length+' earprog '+GBY.earprog.levels.length+' outer '+GBY.outer.levels.length);
 if(GBY.sing.levels[11].n!=='Find the tonic'||GBY.earprog.levels[18].n!=='Harmonise a melody: the whole key'||GBY.outer.levels[7].n!=='Play the top')sb('a new level is not appended');
 [['sing',12,'k'],['sing',13,'k'],['sing',14,'a'],['earprog',19,'k'],['earprog',20,'a'],['earprog',21,'k'],['earprog',22,'a'],['earprog',23,'k'],['outer',8,'k'],['outer',9,'a']].forEach(([g,i,f])=>{const n=LEVEL_NOTES[g][i];if(!n||!n[f])sb('level note form '+g+' '+(i+1));});
 {const st=GOALS.B.stages[4].steps.map(x=>x.join()),mo=GOALS.B.more.map(x=>x.slice(0,3).join());if(!st.includes('sing,13,15')||!st.includes('outer,9,12'))sb('goal B stage 5 lacks the new steps');if(!mo.includes('earprog,17,24')||mo.includes('earprog,17,19'))sb('goal B appendix: earprog 17–24');
  if(!GOAL_WHY.B.steps['sing:13']||!GOAL_WHY.B.steps['outer:9'])sb('GOAL_WHY sing:13 / outer:9');if(!/eight bars/.test(GOALS.B.more.find(x=>x[0]==='earprog')[3])||!/secondary dominants/.test(GOALS.B.more.find(x=>x[0]==='earprog')[3]))sb('the appendix reason does not name the new levels');}
 for(const g of ['sing','earprog','outer']){const hs=LESSON_NOTES[g].map(c=>c.h);for(const h of {sing:['From the ear to the voice to the hand'],earprog:['Seventh chords of the key','The cycle in sevenths','Secondary dominants by ear','Major or minor II–V–I','Eight bars by ear'],outer:['The bass of a whole section']}[g])if(!hs.includes(h))sb('notes chapter missing: '+g+' '+h);}
 /* --- Sing It 13: hear it, sing it back --- */
 S.gid='sing';const TRI=new Set(['1','3','♭3','5']);
 {const byKey=new Map(),tonics=new Map();[0,1,2].forEach(gi=>{const len=gi+3;let leaps=0;for(let i=0;i<120;i++){const q=lv('sing',13,gi)(),t=q.target,tag='13.'+gi+' '+q.key+' '+q.degs.join(' ');
   if(t.length!==len||q.degs.length!==len||q.names.length!==len){sb('length '+tag);continue;}
   if(!/^se-[Mm]-/.test(q.key))sb('key form '+q.key);const minor=q.key[3]==='m';
   if(!q.hideTarget||!q.contour||!q.voice||!q.octaveFree||q.repeats||q.metro)sb('flags '+tag);
   if(t.some((m,k)=>k&&m===t[k-1]))sb('the same note twice in a row '+tag);if(!TRI.has(q.degs.at(-1)))sb('does not end on 1, 3 or 5 '+tag);if(Math.max(...t)-Math.min(...t)>12)sb('wider than an octave '+tag);
   t.forEach((m,k)=>{const d=DEG_SEMI[q.degs[k]];if(mod(m-q.tonicPc,12)!==d)sb('degree label '+tag);if(pc(P(asc2(q.names[k])))!==mod(m,12))sb('note name '+tag);if(k&&Math.abs(m-t[k-1])>2&&!(TRI.has(q.degs[k])&&TRI.has(q.degs[k-1])))sb('a skip outside the tonic triad '+tag);});
   const sc=minor?[0,2,3,5,7,8,10,11]:[0,2,4,5,7,9,11];if(t.some(m=>!sc.includes(mod(m-q.tonicPc,12))))sb('a note outside the key '+tag);
   if(strip(q.prompt).includes(q.degs.join(' '))||/\\d – /.test(strip(q.prompt)))sb('the prompt shows the degrees '+tag);
   const o=byKey.get(q.key);if(o&&o!==q.degs.join(' '))sb('one key, two phrases '+q.key);byKey.set(q.key,q.degs.join(' '));tonics.set(q.key,(tonics.get(q.key)||new Set()).add(q.tonicPc));
   if(!micGrade(q,{notes:N(t)}).ok||!micGrade(q,{notes:N(t.map(m=>m-12))}).ok||!micGrade(q,{notes:N(t.map(m=>m+12))}).ok)sb('the right take fails '+tag);
   if(micGrade(q,{notes:N(t.map((m,k)=>k===1?m+1:m))}).ok)sb('a wrong note passes '+tag);
   const tn=60+q.tonicPc;if(mod(t[0]-tn,12)!==0&&!micGrade(q,{notes:N([tn].concat(t))}).ok)sb('a leading tonic fails '+tag);
   const j=t.findIndex((m,k)=>k&&Math.abs(m-t[k-1])>=3);if(j>0){leaps++;const r=micGrade(q,{notes:N(t.map((m,k)=>k>=j?m+(t[j]>t[j-1]?-12:12):m))});if(r.ok)sb('a leap turned the other way passes '+tag);else if(!r.shapeWhy)sb('the turned leap is not named '+tag);}}
   if(leaps<10)sb('13.'+gi+': hardly any phrase with a skip ('+leaps+')');});
  if(![...tonics.values()].some(s=>s.size>1))sb('13: no phrase came up in two keys (the item key must not hold the key)');
  if(![...byKey.keys()].some(k=>k[3]==='m')||![...byKey.keys()].some(k=>k[3]==='M'))sb('13: major and minor');}
 /* --- Sing It 14 and 15: sing it, then play it --- */
 {if(ST_POOL.length<12)sb('tune phrases for level 15: '+ST_POOL.length);ST_POOL.forEach(([t,i])=>{const ns=tuneNotes(t.ph[i]),sl=tuneSlots(t.ph[i]);if(sl>6||sl<3||mod(ns[0].semi-ns.at(-1).semi,12)===0)sb('tune phrase '+t.id+' '+i);});
  const seen=new Set();[[14,0],[14,1],[15,0]].forEach(([L,gi])=>{let leaps=0;for(let i=0;i<(L===15?400:120);i++){const q=lv('sing',L,gi)(),n=q.parts&&q.parts.n,t=q.target,tag=L+'.'+gi+' '+q.key;seen.add(q.key);
   if(!n||t.length!==2*n||t.slice(0,n).join()!==t.slice(n).join()){sb('two parts '+tag);continue;}const ph=t.slice(0,n);
   if(!(L===14?/^sp-[Mm]-/:/^st-[a-z]+-\\d+$/).test(q.key))sb('key form '+tag);if(L===14&&n!==gi+3)sb('length '+tag);
   if(L===15){const m=q.key.match(/^st-([a-z]+)-(\\d+)$/),tu=TUNES.find(x=>x.id===m[1]);if(!tu||!tu.ph[+m[2]]||tuneSlots(tu.ph[+m[2]])>6)sb('tune phrase of more than six slots '+tag);else if(tuneNotes(tu.ph[+m[2]]).map(x=>mod(x.semi,12)).join()!==ph.map(x=>mod(x-ph[0]+tuneNotes(tu.ph[+m[2]])[0].semi,12)).join())sb('the phrase is not the stored one '+tag);}
   if(mod(ph[0]-ph.at(-1),12)===0)sb('the phrase begins and ends on one note name '+tag);if(!q.hideTarget||!q.voice||!q.octaveFree||q.repeats)sb('flags '+tag);
   ph.forEach((m,k)=>{if(mod(m-q.tonicPc,12)!==DEG_SEMI[q.degs[k]])sb('degree label '+tag);});
   if(strip(q.prompt).includes(q.degs.slice(0,n).join(' ')))sb('the prompt shows the degrees '+tag);
   const two=(a,b)=>micGrade(q,{notes:N(a).concat(N(b,3000+a.length*900+2500))}),ok0=two(ph,ph);
   if(!ok0.ok||!/Both parts are right/.test(ok0.partWhy))sb('the right take fails '+tag);
   if(!two(ph.map(m=>m-12),ph.map(m=>m+12)).ok||!two(ph.map(m=>m+12),ph.map(m=>m-12)).ok)sb('the two parts in two octaves fail '+tag);
   const d=ph.filter((m,k)=>!k||m!==ph[k-1]),wr=d.map((m,k)=>k===1?(d[0]!==m+1&&d[2]!==m+1?m+1:m+2):m);
   const r1=two(d,wr);if(r1.ok||!/sung part is right/.test(r1.partWhy)||!/played part is not/.test(r1.partWhy))sb('a wrong note in the played part: '+r1.ok+' '+r1.partWhy+' '+tag);
   const r2=two(wr,d);if(r2.ok||!/played part is right/.test(r2.partWhy)||!/sung part is not/.test(r2.partWhy))sb('a wrong note in the sung part: '+r2.ok+' '+r2.partWhy+' '+tag);
   const r3=micGrade(q,{notes:N(ph)});if(r3.ok||!/played part was not heard/.test(r3.partWhy))sb('sung and not played: '+r3.ok+' '+r3.partWhy+' '+tag);
   const j=d.findIndex((m,k)=>k&&Math.abs(m-d[k-1])>=3);if(j>0){leaps++;const tu=d.map((m,k)=>k>=j?m+(d[j]>d[j-1]?-12:12):m),r4=two(d,tu),r5=two(tu,d);
     if(r4.ok||r4.partOk[1]||!r4.partOk[0]||!/shape is not/.test(r4.partWhy))sb('a leap turned over in the played part: '+r4.ok+' '+r4.partWhy+' '+tag);if(r5.ok||r5.partOk[0]||!r5.partOk[1])sb('a leap turned over in the sung part passes '+tag);}
   const tn=60+q.tonicPc;if(mod(ph[0]-tn,12)!==0&&!micGrade(q,{notes:N([tn].concat(ph)).concat(N(ph,3000+(n+1)*900+2500))}).ok)sb('a leading tonic before the sung part fails '+tag);}
   if(leaps<10)sb(L+'.'+gi+': hardly any phrase with a leap');});
  ST_POOL.forEach(([t,i])=>{if(!seen.has('st-'+t.id+'-'+i))sb('tune phrase never asked: '+t.id+' '+i);});}
 /* --- Hear the Progression 20–24, Bass & Top 9–10: every numeral read back in the key gives the chord that is played --- */
 const RN={I:0,II:2,III:4,IV:5,V:7,VI:9,VII:11},RQ={'Maj7':[0,4,7,11],'7':[0,4,7,10],'m7':[0,3,7,10],'m7♭5':[0,3,6,10],'':[0,4,7],'m':[0,3,7],'°':[0,3,6],'7(♭9)':[0,4,7,10,1]};
 const rd=tok=>{const m=tok.match(/^([♭♯]?)(VII|VI|IV|V|III|II|I)(.*)$/);if(!m||!RQ[m[3]])return null;const r=mod(RN[m[2]]+(m[1]==='♭'?-1:m[1]==='♯'?1:0),12);return {r,pcs:RQ[m[3]].map(x=>mod(r+x,12)).sort((a,b)=>a-b)};};
 const oN=Piano.note,oC=Piano.chord,oT=Piano.tick;let EV=[],BS=[],TK=[];
 const heard=(q,n)=>{EV=[];BS=[];TK=[];Piano.chord=(ms,t)=>EV.push({ms,t});Piano.note=(m,t)=>BS.push({m,t});Piano.tick=(t)=>TK.push(t);let dur;try{dur=q.audio();}finally{Piano.note=oN;Piano.chord=oC;Piano.tick=oT;}
   EV.sort((a,b)=>a.t-b.t);const ch=EV.slice(-n);return {dur,ch:ch.map(e=>{const b=BS.filter(x=>Math.abs(x.t-(e.t-0.01))<0.005);return {t:e.t,bass:b.length===1?b[0].m:null,pcs:[...new Set(e.ms.concat(b.map(x=>x.m)).map(m=>mod(m,12)))].sort((a,b)=>a-b)};}),ticks:TK.slice(),all:EV.length};};
 const same=(a,b)=>a.join()===b.join();
 const readBack=(q,toks,tag)=>{const H=heard(q,toks.length);if(H.ch.length!==toks.length){sb('chords played '+H.ch.length+' for '+toks.length+' numerals '+tag);return H;}
   toks.forEach((tk,i)=>{const x=rd(tk),c=H.ch[i];if(!x){sb('numeral not readable: '+tk+' '+tag);return;}if(c.bass===null||mod(c.bass-q.kpc,12)!==x.r)sb('the bass is not the root of '+tk+' '+tag);if(!same(c.pcs,x.pcs.map(p=>mod(p+q.kpc,12)).sort((a,b)=>a-b)))sb(tk+' read back is not the chord played '+tag);});return H;};
 const rowOk=(q,tag)=>{const row=q.tokens||q.choices,ans=Array.isArray(q.answer)?q.answer:[q.answer];if(new Set(row).size!==row.length)sb('the row holds an answer twice '+tag);ans.forEach(a=>{if(row.filter(x=>x===a).length!==1)sb('the row does not hold '+a+' once '+tag);});};
 S.gid='earprog';const GEN=[[20,0],[20,1],[21,0],[21,1],[22,0],[22,1],[23,0],[23,1],[24,0]];
 for(const [L,gi] of GEN){const prompts=new Set(),needs=new Set(),rows=new Map(),answers=new Set(),chordN=new Set();
  for(let i=0;i<(L===24?300:90);i++){const q=lv('earprog',L,gi)(),tag='earprog '+L+'.'+gi+' '+q.key,toks=q.toks||(Array.isArray(q.answer)?q.answer:[q.answer]),minor=/ minor/.test(q.prompt);
   if(q.kpc===undefined){sb('no key on '+tag);break;}rowOk(q,tag);prompts.add(strip(q.prompt));needs.add(q.need||1);answers.add(String(q.answer));
   const rk=(minor?'m':'M');if(rows.has(rk)&&rows.get(rk)!==(q.tokens||q.choices).join(' '))sb('the row changes with the question '+tag);rows.set(rk,(q.tokens||q.choices).join(' '));
   const H=readBack(q,toks,tag);chordN.add(H.all);
   if(!(L===23&&gi===0)&&H.all!==toks.length+4)sb('no cadence before the chords '+tag);if(L===23&&gi===0&&H.all!==3)sb('a cadence before the which-cadence question gives it away '+tag);
   if(L===20&&gi===0&&!DIA_TRI.some(c=>bnum(c[0],c[1])===q.answer))sb('20.0 answer '+tag);
   if(L===21){const rs=toks.map(t=>rd(t).r);if(rs.some((r,k)=>k&&![5,6].includes(mod(r-rs[k-1],12))))sb('not the cycle '+tag);if(toks.some(t=>RQ[t.match(/(VII|VI|IV|V|III|II|I)(.*)$/)[2]].length<4))sb('a triad in the cycle of sevenths '+tag);
     const sc=minor?[0,2,3,5,7,8,10,11]:[0,2,4,5,7,9,11];if(toks.some(t=>rd(t).pcs.some(p=>!sc.includes(p))))sb('a cycle chord outside the key '+tag);}
   if(L===22){const sc=[0,2,4,5,7,9,11],X=toks.map(rd),out=X.map((x,k)=>x.pcs.some(p=>!sc.includes(p))?k:-1).filter(k=>k>=0);
     if(toks.length!==4||out.length!==1)sb('not exactly one chord from outside the key '+tag);else{const k=out[0],dm=X[k];if(!/7$/.test(toks[k])||!same(dm.pcs,[0,4,7,10].map(x=>mod(dm.r+x,12)).sort((a,b)=>a-b)))sb('the outside chord is not a dominant seventh '+tag);
       if(k>2||mod(dm.r-X[k+1].r,12)!==7)sb('the dominant does not resolve a 5th down '+tag);if(dm.r===7)sb('the primary dominant asked as secondary '+tag);
       if(gi===0&&RN[q.answer]!==X[k+1].r)sb('the target named is not the chord after the dominant '+tag);if(X[k+1].pcs.some(p=>!sc.includes(p)))sb('the target is not a chord of the key '+tag);}
     if(![0,7].includes(X[3].r))sb('does not end on I or V '+tag);if(X.some((x,k)=>k&&x.r===X[k-1].r))sb('two chords in a row on one root '+tag);
     if(gi===0&&q.choices.join()!=='II,III,IV,V,VI')sb('the row of 22 '+tag);}
   if(L===23&&gi===0){const X=toks.map(rd);if(!same(X.map(x=>x.r),[2,7,0]))sb('not a II–V–I '+tag);const mn=/^minor/.test(q.answer);if(mn!==(X[0].pcs.includes(8))||mn!==X[1].pcs.includes(8)||mn!==X[2].pcs.includes(3))sb('major/minor label '+tag);}
   if(L===23&&gi===1){const X=toks.map(rd),a=X.slice(0,3).map(x=>x.r),b=X.slice(3).map(x=>x.r);if(toks.length!==6||!((same(a,[2,7,0])&&same(b,[11,4,9]))||(same(a,[11,4,9])&&same(b,[2,7,0]))))sb('not the two related cadences '+tag);
     const mi=same(a,[2,7,0])?X.slice(3):X.slice(0,3);if(!mi[0].pcs.includes(5)||!mi[1].pcs.includes(5)||!same(mi[2].pcs,[0,4,9]))sb('the minor cadence of the pair '+tag);}
   if(L===24){if(toks.length!==8&&!q.e8.bars.some(b=>b.length>1))sb('eight bars, '+toks.length+' numerals '+tag);if(H.ticks.length!==8)sb('clicks: '+H.ticks.length+' '+tag);else{const bt=[];let k=0;q.e8.bars.forEach((b,bi)=>b.forEach((c,j)=>{bt.push([bi,j,b.length]);}));
       H.ch.forEach((c,i)=>{const [bi,j,nb]=bt[i],bl=H.ticks[1]-H.ticks[0],want=H.ticks[bi]+j*bl/nb;if(Math.abs(c.t-0.01-want)>0.02)sb('chord '+i+' is not where its bar begins '+tag);});if(H.ticks.some((t,i)=>i&&Math.abs(t-H.ticks[i-1]-(H.ticks[1]-H.ticks[0]))>1e-6))sb('uneven clicks '+tag);}
     if(q.key!=='e8-'+q.e8.id+'-'+q.e8.first)sb('key '+tag);if(strip(q.prompt).toLowerCase().includes(q.e8.name.replace(/^the /,'').toLowerCase()))sb('the prompt names the form '+tag);}}
  if(prompts.size!==1)sb('earprog '+L+'.'+gi+': the wording changes with the question ('+prompts.size+' wordings)');if(needs.size!==1&&!(L===24&&E8.some(x=>x.bars.some(b=>b.length>1))))sb('earprog '+L+'.'+gi+': the number of chords changes');if(answers.size<2)sb('earprog '+L+'.'+gi+': one answer only');if(chordN.size!==1&&L!==24)sb('earprog '+L+'.'+gi+': chord count varies');}
 /* the eight-bar material */
 {if(E8.length<6)sb('fewer than six spans: '+E8.length);const ks=new Set();E8.forEach(sp=>{const k=sp.id+'-'+sp.first;if(ks.has(k))sb('span twice '+k);ks.add(k);if(sp.bars.length!==8)sb('span length '+k);sp.bars.flat().forEach(c=>{if(!e8Kind(c[0],c[1],sp.minor,sp.blues))sb('a chord without a name in '+k);const x=rd(bnum(c[0],c[1]));if(!x||x.r!==c[0]||!same(x.pcs,CH[c[1]].map(v=>mod(c[0]+IV[v][1],12)).sort((a,b)=>a-b)))sb('numeral of '+c+' in '+k);});
    /* against the stored form: the numerals, read back in the form's own key, are the symbols on its chart */
    const f=FORMS.find(x=>e8Slug(x.n)===sp.id&&x.bars.length>=sp.first+7&&(x.k.endsWith('m'))===sp.minor);if(f){const t=pc(P(f.k.replace(/m$/,'')));f.bars.slice(sp.first-1,sp.first+7).forEach((b,bi)=>b.split(' ').forEach((s,j)=>{const y=symParse(s),x=rd(bnum(sp.bars[bi][j][0],sp.bars[bi][j][1]));if(!y||mod(pc(y.r)-t,12)!==x.r||!same(CH[y.q].map(v=>mod(pc(y.r)-t+IV[v][1],12)).sort((a,b)=>a-b),x.pcs))sb('span '+k+' bar '+(sp.first+bi)+': '+s+' is not '+bnum(sp.bars[bi][j][0],sp.bars[bi][j][1]));if(/[\\/♯°]/.test(s.replace(/^[A-G][♭♯]?/,'')))sb('a symbol the numerals cannot write is in '+k+': '+s);}));}
    else if(!sp.blues)sb('no stored form for '+k);else{const bf=Object.keys(BLUES_FORMS).find(n=>e8Slug(n)===sp.id);if(!bf||BLUES_FORMS[bf].slice(0,8).map(c=>c.join()).join(' ')!==sp.bars.map(b=>b[0].join()).join(' '))sb('blues span '+k);}});
  const got=new Set();S.gid='earprog';for(let i=0;i<600;i++)got.add(lv('earprog',24)().key);E8.forEach(sp=>{if(!got.has('e8-'+sp.id+'-'+sp.first))sb('span never asked '+sp.id+'-'+sp.first);});
  if(E8_OUT.some(x=>!x.why))sb('a span left out without a reason');
  for(const m of [false,true]){const row=e8Row(m);if(new Set(row).size!==row.length)sb('e8 row duplicates');}}
 /* --- Bass & Top 9 and 10 --- */
 {S.gid='outer';const prompts=new Set();for(let i=0;i<300;i++){const q=lv('outer',9)(),tag='outer 9 '+q.key;rowOk(q,tag);prompts.add(strip(q.prompt));if(q.key!=='ob8-'+q.e8.id+'-'+q.e8.first)sb('key '+tag);
    const H=heard(q,q.answer.length);if(H.ticks.length!==8||H.all!==q.answer.length+4)sb('eight bars after a cadence '+tag);H.ch.forEach((c,k)=>{if(c.bass===null||DEG_ORDER[mod(c.bass-q.kpc,12)]!==q.answer[k])sb('bass degree '+k+' '+tag);});
    const bl=H.ch.map(c=>c.bass);if(bl.join()!==bassLine(bl.map(m=>mod(m,12))).join())sb('the bass is not a line '+tag);if(q.tokens.join()!=='1,♭2,2,♭3,3,4,5,♭6,6,♭7,7')sb('row '+tag);}
   if(prompts.size!==1)sb('outer 9: the wording changes');
   const P10=new Set();let leaps=0;for(let i=0;i<300;i++){const q=lv('outer',10)(),t=q.target,g=q.grid,tag='outer 10 '+q.key;P10.add(strip(q.prompt).replace(/\\d+/g,'n'));
    if(q.key!=='ob8p-'+q.e8.id+'-'+q.e8.first||!q.contour||!q.octaveFree||!q.hideTarget||!(q.metro>=60&&q.metro<=72)||t.length!==g.length||t.length<2)sb('flags '+tag);
    const H=heard(q,q.e8.bars.flat().length),bl=H.ch.map(c=>c.bass),bt=[];q.e8.bars.forEach((b,bi)=>b.forEach((c,j)=>bt.push(bi*4+j*4/b.length)));const want=[],wg=[];bl.forEach((m,k)=>{if(!k||mod(m-bl[k-1],12)!==0){want.push(m);wg.push(bt[k]);}});
    if(t.map(m=>mod(m,12)).join()!==want.map(m=>mod(m,12)).join()||g.join()!==wg.join())sb('not one note where each chord begins '+tag);if(t.some((m,k)=>k&&mod(m-t[k-1],12)===0))sb('a pitch twice in a row '+tag);
    if(t.some((m,k)=>k&&m-t[k-1]!==want[k]-want[k-1]))sb('the target is not the shape of the bass as played '+tag);if(Math.min(...t)<=BPO.lowOct)sb('the line reaches the notes that may be heard an octave up '+tag);
    t.forEach((m,k)=>{if(DEG_ORDER[mod(m-q.kpc,12)]!==q.degs[k]||pc(P(asc2(q.names[k])))!==mod(m,12))sb('label '+tag);});
    const B=60000/q.metro,bs=4*B+100,tk=(T,sh)=>micGrade(q,{notes:T.map((m,k)=>({midi:m,mf:m,t:bs+(g[k]+(sh||0))*B,dur:400})),beat:B,beatStart:bs,firstAt:bs});
    if(!tk(t).ok||!tk(t.map(m=>m+12)).ok)sb('the right take fails '+tag);if(tk(t.map((m,k)=>k===1?m+1:m)).ok)sb('a wrong note passes '+tag);const late=tk(t,0.5);if(late.ok||late.timeOk)sb('half a beat late passes '+tag);
    const j=t.findIndex((m,k)=>k&&Math.abs(m-t[k-1])>=3);if(j>0){leaps++;if(tk(t.map((m,k)=>k>=j?m+(t[j]>t[j-1]?-12:12):m)).ok)sb('a leap turned over passes '+tag);}}
   if(P10.size!==1)sb('outer 10: the wording changes ('+P10.size+')');if(leaps<100)sb('outer 10: leaps');}
 /* --- the facts the level notes and chapters state --- */
 {const rel=CYC7_MIN.map(c=>[mod(c[0]+9,12),c[1]]),rot=CYC7_MAJ.slice(4,7).concat(CYC7_MAJ.slice(0,4)).concat([CYC7_MAJ[4]]),diff=rel.map((c,i)=>c[0]===rot[i][0]&&c[1]===rot[i][1]?-1:i).filter(i=>i>=0);
  if(diff.length!==1||rel[diff[0]].join()!=='4,7'||rot[diff[0]].join()!=='4,m7')sb('the minor cycle is not the relative major cycle from VIm7 with III7');
  if(mod(CYC7_MAJ[2][0]-CYC7_MAJ[1][0],12)!==6||mod(CYC7_MIN[5][0]-CYC7_MIN[4][0],12)!==6)sb('the tritone step of the cycle');
  if(CYC7_MAJ.map(c=>bnum(c[0],c[1])).join(' ')!=='IMaj7 IVMaj7 VIIm7♭5 IIIm7 VIm7 IIm7 V7 IMaj7'||CYC7_MIN.map(c=>bnum(c[0],c[1])).join(' ')!=='Im7 IVm7 ♭VII7 ♭IIIMaj7 ♭VIMaj7 IIm7♭5 V7 Im7')sb('the cycles in sevenths');
  if(DIA_TRI.map(c=>bnum(c[0],c[1])).join(' ')!=='IMaj7 IIm7 IIIm7 IVMaj7 V7 VIm7 VIIm7♭5')sb('the seventh chords of the key');
  const third=SD_T.map(T=>outsideOf('C',[mod(T[0]+7,12),'7']));if(third.filter(o=>o.some(x=>/3rd/.test(x))).length!==4||third[2].join()!=='B♭ (its 7th)'||third.some(o=>!o.length))sb('the outside notes of the secondary dominants: '+third.join(' / '));
  if(SD_T.map(T=>bnum(mod(T[0]+7,12),'7')).join(' ')!=='VI7 VII7 I7 II7 III7')sb('secondary dominants by their roots');
  if(mod(2+6,12)!==8||mod(7+1,12)!==8||!CH['m7♭5'].includes('d5')||!CH['7♭9'].includes('b9'))sb('the ♭5 of II and the ♭9 of V');
  if(C251_REL.map(c=>bnum(c[0],c[1])).join(' ')!=='VIIm7♭5 III7(♭9) VIm')sb('the cadence to the relative minor');
  const e=LESSON_NOTES.earprog.find(c=>c.h==='Eight bars by ear'),tb=e.p.find(x=>x.tbl);if(!tb||tb.tbl[1].length!==E8.length)sb('the notes table of the sections');}
 S.gid='fretboard';}
/*E3SW_BEGIN*//* ============ THE REVIEW OF THE EAR GAMES: BUILD 3 (23 Nov 2026): chords as a guitarist plays them, real lines, real meters ============ */
{const sb=m=>{bad++;if(bad<60)console.log('EAR3',m);},gen=(g,L,i)=>GBY[g].levels[L-1].g[i||0],once=q=>q.choices.filter(c=>c===q.answer).length===1&&new Set(q.choices).size===q.choices.length,pcsOf=ms=>[...new Set(ms.map(m=>mod(m,12)))].sort((a,b)=>a-b).join(',');
 /* ---- Hear the Chord ---- */
 S.gid='earchord';
 {if(GBY.earchord.levels.length!==11||GBY.earchord.levels[7].g.length!==1)sb('earchord: 11 levels, level 8 one generator');const seen=new Set();
  for(let i=0;i<600;i++){const q=gen('earchord',8)();seen.add(q.key);if(!/^ectx-/.test(q.key)||/^ed2-/.test(q.key))sb('level 8 key '+q.key);if(q.choices.join('|')!==ECTX_ROW.join('|')||!once(q))sb('level 8 row');if(/major 7th on V|IV-type/.test(q.answer+q.key))sb('the Maj7 on V is still asked');}
  if(seen.size!==8)sb('level 8 versions '+seen.size);
  for(let i=0;i<8;i+=2){const A=ECTX[i][1],B=ECTX[i+1][1];if(A.length!==B.length||A.some((c,j)=>c[0]!==B[j][0])||!A.some((c,j)=>c[1]!==B[j][1]))sb('pair '+i+' does not differ in quality only');}
  ['C','F','G','Bb','D','Eb'].forEach(k=>ECTX.forEach((v,vi)=>{const X=ectxMake(vi,k),t=pc(P(k));X.chs.forEach((c,j)=>{const want=ctxSemis(v[1][j][1]).map(s=>mod(t+v[1][j][0]+s,12));if(pcsOf(c.pcs)!==pcsOf(want)||c.bass!==mod(t+v[1][j][0],12))sb('context chord '+v[0]);});if(!X.diff.length||/undefined|NaN/.test(X.diff.join()))sb('context difference '+v[0]);}));
  if(pcsOf(ctxSemis('7sus4'))!=='0,5,7,10'||pcsOf(ctxSemis('6'))!=='0,4,7,9'||!ctxSemis('7♭9').some(x=>mod(x,12)===1))sb('the formulas of the context chords');
  /* level 10 */
  const kinds={shell:new Set(),d2:new Set()};
  for(let i=0;i<900;i++){const q=gen('earchord',10,i%3)(),E=q.ecg;if(!E){sb('level 10 fell back');continue;}const ms=gripMidis(E.a),want=CH[E.q].map(x=>mod(E.rp+IV[x][1],12));kinds[E.kind].add(E.q);
   if(q.key!=='ecg-'+E.kind+'-'+E.q||!once(q)||q.answer!==EARQ[E.q])sb('level 10 key or row '+q.key);if(Math.min(...ms)<40||Math.max(...ms)>84)sb('level 10 register');if(mod(E.rm,12)!==E.rp)sb('the root alone');
   if(E.kind==='shell'){if(ms.length!==3||pcsOf(ms)!==pcsOf([want[0],want[1],want[3]])||mod(Math.min(...ms),12)!==E.rp)sb('a shell is not root, 3rd and 7th only: '+q.key);if(!ECG_SHELL.includes(E.q))sb('a shell that cannot be told apart is asked');}
   else{if(ms.length!==4||pcsOf(ms)!==pcsOf(want))sb('a drop-2 grip does not hold exactly its chord: '+q.key);const st=E.a.map((f,j)=>f===null?null:6-j).filter(x=>x!==null).join('');if(st!=='5432'&&st!=='4321')sb('drop-2 string set '+st);if(E.rm>=Math.min(...ms))sb('the root alone is not under the grip');}}
  if(kinds.shell.size!==5||kinds.d2.size!==7)sb('level 10 qualities '+kinds.shell.size+' '+kinds.d2.size);
  ECG_D2.forEach(q=>{const sh=x=>[0,1,3].map(i=>pc(chord(P('C'),x)[i])).join();const twins=ECG_D2.filter(x=>x!==q&&sh(x)===sh(q));if(ECG_SHELL.includes(q)&&twins.some(x=>ECG_SHELL.includes(x)))sb('two shells of the row are the same notes: '+q);if(!ECG_SHELL.includes(q)&&!twins.length)sb(q+' could be asked as a shell');});
  /* level 11 */
  const dn=new Set();
  for(let i=0;i<900;i++){const q=gen('earchord',11,i%3)(),E=q.ecd,ms=gripMidis(E.a),rel=ms.map(m=>mod(m-E.rp,12)),f=ECD_F(E.name),col=ECD_COL[E.name];dn.add(E.name);
   if(q.key!=='ecd-'+E.name||!once(q)||q.answer!==E.name||q.choices.join()!==ECD.filter(n=>q.choices.includes(n)).join())sb('level 11 key or row');
   if(rel.some(s=>!f.includes(s)))sb('a note outside the chord in '+E.name);if(mod(Math.min(...ms),12)!==E.rp)sb('the root is not in the bass: '+E.name);if(!rel.includes(10))sb('no ♭7 in '+E.name);
   if(E.name==='7sus4'?(!rel.includes(5)||rel.includes(4)):!rel.includes(4))sb('the 3rd (or the 4th of the sus chord): '+E.name);if(col!==null&&!rel.includes(col))sb('the colour note is missing: '+E.name);
   if(E.name==='13'&&rel.includes(5))sb('a 13 with its 11');if(E.name==='7'&&pcsOf(rel)!=='0,4,7,10')sb('the plain 7 is not exactly its formula');if(E.a.some(x=>x!==null&&(x<0||x>15)))sb('fret');}
  if(dn.size!==8)sb('level 11 colours '+dn.size);if(ECD.join()!=='7,9,13,7sus4,7♭9,7♯9,7♯5,7♯11')sb('the row of dominant colours');
  if(TG['13'].f.includes(5))sb('the 13 formula holds an 11');}
 /* ---- Call & Response ---- */
 S.gid='cr';
 {if(GBY.cr.levels.length!==13)sb('cr 13 levels');let fall=0;
  for(let i=0;i<2000;i++){const q=gen('cr',8)(),t=q.target,g=q.grid,m=q.key.match(/^cr7-([A-Za-z]+)-(7|m7|maj7)-(\\d+)$/);if(!m){sb('level 8 key '+q.key);continue;}const ct=m[3].split('').map(d=>[1,3,5,7].includes(+d));
   if(t.length<4||t.length>6||!ct[0]||!ct.at(-1))sb('level 8 does not start and end on a chord tone');g.forEach((b,j)=>{if(Number.isInteger(b)&&!ct[j])sb('level 8: a note on a beat is not a chord tone '+q.key);});
   t.forEach((x,j)=>{if(j&&x===t[j-1])sb('level 8 repeats a pitch');if(!ct[j]&&(j===0||j===t.length-1||Math.abs(x-t[j-1])>2||Math.abs(t[j+1]-x)>2))sb('level 8: a scale note not by step '+q.key);});if(!q.rhyStrict||q.metro!==micOpt().bpm)sb('level 8 time');}
  for(let i=0;i<2000;i++){const q=gen('cr',9)(),t=q.target;if(!/^crl-[A-Za-z]+-\\d{8}$/.test(q.key)){sb('level 9 key '+q.key);continue;}const k=q.key.split('-')[1],x=iiVIof(k),p1=CH.m7.map(z=>mod(pc(x.ii)+IV[z][1],12)),p2=CH['7'].map(z=>mod(pc(x.V)+IV[z][1],12));
   if(t.length!==8||q.grid.join()!=='0,1,2,3,4,5,6,7')sb('level 9 length');t.forEach((m,j)=>{if(!(j<4?p1:p2).includes(mod(m,12)))sb('level 9: not a chord tone of its bar');if(j&&m===t[j-1])sb('level 9 repeats a pitch');});
   const d=Math.abs(t[4]-t[3]);if(d<1||d>2)sb('level 9: the join is not a step');if(mod(t[3],12)===mod(pc(x.ii)+10,12)&&mod(t[4],12)===mod(pc(x.V)+4,12)&&t[4]-t[3]===-1)fall++;if(!q.rhyStrict)sb('level 9 time');}
  if(fall<1000)sb('the 7th falls to the 3rd in fewer than half: '+fall);
  /* the jazz line book */
  const items=new Set();for(let i=0;i<900;i++){const q=gen('cr',13,i%3)(),J=q.crj;if(!J){sb('level 13 fell back '+q.key);continue;}items.add(q.key);const t=q.target;
   if(q.key!=='crj-'+J.id||q.octaveFree||!q.rhyStrict||!q.hideTarget||Math.min(...t)<48)sb('level 13 question '+q.key);
   if(/^ol/.test(J.id)){const L=olLine(J.k,J.id.split('-')[1],/^olm/.test(J.id));if(t.length!==9||t.some((m,j)=>m-t[0]!==L.ns[j].semi-L.ns[0].semi)||mod(t[0],12)!==mod(pc(L.root)+L.ns[0].semi,12)||q.grid.some((b,j)=>b!==j*0.5))sb('level 13: not the outline of Arpeggio Runner '+q.key);}
   else{if(t.length!==25||q.names.join(' ')!==crjEncNames(J.k,J.id==='enc-d').split(' · ').join(' ')||!q.tol)sb('level 13: not the turn line of Arpeggio Runner '+q.key);}}
  if(items.size!==8)sb('the jazz line book has '+items.size+' lines');
  /* strict time and the lowest notes */
  [[6,0],[8,0],[9,0],[10,0],[11,0],[13,0],[13,1],[13,2]].forEach(([L,i])=>{for(let n=0;n<200;n++)if(!gen('cr',L,i)().rhyStrict){sb('no strict time in level '+L);break;}});
  [[5,0],[6,0],[10,0],[11,0],[13,0],[13,1],[13,2]].forEach(([L,i])=>{for(let n=0;n<1500;n++){const q=gen('cr',L,i)();if(Math.min(...q.target)<48){sb('a target under C3 in level '+L+' '+q.key);break;}if(L!==5&&L!==13){const a=fitWindow(q.target,11);if(!a||a.win[1]>15)sb('a lick above fret 15');}}});
  const lk=new Set();for(let n=0;n<5000;n++)lk.add(gen('cr',10)().key);if(lk.size!==BLUES_LICKS.length+LICK_MORE.length)sb('licks that A and E can ask: '+lk.size);
  /* a lick that starts on the off-beat, answered on beat 1: the notes are right and the take fails */
  let q8=null;for(let n=0;n<4000&&!q8;n++){const q=gen('cr',10)();if(q.grid[0]>0.5)q8=q;}
  if(!q8)sb('no lick starts off the beat');else{const mk=g=>({notes:q8.target.map((m,i)=>({midi:m,mf:m,t:g[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000});if(!micGrade(q8,mk(q8.grid)).ok)sb('the lick as written fails');const g2=q8.grid.slice();g2[0]=g2[0]-0.67;const r=micGrade(q8,mk(g2));if(r.ok||!r.notesOk)sb('a lick entered on beat 1 passes');}}
 /* ---- Tunes by Ear ---- */
 S.gid='tunes';
 {if(GBY.tunes.levels.length!==11)sb('tunes 11 levels');
  TUNES.forEach(t=>{const meta=SR_TUNE[t.id];t.ph.forEach((p,i)=>{const M=tuneMeter(t,i);if(!meta){if(M.bar!==0||M.pk||M.off)sb('a tune without a meter has one: '+t.id);return;}
    const bar=meta[0]==='6/8'?2:meta[0];if(M.bar!==bar||M.cn%bar||M.cn<4)sb('bar or count-in '+t.id);if(i===0&&Math.abs(M.pk-meta[1])>1e-6)sb('the pickup of '+t.id+' is not the stored one');if(Math.abs(mod(M.off+M.pk,bar))>1e-6)sb('the note after the pickup is not on beat 1: '+t.id+' '+i);
    let pos=-meta[1];for(let j=0;j<i;j++)pos+=tuneLen(t.ph[j]);if(Math.abs(mod(pos+M.pk+1e-9,bar))>1e-3)sb('the phrase is not where the earlier phrases put it: '+t.id+' '+i);});});
  for(const L of [7,8,9,10])GBY.tunes.levels[L-1].g.forEach(g=>{for(let n=0;n<300;n++){const q=g(),T=q.tune;if(q.clickBar!==T.bar||q.cinN!==T.cn||Math.abs(q.grid[0]-T.off)>1e-6){sb('tune in time: the click of '+q.key);break;}
    if(!T.bar)continue;let a=T.off;const starts=T.ns.map(x=>{const s0=a;a+=x.d;return s0;}),f=starts.find(x=>x>=T.off+T.pk-1e-6);if(f===undefined||Math.abs(mod(f+1e-9,T.bar))>1e-3){sb('the first note after the pickup is not on an accented click: '+q.key);break;}
    if(/-half$|-all$/.test(q.key)&&Math.abs(T.pk-SR_TUNE[T.id][1])>1e-6)sb('half or whole tune: the pickup');}});
  if(!TUNES.some(t=>!SR_TUNE[t.id])||tunePhraseQ({time:true,only:TUNES.find(t=>!SR_TUNE[t.id]).id})().clickBar!==0)sb('a tune with no entry: a click without an accent');
  if(tuneMeter(TUNES.find(t=>t.id==='grace'),0).cn!==6||tuneMeter(TUNES.find(t=>t.id==='row'),0).bar!==2)sb('3/4 and 6/8');
  const ks=new Set();for(let n=0;n<400;n++){const q=gen('tunes',11)();ks.add(q.nokey);if(!/^tu-[a-z]+-\\d+k$/.test(q.key)||!q.octaveFree||!q.contour||q.metro||!q.hideTarget)sb('level 11 question '+q.key);
   const pr=String(q.prompt).replace(/<[^>]+>/g,' ');if(/major|minor|blues/.test(pr)||new RegExp('\\\\b'+kname(q.nokey).replace('♭','.')+'\\\\b').test(pr.replace(/A phrase/,'')))sb('level 11 names the key');if(!new RegExp(kname(q.nokey)).test(String(q.explain)))sb('level 11 does not tell the key afterwards');
   const mk=ms=>({notes:ms.map((m,i)=>({midi:m,mf:m,t:i*600+500}))});if(n<60){if(!micGrade(q,mk(q.target)).ok||!micGrade(q,mk(q.target.map(m=>m+12))).ok)sb('level 11: the right take fails '+q.key);if(micGrade(q,mk(q.target.map(m=>m+2))).ok)sb('level 11: another key passes');}}
  if(ks.size<6)sb('level 11 keys '+ks.size);}
 /* ---- Hear the Degree ---- */
 S.gid='eardeg';
 {if(GBY.eardeg.levels.length!==13)sb('eardeg 13 levels');const pairs=new Set();
  [[6,0,2],[6,1,2],[7,0,3],[7,1,4],[9,0,0],[9,1,5]].forEach(([L,i,len])=>{for(let n=0;n<700;n++){const q=gen('eardeg',L,i)(),m=q.dict.mids,p=q.answer;if(!/^edc-/.test(q.key)||q.key!=='edc-'+p.join(''))sb('dictation key '+q.key);
    if(len?p.length!==len:(p.length!==3&&p.length!==4))sb('dictation length');if(q.need!==p.length||p.some(d=>!q.tokens.includes(d)))sb('dictation tokens');if(m.some((x,j)=>j&&x===m[j-1]))sb('dictation: a note twice in a row');if(!['1','3','5'].includes(p.at(-1)))sb('dictation does not end on 1, 3 or 5: '+p.join(' '));
    const c=q.dict.chrom;if(L!==9){if(c>=0||p.some(d=>/[♭♯]/.test(d)))sb('a chromatic note below level 9');m.forEach((x,j)=>{if(!j)return;const d=Math.abs(x-m[j-1]),tri=a=>['1','3','5'].includes(a);if(d>2&&!(tri(p[j])&&tri(p[j-1])))sb('dictation: a skip outside the tonic triad '+p.join(' '));});}
    else{if(c<0||c>=m.length-1||p.filter(d=>/[♭♯]/.test(d)).length!==1)sb('level 9: one chromatic note, not the last');else{const pr=p[c]+'>'+p[c+1];pairs.add(pr);if(!['♯4>5','♭7>6','♭3>2'].includes(pr)||Math.abs(m[c+1]-m[c])!==1)sb('level 9: the chromatic note does not go a half step to its scale note: '+pr);}}}});
  if(pairs.size!==3)sb('level 9 chromatic moves '+[...pairs].join(' '));if(GBY.eardeg.levels[8].g.length!==2)sb('level 9 generators');
  /* minor */
  const alt=new Set();for(let n=0;n<800;n++){const q=gen('eardeg',12,n%2)(),p=q.answer,m=q.dict.mids;p.forEach(d=>alt.add(d));if(!/^edcm-/.test(q.key)||q.tokens.join()!==EDM_TOK.join()||p.length!==(n%2?4:3)||p.some(d=>!EDM_TOK.includes(d)))sb('minor dictation question');
   if(!p.some(d=>/♭|7/.test(d)))sb('a minor line without a minor degree');if(m.some((x,j)=>j&&x===m[j-1])||!['1','♭3','5'].includes(p.at(-1)))sb('minor line shape');
   p.forEach((d,j)=>{if(d==='7'&&!p.some((e,k)=>e==='1'&&m[k]-m[j]===1))sb('the raised 7 is not a half step under a tonic of the line');});}
  if(EDM_TOK.some(d=>!alt.has(d)))sb('minor dictation never asks '+EDM_TOK.filter(d=>!alt.has(d)).join(' '));
  for(let n=0;n<300;n++){const q=gen('eardeg',12,2)();if(q.ui!=='rhywrite'||!/^mdm-1-/.test(q.key)||q.mel.toks.join()!==MDM_TOK.join()||q.answer.some(e=>!MDM_TOK.includes(e.p)))sb('the minor bar');if(!melGrade(q,q.answer.map(e=>({...e}))).ok)sb('the minor bar fails its own answer');
   const w=q.answer.map(e=>({...e}));w[0].p=w[0].p==='1'?'5':'1';if(melGrade(q,w).ok)sb('a wrong degree passes in the minor bar');if(/undefined|NaN/.test(q.reveal)||!/class="staff score/.test(q.reveal))sb('the minor bar is not shown by the score engine');}
  if(MDM_TOK.filter(d=>/^[♭]?[367]$/.test(d)).map(d=>d.replace(/[^1-7]/g,'')).join()!=='3,6,7')sb('the digit keys of the minor bar');
  {const ns=ssNotes(P('C'),[0,-1,0,2],true),bars=scoreBars({meter:'4/4',ks:ssKeySig(P('C'),true),notes:ns.map(x=>{const n=degNote(P('C'),x.d),oct=Math.floor((x.midi-NAT[n.l]-n.a)/12)-1;return {m:x.midi-12,d:1,w:{l:n.l,a:n.a,oct,step:(oct-4)*7+n.l-2}};})});
   if(ssKeySig(P('C'),true)!==-3||bars[0].ev[1].acc!==0||bars[0].ev[3].acc!==null||scoreCheck(bars,'4/4').length)sb('C minor: the raised 7 does not carry a natural sign');if(/undefined|NaN/.test(mdmStaff(P('C'),ns,[1,1,1,1])))sb('the minor staff');
   const g2=ssNotes(P('G'),[0,-1,0],true),b2=scoreBars({meter:'4/4',ks:-2,notes:g2.map(x=>{const n=degNote(P('G'),x.d),oct=Math.floor((x.midi-NAT[n.l]-n.a)/12)-1;return {m:x.midi-12,d:x===g2[2]?2:1,w:{l:n.l,a:n.a,oct,step:(oct-4)*7+n.l-2}};})});if(b2[0].ev[1].acc!==1)sb('G minor: the raised 7 is not written F sharp');}
  /* all twelve */
  const tw=new Set();for(let n=0;n<900;n++){const q=gen('eardeg',13)();tw.add(q.answer);if(q.choices.join()!==DEG_ORDER.join()||!once(q)||!q.row)sb('level 13 row');}if(tw.size!==12)sb('level 13 degrees '+tw.size);
  ['♭2','♭6'].forEach(d=>{if(!/half step/.test(degPull(d,false)))sb('where '+d+' leans');});}
 /* ---- Hear the Interval ---- */
 S.gid='eariv';
 {if(GBY.eariv.levels.length!==12)sb('eariv 12 levels');const forms=new Set(),ivs=new Set();
  for(let n=0;n<1500;n++){const w=n%2,q=gen('eariv',12,w)(),E=q.eik,d=E.b-E.a,iv=IVL.find(x=>x[2]===d),sm=i=>SS_MAJ[mod(i,7)]+12*Math.floor(i/7),dl=SS_LAB[mod(E.lo,7)],dh=SS_LAB[mod(E.hi,7)];forms.add(E.form);
   if(!iv||d!==sm(E.hi)-sm(E.lo)||d<1||d>12)sb('interval in a key: the two notes');if(q.key!=='eik'+(w?'w':'')+'-'+E.form+'-'+dl+'-'+dh)sb('interval key '+q.key);if(E.a<45||E.b>79)sb('interval register');
   if(!w){ivs.add(iv[0]);if(q.answer!==iv[1]||q.choices.join()!==IVL.map(x=>x[1]).join()||!once(q))sb('interval row');if(!new RegExp('degrees <b>'+(E.form==='desc'?dh:dl)+'</b>').test(q.explain))sb('the explanation does not give the degrees');}
   else{const want=E.form==='desc'?[dh,dl]:[dl,dh];if(q.answer.join()!==want.join()||q.need!==2||q.tokens.join()!==SS_LAB.join())sb('the written degrees '+q.key);if(!new RegExp(iv[1]).test(q.explain))sb('the explanation does not give the interval');}}
  if(forms.size!==3||ivs.size!==12)sb('forms '+forms.size+' intervals '+ivs.size);
  if(IVL.reduce((a,x)=>a+keyIvPairs(x[2]).length,0)!==49||keyIvPairs(6).join()!=='4–7,7–4'||keyIvPairs(1).join()!=='3–4,7–1'||keyIvPairs(4).join()!=='1–3,4–6,5–7')sb('the intervals of the major scale');}
 /* ---- Hear the Mode ---- */
 S.gid='earmode';
 {if(GBY.earmode.levels.length!==10)sb('earmode 10 levels');
  Object.keys(MODE_VAMPS).forEach(m=>{const v=MODE_VAMPS2[m],o=mdOffs(m),col=charOff(m);if(!v||v.length<2||JSON.stringify(v)===JSON.stringify(MODE_VAMPS[m])||JSON.stringify(v[0])!==JSON.stringify(MODE_VAMPS[m][0]))return sb('second vamp of '+m);
   [MODE_VAMPS[m],v].forEach((V,w)=>{V.forEach(c=>{if(vampPcs(c).some(p=>!o.includes(p)))sb('a chord of the '+m+' vamp '+(w+1)+' is not in the mode');});if(!V.some(c=>vampPcs(c).includes(col)))sb('no colour note in the '+m+' vamp '+(w+1));if(mdFits(V.flatMap(vampPcs)).join()!==m)sb('the '+m+' vamp '+(w+1)+' fits '+mdFits(V.flatMap(vampPcs)).join());});
   if(!v.slice(1).some(c=>vampPcs(c).includes(col)))sb('the colour note of '+m+' is only in the home chord');if(v.slice(1).some(c=>MODE_VAMPS[m].some(d=>d[0]===c[0])))sb('the second vamp of '+m+' repeats a root of the first');});
  const two={};for(let n=0;n<600;n++){const q=gen('earmode',4)();(two[q.vamp.mode]=two[q.vamp.mode]||new Set()).add(q.vamp.second);if(q.key!=='ev-'+q.vamp.mode||/undefined|NaN/.test(q.explain))sb('vamp question');}if(Object.keys(two).length!==6||Object.values(two).some(x=>x.size!==2))sb('level 4 does not draw both vamps');
  for(let n=0;n<800;n++){const near=n%2,q=gen('earmode',9,near)(),T=q.two,fam=MODE_FAM.find(f=>f.includes(T.first));if(!fam||!fam.includes(T.second)||T.first===T.second)sb('two modes: not one family');const A=mdOffs(T.first),B=mdOffs(T.second),df=A.filter((x,i)=>x!==B[i]).length;
   if(!near){if(q.key!=='em2-'+T.first+'-'+T.second||q.answer!==T.second||q.choices.includes(T.first)||!once(q)||q.choices.some(c=>!fam.includes(c)))sb('two modes: the choices');}
   else{if(df!==1||q.key!=='em2n-'+T.first+'-'+T.second||q.choices.join()!==MODE2_ROW.join()||!once(q))sb('two modes: the note that changed');const i=A.findIndex((x,j)=>x!==B[j]);if(q.answer!==mdDegs(T.second)[i])sb('two modes: the answer is not the changed degree');}
   if(new RegExp(T.second).test(String(q.prompt)))sb('two modes: the prompt names the second');}
  const lm=new Set();for(let n=0;n<1400;n++){const q=gen('earmode',10)(),L=q.line;if(!L){sb('the mode line fell back');continue;}lm.add(L.mode);const o=mdOffs(L.mode),s=L.semis,ix=L.idx,pcs=[...new Set(s.map(x=>mod(x,12)))];
   if(q.key!=='eml-'+L.mode||q.choices.join()!==MAJ_MODES.join()||!once(q))sb('mode line question');if(s.length<6||s.length>8)sb('mode line length');if(pcs.some(p=>!o.includes(p)))sb('mode line: a note outside the mode');if(!pcs.includes(charOff(L.mode)))sb('mode line: no colour note');
   if(mdFits(pcs.concat([0])).join()!==L.mode)sb('mode line: another mode fits '+L.mode);if(ix.some((x,j)=>j&&(x===ix[j-1]||Math.abs(x-ix[j-1])>2)))sb('mode line: a repeat or a leap');if(ix.filter((x,j)=>j>1&&Math.sign(x-ix[j-1])!==Math.sign(ix[j-1]-ix[j-2])).length<2)sb('mode line: a scale run');
   if(!(L.mode==='Locrian'?[0,2]:[0,2,4]).includes(mod(ix.at(-1),7)))sb('mode line ending');const tell=mdTell(L.mode,ix);if(mdFits([0].concat(tell.map(i=>o[i]))).join()!==L.mode)sb('the notes that settle the mode');}
  if(lm.size!==7)sb('mode line modes '+lm.size);}
 /* ---- goals, notes ---- */
 {const B=GOALS.B,st=B.stages.flatMap(x=>x.steps),has=(g,a,b)=>st.some(x=>x[0]===g&&x[1]<=a&&x[2]>=b),more=(k,g,a,b)=>GOALS[k].more.some(x=>x[0]===g&&x[1]===a&&x[2]===b);
  if(!has('tunes',11,11)||!has('eardeg',12,13)||!B.stages[4].steps.some(x=>x[0]==='eardeg'&&x[1]===12))sb('goal B: Tunes by Ear 11 and Hear the Degree 12–13');if(!GOAL_WHY.B.steps['eardeg:12']||!/no cadence/.test(GOAL_WHY.B.steps['tunes:9'][1]))sb('the reasons of the new steps');
  if(!more('B','earchord',5,11)||!more('B','eariv',7,12)||!more('B','earmode',1,10)||!more('B','cr',5,13)||!more('A','cr',10,13))sb('the appendix ranges');
  [['earchord','Your own grips: shells and drop-2'],['earchord','Dominant colours'],['cr','The jazz line book'],['tunes','No key given'],['eardeg','Minor-key dictation'],['eardeg','All twelve'],['eariv','Intervals in a key'],['earmode','One root, two modes'],['earmode','The mode of a line']].forEach(([g,h])=>{if(!LESSON_NOTES[g].some(c=>c.h===h))sb('no chapter '+h);});
  ['earchord','cr','tunes','eardeg','eariv','earmode'].forEach(g=>{if(LEVEL_NOTES[g].length!==GBY[g].levels.length)sb('level notes of '+g);});}
 S.gid='fretboard';}
/*E3SW_END*/
/*E4SW_BEGIN*//* ============ THE REVIEW OF THE EAR GAMES: BUILD 4 (23 Nov 2026): singing from the page, intonation, the outer voices ============ */
{const sb=m=>{bad++;if(bad<60)console.log('EAR4',m);},gen=(g,L,i)=>GBY[g].levels[L-1].g[i||0],MAJ=[0,2,4,5,7,9,11],MIN=[0,2,3,5,7,8,10,11],
  slots=t=>t.filter((m,i)=>!i||m!==t[i-1]),take=(ms,o)=>({notes:ms.map((m,i)=>({midi:m,mf:m,t:500+i*900,dur:700})),firstAt:500}),
  timed=(q,sh,one)=>({beat:1000,beatStart:4100,lat:0,firstAt:4100,notes:q.target.map((m,i)=>({midi:m,mf:m,t:4100+(q.grid[i]+(one===undefined||one===i?sh:0))*1000,dur:Math.min(600,400)}))});
 if(GBY.sightsing.levels.length!==13||GBY.sing.levels.length-(OSJ.sing||[]).length!==16||GBY.outer.levels.length!==12)sb('level counts');
 /* ---- Sing the Page 10: wider skips ---- */
 S.gid='sightsing';
 {const seenCh=new Set();for(let i=0;i<400;i++){const q=gen('sightsing',10)(),idx=q.key.split('-').slice(2).join('-').split('.').map(Number),t=q.target,ton=q.tonicPc;
   if(!/^ss-10-/.test(q.key)||idx.length!==t.length)sb('L10 key '+q.key);
   let wide=0;idx.forEach((x,j)=>{if(!j)return;const d=Math.abs(x-idx[j-1]),semi=Math.abs(t[j]-t[j-1]);if(d===0)sb('L10 repeated note');if(d<2)return;
     const ci=[[0,2,4],[3,5,0],[4,6,1,3]].findIndex(c=>c.includes(mod(x,7))&&c.includes(mod(idx[j-1],7)));if(ci<0)sb('L10 skip outside I, IV and V7 '+idx);if(d>5)sb('L10 skip over a 6th '+idx);if(semi===6)sb('L10 tritone '+idx);if(semi>9)sb('L10 wider than a major 6th');
     if(d>=3&&ci>0){wide++;seenCh.add(ci);}
     if(j===idx.length-1||idx[j+1]-x!==-Math.sign(x-idx[j-1]))sb('L10 skip without a step back '+idx);});
   if(!wide)sb('L10 no skip of a 4th or more outside the tonic triad '+idx);
   if(t.some(m=>!MAJ.includes(mod(m-ton,12))))sb('L10 note outside the key');if(Math.min(...t)<55||Math.max(...t)>84)sb('L10 range');if(![0,4,7].includes(mod(t.at(-1)-ton,12)))sb('L10 does not end on 1, 3 or 5');
   if(!/wide skip/.test(q.explain))sb('L10 explanation does not name the skip');
   if(i<60){if(!micGrade(q,take(t)).ok)sb('L10 right take fails');const w=t.slice();w[2]+=1;if(w[2]===w[3])w[2]+=1;if(micGrade(q,take(w)).ok)sb('L10 wrong note passes');if(!micGrade(q,take(t.map(m=>m-12))).ok)sb('L10 an octave lower fails');}}
  if(seenCh.size!==2)sb('L10 wide skips never inside IV or never inside V7');}
 /* ---- Sing the Page 11: four bars ---- */
 {let nat=0,minWithLead=0;for(const gi of [0,1])for(let i=0;i<250;i++){const q=gen('sightsing',11,gi)(),X=q.ss4,idx=X.idx,t=q.target,ton=q.tonicPc,minor=X.minor;
   if(minor!==(gi===1)||idx.length!==14||t.length!==14)sb('L11 form');if(!new RegExp(minor?'^ss-11m-':'^ss-11-').test(q.key))sb('L11 key '+q.key);
   if(X.bars.length!==4||scoreCheck(X.bars,'4/4').length)sb('L11 not four clean bars: '+scoreCheck(X.bars,'4/4').join(';'));
   if(X.ks!==ssKeySig(P(NOTE_PC[ton].replace('♯','#').replace('♭','b')),minor)&&Math.abs(X.ks)>4)sb('L11 signature');
   if(t.some((m,j)=>j&&m===t[j-1]))sb('L11 repeated note');if(t.some((m,j)=>j&&Math.abs(m-t[j-1])>9))sb('L11 leap over a 6th');
   if(mod(t[13]-ton,12)!==0)sb('L11 does not end on the tonic');if(!(minor?[0,3,7]:[0,4,7]).includes(mod(t[6]-ton,12)))sb('L11 first phrase does not end on the tonic triad');
   if(!idx.some((x,j)=>j&&Math.abs(x-idx[j-1])>1))sb('L11 no skip');
   if(t.some(m=>!(minor?MIN:MAJ).includes(mod(m-ton,12))))sb('L11 note outside the key '+q.degs);if(Math.min(...t)<55||Math.max(...t)>84)sb('L11 range');
   if(minor){if(!idx.some(x=>x===5||x===6||x===-1))sb('L11 minor line without ♭6, ♭7 or the raised 7');if(t.some((m,j)=>j&&Math.abs(m-t[j-1])===3&&[8,11].includes(mod(m-ton,12))&&[8,11].includes(mod(t[j-1]-ton,12))))sb('L11 augmented 2nd');
     t.forEach((m,j)=>{if(mod(m-ton,12)===11&&idx[j]!==-1)sb('L11 raised 7 away from under the tonic');if(mod(m-ton,12)===10&&idx[j]===-1)sb('L11 ♭7 under the tonic');});
     if(idx.includes(-1)){minWithLead++;const signs=X.bars.flatMap(b=>b.ev.filter(e=>!e.rest&&e.acc!==null&&e.acc!==undefined).map(e=>e.acc));if(!signs.length)sb('L11 raised 7 without a sign');if([0,5].includes(ton)){if(!signs.includes(0))sb('L11 no natural sign in C or F minor');else nat++;}else if(!signs.includes(1))sb('L11 no sharp on the raised 7');}}
   else{const h=[idx.slice(0,7),idx.slice(7)];if(!h.some(a=>ssHasWide(a)))sb('L11 major line without level 10 material');if(X.bars.some(b=>b.ev.some(e=>!e.rest&&e.acc!==null&&e.acc!==undefined)))sb('L11 major line with an accidental');}
   if(!/<svg class="staff score"/.test(q.visual)||/NaN|undefined/.test(q.visual))sb('L11 staff');
   if(i<40){if(!micGrade(q,take(t)).ok)sb('L11 right take fails');const w=t.slice();w[4]+=1;if(w[4]===w[5])w[4]+=1;if(micGrade(q,take(w)).ok)sb('L11 wrong note passes');}}
  if(!nat)sb('L11 no natural sign seen');if(!minWithLead)sb('L11 no raised 7 seen');}
 /* ---- Sing the Page 12: tunes from the page ---- */
 {const pool=sstPool(),seen=new Set();if(pool.length<40)sb('L12 pool '+pool.length);
  pool.forEach(([t,i,ks])=>ks.forEach(k=>{const X=sstPage(t,i,k),src=tuneNotes(t.ph[i]),ms=X.ns.map(x=>x.midi-12);if(Math.min(...ms)<45||Math.max(...ms)>64)sb('L12 outside A2 to E4 '+t.id+i+k);
    if(scoreCheck(X.sc.bars,X.meter).length)sb('L12 bars '+t.id+i+k);if(Math.abs(X.sc.ks)>4)sb('L12 signature');
    X.ns.forEach((x,j)=>{if(mod(x.midi-pc(P(k)),12)!==mod(src[j].semi,12)||x.d!==src[j].deg)sb('L12 degree '+t.id+i);if(pc(P(x.name))!==mod(x.midi,12))sb('L12 name '+t.id+i+k+' '+x.name);if(j&&x.midi-X.ns[j-1].midi!==src[j].semi-src[j-1].semi)sb('L12 shape '+t.id+i);});
    const data=scoreData(X.sc.bars);if(data.length>X.ns.length||data.some(d=>!X.ns.some(x=>x.midi-12===d.m)))sb('L12 written notes '+t.id+i+k);
    const m=SR_TUNE[t.id],tm=tuneMeter(t,i),u=m[0]==='6/8'?1.5:1,ev0=X.sc.bars[0].ev,lead=ev0.slice(0,ev0.findIndex(e=>!e.rest)).reduce((a,e)=>a+e.d,0);if(Math.abs(lead-tm.off*u)>0.01)sb('L12 pickup '+t.id+i+k+' rest '+lead+' against '+tm.off*u);}));
  for(let i=0;i<300;i++){const q=gen('sightsing',12)(),t=q.target,tu=TUNES.find(x=>x.id===q.sst.id);seen.add(q.key);if(q.key!=='sst-'+q.sst.id+'-'+q.sst.i)sb('L12 key');
   if(q.prompt.includes(tu.n)||q.label.includes(tu.n)||!q.explain.includes(tu.n))sb('L12 the name is shown too early, or never');
   if(!q.contour||!q.octaveFree||!q.voice)sb('L12 not graded as a line in any octave');if(q.maxNotes!==slots(t).length)sb('L12 slots');
   if(!/<svg class="staff score"/.test(q.visual)||/NaN|undefined/.test(q.visual))sb('L12 staff');
   if(i<80){const s=slots(t);if(!micGrade(q,take(s)).ok)sb('L12 right take fails '+q.key);if(!micGrade(q,take(s.map(m=>m-12))).ok)sb('L12 an octave lower fails');const w=s.slice();w[1]+=1;if(w[1]===w[2])w[1]+=1;if(micGrade(q,take(w)).ok)sb('L12 wrong note passes');
     if(s.length>2){const f=s.slice();const k=f.findIndex((m,j)=>j&&m!==f[j-1]);for(let j=k;j<f.length;j++)f[j]+=f[k]>f[k-1]?-12:12;if(micGrade(q,take(f)).ok)sb('L12 a leap turned over passes');}}}
  if(seen.size<30)sb('L12 phrases seen '+seen.size);}
 /* ---- Sing the Page 13: in time ---- */
 {if(SS_TOL!==0.3||SS_BPM!==60)sb('L13 constants');let eight=0;for(let i=0;i<300;i++){const q=gen('sightsing',13)(),t=q.target,dur=q.ssr.dur,ton=q.tonicPc;
   if(q.metro!==60||q.beatTol!==0.3||!q.timeAll||q.freeStart)sb('L13 fields');if(dur.some(d=>![0.5,1,2].includes(d))||Math.abs(dur.reduce((a,b)=>a+b,0)-8)>1e-9)sb('L13 values '+dur);
   let tt=0;dur.forEach((d,j)=>{if(Math.abs(q.grid[j]-tt)>1e-9)sb('L13 grid');if(d===0.5&&tt%1===0&&dur[j+1]!==0.5)sb('L13 a lone eighth');if(d===2&&tt%2!==0)sb('L13 half note off beats 1 and 3');if(tt<4&&tt+d>4)sb('L13 a note over the bar line');tt+=d;});if(dur.includes(0.5))eight++;
   if(t.some((m,j)=>j&&m===t[j-1]))sb('L13 repeated note');if(t.some(m=>!MAJ.includes(mod(m-ton,12))))sb('L13 key');if(Math.min(...t)<55||Math.max(...t)>84)sb('L13 range');
   if(q.ssr.bars.length!==2||scoreCheck(q.ssr.bars,'4/4').length)sb('L13 bars');
   if(i<80){if(!micGrade(q,timed(q,0)).ok)sb('L13 right take fails');if(!micGrade(q,timed(q,0.2)).ok)sb('L13 a fifth of a beat late fails');if(!micGrade(q,timed(q,-0.25)).ok)sb('L13 a quarter of a beat early fails');if(!micGrade(q,timed(q,0.28)).ok)sb('L13 0.28 of a beat late fails');
     const late=micGrade(q,timed(q,1));if(late.ok||!late.notesOk)sb('L13 a right line a beat late: ok '+late.ok+' notes '+late.notesOk);
     const one=micGrade(q,timed(q,0.4,2));if(one.ok||!one.notesOk)sb('L13 one note 0.4 of a beat late passes');if(micGrade(q,timed(q,0.4)).ok)sb('L13 the line 0.4 late passes');
     const w=timed(q,0);w.notes[1].midi+=1;w.notes[1].mf+=1;if(w.notes[1].midi===t[2])w.notes[1].midi+=1;if(micGrade(q,w).ok)sb('L13 wrong note passes');
     const up=timed(q,0);up.notes.forEach(n=>{n.midi-=12;n.mf-=12;});if(!micGrade(q,up).ok)sb('L13 an octave lower fails');
     const cin=timed(q,0);cin.notes.unshift({midi:60+ton,mf:60+ton,t:1500,dur:900});if(!micGrade(q,cin).ok)sb('L13 a tonic hummed in the count-in fails the take');}}
  if(eight!==300)sb('L13 lines without an eighth pair');}
 /* other levels keep their time rule: a quarter of a beat, three notes in four */
 {S.gid='tunes';const q=tunePhraseQ({time:true})();if(q.beatTol!==undefined||q.timeAll)sb('time fields leaked');S.gid='sightsing';}
 /* ---- intonation ---- */
 S.gid='sing';
 {if(MATCH_CENTS!==35||CENTS_STD!==20)sb('cents constants');if(!GBY.sing.levels[15].open||GBY.sing.levels[15].n!=='Match the note')sb('Match the note is not level 16, or not open');
  if(Math.abs(centsOff(57.3,57)-30)>1e-6||Math.abs(centsOff(68.7,57)+30)>1e-6||Math.abs(centsOff(45,57))>1e-6)sb('centsOff');
  const one=(m,c)=>({notes:[{midi:Math.round(m+c/100),mf:m+c/100,t:600,dur:1500}],firstAt:600}),pcs=new Set();
  for(let i=0;i<200;i++){const q=gen('sing',16)(),m=q.target[0];pcs.add(q.key);if(q.key!=='sm-'+mod(m,12)||m<45||m>64||q.cents!==35||!q.voice||!q.octaveFree||q.target.length!==1)sb('match question '+q.key);
   for(const c of [0,30,-30,34])if(!micGrade(q,one(m,c)).ok)sb('match: '+c+' cents fails');
   for(const c of [40,-40,36,49]){const r=micGrade(q,one(m,c));if(r.ok||!r.centsOut||Math.abs(r.cents-c)>0.01)sb('match: '+c+' cents passes');}
   if(!micGrade(q,one(m+12,-30)).ok||!micGrade(q,one(m-12,25)).ok)sb('match: another octave fails');if(micGrade(q,one(m+12,40)).ok)sb('match: 40 cents in another octave passes');
   if(micGrade(q,one(m+1,0)).ok||micGrade(q,one(m+7,0)).ok)sb('match: a wrong note passes');
   const sl=micGrade(q,{notes:[{midi:m-2,mf:m-2,t:500,dur:500},{midi:m,mf:m+0.1,t:1100,dur:1500}],firstAt:500});if(!sl.ok||Math.abs(sl.cents-10)>0.01)sb('match: a slide into the note');
   const fb=micFeedbackExtra(q,micGrade(q,one(m,-40)));if(!/40 cents flat/.test(fb)||!/outside the 35 cents/.test(fb))sb('match feedback: '+fb);if(!/30 cents sharp/.test(micFeedbackExtra(q,micGrade(q,one(m,30)))))sb('match feedback sharp');}
  if(pcs.size!==12)sb('match: pitch classes '+pcs.size);
  /* other levels keep the nearest half step: 45 cents flat still passes */
  {const q=gen('sing',2)(),m=q.target[0];if(q.cents!==undefined||!micGrade(q,one(m,-45)).ok)sb('a degree 45 cents flat fails');}
  /* the stored value is the mean of the take's cents */
  {const offs=[10,-20,35,-42,5,0,-15,25];for(let i=0;i<40;i++){const q=gen('sing',7,i%2)(),t=q.target,res={notes:t.map((m,j)=>({midi:m,mf:m+offs[j]/100,t:500+j*900,dur:700})),firstAt:500},r=micGrade(q,res),want=t.map((m,j)=>Math.abs(offs[j])).reduce((a,b)=>a+b,0)/t.length,got=takeCents(q,r);
    if(!r.ok||got===null||Math.abs(got-want)>0.01)sb('takeCents '+got+' against '+want);
    const keep=S,g={pl:[]},it={};S={gid:'sing',micResult:r,used:new Set()};let e;try{e=perfLog(g,q,it,true);}finally{S=keep;}if(!e||e.ct===undefined||Math.abs(e.ct-want)>0.051||g.pl.at(-1).ct!==e.ct)sb('the log entry does not keep the cents: '+(e&&e.ct)+' against '+want);
    const up=micGrade(q,{notes:res.notes.map(n=>({midi:n.midi+12,mf:n.mf+12,t:n.t,dur:n.dur})),firstAt:500});if(Math.abs(takeCents(q,up)-want)>0.01)sb('takeCents in another octave');}
   /* a two-part take: the sung part only */
   for(let i=0;i<20;i++){const q=gen('sing',14)(),n=q.parts.n,t=q.target,r=micGrade(q,{notes:t.map((m,j)=>({midi:m,mf:m+(j<n?0.2:0),t:500+j*900,dur:700})),firstAt:500});if(!r.ok||Math.abs(takeCents(q,r)-20)>0.01)sb('takeCents of a two-part take '+takeCents(q,r));}
   {const q=gen('sing',9)(),m=q.target[0],r=micGrade(q,{notes:[{midi:m,mf:m-0.3,t:500,dur:900,atk:true},{midi:m,mf:m,t:1800,dur:900,atk:true}],firstAt:500});if(r.ok&&Math.abs(takeCents(q,r)-30)>0.01)sb('takeCents of sing-then-play '+takeCents(q,r));}
   /* a guitar game stores no cents */
   {const keep=S,q=gen('tunes',1)(),r=micGrade(q,{notes:q.target.map((m,j)=>({midi:m,mf:m+0.2,t:500+j*900,dur:700})),firstAt:500}),g={pl:[]};S={gid:'tunes',micResult:r,used:new Set()};let e;try{e=perfLog(g,q,{},true);}finally{S=keep;}if(e&&e.ct!==undefined)sb('a guitar game stores cents');}}
  }
 /* ---- Bass & Top: the top voice is a line ---- */
 S.gid='outer';
 {const oN=Piano.note,oC=Piano.chord;let NS=[];const heard=f=>{NS=[];Piano.note=(m,t,d,v)=>NS.push({m,t,v});Piano.chord=()=>{};try{f();}finally{Piano.note=oN;Piano.chord=oC;}return NS.slice().sort((a,b)=>a.t-b.t);};
  let moved=0,held=0,leapt=0,tensN=0,all=0;
  for(const name of POP_PROGS.concat(SEV_PROGS,MIN_PROGS))for(const k of (PROG_MINOR.has(name)?OUTER_MKEYS:OUTER_KEYS))for(let i=0;i<25;i++){const chs=outerChords(k,name),minor=PROG_MINOR.has(name),ms=chs.map(c=>c.topM),lp=ms.filter((m,j)=>j&&Math.abs(m-ms[j-1])>2).length;
    if(lp>1)sb('top voice leaps '+lp+' times in '+name+' '+ms);leapt+=lp;
    chs.forEach((c,j)=>{all++;const semi=mod(c.topM-c.bass,12),tones=CH[c.q].map(x=>mod(IV[x][1],12)),next=chs.slice(j+1).find(x=>x.deg!==c.deg||x.q!==c.q),tens=topTens(c,next,minor);
      if(!tones.includes(semi)&&!tens.includes(semi))sb('top note outside its chord: '+name+' '+c.q+' +'+semi);if(!tones.includes(semi))tensN++;if(c.top!==mod(c.topM,12)||c.topM<64||c.topM>79)sb('top pitch '+c.topM);if(c.topLab!==chordToneLab(semi,c.q))sb('top label');
      if(voiceTop(c.pcs,c.top,c.topM).top!==c.topM)sb('voiceTop moves the top note');if(j){if(c.topM===ms[j-1])held++;else moved++;}
      if(c.as6&&(c.q!=='maj7'||semi!==0))sb('6 chord without the root on top');if(c.q==='maj7'&&semi===0&&!c.as6)sb('root on a Maj7 not played as a 6');});
    if(i===0){const got=heard(()=>playOuter(chs,1)).filter(x=>x.v>0.9).map(x=>x.m);if(got.join()!==ms.join())sb('the top line that sounds is not the line: '+got+' / '+ms);}}
  if(!held||!moved||!leapt||!tensN)sb('top line: held '+held+' moved '+moved+' leaps '+leapt+' tensions '+tensN);if(tensN/all>0.5)sb('top line: too many tensions '+tensN+'/'+all);
  for(const [L,gi] of [[8,0],[4,0],[4,1],[6,1]])for(let i=0;i<150;i++){const q=gen('outer',L,gi)();if(L===8){if(q.target.filter((m,j)=>j&&Math.abs(m-q.target[j-1])>2).length>1)sb('level 8 target leaps twice');if(q.target.some(m=>m<64||m>79))sb('level 8 range');if(!micGrade(q,{notes:slots(q.target).map((m,j)=>({midi:m,mf:m,t:500+j*900,dur:700})),firstAt:500}).ok)sb('level 8 right take fails');}}
  /* ---- 11: the bass is not always the root ---- */
  if(OB_INV.length<8||OB_INV.length+OB_PED.length!==12||new Set(OB_INV.concat(OB_PED).map(p=>p.id)).size!==12)sb('level 11 list');
  if(OB_INV.some(p=>!p.c.some(c=>c[2]===1||c[2]===2)||p.c.some(c=>typeof c[2]!=='number'))||OB_PED.some(p=>!p.c.some(c=>c[2]==='T'||c[2]==='D')))sb('level 11: a list in the wrong pool');
  for(const pr of OB_INV.concat(OB_PED))for(const k of OUTER_KEYS){const X=obMake(pr,k),t=pc(P(k));
    pr.c.forEach((c,j)=>{const ch=X.seq[j],tones=CH[c[1]].map(x=>mod(t+c[0]+IV[x][1],12));if(typeof c[2]==='number'){if(ch.bass!==tones[c[2]])sb('level 11 bass is not the written chord tone '+pr.id);}else if(ch.bass!==mod(t+(c[2]==='T'?0:7),12))sb('level 11 pedal '+pr.id);
      if(mod(X.bassM[j],12)!==ch.bass)sb('level 11 the bass that sounds');if(X.bassD[j]!==DEG_ORDER[mod(ch.bass-t,12)]||!OB_DEG.includes(X.bassD[j]))sb('level 11 degree '+X.bassD[j]);if(j&&Math.abs(X.bassM[j]-X.bassM[j-1])>6)sb('level 11 bass leap');
      const tok=X.toks[j],want=typeof c[2]==='number'?bnum(c[0],c[1])+(c[2]?'/'+(c[2]===1?3:5):''):null;if(want!==null&&tok!==want)sb('level 11 token '+tok);if(want===null&&!(tones.includes(ch.bass)?/[/][35]$/.test(tok)||tok===bnum(c[0],c[1]):/ over [15]$/.test(tok)))sb('level 11 pedal token '+tok);
      const semi=mod(ch.topM-ch.root,12);if(!CH[c[1]].map(x=>mod(IV[x][1],12)).includes(semi)&&!topTens(ch,X.seq.slice(j+1).find(x=>x.deg!==ch.deg||x.q!==ch.q),false).includes(semi))sb('level 11 top note outside its chord');});
    if(X.seq.map(c=>c.topM).filter((m,j,a)=>j&&Math.abs(m-a[j-1])>2).length>1)sb('level 11 top leaps');}
  {const ids=[new Set(),new Set()];for(const gi of [0,1])for(let i=0;i<300;i++){const q=gen('outer',11,gi)(),X=q.ob,t=pc(P(X.k));ids[gi].add(q.key);
    if(q.ui!=='spell'||q.need!==X.seq.length||q.answer.length!==q.need||q.answer.some(a=>!q.tokens.includes(a)))sb('level 11 question');
    if(gi===0){if(q.tokens.join()!=='1,2,3,4,5,6,7'||q.key!=='oi-'+X.id||q.answer.join()!==X.seq.map(c=>DEG_ORDER[mod(c.bass-t,12)]).join())sb('level 11 degrees');}
    else{if(q.tokens.join()!=='root,3rd,5th'||q.key!=='oic-'+X.id||q.answer.join()!==X.seq.map(c=>['root','3rd','5th'][CH[c.q].map(x=>mod(c.root+IV[x][1],12)).indexOf(c.bass)]).join()||!q.answer.some(a=>a!=='root'))sb('level 11 chord tones '+q.answer);if(/[/]|over/.test(q.prompt.replace(/<[^>]+>/g,'')))sb('level 11: the second task shows the bass');}
    if(i<30){const ns=heard(()=>q.audio()),bs=ns.filter(x=>Math.abs(x.v-0.8)<0.01).map(x=>x.m),tp=ns.filter(x=>x.v>0.9).map(x=>x.m);if(bs.map(m=>mod(m,12)).join()!==X.seq.map(c=>c.bass).join()||bs.some(m=>m>55))sb('level 11: the bass that is played '+bs);if(tp.join()!==X.seq.map(c=>c.topM).join())sb('level 11: the top that is played');}}
   if(ids[0].size!==12||ids[1].size!==OB_INV.length)sb('level 11 items '+ids[0].size+' '+ids[1].size);}
  /* ---- 12: how the two lines move ---- */
  {const fix=[[48,76,53,72,'contrary'],[48,76,45,76,'oblique'],[48,72,48,74,'oblique'],[48,64,50,65,'parallel'],[53,69,55,71,'parallel'],[48,72,55,74,'similar'],[48,64,50,67,'similar'],[55,74,48,72,'similar'],[50,65,48,64,'parallel'],[53,72,48,76,'contrary']];
   fix.forEach(f=>{if(motionOf(f[0],f[1],f[2],f[3],0)!==f[4])sb('motionOf '+f);});if(motionOf(48,64,48,64,0)!==null)sb('motionOf: nothing moves');
   const cnt={},steps=(lo,hi,t)=>{let n=0;for(let m=lo+1;m<=hi;m++)if(MAJ.includes(mod(m-t,12)))n++;return n;};
   for(let i=0;i<600;i++){const q=gen('outer',12)(),o=q.om,t=pc(P(o.k)),b=o.b,tp=o.tp,db=b[1]-b[0],dt=tp[1]-tp[0];cnt[q.answer]=(cnt[q.answer]||0)+1;
    const want=(!db||!dt)?'oblique':Math.sign(db)!==Math.sign(dt)?'contrary':steps(b[0],tp[0],t)===steps(b[1],tp[1],t)?'parallel':'similar';
    if(!db&&!dt)sb('level 12: nothing moves');if(q.answer!==want)sb('level 12 motion '+q.answer+' / '+want+' '+b+' '+tp);if(q.choices.join()!=='contrary,similar,parallel,oblique'||q.key.indexOf('om-'+q.answer+'-')!==0)sb('level 12 row or key');
    o.chs.forEach((c,j)=>{if(mod(b[j],12)!==c.bass||!c.pcs.includes(c.bass)||!c.pcs.includes(mod(tp[j],12))||c.topM!==tp[j])sb('level 12 chord');if(b[j]<36||b[j]>55||tp[j]<64||tp[j]>79)sb('level 12 range');if(c.pcs.some(p=>!MAJ.includes(mod(p-t,12))))sb('level 12 chord outside the key');});
    if(q.answer==='parallel'&&![2,5].includes(mod(steps(b[0],tp[0],t),7)))sb('level 12 parallel motion that is not 3rds, 6ths or 10ths');
    if(!new RegExp('<b>'+q.answer+'</b>').test(q.explain))sb('level 12 explanation');
    if(i<40){const ns=heard(()=>q.audio()),bs=ns.filter(x=>Math.abs(x.v-0.8)<0.01).map(x=>x.m),top=ns.filter(x=>x.v>0.9).map(x=>x.m);if(bs.join()!==b.join()||top.join()!==tp.join())sb('level 12: what sounds is not what is graded '+bs+' '+top);}}
   if(['contrary','similar','parallel','oblique'].some(k=>!(cnt[k]>60)))sb('level 12 answers '+JSON.stringify(cnt));}}
 /* ---- goals, notes ---- */
 {const st=GOALS.B.stages[4].steps.map(x=>x.join()),mo=GOALS.B.more.map(x=>x.slice(0,3).join());if(!st.includes('outer,9,12'))sb('goal B: Bass & Top 9 to 12');if(!mo.includes('sightsing,1,13')||mo.includes('sightsing,1,9'))sb('goal B appendix: Sing the Page 1 to 13');
  if(!/levels 11 and 12/.test(GOAL_WHY.B.steps['outer:9'][1]))sb('the reason of outer:9 was not extended');
  for(const [g,from,to] of [['sightsing',10,13],['sing',16,16],['outer',11,12]])for(let L=from;L<=to;L++){const n=LEVEL_NOTES[g][L-1];if(!n||!(n.k||n.a))sb('level note '+g+' '+L);}
  for(const [g,L] of [['sightsing',10],['sightsing',11],['sightsing',12],['sightsing',13],['sing',16]])if(!/real voice/.test(JSON.stringify(LEVEL_NOTES[g][L-1])))sb('the note of '+g+' '+L+' does not say it is untested with a voice');
  for(const [g,hs] of [['sightsing',['Wider skips: inside IV and V7','Four bars','Tunes from the page','In time']],['sing',['In tune: cents, and Match the note']],['outer',['The bass is not always the root']]])hs.forEach(h=>{if(!LESSON_NOTES[g].some(c=>c.h===h))sb('chapter missing: '+h);});}
 S.gid='fretboard';}
/*E4SW_END*/
/* ============ THE REVIEW OF THE THEORY GAMES: BUILD 1 (23 Nov 2026) ============
   right answers that were marked wrong, one chord-scale table, every spelling askable, functional numerals. No backticks and no template slots in this block: it lives inside the sweep's own template string. */
{const tb=m=>{bad++;console.log('THEORY1',m);},plain=h=>String(h==null?'':h).replace(/<[^>]+>/g,' '),G0=(gid,L,i)=>GBY[gid].levels[L-1].g[i],many=(gen,n,f)=>{for(let i=0;i<n;i++){let q;try{q=gen();}catch(e){tb('a generator threw: '+e.message);return;}f(q,i);}};
 const nt=it=>noteText(it)+' '+((it&&it.cap)||'');
 const symQ=s=>{const m=String(s).match(/^([A-G][♭♯𝄫𝄪]?)(.*)$/);return m?{r:P(m[1]),q:m[2].replace('Maj','maj')}:null;},subset=(a,b)=>a.every(x=>b.includes(x));
 /* ---- 1. Harmony & Analysis ---- */
 S.gid='analysis';
 {const names=DEVICES.map(d=>d.c||d.n);if(new Set(names).size!==names.length||names.includes('modal interchange'))tb('device names as choices: each pattern needs one name of its own');
  if(/borrowed/.test(DEVICES.find(d=>d.k==='sd').why()))tb('a secondary dominant is not borrowed');
  let bdSeen=0;many(G0('analysis',16,1),400,q=>{if(q.answer==='backdoor dominant'){bdSeen++;if(q.choices.some(c=>/modal interchange/.test(c)&&!/no dominant/.test(c)))tb('level 16: modal interchange offered as wrong beside the backdoor');}
    const m=plain(q.prompt).match(/In\s+(\S+)\s+(major|minor)/);if(m&&m[2]==='minor'&&/^(D♭|A♭)$/.test(m[1]))tb('the minor cadence asked in '+m[1]+' minor');});if(!bdSeen)tb('level 16: the backdoor was never asked');
  let diff=0;many(G0('analysis',16,0),400,q=>{const n=q.answer.split(' – ').length;if(q.choices.some(c=>c.split(' – ').length!==n)){diff++;}if(/Write it/.test(q.prompt))tb('level 16 says write, and it is a choice');});if(diff)tb('level 16: numeral strings of another length among the choices ('+diff+')');
  if(!/no dominant resolution/.test(CONST_TXT[0])||/same interval/.test(CONST_TXT[0]))tb('level 15: the constant-structure choice is still true of a chain of dominants');
  many(G0('analysis',15,0),200,q=>{if(/7 – [A-G][♭♯]?7 – [A-G][♭♯]?7 – [A-G][♭♯]?7$/.test(plain(q.prompt).replace(/\s*\.\s*What holds.*$/,'').trim())&&q.answer!==CONST_TXT[3])tb('level 15: four dominants a fifth apart answered '+q.answer);});
  /* a II – V is spelled a fourth apart by letter, in every device question; no impossible keys */
  for(const gen of [G0('analysis',10,1),G0('analysis',10,2),G0('analysis',16,0),G0('analysis',16,1),G0('analysis',17,0)])many(gen,300,q=>{const ch=plain(q.prompt).match(/[A-G][♭♯]?(?:m7♭5|Maj7|dim7|m7|7♭9|7)/g)||[];for(let i=0;i+1<ch.length;i++){const a=symQ(ch[i]),b=symQ(ch[i+1]);if(/^m7/.test(a.q)&&/^7/.test(b.q)&&mod(pc(b.r)-pc(a.r),12)===5&&mod(b.r.l-a.r.l,7)!==3)tb('a II – V not a fourth apart by letter: '+ch[i]+' '+ch[i+1]);}
    if(/maj7/.test(plain(q.prompt)))tb('maj7 in a prompt: '+plain(q.prompt));});
  /* level 3: one explanation per question */
  {const ex=new Set(),hi=new Set();many(G_ck.sevQualDeg,200,q=>{ex.add(q.explain);hi.add(q.hint);if(/undefined/.test(q.explain+q.hint))tb('sevQualDeg text');});if(ex.size!==4||hi.size!==4)tb('level 3: the four quality questions need four explanations and hints ('+ex.size+', '+hi.size+')');}
  /* the hint of a single-chord numeral where the chart respells the root */
  {let resp=0;many(G0('analysis',11,1),600,q=>{const m=q.key.match(/^an-n-([A-G]b?#?)-(\\d+)-(.+)$/);if(!m)return;const k=m[1],d=+m[2],qq=m[3],c=anChordOf(k,d,qq),sr=nm(anStrictRoot(k,d,qq));if(sr!==nm(c.r)){resp++;if(!/chart spelling/.test(q.hint)||q.hint.indexOf(sr)<0)tb('numeral hint counts letters to a respelled root: '+q.hint);}});if(!resp)tb('no respelled chord met in level 11 (test is blind)');}
  if(!/Coltrane/.test(GBY.analysis.desc)||!/pivot/.test(GBY.analysis.desc)||!/diminished/.test(GBY.analysis.desc))tb('the description of Harmony & Analysis stops before levels 12 to 15');
  if(/2–5–1, function$/.test(GBY.analysis.levels[6].d)||/minor cadence\\.'/.test(JSON.stringify(LEVEL_NOTES.analysis[6].w||'')))tb('level 7 description');
  /* level 6: the key from evidence */
  const L6=GBY.analysis.levels[5].g;if(L6.length<6||L6[0]!==G_ck.findKey||L6[1]!==G_ck.sharedKey)tb('level 6: the present questions first, then the new ones as the main part');
  many(keyIIVQ(),200,q=>{const t=plain(q.prompt);if(/degree/.test(t))tb('level 6 II–V question prints a degree');const ch=t.match(/[A-G][♭♯]?m7|[A-G][♭♯]?7/g),k=q.answer.replace(' major',''),sc=scale(P(k),'major');if(!ch||ch.length<2||ch[0]!==nm(sc[1])+'m7'||ch[1]!==nm(sc[4])+'7')tb('II–V of '+q.answer+': '+ch);if(!q.choices.includes(q.answer)||new Set(q.choices).size!==q.choices.length)tb('II–V choices');});
  {const roots=new Set();many(keysHoldQ(),300,q=>{const t=plain(q.prompt),c=symQ((t.match(/hold\\s+([A-G][♭♯]?m7)/)||[])[1]);if(!c){tb('keys question prompt '+t);return;}roots.add(nm(c.r));if(/degree|IIm7|IIIm7|VIm7/.test(t))tb('level 6 keys question gives the degree');
    const pcs=chord(c.r,'m7').map(pc).sort().join(),holds=k=>[0,1,2,3,4,5,6].some(i=>diatonic(scale(P(k),'major'),i,1).notes.map(pc).sort().join()===pcs),all=[...new Set(ALL_MAJ.filter(holds).map(k=>pc(P(k))))];
    if(all.length!==3)tb('a m7 chord is in three keys, found '+all.length);if(q.answer.length!==3||q.answer.some(a=>!holds(a.replace('♭','b').replace('♯','#')))||new Set(q.answer.map(a=>pc(P(a)))).size!==3)tb('keys that hold '+nm(c.r)+'m7: '+q.answer);
    if(!q.tokens||q.tokens.length!==12||new Set(q.tokens.map(a=>pc(P(a)))).size!==12||!subset(q.answer,q.tokens))tb('the row of keys '+q.tokens);
    if(!check(q,q.answer.slice())||!check(q,q.answer.slice().reverse())||!check(q,[q.answer[1],q.answer[2],q.answer[0]]))tb('the three keys in any order');const wrongKey=q.tokens.find(x=>!q.answer.includes(x));if(check(q,[q.answer[0],q.answer[1],wrongKey])||check(q,[q.answer[0],q.answer[0],q.answer[1]])||check(q,q.answer.slice(0,2)))tb('a wrong set of keys passes');});if(roots.size<10)tb('keys question roots '+roots.size);}}
 /* ---- 1. Chord–Scale Reflex ---- */
 S.gid='chordscale';
 {const L1=GBY.chordscale.levels[0].g;if(!L1.includes(G_cs2.inKey)||!L1.includes(G_cs2.inKeyRev))tb('Chord–Scale 1: the two directions');
  many(G_cs2.inKey,300,q=>{const t=plain(q.prompt);if(/degree|\\d(st|nd|rd|th)/.test(t))tb('Chord–Scale 1 prints the degree: '+t);if(!/^cs-k-[A-G]b?-[0-6]$/.test(q.key))tb('Chord–Scale 1 item key changed '+q.key);if(/maj7/.test(t+q.explain))tb('maj7 shown in Chord–Scale 1');});
  many(G_cs2.inKeyRev,300,q=>{const t=plain(q.prompt),m=t.match(/takes\\s+([A-G][♭♯]?)\\s+(\\w+)\\s*:/);if(!m){tb('reverse question prompt '+t);return;}const k=q.answer.replace(' major',''),sc=scale(P(k),'major'),i=MAJ_MODES.indexOf(m[2]);if(i<1||nm(sc[i])!==m[1])tb('reverse question: '+t+' answered '+q.answer);if(!/^cs-kr-/.test(q.key))tb('reverse question key');
    /* no second key among the choices in which the chord takes the same mode */if(q.choices.filter(c=>{const s2=scale(P(c.replace(' major','').replace('♭','b').replace('♯','#')),'major');return nm(s2[i])===m[1];}).length!==1)tb('reverse question: two right keys '+q.choices);});
  /* level 2 */
  {const seen={};many(GBY.chordscale.levels[1].g[0],300,q=>{seen[q.key]=q.answer;});const want={'IMaj7 (Ionian)':'4 (the 11th)','IIm7 (Dorian)':'6 (the 13th)','IIIm7 (Phrygian)':'♭2 and ♭6','IVMaj7 (Lydian)':'none','V7 (Mixolydian)':'4 (the 11th)','VIm7 (Aeolian)':'♭6','VIIm7♭5 (Locrian)':'♭2'};for(const k in want)if(seen['av-'+k]!==want[k])tb('care note of '+k+': '+seen['av-'+k]);if(Object.keys(seen).length!==7)tb('avoid-note items '+Object.keys(seen));}
  many(GBY.chordscale.levels[1].g[1],200,q=>{if(/\\(|altered|Lydian ♭7|Lydian dominant/.test(q.answer))tb('II–V–I scale answer '+q.answer);if(!/^csp-[012]$/.test(q.key))tb('csp key');const want=['Dorian','Mixolydian','Ionian'][+q.key.slice(4)];if(q.answer.split(' ').slice(1).join(' ')!==want)tb('II–V–I scale '+q.answer);});
  /* level 5: the symbols decide; never offer as wrong a scale that holds every note of the symbol */
  {const seen={};many(G_cs2.symUse,600,q=>{const lab=q.label.replace(' → scale',''),e=cst(lab,'sym');if(!e){tb('symbol not in the table: '+lab);return;}seen[lab]=1;if(q.answer!==e.sc)tb(lab+' answered '+q.answer);if(/symmetric/.test(q.label))tb('a label calls '+lab+' a symmetric scale');
    q.choices.forEach(c=>{if(c===q.answer)return;if(!CSN[c])tb('a choice that is not a scale of the table: '+c);else if(cstOk(e,c)||cstHolds(e,c))tb(lab+': '+c+' holds every note of the symbol and is offered as wrong');});if(q.choices.length<3)tb(lab+' has too few choices');});
   if(Object.keys(seen).sort().join()!==CST.filter(e=>e.ctx==='sym').map(e=>e.f).sort().join())tb('symbols asked: '+Object.keys(seen));if(seen['7♭9']||seen['7♭13'])tb('7♭9 or 7♭13 asked by symbol');
   if(!cstHolds(cst('7♭9♭13','sym'),'altered')||!cstHolds(cst('7♯5','sym'),'altered')||cstHolds(cst('13♭9','sym'),'altered'))tb('what the altered scale holds');}
  /* level 6: the V7 of a minor chord */
  many(G_cs2.minorV,200,q=>{if(!/ Mixolydian ♭9 ♭13$/.test(q.answer))tb('minor V answer '+q.answer);if(q.choices.some(c=>/ altered$/.test(c)))tb('altered offered as wrong on the V7 of a minor chord');const V=P(q.answer.split(' ')[0].replace('♭','b').replace('♯','#')),r=tr(V,4,5),hm=scale(r,'harmonic').map(pc).sort().join();if(CSN['Mixolydian ♭9 ♭13'].s.map(x=>mod(pc(V)+x,12)).sort().join()!==hm)tb('Mixolydian ♭9 ♭13 is harmonic minor from its 5th');});
  /* level 7: every choice is the answer of some item; V7/II takes the darker scale too */
  {const ans=new Set();let ch=null,two=0;many(secDomScaleQ(),400,q=>{ans.add(q.answer);ch=q.choices;const T=q.key.replace('cs-sec-',''),e=cst('V7/'+T);if(q.answer!==e.ten.join(' and ')+': '+e.sc)tb('tensions of V7/'+T+' '+q.answer);if(T==='II'){two++;if(!check(q,'♭9 and ♭13: Mixolydian ♭9 ♭13')||!check(q,q.answer)||check(q,'9 and 13: Mixolydian'))tb('V7/II: the darker scale is accepted, plain Mixolydian is not');}else if((q.also||[]).length)tb('V7/'+T+' accepts a second answer');
     /* the table against the key itself */const m=plain(q.prompt).match(/In\\s+(\\S+)\\s+major\\s*,\\s*([A-G][♭♯]?)7/);if(m){const key=scale(P(m[1].replace('♭','b').replace('♯','#')),'major').map(pc),r=pc(P(m[2]));const n9=key.includes(mod(r+2,12))?'9':'♭9',n13=key.includes(mod(r+9,12))?'13':'♭13';if(e.ten.join()!==n9+','+n13)tb('the key gives V7/'+T+' '+n9+' '+n13);}});
   if(!ch||ch.length!==3||ch.some(c=>!ans.has(c))||ans.size!==3)tb('level 7: a choice that is never the answer '+ch);if(!two)tb('V7/II never asked');}
  /* level 8: the chord type alone does not decide; the function is not printed */
  {const by={},keys=new Set();many(miScaleQ(),600,q=>{const t=plain(q.prompt);if(/borrowed|substitute|IVm7|♭VI|♭II|♭VII|subV7|I[IV]*Maj7|[IV]+m7/.test(t))tb('level 8 names the function: '+t);const c=symQ((t.match(/:\\s+([A-G][♭♯]?(?:Maj7|m7|7))\\s*\\./)||[])[1]);if(!c){tb('level 8 prompt '+t);return;}(by[c.q]=by[c.q]||new Set()).add(q.answer);keys.add(q.key);
     const f=q.label.replace('scale for ',''),e=cst(f);if(!e||q.answer!==e.sc)tb('level 8 '+f+' answered '+q.answer);(e.ok||[]).forEach(o=>{if(q.choices.includes(o)&&!check(q,o))tb('level 8: '+o+' is accepted by the table for '+f+' and marked wrong');});if(!CSN[e.sc].s.length||!cstHolds(e,e.sc))tb('level 8: the scale does not hold the chord '+f);});
   for(const qq of ['maj7','m7','7'])if(!by[qq]||by[qq].size<2)tb('level 8: the chord type '+qq+' alone still decides');for(const k of ['cs-mi-1-7','cs-mi-10-7','cs-mi-5-m7','cs-mi-8-maj7','cs-mi-1-maj7'])if(!keys.has(k))tb('level 8: old item key gone '+k);}
  /* texts: the pentatonic on the ♭6 of E♭ Aeolian, whole-half, Lydian augmented */
  {let hit=0;many(pentaQ(),900,q=>{if(/E♭ Aeolian/.test(plain(q.prompt))){hit++;if(!/C♭ major pentatonic/.test(q.explain)||/ B major pentatonic/.test(q.explain))tb('the pentatonic on the ♭6 of E♭ Aeolian is C♭: '+plain(q.explain));}});if(!hit)tb('E♭ Aeolian never asked (test is blind)');
   if(symNotes(P('C'),'whole-half diminished').map(nm).join(' ')!=='C D E♭ F G♭ A♭ A B'||symNotes(P('D'),'whole-half diminished').map(nm).join(' ')!=='D E F G A♭ B♭ B C♯')tb('whole-half is spelled with the chord’s ♭5: '+symNotes(P('C'),'whole-half diminished').map(nm).join(' '));
   if(mdCare('Lydian augmented','aug').join()!=='6')tb('the 6 of Lydian augmented lies a half step above the ♯5');const T=JSON.stringify(LESSON_NOTES.chordscale.map(c=>c.p.map(nt)));{const row=LESSON_NOTES.chordscale.flatMap(c=>c.p).filter(it=>it&&it.tbl).flatMap(it=>it.tbl[1]).find(r=>/Lydian augmented/.test(r[0]));if(!row||row[3]!=='9 ♯11')tb('Lydian augmented’s 13 given as a tension');}if(/nothing is played/.test(T)||!/played in Modes/.test(T))tb('chapter 14: the scales are played in Modes');if(/the two names mean the same thing/.test(T))tb('colour note and characteristic note');
   if(MD.Ionian.c[0]!=='7'||MD.Aeolian.c[0]!=='♭6'||MD.Locrian.c[0]!=='♭2'||MODE_CHAR.Locrian!=='♭5')tb('the colour notes the chapter cites have changed');
   for(const [n,L] of [['Melodic minor and its modes',8],['Dominant colours',9],['Symmetric scales and harmonic minor',10]])if(GBY_LV('modes',n)!==L-1)tb('the notes point to Modes level '+L+' as '+n);
   many(slashQ(),200,q=>{if(q.key==='cs-slash-2'&&(!/Lydian/.test(q.answer)||!/7th in the bass/.test(q.answer)||!/decides/.test(q.explain)))tb('D/C: both readings');});}}
 /* ---- 1. Chord Spelling: same size only; the multiple-choice question has its own keys ---- */
 S.gid='spelling';
 {for(const [L,i] of [[4,0],[8,0],[8,2]])many(G0('spelling',L,i),400,q=>{const shown=(plain(q.prompt).match(/[A-G][♭♯𝄫𝄪]?(?=\\s|$|\\?)/g)||[]),n=symQ(q.answer.replace(/^([A-G][♭♯]?)(.*)$/,'$1$2'));const size=c=>{const s=symQ(c);return s&&CH[s.q]?CH[s.q].length:-1;},a=size(q.answer);if(a<3)tb('cannot read '+q.answer);if(q.choices.some(c=>size(c)!==a))tb('spelling '+L+': a choice of another size '+q.choices.join(' | ')+' for '+q.answer);if(q.choices.length<2)tb('spelling '+L+' choices');});
  many(G0('spelling',8,2),300,q=>{const s=symQ(q.answer);if(s.q==='6'||s.q==='m7'){const o=s.q==='6'?sym(tr(s.r,6,9),'m7'):sym(tr(s.r,3,3),'6'),os=symQ(o);if(q.explain.indexOf(o)<0||chord(s.r,s.q).map(pc).sort().join()!==chord(os.r,os.q).map(pc).sort().join())tb('the look-alike of '+q.answer+' is '+o+': '+q.explain);if(/C6 and Am7/.test(q.explain)&&nm(s.r)!=='C'&&nm(s.r)!=='A')tb('C6 and Am7 printed on another root');}});
  const k9=[new Set(),new Set(),new Set()];GBY.spelling.levels[8].g.forEach((gen,i)=>many(gen,300,q=>k9[i].add(q.key)));if([...k9[1]].some(k=>!/^spc-/.test(k))||[...k9[0]].some(k=>!/^sp-/.test(k))||[...k9[1]].some(k=>k9[0].has(k)))tb('Chord Spelling 9: the multiple-choice question shares keys with the recall');
  const N9=JSON.stringify(LEVEL_NOTES.spelling[8]);if(/minor 3rd above/.test(N9)||N9.indexOf(nm(tr(P('C'),9,15))+', not E♭')<0)tb('the ♯9 is a raised 2nd');if(/9th and 11th are optional/.test(N9)||!/11th is left out/.test(N9))tb('the 11th of a 13 chord is left out');
  if(/short clock/.test(GBY.spelling.levels[4].d)||!/2\\.9 seconds/.test(JSON.stringify(LEVEL_NOTES.spelling[4])))tb('level 5: one speed figure');
  if(/in any order/.test(nt(LESSON_NOTES.spelling.find(c=>/Naming a chord/.test(c.h)).p[0])))tb('naming: the notes come root first or as an inversion, never in any order');   /* build 3: an inversion is asked now (the second generator of levels 4 and 8) */
  if(!/D7 with its 7th in the bass/.test(JSON.stringify(LEVEL_NOTES.spelling[9]))||!/Lydian/.test(JSON.stringify(LEVEL_NOTES.spelling[9])))tb('D/C: both readings in the level note');}
 /* ---- 2. Intervals & Keys ---- */
 S.gid='intervals';
 {if(/every major scale/i.test(GBY.intervals.levels[0].d)||/any interval/i.test(GBY.intervals.levels[6].d))tb('Intervals & Keys: level 1 or 7 description');
  let sharp=0;many(G_iv.buildIvAll,400,q=>{const m=plain(q.prompt).match(/above\\s+([A-G][♭♯])/);if(m){sharp++;if(q.explain.indexOf('from '+m[1])<0||q.explain.indexOf('above '+m[1])<0)tb('the explanation names the letter only: '+plain(q.explain));}});if(!sharp)tb('no altered root met');
  const T=JSON.stringify(LESSON_NOTES.intervals.map(c=>c.p.map(nt)));if(/share only two\\./.test(T)||!/two pitches/.test(T))tb('C and F♯ share two pitches');if(/thirteen of the fifteen/.test(T)||!/all fifteen/.test(T)||nm(relMinor('C#'))!=='A♯'||nm(relMinor('Cb'))!=='A♭')tb('the minor table has all fifteen keys');   /* build 3: A♯ and A♭ minor were added to the table */}
 /* ---- 3. One chord-scale table ---- */
 {if(CS_NAMES.length!==18)tb('eighteen scale names, found '+CS_NAMES.length);for(const n of CS_NAMES){const s=CSN[n];if(s.s.length!==s.d.length||s.s[0]!==0||s.s.some((x,i)=>i&&x<=s.s[i-1])||s.d[0]!=='1')tb('scale '+n);if(MD[n]&&(MD[n].s.join()!==s.s.join()||MD[n].d.join()!==s.d.join()))tb('Modes and the table differ on '+n);}
  for(const n of Object.keys(MD))if(!CSN[n])tb('Modes has a scale the table does not name: '+n);for(const n of MAJ_MODES.concat(MM_MODES.filter(x=>x!=='Dorian ♭2')))if(!CSN[n])tb('a mode list uses a name outside the table: '+n);
  for(const fam of Object.keys(MD_FAM))for(const n of MD_FAM[fam].m)if(!CSN[n])tb('MD_FAM '+n);
  for(const e of CST){const T=cstTones(e),sc=CSN[e.sc],dom=T.includes(4)&&T.includes(10);if(!sc){tb('table: unknown scale '+e.sc);continue;}if(!cstHolds(e,e.sc))tb('table: '+e.sc+' does not hold the notes of '+e.f);(e.ok||[]).forEach(o=>{if(!CSN[o])tb('table: unknown scale '+o);else if(!T.filter(p=>e.ctx!=='sym'&&p===7?false:true).every(p=>CSN[o].s.includes(p)))tb('table: accepted '+o+' does not hold '+e.f);});
    /* a tension lies a whole step above a chord tone (on a dominant the ♭9 and ♭13 are tensions too: the known exception); a care note a half step above one (the 6 of Dorian on IIm7 is held back for its tritone with the ♭3: the one other case) */
    (e.ten||[]).forEach(t=>{const s=TEN_SEMI[t];if(s===undefined||!sc.s.includes(s))tb('table: tension '+t+' is not in '+e.sc+' ('+e.f+')');else if(!T.includes(mod(s-2,12))&&!(dom&&(t==='♭9'||t==='♭13')&&T.includes(mod(s-1,12))))tb('table: tension '+t+' of '+e.f+' is not a whole step above a chord tone');if(T.includes(s))tb('table: tension '+t+' is a chord tone of '+e.f);});
    (e.care||[]).forEach(c=>{const s=CARE_SEMI[c];if(s===undefined||!sc.s.includes(s))tb('table: care note '+c+' is not in '+e.sc);else if(!T.includes(mod(s-1,12))&&!(e.f==='IIm7'&&c==='6'&&mod(s-T[1],12)===6))tb('table: care note '+c+' of '+e.f+' is not a half step above a chord tone');});
    if(e.ctx==='maj'&&e.dia){const i=KMAJ.indexOf(e.d);if(MAJ_MODES[i]!==e.sc)tb('table: '+e.f+' takes mode '+(i+1));if(!sc.s.every(x=>kIn(e.d+x)))tb('table: the scale of '+e.f+' leaves the key');}}
  /* the secondary dominants: the key decides, and the table says the same */
  for(const [f,d] of [['V7/II',9],['V7/III',11],['V7/IV',0],['V7/V',2],['V7/VI',4]]){const e=cst(f),w=[kIn(d+2)?'9':'♭9',kIn(d+9)?'13':'♭13'];if(e.d!==d||e.ten.join()!==w.join())tb('table: '+f+' takes '+w);if(!CSN[e.sc].s.includes(TEN_SEMI[w[0]])||!CSN[e.sc].s.includes(TEN_SEMI[w[1]]))tb('table: the scale of '+f);}
  if(CSN['Lydian ♭7'].s.map(x=>mod(x+1,12)).sort((a,b)=>a-b).join()!==CSN.altered.s.map(x=>mod(x+7,12)).sort((a,b)=>a-b).join())tb('D♭ Lydian ♭7 and G altered are the same notes');
  if(['I7','IV7','V7'].some(f=>cst(f,'blues').sc!=='Mixolydian'))tb('the blues takes Mixolydian');
  if(csSpell(P('C'),'altered').map(nm).join(' ')!=='C D♭ D♯ E F♯ A♭ B♭'||csSpell(P('G'),'Mixolydian ♭9 ♭13').map(nm).join(' ')!=='G A♭ B C D E♭ F')tb('csSpell');
  /* the reference chart reads the table */
  if(CS_CHART.some(r=>r.length!==4||r.some(c=>/undefined/.test(c)))||CS_CHART.find(r=>r[0]==='7♭9♭13')[2]!=='altered'||CS_CHART.find(r=>r[0]==='m7')[1]!=='Dorian'||CS_CHART.some(r=>r[0]==='7♭9'))tb('the chord-scale chart');
  /* names: every scale named in a question, hint, explanation, choice or level note of the five games is a name of the table; the other names are said once, in Chord–Scale Reflex's notes */
  const reName=new RegExp('(?:Ionian|Dorian|Phrygian|Lydian|Mixolydian|Aeolian|Locrian)(?: [♭♯♮][0-9]+)*(?: (?:dominant|augmented))?','g'),reBad=new RegExp('harmonic minor from (?:its|the) 5th|Dorian with a ♭6|(?:half-whole|whole-half|half–whole|whole–half) dim|[Ss]uper[- ]Locrian|Lydian dominant|Phrygian dominant|Mixolydian ♭6|Mixolydian ♭2 ♭6','g');
  const scan=(where,t,strict)=>{t=plain(t);let m;reBad.lastIndex=0;if((m=reBad.exec(t)))tb(where+': the scale name “'+m[0]+'” is not the table’s');if(!strict)return;reName.lastIndex=0;while((m=reName.exec(t)))if(!CSN[m[0]])tb(where+': “'+m[0]+'” is not a scale of the table');};
  for(const gid of ['chordscale','modes','earmode','arp','improv']){const g=GBY[gid];S.gid=gid;scan(gid+' description',g.desc,1);g.levels.forEach((lv,li)=>{scan(gid+' level '+(li+1),lv.n+' '+lv.d,1);scan(gid+' level note '+(li+1),JSON.stringify(LEVEL_NOTES[gid][li]).replace(/the ♯4 of Lydian/g,''),1);
     lv.g.forEach(gen=>{const seen=new Set();for(let i=0;i<40;i++){let q;try{q=gen();}catch(e){continue;}const t=[q.prompt,q.hint,q.explain,q.answerText,Array.isArray(q.answer)?'':q.answer,(q.choices||[]).join(' | '),q.label].join(' ## '),k=plain(t).replace(/[A-G][♭♯]?/g,'X');if(seen.has(k))continue;seen.add(k);scan(gid+' level '+(li+1)+' question',t,1);}});});
    if(typeof LESSONS!=='undefined'&&LESSONS[gid])scan(gid+' lesson card',JSON.stringify(LESSONS[gid]),1);if(typeof LOBBY_NOTES!=='undefined'&&LOBBY_NOTES[gid])scan(gid+' level-page note',LOBBY_NOTES[gid],1);
    LESSON_NOTES[gid].forEach((c,ci)=>c.p.forEach(it=>{const t=nt(it);if(gid==='chordscale'&&/is also called/.test(t)){CS_AKA.forEach(([a,n])=>{if(t.indexOf(n+' is also called')<0||t.indexOf(a)<0)tb('the other names of '+n+' are not said');});return;}scan(gid+' chapter '+(ci+1),t.replace(/Dorian ♭2/g,''),1);}));}
  if(LESSON_NOTES.chordscale.reduce((a,c)=>a+c.p.filter(it=>/is also called/.test(nt(it))).length,0)!==1)tb('the other names are said once');
  for(const r of CS_CHART)scan('reference chart',r.join(' | '),1);
  S.gid='improv';
  /* Improvise: the VI7 of the turnaround takes 9 or ♭9, the Im7 of the minor cadence ♭6 or 6; nothing else moved */
  const U=(a,b)=>[...new Set(CSN[a].s.concat(CSN[b].s))].sort((x,y)=>x-y).join();if(SOLO_SC['v-II'].join()!==U('Mixolydian ♭13','Mixolydian ♭9 ♭13')||SOLO_SC['m-I'].join()!==U('Aeolian','Dorian'))tb('Improvise: the two widened scale sets');
  if(SOLO_SC['7♭9'].join()!==CSN['Mixolydian ♭9 ♭13'].s.join()||SOLO_SC.m7.join()!==CSN.Dorian.s.join()||SOLO_SC['7'].join()!==CSN.Mixolydian.s.join()||SOLO_SC.maj7.join()!==CSN.Ionian.s.join()||SOLO_SC['m7♭5'].join()!==CSN.Locrian.s.join())tb('Improvise: a scale set that was not to change');
  {const b=SOLO.e8turn.bars('C'),m=SOLO.min.bars('A');if(b[1][3]!=='v-II'||b.filter(x=>x[3]).length!==1||m[2][3]!=='m-I'||m[0][3]||m[1][3])tb('Improvise: which chords take the widened sets');
   for(let t=0;t<12;t++){const q=soloQ(SOLO.e8turn)(),c=q.solo.chs[1],r=c.ct[0];if(!c.sc.includes(mod(r+2,12))||!c.sc.includes(mod(r+1,12))||!c.sc.includes(mod(r+8,12))||c.sc.includes(mod(r+9,12)))tb('Improvise 11: VI7 takes 9 or ♭9 with ♭13');const q2=soloQ(SOLO.min)(),c2=q2.solo.chs[2],r2=c2.ct[0];if(!c2.sc.includes(mod(r2+8,12))||!c2.sc.includes(mod(r2+9,12)))tb('Improvise 7: Im7 takes ♭6 or 6');
    if(!soloGrade(q,{notes:q.target.map((m,i)=>({midi:m,mf:m,t:q.grid[i]*750+3000})),firstAt:3000,beat:750,beatStart:3000}).ok)tb('Improvise 11: the example fails');}}
  for(const k of Object.keys(SOLO_SCN))scan('Improvise scale label '+k,SOLO_SCN[k],1);for(const k of Object.keys(ENC_SCN))scan('Arpeggio Runner scale label '+k,ENC_SCN[k],1);}
 /* ---- 4. Every spelling can be entered ---- */
 S.gid='spelling';
 {if(P('B𝄫').a!==-2||P('F𝄪').a!==2||nm(P('B𝄫'))!=='B𝄫')tb('P reads a double accidental');if(!okDbl(chord(P('C'),'dim7'))||okDbl(chord(P('Eb'),'dim7'))||okDbl(chord(P('Gb'),'dim')))tb('okDbl: one double accidental, never two');
  let c7=null;const pcs7=new Set(),dbl=new Set();many(G0('spelling',7,0),4000,q=>{const n=q.answer.filter(x=>/[𝄪𝄫]/u.test(x)).length;if(n>1)tb('two double accidentals asked: '+q.answer);if(n)dbl.add(q.key);if(/dim7$/.test(q.key)){pcs7.add(pc(P(q.answer[0])));if(q.key==='sp-Cdim7')c7=q;}if(n&&!/dim7$/.test(q.key))tb('a double accidental outside the °7 chords of level 7: '+q.key);});
  if(!c7)tb('C°7 is never asked');else{if(c7.answer.join(' ')!=='C E♭ G♭ B𝄫')tb('C°7 = '+c7.answer);if(!check(c7,['C','E♭','G♭','B𝄫'])||check(c7,['C','E♭','G♭','A'])||check(c7,['C','E♭','G♭','B♭']))tb('C°7 graded');}
  if(pcs7.size!==12)tb('°7 chords on '+pcs7.size+' of twelve roots');for(const k of ['sp-Fdim7','sp-B♭dim7','sp-D♯dim7','sp-G♯dim7'])if(k!=='sp-D♯dim7'&&k!=='sp-G♯dim7'&&!dbl.has(k))tb(k+' is not asked');
  const tri=new Set();many(G0('spelling',3,0),3000,q=>{const n=q.answer.filter(x=>/[𝄪𝄫]/u.test(x)).length;if(n>1)tb('two double accidentals in a triad: '+q.answer);if(n){tri.add(q.key);if(!check(q,q.answer.slice()))tb('a spelling with a double accidental fails its own grader');const w=q.answer.slice();w[w.length-1]=w[w.length-1].replace(/[𝄪𝄫]/u,'');if(check(q,w))tb('the double accidental left out passes');}});
  for(const k of ['sp-C♯aug','sp-F♯aug','sp-Baug','sp-E♭dim','sp-D♭dim','sp-A♭dim'])if(!tri.has(k))tb(k+' is not asked');if(tri.has('sp-G♭dim'))tb('G♭ diminished needs two double flats');
  for(const [gid,L] of [['spelling',1],['spelling',2],['spelling',6],['spelling',8],['spelling',9],['intervals',1],['intervals',3],['intervals',4],['intervals',5],['intervals',6]]){S.gid=gid;GBY[gid].levels[L-1].g.forEach(gen=>many(gen,150,q=>{if(q.ui==='spell'&&q.answer.some(x=>/[𝄪𝄫]/u.test(x)))tb(gid+' '+L+': a double accidental where none was to be added '+q.answer);}));}
  S.gid='chordscale';many(G_cs2.spellMode,600,q=>{if((q.answer.join(' ').match(/[𝄪𝄫]/gu)||[]).length>1)tb('a mode with two double accidentals '+q.answer);});
  const N3=JSON.stringify(LEVEL_NOTES.spelling[2]),N7=JSON.stringify(LEVEL_NOTES.spelling[6]);if(N3.indexOf(chord(P('C#'),'aug').map(nm).join(' '))<0||N3.indexOf(chord(P('Eb'),'dim').map(nm).join(' '))<0||/left out of this level/.test(N3))tb('the note of Chord Spelling 3');if(N7.indexOf(chord(P('C'),'dim7').map(nm).join(' '))<0||!/D♯°7 for E♭°7/.test(N7)||chord(P('D#'),'dim7').some(n=>Math.abs(n.a)>1))tb('the note of Chord Spelling 7');}
 /* ---- 5. Functional numerals ---- */
 {const F=a=>fnForms(a).map(x=>x?x.t+(x.res?'!':''):'-').join(' ');if(F(['IMaj7','VI7','IIm7','V7'])!=='- V7/II! - -'||F(['I7','IV7'])!=='V7/IV -'||F(['I7','IVMaj7'])!=='V7/IV! -'||F(['I7','V7'])!=='- -'||F(['IIm7','♭II7','IMaj7'])!=='- subV7! -'||F(['♭II7','IIm7'])!=='- -'||F(['VIIm7♭5','III7(♭9)','VIm'])!=='- V7/VI! -'||F(['II7','II7','IIm7','V7'])!=='V7/V V7/V - -'||F(['III7','III7','VI7'])!=='V7/VI! V7/VI! V7/II')tb('fnForms '+F(['II7','II7','IIm7','V7']));
  const both=(q,where)=>{const i=q.fn.findIndex(Boolean);if(i<0)return 0;const a=q.answer.slice(),b=q.answer.slice();b[i]=q.fn[i];if(!check(q,a)||!check(q,b))tb(where+': both forms of '+q.answer[i]+' must pass');const w=q.answer.slice();w[i]=q.fn[i]==='V7/III'?'V7/II':q.fn[i]==='subV7'?'V7/II':'V7/III';if(check(q,w))tb(where+': the wrong target '+w[i]+' passes for '+q.answer[i]);if(!q.tokens.includes(q.fn[i])||!q.tokens.includes(q.answer[i]))tb(where+': the row lacks a form of '+q.answer[i]);
    if(q.fnRes[i]&&(String(q.answerText).indexOf(q.fn[i])<0||plain(q.explain).indexOf(q.fn[i])<0||!/also written/.test(plain(q.explain))))tb(where+': the functional form is shown first, the degree form as also written');return 1;};
  S.gid='analysis';let n=0;many(anWriteQ(['sd']),40,q=>{n+=both(q,'Harmony & Analysis');if(q.answer[1]!=='VI7'||q.fn[1]!=='V7/II'||q.key!=='an-w-sd')tb('the written secondary dominant');});many(anWriteQ(['tt']),40,q=>{n+=both(q,'Harmony & Analysis');if(q.fn[1]!=='subV7')tb('subV7');});many(anWriteQ(['mn']),40,q=>{if(q.fn&&q.fn.some(Boolean))tb('a functional form in the minor cadence');});if(n<80)tb('Harmony & Analysis: functional forms '+n);
  S.gid='earprog';n=0;let minorFn=0;GBY.earprog.levels.forEach((lv,li)=>lv.g.forEach(gen=>many(gen,60,q=>{if(q.ui!=='spell'||!q.tokens)return;if(q.fn&&q.fn.some(Boolean)){n+=both(q,'Hear the Progression '+(li+1));if(/minor/.test(plain(q.prompt).split('.')[0])&&!/relative minor/.test(plain(q.prompt)))minorFn++;}else if(q.answer.some(t=>/^(VI7|VII7|II7|III7)/.test(t))&&!/minor<\\/b>/.test(q.prompt))tb('Hear the Progression '+(li+1)+': a secondary dominant without its functional form '+q.answer);})));if(n<30)tb('Hear the Progression: functional forms met '+n);if(minorFn)tb('a functional form in a minor key');
  S.gid='repertoire';n=0;GBY.repertoire.levels.forEach((lv,li)=>lv.g.forEach(gen=>many(gen,200,q=>{if(!/^rp-num-/.test(q.key))return;if(!q.choices.includes(q.answer)||new Set(q.choices).size!==q.choices.length)tb('Repertoire numeral choices');if(!q.also||!q.also.length)return;n++;if(!check(q,q.answer)||q.also.some(a=>!check(q,a)))tb('Repertoire: both forms of '+q.answer+' must pass');if(q.choices.some(c=>q.also.includes(c)))tb('Repertoire: the same chord offered twice');
     const deg=q.also.concat([q.answer]).find(x=>!/\\/|subV7/.test(x)),fn=q.also.concat([q.answer]).find(x=>/\\/|subV7/.test(x));if(!deg||!fn||fnTok(fnBase(deg))!==fn)tb('Repertoire: '+q.answer+' / '+q.also);const w=fn==='V7/III'?'V7/II':'V7/III';if(check(q,w))tb('Repertoire: the wrong target passes');if(q.answer===fn&&!/also written/.test(q.explain))tb('Repertoire: also written');})));if(n<20)tb('Repertoire: functional forms met '+n);
  for(const t of FN_ALL)if(!TOK_ORDER.includes(t))tb('token order '+t);}
 S.gid='fretboard';}
/* ============ THE REVIEW OF THE THEORY GAMES: BUILD 2 (23 Nov 2026) ============
   the wider material of Harmony & Analysis, two devices in one line, minor keys, eight bars read, the key of the moment; Chord-Scale Reflex: entered spellings, tensions, the scale of a chord whose function is found.
   No backticks and no template slots in this block: it lives inside the sweep's own template string. */
{const tb=m=>{bad++;console.log('THEORY2',m);},plain=h=>String(h==null?'':h).replace(/<[^>]+>/g,'').replace(/\\s+/g,' ').trim(),many=(gen,n,f)=>{for(let i=0;i<n;i++){let q;try{q=gen();}catch(e){tb('a generator threw: '+e.message);return;}f(q,i);}};
 const LV=(gid,n)=>GBY[gid].levels[n-1],KEYMAJ=[0,2,4,5,7,9,11],QN={'Maj7':[0,4,7,11],'m7♭5':[0,3,6,10],'m7':[0,3,7,10],'dim7':[0,3,6,9],'7♭9':[0,4,7,10,1],'7':[0,4,7,10],'m6':[0,3,7,9],'m':[0,3,7],'':[0,4,7]};
 /* a chord symbol as the student reads it, taken apart without the app's chord functions: root pitch class and the chord's notes */
 const symX=s=>{const m=String(s).trim().match(/^([A-G])([♭♯]?)(Maj7|m7♭5|m7|dim7|7♭9|7|m6|m|)$/);if(!m)return null;const r=({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='♭'?11:m[2]==='♯'?1:0))%12;return {r,q:m[3],pcs:QN[m[3]].map(x=>(r+x)%12)};};
 const NUMQ={'Maj7':'Maj7','m7♭5':'m7♭5','m7':'m7','°7':'dim7','7(♭9)':'7♭9','7':'7','m6':'m6','m':'m','':''},NUMD={I:0,II:2,III:4,IV:5,V:7,VI:9,VII:11};
 const numX=t=>{const m=String(t).match(/^([♭♯]?)(VII|VI|IV|V|III|II|I)(.*)$/);return m&&NUMQ[m[3]]!==undefined?{d:(NUMD[m[2]]+(m[1]==='♭'?11:m[1]==='♯'?1:0))%12,q:NUMQ[m[3]]}:null;};
 const lineOf=q=>{const m=plain(q.prompt).match(/(?:major|minor)\\s*:\\s*(.+?)\\s*\\.\\s/);return m?m[1].split(' – ').map(x=>symX(x)):[];},tonic=k=>pc(P(k));
 const agree=(q,k,toks,what)=>{const L=lineOf(q),t=tonic(k);if(L.length!==toks.length||L.some(x=>!x)){tb(what+': the line in the prompt cannot be read: '+plain(q.prompt).slice(0,120));return;}toks.forEach((tk,i)=>{const n=numX(tk);if(!n||(t+n.d)%12!==L[i].r||n.q!==L[i].q)tb(what+': '+tk+' in '+k+' is not the chord shown ('+plain(q.prompt).slice(0,110)+')');});};
 /* ---- 1. the wider material ---- */
 S.gid='analysis';
 if(DEVICES.length!==7||DEVICES.map(d=>d.k).join()!=='tt,bd,sd,mi,dp,pl,mn')tb('DEVICES was to stay as it is');
 if(new Set(ANX.map(p=>p.id)).size!==ANX.length)tb('ANX ids');
 {const need={sd:5,rel:5,sub:6,mi:3,dim:4,dec:2};for(const g in need)if(ANX.filter(p=>p.g===g).length!==need[g])tb('ANX group '+g);
  const DIA={0:'Maj7',2:'m7',4:'m7',5:'Maj7',7:'7',9:'m7',11:'m7♭5'},PMIN={0:'m7',2:'m7♭5',3:'Maj7',5:'m7',7:'m7',8:'Maj7',10:'7'},isDia=n=>DIA[n.d]===n.q;
  for(const p of ANX){const T=p.n.split(' '),N=T.map(numX);if(N.some(x=>!x)){tb('ANX numeral not read: '+p.n);continue;}
   for(const k of AN_KEYS){const chs=nuSeq(k,T),t=tonic(k);chs.forEach((c,i)=>{const X=symX(c.sym);if(!X||X.r!==(t+N[i].d)%12||X.q!==N[i].q)tb('nuSeq '+p.id+' in '+k+': '+T[i]+' gave '+c.sym);if(c.pcs.slice().sort().join()!==X.pcs.slice().sort().join()||c.bass!==X.r)tb('nuSeq sound '+p.id+' '+k+' '+c.sym);});
    for(let i=0;i+1<chs.length;i++){const a=chs[i],b=chs[i+1];if(/^m7/.test(a.q)&&/^7/.test(b.q)&&mod(b.bass-a.bass,12)===5&&mod(b.r.l-a.r.l,7)!==3)tb('a II – V not a fourth apart by letter: '+a.sym+' '+b.sym+' ('+p.id+' in '+k+')');}}
   T.forEach((tk,i)=>{const n=nuP(tk);if(!n||n.d!==N[i].d)tb('nuP '+tk);if(!(n.q==='dim7'&&n.acc==='♭')&&bnum(n.d,n.q)!==tk)tb('numeral '+tk+' is not what bnum writes ('+bnum(n.d,n.q)+')');});
   const a=p.at[0],b=p.at[1],out=N.map((n,i)=>isDia(n)?-1:i).filter(i=>i>=0);
   if(p.g==='sd'){if(a!==b||N[a].q!=='7'||mod(N[a].d-N[a+1].d,12)!==7||!isDia(N[a+1])||p.dev!=='V7/'+BN_STEP[N[a+1].d]||out.join()!==String(a))tb('ANX '+p.id+': not one secondary dominant with its target after it');}
   else if(p.g==='rel'){if(b!==a+1||!/^m7/.test(N[a].q)||N[b].q!=='7'||mod(N[b].d-N[a].d,12)!==5||mod(N[b].d-N[b+1].d,12)!==7||!isDia(N[b+1])||p.dev.indexOf('V7/'+BN_STEP[N[b+1].d]+' ')!==0)tb('ANX '+p.id+': not a II – V into a chord of the key');if((N[b+1].q==='m7')!==(N[a].q==='m7♭5'))tb('ANX '+p.id+': m7♭5 before a minor target, m7 before a major one');}
   else if(p.g==='sub'){if(N[b].q!=='7'||mod(N[b].d-N[b+1].d,12)!==1||isDia(N[b]))tb('ANX '+p.id+': the dominant does not fall a half step');if(b>a&&(N[a].q!=='m7'||mod(N[b].d-N[a].d,12)!==5))tb('ANX '+p.id+': related II');const tg=BN_STEP[N[b+1].d],want=tg==='I'?'subV7':'subV7/'+tg;if(p.dev.split(' with')[0]!==want)tb('ANX '+p.id+' named '+p.dev);}
   else if(p.g==='mi'){for(let i=a;i<=b;i++)if(isDia(N[i])||PMIN[N[i].d]!==N[i].q)tb('ANX '+p.id+': '+T[i]+' is not a chord of the parallel minor');if(out.some(i=>i<a||i>b))tb('ANX '+p.id+': a chord from outside beside the borrowed ones');}
   else if(p.g==='dim'){out.forEach(i=>{if(N[i].q!=='dim7')tb('ANX '+p.id+' holds another outside chord');const up=mod(N[i+1].d-N[i].d,12)===1&&mod(N[i].d-N[i-1].d,12)===1,dn=mod(N[i].d-N[i+1].d,12)===1&&mod(N[i-1].d-N[i].d,12)===1;if(!up&&!dn)tb('ANX '+p.id+': the diminished chord does not pass by half steps');if(up!==(T[i][0]==='♯'))tb('ANX '+p.id+': rising takes a sharp, falling a flat');if(up!==/ascending/.test(p.dev))tb('ANX '+p.id+' named '+p.dev);});if(!out.length)tb('ANX '+p.id+' has no diminished chord');}
   else if(p.g==='dec'){if(T[a]!=='V7'||N[b].d===0||b!==a+1)tb('ANX '+p.id+': not a deceptive resolution');}
   const syms=nuSeq('C',T).map(c=>c.sym),w=p.why(syms);if(!w||/undefined/.test(w))tb('ANX why '+p.id);for(let i=a;i<=b;i++)if(!isDia(N[i])&&w.indexOf(syms[i])<0)tb('ANX '+p.id+': the explanation does not name '+syms[i]);}}
 /* written lines: the chords shown are the numerals asked, both forms pass, the row holds the answer and more */
 {const seen=new Set();for(const [L,gi] of [[8,3],[9,2],[10,3],[11,3]])many(LV('analysis',L).g[gi],260,q=>{if(q.ui!=='spell'||!/^anx-w-/.test(q.key)){tb('level '+L+': the new written generator is not where it should be ('+q.key+')');return;}seen.add(q.key);const p=ANX_BY[q.key.slice(6)],k=q.anx.k;agree(q,k,q.answer,'level '+L);
    if(q.answer.join(' ')!==p.n)tb('written answer '+q.key);if(!check(q,q.answer.slice()))tb('the degree form fails '+q.key);if(q.answer.some(t=>!q.tokens.includes(t)))tb('the row lacks an answer token '+q.key);if(q.tokens.filter(t=>!q.answer.includes(t)&&!ROM_MAJ7.includes(t)&&!/\\/|subV7/.test(t)).length<3)tb('the row gives the answer away '+q.key);
    if(q.fn){const f=q.answer.map((t,i)=>q.fn[i]||t);if(!check(q,f))tb('the functional form fails '+q.key);if(f.some(t=>!q.tokens.includes(t)))tb('a functional token is not in the row '+q.key);q.fn.forEach((t,i)=>{if(!t)return;const n=numX(q.answer[i]),nx=numX(q.answer[i+1]||'I'),sub=/^subV7/.test(t),tg=t==='subV7'?'I':t.split('/')[1];if(BN_STEP[nx.d]!==tg||mod(n.d-nx.d,12)!==(sub?1:7))tb('functional form '+t+' for '+q.answer[i]+' before '+q.answer[i+1]);const w=f.slice();w[i]=t==='V7/II'?'V7/III':'V7/II';if(check(q,w))tb('a wrong functional form passes '+q.key);});}
    if(p.g==='sd'||p.g==='sub'){if(!q.fn||!q.fnRes.some(Boolean))tb('no functional form in '+q.key);if(!/also written/.test(q.explain))tb('also written: '+q.key);}
    if(fluTarget('analysis',q)!==2+2*q.need)tb('speed target of a written line '+q.key);});
  for(const p of ANX)if(p.g!=='dec'&&!seen.has('anx-w-'+p.id))tb('never written alone: '+p.id);}
 if(LV('analysis',8).g[2]().key!=='an-w-sd'||LV('analysis',17).g[0]().key.indexOf('an-w-')!==0)tb('the old written generators moved');
 /* 9: dual function */
 {const got={};many(LV('analysis',9).g[3],300,q=>{const L=lineOf(q),k=AN_KEYS.find(x=>plain(q.prompt).indexOf('In '+kname(x)+' major')===0);if(!k||L.length!==3||L.some(x=>!x)){tb('dual: prompt '+plain(q.prompt).slice(0,90));return;}const t=tonic(k),d=mod(L[0].r-t,12),dia={0:'Maj7',2:'m7',4:'m7',5:'Maj7',7:'7',9:'m7',11:'m7♭5'}[d]===L[0].q;got[q.key]=1;
    if(mod(L[1].r-L[0].r,12)!==5||L[1].q!=='7'||mod(L[1].r-L[2].r,12)!==7)tb('dual: not a II – V into its target');if(dia!==(q.answer!==DUAL_NO))tb('dual: '+plain(q.prompt).slice(0,80)+' answered '+q.answer);if(dia){const n=numX(q.answer);if(n.d!==d||n.q!==L[0].q)tb('dual numeral '+q.answer);}if(q.choices.join()!==DUAL_ROW.join())tb('dual row');});
  if(Object.keys(got).length!==7)tb('dual function items '+Object.keys(got).length);}
 /* 12: the dominant behind a rising diminished chord */
 {const got={};many(LV('analysis',12).g[2],300,q=>{const L=lineOf(q);if(L.length!==3||L.some(x=>!x)){tb('dim: prompt');return;}got[q.key]=1;const dom=c=>{const m=c.match(/^([A-G][♭♯]?)7\\(♭9\\)$/);return symX(m[1]+'7♭9');},A=dom(q.answer);
    if(!L[1].pcs.every(x=>A.pcs.includes(x)))tb('the diminished chord is not inside '+q.answer);if(mod(A.r-L[2].r,12)!==7)tb(q.answer+' is not a fifth above the target');if(mod(L[1].r-A.r,12)!==4)tb('not a major third below the diminished root');
    q.choices.forEach(c=>{if(c!==q.answer&&L[1].pcs.every(x=>dom(c).pcs.includes(x)))tb('a dominant that also holds the diminished chord is offered as wrong: '+c);});if(new Set(q.choices).size!==4)tb('dim choices');});if(Object.keys(got).length!==4)tb('dim-dominant items');}
 /* 14: the pivot inside a line, and the direct modulation */
 {const got={},MIN=[0,2,3,5,7,8,10,11];many(LV('analysis',14).g[2],400,q=>{const m=plain(q.prompt).match(/begins in\\s+(\\S+) major\\s+and ends in\\s+(\\S+) (major|minor)/),L=lineOf(q);if(!m||L.some(x=>!x)||L.length<5){tb('modulation prompt '+plain(q.prompt).slice(0,100));return;}got[q.key]=1;
    const t1=pc(P(m[1])),t2=pc(P(m[2])),in1=c=>c.pcs.every(x=>KEYMAJ.includes(mod(x-t1,12))),in2=c=>c.pcs.every(x=>(m[3]==='minor'?MIN:KEYMAJ).includes(mod(x-t2,12)))&&!(m[3]==='minor'&&c.pcs.includes(mod(t2+10,12))&&c.pcs.includes(mod(t2+11,12)));
    const j=L.findIndex(c=>!in1(c));if(j<1){tb('modulation: no chord leaves the old key');return;}const names=plain(q.prompt).match(/(?:major|minor)\\s*:\\s*(.+?)\\s*\\.\\s/)[1].split(' – ').map(x=>x.trim());
    for(let i=j;i<L.length;i++)if(!in2(L[i]))tb('modulation: '+names[i]+' is not of the new key');const piv=in2(L[j-1]);
    if(piv!==(q.answer!==MOD_DIRECT))tb('modulation '+q.key+': '+names.join(' ')+' answered '+q.answer);if(piv&&q.answer!==names[j-1])tb('pivot '+q.key+': '+q.answer+' for '+names[j-1]);if(!q.choices.includes(MOD_DIRECT)||new Set(q.choices).size!==q.choices.length)tb('modulation choices');
    if(/direct/.test(q.label)!==(q.answer===MOD_DIRECT))tb('modulation label');});
  if(Object.keys(got).length!==ANX_MOD.length)tb('modulation items '+Object.keys(got).length);let dir=0;ANX_MOD.forEach(T=>{if(anxMod(T,'C').pv<0)dir++;});if(dir<2||dir>ANX_MOD.length-3)tb('modulations: pivots and direct ones '+dir);}
 /* 16 and 17: two devices in one line */
 {let n=0,pairs=new Set();for(const [L,gi,wr] of [[16,3,false],[16,6,false],[17,1,true],[17,3,true]])many(LV('analysis',L).g[gi],300,q=>{n++;const ids=q.anx.ids,a=ANX_BY[ids[0]],b=ANX_BY[ids[1]],k=q.anx.k,A=a.n.split(' '),B=b.n.split(' '),toks=wr?q.answer:null;pairs.add(ids.join('+'));
    if(a.g===b.g||a.dev.split(' with')[0]===b.dev.split(' with')[0])tb('capstone: two lines of one kind '+ids);const L2=lineOf(q);if(L2.length<6||L2.length>8)tb('capstone: '+L2.length+' chords');const drop=A[A.length-1]===B[0]?1:0,all=A.concat(B.slice(drop));if(q.anx.off!==A.length-drop)tb('capstone offset');
    agree(q,k,all,'capstone '+ids);if(A[A.length-1]==='V7'&&B[0]!=='IMaj7')tb('capstone: a V7 that goes elsewhere at the join (a third device) '+ids);for(let i=0;i+1<all.length;i++)if(all[i]===all[i+1])tb('capstone: a chord twice in a row '+ids);
    if(wr){if(q.ui!=='spell'||q.answer.join(' ')!==all.join(' ')||!check(q,q.answer.slice()))tb('capstone written '+q.key);if(q.fn&&!check(q,q.answer.map((t,i)=>q.fn[i]||t)))tb('capstone functional form '+q.key);if(fluTarget('analysis',q)!==2+2*q.need)tb('capstone written speed');if(q.key!=='anx-cw-'+ids.join('-'))tb('capstone key '+q.key);if(q.tokens.filter(t=>!q.answer.includes(t)&&!(q.fn||[]).includes(t)&&!ROM_MAJ7.includes(t)&&!/\\/|subV7/.test(t)).length<3)tb('capstone row');}
    else{if(q.ui!=='choices'||q.key!=='anx-cd-'+ids.join('-'))tb('capstone key '+q.key);const names=plain(q.prompt).match(/major\\s*:\\s*(.+?)\\s*\\.\\s/)[1].split(' – ').map(x=>x.trim()),sa=names.slice(a.at[0],a.at[1]+1).join(' – '),sb=names.slice(b.at[0]+q.anx.off,b.at[1]+q.anx.off+1).join(' – '),want=sa+': '+a.dev+' · '+sb+': '+b.dev;
      if(q.answer!==want)tb('capstone answer '+q.answer+' / '+want);if(q.choices.length<4||new Set(q.choices).size!==q.choices.length||!q.choices.includes(q.answer))tb('capstone choices');
      q.choices.forEach(c=>{if(c===q.answer)return;const m=c.split(' · ').map(x=>x.split(': ')),da=m[0][1],db=m[1][1];if(m[0][0]!==sa||m[1][0]!==sb)tb('capstone: a choice names other chords');if(da===a.dev&&db===b.dev)tb('capstone: the answer twice');if((a.not||[]).includes(da)||(b.not||[]).includes(db))tb('capstone: a half-true name offered as wrong: '+c);if(da===db)tb('capstone: one name for both');});
      if(fluTarget('analysis',q)!==15)tb('capstone speed');}});
  if(pairs.size<60)tb('capstone: only '+pairs.size+' pairs met');}
 /* minor keys */
 {const FL={3:'♭III',8:'♭VI',10:'♭VII',5:'IV',7:'V',2:'II'},got=new Set();many(LV('analysis',5).g[2],400,q=>{const m=plain(q.prompt).match(/In\\s+(\\S+) minor\\s*, what is\\s+(\\S+)\\s+in/);if(!m){tb('minor numeral prompt');return;}const X=symX(m[2]),d=mod(X.r-pc(P(m[1])),12);got.add(q.answer);if(q.answer!==FL[d]+X.q)tb('minor numeral: '+m[2]+' in '+m[1]+' minor answered '+q.answer);if(q.choices.join()!==MN_ROW.join())tb('minor numeral row');if(q.key.indexOf('anx-mn-')!==0)tb('minor key '+q.key);});if(got.size!==7)tb('minor numerals asked: '+got.size);
  if(LV('analysis',5).g[0]!==G_ck.triadMin||LV('analysis',7).g[0]!==G_ck.harmV||LV('analysis',7).g[1]!==G_ck.func||LV('analysis',7).g[2]!==G_ck.twoFive)tb('levels 5 and 7: the old questions come first');
  const cad=new Set();many(LV('analysis',7).g[3],200,q=>{const k=AN_MINK.find(x=>plain(q.prompt).indexOf('Key of '+kname(x)+' minor')===0);if(!k){tb('minor line prompt');return;}cad.add(q.answer.join(' '));agree(q,k,q.answer,'minor line');if(q.fn)tb('a functional form in a minor key');if(q.answer.some(t=>!q.tokens.includes(t)))tb('minor row');if(!check(q,q.answer.slice()))tb('minor line self');});if(!cad.has('IIm7♭5 V7(♭9) Im'))tb('the minor cadence IIm7♭5 – V7(♭9) – Im is never written');if(cad.size!==ANX_MIN.length)tb('minor lines '+cad.size);
  const F={'Im7':'tonic minor','Im6':'tonic minor','♭IIIMaj7':'tonic minor','IVm7':'subdominant minor','IIm7♭5':'subdominant minor','♭VIMaj7':'subdominant minor','♭VII7':'subdominant minor','V7':'dominant','VII°7':'dominant'};for(const t in F)if(minFunc(t)!==F[t])tb('function in minor: '+t+' computed '+minFunc(t));if(MF_POOL.slice().sort().join()!==Object.keys(F).sort().join())tb('MF_POOL');
  many(LV('analysis',7).g[4],200,q=>{const t=q.key.slice(7);if(q.answer!==F[t])tb('function question '+q.key);});
  const SRC={'V7':'harmonic minor,melodic minor','VII°7':'harmonic minor','Im6':'melodic minor','IV7':'melodic minor','Vm7':'natural minor','♭VII7':'natural minor'};for(const t in SRC)if(minSrc(t).join()!==SRC[t])tb('minor scale of '+t+': '+minSrc(t));
  many(LV('analysis',7).g[5],200,q=>{const t=q.key.slice(7),ok=SRC[t].split(',');if(!ok.includes(q.answer))tb('source question '+q.key);ok.forEach(x=>{if(!check(q,x))tb('a scale that has the chord fails: '+x+' for '+t);});q.choices.forEach(c=>{if(!ok.includes(c)&&check(q,c))tb('a scale without the chord passes');});if(t==='V7'&&q.answer!=='harmonic minor')tb('V7 is named from harmonic minor');});}
 /* 18: eight bars read */
 {const seen=new Set();many(LV('analysis',18).g[0],500,q=>{seen.add(q.key);const sp=q.an8.sp,k=q.an8.k;if(q.key!=='an8-'+sp.id+'-'+sp.first)tb('an8 key '+q.key);if(q.ui!=='spell'||q.need!==q.answer.length||q.need<8)tb('an8 form');
    const cells=[...String(q.visual).matchAll(/<b>([^<]+)<\\/b>/g)].map(m=>m[1].split(' ')),flat=cells.flat().map(symX),t=tonic(k);if(cells.length!==8||flat.some(x=>!x)){tb('an8: the bars shown cannot be read '+q.key);return;}
    q.answer.forEach((tk,i)=>{const n=numX(tk);if(!n||(t+n.d)%12!==flat[i].r||n.q.replace('Maj7','Maj7')!==flat[i].q&&!(n.q===''&&flat[i].q===''))tb('an8 '+q.key+': '+tk+' is not the chord of bar '+(i+1));});
    if(!check(q,q.answer.slice()))tb('an8 self');if(q.fn&&!check(q,q.answer.map((x,i)=>q.fn[i]||x)))tb('an8 functional');if(sp.minor&&q.fn)tb('an8: functional form in minor');if(fluTarget('analysis',q)!==18)tb('an8 speed '+fluTarget('analysis',q));
    if(plain(q.prompt).indexOf(sp.name.replace(/^the /,''))>=0)tb('an8: the prompt names the form');if(plain(q.explain).indexOf('bars '+sp.first+' to '+(sp.first+7))<0)tb('an8: the explanation does not say where it comes from');});
  if(seen.size!==E8.length)tb('an8: '+seen.size+' of '+E8.length+' spans asked');}
 /* 19: the key of the moment */
 {if(KM.length<8)tb('fewer than eight passages hold a II – V in another key: '+KM.length);if(new Set(KM.map(x=>x.id+'-'+x.bar)).size!==KM.length)tb('KM: two passages with one key');
  const SEMI={'a half step up':1,'a whole step up':2,'a minor third up':3,'a major third up':4,'a fourth up':5,'a tritone away':6,'a fifth up':7,'a major third down':8,'a minor third down':9,'a whole step down':10,'a half step down':11};
  for(const x of KM){const a=symX(x.ii),b=symX(x.v),c=symX(x.tg),bars=x.f.bars;if(!a||!b||!/^m7/.test(a.q)||b.q!=='7'||mod(b.r-a.r,12)!==5)tb('KM '+x.id+' '+x.bar+': not a II – V');if(x.kp!==mod(b.r+5,12)||pc(x.kr)!==x.kp)tb('KM key from the dominant');
   if(x.kp===x.ht&&x.km===x.hm)tb('KM: the key of the tune itself');if(x.e-x.s+1<4||x.e-x.s+1>8||x.bar<x.s||x.bar>x.e||x.e>bars.length)tb('KM window '+x.id+' '+x.s+'-'+x.e);if(bars[x.bar-1].split(' ').indexOf(x.ii)<0)tb('KM bar '+x.id+' '+x.bar);
   if(c&&x.res!==(c.r===x.kp))tb('KM lands');if(x.res&&x.km!==/^m/.test(c.q))tb('KM mode from the chord it lands on');if(!x.res&&x.km!==(a.q==='m7♭5'))tb('KM mode from the II chord');
   const d=mod(x.kp-x.ht,12),r=x.rel;if(/relative minor/.test(r)){if(d!==9||x.hm||!x.km)tb('KM relative minor');}else if(/relative major/.test(r)){if(d!==3||!x.hm||x.km)tb('KM relative major');}else if(/parallel/.test(r)){if(d!==0)tb('KM parallel');}else{const m=r.match(/^the (major|minor) key (.+)$/);if(!m||SEMI[m[2]]!==d||(m[1]==='minor')!==x.km)tb('KM relation '+r+' for '+d);}}
  const want=[['autumn-leaves',1,'the relative major'],['fly-me-to-the-moon',6,'the relative minor'],['blue-bossa',9,'the major key a half step up'],['satin-doll',6,'the major key a tritone away'],['jazz-blues-in-f',4,'the major key a fourth up'],['all-the-things-you-are',21,'the major key a major third down']];
  for(const w of want){const x=KM.find(y=>y.id===w[0]&&y.bar===w[1]);if(!x||x.rel!==w[2])tb('KM reference '+w.join(' '));}
  const k1=new Set(),k2=new Set();many(LV('analysis',19).g[0],500,q=>{const x=q.km;k1.add(q.key);if(q.key!=='ank-'+x.id+'-'+x.bar)tb('ank key');if(q.choices.length!==12||new Set(q.choices.map(c=>pc(P(c)))).size!==12||pc(P(q.answer))!==x.kp)tb('ank row');const mk=(String(q.visual).match(/class="mk"/g)||[]).length+(String(q.visual).match(/<u>/g)||[]).length;if(mk<1)tb('ank: the cadence is not marked');if(String(q.visual).indexOf(x.ii)<0||String(q.visual).indexOf(x.v)<0)tb('ank: the passage does not show the cadence');if(plain(q.prompt).indexOf(nm(x.kr)+' m')>=0)tb('ank: the prompt gives the key');});
  many(LV('analysis',19).g[1],500,q=>{const x=q.km;k2.add(q.key);if(q.key!=='ank-'+x.id+'-'+x.bar+'-r'||q.answer!==x.rel||!q.choices.includes(q.answer)||new Set(q.choices).size!==q.choices.length||q.choices.length<5)tb('ank relation '+q.key);});
  if(k1.size!==KM.length||k2.size!==KM.length)tb('ank: passages asked '+k1.size+' '+k2.size+' of '+KM.length);}
 /* ---- 2. Chord-Scale Reflex ---- */
 S.gid='chordscale';
 {const pcs=a=>a.map(n=>pc(P(n))),FORM={'Lydian ♭7':CSN['Lydian ♭7'].s,altered:CSN.altered.s,'half-whole':CSN['half-whole'].s,'whole-half':CSN['whole-half'].s,'whole tone':CSN['whole tone'].s,'dominant bebop':[0,2,4,5,7,9,10,11],'major bebop':[0,2,4,5,7,8,9,11],'Dorian bebop':[0,2,3,4,5,7,9,10]};MAJ_MODES.forEach(m=>{FORM[m]=CSN[m].s;});
  const KEYRX={3:/^cs-sm-[A-G][♭♯]?-[0-6]$/,4:/^cs-sa-[A-G][♭♯]?-[36]$/,5:/^cs-ss-[A-G][♭♯]?-(half-whole diminished|whole-half diminished|whole tone)$/,6:/^cs-bb-[A-G][♭♯]?-(dominant|major|Dorian) bebop$/};let alts=0;
  for(const [L,gi] of [[3,0],[4,1],[5,1],[6,0]])many(LV('chordscale',L).g[gi],400,q=>{if(q.ui!=='spell'){if(!/^cs-(k|mm)-/.test(q.key))tb('level '+L+': a spelling is still chosen, not entered ('+q.key+')');return;}if(!KEYRX[L].test(q.key))tb('level '+L+': the item key changed: '+q.key);
    const name=Object.keys(FORM).sort((a,b)=>b.length-a.length).find(n=>q.label.indexOf(n)>0),r=pc(P(q.answer[0]));if(!name){tb('spelling: scale not known '+q.label);return;}const want=FORM[name].map(s=>(r+s)%12);
    if(pcs(q.answer).join()!==want.join())tb('spelling of '+q.label+': '+q.answer.join(' ')+' is not the scale in order');if(!q.given||q.given[0]!==q.answer[0]||q.given.length!==1)tb('spelling: the root is given');if(q.need!==want.length)tb('spelling need');
    if(q.spAlt)q.spAlt.forEach(a=>{alts++;if(pcs(a).join()!==want.join())tb('another spelling of '+q.label+' has other notes: '+a.join(' '));if(!check(q,a.slice()))tb('another spelling fails '+q.label);const mix=q.answer.map((x,i)=>i%2?a[i]:x);if(!check(q,mix))tb('a mix of the two spellings fails');});
    const w=q.answer.slice();w[2]=nm(tr(P(w[2]),1,1));if(check(q,w))tb('a wrong note passes in '+q.label);if(Math.abs(fluTarget('chordscale',q)-(1.5+0.7*(want.length-1)))>1e-9)tb('spelling speed '+q.label+' '+fluTarget('chordscale',q));if(/altered/.test(name)&&!q.spAlt&&!/[𝄪𝄫]/u.test(q.answer.join('')))tb('altered: one spelling only '+q.label);});
  if(alts<50)tb('second spellings met: '+alts);}
 /* 9: the pentatonic on the 4th of Ionian and Mixolydian is never the answer */
 {let io=0;many(pentaQ(),1500,q=>{const m=plain(q.prompt).match(/^\\s*(\\S+) (Ionian|Mixolydian)/);if(!m)return;io++;const r=pc(P(m[1])),a=pc(P(q.answer.split(' ')[0]));if(mod(a-r,12)===5)tb('pentatonic on the 4th of '+m[2]+' is the answer');if(/-5$/.test(q.key))tb('penta key '+q.key);if(q.choices.some(c=>mod(pc(P(c.split(' ')[0]))-r,12)===5))tb('pentatonic on the 4th offered');if(!/never the answer/.test(q.explain))tb('penta explanation');});if(io<200)tb('Ionian and Mixolydian pentatonics met '+io);}
 /* 10: the numeral of the triad is not printed; the scale that holds an upper structure */
 {many(LV('chordscale',10).g[0],200,q=>{if(/the triad on/.test(plain(q.prompt))||/[♭]?(?:VI|V|III|II)\\b/.test(plain(q.prompt).replace(/[A-G][♭♯]?7/g,'')))tb('level 10 prints the numeral of the triad: '+plain(q.prompt));});
  const got={};many(LV('chordscale',10).g[2],400,q=>{got[q.key]=1;const m=plain(q.prompt).match(/^\\s*(\\S+)7\\s+with the triad\\s+(\\S+) major/),r=pc(P(m[1])),t=pc(P(m[2])),need=[0,4,10].concat([0,4,7].map(x=>mod(t-r+x,12))),holds=n=>need.every(x=>CSN[n].s.includes(x));
    q.choices.forEach(c=>{if(!CSN[c])tb('upper structure: '+c+' is not a name of the table');if(holds(c)!==check(q,c))tb('upper structure '+q.key+': '+c+(holds(c)?' holds the triad and is marked wrong':' does not hold it and passes'));});if(!holds(q.answer))tb('upper structure answer');});if(Object.keys(got).length!==5)tb('upper structure items');}
 /* 11: available tensions, from the table */
 {const got={},got2={};for(const enter of [false,true])many(LV('chordscale',11).g[enter?1:0],600,q=>{const f=q.ten.f,k=q.ten.k,e=cst(f),m=plain(q.prompt).match(/^\\s*(\\S+)\\s+in\\s+(\\S+) major/),X=symX(m[1]);(enter?got2:got)[f]=1;if(!e||!e.ten){tb('tensions: no row for '+f);return;}
    if(mod(X.r-tonic(k),12)!==e.d||X.q.replace('Maj7','maj7')!==e.q||kname(k)!==m[2])tb('tensions: '+m[1]+' in '+k+' is not '+f);if(new RegExp('V7/|subV7|'+f.replace(/[♭]/g,'.')).test(plain(q.prompt)))tb('tensions: the function is printed');
    const okSets=[e.ten.join(', ')].concat(TEN_F.filter(x=>x.q===e.q&&e.ok&&e.ok.includes(x.sc)).map(x=>x.ten.join(', ')));
    if(!enter){if(q.key!=='cs-ten-'+f||q.answer!==e.ten.join(', '))tb('tension set of '+f);q.choices.forEach(c=>{if(okSets.includes(c)!==check(q,c))tb('tensions of '+f+': '+c+(okSets.includes(c)?' is what the table accepts and is marked wrong':' passes'));});if(q.choices.join()!==TEN_ROW.join())tb('tension row');}
    else{if(q.key!=='cs-tenn-'+f||q.ui!=='spell')tb('tension notes key');const want=e.ten.map(t=>(X.r+TEN_SEMI[t])%12);if(q.answer.map(n=>pc(P(n))).join()!==want.join())tb('tension notes of '+f+' in '+k+': '+q.answer);const L=[2,2,2,4,4,6,6],lt=q.answer.map(n=>mod(P(n).l-P(m[1].replace(/(Maj7|m7♭5|m7|7)$/,'')).l,7));e.ten.forEach((t,i)=>{if(lt[i]!==({'♭9':1,'9':1,'♯9':1,'11':3,'♯11':3,'♭13':5,'13':5})[t])tb('tension '+t+' on the wrong letter: '+q.answer[i]);});
      if(q.answer.some(n=>/[𝄪𝄫]/u.test(n)))tb('a double accidental in tension notes');(q.spAlt||[]).forEach(a=>{if(!check(q,a.slice()))tb('the other accepted tensions fail');});if(f==='V7/II'&&!(q.spAlt&&q.spAlt.length))tb('V7/II: ♭9 is accepted');if(fluTarget('chordscale',q)!==4+1.5*q.need)tb('tension notes speed');}});
  if(Object.keys(got).length!==TEN_F.length||Object.keys(got2).length!==TEN_F.length||TEN_F.length!==13)tb('tension items '+Object.keys(got).length+' '+Object.keys(got2).length);}
 /* 12 and 13: the answer is the table's scale for the chord in its function, found here without the game's own lookup */
 {const DIA={0:['maj7','IMaj7'],2:['m7','IIm7'],4:['m7','IIIm7'],5:['maj7','IVMaj7'],7:['7','V7'],9:['m7','VIm7'],11:['m7♭5','VIIm7♭5']},fnOf=(N,i)=>{const n=N[i],nx=N[i+1];if(n.q==='dim7')return '°7';if(DIA[n.d]&&DIA[n.d][0]===n.q)return DIA[n.d][1];if(n.q==='7'&&nx&&mod(n.d-nx.d,12)===7&&DIA[nx.d])return 'V7/'+BN_STEP[nx.d];if(n.q==='7'&&nx&&mod(n.d-nx.d,12)===1)return 'subV7';return {'5|m7':'IVm7','8|maj7':'♭VIMaj7','10|7':'♭VII7','2|m7♭5':'IIm7♭5'}[n.d+'|'+n.q]||null;};
  let outN=0,n=0;const seen=new Set();many(LV('chordscale',12).g[0],1200,q=>{n++;const p=ANX_BY[q.cspr.id],i=q.cspr.i,N=p.n.split(' ').map(nuP),f=fnOf(N,i),e=f==='°7'?cst('°7','sym'):f&&cst(f);seen.add(q.key);if(!e){tb('scales of a progression: a chord the table has no row for is marked: '+p.n+' #'+i);return;}
    if(q.answer!==e.sc)tb('scales of a progression: '+p.n+' chord '+(i+1)+' is '+f+' and takes '+e.sc+', not '+q.answer);q.choices.forEach(c=>{if(!CSN[c])tb('not a name of the table: '+c);if(cstOk(e,c)!==check(q,c))tb('scales of a progression: '+c+' for '+f+(cstOk(e,c)?' is accepted by the table and marked wrong':' passes'));});
    if(q.key!=='cs-pr-'+p.id+'-'+i)tb('cs-pr key');if(!DIA[N[i].d]||DIA[N[i].d][0]!==N[i].q)outN++;const L=lineOf(q);if(L.length!==4)tb('scales of a progression: four chords');if(N.every(x=>DIA[x.d]&&DIA[x.d][0]===x.q))tb('scales of a progression: no chord from outside the key in '+p.n);
    if(new RegExp('V7/|subV7|borrowed|secondary').test(plain(q.prompt)))tb('scales of a progression: the function is given');if((String(q.prompt).match(/class="hl"/g)||[]).length!==1)tb('one chord is marked');});
  if(outN<n*0.3||outN>n*0.8)tb('scales of a progression: chords from outside marked '+outN+' of '+n);if(seen.size<40)tb('scales of a progression: items '+seen.size);
  const seen8=new Set(),spans=new Set();many(LV('chordscale',13).g[0],1500,q=>{const sp=q.cs8.sp,i=q.cs8.i,c=sp.bars[i][0],k=q.cs8.k;seen8.add(q.key);spans.add(sp.id+sp.first);if(q.key!=='cs8-'+sp.id+'-'+sp.first+'-'+(i+1))tb('cs8 key');let e;
    if(sp.minor)e=({'0|m7':cst('Im7','min'),'0|m':cst('Im7','min'),'2|m7♭5':cst('IIm7♭5','min'),'7|7':cst('V7','min'),'3|maj7':cst('♭IIIMaj7','min'),'3|':cst('♭IIIMaj7','min'),'5|m7':cst('IVm7','min'),'5|m':cst('IVm7','min'),'7|m7':cst('Vm7','min'),'7|m':cst('Vm7','min'),'8|maj7':cst('♭VIMaj7','min'),'8|':cst('♭VIMaj7','min'),'10|7':cst('♭VII7','min')})[c[0]+'|'+c[1]];   /* build 3: the chords of the natural minor key have rows */
    else if(sp.blues&&c[1]==='7'&&[0,5,7].includes(c[0]))e=cst({0:'I7',5:'IV7',7:'V7'}[c[0]],'blues');
    else{const q2=c[1]===''?'maj7':c[1];e=DIA[c[0]]&&DIA[c[0]][0]===q2?cst(DIA[c[0]][1]):q2==='7'&&[9,11,0,2,4].includes(c[0])?cst('V7/'+BN_STEP[mod(c[0]+5,12)]):({'10|7':cst('♭VII7'),'5|m7':cst('IVm7'),'5|m':cst('IVm7'),'1|7':cst('subV7')})[c[0]+'|'+q2];}
    if(!e){tb('scales of eight bars: a bar the table has no row for: '+sp.id+' bar '+(i+1));return;}if(q.answer!==e.sc)tb('scales of eight bars: '+sp.id+' bar '+(i+1)+' takes '+e.sc+', not '+q.answer);q.choices.forEach(x=>{if(cstOk(e,x)!==check(q,x))tb('scales of eight bars: '+x+(cstOk(e,x)?' is accepted by the table and marked wrong':' passes'));});
    const cells=[...String(q.visual).matchAll(/<span( class="mk")?><i>(\\d+)<\\/i><b>([^<]+)<\\/b>/g)];if(cells.length!==8||cells.filter(m=>m[1]).length!==1||+cells.find(m=>m[1])[2]!==i+1)tb('scales of eight bars: one bar is marked, the asked one');const X=symX(cells[i][3]);if(!X||mod(X.r-tonic(k),12)!==c[0])tb('scales of eight bars: the chord shown');});
  if(spans.size!==E8.length)tb('scales of eight bars: spans '+spans.size);if(seen8.size!==CS8.length)tb('scales of eight bars: items '+seen8.size+' of '+CS8.length);}
 /* ---- 3. levels, notes, goals, tokens ---- */
 {const A=GBY.analysis,Cs=GBY.chordscale;if(A.levels.length!==19||Cs.levels.length!==13)tb('level counts '+A.levels.length+' '+Cs.levels.length);
  const old=['Major-key triads','Degrees & qualities','Diatonic sevenths & numerals','Function','Minor keys','Find the key','Harmonic minor & function','Secondary dominants','Extended dominants and related IIm7','Tritone sub & backdoor','Borrowed & passing chords','Diminished chords: three jobs','Where the dominant goes','Modulation: the pivot chord','Constant structure and Coltrane changes','Full analysis','Write the numerals'];old.forEach((n,i)=>{if(A.levels[i].n!==n)tb('Harmony & Analysis level '+(i+1)+' was renamed or moved');});
  if(A.levels[17].n!=='Analyse eight bars'||A.levels[18].n!=='The key of the moment'||Cs.levels[10].n!=='Available tensions'||Cs.levels[11].n!=='The scales of a progression'||Cs.levels[12].n!=='The scales of eight bars')tb('new level names');
  if(LEVEL_NOTES.analysis.length!==19||LEVEL_NOTES.chordscale.length!==13)tb('level notes');for(const [g,i] of [['analysis',17],['analysis',18],['chordscale',10],['chordscale',11],['chordscale',12]])if(!/[Ss]peed target/.test(JSON.stringify(LEVEL_NOTES[g][i])))tb('the level note of '+g+' '+(i+1)+' does not say its speed target');
  const more=k=>GOALS[k].more.map(x=>x.slice(0,3).join());if(!more('B').includes('analysis,9,19'))tb('goal B appendix: analysis 9 to 19');if(!more('A').includes('chordscale,3,13'))tb('goal A appendix: chord-scale 3 to 13');
  for(const k of GOAL_KEYS)GOALS[k].stages.forEach(st=>st.steps.forEach(s=>{if((s[0]==='analysis'&&s[2]>17)||(s[0]==='chordscale'&&s[2]>10))tb('a new level is required by goal '+k);}));
  const heads=g=>LESSON_NOTES[g].map(c=>c.h);for(const h of ['More of each device, in a line','Analysing a tune','Blues harmony, the line cliché and the pedal point'])if(!heads('analysis').includes(h))tb('chapter missing: '+h);if(!heads('chordscale').includes('From the chord to its function to its scale'))tb('chord-scale chapter missing');
  const txt=g=>LESSON_NOTES[g].slice(-3).map(c=>c.h+' '+c.p.map(it=>noteText(it)+' '+((it&&it.cap)||'')+' '+(it&&it.tbl?JSON.stringify(it.tbl):'')).join(' ')).join(' ');for(const g of ['analysis','chordscale']){const t=txt(g);if(/—|undefined|NaN|\\bmaj7\\b/.test(t))tb('new notes of '+g+': a dash, a slot or a lower-case maj7');}
  if(!/Repertoire/.test(txt('analysis'))||!/Hear the Progression \\(level \\d+\\)/.test(txt('analysis'))||!/Bass & Top \\(level \\d+\\)/.test(txt('analysis')))tb('the pointers to Repertoire, Hear the Progression and Bass & Top');
  const r1=an8Rows(E8.find(x=>x.id==='fly-me-to-the-moon'),'C');if(r1.map(r=>r[2]).join(' ')!=='VIm7 IIm7 V7 IMaj7 IVMaj7 VIIm7♭5 V7/VI VIm7'||r1.map(r=>r[1]).join(' ')!=='Am7 Dm7 G7 CMaj7 FMaj7 Bm7♭5 E7 Am7')tb('the worked eight bars: '+r1.map(r=>r[2]).join(' '));
  const r2=cs8Rows(E8.find(x=>x.id==='fly-me-to-the-moon'),'C');if(r2.map(r=>r[3]).join('|')!=='A Aeolian|D Dorian|G Mixolydian|C Ionian|F Lydian|B Locrian|E Mixolydian ♭9 ♭13|A Aeolian'||r2[6][4]!=='E F G♯ A B C D')tb('the worked scales: '+r2.map(r=>r[3]).join('|'));
  for(const t of ['♭III7','♭VI7','♭IIIm7','♭VIm7','♭VIIm7','IIIm7♭5','♯IVm7♭5','♯II°7','♯IV°7','♭III°7','subV7/II','subV7/V'])if(!TOK_ORDER.includes(t))tb('token order lacks '+t);
  const o0=['I','Im','IMaj7','Im7','I7','♭II7','II','IIm','IIm7','II°','IIm7♭5','II7','♭III','♭IIIMaj7','III','IIIm','IIIm7','III7','III7(♭9)','IV','IVm','IVMaj7','IVm7','IV7','V','Vm7','V7','V7(♭9)','♭VI','♭VIMaj7','VI','VIm','VIm7','VI7','♭VII','♭VII7','VII','VIIm7♭5','VII7','♯I°7','♯IV','V7/II','V7/III','V7/IV','V7/V','V7/VI','subV7'];if(TOK_ORDER.filter(t=>o0.includes(t)).join()!==o0.join())tb('the order of the older tokens changed');
  /* the functional forms of build 1 are untouched: a ♭III7 or ♭VI7 gets its form only through numFn2 */
  {const q=numFn({tokens:['IMaj7','♭III7','IIm7','V7'],answer:['IMaj7','♭III7','IIm7','V7']});if(q.fn&&q.fn.some(Boolean))tb('numFn itself was changed');const q2=numFn2({tokens:['IMaj7','♭III7','IIm7','♭VI7','V7'],answer:['IMaj7','♭III7','IIm7','♭VI7','V7']});if(q2.fn[1]!=='subV7/II'||q2.fn[3]!=='subV7/V'||!q2.tokens.includes('subV7/II'))tb('numFn2');const q3=numFn2({tokens:['IMaj7','♭III7','♭VI7','♭II7'],answer:['IMaj7','♭III7','♭VI7','♭II7']});if(q3.fn&&(q3.fn[1]||q3.fn[2]))tb('subV7/II without its target');}}
 S.gid='fretboard';}
/* ============ THE REVIEW OF THE THEORY GAMES: BUILD 3 (23 Nov 2026) ============
   Chord Spelling: the reverse question from an inversion, symbols and look-alikes on every root, slash chords, the dominant colours (11), the 3rd and the 7th (12).
   Intervals & Keys: fifteen major scales, inversion on notes, below a note and beyond the octave (8), the minor scales in every key (9).
   The chords of the natural minor key in the chord-scale table; the chain of II - V cadences in the key of the moment.
   Every answer is recomputed here from letters and half steps, without the app's chord and scale functions.
   No backticks and no template slots in this block: it lives inside the sweep's own template string. */
{const tb=m=>{bad++;console.log('THEORY3',m);},plain=h=>String(h==null?'':h).replace(/<[^>]+>/g,'').replace(/\\s+/g,' ').trim(),many=(gen,n,f)=>{for(let i=0;i<n;i++){let q;try{q=gen();}catch(e){tb('a generator threw: '+e.message);return;}f(q,i);}};
 const LV=(gid,n)=>GBY[gid].levels[n-1],L7={C:0,D:1,E:2,F:3,G:4,A:5,B:6},N12=[0,2,4,5,7,9,11];
 /* a note name read without P(): letter index, accidental, pitch class */
 const nn=s=>{const t=String(s).trim();if(L7[t[0]]===undefined)return null;let a=0;for(const ch of t.slice(1)){if(ch==='♯')a++;else if(ch==='♭')a--;else if(ch==='𝄪')a+=2;else if(ch==='𝄫')a-=2;else return null;}return {l:L7[t[0]],a,p:((N12[L7[t[0]]]+a)%12+12)%12,s:t};};
 const up=(a,b,num,semi)=>!!a&&!!b&&((b.l-a.l)%7+7)%7===(num-1)%7&&((b.p-a.p)%12+12)%12===semi%12,dbl=a=>a.filter(x=>/[𝄪𝄫]/u.test(x)).length;
 /* chord formulas typed here: [letter number, half steps] from the root */
 const F={'':[[1,0],[3,4],[5,7]],m:[[1,0],[3,3],[5,7]],dim:[[1,0],[3,3],[5,6]],aug:[[1,0],[3,4],[5,8]],'maj7♯5':[[1,0],[3,4],[5,8],[7,11]],maj7:[[1,0],[3,4],[5,7],[7,11]],'7':[[1,0],[3,4],[5,7],[7,10]],m7:[[1,0],[3,3],[5,7],[7,10]],'m7♭5':[[1,0],[3,3],[5,6],[7,10]],dim7:[[1,0],[3,3],[5,6],[7,9]],'m(maj7)':[[1,0],[3,3],[5,7],[7,11]],'6':[[1,0],[3,4],[5,7],[6,9]],m6:[[1,0],[3,3],[5,7],[6,9]],
  '7sus4':[[1,0],[4,5],[5,7],[7,10]],'7♯5':[[1,0],[3,4],[5,8],[7,10]],'7♭5':[[1,0],[3,4],[5,6],[7,10]],'7♯11':[[1,0],[3,4],[5,7],[7,10],[11,18]],'7♭13':[[1,0],[3,4],[5,7],[7,10],[13,20]],'13(no 11)':[[1,0],[3,4],[5,7],[7,10],[9,14],[13,21]],'maj7♯11':[[1,0],[3,4],[5,7],[7,11],[11,18]],'6/9':[[1,0],[3,4],[5,7],[6,9],[9,14]],m11:[[1,0],[3,3],[5,7],[7,10],[9,14],[11,17]]};
 const isCh=(names,q)=>{const N=names.map(nn);return !!F[q]&&N.length===F[q].length&&N.every((x,i)=>up(N[0],x,F[q][i][0],F[q][i][1]));};
 const DQ={'':'',m:'m',dim:'dim',aug:'aug',Maj7:'maj7','7':'7',m7:'m7','m7♭5':'m7♭5',dim7:'dim7','m(Maj7)':'m(maj7)','6':'6',m6:'m6','7sus4':'7sus4','7♯5':'7♯5','7♭5':'7♭5','7♯11':'7♯11','7♭13':'7♭13','13':'13(no 11)','Maj7♯11':'maj7♯11','6/9':'6/9',m11:'m11'};
 const sy=s=>{const m=String(s).trim().match(/^([A-G][♭♯]?)(.*)$/);return m&&DQ[m[2]]!==undefined?{r:m[1],q:DQ[m[2]]}:null;},pcsOf=(r,q)=>F[q].map(x=>(nn(r).p+x[1])%12).sort((a,b)=>a-b).join();
 /* ---- 0. the chord table: entries added, none changed ---- */
 {const OLD={'':'P1 M3 P5',m:'P1 m3 P5',dim:'P1 m3 d5',aug:'P1 M3 A5',maj7:'P1 M3 P5 M7','7':'P1 M3 P5 m7',m7:'P1 m3 P5 m7','m7♭5':'P1 m3 d5 m7',dim7:'P1 m3 d5 d7','m(maj7)':'P1 m3 P5 M7','6':'P1 M3 P5 M6',m6:'P1 m3 P5 M6',sus2:'P1 M2 P5',sus4:'P1 P4 P5',add9:'P1 M3 P5 9','9':'P1 M3 P5 m7 9',maj9:'P1 M3 P5 M7 9',m9:'P1 m3 P5 m7 9','11':'P1 M3 P5 m7 9 11',m11:'P1 m3 P5 m7 9 11','13':'P1 M3 P5 m7 9 11 13','7♭9':'P1 M3 P5 m7 b9','7♯9':'P1 M3 P5 m7 #9'};
  for(const k of Object.keys(OLD))if(!CH[k]||CH[k].join(' ')!==OLD[k])tb('the chord table: '+k+' was changed');if(Object.keys(QNAME).length!==23||Object.keys(QNAME).some(k=>OLD[k]===undefined))tb('QNAME grew: the naming questions of levels 4 and 8 would get new wrong choices');
  for(const k of Object.keys(CH))if(OLD[k]===undefined){if(!F[k])tb('a new chord with no formula in the sweep: '+k);else if(CH[k].map(x=>IV[x][0]+'|'+IV[x][1]).join()!==F[k].map(x=>x[0]+'|'+x[1]).join())tb('the formula of '+k);if(!QNAME_X[k])tb('no name for '+k);}
  if(Object.keys(CH).length!==32)tb('chord table entries '+Object.keys(CH).length);   /* 32 since the OSJ build (maj7♯5) */}
 /* ---- 1. Chord Spelling ---- */
 S.gid='spelling';
 {const G=GBY.spelling;if(G.levels.length!==12)tb('Chord Spelling has '+G.levels.length+' levels');['Major triads by heart','Minor: lower the 3rd','Diminished & augmented','Name the triad','All four, fast','Seventh chords','More sevenths & sixths','Name it; sus and add9','Extensions','Chord-symbol literacy','Dominant colours and the big chords','The 3rd and the 7th'].forEach((n,i)=>{if(G.levels[i].n!==n)tb('Chord Spelling level '+(i+1)+' is '+G.levels[i].n);});
  if(G.levels[3].g.length!==2||G.levels[7].g.length!==4||G.levels[3].g[0]!==G_cs.nameTri||G.levels[7].g[0]!==G_cs.name7)tb('levels 4 and 8: the old generator is the first step, the rotated one is added');
  /* the reverse question from an inversion */
  for(const [L,gi,nq] of [[4,1,4],[8,3,6]]){const seenQ=new Set(),inv=new Set();many(LV('spelling',L).g[gi],600,q=>{const shown=q.label.replace(/^Name /,'').split(' – '),a=sy(q.answer);if(!a){tb('rotated: cannot read '+q.answer);return;}seenQ.add(a.q);
    if(!/^nmr-/.test(q.key))tb('rotated key '+q.key);const set=shown.map(x=>nn(x).p).sort((x,y)=>x-y).join();if(set!==pcsOf(a.r,a.q))tb('rotated: '+shown.join(' ')+' are not the notes of '+q.answer);
    if(shown[0]===a.r)tb('rotated: the root is at the bottom '+shown.join(' '));const k=shown.indexOf(a.r);if(k<1){tb('rotated: the root is not among the notes');return;}inv.add(k);const back=shown.slice(k).concat(shown.slice(0,k));if(!isCh(back,a.q))tb('rotated: put back in 3rds '+back.join(' ')+' is not '+q.answer+' by its letters');
    for(let i=1;i<shown.length;i++)if(((nn(shown[i]).p-nn(shown[i-1]).p)%12+12)%12===0)tb('rotated: a note twice');if(plain(q.prompt).indexOf(shown.join(' '))<0)tb('rotated: the prompt shows other notes than the label');
    q.choices.forEach(c=>{const x=sy(c);if(!x||!F[x.q]){tb('rotated: a choice that cannot be read: '+c);return;}if(F[x.q].length!==shown.length)tb('rotated: a choice of another size: '+c);if(c!==q.answer&&pcsOf(x.r,x.q)===set)tb('rotated: '+c+' has the same notes as the answer '+q.answer);if(!shown.includes(x.r))tb('rotated: the choice '+c+' is on a note that is not shown');});
    if(q.choices.filter(c=>sy(c)&&sy(c).r===a.r).length>2)tb('rotated: the root is given away by the choices: '+q.choices.join(' | '));if(a.q==='m7'&&q.explain.indexOf('6;')<0)tb('rotated m7: the 6 chord with the same notes is named');});
   if(seenQ.size!==nq)tb('rotated level '+L+': chord types '+seenQ.size);if(inv.size!==(L===4?2:3))tb('rotated level '+L+': inversions met '+inv.size);}
  /* level 10: symbols on every root, the item keys as they were */
  {const OLDK=['C△7','C–7','Cø7','C°7','C7alt','C6/9','C7(♭9,♯11)','C/E','C7sus4','Cm(△7)','C+7','C–6'],EXP={'C△7':['△7','Maj7','maj7'],'C–7':['–7','m7','m7'],'Cø7':['ø7','m7♭5','m7♭5'],'C°7':['°7','dim7','dim7'],'C7alt':['7alt','7 with ♭9 ♯9 ♯11 ♭13'],'C6/9':['6/9','6 add 9','6/9'],'C7(♭9,♯11)':['7(♭9,♯11)','7 with ♭9 and ♯11'],'C7sus4':['7sus4',null,'7sus4'],'Cm(△7)':['m(△7)','m with a major 7th','m(maj7)'],'C+7':['+7','7 with ♯5','7♯5'],'C–6':['–6','m6','m6']};
   const keys=new Set(),roots=new Set();many(LV('spelling',10).g[0],1500,q=>{const id=q.key.replace(/^sym-/,'');keys.add(id);const m=plain(q.prompt).match(/symbol ([A-G][♭♯]?)(\\S*) mean/);if(!m){tb('symbol prompt '+plain(q.prompt));return;}const R0=m[1],r=nn(R0);roots.add(r.p);
     if(q.choices.some(c=>c.indexOf(R0)!==0))tb('symbols: a choice on another root');const ex=plain(q.explain),notes=(ex.split(': ')[1]||'').replace(/\\(.*?\\)/g,'').split('.')[0].trim().split(' ');
     if(id==='C/E'){const third=nn(m[2].replace('/',''));if(!up(r,third,3,4)||q.answer!==R0+' major, 3rd in the bass')tb('symbols: '+m[0]+' is '+q.answer);}
     else{const E=EXP[id];if(!E){tb('symbols: a new key '+q.key);return;}if(m[2]!==E[0])tb('symbols: '+q.key+' asked as '+m[1]+m[2]);if(E[1]!==null&&q.answer!==R0+E[1])tb('symbols: '+m[1]+m[2]+' answered '+q.answer);
      if(id==='C7sus4'){const w=q.answer.match(/7 with (\\S+) instead of (\\S+)$/);if(!w||!up(r,nn(w[1]),4,5)||!up(r,nn(w[2]),3,4))tb('symbols: sus4 '+q.answer);}
      if(E[2]&&!isCh(notes,E[2]))tb('symbols: the notes of '+m[1]+m[2]+' in the explanation: '+notes.join(' '));if(E[2]&&dbl(notes)>(id==='C°7'?1:0))tb('symbols: a double accidental in '+notes.join(' '));}});
   if(keys.size!==12||OLDK.some(k=>!keys.has(k)))tb('symbols: item keys '+[...keys].join(' '));if(roots.size<12)tb('symbols asked on '+roots.size+' roots');
   /* look-alikes: the two chords have the same notes, on every root */
   const Q2={'6':[0,4,7,9],m6:[0,3,7,9],Maj7:[0,4,7,11],'7':[0,4,7,10],Maj9:[0,4,7,11,2],'7♭9':[0,4,7,10,1],m7:[0,3,7,10],'m7♭5':[0,3,6,10],m:[0,3,7],'°':[0,3,6],'°7':[0,3,6,9],' major':[0,4,7]},OLDL=['C6','Cm6','Cmaj7 (no root)','C7 (no root)','Cmaj9 (no root)','C7♭9 (no root)','Am7 / C','Cm7 (no root)'];
   const ps=(s,noRoot)=>{const m=String(s).match(/^([A-G][♭♯]?)(.*)$/);if(!m||!Q2[m[2]])return null;const r=nn(m[1]).p;return Q2[m[2]].slice(noRoot?1:0).map(x=>(r+x)%12).sort((a,b)=>a-b).join();};
   const lk=new Set(),lr=new Set();many(LV('spelling',10).g[1],1500,q=>{lk.add(q.key.replace(/^la-/,''));const m=plain(q.prompt).match(/same notes as (.+?)\\?$/);if(!m){tb('look-alike prompt '+plain(q.prompt));return;}let s0=m[1],nr=false;if(/ \\(no root\\)$/.test(s0)){nr=true;s0=s0.replace(/ \\(no root\\)$/,'');}if(s0.indexOf(' / ')>0)s0=s0.split(' / ')[0];
     const A=ps(s0,nr),B=ps(q.answer,false);lr.add(nn(s0.match(/^[A-G][♭♯]?/)[0]).p);if(!A||!B||A!==B)tb('look-alike: '+m[1]+' and '+q.answer+' do not have the same notes');q.choices.forEach(c=>{if(c!==q.answer&&ps(c,false)===A)tb('look-alike: the wrong choice '+c+' has the same notes as '+m[1]);});});
   if(lk.size!==8||OLDL.some(k=>!lk.has(k)))tb('look-alikes: item keys '+[...lk].join(' | '));if(lr.size<12)tb('look-alikes asked on '+lr.size+' roots');
   /* slash chords spelled from the bass */
   const sk=new Set();many(LV('spelling',10).g[2],1500,q=>{sk.add(q.key);const m=plain(q.prompt).match(/Spell ([A-G][♭♯]?)(m?)\\/([A-G][♭♯]?) from the bass/);if(!m||q.ui!=='spell'){tb('slash prompt '+plain(q.prompt));return;}const root=nn(m[1]),bass=nn(m[3]),tri=F[m[2]],A=q.answer.map(nn);
     if(q.answer[0]!==m[3])tb('slash: the bass is not first: '+q.answer);const T=q.answer.filter(x=>tri.some(f=>up(root,nn(x),f[0],f[1])));const inTri=tri.some(f=>up(root,bass,f[0],f[1]));if(T.length!==3||q.answer.length!==(inTri?3:4))tb('slash: '+m[0]+' spelled '+q.answer);
     for(let i=2;i<A.length;i++)if(((A[i].p-A[0].p)%12+12)%12<=((A[i-1].p-A[0].p)%12+12)%12)tb('slash: not in rising order above the bass: '+q.answer);
     const id=q.key.replace('sls-',''),want={M3:['',4],m3:['m',3],M5:['',7],m5:['m',7],Mb7:['',10],M2:['',2]}[id];if(!want||want[0]!==m[2]||((bass.p-root.p)%12+12)%12!==want[1])tb('slash key '+q.key+' for '+m[0]);
     if(!check(q,q.answer.slice()))tb('slash: the answer fails');const w=q.answer.slice();const t=w[1];w[1]=w[2];w[2]=t;if(check(q,w))tb('slash: another order passes');if(!inTri&&!/two readings/.test(q.explain))tb('slash: both readings in the explanation');if(Math.abs(fluTarget('spelling',q)-(1.5+0.7*q.need))>1e-9)tb('slash speed');});
   if(sk.size!==6)tb('slash spelled: items '+[...sk].join(' '));
   const wk=new Set();many(LV('spelling',10).g[3],900,q=>{wk.add(q.key);const pr=plain(q.prompt),m=pr.match(/bass plays ([A-G][♭♯]?)\\. Above it: (.+?) Which/),a=q.answer.split('/');if(!m){tb('slash name prompt '+pr);return;}const up3=m[2].trim().split(' ');
     if(a[1]!==m[1]||!isCh(up3,'')||up3[0]!==a[0])tb('slash named: '+up3.join(' ')+' over '+m[1]+' answered '+q.answer);const d=((nn(a[0]).p-nn(m[1]).p)%12+12)%12;if(d!==({up2:2,dn2:10,up5:7})[q.key.replace('slw-','')])tb('slash named key '+q.key);if(up3.some(x=>nn(x).p===nn(m[1]).p))tb('slash named: the bass is a note of the triad');
     if(!/two readings/.test(q.explain))tb('slash named: both readings');if(new Set(q.choices).size!==q.choices.length||q.choices.length<4)tb('slash named choices');
     const say={2:/7 with its 7th in the bass.*Lydian/,10:/9sus4.*add9/,7:/Maj9 without its 3rd.*pedal/}[d];if(!say.test(plain(q.explain)))tb('slash named: the readings of '+q.answer);});
   if(wk.size!==3)tb('slash named: items '+wk.size);}
  /* level 11: the dominant colours and the big chords, by their formulas */
  {const types=new Set(),roots=new Set(),keys=new Set();let dn=0;GBY.spelling.levels[10].g.forEach(gen=>many(gen,1500,q=>{const m=q.key.match(/^sp-([A-G][♭♯]?)(.+)$/);if(!m||!F[m[2]]||q.ui!=='spell'){tb('level 11 key '+q.key);return;}types.add(m[2]);roots.add(nn(m[1]).p);keys.add(q.key);
    if(!isCh(q.answer,m[2]))tb('level 11: '+q.key+' spelled '+q.answer.join(' '));if(!q.given||q.given.length!==1||q.given[0]!==q.answer[0]||q.answer[0]!==m[1])tb('level 11: the root is given');if(dbl(q.answer)>1)tb('level 11: two double accidentals '+q.answer);dn+=dbl(q.answer);
    if(Math.abs(fluTarget('spelling',q)-(1.5+0.7*(q.answer.length-1)))>1e-9)tb('level 11 speed '+q.key);if(!check(q,q.answer.slice()))tb('level 11 answer fails');const w=q.answer.slice(),e=respell(P(w[w.length-1]));if(e){w[w.length-1]=nm(e);if(check(q,w))tb('level 11: the same pitch on another letter passes '+w);}
    if(/^m11/.test(m[2])&&/^[DGA]♭$/.test(m[1]))tb('a minor chord on a root minor chords are not written on: '+q.key);if(plain(q.explain).indexOf('On the guitar')<0)tb('level 11: what is left out');if(/\\(no 11\\)/.test(plain(q.prompt)))tb('level 11: the 13 chord is shown with its key name');}));
   if(types.size!==9)tb('level 11 chord types '+[...types].join(' '));if(roots.size!==12)tb('level 11 roots '+roots.size);if(!dn)tb('level 11: no double accidental met');
   const k9=new Set();GBY.spelling.levels.slice(0,10).forEach(lv=>lv.g.forEach(gen=>many(gen,300,q=>k9.add(q.key))));for(const k of keys)if(k9.has(k))tb('level 11 shares the item '+k+' with an older level');}
  /* level 12: the 3rd and the 7th */
  {const TH={maj7:[4,11],'7':[4,10],m7:[3,10],'m7♭5':[3,10],dim7:[3,9],'m(maj7)':[3,11]},types=new Set(),roots=new Set();many(LV('spelling',12).g[0],2500,q=>{const m=q.key.match(/^sg-([A-G][♭♯]?)(.+)$/);if(!m||!TH[m[2]]||q.ui!=='spell'||q.need!==2){tb('level 12 key '+q.key);return;}types.add(m[2]);roots.add(nn(m[1]).p);const r=nn(m[1]),A=q.answer.map(nn);
    if(!up(r,A[0],3,TH[m[2]][0])||!up(r,A[1],7,TH[m[2]][1]))tb('level 12: the 3rd and 7th of '+m[1]+m[2]+' are not '+q.answer.join(' '));if(dbl(q.answer)>1)tb('level 12: two double accidentals');if(q.given)tb('level 12: nothing is given');if(Math.abs(fluTarget('spelling',q)-(1.5+0.7*2))>1e-9)tb('level 12 speed');
    if(!check(q,q.answer.slice())||check(q,[q.answer[1],q.answer[0]]))tb('level 12 grading');if(plain(q.prompt).indexOf(m[1])<0)tb('level 12 prompt');});
   if(types.size!==6)tb('level 12 chord types '+types.size);if(roots.size!==12)tb('level 12 roots '+roots.size);
   const ks=new Set();many(LV('spelling',12).g[2],800,q=>{ks.add(q.key);const m=q.key.match(/^sgc-([A-G][♭♯]?)$/);if(!m||q.need!==6){tb('cadence key '+q.key);return;}const t=nn(m[1]),A=q.answer.map(nn),two=nn(m[1]);
    /* IIm7: 3rd = the 4th of the key, 7th = the tonic; V7: 3rd = the 7th of the key, 7th = the 4th; IMaj7: 3rd and 7th of the key */
    const W=[[4,5],[1,0],[7,11],[4,5],[3,4],[7,11]];W.forEach((w,i)=>{if(!up(t,A[i],w[0],w[1]))tb('cadence in '+m[1]+': note '+(i+1)+' is '+q.answer[i]);});
    if(q.answer[0]!==q.answer[3]||q.answer[2]!==q.answer[5])tb('cadence: the common tones '+q.answer);if(((A[1].p-A[2].p)%12+12)%12!==1||((A[1].l-A[2].l)%7+7)%7!==1||((A[3].p-A[4].p)%12+12)%12!==1||((A[3].l-A[4].l)%7+7)%7!==1)tb('cadence: the half steps '+q.answer);
    const ex=plain(q.explain);if(ex.indexOf(q.answer[0]+', stays')<0||ex.indexOf(q.answer[1]+', falls a half step to '+q.answer[2])<0||ex.indexOf(q.answer[3]+', falls a half step to '+q.answer[4])<0)tb('cadence: the explanation names the moves: '+ex);if(Math.abs(fluTarget('spelling',q)-(1.5+0.7*6))>1e-9)tb('cadence speed');
    const sm=plain(q.prompt).match(/^\\s*(\\S+) – (\\S+) – (\\S+), the/);if(!sm||!sy(sm[1])||sy(sm[1]).q!=='m7'||sy(sm[2]).q!=='7'||sy(sm[3]).q!=='maj7'||!up(t,nn(sy(sm[1]).r),2,2)||!up(t,nn(sy(sm[2]).r),5,7)||sy(sm[3]).r!==m[1])tb('cadence: the chords shown '+plain(q.prompt));});
   if(ks.size!==12)tb('cadence keys '+ks.size);}
  /* notes, level notes, goals */
  {const N=LEVEL_NOTES.spelling;if(N.length!==12)tb('level notes of Chord Spelling');for(const i of [10,11])if(!/Speed target/.test(JSON.stringify(N[i])))tb('level '+(i+1)+': the speed target is said');if(!/leaves out/.test(JSON.stringify(N[10])))tb('level 11 note: what a player leaves out');
   if(/always given root first/.test(JSON.stringify(N[3]))||!/inversion/.test(JSON.stringify(N[3])))tb('level 4 note');if(!/on any root/.test(JSON.stringify(N[9]))||/The level asks C\\/E, an inversion/.test(JSON.stringify(N[9])))tb('level 10 note');
   const txt=c=>c.h+' '+c.p.map(it=>noteText(it)+' '+((it&&it.cap)||'')+' '+(it&&it.tbl?JSON.stringify(it.tbl):'')).join(' '),CHS=LESSON_NOTES.spelling,h=CHS.map(c=>c.h);
   const a=CHS.find(c=>c.h==='The colours of the dominant, and three big chords'),b=CHS.find(c=>c.h==='The 3rd and the 7th');if(!a||!b||h.indexOf(a.h)!==h.length-2||h.indexOf(b.h)!==h.length-1)tb('the two new chapters are the last two');
   else{const ta=txt(a),t2=txt(b);if(ta.indexOf('E♭ G B D♭')<0||ta.indexOf('A C♯ E G B F♯')<0||ta.indexOf('C E G B♭ D A')<0)tb('the table of the new chords on C, E♭ and A');if(!/Guide-Tone Voice Leading/.test(t2)||t2.indexOf('Dm7: F C')<0||t2.indexOf('G7: B F')<0||t2.indexOf('CMaj7: E B')<0)tb('guide tones on paper: table and pointer');
    for(const t of [ta,t2])if(/—|undefined|NaN|\\bmaj7\\b/.test(t))tb('new notes of Chord Spelling: a dash, a slot or a lower-case maj7');}
   if(/always come root first/.test(txt(CHS.find(c=>/Naming a chord/.test(c.h)))))tb('chapter 7 still says root first only');if(!/Level 10 asks slash chords/.test(txt(CHS.find(c=>/Reading chord symbols/.test(c.h)))))tb('the slash-chord chapter says which level asks them');
   const st=GOALS.D.stages.map(s=>s.steps.filter(x=>x[0]==='spelling').map(x=>x[1]+'-'+x[2]).join()),i8=st.indexOf('8-10');if(i8<0||st[i8+1]!=='11-12')tb('goal D: Chord Spelling 11 to 12 in the stage after 8 to 10: '+st.join(' | '));if(!GOAL_WHY.D.steps['spelling:11'])tb('goal D: the reason of spelling 11');
   for(const k of ['A','C'])if(!GOALS[k].more.some(x=>x[0]==='spelling'&&x[1]===8&&x[2]===12))tb('goal '+k+' appendix: Chord Spelling 8 to 12');}}
 /* ---- 2. Intervals & Keys ---- */
 S.gid='intervals';
 {const G=GBY.intervals;if(G.levels.length!==9)tb('Intervals & Keys has '+G.levels.length+' levels');['Major scales','Key signatures','Major intervals','Minor keys','All intervals','Harmonic & melodic minor','Inversions & enharmonics','Below a note, and beyond the octave','The minor scales, every key'].forEach((n,i)=>{if(G.levels[i].n!==n)tb('Intervals & Keys level '+(i+1)+' is '+G.levels[i].n);});
  const steps=(A,pat)=>{const N=A.map(nn);if(N.some(x=>!x)||N.length!==7)return false;for(let i=0;i<7;i++){const a=N[i],b=N[(i+1)%7];if(((b.l-a.l)%7+7)%7!==1||((b.p-a.p)%12+12)%12!==pat[i])return false;}return true;};
  /* level 1: all fifteen major scales spelled whole */
  {const ks=new Set();many(LV('intervals',1).g[2],1500,q=>{ks.add(q.key);if(q.ui!=='spell'||!steps(q.answer,[2,2,1,2,2,2,1]))tb('major scale '+q.key+': '+q.answer);if(dbl(q.answer))tb('a double accidental in a major scale');if(q.key!=='spm-'+ALL_MAJ.find(k=>nm(P(k))===q.answer[0]))tb('major scale key '+q.key);});
   if(ks.size!==15)tb('major scales spelled whole: '+ks.size+' of fifteen');for(const k of ['spm-C#','spm-F#','spm-Gb','spm-Cb','spm-C','spm-G','spm-Db'])if(!ks.has(k))tb(k+' is not asked');if(!/fifteen/.test(G.levels[0].d))tb('level 1 says fifteen');}
  /* interval names typed here: number and half steps */
  const IVN={'minor 2nd':[2,1],'major 2nd':[2,2],'augmented 2nd':[2,3],'diminished 3rd':[3,2],'minor 3rd':[3,3],'major 3rd':[3,4],'diminished 4th':[4,4],'perfect 4th':[4,5],'augmented 4th':[4,6],'diminished 5th':[5,6],'perfect 5th':[5,7],'augmented 5th':[5,8],'minor 6th':[6,8],'major 6th':[6,9],'augmented 6th':[6,10],'diminished 7th':[7,9],'minor 7th':[7,10],'major 7th':[7,11]};
  const nameOf=(a,b)=>Object.keys(IVN).find(k=>up(a,b,IVN[k][0],IVN[k][1])&&((b.l-a.l)%7+7)%7===IVN[k][0]-1);
  /* level 7: inversion on notes */
  {if(G.levels[6].g.length!==3)tb('level 7: three generators, the name pairs first');const seen=new Set();many(LV('intervals',7).g[2],3000,q=>{seen.add(q.key);const m=plain(q.prompt).match(/^\\s*(\\S+) up to (\\S+) is an? ([a-z]+ \\d\\w+)\\. Turn it over: (\\S+) up to (\\S+) is/);if(!m){tb('inversion prompt '+plain(q.prompt));return;}const a=nn(m[1]),b=nn(m[2]);
    if(m[4]!==m[2]||m[5]!==m[1])tb('inversion: the notes change places');if(nameOf(a,b)!==m[3])tb('inversion: '+m[1]+' up to '+m[2]+' is not '+m[3]);if(nameOf(b,a)!==q.answer)tb('inversion: '+m[2]+' up to '+m[1]+' is '+nameOf(b,a)+', not '+q.answer);
    const x=IVN[m[3]],y=IVN[q.answer];if(!x||!y||x[0]+y[0]!==9||x[1]+y[1]!==12)tb('inversion: the pair does not add up to 9 and to an octave: '+m[3]+' / '+q.answer);if(Math.abs(a.a)>1||Math.abs(b.a)>1)tb('inversion: a double accidental');
    q.choices.forEach(c=>{if(!IVN[c])tb('inversion: a choice that is no interval name '+c);});    if(!/add up to 9/.test(plain(q.explain))||plain(q.explain).indexOf(x[1]+' + '+y[1])<0)tb('inversion explanation');});
   if(seen.size!==18)tb('inversion on notes: items '+seen.size);for(const k of ['ivn-A2','ivn-d7','ivn-A4','ivn-d5','ivn-A5','ivn-d4','ivn-A6','ivn-d3'])if(!seen.has(k))tb(k+' is not asked');}
  /* level 8: below a note; the tensions */
  {const ivs=new Set();let dn=0;many(LV('intervals',8).g[0],3000,q=>{const m=q.key.match(/^ivd-(\\w\\d)-([A-G][♭♯]?)$/),pm=plain(q.prompt).match(/What note is an? ([a-z]+ \\d\\w+) below (\\S+?)\\?/);if(!m||!pm||q.ui!=='spell'||q.need!==1){tb('below: '+q.key+' '+plain(q.prompt));return;}ivs.add(m[1]);const r=nn(pm[2]),n=nn(q.answer[0]),X=IVN[pm[1]];
    if(pm[2]!==m[2]||!X||!up(n,r,X[0],X[1]))tb('below: '+pm[1]+' below '+pm[2]+' is not '+q.answer[0]);if(nameOf(n,r)!==pm[1])tb('below: the name of '+q.answer[0]+' up to '+pm[2]);if(Math.abs(n.a)>2)tb('below: more than a double accidental');dn+=dbl(q.answer);if(fluTarget('intervals',q)!==4)tb('below: speed');
    const inv=Object.keys(IVN).find(k=>IVN[k][0]+X[0]===9&&IVN[k][1]+X[1]===12);if(plain(q.explain).indexOf(inv+' above')<0)tb('below: the explanation gives the inversion '+inv);const w=respell(P(q.answer[0]));if(w&&check(q,[nm(w)]))tb('below: the same pitch on another letter passes');});
   if(ivs.size!==12)tb('below: intervals asked '+ivs.size);if(!dn)tb('below: no double accidental met');
   const TS={'♭9':['minor 2nd',13],'9':['major 2nd',14],'♯9':['augmented 2nd',15],'11':['perfect 4th',17],'♯11':['augmented 4th',18],'♭13':['minor 6th',20],'13':['major 6th',21]},ts=new Set();many(LV('intervals',8).g[1],2500,q=>{const m=q.key.match(/^ivt-([♭♯]?\\d+)-([A-G][♭♯]?)$/);if(!m||!TS[m[1]]||q.ui!=='spell'||q.need!==1){tb('tension key '+q.key);return;}ts.add(m[1]);const r=nn(m[2]),n=nn(q.answer[0]),X=IVN[TS[m[1]][0]],pr=plain(q.prompt);
    if(!up(r,n,X[0],X[1]))tb('the '+m[1]+' above '+m[2]+' is not '+q.answer[0]);if(pr.indexOf('an octave plus a'+(/^a/.test(TS[m[1]][0])?'n ':' ')+TS[m[1]][0])<0)tb('tension: the prompt names the octave plus '+TS[m[1]][0]+': '+pr);if(pr.indexOf('above '+m[2])<0||pr.indexOf(m[1])<0)tb('tension prompt '+pr);
    if(plain(q.explain).indexOf(TS[m[1]][1]+' half steps')<0)tb('tension: the half steps in all');if(X[1]+12!==TS[m[1]][1])tb('tension table');if(fluTarget('intervals',q)!==3.5)tb('tension speed');if(Math.abs(n.a)>2)tb('tension: more than a double accidental');});
   if(ts.size!==7)tb('tensions asked '+ts.size);}
  /* level 9: the three minor scales in every key */
  {const PAT={natural:[2,1,2,2,1,2,2],harmonic:[2,1,2,2,1,3,1],melodic:[2,1,2,2,2,2,1]},D67={natural:[8,10],harmonic:[8,11],melodic:[9,11]},ks=new Set(),tonics=new Set();many(LV('intervals',9).g[0],6000,q=>{ks.add(q.key);const m=q.key.match(/^ms-(natural|harmonic|melodic)-([A-G][♭♯]?)$/);if(!m||q.ui!=='spell'||q.need!==7){tb('minor scale key '+q.key);return;}tonics.add(m[2]);
    if(q.answer[0]!==m[2]||!steps(q.answer,PAT[m[1]]))tb(m[2]+' '+m[1]+' minor: '+q.answer.join(' '));if(dbl(q.answer)>1)tb('a minor scale with two double accidentals: '+q.key);if(q.given)tb('minor scale: nothing is given');if(fluTarget('intervals',q)!==10)tb('minor scale speed');
    const ex=plain(q.explain);if(m[1]==='natural'?!/Nothing is changed/.test(ex):!/Changed from natural minor/.test(ex))tb('minor scale: the explanation names what changed');if(m[1]==='harmonic'&&ex.indexOf('becomes '+q.answer[6])<0)tb('harmonic minor: the raised 7th is named');if(m[1]==='melodic'&&(ex.indexOf('becomes '+q.answer[5])<0||ex.indexOf('becomes '+q.answer[6])<0))tb('melodic minor: the raised notes are named');
    const sig=ex.match(/signature of (\\S+) major/);if(!sig||!up(nn(m[2]),nn(sig[1]),3,3))tb('minor scale: the relative major');});
   if(ks.size!==44)tb('minor scales spelled whole: '+ks.size+' of 44');if(tonics.size!==15)tb('minor keys '+tonics.size);if(ks.has('ms-melodic-A♯'))tb('A♯ melodic minor needs two double sharps');for(const k of ['ms-harmonic-G♯','ms-melodic-G♯','ms-melodic-D♯','ms-harmonic-A♯','ms-natural-A♭','ms-harmonic-A♭','ms-melodic-E♭'])if(!ks.has(k))tb(k+' is not asked');
   const ds=new Set();many(LV('intervals',9).g[2],6000,q=>{ds.add(q.key);const m=q.key.match(/^msd-(natural|harmonic|melodic)-([A-G][♭♯]?)-([67])$/);if(!m||q.need!==1){tb('minor degree key '+q.key);return;}const n=nn(q.answer[0]),t=nn(m[2]);if(!up(t,n,+m[3],D67[m[1]][+m[3]-6]))tb('the '+m[3]+' of '+m[2]+' '+m[1]+' minor is not '+q.answer[0]);if(fluTarget('intervals',q)!==3.5)tb('minor degree speed');if(plain(q.prompt).indexOf(m[2]+' '+m[1]+' minor')<0)tb('minor degree prompt');});
   if(ds.size!==90)tb('minor degrees: items '+ds.size+' of 90');}
  /* notes, level notes, goals */
  {const N=LEVEL_NOTES.intervals;if(N.length!==9)tb('level notes of Intervals & Keys');for(const i of [7,8])if(!/Speed target/.test(JSON.stringify(N[i])))tb('Intervals & Keys level '+(i+1)+': the speed target is said');if(!/on notes/.test(JSON.stringify(N[6])))tb('level 7 note: inversion on notes');
   const txt=c=>c.h+' '+c.p.map(it=>noteText(it)+' '+((it&&it.cap)||'')+' '+(it&&it.tbl?JSON.stringify(it.tbl):'')).join(' '),CHS=LESSON_NOTES.intervals,by=rx=>txt(CHS.find(c=>rx.test(c.h)));
   if(!/Level 8/.test(by(/complete interval table/))||!/Level 8/.test(by(/above or below a note/)))tb('the chapters on compound and descending intervals name level 8');if(!/Level 7/.test(by(/^Inversion/)))tb('the inversion chapter names level 7');if(!/Level 9/.test(by(/Harmonic and melodic minor/)))tb('the minor-scale chapter names level 9');
   const mt=CHS.find(c=>/Relative and parallel/.test(c.h)).p.find(it=>it&&it.tbl&&/Minor key/.test(it.tbl[0][0]));if(!mt||mt.tbl[1].length!==15||!/all fifteen/.test(mt.cap))tb('the minor table has fifteen keys');else mt.tbl[1].forEach(r=>{if(!steps(r.slice(2),[2,1,2,2,1,2,2]))tb('the minor table: '+r.join(' '));});
   const t67=CHS.find(c=>/Harmonic and melodic minor/.test(c.h)).p.find(it=>it&&it.tbl&&/Minor key/.test(it.tbl[0][0]));if(!t67||t67.tbl[1].length!==15)tb('the table of the 6th and 7th in every key');else{const g=t67.tbl[1].find(r=>/G♯m/.test(r[0]));if(!g||g[2]!=='E F𝄪'||g[3]!=='E♯ F𝄪')tb('G♯ minor in the table of 6ths and 7ths: '+g);}
   if(by(/complete interval table/).indexOf('D♯')<0||!/an octave higher/.test(by(/complete interval table/)))tb('the table of tensions as notes');
   const A=GOALS.A.stages.map(s=>s.steps.filter(x=>x[0]==='intervals').map(x=>x[1]+'-'+x[2]).join());if(A[0]!=='1-3'||A[1]!=='4-5')tb('goal A: Intervals & Keys 1 to 3 in stage 1, 4 to 5 in stage 2: '+A.join(' | '));if(!GOAL_WHY.A.steps['intervals:1']||!GOAL_WHY.A.steps['intervals:4']||!/Intervals on the Neck/.test(GOAL_WHY.A.steps['intervals:1'][1]))tb('goal A: the reasons of the two steps');
   if(!GOALS.R.more.some(x=>x[0]==='intervals'&&x[1]===3&&x[2]===9))tb('goal R appendix: Intervals & Keys 3 to 9');for(const k of GOAL_KEYS)GOALS[k].more.forEach(x=>{if(x[0]==='intervals'&&x[2]>=7&&x[2]!==9)tb('an appendix stops before level 9');});}}
 /* ---- 3. the chords of the natural minor key in the chord-scale table ---- */
 S.gid='chordscale';
 {const NAT=[0,2,3,5,7,8,10],WANT={'♭IIIMaj7':[3,'maj7','Ionian'],'IVm7':[5,'m7','Dorian'],'Vm7':[7,'m7','Phrygian'],'♭VIMaj7':[8,'maj7','Lydian'],'♭VII7':[10,'7','Mixolydian']},TN={1:'♭9',2:'9',3:'♯9',5:'11',6:'♯11',8:'♭13',9:'13'},CN={1:'♭2',5:'4',8:'♭6',9:'6'};
  for(const f of Object.keys(WANT)){const e=cst(f,'min'),w=WANT[f];if(!e){tb('the table has no row for '+f+' of the minor key');continue;}if(e.d!==w[0]||e.q!==w[1]||e.sc!==w[2])tb('the minor row '+f+': '+e.sc);const sc=CSN[e.sc].s,T=F[e.q].map(x=>x[1]%12);
   if(sc.map(x=>(e.d+x)%12).some(p=>!NAT.includes(p)))tb(f+': its scale leaves the natural minor key');
   /* by the table's own rule: a scale note that is no chord tone is a tension when it lies a whole step above a chord tone and not a half step above one; a note a half step above a chord tone is treated with care */
   const ten=[],care=[];sc.forEach(s=>{if(T.includes(s))return;if(T.includes((s+11)%12))care.push(CN[s]);else if(T.includes((s+10)%12))ten.push(TN[s]);});if((e.ten||[]).join()!==ten.join())tb(f+': tensions by the rule are '+ten+', the table has '+e.ten);if((e.care||[]).join()!==care.join())tb(f+': care notes by the rule are '+care+', the table has '+e.care);}
  for(const [f,sc,ten,care] of [['Im7','Aeolian','9,11','♭6'],['IIm7♭5','Locrian','11,♭13','♭2'],['V7','Mixolydian ♭9 ♭13','♭9,♭13','4']]){const e=cst(f,'min');if(!e||e.sc!==sc)tb('the older minor rows changed: '+f);else if((e.ten||[]).join()!==ten||(e.care||[]).join()!==care)tb('the minor row '+f+': tensions '+e.ten+', care '+e.care);}
  if(TEN_F.length!==13||TEN_F.some(e=>e.ctx!=='maj'))tb('Available tensions (level 11) still asks the thirteen major-key rows only');
  /* any bar of a minor-key passage can be marked: every chord of every minor span has a row */
  let mb=0;E8.filter(sp=>sp.minor).forEach(sp=>sp.bars.forEach((b,i)=>b.forEach(c=>{mb++;if(!e8Cst(sp,c))tb('eight bars in minor: no row for the chord of bar '+(i+1)+' of '+sp.id);})));if(mb<16)tb('minor spans: chords '+mb);
  const al=E8.find(sp=>sp.id==='autumn-leaves'&&sp.minor);if(al){const n=CS8.filter(x=>x.sp===al).length,one=al.bars.filter((b,i)=>b.length===1&&(i===0||al.bars[i-1].length!==1||al.bars[i-1][0].join()!==b[0].join())).length;if(n!==one)tb('Autumn Leaves in minor: bars that can be asked '+n+' of '+one);}
  /* level 12: the minor lines */
  {const MAP={'Im':'Aeolian','Im7':'Aeolian','IIm7♭5':'Locrian','♭IIIMaj7':'Ionian','IVm7':'Dorian','Vm7':'Phrygian','V7':'Mixolydian ♭9 ♭13','V7(♭9)':'Mixolydian ♭9 ♭13','♭VIMaj7':'Lydian','♭VII7':'Mixolydian'},ROW={'Im':'Im7','V7(♭9)':'V7'},seen=new Set();if(LV('chordscale',12).g.length!==4||LV('chordscale',12).g[3]===LV('chordscale',12).g[0])tb('level 12: the minor lines are the fourth generator');
   many(LV('chordscale',12).g[3],1500,q=>{seen.add(q.key);const p=ANX_MIN.find(x=>x.id===q.csprm.id),i=q.csprm.i,toks=p.n.split(' '),t=toks[i],e=cst(ROW[t]||t,'min');if(q.key!=='cs-pr-min-'+p.id+'-'+i)tb('minor line key '+q.key);if(!e||!MAP[t]){tb('minor line: no row for '+t);return;}
    if(q.answer!==MAP[t]||q.answer!==e.sc)tb('minor line: '+t+' takes '+MAP[t]+', not '+q.answer);q.choices.forEach(c=>{if(!CSN[c])tb('not a name of the table: '+c);if(cstOk(e,c)!==check(q,c))tb('minor line: '+c+' for '+t+(cstOk(e,c)?' is accepted by the table and marked wrong':' passes'));});
    if((String(q.prompt).match(/class="hl"/g)||[]).length!==1)tb('minor line: one chord is marked');const pr=plain(q.prompt),km=pr.match(/Key of (\\S+) minor/),cm=pr.match(/marked chord, ([A-G][♭♯]?)/);if(!km||!cm){tb('minor line prompt '+pr);return;}const N={I:0,II:2,III:4,IV:5,V:7,VI:9,VII:11},tm=t.match(/^(♭?)(VII|VI|IV|V|III|II|I)/),d=(N[tm[2]]+(tm[1]?11:0))%12;
    if(((nn(cm[1]).p-nn(km[1]).p)%12+12)%12!==d)tb('minor line: the marked chord '+cm[1]+' is not '+t+' of '+km[1]+' minor');if(new RegExp('Aeolian|Dorian|Locrian|Lydian|Ionian|Phrygian|Mixolydian').test(pr))tb('minor line: the prompt gives a scale');});
   if(seen.size!==ANX_MIN.reduce((a,p)=>a+p.n.split(' ').length,0))tb('minor lines: items '+seen.size);}}
 /* ---- 4. the key of the moment: a chain of II - V cadences ---- */
 S.gid='analysis';
 {const rq=s=>{const m=String(s).match(/^([A-G][♭♯]?)(m7♭5|m7|7|Maj7|m6|m|6|)$/);return m?{p:nn(m[1]).p,q:m[2]}:null;};let ch=0;
  for(const x of KM){const cs=formChords(x.f).map(c=>c.sym),j=cs.indexOf(x.tg,x.i+2),tg=rq(x.tg),nx=rq(cs[j+1]||''),v=rq(x.v);const want=!!tg&&!!nx&&!!v&&x.res&&(tg.q==='m7'||tg.q==='m7♭5')&&nx.q==='7'&&((nx.p-tg.p)%12+12)%12===5&&((v.p-tg.p)%12+12)%12===7;
   if(want!==!!x.chain)tb('key of the moment: '+x.id+' bar '+x.bar+' is '+(want?'':'not ')+'a chain');if(!x.chain)continue;ch++;const ex=plain(kmWhy(x));
   if(/key of the moment is/.test(ex)||ex.indexOf(nm(x.kr)+' minor.')>=0||new RegExp('is '+nm(x.kr)+' minor').test(ex))tb('chain: the explanation says the key is '+nm(x.kr)+' minor: '+ex);if(ex.indexOf('points to '+nm(x.kr))<0||ex.indexOf(x.tg+' does not stay a tonic: it at once becomes the II of')<0||ex.indexOf(x.tg+' – '+x.nx+' is the II – V of '+x.nk)<0)tb('chain: the explanation: '+ex);
   if(((nn(x.nk).p-nx.p)%12+12)%12!==5)tb('chain: the next key');}
  if(ch<3||!KM.some(x=>x.chain&&x.id==='autumn-leaves'&&x.ii==='Gm7'&&x.tg==='Fm7'&&x.nk==='E♭'))tb('chains found '+ch+'; Gm7 - C7 - Fm7 - B♭7 of Autumn Leaves is one');
  let met=0;many(LV('analysis',19).g[0],600,q=>{const x=q.km;if(!x.chain)return;met++;if(q.answer!==nm(x.kr)||pc(P(q.answer))!==x.kp)tb('chain: the answer changed');if(plain(q.explain).indexOf(nm(x.kr)+' minor.')===0||/^\\s*\\S+ minor\\./.test(plain(q.explain)))tb('chain: the explanation opens with a minor key: '+plain(q.explain).slice(0,60));});if(!met)tb('no chain asked');
  const y=KM.find(x=>x.res&&!x.chain);if(y&&!/key of the moment is/.test(plain(kmWhy(y))))tb('a cadence that lands and stays keeps its explanation');}
 S.gid='fretboard';}
/* ============ ARPEGGIO RUNNER'S FULL NOTES (24 Nov 2026, brief .claude/arp-notes-brief.md) ============
   The text is a textbook on arpeggios that names, at the end of every chapter, the levels that practise it. Checked here: every “In the games” line names
   only levels that exist, by their real names; every neck diagram has its own title; Maj7 is never written maj7; a comparison row differs from its neighbour
   by one dot moved one fret on one string; the worked blues and tune use the chords of the stored forms and no others; the text does not talk about the game
   outside the “In the games” lines and the chapter of that name. (No backslash and no backtick in this block: it sits inside the sweep's template string.) */
{const ab=m=>{bad++;console.log('arp notes:',m);},N=LESSON_NOTES.arp,plain=h=>String(h==null?'':h).replace(/<svg[^]*?<[/]svg>/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/[ ]+/g,' ').trim();
 const itemTxt=it=>typeof it==='string'?it:Array.isArray(it)?it.join(' '):it.sub?it.sub:it.tip?[].concat(it.tip).join(' '):it.tbl?(it.tbl[0]||[]).join(' ')+' '+it.tbl[1].map(r=>r.join(' ')).join(' ')+' '+(it.cap||''):(it.cap||'');
 const isIG=it=>typeof it==='string'&&it.indexOf('<b>In the games</b>')===0,names=GAMES.map(x=>x.name).sort((a,b)=>b.length-a.length);
 /* a text with level references: a game's name, then one or more  n “name”  */
 const refs=(txt,where)=>{let n=0,cur=null,i=0;const t=plain(txt);while(i<t.length){const g=names.find(z=>t.startsWith(z,i));if(g){cur=GAMES.find(x=>x.name===g);i+=g.length;continue;}const m=t.slice(i).match(/^([0-9]+)(?:-OSJ)? “([^”]+)”/);if(m&&/-OSJ/.test(m[0])!==!!(cur&&(OSJ[cur.id]||[]).includes(+m[1])))ab(where+': the OSJ tag of '+(cur?cur.name:'?')+' '+m[1]+' is wrong');
    if(m){n++;if(!cur)ab(where+': a level with no game before it: '+m[0]);else{const L=cur.levels[+m[1]-1];if(!L)ab(where+': '+cur.name+' has no level '+m[1]);else if(plain(L.n)!==m[2])ab(where+': '+cur.name+' '+m[1]+' is “'+plain(L.n)+'”, the text says “'+m[2]+'”');}i+=m[0].length;continue;}
    if(t[i]==='“'&&/^[0-9]+ $/.test(t.slice(Math.max(0,i-4),i).replace(/^[^0-9]*/,'')))ab(where+': an unparsed level reference near '+t.slice(i-6,i+30));i++;}return n;};
 if(!N||N.length<18)ab('chapters: '+(N&&N.length));
 if(N&&(!Array.isArray(N.err)||N.err.length))ab('faults found while the text was built: '+(N.err||['no list']).join(' | '));
 else{let igs=0,necks=0,cmps=0,figs=0;const heads=N.map(c=>plain(c.h));
  if(heads[0]!=='What you need first')ab('the first chapter is “What you need first”');if(new Set(heads).size!==heads.length)ab('two chapters with one title');
  N.forEach((c,ci)=>{const h=heads[ci],last=c.p.at(-1),games=h==='In the games';
    if(!isIG(last))ab(h+': does not end with an “In the games” line');else{igs++;if(!refs(last,h))ab(h+': the “In the games” line names no level');}
    c.p.forEach((it,k)=>{const ig=isIG(it);if(ig&&k!==c.p.length-1)ab(h+': an “In the games” line that is not the last item');const t=plain(itemTxt(it));
      if(/maj7/.test(t))ab(h+': “maj7” written in lower case: '+(t.match(/.{0,20}maj7.{0,10}/)||[''])[0]);if(/—/.test(t))ab(h+': an em dash');
      if(!ig&&!games){const m=t.match(/the game asks|the microphone|[Ll]evels?[^a-z]|[Ll]evels?$/);if(m)ab(h+': the text talks about the game (“'+m[0]+'”): '+t.slice(0,80));if(/[0-9] “/.test(t)&&refs(t,h))ab(h+': a level is named outside the “In the games” line');}
      if(games&&it&&it.tbl)it.tbl[1].forEach(r=>{refs(r.join(' · '),h+' (table)');});
      if(it&&it.fig){figs++;NF.err.length=0;const html=String(it.fig());if(NF.err.length)ab(h+': figure error '+NF.err.join(' | '));if(/maj7/.test(html.replace(/aria-label="[^"]*"/g,'')))ab(h+': “maj7” in a figure');
        const sv=html.match(/<svg class="nfneck"[^]*?<[/]svg>/g)||[];necks+=sv.length;sv.forEach((z,j)=>{if(!/class="nn-title"[^>]*>[^<]+</.test(z))ab(h+': diagram '+(j+1)+' of a figure has no title');if(!/class="nn-root"/.test(z)&&!/along|3 5 7 9/.test(z))ab(h+': a diagram without a gold root');});
        if(/<svg class="nfbox"/.test(html))ab(h+': an untitled chord box');if(/in order:/.test(plain(it.cap)))ab(h+': a caption that makes the reader count (“in order:”)');
        if(it.cmp){cmps++;if(it.cmp.reduce((a,r)=>a+r.length,0)!==sv.length)ab(h+': a comparison figure draws '+sv.length+' diagrams for '+it.cmp.length+' rows of data');
          it.cmp.forEach(r=>{if(r.length<2)ab(h+': a comparison row of one');for(let j=1;j<r.length;j++){const A=r[j-1],B=r[j],key=d=>d.s+'/'+d.f,a=A.filter(d=>!B.some(e=>key(e)===key(d))),b=B.filter(d=>!A.some(e=>key(e)===key(d)));
            if(A.length!==B.length||a.length!==1||b.length!==1||a[0].s!==b[0].s||Math.abs(a[0].f-b[0].f)!==1)ab(h+': comparison row, diagrams '+j+' and '+(j+1)+' do not differ by one dot moved one fret on one string ('+a.map(key).join(' ')+' → '+b.map(key).join(' ')+')');}});}}});
    if(c.forms)c.forms.forEach(F=>{const f=FORMS.find(z=>z.n===F.name);if(!f){ab(h+': no stored form “'+F.name+'”');return;}if(F.syms.join('|')!==f.bars.slice(0,F.syms.length).join('|'))ab(h+': the chords are not those of “'+F.name+'”');
      const ok=new Set(F.syms),all=plain(c.p.filter(it=>!isIG(it)).map(itemTxt).join(' ')),found=all.match(/(?<![A-Za-z♭♯])[A-G][♭♯]?(?:Maj7|m7♭5|m7|7)(?![A-Za-z0-9♭♯(])/g)||[];if(found.length<F.syms.length)ab(h+': the chords of the form are not in the text');
      found.forEach(z=>{if(!ok.has(z))ab(h+': the chord '+z+' is not in “'+F.name+'”');});
      c.p.forEach(it=>{if(it&&it.fig){const up=(String(it.fig()).match(/class="ns-lab ns-up"[^>]*>[^<]+/g)||[]).map(z=>z.replace(/^[^>]*>/,''));up.forEach(z=>{if(!ok.has(z))ab(h+': the staff names '+z+', not a chord of “'+F.name+'”');});}});});});
  if(igs!==N.length)ab('“In the games” lines: '+igs+' for '+N.length+' chapters');if(necks<40)ab('neck diagrams: '+necks);if(cmps<6)ab('comparison figures: '+cmps);
  if(N.filter(c=>c.forms).length!==2)ab('the worked blues and the worked tune carry their form');
  /* the chapter “In the games”: all fifteen levels of Arpeggio Runner by their names, each with a chapter that exists */
  const G=N.find(c=>plain(c.h)==='In the games'),T1=G&&G.p.find(it=>it&&it.tbl),A=GAMES.find(x=>x.id==='arp');
  if(!T1||T1.tbl[1].length!==A.levels.length)ab('the table of the levels has '+(T1&&T1.tbl[1].length)+' rows for '+A.levels.length+' levels');
  else T1.tbl[1].forEach((r,i)=>{if(plain(r[0])!==lvNum('arp',i+1)||plain(r[1])!==plain(A.levels[i].n))ab('level table row '+(i+1)+': '+r[1]);plain(r[3]).split('; ').forEach(z=>{const m=z.match(/^([0-9]+) (.+)$/);if(!m||heads[+m[1]-1]!==m[2])ab('level table row '+(i+1)+': no chapter “'+z+'”');});});
  /* a pointer to another chapter (“…”) names a chapter that exists */
  N.forEach((c,ci)=>c.p.forEach(it=>{if(typeof it!=='string'||isIG(it))return;(plain(it).match(/“[^”]{12,}”/g)||[]).forEach(q=>{const t=q.slice(1,-1);if(/^[A-Z]/.test(t)&&/: | and |^The |^One |^A /.test(t)&&!heads.includes(t)&&!/^In the games$/.test(t)&&heads.some(z=>z.slice(0,10)===t.slice(0,10)))ab(heads[ci]+': a pointer to a chapter that does not exist: '+q);});}));}}
/*SPRSW_BEGIN*/
/* ============ OSJ: WHAT FRETWISE TAKES FROM A GUITAR WORKBOOK (24 Nov 2026) ============
   (No template literal and no backslash in this block: it sits inside the sweep's template string.) */
{const sp=m=>{bad++;console.log('OSJ',m);};
 /* the tag: OSJ names exactly the levels this build appended, and every one exists */
 const WANT={arp:[16,17,18,19],drop2:[19,20,21],triads:[15],scales:[23],modes:[13],sing:[17],tgrips:[11]};   /* Scale Runner's OSJ level is 23 since the reorder of 28 Nov 2026 */
 if(JSON.stringify(OSJ)!==JSON.stringify(WANT))sp('the OSJ table is '+JSON.stringify(OSJ)+', the build appended '+JSON.stringify(WANT));
 Object.entries(OSJ).forEach(([g,ns])=>ns.forEach(n=>{if(!GBY[g]||!GBY[g].levels[n-1])sp(g+' has no level '+n);if(lvNum(g,n)!==n+'-OSJ')sp('lvNum '+g+' '+n);}));
 if(lvNum('arp',15)!=='15'||lvNum('fretboard',3)!=='3')sp('lvNum tags an older level');
 GAMES.forEach(x=>x.levels.forEach(l=>{if(/OSJ/.test(l.n))sp('OSJ inside a level name: '+x.id+' '+l.n);}));
 /* the notes: the items this build added carry osj:true, and nothing else does */
 const WANTN=['analysis|Blues harmony, the line cliché and the pedal point|sub', 'analysis|Blues harmony, the line cliché and the pedal point|txt', 'analysis|Blues harmony, the line cliché and the pedal point|txt', 'analysis|Blues harmony, the line cliché and the pedal point|tbl', 'arp|Connecting across keys|chapter', 'arp|The enclosure, the chromatic figures, and the beat|tbl', 'arp|The enclosure, the chromatic figures, and the beat|txt', 'arp|One arpeggio over another chord|txt', 'chordscale|The dominant of a minor key|txt', 'chordscale|The dominant of a minor key|tbl', 'chordscale|Symmetric scales|txt', 'chordscale|Symmetric scales|tbl', 'chordscale|Pentatonics inside the modes|txt', 'chordscale|Pentatonics inside the modes|tbl', 'drop2|From one inversion to the next|chapter', 'drop2|II–V–I: the nearest grip|txt', 'drop2|II–V–I: the nearest grip|fig', 'drop2|The common tone on top|chapter', 'drop2|A key in drop-2|txt', 'drop2|A key in drop-2|tbl', 'drop2|A key in drop-2|fig', 'drop2|A key in drop-2|txt', 'modes|Symmetric scales and harmonic minor|txt', 'scales|Groups, thirds, fourths, triads, seventh chords|tbl', 'scales|Groups, thirds, fourths, triads, seventh chords|txt', 'sing|Sing it, then play it|txt', 'spelling|Look-alikes: one set of notes, two names|txt', 'spelling|Look-alikes: one set of notes, two names|tbl', 'spelling|Look-alikes: one set of notes, two names|tbl', 'tgrips|Altered dominants|txt', 'tgrips|Altered dominants|fig', 'tgrips|Altered dominants|txt', 'triads|The triads of a key|txt', 'triads|The triads of a key|fig', 'triads|The triads of a key|txt', 'triads|The triads of a key|txt', 'triads|The triads of a key|tbl'];
 const gotN=[];Object.entries(LESSON_NOTES).forEach(([g,N])=>{if(!Array.isArray(N))return;N.forEach(c=>{if(c.osj)gotN.push(g+'|'+c.h+'|chapter');(c.p||[]).forEach(it=>{if(it&&typeof it==='object'&&!Array.isArray(it)&&it.osj){const k=it.txt!=null?'txt':it.li?'li':it.sub?'sub':it.tip?'tip':it.tbl?'tbl':it.fig?'fig':'?';gotN.push(g+'|'+c.h+'|'+k);}});});});
 if(gotN.slice().sort().join(' ; ')!==WANTN.slice().sort().join(' ; '))sp('notes items tagged OSJ: '+gotN.join(' ; ')+'  expected: '+WANTN.join(' ; '));
 {const h=noteItem({txt:'a b',osj:true});if(h.indexOf('class="osj"')<0||noteText({txt:'a b',osj:true})!=='a b')sp('the OSJ tag is not drawn, or it is part of the text');}
 /* 1.1 Arpeggio Runner 16: connect across keys */
 const sg=(q,ln)=>soloGrade(q,{notes:ln.map((m,i)=>m==null?null:{midi:m,t:q.grid[i]*1000}).filter(Boolean),beat:1000,beatStart:0});
 {const L=GBY.arp.levels[15];if(!L||L.n!=='Connect across keys')sp('Arpeggio Runner 16 is not Connect across keys');
  ['xm7a','xm7b','xii','xm7a8','xm7b8','xii8'].forEach(id=>{const S0=CON[id];if(!S0||S0.holdOk!==false)sp('spec '+id+' missing or holdOk not false');});
  if(CON.xm7a.bars('C').map(([r,q])=>symD(r,q)).join(' ')!=='CMaj7 A♭Maj7 EMaj7 CMaj7')sp('xm7a in C');
  if(CON.xii.bars('C').map(([r,q])=>symD(r,q)).join(' ')!=='Dm7 G7 CMaj7 B♭m7 E♭7 A♭Maj7 F♯m7 B7 EMaj7')sp('xii in C: '+CON.xii.bars('C').map(([r,q])=>symD(r,q)).join(' '));
  for(const id of ['xm7a','xm7b','xii8','xm7b8'])for(const k of CON_MAJ)for(let t=0;t<(id.indexOf('xm7b')===0?12:2);t++){const q=connectQ(CON[id],{keys:[k]})();
    if(q.key!=='con-'+id+'-'+k){sp('key '+q.key+' for '+id+' '+k);break;}const chs=q.solo.chs,div=CON[id].div,ln=q.target;
    if(chs.some(c=>chord(c.r,c.q).some(n=>Math.abs(n.a)>1)))sp('a double accidental '+q.key);
    if(chs.some((c,i)=>i&&mod(pc(c.r)-pc(chs[i-1].r),12)===0&&c.q===chs[i-1].q))sp('two neighbouring chords alike '+q.key);
    if(id.indexOf('xm7b')===0){if(chs.some((c,i)=>i&&[3,4,8,9].indexOf(mod(pc(c.r)-pc(chs[i-1].r),12))<0))sp('xm7b: a root move that is not a 3rd '+q.key);if(osjInOneKey(chs.map(c=>[c.r,c.q])))sp('xm7b: all four chords in one key '+q.key);}
    if(Math.min.apply(null,ln)<48)sp('a note under C3 '+q.key);
    if(!sg(q,ln).ok){sp('the example fails '+q.key+' '+sg(q,ln).walkWhy.join('; '));break;}
    /* a jump to the new root at the change; a take of 48 notes or more lets floor(n/48) broken notes through (soloGrade), so the jump is made at that many changes and one more */
    {const w=ln.slice(),nj=Math.floor(ln.length/48)+1;let made=0;for(let b2=1;b2<chs.length&&made<nj;b2++){const i=4*div*b2,pv=w[i-1],C=chs[b2],near=nearTones(pv,C);let jr=null;for(let m=pv-12;m<=pv+12;m++)if(mod(m,12)===C.rp&&m!==pv&&near.indexOf(m)<0&&(jr===null||Math.abs(m-pv)<Math.abs(jr-pv)))jr=m;if(jr!==null&&jr!==w[i+1]){w[i]=jr;made++;}}
     const r=sg(q,w);if(made===nj&&(r.ok||!r.walkWhy.some(z=>z.indexOf('at the change go to the nearest note of')>=0)))sp('a jump to the new root passes or gives no nearest-note message '+q.key);}
    const i=4*div,pv=ln[i-1];
    {const w=ln.slice();w[i]=pv;if(sg(q,w).ok)sp('a note held over the change passes '+q.key);}}}
 const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;},strum=(q,seq,f)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{strums:seq.map((v,i)=>({t:bs+q.grid[i]*B+(f?f(i):0),act:act(v)})),beat:B,beatStart:bs,firstAt:bs});},
  line=(q,T,f)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{notes:T.map((m,i)=>({midi:m,mf:m,t:bs+q.grid[i]*B+(f?f(i):0),dur:300})),beat:B,beatStart:bs,firstAt:bs});},
  lateAll=q=>()=>60000/q.metro*0.6,ctOf=(r,q)=>chord(r,q).map(pc),same4=(v,r,q)=>v.length===4&&v.map(m=>mod(m,12)).sort((a,b)=>a-b).join()===ctOf(r,q).slice().sort((a,b)=>a-b).join();
 /* 1.2 Drop-2 19: the four grips of every chord and set: the chord's notes, one a string, rising inversions with a different chord tone in the bass, each a drop-2 grip */
 {const L=GBY.drop2.levels[18];if(!L||L.n!=='Four inversions up one set, in time')sp('Drop-2 19 name');
  for(const set of ALLS)for(const q of ['maj7','m7','7','m7♭5'])for(const rk of ['C','F','Bb','G','D','A']){const r=P(rk),p=d2InvPath(r,q,set);if(!p)continue;const ct=ctOf(r,q);
   p.forEach((a,i)=>{const v=tabMidi(a);if(!same4(v,r,q)||a.filter(f=>f!==null).length!==4)sp('d2inv: not the chord, one note a string '+rk+q+' '+set+' '+tabStr(a));if(!osjD2(r,q,set).some(g=>g.a.join()===a.join()))sp('d2inv: not a drop-2 grip '+tabStr(a));
     if(i&&!(Math.min(...a.filter(f=>f!==null))>Math.min(...p[i-1].filter(f=>f!==null))))sp('d2inv: not rising '+rk+q+' '+set);});
   if(new Set(p.map(a=>osjBassIx(a,r,q))).size!==4)sp('d2inv: two grips with one bass '+rk+q+set);if(Math.min(...p[0].filter(f=>f!==null))<1||Math.max(...p.flatMap(a=>a.filter(f=>f!==null)))>15)sp('d2inv: frets '+rk+q+set);}
  L.g.forEach((gen,gi)=>{for(let t=0;t<40;t++){const q=gen();if(!/^d2inv-/.test(q.key)){sp('d2inv fell back '+q.key);break;}const sq=q.strumSeq;
   if(sq.length!==7||q.grid.join()!=='0,2,4,6,8,10,12'||q.metro>60||q.strumAltSeq){sp('d2inv: seven exact strums two beats apart at 60 or slower '+q.key);break;}
   if([1,2,3].some(i=>Math.min.apply(null,sq[i])<=Math.min.apply(null,sq[i-1]))||[4,5,6].some(i=>sq[i].join()!==sq[6-i].join())){sp('d2inv: not up the four grips and back the same way '+q.key);break;}
   if(!strum(q,sq).ok){sp('d2inv: perfect take fails '+q.key);break;}if(strum(q,sq,lateAll(q)).ok){sp('d2inv: half a beat late passes '+q.key);break;}
   const x=sq.slice();x[1]=sq[2];if(strum(q,x).ok){sp('d2inv: the wrong inversion passes '+q.key);break;}const w=sq.map(v=>v.slice());w[2][3]+=1;if(strum(q,w).ok){sp('d2inv: a grip one note off passes '+q.key);break;}}});}
 /* 1.3 Drop-2 20: the shared pitch stays on top */
 {const L=GBY.drop2.levels[19];if(!L||L.n!=='Common tone on top')sp('Drop-2 20 name');
  for(let t=0;t<120;t++){const q=L.g[0]();if(!/^d2ct-/.test(q.key)){sp('d2ct fell back '+q.key);break;}const sq=q.strumSeq,T=Math.max(...sq[0]);
   if(sq.length!==4||q.metro>66||q.grid.join()!=='0,4,8,12'){sp('d2ct: four strums a bar apart '+q.key);break;}
   if(sq.some(v=>Math.max(...v)!==T)||q.strumAltSeq.some(al=>al.some(v=>Math.max(...v)!==T))){sp('d2ct: a grip without the shared pitch on top '+q.key);break;}
   const syms=q.names;if(!strum(q,sq).ok){sp('d2ct: perfect take fails '+q.key);break;}
   const x=sq.slice();x[2]=sq[1].map(m=>m+12);if(strum(q,x).ok){sp('d2ct: a wrong chord passes '+q.key);break;}
   if(strum(q,sq,lateAll(q)).ok){sp('d2ct: late passes '+q.key);break;}}
  /* a grip of the right chord with another note on top fails */
  {let tested=0;for(let t=0;t<200&&tested<20;t++){const q=L.g[0](),sq=q.strumSeq,T=Math.max(...sq[1]),m=q.names[1].match(/^([A-G][♭♯]?)(.*)$/),r=P(m[1]),qq=m[2]==='Maj7'?'maj7':'m7';const other=ALLS.flatMap(s=>osjD2(r,qq,s)).map(g=>tabMidi(g.a)).find(v=>Math.max(...v)!==T&&Math.abs(Math.max(...v)-T)<=7);if(!other)continue;tested++;const x=sq.slice();x[1]=other;if(strum(q,x).ok){sp('d2ct: another top note passes '+q.key);break;}}if(!tested)sp('d2ct: no other-top test ran');}}
 /* 1.4 Arpeggio Runner 17: exactly the chord's notes; maj7♯5 in CH */
 {const L=GBY.arp.levels[16];if(!L||L.n!=='More four-note arpeggios')sp('Arpeggio Runner 17 name');if(chord(P('C'),'maj7♯5').map(nm).join(' ')!=='C E G♯ B'||QNAME['maj7♯5'])sp('maj7♯5 in CH, its name in QNAME_X only');
  L.g.forEach((gen,gi)=>{const seen=new Set();for(let t=0;t<40;t++){const q=gen();if(!/^arw-/.test(q.key)){sp('arp17 fell back '+q.key);break;}const m=q.key.match(/^arw-([A-G][♭♯]?)(.*)-([0-9]+)-([12])$/),qq=Object.keys(BN_Q).find(z=>BN_Q[z]===m[2]);seen.add(qq);
   if(!OSJ_Q4.includes(qq)){sp('arp17: quality '+m[2]);break;}const ct=ctOf(P(m[1]),qq),T=q.target;if(T.some(x=>!ct.includes(mod(x,12)))||ct.some(c=>!T.some(x=>mod(x,12)===c))){sp('arp17: not exactly the chord '+q.key);break;}
   const p0=+m[3];if(T.some((x,i)=>!q.degs[i])){sp('arp17: a note without its degree '+q.key);break;}
   if(!line(q,T).ok){sp('arp17: perfect take fails '+q.key);break;}const w=T.slice(),j=Math.floor(T.length/2);w[j]=T[j]+1;if(T.includes(w[j]))w[j]=T[j]-1;if(line(q,w).ok){sp('arp17: a wrong note passes '+q.key);break;}}
   if(seen.size<(gi===3?5:2))sp('arp17 generator '+gi+' asks '+[...seen].join(','));});}
 /* 1.5 Arpeggio Runner 18: the degrees claimed; the lower chord's own arpeggio fails */
 {const L=GBY.arp.levels[17];if(!L||L.n!=='One arpeggio over another chord')sp('Arpeggio Runner 18 name');const WANTD={m7of3:'3 5 7 9',maj7ofb3:'♭3 5 ♭7 9',hdof3:'3 5 ♭7 9',dimof3:'3 5 ♭7 ♭9',m7of5:'5 ♭7 9 11',maj7of5:'5 7 9 ♯11'};
  for(const row of ARPOV)for(const k of CON_MAJ){const x=arpOvMake(row,k);if(!x){sp('arpov: no line for '+row.id+' '+k);continue;}if(x.labs.slice(0,4).join(' ')!==WANTD[row.id])sp('arpov '+row.id+' '+k+': '+x.labs.slice(0,4).join(' '));if(Math.min(...x.mids)<48)sp('arpov under C3 '+row.id+k);}
  L.g.forEach(gen=>{for(let t=0;t<30;t++){const q=gen();if(!/^arpov-/.test(q.key)){sp('arpov fell back '+q.key);break;}const T=q.target;if(!line(q,T).ok){sp('arpov perfect fails '+q.key);break;}
   const k=q.key.split('-')[2],row=ARPOV.find(r=>r.id===q.key.split('-')[1]),lr=P(k),sem=CH[row.over].map(z=>IV[z][1]),base=T[0]-mod(T[0]-pc(lr),12),own=sem.map(z=>base+z).concat([base+12]),ownL=own.concat(own.slice(0,-1).reverse());if(line(q,ownL).ok){sp('arpov: the lower chord played instead passes '+q.key);break;}
   const w=T.slice();w[3]+=1;if(line(q,w).ok){sp('arpov: a wrong note passes '+q.key);break;}}});}
 /* 1.6 Triad Shapes 15: the triads of the key, one inversion, every voice one scale step */
 {const L=GBY.triads.levels[14];if(!L||L.n!=='The triads of a key up one string set')sp('Triad Shapes 15 name');
  [['C','3-2-1']].concat(['C','F','G'].flatMap(k=>TSK_SETS.map(s=>[k,s]))).forEach(([k,s])=>{if(['C','F','G'].includes(k)&&s==='4-3-2'&&k==='C'){}if(!tskFits(k,s).length&&!(k!=='C'||s!=='3-2-1')&&true)sp('tsk: C on 3-2-1 has no fitting inversion');});
  if(!tskFits('C','3-2-1').length||!['C','F','G'].some(k=>TSK_SETS.every(s=>tskFits(k,s).length)))sp('tsk: the named keys and sets do not fit');
  if(tskFits('C','3-2-1').join()!=='0')sp('tsk: C on 3-2-1 should fit in root position only: '+tskFits('C','3-2-1'));
  TSK_ANY.forEach(([k,s])=>{const root=P(k),sc=scale(root,'major');tskFits(k,s).forEach(inv=>{const p=tskPath(k,s,inv);p.forEach((a,i)=>{const v=tabMidi(a),d=i%7,ct=chord(sc[d],TSK_Q[d]).map(pc);
     if(v.length!==3||v.map(m=>mod(m,12)).sort((x,y)=>x-y).join()!==ct.slice().sort((x,y)=>x-y).join())sp('tsk: not the triad of the key '+k+s+i);if(ct.indexOf(mod(v[0],12))!==inv)sp('tsk: not the claimed inversion '+k+s+i);if(v[2]-v[0]>=12)sp('tsk: not close '+k+s+i);
     if(i){const pv=tabMidi(p[i-1]);v.forEach((m,j)=>{const scs=sc.map(pc),a0=scs.indexOf(mod(pv[j],12)),a1=scs.indexOf(mod(m,12));if(mod(a1-a0,7)!==1||m-pv[j]<1||m-pv[j]>2)sp('tsk: a voice did not move one scale step '+k+s+i);});}});
     if(p.some(a=>a.some(f=>f!==null&&(f<1||f>17))))sp('tsk: frets '+k+s);});});
  L.g.forEach(gen=>{for(let t=0;t<30;t++){const q=gen();if(!/^tsk-/.test(q.key)){sp('tsk fell back '+q.key);break;}const sq=q.strumSeq;if(sq.length!==8||q.grid.join()!=='0,2,4,6,8,10,12,14'||q.metro>60||q.strumAltSeq){sp('tsk: eight exact strums '+q.key);break;}
   if(!strum(q,sq).ok){sp('tsk: perfect fails '+q.key);break;}if(strum(q,sq,lateAll(q)).ok){sp('tsk: late passes '+q.key);break;}
   const sk=sq.slice(0,3).concat(sq.slice(4));if(strum(q,sk).ok){sp('tsk: a triad skipped passes '+q.key);break;}const x=sq.slice();x[3]=[sq[3][1],sq[3][2],sq[3][0]+12];if(strum(q,x).ok){sp('tsk: a wrong inversion passes '+q.key);break;}}});}
 /* 2.1 Scale Runner 19: the older pattern kinds give exactly what they gave before (span = the last step), the new kinds their steps */
 {const oldPat=(n,kind,dir,from,groups)=>{const st=SC_ST[kind],span=st.at(-1),G=Math.min(groups||SC_GDEF[kind],n-from-span),out=[];for(let g=0;g<G;g++){if(dir==='down'){const top=n-1-g;out.push(...st.map(x=>top-x));}else{const grp=st.map(x=>from+g+x);out.push(...(dir==='alt'&&g%2?grp.reverse():grp));}}return out;};
  for(const k of ['3','tri','7','g3','g4','4'])for(let n=8;n<=30;n++)for(const d of ['up','down','alt'])for(const f of [0,1,2])for(const gr of [undefined,n])if(scPattern(n,k,d,f,gr).join()!==oldPat(n,k,d,f,gr).join())sp('scPattern changed for the older kind '+k+' n='+n+' '+d);
  const L=GBY.scales.levels.find(l=>l.n==='Triad shapes and cells');if(!L)sp('Scale Runner: Triad shapes and cells');
  SC_OSJ.forEach(k=>{const p=scPattern(20,k,'up',0,20),st=SC_ST[k];for(let g=0;g*st.length<p.length;g++)if(p.slice(g*st.length,(g+1)*st.length).join()!==st.map(x=>g+x).join())sp('scPattern '+k+' group '+g);if(Math.max.apply(null,p)>19)sp('scPattern '+k+' runs past the position');});
  S.gid='scales';const gs=G('scales');gs.opts=gs.opts||{};const hn=gs.opts.hideNeck;
  L.g.forEach((gen,gi)=>{for(let t=0;t<25;t++){gs.opts.hideNeck=t%2===1;const q=gen();if(!/^sc-/.test(q.key)||!SC_OSJ.concat(SC_ORD3).some(k=>q.key.indexOf('-'+k+'-')>0)){sp('scales19 fell back '+q.key);break;}
   const k=SC_OSJ.find(z=>q.key.indexOf('-'+z+'-')>0),st=SC_ST[k],key=/-1A-|-1B-|-1C-|-1D-|-4A-|-4B-|-4C-|-4D-|-[1-4]-/.test(q.key),T=q.target;
   if(t%2===1&&(!/scstart/.test(q.visual)||typeof q.after!=='function'))sp('scales19: hide the diagram does not work '+q.key);
   if(!line(q,T).ok){sp('scales19: perfect take fails '+q.key);break;}const w=T.slice(),j=Math.floor(T.length/2);w[j]=T[j]+1;if(T[j+1]===w[j]||T[j-1]===w[j])w[j]=T[j]-1;if(line(q,w).ok){sp('scales19: a wrong note passes '+q.key);break;}}});gs.opts.hideNeck=hn;}
 /* 2.2 the surround on the root and the 5th: +1, -2, -1, the tone; the older figures unchanged */
 {const L=GBY.arp.levels[10],gens=L.g.slice(-2);if(L.g.length!==6)sp('Arpeggio Runner 11 should have its four generators and two new ones');
  const C=encTone(P('C'),'maj',1);if(encFig(60,C,'plain').map(e=>e.n).join(' ')!=='D C B C'||encFig(60,C,'above').map(e=>e.n).join(' ')!=='D D♭ B C'||encFig(60,C,'sur').map(e=>e.n).join(' ')!=='D♭ B♭ B C')sp('encFig on C: '+encFig(60,C,'sur').map(e=>e.n).join(' '));
  {const B=encTone(P('Bb'),'maj',1),F5=encTone(P('Bb'),'maj',5);if(encFig(58,B,'sur').map(e=>e.n).join(' ')!=='C♭ A♭ A B♭'||encFig(65,F5,'sur').map(e=>e.n).join(' ')!=='G♭ E♭ E F')sp('the surround on B♭ and on F');}
  gens.forEach((gen,gi)=>{for(let t=0;t<40;t++){const q=gen();if(!/^enc-chr-sur-/.test(q.key)){sp('surround fell back '+q.key);break;}if(gi===1&&!/-d$/.test(q.key)){sp('displaced key '+q.key);break;}if(!/[(]OSJ[)]<[/]div>$/.test(q.prompt)){sp('the surround prompt has no OSJ tag '+q.key);break;}
   const T=q.target;[0,2,3].forEach(g=>{const f=T.slice(g*4,g*4+4);if(f[0]-f[3]!==1||f[3]-f[1]!==2||f[3]-f[2]!==1)sp('surround distances '+q.key+' '+f.join(','));});
   if(!line(q,T).ok){sp('surround perfect fails '+q.key);break;}const w=T.slice();w[5]+=6;if(line(q,w).ok){sp('surround wrong note passes '+q.key);break;}}});}
 /* 2.3 Arpeggio Runner 19 */
 {const L=GBY.arp.levels[18];if(!L||L.n!=='Ninth arpeggios')sp('Arpeggio Runner 19 name');
  L.g.forEach((gen,gi)=>{for(let t=0;t<30;t++){const q=gen();const m=q.key.match(/^arw-([A-G][♭♯]?)(.*)-([0-9]+)-([12])$/),qq=m&&Object.keys(BN_Q).find(z=>BN_Q[z]===m[2]);if(!m||!OSJ_Q9.includes(qq)){sp('arp19 '+q.key);break;}
   if(gi<2&&!['C','F','G'].includes(m[1])){sp('arp19 key '+q.key);break;}const ct=ctOf(P(m[1]),qq),T=q.target;if(T.some(x=>!ct.includes(mod(x,12)))||ct.some(c=>!T.some(x=>mod(x,12)===c))){sp('arp19 not exactly the chord '+q.key);break;}
   if(!line(q,T).ok){sp('arp19 perfect fails '+q.key);break;}const w=T.slice(),j=3;w[j]=T[j]+1;if(T.includes(w[j]))w[j]=T[j]-1;if(line(q,w).ok){sp('arp19 wrong passes '+q.key);break;}}});}
 /* 2.4 Modes 13 */
 {const L=GBY.modes.levels[12];if(!L||L.n!=='Inside the half-whole scale')sp('Modes 13 name');const hw=MD['half-whole'].s;
  L.g.forEach((gen,gi)=>{for(let t=0;t<30;t++){const q=gen();if(!/^mdhw-/.test(q.key)){sp('modes13 fell back '+q.key);break;}const k=q.key.split('-')[2],kp=pc(P(k)),vp=mod(kp+7,12),T=q.target;
   if(/^mdhw-tri/.test(q.key)){if(T.length!==12||T.some(m=>!hw.includes(mod(m-vp,12))))sp('modes13 triads outside the scale '+q.key);const rts=[0,3,6,9].map(i=>T[i]);if(rts.some((r,i)=>i&&mod(r-rts[i-1],12)!==3)||mod(rts[0]-vp,12)!==0)sp('modes13 roots not a minor 3rd apart '+q.key);[0,3,6,9].forEach(i=>{if(T[i+1]-T[i]!==4||T[i+2]-T[i]!==7)sp('modes13 not a major triad 1 3 5 '+q.key);});}
   else{const minor=/-m$/.test(q.key),I=(minor?[0,3,7]:[0,4,7]).map(x=>mod(kp+x,12));if(T.slice(0,5).some(m=>!hw.includes(mod(m-vp,12)))||mod(T[0]-vp,12)!==4)sp('modes13 dim not from the 3rd, or outside the scale '+q.key);if(q.grid.at(-1)!==4||!I.includes(mod(T.at(-1),12)))sp('modes13 the landing is not a chord tone of I on beat 1 '+q.key);}
   if(!line(q,T).ok){sp('modes13 perfect fails '+q.key);break;}const w=T.slice();w[2]+=1;if(line(q,w).ok){sp('modes13 wrong passes '+q.key);break;}}});}
 /* 2.5 Sing It 17: the two-part take */
 {const L=GBY.sing.levels[16];if(!L||L.n!=='Sing it, then play it: an arpeggio or a scale')sp('Sing It 17 name');const N=(ms,t0)=>ms.map((m,j)=>({midi:m,mf:m,t:(t0||500)+j*900,dur:700}));
  L.g.forEach((gen,gi)=>{for(let t=0;t<30;t++){const q=gen();if(!(gi?/^sps-/:/^spa-/).test(q.key)||!q.parts||!q.parts.share){sp('sing17 '+q.key);break;}const n=q.parts.n,ph=q.target.slice(0,n);if(Math.min(...ph)<SPA_LO||Math.max(...ph)>SPA_HI)sp('sing17 out of the voice range '+q.key);
   const two=(a,b)=>micGrade(q,{notes:N(a).concat(N(b,3000+a.length*900+2500)),firstAt:500});
   if(!two(ph,ph).ok){sp('sing17 the perfect take (one pitch at the join) fails '+q.key);break;}if(!two(ph,ph.map(m=>m-12)).ok&&!two(ph,ph.map(m=>m+12)).ok){sp('sing17 the played part an octave away fails '+q.key);break;}
   const ws=ph.slice();ws[2]+=1;if(two(ws,ph).ok){sp('sing17 a wrong sung note passes '+q.key);break;}const wp=ph.slice();wp[2]+=1;if(two(ph,wp).ok){sp('sing17 a wrong played note passes '+q.key);break;}}});
  /* the share flag is off everywhere else */
  for(let t=0;t<20;t++){const q=GBY.sing.levels[13].g[0]();if(q.parts&&q.parts.share)sp('share set on Sing It 14');}}
 /* 2.6 Drop-2 21 */
 {const L=GBY.drop2.levels[20];if(!L||L.n!=='Chord scales in minor')sp('Drop-2 21 name');const WQ={hm:'m(maj7) m7♭5 maj7♯5 m7 7 maj7 dim7',mm:'m(maj7) m7 maj7♯5 7 7 m7♭5 m7♭5'};
  for(const sid of ['hm','mm'])for(const k of ['C','A','D','G','E'])if(d2csChords(k,sid).map(c=>c.q).join(' ')!==WQ[sid])sp('d2cs chords '+sid+' '+k);
  L.g.forEach(gen=>{for(let t=0;t<25;t++){const q=gen();if(!/^d2cs-/.test(q.key)){sp('d2cs fell back '+q.key);break;}const [,sid,set,k]=q.key.split('-').length===4?q.key.split('-'):[0,0,0,0],sq=q.strumSeq,chs=d2csChords(k,sid),sc=D2CS_SC[sid].map(x=>mod(pc(P(k))+x,12));
   if(sq.length!==8||q.grid.join()!=='0,2,4,6,8,10,12,14'||q.strumAltSeq||q.metro>60){sp('d2cs eight exact strums '+q.key);break;}
   sq.forEach((v,i)=>{const c=chs[i%7];if(!same4(v,c.r,c.q))sp('d2cs not the chord of the degree '+q.key+' '+i);if(i){const pv=sq[i-1];v.forEach((m,j)=>{const a=sc.indexOf(mod(pv[j],12)),b=sc.indexOf(mod(m,12));if(mod(b-a,7)!==1)sp('d2cs a voice did not move one scale step '+q.key);});}});
   if(!strum(q,sq).ok){sp('d2cs perfect fails '+q.key);break;}const x=sq.slice();x[3]=sq[3].map(m=>m+1);if(strum(q,x).ok){sp('d2cs a wrong chord passes '+q.key);break;}}});}
 /* 2.7 Tension Grips 11 */
 {const L=GBY.tgrips.levels[10];if(!L||L.n!=='One grip, four places')sp('Tension Grips 11 name');
  L.g.forEach(gen=>{for(let t=0;t<25;t++){const q=gen();if(!/^tg4-/.test(q.key)){sp('tg4 fell back '+q.key);break;}const rk=q.key.split('-')[1],r=P(rk),want=[4,7,10,1].map(x=>mod(pc(r)+x,12)).sort((a,b)=>a-b).join(),sq=q.strumSeq;
   if(sq.length!==7||q.strumAltSeq||[4,5,6].some(i=>sq[i].join()!==sq[6-i].join())){sp('tg4 seven exact strums up and back '+q.key);break;}
   sq.slice(0,4).forEach((v,i)=>{if(v.length!==4||v.map(m=>mod(m,12)).sort((a,b)=>a-b).join()!==want)sp('tg4 not 3 5 b7 b9 '+q.key);if(i&&v.some((m,j)=>m-sq[i-1][j]!==3))sp('tg4 places not three frets apart '+q.key);});
   if(!strum(q,sq).ok){sp('tg4 perfect fails '+q.key);break;}const x=sq.slice();x[1]=sq[1].map(m=>m+1);if(strum(q,x).ok){sp('tg4 a grip one fret off passes '+q.key);break;}if(strum(q,sq,lateAll(q)).ok){sp('tg4 late passes '+q.key);break;}}});}
/*OSJSW_MORE*/
 console.log('OSJ checked');}
/*SPRSW_END*/
/*RDSW_BEGIN*/
/* RHYTHM DICTATION (25 Nov 2026): the sixteen levels, their vocabularies and meters, every bar writable with the writer's values, the grading, distinct items,
   the move tables, and the move itself on a made-up store */
{const sb=m=>{bad++;console.log('RHYDICT',m);};const D=GBY.rhydict,RT=GBY.rhytheory;
 if(!D||D.levels.length!==16)sb('sixteen levels');if(!RT||RT.levels.length!==8||RT.name!=='Rhythm Theory')sb('Rhythm Theory keeps eight levels');
 if(RT&&RT.levels.some(l=>/ictation/.test(l.n)))sb('a dictation level left in Rhythm Theory');
 const NAMES=['Whole, half, quarter','Eighth notes','Eighth rests and off-beats','Ties and dots','3/4','Syncopation I','Syncopation II: ties into the beat','Eighth-note triplets','Quarter-note triplets','Sixteenths','Dotted eighth and sixteenth','Sixteenth rests','6/8','Swing','Two bars','Two bars: everything'];
 NAMES.forEach((n,i)=>{if(D.levels[i].n!==n)sb('level '+(i+1)+' named '+D.levels[i].n);});
 if(GAMES.findIndex(x=>x.id==='rhydict')!==GAMES.findIndex(x=>x.id==='rhytheory')+1)sb('placed right after Rhythm Theory');
 if(D.tap||D.mic||PLAY_GAMES.includes('rhydict')||COURSE.rhydict!==201||BADGE.rhydict[0]!=='life'||BADGE.rhydict[1]!=='core'||!STD.rhydict||STD.rhydict.acc!==0.9||STD.rhydict.flu||STYLE.rhydict||!SHORTN.rhydict)sb('registries');
 /* the writer, as rwAdd works */
 const sim=(q,keys)=>{const W={ev:[],dot:false,rest:false,tie:false,trip:0,tsum:0},cap=q.bars*q.meter,wu=q.wu||1;for(const k of keys){if(k==='.'){W.dot=true;continue;}if(k==='r'){W.rest=true;continue;}if(k==='_'){W.tie=true;continue;}if(k==='t'){W.trip=1;W.tsum=0;continue;}
   let d=RW_VAL[k]*(W.dot?1.5:1)*wu;if(W.trip)d=d*2/3;const t=W.ev.reduce((a,e)=>a+e.d,0);if(t+d>cap+1e-6)return null;const last=W.ev[W.ev.length-1];
   if(W.tie&&last&&!last.rest&&!last.tup&&!W.trip)last.d+=d;else W.ev.push({t,d,rest:W.rest?1:undefined,tup:W.trip||undefined});if(W.trip){W.tsum+=d;if(Math.abs(W.tsum-Math.round(W.tsum))<1e-6){W.trip=0;W.tsum=0;}}W.dot=false;W.rest=false;W.tie=false;}return W.ev;};
 const VK=['w','h','q','e','s'],plain=v=>VK.find(k=>Math.abs(RW_VAL[k]-v)<1e-6),dotted=v=>VK.find(k=>Math.abs(RW_VAL[k]*1.5-v)<1e-6);
 /* keys that write the answer; tieDots: every dotted value as the value and a tie (q. = q _ e) */
 const keysOf=(q,tieDots)=>{const out=[],wu=q.wu||1,ev=q.answer.slice().sort((a,b)=>a.t-b.t);let inTrip=0;
   for(const e of ev){const pre=e.rest?['r']:[];if(e.tup){if(inTrip!==e.tup){out.push('t');inTrip=e.tup;}const k=plain(e.d/wu*1.5);if(!k)return null;out.push(...pre,k);continue;}inTrip=0;const v=e.d/wu;
     if(plain(v)){out.push(...pre,plain(v));continue;}if(dotted(v)&&!(tieDots&&!e.rest)){out.push(...pre,'.',dotted(v));continue;}
     let r=v,first=true;while(r>1e-6){const k=VK.find(k=>RW_VAL[k]<=r+1e-6);if(!k)return null;out.push(...(e.rest?['r']:first?[]:['_']),k);r-=RW_VAL[k];first=false;}}return out;};
 const MET={5:[3],13:[6],16:[3,4,6]};
 for(let L=1;L<=16;L++){const keys=new Set(),allowed=new Set(RD_V[L].concat(['q']));let n=0,dots=0;
   D.levels[L-1].g.forEach((gen,gi)=>{for(let i=0;i<Math.ceil(300/D.levels[L-1].g.length);i++){const q=gen();n++;keys.add(q.key);
     const M=q.meter,ms=MET[L]||[4];if(!ms.includes(M))sb(L+': meter '+M);if(q.swing&&L!==14&&L!==16)sb(L+': swing');if(L===14&&!q.swing)sb('14 not swung');if((L>=15)!==(q.bars===2))sb(L+': bars '+q.bars);
     if(M===6?q.rdCells.some(c=>!RD68[c]):q.rdCells.some(c=>!allowed.has(c)))sb(L+': a cell outside the level '+q.rdCells.join(' '));
     if(M===6&&(q.wu!==2||q.rdBpm>60||q.key.indexOf('rd-6-')!==0))sb(L+': 6/8 unit, tempo or key');if([10,11,12].includes(L)&&q.rdBpm>80)sb(L+': sixteenths over 80');
     /* the bar fills its meter, no gap, no overlap, nothing across a bar line */
     const ev=q.answer.slice().sort((a,b)=>a.t-b.t);let t=0;ev.forEach(e=>{if(Math.abs(e.t-t)>1e-6)sb(L+': gap or overlap '+q.key);const b0=Math.floor(e.t/M+1e-9);if(e.t+e.d>(b0+1)*M+1e-6)sb(L+': across the bar line '+q.key);t=e.t+e.d;});
     if(Math.abs(t-q.bars*M)>1e-6)sb(L+': bar not full '+q.key);if(!ev.some(e=>!e.rest))sb(L+': no note');
     /* writable: the writer's keys give back a bar the grader marks right; the same with ties for the dots; a whole-note bar and two values swapped fail */
     const k1=keysOf(q,false),w1=k1&&sim(q,k1);if(!w1||!check(q,w1))sb(L+': not writable '+q.key+' '+(k1||[]).join(''));
     const k2=keysOf(q,true),w2=k2&&sim(q,k2);if(!w2||!check(q,w2))sb(L+': tied spelling fails '+q.key);if(k2&&k1&&k2.join()!==k1.join())dots++;
     if(!(ev.length===1&&!ev[0].rest)&&check(q,[{t:0,d:q.bars*M}]))sb(L+': a whole-bar note passes '+q.key);
     const j=ev.findIndex((e,i)=>i<ev.length-1&&!e.rest&&!ev[i+1].rest&&!e.tup&&!ev[i+1].tup&&Math.abs(e.d-ev[i+1].d)>1e-6);
     if(j>=0){const sw=ev.map(e=>({...e}));const a=sw[j].d;sw[j].d=sw[j+1].d;sw[j+1].d=a;sw[j+1].t=sw[j].t+sw[j].d;if(check(q,sw))sb(L+': two values swapped pass '+q.key);}
     if(/undefined|NaN/.test(q.prompt+q.explain+q.answerText+q.label))sb(L+': text '+q.key);
     /* a half rest only on beat 1 or 3 of 4/4; one bar of clicks before the first note can sound */
     if(M===4&&ev.some(e=>e.rest&&e.d>=2&&Math.abs(e.t%2)>1e-6))sb(L+': a half rest off beats 1 and 3 '+q.key);
     if(i===0){const tk=[],nt=[],o1=Piano.tick,o2=Piano.note;Piano.tick=t=>tk.push(t);Piano.note=(m,t)=>nt.push(t);q.audio();Piano.tick=o1;Piano.note=o2;const cin=M===6?2:M;
       if(tk.length!==cin+(M===6?2:M)*q.bars||Math.min(...nt)<tk.slice().sort((x,y)=>x-y)[cin]-1e-6)sb(L+': no bar of clicks before the bar '+q.key);}}});
   if(keys.size<12)sb(L+': only '+keys.size+' distinct bars in '+n);if([4,5,13].includes(L)&&!dots)sb(L+': no dotted value to spell with a tie');}
 /* the move tables: old levels 1 to 12 exactly once; Rhythm Theory 1 to 8 in order; the moved levels on distinct new levels */
 const ks=Object.keys(RD_KEEP).concat(Object.keys(RD_MOVE)).map(Number).sort((a,b)=>a-b);if(ks.join()!==[1,2,3,4,5,6,7,8,9,10,11,12].join())sb('RD_KEEP and RD_MOVE cover old 1 to 12 once');
 if(Object.values(RD_KEEP).join()!=='1,2,3,4,5,6,7,8')sb('RD_KEEP');if(Object.values(RD_MOVE).join()!=='4,8,14,10')sb('RD_MOVE');
 /* goals: every Rhythm Theory step inside 1 to 8, every Rhythm Dictation step inside 1 to 16 */
 GOAL_KEYS.forEach(k=>GOALS[k].stages.forEach(st=>st.steps.concat(GOALS[k].more||[]).forEach(z=>{if(z[0]==='rhytheory'&&z[2]>8)sb('goal '+k+' rhytheory '+z[1]+'-'+z[2]);if(z[0]==='rhydict'&&z[2]>16)sb('goal '+k+' rhydict');})));
 /* the move on a made-up store: frontier old 7, old 4 and 6 passed, old 9 open; every answer lands in exactly one game */
 {const save=STORE.games;STORE.games={};const g=blank();const it=(L,n,c)=>({n,c,w:n-c,h:0,ms:n*1000,lv:L,l:'x'});for(let L=1;L<=12;L++){g.items['k'+L]=it(L,10,8);g.n+=10;g.c+=8;g.ms+=10000;g.hist[L]=Array(5).fill(1);}
  g.lvl=7;g.last=6;g.unl=[9];g.lc={4:{s:5,g:0},6:{s:3,g:0},7:{s:2,g:0}};g.sessions=[{t:1,L:6,n:5,c:5,ms:1000,dur:60000},{t:2,L:7,n:5,c:5,ms:1000,dur:30000}];g.time=90000;g.pl=[{t:3,lv:6,k:'k6',ok:1},{t:4,lv:3,k:'k3',ok:1}];g.mig={};
  moveDictation(g);const T=STORE.games.rhydict;
  if(g.n+T.n!==120||g.c+T.c!==96||g.ms+T.ms!==120000||g.time+T.time!==90000)sb('the made-up move: totals');
  if(Object.keys(g.items).length!==8||Object.keys(T.items).length!==4||T.items.k6.lv!==8||T.items.k9.lv!==10||g.items.k12.lv!==8||g.items.k5.lv!==4)sb('the made-up move: items');
  if(g.lvl!==5||T.lvl!==9||T.skip.join()!=='1,2,3,5,6,7'||T.unl.join()!=='10'||g.last!==5)sb('the made-up move: frontiers '+g.lvl+' '+T.lvl+' '+T.skip+' '+T.unl+' '+g.last);
  if(T.lc[8].s!==3||T.lc[4].s!==5||g.lc[5].s!==2||T.sessions.length!==1||T.sessions[0].L!==8||g.sessions[0].L!==5||T.pl.length!==1||T.pl[0].lv!==8)sb('the made-up move: records');
  if(!g.mig.rd1||!T.mig.rd1||!T.mig.rv1)sb('the made-up move: flags');
  const n0=JSON.stringify([g,T]);moveDictation(g);if(JSON.stringify([g,STORE.games.rhydict])!==n0)sb('the made-up move: a second run changes something');
  STORE.games=save;}
 console.log('rhydict checked');}
/*RDSW_END*/
/*GMSW_BEGIN*/
/* tap matching in the continuous games (26 Nov 2026): one missed note in a run of sixteenths at 60 does not shift the taps after it onto the notes before them */
{const keep=GR;GR={started:true,done:false,bpm:60,res:0,extras:[],bi:0,hold:0,holdFrom:0,c:{},onsets:Array.from({length:16},(_,i)=>({t:i*250,hit:null,off:null}))};
 GR.onsets.forEach((o,i)=>{if(i===5)return;const t=o.t-20;while(GR.res<GR.onsets.length&&GR.onsets[GR.res].t+250<t){if(GR.onsets[GR.res].hit===null)GR.onsets[GR.res].hit=false;GR.res++;}grooveMatch(t);});
 if(GR.onsets.some((o,i)=>i!==5&&(!o.hit||o.off!==-20))||GR.onsets[5].hit||GR.extras.length){bad++;console.log('GROOVE matching: a missed note shifts the taps after it',GR.onsets.map(o=>o.hit?o.off:'miss').join(' '));}
 GR=keep;}
/*GMSW_END*/
/* ===== THE READING BUILD, PHASE A (26 Nov 2026): a long take is graded by its share; a scan before the count-in ===== */
/*RBA_BEGIN*/
{const sb=m=>{bad++;console.log('RBA',m);};S.gid='sightread';
 const mkQ=(n,len)=>{const T=Array.from({length:n},(_,i)=>i%2?62:60);const q=M({key:'rba-'+n,label:'t',target:T,octaveFree:false,maxNotes:n,degs:T.map(()=>'x'),names:T.map(()=>'x'),hideTarget:true,metro:60,grid:T.map((_,i)=>i),sr:{barOf:T.map((_,i)=>Math.floor(i/4))}});q.rhyStrict=true;srShareSet(q,T.map(()=>len||1));return q;};
 const B=1000,t0=5000,take=(q,f)=>{const ns=[];q.target.forEach((m,k)=>{const x=f?f(k,m):{};if(x===null)return;ns.push({midi:x.m!=null?x.m:m,mf:x.m!=null?x.m:m,t:t0+q.grid[k]*B+(x.d||0),dur:250});});return micGrade(q,{notes:ns,firstAt:t0,beat:B,beatStart:t0});};
 const sp=(n,c)=>new Set(Array.from({length:c},(_,j)=>Math.floor((j+.5)*n/c)));
 const q52=mkQ(52);if(!q52.share)sb('52 slots: no share rule');
 if(!take(q52).ok)sb('52: the perfect take fails');
 {const W=sp(52,5),r=take(q52,(k,m)=>W.has(k)?{m:m+5}:{});if(!r.ok)sb('52: five wrong notes fail ('+(r.share&&r.share.pct)+')');}
 {const W=sp(52,6),r=take(q52,(k,m)=>W.has(k)?{m:m+5}:{});if(r.ok)sb('52: six wrong notes pass');}
 {const W=sp(52,5),r=take(q52,k=>W.has(k)?{d:B}:{});if(!r.ok)sb('52: five notes a beat late fail');if(r.share&&r.share.late!==5)sb('52: late count '+(r.share&&r.share.late));}
 {const W=sp(52,6),r=take(q52,k=>W.has(k)?{d:B}:{});if(r.ok)sb('52: six notes a beat late pass');}
 {const r=take(q52,k=>k===20?{d:B*.3}:{});if(!r.ok)sb('52: one note a third of a beat late fails the long take (rhyStrict should not decide)');}
 /* extra notes count: 4 wrong + 2 extra = 6 bad of 54 → fails; 4 wrong + 1 extra passes */
 {const extra=(q,W,X)=>{const ns=[];q.target.forEach((m,k)=>{ns.push({midi:W.has(k)?m+5:m,mf:m,t:t0+k*B,dur:250});if(X.has(k))ns.push({midi:m+7,mf:m+7,t:t0+k*B+B*.5,dur:300});});return micGrade(q,{notes:ns,firstAt:t0,beat:B,beatStart:t0});};
  const r1=extra(q52,sp(52,4),new Set([3])),r2=extra(q52,sp(52,4),new Set([3,40]));if(!r1.ok)sb('52: four wrong and one extra fail');if(r2.ok)sb('52: four wrong and two extra pass');if(r2.share&&r2.share.extra!==2)sb('52: extra count '+(r2.share&&r2.share.extra));}
 /* a stop: 100 quarter-note slots, 8 unplayed in a row = a stop (share 92 % would pass); 4 in a row (one bar) pass */
 const q100=mkQ(100);
 {const r=take(q100,k=>k>=40&&k<48?null:{});if(r.ok)sb('100: two bars unplayed pass');if(!r.share||!r.share.stop||r.share.stop.bar!==11)sb('100: the stop is not found in bar 11 '+JSON.stringify(r.share&&r.share.stop));if(r.share&&r.share.pct<.9)sb('100: the share should hold');}
 {const r=take(q100,k=>k>=40&&k<44?null:{});if(!r.ok)sb('100: one bar unplayed fails');}
 {const r=take(q100,k=>k>=40&&k<45?{m:70}:{});if(r.ok)sb('100: five wrong in a row (five beats) pass');}
 /* rests do not count: half-beat slots → 8 in a row = 4 beats, not a stop */
 {const qh=mkQ(100,.5),r=take(qh,k=>k>=40&&k<48?{m:70}:{});if(!r.ok||r.share.stop)sb('100 eighths: 8 wrong in a row (four beats) count as a stop');}
 /* a 15-slot line keeps the strict rule */
 {const q15=mkQ(15);if(q15.share)sb('15 slots: a share rule');const r=take(q15,(k,m)=>k===7?{m:m+5}:{});if(r.ok)sb('15: one wrong note passes');}
 /* the feedback says the numbers */
 {const W=sp(52,5),r=take(q52,(k,m)=>W.has(k)?{m:m+5}:{}),tx=micFeedbackExtra(q52,r);if(!/47 of 52 notes right and in time \\(90 %/.test(tx))sb('feedback: '+tx);}
 {const r=take(q100,k=>k>=40&&k<48?null:{}),tx=micFeedbackExtra(q100,r);if(!/stopped in bar 11/.test(tx))sb('feedback stop: '+tx);}
 /* the scan: 2 s a written bar, 4 to 30 */
 [[1,4],[2,4],[4,8],[8,16],[16,30],[32,30]].forEach(([b,v])=>{if(scanSecs(b)!==v)sb('scan '+b+' bars = '+scanSecs(b));});
 /* other games keep their rules: no share on Scale Runner, Along the Neck, Tunes by Ear */
 [['scales',2],['along',3],['tunes',9]].forEach(([g,L])=>{S.gid=g;for(const gen of GBY[g].levels[L-1].g){const q=gen();if(q.share||q.scan)sb(g+' L'+L+' has a share or scan');}});S.gid='sightread';}
/*RBA_END*/
/*RBB_BEGIN*/
/* the reading build, phase B (26 Nov 2026): Reading Rhythm's new order, REORDERS30 a permutation, goal R's rhythm steps, the round generators of the two "everything" levels free of the meters that moved out */
{const sb=m=>{bad++;console.log('RBB',m);};const nm=GBY.rhyread.levels.map(l=>l.n);
 const want={16:'Switching grids',17:'Rests and dots inside the grids',18:'Everything so far, in 4/4',19:'6/8, with sixteenths',20:'Cut time',21:'Everything so far',22:'Broken triplets',23:'Everything',24:'Road map, played',25:'12/8',26:'Sixteenth-note triplets',27:'5/4 and 3/8',28:'Changing meters',29:'Accented eighth notes',31:'Accented sixteenths'};if(nm.length!==31)sb('Reading Rhythm has '+nm.length+' levels');
 Object.entries(want).forEach(([L,n])=>{if(nm[L-1]!==n)sb('level '+L+' is '+nm[L-1]+', not '+n);});
 const R30=REORDERS30.rhyread,img=Object.values(R30.m).sort((a,b)=>a-b).join(),dom=Object.keys(R30.m).map(Number).sort((a,b)=>a-b).join();if(img!==dom)sb('REORDERS30 is not a permutation');
 const st=GOALS.R.stages.map(x=>x.steps.filter(z=>z[0]==='rhyread').map(z=>z[1]+'-'+z[2]).join());if(st.join('|')!=='1-5|6-12|13-21|22-23|24-24')sb('goal R rhythm steps '+st.join('|'));
 if(GOALS.R.stages.some(x=>x.steps.some(z=>z[0]==='rhydict')))sb('goal R still requires Rhythm Dictation');
 if(!GOALS.R.more.some(z=>z[0]==='rhyread'&&z[1]===25&&z[2]===31)||!GOALS.R.more.some(z=>z[0]==='rhydict'&&z[1]===1&&z[2]===16))sb('goal R appendix');
 ['B','C','D'].forEach(k=>GOALS[k].stages.concat([{steps:GOALS[k].more}]).forEach(x=>x.steps.forEach(z=>{if(z[0]==='rhyread'&&z[2]>12)sb('goal '+k+' names rhyread '+z[1]+'-'+z[2]);})));
 [21,23].forEach(L=>GBY.rhyread.levels[L-1].g.forEach(g=>{for(let i=0;i<30;i++){const q=g();if(/12.8|5.4|3.8|6.8/.test(q.prompt||'')){sb('level '+L+' asks a moved meter');break;}}}));}
/* the grid levels (27 Nov 2026): 16 Switching grids (no rest, tie or dot; every bar fills 4/4; over 400 bars all three ways of changing occur: a grid held for two bars, a change on beat 3, a change on another beat; a line never starts on the grid the last ended on), 17 one grid a line with rests and dots; REORDERS32 */
{const sb=m=>{bad++;console.log('GRID',m);};const gridOf=es=>es.length===1&&Math.abs(es[0].d-1)<1e-6&&!es[0].tup?'?':es.some(e=>e.tup)?'t':es.some(e=>Math.abs(e.d*2-Math.round(e.d*2))>1e-6||Math.abs(e.t*2-Math.round(e.t*2))>1e-6)?'s':'e';
 const c16=grooveSpec('rhyread',16),c17=grooveSpec('rhyread',17);if(!c16||!c17)sb('no spec');else{const seen={line:0,half:0,other:0};let prevLast=null;
  for(let k=0;k<400;k++){const b=c16.bar(k,4),tot=b.ev.reduce((a,e)=>a+e.d,0);if(Math.abs(tot-4)>1e-6){sb('16: a bar of '+tot+' beats');break;}if(b.ev.some(e=>e.rest||e.d===.75||e.d===1.5)){sb('16: a rest or a dot');break;}
   if(b.ev.some(e=>Math.floor(e.t+1e-6)!==Math.floor(e.t+e.d-1e-6)&&e.d<=1)){sb('16: a figure crosses a beat');break;}
   const gs=[0,1,2,3].map(a=>gridOf(b.ev.filter(e=>e.t>=a-1e-6&&e.t<a+1-1e-6)));if(k%2===0&&prevLast&&gs[0]===prevLast&&gs[0]!=='e'&&gs[0]!=='?')sb('16: a line starts on the grid the last ended on');
   if(k%2===0){const nb=c16.bar(k+1,4),gs2=[0,1,2,3].map(a=>gridOf(nb.ev.filter(e=>e.t>=a-1e-6&&e.t<a+1-1e-6))),all=gs.concat(gs2);
     const nq=a=>new Set(a.filter(x=>x!=='?')).size;if(nq(all)===1)seen.line++;else if(nq(gs.slice(0,2))===1&&nq(gs.slice(2))===1&&nq(gs)===2)seen.half++;else seen.other++;prevLast=gs2[3];k++;}}
  if(!seen.line||!seen.half||!seen.other)sb('16: not every way of changing occurs '+JSON.stringify(seen));
  for(let k=0;k<40;k+=2){const a=c17.bar(k,4),b=c17.bar(k+1,4),ga=gridOf(a.ev),gb=gridOf(b.ev);if(ga!==gb&&ga!=='e'&&gb!=='e'&&ga!=='?'&&gb!=='?'){sb('17: the grid changes inside a line');break;}}}
 const R32=REORDERS32.rhyread;if(R32.m[16]!==16||R32.m[18]!==16||R32.m[19]!==17||R32.m[20]!==18||R32.m[33]!==31)sb('REORDERS32');}
/*RBB_END*/
/*RBC_BEGIN*/
/* the reading build, phase C (26 Nov 2026): Sight Reading 3–23 ask long lines. Over 600 draws a level (pickGen, as pickQ draws): levels 3–12 about two in three four bars,
   13–23 about half eight bars and a third four; every long line keeps the rules of srLineQ (no pitch twice in a row, no A B A B A, a natural only where the level has one,
   bars filled, the page read back = the targets through the SIGHTREAD block), 16 slots or more carry the share rule, the item keys of long lines name their bars */
{const sb=m=>{bad++;console.log('RBC',m);};S.gid='sightread';
 for(let L=3;L<=23;L++){const gs=GBY.sightread.levels[L-1].g,cnt={2:0,4:0,8:0};let n=0;
   for(let i=0;i<600;i++){const gen=pickGen(gs);let q;try{q=gen();}catch(e){sb('L'+L+' throws '+e.message);break;}const nb=q.sr.bars.length;cnt[nb>=8?8:nb>=4?4:2]++;n++;const o=gen.o||{};
     if(srSeesaw(q.target)){sb('L'+L+' A B A B A '+q.key);break;}if(!noDup(q.target)){sb('L'+L+' a pitch twice '+q.key);break;}
     if(!o.nat&&q.sr.bars.some(b=>b.ev.some(e=>e.acc===0))){sb('L'+L+' a natural on a level without one '+q.key);break;}
     if(nb>2&&!new RegExp('-'+nb+'b-').test(q.key)){sb('L'+L+' a '+nb+'-bar key without its bars '+q.key);break;}
     if(lineSlots(q.target,true)>=16!==!!q.share){sb('L'+L+' share rule does not follow the slots '+q.key);break;}
     if(nb>=4&&q.metro&&(q.grid.at(-1)+2)*60/q.metro>90){sb('L'+L+' a take longer than 90 s '+q.key);break;}}
   const f=k=>cnt[k]/n;if(L<=12){if(f(4)<.55||f(4)>.78)sb('L'+L+' four bars '+f(4).toFixed(2));if(f(8))sb('L'+L+' eight bars');}
   else{if(f(8)<.4||f(8)>.6)sb('L'+L+' eight bars '+f(8).toFixed(2));if(f(4)<.24||f(4)>.43)sb('L'+L+' four bars '+f(4).toFixed(2));}}
 [1,2,24,25].forEach(L=>{if(GBY.sightread.levels[L-1].g.some(g=>g.w))sb('L'+L+' weighted');});
 console.log('reading build C checked');}
/*RBC_END*/
/*RCC_BEGIN*/
/* Chart Reading (26 Nov 2026, reading brief phase D): ten levels and their registries; every chart's bars fill the bar (a push spills into the next bar exactly where its figure starts);
   every chord has a grip; the grid is the written strums, never closer than a beat; a perfect take passes; under 8 strums one wrong chord fails; from 8 the share rule (16 strums:
   one wrong passes, two fail); every strum half a beat late fails; a road map played straight through fails; item keys hold no key name; 12 items or more a level in 300 draws */
{const sb=m=>{bad++;console.log('RCC',m);};S.gid='chartread';const x=GBY.chartread;
 if(!x||x.levels.length!==10)sb('ten levels');if(x.cat!=='voicings'||!x.mic)sb('cat or mic');
 if(COURSE.chartread!==201||!BADGE.chartread||!(STYLE.chartread||[]).includes('jazz')||!SHORTN.chartread||!STD.chartread||(LEVEL_NOTES.chartread||[]).length!==10||!(LESSON_NOTES.chartread||[]).length)sb('registries');
 if(PLAY_GAMES.includes('chartread')||HAT_GAMES.includes('chartread'))sb('in PLAY_GAMES or HAT_GAMES');
 if(!GOALS.R.stages[3].steps.some(z=>z[0]==='chartread'&&z[1]===1&&z[2]===5)||!GOALS.R.stages[4].steps.some(z=>z[0]==='chartread'&&z[1]===6&&z[2]===10)||!GOALS.D.more.some(z=>z[0]==='chartread'&&z[1]===1&&z[2]===10))sb('goals');
 const act=v=>{const a={};for(let m=40;m<=88;m++)a[m]=0.02;v.forEach(m=>a[m]=0.7);return a;},
  take=(q,seq,f,times)=>{const B=60000/q.metro,bs=4*B+100;return micGrade(q,{strums:seq.map((v,i)=>({t:bs+(times?times[i]:q.grid[i])*B+(f?f(i):0),act:act(v)})),beat:B,beatStart:bs,firstAt:bs});},
  wrongOf=v=>v.map(m=>m+1);
 x.levels.forEach((lv,li)=>{const L=li+1,items=new Set();
  for(let t=0;t<300;t++){const g=lv.g[t%lv.g.length];let q;try{q=g();}catch(e){sb('L'+L+' throws '+e.message);break;}items.add(q.key);if(t>=40)continue;const C=q.cc,ch=C.ch,tag='L'+L+' '+q.key;
   /* the bars fill the bar: each bar's events and the spill of a push from the bar before cover 0–4 once */
   let bad1='';ch.bars.forEach((b,bi)=>{let cov=[];const prev=ch.bars[bi-1];if(prev)prev.ev.forEach(e=>{if(e.t+e.d>4+1e-9)cov.push([0,e.t+e.d-4]);});b.ev.forEach(e=>cov.push([e.t,Math.min(4,e.t+e.d)]));cov.sort((a,c)=>a[0]-c[0]);let at=0;cov.forEach(c=>{if(Math.abs(c[0]-at)>1e-9)bad1='bar '+(bi+1)+' has a gap or overlap at '+at;at=c[1];});if(Math.abs(at-4)>1e-9)bad1='bar '+(bi+1)+' ends at '+at;if(b.ev.some(e=>e.c==='n')&&(bi%4===3||bi===ch.bars.length-1))bad1='a push across a line';});if(bad1){sb(tag+' '+bad1);break;}
   if(ch.bars.some(b=>b.chords.some(c=>!symParse(c.sym)||!chordVoicings(c.r,c.q).length))){sb(tag+' a chord without a grip');break;}
   if(q.grid.join()!==C.st.map(z=>z.t).join()||q.grid.some((g2,i)=>i&&g2-q.grid[i-1]<1-1e-9)){sb(tag+' the grid is not the written strums a beat apart');break;}
   if(q.strumSeq.length!==q.grid.length||q.strumAltSeq.some((a,i)=>!a.length||!a.some(v=>v.join()===q.strumSeq[i].join()))){sb(tag+' the strums and their grips do not line up');break;}
   if(q.key.split('-').includes(ch.key)){sb(tag+' the key name is in the item key');break;}
   if(!take(q,q.strumSeq).ok){sb(tag+' the perfect take fails');break;}
   const n=q.strumSeq.length;
   if(n<8){const w=q.strumSeq.slice();w[Math.floor(n/2)]=wrongOf(w[Math.floor(n/2)]);if(take(q,w).ok){sb(tag+' one wrong chord passes under 8 strums');break;}}
   else{if(!q.share||q.share.from!==8){sb(tag+' no share rule from 8 strums');break;}const al=n-Math.ceil(n*.9-1e-9),pk=c=>Array.from({length:c},(_,j)=>Math.floor((j+.5)*n/c)),W=ix=>q.strumSeq.map((v,i)=>ix.includes(i)?wrongOf(v):v);
     if(al&&!take(q,W(pk(al))).ok){sb(tag+' '+al+' wrong chords of '+n+' fail');break;}if(take(q,W(pk(al+1))).ok){sb(tag+' '+(al+1)+' wrong chords of '+n+' pass');break;}}
   if(take(q,q.strumSeq,()=>60000/q.metro*0.5).ok){sb(tag+' every strum half a beat late passes');break;}
   if(ch.road){const wr=[];ch.bars.forEach((b,w)=>b.ev.forEach(e=>{if(e.rest||e.c===undefined)return;const c=e.c==='n'?ch.bars[w+1].chords[0]:b.chords[e.c];wr.push({t:w*4+e.t,v:chordVoicings(c.r,c.q)[0]});}));
     if(take(q,wr.map(z=>z.v),null,wr.map(z=>z.t)).ok){sb(tag+' the road map played straight through passes');break;}}}
  if(items.size<12)sb('L'+L+' only '+items.size+' items in 300 draws');});
 /* 16 strums: one wrong chord passes, two fail (the share rule's numbers) */
 {const g=x.levels[2].g[0];let q=null;for(let t=0;t<50&&!q;t++){const z=g();if(z.strumSeq.length===16)q=z;}if(!q)sb('no 16-strum chart at level 3');else{const W=ix=>q.strumSeq.map((v,i)=>ix.includes(i)?wrongOf(v):v);if(!take(q,W([7])).ok)sb('16 strums: one wrong chord fails');if(take(q,W([3,11])).ok)sb('16 strums: two wrong chords pass');}}
 /* other strummed questions keep their rule: a Shells cadence in time has no share rule */
 S.gid='shells';for(const lv of GBY.shells.levels)for(const g of lv.g){let q;try{q=g();}catch(e){continue;}if(q.share){sb('shells has a share rule');break;}}S.gid='chartread';
 console.log('chartread checked');}
/*RCC_END*/
/*SHEET_BEGIN*/
/* Scale Runner on the user's seven-shape sheet (27 Nov 2026): every key's positions are the seven of the sheet (types 1 1A 1C 2 3 4 4B), the tonic never under the third finger;
   C in position III plays D on string 3 at fret 7 (Scale Runner only; Reading keeps string 2 fret 3); no level but “Twelve keys in one position” asks another type */
{const sb=m=>{bad++;console.log('SHEET',m);};
 for(let k=0;k<12;k++){const ps=scSheetPos(k),ts=ps.map(p=>scPos(k,p).type).sort().join(' ');if(ps.length!==7||ts!=='1 1A 1C 2 3 4 4B')sb('key '+k+': '+ps.join(',')+' types '+ts);
   ps.forEach(p=>{const z=scPos(k,p,null,true),fing=z.notes.filter(n=>mod(n.m-k,12)===0&&n.s>=4).map(n=>n.f-p+1);if(fing.includes(3))sb('key '+k+' position '+p+': a tonic under the third finger');});}
 if(scSheetPos(0).join()!=='2,3,5,7,9,11,12')sb('C: '+scSheetPos(0).join());
 {const z=scPos(0,3,null,true).notes,d=z.find(n=>n.m===62);if(!d||d.s!==3||d.f!==7)sb('C in III: D not on string 3 fret 7');const r=scPos(0,3).notes.find(n=>n.m===62);if(!r||r.s!==2||r.f!==3)sb('Reading C in III: D not on string 2 fret 3');}
 S.gid='scales';GBY.scales.levels.forEach((lv,i)=>{if(lv.n==='Twelve keys in one position')return;lv.g.forEach(g=>{for(let t=0;t<40;t++){let q;try{q=g();}catch(e){continue;}const m=/type (1B|1D|4A|4C|4D)\\b/.exec([q.visual||'',q.label||'',q.explain||''].join(' | '));if(m){const src=[q.visual||'',q.label||'',q.explain||''].join(' | '),j=src.indexOf(m[0]);sb('level '+(i+1)+' '+lv.n+' asks type '+m[1]+' ('+q.key+') '+src.slice(Math.max(0,j-70),j+20).replace(/<[^>]*>/g,' '));break;}}});});
 console.log('sheet checked');}
/*SHEET_END*/
/*YTGSW_BEGIN*/
 /* YouTube Notes of a game (27 Nov 2026): every entry renders, has a title, a channel, a level, a video id listed in videos/<channel>/_list.tsv (when the folder is present),
    3 to 8 references rising inside the video's length, no maj7, no lower-case numerals, no em dashes, every neck diagram titled, NF.err empty */
 {const gb=m=>{bad++;console.log('YTG',m);};NF.err.length=0;const TAB=String.fromCharCode(92)+'t',LEN={};['jenslarsen','marbin'].forEach(ch=>{try{fs.readFileSync(path.join(__dirname,'..','videos',ch,'_list.tsv'),'utf8').split(String.fromCharCode(10)).forEach(l=>{const a=l.split(TAB);if(a.length>2)LEN[a[0]]=+a[1];});}catch(e){}});const haveList=Object.keys(LEN).length>0;let n=0,figs=0;
  Object.entries(YT_GAME).forEach(([gid,Y])=>{if(!GBY[gid])gb('ytg: no game '+gid);(Y.parts||[]).forEach(p=>{if(!p.h||!Y.entries.some(e=>e.vid===p.from))gb('ytg: part '+p.from);});if(Y.parts&&Y.parts.length&&Y.entries[0].vid!==Y.parts[0].from)gb('ytg: the first lesson has no part');if(!Y.entries.length)gb('ytg: no entries '+gid);const seen=new Set();
   Y.entries.forEach(e=>{n++;const w='ytg '+e.vid+': ';if(seen.has(e.vid))gb(w+'twice');seen.add(e.vid);if(!/^[\\w-]{11}$/.test(e.vid))gb(w+'id');if(!e.title||!YT_CH[e.ch])gb(w+'title or channel');if(!['beginner','intermediate','advanced'].includes(e.level))gb(w+'level');
    if(haveList&&!(e.vid in LEN))gb(w+'not in the channel list');if(haveList&&LEN[e.vid]!==e.len)gb(w+'length '+e.len+' not '+LEN[e.vid]);
    if(e.topics){const T=e.topics,ts=new Set(T.map(x=>x.t));if(e.refs)gb(w+'refs on a page without times');if(!T.length||T[0].t>60)gb(w+'the first topic after 60 s');T.forEach((x,i)=>{if(!Number.isInteger(x.t)||x.t<0||x.t>=e.len||(i&&x.t<=T[i-1].t)||!x.label||x.label.split(' ').length>8)gb(w+'topic '+x.t+' '+x.label);});e.p.forEach((it,i)=>{if(typeof it==='string'||Array.isArray(it)||!ts.has(it.t))gb(w+'item '+i+' has no topic time');});}
    else if(!e.refs||e.refs.length<3||e.refs.length>8)gb(w+'refs: 3 to 8');(e.refs||[]).forEach((r,i)=>{if(!(r[0]>=0&&r[0]<e.len)||!r[1]||(i&&r[0]<=e.refs[i-1][0]))gb(w+'ref '+r[0]);});
    let h='';try{h=e.p.map(noteItem).join('');}catch(err){gb(w+'render '+err.message);}const all=(h+' '+(e.unclear||[]).join(' ')+' '+(e.refs||[]).map(r=>r[1]).join(' ')),txt=all.replace(/<svg[\\s\\S]*?<\\/svg>/g,' ').replace(/<[^>]+>/g,' ');
    if(/maj7/.test(txt))gb(w+'maj7');if(/—/.test(all))gb(w+'em dash');if(/\\b(ii|iii|iv|vi|vii)(m7|7)?\\b/.test(txt))gb(w+'lower-case numeral');if(/undefined|NaN|nf-err/.test(all.replace(/aria-label="[^"]*"/g,'')))gb(w+'broken value');
    const nk=(h.match(/<svg class="nfneck"/g)||[]).length,nt=(h.match(/<svg class="nfneck"[^>]*><text class="nn-title"/g)||[]).length;if(nk!==nt)gb(w+(nk-nt)+' neck diagram(s) without a title');figs+=(h.match(/<figure class="nfig"/g)||[]).length;});});
  Object.keys(YT_GAME).forEach(g=>{if(!['scales','arp'].includes(g))gb('ytg: YouTube Notes on a game that should have none: '+g);if(YT_GAME[g].noTimes){YTG_HTML[g]=null;const h=ytgBody(g).replace(/<svg[\\s\\S]*?<\\/svg>/g,' ').replace(/<[^>]+>/g,' ');if(/\\b\\d{1,2}:\\d\\d\\b/.test(h))gb('ytg: a clock time on the '+g+' page: '+(h.match(/.{0,30}\\b\\d{1,2}:\\d\\d\\b.{0,10}/)||[""])[0]);}});
  if(NF.err.length)gb('ytg: figure faults: '+NF.err.slice(0,5).join(' | '));console.log('youtube notes of games',Object.keys(YT_GAME).length,'entries',n,'figures',figs);}
/*YTGSW_END*/
/*SLB_BEGIN*/
/* THE SCALE LESSONS BUILD (28 Nov 2026, brief .claude/scale-lessons-brief.md). No template literals and no backslashes in this block. */
{const sl=m=>{bad++;console.log('SLB',m);};S.gid='scales';const LV=GBY.scales.levels,lvOf=n=>LV.find(l=>l.n===n),nameOf=m=>PCN[mod(m,12)].split('/')[0];
 /* A1: every older pattern kind gives the output it gave before (the function as it stood before the step option, kept here) */
 {const OLD_ST={'3':[0,2],tri:[0,2,4],'7':[0,2,4,6],g3:[0,1,2],g4:[0,1,2,3],'4':[0,3],t3135:[2,0,2,4],t1531:[0,4,2,0],t5135:[4,0,2,4],t1353:[0,2,4,2],c1231:[0,1,2,0],inv1:[0,2,5],inv2:[0,3,5]},OLD_G={'3':8,tri:6,'7':4,g3:6,g4:5,'4':8,t3135:6,t1531:6,t5135:6,t1353:6,c1231:6,inv1:5,inv2:5};
  const old=(n,kind,dir,from,groups)=>{from=from||0;if(kind==='scale'){const up=Array.from({length:n-from},(_,i)=>from+i);return dir==='up'?up:dir==='down'?up.slice().reverse():up.concat(up.slice(0,-1).reverse());}const st=OLD_ST[kind],span=Math.max(...st),G=Math.min(groups||OLD_G[kind],n-from-span),out=[];for(let g=0;g<G;g++){if(dir==='down'){const top=n-1-g;out.push(...st.map(x=>top-x));}else{const grp=st.map(x=>from+g+x);out.push(...(dir==='alt'&&g%2?grp.reverse():grp));}}return out;};
  let nchk=0;Object.keys(OLD_ST).concat('scale').forEach(k=>{if(k!=='scale'&&(SC_ST[k].join()!==OLD_ST[k].join()||SC_GDEF[k]!==OLD_G[k]))sl('kind '+k+' changed');['up','down','alt','updown'].forEach(d=>{for(let n=8;n<=20;n++)for(let f=0;f<4;f++)[undefined,n,4].forEach(g=>{nchk++;if(scPattern(n,k,d,f,g).join()!==old(n,k,d,f,g).join())sl('scPattern '+k+' '+d+' n'+n+' from'+f+' groups'+g+' differs');});});});if(nchk<2000)sl('old kinds: too few cases');}
 /* A2: the new kinds, and the step */
 {const want={'6':[0,5],q3:[0,3,6],t315:[2,0,4],t153:[0,4,2],t513:[4,0,2],t351:[2,4,0]};Object.keys(want).forEach(k=>{if(!SC_ST[k]||SC_ST[k].join()!==want[k].join()||!SC_PAT[k]||!SC_GDEF[k]||!SC_PX[k])sl('new kind '+k);});
  if(scPattern(12,'tri','up',1,12,2).join()!=='1,3,5,3,5,7,5,7,9,7,9,11')sl('step 2: '+scPattern(12,'tri','up',1,12,2).join());
  if(scPattern(12,'7','down',0,12,2).join()!=='11,9,7,5,9,7,5,3,7,5,3,1')sl('step 2 down: '+scPattern(12,'7','down',0,12,2).join());
  /* in C from D: Dm F Am C Em G B° (the pitches of position VII from its D, index of D found) */
  const z=scPos(0,7,null,true),d=z.notes.findIndex(x=>mod(x.m,12)===2),ix=scPattern(z.notes.length,'tri','up',d,7,2),gs=[];for(let i=0;i+2<ix.length;i+=3)gs.push(ix.slice(i,i+3).map(j=>nameOf(z.notes[j].m)).join(''));
  if(gs.slice(0,5).join(' ')!=='DFA FAC ACE CEG EGB')sl('third apart from D: '+gs.join(' '));
  if(scChordRow(P('C'),'maj',3,2).join(' ')!=='Dm F Am C Em G B°')sl('row of triads a third apart: '+scChordRow(P('C'),'maj',3,2).join(' '));
  if(scChordRow(P('C'),'maj',4,2).join(' ')!=='Dm7 FMaj7 Am7 CMaj7 Em7 G7 Bm7♭5')sl('row of sevenths a third apart');
  if(scChordRow(P('A'),'hm',4,1).join(' ')!=='Am(Maj7) Bm7♭5 CMaj7♯5 Dm7 E7 FMaj7 G♯°7')sl('A harmonic minor: '+scChordRow(P('A'),'hm',4,1).join(' '));
  if(scChordRow(P('A'),'mm',4,1).join(' ')!=='Am(Maj7) Bm7 CMaj7♯5 D7 E7 F♯m7♭5 G♯m7♭5')sl('A melodic minor: '+scChordRow(P('A'),'mm',4,1).join(' '));
  ['maj','mm','hm'].forEach(sid=>CIRCLE5.forEach(k=>[3,4].forEach(n=>{if(scChordRow(P(k),sid,n,1).some(c=>c.indexOf('?')>=0))sl('unnamed chord in '+k+' '+sid);})));}
 /* A3: where they went: appended after the old generators, the level renamed, level 20 appended (phase A numbering; found by name from phase B on) */
 {const f=lvOf('Fourths, sixths, stacked fourths'),t=lvOf('Triads, every position'),s=lvOf('Seventh chords, every position'),c=lvOf('Triad shapes and cells'),m=lvOf('Minor scales: thirds, triads, seventh chords');
  if(!f||!t||!s||!c||!m){sl('a level of phase A is missing');}else{
  const kinds=(g,n)=>{const o=new Set(),ks=new Set(),ky=new Set();for(let i=0;i<(n||60);i++){const q=g();o.add(q.key.split('-').slice(2).join('-'));ks.add(q.key);ky.add(strip(q.prompt).trim().split(' ')[0]);}return {o,ks,ky};},strip=h=>String(h).replace(/<[^>]+>/g,' ').replace(/ +/g,' ');
  if(f.g.length!==7||t.g.length!==7||s.g.length!==6||c.g.length!==7||m.g.length!==4)sl('generator counts '+[f,t,s,c,m].map(l=>l.g.length).join(' '));
  /* the first generators of each changed level still give only their old kinds */
  [[f,3,/^4-/],[t,4,/^tri-(up|down|alt)(-oct)?-[123]$/],[s,3,/^7-(up|down|alt)(-oct)?-[12]$/],[c,5,/^(t3135|t1531|t5135|t1353|c1231|inv1|inv2)-/]].forEach(([l,n,re])=>{for(let i=0;i<n;i++)kinds(l.g[i],40).o.forEach(k=>{if(!re.test(k))sl(l.n+' generator '+(i+1)+' gives '+k);});});
  [[f,3,/^6-/],[f,4,/^q3-/],[f,5,/^6-/],[f,6,/^q3-/],[t,6,/^tri-(up|down)-th-3$/],[s,5,/^7-(up|down)-th-2$/],[c,5,/^t(315|153|513|351)-up-3$/],[c,6,/^t(315|153|513|351)-up-3$/]].forEach(([l,i,re])=>{kinds(l.g[i],40).o.forEach(k=>{if(!re.test(k))sl(l.n+' new generator '+(i+1)+' gives '+k);});});
  [[f,5],[f,6],[t,4],[t,5],[s,3],[s,4],[c,6]].forEach(([l,i])=>{const ky=kinds(l.g[i],90).ky;if(!['C','F','G'].every(k=>ky.has(k))||ky.size!==3)sl(l.n+' generator '+(i+1)+' keys: '+[...ky].join(' '));});
  /* A4: the minor level: in the scale, stacked thirds, the chords named, no pitch twice, the keys of the scale level */
  m.g.forEach((g,gi)=>{const sid=gi%2?'hm':'mm',S=SC_SCALES[sid].s,keys=new Set(),ks=new Set();for(let i=0;i<80;i++){const q=g(),w=strip(q.prompt).trim().split(' '),k=w[0],rp=pc(P(k)),kd=q.key.split('-')[3],sz={'3':2,tri:3,'7':4}[kd];keys.add(k);ks.add(kd+(q.key.indexOf('-oct-')>0?'o':''));
    if(q.key.indexOf('sc-'+sid+'-')!==0||!sz){sl('minor level key '+q.key);continue;}
    if(q.target.some(x=>S.indexOf(mod(x-rp,12))<0))sl('minor level: a note outside '+k+' '+sid);if(q.target.some((x,j)=>j&&x===q.target[j-1]))sl('minor level: a pitch twice in a row '+q.key);
    for(let j=0;j+sz<=q.target.length;j+=sz){const grp=q.target.slice(j,j+sz).slice().sort((a,b)=>a-b);for(let u=1;u<sz;u++){const a=S.indexOf(mod(grp[u-1]-rp,12)),b=S.indexOf(mod(grp[u]-rp,12));if(mod(b-a,7)!==2||grp[u]-grp[u-1]>4){sl('minor level: group not in thirds '+q.key+' '+grp.join(' '));j=1e9;break;}}}
    if(sz>2){const row=scChordRow(P(k),sid,sz,1).join(', ');if(q.explain.indexOf(row)<0)sl('minor level: the chords are not named '+q.key);if(/IIm7 – V7 – IMaj7|VIm, VII°/.test(q.explain))sl('minor level: a sentence of the major key '+q.key);}
    if(q.grid.some((x,j)=>x!==j))sl('minor level: not in quarter notes');}
   const want=(sid==='mm'?['C','A','D','G','F']:['C','A','D','G','E']);if(!want.every(k=>keys.has(k))||keys.size!==5)sl('minor level keys '+[...keys].join(' '));if(ks.size<3)sl('minor level generator '+(gi+1)+' kinds '+[...ks].join(' '));if((gi<2)!==[...ks].every(x=>x.slice(-1)==='o'))sl('minor level generator '+(gi+1)+': from the tonic first, then the whole position');});
  /* one octave from the tonic starts on the tonic */
  for(let i=0;i<40;i++){const q=m.g[i%2](),k=strip(q.prompt).trim().split(' ')[0];if(mod(q.target[0],12)!==pc(P(k)))sl('minor level: from the tonic does not start on it');}}}
 /* no note of a derived scale is missing inside any sheet position (so no group skips one) */
 {let n=0;['mm','hm'].forEach(sid=>CIRCLE5.forEach(k=>{const rp=pc(P(k));scSheetPos(rp).forEach(Pn=>{n++;const z=scPos(rp,Pn,SC_SCALES[sid].s.map(x=>mod(rp+x,12)),true);if(!scNoGap(z,rp,SC_SCALES[sid].s))sl('a gap in '+k+' '+sid+' position '+Pn);});}));if(n!==168)sl('gap check count');
  const z=scPos(0,2,SC_SCALES.hm.s,true),cut={...z,notes:z.notes.filter((x,i)=>i!==4)};if(scNoGap(cut,0,SC_SCALES.hm.s))sl('scNoGap does not see a missing note');}
 /* every Scale Runner generator: never the same pitch twice in a row */
 LV.forEach((lv,i)=>lv.g.forEach((g,gi)=>{for(let t=0;t<30;t++){let q;try{q=g();}catch(e){sl('level '+(i+1)+' generator '+(gi+1)+' throws '+e.message);break;}if(q.target.some((x,j)=>j&&x===q.target[j-1])){sl('level '+(i+1)+' '+lv.n+': a pitch twice in a row ('+q.key+')');break;}}}));
 /* A5: the dots of the diagram: degrees by default, note names, nothing; display only (the question is the same) */
 {const G0=G('scales');G0.opts=G0.opts||{};const z=scPos(0,2,null,true),txt=h=>(h.match(/<text class="pb-t[^>]*>[^<]*/g)||[]).map(x=>x.split('>')[1]);
  const a=txt(scPosSVG(z,0)),b=txt(scPosSVG(z,0,null,false,{mode:'name',of:p=>PCN[p].split('/')[0]})),c=txt(scPosSVG(z,0,null,false,{mode:'none',of:()=>''}));
  if(a.length!==z.notes.length||a.some(x=>!/^[♭♯]?[1-7]$/.test(x)))sl('labels: degrees by default');if(b.some(x=>!/^[A-G]/.test(x))||b.length!==a.length)sl('labels: note names');if(c.some(x=>x!==''))sl('labels: nothing');
  if(scPosSVG(z,0)!==scPosSVG(z,0,null,false,{mode:'deg',of:()=>'x'}))sl('labels: the default picture changed');
  const one=()=>{const q=lvOf('Thirds, in C').g[0]();return q;};delete G0.opts.scLab;const q0=one();if(!/numbers are scale degrees/.test(q0.visual))sl('labels: default caption');
  G0.opts.scLab='name';const q1=one();if(!/letters are note names/.test(q1.visual)||txt(q1.visual).some(x=>!/^[A-G]$/.test(x)))sl('labels: the option name');
  G0.opts.scLab='none';const q2=one();if(txt(q2.visual).some(x=>x!==''))sl('labels: the option none');delete G0.opts.scLab;
  /* F major shows B♭, not A♯ */
  G0.opts.scLab='name';let seen=0;for(let i=0;i<60&&!seen;i++){const q=lvOf('Thirds: C, F and G').g[1]();if(/F major/.test(q.prompt)){seen=1;const t=txt(q.visual);if(t.indexOf('B♭')<0||t.indexOf('A♯')>=0)sl('labels: F major spelled '+t.join(' '));}}delete G0.opts.scLab;if(!seen)sl('labels: no F major question drawn');}
 console.log('scale lessons checked: phase A');
 /* ================= phase B: figures from every degree; the ladder in the lessons' order ================= */
 {const sb=m=>sl('B: '+m),strip=h=>String(h).replace(/<[^>]+>/g,' ').replace(/ +/g,' '),C=P('C');
  /* B1: the reference lines of the brief, in C (a position that holds them; the degree found by its note name) */
  const ln=(id,Pn,degs)=>{const z=scPos(0,Pn,null,true),N=z.notes,F=SL_FIG[id];return degs.map(d=>{const i=N.findIndex((x,j)=>PCN[mod(x.m,12)].split('/')[0]===d&&j+F.span[0]>=0&&j+F.span[1]<N.length);if(i<0)return '?';const L=slLine(F,[i],N,C);return L?L.notes.filter(x=>!x.rest).map(x=>x.name).join(' '):'null';}).join('|');};
  const REF=[['bb',7,['C','D','E','F','G','A','B'],'B C E G B|C♯ D F A C|D♯ E G B D|E F A C E|F♯ G B D F|G♯ A C E G|A♯ B D F A'],['bbe',7,['C','D'],'D B C E G B A|E C♯ D F A C B'],['pv0',7,['C','D'],'C E G B A|D F A C B'],['pv',7,['C','D'],'C E G B A|D F A C B'],['ch2',5,['D'],'A C E G F A C E'],
   ['tl',7,['C','D'],'B C E G|C♯ D F A'],['td',7,['G','F'],'C♯ D B G|B C A F'],['te',7,['C','D'],'D B C E G|E C♯ D F A'],['e4',7,['C','D','E','F','G','A','B'],'E B D C|F C♯ E D|G D♯ F E|A E G F|B F♯ A G|C G♯ B A|D A♯ C B'],['ct',7,['C','D'],'C E G B B♭ A A♭ G|D F A C B B♭ G♯ A']];
  REF.forEach(([id,Pn,dg,want])=>{const got=ln(id,Pn,dg);if(got!==want)sb('figure '+id+': '+got+' (the brief: '+want+')');});if(Object.keys(SL_FIG).length!==REF.length)sb('a figure without a reference line');
  /* the pivot: the first note is the root an octave above the plain line's, and the line opens with a 6th down */
  {const z=scPos(0,7,null,true),N=z.notes,i=N.findIndex(x=>mod(x.m,12)===0),a=slLine(SL_FIG.pv0,[i],N,C).notes.filter(x=>!x.rest).map(x=>x.m),b=slLine(SL_FIG.pv,[i],N,C).notes.filter(x=>!x.rest).map(x=>x.m);if(b[0]!==a[0]+12||b.slice(1).join()!==a.slice(1).join()||![8,9].includes(b[0]-b[1]))sb('the pivot is not the plain line with its root an octave higher');}
  /* a chromatic tail: four half steps between 7th and 5th = straight down; three = past the 5th from below (all seven degrees, three keys) */
  ['C','F','G'].forEach(k=>{const rp=pc(P(k));scSheetPos(rp).forEach(Pn=>{const N=scPos(rp,Pn,null,true).notes;for(let i=0;i+6<N.length;i++){const L=slLine(SL_FIG.ct,[i],N,P(k));if(!L)continue;const m=L.notes.filter(x=>!x.rest).map(x=>x.m),gap=m[3]-m[2];if(m.length!==8||m[7]!==m[2]||(gap===4?m.slice(3).join()!==[0,1,2,3,4].map(x=>m[3]-x).join():gap===3?m.slice(3).join()!==[m[3],m[3]-1,m[3]-2,m[2]-1,m[2]].join():true))sb('chromatic tail in '+k+' position '+Pn+' degree '+i+': '+m.join(' '));}});});
  /* a leading note is always a half step under its target, an enclosure's upper note a scale note; spelling: no E♯, B♯, C♭, F♭, no double accidental */
  /* B2 and B3: every generator of the three levels */
  const LVS=['The bebop arpeggio','Pivot arpeggios','Triads with leading notes and enclosures'],WANT={'The bebop arpeggio':[['bb','oct','C'],['bbe','oct','C'],['bb','pos','C'],['bbe','pos','C'],['bb bbe','pos','CFG']],'Pivot arpeggios':[['pv0','oct','C'],['pv','oct','C'],['pv0','pos','C'],['pv','pos','C'],['ch2','pos','C'],['pv0 pv ch2','pos','CFG']],'Triads with leading notes and enclosures':[['tl','oct','C'],['td','oct','C'],['te','oct','C'],['e4','oct','C'],['ct','oct','C'],['tl td','pos','C'],['te e4','pos','C'],['ct','pos','C'],['tl td te e4 ct','pos','CFG']]};
  const COUNTED={bb:1,bbe:1,pv0:1,pv:1,te:1},TRIP={bb:1,bbe:1,te:1},FIRST={bb:1.5,bbe:3,te:1};let nq=0;
  LVS.forEach(nm0=>{const lv=lvOf(nm0);if(!lv){sb('no level '+nm0);return;}if(lv.g.length!==WANT[nm0].length)sb(nm0+': '+lv.g.length+' generators');
   lv.g.forEach((g,gi)=>{const W=WANT[nm0][gi]||['','',''],figs=new Set(),keys=new Set();for(let t=0;t<40;t++){let q;try{q=g();}catch(e){sb(nm0+' generator '+(gi+1)+' throws '+e.message);break;}nq++;const w=nm0+' '+q.key+': ';
     if(!q.fig||q.key.indexOf('scf-')!==0){sb(w+'fell back');break;}const id=q.fig.id,F=SL_FIG[id];figs.add(id);keys.add(q.fig.key);if(q.fig.form!==W[1])sb(w+'form');if(q.key!=='scf-'+q.key.split('-')[1]+'-'+id+'-'+q.fig.form)sb(w+'key form');
     const bars=q.sr.bars,data=scoreData(bars);if(scoreCheck(bars,'4/4').length)sb(w+'the staff: '+scoreCheck(bars,'4/4')[0]);if(data.map(d=>d.m).join()!==q.target.join())sb(w+'the staff does not read back as the target');if(data.map(d=>d.name.replace(/[0-9]/g,'')).join()!==q.names.join())sb(w+'names on the staff');
     if(q.target.some((m,j)=>j&&m===q.target[j-1]))sb(w+'a pitch twice in a row');if(q.names.some(n=>/E♯|B♯|C♭|F♭|𝄪|𝄫/.test(n)))sb(w+'spelling '+q.names.join(' '));
     if(q.grid[0]<0||q.grid.some((x,j)=>j&&x<=q.grid[j-1]))sb(w+'grid');if(!!q.freeStart===!!COUNTED[id])sb(w+(COUNTED[id]?'should be counted in':'should be a free start'));if(q.metro>(TRIP[id]?60:80))sb(w+'tempo '+q.metro);
     if(FIRST[id]!==undefined?q.grid[0]!==FIRST[id]:q.grid[0]!==0)sb(w+'first note at '+q.grid[0]);
     if(TRIP[id]){const tr=q.grid.filter((x,j)=>Math.abs(q.grid[j+1]-x-1/3)<.01&&Math.abs(q.grid[j+2]-x-2/3)<.01&&!(j&&Math.abs(x-q.grid[j-1]-1/3)<.01));if(!tr.length||tr.some(x=>Math.abs(x%2)>1e-6))sb(w+'a triplet off beats 1 and 3: '+tr.slice(0,4).join(' '));}
     else if(!COUNTED[id]&&q.grid.some((x,j)=>x!==j/2))sb(w+'not even eighths');
     if(id==='pv0'||id==='pv'){if(q.grid.some((x,j)=>x!==Math.floor(j/5)*4+[0,.5,1,1.5,2][j%5]))sb(w+'not four eighths, a quarter and a rest a bar');}
     /* the degrees: one octave from the tonic, or every degree the position holds */
     const k=q.fig.key,rp=pc(P(k)),Pn=ROMAN.indexOf(strip(q.prompt).split('Position ')[1].split(' ')[0]),N=scPos(rp,Pn,null,true).notes,ds=q.fig.ds.slice();if(F.down)ds.reverse();
     if(ds.some((d,j)=>j&&d!==ds[j-1]+1))sb(w+'degrees not in a row');if(q.fig.form==='oct'){if(mod(N[ds[0]].m,12)!==rp||ds.length<4||ds.length>8)sb(w+'one octave of degrees from the tonic: '+ds.join(' '));}
     else{const lo=-F.span[0],hi=N.length-1-F.span[1];if(ds.at(-1)!==hi||ds[0]>lo+1)sb(w+'not every degree the position holds: '+ds.join(' ')+' of '+lo+'..'+hi);}
     /* every note: a note of the position, or a ring beside one (same string, one or two frets away, never under the nut), and a ring is never a note of the key that the position holds */
     q.fig.spots.forEach((sp,j)=>{if(sp.chr){if(sp.f<1||!N.some(x=>x.s===sp.s&&Math.abs(x.f-sp.f)<=2&&Math.abs(x.f-sp.f)>=1)||N.some(x=>x.m===sp.m))sb(w+'ring at string '+sp.s+' fret '+sp.f);}else if(!N.includes(N.find(x=>x.m===sp.m&&x.s===sp.s&&x.f===sp.f)))sb(w+'a note outside the position');if(OPEN[sp.s]+sp.f!==q.target[j])sb(w+'a spot is not its pitch');});
     if(!/pb-chr/.test(q.visual)&&q.fig.rings.length)sb(w+'rings not drawn');if((q.visual.match(/class="pb-chr"/g)||[]).length!==q.fig.rings.length)sb(w+'ring count');if(!/class="staff score"/.test(q.visual))sb(w+'no staff');
     /* grading: the line passes; one wrong note fails; counted in: the whole take a beat late fails */
     const take=(f,dt)=>({notes:q.target.map((m,i)=>({midi:f?f(m,i):m,mf:f?f(m,i):m,t:q.grid[i]*750+3000+(dt||0)})),firstAt:3000,beat:750,beatStart:3000});
     if(!micGrade(q,take()).ok)sb(w+'the perfect take fails');const wi=q.target.findIndex((m,i)=>i>2&&m+1!==q.target[i+1]&&m+1!==q.target[i-1]);if(micGrade(q,take((m,i)=>i===wi?m+1:m)).ok)sb(w+'a wrong note passes');
     if(COUNTED[id]&&micGrade(q,take(null,750)).ok)sb(w+'a take one beat late passes');if(!q.tol||q.tol.miss!==1)sb(w+'no allowance');
     if(q.explain.indexOf('(')<0||/undefined|NaN/.test(q.explain+q.prompt+q.visual.replace(/aria-label="[^"]*"/g,'')))sb(w+'explanation');}
    if([...figs].sort().join(' ')!==W[0].split(' ').sort().join(' '))sb(nm0+' generator '+(gi+1)+' figures: '+[...figs].join(' ')+' (want '+W[0]+')');if([...keys].sort().join('')!==W[2].split('').sort().join(''))sb(nm0+' generator '+(gi+1)+' keys: '+[...keys].join(' '));});});
  if(nq<700)sb('too few figure questions checked: '+nq);
  /* the option “hide the diagram” keeps the staff and gives the start; the dots' option reaches the figure levels */
  {const G0=G('scales');G0.opts=G0.opts||{};G0.opts.hideNeck=true;const q=lvOf('The bebop arpeggio').g[0]();if(!/class="staff score"/.test(q.visual)||/class="posbox"/.test(q.visual)||!/Start: /.test(q.visual)||!q.after||!/class="posbox"/.test(q.after()))sb('hide the diagram on a figure level');delete G0.opts.hideNeck;}
  /* B4: the ladder in the lessons' order; the reorder table against the old ladder by name */
  {const NEW=['The whole position, in C','The whole position: C, F and G','Eighth notes','Triplets','One octave from the root, in C','One octave from any root','Up to the 7th and back','First modes: 2 to 2, 5 to 5','Thirds, in C','Thirds: C, F and G','Triads, every position','Seventh chords, every position','The bebop arpeggio','Pivot arpeggios','Triads with leading notes and enclosures','Fourths, sixths, stacked fourths','Groups of three and four','Twelve keys in one position','Modes in every position','Melodic and harmonic minor','Minor scales: thirds, triads, seventh chords','Pentatonics and the blues scale','Triad shapes and cells'];
   const OLD=NEW.slice(0,8).concat(['Groups of three and four','Thirds, in C','Thirds: C, F and G','Fourths, sixths, stacked fourths','Triads, every position','Seventh chords, every position','Twelve keys in one position','Modes in every position','Melodic and harmonic minor','Pentatonics and the blues scale','Triad shapes and cells','Minor scales: thirds, triads, seventh chords']);
   if(LV.slice(0,23).map(l=>l.n).join('|')!==NEW.join('|'))sb('the ladder: '+LV.map(l=>l.n).join(' | '));
   const R=REORDERS33.scales,mp=L=>R.m[L]||L,img=new Set();if(R.n!==20)sb('REORDERS33 n');for(let L=1;L<=20;L++){img.add(mp(L));if(NEW[mp(L)-1]!==OLD[L-1])sb('REORDERS33: old '+L+' “'+OLD[L-1]+'” lands on “'+NEW[mp(L)-1]+'”');}
   if(img.size!==20||R.nw.some(L=>img.has(L))||R.nw.join()!=='13,14,15'||R.nw.some(L=>LVS.indexOf(NEW[L-1])<0))sb('REORDERS33 does not cover the 23 levels');
   if((OSJ.scales||[]).join()!=='23'||lvNum('scales',23)!=='23-OSJ'||lvNum('scales',19)!=='19')sb('the OSJ tag');
   if(LEVEL_NOTES.scales.length!==LV.length)sb('level notes: '+LEVEL_NOTES.scales.length);const nt=i=>JSON.stringify(LEVEL_NOTES.scales[i]);
   if(!/bebop|triplet/.test(nt(12))||!/[Pp]ivot/.test(nt(13))||!/enclosure/.test(nt(14))||!/Fourths/.test(nt(15))||!/Groups of three/.test(nt(16))||!/thirds/.test(nt(8))||!/Twelve|twelve/.test(nt(17))||!/Melodic minor and harmonic minor/.test(nt(20))||!/pentatonic/.test(nt(21))||!/3 1 3 5/.test(nt(22)))sb('a level note is not on its level');
   /* goals: A requires 1 to 20 without a gap (the levels it required by name, and the three new ones); the rest is its appendix */
   const req=k=>{const s=new Set();GOALS[k].stages.forEach(st=>st.steps.forEach(([g,a,b])=>{if(g==='scales')for(let L=a;L<=b;L++)s.add(L);}));return [...s].sort((a,b)=>a-b);},more=k=>{const s=new Set();(GOALS[k].more||[]).forEach(([g,a,b])=>{if(g==='scales')for(let L=a;L<=b;L++)s.add(L);});return [...s].sort((a,b)=>a-b);};
   if(req('A').join()!==Array.from({length:20},(_,i)=>i+1).join())sb('goal A requires '+req('A').join());if(more('A').join()!=='21,22,23')sb('goal A appendix '+more('A').join());
   const oldReqA=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(mp).concat(R.nw).sort((a,b)=>a-b);if(oldReqA.join()!==req('A').join())sb('goal A: not the levels it required before plus the three new ones');
   if(req('B').join()!=='1,2'||req('R').join()!=='1,2'||more('R').join()!==[3,4,5,6,7,8,9,10,11,12,13,14,15].map(mp).sort((a,b)=>a-b).join())sb('goals B and R: '+req('B')+' / '+req('R')+' / '+more('R'));
   if(!GOAL_WHY.A.steps['scales:9']||!GOAL_WHY.A.steps['scales:18']||GOAL_WHY.A.steps['scales:15'])sb('GOAL_WHY keys');}
  /* B5: the migration (flag r59) on made-up players: [old frontier, old skip, old open above, last] -> [frontier, skip, open above, last] */
  {const keep=JSON.stringify(STORE.games.scales||null),mp=L=>REORDERS33.scales.m[L]||L;
   const run=(lvl,skip,unl,last)=>{delete STORE.games.scales;const g=G('scales');delete g.mig.r59;g.lvl=lvl;g.skip=skip.slice();g.unl=unl.slice();g.last=last;g.hist={};g.lc={};for(let L=1;L<=lvl;L++){g.hist[L]=skip.includes(L)?[1,0]:[1,1,1,L];g.lc[L]={s:0,g:10+L};}g.opts={bpmL:{12:70,3:66}};g.items={a:{lv:12,n:3},b:{lv:9,n:1}};g.pl=[{lv:10,ok:1},{lv:19,ok:1}];g.rl=[{L:13}];g.sessions=[{L:14}];return G('scales');};
   [[10,[1,5,6,7,8,9],[11],7,9,[1,5,6,7,8],[10,17],7],[15,[],[],15,18,[13,14,15],[],13],[9,[],[],9,9,[],[17],17],[12,[],[],12,11,[],[16,17],16],[14,[9],[],14,12,[],[16,17],12],[20,[],[],20,21,[13,14,15],[22,23],13],[1,[],[],1,1,[],[],1],[11,[],[13],10,10,[],[11,17],9]].forEach(([lvl,skip,unl,last,F,sk,un,la])=>{
     const g=run(lvl,skip,unl,last),w='migration from old '+lvl+': ';if(g.lvl!==F||(g.skip||[]).join()!==sk.join()||(g.unl||[]).join()!==un.join()||g.last!==la)sb(w+'frontier '+g.lvl+' skip '+(g.skip||[]).join()+' open '+(g.unl||[]).join()+' last '+g.last+' (want '+[F,'/',sk,'/',un,'/',la].join(' ')+')');
     for(let L=1;L<=lvl;L++){if(!g.hist[mp(L)]||g.hist[mp(L)].join()!==(skip.includes(L)?[1,0]:[1,1,1,L]).join())sb(w+'the record of old '+L+' is not on '+mp(L));if(!g.lc[mp(L)]||g.lc[mp(L)].g!==10+L)sb(w+'the count of old '+L);}
     if(Object.keys(g.hist).length!==lvl)sb(w+'records lost or doubled');if(g.opts.bpmL[16]!==70||g.opts.bpmL[3]!==66||g.opts.bpmL[12]!==undefined)sb(w+'tempos');if(g.items.a.lv!==16||g.items.b.lv!==17||g.pl[0].lv!==9||g.pl[1].lv!==23||g.rl[0].L!==11||g.sessions[0].L!==12)sb(w+'items, log, points or rounds');
     if(!g.mig.r59)sb(w+'flag');const a=JSON.stringify(g);G('scales');if(JSON.stringify(STORE.games.scales)!==a)sb(w+'a second load changes it');});
   if(keep==='null')delete STORE.games.scales;else STORE.games.scales=JSON.parse(keep);G('scales');}
  console.log('scale lessons checked: phase B ('+nq+' figure questions)');}
}
/*SLB_END*/
console.log('checked',cnt,'play-converted',conv,'bad',bad,'games',GAMES.length);
if(bad)process.exit(1);
`);

