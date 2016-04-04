function Aoe(game, x, y)
{
	this.game = game;
	this.x = x;
	this.y = y;
	this.rad = Global.aoeminrad;

	this.color = 0xf1c40f;

	this.bursted = false;
	this.readytoburst = false;

	this.shakemod = -1;
	this.shakeamount = 6;

	this.burstivl = null;

	this.graphics = new PIXI.Graphics();

	this.game.stage.addChild(this.graphics);
}

Aoe.prototype.update = function(dt)
{
	var self = this;

	this.rad += Global.aoeGrowRate * dt;

	if(this.rad > Global.aoemaxrad)
	{
		this.readytoburst = true;
		this.rad = Global.aoemaxrad;
	}

	if(this.readytoburst && !this.bursted)
	{
		this.game.expwarning.play();

		this.color = 0xd35400;

		this.rad += this.shakeamount * this.shakemod;

		this.shakemod *= -1;

		this.burstivl = setTimeout(function()
		{
			self.burst();
		}, Global.aoeTimeBeforeBurst);
	}
}

Aoe.prototype.draw = function()
{
	this.graphics.clear();
    this.graphics.lineStyle(0, this.color, 0.2);
    this.graphics.beginFill(this.color, 0.2);
    this.graphics.drawCircle(this.x, this.y, this.rad);
    this.graphics.endFill();

	this.game.renderer.render(this.graphics);
}

Aoe.prototype.burst = function()
{
	if(this.bursted)
		return;

	var av = new Victor(this.x, this.y);
	var pv = new Victor(this.game.player.x, this.game.player.y);

	if(av.distance(pv) < this.rad)
	{
		console.log('dmg')
		this.game.player.damage(this);
	}

	this.game.stage.removeChild(this.graphics);
	this.bursted = true;

	this.game.explosionsound.play();
}