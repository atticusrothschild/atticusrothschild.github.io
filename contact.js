(() => {
  const button = document.querySelector('[data-copy-email]');
  if (!button) return;
  const address = document.querySelector('#email-address');
  const status = document.querySelector('#email-status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address.value);
      status.textContent = 'Email address copied.';
    } catch {
      address.focus();
      address.select();
      status.textContent = 'Select and copy the address above.';
    }
  });
})();
