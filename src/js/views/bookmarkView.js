import View from './View';
import previewView from './previewView';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = 'No recipes found for your query! Please try again!!';
  _generatorMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarkView();
