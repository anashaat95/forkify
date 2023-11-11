import icons from 'url:./../../img/icons.svg';

class View {
  _parentEl;
  _data;
  _errMessage;
  _message;

  _clear() {
    this._parentEl.innerHTML = '';
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    if (!this._data) this.renderError();

    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl?.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _generateMarkup() {}

  renderSpinner() {
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'afterbegin',
      `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> `
    );
  }

  renderError(message = this._errMessage) {
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'afterbegin',
      `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `
    );
  }

  renderMessage(message = this._message) {
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'afterbegin',
      `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
  `
    );
  }

  addHandlerRender(handler) {}
}

export default View;
