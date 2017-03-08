class SVGContainer {

    constructor (parentId, divClass, svgClass, resizeCallback, margin, height) {
        var me = this;
        me.parentId = parentId;
        me.parent = document.getElementById(me.parentId);
        me.divClass = divClass;
        me.svgClass = svgClass;
        me.resizeCallback = resizeCallback;
        me.margin = margin;
        me.divWidth = me.parent.clientWidth;
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

        window.addEventListener('resize', me.resizeCallback);
    }

    resize (height) {
        var me = this;
        me.divWidth = me.parent.clientWidth;
        me.divHeight = height || me.divHeight;
        me.svgWidth = me.divWidth - me.margin.left - me.margin.right;
        me.svgHeight = me.divHeight - me.margin.top - me.margin.bottom;

        me.SVG
            .attr('width', me.divWidth)
            .attr('height', me.divHeight);

        return {
            svgWidth: me.svgWidth,
            svgHeight: me.svgHeight
        };
    }
}
