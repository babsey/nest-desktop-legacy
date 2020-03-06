The concept of the interface
============================

NEST Desktop follows a clear concept of the page layout which is overlaid by three bars. For the consistence of the page layout each bar has an unambiguous function. Left and right bars are closable and after changing the open status of a side bar the the visualization content in the center bar changes its width format.


Left bar
--------

It is the navigation showing a list of the items which is loaded from individual modules.  A stacked set of buttons (left) renders the content of the navigation and it shows list of the simulations (sketch icon), of the models (square-root icon) and of the settings (wrench icon). When the user click on an item, it loads the content of the center and right bars. The header toolbar stretches over center and right bars and it is color-coded by a loaded page: Simulation page is summergreen, model is crail and settings page is sycamore. These color palette are generated using deep learning method on the colormind website\footnote{http://colormind.io/template/material-dashboard/}.


Center bar
----------

It provides as router outlets showing the page content of the modules. The simulation module displays the information of the network and the graphical output of the simulation. A model module shows the detailed information of models which can be used in NEST Simulator. Finally, a settings module shows an overview of all settings for application modules.


Right bar
---------

It is the controller which the user is able to change values. The content of the controller is tabbed by several components, e.g. in simulation playground it displays list of network elements for the network component or list of configurations for a visualization component.
