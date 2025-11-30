import { mockRecipes } from '../mock/recipe.js';

export default class RecipeModel {
  #recipes = [...mockRecipes];
  #observers = [];

  get recipes() {
    return this.#recipes;
  }

  addRecipe(recipeData) {
    const newRecipe = {
      id: this.#generateId(),
      title: recipeData.title,
      time: recipeData.time,
      difficulty: recipeData.difficulty,
      rating: "4.5",
      description: recipeData.description,
      tags: recipeData.tags,
      badge: "Новый",
      cuisine: recipeData.cuisine,
      cookingTime: recipeData.cookingTime,
      difficultyLevel: recipeData.difficultyLevel,
      category: recipeData.category || "Основные"
    };
    
    this.#recipes.push(newRecipe);
    this._notify();
  }

  updateRecipe(id, updatedData) {
    const index = this.#recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      this.#recipes[index] = { ...this.#recipes[index], ...updatedData };
      this._notify();
    }
  }

  deleteRecipe(id) {
    this.#recipes = this.#recipes.filter(recipe => recipe.id !== id);
    this._notify();
  }

  // Drag & Drop: изменение порядка рецептов
  reorderRecipes(sourceIndex, targetIndex) {
    if (sourceIndex === targetIndex) return;
    
    const [movedRecipe] = this.#recipes.splice(sourceIndex, 1);
    this.#recipes.splice(targetIndex, 0, movedRecipe);
    this._notify();
  }

  filterRecipes(filters = {}) {
    let filteredRecipes = [...this.#recipes];

    if (filters.cuisine && filters.cuisine !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        this.#extractCuisineName(recipe.cuisine) === this.#extractCuisineName(filters.cuisine)
      );
    }

    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.time && filters.time !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const timeMinutes = this.#extractTimeMinutes(recipe.time);
        switch (filters.time) {
          case 'fast': return timeMinutes <= 20;
          case 'short': return timeMinutes <= 30;
          case 'medium': return timeMinutes <= 60;
          case 'long': return timeMinutes > 60;
          default: return true;
        }
      });
    }

    if (filters.difficulty && filters.difficulty !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.difficultyLevel === filters.difficulty
      );
    }

    if (filters.category && filters.category !== '') {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.tags.some(tag => tag === filters.category) ||
        recipe.category === filters.category
      );
    }

    if (filters.rating && filters.rating !== '') {
      const minRating = parseFloat(filters.rating);
      filteredRecipes = filteredRecipes.filter(recipe => 
        parseFloat(recipe.rating) >= minRating
      );
    }

    if (filters.tags && filters.tags !== '') {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.tags.some(tag => tag === filters.tags)
      );
    }

    return filteredRecipes;
  }

  #extractCuisineName(cuisineString) {
    return cuisineString.replace(/[🇷🇺🇮🇹🇫🇷🇨🇳🇯🇵🇲🇽🇹🇭🇺🇸🇪🇸🇭🇺🇮🇱🇱🇧🇰🇷🇨🇺🇬🇷🇮🇳🇻🇳]/g, '').trim();
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

  addObserver(observer) {
    this.#observers.push(observer);
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter(obs => obs !== observer);
  }

  _notify() {
    this.#observers.forEach(observer => {
      if (typeof observer === 'function') {
        observer();
      }
    });
  }

  #generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}