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

    // returns a String that should be usable as an HTML id (work in progress)
    htmlEscape (str) {
        return ('_' + str).replace(/\||\.|\(|\)|'|"| /g, '_');
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
