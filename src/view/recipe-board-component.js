import { AbstractComponent } from './abstract-component.js';

function createRecipeBoardComponentTemplate() {
  return `
    <section class="recipe-board">
      <div class="board-container">
        <!-- Recipe lists and filters will be rendered here -->
      </div>
    </section>
  `;
}

export default class RecipeBoardComponent extends AbstractComponent {
  get template() {
    return createRecipeBoardComponentTemplate();
  }

  get boardContainer() {
    return this.element.querySelector('.board-container');
  }
}