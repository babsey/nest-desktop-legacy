Commands guide
==============

nest-desktop
------------

Show usage for the command :code:`nest-desktop`

.. code-block:: bash

   nest-desktop

Options for :code:`nest-desktop`

.. code-block:: bash

   nest-desktop <command> -h <host> -p <port>

.. rubric:: Commands

+---------+------------------------+
| status  | Status of NEST Desktop |
+---------+------------------------+
| start   | Start NEST Desktop     |
+---------+------------------------+
| stop    | Stop NEST Desktop      |
+---------+------------------------+
| restart | Stop then start        |
+---------+------------------------+

.. rubric:: Arguments

+----+---------------------------+
| -h | Host (Default: 127.0.0.1) |
+----+---------------------------+
| -p | Port (Default: 8000)      |
+----+---------------------------+


nest-server
-----------

Show usage for for the command :code:`nest-server`

.. code-block:: bash

   nest-server

Options for :code:`nest-server`

.. code-block:: bash

   nest-server <command> [-d] [-h <HOST>] [-p <PORT>] [-u <UID>]

.. rubric:: Commands

+---------+-----------------------+
| log     | Monitor NEST Server   |
+---------+-----------------------+
| status  | Status of NEST Server |
+---------+-----------------------+
| start   | Start NEST Server     |
+---------+-----------------------+
| stop    | Stop NEST Server      |
+---------+-----------------------+
| restart | Stop then start       |
+---------+-----------------------+

.. rubric:: Arguments

+----+---------------------------+
| -d | Demonize the process      |
+----+---------------------------+
| -h | Host (Default: 127.0.0.1) |
+----+---------------------------+
| -p | Port (Default: 5000)      |
+----+---------------------------+
| -u | User ID                   |
+----+---------------------------+
