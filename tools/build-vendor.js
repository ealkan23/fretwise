// Builds vendor/bp.js (Spotify Basic Pitch + TensorFlow.js, both Apache-2.0) and copies the model to vendor/model/.
// Run from the repo: (cd tools && npm install) && node tools/build-vendor.js
const fs=require('fs'),path=require('path'),esbuild=require('./node_modules/esbuild');
const root=path.join(__dirname,'..'),out=path.join(root,'vendor'),pkg=path.join(__dirname,'node_modules','@spotify','basic-pitch');
fs.mkdirSync(path.join(out,'model'),{recursive:true});
esbuild.buildSync({entryPoints:[path.join(__dirname,'bp-entry.js')],bundle:true,minify:true,format:'iife',outfile:path.join(out,'bp.js'),legalComments:'none',
  banner:{js:'/* Basic Pitch (c) Spotify AB, Apache-2.0, https://github.com/spotify/basic-pitch-ts · TensorFlow.js (c) Google LLC, Apache-2.0. See vendor/LICENSE. */'}});
for(const f of fs.readdirSync(path.join(pkg,'model')))fs.copyFileSync(path.join(pkg,'model',f),path.join(out,'model',f));
fs.copyFileSync(path.join(pkg,'LICENSE'),path.join(out,'LICENSE'));
console.log('vendor/bp.js',(fs.statSync(path.join(out,'bp.js')).size/1e6).toFixed(2),'MB; model',fs.readdirSync(path.join(out,'model')).join(', '));
