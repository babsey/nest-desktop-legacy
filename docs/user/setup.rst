Setup Guide
===========


This guide provides a detailed documentation on how to install NEST Desktop.

You can read the installation instructions by clicking one of these logos below:

.. raw:: html

    <div class="setup">
      <div class="column">
        <a href="#via-python-package">
          <div>
            <img src="../_static/img/logo/pypi-logo.svg">
            <h2>Python Package</h2>
          </div>
        </a>
      </div>

      <div class="column">
        <a href="#via-docker">
          <div>
            <img src="../_static/img/logo/Moby-logo.png">
            <h2>Docker</h2>
          </div>
        </a>
      </div>

      <div class="column">
        <a href="#via-singularity">
          <div>
            <img src="../_static/img/logo/singularity-logo.svg">
            <h2>Singularity</h2>
          </div>
        </a>
      </div>
    </div>

||||

Via Python Package
------------------

.. image:: ../_static/img/logo/pypi-logo.svg
   :width: 240px
   :target: #via-python-package

|

1. Both NEST Desktop and NEST Server require NEST Simulator supporting only in Linux systems.

.. note::

   For more information read the full installing docs of NEST Simulator
   `here <https://nest-simulator.readthedocs.io/en/latest/installation/index.html>`__.

2. NEST Desktop is distributed on PyPI and can be installed with pip:

.. code-block:: bash

   pip3 install nest-desktop [--user] [--upgrade]

It installs NEST Server (:code:`nest-server`) automatically.
For more information read the full installing docs :doc:`here <setup>`.

3. Before you start the frontend NEST Desktop, you have to run NEST Server as a backend.

Start NEST Server:

.. code-block:: bash

   nest-server start

NEST Server is now serving at ``http://localhost:5000``.

4. Start NEST Desktop (in other terminal session):

.. code-block:: bash

   nest-desktop start

NEST Desktop is now serving at ``http://localhost:8000``.

For more information read the full documentation of command API :doc:`here <command-API>`.


Via Docker
----------

.. image:: ../_static/img/logo/Moby-logo.png
   :width: 240px
   :target: #via-docker

|

Docker is a virtualization software packaging applications and its dependencies in a virtual container that can run on any Linux server.
It is available for a variety of operating systems, e.g. Linux, Mac and Windows. For more information `here <https://www.docker.com/resources/what-container>`__.


1. Pull the image from docker hub:

.. code-block:: bash

   docker pull babsey/nest-desktop

2. Start the docker container:

.. code-block:: bash

   docker run -i -p 5000:5000 -p 8000:8000 -t babsey/nest-desktop

.. note::

   In Docker container NEST Desktop is serving at port 8000 and NEST Server at port 5000.
   So, we need to bind ports (5000 and 8000) of host and container.

NEST Desktop and NEST Server are now serving at ``http://localhost:8000`` and ``http://localhost:5000``, respectively.


.. rubric:: Arguments

You can find help text of docker arguments by :code:`docker run --help`.

+----+-------------------------------------------+
| -p | Publish a container's port(s) to the host |
+----+-------------------------------------------+
| -i | Keep STDIN open even if not attached      |
+----+-------------------------------------------+
| -t | Allocate a pseudo-TTY                     |
+----+-------------------------------------------+


Via Singularity
---------------

.. image:: ../_static/img/logo/singularity-logo.svg
   :width: 240px
   :target: #via-singularity

|

Singularity is an application container for Linux systems.
For more information read the full documentation
`here <https://sylabs.io/guides/3.4/user-guide/>`__.

1. Clone working copy from respository:

.. code-block:: bash

   git clone https://github.com/babsey/nest-desktop

2. Go to Singularity folder of NEST Desktop:

.. code-block:: bash

   cd nest-desktop/singularity

3. Build singularity container (with sudo):

.. code-block:: bash

   singularity build nest-desktop.sif nest-desktop.def

4. Start singularity container

.. code-block:: bash

   singularity run nest-desktop.sif

NEST Desktop and NEST Server are now serving at ``http://localhost:8000`` and ``http://localhost:5000``, respectively.
