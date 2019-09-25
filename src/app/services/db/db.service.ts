import { Injectable } from '@angular/core';

import { DBConfigService } from '../../config/db-config/db-config.service';
import { PouchDBService } from './pouchdb/pouchdb.service';



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
    return this.db.init(name, config);
  }

}
