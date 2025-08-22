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

// Desenha jogador gatinho bordô (igual ao seu código original)
function drawPlayer() {
    const px = player.x;
    const py = player.y;
    const w = player.width;
    const h = player.height;

    // Corpo (círculo bordô escuro)
    ctx.fillStyle = "#6E1E1E";
    ctx.beginPath();
    ctx.ellipse(px + w/2, py + h/2, w/2, h/2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Orelhas (triângulos vermelho escuro)
    ctx.fillStyle = "#7B2626";
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

    // Bigodes bordô (linhas)
    ctx.strokeStyle = "#7B2626";
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

// Desenha obstáculo tipo cacto bordô
function drawObstacle(obs) {
    const px = obs.x;
    const py = obs.y;
    const w = obs.width;
    const h = obs.height;

    // Corpo do cacto (elipse vertical bordô)
    ctx.fillStyle = "#A85151";
    ctx.beginPath();
    ctx.ellipse(px + w / 2, py + h / 2, w / 3, h / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Braços do cacto (linhas curvas vermelho claro)
    ctx.strokeStyle = "#C67B7B";
    ctx.lineWidth = 3;

    // Braço esquerdo
    ctx.beginPath();
    ctx.moveTo(px + w / 3, py + h / 2);
    ctx.bezierCurveTo(px + w / 6, py + h / 2 - 15, px + w / 6, py + h / 2 + 15, px + w / 3, py + h / 2 + 30);
    ctx.stroke();

    // Braço direito
    ctx.beginPath();
    ctx.moveTo(px + 2 * w / 3, py + h / 2);
    ctx.bezierCurveTo(px + 5 * w / 6, py + h / 2 - 15, px + 5 * w / 6, py + h / 2 + 15, px + 2 * w / 3, py + h / 2 + 30);
    ctx.stroke();

    // Espinhos (pequenas linhas brancas)
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.5;
    for(let i = 0; i < 4; i++) {
        let x = px + w / 2;
        let y = py + h / 5 + i * 12;
        ctx.beginPath();
        ctx.moveTo(x - 7, y);
        ctx.lineTo(x + 7, y);
        ctx.stroke();
    }
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

    // Plataforma bordô escura
    ctx.fillStyle = "#7B2626"; 
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Jogador gatinho
    drawPlayer();

    // Obstáculos cactos
    obstacles.forEach(obs => {
        drawObstacle(obs);
    });

    if(gameOver){
        ctx.fillStyle = "#F0D9D9";
        ctx.font = "48px Comic Sans MS, cursive";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
        ctx.font = "24px Comic Sans MS, cursive";
        ctx.fillText("", canvas.width/2, canvas.height/2 + 40);
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
