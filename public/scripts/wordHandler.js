export function getWords() {
  return new Promise((res, rej) => {
    fetch('./words.txt')
      .then((wordList) => wordList.text())
      .then((data) => {
        res(data.split('\r\n'));
      });
  });
}

export async function getRandomWord() {
  const words = await getWords();
  return words[Math.floor(Math.random() * words.length)];
}

export async function checkWordExists(searchWord) {
  const words = await getWords();
  let found = false;

  words.forEach((word) => {
    if (word.toUpperCase() === searchWord.toUpperCase()) {
      found = true;
      break;
    }
  });

  return found;
}

export function checkLetterExists(word, letter) {
  let exists = false;
  for (let i = 0; i < word.length; i++) {
    if (word[i].toUpperCase() == letter.toUpperCase()) {
      exists = true;
    }
  }
  return exists;
}

export function checkLetterValues(word, guess) {
  let letterArray = [];
  let occurances = {};

  const countElements = (array, element) => {
    let counter = 0;
    for (let i = 0; i < array.length; i++) {
      let current = array[i];
      if (current.toUpperCase() == element.toUpperCase()) {
        counter++;
      }
    }
    return counter;
  };

  for (let i = 0; i < word.length; i++) {
    let current = word[i];
    letterArray.push({});
    if (current.toUpperCase() == guess[i]) {
      letterArray[i].letter = guess[i];
      letterArray[i].result = 'correct';
    }

    if (!occurances[guess[i]]) {
      occurances[guess[i]] = {
        occurancesInWord: countElements(word, guess[i]),
        correctOccurances: letterArray.filter(
          (element) => element.letter == guess[i] && element.result == 'correct'
        ).length,
      };
    }
  }

  for (let i = 0; i < word.length; i++) {
    let current = word[i];
    let currentGuess = guess[i];

    if (!letterArray[i].result) {
      if (
        occurances[currentGuess].occurancesInWord >
        occurances[currentGuess].correctOccurances
      ) {
        letterArray[i].result = 'exists';
        occurances[currentGuess].correctOccurances++;
      } else {
        letterArray[i].result = 'nonexistant';
      }
    }
  }

  return letterArray;
}

export function checkLetterAtPosition(word, letter, position) {
  return word[position].toUpperCase() == letter.toUpperCase();
}
