import View from './View';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleModal() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.nav__btn--add-recipe');
      if (!btn) return;
      this.toggleModal();
    });
  }

  _addHandlerHideWindow() {
    this._overlay.addEventListener('click', e => {
      e.preventDefault();
      this.toggleModal();
    });
    this._window.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.btn--close-modal');
      if (!btn) return;
      this.toggleModal();
    });
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.upload__btn');
      if (!btn) return;
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {
    return ``;
  }
}
export default new AddRecipeView();
