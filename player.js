function Player(game)
{
	this.game = game;

	this.starthealth = 100;
	this.health = this.starthealth;



	
	this.x = null;
	this.y = null;

	this.playergraphics = new PIXI.Graphics();
	this.playergraphics.clear();
    //this.playergraphics.lineStyle(3, 0xFF0000, 1);
    this.playergraphics.beginFill(0xFF0000, 1);
    this.playergraphics.drawCircle(999999, 999999, Global.playerrad);
    this.playergraphics.endFill();   

    this.playertex = this.playergraphics.generateTexture();

    this.sprite = new PIXI.Sprite(this.playertex);

    this.game.stage.addChild(this.sprite);
}

Player.prototype.update = function(dt)
{
	if(Global.mouse.x !== null && Global.mouse.y !== null)
	{
		this.x = Global.mouse.x;
		this.y = Global.mouse.y;
	}

	if(this.x !== null && this.y !== null)
	{
		this.sprite.position.x = this.x;
		this.sprite.position.y = this.y;
	}
}

Player.prototype.draw = function()
{
	this.game.renderer.render(this.sprite);
}