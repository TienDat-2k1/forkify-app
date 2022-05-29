import { async } from 'regenerator-runtime';
import { APi_URL, RES_PER_PAGE, LOCAL_STORAGE_BOOKMARKS, KEY } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    key: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const persistBookmarks = function () {
  localStorage.setItem(
    LOCAL_STORAGE_BOOKMARKS,
    JSON.stringify(state.bookmarks)
  );
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${APi_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.key = query;
    const data = await AJAX(`${APi_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getResultPageView = function (page = state.search.page) {
  state.search.page = page;
  const start = (state.search.page - 1) * RES_PER_PAGE;
  const end = state.search.page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  index !== -1 && state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS);
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log(state);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit || null,
          description: description || null,
        };
      });
    const recipe = {
      // id: newRecipe.id,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      ingredients: ingredients,
      cooking_time: newRecipe.cookingTime,
    };
    const data = await AJAX(`${APi_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
  } catch (err) {
    throw err;
  }
};
