// Get external content, utilities
import initModals, { openModal } from './modal.js';

import initDrawer from './drawer.js';

// Close flayouts on Esc
import initFlayouts from './flayout.js';

// Chat input dynamic resize
import initTextareaAutoResize from './chat.js';

document.addEventListener('DOMContentLoaded', () => {
  initFlayouts();
  initModals();
  initDrawer();

  initTextareaAutoResize(
    '.is-chat-input textarea',
    '.is-chat-input .e-btn',
    '.e-form.is-chat-input'
  );
});

// eslint-disable-next-line import/prefer-default-export
export { openModal };
