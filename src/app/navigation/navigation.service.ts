import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public options: any = {
    source: 'network',
    sidenavListOpened: true,
  };

  constructor(
    private _dataService: DataService,
    public router: Router,
  ) { }

  isPage(name) {
    let url = this.router.routerState.snapshot.url;
    return url.endsWith(name);
  }

  isMainPage() {
    let url = this.router.routerState.snapshot.url;
    return url == '/';
  }

  routerLink(name, options={}) {
    if (this._dataService.options.ready) {
      let source = options['source'] || this.options.source;
      let id = options['id'] || this._dataService.data._id;
      return '/' + source + '/' + id + '/' + name;
    } else {
      return '/' + name
    }
  }

  routerOptions(options) {
    let url = this.router.routerState.snapshot.url.split('/');
    let name = url[url.length-1];
    let source = options['source'] || this.options.source;
    let id = options['id'] || this._dataService.data._id;
    return '/' + source + '/' + id + '/' + name;
  }

}
