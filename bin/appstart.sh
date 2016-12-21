#!/bin/bash

# Run flask server
python ./flask/views.py &
echo $! > ./flask/server.pid

# Start nest-desktop
npm start

# Kill flask server
kill -9 `cat ./flask/server.pid`
rm ./flask/server.pid
