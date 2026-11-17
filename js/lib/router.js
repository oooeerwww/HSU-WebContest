export const SCREENS = ['home', 'myinfo', 'activities', 'major', 'extracurricular'];

/** URL 해시(#major 등)를 화면 이름으로 바꾼다. 모르는 값은 home. */
export function resolveScreen(hash) {
  const name = String(hash ?? '').replace(/^#/, '');
  return SCREENS.includes(name) ? name : 'home';
}
