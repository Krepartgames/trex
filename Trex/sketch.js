var JOGAR = 1;
var ENCERRAR = 0;
var estadoDoJogo = JOGAR;

var checkPointSound, morteSound, puloSound;

var trex, trexCorrendo, trexColidiu;
var solo, soloInvisivel, imagemDoSolo;
var fimDeJogo, restart, gameOverImage, restartImage;

var nuvem, grupoDeNuvens, imagemDaNuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;


function preload(){
  trexCorrendo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexColidiu = loadAnimation("trex_collided.png");
  
  //checkPointSound = loadSound("checkPoint.mp3");
  //puloSound = loadSound("jump.mp3");
  //morteSound = loadSound("die.mp3");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  imagemDoSolo = loadImage("ground2.png");
  
  imagemDaNuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trexCorrendo);
  trex.addAnimation("collided" , trexColidiu)
  trex.scale = 0.5;
  
  fimDeJogo = createSprite(300,100);
  restart = createSprite(300,140);
  fimDeJogo.addImage("game over", gameOverImage);
  restart.addImage("reiniciar", restartImage);
  fimDeJogo.scale = 0.5;
  restart.scale = 0.5;
  fimDeJogo.visible = false;
  restart.visible = false;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemDoSolo);
  solo.x = solo.width /2;
  //solo.velocityX = -4;
  
  soloInvisivel = createSprite(200,190,400,10);
  soloInvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupoDeObstaculos = createGroup();
  grupoDeNuvens = createGroup();
  
  console.log("Oi" + 5);
  
  //tex debug = true;
  trex.setCollider("rectangle",0,0,trex.width,trex.height);

  pontuacao = 0;
}

function draw() {
  background("white");
  //exibindo pontuação
  text("Pontuação: "+ pontuacao, 500,50);
    
  
  
  if(estadoDoJogo === JOGAR){

    fimDeJogo.visible = false;
    restart.visible = false;

    trex.changeAnimation("running", trexCorrendo);

    //mover o solo
    solo.velocityX = -(4 + 3* pontuacao/100);
    //marcando pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);
    /*if( pontuacao > 0 && pontuacao%100 === 0){
      checkPointSound.play();
    }*/
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if(keyDown("space")&& trex.y >= 100) {
       trex.velocityY = -10;
       //puloSound.play();
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupoDeObstaculos.isTouching(trex)){
      //trex.velocityY = -10;
      //puloSound.play();
      estadoDoJogo = ENCERRAR;
      //morteSound.play();
    }
  }
     else if (estadoDoJogo === ENCERRAR) {
       fimDeJogo.visible = true;
       restart.visible = true;
       
       solo.velocityX = 0; 
       
       trex.velocityY = 0;
       trex.changeAnimation("collided",trexColidiu);
       
       grupoDeObstaculos.setVelocityXEach(0);
       grupoDeNuvens.setVelocityXEach(0);
       grupoDeObstaculos.setLifetimeEach(-1);
       grupoDeNuvens.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
   }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloInvisivel);

  
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,165,10,40);
  obstaculo.velocityX = -(6 + 3* pontuacao/200) ;
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupoDeObstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -(4 + 3* pontuacao/100);
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 300;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupoDeNuvens.add(nuvem);
  }
}
function reset() {
  estadoDoJogo = JOGAR;
  fimDeJogo.visible = false;
  restart.visible = false;

  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  trex.changeAnimation("running", trexCorrendo);
  pontuacao = 0;
  solo.velocityX = 1;
  
}