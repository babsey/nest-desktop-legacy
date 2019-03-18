# NEST Desktop

**An interactive desktop application for [NEST simulator](http://www.nest-simulator.org/)**

![nest logo](app/assets/img/nest.svg)

### Abstract

In the past few years, we have developed a web-based graphical user interface (GUI) for the NEST simulation code of the NEST Desktop. This GUI enables the rapid construction, parametrization, and instrumentation of neuronal network models typically used in computational neuroscience. The primary objective of our development was to create a tool of classroom strength that allows non-specialists to rapidly explore interesting neuroscience concepts without the need to learn a simulator control language at the same time.

To date, we have used NEST Desktop very successfully in two courses at the University of Freiburg addressing students at the bachelor, master, and graduate level with diverse background including biology, physics, computer science and electrical engineering (Single Neuron Modeling and Biophysics of Neurons and Networks). NEST Desktop replaced the Mathematica notebooks we used for many years. With the new tool, we observed much faster learning progress than before and a highly motivating effect on the side of the students.

Currently, NEST Desktop requires NEST Server with a full NEST installation, limiting uptake by a non-expert audience and limiting networks studied to such that can be simulated on a laptop. To ease the use of NEST Desktop and the range of simulations possible with NEST Desktop, we want to separate GUI from simulation kernel, rendering the GUI in the web browser of the user, while the simulation kernel is running on a centrally maintained server.

### Architecture

This GUI Application NEST Desktop is developed for the client side and NEST Server for the server side. These two compartments use web socket (by default on port 5000) to communicate to each other.

On one side, the client compartment is written in HTML5 and is easily accessible for the users. On the other side the server compartment is written in Python and is designed to construct and to simulate neuronal networks in a Python interface PyNEST implemented in NEST code.

In a simple configuration, both compartments are installed on the local machine, e.g. PC or laptops. Moreover, NEST Server can be installed on a remote machine (e.g. server, cloud, cluster computers, super computer) or in a virtual machine (e.g. Docker, Singularity).

### Download
```
git clone https://github.com/babsey/nest-desktop.git
cd nest-desktop
```

### Start

###### Step 1
Start NEST Server (See [instructions](https://github.com/babsey/nest-server) of NEST Server).

###### Step 2
Open [app/index.html](app/index.html) with a web browser (I prefer Chromium-based).

###### Step 2 (alternative) as sudo
In case you use `nginx`, move all files to `/var/www/html`.

```
sudo rm -rf /var/www/html/
sudo mv app/* /var/www/html/
```

Then restart nginx service.

```
sudo service nginx restart
```
Open a web browser with this link [localhost](http://localhost).

### FAQ

#### Troubleshootings

It is not able to start. With minor version bumping (1.x to 1.y) some configurations or database might not be compatible. Sometimes it helps when you clear the browsering data.

### License [MIT](LICENSE)
