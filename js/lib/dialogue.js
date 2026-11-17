/** 대사를 순서대로 돌려준다. 끝나면 처음부터. */
export function createDialogue(lines) {
  const list = lines.length ? [...lines] : ['안녕!'];
  let i = 0;
  return {
    next() {
      const line = list[i];
      i = (i + 1) % list.length;
      return line;
    },
  };
}

/** 사용자 상황에 맞춘 대사 */
export function situationalLines({ remainingPoints }) {
  return remainingPoints > 0
    ? [`비교과 포인트 ${remainingPoints}P 남았어!`]
    : ['비교과 포인트 다 채웠어! 대단해!'];
}
