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
        rows
            .append('td')
            .append('p')
            .text(function (d) { return d.text; });
        rows
            .append('td')
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
            me.group
                .select('#' + keys[j])
                .text(me.accessor(d)[keys[j]]);
        }
    }

    hide () {
        var me = this;

        me.group
            .classed('hidden', true);
    }
}
