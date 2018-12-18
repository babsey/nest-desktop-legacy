import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


import {
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-ticks-slider',
  templateUrl: './ticks-slider.component.html',
  styleUrls: ['./ticks-slider.component.css']
})
export class TicksSliderComponent implements OnInit, OnChanges {
  @Input() model: any;
  @Input() id: any;
  @Input() options: any = {};
  @Input() thumbLabel: any = false;
  @Input() value: any;
  @Output() change = new EventEmitter;
  public idx: any;

  public faEllipsisV = faEllipsisV;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.idx = this.options.viewSpec.ticks.indexOf(this.value);
  }

  onChange(idx) {
    this.value = this.options.viewSpec.ticks[idx];
    this.change.emit(this.value);
  }

  displayWith(ticks) {
    return (idx) => ticks[idx]
  }

  setDefaultValue() {
    this.value = this.options.value;
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
