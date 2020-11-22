import 'material-design-icons/iconfont/material-icons.css';
import './scss/index.scss';
import PicturesApiService from './js/apiService';
import cardTemplate from './templates/cardTemplate.hbs';
import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  loadMoreBtn: document.querySelector('.load-btn'),
};

const getPictures = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchPictures);

function onSearch(e) {
  e.preventDefault();

  getPictures.searchQuery = e.currentTarget.elements.query.value;
  if (e.currentTarget.elements.query.value === '') {
    return error({
      text: 'Enter search request',
      delay: 1500,
    });
  }

  getPictures.resetPage();

  clearGallery();

  fetchPictures();
}

function fetchPictures() {
  refs.loadMoreBtn.textContent = 'Loading...';
  refs.loadMoreBtn.disabled = true;

  getPictures
    .fetchPictures()
    .then(data => {
      if (data == 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        return error({
          text: 'Enter search request',
          delay: 1500,
        });
      }

      notice({
        text: `Searching for ${getPictures.searchQuery}`,
        delay: 1500,
      });

      createGallery(data);

      refs.loadMoreBtn.classList.remove('is-hidden');
      refs.loadMoreBtn.textContent = 'Load more';
      refs.loadMoreBtn.disabled = false;
    })
    .catch(console.log);
}

function createGallery(pictures) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(pictures));
}

function clearGallery() {
  refs.searchForm.elements.query.value = '';
  refs.gallery.innerHTML = '';
}
// const lastChild = refs.gallery.lastChild;

// function getCoords(elem) {
//   const box = elem.getBoundingClientRect();

//   return {
//     top: box.top + pageYOffset,
//     left: box.left + pageXOffset,
//   };
// }
// getCoords(lastChild);
