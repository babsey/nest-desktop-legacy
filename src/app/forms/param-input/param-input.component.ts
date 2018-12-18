import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-param-input',
  templateUrl: './param-input.component.html',
  styleUrls: ['./param-input.component.css']
})
export class ParamInputComponent implements OnInit {
  @Input() view: any;
  @Input() model: any;
  @Input() id: any;
  @Input() value: any;
  @Input() options: any;
  @Output() change = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onChange(value) {
    // console.log('Change value')
    this.change.emit(value)
  }
}
