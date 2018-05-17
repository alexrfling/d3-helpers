class ElementCollection extends GraphicalElement {

    constructor (svg, className, elementType, attrs, callbacks, options) {
        super(svg, className, options);

        var me = this;
        me.elementType = elementType;
        me.attrs = attrs;
        me.callbacks = callbacks;
        me.events = Object.keys(callbacks);
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
        me.bindEventListeners();
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
        me.bindEventListeners();
    }

    updateVis () {
        var me = this;

        for (var j = 0; j < arguments.length; j++) {
            var attribute = arguments[j];

            me.selection
                .attr(attribute, me.attrs[attribute]);
        }
    }

    bindEventListeners () {
        var me = this;

        for (var j = 0; j < me.events.length; j++) {
            var event = me.events[j];

            me.selection
                .on(event, me.callbacks[event]);
        }
    }
}
