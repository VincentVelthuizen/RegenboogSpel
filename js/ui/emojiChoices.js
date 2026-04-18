let onTapCallback = null;

export function bindChoices(handler) {
  onTapCallback = handler;
}

export function renderChoices(state) {
  const container = document.getElementById('emoji-choices');
  container.innerHTML = '';

  if (state.phase !== 'playing') return;

  state.currentChoices.forEach((emoji, index) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.type = 'button';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', `optie ${index + 1}`);
    btn.addEventListener('click', () => {
      if (onTapCallback) onTapCallback(index, btn);
    });
    container.appendChild(btn);
  });
}

export function markHintBounce(correctIndex) {
  const buttons = document.querySelectorAll('#emoji-choices .emoji-btn');
  const btn = buttons[correctIndex];
  if (btn) btn.classList.add('hint-bounce');
}

export function clearHintBounce() {
  const buttons = document.querySelectorAll('#emoji-choices .emoji-btn');
  buttons.forEach((b) => b.classList.remove('hint-bounce'));
}
