import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-param-input',
  templateUrl: './param-input.component.html',
  styleUrls: ['./param-input.component.css']
})
export class ParamInputComponent implements OnInit {
  @Input() view: any;
  @Input() model: any;
  @Input() params: any;
  @Input() id: any;
  @Input() options: any;
  @Output() paramChange = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onChange(value) {
    // console.log('Change param in param input')
    this.params[this.id] = value || this.options.value;
    this.paramChange.emit()
  }
}
