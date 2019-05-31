#!/bin/bash

service nginx start

# load NEST enviroment
source /opt/nest-simulator/bin/nest_vars.sh

# run NEST server
python3 /opt/nest-server/app/main.py -H 0.0.0.0 -p 5000
