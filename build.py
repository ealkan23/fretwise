#!/usr/bin/env python3
"""Build dist/fretwise.html: the single offline file with the piano samples embedded as data URIs.
src/fretwise.html is the editable source; it loads piano/*.mp3 by path and works when served over http
(python3 -m http.server) or published as an artifact with the piano/ files alongside."""
import base64, json, os, glob, pathlib
root = pathlib.Path(__file__).parent
src = (root / 'src' / 'fretwise.html').read_text()
data = {}
for f in sorted(glob.glob(str(root / 'piano' / '*.mp3'))):
    data[os.path.basename(f)[:-4]] = 'data:audio/mpeg;base64,' + base64.b64encode(open(f, 'rb').read()).decode()
# Basic Pitch (note detection) inline too: file:// pages cannot fetch vendor/ files
vend = root / 'vendor'
mj = json.loads((vend / 'model' / 'model.json').read_text())
binb = b''.join((vend / 'model' / p).read_bytes() for g in mj['weightsManifest'] for p in g['paths'])
bp = ('<script>' + (vend / 'bp.js').read_text().replace('</script', '<\\/script') + '</script>\n'
      '<script>window.FW_BP_MODEL=' + json.dumps({'json': mj, 'bin': base64.b64encode(binb).decode()}, separators=(',', ':')) + ';</script>\n')
# the castle background image, inline too
art = {os.path.basename(f)[:-5]: 'data:image/webp;base64,' + base64.b64encode(open(f, 'rb').read()).decode() for f in sorted(glob.glob(str(root / 'art' / '*.webp')))}
bp += '<script>window.ART_DATA=' + json.dumps(art, separators=(',', ':')) + ';</script>\n'
blk = (bp + '<script>/* Salamander grand piano samples (MIT, tonejs-instruments), embedded so the file also works offline */\n'
       'window.PIANO_DATA=' + json.dumps(data, separators=(',', ':')) + ';</script>\n<script>\n/* ============ MUSIC CORE ============ */')
anchor = '<script>\n/* ============ MUSIC CORE ============ */'
assert src.count(anchor) == 1
out = src.replace(anchor, blk)
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist' / 'fretwise.html').write_text(out)
print('dist/fretwise.html', round(len(out) / 1e6, 2), 'MB,', len(data), 'samples')
