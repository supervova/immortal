export default function copyLink(buttonSelector, successMessageSelector) {
  const copyButton = document.querySelector(buttonSelector);
  const successMessage = document.querySelector(successMessageSelector);

  if (!copyButton || !successMessage) return;

  copyButton.addEventListener('click', async () => {
    const url = copyButton.getAttribute('data-href');

    try {
      await navigator.clipboard.writeText(url);
      successMessage.classList.add('is-visible');
      setTimeout(() => {
        successMessage.classList.remove('is-visible');
      }, 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy text: ', err);
    }
  });
}
