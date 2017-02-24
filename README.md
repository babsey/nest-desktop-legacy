# nest-desktop

**A NEST Desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).

To install this application you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](http://electron.atom.io/) installed on your computer.

If you simulate nest locally, you need [nest-server-simulation](https://github.com/babsey/nest-server-simulation) installed on your computer.

Optional: To store network data remotely, you need [nest-server-store](https://github.com/babsey/nest-server-store) installed on remoted computer.

## To install requirements

### Ubuntu

Install git and node with sudo
```
sudo apt-get install git nodejs
```

### Mac OSX

Install git and node
```
brew install git nodejs
```

## To install NEST Desktop

Clone nest-desktop from github
```
git clone http://github.com/babsey/nest-desktop
```

Install dependencies of nest-desktop
```
cd nest-desktop
npm install
```


## To start

Nest-desktop communicates with the nest-server-simulation to run the NEST simulation.
Note: Make sure that the nest-server-simulation is running.

Start the app in nest-desktop folder
```
npm start
```

## To configure

A simple configuration handling for your the nest-desktop application.

The configuration is saved as 'config.json' file in
- %APPDATA%/nest-desktop on Windows
- $XDG_CONFIG_HOME or ~/.config/nest-desktop on Linux
- ~/Library/Application Support/nest-desktop on Mac OSX

#### Window configuration
The application create a window with these window properties - width, height, frame, fullscreen.

#### Nest simulation server
To edit the host and port if the nest simulation server operates on other computer.

#### Database
Nest-desktop stores data of the network in the database but without any simulation results to keep space low.

The database name will be generated when config.json is created.
User is able to edit the database name but it should be treated with respect.

### Local database
The data will also be stored in local database located in path defined by `localDB.path`.

#### Remoted server
If you want to contribute your networks to the server,
edit username, password as well as host and port of the remoted database.


## FAQ

#### Where are the data about simulation stored?
Saved data about simulation are stored in NeDB database ./data/*.db

#### How can I reload the window?
Keybinding to reload the app is 'CTRL + R' (Linux) or 'CMD + R' (Mac OSX)

#### How can I close the window?
Keybinding to close the window is 'CTRL + W' (Linux) or 'CMD + W' (Mac OSX)
In Linux the app will be closed when the window is closed.

#### How can I close the app (only for Mac OSX)?
Keybinding to close the window is 'CMD + Q'

#### How can I update the thumbnails?
Just remove image files in ./data/images/ and then resimulate


#### License [MIT](LICENSE)
