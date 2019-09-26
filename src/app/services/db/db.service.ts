import { Injectable } from '@angular/core';

import { PouchDBService } from './pouchdb/pouchdb.service';



@Injectable({
  providedIn: 'root'
})
export class DBService {
  public db: any;

  constructor(
    private _pouchDBService: PouchDBService,
  ) {
    this.db = _pouchDBService;
  }

  init(name, config) {
    return this.db.init(name, config);
  }

}
