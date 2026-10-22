(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Enlarged image');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'image-viewer-close';
  close.textContent = 'Close ×';
  close.setAttribute('aria-label', 'Close enlarged image');
  const image = document.createElement('img');
  dialog.append(close, image);
  document.body.append(dialog);
  let opener;

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('image-viewer-open');
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const thumbnail = link.querySelector('img');
    if (!thumbnail || !/\.(?:jpe?g|png|gif|webp)(?:[?#]|$)/i.test(link.href)) return;
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = thumbnail.alt;
    image.classList.toggle('image-viewer-rotated', Boolean(thumbnail.closest('.upright-photo')));
    document.documentElement.classList.add('image-viewer-open');
    dialog.showModal();
    close.focus();
  });
})();
