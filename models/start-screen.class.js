class StartScreen {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ui = new UI(this.ctx, this.canvas);

        this.img = this.loadImage('assets/img/9_intro_outro_screens/start/startscreen_1.png');
        this.iconInfo = this.loadImage('assets/icon/info.png');
        this.iconMute = this.loadImage('assets/icon/mute.png');
        this.iconVolume = this.loadImage('assets/icon/volume.png');
        this.iconFullscreen = this.loadImage('assets/icon/fullscreen.png');

        this.isMuted = !SOUND_ENABLED;
        this.showInfoPopup = false;

        canvas.addEventListener("click", (e) => this.handleClick(e));

        this.loadAllImages([
            this.img,
            this.iconInfo,
            this.iconMute,
            this.iconVolume,
            this.iconFullscreen
        ], () => this.draw());
    }

    loadImage(path) {
        const img = new Image();
        img.src = path;
        return img;
    }

    loadAllImages(images, callback) {
        let loaded = 0;
        images.forEach(img => {
            img.onload = () => {
                loaded++;
                if (loaded === images.length) callback();
            };
        });
    }

    drawIcon(img, x, y) {
        const targetSize = 32;
        const scale = targetSize / Math.max(img.width, img.height);
        this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.drawBackground(w, h);
        this.drawUI(w);

        if (this.showInfoPopup) {
            const { px, py, pw, ph } = this.getPopupRect();
            this.ui.drawPopup(px, py, pw, ph);
        }
    }

    drawBackground(w, h) {
        this.ctx.drawImage(this.img, 0, 0, w, h);
        this.drawStartText(w / 2, 90);
    }

    drawUI(w) {
        this.drawIcon(this.iconInfo, 20, 20);
        this.drawIcon(this.isMuted ? this.iconMute : this.iconVolume, w - 120, 20);
        this.drawIcon(this.iconFullscreen, w - 60, 20);
    }

    drawStartText(x, y) {
        const ctx = this.ctx;
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#8b3a00";
        ctx.strokeText("START GAME", x, y);
        ctx.fillStyle = "#ffcc33";
        ctx.fillText("START GAME", x, y);
    }

    toggleSound() {
        SOUND_ENABLED = !SOUND_ENABLED;
        this.isMuted = !SOUND_ENABLED;
        this.draw();
    }

    getPopupRect() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        return {
            pw: 460,
            ph: 280,
            px: (w - 460) / 2,
            py: (h - 280) / 2
        };
    }

    isHit(x, y, bx, by, bw = 32, bh = 32) {
        return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = this.canvas.width;

        if (this.showInfoPopup) {
            this.showInfoPopup = false;
            return this.draw();
        }

        if (this.isHit(x, y, 20, 20)) {
            this.showInfoPopup = true;
            return this.draw();
        }

        if (this.isHit(x, y, w - 120, 20)) {
            return this.toggleSound();
        }
    }
}
