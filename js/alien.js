class Alien {
    constructor(x, y, row, col) {
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.width = 30;
        this.height = 20;
        this.speed = 1;
        this.direction = 1; // 1 for right, -1 for left
        this.active = true;
    }

    update(moveDown = false) {
        if (!this.active) return;

        if (moveDown) {
            this.y += 20;
        } else {
            this.x += this.speed * this.direction;
        }
    }

    draw(renderer, frame) {
        if (this.active) {
            renderer.drawAlien(this.x, this.y, frame);
        }
    }

    shouldMoveDown(canvas) {
        return (this.direction === 1 && this.x + this.width + this.speed > canvas.width - 20) ||
               (this.direction === -1 && this.x - this.speed < 20);
    }

    reverseDirection() {
        this.direction *= -1;
    }

    shoot() {
        if (!this.active) return null;
        
        // Random chance to shoot based on position
        if (Math.random() < 0.002) {
            return new Bullet(this.x, this.y + this.height, false);
        }
        return null;
    }

    collidesWith(bullet) {
        if (!this.active || !bullet.active) return false;

        return bullet.x < this.x + this.width &&
               bullet.x + bullet.width > this.x &&
               bullet.y < this.y + this.height &&
               bullet.y + bullet.height > this.y;
    }
}

class AlienGrid {
    constructor(renderer) {
        this.aliens = [];
        this.moveDownNext = false;
        this.speedIncrease = 1;
        this.initialize(renderer);
    }

    initialize(renderer) {
        const rows = 5;
        const cols = 11;
        const startX = (renderer.width - (cols * 40)) / 2;
        const startY = 50;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.aliens.push(new Alien(
                    startX + col * 40,
                    startY + row * 30,
                    row,
                    col
                ));
            }
        }
    }

    update(canvas) {
        let moveDown = false;

        if (this.moveDownNext) {
            moveDown = true;
            this.moveDownNext = false;
            this.aliens.forEach(alien => alien.reverseDirection());
            this.speedIncrease += 0.1;
        } else {
            // Check if any active alien should move down
            this.aliens.forEach(alien => {
                if (alien.active && alien.shouldMoveDown(canvas)) {
                    this.moveDownNext = true;
                }
            });
        }

        this.aliens.forEach(alien => {
            alien.speed = 1 * this.speedIncrease;
            alien.update(moveDown);
        });
    }

    draw(renderer, frame) {
        this.aliens.forEach(alien => alien.draw(renderer, frame));
    }

    shoot() {
        const bullets = [];
        this.aliens.forEach(alien => {
            const bullet = alien.shoot();
            if (bullet) bullets.push(bullet);
        });
        return bullets;
    }

    checkCollisions(bullet) {
        for (let alien of this.aliens) {
            if (alien.collidesWith(bullet)) {
                alien.active = false;
                bullet.active = false;
                return true;
            }
        }
        return false;
    }

    hasReachedBottom() {
        return this.aliens.some(alien => 
            alien.active && alien.y + alien.height >= 500
        );
    }

    allDestroyed() {
        return !this.aliens.some(alien => alien.active);
    }
}
