	var game = new Phaser.Game(900, 600, Phaser.CANVAS);
	var bird;
	var birdGravity = 800;
	var birdSpeed = 125;
	var birdFlapPower = 300;
	var pipeInterval = 2000;
	var pipeHole = 80;
	var pipeGroup;
	var score=0;
	var scoreText;
     var topScore;
     
     var play = function(game){}
     
     play.prototype = {
		preload:function(){
			game.load.image("bird","img/fappyBird.png") 
			game.load.image("pipe","img/pipe.png");
		},
		create:function(){
			pipeGroup = game.add.group();
			score = 0;
			topScore = localStorage.getItem("topFlappyScore")==null?0:localStorage.getItem("topFlappyScore");
			scoreText = game.add.text(10,10,"-",{
				font:"bold 16px Arial"
			});
			updateScore();
			game.stage.backgroundColor = "#87CEEB";
			game.stage.disableVisibilityChange = true;
			game.physics.startSystem(Phaser.Physics.ARCADE);
			bird = game.add.sprite(80,240,"bird");
			bird.anchor.set(0.5);
			game.physics.arcade.enable(bird);
			bird.body.gravity.y = birdGravity;
			game.input.onDown.add(flap, this);
			game.time.events.loop(pipeInterval, addPipe); 
			addPipe();
		},
		update:function(){
			game.physics.arcade.collide(bird, pipeGroup, die);
			if(bird.y>game.height){
				die();
			}	
		}
	}
     
     game.state.add("Play",play);
     game.state.start("Play");
     
     function updateScore(){
		scoreText.text = "Score: "+score+"\nBest: "+topScore;	
	}
     
	function flap(){
		bird.body.velocity.y = -birdFlapPower;	
	}
	
	function addPipe(){
		var pipeHolePosition = game.rnd.between(70,600-pipeHole);
		var upperPipe = new Pipe(game,900,pipeHolePosition-600,-birdSpeed);
		game.add.existing(upperPipe);
		pipeGroup.add(upperPipe);
		var lowerPipe = new Pipe(game,900,pipeHolePosition+pipeHole,-birdSpeed);
		game.add.existing(lowerPipe);
		pipeGroup.add(lowerPipe);
	}
	
	function die(){
		localStorage.setItem("topFlappyScore",Math.max(score,topScore));	
		game.state.start("Play");	
	}
	
	Pipe = function (game, x, y, speed) {
		Phaser.Sprite.call(this, game, x, y, "pipe");
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.velocity.x = speed;
		this.giveScore = true;	
	};
	
	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;
	
	Pipe.prototype.update = function() {
		if(this.x+this.width<bird.x && this.giveScore){
			score+=0.5;
			updateScore();
			this.giveScore = false;
		}
		if(this.x<-this.width){
			this.destroy();
		}
	};	
