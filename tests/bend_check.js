// Bends & vibrato grading on synthetic pitch curves: every kind must pass when played right and fail the typical mistakes.
// Run: node tests/extract.js && node tests/bend_check.js
const fs=require('fs'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'fw.js'),'utf8');
global.localStorage={getItem:()=>null,setItem(){}};global.window={};global.document={getElementById:()=>null,addEventListener(){}};global.navigator={};global.performance={now:()=>0};global.location={protocol:'file:'};global.requestAnimationFrame=()=>0;
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
eval(src.split('/* ============ VIEWS ============ */')[0]+`
/* a curve from a function of time (ms) giving cents above the fret; 60 frames a second, guitar 12 cents flat, ±4 cents jitter, one octave slip */
function curve(fn,ms,start=67){const out=[];for(let t=0;t<=ms;t+=1000/60){const c=fn(t);if(c===null)continue;out.push({t:300+t,m:start+(c-12+(rnd()*8-4))/100});}out[Math.floor(out.length/2)].m+=12;return out;}
const ramp=(a,b,t0,t1)=>t=>t<t0?a:t>t1?b:a+(b-a)*(t-t0)/(t1-t0),vib=(w,hz)=>t=>w/2*Math.sin(2*Math.PI*hz*t/1000);
const cases=[
 ['half',  'in tune',            t=>ramp(0,100,150,400)(t),2500,true],
 ['half',  'stops short (70¢)',  t=>ramp(0,70,150,400)(t),2500,false],
 ['half',  'goes sharp (140¢)',  t=>ramp(0,140,150,400)(t),2500,false],
 ['whole', 'in tune',            t=>ramp(0,200,150,500)(t),2500,true],
 ['whole', 'a half step only',   t=>ramp(0,100,150,500)(t),2500,false],
 ['whole', 'touches it, no hold',t=>t<500?ramp(0,200,150,450)(t):ramp(200,140,450,600)(t),2500,false],
 ['release','up and back',       t=>t<1500?ramp(0,200,150,500)(t):ramp(200,0,1500,1800)(t),3000,true],
 ['release','never comes back',  t=>ramp(0,200,150,500)(t),3000,false],
 ['vibrato','even, 5.5/s, 60¢',  t=>vib(60,5.5)(t),2500,true],
 ['vibrato','too narrow (10¢)',  t=>vib(10,5.5)(t),2500,false],
 ['vibrato','too wide (200¢)',   t=>vib(200,5.5)(t),2500,false],
 ['vibrato','too slow (2/s)',    t=>vib(60,2)(t),2500,false],
 ['vibrato','held too short',    t=>vib(60,5.5)(t),900,false],
 ['bendvib','bend + vibrato',    t=>t<500?ramp(0,200,150,450)(t):200+vib(50,5.5)(t),3000,true],
 ['bendvib','bend, no vibrato',  t=>ramp(0,200,150,450)(t),3000,false],
 ['prebend','pre-bend, release', t=>t<800?200:ramp(200,0,800,1100)(t),2500,true],
 ['prebend','picked unbent',     t=>t<800?ramp(0,200,0,300)(t):ramp(200,0,800,1100)(t),2500,false],
 ['curl',  'quarter tone',       t=>ramp(0,50,150,350)(t),2000,true],
 ['curl',  'a full half step',   t=>ramp(0,100,150,350)(t),2000,false]];
/* the numbers shown to the player must be right too: [kind,name] → expected width / rate / top */
const truth={'vibrato|even, 5.5/s, 60¢':{width:60,rate:5.5},'vibrato|too wide (200¢)':{width:200},'vibrato|too slow (2/s)':{rate:2,why:/slow/},'vibrato|too narrow (10¢)':{why:/narrow|No vibrato/},'bendvib|bend + vibrato':{width:50,rate:5.5},'bendvib|bend, no vibrato':{why:/no vibrato/},'half|in tune':{top:100},'whole|in tune':{top:200},'half|stops short (70¢)':{top:70},'curl|quarter tone':{top:50}};
let bad=0;for(const [kind,name,fn,ms,exp] of cases){const a=bendAnalyse(curve(fn,ms),67,kind);let okk=!!a.ok===exp;const tr=truth[kind+'|'+name]||{},errs=[];
  if(tr.width!=null&&!(Math.abs(a.width-tr.width)<=tr.width*0.1))errs.push('width '+Math.round(a.width)+' vs '+tr.width);
  if(tr.rate!=null&&!(Math.abs(a.rate-tr.rate)<=0.6))errs.push('rate '+(a.rate||0).toFixed(1)+' vs '+tr.rate);
  if(tr.top!=null&&!(Math.abs(a.top-tr.top)<=8))errs.push('top '+a.top+' vs '+tr.top);
  if(tr.why&&!tr.why.test(a.why))errs.push('advice "'+a.why+'"');
  if(errs.length){okk=false;name+=' ['+errs.join('; ')+']';}if(!okk)bad++;
  console.log((okk?'ok  ':'FAIL')+' '+kind.padEnd(8)+name.padEnd(22)+' expected '+(exp?'pass':'fail')+' → '+(a.ok?'pass':'fail')+' | '+a.why+(a.top!=null?' (top '+a.top+'¢)':'')+(a.rate!=null?' (rate '+a.rate.toFixed(1)+', width '+Math.round(a.width)+'¢)':''));}
console.log(bad?'FAILURES '+bad:'ALL '+cases.length+' PASS');process.exitCode=bad?1:0;`);
