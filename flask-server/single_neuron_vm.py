#!/usr/bin/env python

from flask import Flask, jsonify, request
import nest

app = Flask(__name__)

@app.route('/simulate/', methods=['POST'])
def simulate():
    nest.ResetKernel()

    nodes = request.get_json()
    nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))
    nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))

    neuron = nest.Create(nodes['neuron']['model'], params=nodes['neuron']['params'])
    input = nest.Create(nodes['input']['model'], params=nodes['input']['params'])
    vm = nest.Create('voltmeter')

    nest.Connect(input,neuron)
    nest.Connect(vm,neuron)

    nest.Simulate(1000.)
    time = nest.GetKernelStatus('time')

    events = nest.GetStatus(vm,'events')[0]
    data = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    nest.SetStatus(vm, {'n_events': 0})

    return jsonify(data=data, time=time)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        app.run(sys.argv[1])
    else:
        app.run()
