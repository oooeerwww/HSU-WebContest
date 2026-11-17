// 비교과 프로그램(샘플)과 사용자 이수 내역. 실제로는 HSP/비교과 시스템 데이터로 교체한다.
export const programs = [
  { id: 'p01', name: '교내 SW 해커톤', type: '해커톤', points: 100, startDate: '2026-11-01', endDate: '2027-02-28', tags: ['개발', '공모전'] },
  { id: 'p02', name: 'e-Advisor 웹앱 공모전', type: '공모전', points: 100, startDate: '2026-11-02', endDate: '2027-01-11', tags: ['개발', '공모전', 'AI'] },
  { id: 'p03', name: '외국인 유학생 1:1 상담 버디', type: '외국인 상담', points: 60, startDate: '2026-09-01', endDate: '2027-02-28', tags: ['소통', '글로벌'] },
  { id: 'p04', name: 'AI 활용 특강 시리즈', type: '특강', points: 30, startDate: '2026-11-10', endDate: '2027-01-31', tags: ['AI'] },
  { id: 'p05', name: '지역사회 봉사단', type: '봉사', points: 50, startDate: '2026-10-01', endDate: '2027-03-31', tags: ['봉사'] },
  { id: 'p06', name: '진로 설계 그룹 코칭', type: '진로', points: 40, startDate: '2026-11-15', endDate: '2027-02-15', tags: ['진로'] },
  { id: 'p07', name: '창업 아이디어 캠프', type: '공모전', points: 80, startDate: '2026-12-01', endDate: '2027-03-15', tags: ['창업', '공모전'] },
  { id: 'p08', name: '학습 멘토링 (튜터)', type: '멘토링', points: 70, startDate: '2026-09-01', endDate: '2027-02-28', tags: ['소통', '개발'] },
  { id: 'p09', name: '글쓰기 클리닉', type: '특강', points: 20, startDate: '2026-09-01', endDate: '2026-11-10', tags: ['소통'] },
];

export const records = [
  { programId: 'h01', name: '신입생 오리엔테이션 캠프', points: 50, date: '2023-02-20' },
  { programId: 'h02', name: '전공 탐색 특강', points: 30, date: '2023-05-10' },
  { programId: 'h03', name: '교내 프로그래밍 경진대회', points: 100, date: '2023-11-18' },
  { programId: 'h04', name: '지역아동센터 봉사', points: 60, date: '2024-07-15' },
  { programId: 'h05', name: '외국인 유학생 상담 버디', points: 60, date: '2024-10-05' },
  { programId: 'p09', name: '글쓰기 클리닉', points: 20, date: '2025-04-12' },
  { programId: 'h06', name: '여름방학 코딩 부트캠프', points: 80, date: '2025-08-22' },
  { programId: 'h07', name: '진로 상담 프로그램', points: 40, date: '2026-04-03' },
];
