/**
 * 학부·학년에 맞는 과잠 스타일. 등록 안 된 학부는 기본(HSU 남색).
 * @returns {{ body: string, accent: string, text: string, label: string, yearBadge: string }}
 */
export function getJacket(user, jackets) {
  const colors = jackets.byDepartment?.[user.department] ?? jackets.default;
  return { ...colors, label: 'HSU', yearBadge: String(user.year) };
}
