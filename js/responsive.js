class ResponsiveCanvas {
    /**
    * Initializes responsive scaling and rotation handling
    */
    constructor(canvas) {
        if (window.innerWidth >= 1060) return;

        this.canvas = canvas;
        this.baseWidth = 720;
        this.baseHeight = 480;

        this.initWrapper();
        this.initOverlay();
        this.update();

        window.addEventListener("resize", () => this.update());
        window.addEventListener("orientationchange", () => this.update());
    }

    /**
    * Wraps the canvas in a positioned container
    */
    initWrapper() {
        this.wrapper = document.createElement("div");
        Object.assign(this.wrapper.style, this.getWrapperStyles());

        const host = this.canvas.parentNode;
        host.insertBefore(this.wrapper, this.canvas);
        this.wrapper.appendChild(this.canvas);
    }

    /**
    * Creates and attaches the rotate‑overlay
    */
    initOverlay() {
        injectRotateStyles();
        this.overlay = createRotateOverlay();
        this.wrapper.appendChild(this.overlay);
    }

    /**
    * Returns wrapper CSS styles.
    */
    getWrapperStyles() {
        return {
            position: "relative",
            display: "block",
            lineHeight: "0",
            margin: "0 auto"
        };
    }

    /**
    * Recalculates canvas size and rotation state
    */
    getAvailableSize() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw < 1060;
        const isLandscape = vw > vh;

        let w = vw;
        let h = isLandscape ? vh : vh - 60;

        if (isMobile) {
            const pad = isLandscape ? 10 : 20;
            w -= pad;
            h -= pad;
        }
        return { w, h };
    }

    /**
    * Computes the scale factor based on available space.
    */
    computeScale(w, h) {
        return Math.min(
            w / this.baseWidth,
            h / this.baseHeight
        );
    }

    /**
    * Updates canvas size, scale and rotation state.
    */
    update() {
        const { w, h } = this.getAvailableSize();
        const scale = this.computeScale(w, h);

        const width = Math.max(1, Math.floor(this.baseWidth * scale));
        const height = Math.max(1, Math.floor(this.baseHeight * scale));

        this.setCanvasSize(width, height);
        this.handleRotateState();
    }


    /**
    * Applies scaled width/height to canvas, wrapper and overlay
    */
    setCanvasSize(width, height) {
        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;

        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.canvas.style.display = "block";

        this.wrapper.style.width = width + "px";
        this.wrapper.style.height = height + "px";
        this.overlay.style.width = width + "px";
        this.overlay.style.height = height + "px";
    }

    /**
    * Shows or hides rotate‑overlay based on device orientation
    */
    handleRotateState() {
        const mustRotate = shouldLockGameToRotate();

        if (mustRotate) {
            this.showOverlay();
            this.disableGameInput();
        } else {
            this.hideOverlay();
            this.enableGameInput();
        }
    }

    /**
    * Disables all game input keys.
    */
    disableGameInput() {
        if (typeof keyboard !== "undefined") {
            keyboard.LEFT = false;
            keyboard.RIGHT = false;
            keyboard.UP = false;
            keyboard.DOWN = false;
            keyboard.SPACE = false;
            keyboard.D = false;
        }
    }

    /**
    * Enables game input keys.
    */
    enableGameInput() {
    }

    /**
    * Displays the rotate overlay.
    */
    showOverlay() {
        this.overlay.style.display = "flex";
    }

    /**
    * Hides the rotate overlay.
    */
    hideOverlay() {
        this.overlay.style.display = "none";
    }
}

/**
* Determines if the game should force rotate‑overlay
*/
function shouldLockGameToRotate() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const shortSide = Math.min(vw, vh);
    const isPortrait = vh > vw;

    const isTouchDevice = 'ontouchstart' in window;

    return isTouchDevice && shortSide <= 600 && isPortrait;
}