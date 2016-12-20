#!/bin/bash

function nest-desktop {
    echo 'A NEST desktop application'
    OLDPATH=`pwd`
    CURPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"

    START=true
    while [[ $# -gt 0 ]]
    do
    key="$1"

    case $key in
        -cp|--check-port)
            START=false
            netstat -na | grep 5000
        ;;
        -i|--init)
            START=false
            cd ${CURPATH}/flask
            python ./app/db_create.py
        ;;
        -kp|--kill-port)
            START=false
            kill `lsof -t -i:5000`
        ;;
        -s|--server-only)
            START=false
            cd ${CURPATH}
            # Run flask server
            python ./flask/views.py
        ;;
        -tm|--test-module)
            START=false
            ${CURPATH}/bin/nest-desktop-test.sh
        ;;
        -tp|--test-path)
            START=false
            echo ${CURPATH}
        ;;
        -v|--version)
            START=false
            echo '0.3.2'
        ;;
        *)
            START=false
            echo '-cp | --checkport'
        ;;
    esac
    shift # past argument or value
    done

    if [ $START = true ]
        then
        cd ${CURPATH}
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
    fi
    cd ${OLDPATH}
}
