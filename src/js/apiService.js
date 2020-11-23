const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '19216642-2e8fa7a7215ad867e5449afce';

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.pageNum = 1;
    this.perPage = 12;
  }
  fetchPictures() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      q: this.searchQuery,
      page: this.pageNum,
      per_page: this.perPage,
      key: API_KEY,
    });

    return fetch(`${BASE_URL}?${searchParams}`)
      .then(result => result.json())
      .then(data => {
        this.pageNum += 1;
        return data.hits;
      });
  }
  resetPage() {
    this.pageNum = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
