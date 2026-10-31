// Spotify Basic Pitch (Apache-2.0) as a detector for tests/replay.js. Needs `npm install` in tools/.
const path=require('path'),fs=require('fs');
const tools=path.join(__dirname,'..','..','tools','node_modules');
const tf=require(path.join(tools,'@tensorflow','tfjs'));
const bp=require(path.join(tools,'@spotify','basic-pitch'));
const MODEL=path.join(tools,'@spotify','basic-pitch','model');

/* tfjs in node has no file:// loader without tfjs-node: read model.json and its weight shards ourselves */
function loadModel(){return tf.loadGraphModel({load:async()=>{const j=JSON.parse(fs.readFileSync(path.join(MODEL,'model.json'),'utf8'));
  const specs=[],bufs=[];for(const g of j.weightsManifest){specs.push(...g.weights);for(const p of g.paths)bufs.push(fs.readFileSync(path.join(MODEL,p)));}
  const all=Buffer.concat(bufs);return {modelTopology:j.modelTopology,format:j.format,generatedBy:j.generatedBy,convertedBy:j.convertedBy,weightSpecs:specs,weightData:all.buffer.slice(all.byteOffset,all.byteOffset+all.byteLength)};}});}

/* resample to 22050 Hz with a windowed-sinc low-pass */
function resample(x,sr,to=22050){const r=to/sr,n=Math.floor(x.length*r),y=new Float32Array(n),fc=Math.min(1,r)*0.9,W=16;
  for(let i=0;i<n;i++){const c=i/r,c0=Math.floor(c);let s=0,ws=0;for(let k=c0-W;k<=c0+W;k++){if(k<0||k>=x.length)continue;const d=k-c,a=Math.PI*d*fc,sinc=d===0?1:Math.sin(a)/a,w=0.5+0.5*Math.cos(Math.PI*d/(W+1));s+=x[k]*sinc*w;ws+=sinc*w;}y[i]=ws?s/ws:0;}
  return y;}

let model=null;
/* raw model output per take is cached in tests/out/bp/, so post-processing can be tuned without re-running the network */
async function infer(x,sr,take){const f=take&&path.join(__dirname,'..','out','bp',take.id+'.json');if(f&&fs.existsSync(f))return JSON.parse(fs.readFileSync(f,'utf8'));
  model=model||loadModel();const bpi=new bp.BasicPitch(model),frames=[],onsets=[],contours=[];
  await bpi.evaluateModel(resample(x,sr),(fr,o,c)=>{frames.push(...fr);onsets.push(...o);contours.push(...c);},()=>{});
  const out={frames,onsets,contours};if(f){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(out));}return out;}
async function run(x,sr,take,opt={}){const {frames,onsets}=await infer(x,sr,take);
  const ev=bp.noteFramesToTime(bp.outputToNotesPoly(frames,onsets,opt.onset??0.5,opt.frame??0.3,opt.minLen??5,true,null,null,opt.melodia??true));
  return ev.sort((a,b)=>a.startTimeSeconds-b.startTimeSeconds||a.pitchMidi-b.pitchMidi).map(e=>({midi:e.pitchMidi,t:e.startTimeSeconds,dur:e.durationSeconds,amp:e.amplitude}));}
module.exports=run;module.exports.infer=infer;module.exports.bp=bp;
