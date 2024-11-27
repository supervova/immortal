// Get external content, utilities
import initModals from './modal.js';

// Close flayouts on Esc
import initFlayouts from './flayout.js';

document.addEventListener('DOMContentLoaded', () => {
  initFlayouts();
  initModals();
});
