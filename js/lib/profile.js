/** '3학년 2학기' */
export function formatTerm(user) {
  return `${user.year}학년 ${user.semester}학기`;
}

/** 'IT공과대학 컴퓨터공학부' (학부가 없으면 대학만) */
export function formatAffiliation(user) {
  return [user.college, user.department].filter(Boolean).join(' ');
}
