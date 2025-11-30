import { createElement } from "../render.js";

export class AbstractComponent {
  #element = null;

  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error('Can\'t instantiate AbstractComponent, only concrete one.');
    }
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  removeElement() {
    this.#element = null;
  }
}