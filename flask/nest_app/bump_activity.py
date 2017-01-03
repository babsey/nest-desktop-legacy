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
    npop = nrow*ncol
    pop = nest.Create(nodes[0]['model'], npop, params=nodes[0]['params'])
    data['nodes'][0]['pop'] = pop
    data['nodes'][0]['ncol'] = ncol
    data['nodes'][0]['nrow'] = nrow

    input = nest.Create(nodes[1]['model'], params=nodes[1]['params'])
    sd = nest.Create('spike_detector', params={
        'start': 100.,
    })

    p = data['nodes'][0]['outdegree']/100.
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
