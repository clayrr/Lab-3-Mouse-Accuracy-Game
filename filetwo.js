var gameTime = 30;
var totalTargets = 0;
var targetsClicked = 0;
var missedTargets = 0; 
var targetInterval = null; 
var gameTiner = null; 

//Start button 
var startButton = document.getElementById("start");
startButton.addEventListener('click', startGame); 


function startGame(){
    resetGame();
    targetInterval = setInterval(spawnTarget, 1000);
    gameTimer = setTimeout(endGame, gameTime * 1000);

}

function spawnTarget() {
    totalTargets++;

    var target = document.createElement("div");
    target.classList.add("target");
    //position of target - randomize it --- 

    //target appears
    document.body.appendChild(target);

    //add time stuff for growing and shrink target
    // Grow target
    target.style.transform = "scale(1.5)"; 
    //shrink 
    target.style.transform = "scale(0.5)"; 

    //when clicked- target disappears
    target.addEventListener('click', () => {
        targetsClicked++;
        document.body.removeChild(target); // Remove the target on click
    });


}

function resetGame(){
    totalTargets = 0;
    targetsClicked = 0;
    missedTargets = 0; 
    clearTargets(); 

    //clear timer
}

function endGame(){
    clearTargets();
    displayScore(); 

    resetGame(); 
}

function clearTargets() {
    gameArea.innerHTML = "";
}

function displayScore(){
    totalTargetsDisplay.textContent = `total targets: ${totalTargets}`;
    targetsClickedDisplay.textContent = `targets clicked: ${targetsClicked}`;
    missedTargetsDisplay.textContent = `missed targets: ${missedTargets}`;
    finalScoreDisplay.textContent = `final score: ${calculateScore()}`;
    //score board appears bc hidden is removed
    scoreboard.classList.remove("hidden");
}

var calculateScore = Math.floor(targetsClicked / totalTargets * 100); 

//random stuff
function randomValue(min, max){
    return Math.random() * (max-min) + min; 
}

Math.floor(Math.random());
