#!/usr/bin/env python
import numpy as np
import nest

def neuronal_state_activity(data):
    np.random.seed(int(data['kernel'].get('grng_seed', 0)))

    nest.ResetKernel()
    nest.SetKernelStatus({
        # 'local_num_threads': 4,
        'grng_seed': np.random.randint(0,1000),
        'rng_seeds': np.random.randint(0,1000,1).tolist(),
    })

    nodes = data['nodes']
    for nidx, node in enumerate(nodes):
        params = node['params']
        params = dict(zip(params.keys(), map(float, params.values())))
        data['nodes'][nidx]['ids'] = nest.Create(node['model'], int(node.get('n',1)), params=params)

    for link in data['links']:
        syn_spec = link['syn_spec']
        syn_spec = dict(zip(syn_spec.keys(), map(float, syn_spec.values())))
        nest.Connect(data['nodes'][link['source']]['ids'],data['nodes'][link['target']]['ids'],
                conn_spec=link['conn_spec'], syn_spec=syn_spec)

    mm = nest.Create('multimeter', params={'record_from': nest.GetStatus(data['nodes'][0]['ids'],'recordables')[0]})
    nest.Connect(mm,data['nodes'][0]['ids'])

    nest.Simulate(data['simtime'])
    print 'Simulation finished'

    curtime = nest.GetKernelStatus('time')
    data['curtime'] = curtime

    events = nest.GetStatus(mm,'events')[0]
    nest.SetStatus(mm, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    data['events'] = events
    return data
