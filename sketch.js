const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground, rope,rope2,rope3;
var bgImg, fruitImg, bunnyImg;
var bunny,button;
var blink,eat,sad;
var bgsound,eatsound,sadsound,ballonsound,cutsound;
var button2,button3,mute;

function preload(){
  bgImg = loadImage("assets/background.png");
  fruitImg = loadImage("assets/melon.png");
  bunnyImg = loadImage("assets/Rabbit-01.png");
  blink = loadAnimation("assets/blink_1.png","assets/blink_2.png","assets/blink_3.png");
  eat = loadAnimation("assets/eat_0.png","assets/eat_1.png","assets/eat_2.png","assets/eat_3.png","assets/eat_4.png");
  sad = loadAnimation("assets/sad_1.png","assets/sad_2.png","assets/sad_3.png");
  bgsound = loadSound("assets/sound1.mp3");
  eatsound = loadSound("assets/eating_sound.mp3");
  sadsound = loadSound("assets/sad.wav");
  ballonsound = loadSound("assets/air.wav");
  cutsound = loadSound("assets/rope_cut.mp3");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;
}


function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile === true){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth,displayHeight);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }
  engine = Engine.create();
  world = engine.world;

  bgsound.play();
  bgsound.setVolume(0.2);

  //Botão

  button = createImg("assets/cut_btn.png");
  button.position(20,30);
  button.size(50,50)
  button.mouseClicked(drop);

  button2 = createImg("assets/cut_btn.png");
  button2.position(330,35);
  button2.size(60,60)
  button2.mouseClicked(drop2);

  button3 = createImg("assets/cut_btn.png");
  button3.position(360,200);
  button3.size(60,60)
  button3.mouseClicked(drop3);

  mute = createImg("assets/mute.png");
  mute.position(420,30);
  mute.size(50,50);
  mute.mouseClicked(mutebg);

  //Comandos referentes ao coelho

  blink.frameDelay = 7;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(170,canH-80,20,20);
  bunny.scale = 0.21;

  bunny.addAnimation("piscando",blink);
  bunny.addAnimation("comendo",eat);
  bunny.addAnimation("triste",sad);
  bunny.changeAnimation("piscando");

  ground = new Ground(250,canH,500,20);
  rope = new Rope(8,{
    x: 40,
    y: 30
  })

  rope2 = new Rope(7,{
    x: 370,
    y: 40
  })

  rope3 = new Rope(4,{
    x: 400,
    y: 225
  })

  var fruit_options = {
    density: 0.001
  }

  fruit = Bodies.circle(300,300,20,fruit_options);
  Matter.Composite.add(rope.body,fruit);

  fruitlink = new Link(rope,fruit);
  fruitlink2 = new Link(rope2,fruit);
  fruitlink3 = new Link(rope3,fruit);
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  imageMode(CENTER);
}
 
function draw() 
{
  background(51);
  image(bgImg,canW/2,canH/2,canW,canH);
  Engine.update(engine);
  ground.show();
  rope.show();
  rope2.show();
  rope3.show();


  if (fruit !== null){
    image(fruitImg,fruit.position.x,fruit.position.y,70,70);
  }

  if(collide(fruit,bunny) === true){
    bunny.changeAnimation("comendo");
    eatsound.play();
    bgsound.stop()
  }
  if(fruit !== null && fruit.position.y >= 550){
    bunny.changeAnimation("triste");
    sadsound.play();
    bgsound.stop()
  }
  drawSprites();
   
}

function drop(){
  rope.break();
  fruitlink.separar();
  fruitlink = null;
  cutsound.play();
}

function drop2(){
  rope2.break();
  fruitlink2.separar();
  fruitlink2 = null;
  cutsound.play();
}

function drop3(){
  rope3.break();
  fruitlink3.separar();
  fruitlink3 = null;
  cutsound.play();
}

function collide(body1,body2){
  if(body1 !== null){
    var d = dist(body1.position.x,body1.position.y,body2.position.x,body2.position.y);
    if(d <= 80){
      World.remove(world,fruit);
      fruit = null;
      return true;
    }
    else{
      return false;
    } 
  }
}

function airbaloon(){
  Matter.Body.applyForce(fruit,{
    x: 0,
    y: 0
  },{
    x: 0.01,
    y: 0
  });
  ballonsound.play()
}

function mutebg(){
  if(bgsound.isPlaying()){
    bgsound.stop();
  }
else{
  bgsound.play();
} 
}



