import 'basiclightbox/src/styles/main.scss';
const basicLightbox = require('basiclightbox');

export default function showModal(e) {
  const { nodeName, naturalHeight, naturalWidth, dataset } = e.target;
  if (nodeName === 'IMG') {
    basicLightbox
      .create(
        `
		<img width="${naturalWidth}" height="${naturalHeight}" src=${dataset.source}>
	`,
      )
      .show();
  }
}
