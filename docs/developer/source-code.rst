Source code
===========


**Usage of yarn**

Install node modules for NEST Desktop source code:

.. code-block:: bash

  yarn install

Check if any node package are outdated:

.. code-block:: bash

  yarn outdated

Upgrade outdated packages:

.. code-block:: bash

  yarn upgrade

Serve Angular Live Development Server serving at http://localhost:4200

.. code-block:: bash

  yarn start


**Usage of npm**

Install node modules for NEST Desktop source code:

.. code-block:: bash

  npm install

Check if any node package is outdated:

.. code-block:: bash

  npm out

Update node package:

.. code-block:: bash

  npm up

Serve Angular Live Development Server serving at http://localhost:4200

.. code-block:: bash

  npm start


**Setup**

Install NEST Desktop from source code using :code:`pip` (where it finds :code:`setup.py`).
Best method is to install it in user home using :code:`pip install --user`.

.. code-block:: bash

  python3 -m pip install --user --no-deps -e .


**Getting started**

You can read `Getting started` in User Documentation to start NEST Desktop.
Starting NEST Desktop :code:`nest-desktop start` equivalent to the command:

.. code-block:: bash

  python3 -m nest_desktop.app
