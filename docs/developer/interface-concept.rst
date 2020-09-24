Concept of the interface
========================


.. topic:: General layout concept of the interface.

  NEST Desktop contains three columns with clear function.
  Left column shows a navigation to route pages in the primary outlet.
  Center column renders main content of the page.
  Right column displays controller content for the modification.

.. topic:: Pages

  NEST Desktop has three route pages (Project, Model, Settings).
  Colored buttons located in the left side of the page shows home icon for the start page.
  Other icons buttons renders the content of the navigation outlet.
  The brain icon refers to project page, equation icon to model page and wrench icon to setting page.

.. topic:: Page colors

  Project button is summergreen, model button is crail and setting button is sycamore.
  These color palette were selected at the `colormind website <http://colormind.io/template/material-dashboard/>`__.

.. topic:: Navigation outlet (left)

  The navigation content displays a black toolbar in the header showing with the name of the page and an icon for the menu.
  Subjacent to the header it renders a list of items triggers loading pages in the content outlet.

.. topic:: Primary outlet (center)

  The content outlet renders the page content via the URL.
  The project page displays network editor and activity explorer.
  The model page shows the detailed information of models which can be used in NEST Simulator.
  The setting page shows an overview of all settings for various components of the app.
  The toolbar in the header stretches over center and right bars and it is color-coded by a loaded page.

.. topic:: Controller bar (right)

  The controller enables users to change values.
  The network controller displays list of nodes and connections.

.. topic:: Right mouse button

  .. image:: ../_static/img/mouse-right-click.png
    :width: 48px
    :align: left

  When a component provides specific context menu triggering by right mouse button,
  an icon of mouse-right-button-click appears in left bottom of the page.
