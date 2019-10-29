======================================
How to deploy it on HBP infrastructure
======================================

NEST Desktop is a frontend application for performing simulations with NEST.

Requirements
 - oc Client Tools (https://www.okd.io/download.html#oc-platforms)


You can copy command line from webconsole of https://openshift-dev.hbp.eu.

Login to openshift-dev.hbp.eu:

.. code-block:: bash

   oc login https://openshift-dev.hbp.eu:443 --token=<token>

Get status of current project:

.. code-block:: bash

   oc status

Create an project/Switch to project:

.. code-block:: bash

   oc project nest-desktop

Deploy from docker hub and create service:

.. code-block:: bash

   oc new-app babsey/nest-desktop:latest

Create config map to find NEST Server:

.. code-block:: bash

   oc new-app hbp/config/nest-server.yaml

Mount the volume of NEST Server config to NEST Desktop:

.. code-block:: bash

   oc set volume dc/nest-desktop --add --name=nest-desktop-volume --configmap-name=nest-server-config --mount-path=/usr/local/lib/python3.6/dist-packages/nest_desktop/app/assets/config/nest-server

Further usage
^^^^^^^^^^^^^

Change the number of pods in a deployment:

.. code-block:: bash

   oc scale --replicas=2 dc nest-desktop

Monitor log of a pod (Get pod name: :code:`oc get pod`):

.. code-block:: bash

   oc exec <pod> -- nest-server log


Authentication and redirecting
------------------------------

oc delete is,dc,svc,route,configMap hbp-auth
oc new-app hbp-auth.yaml
oc new-app babsey/hbp-auth
oc set env --from=configmap/hbp-auth dc/hbp-auth
oc expose svc/hbp-auth --port=8080 --hostname=nest-desktop.apps-dev.hbp.eu


Maintenance
-----------
tba


Acknowledgements
----------------
Thanks for integrating NEST Desktop on HBP infrastructure:
* Alberto Madonna (Concepting)
* Collin MCMurtrie (Contacting)
* Fabrice Gaillard (Concepting of user authentication)
* Jonathan Villemaire-Krajden (Concepting)
* Martin Jochen Eppler (Contacting)
* Steffen Graber (Providing Docker image of NEST)
