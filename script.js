let focusTime = localStorage.getItem("focusTime")
  ? parseInt(localStorage.getItem("focusTime"))
  : 25 * 60;

// removed session counter; focus only on timer and sound

let time = focusTime;
let interval = null;
// persistent alarm audio and active flag
let alarmAudio = null;
let alarmActive = false;

const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const focusInput = document.getElementById("focusInput");
const muteButton = document.getElementById("muteButton");

// mute state (persisted)
let isMuted = localStorage.getItem("isMuted") === "true";

function updateMuteButton() {
  if (!muteButton) return;
  muteButton.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
}

if (muteButton) {
  muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    localStorage.setItem("isMuted", isMuted);
    updateMuteButton();
    // if an alarm is active, pause or resume it when toggling mute
    if (alarmActive && alarmAudio) {
      if (isMuted) {
        alarmAudio.pause();
      } else {
        // resume only if alarm is active (don't auto-start when there's no alarm)
        alarmAudio.play().catch(() => {});
      }
    }
  });
}

updateMuteButton();

focusInput.value = focusTime / 60;

function saveState() {
  localStorage.setItem("focusTime", focusTime);
  // don't persist sessions anymore
}

// legacy beep (unused now)
function playSound() {
  if (isMuted) return;
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  audio.play();
}

// start or resume the blips alarm; it will loop until stopped
function playBlipsSound() {
  alarmActive = true;
  if (!alarmAudio) {
    alarmAudio = new Audio("blips.mp3");
    alarmAudio.loop = true;
  }
  if (isMuted) return; // don't start audio when muted
  alarmAudio.play().catch(() => {});
}

// stop and reset the alarm audio
function stopAlarm() {
  alarmActive = false;
  if (alarmAudio) {
    try {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    } catch (e) {}
  }
}

function flip(element, newValue) {
  if (element.textContent === newValue) return;
  element.classList.add("flip");

  setTimeout(() => {
    element.textContent = newValue;
  }, 300);

  setTimeout(() => {
    element.classList.remove("flip");
  }, 600);
}

function updateDisplay() {
  const mins = String(Math.floor(time / 60)).padStart(2, "0");
  const secs = String(time % 60).padStart(2, "0");
  flip(minutesEl, mins);
  flip(secondsEl, secs);
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      completeSession();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  pauseTimer();
  stopAlarm();
  time = focusTime;
  updateDisplay();
}

// invoked when the timer hits zero
function completeSession() {
  playBlipsSound();
  saveState();
  updateDisplay();
}

focusInput.addEventListener("change", () => {
  const value = parseInt(focusInput.value);
  if (!isNaN(value) && value > 0) {
    focusTime = value * 60;
    time = focusTime;
    updateDisplay();
    saveState();
  }
});



updateDisplay();