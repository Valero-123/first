import { AbstractComponent } from './abstract-component.js';

function createFormAddRecipeComponentTemplate() {
    return `
    <div class="search-section">
        <input type="text" class="search-input" placeholder="🔍 Поиск рецептов по названию, ингредиентам...">
        <button class="search-btn" type="button">Найти</button>
        <button class="clear-filters-btn" type="button">Очистить фильтры</button>
    </div>
    
    <div class="filters-grid">
        <div class="filter-section">
            <div class="filter-title">🌍 СТРАНА / КУХНЯ</div>
            <select class="dropdown" id="cuisineFilter">
                <option value="">Все кухни</option>
                <option value="🇷🇺 Русская">🇷🇺 Русская</option>
                <option value="🇮🇹 Итальянская">🇮🇹 Итальянская</option>
                <option value="🇫🇷 Французская">🇫🇷 Французская</option>
                <option value="🇨🇳 Китайская">🇨🇳 Китайская</option>
                <option value="🇯🇵 Японская">🇯🇵 Японская</option>
                <option value="🇲🇽 Мексиканская">🇲🇽 Мексиканская</option>
                <option value="🇹🇭 Тайская">🇹🇭 Тайская</option>
                <option value="🇺🇸 Американская">🇺🇸 Американская</option>
                <option value="🇪🇸 Испанская">🇪🇸 Испанская</option>
                <option value="🇭🇺 Венгерская">🇭🇺 Венгерская</option>
                <option value="🇮🇱 Израильская">🇮🇱 Израильская</option>
                <option value="🇱🇧 Ливанская">🇱🇧 Ливанская</option>
                <option value="🇰🇷 Корейская">🇰🇷 Корейская</option>
                <option value="🇨🇺 Кубинская">🇨🇺 Кубинская</option>
                <option value="🇬🇷 Греческая">🇬🇷 Греческая</option>
                <option value="🇮🇳 Индийская">🇮🇳 Индийская</option>
                <option value="🇻🇳 Вьетнамская">🇻🇳 Вьетнамская</option>
            </select>
        </div>

        <div class="filter-section">
            <div class="filter-title">⏱️ ВРЕМЯ ПРИГОТОВЛЕНИЯ</div>
            <select class="dropdown" id="timeFilter">
                <option value="">Любое время</option>
                <option value="fast">🚀 Быстро (до 20 мин)</option>
                <option value="short">⚡ До 30 минут</option>
                <option value="medium">🕐 До 1 часа</option>
                <option value="long">⏳ Более 1 часа</option>
            </select>
        </div>

        <div class="filter-section">
            <div class="filter-title">📊 СЛОЖНОСТЬ</div>
            <select class="dropdown" id="difficultyFilter">
                <option value="">Любая сложность</option>
                <option value="easy">👶 Начинающий</option>
                <option value="medium">👨‍🍳 Любитель</option>
                <option value="hard">🧑‍🍳 Профессионал</option>
            </select>
        </div>

        <div class="filter-section">
            <div class="filter-title">🍽️ ТИП БЛЮДА</div>
            <select class="dropdown" id="categoryFilter">
                <option value="">Все типы</option>
                <option value="Закуски">🥗 Закуски</option>
                <option value="Супы">🍲 Супы</option>
                <option value="Основные">🍛 Основные блюда</option>
                <option value="Десерты">🍰 Десерты</option>
                <option value="Завтраки">🥞 Завтраки</option>
                <option value="Напитки">🍹 Напитки</option>
                <option value="Салаты">🥙 Салаты</option>
                <option value="Выпечка">🥖 Выпечка</option>
            </select>
        </div>

        <div class="filter-section">
            <div class="filter-title">⭐ РЕЙТИНГ</div>
            <select class="dropdown" id="ratingFilter">
                <option value="">Любой рейтинг</option>
                <option value="4.5">⭐ 4.5+ Отлично</option>
                <option value="4.0">⭐ 4.0+ Хорошо</option>
                <option value="3.5">⭐ 3.5+ Нормально</option>
            </select>
        </div>

        <div class="filter-section">
            <div class="filter-title">🏷️ ТЕГИ / ОСОБЕННОСТИ</div>
            <select class="dropdown" id="tagsFilter">
                <option value="">Все теги</option>
                <option value="Острые">🌶️ Острые</option>
                <option value="Вегетарианские">🥬 Вегетарианские</option>
                <option value="Здоровые">💚 Здоровые</option>
                <option value="Быстро">⚡ Быстро</option>
                <option value="Сытные">🍖 Сытные</option>
                <option value="Легкие">🍃 Легкие</option>
                <option value="Праздничные">🎉 Праздничные</option>
                <option value="Лето">☀️ Летние</option>
                <option value="Морепродукты">🦐 Морепродукты</option>
                <option value="Мясо">🥩 Мясо</option>
                <option value="Сладкое">🍭 Сладкое</option>
            </select>
        </div>
    </div>

    <div class="active-filters" id="activeFilters">
        <div class="active-filters-title">Активные фильтры:</div>
        <div class="active-filters-list" id="activeFiltersList"></div>
    </div>

    <div class="add-recipe-section">
        <button class="add-recipe-btn" type="button">
            <span class="add-recipe-icon">+</span>
            Добавить новый рецепт
        </button>
    </div>
    `;
}

export default class FormAddRecipeComponent extends AbstractComponent {
    getTemplate() {
        return createFormAddRecipeComponentTemplate();
    }
}