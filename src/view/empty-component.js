import { AbstractComponent } from '../framework/view/abstract-component.js';

function createEmptyComponentTemplate() {
  return `
    <div class="empty-state">
      <div class="empty-icon">🍳</div>
      <h3>Рецепты не найдены</h3>
      <p>Попробуйте изменить параметры поиска или добавьте новый рецепт</p>
    </div>
  `;
}

export default class EmptyComponent extends AbstractComponent {
  getTemplate() {
    return createEmptyComponentTemplate();
  }
}