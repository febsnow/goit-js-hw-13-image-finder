import 'material-design-icons/iconfont/material-icons.css';
import './scss/index.scss';
import PicturesApiService from './js/apiService';
import cardTemplate from './templates/cardTemplate.hbs';
import { error, notice, success as success, defaults } from '@pnotify/core';

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
  try {
    const pictures = await getPictures.fetchPictures();
    const { searchResult, totalResult } = pictures;
    const buildMarkup = pictures => {
      if (totalResult == 0) {
        return error({
          text: 'Nothing found',
        });
      }
      if (pictures <= getPictures.perPage) {
        return success({
          text: `That's all`,
        });
      }
      const wholeGallery = document.querySelectorAll('.photo-card');
      const picturesLeft = totalResult - wholeGallery.length;

      notice({
        text: `Loading results for ${getPictures.searchQuery}\n ${picturesLeft} pictures left`,
      });

      createGallery(pictures);
    };
    return buildMarkup(searchResult);
  } catch (error) {
    console.dir(error);
  }
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
