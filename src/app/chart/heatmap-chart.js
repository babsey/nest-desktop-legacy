"use strict"

const chart = require('./chart');

function legend() {
    var l = chart.g.select('#heatmap')
        .selectAll(".legend")
        .data(d3.range(
            chart.colorScale.domain()[0],
            chart.colorScale.domain()[1],
            chart.colorScale.domain()[1] / 5.))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        })
        .style("font", "10px sans-serif");

    l.append("rect")
        .attr("x", chart.width + 26)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", function(d) {
            return chart.colorScale(d)
        })
        .on('mouseover', function(d) {
            chart.g.selectAll('.card')
                .filter(function(o) {
                    return o < d || o >= (d + chart.colorScale.quantiles()[0])
                })
                .style('opacity', .1);
        })
        .on('mouseout', function() {
            chart.g.selectAll('.card')
                .transition(t)
                .style('opacity', 1.0);
        });

    l.append("text")
        .attr("x", chart.width + 24)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) {
            return chart.format(d)
        });
    return chart
}

function update() {
    chart.yScale.range([chart.height, chart.height - (+chart.g.attr('height'))])
    chart.xScale.range([0, +chart.g.attr('width')])

    var data = chart.data();

    chart.g.select('#xaxis')
        .call(chart.xAxis());

    chart.g.select('#yaxis')
        .call(chart.yAxis());

    var cards = chart.g
        .select('#clip')
        .selectAll('.card')
        .data(chart.data().i);

    cards.selectAll('.card-fill').remove();

    cards.enter().append("rect")
        .attr("transform", function(d, i) {
            return "translate(" +
                chart.xScale(data.x[parseInt(i / (data.x.length))]) + "," +
                chart.yScale(data.y[parseInt(i % (data.y.length))] + 1) + ")"
        })
        .attr('class', "card-fill")
        .attr('title', function(d, i) {
            return chart.format(data.c[i])
        })
        .attr("width", chart.width / parseFloat(data.x.length))
        .attr("height", chart.height / parseFloat(data.y.length))
        .style("stroke", 'white')
        .on('mouseover', function(d) {
            d3.select(this)
                .style('opacity', .3)
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .style('opacity', 1.)
        })
        .style("fill", function(d, i) {
            return chart.colorScale(data.c[i]);
        });

    if ((chart.width / parseFloat(data.x.length)) > 50) {

        cards.selectAll('text')
            .text(function(d) {
                return chart.format(d)
            })

        cards.enter().append("text")
            .attr("transform", function(d, i) {
                return "translate(" +
                    chart.xScale(data.x[parseInt(i / (data.x.length))]) + ",-" +
                    chart.yScale(data.y.length - data.y[parseInt(i % (data.y.length))]) + ")"
            })
            .attr("x", chart.xScale(.5))
            .attr("y", chart.yScale(.5))
            .text(function(d) {
                return chart.format(d)
            })
            .attr("fill", function(d) {
                return d <= .5 ? "#000" : "#fff"
            })
            .style("stroke-width", 1)
            .style("z-index", "10")
            .style("text-anchor", "middle")
    }

}

chart.legend = legend
chart.update = update
module.exports = chart.init
