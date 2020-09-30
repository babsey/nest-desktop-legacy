import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-value-input-popup',
  templateUrl: './value-input-popup.component.html',
  styleUrls: ['./value-input-popup.component.scss']
})
export class ValueInputPopupComponent implements OnInit {
  @Input() options: any;
  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onChange(value: any): void {
    const isString = typeof(value) === 'string' && value.length > 0;
    this.value =  isString ? Number(value) : this.options.value;
    this.valueChange.emit(this.value);
  }

}
