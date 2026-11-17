// 외부 데이터 로더. 지금은 샘플 JSON 을 읽고, 실제 대외활동 API 가 생기면
// ACTIVITIES_URL 과 응답 변환만 바꾸면 된다.
export const ACTIVITIES_URL = './data/activities.json';

export async function fetchActivities(url = ACTIVITIES_URL, fetchFn = (...a) => fetch(...a)) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`대외활동 불러오기 실패 (HTTP ${res.status})`);
  const data = await res.json();
  return data.items;
}
