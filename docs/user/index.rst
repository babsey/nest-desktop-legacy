|user| How to use NEST Desktop
==============================

.. topic:: Quick start

  The video shows few steps to construct network and explore activity.
  For more information, please read :doc:`detailed guides of usage <usage>`.

  .. raw:: html

     <embed>
       <video width="696" height="522" controls>
         <source src="../_static/video/quick-start.mp4" type="video/mp4">
         Your browser does not support the video tag.
       </video>
     </embed>

||||

.. topic:: Getting started in Terminal

  .. code-block:: bash

     docker run -i -p 5000:5000 -p 8000:8000 -t babsey/nest-desktop

  If a image is not existed, it will be pulled from docker hub.
  Then, NEST Desktop is serving at ``http://localhost:8000``.

  For more information, please read :doc:`detailed guides of setup <setup>`.



||||

**List of detailed guides**

* :doc:`How to use NEST Desktop <usage>`
* :doc:`How to setup NEST Desktop <setup>`
* :doc:`Command API <command-API>`
* :doc:`Troubleshooting <troubleshooting>`

**Guides for the infrastructure**

* :doc:`Use NEST Desktop on EBRAINS <use-ebrains>`

.. |user| image:: ../_static/img/font-awesome/user.svg
   :width: 85px
   :alt:
   :align: top
   :target: #
