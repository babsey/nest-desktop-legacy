FROM ubuntu:18.04
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y curl && \
  curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc \ | sudo apt-key add - && \
  echo "deb https://apache.bintray.com/couchdb-deb bionic main" \ | sudo tee -a /etc/apt/sources.list.d/apache_couchdb_bionic.list && \
  apt-get install -y apache2 couchdb && \
  systemctl start couchdb.service && \

EXPOSE 5984
