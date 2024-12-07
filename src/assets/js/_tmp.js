document.addEventListener('DOMContentLoaded', () => {
  const billingButtons = document.querySelectorAll(
    '.e-segmented-control__item'
  );
  const yearlyDiscountElement = document.querySelector('.e-yearly-discount');
  const planInputs = document.querySelectorAll(
    '.e-card__eyebrow input[type="radio"]'
  );
  const slider = document.getElementById('input-yearly-discounts');
  const feeLight = document.getElementById('monthly-fee-light');
  const feeStandard = document.getElementById('monthly-fee-standard');
  const feeLightSuffix = feeLight.nextElementSibling; // <small> после #monthly-fee-light
  const feeStandardSuffix = feeStandard.nextElementSibling; // <small> после #monthly-fee-standard

  // Таблица цен для Annual Billing
  const priceTable = [
    { years: 1, light: 83, standard: 250 },
    { years: 2, light: 79, standard: 238 },
    { years: 3, light: 75, standard: 226 },
    { years: 4, light: 71, standard: 214 },
    { years: 5, light: 68, standard: 204 },
    { years: 6, light: 64, standard: 193 },
    { years: 7, light: 61, standard: 184 },
    { years: 8, light: 58, standard: 175 },
    { years: 9, light: 55, standard: 167 },
    { years: 10, light: 53, standard: 159 },
    { years: 11, light: 50, standard: 152 },
    { years: 12, light: 48, standard: 145 },
    { years: 13, light: 46, standard: 139 },
    { years: 14, light: 44, standard: 133 },
    { years: 15, light: 42, standard: 127 },
    { years: 16, light: 41, standard: 122 },
    { years: 17, light: 39, standard: 117 },
    { years: 18, light: 37, standard: 112 },
    { years: 19, light: 36, standard: 108 },
    { years: 20, light: 35, standard: 104 },
    { years: 21, light: 33, standard: 100 },
    { years: 22, light: 32, standard: 96 },
    { years: 23, light: 31, standard: 93 },
    { years: 24, light: 30, standard: 89 },
    { years: 25, light: 29, standard: 86 },
    { years: 26, light: 28, standard: 83 },
    { years: 27, light: 27, standard: 81 },
    { years: 28, light: 26, standard: 78 },
    { years: 29, light: 25, standard: 75 },
  ];

  // Обновление цен на основе значения ползунка (Annual Billing)
  function updateAnnualPrices(sliderValue) {
    const price = priceTable[sliderValue] || priceTable[0];
    feeLight.textContent = price.light;
    feeStandard.textContent = price.standard;
    feeLightSuffix.textContent = '/ monthly';
    feeStandardSuffix.textContent = '/ monthly';
  }

  // Обновление цен для Daily Billing
  function updateDailyPrices() {
    feeLight.textContent = 4;
    feeStandard.textContent = 11;
    feeLightSuffix.textContent = '/ daily';
    feeStandardSuffix.textContent = '/ daily';
  }

  // Обновление цен для Monthly Billing
  function updateMonthlyPrices() {
    feeLight.textContent = 95;
    feeStandard.textContent = 286;
    feeLightSuffix.textContent = '/ monthly';
    feeStandardSuffix.textContent = '/ monthly';
  }

  // Сброс состояния yearlyDiscountElement
  function resetYearlyDiscount() {
    yearlyDiscountElement.classList.add('is-disabled');
  }

  // Удаление класса is-disabled у yearlyDiscountElement
  function enableYearlyDiscount() {
    yearlyDiscountElement.classList.remove('is-disabled');
  }

  // Обработчик для кнопок биллинга
  billingButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      billingButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');

      if (index === 0) {
        resetYearlyDiscount();
        updateDailyPrices();
      } else if (index === 1) {
        resetYearlyDiscount();
        updateMonthlyPrices();
      } else if (index === 2) {
        enableYearlyDiscount();
        updateAnnualPrices(slider.value);
      }
    });
  });

  // Обработчик для радиокнопок
  planInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.value === 'unlimited') {
        resetYearlyDiscount();
      } else if (input.value === 'standard') {
        enableYearlyDiscount();
      } else if (
        input.value === 'light' &&
        billingButtons[2].classList.contains('is-active')
      ) {
        enableYearlyDiscount();
      }
    });
  });

  // Обработчик изменения ползунка
  slider.addEventListener('input', (e) => {
    if (billingButtons[2].classList.contains('is-active')) {
      const sliderValue = parseInt(e.target.value, 10);
      updateAnnualPrices(sliderValue);
    }
  });
});
