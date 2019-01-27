import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


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
  @Output() valueChange = new EventEmitter;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  onChange(event) {
    this.value = 'target' in event ? event.target.value : event.value;
    this.valueChange.emit(this.value);
  }

  setDefaultValue() {
    this.value = parseFloat(this.options.value);
    this.valueChange.emit(this.value);
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
