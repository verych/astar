var Info = createClass({
    extend: AppObject,

    construct: function (drawArea, starts) {
        AppObject.call(this);
        this.drawArea = drawArea;
        this.x = 10;
        this.y = 0;
        this.r = 2;
        this.a = 0.7;
        this.starts = starts;
        this.fps = 0;
    },

    pixiGetText: function () {
        // center the sprites anchor point
        this.text = new PIXI.Text('', { font: "10px Arial", fill: "black" });

        this.text.anchor.x = 0;
        this.text.anchor.y = 0;

        // move the sprite t the center of the screen
        this.text.position.x = this.x;
        this.text.position.y = this.y;

        this.updateInfo();
        return this.text;
    },

    getSoldiers: function () {
        var res = 0;

        for (var i = 0; i < this.starts.length; i++) {
            res += this.starts[i].soldiers.length;
        }

        return res;
    },

    updateInfo: function (fps) {
        if (fps > 0 || fps == 0) {
            this.fps = fps;
        }
        this.text.text = "fps: " + this.fps + "; Soldiers: " + this.getSoldiers();
    },

    draw: function (context) {
        context.save();

        //drawing soldiers
        context.fillStyle = "rgba(0,0,0," + this.a + ")";
        context.fillText("Soldiers: " + this.getSoldiers(), this.x + this.drawArea.ox, this.y + this.drawArea.oy);

        //drawing fps
        context.fillStyle = "rgba(0,0,0," + this.a + ")";
        context.fillText("fps: " + game.fpsValue, this.x + this.drawArea.ox + 100, this.y + this.drawArea.oy);

        context.restore();
    }
});