"""Sight Reading, phase C of the reading build (26 Nov 2026): one four-bar and one eight-bar question of levels 3, 6, 10, 13, 17, 18, 22 rendered at 1440×820
(headless, muted, dist/): the written page must end inside the window (nothing to scroll while playing). Screenshots to tests/out/srlen-L<level>-<bars>.png.
Run after build.py:  .venv/bin/python tests/sr_len_shots.py [level ...]"""
import pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;(root/'tests/out').mkdir(exist_ok=True)
LV=[int(a) for a in sys.argv[1:]] or [3,6,10,13,17,18,22]
bad=0
with sync_playwright() as pw:
  b=pw.chromium.launch(channel='chrome',headless=True,args=['--mute-audio']);pg=b.new_page(viewport={'width':1440,'height':820});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto((root/'dist'/'fretwise.html').as_uri());pg.evaluate('localStorage.clear()');pg.reload()
  for L in LV:
    for nb in [4,8]:
      if L<13 and nb==8:continue
      r=pg.evaluate("""([L,nb])=>{const g=G('sightread');g.opts=Object.assign({},g.opts||{},{auto:false});g.review=false;g.preview=false;g.unl=Array.from({length:40},(_,i)=>i+1);
        const lv=GBY.sightread.levels[L-1],keep=lv.g;let pick=null;for(let t=0;t<200&&!pick;t++){const gen=pickGen(keep),q=gen();if(q.sr.bars.length===nb)pick=gen;}
        lv.g=[pick];view={name:'lobby',gid:'sightread'};render();start('sightread',L);render();lv.g=keep;if(S.scanning){S.scanning=false;S.scanTok++;}render();
        const sv=[...document.querySelectorAll('svg.score')],bot=Math.max(...sv.map(x=>x.getBoundingClientRect().bottom)),top=Math.min(...sv.map(x=>x.getBoundingClientRect().top));
        return {bars:S.q.sr.bars.length,notes:S.q.target.length,bottom:Math.round(bot),top:Math.round(top),h:innerHeight,key:S.q.key.slice(0,30)};}""",[L,nb])
      pg.screenshot(path=str(root/f'tests/out/srlen-L{L}-{nb}.png'))
      ok=r['bottom']<=r['h'] and r['bars']==nb
      bad+=0 if ok else 1;print(L,nb,r,'OK' if ok else 'SCROLLS',flush=True)
      pg.evaluate("quit()")
  print('errors',errs[:3]);b.close()
print('bad',bad)
