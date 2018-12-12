import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {
  faEllipsisV,
  faEraser,
 } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-value-slider',
  templateUrl: './value-slider.component.html',
  styleUrls: ['./value-slider.component.css']
})
export class ValueSliderComponent implements OnInit {
  @Input() id: any;
  @Input() value: any;
  @Input() options: any = {};
  @Output() change = new EventEmitter;

  public faEllipsisV = faEllipsisV;
  public faEraser = faEraser;

  constructor() {
  }

  ngOnInit() {
  }

  onChange(event) {
    // console.log('Change value slider')
    if (event.value != undefined) {
      this.value = parseFloat(event.value);
    } else if (event.target.value != undefined) {
      this.value = parseFloat(event.target.value);
    } else {
      this.value = parseFloat(this.options.value);
    }
    this.change.emit(this.value);
  }

  setDefaultValue() {
    this.value = parseFloat(this.options.value);
    this.change.emit(this.value);
  }
}
