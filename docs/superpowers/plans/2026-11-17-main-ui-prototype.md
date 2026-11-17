# e-Advisor 메인 UI 프로토타입 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 샘플 데이터로 동작하는 e-Advisor 메인 화면(학년·학기, 2D 부기+과잠, 말풍선, 에세이 문구)과 하단 4개 메뉴 화면을 순수 HTML/CSS/JS로 만든다.

**Architecture:** 빌드 없는 ES 모듈 구조. 계산 로직은 DOM을 모르는 순수 함수(`js/lib/`)로 두고 Node 내장 테스트 러너로 검증한다. 화면 코드(`js/screens/`, `js/bugi.js`)는 lib 함수와 `data/` 샘플 데이터만 사용하며 브라우저에서 눈으로 확인한다. 부기는 `js/bugi.js` 하나에 격리해 나중에 3D로 교체한다.

**Tech Stack:** HTML5, CSS(커스텀 프로퍼티), Vanilla JS ES Modules, Node 24 (`node --test`, 의존성 없는 정적 서버 스크립트). 외부 라이브러리 없음.

**Spec:** `docs/superpowers/specs/2026-11-17-main-ui-design.md`

## Global Constraints

- HTML/CSS/JavaScript만 사용. 프레임워크·빌드 도구·npm 의존성 없음.
- 모바일 세로 화면 우선, 데스크톱에서는 최대 폭 `480px` 가운데 정렬.
- 브랜드 색: 남색 `#0B2F6B`, 하늘색 `#A9C4E8` (CSS 변수 `--navy`, `--sky`).
- 모든 샘플 데이터는 `data/` 에만 둔다. 화면/lib 코드에 데이터 하드코딩 금지.
- 부기 렌더링·상호작용은 `js/bugi.js` 밖으로 새지 않는다 (3D 교체 지점).
- 비교과 졸업요건 `800`P. 성적 환산 4.5 만점 (A+ 4.5, A0 4.0, B+ 3.5, B0 3.0, C+ 2.5, C0 2.0, D+ 1.5, D0 1.0, F 0; P/NP는 평점 계산 제외).
- 메모 저장 키: `eadvisor.memo` (localStorage).
- 작업 브랜치: `feat/main-ui-prototype` (main에 직접 커밋하지 않음).

## Review Focus

1. **localStorage 접근이 예외를 던짐**(시크릿 모드 등) → 메모 로드는 빈 문자열, 저장 실패해도 화면은 정상. → Task 4 테스트
2. **성적이 하나도 없는 1학년 1학기 / P·NP만 있는 학기** → 평점 0으로 나누지 않고 `null`, 화면엔 `-` 표시. → Task 5 테스트
3. **비교과 포인트가 800P 초과** → 진행률 100%로 고정, 남은 포인트 0. → Task 8 테스트
4. **등록되지 않은 학부** → 과잠은 기본(HSU 남색) 색으로 표시, 에러 없음. → Task 3 테스트
5. **설문 일부 미응답 상태로 결과 보기** → 결과 버튼 비활성, 부분 응답으로 계산하지 않음 (`isSurveyComplete`). → Task 7 테스트

---

## File Structure

```
index.html                    앱 셸: 상단 정보, 화면 영역, 하단 메뉴
css/style.css                 디자인 토큰 + 전 화면 스타일
package.json                  "type":"module", test/serve 스크립트
scripts/serve.mjs             의존성 없는 정적 서버 (ES 모듈은 file:// 불가)
js/main.js                    부트스트랩, 화면 전환 연결
js/bugi.js                    2D 부기 SVG 렌더 + 클릭 상호작용 (3D 교체 지점)
js/api.js                     대외활동 로더 (나중에 실제 API URL로 교체)
js/lib/router.js              해시 → 화면 이름
js/lib/profile.js             학년·학기/소속 문자열
js/lib/jacket.js              학부·학년 → 과잠 스타일
js/lib/dialogue.js            부기 대사 순환 + 상황 대사
js/lib/memo.js                메모 저장/로드, 에세이 문구 선택
js/lib/grades.js              평점·이수학점 계산
js/lib/activities.js          대외활동 필터/정렬/D-day
js/lib/competency.js          역량 점수, 설문, 전공트랙 추천
js/lib/radar.js               레이더 차트 좌표 계산
js/lib/extracurricular.js     비교과 진행률·추천
js/screens/home.js            메인 화면 (부기, 말풍선, 에세이 카드)
js/screens/myinfo.js          내 정보
js/screens/activities.js      대외활동
js/screens/major.js           전공 분석
js/screens/extracurricular.js 비교과 프로그램
data/user.js                  샘플 사용자
data/jackets.js               학부별 과잠 색
data/dialogues.js             부기 대사
data/tips.js                  추천 에세이 문구
data/grades.js                학기별 수강 성적
data/courseCompetency.js      과목 → 역량 매핑
data/survey.js                전공 분석 설문
data/tracks.js                전공트랙 역량 프로필
data/extracurricular.js       비교과 프로그램 + 이수 내역
data/activities.json          대외활동 (외부 API 응답 형태)
assets/bugi-reference.png     사용자 제공 부기 원본 (참고용)
tests/*.test.js               lib 단위 테스트
```

## 공통 데이터 형태 (모든 Task가 따름)

```js
// data/user.js
export const user = { name: '김한성', studentId: '2023xxxxx', year: 3, semester: 2,
  college: 'IT공과대학', department: '컴퓨터공학부', track: '웹공학트랙',
  interests: ['개발', '공모전'] };

// data/grades.js — 학기 배열
export const semesters = [{ year: 1, semester: 1, courses: [
  { code: 'CSE101', name: '컴퓨팅사고', credits: 3, grade: 'A+' }, /* ... */ ] }, /* ... */];

// data/courseCompetency.js — 과목코드 → 역량 가중치(0~1)
export const courseCompetency = { CSE101: { thinking: 1, creativity: 0.5 }, /* ... */ };

// 역량 키 (고정 5개, 순서 = 레이더 축 순서)
export const COMPETENCIES = ['creativity','thinking','technical','communication','analysis'];
// 라벨: 창의력, 사고력, 기술력, 소통력, 분석력
```

---

### Task 1: 프로젝트 골격 + 화면 전환

**Files:**
- Create: `package.json`, `scripts/serve.mjs`, `index.html`, `css/style.css`, `js/main.js`, `js/lib/router.js`, `assets/bugi-reference.png`
- Test: `tests/router.test.js`

**Interfaces:**
- Produces: `SCREENS = ['home','myinfo','activities','major','extracurricular']`, `resolveScreen(hash: string) => string` (모르는 값/빈 값 → `'home'`).
- Produces: `index.html` 구조 — `<header id="top-info">`, `<main id="screen">`, `<nav id="bottom-nav">`에 `data-screen` 버튼 4개(내 정보/대외활동/전공 분석/비교과). 홈으로 돌아가는 방법: 상단 정보 영역 클릭 또는 `#home`.
- Produces: `js/main.js`가 각 화면 모듈의 `render(root: HTMLElement): void`를 호출. 아직 없는 화면은 "준비 중" 표시.

- [ ] **Step 1:** 브랜치 생성 `git checkout -b feat/main-ui-prototype`
- [ ] **Step 2: 실패 테스트 작성** `tests/router.test.js`

```js
import { test } from 'node:test'; import assert from 'node:assert/strict';
import { resolveScreen } from '../js/lib/router.js';
test('known hash', () => assert.equal(resolveScreen('#major'), 'major'));
test('empty → home', () => assert.equal(resolveScreen(''), 'home'));
test('unknown → home', () => assert.equal(resolveScreen('#nope'), 'home'));
```

- [ ] **Step 3:** `package.json` 생성 — `"type": "module"`, `"scripts": { "test": "node --test tests/", "serve": "node scripts/serve.mjs" }`. 실행 `npm test` → FAIL (모듈 없음).
- [ ] **Step 4:** `js/lib/router.js` 구현 → `npm test` PASS.
- [ ] **Step 5:** `scripts/serve.mjs` — `node:http`로 프로젝트 루트를 `http://localhost:5173`에 서빙, 확장자별 Content-Type(html/css/js/json/png/svg), 경로 이탈(`..`) 차단, 404 처리.
- [ ] **Step 6:** `index.html` + `css/style.css` (토큰 `--navy:#0B2F6B; --sky:#A9C4E8; --bg:#F5F8FD; --card:#fff`, 최대 폭 480px, 하단 nav 고정) + `js/main.js` (`hashchange` → `resolveScreen` → 해당 화면 렌더, 활성 nav 버튼 표시).
- [ ] **Step 7:** 사용자 제공 부기 이미지를 `assets/bugi-reference.png`로 복사 (원본: `C:\Users\chung\AppData\Local\Temp\orca-paste-1794891885408-2294e82a-838b-4bc2-b1c9-e9c89b6eff64.png`, 없으면 건너뛰고 보고).
- [ ] **Step 8: 확인** `npm run serve` 후 브라우저에서 nav 클릭 시 URL 해시와 화면 제목이 바뀌는지 확인.
- [ ] **Step 9: Commit** `git add -A && git commit -m "feat: 프로젝트 골격과 화면 전환"`

---

### Task 2: 상단 학년·학기 / 소속 표시

**Files:**
- Create: `js/lib/profile.js`, `data/user.js`
- Modify: `js/main.js` (상단 정보 렌더)
- Test: `tests/profile.test.js`

**Interfaces:**
- Produces: `formatTerm(user) => string` (`'3학년 2학기'`), `formatAffiliation(user) => string` (`'IT공과대학 컴퓨터공학부'`, 학부 없으면 대학만).
- Produces: `data/user.js`의 `user` (위 공통 형태).

- [ ] **Step 1: 실패 테스트**

```js
assert.equal(formatTerm({ year: 3, semester: 2 }), '3학년 2학기');
assert.equal(formatAffiliation({ college: 'IT공과대학', department: '컴퓨터공학부' }), 'IT공과대학 컴퓨터공학부');
assert.equal(formatAffiliation({ college: 'IT공과대학' }), 'IT공과대학');
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** `profile.js`, `data/user.js` 구현, `main.js`에서 `#top-info`에 학년·학기(큰 글씨) + 소속(작은 글씨) 출력.
- [ ] **Step 4:** `npm test` PASS + 브라우저에서 상단 표시 확인.
- [ ] **Step 5: Commit** `feat: 상단 학년·학기와 소속 표시`

---

### Task 3: 2D 부기 + 과잠 + 말풍선

**Files:**
- Create: `js/lib/jacket.js`, `js/lib/dialogue.js`, `js/bugi.js`, `data/jackets.js`, `data/dialogues.js`, `js/screens/home.js`
- Test: `tests/jacket.test.js`, `tests/dialogue.test.js`

**Interfaces:**
- Produces: `getJacket(user, jackets) => { body: string, accent: string, text: string, label: string, yearBadge: string }`. `jackets` 형태: `{ default: {body, accent, text}, byDepartment: { '컴퓨터공학부': {...}, ... } }`. `label`은 `'HSU'`, `yearBadge`는 `` `${user.year}` `` (학년 숫자). 등록 안 된 학부 → `default` (`body: '#0B2F6B'`).
- Produces: `createDialogue(lines: string[]) => { next(): string }` — 호출마다 순서대로, 끝나면 처음으로. 빈 배열 → `'안녕!'`.
- Produces: `situationalLines({ remainingPoints: number }) => string[]` — `remainingPoints > 0`이면 `` `비교과 포인트 ${remainingPoints}P 남았어!` `` 포함, 아니면 `'비교과 포인트 다 채웠어! 대단해!'`.
- Produces: `renderBugi(container: HTMLElement, jacket) => { setSpeech(text: string): void, onClick(handler: () => void): void }` — 3D 교체 시 이 시그니처 유지.
- Produces: `js/screens/home.js`의 `render(root)` — 말풍선 + 부기 영역 + 에세이 카드 자리(`#essay`, Task 4에서 채움).

- [ ] **Step 1: 실패 테스트**

```js
// jacket
const jackets = { default: { body: '#0B2F6B', accent: '#A9C4E8', text: '#fff' },
  byDepartment: { '디자인학부': { body: '#7A1F3D', accent: '#F2C6D3', text: '#fff' } } };
assert.equal(getJacket({ department: '디자인학부', year: 2 }, jackets).body, '#7A1F3D');
assert.equal(getJacket({ department: '없는학부', year: 1 }, jackets).body, '#0B2F6B');
assert.equal(getJacket({ department: '디자인학부', year: 2 }, jackets).yearBadge, '2');
// dialogue
const d = createDialogue(['안녕!', '오늘은 어때?']);
assert.deepEqual([d.next(), d.next(), d.next()], ['안녕!', '오늘은 어때?', '안녕!']);
assert.equal(createDialogue([]).next(), '안녕!');
assert.ok(situationalLines({ remainingPoints: 120 }).includes('비교과 포인트 120P 남았어!'));
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** lib 구현 + `data/jackets.js`(최소 4개 학부: 컴퓨터공학부, 디자인학부, 경영학부, 기계전자공학부 — 색은 자유, 기본은 남색) + `data/dialogues.js`(`['안녕!', '오늘은 어때?', '수업은 잘 듣고 있어?', '오늘도 화이팅!']`).
- [ ] **Step 4:** `js/bugi.js` — 원본 이미지(`assets/bugi-reference.png`)를 보고 인라인 SVG로 재현: 남색 외곽선의 큰 둥근 머리, 흰 얼굴, 하늘색 볼, `ω` 입, 오른쪽 뒤 하늘색 등껍질, 과잠 몸통(`jacket.body` 색, 리본, `label` 글자는 `jacket.text` 색), 소매에 학년 배지. 클릭 시 살짝 튀는 CSS 애니메이션(`@keyframes bugi-bounce`). 말풍선은 부기 위.
- [ ] **Step 5:** `home.js` — 부기 클릭할 때마다 `createDialogue(dialogues).next()`를 `setSpeech`. 첫 화면 말풍선은 `'안녕!'`. (상황 대사 연결은 Task 8.)
- [ ] **Step 6:** `npm test` PASS + 브라우저: 부기 표시, 클릭 시 대사 순환·튀는 효과, `data/user.js`의 학부를 바꾸면 과잠 색이 바뀌는지 확인.
- [ ] **Step 7: Commit** `feat: 2D 부기와 학부별 과잠, 말풍선 상호작용`

---

### Task 4: 에세이 문구 카드 + 메모

**Files:**
- Create: `js/lib/memo.js`, `data/tips.js`
- Modify: `js/screens/home.js`
- Test: `tests/memo.test.js`

**Interfaces:**
- Produces: `MEMO_KEY = 'eadvisor.memo'`, `loadMemo(storage) => string` (없거나 예외 → `''`), `saveMemo(storage, text: string) => boolean` (예외 → `false`), `pickEssay(memo: string, tips: string[]) => { text: string, source: 'memo' | 'tip' }` — 공백만 있는 메모는 없는 것으로 취급, 팁이 없으면 `'오늘의 목표를 메모해 보세요'`.
- Produces: `data/tips.js`의 `tips` — 첫 항목 `'정보처리기사 자격증 잊지말자!'`.

- [ ] **Step 1: 실패 테스트**

```js
const mem = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
const throwing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
const s = mem(); assert.equal(saveMemo(s, '토익 신청'), true); assert.equal(loadMemo(s), '토익 신청');
assert.equal(loadMemo(throwing), ''); assert.equal(saveMemo(throwing, 'x'), false);
assert.deepEqual(pickEssay('   ', ['정보처리기사 자격증 잊지말자!']), { text: '정보처리기사 자격증 잊지말자!', source: 'tip' });
assert.deepEqual(pickEssay('토익 신청', ['a']), { text: '토익 신청', source: 'memo' });
assert.equal(pickEssay('', []).text, '오늘의 목표를 메모해 보세요');
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** 구현. `home.js`의 `#essay` 카드: 따옴표 스타일 에세이 문구 + 출처 표시(“부기의 추천” / “나의 메모”) + "메모하기" 버튼 → 카드 안 textarea 편집, 저장 시 `saveMemo(window.localStorage 접근을 try로 감싼 객체, text)` 후 다시 `pickEssay`. 저장 실패 시 "이 브라우저에선 저장되지 않아요" 안내.
- [ ] **Step 4:** `npm test` PASS + 브라우저: 메모 저장 → 새로고침 후 유지, 메모 비우면 추천 문구로 복귀.
- [ ] **Step 5: Commit** `feat: 에세이 문구 카드와 메모`

---

### Task 5: 내 정보 화면

**Files:**
- Create: `js/lib/grades.js`, `data/grades.js`, `js/screens/myinfo.js`
- Test: `tests/grades.test.js`

**Interfaces:**
- Produces: `GRADE_POINTS` (Global Constraints 표), `semesterGpa(courses) => number | null` (P/NP 제외, 대상 없으면 `null`, 소수 둘째 자리 반올림), `cumulativeGpa(semesters) => number | null` (전체 과목 학점 가중 평균), `earnedCredits(semesters) => number` (F·NP 제외), `GRADUATION_CREDITS = 130` *(설계자 판단 — 샘플값)*.
- Produces: `data/grades.js` — `user`의 현재 학기 직전까지 학기 데이터 (3학년 1학기까지 5개 학기), 과목코드는 Task 7의 `courseCompetency` 키와 일치.

- [ ] **Step 1: 실패 테스트**

```js
assert.equal(semesterGpa([{ credits: 3, grade: 'A+' }, { credits: 3, grade: 'B0' }]), 3.75);
assert.equal(semesterGpa([{ credits: 1, grade: 'P' }]), null);
assert.equal(semesterGpa([]), null);
assert.equal(cumulativeGpa([{ courses: [{ credits: 3, grade: 'A0' }] }, { courses: [{ credits: 1, grade: 'C0' }] }]), 3.5);
assert.equal(earnedCredits([{ courses: [{ credits: 3, grade: 'F' }, { credits: 2, grade: 'P' }, { credits: 3, grade: 'B+' }] }]), 5);
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** 구현. `myinfo.js`: 프로필 카드(이름, 학번, 학년·학기, 소속, 트랙), 요약(누적 평점 `x.xx / 4.5`, 이수 학점 `n / 130` 진행 바), 학기별 평점 막대(CSS 막대, `null`이면 `-`), 학기 펼치기 → 과목별 성적 목록.
- [ ] **Step 4:** `npm test` PASS + 브라우저 확인.
- [ ] **Step 5: Commit** `feat: 내 정보 화면과 평점 계산`

---

### Task 6: 대외활동 화면

**Files:**
- Create: `js/lib/activities.js`, `js/api.js`, `data/activities.json`, `js/screens/activities.js`
- Test: `tests/activities.test.js`

**Interfaces:**
- Produces: `data/activities.json` — `{ "items": [{ "id", "title", "organizer", "field", "deadline": "YYYY-MM-DD", "url" }] }` (외부 API 응답 형태), 분야 `공모전/서포터즈/봉사/교육/인턴`, 10개 이상, 마감 지난 항목 1개 이상 포함.
- Produces: `ACTIVITIES_URL = './data/activities.json'`, `fetchActivities(url = ACTIVITIES_URL, fetchFn = fetch) => Promise<Activity[]>` (응답 `items` 반환, 실패 시 throw).
- Produces: `daysLeft(deadline: string, today: Date) => number` (날짜만 비교 — `deadline`은 현지 자정으로 해석, `today`도 날짜만 사용; 오늘 마감 = 0, 포함), `filterActivities(items, { field: string | 'all', today: Date }) => Activity[]` — 마감 지난 항목 제외, 마감 임박순.

- [ ] **Step 1: 실패 테스트**

```js
const today = new Date('2026-11-17T00:00:00');
assert.equal(daysLeft('2026-11-20', today), 3);
const items = [{ field: '공모전', deadline: '2026-12-01' }, { field: '봉사', deadline: '2026-11-20' }, { field: '공모전', deadline: '2026-11-01' }];
assert.deepEqual(filterActivities(items, { field: 'all', today }).map(i => i.deadline), ['2026-11-20', '2026-12-01']);
assert.equal(filterActivities(items, { field: '공모전', today }).length, 1);
const fakeFetch = async () => ({ ok: true, json: async () => ({ items: [{ id: 1 }] }) });
assert.deepEqual(await fetchActivities('x', fakeFetch), [{ id: 1 }]);
await assert.rejects(fetchActivities('x', async () => ({ ok: false, status: 500 })));
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** 구현. 화면: 분야 필터 칩(전체 + 5개), 카드(제목, 주최, 분야, `D-n`), 로딩 표시, 불러오기 실패 시 "대외활동을 불러오지 못했어요" + 다시 시도 버튼, 결과 0개면 빈 상태 문구.
- [ ] **Step 4:** `npm test` PASS + 브라우저 확인 (필터 동작, `ACTIVITIES_URL`을 잘못된 경로로 바꿔 실패 화면 확인 후 원복).
- [ ] **Step 5: Commit** `feat: 대외활동 화면 (샘플 API)`

---

### Task 7: 전공 분석 화면

**Files:**
- Create: `js/lib/competency.js`, `js/lib/radar.js`, `data/courseCompetency.js`, `data/survey.js`, `data/tracks.js`, `js/screens/major.js`
- Test: `tests/competency.test.js`, `tests/radar.test.js`

**Interfaces:**
- Consumes: `GRADE_POINTS`, `data/grades.js` (Task 5).
- Produces: `COMPETENCIES`, `COMPETENCY_LABELS` (`{creativity:'창의력', thinking:'사고력', technical:'기술력', communication:'소통력', analysis:'분석력'}`).
- Produces: `scoreFromGrades(semesters, courseCompetency, gradePoints) => Record<Competency, number>` — 과목마다 `(성적점수/4.5) × 가중치 × 학점`을 역량별로 합산 후 역량별 `가중치×학점` 합으로 나눠 0~100 정규화(반올림). 매핑 없는 과목·P/NP 무시. 근거 없는 역량은 0.
- Produces: `data/survey.js` — `questions: [{ id, text, competency }]` 10문항(역량당 2개), 응답 1~5점.
- Produces: `isSurveyComplete(answers: Record<id, number>, questions) => boolean`, `scoreFromSurvey(answers, questions) => Record<Competency, number>` — 역량별 평균을 `(avg-1)/4×100` 반올림.
- Produces: `combineScores(gradeScores, surveyScores, gradeWeight = 0.6) => Record<Competency, number>` (반올림).
- Produces: `data/tracks.js` — `[{ id, name, college, profile: Record<Competency, number(0~100)>, description }]` 최소 5개 트랙.
- Produces: `recommendTracks(scores, tracks, topN = 3) => [{ track, match: number(0~100), reasons: string[] }]` — `match = 100 - 평균 |차이|` 반올림, 내림차순. `reasons` = 트랙 프로필 상위 2개 역량 중 사용자 점수 60 이상인 것 → `` `${라벨}이(가) 강점이에요` `` *(조사 단순화는 설계자 판단)*.
- Produces: `radarPoints(values: number[], radius: number, cx: number, cy: number) => {x:number, y:number}[]` — 첫 축은 12시 방향, 시계방향, 값 0~100 → 반지름 비율.

- [ ] **Step 1: 실패 테스트**

```js
const gp = { 'A+': 4.5, 'B0': 3.0 };
const sem = [{ courses: [{ code: 'A', credits: 3, grade: 'A+' }, { code: 'B', credits: 3, grade: 'B0' }, { code: 'Z', credits: 3, grade: 'A+' }] }];
const cc = { A: { creativity: 1 }, B: { creativity: 1, thinking: 1 } };
const g = scoreFromGrades(sem, cc, gp);
assert.equal(g.creativity, 83); assert.equal(g.thinking, 67); assert.equal(g.analysis, 0);
const qs = [{ id: 'q1', competency: 'creativity' }, { id: 'q2', competency: 'creativity' }];
assert.equal(isSurveyComplete({ q1: 5 }, qs), false);
assert.equal(scoreFromSurvey({ q1: 5, q2: 3 }, qs).creativity, 75);
assert.equal(combineScores({ creativity: 100 }, { creativity: 50 }).creativity, 80);
const tracks = [{ id: 't1', profile: { creativity: 90, thinking: 50, technical: 50, communication: 50, analysis: 50 } },
                { id: 't2', profile: { creativity: 10, thinking: 50, technical: 50, communication: 50, analysis: 50 } }];
const r = recommendTracks({ creativity: 90, thinking: 50, technical: 50, communication: 50, analysis: 50 }, tracks, 1);
assert.equal(r.length, 1); assert.equal(r[0].track.id, 't1'); assert.equal(r[0].match, 100);
// radar
const p = radarPoints([100, 0, 0, 0, 0], 100, 0, 0);
assert.ok(Math.abs(p[0].x) < 1e-9 && Math.abs(p[0].y + 100) < 1e-9);
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** 구현. 화면 흐름: ① "수강 성적 분석" — 성적 기반 레이더 차트(인라인 SVG, `radarPoints` 사용) + 역량별 높은 과목 근거 ② "역량 설문 시작" → 문항별 1~5 선택, 진행 표시, `isSurveyComplete`가 false면 결과 버튼 비활성 ③ 결과 — 성적+설문 합산 레이더(두 겹: 성적/합산), 추천 트랙 3개 카드(일치도 %, 이유, 설명). 설문 응답은 화면 상태로만 유지.
- [ ] **Step 4:** `npm test` PASS + 브라우저: 설문 미완료 시 버튼 비활성, 완료 후 추천 표시.
- [ ] **Step 5: Commit** `feat: 전공 분석 (역량 분석, 설문, 트랙 추천)`

---

### Task 8: 비교과 프로그램 화면 + 부기 상황 대사 연결

**Files:**
- Create: `js/lib/extracurricular.js`, `data/extracurricular.js`, `js/screens/extracurricular.js`
- Modify: `js/screens/home.js` (상황 대사에 남은 포인트 연결)
- Test: `tests/extracurricular.test.js`

**Interfaces:**
- Consumes: `situationalLines` (Task 3), `user.interests` (Task 2).
- Produces: `data/extracurricular.js` — `programs: [{ id, name, type, points, startDate, endDate, tags: string[] }]` (유형: 공모전, 해커톤, 외국인 상담, 특강, 봉사 등 8개 이상), `records: [{ programId, points, date }]` (합계가 800 미만이 되도록).
- Produces: `GRADUATION_POINTS = 800`, `pointProgress(records, goal = 800) => { earned, remaining, percent }` — `percent`는 0~100 정수로 고정, `remaining` 최소 0.
- Produces: `recommendPrograms(programs, records, interests: string[], today: Date) => Program[]` — 이미 이수한 프로그램·종료된 프로그램 제외, `tags`와 `interests` 겹치는 수 내림차순 → 포인트 내림차순.

- [ ] **Step 1: 실패 테스트**

```js
assert.deepEqual(pointProgress([{ points: 300 }, { points: 100 }]), { earned: 400, remaining: 400, percent: 50 });
assert.deepEqual(pointProgress([{ points: 900 }]), { earned: 900, remaining: 0, percent: 100 });
assert.deepEqual(pointProgress([]), { earned: 0, remaining: 800, percent: 0 });
const today = new Date('2026-11-17');
const programs = [
  { id: 'a', points: 50, endDate: '2026-12-31', tags: ['개발'] },
  { id: 'b', points: 100, endDate: '2026-12-31', tags: [] },
  { id: 'c', points: 80, endDate: '2026-12-31', tags: ['개발', '공모전'] },
  { id: 'd', points: 200, endDate: '2026-11-01', tags: ['개발'] },
  { id: 'e', points: 70, endDate: '2026-12-31', tags: ['개발'] }];
assert.deepEqual(recommendPrograms(programs, [{ programId: 'e', points: 70 }], ['개발', '공모전'], today).map(p => p.id), ['c', 'a', 'b']);
```

- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** 구현. 화면: 원형 또는 막대 진행률(`earned / 800P`, 남은 포인트), "나에게 맞는 추천" 카드 목록(일치 태그 강조), "진행 중인 전체 프로그램" 목록(유형 필터), 이수 내역 목록.
- [ ] **Step 4:** `home.js`에서 `situationalLines({ remainingPoints: pointProgress(records).remaining })`를 대사에 합치기.
- [ ] **Step 5:** `npm test` PASS + 브라우저: 진행률, 추천, 부기 클릭 시 "비교과 포인트 nP 남았어!" 등장.
- [ ] **Step 6: Commit** `feat: 비교과 프로그램 화면과 부기 상황 대사`

---

### Task 9: 마무리 — 반응형 점검 + 실행 안내

**Files:**
- Create: `README.md`
- Modify: `css/style.css` (점검에서 나온 수정)

- [ ] **Step 1:** 브라우저 폭 360px / 768px / 1280px에서 5개 화면 점검: 가로 스크롤 없음, 하단 nav가 내용 가리지 않음(`padding-bottom`), 부기·말풍선 겹침 없음, 글자 잘림 없음. 문제 수정.
- [ ] **Step 2:** 키보드 접근: nav 버튼·부기(`role="button"`, `tabindex="0"`, Enter/Space로 클릭)·설문 선택지가 Tab으로 이동·조작되는지 확인.
- [ ] **Step 3:** `README.md` — 실행 방법(`npm run serve` → `http://localhost:5173`, `npm test`), 폴더 구조 요약, 샘플 데이터 교체 지점(`data/`, `js/api.js`의 `ACTIVITIES_URL`), 3D 부기 교체 지점(`js/bugi.js`의 `renderBugi` 시그니처 유지).
- [ ] **Step 4:** `npm test` 전체 PASS 확인.
- [ ] **Step 5: Commit** `docs: 실행 안내와 반응형 마무리`
