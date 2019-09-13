import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-value-slider-popup',
  templateUrl: './value-slider-popup.component.html',
  styleUrls: ['./value-slider-popup.component.scss']
})
export class ValueSliderPopupComponent implements OnInit {
  @Input() model: string;
  @Input() options: any;
  @Input() value: number;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
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
