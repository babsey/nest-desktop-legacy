# nest-desktop

**A NEST Desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).

### Download
```
git clone https://github.com/babsey/nest-desktop.git
git checkout Angular
```

### Build

Build a docker image
```
docker build -t nest-desktop .
```

(Alternative) If you have dist folder of nest-desktop on host system to copy.
```
docker build -t nest-desktop -f Dockerfile-dist .
```

### Start

Run a docker container
```
docker run -d -t nest-desktop -p 80:80 -p 5000:5000
```

Then open any browser (http://localhost).

### License [MIT](LICENSE)
