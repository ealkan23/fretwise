"""Visual smoke test: serves src/ over http, opens the app in headless Chromium with a fake mic,
walks a few games and writes screenshots to tests/out/. Run: python3 tests/screens.py"""
from playwright.sync_api import sync_playwright
import pathlib,subprocess,time,os
root=pathlib.Path(__file__).resolve().parent.parent;out=root/'tests'/'out';out.mkdir(exist_ok=True)
site=root/'tests'/'site';site.mkdir(exist_ok=True)
html=(root/'src'/'fretwise.html').read_text()
(site/'index.html').write_text('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
if not (site/'piano').exists(): os.symlink(root/'piano',site/'piano')
srv=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd=site,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(0.6)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',args=['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required'])
    ctx=b.new_context(viewport={'width':1000,'height':900},permissions=['microphone']);pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://127.0.0.1:8765/');pg.wait_for_timeout(800);pg.screenshot(path=str(out/'home.png'),full_page=True)
    for gid,lvl in [('fretboard',5),('drop2',4),('pulse',3),('analysis',4),('cr',2)]:
        pg.evaluate(f"G('{gid}').lvl={lvl};view={{name:'lobby',gid:'{gid}',sel:{lvl}}};render()");pg.wait_for_timeout(200);pg.screenshot(path=str(out/f'{gid}_lobby.png'),full_page=True)
        pg.click('[data-act=start]');pg.wait_for_timeout(1200);pg.screenshot(path=str(out/f'{gid}_play.png'),full_page=True)
    print('page errors:',errs);b.close()
finally: srv.terminate()
