import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadMemo, saveMemo, pickEssay, MEMO_KEY } from '../js/lib/memo.js';

const memStorage = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
};
const throwing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };

test('saved memo loads back', () => {
  const s = memStorage();
  assert.equal(saveMemo(s, '토익 신청'), true);
  assert.equal(loadMemo(s), '토익 신청');
  assert.equal(s.getItem(MEMO_KEY), '토익 신청');
});
test('missing memo loads as empty string', () => assert.equal(loadMemo(memStorage()), ''));
test('storage that throws loads empty and save reports failure', () => {
  assert.equal(loadMemo(throwing), '');
  assert.equal(saveMemo(throwing, 'x'), false);
});
test('blank memo falls back to the first tip', () =>
  assert.deepEqual(pickEssay('   ', ['정보처리기사 자격증 잊지말자!']), { text: '정보처리기사 자격증 잊지말자!', source: 'tip' }));
test('memo wins over tips', () => assert.deepEqual(pickEssay('토익 신청', ['a']), { text: '토익 신청', source: 'memo' }));
test('no memo and no tips shows a prompt', () => assert.equal(pickEssay('', []).text, '오늘의 목표를 메모해 보세요'));
