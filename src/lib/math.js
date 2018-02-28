"use strict"


var math = {};


math.delta = ([x, ...xs]) =>
    xs.reduce(([acc, last], x) => [
        [...acc, x - last], x
    ], [
        [], x
    ])[0]

math.cumsum = (myarray) => {
    var new_array = [];
    myarray.reduce(function(a, b, i) {
        return new_array[i] = a + b;
    }, 0);
    return new_array;
}

module.exports = math
