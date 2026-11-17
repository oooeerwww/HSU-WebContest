// 2D 부기 렌더러.
// 3D 부기로 바꿀 때는 이 파일만 교체하고 renderBugi(container, jacket) 의
// 반환 형태 { setSpeech, onClick } 을 그대로 유지하면 된다.

const NAVY = '#0B2F6B';
const SKY = '#A9C4E8';

function bugiSvg(jacket) {
  return `
<svg class="bugi__svg" viewBox="0 0 300 400" role="img" aria-label="${jacket.label} 과잠을 입은 부기">
  <g stroke="${NAVY}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- 꼬리 -->
    <path d="M196 352 q 40 6 56 -10 q -6 26 -50 30 z" fill="#fff"/>
    <!-- 등껍질 -->
    <ellipse cx="214" cy="272" rx="58" ry="86" fill="${SKY}"/>
    <path d="M168 230 q 46 6 96 -4 M164 290 q 50 8 104 -6 M222 188 q 10 40 4 84 q -6 44 4 84" fill="none" stroke-width="5"/>
    <!-- 다리 -->
    <rect x="104" y="318" width="38" height="60" rx="16" fill="#fff"/>
    <rect x="152" y="318" width="38" height="60" rx="16" fill="#fff"/>
    <!-- 과잠 몸통 -->
    <path d="M96 236 q 50 -26 104 0 l 14 98 q -66 18 -132 0 z" fill="${jacket.body}"/>
  </g>
  <!-- 과잠 리본 끈 -->
  <g stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M147 246 q -12 -12 -18 0 q 6 10 18 0 q 12 -12 18 0 q -6 10 -18 0"/>
    <path d="M144 250 l -5 20 M150 250 l 5 20"/>
  </g>
  <!-- 과잠 글씨 -->
  <text x="148" y="312" text-anchor="middle" font-family="Pretendard Variable, Pretendard, sans-serif"
        font-size="30" font-weight="900" fill="${jacket.text}" letter-spacing="1">${jacket.label}</text>
  <!-- 학년 배지 -->
  <g class="bugi__badge">
    <circle cx="190" cy="324" r="13" fill="${jacket.accent}" stroke="${NAVY}" stroke-width="3"/>
    <text x="190" y="329.5" text-anchor="middle" font-family="Pretendard Variable, Pretendard, sans-serif"
          font-size="15" font-weight="900" fill="${NAVY}">${jacket.yearBadge}</text>
  </g>
  <!-- 손 -->
  <g stroke="${NAVY}" stroke-width="6" fill="#fff" stroke-linecap="round" stroke-linejoin="round">
    <path d="M100 248 q -18 22 -6 46 q 18 10 30 -6 q -6 -30 -24 -40 z"/>
    <path d="M196 248 q 18 22 6 46 q -18 10 -30 -6 q 6 -30 24 -40 z"/>
  </g>
  <!-- 머리 -->
  <circle cx="150" cy="130" r="108" fill="${NAVY}"/>
  <circle cx="150" cy="140" r="86" fill="#fff"/>
  <!-- 볼 -->
  <circle cx="98" cy="150" r="19" fill="${SKY}"/>
  <circle cx="202" cy="150" r="19" fill="${SKY}"/>
  <g stroke="${NAVY}" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- 이마 무늬 -->
    <path d="M130 84 q 10 -12 22 -2 q -4 10 -14 10 q 14 2 12 14 q -8 8 -22 0" stroke-width="6"/>
    <!-- 눈 -->
    <path class="bugi__eye" d="M126 128 v 10 M174 128 v 10" stroke-width="6"/>
    <!-- 입 -->
    <path d="M124 150 q 13 14 26 0 q 13 14 26 0" stroke-width="5"/>
  </g>
</svg>`;
}

/**
 * @param {HTMLElement} container
 * @param {{ body: string, accent: string, text: string, label: string, yearBadge: string }} jacket
 * @returns {{ setSpeech(text: string): void, onClick(handler: () => void): void }}
 */
export function renderBugi(container, jacket) {
  container.classList.add('bugi');
  container.innerHTML = `
    <div class="bugi__bubble" aria-live="polite"><p class="bugi__speech"></p></div>
    <div class="bugi__stage" role="button" tabindex="0" aria-label="부기와 대화하기">
      ${bugiSvg(jacket)}
      <span class="bugi__shadow" aria-hidden="true"></span>
    </div>`;

  const speech = container.querySelector('.bugi__speech');
  const bubble = container.querySelector('.bugi__bubble');
  const stage = container.querySelector('.bugi__stage');
  const handlers = [];

  const fire = () => {
    stage.classList.remove('is-bouncing');
    void stage.offsetWidth; // 애니메이션 다시 시작
    stage.classList.add('is-bouncing');
    handlers.forEach((h) => h());
  };
  stage.addEventListener('click', fire);
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fire();
    }
  });

  return {
    setSpeech(text) {
      speech.textContent = text;
      bubble.classList.remove('is-popping');
      void bubble.offsetWidth;
      bubble.classList.add('is-popping');
    },
    onClick(handler) {
      handlers.push(handler);
    },
  };
}
