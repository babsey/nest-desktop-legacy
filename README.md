# nest-desktop

**A NEST desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).


## To install (Ubuntu)

To install this application you'll need [nest-server-simulation][https://github.com/babsey/nest-server-simulation], [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](http://electron.atom.io/) installed on your computer.

Optional: To store network data remotely, you need [nest-server-store][https://github.com/babsey/nest-server-store].

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

Nest-desktop communicates with the nest-server-simulation to run the NEST simulation.
Note: Make sure that the nest-server-simulation is running.

Start the app in nest-desktop folder
```
npm start
```

## FAQ

#### It is broken. How can I reload the window?

Keybinding to reload the app is 'CTRL + R'

#### It is broken. How can I close the window?

Keybinding to close the app is 'CTRL + W'



#### License [MIT](LICENSE)
