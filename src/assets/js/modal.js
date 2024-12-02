const animationDuration = 400;
let visibleModal = null;

// Add `is-pinned` class to a modal header
const toggleTitleStyle = (el, root) => {
  if (window.matchMedia('(max-width: 767px)').matches) {
    const observer = new IntersectionObserver(
      ([entry]) =>
        el.classList.toggle('is-pinned', entry.intersectionRatio < 1),
      {
        threshold: [1],
        root: document.querySelector(root),
        rootMargin: '0px 50px',
      }
    );
    observer.observe(el);
  }
};

// Open an external page in the modal window
const getExternalContent = (event) => {
  const modalExternal = document.getElementById('modal-external');
  const container = modalExternal.querySelector('.e-modal__content');
  const href = event.currentTarget.getAttribute('href');

  event.preventDefault();

  fetch(href)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const contentSource = parser.parseFromString(html, 'text/html');
      const content = contentSource.querySelector('.content').innerHTML;
      container.insertAdjacentHTML('beforeend', content);
    });

  modalExternal.addEventListener('close', () => {
    container.innerHTML = '';
  });
};

// 👉 Close modal
const closeModal = (modal) => {
  if (!modal || modal.hasAttribute('closing')) {
    return; // Если модальное окно уже закрывается, выходим
  }

  visibleModal = null;
  modal.setAttribute('closing', ''); // Устанавливаем атрибут closing

  modal.addEventListener(
    'transitionend',
    () => {
      modal.removeAttribute('closing'); // Убираем атрибут после анимации
      if (typeof modal.close === 'function') {
        modal.close(); // Закрываем диалог
      }
    },
    { once: true }
  );
};

// Open modal
export const openModal = (modal) => {
  setTimeout(() => {
    visibleModal = modal;
  }, animationDuration);
  modal.showModal();

  const header = modal.querySelector('header');
  if (header) {
    toggleTitleStyle(header, '.e-modal[open]');
  }
};

// Toggle modal
const modalToggle = (event) => {
  const trigger = event.currentTarget;
  const isLink = trigger.hasAttribute('href');
  const win = trigger.getAttribute('data-target');
  const modal = document.getElementById(win);

  event.preventDefault();

  if (modal.open) {
    closeModal(modal);
  } else {
    openModal(modal);
  }

  if (isLink) {
    getExternalContent(event);
  }
};

// Initialize modals
const initModals = () => {
  // Close with a click outside
  document.addEventListener('click', (event) => {
    if (!visibleModal) return;

    const modalContent = visibleModal.firstElementChild;
    const isClickInside = modalContent.contains(event.target);

    if (!isClickInside) {
      closeModal(visibleModal);
    }
  });

  // Close with 'Cancel' and 'X' buttons
  document.querySelectorAll('[data-role="close-modal"]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const modal = event.currentTarget.closest('.e-modal');
      closeModal(modal);
    });
  });

  // Set listeners on modal openers
  document.querySelectorAll('[data-role="open-modal"]').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      modalToggle(event);
    });
  });
};

export default initModals;
