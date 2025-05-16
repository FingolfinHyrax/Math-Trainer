
let score = 0;
let currentAnswer;
let history = [];
let operationCount = 0;
let operatorCycle = [];
const operatorsSequence = ['+', '+', '+', '-', '-', '-', '*', '*', '*', '/', '/'];

function resetGame() {
    score = 0;
    history = [];
    operationCount = 0;
    operatorCycle = [...operatorsSequence];
    document.getElementById('score').textContent = score;
    document.getElementById('feedback').textContent = '';
    document.getElementById('answer').value = '';
    generateOperation();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOperation() {
    const level = parseInt(document.getElementById('level').value);
    let num1, num2, operator, result, operation;

    if (operatorCycle.length === 0) {
        operatorCycle = [...operatorsSequence];
        operationCount = 0;
        history = [];
        setTimeout(() => {
            alert('¡Buen trabajo! ¿Quieres subir de nivel o seguir practicando este nivel?');
        }, 100);
    }

    do {
        operator = operatorCycle.shift();
        switch (level) {
            case 1:
                num1 = getRandomInt(1, 9);
                num2 = getRandomInt(1, 9);
                break;
            case 2:
                num1 = getRandomInt(10, 99);
                num2 = getRandomInt(1, 99);
                break;
            case 3:
                num1 = getRandomInt(10, 99);
                num2 = getRandomInt(1, 20);
                break;
            case 4:
                num1 = getRandomInt(100, 9999);
                num2 = getRandomInt(1, 999);
                break;
        }

        if (operator === '+') result = num1 + num2;
        else if (operator === '-') result = num1 - num2;
        else if (operator === '*') result = num1 * num2;
        else if (operator === '/') {
            result = num1 / num2;
            if (level === 3) result = parseFloat(result.toFixed(2));
        }

        operation = `${num1} ${operator} ${num2}`;
    } while (history.includes(operation) || (operator === '/' && num2 === 1) || (operator === '*' && num2 === 1));

    history.push(operation);
    if (history.length > 30) history.shift();
    currentAnswer = result;
    document.getElementById('operation').textContent = operation;
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (Math.abs(userAnswer - currentAnswer) < 0.01) {
        score++;
        document.getElementById('feedback').textContent = 'Correcto';
    } else {
        document.getElementById('feedback').textContent = `Incorrecto. Era ${currentAnswer}`;
    }
    document.getElementById('score').textContent = score;
    document.getElementById('answer').value = '';
    setTimeout(() => {
        document.getElementById('feedback').textContent = '';
        generateOperation();
    }, 1500);
}

window.onload = resetGame;
