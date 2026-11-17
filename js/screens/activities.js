import { pageHead, esc } from '../ui.js';
import { fetchActivities } from '../api.js';
import { filterActivities, daysLeft } from '../lib/activities.js';

const FIELDS = ['all', '공모전', '서포터즈', '봉사', '교육', '인턴'];

export async function render(root) {
  root.append(pageHead('대외활동'));
  const intro = document.createElement('p');
  intro.className = 'muted screen-intro';
  intro.textContent = '스펙을 쌓을 수 있는 대외활동을 마감 임박순으로 보여드려요.';
  const chips = document.createElement('div');
  chips.className = 'chips';
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', '분야 필터');
  const list = document.createElement('div');
  list.className = 'activity-list';
  list.setAttribute('aria-live', 'polite');
  root.append(intro, chips, list);

  let field = 'all';
  let items = [];

  chips.innerHTML = FIELDS.map((f) =>
    `<button type="button" class="chip" data-field="${f}" aria-pressed="${f === field}">${f === 'all' ? '전체' : f}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-field]');
    if (!btn) return;
    field = btn.dataset.field;
    chips.querySelectorAll('.chip').forEach((c) => {
      const on = c.dataset.field === field;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    draw();
  });
  chips.querySelector('.chip').classList.add('is-active');

  function draw() {
    const today = new Date();
    const shown = filterActivities(items, { field, today });
    if (!shown.length) {
      list.innerHTML = '<p class="empty">지금 모집 중인 활동이 없어요.</p>';
      return;
    }
    list.innerHTML = shown.map((a) => {
      const d = daysLeft(a.deadline, today);
      return `
        <article class="card activity">
          <div class="activity__top">
            <span class="tag">${esc(a.field)}</span>
            <span class="dday ${d <= 7 ? 'dday--soon' : ''}">${d === 0 ? 'D-DAY' : `D-${d}`}</span>
          </div>
          <h2 class="activity__title">${esc(a.title)}</h2>
          <p class="muted">${esc(a.organizer)} · ${esc(a.deadline.replaceAll('-', '.'))} 마감</p>
        </article>`;
    }).join('');
  }

  async function load() {
    list.innerHTML = '<p class="empty">불러오는 중…</p>';
    try {
      items = await fetchActivities();
      draw();
    } catch (err) {
      console.warn('[e-Advisor]', err);
      list.innerHTML = `
        <div class="empty">
          <p>대외활동을 불러오지 못했어요.</p>
          <button type="button" class="btn btn--ghost retry">다시 시도</button>
        </div>`;
      list.querySelector('.retry').addEventListener('click', load);
    }
  }
  await load();
}
