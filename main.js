// ==================== CONFIGURAÇÃO INICIAL ====================
// Seleciona o canvas e define o contexto de renderização 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ==================== ESTADO DO JOGO ====================
// Variáveis globais que controlam o estado atual do jogo
const gameState = {
    running: true,
    score: 0,
    wave: 1
};

// ==================== CONTROLE DE TECLADO (WASD/Setas) ====================
// Sistema de captura de teclas pressionadas
const keys = {
    left: false,
    right: false,
    space: false,
    spacePressed: false
};

// ==================== SISTEMA DE PARALAXE (2-3 CAMADAS) ====================
// Camadas de fundo que se movem em velocidades diferentes para criar profundidade
const parallaxLayers = [
    // Camada 1: Montanhas distantes (movimento lento)
    { x: 0, speed: 0.2, color: '#8b7355', elements: [] },
    // Camada 2: Montanhas médias (movimento médio)
    { x: 0, speed: 0.5, color: '#a0826d', elements: [] },
    // Camada 3: Cactos e rochas (movimento rápido)
    { x: 0, speed: 1, color: '#d4a574', elements: [] }
];

// Inicializar elementos do paralaxe
function initParallax() {
    // Cria montanhas distantes
    for (let i = 0; i < 4; i++) {
        parallaxLayers[0].elements.push({
            x: i * 300,
            y: 200,
            width: 250,
            height: 150
        });
    }
    
    // Cria montanhas médias
    for (let i = 0; i < 5; i++) {
        parallaxLayers[1].elements.push({
            x: i * 220,
            y: 250,
            width: 200,
            height: 120
        });
    }
    
    // Cria cactos no primeiro plano
    for (let i = 0; i < 8; i++) {
        parallaxLayers[2].elements.push({
            x: i * 150 + Math.random() * 50,
            y: 450,
            width: 30,
            height: 80,
            type: 'cactus'
        });
    }
}

// ==================== ESTRUTURA DE ENTIDADES ====================
// Entidade Jogador (Player)
const player = {
    x: 400,
    y: 450,
    width: 40,
    height: 60,
    speed: 5,
    health: 100,
    maxHealth: 100,
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 8,
    isMoving: false
};

// Arrays para armazenar diferentes tipos de entidades
const bullets = [];        // Balas do jogador
const enemies = [];        // Inimigos
const enemyBullets = [];   // Balas dos inimigos
const particles = [];      // Partículas de efeitos visuais

// ==================== CLASSE INIMIGO ====================
// Define o comportamento dos inimigos
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.speed = 1 + Math.random() * 2;
        this.health = 30;
        this.shootTimer = 0;
        this.shootDelay = 60 + Math.random() * 120;
        this.direction = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        // Movimento lateral do inimigo
        this.x += this.speed * this.direction;
        
        // Inverte direção nas bordas da tela
        if (this.x < 50 || this.x > canvas.width - 50) {
            this.direction *= -1;
        }

        // Sistema de disparo automático
        this.shootTimer++;
        if (this.shootTimer >= this.shootDelay) {
            this.shoot();
            this.shootTimer = 0;
            this.shootDelay = 60 + Math.random() * 120;
        }
    }

    shoot() {
        // Cria uma nova bala inimiga
        enemyBullets.push({
            x: this.x,
            y: this.y + 30,
            width: 6,
            height: 12,
            speed: 4,
            active: true
        });
    }

    draw() {
        // Desenha o inimigo (bandido)
        ctx.save();
        
        // Chapéu preto
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(this.x - 15, this.y, 30, 8);
        ctx.fillRect(this.x - 10, this.y - 10, 20, 10);
        
        // Cabeça
        ctx.fillStyle = '#c4a574';
        ctx.fillRect(this.x - 8, this.y + 8, 16, 16);
        
        // Corpo
        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(this.x - 10, this.y + 24, 20, 25);
        
        // Pernas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(this.x - 8, this.y + 49, 6, 15);
        ctx.fillRect(this.x + 2, this.y + 49, 6, 15);
        
        // Arma
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(this.x - 25, this.y + 30, 15, 5);
        
        // Barra de vida do inimigo
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - 20, this.y - 15, 40, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - 20, this.y - 15, 40 * (this.health / 30), 4);
        
        ctx.restore();
    }
}

// ==================== SISTEMA DE DISPARO ====================
// Função para o jogador atirar
function shootBullet() {
    if (!keys.spacePressed) {
        bullets.push({
            x: player.x,
            y: player.y + 20,
            width: 6,
            height: 12,
            speed: -8,
            active: true
        });
        keys.spacePressed = true;
        
        // Cria efeito visual de disparo
        createParticles(player.x + 10, player.y + 30, '#ffff00', 5);
    }
}

// Atualiza movimento de todas as balas
function updateBullets() {
    // Atualiza balas do jogador
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y += bullets[i].speed;
        
        // Remove balas que saíram da tela
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Atualiza balas dos inimigos
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        enemyBullets[i].y += enemyBullets[i].speed;
        
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
        }
    }
}

// Desenha todas as balas na tela
function drawBullets() {
    // Balas do jogador (amarelas)
    ctx.fillStyle = '#ffff00';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 3, bullet.y - 6, bullet.width, bullet.height);
    });

    // Balas dos inimigos (vermelhas)
    ctx.fillStyle = '#ff4444';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 3, bullet.y - 6, bullet.width, bullet.height);
    });
}

// ==================== SISTEMA DE COLISÃO AABB ====================
// AABB (Axis-Aligned Bounding Box) - Detecção de colisão por retângulos
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Processa todas as colisões do jogo
function handleCollisions() {
    // Colisão: Balas do jogador vs Inimigos
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                enemies[j].health -= 10;
                bullets.splice(i, 1);
                createParticles(enemies[j].x, enemies[j].y + 30, '#ff0000', 8);
                
                // Se inimigo morreu, remove e adiciona pontos
                if (enemies[j].health <= 0) {
                    gameState.score += 100;
                    createParticles(enemies[j].x, enemies[j].y + 30, '#ffff00', 15);
                    enemies.splice(j, 1);
                }
                break;
            }
        }
    }

    // Colisão: Balas dos inimigos vs Jogador
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (checkCollision(enemyBullets[i], player)) {
            player.health -= 10;
            enemyBullets.splice(i, 1);
            createParticles(player.x, player.y + 30, '#ff0000', 10);
            
            // Efeito visual de dano
            canvas.style.filter = 'brightness(1.5)';
            setTimeout(() => canvas.style.filter = 'brightness(1)', 100);
            
            // Verifica se jogador morreu
            if (player.health <= 0) {
                endGame();
            }
        }
    }
}

// ==================== SISTEMA DE PARTÍCULAS ====================
// Cria partículas para efeitos visuais
function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            color: color
        });
    }
}

// Atualiza movimento das partículas
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].life--;
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Desenha partículas com transparência baseada no tempo de vida
function drawParticles() {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;
}

// ==================== SISTEMA DE ONDAS ====================
// Cria novos inimigos baseado na onda atual
function spawnEnemies() {
    const enemyCount = 2 + gameState.wave;
    for (let i = 0; i < enemyCount; i++) {
        const x = 100 + (canvas.width - 200) * (i / enemyCount);
        enemies.push(new Enemy(x, 50 + Math.random() * 100));
    }
}

// ==================== RENDERIZAÇÃO ====================
// Desenha o fundo do jogo
function drawBackground() {
    // Gradient do céu
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(0.7, '#f4a460');
    gradient.addColorStop(1, '#d4a574');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sol
    ctx.fillStyle = '#ffdb4d';
    ctx.beginPath();
    ctx.arc(650, 100, 50, 0, Math.PI * 2);
    ctx.fill();
}

// Desenha as camadas de paralaxe
function drawParallax() {
    parallaxLayers.forEach((layer, index) => {
        ctx.fillStyle = layer.color;
        
        layer.elements.forEach(el => {
            const drawX = el.x - layer.x;
            
            if (index < 2) {
                // Desenha montanhas
                ctx.beginPath();
                ctx.moveTo(drawX, el.y + el.height);
                ctx.lineTo(drawX + el.width / 2, el.y);
                ctx.lineTo(drawX + el.width, el.y + el.height);
                ctx.closePath();
                ctx.fill();
            } else if (el.type === 'cactus') {
                // Desenha cacto
                ctx.fillRect(drawX + 10, el.y, 10, el.height);
                ctx.fillRect(drawX, el.y + 20, 10, 30);
                ctx.fillRect(drawX + 20, el.y + 25, 10, 25);
            }
        });
    });

    // Desenha o chão
    ctx.fillStyle = '#c4a574';
    ctx.fillRect(0, 520, canvas.width, 80);
}

// Atualiza movimento do paralaxe baseado no movimento do jogador
function updateParallax() {
    if (keys.left) {
        parallaxLayers.forEach(layer => {
            layer.x -= layer.speed;
            layer.elements.forEach(el => {
                if (el.x - layer.x < -300) {
                    el.x += 300 * layer.elements.length;
                }
            });
        });
    }
    if (keys.right) {
        parallaxLayers.forEach(layer => {
            layer.x += layer.speed;
            layer.elements.forEach(el => {
                if (el.x - layer.x > canvas.width + 300) {
                    el.x -= 300 * layer.elements.length;
                }
            });
        });
    }
}

// Desenha o jogador com animação simples
function drawPlayer() {
    // Sistema de animação por frames
    if (player.isMoving) {
        player.frameTimer++;
        if (player.frameTimer >= player.frameDelay) {
            player.frameTimer = 0;
            player.frameIndex = (player.frameIndex + 1) % 4;
        }
    } else {
        player.frameIndex = 0;
    }

    // Desenha o cowboy (representação simplificada)
    ctx.save();
    
    // Chapéu
    ctx.fillStyle = '#654321';
    ctx.fillRect(player.x - 15, player.y, 30, 8);
    ctx.fillRect(player.x - 10, player.y - 10, 20, 10);
    
    // Cabeça
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(player.x - 8, player.y + 8, 16, 16);
    
    // Corpo
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(player.x - 10, player.y + 24, 20, 25);
    
    // Pernas com animação
    const legOffset = Math.sin(player.frameIndex) * 3;
    ctx.fillStyle = '#4a2c1a';
    ctx.fillRect(player.x - 8, player.y + 49, 6, 15 + legOffset);
    ctx.fillRect(player.x + 2, player.y + 49, 6, 15 - legOffset);
    
    // Arma
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(player.x + 10, player.y + 30, 15, 5);
    
    ctx.restore();
}

// ==================== FUNÇÃO UPDATE() ====================
// Atualiza a lógica do jogo a cada frame
function update() {
    if (!gameState.running) return;

    // Atualiza movimento do jogador
    player.isMoving = false;
    if (keys.left && player.x > 20) {
        player.x -= player.speed;
        player.isMoving = true;
    }
    if (keys.right && player.x < canvas.width - 20) {
        player.x += player.speed;
        player.isMoving = true;
    }

    // Atualiza paralaxe baseado no movimento
    updateParallax();

    // Processa disparo
    if (keys.space) {
        shootBullet();
    }

    // Atualiza todas as entidades
    updateBullets();
    updateParticles();
    
    enemies.forEach(enemy => enemy.update());

    // Verifica todas as colisões
    handleCollisions();

    // Sistema de ondas - cria novos inimigos quando todos são derrotados
    if (enemies.length === 0) {
        gameState.wave++;
        setTimeout(() => spawnEnemies(), 2000);
    }

    // Atualiza interface do usuário (HUD)
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('health').textContent = Math.max(0, player.health);
}

// ==================== FUNÇÃO DRAW() ====================
// Renderiza todos os elementos visuais do jogo
function draw() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Renderiza camadas em ordem (fundo para frente)
    drawBackground();
    drawParallax();
    drawParticles();
    drawBullets();
    enemies.forEach(enemy => enemy.draw());
    drawPlayer();
}

// ==================== LOOP DE ANIMAÇÃO (requestAnimationFrame) ====================
// Loop principal do jogo - executa 60 FPS
function gameLoop() {
    update();  // Atualiza lógica
    draw();    // Renderiza gráficos
    requestAnimationFrame(gameLoop); // Agenda próximo frame
}

// ==================== EVENTOS DE TECLADO ====================
// Captura teclas pressionadas
window.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ') {
        e.preventDefault();
        keys.space = true;
    }
});

// Captura teclas soltas
window.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') {
        keys.space = false;
        keys.spacePressed = false;
    }
});

// ==================== CONTROLE DE GAME OVER ====================
function endGame() {
    gameState.running = false;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = `Sua pontuação: ${gameState.score} | Ondas: ${gameState.wave}`;
}

function restartGame() {
    // Reseta estado do jogo
    gameState.running = true;
    gameState.score = 0;
    gameState.wave = 1;
    
    // Reseta jogador
    player.health = 100;
    player.x = 400;
    player.y = 450;
    
    // Limpa todas as entidades
    bullets.length = 0;
    enemies.length = 0;
    enemyBullets.length = 0;
    particles.length = 0;
    
    document.getElementById('gameOver').style.display = 'none';
    
    spawnEnemies();
}

// ==================== INICIALIZAÇÃO ====================
// Inicia o jogo
initParallax();   // Configura camadas de paralaxe
spawnEnemies();   // Cria primeiros inimigos
gameLoop();       // Inicia loop principal