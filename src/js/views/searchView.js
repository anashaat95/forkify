import icons from 'url:./../../img/icons.svg';

class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  _clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    ['submit'].forEach(ev =>
      this._parentEl.addEventListener(ev, e => {
        e.preventDefault();
        handler();
      })
    );
  }
}

export default new SearchView();
