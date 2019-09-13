#!/bin/bash

set -e

USER_ID=${LOCAL_USER_ID:-9001}

echo "UID : $USER_ID"
adduser --disabled-login --gecos 'NEST' --uid $USER_ID --home /home/nest nest
export HOME=/home/nest
cd $HOME

echo '. /opt/nest/bin/nest_vars.sh' >> /home/nest/.bashrc

# NEST environment
source /opt/nest/bin/nest_vars.sh

# start NEST Desktop
python3 -m nest_desktop.app &

# start NEST Server
uwsgi --http-socket :5000 --uid nest --module nest_server.main:app
