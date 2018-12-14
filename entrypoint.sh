#!/bin/bash

service nginx start

# load NEST enviroment
source $1/bin/nest_vars.sh

# run NEST server
python3 app/main.py -H 0.0.0.0 -p 5000
