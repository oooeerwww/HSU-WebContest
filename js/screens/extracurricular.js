import { pageHead, esc } from '../ui.js';
import { pointProgress, recommendPrograms, programStatus, GRADUATION_POINTS } from '../lib/extracurricular.js';
import { daysLeft } from '../lib/activities.js';
import { user } from '../../data/user.js';
import { programs, records } from '../../data/extracurricular.js';

const RING_R = 52;
const RING_LEN = 2 * Math.PI * RING_R;
const dot = (ymd) => ymd.replaceAll('-', '.');

function programCard(p, today, interests) {
  const d = daysLeft(p.endDate, today);
  return `
    <article class="card program">
      <div class="program__top">
        <span><span class="tag">${esc(p.type)}</span>${programStatus(p, today) === 'upcoming' ? ' <span class="tag tag--accent">모집 예정</span>' : ''}</span>
        <span class="program__points">+${p.points}P</span>
      </div>
      <h3 class="program__name">${esc(p.name)}</h3>
      <p class="muted">${dot(p.startDate)} ~ ${dot(p.endDate)}${d <= 14 ? ` · <span class="dday dday--soon">D-${d}</span>` : ''}</p>
      ${p.tags.length ? `<div class="program__tags">${p.tags.map((t) =>
        `<span class="tag ${interests.includes(t) ? 'tag--ok' : 'tag--plain'}">#${esc(t)}</span>`).join('')}</div>` : ''}
    </article>`;
}

export function render(root) {
  const today = new Date();
  const prog = pointProgress(records);
  const recs = recommendPrograms(programs, records, user.interests, today).slice(0, 3);
  const open = programs.filter((p) => daysLeft(p.endDate, today) >= 0);
  const types = ['all', ...new Set(open.map((p) => p.type))];

  root.append(pageHead('비교과 프로그램'));
  const body = document.createElement('div');
  body.innerHTML = `
    <section class="card points">
      <svg class="ring" viewBox="0 0 120 120" role="img" aria-label="비교과 포인트 ${prog.earned}P / ${GRADUATION_POINTS}P (${prog.percent}%)">
        <circle cx="60" cy="60" r="${RING_R}" class="ring__track"/>
        <circle cx="60" cy="60" r="${RING_R}" class="ring__bar"
                stroke-dasharray="${RING_LEN}" stroke-dashoffset="${RING_LEN * (1 - prog.percent / 100)}"/>
        <text x="60" y="58" text-anchor="middle" class="ring__pct">${prog.percent}%</text>
        <text x="60" y="76" text-anchor="middle" class="ring__sub">졸업요건</text>
      </svg>
      <div>
        <p class="muted">내 비교과 포인트</p>
        <p class="stat__value">${prog.earned}<small> / ${GRADUATION_POINTS}P</small></p>
        <p class="points__left">${prog.remaining > 0 ? `졸업까지 <strong>${prog.remaining}P</strong> 남았어요` : '졸업요건을 채웠어요!'}</p>
      </div>
    </section>

    <h2 class="section-title">나에게 맞는 추천</h2>
    <p class="muted screen-intro">관심사 ${user.interests.map((t) => `#${esc(t)}`).join(' ')} 와 겹치는 프로그램을 먼저 보여드려요.</p>
    ${recs.length ? recs.map((p) => programCard(p, today, user.interests)).join('') : '<p class="empty">추천할 프로그램이 없어요.</p>'}

    <h2 class="section-title">진행 중 · 예정 프로그램</h2>
    <div class="chips" role="group" aria-label="유형 필터">
      ${types.map((t, i) => `<button type="button" class="chip ${i === 0 ? 'is-active' : ''}" data-type="${esc(t)}" aria-pressed="${i === 0}">${t === 'all' ? '전체' : esc(t)}</button>`).join('')}
    </div>
    <div class="program-list"></div>

    <h2 class="section-title">이수 내역</h2>
    <section class="card">
      <ul class="list">
        ${records.slice().reverse().map((r) => `
          <li class="record"><span>${esc(r.name)}<br><span class="muted">${dot(r.date)}</span></span><strong>+${r.points}P</strong></li>`).join('')}
      </ul>
    </section>`;
  root.append(body);

  const list = body.querySelector('.program-list');
  const draw = (type) => {
    const shown = open.filter((p) => type === 'all' || p.type === type);
    list.innerHTML = shown.map((p) => programCard(p, today, user.interests)).join('');
  };
  body.querySelector('.chips').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-type]');
    if (!btn) return;
    body.querySelectorAll('.chips .chip').forEach((c) => {
      const on = c === btn;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    draw(btn.dataset.type);
  });
  draw('all');
}
