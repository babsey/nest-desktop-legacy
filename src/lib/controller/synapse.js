"use strict"

var synController = {};

synController.update = (link) => {
    if (link.disabled) return
    app.model.syn_selected(link)
    var synElem = $('#synapses').find('.link[data-id=' + link.id + '] .content');

    synElem.find('.recSelect .dropdown-menu').empty()
    synElem.find('.recSelect').hide()
    if (app.data.nodes[link.target].model == 'iaf_cond_alpha_mc') {
        var receptorModels = app.config.nest('receptor')['iaf_cond_alpha_mc']
        if (!('receptor_type' in link.syn_spec) || link.syn_spec.receptor_type == 0) {
            link.syn_spec.receptor_type = 1
        }
        for (var ridx in receptorModels) {
            var model = receptorModels[ridx];
            synElem.find('.recSelect .dropdown-menu').append('<li><a href="#" data-value="' + model.id + '">' + model.label + '</a></li>')
        }
        synElem.find('.recSelect .name').html(receptorModels[link.syn_spec.receptor_type - 1].label);
        synElem.find('.recSelect').show()
        synElem.find('.recLabel').show()
    }

    var synapseModels = app.config.nest('synapse');
    var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse');
    if (app.data.nodes[link.target].element_type != 'recorder') {
        app.slider.init_modelSlider('#synapses .link[data-id=' + link.id + '] .modelSlider', synapseModels.filter((d) => {
            return d.id == synapseModel;
        })[0])
        app.slider.update_synSlider(link)
    }
    synElem.find('.recSelect .dropdown-menu a').on('click', (d) => {
        var value = parseInt($(d.currentTarget).data('value'));
        synElem.find('.recSelect .name').html(receptorModels[value - 1].label);
        link.syn_spec.receptor_type = parseInt(value)
        app.simulation.simulate.init()
    })
    synElem.find('.modelSlider .sliderInput').on('slideStop', function() {
        var param = $(this).parents('.paramSlider').attr('id');
        link.syn_spec = link.syn_spec || {};
        link.syn_spec[param] = parseFloat(this.value)
        app.graph.networkLayout.update()
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
        app.graph.networkLayout.update()
        app.simulation.simulate.init()
    })

    synElem.find('.paramSlider .eraser').on('click', function() {
        var key = $(this).parents('.paramSlider').attr('id');
        var value = $(this).data('defaultValue');
        link.syn_spec[key] = value;
        app.graph.networkLayout.update()
        app.simulation.simulate.init()
    })
}

synController.init = (link) => {
    $('#synapses .controller').append(app.renderer.link.controller.synapse(link))
    var synElem = $('#synapses').find('.link[data-id=' + link.id + ']');

    var synapseModels = app.config.nest('synapse');
    var synapseModel = (link.syn_spec ? (link.syn_spec.model || 'static_synapse') : 'static_synapse')
    for (var midx in synapseModels) {
        var model = synapseModels[midx];
        if ((model.id == 'tsodyks_synapse') && ((app.data.nodes[link.source].element_type != 'neuron') || (app.data.nodes[link.target].element_type != 'neuron'))) continue
        if ((model.id == 'gap_junction') && ((app.data.nodes[link.source].element_type != 'neuron') || (app.data.nodes[link.target].element_type != 'neuron'))) continue
        synElem.find('.synSelect .dropdown-menu').append('<li><a href="#" data-rule="' + model.id + '" data-label="' + model.label +'">' + model.label + '</a></li>')
        if (model.id == synapseModel)
            synElem.find('.synSelect .name').html(model.label);
    }
    if (app.data.nodes[link.target].element_type == 'recorder' || app.data.nodes[link.source].element_type == 'stimulator' || link.disabled) {
        synElem.find('.synSelect').addClass('disabled')
    }

    synElem.find('.synSelect').toggleClass('disabled', link.disabled || false)
    synElem.find('.linkConfig .enabled').toggle(!link.disabled && true)
    synElem.find('.linkConfig .disabled').toggle(link.disabled || false)

    synElem.find('.synSelect .dropdown-menu a').on('click', (d) => {
        var modelElem = $(d.currentTarget)
        link.syn_spec = {
            model: modelElem.data('model')
        };
        synElem.find('.modelSelect .name').html(modelElem.data('label'));
        synController.update(link)
        app.simulation.simulate.init()
    })

    synElem.find('.disableLink').on('click', () => {
        app.data.kernel.time = 0.0 // Reset simulation
        link.disabled = !link.disabled;
        app.simulation.reload()
    })

    synElem.find('.deleteLink').on('click', (d) => {
        app.data.kernel.time = 0.0 // Reset simulation
        var linkId = $(d.currentTarget).parents('.link').data('id');

        if (app.selected_link) {
            app.selected_link = app.selected_link.id == linkId ? null : app.selected_link;
        }

        var links = app.data.links.filter((d) => (d.id != linkId));
        links.map((d, i) => {
            d.id = i;
        })
        app.data.links = links;
        app.simulation.reload()
    })

    synController.update(link)
}

module.exports = synController;
