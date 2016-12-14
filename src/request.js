var $ = require("jquery");

$(document)
    .bind("ajaxSend", function() {
        $("select").attr("disabled", "disabled");
    })
    .bind("ajaxComplete", function() {
        $("select").attr("disabled", false);
    })

function simulate(url, simtime, nodes) {

    var sendData = {
        'simtime': simtime,
        'nodes': nodes
    };

    return $.ajax({
        method: "POST",
        url: "http://localhost:5000/"+ url +"/",
        data: JSON.stringify(sendData),
        contentType: 'application/json;charset=UTF-8'
    }).fail(function (d) {
        alert(d.statusText)
    })
}

module.exports = {
    simulate: simulate
}
