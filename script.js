const operationDisplay = document.getElementById("operation");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("check");
const scoreDisplay = document.getElementById("score");
const levelSelector = document.getElementById("level");

let currentAnswer;
let score = 0;
let level = parseInt(levelSelector.value);
let history = [];

const OP_COUNTS = {
    1: { "+": 3, "-": 3, "*": 3, "/": 2 },
    2: { "+": 3, "-": 3, "*": 3, "/": 3 },
    3: { "+": 3, "-": 3, "*": 3, "/": 3 }
};

function generateOperation(level) {
    const counts = OP_COUNTS[level];
    const ops = Object.entries(counts).flatMap(([op, count]) => Array(count).fill(op));
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, result;

    while (true) {
        if (level === 1) {
            a = getRandomInt(2, 10);
            b = getRandomInt(2, 10);
        } else if (level === 2) {
            a = getRandomInt(10, 99);
            b = getRandomInt(2, 10);
        } else {
            a = getRandomInt(10, 99);
            b = getRandomInt(10, 99);
        }

        switch (op) {
            case "+":
                result = a + b;
                break;
            case "-":
                if (a < b) [a, b] = [b, a]; // evita negativos
                result = a - b;
                break;
            case "*":
                result = a * b;
                break;
            case "/":
                result = a / b;
                if (level === 1 || level === 2) {
                    if (!Number.isInteger(result)) continue; // solo divisiones exactas
                } else {
                    result = parseFloat(result.toFixed(2)); // hasta 2 decimales
                }
                break;
        }

        const key = `${a} ${op} ${b}`;
        if (result < 0 || isTrivial(a, b, op) || history.includes(key)) continue;

        history.push(key);
        if (history.length > 100) history.shift(); // evita crecer demasiado
        return { a, b, op, result };
    }
}

function isTrivial(a, b, op) {
    if (a === b && (op === "-" || op === "/")) return true;
    if ((b === 1 || b === 0) && (op === "*" || op === "/")) return true;
    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setNewOperation() {
    level = parseInt(levelSelector.value);
    const { a, b, op, result } = generateOperation(level);
    currentAnswer = result;
    operationDisplay.textContent = `${a} ${op} ${b}`;
    answerInput.value = "";
    answerInput.focus();
}

function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value.replace(",", "."));
    if (Math.abs(userAnswer - currentAnswer) < 0.01) {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        if ((level === 1 || level === 2) && score === 24) {
            alert("¡Buen trabajo! Puedes subir al siguiente nivel si lo deseas.");
            score = 0;
            history = [];
        } else if (level === 3 && score === 24) {
            alert("¡Objetivo del día cumplido! Puedes seguir o dejarlo por hoy.");
            score = 0;
            history = [];
        }
    }
    setNewOperation();
}

checkButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
});
levelSelector.addEventListener("change", () => {
    score = 0;
    history = [];
    scoreDisplay.textContent = "Puntos: 0";
    setNewOperation();
});

setNewOperation();


