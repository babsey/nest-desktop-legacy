import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-value-slider-popup',
  templateUrl: './value-slider-popup.component.html',
  styleUrls: ['./value-slider-popup.component.scss']
})
export class ValueSliderPopupComponent implements OnInit {
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
}
