import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data/data.service';
import { GeneratorService } from '../../services/generator/generator.service';

import { ArrayGeneratorDialogComponent } from '../array-generator-dialog/array-generator-dialog.component';
import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-array-input',
  templateUrl: './array-input.component.html',
  styleUrls: ['./array-input.component.css']
})
export class ArrayInputComponent implements OnInit {
  @Input() model: any;
  @Input() id: any;
  @Input() value: any;
  @Input() options: any = {};
  @Output() change = new EventEmitter;


  constructor(
    private _dataService: DataService,
    private _generatorService: GeneratorService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onChange(event) {
    let value = event.target.value;
    if (value.length == 0) {
      this.change.emit([])
    } else {
      let valueArray = event.target.value.split(",");
      this.value = valueArray.map(d => parseFloat(d));
      this.change.emit(this.value)
    }
  }

  openGeneratorDialog(): void {
    const dialogRef = this.dialog.open(ArrayGeneratorDialogComponent);

    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        d.end = d.end != -1 ? d.end : this._dataService.data.simulation.time;
        d.max = d.max != -1 ? d.max : this._dataService.data.simulation.time;
        let resolution = this._dataService.data.kernel.resolution || 1.0
        d.toFixed = resolution >= 1 ? -1 : String(resolution).split('.')[1].length;
        this.value = this._generatorService.generate(d);
        this.change.emit(this.value)
      }
    });
  }

  setDefaultValue() {
    this.change.emit(this.options.value)
  }

  openConfigDialog() {
    if (this.id && this.model) {
      this.dialog.open(FormsConfigDialogComponent, {
        data: {
          id: this.id,
          model: this.model,
        }
      });
    }
  }

}
