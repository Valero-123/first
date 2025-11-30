import HeaderComponent from './view/header-component.js';
import RecipeModel from './model/recipe-model.js';
import RecipesBoardPresenter from './presenter/recipes-board-presenter.js';
import { render, RenderPosition } from './framework/render.js';

console.log('🚀 FlavorHub app starting...');

class App {
  #recipeModel = null;
  #headerComponent = null;
  #boardPresenter = null;

  constructor() {
    this.#recipeModel = new RecipeModel();
    this.#headerComponent = new HeaderComponent();
  }

  init() {
    console.log('📄 Initializing app...');
    
    this.#renderHeader();
    this.#initRecipeBoard();
    this.#initThemeToggle();
    this.#initSubscriptionForm();
    
    console.log('✅ App initialized successfully');
  }

  #renderHeader() {
    const headerContainer = document.querySelector('body');
    if (headerContainer) {
      render(this.#headerComponent, headerContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #initRecipeBoard() {
    const boardContainer = document.getElementById('recipeBoardContainer');
    if (boardContainer) {
      this.#boardPresenter = new RecipesBoardPresenter(this.#recipeModel, boardContainer);
      this.#boardPresenter.init();
    } else {
      console.error('❌ Recipe board container not found!');
    }
  }

  #initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.#updateThemeButton(isDark ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      this.#updateThemeButton('dark');
    }
  }

  #updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Светлая тема';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Темная тема';
    }
  }

  #initSubscriptionForm() {
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const emailInput = event.target.querySelector('.email-input');
        const email = emailInput.value;
        
        if (email && email.includes('@')) {
          alert(`Спасибо за подписку! На адрес ${email} будут приходить новые рецепты.`);
          event.target.reset();
        } else {
          alert('Пожалуйста, введите корректный email адрес.');
        }
      });
    }
  }
}

// Запуск приложения
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}