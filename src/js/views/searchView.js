import icons from 'url:../../img/icons.svg';
class SearchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  addHandleRender(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _clear() {
    this.#parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
