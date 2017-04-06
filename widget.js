class Widget {

    constructor (id, options) {
        var me = this;
        me.id = id;
        me.options = (options || {});
    }

    destroy () {
        var me = this;
        var node = document.getElementById(me.id);

        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    // returns a string that should be usable as an HTML id (work in progress)
    htmlEscape (str) {
        return ('_' + str).replace(/\||\.|\(|\)|'|"| /g, '_');
    }

    // returns the given object
    identity (d) {
        return d;
    }

    interpolateColors (low, mid, high, length) {
        var lowToMidF = d3.interpolateLab(low, mid);
        var lowToMid = d3.range(Math.floor(length / 2)).map(function (j) {
            return lowToMidF(j / Math.floor(length / 2));
        });
        var midToHighF = d3.interpolateLab(mid, high);
        var midToHigh = d3.range(Math.ceil(length / 2)).map(function (j) {
            return midToHighF(j / Math.ceil(length / 2));
        });

        return lowToMid.concat(midToHigh);
    }

    // returns the key field of the given object
    key (d) {
        return d.key;
    }

    // returns 'number' rounded to 'decimals' decimal places
    round (number, decimals) {
        return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
    }
}
