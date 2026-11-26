// Local server for the Salon 3B app: serves this folder and keeps the furniture layout in data/layout.json.
// Start with Baslat.cmd (or `node server.js`). Listens on this computer only (127.0.0.1).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = Number(process.env.PORT) || 8137;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
// One file per flat: /api/layout -> data/layout.json (the first flat), /api/layout/<name> -> data/layout-<name>.json
const layoutFile = name => path.join(DATA_DIR, name ? 'layout-' + name + '.json' : 'layout.json');
const URL_BASE = `http://localhost:${PORT}/`;
const openBrowser = !process.argv.includes('--no-open');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json'
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Salon-App': '1' });
  res.end(body);
}

function handleLayout(req, res, name) {
  const LAYOUT = layoutFile(name);
  if (req.method === 'GET') {
    fs.readFile(LAYOUT, 'utf8', (err, text) => {
      if (err) return send(res, 404, 'no layout saved yet');
      send(res, 200, text, TYPES['.json']);
    });
    return;
  }
  if (req.method === 'PUT') {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { send(res, 413, 'too large'); req.destroy(); }
    });
    req.on('end', () => {
      let data;
      try { data = JSON.parse(body); } catch (e) { return send(res, 400, 'not JSON'); }
      if (!Array.isArray(data)) return send(res, 400, 'expected a list of furniture');
      fs.mkdirSync(DATA_DIR, { recursive: true });
      // Write to a temporary file first so a crash never leaves a half-written layout.
      const tmp = LAYOUT + '.tmp';
      fs.writeFile(tmp, JSON.stringify(data, null, 1), err => {
        if (err) return send(res, 500, 'could not save');
        fs.rename(tmp, LAYOUT, err2 => (err2 ? send(res, 500, 'could not save') : send(res, 204, '')));
      });
    });
    return;
  }
  send(res, 405, 'method not allowed');
}

function handleStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'method not allowed');
  let rel = decodeURIComponent(new URL(req.url, URL_BASE).pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep) || path.basename(file) === 'server.js') return send(res, 404, 'not found');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'not found');
    send(res, 200, req.method === 'HEAD' ? '' : buf, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, URL_BASE).pathname;
  const m = /^\/api\/layout(?:\/([a-z0-9-]{1,40}))?$/.exec(pathname);
  if (m) return handleLayout(req, res, m[1]);
  handleStatic(req, res);
});

function open() {
  if (!openBrowser) return;
  const cmd = process.platform === 'win32' ? `start "" "${URL_BASE}"` : process.platform === 'darwin' ? `open "${URL_BASE}"` : `xdg-open "${URL_BASE}"`;
  exec(cmd);
}

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Salon 3B zaten çalışıyor: ${URL_BASE}`);
    open();
    process.exit(0);
  }
  throw err;
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Salon 3B çalışıyor: ${URL_BASE}`);
  console.log('Kapatmak için bu pencereyi kapatın ya da Ctrl+C basın.');
  open();
});
