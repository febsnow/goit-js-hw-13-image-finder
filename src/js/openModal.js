import 'basiclightbox/src/styles/main.scss';
const basicLightbox = require('basiclightbox');

export default function showModal(e) {
  console.dir(e.target);
  if (e.target.tagName === 'IMG') {
    basicLightbox
      .create(
        `
		<img width="${e.target.naturalWidth}" height="${e.target.naturalHeight}" src=${e.target.dataset.source}>
	`,
      )
      .show();
  }
}
