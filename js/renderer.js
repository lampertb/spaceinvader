class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawPlayer(x, y) {
        this.ctx.fillStyle = '#0f0';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - 15, y + 15);
        this.ctx.lineTo(x + 15, y + 15);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawAlien(x, y, frame) {
        this.ctx.fillStyle = '#f00';
        if (frame % 60 < 30) {
            // First animation frame
            this.ctx.fillRect(x - 10, y - 10, 20, 20);
            this.ctx.clearRect(x - 5, y - 5, 10, 10);
        } else {
            // Second animation frame
            this.ctx.fillRect(x - 15, y - 10, 30, 20);
            this.ctx.clearRect(x - 10, y - 5, 20, 10);
        }
    }

    drawBullet(x, y, isPlayer) {
        this.ctx.fillStyle = isPlayer ? '#0f0' : '#f00';
        this.ctx.fillRect(x - 1, y - 4, 2, 8);
    }

    drawText(text, x, y, size = '20px') {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${size} Arial`;
        this.ctx.fillText(text, x, y);
    }

    drawExplosion(x, y, frame) {
        const radius = Math.min(frame, 15);
        this.ctx.strokeStyle = '#ff0';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
}
