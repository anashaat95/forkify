import previewView from './previewView';
import View from './View';
class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(recipe => previewView.render(recipe, false)).join('');
  }
}
export default new BookmarksView();

/*<div class="preview__user-generated hidden">
            <svg>
            <use href="https://forkify-v2.netlify.app/icons.c781f215.svg#icon-user"></use>
            </svg>
          </div> */
