import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { Project } from '../../../components/project';


@Injectable({
  providedIn: 'root'
})
export class PouchDBService {

  constructor(
  ) { }

  init(name: string, config: any): any {
    let host = config.host || config.port ? config.host || 'localhost' : ''
    let port = config.host || config.port ? config.port || '5984' : ''
    let dbname = config.name || name;
    let url = host || port ? 'http://' + host + ':' + port + '/' : '';
    let options = config.auth.username ? { 'auth': config.auth } : {};
    return new PouchDB(url + dbname, options);
  }

  count(db: any): any {
    return db.allDocs()
      .then(result => result.total_rows)
      .catch(err => err);
  }

  list(db: any): any {
    return db.allDocs({ include_docs: true })
      .then(result => result.rows.map(row => row.doc))
      .catch(err => err);
  }

  // CRUD - Create, Read, Update, Delete

  create(db: any, data: any): any {
    data['createdAt'] = new Date();
    data['updatedAt'] = new Date();
    return db.post(data)
      .then(res => res)
      .catch(err => err);
  }

  read(db: any, id: string): any {
    return db.get(id)
      .then(doc => doc)
      .catch(err => err);
  }

  update(db: any, data: Project): any {
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

  delete(db: any, id: string): any {
    return db.get(id)
      .then(doc => db.remove(doc));
  }

  deleteBulk(db: any, ids: string[]): any {
    return this.list(db).then(docs => {
      docs.filter(doc => ids.includes(doc._id)).map(doc => doc._deleted = true)
      return db.bulkDocs(docs)
    })
  }

  // Version

  setVersion(db: any, version: string): any {
    return db.put({
      _id: '_local/version',
      version: version,
    }).then(() => this.getVersion(db));
  }

  getVersion(db: any): any {
    return db.get('_local/version').then(doc => doc['version']);
  }

}
