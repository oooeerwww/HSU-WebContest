// 한성대 4.5 만점 기준. P/NP 는 평점 계산에서 제외한다.
export const GRADE_POINTS = {
  'A+': 4.5, A0: 4.0, 'B+': 3.5, B0: 3.0, 'C+': 2.5, C0: 2.0, 'D+': 1.5, D0: 1.0, F: 0,
};
export const GRADUATION_CREDITS = 130; // 샘플값

const round2 = (n) => Math.round(n * 100) / 100;
const isGraded = (c) => c.grade in GRADE_POINTS;

/** 학기 평점(학점 가중 평균). 평점 대상 과목이 없으면 null. */
export function semesterGpa(courses) {
  const graded = courses.filter(isGraded);
  const credits = graded.reduce((s, c) => s + c.credits, 0);
  if (!credits) return null;
  return round2(graded.reduce((s, c) => s + GRADE_POINTS[c.grade] * c.credits, 0) / credits);
}

/** 전체 누적 평점. */
export function cumulativeGpa(semesters) {
  return semesterGpa(semesters.flatMap((s) => s.courses));
}

/** 취득 학점 (F, NP 제외). */
export function earnedCredits(semesters) {
  return semesters
    .flatMap((s) => s.courses)
    .filter((c) => c.grade !== 'F' && c.grade !== 'NP')
    .reduce((s, c) => s + c.credits, 0);
}
