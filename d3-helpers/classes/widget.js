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

    // clear out DOM elements inside parent and return a container to hold
    // all HTML and SVG elements
    newDefaultSVGContainer (options) {
        var me = this;
        me.destroy();

        return new SVGContainer(
            me.id,
            'd3-helpers-widget-div',
            'd3-helpers-widget-svg',
            me.options.SVG_MARGINS,
            options.width,
            (options.height || me.options.DEFAULT_HEIGHT),
            {
                onWindowResize: (options.width ? null : function () { me.resize.call(me); })
            }
        );
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
