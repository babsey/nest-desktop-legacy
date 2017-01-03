#!/usr/bin/env python
import numpy as np
import nest

def spike_activity(data):
    np.random.seed(int(data['kernel'].get('grng_seed', 0)))

    nest.ResetKernel()
    nest.SetKernelStatus({
        'local_num_threads': 4,
        'grng_seed': int(data['kernel'].get('grng_seed', 0)),
        'rng_seeds': np.random.randint(0,1000,4).tolist(),
    })

    nodes = data['nodes']
    neuronParams = nodes[0]['params']
    inputParams = nodes[1]['params']

    neuronParams = dict(zip(neuronParams.keys(), map(float, neuronParams.values())))
    inputParams = dict(zip(inputParams.keys(), map(float, inputParams.values())))

    pop = nest.Create(nodes[0]['model'], int(nodes[0]['npop']), params=neuronParams)
    data['nodes'][0]['pop'] = pop

    noise = nest.Create('noise_generator')
    input = nest.Create(nodes[1]['model'], params=inputParams)
    sd = nest.Create('spike_detector')

    nest.Connect(input,pop)
    nest.Connect(pop,sd)

    nest.SetStatus(noise, {'std':0.})
    events = nest.GetStatus(sd,'events')[0]

    nest.Simulate(data['simtime'])
    curtime = nest.GetKernelStatus('time')
    data['curtime'] = curtime

    events = nest.GetStatus(sd,'events')[0]
    nest.SetStatus(sd, {'n_events': 0})

    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    data['events'] = events
    return data
