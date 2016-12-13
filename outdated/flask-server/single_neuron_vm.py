#!/usr/bin/env python

from flask import Flask, jsonify, request
import nest

app = Flask(__name__)

@app.route('/simulate/', methods=['POST'])
def simulate():
    nest.ResetKernel()

    data = request.get_json()
    nodes = data['nodes']
    nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))
    nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))

    neuron = nest.Create(nodes['neuron']['model'], params=nodes['neuron']['params'])
    input = nest.Create(nodes['input']['model'], params=nodes['input']['params'])
    vm = nest.Create('voltmeter')

    nest.Connect(input,neuron)
    nest.Connect(vm,neuron)

    nest.Simulate(data['simtime'])
    time = nest.GetKernelStatus('time')

    events = nest.GetStatus(vm,'events')[0]
    nest.SetStatus(vm, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    return jsonify(events=events, time=time)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        app.run(sys.argv[1])
    else:
        app.run()
