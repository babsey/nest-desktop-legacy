#!/usr/bin/env python

from flask import request, jsonify
from app import app, db, Network
import anyjson as json


@app.route('/', methods=['GET'])
def index():
    return 'Hello World!'

@app.route('/check/versions/', methods=['GET'])
def check_versions():
    versions = {}
    try:
        import nest
        versions['nest'] = nest.version()
    except:
        versions['nest'] = -1

    return jsonify(versions=versions)


# --------------------------
# Database
# --------------------------

@app.route('/network/<int:network_id>', methods=['GET'])
def network(network_id):
    network_obj = Network.query.filter(Network.id==network_id).first()
    return jsonify(id=network_obj.id, data=json.loads(network_obj.network))

@app.route('/network/list/<nest_app>', methods=['GET'])
def network_list(nest_app):
    network_obj = Network.query.filter(Network.nest_app==nest_app)
    network_list = [{
        'id': network.id,
        'name': network.name,
        'timestamp': network.timestamp,
        'network': json.loads(network.network)} for network in network_obj]
    return jsonify(network_list)

@app.route('/network/add/', methods=['POST'])
def network_add():
    data = request.get_json()
    network = data['data']
    if network.has_key('events'): del network['events']
    network_obj = Network(
        name = data['name'],
        nest_app = data['nest_app'],
        network = json.dumps(network)
    )
    db.session.add(network_obj)
    db.session.commit()
    return 'Done'



# --------------------------
# NEST applications
# --------------------------

import nest_app.simple_network as network
@app.route('/network/simple/simulate/', methods=['POST'])
def simple_network_simulate():
    data = request.get_json()
    return jsonify(network.run(data))

@app.route('/network/simple/resume/', methods=['POST'])
def simple_network_resume():
    data = request.get_json()
    return jsonify(network.resume(data))


import nest_app.gamma_network as gamma
@app.route('/network/gamma/simulate/', methods=['POST'])
def gamma_network_simulate():
    data = request.get_json()
    return jsonify(gamma.run(data))

@app.route('/network/gamma/resume/', methods=['POST'])
def gamma_network_resume():
    data = request.get_json()
    return jsonify(gamma.resume(data))

if __name__ == '__main__':
    app.run()
