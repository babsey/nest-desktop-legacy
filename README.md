# nest-desktop

**NEST Desktop**

![nest-logo](http://www.github.com/babsey/nest-desktop/Angular/src/img/nest-accent.svg)

An interactive desktop application for [NEST simulator](http://www.nest-simulator.org/).

## Download
```
git clone https://github.com/babsey/nest-desktop.git
cd nest-desktop
git checkout Angular
```


## Usage

### Using host system

#### Prepare for Angular

Install requirements for nest server (See [instructions](https://github.com/babsey/nest-server)).

Install nodejs 8 or higher (See [instructions](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions))

Install node modules
```
npm install
```

#### Start

Start nest server (See [instructions](https://github.com/babsey/nest-server)).

##### Open a plain file.

Compile nest desktop to dist.
```
npm run build
```

##### Start a plain file.

Open dist/nest-desktop/index.html with any web browser (I prefer Chromium-based).

##### Alternative start with Angular (for developers)

Build and serve nest desktop, rebuild on file changes.
```
npm start
```

##### Alternative start Electron

```
npm run electron
```


### Using Docker

#### Prepare Docker

Install docker (with sudo)
```
sudo apt-get install docker
```

#### Build Docker image (with sudo)

Build a docker image
```
sudo docker build -f Dockerfiles/nest-desktop.Dockerfile -t nest-desktop .
```

(Better) Build a docker image using build stages. Minimize space of docker image.
```
sudo docker build -f Dockerfiles/nest-desktop-stages.Dockerfile -t nest-desktop .
```

(Alternative) If you have dist folder of nest-desktop on host system to copy.
```
sudo docker build -f Dockerfiles/nest-desktop-dist.Dockerfile -t nest-desktop .
```

#### (Alternative) Load image from a file (nest-desktop.tar)

Load a docker image
```
sudo docker load --input nest-desktop.tar
```

#### Start Docker container (with sudo)

Run a docker container
```
sudo docker run -d -p 8000:80 -p 5000:5000 -t nest-desktop
```

Then open any browser (http://localhost:8000).



### Using Singularity

See [instructions](https://github.com/babsey/nest-server#using-singularity).

Start nest desktop (See above).

## License [MIT](LICENSE)
