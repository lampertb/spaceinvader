class Player {
    constructor(canvas) {
        this.width = 30;
        this.height = 15;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.speed = 5;
        this.lives = 3;
        this.canShoot = true;
        this.shootCooldown = 250; // milliseconds
        this.active = true;
        this.invulnerable = false;
        this.invulnerabilityTime = 2000; // 2 seconds
        this.blinkInterval = 100; // milliseconds
        this.visible = true;
    }

    moveLeft() {
        this.x = Math.max(15, this.x - this.speed);
    }

    moveRight(canvas) {
        this.x = Math.min(canvas.width - 15, this.x + this.speed);
    }

    shoot() {
        if (!this.canShoot || !this.active) return null;
        
        this.canShoot = false;
        setTimeout(() => {
            this.canShoot = true;
        }, this.shootCooldown);
        
        return new Bullet(this.x, this.y, true);
    }

    hit() {
        if (this.invulnerable || !this.active) return false;
        
        this.lives--;
        if (this.lives <= 0) {
            this.active = false;
            return true;
        }

        // Make player invulnerable and blink
        this.invulnerable = true;
        const blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, this.blinkInterval);

        setTimeout(() => {
            this.invulnerable = false;
            this.visible = true;
            clearInterval(blinkInterval);
        }, this.invulnerabilityTime);

        return false;
    }

    draw(renderer) {
        if (this.active && this.visible) {
            renderer.drawPlayer(this.x, this.y);
        }
    }

    collidesWith(bullet) {
        if (!bullet.active || this.invulnerable || !this.active) return false;

        return bullet.x < this.x + this.width &&
               bullet.x + bullet.width > this.x - this.width &&
               bullet.y < this.y + this.height &&
               bullet.y + bullet.height > this.y - this.height;
    }

    reset(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.lives = 3;
        this.active = true;
        this.invulnerable = false;
        this.visible = true;
        this.canShoot = true;
    }
}
