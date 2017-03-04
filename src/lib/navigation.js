"use strict"

var navigation = {};

navigation.init = function() {
    $("#simulation-config").find('#level_' + app.config.app().get('simulation.level')).find('.glyphicon-ok').show()

    // Load simulation list
    $('#get-simulation-list').attr('disabled', 'disabled')
    $('#simulation-list').empty()
    var groups = app.config.app().get('simulation.groups');
    groups.map(function(grp, idx) {
        app.simulation.list({
            group: grp.id
        }).exec(function(err, docs) {
            docs = docs.filter(function(doc) {
                return doc._id != app.data._id
            })
            if (docs.length == 0) return
            if (idx != 0) {
                $('#simulation-list').append('<li role="separator" class="divider"></li>')
            }
            docs.map(function(doc) {
                $('#simulation-list').append(app.render.simulationDropdown(doc))
            });
        })
    })
    $('#get-simulation-list').attr('disabled', false)

    setTimeout(app.events.navigation, 1000)
}

module.exports = navigation;
