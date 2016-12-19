#!/usr/bin/env bash
NESTAPP="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"

function nest-desktop_testpath  {
    echo $NESTAPP
}

function nest-desktop_testmodule {
    echo 'Testing required packages'

    python -c 'import flask'
    FLASK=$?
    if [ ${FLASK} -eq 1 ]
        then
        echo ' - Flask not found. ( http://flask.pocoo.org/ )'
    else
        echo ' - Flask found.'
    fi

    python -c 'import nest'
    NEST=$?
    if [ ${NEST} -eq 1 ]
        then
        echo ' - NEST not found. ( http://www.nest-simulator.org/ )'
    else
        nest --version
    fi
}

function nest-desktop_db-create  {
    cd ${NESTAPP}/flask
    python ./app/db_create.py
}

function nest-desktop_start  {
    cd ${NESTAPP}

    python -c 'import flask'
    FLASK=$?

    python -c 'import nest'
    NEST=$?

    if [ ${NEST} -eq 0 ] && [ ${FLASK} -eq 0 ]
        then

        # Run flask server
        python ./flask/views.py &
        echo $! > ./flask/server.pid

        # Start nest-desktop
        npm start

        # Kill flask server
        kill -9 `cat ./flask/server.pid`
        rm ./flask/server.pid

        # Check if port 5000 is running
        # netstat -na | grep 5000

        # Get PID of the port 5000
        lsof -t -i:5000
    else
        echo '-------------------------------------------------------------------'
        echo 'Required packages have to be installed before running nest-desktop:'
    fi
}
