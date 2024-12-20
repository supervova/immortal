import initCollapsibleText from './collapsibleText.js';
import initDrawer from './drawer.js';
import initFlyouts from './flyout.js';
import initModals, { openModal } from './modal.js';
import initTextareaAutoResize from './chat.js';
import { initProfileMenuHandler, initSearchHandler } from './header.js';
import { initializeAuthorizationForm } from './authorization.js';

document.addEventListener('DOMContentLoaded', () => {
  initFlyouts();
  initModals();
  initDrawer();
  initSearchHandler();
  initProfileMenuHandler();
  initCollapsibleText();

  initTextareaAutoResize(
    '.is-chat-input textarea',
    '.is-chat-input .e-btn',
    '.e-form.is-chat-input'
  );

  initializeAuthorizationForm({
    emailInputSelector: '#input-email',
    passwordInputSelector: '#input-password',
    submitButtonSelector: 'button[type="submit"].is-primary',
    passwordToggleSelector: '.e-form__control.is-password .e-btn',
    eyeSlashIconSelector: '.e-icon.is-eye-slash',
    eyeIconSelector: '.e-icon.is-eye',
  });

  // Set `is-active` class to matching menu items
  const page = document.querySelector('.e-page');
  const currentPageClass = page?.classList[1];

  if (currentPageClass) {
    const activeMenuItems = document.querySelectorAll(
      `.e-menu__item.${currentPageClass}`
    );

    activeMenuItems.forEach((item) => {
      item.classList.add('is-active');
    });
  }
});

// eslint-disable-next-line import/prefer-default-export
export { openModal };
