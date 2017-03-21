class Cells extends GraphicalElement {

    constructor (svg, className, data, key, x, y, width, height, fill, options) {
        super(svg, className, options);

        var me = this;
        me.attrs = {
            x: x,
            y: y,
            width: width,
            height: height,
            fill: fill
        };

        me.updateData(data, key);
    }

    updateData (data, key) {
        var me = this;

        me.group
            .selectAll('rect')
            .remove();
        me.selection = me.group
            .selectAll('rect')
            .data(data, key)
            .enter()
            .append('rect');
    }

    updateVis (attrs) {
        var me = this;

        for (var j = 0; j < attrs.length; j++) {
            me.selection
                .attr(attrs[j], me.attrs[attrs[j]]);
        }
    }

    addListener (event, callback) {
        var me = this;

        me.selection
            .on(event, callback);
    }
}
