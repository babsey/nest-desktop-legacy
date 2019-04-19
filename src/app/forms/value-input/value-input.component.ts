import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-value-input',
  templateUrl: './value-input.component.html',
  styleUrls: ['./value-input.component.css']
})
export class ValueInputComponent implements OnInit {
  @Input() value: any;
  @Input() options: any = {};
  @Output() valueChange = new EventEmitter;

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
