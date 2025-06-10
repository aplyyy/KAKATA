const clapSound = document.getElementById("clapSound");
const loseSound = document.getElementById("loseSound");
const nextBtn = document.getElementById("nextBtn");

//ee
const wordLists = {
  easy: ["BUKU", "PAKU", "SISI", "ROTI"],
  medium: ["POLISI", "POSISI", "DIVISI"],
  hard: ["KOMPUTER", "INDUSTRI", "DIREKTUR"]
};

const wordLengths = {
  easy: 4,
  medium: 6,
  hard: 8
};

const maxGuesses = 5;
let word = "";
let currentGuess = 0;
let wordLength = 5;
let currentLevel = "easy";

const grid = document.getElementById("grid");
const message = document.getElementById("message");
const guessInput = document.getElementById("guessInput");
const modal = document.getElementById("startModal");
const modalLevelSelect = document.getElementById("modalLevelSelect");
const inputArea = document.getElementById("inputArea");
const changeLevelBtn = document.getElementById("changeLevelBtn");
const levelLabel = document.getElementById("currentLevel");

function startGameFromModal() {
  currentLevel = modalLevelSelect.value;
  startGame(currentLevel);
  modal.style.display = "none";
  changeLevelBtn.style.display = "inline-block";
  levelLabel.textContent = `Level: ${currentLevel.toUpperCase()}`;
  nextBtn.style.display = "none";
}

function openModal() {
  modal.style.display = "flex";
  message.textContent = "";
  guessInput.value = "";
  guessInput.disabled = false;
  inputArea.style.display = "none";
  grid.style.display = "none";
  changeLevelBtn.style.display = "none";
  levelLabel.textContent = "";
}

function startGame(level) {
  const words = wordLists[level];
  word = words[Math.floor(Math.random() * words.length)];
  wordLength = wordLengths[level];
  currentGuess = 0;

  grid.innerHTML = "";
  grid.style.display = "grid";
  inputArea.style.display = "block";
  message.textContent = "";
  guessInput.disabled = false;
  guessInput.value = "";
  guessInput.maxLength = wordLength;

  grid.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;

  for (let i = 0; i < maxGuesses * wordLength; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }

  guessInput.focus();
}

function submitGuess() {
  function handleNext() {
    nextBtn.style.display = "none";
    startGame(currentLevel);
  }  
  const guess = guessInput.value.toUpperCase();
  if (guess.length !== wordLength) {
    alert(`Masukkan kata ${wordLength} huruf!`);
    return;
  }
  if (currentGuess >= maxGuesses) {
    message.textContent = "Game selesai! Kata: " + word;
    return;
  }

  const start = currentGuess * wordLength;
  let wordLetters = word.split("");
  let guessLetters = guess.split("");

  for (let i = 0; i < wordLength; i++) {
    const cell = grid.children[start + i];
    cell.textContent = guessLetters[i];
    cell.className = "cell";

    if (guessLetters[i] === wordLetters[i]) {
      cell.classList.add("correct");
      wordLetters[i] = null;
      guessLetters[i] = null;
    }
  }

  for (let i = 0; i < wordLength; i++) {
    if (guessLetters[i]) {
      const cell = grid.children[start + i];
      if (wordLetters.includes(guessLetters[i])) {
        cell.classList.add("present");
        wordLetters[wordLetters.indexOf(guessLetters[i])] = null;
      } else {
        cell.classList.add("absent");
      }
    }
  }

  if (guess === word) {
    message.textContent = "Selamat! Kamu benar!";
    guessInput.disabled = true;
  
    clapSound.currentTime = 0;
    clapSound.play();
  
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  
    nextBtn.style.display = "inline-block";
    return;
  }

  currentGuess++;
  guessInput.value = "";
  guessInput.focus();
  
  if (currentGuess === maxGuesses) {
    message.textContent = "Game selesai! Kata: " + word;
    guessInput.disabled = true;
  
    loseSound.currentTime = 0;
    loseSound.play();
  
    nextBtn.style.display = "inline-block";
  }
}

window.onload = () => {
  openModal();
};
