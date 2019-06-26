#!/bin/bash

service nginx start

# load NEST enviroment
source /opt/nest-simulator/bin/nest_vars.sh

pouchdb-server start --dir $NESTDESKTOP_DATA_DIR/db &

# run NEST server
cd /opt/nest-server
uwsgi --http-socket :5000 --module app.main:app
