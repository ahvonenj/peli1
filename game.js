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
		backgroundColor: 0x000000,
		antialias: true 
	});

	this.t = 
	{
		now: null,
		acc: 0,
		dt: 0,
		last: timestamp(),
		step: 1/60,
		time: 0
	};

	this.nodes = [];

	this.nodegraphics = new PIXI.Graphics();
	this.nodegraphics.clear();
    this.nodegraphics.lineStyle(3, 0xFFFFFF, 1);
    this.nodegraphics.beginFill(0xFFFFFF, 1);
    this.nodegraphics.drawCircle(999999, 999999, Global.noderad);
    this.nodegraphics.endFill();   

    this.tex = self.nodegraphics.generateTexture();

	this.nodespawner = setInterval(function()
	{
		self.nodes.push(new Node(self, new PIXI.Sprite(self.tex), 
			chance.integer({min: 0, max: Global.width - Global.noderad * 2}), 
			chance.integer({min: 0, max: Global.height - Global.noderad * 2})
		));

	}, 1);

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
	if(this.nodes.length > 0)
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].update(dt);
		}
	}
}

Game.prototype.render = function()
{
	for(var i = 0; i < this.nodes.length; i++)
	{
		this.nodes[i].draw(this.renderer);
	}

	this.renderer.render(this.stage);
}