import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTerm, formatAffiliation } from '../js/lib/profile.js';

test('formatTerm shows year and semester', () =>
  assert.equal(formatTerm({ year: 3, semester: 2 }), '3학년 2학기'));
test('formatAffiliation joins college and department', () =>
  assert.equal(formatAffiliation({ college: 'IT공과대학', department: '컴퓨터공학부' }), 'IT공과대학 컴퓨터공학부'));
test('formatAffiliation without department shows college only', () =>
  assert.equal(formatAffiliation({ college: 'IT공과대학' }), 'IT공과대학'));
