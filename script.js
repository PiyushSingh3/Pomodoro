const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const resetButton = document.querySelector('#reset');
const themeToggle = document.querySelector('#theme-toggle');

let intervalId;
let isRunning = false;
let timeRemaining = 1500; // 25 minutes in seconds = 1500

function updateClock() {
  const min = Math.floor(timeRemaining / 60);
  const sec = timeRemaining % 60;
  minutes.textContent = min < 10 ? '0' + min : min;
  seconds.textContent = sec < 10 ? '0' + sec : sec;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;

  intervalId = setInterval(() => {
    timeRemaining--;
    updateClock();

    if (timeRemaining === 0) {
      clearInterval(intervalId);
      isRunning = false;
      startButton.disabled = false;
      pauseButton.disabled = true;
      timeRemaining = 1500;

      // Play alarm sound
      const alarmSound = document.getElementById('alarm');
      alarmSound.play();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;

  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;

  clearInterval(intervalId);
}

function resetTimer() {
  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  clearInterval(intervalId);
  timeRemaining = 1500;
  updateClock();

    // Stop alarm sound
    const alarmSound = document.getElementById('alarm');
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme');
});

