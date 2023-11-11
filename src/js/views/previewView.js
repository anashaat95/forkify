import icons from 'url:./../../img/icons.svg';
import View from './View';

class PreviewView extends View {
  _parentEl = document.querySelector('.results');
  _errMessage = 'No recipes found for your query. Please try again ;)';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(recipe) {
    const id = window.location.hash.slice(1);

    const activeClassName = recipe.id === id ? 'preview__link--active' : '';
    return `<li class="preview">
      <a class="preview__link ${activeClassName}" href="#${recipe.id}">
        <figure class="preview__fig">
          <img src=${recipe.imageUrl} alt=${recipe.title} />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${recipe.title}</h4>
          <p class="preview__publisher">${recipe.publisher}</p>
          <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>`;
  }

  addHandlerRender(handler) {
    ['click'].forEach(ev => window.addEventListener(ev, () => handler()));
  }
}

export default PreviewView;
