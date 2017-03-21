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
