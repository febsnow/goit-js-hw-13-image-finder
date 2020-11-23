import 'material-design-icons/iconfont/material-icons.css';
import './scss/index.scss';
import PicturesApiService from './js/apiService';
import cardTemplate from './templates/cardTemplate.hbs';
import { error, notice } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import showModal from './js/openModal';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  loadMoreBtn: document.querySelector('.load-btn'),
};

const getPictures = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
refs.gallery.addEventListener('click', showModal);

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

function onLoadMoreBtn() {
  fetchPictures().then(scrollGallery);
}

function fetchPictures() {
  refs.loadMoreBtn.textContent = 'Loading...';
  refs.loadMoreBtn.disabled = true;

  return getPictures
    .fetchPictures()
    .then(data => {
      if (data == 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        return error({
          text: 'Nothing found',
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

function scrollGallery() {
  const screenHeight = document.documentElement.clientHeight;
  const { y } = refs.gallery.getBoundingClientRect();
  window.scrollTo({ top: -y + screenHeight - 200, behavior: 'smooth' });
}

function createGallery(pictures) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(pictures));
}

function clearGallery() {
  refs.searchForm.elements.query.value = '';
  refs.gallery.innerHTML = '';
}
