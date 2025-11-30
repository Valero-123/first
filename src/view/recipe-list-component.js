import { AbstractComponent } from '../framework/view/abstract-component.js';

function createRecipeListComponentTemplate() {
  return `
    <div class="popular-section">
      <h2 class="section-title">🔥 ПОПУЛЯРНЫЕ РЕЦЕПТЫ</h2>
      <div class="popular-grid" id="recipesContainer">
        <!-- Recipes will be rendered here -->
      </div>
    </div>
  `;
}

export default class RecipeListComponent extends AbstractComponent {
  getTemplate() {
    return createRecipeListComponentTemplate();
  }
}