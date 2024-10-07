// Get external content, utilities
import initModals from './components/modal/modal.js';

// Close flayouts on Esc
import initFlayouts from './components/flayout/flayout.js';

document.addEventListener('DOMContentLoaded', () => {
  initFlayouts();
  initModals();
});
