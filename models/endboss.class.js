class Endboss extends MovableObject {
    y = 110;
    height = 340;
    width = 240;
    isAggro = false;
    attackRange = 120;
    isAttacking = false;
    attackCooldown = false;
    isHurtEnemy = false;
    currentAnimation = 'idle';
    bossesKilled = 0;
    rageSpeed = 4.5;
    baseSpeed = 3;

    /**
     * Applies damage, triggers aggro and handles death
     */
    hit(dmg) {
        this.applyDamage(dmg);
        this.updateLifeBar();
        this.triggerAggroIfNeeded();
        this.checkDeath();
    }

    applyDamage(dmg) {
        this.life -= dmg;
        if (this.life < 0) this.life = 0;
    }

    updateLifeBar() {
        this.lifeBar.setPercentage(this.life);
    }

    triggerAggroIfNeeded() {
        if (this.isAggro) return;
        this.speed = this.baseSpeed;
        this.startAggro();
    }

    getOverlapFactor(overlap) {
        return Math.min(overlap / 150, 1);
    }

    getRageBonus() {
        if (this.life <= 30) return 0.8;
        if (this.life <= 60) return 0.4;
        return 0.2;
    }

    updateChaseSpeed() {
        const distance = this.distanceToPlayer();
        this.speed = distance > 220 ? this.rageSpeed : this.baseSpeed;
    }

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

    runAttackTimers() {
        setTimeout(() => {
            if (this.isCharacterInAttackRange()) {
                this.performAttack();
            }
        }, 300);

        setTimeout(() => {
            this.isAttacking = false;
        }, 600);
    }

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

        const baseDamage = 15;

        return baseDamage * (1 + factor * 0.5 + rageBonus);
    }

    getOverlapWithCharacter() {
        const char = this.world.character;

        const left = char.x + char.width - this.x;
        const right = this.x + this.width - char.x;

        return Math.min(left, right);
    }

    isCharacterInAttackRange() {
        const char = this.world.character;

        const horizontal = Math.abs(this.x - char.x) < 120;
        const vertical = Math.abs((this.y + this.height) - (char.y + char.height)) < 80;

        return horizontal && vertical;
    }

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

    getAnimationImages() {
        if (this.isDeadEnemy) return Images.IMAGES_BOSS_DEAD;
        if (this.isHurtEnemy) return Images.IMAGES_BOSS_HURT;
        if (this.isAttacking) return Images.IMAGES_BOSS_ATTACK;
        if (this.isAggro) return Images.IMAGES_BOSS_WALK;

        return Images.IMAGES_BOSS_IDLE;
    }
}