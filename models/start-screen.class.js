class StartScreen {
    isHoveringStart = false;
    gameStarted = false;

    /**
     * Initializes start screen UI, icons, events and render loop
     */
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
        canvas.addEventListener("mousemove", (e) => this.handleMove(e));
        canvas.addEventListener("mouseleave", () => {
            this.canvas.style.cursor = "default";
        });

        document.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement) {
                this.resizeCanvasToFullscreen();
            } else {
                this.resetCanvasSize();
            }
            this.draw();
        });

        this.loadAllImages([
            this.img,
            this.iconInfo,
            this.iconMute,
            this.iconVolume,
            this.iconFullscreen
        ], () => this.draw());

        this.loop = setInterval(() => {
            this.draw();
        }, 1000 / 60);
    }

    /**
    * Stops the start screen render loop
    */
    stop() {
        clearInterval(this.loop);
    }

    /**
    * Toggles fullscreen mode for the canvas
    */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    resizeCanvasToFullscreen() {
        const baseW = 720;
        const baseH = 480;

        const scale = Math.min(
            window.innerWidth / baseW,
            window.innerHeight / baseH
        );

        const width = Math.floor(baseW * scale);
        const height = Math.floor(baseH * scale);

        this.canvas.width = baseW;
        this.canvas.height = baseH;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
    }

    resetCanvasSize() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = "720px";
        this.canvas.style.height = "480px";
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
        const size = 48;
        this.ctx.drawImage(img, x, y, size, size);
    }

    /**
    * Returns scaled rectangle for the start button text
    */
    getStartTextRect() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        const textWidth = 360 * (w / 720);
        const textHeight = 80 * (h / 480);

        const x = (w - textWidth) / 2;
        const y = 90 * (h / 480) - textHeight / 2;

        return { x, y, width: textWidth, height: textHeight };
    }

    /**
  * Draws background, UI icons, popup and start text
  */
    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.clearRect(0, 0, w, h);

        this.drawBackground(w, h);

        const rect = this.getStartTextRect();
        this.drawStartText(rect.x + rect.width / 2, rect.y + rect.height * 0.7);

        if (this.showInfoPopup) {
            const { px, py, pw, ph } = this.getPopupRect();
            this.ui.drawPopup(px, py, pw, ph);
        }

        this.drawUI(w);
    }

    drawBackground(w, h) {
        this.ctx.drawImage(this.img, 0, 0, w, h);
    }

    /**
   * Draws info, sound and fullscreen icons
   */
    drawUI(w) {
        this.drawIcon(this.iconInfo, 20, 20);
        this.drawIcon(this.isMuted ? this.iconMute : this.iconVolume, w - 140, 20);
        this.drawIcon(this.iconFullscreen, w - 70, 20);
    }

    /**
    * Draws the start button text with hover styling
    */
    drawStartText(x, y) {
        const ctx = this.ctx;
        const text = this.getStartText();

        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.lineWidth = this.isHoveringStart ? 6 : 3;
        ctx.strokeStyle = "#8b3a00";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = "#ffcc33";
        ctx.fillText(text, x, y);
    }

    getStartText() {
        return window.innerWidth < 910 ? "START" : "START GAME";
    }

    toggleSound() {
        SOUND_ENABLED = !SOUND_ENABLED;
        this.isMuted = !SOUND_ENABLED;
        this.draw();
    }

    /**
   * Returns popup rectangle centered on screen
   */
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

    isHit(x, y, bx, by, bw = 48, bh = 48) {
        return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    }

    /**
     * Updates hover state for the start button
     */
    handleMove(e) {
        const { x, y } = this.getScaledPos(e);
        const w = this.canvas.width;

        const start = this.getStartTextRect();

        const overStart =
            x >= start.x && x <= start.x + start.width &&
            y >= start.y && y <= start.y + start.height;

        const overInfo = this.isHit(x, y, 20, 20);
        const overSound = this.isHit(x, y, w - 140, 20);
        const overFullscreen = this.isHit(x, y, w - 70, 20);

        this.isHoveringStart = overStart;

        const isClickable =
            overStart ||
            overInfo ||
            overSound ||
            overFullscreen ||
            this.showInfoPopup;

        this.canvas.style.cursor = isClickable ? "pointer" : "default";
    }

    /**
     * Handles clicks on icons, popup and start button
     */
    handleClick(e) {
        const { x, y } = this.getScaledPos(e);
        const w = this.canvas.width;

        if (this.handlePopupClick(x, y)) return;
        if (this.handleIconClick(x, y, w)) return;
        if (this.handleStartClick(x, y)) return;
    }

    handlePopupClick(x, y) {
        if (this.showInfoPopup) {
            this.showInfoPopup = false;
            this.draw();
            return true;
        }

        if (this.isHit(x, y, 20, 20)) {
            this.showInfoPopup = true;
            this.draw();
            return true;
        }

        return false;
    }

    handleIconClick(x, y, w) {
        if (this.isHit(x, y, w - 140, 20)) {
            this.toggleSound();
            return true;
        }

        if (this.isHit(x, y, w - 70, 20)) {
            this.toggleFullscreen();
            return true;
        }

        return false;
    }

    handleStartClick(x, y) {
        const b = this.getStartTextRect();

        const inside =
            x >= b.x && x <= b.x + b.width &&
            y >= b.y && y <= b.y + b.height;

        if (!inside) return false;

        if (!gameStarted) {
            gameStarted = true;
            startGame();
        }

        return true;
    }

    getScaledPos(e) {
        const rect = this.canvas.getBoundingClientRect();

        const baseW = 720;
        const baseH = 480;

        const scaleX = rect.width / baseW;
        const scaleY = rect.height / baseH;
        const scale = Math.min(scaleX, scaleY);

        const offsetX = (rect.width - baseW * scale) / 2;
        const offsetY = (rect.height - baseH * scale) / 2;

        return {
            x: (e.clientX - rect.left - offsetX) / scale,
            y: (e.clientY - rect.top - offsetY) / scale
        };
    }
}
