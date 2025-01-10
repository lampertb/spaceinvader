class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.audio = new AudioManager();
        this.player = new Player(this.canvas);
        this.alienGrid = new AlienGrid(this.renderer);
        this.bullets = [];
        this.explosions = [];
        this.score = 0;
        this.level = 1;
        this.gameState = 'start'; // start, playing, gameOver
        this.frame = 0;
        this.keys = {};
        
        this.setupInputHandlers();
        this.gameLoop();
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault(); // Prevent space from scrolling
            }

            if ((e.key === ' ' || e.key === 'Enter') && this.gameState !== 'playing') {
                this.startGame();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Start audio context on first user interaction
        window.addEventListener('click', () => {
            if (this.audio.audioContext.state === 'suspended') {
                this.audio.audioContext.resume();
            }
        }, { once: true });
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.level = 1;
        this.player.reset(this.canvas);
        this.alienGrid = new AlienGrid(this.renderer);
        this.bullets = [];
        this.explosions = [];
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.frame++;

        // Handle player movement
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.moveRight(this.canvas);
        }

        // Handle player shooting
        if (this.keys[' ']) {
            const bullet = this.player.shoot();
            if (bullet) {
                this.bullets.push(bullet);
                this.audio.playShoot();
            }
        }

        // Update aliens
        this.alienGrid.update(this.canvas);
        if (this.frame % 30 === 0) {
            this.audio.playInvaderMove();
        }

        // Alien shooting
        const alienBullets = this.alienGrid.shoot();
        this.bullets.push(...alienBullets);

        // Update bullets
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.active);

        // Update explosions
        this.explosions = this.explosions.filter(exp => exp.frame < 15);
        this.explosions.forEach(exp => exp.frame++);

        // Check collisions
        this.bullets.forEach(bullet => {
            if (bullet.isPlayer) {
                if (this.alienGrid.checkCollisions(bullet)) {
                    this.score += 100;
                    this.audio.playExplosion();
                    this.explosions.push({ x: bullet.x, y: bullet.y, frame: 0 });
                }
            } else if (this.player.collidesWith(bullet)) {
                bullet.active = false;
                if (this.player.hit()) {
                    this.gameOver();
                } else {
                    this.audio.playExplosion();
                }
            }
        });

        // Check win/lose conditions
        if (this.alienGrid.hasReachedBottom()) {
            this.gameOver();
        } else if (this.alienGrid.allDestroyed()) {
            this.nextLevel();
        }
    }

    draw() {
        this.renderer.clear();

        if (this.gameState === 'start') {
            this.renderer.drawText('SPACE INVADERS', this.canvas.width / 2 - 100, 200, '30px');
            this.renderer.drawText('Press ENTER or SPACE to Start', this.canvas.width / 2 - 150, 300);
            this.renderer.drawText('Use ← → or A D to move', this.canvas.width / 2 - 120, 350);
            this.renderer.drawText('SPACE to shoot', this.canvas.width / 2 - 70, 380);
            return;
        }

        this.player.draw(this.renderer);
        this.alienGrid.draw(this.renderer, this.frame);
        this.bullets.forEach(bullet => bullet.draw(this.renderer));
        this.explosions.forEach(exp => this.renderer.drawExplosion(exp.x, exp.y, exp.frame));

        // Draw HUD
        this.renderer.drawText(`Score: ${this.score}`, 20, 30);
        this.renderer.drawText(`Level: ${this.level}`, this.canvas.width - 100, 30);
        this.renderer.drawText(`Lives: ${this.player.lives}`, 20, this.canvas.height - 20);

        if (this.gameState === 'gameOver') {
            this.renderer.drawText('GAME OVER', this.canvas.width / 2 - 70, this.canvas.height / 2, '30px');
            this.renderer.drawText('Press ENTER or SPACE to Restart', this.canvas.width / 2 - 150, this.canvas.height / 2 + 50);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.audio.playGameOver();
    }

    nextLevel() {
        this.level++;
        this.alienGrid = new AlienGrid(this.renderer);
        this.alienGrid.speedIncrease = 1 + (this.level - 1) * 0.2;
        this.bullets = [];
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
