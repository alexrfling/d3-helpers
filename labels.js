class Labels extends GraphicalElement {

    constructor (svg, className, names, margin, offset, angled, fontSize, maxLabelLength, orientation, options) {
        super(svg, className, options);

        var me = this;
        me.margin = margin;
        me.offset = offset;
        me.angled = angled;
        me.fontSize = fontSize;
        me.maxLabelLength = maxLabelLength;
        me.factor = (me.angled ? 0.75 : 1); // squish factor
        me.scale = d3.scalePoint();

        me.group
            .style('font-size', me.fontSize);

        switch (orientation) {
            case 'top':
                me.axis = d3.axisTop(me.scale)
                    .tickFormat(me.tickFormat);
                break;
            case 'left':
                me.axis = d3.axisLeft(me.scale)
                    .tickFormat(me.tickFormat);
                break;
            case 'right':
                me.axis = d3.axisRight(me.scale)
                    .tickFormat(me.tickFormat);
                break;
            case 'bottom':
                me.axis = d3.axisBottom(me.scale)
                    .tickFormat(me.tickFormat);
                break;
        }

        me.updateNames(names);
        me.updateVis(); // for initial angling
    }

    tickFormat (d) {
        var keyLength = parseInt(d);

        return d.slice(d.indexOf('_') + 1).slice(keyLength);
    }

    getLabelId (d) {
        var me = this;
        var keyLength = parseInt(d);

        return me.htmlEscape(d.slice(d.indexOf('_') + 1).slice(0, keyLength));
    }

    getEllipsedNames (names) {
        var me = this;

        // HACK yay SVG text ellipsing...
        var text = me.group
            .append('text')
            .style('visibility', 'hidden');

        var ellipsedNames = names.map(function (name) {
            var ellipsedName = name;
            var last = name.length;
            text
                .text(name);

            while (text._groups[0][0].getBoundingClientRect().width > me.maxLabelLength) {
                last = last - 1;
                ellipsedName = name.slice(0, last) + '...';
                text
                    .text(ellipsedName);
            }

            return name.length + '_' + name + ellipsedName;
        });

        text
            .remove();

        return ellipsedNames;
    }

    updateNames (names) {
        var me = this;
        me.names = me.getEllipsedNames(names);

        me.scale
            .domain(me.sample(me.names, Math.floor(me.factor * me.margin() / me.fontSize)))
            .range([me.offset() / 2, me.margin() - me.offset() / 2]);
    }

    updateVis (animDuration) {
        var me = this;

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
                me.group
                    .call(me.axis);
            }
        }

        me.group
            .selectAll('text')
            .attr('id', function (d) { return me.getLabelId.call(me, d); });
    }

    sample (array, max) {
        if (array.length <= max) {
            return array;
        } else {
            var sampler = d3.scaleLinear()
                .domain([0, max - 1])
                .range([0, array.length - 1]);
            var sampledIndices = d3.range(max).map(function (j) {
                return Math.floor(sampler(j));
            });

            return sampledIndices.map(function (j) {
                return array[j];
            });
        }
    }
}
