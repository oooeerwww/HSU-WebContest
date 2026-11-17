import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointProgress, recommendPrograms, GRADUATION_POINTS } from '../js/lib/extracurricular.js';

test('graduation requirement is 800P', () => assert.equal(GRADUATION_POINTS, 800));
test('progress sums earned points', () =>
  assert.deepEqual(pointProgress([{ points: 300 }, { points: 100 }]), { earned: 400, remaining: 400, percent: 50 }));
test('progress over 800 is capped at 100% with 0 remaining', () =>
  assert.deepEqual(pointProgress([{ points: 900 }]), { earned: 900, remaining: 0, percent: 100 }));
test('no records means nothing earned', () =>
  assert.deepEqual(pointProgress([]), { earned: 0, remaining: 800, percent: 0 }));

test('recommendations skip done and ended programs, rank by interest match then points', () => {
  const today = new Date('2026-11-17T00:00:00');
  const programs = [
    { id: 'a', points: 50, endDate: '2026-12-31', tags: ['개발'] },
    { id: 'b', points: 100, endDate: '2026-12-31', tags: [] },
    { id: 'c', points: 80, endDate: '2026-12-31', tags: ['개발', '공모전'] },
    { id: 'd', points: 200, endDate: '2026-11-01', tags: ['개발'] },
    { id: 'e', points: 70, endDate: '2026-12-31', tags: ['개발'] },
  ];
  assert.deepEqual(
    recommendPrograms(programs, [{ programId: 'e', points: 70 }], ['개발', '공모전'], today).map((p) => p.id),
    ['c', 'a', 'b'],
  );
});
test('program ending today is still recommended', () => {
  const today = new Date('2026-11-17T15:00:00');
  assert.equal(recommendPrograms([{ id: 'x', points: 10, endDate: '2026-11-17', tags: [] }], [], [], today).length, 1);
});

import { programStatus } from '../js/lib/extracurricular.js';
test('program status is upcoming before start, ongoing through end day, ended after', () => {
  const p = { startDate: '2026-12-01', endDate: '2026-12-31' };
  assert.equal(programStatus(p, new Date('2026-11-17T12:00:00')), 'upcoming');
  assert.equal(programStatus(p, new Date('2026-12-01T09:00:00')), 'ongoing');
  assert.equal(programStatus(p, new Date('2026-12-31T23:00:00')), 'ongoing');
  assert.equal(programStatus(p, new Date('2027-01-01T00:00:00')), 'ended');
});
