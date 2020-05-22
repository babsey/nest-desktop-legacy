import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { GeneratorService } from '../../services/generator/generator.service';
import { ArrayGeneratorDialogComponent } from '../array-generator-dialog/array-generator-dialog.component';


@Component({
  selector: 'app-array-input-popup',
  templateUrl: './array-input-popup.component.html',
  styleUrls: ['./array-input-popup.component.scss']
})
export class ArrayInputPopupComponent implements OnInit {
  @Input() options: any;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private _generatorService: GeneratorService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // console.log('Init array input')
  }

  stringify(value: any): string {
    return JSON.stringify(value || []);
  }

  onChange(valueJSON: string): void {
    // console.log('Change value of array input')
    var value = JSON.parse(valueJSON) || [];
    this.valueChange.emit(value);
  }

  openGeneratorDialog(): void {
    const dialogRef = this.dialog.open(ArrayGeneratorDialogComponent);

    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        d.end = d.end != -1 ? d.end : 1000.;
        d.max = d.max != -1 ? d.max : 1000.;
        let resolution = 0.1;
        d.toFixed = resolution >= 1 ? -1 : String(resolution).split('.')[1].length;
        this.value = this._generatorService.generate(d);
        this.valueChange.emit(this.value)
      }
    });
  }

}
