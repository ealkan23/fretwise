"""YouTube captions (json3, fetched by yt-dlp into videos/<channel>/) -> plain text with a timestamp every ~30 s: videos/<channel>/<id>.txt
Run: .venv/bin/python tools/captions.py videos/marbin"""
import json,sys,pathlib,re
d=pathlib.Path(sys.argv[1])
for f in sorted(d.glob('*.json3')):
    vid=f.name.split('.')[0];out=d/(vid+'.txt')
    if out.exists() and out.stat().st_size>200:continue
    ev=json.load(open(f)).get('events',[]);words=[]
    for e in ev:
        t=e.get('tStartMs',0)
        for s in e.get('segs',[]) or []:
            w=s.get('utf8','')
            if w.strip():words.append((t+s.get('tOffsetMs',0),w.strip()))
    lines=[];cur=[];t0=None
    for t,w in words:
        if t0 is None:t0=t
        cur.append(w)
        if t-t0>=30000:lines.append((t0,' '.join(cur)));cur=[];t0=None
    if cur:lines.append((t0,' '.join(cur)))
    txt='\n'.join('[%d:%02d] %s'%(t//60000,t//1000%60,re.sub(r'\s+',' ',l)) for t,l in lines)
    out.write_text(txt);print(vid,len(words),'words',len(lines),'blocks')
