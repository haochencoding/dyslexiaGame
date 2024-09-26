let level = 0;
let score = 0;
const pages = $('div.page');
const levelUpPage = $('#level-up-page');
const startMusic = new Audio('assets/audio/unforgettable-moments-161053.mp3');
const nextLevelAudio = new Audio('assets/audio/cartoon-142268.mp3');
const successAudio = new Audio('assets/audio/level-passed-142971.mp3');
const failAudio = new Audio('assets/audio/pipe-117724.mp3');
// import { showExplanationAndBtn, checkAnswer } from './checkAnswer.js';
import {messUpWords} from './messWord.js';

const questions = [
  {
    level: 1,
    pageId: "level-1",
    formId: "level-1-quiz-form",
    answerValue: "C",
    reseNonSelect: "Oops, you did not select an option! Now Harry and Ron are both unconscious.",
    resCorrect: "Congratulations! Harry and Ron are saved.",
    resWrong: "Oops! You made a mistake! Now Harry and Ron are both unconscious."
  },

  {
    level: 2,
    pageId: "level-2",
    formId: "level-2-quiz-form",
    answerValue: "B",
    reseNonSelect: "Oops, you did not select an option! Now Anna and Kristoff are completely frozen.",
    resCorrect: "Congratulations! Anna and Kristoff are saved.",
    resWrong: "Oops! You made a mistake! Now Anna and Kristoff are completely frozen."
  }
]

const startCountdown = (duration) => {
  let timeRemaining = duration;
  const timeBar = document.getElementById('timeBar');
  const timeBarSeconds = document.querySelector('#timeBarSeconds');
  const countdownText = document.getElementById('countdownText');
  const timeBarFullWidth = 95;

  timeBarSeconds.innerHTML = timeRemaining;

  const interval = setInterval(() => {
    timeRemaining--;

    // Update the width of the time bar (percentage of remaining time)
    timeBar.style.width = (timeRemaining / duration) * timeBarFullWidth + '%';
    timeBarSeconds.innerHTML = timeRemaining;

    if (timeRemaining === 10) {
      timeBar.classList.add('time-bar-warning');
    }

    // Stop the countdown when it reaches 0
    if (timeRemaining <= 0) {
      clearInterval(interval);
    }
  }, 1000);  // Decrease every second

  return interval;
}

const showExplanationAndBtn = (page_id) => {
  const explanationContainer = document.querySelector(`#${page_id} .quiz-explanation-container`);
  const btnContainer = document.querySelector(`#${page_id} .page-btn-container`);
  explanationContainer.classList.remove("invisible");
  btnContainer.classList.remove("invisible");
}

const checkAnswer = (event, page_id, form_id, answerValue, resNonSelect, resCorrect, resWrong) => {
  if (event) {
    event.preventDefault();
  }

  // Get the selected option
  const selectedOption = document.querySelector(`#${form_id} input[name="option"]:checked`);
  const resultMessage = document.querySelector(`#${page_id} .result-message`);

  // Check if any option is selected
  if (!selectedOption) {
      resultMessage.innerHTML = `<p style='color: red;'>${resNonSelect}</p>`;
      failAudio.play();
      // return;
  } else if (selectedOption.value === answerValue) {
    resultMessage.innerHTML = `<p style='color: green;'>${resCorrect}</p>`;
    successAudio.play();
  } else {
    resultMessage.innerHTML = `<p style='color: red;'>${resWrong}</p>`;
    failAudio.play();
  }

  document.querySelector(`#${form_id} input[type="submit"]`).classList.add("invisible");
  showExplanationAndBtn(page_id);
}

const startQuizz = () => {
  const timeBarContainer = $('.time-bar-container');
  timeBarContainer.removeClass('invisible');
  const countDown = startCountdown(120);

  // Get the current question
  const q = questions.find(question => question.level === level);

  let effectHandle;
  if (level === 1) {
    effectHandle = setInterval(messUpWords, 100);
  }

  // Show the submit button when any radio button is selected
  document.querySelectorAll(`#${q.formId} input[name="option"]`).forEach((radio) => {
    radio.addEventListener('click', function() {
      document.querySelector(`#${q.formId} input[type="submit"]`).classList.remove("invisible");
    });
  });

  // Check the answer by click or timeout
  const timeOutCheckAnswer = setTimeout(() => {
    checkAnswer(null, q.pageId, q.formId, q.answerValue, q.reseNonSelect, q.resCorrect, q.resWrong);
    clearInterval(effectHandle);
  }, 120000);

  document.getElementById(q.formId).addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(timeOutCheckAnswer);
    checkAnswer(event, q.pageId, q.formId, q.answerValue, q.reseNonSelect, q.resCorrect, q.resWrong);
    clearInterval(countDown);
    clearInterval(effectHandle);
  });
  
};

const levelUp = () => {
  if (!startMusic.paused) {
    startMusic.pause();
  };

  // Hide the current page & time bar
  pages[level].classList.add('invisible');
  const timeBarContainer = $('.time-bar-container');
  timeBarContainer.addClass('invisible');

  // Show the level up page
  level++;
  $("#level-up-page-level").text(`Level ${level}`);
  levelUpPage.removeClass('invisible');
  nextLevelAudio.play();

  // Load the next page
  setTimeout(() => {
    levelUpPage.addClass('invisible');
    pages[level].classList.remove('invisible');
    startQuizz();
  }, 3000)
}

$('button.next-btn').on('click', function() {
  console.log('Button clicked');
  levelUp();
});

// // Start the game
// startMusic.muted = true; // Start muted
// startMusic.play().then(() => {
//   // Once the music is playing, unmute after a delay or immediately
//   setTimeout(() => {
//     startMusic.muted = false; // Unmute the sound
//   }, 1000); // Unmute after 1 second, or adjust as needed
// }).catch(error => {
//   console.error("Autoplay blocked:", error);
// });

// setTimeout(() => {
//   $('#load-page').addClass('invisible');
//   $('#start-page').removeClass('invisible');
// }, 5000)

$('#game-start-btn').on('click', function() {
  $('#load-page').addClass('invisible');
  $('#intro-page').removeClass('invisible');
  startMusic.play();
});