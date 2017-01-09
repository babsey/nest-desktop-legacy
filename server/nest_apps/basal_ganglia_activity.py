#!/usr/bin/env python
import numpy as np
import nest

def basal_ganglia_activity(data):
    nest.ResetKernel()
    nest.SetKernelStatus({'local_num_threads':4})

    nodes = data['nodes']
    nodes['neuron']['params'] = dict(zip(nodes['neuron']['params'].keys(), map(float, nodes['neuron']['params'].values())))
    nodes['input']['params'] = dict(zip(nodes['input']['params'].keys(), map(float, nodes['input']['params'].values())))

    neuron_model = 'iaf_cond_alpha' #,'iaf_psc_alpha' #nodes['neuron']['model']
    neuron_params = nodes['neuron']['params']
    neuron_params = {
        'g_L':      15.,
        'C_m':      300.,
        # 'tau_m':    20.,
        'E_L':      -70.,
        'V_reset':  -70.,
        # 'V_th':  -54.,
        't_ref':    2.,
        'tau_syn_ex': 1.0,
        'tau_syn_in': 10.0,
        'E_ex': 0.,
        'E_in': -80.,
    }

    n = 4
    nGPe,nSTN = 2000/n,1000/n
    popGPe = nest.Create(neuron_model, nGPe, params=neuron_params)
    popSTN = nest.Create(neuron_model, nSTN, params=neuron_params)
    pop = list(popGPe) + list(popSTN)
    npop = len(pop)

    noise = nest.Create('noise_generator')
    noiseSTN = nest.Create('poisson_generator', params={'rate':3000.})
    noiseGPe = nest.Create('poisson_generator', params={'rate':3000.})
    # STR = nest.Create('poisson_generator', params={'rate': 500., 'start':500.})
    DBS_params = nodes['input']['params']
    DBS_params.update({'start':1000.})
    DBS = nest.Create(nodes['input']['model'], params=DBS_params)
    sd = nest.Create('spike_detector')

    nest.SetStatus(pop, [{'V_th': np.random.uniform(-59,-49.)} for n in pop])

    J_GPe_GPe = -0.45
    J_GPe_STN = -0.7 * 2
    J_STN_STN = 1.3
    J_STN_GPe = 1.3

    d_intra = 2.
    d_inter = 5.
    nest.Connect(popGPe,popGPe,
        conn_spec={'rule': 'fixed_outdegree', 'outdegree': int(0.05*len(popGPe))},
        syn_spec={'weight':J_GPe_GPe, 'delay': d_intra})
    nest.Connect(popGPe,popSTN,
        conn_spec={'rule': 'fixed_indegree', 'indegree': int(0.02*len(popSTN))},
        syn_spec={'weight':J_GPe_STN, 'delay': d_inter})
    nest.Connect(popSTN,popSTN,
        conn_spec={'rule': 'fixed_outdegree', 'outdegree': int(0.02*len(popSTN))},
        syn_spec={'weight':J_STN_STN, 'delay': d_intra})
    nest.Connect(popSTN,popGPe,
        conn_spec={'rule': 'fixed_indegree', 'indegree': int(0.05*len(popGPe))},
        syn_spec={'weight':J_STN_GPe, 'delay': d_inter})


    nest.Connect(noise,pop)
    nest.Connect(noiseSTN,popSTN)
    nest.Connect(noiseGPe,popGPe)
    # nest.Connect(STR,popGPe, syn_spec={'weight': -1.})
    nest.Connect(DBS,popGPe, syn_spec={'weight': 1.})
    nest.Connect(pop,sd)

    nest.SetStatus(noise, {'std':1000.})
    nest.Simulate(100.)
    nest.SetStatus(noise, {'std':0.})
    events = nest.GetStatus(sd,'events')[0]

    nest.Simulate(1500.)
    time = nest.GetKernelStatus('time')

    events = nest.GetStatus(sd,'events')[0]
    events = dict(map(lambda (x,y): (x,y.tolist()), events.items()))
    nest.SetStatus(sd, {'n_events': 0})

    return events, time, npop
