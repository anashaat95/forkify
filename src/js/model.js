import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    numResultsPerPage: RES_PER_PAGE,
    page: 1,
    numPages: 1,
  },
  bookmarks: [],
};

const createRecipeObj = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}recipes/${id}?key=${API_KEY}`);

    const { recipe } = data.data;

    state.recipe = createRecipeObj(recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}recipes?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      imageUrl: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const [start, end] = [
    (page - 1) * state.search.numResultsPerPage,
    page * state.search.numResultsPerPage,
  ];

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients = state.recipe.ingredients.map(ing => ({
    ...ing,
    quantity: (newServings * ing.quantity) / state.recipe.servings,
  }));
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadNewRecipe = async function (newRecipe) {
  let ingredients;
  try {
    ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const [key, value] = entry;

        const ingArr = value.split(',').map(ing => ing.trim());

        if (ingArr.length !== 3) {
          throw new Error('Wrong Ingredient. Please use the correct format');
        }

        const [quantity, unit, description] = ingArr;
        return { description, quantity: +quantity, unit };
      });
  } catch (err) {
    throw err;
  }

  const recipe = {
    title: newRecipe.title,
    publisher: newRecipe.publisher,
    servings: +newRecipe.servings,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    cooking_time: +newRecipe.cookingTime,
    ingredients,
  };
  try {
    const data = await AJAX(`${API_URL}recipes?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObj(data.data.recipe);
    state.recipe.bookmarked = true;
    state.recipe.key = API_KEY;
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

function init() {
  const data = localStorage.getItem('bookmarks');

  if (!data) return;
  state.bookmarks = JSON.parse(data);
}

init();
