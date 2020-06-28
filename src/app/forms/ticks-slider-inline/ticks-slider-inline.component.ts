import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-ticks-slider-inline',
  templateUrl: './ticks-slider-inline.component.html',
  styleUrls: ['./ticks-slider-inline.component.scss']
})
export class TicksSliderInlineComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() value: number;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  public idx: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.idx = this.options.ticks.indexOf(this.value);
  }

  onChange(event: any): void {
    this.value = Number(this.options.ticks[event.value]);
    this.valueChange.emit(this.value);
  }

  displayWith(): any {
    return (idx: number): string[] => this.options.ticks[idx];
  }
}
