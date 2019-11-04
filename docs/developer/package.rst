Python Package Index (PyPI)
===========================

To build and deploy NEST Desktop on PyPi is a cruical step for the development.
With it, Docker hub can update NEST Desktop and NEST Server in babsey/nest-desktop image.


Steps to build and deploy
-------------------------

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
