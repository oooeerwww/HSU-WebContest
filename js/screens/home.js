import { renderBugi } from '../bugi.js';
import { getJacket } from '../lib/jacket.js';
import { createDialogue, situationalLines } from '../lib/dialogue.js';
import { pointProgress } from '../lib/extracurricular.js';
import { loadMemo, saveMemo, pickEssay } from '../lib/memo.js';
import { user } from '../../data/user.js';
import { jackets } from '../../data/jackets.js';
import { dialogues } from '../../data/dialogues.js';
import { tips } from '../../data/tips.js';
import { records } from '../../data/extracurricular.js';

// localStorage 자체에 접근만 해도 예외가 나는 브라우저가 있어 호출 시점까지 미룬다.
const storage = {
  getItem: (k) => window.localStorage.getItem(k),
  setItem: (k, v) => window.localStorage.setItem(k, v),
};

export function render(root) {
  const bugiEl = document.createElement('section');
  const essayEl = document.createElement('section');
  essayEl.id = 'essay';
  root.append(bugiEl, essayEl);

  const bugi = renderBugi(bugiEl, getJacket(user, jackets));
  const { remaining } = pointProgress(records);
  const dialogue = createDialogue([...dialogues, ...situationalLines({ remainingPoints: remaining })]);
  bugi.setSpeech('안녕!');
  dialogue.next(); // 첫 대사는 이미 보여줬으니 넘긴다
  bugi.onClick(() => bugi.setSpeech(dialogue.next()));

  renderEssay(essayEl);
}

function renderEssay(el, notice = '') {
  const memo = loadMemo(storage);
  const essay = pickEssay(memo, tips);
  el.className = 'essay';
  el.innerHTML = `
    <figure class="essay__card">
      <span class="essay__mark" aria-hidden="true">“</span>
      <blockquote class="essay__text"></blockquote>
      <figcaption class="essay__foot">
        <span class="tag ${essay.source === 'memo' ? 'tag--accent' : ''}">${essay.source === 'memo' ? '나의 메모' : '부기의 추천'}</span>
        <button type="button" class="essay__edit">${memo.trim() ? '메모 수정' : '메모하기'}</button>
      </figcaption>
      <p class="essay__notice" role="status"></p>
    </figure>`;
  el.querySelector('.essay__text').textContent = essay.text;
  el.querySelector('.essay__notice').textContent = notice;
  el.querySelector('.essay__edit').addEventListener('click', () => renderEditor(el, memo));
}

function renderEditor(el, memo) {
  el.innerHTML = `
    <form class="essay__card essay__form">
      <label for="memo-input" class="essay__label">부기에게 남길 메모</label>
      <textarea id="memo-input" maxlength="60" rows="2" placeholder="예) 정보처리기사 필기 접수하기"></textarea>
      <div class="essay__actions">
        <span class="muted essay__count"></span>
        <button type="button" class="btn btn--ghost" data-act="cancel">취소</button>
        <button type="submit" class="btn">저장</button>
      </div>
    </form>`;
  const input = el.querySelector('textarea');
  const count = el.querySelector('.essay__count');
  const updateCount = () => { count.textContent = `${input.value.length}/60`; };
  input.value = memo;
  updateCount();
  input.addEventListener('input', updateCount);
  input.focus();

  el.querySelector('[data-act="cancel"]').addEventListener('click', () => renderEssay(el));
  el.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = saveMemo(storage, input.value.trim());
    renderEssay(el, ok ? '' : '이 브라우저에선 메모가 저장되지 않아요.');
  });
}
