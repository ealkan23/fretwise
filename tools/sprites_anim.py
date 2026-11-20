"""The animated in-game sprite of a master: art-src/<id>-game/{base,admire,cry,fedup,improve}.png (grids of poses on flat green) -> art/masters/<id>-game.webp.
base.png is a 6 x 6 grid (the idle look, 36 frames in reading order); the four emotions are 3 x 3 grids (9 frames each: from the base look to the peak and back).
Every frame is keyed, scaled and shifted so the character's feet and middle sit on the same spot in all five sheets (measured on each sheet's first frame, mic stand left out),
then laid out 9 to a row: frames 0-35 base, 36-44 admire, 45-53 cry, 54-62 fedup, 63-71 improve. A sheet drawn without the mic stand (cry) gets it from admire's first frame, behind her.
Run: .venv/bin/python tools/sprites_anim.py [id]      (default: ear)"""
import pathlib,sys
from PIL import Image
import numpy as np
root=pathlib.Path(__file__).resolve().parent.parent;ID=sys.argv[1] if len(sys.argv)>1 else 'ear';SRC=root/'art-src'/(ID+'-game');CELL=352;COLS=9
SHEETS=[('base',6),('admire',3),('cry',3),('fedup',3),('improve',3)]
def key(a):
    a=a.astype(np.float32);r,g,b=a[...,0],a[...,1],a[...,2];d=g-np.maximum(r,b)              # how much greener than anything else
    al=np.clip(1-(d-40)/70,0,1)                                                               # 40..110 of excess green fades out
    g2=np.where(d>0,np.minimum(g,np.maximum(r,b)+np.clip(40-d,0,40)*0+0),g)                   # spill: an edge pixel loses its excess green
    out=np.dstack([r,np.where(al<1,np.minimum(g,np.maximum(r,b)),g2),b,al*255]);return out.astype(np.uint8)
def cells(name,n):
    im=np.array(Image.open(SRC/(name+'.png')).convert('RGB'));H,W=im.shape[:2];ch,cw=H/n,W/n
    return [key(im[round(r*ch):round((r+1)*ch),round(c*cw):round((c+1)*cw)]) for r in range(n) for c in range(n)]
def body(c):                                                                                 # the character without the grey mic stand: saturated pixels
    rgb=c[...,:3].astype(int);sat=rgb.max(-1)-rgb.min(-1);m=(c[...,3]>128)&(sat>60);ys,xs=np.where(m);return xs.min(),xs.max()+1,ys.min(),ys.max()+1
def micOf(c):                                                                                # the mic stand: grey pixels in the right third
    rgb=c[...,:3].astype(int);sat=rgb.max(-1)-rgb.min(-1);m=(c[...,3]>40)&(sat<38);m[:,:int(c.shape[1]*0.66)]=False;o=c.copy();o[...,3]=np.where(m,o[...,3],0);return o
FEET=0.955;MIDX=0.455;HEIGHT=0.80                                                            # where the body stands in a cell, and how tall (share of the cell)
frames=[];mic=None;info={}
for name,n in SHEETS:
    cs=cells(name,n);x0,x1,y0,y1=body(cs[0]);s=HEIGHT*CELL/(y1-y0)
    if name=='cry':s=info['admire'][0]                                                        # her first crying frame is bent: keep the scale of the other 3 x 3 sheets
    ox=MIDX*CELL-(x0+x1)/2*s;oy=FEET*CELL-y1*s;info[name]=(s,ox,oy)
    def place(c,s=s,ox=ox,oy=oy):
        im=Image.fromarray(c,'RGBA');w,h=round(c.shape[1]*s),round(c.shape[0]*s);im=im.resize((w,h),Image.LANCZOS);out=Image.new('RGBA',(CELL,CELL),(0,0,0,0));out.alpha_composite(im,(0,0)) if False else out.paste(im,(round(ox),round(oy)),im);return out
    if name=='admire':mic=place(micOf(cs[0]))
    for c in cs:
        f=place(c)
        if name=='cry':b=mic.copy();b.alpha_composite(f);f=b
        frames.append(f)
    print(name,len(cs),'frames  scale %.3f  offset %d %d'%(s,ox,oy))
rows=-(-len(frames)//COLS);sheet=Image.new('RGBA',(COLS*CELL,rows*CELL),(0,0,0,0))
for i,f in enumerate(frames):sheet.paste(f,((i%COLS)*CELL,(i//COLS)*CELL))
out=root/'art'/'masters'/(ID+'-game.webp');sheet.save(out,'WEBP',quality=84,method=6);print(out.name,sheet.size,len(frames),'frames',out.stat().st_size//1024,'KB')
