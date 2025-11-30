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
    console.log('🔍 Starting filtration with filters:', filters);
    let filteredRecipes = [...this.#recipes];

    // Filter by cuisine
    if (filters.cuisine && filters.cuisine !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const recipeCuisine = this.#extractCuisineName(recipe.cuisine);
        const filterCuisine = this.#extractCuisineName(filters.cuisine);
        const matches = recipeCuisine === filterCuisine;
        console.log(`🍳 ${recipe.title} - кухня: ${recipeCuisine}, фильтр: ${filterCuisine}, совпадение: ${matches}`);
        return matches;
      });
    }

    // Filter by search text
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredRecipes = filteredRecipes.filter(recipe => {
        const matches = recipe.title.toLowerCase().includes(searchTerm) ||
                       recipe.description.toLowerCase().includes(searchTerm) ||
                       recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        console.log(`🔍 ${recipe.title} - поиск: "${searchTerm}", совпадение: ${matches}`);
        return matches;
      });
    }

    // Filter by cooking time
    if (filters.time && filters.time !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const timeMinutes = this.#extractTimeMinutes(recipe.time);
        let matches = false;
        
        switch (filters.time) {
          case 'fast':
            matches = timeMinutes <= 20;
            break;
          case 'short':
            matches = timeMinutes <= 30;
            break;
          case 'medium':
            matches = timeMinutes <= 60;
            break;
          case 'long':
            matches = timeMinutes > 60;
            break;
          default:
            matches = true;
        }
        
        console.log(`⏱️ ${recipe.title} - время: ${recipe.time} (${timeMinutes} мин), фильтр: ${filters.time}, совпадение: ${matches}`);
        return matches;
      });
    }

    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const matches = recipe.difficultyLevel === filters.difficulty;
        console.log(`📊 ${recipe.title} - сложность: ${recipe.difficultyLevel}, фильтр: ${filters.difficulty}, совпадение: ${matches}`);
        return matches;
      });
    }

    // Filter by category
    if (filters.category && filters.category !== '') {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const matches = recipe.category === filters.category || 
                       recipe.tags.includes(filters.category);
        console.log(`🍽️ ${recipe.title} - категория: ${recipe.category}, теги: ${recipe.tags}, фильтр: ${filters.category}, совпадение: ${matches}`);
        return matches;
      });
    }

    console.log('🔍 Filtration completed. Results:', filteredRecipes.length);
    return filteredRecipes;
  }

  #extractCuisineName(cuisineString) {
    return cuisineString.replace(/[🇷🇺🇮🇹🇫🇷🇨🇳🇯🇵🇲🇽]/g, '').trim();
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