// 의존성 없는 정적 서버. ES 모듈은 file:// 로 열 수 없어서 필요하다.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 5173;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/** 요청 URL → { status, file }. 잘못된 인코딩은 400, 루트 밖은 403. */
export function resolveRequestPath(url, root) {
  let path;
  try {
    path = decodeURIComponent(new URL(url, 'http://x').pathname);
  } catch {
    return { status: 400 };
  }
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(root, path));
  if (file !== root && !file.startsWith(root + sep)) return { status: 403 };
  return { status: 200, file };
}

const TEXT = { 'Content-Type': 'text/plain; charset=utf-8' };

async function handle(req, res) {
  const { status, file } = resolveRequestPath(req.url, ROOT);
  if (status === 400) return res.writeHead(400, TEXT).end('Bad request');
  if (status === 403) return res.writeHead(403, TEXT).end('Forbidden');
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, TEXT).end('Not found');
  }
}

// `node scripts/serve.mjs` 로 직접 실행할 때만 서버를 띄운다 (테스트에서 import 할 때는 X).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createServer(handle).listen(PORT, () => console.log(`e-Advisor: http://localhost:${PORT}`));
}
