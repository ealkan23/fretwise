"""The test copy of Fretwise: the working tree served at http://localhost:8777/ so a change can be tried before it is committed and published.
- The page is src/fretwise.html read fresh on every load (edit, reload, see it), with piano/, vendor/ and art/ beside it as on the live site.
- It is another origin than the live site, so it has its own saved progress: nothing done here can touch the real one.
- On the first visit (and after “Reset”) it starts from a copy of the live progress, read from Chrome's profile (read-only) into .preview/seed.json.
- A band at the bottom says TEST. The microphone works (localhost counts as a secure page).
Run:  .venv/bin/python tools/preview.py        (Ctrl-C stops it)"""
import http.server,socketserver,pathlib,subprocess,sys,json,urllib.parse,mimetypes
ROOT=pathlib.Path(__file__).resolve().parent.parent;PORT=8777;PRE=ROOT/'.preview';PRE.mkdir(exist_ok=True);SEED=PRE/'seed.json'
def dump():
    try:
        r=subprocess.run([str(ROOT/'.venv/bin/python'),str(ROOT/'tests/dump_store.py'),str(SEED)],capture_output=True,text=True,timeout=90);print('  seed:',(r.stdout or r.stderr).strip().splitlines()[-1] if (r.stdout or r.stderr).strip() else r.returncode);return SEED.exists()
    except Exception as e:print('  seed failed:',e);return False
INJECT="""<script>/* TEST COPY (tools/preview.py): start from a copy of the live progress; never the live site's own storage */
(function(){var K='fretwise-v1',q=new URLSearchParams(location.search),reset=q.has('reset');
 if(reset||!localStorage.getItem(K)){try{var x=new XMLHttpRequest();x.open('GET','/seed.json'+(reset?'?fresh=1':''),false);x.send();if(x.status===200&&x.responseText.length>50){localStorage.setItem(K,x.responseText);}else if(reset){localStorage.removeItem(K);}}catch(e){}
  if(reset){location.replace('/');return;}}
 addEventListener('DOMContentLoaded',function(){var d=document.createElement('div');d.id='testband';d.innerHTML='<b>TEST COPY</b> · not the live site · your real progress is not touched · <a href="/?reset=1">Reset to my live progress</a>';
  d.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#f2c230;color:#17131f;font:600 12.5px/1 system-ui,sans-serif;padding:7px 12px;text-align:center';d.querySelector('a').style.cssText='color:#17131f';document.body.appendChild(d);document.title='TEST · '+document.title;});})();
</script>
"""
ANCHOR='<script>\n/* ============ MUSIC CORE ============ */'
class H(http.server.BaseHTTPRequestHandler):
    def log_message(self,*a):pass
    def send(self,code,body,ctype):
        self.send_response(code);self.send_header('Content-Type',ctype);self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(body)
    def do_GET(self):
        u=urllib.parse.urlparse(self.path);p=urllib.parse.unquote(u.path)
        if p in('/','/index.html'):
            s=(ROOT/'src/fretwise.html').read_text(encoding='utf-8')
            if s.count(ANCHOR)!=1:return self.send(500,b'the app script was not found in src/fretwise.html','text/plain')
            return self.send(200,s.replace(ANCHOR,INJECT+ANCHOR).encode('utf-8'),'text/html; charset=utf-8')
        if p=='/seed.json':
            if 'fresh' in u.query or not SEED.exists():dump()
            return self.send(200,SEED.read_bytes(),'application/json') if SEED.exists() else self.send(404,b'{}','application/json')
        f=(ROOT/p.lstrip('/')).resolve()
        if ROOT not in f.parents or not f.is_file() or f.parts[len(ROOT.parts)] not in('piano','vendor','art'):return self.send(404,b'not found','text/plain')
        return self.send(200,f.read_bytes(),mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
class S(socketserver.ThreadingMixIn,http.server.HTTPServer):daemon_threads=True;allow_reuse_address=True
if __name__=='__main__':
    print('Fretwise test copy');dump()
    try:srv=S(('127.0.0.1',PORT),H)
    except OSError:sys.exit('port %d is in use: the test copy is probably running already → http://localhost:%d/'%(PORT,PORT))
    print('  open  http://localhost:%d/   (Ctrl-C stops it)'%PORT,flush=True)
    try:srv.serve_forever()
    except KeyboardInterrupt:print('\nstopped')
