'use strict';
import {
  DB,
  checkStoredScore,
  checkNumber,
  resetGame,
  resetScore,
} from './functions.js';

//selector's
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
btnCheck.addEventListener('click', checkNumber);
btnAgain.addEventListener('click', resetGame);
btnResetScore.addEventListener('click', resetScore);
