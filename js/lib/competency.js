export const COMPETENCIES = ['creativity', 'thinking', 'technical', 'communication', 'analysis'];
export const COMPETENCY_LABELS = {
  creativity: '창의력', thinking: '사고력', technical: '기술력', communication: '소통력', analysis: '분석력',
};

// D0(1.0) → 0, A+(4.5) → 1 로 늘려서 학생 간·역량 간 차이가 잘 보이게 한다.
const MIN_POINT = 1.0;
const MAX_POINT = 4.5;
const gradeRatio = (p) => Math.max(0, (p - MIN_POINT) / (MAX_POINT - MIN_POINT));
const zeros = () => Object.fromEntries(COMPETENCIES.map((k) => [k, 0]));
const gradedMapped = (semesters, courseCompetency, gradePoints) =>
  semesters.flatMap((s) => s.courses)
    .filter((c) => c.grade in gradePoints && courseCompetency[c.code]);

/** 수강 성적 → 역량 점수(0~100). 매핑 없는 과목·P/NP 는 무시. */
export function scoreFromGrades(semesters, courseCompetency, gradePoints) {
  const sum = zeros();
  const weight = zeros();
  for (const c of gradedMapped(semesters, courseCompetency, gradePoints)) {
    for (const [k, w] of Object.entries(courseCompetency[c.code])) {
      if (!(k in sum)) continue;
      sum[k] += gradeRatio(gradePoints[c.grade]) * w * c.credits;
      weight[k] += w * c.credits;
    }
  }
  return Object.fromEntries(COMPETENCIES.map((k) => [k, weight[k] ? Math.round((sum[k] / weight[k]) * 100) : 0]));
}

/** 해당 역량에서 성적이 좋은 과목 n 개 (근거 표시용) */
export function strongestCourses(semesters, courseCompetency, gradePoints, competency, n = 2) {
  return gradedMapped(semesters, courseCompetency, gradePoints)
    .filter((c) => courseCompetency[c.code][competency])
    .sort((a, b) => gradePoints[b.grade] - gradePoints[a.grade])
    .slice(0, n);
}

export function isSurveyComplete(answers, questions) {
  return questions.every((q) => Number.isFinite(answers[q.id]));
}

/** 설문(1~5점) → 역량 점수(0~100). 문항 없는 역량은 0. */
export function scoreFromSurvey(answers, questions) {
  const out = zeros();
  for (const k of COMPETENCIES) {
    const vals = questions.filter((q) => q.competency === k).map((q) => answers[q.id]).filter(Number.isFinite);
    if (vals.length) out[k] = Math.round(((vals.reduce((a, b) => a + b, 0) / vals.length - 1) / 4) * 100);
  }
  return out;
}

export function combineScores(gradeScores, surveyScores, gradeWeight = 0.6) {
  return Object.fromEntries(COMPETENCIES.map((k) => [
    k, Math.round((gradeScores[k] ?? 0) * gradeWeight + (surveyScores[k] ?? 0) * (1 - gradeWeight)),
  ]));
}

/** 역량 점수와 트랙 프로필의 차이가 작을수록 높은 일치도. */
export function recommendTracks(scores, tracks, topN = 3) {
  return tracks
    .map((track) => {
      const diff = COMPETENCIES.reduce((s, k) => s + Math.abs((scores[k] ?? 0) - (track.profile[k] ?? 0)), 0) / COMPETENCIES.length;
      const key = [...COMPETENCIES].sort((a, b) => track.profile[b] - track.profile[a]).slice(0, 2);
      const reasons = key.filter((k) => (scores[k] ?? 0) >= 60).map((k) => `${COMPETENCY_LABELS[k]}이 강점이에요`);
      return { track, match: Math.round(100 - diff), reasons };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, topN);
}
