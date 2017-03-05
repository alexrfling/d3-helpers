//==============================================================================
//                                SVGContainer
//==============================================================================

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


//==============================================================================
//                                  Tooltip
//==============================================================================

class Tooltip {

    constructor (container, title, labels, accessor) {
        var me = this;
        me.container = container;
        me.title = title;
        me.labels = labels;
        me.accessor = accessor;

        me.group = me.container
            .append('div')
            .attr('class', 'tooltip')
            .classed('hidden', true);
        me.titleElement = me.group
            .append('p')
            .text(title);
        me.table = me.group
            .append('table');

        me.setup(me.labels);
    }

    setup (labels) {
        var me = this;
        me.labels = labels;

        me.table
            .selectAll('tr')
            .remove();
        var rows = me.table
            .selectAll('tr')
            .data(me.labels)
            .enter()
            .append('tr');
        rows.append('td')
            .append('p')
            .text(function (d) { return d.text; });
        rows.append('td')
            .append('p')
            .attr('id', function (d) { return d.id; });
    }

    show (d, rect) {
        var me = this;
        var box = rect.getBoundingClientRect();
        var anchor = [box.left + box.width + window.pageXOffset,
                      box.top + box.height + window.pageYOffset];

        me.group
            .style('left', anchor[0] + 'px')
            .style('top', anchor[1] + 'px')
            .classed('hidden', false);

        var keys = Object.keys(me.accessor(d));
        for (var j = 0; j < keys.length; j++) {
            me.group.select('#' + keys[j]).text(me.accessor(d)[keys[j]]);
        }
    }

    hide () {
        var me = this;

        me.group.classed('hidden', true);
    }
}
