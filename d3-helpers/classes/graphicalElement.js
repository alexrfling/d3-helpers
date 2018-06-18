class GraphicalElement {

    constructor (svg, className, options) {
        var me = this;
        me.group = svg
            .append('g')
            .attr('class', className);
        me.anchor = null;
        me.options = (options || {});
    }

    position () {
        var me = this;

        me.group
            .attr('transform', 'translate(' + me.anchor[0] + ',' + me.anchor[1] + ')');
    }

    getBox () {
        var me = this;

        return me.group._groups[0][0].getBoundingClientRect();
    }

    bindEventListeners () {
        var me = this;
        var events = Object.keys(me.options.callbacks);

        for (var j = 0; j < events.length; j++) {
            var event = events[j];

            me.selection
                .on(event, me.options.callbacks[event]);
        }
    }

    updateStyle () {
        var me = this;

        for (var j = 0; j < arguments.length; j++) {
            var style = arguments[j];

            me.selection
                .style(style, me.options.styles[style]);
        }
    }
}
