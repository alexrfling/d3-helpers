class Axis extends GraphicalElement {

    constructor (svg, className, scale, fontSize, orientation, options) {
        super(svg, className, options);

        var me = this;
        me.scale = scale;
        me.fontSize = fontSize;

        me.group
            .style('font-size', me.fontSize);

        switch (orientation) {
            case 'top':
                me.axis = d3.axisTop(me.scale);
                break;
            case 'left':
                me.axis = d3.axisLeft(me.scale);
                break;
            case 'right':
                me.axis = d3.axisRight(me.scale);
                break;
            case 'bottom':
                me.axis = d3.axisBottom(me.scale);
                break;
        }
    }

    updateVis (animDuration) {
        var me = this;

        me.group
            .transition()
            .duration(animDuration)
            .call(me.axis);
    }

    updateTicks () {
        var me = this;

        me.group
            .call(me.axis.tickSize(me.options.tickSize(), 0, 0));
    }
}
