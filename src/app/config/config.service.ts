import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { timeout, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

declare function require(url: string);


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public options: any = {
    editing: false,
    NEST: {
      running: false,
      data: {},
    }
  };
  public config: any = {};
  public selectedModel: any = {};
  public snackBarRef: any;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {
    window['config'] = this.config;
  }

  init() {
    // console.log('Init config service')
    this.syncAppConfig()
    this.syncNESTConfig()
  }

  syncAppConfig() {
    this.syncFromFile('app', [
      'app',
      'chart',
      'colors',
      'controller',
      'db',
      'groups',
      'nest',
      'simulation',
      'sketch',
      'slider',
      'user',
    ])
  }

  syncNESTConfig() {
    this.syncFromFile('nest', [
      'connection',
      'kernel',
      'label',
      'model',
      'node',
      'receptor',
      'simulation',
    ])
  }

  syncFromFile(name, files) {
    if (!localStorage.getItem('_nestdesktop_config_' + name)) {
      console.log('Sync from file in ' + name)
      var config = {};
      for (var idx in files) {
        var filename = files[idx];
        var configData = require('../../config/' + name + '/' + filename + '.json');
        config[files[idx]] = configData;
      }
      this.save(name, config)
    }
    this.load(name)
  }

  resetAppConfig() {
    delete localStorage['_nestdesktop_config_app'];
    this.syncAppConfig()
  }

  save(name, config) {
    let configJSON = JSON.stringify(config);
    localStorage.setItem('_nestdesktop_config_' + name, configJSON);
  }

  load(name) {
    let configJSON = localStorage.getItem('_nestdesktop_config_' + name);
    let configData = JSON.parse(configJSON);
    this.config[name] = configData;
  }

  edit(mode = null) {
    this.options.editing = (mode != null) ? mode : !this.options.editing;
    if (this.options.editing) {
      this.snackBarRef = this.snackBar.open("The editing mode is on.", 'Close');
      this.snackBarRef.onAction().subscribe(() => this.edit(false));
    } else if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  getModels(element_type = null) {
    let items = this.config.nest.model;
    if (element_type) {
      let itemsByType = {}
      for (var key in items) {
        if (items[key].element_type == element_type) {
          itemsByType[key] = items[key]
        }
      }
      items = itemsByType;
    }
    return items
  }

  list(element_type) {
    let items = {};
    if (['neuron', 'stimulator', 'recorder', 'synapse'].indexOf(element_type) != -1) {
      items = this.getModels(element_type);
    } else {
      items = this.config.nest[element_type];
    }
    return Object.keys(items)
  }

  listModels(element_type = null, sort = true) {
    let items = this.getModels(element_type)
    items = Object.keys(items)
    if (sort) {
      items.sort()
    }
    return items
  }

  selectModel(model) {
    var models = this.config.nest.model;
    this.selectedModel = models[model];
  }

  addModel(element_type, id) {
    var model = {
      element_type: element_type,
      label: '',
      params: [],
      options: {}
    };
    this.selectedModel = model;
    this.config.nest.model[id] = model;
    this.save('nest', this.config.nest)
  }

  removeModel(id) {
    delete this.config.nest.model[id];
    this.save('nest', this.config.nest)
    this.selectedModel = null;
  }

  addParam(id, value) {
    var param = {
      label: id,
      value: value,
      level: 1,
      view: 'valueInput',
      viewSpec: {
        step: 1,
      }
    }
    this.selectedModel.options[id] = param;
    this.selectedModel.params.push(id)
    this.selectedModel.params.sort()
    this.save('nest', this.config.nest)
  }

  removeParam(id) {
    delete this.selectedModel.options[id];
    var index = this.selectedModel.params.indexOf(id)
    if (index != -1) {
      this.selectedModel.params.splice(index, 1);
    }
    this.save('nest', this.config.nest)
  }


  deleteAll() {
    localStorage.clear();
  }

  urlRoot() {
    var nestServer = this.config.app.nest['server'];
    return 'http://' + nestServer['host'] + ':' + nestServer['port'];
  }

  check() {
    // console.log('Check')
    this.options.NEST.running = false;
    this.options.NEST.request = 'failed';
    this.http.get(this.urlRoot())
      .pipe(
        timeout(1000), catchError(e => {
          return of(e);
        })
      )
      .subscribe(res => {
        this.options.NEST.request = 'ok'
        if ('nest' in res) {
          this.options.NEST.running = true;
          this.options.NEST.data = res;
        }
      })
  }

}
