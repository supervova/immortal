function initCollapsibleText() {
  const showChar = 160; // How many characters to show by default
  const textMore = 'More';
  const textLess = 'Less';

  const collapsibleText = document.querySelectorAll('.e-collapsible');

  collapsibleText.forEach((element) => {
    const content = element.innerHTML;

    if (content.length > showChar) {
      const visibleText = content.slice(0, showChar);
      const hiddenText = content.slice(showChar);

      const html = `
        ${visibleText}…
        <span class="e-collapsible__body">
          <span>${hiddenText}</span>&nbsp;
          <button class="e-collapsible__toggle" type="button">${textMore}</button>
        </span>
      `;

      const newElement = element; // Create a local reference
      newElement.innerHTML = html; // Modify the local reference
    }
  });

  // Делегируем обработчик событий на документ
  document.addEventListener('click', (event) => {
    const { target } = event;

    if (target.classList.contains('e-collapsible__toggle')) {
      event.preventDefault();

      const collapsibleToggle = target;
      const moreContent = collapsibleToggle.previousElementSibling;
      const ellipses = collapsibleToggle.parentElement.previousElementSibling;

      if (collapsibleToggle.classList.contains('is-less')) {
        collapsibleToggle.classList.remove('is-less');
        collapsibleToggle.textContent = textMore;
      } else {
        collapsibleToggle.classList.add('is-less');
        collapsibleToggle.textContent = textLess;
      }

      // Переключаем видимость текста
      moreContent.style.display =
        moreContent.style.display === 'none' ? 'inline' : 'none';
      ellipses.style.display =
        ellipses.style.display === 'none' ? 'inline' : 'none';
    }
  });
}

export default initCollapsibleText;
