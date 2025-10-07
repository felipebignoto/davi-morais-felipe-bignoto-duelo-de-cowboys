// Seleciona o canvas e define o contexto de renderização
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variáveis globais
const keys = {};
const bullets = [];
const enemies = [];

// Imagens de fundo (paralaxe)
const bgLayers = [
  { image: createParallaxLayer("#add8e6", 0.2) }, // Céu
  { image: createParallaxLayer("#deb887", 0.5) }, // Montanhas
  { image: createParallaxLayer("#a0522d", 1) }    // Chão
];

// Cria camada de paralaxe com cor sólida
function createParallaxLayer(color, speed) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 800, 400);
  return { canvas, speed, x: 0 };
}

// Entidade base
class Entity {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  intersects(other) {
    // Colisão AABB (Axis-Aligned Bounding Box)
    return (
      this.x < other.x + other.w &&
      this.x + this.w > other.x &&
      this.y < other.y + other.h &&
      this.y + this.h > other.y
    );
  }
}

// Jogador
class Player extends Entity {
  constructor(x, y, color, controls) {
    super(x, y, 40, 60, color);
    this.controls = controls;
    this.speed = 2;
    this.canShoot = true;
  }

  update() {
    // Movimento horizontal
    if (keys[this.controls.left]) this.vx = -this.speed;
    else if (keys[this.controls.right]) this.vx = this.speed;
    else this.vx = 0;

    // Movimento vertical
    if (keys[this.controls.up]) this.vy = -this.speed;
    else if (keys[this.controls.down]) this.vy = this.speed;
    else this.vy = 0;

    this.x += this.vx;
    this.y += this.vy;

    // Disparo
    if (keys[this.controls.shoot] && this.canShoot) {
      bullets.push(new Bullet(this.x + this.w, this.y + this.h / 2, 5, 0));
      this.canShoot = false;
      setTimeout(() => (this.canShoot = true), 400);
    }

    // Limites de tela
    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));
    this.y = Math.max(0, Math.min(canvas.height - this.h, this.y));
  }
}

// Bala
class Bullet extends Entity {
  constructor(x, y, speed, direction) {
    super(x, y, 10, 4, "yellow");
    this.vx = speed;
  }

  update() {
    this.x += this.vx;
  }
}

// Inimigo
class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 40, 60, "red");
  }

  update() {
    // Aqui você pode adicionar IA ou patrulha simples
  }
}

// Instancia os jogadores
const player1 = new Player(100, 300, "blue", {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
  shoot: " "
});

const player2 = new Player(600, 300, "green", {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  shoot: "Enter"
});

// Cria inimigos fixos
enemies.push(new Enemy(700, 300));

// INPUT: controle de teclado
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// LOOP PRINCIPAL
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Atualiza estado do jogo
function update() {
  player1.update();
  player2.update();

  bullets.forEach((b, i) => {
    b.update();
    // Remove balas fora da tela
    if (b.x > canvas.width) bullets.splice(i, 1);

    // Checa colisão com inimigos
    enemies.forEach((enemy, ei) => {
      if (b.intersects(enemy)) {
        enemies.splice(ei, 1);
        bullets.splice(i, 1);
      }
    });
  });

  enemies.forEach(e => e.update());

  // Move o cenário de fundo (paralaxe)
  bgLayers.forEach(layer => {
    layer.image.x -= layer.image.speed;
    if (layer.image.x <= -canvas.width) layer.image.x = 0;
  });
}

// Desenha tudo na tela
function draw() {
  // Limpa a tela
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha camadas de fundo com paralaxe
  bgLayers.forEach(layer => {
    const { canvas: img, x } = layer.image;
    ctx.drawImage(img, x, 0);
    ctx.drawImage(img, x + canvas.width, 0); // Segunda imagem para loop contínuo
  });

  // Desenha entidades
  player1.draw();
  player2.draw();

  bullets.forEach(b => b.draw());
  enemies.forEach(e => e.draw());
}

// Inicia o jogo
gameLoop();