import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-input-popup',
  templateUrl: './input-popup.component.html',
  styleUrls: ['./input-popup.component.scss']
})
export class InputPopupComponent implements OnInit {
  @Input() model: string;
  @Input() options: any;
  @Input() value: any;
  @Input() view: string;
  @Output() inputClick: EventEmitter<any> = new EventEmitter();
  @Output() inputChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  onValueChange(value) {
    // console.log('Change param in param input')
    if (value == undefined || value == '') {
      value = this.options.value;
    }
    this.inputChange.emit(value)
  }

  onValueClick() {
    this.inputClick.emit()
  }
}
