// validators.js - Input validation logic for Hungarian quiz app

/**
 * Normalize Hungarian accents for comparison
 */
function normalizeAccents(text) {
    const accentMap = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o', 'ú': 'u', 'ü': 'u', 'ű': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ö': 'O', 'Ő': 'O', 'Ú': 'U', 'Ü': 'U', 'Ű': 'U'
    };
    return text.replace(/[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/g, char => accentMap[char] || char);
}

/**
 * Person name validator - handles Hungarian name conventions
 * Features: case-insensitive, accent-insensitive, order-agnostic
 */
function validatePerson(userAnswer, correctAnswer) {
    const normalize = (text) => normalizeAccents(text).toLowerCase().trim();

    // Filter out Roman numerals (I., II., III., etc.)
    const filterRomanNumerals = (parts) => {
        return parts.filter(part => !/^[IVX]+\.?$/i.test(part));
    };

    // Check each acceptable answer (÷ separator)
    const alternatives = correctAnswer.split('÷').map(a => a.trim());

    for (const correct of alternatives) {
        const userParts = normalize(userAnswer).split(/\s+/).filter(p => p);
        const correctParts = normalize(correct).split(/\s+/).filter(p => p);

        // Filter Roman numerals
        const userSignificant = filterRomanNumerals(userParts);
        const correctSignificant = filterRomanNumerals(correctParts);

        // Check if all parts match (in any order)
        if (userSignificant.length === correctSignificant.length &&
            userSignificant.every(part => correctSignificant.includes(part))) {
            return true;
        }
    }

    return false;
}

/**
 * Date validator - handles various date formats
 * Supports: years (1848), full dates (1848.03.15), flexible formats
 */
function validateDate(userAnswer, correctAnswer) {
    const extractDigits = (text) => text.match(/\d+/g) || [];
    const userDigits = extractDigits(userAnswer);

    if (userDigits.length === 0) return false;

    // Check ALL alternatives (÷ separator)
    const alternatives = correctAnswer.split('÷').map(a => a.trim());

    for (const correct of alternatives) {
        const correctDigits = extractDigits(correct);
        if (correctDigits.length === 0) continue;

        // Only year (3-4 digits)
        if (correctDigits.length === 1 && correctDigits[0].length >= 3) {
            const correctYear = correctDigits[0];
            // Accept if user's input contains this year
            if (userDigits.some(d => d === correctYear)) {
                return true;
            }
        }
        // Full date - all digit parts must match exactly
        else if (userDigits.length === correctDigits.length &&
            userDigits.every((d, i) => d === correctDigits[i])) {
            return true;
        }
    }

    return false;
}

/**
 * Date interval validator - handles year ranges
 * Supports: 1241-1242, 1241-42 (short form)
 */
function validateDateInterval(userAnswer, correctAnswer) {
    const userMatch = userAnswer.match(/(\d{3,4})-(\d{2,4})/);
    if (!userMatch) return false;

    // Check ALL alternatives
    const alternatives = correctAnswer.split('÷').map(a => a.trim());

    for (const correct of alternatives) {
        const correctMatch = correct.match(/(\d{3,4})-(\d{2,4})/);
        if (!correctMatch) continue;

        let userStart = userMatch[1];
        let userEnd = userMatch[2];
        let correctStart = correctMatch[1];
        let correctEnd = correctMatch[2];

        // Handle short form (e.g., 41 instead of 1241)
        if (userEnd.length === 2) {
            userEnd = userStart.substring(0, 2) + userEnd;
        }
        if (correctEnd.length === 2) {
            correctEnd = correctStart.substring(0, 2) + correctEnd;
        }

        if (userStart === correctStart && userEnd === correctEnd) {
            return true;
        }
    }

    return false;
}

/**
 * Number validator - accepts only digits
 * HTML5 type="number" already restricts input to numbers
 */
function validateNumber(userAnswer, correctAnswer) {
    // Remove all non-digit characters for comparison
    const userNum = userAnswer.replace(/\D/g, '');

    if (!userNum) return false;

    // Check against all acceptable numbers (÷ separator)
    const acceptableNumbers = correctAnswer.split('÷')
        .map(a => a.trim().replace(/\D/g, ''))
        .filter(n => n.length > 0);

    return acceptableNumbers.includes(userNum);
}

/**
 * Default validator - basic text matching
 */
function checkAnswer(userAnswer, correctAnswer) {
    const normalize = (text) => text.toLowerCase().trim();
    const userNorm = normalize(userAnswer);

    // Check against all acceptable answers (÷ separator)
    const acceptableAnswers = correctAnswer.split('÷').map(a => normalize(a));
    return acceptableAnswers.includes(userNorm);
}

/**
 * Detect input type based on answer pattern
 */
function detectInputType(answer) {
    if (!answer) return 'text';

    const firstAlternative = answer.split('÷')[0].trim();

    // Number: starts with digit
    if (/^\d+/.test(firstAlternative)) {
        return 'number';
    }

    // Date interval: contains year range pattern
    const hasInterval = /\d{3,4}-\d{2,4}/.test(answer);
    if (hasInterval) {
        // Only detect as interval if it's the primary content, not embedded in text
        const intervalMatch = answer.match(/\d{3,4}-\d{2,4}/);
        if (intervalMatch && intervalMatch[0].length > answer.length * 0.3) {
            return 'date-interval';
        }
    }

    // Date: contains date pattern
    if (/\d{3,4}[.\s]\d{1,2}[.\s]\d{1,2}/.test(answer) || /^\d{4}$/.test(firstAlternative)) {
        return 'date';
    }

    // Person: contains at least 2 words with capital letters (name pattern)
    const words = firstAlternative.split(/\s+/);
    const capitalWords = words.filter(w => /^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(w));
    if (capitalWords.length >= 2) {
        return 'person';
    }

    return 'text';
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        normalizeAccents,
        validatePerson,
        validateDate,
        validateDateInterval,
        validateNumber,
        checkAnswer,
        detectInputType
    };
}
