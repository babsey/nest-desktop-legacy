import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';

import { FormsConfigDialogComponent } from '../forms-config-dialog/forms-config-dialog.component';


@Component({
  selector: 'app-ticks-slider-inline',
  templateUrl: './ticks-slider-inline.component.html',
  styleUrls: ['./ticks-slider-inline.component.scss']
})
export class TicksSliderInlineComponent implements OnInit, OnChanges {
  @Input() model: string = '';
  @Input() id: string = '';
  @Input() options: any = {};
  @Input() thumbLabel: boolean = false;
  @Input() value: number;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  public idx: number;


  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.idx = this.options.ticks.indexOf(this.value);
  }

  onChange(idx) {
    this.value = Number(this.options.ticks[idx]);
    this.valueChange.emit(this.value);
  }

  displayWith(ticks) {
    return (idx) => ticks[idx]
  }

  setDefaultValue() {
    this.value = this.options.value;
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
