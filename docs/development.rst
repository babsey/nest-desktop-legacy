.. toctree::
   :hidden:

   contents
   usage
   hbp


===========
Development
===========

NEST Desktop is a web-based GUI application for NEST Simulator.

Requirements
 * Python 3.4 or higher
 * NEST Server, NEST Simulator (Test app)
 * nodeJS, npm  (Build app)
 * sphinx, sphinx rth theme (for Readthedocs)
 * setuptools, wheel, twine (for PyPI)


Source code
-----------
The source code of NEST desktop is located in :code:`https://github.com/babsey/nest-desktop`

Clone NEST Desktop from the github repository:

.. code-block:: bash

   git clone https://github.com/babsey/nest-desktop


Development environment
-----------------------
The definition file :code:`nest-desktop/singularity/nest-desktop-dev.def`
contains an adequate environment to develop and build NEST Desktop.

Build a singularity image with requirements:

.. code-block:: bash

   singularity build nest-desktop-dev.sif nest-desktop/singularity/nest-desktop-dev.def

Go to shell of singularity container:

.. code-block:: bash

   singularity shell nest-desktop-dev.sif


Development
-----------

Install node modules for NEST Desktop source code:

.. code-block:: bash

   npm install

Check if any node module are outdated:

.. code-block:: bash

   npm out

Check if any node module are outdated:

.. code-block:: bash

   npm up

Serve Angular Live Development Server serving at http://localhost:4200

.. code-block:: bash

   npm start


Setup
-----

Install NEST Desktop from source code using :code:`pip` (where it finds :code:`setup.py`).
Best method is to install it in user home using :code:`pip install --user`.

.. code-block:: bash

   pip3 install --user --no-deps -e nest-desktop


Getting started
---------------
You can read `Getting started` in User Documentation to start NEST Desktop.
Starting NEST Desktop :code:`nest-desktop start` equivalent to the command:

.. code-block:: bash

   python3 -m nest_desktop.app


Python Package Index (PyPI)
---------------------------
Current work directory: :code:`nest-desktop`.

The Python Package Index **nest-desktop** includes an executive command :code:`nest-desktop` and a Python library :code:`nest_desktop`.

First update the version of nest-desktop in :code:`src/packages.json` and in :code:`nest_desktop/__init__.py`.

Then generate app package using npm. It builds the folder :code:`nest_desktop/app`:

.. code-block:: bash

   npm run build

Next, remove the folders:

.. code-block:: bash

   rm -rf build/ dist/ nest_desktop.egg-info/

Then generate distribution packages of `nest-desktop` for PyPI:

.. code-block:: bash

   python3 setup.py sdist bdist_wheel

Finally, upload `nest-desktop` to PyPI:

.. code-block:: bash

   python3 -m twine upload dist/*


Sphinx documentation
--------------------
Current work directory: :code:`nest-desktop/docs`.
To install sphinx and readthedocs theme via  :code:`pip`:

.. code-block:: bash

   pip3 install sphinx sphinx_rtd_theme

Build sphinx documentation in :code:`docs/_build` folder:

.. code-block:: bash

   rm -r _build/; make html


Readthedocs webpage
-------------------
It automatically builds docs for master when pulling commits to master.
Docs for latest and stable depends on their github tags.
