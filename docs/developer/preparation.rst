Preparation
===========


NEST Desktop is written in HTML5 but compiled by Angular, a web framework written in TypeScript.
For Angular you need to install nodeJS (+npm).

I have prepared Singularity recipe that build an environment with required packages for the develompment.
You can find the definition file in singularity/nest-desktop-dev.def for building Singularity container.

Requirements
 * Python 3.4 or higher
 * NEST Server, NEST Simulator (Test app)
 * nodeJS, npm  (Build app)
 * setuptools, wheel, twine (for PyPI)
 * sphinx, sphinx rth theme (for Readthedocs)


Source code
-----------
The source code of NEST desktop is hosted at :code:`https://github.com/babsey/nest-desktop`

Clone NEST Desktop from the github repository:

.. code-block:: bash

   git clone https://github.com/babsey/nest-desktop


Environment for development
---------------------------
The definition file :code:`nest-desktop/singularity/nest-desktop-dev.def`
contains an adequate environment to develop and build NEST Desktop.

Build a singularity image:

.. code-block:: bash

   singularity build nest-desktop-dev.sif nest-desktop/singularity/nest-desktop-dev.def

Go to shell of singularity container:

.. code-block:: bash

   singularity shell nest-desktop-dev.sif
