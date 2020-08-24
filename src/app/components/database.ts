import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { App } from './app';


export class DatabaseService {
  app: App;
  db: PouchDB;
  private _valid: boolean = false;
  private _ready: boolean = false;
  version: string;

  constructor(
    app: App,
    url: string,
    options: any = {},
  ) {
    this.app = app;
    this.db = new PouchDB(url, options);
    this.getVersion().then(version => this.version = version);
    this.checkVersion();
    this._ready = true;
  }

  isReady(): boolean {
    return this._ready;
    // return this.db !== undefined;
  }

  isValid(): boolean {
    return this._valid;
  }

  count(): any {
    return this.db.allDocs()
      .then(result => result.total_rows)
      .catch(err => err);
  }

  list(sortedBy: string = '', reverse: boolean = false): any {
    return this.db.allDocs({ include_docs: true })
      .then(result => {
        const docs: any[] = result.rows.map(row => row.doc);
        if (sortedBy) {
          docs.sort((a, b) => (a[sortedBy]).localeCompare(b[sortedBy]))
        }
        if (reverse) {
          docs.reverse()
        }
        return docs;
      })
      .catch(err => err);
  }

  // CRUD - Create, Read, Update, Delete

  create(data: any): any {
    console.log('Create doc in db');
    data['_id'] = null;
    data['createdAt'] = new Date();
    data['updatedAt'] = new Date();
    data['version'] = this.app.version;
    return this.db.post(data)
      .then(res => res)
      .catch(err => err);
  }

  read(id: string): any {
    console.log('Read doc in db');
    return this.db.get(id)
      .then(doc => doc)
      .catch(err => err);
  }

  update(data: any): any {
    console.log('Update doc in db');
    data['updatedAt'] = new Date();
    data['version'] = this.app.version;
    return this.db.get(data['_id'])
      .then(doc => {
        const keys: string[] = Object.keys(data);
        keys.filter(k => !k.startsWith('_'))
          .map(k => doc[k] = data[k])
        doc['updatedAt'] = new Date();
        return this.db.put(doc)
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  delete(id: string): any {
    console.log('Delete doc in db');
    return this.db.get(id)
      .then(doc => this.db.remove(doc));
  }

  deleteBulk(ids: string[]): any {
    return this.list()
      .then(docs => {
        docs
          .filter(doc => ids.includes(doc._id))
          .map(doc => doc._deleted = true)
        return this.db.bulkDocs(docs)
      })
  }

  // Version

  getVersion(): any {
    return this.db.get('_local/version')
      .then(doc => doc['version']);
  }

  setVersion(): any {
    return this.db.put({
      _id: '_local/version',
      version: this.app.version,
    })
  }

  checkVersion(): void {
    this.getVersion().then(version => {
      const dbVersion: string[] = version.split('.');
      const appVersion: string[] = this.app.version.split('.')
      this._valid = appVersion[0] === dbVersion[0] && appVersion[1] === dbVersion[1];
    })
      .catch(err => {
        this.setVersion().then(() => this.checkVersion());
      })
  }

}
