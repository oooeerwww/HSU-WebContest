import { pageHead, esc } from '../ui.js';
import { formatTerm, formatAffiliation } from '../lib/profile.js';
import { semesterGpa, cumulativeGpa, earnedCredits, GRADUATION_CREDITS } from '../lib/grades.js';
import { user } from '../../data/user.js';
import { semesters } from '../../data/grades.js';

const fmt = (gpa) => (gpa == null ? '-' : gpa.toFixed(2));

export function render(root) {
  const total = cumulativeGpa(semesters);
  const credits = earnedCredits(semesters);
  const creditPct = Math.min(100, Math.round((credits / GRADUATION_CREDITS) * 100));

  root.append(pageHead('내 정보'));
  const body = document.createElement('div');
  body.innerHTML = `
    <section class="card profile">
      <div class="profile__avatar" aria-hidden="true">${esc(user.name.slice(-2))}</div>
      <div>
        <p class="profile__name">${esc(user.name)} <span class="muted">${esc(user.studentId)}</span></p>
        <p class="profile__meta">${esc(formatAffiliation(user))}</p>
        <p class="profile__meta">${esc(formatTerm(user))} · <span class="tag">${esc(user.track)}</span></p>
      </div>
    </section>

    <section class="stats">
      <div class="card stat">
        <p class="stat__label">누적 평점</p>
        <p class="stat__value">${fmt(total)}<small> / 4.5</small></p>
      </div>
      <div class="card stat">
        <p class="stat__label">이수 학점</p>
        <p class="stat__value">${credits}<small> / ${GRADUATION_CREDITS}</small></p>
        <div class="progress" role="progressbar" aria-label="졸업 학점 진행률" aria-valuenow="${creditPct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${creditPct}%"></span></div>
      </div>
    </section>

    <section class="card">
      <h2>학기별 평점</h2>
      <div class="gpa-bars">
        ${semesters.map((s) => {
          const g = semesterGpa(s.courses);
          const h = g == null ? 0 : Math.round((g / 4.5) * 100);
          return `<div class="gpa-bar">
            <span class="gpa-bar__value">${fmt(g)}</span>
            <span class="gpa-bar__track"><span style="height:${h}%"></span></span>
            <span class="gpa-bar__label">${s.year}-${s.semester}</span>
          </div>`;
        }).join('')}
      </div>
    </section>

    <section class="card">
      <h2>과목별 성적</h2>
      ${semesters.slice().reverse().map((s, i) => `
        <details class="term"${i === 0 ? ' open' : ''}>
          <summary><span>${s.year}학년 ${s.semester}학기</span><span class="muted">평점 ${fmt(semesterGpa(s.courses))}</span></summary>
          <ul class="list">
            ${s.courses.map((c) => `
              <li class="course">
                <span>${esc(c.name)} <span class="muted">${c.credits}학점</span></span>
                <strong class="grade grade--${esc(c.grade[0])}">${esc(c.grade)}</strong>
              </li>`).join('')}
          </ul>
        </details>`).join('')}
    </section>`;
  root.append(body);
}
