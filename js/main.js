import { resolveScreen } from './lib/router.js';

// 화면 이름 → 모듈 로더. 화면 모듈은 render(root) 를 export 한다.
const LOADERS = {
  home: () => import('./screens/home.js'),
  myinfo: () => import('./screens/myinfo.js'),
  activities: () => import('./screens/activities.js'),
  major: () => import('./screens/major.js'),
  extracurricular: () => import('./screens/extracurricular.js'),
};

const app = document.querySelector('.app');
const screenEl = document.getElementById('screen');
const topInfo = document.getElementById('top-info');
const navButtons = [...document.querySelectorAll('#bottom-nav [data-screen]')];

let renderId = 0;

async function show(hash) {
  const name = resolveScreen(hash);
  const id = ++renderId;
  app.dataset.screen = name;
  navButtons.forEach((b) => {
    const active = b.dataset.screen === name;
    b.classList.toggle('is-active', active);
    if (active) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });

  let mod;
  try {
    mod = await LOADERS[name]();
  } catch (err) {
    console.warn(`[e-Advisor] ${name} 화면 로드 실패`, err);
    mod = null;
  }
  if (id !== renderId) return; // 그 사이 다른 화면으로 이동함

  screenEl.replaceChildren();
  if (mod?.render) {
    await mod.render(screenEl);
  } else {
    screenEl.innerHTML = '<p class="empty">준비 중인 화면이에요.</p>';
  }
  window.scrollTo(0, 0);
}

navButtons.forEach((b) =>
  b.addEventListener('click', () => {
    location.hash = b.dataset.screen;
  }),
);
topInfo.addEventListener('click', () => { location.hash = 'home'; });
window.addEventListener('hashchange', () => show(location.hash));

topInfo.textContent = 'e-Advisor';
show(location.hash);
