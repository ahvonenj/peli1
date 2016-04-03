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

	this.exists = false;
	this.isleeching = false;
	this.leechline = new Leechline(this.game, this);
	this.playerwasinrange = false;

	this.lerpid = guid();
}

Node.prototype.update = function(dt)
{
	var self = this;


	var vn = new Victor(this.x, this.y);
	var vp = new Victor(this.game.player.x, this.game.player.y);

	if(vn.distance(vp) < Global.leechdistance)
	{
		this.playerwasinrange = true;
		this.leechline.show();
		this.isleeching = true;

		Lerppu.interrupt(this.lerpid);
	}
	else
	{
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
	}
}