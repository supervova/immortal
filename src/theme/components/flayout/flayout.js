export default function initFlayouts() {
  // Получаем все элементы с атрибутом data-role="flayout"
  const flayouts = Array.from(
    document.querySelectorAll('[data-role="flayout"]')
  );

  // Обработчик клика по документу
  document.addEventListener('click', (event) => {
    flayouts.forEach((el) => {
      // Если клик произошел вне поповера, закрываем его
      if (!el.contains(event.target)) {
        el.removeAttribute('open');
      }
    });
  });

  // Обработчик нажатия клавиши
  window.addEventListener('keydown', (event) => {
    // Если нажата клавиша Esc, закрываем открытый поповер
    if (event.key === 'Esc' || event.key === 'Escape') {
      const openFlayout = document.querySelector('[data-role="flayout"][open]');
      if (openFlayout) {
        openFlayout.removeAttribute('open');
      }
    }
  });
}
