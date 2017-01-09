#!/usr/bin/env python

from flask import Flask, request, jsonify
app = Flask(__name__)

# --------------------------
# General requests
# --------------------------

@app.route('/', methods=['GET'])
def index():
    return 'Hello World!'

@app.route('/check/versions/', methods=['GET'])
def check_versions():
    req = {}
    try:
        import nest
        req['nest'] = nest.version()
    except:
        pass

    return jsonify(req=req)


# --------------------------
# NEST applications
# --------------------------

import nest_apps.simple_network as network
@app.route('/network/simple/simulate/', methods=['POST'])
def simple_network_simulate():
    data = request.get_json()
    return jsonify(network.run(data))

@app.route('/network/simple/resume/', methods=['POST'])
def simple_network_resume():
    data = request.get_json()
    return jsonify(network.resume(data))


import nest_apps.gamma_network as gamma
@app.route('/network/gamma/simulate/', methods=['POST'])
def gamma_network_simulate():
    data = request.get_json()
    return jsonify(gamma.run(data))

@app.route('/network/gamma/resume/', methods=['POST'])
def gamma_network_resume():
    data = request.get_json()
    return jsonify(gamma.resume(data))

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        app.run(sys.argv[1])
    else:
        app.run()
