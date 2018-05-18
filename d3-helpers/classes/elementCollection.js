class ElementCollection extends GraphicalElement {

    constructor (svg, className, elementType, attrs, options) {
        super(svg, className, options);

        var me = this;
        me.elementType = elementType;
        me.attrs = attrs;
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

    updateDataWithDomIds (data, key) {
        var me = this;

        me.group
            .selectAll(me.elementType)
            .remove();
        me.selection = me.group
            .selectAll(me.elementType)
            .data(data, key)
            .enter()
            .append(me.elementType)
            .attr('id', function (d) { return htmlEscape(key(d)); });
    }

    updateVis () {
        var me = this;

        for (var j = 0; j < arguments.length; j++) {
            var attribute = arguments[j];

            me.selection
                .attr(attribute, me.attrs[attribute]);
        }
    }
}
