import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-value-input-popup',
  templateUrl: './value-input-popup.component.html',
  styleUrls: ['./value-input-popup.component.scss']
})
export class ValueInputPopupComponent implements OnInit {
  @Input() model: string;
  @Input() options: any;
  @Input() value: any;
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

  openConfigDialog() {
    if (this.options.id && this.model) {
      this.dialog.open(FormsConfigDialogComponent, {
        data: {
          id: this.options.id,
          model: this.model,
        }
      });
    }
  }

}
