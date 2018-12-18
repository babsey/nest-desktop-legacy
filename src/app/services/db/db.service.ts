import { Injectable } from '@angular/core';

import { PouchDBService } from './pouchdb/pouchdb.service';

import { ConfigService } from '../../config/config.service';
import { DataService } from '../data/data.service';
import { NavigationService } from '../../navigation/navigation.service';


@Injectable({
  providedIn: 'root'
})
export class DBService {
  private db: any;

  constructor(
    private _configService: ConfigService,
    private _dataService: DataService,
    private _navigationService: NavigationService,
    private _pouchDBService: PouchDBService,
  ) {
    this.db = _pouchDBService;
  }

  init(name) {
    let config = this._configService.config.app.db[name];
    return this.db.init(name, config)
  }

  countDocs(db) {
    return this.db.count(db)
  }

  listDocs(db) {
    return this.db.list(db)
  }

  hashDocs(db) {
    return this.db.list(db)
      .then(docs => docs.map(row => row.hash))
  }

  loadDoc(db, id) {
    return this.db.read(db, id).then(doc => {
      this._dataService['records'] = [];
      this._dataService['data'] = this._dataService.clean(doc);
      this._dataService.options.ready = true;
      return doc
    })
  }

  saveDoc(db, data) {
    let data_cleaned = this._dataService.clean(data);
    return this.countDocs(db).then(count => {
      if (count == 0) {
        return this.db.create(db, data_cleaned)
          .then(res => {
            this._dataService.data['_id'] = res.id;
            this._navigationService.routerOptions({})
          })
      } else {
        this.hashDocs(db).then(docsHash => {
          if (docsHash.indexOf(data_cleaned['hash']) != -1) {
            return this.db.update(db, data_cleaned)
          } else {
            return this.db.create(db, data_cleaned)
              .then(res => {
                this._dataService.data['_id'] = res.id;
                this._navigationService.routerOptions({})
              })
          }
        })
      }
    })
  }

  deleteDoc(db, id) {
    this._navigationService.router.navigateByUrl('/view')
    return this.db.delete(db, id)
  }

  sortByProperty(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a: any, b: any) => {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }

  sortByDate(key) {
    return (a: any, b: any) => {
      var dateB: any = new Date(b[key]);
      var dateA: any = new Date(a[key]);
      return dateB - dateA;
    }
  }
}
