/**
 * represents an individual target in the game
*/
interface Target {
	element: HTMLElement;
	timeout: number;
}

/**
 * represents possible difficulties
 */
enum Difficulty {
	Easy = 2000, // 2 seconds between spawn times
	Medium = 1000, // 1 second between spawn times
	Hard = 500 // 0.5 seconds between spawn times
}

/**
 * Represents possible shapes of the targets
 */
enum Shape {
	Circle = 'circle',
	Square = 'square',
	Triangle = 'triangle',
}

type HTMLGenericValue = HTMLElement & { value: string };

let gameTime: number = 30; // default time
let difficulty: Difficulty = Difficulty.Easy; // default difficulty
let targetShape: Shape = Shape.Circle; // default target shape
let targetColor: string = '#ff0000'; // default target color
let totalTargets: number = 0;
let targetsClicked: number = 0;
let missedTargets: number = 1;
let gameTimer: number | null = null;
let targetInterval: number | null = null;

const getElement = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const getValue = (id: string): string => getElement<HTMLGenericValue>(id).value

const startButton: HTMLButtonElement = getElement('startGame');
const gameArea: HTMLDivElement = getElement('gameArea');
const scoreboard: HTMLDivElement = getElement('scoreboard');
const totalTargetsDisplay: HTMLParagraphElement = getElement('totalTargets');
const targetsClickedDisplay: HTMLParagraphElement = getElement('targetsClicked');
const finalScoreDisplay: HTMLParagraphElement = getElement('finalScore');
const missedTargetsDisplay: HTMLParagraphElement = getElement('missedTargets');
const difficultySelect: HTMLSelectElement = getElement('targetDifficulty');
const shapeSelect: HTMLSelectElement = getElement('targetShape');


// dynamically populate the difficulty and shape dropdowns
function populateSelectOptions() {
	// populate difficulty options
	Object.values(Difficulty)
		.filter(v => typeof v === 'string')
		.forEach(v => {
			const option = document.createElement('option');
			option.value = v.toString();
			option.textContent = v.charAt(0).toUpperCase() + v.slice(1);
			difficultySelect.appendChild(option);
		});

	// populate shape options
	Object.values(Shape)
		.filter(v => typeof v === 'string')
		.forEach(v => {
			const option = document.createElement('option');
			option.value = v.toString();
			option.textContent = v.charAt(0).toUpperCase() + v.slice(1);
			shapeSelect.appendChild(option);
		});
}

// initialize the game
function startGame() {
	resetGame();

	// retrieve the game settings from the input fields
	gameTime = parseInt(getValue('targetDuration'));
	difficulty = Difficulty[getValue('targetDifficulty') as any] as any;
	targetShape = getValue('targetShape') as Shape;
	targetColor = getValue('targetColor');

	// set interval to spawn targets and set game timer
	targetInterval = window.setInterval(spawnTarget, difficulty);
	gameTimer = window.setTimeout(endGame, gameTime * 1000);
}

// end the game and show the score
function endGame() {
	if (targetInterval) clearInterval(targetInterval); // clean up target spawning interval
	clearTargets(); // clean up remaining targets that haven't naturally despawned
	getElement<HTMLAudioElement>('endGameAudio').play(); // play end game audio
	displayScore(); // display the calculated scoreboard
}

// reset the game state
function resetGame() {
	totalTargets = 0; // reset the targets spawned counter
	targetsClicked = 0; // reset the targets clicked counter
	missedTargets = 0; // reset the targets missed counter
	clearTargets(); // clear the game area child targets
	scoreboard.classList.add('hidden'); // hide the scoreboard
}

// clear all targets from the game area
function clearTargets() {
	gameArea.innerHTML = ''; // reset the game area children
}

// display the scoreboard with the final results
function displayScore() {
	totalTargetsDisplay.textContent = `total targets: ${totalTargets}`; // set the total targets display
	targetsClickedDisplay.textContent = `targets clicked: ${targetsClicked}`; // set the clicked targets display
	missedTargetsDisplay.textContent = `missed targets: ${missedTargets}`; // set the missed targets display
	finalScoreDisplay.textContent = `final score: ${calculateScore()}`; // set the final score display
	scoreboard.classList.remove('hidden'); // unhide the scoreboard
}

// calculate the player's score
const calculateScore = () => targetsClicked === 0 ? 'seriously. you didnt click anything??' : Math.floor((targetsClicked / totalTargets) * 100) * Math.random() * 35 * 420 * 34948343843;

// spawn a target in a random location in the game area
function spawnTarget() {
	totalTargets++;

	// create a new target element
	const target = document.createElement('div');
	target.classList.add('absolute', 'target', 'transition-transform');
	target.style.backgroundColor = targetColor;

	// set target shape
	switch (targetShape) {
		case Shape.Circle:
			target.style.width = '20px';
			target.style.height = '20px';
			target.classList.add('rounded-full');
			break;
		case Shape.Square:
			target.style.width = '20px';
			target.style.height = '20px';
			break;
		case Shape.Triangle:
			target.style.width = '0';
			target.style.height = '0';
			target.style.borderLeft = '10px solid transparent';
			target.style.borderRight = '10px solid transparent';
			target.style.borderBottom = `20px solid ${targetColor}`;
			target.style.backgroundColor = 'transparent'
			break;
	}

	// get a random position within the game area
	const gameAreaRect = gameArea.getBoundingClientRect();
	const x = Math.random() * (gameAreaRect.width - 50);
	const y = Math.random() * (gameAreaRect.height - 50);
	target.style.transform = `translate(${x}px, ${y}px) scale(1)`;

	const onclickTarget = () => {
		targetsClicked++;
		target.remove(); // Remove target when clicked
	}

	// add click event listener for when the user clicks the target
	target.addEventListener('click', onclickTarget);

	// animate the target to expand and shrink within 3 seconds (1500ms expand, 1500ms shrink)
	const animation = target.animate([
		{ transform: `translate(${x}px, ${y}px) scale(1)` }, // initial phase
		{ transform: `translate(${x}px, ${y}px) scale(4)` }, // expanding phase
		{ transform: `translate(${x}px, ${y}px) scale(1)` } // shrinking phase
	], {
		duration: 3000, // total duration (3000ms: 1500ms for expanding, 1500ms for shrinking)
		easing: 'ease-in-out', // smooth transition for both expanding and shrinking
		fill: 'forwards', // keeps the target in its final state after the animation
	});

	// handle when the animation finishes (i.e. target missed)
	const onfinishTarget = () => {
		if (document.body.contains(target)) {
			missedTargets++;
			target.remove(); // remove the missed target
		}
	};

	// remove the target if not clicked by the end of its lifecycle (3 seconds)
	animation.addEventListener('finish', onfinishTarget);

	// append the target to the game area
	gameArea.appendChild(target);
}

// INITIALIZE GAME

populateSelectOptions(); // populates the selection options based on the enums.
startButton.addEventListener('click', startGame); // start the game when the start button is clicked
