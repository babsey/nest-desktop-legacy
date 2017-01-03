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
    neuronParams = nodes[0]['params']
    inputParams = nodes[1]['params']

    neuronParams = dict(zip(neuronParams.keys(), map(float, neuronParams.values())))
    inputParams = dict(zip(inputParams.keys(), map(float, inputParams.values())))

    pop = nest.Create(nodes[0]['model'], int(nodes[0]['npop']), params=neuronParams)
    data['nodes'][0]['pop'] = pop

    input = nest.Create(nodes[1]['model'], params=inputParams)
    mm = nest.Create('multimeter', params={'record_from': nest.GetStatus(pop,'recordables')[0]})

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
