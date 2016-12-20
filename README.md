# nest-desktop

**A NEST desktop application**

An interactive desktop application for the NEural Simulation Tool (http://www.nest-initiative.org/).

## To install

To install this application you'll need [NEST](http://www.nest-simulator.org/), [Flask](http://flask.pocoo.org) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:


Install NEST with PyNEST in your home folder
Read the installation instructions: http://www.nest-simulator.org/installation/
```bash (Ubuntu)
wget https://github.com/nest/nest-simulator/releases/download/v2.10.0/nest-2.10.0.tar.gz
tar -zxf nest-2.10.0.tar.gz
cd nest-2.10.0
```

Install standard configuration before installing NEST
```bash (Ubuntu)
sudo apt-get install build-essential autoconf automake libtool libltdl7-dev libreadline6-dev libncurses5-dev libgsl0-dev python-all-dev
```

Optional packages for python:
```bash (Ubuntu)
sudo apt-get install python-numpy python-scipy python-matplotlib ipython
```

For Python 2.7
```bash (Ubuntu)
./configure --prefix=$HOME/opt/nest
```

For Python 3.4
```bash (Ubuntu)
cmake -Dwith-python=3 $HOME/opt/nest
```

Start making and installing NEST
```bash (Ubuntu)
make
make install
```

Make sure that NEST is in PYTHONPATH (add this in .bashrc)
```bash (Ubuntu)
export PYTHONPATH=$HOME/opt/nest/lib/pyton2.7/sist-packages:$PYTHONPATH
```

Install Flask (with root right)
```bash (Ubuntu)
sudo apt-get install python-flask
```

Install database access for Flask (version ^0.3.0)
via pip (I encourage you to use virtualenv)
```bash (Ubuntu)
pip install anyjson migrate flask-sqlalchemy
```

Install nodejs (with root right)
```bash (Ubuntu)
sudo apt-get install nodejs
```

Install nest-desktop and its dependencies
```bash (Ubuntu)
npm install nest-desktop -g
```

## To use
Load nest-desktop command
```bash (Ubuntu)
source ./node_modules/nest-desktop/bin/nest-desktop.sh
```

Test required modules for nest-desktop
```bash (Ubuntu)
nest-desktop testmodule
```

Create a sqlite database
```bash (Ubuntu)
nest-desktop init
```

Run the app (with starting flask server)
```bash (Ubuntu)
nest-desktop start
```
Close the app with CTRL + W or Esc

Check if port 5000 is running
```bash (Ubuntu)
nest-desktop checkport
```

Kill the port 5000
```bash (Ubuntu)
nest-desktop killport
```

#### License [MIT](LICENSE)
