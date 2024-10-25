var gameTime = 30;  
var totalTargets = 0;
var targetsClicked = 0;
var missedTargets = 0; 
var targetInterval = null; 
var gameTimer = null;  
var isGameRunning = false; // Track if the game is running
var remainingTime = gameTime;  // Track remaining time

// Start button
var startButton = document.getElementById("startGame");
startButton.addEventListener('click', startGame); 

function startGame() {
    if (isGameRunning) return; // Prevent starting a new game
    isGameRunning = true; // Set the game as running
    resetGame();
    targetInterval = setInterval(spawnTarget, 1000);  // Spawn targets every second
    gameTimer = setInterval(updateTimer, 1000);  // Update the timer every second
    setTimeout(endGame, gameTime * 1000);  // End game after gameTime
}
function spawnTarget() {
    totalTargets++;

    var target = document.createElement("div");
    target.classList.add("target");
    
    //*Randomize target position
    var maxX = gameArea.offsetWidth - 50;  // Adjust for target width
    var maxY = gameArea.offsetHeight - 50;  // Adjust for target height
    var randomX = randomValue(0, maxX);
    var randomY = randomValue(0, maxY);
    
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
    target.style.width = "50px";  // Set width of target
    target.style.height = "50px";  // Set height of target
    target.style.backgroundColor = "red";  // Color of the target
    target.style.transition = "transform 0.5s";  // Transition for scale effect
    
    // Target appears
    document.body.appendChild(target);

    // Add time stuff for growing and shrinking target
    target.style.transform = "scale(1.5)";  // Grow target
    setTimeout(() => {
        target.style.transform = "scale(0.5)";  // Shrink target after 500ms
    }, 500); 

    // When clicked, target disappears
    target.addEventListener('click', () => {
        targetsClicked++;
        document.body.removeChild(target);  // Remove the target on click
    });

    // Remove the target if not clicked after a set time
    setTimeout(() => {
        if (document.body.contains(target)) {
            missedTargets++;
            document.body.removeChild(target);  // Remove target if missed
        }
    }, 1500);  // Adjust time for how long the target stays visible
}

function resetGame() {
    totalTargets = 0;
    targetsClicked = 0;
    missedTargets = 0; 
    clearTargets(); 

    remainingTime = gameTime;  // Reset the remaining time
    document.getElementById("timerDisplay").textContent = `Time left: ${remainingTime}s`;  // Reset timer display
}

function updateTimer() {
    remainingTime--;  // Decrease remaining time
    document.getElementById("timerDisplay").textContent = `Time left: ${remainingTime}s`;  // Update timer display

    if (remainingTime <= 0) {
        clearInterval(gameTimer);  // Stop the timer when it reaches 0
    }
}

function endGame() {
    clearTargets();
    displayScore(); 
    isGameRunning = false; // Set the game as not running
}

function clearTargets() {
    gameArea.innerHTML = "";  // Clear all targets
}

function displayScore() {
    totalTargetsDisplay.textContent = `Total targets: ${totalTargets}`;
    targetsClickedDisplay.textContent = `Targets clicked: ${targetsClicked}`;
    missedTargetsDisplay.textContent = `Missed targets: ${missedTargets}`;
    finalScoreDisplay.textContent = `Final score: ${calculateScore()}`;
    scoreboard.classList.remove("hidden");  // Show scoreboard
}

function calculateScore() {
    return Math.floor((targetsClicked / totalTargets) * 100) || 0;  // Avoid NaN
}

// Random value function
function randomValue(min, max) {
    return Math.random() * (max - min) + min; 
}
