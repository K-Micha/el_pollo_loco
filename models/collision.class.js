class Collision {

    static checkCoinCollision(world) {
        const char = world.character;

        world.level.coins.forEach(coin => {
            const hit = this.getCoinHitbox(coin);

            if (this.isCoinCollision(char, hit)) {
                char.coins++;
                coin.markedForRemoval = true;
            }
        });

        world.level.coins = world.level.coins.filter(c => !c.markedForRemoval);
    }

    static getCoinHitbox(coin) {
        return {
            x: coin.x + 30,
            y: coin.y + 30,
            width: 40,
            height: 40
        };
    }

    static isCoinCollision(char, hit) {
        return (
            char.x + char.width > hit.x &&
            char.y + char.height > hit.y &&
            char.x < hit.x + hit.width &&
            char.y < hit.y + hit.height
        );
    }


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

    static blockCharacter(world, boss) {
        const padding = 150;
        const char = world.character;

        if (char.x + char.width > boss.x + padding &&
            char.x < boss.x + boss.width / 2) {
            char.x = boss.x - char.width + padding;
        }
    }

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
