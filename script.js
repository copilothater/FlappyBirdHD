let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";
let gameInterval = null;

let pipe_gap = 300;
let pipes = [];
let frame = 0;
const frame_time = 200;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_button = document.getElementById("start_button");

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
      hideStartButton();
    }
    bird_dy = -5;
  }
});

function setScore(newScore) {
    score = newScore;
    score_display.textContent = "Score: "+ score;
}

function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;
  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);
  bird.style.top = birdTop + "px";
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
  bottom_pipe.style.height = game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - 3 + "px";

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
    }
    else {
        document.getElementById("start_button").style.display = "block";
    }
}
function startGame() {
  if (gameInterval !== null) return;

  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();
    frame++;

    if (frame % frame_time === 0) {
      createPipe();
    } }, 10);
}

function resetGame() {
    bird.style.top = "50%";
    bird_dy = 0;
    
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
    clearInterval(gameInterval);
    gameInterval = null;

    alert("Game Over! Your score is: " + score);
    resetGame()
}

function onStartButton() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
    hideStartButton()
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
      birdRect.top + birdRect.top > pipeRect.top
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
        if (pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft && !pipe.passed) {
            score++;
            score_display.innerText = score;
            setScore(score + 1);
        }
    }
    });
}