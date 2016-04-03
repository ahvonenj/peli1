function Player(game)
{
	this.game = game;

	this.starthealth = Global.starthealth;
	this.health = this.starthealth;

	this.istakingdamage = false;



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

    this.damagegraphics = new PIXI.Graphics();
    this.game.stage.addChild(this.damagegraphics);
}

Player.prototype.damage = function()
{
	var self = this;

	this.istakingdamage = true;
	this.health -= Global.nodedamage;

	if(this.health <= 0)
		this.health = 0;

	this.game.leechsound.play();
	this.damagegraphics.alpha = 1;
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

	this.damagegraphics.alpha -= Global.playerDamageAlphaDecay * dt;
}

Player.prototype.draw = function()
{
	this.game.renderer.render(this.sprite);

	if(this.istakingdamage)
	{
		this.damagegraphics.clear();
	    this.damagegraphics.lineStyle(2, 0xFF00FF, 1);
	    this.damagegraphics.beginFill(0xFF00FF, 0);
	    this.damagegraphics.drawCircle(this.x + Global.playerrad, this.y + Global.playerrad, Global.playerrad * 3);
	    this.damagegraphics.endFill();  

		this.game.renderer.render(this.damagegraphics);
	}
}