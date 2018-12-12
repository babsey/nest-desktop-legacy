import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatTableDataSource } from '@angular/material';

import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public view = 'enabled';
  public element_type: any = 'all';
  public searchTerm: string = '';
  public selectedModel: any = null;
  public helptext: any = '';
  public defaults: any = {};
  public progress: boolean = false;

  constructor(
    private _configService: ConfigService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  selectModel(model) {
    this.selectedModel = model;
  }

  getModels() {
    var urlRoot = this._configService.urlRoot()
    return this.http.get(urlRoot + '/api/nest/Models')
  }

  getDoc(model) {
    var urlRoot = this._configService.urlRoot()

    var data = {
      'obj': model,
      'return_text': 'true',
    };
    this.progress = true;
    setTimeout(() => {
      this.http.post(urlRoot + '/api/nest/help', data).subscribe(res => {
        this.progress = false;
        if ('error' in res) {
          this.snackBar.open(res['error'], 'Ok');
        } else {
          this.helptext = res['response']['data'];
        }
      },
        error => {
          this.progress = false;
          this.snackBar.open(JSON.stringify(error['error']), 'Ok');
        }
      )
    }, 500)
  }

  getDefaults(model) {
    var urlRoot = this._configService.urlRoot()
    var data = {
      'model': model,
    };
    this.defaults = {};
    this.progress = true;
    setTimeout(() => {
      this.http.post(urlRoot + '/api/nest/GetDefaults', data)
        .subscribe(data => {
          this.progress = false;
          this.defaults = data['response']['data'];
        })
    }, 500)
  }
}
