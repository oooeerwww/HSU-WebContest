export const MEMO_KEY = 'eadvisor.memo';
const EMPTY_PROMPT = '오늘의 목표를 메모해 보세요';

/** 저장된 메모. 없거나 저장소 접근이 막혀 있으면 ''. */
export function loadMemo(storage) {
  try {
    return storage.getItem(MEMO_KEY) ?? '';
  } catch {
    return '';
  }
}

/** 메모 저장. 저장소 접근이 막혀 있으면 false. */
export function saveMemo(storage, text) {
  try {
    storage.setItem(MEMO_KEY, text);
    return true;
  } catch {
    return false;
  }
}

/** 에세이 카드에 띄울 문구: 메모가 있으면 메모, 없으면 추천 문구. */
export function pickEssay(memo, tips) {
  const text = (memo ?? '').trim();
  if (text) return { text, source: 'memo' };
  return { text: tips[0] ?? EMPTY_PROMPT, source: 'tip' };
}
