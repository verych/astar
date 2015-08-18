/*
* Sprite class is for easy creating simple graphic objects
*/
var AppSprite = createClass({
    extend: AppObject,
    construct: function (map) {
        this.type = 'sprite';
        AppObject.call(this);
        this.map = map;
        this.drawArea = map.drawArea;
        //position on canvas
        this.x = 0;
        this.y = 0;
        //size on canvas
        this.w = 0;
        this.h = 0;
        //sprite image
        this.img = undefined;
        //canvas
        //sprite source position and size
        this.textureSizeX = 0;
        this.textureSizeY = 0;

        this.texture = ''; //different texture for different sprite types
        this.craterTextures = ['crater001.png', 'crater002.png', 'crater003.png'];
        this.brickTextures = ['bricks001.png'];
    },

    createCrater: function (parent) {
        this.texture = this.craterTextures[Math.round(Math.random() * (this.craterTextures.length - 1))];
        this.textureSizeX = 400;
        this.textureSizeY = 400;
        if (parent) {
            this.r = parent.r;
            this.w = parent.r * 2;
            this.h = parent.r * 2;
            this.rotation = Math.random() * Math.PI * 2;
            this.scale = 2;
            this.place(parent.x, parent.y);
        }
        this.map.core.registerGroundObject(this);
    },

    createRoad: function (x, y, r) {
        var index = Math.round(Math.random() * (this.brickTextures.length - 1));
        console.log(index);
        this.texture = this.brickTextures[index];
        this.textureSizeX = 400;
        this.textureSizeY = 400;
        this.rotation = Math.random() * Math.PI * 2;
        this.r = r;
        this.w = parent.r * 2;
        this.h = parent.r * 2;
        this.place(x, y);
        this.map.core.registerRoadObject(this);
    }
});