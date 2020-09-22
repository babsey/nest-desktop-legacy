Troubleshootings
================

Having trouble getting something working? Got a question that the rest of our docs can’t answer?
Maybe we can help with some answers to commonly asked questions and troublesome spots.


Error messages
--------------

.. topic:: Server not found

  This error has two possible sources:
   - NEST Desktop has wrong URL of the server. See FAQ for NEST Server below.
   - The server is down. Enter the url of the NEST Server, e.g. ``localhost:5000`` in web browser.
     For advanced users: Check in terminal whether NEST Server is running (``curl localhost:5000``).


.. topic:: Internal server error

  NEST Simulator produces value error, e.g. ``The value cannot be negative.``.

|
|
|

Frequently asked questions (FAQ)
--------------------------------


.. topic:: NEST Server

  How can I check NEST Server?
    In the loading page you can click on menu icon of the server section to open menu.
    One of the menu item is to check NEST Server.

  How can I change the URL of the NEST Server?
    In the settings of the NEST Server you find the form fields for the URL of the NEST Server.


.. topic:: Model

  What is terminology of this model?
    This model includes neuron, synapse and device models.

  How can I read the documentation of a model?
    In the model section you find a list of models on the left side navigation.
    Click on one model, it request NEST Server for the documentation text of the selected model.

  How can I get default values of a model?
    In the model section you find a list of models on the left side navigation.
    Click on one model, it request NEST Server for the default values of the selected model.
    The default values appear as a list on the right side bar.


.. topic:: Project

  How can I make a new project?
    In the navigation sidebar you find a list item ``New Project`` to create a new project.

  How can I duplicate a project?
    In the project toolbox you find a button to clone project.

  What does the asterisk icon after project name mean?
    It means that change in network was registered and the project is not saved in the database.

  How can I rename project?
    In the navigation sidebar you find the input field of the project name.
    There you are able to change the name of the project.

  How can I save project?
    In the left navigation of the page you find a floppy disc icon to save project.

  How can I delete a project?
    In the context menu of the projects (by clicking mouse right button on a project) you find this method to delete corresponding project.

  How can I download a project?
    In the context menu of the projects (by clicking on mouse right button on a project) you find this method to delete corresponding project.

  How can I delete several projects?
    In the menu of the project in the top navigation you find an method to select projects.
    Then select several projects and then at the end you find the action to delete them.

  How can I download several projects?
    In the menu of the project in the top navigation you find an method to select projects.
    Then select several projects and then at the end you find the action to download them.

  How can I download all projects?
    In the menu of the project in the top navigation you find an method to download all projects.

  How can I upload projects?
    In the menu of the project in the top navigation you find an method to upload projects from a file.


.. topic:: Network

  Where can I find network controller?
    You find network controller by clicking on top icon ('project diagram') right to controller.
    Node and link controller are parts of the network controller.

  Where can I find network settings?
    You find a 'bezier-curve' button towards network settings in the network editor.
    Alternatively, you find a network settings in the settings section.

  How can I empty network?
    In network sketch you find bottom left a trash button that empties the network.

  How can I create nodes?
    In network sketch you can click the right mouse button, then it appears a selector panel to select an element type of the node.

  How can I connect nodes?
    In network sketch you can select a node as a source node, move the mouse towards target node and then click the target node.

  How can I keep selected node to connect other nodes?
    Hold pressing ``CTRL`` key before connecting nodes.

  How can I (un)select node / link?
    When a node or link is selected you can press 'ESC' to unselect it or in network sketch you can click on node or link to select it.
    Click on background area of the network sketch or on the selected in the network controller unselect node or link.
    An other method to (un)select is to click on node shape or link toolbar in the network controller on the right side.

  How can I colorize nodes?
    You find the method to color in the context menu of the node
    by clicking the right mouse button on node shape in network sketch or node toolbar in the controller.

  How can I change the color cycle of nodes?
    In the network settings you find the way to change the color cycle.

  How can I delete node/link?
    You find this method in the context menu of the node or link
    by clicking the right mouse button on node / link shape in network sketch
    or on node / link toolbar in the network controller.

  How can I modify parameters?
    You find a list of parameters in network controller.
    If they are not visible, switch to network selection to check the visibility of the parameters.

  How can I reset all parameter value?
    In the context menu of node or link you find the method to reset all parameters of the corresponding node or link.

  How can I reset a parameter value?
    In the context menu of a parameter (by clicking right button on a parameter) you find the method to reset parameter.
    It also shows the default value of the parameter.

  How can I set inhibitory connection?
    You can set weights to negative value in the link controller.

  How can I get distribution for parameters?
    In the current version you are able to activate the distribution of the parameters in kernel, weights and delay of the spatial projections.

  How can I set node in spatial mode?
    In the context menu of the node, you can (un)set the spatial mode of the node.

  How can I add mask for projection?
    When source and target nodes are set to spatial, then you find mask item of the spatial projections in the link controller.
    Click on the mask item to modify it.

  How can I generate grid/free positions?
    When the node is set to spatial, position item will replace the population item. Click on position item to get a position panel.
    Modify a value will generate positions, at the end of the panel you find a button to generate positions.

  How can I add positions?
    In the positions panel you find a text area of the positions, you can add custom positions.

  How can I modify the slider?
    In the context menu of the parameter, you find a method to alter slider settings.

  How can I generate array?
    In the context menu of the array parameters (e.g. spike times of spike generator) you find the method to generate array.
    It opens a dialog for array generation.


.. topic:: Simulation

  How can I start simulation?
    Click on the :guilabel:`Simulate` button in top right of the page to start the simulation.

  How can I stop simulation?
    Unfortunately, the option to stop simulation is not implemented.

  Why is the :guilabel:`Simulate` button shaking/bouncing?
    It means that changes of the network was registered and the activity graph might not match with the network.
    It reminds you to start the simulation.

  How can I activate simulation after change?
    In the context menu of the :guilabel:`Simulate` button (by clicking mouse right button) you find an option to activate simulation after change.

  How can I activate simulation after load?
    When you click on a project
    In the context menu of the :guilabel:`Simulate` button (by clicking mouse right button) you find an option to activate simulation after load.

  How can I activate simulation after checkout?
    When you go to other network version of the history, it automatically start the simulation.
    In the context menu of the :guilabel:`Simulate` button (by clicking mouse right button) you find an option to activate simulation after load.

  Where can I find simulation controller?
    The simulation controller appears by clicking on the cog icon right to controller side bar.
    The kernel controller is a part of the simulation controller.

  Where can I set simulation time?
    In the simulation controller you find a simulation section.
    There you are able to change simulation time.

  Where can I modify kernel of NEST Simulator?
    You find a kernel section for the NEST Simulator in the simulation controller.

  Where can I change time resolution of the kernel?
    You find time resolution for the NEST Simulator in the simulation controller.

  .. warning::
     Please verify that the resolution of the recorders are larger than the resolution in the kernel.

  Where can I change seed?
    In the simulation controller you find a simulation section.
    There you are able to change seed value.

  How can I activate seed randomization?
    You find an option to activate seed randomization in the simulation controller.

  How can I find Python script code of the simulation?
    In tabs of the right side navigation you find a symbol `<\>` for code editor.

  How can I find data for the project in JSON format?
    When the development mode is on, in one tab of the simulation details you find JSON data of the current project.


.. topic:: Activity

  How can I download activity data?
    In the context menu of the simulation (on play icon) you find a menu item to download data and records of the current simulation.


.. topic:: Chart

  Where can I find chart controller?
    You find animation controller by clicking on the 'chart' icon in the stacked menu left to controller.

  How can I drag/zoom the chart?
    Select the mode in the mode bar (top). Then click on the chart for dragging or zooming.

  How can I reset to default view?
    Click on the house icon in the mode bar (top) to reset to default view.

  How can I download plot of the chart?
    Click on the photo icon (top) to download plot of the chart. It saves into SVG format.

  How can I migrate chart to Plotly Chart Studio?
    Click on the text "Edit chart" (bottom) to see the chart in Plotly Chart Studio.

  How can I modify bin size of the PSTH?
    In the chart controller you find tick slider to modify bin size.

  How can I change the mode of the PSTH?
    In the chart controller you find options to change the mode of the PSTH.

  How can I change the label of axes or the title?
    Click on the label of the axes or the title to change it.

  How can I hide/show dots/lines?
    Click on the legend to alter the visibility of the dots/lines.


.. topic:: Animation

  Where can I find animation controller?
    You find animation controller by clicking on the 'braille' icon.

  How can I stop animation?
    Go to animation controller. You find a pause icon to stop animation.

  How can I increase/decrease animation speed?
    In the animation controller you find forward or backward to alter animation speed.

  How can I change colorscale of dots?
    In the animation controller you find a colormap of the current colorscale.
    Next below of it you find an options to select colorscale.

  How can I change size of dots?
    In the animation controller you find slider of the dot size.

  How can I add trailing for dots?
    It only works in the animation of the spikes.

  How can I rotate camera?
    Hold the mouse button on the animation area and then move it to rotate the camera.

  How can I activate camera motion?
    In the animation controller you can increase the speed of the camera motion.


.. topic:: Settings

  Where can I find settings?
    You find settings by clicking on the cog icon right to navigation side bar.
    The settings are stored as 'local storage' of the browser.

  How can I change settings?
    You can change settings in the settings section
    by clicking on cog icon next to navigation side bar.

  How can I reset settings?
    In the loading page you can click on menu icon of the settings section to open menu.
    One of the menu item is to reset settings.

  How can I reset databases?
    In the loading page you can click on menu icon of the database section to open menu.
    One of the menu item is to reset databases.

  Where can I find the database?
    The databases are stored as 'Indexed DB' of the browser.

  How can I activate automatic start?
    In the settings of the application you find the option to activate automatic start.

  How can I switch to development view?
    In the settings of the application you find an option to switch to development view.
