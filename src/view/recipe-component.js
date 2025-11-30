export class RecipeComponent {
  constructor(recipe) {
    this.recipe = recipe;
    this.element = this.createElement();
    this.setupDragAndDrop();
  }

  createElement() {
    const recipeElement = document.createElement('div');
    recipeElement.className = 'popular-card';
    recipeElement.dataset.recipeId = this.recipe.id;
    
    recipeElement.innerHTML = `
      ${this.recipe.badge ? `<div class="card-badge ${this.recipe.badge === 'Тренд' ? 'trending' : ''}">${this.recipe.badge}</div>` : ''}
      <div class="card-content">
        <div class="drag-handle">☰</div>
        <h3 class="card-title">${this.recipe.title}</h3>
        <div class="card-meta">
          <span class="meta-item">⏱️ ${this.recipe.time}</span>
          <span class="meta-item">${this.recipe.difficulty}</span>
          <span class="meta-item">⭐ ${this.recipe.rating}</span>
        </div>
        <p class="card-description">${this.recipe.description}</p>
        <div class="card-tags">
          ${this.recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="card-btn">
          <button class="change">📝 Редактировать</button>
          <button class="delete">🗑️ Удалить</button>
        </div>
      </div>
    `;

    return recipeElement;
  }

  setupDragAndDrop() {
    // Делаем элемент перетаскиваемым
    this.element.setAttribute('draggable', 'true');
    this.element.classList.add('draggable-recipe');

    // Обработчик начала перетаскивания
    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this.recipe.id);
      this.element.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      
      // Добавляем визуальную обратную связь
      setTimeout(() => {
        this.element.style.opacity = '0.4';
      }, 0);
    });

    // Обработчик завершения перетаскивания
    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('dragging');
      this.element.style.opacity = '1';
      
      // Убираем классы drag-over со всех элементов
      document.querySelectorAll('.popular-card').forEach(item => {
        item.classList.remove('drag-over');
      });
    });

    // Обработчики для визуальной обратной связи при наведении
    this.element.addEventListener('dragenter', (event) => {
      event.preventDefault();
      this.element.classList.add('drag-over');
    });

    this.element.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    });

    this.element.addEventListener('dragleave', () => {
      this.element.classList.remove('drag-over');
    });

    // Обработчик сброса на самом элементе
    this.element.addEventListener('drop', (event) => {
      event.preventDefault();
      this.element.classList.remove('drag-over');
      
      const recipeId = event.dataTransfer.getData('text/plain');
      
      // Инициируем перемещение только если это другой рецепт
      if (recipeId !== this.recipe.id) {
        if (this.onRecipeMove) {
          this.onRecipeMove(recipeId, this.recipe.id);
        }
      }
    });
  }

  setOnRecipeMove(callback) {
    this.onRecipeMove = callback;
  }

  setOnEdit(callback) {
    const editBtn = this.element.querySelector('.change');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        callback(this.recipe.id);
      });
    }
  }

  setOnDelete(callback) {
    const deleteBtn = this.element.querySelector('.delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        callback(this.recipe.id);
      });
    }
  }

  getElement() {
    return this.element;
  }
}