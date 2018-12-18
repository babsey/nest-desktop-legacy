import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfigService } from '../../config/config.service';

@Component({
  selector: 'app-forms-config-dialog',
  templateUrl: './forms-config-dialog.component.html',
  styleUrls: ['./forms-config-dialog.component.css']
})
export class FormsConfigDialogComponent implements OnInit {
  public options: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _configService: ConfigService,
    public dialogRef: MatDialogRef<FormsConfigDialogComponent>,
  ) {
  }

  ngOnInit() {
    this.options = JSON.parse(JSON.stringify(this._configService.config.nest.model[this.data.model].options[this.data.id]));
  }

  valueChanged(event) {
    var value = event.target.value;
    var ticks = value.split(',');
    ticks = ticks.map(d => parseFloat(d));
    this.options.viewSpec.ticks = ticks;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this._configService.config.nest.model[this.data.model].options[this.data.id] = this.options;
    this._configService.save('nest', this._configService.config.nest);
    this.dialogRef.close();
  }

}
