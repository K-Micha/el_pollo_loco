class StartScreenFullscreen {
    /**
    * Creates fullscreen helper for the start screen.
    */
    constructor(screen) {
        this.screen = screen;
        this.canvas = screen.canvas;
    }

    /**
    * Toggles fullscreen mode.
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
    * Returns true if fullscreen is active.
    * @returns {boolean}
    */
    isFullscreen() {
        return document.fullscreenElement || document.webkitFullscreenElement;
    }

    /**
    * Enters fullscreen mode.
    */
    async enterFullscreen() {
        if (this.canvas.requestFullscreen) {
            await this.canvas.requestFullscreen({ navigationUI: "hide" });
        } else if (this.canvas.webkitRequestFullscreen) {
            this.canvas.webkitRequestFullscreen();
        }

        this.lockOrientation();
    }

    /**
    * Exits fullscreen mode.
    */
    async exitFullscreen() {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    /**
    * Locks orientation to landscape if supported.
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
    * Handles fullscreen change updates.
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

        this.screen.renderer.draw();
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

        this.screen.renderer.draw();
    }

    /**
    * Resizes canvas to fullscreen dimensions.
    */
    resizeCanvasToFullscreen() {
        const { width, height } = this.getFullscreenCanvasSize();

        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
    }

    /**
    * Returns scaled fullscreen canvas size.
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
    * Resets canvas to default size.
    */
    resetCanvasSize() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.style.width = "720px";
        this.canvas.style.height = "480px";
    }
}