import axios from "axios";
import Notiflix from "notiflix";
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let getGallery;
let page = 1;
const refsEl ={
  form: document.querySelector(".search-form"),
  input:document.querySelector("input"),
  getBtn: document.querySelector("button"),
  galleryContainer: document.querySelector(".gallery"),
  loadBtn: document.querySelector(".load-more")
}

refsEl.getBtn.addEventListener("click", onSumbitForm);
refsEl.loadBtn.addEventListener("click", onHandleLoadBtn);
refsEl.loadBtn.style.display = "none";

function onSumbitForm(e) {
  page = 1;
  e.preventDefault()
  getGallery = refsEl.input.value;
  if(getGallery) {
    refsEl.galleryContainer.innerHTML = "";
  }
   getPosts()
}


function onHandleLoadBtn(e) {
  e.preventDefault();
  page +=1;
  getPosts();
}

const getPosts = async () => {
 
  try {
    if(refsEl.input.value !== "") {
      let response = await axios.get(`https://pixabay.com/api/?key=29209271-716f3ea82b952e36eef48fa19&q=${refsEl.input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);

      createList(response.data.hits);
      if (!response.data.hits.length) {
        Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again");
        refsEl.loadBtn.style.display = "none";
      }else{
        refsEl.loadBtn.style.display = "block";
      }
    }else{
      Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again");
      refsEl.loadBtn.style.display = "none";
    }
    
  } 
  
  catch {
    console.log(error);
};

}


function createList(data) {
  //refsEl.input.value = ""
  const result = data.map(({ webformatURL,  largeImageURL, tags, likes, views, comments, downloads}) => {
    return `
    <div class="photo-card">
      <div class="img-thumb">
          <a class="gallery_link" href="${webformatURL}">
          <img  class="gallery__image"
           src="${largeImageURL}" alt="${tags }  loading="lazy" 
          />
        </a>
      </div>
        <div class="info">
          <p class="info-item">
            <b>${likes}</b>
          </p>
          <p class="info-item">
            <b>${views}</b>
          </p>
          <p class="info-item">
            <b>${comments}</b>
          </p>
          <p class="info-item">
            <b>${downloads}</b>
          </p>
        </div>
    </div>
`;
  })
  
  .join('');
  
  refsEl.galleryContainer.insertAdjacentHTML(
    "beforeend", result);
    lightbox.refresh()
}

