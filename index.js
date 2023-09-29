const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector("#score");
const cursor = document.querySelector(".cursor");
const timeRange = document.querySelector("#time");
const startButtons = document.querySelectorAll(".start_button");
const startDimmed = document.querySelector(".start_dimmed");

let score = 0;
let lastHole;
let playTime = 10;
let remainTime = playTime;
let isClick = false;
let timeInterval;
let min = 200,
  max = 1000;

// cursor
const positionElement = (e) => {
  const mouseY = e.clientY;
  const mouseX = e.clientX;

  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
};

window.addEventListener("mousemove", positionElement);

document.addEventListener("click", () => {
  if (isClick) return;
  isClick = true;
  cursor.style.transform = `rotate(-90deg)`;
  setTimeout(() => {
    cursor.style.transform = `rotate(0deg)`;
    isClick = false;
  }, 100);
});

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  console.log(min, max);
  const time = randomTime(min, max);
  const hole = randomHole(holes);
  hole.classList.add("up");

  setTimeout(() => {
    hole.classList.remove("up");
    if (remainTime > 0) peep();
    else {
      startDimmed.style.display = "flex";
      clearInterval(timeInterval);
    }
  }, time);
}

function updateTimeRange() {}

function startGame() {
  timeUp = false;
  peep();
  timeInterval = setInterval(() => {
    remainTime -= 0.02;
    timeRange.style.width = `${(remainTime / playTime) * 100}%`;
  }, 20);
}

function bonk(e) {
  if (!e.isTrusted) return;
  if ([...this.classList].includes("up")) {
    score++;
    this.classList.remove("up");
  }
  this.classList.add("hit");
  setTimeout(() => {
    this.classList.remove("hit");
  }, 200);
  scoreBoard.textContent = score;
}

function init() {
  score = 0;
  lastHole;
  playTime = 10;
  remainTime = playTime;
  isClick = false;
  scoreBoard.textContent = 0;
  timeRange.style.width = "100%";
}

holes.forEach((hole) => hole.addEventListener("click", bonk));

// prevent Drag
document.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

startButtons.forEach((startButton) => {
  startButton.addEventListener("click", (e) => {
    startDimmed.style.display = "none";
    if ([...e.target.classList].includes("-easy")) {
      min = 700;
      max = 1000;
    } else if ([...e.target.classList].includes("-normal")) {
      min = 400;
      max = 1000;
    } else if ([...e.target.classList].includes("-hard")) {
      min = 200;
      max = 400;
    }

    init();
    setTimeout(() => {
      startGame();
    }, [500]);
  });
});