import { pageHead, esc } from '../ui.js';
import { radarPoints } from '../lib/radar.js';
import {
  COMPETENCIES, COMPETENCY_LABELS, scoreFromGrades, strongestCourses,
  isSurveyComplete, scoreFromSurvey, combineScores, recommendTracks,
} from '../lib/competency.js';
import { GRADE_POINTS } from '../lib/grades.js';
import { semesters } from '../../data/grades.js';
import { courseCompetency } from '../../data/courseCompetency.js';
import { questions, SCALE } from '../../data/survey.js';
import { tracks } from '../../data/tracks.js';

const SIZE = 260;
const C = SIZE / 2;
const R = 88;

/** series: [{ scores, className, label }] */
function radarSvg(series) {
  const ring = (pct) => radarPoints(COMPETENCIES.map(() => pct), R, C, C).map((p) => `${p.x},${p.y}`).join(' ');
  const axes = radarPoints(COMPETENCIES.map(() => 100), R, C, C);
  const labels = radarPoints(COMPETENCIES.map(() => 136), R, C, C);
  return `
    <svg class="radar" viewBox="0 0 ${SIZE} ${SIZE}" role="img"
         aria-label="${esc(series.map((s) => `${s.label}: ${COMPETENCIES.map((k) => `${COMPETENCY_LABELS[k]} ${s.scores[k]}`).join(', ')}`).join(' / '))}">
      ${[25, 50, 75, 100].map((p) => `<polygon class="radar__ring" points="${ring(p)}"/>`).join('')}
      ${axes.map((p) => `<line class="radar__axis" x1="${C}" y1="${C}" x2="${p.x}" y2="${p.y}"/>`).join('')}
      ${series.map((s) => `<polygon class="radar__area ${s.className}" points="${
        radarPoints(COMPETENCIES.map((k) => s.scores[k]), R, C, C).map((p) => `${p.x},${p.y}`).join(' ')}"/>`).join('')}
      ${labels.map((p, i) => `<text class="radar__label" x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle">${COMPETENCY_LABELS[COMPETENCIES[i]]}</text>`).join('')}
    </svg>`;
}

function legend(series) {
  return `<div class="radar-legend">${series.map((s) =>
    `<span><i class="${s.className}"></i>${esc(s.label)}</span>`).join('')}</div>`;
}

export function render(root) {
  const gradeScores = scoreFromGrades(semesters, courseCompetency, GRADE_POINTS);
  const answers = {};
  root.append(pageHead('전공 분석'));
  const body = document.createElement('div');
  root.append(body);

  const steps = (n) => `
    <ol class="steps" aria-label="진행 단계">
      ${['성적 분석', '역량 설문', '전공 추천'].map((t, i) =>
        `<li class="${i < n ? 'is-done' : ''} ${i === n ? 'is-current' : ''}" ${i === n ? 'aria-current="step"' : ''}>${t}</li>`).join('')}
    </ol>`;

  function showAnalysis() {
    const top = [...COMPETENCIES].sort((a, b) => gradeScores[b] - gradeScores[a]);
    body.innerHTML = `
      ${steps(0)}
      <section class="card">
        <h2>수강 성적으로 본 나의 역량</h2>
        <p class="muted">학점이 높은 수업일수록 그 수업의 역량 점수가 크게 반영돼요.</p>
        ${radarSvg([{ scores: gradeScores, className: 'is-grade', label: '성적 기반' }])}
        <ul class="list strengths">
          ${top.slice(0, 3).map((k) => `
            <li>
              <div class="strength__head"><strong>${COMPETENCY_LABELS[k]}</strong><span class="strength__score">${gradeScores[k]}</span></div>
              <div class="progress"><span style="width:${gradeScores[k]}%"></span></div>
              <p class="muted">근거: ${strongestCourses(semesters, courseCompetency, GRADE_POINTS, k, 2)
                .map((c) => `${esc(c.name)}(${esc(c.grade)})`).join(', ') || '-'}</p>
            </li>`).join('')}
        </ul>
      </section>
      <button type="button" class="btn btn--block" data-act="survey">역량 설문 시작하기</button>`;
    body.querySelector('[data-act="survey"]').addEventListener('click', showSurvey);
  }

  function showSurvey() {
    body.innerHTML = `
      ${steps(1)}
      <p class="muted screen-intro">나와 가까운 정도를 골라 주세요. <strong class="survey__count"></strong></p>
      <form class="survey">
        ${questions.map((q, i) => `
          <fieldset class="card question">
            <legend><span class="question__no">Q${i + 1}</span>${esc(q.text)}</legend>
            <div class="scale">
              ${SCALE.map((label, v) => `
                <label class="scale__opt">
                  <input type="radio" name="${q.id}" value="${v + 1}" ${answers[q.id] === v + 1 ? 'checked' : ''}>
                  <span class="scale__dot" aria-hidden="true">${v + 1}</span>
                  <span class="scale__label">${label}</span>
                </label>`).join('')}
            </div>
          </fieldset>`).join('')}
        <div class="survey__actions">
          <button type="button" class="btn btn--ghost" data-act="back">이전</button>
          <button type="submit" class="btn" data-act="result">결과 보기</button>
        </div>
      </form>`;
    const form = body.querySelector('form');
    const submit = body.querySelector('[data-act="result"]');
    const count = body.querySelector('.survey__count');
    const sync = () => {
      const done = questions.filter((q) => Number.isFinite(answers[q.id])).length;
      count.textContent = `${done}/${questions.length}`;
      submit.disabled = !isSurveyComplete(answers, questions);
    };
    form.addEventListener('change', (e) => {
      if (e.target.name) answers[e.target.name] = Number(e.target.value);
      sync();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSurveyComplete(answers, questions)) showResult();
    });
    body.querySelector('[data-act="back"]').addEventListener('click', showAnalysis);
    sync();
    window.scrollTo(0, 0);
  }

  function showResult() {
    const surveyScores = scoreFromSurvey(answers, questions);
    const combined = combineScores(gradeScores, surveyScores);
    const recs = recommendTracks(combined, tracks, 3);
    const series = [
      { scores: gradeScores, className: 'is-grade', label: '성적 기반' },
      { scores: combined, className: 'is-combined', label: '성적 + 설문' },
    ];
    body.innerHTML = `
      ${steps(2)}
      <section class="card">
        <h2>나의 역량 결과</h2>
        ${radarSvg(series)}
        ${legend(series)}
      </section>
      <h2 class="section-title">추천 전공 트랙</h2>
      ${recs.map((r, i) => `
        <article class="card track ${i === 0 ? 'track--best' : ''}">
          <div class="track__head">
            <span class="track__rank">${i + 1}</span>
            <div>
              <h3>${esc(r.track.name)}</h3>
              <p class="muted">${esc(r.track.college)}</p>
            </div>
            <span class="track__match">${r.match}<small>%</small></span>
          </div>
          <p class="track__desc">${esc(r.track.description)}</p>
          ${r.reasons.length ? `<div class="track__reasons">${r.reasons.map((t) => `<span class="tag tag--ok">${esc(t)}</span>`).join('')}</div>` : ''}
        </article>`).join('')}
      <button type="button" class="btn btn--ghost btn--block" data-act="again">설문 다시 하기</button>`;
    body.querySelector('[data-act="again"]').addEventListener('click', showSurvey);
    window.scrollTo(0, 0);
  }

  showAnalysis();
}
