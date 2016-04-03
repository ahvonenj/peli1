function timestamp()
{
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function Game()
{
	var self = this;

	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer(Global.width, Global.height, 
	{ 
		view: document.querySelector('canvas'),
		backgroundColor: 0x2c3e50,
		antialias: true 
	});

	Global.stageoffset = 
	{
		x: $(canvas).offset().left,
		y: $(canvas).offset().top
	}

	this.t = 
	{
		now: null,
		acc: 0,
		dt: 0,
		last: timestamp(),
		step: 1/60,
		time: 0
	};

	this.godmode = false;
	this.isgameover = false;


	/* AUDIO INIT */
	this.gamemusic = $('#gamemusic')[0];
	this.gamemusic.playbackRate = Global.gameMusicStartSpeed;
	this.gamemusic.loop = true;

	this.leechsound = new Audio("res/leech.wav");
	this.nukesound = new Audio('res/nuke.mp3');
	this.expwarning = new Audio('res/expwarning.wav');
	this.explosionsound = new Audio('res/explosion.wav');
	this.aoehit = new Audio('res/aoehit.wav');


	/* PLAYER INIT */
	this.score = 0;
	this.player = new Player(this);


	/* NODES INIT */
	this.nodes = [];

	this.nodegraphics = new PIXI.Graphics();
	this.nodegraphics.clear();
    this.nodegraphics.lineStyle(3, 0xFFFFFF, 1);
    this.nodegraphics.beginFill(0xFFFFFF, 1);
    this.nodegraphics.drawCircle(999999, 999999, Global.noderad);
    this.nodegraphics.endFill();   

    this.tex = self.nodegraphics.generateTexture();


    /* AOE INIT */
    this.aoes = [];


    /* NODE LEECH LINE INIT */
   // this.leechlines = [];


    /* TIMERS INIT */
	this.nodespawner = null;
	this.gamemusicfastener = null;
	this.scoreincreaser = null;
	this.aoespawner = null;


	/* EVENTS INIT**/

	this.stage.interactive = true;

	this.stage.on('mousemove', function(data)
	{
		var evt = data.data.originalEvent;

		Global.mouse.x = evt.clientX - Global.stageoffset.x;
		Global.mouse.y = evt.clientY - Global.stageoffset.y;
		
	});

	$('#startgame').on('click', function()
	{	
		/* GAME START */
		self.start();

		$(this).fadeOut('fast');
	});
}

Game.prototype.start = function()
{
	var self = this;

	$('#game').css('cursor', 'none');
	$('canvas').css('cursor', 'none');

	/* TIMERS START */
	this.nodespawner = setInterval(this.spawnNode.bind(self), Global.nodeSpawnStartRate);

	this.gamemusicfastener = setInterval(function()
	{
		//console.log('Music increase ' + self.gamemusic.playbackRate + ' => ' + (self.gamemusic.playbackRate + Global.gameMusicIncreaseAmount));
		self.gamemusic.playbackRate += Global.gameMusicIncreaseAmount;
	}, Global.gameMusicSpeedIncreaseRate);

	this.scoreincreaser = setInterval(function()
	{
		self.score += Global.scoreAwardAmount;
	}, Global.scoreAwardRate);

	this.aoespawner = setInterval(this.spawnAoe.bind(self), Global.aoeSpawnStartRate);


	this.gamemusic.play();

	requestAnimationFrame(function(t) { self.animate(self); });
}

Game.prototype.animate = function(game)
{
	game.t.now = timestamp();
	game.t.dt = Math.min(1, (game.t.now - game.t.last) / 1000);
	game.t.last = game.t.now; 

	game.t.acc += game.t.dt;

	while(game.t.acc >= game.t.step) 
	{
		game.t.acc -= game.t.step;
	    	game.t.time += game.t.step;

		game.update(game.t.dt);
	}

	game.render();
	requestAnimationFrame(function(t) { game.animate(game); });
}

Game.prototype.update = function(dt)
{
	if(this.isgameover)
		return;

	if(this.player.health <= 0)
	{
		this.gameOver();
	}

	this.player.update(dt);

	if(this.nodes.length > 0)
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].update(dt);
		}
	}

	if(this.aoes.length > 0)
	{
		for(var i = 0; i < this.aoes.length; i++)
		{
			this.aoes[i].update(dt);

			if(this.aoes[i].bursted)
			{
				this.aoes.splice(i, 1);
			}
		}
	}

	Lerppu.update(this.t.time);
}

Game.prototype.render = function()
{
	if(this.isgameover)
		return;

	// Move player to front of all nodes
	if(this.stage.children.length > 1)
	{
		this.stage.removeChild(this.player.sprite);
		this.stage.addChildAt(this.player.sprite, this.stage.children.length - 1);
	}

	for(var i = 0; i < this.nodes.length; i++)
	{
		this.nodes[i].draw();
	}

	for(var i = 0; i < this.aoes.length; i++)
	{
		this.aoes[i].draw();
	}

	this.player.draw();

	this.renderer.render(this.stage);

	$('#healthval').text('Health: ' + this.player.health);
	$('#scoreval').text('Score: ' + this.score);
}

Game.prototype.spawnNode = function()
{
	var self = this;

	self.nodes.push(new Node(self, new PIXI.Sprite(self.tex), 
		chance.integer({min: 0, max: Global.width - Global.noderad * 2}), 
		chance.integer({min: 0, max: Global.height - Global.noderad * 2})
	));
}

Game.prototype.spawnAoe = function()
{
	if(this.aoes.length > 500)
		return;

	var self = this;

	self.aoes.push(new Aoe(self,
		chance.integer({min: 0 - Global.aoemaxrad / 4, max: Global.width}), 
		chance.integer({min: 0 - Global.aoemaxrad / 4, max: Global.height})
	));
}

Game.prototype.gameOver = function()
{
	$('#gameover').fadeIn();
	this.isgameover = true;
	this.nukesound.play();
	this.gamemusic.pause();
}