"use strict"

const d3 = require("d3");
var colors = d3.schemeCategory10;

var pathColor = {
    inh: '#b34846',
    exc: '#467ab3'
};

// mouse event vars
window.selected_node = null;
window.selected_link = null;
window.mousedown_link = null;
window.mousedown_node = null;
window.mouseup_node = null;

function resetMouseVars() {
    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function neuralNetwork(reference) {

    var layout = {
        drawing: false
    };
    var nodes = [],
        links = [];

    var lastNodeId = 0,
        lastLinkId = 0;

    layout.nodes = function(x) {
        if (!arguments.length) return nodes;
        nodes = x;
        nodes.map(function(node) {
            node.id = lastNodeId++;
        })
        return layout;
    };

    layout.links = function(x) {
        if (!arguments.length) return links;
        links = x;
        links.map(function(link) {
            link.id = lastLinkId++;
        })
        return layout;
    };

    function dragstarted(d) {
        if (!d3.event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        if (!d3.event.active) simulation.alpha(1);
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alpha(0);
        d.fx = null;
        d.fy = null;
    }

    var drag = d3.drag()
        .on("start", layout.drawing ? null : dragstarted)
        .on("drag", layout.drawing ? null : dragged)
        .on("end", layout.drawing ? null : dragended);

    var svg = d3.select(reference),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
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
    svg.append("svg:defs").selectAll("marker")
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

    var simulation = d3.forceSimulation()
        // .force("link", d3.forceLink().id(function(d) {
        //     return d.id;
        // }))
        // .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    // line displayed when dragging new nodes
    var drag_line = svg.append('path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

    var g = svg.append('g')
        .attr('id', 'layout');
    var circle = g.selectAll(".node"),
        path = g.selectAll(".link");

    layout.restart = function() {
        // console.log(mousedown_node,mouseup_node,selected_node,mousedown_link,selected_link)
        if (!nodes) return

        // Apply the general update pattern to the links.
        path = path.data(data.links, function(d) {
            return d.source + "-" + d.target;
        });
        path.exit().remove();
        path = path.enter().append("g")
            .attr('class', 'link')
            .on('mousedown', function(d) {
                // select link
                mousedown_link = d;
                if (mousedown_link === selected_link) selected_link = null;
                else selected_link = mousedown_link;
                selected_node = null;
                layout.restart()
            })
            .merge(path)

        path.selectAll('path').remove()
        path.append("path");

        // Apply the general update pattern to the nodes.
        circle = circle.data(data.nodes, function(d) {
            return d.index;
        });
        circle.exit().remove();
        circle = circle.enter().append("g")
            .attr("class", "node")
            .call(drag)
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
                mousedown_node = d;
                if (mousedown_node === selected_node) selected_node = null;
                else selected_node = mousedown_node;
                selected_link = null;

                // reposition drag line
                // if (layout.drawing) return
                drag_line
                    .style('marker-end', 'url(#end-arrow)')
                    .classed('hidden', false)
                    .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
                layout.restart()
            })
            .on('mouseup', function(d) {
                if (!mousedown_node) return;

                // needed by FF
                drag_line
                    .classed('hidden', true)
                    .style('marker-end', '');

                // check for drag-to-self
                mouseup_node = d;
                if (mouseup_node.id == mousedown_node.id) {
                    resetMouseVars();
                    return;
                }

                // add link to graph (update if exists)
                var source = mousedown_node;
                var target = mouseup_node;

                var link = links.filter(function(l) {
                    return (nodes[l.source] === source && nodes[l.target] === target);
                })[0];

                if (!link) {
                    link = {
                        id: ++lastLinkId,
                        source: source.id,
                        target: target.id,
                    };
                    links.push(link);
                }

                // select new link
                selected_link = link;
                selected_node = null;
                layout.restart()
            })
            .merge(circle)

        circle.selectAll('circle').remove()
        circle.append("circle")
            .attr("r", 25)
            .style('stroke', function(d, i) {
                return colors[i % 10];
            })

        circle.selectAll('text').remove()
        circle.append("text")
            .attr("dx", 0)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.name || d.type.charAt(0).toUpperCase();
            });

        circle.selectAll('title').remove()
        circle.append("title")
            .text(function(d) {
                return d.type;
            })

        // Update and restart the simulation.
        simulation.nodes(nodes)
            .alpha(0.01)
            .restart();

        return layout
    }

    var draw_path = function(d) {
        // `http://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node

        var source = data.nodes[d.source],
            target = data.nodes[d.target];

        var x1 = source.x,
            y1 = source.y,
            x2 = target.x,
            y2 = target.y,
            dx = x2 - x1,
            dy = y2 - y1,
            dr = Math.sqrt(dx * dx + dy * dy),
            r = 30,

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

    function ticked() {
        path.selectAll('path')
            .attr("d", draw_path)
            .style("stroke", function(d) {
                return d.syn_spec ? (d.syn_spec.weight < 0 ? pathColor.inh : pathColor.exc) : pathColor.exc
            })
            .style("stroke-width", function(d) {
                return Math.min(10, Math.max(5, (d.syn_spec ? Math.abs(d.syn_spec.weight) : 5)))
            })
            .style("stroke-dasharray", function(d) {
                return d === selected_link ? '10, 2' : '';
            })
            .style("marker-end", function(d) {
                return d.syn_spec ? (d.syn_spec.weight < 0 ? "url(#end-circle)" : "url(#end-arrow)") : "url(#end-arrow)"
            })

        circle.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        circle.selectAll('circle').style('fill', function(d, i) {
            return (d === selected_node) ? d3.rgb(colors[d.index % 10]).brighter().toString() : "white";
        });

        circle.selectAll('title')
            .text(function(d) {
                return replaceAll((d.model ? d.model : d.type), '_', ' ');
            });
    }

    function mousemove() {
        // console.log(mousedown_node, mousedown_link)
        if (!mousedown_node) return;

        var point = d3.mouse(this);

        // update drag line
        drag_line
            .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + point[0] + ',' + point[1]);
        layout.restart()
    }

    function mouseup() {
        if (mousedown_node) {
            // hide drag line
            drag_line
                .classed('hidden', true)
                .style('marker-end', '');
        }

        // because :active only works in WebKit?
        svg.classed('active', false);

        // clear mouse event vars
        layout.restart()
    }

    function dblclick() {
        // because :active only works in WebKit?
        svg.classed('active', true);

        // if (mousedown_node || mousedown_link) return;
        if (!layout.drawing) return

        var point = d3.mouse(this);
        selected_node = {
            index: nodes.length,
            id: lastNodeId++,
            model: undefined,
            params: {},
            type: 'neuron',
            x: point[0],
            y: point[1],
            vx: 0,
            vy: 0
        }
        nodes.push(selected_node)
        layout.restart()
    }

    // // app starts here
    // svg.on('mousemove', mousemove)
    //     .on('mouseup', mouseup)
    //     .on('dblckick', dblclick);

    return layout
}

module.exports = neuralNetwork
