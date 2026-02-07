const validators = require('./validators.js');

const tests = [
    {
        name: "Standard Text - Accents",
        func: validators.checkAnswer,
        input: "piros, feher, zold",
        correct: "Piros, fehér, zöld",
        expected: true
    },
    {
        name: "Standard Text - Case",
        func: validators.checkAnswer,
        input: "budapest",
        correct: "Budapest",
        expected: true
    },
    {
        name: "Person - Accents",
        func: validators.validatePerson,
        input: "petofi sandor",
        correct: "Petőfi Sándor",
        expected: true
    },
    {
        name: "Ordinal Number Conversion (Manual Check)",
        func: validators.validateNumber,
        input: "1",
        correct: "1",
        expected: true
    }
];

let passed = 0;
tests.forEach(test => {
    const result = test.func(test.input, test.correct);
    if (result === test.expected) {
        console.log(`[PASS] ${test.name}`);
        passed++;
    } else {
        console.log(`[FAIL] ${test.name}`);
        console.log(`  Input: "${test.input}"`);
        console.log(`  Correct: "${test.correct}"`);
        console.log(`  Expected: ${test.expected}, Got: ${result}`);
    }
});

if (passed === tests.length) {
    console.log("\nAll validation tests passed!");
} else {
    console.log(`\n${tests.length - passed} tests failed.`);
    process.exit(1);
}
