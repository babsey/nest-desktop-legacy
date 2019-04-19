import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-param-value-slider',
  templateUrl: './param-value-slider.component.html',
  styleUrls: ['./param-value-slider.component.css']
})
export class ParamValueSliderComponent implements OnInit {
  @Input() id: string = '';
  @Input() model: string = '';
  @Input() options: any = {};
  @Input() value: number;
  @Output() valueChange = new EventEmitter;
  public showSlider: boolean = false;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  onChange(event) {
    this.valueChange.emit(this.value);
  }

  setDefaultValue() {
    this.value = Number(this.options.value);
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
