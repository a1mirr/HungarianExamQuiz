// ========================================
// HUNGARIAN EXAM QUIZ - INTERACTIVE APPLICATION
// ========================================

// == State Management ==
const state = {
    currentLang: 'en',
    topics: [],
    currentTopic: null,
    currentQuestions: [],
    currentQuestionIndex: 0,
    userScore: 0,
    answeredQuestions: 0,
    questionAnswered: false,
    questionTranslated: false,
    answerTranslated: false,
    currentQuestionHu: '',
    currentQuestionTranslated: '',
    currentAnswerHu: '',
    currentAnswerTranslated: '',
    reportedProblems: [],
    mockExamMode: false
};

// == Translations ==
const translations = {
    en: {
        subtitle: 'Master Hungarian Culture & History',
        selectTopic: 'Select a Topic',
        back: 'Back',
        yourAnswer: 'Your Answer:',
        selectOptions: 'Select the correct option(s):',
        checkAnswer: 'Check Answer',
        showAnswer: 'Show Answer',
        previous: 'Previous',
        next: 'Next',
        questions: 'questions',
        correct: '✓ Correct!',
        incorrect: '✗ Incorrect',
        correctAnswer: 'Correct Answer:',
        score: 'Score',
        translate: 'Translate',
        reportProblem: 'Report Problem',
        problemUnclear: 'Unclear question',
        problemWrongOptions: 'Wrong options',
        problemNoTranslation: 'No translation',
        problemOther: 'Other issue',
        submitProblem: 'Submit',
        exportProblems: 'Export Problems',
        problemReported: 'Problem reported!',
        mockExam: 'Mock Exam',
        mockExamDesc: '12 random questions (2 from each topic)',
        quizComplete: 'Quiz Complete!',
        backToMain: 'Back to Main Menu',
        additionalNotes: 'Additional notes:'
    },
    ru: {
        subtitle: 'Изучайте венгерскую культуру и историю',
        selectTopic: 'Выберите тему',
        back: 'Назад',
        yourAnswer: 'Ваш ответ:',
        selectOptions: 'Выберите правильный вариант(ы):',
        checkAnswer: 'Проверить ответ',
        showAnswer: 'Показать ответ',
        previous: 'Предыдущий',
        next: 'Следующий',
        questions: 'вопросов',
        correct: '✓ Правильно!',
        incorrect: '✗ Неправильно',
        correctAnswer: 'Правильный ответ:',
        score: 'Счёт',
        translate: 'Перевести',
        reportProblem: 'Сообщить о проблеме',
        problemUnclear: 'Неясный вопрос',
        problemWrongOptions: 'Неправильные варианты',
        problemNoTranslation: 'Нет перевода',
        problemOther: 'Другая проблема',
        submitProblem: 'Отправить',
        exportProblems: 'Экспортировать проблемы',
        problemReported: 'Проблема зарегистрирована!',
        mockExam: 'Пробный экзамен',
        mockExamDesc: '12 случайных вопросов (2 из каждой темы)',
        quizComplete: 'Викторина завершена!',
        backToMain: 'Вернуться в главное меню',
        additionalNotes: 'Дополнительные заметки:'
    },
    hu: {
        subtitle: 'Magyar kultúra és történelem mesterei',
        selectTopic: 'Válasszon témát',
        back: 'Vissza',
        yourAnswer: 'Az Ön válasza:',
        selectOptions: 'Válassza ki a helyes lehetőséget/lehetőségeket:',
        checkAnswer: 'Válasz ellenőrzése',
        showAnswer: 'Válasz megjelenítése',
        previous: 'Előző',
        next: 'Következő',
        questions: 'kérdések',
        correct: '✓ Helyes!',
        incorrect: '✗ Helytelen',
        correctAnswer: 'Helyes válasz:',
        score: 'Pontszám',
        translate: 'Fordítás',
        reportProblem: 'Probléma jelentése',
        problemUnclear: 'Nem egyértelmű kérdés',
        problemWrongOptions: 'Rossz lehetőségek',
        problemNoTranslation: 'Nincs fordítás',
        problemOther: 'Egyéb probléma',
        submitProblem: 'Beküldés',
        exportProblems: 'Problémák exportálása',
        problemReported: 'Probléma jelentve!',
        mockExam: 'Próbavizsga',
        mockExamDesc: '12 véletlen kérdés (2 minden témából)',
        quizComplete: 'Kvíz kész!',
        backToMain: 'Vissza a főmenübe',
        additionalNotes: 'További megjegyzések:'
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
    questionType: document.getElementById('questionType'),
    questionText: document.getElementById('questionText'),
    translateQuestionBtn: document.getElementById('translateQuestionBtn'),
    translateAnswerBtn: document.getElementById('translateAnswerBtn'),
    answerInput: document.getElementById('answerInput'),
    userAnswer: document.getElementById('userAnswer'),
    multipleChoice: document.getElementById('multipleChoice'),
    optionsList: document.getElementById('optionsList'),
    feedback: document.getElementById('feedback'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    correctAnswer: document.getElementById('correctAnswer'),
    correctAnswerText: document.getElementById('correctAnswerText'),
    checkBtn: document.getElementById('checkBtn'),
    showAnswerBtn: document.getElementById('showAnswerBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    problemBtn: document.getElementById('problemBtn'),
    problemOptions: document.getElementById('problemOptions'),
    submitProblemBtn: document.getElementById('submitProblemBtn'),
    exportProblemsBtn: document.getElementById('exportProblemsBtn'),
    problemCount: document.getElementById('problemCount'),
    mockExamCard: document.getElementById('mockExamCard'),
    problemNotes: document.getElementById('problemNotes'),
    resultsView: document.getElementById('resultsView'),
    finalPercentage: document.getElementById('finalPercentage'),
    finalScore: document.getElementById('finalScore'),
    correctCount: document.getElementById('correctCount'),
    incorrectCount: document.getElementById('incorrectCount'),
    backToMainBtn: document.getElementById('backToMainBtn')
};

// == Utility Functions ==
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function normalizeAnswer(text) {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function checkAnswer(userAnswer, correctAnswers) {
    const normalized = normalizeAnswer(userAnswer);

    // Support multiple acceptable answers separated by ÷
    const acceptableAnswers = correctAnswers.split('÷').map(a => normalizeAnswer(a));

    return acceptableAnswers.some(answer => normalized === answer);
}

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
        state.userScore = 0;
        state.answeredQuestions = 0;
    });

    // Check answer button
    elements.checkBtn.addEventListener('click', checkUserAnswer);

    // Show answer button
    elements.showAnswerBtn.addEventListener('click', showCorrectAnswer);

    // Navigation buttons
    elements.prevBtn.addEventListener('click', () => navigateQuestion(-1));
    elements.nextBtn.addEventListener('click', () => navigateQuestion(1));

    // Enter key on input
    elements.userAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !state.questionAnswered) {
            checkUserAnswer();
        }
    });

    // Translation buttons
    elements.translateQuestionBtn.addEventListener('click', toggleQuestionTranslation);
    elements.translateAnswerBtn.addEventListener('click', toggleAnswerTranslation);

    // Problem reporting
    elements.problemBtn.addEventListener('click', () => {
        elements.problemOptions.classList.toggle('hidden');
    });

    elements.submitProblemBtn.addEventListener('click', submitProblem);
    elements.exportProblemsBtn.addEventListener('click', exportProblems);

    // Mock exam
    if (elements.mockExamCard) {
        elements.mockExamCard.addEventListener('click', startMockExam);
    }

    // Back to main from results
    if (elements.backToMainBtn) {
        elements.backToMainBtn.addEventListener('click', () => {
            showView('topic');
            state.currentTopic = null;
            state.currentQuestions = [];
            state.userScore = 0;
            state.answeredQuestions = 0;
        });
    }
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
        let questions = await response.json();

        // Randomize question order
        state.currentQuestions = shuffleArray(questions);
        state.currentTopic = state.topics.find(t => t.id === topicId);
        state.currentQuestionIndex = 0;
        state.userScore = 0;
        state.answeredQuestions = 0;
        state.questionAnswered = false;

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

    // Reset state
    state.questionAnswered = false;
    state.questionTranslated = false;
    state.answerTranslated = false;
    elements.checkBtn.disabled = false;
    elements.showAnswerBtn.classList.add('hidden');
    elements.feedback.classList.add('hidden');
    elements.feedback.classList.remove('correct', 'incorrect');
    elements.userAnswer.value = '';

    // Set question type
    elements.questionType.textContent = question.type === 'Multiple' ? 'Multiple Choice' : 'Open Question';

    // Store both Hungarian and translated versions
    const trans = question.translations?.[state.currentLang];
    state.currentQuestionHu = question.question || '-';
    state.currentQuestionTranslated = trans?.question || question.question || '-';

    // Show Hungarian by default
    elements.questionText.textContent = state.currentQuestionHu;

    // Store answer translations
    if (question.type === 'Multiple' && question.options) {
        const correctOptions = question.correctIndices?.map(idx => question.options[idx]) || [];
        state.currentAnswerHu = question.answer || correctOptions.join(', ');
        state.currentAnswerTranslated = trans?.answer || state.currentAnswerHu;
    } else {
        state.currentAnswerHu = question.answer || '-';
        state.currentAnswerTranslated = trans?.answer || question.answer || '-';
    }

    // Show appropriate input type
    if (question.type === 'Multiple') {
        elements.answerInput.classList.add('hidden');
        elements.multipleChoice.classList.remove('hidden');
        renderMultipleChoice(question);
    } else {
        elements.multipleChoice.classList.add('hidden');
        elements.answerInput.classList.remove('hidden');
    }

    updateProgress();
    updateNavigationButtons();
}

// == Render Multiple Choice ==
function renderMultipleChoice(question) {
    if (!question.options || !question.options.length) {
        elements.optionsList.innerHTML = '<p>No options available</p>';
        return;
    }

    // Randomize option order but keep track of original indices
    const indexedOptions = question.options.map((option, index) => ({ option, originalIndex: index }));
    const shuffledOptions = shuffleArray(indexedOptions);

    elements.optionsList.innerHTML = shuffledOptions.map((item, displayIndex) => `
        <label class="option-item" data-original-index="${item.originalIndex}">
            <input type="checkbox" class="option-checkbox" data-index="${displayIndex}">
            <span class="option-text">${item.option}</span>
        </label>
    `).join('');
}

// == Check User Answer ==
function checkUserAnswer() {
    if (state.questionAnswered) return;

    const question = state.currentQuestions[state.currentQuestionIndex];
    let isCorrect = false;

    if (question.type === 'Multiple') {
        // Get selected options
        const checkboxes = elements.optionsList.querySelectorAll('.option-checkbox:checked');
        const selectedOriginalIndices = Array.from(checkboxes).map(cb => {
            return parseInt(cb.closest('.option-item').dataset.originalIndex);
        });

        // Check if correct
        const correctIndices = question.correctIndices || [];
        isCorrect = selectedOriginalIndices.length === correctIndices.length &&
            selectedOriginalIndices.every(idx => correctIndices.includes(idx));

        // Show correct/incorrect visually
        document.querySelectorAll('.option-item').forEach(item => {
            const originalIndex = parseInt(item.dataset.originalIndex);
            if (correctIndices.includes(originalIndex)) {
                item.classList.add('correct');
            } else if (selectedOriginalIndices.includes(originalIndex)) {
                item.classList.add('incorrect');
            }
        });

    } else {
        // Open question
        const userAnswer = elements.userAnswer.value.trim();
        if (!userAnswer) {
            alert('Please enter an answer');
            return;
        }

        isCorrect = checkAnswer(userAnswer, question.answer);
    }

    // Update score
    if (isCorrect) {
        state.userScore++;
    }
    state.answeredQuestions++;
    state.questionAnswered = true;

    // Show feedback
    showFeedback(isCorrect, question);

    // Update buttons
    elements.checkBtn.disabled = true;
    elements.showAnswerBtn.classList.remove('hidden');
}

// == Translation Toggle ==
function toggleQuestionTranslation() {
    state.questionTranslated = !state.questionTranslated;
    elements.questionText.textContent = state.questionTranslated
        ? state.currentQuestionTranslated
        : state.currentQuestionHu;
}

function toggleAnswerTranslation() {
    state.answerTranslated = !state.answerTranslated;
    elements.correctAnswerText.textContent = state.answerTranslated
        ? state.currentAnswerTranslated
        : state.currentAnswerHu;
}

// == Show Feedback ==
function showFeedback(isCorrect, question) {
    elements.feedback.classList.remove('hidden');

    if (isCorrect) {
        elements.feedback.classList.add('correct');
        elements.feedbackIcon.textContent = '✓';
        elements.feedbackText.textContent = translations[state.currentLang].correct;
        elements.correctAnswer.classList.add('hidden');
    } else {
        elements.feedback.classList.add('incorrect');
        elements.feedbackIcon.textContent = '✗';
        elements.feedbackText.textContent = translations[state.currentLang].incorrect;

        // Show correct answer using stored values
        elements.correctAnswerText.textContent = state.currentAnswerHu;
        elements.correctAnswer.classList.remove('hidden');
    }

    // Update progress to show score
    updateProgress();
}

// == Show Correct Answer ==
function showCorrectAnswer() {
    const question = state.currentQuestions[state.currentQuestionIndex];
    const trans = question.translations?.[state.currentLang];

    elements.feedback.classList.remove('hidden', 'correct', 'incorrect');
    elements.feedbackIcon.textContent = '💡';
    elements.feedbackText.textContent = translations[state.currentLang].showAnswer;

    elements.correctAnswerText.textContent = state.currentAnswerHu;
    elements.correctAnswer.classList.remove('hidden');

    state.questionAnswered = true;
    elements.checkBtn.disabled = true;
}

// == Navigation ==
function navigateQuestion(direction) {
    const newIndex = state.currentQuestionIndex + direction;

    // Check if we're moving past the last question
    if (newIndex >= state.currentQuestions.length) {
        showResults();
        return;
    }

    state.currentQuestionIndex = newIndex;
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

    let scoreText = '';
    if (state.answeredQuestions > 0) {
        const scorePercentage = ((state.userScore / state.answeredQuestions) * 100).toFixed(1);
        scoreText = ` | ${translations[state.currentLang].score}: ${state.userScore}/${state.answeredQuestions} (${scorePercentage}%)`;
    }
    elements.progressText.textContent = `${current} / ${total}${scoreText}`;
    elements.progressFill.style.width = `${percentage}%`;
}

// == Results Screen ==
function showResults() {
    const totalQuestions = state.answeredQuestions;
    const correctAnswers = state.userScore;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0;

    // Update results display
    elements.finalPercentage.textContent = `${percentage}%`;
    elements.finalScore.textContent = `${correctAnswers} / ${totalQuestions}`;
    elements.correctCount.textContent = correctAnswers;
    elements.incorrectCount.textContent = incorrectAnswers;

    // Show results view
    showView('results');
}

// == UI Updates ==
function showView(viewName) {
    elements.topicView.classList.toggle('active', viewName === 'topic');
    elements.quizView.classList.toggle('active', viewName === 'quiz');
    elements.resultsView.classList.toggle('active', viewName === 'results');
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

// == Problem Reporting ==
function submitProblem() {
    const checkboxes = document.querySelectorAll('.problem-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one issue type');
        return;
    }

    const issues = Array.from(checkboxes).map(cb => cb.value);
    const question = state.currentQuestions[state.currentQuestionIndex];
    const notes = elements.problemNotes.value.trim();

    state.reportedProblems.push({
        topicId: state.currentTopic.id,
        topicName: state.currentTopic.name.en,
        questionIndex: state.currentQuestionIndex,
        questionHu: state.currentQuestionHu,
        questionTranslated: state.currentQuestionTranslated,
        answerHu: state.currentAnswerHu,
        answerTranslated: state.currentAnswerTranslated,
        questionType: question.type,
        options: question.options || null,
        correctIndices: question.correctIndices || null,
        issues: issues,
        notes: notes,
        timestamp: new Date().toISOString()
    });

    // Update UI
    elements.problemCount.textContent = state.reportedProblems.length;
    elements.exportProblemsBtn.classList.remove('hidden');
    elements.problemOptions.classList.add('hidden');

    // Reset form
    checkboxes.forEach(cb => cb.checked = false);
    elements.problemNotes.value = '';

    // Show confirmation
    alert(translations[state.currentLang].problemReported);
}

function exportProblems() {
    if (state.reportedProblems.length === 0) {
        alert('No problems to export');
        return;
    }

    // Format as JSON with readable structure
    const exportData = {
        exportDate: new Date().toISOString(),
        totalProblems: state.reportedProblems.length,
        problems: state.reportedProblems
    };

    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hungarian-quiz-problems-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// == Mock Exam ==
async function startMockExam() {
    try {
        const allQuestions = [];

        // Load 2 random questions from each topic
        for (const topic of state.topics) {
            const response = await fetch(`data/${topic.id}.json`);
            const questions = await response.json();

            // Shuffle and take 2
            const shuffled = shuffleArray(questions);
            const selected = shuffled.slice(0, 2).map(q => ({
                ...q,
                topicName: topic.name[state.currentLang],
                topicId: topic.id
            }));

            allQuestions.push(...selected);
        }

        // Shuffle all 12 questions
        state.currentQuestions = shuffleArray(allQuestions);
        state.currentTopic = {
            id: 'mock-exam',
            name: {
                en: 'Mock Exam',
                ru: 'Пробный экзамен',
                hu: 'Próbavizsga'
            }
        };
        state.currentQuestionIndex = 0;
        state.userScore = 0;
        state.answeredQuestions = 0;
        state.questionAnswered = false;
        state.mockExamMode = true;

        elements.topicTitle.textContent = state.currentTopic.name[state.currentLang];

        loadQuestion();
        updateProgress();
        showView('quiz');
    } catch (error) {
        console.error('Failed to load mock exam:', error);
        alert('Failed to load mock exam. Please try again.');
    }
}

// == Start Application ==
document.addEventListener('DOMContentLoaded', init);
