# NEST Desktop

**An interactive desktop application for [NEST simulator](http://www.nest-simulator.org/)**

![nest logo](src/img/nest-accent.svg)

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
Build a package with Electron ([Electron tutorial](https://electronjs.org/docs/tutorial/first-app#running-your-app))
```
npm run electron-packager
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
or
```
sudo systemctl start docker
```

###### Step 3.a
Build a docker image using build stages. It minimizes space of docker image.
(X.Y refers to a specific version number)
```
sudo docker build -f docker/dockerfiles/nest-desktop-build.Dockerfile -t nest/nest-desktop:X.Y .
```

###### Step 3.b (alternative)
Build a docker image in one stage.
```
sudo docker build -f docker/dockerfiles/nest-desktop.Dockerfile -t nest/nest-desktop:X.Y .
```

###### Step 3.c (alternative)
Build docker image and copy dist files from host.
```
sudo docker build -f docker/dockerfiles/nest-desktop-dist.Dockerfile -t nest/nest-desktop:X.Y .
```

###### Step 3.d (alternative)
Load image from a file (`nest-desktop-vX.Y.dimg`)
```
sudo docker load --input nest-desktop-vX.Y.dimg
```

###### Step 4
Show docker images
```
sudo docker images
```

###### Step 5
Run docker container with daemon.
```
sudo docker run -d -p 8000:80 -p 5000:5000 -t nest/nest-desktop:X.Y
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
