// Functions
export const DB = () => {
  // create DB
  let indexDb = window.indexedDB.open('highScore', 1); // name, version
  // error
  indexDb.onerror = function () {
    console.log('Error creating DataBase');
  };
  // all its OK
  indexDb.onsuccess = function () {
    db = indexDb.result; // Save DB conexion on a global variable
  };
  // If the DB don't exist
  indexDb.onupgradeneeded = function (e) {
    db = e.target.result; // return the DB
    // create tables
    const objectStore = db.createObjectStore('dataScore', {
      keyPath: 'dataScore',
      autoIncrement: true,
    });
    // create collums
    objectStore.createIndex('score', 'score', { unique: false });
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
export const checkStoredScore = () => {
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
export const resetScore = () => {
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
const getRamNumber = () => Math.trunc(Math.random() * 20) + 1; // Random number between 1 and 20
const setScore = value => (score.textContent = value);
const setHighScore = value =>
  value > Number(highScore.textContent)
    ? (highScore.textContent = value)
    : null;
export const resetGame = () => {
  //DB();
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
const setMessage = msg => (message.textContent = msg);
export const checkNumber = () => {
  const userNumber = Number(guess.value);

  // no input
  if (!userNumber) {
    setMessage('⛔️ No Number, try again!');
    return;
  }

  // player win
  if (userNumber === guessNumber) {
    setMessage('🎉 Correct number!');
    displayNumber.textContent = guessNumber;
    displayNumber.style.width = '30rem';
    document.querySelector('body').style.backgroundColor = '#60b347';
    setHighScore(scoreValue);
    writeDB({ score: scoreValue });
    return;
  }

  // still playing
  if (scoreValue > 1) {
    // too high or low number
    setMessage(
      userNumber > guessNumber ? '⬆️ Too high number!' : '⬇️ Too low number!'
    );
    setScore(--scoreValue);
    return;
  }

  // player lose
  setMessage('💥 You Lose!');
  setScore(--scoreValue);
  btnCheck.disabled = true;
  btnCheck.style.backgroundColor = '#ccc';
};

// Variables
let scoreValue = 20;
let db;
let guessNumber = getRamNumber();
const highScore = document.querySelector('.highscore');
const displayNumber = document.querySelector('.number');
const score = document.querySelector('.score');
const guess = document.querySelector('.guess');
const message = document.querySelector('.message');
const btnCheck = document.querySelector('.check');
