// Variables
let worktitle = document.getElementById("work");
let breaktitle = document.getElementById("break");

let worktime = 25;
let breaktime = 5;

// Display
window.onload = () => {
    document.getElementById("minuts").innerHTML = worktime;
    document.getElementById("seconds").innerHTML = "00";

    worktitle.classList.add("active");
};

// Start Timer
function start() {
    // Change button
    document.getElementById("start").style.display = "none";
    document.getElementById("reset").style.display = "block";

    // Reset time
    let countdownTime = (worktime * 60) - 1;
    let breakCount = 0;

    // Countdown
    let intervalID = setInterval(() => {
        if (countdownTime === -1) {
            clearInterval(intervalID);
            // Start break or continue work
            if (breakCount % 2 === 0) {
                worktitle.classList.remove("active");
                breaktitle.classList.add("active");
                countdownTime = breaktime * 60;
                updateDisplay(breaktime, 0);
            } else {
                breaktitle.classList.remove("active");
                worktitle.classList.add("active");
                countdownTime = worktime * 60;
                updateDisplay(worktime, 0);
            }
            breakCount++;
        } else {
            let minutes = Math.floor(countdownTime / 60);
            let secondsLeft = countdownTime % 60;
            updateDisplay(minutes, secondsLeft);
            countdownTime--;
            if (countdownTime < 0) {
                // call updateDisplay one more time with 0 minutes and 0 seconds
                updateDisplay(0, 0);
            }
        }
    }, 1000);

    // Call updateDisplay with 0 minutes and 0 seconds at the end of the timer
    setTimeout(() => {
        updateDisplay(0, 0);
    }, (worktime + breaktime) * 60 * 1000);

    // Helper function to update display
    function updateDisplay(minutes, secondsLeft) {
        document.getElementById("minuts").innerHTML = minutes;
        document.getElementById("seconds").innerHTML = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
    }
}

// Toggle Mode
let toggle = document.getElementById("toggle-mode");

toggle.addEventListener("click", function() {
    let body = document.querySelector("body");
    let controls = document.querySelector(".controls");
    let timer = document.querySelector(".timer");
    let painel = document.querySelector(".painel");

    if (this.checked) {
        // Dark mode
        body.classList.add("dark-mode");
        controls.style.backgroundColor = "var(--color-primery)";
        timer.style.backgroundColor = "var(--color-primery)";
        painel.style.backgroundColor = "var(--color-font)";
    } else {
        // Light mode
        body.classList.remove("dark-mode");
        controls.style.backgroundColor = "transparent";
        timer.style.backgroundColor = "var(--color-secondary)";
        painel.style.backgroundColor = "transparent";
    }
});