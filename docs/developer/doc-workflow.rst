User documentation workflow
===========================

We use Sphinx to generate documentation and Read the Docs to publish it.
Sphinx uses reStructuredText.
To learn more about the syntax, check out this quick reference.

**Peparation**

Current work directory: :code:`nest-desktop/docs`.
To install sphinx and readthedocs theme via  :code:`pip`:

.. code-block:: bash

   python3 -m pip install sphinx sphinx_rtd_theme

**Rendering HTML offline**

Build sphinx documentation in :code:`docs/_build` folder offline:

.. code-block:: bash

   rm -r _build/; make html


**Pushing to Read the Docs**

It automatically builds docs for master when pulling commits to master.
Docs for latest and stable depends on their github tags.
