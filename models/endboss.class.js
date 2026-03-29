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


    hit(dmg) {
        this.life -= dmg;

        if (!this.isAggro) {
            this.speed = 3;
            this.startAggro();
        }

        if (this.life <= 0) {
            this.life = 0;
            this.isDeadEnemy = true;
            clearInterval(this.walkInterval);
            this.removeAfterDelay();
        }
    }

    hurt() {
        this.isHurtEnemy = true;

        setTimeout(() => {
            this.isHurtEnemy = false;
        }, 300);
    }

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

    startAggro() {
        this.isAggro = true;

        this.walkInterval = setInterval(() => {

            const distance = this.distanceToPlayer();

            if (distance < this.attackRange) {
                this.startAttack();
            } else {
                this.moveLeft();
            }

        }, 1000 / 60);
    }

    startAttack() {
        if (this.isAttacking) return;

        this.isAttacking = true;

        setTimeout(() => {
            if (this.isCharacterInAttackRange()) {
                this.world.character.hit(5);
                this.world.statusBar.setPercentage(this.world.character.life);
            }
        }, 300);


        setTimeout(() => {
            this.isAttacking = false;
        }, 600);
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



    animate() {
        setInterval(() => {

            if (this.isDeadEnemy) {
                this.playAnimation(Images.IMAGES_BOSS_DEAD);
            }
            else if (this.isHurtEnemy) {
                this.playAnimation(Images.IMAGES_BOSS_HURT);
            }
            else if (this.isAttacking) {
                this.playAnimation(Images.IMAGES_BOSS_ATTACK);
            }
            else if (this.isAggro) {
                this.playAnimation(Images.IMAGES_BOSS_WALK);
            }
            else {
                this.playAnimation(Images.IMAGES_BOSS_IDLE);
            }

        }, 100);
    }
}