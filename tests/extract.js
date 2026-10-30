// Extracts the app script from src/fretwise.html so node can syntax-check and sweep it.
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','src','fretwise.html'),'utf8');
const m=html.match(/<script>\n\/\* ============ MUSIC CORE[\s\S]*?<\/script>/);
if(!m)throw new Error('script block not found');
const js=m[0].replace(/^<script>\n/,'').replace(/<\/script>$/,'');
fs.writeFileSync(path.join(__dirname,'fw.js'),js);
console.log('wrote tests/fw.js',js.length);
