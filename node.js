function Node(game, sprite, x, y)
{
	this.game = game;
	this.sprite = sprite;
	this.x = x || 0;
	this.y = y || 0;

	this.game.stage.addChild(this.sprite);
}

Node.prototype.update = function(dt)
{
	//this.x += 10 * dt;
	//this.y += 10 * dt;



	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
}

Node.prototype.draw = function()
{
	this.game.renderer.render(this.sprite);
}