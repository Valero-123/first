import FormAddRecipeComponent from '../view/form-add-recipe-component.js';
import RecipeListComponent from '../view/recipe-list-component.js';
import RecipeComponent from '../view/recipe-component.js';
import EmptyComponent from '../view/empty-component.js';
import { render } from '../framework/render.js';

export default class RecipesBoardPresenter {
    #recipeModel = null;
    #boardContainer = null;
    #formAddRecipeComponent = null;
    #recipeListComponent = null;
    #currentFilters = {};

    constructor(recipeModel, boardContainer) {
        this.#recipeModel = recipeModel;
        this.#boardContainer = boardContainer;
        this.#formAddRecipeComponent = new FormAddRecipeComponent();
        this.#recipeListComponent = new RecipeListComponent();
        this.#recipeModel.addObserver(this.#handleModelChange.bind(this));
    }

    init() {
        console.log('🔍 Starting board presenter initialization...');
        this.#renderBoard();
        console.log('✅ Board presenter initialized successfully');
    }

    #renderBoard() {
        console.log('🔍 Rendering board components...');
        
        // Очищаем контейнер
        this.#boardContainer.innerHTML = '';
        
        // Рендерим UI доски рецептов
        this.#renderBoardUI();
        
        // Рендерим компоненты
        render(this.#formAddRecipeComponent, this.#boardContainer);
        render(this.#recipeListComponent, this.#boardContainer);
        
        console.log('✅ Board components rendered');
        
        // Рендерим рецепты и настраиваем обработчики
        this.#renderRecipes();
        this.#setupEventListeners();
    }

    #renderBoardUI() {
        const boardHTML = `
            <div class="search-section">
                <input type="text" class="search-input" placeholder="🔍 Поиск рецептов по названию, ингредиентам...">
                <button class="search-btn" type="button">Найти</button>
                <button class="add-recipe-main-btn" type="button">
                    <span class="add-recipe-icon">+</span>
                    Добавить рецепт
                </button>
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
                        <option value="🇬🇷 Греческая">🇬🇷 Греческая</option>
                        <option value="🇮🇳 Индийская">🇮🇳 Индийская</option>
                        <option value="🇻🇳 Вьетнамская">🇻🇳 Вьетнамская</option>
                        <option value="🇪🇸 Испанская">🇪🇸 Испанская</option>
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
            </div>

            <div class="active-filters" id="activeFilters" style="display: none;">
                <div class="active-filters-title">Активные фильтры:</div>
                <div class="active-filters-list" id="activeFiltersList"></div>
                <button class="clear-all-filters-btn">Очистить все фильтры</button>
            </div>

            <div class="results-counter" id="resultsCounter"></div>

            <div class="popular-section">
                <h2 class="section-title">🔥 ПОПУЛЯРНЫЕ РЕЦЕПТЫ</h2>
                <!-- Контейнер для рецептов будет здесь -->
            </div>
        `;

        this.#boardContainer.insertAdjacentHTML('beforeend', boardHTML);
    }

    #renderRecipes() {
        // Очищаем контейнер
        this.#recipeListComponent.clear();

        // Получаем отфильтрованные рецепты
        const filteredRecipes = this.#recipeModel.filterRecipes(this.#currentFilters);

        console.log(`🔍 Found ${filteredRecipes.length} recipes`);

        // Обновляем UI
        this.#updateActiveFiltersDisplay();
        this.#updateResultsCounter(filteredRecipes.length);

        // Если рецептов нет - показываем пустое состояние
        if (filteredRecipes.length === 0) {
            console.log('🔍 No recipes found, showing empty state');
            const emptyComponent = new EmptyComponent();
            render(emptyComponent, this.#recipeListComponent.getElement());
            return;
        }

        // Рендерим рецепты
        filteredRecipes.forEach(recipe => {
            const recipeComponent = new RecipeComponent(recipe);
            
            // Настраиваем обработчики событий Drag&Drop
            recipeComponent.setOnRecipeMove(this.#handleRecipeMove.bind(this));
            recipeComponent.setOnEdit(this.#handleEditRecipe.bind(this));
            recipeComponent.setOnDelete(this.#handleDeleteRecipe.bind(this));
            
            this.#recipeListComponent.addRecipeComponent(recipeComponent);
        });

        console.log(`✅ Rendered ${filteredRecipes.length} recipes`);
    }

    // ОБРАБОТЧИК ПЕРЕМЕЩЕНИЯ РЕЦЕПТА
    #handleRecipeMove(draggedId, targetId) {
        console.log(`🔄 Moving recipe ${draggedId} to position of ${targetId}`);
        const success = this.#recipeModel.moveRecipe(draggedId, targetId);
        
        if (success) {
            console.log('✅ Recipe moved successfully');
        } else {
            console.log('❌ Failed to move recipe');
        }
    }

    #setupEventListeners() {
        console.log('🔍 Setting up event listeners...');
        
        // Настраиваем обработчики Drag&Drop для списка
        this.#recipeListComponent.setOnRecipeMove(this.#handleRecipeMove.bind(this));
        this.#recipeListComponent.setOnRecipeMoveToEnd(this.#handleRecipeMoveToEnd.bind(this));

        const searchInput = this.#boardContainer.querySelector('.search-input');
        const searchBtn = this.#boardContainer.querySelector('.search-btn');
        const clearFiltersBtn = this.#boardContainer.querySelector('.clear-all-filters-btn');
        const addRecipeBtn = this.#boardContainer.querySelector('.add-recipe-main-btn');

        // Поиск
        if (searchInput && searchBtn) {
            const performSearch = () => {
                this.#currentFilters.search = searchInput.value.trim();
                console.log('🔍 Performing search:', this.#currentFilters.search);
                this.#renderRecipes();
            };

            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });

            searchInput.addEventListener('input', () => {
                if (searchInput.value.trim() === '') {
                    delete this.#currentFilters.search;
                    this.#renderRecipes();
                }
            });
            
            console.log('✅ Search listeners added');
        }

        // Очистка фильтров
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                console.log('🗑️ Clearing all filters');
                this.#clearAllFilters();
            });
            console.log('✅ Clear filters listener added');
        }

        // Фильтры
        const filters = [
            { id: 'cuisineFilter', key: 'cuisine' },
            { id: 'timeFilter', key: 'time' },
            { id: 'difficultyFilter', key: 'difficulty' },
            { id: 'categoryFilter', key: 'category' }
        ];

        filters.forEach(({ id, key }) => {
            const filter = this.#boardContainer.querySelector(`#${id}`);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.#currentFilters[key] = filter.value;
                    console.log(`🔍 Filter changed: ${key} = ${filter.value}`);
                    this.#renderRecipes();
                });
            }
        });

        // Кнопка добавления рецепта
        if (addRecipeBtn) {
            addRecipeBtn.addEventListener('click', () => {
                console.log('➕ Add recipe button clicked');
                this.#handleAddRecipe();
            });
            console.log('✅ Add recipe button listener added');
        }

        console.log('✅ All event listeners set up');
    }

    // ПЕРЕМЕЩЕНИЕ РЕЦЕПТА В КОНЕЦ СПИСКА
    #handleRecipeMoveToEnd(recipeId) {
        console.log(`🔄 Moving recipe ${recipeId} to end of list`);
        const recipes = this.#recipeModel.recipes;
        const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
        
        if (recipeIndex !== -1 && recipeIndex !== recipes.length - 1) {
            const [movedRecipe] = recipes.splice(recipeIndex, 1);
            recipes.push(movedRecipe);
            this.#recipeModel._saveRecipesOrder();
            this.#recipeModel._notifyObservers();
        }
    }

    #clearAllFilters() {
        this.#currentFilters = {};
        
        const elements = {
            '.search-input': (el) => el.value = '',
            '#cuisineFilter': (el) => el.selectedIndex = 0,
            '#timeFilter': (el) => el.selectedIndex = 0,
            '#difficultyFilter': (el) => el.selectedIndex = 0,
            '#categoryFilter': (el) => el.selectedIndex = 0
        };

        Object.entries(elements).forEach(([selector, resetFn]) => {
            const element = this.#boardContainer.querySelector(selector);
            if (element) resetFn(element);
        });

        this.#renderRecipes();
    }

    #updateActiveFiltersDisplay() {
        const activeFiltersContainer = this.#boardContainer.querySelector('#activeFilters');
        const activeFiltersList = this.#boardContainer.querySelector('#activeFiltersList');

        if (!activeFiltersContainer || !activeFiltersList) return;

        const activeFilters = Object.entries(this.#currentFilters)
            .filter(([key, value]) => value && value !== '');

        if (activeFilters.length === 0) {
            activeFiltersContainer.style.display = 'none';
            return;
        }

        activeFiltersContainer.style.display = 'block';
        activeFiltersList.innerHTML = '';

        activeFilters.forEach(([key, value]) => {
            const filterChip = document.createElement('div');
            filterChip.className = 'filter-chip';
            
            const filterName = this.#getFilterDisplayName(key, value);
            filterChip.innerHTML = `
                ${filterName}
                <span class="remove-filter">×</span>
            `;

            filterChip.querySelector('.remove-filter').addEventListener('click', () => {
                this.#removeFilter(key);
            });

            activeFiltersList.appendChild(filterChip);
        });
    }

    #updateResultsCounter(resultsCount) {
        let resultsCounter = this.#boardContainer.querySelector('.results-counter');
        
        if (!resultsCounter) {
            resultsCounter = document.createElement('div');
            resultsCounter.className = 'results-counter';
            
            const popularSection = this.#boardContainer.querySelector('.popular-section');
            if (popularSection) {
                popularSection.insertBefore(resultsCounter, this.#recipeListComponent.getElement());
            }
        }
        
        const totalRecipes = this.#recipeModel.recipes.length;
        resultsCounter.textContent = resultsCount === totalRecipes 
            ? `Найдено все рецепты: ${resultsCount}`
            : `Найдено рецептов: ${resultsCount} из ${totalRecipes}`;
    }

    #getFilterDisplayName(key, value) {
        const displayNames = {
            cuisine: `🌍 ${value.replace(/[🇷🇺🇮🇹🇫🇷🇨🇳🇯🇵🇲🇽]/g, '').trim()}`,
            time: `⏱️ ${this.#getTimeDisplayName(value)}`,
            difficulty: `📊 ${this.#getDifficultyDisplayName(value)}`,
            category: `🍽️ ${value}`,
            search: `🔍 "${value}"`
        };

        return displayNames[key] || `${key}: ${value}`;
    }

    #getTimeDisplayName(timeKey) {
        const timeNames = {
            'fast': 'До 20 мин',
            'short': 'До 30 мин',
            'medium': 'До 1 часа',
            'long': 'Более 1 часа'
        };
        return timeNames[timeKey] || timeKey;
    }

    #getDifficultyDisplayName(difficultyKey) {
        const difficultyNames = {
            'easy': 'Начинающий',
            'medium': 'Любитель',
            'hard': 'Профессионал'
        };
        return difficultyNames[difficultyKey] || difficultyKey;
    }

    #removeFilter(key) {
        delete this.#currentFilters[key];
        
        const filterInputs = {
            cuisine: '#cuisineFilter',
            time: '#timeFilter',
            difficulty: '#difficultyFilter',
            category: '#categoryFilter',
            search: '.search-input'
        };

        if (filterInputs[key]) {
            const input = this.#boardContainer.querySelector(filterInputs[key]);
            if (input) {
                if (key === 'search') {
                    input.value = '';
                } else {
                    input.selectedIndex = 0;
                }
            }
        }

        this.#renderRecipes();
    }

    #handleAddRecipe() {
        this.#showAddRecipeForm();
    }

    #showAddRecipeForm() {
        const modalHTML = `
            <div class="edit-modal" id="addRecipeModal">
                <div class="edit-form">
                    <h2>Добавить новый рецепт</h2>
                    
                    <div>
                        <label class="required-field">Название рецепта</label>
                        <input type="text" id="addTitle" placeholder="Введите название рецепта" required>
                    </div>

                    <div>
                        <label>Описание</label>
                        <textarea id="addDescription" placeholder="Опишите рецепт..."></textarea>
                    </div>

                    <div>
                        <label class="required-field">Время приготовления</label>
                        <input type="text" id="addTime" placeholder="Например: 30 мин" required>
                        <div class="form-hint">Примеры: 15 мин, 30 мин, 1 ч, 1 ч 30 мин</div>
                    </div>

                    <div>
                        <label class="required-field">Сложность</label>
                        <select id="addDifficulty" required>
                            <option value="">Выберите сложность</option>
                            <option value="👶 Начинающий">👶 Начинающий</option>
                            <option value="👨‍🍳 Любитель">👨‍🍳 Любитель</option>
                            <option value="🧑‍🍳 Профессионал">🧑‍🍳 Профессионал</option>
                        </select>
                    </div>

                    <div>
                        <label class="required-field">Кухня</label>
                        <select id="addCuisine" required>
                            <option value="">Выберите кухню</option>
                            <option value="🇷🇺 Русская">🇷🇺 Русская</option>
                            <option value="🇮🇹 Итальянская">🇮🇹 Итальянская</option>
                            <option value="🇫🇷 Французская">🇫🇷 Французская</option>
                            <option value="🇨🇳 Китайская">🇨🇳 Китайская</option>
                            <option value="🇯🇵 Японская">🇯🇵 Японская</option>
                            <option value="🇲🇽 Мексиканская">🇲🇽 Мексиканская</option>
                            <option value="🇬🇷 Греческая">🇬🇷 Греческая</option>
                            <option value="🇮🇳 Индийская">🇮🇳 Индийская</option>
                            <option value="🇻🇳 Вьетнамская">🇻🇳 Вьетнамская</option>
                            <option value="🇪🇸 Испанская">🇪🇸 Испанская</option>
                        </select>
                    </div>

                    <div>
                        <label class="required-field">Тип блюда</label>
                        <select id="addCategory" required>
                            <option value="">Выберите тип блюда</option>
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

                    <div>
                        <label>Теги (через запятую)</label>
                        <input type="text" id="addTags" placeholder="Например: Быстро, Вегетарианские, Здоровые">
                        <div class="form-hint">Необязательное поле. Теги помогут в поиске рецепта</div>
                    </div>

                    <div class="edit-button-group">
                        <button type="button" class="cancel-btn">Отмена</button>
                        <button type="button" class="save-btn">Добавить рецепт</button>
                    </div>
                </div>
            </div>
        `;

        this.#boardContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = this.#boardContainer.querySelector('#addRecipeModal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');

        const closeModal = () => modal.remove();

        cancelBtn.addEventListener('click', closeModal);

        saveBtn.addEventListener('click', () => {
            const title = modal.querySelector('#addTitle').value.trim();
            const description = modal.querySelector('#addDescription').value.trim();
            const time = modal.querySelector('#addTime').value.trim();
            const difficulty = modal.querySelector('#addDifficulty').value;
            const cuisine = modal.querySelector('#addCuisine').value;
            const category = modal.querySelector('#addCategory').value;
            const tagsInput = modal.querySelector('#addTags').value.trim();

            if (!title) {
                alert('Название рецепта обязательно для заполнения!');
                modal.querySelector('#addTitle').focus();
                return;
            }

            if (!time) {
                alert('Время приготовления обязательно для заполнения!');
                modal.querySelector('#addTime').focus();
                return;
            }

            if (!difficulty) {
                alert('Выберите сложность рецепта!');
                modal.querySelector('#addDifficulty').focus();
                return;
            }

            if (!cuisine) {
                alert('Выберите кухню рецепта!');
                modal.querySelector('#addCuisine').focus();
                return;
            }

            if (!category) {
                alert('Выберите тип блюда!');
                modal.querySelector('#addCategory').focus();
                return;
            }

            // Определяем уровень сложности
            let difficultyLevel = 'medium';
            if (difficulty.includes('Начинающий')) difficultyLevel = 'easy';
            if (difficulty.includes('Профессионал')) difficultyLevel = 'hard';

            // Определяем время приготовления
            let cookingTime = 'medium';
            const timeMinutes = this.#extractTimeMinutes(time);
            if (timeMinutes <= 20) cookingTime = 'fast';
            else if (timeMinutes <= 30) cookingTime = 'short';
            else if (timeMinutes > 60) cookingTime = 'long';

            // Обработка тегов
            const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [category];

            // Создаем новый рецепт
            const newRecipe = {
                title,
                description: description || `${title} - вкусный и простой рецепт`,
                time,
                difficulty,
                cuisine,
                category,
                tags,
                rating: "4.5",
                badge: "Новый",
                cookingTime: cookingTime,
                difficultyLevel: difficultyLevel
            };

            this.#recipeModel.addRecipe(newRecipe);
            closeModal();
            alert(`Рецепт "${title}" успешно добавлен!`);
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        modal.querySelector('#addTitle').focus();
    }

    #extractTimeMinutes(timeString) {
        if (!timeString) return 0;
        
        if (timeString.includes('ч')) {
            const hours = parseInt(timeString) || 0;
            const minutesMatch = timeString.match(/(\d+)\s*мин/);
            const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
            return hours * 60 + minutes;
        } else {
            const minutesMatch = timeString.match(/(\d+)/);
            return minutesMatch ? parseInt(minutesMatch[1]) : 0;
        }
    }

    #handleEditRecipe(recipeId) {
        const recipe = this.#recipeModel.recipes.find(r => r.id === recipeId);
        if (recipe) {
            alert(`Редактирование рецепта: ${recipe.title}\n\nЭта функция находится в разработке.`);
        }
    }

    #handleDeleteRecipe(recipeId) {
        const recipe = this.#recipeModel.recipes.find(r => r.id === recipeId);
        if (recipe && confirm(`Вы уверены, что хотите удалить рецепт "${recipe.title}"?`)) {
            this.#recipeModel.deleteRecipe(recipeId);
            alert(`Рецепт "${recipe.title}" удален!`);
        }
    }

    #handleModelChange() {
        this.#renderRecipes();
    }
}