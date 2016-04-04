function Player(game)
{
	this.game = game;

	this.starthealth = Global.starthealth;
	this.health = this.starthealth;

	this.istakingdamage = false;

	this.x = null;
	this.y = null;
	this.shieldradius = 0;

	this.playergraphics = new PIXI.Graphics();
	this.playergraphics.clear();
    //this.playergraphics.lineStyle(3, 0xFF0000, 1);
    this.playergraphics.beginFill(0x27ae60, 1);
    this.playergraphics.drawCircle(999999, 999999, Global.playerrad);
    this.playergraphics.endFill();   

    this.playertex = this.playergraphics.generateTexture();

    this.sprite = new PIXI.Sprite(this.playertex);

    this.sprite.anchor = new PIXI.Point(0.5, 0.5);

    this.game.stage.addChild(this.sprite);

    this.damagegraphics = new PIXI.Graphics();
    this.game.stage.addChild(this.damagegraphics);

    this.aoemultipliergraphics = new PIXI.Graphics();
    this.game.stage.addChild(this.aoemultipliergraphics);
}

Player.prototype.damage = function(source)
{
	var self = this;

	if(!this.game.godmode)
	{
		if(this.health <= 0)
			this.health = 0;
	}

	this.istakingdamage = true;
	this.damagegraphics.alpha = 1;
}

Player.prototype.update = function(dt)
{
	if(Global.mouse.x !== null && Global.mouse.y !== null)
	{
		this.x = Global.mouse.x;
		this.y = Global.mouse.y;

		if(this.x >= Global.width - 2)
			this.x = Global.width - 2;

		if(this.x <= 0)
			this.x = 0;

		if(this.y >= Global.height - 2)
			this.y = Global.height - 2;

		if(this.y <= 0)
			this.y = 0;
	}

	if(this.x !== null && this.y !== null)
	{
		this.sprite.position.x = this.x;
		this.sprite.position.y = this.y;
	}

	if(this.game.aoetotalmultiplier > 1)
	{
		this.aoemultipliergraphics.alpha = 1;
	}

	this.damagegraphics.alpha -= Global.playerDamageAlphaDecay * dt;
	this.aoemultipliergraphics.alpha -= Global.playerMultiplierAlphaDecay * dt;

	if(this.game.aoetotalmultiplier > 1)
	{
		this.aoemultipliergraphics.alpha = 1;
	}
}

Player.prototype.draw = function()
{
	this.game.renderer.render(this.sprite);

	this.damagegraphics.clear();
    this.damagegraphics.lineStyle(2, 0x9b59b6, 1);
    this.damagegraphics.beginFill(0x9b59b6, 0);
    this.damagegraphics.drawCircle(this.x - Global.playerrad / 4, this.y - Global.playerrad / 4, Global.playerrad * 5);
    this.damagegraphics.endFill();  


	this.game.renderer.render(this.damagegraphics);
	this.aoemultipliergraphics.clear();
    this.aoemultipliergraphics.lineStyle(2, 0x1abc9c, 1);
    this.aoemultipliergraphics.beginFill(0x1abc9c, 0);
    this.aoemultipliergraphics.drawCircle(this.x - Global.playerrad / 4, this.y - Global.playerrad / 4, Global.playerrad * 7);
    this.aoemultipliergraphics.endFill();  

	this.game.renderer.render(this.aoemultipliergraphics);
}