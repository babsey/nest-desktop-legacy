#!/usr/bin/env python

from flask import request, jsonify
from app import app, db, Network
import anyjson as json


# --------------------------
# Database
# --------------------------

@app.route('/network/<int:network_id>', methods=['GET'])
def network(network_id):
    network = Network.query.filter(Network.id==network_id).first()
    return jsonify(id=network.id, nodes=json.loads(network.nodes))

@app.route('/network/list/<nest_app>', methods=['GET'])
def network_list(nest_app):
    network_obj = Network.query.filter(Network.nest_app==nest_app)
    network_list = [{
        'id': network.id,
        'name': network.name,
        'timestamp': network.timestamp,
        'nodes': json.loads(network.nodes)} for network in network_obj]
    return jsonify(network_list)

@app.route('/network/add/', methods=['POST'])
def network_add():
    data = request.get_json()
    network = Network(
        name = data['name'],
        nest_app = data['nest_app'],
        nodes = json.dumps(data['nodes'])
    )
    db.session.add(network)
    db.session.commit()
    return 'Done'



# --------------------------
# NEST applications
# --------------------------

from nest_app.neuronal_activity import neuronal_activity
from nest_app.spike_activity import spike_activity

@app.route('/neuronal_activity/', methods=['POST'])
def app_neural_activity():
    data = request.get_json()
    return jsonify(neuronal_activity(data))

@app.route('/spike_activity/', methods=['POST'])
def app_spike_activity():
    data = request.get_json()
    return jsonify(spike_activity(data))


if __name__ == '__main__':
    app.run()
