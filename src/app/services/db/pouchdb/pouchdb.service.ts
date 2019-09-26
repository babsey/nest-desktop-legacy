import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';



@Injectable({
  providedIn: 'root'
})
export class PouchDBService {

  constructor(
  ) { }

  init(name, config) {
    let host = config.host || config.port ? config.host || 'localhost' : ''
    let port = config.host || config.port ? config.port || '5984' : ''
    let dbname = config.name || name;
    let url = host || port ? 'http://' + host + ':' + port + '/' : '';
    let options = config.auth.username ? { 'auth': config.auth } : {};
    return new PouchDB(url + dbname, options);
  }

  count(db) {
    return db.allDocs()
      .then(result => result.total_rows)
      .catch(err => err);
  }

  list(db) {
    return db.allDocs({ include_docs: true })
      .then(result => result.rows.map(row => row.doc))
      .catch(err => err);
  }

  // CRUD - Create, Read, Update, Delete

  create(db, data) {
    data['createdAt'] = new Date();
    data['updatedAt'] = new Date();
    return db.post(data)
      .then(res => res)
      .catch(err => err);
  }

  read(db, id) {
    return db.get(id)
      .then(doc => doc)
      .catch(err => err);
  }

  update(db, data) {
    return db.get(data['_id'])
      .then(doc => {
        let keys = Object.keys(data);
        keys.filter(k => !k.startsWith('_'))
          .map(k => doc[k] = data[k])
        doc['updatedAt'] = new Date();
        return db.put(doc)
          .catch(err => err);
      })
      .catch(err => err);
  }

  delete(db, id) {
    return db.get(id)
      .then(doc => db.remove(doc));
  }

  deleteBulk(db, ids) {
    return this.list(db).then(docs => {
      docs.filter(doc => ids.includes(doc._id)).map(doc => doc._deleted = true)
      return db.bulkDocs(docs)
    })
  }

  // Version

  setVersion(db, version) {
    return db.put({
      _id: '_local/version',
      version: version,
    }).then(() => this.getVersion(db));
  }

  getVersion(db) {
    return db.get('_local/version').then(doc => doc['version']);
  }

}
