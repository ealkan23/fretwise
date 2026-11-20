"""Copy the user's live store (Chrome profile copied read-only, headless, muted) to a JSON file.
Usage: .venv/bin/python tests/dump_store.py backups/<name>.json"""
import pathlib,shutil,tempfile,sys
from playwright.sync_api import sync_playwright
prof=pathlib.Path.home()/'Library/Application Support/Google/Chrome/Default'
tmp=pathlib.Path(tempfile.mkdtemp());(tmp/'Default').mkdir(parents=True)
shutil.copytree(prof/'Local Storage',tmp/'Default'/'Local Storage',ignore=shutil.ignore_patterns('LOCK'))
with sync_playwright() as pw:
    ctx=pw.chromium.launch_persistent_context(str(tmp),channel='chrome',headless=True,args=['--mute-audio']);ctx.add_init_script("try{window.__raw=localStorage.getItem('fretwise-v1');}catch(e){}");pg=ctx.new_page()
    pg.goto('https://ealkan23.github.io/fretwise/');raw=pg.evaluate('window.__raw');ctx.close()
shutil.rmtree(tmp,ignore_errors=True)
if not raw: sys.exit('no store found')
pathlib.Path(sys.argv[1]).write_text(raw);print('wrote',sys.argv[1],len(raw),'chars')
