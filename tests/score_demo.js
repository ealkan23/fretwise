(()=>{const L={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
/* n('F#4',1) = written F♯4 for a quarter (sounds an octave lower); r(1) = rest */
const n=(s,d,x)=>{const mm=s.match(/^([A-G])([#b]?)(\d)$/);const m=12*(+mm[3]+1)+L[mm[1]]+(mm[2]==='#'?1:mm[2]==='b'?-1:0)-12;
  const w=writtenOf(m,mm[2]==='b'?-1:1);return Object.assign({m,d,w},x||{});},r=(d,x)=>Object.assign({rest:1,d},x||{});
const T=id=>[(a,b)=>n(a,b,{tup:id}),d=>r(d,{tup:id})];
const ex=[];const add=(title,line,o)=>ex.push({title,line,o:o||{}});
add('1. Quarters, halves, eighths (4/4, C)',{meter:'4/4',notes:[n('E4',1),n('G4',1),n('A4',.5),n('B4',.5),n('C5',1),n('D5',2),n('B4',1),n('G4',1)]});
add('2. Rests, a tie over the beat, a tie over the bar line, a tie into the beat',{meter:'4/4',notes:[r(1),n('G4',1),n('A4',2),n('F4',1.5),n('E4',.5),n('D4',3,{}),n('C4',1),n('E4',.5),n('F4',1.5),n('G4',1),r(.5),n('A4',.5),n('G4',2)]});
add('3. Bar memory in C: F♯, then F natural in the same bar (♮); B♭ held through the bar',{meter:'4/4',notes:[n('E4',1),n('F#4',1),n('G4',1),n('F4',1),n('Bb4',1),n('A4',1),n('Bb4',1),n('C5',1)]});
add('4. Key of G: F natural needs ♮, the next F in the bar does not; the next bar returns to F♯ with no sign',{meter:'4/4',ks:1,notes:[n('G4',1),n('F4',1),n('E4',1),n('F4',1),n('F#4',1),n('G4',1),n('A4',2)]});
const [a1,b1]=T(1),[a2,b2]=T(2),[a3,b3]=T(3),[a4,b4]=T(4),[a5,b5]=T(5);
add('5. Eighth-note triplets, a broken triplet (rest inside), quarter-note triplets',{meter:'4/4',notes:[a1('C5',1/3),a1('D5',1/3),a1('E5',1/3),n('F5',1),a2('E5',1/3),b2(1/3),a2('C5',1/3),n('A4',1),a3('G4',2/3),a3('A4',2/3),a3('B4',2/3),n('C5',2)]});
add('6. Sixteenths: four, eighth + two, two + eighth, dotted eighth + sixteenth, s e s; sixteenth triplets',{meter:'4/4',notes:[n('C5',.25),n('D5',.25),n('E5',.25),n('F5',.25),n('G5',.5),n('F5',.25),n('E5',.25),n('D5',.25),n('C5',.25),n('B4',.5),n('A4',.75),n('B4',.25),
  n('C5',.25),n('D5',.5),n('E5',.25),a4('F5',1/6),a4('E5',1/6),a4('D5',1/6),a5('C5',1/6),a5('B4',1/6),a5('A4',1/6),n('G4',2)]});
add('7. 3/4: the dotted half, a dotted quarter, ties',{meter:'3/4',notes:[n('G4',3),n('A4',1.5),n('B4',.5),n('C5',1),n('D5',2),n('B4',1),n('G4',3)]});
add('8. 6/8: two beats a bar, dotted quarters, q e, e e e, a dotted half',{meter:'6/8',notes:[n('E4',1.5),n('G4',1),n('A4',.5),n('B4',.5),n('C5',.5),n('D5',.5),n('E5',1.5),n('D5',3),r(1.5),n('C5',.5),n('B4',.5),n('A4',.5)]});
add('9. 12/8, cut time, 2/4: changes of meter between bars',{meters:['12/8','C|','2/4','3/4'],notes:[n('D4',1.5),n('F#4',.5),n('A4',.5),n('B4',.5),n('C5',1.5),n('B4',1),n('A4',.5),
  n('G4',1),n('A4',2),n('B4',1),n('C5',.5),n('D5',.5),n('E5',1),n('D5',1),n('C5',2)]});
add('10. Ledger lines below and above (as written for guitar)',{meter:'4/4',notes:[n('E3',1),n('F3',1),n('A3',1),n('C4',1),n('A5',1),n('C6',1),n('E6',1),n('G6',1)]});
add('11. Four flats and four sharps',{meter:'4/4',ks:-4,notes:[n('Ab4',1),n('Bb4',1),n('C5',1),n('Db5',1),n('Eb5',2),n('D5',1),n('Eb5',1)]});
add('',{meter:'4/4',ks:4,notes:[n('E4',1),n('F#4',1),n('G#4',1),n('A4',1),n('B4',1),n('G4',1),n('G#4',2)]});
/* a page: 12 bars, chords, swing, repeats with two endings, segno, coda, D.S., a tie over a line break */
const pg=[];const melody=['G4','A4','B4','D5','E5','D5','B4','G4','A4','C5','E5','G5','F#5','D5','C5','A4'];let i=0;
for(let b=0;b<12;b++){if(b===3){pg.push(n('A4',1),n('B4',1),n('C5',2,{}));continue;}if(b===4){pg.push(n('B4',4));continue;}if(b===11){pg.push(n('G4',4));continue;}
  if(b===7){pg.push(n('E4',.5),n('F#4',.5),n('G4',.5),n('A4',.5),n('B4',1),n('D5',2.5));continue;}if(b===8){pg.push(n('B4',.5),n('A4',1),n('G4',1));continue;}
  pg.push(n(melody[i++%16],1.5),n(melody[i++%16],.5),n(melody[i++%16],1),r(.5),n(melody[i++%16],.5));}
const pg2=[];pg.forEach((x,k)=>{if(k&&pg2.length&&x.d===2.5){pg2.push(Object.assign({},x,{d:1.5}));pg2.push(Object.assign({},x,{d:1}));}else pg2.push(x);});
add('12. A page: chord symbols, swing, repeat with 1st and 2nd endings, segno, To Coda, D.S. al Coda, coda, bar numbers, a note tied over the line break',
 {meter:'4/4',ks:1,swing:1,notes:pg,chords:['GMaj7','Am7 D7','Bm7 E7','Am7 D7','GMaj7','Cm7 F7','Bm7 E7','Am7 D7','GMaj7','E7','Am7 D7','G6'].flatMap((c,b)=>c.split(' ').map((s,j)=>({t:b*4+j*2,sym:s.replace('b','♭')}))),
  signs:{0:[{k:'rs'}],2:[{k:'v1'}],3:[{k:'re'},{k:'v2'}],4:[{k:'segno'}],6:[{k:'toCoda'}],7:[{k:'txt',txt:'D.S. al Coda'}],8:[{k:'coda'}]}},{title:'Reading piece'});
add('13. Feedback: right notes green, a wrong note red, a missed note orange; bars shaded right or wrong',{meter:'4/4',notes:[n('C5',1),n('B4',1),n('A4',1),n('G4',1),n('F4',1),n('E4',1),n('D4',2)]},{mark:{0:'ok',1:'ok',2:'ok',3:'ok',4:'bad',5:'ok',6:'miss'},barOk:[true,false]});
let h='<div style="background:#222;padding:20px;display:grid;gap:18px">',bad=[];
ex.forEach(x=>{const bars=scoreBars(x.line),c=scoreCheck(bars,x.line.meter);if(c.length)bad.push(x.title+': '+c.join('; '));h+=`<div><div style="color:#eee;font:14px sans-serif;margin-bottom:4px">${x.title}</div>${scoreSVG(bars,Object.assign({ks:x.line.ks||0,swing:x.line.swing},x.o))}</div>`;});
document.body.innerHTML=h+'</div>';document.body.style.background='#222';
return {bad,data:scoreData(scoreBars(ex[1].line)),acc:scoreBars(ex[3].line).map(b=>b.ev.map(e=>wName(e.w)+':'+e.acc).join(' '))};})()
