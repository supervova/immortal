function initCollapsibleText() {
  const showChar = 160; // Сколько символов показывать по умолчанию
  const textMore = 'More';
  const textLess = 'Less';

  const collapsibleText = document.querySelectorAll('.e-collapsible');

  collapsibleText.forEach((input) => {
    const element = input;
    const content = element.innerHTML;

    if (content.length > showChar) {
      const visibleText = content.slice(0, showChar);
      const hiddenText = content.slice(showChar);

      const html = `
        <span class="e-collapsible__visible">${visibleText}…</span>
        <span class="e-collapsible__body">
          <span class="e-collapsible__hidden">${hiddenText}</span>
          <button class="e-collapsible__toggle" type="button">${textMore}</button>
        </span>
      `;

      element.innerHTML = html;
    }
  });

  // Делегируем обработчик событий на документ
  document.addEventListener('click', (event) => {
    const { target } = event;

    if (target.classList.contains('e-collapsible__toggle')) {
      event.preventDefault();

      const collapsibleToggle = target;
      const collapsibleBody = collapsibleToggle.closest('.e-collapsible__body');
      const hiddenContent = collapsibleBody.querySelector(
        '.e-collapsible__hidden'
      );
      const visibleContent = collapsibleBody.previousElementSibling;

      if (collapsibleToggle.classList.contains('is-less')) {
        // Возврат к initial состоянию
        collapsibleToggle.classList.remove('is-less');
        collapsibleToggle.textContent = textMore;
        hiddenContent.style.display = 'none';
        visibleContent.style.display = 'inline';
      } else {
        // Развернутое состояние
        collapsibleToggle.classList.add('is-less');
        collapsibleToggle.textContent = textLess;
        hiddenContent.style.display = 'inline';
        visibleContent.style.display = 'none';
      }
    }
  });
}

export default initCollapsibleText;
