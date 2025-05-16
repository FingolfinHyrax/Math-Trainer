let score = 0;
let currentOperation = "";
let correctAnswer = 0;
let operationCount = 0;
let history = [];
let operationQueue = [];
const maxHistory = 30;

const operatorsPerCycle = [
  ...Array(3).fill('+'),
  ...Array(3).fill('-'),
  ...Array(3).fill('*'),
  ...Array(2).fill('/')
];

document.getElementById("answer").addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkAnswer();
});

function getLevel() {
  return parseInt(document.getElementById("level").value);
}

function generateNumber(level) {
  const ranges = {
    1: [1, 9],
    2: [10, 99],
    3: [10, 99],
    4: [100, 999]
  };
  const [min, max] = ranges[level];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOperation() {
  if (operationQueue.length === 0) {
    operationQueue = [...operatorsPerCycle];
  }

  let operator;
  let op;
  let attempts = 0;

  do {
    operator = operationQueue.shift();
    let num1 = generateNumber(getLevel());
    let num2 = generateNumber(getLevel());

    if (operator === '-') {
      [num1, num2] = num1 < num2 ? [num2, num1] : [num1, num2];
    }

    if (operator === '/') {
      num2 = Math.max(1, num2); // evitar 0
      if (getLevel() === 3) {
        correctAnswer = parseFloat((num1 / num2).toFixed(2));
      } else {
        num1 = num1 * num2;
        correctAnswer = num1 / num2;
      }
    } else {
      correctAnswer = eval(`${num1} ${operator} ${num2}`);
    }

    op = `${num1} ${operator} ${num2}`;
    attempts++;
    if (attempts > 50) break; // evita bucles infinitos

  } while (
    history.includes(op) ||
    isTrivial(op, operator) ||
    correctAnswer < 0
  );

  history.push(op);
  if (history.length > maxHistory) history.shift();

  currentOperation = op;
  document.getElementById("operation").textContent = op;
}

function isTrivial(op, operator) {
  return (
    op.includes(' * 1') ||
    op.includes(' + 0') ||
    op.includes(' - 0') ||
    op.includes(' / 1') ||
    op.includes(' * 11') ||
    op.includes(' / 11') ||
    op.includes(' + 11') ||
    op.includes(' - 11')
  );
}

function checkAnswer() {
  const input = document.getElementById("answer");
  let userAnswer = input.value.trim().replace(",", ".");

  if (userAnswer === "") return;

  let userValue = parseFloat(userAnswer);
  let isCorrect = Math.abs(userValue - correctAnswer) < 0.01;

  const feedback = document.getElementById("feedback");
  if (isCorrect) {
    feedback.textContent = "✅ Correcto";
    score++;
  } else {
    feedback.textContent = `❌ Incorrecto. Era ${correctAnswer}`;
  }

  document.getElementById("score").textContent = score;
  input.value = "";

  operationCount++;
  if (operationCount >= 30) {
    setTimeout(() => {
      if (confirm("¿Deseas subir de nivel o repetir?")) {
        let level = getLevel();
        if (level < 4) {
          document.getElementById("level").value = level + 1;
        }
      }
      score = 0;
      operationCount = 0;
      history = [];
      document.getElementById("score").textContent = score;
      generateOperation();
    }, 200);
  } else {
    setTimeout(generateOperation, isCorrect ? 500 : 1500);
  }
}

function resetGame() {
  score = 0;
  operationCount = 0;
  history = [];
  operationQueue = [];
  document.getElementById("score").textContent = score;
  document.getElementById("feedback").textContent = "";
  generateOperation();
}

resetGame();

