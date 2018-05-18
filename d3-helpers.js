(function (global, factory) {

    (typeof exports === 'object' && typeof module !== 'undefined')
        ? factory(exports)
        : ((typeof define === 'function' && define.amd)
            ? define(['exports'], factory)
            : factory(global.d3 = (global.d3 || {})));

}(this, function (exports) {

    'use strict';

    // need to use additional CSS to use this, e.g.:
    //    rect:hover {
    //      filter: url('#shadow');
    //    }
    function addDropShadowFilter (svg, id) {
        var filter = svg
            .append('filter')
            .attr('id', id)
            .attr('x', -2)
            .attr('y', -2)
            .attr('width', 10)
            .attr('height', 10);
        filter
            .append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 4);
        filter
            .append('feOffset')
            .attr('dx', 0)
            .attr('dy', 0);

        var filterMerge = filter
            .append('feMerge');
        filterMerge
            .append('feMergeNode');
        filterMerge
            .append('feMergeNode')
            .attr('in', 'SourceGraphic');
    }

    // returns a string that should be usable as an HTML id (work in progress)
    function htmlEscape (str) {
        return ('_' + str).replace(/\||\.|\*|\/|\(|\)|'|"| /g, '_');
    }

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

        bindEventListeners () {
            var me = this;
            var events = Object.keys(me.options.callbacks);

            for (var j = 0; j < events.length; j++) {
                var event = events[j];

                me.selection
                    .on(event, me.options.callbacks[event]);
            }
        }
    }

    class Axis extends GraphicalElement {

        constructor (svg, className, scale, fontSize, orientation, options) {
            super(svg, className, options);

            var me = this;
            me.scale = scale;
            me.fontSize = fontSize;

            me.group
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

            if (me.options.tickFormat) {
                me.axis.tickFormat(me.options.tickFormat);
            }
        }

        updateVis (animDuration) {
            var me = this;

            if (animDuration) {
                me.group
                    .transition()
                    .duration(animDuration)
                    .call(me.axis);
            } else {
                me.group
                    .call(me.axis);
            }
        }

        updateTicks () {
            var me = this;

            me.group
                .call(me.axis.tickSize(me.options.tickSize(), 0, 0));
        }
    }

    class Bucketizer {

        constructor (dividers, colors) {
            var me = this;
            me.domain = dividers.slice(); // copy
            me.domain.push(Number.POSITIVE_INFINITY);
            me.range = colors;
        }

        bucketize (value) {
            var me = this;

            for (var j = 0; j < me.domain.length - 1; j++) {
                if (value < me.domain[j] && value < me.domain[j + 1]) {
                    return me.range[j];
                }
            }

            return me.range[me.range.length - 1];
        }
    }

    class ElementCollection extends GraphicalElement {

        constructor (svg, className, elementType, attrs, options) {
            super(svg, className, options);

            var me = this;
            me.elementType = elementType;
            me.attrs = attrs;
        }

        updateData (data, key) {
            var me = this;

            me.group
                .selectAll(me.elementType)
                .remove();
            me.selection = me.group
                .selectAll(me.elementType)
                .data(data, key)
                .enter()
                .append(me.elementType);
        }

        updateDataWithDomIds (data, key) {
            var me = this;

            me.group
                .selectAll(me.elementType)
                .remove();
            me.selection = me.group
                .selectAll(me.elementType)
                .data(data, key)
                .enter()
                .append(me.elementType)
                .attr('id', function (d) { return htmlEscape(key(d)); });
        }

        updateVis () {
            var me = this;

            for (var j = 0; j < arguments.length; j++) {
                var attribute = arguments[j];

                me.selection
                    .attr(attribute, me.attrs[attribute]);
            }
        }
    }

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

            me.selection = me.group
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
                    .addEventListener('resize', me.options.onWindowResize);
            }

            // initialize
            me.resize();
        }

        resize (width, height) {
            var me = this;
            me.divWidth = ((me.options.onWindowResize ? me.parent.clientWidth : width) || me.divWidth);
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

    class Title extends GraphicalElement {

        constructor (svg, className, text, fontSize, options) {
            super(svg, className, options);

            var me = this;
            me.text = text;
            me.selection = me.group
                .append('text')
                .style('font-size', fontSize)
                .text(me.text);
        }

        setText (text) {
            var me = this;
            me.text = text;

            me.selection
                .text(me.text);
        }
    }

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

    class Widget {

        constructor (id, options) {
            var me = this;
            me.id = id;
            me.options = (options || {});
        }

        // removes all HTML nodes inside the element which has this widget's id
        destroy () {
            var me = this;
            var node = document.getElementById(me.id);

            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }

        // returns the given object
        identity (d) {
            return d;
        }

        // returns an array of length 'length' whose elements are colors
        // interpolated from the colors 'low' to 'mid' to 'high'
        interpolateColors (low, mid, high, length) {
            var midLow = Math.floor(length / 2);
            var midHigh = Math.ceil(length / 2);
            var lowToMidF = d3.interpolateLab(low, mid);
            var lowToMid = d3.range(midLow).map(function (j) {
                return lowToMidF(j / midLow);
            });
            var midToHighF = d3.interpolateLab(mid, high);
            var midToHigh = d3.range(midHigh).map(function (j) {
                return midToHighF(j / midHigh);
            });

            return lowToMid.concat(midToHigh);
        }

        // returns the key field of the given object
        key (d) {
            return d.key;
        }

        // returns the number 'number' rounded to 'decimals' decimal places
        round (number, decimals) {
            return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
        }

        // returns 0
        zero () {
            return 0;
        }
    }

    exports.addDropShadowFilter = addDropShadowFilter;
    exports.htmlEscape = htmlEscape;
    exports.Axis = Axis;
    exports.Bucketizer = Bucketizer;
    exports.ElementCollection = ElementCollection;
    exports.GraphicalElement = GraphicalElement;
    exports.Labels = Labels;
    exports.SVGContainer = SVGContainer;
    exports.Title = Title;
    exports.Tooltip = Tooltip;
    exports.Widget = Widget;

    Object.defineProperty(exports, '__esModule', { value: true });
}));
