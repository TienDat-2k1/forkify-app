import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = 'No recipes found for your query! Please try again!!';
  _generatorMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
  _generatorMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          id === result.id ? 'preview__link--active' : ''
        } " href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
    </li>
  `;
  }
}
export default new ResultsView();
