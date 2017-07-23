class Labels extends GraphicalElement {

    constructor (svg, className, labels, margin, offset, angled, fontSize, maxLabelLength, orientation, options) {
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
                me.lengthDimension = 'height';
                break;
            case 'left':
                me.axis = d3.axisLeft(me.scale)
                    .tickFormat(me.tickFormat);
                me.lengthDimension = 'width';
                break;
            case 'right':
                me.axis = d3.axisRight(me.scale)
                    .tickFormat(me.tickFormat);
                me.lengthDimension = 'width';
                break;
            case 'bottom':
                me.axis = d3.axisBottom(me.scale)
                    .tickFormat(me.tickFormat);
                me.lengthDimension = 'height';
                break;
        }

        me.updateLabels(labels);
        me.updateVis(); // for initial angling
    }

    tickFormat (d) {
        var keyLength = parseInt(d);

        // extract ellipsed label from string
        return d.slice(d.indexOf('_') + 1).slice(keyLength);
    }

    getLabelId (d) {
        var me = this;
        var keyLength = parseInt(d);

        // extract original label from string, and escape it
        return htmlEscape(d.slice(d.indexOf('_') + 1).slice(0, keyLength));
    }

    // HACK yay SVG text ellipsing...
    getEllipsedLabels (labels) {
        var me = this;
        var maxLabelLength = me.maxLabelLength();

        // invisible element to test label lengths
        var text = me.group
            .append('text')
            .style('visibility', 'hidden');

        if (me.angled) {
            text                                  // to angle the other way:
                .style('text-anchor', 'start')    // end
                .attr('dx', '.8em')               // -.8em
                .attr('dy', '.15em')              // .15em
                .attr('transform', 'rotate(45)'); // rotate(-45)
        }

        var ellipsedLabels = labels.map(function (label) {
            var ellipsedLabel = label;
            var last = label.length;
            text
                .text(label);

            // if the whole label doesn't fit, chop off one character at a time
            // until it does
            while (last > 0 && text._groups[0][0].getBoundingClientRect()[me.lengthDimension] > maxLabelLength) {
                last = last - 1;
                ellipsedLabel = label.slice(0, last) + '...';
                text
                    .text(ellipsedLabel);
            }

            // store both the ellipsed label (for display) and the original (for
            // id) as well as the label length so they can be separated later
            return label.length + '_' + label + ellipsedLabel;
        });

        // remove the invisible element
        text
            .remove();

        return ellipsedLabels;
    }

    updateLabels (labels) {
        var me = this;
        var margin = me.margin();
        var offset = me.offset() / 2;
        me.allLabels = (labels || me.allLabels);
        me.sampledLabels = me.sample(me.allLabels, Math.floor(me.factor * margin / me.fontSize));
        me.ellipsedLabels = me.getEllipsedLabels(me.sampledLabels);

        me.scale
            .domain(me.ellipsedLabels)
            .range([offset, margin - offset]);
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
