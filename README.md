# nest-desktop

**A NEST Desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).

To install this application you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](http://electron.atom.io/) installed on your computer. Required version for node at least v6.10.xx and npm v3.10.xx.

If you simulate nest locally, you need [nest-server-simulation](https://github.com/babsey/nest-server-simulation) installed on your computer.
I tested the application with NEST v2.12.

Optional: To store network data remotely, you need [nest-server-store](https://github.com/babsey/nest-server-store) installed on remoted computer.

## To install requirements

### Ubuntu

Install git with sudo
```
sudo apt-get install git
```

Install node with sudo
```
sudo apt-get install nodejs
```
or compile from [source code](https://nodejs.org/en/download/)
Note that nodejs should be removed if you want to install node from source code.

### Mac OSX (>=10.10)

Install git and node
```
brew install git nodejs
```

## To install NEST Desktop

Clone nest-desktop from github.
```
git clone http://github.com/babsey/nest-desktop
```

Install required dependencies for nest-desktop.
```
cd nest-desktop
npm install
```

## To update NEST Desktop

pull the latest version of nest-desktop from github (in nest-desktop folder).
```
git pull
```

Install required dependencies for nest-desktop.
```
npm install
```


## To start

Nest-desktop communicates with the nest-server-simulation to run the NEST simulation. Note: Make sure that the nest-server-simulation is running.

Start the app in nest-desktop folder.
```
npm start
```

## To configure

A simple configuration handling for your the nest-desktop application.

### For the app

The configuration for the app is saved as 'nest-desktop.json' file in
- %APPDATA%/configstore on Windows
- $XDG_CONFIG_HOME or ~/.config/configstore on Linux
- ~/Library/Application Support/configstore on Mac OSX

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


### For the window interface with electron

The configuration for the electron is saved as 'config.json' file in
- %APPDATA%/nest-desktop on Windows
- $XDG_CONFIG_HOME or ~/.config/nest-desktop on Linux
- ~/Library/Application Support/nest-desktop on Mac OSX

#### Window configuration
The application create a window with these window properties - width, height, frame, fullscreen.


## FAQ

#### Why is the app not working?
First, be assure that you installed all required npm packages (`npm install`).

If still not working, the configuation may be deprecated. In this case, delete the config file or just empty `db_name` in config file (stored as `nest-desktop.json` in configstore), then restart the app. It will generate new config file and new database.

If still not working, the database may be deprecated. In this case, delete the all files in ./data/, then restart the app.

Besides, I am working on a better solution.

#### Where are the data of simulation stored?
Saved data about simulation are stored as NeDB database in ./data/\*.db

#### Where are the protocols of simulation stored?
Protocols about simulation are stored as NeDB database in ./data/protocols/\*.db

#### Where are the thumbnails of simulation stored?
Thumbnails are stored in ./data/images/

#### Why is the protocol not working?
Just remove db files in ./data/protocols/

#### How can I update the thumbnails?
Just click the button 'capture screen'
For the hard case, remove image files in ./data/images/ and then resimulate.

#### How can I reload the window?
Keybinding to reload the app is 'CTRL + R' (Linux) or 'CMD + R' (Mac OSX)

#### How can I close the window?
Keybinding to close the window is 'CTRL + W' (Linux) or 'CMD + W' (Mac OSX). In Linux the app will be closed when the window is closed.

#### How can I close the app (only for Mac OSX)?
Keybinding to close the window is 'CMD + Q'


#### License [MIT](LICENSE)
