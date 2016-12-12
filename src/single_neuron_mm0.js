"use strict"

var $ = require("jquery");

var d3Array = require('d3-array');
var d3Axis = require('d3-axis');
var d3Request = require('d3-request');
var d3Selection = require('d3-selection');
var d3Shape = require('d3-shape');
var d3Scale = require('d3-scale');

var s = require("./slider");

var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')
nodes = {};
var recordables = {};
var record_from = 'V_m'

var recordLabels = {
    'V_m': 'Membrane pontential (ms)',
    'g_ex': 'Conductance',
    'g_in': 'Conductance',
    'input_currents_ex': 'Current (pA)',
    'input_currents_in': 'Current (pA)',
    'weighted_spikes_ex': 'Spikes',
    'weighted_spikes_in': 'Spikes',
}


d3Request.csv('file://' + curpath + '/settings/models.csv', function(models) {

    models.forEach(function(model) {
        if (model.recordables) {
            recordables[model.id] = model.recordables.split(';');
        }
        $("<option class='model_select' value=" + model.id + ">" + model.label + "</option>").appendTo("#id_" + model.type)
    })
})

function row(p) {
    return {
        id: p.id,
        label: p.label,
        level: p.level,
        slider: {
            value: +p.value,
            min: +p.min,
            max: +p.max,
            step: +p.step
        }
    }
}
s.slider('level', {value:1,min:1,max:4,step:1})

var update_params = function(node, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, row, function(params) {
        params.forEach(function(p) {
            $('#' + node).find('.params').append('<dt id="id_' + p.id + '" class="'+ p.id +'">' + p.label + '</dt>')
            var param_slider = s.paramSlider(nodes, node, p.id, p.slider);
            param_slider.on("slideStop", function() {
                simulate()
            })
            if (p.level > $('#levelInput').attr('value')) {
                $('.'+ p.id).addClass('hidden')
            }
        })
    })
}

$('.model .model_select').on('change', function() {
    var node = $(this).parents('.model').attr('id');
    $('#' + node).find('.params').empty();
    var model = this.value;
    nodes[node] = {
        'model': model,
        'params': {}
    }
    if (node == 'neuron') {
        $('#id_record').empty()
        for (var recId in recordables[model]) {
            var rec = recordables[model][recId];
            $('<option val="'+ rec +'">'+ rec + '</option>').appendTo('#id_record')

        }
        record_from = $('#id_record option:selected').val();
        $('#record').show();
    }
    update_params(node, model)
    simulate()
})

$('#id_record').on('change', function() {
    record_from = this.value;
    update(data['times'], data[record_from], recordLabels[record_from])
})




var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var xScale = d3Scale.scaleLinear()
    .range([0, width]);

var yScale = d3Scale.scaleLinear()
    .range([height, 0]);

var xAxis = d3Axis.axisBottom(xScale);
var yAxis = d3Axis.axisLeft(yScale);

var line = d3Shape.line()
    .x(function(d, i) {
        return xScale(d);
    });

var data;

function update(x,y, ylabel) {

    yScale.domain(d3Array.extent(x, function(d, i) {
        return y[i]
    })).nice(10);

    line.y(function(d, i) {
        return yScale(y[i]);
    });

    $('#chart').empty()
    var svg = d3Selection.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .text("Time (ms)");

    svg.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .text(ylabel);

    svg.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(x)
        .attr("class", "line")
        .attr("d", line);
}

function simulate() {

    if (!('neuron' in nodes) || !('input' in nodes)) return

    $.ajax({
            method: "POST",
            url: "http://localhost:5000/simulate/",
            data: JSON.stringify(nodes),
            contentType: 'application/json;charset=UTF-8',
        })
        .fail(function(d, i) {
            console.log(d, i)
        })
        .done(function(res) {
            data = res.data;
            var curtime = res.time;
            xScale.domain([curtime - 1000., curtime]);
            update(data['times'], data[record_from], recordLabels[record_from])
        })
}
