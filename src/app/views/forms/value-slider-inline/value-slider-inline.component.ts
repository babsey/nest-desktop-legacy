import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-value-slider-inline',
  templateUrl: './value-slider-inline.component.html',
  styleUrls: ['./value-slider-inline.component.scss']
})
export class ValueSliderInlineComponent implements OnInit {
  @Input() options: any;
  @Input() value: number;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onChange(event: any): void {
    this.valueChange.emit(this.value);
  }

  onSlide(event: any): void {
    this.value = event.value;
  }
}
