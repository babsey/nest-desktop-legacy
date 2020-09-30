import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-ticks-slider-inline',
  templateUrl: './ticks-slider-inline.component.html',
  styleUrls: ['./ticks-slider-inline.component.scss']
})
export class TicksSliderInlineComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() value: number;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  private _idx: number;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this._idx = this.options.ticks.indexOf(this.value);
  }

  get idx(): number {
    return this._idx;
  }

  onChange(event: any) {
    this.value = Number(this.options.ticks[event.value]);
    this.valueChange.emit(this.value);
  }

  displayWith(): any {
    return (idx: number): string[] => this.options.ticks[idx];
  }
}
