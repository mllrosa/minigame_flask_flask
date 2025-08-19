const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;

let player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    velocityY: 0,
    jumpForce: -12,
    gravity: 0.6,
    grounded: false
};

let platforms = [
    { x: 0, y: 350, width: 800, height: 50 }
];

let obstacles = [];

let keys = {};
document.addEventListener("keydown", e => {
    if (gameOver) {
        resetGame();
    } else {
        keys[e.key] = true;
    }
});
document.addEventListener("keyup", e => {
    if (!gameOver) {
        keys[e.key] = false;
    }
});

// Desenha jogador gatinho
function drawPlayer() {
    const px = player.x;
    const py = player.y;
    const w = player.width;
    const h = player.height;

    // Corpo (círculo rosa claro)
    ctx.fillStyle = "#FFC0CB";
    ctx.beginPath();
    ctx.ellipse(px + w/2, py + h/2, w/2, h/2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Orelhas (triângulos rosa forte)
    ctx.fillStyle = "#FF69B4";
    ctx.beginPath();
    ctx.moveTo(px + w * 0.2, py + h * 0.1);
    ctx.lineTo(px + w * 0.4, py - h * 0.3);
    ctx.lineTo(px + w * 0.6, py + h * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(px + w * 0.8, py + h * 0.1);
    ctx.lineTo(px + w * 0.6, py - h * 0.3);
    ctx.lineTo(px + w * 0.4, py + h * 0.1);
    ctx.closePath();
    ctx.fill();

    // Olhos brancos
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(px + w * 0.35, py + h * 0.45, w * 0.1, h * 0.15, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + w * 0.65, py + h * 0.45, w * 0.1, h * 0.15, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Pupilas pretas
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(px + w * 0.35, py + h * 0.45, w * 0.05, h * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + w * 0.65, py + h * 0.45, w * 0.05, h * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Bigodes rosas (linhas)
    ctx.strokeStyle = "#FF69B4";
    ctx.lineWidth = 2;

    // Bigodes esquerdos
    ctx.beginPath();
    ctx.moveTo(px + w * 0.15, py + h * 0.6);
    ctx.lineTo(px + w * 0.4, py + h * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + w * 0.15, py + h * 0.7);
    ctx.lineTo(px + w * 0.4, py + h * 0.7);
    ctx.stroke();

    // Bigodes direitos
    ctx.beginPath();
    ctx.moveTo(px + w * 0.6, py + h * 0.6);
    ctx.lineTo(px + w * 0.85, py + h * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + w * 0.6, py + h * 0.7);
    ctx.lineTo(px + w * 0.85, py + h * 0.7);
    ctx.stroke();
}

// Desenha obstáculo tipo ratinho
function drawObstacle(obs) {
    // Corpo cinza claro
    ctx.fillStyle = "#B0B0B0";
    ctx.beginPath();
    ctx.ellipse(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, obs.height/2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Orelhas rosa
    ctx.fillStyle = "#FFC0CB";
    ctx.beginPath();
    ctx.moveTo(obs.x + obs.width * 0.3, obs.y + obs.height * 0.3);
    ctx.lineTo(obs.x + obs.width * 0.4, obs.y + obs.height * 0.1);
    ctx.lineTo(obs.x + obs.width * 0.5, obs.y + obs.height * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(obs.x + obs.width * 0.5, obs.y + obs.height * 0.3);
    ctx.lineTo(obs.x + obs.width * 0.6, obs.y + obs.height * 0.1);
    ctx.lineTo(obs.x + obs.width * 0.7, obs.y + obs.height * 0.3);
    ctx.closePath();
    ctx.fill();

    // Olhos pretos pequenos
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(obs.x + obs.width * 0.4, obs.y + obs.height * 0.45, obs.width * 0.07, obs.height * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(obs.x + obs.width * 0.6, obs.y + obs.height * 0.45, obs.width * 0.07, obs.height * 0.1, 0, 0, 2 * Math.PI);
    ctx.fill();
}

function createObstacle() {
    let height = 20 + Math.random() * 30;
    let width = 20 + Math.random() * 30;
    let y = 350 - height;
    obstacles.push({ x: canvas.width, y: y, width: width, height: height, speed: 4 + Math.random() * 2 });
}

function update() {
    if(gameOver) return;

    // Movimento lateral
    if (keys["ArrowRight"] || keys["d"]) player.x += 4;
    if (keys["ArrowLeft"] || keys["a"]) player.x -= 4;

    // Pular
    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.grounded) {
        player.velocityY = player.jumpForce;
        player.grounded = false;
    }

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Limites da tela
    if(player.x < 0) player.x = 0;
    if(player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Colisão com plataforma
    player.grounded = false;
    platforms.forEach(p => {
        if (player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y) {
            if (player.velocityY > 0) {
                player.y = p.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        }
    });

    // Atualiza obstáculos
    obstacles.forEach((obs, index) => {
        obs.x -= obs.speed;
        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
        }

        // Colisão com jogador = game over
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            gameOver = true;
        }
    });

    // Criar obstáculos aleatórios
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        createObstacle();
        obstacleTimer = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Plataforma
    ctx.fillStyle = "#888";
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Jogador gatinho
    drawPlayer();

    // Obstáculos ratinhos
    obstacles.forEach(obs => {
        drawObstacle(obs);
    });

    if(gameOver){
        ctx.fillStyle = "black";
        ctx.font = "48px Comic Sans MS, cursive";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
        ctx.font = "24px Comic Sans MS, cursive";
        ctx.fillText("Pressione qualquer tecla para jogar novamente", canvas.width/2, canvas.height/2 + 40);
    }
}

// Variáveis para controle dos obstáculos
let obstacleTimer = 0;
const obstacleInterval = 90;

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    player.x = 50;
    player.y = 300;
    player.velocityY = 0;
    player.grounded = false;
    obstacles = [];
    obstacleTimer = 0;
    gameOver = false;
    gameLoop();
}

gameLoop();
