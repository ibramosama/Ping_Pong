// Game Constants
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 8;
const BALL_SPEED = 4;
const PADDLE_SPEED = 6;
const WINNING_SCORE = 6;
const GAME_DURATION = 60; // in seconds
const lineWidth = 2;
const lineDashSegments = [10, 5];

// Game State
let gameState = {
  paused: false,
  pausedTime: 0,
};

let gameLoopInterval;
let timerInterval;
let restartButton = document.getElementById("restartButton")

// Initialize the game
function initializeGame() {
  if (!gameState.paused) {
  // Set up the canvas
  canvas.width = 800;
  canvas.height = 400;

  // Set initial game state
  gameState = {
    player1: {
      name: localStorage.getItem("player1Name"),
      color: localStorage.getItem("player1Color"),
      score: 0,
      paddle: {
        x: 10,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0,
      },
      upKey: "ArrowUp",
      downKey: "ArrowDown",
    },
    player2: {
      name: localStorage.getItem("player2Name"),
      color: localStorage.getItem("player2Color"),
      score: 0,
      paddle: {
        x: canvas.width - paddleWidth - 10,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0,
      },
      upKey: "KeyW",
      downKey: "KeyS",
    },
    ball: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    },
    gameStarted: false,
    gameOver: false,
    startTime: null,
  };

  // Set up event listeners
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}
}

// Start the game loop
function startGameLoop() {
  if (!gameState.paused) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  timerInterval = setInterval(checkGameDuration, 1000);
  // Start the game loop
  gameLoopInterval = setInterval(updateGame, 16);
  }
  
}

function updateGame() {
  if (gameState.paused) {
    return; // Exit the function if the game is paused
  }

  if (gameState.player1.score === WINNING_SCORE || gameState.player2.score === WINNING_SCORE || gameState.gameOver) {
    endGame();
    return; // Exit the function if the game is already over
  }

  // Check if the game is over
  if (gameState.gameOver) {
    clearInterval(timerInterval);
    clearInterval(gameLoopInterval);
    return;
  }

  // Update paddle positions
  updatePaddle(gameState.player1.paddle);
  if (localStorage.getItem("gameMode") === "computer") {
    updateComputerPaddle();
  } else {
    updatePaddle(gameState.player2.paddle);
  }

  // Update ball position
  updateBall();

  // Check for collision with paddles
  checkPaddleCollision();

  // Check game duration
  checkGameDuration();

  // Function to predict the winner
  updatePrediction();

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the paddles
  drawPaddle(gameState.player1.paddle, gameState.player1.color);
  if (localStorage.getItem("gameMode") === "computer") {
    drawComputerPaddle();
  } else {
    drawPaddle(gameState.player2.paddle, gameState.player2.color);
  }

  // Draw the ball
  drawBall(gameState.ball.x, gameState.ball.y);

  // Draw the scores
  drawScores();

  // Draw the dotted line
  drawDottedLine();

  // Draw the game timer
  drawTimer();

  // Check if the game is over after drawing
  if (gameState.player1.score === WINNING_SCORE || gameState.player2.score === WINNING_SCORE || gameState.gameOver) {
    endGame();
  }
}

  // Function to draw a dotted line
  function drawDottedLine() {
    context.beginPath();
    context.setLineDash(lineDashSegments);
    context.lineWidth = lineWidth;
    context.strokeStyle = "#FFF";
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
  }
  // Update the paddle position
  function updatePaddle(paddle) {
    if (!gameState.paused) {
    paddle.y += paddle.dy;
  
    // Restrict paddle movement within the canvas
    if (paddle.y < 0) {
      paddle.y = 0;
    }
    if (paddle.y + paddle.height > canvas.height) {
      paddle.y = canvas.height - paddle.height;
    }
  }
  }
  
  // Update the computer paddle position
  function updateComputerPaddle() {
    if (!gameState.paused) {
      const computerPaddle = gameState.player2.paddle;
      const ball = gameState.ball;
    
      // Calculate the distance between the paddle and the ball
      const distance = Math.abs(ball.y - (computerPaddle.y + computerPaddle.height / 2));
    
      // Adjust the paddle's speed based on the distance to the ball
      const maxSpeed = 10; // Adjust this value to control the computer paddle's maximum speed
      const paddleSpeed = Math.min(distance, maxSpeed);
    
      // Move the paddle towards the ball
      if (ball.y < computerPaddle.y + computerPaddle.height / 2) {
        computerPaddle.dy = -paddleSpeed;
      } else {
        computerPaddle.dy = paddleSpeed;
      }
    
      // Update the paddle position
      updatePaddle(computerPaddle);
    }
  }
  
  function updateBall() {
    const ball = gameState.ball;
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    
    if (!gameState.paused) {
      ball.x += ball.dx;
      ball.y += ball.dy;
  
      // Check collision with top wall
      if (ball.y - ballRadius < 0) {
        ball.dy = Math.abs(ball.dy); // Reverse the ball's dy direction
        ball.y = ballRadius;
      }
  
      // Check collision with bottom wall
      if (ball.y + ballRadius > canvasHeight) {
        ball.dy = -Math.abs(ball.dy); // Reverse the ball's dy direction
        ball.y = canvasHeight - ballRadius;
      }
  
      // Check collision with left wall
      if (ball.x - ballRadius < 0) {
        gameState.player2.score++; // Increase player 2 score by 1
        resetBall();
        return;
      }
  
      // Check collision with right wall
      if (ball.x + ballRadius > canvasWidth) {
        gameState.player1.score++; // Increase player 1 score by 1
        resetBall();
        return;
      }
    }
  }
  
  // Check for collision with paddles
  function checkPaddleCollision() {
    const ball = gameState.ball;
    const player1 = gameState.player1;
    const player2 = gameState.player2;
  
    // Check collision with player 1 paddle
    if (
      ball.x - ballRadius < player1.paddle.x + player1.paddle.width &&
      ball.y + ballRadius > player1.paddle.y &&
      ball.y - ballRadius < player1.paddle.y + player1.paddle.height
    ) {
      ball.dx *= -1;
      ball.x = player1.paddle.x + player1.paddle.width + ballRadius;
    }
  
    // Check collision with player 2 paddle
    if (
      ball.x + ballRadius > player2.paddle.x &&
      ball.y + ballRadius > player2.paddle.y &&
      ball.y - ballRadius < player2.paddle.y + player2.paddle.height
    ) {
      ball.dx *= -1;
      ball.x = player2.paddle.x - ballRadius;
    }
  }
  
  // Reset the ball position
  function resetBall() {
    const ball = gameState.ball;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }
  
// Check game duration
function checkGameDuration() {
  if (!gameState.startTime) {
    gameState.startTime = new Date().getTime();
  }

  if (!gameState.paused) {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - gameState.startTime) / 1000;

    if (elapsedTime >= GAME_DURATION) {
      endGame(); // Call endGame() when the time is up
    } else if (elapsedTime < 0) {
      gameState.gameOver = true;
      endGame();
    }
  }
}

  
// End the game
function endGame() {
  gameState.gameOver = true;
  clearInterval(timerInterval);
  clearInterval(gameLoopInterval);
  if (localStorage.getItem("gameMode") === "computer") {
    gameState.player2.name = "computer";
  }

  // Determine the winner based on the scores
  let winner = "";
  if (gameState.player1.score > gameState.player2.score) {
    winner = gameState.player1.name;
  } else if (gameState.player2.score > gameState.player1.score) {
    winner = gameState.player2.name;
  } else {
    winner = "It's a tie";
  }

  // Update the total winnings for the winner
  updateTotalWinnings(winner);

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  
    // Draw "Game Over!" and the winner on the canvas
    drawText("Game Over!", canvas.width / 2, canvas.height / 2 - 20, "center", "#000", "bold 36px Arial");
    drawText(`${winner} wins!`, canvas.width / 2, canvas.height / 2 + 20, "center", "#000", "24px Arial");
  }
  

// Function to draw text on the canvas
  function drawText(text, x, y, align, color, font) {
    context.fillStyle = color;
    context.font = font;
    context.textAlign = align;
    context.fillText(text, x, y);
  }
  
function updateTotalWinnings(playerName) {
  // Get the existing total winnings from local storage
  let totalWinnings = JSON.parse(localStorage.getItem("totalWinnings")) || {};

  // Update the total winnings for the player
  if (typeof totalWinnings[playerName] === "number") {
    totalWinnings[playerName]++;
  } else {
    totalWinnings[playerName] = 1;
  }

  // Save the updated total winnings to local storage
  localStorage.setItem("totalWinnings", JSON.stringify(totalWinnings));
}

  // Draw the paddle
  function drawPaddle(paddle, color) {
    context.fillStyle = color;
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }
  
  // Draw the computer paddle
  function drawComputerPaddle() {
    const computerPaddle = gameState.player2.paddle;
    drawPaddle(computerPaddle, gameState.player2.color);
  }
  
  // Draw the ball
  function drawBall(x, y) {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#000";
    context.fill();
    context.closePath();
  }
  
// Draw the scores
function drawScores() {
  const player1 = gameState.player1;
  const player2 = gameState.player2;

  context.font = "24px Arial";
  context.fillStyle = player1.color;
  context.fillText(`${player1.name}: ${player1.score}`, canvas.width / 2 - 120, 30);
  if (localStorage.getItem("gameMode") === "computer") {
    player2.name="computer"
  }
  context.fillStyle = player2.color;
  context.fillText(`${player2.name}: ${player2.score}`, canvas.width / 2 + 20, 30);
  
}

  // Draw the game timer
  function drawTimer() {
    if (!gameState.paused && !gameState.gameOver) {
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - gameState.startTime) / 1000;
      const remainingTime = GAME_DURATION - elapsedTime;
  
      const minutes = Math.floor(remainingTime / 60);
      const seconds = Math.floor(remainingTime % 60);
  
      const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
  
      context.font = "24px Arial";
      context.fillStyle = "#000";
      context.fillText(formattedTime, canvas.width / 2 - 30, canvas.height - 30);
    }
  }
  
  
 // Handle keydown events
function handleKeyDown(event) {
  const player1 = gameState.player1;
  const player2 = gameState.player2;

  if (event.code === player1.upKey) {
    player1.paddle.dy = -PADDLE_SPEED;
  } else if (event.code === player1.downKey) {
    player1.paddle.dy = PADDLE_SPEED;
  } else if (event.code === player2.upKey) {
    player2.paddle.dy = -PADDLE_SPEED;
  } else if (event.code === player2.downKey) {
    player2.paddle.dy = PADDLE_SPEED;
  }
}
  // Handle keyup events
function handleKeyUp(event) {

  const player1 = gameState.player1;
  const player2 = gameState.player2;

  if (
    event.code === player1.upKey ||
    event.code === player1.downKey
  ) {
    player1.paddle.dy = 0;
  } else if (
    event.code === player2.upKey ||
    event.code === player2.downKey
  ) {
    player2.paddle.dy = 0;
  }
}

function restartGame() {
  if (gameState.paused) {
    togglePause(); // Resume the game if paused
  }

  // Reset player scores
  gameState.player1.score = 0;
  gameState.player2.score = 0;

  // Reset paddles
  gameState.player1.paddle.y = canvas.height / 2 - paddleHeight / 2;
  gameState.player2.paddle.y = canvas.height / 2 - paddleHeight / 2;

  // Reset ball
  resetBall();

  // Clear intervals
  clearInterval(gameLoopInterval);
  clearInterval(timerInterval);
  gameState.gameOver = false;
  gameState.startTime = null;
  // Start the game loop
  startGameLoop();
}

// Handle restart button click
restartButton.addEventListener("click", restartGame);

function startGame() {
  if (gameState.gameOver) {
    restartGame(); // Restart the game if it's over
  }
  canvas.width=800;
  canvas.height=400;
  // Display "Ready" for 1 second
  drawText("Ready", canvas.width / 2, canvas.height / 2, "center", "#fff", "bold 64px Arial");
  setTimeout(() => {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Display "Steady" for 1 second
    drawText("Steady", canvas.width / 2, canvas.height / 2, "center", "#fff", "bold 64px Arial");
    setTimeout(() => {
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Display "Go" for 1 second
      drawText("Go", canvas.width / 2, canvas.height / 2, "center", "#fff", "bold 64px Arial");
      setTimeout(() => {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        initializeGame()
        // Start the game loop
        startGameLoop();
      }, 1000);
    }, 1000);
  }, 1000);
}

// Toggle the pause state
function togglePause() {
  gameState.paused = !gameState.paused;

  if (gameState.paused) {
    clearInterval(timerInterval);
    gameState.pausedTime = new Date().getTime();
    pauseButton.textContent = "Resume";
  } else {
    gameState.startTime += new Date().getTime() - gameState.pausedTime;
    timerInterval = setInterval(checkGameDuration, 1000);
    pauseButton.textContent = "Pause";
  }
}

document.getElementById("pauseButton").addEventListener("click", togglePause);
document.getElementById("mainMenuButton").addEventListener("click", MainMenu);

function MainMenu(){
  window.location.href = "index.html";
}


// Update prediction paragraph
function updatePrediction() {
  const player1 = gameState.player1;
  const player2 = gameState.player2;
  const totalScore = player1.score + player2.score;

  let prediction = "";
  if (localStorage.getItem("gameMode") === "computer") {

  gameState.player2.name = "computer" 
    // Player vs Computer prediction
    const player1Prediction = (player1.score + 1) / (player1.score + player2.score + 2) * 100;
    const player2Prediction = (player2.score + 1) / (player1.score + player2.score + 2) * 100;

    prediction = `${player1.name} chance of winning: ${player1Prediction}% && Computer chance of winning: ${player2Prediction}%`;
  } else {
    // Player vs Player prediction
    const player1Prediction = (player1.score + 1) / (player1.score + player2.score + 2) * 100;
    const player2Prediction = (player2.score + 1) / (player1.score + player2.score + 2) * 100;
    prediction = `${player1.name} chance of winning: ${player1Prediction}% && ${player2.name} chance of winning: ${player2Prediction}%`;
  }

  // Update the prediction paragraph in HTML
  const predictionParagraph = document.getElementById("prediction");
  predictionParagraph.textContent = prediction;
}

  // Initialize the game
  startGame();