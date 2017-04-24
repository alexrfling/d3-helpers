class ElementCollection extends GraphicalElement {

    constructor (svg, className, elementType, attrs, data, key, options) {
        super(svg, className, options);

        var me = this;
        me.elementType = elementType;
        me.attrs = attrs;

        me.updateData(data, key);
    }

    updateData (data, key) {
        var me = this;

        me.group
            .selectAll(me.elementType)
            .remove();
        me.selection = me.group
            .selectAll(me.elementType)
            .data(data, key)
            .enter()
            .append(me.elementType);
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
