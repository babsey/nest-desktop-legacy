"use strict"

const d3 = require("d3");

var barchart = {
    margin: {
        top: 10,
        right: 40,
        bottom: 40,
        left: 50
    },
    y: 0
};

var margin = barchart.margin;
barchart.xScale = d3.scaleLinear();
barchart.yScale = d3.scaleLinear();
barchart.format = d3.format(".2f");

barchart.transition = d3.transition()
    .ease(d3.easeLinear)
    .duration(1);

var _xAxis, _yAxis;

var _data = [];

barchart.data = function(d) {
    if (!arguments.length) return _data;
    _data = d;
    return barchart
}

var _npop = 1;
barchart.npop = function(d) {
    if (!arguments.length) return _npop;
    _npop = d;
    return barchart
}

var _nbins = 1.;
barchart.nbins = function(d) {
    if (!arguments.length) return _nbins;
    _nbins = d;
    return barchart
}

barchart.xAxis = function(xScale) {
    if (!arguments.length) return _xAxis;
    _xAxis = d3.axisBottom(xScale);

    barchart.g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis")
        .attr("transform", "translate(0," + -1. * +barchart.yScale.range()[1] + barchart.height + ")")
        // .attr("transform", "translate(0," + barchart.height + ")")
        .style('font-size', '14px')
        .call(_xAxis);

    return barchart
}

barchart.yAxis = function(yScale) {
    if (!arguments.length) return _yAxis;
    _yAxis = d3.axisLeft(yScale).ticks(3);

    barchart.g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis")
        .style('font-size', '14px')
        .attr("transform", "translate(0," + -1. * +barchart.yScale.range()[1] + ")")
        .call(_yAxis);

    return barchart
}

barchart.xLabel = function(label) {
    if (!document.getElementsByTagName("xlabel").length) {
        barchart.g.append("text")
            .attr("id", "xlabel")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", +barchart.g.attr('width') / 2)
            .attr("y", +barchart.g.attr('height') + 30)
            .text("Time (ms)");
    }

    barchart.g.select('#xlabel')
        .text(label);
    return barchart
}

barchart.yLabel = function(label) {
    if (!document.getElementsByTagName("ylabel").length) {
        barchart.g.append("text")
            .attr("id", "ylabel")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -1. * +barchart.yScale.range()[1])
            .attr("y", 6)
            .attr("dy", ".71em")
            .attr("text-anchor", "end");
    }

    barchart.g.select('#ylabel')
        .text(label);
    return barchart
}

barchart.onDrag = function(drag) {
    barchart.drag = d3.drag()
        .on("start", function() {
            app.dragging = true
        })
        .on("drag", function() {
            drag()
        })
        .on("end", function() {
            app.dragging = false
        })
    barchart.g.select('#clip')
        .call(barchart.drag);
    return barchart;
}

barchart.onZoom = function(zoom) {
    barchart.zoom = d3.zoom()
        .scaleExtent([.1, 10])
        .on("start", function() {
            app.zooming = true
        })
        .on("zoom", function() {
            zoom()
        })
        .on("end", function() {
            app.zooming = false
        })
    barchart.g.select('#clip')
        .call(barchart.zoom);
    return barchart;
}

barchart.init = function(reference, size) {
    var svg = d3.select(reference),
        width = (size.width ? size.width : +svg.attr("width")) - margin.left - margin.right,
        height = (size.height ? size.height : +svg.attr("height")) - margin.top - margin.bottom;
    barchart.svg = svg;
    barchart.width = width;
    barchart.height = height;

    barchart.xScale.range([0, width])
    barchart.yScale.range([height, 0])

    var g = svg.append("g")
        .attr('height', height)
        .attr('width', width)
        .attr("transform", "translate(" + (margin.left + (size.x ? size.x : 0)) + "," + (margin.top + (size.y ? size.y : 0)) +")");
    barchart.g = g;

    var clip = g.append("g")
        .attr("clip-path", "url(#clip)")
        .attr('id', 'clip');

    // add area for dragging event
    clip.append("rect")
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white');

    return barchart

}

barchart.yVal = function(y) {
    return y // barchart.npop() * 1000. // barchart.binwidth()
}

//
// Bar-chart
//

barchart.update = function() {
    barchart.xScale.range([0, +barchart.g.attr('width')])
    barchart.yScale.range([+barchart.g.attr('height'), 0])

    if (app.running || app.dragging || app.zooming) {
        barchart.g.select('#xaxis')
            .call(barchart.xAxis());
        barchart.g.select('#yaxis')
            .call(barchart.yAxis());
    } else {
        barchart.g.select('#xaxis')
            .transition(barchart.transition)
            .call(barchart.xAxis());
        barchart.g.select('#yaxis')
            .transition(barchart.transition)
            .call(barchart.yAxis());
    }

    var bars = barchart.g.select('#clip')
        .selectAll(".bar")
        .data(barchart.data());
    barchart.bars = bars;

    if (app.running || app.dragging || app.zooming) {
        bars.attr("x", function(d) {
                return barchart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return barchart.xScale(d.x1) - barchart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return barchart.yScale(barchart.yVal(d.length))
            })
            .attr("height", function(d) {
                return Math.max(0, +barchart.g.attr('height') - barchart.yScale(barchart.yVal(d.length)));
            });

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return barchart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return barchart.xScale(d.x1) - barchart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return barchart.yScale(barchart.yVal(d.length))
            })
            .attr("height", function(d) {
                return Math.max(0, +barchart.g.attr('height') - barchart.yScale(barchart.yVal(d.length)));
            });

    } else {
        bars.transition(barchart.transition).attr("x", function(d) {
                return barchart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return barchart.xScale(d.x1) - barchart.xScale(d.x0)
            })
            .attr("y", function(d) {
                return barchart.yScale(barchart.yVal(d.length))
            })
            .attr("height", function(d) {
                return Math.max(0, +barchart.g.attr('height') - barchart.yScale(barchart.yVal(d.length)));
            });

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return barchart.xScale(d.x0)
            })
            .attr("width", function(d) {
                return barchart.xScale(d.x1) - barchart.xScale(d.x0)
            })
            .attr('y', barchart.g.attr('height'))
            .transition(barchart.transition)
            .attr("y", function(d) {
                return barchart.yScale(barchart.yVal(d.length))
            })
            .attr("height", function(d) {
                return Math.max(0, +barchart.g.attr('height') - barchart.yScale(barchart.yVal(d.length)));
            });
    }

    bars.exit()
        .remove()

}

module.exports = barchart.init;
