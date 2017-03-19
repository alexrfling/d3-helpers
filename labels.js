class Labels extends GraphicalElement {

    constructor (svg, id, className, names, margin, offset, angled, fontSize, orientation) {
        super(svg, id);

        var me = this;
        me.names = names;
        me.margin = margin;
        me.offset = offset;
        me.angled = angled;
        me.fontSize = fontSize;
        me.factor = (me.angled ? 0.75 : 1); // squish factor
        me.scale = d3.scalePoint();

        me.updateNames(me.names);
        me.group
            .attr('class', className)
            .style('font-size', me.fontSize);

        switch (orientation) {
            case 'top':
                me.axis = d3.axisTop(me.scale);
                break;
            case 'left':
                me.axis = d3.axisLeft(me.scale);
                break;
            case 'right':
                me.axis = d3.axisRight(me.scale);
                break;
            case 'bottom':
                me.axis = d3.axisBottom(me.scale);
                break;
        }

        me.updateVis(); // for initial angling
    }

    updateNames (names) {
        var me = this;
        me.names = names;

        me.scale
            .domain(sample(me.names, Math.floor(me.factor * me.margin() / me.fontSize)))
            .range([me.offset() / 2, me.margin() - me.offset() / 2]);
    }

    updateVis (animDuration) {
        var me = this;

        me.updateNames(me.names);

        if (animDuration) {

            if (me.angled) {
                me.group
                    .transition()
                    .duration(animDuration)
                    .call(me.axis)
                    .selectAll('text')                // to angle the other way:
                    .style('text-anchor', 'start')    // end
                    .attr('dx', '.8em')               // -.8em
                    .attr('dy', '.15em')              // .15em
                    .attr('transform', 'rotate(45)'); // rotate(-45)
            } else {
                me.group
                    .transition()
                    .duration(animDuration)
                    .call(me.axis);
            }
        } else {

            if (me.angled) {
                me.group
                    .call(me.axis)
                    .selectAll('text')                // to angle the other way:
                    .style('text-anchor', 'start')    // end
                    .attr('dx', '.8em')               // -.8em
                    .attr('dy', '.15em')              // .15em
                    .attr('transform', 'rotate(45)'); // rotate(-45)
            } else {
                me.group.call(me.axis);
            }
        }
    }
}
