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
    this.getVersion().then((version: string) => this.version = version);
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
      .then((result: any) => result.total_rows)
      .catch((err: any) => err);
  }

  list(sortedBy: string = '', reverse: boolean = false): any {
    return this.db.allDocs({ include_docs: true })
      .then((res: any) => {
        const docs: any[] = res.rows.map((row: any) => row.doc);
        if (sortedBy) {
          docs.sort((a: any, b: any) =>
            a[sortedBy].localeCompare(b[sortedBy])
          );
        }
        if (reverse) {
          docs.reverse();
        }
        return docs;
      })
      .catch((err: any) => err);
  }

  // CRUD - Create, Read, Update, Delete

  create(data: any): any {
    // console.log('Create doc in db');
    const dataJSON = data.toJSON();
    dataJSON['version'] = this.app.version;
    dataJSON['createdAt'] = new Date();
    return this.db.post(dataJSON)
      .then((res: any) => {
        data._id = res.id;
        data.createdAt = dataJSON.createdAt;
      })
      .catch((err: any) => console.log(err));
  }

  read(id: string, rev: string = null): any {
    // console.log('Read doc in db');
    const options: any = { rev: rev };
    return this.db.get(id, options)
      .then((doc: any) => doc)
      .catch((err: any) => err);
  }

  update(data: any): any {
    // console.log('Update doc in db');
    return this.db.get(data.id)
      .then((doc: any) => {
        const dataJSON = data.toJSON();
        dataJSON['version'] = this.app.version;
        dataJSON['updatedAt'] = new Date();
        const keys: string[] = Object.keys(dataJSON);
        keys.filter((key: string) => !key.startsWith('_'))
          .forEach((key: string) => doc[key] = dataJSON[key]);
        return this.db.put(doc)
          .then((doc: any) => {
            // console.log(doc)
            data.updatedAt = dataJSON.updatedAt;
          })
          .catch((err: any) => console.log(err));
      })
      .catch((err: any) => {
        console.log(err);
        return this.create(data);
      });
  }

  delete(id: string): any {
    // console.log('Delete doc in db');
    return this.db.get(id)
      .then((doc: any) => this.db.remove(doc));
  }

  deleteBulk(ids: string[]): any {
    return this.list()
      .then((docs: any[]) => {
        docs.filter((doc: any) => ids.includes(doc._id))
          .forEach((doc: any) => doc._deleted = true)
        return this.db.bulkDocs(docs)
      })
  }

  revisions(id: string): any {
    console.log('Read doc revisions in db');
    return this.db.get(id, { revs: true })
      .then((doc: any) =>
        doc._revisions.ids.map((id: string, idx: number) =>
          (doc._revisions.start - idx) + "-" + id))
      .catch((err: any) => err);
  }

  // Version

  getVersion(): any {
    return this.db.get('_local/version')
      .then((doc: any) => doc['version']);
  }

  setVersion(): any {
    return this.db.put({
      _id: '_local/version',
      version: this.app.version,
    })
  }

  checkVersion(): void {
    this.getVersion()
      .then((version: string) => {
        const dbVersion: string[] = version.split('.');
        const appVersion: string[] = this.app.version.split('.')
        this._valid = appVersion[0] === dbVersion[0] && appVersion[1] === dbVersion[1];
      })
      .catch((err: any) => {
        this.setVersion().then(() => this.checkVersion());
      })
  }

}
