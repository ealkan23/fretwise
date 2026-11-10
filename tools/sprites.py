"""art-src/<id>.png (2 columns x 3 rows of poses on flat green) -> art/masters/<id>.png: six 128 px frames in a row
(idle, cheer, wince, talk, angry, amazed), green keyed out, one common crop per character so the feet share a baseline.
Run: .venv/bin/python tools/sprites.py"""
import pathlib
from PIL import Image
import numpy as np
root=pathlib.Path(__file__).resolve().parent.parent;F=128
def key(a):
    r,g,b=a[...,0].astype(int),a[...,1].astype(int),a[...,2].astype(int)
    green=(g>150)&(g-r>70)&(g-b>70)
    out=np.dstack([a[...,:3],np.where(green,0,255).astype(np.uint8)])
    # spill: greenish fringe pixels next to the key lose their excess green
    fr=(~green)&(g>r+25)&(g>b+25);out[...,1]=np.where(fr,np.maximum(r,b),out[...,1]).astype(np.uint8)
    return out
for src in sorted((root/'art-src').glob('*.png')):
    a=key(np.array(Image.open(src).convert('RGB')));H,W=a.shape[:2];ch,cw=H//3,W//2
    cells=[a[r*ch:(r+1)*ch,c*cw:(c+1)*cw].copy() for r in range(3) for c in range(2)]
    if src.stem=='theory':   # his own piano goes: he stands at the castle's
        for c in cells:c[198:,297:,3]=0
    al=np.max([c[...,3] for c in cells],axis=0);ys,xs=np.where(al>0);x0,x1,y0,y1=xs.min(),xs.max()+1,ys.min(),ys.max()+1
    side=max(x1-x0,y1-y0)+8;cx=(x0+x1)//2;L=max(0,min(cw-side,cx-side//2));T=max(0,y1+4-side)
    sheet=Image.new('RGBA',(F*6,F))
    for i,c in enumerate(cells):
        im=Image.fromarray(c[T:T+side,L:L+side]).resize((F,F),Image.BOX);p=np.array(im);p[...,3]=np.where(p[...,3]>127,255,0);p[p[...,3]==0]=0
        sheet.paste(Image.fromarray(p),(i*F,0))
    q=sheet.convert('RGB').quantize(31,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB');o=np.array(q);o=np.dstack([o,np.array(sheet)[...,3]])
    Image.fromarray(o).save(root/'art'/'masters'/src.name,optimize=True);print(src.stem,'crop',side,'->',(root/'art'/'masters'/src.name).stat().st_size,'bytes')
