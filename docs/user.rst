Introduction
============
NEST Desktop is a web-based GUI application for NEST Simulator.

Requirements for nest-desktop
 * nest-server


Installation
============
To install NEST Desktop from python index package (pip):

.. code-block:: none

   pip3 install nest-desktop


Getting started
===============
To start NEST Desktop on the Desktop:

.. code-block:: none

   nest-desktop start


Advanced
========

Options for nest-desktop (Defaults for host=127.0.0.1, port=8000)

.. code-block:: none

   nest-desktop <command> -h <host> -p <port>

Showing usage for nest-desktop

.. code-block:: none

   nest-desktop

It stops NEST Desktop serving at defined address.

.. code-block:: none

   nest-desktop stop

It lists status of NEST Desktop serving at different addresses.

.. code-block:: none

   nest-desktop status

It prints the current version of NEST Desktop.

.. code-block:: none

   nest-desktop version
