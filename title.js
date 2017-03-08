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
