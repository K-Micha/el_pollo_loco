class PauseMenu {
    constructor(world) {
        this.world = world;
        this.isOpen = false;
        this.iconMute = this.loadImage('./assets/icon/mute.png');
        this.iconVolume = this.loadImage('./assets/icon/volume.png');
        this.iconFullscreen = this.loadImage('./assets/icon/fullscreen.png');
    }

    /**
     * Loads one icon image.
     */
    loadImage(path) {
        const img = new Image();
        img.src = path;
        return img;
    }

    /**
     * Draws pause button and overlay menu.
     */
draw(ctx) {
    ctx.imageSmoothingEnabled = false;

    this.drawPauseButton(ctx);
    if (!this.isOpen) return;

    this.drawOverlay(ctx);
    this.drawPanel(ctx);
    this.drawTitle(ctx);
    this.drawButtons(ctx);
}

    /**
     * Draws the pause button.
     */
    drawPauseButton(ctx) {
        ctx.save();
        this.drawRoundBox(ctx, 450, 20, 40, 40, 10, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = 'white';
        ctx.fillRect(462, 28, 6, 24);
        ctx.fillRect(474, 28, 6, 24);
        ctx.restore();
    }

    /**
     * Draws dark overlay.
     */
    drawOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
        ctx.fillRect(0, 0, 720, 480);
        ctx.restore();
    }

    /**
     * Draws the main panel.
     */
    drawPanel(ctx) {
        ctx.save();
        this.drawRoundBox(ctx, 200, 105, 320, 225, 16, 'rgba(240, 173, 63, 0.96)');
        this.drawRoundBox(ctx, 206, 111, 308, 213, 14, 'rgba(255, 205, 96, 0.18)');
        ctx.restore();
    }

    /**
     * Draws title text.
     */
    drawTitle(ctx) {
        ctx.save();
        ctx.fillStyle = '#2d1b08';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', 360, 145);
        ctx.restore();
    }

    /**
     * Draws all menu buttons.
     */
    drawButtons(ctx) {
        this.drawTextButton(ctx, 245, 170, 230, 42, 'Resume');
        this.drawIconButton(ctx, 245, 222, 230, 42, this.getSoundLabel(), this.getSoundIcon());
        this.drawIconButton(ctx, 245, 274, 230, 42, 'Fullscreen', this.iconFullscreen);
    }

    /**
     * Draws one text-only button.
     */
    drawTextButton(ctx, x, y, w, h, text) {
        ctx.save();
        this.drawRoundBox(ctx, x, y, w, h, 10, 'rgba(255, 244, 215, 0.32)');
        this.drawRoundBox(ctx, x + 2, y + 2, w - 4, h - 4, 9, 'rgba(255, 255, 255, 0.12)');
        ctx.fillStyle = '#2d1b08';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(text, x + 18, y + 27);
        ctx.restore();
    }

    /**
     * Draws one button with text and right icon.
     */
    drawIconButton(ctx, x, y, w, h, text, icon) {
        ctx.save();
        this.drawRoundBox(ctx, x, y, w, h, 10, 'rgba(255, 244, 215, 0.32)');
        this.drawRoundBox(ctx, x + 2, y + 2, w - 4, h - 4, 9, 'rgba(255, 255, 255, 0.12)');

        ctx.fillStyle = '#2d1b08';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(text, x + 18, y + 27);

        if (icon && icon.complete && icon.naturalWidth > 0) {
            ctx.drawImage(icon, x + w - 42, y + 7, 28, 28);
        }

        ctx.restore();
    }

    /**
     * Draws a rounded box.
     */
    drawRoundBox(ctx, x, y, w, h, r, color) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Handles click input.
     */
    handleClick(x, y) {
        if (this.isPauseClicked(x, y)) return this.toggleAndConsume();
        if (!this.isOpen) return false;
        if (this.isPlayClicked(x, y)) return this.playAndConsume();
        if (this.isMuteClicked(x, y)) return this.muteAndConsume();
        if (this.isFullClicked(x, y)) return this.fullAndConsume();
        return false;
    }

    /**
     * Toggles pause state.
     */
    toggleAndConsume() {
        this.isOpen = !this.isOpen;
        this.world.isPaused = this.isOpen;
        return true;
    }

    /**
     * Closes menu and resumes game.
     */
    playAndConsume() {
        this.isOpen = false;
        this.world.isPaused = false;
        return true;
    }

    /**
     * Toggles sound state.
     */
    muteAndConsume() {
        this.world.toggleSound();
        return true;
    }

    /**
     * Toggles fullscreen mode.
     */
    fullAndConsume() {
        this.world.toggleFullscreen();
        return true;
    }

    /**
     * Returns current sound icon.
     */
    getSoundIcon() {
        return SOUND_ENABLED ? this.iconVolume : this.iconMute;
    }

    /**
     * Returns current sound label.
     */
    getSoundLabel() {
        return SOUND_ENABLED ? 'Sound On' : 'Muted';
    }

    /**
     * Checks pause button area.
     */
    isPauseClicked(x, y) {
        return x >= 450 && x <= 490 && y >= 20 && y <= 60;
    }
    
    /**
     * Checks play button area.
     */
    isPlayClicked(x, y) {
        return x >= 245 && x <= 475 && y >= 170 && y <= 212;
    }

    /**
     * Checks mute button area.
     */
    isMuteClicked(x, y) {
        return x >= 245 && x <= 475 && y >= 222 && y <= 264;
    }

    /**
     * Checks fullscreen button area.
     */
    isFullClicked(x, y) {
        return x >= 245 && x <= 475 && y >= 274 && y <= 316;
    }
}