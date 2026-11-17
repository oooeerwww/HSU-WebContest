import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPETENCIES, COMPETENCY_LABELS, scoreFromGrades, isSurveyComplete, scoreFromSurvey, combineScores, recommendTracks,
} from '../js/lib/competency.js';

const gp = { 'A+': 4.5, B0: 3.0 };

test('five fixed competencies with Korean labels', () => {
  assert.deepEqual(COMPETENCIES, ['creativity', 'thinking', 'technical', 'communication', 'analysis']);
  assert.equal(COMPETENCY_LABELS.thinking, '사고력');
});
test('grade scores weight grade, mapping weight, and credits; unmapped courses ignored', () => {
  const sem = [{ courses: [
    { code: 'A', credits: 3, grade: 'A+' }, { code: 'B', credits: 3, grade: 'B0' }, { code: 'Z', credits: 3, grade: 'A+' },
  ] }];
  const g = scoreFromGrades(sem, { A: { creativity: 1 }, B: { creativity: 1, thinking: 1 } }, gp);
  assert.equal(g.creativity, 79);
  assert.equal(g.thinking, 57);
  assert.equal(g.analysis, 0);
});
test('P/NP courses do not count toward grade scores', () => {
  const g = scoreFromGrades([{ courses: [{ code: 'A', credits: 1, grade: 'P' }] }], { A: { creativity: 1 } }, gp);
  assert.equal(g.creativity, 0);
});

const qs = [{ id: 'q1', competency: 'creativity' }, { id: 'q2', competency: 'creativity' }];
test('survey with a missing answer is incomplete', () => assert.equal(isSurveyComplete({ q1: 5 }, qs), false));
test('survey with every answer is complete', () => assert.equal(isSurveyComplete({ q1: 5, q2: 1 }, qs), true));
test('survey score maps 1..5 average to 0..100', () => assert.equal(scoreFromSurvey({ q1: 5, q2: 3 }, qs).creativity, 75));
test('combined score weights grades 60%', () => assert.equal(combineScores({ creativity: 100 }, { creativity: 50 }).creativity, 80));

test('closest track profile ranks first with match 100', () => {
  const base = { thinking: 50, technical: 50, communication: 50, analysis: 50 };
  const tracks = [
    { id: 't2', name: 'B', profile: { creativity: 10, ...base } },
    { id: 't1', name: 'A', profile: { creativity: 90, ...base } },
  ];
  const r = recommendTracks({ creativity: 90, ...base }, tracks, 1);
  assert.equal(r.length, 1);
  assert.equal(r[0].track.id, 't1');
  assert.equal(r[0].match, 100);
});
test('reasons name the strong competencies the track values', () => {
  const tracks = [{ id: 't', profile: { creativity: 90, thinking: 80, technical: 10, communication: 10, analysis: 10 } }];
  const r = recommendTracks({ creativity: 70, thinking: 40, technical: 0, communication: 0, analysis: 0 }, tracks);
  assert.deepEqual(r[0].reasons, ['창의력이 강점이에요']);
});

import { strongestCourses } from '../js/lib/competency.js';
test('strongest courses for a competency are best-graded mapped courses', () => {
  const sem = [{ courses: [
    { code: 'A', name: '가', credits: 3, grade: 'B0' }, { code: 'B', name: '나', credits: 3, grade: 'A+' },
    { code: 'C', name: '다', credits: 3, grade: 'A+' }, { code: 'D', name: '라', credits: 1, grade: 'P' },
  ] }];
  const cc = { A: { creativity: 1 }, B: { creativity: 1 }, C: { thinking: 1 }, D: { creativity: 1 } };
  assert.deepEqual(strongestCourses(sem, cc, gp, 'creativity', 2).map((c) => c.name), ['나', '가']);
});
test('F grade scores zero, not negative', () => {
  const g = scoreFromGrades([{ courses: [{ code: 'A', credits: 3, grade: 'F' }] }], { A: { creativity: 1 } }, { F: 0 });
  assert.equal(g.creativity, 0);
});
