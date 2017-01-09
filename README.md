# nest-desktop

**A NEST desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).

## To install (Ubuntu)

To install this application you'll need [NEST](http://www.nest-simulator.org/), [Flask](http://flask.pocoo.org), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](http://electron.atom.io/) installed on your computer. From your command line:

Install standard configuration before installing NEST
```
sudo apt-get install build-essential autoconf automake libtool libltdl7-dev libreadline6-dev libncurses5-dev libgsl0-dev python-all-dev
```

Optional packages for python:
```
sudo apt-get install python-numpy python-scipy python-matplotlib ipython
```

Install NEST with PyNEST in your home folder.
Read the [installation instructions](http://www.nest-simulator.org/installation/).

```
wget https://github.com/nest/nest-simulator/releases/download/v2.10.0/nest-2.10.0.tar.gz
tar -zxf nest-2.10.0.tar.gz
cd nest-2.10.0
```

For Python 2.7
```
./configure --prefix=$HOME/opt/nest
```

Start making and installing NEST
```
make
make install
```

Make sure that NEST is in the PYTHONPATH (or add this line in .bashrc file)
```
export PYTHONPATH=$HOME/opt/nest/lib/pyton2.7/site-packages:$PYTHONPATH
```

Install Flask
via pip (I encourage you to use virtualenv)
```
pip install flask
```

Install nodejs with sudo
```
sudo apt-get install nodejs
```

Install [Electron](https://github.com/electron/electron) globally with sudo (latest tested version: 1.4.13)
```
sudo npm install electron -g
```

Install nest-desktop and its dependencies
```
npm install nest-desktop
```

## To start
Load nest-desktop command
```
source ./node_modules/nest-desktop/.bin/nest-desktop.sh
```

Run the app (with starting flask server)
```
nest-desktop start
```
Keybindings to close the app are 'CTRL + W'

## For further usage

Test required modules for nest-desktop
```
nest-desktop test
```

Check if port 5000 is running
```
nest-desktop checkport
```

Kill the port 5000
```
nest-desktop killport
```

Show all available commands
```
nest-desktop help
```

#### License [MIT](LICENSE)
