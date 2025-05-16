const operationTypes = ['+', '-', '*', '/'];
let currentOperatorIndex = 0;
let score = 0;
let history = [];
let operationCount = 0;
const maxHistory = 30;
let currentLevel = 1;

function generateNumberPair(level, operator) {
    let num1, num2;

    if (level === 1) {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
    } else if (level === 2) {
        // Queremos combinaciones de exactamente 3 dígitos en total
        const validPairs = [];
        for (let i = 1; i < 100; i++) {
            for (let j = 1; j < 100; j++) {
                const totalDigits = i.toString().length + j.toString().length;
                if (totalDigits === 3) {
                    if (operator === '+' || operator === '-' || operator === '*') {
                        validPairs.push([i, j]);
                    } else if (operator === '/' && i % j === 0 && j !== 1 && j !== 11) {
                        validPairs.push([i, j]);
                    }
                }
            }
        }
        [num1, num2] = validPairs[Math.floor(Math.random() * validPairs.length)];
    } else if (level === 3) {
        do {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
        } while (operator === '/' && (num2 === 1 || num2 === 11 || num1 % num2 === 0 || (num1 / num2).toFixed(2).length > 5));
    } else if (level === 4) {
        do {
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = Math.floor(Math.random() * 900) + 100;
        } while (operator === '/' && (num2 === 1 || num2 === 11 || num1 % num2 === 0));
    }

    return [num1, num2];
}

function generateOperation() {
    let operator;
    let num1, num2;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        operator = operationTypes[currentOperatorIndex];
        [num1, num2] = generateNumberPair(currentLevel, operator);
        attempts++;
    } while (
        history.some(h => h.num1 === num1 && h.num2 === num2 && h.operator === operator) &&
        attempts < maxAttempts
    );

    currentOperatorIndex = (currentOperatorIndex + 1) % operationTypes.length;

    const operation = { num1, num2, operator };
    history.push(operation);
    if (history.length > maxHistory) history.shift();
    operationCount++;

    document.getElementById('operation').textContent = `${num1} ${operator} ${num2}`;
    document.getElementById('userInput').value = '';
    document.getElementById('result').textContent = '';

    if (operationCount === 30) {
        setTimeout(() => {
            if (confirm('¡Buen trabajo! ¿Quieres subir de nivel?')) {
                currentLevel = Math.min(currentLevel + 1, 4);
                document.getElementById('levelSelect').value = currentLevel;
            }
            history = [];
            operationCount = 0;
        }, 100);
    }
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('userInput').value);
    const [num1, num2] = document.getElementById('operation').textContent.split(/ [+\-*/] /).map(Number);
    const operator = document.getElementById('operation').textContent.match(/[+\-*/]/)[0];

    let correctAnswer;
    switch (operator) {
        case '+': correctAnswer = num1 + num2; break;
        case '-': correctAnswer = num1 - num2; break;
        case '*': correctAnswer = num1 * num2; break;
        case '/': correctAnswer = parseFloat((num1 / num2).toFixed(2)); break;
    }

    const resultElement = document.getElementById('result');
    if (Math.abs(userAnswer - correctAnswer) < 0.01) {
        resultElement.textContent = '✅ ¡Correcto!';
        resultElement.style.color = 'lightgreen';
        score++;
    } else {
        resultElement.textContent = `❌ Incorrecto (era ${correctAnswer})`;
        resultElement.style.color = 'red';
    }

    document.getElementById('score').textContent = `Puntos: ${score}`;
    setTimeout(generateOperation, 1000);
}

document.getElementById('checkButton').addEventListener('click', checkAnswer);
document.getElementById('userInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') checkAnswer();
});
document.getElementById('levelSelect').addEventListener('change', function () {
    currentLevel = parseInt(this.value);
    history = [];
    operationCount = 0;
    score = 0;
    document.getElementById('score').textContent = `Puntos: 0`;
    generateOperation();
});

window.onload = generateOperation;


