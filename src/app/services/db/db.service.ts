import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBUpsert from 'pouchdb-upsert/dist/pouchdb.upsert';

import { ConfigService } from '../../config/config.service';


@Injectable({
  providedIn: 'root'
})
export class DBService {

  constructor(
    private _configService: ConfigService,
  ) { }

  PouchDB(name) {
    let db = this._configService.config.app.db[name];
    let host = db.host || db.port ? db.host || 'localhost' : ''
    let port = db.host || db.port ? db.port || '5984' : ''
    let dbname = db.name || name;
    let url = host || port ? 'http://' + host + ':' + port + '/' : '';
    let options = db.auth.username ? {'auth': db.auth} : {};
    return new PouchDB(url + dbname, options);
  }
}
