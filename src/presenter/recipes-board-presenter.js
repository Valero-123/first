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
  #dragSourceIndex = null;

  constructor(recipeModel, boardContainer) {
    this.#recipeModel = recipeModel;
    this.#boardContainer = boardContainer;
    this.#formAddRecipeComponent = new FormAddRecipeComponent();
    this.#recipeListComponent = new RecipeListComponent();
    this.#recipeModel.addObserver(this.#handleModelChange.bind(this));
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#boardContainer.innerHTML = '';
    
    render(this.#formAddRecipeComponent, this.#boardContainer);
    render(this.#recipeListComponent, this.#boardContainer);
    
    this.#renderRecipes();
    this.#setupEventListeners();
  }

  #renderRecipes() {
    const recipesContainer = this.#boardContainer.querySelector('#recipesContainer');
    
    if (!recipesContainer) {
      console.error('❌ Recipes container not found!');
      return;
    }
    
    recipesContainer.innerHTML = '';

    const filteredRecipes = this.#recipeModel.filterRecipes(this.#currentFilters);

    this.#updateActiveFiltersDisplay();
    this.#updateResultsCounter(filteredRecipes.length);

    if (filteredRecipes.length === 0) {
      const emptyComponent = new EmptyComponent();
      render(emptyComponent, recipesContainer);
      return;
    }

    filteredRecipes.forEach(recipe => {
      const recipeComponent = new RecipeComponent(recipe);
      render(recipeComponent, recipesContainer);
    });

    this.#setupRecipeEventListeners();
    this.#setupDragAndDrop();
  }

  #setupDragAndDrop() {
    const recipesContainer = this.#boardContainer.querySelector('#recipesContainer');
    if (!recipesContainer) return;

    const draggableRecipes = recipesContainer.querySelectorAll('.draggable-recipe');
    
    draggableRecipes.forEach((recipe, index) => {
      recipe.addEventListener('dragstart', (e) => {
        this.#dragSourceIndex = index;
        recipe.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
      });

      recipe.addEventListener('dragend', () => {
        recipe.classList.remove('dragging');
        draggableRecipes.forEach(r => r.classList.remove('drag-over'));
        this.#dragSourceIndex = null;
      });

      recipe.addEventListener('dragover', (e) => {
        e.preventDefault();
        recipe.classList.add('drag-over');
      });

      recipe.addEventListener('dragleave', () => {
        recipe.classList.remove('drag-over');
      });

      recipe.addEventListener('drop', (e) => {
        e.preventDefault();
        recipe.classList.remove('drag-over');
        
        const sourceIndex = this.#dragSourceIndex;
        const targetIndex = index;
        
        if (sourceIndex !== null && sourceIndex !== targetIndex) {
          this.#recipeModel.reorderRecipes(sourceIndex, targetIndex);
        }
      });
    });

    recipesContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      recipesContainer.classList.add('drop-zone-active');
    });

    recipesContainer.addEventListener('dragleave', () => {
      recipesContainer.classList.remove('drop-zone-active');
    });

    recipesContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      recipesContainer.classList.remove('drop-zone-active');
    });
  }

  #setupEventListeners() {
    const searchInput = this.#boardContainer.querySelector('.search-input');
    const searchBtn = this.#boardContainer.querySelector('.search-btn');
    const addRecipeMainBtn = this.#boardContainer.querySelector('.add-recipe-main-btn');
    const clearFiltersBtn = this.#boardContainer.querySelector('.clear-all-filters-btn');

    if (searchInput && searchBtn) {
      const performSearch = () => {
        this.#currentFilters.search = searchInput.value.trim();
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
    }

    if (addRecipeMainBtn) {
      addRecipeMainBtn.addEventListener('click', () => {
        this.#handleAddRecipe();
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.#clearAllFilters();
      });
    }

    const filters = [
      { id: 'cuisineFilter', key: 'cuisine' },
      { id: 'timeFilter', key: 'time' },
      { id: 'difficultyFilter', key: 'difficulty' },
      { id: 'categoryFilter', key: 'category' },
      { id: 'ratingFilter', key: 'rating' },
      { id: 'tagsFilter', key: 'tags' }
    ];

    filters.forEach(({ id, key }) => {
      const filter = this.#boardContainer.querySelector(`#${id}`);
      if (filter) {
        filter.addEventListener('change', () => {
          this.#currentFilters[key] = filter.value;
          this.#renderRecipes();
        });
      }
    });
  }

  #setupRecipeEventListeners() {
    this.#boardContainer.querySelectorAll('.change').forEach(button => {
      button.addEventListener('click', (event) => {
        const recipeCard = event.target.closest('.popular-card');
        if (recipeCard) {
          this.#handleEditRecipe(recipeCard.dataset.recipeId);
        }
      });
    });

    this.#boardContainer.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', (event) => {
        const recipeCard = event.target.closest('.popular-card');
        if (recipeCard) {
          this.#handleDeleteRecipe(recipeCard.dataset.recipeId);
        }
      });
    });
  }

  #handleAddRecipe() {
    this.#showAddRecipeForm();
  }

  #showAddRecipeForm() {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    
    const form = document.createElement('div');
    form.className = 'edit-form';
    form.innerHTML = this.#createAddRecipeFormHTML();

    modal.appendChild(form);
    document.body.appendChild(modal);

    this.#setupAddRecipeFormListeners(modal, form);
  }

  #createAddRecipeFormHTML() {
    return `
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
        </select>
      </div>

      <div>
        <label>Теги (через запятую)</label>
        <input type="text" id="addTags" placeholder="Например: Быстро, Вегетарианские">
      </div>

      <div class="edit-button-group">
        <button type="button" class="cancel-btn">Отмена</button>
        <button type="button" class="save-btn">Добавить рецепт</button>
      </div>
    `;
  }

  #setupAddRecipeFormListeners(modal, form) {
    const cancelBtn = form.querySelector('.cancel-btn');
    const saveBtn = form.querySelector('.save-btn');

    const closeModal = () => document.body.removeChild(modal);

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
      const title = form.querySelector('#addTitle').value.trim();
      const description = form.querySelector('#addDescription').value.trim();
      const time = form.querySelector('#addTime').value.trim();
      const difficulty = form.querySelector('#addDifficulty').value;
      const cuisine = form.querySelector('#addCuisine').value;
      const category = form.querySelector('#addCategory').value;
      const tagsInput = form.querySelector('#addTags').value.trim();

      if (!title || !time || !difficulty || !cuisine || !category) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
      }

      let difficultyLevel = 'medium';
      if (difficulty.includes('Начинающий')) difficultyLevel = 'easy';
      if (difficulty.includes('Профессионал')) difficultyLevel = 'hard';

      let cookingTime = 'medium';
      const timeMinutes = this.#extractTimeMinutes(time);
      if (timeMinutes <= 20) cookingTime = 'fast';
      else if (timeMinutes <= 30) cookingTime = 'short';
      else if (timeMinutes > 60) cookingTime = 'long';

      const newRecipe = {
        title,
        time,
        difficulty,
        description: description || `${title} - вкусный рецепт`,
        tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [category],
        cuisine,
        cookingTime,
        difficultyLevel,
        category
      };
      
      this.#recipeModel.addRecipe(newRecipe);
      closeModal();
      alert(`Рецепт "${title}" успешно добавлен!`);
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function closeOnEscape(event) {
      if (event.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', closeOnEscape);
      }
    });

    form.querySelector('#addTitle').focus();
  }

  #showEditRecipeForm(recipe) {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    
    const form = document.createElement('div');
    form.className = 'edit-form';
    form.innerHTML = this.#createEditRecipeFormHTML(recipe);

    modal.appendChild(form);
    document.body.appendChild(modal);

    this.#setupEditRecipeFormListeners(modal, form, recipe);
  }

  #createEditRecipeFormHTML(recipe) {
    return `
      <h2>Редактировать рецепт</h2>
      
      <div>
        <label class="required-field">Название рецепта</label>
        <input type="text" id="editTitle" value="${recipe.title}" required>
      </div>

      <div>
        <label>Описание</label>
        <textarea id="editDescription">${recipe.description}</textarea>
      </div>

      <div>
        <label class="required-field">Время приготовления</label>
        <input type="text" id="editTime" value="${recipe.time}" required>
      </div>

      <div>
        <label class="required-field">Сложность</label>
        <select id="editDifficulty" required>
          <option value="👶 Начинающий" ${recipe.difficulty.includes('Начинающий') ? 'selected' : ''}>👶 Начинающий</option>
          <option value="👨‍🍳 Любитель" ${recipe.difficulty.includes('Любитель') ? 'selected' : ''}>👨‍🍳 Любитель</option>
          <option value="🧑‍🍳 Профессионал" ${recipe.difficulty.includes('Профессионал') ? 'selected' : ''}>🧑‍🍳 Профессионал</option>
        </select>
      </div>

      <div>
        <label class="required-field">Кухня</label>
        <select id="editCuisine" required>
          <option value="🇷🇺 Русская" ${recipe.cuisine.includes('Русская') ? 'selected' : ''}>🇷🇺 Русская</option>
          <option value="🇮🇹 Итальянская" ${recipe.cuisine.includes('Итальянская') ? 'selected' : ''}>🇮🇹 Итальянская</option>
          <option value="🇫🇷 Французская" ${recipe.cuisine.includes('Французская') ? 'selected' : ''}>🇫🇷 Французская</option>
          <option value="🇨🇳 Китайская" ${recipe.cuisine.includes('Китайская') ? 'selected' : ''}>🇨🇳 Китайская</option>
          <option value="🇯🇵 Японская" ${recipe.cuisine.includes('Японская') ? 'selected' : ''}>🇯🇵 Японская</option>
          <option value="🇲🇽 Мексиканская" ${recipe.cuisine.includes('Мексиканская') ? 'selected' : ''}>🇲🇽 Мексиканская</option>
        </select>
      </div>

      <div>
        <label class="required-field">Тип блюда</label>
        <select id="editCategory" required>
          <option value="Закуски" ${recipe.category === 'Закуски' ? 'selected' : ''}>🥗 Закуски</option>
          <option value="Супы" ${recipe.category === 'Супы' ? 'selected' : ''}>🍲 Супы</option>
          <option value="Основные" ${recipe.category === 'Основные' ? 'selected' : ''}>🍛 Основные блюда</option>
          <option value="Десерты" ${recipe.category === 'Десерты' ? 'selected' : ''}>🍰 Десерты</option>
          <option value="Завтраки" ${recipe.category === 'Завтраки' ? 'selected' : ''}>🥞 Завтраки</option>
        </select>
      </div>

      <div>
        <label>Теги (через запятую)</label>
        <input type="text" id="editTags" value="${recipe.tags.join(', ')}">
      </div>

      <div class="edit-button-group">
        <button type="button" class="cancel-btn">Отмена</button>
        <button type="button" class="save-btn">Сохранить изменения</button>
      </div>
    `;
  }

  #setupEditRecipeFormListeners(modal, form, recipe) {
    const cancelBtn = form.querySelector('.cancel-btn');
    const saveBtn = form.querySelector('.save-btn');

    const closeModal = () => document.body.removeChild(modal);

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
      const title = form.querySelector('#editTitle').value.trim();
      const description = form.querySelector('#editDescription').value.trim();
      const time = form.querySelector('#editTime').value.trim();
      const difficulty = form.querySelector('#editDifficulty').value;
      const cuisine = form.querySelector('#editCuisine').value;
      const category = form.querySelector('#editCategory').value;
      const tagsInput = form.querySelector('#editTags').value.trim();

      if (!title || !time || !difficulty || !cuisine || !category) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
      }

      let difficultyLevel = 'medium';
      if (difficulty.includes('Начинающий')) difficultyLevel = 'easy';
      if (difficulty.includes('Профессионал')) difficultyLevel = 'hard';

      let cookingTime = 'medium';
      const timeMinutes = this.#extractTimeMinutes(time);
      if (timeMinutes <= 20) cookingTime = 'fast';
      else if (timeMinutes <= 30) cookingTime = 'short';
      else if (timeMinutes > 60) cookingTime = 'long';

      const updatedData = {
        title,
        description: description || `${title} - вкусный рецепт`,
        time,
        difficulty,
        cuisine,
        category,
        tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [category],
        cookingTime,
        difficultyLevel
      };

      this.#recipeModel.updateRecipe(recipe.id, updatedData);
      closeModal();
      alert(`Рецепт "${title}" успешно обновлен!`);
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function closeOnEscape(event) {
      if (event.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', closeOnEscape);
      }
    });

    form.querySelector('#editTitle').focus();
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
      this.#showEditRecipeForm(recipe);
    }
  }

  #handleDeleteRecipe(recipeId) {
    const recipe = this.#recipeModel.recipes.find(r => r.id === recipeId);
    if (recipe && confirm(`Удалить рецепт "${recipe.title}"?`)) {
      this.#recipeModel.deleteRecipe(recipeId);
      alert(`Рецепт "${recipe.title}" удален!`);
    }
  }

  #clearAllFilters() {
    this.#currentFilters = {};
    
    const elements = {
      '.search-input': (el) => el.value = '',
      '#cuisineFilter': (el) => el.selectedIndex = 0,
      '#timeFilter': (el) => el.selectedIndex = 0,
      '#difficultyFilter': (el) => el.selectedIndex = 0,
      '#categoryFilter': (el) => el.selectedIndex = 0,
      '#ratingFilter': (el) => el.selectedIndex = 0,
      '#tagsFilter': (el) => el.selectedIndex = 0
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
      
      const recipesContainer = this.#boardContainer.querySelector('#recipesContainer');
      if (recipesContainer) {
        recipesContainer.parentNode.insertBefore(resultsCounter, recipesContainer);
      }
    }
    
    const totalRecipes = this.#recipeModel.recipes.length;
    resultsCounter.textContent = resultsCount === totalRecipes 
      ? `Все рецепты: ${resultsCount}`
      : `Найдено: ${resultsCount} из ${totalRecipes}`;
  }

  #getFilterDisplayName(key, value) {
    const displayNames = {
      cuisine: `🌍 ${value.replace(/[🇷🇺🇮🇹🇫🇷🇨🇳🇯🇵🇲🇽]/g, '').trim()}`,
      time: `⏱️ ${this.#getTimeDisplayName(value)}`,
      difficulty: `📊 ${this.#getDifficultyDisplayName(value)}`,
      category: `🍽️ ${value}`,
      rating: `⭐ ${value}+`,
      tags: `🏷️ ${value}`,
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
      rating: '#ratingFilter',
      tags: '#tagsFilter',
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

  #handleModelChange() {
    this.#renderRecipes();
  }
}