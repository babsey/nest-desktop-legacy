import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { faEraser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-value-input',
  templateUrl: './value-input.component.html',
  styleUrls: ['./value-input.component.css']
})
export class ValueInputComponent implements OnInit {
  @Input() id: any;
  @Input() value: any;
  @Input() options: any = {};
  @Output() change = new EventEmitter;

  public faEraser = faEraser;

  constructor() {
  }

  ngOnInit() {
  }

  onChange(event) {
    this.value = parseFloat(event.target.value || this.options.value);
    this.change.emit(this.value)
  }

  setDefaultValue() {
    this.value = parseFloat(this.options.value);
    this.change.emit(this.value)
  }

}
