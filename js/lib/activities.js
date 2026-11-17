const DAY = 24 * 60 * 60 * 1000;

/** 'YYYY-MM-DD' 를 현지 자정 Date 로 */
function parseDate(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** 마감까지 남은 일수 (날짜만 비교, 오늘 마감 = 0) */
export function daysLeft(deadline, today) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((parseDate(deadline) - start) / DAY);
}

/** 마감 안 지난 활동만, 분야 필터 후 마감 임박순 */
export function filterActivities(items, { field, today }) {
  return items
    .filter((i) => field === 'all' || i.field === field)
    .filter((i) => daysLeft(i.deadline, today) >= 0)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
}
