const operationElement = document.getElementById("operation");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("check");
const scoreElement = document.getElementById("score");
const levelSelect = document.getElementById("level");

let score = 0;
let currentAnswer = 0;
let operationHistory = new Set();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function generateUniqueOperation(generatorFn) {
    let op;
    let attempts = 0;
    do {
        op = generatorFn();
        attempts++;
    } while (operationHistory.has(op.text) && attempts < 100);
    operationHistory.add(op.text);
    return op;
}

function generateOperation(level) {
    const operations = [];
    const usedTexts = new Set();

    const addOperation = (fn) => {
        const { text, answer } = generateUniqueOperation(fn);
        if (!usedTexts.has(text)) {
            operations.push({ text, answer });
            usedTexts.add(text);
        }
    };

    switch (level) {
        case "1":
            addOperation(() => {
                let a = getRandomInt(2, 9), b = getRandomInt(2, 9);
                return { text: `${a}+${b}`, answer: a + b };
            });
            addOperation(() => {
                let a = getRandomInt(2, 9), b = getRandomInt(2, 9);
                return { text: `${a}-${b}`, answer: a - b };
            });
            addOperation(() => {
                let a = getRandomInt(2, 9), b = getRandomInt(2, 9);
                return { text: `${a}*${b}`, answer: a * b };
            });
            addOperation(() => {
                let b = getRandomInt(2, 9), a = b * getRandomInt(1, 9);
                return { text: `${a}/${b}`, answer: a / b };
            });
            break;

        case "2":
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(1, 9);
                return { text: `${a}+${b}`, answer: a + b };
            });
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(1, 9);
                return { text: `${a}-${b}`, answer: a - b };
            });
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(2, 9);
                return { text: `${a}*${b}`, answer: a * b };
            });
            addOperation(() => {
                let b = getRandomInt(2, 9), result = getRandomInt(1, 9), a = b * result;
                return { text: `${a}/${b}`, answer: result };
            });
            break;

        case "3":
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(10, 99);
                return { text: `${a}+${b}`, answer: a + b };
            });
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(1, a - 1);
                return { text: `${a}-${b}`, answer: a - b };
            });
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(2, 9);
                return { text: `${a}*${b}`, answer: a * b };
            });
            addOperation(() => {
                let a = getRandomInt(10, 99), b = getRandomInt(2, 9);
                return { text: `${a}/${b}`, answer: Math.round((a / b) * 100) / 100 };
            });
            break;
    }

    return operations[Math.floor(Math.random() * operations.length)];
}

function loadNewOperation() {
    const level = levelSelect.value;
    const op = generateOperation(level);
    operationElement.textContent = op.text;
    currentAnswer = op.answer;
    answerInput.value = "";
    answerInput.focus();
}

checkButton.addEventListener("click", () => {
    const userAnswer = parseFloat(answerInput.value.trim());
    if (!isNaN(userAnswer) && Math.abs(userAnswer - currentAnswer) < 0.01) {
        score++;
        if ((levelSelect.value === "1" && score >= 20) || score >= 24) {
            setTimeout(() => {
                if (levelSelect.value === "3") {
                    alert("¡Objetivo del día cumplido! Puedes continuar o dejarlo para mañana.");
                } else {
                    alert("¡Bien hecho! Puedes subir al siguiente nivel.");
                }
                score = 0;
                operationHistory.clear();
            }, 100);
        }
    }
    scoreElement.textContent = `Puntos: ${score}`;
    loadNewOperation();
});

answerInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") checkButton.click();
});

levelSelect.addEventListener("change", () => {
    score = 0;
    scoreElement.textContent = "Puntos: 0";
    operationHistory.clear();
    loadNewOperation();
});

// Inicializar
loadNewOperation();



