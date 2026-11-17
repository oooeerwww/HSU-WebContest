import { renderBugi } from '../bugi.js';
import { getJacket } from '../lib/jacket.js';
import { createDialogue } from '../lib/dialogue.js';
import { user } from '../../data/user.js';
import { jackets } from '../../data/jackets.js';
import { dialogues } from '../../data/dialogues.js';

export function render(root) {
  const bugiEl = document.createElement('section');
  const essayEl = document.createElement('section');
  essayEl.id = 'essay';
  root.append(bugiEl, essayEl);

  const bugi = renderBugi(bugiEl, getJacket(user, jackets));
  const dialogue = createDialogue(dialogues);
  bugi.setSpeech('안녕!');
  dialogue.next(); // 첫 대사는 이미 보여줬으니 넘긴다
  bugi.onClick(() => bugi.setSpeech(dialogue.next()));
}
