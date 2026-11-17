import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, resolve } from 'node:path';
import { resolveRequestPath } from '../scripts/serve.mjs';

const ROOT = resolve('/srv/app');

test('malformed percent-encoding is a 400, not a crash', () =>
  assert.equal(resolveRequestPath('/%E0', ROOT).status, 400));
test('root path serves index.html', () =>
  assert.deepEqual(resolveRequestPath('/', ROOT), { status: 200, file: join(ROOT, 'index.html') }));
test('encoded traversal outside root is forbidden', () =>
  assert.equal(resolveRequestPath('/..%2F..%2Fetc%2Fpasswd', ROOT).status, 403));
