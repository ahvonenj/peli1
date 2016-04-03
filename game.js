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


	/* AUDIO INIT */
	this.gamemusic = $('#gamemusic')[0];
	this.gamemusic.playbackRate = Global.gameMusicStartSpeed;
	this.gamemusic.loop = true;


	/* PLAYER INIT */
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


    /* NODE LEECH LINE INIT */
   // this.leechlines = [];


    /* TIMERS INIT */
	this.nodespawner = null;
	this.gamemusicfastener = null;


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
	this.player.update(dt);

	if(this.nodes.length > 0)
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].update(dt);
		}
	}

	Lerppu.update(this.t.time);
}

Game.prototype.render = function()
{
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

	this.player.draw();

	this.renderer.render(this.stage);
}

Game.prototype.spawnNode = function()
{
	var self = this;

	self.nodes.push(new Node(self, new PIXI.Sprite(self.tex), 
		chance.integer({min: 0, max: Global.width - Global.noderad * 2}), 
		chance.integer({min: 0, max: Global.height - Global.noderad * 2})
	));
}