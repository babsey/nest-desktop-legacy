var $ = require("jquery");

$(document)
    .bind("ajaxSend", function() {
        $("select").attr("disabled", "disabled");
    })
    .bind("ajaxComplete", function() {
        $("select").attr("disabled", false);
    })

function simulate(simtime, nodes) {

    var sendData = {
        'simtime': simtime,
        'nodes': nodes
    };

    return $.ajax({
        method: "POST",
        url: "http://localhost:5000/simulate/",
        data: JSON.stringify(sendData),
        contentType: 'application/json;charset=UTF-8'
    })
}

module.exports = {
    simulate: simulate
}
