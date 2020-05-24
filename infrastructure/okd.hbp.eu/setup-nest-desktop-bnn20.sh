#
# NEST Desktop
#

oc project bnn20
oc delete is,dc,svc,configMap,route nest-desktop nest-desktop-apache2oidc

oc new-app babsey/nest-desktop:master+babsey/nest-desktop-apache2oidc:latest
oc new-app nest-desktop-bnn20-apache2oidc.yaml
oc set env --from='configmap/nest-desktop-apache2oidc' dc/nest-desktop
oc create route edge --hostname='bnn20.apps.hbp.eu' --port='8080-tcp' --service='nest-desktop'

#oc scale --replicas=10 dc nest-desktop
