import View from './View';

class Pagination extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages =
      Math.floor(this._data.results.length / this._data.resultsPerPage) + 1;
    if (numPages === 1) return ``;
    else if (curPage === 1 && numPages > 1) {
      return `
          <button data-goto=${
            curPage + 1
          } class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${this._icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    } else if (curPage < numPages) {
      return `
      <button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    } else {
      return `
      <button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    }
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('button');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}
export default new Pagination();
