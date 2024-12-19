// Регулярные выражения для проверки email и пароля
const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Функция для проверки валидности формы
function checkFormValidity(emailInput, passwordInput, submitButtonElement) {
  const isEmailValid = emailPattern.test(emailInput.value);
  const isPasswordValid = passwordPattern.test(passwordInput.value);

  // Используем локальную переменную для ссылки на элемент
  const buttonElement = submitButtonElement;
  buttonElement.disabled = !(isEmailValid && isPasswordValid);
}

// Функция для инициализации событий
function initializeAuthorizationForm({
  emailInputSelector,
  passwordInputSelector,
  submitButtonSelector,
  passwordToggleSelector,
  eyeSlashIconSelector,
  eyeIconSelector,
}) {
  const emailInput = document.querySelector(emailInputSelector);
  const passwordInput = document.querySelector(passwordInputSelector);
  const submitButton = document.querySelector(submitButtonSelector);
  const passwordToggleButton = document.querySelector(passwordToggleSelector);
  const eyeSlashIcon = document.querySelector(eyeSlashIconSelector);
  const eyeIcon = document.querySelector(eyeIconSelector);

  if (
    !emailInput ||
    !passwordInput ||
    !submitButton ||
    !passwordToggleButton ||
    !eyeSlashIcon ||
    !eyeIcon
  ) {
    // eslint-disable-next-line no-console
    console.error('Failed to find one or more items for authorization.');
    return;
  }

  // Слушатели событий для проверки валидации при вводе
  emailInput.addEventListener('input', () =>
    checkFormValidity(emailInput, passwordInput, submitButton)
  );
  passwordInput.addEventListener('input', () =>
    checkFormValidity(emailInput, passwordInput, submitButton)
  );

  // Переключение видимости пароля
  passwordToggleButton.addEventListener('click', () => {
    const isPasswordVisible = passwordInput.type === 'text';

    // Переключить тип поля
    passwordInput.type = isPasswordVisible ? 'password' : 'text';

    // Переключить классы у иконок
    eyeSlashIcon.classList.toggle('d-none', !isPasswordVisible);
    eyeIcon.classList.toggle('d-none', isPasswordVisible);
  });

  // Начальная проверка валидности
  checkFormValidity(emailInput, passwordInput, submitButton);
}

export default initializeAuthorizationForm;
