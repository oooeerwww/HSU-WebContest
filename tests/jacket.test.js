import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getJacket } from '../js/lib/jacket.js';

const jackets = {
  default: { body: '#0B2F6B', accent: '#A9C4E8', text: '#fff' },
  byDepartment: { '디자인학부': { body: '#7A1F3D', accent: '#F2C6D3', text: '#fff' } },
};

test('registered department gets its jacket color', () =>
  assert.equal(getJacket({ department: '디자인학부', year: 2 }, jackets).body, '#7A1F3D'));
test('unknown department falls back to default navy', () =>
  assert.equal(getJacket({ department: '없는학부', year: 1 }, jackets).body, '#0B2F6B'));
test('year badge shows the student year', () =>
  assert.equal(getJacket({ department: '디자인학부', year: 2 }, jackets).yearBadge, '2'));
test('label is HSU', () =>
  assert.equal(getJacket({ department: '디자인학부', year: 2 }, jackets).label, 'HSU'));
