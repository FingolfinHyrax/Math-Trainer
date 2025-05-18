let score = 0;
let currentProblem = {};
let lastOperations = [];
let operationsDone = 0;

document.addEventListener("DOMContentLoaded", () => {
    generateProblem();
    document.getElementById("answer").focus();
});

document.getElementById("level").addEventListener("change", () => {
    score = 0;
    operationsDone = 0;
    lastOperations = [];
    updateScore();
    generateProblem();
});

document.getElementById("answer").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

function updateScore() {
    document.getElementById("score").textContent = `Puntos: ${score}`;
}

function generateProblem() {
    const level = parseInt(document.getElementById("level").value);
    let num1, num2, operator, question, answer;
    const operations = ["+", "-", "*", "/"];
    let availableOps = [...operations];

    if (level === 4) availableOps = ["+", "-", "*"]; // sin divisiones en nivel 4

    do {
        operator = availableOps[Math.floor(Math.random() * availableOps.length)];

        if (level === 1) {
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
        } else if (level === 2 || level === 3) {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
        } else if (level === 4) {
            num1 = Math.floor(Math.random() * 9000) + 1000;
            num2 = Math.floor(Math.random() * 90) + 10;
        }

        if (operator === "/") {
            if (level === 1 || level === 2) {
                // resultado exacto sin decimales
                num2 = Math.floor(Math.random() * 9) + 1;
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                answer = num1 / num2;
            } else {
                // resultado con hasta 2 decimales
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * 9) + 1;
                answer = parseFloat((num1 / num2).toFixed(2));
            }
        } else {
            answer = eval(`${num1} ${operator} ${num2}`);
        }

        question = `${num1} ${operator} ${num2}`;
    } while (
        lastOperations.includes(question) ||
        (level === 1 && operator === "/" && !Number.isInteger(answer))
    );

    currentProblem = { question, answer };
    lastOperations.push(question);
    if (lastOperations.length > 30) lastOperations.shift();

    document.getElementById("problem").textContent = question;
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById("answer").value.trim());
    if (isNaN(userAnswer)) return;

    const correctAnswer = parseFloat(currentProblem.answer);
    const level = parseInt(document.getElementById("level").value);
    const tolerance = level === 3 ? 0.01 : 0;

    if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
        score++;
        operationsDone++;
        updateScore();
        if (score % 20 === 0) {
            if (confirm("¡Buen trabajo! ¿Quieres subir de nivel?")) {
                const newLevel = Math.min(level + 1, 4);
                document.getElementById("level").value = newLevel;
            }
            score = 0;
            lastOperations = [];
            operationsDone = 0;
            updateScore();
        }
    }

    generateProblem();
}

