# NEST Desktop

**An interactive desktop application for [NEST simulator](http://www.nest-simulator.org/)**

![nest logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

### Introduction

In the past few years, we have developed a web-based graphical user interface (GUI) for the NEST simulation code of the NEST Desktop. This GUI enables the rapid construction, parametrization, and instrumentation of neuronal network models typically used in computational neuroscience. The primary objective of our development was to create a tool of classroom strength that allows non-specialists to rapidly explore interesting neuroscience concepts without the need to learn a simulator control language at the same time.

To date, we have used NEST Desktop very successfully in two courses at the University of Freiburg addressing students at the bachelor, master, and graduate level with diverse background including biology, physics, computer science and electrical engineering (Single Neuron Modeling and Biophysics of Neurons and Networks). NEST Desktop replaced the Mathematica notebooks we used for many years. With the new tool, we observed much faster learning progress than before and a highly motivating effect on the side of the students.

Currently, NEST Desktop requires NEST Server with a full NEST installation, limiting uptake by a non-expert audience and limiting networks studied to such that can be simulated on a laptop. To ease the use of NEST Desktop and the range of simulations possible with NEST Desktop, we want to separate GUI from simulation kernel, rendering the GUI in the web browser of the user, while the simulation kernel is running on a centrally maintained server.

### Setup
To install NEST Desktop:
```
pip3 install nest-desktop
```

### Usage
To start NEST Desktop:
```
nest-desktop start [-h 127.0.0.1 -p 8000]
```

Alternatively, to start NEST Server in Python interface (e.g. IPython, Jupyter):
```
from nest_desktop import app
app.run(host='127.0.0.1', port=5000)
```

Open a web browser with this link [http://127.0.0.1:8000](http://127.0.0.1:8000).


### Troubleshootings

With version upgrading some configurations or database might not be compatible.
Sometimes it helps when you reset configurations or databases. If not, then clear the browsing data.

### License [MIT](LICENSE)
