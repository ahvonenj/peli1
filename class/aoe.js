function Aoe(game, sprite, x, y)
{
	this.game = game;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
}

Aoe.prototype.update = function(dt)
{

	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
}

Aoe.prototype.draw = function()
{
	
}