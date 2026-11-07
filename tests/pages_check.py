"""Render every page, every lobby and every stats page on the user's real data (Chrome store copied read-only; blank store if absent).
Fails on any page error, NaN or undefined in the markup. Run before publishing: .venv/bin/python tests/pages_check.py"""
import pathlib,shutil,tempfile,subprocess,time,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parent.parent
prof=pathlib.Path.home()/'Library/Application Support/Google/Chrome/Default'
raw=None
if (prof/'Local Storage').exists():
    tmp=pathlib.Path(tempfile.mkdtemp());(tmp/'Default').mkdir(parents=True)
    shutil.copytree(prof/'Local Storage',tmp/'Default'/'Local Storage',ignore=shutil.ignore_patterns('LOCK'))
    with sync_playwright() as pw:
        ctx=pw.chromium.launch_persistent_context(str(tmp),channel='chrome',headless=True);ctx.add_init_script("try{window.__raw=localStorage.getItem('fretwise-v1');}catch(e){}");pg=ctx.new_page()
        pg.goto('https://ealkan23.github.io/fretwise/');raw=pg.evaluate('window.__raw');ctx.close()
    shutil.rmtree(tmp,ignore_errors=True)
print('store:','user data (%d chars)'%len(raw) if raw else 'blank')
srv=subprocess.Popen(['python3','-m','http.server','8793'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
bad=[]
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome');pg=b.new_page(viewport={'width':1100,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8793/src/fretwise.html')
    if raw:pg.evaluate("r=>localStorage.setItem('fretwise-v1',r)",raw);pg.reload()
    pg.wait_for_timeout(1200)
    R=lambda js:pg.evaluate("(()=>{try{%s;render();const h=document.getElementById('app').innerHTML.replace(/data-[a-z]+=\"[^\"]*\"/g,'');return /\\bundefined\\b|\\bNaN\\b/.test(h)?'NaN/undefined in markup':'ok'}catch(e){return e.stack.split('\\n').slice(0,2).join(' ')}})()"%js)
    for v in ['home','path','tree','overview','reference','tuner','rec','fixlist']:
        r=R("view={name:'%s'}"%v)
        if r!='ok':bad.append((v,r))
    for x in pg.evaluate("GAMES.map(x=>x.id)"):
        for v in ['lobby','stats']:
            r=R("view={name:'%s',gid:'%s'}"%(v,x))
            if r!='ok':bad.append((v,x,r))
    bad+=[('pageerror',e) for e in errs]
    b.close()
finally: srv.terminate()
for x in bad:print('BAD',x)
print('pages checked: %s'%('all ok' if not bad else '%d problems'%len(bad)));sys.exit(1 if bad else 0)
