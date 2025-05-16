// Game state variables
let currentOperation = "";
let currentAnswer = 0;
let score = 0;
let level = 1;
let history = [];
let cycleIndex = 0;
const operationOrder = ["+", "+", "+", "-", "-", "-", "*", "*", "*", "/", "/"];

// Initialize or reset the game
function resetGame() {
  score = 0;
  history = [];
  cycleIndex = 0;
  document.getElementById("score").innerText = "Puntos: 0";
  document.getElementById("feedback").innerText = "";
  level = parseInt(document.getElementById("level").value);
  generateOperation();
}

// Generate random number based on level
function generateNumber(level) {
  let min = 1, max = 9;
  if (level === 2) max = 30;
  if (level === 3) max = 99;
  if (level === 4) max = 199;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a new math operation
function generateOperation() {
  let op, num1, num2, displayOp, result;
  let valid = false;
  let attempts = 0;
  const maxAttempts = 100;

  // Try to generate a valid operation
  while (!valid && attempts < maxAttempts) {
      attempts++;
      op = operationOrder[cycleIndex % operationOrder.length];
      cycleIndex++;

      num1 = generateNumber(level);
      num2 = generateNumber(level);

      // Calculate result based on operation type
      if (op === "+") {
          result = num1 + num2;
          valid = true;
      } else if (op === "-") {
          // Ensure positive results
          if (num1 < num2) [num1, num2] = [num2, num1];
          result = num1 - num2;
          valid = true;
      } else if (op === "*") {
          // Skip trivial multiplications
          if (num1 !== 1 && num2 !== 1 && num1 !== 11 && num2 !== 11) {
              result = num1 * num2;
              valid = true;
          }
      } else if (op === "/") {
          // Skip exact divisions and division by zero
          if (num2 !== 0 && num1 % num2 !== 0) {
              result = parseFloat((num1 / num2).toFixed(2));
              valid = true;
          }
      }

      // Check if operation is unique in recent history
      if (valid) {
          displayOp = `${num1} ${op} ${num2}`;
          if (history.includes(displayOp)) {
              valid = false;
          }
      }
  }

  // Fallback if no valid operation found
  if (!valid) {
      console.error("Failed to generate valid operation after", maxAttempts, "attempts");
      // Generate a simple addition as fallback
      num1 = generateNumber(1);
      num2 = generateNumber(1);
      displayOp = `${num1} + ${num2}`;
      result = num1 + num2;
  }

  // Update game state
  currentOperation = displayOp;
  currentAnswer = result;
  history.push(displayOp);
  
  // Limit history size
  if (history.length > 30) {
      history.shift();
  }

  // Update UI
  document.getElementById("operation").innerText = displayOp;
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
}

// Check user's answer
function checkAnswer() {
  const userAnswer = parseFloat(document.getElementById("answer").value.trim());
  const feedback = document.getElementById("feedback");

  if (!isNaN(userAnswer) {
      if (Math.abs(userAnswer - currentAnswer) < 0.01) { // Account for floating point precision
          score++;
          feedback.innerText = "✅ ¡Correcto!";
          feedback.style.color = "lightgreen";
      } else {
          feedback.innerText = `❌ Incorrecto. Era ${currentAnswer}`;
          feedback.style.color = "red";
      }
  } else {
      feedback.innerText = "⚠️ Ingresa un número válido";
      feedback.style.color = "yellow";
      return;
  }

  // Update score
  document.getElementById("score").innerText = "Puntos: " + score;

  // Show completion message after 30 questions
  if (history.length >= 30) {
      feedback.innerText += " ¡30 operaciones completadas!";
  }

  // Generate new question after delay
  setTimeout(() => {
      feedback.innerText = "";
      generateOperation();
  }, (history.length >= 30) ? 3000 : 1500);
}

// Handle keyboard input
function handleKey(event) {
  if (event.key === "Enter") {
      checkAnswer();
  }
}

// Start the game when page loads
window.onload = function() {
  resetGame();
  document.getElementById("answer").focus();
};
