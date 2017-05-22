class SVGContainer {

    constructor (parentId, divClass, svgClass, margin, width, height, options) {
        var me = this;
        me.options = (options || {});
        me.parentId = parentId;
        me.parent = document.getElementById(me.parentId);
        me.margin = margin;
        me.divWidth = (width || me.parent.clientWidth);
        me.divHeight = height;
        me.svgWidth = me.divWidth - me.margin.left - me.margin.right;
        me.svgHeight = me.divHeight - me.margin.top - me.margin.bottom;

        me.div = d3.select('#' + me.parentId)
            .append('div')
            .attr('class', divClass);
        me.SVG = me.div
            .append('svg')
            .attr('class', svgClass);
        me.svg = me.SVG
            .append('g')
            .attr('transform', 'translate(' + me.margin.left + ',' + me.margin.top + ')');

        if (me.options.onWindowResize) {
            window
                .addEventListener('resize', me.onWindowResize);
        }

        // initialize
        me.resize(me.divWidth, me.divHeight);
    }

    resize (width, height) {
        var me = this;
        me.divWidth = (width || me.parent.clientWidth);
        me.divHeight = (height || me.divHeight);
        me.svgWidth = me.divWidth - me.margin.left - me.margin.right;
        me.svgHeight = me.divHeight - me.margin.top - me.margin.bottom;

        me.SVG
            .attr('width', me.divWidth)
            .attr('height', me.divHeight);

        return {
            divWidth: me.divWidth,
            divHeight: me.divHeight,
            svgWidth: me.svgWidth,
            svgHeight: me.svgHeight
        };
    }
}
