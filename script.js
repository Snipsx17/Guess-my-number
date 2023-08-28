'use strict';

// Functions
const DB = () => {
  // create DB
  let indexDb = window.indexedDB.open('highScore', 1); // name, version
  // error
  indexDb.onerror = function () {
    console.log('Error creating DataBase');
  };
  // all its OK
  indexDb.onsuccess = function () {
    db = indexDb.result; // guardamos la conexion a la base de datos en una variables global
  };
  // solo se ejecuta una vez
  indexDb.onupgradeneeded = function (e) {
    db = e.target.result; // return the DB
    // create tables
    const objectStore = db.createObjectStore('dataScore', {
      keyPath: 'dataScore',
      autoIncrement: true,
    });
    // create collums
    objectStore.createIndex('score', 'score', { unique: false });

    console.log('All collums was created');
  };
};
const writeDB = data => {
  const objectStore = db
    .transaction(['dataScore'], 'readwrite')
    .objectStore('dataScore');

  objectStore.get(1).onsuccess = e => {
    const object = e.target.result;
    if (object) {
      object.score = data.score > object.score ? data.score : object.score;
      objectStore.put(object).onsuccess = e =>
        console.log('Score has been update!');
    } else {
      objectStore.add(data).onsuccess = e => console.log('New score created');
    }
  };

  objectStore.onerror = e => {
    console.log('error!');
  };
};
const checkStoredScore = () => {
  const objectStore = db
    .transaction(['dataScore'], 'readonly')
    .objectStore('dataScore');

  objectStore.get(1).onsuccess = e => {
    const object = e.target.result;
    if (object) {
      highScore.textContent = object.score; // set stored score
    } else {
      highScore.textContent = 0;
    }
  };

  objectStore.onerror = e => {
    console.log('error!');
  };
};
const resetScore = () => {
  const objectStore = db
    .transaction(['dataScore'], 'readwrite')
    .objectStore('dataScore');

  objectStore.get(1).onsuccess = e => {
    const object = e.target.result;
    if (object) {
      object.score = 0;
      objectStore.put(object).onsuccess = e =>
        console.log('Score has been update!');
    } else {
      objectStore.add({ score: 0 }).onsuccess = e =>
        console.log('New score created');
    }

    checkStoredScore();
  };
};
const getRamNumber = () => Math.trunc(Math.random() * 20) + 1; // Genera numero aleatorio del 1 al 20
const setScore = value => (score.textContent = value);
const setHighScore = value =>
  value > Number(highScore.textContent)
    ? (highScore.textContent = value)
    : null;
const resetGame = () => {
  DB();
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
let db;

//selector's
const displayNumber = document.querySelector('.number');
const score = document.querySelector('.score');
const highScore = document.querySelector('.highscore');
const guess = document.querySelector('.guess');
const btnCheck = document.querySelector('.check');
const btnAgain = document.querySelector('.again');
const btnResetScore = document.querySelector('.reset');

//Listeners
document.addEventListener('DOMContentLoaded', () => {
  DB();
  setTimeout(() => {
    checkStoredScore();
  }, 50);
});
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
    writeDB({ score: scoreValue });
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
btnResetScore.addEventListener('click', () => {
  resetScore();
});
