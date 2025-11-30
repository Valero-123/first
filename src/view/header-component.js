import { AbstractComponent } from '../framework/view/abstract-component.js';

function createHeaderComponentTemplate() {
  return `
    <header>
      <div class="container">
        <div class="logo">FlavorHub</div>
        <nav class="nav-menu">
          <a href="#" class="nav-link">Рецепты</a>
          <a href="#" class="nav-link">Категории</a>
          <a href="#" class="nav-link">О проекте</a>
        </nav>
        <button class="theme-toggle" id="themeToggle">
          <span class="theme-icon">🌙</span>
          <span class="theme-text">Темная тема</span>
        </button>
      </div>
    </header>
  `;
}

export default class HeaderComponent extends AbstractComponent {
  getTemplate() {
    return createHeaderComponentTemplate();
  }
}