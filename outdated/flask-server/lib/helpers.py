import numpy as np

def prep_single(data):
    return map(lambda x: {'x':x[0], 'y':x[1]}, zip(*data))

def prep_multi(events, key='V_m'):
    values = np.array(events[key]).reshape(-1,np.unique(events['senders']).size).tolist()
    times = np.unique(events['times'])
    data = map(lambda i: {'x': times[i], 'y':values[i]}, range(len(values)))
    return data

def prep_multi0(events, key='V_m'):
    data = np.array(zip(events['senders'],events[key]), dtype=[('neuron', int), (key, float)]).reshape(-1,np.unique(events['senders']).size).tolist()
    times = np.unique(events['times'])
    for i in range(len(data)):
        data[i].append(('time',times[i]))
    data = map(dict, data)
    return data
