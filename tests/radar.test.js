import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radarPoints } from '../js/lib/radar.js';

const near = (a, b) => Math.abs(a - b) < 1e-9;

test('first axis points straight up at full value', () => {
  const p = radarPoints([100, 0, 0, 0, 0], 100, 0, 0);
  assert.ok(near(p[0].x, 0) && near(p[0].y, -100));
});
test('zero values sit at the center', () => {
  const p = radarPoints([0, 0, 0, 0, 0], 100, 50, 60);
  assert.ok(p.every((pt) => near(pt.x, 50) && near(pt.y, 60)));
});
test('second axis goes clockwise (to the right)', () => {
  const p = radarPoints([0, 100, 0, 0, 0], 100, 0, 0);
  assert.ok(p[1].x > 0);
});
