===================
Human Brain Project
===================

Usage
-----

Go to the link: http://nest-desktop.apps-dev.hbp.eu.



Integration
-----------
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

Deploy image from docker hub:

.. code-block:: bash

   oc new-app babsey/nest-desktop

Create config map from template to find NEST Server:

.. code-block:: bash

   oc new-app hbp/nest-desktop.yaml

Mount the volume of NEST Server config to NEST Desktop:

.. code-block:: bash

   oc set volume dc/nest-desktop --add --name=nest-desktop --configmap-name=nest-desktop --mount-path=/usr/local/lib/python3.6/dist-packages/nest_desktop/app/assets/config/nest-server

Now, NEST Desktop is running on HBP infrastructure.

Advanced
--------

Change the number of pods in a deployment:

.. code-block:: bash

   oc scale --replicas=2 dc nest-desktop

Monitor log of a pod (Get pod name: :code:`oc get pod`):

.. code-block:: bash

   oc exec <pod> -- nest-server log

Delete all routes (Cover service from internet):

.. code-block:: bash

   oc delete route --all


Authentication
--------------

It ask openID Connect (https://services.humanbrainproject.eu/oidc) for user authentication.
Source code: https://github.com/babsey/hbp-auth

Deploy image from docker hub:

.. code-block:: bash

   oc new-app babsey/hbp-auth

Create config map from template to get env for OIDC (non-public access):

.. code-block:: bash

   oc new-app hbp-auth.yaml

Mount the volume of NEST Server config to NEST Desktop:

.. code-block:: bash

   oc set env --from=configmap/hbp-auth dc/hbp-auth

Expose the hbp-auth to internet:

.. code-block:: bash

   oc expose svc/hbp-auth --port=8080 --hostname='nest-desktop.apps-dev.hbp.eu'



Maintenance
-----------
tba
