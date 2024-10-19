interface Target {
	element: HTMLElement;
	timeout: number;
}

type Difficulty = 'easy' | 'medium' | 'difficult';
type Shape = 'circle' | 'square'

let gameTime: number = 30; // default time
let difficulty: Difficulty = 'easy'; // default difficulty
let targetShape: Shape = 'circle'; // Default target shape
let targetColor: string = '#ff0000'; // Default target color
let totalTargets: number = 0;
let targetsClicked: number = 0;
let missedTargets: number = 0;
let gameTimer: number | null = null;
let targetInterval: number | null = null;

const startButton = <HTMLButtonElement>document.getElementById('startGame');
const gameArea = <HTMLDivElement>document.getElementById('gameArea');
const scoreboard = <HTMLDivElement>document.getElementById('scoreboard');
const totalTargetsDisplay = <HTMLParagraphElement>document.getElementById('totalTargets');
const targetsClickedDisplay = <HTMLParagraphElement>document.getElementById('targetsClicked');
const finalScoreDisplay = <HTMLParagraphElement>document.getElementById('finalScore');
const missedTargetsDisplay = <HTMLParagraphElement>document.getElementById('missedTargets');

startButton.addEventListener('click', startGame);

function startGame() {
	resetGame();

	gameTime = <number>parseInt((document.getElementById('gameDuration') as HTMLInputElement).value);
	difficulty = <Difficulty>(document.getElementById('difficulty') as HTMLSelectElement).value;
	targetShape = <Shape>(document.getElementById('targetShape') as HTMLSelectElement).value;
	targetColor = <string>(document.getElementById('targetColor') as HTMLInputElement).value;

	const targetSpawnTime = difficulty === 'easy' ? 2000 : difficulty === 'medium' ? 1000 : 500;
	targetInterval = window.setInterval(spawnTarget, targetSpawnTime);
	gameTimer = window.setTimeout(endGame, gameTime * 1000);
}

function endGame() {
	clearInterval(targetInterval!);
	clearTargets();

	const endGameAudio = <HTMLAudioElement>document.getElementById('endGameAudio');
	endGameAudio.play();

	displayScore();
}

function resetGame() {
	totalTargets = 0;
	targetsClicked = 0;
	missedTargets = 0;
	gameArea.innerHTML = '';
	scoreboard.classList.add('hidden');
}

function clearTargets() {
	gameArea.innerHTML = '';
}

function displayScore() {
	totalTargetsDisplay.textContent = `total targets: ${totalTargets}`;
	targetsClickedDisplay.textContent = `targets clicked: ${targetsClicked}`;
	missedTargetsDisplay.textContent = `missed targets: ${missedTargets}`;
	finalScoreDisplay.textContent = `final score: ${calculateScore()}`;
	scoreboard.classList.remove('hidden');
}

function calculateScore() {
	return targetsClicked === 0 ? 0 : Math.floor((targetsClicked / totalTargets) * 100);
}

function spawnTarget() {
	totalTargets++;

	const target = document.createElement('div');
	target.classList.add('absolute', 'target', 'transition-transform');
	target.style.width = '20px';
	target.style.height = '20px';
	target.style.backgroundColor = targetColor;

	if (targetShape === 'circle')
		target.classList.add('rounded-full');

	const gameAreaRect = gameArea.getBoundingClientRect();
	const x = Math.random() * (gameAreaRect.width - 50);
	const y = Math.random() * (gameAreaRect.height - 50);
	target.style.transform = `translate(${x}px, ${y}px)`;

	target.addEventListener('click', () => {
		targetsClicked++;
		target.remove();
	});

	target.animate([
		{ transform: `translate(${x}px, ${y}px) scale(1)` },
		{ transform: `translate(${x}px, ${y}px) scale(4)` }
	], {
		duration: 1500,
		easing: 'ease-out'
	});

	gameArea.appendChild(target);

	window.setTimeout(() => {
		if (document.body.contains(target)) {
			missedTargets++;
			target.remove();
		}
	}, 1500);
}
