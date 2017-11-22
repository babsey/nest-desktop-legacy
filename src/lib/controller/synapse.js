"use strict"

var synController = {};

synController.update = (link) => {
    var synElem = $('#synapses').find('.link[data-id=' + link.id + '] .content');

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
    }

    var synapseModels = app.config.nest('synapse');
    var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
    if (app.data.nodes[link.target].element_type != 'recorder') {
        app.slider.init_modelSlider('#synapses .link[data-id=' + link.id + '] .modelSlider', synapseModels.filter((d) => {
            return d.id == synapseModel;
        })[0])
        app.slider.update_synSlider(link)
    }
    synElem.find('.recSelect').on('change', function() {
        link.syn_spec.receptor_type = parseInt(this.value)
        app.simulation.simulate.init()
    })
    synElem.find('.modelSlider .sliderInput').on('slideStop', function() {
        var param = $(this).parents('.paramSlider').attr('id');
        link.syn_spec[param] = parseFloat(this.value)
        app.chart.networkLayout.update()
        app.simulation.simulate.init()
    })
    synElem.find('input.paramVal').on('change', function() {
        var pvalue = $(this).val();
        var schema = $(this).data('schema');
        var valid = app.validation.validate(pvalue, schema)
        $(this).parents('.form-group').toggleClass('has-success', valid.error == null)
        $(this).parents('.form-group').toggleClass('has-error', valid.error != null)
        $(this).parents('.form-group').find('.help-block').html(valid.error)
        if (valid.error != null) return
        var key = $(this).parents('.paramSlider').attr('id');
        link.syn_spec[key] = valid.value
        app.slider.update_synSlider(link)
        app.chart.networkLayout.update()
        app.simulation.simulate.init()
    })
}

synController.init = (link) => {
    $('#synapses .controller').append(app.renderer.link.controller.synapse(link))
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
    if (app.data.nodes[link.target].element_type == 'recorder' || app.data.nodes[link.source].element_type == 'stimulator') {
        synElem.find('.synSelect').addClass('disabled')
    }
    synElem.find('.synSelect').on('change', function() {
        link.syn_spec = {
            model: this.value
        };
        app.model.syn_selected(link)
        synController.update(link)
        app.simulation.reload()
    })
    synController.update(link)
}

module.exports = synController;
