const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dataElement = document.getElementById("date-picker");

const countdownElement = document.getElementById("countdown");
const countdownElementTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeElement = document.getElementById("complete");
const completeElementInfo = document.getElementById("complete-info");
const completeButton = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input min with today's date
const today = new Date().toISOString().split("T")[0];
dataElement.setAttribute("min", today);

// populate countdown /Complete UI

function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // hide input
        inputContainer.hidden = true;

        // if the countdown has ended,show complete

        if (distance < 0) {
            countdownElement.hidden = true;
            clearInterval(countdownActive);
            completeElementInfo.textContent = `Event : ${countdownTitle} - finished on ${countdownDate}`;
            completeElement.hidden = false;
        } else {
            // else ,show the countdown in progress
            countdownElementTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeElement.hidden = true;
            countdownElement.hidden = false;
        }
    }, second);
}

// take values from FORM input

function updateCountdown(e) {
    e.preventDefault();

    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    // set item in localstorage
    localStorage.setItem("countdown", JSON.stringify(savedCountdown));

    // check for valid date
    if (countdownTitle === "") {
        alert("Please seleted a title for the countdown");
    } else if (countdownDate === "") {
        alert("Please seleted a date for the countdown");
    } else {
        // get number version of current date,updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Reset All values

function reset() {
    // hide countdowns ,show input

    countdownElement.hidden = true;
    completeElement.hidden = true;
    inputContainer.hidden = false;
    // stop the countdown

    clearInterval(countdownActive);
    // reste vlaues
    countdownTitle = "";
    countdownDate = "";
    localStorage.removeItem("countdown");
}


function restorePreviousCountdown() {
    // Get countdown from localStorage if available

    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// event listeners

countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeButton.addEventListener("click", reset);

// onload ,check locaStorage
restorePreviousCountdown();
