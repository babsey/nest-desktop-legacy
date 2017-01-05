#!/bin/bash

# http://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash

function nest-desktop {
    OLDPATH=`pwd`
    CURPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"

    case "$1" in
        '')
            cat ${CURPATH}/.bin/help.txt
        ;;
        checkport)
            echo netstat -na | grep 5000
        ;;
        init)
            cd ${CURPATH}/flask
            python ./app/db_create.py
            cd ${OLDPATH}
        ;;
        help)
            cat ${CURPATH}/.bin/help.txt
        ;;
        killport)
            kill `lsof -t -i:5000`
        ;;
        list)
            npm list --depth=0
        ;;
        path)
            echo ${CURPATH}
        ;;
        server-only)
            python ${CURPATH}/flask/views.py
        ;;
        start)
            cd ${CURPATH}
            ./.bin/appstart.sh
            cd ${OLDPATH}
        ;;
        test)
            ${CURPATH}/.bin/test.sh
        ;;
        version)
            # https://gist.github.com/DarrenN/8c6a5b969481725a4413
            # Version key/value should be on his own line
            PACKAGE_VERSION=$(cat ${CURPATH}/package.json \
              | grep version \
              | head -1 \
              | awk -F: '{ print $2 }' \
              | sed 's/[",]//g' \
              | tr -d '[[:space:]]')
            echo $PACKAGE_VERSION
        ;;
        *)
            cat ${CURPATH}/bin/help.txt
        ;;
    esac
}
