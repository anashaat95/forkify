import * as model from './model';
import RecipeView from './views/recipeView';
import SearchView from './views/searchView';
import ResultsView from './views/resultsView';
import PaginationView from './views/paginationView';
import recipeView from './views/recipeView';
import BookmarksView from './views/bookmarksView';
import AddRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
///////////////////////////////////////

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;

  RecipeView.renderSpinner();

  if (model.state.search.query) ResultsView.update(model.getSearchResultPage());

  try {
    await model.loadRecipe(id);
    RecipeView.render(model.state.recipe);
    BookmarksView.update(model.state.bookmarks);
  } catch (err) {
    RecipeView.renderError(err);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlSearchResults = async function () {
  const query = SearchView.getQuery();
  if (!query && page === 1) return;
  ResultsView.renderSpinner();
  try {
    await model.loadSearchResults(query);
    ResultsView.render(model.getSearchResultPage(1));
    PaginationView.render(model.state.search);
    BookmarksView.update(model.state.bookmarks);
  } catch (err) {
    ResultsView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  ResultsView.render(model.getSearchResultPage(goToPage));
  PaginationView.render(model.state.search);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  BookmarksView.render(model.state.bookmarks);
};

const controlStartLoadingBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    await model.uploadNewRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    AddRecipeView.renderMessage();
    BookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    AddRecipeView.renderError(err);
  }
};
function newFeature() {}

function init() {
  BookmarksView.addHandlerRender(controlStartLoadingBookmarks);
  AddRecipeView.addHandlerSubmit(controlAddRecipe);
  SearchView.addHandlerSearch(controlSearchResults);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddDeleteBookmark(controlBookmark);
  PaginationView.addHandlerClick(controlPagination);
}

init();
