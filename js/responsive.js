class ResponsiveCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.baseWidth = 720;
        this.baseHeight = 480;

        this.initWrapper();
        this.initOverlay();
        this.update();

        window.addEventListener("resize", () => this.update());
        window.addEventListener("orientationchange", () => this.update());
    }

    initWrapper() {
        this.wrapper = document.createElement("div");
        Object.assign(this.wrapper.style, this.getWrapperStyles());

        const host = this.canvas.parentNode;
        host.insertBefore(this.wrapper, this.canvas);
        this.wrapper.appendChild(this.canvas);
    }

    initOverlay() {
        injectRotateStyles();
        this.overlay = createRotateOverlay();
        this.wrapper.appendChild(this.overlay);
    }

    getWrapperStyles() {
        return {
            position: "relative",
            display: "block",
            lineHeight: "0",
            margin: "0 auto"
        };
    }

    update() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw < 1060;
        const isPortrait = vh > vw;
        const isLandscape = vw > vh;

        let availableWidth = vw;
        let availableHeight = vh;

        if (!isLandscape) availableHeight -= 60;
        if (isMobile && isLandscape) availableWidth -= 10, availableHeight -= 10;
        else if (isMobile) availableWidth -= 20, availableHeight -= 20;

        const scale = Math.min(
            availableWidth / this.baseWidth,
            availableHeight / this.baseHeight
        );

        const width = Math.max(1, Math.floor(this.baseWidth * scale));
        const height = Math.max(1, Math.floor(this.baseHeight * scale));

        this.setCanvasSize(width, height);
        if (isMobile && isPortrait) this.showOverlay();
        else this.hideOverlay();
    }

    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        this.canvas.style.display = "block";

        this.wrapper.style.width = width + "px";
        this.wrapper.style.height = height + "px";
        this.overlay.style.width = width + "px";
        this.overlay.style.height = height + "px";
    }

    showOverlay() {
        this.overlay.style.display = "flex";
    }

    hideOverlay() {
        this.overlay.style.display = "none";
    }
}