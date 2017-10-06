'use strict'

// adapted from http://bl.ocks.org/rkirsling/5001347
const d3 = require('d3');

var networkLayout = {
    mousedown_link: null,
    mousedown_node: null,
    mouseup_node: null,
    drawing: false,
};

networkLayout.pathColor = {
    inh: '#b34846',
    exc: '#467ab3'
};

networkLayout.resetMouseVars = () => {
    networkLayout.mousedown_node = null;
    networkLayout.mouseup_node = null;
    networkLayout.mousedown_link = null;
};

networkLayout.addNode = () => {
    app.controller.update()
    return {
        id: networkLayout.lastNodeId++,
        model: undefined,
        params: {},
        vx: 0,
        vy: 0
    }
}

networkLayout.addLink = (source, target) => {
    return {
        id: networkLayout.lastLinkId++,
        source: source.id,
        target: target.id,
    }
}

networkLayout.dragstarted = (d) => {
    if (networkLayout.drawing) return
    app.chart.dragging = true;
    if (!d3.event.active) networkLayout.force.alpha(1).restart();
    d.fx = d.x;
    d.fy = d.y;
}

networkLayout.dragged = (d) => {
    if (networkLayout.drawing) return
    if (!d3.event.active) networkLayout.force.alpha(1);
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

networkLayout.dragended = (d) => {
    if (networkLayout.drawing) return
    if (!d3.event.active) networkLayout.force.alpha(0);
    d.fx = null;
    d.fy = null;
    app.chart.dragging = false;
}

networkLayout.draw_path = (d) => {
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
        dry = 20;

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
    return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
};

networkLayout.ticked = () => {
    networkLayout.path.selectAll('path')
        .attr('d', networkLayout.draw_path)
        .style('stroke',
            (d) => d.syn_spec ? (d.syn_spec.weight < 0 ? networkLayout.pathColor.inh : networkLayout.pathColor.exc) : networkLayout.pathColor.exc
        )
        .style('stroke-width',
            (d) => Math.min(10, Math.max(5, (d.syn_spec ? Math.abs(d.syn_spec.weight / 5) : 5)))
        )
        .style('stroke-dasharray', (d) => d === app.selected_link ? '10, 5' : '')
        .style('marker-end',
            (d) => d.syn_spec ? (d.syn_spec.weight < 0 ? 'url(#end-circle)' : 'url(#end-arrow)') : 'url(#end-arrow)'
        )
    networkLayout.circle.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
    networkLayout.circle.selectAll('circle')
        .style('stroke-dasharray', (d) => d === app.selected_node ? '10, 5' : '');
}

networkLayout.update = () => {
    // console.log(mousedown_node,mouseup_node,selected_node,mousedown_link,selected_link)
    networkLayout.circle.exit().remove();
    networkLayout.path.exit().remove();
    if (app.data.nodes.length == 0) return

    // Apply the general update pattern to the links.
    networkLayout.path = networkLayout.path.data(app.data.links.filter(
        (d) => !(d.disabled || app.data.nodes[d.source].hidden || app.data.nodes[d.target].hidden || app.data.nodes[d.source].disabled || app.data.nodes[d.target].disabled)));

    networkLayout.path.exit().remove();
    networkLayout.path = networkLayout.path.enter().append('g')
        .attr('class', 'link')
        .on('mousedown', (d) => {
            // select link
            networkLayout.mousedown_link = d;
            if (networkLayout.mousedown_link === app.selected_link) app.selected_link = null;
            else app.selected_link = networkLayout.mousedown_link;
            app.selected_node = null;
            networkLayout.update()
        })
        .merge(networkLayout.path)

    networkLayout.path.selectAll('path').remove()
    networkLayout.path.append('path');

    // Apply the general update pattern to the nodes.
    networkLayout.circle = networkLayout.circle.data(
        app.data.nodes.filter((d) => !(d.hidden || d.disabled)),
        (d) => d.index);

    networkLayout.circle.exit().remove();
    networkLayout.circle = networkLayout.circle.enter()
        .append('g')
        .attr('class', 'node')
        .on('mouseover', function(d) {
            // console.log('node mouseover')
            // enlarge target node
            d3.select(this).select('circle').attr('transform', (d) => 'scale(1.1)');
            networkLayout.ticked()
        })
        .on('mouseout', function(d) {
            // console.log('node mouseout')
            // unenlarge target node
            d3.select(this).select('circle').attr('transform', (d) => '');
            networkLayout.ticked()
        })
        .on('mousedown', (d) => {
            // console.log('node mousedown')
            // select node
            networkLayout.mousedown_node = d;
            // if (app.selected_node && networkLayout.mousedown_node != app.selected_node) return
            if (networkLayout.mousedown_node === app.selected_node) app.selected_node = null;
            else app.selected_node = networkLayout.mousedown_node;
            app.selected_link = null;

            if (!networkLayout.drawing && app.selected_node) {
                var node = $('#nodeScrollspy .node[data-id="' + app.selected_node.id + '"]');
                if (node.length == 0) return
                $((node).find('a').attr('href'))[0].scrollIntoView();
                scrollBy(0, -50);
            }

            // reposition drag line
            networkLayout.drag_line
                .style('marker-end', 'url(#end-arrow)')
                .classed('hidden', !networkLayout.drawing)
                .attr('d', 'M' + networkLayout.mousedown_node.x + ',' + networkLayout.mousedown_node.y + 'L' + networkLayout.mousedown_node.x + ',' + networkLayout.mousedown_node.y);

            app.chart.update()
            // networkLayout.ticked()
        })
        .on('mouseup', (d) => {
            // console.log('node mouseup')
            if (!networkLayout.mousedown_node) return;

            // needed by FF
            networkLayout.drag_line
                .classed('hidden', true)
                .style('marker-end', '');

            // check for drag-to-self
            networkLayout.mouseup_node = d;
            if (networkLayout.mouseup_node === networkLayout.mousedown_node) {
                networkLayout.resetMouseVars();
                return;
            }

            // add link to graph (update if exists)
            var source = networkLayout.mousedown_node;
            var target = networkLayout.mouseup_node;

            if (target.element_type == 'stimulator' && target.model != 'spike_dilutor') {
                app.message.show('Error!', 'Stimulators can not be targets.', 2000)
                return
            }
            if (source.element_type == 'recorder') {
                app.message.show('Error!', 'Recorders can not be sources.', 2000)
                return
            }
            if (source.element_type == 'stimulator' && target.element_type == 'recorder') {
                app.message.show('Error!', 'Stimulators can not connect to recorders directly.', 2000)
                return
            }

            var link = app.data.links.filter((l) => {
                return (app.data.nodes[l.source] === source && app.data.nodes[l.target] === target);
            })[0];

            if (!link) {
                link = networkLayout.addLink(source, target)
                app.data.links.push(link);
            }

            // select new node
            app.selected_link = link;
            app.selected_node = null;

            networkLayout.update()
        })
        .call(networkLayout.drag)
        .merge(networkLayout.circle)

    var colors = app.chart.colors();
    networkLayout.circle.selectAll('circle').remove()
    networkLayout.circle.append('circle')
        .attr('r', 23)
        .style('stroke', (d) => colors[d.id % colors.length])
        .style('stroke-width', 4);

    networkLayout.circle.selectAll('text').remove()
    networkLayout.circle.append('text')
        .attr('dx', 0)
        .attr('dy', '.35em')
        // .style('font-weight', (d) => {
        //     console.log(d.model == undefined)
        //     return d.model == undefined ? 'normal' : 'bold'
        // })
        .text((d) => app.format.nodeLabel(d));
    //
    // networkLayout.circle.selectAll('title').remove()
    // networkLayout.circle.append('title')
    //     .text((d) => {
    //         return d.element_type;
    //     })

    if (networkLayout.drawing) {
        networkLayout.circle.on('mousedown.drag', null);
        networkLayout.ticked()
    } else {
        // Update and restart the simulation.
        networkLayout.force
            .nodes(app.data.nodes)
            .alpha(0.01)
            .restart();
    }
}

networkLayout.arc = d3.arc()
    .innerRadius(23)
    .outerRadius(60);

networkLayout.mousedown = function() {

    // console.log('mousedown')
    if (!networkLayout.drawing) return
    // because :active only works in WebKit?
    d3.select('#chart').classed('active', true);
    if (networkLayout.mousedown_node || networkLayout.mousedown_link) return

    var point = d3.mouse(this);
    var colors = app.chart.colors();

    var element_types = ['recorder', 'neuron', 'stimulator']
    element_types.map((d, i) => {
        var select = networkLayout.g.append('g')
            .attr('class', 'select')
            .attr('transform', 'translate(' + point[0] + ',' + point[1] + ')')

        var arc = select.append('path').attr('class', d)
            .datum({
                startAngle: Math.PI * i * 2 / 3,
                endAngle: Math.PI * (i + 1) * 2 / 3
            })
            .style('fill', 'white')
            .style('stroke', () => app.chart.colors(app.data.nodes.length))
            .style('stroke-width', 4)
            .attr('d', networkLayout.arc)
            .on('mouseover', function() {
                d3.select(this).style('fill',
                    () => app.chart.colors(app.data.nodes.length)
                )
            })
            .on('mouseout', function() {
                d3.select(this).style('fill', 'white')
            })
            .on('mouseup', () => {
                app.selected_node = networkLayout.addNode()
                app.selected_node.element_type = d;
                app.selected_node.x = point[0];
                app.selected_node.y = point[1];
                app.data.nodes.push(app.selected_node)
                if (d == 'neuron') {
                    var link = networkLayout.addLink(app.selected_node, app.selected_node);
                    link.disabled = true;
                    app.data.links.push(link)
                }
                networkLayout.update()
                app.controller.init()
            });

        select.append('text')
            .attr('dx', Math.sin(Math.PI * ((i * 2 / 3) + (1 / 3))) * 40)
            .attr('dy', -Math.cos(Math.PI * ((i * 2 / 3) + (1 / 3))) * 40 + 5)
            .text(d.slice(0, 1).toUpperCase());
    })
}

networkLayout.mousemove = function() {
    // console.log('mousemove')
    if (!networkLayout.mousedown_node) return
    if (networkLayout.mousedown_node.element_type == 'recorder') return
    // app.selected_node = networkLayout.mousedown_node;
    var point = d3.mouse(this);
    // update drag line
    networkLayout.drag_line
        .attr('d', 'M' + networkLayout.mousedown_node.x + ',' + networkLayout.mousedown_node.y + 'L' + point[0] + ',' + point[1]);

    networkLayout.ticked()
}

networkLayout.mouseup = () => {
    // console.log('mouseup')
    if (networkLayout.mousedown_node) {
        // hide drag line
        networkLayout.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }

    // because :active only works in WebKit?
    d3.select('#chart').classed('active', false);

    networkLayout.g.selectAll('.select').remove()

    // clear mouse event vars
    networkLayout.resetMouseVars()
    app.selected_node = null;

    networkLayout.ticked()
}

networkLayout.init = (reference) => {
    $(reference).empty()
    networkLayout.lastNodeId = app.data.nodes.length;
    networkLayout.lastLinkId = app.data.links.length;
    networkLayout.drag = d3.drag()
        .on('start', networkLayout.dragstarted)
        .on('drag', networkLayout.dragged)
        .on('end', networkLayout.dragended);
    networkLayout.g = d3.select('#networkLayout')
        .append('g')
        .attr('id', 'clip')
        .attr('clip-path', 'url(#clip)');
    networkLayout.width = +d3.select('#networkLayout').attr('width');
    networkLayout.height = +d3.select('#networkLayout').attr('height');

    // build the arrow.
    networkLayout.g.append('svg:defs').selectAll('marker')
        .data(['end-arrow']) // Different link/path types can be defined here
        .enter().append('svg:marker') // This section adds in the arrows
        .attr('id', String)
        .attr('viewBox', '0 -1.5 6 6')
        .attr('refX', 1.5)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-1.5L3,0L0,1.5');

    // build the circle.
    networkLayout.g.append('svg:defs').selectAll('marker')
        .data(['end-circle']) // Different link/path types can be defined here
        .enter().append('svg:marker') // This section adds in the arrows
        .attr('id', String)
        .attr('viewBox', '0 0 3 3')
        .attr('refX', 1.5)
        .attr('refY', 1.5)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:circle')
        .attr('r', 1.5)
        .attr('transform', 'translate(1.5,1.5)');

    networkLayout.force = d3.forceSimulation()
        // .force('link', d3.forceLink().id((d) => {
        //     return d.id;
        // }))
        // .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(networkLayout.width / 2, networkLayout.height / 2))
        .on('tick', networkLayout.ticked)

    // line displayed when dragging new nodes
    networkLayout.drag_line = networkLayout.g.append('path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

    networkLayout.nodes = networkLayout.g.append('g').attr('id', 'nodes')
    networkLayout.links = networkLayout.g.append('g').attr('id', 'links')

    networkLayout.circle = networkLayout.nodes.selectAll('.node');
    networkLayout.path = networkLayout.links.selectAll('.link');

    // app starts here
    d3.select('#chart')
        .on('mousedown', networkLayout.mousedown)
        .on('mousemove', networkLayout.mousemove)
        .on('mouseup', networkLayout.mouseup);

    networkLayout.update()
    app.chart.networkLayout.toggle(app.config.app().chart.networkLayout)
}

networkLayout.toggle = (visible) => {
    $('#networkLayout').toggle(visible)
    $('#view-networkLayout').find('.glyphicon-ok').toggle(visible)
}

module.exports = networkLayout
