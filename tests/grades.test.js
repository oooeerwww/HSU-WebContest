import { test } from 'node:test';
import assert from 'node:assert/strict';
import { semesterGpa, cumulativeGpa, earnedCredits, GRADE_POINTS, GRADUATION_CREDITS } from '../js/lib/grades.js';

test('grade scale is 4.5', () => {
  assert.equal(GRADE_POINTS['A+'], 4.5);
  assert.equal(GRADE_POINTS['D0'], 1.0);
  assert.equal(GRADE_POINTS['F'], 0);
  assert.equal(GRADUATION_CREDITS, 130);
});
test('semester GPA is credit weighted', () =>
  assert.equal(semesterGpa([{ credits: 3, grade: 'A+' }, { credits: 3, grade: 'B0' }]), 3.75));
test('P/NP only semester has no GPA', () => assert.equal(semesterGpa([{ credits: 1, grade: 'P' }]), null));
test('empty semester has no GPA', () => assert.equal(semesterGpa([]), null));
test('cumulative GPA weights across semesters', () =>
  assert.equal(cumulativeGpa([{ courses: [{ credits: 3, grade: 'A0' }] }, { courses: [{ credits: 1, grade: 'C0' }] }]), 3.5));
test('cumulative GPA with no graded courses is null', () => assert.equal(cumulativeGpa([]), null));
test('earned credits exclude F and NP', () =>
  assert.equal(earnedCredits([{ courses: [{ credits: 3, grade: 'F' }, { credits: 2, grade: 'P' }, { credits: 1, grade: 'NP' }, { credits: 3, grade: 'B+' }] }]), 5));
