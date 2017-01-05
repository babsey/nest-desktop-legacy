#!/usr/bin/env python
import numpy as np
import nest

def run(data):
    nest.ResetKernel()

    np.random.seed(int(data['kernel'].get('grng_seed', 0)))
    nest.SetKernelStatus({
        'local_num_threads': 4,
        'grng_seed': np.random.randint(0,1000),
        'rng_seeds': np.random.randint(0,1000,4).tolist(),
    })

    outputs = []
    for idx, node in enumerate(data['nodes']):
        params = node['params']
        params = dict(zip(params.keys(), map(float, params.values())))
        if node['model'] == 'multimeter':
            params.update({'record_from': nest.GetStatus(data['nodes'][0]['ids'],'recordables')[0]})
        data['nodes'][idx]['ids'] = nest.Create(node['model'], int(node.get('n',1)), params=params)
        if node['type'] == 'output':
            outputs.append((idx, data['nodes'][idx]['ids']))

    for link in data['links']:
        syn_spec = link.get('syn_spec',{'weight': 1.})
        syn_spec = dict(zip(syn_spec.keys(), map(float, syn_spec.values())))
        source = data['nodes'][link['source']]['ids']
        target = data['nodes'][link['target']]['ids']
        nest.Connect(source, target, conn_spec=link.get('conn_spec','all_to_all'), syn_spec=syn_spec)

    nest.Simulate(float(data['simtime']))
    data['kernel']['time'] = nest.GetKernelStatus('time')

    for idx, output in outputs:
        events = nest.GetStatus(output,'events')[0]
        data['nodes'][idx]['events'] = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
        nest.SetStatus(output, {'n_events': 0})

    return data


def resume(data):

    outputs = []
    for idx, node in enumerate(data['nodes']):
        params = node['params']
        params = dict(zip(params.keys(), map(float, params.values())))
        if 'V_m' in params: del params['V_m']
        nest.SetStatus(node['ids'], params=params)
        if node['type'] == 'output':
            outputs.append((idx, data['nodes'][idx]['ids']))

    # for link in data['links']:
    #     syn_spec = link.get('syn_spec',{'weight': 1.})
    #     syn_spec = dict(zip(syn_spec.keys(), map(float, syn_spec.values())))
    #     source = data['nodes'][link['source']]['ids']
    #     target = data['nodes'][link['target']]['ids']
    #     nest.SetStatus(nest.GetConnections(source,target))

    nest.Simulate(float(data['simtime']))
    data['kernel']['time'] = nest.GetKernelStatus('time')

    for idx, output in outputs:
        events = nest.GetStatus(output,'events')[0]
        data['nodes'][idx]['events'] = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
        nest.SetStatus(output, {'n_events': 0})

    return data
