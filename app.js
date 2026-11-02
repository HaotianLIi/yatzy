// app.js game state and page updates

const MAX_ROUNDS = 15;
const MAX_ROLLS = 3;
const GOOD_SCORE = 200;   // congratulate at or above this

const dice = new Dice(5);
let engine, round, rollCount, gameOver;

const diceGroup = document.getElementById("diceGroup");
const rollButton = document.getElementById("rollButton");
const message = document.getElementById("message");

function newGame() {
  engine = new YatzyEngine();
  round = 1;
  rollCount = 0;
  gameOver = false;
  dice.reset();
  update(`Round 1 of ${MAX_ROUNDS} - Roll the dice`);
}

function endGame() {
  gameOver = true;
  const total = engine.getTotal();
  const note = total >= GOOD_SCORE ? "Congratulations, great game!" : "Nice try, better luck next time!";
  update(`Game over! Final score: ${total}. ${note}`);
}

function showDice() {
  diceGroup.innerHTML = "";
  dice.values.forEach((value, i) => {
    const container = document.createElement("div");
    container.className = "dice-container";
    if (dice.held[i]) container.classList.add("held");
    container.innerHTML = Dice.showDie(value);
    container.addEventListener("click", () => {
      if (rollCount === 0 || gameOver) return;   // can only keep dice after rolling
      dice.toggleHold(i);
      showDice();
    });
    diceGroup.appendChild(container);
  });
}

function showScores() {
  for (const category of YatzyEngine.CATEGORIES) {
    const score = engine.scoreTable[category];
    const span = document.getElementById(category + "Score");
    const preview = score === null && rollCount > 0 && !gameOver;   // grey score for an empty box

    document.querySelector(`[data-category="${category}"]`).classList.toggle("used", score !== null);
    span.className = preview ? "preview" : "";
    span.textContent = score !== null ? score : preview ? engine.calculateScore(category, dice.getValues()) : "-";
  }

  document.getElementById("upperSum").textContent = engine.getUpperSum();
  document.getElementById("bonusScore").textContent = engine.getBonus();
  document.getElementById("totalScore").textContent = "Total: " + engine.getTotal();
}

function update(text) {
  message.textContent = text;
  rollButton.disabled = gameOver || rollCount === MAX_ROLLS;
  showDice();
  showScores();
}

rollButton.addEventListener("click", () => {
  rollCount++;
  dice.rollAll();
  update(rollCount < MAX_ROLLS
    ? `Round ${round} - Roll ${rollCount} of ${MAX_ROLLS} - click dice to keep them, or click a box to score`
    : `Round ${round} - No rolls left, click a box to score`);
});

// clicking a box scores the dice and ends the turn
document.querySelectorAll("[data-category]").forEach(row => {
  row.addEventListener("click", () => {
    if (gameOver) return;
    if (rollCount === 0) return update("Roll the dice first");
    if (engine.recordScore(row.dataset.category, dice.getValues()) === null) {
      return update("That box is already used, pick another one");
    }

    round++;
    rollCount = 0;
    dice.reset();
    if (round > MAX_ROUNDS) endGame();
    else update(`Round ${round} of ${MAX_ROUNDS} - Roll the dice`);
  });
});

document.getElementById("endGameButton").addEventListener("click", () => {
  if (!gameOver) endGame();
});

document.getElementById("newGameButton").addEventListener("click", newGame);

newGame();
