# HSU e-Advisor (프로토타입)

한성대 진로로드맵 e-Advisor 웹앱 공모전용 프로토타입입니다.
메인 화면(학년·학기, 과잠 입은 부기, 말풍선, 에세이 문구)과 하단 4개 메뉴(내 정보 · 대외활동 · 전공 분석 · 비교과)가
**샘플 데이터**로 동작합니다.

- 설계: [`docs/superpowers/specs/2026-11-17-main-ui-design.md`](docs/superpowers/specs/2026-11-17-main-ui-design.md)
- 구현 계획: [`docs/superpowers/plans/2026-11-17-main-ui-prototype.md`](docs/superpowers/plans/2026-11-17-main-ui-prototype.md)
- 공모전 정리: [`HSU_e-Advisor_공모전_정리.md`](HSU_e-Advisor_공모전_정리.md)

## 실행

Node.js 18 이상만 있으면 됩니다 (설치할 패키지 없음).

```bash
npm run serve   # http://localhost:5173 에서 열기
npm test        # 계산 로직 단위 테스트
```

> `index.html`을 더블클릭해서 열면 동작하지 않습니다. ES 모듈은 `file://`에서 막히므로 꼭 `npm run serve`로 여세요.

## 폴더 구조

```
index.html            앱 셸 (상단 정보 · 화면 · 하단 메뉴)
css/style.css         디자인 토큰과 전체 스타일
js/main.js            화면 전환
js/bugi.js            2D 부기 (3D 교체 지점)
js/api.js             대외활동 데이터 로더 (외부 API 교체 지점)
js/ui.js              공용 DOM 도우미
js/lib/               계산 로직 (DOM 없음, 테스트 대상)
js/screens/           화면별 렌더링
data/                 샘플 데이터
tests/                단위 테스트 (node --test)
scripts/serve.mjs     로컬 정적 서버
```

## 실제 데이터로 바꾸는 곳

| 바꿀 것 | 위치 |
|---|---|
| 사용자 정보, 관심사 | `data/user.js` |
| 수강 성적 | `data/grades.js` |
| 과목별 역량 매핑 | `data/courseCompetency.js` |
| 전공트랙 역량 프로필 | `data/tracks.js` |
| 역량 설문 문항 | `data/survey.js` |
| 비교과 프로그램 / 이수 내역 | `data/extracurricular.js` |
| 대외활동 API | `js/api.js`의 `ACTIVITIES_URL` (응답은 `{ items: [...] }` 형태) |
| 학부별 과잠 색 | `data/jackets.js` |
| 부기 대사 / 추천 문구 | `data/dialogues.js`, `data/tips.js` |

## 3D 부기로 교체하기

`js/bugi.js` 하나만 교체하면 됩니다. 아래 함수 모양만 그대로 유지하세요.

```js
renderBugi(container, jacket) // → { setSpeech(text), onClick(handler) }
// jacket = { body, accent, text, label, yearBadge }  (js/lib/jacket.js 의 getJacket 결과)
```

## 계산 규칙 요약

- 평점: 4.5 만점, 학점 가중 평균. P/NP는 평점에서 제외, F·NP는 취득 학점에서 제외.
- 역량 점수(성적): 과목 성적을 D0=0 ~ A+=100으로 환산 → 과목별 역량 가중치 × 학점으로 가중 평균.
- 역량 점수(설문): 1~5점 평균을 0~100으로 환산. 최종 = 성적 60% + 설문 40%.
- 전공 추천: 역량 점수와 트랙 프로필의 평균 차이가 작을수록 일치도가 높음.
- 비교과: 졸업요건 800P. 추천은 관심사 태그가 많이 겹치는 순 → 포인트 높은 순. 이수했거나 종료된 프로그램은 제외.
