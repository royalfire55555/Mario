//GAME SETUP
var ground;
var player;

// animations
var groundImg;
var marioImg;
var cloud;
var goomba;
var plant;
var coin;

//create the variables
var isAI = false;
var coins;
var enemies;
var isJumping = false;
var isStarting = true;
var score = 0;
var health = 100;



function preload() {
    groundImg = loadImage("./assets/ground.png");
    cloudImg = loadImage("./assets/cloud.png");
    goomba = loadImage("./assets/goomba.png");
    plant = loadImage("./assets/plant.png");
    marioImg = loadImage("./assets/mario.png");
    coin = loadAnimation("./assets/coin.png", "./assets/coin1.png");
    coins = createGroup();
    enemies = createGroup();
}

function setup() {
    createCanvas(800, 800);
    ground = createSprite(700, 790);
    ground.addImage(groundImg);
    ground.velocityX = -5;

    player = createSprite(100, 750, 10, 10);
    player.addImage(marioImg);
    player.scale = 0.2;
    player.setCollider("circle");
}

function draw() {
    // BACKGROUND
    background("lightblue");

    player.debug = true;
    ground.debug = true;

    AI(isAI);

    // turn on ai
    if (keyWentDown("space")) {
        isAI = !isAI;
    }

    // start
    if (isStarting == true && player.y == 315) {
        isStarting = false;
    }

    //make gound move
    if (ground.x < 0) {
        ground.x = ground.width / 2;
    }

    player.collide(ground);

    // spawn stuff

    // spawn clouds
    if (World.frameCount % 60 == 0) {
        spawnClouds();
    }

    // spawn obstacles
    if (World.frameCount % 55 == 0) {
        spawnObs();
    }

    //spawn coins
    if (World.frameCount % 40 == 0) {
        var num = randomNumber(0, 100);
        if (num <= 25) {
            spawnCoins();
        }
    }

    // enemies gravity
    enemies.collide(ground);

    // SPRITE INTERACTIONS
    // check collisions with enemies

    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (player.isTouching(enemy)) {
            enemy.lifetime = 0;
            health -= 2;
        }
    }

    //check collisions with coins
    for (var i = 0; i < coins.length; i++) {
        var coin = coins[i];
        if (player.isTouching(coin)) {
            coin.visible = false;
        }
    }

    // JUMPING

    if (keyWentDown("up")) {
         player.velocityY = -8;
         isJumping = true;
     } else if (player.y <= 300 && isJumping == false || isStarting == true && isJumping == false) {
         player.velocityY = 5;
     } else if (isJumping == true && player.y <= 200) {
         isJumping = false;
     }

    // DRAW SPRITES
    drawSprites();

    // SCOREBOARD
    // add scoreboard and health meter
    fill("black");
    textSize(20);
    text("Health:", 280, 30);
    text(health, 350, 30);
    text("Score:" + score, 30, 30);
    // GAME OVER
    // if health runs out
    // show Game over
    if (health < 0) {
        background("black");
        fill("green");
        textSize(50);
        text("Game Over!", 40, 200);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * max)
}

//random clouds
function spawnClouds() {
    var cloud = createSprite(400, randomNumber(0, 100));
    cloud.addImage(cloudImg);
    cloud.velocityX = -7;
    cloud.scale = 0.25;
    cloud.lifetime = Math.abs(400 / cloud.velocityX);
}

//random obstcles
function spawnObs() {
    var obs = createSprite(415, 315);
    var num = randomNumber(1, 2);
    switch (num) {
        case 1:
            obs.addImage(goomba);
            obs.scale = 0.07;
            break;
        case 2:
            obs.addImage(plant);
            obs.scale = 0.15;
            break;
    }
    enemies.add(obs);
    enemies.setVelocityXEach(-5);
}

// randomly spawns coins
function spawnCoins() {
    var coin = createSprite(400, randomNumber(215, 315));
    coin.addAnimation("coin", coin);
    coin.scale = 0.5;
    coin.velocityX = -5;
    coin.lifetime = Math.abs(400 / coin.velocityX) + 10;
    coins.add(coin);
}

// player ai
function AI(isAI) {
    if (isAI) {
        player.setCollider("rectangle", 0, 0, 350, 150);
        if (player.isTouching(enemies)) {
            player.velocityY = -8;
            isJumping = true;
        }
    } else {
        player.setCollider("circle");
    }
}
