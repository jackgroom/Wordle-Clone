import * as WordHandler from './wordHandler.js';

const wordBoard = document.querySelector('.word-board');
const inputEnums = { letter: 1, enter: 2, backspace: 3 };

export default class Game {
  #currentWord;

  constructor() {
    this.tries = 6;
    this.isRunning = false;

    this.currentAttempt = [];
  }

  setup() {
    WordHandler.getRandomWord().then((randomWord) => {
      console.log(randomWord);
      this.#currentWord = randomWord;
    });
    window.addEventListener('keydown', (e) => {
      this.manageUserInput(e);
    });
  }

  manageUserInput(input) {
    if (
      (input.keyCode >= 65 && input.keyCode <= 90) ||
      (input.keyCode >= 97 && input.keyCode <= 122)
    ) {
      this.registerInput(inputEnums.letter, input.key);
    } else if (input.keyCode == 8) {
      this.registerInput(inputEnums.backspace);
    } else if (input.keyCode == 13) {
      this.registerInput(inputEnums.enter);
    }
  }

  registerInput(inputType, key) {
    const currentRowIndex = 6 - this.tries;
    const currentRow = wordBoard.getElementsByClassName('row')[currentRowIndex];
    const currentTile =
      currentRow.getElementsByClassName('tile')[this.currentAttempt.length];
    const previousTile =
      currentRow.getElementsByClassName('tile')[this.currentAttempt.length - 1];

    switch (inputType) {
      case inputEnums.letter:
        if (this.currentAttempt.length < 5) {
          currentTile.innerHTML = key.toUpperCase();
          this.currentAttempt.push(key.toUpperCase());
        }
        break;
      case inputEnums.backspace:
        if (typeof previousTile != 'undefined') {
          previousTile.innerHTML = '';
          this.currentAttempt.pop();
        }
        break;
      case inputEnums.enter:
        if (this.currentAttempt.length == 5) {
          WordHandler.checkWordExists(this.currentAttempt.join('')).then(
            (doesExist) => {
              if (doesExist) {
                this.checkAttempt(this.currentAttempt);
              }
            }
          );
        }
        break;
    }
  }

  checkAttempt(guess) {
    if (guess.join('').toUpperCase() == this.#currentWord.toUpperCase()) {
      console.log('well done.');
      this.displayResult(guess);
    } else {
      console.log("ynice try");
      this.displayResult(guess);
      this.tries--;
      this.currentAttempt = [];
    }
  }

  displayResult(guess) {
    const currentRowIndex = 6 - this.tries;
    const currentRow = wordBoard.getElementsByClassName('row')[currentRowIndex];

    let values = WordHandler.checkLetterValues(this.#currentWord, guess);
    values.forEach((element, index) => {
      let currentTile = currentRow.getElementsByClassName('tile')[index];
      currentTile.classList.add(element.result);
    });
  }
}
