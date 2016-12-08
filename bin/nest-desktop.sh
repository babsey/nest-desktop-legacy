#!/usr/bin/env bash

python -c 'import flask'
FLASK=$?

python -c 'import nest'
NEST=$?

CURPATH=`dirname $(readlink -f $0)`
cd ${CURPATH}/..


if [ ${NEST} -eq 0 ] && [ ${FLASK} -eq 0 ]
    then

    FILENAME=${1:-'single_neuron_mm'}

    # Run local server for nest
    # netstat -na | grep 5000
    # lsof -t -i:5000
    python ./flask-server/${FILENAME}.py &
    mkdir ./log
    echo $! > ./log/${FILENAME}.pid

    # start nest-desktop
    npm start

    # Kill local server
    kill -9 `cat ./log/${FILENAME}.pid`
else
    echo '-------------------------------------------------------------------'
    echo 'Required packages have to be installed before running nest-desktop:'
fi

if [ ${FLASK} -eq 1 ]
    then
    echo ' - Flask not found. ( http://flask.pocoo.org/ )'
fi

if [ ${NEST} -eq 1 ]
    then
    echo ' - NEST not found. ( http://www.nest-simulator.org/ )'
fi
