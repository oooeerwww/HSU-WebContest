import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDialogue, situationalLines } from '../js/lib/dialogue.js';

test('dialogue cycles lines in order and wraps', () => {
  const d = createDialogue(['안녕!', '오늘은 어때?']);
  assert.deepEqual([d.next(), d.next(), d.next()], ['안녕!', '오늘은 어때?', '안녕!']);
});
test('empty dialogue says hello', () => assert.equal(createDialogue([]).next(), '안녕!'));
test('remaining points produce a reminder line', () =>
  assert.ok(situationalLines({ remainingPoints: 120 }).includes('비교과 포인트 120P 남았어!')));
test('no remaining points produce a congratulation', () =>
  assert.ok(situationalLines({ remainingPoints: 0 }).includes('비교과 포인트 다 채웠어! 대단해!')));
