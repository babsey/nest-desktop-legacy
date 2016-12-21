#!/bin/bash

echo 'Testing required packages:'
python -c 'import flask'
FLASK=$?
python -c 'import flask_sqlalchemy'
FLASK_SQLALCHEMY=$?
python -c 'import migrate'
MIGRATE=$?
python -c 'import nest'
NEST=$?
if [ ${FLASK} -eq 1 ]
    then
    echo ' - Flask not found. ( http://flask.pocoo.org/ )'
else
    echo ' - Flask found.'
fi
if [ ${FLASK_SQLALCHEMY} -eq 1 ]
    then
    echo ' - Flask sqlalchemy not found.'
else
    echo ' - Flask sqlalchemy found.'
fi
if [ ${MIGRATE} -eq 1 ]
    then
    echo ' - Migrate not found.'
else
    echo ' - Migrate found.'
fi
if [ ${NEST} -eq 1 ]
    then
    echo ' - NEST not found. ( http://www.nest-simulator.org/ )'
else
    echo ' - NEST found.'
fi
