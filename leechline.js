function Leechline(game, node)
{
	this.game = game;
	this.node = node;

	this.graphics = new PIXI.Graphics();
	this.game.stage.addChild(this.graphics);

	this.visible = false;
}

Leechline.prototype.update = function(dt)
{

}

Leechline.prototype.draw = function(dt)
{
	if(this.visible)
	{
		this.graphics.clear();
	    this.graphics.lineStyle(2, 0x00FF00, 1);
	    this.graphics.beginFill(0x00FF00, 1);
	    this.graphics.moveTo(this.node.x + Global.noderad, this.node.y + Global.noderad);
	    this.graphics.lineTo(this.game.player.x + Global.playerrad, this.game.player.y + Global.playerrad);

	    this.graphics.endFill();

		this.game.renderer.render(this.graphics);
	}
}

Leechline.prototype.show = function()
{
	this.visible = true;
	this.graphics.alpha = 1;
}

Leechline.prototype.hide = function()
{
	this.visible = false;
}

Leechline.prototype.destroy = function()
{
	this.game.stage.removeChild(this.graphics);
}