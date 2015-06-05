﻿var Finish = createClass({
    extend: AppObject,

    construct: function () {
        AppObject.call(this);
        this.texture = 'finish.png';

    },

    init: function (drawArea) {
        this.drawArea = drawArea;
        this.x = parseFloat(drawArea.w - this.r * 10);
        this.y = parseFloat(drawArea.h / 2);
    }

});