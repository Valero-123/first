export default class RecipeModel {
  constructor() {
    this._recipes = [];
    this._observers = [];
  }

  get recipes() {
    return this._recipes;
  }

  setRecipes(recipes) {
    this._recipes = recipes;
    this._notifyObservers();
  }

  addRecipe(recipe) {
    // Генерируем ID если его нет
    if (!recipe.id) {
      recipe.id = Date.now().toString();
    }
    this._recipes.unshift(recipe);
    this._notifyObservers();
  }

  updateRecipe(recipeId, updatedData) {
    const index = this._recipes.findIndex(recipe => recipe.id === recipeId);
    if (index !== -1) {
      this._recipes[index] = { ...this._recipes[index], ...updatedData };
      this._notifyObservers();
    }
  }

  deleteRecipe(recipeId) {
    this._recipes = this._recipes.filter(recipe => recipe.id !== recipeId);
    this._notifyObservers();
  }

  // НОВЫЙ МЕТОД: Перемещение рецепта
  moveRecipe(draggedId, targetId) {
    const draggedIndex = this._recipes.findIndex(recipe => recipe.id === draggedId);
    const targetIndex = this._recipes.findIndex(recipe => recipe.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      // Удаляем перемещаемый рецепт и вставляем его на новую позицию
      const [movedRecipe] = this._recipes.splice(draggedIndex, 1);
      this._recipes.splice(targetIndex, 0, movedRecipe);
      
      // Сохраняем порядок в localStorage
      this._saveRecipesOrder();
      
      this._notifyObservers();
      return true;
    }
    return false;
  }

  // Сохранение порядка рецептов
  _saveRecipesOrder() {
    if (typeof Storage !== 'undefined') {
      const recipesOrder = this._recipes.map(recipe => recipe.id);
      localStorage.setItem('recipesOrder', JSON.stringify(recipesOrder));
    }
  }

  // Загрузка порядка рецептов
  loadRecipesOrder() {
    if (typeof Storage !== 'undefined') {
      const savedOrder = localStorage.getItem('recipesOrder');
      if (savedOrder) {
        const order = JSON.parse(savedOrder);
        this._sortRecipesByOrder(order);
      }
    }
  }

  // Сортировка рецептов по сохраненному порядку
  _sortRecipesByOrder(order) {
    this._recipes.sort((a, b) => {
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
  }

  filterRecipes(filters = {}) {
    let filteredRecipes = [...this._recipes];

    // Фильтр по кухне
    if (filters.cuisine && filters.cuisine !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.cuisine === filters.cuisine
      );
    }

    // Фильтр по времени приготовления
    if (filters.time && filters.time !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const timeValue = filters.time;
        switch (timeValue) {
          case 'fast':
            return recipe.cookingTime === 'short' || (parseInt(recipe.time) <= 20);
          case 'short':
            return recipe.cookingTime === 'short' || (parseInt(recipe.time) <= 30);
          case 'medium':
            return recipe.cookingTime === 'medium' || (parseInt(recipe.time) > 30 && parseInt(recipe.time) <= 60);
          case 'long':
            return recipe.cookingTime === 'long' || (parseInt(recipe.time) > 60);
          default:
            return true;
        }
      });
    }

    // Фильтр по сложности
    if (filters.difficulty && filters.difficulty !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.difficultyLevel === filters.difficulty
      );
    }

    // Фильтр по категории
    if (filters.category && filters.category !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.category === filters.category || 
        recipe.tags.includes(filters.category)
      );
    }

    // Фильтр по поиску
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filteredRecipes;
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter(obs => obs !== observer);
  }

  _notifyObservers() {
    this._observers.forEach(observer => {
      if (typeof observer === 'function') {
        observer();
      }
    });
  }
}