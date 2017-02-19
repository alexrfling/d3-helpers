//==============================================================================
//                                GraphicalElement
//==============================================================================

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

//==============================================================================
//                                    Cells
//==============================================================================

class Cells extends GraphicalElement {

    constructor (svg, id, data, key, x, y, width, height, fill) {
        super(svg, id);

        var me = this;
        me.attrs = {
            x: x,
            y: y,
            width: width,
            height: height,
            fill: fill
        };

        me.updateData(data, key);
    }

    updateData (data, key) {
        var me = this;

        me.group
            .selectAll('rect')
            .remove();
        me.selection = me.group
            .selectAll('rect')
            .data(data, key)
            .enter()
            .append('rect');
    }

    updateVis (attrs) {
        var me = this;

        for (var j = 0; j < attrs.length; j++) {
            me.selection.attr(attrs[j], me.attrs[attrs[j]]);
        }
    }

    addListener (event, callback) {
        var me = this;

        me.selection.on(event, callback);
    }
}

//==============================================================================
//                                    Labels
//==============================================================================

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

        me.updateVisNT(); // for initial angling
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
    }

    updateVisNT () {
        var me = this;

        me.updateNames(me.names);

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

//==============================================================================
//                                    Title
//==============================================================================

class Title extends GraphicalElement {

    constructor (svg, id, text, fontSize) {
        super(svg, id);

        var me = this;
        me.text = text;

        me.selection = me.group
            .append('text')
            .attr('class', 'title')
            .style('font-size', fontSize)
            .text(me.text);
    }

    setText (text) {
        var me = this;
        me.text = text;

        me.selection.text(me.text);
    }
}
