'use strict';

// Functions
const getRamNumber = () => Math.trunc(Math.random() * 20) + 1; // Genera numero aleatorio del 1 al 20
const setScore = value => (score.textContent = value);
const setHighScore = value =>
  value > Number(highScore.textContent)
    ? (highScore.textContent = value)
    : null;
const resetGame = () => {
  displayNumber.textContent = '?';
  setMessage('Start guessing...');
  displayNumber.style.width = '15rem';
  guess.value = '';
  document.querySelector('body').style.backgroundColor = '#222';
  scoreValue = 20;
  setScore(scoreValue);
  guessNumber = getRamNumber();
  btnCheck.disabled = false;
  btnCheck.style.backgroundColor = '#eee';
};
const setMessage = message =>
  (document.querySelector('.message').textContent = message);

// Variables
let guessNumber = getRamNumber();
let scoreValue = 20;
console.log(guessNumber);

//selector's
const displayNumber = document.querySelector('.number');
const score = document.querySelector('.score');
const highScore = document.querySelector('.highscore');
const guess = document.querySelector('.guess');
const btnCheck = document.querySelector('.check');
const btnAgain = document.querySelector('.again');

//Listeners
btnCheck.addEventListener('click', () => {
  const userNumber = Number(guess.value);
  // no input
  if (!userNumber) {
    setMessage('⛔️ No Number, try again!');
    // player win
  } else if (userNumber === guessNumber) {
    setMessage('🎉 Correct number!');
    displayNumber.textContent = guessNumber;
    displayNumber.style.width = '30rem';
    document.querySelector('body').style.backgroundColor = '#60b347';
    setHighScore(scoreValue);
    // still playing
  } else if (scoreValue > 1) {
    // too high or low number
    setMessage(
      userNumber > guessNumber ? '⬆️ Too high number!' : '⬇️ Too low number!'
    );
    setScore(--scoreValue);
    // player lose
  } else {
    setMessage('💥 You Lose!');
    setScore(--scoreValue);
    btnCheck.disabled = true;
    btnCheck.style.backgroundColor = '#ccc';
  }
});

btnAgain.addEventListener('click', resetGame);
