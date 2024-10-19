// game.ts
var gameTime = 30;
var difficulty = "easy";
var targetShape = "circle";
var targetColor = "#ff0000";
var totalTargets = 0;
var targetsClicked = 0;
var missedTargets = 0;
var gameTimer = null;
var targetInterval = null;
var startButton = document.getElementById("startGame");
var gameArea = document.getElementById("gameArea");
var scoreboard = document.getElementById("scoreboard");
var totalTargetsDisplay = document.getElementById("totalTargets");
var targetsClickedDisplay = document.getElementById("targetsClicked");
var finalScoreDisplay = document.getElementById("finalScore");
var missedTargetsDisplay = document.getElementById("missedTargets");
startButton.addEventListener("click", startGame);
function startGame() {
  resetGame();
  gameTime = parseInt(document.getElementById("gameDuration").value);
  difficulty = document.getElementById("difficulty").value;
  targetShape = document.getElementById("targetShape").value;
  targetColor = document.getElementById("targetColor").value;
  const targetSpawnTime = difficulty === "easy" ? 2e3 : difficulty === "medium" ? 1e3 : 500;
  targetInterval = window.setInterval(spawnTarget, targetSpawnTime);
  gameTimer = window.setTimeout(endGame, gameTime * 1e3);
}
function endGame() {
  clearInterval(targetInterval);
  clearTargets();
  const endGameAudio = document.getElementById("endGameAudio");
  endGameAudio.play();
  displayScore();
}
function resetGame() {
  totalTargets = 0;
  targetsClicked = 0;
  missedTargets = 0;
  gameArea.innerHTML = "";
  scoreboard.classList.add("hidden");
}
function clearTargets() {
  gameArea.innerHTML = "";
}
function displayScore() {
  totalTargetsDisplay.textContent = `total targets: ${totalTargets}`;
  targetsClickedDisplay.textContent = `targets clicked: ${targetsClicked}`;
  missedTargetsDisplay.textContent = `missed targets: ${missedTargets}`;
  finalScoreDisplay.textContent = `final score: ${calculateScore()}`;
  scoreboard.classList.remove("hidden");
}
function calculateScore() {
  return targetsClicked === 0 ? 0 : Math.floor(targetsClicked / totalTargets * 100);
}
function spawnTarget() {
  totalTargets++;
  const target = document.createElement("div");
  target.classList.add("absolute", "target", "transition-transform");
  target.style.width = "20px";
  target.style.height = "20px";
  target.style.backgroundColor = targetColor;
  if (targetShape === "circle")
    target.classList.add("rounded-full");
  const gameAreaRect = gameArea.getBoundingClientRect();
  const x = Math.random() * (gameAreaRect.width - 50);
  const y = Math.random() * (gameAreaRect.height - 50);
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.addEventListener("click", () => {
    targetsClicked++;
    target.remove();
  });
  target.animate([
    { transform: `translate(${x}px, ${y}px) scale(1)` },
    { transform: `translate(${x}px, ${y}px) scale(4)` }
  ], {
    duration: 1500,
    easing: "ease-out"
  });
  gameArea.appendChild(target);
  window.setTimeout(() => {
    if (document.body.contains(target)) {
      missedTargets++;
      target.remove();
    }
  }, 1500);
}
