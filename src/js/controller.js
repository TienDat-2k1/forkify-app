import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//show spinner
recipeView.renderSpinner();

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) {
      return;
    }

    // update result view to mark select search result
    resultsView.update(model.getResultPageView());
    // update bookmark view
    bookmarkView.update(model.state.bookmarks);
    // load recipe
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    recipeView.errorMessageRender();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);

    //render result view
    resultsView.renderSpinner();
    resultsView.render(model.getResultPageView());

    //render pagination view
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getResultPageView(gotoPage));

  //render pagination view
  paginationView.render(model.state.search);
};

const controlServingsUpdate = function (updateTo) {
  console.log(updateTo);
  //update the recipe servings (in state)
  model.updateServings(updateTo);
  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  bookmarkView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
};
const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // render recipe view
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // auto close form window
    setTimeout(function () {
      addRecipeView._toggleViewWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('`(*>﹏<*)′', err);
    addRecipeView.errorMessageRender(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandleRender(controlRecipe);
  recipeView.addHandleServingsUpdate(controlServingsUpdate);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandleRender(controlSearchResult);
  paginationView.addHandleRender(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
