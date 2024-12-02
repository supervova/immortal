function initTextareaAutoResize(
  textareaSelector,
  sendButtonSelector,
  formSelector
) {
  const chatInput = document.querySelector(textareaSelector);
  const sendButton = document.querySelector(sendButtonSelector);
  const form = document.querySelector(formSelector);

  if (!chatInput || !sendButton || !form) {
    return;
  }

  const initialHeight = chatInput.offsetHeight;

  const resizeTextarea = () => {
    chatInput.style.height = 'auto'; // Сброс высоты перед измерением
    const maxHeight = parseInt(getComputedStyle(chatInput).maxHeight, 10);
    const newHeight = Math.min(chatInput.scrollHeight, maxHeight);
    chatInput.style.height = `${newHeight}px`; // Устанавливаем новую высоту
  };

  chatInput.addEventListener('input', () => {
    resizeTextarea();

    // Активируем/деактивируем кнопку отправки
    const hasContent = chatInput.value.trim() !== '';
    sendButton.disabled = !hasContent;
  });

  const resetHeight = () => {
    chatInput.style.height = `${initialHeight}px`;
    sendButton.disabled = true;
  };

  sendButton.addEventListener('click', (e) => {
    if (chatInput.value.trim() === '') {
      e.preventDefault();
    }
  });

  chatInput.addEventListener('blur', () => {
    if (chatInput.value.trim() === '') {
      resetHeight();
    }
  });

  form.addEventListener('submit', (e) => {
    if (chatInput.value.trim() === '') {
      e.preventDefault();
    }
  });
}

export default initTextareaAutoResize;
