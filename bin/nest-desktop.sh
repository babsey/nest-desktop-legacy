#!/bin/bash

function nest-desktop {
    OLDPATH=`pwd`
    NESTAPP="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
    echo $1
    echo `$1 = 'testpath'`

    if [ $1 = 'testpath' ]
        then
        echo $NESTAPP
    fi

    if [ $1 = 'testmodule' ]
        then
        echo 'Testing required packages:'

        python -c 'import flask'
        FLASK=$?

        python -c 'import nest'
        NEST=$?

        if [ ${FLASK} -eq 1 ]
            then
            echo ' - Flask not found. ( http://flask.pocoo.org/ )'
        else
            echo ' - Flask found.'
        fi

        if [ ${NEST} -eq 1 ]
            then
            echo ' - NEST not found. ( http://www.nest-simulator.org/ )'
        else
            echo ' - NEST found.'
        fi
    fi

    if [ $1 = 'init' ]
        then
        cd ${NESTAPP}/flask
        python ./app/db_create.py
        cd ${OLDPATH}
    fi

    # Check if port 5000 is running
    if [ $1 = 'checkport' ]
        then
        netstat -na | grep 5000
    fi

    if [ $1 = 'killport' ]
        then
        kill `lsof -t -i:5000`
    fi

    if [ $1 = 'start' ]
        then
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
        else
            echo '-------------------------------------------------------------------'
            echo 'Required packages have to be installed before running nest-desktop.'
        fi
        cd ${OLDPATH}
    fi
}
