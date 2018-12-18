import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


import {
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-value-slider',
  templateUrl: './value-slider.component.html',
  styleUrls: ['./value-slider.component.css']
})
export class ValueSliderComponent implements OnInit {
  @Input() model: any;
  @Input() id: any;
  @Input() value: any;
  @Input() options: any = {};
  @Output() change = new EventEmitter;

  public faEllipsisV = faEllipsisV;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  onChange(value) {
    // console.log('Change value slider')
    let isNumber = typeof(value) == 'number';
    let isString = typeof(value) == 'string' && value.length > 0;
    this.value =  isNumber || isString  ? parseFloat(value) : this.options.value;
    this.change.emit(this.value);
  }

  setDefaultValue() {
    this.value = parseFloat(this.options.value);
    this.change.emit(this.value);
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
