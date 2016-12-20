#!/usr/bin/env python
import nest

def neuronal_state_activity(data):
    nest.ResetKernel()

    nodes = data['nodes']
    neuronParams = nodes['neuron']['params']
    inputParams = nodes['input']['params']

    neuronParams = dict(zip(neuronParams.keys(), map(float, neuronParams.values())))
    inputParams = dict(zip(inputParams.keys(), map(float, inputParams.values())))

    npop = int(nodes['neuron']['npop'])
    pop = nest.Create(nodes['neuron']['model'], int(npop), params=neuronParams)
    data['nodes']['neuron']['pop'] = pop

    input = nest.Create(nodes['input']['model'], params=inputParams)
    mm = nest.Create('multimeter', params={'record_from': nest.GetStatus(pop,'recordables')[0]})

    p = int(nodes['neuron']['outdegree'])/100.
    nest.Connect(pop,pop,
        conn_spec = {'rule':'fixed_outdegree', 'outdegree': int(p*npop)},
        syn_spec = {'weight':-1.})
    nest.Connect(input,pop)
    nest.Connect(mm,pop)

    nest.Simulate(data['simtime'])
    print 'Simulation finished'

    curtime = nest.GetKernelStatus('time')
    data['curtime'] = curtime

    events = nest.GetStatus(mm,'events')[0]
    nest.SetStatus(mm, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    data['events'] = events
    return data
