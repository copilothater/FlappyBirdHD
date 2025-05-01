let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let game_interval = null;
let pipe_gap = 350;
let pipes = [];
let frame = 0;
let frame_time = 200;
let angle = 0;
let pipe_speed = 2;
let highscore = localStorage.getItem("highscore") || 0;
let score_multiplier = 1;

let bird = document.getElementById("bird");
let difficulty = document.getElementById("difficulty");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_button = document.getElementById("start_button");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "MouseDown") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
      hideStartButton();
    }
    // hitSound.play();

    bird_dy = -5;
  }
});

function getDifficultySettings() {
  const selected = difficulty.value;

  if (selected === "easy") {
    pipe_gap = 400;
    pipe_speed = 2;
    frame_time = 200;
    score_multiplier = 1;
  } else if (selected === "medium") {
    pipe_gap = 300;
    pipe_speed = 3;
    frame_time = 250;
    score_multiplier = 2;
  } else if (selected === "hard") {
    pipe_gap = 200;
    pipe_speed = 5;
    frame_time = 300;
    score_multiplier = 3;
  }
}

function setScore(newScore) {
  if (newScore > score) {
    //hitSound.play();
    score = newScore;
  }
  score = newScore;
}

function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;
  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);
  bird.style.top = birdTop + "px";

  let angle = Math.min(Math.max(bird_dy * 6, -90), 180);
  bird.style.transform = `rotate(${angle}deg)`;
}

function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  // Top pipe
  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe top_pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  // Bottom pipe
  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe bottom_pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - pipe_speed + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

function hideStartButton() {
  if (game_state === "Play") {
    document.getElementById("start_button").style.display = "none";
    document.getElementById("difficulty").style.display = "none";
  } else {
    document.getElementById("start_button").style.display = "block";
    document.getElementById("difficulty").style.display = "block";
  }
}
function startGame() {
  if (game_interval !== null) return;

  game_interval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    getDifficultySettings();

    console.log(pipe_speed);

    frame++;

    highscore = localStorage.getItem("highscore") || 0;
    score_display.textContent =
      "Score: " + score + "  | Highscore: " + highscore;
    console.log(highscore);
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

function resetGame() {
  bird.style.top = "50%";
  bird_dy = 0;
  bird.style.transform = `rotate(${0}deg)`;

  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  //score_display.textContent = "";
  hideStartButton();
}

function endGame() {
  hitSound.play();

  if (Number(score) > Number(highscore)) {
    localStorage.setItem("highscore", score);
  }

  clearInterval(game_interval);
  game_interval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  alert("Game Over! Your score is: " + score);
  resetGame();
}

function onStartButton() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
    hideStartButton();
  }
}

function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();
    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }

  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }

  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + (1*score_multiplier));
      }
    }
  });
}

const hitSound = new Audio("jixsaw-metal-pipe-falling-sound.mp3");

const backgroundMusic = new Audio("020188_bird-park-ambience-74610.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
//backgroundMusic.play();
