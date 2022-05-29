import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandleRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generatorMarkup() {
    const page = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (numPage > 1 && page === 1) {
      return `
        <button data-goto ="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }
    if (page < numPage && page > 1) {
      return `
            <button data-goto ="${
              page - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>
            <button data-goto ="${
              page + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${page + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }
    if (page === numPage) {
      return `
            <button data-goto ="${
              page - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page - 1}</span>
            </button>
        `;
    }
    return '';
  }
}
export default new PaginationView();
