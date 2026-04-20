class Endboss extends MovableObject {
    y = 110;
    height = 340;
    width = 240;
    isAggro = false;
    attackRange = 155;
    isAttacking = false;
    attackCooldown = false;
    isHurtEnemy = false;
    currentAnimation = 'idle';
    bossesKilled = 0;
    rageSpeed = 5.8;
    baseSpeed = 3.8;

    /**
    * Applies damage, triggers aggro and handles death
    */
    hit(dmg) {
        this.applyDamage(dmg);
        this.updateLifeBar();
        this.triggerAggroIfNeeded();
        this.checkDeath();
    }

    /**
    * Reduces boss life by damage amount.
    */
    applyDamage(dmg) {
        this.life -= dmg;
        if (this.life < 0) this.life = 0;
    }

    /**
    * Updates the boss life bar UI.
    */
    updateLifeBar() {
        this.lifeBar.setPercentage(this.life);
    }

    /**
    * Starts aggro mode if not already active.
    */
    triggerAggroIfNeeded() {
        if (this.isAggro) return;
        this.speed = this.baseSpeed;
        this.startAggro();
    }

    /**
    * Returns normalized overlap factor for damage scaling.
    */
    getOverlapFactor(overlap) {
        return Math.min(overlap / 150, 1);
    }

    /**
    * Returns rage bonus based on remaining life
    */
    getRageBonus() {
        if (this.life <= 30) return 1.0;
        if (this.life <= 60) return 0.5;
        return 0.25;
    }

    /**
    *  Updates chase speed depending on distance to player.
    */
    updateChaseSpeed() {
        const distance = this.distanceToPlayer();

        if (distance > 260) {
            this.speed = 6.4;
            return;
        }

        if (distance > 140) {
            this.speed = 5.8;
            return;
        }

        this.speed = 4.6;
    }

    /**
    * Checks if boss is dead and triggers death sequence.
    */
    checkDeath() {
        if (this.life > 0) return;

        this.isDeadEnemy = true;
        SOUNDS.win.play();

        clearInterval(this.walkInterval);
        this.removeAfterDelay();
    }

    /**
    * Temporarily marks the boss as hurt
    */
    hurt() {
        this.isHurtEnemy = true;

        setTimeout(() => {
            this.isHurtEnemy = false;
        }, 300);
    }

    /**
    * Initializes the boss and loads all animations
    */
    constructor() {
        super();

        this.loadImage(Images.IMAGES_BOSS_IDLE[0]);
        this.loadImages(Images.IMAGES_BOSS_IDLE);

        this.loadImages(Images.IMAGES_BOSS_WALK);
        this.loadImages(Images.IMAGES_BOSS_ATTACK);
        this.loadImages(Images.IMAGES_BOSS_HURT);
        this.loadImages(Images.IMAGES_BOSS_DEAD);

        this.x = 2500;
        this.animate();
    }

    /**
    * Starts aggressive chase behavior
    */
    startAggro() {
        this.isAggro = true;

        this.walkInterval = setInterval(() => {
            this.updateChaseSpeed();

            if (this.isCharacterInAttackRange()) {
                this.startAttack();
                return;
            }

            this.moveLeft();
        }, 1000 / 60);
    }

    /**
    * Initiates attack sequence with timing windows
    */
    startAttack() {
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.runAttackTimers();
    }

    /**
    * Runs attack timing windows for hit detection.
    */
    runAttackTimers() {
        setTimeout(() => {
            if (this.isCharacterInAttackRange()) {
                this.performAttack();
            }
        }, 220);

        setTimeout(() => {
            this.isAttacking = false;
        }, 500);
    }

    /**
    * Deals damage to the player.
    */
    performAttack() {
        const dmg = this.calculateDamage();
        this.world.character.hit(dmg);
        this.world.statusBar.setPercentage(this.world.character.life);
    }

    /**
    * Calculates damage based on overlap intensity
    */
    calculateDamage() {
        const overlap = this.getOverlapWithCharacter();
        const factor = this.getOverlapFactor(overlap);
        const rageBonus = this.getRageBonus();

        const baseDamage = 18;

        return baseDamage * (1 + factor * 0.55 + rageBonus);
    }

    /**
    *  Returns horizontal overlap with the character.
    */
    getOverlapWithCharacter() {
        const char = this.world.character;

        const left = char.x + char.width - this.x;
        const right = this.x + this.width - char.x;

        return Math.min(left, right);
    }

    /**
    * Returns true if the character is within attack range.
    */
    isCharacterInAttackRange() {
        const char = this.world.character;

        const horizontal = Math.abs(this.x - char.x) < this.attackRange;
        const vertical = Math.abs((this.y + this.height) - (char.y + char.height)) < 90;

        return horizontal && vertical;
    }

    /**
    * Returns distance to the player.
    */
    distanceToPlayer() {
        return Math.abs(this.x - this.world.character.x);
    }

    /**
    * Plays the correct animation based on boss state
    */
    animate() {
        setInterval(() => {
            this.playAnimation(this.getAnimationImages());
        }, 100);
    }

    /**
    * Returns animation frames for the current state.
    */
    getAnimationImages() {
        if (this.isDeadEnemy) return Images.IMAGES_BOSS_DEAD;
        if (this.isHurtEnemy) return Images.IMAGES_BOSS_HURT;
        if (this.isAttacking) return Images.IMAGES_BOSS_ATTACK;
        if (this.isAggro) return Images.IMAGES_BOSS_WALK;

        return Images.IMAGES_BOSS_IDLE;
    }
}