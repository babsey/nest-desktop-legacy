import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ModelService } from '../../model/model.service';

@Component({
  selector: 'app-forms-config-dialog',
  templateUrl: './forms-config-dialog.component.html',
  styleUrls: ['./forms-config-dialog.component.scss']
})
export class FormsConfigDialogComponent implements OnInit {
  public options: any;
  private idx: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _modelService: ModelService,
    public dialogRef: MatDialogRef<FormsConfigDialogComponent>,
  ) {
  }

  ngOnInit() {
    // console.log(this.data)
    var configModel = this._modelService.models[this.data.model];
    var params = configModel['params'].find(param => param.id == this.data.id);
    this.idx = configModel['params'].map(param => param.id).indexOf(params.id);
    this.options = Object.assign({}, params);
    // this.options = params;
  }

  valueChanged(event) {
    var value = event.target.value;
    var ticks = value.split(',');
    ticks = ticks.map(d => parseFloat(d));
    this.options.ticks = ticks;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this._modelService.config(this.data.model).params[this.idx] = this.options;
    // this._modelService.save(this.options);
    this.dialogRef.close();
  }

}
