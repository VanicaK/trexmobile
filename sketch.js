//declaring variables
var trex, trexMoving, trexEnd;
var ground, groundImg, groundIvs;
var cloud, cloudImg;
var ob1, ob2, ob3, ob4, ob5, ob6;
var cactus;
var score = 0;
var reset, resetImg;
var endButton, endImg;

var cloudGroup;
var cactiGroup;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

//loading images and animations
function preload() {
  trexMoving = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexEnd = loadAnimation("trex_collided.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  resetImg = loadImage("restart.png");
  endImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //creating sprites
  trex = createSprite(50, height-25, 20, 50);
  trex.addAnimation("tr", trexMoving);
  trex.addAnimation("co", trexEnd);
  trex.scale = 0.5;

  ground = createSprite(width/2, height-30, width, 20);
  ground.addImage("gr", groundImg);

  groundIvs = createSprite(width/2, height-20, width, 20);
  groundIvs.visible = false;

  reset=createSprite(width/2,height/2,50,50);
  reset.addImage(resetImg);
  reset.scale=0.5;
  reset.visible=false;

  endButton=createSprite(width/2,height/2 + 50,50,50);
  endButton.addImage(endImg);
  endButton.scale=0.75;
  endButton.visible=false;


  cloudGroup = new Group();
  cactiGroup = new Group();

}

function draw() {
  background("white");

  trex.setCollider("circle",0,0,30)

  if (gameState === PLAY) {
    //making the ground move backwards, making ground infinite
    ground.velocityX = -2.5;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //making Trex jump
    if (touches.length>0 || keyDown("space") && trex.y >= height-150) {
      trex.velocityY = -9;
      touches=[];
    }
    trex.velocityY = trex.velocityY + 0.5;


    if (frameCount % 60 == 0) {
      createClouds();
    }

    if (frameCount % 120 == 0) {
      createCactus();
    }

    if(frameCount%5===0){
      score++;
    }
    if(trex.isTouching(cactiGroup)){
      gameState=END;
    }

  } else if (gameState === END) {
    ground.velocityX = 0;
    cactiGroup.setVelocityXEach(0);
    cactiGroup.setLifetimeEach(-1);
    cloudGroup.setVelocityXEach(0);
    cloudGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    trex.changeAnimation("co");
    reset.visible=true;
    endButton.visible=true;
    if(mousePressedOver(reset)){
      restart();
    }
    }


  //making the Trex collide with the invisible ground
  trex.collide(groundIvs);

  text("Score:" + score, width-100, 20)

  drawSprites();
}

function createClouds() {
  cloud = createSprite(width, 3/4*height, 30, 15);
  cloud.y = Math.round(random(10, 60));
  cloud.addImage(cloudImg);
  cloud.velocityX = -3;
  cloud.scale = 0.6;
  cloud.depth = trex.depth;
  trex.depth += 1;
  cloud.lifetime = width/-(cloud.velocityY);
  cloudGroup.add(cloud);
}

function createCactus() {
  cactus = createSprite(width, height-45, 10, 10);
  cactus.velocityX = -3;
  var r = Math.round(random(1, 6));
  switch (r) {
    case 1: cactus.addImage(ob1);
      break;
    case 2: cactus.addImage(ob2);
      break;
    case 3: cactus.addImage(ob3);
      break;
    case 4: cactus.addImage(ob4);
      break;
    case 5: cactus.addImage(ob5);
      break;
    case 6: cactus.addImage(ob6);
      break;
  }
  cactus.scale = 0.6
  cactus.lifetime = width/-(cactus.velocityX);
  cactiGroup.add(cactus);
}

function restart(){
  trex.changeAnimation("tr");
  cactiGroup.destroyEach();
  cloudGroup.destroyEach();
  reset.visible=false;
  endButton.visible=false;
  score=0;
  gameState=PLAY;
}