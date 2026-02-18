// ========================================
// HUNGARIAN EXAM QUIZ - INTERACTIVE APPLICATION
// ========================================

// == DOM Elements ==
const elements = {
    // Buttons
    langBtns: document.querySelectorAll('.lang-btn'),
    backBtn: document.getElementById('backBtn'),
    checkBtn: document.getElementById('checkBtn'),
    showAnswerBtn: document.getElementById('showAnswerBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    translateQuestionBtn: document.getElementById('translateQuestionBtn'),
    translateAnswerBtn: document.getElementById('translateAnswerBtn'),
    problemBtn: document.getElementById('problemBtn'),
    submitProblemBtn: document.getElementById('submitProblemBtn'),
    exportProblemsBtn: document.getElementById('exportProblemsBtn'),
    backToMainBtn: document.getElementById('backToMainBtn'),

    // Inputs
    userAnswer: document.getElementById('userAnswer'),
    problemNotes: document.getElementById('problemNotes'),

    // Containers & Views
    topicView: document.getElementById('topicView'),
    quizView: document.getElementById('quizView'),
    resultsView: document.getElementById('resultsView'),
    topicGrid: document.getElementById('topicGrid'),
    mockExamCard: document.getElementById('mockExamCard'),
    pageExamCard: document.getElementById('pageExamCard'),
    pageInput: document.getElementById('pageInput'),
    startPageExamBtn: document.getElementById('startPageExamBtn'),
    problemOptions: document.getElementById('problemOptions'),
    multipleChoice: document.getElementById('multipleChoice'),
    answerInput: document.getElementById('answerInput'),
    listInputs: document.getElementById('listInputs'),
    listInputsContainer: document.getElementById('listInputsContainer'),
    optionsList: document.getElementById('optionsList'),
    feedback: document.getElementById('feedback'),
    correctAnswer: document.getElementById('correctAnswer'),

    // Text Elements
    topicTitle: document.getElementById('topicTitle'),
    questionType: document.getElementById('questionType'),
    questionText: document.getElementById('questionText'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    correctAnswerText: document.getElementById('correctAnswerText'),
    progressText: document.getElementById('progressText'),
    progressFill: document.getElementById('progressFill'),
    finalPercentage: document.getElementById('finalPercentage'),
    finalScore: document.getElementById('finalScore'),
    correctCount: document.getElementById('correctCount'),
    incorrectCount: document.getElementById('incorrectCount'),
    problemCount: document.getElementById('problemCount')
};

// DEBUG: Verify script execution
// alert('App script loaded');

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
    currentAnswerTranslated: '',
    reportedProblems: [],
    mockExamMode: false,
    sessionAnswers: {} // Key: topicId_questionIndex, Value: { answered: boolean, correct: boolean, userAnswer: any }
};

// == Helper Functions ==
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Fix Bug #13: Remove unused normalizeAnswer
// function normalizeAnswer(text) { ... }

// Note: Validators (validatePerson, validateDate, etc.) are in validators.js
// Note: Config (translations, inputTypeConfig) are in config.js
// Note: Input type detection (detectInputType) is in validators.js

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
        alert('Failed to initialize app: ' + error.message + '\n\nPossible reasons:\n1. Opening file directly (CORS error) - use a local server\n2. Invalid JSON data');
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

        // Fix Bug #15: Reset mock exam mode when going back
        state.mockExamMode = false;

        // Clear session answers
        state.sessionAnswers = {};
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

    // Page exam
    if (elements.startPageExamBtn) {
        elements.startPageExamBtn.addEventListener('click', startPageExam);
    }

    // Prevent input click from triggering card click (if we had card click)
    // but here button is separate.

    // Back to main from results
    if (elements.backToMainBtn) {
        elements.backToMainBtn.addEventListener('click', () => {
            showView('topic');
            state.currentTopic = null;
            state.currentQuestions = [];
            state.userScore = 0;
            state.userScore = 0;
            state.answeredQuestions = 0;
            state.sessionAnswers = {}; // Reset session
            state.mockExamMode = false;
        });
    }
}

// == Page Exam ==
async function startPageExam() {
    const pageNum = parseInt(elements.pageInput.value);
    if (!pageNum || pageNum < 3 || pageNum > 52) {
        alert("Please enter a valid page number (3-52)");
        return;
    }

    try {
        // Load all questions
        const allQuestions = [];
        for (const topic of state.topics) {
            const response = await fetch(`data/${topic.id}.json`);
            const questions = await response.json();
            allQuestions.push(...questions);
        }

        // Filter by page
        const pageQuestions = allQuestions.filter(q => q.pages && q.pages.includes(pageNum));

        if (pageQuestions.length === 0) {
            alert(translations[state.currentLang].noQuestionsOnPage || `No questions found for page ${pageNum}. Try another page.`);
            return;
        }

        // Setup exam state
        state.currentQuestions = shuffleArray(pageQuestions);
        state.currentTopic = {
            id: 'page_exam',
            name: {
                en: `Page ${pageNum} Test`,
                ru: `Тест по странице ${pageNum}`,
                hu: `${pageNum}. oldal teszt`
            }
        };
        state.currentQuestionIndex = 0;
        state.userScore = 0;
        state.answeredQuestions = 0;
        state.answeredQuestions = 0;
        state.sessionAnswers = {}; // Reset
        state.questionAnswered = false;
        state.mockExamMode = true;

        elements.topicTitle.textContent = state.currentTopic.name[state.currentLang];

        loadQuestion();
        updateProgress();
        showView('quiz');

    } catch (error) {
        console.error('Failed to start page exam:', error);
        alert('Error starting exam: ' + error.message);
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

    // Reset state defaults
    state.questionAnswered = false;
    state.questionTranslated = false;
    state.answerTranslated = false;
    elements.checkBtn.disabled = false;
    elements.checkBtn.classList.remove('hidden');
    elements.nextBtn.classList.add('hidden');
    elements.showAnswerBtn.classList.add('hidden');
    elements.feedback.classList.add('hidden');
    elements.feedback.classList.remove('correct', 'incorrect');
    elements.userAnswer.value = '';

    // Check if question was already answered in this session
    // We use a unique key for the question. In topic mode: topicId_index. 
    // In mixed/page modes, we might need a better ID if questions are shuffled, but they are stored in state.currentQuestions.
    // If we navigate back/forth in the SAME 'session' (currentQuestions list), index is sufficient UNIQUE identifier for THIS session.
    // If we reload topic, state.sessionAnswers should probably be cleared? 
    // Actually, loadTopic clears state.userScore, so it should clear sessionAnswers too.

    // For now, let's use index as key relative to currentQuestions
    const sessionKey = `${state.currentTopic ? state.currentTopic.id : 'unknown'}_${state.currentQuestionIndex}`;
    const savedState = state.sessionAnswers[sessionKey];

    if (savedState && savedState.answered) {
        state.questionAnswered = true;
        // elements.checkBtn.disabled = true; 
        elements.checkBtn.classList.add('hidden');
        elements.nextBtn.classList.remove('hidden');
        elements.showAnswerBtn.classList.remove('hidden');

        // Restore feedback
        showFeedback(savedState.correct, question);

        // Restore specific input states would require more complex render logic 
        // (e.g. pre-filling inputs). 
        // For simplicity in this fix, we primarily ensure SCORING is not repeated.
        // But for UX, we should ideally show their previous answer.
        // We will try to restore input values if saved.
        if (savedState.userAnswer) {
            if (question.type === 'Multiple') {
                // We need to wait for renderMultipleChoice to happen first, 
                // So we can't do it here easily unless we move render logic up or doing it after render.
                // We will handle this by setting a flag or doing it after type setup.
            } else if (question.inputType === 'list') {
                // Similar issue
            } else {
                elements.userAnswer.value = savedState.userAnswer;
            }
        }
    }

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
        // Correct options are the first N options
        const correctCount = question.correctCount || 0;
        const correctOptions = question.options.slice(0, correctCount);

        state.currentAnswerHu = question.answer || correctOptions.join(', ');
        // For translations, we also assume first N are correct (migration script ensures this)
        const transOptions = trans?.options || [];
        const transCorrectOptions = transOptions.slice(0, correctCount);
        state.currentAnswerTranslated = trans?.answer || (transCorrectOptions.length ? transCorrectOptions.join(', ') : state.currentAnswerHu);
    } else {
        state.currentAnswerHu = question.answer || '-';
        state.currentAnswerTranslated = trans?.answer || question.answer || '-';
    }

    // Show appropriate input type
    if (question.type === 'Open') {
        elements.multipleChoice.classList.add('hidden');

        // Check for List Input Type
        if (question.inputType === 'list') {
            elements.answerInput.classList.add('hidden');
            elements.listInputs.classList.remove('hidden');
            elements.listInputsContainer.innerHTML = '';

            const count = question.inputCount || 3;
            for (let i = 0; i < count; i++) {
                const wrapper = document.createElement('div');
                wrapper.className = 'list-input-item';

                const number = document.createElement('span');
                number.className = 'list-input-number';
                number.textContent = (i + 1) + '.';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'list-input-field';
                input.placeholder = translations[state.currentLang].yourAnswer || 'Your answer';

                // Enter key handler
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !state.questionAnswered) {
                        checkUserAnswer();
                    }
                });

                wrapper.appendChild(number);
                wrapper.appendChild(input);
                elements.listInputsContainer.appendChild(wrapper);
            }
        } else {
            // Standard Single Input
            elements.listInputs.classList.add('hidden');
            elements.answerInput.classList.remove('hidden');
            elements.userAnswer.value = '';

            // Detect input type and configure input field accordingly
            const inputType = question.inputType || 'text';
            let htmlType = 'text';
            let placeholder = translations[state.currentLang].yourAnswer || 'Your answer';
            let inputMode = 'text';

            switch (inputType) {
                case 'number':
                    htmlType = 'number';
                    placeholder = translations[state.currentLang].enterNumber || 'Enter number (e.g., 7)';
                    inputMode = 'numeric';
                    elements.userAnswer.setAttribute('min', '0');
                    elements.userAnswer.setAttribute('step', '1');
                    break;
                case 'date':
                    // Fix Bug #8: Use text input for historical dates
                    htmlType = 'text';
                    placeholder = translations[state.currentLang].enterDate || 'YYYY.MM.DD';
                    inputMode = 'numeric'; // Help mobile keyboards
                    break;
                case 'year':
                    htmlType = 'number';
                    placeholder = translations[state.currentLang].enterYear || 'Enter year (e.g. 1001)';
                    inputMode = 'numeric';
                    break;
                case 'date-interval':
                    htmlType = 'text';
                    placeholder = translations[state.currentLang].enterDateInterval || 'Enter year range (e.g., 1241-1242)';
                    inputMode = 'numeric';
                    break;
                case 'person':
                    htmlType = 'text';
                    placeholder = translations[state.currentLang].enterName || 'Enter name';
                    break;
                default:
                    htmlType = 'text';
                    placeholder = translations[state.currentLang].yourAnswer || 'Your answer';
            }

            elements.userAnswer.setAttribute('type', htmlType);
            elements.userAnswer.setAttribute('placeholder', placeholder);
            elements.userAnswer.setAttribute('inputmode', inputMode);

            // Remove number-specific attributes if not number type
            if (inputType !== 'number') {
                elements.userAnswer.removeAttribute('min');
                elements.userAnswer.removeAttribute('step');
            }
        }
    } else if (question.type === 'Multiple') {
        elements.answerInput.classList.add('hidden');
        elements.listInputs.classList.add('hidden');
        elements.multipleChoice.classList.remove('hidden');
        renderMultipleChoice(question);
    } else {
        // Default to open answer if type is unknown or not handled
        elements.multipleChoice.classList.add('hidden');
        elements.listInputs.classList.add('hidden');
        elements.answerInput.classList.remove('hidden');
    }

    updateProgress();
    updateNavigationButtons();
}

// == Render Multiple Choice ==
function renderMultipleChoice(question) {
    // Determine which options to show
    // Default to base options
    let displayOptions = question.options;

    // Check for translations
    if (state.questionTranslated && question.translations?.[state.currentLang]?.options) {
        displayOptions = question.translations[state.currentLang].options;
    }

    if (!displayOptions || !displayOptions.length) {
        elements.optionsList.innerHTML = '<p>No options available</p>';
        return;
    }

    // We need to map display options to original indices to check correctness
    // assumption: translated options array matches order of original options array
    const indexedOptions = displayOptions.map((option, index) => ({
        option,
        originalIndex: index
    }));

    // Randomize option order
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
    // == Multiple Choice ==
    if (question.type === 'Multiple') {
        const selected = Array.from(elements.optionsList.querySelectorAll('input[type="checkbox"]:checked'));

        if (selected.length === 0) {
            alert(translations[state.currentLang].selectAnswer || 'Please select an answer');
            return;
        }

        // Correct answers are always the first N options (where N = correctCount)
        // Correct answers are always the first N options (where N = correctCount)
        const correctCount = question.correctCount || 0;

        // Get original indices of selected options
        const selectedOriginalIndices = selected.map(checkbox =>
            parseInt(checkbox.closest('.option-item').dataset.originalIndex)
        );

        // Check if selection matches correct answers (indices < correctCount)
        // Since we reordered specific options to be first in JSON, 
        // any option with originalIndex < correctCount is correct.
        if (selectedOriginalIndices.length !== correctCount) {
            isCorrect = false;
        } else {
            isCorrect = selectedOriginalIndices.every(idx => idx < correctCount);
        }

        // Show correct/incorrect visually
        document.querySelectorAll('.option-item').forEach(item => {
            const originalIndex = parseInt(item.dataset.originalIndex);
            if (originalIndex < correctCount) {
                item.classList.add('correct');
            } else if (selectedOriginalIndices.includes(originalIndex)) {
                item.classList.add('incorrect');
            }
        });

    } else {
        // == Open Answer ==
        // Use explicit inputType if available, otherwise default to text
        const inputType = question.inputType || 'text';

        // Handle List Input Validation
        if (inputType === 'list') {
            const inputs = Array.from(elements.listInputsContainer.querySelectorAll('.list-input-field'));

            // Check if at least one input has value
            const hasAnswer = inputs.some(input => input.value.trim() !== '');
            if (!hasAnswer) {
                alert(translations[state.currentLang].checkAnswer || 'Please enter an answer');
                return;
            }

            // Get raw answers (including empty strings) to preserve index mapping
            const rawAnswers = inputs.map(input => input.value.trim());

            const listResult = validateList(rawAnswers, question.answer, question.inputCount || 3);
            isCorrect = listResult.passed;

            // Visual feedback for individual inputs
            inputs.forEach((input, index) => {
                input.classList.remove('correct', 'incorrect');

                if (listResult.validIndices.includes(index)) {
                    input.classList.add('correct');
                } else {
                    // Only mark as incorrect if it has a value
                    if (input.value.trim()) {
                        input.classList.add('incorrect');
                    }
                }
                // Disable inputs
                input.disabled = true;
            });
        }
        // Handle Single Input
        else {
            const userAnswer = elements.userAnswer.value.trim();
            if (!userAnswer) {
                alert(translations[state.currentLang].checkAnswer || 'Please enter an answer');
                return;
            }

            // Handle approximate validation (population, area, etc.)
            if (inputType === 'approximate') {
                const result = validateApproximate(userAnswer, question.answer, question.tolerance || 0.1);

                if (result.exact) {
                    isCorrect = true;
                } else if (result.withinTolerance) {
                    // User is within tolerance - mark correct but show official value
                    isCorrect = true;
                    state.questionAnswered = true;
                    state.answeredQuestions++;
                    state.userScore++;

                    // Format official value with unit
                    const formatted = result.correctValue.toLocaleString(state.currentLang === 'hu' ? 'hu-HU' : 'en-US');
                    const unit = question.unit || '';
                    const officialLabel = translations[state.currentLang].official;

                    elements.feedback.className = 'feedback correct';
                    elements.feedback.className = 'feedback correct';
                    // Fix Bug #9: Use feedbackText to preserve DOM structure (icon etc)
                    elements.feedbackText.textContent = `${translations[state.currentLang].correct} (${officialLabel}: ${formatted} ${unit})`;
                    elements.feedback.classList.remove('hidden');

                    // Update UI
                    elements.userAnswer.disabled = true;
                    elements.userAnswer.disabled = true;
                    elements.checkBtn.classList.add('hidden');
                    elements.nextBtn.classList.remove('hidden');
                    elements.showAnswerBtn.classList.add('hidden');
                    // Fix Bug #10: Remove undefined updateScore, call updateProgress
                    updateProgress();
                    return;
                } else {
                    isCorrect = false;
                }
            } else {
                // Standard validation based on inputType
                switch (inputType) {
                    case 'person':
                        isCorrect = validatePerson(userAnswer, question.answer);
                        break;
                    case 'date':
                    case 'year':
                        isCorrect = validateDate(userAnswer, question.answer);
                        break;
                    case 'date-interval':
                    case 'year-interval':
                        isCorrect = validateDateInterval(userAnswer, question.answer);
                        break;
                    case 'number':
                        isCorrect = validateNumber(userAnswer, question.answer);
                        break;
                    default:
                        isCorrect = checkAnswer(userAnswer, question.answer);
                }
            }
        }
    }
    // Update score
    if (isCorrect) {
        state.userScore++;
    }
    state.answeredQuestions++;
    state.questionAnswered = true;

    // Save state to prevent double counting (Bug #1)
    const sessionKey = `${state.currentTopic?.id}_${state.currentQuestionIndex}`;

    // Capture user answer for restoration
    let savedAnswer = null;
    if (question.type === 'Multiple') {
        const selected = Array.from(elements.optionsList.querySelectorAll('input[type="checkbox"]:checked'));
        savedAnswer = selected.map(cb => parseInt(cb.closest('.option-item').dataset.originalIndex));
    } else if (question.inputType === 'list') {
        // ... capture list ...
    } else {
        savedAnswer = elements.userAnswer.value;
    }

    state.sessionAnswers[sessionKey] = {
        answered: true,
        correct: isCorrect,
        userAnswer: savedAnswer
    };

    // Show feedback
    showFeedback(isCorrect, question);

    // Update buttons
    elements.checkBtn.classList.add('hidden');
    elements.nextBtn.classList.remove('hidden');

    // Fix Bug #19: Hide Show Answer button if correct, otherwise show it
    if (isCorrect) {
        elements.showAnswerBtn.classList.add('hidden');
    } else {
        elements.showAnswerBtn.classList.remove('hidden');
    }

    // Show translate answer button
    const translateBtn = document.getElementById('translateAnswerBtn');
    if (translateBtn) {
        translateBtn.classList.remove('hidden');
        translateBtn.onclick = toggleAnswerTranslation;
        translateBtn.title = translations[state.currentLang].translateAnswer;
    }
}

// Helper to restore MC visual state after re-render
function reapplyMultipleChoiceFeedback() {
    const question = state.currentQuestions[state.currentQuestionIndex];
    const correctCount = question.correctCount || 0;

    // We need to know what the user selected. 
    // If we saved it in sessionAnswers, use that.
    const sessionKey = `${state.currentTopic?.id}_${state.currentQuestionIndex}`;
    const savedState = state.sessionAnswers[sessionKey];
    const savedSelection = savedState?.userAnswer || []; // Array of original indices

    document.querySelectorAll('.option-item').forEach(item => {
        const originalIndex = parseInt(item.dataset.originalIndex);
        const input = item.querySelector('input');

        // Restore checked state
        if (savedSelection.includes(originalIndex)) {
            input.checked = true;
        }
        input.disabled = true;

        if (originalIndex < correctCount) {
            item.classList.add('correct');
        } else if (savedSelection.includes(originalIndex)) {
            item.classList.add('incorrect');
        }
    });
}

// == Translation Toggle ==
function toggleQuestionTranslation() {
    state.questionTranslated = !state.questionTranslated;
    elements.questionText.textContent = state.questionTranslated
        ? state.currentQuestionTranslated
        : state.currentQuestionHu;

    // Fix Bug #6: Re-render multiple choice options if needed
    const question = state.currentQuestions[state.currentQuestionIndex];
    if (question && question.type === 'Multiple') {
        renderMultipleChoice(question);
        // If question was answered, we need to restore the visual state of the new options
        if (state.questionAnswered) {
            const sessionKey = `${state.currentTopic?.id}_${state.currentQuestionIndex}`;
            const savedState = state.sessionAnswers[sessionKey];
            // Re-apply correct/incorrect classes using saved answers or logic
            // This is complex because we just re-rendered. 
            // We can just call checkUserAnswer again? No, that updates score.
            // We should inspect the options against saved logic provided we have it.
            // For now, simpler: just let them see the translated text. 
            // Ideally we re-run the "visual feedback" part of checkUserAnswer.
            reapplyMultipleChoiceFeedback();
        }
    }
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
        // Default to Hungarian initially
        state.answerTranslated = false;
        elements.correctAnswerText.textContent = state.currentAnswerHu;
        elements.correctAnswer.classList.remove('hidden');

        // Ensure translate button is visible
        const translateBtn = document.getElementById('translateAnswerBtn');
        if (translateBtn) {
            translateBtn.classList.remove('hidden');
            translateBtn.onclick = toggleAnswerTranslation;
        }
    }

    // Update progress to show score
    updateProgress();
}

// == Show Correct Answer ==
function showCorrectAnswer() {
    const question = state.currentQuestions[state.currentQuestionIndex];
    if (!question) return;

    elements.feedback.classList.remove('hidden', 'correct', 'incorrect');
    elements.feedbackIcon.textContent = '💡';
    elements.feedbackText.textContent = translations[state.currentLang].showAnswer;

    // Reset translation state
    state.answerTranslated = false;
    elements.correctAnswerText.textContent = state.currentAnswerHu;
    elements.correctAnswer.classList.remove('hidden');

    // Show translate button
    const translateBtn = document.getElementById('translateAnswerBtn');
    if (translateBtn) {
        translateBtn.classList.remove('hidden');
        translateBtn.onclick = toggleAnswerTranslation;
        translateBtn.title = translations[state.currentLang].translateAnswer;
    }

    state.questionAnswered = true;

    // Fix Bug #5: Show Answer didn't count as answered
    if (!state.sessionAnswers[`${state.currentTopic?.id}_${state.currentQuestionIndex}`]?.answered) {
        state.answeredQuestions++;
        // Mark as answered but NOT correct (score not incremented)
        state.sessionAnswers[`${state.currentTopic?.id}_${state.currentQuestionIndex}`] = {
            answered: true,
            correct: false,
            userAnswer: null // No user answer
        };
        updateProgress();
    }

    elements.checkBtn.classList.add('hidden');
    elements.nextBtn.classList.remove('hidden');

    // Fix Bug #19: Hide Show Answer button after clicking it? 
    // No, user might want to toggle translation of answer. 
    // But maybe change text?
    // The issue says "Show Answer button redundancy". 
    // If we showed the answer, the button is now performing its function. 
    // Usually it stays to verify.
    elements.showAnswerBtn.classList.add('hidden');
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

    const isLastQuestion = state.currentQuestionIndex === state.currentQuestions.length - 1;
    const nextBtnText = elements.nextBtn.querySelector('span');

    if (isLastQuestion) {
        nextBtnText.textContent = translations[state.currentLang].finish || 'Finish';
        elements.nextBtn.classList.add('finish-btn');
    } else {
        nextBtnText.textContent = translations[state.currentLang].next || 'Next';
        elements.nextBtn.classList.remove('finish-btn');
    }
    // Always enable next button to allow finishing
    elements.nextBtn.disabled = false;
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
    // Show confirmation with copyable text
    const reportText = `REPORT PROBLEM
Topic: ${state.currentTopic.name.en} (${state.currentTopic.id})
Question Index: ${state.currentQuestionIndex}
Type: ${question.type}
Issues: ${issues.join(', ')}
Notes: ${notes}

Question: ${state.currentQuestionHu}
Answer: ${state.currentAnswerHu}
`;

    const message = translations[state.currentLang].mailToDev || "Please send to @a1mirr on Telegram:";
    prompt(message, reportText);
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
