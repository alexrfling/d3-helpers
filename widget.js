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
}
