Installing NEST Desktop
=======================


Via Python Package
------------------

Install the package:

.. code-block:: bash

   pip3 install nest-desktop [--user] [--upgrade]


Via Docker hub
--------------

Pull the image from docker hub:

.. code-block:: bash

   docker pull babsey/nest-desktop


Via Singularity
---------------

Singularity is an application container for Linux systems.
For more information read the full documentation
`here <https://sylabs.io/guides/3.4/user-guide/>`__.

1. Clone working copy from respository:

.. code-block:: bash

   git clone https://github.com/babsey/nest-desktop


2. Go to NEST Desktop folder:

.. code-block:: bash

   cd nest-desktop


3. Build singularity container:

.. code-block:: bash

   singularity build singularity/nest-desktop.sif singularity/nest-desktop.sif
