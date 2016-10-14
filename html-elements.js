//==============================================================================
//                                  Tooltip
//==============================================================================

class Tooltip {
  constructor(container, title, labels, accessor) {
    this.title = title;
    this.labels = labels;
    this.accessor = accessor;
    this.group = container.append("div").attr("class", "tooltip").classed("hidden", true);
    this.titleElement = this.group.append("p").text(title);
    this.table = this.group.append("table");
    this.setup(this.labels);
  }

  setup(labels) {
    this.labels = labels;
    this.table.selectAll("tr").remove();
    var rows = this.table.selectAll("tr").data(this.labels).enter().append("tr");
    rows.append("td").append("p").text(function(d) { return d.text; });
    rows.append("td").append("p").attr("id", function(d) { return d.id; });
  }

  show(d, rect) {
    var box = rect.getBoundingClientRect(),
        anchor = [box.left + box.width + window.pageXOffset,
                  box.top + box.height + window.pageYOffset];
    this.group.style("left", anchor[0] + "px")
              .style("top", anchor[1] + "px")
              .classed("hidden", false);
    var keys = Object.keys(this.accessor(d));
    for (var j = 0; j < keys.length; j++) {
      this.group.select("#" + keys[j]).text(this.accessor(d)[keys[j]]);
    }
  }

  hide() {
    this.group.classed("hidden", true);
  }
}
