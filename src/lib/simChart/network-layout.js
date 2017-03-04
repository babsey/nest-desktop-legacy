"use strict"

const d3 = require("d3");

var layout = {
    mousedown_link: null,
    mousedown_node: null,
    mouseup_node: null,
    drawing: false,
};

layout.pathColor = {
    inh: '#b34846',
    exc: '#467ab3'
};

layout.resetMouseVars = function() {
    layout.mousedown_node = null;
    layout.mouseup_node = null;
    layout.mousedown_link = null;
};

layout.dragstarted = function(d) {
    app.simChart.dragging = true;
    if (!d3.event.active) layout.simulation.alpha(1).restart();
    d.fx = d.x;
    d.fy = d.y;
}

layout.dragged = function(d) {
    if (!d3.event.active) layout.simulation.alpha(1);
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

layout.dragended = function(d) {
    if (!d3.event.active) layout.simulation.alpha(0);
    d.fx = null;
    d.fy = null;
    app.simChart.dragging = false;
}

layout.draw_path = function(d) {
    // `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node

    var source = app.data.nodes[d.source],
        target = app.data.nodes[d.target];

    var x1 = source.x,
        y1 = source.y,
        x2 = target.x,
        y2 = target.y,
        dx = x2 - x1,
        dy = y2 - y1,
        dr = Math.sqrt(dx * dx + dy * dy),
        r = 28,

        // Defaults for normal edge.
        drx = dr,
        dry = dr,
        xRotation = 0, // degrees
        largeArc = 0, // 1 or 0
        sweep = 1; // 1 or 0

    // Self edge.
    if (x1 === x2 && y1 === y2) {
        // Fiddle with this angle to get loop oriented.
        xRotation = 0;

        // Needs to be 1.
        largeArc = 1;

        // Change sweep to change orientation of loop.
        sweep = 0;

        // Make drx and dry different to get an ellipse
        // instead of a circle.
        drx = 15;
        dry = 30;

        // For whatever reason the arc collapses to a point if the beginning
        // and ending points of the arc are the same, so kludge it.

        x1 = x1 - r / 2 / Math.sqrt(2);
        y1 = y1 + r;
        x2 = x2 + r / 2 / Math.sqrt(2);
        y2 = y2 + r * Math.sqrt(2);
    } else {
        x1 = x1 + (dx / dr * r);
        y1 = y1 + (dy / dr * r);
        x2 = x2 - (dx / dr * r) * Math.sqrt(2);
        y2 = y2 - (dy / dr * r) * Math.sqrt(2);
    }
    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
};

layout.ticked = function() {
    layout.path.selectAll('path')
        .attr("d", layout.draw_path)
        .style("stroke", function(d) {
            return d.syn_spec ? (d.syn_spec.weight < 0 ? layout.pathColor.inh : layout.pathColor.exc) : layout.pathColor.exc
        })
        .style("stroke-width", function(d) {
            return Math.min(10, Math.max(5, (d.syn_spec ? Math.abs(d.syn_spec.weight / 5) : 5)))
        })
        .style("stroke-dasharray", function(d) {
            return d === app.selected_link ? '10, 2' : '';
        })
        .style("marker-end", function(d) {
            return d.syn_spec ? (d.syn_spec.weight < 0 ? "url(#end-circle)" : "url(#end-arrow)") : "url(#end-arrow)"
        })

    layout.circle.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    var colors = app.simChart.colors;
    layout.circle.selectAll('circle').style('fill', function(d, i) {
        return (d === app.selected_node) ? d3.rgb(colors[d.index % colors.length]).brighter().toString() : "white";
    });

    layout.circle.selectAll('title')
        .text(function(d) {
            return app.format.replaceAll((d.model ? d.model : d.type), '_', ' ');
        });
}

layout.update = function() {
    // console.log(mousedown_node,mouseup_node,selected_node,mousedown_link,selected_link)
    if (app.data.nodes.length == 0) return

    if (app.selected_node) {
        $($('#nodeScrollspy').find('.node_' + app.selected_node.id).find('a').attr('href'))[0].scrollIntoView();
    }

    // Apply the general update pattern to the links.
    layout.path = layout.path.data(app.data.links.filter(function(d) {
        return !(app.data.nodes[d.source].hidden || app.data.nodes[d.target].hidden)
    }));

    layout.path.exit().remove();
    layout.path = layout.path.enter().append("g")
        .attr('class', 'link')
        .on('mousedown', function(d) {
            // select link
            layout.mousedown_link = d;
            if (layout.mousedown_link === app.selected_link) app.selected_link = null;
            else app.selected_link = layout.mousedown_link;
            app.selected_node = null;
            layout.update()
        })
        .merge(layout.path)

    layout.path.selectAll('path').remove()
    layout.path.append("path");

    // Apply the general update pattern to the nodes.
    layout.circle = layout.circle.data(app.data.nodes.filter(function(d) {
        return !d.hidden
    }), function(d) {
        return d.index;
    });
    layout.circle.exit().remove();
    layout.circle = layout.circle.enter().append("g")
        .attr("class", "node")
        .on('mouseover', function(d) {
            // enlarge target node
            d3.select(this).select('circle').attr('transform', function(d) {
                return 'scale(1.1)';
            });
        })
        .on('mouseout', function(d) {
            // unenlarge target node
            d3.select(this).select('circle').attr('transform', function(d) {
                return '';
            });
        })
        .on('mousedown', function(d) {
            // select node
            layout.mousedown_node = d;
            if (layout.mousedown_node === app.selected_node) app.selected_node = null;
            else app.selected_node = layout.mousedown_node;
            app.selected_link = null;

            if (app.simChart.rasterPlot.barchart) {
                app.simChart.rasterPlot.barchart.update()
            }

            // reposition drag line
            // if (layout.drawing) return
            layout.drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', !layout.drawing)
                .attr('d', 'M' + layout.mousedown_node.x + ',' + layout.mousedown_node.y + 'L' + layout.mousedown_node.x + ',' + layout.mousedown_node.y);
            layout.update()
        })
        .on('mouseup', function(d) {
            if (!layout.mousedown_node) return;

            // needed by FF
            layout.drag_line
                .classed('hidden', true)
                .style('marker-end', '');

            // check for drag-to-self
            layout.mouseup_node = d;

            if (layout.mouseup_node.id == layout.mousedown_node.id) {
                layout.resetMouseVars();
                return
            }

            // add link to graph (update if exists)
            var source = layout.mousedown_node;
            var target = layout.mouseup_node;

            var link = app.data.links.filter(function(l) {
                return (app.data.nodes[l.source] === source && app.data.nodes[l.target] === target);
            })[0];

            if (!link) {
                link = {
                    id: ++lastLinkId,
                    source: source.id,
                    target: target.id,
                };
                app.data.links.push(link);
            }

            // select new node
            app.selected_link = link;
            app.selected_node = null;

            layout.update()
        })
        .call(layout.drag)
        .merge(layout.circle)

    layout.circle.selectAll('circle').remove()

    var colors = app.simChart.colors;
    layout.circle.append("circle")
        .attr("r", 23)
        .style('stroke', function(d) {
            return colors[d.id % colors.length];
        })

    layout.circle.selectAll('text').remove()
    layout.circle.append("text")
        .attr("dx", 0)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.model == 'parrot_neuron' ? 'P' : d.type.charAt(0).toUpperCase();
        });

    layout.circle.selectAll('title').remove()
    layout.circle.append("title")
        .text(function(d) {
            return d.type;
        })

    // Update and restart the simulation.
    layout.simulation.nodes(app.data.nodes)
        .alpha(0.01)
        .restart();
}


layout.mousemove = function() {
    // console.log(mousedown_node, mousedown_link)
    if (!layout.mousedown_node) return;
    var point = d3.mouse(this);
    // update drag line
    laoyut.drag_line
        .attr('d', 'M' + layout.mousedown_node.x + ',' + layout.mousedown_node.y + 'L' + point[0] + ',' + point[1]);
    layout.update()
}

layout.mouseup = function() {
    if (layout.mousedown_node) {
        // hide drag line
        layout.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }
    // because :active only works in WebKit?
    laoyut.g.classed('active', false);
    // clear mouse event vars
    layout.update()
}

layout.dblclick = function() {
    // because :active only works in WebKit?
    laoyut.g.classed('active', true);

    // if (mousedown_node || mousedown_link) return;
    if (!layout.drawing) return

    var point = d3.mouse(this);
    app.selected_node = {
        id: layout.lastNodeId++,
        model: undefined,
        params: {},
        type: 'neuron',
        x: point[0],
        y: point[1],
        vx: 0,
        vy: 0
    }
    app.data.nodes.push(app.selected_node)
    layout.update()
}


layout.init = function(reference) {
    layout.lastNodeId = app.data.nodes.length;
    layout.lastLinkId = app.data.links.length;
    layout.drag = d3.drag()
        .on("start", layout.drawing ? null : layout.dragstarted)
        .on("drag", layout.drawing ? null : layout.dragged)
        .on("end", layout.drawing ? null : layout.dragended);
    layout.g = d3.select(reference);
    layout.width = +layout.g.attr("width");
    layout.height = +layout.g.attr("height");

    // build the arrow.
    layout.g.append("svg:defs").selectAll("marker")
        .data(["end-arrow"]) // Different link/path types can be defined here
        .enter().append("svg:marker") // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -1.5 6 6")
        .attr("refX", 1.5)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-1.5L3,0L0,1.5");

    // build the circle.
    layout.g.append("svg:defs").selectAll("marker")
        .data(["end-circle"]) // Different link/path types can be defined here
        .enter().append("svg:marker") // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 0 3 3")
        .attr("refX", 1.5)
        .attr("refY", 1.5)
        .attr("markerWidth", 3)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("svg:circle")
        .attr("r", 1.5)
        .attr("transform", "translate(1.5,1.5)");

    layout.simulation = d3.forceSimulation()
        // .force("link", d3.forceLink().id(function(d) {
        //     return d.id;
        // }))
        // .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(layout.width / 2, layout.height / 2))
        .on("tick", layout.ticked);

    // line displayed when dragging new nodes
    layout.drag_line = layout.g.append('path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

    layout.nodes = layout.g.append('g').attr('id', 'nodes')
    layout.links = layout.g.append('g').attr('id', 'links')

    layout.circle = layout.nodes.selectAll(".node");
    layout.path = layout.links.selectAll(".link");

    // // app starts here
    // layout.g.on('mousemove', layout.mousemove)
    //     .on('mouseup', layout.mouseup)
    //     .on('dblckick', layout.dblclick);

    layout.update()
}

module.exports = layout
