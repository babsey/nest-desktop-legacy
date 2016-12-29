#!/usr/bin/env python
import numpy as np
import nest
import lib.lcrn_network as lcrn

def bump_activity(data):
    nest.ResetKernel()
    nest.SetKernelStatus({
        # 'grng_seed': int(np.random.random() * 1000),
        'local_num_threads': 4,
    })

    nodes = data['nodes']
    nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))
    nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))

    nrow = nodes['neuron']['nrow']
    ncol = nodes['neuron']['ncol']
    npop = nrow*ncol
    pop = nest.Create(nodes['neuron']['model'], npop, params=nodes['neuron']['params'])
    data['nodes']['neuron']['pop'] = pop
    data['nodes']['neuron']['ncol'] = ncol
    data['nodes']['neuron']['nrow'] = nrow

    input = nest.Create(nodes['input']['model'], params=nodes['input']['params'])
    sd = nest.Create('spike_detector', params={
        'start': 100.,
    })

    p = data['nodes']['neuron']['outdegree']/100.
    offset = pop[0]
    for ii in range(npop):
        targets, delay = lcrn.lcrn_gamma_targets(ii, nrow, ncol, nrow, ncol, int(p*npop) , 4, 3)
        nest.Connect([pop[ii]], (targets+offset).tolist(), 'all_to_all', {'weight': -1.})

    nest.Connect(input,pop)
    nest.Connect(pop,sd)

    nest.Simulate(data['simtime'])
    curtime = nest.GetKernelStatus('time')
    data['curtime'] = curtime

    events = nest.GetStatus(sd,'events')[0]
    nest.SetStatus(sd, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    data['events'] = events

    return data
