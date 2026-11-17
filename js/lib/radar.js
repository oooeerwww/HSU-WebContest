/** 레이더 차트 꼭짓점 좌표. 첫 축은 12시 방향, 시계방향. 값은 0~100. */
export function radarPoints(values, radius, cx, cy) {
  const n = values.length;
  return values.map((v, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = (Math.max(0, Math.min(100, v)) / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}
