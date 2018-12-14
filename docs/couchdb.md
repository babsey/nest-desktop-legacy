# NEST CouchDB

**Remote database running by CouchDB**



### Install

Install CouchDB on Ubuntu 18.04 Bionic (See [ref](https://websiteforstudents.com/install-apache-couchdb-on-ubuntu-16-04-17-10-18-04/)).

###### Step 1 (with sudo)
Add Apache CouchDB Repository To Ubuntu
```
sudo apt install curl
curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc \ | sudo apt-key add -
echo "deb https://apache.bintray.com/couchdb-deb bionic main" \ | sudo tee -a /etc/apt/sources.list.d/apache_couchdb_bionic.list
```

###### Step 2 (with sudo)
Update And Install Apache CouchDB
```
sudo apt update
sudo apt-get install apache2 couchdb
```

###### Step 3 (with sudo)
Control CouchDB services
```
sudo systemctl stop couchdb.service
sudo systemctl start couchdb.service
sudo systemctl enable couchdb.service
sudo systemctl status couchdb.service
```

###### Step 4
Accessing Apache CouchDB

http://127.0.0.1:5984/_utils/

Type in the admin username and password.

###### Step 5  Enable CORS (as admin)

Go to `Config` page and enable `CORS`. If necessary, add your domain (with port) to the domain restriction. Please do not add `localhost` or `0.0.0.0`.

###### Step 6 Add user (as admin)
Create a document in `_users` database. Add this content.
```
{
    "_id": "org.couchdb.user:<username>",
    "name": "<username<",
    "type": "user",
    "roles": ["protocols"],
    "password": "<password<"
}
```
Please change `<username>` and `<password>`.

###### Step 7 Create databases (as admin)
Create databases for networks and for protocol.

###### Step 8 Set permissions (as admin)
Change permissions of the databases. Add role "protocols" to members.


### Docker

Docker hub has couchdb image ([ref](https://hub.docker.com/_/couchdb/)).


###### Step 1 (with sudo)
Pull docker container
```
sudo docker pull couchdb
```

###### Step 2 (with sudo)
Start docker container couchdb
CAUTION: It changes access name and group of current folder ` /tmp/nest-couchdb`

```
sudo docker run -d -p 4369:4369 -p 5984:5984 -p 9100:9100 -v /tmp/nest-couchdb:/opt/couchdb/data couchdb
```
