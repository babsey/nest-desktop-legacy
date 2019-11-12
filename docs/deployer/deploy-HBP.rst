Deploy NEST Desktop on **HBP**
==============================

.. image:: ../_static/img/logo/HBP_logo.png
   :width: 320px
   :alt: Human Brain Project

|

The documentation shows how to deploy NEST Desktop from docker hub on *HBP* resources.

HBP provides two OpenShift infrastructures
  * https://openshift-dev.hbp.eu for the development.
  * https://openshift.hbp.eu for the production.

.. Note::
   I strongly recommend to use the development page before you push NEST Desktop on ``https://openshift.hbp.eu``.


Requirements
------------

* OC Client Tools (https://www.okd.io/download.html#oc-platforms)


Step to deploy (in development)
-------------------------------

You can copy command line from the web console of ``https://openshift-dev.hbp.eu``.

Login to openshift-dev.hbp.eu:

.. code-block:: bash

   oc login https://openshift-dev.hbp.eu:443 --token=<token>

Get status of current project:

.. code-block:: bash

   oc status

You find a configuration and a bash files for setting up NEST Desktop on *HBP*.
Execute the bash script and in the end it shows the IP needed for *HBP* authentication (see below):

.. code-block:: bash

   cd infrastructure/openshift-dev.hbp.eu
   bash setup-nest-desktop.sh


Further usage
^^^^^^^^^^^^^

Scaling up the replicas (pods or nodes):

.. code-block:: bash

   oc scale --replicas=2 dc nest-desktop


Monitor log of a pod (Get pod name: :code:`oc get pod`):

.. code-block:: bash

   oc exec <pod> -- nest-server log


HBP Authentication and redirecting
----------------------------------

To access to NEST Desktop on HBP infrastructure, an authentication of *HBP* membership is requested.
You find the codes on https://github.com/babsey/hbp-auth.


Here are the steps how to setup authentication and redirecting to NEST Desktop properly.
Before you have to modify the environment for *HBP* authentication,
i.e. OIDC_CLIENT_ID, OIDC_CLIENT_SECRET and CLUSTER_IP of NEST Desktop
(which is printed after setting up NEST Desktop).

.. code-block:: bash

   cd projects/nest-desktop-dev
   bash setup-nest-desktop-hbp-auth.sh



Deploy Production
-----------------

If NEST Desktop is ready for the production, meaning to deploy on apps.hbp.eu.
Perform all steps same as in Development (apps-dev.hbp.eu).


Maintenance
-----------

tba


Acknowledgements
----------------

Thanks for the help to integrate NEST Desktop on HBP resources:
  * Alberto Madonna (Concepting)
  * Collin McMurtrie (Contacting)
  * Fabrice Gaillard (Concepting of user authentication)
  * Jonathan Villemaire-Krajden (Concepting)
  * Martin Jochen Eppler (Contacting)
