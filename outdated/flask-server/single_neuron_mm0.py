#!/usr/bin/env python

import os
import nest
import lib.helpers as hh

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

@app.route('/init/', methods=['POST'])
def init():
    nest.ResetKernel()

    nodes = request.get_json()
    nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))
    nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))
    pprint(nodes)

    model = nodes['neuron']['model']
    recordables = map(lambda x: x.name, nest.GetDefaults(model).get('recordables', []))
    nodes['neuron']['recordables'] = recordables

    neuron = nest.Create(nodes['neuron']['model'], params=nodes['neuron']['params'])
    nodes['neuron']['ids'] = neuron

    input = nest.Create(nodes['input']['model'], params=nodes['input']['params'])
    nodes['input']['ids'] = input

    nodes['output'] = {}
    nodes['output']['model'] = 'multimeter'
    mm = nest.Create(nodes['output']['model'], params={"record_from": recordables})
    nodes['output']['ids'] = mm

    nest.Connect(input,neuron)
    nest.Connect(mm,neuron)

    nest.Simulate(1000.)
    time = nest.GetKernelStatus('time')

    events = nest.GetStatus(mm,'events')[0]
    data = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    nest.SetStatus(mm, {'n_events': 0})

    return jsonify(data=data, nodes=nodes, time=time)

@app.route('/simulate/', methods=['POST'])
def simulate():
    nodes = request.get_json()
    nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))
    nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))

    nest.SetStatus(nodes['input']['ids'], nodes['input']['params'])
    nest.SetStatus(nodes['neuron']['ids'], nodes['neuron']['params'])
    nest.Simulate(1.)

    mm = nodes['output']['ids']
    events = nest.GetStatus(mm,'events')[0]
    print events
    nest.SetStatus(mm, {'n_events': 0})
    import pdb; pdb.set_trace()
    return jsonify(data=dict([(x, hh.prep_multi([events['times'], events[x]])) for x in nodes['neuron']['recordables']]), nodes=nodes)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        app.run(sys.argv[1])
    else:
        app.run()
