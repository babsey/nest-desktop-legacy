#!/usr/bin/env python

from flask import jsonify, request
import nest

def load_neuronal_activity(app):

    @app.route('/neuronal_activity/', methods=['POST'])
    def neuronal_activity():
        nest.ResetKernel()

        data = request.get_json()
        nodes = data['nodes']
        nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))
        nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))

        npop = int(nodes['neuron']['npop'])
        pop = nest.Create(nodes['neuron']['model'], int(npop), params=nodes['neuron']['params'])
        input = nest.Create(nodes['input']['model'], params=nodes['input']['params'])
        mm = nest.Create('multimeter', params={'record_from': nest.GetStatus(pop,'recordables')[0]})

        p = nodes['neuron']['outdegree']
        nest.Connect(pop,pop,
            conn_spec = {'rule':'fixed_outdegree', 'outdegree': int(p)},
            syn_spec = {'weight':-1.})
        nest.Connect(input,pop)
        nest.Connect(mm,pop)

        nest.Simulate(data['simtime'])
        time = nest.GetKernelStatus('time')

        events = nest.GetStatus(mm,'events')[0]
        nest.SetStatus(mm, {'n_events': 0})

        events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
        return jsonify(events=events, time=time, pop=pop)
