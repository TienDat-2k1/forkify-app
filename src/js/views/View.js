import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *
   * @param {Object | Object[]} data the data to be rendered
   * @param {boolean} [render =true] If false, create markup string instead of rendering to the DOM
   * @this {Object} View Instance
   * @returns {undefined |string} a marking string is return if render=false
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this._clear();
      return this.errorMessageRender();
    }
    this._data = data;

    const markup = this._generatorMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;

    const newMarkup = this._generatorMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newEls = Array.from(newDOM.querySelectorAll('*'));
    const curEls = Array.from(this._parentElement.querySelectorAll('*'));
    newEls.forEach((newEl, i) => {
      const curEl = curEls[i];
      // update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // update change Attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  renderSpinner() {
    const htmlSpinner = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', htmlSpinner);
  }
  errorMessageRender(message = this._message) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
}
