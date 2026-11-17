// 샘플 수강 성적. 과목 code 는 data/courseCompetency.js 의 키와 맞춘다.
export const semesters = [
  { year: 1, semester: 1, courses: [
    { code: 'GEN101', name: '사고와표현', credits: 3, grade: 'A0' },
    { code: 'CSE101', name: '컴퓨팅사고', credits: 3, grade: 'A+' },
    { code: 'MAT101', name: '대학수학', credits: 3, grade: 'C+' },
    { code: 'GEN110', name: '영어회화1', credits: 2, grade: 'B0' },
    { code: 'GEN120', name: '신입생세미나', credits: 1, grade: 'P' },
  ] },
  { year: 1, semester: 2, courses: [
    { code: 'CSE102', name: 'C프로그래밍', credits: 3, grade: 'A+' },
    { code: 'MAT102', name: '선형대수', credits: 3, grade: 'C0' },
    { code: 'DES101', name: '디자인씽킹', credits: 3, grade: 'A+' },
    { code: 'GEN111', name: '영어회화2', credits: 2, grade: 'B+' },
    { code: 'GEN130', name: '글로벌문화의이해', credits: 3, grade: 'A0' },
  ] },
  { year: 2, semester: 1, courses: [
    { code: 'CSE201', name: '자료구조', credits: 3, grade: 'A0' },
    { code: 'CSE202', name: '객체지향프로그래밍', credits: 3, grade: 'A+' },
    { code: 'CSE203', name: '이산수학', credits: 3, grade: 'B+' },
    { code: 'CSE204', name: '웹프로그래밍기초', credits: 3, grade: 'A+' },
    { code: 'GEN140', name: '창의적문제해결', credits: 2, grade: 'A0' },
  ] },
  { year: 2, semester: 2, courses: [
    { code: 'CSE205', name: '알고리즘', credits: 3, grade: 'B+' },
    { code: 'CSE206', name: '컴퓨터구조', credits: 3, grade: 'C+' },
    { code: 'CSE207', name: '데이터베이스', credits: 3, grade: 'A0' },
    { code: 'CSE208', name: 'UI/UX디자인', credits: 3, grade: 'A+' },
    { code: 'BUS101', name: '경영학원론', credits: 3, grade: 'C+' },
  ] },
  { year: 3, semester: 1, courses: [
    { code: 'CSE301', name: '운영체제', credits: 3, grade: 'B0' },
    { code: 'CSE302', name: '웹프레임워크', credits: 3, grade: 'A+' },
    { code: 'CSE303', name: '인공지능개론', credits: 3, grade: 'A0' },
    { code: 'CSE304', name: '소프트웨어공학', credits: 3, grade: 'A0' },
    { code: 'CSE305', name: '데이터분석실습', credits: 3, grade: 'B0' },
    { code: 'GEN150', name: '봉사와리더십', credits: 1, grade: 'P' },
  ] },
];
