.. toctree::
   :hidden:

   contents
   development
   hbp


=====
Usage
=====

NEST Desktop is a web-based GUI application for NEST Simulator.


Installation
------------
To install NEST Desktop from python index package (pip):

.. code-block:: bash

   pip3 install nest-desktop [--user] [--upgrade]


Getting started
---------------
To start NEST Desktop on the Desktop:

.. code-block:: bash

   nest-desktop start

NEST Desktop is now serving at http://localhost:8000.
Hint: NEST Server should also be serving.


Advanced
--------

Options for nest-desktop (Defaults for host=127.0.0.1, port=8000)

.. code-block:: bash

   nest-desktop <command> -h <host> -p <port>

Showing usage for the command :code:`nest-desktop`:

.. code-block:: bash

   nest-desktop

It stops NEST Desktop serving at defined address.

.. code-block:: bash

   nest-desktop stop

It lists status of NEST Desktop serving at different addresses.

.. code-block:: bash

   nest-desktop status

It prints the current version of NEST Desktop.

.. code-block:: bash

   nest-desktop version
