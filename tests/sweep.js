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
{S.gid='tunes';const tb=m=>{bad++;console.log('TUNE TIME',m);};const chk=(q,id)=>{const g=q.grid,T=q.target;if(!q.metro||g.length!==T.length||g[0]!==0)return tb('shape '+id);for(let i=1;i<g.length;i++)if(!(g[i]>g[i-1]))return tb('grid not rising '+id);
   let t=0,j=0;const starts=[];q.tune.ns.forEach((x,i)=>{starts.push(t);t+=x.d;});if(Math.abs(t-q.tune.total)>1e-6)tb('total '+id);if(g.some(b=>!starts.some(s=>Math.abs(s-b)<1e-6)))tb('grid off the lengths '+id);
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
   for(const [id,S0] of Object.entries(SC_SCALES)){if(id==='maj')continue;const par=mod(k+S0.par,12),zz=scPos(par,P,S0.s.map(x=>mod(k+x,12))),maj=scPos(par,P);if(zz.type!==maj.type||zz.notes.some(x=>!S0.s.includes(mod(x.m-k,12)))||zz.notes.some(x=>(x.f<maj.lo||x.f>maj.hi)&&!(x.st&&zz.fam==='none'&&x.f===P-1))||new Set(zz.notes.map(x=>mod(x.m-k,12))).size!==S0.s.length)sb('derived '+id+' '+k+' '+P);
     /* 19 Nov 2026: no note of the scale is skipped inside the position (types 2 and 3 used to leave out the lowered note that falls one fret under the position; it is now a first-finger stretch) */
     if(zz.notes.some((x,i)=>i&&S0.s.indexOf(mod(x.m-k,12))!==(S0.s.indexOf(mod(zz.notes[i-1].m-k,12))+1)%S0.s.length))sb('derived skips a note '+id+' '+k+' '+P);}}
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
  const w2=q.target.slice(),kk=Math.floor(w2.length/2),dv=[1,-1,2,-2].find(d=>w2[kk]+d!==w2[kk-1]&&w2[kk]+d!==w2[kk+1]);w2[kk]+=dv;if(ok(w2)){sb(tag+' a wrong note passes');break;}
  const late=n=>{const r=mk(q.target);const idx=[];for(let k=1;k<q.target.length&&idx.length<n;k+=2)idx.push(k);idx.forEach(k=>{r.notes[k].t+=B*.45;});return micGrade(q,r).ok;};
  {const r=mk(q.target),k1=Math.min(1,q.target.length-1);r.notes[k1].t+=B;if(micGrade(q,r).ok){sb(tag+' a note a beat late passes');break;}}
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
 if(GBY.triads.levels.length!==14)sb('Triad Shapes should have 14 levels');G('triads').mode='mark';}
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
 if(GBY.arp.levels.length!==15||GBY.arp.levels[3].n!=='The whole position'||GBY.arp.levels[5].n!=='Connect the triads'||GBY.arp.levels[8].n!=='Enclosures on a triad, in C'||GBY.arp.levels[11].n!=='Bebop dominant'||GBY.arp.levels[14].n!=='Minor outlines')sb('Arpeggio Runner ladder is not the 15 levels of the review');}   /* 22 Nov 2026: level 4 inserted (REORDERS27) */
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
  if(GBY.scales.levels.length!==18||GBY.scales.levels[8].n!=='Groups of three and four'||GBY.scales.levels[11].n!=='Fourths'||GBY.scales.levels[9].n!=='Thirds, in C'||GBY.scales.levels[17].n!=='Pentatonics and the blues scale')sb('Scale Runner ladder');
  [9,10,11,12,13,14].forEach(L=>GBY.scales.levels[L-1].g.forEach((g,gi)=>{for(let i=0;i<25;i++){const q=g(),T=q.target,m=/class="rhy r(\\d)"/.exec(q.prompt),div=m?+m[1]:1;
     if(q.grid.some((x,j)=>Math.abs(x-j/div)>1e-9)){sb('L'+L+' g'+gi+': notes are not '+div+' a click');break;}
     if(!take(q,T).ok){sb('L'+L+' g'+gi+': the perfect take fails '+q.key);break;}const w=T.slice(),k2=Math.floor(T.length/2);w[k2]=[1,-1,2,-2,3].map(d=>T[k2]+d).find(x=>x!==T[k2-1]&&x!==T[k2+1]);if(take(q,w).ok){sb('L'+L+' g'+gi+': a wrong note passes');break;}}}));
  {const ks=new Set();for(let i=0;i<120;i++){const q=GBY.scales.levels[10].g[2]();ks.add(q.label.split(',')[0]+'|'+/<span>([A-G][♭♯]?) major/.exec(q.prompt)[1]);}if(['C','F','G'].some(k=>![...ks].some(x=>x.endsWith('|'+k))))sb('Scale Runner 11: the alternating thirds are not in C, F and G');}
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
  Object.entries(REORDERS27).forEach(([id,R])=>{const n=GBY[id].levels.length,img=new Set();for(let L=1;L<=R.n;L++)img.add(R.m[L]||L);if(img.size!==R.n||R.nw.some(L=>img.has(L))||img.size+R.nw.length!==n||Math.max(...img,...R.nw)!==n)sb('REORDERS27 '+id+' does not cover the '+n+' levels');});}
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
  if(GBY.modes.levels.length!==12||GBY.modes.levels[11].n!=='The dominant resolves')sb('Modes ladder');
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
 if(GBY.sing.levels.length!==15||GBY.earprog.levels.length!==24||GBY.outer.levels.length!==10)sb('level counts: sing '+GBY.sing.levels.length+' earprog '+GBY.earprog.levels.length+' outer '+GBY.outer.levels.length);
 if(GBY.sing.levels[11].n!=='Find the tonic'||GBY.earprog.levels[18].n!=='Harmonise a melody: the whole key'||GBY.outer.levels[7].n!=='Play the top')sb('a new level is not appended');
 [['sing',12,'k'],['sing',13,'k'],['sing',14,'a'],['earprog',19,'k'],['earprog',20,'a'],['earprog',21,'k'],['earprog',22,'a'],['earprog',23,'k'],['outer',8,'k'],['outer',9,'a']].forEach(([g,i,f])=>{const n=LEVEL_NOTES[g][i];if(!n||!n[f])sb('level note form '+g+' '+(i+1));});
 {const st=GOALS.B.stages[4].steps.map(x=>x.join()),mo=GOALS.B.more.map(x=>x.slice(0,3).join());if(!st.includes('sing,13,15')||!st.includes('outer,9,10'))sb('goal B stage 5 lacks the new steps');if(!mo.includes('earprog,17,24')||mo.includes('earprog,17,19'))sb('goal B appendix: earprog 17–24');
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
console.log('checked',cnt,'play-converted',conv,'bad',bad,'games',GAMES.length);
if(bad)process.exit(1);
`);
