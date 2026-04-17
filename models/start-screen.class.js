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

        this.renderer = new StartScreenRenderer(this);

        this.initImages();
        this.initState();
        this.initBindings();
        this.registerEvents();
        this.startRenderLoop();
    }

    /**
    * Loads all start screen images.
    */
    initImages() {
        this.img = this.loadImage('assets/img/9_intro_outro_screens/start/startscreen_1.png');
        this.iconInfo = this.loadImage('assets/icon/info.png');
        this.iconMute = this.loadImage('assets/icon/mute.png');
        this.iconVolume = this.loadImage('assets/icon/volume.png');
        this.iconFullscreen = this.loadImage('assets/icon/fullscreen.png');

        this.loadAllImages([
            this.img,
            this.iconInfo,
            this.iconMute,
            this.iconVolume,
            this.iconFullscreen
        ], () => this.renderer.draw());
    }

    /**
    * Initializes start screen state.
    */
    initState() {
        this.isMuted = !SOUND_ENABLED;
        this.showInfoPopup = false;
    }

    /**
    * Initializes bound handlers.
    */
    initBindings() {
        this.boundClick = (e) => this.handleClick(e);
        this.boundMove = (e) => this.handleMove(e);
        this.boundLeave = () => this.resetCursor();
        this.boundFullscreenChange = () => this.handleFullscreenChange();
        this.boundFullscreenResize = () => this.handleFullscreenResize();
    }

    /**
    * Registers all screen events.
    */
    registerEvents() {
        this.canvas.addEventListener("click", this.boundClick);
        this.canvas.addEventListener("mousemove", this.boundMove);
        this.canvas.addEventListener("mouseleave", this.boundLeave);
        this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e), { passive: false });

        document.addEventListener("fullscreenchange", this.boundFullscreenChange);
        document.addEventListener("webkitfullscreenchange", this.boundFullscreenChange);
        document.addEventListener("fullscreenchange", this.boundFullscreenResize);
    }

    /**
    * Starts the render loop.
    */
    startRenderLoop() {
        this.loop = setInterval(() => {
            this.renderer.draw();
        }, 1000 / 60);
    }

    /**
    * Returns scaled rectangle for the start button text.
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
    * Resets the canvas cursor.
    */
    resetCursor() {
        this.canvas.style.cursor = "default";
    }

    /**
    * Handles fullscreen resize updates.
    */
    handleFullscreenResize() {
        if (document.fullscreenElement) {
            this.resizeCanvasToFullscreen();
        } else {
            this.resetCanvasSize();
        }

        this.renderer.draw();
    }

    /**
    * Stops the start screen render loop
    */
    stop() {
        clearInterval(this.loop);

        this.canvas.removeEventListener("click", this.boundClick);
        this.canvas.removeEventListener("mousemove", this.boundMove);
        this.canvas.removeEventListener("mouseleave", this.boundLeave);

        document.removeEventListener("fullscreenchange", this.boundFullscreenChange);
        document.removeEventListener("webkitfullscreenchange", this.boundFullscreenChange);
        document.removeEventListener("fullscreenchange", this.boundFullscreenResize);
    }

    /**
    * Toggles fullscreen mode for the canvas
    */
    async toggleFullscreen() {
        try {
            if (this.isFullscreen()) {
                await this.exitFullscreen();
            } else {
                await this.enterFullscreen();
            }
        } catch (err) {
            console.log('fullscreen failed:', err);
        }
    }

    /**
    * Returns true if the game is currently in fullscreen mode.
    */
    isFullscreen() {
        return document.fullscreenElement || document.webkitFullscreenElement;
    }

    /**
    * Enters fullscreen mode and locks device orientation.
    */
    async enterFullscreen() {
        const elem = this.canvas;

        if (elem.requestFullscreen) {
            await elem.requestFullscreen({ navigationUI: "hide" });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }

        this.lockOrientation();
    }

    /**
    *  Exits fullscreen mode.
    */
    async exitFullscreen() {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    /**
    * Locks device orientation to landscape if supported.
    */
    async lockOrientation() {
        if (!screen.orientation?.lock) return;

        try {
            await screen.orientation.lock("landscape");
        } catch (e) {
            console.log("orientation lock failed");
        }
    }

    /**
    * Handles touch start and forwards it as a click event.
    */
    handleTouchStart(e) {
        if (e.cancelable) e.preventDefault();

        const touch = e.touches[0];
        if (!touch) return;

        this.handleClick({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }

    /**
    * Handles touch end and forwards it as a click event.
    */
    handleTouchEnd(e) {
        if (e.cancelable) e.preventDefault();
        if (e.changedTouches.length === 0) return;

        const touch = e.changedTouches[0];

        this.handleClick({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }

    /**
    * Handles fullscreen changes and updates canvas layout.
    */
    handleFullscreenChange() {
        const isFullscreen =
            document.fullscreenElement || document.webkitFullscreenElement;

        if (isFullscreen) {
            document.body.style.backgroundColor = '#000';
            this.resizeCanvasToFullscreen();
        } else {
            document.body.style.backgroundColor = '';
            this.resetCanvasSize();
        }

        this.renderer.draw();
    }

    /**
    * Resizes the canvas to match fullscreen dimensions.
    */
    resizeCanvasToFullscreen() {
        const { width, height } = this.getFullscreenCanvasSize();

        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
    }

    /**
    * Calculates scaled fullscreen canvas size.
    */
    getFullscreenCanvasSize() {
        const baseW = 720;
        const baseH = 480;

        const scale = Math.min(
            window.innerWidth / baseW,
            window.innerHeight / baseH
        );

        return {
            width: Math.floor(baseW * scale),
            height: Math.floor(baseH * scale)
        };
    }

    /**
    * Resets the canvas to its default size.
    */
    resetCanvasSize() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = "720px";
        this.canvas.style.height = "480px";
    }

    /**
    * Loads an image and returns the Image object.
    */
    loadImage(path) {
        const img = new Image();
        img.src = path;
        return img;
    }

    /**
    * Waits until all images are fully loaded, then runs the callback.
    */
    loadAllImages(images, callback) {
        let loaded = 0;
        images.forEach(img => {
            img.onload = () => {
                loaded++;
                if (loaded === images.length) callback();
            };
        });
    }

    /**
    * Toggles sound state and redraws the UI.
    */
    toggleSound() {
        SOUND_ENABLED = !SOUND_ENABLED;
        saveSoundState();
        this.isMuted = !SOUND_ENABLED;
        this.renderer.draw();
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

    /**
    * Returns true if the point is inside the given hitbox.
    */
    isHit(x, y, bx, by, bw = 48, bh = 48) {
        return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    }

    /**
    * Updates hover state for the start button
    */
    handleMove(e) {
        const pos = this.getScaledPos(e);
        this.updateHoverStates(pos);
        this.updateCursor();
    }

    /**
    * Updates hover states for all interactive UI elements.
    */
    updateHoverStates(pos) {
        const w = this.canvas.width;

        const start = this.getStartTextRect();
        this.isHoveringStart = this.isInside(pos, start);

        this.overInfo = this.isHit(pos.x, pos.y, 20, 20);
        this.overSound = this.isHit(pos.x, pos.y, w - 140, 20);
        this.overFullscreen = this.isHit(pos.x, pos.y, w - 70, 20);
    }

    /**
    * Updates the cursor based on current hover states.
    */
    updateCursor() {
        const clickable =
            this.isHoveringStart ||
            this.overInfo ||
            this.overSound ||
            this.overFullscreen ||
            this.showInfoPopup;

        this.canvas.style.cursor = clickable ? "pointer" : "default";
    }

    /**
    * Returns true if the position is inside the given rectangle.
    */
    isInside(pos, rect) {
        return (
            pos.x >= rect.x &&
            pos.x <= rect.x + rect.width &&
            pos.y >= rect.y &&
            pos.y <= rect.y + rect.height
        );
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

    /**
    * Handles clicks on the info popup and toggles its visibility.
    */
    handlePopupClick(x, y) {
        if (this.showInfoPopup) {
            this.showInfoPopup = false;
            this.renderer.draw();
            return true;
        }

        if (this.isHit(x, y, 20, 20)) {
            this.showInfoPopup = true;
            this.renderer.draw();
            return true;
        }

        return false;
    }

    /**
    * Handles clicks on sound and fullscreen icons.
    */
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

    /**
    * Handles clicks on the start button.
    */
    handleStartClick(x, y) {
        const rect = this.getStartTextRect();

        if (!this.isInsideStart(x, y, rect)) return false;

        this.startGameIfNeeded();
        return true;
    }

    /**
    *  Returns true if the point is inside the start button area.
    */
    isInsideStart(x, y, rect) {
        return (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );
    }

    /**
    *  Starts the game if it hasn't started yet.
    */
    startGameIfNeeded() {
        if (gameStarted) return;

        gameStarted = true;
        this.stop();
        startGame();
    }

    /**
    * Converts mouse/touch coordinates to scaled canvas coordinates.
    */
    getScaledPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const { scale, offsetX, offsetY } = this.getCanvasTransform(rect);

        return {
            x: (e.clientX - rect.left - offsetX) / scale,
            y: (e.clientY - rect.top - offsetY) / scale
        };
    }

    /**
    * Calculates canvas scale and offsets for responsive layout.
    */
    getCanvasTransform(rect) {
        const baseW = 720;
        const baseH = 480;

        const scaleX = rect.width / baseW;
        const scaleY = rect.height / baseH;
        const scale = Math.min(scaleX, scaleY);

        return {
            scale,
            offsetX: (rect.width - baseW * scale) / 2,
            offsetY: (rect.height - baseH * scale) / 2
        };
    }
}
