"""YouTube Notes of a game (27 Nov 2026; adapted from arp_notes_shots.py): render the page headless and muted at 1440 and 1000 px wide, full page (tests/out/arp-notes-<width>.png)
and chapter by chapter (tests/out/arp-notes-<width>-ch<nn>.png), and report: figure errors, figures wider than their frame, rows of diagrams that wrapped.
Also every figure on its own (tests/out/ytg-<gid>-<width>-figs<k>.png: contact sheets of six) to look at each one.
Usage: .venv/bin/python tests/ytg_shots.py [gameId]"""
import subprocess,time,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent;gid=sys.argv[1] if len(sys.argv)>1 else 'scales';tag='ytg-'+gid
srv=subprocess.Popen(['python3','-m','http.server','8799'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',headless=True,args=['--mute-audio'])
    for W in (1440,1000):
      pg=b.new_page(viewport={'width':W,'height':1000});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
      pg.goto('http://localhost:8799/src/fretwise.html');pg.wait_for_timeout(1200)
      pg.evaluate("gid=>{view={name:'ytgame',gid};render();}",gid);pg.wait_for_timeout(600)
      pg.evaluate("()=>{document.querySelectorAll('body *').forEach(e=>{const p=getComputedStyle(e).position;if((p==='fixed'||p==='sticky')&&!e.closest('.notespage'))e.style.display='none';});}")   # the sticky header would lie over the chapter shots
      r=pg.evaluate("""()=>{const out={err:NF.err.slice(),nfErr:document.querySelectorAll('.nf-err').length,secs:document.querySelectorAll('.nsec').length,wide:[],wrap:[],over:[]};
        document.querySelectorAll('.nsec').forEach((sec,i)=>{sec.querySelectorAll('.nfin').forEach((f,j)=>{if(f.scrollWidth>f.clientWidth+1)out.wide.push('ch'+(i+1)+' fig'+(j+1)+' '+f.scrollWidth+'>'+f.clientWidth);
            f.querySelectorAll('.nfrow.nfpair').forEach(row=>{const ys=[...row.children].map(c=>Math.round(c.getBoundingClientRect().top));if(new Set(ys).size>1)out.wrap.push('ch'+(i+1)+' fig'+(j+1));});
            f.querySelectorAll('svg.nfneck').forEach(sv=>{const t=sv.querySelector('.nn-title');if(t){const a=t.getBBox(),vb=sv.viewBox.baseVal;if(a.x<0||a.x+a.width>vb.width)out.over.push('ch'+(i+1)+' title cut: '+t.textContent);}});
            f.querySelectorAll('svg.nfstaff').forEach(sv=>{const vb=sv.viewBox.baseVal;sv.querySelectorAll('text.ns-up').forEach(t=>{const a=t.getBBox();if(a.x+a.width>vb.x+vb.width||a.y<vb.y)out.over.push('ch'+(i+1)+' symbol cut: '+t.textContent);});
              const ups=[...sv.querySelectorAll('text.ns-up')].map(t=>t.getBBox());ups.forEach((a,k)=>{if(k&&ups[k-1].x+ups[k-1].width>a.x-2)out.over.push('ch'+(i+1)+' chord symbols overlap');});});});});return out;}""")
      print(W,r,'page errors',errs[:3])
      pg.screenshot(path=str(root/f'tests/out/{tag}-{W}.png'),full_page=True)
      n=r['secs']
      for i in range(n):pg.locator(f'#ns-{i}').screenshot(path=str(root/f'tests/out/{tag}-{W}-ch{i+1:02d}.png'))
      from PIL import Image,ImageDraw
      figs=pg.locator('.nsec figure.nfig');k=figs.count();ims=[]
      for j in range(k):
        f=figs.nth(j);lab=pg.evaluate("e=>{const s=e.closest('.nsec');return (+s.id.slice(3)+1)+'.'+([...s.querySelectorAll('figure.nfig')].indexOf(e)+1)}",f.element_handle())
        pth=root/f'tests/out/_ytgfig.png';f.screenshot(path=str(pth));im=Image.open(pth).convert('RGB');d=ImageDraw.Draw(im);d.rectangle([0,0,60,18],fill=(255,0,0));d.text((4,3),lab,fill=(255,255,255));ims.append(im)
      for g in range(0,len(ims),6):
        grp=ims[g:g+6];cw=max(i.width for i in grp);H=sum(i.height+8 for i in grp);sheet=Image.new('RGB',(cw,H),(40,40,40));y=0
        for i in grp:sheet.paste(i,(0,y));y+=i.height+8
        sheet.save(root/f'tests/out/{tag}-{W}-figs{g//6+1:02d}.png')
      print(W,'figures',k)
      pg.close()
    b.close()
finally:srv.terminate()
