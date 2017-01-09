# nest-desktop

**A NEST desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).


## To install (Ubuntu)

To install this application you'll need [NEST](http://www.nest-simulator.org/), [Flask](http://flask.pocoo.org) for the server, [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](http://electron.atom.io/) installed on your computer.


### To install NEST

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


### to install server for NEST

Install Flask via pip (I encourage you to use virtualenv)
```
pip install flask
```

Download nest-server from github
```
git clone https://github.com/babsey/nest-server.git
```


### To install nest-desktop

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


Start server (with flask)
```
cd nest-server
python routers.py
```


## To start

### Server

Start server with flask in nest-server folder
```
python routers.py
```


### Desktop

Run the app (with starting flask server) in nest-desktop folder
```
npm start
```
or
```
electron .
```
or
```
electron main.js
```

Keybindings to close the app are 'CTRL + W'


#### License [MIT](LICENSE)
