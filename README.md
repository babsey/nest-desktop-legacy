# nest-desktop

**A NEST desktop application**

This is a desktop application for the NEural Simulation Tool.(http://www.nest-initiative.org/)

## To Use

To install and to run this application you'll need [NEST](http://www.nest-simulator.org/), [Flask](http://flask.pocoo.org) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash (Ubuntu)

# Install NEST
cd Downloads
wget https://github.com/nest/nest-simulator/releases/download/v2.10.0/nest-2.10.0.tar.gz
tar -zxf nest-2.10.0.tar.gz
cd nest-2.10.0
./configure --prefix=$HOME/opt/nest
make
make install

# Install Flask
sudo pip install Flask

# Install nodejs
sudo apt-get install nodejs

# Install nest-desktop
npm install nest-desktop

# Install dependencies for nest-desktop
cd nest-desktop
npm install

# Run the app (with starting flask server)
bash ./bin/nest-desktop.sh
```

#### License [MIT](LICENSE)
