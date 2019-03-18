import { Injectable } from '@angular/core';

import { DBConfigService } from '../../config/db-config/db-config.service';
import { PouchDBService } from './pouchdb/pouchdb.service';

declare function require(url: string);

@Injectable({
  providedIn: 'root'
})
export class DBService {
  public db: any;

  constructor(
    private _dbConfigService: DBConfigService,
    private _pouchDBService: PouchDBService,
  ) {
    this.db = _pouchDBService;
  }

  init(name) {
    let config = this._dbConfigService.config[name];
    return this.db.init(name, config)
  }

  checkVersion(obj) {
    this.getVersion(obj.db).catch(() => this.setVersion(obj.db)
      .then(version => obj.version = version)
    ).then(version => obj.version = version)
  }

  setVersion(db) {
    var version = this._dbConfigService.config['version'];
    return db.put({
      _id: '_local/version',
      version: version,
    }).then(() => this.getVersion(db));
  }

  getVersion(db) {
    return db.get('_local/version').then(doc => doc.version);
  }

}
