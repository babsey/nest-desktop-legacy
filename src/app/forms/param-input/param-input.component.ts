import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-param-input',
  templateUrl: './param-input.component.html',
  styleUrls: ['./param-input.component.css']
})
export class ParamInputComponent implements OnInit {
  @Input() id: string;
  @Input() model: string;
  @Input() options: any;
  @Input() params: any = {};
  @Input() view: string;
  @Output() paramChange = new EventEmitter;

  constructor() { }

  ngOnInit() {
    if (this.params[this.id] == undefined || this.params[this.id] == '') {
      this.params[this.id] = this.options.value;
    }
  }

  onChange(value) {
    // console.log('Change param in param input')
    if (value == undefined || value == '') {
      value = this.options.value;
    }
    this.params[this.id] = value;
    this.paramChange.emit()
  }
}
