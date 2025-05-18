const operationElement = document.getElementById("operation");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("check");
const scoreElement = document.getElementById("score");
const levelSelect = document.getElementById("level");

let currentOperation = "";
let correctAnswer = 0;
let score = 0;
let history = [];
const maxHistory = 20;

function generateUniqueOperation(level) {
  const operations = [];

  const add = () => {
    let a, b;
    if (level === "1") {
      a = getRandomInt(1, 9);
      b = getRandomInt(1, 9);
    } else if (level === "2") {
      a = getRandomInt(10, 99);
      b = getRandomInt(1, 9);
    } else {
      a = getRandomInt(10, 99);
      b = getRandomInt(10, 99);
    }
    return `${a}+${b}`;
  };

  const subtract = () => {
    let a, b;
    if (level === "1") {
      a = getRandomInt(1, 9);
      b = getRandomInt(1, a);
    } else if (level === "2") {
      b = getRandomInt(1, 9);
      a = getRandomInt(b + 1, 99);
    } else {
      b = getRandomInt(10, 99);
      a = getRandomInt(b + 1, 99);
    }
    return `${a}-${b}`;
  };

  const multiply = () => {
    let a, b;
    if (level === "1") {
      a = getRandomInt(1, 9);
      b = getRandomInt(1, 9);
    } else if (level === "2") {
      a = getRandomInt(10, 99);
      b = getRandomInt(1, 9);
    } else {
      a = getRandomInt(10, 99);
      b = getRandomInt(10, 99);
    }
    return `${a}*${b}`;
  };

  const divide = () => {
    let a, b, result;
    do {
      if (level === "1") {
        b = getRandomInt(2, 9);
        result = getRandomInt(1, 9);
        a = b * result;
      } else if (level === "2") {
        b = getRandomInt(2, 9);
        result = getRandomInt(1, 9);
        a = b * result;
      } else {
        b = getRandomInt(2, 99);
        result = getRandomFloat(1, 99, 2);
        a = parseFloat((b * result).toFixed(2));
      }
    } while (!isFinite(a) || !isFinite(b));
    return `${a}/${b}`;
  };

  operations.push(add, subtract, multiply, divide);

  let op;
  do {
    const opFunc = operations[Math.floor(Math.random() * operations.length)];
    op = opFunc();
  } while (history.includes(op) || isTrivial(op));

  history.push(op);
  if (history.length > maxHistory) {
    history.shift();
  }

  return op;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.floor(Math.random() * (max * factor - min * factor + 1) + min * factor) / factor;
}

function isTrivial(operation) {
  return (
    operation.includes("/1") ||
    operation.includes("-0") ||
    operation.includes("*1") ||
    operation.includes("+0") ||
    /^(\d+)[-+*/]\1$/.test(operation)
  );
}

function generateNewOperation() {
  const level = levelSelect.value;
  currentOperation = generateUniqueOperation(level);
  correctAnswer = eval(currentOperation);
  if (level === "2") correctAnswer = Math.floor(correctAnswer); // no decimales
  if (level === "1") correctAnswer = Math.floor(correctAnswer); // asegurar enteros
  correctAnswer = parseFloat(correctAnswer.toFixed(2));
  operationElement.textContent = currentOperation.replace("*", "×").replace("/", "÷");
  answerInput.value = "";
  answerInput.focus();
}

function checkAnswer() {
  const userAnswer = parseFloat(answerInput.value);
  const mensaje = document.getElementById("mensaje");

  if (userAnswer === respuestaCorrecta) {
    puntos++;
    mensaje.textContent = ""; // limpia mensaje

    // Verificar si se alcanzaron los 24 puntos
    if (puntos === 24 && levelSelect.value === "3") {
      alert("¡Muy bien! Has alcanzado tu objetivo del día. Puedes seguir o dejarlo aquí.");
      puntos = 0;
      history = [];
    } else if (puntos === 24) {
      alert("¡Buen trabajo! Te sugerimos subir al siguiente nivel.");
      puntos = 0;
      history = [];
    }

    generateOperation(); // genera nueva operación solo si fue correcta
  } else {
    mensaje.textContent = "Incorrecto, intenta de nuevo.";
  }

  answerInput.value = "";
}

// Eventos
checkButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkAnswer();
});
levelSelect.addEventListener("change", function () {
  score = 0;
  history = [];
  scoreElement.textContent = `Puntos: ${score}`;
  generateNewOperation();
});

// Inicialización
generateNewOperation();




