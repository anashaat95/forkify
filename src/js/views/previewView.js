import View from './View';
class PreviewView extends View {
  _parentEl = '';

  _generateMarkup() {
    const id = window.location.hash.split('#').at(-1);
    return `
      <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.imageUrl}" alt="${this._data.title}">
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
        </div>
      </a>
    </li>
    `;
  }
}
export default new PreviewView();

/*<div class="preview__user-generated hidden">
            <svg>
            <use href="https://forkify-v2.netlify.app/icons.c781f215.svg#icon-user"></use>
            </svg>
          </div> */
