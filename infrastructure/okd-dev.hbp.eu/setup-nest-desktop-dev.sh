#
# NEST Desktop
#

oc project nest-desktop
oc delete is,dc,svc,configMap,route nest-desktop nest-desktop-apache2oidc

oc new-app babsey/nest-desktop:master+babsey/nest-desktop-apache2oidc:latest
oc new-app nest-desktop-dev.yaml
oc new-app nest-desktop-apache2oidc.yaml
oc set env --from='configmap/nest-desktop-apache2oidc' dc/nest-desktop
oc create route edge --hostname='nest-desktop.apps-dev.hbp.eu' --port='8080-tcp' --service='nest-desktop'

#oc scale --replicas=10 dc nest-desktop
