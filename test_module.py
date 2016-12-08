#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
sys.path.append('/usr/local/lib/python2.7/dist-packages')

from flask import Flask
app = Flask(__name__)

import nest

@app.route("/")
def index():
    return "Hello World! This is powered by Python backend."



if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)
