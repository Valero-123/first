import { AbstractComponent } from '../framework/view/abstract-component.js';

function createRecipeComponentTemplate(recipe) {
  const { id, title, time, difficulty, rating, description, tags, badge } = recipe;
  
  const badgeClass = badge === 'Тренд' ? 'trending' : '';
  
  return `
    <div class="popular-card draggable-recipe" data-recipe-id="${id}" draggable="true">
      <div class="drag-handle">⋮⋮</div>
      ${badge ? `<div class="card-badge ${badgeClass}">${badge}</div>` : ''}
      <div class="card-content">
        <h3 class="card-title">${title}</h3>
        <div class="card-meta">
          <span class="meta-item">⏱️ ${time}</span>
          <span class="meta-item">${difficulty}</span>
          <span class="meta-item">⭐ ${rating}</span>
        </div>
        <p class="card-description">${description}</p>
        <div class="card-tags">
          ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="card-btn">
          <button class="change" type="button">📝 Редактировать</button>
          <button class="delete" type="button">🗑️ Удалить</button>
        </div>
      </div>
    </div>
  `;
}

export default class RecipeComponent extends AbstractComponent {
  constructor(recipe) {
    super();
    this.recipe = recipe;
  }

  getTemplate() {
    return createRecipeComponentTemplate(this.recipe);
  }
}