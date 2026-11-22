import type { gameStations } from './gameStations';
import { sitePath } from './paths';
import '../styles/field-quiz.css';

type Observation = Pick<(typeof gameStations)[number], 'art' | 'question' | 'choices' | 'answer' | 'hint'>;

/** Both halves of the specimen plate are answer buttons with equivalent text. */
export function renderFieldQuiz(panel: HTMLElement, station: Observation, onCorrect: () => void) {
  panel.querySelector<HTMLElement>('[data-question]')!.textContent = station.question;
  panel.querySelector<HTMLElement>('[data-quiz-guide]')!.textContent = '比較兩張特寫。點選符合的圖，或依下方文字作答。';
  const note = panel.querySelector<HTMLElement>('[data-quiz-note]')!;
  note.textContent = '';
  const illustration = sitePath(`game-art/${station.art}-observation.svg`);
  const answers = station.choices.map((description, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.choice = String(index);
    const crop = document.createElement('span');
    crop.className = 'fg-specimen-crop';
    const image = document.createElement('img');
    image.src = illustration;
    image.alt = '';
    image.width = 600;
    image.height = 214;
    crop.append(image);
    const label = document.createElement('span');
    label.className = 'fg-specimen-caption';
    label.textContent = description;
    button.append(crop, label);
    button.addEventListener('click', () => {
      if (index === station.answer) {
        onCorrect();
      } else {
        button.classList.add('is-incorrect');
        note.textContent = station.hint;
      }
    });
    return button;
  });
  panel.querySelector('[data-choices]')!.replaceChildren(...answers);
}
