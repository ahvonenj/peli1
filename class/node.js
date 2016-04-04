function guid() 
{
	function s4() 
	{
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}

function Node(game, sprite, x, y)
{
	this.game = game;
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;

	this.sprite.anchor = new PIXI.Point(0.5, 0.5);

	this.exists = false;
	this.isleeching = false;
	this.leechline = new Leechline(this.game, this);
	this.playerwasinrange = false;

	this.candamage = true;
	this.candamageivl = null;

	this.lerpid = guid();

	this.wanderx = this.game.player.x;
	this.wandery = this.game.player.y;

	this.damagegraphics = new PIXI.Graphics();
	this.game.stage.addChild(this.damagegraphics);

	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
}

Node.prototype.update = function(dt)
{
	var self = this;

	var vn = new Victor(this.x, this.y);
	var vp = new Victor(this.game.player.x, this.game.player.y);


	var angletowander = Math.atan2(this.wandery - vn.y, this.wanderx - vn.x);

	this.x += Math.cos(angletowander) * Global.nodeWanderSpeed;
	this.y += Math.sin(angletowander) * Global.nodeWanderSpeed;

	if(vn.distance(new Victor(this.wanderx, this.wandery)) < 10)
	{
		this.wanderx = chance.integer({min: 0, max: Global.width - Global.noderad * 2});
		this.wandery = chance.integer({min: 0, max: Global.height - Global.noderad * 2});
	}


	if(vn.distance(vp) < Global.leechdistance)
	{
		this.damagegraphics.alpha = 1;

		this.playerwasinrange = true;
		this.leechline.show();
		this.isleeching = true;

		if(this.candamage)
		{
			this.game.player.damage(this);

			this.candamage = false;

			this.candamageivl = setInterval(function()
			{
				self.candamage = true;
			}, Global.nodedamagerate);
		}

		Lerppu.interrupt(this.lerpid);
	}
	else
	{
		this.damagegraphics.alpha -= Global.nodeDamageAlphaDecay * dt;

		if(this.leechline !== null && this.playerwasinrange)
		{
			this.playerwasinrange = false;
			this.isleeching = false;

			Lerppu.interpolate(this.leechline.graphics.alpha, 0, 0.25, function(l)
			{
				self.leechline.graphics.alpha = l;
			}, Lerppu.easings.linear, this.lerpid, function()
			{
				self.leechline.hide();
			});
		}
	}


	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
}

Node.prototype.draw = function()
{
	if(!this.exists)
	{
		this.game.stage.addChild(this.sprite);
		this.exists = true;
	}

	this.game.renderer.render(this.sprite);

	if(this.leechline !== null)
	{
		this.leechline.draw();

		this.damagegraphics.clear();
	    this.damagegraphics.lineStyle(2, 0xe74c3c, 1);
	    this.damagegraphics.beginFill(0xe74c3c, 0);
	    this.damagegraphics.drawCircle(this.x - Global.noderad / 4 + 1, this.y - Global.noderad / 4 + 1, Global.noderad * 3);
	    this.damagegraphics.endFill();  
	}
	
	this.game.renderer.render(this.damagegraphics);
}

Node.prototype.destroy = function()
{

	this.game.stage.removeChild(this.sprite);
	this.game.stage.removeChild(this.damagegraphics);
	this.leechline.destroy();
}