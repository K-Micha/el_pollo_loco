class LifeBarBoss extends DrawableObject {
    percentage = 100;

    constructor(boss) {
        super();
        this.boss = boss;
        this.world = boss.world;

        this.loadImages(Images.IMAGES_BOSS_LIFE);

        this.y = 10;
        this.width = this.getBarWidth();
        this.height = 60;

        this.setPercentage(100);
        this.updatePosition();
    }

    getBarWidth() {
        return window.innerWidth < 1060 ? 160 : 200;
    }

    getRightOffset() {
        return window.innerWidth < 1060 ? 8 : 20;
    }

    updatePosition() {
        if (!this.isBossVisible()) {
            this.x = -9999;
            return;
        }

        this.width = this.getBarWidth();

        const bossRight = this.boss.x + this.boss.width + 20;
        const fixedX = this.getFixedX();

        if (bossRight < fixedX) {
            this.x = bossRight;
        } else {
            this.x = fixedX;
        }
    }

    isBossVisible() {
        const bossScreenX = this.boss.x + this.world.camera_x;
        return (
            bossScreenX + this.boss.width >= 0 &&
            bossScreenX <= this.world.canvas.width
        );
    }

    getFixedX() {
        return -this.world.camera_x +
            this.world.canvas.width -
            this.width -
            this.getRightOffset();
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = Images.IMAGES_BOSS_LIFE[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        if (this.percentage > 0) return 0;
        return 0;
    }

    draw(ctx) {
        this.updatePosition();
        super.draw(ctx);
        this.drawText(ctx);
    }

    drawText(ctx) {
        ctx.font = "22px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = `${Math.round(this.percentage)}%`;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + 4.5;

        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.fillText(text, centerX, centerY);
        ctx.shadowBlur = 0;
    }
}