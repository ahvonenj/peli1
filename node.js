function Node(game, sprite, x, y)
{
	this.game = game;
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;

	this.exists = false;
	this.isleeching = false;
	this.leechline = null;
}

Node.prototype.update = function(dt)
{
	//this.x += 10 * dt;
	//this.y += 10 * dt;


	var vn = new Victor(this.x, this.y);
	var vp = new Victor(this.game.player.x, this.game.player.y);

	if(vn.distance(vp) < Global.leechdistance)
	{
		if(!this.isleeching)
		{
			this.leechline = new Leechline(this.game, this);
			this.isleeching = true;
		}
	}
	else
	{
		if(this.leechline !== null)
		{
			this.isleeching = false;
			this.leechline.destroy();
			this.leechline = null;
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