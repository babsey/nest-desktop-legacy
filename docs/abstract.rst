Abstract
========

**NEST Desktop: A web-based GUI for NEST Simulator**

Sebastian Spreizer :sup:`1,2`, Stefan Rotter :sup:`1`, Benjamin Weyers :sup:`3`, Hans E Plesser :sup:`4`, Markus Diesmann :sup:`2`

1. Bernstein Center Freiburg, Faculty of Biology, University of Freiburg, Freiburg, Germany
2. Institute of Neuroscience and Medicine (INM-6) Jülich Research Centre, Jülich, Germany
3. Department IV - Computer Science, Human-Computer Interaction, University of Trier, Trier, Germany
4. Faculty of Science and Technology, Norwegian University of Life Sciences, Ås, Norway

Email: s.spreizer@fz-juelich.de

In the past few years, we have developed a web-based graphical user interface (GUI) for the NEST
simulation code: NEST Desktop [1]_. This GUI enables the rapid construction, parametrization, and
instrumentation of neuronal network models typically used in computational neuroscience. The primary
objective was to create a tool of classroom strength that allows users to rapidly explore neuroscience
concepts without the need to learn a simulator control language at the same time.

Currently, NEST Desktop requires a full NEST installation on the user's machine, limiting uptake by a
non-expert audience, and limiting the networks studied to such that can be simulated on a laptop or
desktop machine. To ease the use of the app and the range of simulations possible with NEST Desktop,
we want to separate the GUI from the simulation kernel, rendering the GUI in the web browser of the
user, while the simulation kernel is running on a centrally maintained server.

NEST Desktop has a high potential to be successful as a widely used GUI for the NEST Simulator. To
achieve this goal, in a first step all tools have to agree on a communication scheme and data format
(using JSON) used to interact with a server-side running NEST instance in a session management, e.g.
Docker or Singularity containers. Next, previously developed tools, namely the NEST Instrumentation
App [2]_ and VIOLA [3]_, will be integrated as a plugin into the app to extend visual modeling and
analysis functionalities. In the course of this work, the use of an in situ pipeline [4]_ developed for
neuronal network simulators will be considered to also enable the app to receive larger data sets from
NEST during a running simulation, enhancing the interactivity of the app also for large simulations on
HPC facilities.

We plan to develop and maintain NEST desktop sustainably. Therefore, we intend to integrate NEST
desktop into the HBP infrastructure. Additionally, the open-source code of NEST Desktop will be
published as a standalone distribution for teaching and training.


Acknowledgements
----------------
This project has received funding from the European Union’s Horizon 2020 Framework Programme for Research and
Innovation under Specific Grant Agreement No. 785907 (Human Brain Project SGA2)


References
----------
.. [1] NEST Desktop https://github.com/babsey/nest-desktop
.. [2] NEST InstrumentationApp https://github.com/compneuronmbu/NESTInstrumentationApp
.. [3] Senk J, et al. (2018) VIOLA—A Multi-Purpose and Web-Based Visualization Tool for Neuronal-Network Simulation Output. Front. Neuroinform. doi: 10.3389/fninf.2018.00075
.. [4] Oehrl et al. (2018) Streaming Live Neuronal Simulation Data into Visualization and Analysis. Conference Paper doi: 10.1007/978-3-030-02465-9_18
