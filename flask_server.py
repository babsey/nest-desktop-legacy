#!/usr/bin/env python

from flask import Flask
app = Flask(__name__)

from flask_apps.neuronal_activity import load_neuronal_activity
from flask_apps.spike_activity import load_spike_activity
# from flask_apps.basal_ganglia_activity import load_basal_ganglia_activity

load_neuronal_activity(app)
load_spike_activity(app)
# load_basal_ganglia_activity(app)

if __name__ == '__main__':
    app.run()
