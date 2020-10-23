Deploy NEST Desktop in **Docker**
=================================


.. image:: ../_static/img/cloud-server-docker-NEST.png
   :width: 240px
   :alt: Docker NEST

|

Docker is a virtualization software packaging applications and its dependencies in a virtual container that can run on any Linux server.
It is available for a variety of the operating systems, e.g. Linux, Mac and Windows.
For more information follow the link `here <https://www.docker.com/resources/what-container>`__.


**Requirements**

* Docker engine


**Installation**

The image from docker hub contains all required software (NEST Desktop, NEST Server and NEST Simulator).
For more information, follow the link `here <https://hub.docker.com/r/babsey/nest-desktop>`__.

.. code-block:: bash

   docker pull babsey/nest-desktop


**Getting started**

Start docker container with arguments.

.. code-block:: bash

   docker run -i -p 5000:5000 -p 8000:8000 -t babsey/nest-desktop

NEST Desktop and NEST Server are now serving at ``http://localhost:8000`` and ``http://localhost:5000``, respectively.

.. note::

   In Docker container NEST Desktop is serving at port 8000 and NEST Server at port 5000.
   So, we need to bind ports (5000 and 8000) of host and container.


.. rubric:: Arguments

You can find help text of docker arguments by :code:`docker run --help`.

+----+-------------------------------------------+
| -p | Publish a container's port(s) to the host |
+----+-------------------------------------------+
| -i | Keep STDIN open even if not attached      |
+----+-------------------------------------------+
| -t | Allocate a pseudo-TTY                     |
+----+-------------------------------------------+

**Acknowledgments**

Thanks for the help:

  * Steffen Graber (Docker hub for NEST Simulator)
