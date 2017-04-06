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

    // returns a string that should be usable as an HTML id (work in progress)
    htmlEscape (str) {
        return ('_' + str).replace(/\||\.|\(|\)|'|"| /g, '_');
    }
}
