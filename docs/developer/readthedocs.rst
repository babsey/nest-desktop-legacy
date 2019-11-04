Readthedocs
===========

Peparation
----------

Current work directory: :code:`nest-desktop/docs`.
To install sphinx and readthedocs theme via  :code:`pip`:

.. code-block:: bash

   pip3 install sphinx sphinx_rtd_theme

Local building
--------------

Build sphinx documentation in :code:`docs/_build` folder:

.. code-block:: bash

   rm -r _build/; make html


Build on Readthedocs
--------------------

It automatically builds docs for master when pulling commits to master.
Docs for latest and stable depends on their github tags.
