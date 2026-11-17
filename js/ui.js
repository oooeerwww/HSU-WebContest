// 화면들이 같이 쓰는 작은 DOM 도우미.

/** HTML 특수문자 이스케이프 (샘플 데이터를 innerHTML 에 넣을 때 사용) */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** 하위 화면 상단 제목 + 홈으로 버튼 */
export function pageHead(title) {
  const head = document.createElement('header');
  head.className = 'page-head';
  head.innerHTML = `
    <button type="button" class="back-btn" aria-label="홈으로">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <h1>${esc(title)}</h1>`;
  head.querySelector('button').addEventListener('click', () => { location.hash = 'home'; });
  return head;
}
