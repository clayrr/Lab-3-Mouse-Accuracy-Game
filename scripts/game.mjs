// game.ts
var Difficulty = /* @__PURE__ */ ((Difficulty2) => {
  Difficulty2[Difficulty2["Easy"] = 2e3] = "Easy";
  Difficulty2[Difficulty2["Medium"] = 1e3] = "Medium";
  Difficulty2[Difficulty2["Hard"] = 500] = "Hard";
  return Difficulty2;
})(Difficulty || {});
var Shape = /* @__PURE__ */ ((Shape2) => {
  Shape2["Circle"] = "circle";
  Shape2["Square"] = "square";
  Shape2["Triangle"] = "triangle";
  return Shape2;
})(Shape || {});
var gameTime = 30;
var difficulty = 2e3 /* Easy */;
var targetShape = "circle" /* Circle */;
var targetColor = "#ff0000";
var totalTargets = 0;
var targetsClicked = 0;
var missedTargets = 1;
var targetInterval = null;
var getElement = (id) => document.getElementById(id);
var getValue = (id) => getElement(id).value;
var startButton = getElement("startGame");
var gameArea = getElement("gameArea");
var scoreboard = getElement("scoreboard");
var totalTargetsDisplay = getElement("totalTargets");
var targetsClickedDisplay = getElement("targetsClicked");
var finalScoreDisplay = getElement("finalScore");
var missedTargetsDisplay = getElement("missedTargets");
var difficultySelect = getElement("targetDifficulty");
var shapeSelect = getElement("targetShape");
function populateSelectOptions() {
  Object.values(Difficulty).filter((v) => typeof v === "string").forEach((v) => {
    const option = document.createElement("option");
    option.value = v.toString();
    option.textContent = v.charAt(0).toUpperCase() + v.slice(1);
    difficultySelect.appendChild(option);
  });
  Object.values(Shape).filter((v) => typeof v === "string").forEach((v) => {
    const option = document.createElement("option");
    option.value = v.toString();
    option.textContent = v.charAt(0).toUpperCase() + v.slice(1);
    shapeSelect.appendChild(option);
  });
}
function startGame() {
  resetGame();
  gameTime = parseInt(getValue("targetDuration"));
  difficulty = Difficulty[getValue("targetDifficulty")];
  targetShape = getValue("targetShape");
  targetColor = getValue("targetColor");
  targetInterval = window.setInterval(spawnTarget, difficulty);
  window.setTimeout(endGame, gameTime * 1e3);
}
function endGame() {
  if (targetInterval) clearInterval(targetInterval);
  clearTargets();
  getElement("endGameAudio").play();
  displayScore();
}
function resetGame() {
  totalTargets = 0;
  targetsClicked = 0;
  missedTargets = 0;
  clearTargets();
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
var calculateScore = () => targetsClicked === 0 ? "seriously. you didnt click anything??" : Math.floor(targetsClicked / totalTargets * 100) * Math.random() * 35 * 420 * 34948343843;
function spawnTarget() {
  totalTargets++;
  const target = document.createElement("div");
  target.classList.add("absolute", "target", "transition-transform");
  target.style.backgroundColor = targetColor;
  switch (targetShape) {
    case "circle" /* Circle */:
      target.style.width = "20px";
      target.style.height = "20px";
      target.classList.add("rounded-full");
      break;
    case "square" /* Square */:
      target.style.width = "20px";
      target.style.height = "20px";
      break;
    case "triangle" /* Triangle */:
      target.style.width = "0";
      target.style.height = "0";
      target.style.borderLeft = "10px solid transparent";
      target.style.borderRight = "10px solid transparent";
      target.style.borderBottom = `20px solid ${targetColor}`;
      target.style.backgroundColor = "transparent";
      break;
  }
  const gameAreaRect = gameArea.getBoundingClientRect();
  const x = Math.random() * (gameAreaRect.width - 50);
  const y = Math.random() * (gameAreaRect.height - 50);
  target.style.transform = `translate(${x}px, ${y}px) scale(1)`;
  const onclickTarget = () => {
    targetsClicked++;
    target.remove();
  };
  target.addEventListener("click", onclickTarget);
  const animation = target.animate([
    { transform: `translate(${x}px, ${y}px) scale(1)` },
    // initial phase
    { transform: `translate(${x}px, ${y}px) scale(4)` },
    // expanding phase
    { transform: `translate(${x}px, ${y}px) scale(1)` }
    // shrinking phase
  ], {
    duration: 3e3,
    // total duration (3000ms: 1500ms for expanding, 1500ms for shrinking)
    easing: "ease-in-out",
    // smooth transition for both expanding and shrinking
    fill: "forwards"
    // keeps the target in its final state after the animation
  });
  const onfinishTarget = () => {
    if (document.body.contains(target)) {
      missedTargets++;
      target.remove();
    }
  };
  animation.addEventListener("finish", onfinishTarget);
  gameArea.appendChild(target);
}
populateSelectOptions();
startButton.addEventListener("click", startGame);
/**
 * notes:
 * - w3schools is dumb:
 *   > Do not use tabs (tabulators) for indentation. Different editors interpret tabs differently.
 *   - this makes no sense. tabs are fine please let me use them tysm
 *   - also half the stuff on these so called "js conventions" are purely insane stylistic decisions
 *   - i rest my case
 * 
 * @module
 * @preserve
 */
//# sourceMappingURL=game.mjs.map
//# sourceMappingURL=game.mjs.map