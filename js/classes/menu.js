var Menu = createClass({
	extend: AppObject,

	construct: function (map) {
		AppObject.call(this);
		this.x = undefined;
		this.y = undefined;
		this.w = undefined;
		this.h = undefined;
		this.a = 1;
	},

	draw: function (context) {
		context.save();
		
		//drawing soldiers
		context.fillStyle = "rgba(0,0,0," + this.a + ")";
		context.fillText("Soldiers: " + this.soldiers.length, this.x, this.y);

		context.restore();
	}
});