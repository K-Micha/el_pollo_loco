let startX = 300 + Math.random() * 1700;
let startY = 120 + Math.random() * 40;


function randomEnemy() {
    const types = [Chicken, SmallChicken];
    const Type = types[Math.floor(Math.random() * types.length)];
    return new Type();
}

function randomBottle() {
    const x = 100 + Math.random() * 1800;
    const variant = Math.random() < 0.5 ? 'ground1' : 'ground2';
    return new Bottle(x, variant);
}




const COIN_BOW = [
    { x: 0, y: 0 },
    { x: 50, y: -30 },
    { x: 100, y: -50 },
    { x: 150, y: -30 },
    { x: 200, y: 0 }
];


const lvl1 = new Level(
    [
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),
        this.randomEnemy(),

        new Endboss()
    ],

    [
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],

    [
        new BackgroundObject('assets/img/5_background/layers/air.png', -719),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('assets/img/5_background/layers/air.png', 0),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('assets/img/5_background/layers/air.png', 719),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new BackgroundObject('assets/img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 719 * 3)
    ],

    [
        new Coin(startX + COIN_BOW[0].x, startY + COIN_BOW[0].y),
        new Coin(startX + COIN_BOW[1].x, startY + COIN_BOW[1].y),
        new Coin(startX + COIN_BOW[2].x, startY + COIN_BOW[2].y),
        new Coin(startX + COIN_BOW[3].x, startY + COIN_BOW[3].y),
        new Coin(startX + COIN_BOW[4].x, startY + COIN_BOW[4].y),

        new Coin(300 + Math.random() * 2000, 200 + Math.random() * 150),
        new Coin(300 + Math.random() * 2000, 200 + Math.random() * 150),
        new Coin(300 + Math.random() * 2000, 200 + Math.random() * 150),
        new Coin(300 + Math.random() * 2000, 200 + Math.random() * 150),
        new Coin(300 + Math.random() * 2000, 200 + Math.random() * 150)
    ],

    [
        randomBottle(),
        randomBottle(),
        randomBottle(),
        randomBottle(),
        randomBottle(),
        randomBottle(),
        randomBottle(),
        randomBottle(),
        randomBottle()
    ]
)