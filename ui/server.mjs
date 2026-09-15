import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(root, 'assets');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.png': 'image/png', '.gif': 'image/gif', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const isAsset = url.startsWith('/assets/');
    const base = isAsset ? assets : root;
    const file = path.resolve(base, isAsset ? url.slice(8) : `.${url === '/' ? '/index.html' : url}`);
    if (!file.startsWith(base + path.sep) || !types[path.extname(file)]) { res.writeHead(403).end(); return; }
    const info = await stat(file);
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    const headers = { 'Content-Type': types[path.extname(file)], 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' };
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = match?.[1] ? Number(match[1]) : 0;
      let end = match?.[2] ? Number(match[2]) : info.size - 1;
      if (match && !match[1] && match[2]) { start = Math.max(0, info.size - Number(match[2])); end = info.size - 1; }
      end = Math.min(end, info.size - 1);
      if (!match || start > end || start >= info.size) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${info.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') res.end(); else createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': info.size });
      if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
    }
  } catch { res.writeHead(404).end('Not found'); }
});
server.listen(Number(process.env.PORT) || 8188, '127.0.0.1', () => console.log(`MiniMax Flow: http://127.0.0.1:${server.address().port}`));
