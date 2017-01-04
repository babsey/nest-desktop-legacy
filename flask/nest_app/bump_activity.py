#!/usr/bin/env python
import numpy as np
import nest
import lib.lcrn_network as lcrn

def bump_activity(data):
    np.random.seed(int(data['kernel'].get('grng_seed', 0)))

    nest.ResetKernel()
    nest.SetKernelStatus({
        'local_num_threads': 4,
        'grng_seed': int(data['kernel'].get('grng_seed', 0)),
        'rng_seeds': np.random.randint(0,1000,4).tolist(),
    })

    nodes = data['nodes']
    nodes[0]['params'] = dict(zip(nodes[0]['params'].keys(), map(float, nodes[0]['params'].values())))
    nodes[1]['params'] = dict(zip(nodes[1]['params'].keys(), map(float, nodes[1]['params'].values())))

    nrow = nodes[0]['nrow']
    ncol = nodes[0]['ncol']
    n = nrow*ncol
    neuron = nest.Create(nodes[0]['model'], n, params=nodes[0]['params'])
    data['nodes'][0]['ids'] = neuron
    data['nodes'][0]['ncol'] = ncol
    data['nodes'][0]['nrow'] = nrow

    input = nest.Create(nodes[1]['model'], params=nodes[1]['params'])
    data['nodes'][1]['ids'] = input
    sd = nest.Create('spike_detector', params={
        'start': 100.,
    })

    outdegree = data['links'][1]['conn_spec']['outdegree']
    offset = neuron[0]
    for ii in range(n):
        targets, delay = lcrn.lcrn_gamma_targets(ii, nrow, ncol, nrow, ncol, outdegree , 4, 3)
        nest.Connect([neuron[ii]], (targets+offset).tolist(), 'all_to_all', {'weight': -1.})

    nest.Connect(input,neuron)
    nest.Connect(neuron,sd)

    nest.Simulate(data['simtime'])
    curtime = nest.GetKernelStatus('time')
    data['curtime'] = curtime

    events = nest.GetStatus(sd,'events')[0]
    nest.SetStatus(sd, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    data['events'] = events

    return data
