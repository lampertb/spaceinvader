class Bullet {
    constructor(x, y, isPlayer) {
        this.x = x;
        this.y = y;
        this.isPlayer = isPlayer;
        this.speed = isPlayer ? -8 : 4; // Negative speed for player bullets (moving up)
        this.width = 2;
        this.height = 8;
        this.active = true;
    }

    update() {
        this.y += this.speed;
        
        // Deactivate bullets that go off screen
        if (this.isPlayer && this.y < 0) {
            this.active = false;
        } else if (!this.isPlayer && this.y > 600) {
            this.active = false;
        }
    }

    draw(renderer) {
        if (this.active) {
            renderer.drawBullet(this.x, this.y, this.isPlayer);
        }
    }

    collidesWith(object) {
        if (!this.active) return false;

        // Simple rectangle collision detection
        return this.x < object.x + object.width &&
               this.x + this.width > object.x &&
               this.y < object.y + object.height &&
               this.y + this.height > object.y;
    }
}
