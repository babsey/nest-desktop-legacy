#!/usr/bin/env python

from flask import request, jsonify
from app import app, db, Network
import anyjson as json


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

from nest_app.nest_simulation import nest_simulation
from nest_app.bump_activity import bump_activity

@app.route('/nest_simulation/', methods=['POST'])
def app_nest_simulation():
    data = request.get_json()
    return jsonify(nest_simulation(data))

@app.route('/bump_activity/', methods=['POST'])
def app_bump_activity():
    data = request.get_json()
    return jsonify(bump_activity(data))


if __name__ == '__main__':
    app.run()
