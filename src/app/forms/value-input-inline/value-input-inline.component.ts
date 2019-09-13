import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-value-input-inline',
  templateUrl: './value-input-inline.component.html',
  styleUrls: ['./value-input-inline.component.scss']
})
export class ValueInputInlineComponent implements OnInit {
  @Input() value: any;
  @Input() options: any = {};
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  onChange(value) {
    let isString = typeof(value) == 'string' && value.length > 0;
    this.value =  isString ? Number(value) : this.options.value;
    this.valueChange.emit(this.value)
  }

  setDefaultValue() {
    this.value = Number(this.options.value);
    this.valueChange.emit(this.value)
  }

}
