import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GeneratorService } from '../../../services/generator/generator.service';

import { ArrayGeneratorDialogComponent } from '../array-generator-dialog/array-generator-dialog.component';


@Component({
  selector: 'app-array-input-inline',
  templateUrl: './array-input-inline.component.html',
  styleUrls: ['./array-input-inline.component.scss']
})
export class ArrayInputInlineComponent implements OnInit {
  @Input() options: any;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  private _active = false;

  constructor(
    private _generatorService: GeneratorService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
    // console.log('Init array input')
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  stringify(value: any): string {
    return JSON.stringify(value || []);
  }

  onChange(event: any): void {
    // console.log('Change value of array input')
    const valueJSON: string = event.target.value;
    const value: any = JSON.parse(valueJSON) || [];
    this.valueChange.emit(value);
  }

  openGeneratorDialog(): void {
    const dialogRef = this._dialog.open(ArrayGeneratorDialogComponent);

    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        d.end = d.end !== -1 ? d.end : 1000.;
        d.max = d.max !== -1 ? d.max : 1000.;
        const resolution = 0.1;
        d.toFixed = resolution >= 1 ? -1 : String(resolution).split('.')[1].length;
        this.value = this._generatorService.generate(d);
        this.valueChange.emit(this.value);
      }
    });
  }

}
