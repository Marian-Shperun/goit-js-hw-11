import { fetchData } from './js/http.js';
import { Notify, Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const { searchQuery } = formEl;
const galleryEl = document.querySelector('.gallery');
const LoadMoreEL = document.querySelector('.load-more');

// Styles for spiner
Loading.init({
  backgroundColor: 'none',
  svgColor: 'rgb(40, 84, 172)',
});

const openImg = new SimpleLightbox('.gallery a');

const HITS_PAGE = 40; //40
let items = [];
let query = '';
let currentPage = 1;
let totalPages = 0;
let isLoading = false;

async function fetchImg() {
  isLoading = true;
  Loading.dots();

  const data = await fetchData(query, currentPage, HITS_PAGE);

  items = await [...items, data.hits];
  totalPages = await data.totalHits;

  console.log(data);
  renderList(data.hits);

  if (currentPage > Math.ceil(totalPages / HITS_PAGE)) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        position: 'center-center',
      }
    );
    return Loading.remove();
  }

  if (data.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  currentPage === 1
    ? Notify.success(`Hooray! We found totalHits ${data.total}`)
    : '';

  Loading.remove();
  isLoading = false;
}

const handleSubmit = e => {
  e.preventDefault();
  if (query === searchQuery.value) return;

  query = searchQuery.value;
  console.log(query);
  galleryEl.innerHTML = '';
  currentPage = 1;
  items = [];

  if (!query) return;
  fetchImg();
  skrollTop();
};

formEl.addEventListener('submit', handleSubmit);

function renderList(itemsData) {
  searchQuery.value = '';

  galleryEl.insertAdjacentHTML('beforeend', createMarkup(itemsData));
  openImg.refresh();
}

function createMarkup(items) {
  return items
    .map(item => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = item;
      return `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>
      `;
    })
    .join(' ');
}

// click on btn loading=============
LoadMoreEL.addEventListener('click', handleLoadMoreClick);

function handleLoadMoreClick() {
  currentPage += 1;
  fetchImg();
  newCardSkroll();

  LoadMoreEL.classList.add('hidden');
}

// infinitiScroll==================
galleryEl.addEventListener('scroll', handleInfinitiScroll);

function handleInfinitiScroll({ target }) {
  if (
    target.scrollTop + target.clientHeight + 100 >= target.scrollHeight &&
    !isLoading
  ) {
    LoadMoreEL.classList.remove('hidden');
  } else {
    LoadMoreEL.classList.add('hidden');
  }
}
function skrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function newCardSkroll() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
