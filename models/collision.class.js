class Collision {

      /**
     * Handles coin pickup and removes collected coins
     */
    static checkCoinCollision(world) {
        world.level.coins = world.level.coins.filter(coin => {
            if (this.isCoinPickup(world.character, coin)) {
                SOUNDS.pickup.play();
                world.character.coins++;
                return false;
            }

            return true;
        });
    }

    static getCoinHitbox(coin) {
        return {
            x: coin.x + 28,
            y: coin.y + 28,
            width: 44,
            height: 44
        };
    }

    static getCharacterCoinHitbox(char) {
        return {
            x: char.x + 20,
            y: char.y + 35,
            width: 55,
            height: 95
        };
    }

     /**
     * Checks AABB collision between character and coin hitbox
     */
    static isCoinCollision(char, coinHit) {
        const charHit = this.getCharacterCoinHitbox(char);

        return (
            charHit.x + charHit.width >= coinHit.x &&
            charHit.y + charHit.height >= coinHit.y &&
            charHit.x <= coinHit.x + coinHit.width &&
            charHit.y <= coinHit.y + coinHit.height
        );
    }

      /**
     * Checks if character is close enough to pick up a coin
     */
    static isCoinPickup(char, coin) {
        const charCenterX = char.x + char.width / 2;
        const charPickupY = char.y + char.height * 0.72;

        const coinCenterX = coin.x + coin.width / 2;
        const coinCenterY = coin.y + coin.height / 2;

        const dx = Math.abs(charCenterX - coinCenterX);
        const dy = Math.abs(charPickupY - coinCenterY);

        return dx < 28 && dy < 58;
    }

      /**
     * Handles bottle collisions with enemies and boss
     */
    static checkBottleCollision(world) {
        world.throwableObjects.forEach(bottle => {
            if (bottle.isBroken) return;

            world.level.enemies.forEach(enemy => {
                if (!bottle.isColliding(enemy)) return;

                if (enemy instanceof Endboss) {
                    enemy.hit(20);
                    enemy.hurt();
                } else {
                    enemy.die();
                }

                bottle.break();
            });
        });
    }

      /**
     * Handles character collision with enemies and stomp logic
     */
    static checkEnemyCollision(world) {
        const char = world.character;

        world.level.enemies.forEach(enemy => {
            if (this.shouldSkipEnemy(enemy)) return;
            if (!char.isColliding(enemy)) return;

            if (enemy instanceof Endboss) {
                this.blockCharacter(world, enemy);
            }

            if (this.isStomp(world, enemy)) {
                enemy.die();
            } else {
                world.handleCharacterHit();
            }
        });
    }

    static shouldSkipEnemy(enemy) {
        return enemy.isDeadEnemy;
    }

      /**
     * Prevents character from clipping into the boss
     */
    static blockCharacter(world, boss) {
        const padding = 150;
        const char = world.character;

        if (char.x + char.width > boss.x + padding &&
            char.x < boss.x + boss.width / 2) {
            char.x = boss.x - char.width + padding;
        }
    }

      /**
     * Checks if character is performing a stomp attack
     */
    static isStomp(world, enemy) {
        const char = world.character;

        const charBottom = char.y + char.height;
        const enemyTop = enemy.y;
        const charCenter = char.x + char.width / 2;

        return (
            char.speedY < 0 &&
            charBottom >= enemyTop &&
            charBottom <= enemyTop + 40 &&
            charCenter >= enemy.x &&
            charCenter <= enemy.x + enemy.width
        );
    }
}