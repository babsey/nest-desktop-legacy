import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DBVersionService {
  public _value: string = '';

  constructor() { }

  init(obj) {
    this.get(obj.db).catch(() => this.set(obj.db)
      .then(version => obj.version = version)
    ).then(version => obj.version = version)
  }

  set(db) {
    return db.put({
      _id: '_local/version',
      version: environment.VERSION,
    }).then(() => this.get(db));
  }

  get(db) {
    return db.get('_local/version').then(doc => doc.version);
  }

  isValid(version) {
    var appVersion = environment.VERSION.split('.');
    var dbVersion = version.split('.');
    return appVersion[0] == dbVersion[0] && appVersion[1] == dbVersion[1];
  }

}
