// config.js - Configuration and constants for Hungarian quiz app

/**
 * Translations for multi-language support
 */
const translations = {
    en: {
        subtitle: 'Master Hungarian Culture & History',
        selectTopic: 'Select a Topic',
        back: 'Back',
        yourAnswer: 'Your Answer:',
        selectOptions: 'Select the correct option(s):',
        selectAnswer: 'Please select an answer',
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
        additionalNotes: 'Additional notes:',
        enterNumber: 'Enter number',
        enterDate: 'Enter date',
        enterDateInterval: 'Enter year range (e.g., 1241-1242)',
        enterName: 'Enter name',
        official: 'Official',
        approximateHint: 'Approximate value accepted (±10%)',
        translateAnswer: 'Translate Answer',
        finish: 'Finish',
        pageExam: 'Page Test',
        pageExamDesc: 'Practice questions from a specific page (3-52)',
        start: 'Start',
        noQuestionsOnPage: 'No questions found for this page.'
    },
    ru: {
        subtitle: 'Изучайте венгерскую культуру и историю',
        selectTopic: 'Выберите тему',
        back: 'Назад',
        yourAnswer: 'Ваш ответ:',
        selectOptions: 'Выберите правильный вариант(ы):',
        selectAnswer: 'Пожалуйста, выберите ответ',
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
        additionalNotes: 'Дополнительные заметки:',
        enterNumber: 'Введите число',
        enterDate: 'Введите дату',
        enterDateInterval: 'Введите диапазон лет (например, 1241-1242)',
        enterName: 'Введите имя',
        official: 'Официальное значение',
        approximateHint: 'Принимается приблизительное значение (±10%)',
        translateAnswer: 'Перевести ответ',
        finish: 'Завершить',
        pageExam: 'Тест по странице',
        pageExamDesc: 'Практика вопросов с конкретной страницы (3-52)',
        start: 'Начать',
        noQuestionsOnPage: 'Вопросов для этой страницы не найдено.'
    },
    hu: {
        subtitle: 'Magyar kultúra és történelem mesterei',
        selectTopic: 'Válasszon témát',
        back: 'Vissza',
        yourAnswer: 'Az Ön válasza:',
        selectOptions: 'Válassza ki a helyes lehetőséget/lehetőségeket:',
        selectAnswer: 'Kérlek válassz egy választ',
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
        additionalNotes: 'További megjegyzések:',
        enterNumber: 'Írj be egy számot',
        enterDate: 'Írj be egy dátumot',
        enterDateInterval: 'Írja be az évtartományt (pl. 1241-1242)',
        enterName: 'Írj be egy nevet',
        official: 'Hivatalos',
        approximateHint: 'Elfogadható közelítő érték (±10%)',
        translateAnswer: 'Válasz fordítása',
        finish: 'Befejezés',
        pageExam: 'Oldal Teszt',
        pageExamDesc: 'Gyakoroljon kérdéseket egy adott oldalról (3-52)',
        start: 'Indítás',
        noQuestionsOnPage: 'Nincs kérdés ezen az oldalon.'
    }
};

/**
 * Input type configuration
 * Maps input types to HTML attributes and placeholders
 */
const inputTypeConfig = {
    number: {
        htmlType: 'number',
        placeholderKey: 'enterNumber',
        inputMode: 'numeric',
        attributes: {
            min: '0',
            step: '1'
        }
    },
    date: {
        htmlType: 'date',
        placeholderKey: 'enterDate',
        inputMode: 'text',
        attributes: {}
    },
    'date-interval': {
        htmlType: 'text',
        placeholderKey: 'enterDateInterval',
        inputMode: 'numeric',
        attributes: {}
    },
    person: {
        htmlType: 'text',
        placeholderKey: 'enterName',
        inputMode: 'text',
        attributes: {}
    },
    text: {
        htmlType: 'text',
        placeholderKey: 'yourAnswer',
        inputMode: 'text',
        attributes: {}
    }
};

/**
 * Apply input configuration to an input element
 */
function applyInputConfig(inputElement, inputType, currentLang) {
    const config = inputTypeConfig[inputType] || inputTypeConfig.text;

    // Set HTML type
    inputElement.setAttribute('type', config.htmlType);

    // Set placeholder
    const placeholder = translations[currentLang][config.placeholderKey] ||
        translations.en[config.placeholderKey];
    inputElement.setAttribute('placeholder', placeholder);

    // Set input mode
    inputElement.setAttribute('inputmode', config.inputMode);

    // Remove all possible attributes first
    inputElement.removeAttribute('min');
    inputElement.removeAttribute('max');
    inputElement.removeAttribute('step');

    // Apply specific attributes
    Object.entries(config.attributes).forEach(([key, value]) => {
        inputElement.setAttribute(key, value);
    });
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        translations,
        inputTypeConfig,
        applyInputConfig
    };
}
