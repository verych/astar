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
        this.text = new PIXI.Text('', { font: "12px Arial", fill: "white" });

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

    updateInfo: function (fps, cps) {
        if (fps > 0 || fps == 0) {
            this.fps = fps;
        }
        //this.text.text = "fps: " + this.fps + "; Soldiers: " + this.getSoldiers() + "; Timers: " + window.activeIntervals + "; cps: " + cps + "SCORE: " + game.totalScore;
        //this.text.text = "Towers: " + game.towerPoints + " | Shooters: " + game.shooterPoints + " | SCORE: " + game.totalScore + " | Skipped: " + game.totalSkipped + ' [Debug: fps=' + this.fps + ' cps=' + cps + '(' + window.astarCounter + ')]';
        this.text.text = "Towers: " + game.towerPoints + " | Shooters: " + game.shooterPoints + " | SCORE: " + game.totalScore + " | Skipped: " + game.totalSkipped;
    },
});