import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-value-slider-inline',
  templateUrl: './value-slider-inline.component.html',
  styleUrls: ['./value-slider-inline.component.scss']
})
export class ValueSliderInlineComponent implements OnInit {
  @Input() value: number;
  @Input() options: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onChange(event: any): void {
    this.valueChange.emit(this.value);
  }

  onSlide(event: any): void {
    this.value = event.value;
  }
}
