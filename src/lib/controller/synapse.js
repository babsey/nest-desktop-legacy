"use strict"

var synController = {};

synController.update = function(link) {
    var synElem = $('#synapses').find('.link[data-id=' + link.id + '] .content');
    // delete link.syn_spec.receptor_type

    synElem.find('.recSelect').empty().hide()
    if (app.data.nodes[link.target].model == 'iaf_cond_alpha_mc') {
        var receptorModels = app.config.nest('receptor')['iaf_cond_alpha_mc']
        if (!('receptor_type' in link.syn_spec) || link.syn_spec.receptor_type == 0) {
            link.syn_spec.receptor_type = 1
        }
        for (var ridx in receptorModels) {
            var model = receptorModels[ridx];
            synElem.find('.recSelect').append('<option id="rec' + link.id + '_' + model.id + '" value="' + model.id + '"' + (model.id == 1 ? 'selected' : '') + '>' + model.label + '</option>')
        }
        $('#synapses').find('.link[data-id=' + link.id + '] .content').find('.recSelect').show()
        synElem.find('.recSelect').find('option#rec' + link.id + '_' + link.syn_spec.receptor_type || 0).prop('selected', true);
    } else {
        link.syn_spec.receptor_type = 0
    }

    var synapseModels = app.config.nest('synapse');
    var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
    if (app.data.nodes[link.target].type != 'recorder') {
        app.slider.init_modelSlider('#synapses .link[data-id=' + link.id + '] .modelSlider', synapseModels.filter(function(d) {
            return d.id == synapseModel;
        })[0])
        app.slider.update_synSlider(link)
    }
    synElem.find('.recSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_node = null;
        app.selected_link = link;
        link.syn_spec.receptor_type = parseInt(this.value)
        app.simulation.simulate()
    })
    synElem.find('.modelSlider .sliderInput').on('slideStop', function() {
        app.selected_node = null;
        app.selected_link = link;
        var param = $(this).parents('.paramSlider').attr('id');
        link.syn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
        app.simulation.simulate()
    })
    synElem.find('input.paramVal').on('change', function() {
        app.selected_node = null;
        app.selected_link = link;
        var pkey = $(this).parents('.paramSlider').attr('id');
        var pvalue = $(this).val()
        var schema = $(this).data('schema')
        var valid = app.validation.validate(pkey, pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        link.syn_spec[pkey] = valid.value
        app.slider.update_synSlider(link)
        app.simulation.simulate()
    })
}

synController.init = function(link) {
    $('#synapses .controller').append(app.renderer.synapse(link))
    var synElem = $('#synapses').find('.link[data-id=' + link.id + ']');

    var synapseModels = app.config.nest('synapse');
    for (var midx in synapseModels) {
        var model = synapseModels[midx];
        if ((model.id == 'tsodyks_synapse') && ((app.data.nodes[link.source].element_type != 'neuron') || (app.data.nodes[link.target].element_type != 'neuron'))) continue
        if ((model.id == 'gap_junction') && ((app.data.nodes[link.source].element_type != 'neuron') || (app.data.nodes[link.target].element_type != 'neuron'))) continue
        synElem.find('.synSelect').append('<option id="' + model.id + '" value="' + model.id + '">' + model.label + '</option>')
    }
    var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
    synElem.find('.synSelect').find('option#' + synapseModel).prop('selected', true);
    synElem.find('.synSelect').on('change', function() {
        app.simulation.run(false)
        app.selected_node = null;
        app.selected_link = link;
        link.syn_spec = {
            model: this.value
        };
        app.model.syn_selected(link)
        synController.update(link)
        app.simulation.simulate()
    })
    synController.update(link)
}

module.exports = synController;
