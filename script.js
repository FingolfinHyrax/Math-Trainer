
let currentOperation = "";
let currentAnswer = 0;
let score = 0;
let level = 1;
let history = [];
let cycleIndex = 0;
const operationOrder = ["+", "+", "+", "-", "-", "-", "*", "*", "*", "/", "/"];

function resetGame() {
  score = 0;
  history = [];
  cycleIndex = 0;
  document.getElementById("score").innerText = "Puntos: 0";
  document.getElementById("feedback").innerText = "";
  level = parseInt(document.getElementById("level").value);
  generateOperation();
}

function generateNumber(level) {
  let min = 1, max = 9;
  if (level === 2) max = 30;
  if (level === 3) max = 99;
  if (level === 4) max = 199;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOperation() {
  let op;
  do {
    op = operationOrder[cycleIndex % operationOrder.length];
    cycleIndex++;
  } while (cycleIndex > 1 && history.slice(-2).includes(op));

  let num1, num2, displayOp, result;
  let valid = false;
  while (!valid) {
    num1 = generateNumber(level);
    num2 = generateNumber(level);

    if (op === "+") {
      result = num1 + num2;
    } else if (op === "-") {
      if (num1 < num2) [num1, num2] = [num2, num1];
      result = num1 - num2;
    } else if (op === "*") {
      if (num1 === 1 || num2 === 1 || num1 === 11 || num2 === 11) continue;
      result = num1 * num2;
    } else if (op === "/") {
      if (num2 === 1 || num2 === 0 || num1 % num2 === 0) continue;
      result = num1 / num2;
      if (level < 3) continue;
      result = parseFloat(result.toFixed(2));
    }

    displayOp = `${num1} ${op} ${num2}`;
    if (!history.includes(displayOp)) {
      valid = true;
    }
  }

  currentOperation = displayOp;
  currentAnswer = result;
  history.push(displayOp);
  if (history.length > 30) history.shift();

  document.getElementById("operation").innerText = displayOp;
  document.getElementById("answer").value = "";
}

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.trim();
  const feedback = document.getElementById("feedback");

  if (parseFloat(userAnswer) === parseFloat(currentAnswer)) {
    score++;
    feedback.innerText = "✅ ¡Correcto!";
    feedback.style.color = "lightgreen";
    setTimeout(() => {
      feedback.innerText = "";
    }, 1000);
  } else {
    feedback.innerText = `❌ Incorrecto. Era ${currentAnswer}`;
    feedback.style.color = "red";
    setTimeout(() => {
      feedback.innerText = "";
    }, 2000);
  }

  document.getElementById("score").innerText = "Puntos: " + score;

  if (history.length >= 30) {
    setTimeout(() => {
      alert("¡Has completado 30 operaciones! ¿Quieres subir de nivel o seguir?");
      history = [];
    }, 200);
  }

  generateOperation();
}

function handleKey(event) {
  if (event.key === "Enter") {
    checkAnswer();
  }
}

// Iniciar
window.onload = resetGame;
