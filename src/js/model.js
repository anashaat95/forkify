const path = require('path');
import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = data => {
  const { recipe } = data.data;
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    imageUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(path.join(`${API_URL}?key=${KEY}`, id));
    createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.query = query;
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const uploadRecipe = async newRecipe => {
  try {
    ingredients = [];
    Object.entries(newRecipe).forEach(itemLi => {
      const [key, value] = itemLi;
      if (value) {
        if (key.startsWith('ingredient')) {
          if (value.includes(',')) {
            const ingArr = value.split(',');
            if (ingArr.length !== 3)
              throw new Error(
                'Wrong Ingredient Format! Please use the correct format ;)'
              );
            const [quantity, unit, description] = ingArr;
            ingredients.push({ quantity, unit, description });
          }
        }
      }
    });

    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
      publisher: newRecipe.publisher,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
