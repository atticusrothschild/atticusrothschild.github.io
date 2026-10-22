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
  const previous = document.createElement('button');
  const next = document.createElement('button');
  for (const [button, label, symbol, direction] of [[previous, 'Previous photo', '‹', -1], [next, 'Next photo', '›', 1]]) {
    button.type = 'button';
    button.className = `image-viewer-arrow image-viewer-${direction === -1 ? 'previous' : 'next'}`;
    button.textContent = symbol;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => showPhoto(index + direction));
  }
  const counter = document.createElement('span');
  counter.className = 'image-viewer-counter';
  counter.setAttribute('aria-live', 'polite');
  dialog.append(close, previous, image, next, counter);
  document.body.append(dialog);
  let opener;
  let photos = [];
  let index = 0;
  const isPhoto = link => link.querySelector('img') && /\.(?:jpe?g|png|gif|webp)(?:[?#]|$)/i.test(link.href);
  function showPhoto(position) {
    index = (position + photos.length) % photos.length;
    const link = photos[index];
    const thumbnail = link.querySelector('img');
    image.src = link.href;
    image.alt = thumbnail.alt;
    image.classList.toggle('image-viewer-rotated', Boolean(thumbnail.closest('.upright-photo, .portrait-turn')));
    counter.textContent = `${index + 1} / ${photos.length}`;
    previous.hidden = next.hidden = photos.length < 2;
  }
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

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
    if (!isPhoto(link)) return;
    event.preventDefault();
    opener = link;
    photos = [...document.querySelectorAll('a[href]')].filter(isPhoto);
    showPhoto(photos.indexOf(link));
    document.documentElement.classList.add('image-viewer-open');
    dialog.showModal();
    close.focus();
  });
})();
