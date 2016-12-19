# nest-desktop

**A NEST desktop application**

An interactive desktop application for the NEural Simulation Tool (http://www.nest-initiative.org/).

## To Use

To install and to run this application you'll need [NEST](http://www.nest-simulator.org/), [Flask](http://flask.pocoo.org) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash (Ubuntu)

# Install NEST with PyNEST in your home folder (for Python 2.7)
wget https://github.com/nest/nest-simulator/releases/download/v2.10.0/nest-2.10.0.tar.gz
tar -zxf nest-2.10.0.tar.gz
cd nest-2.10.0
./configure --prefix=$HOME/opt/nest
make
make install

# Make sure that NEST is in PYTHONPATH (add this in .bashrc)
export PYTHONPATH=$HOME/opt/nest/lib/pyton2.7/sist-packages:$PYTHONPATH

# Install for Flask server (with root right)
sudo pip install Flask

# Install database access in sqlite for Flask (version ^0.3.0) (with root right)
sudo pip install anyjson tempita sqlparse migrate sqlalchemy flask_sqlalchemy

# Install nodejs (with root right)
sudo apt-get install nodejs

# Install nest-desktop and its dependencies
npm install nest-desktop -g

# load commands for nest-desktop
source ./node_modules/nest-desktop/bin/nest-desktop.sh

# Create a sqlite database

# Run the app (with starting flask server)
cd node_modules/nest-desktop
bash ./bin/nest-desktop.sh

# Close the app with CTRL + W or Esc
```

#### License [MIT](LICENSE)
