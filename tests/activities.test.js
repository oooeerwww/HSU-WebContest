import { test } from 'node:test';
import assert from 'node:assert/strict';
import { daysLeft, filterActivities } from '../js/lib/activities.js';
import { fetchActivities } from '../js/api.js';

const today = new Date('2026-11-17T00:00:00');
const items = [
  { field: '공모전', deadline: '2026-12-01' },
  { field: '봉사', deadline: '2026-11-20' },
  { field: '공모전', deadline: '2026-11-01' },
];

test('daysLeft counts calendar days', () => assert.equal(daysLeft('2026-11-20', today), 3));
test('deadline today is 0 days left', () => assert.equal(daysLeft('2026-11-17', new Date('2026-11-17T21:30:00')), 0));
test('past deadlines are hidden and the rest sorted soonest first', () =>
  assert.deepEqual(filterActivities(items, { field: 'all', today }).map((i) => i.deadline), ['2026-11-20', '2026-12-01']));
test('field filter keeps only that field', () => assert.equal(filterActivities(items, { field: '공모전', today }).length, 1));
test('fetchActivities returns items from the response', async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ items: [{ id: 1 }] }) });
  assert.deepEqual(await fetchActivities('x', fakeFetch), [{ id: 1 }]);
});
test('fetchActivities throws on HTTP error', async () => {
  await assert.rejects(fetchActivities('x', async () => ({ ok: false, status: 500 })));
});
