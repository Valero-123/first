export class RecipeListComponent {
  constructor() {
    this.element = this.createElement();
    this.setupDropZone();
  }

  createElement() {
    const listElement = document.createElement('div');
    listElement.className = 'recipes-list';
    listElement.id = 'recipesContainer'; // Изменено для совместимости
    return listElement;
  }

  setupDropZone() {
    // Разрешаем сброс
    this.element.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      
      // Добавляем визуальную обратную связь для зоны сброса
      this.element.classList.add('drop-zone-active');
    });

    // Убираем визуальную обратную связь при уходе
    this.element.addEventListener('dragleave', (event) => {
      if (!this.element.contains(event.relatedTarget)) {
        this.element.classList.remove('drop-zone-active');
      }
    });

    // Обрабатываем сброс
    this.element.addEventListener('drop', (event) => {
      event.preventDefault();
      this.element.classList.remove('drop-zone-active');
      
      const recipeId = event.dataTransfer.getData('text/plain');
      
      // Находим целевой элемент рецепта
      const targetRecipeElement = event.target.closest('.popular-card');
      
      if (targetRecipeElement) {
        const targetRecipeId = targetRecipeElement.dataset.recipeId;
        
        // Инициируем перемещение
        if (this.onRecipeMove) {
          this.onRecipeMove(recipeId, targetRecipeId);
        }
      } else {
        // Если сбросили на пустое место - перемещаем в конец
        if (this.onRecipeMoveToEnd) {
          this.onRecipeMoveToEnd(recipeId);
        }
      }
    });
  }

  setOnRecipeMove(callback) {
    this.onRecipeMove = callback;
  }

  setOnRecipeMoveToEnd(callback) {
    this.onRecipeMoveToEnd = callback;
  }

  clear() {
    this.element.innerHTML = '';
  }

  addRecipeComponent(recipeComponent) {
    this.element.appendChild(recipeComponent.getElement());
  }

  getElement() {
    return this.element;
  }
}