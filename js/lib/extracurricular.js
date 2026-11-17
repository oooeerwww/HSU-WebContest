import { daysLeft } from './activities.js';

export const GRADUATION_POINTS = 800; // 한성대 졸업요건: 비교과 포인트 800P

export function pointProgress(records, goal = GRADUATION_POINTS) {
  const earned = records.reduce((s, r) => s + r.points, 0);
  return {
    earned,
    remaining: Math.max(0, goal - earned),
    percent: Math.min(100, Math.round((earned / goal) * 100)),
  };
}

/** 관심사와 겹치는 태그를 가진 프로그램을 먼저 (같으면 포인트 높은 순). 이수·종료된 것은 제외. */
export function recommendPrograms(programs, records, interests, today) {
  const done = new Set(records.map((r) => r.programId));
  const overlap = (p) => p.tags.filter((t) => interests.includes(t)).length;
  return programs
    .filter((p) => !done.has(p.id) && daysLeft(p.endDate, today) >= 0)
    .sort((a, b) => overlap(b) - overlap(a) || b.points - a.points);
}

/** 'upcoming' (시작 전) | 'ongoing' (종료일 포함 진행 중) | 'ended' */
export function programStatus(program, today) {
  if (daysLeft(program.startDate, today) > 0) return 'upcoming';
  return daysLeft(program.endDate, today) >= 0 ? 'ongoing' : 'ended';
}
