const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 10;

// Ball
const BALL_SIZE = 15;

// Player paddle (left)
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// AI paddle (right)
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
const AI_SPEED = 4;

// Ball
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function drawNet() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    for (let i = 0; i < HEIGHT; i += 20) {
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2, i);
        ctx.lineTo(WIDTH / 2, i + 10);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#eee";
    ctx.fillText(playerScore, WIDTH / 4, 40);
    ctx.fillText(aiScore, WIDTH * 3 / 4, 40);
}

function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function updateAI() {
    // AI tries to follow the ball, but not perfectly
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle within canvas
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT) {
        ballSpeedX *= -1;
        // Add "spin" based on paddle movement (optional)
        let hitPoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPoint * 0.05;
        ballX = PADDLE_MARGIN + PADDLE_WIDTH; // Prevent sticking
    }

    // Right paddle collision (AI)
    if (ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT) {
        ballSpeedX *= -1;
        let hitPoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPoint * 0.05;
        ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE; // Prevent sticking
    }

    // Scoring
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX > WIDTH) {
        playerScore++;
        resetBall();
    }
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Net
    drawNet();

    // Paddles
    drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0ff");
    drawRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f00");

    // Ball
    drawBall(ballX, ballY, BALL_SIZE, "#fff");

    // Score
    drawScore();
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();