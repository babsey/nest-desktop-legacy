Deploy on host
==============


Installation
------------

Both NEST Desktop and NEST Server require NEST Simulator supporting only in Linux systems.

.. note::

   For more information read the full installing docs of NEST Simulator
   `here <https://nest-simulator.readthedocs.io/en/latest/installation/index.html>`__.

NEST Desktop is distributed on PyPI and can be installed with pip:

.. code-block:: bash

   pip3 install nest-desktop

It installs NEST Server (:code:`nest-server`) automatically.
For more information read the full installing docs :doc:`here <installing>`.


Getting started
---------------

Before you start the frontend NEST Desktop, you have to run NEST Server as a backend.

1. Start NEST Server:

.. code-block:: bash

   nest-server start

NEST Server is now serving at http://localhost:5000.

2. Start NEST Desktop (in other terminal session):

.. code-block:: bash

   nest-desktop start

NEST Desktop is now serving at http://localhost:8000.

For more information read the full commands docs :doc:`here <commands>`.
