// ========================================
// HUNGARIAN EXAM QUIZ - APPLICATION LOGIC
// ========================================

// == State Management ==
const state = {
    currentLang: 'en',
    topics: [],
    currentTopic: null,
    currentQuestions: [],
    currentQuestionIndex: 0,
    isFlipped: false
};

// == Translations ==
const translations = {
    en: {
        subtitle: 'Master Hungarian Culture & History',
        selectTopic: 'Select a Topic',
        back: 'Back',
        word: 'Question',
        example: 'Details',
        translation: 'Answer',
        exampleTranslation: 'Translation',
        showTranslation: 'Show Answer',
        hideTranslation: 'Show Question',
        previous: 'Previous',
        next: 'Next',
        questions: 'questions'
    },
    ru: {
        subtitle: 'Изучайте венгерскую культуру и историю',
        selectTopic: 'Выберите тему',
        back: 'Назад',
        word: 'Вопрос',
        example: 'Детали',
        translation: 'Ответ',
        exampleTranslation: 'Перевод',
        showTranslation: 'Показать ответ',
        hideTranslation: 'Показать вопрос',
        previous: 'Предыдущий',
        next: 'Следующий',
        questions: 'вопросов'
    },
    hu: {
        subtitle: 'Magyar kultúra és történelem mesterei',
        selectTopic: 'Válasszon témát',
        back: 'Vissza',
        word: 'Kérdés',
        example: 'Részletek',
        translation: 'Válasz',
        exampleTranslation: 'Fordítás',
        showTranslation: 'Válasz megjelenítése',
        hideTranslation: 'Kérdés megjelenítése',
        previous: 'Előző',
        next: 'Következő',
        questions: 'kérdések'
    }
};

// == DOM Elements ==
const elements = {
    langBtns: document.querySelectorAll('.lang-btn'),
    topicView: document.getElementById('topicView'),
    quizView: document.getElementById('quizView'),
    topicGrid: document.getElementById('topicGrid'),
    backBtn: document.getElementById('backBtn'),
    topicTitle: document.getElementById('topicTitle'),
    progressText: document.getElementById('progressText'),
    progressFill: document.getElementById('progressFill'),
    cardInner: document.querySelector('.card-inner'),
    wordHu: document.getElementById('wordHu'),
    exampleHu: document.getElementById('exampleHu'),
    wordTranslation: document.getElementById('wordTranslation'),
    exampleTranslation: document.getElementById('exampleTranslation'),
    flipBtn: document.getElementById('flipBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn')
};

// == Initialization ==
async function init() {
    try {
        // Load topics
        const topicsResponse = await fetch('data/topics.json');
        state.topics = await topicsResponse.json();

        // Load language from localStorage
        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang && translations[savedLang]) {
            state.currentLang = savedLang;
            updateActiveLanguageButton();
        }

        // Render topics
        renderTopics();
        updateUI();

        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

// == Event Listeners ==
function setupEventListeners() {
    // Language buttons
    elements.langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentLang = btn.dataset.lang;
            localStorage.setItem('selectedLang', state.currentLang);
            updateActiveLanguageButton();
            updateUI();
            if (state.currentTopic) {
                loadQuestion();
            }
        });
    });

    // Back button
    elements.backBtn.addEventListener('click', () => {
        showView('topic');
        state.currentTopic = null;
        state.currentQuestions = [];
    });

    // Flip button
    elements.flipBtn.addEventListener('click', () => {
        state.isFlipped = !state.isFlipped;
        elements.cardInner.classList.toggle('flipped');
        updateFlipButtonText();
    });

    // Navigation buttons
    elements.prevBtn.addEventListener('click', () => navigateQuestion(-1));
    elements.nextBtn.addEventListener('click', () => navigateQuestion(1));
}

// == Topic Rendering ==
function renderTopics() {
    elements.topicGrid.innerHTML = state.topics.map(topic => `
        <div class="topic-card" data-topic-id="${topic.id}">
            <span class="topic-icon">${topic.icon}</span>
            <h3 class="topic-name">${topic.name[state.currentLang]}</h3>
            <p class="topic-count" data-count-for="${topic.id}">Loading...</p>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', () => {
            loadTopic(card.dataset.topicId);
        });
    });

    // Load question counts
    loadQuestionCounts();
}

// == Load Question Counts ==
async function loadQuestionCounts() {
    for (const topic of state.topics) {
        try {
            const response = await fetch(`data/${topic.id}.json`);
            const questions = await response.json();
            const countEl = document.querySelector(`[data-count-for="${topic.id}"]`);
            if (countEl) {
                countEl.textContent = `${questions.length} ${translations[state.currentLang].questions}`;
            }
        } catch (error) {
            console.error(`Failed to load ${topic.id}:`, error);
        }
    }
}

// == Load Topic ==
async function loadTopic(topicId) {
    try {
        const response = await fetch(`data/${topicId}.json`);
        state.currentQuestions = await response.json();

        state.currentTopic = state.topics.find(t => t.id === topicId);
        state.currentQuestionIndex = 0;
        state.isFlipped = false;

        elements.topicTitle.textContent = state.currentTopic.name[state.currentLang];

        loadQuestion();
        updateProgress();
        showView('quiz');
    } catch (error) {
        console.error('Failed to load topic:', error);
        alert('Failed to load questions. Please try again.');
    }
}

// == Load Question ==
function loadQuestion() {
    const question = state.currentQuestions[state.currentQuestionIndex];

    if (!question) return;

    // Reset flip state
    state.isFlipped = false;
    elements.cardInner.classList.remove('flipped');
    updateFlipButtonText();

    // Load Hungarian content (always show question in Hungarian)
    elements.wordHu.textContent = question.question || '-';
    elements.exampleHu.textContent = question.type ? `Type: ${question.type}` : '';

    // Load translation content based on selected language
    const trans = question.translations?.[state.currentLang];
    if (trans) {
        elements.wordTranslation.textContent = trans.question || question.question || '-';

        // Show answer
        if (question.type === 'Multiple' && question.options) {
            // Build multiple choice answer display
            const correctOptions = question.correctIndices?.map(idx => question.options[idx]) || [];
            elements.exampleTranslation.textContent = correctOptions.join(', ') || trans.answer || question.answer || '-';
        } else {
            elements.exampleTranslation.textContent = trans.answer || question.answer || '-';
        }
    } else {
        // Fallback to Hungarian if no translation
        elements.wordTranslation.textContent = question.question || '-';
        elements.exampleTranslation.textContent = question.answer || '-';
    }

    updateProgress();
    updateNavigationButtons();
}

// == Navigation ==
function navigateQuestion(direction) {
    state.currentQuestionIndex += direction;
    loadQuestion();
}

function updateNavigationButtons() {
    elements.prevBtn.disabled = state.currentQuestionIndex === 0;
    elements.nextBtn.disabled = state.currentQuestionIndex === state.currentQuestions.length - 1;
}

// == Progress ==
function updateProgress() {
    const current = state.currentQuestionIndex + 1;
    const total = state.currentQuestions.length;
    const percentage = (current / total) * 100;

    elements.progressText.textContent = `${current} / ${total}`;
    elements.progressFill.style.width = `${percentage}%`;
}

// == UI Updates ==
function showView(viewName) {
    elements.topicView.classList.toggle('active', viewName === 'topic');
    elements.quizView.classList.toggle('active', viewName === 'quiz');
}

function updateActiveLanguageButton() {
    elements.langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === state.currentLang);
    });
}

function updateUI() {
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[state.currentLang][key]) {
            el.textContent = translations[state.currentLang][key];
        }
    });

    // Update topic names
    if (elements.topicGrid) {
        renderTopics();
    }
}

function updateFlipButtonText() {
    const key = state.isFlipped ? 'hideTranslation' : 'showTranslation';
    const textEl = elements.flipBtn.querySelector('span:last-child');
    if (textEl) {
        textEl.textContent = translations[state.currentLang][key];
    }
}

// == Start Application ==
document.addEventListener('DOMContentLoaded', init);
