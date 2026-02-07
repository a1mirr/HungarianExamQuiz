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
 * Shared normalization logic
 * - Handles accents
 * - Lowercase & trim
 * - Removes leading articles (a, az, the)
 */
function normalizeText(text) {
    let norm = normalizeAccents(text).toLowerCase().trim();
    // Remove leading articles (a, az, the) followed by space
    return norm.replace(/^(a|az|the)\s+/i, '');
}

/**
 * Approximate number validator - accepts values within tolerance range
 * Used for population, area, casualties, economic figures, etc.
 * @param {string} userAnswer - User's input
 * @param {string} correctAnswer - Official correct value
 * @param {number} tolerance - Acceptable deviation (default 0.1 = ±10%)
 * @returns {object} { exact, withinTolerance, correctValue }
 */
function validateApproximate(userAnswer, correctAnswer, tolerance = 0.1) {
    // Remove spaces and parse as numbers
    const userNum = parseFloat(userAnswer.replace(/\s/g, '').replace(',', '.'));
    const correctNum = parseFloat(correctAnswer.replace(/\s/g, '').replace(',', '.'));

    if (isNaN(userNum) || isNaN(correctNum)) {
        return { exact: false, withinTolerance: false, correctValue: null };
    }

    const diff = Math.abs(userNum - correctNum);
    const maxDiff = correctNum * tolerance;

    return {
        exact: userNum === correctNum,
        withinTolerance: diff <= maxDiff,
        correctValue: correctNum
    };
}

/**
 * Person name validator - handles Hungarian name conventions
 * Features: case-insensitive, accent-insensitive, order-agnostic
 */
function validatePerson(userAnswer, correctAnswer) {
    // Filter out Roman numerals (I., II., III., etc.)
    const filterRomanNumerals = (parts) => {
        return parts.filter(part => !/^[IVX]+\.?$/i.test(part));
    };

    // Check each acceptable answer (÷ separator)
    const alternatives = correctAnswer.split('÷').map(a => a.trim());

    for (const correct of alternatives) {
        const userParts = normalizeText(userAnswer).split(/\s+/).filter(p => p);
        const correctParts = normalizeText(correct).split(/\s+/).filter(p => p);

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
 * List validator - checks if user provided enough unique correct answers
 * @param {string[]} userAnswers - Array of user input strings
 * @param {string} correctAnswer - Pipe-separated list of valid concepts (e.g. "USA|America ÷ UK|Britain")
 * @param {number} requiredCount - Number of correct answers required
 */
/**
 * List validator - checks if user provided enough unique correct answers
 * Returns detailed validation results for feedback
 * @param {string[]} userAnswers - Array of user input strings
 * @param {string} correctAnswer - Pipe-separated list of valid concepts
 * @param {number} requiredCount - Number of correct answers required
 * @returns {object} { passed: boolean, validIndices: number[] } - validIndices corresponds to userAnswers array
 */
function validateList(userAnswers, correctAnswer, requiredCount) {
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
        return { passed: false, validIndices: [] };
    }

    // Parse valid concepts
    const validConcepts = correctAnswer.split('÷').map(concept =>
        concept.split('|').map(variant => normalizeText(variant))
    );

    let matchedConcepts = new Set(); // Stores indices of matched validConcepts
    let validIndices = []; // Stores indices of correct userAnswers

    for (let j = 0; j < userAnswers.length; j++) {
        const answer = userAnswers[j];
        const normAnswer = normalizeText(answer);
        if (!normAnswer) continue;

        let matched = false;
        // Check against all concepts
        for (let i = 0; i < validConcepts.length; i++) {
            // Avoid matching the same concept twice with different answers (optional, but good for "List X unique things")
            // Strictness: if we want to enforce unique concepts, check matchedConcepts.has(i).
            // But if user types "A" and "B" which are synonym for same concept, maybe we should count only 1?
            // Yes, let's allow "re-matching" for feedback purposes (mark as correct), 
            // but ONLY count unique concepts for the final pass.

            const isMatch = validConcepts[i].some(variant => {
                // Exact match (normalized)
                if (variant === normAnswer) return true;

                // Partial match setup
                // Allow user input to be a substring of variant if distinct enough
                // e.g. "Pannonhalmi" matches "Pannonhalmi Bencés Főapátság"
                if (variant.length > 5 && normAnswer.length > 4 && variant.includes(normAnswer)) return true;

                // Allow variant to be substring of user input? (Less likely)
                return false;
            });

            if (isMatch) {
                // If this concept hasn't been used yet for scoring, add it
                if (!matchedConcepts.has(i)) {
                    matchedConcepts.add(i);
                    matched = true;
                    // We only "consume" the concept for scoring if it wasn't matched before.
                    // But for visual feedback, this answer is valid.
                } else {
                    // Concept already matched by another answer.
                    // Should we mark this as correct? Yes, it's a correct *fact*.
                    // But maybe warn "Duplicate"?
                    // For now, mark as correct.
                    matched = true;
                }
                break;
            }
        }

        if (matched) {
            validIndices.push(j);
        }
    }

    return {
        passed: matchedConcepts.size >= requiredCount,
        validIndices: validIndices
    };
}

/**
 * Default validator - basic text matching
 */
function checkAnswer(userAnswer, correctAnswer) {
    const userNorm = normalizeText(userAnswer);

    // Check against all acceptable answers (÷ separator)
    const acceptableAnswers = correctAnswer.split('÷').map(a => normalizeText(a));
    return acceptableAnswers.includes(userNorm);
}



// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        normalizeAccents,
        normalizeText,
        validateApproximate,
        validatePerson,
        validateDate,
        validateDateInterval,
        validateNumber,
        validateList,
        checkAnswer
    };
}
