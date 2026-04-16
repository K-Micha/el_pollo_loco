class LifeBarBoss extends DrawableObject {
    percentage = 100;

    /**
    * Initializes boss life bar and positions it relative to the world
    */
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

    /**
    * Returns bar width based on screen size.
    */
    getBarWidth() {
        return window.innerWidth < 1060 ? 160 : 200;
    }

    /**
    *  Returns right offset based on screen size.
    */
    getRightOffset() {
        return window.innerWidth < 1060 ? 10 : 20;
    }

    /**
    * Repositions the bar based on screen size and camera
    */
    updatePosition() {
        this.width = this.getBarWidth();
        this.x = this.world.baseWidth - this.width - this.getRightOffset();
    }

    /**
    * Checks if boss is currently visible on screen
    */
    isBossVisible() {
        const bossScreenX = this.boss.x + this.world.camera_x;

        return (
            bossScreenX + this.boss.width >= 0 &&
            bossScreenX <= this.world.baseWidth
        );
    }

    /**
    * Updates life percentage and selects correct image frame
    */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = Images.IMAGES_BOSS_LIFE[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
    *  Resolves the correct image index based on percentage.
    */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        if (this.percentage > 0) return 0;
        return 0;
    }

    /**
    * Draws the bar and its text if the boss is visible. 
    */
    draw(ctx) {
        if (!this.isBossVisible()) return;

        this.updatePosition();
        super.draw(ctx);
        this.drawText(ctx);
    }

    /**
    * Draws percentage text centered on the bar
    */
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