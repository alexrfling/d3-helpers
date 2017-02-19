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
