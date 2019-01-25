import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-value-input',
  templateUrl: './value-input.component.html',
  styleUrls: ['./value-input.component.css']
})
export class ValueInputComponent implements OnInit {
  @Input() model: any;
  @Input() id: any;
  @Input() value: any;
  @Input() options: any = {};
  @Output() change = new EventEmitter;


  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  onChange(value) {
    let isString = typeof(value) == 'string' && value.length > 0;
    this.value =  isString  ? parseFloat(value) : this.options.value;
    this.change.emit(this.value)
  }

  setDefaultValue() {
    this.value = parseFloat(this.options.value);
    this.change.emit(this.value)
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
