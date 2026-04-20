class WorldBossState {
    /**
    * Creates boss state helper for the world.
    */
    constructor(world) {
        this.world = world;
    }

    /**
    * Updates boss sound and win condition.
    */
    update() {
        const boss = this.getBoss();

        this.updateBossSound(boss);
        this.checkWinCondition(boss);
    }

    /**
    * Returns the endboss instance if present.
    */
    getBoss() {
        return this.world.level.enemies.find(e => e instanceof Endboss);
    }

    /**
    * Plays or stops boss sound depending on state.
    */
    updateBossSound(boss) {
        if (boss && !boss.isDeadEnemy) {
            if (!this.world.bossSoundPlaying) {
                SOUNDS.boss_sound.play();
                this.world.bossSoundPlaying = true;
            }
            return;
        }

        if (this.world.bossSoundPlaying) {
            SOUNDS.boss_sound.pause();
            this.world.bossSoundPlaying = false;
        }
    }

    /**
    * Sets win state when boss is dead.
    */
    checkWinCondition(boss) {
        if (boss && boss.isDeadEnemy) {
            this.world.gameWon = true;
        }
    }
}