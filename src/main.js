// main.js
console.log('🚀 FlavorHub app starting...');

// Импорты
import RecipeModel from './src/model/recipe-model.js';
import RecipesBoardPresenter from './src/presenter/recipes-board-presenter.js';

// Переменная для хранения рецептов
let recipes = [];

// Проверяем загрузку DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function initApp() {
    console.log('📄 DOM ready, initializing app...');
    
    try {
        // Загружаем рецепты из mock файла
        await loadRecipes();
        
        // Инициализируем модель
        const recipeModel = new RecipeModel();
        recipeModel.setRecipes(recipes);
        recipeModel.loadRecipesOrder(); // Загружаем сохраненный порядок
        
        // Удаляем статический контент
        removeStaticContent();
        
        // Создаем и рендерим хедер
        renderHeader();
        
        // Инициализируем доску рецептов с презентером
        const boardContainer = document.getElementById('recipeBoardContainer');
        const boardPresenter = new RecipesBoardPresenter(recipeModel, boardContainer);
        boardPresenter.init();
        
        // Инициализируем форму подписки
        initSubscriptionForm();
        
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showErrorMessage('Не удалось загрузить рецепты. Пожалуйста, обновите страницу.');
    }
}

async function loadRecipes() {
    try {
        console.log('🔍 Loading recipes from mock file...');
        
        // Динамически импортируем рецепты
        const recipeModule = await import('./mock/recipe.js');
        recipes = [...recipeModule.mockRecipes];
        
        console.log(`✅ Loaded ${recipes.length} recipes from mock file`);
        console.log('📝 Recipe titles:', recipes.map(r => r.title));
        
    } catch (error) {
        console.error('❌ Error loading recipes:', error);
        
        // Fallback: создаем несколько базовых рецептов если файл не загрузился
        recipes = [
            {
                id: 'fallback-1',
                title: "Карбонара",
                time: "20 мин",
                difficulty: "👨‍🍳 Любитель",
                rating: "4.7",
                description: "Классическая итальянская паста с беконом и сыром.",
                tags: ["Паста", "Итальянская"],
                badge: "Классика",
                cuisine: "🇮🇹 Итальянская",
                cookingTime: "short",
                difficultyLevel: "medium",
                category: "Основные"
            },
            {
                id: 'fallback-2',
                title: "Окрошка",
                time: "25 мин",
                difficulty: "👶 Начинающий",
                rating: "4.3",
                description: "Освежающий холодный суп для жаркого лета.",
                tags: ["Супы", "Русская"],
                badge: "Лето",
                cuisine: "🇷🇺 Русская",
                cookingTime: "short",
                difficultyLevel: "easy",
                category: "Супы"
            }
        ];
        
        console.warn('⚠️ Using fallback recipes');
    }
}

function showErrorMessage(message) {
    const container = document.getElementById('recipeBoardContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>Ошибка загрузки</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Попробовать снова</button>
            </div>
        `;
    }
}

function removeStaticContent() {
    const elementsToRemove = ['header', '.filters', '.search-section', '.popular-section', '.more-link'];
    
    elementsToRemove.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
            console.log(`🗑️ Removed: ${selector}`);
        }
    });
}

function renderHeader() {
    const headerHTML = `
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
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    initThemeToggle();
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeButton(isDark ? 'dark' : 'light');
    });

    // Восстанавливаем тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeButton('dark');
    }
}

function updateThemeButton(theme) {
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

function initSubscriptionForm() {
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

// Глобальные функции для модального окна (если используются в других компонентах)
window.closeAddRecipeForm = function() {
    const modal = document.getElementById('addRecipeModal');
    if (modal) {
        modal.remove();
        console.log('❌ Add recipe form closed');
    }
}

window.saveNewRecipe = function() {
    const title = document.getElementById('addTitle').value.trim();
    const description = document.getElementById('addDescription').value.trim();
    const time = document.getElementById('addTime').value.trim();
    const difficulty = document.getElementById('addDifficulty').value;
    const cuisine = document.getElementById('addCuisine').value;
    const category = document.getElementById('addCategory').value;
    const tagsInput = document.getElementById('addTags').value.trim();

    // Валидация
    if (!title) {
        alert('Название рецепта обязательно для заполнения!');
        document.getElementById('addTitle').focus();
        return;
    }

    if (!time) {
        alert('Время приготовления обязательно для заполнения!');
        document.getElementById('addTime').focus();
        return;
    }

    if (!difficulty) {
        alert('Выберите сложность рецепта!');
        document.getElementById('addDifficulty').focus();
        return;
    }

    if (!cuisine) {
        alert('Выберите кухню рецепта!');
        document.getElementById('addCuisine').focus();
        return;
    }

    if (!category) {
        alert('Выберите тип блюда!');
        document.getElementById('addCategory').focus();
        return;
    }

    // Определяем уровень сложности
    let difficultyLevel = 'medium';
    if (difficulty.includes('Начинающий')) difficultyLevel = 'easy';
    if (difficulty.includes('Профессионал')) difficultyLevel = 'hard';

    // Определяем время приготовления
    let cookingTime = 'medium';
    const timeMinutes = extractTimeMinutes(time);
    if (timeMinutes <= 20) cookingTime = 'fast';
    else if (timeMinutes <= 30) cookingTime = 'short';
    else if (timeMinutes > 60) cookingTime = 'long';

    // Обработка тегов
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [category];

    // Создаем новый рецепт
    const newRecipe = {
        id: Date.now().toString(),
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

    // Добавляем рецепт в массив (для совместимости со старым кодом)
    if (window.recipeModel) {
        window.recipeModel.addRecipe(newRecipe);
    }
    
    // Показываем уведомление
    alert(`Рецепт "${title}" успешно добавлен!`);
    
    // Закрываем форму
    closeAddRecipeForm();
}

function extractTimeMinutes(timeString) {
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

// Функции для кнопок в карточке рецепта (для совместимости)
window.editRecipe = function(recipeId) {
    alert(`Редактирование рецепта ID: ${recipeId}\n\nЭта функция находится в разработке.`);
}

window.deleteRecipe = function(recipeId) {
    if (confirm('Вы уверены, что хотите удалить этот рецепт?')) {
        alert('Рецепт удален!');
    }
}