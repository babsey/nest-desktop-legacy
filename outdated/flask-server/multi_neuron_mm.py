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

    pop = nest.Create(nodes['neuron']['model'], 100, params=nodes['neuron']['params'])
    input = nest.Create(nodes['input']['model'], params=nodes['input']['params'])
    mm = nest.Create('multimeter', params={'record_from': nest.GetStatus(pop,'recordables')[0]})

    nest.Connect(pop,pop,
        conn_spec = {'rule':'fixed_outdegree', 'outdegree': int(.1*len(pop))},
        syn_spec = {'weight':-1.})
    nest.Connect(input,pop)
    nest.Connect(mm,pop)

    nest.Simulate(data['simtime'])
    time = nest.GetKernelStatus('time')

    events = nest.GetStatus(mm,'events')[0]
    nest.SetStatus(mm, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    return jsonify(events=events, time=time, pop=pop)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        app.run(sys.argv[1])
    else:
        app.run()
