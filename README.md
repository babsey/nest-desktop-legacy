# NEST Desktop

**An interactive desktop application for [NEST simulator](http://www.nest-simulator.org/)**

![nest logo](src/img/nest-accent.svg)

### Abstract

In the past few years, we have developed a web-based graphical user interface (GUI) for the NEST simulation code of the NEST Desktop. This GUI enables the rapid construction, parametrization, and instrumentation of neuronal network models typically used in computational neuroscience. The primary objective of our development was to create a tool of classroom strength that allows non-specialists to rapidly explore interesting neuroscience concepts without the need to learn a simulator control language at the same time.

To date, we have used NEST Desktop very successfully in two courses at the University of Freiburg addressing students at the bachelor, master, and graduate level with diverse background including biology, physics, computer science and electrical engineering (Single Neuron Modeling and Biophysics of Neurons and Networks). NEST Desktop replaced the Mathematica notebooks we used for many years. With the new tool, we observed much faster learning progress than before and a highly motivating effect on the side of the students.

Currently, NEST Desktop requires NEST Server with a full NEST installation, limiting uptake by a non-expert audience and limiting networks studied to such that can be simulated on a laptop. To ease the use of NEST Desktop and the range of simulations possible with NEST Desktop, we want to separate GUI from simulation kernel, rendering the GUI in the web browser of the user, while the simulation kernel is running on a centrally maintained server.

### Architecture

This GUI Application NEST Desktop is developed for the client side and NEST Server for the server side. These two compartments use web socket (by default on port 5000) to communicate to each other.

On one side, the client compartment is written in HTML5 and is easily accessible for the users. On the other side the server compartment is written in Python and is designed to construct and to simulate neuronal networks in a Python interface PyNEST implemented in NEST code.

In a simple configuration, both compartments are setup on the local machine, e.g. PC or laptops. Moreover, NEST Server can be installed on the remote machine (e.g. server, cloud, cluster computers, super computer) or within virtual machine (e.g. Docker, Singularity). See [instructions](https://github.com/babsey/nest-server) to setup NEST Server.

Advanced developer can pull the source code of NEST Desktop to deploy the application on the server (See [installation instructions](INSTALL.md)).

### Installation instructions


#### Download
```
git clone https://github.com/babsey/nest-desktop.git
cd nest-desktop
git checkout Angular
```

#### Install on host system

###### Step 1
Install node.js 8 or higher (See [instructions](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)).

###### Step 2
Install node modules for NEST Desktop.
```
npm install
```

###### Step 3
Deploy the application to `./dist` folder ([Angular Guide](https://angular.io/guide/deployment)).
```
npm run build
```

###### Step 3 (alternative)
Build and serve the app, rebuild on file changes. It is running on http://localhost:4200.
```
npm start
```

###### Step 4
Open `./dist/nest-desktop/index.html` with any web browser (I prefer Chromium-based).
```
Chromium dist/nest-desktop/index.html
```

###### Step 4 (alternative)
If you use nginx, copy everything within the output folder (`dist/` by default) to a folder on the server (e.g. `/var/www/html/`). Then restart nginx service. It is running on http://localhost (by default port is 80).
```
sudo service nginx restart
```

###### Step 4 (alternative)
Run the app with Electron ([Electron tutorial](https://electronjs.org/docs/tutorial/first-app#running-your-app))
```
npm run electron
```

###### Step 4 (alternative)
Build a standalone app with Electron ([Electron tutorial](https://electronjs.org/docs/tutorial/first-app#running-your-app))
```
npm run electron-build
```


#### Docker (with sudo)

###### Step 1
Install docker
```
sudo apt-get install docker
```

###### Step 2
Start docker daemon
```
sudo service docker start
```

###### Step 3
Build a docker image
```
sudo docker build -f Dockerfiles/nest-desktop.Dockerfile -t nest-desktop .
```

###### Step 3 (better)
Build a docker image using build stages. Minimize space of docker image.
```
sudo docker build -f Dockerfiles/nest-desktop-stages.Dockerfile -t nest-desktop .
```

###### Step 3 (alternative)
Build docker image with copy dist
If you have dist folder of nest-desktop on host system to copy.
```
sudo docker build -f Dockerfiles/nest-desktop-dist.Dockerfile -t nest-desktop .
```

###### Step 3 (alternative)
Load image from a file (`nest-desktop-x.x.x.dimg`)
```
sudo docker load --input nest-desktop-x.x.x.dimg
```

###### Step 4
Show docker images
```
sudo docker images
```

###### Step 5
Run docker container with daemon.
```
sudo docker run -d -p 8000:80 -p 5000:5000 -t nest-desktop
```

###### Step 6
Open any browser. http://localhost:8000


###### Step 7
Check if docker container is running.
```
sudo docker ps
```

###### Step 8
Stop docker container.
```
sudo docker stop <CONTAINER ID>
```


#### Singularity

See [instructions](https://github.com/babsey/nest-server/INSTALL.md#singularity).

Start NEST Desktop on host system (See above).

### License [MIT](LICENSE)
