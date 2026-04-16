    /**
    * Creates the rotate‑overlay container element
    */
function createRotateOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "rotate-overlay";
    overlay.innerHTML = getRotateOverlayMarkup();
    Object.assign(overlay.style, getRotateOverlayBaseStyles());
    return overlay;
}

    /**
    * Returns the HTML markup for the rotate overlay
    */
function getRotateOverlayMarkup() {
    return `
        <div class="rotate-box">
            <div class="rotate-visual">
                <svg class="rotate-svg" viewBox="0 0 220 220" aria-hidden="true">
                    <path
                        class="rotate-arrow arrow-a"
                        d="M78 48 C42 58, 28 95, 36 128 M36 128 L24 114 M36 128 L54 126" />
                    <path
                        class="rotate-arrow arrow-b"
                        d="M142 172 C178 162, 192 125, 184 92 M184 92 L196 106 M184 92 L166 94" />
                    <g class="phone-group">
                        <rect x="78" y="42" rx="16" ry="16" width="64" height="136" class="phone-body"/>
                        <rect x="86" y="58" rx="8" ry="8" width="48" height="96" class="phone-screen"/>
                        <rect x="100" y="48" rx="3" ry="3" width="20" height="4" class="phone-detail"/>
                        <circle cx="110" cy="166" r="5" class="phone-detail"/>
                    </g>
                </svg>
            </div>
            <div class="rotate-text">Please rotate your phone</div>
        </div>
    `;
}

    /**
    * Returns base inline styles for the rotate overlay container.
    */
function getRotateOverlayBaseStyles() {
    return {
        position: "absolute",
        top: "0",
        left: "0",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        borderRadius: "12px",
        zIndex: "20",
        boxSizing: "border-box"
    };
}

    /**
    * Injects the rotate‑overlay CSS into the document once
    */
function injectRotateStyles() {
    if (document.getElementById("rotate-overlay-styles")) return;

    const style = document.createElement("style");
    style.id = "rotate-overlay-styles";
    style.textContent = getRotateOverlayStyles();
    document.head.appendChild(style);
}

    /**
    * Returns CSS styles for the rotate overlay component.
    */
function getRotateOverlayStyles() {
    return `
        .rotate-overlay {
            overflow: hidden;
        }

        .rotate-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            text-align: center;
            padding: 24px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        .rotate-visual {
            width: min(42vw, 180px);
            max-width: 180px;
            min-width: 120px;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .rotate-svg {
            width: 100%;
            height: 100%;
            overflow: visible;
        }

        .phone-group {
            transform-origin: 110px 110px;
            animation: phoneTilt 1.8s ease-in-out infinite;
        }

        .rotate-arrow {
            fill: none;
            stroke: white;
            stroke-width: 8;
            stroke-linecap: round;
            stroke-linejoin: round;
            opacity: 0.95;
        }

        .arrow-a,
        .arrow-b {
            transform-origin: 110px 110px;
            animation: arrowsSpin 1.8s ease-in-out infinite;
        }

        .phone-body {
            fill: none;
            stroke: white;
            stroke-width: 8;
        }

        .phone-screen {
            fill: rgba(255,255,255,0.12);
            stroke: white;
            stroke-width: 4;
        }

        .phone-detail {
            fill: white;
        }

        .rotate-text {
            color: white;
            font-size: clamp(18px, 2.5vw, 24px);
            font-family: Arial, sans-serif;
            font-weight: 700;
            line-height: 1.3;
        }

        @keyframes phoneTilt {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(90deg) scale(1.02); }
            75% { transform: rotate(90deg) scale(1.02); }
            100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes arrowsSpin {
            0% { transform: rotate(0deg); opacity: 0.75; }
            50% { transform: rotate(90deg); opacity: 1; }
            100% { transform: rotate(180deg); opacity: 0.75; }
        }
    `;
}