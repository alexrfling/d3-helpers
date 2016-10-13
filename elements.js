//==============================================================================
//                                GraphicalElement
//==============================================================================

class GraphicalElement {
  constructor(svg, id) {
    this.id = id;
    this.group = svg.append("g").attr("id", this.id);
    this.anchor = null;
  }

  position() {
    this.group.attr("transform", "translate(" + this.anchor[0] + "," + this.anchor[1] + ")");
  }

  getBox() {
    return document.getElementById(this.id).getBoundingClientRect();
  }
}

//==============================================================================
//                                    Cells
//==============================================================================

class Cells extends GraphicalElement {
  constructor(svg, id, data, key, x, y, width, height, fill) {
    super(svg, id);
    this.attrs = {
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill
    };
    updateData(data, key);
  }

  updateData(data, key) {
    this.group.selectAll("rect").remove();
    this.selection = this.group.selectAll("rect")
                      .data(data, key)
                      .enter()
                      .append("rect");
    this.updateVis(["x", "y", "width", "height", "fill"]);
  }

  updateVis(attrs) {
    for (var j = 0; j < attrs.length; j++) {
      this.selection.attr(attrs[j], this.attrs[attrs[j]]);
    }
  }

  addListener(event, callback) {
    this.selection.on(event, callback);
  }
}

//==============================================================================
//                                    Labels
//==============================================================================

class Labels extends GraphicalElement {
  constructor(svg, id, names, margin, offset, angled, fontSize, orientation) {
    super(svg, id);
    this.names = names;
    this.margin = margin;
    this.offset = offset;
    this.angled = angled;
    this.factor = this.angled ? 0.75 : 1; // squish factor
    this.scale = d3.scalePoint();
    this.updateNames(this.names);
    this.group.attr("class", "axis").style("font-size", fontSize);
    switch(orientation) {
      case "top":     this.axis = d3.axisTop(this.scale);     break;
      case "left":    this.axis = d3.axisLeft(this.scale);    break;
      case "right":   this.axis = d3.axisRight(this.scale);   break;
      case "bottom":  this.axis = d3.axisBottom(this.scale);  break;
    }
    this.updateVisNT(); // for initial angling
  }

  updateNames(names) {
    this.names = names;
    this.scale.domain(sample(this.names, Math.floor(this.factor * this.margin() / fontSize)))
              .range([this.offset() / 2, this.margin() - this.offset() / 2]);
  }

  updateVis(animDuration) {
    this.updateNames(this.names);
    if (this.angled) {
      this.group.transition().duration(animDuration).call(this.axis)
             .selectAll("text")								 // to angle the other way:
             .style("text-anchor", "start")    // end
             .attr("dx", ".8em")               // -.8em
             .attr("dy", ".15em")              // .15em
             .attr("transform", "rotate(45)"); // rotate(-45)
    } else {
      this.group.transition().duration(animDuration).call(this.axis);
    }
  }

  updateVisNT() {
    this.updateNames(this.names);
    if (this.angled) {
      this.group.call(this.axis)
             .selectAll("text")								 // to angle the other way:
             .style("text-anchor", "start")    // end
             .attr("dx", ".8em")               // -.8em
             .attr("dy", ".15em")              // .15em
             .attr("transform", "rotate(45)"); // rotate(-45)
    } else {
      this.group.call(this.axis);
    }
  }
}

//==============================================================================
//                                    Title
//==============================================================================

class Title extends GraphicalElement {
  constructor(svg, id, text, fontSize) {
    super(svg, id);
    this.text = text;
    this.selection = this.group.append("text").attr("class", "title")
                      .style("font-size", fontSize).text(this.text);
  }

  setText(text) {
    this.text = text;
    this.selection.text(this.text);
  }
}

//==============================================================================
//                                    Title
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
