import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Model } from '../../../components/model/model';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-config-dialog',
  templateUrl: './model-config-dialog.component.html',
  styleUrls: ['./model-config-dialog.component.scss']
})
export class ModelConfigDialogComponent implements OnInit {
  private _model: Model;
  private _param: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ModelConfigDialogComponent>,
    private _modelService: ModelService,
  ) { }

  ngOnInit() {
    this._model = this._data.model;
    this._param = Object.assign({}, this._model.getParameter(this._data.param));
  }

  get model(): Model {
    return this._model;
  }

  get param(): any {
    return this._param;
  }

  cancel(): void {
    this._dialogRef.close();
  }

  save(): void {
    this._model.updateParameter(this._param);
    // this._model.save();
    this._dialogRef.close();
  }

  valueChanged(event: any): void {
    const value: string = event.target.value;
    let ticks: any[] = value.split(',');
    ticks = ticks.map((tick: string) => parseFloat(tick));
    this._param.ticks = ticks;
  }

}
