#
# NEST Desktop Dev
#

oc project nest-desktop-dev
oc delete is,dc,svc,configMap nest-desktop
oc new-app babsey/nest-desktop:master
oc new-app nest-desktop-dev.yaml
oc set volume dc/nest-desktop --add --name=nest-desktop --configmap-name=nest-desktop --mount-path=/usr/local/lib/python3.6/dist-packages/nest_desktop/app/assets/config/nest-server
oc get svc/nest-desktop
