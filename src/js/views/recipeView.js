import View from './View';

const fracty = require('fracty');

class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage =
    "We coundn't find this recipe. Please try to see another one!";
  _message = '';

  _generateMarkupIngredient(ingredients) {
    return ingredients
      .map(ingedient => {
        if (!ingedient.quantity) return;
        return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${this._icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${fracty(ingedient.quantity)}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ingedient.unit}</span>
        ${ingedient.description.toLowerCase()}
      </div>
    </li>`;
      })
      .join('');
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.imageUrl}" alt="${this._data.title
      .split(' ')
      .at(-1)}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${this._icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${this._icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--decrease-servings">
            <svg>
              <use href="${this._icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${this._icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${this._icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._generateMarkupIngredient(this._data.ingredients)}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
        `;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentEl.addEventListener('click', e => {
      e.preventDefault();
      let newServings;
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      if (btn.classList.contains('btn--decrease-servings'))
        newServings = this._data.servings - 1;
      else if (btn.classList.contains('btn--increase-servings'))
        newServings = this._data.servings + 1;

      newServings > 0 && handler(newServings);
    });
  }
  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
}

export default new RecipeView();

// <svg>
//   <use href="${this._icons}#icon-user"></use>
// </svg>
