import { AbstractComponent } from '../framework/view/abstract-component.js';

function createFormAddRecipeComponentTemplate() {
  return `
    <div class="search-section">
      <h2 style="color: red;">ТЕСТ: Форма загружена!</h2>
      <input type="text" class="search-input" placeholder="🔍 Поиск рецептов по названию, ингредиентам...">
      <button class="search-btn" type="button">Найти</button>
      <button class="add-recipe-main-btn" type="button">
        <span class="add-recipe-icon">+</span>
        Добавить рецепт
      </button>
    </div>
    
    <!-- ПРОСТАЯ СЕТКА ФИЛЬТРОВ -->
    <div class="filters-section">
      <h3 style="color: blue;">Фильтры должны быть здесь:</h3>
      <div class="filters-grid">
        <div class="filter-section">
          <div class="filter-title">🌍 КУХНЯ</div>
          <select class="filter-select" id="cuisineFilter">
            <option value="">Все кухни</option>
            <option value="🇷🇺 Русская">Русская</option>
            <option value="🇮🇹 Итальянская">Итальянская</option>
          </select>
        </div>

        <div class="filter-section">
          <div class="filter-title">⏱️ ВРЕМЯ</div>
          <select class="filter-select" id="timeFilter">
            <option value="">Любое время</option>
            <option value="fast">Быстро</option>
            <option value="medium">Средне</option>
          </select>
        </div>
      </div>
    </div>

    <div class="active-filters" id="activeFilters">
      <div class="active-filters-title">Активные фильтры:</div>
      <div class="active-filters-list" id="activeFiltersList"></div>
      <button class="clear-all-filters-btn" type="button">Очистить все фильтры</button>
    </div>
  `;
}

export default class FormAddRecipeComponent extends AbstractComponent {
  getTemplate() {
    return createFormAddRecipeComponentTemplate();
  }
}