#!/usr/bin/env python

from flask import Flask, jsonify, render_template, request, abort
import nest
import lib.helpers as hh

app = Flask(__name__)

# trusted_proxies = ('127.0.0.1','132.230.177.59')
#
# @app.before_request
# def limit_remote_addr():
#     if request.remote_addr not in trusted_proxies:
#         abort(403)  # Forbidden

@app.template_filter('stringify')
def stringify_filter(s):
    return s.replace('_',' ')


@app.route('/init/', methods=['POST'])
def init():

    nest.ResetKernel()

    global neuron,input,vm
    neuron = nest.Create('iaf_neuron', params={'C_m': 250., 'tau_m': 10.})
    input = nest.Create('noise_generator', params={'mean':250., 'std':250.})
    vm = nest.Create('voltmeter')

    nest.Connect(input,neuron)
    nest.Connect(vm,neuron)

    values = request.get_json()
    nest.SetStatus(input, {'mean':float(values['mean']),'std':float(values['std'])})
    nest.SetStatus(neuron, {'C_m':float(values['C_m']),'tau_m':float(values['tau_m'])})

    nest.Simulate(1000.)

    events = nest.GetStatus(vm,'events')[0]
    nest.SetStatus(vm, {'n_events':0})
    return jsonify(data=hh.prep_single([events['times'], events['V_m']]))


@app.route('/simulate/', methods=['POST'])
def simulate():

    values = request.get_json()
    nest.SetStatus(input, {'mean':float(values['mean']),'std':float(values['std'])})
    nest.SetStatus(neuron, {'C_m':float(values['C_m']),'tau_m':float(values['tau_m'])})

    nest.Simulate(1.)
    events = nest.GetStatus(vm,'events')[0]
    nest.SetStatus(vm, {'n_events':0})
    return jsonify(data=hh.prep_single([events['times'], events['V_m']]))

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)
