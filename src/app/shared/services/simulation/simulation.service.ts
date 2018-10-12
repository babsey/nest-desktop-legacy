import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { ChartService } from '../chart/chart.service';
import { ConfigService } from '../config/config.service';
import { DataService } from '../data/data.service';
import { SketchService } from '../sketch/sketch.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private snackBarRef: any;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private _chartService: ChartService,
    private _configService: ConfigService,
    private _dataService: DataService,
    private _sketchService: SketchService,
  ) { }

  run(resetChart = false) {
    var urlRoot = this._configService.urlRoot();
    this._sketchService.options.drawing = false;
    var data_cleaned = this._dataService.clean(this._dataService.data);
    this.snackBarRef = this.snackBar.open('The simulation is running. Please wait.', null, {});
    if (resetChart) {
      this._dataService['records'] = [];
    }
    this.http.post(urlRoot + '/simulate', data_cleaned).subscribe(res => {
      if ('error' in res) {
        this.snackBarRef = this.snackBar.open(res['error'], 'Ok');
      } else {
        this._dataService['records'] = res['data']['records'];
        this._chartService.options.show = true;
        this._chartService.update.emit()
        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
        }
      }
    },
      error => {
        this.snackBarRef = this.snackBar.open(error['error'], 'Ok');
      }
    )
  }

}
