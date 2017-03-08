class GraphicalElement {

    constructor (svg, id) {
        var me = this;
        me.id = id;
        me.group = svg.append('g').attr('id', me.id);
        me.anchor = null;
    }

    position () {
        var me = this;

        me.group.attr('transform', 'translate(' + me.anchor[0] + ',' + me.anchor[1] + ')');
    }

    getBox () {
        var me = this;

        return document.getElementById(me.id).getBoundingClientRect();
    }
}
