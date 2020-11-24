import 'material-design-icons/iconfont/material-icons.css';
import './scss/index.scss';
import PicturesApiService from './js/apiService';
import cardTemplate from './templates/cardTemplate.hbs';
import { error, notice, defaults } from '@pnotify/core';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import showModal from './js/openModal';
defaults.delay = 1500;

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.js-gallery'),
  scrollTarget: document.querySelector('.scroll-target'),
};

const getPictures = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', showModal);

function onSearch(e) {
  e.preventDefault();

  getPictures.searchQuery = e.currentTarget.elements.query.value;
  if (e.currentTarget.elements.query.value === '') {
    return error({
      text: 'Enter search request',
    });
  }

  getPictures.resetPage();

  clearGallery();
  fetchPictures();
}

// function onLoadMoreBtn() {
//   fetchPictures().then(scrollGallery);
// }

// function fetchPictures() {
//   return getPictures
//     .fetchPictures()
//     .then(data => {
//       if (data == 0) {
//         return error({
//           text: 'Nothing found',
//         });
//       }

//       notice({
//         text: `Loading results for "${getPictures.searchQuery}"`,
//       });

//       createGallery(data);
//     })
//     .catch(console.log);
// }

// function scrollGallery() {
//   const screenHeight = document.documentElement.clientHeight;
//   const { y } = refs.gallery.getBoundingClientRect();
//   window.scrollTo({ top: -y + screenHeight - 200, behavior: 'smooth' });
// }
async function fetchPictures() {
  const pictures = await getPictures.fetchPictures();
  const buildMarkup = pictures => {
    if (pictures == 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      clearGallery();
      return error({
        text: 'Nothing found',
        delay: 1500,
      });
    }

    notice({
      text: `Searching for ${getPictures.searchQuery}`,
      delay: 1500,
    });

    createGallery(pictures);
  };
  return buildMarkup(pictures);
}

function createGallery(pictures) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTemplate(pictures));
}

function clearGallery() {
  refs.searchForm.elements.query.value = '';
  refs.gallery.innerHTML = '';
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && getPictures.searchQuery !== '') {
      fetchPictures();
    }
  });
};

const options = {
  rootMargin: '300px',
};
const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.scrollTarget);
