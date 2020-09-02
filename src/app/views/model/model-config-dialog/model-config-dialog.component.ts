import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Model } from '../../../components/model/model';
import { Parameter } from '../../../components/parameter';

import { ModelService } from '../../../services/model/model.service';


@Component({
  selector: 'app-model-config-dialog',
  templateUrl: './model-config-dialog.component.html',
  styleUrls: ['./model-config-dialog.component.scss']
})
export class ModelConfigDialogComponent implements OnInit {
  public options: any;
  private _idx: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modelService: ModelService,
    public dialogRef: MatDialogRef<ModelConfigDialogComponent>,
  ) {
  }

  ngOnInit() {
    // console.log(this.data)
    const model: Model = this.modelService.getModel(this.data.model);
    this._idx = model.params.map((param: Parameter) => param.id).indexOf(this.data.param);
    this.options = Object.assign({}, model.params[this._idx]);
    // this.options = params;
  }

  valueChanged(event: any): void {
    const value: string = event.target.value;
    let ticks: any[] = value.split(',');
    ticks = ticks.map(d => parseFloat(d));
    this.options.ticks = ticks;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const model: Model = this.modelService.getModel(this.data.model);
    model.params[this._idx] = this.options;
    // this._modelService.save(this.options);
    this.dialogRef.close();
  }

}
