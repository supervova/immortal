export default function initFlayouts() {
  const flayouts = Array.from(
    document.querySelectorAll('[data-role="flayout"]')
  );
  const profileMenuId = 'header-profile-menu'; // ID профиля меню

  // Обработчик клика по документу
  document.addEventListener('click', (event) => {
    flayouts.forEach((el) => {
      // Пропускаем обработку для #header-profile-menu на экранах < 768px
      if (el.id === profileMenuId && window.innerWidth < 768) {
        return;
      }

      // Если клик произошел вне поповера, закрываем его
      if (!el.contains(event.target)) {
        el.removeAttribute('open');
      }
    });
  });

  // Обработчик нажатия клавиши
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Esc' || event.key === 'Escape') {
      const openFlayout = document.querySelector('[data-role="flayout"][open]');
      if (openFlayout) {
        openFlayout.removeAttribute('open');
      }
    }
  });
}
