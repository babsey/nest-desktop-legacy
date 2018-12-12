import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-ticks-slider',
  templateUrl: './ticks-slider.component.html',
  styleUrls: ['./ticks-slider.component.css']
})
export class TicksSliderComponent implements OnInit, OnChanges {
  @Input() id: any;
  @Input() thumbLabel: any = false;
  @Input() value: any;
  @Input() options: any = {};
  @Output() change = new EventEmitter;
  public idx: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.idx = this.options.viewSpec.ticks.indexOf(this.value);
  }

  onChange(event) {
    this.idx = event.value;
    this.value = this.options.viewSpec.ticks[this.idx];
    this.change.emit(this.value);
  }

  displayWith(ticks) {
    return (idx) => ticks[idx]
  }
}
