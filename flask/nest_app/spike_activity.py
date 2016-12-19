#!/usr/bin/env python
import nest

def spike_activity(data):
    nest.ResetKernel()
    nest.SetKernelStatus({'local_num_threads':4})

    nodes = data['nodes']
    neuronParams = nodes['neuron']['params']
    inputParams = nodes['input']['params']

    neuronParams = dict(zip(neuronParams.keys(), map(float, neuronParams.values())))
    inputParams = dict(zip(inputParams.keys(), map(float, inputParams.values())))

    npop = int(nodes['neuron']['npop'])
    pop = nest.Create(nodes['neuron']['model'], npop, params=neuronParams)
    data['nodes']['neuron']['pop'] = pop

    popE,popI = pop[:int(npop*.8)],pop[int(npop*.8):]

    noise = nest.Create('noise_generator')
    input = nest.Create(nodes['input']['model'], params=inputParams)
    sd = nest.Create('spike_detector')

    nest.Connect(input,pop)
    nest.Connect(pop,sd)

    nest.SetStatus(noise, {'std':1000.})
    nest.Simulate(100.)
    nest.SetStatus(noise, {'std':0.})
    events = nest.GetStatus(sd,'events')[0]

    p = int(nodes['neuron']['outdegree'])/100.
    nest.Connect(popE,pop,
        conn_spec={'rule': 'fixed_outdegree', 'outdegree': int(p*npop)},
        syn_spec={'weight':1.})
    nest.Connect(popI,pop,
        conn_spec={'rule': 'fixed_outdegree', 'outdegree': int(p*npop)},
        syn_spec={'weight':-8.})

    nest.Simulate(data['simtime'])
    curtime = nest.GetKernelStatus('time')
    data['curtime'] = curtime

    events = nest.GetStatus(sd,'events')[0]
    nest.SetStatus(sd, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    data['events'] = events
    return data
