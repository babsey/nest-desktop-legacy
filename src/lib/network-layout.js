"use strict"

const d3 = require("d3");

var layout = {};

layout.colors = d3.schemeCategory10;
layout.pathColor = {
    inh: '#b34846',
    exc: '#467ab3'
};

layout.resetMouseVars = function() {
    app.mousedown_node = null;
    app.mouseup_node = null;
    app.mousedown_link = null;
};

layout.dragstarted = function(d) {
    app.dragging = true;
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
    app.dragging = false;
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
            return Math.min(10, Math.max(5, (d.syn_spec ? Math.abs(d.syn_spec.weight) : 5)))
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

    layout.circle.selectAll('circle').style('fill', function(d, i) {
        return (d === app.selected_node) ? d3.rgb(layout.colors[d.index % 10]).brighter().toString() : "white";
    });

    layout.circle.selectAll('title')
        .text(function(d) {
            return app.format.replaceAll((d.model ? d.model : d.type), '_', ' ');
        });
}

layout.restart = function() {
    // console.log(mousedown_node,mouseup_node,selected_node,mousedown_link,selected_link)
    if (app.data.nodes.length == 0) return

    // Apply the general update pattern to the links.
    layout.path = layout.path.data(app.data.links, function(d) {
        return d.source + "-" + d.target;
    });
    layout.path.exit().remove();
    layout.path = layout.path.enter().append("g")
        .attr('class', 'link')
        .on('mousedown', function(d) {
            // select link
            app.mousedown_link = d;
            if (app.mousedown_link === app.selected_link) app.selected_link = null;
            else app.selected_link = app.mousedown_link;
            app.selected_node = null;
            layout.restart()
        })
        .merge(layout.path)

    layout.path.selectAll('path').remove()
    layout.path.append("path");

    // Apply the general update pattern to the nodes.
    layout.circle = layout.circle.data(app.data.nodes, function(d) {
        return d.index;
    });
    layout.circle.exit().remove();
    layout.circle = layout.circle.enter().append("g")
        .attr("class", "node")
        .call(layout.drag)
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
            app.mousedown_node = d;
            if (app.mousedown_node === app.selected_node) app.selected_node = null;
            else app.selected_node = app.mousedown_node;
            app.selected_link = null;

            // reposition drag line
            // if (layout.drawing) return
            layout.drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', false)
                .attr('d', 'M' + app.mousedown_node.x + ',' + app.mousedown_node.y + 'L' + app.mousedown_node.x + ',' + app.mousedown_node.y);
            layout.restart()
        })
        .on('mouseup', function(d) {
            if (!app.mousedown_node) return;

            // needed by FF
            layout.drag_line
                .classed('hidden', true)
                .style('marker-end', '');

            // check for drag-to-self
            app.mouseup_node = d;
            if (app.mouseup_node.id == app.mousedown_node.id) {
                layout.resetMouseVars();
                return;
            }

            // add link to graph (update if exists)
            var source = app.mousedown_node;
            var target = app.mouseup_node;

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

            // select new link
            app.selected_link = link;
            app.selected_node = null;
            layout.restart()
        })
        .merge(layout.circle)

    layout.circle.selectAll('circle').remove()
    layout.circle.append("circle")
        .attr("r", 25)
        .style('stroke', function(d, i) {
            return layout.colors[i % 10];
        })

    layout.circle.selectAll('text').remove()
    layout.circle.append("text")
        .attr("dx", 0)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name || d.type.charAt(0).toUpperCase();
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
    if (!app.mousedown_node) return;

    var point = d3.mouse(this);

    // update drag line
    laoyut.drag_line
        .attr('d', 'M' + app.mousedown_node.x + ',' + app.mousedown_node.y + 'L' + point[0] + ',' + point[1]);
    layout.restart()
}

layout.mouseup = function() {
    if (app.mousedown_node) {
        // hide drag line
        layout.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }

    // because :active only works in WebKit?
    laoyut.svg.classed('active', false);

    // clear mouse event vars
    layout.restart()
}

layout.dblclick = function() {
    // because :active only works in WebKit?
    laoyut.svg.classed('active', true);

    // if (mousedown_node || mousedown_link) return;
    if (!app.drawing) return

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
    layout.restart()
}


layout.init = function(reference) {

    layout.lastNodeId = app.data.nodes.length;
    layout.lastLinkId = app.data.links.length;

    layout.drag = d3.drag()
        .on("start", app.drawing ? null : layout.dragstarted)
        .on("drag", app.drawing ? null : layout.dragged)
        .on("end", app.drawing ? null : layout.dragended);

    layout.svg = d3.select(reference);
    layout.width = +layout.svg.attr("width");
    layout.height = +layout.svg.attr("height");

    // build the arrow.
    layout.svg.append("svg:defs").selectAll("marker")
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
    layout.svg.append("svg:defs").selectAll("marker")
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
    layout.drag_line = layout.svg.append('path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

    layout.g = layout.svg.append('g')
        .attr('id', 'layout');
    layout.circle = layout.g.selectAll(".node");
    layout.path = layout.g.selectAll(".link");

    // // app starts here
    // layout.svg.on('mousemove', layout.mousemove)
    //     .on('mouseup', layout.mouseup)
    //     .on('dblckick', layout.dblclick);

    layout.restart()
}


module.exports = layout
