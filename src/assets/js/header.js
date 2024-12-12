/**
 * ---------------------------------------------------------------------------
 * PROFILE MENU HANDLER
 * ---------------------------------------------------------------------------
 */

// Управляет состоянием <details> на мобильных устройствах
function toggleProfileMenuOnResize() {
  const details = document.getElementById('header-profile-menu');

  if (!details) return; // Если элемент не найден, выходим

  if (window.innerWidth < 768) {
    // На мобильных устройствах всегда открываем
    details.setAttribute('open', 'open');
  } else {
    // На планшетах и ПК возвращаем стандартное поведение
    details.removeAttribute('open');
  }
}

// Инициализирует обработчик для <details>
function initProfileMenuHandler() {
  toggleProfileMenuOnResize();
  window.addEventListener('resize', toggleProfileMenuOnResize);
}

/**
 * ---------------------------------------------------------------------------
 * SEARCH FORM HANDLER
 * ---------------------------------------------------------------------------
 */

const initSearchHandler = () => {
  const searchToggleButtons = document.querySelectorAll(
    '[data-role="search-toggle"]'
  );
  let backdrop; // Элемент backdrop будет создан и управляться здесь

  const createBackdrop = () => {
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'backdrop';
      document.body.appendChild(backdrop);
    }
    backdrop.classList.add('is-on');
  };

  const removeBackdrop = () => {
    if (backdrop) {
      backdrop.classList.remove('is-on');
    }
  };

  searchToggleButtons.forEach((button) => {
    button.addEventListener('click', (clickEvent) => {
      clickEvent.stopPropagation();
      const targetId = button.getAttribute('data-target');
      const searchForm = document.getElementById(targetId);

      if (searchForm && searchForm.getAttribute('role') === 'search') {
        const handleOutsideClick = (e) => {
          if (
            (e.type === 'keydown' && e.key !== 'Escape') ||
            (e.type === 'click' && searchForm.contains(e.target))
          ) {
            return;
          }

          searchForm.classList.remove('is-open');
          removeBackdrop();
          document.removeEventListener('keydown', handleOutsideClick);
          document.removeEventListener('click', handleOutsideClick);
        };

        if (searchForm.classList.contains('is-open')) {
          searchForm.classList.remove('is-open');
          removeBackdrop();
          document.removeEventListener('keydown', handleOutsideClick);
          document.removeEventListener('click', handleOutsideClick);
          return;
        }

        searchForm.classList.add('is-open');
        createBackdrop();

        const input = searchForm.querySelector('input[type="search"]');
        if (input) input.focus();

        document.addEventListener('keydown', handleOutsideClick);
        document.addEventListener('click', handleOutsideClick, { once: true });
      }
    });
  });

  const searchForms = document.querySelectorAll('[role="search"]');
  searchForms.forEach((form) => {
    form.addEventListener('click', (formClickEvent) => {
      formClickEvent.stopPropagation();
    });
  });
};

export { initProfileMenuHandler, initSearchHandler };
