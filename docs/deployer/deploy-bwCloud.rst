How to deploy it on bwCloud resources
=====================================

The documentation shows how to deploy NEST Desktop from docker hub on bwCloud resources.
"bwCloud" is a cloud assigned for university in Baden-Württemberg and provides a OpenStack infrastructure
For more information, follow the link:  https://www.bw-cloud.org/.

OpenStack is an open source platform that uses pooled virtual resources to build and manage clouds.
For more information, please follow the link: https://www.redhat.com/en/topics/openstack.


Requirements
------------

* Packer (https://www.packer.io/downloads.html)
* Ansible (https://releases.ansible.com/ansible/)


Deploy NEST Desktop
-------------------

1. Download Openstack RC File from the dashboard, follow the steps:
"Compute" -> "Access & Security" -> "API Access" -> "Download OpenStack RC File"

2. Source the RC file:

.. code-block:: bash

   source Project_<userID>-openrc_v3.sh

3. Modify the configurations (i.e. source image and networks for the builder) in ``infrastructure/bwCloud/nest-desktop.json``.

4. Build an image on bwCloud

.. code-block:: bash

   cd infrastructure/bwCloud
   /path/to/packer build nest-desktop.json


Acknowledgements
----------------

Thanks for the help to integrate NEST Desktop on bwCloud:
* Bernd Wiebelt
* Jonathan Bauer
* Michael Janczyk
* Manuel Messner
* Christopher Ill
